import { CaseLayout, projectMetadata } from "@/components/case-layout";
import { Media } from "@/components/media";
import { Flow, Prose, Section, StatGrid } from "@/components/primitives";
import { getProject } from "@/data/projects";
import { hasPublicFile } from "@/lib/media";

const project = getProject("weedporns");
export const metadata = projectMetadata(project);

const FEED = ["01", "02", "03", "04", "05", "06", "07", "08", "09"]
  .map((n) => `/images/feed/post-${n}.webp`)
  .filter(hasPublicFile);

export default function Page() {
  return (
    <CaseLayout
      project={project}
      problem={
        <>
          <p>
            Cannabis culture lives on X, but cannabis brands can&rsquo;t buy reach there, or on
            most other platforms. Reach has to be built, and then it has to keep coming back.
          </p>
        </>
      }
      built={
        <>
          <p>
            <strong>@WeedPorns</strong>: a daily, platform-native feed of memes, threads, video and
            giveaways that became the largest cannabis account on X. Parker also runs{" "}
            @SkateboardVine. The two together have <strong>1.5M+ followers</strong>.
          </p>
          <p>
            On top of the audience, a sponsored-campaign product: giveaway posts, direct posts,
            24-hour retweets, pinned posts in the Weed Twitter community and link-in-bio slots, each
            tracked post by post.
          </p>
        </>
      }
      moved={
        <>
          <p>
            In 2024 the account drove <strong>2.1B impressions</strong>,{" "}
            <strong>783K new followers</strong> and <strong>802M media views</strong> at a{" "}
            <strong>5% engagement rate</strong>.
          </p>
          <p>That audience later became the distribution engine behind Canna Connect&rsquo;s clients.</p>
        </>
      }
    >
      <Section eyebrow="Sponsored campaign" title="ZenCo × @WeedPorns, Apr–May 2026">
        <StatGrid
          stats={[
            { value: "1,150,026", label: "impressions across 8 direct posts", source: "ZenCo x WeedPorns campaign sheet" },
            { value: "908K", label: "impressions on the top post", source: "ZenCo x WeedPorns campaign sheet" },
            { value: "366K", label: "media views on the top post", source: "ZenCo x WeedPorns campaign sheet" },
            { value: "464,527", label: "total media views", source: "ZenCo x WeedPorns campaign sheet" },
          ]}
        />
        <Prose className="mt-6">
          <p>
            Every sponsored post goes into a campaign sheet with impressions, engagement, link
            clicks, likes, reposts, bookmarks, completion rate and media views. That tracking later
            became the data model for Canna Connect OS.
          </p>
        </Prose>
      </Section>

      <Section eyebrow="How a sponsored campaign runs" title="One audience, several formats.">
        <Flow
          steps={[
            { title: "Package", body: "Giveaway posts, direct posts, 24h retweets, a community pin and link-in-bio, sized to the brand." },
            { title: "Native creative", body: "Posts written in the account's voice: memes, would-you-rathers, threads. They don't read as ads." },
            { title: "Giveaway mechanics", body: "Follow, repost and reply entries turn reach into new followers for the sponsor." },
            { title: "Post-level reporting", body: "Impressions, engagement, clicks and media views per post, rolled up into campaign totals." },
          ]}
        />
      </Section>

      <Section eyebrow="From the feed" title="Top posts.">
        {FEED.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FEED.map((src, i) => (
              <div key={src} className="overflow-hidden rounded-2xl border border-line">
                <Media src={src} alt={`@WeedPorns top post ${i + 1}`} aspect="1 / 1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="overflow-hidden rounded-2xl border border-line">
                <Media src={`/images/feed/post-0${n}.webp`} alt={`Top post ${n}`} aspect="1 / 1" />
              </div>
            ))}
          </div>
        )}
      </Section>
    </CaseLayout>
  );
}
