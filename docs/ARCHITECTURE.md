# Architecture

RahulOS is a client-side React SPA that simulates a desktop operating system. No backend, no API calls, no SSR. Everything runs in the browser.

## Component hierarchy

```
                                    App.tsx
                                      |
                     +----------------+----------------+
                     |                |                |
               BootSequence     LoginScreen        Desktop
               (phase=boot)    (phase=login)    (phase=desktop)
                                                      |
          +----------+----------+---------+----------+----------+
          |          |          |         |          |          |
       MenuBar  DesktopIcons  WindowMgr  Dock  ContextMenu  NotifCenter
                                  |
                             Window (x N)
                               |
                          +----+----+
                          |         |
                       TitleBar  AppLoader
                                    |
                                Suspense
                                    |
                    +-------+-------+-------+-------+
                    |       |       |       |       |
                Terminal  Files  TextEdit Browser Settings  Snake  About

                    (all lazy-loaded via React.lazy)

  EffectsLayer (sibling of Desktop, renders over everything)
      +-- MatrixRain
      +-- GlitchEffect (kernel panic)

  MobileFallback (replaces everything on viewport < 768px)
```

## Zustand stores

Six independent stores, each with a single responsibility. No global store, no prop drilling.

```
+-------------------+   +--------------------+   +------------------+
|   windowStore     |   |  filesystemStore   |   |  settingsStore   |
|                   |   |                    |   |                  |
| windows{}         |   | root: FSDirectory  |   | wallpaper        |
| zIndexCounter     |   |                    |   | theme            |
| activeWindowId    |   | resolvePath()      |   | accentColor      |
|                   |   | getNode()          |   | fontSize         |
| openWindow()      |   | listDirectory()    |   | hasCompletedBoot |
| closeWindow()     |   | createFile()       |   |                  |
| focusWindow()     |   | createDirectory()  |   | setWallpaper()   |
| minimizeWindow()  |   | deleteNode()       |   | setTheme()       |
| maximizeWindow()  |   | renameNode()       |   | setAccentColor() |
| restoreWindow()   |   | updateFileContent()|   | markBootComplete |
| updatePosition()  |   |                    |   |                  |
| updateSize()      |   |                    |   |                  |
| setTitle()        |   |                    |   |                  |
+-------------------+   +--------------------+   +------------------+

+-------------------+   +--------------------+   +------------------+
| notificationStore |   |    modalStore      |   |  effectsStore    |
|                   |   |                    |   |                  |
| notifications[]   |   | activeModal        |   | activeEffect     |
|                   |   |                    |   |                  |
| push()            |   | openModal()        |   | setEffect()      |
| dismiss()         |   | closeModal()       |   | clearEffect()    |
+-------------------+   +--------------------+   +------------------+
```

### windowStore

The core of the window manager. Each window is tracked by a unique ID (`{appId}-{counter}`).

**State shape:**

```typescript
interface WindowState {
  id: string;                    // "terminal-1", "filemanager-2"
  appId: string;                 // Registry key: "terminal", "settings"
  title: string;                 // Displayed in title bar
  position: { x, y };           // Top-left corner (px)
  size: { width, height };      // Current dimensions (px)
  minSize: { width, height };   // Minimum resize bounds
  zIndex: number;               // Stacking order (monotonic counter)
  status: 'normal' | 'minimized' | 'maximized';
  preMaximizeBounds: { position, size } | null;
  appProps?: Record<string, unknown>;
}
```

**Key behaviors:**

- **Open**: Creates a window with cascading offset (30px stagger). If `allowMultiple` is false in the app manifest, focuses the existing instance instead.
- **Focus**: Increments global `zIndexCounter`, assigns it to the focused window. Most recently focused window is always on top.
- **Close**: Removes from store, auto-focuses the next highest z-index window.
- **Minimize**: Sets status to `minimized`. The Window component animates out (scale + translate, 300ms), then unmounts from the DOM.
- **Maximize**: Saves current bounds in `preMaximizeBounds`, expands to fill screen minus menu bar (28px) and dock (72px). Toggle to restore.

### filesystemStore

An in-memory tree structure simulating a Unix filesystem.

```typescript
type FSNode = FSFile | FSDirectory;

interface FSFile {
  type: 'file';
  name: string;
  content: string;
  createdAt: number;
  modifiedAt: number;
  icon?: string;           // Custom icon override
  opensWith?: string;      // App ID for double-click open
  externalUrl?: string;    // External link for .url files
}

interface FSDirectory {
  type: 'directory';
  name: string;
  children: Record<string, FSNode>;
  createdAt: number;
}
```

Path resolution supports `~` (maps to `/home/rahul`), `..`, `.`, and absolute paths. All mutations clone the tree from root to maintain immutability for Zustand's shallow comparison.

The filesystem initializes from `filesystem/defaultFS.ts` on app load and resets on page refresh.

### settingsStore

