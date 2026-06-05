import { getStore } from "@netlify/blobs";
import { nanoid } from "nanoid";
import { generate3DModel } from "../../server/openrouter";
import type { GalleryItem } from "../../shared/schema";

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

async function getExistingJob(jobId: string): Promise<GenerationJob | null> {
  return await getJobsStore().get(`jobs/${jobId}`, { type: "json" }) as GenerationJob | null;
}

async function setJob(jobId: string, job: GenerationJob) {
  await getJobsStore().setJSON(`jobs/${jobId}`, job);
}

function getBody(event: any): { jobId?: string } {
  if (!event.body) {
    return {};
  }

  const text = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  return JSON.parse(text);
}

function createGalleryItem(imageUrl: string): GalleryItem {
  return {
    id: nanoid(),
    objectType: "doodle",
    imageUrl,
    created: new Date().toISOString(),
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message.trim()
    ? error.message
    : "Riverflow generation failed.";
}

async function markFailed(jobId: string, message: string) {
  const existingJob = await getExistingJob(jobId);
  const now = new Date().toISOString();

  await setJob(jobId, {
    status: "failed",
    created: existingJob?.created ?? now,
    updated: now,
    message,
  });
}

export const handler = async (event: any) => {
  const jobId = getBody(event).jobId;

  if (!jobId) {
    return {
      statusCode: 400,
      headers: JSON_HEADERS,
      body: JSON.stringify({ message: "Missing generation job id." }),
    };
  }

  const store = getJobsStore();

  try {
    const imageData = await store.get(`inputs/${jobId}`);

    if (!imageData) {
      await markFailed(jobId, "Generation input was not found. Please try again.");
      return {
        statusCode: 200,
        headers: JSON_HEADERS,
        body: JSON.stringify({ status: "failed" }),
      };
    }

    console.log("Generating 3D model from drawing with Sourceful Riverflow...");
    const imageUrl = await generate3DModel("doodle", imageData);
    const now = new Date().toISOString();
    const existingJob = await getExistingJob(jobId);
    const galleryItem = createGalleryItem(imageUrl);

    await setJob(jobId, {
      status: "complete",
      created: existingJob?.created ?? now,
      updated: now,
      galleryItem,
    });

    await store.delete(`inputs/${jobId}`).catch(() => undefined);

    console.log("Successfully created 3D model for doodle");

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ status: "complete" }),
    };
  } catch (error) {
    console.error("Error generating 3D image in background function:", error);
    await markFailed(jobId, getErrorMessage(error));

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ status: "failed" }),
    };
  }
};
