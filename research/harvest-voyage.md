# Harvest: web design and frontend reference material from the Voyage bookmark index

Run date: 2026-07-25. Target: the gmira web design skill library.

---

## 1. Method

**Index used.** One flat Voyage `voyage-3-large` vector index over the owner's unified bookmark
corpus at `C:\Users\oasrvadmin\Documents\OpenMark`. Sources merged into that corpus: X bookmarks,
LinkedIn saves, GitHub stars, Edge favorites, Raindrop, and older HTML exports.

**Actual size at run time: 17,647 rows**, verified aligned across the three files
(`data/corpus_2026-07-12.jsonl`, `data/voyage_index.npy` at 17647 x 1024, `data/voyage_meta.jsonl`).
The brief said 17,499 and the handoff doc said 17,562 after its first incremental add, so the index
has grown twice since it was written. Of those rows, **2,499 are GitHub URLs**.

**What was used, honestly.** Voyage vector search plus local keyword grep over the corpus. Nothing
else. The Graphify concept graph and the Neo4j app layer are separate systems and were **not**
touched. The handoff doc calls this out as a standing question the owner asks, so to be explicit:
this harvest is Voyage embeddings plus grep, no graph traversal, no LLM-built concept graph.

**Queries run.** 32 themes, 112 individual query phrasings, sent as **two batched embedding
requests** (64 phrasings, then 48). Batching is the documented harvest recipe in the handoff and it
is what keeps the free tier happy: one HTTP request instead of 112.

Batch 1, the 16 briefed themes: award winning WebGL canvas, GLSL fragment techniques, scroll
choreography, typography and pairing, React design systems, awwwards studio portfolios, creative
coding and generative art, modern CSS grid layout, motion and micro-interaction, three.js and
react-three-fiber, e-commerce product pages, Core Web Vitals, accessibility, brutalist and editorial,
OKLCH color tooling, AI slop criticism.

Batch 2, 16 follow-up themes chosen from what batch 1 surfaced: Codrops style deconstructions, GSAP,
hero sections, cursor effects, page and view transitions, SVG animation, dark mode theming, bento and
card grids, kinetic type, loading and form states, data visualization, glassmorphism and liquid glass,
grain and dither and halftone, navigation patterns, design craft criticism, inspiration galleries.

**Local grep passes** (no API, unlimited): three scripts over the corpus. One keyword family filter
on GitHub rows, one broad named-library filter (297 repo hits), one filter on the repo slug itself
(246 hits, catches starred repos with empty descriptions). Plus a domain census over 68 known design
domains, and ten one-off regex probes for specific absences.

**Rate limits: none hit.** Both embedding calls returned 200 on the first attempt. No 429, no retry,
no backoff. Both scripts ran with `PYTHONIOENCODING=utf-8` as required; without it they die on
Windows cp1252 the moment a title contains an emoji.

**Filtering.** LinkedIn rows whose title is only an author name and whose body is only a headline
were dropped, as instructed. Several themes were dominated by these (theme 1 returned 18 LinkedIn
rows out of 30). Where a LinkedIn post carried a real technical recipe in the body it was kept and is
cited for the technique, not the author. Duplicate URLs across sources (the same page saved via
Neo4j export, Edge favorites, and Raindrop) were collapsed by canonical URL. GitHub URLs were
deduped to `owner/repo`.

**No URL in this document was invented.** Every link below appeared in the index. Where a tweet body
contained a truncated `t.co` link, the truncated link was discarded rather than guessed at.

---

## 2. High-value repositories

GitHub only, deduped, sorted by cluster. 71 repositories.

### Canvas, WebGL, shaders, 3D

| Repo | What it is | Why it matters here |
|---|---|---|
| https://github.com/basementstudio/shader-lab | Toolkit to create, stack, and animate shaders | Stacking is the missing idea: composing several small shaders instead of writing one god fragment |
| https://github.com/codrops/RainEffect | Experimental rain and water drop effects in WebGL, by Lucas Bebber | A canonical "material under pressure" effect with real source, not a demo video |
| https://github.com/mattrothenberg/fold-gradient | A custom Paper Shader you paste into a React app, described as soft flowing sheets of light | Proof of the sub three.js tier: shader quality without the bundle |
| https://github.com/cloudai-x/threejs-skills | Three.js skills packaged for coding agents | Direct competitor shape to gmira-canvas, worth reading for scope |
| https://github.com/raisaw/r3f-scene | React Three Fiber portal well scene, built after Bruno Simon's Three.js Journey | A complete small R3F scene to read end to end |
| https://github.com/valentinvichnal/gravity.js | Gravity WebGL experiment in the solar system | Physics-driven background, one of the few with a clear frame 0 |
| https://github.com/radiofun/BottomGradientShader | Bottom gradient shader | Small, specific, exactly the kind of bounded effect the doctrine prefers |
| https://github.com/aagentah/nw_wrld | Event-driven sequencer that triggers visual modules for live performance | Orchestration model for multiple visual modules under one clock |
| https://github.com/ChartGPU/ChartGPU | Open source WebGPU-based charting library | The only WebGPU data surface in the corpus, relevant to bklit's ceiling |
| https://github.com/SawyerHood/html-in-canvas-room | HTML rendered inside canvas | Same family as the `@canvas-ui` registry the arsenal already leans on |
| https://github.com/mindfiredigital/react-canvas-editor | Multipage document editing in React on HTML5 canvas | Canvas as an editing surface rather than a decoration |
| https://github.com/ollimueller/arc-watch-p5 | p5.js arc watch | Small generative sketch, useful as a shape reference |
| https://github.com/raisaw/raisketchworld | Vanilla JavaScript art portfolio | Generative portfolio with no framework tax |
| https://github.com/graphiteeditor/graphite | 2D content creation app with a node-based procedural graph, including real-time motion graphics | Node graph as an authoring model for procedural visuals |
| https://github.com/msurguy/dot-printer-studio | Pixel animation studio tool | Dot and pixel rendering, adjacent to the dither family |

### Scroll, motion, transitions

| Repo | What it is | Why it matters here |
|---|---|---|
| https://github.com/shuding/next-view-transitions | CSS View Transitions API in the Next.js App Router | The concrete implementation for the transition tier gmira-motion names but does not ship |
| https://github.com/jakubantalik/transitions.dev | Collection of essential web app transitions, ships a product motion skill | A vetted transition set, and a skill-shaped competitor |
| https://github.com/juliangarnier/anime | JavaScript animation engine | The lighter alternative to GSAP for timeline work |
| https://github.com/daneden/animate.css | Cross-browser CSS animation library | Baseline reference for what "generic entrance animation" looks like, useful as a denylist |
| https://github.com/code-env/ground-v2 | Web animations built for performance | Performance-first framing is rare in this corpus |
| https://github.com/ConnorAtherton/loaders.css | Performance-focused pure CSS loading animations | Loading as a design surface, no JS |
| https://github.com/Animate-UI/animate-ui | Animated component distribution on React, Tailwind, Motion, and the shadcn CLI | Ships backgrounds and animated icons as installable units |
| https://github.com/stephenscaff/react-animated-cursor | Animated custom cursor React component | The pointer-effect family the library has no primitive for |
| https://github.com/Avijit07x/animateicons | Free animated SVG icons for React, built for micro-interactions | Bounded micro-interaction set instead of ad hoc hover states |
| https://github.com/n3r4zzurr0/svg-spinners | 24 by 24 dp SVG spinners | Tiny, correct loading indicators |
| https://github.com/diffusionstudio/lottie | Generate production-ready Lottie animations with Claude Code or Codex | Agent-generated vector motion, a path the library does not consider |
| https://github.com/metafizzy/infinite-scroll | Automatically add the next page | The canonical implementation, including the failure modes gmira-catalog warns about |

