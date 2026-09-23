"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Vercel のリクエスト上限(4.5MB)に収まるよう、送る前に縮小する
async function shrink(file: File, max = 1024): Promise<Blob> {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((ok) => canvas.toBlob((b) => ok(b!), "image/jpeg", 0.9));
}

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("photo", await shrink(file), "face.jpg");
      const res = await fetch("/api/generate", { method: "POST", body });
      const json = await res.json().catch(() => ({ error: `サーバーエラー (${res.status})。時間切れの可能性があります` }));
      if (!res.ok) throw new Error(json.error);
      if (json.id) return router.push(`/r/${json.id}`);
      setImage(json.image);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成に失敗しました");
      setLoading(false);
    }
  }

  return (
    <>
      <h1>円環の理へ</h1>
      <p className="lead">顔写真をえらぶと、あなたが導かれた姿をAIが描きます。</p>

      <form onSubmit={submit} className="card">
        <label className="drop">
          {file ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={URL.createObjectURL(file)} alt="選んだ写真" />
          ) : (
            <span>タップして顔写真をえらぶ</span>
          )}
          <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>

        <label className="check">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          自分の写真（または本人の許可を得た写真）です
        </label>

        <button disabled={!file || !agreed || loading}>
          {loading ? "導かれています…（30秒ほど）" : "円環の理に導かれる"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>

      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="result" src={image} alt="導かれた姿" />
          <div className="share">
            <a href={image} download="enkan.png">
              画像を保存
            </a>
          </div>
        </>
      )}
    </>
  );
}
