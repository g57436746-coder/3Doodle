import express, { type Request, Response, NextFunction } from "express";
import { getStore } from "@netlify/blobs";
import { nanoid } from "nanoid";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes";
import { generateImageSchema, type GalleryItem } from "../../shared/schema";

let serverlessHandler: any;

type GenerationJob = {
  status: "processing" | "complete" | "failed";
  created: string;
  updated: string;
  galleryItem?: GalleryItem;
  message?: string;
};

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

function getJobsStore() {
  return getStore({ name: "3doodle-generation-jobs", consistency: "strong" });
}

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  };
}

function getApiPath(event: any): string {
  const path = event.path || event.rawUrl || "";

  if (path.startsWith("/.netlify/functions/api")) {
    return path.replace("/.netlify/functions/api", "/api");
  }

  return path.startsWith("/api") ? path : `/api${path}`;
}

function getJsonBody(event: any): unknown {
  const body = event.body || "{}";
  const text = event.isBase64Encoded
    ? Buffer.from(body, "base64").toString("utf8")
    : body;

  return JSON.parse(text);
}

function getOrigin(event: any): string {
  const headers = event.headers || {};
  const host = headers.host || headers.Host;
  const protocol = headers["x-forwarded-proto"] || headers["X-Forwarded-Proto"] || "https";

  return `${protocol}://${host}`;
}

async function createGenerationJob(event: any) {
  const validatedData = generateImageSchema.parse(getJsonBody(event));
  const jobId = nanoid();
  const now = new Date().toISOString();
  const store = getJobsStore();
  const job: GenerationJob = {
    status: "processing",
    created: now,
    updated: now,
  };

  await store.setJSON(`jobs/${jobId}`, job);
  await store.set(`inputs/${jobId}`, validatedData.imageData);

  const backgroundResponse = await fetch(`${getOrigin(event)}/.netlify/functions/generate-background`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ jobId }),
  });

  if (!backgroundResponse.ok) {
    const message = `Could not start Riverflow generation job (${backgroundResponse.status}).`;
    await store.setJSON(`jobs/${jobId}`, {
      ...job,
      status: "failed",
      updated: new Date().toISOString(),
      message,
    } satisfies GenerationJob);

    return jsonResponse(502, { message });
  }

  return jsonResponse(202, { jobId, status: "processing" });
}

async function getGenerationJob(jobId: string) {
  const job = await getJobsStore().get(`jobs/${jobId}`, { type: "json" }) as GenerationJob | null;

  if (!job) {
    return jsonResponse(404, { message: "Generation job not found." });
  }

  return jsonResponse(200, job);
}

export const handler = async (event: any, context: any) => {
  const apiPath = getApiPath(event);

  if (event.httpMethod === "POST" && apiPath === "/api/generate") {
    try {
      return await createGenerationJob(event);
    } catch (error) {
      return jsonResponse(400, {
        message: error instanceof Error ? error.message : "Invalid generation request.",
      });
    }
  }

  const generationJobMatch = apiPath.match(/^\/api\/generate\/([^/?#]+)$/);
  if (event.httpMethod === "GET" && generationJobMatch?.[1]) {
    return getGenerationJob(generationJobMatch[1]);
  }

  if (!serverlessHandler) {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Rewrite path mapping: handle both prefixed and prefix-stripped Netlify function paths
    app.use((req, res, next) => {
      if (req.url.startsWith("/.netlify/functions/api")) {
        req.url = req.url.replace("/.netlify/functions/api", "/api");
      } else if (!req.url.startsWith("/api")) {
        req.url = `/api${req.url}`;
      }
      next();
    });

    // Register routes
    await registerRoutes(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    serverlessHandler = serverless(app);
  }

  return serverlessHandler(event, context);
};
