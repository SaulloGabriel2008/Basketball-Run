---
name: 'Hoop Legacy: Career Simulator'
colors:
  surface: '#101419'
  surface-dim: '#101419'
  surface-bright: '#36393f'
  surface-container-lowest: '#0a0e13'
  surface-container-low: '#181c21'
  surface-container: '#1c2025'
  surface-container-high: '#262a30'
  surface-container-highest: '#31353b'
  on-surface: '#e0e2ea'
  on-surface-variant: '#bbcbb7'
  inverse-surface: '#e0e2ea'
  inverse-on-surface: '#2d3136'
  outline: '#859583'
  outline-variant: '#3c4a3b'
  surface-tint: '#29e465'
  primary: '#42f372'
  on-primary: '#003912'
  primary-container: '#00d659'
  on-primary-container: '#00561f'
  inverse-primary: '#006e2a'
  secondary: '#77dc88'
  on-secondary: '#003914'
  secondary-container: '#007932'
  on-secondary-container: '#99fea7'
  tertiary: '#ffce76'
  on-tertiary: '#422d00'
  tertiary-container: '#edaf2b'
  on-tertiary-container: '#624400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6aff87'
  primary-fixed-dim: '#29e465'
  on-primary-fixed: '#002108'
  on-primary-fixed-variant: '#00531e'
  secondary-fixed: '#93f9a2'
  secondary-fixed-dim: '#77dc88'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#fbbc38'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#101419'
  on-background: '#e0e2ea'
  surface-variant: '#31353b'
typography:
  display-hero:
    fontFamily: Barlow Condensed
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 60px
    letterSpacing: 0.02em
  display-hero-mobile:
    fontFamily: Barlow Condensed
    fontSize: 38px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: 0.02em
  headline-xl:
    fontFamily: Barlow Condensed
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: 0.01em
  headline-xl-mobile:
    fontFamily: Barlow Condensed
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 0.01em
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0.03em
  headline-sm:
    fontFamily: Barlow Condensed
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.04em
  body-lg:
    fontFamily: Chivo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Chivo
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Chivo
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  stat-display:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.03em
  stat-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  stat-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0em
  label-caps:
    fontFamily: Barlow Condensed
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-desktop: 1rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system drives an elite professional sports simulation and deep analytics management platform. The brand identity fuses the hallowed legacy of championship basketball—echoed through classic parquet hardwoods, banner gold, and iconic franchise greens—with the ultra-precise, data-dense telemetrics of modern motorsport engineering displays. 

The aesthetic is **Retro-Modern Athletic Analytics**:
- **Tone:** Methodical, prestigious, high-stakes, analytical, and electric.
- **Target Audience:** Dedicated basketball simulation tacticians, fantasy dynasty managers, front-office enthusiasts, and sports analytics obsessives who prize comprehensive metrics, deep roster granularity, and rapid keyboard/gamepad navigation.
- **Visual Stance:** Monolithic charcoal surfaces paired with razor-thin electric emerald borders, gold-leaf championship badges, subtle court-grained textures, and dense, monospaced statistical readouts. The atmosphere captures the tension of an NBA general manager's war room combined with a high-performance telemetry dashboard.

## Colors

The palette is engineered specifically for protracted screen sessions under dark room environments, prioritizing visual hierarchy, immediate status identification, and zero eye fatigue.

- **Primary (`#00d659`):** Electric Emerald. Utilized for active states, key interactive drivers, dynamic delta gains (+PER, True Shooting surges), and high-focus neon accents.
- **Secondary (`#007A33`):** Heritage Boston Celtic Emerald. Anchors foundational UI states, selected tabs, defensive rating indicators, and dominant team/brand backdrops.
- **Tertiary (`#E5A823`):** Trophy Gold. Reserved for championship banners, Hall of Fame milestones, All-NBA selections, MVP alerts, clutch ratings, and tier-1 accolades.
- **Neutral Surface Ecosystem:**
  - `Canvas / Deep Void`: `#0c1015` (Deepest canvas backing, creates cinematic negative space).
  - `Card / Base Bay`: `#121820` (Standard container for stat panels, roster tables, and depth charts).
  - `Elevated Surface / Bay Highlight`: `#18222d` (Hover surfaces, floating action panels, active tooltips, modal sheets).
  - `Border / Hairline Grid`: `#223140` (Subtle mechanical division lines).
