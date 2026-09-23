import { loadPng, pngResponse } from "@/lib/blob";
import { renderOg } from "@/lib/og";
import { ID_RE, blobPath, ogPath } from "@/lib/site";

// OGP 画像（1200x630）を配信する。保存済みがなければその場で作る
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ID_RE.test(id)) return new Response("not found", { status: 404 });

  const og = await loadPng(ogPath(id));
  if (og) return pngResponse(og);

  const img = await loadPng(blobPath(id));
  if (!img) return renderOg(null);
  const b64 = Buffer.from(await new Response(img).arrayBuffer()).toString("base64");
  return renderOg(`data:image/png;base64,${b64}`);
}
