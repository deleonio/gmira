# bklit-ui

Source: `C:\Users\oasrvadmin\Documents\md-stack\gmira\_sources\bklit-ui`
Live: https://ui.bklit.com | Registry: https://ui.bklit.com/r/{name}.json | License: MIT (charts), proprietary (Studio)

---

## 1. What it is + install path

A pnpm/Turborepo monorepo that ships **one thing**: a composable React data-visualization layer built on **visx primitives + Motion + Tailwind 4 CSS variables**, distributed as a **shadcn registry** (source copied into your repo, not an npm dependency).

```
bklit-ui/
├── apps/web            Next.js 15 + Fumadocs docs site, ALSO serves the registry at /r/*.json
├── apps/studio-docs
├── packages/ui         @bklitui/ui   <- the entire component library (37,872 LOC of chart source)
├── packages/studio     @bklitui/studio  proprietary visual chart tuner at /studio
├── packages/icons      @bklitui/icons
├── skills/bklit-ui/    a SHIPPED Claude skill for CONSUMERS of the library
└── .agents/skills/     9 skills for CONTRIBUTORS to the monorepo
```

### Exact install pattern

`packages/ui/registry.json` declares `"$schema": "https://ui.shadcn.com/schema/registry.json"`, `"name": "bklit-ui"`, `"homepage": "https://ui.bklit.com"`, 56 items.

Consumers register a namespace in `components.json`:

```json
{
  "registries": {
    "@bklit": "https://ui.bklit.com/r/{name}.json"
  }
}
```

Then:

```bash
npx shadcn@latest init
npx shadcn@latest add @bklit/line-chart
npx shadcn@latest add @bklit/heatmap-chart
npx shadcn@latest info --json     # the skill uses this to detect aliases/tailwind version
npx shadcn@latest search @bklit
```

Registry build pipeline (`packages/ui/package.json`):

```json
"registry:build": "node scripts/verify-registry-files.mjs && node scripts/verify-registry-deps.mjs && node scripts/generate-v0-examples.mjs && node scripts/generate-block-registry.mjs && shadcn build --output ../../apps/web/public/r && cp registry.json ../../apps/web/public/r/registry.json",
"registry:verify": "node scripts/verify-registry-files.mjs && node scripts/verify-registry-deps.mjs && node scripts/verify-registry-sync.mjs"
```

Three verifier scripts run before every publish. `verify-registry-files.mjs` walks every `import ... from "./x"` in the transitive file closure of each registry item and fails the build if a local import is not shipped by that item or one of its `registryDependencies`. It also rejects CJS `require("react-dom")` because it breaks Vite/ESM consumers.

### The shipped consumer skill

`skills/bklit-ui/SKILL.md` (+ `rules/composition.md`, `theming.md`, `animation.md`, `tooltips.md`, `installation.md`). Notable frontmatter:

```yaml
name: bklit-ui
description: >
  Bklit UI charts and data visualization for any project using the @bklit
  shadcn registry. Install, compose, theme, and animate charts correctly.
allowed-tools: Bash(npx shadcn@latest *), Bash(pnpm dlx shadcn@latest *), Bash(bunx --bun shadcn@latest *)
```

It injects live project state into the prompt with a backtick-bang command block:

```markdown
## Current Project Context

```json
!`npx shadcn@latest info --json`
```
```

Five principles, verbatim: install before inventing; compose, do not flatten; theme with tokens; read the doc page first; browse variants. Each critical rule links to a rules file that contains an explicit **Incorrect / Correct** pair.

---

## 2. Full component inventory

`packages/ui/registry.json`, 56 items. Types: `registry:lib`, `registry:component`, `registry:block`, `registry:example`. Peer deps are pinned to `@visx/*@4.0.1-alpha.0` throughout.

### Foundation layer (install implicitly as registryDependencies)

| Item | Path | Does | Key API | Deps |
|---|---|---|---|---|
| `utils` | `src/lib/utils.ts` | `cn()` | `cn(...)` | clsx, tailwind-merge |
| `chart-utils` | `chart-formatters.ts`, `decimate-time-series.ts`, `use-scheduled-tooltip.ts` | Shared `Intl` formatters, LTTB-style decimation, rAF tooltip scheduler | `intFmt`, `weekdayDateFmt`, `useScheduledTooltip<T>()` | none |
| `chart-context` | 12 files incl. `chart-context.tsx`, `chart-phase.ts`, `y-domain-utils.ts`, `use-chart-interaction.ts`, `use-animated-y-domains.ts`, `use-chart-phase-orchestrator.ts` | Split stable/hover context, scales, phase machine, y-domain nice-ing | `useChart()`, `useChartStable()`, `useChartHover()`, `useYScale(id)`, `chartCssVars` | visx event/responsive/scale, d3-array, motion |
| `chart-animation` | `animation.ts`, `motion-utils.ts`, `use-mount-progress.ts`, `use-enter-complete.ts`, `chart-reveal-clip.tsx`, `static-chart-preview-context.tsx`, `chart-defs.ts` | Enter transitions, clip reveal, mount progress motion values | `DEFAULT_CHART_ENTER_TRANSITION`, `useMountProgress()`, `<ChartRevealClip>` | motion |
| `chart-series` | 15 files: `use-animated-series-path.ts`, `series-path-utils.ts`, `highlight-segment*.ts(x)`, `dash-tail-stroke.tsx`, `series-hover-dim.tsx`, `series-point-marker.tsx`, `area-gradient-defs.tsx`, `fade-edges.ts` | Path building, morph tween, hover dim, dash tails, edge fades | `useAnimatedSeriesPath()`, `<SeriesHoverDim>`, `<SeriesHighlightLayer>` | visx shape, d3-shape, motion |
| `shimmering-text` | `src/components/shimmering-text.tsx` | Per-character color shimmer for loading labels | `text`, `duration`, `paused` | motion |

### Chart primitives / layers

