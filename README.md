# Hifsa Khan Salon — Homepage

A static rebuild of the [hifsakhansalon.com](https://hifsakhansalon.com/) homepage, matched
section-by-section against a full-page screenshot of the original.

## Colour

The original green palette is used throughout. **No pink (`#E576A1`) appears anywhere.**

```css
/* assets/css/styles.css */
--green:      #8fae8b;   /* primary accent: buttons, links, icons */
--green-dark: #7a9c76;   /* hover */
--green-deep: #5f7f5b;   /* text on pale grounds */
--green-line: #bcd2b8;   /* outline-button border */
--green-pale: #e7eede;   /* newsletter ground */
--green-mist: #f7f6f3;   /* hero ground */
```

Accent rule under centred headings: `--gold #c9a227`.

Section grounds: `--cream #f7f4ec`, `--beige #f2ede1`, `--sand #faf8f3`,
`--blue-grey #dde5e8` (footer), `--lavender-soft #ece6f1` (testimonials).

**These hexes are read off a compressed screenshot, not sampled from the source CSS.**
They are close, not exact. Every one is a token, so correcting any of them is a one-line
edit — send the real values (DevTools eyedropper, or the site's stylesheet) and they drop in.

## Section order

Matches the reference top to bottom:

1. Header — HK monogram, nav, green Book Appointment pill, search
2. Hero — social proof, H1, copy, two buttons, 3-image collage, rotating seal
3. Brand strip — Charlotte Tilbury, L'Oréal, NARS, Armani, Guinot, MAC (continuous marquee)
4. Your Journey to Lasting Beauty — two-column intro + autoplaying film
5. Four ways we care for you — Makeup / Hair / Spa / HK Aesthetics
6. Bridal is where we made our name
7. Why Lahore keeps coming back — four cards
8. The Expert's Guide to Effortless Radiance — topic list with hover-swapped image
9. Special Promotions — one static creative plus two independent sliders
10. Create Memories at Hifsa Khan Sets
11. FAQ accordion + See All FAQs
12. Real Transformations Real Stories — testimonial slider (quote + image move together)
13. Newsletter
14. Instagram grid
15. Footer — brand strip, Address / Contact / Info / More / Business Hours
16. Let's Talk bar, copyright, floating WhatsApp, Offers edge tab

## Images — the one outstanding gap

Network access is blocked in the build environment, so the original photography could not be
downloaded. `assets/img/` holds neutral, clearly-marked slots at the correct aspect ratios.
Replace each file (keep the name, or update the `src` in `index.html`):

| File                                          | Slot                        | Ratio |
| --------------------------------------------- | --------------------------- | ----- |
| `hero-1 / hero-2 / hero-3`                    | hero collage (l-to-r)       | 187:413 |
| `avatar-1 / avatar-2 / avatar-3`              | social-proof avatars        | 1:1   |
| `video-still`                                 | film poster frame           | 16:9  |
| `card-makeup / card-hair / card-spa / card-aesthetics` | service cards      | 4:3   |
| `bridal`                                      | Bridal section              | 4:5   |
| `guide-1` … `guide-5`                         | Expert's Guide, one per topic | 1:1 |
| `promo-makeup`                                | Special Promotions, static  | 1:1   |
| `promo-hair-1..3`, `promo-spa-1..3`           | Special Promotions, sliders | 1:1   |
| `sets`                                        | Hifsa Khan Sets             | 4:3   |
| `tst-1`, `tst-2`                              | testimonial, one per quote  | 3:4   |
| `insta-1` … `insta-6`                         | Instagram grid              | 1:1   |

The six brand logos render as text set in the display face; swap in the real logo files for
an exact match.

## Typography

Cormorant Garamond (headings) + Jost (body), loaded from Google Fonts. Both are **inferred
from the screenshot**, not confirmed against the source — the reference's actual faces may
differ, and swapping them is a one-line change in `index.html` plus `--font-display` /
`--font-body`.

## Running locally

```
npx http-server . -p 8080
```

Or open `index.html` directly; the page is fully static.

## Responsive

Breakpoints at `1180px` (nav → drawer), `980px` (split sections stack, 2-up cards),
`720px` (single column), `560px` (compact masthead), `420px`.
`prefers-reduced-motion` disables reveals, the seal rotation, the brand marquee, autoplay and
transitions.

### Testimonials

Each testimonial owns its picture. The arrows move the quote and the image as one: the quotes
slide horizontally while the images crossfade underneath, both driven by a single index. To add
a testimonial, add a `.tst__slide` and a matching `.tst__img` whose `data-tst` is the next index.

Only quotes actually seen on the reference site are used, and no quote carries an attribution
that was not shown with it — the second is credited to "Client" because its author is unknown.
Do not add invented names.

### Promotion sliders

The Makeup promotion is a single creative. Hair and Spa each run their own slider with its own
position, so advancing one never moves the other; both wrap around in both directions and accept
swipes. To change how many slides a promotion has, add or remove `<img>` elements inside its
`.promo__track` — the script counts them. They are manual only, with no autoplay.

### The Expert's Guide image swap

The five topics each own a picture. All five are stacked in `.guide__media` and crossfade via
an `is-active` class, so nothing loads on hover and there is no flicker. Pointer hover and
keyboard focus both drive it; leaving the list returns to the first topic. To change which
picture belongs to a topic, keep the `data-guide` index on the link and image in step.

### The journey film

`index.html` uses a real `<video>` (autoplay, muted, loop, playsinline) pointing at
`assets/video/bridal-beauty-edit-2025.mp4`. While that file is absent the poster frame shows and
the play/pause control hides itself rather than offering a dead button. The gold Bridal Beauty
Edit lockup belongs to the film's own frames on the reference site, so there is no HTML overlay.

### Brand marquee

The strip below the hero scrolls continuously and never pauses. The logo group is duplicated in
the markup and the track animates to `translateX(-50%)`, so the loop lands exactly one group
over and repeats with no visible jump. Speed is the `32s` duration on `.brands__track`. The
second strip above the footer is deliberately left static.
