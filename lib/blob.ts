import { get, put } from "@vercel/blob";

type Access = "public" | "private";

// Blob ストアは公開・非公開のどちらで作られていても使えるようにする。
// 一度成功した方式を覚えておき、次からはそれを先に試す
let known: Access | undefined;
const order = (): Access[] => (known === "private" ? ["private", "public"] : ["public", "private"]);

export async function savePng(pathname: string, data: Buffer) {
  let last: unknown;
  for (const access of order()) {
    try {
      await put(pathname, data, { access, contentType: "image/png", addRandomSuffix: false });
      known = access;
      return;
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

// 保存した PNG を読み出す。なければ null
export async function loadPng(pathname: string): Promise<ReadableStream<Uint8Array> | null> {
  for (const access of order()) {
    try {
      const r = await get(pathname, { access });
      if (r?.statusCode === 200) {
        known = access;
        return r.stream;
      }
    } catch {
      // もう一方の方式で試す
    }
  }
  return null;
}

export async function exists(pathname: string) {
  const s = await loadPng(pathname);
  await s?.cancel();
  return s !== null;
}

export const pngResponse = (stream: ReadableStream<Uint8Array>) =>
  new Response(stream, {
    headers: { "content-type": "image/png", "cache-control": "public, max-age=31536000, immutable" },
  });