- **Functional Semantics:**
  - `Stat Decline / Danger`: `#FF3B30` (Cold shooting streaks, negative contract cap space, severe injuries).
  - `Fatigue / Load Warning`: `#FF9500` (Condition below 75%, back-to-back road stretches).
  - `Text Primary`: `#F0F4F8` (Crisp off-white to eliminate high-contrast glare).
  - `Text Muted / Data Labels`: `#8496A8` (Secondary attributes, minute splits, non-active columns).

## Typography

The typographic hierarchy coordinates three purpose-built type families:

1. **Barlow Condensed (Display & Impact Headers):** Delivers intense, stadium-scoreboard authority. Its condensed geometry allows multi-part player surnames ("GILGEOUS-ALEXANDER"), team franchise titles, and transaction headers to maintain impact without consuming critical horizontal screen estate. Always styled with slight positive tracking in uppercase applications.
2. **Chivo (System Prose & Scouting Reports):** Crisp, neo-grotesque structural integrity designed for scouting notes, tactical play descriptions, contract clauses, and dialog prompts.
3. **JetBrains Mono (Telemetry, Roster Tables, Splits & Timecodes):** High-precision monospaced numerals with tabular figures ensure that 82-game stat tables, per-100 possession metrics, shooting splits (50/40/90), and shot-clock time intervals align without jitter or horizontal displacement.

## Layout & Spacing

The layout philosophy adapts the modular instrument clusters found in telemetry dashes and motorsport timing monitors:

- **Grid Architecture:** 12-column rigid modular grid on desktop (min-width: 1280px), shifting to an 8-column layout on tablet (768px - 1279px), and a continuous vertical-stack 4-column flow on mobile (<768px).
- **Density Density Profile:** Spacing is compact to accommodate multi-category data without requiring constant scrolling. Element gaps conform to an uncompromising 4px-based spatial cadence (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 12px, `space-lg` = 20px, `space-xl` = 32px).
- **Roster & Stat Table Lock:** Roster tables leverage zero-loss edge pinning: frozen left columns for player identifier (Avatar + Number + Name + Position), with horizontally scrollable telemetry across per-possession ratings, contract details, and career trajectory stats.
- **Section Dividers:** 1px hairline grid seams (`#223140`) act as dividers instead of wide blank gutters, maximizing visible data density.

## Elevation & Depth

Depth in this design system rejects heavy, muddy drop shadows in favor of **Tonal Layering with Luminescent Accents and Hard Material Textures**:

- **Material Underlays:**
  - **Parquet Court Texture:** Applied exclusively to the root background canvas (`#0c1015`) using a low-opacity (2.5%) geometric herringbone SVG pattern, evoking historic championship floorboards without interfering with readability.
  - **Leather Composite:** Card headers and primary metric panels use a micro-stippled matte finish to replicate the tactile grip of an official game ball.
- **Elevation Tiers:**
  - **Tier 0 (Base Canvas):** `#0c1015` — Root viewport and structural gutter tracks.
  - **Tier 1 (Telemetry Bays / Cards):** `#121820` — Outlined by a razor 1px border (`#223140`).
  - **Tier 2 (Interactive Rows / Flyout Hubs):** `#18222d` — Outlined with elevated border (`#2e4257`).
  - **Tier 3 (Active Selection / Modals):** `#18222d` paired with a sharp, localized neon rim-light (`box-shadow: 0 0 16px -4px rgba(0, 214, 89, 0.25)`).
- **Glow Architecture:** Accents are treated like electronic court scoreboards. When an accolade or stat leader triggers Tier 3, a calibrated outer beam (e.g., `0 0 12px rgba(229, 168, 35, 0.35)` for Gold Milestone states) cuts through the dark matte background.

