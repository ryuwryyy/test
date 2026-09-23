import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg(null);
}
