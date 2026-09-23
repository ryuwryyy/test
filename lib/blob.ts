import { head } from "@vercel/blob";
import { ID_RE, blobPath } from "./site";

export async function getResultUrl(id: string): Promise<string | null> {
  if (!ID_RE.test(id)) return null;
  try {
    return (await head(blobPath(id))).url;
  } catch {
    return null;
  }
}
