import express, { type Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes";

let serverlessHandler: any;

export const handler = async (event: any, context: any) => {
  if (!serverlessHandler) {
    const app = express();

    // Parse JSON bodies with a generous limit for base64 image data
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: false }));

    // Rewrite path mapping: handle both prefixed and prefix-stripped Netlify function paths
    app.use((req, _res, next) => {
      if (req.url.startsWith("/.netlify/functions/api")) {
        req.url = req.url.replace("/.netlify/functions/api", "/api");
      } else if (!req.url.startsWith("/api")) {
        req.url = `/api${req.url}`;
      }
      next();
    });

    // Register all Express routes (chat, generate, gallery)
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
