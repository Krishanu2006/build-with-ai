# Frontend Specification Document

**Product name:** TBD — working name **"CivicSignal"** *(Proposed)*
**Document:** FSD.md
**Version:** 0.1 (Draft)
**Status:** Draft — derived from PRD.md v0.1
**Depends on:** `PRD.md` (requirement IDs FR-xxx / NFR-xxx / UC-xxx are defined there)

> Classification labels (**Confirmed / Derived / Proposed / TBD**) carry the same meaning as in PRD.md §0. Nothing here is Confirmed unless labelled Confirmed. Every screen and component below traces to a PRD requirement; nothing is introduced without a requirement behind it.

---

## Table of Contents

1. [Frontend Overview](#1-frontend-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Application Structure](#3-application-structure)
4. [Pages / Screens](#4-pages--screens)
5. [Component Specification](#5-component-specification)
6. [State Management](#6-state-management)
7. [API Integration](#7-api-integration)
8. [Forms](#8-forms)
9. [Map UX](#9-map-ux)
10. [Error Handling](#10-error-handling)
11. [Responsive Behavior](#11-responsive-behavior)
12. [Accessibility](#12-accessibility)
13. [Frontend Traceability](#13-frontend-traceability)

---

## 1. Frontend Overview

| Aspect | Decision | Classification |
|---|---|---|
| Framework | React | **Confirmed** |
| Language | TypeScript | **Confirmed** |
| Build tool | Vite | **Confirmed** |
| Map technology | Leaflet | **Confirmed** (direction) |
| React bindings for Leaflet | React Leaflet, or direct Leaflet instance managed inside a single wrapper component | **Proposed** — see §9.1 |
| Styling approach | Plain CSS with CSS custom properties (design tokens), colocated per-component stylesheets or CSS Modules | **Proposed** — no styling approach was established. Rationale: zero build configuration beyond Vite defaults, no runtime cost, and the token set in Design.md maps directly onto CSS custom properties. A utility-CSS framework is an acceptable substitute if the team is faster with it; the token names must survive either way. |
| Routing | React Router | **Proposed** — multiple distinct screens (SCR-001…SCR-004) require URL-addressable routes; deep-linking a hotspot is needed for the demo. |
| Server/API state | React Query (TanStack Query) | **Proposed** — see §2.6 for the justification and the no-library fallback. |
| Global client state | **None.** React Context only where genuinely shared (see §6) | **Derived** — PRD/scope guidance is explicit that Redux/Zustand must not be introduced without justification; none exists. |
| API communication | `fetch` wrapped in a thin typed client module | **Proposed** — avoids an HTTP-client dependency for a small surface. |
| Charts | Lightweight inline SVG / CSS bars for severity and category distributions | **Proposed** — the distributions in FR-012 are small; a charting library is not justified. |

**Confirmed constraint carried into the frontend:** the UI is decision-support. No screen may present a priority signal without its evidence (NFR-012), and candidate interventions must always be visibly labelled as suggestions (FR-013).

---

## 2. Frontend Architecture

### 2.1 Component architecture

**Classification: Proposed** (structure), **Derived** (the components themselves, from PRD features).

Three tiers, no deeper:

1. **Primitives** — `Button`, `Field`, `Select`, `Badge`, `Spinner`, `EmptyState`, `ErrorState`, `ProvenanceTag`. Presentational, no data fetching.
2. **Feature components** — `HotspotMap`, `HotspotList`, `EvidencePanel`, `ContextPanel`, `InterventionList`, `RequestForm`, `VoiceRecorder`. Own their feature's interaction logic; receive data via props or a feature hook.
3. **Pages** — compose feature components, own routing parameters and the data-fetching hooks.

**Rule:** data fetching happens in pages and feature hooks, never inside primitives. This keeps every visual component testable with static props during a 7-day build.

### 2.2 Page architecture

Pages map 1:1 to routes (§4). Each page is responsible for: reading route/query params, invoking its hooks, and rendering exactly one of `loading` / `error` / `empty` / `content`. That four-state contract is uniform across pages so it can be reviewed quickly (AC-012, AC-021).

### 2.3 Layout architecture

| Layout | Used by | Description |
|---|---|---|
| `PublicLayout` | SCR-001, SCR-002 | Narrow, single-column, mobile-first. Minimal header, no sidebar. |
| `AnalystLayout` | SCR-003, SCR-004 | Header + filter bar + main map/list region + right-hand detail panel. Desktop-first per NFR-006. |
| `BareLayout` | SCR-005, SCR-006 | Static content / error pages. |

**Classification: Derived** from NFR-006 (citizen interface mobile-first, dashboard desktop-first).

### 2.4 Local state

Component-scoped `useState` / `useReducer` for: form field values, recorder state, panel tab selection, map viewport, popover open/closed. Not lifted unless two siblings need it.

### 2.5 Global state

Only two things are genuinely global (**Derived**):

- **UI locale / display language** of the interface itself — a small React Context. (Distinct from the *content* language of a citizen request, which is per-request data.) Whether the interface itself is localized for the MVP is **TBD**; if it is not, this context is dropped.
- **Toast/notification queue** — a React Context, used for submission success/failure and background refresh failures.

No global store holds server data. Filters live in the URL query string (§6), not in a store — this makes a filtered dashboard state shareable and survives reloads during a demo.

### 2.6 Server/API state

**Proposed: React Query.** Justification, since the scope rules require one: the dashboard needs request de-duplication between the map and list views rendering the same result set (AC-011), cached hotspot detail when the user moves between hotspots, and polling for submission processing state (FR-015). Hand-rolling those three behaviors costs more than the dependency.

**Fallback if the team prefers zero dependencies:** a `useAsync` hook plus a module-level `Map` cache keyed by request URL. The rest of this document does not depend on which option is chosen — the hook names in §5 are stable either way.

### 2.7 Form handling

**Proposed:** controlled components with a small local validation function per form. No form library — there is one substantive form (the citizen request, §8) and it has four fields.

### 2.8 Validation

Two layers (**Derived** from NFR-004):

- **Client-side**, for immediate feedback: required text, minimum/maximum length (thresholds **TBD**), audio present, audio duration within limits (limit **TBD**).
- **Server-side authoritative** — the client never assumes its own validation is sufficient. Server field errors are rendered against the corresponding field.

### 2.9 Error handling

A single `ErrorState` primitive plus a route-level React error boundary. Every failure is classified into one of the categories in §10 and rendered with: what failed, whether the user's data was kept, and what action is available (retry / switch input mode / continue). Errors never render raw AI or server text as HTML (NFR-004).

---

## 3. Application Structure

**Classification: Proposed.** Only directories justified by this specification appear.

```
frontend/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx                     # router + providers
    ├── routes.tsx
    ├── layouts/
    │   ├── PublicLayout.tsx
    │   ├── AnalystLayout.tsx
    │   └── BareLayout.tsx
    ├── pages/
    │   ├── CitizenRequestPage.tsx      # SCR-001
    │   ├── SubmissionStatusPage.tsx    # SCR-002
    │   ├── DashboardPage.tsx           # SCR-003
    │   ├── HotspotDetailPage.tsx       # SCR-004  (renders as panel within SCR-003 on desktop)
    │   ├── MethodPage.tsx              # SCR-005  (Proposed)
    │   └── NotFoundPage.tsx            # SCR-006
    ├── components/
    │   ├── primitives/             # Button, Field, Select, Badge, Spinner, EmptyState, ErrorState, ProvenanceTag
    │   ├── request/                # FC-001..FC-007
    │   ├── dashboard/              # FC-008..FC-011
    │   └── evidence/               # FC-012..FC-015
    ├── hooks/
    │   ├── useHotspots.ts
    │   ├── useHotspotDetail.ts
    │   ├── useRequestStatus.ts
    │   ├── useSubmitRequest.ts
    │   ├── useVoiceRecorder.ts
    │   └── useFilters.ts           # reads/writes URL query params
    ├── services/
    │   ├── apiClient.ts            # fetch wrapper, base URL, error normalization
    │   ├── requests.api.ts         # API-001, API-002, API-003
    │   ├── hotspots.api.ts         # API-004, API-005, API-006
    │   └── reference.api.ts        # API-007, API-008
    ├── types/
    │   └── domain.ts               # CitizenRequest, ProcessedRequest, Hotspot, Evidence, ContextIndicator...
    ├── context/
    │   ├── ToastContext.tsx
    │   └── LocaleContext.tsx       # only if UI localization is in scope (TBD)
    ├── utils/
    │   ├── format.ts               # counts, percentages, severity labels
    │   └── a11y.ts                 # focus helpers, live-region announcer
    └── styles/
        ├── tokens.css              # design tokens from Design.md
        └── global.css
```

Directories deliberately **not** created: `store/`, `middleware/`, `features/` (redundant with `components/*` + `hooks/`), `mocks/` unless the team actually adopts a mocking layer.

---

## 4. Pages / Screens

Screens are derived strictly from the PRD MVP flow and user journeys. Screens that the PRD lists as *possible* but that the MVP does not require are noted.

---

### SCR-001 — Citizen Request Interface

| Field | Value |
|---|---|
| **Page ID** | SCR-001 |
| **Route** | `/submit` *(Proposed path)* |
| **Purpose** | Let a citizen submit a development/public-service request by text or voice (FR-001, FR-002). |
| **Primary user** | ROLE-01 Citizen |
| **Entry point** | Direct link / landing redirect. No authentication (Confirmed: none established). |
| **Layout** | `PublicLayout`, single column, mobile-first. |
| **Components** | FC-001 `RequestForm`, FC-002 `TextRequestInput`, FC-003 `VoiceRecorder`, FC-004 `LanguageSelector`, FC-005 `LocationInput`, FC-006 `SubmitButton`, FC-016 `A11yAnnouncer`, FC-017 `ToastHost` |
| **User actions** | Switch input mode (text / voice); type request; record, review, re-record audio; optionally choose language; optionally set location; submit; recover from error. |
| **Data required** | Supported language list and category taxonomy for display purposes (API-008); geographic area list for optional area selection (API-007). Both degrade: if unavailable, language defaults to auto-detect and location falls back to free text. |
| **API dependencies** | API-001 (text submit), API-002 (voice submit), API-007, API-008 |
| **Loading state** | Reference data loads silently; the form is usable before it arrives. On submit: `SubmitButton` enters a busy state, inputs become read-only, a live-region message announces "Submitting your request". |
| **Empty state** | Not applicable (form page). |
| **Error state** | Field-level messages for validation; a form-level `ErrorState` for network/server failure that explicitly states the typed text has been preserved and offers Retry. Microphone permission denial switches the user to text mode with an inline explanation (AC-004). |
| **Responsive** | Mobile: full-width stacked fields, large tap targets, recorder button prominent. Tablet/desktop: centred column, max width constrained. |
| **Traces to** | FR-001, FR-002, FR-004, FR-008, NFR-005, NFR-006 |

---

### SCR-002 — Submission Status / Confirmation

| Field | Value |
|---|---|
| **Page ID** | SCR-002 |
| **Route** | `/submit/:requestId` *(Proposed path)* |
| **Purpose** | Confirm receipt and show the structured interpretation of the request back to the citizen (FR-015, addressing the Confirmed pain point "lack of visibility into how requests are analyzed"). |
| **Primary user** | ROLE-01 Citizen |
| **Entry point** | Redirect after successful submit; also directly addressable by URL. |
| **Layout** | `PublicLayout` |
| **Components** | FC-007 `RequestStatusCard`, primitives (`Badge`, `Spinner`, `ErrorState`), FC-016, FC-017 |
| **User actions** | Wait / observe; submit another request; copy the request identifier. |
| **Data required** | Request state and, when available: transcript (voice), detected language, category, issue summary, severity, resolved area. |
| **API dependencies** | API-003 |
| **Loading state** | While state is `received` / `transcribed` / `normalized`: a processing indicator with plain-language stage text; polling interval **Proposed** (a few seconds), exact value **TBD**. Polling stops after a bounded number of attempts (**TBD**) and switches to a "still processing — check back later" message rather than spinning forever. |
| **Empty state** | Unknown request ID → "We couldn't find that request" with a link back to `/submit`. |
| **Error state** | Network failure → retry. State `extraction_failed` or `transcription_failed` → the request is confirmed received, and the page says plainly that automatic interpretation did not complete (never shows a fabricated interpretation). |
| **Responsive** | Single column at all widths. |
| **Traces to** | FR-003, FR-004, FR-005, FR-006, FR-015 |

---

### SCR-003 — Policymaker Dashboard (map + hotspot list)

| Field | Value |
|---|---|
| **Page ID** | SCR-003 |
| **Route** | `/dashboard` with filters in the query string, e.g. `?category=…&severity=…&area=…` *(Proposed)* |
| **Purpose** | The primary analytical experience: show demand hotspots geographically and as a ranked list, with filtering (FR-009, FR-010, FR-014). |
| **Primary user** | ROLE-02 Policymaker / planner / analyst |
| **Entry point** | Default landing for the analytical experience. |
| **Layout** | `AnalystLayout`: header · filter bar · map region · hotspot list · detail panel region (SCR-004 renders here on desktop). |
| **Components** | FC-008 `FilterBar`, FC-009 `HotspotMap`, FC-010 `HotspotList`, FC-011 `MapLegend`, FC-016, FC-017, primitives |
| **User actions** | Pan/zoom the map; apply and clear filters; select a hotspot from the map or the list; toggle between map-primary and list-primary views; open a hotspot's detail. |
| **Data required** | Filtered hotspot collection (count, dominant category/theme, severity distribution, area reference, geometry or centroid); geographic area geometry; filter option lists. |
| **API dependencies** | API-004 (hotspots, filtered), API-007 (areas/geometry), API-008 (filter option metadata) |
| **Loading state** | Skeleton list plus a map with the base layer visible and an overlay spinner on the hotspot layer. Filter controls stay interactive; a new filter cancels the in-flight query. |
| **Empty state** | Two distinct empties: (a) **no data at all** — "No processed requests are loaded yet" with guidance to seed (demo context); (b) **no results for these filters** — "No hotspots match these filters" with a Clear filters action (AC-012). |
| **Error state** | Hotspot fetch failure → `ErrorState` over the list and map overlay with Retry; the base map still renders. Base-map tile failure → map area shows a neutral placeholder and the list view remains fully functional (map failure must never block the workflow, NFR-007). |
| **Responsive** | Desktop: map and list side by side, detail panel on the right. Tablet: map above, list below, detail as an overlay sheet. Mobile: list-first with a map toggle; detail opens as a full-screen sheet. |
| **Traces to** | FR-007, FR-009, FR-010, FR-014, NFR-001, NFR-005, NFR-006 |

---

### SCR-004 — Hotspot Detail: Evidence, Context and Candidate Interventions

| Field | Value |
|---|---|
| **Page ID** | SCR-004 |
| **Route** | `/dashboard/hotspot/:hotspotId` (preserves the parent's filter query string) *(Proposed)* |
| **Purpose** | Answer "Why is this region being surfaced?" with named evidence, show contextual data with provenance, and present candidate interventions as suggestions (FR-011, FR-012, FR-013). |
| **Primary user** | ROLE-02 |
| **Entry point** | Selection from FC-009 or FC-010; also directly addressable by URL for the demo. |
| **Layout** | Desktop/tablet: right-hand panel inside `AnalystLayout`, with the corresponding hotspot highlighted on the map. Mobile: full-screen sheet. |
| **Components** | FC-012 `EvidencePanel`, FC-013 `ContextPanel`, FC-014 `InterventionList`, FC-015 `RequestEvidenceList`, `ProvenanceTag`, primitives |
| **User actions** | Read the evidence breakdown; expand the contributing citizen requests; switch between original and translated request text; read context indicators; read candidate interventions; close the panel; copy a shareable link. |
| **Data required** | Hotspot aggregates (request count, category breakdown, severity distribution, geographic concentration measure); contributing request references with original text, normalized/translated text, language, category, severity; context indicators with values, source labels and vintages; candidate interventions with rationale text and generation-source label. |
| **API dependencies** | API-005 (hotspot detail incl. context and interventions), API-006 (evidence breakdown incl. contributing requests) — the split between API-005 and API-006 is **Proposed** and may collapse into one endpoint; see §7. |
| **Loading state** | Panel opens immediately with the hotspot's headline aggregates from the already-cached list item; evidence, context and interventions each show their own section skeleton so a slow section never blocks the rest. |
| **Empty state** | Per-section: "No context data is available for this area" (never a zero); "No candidate interventions were produced for this hotspot" (Confirmed principle: show nothing rather than filler, FR-013 edge case). |
| **Error state** | Per-section `ErrorState` with Retry. If interventions fail, the evidence and context sections remain usable — the explainability path must survive the loss of the suggestion path. |
| **Responsive** | Desktop: fixed-width panel, independently scrollable. Tablet: overlay sheet at ~70% height. Mobile: full-screen with a sticky close control. |
| **Traces to** | FR-011, FR-012, FR-013, NFR-012, NFR-005 |
| **Hard constraint** | This screen must never display a composite priority figure without the signals behind it, and each intervention must carry a "suggestion — requires human decision" label (Confirmed product principle). |

---

### SCR-005 — Method & Data Provenance *(Proposed)*

| Field | Value |
|---|---|
| **Page ID** | SCR-005 |
| **Route** | `/method` *(Proposed)* |
| **Purpose** | State, in one place: which data is synthetic vs public vs curated/mock, which AI steps are involved, which signals feed hotspots, and that the system is decision-support only. **Proposed** because the Confirmed product principles (no opaque scoring, no authoritative claims, labelled data provenance) need a canonical home, and because AC-015 requires unverified sources to be visibly marked. |
| **Primary user** | ROLE-02 (and demo audience) |
| **Layout** | `BareLayout`, static content. |
| **Components** | Static markup + `ProvenanceTag` |
| **Data required** | None at runtime (static content). Optionally the dataset summary counts (**TBD**). |
| **API dependencies** | None |
| **Loading / empty / error** | Not applicable (static). |
| **Responsive** | Single column. |
| **Traces to** | NFR-012, FR-011, AC-014, AC-015 |

---

### SCR-006 — Not Found / Route Error

| Field | Value |
|---|---|
| **Page ID** | SCR-006 |
| **Route** | `*` |
| **Purpose** | Handle unknown routes and uncaught route errors without a blank screen during the demo (NFR-007). |
| **Components** | `ErrorState`, navigation links to `/submit` and `/dashboard` |
| **Traces to** | NFR-007 |

---

### Screens considered and **not** included

| Candidate | Decision |
|---|---|
| Separate "Processing" screen | Merged into SCR-002 as a state, not a route — avoids an extra screen for one transient state. |
| Separate "Context / investment information" screen | Rendered as a section of SCR-004, because the Confirmed policymaker journey inspects context *in the flow of investigating a hotspot*, not as a standalone destination. |
| Admin / seeding screen | Not built. FR-016 is a CLI operation (see PRD FR-016 security note). |
| Login / account screens | Not built. No authentication model is established (**TBD**). |

---

## 5. Component Specification

Props below are **Proposed** shapes; they depend on the API contracts, which are **TBD** (§7). Types referenced live in `src/types/domain.ts`.

---

### FC-001 — `RequestForm`

- **Responsibility:** Own the citizen submission flow: mode switching, validation orchestration, submit, and post-submit navigation.
- **Props:** `supportedLanguages?: LanguageOption[]`, `areas?: AreaOption[]`, `onSubmitted(requestId: string): void`
- **State:** `mode: 'text' | 'voice'`, field values, `fieldErrors`, `submitState: idle | submitting | error`
- **Events:** `onSubmitted`
- **Dependencies:** FC-002, FC-003, FC-004, FC-005, FC-006, `useSubmitRequest`
- **Reusability:** Page-specific (SCR-001). Not reused.
- **Traces to:** FR-001, FR-002

### FC-002 — `TextRequestInput`

- **Responsibility:** Multi-line free-text entry for the request body in the citizen's own language.
- **Props:** `value: string`, `onChange(v: string)`, `error?: string`, `maxLength?: number` *(limit TBD)*, `disabled?: boolean`
- **State:** none (controlled)
- **Events:** `onChange`, `onBlur`
- **Dependencies:** `Field` primitive
- **Reusability:** Reusable text-area wrapper.
- **Traces to:** FR-001

### FC-003 — `VoiceRecorder`

- **Responsibility:** Capture audio in the browser, expose record/stop/playback/re-record, and hand a blob to the form. Also surfaces permission and capability failures.
- **Props:** `onAudioReady(blob: Blob, durationMs: number)`, `onUnavailable(reason: 'permission' | 'unsupported' | 'error')`, `maxDurationMs?: number` *(TBD)*, `disabled?: boolean`
- **State:** `recorderState: idle | requesting | recording | recorded | error`, elapsed time, object URL for playback
- **Events:** `onAudioReady`, `onUnavailable`
- **Dependencies:** `useVoiceRecorder` (MediaRecorder API), `Button`, `Spinner`
- **Reusability:** Self-contained; reusable wherever voice capture is needed.
- **Notes:** Must release the media stream and revoke object URLs on unmount. Supported codecs/containers are **TBD** and must be agreed with the speech-to-text provider (**TBD**).
- **Traces to:** FR-002, FR-003, AC-004

### FC-004 — `LanguageSelector`

- **Responsibility:** Optional declaration of the request's language; defaults to automatic detection.
- **Props:** `options: LanguageOption[]`, `value?: string`, `onChange(code?: string)`, `disabled?: boolean`
- **State:** none
- **Dependencies:** `Select` primitive
- **Notes:** The option list is data-driven; the actual supported languages are **TBD** and must not be hard-coded in the component.
- **Traces to:** FR-004

### FC-005 — `LocationInput`

- **Responsibility:** Let the citizen provide a location as free text and/or select a known area; optionally offer device geolocation.
- **Props:** `textValue: string`, `onTextChange(v: string)`, `areas?: AreaOption[]`, `selectedAreaId?: string`, `onAreaChange(id?: string)`, `allowDeviceLocation?: boolean`, `error?: string`
- **State:** `geoState: idle | requesting | denied | resolved`
- **Events:** `onTextChange`, `onAreaChange`, `onCoordinates(lat, lng)`
- **Dependencies:** `Field`, `Select`, `Button`
- **Notes:** Area selection is the **Proposed** fallback for geocoding failure (PRD R-06). Device geolocation is **Proposed** and optional; denial must be non-blocking.
- **Traces to:** FR-008

### FC-006 — `SubmitButton`

- **Responsibility:** Primary submit action with busy and disabled states and an accessible busy announcement.
- **Props:** `busy: boolean`, `disabled: boolean`, `label: string`, `onClick()`
- **Traces to:** FR-001, FR-002, NFR-005

### FC-007 — `RequestStatusCard`

- **Responsibility:** Render the lifecycle state of a submitted request and, when available, the structured interpretation and transcript.
- **Props:** `request: RequestStatus` (`{ id, state, transcript?, language?, category?, issue?, severity?, areaName?, failureStage? }`)
- **State:** none (polling lives in `useRequestStatus`)
- **Notes:** Must distinguish "not yet available" from "failed" from "not applicable". Never renders an inferred value when the pipeline did not produce one (AC-006).
- **Traces to:** FR-003, FR-005, FR-006, FR-015

### FC-008 — `FilterBar`

- **Responsibility:** Expose the dashboard filters and reflect them into the URL query string.
- **Props:** `options: FilterOptions`, `value: FilterState`, `onChange(next: FilterState)`, `onClear()`, `resultCount?: number`
- **State:** none (URL is the source of truth via `useFilters`)
- **Notes:** The available filter dimensions (category, severity, area, time window) are **Proposed**; the final set is **TBD** and must match what API-004 actually supports.
- **Traces to:** FR-014

### FC-009 — `HotspotMap`

- **Responsibility:** Own the Leaflet map instance, render the base layer, render hotspots as area polygons and/or markers, and emit selection events.
- **Props:** `hotspots: HotspotSummary[]`, `areaGeometry?: GeoJSONCollection`, `selectedHotspotId?: string`, `onSelect(id: string)`, `viewport?: Viewport`, `onViewportChange?(v: Viewport)`, `loading: boolean`, `tileError?: boolean`
- **State:** internal Leaflet layer references
- **Events:** `onSelect`, `onViewportChange`
- **Dependencies:** Leaflet; FC-011 `MapLegend`
- **Reusability:** Single-instance component; all Leaflet API contact is confined here so no other component imports Leaflet.
- **Accessibility:** The map is explicitly **not** the accessible path; it is marked appropriately for assistive technology and FC-010 carries the equivalent information (see §12).
- **Traces to:** FR-010, NFR-005

### FC-010 — `HotspotList`

- **Responsibility:** Render the same filtered hotspot set as a keyboard-navigable, screen-reader-accessible ranked list. This is the required non-map equivalent.
- **Props:** `hotspots: HotspotSummary[]`, `selectedHotspotId?: string`, `onSelect(id: string)`, `loading: boolean`, `error?: AppError`
- **State:** none
- **Notes:** Each row shows area name, request count, dominant category, and severity distribution — enough to make a selection without the map (AC-017).
- **Traces to:** FR-014, FR-009, NFR-005

### FC-011 — `MapLegend`

- **Responsibility:** Explain the map's visual encoding (what shading intensity and marker size mean).
- **Props:** `scale: LegendScale`, `metricLabel: string`
- **Notes:** Required so that map intensity is never an unexplained visual claim (NFR-012 applied to the map).
- **Traces to:** FR-010, NFR-012

### FC-012 — `EvidencePanel`

- **Responsibility:** Render the "Why this region?" breakdown: every signal actually used, with its value, plus an explicit list of signals that were unavailable.
- **Props:** `evidence: Evidence` (`{ requestCount, categoryBreakdown[], severityDistribution[], concentrationMeasure?, contextSignals[], unavailableSignals[] }`), `loading`, `error?`
- **State:** section expand/collapse
- **Dependencies:** FC-015, small inline SVG/CSS distribution bars, `Badge`
- **Hard constraint:** must render `unavailableSignals` — silence about a missing signal is a failure of this component.
- **Traces to:** FR-012, NFR-012, AC-013

### FC-013 — `ContextPanel`

- **Responsibility:** Show demographic, infrastructure, geographic and investment indicators for the hotspot's area, each with a provenance tag and vintage.
- **Props:** `indicators: ContextIndicator[]` (`{ key, label, value?, unit?, source, provenance: 'synthetic' | 'public' | 'curated' | 'unavailable', vintage?, note? }`), `loading`, `error?`
- **Notes:** `provenance: 'unavailable'` renders as an explicit "not available for this area" row — never as `0`, `—`, or an omitted row (AC-014). Any unverified source (including any investment API) renders with a "TBD / requires verification" note (AC-015).
- **Traces to:** FR-011

### FC-014 — `InterventionList`

- **Responsibility:** Present candidate interventions as clearly-labelled suggestions with the evidence each responds to.
- **Props:** `interventions: CandidateIntervention[]` (`{ id, title, rationale, linkedSignals[], generationSource: 'ai' | 'curated' }`), `loading`, `error?`
- **Notes:** Every item renders a persistent, non-dismissible "Suggestion — requires human decision" label, and shows `generationSource`. Empty list renders the empty state, not filler (AC-016).
- **Traces to:** FR-013

### FC-015 — `RequestEvidenceList`

- **Responsibility:** List the contributing citizen requests behind a hotspot, with original text and, where applicable, the normalized/translated text.
- **Props:** `requests: ContributingRequest[]` (`{ id, originalText, normalizedText?, language, category, severity, submittedAt, isTranscript }`), `pageSize?: number`
- **State:** expand/collapse, "show original / show translation" toggle, pagination cursor
- **Notes:** Text is rendered as plain text, never as HTML (NFR-004). Transcribed requests are visibly marked as machine transcripts so transcription error is attributable.
- **Traces to:** FR-012, FR-005, AC-010

### FC-016 — `A11yAnnouncer`

- **Responsibility:** A single ARIA live region used to announce asynchronous outcomes (submission accepted, filters applied and result count, hotspot selected, processing finished).
- **Props:** none; consumed through a hook.
- **Traces to:** NFR-005

### FC-017 — `ToastHost`

- **Responsibility:** Render transient success/failure notifications from `ToastContext`.
- **Props:** none
- **Notes:** Toasts supplement inline messages; they never carry information that exists nowhere else.
- **Traces to:** NFR-005, NFR-007

**Primitives** (no individual IDs): `Button`, `Field`, `Select`, `Badge`, `Spinner`, `EmptyState`, `ErrorState`, `ProvenanceTag`, `SkeletonBlock`.

---

## 6. State Management

| Category | What lives here | Mechanism | Justification |
|---|---|---|---|
| **Local (component)** | Form field values, recorder state, panel tab and expand/collapse, map viewport, popover state | `useState` / `useReducer` | Not needed outside the component. |
| **URL state** | Dashboard filters, selected hotspot, submitted request ID | React Router path + query params (`useFilters`) | Makes a filtered/selected dashboard state shareable and reload-safe — valuable during a live demo. Avoids a global store for the one piece of state that is genuinely cross-component. |
| **Server state** | Hotspot list, hotspot detail, evidence, context, interventions, reference data, request status | React Query (**Proposed**) or the `useAsync` + cache fallback | De-duplication between FC-009 and FC-010, caching between hotspot selections, polling for FR-015. |
| **Shared client state** | Toast queue; UI locale (**TBD** whether the UI is localized) | React Context | Small, genuinely cross-cutting, low-frequency updates. |
| **Persistent state** | **None in the MVP.** No `localStorage`, no session persistence. | — | Nothing in the PRD requires it; there is no authentication and no user profile. Draft-saving for the citizen form is a **Proposed** future nicety, not MVP. |

**Explicitly rejected:** Redux, Zustand, MobX, or any global store. The scope rules require justification for such a dependency and none of the state above needs one.

---

## 7. API Integration

> ⚠ **CRITICAL — read before implementing.** No API contract was established in the project discussion. Every endpoint path, method, request body and response shape below is **Proposed** and must be agreed with the backend before either side builds against it. Field names are illustrative. Where a detail is genuinely undetermined it is written **TBD**.
>
> **What must be finalized before frontend/backend integration begins:**
> 1. Base URL and API version prefix.
> 2. Whether submission is synchronous (returns the structured result) or asynchronous (returns an ID and a status endpoint). This document assumes **asynchronous with polling** (**Proposed**, PRD A-15) because AI latency is provider-dependent (NFR-002).
> 3. Whether voice upload is `multipart/form-data` or a base64 JSON payload.
> 4. Whether hotspot detail, evidence, context and interventions arrive in one response (API-005) or two (API-005 + API-006).
> 5. The exact filter dimensions supported by API-004.
> 6. The error envelope shape (§7.2).
> 7. Pagination strategy for contributing requests.
> 8. Whether any authentication header is required (**TBD** — no auth model established).

### 7.1 Conventions (Proposed)

- JSON request/response bodies, UTF-8, `Content-Type: application/json` (except voice upload).
- Base path `/api` with a version segment — final form **TBD**.
- Errors return a consistent envelope (§7.2) with an appropriate HTTP status.
- **Authentication: none.** No mechanism is established (**TBD**). The client sends no credentials. CORS must permit the frontend origin (configured server-side, NFR-004).

### 7.2 Error envelope (Proposed)

```jsonc
{
  "error": {
    "code": "VALIDATION_ERROR",        // stable machine code
    "message": "Human-readable summary",
    "fields": { "text": "Request text is required" },   // optional, field-level
    "stage": "extraction"              // optional, pipeline stage for processing failures
  }
}
```

The client normalizes every failure — network, HTTP, malformed body — into a single internal `AppError { kind, message, fields?, retryable }` type in `apiClient.ts`, so components handle one shape.

---

### API-001 — Submit text request

| Field | Value |
|---|---|
| **Endpoint** | `POST /api/requests` *(Proposed — TBD)* |
| **Purpose** | FR-001 — accept a text citizen request. |
| **Request** | `{ text: string, languageHint?: string, locationText?: string, areaId?: string, coordinates?: { lat: number, lng: number } }` *(Proposed)* |
| **Response** | `201` → `{ requestId: string, state: "received" }` *(Proposed)* |
| **Authentication** | None (**TBD**) |
| **Loading behavior** | `SubmitButton` busy; inputs read-only; live-region announcement. |
| **Error behavior** | `400` → field errors on the form, text preserved. `5xx` / network → form-level error with Retry, text preserved. Never navigates away on failure. |
| **Used by** | SCR-001 / FC-001 |

### API-002 — Submit voice request

| Field | Value |
|---|---|
| **Endpoint** | `POST /api/requests/voice` *(Proposed — TBD)* |
| **Purpose** | FR-002, FR-003 — accept audio for transcription and processing. |
| **Request** | `multipart/form-data`: `audio` (blob), plus the same optional metadata fields as API-001. Encoding choice **TBD**. |
| **Response** | `201` → `{ requestId: string, state: "received" }` *(Proposed)* |
| **Authentication** | None (**TBD**) |
| **Loading behavior** | Upload progress if available (**TBD** — requires XHR or a streaming fetch); otherwise a busy state. |
| **Error behavior** | Payload too large / unsupported format → explicit message naming the limit, recording preserved for retry where possible. Transcription failure occurs later and surfaces on SCR-002, not here. |
| **Used by** | SCR-001 / FC-001, FC-003 |

### API-003 — Get request status

| Field | Value |
|---|---|
| **Endpoint** | `GET /api/requests/{requestId}` *(Proposed — TBD)* |
| **Purpose** | FR-015 — poll the processing state and show the structured interpretation. |
| **Request** | Path parameter only. |
| **Response** | `{ requestId, state, transcript?, language?, category?, issue?, severity?, areaId?, areaName?, failureStage? }` *(Proposed)* |
| **Authentication** | None (**TBD**) |
| **Loading behavior** | Polling with a bounded attempt count; both interval and cap are **TBD**. |
| **Error behavior** | `404` → not-found empty state. Network → retry, preserving the last known state on screen. |
| **Used by** | SCR-002 / FC-007 |

### API-004 — List hotspots (filtered)

| Field | Value |
|---|---|
| **Endpoint** | `GET /api/hotspots` *(Proposed — TBD)* |
| **Purpose** | FR-009, FR-010, FR-014 — the dashboard's primary dataset. |
| **Request** | Query parameters — `category`, `severity`, `areaId`, `from`, `to` *(the supported set is **TBD** and must match the backend)*. |
| **Response** | `{ hotspots: [ { hotspotId, areaId, areaName, requestCount, dominantCategory, severityDistribution, centroid: { lat, lng }, geometryRef? } ], total }` *(Proposed)* |
| **Authentication** | None (**TBD**) |
| **Loading behavior** | Skeleton list + map overlay spinner; in-flight request cancelled when filters change. |
| **Error behavior** | `ErrorState` with Retry over list and map overlay; base map remains. |
| **Used by** | SCR-003 / FC-009, FC-010, FC-008 |

### API-005 — Get hotspot detail (context + interventions)

| Field | Value |
|---|---|
| **Endpoint** | `GET /api/hotspots/{hotspotId}` *(Proposed — TBD)* |
| **Purpose** | FR-011, FR-013 — context indicators and candidate interventions for a hotspot. |
| **Request** | Path parameter only. |
| **Response** | `{ hotspot: {...}, context: ContextIndicator[], interventions: CandidateIntervention[] }` *(Proposed)* |
| **Authentication** | None (**TBD**) |
| **Loading behavior** | Section-level skeletons inside the already-open panel. |
| **Error behavior** | Section-level errors; evidence (API-006) must remain usable if this call fails. |
| **Used by** | SCR-004 / FC-013, FC-014 |

### API-006 — Get hotspot evidence

| Field | Value |
|---|---|
| **Endpoint** | `GET /api/hotspots/{hotspotId}/evidence` *(Proposed — TBD; may merge into API-005)* |
| **Purpose** | FR-012 — the "Why this region?" breakdown and contributing requests. |
| **Request** | Path parameter; optional pagination for contributing requests (**TBD**). |
| **Response** | `{ signalsUsed: [ { key, label, value, unit? } ], unavailableSignals: [ { key, label, reason } ], contributingRequests: [...], pagination? }` *(Proposed)* |
| **Authentication** | None (**TBD**) |
| **Loading behavior** | Evidence section skeleton. |
| **Error behavior** | Evidence section error with Retry. **The panel must not fall back to showing a bare priority figure with no evidence** — if evidence cannot load, the headline aggregates are shown with an explicit note that the breakdown is unavailable (NFR-012). |
| **Used by** | SCR-004 / FC-012, FC-015 |

### API-007 — Geographic areas / geometry

| Field | Value |
|---|---|
| **Endpoint** | `GET /api/areas` *(Proposed — TBD)* |
| **Purpose** | FR-008, FR-010 — area list for the citizen location fallback and geometry for the map. |
| **Request** | Optional `includeGeometry` flag (**Proposed**) to avoid shipping geometry to SCR-001. |
| **Response** | `{ areas: [ { areaId, name, centroid, geometry? } ] }` *(Proposed; geometry format expected to be GeoJSON — **TBD**)* |
| **Authentication** | None (**TBD**) |
| **Loading behavior** | Fetched once per session and cached; map renders base layer first. |
| **Error behavior** | SCR-001 degrades to free-text location. SCR-003 degrades to centroid markers instead of polygons (FR-010 edge case). |
| **Used by** | SCR-001 / FC-005; SCR-003 / FC-009 |

### API-008 — Reference metadata

| Field | Value |
|---|---|
| **Endpoint** | `GET /api/metadata` *(Proposed — TBD)* |
| **Purpose** | Supply the supported language list, category taxonomy and severity scale so none of these are hard-coded in the client (PRD A-03, A-13, A-14 are all **TBD**). |
| **Response** | `{ languages: [...], categories: [...], severityLevels: [...] }` *(Proposed)* |
| **Authentication** | None (**TBD**) |
| **Error behavior** | Filters fall back to a free/unfiltered state; the language selector falls back to auto-detect only. Never blocks a page. |
| **Used by** | SCR-001 / FC-004; SCR-003 / FC-008 |

### API-009 — Seed / recompute *(Proposed, likely CLI not HTTP)*

| Field | Value |
|---|---|
| **Endpoint** | **TBD.** Recommended as a CLI script rather than an HTTP endpoint, because there is no authentication model to protect it (PRD FR-016, R-11). |
| **Frontend usage** | **None.** No frontend screen calls this. Listed only for traceability. |

### API-010 — Health check

| Field | Value |
|---|---|
| **Endpoint** | `GET /api/health` *(Proposed — TBD)* |
| **Frontend usage** | Not called by the UI. Used for deployment/demo verification (NFR-011). |

---

## 8. Forms

### 8.1 Citizen request form (SCR-001 / FC-001)

| Field | Control | Required | Validation | Error message (**Proposed** wording) |
|---|---|---|---|---|
| Input mode | Radio / segmented control | Yes | One of `text` \| `voice` | — |
| Request text | Textarea (FC-002) | Required in text mode | Non-empty after trimming; minimum length **TBD**; maximum length **TBD** | "Please describe the problem." / "Please add a little more detail." / "This is longer than we can accept — please shorten it." |
| Voice recording | Recorder (FC-003) | Required in voice mode | Audio present; duration above a minimum and below a maximum (**both TBD**) | "Please record your request before submitting." / "That recording is too short to process." / "That recording is longer than we can accept." |
| Language | Select (FC-004) | No | Must be one of the values returned by API-008 if set | "Please choose a language from the list." |
| Location text | Text input (FC-005) | No | Maximum length **TBD** | "This location description is too long." |
| Area | Select (FC-005) | No | Must be a known `areaId` | "Please choose an area from the list." |

**Cross-field rule (Proposed):** at least one location signal — location text, area selection, or coordinates — is *encouraged* but not required, because the extraction step (FR-005) may recover a location from the request text itself. If none is present, an inline non-blocking hint explains that the request may not be included in geographic aggregation (FR-008 behavior: unresolved requests are excluded from hotspots). This is honest rather than coercive.

**Submission behavior:** client validation runs on submit and on blur after the first submit attempt. On pass, the form calls API-001 or API-002, disables inputs, and shows a busy state.

**Success behavior:** navigate to `SCR-002` (`/submit/:requestId`) and announce success in the live region. The submitted content stays in memory until navigation completes so a late failure does not lose it.

**Retry behavior:** on a retryable failure the form stays populated, shows a form-level error, and offers Retry. Voice recordings are retained in memory (object URL) for retry. Retry does not re-run client validation from scratch unless fields changed.

**Security:** all user text is submitted as plain text and never interpolated into HTML anywhere in the app (NFR-004).

### 8.2 Filter form (SCR-003 / FC-008)

Not a submitting form: each change updates the URL query string immediately and triggers a refetch. No validation beyond constraining values to the option lists from API-008. A Clear action resets to defaults. Result count is announced in the live region after each change (NFR-005).

---

## 9. Map UX

### 9.1 Rendering approach

**Proposed.** Leaflet (Confirmed) is wrapped in FC-009 and only FC-009 touches the Leaflet API. Whether React Leaflet is used or the map instance is managed directly with `useEffect` is **Proposed/TBD**; the component contract in §5 is identical either way.

### 9.2 Hotspot rendering

- **Primary encoding (Proposed):** area polygons shaded by hotspot intensity, where intensity is defined by a single named metric shown in FC-011 `MapLegend` (metric choice **TBD** — likely request count, possibly severity-weighted; it must be the metric the evidence panel also reports).
- **Fallback encoding:** where an area has no geometry, a circular marker at the centroid sized by the same metric, with a visible indication of reduced fidelity (FR-010 edge case).
- **Selection:** the selected hotspot is visually distinguished by outline weight/colour, not by colour alone (accessibility, §12).
- **Clustering of markers:** not implemented. With ≈20–100 areas (Confirmed range) marker clustering is unnecessary complexity.

### 9.3 Markers, tooltips and popovers

- **Hover/focus tooltip:** area name, request count, dominant category. Short, non-interactive.
- **Click/activate:** does **not** open an in-map popup with the full evidence. It selects the hotspot and opens SCR-004 in the detail panel. Rationale: evidence content is long, must be scrollable and keyboard-navigable, and must be readable without the map (NFR-005). A Leaflet popup is a poor host for it.

### 9.4 Filters

Filters live in FC-008 above the map, not on the map. Applying a filter updates the map layer and FC-010 from the same query result, so the two can never disagree (AC-011).

### 9.5 Detail panel relationship

Map and detail panel are linked in both directions: selecting on the map highlights the list row and opens the panel; selecting a list row pans/zooms the map to the area and opens the panel. Closing the panel clears the selection from both.

### 9.6 Accessibility alternative

**Required by NFR-005.** FC-010 `HotspotList` carries every piece of information the map conveys — area, count, dominant category, severity distribution, and relative rank — in a keyboard-navigable, screen-reader-readable list. The complete evidence workflow is achievable from the list alone (AC-017). The map is treated as a supplementary visualization, not the sole path.

### 9.7 Loading and failure behavior

- Base layer renders first; the hotspot layer arrives after and shows an overlay spinner while pending.
- Tile load failure → neutral placeholder in the map region plus a short note; the list view remains fully functional.
- Geometry unavailable → centroid markers (§9.2).
- Zero hotspots for the current filters → the map stays visible with the empty state shown in the list region, not an empty white box.

---

## 10. Error Handling

| Category | Trigger | Frontend behavior | Traces to |
|---|---|---|---|
| **Network failure** | Request never reaches the server | Normalized `AppError { kind: 'network', retryable: true }` → inline error with Retry; the user's input is preserved | NFR-007 |
| **AI processing failure** | Server reports `extraction_failed` / `transcription_failed` | SCR-002 states plainly that the request was received but automatic interpretation did not complete. **No fabricated interpretation is shown.** | FR-005, AC-006 |
| **Invalid input** | Client or server validation | Field-level messages tied to inputs via `aria-describedby`; focus moves to the first invalid field | NFR-005, §8 |
| **Location unavailable** | Device geolocation denied or unsupported | Non-blocking; the citizen continues with area selection or free-text location | FR-008 |
| **Geocoding failure** | Server cannot resolve a location | SCR-002 shows the request as received with location unresolved and explains it may not appear in geographic aggregation | FR-008, AC-009 |
| **Empty result** | Filters match nothing | Distinct empty state with a Clear filters action — never an error style | FR-014, AC-012 |
| **Dataset unavailable** | Context data missing for an area | FC-013 renders explicit "not available" rows with provenance; never zeros | FR-011, AC-014 |
| **Map tile failure** | Tile server unreachable | Placeholder in the map region; list view unaffected | FR-010, NFR-007 |
| **Partial section failure** | One of evidence / context / interventions fails | Section-scoped error; other sections stay usable; the evidence path is prioritized over the suggestion path | FR-012, FR-013 |
| **Unexpected render error** | Uncaught exception | Route-level error boundary renders `ErrorState` with a reload action — never a blank screen during a demo | NFR-007 |

**Cross-cutting rules:** server messages and AI-generated text are always rendered as plain text; no `dangerouslySetInnerHTML` anywhere in the codebase (NFR-004). Every error tells the user whether their data survived.

---

## 11. Responsive Behavior

**Breakpoints: Proposed** (no breakpoints were established). Values are indicative and may be tuned:

| Band | Width (Proposed) | Behavior |
|---|---|---|
| Mobile | < 768px | **SCR-001/002:** full-width single column, large tap targets, recorder button prominent. **SCR-003:** list-first; a persistent toggle switches to a full-bleed map; FC-008 collapses into a filter sheet. **SCR-004:** full-screen sheet with a sticky close control. |
| Tablet | 768–1199px | **SCR-003:** map on top, list beneath, both scrollable; FC-008 remains a bar. **SCR-004:** overlay sheet covering roughly the lower two-thirds, with the map still visible above. |
| Desktop | ≥ 1200px | **SCR-003:** three regions side by side — filters across the top, map as the main region, list adjacent, FC-004 detail panel docked right. This is the reference analytical layout (NFR-006: dashboard may be desktop-first). |

**Rules that hold at every width:** no horizontal page scrolling (AC-019); the citizen submission flow is fully completable on mobile; the policymaker evidence workflow is completable at every band, even if the map is de-emphasized on mobile.

---

## 12. Accessibility

Target: **WCAG 2.1 AA** (**Proposed** target level; the topics themselves are Confirmed via NFR-005).

### 12.1 Keyboard navigation
- Every interactive element is reachable and operable by keyboard in a logical order.
- FC-010 rows are true buttons or links, not click-handled `div`s.
- The SCR-004 panel traps focus while open as an overlay (tablet/mobile), returns focus to the triggering element on close, and closes on `Escape`.
- No keyboard trap inside the Leaflet map; a skip mechanism allows bypassing the map to reach FC-010.

### 12.2 Semantic HTML
- One `h1` per page; heading levels descend without gaps.
- Landmarks: `header`, `nav`, `main`, `aside` for the detail panel, `footer` if used.
- Lists are `ul`/`ol`; the hotspot list is a list, not a table of `div`s.
- Distribution visuals use inline SVG with a text equivalent adjacent, not colour-only bars.

### 12.3 ARIA
- Used only where semantics are insufficient: `aria-live="polite"` in FC-016; `aria-busy` during loading; `aria-describedby` linking field errors to inputs; `aria-expanded` on collapsible evidence sections; `role="dialog"` with `aria-modal` on the mobile/tablet detail sheet.
- The Leaflet container carries an accessible name describing what it shows and a pointer to the list alternative.

### 12.4 Focus
- Visible focus indicator on every focusable element, meeting contrast requirements, never removed without replacement.
- Focus moves deliberately: to the first invalid field on validation failure; into the detail panel when it opens; back to the trigger when it closes.

### 12.5 Contrast
- Text and meaningful non-text elements meet AA contrast against their background (token values are specified in Design.md and must be validated, not assumed).
- Hotspot intensity, severity and status are never communicated by colour alone — each also carries a label, pattern, or numeric value.

### 12.6 Screen readers
- Filter changes announce the new result count via FC-016.
- Submission outcome and processing-state transitions are announced.
- Loading skeletons are hidden from assistive technology; an announced status message conveys loading instead.

### 12.7 Accessible forms
- Every control has a persistent visible `label` (not placeholder-only).
- Required fields are marked in text as well as visually.
- Errors are announced and associated programmatically with their field.
- The voice recorder announces its state changes (recording started, stopped, duration) in text.

### 12.8 Accessible alternatives for map information
- FC-010 is the designated equivalent for FC-009 and must always be present, never collapsed out of the DOM on any breakpoint.
- FC-011 `MapLegend` is text-based so the encoding is readable without perceiving the shading.
- **Known limitation to state openly (per NFR-005):** interactive geospatial rendering cannot be made fully equivalent for non-visual users; the list view exists precisely because of this, and SCR-005 documents the limitation.

---

## 13. Frontend Traceability

| PRD requirement | Screen(s) | Component(s) | API(s) |
|---|---|---|---|
| FR-001 Text intake | SCR-001 | FC-001, FC-002, FC-006 | API-001 |
| FR-002 Voice intake | SCR-001 | FC-001, FC-003 | API-002 |
| FR-003 Speech-to-text | SCR-001, SCR-002 | FC-003, FC-007 | API-002, API-003 |
| FR-004 Multilingual | SCR-001, SCR-002 | FC-004, FC-007 | API-001, API-002, API-003, API-008 |
| FR-005 Extraction | SCR-002 | FC-007 | API-003 |
| FR-006 Validation/persistence | SCR-001, SCR-002 | FC-001, FC-007 | API-001, API-002, API-003 |
| FR-007 Semantic clustering | SCR-003 | FC-010 (theme labels) | API-004 |
| FR-008 Geographic association | SCR-001, SCR-002, SCR-003 | FC-005, FC-009 | API-001, API-007 |
| FR-009 Hotspot detection | SCR-003 | FC-009, FC-010 | API-004 |
| FR-010 Map visualization | SCR-003 | FC-009, FC-011 | API-004, API-007 |
| FR-011 Context overlay | SCR-004 | FC-013 | API-005 |
| FR-012 Explainable evidence | SCR-004 | FC-012, FC-015 | API-006 |
| FR-013 Candidate interventions | SCR-004 | FC-014 | API-005 |
| FR-014 Filtering / list view | SCR-003 | FC-008, FC-010 | API-004, API-008 |
| FR-015 Submission feedback | SCR-002 | FC-007 | API-003 |
| FR-016 Seeding | — | — | API-009 (not called by the frontend) |
| NFR-005 Accessibility | all | FC-010, FC-011, FC-016 + primitives | — |
| NFR-006 Responsiveness | all | layouts | — |
| NFR-007 Demo reliability | all | FC-017, `ErrorState`, error boundary | all |
| NFR-012 Explainability | SCR-004, SCR-005 | FC-012, FC-011, FC-014 | API-006 |
