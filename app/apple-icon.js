import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ED1C2E",
          borderRadius: "50%",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 1,
            letterSpacing: "-2.5px",
            color: "#FFFFFF",
          }}
        >
          hs
        </div>
      </div>
    ),
    { ...size }
  );
}
