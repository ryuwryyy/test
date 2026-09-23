// next/og の既定フォントは日本語を含まないので、必要な文字だけ Google Fonts から取る
export async function loadJpFont(text: string): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&text=${encodeURIComponent(text)}`,
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format/)?.[1];
  if (!url) throw new Error("font not found");
  return fetch(url).then((r) => r.arrayBuffer());
}
