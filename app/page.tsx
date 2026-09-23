import { siteUrl } from "@/lib/site";
import Home from "./home";

// シェア用 URL は開いているドメインではなく本番ドメインにする
// （個別デプロイの URL は Vercel の保護で X のクローラーが読めず、カードが出ない）
export default function Page() {
  return <Home siteUrl={siteUrl.toString()} />;
}
