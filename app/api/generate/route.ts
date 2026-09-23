import OpenAI, { toFile } from "openai";
import { randomUUID } from "node:crypto";
import { savePng } from "@/lib/blob";
import { renderOg } from "@/lib/og";
import { PROMPT, blobPath, ogPath } from "@/lib/site";

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

  const image = `data:image/png;base64,${b64}`;

  const id = randomUUID().replaceAll("-", "");
  try {
    // 元の顔写真は保存せず、生成結果だけを保存する（シェア・OGP用）。
    // 認証は BLOB_READ_WRITE_TOKEN でも、Vercel の OIDC + BLOB_STORE_ID でもよい（SDK が判断する）
    await savePng(blobPath(id), Buffer.from(b64, "base64"));
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : String(e);
    // Blob 未接続などで保存できなくても画像だけは見せる
    return Response.json({ image, notice: `画像を保存できず、シェア用ページを作れませんでした: ${msg}` });
  }

  // X などのクローラーがすぐ読めるよう、OGP 画像もここで作って保存しておく
  try {
    const og = await renderOg(image);
    await savePng(ogPath(id), Buffer.from(await og.arrayBuffer()));
  } catch (e) {
    console.error("og", e); // 失敗しても /r/{id}/og でその場で作れる
  }
  return Response.json({ id });
}