### Design systems, components, primitives

| Repo | What it is | Why it matters here |
|---|---|---|
| https://github.com/nolly-studio/cult-ui | Components crafted for design engineers, Tailwind and shadcn compatible, MIT | Closest in spirit to the arsenal's registries |
| https://github.com/ant-design/ant-design | Enterprise-class UI design language and React library | The reference for a full design language, useful as a contrast to component grab bags |
| https://github.com/openui/open-ui | Open standard for UI, maintained for adherence and adoption | Standards-level vocabulary for component semantics |
| https://github.com/preetsuthar17/HextaUI | Extended components and blocks for shadcn/ui | Another registry to evaluate against the seven already in the arsenal |
| https://github.com/xxtomm/spell-ui | Component collection | Small registry, unaudited |
| https://github.com/EasyFrontendHQ/html-tailwindcss-components | Free Tailwind HTML components for landing pages and websites | Plain HTML, no React tax |
| https://github.com/hevar/awesome-react-tailwindcss-ui-components | Curated list of React and Tailwind component libraries | Index of the registry landscape |
| https://github.com/avijit07x/shadcn-directory | Catalog of premium components, templates, and UI kits | Directory layer above the registries |
| https://github.com/satnaing/shadcn-admin | Admin dashboard UI on shadcn and Vite | Dense data surface reference |
| https://github.com/llanesluis/themux | Theme customizer for shadcn/ui supporting Tailwind v4 | Token wiring for the exact stack gmira-palette targets |
| https://github.com/Blazity/shadcn-chatbot-kit | Chatbot components based on shadcn/ui | Conversational surface patterns |
| https://github.com/Ademking/cascader-shadcn | Cascading dropdown for hierarchical data | A real component gap in shadcn |
| https://github.com/omeralpi/shadcn-phone-input | Phone input for shadcn | Form field detail work |
| https://github.com/ebulku/next-stepper | Multi-step form on Next.js, shadcn, zustand, and Framer Motion | Configuration state for detail pages |
| https://github.com/Ahmed-Elkhdrawy/table-craft | Type-safe customizable React table engine | Spec tables, which gmira-detail treats as a first-class problem |
| https://github.com/x3388638/react-grid-carousel | Responsive carousel with grid layout | One of the non-card-grid set structures |
| https://github.com/reactjs/react-tabs | Accessible tab component for React | Keyboard-correct tabs |
| https://github.com/ueberdosis/tiptap-ui-components | React components and templates for rich text editor UIs | Editor chrome, a surface the library ignores |
| https://github.com/microsoft/vscode-webview-ui-toolkit | Component library for VS Code webview extensions | Constrained-environment component design |
| https://github.com/BayBreezy/ui-thing | Components built on Radix Vue | Non-React proof that the primitives port |
| https://github.com/macosui/macos_ui | Flutter widgets implementing the current macOS design language | Platform language fidelity as a target |
| https://github.com/ibelick/prompt-kit | Accessible customizable components for AI interfaces | AI surface patterns with accessibility claimed up front |
| https://github.com/Jpisnice/shadcn-ui-mcp-server | MCP server giving LLMs shadcn component structure and usage | How component knowledge reaches an agent, relevant to how gmira ships |
| https://github.com/rogden/tailwind-config-viewer | Local UI to visualize a Tailwind config | Makes a token set inspectable |
| https://github.com/kognise/water.css | Drop-in CSS that makes plain websites slightly nicer | The floor case: classless styling |
| https://github.com/necolas/normalize.css | HTML element and attribute style normalizations | The other reset lineage next to Comeau's |
| https://github.com/kristoferjoseph/flexboxgrid | Grid based on CSS3 flexbox | Historical, useful for showing what grid replaced |
| https://github.com/kristoff-it/superhtml | HTML language server and tooling | Correctness at the markup layer |

### Accessibility

| Repo | What it is | Why it matters here |
|---|---|---|
| https://github.com/incluud/accessible-astro-components | Accessible Astro components with built-in ARIA, keyboard navigation, and interactive elements | Static-site accessible primitives, ready to lift |
| https://github.com/fecarrico/A11Y.md | Accessibility notes in markdown | A checklist format an agent can consume |

### Color

| Repo | What it is | Why it matters here |
|---|---|---|
| https://github.com/primer/prism | Tool for creating and maintaining cohesive, consistent, accessible color palettes | Ramp generation with contrast as a constraint, not an afterthought |
| https://github.com/lokesh/color-thief | Extracts the dominant color or a palette from an image using canvas | Derive the accent from the hero image instead of picking it |
| https://github.com/dayflow-js/BlossomColorPicker | Color picker in pure CSS, works across React, Vue, Svelte, Angular | Picker UI without a framework dependency |

### Typography and icons

| Repo | What it is | Why it matters here |
|---|---|---|
| https://github.com/mona-sans | Mona Sans and Hubot Sans | Two variable faces with clear licensing |
| https://github.com/1998code/sf-pro-display-css | Sample CSS for using Apple SF Pro Display | The Apple-adjacent look without guessing at the stack |
| https://github.com/devicons/devicon | Icon set for programming languages and dev tools | Brand marks that would otherwise get faked |

### Anti-slop, design skills, design specs

