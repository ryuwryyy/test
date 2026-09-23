"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Camera from "./camera";
import Share from "./share";

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

export default function Home({ siteUrl }: { siteUrl: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [camera, setCamera] = useState(false);
  const [notice, setNotice] = useState("");

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
      setNotice(json.notice ?? "");
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成に失敗しました");
      setLoading(false);
    }
  }

  return (
    <>
      <h1>円環の理へ</h1>
      <p className="lead">顔写真をえらぶか撮ると、あなたが導かれた姿をAIが描きます。</p>

      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="result" src={image} alt="導かれた姿" />
          {notice && <p className="error">{notice}</p>}
          <Share pageUrl={siteUrl} imageUrl={image} text="わたし、円環の理に導かれました" />
          <button className="again" onClick={() => setImage("")}>
            もう一度導かれる
          </button>
        </>
      ) : (
        <form onSubmit={submit} className="card">
          {camera ? (
            <Camera
              onShot={(f) => {
                setFile(f);
                setCamera(false);
              }}
              onClose={() => setCamera(false)}
            />
          ) : (
            <>
              <label className="drop">
                {file ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={URL.createObjectURL(file)} alt="選んだ写真" />
                ) : (
                  <span>タップして顔写真をえらぶ</span>
                )}
                <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </label>
              <div className="buttons">
                <label className="pill ghost">
                  写真をえらぶ
                  <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
                <button type="button" className="pill ghost" onClick={() => setCamera(true)}>
                  カメラで撮る
                </button>
              </div>
            </>
          )}

          <label className="check">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            自分の写真（または本人の許可を得た写真）です
          </label>

          <button disabled={!file || !agreed || loading}>
            {loading ? (
              <>
                30秒ほどお待ちください
                <span className="spinner" aria-hidden />
              </>
            ) : (
              "円環の理に導かれる"
            )}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </>
  );
}
