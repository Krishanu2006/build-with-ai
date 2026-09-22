# UI/UX and Design Specification

**Product name:** TBD — working name **"CivicSignal"** *(Proposed)*
**Document:** Design.md
**Version:** 0.1 (Draft)
**Status:** Draft — derived from PRD.md v0.1 and FSD.md v0.1; consistent with TAD.md v0.1
**Depends on:** `PRD.md` (FR/NFR), `FSD.md` (SCR/FC), `TAD.md` (API/data)

> ⚠ **Branding status: no visual identity, colour palette, typography or brand language was established in the project discussion.** Every value in §3 and §4 is therefore labelled **Proposed** and is a recommendation, not an existing project requirement. Classification labels carry the same meaning as in PRD.md §0.

---

## Table of Contents

1. [Design Goals](#1-design-goals)
2. [User Experience Strategy](#2-user-experience-strategy)
3. [Visual Identity (Proposed)](#3-visual-identity-proposed)
4. [Design Tokens (Proposed)](#4-design-tokens-proposed)
5. [Layout](#5-layout)
6. [Page-by-Page Design](#6-page-by-page-design)
7. [Policymaker Dashboard in Depth](#7-policymaker-dashboard-in-depth)
8. [Citizen Request Interface in Depth](#8-citizen-request-interface-in-depth)
9. [Interaction Design](#9-interaction-design)
10. [Responsive Design](#10-responsive-design)
11. [Accessibility](#11-accessibility)
12. [Design-to-Implementation Mapping](#12-design-to-implementation-mapping)

---

## 1. Design Goals

Each principle is tied to something specific in this product. Generic principles are not listed.

| ID | Principle | Why it applies *here* |
|---|---|---|
| **DG-01** | **Evidence before conclusion** | The Confirmed core differentiator is explainable civic demand intelligence, and the Confirmed prohibition is an opaque AI score. So the interface must lead with the figures — request counts, category shares, severity distribution — and treat any ranking as a consequence of those figures, shown next to them. A dashboard that shows a rank first and evidence on a second click would invert the product's central claim. |
| **DG-02** | **Explainability is a layout problem, not a copy problem** | "Why is this region being surfaced?" (FR-012) is answered by a panel whose structure *is* the computation: one row per signal, with its value, plus an explicit block for signals that were unavailable. Prose narration of a score is not explainability. |
| **DG-03** | **Visible provenance** | Data in this product ranges from synthetic to public to unverified (PRD DEP-014…DEP-016). Every displayed figure carries a provenance tag. Absence of data renders as an explicit "not available", never as zero, a dash, or an omitted row (AC-014). |
| **DG-04** | **Advisory, never authoritative** | The Confirmed product principle is that the policymaker decides. Candidate interventions are therefore styled as suggestions — secondary visual weight, persistent "requires human decision" labelling, never a call-to-action that reads like an instruction (FR-013). |
| **DG-05** | **Low cognitive load for a dense analytical screen** | The dashboard carries a map, filters, a ranked list, evidence, demographic context, infrastructure context, investment context and interventions. Without discipline this becomes unreadable. Progressive disclosure (DG-06) and a strict three-region layout (§5) are the mechanisms. |
| **DG-06** | **Progressive disclosure** | Map → hotspot summary → evidence → contributing citizen requests. Each step reveals more detail on demand. Raw request text is never shown at the overview level. |
| **DG-07** | **Dignity and low friction for the citizen** | The Confirmed citizen pain points are language barriers and difficulty producing structured input. The submission screen therefore asks for free speech or free text, not a form of taxonomy dropdowns, and confirms back what the system understood (FR-015). |
| **DG-08** | **Accessibility as an equivalent path, not an accommodation** | A map cannot be made equivalent for non-visual users. The list view (FC-010) is designed as a first-class route to the same conclusion, not a stripped-down fallback (NFR-005). |
| **DG-09** | **Consistency across two very different audiences** | Citizen and policymaker screens share tokens, spacing and components but not density. Consistency here means the same visual language, not the same layout. |
| **DG-10** | **Calm under failure** | Providers may fail, datasets may be missing, geocoding may not resolve (PRD R-02…R-06). Every one of these has a designed state. A demo-time failure should look intentional and informative, not broken (NFR-007). |

---

## 2. User Experience Strategy

### 2.1 Citizen experience (ROLE-01, SCR-001 / SCR-002)

**Posture:** mobile-first, one screen, one decision at a time, no vocabulary the citizen must learn.

- **Open with the input mode choice**, because it is the only real decision: speak or type. Both are presented as equals; neither is the "advanced" option.
- **No taxonomy exposed.** The citizen never chooses a category or a severity — the system extracts those (FR-005). Asking would reintroduce the exact barrier the product exists to remove.
- **Language is optional, not a gate.** Detection is automatic; the selector exists only to correct it (FC-004).
- **Location is encouraged, not demanded.** An honest inline hint explains that a request without a resolvable location may not appear in geographic aggregation (FR-008) — this is the truthful framing, not a pressure tactic.
- **Close the loop.** SCR-002 shows what the system understood — transcript, category, issue summary, severity, area — in plain language. This directly addresses the Confirmed pain point "lack of visibility into how requests are analyzed" and doubles as an error-visibility mechanism: a wrong transcription is visible to the person best placed to notice it.
- **Never fabricate understanding.** If extraction failed, the screen says the request was received but not yet interpreted. It does not show a guess.

### 2.2 Policymaker / planner / analyst experience (ROLE-02, SCR-003 / SCR-004)

**Posture:** desktop-first, dense but ordered, investigation-oriented.

- **Entry is the whole picture:** map plus ranked list, filtered. The user's first question is "where", and both regions answer it simultaneously.
- **Selection opens an investigation, not a tooltip.** A hotspot opens a panel with a fixed, predictable reading order: *what was reported → why this region → what surrounds it → what might be done → you decide* (§7).
- **Every number is clickable down to its source.** The evidence panel's request count expands to the contributing citizen requests, in their original language, with the transcript marked where applicable (FC-015). Trust is built by permitting audit, not by asserting accuracy.
- **Gaps are shown, not hidden.** A missing investment dataset is a visible row reading "not available — requires verification", because pretending otherwise would misrepresent the system's evidence base (AC-015).
- **The decision stays with the human.** The panel terminates in candidate interventions with an explicit note that the system does not prioritize or decide. There is no "approve", "commit", or "assign" action anywhere — the product has no such capability and must not imply one.

---

## 3. Visual Identity (Proposed)

> **All of §3 is Proposed.** No branding existed. Rationale for the direction: the product is a civic instrument shown to government users, so the identity should read as neutral, institutional and calm — restrained colour, one accent used sparingly, and a strictly functional colour scale for data. Saturated "product marketing" colour would undermine DG-04 by making suggestions look like endorsements.

### 3.1 Colour (Proposed)

| Role | Value (Proposed) | Use |
|---|---|---|
| Primary | `#1F4E79` (deep institutional blue) | Primary actions, active navigation, selected states, focus accents |
| Primary hover | `#173C5E` | Hover/active on primary |
| Secondary | `#2D7D6E` (muted teal) | Secondary emphasis, evidence section accents, informational chips |
| Background | `#F6F7F9` | Page background |
| Surface | `#FFFFFF` | Cards, panels, map controls |
| Surface alt | `#EEF1F5` | Table stripes, inset blocks, disabled surfaces |
| Text | `#16202B` | Primary text |
| Muted text | `#5A6673` | Labels, metadata, provenance notes |
| Border | `#D7DDE4` | Dividers, input borders, card outlines |
| Success | `#2E7D52` | Submission confirmed, healthy states |
| Warning | `#9A6512` | Degraded data, partial availability, low-confidence transcript |
| Error | `#A62C2C` | Validation errors, failures |
| Focus ring | `#1F4E79` at 3px with a 2px light offset | Keyboard focus (never removed) |

**Data-encoding scale (Proposed) — separate from brand colour on purpose:**

| Purpose | Scale |
|---|---|
| Hotspot intensity (map + list) | Single-hue sequential ramp, 5 steps, light → dark: `#E3ECF4`, `#B9CFE3`, `#89AECD`, `#5789B3`, `#2D6193`. Sequential (not red-to-green) because the underlying value is a magnitude, and because a diverging red/green ramp both implies a value judgement the system must not make (DG-04) and fails for colour-vision deficiency. |
| Severity | Ordinal, encoded by **label + position + fill weight**, never colour alone: low `#B9CFE3`, medium `#5789B3`, high `#2D6193`. The severity word is always printed next to the swatch. |
| Category | Neutral chips (`Surface alt` + `Text`), **not** a colour-coded palette. With a **TBD** taxonomy of unknown size, assigning category colours would be arbitrary and would compete with the intensity ramp. |

**Contrast:** all listed text/background pairs are intended to meet WCAG 2.1 AA. These values are **Proposed** and must be verified with a contrast checker before use — they are not asserted as compliant (§11.1).

### 3.2 Typography (Proposed)

| Item | Value |
|---|---|
| Primary typeface | A neutral humanist sans available across the supported scripts. **Because the supported languages are TBD (PRD A-03), the typeface cannot be finalized** — the chosen family must cover every demo language's script. A system font stack is the safe default: `system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`, with a Noto family added for any script the system stack does not cover. |
| Numeric display | Tabular figures (`font-variant-numeric: tabular-nums`) for all counts, distributions and context values, so figures align down a column in the evidence panel. |
| Monospace | Only for request identifiers on SCR-002. |

**Font hierarchy (Proposed):**

| Level | Size / weight / line-height | Use |
|---|---|---|
| Display | 30px / 600 / 1.2 | Page title on SCR-001 |
| H1 | 24px / 600 / 1.3 | Page titles |
| H2 | 19px / 600 / 1.35 | Panel and section titles ("Why this region?") |
| H3 | 16px / 600 / 1.4 | Sub-sections, hotspot name in list rows |
| Body | 15px / 400 / 1.55 | Default text, citizen request text |
| Body small | 13px / 400 / 1.5 | Metadata, helper text, provenance notes |
| Label | 13px / 600 / 1.4, slight letter-spacing | Form labels, table headers, signal names |
| Metric | 26px / 600 / 1.1, tabular | Headline figures in the evidence panel |

### 3.3 Spacing, radius, shadow, iconography (Proposed)

- **Spacing scale (4px base):** 4, 8, 12, 16, 24, 32, 48, 64.
- **Radius:** 4px inputs and chips · 8px cards and panels · 999px pills/badges. Nothing larger — rounded-heavy styling reads as consumer software and sits badly in a government-facing analytical tool.
- **Shadow:** two levels only. Level 1 (`0 1px 2px rgba(22,32,43,.08)`) for cards. Level 2 (`0 8px 24px rgba(22,32,43,.16)`) for overlay sheets and popovers. The map panel uses a border, not a shadow, to avoid visual noise over tiles.
- **Iconography:** a single open-source line-icon set (specific set **TBD**), 20px default, `currentColor`, 1.5px stroke. **Icons never carry meaning alone** — every icon that conveys state is paired with text (DG-08). Required icons: microphone, stop, play, send, filter, close, chevron, info, warning, error, check, map, list, location.

---

## 4. Design Tokens (Proposed)

Implemented as CSS custom properties in `src/styles/tokens.css` (FSD §3). Values are **Proposed**; token *names* should be treated as the stable contract between Design and FSD.

```css
:root {
  /* Colour — brand & surface */
  --color-primary:        #1F4E79;
  --color-primary-hover:  #173C5E;
  --color-secondary:      #2D7D6E;
  --color-background:     #F6F7F9;
  --color-surface:        #FFFFFF;
  --color-surface-alt:    #EEF1F5;
  --color-text:           #16202B;
  --color-text-muted:     #5A6673;
  --color-border:         #D7DDE4;

  /* Colour — status */
  --color-success:        #2E7D52;
  --color-warning:        #9A6512;
  --color-error:          #A62C2C;
  --color-focus:          #1F4E79;

  /* Colour — data encoding */
  --intensity-1: #E3ECF4;
  --intensity-2: #B9CFE3;
  --intensity-3: #89AECD;
  --intensity-4: #5789B3;
  --intensity-5: #2D6193;
  --severity-low:    var(--intensity-2);
  --severity-medium: var(--intensity-4);
  --severity-high:   var(--intensity-5);

  /* Typography */
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
  --text-display: 1.875rem;
  --text-h1:      1.5rem;
  --text-h2:      1.1875rem;
  --text-h3:      1rem;
  --text-body:    0.9375rem;
  --text-small:   0.8125rem;
  --text-metric:  1.625rem;
  --leading-tight: 1.2;
  --leading-body:  1.55;

  /* Spacing */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;

  /* Radius */
  --radius-sm: 4px; --radius-md: 8px; --radius-pill: 999px;

  /* Shadow */
  --shadow-1: 0 1px 2px rgba(22,32,43,.08);
  --shadow-2: 0 8px 24px rgba(22,32,43,.16);

  /* Layout */
  --container-narrow: 640px;   /* citizen screens */
  --container-wide:  1440px;   /* dashboard */
  --panel-width:      420px;   /* SCR-004 docked panel */
  --header-height:     56px;

  /* Motion */
  --motion-fast: 120ms;
  --motion-base: 200ms;
  --easing: cubic-bezier(.2,.0,.2,1);
}
```

**Dark mode:** not in MVP scope. Nothing in the PRD requires it, and it would double the contrast-verification work. Because colours are tokenized, adding it later is a token override, not a rewrite. Classification: **Proposed exclusion**.

---

## 5. Layout

### 5.1 Grid and container

| Context | Grid |
|---|---|
| Citizen screens (SCR-001/002) | Single column, `max-width: var(--container-narrow)`, centred, `--space-5` page padding. |
| Dashboard (SCR-003/004) | 12-column fluid grid, `max-width: var(--container-wide)`, `--space-4` gutters. Desktop allocation: map region 7 columns, list region 5 columns, with the detail panel docked at `--panel-width` over the list region when open. |
| Static (SCR-005/006) | Single column, narrow container. |

### 5.2 Navigation and header

A single slim header (`--header-height`) present on all screens: product name at left; two links, **Submit a request** and **Dashboard**; a **Method & data** link at right (SCR-005). No sidebar navigation — there are four real destinations and a sidebar would consume horizontal space the map needs.

**A dataset-provenance strip** sits directly beneath the header on the dashboard when the loaded dataset is synthetic: a single quiet line stating that the displayed data is synthetic/curated demo data. This is a deliberate design decision serving DG-03 and PRD R-08 — the provenance claim belongs where the data is read, not only on a separate page.

### 5.3 Footer

Minimal, on citizen and static screens only: a link to SCR-005 and a one-line statement that the platform supports human decision-making and does not make policy decisions (DG-04). Omitted on the dashboard to preserve vertical space.

### 5.4 Dashboard layout and the map/detail relationship

Three regions, fixed in position so the user's spatial memory holds across interactions:

```
┌──────────────────────────────────────────────────────────────┐
│ Header                                                        │
├──────────────────────────────────────────────────────────────┤
│ Provenance strip (when data is synthetic)                     │
├──────────────────────────────────────────────────────────────┤
│ FilterBar (FC-008)                       [n hotspots shown]   │
├───────────────────────────────┬──────────────────────────────┤
│                               │  HotspotList (FC-010)        │
│   HotspotMap (FC-009)         │  ranked, scrollable          │
│   + MapLegend (FC-011)        │                              │
│                               │  ┌────────────────────────┐  │
│                               │  │ Detail panel SCR-004   │  │
│                               │  │ docked over list when  │  │
│                               │  │ a hotspot is selected  │  │
│                               │  └────────────────────────┘  │
└───────────────────────────────┴──────────────────────────────┘
```

**Relationship rules:**
- The map never opens a large popup. Selection highlights the area and opens the panel (FSD §9.3). Reason: evidence content must be scrollable, keyboard-navigable and readable without the map — a Leaflet popup satisfies none of those.
- The panel docks over the list rather than shrinking the map, so the selected area stays visible at its familiar position and size.
- Selection is bidirectional and always mirrored in both regions.
- The map is never the only place a piece of information exists (DG-08).

---

## 6. Page-by-Page Design

---

### SCR-001 — Citizen Request Interface

| Aspect | Design |
|---|---|
| **Purpose** | Let a citizen report a need by voice or text with minimum friction (FR-001, FR-002). |
| **User** | ROLE-01 Citizen |
| **Layout** | Narrow single column; mobile-first. Header → short intro line → mode toggle → input area → optional details → submit. |
| **Sections** | (1) Intro: one sentence on what happens to the request; (2) Mode toggle: Speak / Type; (3) Input: recorder or textarea; (4) Optional details: language, location (collapsed by default under "Add location or language"); (5) Submit. |
| **Components** | DC-01 `ModeToggle` · DC-02 `RequestTextArea` · DC-03 `VoiceRecorderControl` · DC-04 `OptionalDetailsDisclosure` (wrapping DC-05 `LanguagePicker`, DC-06 `LocationPicker`) · DC-07 `PrimaryActionButton` |
| **Visual hierarchy** | The input area dominates — roughly half the viewport height on mobile. Optional details are visually recessive (collapsed, muted label). The submit button is the only primary-coloured element on the page. |
| **Primary action** | Submit request. |
| **Secondary actions** | Switch mode; re-record; expand optional details. |
| **Data shown** | Nothing from the server except the language list and area list (both degrade silently). |
| **Loading** | Submit enters a busy state with a spinner and the label "Sending…"; inputs become read-only rather than disappearing. |
| **Empty** | N/A. |
| **Error** | Field errors appear beneath the field in `--color-error` with an error icon and text. Form-level failure appears as a bordered block above the submit button, stating the text was kept and offering Retry. Microphone denial replaces the recorder with an inline explanatory block and switches to text mode — it does not look like a crash (DG-10). |
| **Success** | Navigates to SCR-002. |
| **Traces to** | FR-001, FR-002, FR-004, FR-008, NFR-005, NFR-006 |

---

### SCR-002 — Submission Status / Confirmation

| Aspect | Design |
|---|---|
| **Purpose** | Confirm receipt and reflect back what the system understood (FR-015). |
| **User** | ROLE-01 |
| **Layout** | Narrow single column: confirmation header → status block → interpretation card → next actions. |
| **Sections** | (1) Confirmation with request identifier (monospace, copyable); (2) Processing status; (3) "What we understood" card; (4) "Submit another request". |
| **Components** | DC-08 `StatusBanner` · DC-09 `InterpretationCard` · DC-07 |
| **Visual hierarchy** | The confirmation is the headline. The interpretation card is secondary and appears only once values exist. |
| **Data shown** | State; transcript (voice, marked as a machine transcript); detected language; category; issue summary; severity; resolved area. |
| **Loading** | The interpretation card shows labelled skeleton rows with the status banner reading "Processing your request" — each field appears as it becomes available, so progress is legible. |
| **Empty** | Unknown ID → neutral "We couldn't find that request" with a link back to SCR-001. Not styled as an error. |
| **Error** | Extraction or transcription failure → status banner in `--color-warning`, stating the request was received and will be reviewed, but automatic interpretation did not complete. **No interpretation card is rendered** — a wrong guess would be worse than an absence (DG-03). |
| **Success** | Status banner in `--color-success`; interpretation card fully populated. |
| **Traces to** | FR-003, FR-005, FR-006, FR-015 |

---

### SCR-003 — Policymaker Dashboard

Covered in depth in §7.

| Aspect | Design (summary) |
|---|---|
| **Purpose** | Show where demand concentrates, on a map and as a ranked list (FR-009, FR-010, FR-014). |
| **User** | ROLE-02 |
| **Layout** | §5.4. |
| **Components** | DC-10 `FilterBarDesign` · DC-11 `HotspotMapDesign` · DC-12 `MapLegendDesign` · DC-13 `HotspotListRow` · DC-20 `ProvenanceStrip` |
| **Primary action** | Select a hotspot. |
| **Secondary actions** | Filter, clear filters, pan/zoom, toggle map/list emphasis. |
| **Loading** | Base map renders immediately; hotspot layer shows a translucent overlay with a spinner; the list shows five skeleton rows. Filters stay interactive throughout. |
| **Empty** | Two distinct designs — see §7.6. |
| **Error** | Hotspot fetch failure: an inline error block replaces the list, and the map shows the same message as a centred card over the base layer, with one shared Retry. Tile failure: the map region becomes a neutral panel with a short explanatory line; the list is unaffected and unmarked. |
| **Traces to** | FR-007, FR-009, FR-010, FR-014, NFR-001, NFR-005 |

---

### SCR-004 — Hotspot Detail: Evidence, Context, Interventions

Covered in depth in §7.3–§7.5.

| Aspect | Design (summary) |
|---|---|
| **Purpose** | Answer "Why this region?", show context with provenance, and present candidate interventions as suggestions (FR-011, FR-012, FR-013). |
| **User** | ROLE-02 |
| **Layout** | Docked panel (desktop), overlay sheet (tablet), full screen (mobile). Fixed section order — see §7.3. |
| **Components** | DC-14 `EvidenceSignalRow` · DC-15 `DistributionBar` · DC-16 `ContextIndicatorRow` · DC-17 `InterventionCard` · DC-18 `ContributingRequestItem` · DC-19 `ProvenanceTagDesign` |
| **Primary action** | None. This screen is for reading and judgement. The absence of a primary action button is intentional — the product has no decision capability and must not imply one (DG-04). |
| **Secondary actions** | Expand contributing requests; toggle original/translated text; close panel; copy link. |
| **Loading** | Headline aggregates appear instantly from the cached list row; each section below loads independently with its own skeleton. |
| **Empty** | Per-section, explicit: "No context data is available for this area"; "No candidate interventions were produced for this hotspot." |
| **Error** | Per-section error blocks with Retry. Evidence is prioritized: if interventions fail, nothing else is affected; if evidence fails, the panel says so plainly and does **not** substitute a bare ranking figure (NFR-012). |
| **Traces to** | FR-011, FR-012, FR-013, NFR-012 |

---

### SCR-005 — Method & Data Provenance

| Aspect | Design |
|---|---|
| **Purpose** | State in one place what the data is, what the AI does, which signals drive hotspots, and that the system is decision-support only (**Proposed** screen; FSD SCR-005). |
| **User** | ROLE-02 and the demo audience. |
| **Layout** | Narrow single column, long-form prose with a data-sources table. |
| **Sections** | (1) What this system does and does not do; (2) Data sources table with provenance and verification status, including explicit "TBD / requires verification" rows; (3) How hotspots are produced; (4) Where AI is used and where deterministic logic is used; (5) Known limitations, including that a map cannot be made fully accessible and that synthetic data does not describe the real world. |
| **Components** | Static content + DC-19. |
| **Visual hierarchy** | Plain document styling; no cards, no dashboard chrome. This page should read as documentation, because it is. |
| **Traces to** | NFR-012, FR-011, AC-014, AC-015 |

---

### SCR-006 — Not Found / Route Error

Centred card on the page background: short heading, one explanatory line, two links (Submit a request, Dashboard). Neutral colour, no error styling for a simple wrong URL; `--color-error` accent only for an actual application error. Serves NFR-007 — never a blank screen during a demo.

---

## 7. Policymaker Dashboard in Depth

### 7.1 Geographic map (DC-11)

- Base tiles fill the map region edge to edge; the region is bordered, not shadowed.
- Areas with geometry render as filled polygons using the five-step intensity ramp, at ~70% opacity with a 1px border in `--color-border` so boundaries stay legible over tiles.
- Areas without geometry render as circular centroid markers, sized by the same metric, with a dashed outline marking reduced fidelity (FSD §9.2).
- Selected area: 3px `--color-primary` outline plus increased fill opacity. Two cues, so selection is not conveyed by colour alone.
- Hover/focus: a compact tooltip with area name, request count, dominant category. Nothing more — depth belongs in the panel (DG-06).
- Map controls (zoom, reset view) are surface-coloured cards in the top-left, clear of the legend.

### 7.2 Hotspot visibility, legend and filters

**Legend (DC-12)** sits bottom-left over the map on a surface card. It names the metric explicitly — for example "Shading: citizen requests per area" — and shows the five-step ramp with numeric range labels. **The legend is mandatory, not decorative:** unexplained shading would be a visual version of the opaque score the product forbids (DG-01, NFR-012).

**FilterBar (DC-10)** is a single horizontal row above both regions: category, severity, area, time window (the final filter set is **TBD**, FSD FC-008), plus a result count at the right and a Clear action that appears only when filters are active. Active filters render as removable pills beneath the row on narrow widths. Filters are never placed on the map — map real estate is scarce and filter state must be readable when the map fails.

**HotspotList rows (DC-13)** each show: rank, area name, request count (tabular metric), dominant category chip, and a compact severity distribution bar (DC-15) with numeric labels. A row carries enough to decide without the map (DG-08). Selected row: left border in `--color-primary` plus `--color-surface-alt` background.

### 7.3 Evidence — the "Why this region?" section (DC-14, DC-15, DC-18)

This is the most important region of the product and has a fixed structure:

1. **Heading:** "Why this region?" — the literal question from FR-012, used verbatim.
2. **Signals used** — one row per signal: signal label at left, value at right in tabular figures, with a distribution bar where the signal is a distribution. Rows are plain and table-like, not cards, so values align and scan vertically.
3. **Signals not available** — a visually distinct block (surface-alt, muted text, warning icon) listing each unavailable signal and its reason. **This block is always rendered when any signal is unavailable; it is never collapsed by default and never omitted** (AC-013, DG-03).
4. **Method line** — which aggregation method and version produced this hotspot, in small muted text.
5. **Contributing requests** — a collapsed disclosure, "View the N citizen requests behind this". Expanded, each item (DC-18) shows original text, a language chip, category and severity chips, a "machine transcript" marker for voice requests, and a toggle between original and translated text.

**Design prohibitions on this section:** no gauge, no single 0–100 figure, no letter grade, no radar chart, no coloured "priority" badge without its components adjacent. If a ranking is displayed, the named metric producing it is displayed beside it (§12.5 of TAD).

### 7.4 Context: demographic, infrastructure, investment (DC-16, DC-19)

Three labelled groups, one row per indicator (DC-16): label · value with unit · provenance tag (DC-19) · vintage in muted small text.

Provenance tag styling (**Proposed**):

| Provenance | Style |
|---|---|
| Public | Neutral outline pill, muted text |
| Synthetic | Outline pill with a dotted border, muted text, label "Synthetic" |
| Curated / mock | Outline pill, `--color-warning` text and border |
| Unavailable | Full row rendered in `--color-surface-alt` with muted italic text: "Not available for this area" — **and for unverified sources, the appended note "TBD / requires verification"** |

**Hard design rule:** an unavailable indicator occupies a visible row. It is never a zero, never a dash, never silently dropped (AC-014, AC-015). Absence of evidence is itself evidence a planner needs.

### 7.5 Candidate interventions (DC-17)

- Rendered last, under a heading such as "Candidate interventions — for your consideration".
- A persistent, non-dismissible note above the list: the system does not prioritize or decide; these are suggestions based on the evidence above.
- Each card (DC-17): title, one short rationale paragraph, chips naming the evidence signals it responds to, and a source label ("AI-generated suggestion" or "From a curated rule set").
- **Visual weight below the evidence section:** secondary borders, no primary colour, no action buttons. Nothing on this card is clickable except the linked-signal chips, which scroll to the corresponding evidence row.
- Empty state: "No candidate interventions were produced for this hotspot." Filler suggestions are prohibited (FR-013 edge case).

### 7.6 Avoiding clutter — the explicit rules

1. **One metric on the map.** The map encodes exactly one value; everything else lives in the list and the panel.
2. **Three regions only.** Filters, map+list, panel. No extra widgets, KPI tiles, sparkline strips or activity feeds.
3. **No category colour palette.** Categories are neutral chips (§3.1).
4. **Detail is disclosed, not displayed.** Contributing request text is collapsed by default.
5. **No decorative chrome over the map** — no gradients, no floating brand elements.
6. **Two empty states, worded differently:** "No processed requests are loaded yet" (nothing seeded) versus "No hotspots match these filters" with a Clear action (AC-012). Conflating them would make a filter mistake look like a broken system.

---

## 8. Citizen Request Interface in Depth

### 8.1 Mode toggle (DC-01)
A two-option segmented control, "Speak" and "Type", equal in width and weight, with icon plus label on each. Implemented as radio semantics, not buttons, so screen readers announce it as a choice of two. Switching modes preserves whatever the citizen has already entered in the other mode.

### 8.2 Text input (DC-02)
A single large textarea, minimum ~6 rows, with a persistent visible label and a helper line: "Describe the problem in your own words, in any supported language." A character counter appears only when approaching the limit (limit **TBD**) — a permanent counter implies a constraint that does not usually apply and discourages detail.

### 8.3 Voice input (DC-03)
- **Idle:** a large circular record button with a microphone icon and the label "Start recording".
- **Recording:** the button becomes "Stop", with elapsed time in tabular figures and a simple level indicator. **No waveform animation** — it is decorative, costs build time, and adds motion for no informational gain (§9.5).
- **Recorded:** playback control, duration, "Re-record", and the recording is retained in memory so a failed submit does not lose it.
- **Denied/unsupported:** the recorder is replaced by an inline block explaining that the microphone is unavailable and that typing works just as well, with the mode switched automatically (AC-004). Styled as information, not error.
- Every state change is announced in text as well as visually (§11).

### 8.4 Language handling (DC-05)
Collapsed inside "Add location or language" and labelled "Language (optional — we detect it automatically)". The option list is data-driven from API-008; the actual languages are **TBD** and must not be hard-coded in the design or the markup.

### 8.5 Location input (DC-06)
Two controls in one group: a free-text location field, and an area select populated from API-007. A short muted hint: "Adding a location helps your request be counted in your area." If neither is provided, a non-blocking note appears above the submit button explaining that the request may not appear in the geographic view. Optional device-location is a small secondary button; denial is silent and non-blocking.

### 8.6 Submission, processing, validation and result states

| State | Design |
|---|---|
| **Validation error** | Message beneath the field, error icon plus text, field border in `--color-error`, focus moved to the first invalid field. Never colour alone. |
| **Submitting** | Submit button busy with spinner and "Sending…"; inputs read-only but visible; live-region announcement. |
| **Processing** (SCR-002) | Status banner with a spinner and plain-language text; interpretation fields fill in progressively. |
| **Success** | `--color-success` banner, check icon, request identifier, populated interpretation card. |
| **Error** | `--color-error` block naming what failed, confirming the input was kept, and offering Retry. |
| **Partial** | `--color-warning` banner: received but not fully interpreted. No fabricated interpretation shown. |

---

## 9. Interaction Design

### 9.1 Control states

| State | Treatment |
|---|---|
| **Default** | Surface background, `--color-border` outline, `--color-text` label. |
| **Hover** | Primary buttons darken to `--color-primary-hover`; secondary controls take `--color-surface-alt`; list rows take `--color-surface-alt`. Transition `--motion-fast`. Hover is never the only way to reach information (touch and keyboard users must not lose anything). |
| **Focus** | 3px `--color-focus` ring with a 2px light offset, on every focusable element, always visible, never suppressed. Focus styling is deliberately more prominent than hover. |
| **Active/pressed** | 1px downward shift or a slightly darker fill; no scale transforms. |
| **Selected** | List row: left border `--color-primary` + surface-alt fill. Map area: 3px primary outline + increased opacity. Two cues in both cases. |
| **Disabled** | 45% opacity, `not-allowed` cursor, `aria-disabled`. A disabled submit button is always accompanied by visible text explaining what is missing — a dead button with no explanation is a common and avoidable failure. |
| **Loading** | Skeleton blocks in `--color-surface-alt` for content; inline spinner in buttons; translucent overlay + spinner for the map layer. Skeletons mirror the real layout so nothing jumps on arrival. |
| **Empty** | Centred block: short heading, one explanatory sentence, one action where an action exists. Neutral colour — an empty result is not an error. |
| **Error** | Bordered block, `--color-error` icon and heading, plain-language cause, retry action, explicit statement of whether the user's data survived. |
| **Success** | `--color-success` banner or toast; toasts auto-dismiss, banners do not. |

### 9.2 Transitions
Only three: opacity/transform fade for panel and sheet entry (`--motion-base`); colour transitions on hover/focus (`--motion-fast`); skeleton-to-content cross-fade (`--motion-fast`). Map pan/zoom uses Leaflet's defaults.

### 9.3 Micro-interactions (the complete list)
1. Selecting a list row pans the map to the area and opens the panel.
2. Selecting a map area scrolls the list to that row and opens the panel.
3. Clicking an intervention's signal chip scrolls the evidence section to that signal row and briefly highlights it.
4. Copying a request identifier shows a brief "Copied" confirmation.
5. Recording elapsed-time counter.

### 9.4 Motion accessibility
`prefers-reduced-motion: reduce` removes all transitions and cross-fades; state changes become instant. No parallax, autoplay, or looping animation exists anywhere.

### 9.5 Animations deliberately excluded
Waveform visualization, animated map heat pulsing, count-up number animation, page transitions, loading mascots, confetti on submission. Each costs build time in a 7-day window, adds motion-sensitivity risk, and — for count-up animation especially — makes data harder to read.

---

## 10. Responsive Design

Breakpoints are **Proposed** and match FSD §11.

### Desktop (≥1200px) — reference layout for the dashboard
Three-region dashboard (§5.4); detail panel docked at `--panel-width`; filters as a single row; citizen screens centred in the narrow container with generous whitespace.

### Tablet (768–1199px)
- **Dashboard:** map on top (~55% viewport height), list beneath. Detail opens as an overlay sheet covering the lower ~70%, with the map still visible above so the selected area remains in view.
- **Filters:** remain a row; overflow collapses into a "More filters" disclosure.
- **Citizen screens:** unchanged single column, wider padding.

### Mobile (<768px)
- **Dashboard:** list-first by default — on a small screen a ranked list is more useful than a cramped map, and it is already the accessible equivalent (DG-08). A persistent Map/List toggle switches to a full-bleed map.
- **Filters:** a single "Filters" button opening a bottom sheet; active filters shown as pills beneath the header.
- **Detail:** full-screen sheet with a sticky header carrying the area name and a close control; sections stack in the same fixed order.
- **Citizen screens:** full-width fields, ≥44px tap targets, record button at least 64px, submit button full-width and sticky at the bottom of the viewport.

**Invariants at every width:** no horizontal page scrolling (AC-019); the full citizen submission flow works on mobile; the full evidence workflow (filter → select → evidence → context → interventions) is completable at every width; wide content (long request text, indicator tables) scrolls within its own container, never the page.

---

## 11. Accessibility

Target **WCAG 2.1 AA** (**Proposed** target; the underlying topics are Confirmed via NFR-005). Aligned with FSD §12.

### 11.1 Contrast
- Body and label text on `--color-surface` and `--color-background` are intended to meet 4.5:1; large text and meaningful non-text elements 3:1.
- Status colours are used with text, never alone.
- The intensity ramp's darkest steps carry white text where numbers are overlaid; lighter steps carry dark text.
- **These are design intentions and must be verified with a contrast tool before the values are locked.** They are **Proposed**, not certified.

### 11.2 Keyboard navigation
- Logical tab order following visual order: header → filters → map (skippable) → list → panel.
- A "Skip to hotspot list" link lets keyboard users bypass the map entirely.
- List rows are focusable controls activated by Enter/Space.
- The panel traps focus when it is an overlay, closes on `Escape`, and returns focus to the element that opened it.
- No keyboard trap in the map.

### 11.3 Focus indicators
A single consistent, high-contrast focus ring on every focusable element. Never removed. Visible on both light and dark surfaces, including map controls.

### 11.4 Semantic structure
One `h1` per page; no skipped heading levels; landmark regions (`header`, `nav`, `main`, `aside` for the panel); the hotspot list is a real list; evidence signals are a description list or a table with proper headers — not styled `div`s.

### 11.5 Labels
Every control has a persistent visible label; placeholders never replace labels; required and optional fields are stated in text; the mode toggle has a group label; the voice recorder's current state is in its accessible name.

### 11.6 ARIA
Used only where native semantics fall short: `aria-live="polite"` for submission outcomes, processing transitions and filter result counts; `aria-busy` during loading; `aria-describedby` linking errors to fields; `aria-expanded` on disclosures; `role="dialog"` + `aria-modal` on overlay sheets; an accessible name on the map container that points to the list alternative.

### 11.7 Screen-reader compatibility
- Filter changes announce the new result count.
- Hotspot selection announces the area name and headline figures.
- Distribution bars have text equivalents adjacent — the bar is decoration over a stated number, never the only carrier of the value.
- Skeletons are hidden from assistive technology; a status message conveys loading instead.

### 11.8 Accessible error messaging
Errors are announced, programmatically associated with their field, written in plain language (no codes), state whether the user's input survived, and always pair an icon with text.

### 11.9 Map alternatives
- FC-010 / DC-13 is the designated equivalent and is never removed from the DOM at any breakpoint.
- The legend is text-based, so the encoding is readable without perceiving the shading.
- Every value encoded on the map appears as text somewhere on the page.
- **Stated limitation (per NFR-005 and DG-08):** an interactive geospatial visualization cannot be made fully equivalent for non-visual users. The list view exists because of this, and SCR-005 states the limitation openly rather than implying the map is accessible.

---

## 12. Design-to-Implementation Mapping

| Design component | FSD component | Screen | PRD requirement |
|---|---|---|---|
| DC-01 `ModeToggle` | FC-001 `RequestForm` | SCR-001 | FR-001, FR-002 |
| DC-02 `RequestTextArea` | FC-002 `TextRequestInput` | SCR-001 | FR-001 |
| DC-03 `VoiceRecorderControl` | FC-003 `VoiceRecorder` | SCR-001 | FR-002, FR-003 |
| DC-04 `OptionalDetailsDisclosure` | FC-001 (composition) | SCR-001 | FR-004, FR-008 |
| DC-05 `LanguagePicker` | FC-004 `LanguageSelector` | SCR-001 | FR-004 |
| DC-06 `LocationPicker` | FC-005 `LocationInput` | SCR-001 | FR-008 |
| DC-07 `PrimaryActionButton` | FC-006 `SubmitButton` + `Button` primitive | SCR-001, SCR-002 | FR-001, FR-002 |
| DC-08 `StatusBanner` | FC-007 `RequestStatusCard` | SCR-002 | FR-006, FR-015 |
| DC-09 `InterpretationCard` | FC-007 `RequestStatusCard` | SCR-002 | FR-003, FR-005, FR-015 |
| DC-10 `FilterBarDesign` | FC-008 `FilterBar` | SCR-003 | FR-014 |
| DC-11 `HotspotMapDesign` | FC-009 `HotspotMap` | SCR-003 | FR-009, FR-010 |
| DC-12 `MapLegendDesign` | FC-011 `MapLegend` | SCR-003 | FR-010, NFR-012 |
| DC-13 `HotspotListRow` | FC-010 `HotspotList` | SCR-003 | FR-009, FR-014, NFR-005 |
| DC-14 `EvidenceSignalRow` | FC-012 `EvidencePanel` | SCR-004 | FR-012, NFR-012 |
| DC-15 `DistributionBar` | FC-012, FC-010 | SCR-003, SCR-004 | FR-009, FR-012 |
| DC-16 `ContextIndicatorRow` | FC-013 `ContextPanel` | SCR-004 | FR-011 |
| DC-17 `InterventionCard` | FC-014 `InterventionList` | SCR-004 | FR-013 |
| DC-18 `ContributingRequestItem` | FC-015 `RequestEvidenceList` | SCR-004 | FR-012 |
| DC-19 `ProvenanceTagDesign` | `ProvenanceTag` primitive | SCR-004, SCR-005 | FR-011 |
| DC-20 `ProvenanceStrip` | rendered in `AnalystLayout` | SCR-003 | FR-011, NFR-012 |
| DC-21 `EmptyStateDesign` | `EmptyState` primitive | all | FR-014, NFR-007 |
| DC-22 `ErrorStateDesign` | `ErrorState` primitive | all | NFR-007 |
| DC-23 `SkeletonDesign` | `SkeletonBlock` primitive | all | NFR-001, NFR-005 |
| DC-24 `ToastDesign` | FC-017 `ToastHost` | all | NFR-005 |
| — (no visual surface) | FC-016 `A11yAnnouncer` | all | NFR-005 |

### 12.1 Synchronization rules between Design.md and FSD.md

1. Every DC above maps to an existing FC or primitive. No design component exists without an implementation counterpart, and FC-016 is the only FC with no visual surface (it is an announcer).
2. Token **names** in §4 are the contract. Values may be retuned after contrast verification without changing FSD.
3. Screen IDs, routes and states (loading / empty / error / success) are identical in both documents; a change in either must be mirrored.
4. The map/detail relationship (§5.4) matches FSD §9.3 — selection opens a panel, never a large map popup.
5. Accessibility requirements in §11 restate FSD §12 with visual specifics; neither may weaken the other.
6. Both documents state the same design prohibitions: no opaque score, no colour-only encoding, no unlabelled context value, no filler intervention, no fabricated interpretation after a pipeline failure.