| Repo | What it is | Why it matters here |
|---|---|---|
| https://github.com/nutlope/hallmark | Anti-AI-slop design skill for Claude Code, Cursor, and Codex | The best-known direct competitor, already installed locally as a skill |
| https://github.com/leonxlnx/taste-skill | Skill that stops the AI generating boring generic slop | Second competitor, widely shared on X and LinkedIn in this corpus |
| https://github.com/emilkowalski/skills | Skills for design engineers | Cited repeatedly as the craft-level reference |
| https://github.com/google-labs-code/design.md | Format specification for describing a visual identity to coding agents | A standard for the direction contract gmira writes by hand |
| https://github.com/VoltAgent/awesome-design-md | Collection of DESIGN.md files capturing design systems from popular websites | 500 plus extracted design systems, a corpus gmira could mine |
| https://github.com/nexu-io/open-design | Local-first alternative to Claude Design, 19 skills and 71 brand-grade design systems with sandboxed preview and HTML, PDF, PPTX export | The largest competing skill constellation found |
| https://github.com/alchaincyf/huashu-design | HTML-native design skill for Claude Code, 20 design philosophies, five-dimension review, MP4 export | Review rubric plus export pipeline, agent-agnostic |
| https://github.com/tonytamsf/claude-skill-airbnb-design | Airbnb Design Language System reference with design tokens and CSS themes | A single brand system encoded as a skill |
| https://github.com/julianoczkowski/designer-skills | Designer skills collection | Unaudited, in the same category |
| https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | Skill providing design intelligence for professional UI and UX across platforms | Unaudited competitor |
| https://github.com/superdesigndev/superdesign | Design tool positioned as a cursor for design | Tool rather than skill, different bet on the same problem |
| https://github.com/buildermethods/design-os | The design process between a product idea and the codebase | Process layer, which is where gmira's doctrine lives |
| https://github.com/JCodesMore/ai-website-cloner-template | Clone any website with one command using AI coding agents | The exact workflow that produces derivative heroes, worth naming as an anti-pattern |
| https://github.com/op7418/guizang-ppt-skill | Skill turning prompts into horizontal-swipe magazine HTML decks, 10 layouts, 5 themes, WebGL hero backgrounds, single-file output | Editorial and magazine layout as a generated artifact |
| https://github.com/bradtraversy/design-resources-for-developers | Curated list of design and UI resources, stock photos, templates, CSS frameworks, UI libraries | The broadest single index in the corpus |

### Commerce and catalog

| Repo | What it is | Why it matters here |
|---|---|---|
| https://github.com/Shopify/product-reviews-polaris-example | Shopify Polaris product reviews example with a workshop writeup | A real commerce content model, not a mock |
| https://github.com/AdditionApps/polaris-form-builder | Config-driven form builder for Shopify apps using Polaris | Variant and configuration forms driven by config |
| https://github.com/builderio/nextjs-shopify | Headless Shopify starter with drag and drop | Headless storefront reference |
| https://github.com/btahir/next-shopify-starter | Next.js, Tailwind, and Shopify starter | Second, smaller storefront reference |
| https://github.com/julionc/awesome-shopify | Curated list of Shopify resources and open source projects | Index for the commerce vertical |
| https://github.com/woocommerce/woocommerce | Open source ecommerce platform on WordPress | The other half of the market, PHP side |

### Performance and heroes

| Repo | What it is | Why it matters here |
|---|---|---|
| https://github.com/aidenybai/million | Optimizing compiler for React | The heaviest lever in the corpus for render cost |
| https://github.com/cristianolivera1/openhero | Open collection of cinematic video hero sections, preview, copy, download | Video heroes as a named family, with the decode and poster problem attached |
| https://github.com/cruip/open-react-template | Free React landing page template for open source and SaaS | Baseline for what a default landing page looks like |
| https://github.com/learning-zone/website-templates | 150 plus HTML5 website templates | Volume reference for median web design |
| https://github.com/iamdhakrey/terminal-portfolio | Terminal-style portfolio configured from one file | A committed non-generic direction that is fully implemented |

### Data visualization

| Repo | What it is | Why it matters here |
|---|---|---|
| https://github.com/vasturiano/react-force-graph | React component for 2D, 3D, VR, and AR force directed graphs | Graph rendering including a 3D mode |
| https://github.com/jacomyal/sigma.js | Library for visualizing graphs of thousands of nodes and edges | Scale ceiling for graph views |
| https://github.com/chartdb/chartdb | Database diagram editor, visualize and design from a single query | Diagram surface with real layout logic |

---

## 3. Reference sites and studios

Real sites returned by the index, with the technique each demonstrates.

**Shader and WebGL surfaces**

- https://shaders.paper.design/ Ultra-fast zero-dependency shaders. The whole tier between CSS gradients and three.js.
- https://eng.basement.studio/tools/shader-lab Live shader stacking tool from a working studio.
- https://threejsresources.com/showcase/inspiring-nk-studio Curated three.js showcase entry.
- https://www.threejswaterpro.com Water surface as a productized three.js component.
- https://www.webgpu.com/showcase/astrodither-webgpu-tsl-audio-reactive/ Audio-reactive WebGPU dither built in TSL. Dither plus audio plus WebGPU in one artifact.
- https://experiments.thisiswhitespace.com/action-wheel Radial action wheel in three.js, a real interaction rather than a background.
- https://tol.is/heart Projected halftone 3D point cloud that takes momentum from the pointer and keeps spinning on inertia.
- https://cullenwebber.github.io/three-volumetric-light/ Volumetric lighting with skeletal animation in three.js.
- https://lightswind.com/components/shader-background Shader background packaged as a React component.

**Inspiration and craft galleries**

- https://www.awwwards.com/websites/sites_of_the_day The award feed itself.
- https://www.inspo.page/ Inspiration curated at the component level, not the page level. This is the useful granularity for a skill library.
- https://www.navbar.gallery/ Navigation design only. Single-component gallery.
- https://detail.design Craft-level detail collection.
- https://www.doc.cc/category/craft Design and craft writing.
- https://muz.li Design inspiration feed.
- https://codemyui.com Web design and UI inspiration with copyable HTML and CSS snippets and GIF previews.
- https://pixelhours.com Curated visual bookmarks for designers and developers.
- https://craft.wild.as/ Site flagged in the corpus as one of the most creative seen in a long time.

**Studios and personal sites**

- https://www.helloheco.com Design studio doing branding and websites, positioned around turning information into experiences.
- https://www.4rknova.com/index.html Portfolio of the developer behind the foil sticker shader and the procedural terrain demo.
- https://chanhdai.com/components Personal-site craft components, already one of the arsenal's seven registries.
- https://superlist.com The header studied in the Hyperplexed recreation video.

**Component registries not yet in the arsenal**

- https://www.reactbits.dev/ Animated React components. Two specific pieces surfaced: shape blur and squares backgrounds.
- https://magicui.design/ Component set that also ships an MCP server.
- https://ui.aceternity.com/ Animated component library.
- https://kokonutui.com/ Open source components, AI prompt input among them.
- https://www.paceui.com/docs/components/liquid-glass Liquid glass and profile peek components.
- https://skiper-ui.com/docs/components/theme-toggle-animations Theme toggle animations and card swipe.
- https://www.hextaui.com/components Extended shadcn blocks.
- https://www.ui-layouts.com/components/marquee Marquee and responsive header layouts.
- https://www.shsfui.com/primitives/cards Card primitives.
- https://21st.dev/s/spinner-loader Spinner and loader components with a craft focus.
- https://motion-primitives.com/docs/progressive-blur Progressive blur, the correct edge treatment for sticky rails.
- https://examples.motion.dev/ Official Motion and Framer Motion examples.
- https://www.hover.dev/components Prebuilt animations and interactions.
- https://variantvault.chrisabdo.dev/ Framer Motion variant collection.
- https://animata.design/ Open source animated React components, including skeletons.
- https://reverseui.com/ Animated components.
- https://www.dynaui.design/ Animated components on React, Tailwind, and Framer Motion.
- https://retroui.dev/blocks/bento-grids Neobrutalist React components including bento grids and charts.
- https://tailark.com/hero-section Shadcn hero section blocks.
- https://www.shadcnblocks.com Shadcn blocks and components.
- https://pageui.shipixen.com/ Landing page components to copy and paste.
- https://buttonyui.com/buttons/glitch-brightness Button effects, glitch and brightness family.
- https://loading-ui.com/ Spinners, loaders, and loading animations.
- https://basecoatui.com/kitchen-sink Kitchen sink of a component set.
- https://www.buckets-ui.com/elements/code-examples/navigation-bars Navigation bar elements.
- https://uiverse.io/elements 4,531 CSS and Tailwind UI elements.
- https://cmdk.paco.me/ Fast composable unstyled command menu for React.
- https://www.soundcn.xyz/ Free sound effects for modern web apps. Already one of the arsenal's seven but the site itself is the source.

