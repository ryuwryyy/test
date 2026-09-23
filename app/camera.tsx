"use client";

import { useEffect, useRef, useState } from "react";

type Props = { onShot: (file: File) => void; onClose: () => void };

// ブラウザ内でインカメラを起動して1枚撮る。使えない環境では端末のカメラアプリに切り替える
export default function Camera({ onShot, onClose }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stream: MediaStream | undefined;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user", width: 1280, height: 1280 }, audio: false })
      .then((s) => {
        if (cancelled) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        video.current!.srcObject = s;
      })
      .catch(() => setFailed(true)) ?? setFailed(true);
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function shoot() {
    const v = video.current;
    if (!v?.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d")!;
    // プレビューと同じ鏡像で保存する
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0);
    canvas.toBlob((b) => b && onShot(new File([b], "camera.jpg", { type: "image/jpeg" })), "image/jpeg", 0.9);
  }

  if (failed) {
    return (
      <div className="camera">
        <p>ブラウザ内でカメラを起動できませんでした</p>
        <div className="buttons">
          <label className="pill">
            端末のカメラで撮る
            <input
              type="file"
              accept="image/*"
              capture="user"
              hidden
              onChange={(e) => e.target.files?.[0] && onShot(e.target.files[0])}
            />
          </label>
          <button type="button" className="pill ghost" onClick={onClose}>
            やめる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="camera">
      <div className="drop">
        <video ref={video} autoPlay playsInline muted />
      </div>
      <div className="buttons">
        <button type="button" className="pill" onClick={shoot}>
          撮影する
        </button>
        <button type="button" className="pill ghost" onClick={onClose}>
          やめる
        </button>
      </div>
    </div>
  );
}
