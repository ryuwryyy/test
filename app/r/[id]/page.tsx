import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResultUrl } from "@/lib/blob";
import { SITE_NAME, siteUrl } from "@/lib/site";
import Share from "./share";

type Props = { params: Promise<{ id: string }> };

const TITLE = `円環の理に導かれました | ${SITE_NAME}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // og:image は同じ階層の opengraph-image.tsx が自動で入る
  return { title: TITLE, openGraph: { title: TITLE, url: `/r/${id}` } };
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
