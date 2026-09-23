"use client";

import { useState } from "react";

type Props = { pageUrl: string; imageUrl: string; text: string };

export default function Share({ pageUrl, imageUrl, text }: Props) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(pageUrl);
  const t = encodeURIComponent(text);

  return (
    <div className="share">
      <a href={`https://x.com/intent/post?text=${t}&url=${u}&hashtags=円環の理`} target="_blank" rel="noopener">
        X でシェア
      </a>
      <a href={`https://social-plugins.line.me/lineit/share?url=${u}`} target="_blank" rel="noopener">
        LINE で送る
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener">
        Facebook
      </a>
      <button
        onClick={async () => {
          if (navigator.share) return navigator.share({ text, url: pageUrl }).catch(() => {});
          await navigator.clipboard.writeText(pageUrl);
          setCopied(true);
        }}
      >
        {copied ? "コピーしました" : "リンクをシェア"}
      </button>
      <a href={imageUrl} download="enkan.png" target="_blank" rel="noopener">
        画像を保存
      </a>
    </div>
  );
}