| Item | Path | Does | Key API |
|---|---|---|---|
| `grid` | `grid.tsx`, `use-grid-shimmer.ts` | Grid lines with fades, highlight rows, traveling shimmer | `horizontal`, `vertical`, `numTicksRows`, `rowTickValues`, `highlightRowValues`, `fadeHorizontal`, `hideVerticalEdgeLines`, `shimmer`, `shimmerLength`, `shimmerSpeed`, `shimmerSync`, `yAxisId` |
| `background` | `background.tsx`, `pattern-preset.tsx`, `visx-pattern.tsx` | Pattern fill of the plot area when grid is hidden | 8 presets: `none diagonal horizontal vertical cross dots circles accent` |
| `x-axis` | `x-axis.tsx` (667 LOC) | Time axis, tick thinning, label collision handling | `XAxisProps` |
| `y-axis` | `y-axis.tsx`, `reference-area-geometry.ts` | Value axis, per-axis id, reference-area-tinted labels | `yAxisId`, tick count clamps |
| `chart-tooltip` | 9 files under `tooltip/` + `chart-config-context.tsx`, `indicator-fade.ts` | Portaled crosshair + dots + date pill + panel | see deep dive 4 |
| `legend` | 8 files under `legend/` | Headless compound legend, controlled or uncontrolled hover | `<Legend items>` + `<LegendItem>`/`<LegendMarker>`/`<LegendLabel>`/`<LegendValue>`/`<LegendProgress>` |
| `markers` | `markers/chart-markers.tsx`, `marker-group.tsx` | Event callouts pinned to x positions, clustered | `useActiveMarkers()`, `<ChartMarkers>` |
| `reference-area` | `reference-area.tsx` + geometry + registration context | Shaded data-coordinate band, registers itself with the shell | `y1`, `y2`, `yAxisId`, `ifOverflow`, `axisLabelColor` |
| `projection-line` | `projection-line.tsx`, `projection-utils.ts`, `projection-line-end-marker.tsx` | Forecast segment past the last datum with tangent-matched bezier | `buildProjectionPath()`, `ProjectionMode`, `ProjectionAutoMethod` |
| `bar-depth` | `bar-depth.tsx` (1074 LOC) | 3D side/lid surfaces + glass gloss for bars | `<BarDepthProvider>`, `<BarDepthBack>`, `<BarDepthFront>`, `<BarPulse>` |
| `profit-loss-line` | `profit-loss-line.tsx`, `profit-loss-segments.ts`, legend + hover ctx | Sign-colored line split at zero crossings | `splitProfitLossSegments()`, `profitLossColor()` |
| `chart-stat-flow` | `chart-stat-flow.tsx` | NumberFlow value + label stack used by pie/ring/gauge centers and blocks | `value`, `label`, `formatOptions`, `prefix`, `suffix` |

### Full charts

| Item | Root file | Distinctive vs plain shadcn/Recharts | Signature props |
|---|---|---|---|
| `line-chart` | `line-chart.tsx` (303) | `status="loading" \| "ready"` lifecycle with 8 internal phases, y-domain tween across the transition, LTR clip reveal, path morph on data change | `data`, `xDataKey`, `status`, `loadingLabel`, `yDomainTween`, `yDomainTweenDuration`, `xDomain`, `xDomainSlotCount`, `tweenYDomainOnXDomainChange`, `enterTransition`, `revealSignature`, `aspectRatio`, `onPhaseChange` |
| `area-chart` | `area-chart.tsx` (272) | Same shell + gradient defs, `PatternArea` fill, sweep/pulse loading | as line + `Area` children |
| `bar-chart` | `bar-chart.tsx` (733) | Orientation flip, stacking with `stackGap`, `squareSnap` (bars rendered as stacked squares), pattern fills, 3D depth layer | `barGap`, `barWidth`, `orientation`, `stacked`, `stackGap`, `squareSnap:{squareGap,groupGap,fit}` |
| `composed-chart` | `composed-chart.tsx` (338) | Recharts-style mixed `Line` + `Area` + `SeriesBar` on one time scale, grouped or stacked columns | `barSize`, `maxBarSize`, `barGap`, `stacked`, `stackGap` |
| `scatter-chart` | `scatter-chart.tsx` + shell | Offset rings, hover dimming, `react-use-measure` sizing | `ScatterProps` + shared time shell |
| `candlestick-chart` | `candlestick-chart.tsx` (425) | OHLC with brush, `indicatorColor` callback for green/red crosshair | `candleGap`, `candleWidth`, `xDomain` |
| `live-line-chart` | `live-line-chart.tsx` (688) | Real rAF stream: single loop drives frame + tooltip, `startTransition` commits, `paused` prop | `value`, `window`, `numXTicks`, `nowOffsetUnits`, `exaggerate`, `lerpSpeed`, `paused` |
| `pie-chart` | `pie-chart.tsx` (529) | Hover offset explode, `PieCenter` with NumberFlow, `geometryScrubbing` | `innerRadius`, `padAngle`, `cornerRadius`, `hoverOffset`, `enterStaggerScale`, `geometryScrubbing` |
| `ring-chart` | `ring-chart.tsx` (491) | Multi-ring progress, `--border` track token, staggered arcs | `strokeWidth`, `ringGap`, `baseInnerRadius`, `startAngle`, `endAngle` |
| `radar-chart` | `radar-chart.tsx` (262) | Multi-series polygons with per-metric axes and label placement | `metrics`, `levels`, `staggerScale`, `motionReplayKey` |
| `gauge-chart` | `gauge.tsx` (738) + `notch-gauge-shared.ts` | Notch-based (not arc-stroke) radial OR linear gauge, per-notch hex interpolation, rounded quad notch paths | `totalNotches`, `spacing`, `notchCornerRadius`, `uniformWidth`, `useGradient`, `activeGradient`, `labelPlacement`, `notchLengthPercent`, `linearHeight` |
| `heatmap-chart` | `heatmap/` (22 files) | GitHub-contribution calendar with seeded-random stagger, level styles (color OR pattern), quarter separators, week-start config, loading shimmer cells | `binSize`, `gap`, `levelColors`, `levelStyles`, `columnSeparators`, `weekStartDay`, `loadingCellRandomness`, `enterStaggerScale` |
| `sunburst-chart` | `sunburst-chart.tsx` (488) + `sunburst.ts` (633) | Hierarchical drill-down zoom with geometry lerp, breadcrumb, hint | `data: SunburstNode`, `focusId`, `onFocusChange`, `hoverPop`, `playKey` |
| `sankey-chart` | `sankey/` (6 files) | visx-sankey with animated gradient links and node hover | `nodeWidth`, `nodePadding`, `hoveredNodeIndex` |
| `choropleth-chart` | `choropleth/` (7 files) | visx-geo + visx-zoom, topojson, sequential `--chart-scale-0N` tokens | `scale`, `center`, `translate`, `zoomEnabled`, `zoomMin/Max`, `initialZoom` |
| `funnel-chart` | `funnel-chart.tsx` (1041) | Multi-layer halo rings per stage, curved or straight edges, grouped/spread label layout, grid bands | `layers`, `orientation`, `edges`, `labelLayout`, `labelOrientation`, `labelAlign`, `gap`, `staggerDelay`, `renderPattern`, `grid` |

### Blocks (composed product UI, `registry:block`)

| Item | Files | What |
|---|---|---|
| `stat-card-area-01` | `stat-card-area.tsx`, `stat-card-chart.tsx`, `stat-card-hover-bridge.tsx`, `trend-badge.tsx`, `data/revenue-series.ts` | Revenue card: gradient area sparkline bleeding edge to edge, NumberFlow value that swaps to the hovered point, trend badge |
| `stat-card-line-01` | same shape | Sessions variant |
| `stat-card-choropleth-01` | + `lib/use-world-data.tsx` | Visitors-by-country card |