| Field | Type | Default | Side effect |
|-------|------|---------|-------------|
| wallpaper | string | `''` (gradient fallback) | CSS background on Desktop |
| theme | `'dark' \| 'light'` | `'dark'` | Sets `data-theme` attribute on `<html>` |
| accentColor | string | `'#89b4fa'` | Sets `--color-accent` CSS variable |
| fontSize | `'small' \| 'medium' \| 'large'` | `'medium'` | Text size preference |
| hasCompletedBoot | boolean | `false` | Set after login |

`setTheme()` writes to `document.documentElement` for CSS custom property propagation. `setAccentColor()` updates `--color-accent` directly on the root element. Theme changes propagate instantly through CSS without triggering React re-renders.

### notificationStore

Push/dismiss model for toast notifications. Each notification has a title, body, optional duration (default 5s), and auto-generated ID. `NotificationCenter` renders active notifications and handles auto-dismissal.

### modalStore

Simple modal state. Currently supports the "About This Mac" modal (`activeModal: 'about' | null`). The Desktop conditionally renders `AboutModal` when active.

### effectsStore

Full-screen visual effects triggered by easter egg commands:

- `'matrix'` activates the Matrix rain canvas overlay
- `'kernelPanic'` activates the glitch/CRT distortion effect

`EffectsLayer` reads this store and renders the matching effect component.

## Window lifecycle

```
User action (dock click, desktop icon, terminal `open` command)
    |
    v
openWindow(appId, title, options?)
    |
    +-- allowMultiple === false && existing window?
    |       yes --> focusWindow(existingId) --> done
    |       no  --> continue
    |
    +-- Generate unique ID: "{appId}-{++counter}"
    +-- Calculate position (cascade offset or provided)
    +-- Set zIndex = ++zIndexCounter
    +-- Insert into windows{} map
    +-- Set as activeWindowId
    +-- Return window ID
```

**Window state transitions:**

```
                    +----------+
         +-------->|  normal   |<--------+
         |         +----------+          |
    restoreWindow    |        |     restoreWindow
         |     minimize  maximize        |
         |           |        |          |
         |           v        v          |
         |    +----------+ +----------+  |
         +----| minimized| | maximized|--+
              +----------+ +----------+
```

**Close:**

```
closeWindow(id)
    |
    +-- Remove from windows{} map
    +-- Auto-focus highest z-index remaining window
```

## Drag system

Window dragging uses a performance-optimized pattern that keeps React out of the hot path:

```
1. pointerdown on TitleBar
   +-- Set pointer capture on target element
   +-- Record start mouse position + start window position
   +-- Fire onDragStart --> focusWindow()

2. pointermove (document-level listener)
   +-- Calculate delta: (currentMouse - startMouse)
   +-- Apply CSS transform directly via ref: translate(dx, dy)
   +-- Set will-change: transform for GPU layer promotion
   ** No React state updates during movement **

3. pointerup (document-level listener)
   +-- Calculate final position: startPos + delta
   +-- Clamp Y to >= 28px (below menu bar)
   +-- Clear CSS transform and will-change
   +-- Commit to store: updatePosition(finalPos)
   +-- Release pointer capture
   ** Single React render on drop **
```

Zero re-renders during drag. The window moves via a CSS transform applied directly to the DOM node. Only on release does the final position flow through Zustand.

## Resize system

Same pattern as drag, extended to 8 directions:

```
Resize handles (invisible 6px hit areas around window edges):

+------+--------------------+------+
|  nw  |         n          |  ne  |
+------+                    +------+
|      |                    |      |
|  w   |      content       |  e   |
|      |                    |      |
+------+                    +------+
|  sw  |         s          |  se  |
+------+--------------------+------+
```

Each handle captures pointer events independently. During resize:
- Width/height changes apply directly to `el.style.width` / `el.style.height`
- North and west edges also shift position via `el.style.transform`
- Min size constraints enforced per-app from the registry manifest
- On release, both position and size commit to the store

## Virtual filesystem

The filesystem initializes from `filesystem/defaultFS.ts` with a pre-populated tree:

```
/
+-- home/
|   +-- rahul/
|       +-- Desktop/
|       +-- Documents/
|       +-- Projects/           # Portfolio project files
|       |   +-- osmoti.md
|       |   +-- analytics-pro.md
|       |   +-- keep-safe.md
|       |   +-- ...
|       +-- secrets.txt         # Easter egg
+-- etc/
+-- tmp/
+-- var/
```

The Terminal's `cd`, `ls`, `cat`, `mkdir`, `rm`, and `touch` operate on this tree. The File Manager reads from and writes to it. The Text Editor loads and saves files through it.

All mutations use structural cloning: the store clones from root to the target node's parent, applies the mutation, then replaces the root. Unchanged subtrees maintain referential equality, making Zustand's shallow comparison work correctly.

## Boot sequence

