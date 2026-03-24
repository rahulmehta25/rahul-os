# RahulOS — Product Requirements Document & Implementation Plan

**Version:** 1.0
**Author:** Rahul Mehta
**Last Updated:** March 24, 2026
**Status:** Draft

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Target Audience](#3-target-audience)
4. [Technical Architecture](#4-technical-architecture)
5. [Feature Specifications](#5-feature-specifications)
6. [State Management Schema](#6-state-management-schema)
7. [Component Architecture](#7-component-architecture)
8. [Implementation Plan](#8-implementation-plan)
9. [Risk Register](#9-risk-register)
10. [Launch Strategy](#10-launch-strategy)

---

## 1. Product Overview

### 1.1 What Is RahulOS?

RahulOS is a fully interactive simulated desktop operating system that runs in the browser. It serves as a creative, high-impact portfolio piece at `os.rahul-mehta.me` that replaces a traditional portfolio page with an explorable experience. Visitors interact with a desktop environment featuring draggable/resizable windows, a working terminal, a file manager, and several mini-apps, all of which showcase Rahul's projects, skills, and personality.

### 1.2 Guiding Constraint

**Every feature must be demoable in under 60 seconds.** If a visitor lands on the site and clicks around for one minute, they should encounter at least three distinct "that's cool" moments. Depth in a few areas beats breadth across many.

### 1.3 What RahulOS Is NOT

- Not a real operating system or VM
- Not a backend-dependent application (everything is client-side)
- Not a mobile-first experience (desktop visitors get the OS; mobile gets a clean fallback)
- Not a general-purpose tool (it's a portfolio piece, not a product)

---

## 2. Goals & Success Metrics

### 2.1 Primary Goals

| # | Goal | Rationale |
|---|------|-----------|
| G1 | Demonstrate advanced frontend engineering | Window manager, state management, animation, performance |
| G2 | Showcase projects in an interactive format | Visitors explore projects by navigating the OS, not scrolling a page |
| G3 | Generate attention on HN / dev communities | Unique format drives sharing and engagement |
| G4 | Serve as a living portfolio | New projects are added as files/apps over time |

### 2.2 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Average session duration | > 90 seconds | Vercel Analytics / Plausible |
| Terminal commands executed per session | > 3 | Custom event tracking |
| HN front page | Top 30 | Manual check on launch day |
| GitHub stars (first 30 days) | > 200 | GitHub |
| Bounce rate (desktop visitors) | < 40% | Vercel Analytics |

---

## 3. Target Audience

### 3.1 Primary

- **Recruiters and hiring managers** reviewing Rahul's portfolio
- **Fellow developers** discovering the project via HN, Reddit, or Twitter/X
- **Startup contacts** (investors, partners, potential hires) evaluating technical credibility

### 3.2 Secondary

- **Frontend engineers** looking for inspiration or open-source window manager implementations
- **GT peers and faculty** assessing project work

### 3.3 Audience Implications

| Audience | What They Care About | Design Implication |
|----------|---------------------|--------------------|
| Recruiters | Quick wow factor, evidence of skill | Boot sequence < 3s, obvious first interaction |
| Developers | Code quality, architecture, performance | Open-source repo, clean code, README |
| Startup contacts | Creativity, execution speed | Polish, personality layer, "this person ships" |

---

## 4. Technical Architecture

### 4.1 Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 18+ (Vite) | Fast HMR, small bundle, no SSR needed |
| State Management | Zustand | Lightweight, no boilerplate, perfect for window state |
| Styling | Tailwind CSS + CSS Modules (for OS chrome) | Utility classes for layout, modules for themed components |
| Terminal | Custom lightweight renderer | Avoid xterm.js bundle bloat; ~100 lines for the shell we need |
| Code Editor | CodeMirror 6 | Tree-shakeable, modular, much lighter than Monaco |
| Deployment | Vercel | Already in stack, instant deploys, edge CDN |
| Domain | `os.rahul-mehta.me` | Subdomain of existing portfolio |
| Analytics | Plausible or Vercel Analytics | Privacy-friendly, lightweight |

### 4.2 Why Not Next.js?

This is a pure client-side SPA with zero data fetching, no SEO requirements (it's a single interactive page), and no API routes. Vite + React is simpler, faster to build, and produces a smaller bundle. Next.js would add unnecessary complexity.

### 4.3 Project Structure

```
rahul-os/
├── public/
│   ├── wallpapers/          # Desktop wallpaper images
│   ├── icons/               # App icons (SVG)
│   └── sounds/              # UI sounds (optional, Phase 3)
├── src/
│   ├── main.tsx             # Entry point
│   ├── App.tsx              # Root: boot sequence → desktop
│   │
│   ├── stores/
│   │   ├── windowStore.ts   # Window manager state (Zustand)
│   │   ├── filesystemStore.ts  # Virtual filesystem (Zustand)
│   │   └── settingsStore.ts # Theme, wallpaper, preferences
│   │
│   ├── components/
│   │   ├── Desktop/
│   │   │   ├── Desktop.tsx       # Desktop surface + icon grid
│   │   │   ├── MenuBar.tsx       # Top menu bar (clock, dropdowns)
│   │   │   ├── Dock.tsx          # Bottom dock with app launchers
│   │   │   └── ContextMenu.tsx   # Right-click desktop menu
│   │   │
│   │   ├── Window/
│   │   │   ├── Window.tsx        # Core window wrapper (drag/resize/focus)
│   │   │   ├── TitleBar.tsx      # Window title bar with traffic lights
│   │   │   └── WindowControls.tsx # Close/minimize/maximize buttons
│   │   │
│   │   ├── Boot/
│   │   │   ├── BootSequence.tsx  # BIOS POST + login screen
│   │   │   └── LoginScreen.tsx   # Avatar + "click to enter"
│   │   │
│   │   └── Notifications/
│   │       └── NotificationCenter.tsx
│   │
│   ├── apps/                     # Each app is a lazy-loaded module
│   │   ├── registry.ts           # App manifest (id, name, icon, component)
│   │   ├── Terminal/
│   │   │   ├── Terminal.tsx       # Terminal UI
│   │   │   ├── shell.ts          # Command parser + executor
│   │   │   └── commands/         # Individual command implementations
│   │   │       ├── filesystem.ts # ls, cd, cat, mkdir, rm, pwd
│   │   │       ├── system.ts     # whoami, neofetch, clear, help
│   │   │       └── custom.ts     # projects, open, osmoti, easter eggs
│   │   │
│   │   ├── FileManager/
│   │   │   ├── FileManager.tsx   # Two-pane file browser
│   │   │   ├── Sidebar.tsx       # Directory tree
│   │   │   └── FileGrid.tsx      # Icon/list view of files
│   │   │
│   │   ├── TextEditor/
│   │   │   └── TextEditor.tsx    # CodeMirror wrapper
│   │   │
│   │   ├── Settings/
│   │   │   └── Settings.tsx      # Wallpaper, theme, accent color
│   │   │
│   │   ├── Browser/
│   │   │   └── Browser.tsx       # Bookmarks page with project cards
│   │   │
│   │   ├── AboutThisComputer/
│   │   │   └── About.tsx         # System info / bio modal
│   │   │
│   │   └── Snake/                # Easter egg game
│   │       └── Snake.tsx
│   │
│   ├── filesystem/
│   │   └── defaultFS.ts          # Initial filesystem tree (pre-populated)
│   │
│   ├── hooks/
│   │   ├── useDrag.ts            # Pointer-event drag with CSS transforms
│   │   ├── useResize.ts          # Edge/corner resize handler
│   │   └── useClickOutside.ts    # Context menu dismissal
│   │
│   ├── utils/
│   │   ├── geometry.ts           # Snap-to-edge, bounds checking
│   │   └── animations.ts         # Spring/ease configs for Framer Motion
│   │
│   └── styles/
│       ├── theme.css             # CSS custom properties (colors, fonts)
│       └── global.css            # Reset + base styles
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### 4.4 Bundle Budget

| Target | Limit |
|--------|-------|
| Initial JS (gzipped) | < 80 KB |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 2.5s (excluding boot animation) |
| Largest app chunk (CodeMirror) | < 60 KB gzipped, lazy loaded |

Apps are code-split via `React.lazy()`. The initial bundle includes only the desktop shell, window manager, and dock. Terminal, File Manager, and all other apps load on first open.

---

## 5. Feature Specifications

### 5.1 Phase 1 — Core Shell (Weekends 1-2)

**Deliverable:** A functional desktop with window management and a working terminal.

#### 5.1.1 Desktop

| Feature | Spec |
|---------|------|
| Wallpaper | Full-bleed background image, defaults to dark gradient with subtle noise texture |
| Desktop icons | Grid-snapped icons for key apps (Terminal, File Manager, Settings) |
| Right-click menu | Context menu with: New Folder, Change Wallpaper, About RahulOS |
| Menu bar (top) | Left: "RahulOS" logo + Apple-style dropdown. Right: clock (live), Wi-Fi icon (decorative), battery icon (decorative, always 100%) |

#### 5.1.2 Window Manager

| Feature | Spec |
|---------|------|
| Drag | Title bar drag via pointer events. During drag: apply CSS `translate()` directly via ref (no React state updates). On `pointerup`: commit final position to Zustand. |
| Resize | 8-directional resize handles (4 edges + 4 corners). Same pattern: CSS transforms during resize, commit on release. Minimum window size: 320x240. |
| Focus (z-index) | Click anywhere on a window to bring it to front. Zustand maintains a `zIndexCounter` that increments on each focus event. |
| Minimize | Animate window shrinking to its dock icon position (scale + translate). Window state set to `minimized: true`. Click dock icon to restore. |
| Maximize | Double-click title bar or click green button: animate to fill screen (minus menu bar + dock). Store pre-maximize bounds for restore. |
| Close | Red button. Removes window from Zustand. App-specific cleanup if needed. |
| Title bar | macOS-style: red/yellow/green circles on left, centered title, subtle drag texture. |
| Stacking | Multiple windows of same app type allowed (e.g., two Terminal windows). Each gets unique `windowId`. |

#### 5.1.3 Dock

| Feature | Spec |
|---------|------|
| Layout | Centered at bottom, horizontal row of app icons |
| Icons | SVG icons for each registered app |
| Running indicator | Small dot below icon when app has open windows |
| Launch animation | Icon bounces 2-3 times on click before window appears |
| Tooltip | App name appears on hover |

#### 5.1.4 Terminal App

**This is the highest-impact feature. It should feel responsive and fun.**

| Feature | Spec |
|---------|------|
| Renderer | Custom: scrollable `div` with `font-family: monospace`. Each line is a `<div>`. Input line has a blinking cursor via CSS animation. |
| Prompt | `rahul@rahulos:~$` — updates path segment on `cd` |
| History | Up/down arrow scrolls through command history (in-memory array) |
| Tab completion | Basic: tab completes filenames in current directory |
| Scrollback | Last 500 lines, auto-scroll to bottom on new output |

**Command roster:**

| Command | Behavior |
|---------|----------|
| `ls` | List files in current directory. Colorized: dirs in blue, executables in green. Supports `ls -la` for detailed view. |
| `cd <dir>` | Change directory. Supports `..`, absolute paths, `~` |
| `cat <file>` | Print file contents |
| `mkdir <dir>` | Create directory |
| `rm <file>` | Remove file (with confirmation for directories) |
| `touch <file>` | Create empty file |
| `pwd` | Print working directory |
| `echo <text>` | Print text. Supports `echo "text" > file` for write. |
| `clear` | Clear terminal |
| `help` | List available commands |
| `whoami` | Prints: "Rahul Mehta — Startup Founder, AI/ML Engineer, GT '27" |
| `neofetch` | ASCII art logo + system info block (OS version, uptime, shell, resolution, projects count, etc.) |
| `projects` | Formatted table of projects with name, tech stack, and status |
| `open <app>` | Programmatically launches another app (e.g., `open settings`) |
| `osmoti --status` | Prints Osmoti metrics (hardcoded or fetched from real API) |
| `history` | Show command history |
| `date` | Current date/time |

**Easter egg commands:**

| Command | Behavior |
|---------|----------|
| `sudo rm -rf /` | Screen glitch animation → fake kernel panic → auto-reboot (fade to black → desktop reappears) |
| `cat ~/secrets.txt` | "nice try :)" |
| `exit` | "There is no escape." (then does nothing) |
| `matrix` | Matrix rain overlay for 5 seconds |
| `cowsay <text>` | ASCII cow says the text |
| `fortune` | Random programming quote |

### 5.2 Phase 2 — Filesystem & Apps (Weekends 3-4)

**Deliverable:** File manager, text editor, and a pre-populated filesystem that showcases projects.

#### 5.2.1 Virtual Filesystem

The filesystem is a Zustand store initialized from a static JSON tree (`defaultFS.ts`). All mutations (mkdir, touch, rm) update the store. The filesystem resets on page refresh (no persistence needed).

**Default filesystem structure:**

```
/
├── Desktop/
│   ├── welcome.txt          → "Welcome to RahulOS! Try opening the Terminal."
│   └── resume.pdf           → Opens link to actual resume PDF
├── Documents/
│   ├── about-me.md          → Bio, education, interests
│   └── contact.md           → Email, LinkedIn, GitHub, Twitter
├── Projects/
│   ├── osmoti/
│   │   ├── README.md        → Osmoti description, tech stack, role
│   │   ├── architecture.md  → High-level architecture overview
│   │   └── demo.url         → Link to live product
│   ├── keep-safe/
│   │   ├── README.md        → Keep Safe description
│   │   └── pitch.md         → One-pager on the product
│   ├── analytics-pro/
│   │   └── README.md        → Marketing Analytics Pro at Southwire
│   ├── smart-legal/
│   │   └── README.md        → Smart Legal Contracts, Harvard NCRC
│   └── rahul-os/
│       └── README.md        → Meta: "You're looking at it."
├── Games/
│   └── snake.app            → Launches Snake game
├── Pictures/
│   └── wallpapers/          → Wallpaper options for Settings app
└── .config/
    └── rahulos.json          → Settings (theme, wallpaper, accent)
```

#### 5.2.2 File Manager App

| Feature | Spec |
|---------|------|
| Layout | Two-pane: sidebar (tree view) + main content area |
| Views | Toggle between icon grid view and list view |
| Navigation | Click folder to enter, breadcrumb bar at top, back button |
| File actions | Double-click file to open (opens in Text Editor or appropriate app). Double-click `.url` files to open link in new tab. |
| Context menu | Right-click: Open, Rename, Delete, New Folder, New File |
| Icons | Distinct icons per file type: folder, .md, .txt, .pdf, .url, .app |

#### 5.2.3 Text Editor App

| Feature | Spec |
|---------|------|
| Engine | CodeMirror 6 with markdown syntax highlighting |
| Features | Line numbers, word wrap toggle, basic find (Ctrl+F) |
| File binding | Opens with file content from virtual FS. Edits update the FS store in real-time. |
| Title bar | Shows filename. Dot indicator if file has unsaved changes. |
| Read-only mode | `.md` files in `/Projects/` open in a rendered markdown view (toggle to edit) |

### 5.3 Phase 3 — Polish & Personality (Weekend 5)

**Deliverable:** Boot sequence, settings, browser app, notifications, and visual polish.

#### 5.3.1 Boot Sequence

| Stage | Duration | Spec |
|-------|----------|------|
| BIOS POST | 1.5s | Black screen, green monospace text scrolling: "RahulOS BIOS v1.0... Memory check... 16384 MB OK... Detecting devices... SSD OK... Loading kernel..." |
| Logo splash | 0.5s | Centered RahulOS logo with loading spinner |
| Login screen | User-dismissed | Centered avatar, name, "Click to enter" or press Enter |
| **Total** | **~3s + click** | Skip on return visits (sessionStorage flag) |

#### 5.3.2 Settings App

| Feature | Spec |
|---------|------|
| Wallpaper picker | Grid of 5-6 wallpaper thumbnails. Click to apply instantly. |
| Theme | Toggle dark mode / light mode |
| Accent color | 6 preset accent colors (affects title bars, dock highlight, selection) |
| About | Link to GitHub repo, version number, credits |
| Persistence | Settings stored in Zustand. Reset on page refresh (acceptable). |

#### 5.3.3 Browser App

| Feature | Spec |
|---------|------|
| Layout | Address bar (decorative) + bookmarks grid |
| Bookmarks | Card for each project: screenshot thumbnail, title, description, "Visit" button that opens real URL in new tab |
| Homepage | `rahul-mehta.me` card featured prominently |
| Address bar | Typing a URL and pressing Enter opens it in a new real tab (not an iframe) |

**Rationale for no iframes:** Most sites block iframe embedding via X-Frame-Options. Instead, the Browser app is a stylized link directory. This avoids broken embeds and is more useful.

#### 5.3.4 Notification System

| Trigger | Message | Timing |
|---------|---------|--------|
| First visit | "Welcome to RahulOS. Try opening the Terminal." | 2s after desktop loads |
| Terminal first open | "Try running `neofetch` or `projects`." | 1s after terminal mounts |
| 60s on site | "Enjoying the tour? Check out the Projects folder." | 60s after desktop loads |
| Easter egg found | "Achievement unlocked: [name]" | On trigger |

Notifications slide in from top-right, auto-dismiss after 5s, manually dismissable via X button.

#### 5.3.5 "About This Computer" (Menu Bar → RahulOS → About)

A modal (not a windowed app) showing:

- RahulOS logo
- Version 1.0
- "Built by Rahul Mehta"
- Tech stack badges (React, Zustand, Vite, Tailwind, TypeScript)
- Links: GitHub, LinkedIn, Portfolio, Email
- Uptime (time since page load)
- "Windows opened this session" counter

### 5.4 Phase 4 — Performance, Mobile, & Launch Prep (Weekend 6)

#### 5.4.1 Performance Audit

| Check | Target | Tool |
|-------|--------|------|
| Lighthouse Performance score | > 90 | Chrome DevTools |
| Bundle size (initial) | < 80 KB gzipped | `vite-plugin-visualizer` |
| No layout thrashing during drag | 0 forced reflows | Chrome Performance tab |
| Lazy loading verified | Apps load on first open only | Network tab |
| Memory leaks | No detached DOM nodes after closing windows | Chrome Memory profiler |

#### 5.4.2 Mobile Fallback

For viewports under 768px, render a clean, static portfolio page instead of the OS:

- Header with name, avatar, tagline
- Project cards in a vertical stack
- Links to GitHub, LinkedIn, Resume
- Banner: "Visit on desktop for the full RahulOS experience" with a laptop icon
- Same Tailwind styling / color scheme for brand consistency

#### 5.4.3 SEO & Meta

Even though this is a SPA, set proper meta tags for social sharing:

```html
<title>RahulOS — Rahul Mehta's Interactive Portfolio</title>
<meta name="description" content="An interactive desktop OS built in the browser. Explore my projects, skills, and personality." />
<meta property="og:image" content="/og-image.png" />  <!-- Screenshot of the desktop -->
<meta property="og:title" content="RahulOS" />
<meta property="og:description" content="A fully interactive fake OS that runs in your browser." />
<meta name="twitter:card" content="summary_large_image" />
```

#### 5.4.4 Accessibility (Scoped)

Full a11y for a custom window manager is out of scope. Scoped baseline:

| Feature | Implementation |
|---------|---------------|
| Keyboard focus | Windows focusable via Tab. Active window has visible focus ring. |
| Window close | Escape closes the focused window |
| Terminal | Fully keyboard navigable (inherent) |
| Screen reader | `role="application"` on desktop, `aria-label` on windows, `alt` on icons |
| Reduced motion | `prefers-reduced-motion` disables boot animation, window transitions |

---

## 6. State Management Schema

### 6.1 Window Store (`windowStore.ts`)

```typescript
interface WindowState {
  id: string;             // Unique window ID (e.g., "terminal-1", "filemanager-2")
  appId: string;          // App type (e.g., "terminal", "filemanager")
  title: string;          // Window title bar text
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  zIndex: number;
  status: 'normal' | 'minimized' | 'maximized';
  preMaximizeBounds: { position: Position; size: Size } | null;
  appProps?: Record<string, any>;  // Props passed to the app (e.g., file path for TextEditor)
}

interface WindowStore {
  windows: Record<string, WindowState>;
  zIndexCounter: number;
  activeWindowId: string | null;

  // Actions
  openWindow: (appId: string, props?: Record<string, any>) => string;  // returns windowId
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  updatePosition: (windowId: string, position: Position) => void;
  updateSize: (windowId: string, size: Size) => void;
  setTitle: (windowId: string, title: string) => void;
}
```

### 6.2 Filesystem Store (`filesystemStore.ts`)

```typescript
interface FSNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;          // File content (text files only)
  children?: FSNode[];       // Directory children
  icon?: string;             // Custom icon override
  opensWith?: string;        // App ID to open with (e.g., "texteditor", "snake")
  externalUrl?: string;      // For .url files: opens in new tab
  createdAt: number;         // Timestamp
  modifiedAt: number;
}

interface FilesystemStore {
  root: FSNode;
  currentPath: string;       // Used by terminal and file manager

  // Actions
  getNode: (path: string) => FSNode | null;
  listDirectory: (path: string) => FSNode[];
  createFile: (path: string, content?: string) => void;
  createDirectory: (path: string) => void;
  deleteNode: (path: string) => void;
  renameNode: (path: string, newName: string) => void;
  updateFileContent: (path: string, content: string) => void;
  resolvePath: (from: string, to: string) => string;  // Handles .., ~, relative
}
```

### 6.3 Settings Store (`settingsStore.ts`)

```typescript
interface SettingsStore {
  wallpaper: string;         // Path to wallpaper image
  theme: 'dark' | 'light';
  accentColor: string;       // Hex color
  hasCompletedBoot: boolean; // Skip boot on re-mount within session
  fontSize: 'small' | 'medium' | 'large';

  // Actions
  setWallpaper: (path: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setAccentColor: (color: string) => void;
  markBootComplete: () => void;
}
```

---

## 7. Component Architecture

### 7.1 Component Hierarchy

```
<App>
├── <BootSequence />            (conditional: shows if !hasCompletedBoot)
│   ├── <BIOSScreen />
│   └── <LoginScreen />
│
└── <Desktop>                   (main surface)
    ├── <MenuBar />
    │   ├── <AppleMenu />       ("RahulOS" dropdown → About, Settings)
    │   └── <ClockWidget />
    │
    ├── <DesktopIcons />        (grid of shortcut icons)
    │
    ├── <WindowManager />       (renders all open windows)
    │   └── {windows.map(w =>
    │       <Window key={w.id} state={w}>
    │         <Suspense fallback={<AppLoader />}>
    │           <DynamicApp appId={w.appId} {...w.appProps} />
    │         </Suspense>
    │       </Window>
    │     )}
    │
    ├── <ContextMenu />         (portal, shown on right-click)
    ├── <NotificationCenter />
    └── <Dock />
```

### 7.2 Core Window Component — Drag/Resize Pattern

```
<Window>
  ├── Uses useRef for direct DOM manipulation during drag/resize
  ├── onPointerDown on TitleBar → start drag
  │   ├── Set pointer capture
  │   ├── Track delta via onPointerMove
  │   ├── Apply CSS transform: translate(dx, dy) on the window ref
  │   └── onPointerUp → read final transform → commit to Zustand → clear transform
  │
  ├── onPointerDown on resize handles → start resize
  │   ├── Same pattern: direct DOM width/height during move
  │   └── Commit to Zustand on release
  │
  └── onClick → focusWindow(id)  // Zustand z-index bump
```

This pattern ensures zero React re-renders during drag/resize, maintaining 60fps.

### 7.3 App Registry

```typescript
// src/apps/registry.ts
import { lazy } from 'react';

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;           // Path to SVG icon
  component: React.LazyExoticComponent<any>;
  defaultSize: { width: number; height: number };
  defaultPosition?: { x: number; y: number };  // or 'center'
  allowMultiple: boolean; // Can open more than one instance?
  showInDock: boolean;
  showOnDesktop: boolean;
}

export const apps: AppDefinition[] = [
  {
    id: 'terminal',
    name: 'Terminal',
    icon: '/icons/terminal.svg',
    component: lazy(() => import('./Terminal/Terminal')),
    defaultSize: { width: 680, height: 420 },
    allowMultiple: true,
    showInDock: true,
    showOnDesktop: true,
  },
  {
    id: 'filemanager',
    name: 'Files',
    icon: '/icons/folder.svg',
    component: lazy(() => import('./FileManager/FileManager')),
    defaultSize: { width: 800, height: 520 },
    allowMultiple: true,
    showInDock: true,
    showOnDesktop: true,
  },
  {
    id: 'texteditor',
    name: 'TextEdit',
    icon: '/icons/textedit.svg',
    component: lazy(() => import('./TextEditor/TextEditor')),
    defaultSize: { width: 700, height: 500 },
    allowMultiple: true,
    showInDock: true,
    showOnDesktop: false,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '/icons/settings.svg',
    component: lazy(() => import('./Settings/Settings')),
    defaultSize: { width: 600, height: 450 },
    allowMultiple: false,
    showInDock: true,
    showOnDesktop: true,
  },
  {
    id: 'browser',
    name: 'Safari',
    icon: '/icons/browser.svg',
    component: lazy(() => import('./Browser/Browser')),
    defaultSize: { width: 900, height: 600 },
    allowMultiple: true,
    showInDock: true,
    showOnDesktop: false,
  },
  {
    id: 'snake',
    name: 'Snake',
    icon: '/icons/snake.svg',
    component: lazy(() => import('./Snake/Snake')),
    defaultSize: { width: 400, height: 440 },
    allowMultiple: false,
    showInDock: false,
    showOnDesktop: false,   // Hidden: only via Games folder or terminal
  },
];
```

---

## 8. Implementation Plan

### 8.1 Sprint Schedule

Each "sprint" is one weekend (Saturday + Sunday, ~10-12 productive hours).

---

#### Sprint 1 (Weekend 1): Scaffolding + Window Manager

**Goal:** Draggable, resizable, focusable windows on a desktop surface.

| Task | Est. Hours | Priority |
|------|-----------|----------|
| Vite + React + TS + Tailwind + Zustand setup | 1h | P0 |
| CSS custom properties theme file (dark mode defaults) | 0.5h | P0 |
| `windowStore.ts` with all actions | 1.5h | P0 |
| `<Window>` component with title bar, traffic lights | 2h | P0 |
| `useDrag` hook (pointer events + CSS transforms) | 2h | P0 |
| `useResize` hook (8-directional) | 2h | P0 |
| Focus/z-index management | 0.5h | P0 |
| Minimize/maximize animations (CSS transitions) | 1h | P1 |
| `<Desktop>` surface with solid color background | 0.5h | P0 |
| Hardcoded test: 3 draggable windows with placeholder content | 0.5h | P0 |
| Deploy to Vercel (verify it works) | 0.5h | P0 |

**Sprint 1 Exit Criteria:** Three windows on screen that can be dragged, resized, focused, minimized, maximized, and closed. Feels smooth at 60fps.

---

#### Sprint 2 (Weekend 2): Dock + Terminal

**Goal:** A working terminal in a proper dock-launched window.

| Task | Est. Hours | Priority |
|------|-----------|----------|
| `<Dock>` component with icons, running indicators | 1.5h | P0 |
| Dock launch animation (bounce) | 0.5h | P1 |
| App registry (`registry.ts`) + lazy loading wiring | 1h | P0 |
| `<MenuBar>` with clock and RahulOS dropdown (placeholder) | 1h | P0 |
| Terminal: custom renderer (scrollable div, input line, cursor) | 2h | P0 |
| Terminal: shell parser (tokenize, dispatch to commands) | 1.5h | P0 |
| Terminal: filesystem commands (ls, cd, cat, mkdir, rm, pwd, touch) | 2h | P0 |
| Terminal: system commands (whoami, neofetch, clear, help, date, echo) | 1h | P0 |
| Terminal: command history (up/down arrows) | 0.5h | P1 |
| Terminal: prompt with dynamic path | 0.5h | P0 |

**Sprint 2 Exit Criteria:** Can click Terminal in dock, window opens with bounce, type commands, navigate filesystem, run `neofetch`. Terminal feels responsive.

---

#### Sprint 3 (Weekend 3): Virtual Filesystem + File Manager

**Goal:** A navigable file manager backed by the virtual FS.

| Task | Est. Hours | Priority |
|------|-----------|----------|
| `filesystemStore.ts` with all actions | 1.5h | P0 |
| `defaultFS.ts` — full initial filesystem tree with project content | 2h | P0 |
| Write all project README.md content | 1.5h | P0 |
| Wire terminal commands to use filesystem store | 1h | P0 |
| File Manager: two-pane layout (sidebar + content) | 2h | P0 |
| File Manager: icon grid view + list view toggle | 1h | P1 |
| File Manager: breadcrumb navigation | 0.5h | P0 |
| File Manager: double-click to open files (dispatch to appropriate app) | 1h | P0 |
| File Manager: right-click context menu | 1h | P1 |

**Sprint 3 Exit Criteria:** Can browse the entire filesystem in the File Manager. Double-clicking a .md file opens it (in a placeholder text view for now). Terminal and File Manager share the same filesystem state.

---

#### Sprint 4 (Weekend 4): Text Editor + Content Polish

**Goal:** Editable text files, all project content finalized.

| Task | Est. Hours | Priority |
|------|-----------|----------|
| TextEditor: CodeMirror 6 integration (markdown mode) | 2h | P0 |
| TextEditor: file binding (read from FS store, write back on change) | 1h | P0 |
| TextEditor: rendered markdown view for README files (toggle to edit) | 1.5h | P1 |
| TextEditor: unsaved changes indicator in title bar | 0.5h | P1 |
| Desktop icons: render from registry, double-click to launch | 1h | P0 |
| Desktop icons: drag to rearrange (nice-to-have) | 1h | P2 |
| Terminal: custom commands (projects, open, osmoti --status) | 1h | P0 |
| Terminal: easter eggs (sudo rm -rf, matrix, cowsay, fortune, exit) | 1.5h | P1 |
| Finalize and review all filesystem text content | 1h | P0 |

**Sprint 4 Exit Criteria:** Full content loop works: browse in File Manager → open file → view/edit in TextEditor → changes reflected in FS. All project descriptions written. Easter eggs functional.

---

#### Sprint 5 (Weekend 5): Settings + Browser + Boot + Notifications

**Goal:** Personality layer complete.

| Task | Est. Hours | Priority |
|------|-----------|----------|
| Settings app: wallpaper picker (5-6 options) | 1h | P0 |
| Settings app: dark/light theme toggle | 1h | P0 |
| Settings app: accent color picker | 0.5h | P1 |
| `settingsStore.ts` wired to CSS custom properties | 0.5h | P0 |
| Source/create wallpaper images | 0.5h | P0 |
| Browser app: bookmarks grid with project cards | 1.5h | P0 |
| Boot sequence: BIOS POST screen | 1h | P1 |
| Boot sequence: login screen | 0.5h | P1 |
| Boot sequence: sessionStorage skip logic | 0.25h | P1 |
| Notification system: slide-in component | 1h | P1 |
| Notification triggers (welcome, terminal hint, 60s prompt) | 0.5h | P1 |
| About This Computer modal (from MenuBar) | 0.5h | P1 |
| Context menu on desktop (right-click) | 0.5h | P0 |
| Snake game (canvas-based, minimal) | 1.5h | P2 |

**Sprint 5 Exit Criteria:** First-time visitors see boot → login → desktop → welcome notification. Settings app changes are reflected immediately. Browser app shows all projects with live links. At least one hidden easter egg game.

---

#### Sprint 6 (Weekend 6): Performance, Mobile, Launch

**Goal:** Production-ready, deployed, and launched.

| Task | Est. Hours | Priority |
|------|-----------|----------|
| Lighthouse audit + fix any perf issues | 1.5h | P0 |
| Bundle analysis with vite-plugin-visualizer | 0.5h | P0 |
| Verify all lazy loading works (check Network tab) | 0.5h | P0 |
| Memory leak check (open/close windows repeatedly) | 0.5h | P0 |
| Mobile fallback page (< 768px) | 2h | P0 |
| OG image: screenshot of desktop for social preview | 0.5h | P0 |
| Meta tags (title, description, OG, Twitter card) | 0.25h | P0 |
| Scoped a11y pass (keyboard focus, Escape to close, aria-labels) | 1.5h | P1 |
| `prefers-reduced-motion` support | 0.5h | P1 |
| README.md for GitHub repo (screenshots, tech stack, architecture) | 1h | P0 |
| Vercel production deploy + custom domain `os.rahul-mehta.me` | 0.5h | P0 |
| Write HN "Show HN" post draft | 0.5h | P0 |
| Final end-to-end walkthrough | 0.5h | P0 |
| Analytics setup (Plausible or Vercel Analytics) | 0.25h | P1 |

**Sprint 6 Exit Criteria:** Lighthouse > 90, mobile fallback works, OG preview looks good on Twitter/Slack/iMessage, repo has a polished README, HN post is drafted.

---

### 8.2 Total Estimated Effort

| Sprint | Weekend | Hours | Focus |
|--------|---------|-------|-------|
| 1 | 1 | ~12h | Window manager + desktop shell |
| 2 | 2 | ~11h | Dock + Terminal |
| 3 | 3 | ~11h | Filesystem + File Manager |
| 4 | 4 | ~11h | Text Editor + content + easter eggs |
| 5 | 5 | ~10h | Settings + Browser + boot + notifications |
| 6 | 6 | ~10h | Performance + mobile + launch |
| **Total** | **6 weekends** | **~65h** | |

### 8.3 Cut Line

If time is tight, these features get cut first (in order):

1. Snake game (P2 — fun but not essential)
2. Desktop icon rearranging (P2)
3. File Manager context menu (P1 — right-click; can just use double-click)
4. Boot sequence (P1 — cool but delays interaction)
5. Notification system (P1 — helpful but not core)

The **must-ship** core: window manager + terminal + file manager + text editor + dock + desktop icons + mobile fallback. Everything else is polish.

---

## 9. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| R1 | Window manager jank / poor drag performance | Medium | High | CSS transform pattern (no React re-renders during drag). Profile early in Sprint 1. If still janky, add `will-change: transform` and reduce re-renders with `React.memo`. |
| R2 | CodeMirror 6 bundle too large | Low | Medium | Tree-shake aggressively. Import only `@codemirror/lang-markdown`, `@codemirror/view`, `@codemirror/state`. Skip extensions you don't need. Budget: < 60KB gzipped. |
| R3 | Feature creep ("what if the terminal also did X") | High | High | Refer to the cut line. Every new feature must justify itself against the 60-second rule. If it doesn't produce a "wow" moment in the first minute, it's Phase N+1. |
| R4 | Motivation loss after Sprint 3 | Medium | High | Sprint 3-4 are the grind (filesystem content writing). Front-load the fun (terminal easter eggs in Sprint 4). Deploy after every sprint so you always have a shareable link. |
| R5 | iframe X-Frame-Options blocking Browser app | N/A | N/A | Already mitigated: Browser app is a bookmark grid, not an iframe embed. |
| R6 | Mobile visitors hit a broken/unusable OS | Medium | High | Sprint 6 mobile fallback is P0. If behind schedule, ship a simple "visit on desktop" splash screen as a 30-minute fix. |
| R7 | HN launch falls flat | Medium | Medium | Mitigate with: compelling Show HN title, GIF preview, launch on Tuesday/Wednesday 8-10am ET, cross-post to Twitter/Reddit. Even if HN doesn't hit, the portfolio piece stands on its own. |

---

## 10. Launch Strategy

### 10.1 Pre-Launch Checklist

- [ ] Production deploy on `os.rahul-mehta.me`
- [ ] OG image renders correctly on Twitter, Slack, iMessage
- [ ] README.md on GitHub with screenshots, architecture, tech stack
- [ ] Mobile fallback verified on iPhone and Android
- [ ] 3 friends have beta-tested and provided feedback
- [ ] Analytics tracking verified
- [ ] All filesystem content proofread

### 10.2 Launch Day Plan

**Target:** Tuesday or Wednesday, 8-10am ET (peak HN submission time).

**Show HN post:**

```
Title: Show HN: RahulOS – A fake operating system that runs in your browser

Body:
I built an interactive desktop OS in the browser as my developer portfolio.
Instead of scrolling a page, visitors explore my projects by navigating
a virtual desktop with a working terminal, file manager, and text editor.

Built with React, Zustand, Vite, and TypeScript. No backend.
Everything is client-side.

Some things to try:
- Open the Terminal and run `neofetch`
- Browse to /Projects/ in the File Manager
- Try `sudo rm -rf /` in the Terminal (trust me)

Live: https://os.rahul-mehta.me
Source: https://github.com/rahulmehta/rahul-os

Happy to answer questions about the window manager architecture,
the CSS-transform drag pattern, or anything else.
```

### 10.3 Cross-Post Plan

| Platform | Timing | Format |
|----------|--------|--------|
| Hacker News | Launch day, 8-10am ET | Show HN (text above) |
| Twitter/X | Launch day, 11am ET | GIF showing boot → terminal → neofetch. Thread with technical details. |
| Reddit r/webdev | Launch day, 12pm ET | "I built a fake OS as my portfolio" with screenshots |
| Reddit r/reactjs | Day 2 | Focus on architecture: Zustand window manager, CSS transform pattern |
| LinkedIn | Day 2 | Professional angle: "Instead of a traditional portfolio, I built this" |
| GT Slack / Startup Exchange | Day 2 | Share with GT community |

---

*End of document. This PRD is a living document — update it as scope evolves during implementation.*
