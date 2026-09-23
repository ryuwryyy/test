import { head } from "@vercel/blob";
import { ID_RE, blobPath, ogPath } from "./site";

export async function getResultUrl(id: string): Promise<string | null> {
  if (!ID_RE.test(id)) return null;
  try {
    return (await head(blobPath(id))).url;
  } catch {
    return null;
  }
}

// 生成時に作って保存した OGP 画像（1200x630）の URL
export async function getOgUrl(id: string): Promise<string | null> {
  if (!ID_RE.test(id)) return null;
  try {
    return (await head(ogPath(id))).url;
  } catch {
    return null;
  }
}
