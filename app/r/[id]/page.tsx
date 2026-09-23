import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { exists } from "@/lib/blob";
import { ID_RE, SITE_DESC, SITE_NAME, blobPath, siteUrl } from "@/lib/site";
import Share from "@/app/share";

type Props = { params: Promise<{ id: string }> };

const TITLE = `円環の理に導かれました | ${SITE_NAME}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // 画像はこのサイトのドメインから配信する（Blob が非公開ストアでも X が読める）
  const images = [{ url: `/r/${id}/og`, width: 1200, height: 630, alt: "円環の理に導かれた姿" }];
  return {
    title: TITLE,
    description: SITE_DESC,
    openGraph: { title: TITLE, description: SITE_DESC, url: `/r/${id}`, siteName: SITE_NAME, type: "website", images },
    twitter: { card: "summary_large_image", title: TITLE, description: SITE_DESC, images },
  };
}

export default async function Result({ params }: Props) {
  const { id } = await params;
  if (!ID_RE.test(id) || !(await exists(blobPath(id)))) notFound();
  const url = `/r/${id}/image`;

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