Plus 17 `registry:example` items, one per chart, auto-generated by `scripts/generate-v0-examples.mjs` so every chart has a v0-openable demo.

---

## 3. Deep dives

### 3.1 Split context: the hover slice never busts the cold slice

`packages/ui/src/charts/chart-context.tsx`. This is the single highest-leverage idea in the repo. Most chart libraries put `tooltipData` in the same context as `xScale`, so every mouse move re-renders the grid, axes, and patterns.

```tsx
export interface ChartHoverContextValue {
  tooltipData: TooltipData | null;
  setTooltipData: Dispatch<SetStateAction<TooltipData | null>>;
  selection?: ChartSelection | null;
  hoveredBarIndex?: number | null;
  hoveredCandleIndex?: number | null;
  // ... setters
}

export type ChartStableContextValue = Omit<ChartContextValue, keyof ChartHoverContextValue>;

const ChartStableContext = createContext<ChartStableContextValue | null>(null);
const ChartHoverContext  = createContext<ChartHoverContextValue  | null>(null);

export function ChartProvider({ children, value }) {
  const stable = useMemo<ChartStableContextValue>(
    () => ({ data: value.data, xScale: value.xScale, /* ~40 fields */ }),
    [value.data, value.xScale, /* the same ~40 identities */]
  );
  const hover = useMemo<ChartHoverContextValue>(
    () => ({ tooltipData: value.tooltipData, /* ... */ }),
    [value.tooltipData, /* ... */]
  );
  return (
    <ChartStableContext.Provider value={stable}>
      <ChartHoverContext.Provider value={hover}>{children}</ChartHoverContext.Provider>
    </ChartStableContext.Provider>
  );
}
```

Three hooks, with the tradeoff stated in the doc comment on each: `useChartStable()` (cold, preferred), `useChartHover()` (re-renders every mouse move), `useChart()` (merged, "explicitly opted in to re-rendering on hover").

Both throw a **teaching error**, not a null:

```ts
throw new Error(
  "useChartStable must be used within a ChartProvider. " +
  "Make sure your component is wrapped in <LineChart>, <AreaChart>, <BarChart>, or <ComposedChart>."
);
```

`Line` then explicitly documents why it subscribes cold:

```tsx
// Stable slice only: hover state lives inside `<SeriesHoverDim>` and
// `<SeriesHighlightLayer>` so this component (and its expensive
// <SeriesDashTailOverlay> child) does not re-render on cursor motion.
const { data, renderData, xScale, innerHeight, innerWidth, xAccessor, lines,
        chartPhase, notifyLoadingPulseComplete, yDomainTweenDuration } = useChartStable();
```

The hover-consuming leaves are pushed as deep in the tree as possible. That is the pattern: **push volatile subscriptions to the leaves, keep trunks cold**.

### 3.2 The chart is a state machine, not a boolean

`packages/ui/src/charts/chart-phase.ts`. Consumers see two values; the renderer sees eight.

```ts
/** Consumer-facing fetch / display status on time-series charts. */
export type ChartStatus = "loading" | "ready";

export type LoadingStyle = "pulse" | "sweep";

export type ChartPhase =
  | "loading" | "exiting" | "gridTweenReady" | "revealing" | "ready"
  | "exitingReady" | "gridTweenLoading" | "revealingLoading";

export const DEFAULT_Y_DOMAIN_TWEEN_MS = 500;
/** Relative domain delta below which Y tween may be skipped. */
export const Y_DOMAIN_TWEEN_SKIP_THRESHOLD = 0.02;

export function resolveRestingChartPhase(status: ChartStatus): ChartPhase {
  return status === "loading" ? "loading" : "ready";
}
export function isChartInteractionPhase(phase: ChartPhase): boolean {
  return phase === "ready";
}
```

The phase list is symmetric: loading to ready runs `exiting -> gridTweenReady -> revealing -> ready`, and ready back to loading runs `exitingReady -> gridTweenLoading -> revealingLoading -> loading`. The skeleton and the real data both compute nice-ed y-domains (`yDomainSkeletonByAxis`, `yDomainTargetByAxis`) so the grid can **tween between them** instead of snapping. `isChartInteractionPhase` gates the tooltip so you cannot hover a skeleton.

`Line` reads the phase to decide what stroke is even visible:

```tsx
const showSeriesStroke =
  chartPhase === "revealing" || chartPhase === "ready" || chartPhase === "exitingReady";
let visibleStroke = "transparent";
if (showSeriesStroke && !hasDashTail) visibleStroke = lineStroke;
```

### 3.3 LTR clip reveal, and why not scaleX

`packages/ui/src/charts/chart-reveal-clip.tsx`.

```tsx
/**
 * Left-to-right clip reveal for cartesian series.
 * Grows clip rect width from 0 to full (true LTR; scaleX is avoided, it reveals from center).
 */
export function ChartRevealClip({ clipPathId, height, targetWidth, enterTransition,
                                  revealEpoch, padding = 0, animating = true,
                                  mode = "reveal", onComplete }: ChartRevealClipProps) {
  const transition = clipRevealTransition(enterTransition);
  const paddedWidth  = Math.max(0, targetWidth + padding * 2);
  const paddedHeight = height + padding * 2;

  if (!animating) return <clipPath id={clipPathId}><rect height={paddedHeight} width={paddedWidth} x={-padding} y={-padding} /></clipPath>;

  if (mode === "conceal") {
    const rightEdge = -padding + paddedWidth;
    return (
      <clipPath id={clipPathId}>
        <motion.rect
          initial={{ width: paddedWidth, x: -padding }}
          animate={{ width: 0, x: rightEdge }}
          key={`conceal-${revealEpoch}`}
          onAnimationComplete={() => onComplete?.()}
          transition={transition} height={paddedHeight} y={-padding}
        />
      </clipPath>
    );
  }

  return (
    <clipPath id={clipPathId}>
      <motion.rect initial={{ width: 0 }} animate={{ width: paddedWidth }}
        key={`reveal-${revealEpoch}`} transition={transition}
        height={paddedHeight} width={paddedWidth} x={-padding} y={-padding} />
    </clipPath>
  );
}
```

Paired with `animation.ts`, which encodes the one hard constraint:

```ts
export const DEFAULT_ANIMATION_EASING = "cubic-bezier(0.85, 0, 0.15, 1)";
export const DEFAULT_ANIMATION_DURATION_MS = 1100;
export const DEFAULT_CHART_ENTER_TRANSITION: Transition = {
  type: "tween", duration: 1.1, ease: [0.85, 0, 0.15, 1],
};

/** Clip-path width reveal must use tween: spring does not reliably animate SVG width. */
export function clipRevealTransition(enterTransition?: Transition): Transition {
  if (enterTransition?.type === "tween")
    return { ...enterTransition, ease: enterTransition.ease ?? DEFAULT_CHART_ENTER_TRANSITION.ease };
  const duration = typeof enterTransition?.duration === "number"
    ? enterTransition.duration : DEFAULT_ANIMATION_DURATION_MS / 1000;
  return { type: "tween", duration, ease: DEFAULT_CHART_ENTER_TRANSITION.ease };
}
```

