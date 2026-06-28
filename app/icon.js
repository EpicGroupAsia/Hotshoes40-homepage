import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
            fontSize: 17,
            lineHeight: 1,
            letterSpacing: "-0.5px",
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