```
+-------------------------------+
| Phase 1: POST (~1.5s)        |
| Green monospace on black      |
| BIOS lines appear one by one  |
| Scanline overlay + cursor     |
+---------------+---------------+
                |
                v
+-------------------------------+
| Phase 2: Splash (~0.5s)      |
| Apple logo + loading spinner  |
| Fade-in scale animation       |
+---------------+---------------+
                |
                v
+-------------------------------+
| Phase 3: Login                |
| User avatar + click to enter  |
| Sets sessionStorage flag      |
+---------------+---------------+
                |
                v
+-------------------------------+
| Phase 4: Desktop              |
| Full OS environment           |
| Welcome notification at 2s    |
| Projects hint at 60s          |
+-------------------------------+
```

Session persistence: once booted, `sessionStorage` stores a `rahulos-booted` flag. Refreshing the page skips boot for that tab session.

## App registry and lazy loading

Every app declares a manifest in `src/apps/registry.tsx`:

```typescript
interface AppManifest {
  id: string;                    // Unique key
  name: string;                  // Display name
  component: ComponentType;      // React.lazy() wrapped component
  defaultSize: { width, height };
  minSize: { width, height };
  allowMultiple?: boolean;       // Can open multiple instances?
  showInDock?: boolean;          // Visible in dock?
  showOnDesktop?: boolean;       // Has desktop icon?
}
```

**Registered apps:**

| ID | Name | Default size | Multiple | Dock | Desktop |
|----|------|:-----------:|:--------:|:----:|:-------:|
| `terminal` | Terminal | 680x420 | yes | yes | no |
| `settings` | Settings | 600x450 | no | yes | no |
| `snake` | Snake | 420x480 | no | yes | no |
| `about` | About This Mac | 500x340 | no | no | no |
| `filemanager` | Files | 800x520 | yes | yes | yes |
| `texteditor` | TextEdit | 700x500 | yes | yes | no |
| `browser` | Safari | 900x600 | yes | yes | no |

Each component uses `React.lazy()` with dynamic imports:

```typescript
const LazyTerminal = lazy(() =>
  import('./Terminal/Terminal').then((m) => ({ default: m.Terminal }))
);
```

`AppLoader` wraps each app in `<Suspense>` with a loading fallback. The initial bundle includes only the desktop shell. Apps load on first open and cache for subsequent opens.

## Performance design

| Technique | Where | Purpose |
|-----------|-------|---------|
| CSS transforms during drag/resize | `useDrag`, `useResize` | Zero React re-renders during pointer movement |
| Pointer capture | Drag/resize hooks | Events fire even if pointer leaves the window |
| `will-change: transform` | During drag | Hints browser to promote layer for GPU compositing |
| `React.lazy()` code splitting | App registry | Initial bundle is just the shell (~80KB gzipped target) |
| Zustand selectors | All store consumers | Components subscribe to specific slices, not whole stores |
| Structural tree cloning | `filesystemStore` | Unchanged subtrees maintain referential equality |
| `sessionStorage` boot skip | `App.tsx` | Skips boot animation on refresh within same tab |
| Monotonic z-index counter | `windowStore` | No z-index recalculation, always correct stacking |
| DOM unmount after minimize | `Window.tsx` | Minimized windows removed from DOM after animation |
| Double requestAnimationFrame | Restore animation | Forces reflow for CSS transition to trigger |

## Theming

All colors and layout tokens are CSS custom properties in `src/styles/theme.css`:

```css
/* Backgrounds (with transparency for blur-through) */
--color-bg-desktop
--color-bg-surface        /* Window/panel backgrounds */
--color-bg-titlebar
--color-bg-dock
--color-bg-menubar

/* Text hierarchy */
--color-text-primary      /* #f5f5f7 */
--color-text-secondary    /* #a1a1a6 */
--color-text-tertiary     /* #6e6e73 */

/* System colors */
--color-accent            /* #0A84FF (macOS blue, overridable) */
--color-traffic-red       /* #FF5F57 */
--color-traffic-yellow    /* #FEBC2E */
--color-traffic-green     /* #28C840 */

/* Depth */
--shadow-window           /* Multi-layer shadow */
--shadow-window-active    /* Elevated shadow for focused windows */
--radius-window           /* Window border radius */
```

`settingsStore.setTheme()` sets a `data-theme` attribute on `<html>`. `setAccentColor()` updates `--color-accent` on the root element. All components read these through CSS, so changes propagate instantly.

## Adding a new app

1. Create `src/apps/YourApp/YourApp.tsx` exporting a named component that accepts `{ windowId: string }`.
2. Add a lazy import in `src/apps/registry.tsx`:
   ```typescript
   const LazyYourApp = lazy(() =>
     import('./YourApp/YourApp').then((m) => ({ default: m.YourApp }))
   );
   ```
3. Add a manifest entry to `appRegistry`:
   ```typescript
   yourapp: {
     id: 'yourapp',
     name: 'Your App',
     component: LazyYourApp,
     defaultSize: { width: 600, height: 400 },
     minSize: { width: 300, height: 200 },
     allowMultiple: true,
     showInDock: true,
     showOnDesktop: false,
   }
   ```
4. The window manager, drag, resize, focus, and keyboard shortcuts work automatically.