**Color tooling**

- https://oklch.fyi and https://oklch.fyi/create and https://oklch.fyi/skill OKLCH picker, generator, converter. It ships its own skill file.
- https://oklch.com/ The other OKLCH picker and converter.
- https://www.volumecolor.io/editor 3D OKLCH palette creator.
- https://colorpalette.pro/ Palette generator with OKLAB output and effect controls.
- https://www.realtimecolors.com/ Live palette preview on a real page layout with type.
- https://meodai.github.io/poline/ Esoteric palette generation library, produces hue paths you would not pick by hand.
- https://www.colorsandfonts.com/ Color and typography together for web developers.
- https://gra.dient.art Advanced CSS gradient editor with layers.
- https://gradient.page/picker Gradient picker as a shadcn component.
- https://joshwcomeau.com/shadow-palette Shadow palette generator, gives a color-matched shadow ramp.

**Typography tooling**

- https://www.typewolf.com Fonts in the wild, with pairings and recommendations.
- https://www.fontshare.com/pairs Free quality fonts from Indian Type Foundry, with a pairs view.
- https://www.fonttrio.xyz Font pairings scoped to shadcn.
- https://fontjoy.com One-click pairing generation.
- https://modern-fluid-typography.vercel.app/ Fluid typography editor producing clamp() code.
- https://fonty.io/ Identifies the fonts used on any website.
- https://codingfont.com/ Coding font tournament.
- https://vercel.com/font Geist. Geist Pixel also landed on Google Fonts per the corpus.
- https://font.subf.dev/en Maple Mono, open source monospace.
- https://www.jetbrains.com/lp/mono JetBrains Mono.
- https://bestfreefonts.com/ Free font index.

**SVG, icons, texture**

- https://svgl.app Library of SVG logos.
- https://animateicons.in and https://animateicons.vercel.app Animated React icon library.
- https://lucide-animated.com/ Animated Lucide icons.
- https://www.fffuel.co/ffflux/ SVG fluid gradient background generator.
- https://neat.firecms.co 3D gradients for websites.
- https://www.toptal.com/designers/subtlepatterns/page/2 Subtle texture patterns.
- https://loading.io/icon Icon animation at volume.

**Glass, blur, morphism**

- https://ui.glass/generator/ Glassmorphism CSS and HTML generator.
- https://aethercss.lovable.app/ Liquid glass, glassmorphism, and neumorphism generator.
- https://tools4css.vercel.app/tools/glassmorphism Glassmorphism tool.

**Motion tooling**

- https://motion.dev/ Motion One, built on the Web Animations API for a tiny bundle.
- https://easingwizard.com/ CSS easing editor.
- https://animista.net/play/basic/shadow-drop On-demand CSS animation library.
- https://usal.dev/ Scroll animation library.
- https://www.theatrejs.com/docs/0.5/getting-started/with-three-js Theatre.js sequencing for three.js.
- https://transitions.dev Essential transitions for web apps.
- https://chrome.dev/view-transitions-toolkit View Transitions toolkit demos.
- https://next-view-transitions.vercel.app/demo Next.js view transitions demo.
- https://splidejs.com/premium/ Slider with a premium tier.

**Accessibility**

- https://react-spectrum.adobe.com/react-aria/index.html React Aria, accessible components with custom styles.
- https://ariakit.org Toolkit for accessible UIs.
- https://accessible-astro-starter.incluud.dev/accessible-components Accessible components in a live starter.
- https://a11yphant.com/ Interactive accessibility learning by coding challenge.
- https://audio-ui.xyz/docs/components Accessible composable audio interface components for React.
- https://webdev-checklist.vercel.app Web developer checklist.
- https://tylercoderre.com/projects/design-systems-checklist.html Design systems checklist.
- https://rams.ai/ Design engineer for Claude Code, Cursor, and OpenCode. Audits for WCAG violations, semantic HTML, ARIA, plus spacing, typography, and color inconsistencies. A direct competitor to gmira-a11y plus gmira-verify.

**Performance**

- https://millionjs.org/ Million.
- https://bundlephobia.com Cost of adding an npm package.
- https://qoiformat.org/ The Quite OK Image format.

**Commerce**

- https://polaris.shopify.com/components Shopify Polaris components.
- https://ecommerce-ui.com Ecommerce templates and UI kit in Figma and code.
- https://storecraft.app/ Commerce as code.

**Anti-slop and design spec tooling**

- https://neuform.ai AI HTML design templates and landing page builder with remix templates.
- https://vibeui.online 92 free UI prompts for vibe coders, covering auth, pricing, hero, bento.
- https://tweakcn.com/editor/theme Theme generator for shadcn/ui.
- https://radixcn.com/ Radix colors applied to shadcn themes.
- https://thegridcn.com Tron-inspired shadcn theme.
- https://skills.sh/emilkowalski/skill/emil-design-eng Emil Kowalski's design engineering skill, hosted.
- https://www.pencil.dev/downloads Design on canvas, land in code.

**Layout learning**

- https://grid.malven.co/ Visual cheatsheet for CSS Grid.
- https://gridbyexample.com/examples Usage examples of CSS Grid Layout.

---

## 4. Articles and tutorials

**Codrops (tympanus.net), all seven entries in the index**

| Article | Technique covered |
|---|---|
| https://tympanus.net/codrops/2026/04/24/susurrus-crafting-a-cozy-watercolor-world-with-three-js-and-shaders | Watercolor rendering in three.js: a full art direction expressed as a shader, not a filter |
| https://tympanus.net/codrops/2026/01/09/the-spark-engineering-an-immersive-story-first-web-experience/ | Story-first immersive experience, the engineering behind a narrative scroll |
| https://tympanus.net/codrops/2025/12/23/building-a-nostalgic-8-bit-universe-with-modern-tech-a-vibe-coding-journey/ | 8-bit aesthetic built with modern tooling, and the vibe-coding process critique |
| https://tympanus.net/codrops/2025/09/15/the-journey-behind-inspo-page-a-better-way-to-collect-web-design-inspiration/ | Building a component-level inspiration tool, including the taxonomy problem |
| https://tympanus.net/Development/RainEffect/index.html | Rain and water on glass in WebGL, live demo |
| https://tympanus.net/codrops/webzibition | Curated exhibition of web experiences |
| https://tympanus.net/codrops/collective/collective-760/ | The weekly collective, a feed worth subscribing to for this library |

