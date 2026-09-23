import type { Metadata } from "next";
import { SITE_DESC, SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: SITE_NAME,
  description: SITE_DESC,
  openGraph: { title: SITE_NAME, description: SITE_DESC, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <main>{children}</main>
        <footer>
          非公式ファンメイドのジョークサイトです。公式とは関係ありません。
          <br />
          アップロードした写真は保存しません（生成画像のみ共有用に公開URLで保存されます）。
        </footer>
      </body>
    </html>
  );
}
