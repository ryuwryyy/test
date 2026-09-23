"use client";

import { useState } from "react";

type Props = { pageUrl: string; imageUrl: string; text: string };

const HASHTAG = "円環の理";

export default function Share({ pageUrl, imageUrl, text }: Props) {
  const [msg, setMsg] = useState("");
  const u = encodeURIComponent(pageUrl);
  const t = encodeURIComponent(`${text} #${HASHTAG}`);

  // スマホでは画像ファイルごと共有シートに渡す（X・Instagram・LINE などに画像つきで投稿できる）
  async function shareImage() {
    try {
      const file = await fetch(imageUrl)
        .then((r) => r.blob())
        .then((b) => new File([b], "enkan.png", { type: "image/png" }))
        .catch(() => null);
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: `${text} #${HASHTAG}\n${pageUrl}` });
        return;
      }
      if (navigator.share) {
        await navigator.share({ text, url: pageUrl });
        return;
      }
      await navigator.clipboard.writeText(`${text} #${HASHTAG} ${pageUrl}`);
      setMsg("リンクをコピーしました");
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) setMsg("共有できませんでした");
    }
  }

  return (
    <>
      <div className="share">
        <button onClick={shareImage}>画像つきでシェア</button>
        <a href={`https://x.com/intent/post?text=${t}&url=${u}`} target="_blank" rel="noopener">
          X でシェア
        </a>
        <a href={`https://social-plugins.line.me/lineit/share?url=${u}&text=${t}`} target="_blank" rel="noopener">
          LINE で送る
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener">
          Facebook
        </a>
        <a href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${text} #${HASHTAG} ${pageUrl}`)}`} target="_blank" rel="noopener">
          Bluesky
        </a>
      </div>
      {msg && <p>{msg}</p>}
    </>
  );
}