**Josh W. Comeau**

| Article | Technique covered |
|---|---|
| https://www.joshwcomeau.com/animation/scroll-driven-animations/ | Native CSS scroll-driven animations with scroll timelines, the tier below GSAP |
| https://www.joshwcomeau.com/css/color-formats/ | Why hex and HSL fail and what lab and OKLCH fix |
| https://www.joshwcomeau.com/animation/color-shifting/ | Color interpolation during animation, and why naive transitions go gray |
| https://joshwcomeau.com/css/custom-css-reset | A modern reset with reasoning per line |
| https://joshwcomeau.com/shadow-palette | Layered shadow ramps derived from the surface color |
| An Interactive Guide to SVG Paths, saved via https://app.daily.dev/posts/ahyauzvjl | Path syntax made legible, the prerequisite for path morphing |

**CSS-Tricks**

| Article | Technique covered |
|---|---|
| https://css-tricks.com/books/greatest-css-tricks/scroll-animation/ | Scroll animation achievable in pure CSS with no JavaScript |
| https://css-tricks.com/snippets/css/complete-guide-grid | The grid reference |
| https://css-tricks.com/the-holy-grail-layout-with-css-grid | Header, footer, sidebar, main in grid |
| https://css-tricks.com/snippets/css/css-grid-starter-layouts | Starter layouts as a pattern set |
| https://css-tricks.com/css-grid-and-custom-shapes-part-1/ | Grid auto-placement pushed into non-rectangular shapes |
| https://css-tricks.com/css-hover-effects-background-masks-3d/ | Hover effects via background clipping, masks, and 3D transforms |
| https://css-tricks.com/cool-hover-effects-that-use-css-text-shadow/ | Text shadow used for hover effects rather than shadows |
| https://css-tricks.com/custom-properties-as-state | Custom properties carrying state, including seasonal color sets |
| https://css-tricks.com/interpolating-numeric-css-variables/ | Interpolating numeric custom properties |
| https://css-tricks.com/css-container-queries/ | Container queries |
| https://css-tricks.com/fun-with-blurred-text | Per-letter blur with feature detection |
| https://css-tricks.com/almanac/properties/t/transition | The transition shorthand reference |

**Effects, transitions, and craft**

| Article | Technique covered |
|---|---|
| https://app.daily.dev/posts/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger-9gvmg0nez | Four scroll-driven fullscreen image transitions using GSAP, ScrollTrigger, and SVG masks |
| https://chriscoyier.net/2023/04/11/expanding-grid-cards-with-view-transitions/ | A card expanding to full width while the rest of the grid reflows, via View Transitions |
| https://developer.mozilla.org/en-us/docs/web/api/document/startviewtransition | The API reference for startViewTransition |
| https://blog.olivierlarose.com/tutorials/cards-parallax | Smooth scroll card parallax with Lenis, Framer Motion, and Next.js, explicitly modeled on awwwards winners |
| https://cruip.com/create-an-infinite-horizontal-scroll-animation-with-tailwind-css/ | Infinite horizontal marquee in CSS only |
| https://blog.openreplay.com/advanced-animations-with-css-linear/ | CSS linear() for arbitrary easing curves, including spring approximations |
| https://tobiasahlin.com/blog/how-to-animate-box-shadow/ | Animating box-shadow without repaint cost, via a pseudo-element opacity swap |
| https://www.bram.us/2025/11/13/animating-css-width-or-height-no-longer-force-a-main-thread-animation-in-chrome-under-the-right-conditions/ | Chrome now composites width and height animations under certain conditions, which retires an old blanket rule |
| https://blog.logrocket.com/complete-guide-using-css-filters-svgs/ | SVG filters as a CSS tool |
| https://blog.openreplay.com/using-the-css-filter-property/ | The filter property in practice |
| https://blog.logrocket.com/creating-3d-effects-in-css/ | 3D transforms without WebGL |
| https://blog.logrocket.com/implementing-claymorphism-css/ | Claymorphism as a named surface style |
| https://garden.bradwoods.io/notes/css/blend-modes | background-blend-mode and mix-blend-mode with interactive examples |
| https://garden.bradwoods.io/notes/css/3d | CSS 3D notes |
| https://fjolt.com/article/css-glass-morphism-generator | How glass morphism actually works, with a generator |
| https://www.youtube.com/watch?v=zGKNMm4L-r4 | Hyperplexed recreating the Superlist header, with a CodePen |
| https://www.youtube.com/watch?v=joDhIH6Xumw | Hyperplexed recreating the Twitch brand page hover effect |

**Typography and color**

| Article | Technique covered |
|---|---|
| https://electricmagicfactory.com/articles/interactive-fluid-typography/ | Fluid typography treated as an interactive system rather than a clamp snippet |
| https://spin.atomicobject.com/oklch-in-css-color/ | oklch() in CSS, the modern approach |
| https://yuricodesbot.hashnode.dev/the-603010-color-rule-for-web-design | The 60/30/10 rule and the two ways of applying it, plus how to break it |

**Theming and dark mode**

| Article | Technique covered |
|---|---|
| https://web.dev/building-a-theme-switch-component/ | Building an adaptive accessible theme switch |
| https://web.dev/shows/gui-challenges/kZiS1QStIWc/ | Adam Argyle on theme switch construction |
| https://app.daily.dev/posts/tanstack-start-light-dark-and-system-theme-without-flickers-1xrpsavjm | Light, dark, and system theme with no flash of wrong theme |
| https://railsdesigner.com/building-customizable-tailwind-themes/ | User-customizable themes in Tailwind |
| https://uxplanet.org/dark-theme-5-ui-design-tips-d70d86441757 | Dark theme design tips |

**Performance**

| Article | Technique covered |
|---|---|
| https://fireup.pro/news/core-web-vitals-in-2026-what-actually-impacts-google-rankings | What in Core Web Vitals actually moves rankings now |
| https://app.daily.dev/posts/ujcotii5g | The Web Animation Performance Tier List, animation techniques ranked by cost |
| https://app.daily.dev/posts/jjjdpqkta | The Ultimate Front-End Performance Playbook 2025 |
| https://dev.to/mnathani/two-lines-of-css-that-boosts-7x-rendering-performance-4mjd | content-visibility as a rendering win |
| https://app.daily.dev/posts/hcwa8muxp | unlighthouse, Lighthouse run across an entire site |
| https://app.daily.dev/posts/v9mcymide | Obs.js, context-aware web performance |
| https://www.youtube.com/watch?v=ZKH3DLT4BKw | The Cost of JavaScript 2023 |
| https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization | Image optimization fundamentals |
| https://internetingishard.com/html-and-css/responsive-images | Responsive images and srcset |

**Accessibility**