Three ideas worth stealing: the API accepts a user spring but **downgrades it to a tween where springs are physically wrong**; `revealEpoch` as an animation key so replay is a number bump instead of a remount; `padding` so round line caps at the edge are not clipped.

### 3.4 Tooltip: portal + rAF dedupe + three coordinated overlays

`packages/ui/src/charts/tooltip/chart-tooltip.tsx` plus `use-scheduled-tooltip.ts`.

The scheduler collapses N mousemove events per frame into at most one state commit, and dedupes by data index:

```ts
function defaultDedupeKey<T>(tooltip: T): string {
  if (typeof tooltip === "object" && tooltip !== null && "index" in tooltip &&
      typeof (tooltip as { index: unknown }).index === "number") {
    const { index, x } = tooltip as { index: number; x?: number };
    if (typeof x === "number") return `${index}:${Math.round(x)}`;
    return String(index);
  }
  return JSON.stringify(tooltip);
}

const scheduleTooltip = useCallback((tooltip: T, dedupeKey?: string) => {
  const key = dedupeKey ?? defaultDedupeKey(tooltip);
  pendingRef.current = tooltip;
  pendingKeyRef.current = key;
  if (key === lastKeyRef.current) return;   // same datum, no work
  if (rafRef.current !== null) return;      // already scheduled this frame
  rafRef.current = requestAnimationFrame(() => {
    rafRef.current = null;
    const next = pendingRef.current, nextKey = pendingKeyRef.current;
    if (next && nextKey) commitTooltip(next, nextKey);
  });
}, [commitTooltip]);
```

The tooltip itself is a `createPortal` into the chart container, split into crosshair SVG, dots SVG, panel div, and date pill. The dense-data heuristic is one line:

```tsx
const discreteInteraction = dateLabels.length > 60;
```

Above 60 points it stops spring-following the cursor and snaps, because spring lag at high density reads as lag, not polish. Ring dot size is derived from the actual band geometry rather than a magic number:

```tsx
const resolvedDotSize = useMemo(() => {
  if (dotVariant !== "ring" || !bandWidth || lines.length === 0) return dotSize * dotScale;
  const seriesCount = lines.length;
  const gap = squareSnap?.groupGap ?? (seriesCount > 1 ? 4 : 0);
  const squareSize = (bandWidth - gap * (seriesCount - 1)) / seriesCount;
  return (squareSize / 2) * dotScale;
}, [bandWidth, dotScale, dotSize, dotVariant, lines.length, squareSnap?.groupGap]);
```

And a detail most implementations get wrong, spring initialization on first hover:

```tsx
// Inner-only-on-visible so `useSpring` initializes at the real cursor x
// instead of `margin.left` on first hover.
function DatePillTracker(props: DatePillTrackerProps) {
  if (!(props.enabled && props.visible && props.labels.length > 0)) return null;
  return <DatePillTrackerInner {...props} />;
}
```

`indicatorColor` accepts a function of the hovered point, which is how the candlestick crosshair turns green or red:

```tsx
<ChartTooltip
  indicatorColor={(point) =>
    (point.close as number) >= (point.open as number) ? "var(--chart-1)" : "var(--chart-3)"}
  showDots={false}
/>
```

### 3.5 Children as declarative layer config

`packages/ui/src/charts/chart-child-passthrough.ts` plus the scan in `time-series-chart-shell.tsx`. The shell reads its own JSX children, classifies each into a render bucket, and emits them in the correct SVG z-order. This is what makes `<LineChart><Grid/><Line/><XAxis/><ChartTooltip/></LineChart>` work without the caller thinking about layering.

```ts
const CLIP_EXCLUDED_COMPONENT_NAMES = new Set([
  "Background", "Grid", "XAxis", "YAxis", "BarXAxis", "BarYAxis", "LiveXAxis", "LiveYAxis",
]);
const UNDERLAY_COMPONENT_NAMES = new Set(["ReferenceArea", "BarColumnTrack"]);

/** Markers render after the interaction overlay so they stay clickable. */
export function isPostOverlayComponent(child: ReactElement): boolean {
  const t = child.type as { displayName?: string; name?: string; __isChartMarkers?: boolean; __isPostOverlay?: boolean };
  if (t.__isChartMarkers || t.__isPostOverlay) return true;
  const name = typeof child.type === "function" ? t.displayName || t.name || "" : "";
  return name === "ChartMarkers" || name === "MarkerGroup" || name === "ChartBrush";
}

/** Walk chart children, flattening React fragments (studio groups layers in `<>...</>`). */
export function forEachChartChild(children: ReactNode, cb: (c: ReactElement, i: number) => void) {
  let index = 0;
  const visit = (nodes: ReactNode) => {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return;
      if (child.type === Fragment) return visit((child.props as { children?: ReactNode }).children);
      cb(child, index); index += 1;
    });
  };
  visit(children);
}

/** Marker on wrapper components whose single child should inherit clip classification. */
export const CHART_CLIP_PASSTHROUGH = "__chartClipPassthrough" as const;
export function resolveChartChildElement(child: ReactElement): ReactElement {
  if (isChartClipPassthrough(child.type)) {
    const inner = (child.props as { children?: unknown }).children;
    if (isValidElement(inner)) return resolveChartChildElement(inner);
  }
  return child;
}
```

Five buckets in the shell:

```tsx
const defsChildren, clipExcludedChildren, underlayChildren, preOverlayChildren, postOverlayChildren = [];
Children.forEach(children, (child, index) => {
  if (!isValidElement(child)) return;
  const resolvedChild = resolveChartChildElement(ensureChildKey(child, index));
  if (isGradientDefComponent(resolvedChild))      defsChildren.push(resolvedChild);
  else if (isPatternDefComponent(resolvedChild))  preOverlayChildren.push(resolvedChild);
  else if (isPostOverlayComponent(resolvedChild)) postOverlayChildren.push(resolvedChild);
  else if (isClipExcludedComponent(resolvedChild))clipExcludedChildren.push(resolvedChild);
  else if (isUnderlayComponent(resolvedChild))    underlayChildren.push(resolvedChild);
  else                                             preOverlayChildren.push(resolvedChild);
});
```

