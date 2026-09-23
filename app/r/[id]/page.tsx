import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOgUrl, getResultUrl } from "@/lib/blob";
import { SITE_DESC, SITE_NAME, siteUrl } from "@/lib/site";
import Share from "@/app/share";

type Props = { params: Promise<{ id: string }> };

const TITLE = `円環の理に導かれました | ${SITE_NAME}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // 生成時に保存した静的な OGP 画像を優先し、なければ動的に作る
  const og = (await getOgUrl(id)) ?? `/r/${id}/og`;
  const images = [{ url: og, width: 1200, height: 630, alt: "円環の理に導かれた姿" }];
  return {
    title: TITLE,
    description: SITE_DESC,
    openGraph: { title: TITLE, description: SITE_DESC, url: `/r/${id}`, siteName: SITE_NAME, type: "website", images },
    twitter: { card: "summary_large_image", title: TITLE, description: SITE_DESC, images },
  };
}

export default async function Result({ params }: Props) {
  const { id } = await params;
  const url = await getResultUrl(id);
  if (!url) notFound();

  return (
    <>
      <h1>円環の理に導かれました</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="result" src={url} alt="導かれた姿" />
      <Share pageUrl={new URL(`/r/${id}`, siteUrl).toString()} imageUrl={url} text="わたし、円環の理に導かれました" />
      <Link href="/" className="again">
        もう一度導かれる
      </Link>
    </>
  );
}