| Article | Technique covered |
|---|---|
| https://frontendmasters.com/blog/ai-generated-ui-is-inaccessible-by-default/ | Why LLM-produced UI fails accessibility by default |
| https://www.sitepoint.com/ai-is-not-your-accessibility-expert-what-llms-still-miss-about-wcag | What LLMs still miss about WCAG |

**Criticism and design engineering**

| Article | Technique covered |
|---|---|
| https://yannglt.com/writing/the-rosetta-stone-of-design-engineering | What design engineering is and what it translates between |
| https://henry.codes/writing/a-website-to-destroy-all-websites/ | Anti-design polemic and an actual build |
| https://www.smashingmagazine.com/2022/02/web-design-done-well-perfectly-pointless/ | The case for weird, purposeless websites |
| https://freebiesupply.com/blog/cool-design-tip-nested-rounded-corners | Nested rounded corners, inner radius derived from outer radius and padding |

**Technique posts on X and LinkedIn with real recipes**

These are kept because the body carries the method, not because of who posted them.

| Post | Technique |
|---|---|
| https://www.linkedin.com/feed/update/urn:li:activity:7472397936182816769 | Fragment-shader image transition: compute the nearest card to center by Euclidean distance, pass it to the shader, drive with GSAP. WebGL and WebGPU |
| https://www.linkedin.com/feed/update/urn:li:activity:7367738380559753216 | Foil sticker shader in three.js: procedural metallic flakes, thin-film iridescence, a peelable corner, environment-mapped reflections, Fresnel |
| https://www.linkedin.com/feed/update/urn:li:activity:7466186511277936640 | Procedural terrain: fBM raymarching, Rayleigh sky, clouds with shadows and god rays, valley mist, water reflections, WebGL2 |
| https://www.linkedin.com/feed/update/urn:li:activity:7468453681068408832 | Particle explosion using GPUComputationRenderer, custom depth shaders, and post processing |
| https://www.linkedin.com/feed/update/urn:li:activity:7469433808975470592 | Physics entirely in a WebGPU compute pass written in TSL, thousands of bodies drawn as one instanced mesh |
| https://www.linkedin.com/feed/update/urn:li:activity:7481298421019148288 | Curl noise in WebGPU and TSL |
| https://www.linkedin.com/feed/update/urn:li:activity:7475095357471834112 | TSL Graph, a visual node editor for the Three.js Shading Language that exports reusable TSL |
| https://www.linkedin.com/feed/update/urn:li:activity:7475457865617506306 | Powershot: a real camera ISP and analog NTSC chain as TSL shader stages, sensor noise, chromatic aberration, JPEG artifacts, tape dropouts, scanlines |
| https://www.linkedin.com/feed/update/urn:li:activity:7477559167851966465 | gpucat, a minimal node-based TypeScript WebGPU renderer with node materials, compute, and typed buffer packing |
| https://www.linkedin.com/feed/update/urn:li:activity:7479906651962109954 | A Gaussian splat scene rendered inside a solid refractive glass shape with screen-space refraction and chromatic aberration, in PlayCanvas |
| https://www.linkedin.com/feed/update/urn:li:activity:7477009202289364992 | Using the three.js WebGPU inspector and control panel inside React Three Fiber |
| https://www.linkedin.com/feed/update/urn:li:activity:7459595509981286401 | Pinning a chat scroller to the bottom with CSS overflow-anchor, no MutationObserver and no scrollTo |
| https://www.linkedin.com/feed/update/urn:li:activity:7481735996305367040 | Converting font outlines directly into indexed triangle meshes so text behaves as 3D geometry |
| https://www.linkedin.com/feed/update/urn:li:activity:7475112639606632448 | An SVG extrusion tool, flat SVG to extruded 3D |
| https://x.com/thetirthparmar/status/2070221314041036928 | Open source liquid glass for the web with real WebGL refraction, chromatic aberration, and liquid motion, explicitly not a backdrop-filter hack. MIT |
| https://x.com/grimcodes/status/2075780400199446966 | dither-kit, dithered charts with no dependencies on a tiny canvas engine |
| https://x.com/harshjdhv/status/2074857944886415848 | Dithered logo: canvas particle logo with error diffusion dithering, cursor repulsion, and click ripples, from any SVG or image |
| https://x.com/guerriero_se/status/2069791907392200784 | The simplest way to add a subtle noise texture to a web project |
| https://x.com/iamncdai/status/2070794139088904568 | The shadcn scroll-fade utility |
| https://x.com/yanliudreamer/status/2069205809066815594 | GSAP shipped an AI motion skill pack: 25 plus real project animations covering Timeline, ScrollTrigger, and easing, across React, Vue, Svelte, and vanilla, targeted at Cursor, Claude Code, and Codex |
| https://x.com/scottstts/status/2071234915178336569 | threejs-awesome-graphics-agent-skills, installed with npx, examples lifted from open source graphics projects |
| https://x.com/MaximeHeckel/status/2072682432826905057 | Upcoming article on motion shaders, with poster renditions of the effects to be deconstructed |
| https://x.com/sabosugi/status/2074089072793145556 | Liquid particles in a sphere, three.js and shaders, CodePen source |
| https://x.com/chirovisuals/status/2074135400138830228 | Procedural building generator in three.js with GPU instancing and real-time snow, rain, and wet surfaces, reverse engineered from a Blender geometry nodes graph into TypeScript |
| https://x.com/SkyeSharkie/status/2073455891194806689 | SEEDTHREE, an open source three.js WebGPU procedural plant generator |
| https://x.com/aaayandev/status/2077078710499287410 | Slop.md, an 80,000 character markdown file that removes common AI slop design language |
| https://x.com/chhddavid/status/2077363947062136840 | chiefkeef.md, a 724,300 character file that bans box shadows, emoji, status badges, purple to blue gradients, and 220 words |

---

## 5. Techniques worth adding to the library

My synthesis. Each item names the concrete addition and the skill it belongs to.

### gmira-canvas

1. **A WebGPU and TSL path.** The GPU floor is WebGL-only today. The corpus is full of the other
   branch: compute-pass simulation drawn as a single instanced mesh, node-based shader authoring via
   TSL Graph, gpucat as a minimal node renderer, Sedon as a node-based generator. Add an adapter
   request with a WebGL fallback, a rule that a compute pass counts double against the effect budget,
   and the note that TSL exports reusable code so a node graph is not a dead end.
2. **A dither and error-diffusion primitive.** Currently the skill says dithering "reads as print and
   limited palette" and ships no code. Add a Floyd Steinberg style error diffusion pass over a small
   offscreen canvas, a pointer repulsion field, and a click ripple. Evidence: dither-kit, the dithered
   logo component, the halftone point cloud with pointer momentum, the WebGPU audio-reactive dither.
   This is a whole visual family with three independent implementations in the corpus.
3. **A camera emulation post chain as a named grade.** Powershot models a real camera ISP plus an
   analog NTSC chain as ordered TSL stages: sensor noise, chromatic aberration, JPEG artifacts, tape
   dropouts, scanlines. Adding this as a stage list turns "add some grain" into a specified grade with
   an order and per-stage intensity.
