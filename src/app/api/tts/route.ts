import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const CACHE_DIR = path.join(process.cwd(), ".cache", "tts");

async function readApiKey(): Promise<string | null> {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  try {
    const p = path.join(process.cwd(), "11labs.md");
    const raw = (await fs.readFile(p, "utf-8")).trim();
    return raw || null;
  } catch {
    return null;
  }
}

function buildCacheKey(text: string, voiceId: string, modelId: string): string {
  return crypto
    .createHash("sha256")
    .update(`${voiceId}::${modelId}::${text}`)
    .digest("hex");
}

async function readFromCache(cacheKey: string): Promise<Buffer | null> {
  try {
    const filePath = path.join(CACHE_DIR, `${cacheKey}.mp3`);
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
}

async function writeToCache(cacheKey: string, data: ArrayBuffer) {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const filePath = path.join(CACHE_DIR, `${cacheKey}.mp3`);
    await fs.writeFile(filePath, Buffer.from(data));
  } catch {
    // cache write failures should not break TTS
  }
}

async function requestElevenLabsAudio(
  key: string,
  text: string,
  voiceId: string,
  modelId: string
): Promise<ArrayBuffer> {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": key,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: { stability: 0.45, similarity_boost: 0.75 },
    }),
    cache: "no-store",
  });

  if (!r.ok) {
    const errText = await r.text();
    throw new Error(errText || "ElevenLabs request failed");
  }
  return await r.arrayBuffer();
}

export async function POST(req: Request) {
  const key = await readApiKey();
  if (!key) {
    return NextResponse.json(
      { error: "Missing ElevenLabs API key (set ELEVENLABS_API_KEY)" },
      { status: 400 }
    );
  }

  const body = (await req.json().catch(() => null)) as { text?: string } | null;
  const text = body?.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID || "BqljjWyTnrioXPCNkCd4";
  const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
  const fallbackModelId = "eleven_turbo_v2_5";
  const cacheKey = buildCacheKey(text, voiceId, modelId);

  const cached = await readFromCache(cacheKey);
  if (cached) {
    return new NextResponse(new Uint8Array(cached), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-TTS-Cache": "HIT",
      },
    });
  }

  try {
    const audio = await requestElevenLabsAudio(key, text, voiceId, modelId);
    await writeToCache(cacheKey, audio);
    return new NextResponse(new Uint8Array(audio), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-TTS-Cache": "MISS",
      },
    });
  } catch (e1) {
    try {
      const audio = await requestElevenLabsAudio(key, text, voiceId, fallbackModelId);
      await writeToCache(cacheKey, audio);
      return new NextResponse(new Uint8Array(audio), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-TTS-Cache": "MISS_FALLBACK_MODEL",
        },
      });
    } catch (e2) {
      const detail = e2 instanceof Error ? e2.message : String(e2 ?? e1);
      return NextResponse.json(
        { error: "ElevenLabs request failed", detail },
        { status: 502 }
      );
    }
  }
}

