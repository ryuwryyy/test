import { getResultUrl } from "@/lib/blob";
import { renderOg } from "@/lib/og";

// 保存済みの OGP 画像がない結果（古いものや保存に失敗したもの）用に、その場で作る
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return renderOg(await getResultUrl(id));
}