4. **A thin-film iridescence and foil material.** Procedural metallic flakes, thin-film iridescence,
   Fresnel, environment-mapped reflection, plus a peel mask. One documented shader, with source.
   Covers the "premium material" request without a generic chrome ball.
5. **True refraction versus backdrop-filter, stated as a tier.** The corpus has open source WebGL
   refraction with chromatic aberration explicitly positioned against the backdrop-filter hack. The
   skill should state both tiers and the cost of each, because right now "glass" has no entry.
6. **Paper Shaders as the tier between CSS and three.js.** Zero-dependency shader components you paste
   into React. fold-gradient is a working example. This directly serves the hero rule that says do not
   install three.js for one background.

### gmira-hero

7. **A frame-0 catalogue of non-three.js hero backgrounds.** Paper Shaders, SVG fluid gradients from
   ffflux, NEAT 3D gradients, the Animate UI hole background. Each has a static first frame, which is
   the whole point of Law 3.
8. **Video heroes as a named family with its own constraints.** openhero ships a collection of cinematic
   video hero sections. Add the rules that come with it: a poster frame at frame 0, a decode budget,
   a still fallback under reduced motion, and no autoplay audio.
9. **The site-cloning workflow as a named anti-pattern.** ai-website-cloner-template and the "one
   reference link to a full recreation" posts describe a real practice. The hero skill should say that
   a recreated hero inherits the source's effect budget and its direction, and that this is the fastest
   route to a page that reads as derivative.

### gmira-scroll

10. **Native CSS scroll-driven animations as the default tier.** Scroll timelines cover reveals and
    progress indicators with no JavaScript, and the corpus has both the reference article and a
    library. The skill should try this tier first and only reach for ScrollTrigger when the moment
    needs scrub control.
11. **SVG mask scroll transitions as one of the authored moments.** Four fullscreen image transitions
    driven by GSAP, ScrollTrigger, and SVG masks. This is a concrete alternative to fade-up that
    satisfies the one-authored-moment rule.
12. **overflow-anchor for bottom-pinned scrollers.** Pins a chat or log scroller to the bottom with one
    CSS property, no MutationObserver and no scrollTo. Removes an entire class of scroll handler.
13. **The CSS-only infinite marquee, with the reduced-motion stop.** A named horizontal-scroll device
    that costs nothing.

### gmira-motion

14. **View Transitions promoted from a mention to a recipe.** The skill's description names view
    transitions but ships nothing. Add: startViewTransition, the Chrome toolkit demos, the App Router
    package, and Chris Coyier's expanding grid card, which is the most useful pattern of the four
    because it is a layout change rather than a crossfade.
15. **Authoring tools for the easing table.** Easing Wizard and CSS linear() let you author curves the
    standard cubic-bezier set cannot express, including spring approximations, and export them.
16. **Animated icons as a bounded micro-interaction family.** Two libraries in the corpus. This gives
    hover feedback a source instead of ad hoc per-component invention.
17. **The box-shadow animation technique.** Animate the opacity of a pseudo-element carrying the second
    shadow, rather than the shadow itself. Standard fix, currently absent.
18. **Read transitions.dev and emilkowalski/skills as prior art.** Both ship a "product motion" skill.
    Knowing what they claim is how gmira-motion stays distinct.

### gmira-typeset

19. **A sourcing chain for pairings.** Typewolf for fonts in the wild, Fontshare pairs, fonttrio for
    shadcn-scoped pairings, fontjoy for generation. The skill has six named pairings derived from
    material worlds and no way to find a seventh.
20. **fonty.io in the direction contract step.** Identify the exact faces on a reference site instead of
    approximating them. That is the difference between a derived direction and a vague one.
21. **A fluid type editor for the scale.** The clamp() editor plus the interactive fluid typography
    article, wired so the 1.25 scale can be fluid without breaking the minus 0.04em tracking floor.
22. **Named free faces with clear licensing.** Geist and Geist Pixel, Maple Mono, JetBrains Mono, Mona
    Sans and Hubot Sans, SF Pro via CSS. Reduces the reflex-face problem by giving actual alternatives.
23. **Text as GPU geometry.** Converting font outlines into indexed triangle meshes so type behaves like
    any other 3D object. This is the honest implementation of a 3D headline, and it belongs next to the
    existing rule that canvas text is invisible to search, because this technique has the same problem.

### gmira-palette

24. **The full OKLCH tool chain, not just the color space.** oklch.fyi with its own skill file,
    oklch.com, Volume for 3D ramp construction, colorpalette.pro with OKLAB output. The skill mandates
    OKLCH ramps and names no tool for building them.
25. **Contrast-constrained ramp generation.** InclusiveColors generates WCAG-passing Tailwind ramps, and
    primer/prism maintains cohesive accessible palettes. This turns "contrast read from computed styles"
    from an audit step into a generation constraint.
26. **A shadow palette rule.** Comeau's generator produces a layered shadow ramp tinted by the surface
    hue. Black at low alpha over a colored field is one of the tells the doctrine should name.
27. **Palette extraction from the hero image.** color-thief derives the accent from the actual
    photograph. Directly supports "derivation from a named material world" when the material is a photo.
28. **poline for non-obvious hue paths.** Generates palettes along paths a designer would not pick by
    hand, which is a concrete anti-default mechanic.

### gmira-catalog

29. **Expanding grid cards via View Transitions.** A card expands to full width and the rest of the set
    reflows below. That is a set structure, not a card grid, and it has a working recipe.
30. **Polaris as a real commerce content model.** The product reviews example plus the Polaris component
    set give a field model built by a company that sells things, which is exactly what the skill says
    most bad listing pages lack.
31. **Carousel with grid layout, and the correct infinite scroll.** react-grid-carousel and
    metafizzy/infinite-scroll are the two implementations behind two of the seven set structures.

### gmira-detail

32. **A spec table engine.** table-craft handles alignment, typing, and customization. The skill treats
    readable spec tables as central and names no implementation.
33. **Multi-step configuration state.** next-stepper for the stepper, Polaris form builder for
    config-driven variant forms. Both are the variant-state problem the skill describes.
34. **The nested rounded corner rule.** Inner radius equals outer radius minus padding. A one-line craft
    rule that is missing from the doctrine's depth and shape section and that is visible on every card
    inside a card.
35. **Progressive blur on sticky rail edges.** Instead of a hard cut or a full fade, a gradient blur
    mask. One component, immediately usable.

### gmira-perf

36. **Named measurement tools.** unlighthouse for whole-site Lighthouse, BundlePhobia for per-package
    cost, Obs.js for context-aware measurement, Million as a compiler-level lever. The skill insists on
    measured numbers and lists only Lighthouse and Playwright.
37. **The animation cost tier list.** A ranking of animation techniques by cost, which is a better tool
    than the general "transform and opacity only" rule.
38. **Update the width and height rule.** Chrome now composites width and height animations under
    stated conditions. The blanket prohibition is out of date and the skill should cite the conditions.
