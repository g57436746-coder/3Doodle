import { OpenRouter } from "@openrouter/agent";
import type { ChatMessage } from "@shared/schema";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const CHAT_MODEL = "openrouter/free";
const IMAGE_MODEL = "sourceful/riverflow-v2.5-pro:free";

const CHAT_SYSTEM_PROMPT =
  "You are 3Doodle's friendly drawing buddy for children. Keep replies short, encouraging, safe, and easy to understand. Help with drawing ideas, simple steps, colors, and what to try next. Never mention API providers or internal model names.";

const OBJECT_DETECTION_PROMPT =
  "Look at this child's doodle and identify the main everyday object. Reply with exactly one simple lowercase noun, such as apple, dog, cat, flower, house, car, sun, or tree. If it is unclear, reply with object.";

export class OpenRouterConfigError extends Error {
  constructor(envVarName: string) {
    super(`Missing required environment variable: ${envVarName}`);
    this.name = "OpenRouterConfigError";
  }
}

type OpenRouterImage = {
  type?: string;
  image_url?: {
    url?: string;
  };
};

type OpenRouterChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<unknown> | null;
      images?: OpenRouterImage[];
    };
  }>;
  error?: {
    message?: string;
  };
};

const fallbackObjects = [
  "apple",
  "dog",
  "cat",
  "flower",
  "house",
  "tree",
  "car",
  "sun",
  "moon",
  "ball",
];

type NetlifyGlobal = typeof globalThis & {
  Netlify?: {
    env?: {
      get: (key: string) => string | undefined;
    };
  };
};

function getEnvValue(key: string): string | undefined {
  const netlifyValue = (globalThis as NetlifyGlobal).Netlify?.env?.get(key);
  return netlifyValue || process.env[key];
}

function getApiKey(envVarName: string): string {
  const apiKey = getEnvValue(envVarName) || getEnvValue("OPENROUTER_API_KEY");

  if (!apiKey) {
    throw new OpenRouterConfigError(envVarName);
  }

  return apiKey;
}

function sanitizeObjectType(value: string | undefined): string {
  const objectType = value
    ?.toLowerCase()
    .replace(/[^a-z\s-]/g, "")
    .trim()
    .split(/\s+/)[0];

  return objectType || "object";
}

function getFallbackObject(): string {
  return fallbackObjects[Math.floor(Math.random() * fallbackObjects.length)] ?? "object";
}

function createFallbackImage(objectType: string): string {
  const label = sanitizeObjectType(objectType);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#fff7ed"/>
  <ellipse cx="512" cy="600" rx="260" ry="90" fill="#fed7aa"/>
  <circle cx="512" cy="430" r="190" fill="#a7f3d0"/>
  <circle cx="445" cy="380" r="34" fill="#2563eb"/>
  <circle cx="579" cy="380" r="34" fill="#2563eb"/>
  <path d="M425 500 Q512 565 599 500" fill="none" stroke="#334155" stroke-width="28" stroke-linecap="round"/>
  <text x="512" y="820" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="#334155">3D ${label}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "3Doodle",
  };
}

async function postOpenRouterChatCompletion(payload: Record<string, unknown>, apiKey: string) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: getHeaders(apiKey),
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as OpenRouterChatResponse;

  if (!response.ok) {
    throw new Error(data.error?.message || `OpenRouter request failed with status ${response.status}`);
  }

  return data;
}

export async function chatWithOpenRouter(messages: ChatMessage[]): Promise<string> {
  const result = await postOpenRouterChatCompletion({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content: CHAT_SYSTEM_PROMPT,
      },
      ...messages.map((message) => ({
        role: message.role === "user" ? "user" : "assistant",
        content: message.content,
      })),
    ],
    max_tokens: 220,
    temperature: 0.7,
    stream: false,
  }, getApiKey("OPENROUTER_CHAT_API_KEY"));

  const content = result.choices?.[0]?.message?.content;
  return typeof content === "string" ? content.trim() : "";
}

export async function detectObjectInDrawing(imageData: string): Promise<string> {
  try {
    const result = await postOpenRouterChatCompletion(
      {
        model: CHAT_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: OBJECT_DETECTION_PROMPT,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData,
                },
              },
            ],
          },
        ],
        max_tokens: 20,
        temperature: 0,
        stream: false,
      },
      getApiKey("OPENROUTER_IMAGE_API_KEY"),
    );

    const content = result.choices?.[0]?.message?.content;
    const text = typeof content === "string" ? content : undefined;

    return sanitizeObjectType(text);
  } catch (error) {
    if (error instanceof OpenRouterConfigError) {
      throw error;
    }

    console.error("Error detecting object with OpenRouter:", error);
    return getFallbackObject();
  }
}

export async function generate3DModel(objectType: string): Promise<string> {
  const cleanObjectType = sanitizeObjectType(objectType);
  const prompt = `Create a photorealistic 3D model of a ${cleanObjectType} for a child-friendly drawing app. Center the object on a clean white studio background with soft lighting, smooth rounded materials, vibrant colors, and a gentle cartoon charm. Make the ${cleanObjectType} clear and recognizable as the only main subject.`;

  try {
    const result = await postOpenRouterChatCompletion(
      {
        model: IMAGE_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image"],
        image_config: {
          aspect_ratio: "1:1",
          image_size: "1K",
          background_mode: "solid",
          background_hex_color: "#ffffff",
          scoring_prompt:
            "Prefer a single clean object, strong silhouette, kid-friendly materials, crisp edges, and even studio lighting.",
        },
        stream: false,
      },
      getApiKey("OPENROUTER_IMAGE_API_KEY"),
    );

    const imageUrl = result.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("OpenRouter did not return an image");
    }

    return imageUrl;
  } catch (error) {
    if (error instanceof OpenRouterConfigError) {
      throw error;
    }

    console.error("Error generating 3D model with OpenRouter:", error);
    return createFallbackImage(cleanObjectType);
  }
}

export function isOpenRouterConfigError(error: unknown): error is OpenRouterConfigError {
  return error instanceof OpenRouterConfigError;
}