## Shapes

The interface embraces a **machined, precision-cut architecture**:

- **Corner Radii:** Standard components feature subtle 4px (`roundedness: 1`, 0.25rem) corners. Roster data rows, modular cards, stat monitors, and tactical shot-charts retain this tight radius to evoke tactical displays.
- **Sub-Element Variants:**
  - **Stat Progress Meters & Fuel Gauges:** 2px micro-radii to maintain sharp, needle-like visual readouts.
  - **Badges & Player Tags:** Chiseled rectangular pills with 4px corners, utilizing vertical uppercase type.
  - **Cutout Chamfers:** Specialized team franchise comparison cards feature an optional 45-degree angled 8px chamfer on the top-right corner to replicate broadcast graphic packages.

## Components

### Buttons
- **Primary ("Execute Sim" / "Confirm Trade"):** Solid `#00d659` fill, ink-black text (`#0c1015`), `Barlow Condensed` Bold, uppercase, letter-spacing `0.08em`. Hover triggers an electric outer-rim bloom (`box-shadow: 0 0 14px rgba(0, 214, 89, 0.60)`).
- **Secondary ("Substitutions" / "Adjust Minutes"):** Background `#18222d`, 1px border `#223140`, text `#F0F4F8`. Hover changes border to `#00d659` and text to `#00d659`.
- **Tertiary / Utility:** Ghost style with muted typography (`#8496A8`), turning white on hover.

### Badges & Attribute Chips
- **Attribute Tier Badges (99 OVR, HOF Badges):** 
  - *Tier Elite (90-99):* Gold fill `#E5A823` with dark text, subtle amber glow.
  - *Tier Starter (80-89):* Emerald fill `#007A33` with `#00d659` 1px border.
  - *Tier Rotation (70-79):* Surface `#18222d` with white text and `#2e4257` border.
- **Position Badges (PG, SG, SF, PF, C):** Compact square-pill format, monospaced lettering, background `#121820`, hairline border `#223140`.

### Data Tables & Roster Matrices
- **Table Headers:** Sticky positioning, background `#0c1015`, typography `label-caps` in `#8496A8`, bottom border 2px `#223140`.
- **Cells:** Zero padding margin loss, fixed 36px row height for rapid scanning, alternating row striping with subtle alpha tints (`rgba(24, 34, 45, 0.4)` vs transparent). Numbers right-aligned using `JetBrains Mono`.
- **Hover Row Highlight:** Full row shifts to `#18222d` with a 2px vertical neon indicator `#00d659` on the leading border edge.

### Stat Progress Bars & Rating Meters
- Track: Deep charcoal track `#0c1015` with an inset hairline border.
- Fill: Gradients mapped to stat value:
  - *Cold (<60):* `#FF3B30`
  - *Neutral (60-79):* `#8496A8`
  - *Proficient (80-89):* `#007A33` to `#00d659`
  - *Elite (90+):* Dual-tone `#00d659` capped with `#E5A823`.

### Input Fields & Filter Toggles
- **Search & Filter Bars:** Dark input bays (`#121820`), inset border `#223140`, placeholder `#8496A8`. Focus snaps border to `#00d659` with a subtle focus glow.
- **Checkboxes & Radios:** Sharp 2px rounded squares, `#121820` background. Checked state utilizes a solid `#00d659` fill with a high-contrast dark interior mark.

### Domain-Specific Components
- **Shot Chart Matrix:** Dark hardwood-tinted canvas displaying spatial hexagonal distribution zones (cold ice blue to glowing red/green ignition markers).
- **Contract Cap Sheet Bar:** Multi-segmented stacked bar indicator denoting Guaranteed Money, Luxury Tax Threshold, and Second Apron line in high-visibility neon stripes.
- **Player Card Header:** Split-layout featuring cutout player silhouette against an illuminated team-color back-drop, with massive bold condensed jersey numbers and composite physical specs.