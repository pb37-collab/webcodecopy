# NanoGrow Max: Generated Video Map

The 13 Higgsfield Kling 3.0 website clips were generated on 2026-10-10. Each one was reviewed frame by frame (start, middle and end, plus full-resolution label and hand crops). The approved clips were re-encoded for the web and uploaded to **Shopify Admin > Content > Files**.

**Encode:** H.264 High, `libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart`, no audio, 24 fps. V02-4 used CRF 28 to stay at or under 1.5 MB. The poster is the first frame as a JPG (q≈82).
**Liquid:** reference a file with `{{ 'ngm-vid-V05.mp4' | file_url }}`. For video objects, use the Video GID and `video_tag` / `sources`. Shopify also creates adaptive renditions (480p, 720p, 1080p, and HLS `.m3u8`), listed under `sources` on each Video.

## Aspect-ratio note (read before wiring slots)

Kling returned **4:5 (1292×1604)** for some slots that were briefed as 9:16 or 1:1: V01 mobile, V03, V04 and V05. Those files are encoded at their native **864×1072**. Use `object-fit: cover` in a square or 9:16 frame. The V02 how-to steps came back as true **1:1** and are encoded at 1080×1080. V01 desktop came back as 16:9 (1928×1076).

## Map

| Slot | Shopify file | Video GID | Duration | Size | Dimensions | Poster file (GID) | Status |
|---|---|---|---|---|---|---|---|
| V01 home hero 16:9 (desktop) | — | — | 5.0 s raw | — | 1928×1076 raw | — | **REJECTED**: on the push-in close-up the product label garbles (wordmark and net-content text become nonsense glyphs). |
| V01 home hero 16:9 (desktop) — salvage | `ngm-vid-V01-desktop-trim.mp4` | `gid://shopify/Video/51868610920751` | 3.96 s (boomerang loop) | 469 KB | 1280×720 | `ngm-vid-V01-desktop-trim-poster.jpg` (`gid://shopify/MediaImage/51868638183727`) | APPROVED (optional). First 2.0 s of the rejected clip plus a reversed copy. The bottles stay small, so the label garble can't be seen. A slow arc move that loops seamlessly. |
| V01 home hero 9:16 (mobile) | `ngm-vid-V01-mobile.mp4` | `gid://shopify/Video/51868610953519` | 10.04 s (boomerang loop) | 1.51 MB | 864×1072 (4:5) | `ngm-vid-V01-mobile-poster.jpg` (`gid://shopify/MediaImage/51868638216495`) | APPROVED. Push-in on two bottles in a sunlit tomato and basil bed. The label holds up ("NANO GROW MAX" is legible). Boomerang gives a seamless loop. |
| V02-1 step 1 mix | `ngm-vid-V02-1.mp4` | `gid://shopify/Video/51868610986287` | 5.04 s | 423 KB | 1080×1080 | `ngm-vid-V02-1-poster.jpg` (`gid://shopify/MediaImage/51868638249263`) | APPROVED with caveat. Hand and syringe dose into a jug, and the hand looks natural. Caveats: the jug graduations are nonsense ("1L 500 / 1L 250 / 1L 200"), and the dose shows as a **blue** dye cloud. Swap it out if the real concentrate isn't blue. |
| V02-2 step 2 prep soil | — | — | 5.04 s raw | — | 1440×1440 raw | — | **REJECTED**: water from the can turns into white foam/froth patches on the soil, which looks fake and chemical. |
| V02-3 step 3 first spray | — | — | 5.04 s raw | — | 1440×1440 raw | — | **REJECTED**: the hand deforms. The fingers pass through the spray trigger and the grip morphs mid-clip. |
| V02-4 step 4 routine | `ngm-vid-V02-4.mp4` | `gid://shopify/Video/51868611019055` | 5.04 s | 1.44 MB | 1080×1080 | `ngm-vid-V02-4-poster.jpg` (`gid://shopify/MediaImage/51868638282031`) | APPROVED. Hand mists a tomato plant, then the camera drifts to the bed with a watering can. No product label is visible (generic sprayer). |
| V02-5 step 5 how much | `ngm-vid-V02-5.mp4` | `gid://shopify/Video/51868611051823` | 5.04 s | 507 KB | 1080×1080 | `ngm-vid-V02-5-poster.jpg` (`gid://shopify/MediaImage/51868638314799`) | APPROVED. Measuring-cup pour into a grow bag. The rotation is physically coherent. The cup markings are generic/illegible. |
| V02-6 step 6 flowering | `ngm-vid-V02-6.mp4` | `gid://shopify/Video/51868611084591` | 5.04 s | 1.46 MB | 1080×1080 | `ngm-vid-V02-6-poster.jpg` (`gid://shopify/MediaImage/51868638347567`) | APPROVED. Watering can pours at the base of a flowering tomato. An unbranded amber spray bottle sits on the bench (not the NGM bottle). |
| V02-7 step 7 harvest | `ngm-vid-V02-7.mp4` | `gid://shopify/Video/51868611117359` | 5.04 s | 1.53 MB | 1080×1080 | `ngm-vid-V02-7-poster.jpg` (`gid://shopify/MediaImage/51868638380335`) | APPROVED. Sunset slow move on ripe tomatoes and a wicker basket. Clean. |
| V03 GroMax leaf mist | `ngm-vid-V03.mp4` | `gid://shopify/Video/51868611150127` | 5.04 s | 610 KB | 864×1072 (4:5) | `ngm-vid-V03-poster.jpg` (`gid://shopify/MediaImage/51868638413103`) | APPROVED. Hand mists brassica leaves. The NGM bottle sits stable on the potting bench behind. Hand anatomy holds up. |
| V04 RootMax soil drench | `ngm-vid-V04.mp4` | `gid://shopify/Video/51868611182895` | 5.04 s | 628 KB | 864×1072 (4:5) | `ngm-vid-V04-poster.jpg` (`gid://shopify/MediaImage/51868638445871`) | APPROVED. Watering can drenches a tomato seedling in a fabric pot. The bottle label is stable across frames. |
| V05 Odor Max mist loop | `ngm-vid-V05.mp4` | `gid://shopify/Video/51868611215663` | 5.04 s | 309 KB | 864×1072 (4:5) | `ngm-vid-V05-poster.jpg` (`gid://shopify/MediaImage/51868638478639`) | APPROVED. Nano Odor Max bottle on a dark green backdrop with periodic mist bursts. The label is crisp and stable. Not boomeranged, because reversed mist looks unnatural. The plain loop has a small jump at the restart: the first frame already shows a mist plume, and the static camera keeps it subtle. |
| V06 room transformation stale→fresh | — | — | 5.04 s raw | — | 1292×1604 raw | — | **REJECTED**: the throw blanket and tissue box ghost-dissolve (go semi-transparent and vanish) mid-clip. The haze-clearing part is fine, but the object morph looks fake and implies the spray tidies the room. |

**Summary:** 9 of 13 slots approved, plus 1 optional salvage for the desktop hero. Rejected: V01 desktop (full clip), V02-2, V02-3, V06. Per the brief, rejected clips were not regenerated.

## Pipeline notes

- The Higgsfield CDN (`d8j0ntlcm91z4.cloudfront.net`) is blocked from the build container. Raw clips came in through `themeFilesUpsert` (body type `URL`) into the sandbox theme `gid://shopify/OnlineStoreTheme/188878029103` as `assets/vraw-<slot>.mp4`. They were then downloaded from `cdn.shopify.com/s/files/1/0979/0269/0607/t/35/assets/…` and checked by MD5.
- **Theme assets and generic Files cap at 20 MB.** The raw V02-4, V02-6 and V02-7 clips (21–22 MB, about 35 Mbps) failed silently on the theme upsert. Those three were fetched in the Higgsfield sandbox and re-encoded to a 1080² CRF 16 mezzanine. They were then passed through a Shopify staged upload as temporary `zz-vmez-*` GenericFiles. Those temp files and two failed attempts have since been deleted from Files.
- The raw `assets/vraw-*.mp4` files stay in the sandbox theme, which gets deleted after launch. No other theme was touched.