Two escape hatches so the classification is not name-only: a static marker property (`__isChartMarkers`) and a passthrough symbol for visibility wrappers (Studio's layer eye toggle wraps children, and the wrapper must not be misclassified).

Components that need to survive a re-parent also register imperatively. `ReferenceArea` writes itself into a `Map` in the shell, with an identity-preserving guard so re-registration does not loop:

```tsx
const registerReferenceArea = useCallback((id: string, config: ReferenceAreaConfig) => {
  setRegisteredReferenceAreas((prev) => {
    const existing = prev.get(id);
    if (existing && existing.yAxisId === config.yAxisId && existing.y1 === config.y1 &&
        existing.y2 === config.y2 && existing.axisLabelColor === config.axisLabelColor) return prev;
    const next = new Map(prev); next.set(id, config); return next;
  });
}, []);
```

### 3.6 Path morphing instead of remount

`packages/ui/src/charts/use-animated-series-path.ts`. When the data changes, the line does not re-draw from zero; it interpolates point-for-point to the new shape.

```ts
const transitionSignature = useMemo(() => seriesPathTransitionSignature({
  renderData, xAccessor, dataKey, innerWidth,
  xDomainMin: xScaleDomain[0]?.getTime?.() ?? 0,
  xDomainMax: xScaleDomain[1]?.getTime?.() ?? 0,
}), [renderData, xAccessor, dataKey, innerWidth, xScaleDomain]);

const shouldAnimate = enabled && !reducedMotion && chartPhase === "ready"
                   && durationMs > 0 && renderData.length > 0;
if (!shouldAnimate) { animatingRef.current = false; setAnimatedPoints(null);
  displayedPointsRef.current = targetPoints; prevTransitionSignatureRef.current = transitionSignature; return; }
if (prevTransitionSignatureRef.current === transitionSignature) return;

const fromSnapshot = displayedPointsRef.current ?? targetPoints;
const control = animate(0, 1, {
  duration: durationMs / 1000,
  ease: [...LINE_LOADING_PULSE_EASE],
  onUpdate: (progress) => {
    const currentTarget = computeSeriesPathPoints(renderData, xAccessor, xScale, yScale, dataKey);
    const next = interpolateSeriesPathPoints(fromSnapshot, currentTarget, progress);
    displayedPointsRef.current = next; setAnimatedPoints(next);
  },
  onComplete: () => { animatingRef.current = false; displayedPointsRef.current = targetPoints; setAnimatedPoints(null); },
});
return () => { control.stop(); animatingRef.current = false; };
```

Points worth copying: a cheap **string signature** decides whether to animate at all (deep compare avoided); interrupting mid-flight starts from the currently displayed points, not the old target, so rapid updates do not snap; `onUpdate` recomputes the target every frame so a resize during the tween still lands correctly; `useReducedMotion()` short-circuits the whole thing.

### 3.7 The single rAF loop in the streaming chart

`packages/ui/src/charts/live-line-chart.tsx`. One loop owns both the animation frame and the tooltip so there is no effect-to-setState feedback cycle.

```tsx
// ---- rAF loop: update frame and tooltip in one place to avoid effect->setState loops ----
useEffect(() => {
  let raf: number;
  const tick = () => {
    const next = nextAnimFrame(animRef.current, targetRange, value, lerpSpeed, pausedRef.current);
    animRef.current = next;

    const nextTooltip = resolveLiveTooltip(cursorXRef.current, innerWidth, innerHeight,
                                           next, leadingMs, windowMs, xTickUnitMs,
                                           dataRef.current, dataKeyRef.current);
    const now = performance.now();
    const tooltipKey = liveTooltipKey(nextTooltip, dataKeyRef.current);
    const { commitFrame, commitTooltip } = shouldCommitLiveUpdates(
      now, lastFrameCommitRef.current, tooltipKey, lastTooltipKeyRef.current);

    if (!(commitFrame || commitTooltip)) { raf = requestAnimationFrame(tick); return; }
    if (commitFrame)   lastFrameCommitRef.current = now;
    if (commitTooltip) lastTooltipKeyRef.current  = tooltipKey;

    startTransition(() => {
      if (commitFrame)   setFrame(next);
      if (commitTooltip) setTooltipData(nextTooltip);
    });

    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, [targetRange, value, lerpSpeed, leadingMs, windowMs, xTickUnitMs, innerWidth, /* ... */]);
```

Live-changing props are mirrored into refs (`pausedRef`, `dataRef`, `dataKeyRef`) so the effect does not need them in its dependency array and never restarts the loop mid-stream. `startTransition` marks the commit non-urgent so React can drop frames under load instead of blocking input. `shouldCommitLiveUpdates` is a pure, unit-testable throttle predicate.

### 3.8 Notch gauge: geometry is a pure module

`packages/ui/src/charts/notch-gauge-shared.ts`. The gauge is not an arc stroke with `stroke-dasharray`. It is N independent quadrilateral notches, each with rounded corners computed from its own edge lengths, each filled by a color interpolated along the gradient by its index.

```ts
export const DEFAULT_ACTIVE_GRADIENT: readonly [string, string] = ["#bef264", "#10b981"];
export const DEFAULT_ACTIVE_FILL_OPACITY = 1;
export const DEFAULT_INACTIVE_FILL_OPACITY = 0.8;
export const DEFAULT_LINEAR_GAUGE_HEIGHT = 24;

export interface NotchPoint { x1:number; y1:number; x2:number; y2:number; x3:number; y3:number; x4:number; y4:number }
export interface ComputedNotch { index:number; points:NotchPoint; isActive:boolean; gradientColor:string; xCenter:number; yCenter:number }

export function interpolateGaugeHex(color1: string, color2: string, factor: number): string {
  const hex = (c: string) => Number.parseInt(c, 16);
  const r1 = hex(color1.slice(1,3)), g1 = hex(color1.slice(3,5)), b1 = hex(color1.slice(5,7));
  const r2 = hex(color2.slice(1,3)), g2 = hex(color2.slice(3,5)), b2 = hex(color2.slice(5,7));
  const r = Math.round(r1 + (r2-r1)*factor), g = Math.round(g1 + (g2-g1)*factor), b = Math.round(b1 + (b2-b1)*factor);
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}

export function createNotchPath(points: NotchPoint, cornerRadiusPx: number, verticalDepth: number): string {
  const { x1,y1,x2,y2,x3,y3,x4,y4 } = points;
  const dist = (ax,ay,bx,by) => Math.hypot(bx-ax, by-ay);
  const d12 = dist(x1,y1,x2,y2), d23 = dist(x2,y2,x3,y3), d34 = dist(x3,y3,x4,y4), d41 = dist(x4,y4,x1,y1);
  if (cornerRadiusPx <= 0) return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`;
  const minEdge = Math.min(d12, d23, d34, d41);
  const cr = Math.min(cornerRadiusPx, verticalDepth * 0.48, /* ... clamps to the shortest edge */);
  // ... arc-joined path
}
```

The corner radius is **clamped by the shortest edge of that specific notch**, so notches near the ends of a radial sweep (which are geometrically thinner) do not self-intersect. Same class of care as `bar-depth-geometry.ts`:

```ts
/** Hard ceiling on side-face thickness in px. Capped further by the column gap
 * so depth never bleeds past the next bar's leading edge. */
