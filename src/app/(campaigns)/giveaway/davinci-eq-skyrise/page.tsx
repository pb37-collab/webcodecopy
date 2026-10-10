import type { Metadata } from "next";
import { ForwardTo } from "./forward";

const TARGET = "/giveaway/davinci-eq-jacuzzi/";

// Review links already went out with this path; the giveaway now lives at
// TARGET. A static export can't send a server redirect, so forward in the
// browser and keep ?ref= codes and other query params.
export const metadata: Metadata = {
  title: { absolute: "DaVinci EQ giveaway" },
  robots: { index: false, follow: false },
  alternates: { canonical: TARGET },
};

export default function OldSkyriseLink() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#07070a] px-5 text-center text-ink">
      <ForwardTo href={TARGET} />
      <p className="text-[15px] text-ink-2">
        The giveaway has moved.{" "}
        <a href={TARGET} className="text-ink underline underline-offset-4">
          Continue to the DaVinci EQ giveaway
        </a>
        .
      </p>
    </main>
  );
}
