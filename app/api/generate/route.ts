import OpenAI, { toFile } from "openai";
import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { PROMPT, blobPath } from "@/lib/site";

export const maxDuration = 120; // 画像生成は数十秒かかる

export async function POST(req: Request) {
  const form = await req.formData();
  const photo = form.get("photo");
  if (!(photo instanceof File) || !photo.type.startsWith("image/") || photo.size > 4_000_000) {
    return Response.json({ error: "4MB以下の画像を選んでください" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPENAI_KEY;
  if (!apiKey) {
    return Response.json({ error: "サーバーに OPENAI_API_KEY が設定されていません" }, { status: 500 });
  }

  let b64: string;
  try {
    const res = await new OpenAI({ apiKey }).images.edit({
      model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2",
      image: await toFile(photo, "face.jpg", { type: photo.type }),
      prompt: PROMPT,
      size: "1024x1536",
      quality: "medium",
    });
    const out = res.data?.[0]?.b64_json;
    if (!out) throw new Error("画像が返ってきませんでした");
    b64 = out;
  } catch (e) {
    console.error(e);
    // 原因（キー不正・組織未認証・残高不足・安全フィルタなど）をそのまま画面に出す
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ error: `画像生成に失敗しました: ${msg}` }, { status: 500 });
  }

  // Blob 未接続でも画像だけは見せる（この場合シェア用ページは作れない）
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ image: `data:image/png;base64,${b64}` });
  }

  try {
    // 元の顔写真は保存せず、生成結果だけを公開URLに置く（シェア・OGP用）
    const id = randomUUID().replaceAll("-", "");
    await put(blobPath(id), Buffer.from(b64, "base64"), {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: false,
    });
    return Response.json({ id });
  } catch (e) {
    console.error(e);
    return Response.json({ image: `data:image/png;base64,${b64}` });
  }
}