export const BAR_DEPTH_MAX_PX = 7;
/** The side parallelogram's back edge lifts by `depth * this ratio`. */
export const BAR_DEPTH_PERSPECTIVE_RATIO = 0.45;

export function barDepthMaxDepth(stepWidth: number, bandWidth: number): number {
  const gap = Math.max(0, stepWidth - bandWidth);
  return Math.min(bandWidth * 0.22, Math.max(0, gap - 1), BAR_DEPTH_MAX_PX);
}

export function barDepthAndRise(absOffset: number, naturalHeight: number, maxDepth: number) {
  const offset = Math.min(1, Math.max(0, absOffset));
  const cappedMaxDepth = Math.min(maxDepth, Math.max(0, naturalHeight));
  const depth = offset * cappedMaxDepth;
  return { depth, perspectiveRise: depth * BAR_DEPTH_PERSPECTIVE_RATIO };
}
```

`absOffset` is the bar's normalized distance from chart center: 0 at dead center means no depth, 1 at the edge means full depth. That is a fake single-vanishing-point perspective produced by three lines of arithmetic. The file header states why it exists: it is "the single source of truth for the perspective math used by BOTH `<Bar perspective>` and `<BarDepthBack>` ... the front face and the 3D lid can never drift out of alignment."

### 3.9 Seeded randomness so the heatmap shimmer is deterministic

`packages/ui/src/charts/heatmap/heatmap-animation.ts`. Random stagger looks organic but must be identical across SSR, hydration, and replays.

```ts
export const HEATMAP_DEFAULT_ENTER_DURATION_MS = 1600;
export const HEATMAP_DEFAULT_ENTER_EASE = [0.85, 0, 0.916, 0.282] as const;
export const HEATMAP_ENTER_STAGGER_SPREAD = 0.6;

function seededRandom(seed: number): () => number {          // Lehmer / Park-Miller
  let state = seed % 2_147_483_647;
  if (state <= 0) state += 2_147_483_646;
  return () => { state = (state * 16_807) % 2_147_483_647; return (state - 1) / 2_147_483_646; };
}

export function heatmapCellSeed(column: number, row: number): number {
  return column * 1009 + row * 9176;                          // two coprime-ish primes
}

/** Random delay so ALL cells finish fading in within `animationDurationMs`. */
export function computeHeatmapEnterFadeDelayMs({ column, row, revealEpoch, animationDurationMs,
                                                 enterStaggerScale, fadeDurationSec }) {
  const random = seededRandom(heatmapCellSeed(column, row) + revealEpoch * 524_287);
  const fadeMs = fadeDurationSec * 1000;
  const maxDelayMs = Math.max(0, animationDurationMs - fadeMs);
  const spreadMs = maxDelayMs * HEATMAP_ENTER_STAGGER_SPREAD * Math.max(enterStaggerScale, 0.25);
  return random() * spreadMs;
}

export function heatmapLoadingCellParticipates(column: number, row: number, randomness: number): boolean {
  if (randomness >= 1) return true;
  if (randomness <= 0) return false;
  return seededRandom(heatmapCellSeed(column, row) + 73_133)() < randomness;
}
```

The key constraint is `maxDelayMs = animationDurationMs - fadeMs`: the delay budget subtracts the fade duration so the **last** cell still completes inside the stated window. `revealEpoch * 524_287` reseeds on replay so the second play does not repeat the first pattern. `enterStaggerScale` is clamped at 0.25 so a user setting 0 does not collapse the effect.

### 3.10 Loading is a first-class visual, not a spinner

Four coordinated pieces.

`shimmering-text.tsx` splits a string into per-character `motion.span`s with an index-derived delay, and drives color through CSS variables so it inherits theme:

```tsx
const createCharVariants = useCallback((charIndex: number): Variants => ({
  running: {
    color: ["var(--color)", "var(--shimmering-color)", "var(--color)"],
    transition: { duration, repeat: Number.POSITIVE_INFINITY, repeatType: "loop",
                  repeatDelay: text.length * 0.05,
                  delay: (charIndex * duration) / text.length, ease: "easeInOut" },
  },
  stopped: { color: "var(--color)", transition: { duration: duration * 0.5, ease: "easeOut" } },
}), [duration, text.length]);

// container sets the two variables so any parent can retheme the shimmer:
className={cn("inline-flex select-none items-center leading-none",
  "[--color:var(--muted-foreground)] [--shimmering-color:var(--foreground)]", className)}

// and the a11y fallback:
<motion.span aria-hidden ...>{char}</motion.span>
<span className="sr-only">{text}</span>
```

`useReducedMotion()` is folded into a single `stopped` boolean: `const stopped = isStopped || paused || reducedMotion === true;`.

`use-grid-shimmer.ts` runs a traveling sweep across the grid, with three modes (free loop, synced loop with pause, one-shot handoff), and computes the travel as a `useTransform` on a motion value so nothing re-renders:

```ts
const shimmerCycleS = LINE_LOADING_PULSE_CYCLE_S / Math.max(shimmerSpeed, 0.1);
const shimmerEnabled = active && shimmer && reducedMotion !== true && innerWidth > 0;

if (shimmerSync && oneShot) {                 // loading -> ready handoff: half a cycle, once
  progress.set(0);
  controls = animate(progress, 1, { duration: shimmerCycleS / 2, ease: [...LINE_LOADING_PULSE_EASE] });
  return () => controls?.stop();
}

const shimmerX = useTransform(progress, (v) => -shimmerLength + v * (innerWidth + shimmerLength * 2));
const shimmerTransform = useTransform(shimmerX, (x) => `translate(${x}, 0)`);
```

`Line` picks its loading visual from the phase, not from a prop, and self-loops with an explicit pause:

```tsx
const phasePulseMode = resolveLineLoadingPulseMode(chartPhase);
const pulseMode = loading === false ? null
                : (loadingPulseMode ?? (loading === true ? "loop" : phasePulseMode));
const showLoadingPulse = pulseMode != null;
const effectiveShowHighlight = showHighlight && !showLoadingPulse;  // no hover highlight on a skeleton

