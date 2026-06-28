import { ImageResponse } from "next/og";

export const alt = "Hotshoes Asia — 40 Years of Moving Brands Forward";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#07060F",
          backgroundImage:
            "radial-gradient(900px circle at 100% 0%, rgba(110,43,232,0.35), transparent 60%), radial-gradient(760px circle at 0% 100%, rgba(31,208,240,0.25), transparent 56%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#1FD0F0",
            marginBottom: 28,
          }}
        >
          <div style={{ width: 14, height: 14, background: "#ED1C2E" }} />
          HOTSHOES ASIA
        </div>
        <div
          style={{
            fontFamily: "sans-serif",
            fontWeight: 900,
            fontSize: 76,
            lineHeight: 1.04,
            letterSpacing: -2,
            color: "#F4F3F8",
            textTransform: "uppercase",
            maxWidth: 980,
          }}
        >
          40 Years of Moving Brands Forward
        </div>
        <div
          style={{
            marginTop: 32,
            fontFamily: "sans-serif",
            fontSize: 28,
            color: "#A6A2C4",
            maxWidth: 820,
          }}
        >
          A bold creative brand activation and events agency, across Asia.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 10,
            background:
              "linear-gradient(90deg, #1FD0F0, #2E5BFF, #6E2BE8, #C026D3, #ED1C2E)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
