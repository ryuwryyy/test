import { ImageResponse } from "next/og";
import { loadJpFont } from "./font";
import { SITE_NAME } from "./site";

export const ogSize = { width: 1200, height: 630 };

export async function renderOg(imageUrl: string | null) {
  const title = imageUrl ? "円環の理に導かれました" : SITE_NAME;
  const sub = "あなたも、導かれてみませんか";
  const font = await loadJpFont(title + sub);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "radial-gradient(circle at 70% 40%, #ffd6ec 0%, #b84d9a 35%, #1a0b2e 80%)",
          fontFamily: "JP",
          color: "white",
          padding: 40,
          gap: 48,
        }}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            width={367}
            height={550}
            style={{ borderRadius: 24, border: "6px solid #ffe9a8", objectFit: "cover" }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center" }}>
          <div style={{ fontSize: 68, textShadow: "0 0 24px #ff9ad5" }}>{title}</div>
          <div style={{ fontSize: 36, marginTop: 24, color: "#ffe9a8" }}>{sub}</div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: [{ name: "JP", data: font, weight: 700 }] },
  );
}