const handleLoadingPulseComplete = useCallback(() => {
  onLoadingPulseCycleComplete?.();
  if (pulseMode === "loop") {
    window.setTimeout(() => setPulseEpoch((e) => e + 1), LINE_LOADING_LOOP_PAUSE_MS);
    return;
  }
  notifyLoadingPulseComplete?.();   // hands control back to the phase orchestrator
}, [notifyLoadingPulseComplete, onLoadingPulseCycleComplete, pulseMode]);
```

### 3.11 The headless hover bridge (block pattern)

`packages/ui/registry/blocks/stat-card-area-01/components/stat-card-hover-bridge.tsx`. A component that renders `null`, lives inside the chart to get context, and lifts derived state out to the card header. This is how the big NumberFlow value above the chart tracks the hovered point.

```tsx
/** Syncs hovered chart values, labels, and trend into stat card UI. */
export function StatCardHoverBridge({ dataKey, dateKey = "date", formatLabel, onHoverChange }) {
  const { data, tooltipData } = useChart();
  useEffect(() => {
    if (!tooltipData?.point) { onHoverChange({ value: null, label: null, trend: null }); return; }
    const raw = tooltipData.point[dataKey];
    const value = typeof raw === "number" ? raw : null;
    const date  = parsePointDate(tooltipData.point[dateKey]);
    const label = date ? formatLabel(date) : null;
    const trend = computePeriodTrend(data, tooltipData.index, dataKey);
    onHoverChange({ value, label, trend });
  }, [data, dataKey, dateKey, formatLabel, onHoverChange, tooltipData]);
  return null;
}
```

Consumed with a fallback-to-summary pattern, so nothing is empty at rest:

```tsx
const [hover, setHover] = useState<StatCardHoverState>({ value: null, label: null, trend: null });
const displayValue = hover.value ?? revenueStats.average;
const displayLabel = hover.label ?? "Avg";
const displayTrend = hover.trend ?? revenueStats.trend;
```

The chart bleeds past the card padding using negative margins plus a CSS variable for height, targeted at the chart's own generated wrapper class:

```tsx
export const statCardChartHeights = {
  sm: "[--stat-card-chart-h:96px]", md: "[--stat-card-chart-h:190px]", lg: "[--stat-card-chart-h:420px]",
} as const;

<div className={cn(
  "relative -mx-4 -mb-3 overflow-hidden",
  "[&_.relative.w-full]:aspect-auto! [&_.relative.w-full]:h-[var(--stat-card-chart-h)]!",
  statCardChartHeights[size], className)}>
```

### 3.12 Compound legend with `cloneElement` templating

`packages/ui/src/charts/legend/legend.tsx`. You pass **one** `<LegendItem>` as the template; `Legend` clones it per data item and supplies each clone its own context.

```tsx
export function Legend({ items, hoveredIndex: controlled, onHoverChange, title, className, children }) {
  const [internal, setInternal] = useState<number | null>(null);
  const isControlled = controlled !== undefined;
  const hoveredIndex = isControlled ? controlled : internal;
  const setHoveredIndex = (i: number | null) => isControlled ? onHoverChange?.(i) : setInternal(i);

  return (
    <LegendProvider value={{ items, hoveredIndex, setHoveredIndex }}>
      <div className={cn("legend-container flex flex-col gap-2", className)}>
        {items.map((item, index) => {
          const itemContext = {
            item, index,
            isHovered: hoveredIndex === index,
            isFaded: hoveredIndex !== null && hoveredIndex !== index,
            percentage: item.maxValue ? (item.value / item.maxValue) * 100 : 0,
          };
          if (isValidElement(children))
            return <LegendItemProvider key={item.label} value={itemContext}>{cloneElement(children)}</LegendItemProvider>;
          return null;
        })}
      </div>
    </LegendProvider>
  );
}
```

The dim-siblings-on-hover effect is then pure CSS in `apps/web/app/globals.css`, no React state at all:

```css
.legend-container:has([data-hovered]) > *:not([data-hovered]) { opacity: 0.5; }
.legend-container > * { transition: opacity 150ms ease-out; }
```

### 3.13 Funnel halo rings

`packages/ui/src/charts/funnel-chart.tsx`. Each stage is drawn N times at decreasing scale and increasing opacity, producing a glow without any blur filter (blur filters are expensive and render differently across browsers).

```tsx
const rings = Array.from({ length: layers }, (_, l) => {
  const scale   = 1 - (l / layers) * 0.35;                 // 1.00 -> 0.65
  const opacity = 0.18 + (l / (layers - 1 || 1)) * 0.65;   // 0.18 -> 0.83
  return { d: hSegmentPath(normStart, normEnd, segW, fullH, scale, straight), opacity };
});

{rings.map((r, i) => {
  const isInnermost = i === rings.length - 1;
  let ringFill: string | undefined;
  if (isInnermost && renderPattern)      ringFill = `url(#${patternId})`;
  else if (isInnermost && gradientStops) ringFill = `url(#${gradientId})`;
  const ringKey = `h-ring-${r.opacity.toFixed(2)}`;
  return <HRing color={color} d={r.d} fill={ringFill} hovered={hovered} key={ringKey}
                opacity={r.opacity} ringIndex={i} totalRings={layers} />;
})}
```

Only the innermost ring gets the gradient or pattern; the halos stay flat color. The segment path is a bezier trapezoid built from normalized values:

```tsx
function hSegmentPath(normStart, normEnd, segW, H, layerScale, straight = false) {
  const my = H / 2;
  const h0 = normStart * H * 0.44 * layerScale;
  const h1 = normEnd   * H * 0.44 * layerScale;
  if (straight) return `M 0 ${my-h0} L ${segW} ${my-h1} L ${segW} ${my+h1} L 0 ${my+h0} Z`;
  // ... cubic version for edges="curved"
}
```

`0.44` is the magic constant: max half-height is 44 percent of the container, leaving 12 percent breathing room top and bottom.

Enter animation swaps rendering strategy at completion, which is a real performance trick: while entering, one `motion.div` scales the whole SVG (one composited transform); once complete, it switches to the static SVG so hover interactions hit real geometry.

```tsx
const enterComplete = useEnterComplete(mountProgress);
const entranceScaleX = useTransform(mountProgress, [0, 1], [0, 1]);
{enterComplete ? <div className="absolute inset-0 overflow-visible"><svg>...</svg></div>
               : <motion.div style={{ scaleX: entranceScaleX, scaleY: entranceScaleY,
                                      transformOrigin: "left center" }}>...</motion.div>}
