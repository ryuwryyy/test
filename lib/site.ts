export const SITE_NAME = "円環の理へ";
export const SITE_DESC = "顔写真から、あなたが円環の理に導かれた姿をAIが描きます。";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);

// 公式画像は同梱せず、見た目の特徴だけを指示する
export const PROMPT = `Transform the person in this photo into a divine goddess of hope, in a Japanese anime key-visual style.
Keep the person's face, facial features and expression clearly recognizable.
Very long flowing pink hair reaching the ground, golden glowing eyes, an elegant white flowing dress with frills and ribbons,
large feathered wings made of light, holding a pink bow of light.
Background: a vast cosmic sky full of stars and galaxies in pink, white and gold, with a giant circle of light (a halo-like ring) behind her.
Serene, merciful, holy atmosphere. Soft glow, high detail. No text, no logos.`;

export const ID_RE = /^[a-f0-9]{32}$/;
export const blobPath = (id: string) => `results/${id}.png`;
