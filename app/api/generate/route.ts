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

  try {
    const res = await new OpenAI().images.edit({
      model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2",
      image: await toFile(photo, "face.jpg", { type: photo.type }),
      prompt: PROMPT,
      size: "1024x1536",
      quality: "medium",
    });
    const b64 = res.data?.[0]?.b64_json;
    if (!b64) throw new Error("no image");

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
    return Response.json({ error: "生成に失敗しました。別の写真で試してください" }, { status: 500 });
  }
}