```

---

## 4. Craft rules extracted

**Context and performance**

1. Split any provider into a stable slice and a volatile slice. Give each its own `createContext` and its own `useMemo` dependency list. Ship three hooks and document the re-render cost of each in the JSDoc.
2. Push volatile subscriptions to leaves. A component that renders an expensive subtree subscribes cold and delegates hover to a small child.
3. Mirror fast-changing props into refs before an rAF or event loop so the effect never restarts.
4. Coalesce high-frequency events into at most one commit per frame, and dedupe by semantic key (data index), not by pixel.
5. `startTransition` around streaming state commits so React can drop frames instead of blocking input.
6. Compute derived motion values with `useTransform`, never with `useState` in an animation loop.

**Animation**

7. Name your defaults and export them: `DEFAULT_ANIMATION_DURATION_MS = 1100`, `DEFAULT_ANIMATION_EASING = "cubic-bezier(0.85, 0, 0.15, 1)"`.
8. Accept a user transition, then **coerce it where it is physically wrong**. `clipRevealTransition` downgrades springs to tweens because springs do not reliably animate SVG width.
9. Reveal left to right with an animated `clipPath` rect width. Never `scaleX`, that reveals from center.
10. Replay animations with an epoch number in the motion `key`, not a component remount.
11. Interpolate between shapes on data change instead of re-running the enter animation. Snapshot the currently displayed points at interrupt time so rapid updates never snap.
12. Gate on a cheap signature string before deciding to animate.
13. Seed all "random" stagger. `seed = column * 1009 + row * 9176`, reseeded with `revealEpoch * 524_287`. SSR-safe and replay-varied.
14. Budget stagger delay as `total - fadeDuration` so the last element still lands inside the promised window.
15. Swap from a single composited transform during enter to real geometry after enter completes.
16. Honor `useReducedMotion()` at the top of every animation hook, folded into one boolean.

**Geometry**

17. Put geometry math in a pure `.ts` module with a header explaining which components share it and what drift it prevents. Unit test it (`__tests__/bar-depth-geometry.test.ts`, `highlight-segment-bounds.test.ts`, `heatmap-*.test.ts`).
18. Clamp every derived dimension against its neighbors: corner radius against the shortest edge, depth against the column gap minus one pixel and against the bar's own height.
19. Derive sizes from layout, not constants. Ring dot radius comes from `bandWidth`, series count, and gap.
20. Fake perspective with a normalized distance-from-center term. Cheap, no 3D library.
21. Stack scaled copies for glow instead of SVG blur filters.

**Theming**

22. Every color goes through a CSS variable, exported as a typed object so it autocompletes:
```ts
export const chartCssVars = { background: "var(--chart-background)", crosshair: "var(--chart-crosshair)",
  grid: "var(--chart-grid)", indicatorColor: "var(--chart-indicator-color)", /* 17 total */ };
```
23. Three distinct token families, not one: categorical `--chart-1..5`, sequential `--chart-scale-01..05` (+ `--chart-scale-pattern-color`), and reuse of the host design system's `--border` for tracks and gridlines so charts inherit the app's neutrals.
24. Dark mode lives in `:root` / `.dark` variable overrides only. Never `dark:` on individual SVG elements.
25. Component-local variables via Tailwind arbitrary properties are legitimate API: `[--stat-card-chart-h:190px]`, `[--color:var(--muted-foreground)]`.
26. Use `:has()` for sibling-dim effects instead of React state.

**Component API**

27. Root plus children. Children are read by the root, classified into z-order buckets, and rendered. Never make the caller order layers.
28. Provide escape hatches to the classifier: a static marker prop on the component function and a passthrough symbol for wrapper components.
29. Support both controlled and uncontrolled hover on every interactive component (`hoveredIndex` + `onHoverChange`, falling back to internal state).
30. Colors, labels and content props accept `string | ((point) => string)`. Function form is what makes candlestick crosshairs and per-row tinting possible.
31. Every doc comment states the default inline: `/** Stroke width. Default: 2.5 */`.
32. Error messages teach: name the hook, name the valid parents.
33. Ship a headless bridge component (renders `null`, reads context, calls back) so page-level chrome can react to in-chart state.
34. Ship loading as a real design surface, not a spinner: skeleton data generators, pulse and sweep styles, shimmer text labels, and a domain tween into the real data.

**Distribution**

35. Registry items are layered: `lib` -> shared `component` foundations -> charts -> blocks -> examples. A chart declares `registryDependencies: ["@bklit/chart-context", "@bklit/chart-animation", ...]` so the CLI installs the graph.
36. Verify the registry in CI: every relative import in an item's transitive closure must be shipped by that item or a declared dependency. Reject CJS requires that break ESM consumers.
37. Auto-generate the example item per component so every entry has a runnable demo.
38. Ship a consumer skill next to the library, with `allowed-tools` scoped to the package runners and live project state injected via `!\`npx shadcn@latest info --json\``.

---

## 5. What to steal for a skill library

**Steal directly as skill rules files** (bklit's own `skills/bklit-ui/rules/*.md` shape is the model): one topic per file, each opening with an **Incorrect** block then a **Correct** block, no prose padding. `composition.md`, `theming.md`, `animation.md`, `tooltips.md`, `installation.md` are 40 to 75 lines each. That is the right size.

**Steal the SKILL.md skeleton**:
- `description` written as trigger phrases, not a summary
- `allowed-tools` narrowed to specific command prefixes
- a live-state injection block (`!\`cmd\``) so the agent never guesses project config
- numbered Principles (5, imperative, each one sentence)
- Critical Rules with links out to detail files
- a **catalog table** mapping "use when" to install command to docs URL, so the agent picks by intent
- a numbered Workflow
- a Quick Reference with both shell and a minimal correct code sample

**Steal these as reusable technique entries in the library:**

| Technique | File to lift from | One-line rule |
|---|---|---|
| Split stable/volatile context | `chart-context.tsx` | Two contexts, three hooks, cost documented per hook |
| Phase machine over boolean | `chart-phase.ts` | 2 public statuses, 8 internal phases, symmetric forward/reverse |
| LTR clip reveal | `chart-reveal-clip.tsx` | Animate clipPath rect width, never scaleX |
| Transition coercion | `animation.ts` | Accept user spring, force tween where springs break |
| rAF dedupe scheduler | `use-scheduled-tooltip.ts` | One commit per frame, dedupe by index |
| Path morph on data change | `use-animated-series-path.ts` | Signature gate, snapshot on interrupt, recompute target each frame |
| Single-loop streaming | `live-line-chart.tsx` | Refs for live props, `startTransition` commits, pure throttle predicate |
| Children as layer config | `chart-child-passthrough.ts` | Classify children into z-buckets, escape hatches for wrappers |
| Seeded stagger | `heatmap-animation.ts` | Lehmer RNG keyed on (col,row,epoch), delay budget minus fade |
| Pure geometry modules | `bar-depth-geometry.ts`, `notch-gauge-shared.ts` | Shared math in a tested `.ts`, clamp against neighbors |
| Halo without blur | `funnel-chart.tsx` | N scaled copies, opacity ramp, gradient only on innermost |
| Compound + cloneElement | `legend/legend.tsx` | One child template cloned per item with per-item context |
| Headless bridge | `stat-card-hover-bridge.tsx` | Renders null, reads context, lifts derived state |
| Loading as design | `shimmering-text.tsx`, `use-grid-shimmer.ts`, `loading-sweep.tsx` | Skeleton + pulse/sweep + shimmer label + domain tween |
| Token triad | `theming.mdx`, `chart-context.tsx` | Categorical, sequential, and host-system tokens are three different things |
| Registry layering + verify | `registry.json`, `scripts/verify-registry-*.mjs` | Dependency graph plus a closure verifier in CI |

**Do not steal**: the `apps/web` Fumadocs coupling (the docs site also serves the registry, which is convenient but ties publishing to a Next deploy), the `@visx/*@4.0.1-alpha.0` pins (alpha across 15 packages), and `packages/studio` (proprietary, and its URL-state control-group architecture is heavier than a component library needs).
