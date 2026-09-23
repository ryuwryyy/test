import { loadPng, pngResponse } from "@/lib/blob";
import { ID_RE, blobPath } from "@/lib/site";

// 生成画像を配信する
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stream = ID_RE.test(id) ? await loadPng(blobPath(id)) : null;
  return stream ? pngResponse(stream) : new Response("not found", { status: 404 });
}
