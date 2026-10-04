import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { eqGiveaway as g } from "@/data/giveaways/davinci-eq-skyrise";

export const alt = `Win the ${g.brand} ${g.productShort} (Limited Edition: Quartz). ${g.winners} winners.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const accent = g.colorways[0].accent;

/** Product photo if it has been fetched into /public, else a quartz crystal. */
function heroArt(): string {
  const file = path.join(process.cwd(), "public", g.media.ogProduct);
  if (fs.existsSync(file)) return `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 340"><defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".45" stop-color="${accent}" stop-opacity=".75"/><stop offset="1" stop-color="#1a1230"/></linearGradient></defs><g fill="url(#f)" stroke="#fff" stroke-opacity=".6" stroke-width=".8"><path d="M40 100 L80 112 L80 320 L40 300 Z" fill-opacity=".55"/><path d="M80 112 L120 112 L120 320 L80 320 Z" fill-opacity=".3"/><path d="M120 112 L160 100 L160 300 L120 320 Z" fill-opacity=".7"/><path d="M40 100 L100 18 L80 112 Z" fill-opacity=".8"/><path d="M80 112 L100 18 L120 112 Z" fill-opacity=".5"/><path d="M120 112 L100 18 L160 100 Z" fill-opacity=".95"/></g></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default function OpenGraphImage() {
  const total = (g.retailPrice * g.winners).toLocaleString("en-US");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `radial-gradient(circle at 75% 45%, ${accent}66 0%, #1a1230 38%, #07070a 70%)`,
          color: "#f3f1ea",
          fontFamily: "sans-serif",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, letterSpacing: 10, fontWeight: 700 }}>
            DAVINCI
            <span
              style={{
                fontSize: 16,
                letterSpacing: 4,
                padding: "6px 14px",
                borderRadius: 999,
                border: `2px solid ${accent}`,
                color: accent,
              }}
            >
              GIVEAWAY
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 0.95, letterSpacing: -3 }}>Win the EQ Skyrise</div>
            <div style={{ fontSize: 88, fontWeight: 300, lineHeight: 1.05, color: accent, fontStyle: "italic" }}>Quartz.</div>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 26 }}>
            <span style={{ background: accent, color: "#08080b", padding: "10px 20px", borderRadius: 14, fontWeight: 700 }}>
              {g.winners} winners
            </span>
            <span style={{ border: "2px solid #ffffff33", padding: "8px 20px", borderRadius: 14 }}>${total} in prizes</span>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          <img src={heroArt()} alt="" width={380} height={460} style={{ objectFit: "contain" }} />
        </div>
      </div>
    ),
    size,
  );
}