39. **content-visibility as a first-line rendering win.** Two lines of CSS, large effect on long pages
    with many offscreen sections, which is exactly the shape of the pages this library builds.
40. **The heap snapshot workflow.** Take a DevTools memory snapshot, hand it to an agent, get back an
    analysis of what makes the page sluggish. Fits the library's "measure, do not guess" stance and
    covers the GPU teardown case the skill already worries about.

### gmira-a11y

41. **React Aria and Ariakit as the two rebuild targets.** When a registry component cannot be patched
    into accessibility, these are what you rebuild on. The skill diagnoses and does not prescribe.
42. **accessible-astro-components for the static case.** ARIA, keyboard navigation, and interactive
    elements already wired, for the Astro path.
43. **Two citations for why this skill exists.** "AI-Generated UI Is Inaccessible by Default" and "AI Is
    Not Your Accessibility Expert" are both specifically about LLM-produced interfaces. They are the
    evidence for the skill's own premise and belong in it.
44. **InclusiveColors as the repair tool.** When contrast fails, regenerate the ramp rather than nudging
    individual hexes.
45. **Know rams.ai.** It audits WCAG, semantic HTML, ARIA, spacing, typography, and color from inside
    Claude Code and Cursor. Overlaps gmira-a11y and gmira-verify. Worth reading before claiming
    novelty.

---

## 6. Gaps

### What the library covers that these saves do not

These are absences in the corpus, verified by grep, not impressions.

- **Reduced motion. Zero hits** for `prefers-reduced-motion` across 17,647 rows. Not one save in this
  entire collection discusses motion accessibility. Every one of the ten skills touches it. This is the
  single largest asymmetry found.
- **The effect budget.** No source in the corpus argues for fewer effects. The entire collection is
  additive: more components, more backgrounds, more animation libraries. The one-authored-moment rule
  and the one-heavy-effect-per-route rule have no counterpart anywhere in these 17,647 saves.
- **Frame 0.** Nothing discusses what an effect looks like before input. Several saved demos are
  explicitly pointer-driven, meaning they are blank until the visitor moves the mouse, which is the
  exact failure Law 3 exists to prevent.
- **GPU teardown, WebGL context caps, canvas memory on route change.** Nothing. The corpus assumes one
  canvas on one page forever.
- **Canvas text indexability.** Nothing. Several saved gallery and catalog demos render product content
  to canvas with no discussion of crawlability.
- **Registry repair.** Nothing acknowledges that installed registry components arrive broken. The corpus
  treats every registry as working software.
- **Mode, direction contract, material-world derivation.** No equivalent concept. design.md and
  awesome-design-md come closest but they capture an existing visual identity rather than deriving one.
- **Numeric craft floors.** No source gives measure limits, tracking floors, contrast minimums, or
  surface coverage percentages. The corpus has tooling that could measure these and no one arguing
  for a specific number.
- **Per-vertical playbooks.** Nothing structured by vertical. The corpus is structured by technology.
- **Verification gates.** Nothing. Lighthouse tooling exists in the corpus; a gate that blocks shipping
  does not.
- Also absent entirely: **Open Props** (zero hits) and **Locomotive Scroll** (zero hits), and Lenis
  appears only four times and always inside someone else's tutorial. The owner's saved world is Tailwind
  and GSAP and Framer Motion, not the design-token or smooth-scroll-library world.

### What these saves cover that the library is missing

- **WebGPU and TSL, as an entire second branch.** Node-based shader authoring, compute passes drawn as
  instanced meshes, visual node editors that export code, WebGPU inspectors inside React Three Fiber.
  The library's GPU floor is WebGL only. This is the biggest technical gap and it is well documented in
  the corpus by at least six independent practitioners.
- **Dither, halftone, and ASCII as a first-class visual family.** Three separate implementations,
  charts, logos, and point clouds, plus an audio-reactive WebGPU version. The library mentions dithering
  once as a semantic association and ships nothing.
- **Camera and film emulation as an ordered post chain.** Named stages with real physical referents.
- **The Paper Shaders tier.** A whole quality level between a CSS gradient and a three.js scene that the
  library's cheap stack does not name.
- **View Transitions.** API, toolkit, framework binding, and a layout-change recipe, all present in the
  corpus, all absent from the skills.
- **Native CSS scroll-driven animations.** Present in the corpus, absent as a tier in gmira-scroll.
- **Gaussian splats.** A splat scene sealed inside refractive glass with screen-space refraction. New
  material class, no mention anywhere in the library.
- **UI sound.** soundcn is one of the arsenal's seven registries but no skill owns sound. The corpus has
  the registry plus a synthesised tactile UI sound set, so there is source material for a real position.
- **Agent-generated Lottie.** Vector motion produced by Claude Code or Codex. A path the library does not
  consider at all.
- **Editorial and magazine layout as generated output.** guizang-ppt-skill produces horizontal-swipe
  magazine decks with WebGL hero backgrounds as single-file HTML. The brutalist and editorial theme
  otherwise returned almost nothing usable, which is itself a finding: the owner's saves are weak on
  editorial art direction.
- **The competing anti-slop corpus.** hallmark, taste-skill, emilkowalski/skills, design.md, awesome-design-md,
  open-design with 19 skills and 71 design systems, huashu-design with a five-dimension review and MP4
  export, Slop.md at 80,000 characters, chiefkeef.md at 724,300 characters, plus rams.ai as a hosted
  auditor. Gmira should read at least hallmark, open-design, and design.md before its next revision,
  both to avoid reinventing and to sharpen what it claims that they do not.
- **Typography sourcing and identification tooling.** Typewolf, fonty.io, fontjoy, fonttrio, the fluid
  type editor. The typeset skill has strong opinions and no discovery path.
- **The OKLCH tool chain.** Four separate tools plus a published OKLCH skill file, none referenced.
- **Charting beyond visx.** ChartGPU on WebGPU, Evil Charts, dither-kit, shadcn charts, Retro UI charts,
  sigma.js and react-force-graph for graph surfaces. The arsenal names bklit and visx only.

### Honest caveats on this harvest

- Themes 1, 2, 9, and 16 were heavily polluted by LinkedIn author-name rows. The technique posts kept
  above are the survivors after filtering; the raw pools had roughly half LinkedIn noise.
- The brutalist and editorial theme (14) returned the weakest results of all 32. Most hits were student
  HTML and CSS coursework repos. The owner has essentially no saved editorial or Swiss-layout material.
- The accessibility theme (13) returned 30 rows but only about eight were genuinely about accessibility;
  the rest were animation libraries whose descriptions happened to contain the word "accessible".
- The GitHub corpus skews hard toward AI and agent tooling. Of 2,499 GitHub rows, the design-relevant
  subset is roughly 250, and after removing coursework repos and abandoned personal sites, roughly 90.
- Scores are cosine similarity on `voyage-3-large` with a 0.38 floor. Anything under about 0.50 was
  treated as weak and was only kept when the row was independently recognizable as high value.
