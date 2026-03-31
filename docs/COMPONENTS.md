# Component reference

Complete reference for every component, hook, and store in RahulOS.

## Window system

### Window

`src/components/Window/Window.tsx`

The core window container. Wraps any app content with chrome (title bar, resize handles, focus behavior).

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| state | `WindowState` | Window position, size, z-index, status from windowStore |
| children | `ReactNode` | App content rendered inside the window |

**Behavior:**

- Renders as `position: absolute` with `left`/`top` from state
- Backdrop blur (40px) + saturate(1.8) for frosted glass effect
- Active window: full opacity, stronger border (`rgba(255,255,255,0.14)`), elevated shadow
- Inactive window: 0.97 opacity, subtle border (`rgba(255,255,255,0.08)`), standard shadow
- Border radius from `--radius-window` (removed when maximized)
- ARIA: `role="dialog"`, `aria-label={title}`, `tabIndex={0}`

**Animations:**

| Transition | Duration | Easing | Behavior |
|------------|----------|--------|----------|
| Minimize | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Scale to 0.1 + translate down, then unmount |
| Restore | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Mount at minimized transform, animate to final position |
| Maximize/restore | 250ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth position + size + border-radius transition |

After minimize animation completes (300ms), the component returns `null` to remove the window from the DOM. On restore, a double `requestAnimationFrame` forces a reflow so the CSS transition triggers.

### TitleBar

`src/components/Window/TitleBar.tsx`

macOS-style title bar with traffic light buttons.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| title | string | Window title, centered with truncation |
| isActive | boolean | Controls button and text opacity |
| onClose | `() => void` | Red button handler |
| onMinimize | `() => void` | Yellow button handler |
| onMaximize | `() => void` | Green button handler (also triggers on double-click) |
| onDragPointerDown | `(e: PointerEvent) => void` | Pointer capture drag initiation |

**Behavior:**

- Traffic light buttons (12px circles) on the left: red (`--color-traffic-red`), yellow (`--color-traffic-yellow`), green (`--color-traffic-green`)
- Hover reveals symbols: x (close), - (minimize), + (maximize)
- Buttons dim to gray when window is inactive
- Title centered, truncated with ellipsis
- Entire bar acts as drag handle via `onDragPointerDown`
- Double-click triggers maximize/restore toggle

## Hooks

### useDrag

`src/hooks/useDrag.ts`

Pointer-capture-based window dragging with zero re-renders during movement.

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| windowRef | `RefObject<HTMLDivElement>` | required | Reference to the window DOM element |
| initialPosition | `Position` | required | Starting `{x, y}` from the store |
| onDragEnd | `(pos: Position) => void` | required | Called on pointer up with final position |
| onDragStart | `() => void` | undefined | Called on pointer down (used for focus) |
| enabled | boolean | `true` | Disabled when window is maximized |

**Returns:** `{ dragHandleProps }` with `onPointerDown` and `style` to spread onto the drag handle element.

**How it works:**

1. On `pointerdown`: capture pointer, record start positions
2. On `pointermove`: compute delta, apply `translate(dx, dy)` via ref (no state updates)
3. On `pointerup`: calculate final position, clamp Y >= 28 (below menu bar), clear transform, commit to store

### useResize

`src/hooks/useResize.ts`

8-directional window resizing with the same CSS-transform performance pattern.

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| windowRef | `RefObject<HTMLDivElement>` | required | Window DOM element |
| initialPosition | `Position` | required | Current window position |
| initialSize | `Size` | required | Current window size |
| minSize | `Size` | required | Minimum allowed dimensions |
| onResizeEnd | `(pos, size) => void` | required | Commit handler on pointer up |
| enabled | boolean | `true` | Disabled when maximized |

**Returns:** `{ resizeHandles }` array of 8 handle objects, each with `key` (direction string) and `props` (event handlers + styles).

**Directions:** `n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw`. Each handle is a 6px invisible hit area with the appropriate resize cursor. North and west edges also adjust position (the top-left corner moves during resize).

### useWindowKeyboard

`src/hooks/useWindowKeyboard.ts`

Global keyboard shortcut handler for window operations.

**Shortcuts:**

| Key | Action |
|-----|--------|
| `Escape` | Close active window |
| `Tab` | Cycle focus to next visible window (by z-index) |
| `Shift+Tab` | Cycle focus to previous visible window |

Tab interception only fires when the focused element is not editable (not `INPUT`, `TEXTAREA`, or `contentEditable`). After switching focus, the hook also calls `.focus()` on the window DOM element.

## Desktop shell

### Desktop

`src/components/Desktop/Desktop.tsx`

The root desktop surface. Composes the entire shell.

**Renders (in order):**

1. Wallpaper background (CSS gradient default or image from settingsStore)
2. Noise texture overlay (inline SVG `feTurbulence` filter, 3% opacity)
3. `MenuBar` (top)
4. `DesktopIcons` (grid on desktop surface)
5. `WindowManager` (iterates `windowStore.windows`, renders `Window` per entry)
6. `Dock` (bottom)
7. `ContextMenu` (right-click)
8. `NotificationCenter` (toast overlay)
9. `AboutModal` (conditional, from modalStore)

**Default wallpaper:** A CSS gradient mimicking macOS Sequoia (dark purple to blue to green to orange, 135deg).

**Timed notifications:**

| Delay | Title | Body |
|-------|-------|------|
| 2s | Welcome to RahulOS | Explore the desktop, open apps from the dock... |
| 60s | Check out the Projects folder | Open Files from the dock to browse project showcases. |
| On first terminal open | Terminal Tip | Try "help" to see available commands... |

### Dock

`src/components/Desktop/Dock.tsx`

macOS-style application launcher bar at the bottom of the screen.

**Behavior:**

- Centered horizontal row of app icons (filtered by `showInDock: true`)
- Running indicator dot below icons with open windows
- Bounce animation on launch
- Hover tooltip with app name
- Click: opens new window, or focuses existing for `allowMultiple: false` apps
- Click on minimized app: restores it

### MenuBar

`src/components/Desktop/MenuBar.tsx`

Top menu bar spanning full width.

**Contents:**

- Left: Apple logo dropdown menu (About This Mac, Settings, etc.)
- Right: Live clock (updates every second), Wi-Fi icon, battery icon (decorative, always 100%)

### DesktopIcons

`src/components/Desktop/DesktopIcons.tsx`

Grid of clickable icons on the desktop surface.

**Behavior:**

- Renders icons for apps with `showOnDesktop: true` in the registry
- Renders icons for filesystem nodes in the `~/Desktop` directory
- Double-click to open the associated app or file
- Single-click to select (highlight)
- Grid-snapped positioning

### ContextMenu

`src/components/Desktop/ContextMenu.tsx`

Right-click context menu on the desktop surface.

**Menu items:**

- New Folder
- Change Wallpaper
- About RahulOS
- Toggle theme (dark/light)

Dismisses on click outside or Escape key.

## Apps

### Terminal

`src/apps/Terminal/Terminal.tsx`

Custom terminal emulator with a built-in shell. The highest-impact interactive feature.

**Features:**

- Monospace font rendering with blinking cursor
- Command prompt: `rahul@rahulos:~$` (path segment updates on `cd`)
- Command history with up/down arrow navigation
- Tab completion for filenames in the current directory
- Scrollback buffer with auto-scroll to bottom

**Commands:**

| Category | Commands |
|----------|----------|
| Filesystem | `ls` (with `-la`), `cd`, `cat`, `mkdir`, `rm`, `touch`, `pwd`, `echo` |
| System | `whoami`, `neofetch`, `clear`, `help`, `history`, `date` |
| Custom | `projects`, `open <app>`, `osmoti --status` |
| Easter eggs | `sudo rm -rf /`, `matrix`, `cat ~/secrets.txt`, `exit`, `cowsay`, `fortune` |

**Shell architecture:** `shell.ts` parses input and dispatches to command modules in `commands/`. Each module exports functions that receive the command args and return output lines. Commands have access to the filesystem store and window store for side effects (opening apps, triggering effects).

### FileManager

`src/apps/FileManager/FileManager.tsx`

Two-pane file browser.

**Sub-components:**

| Component | File | Role |
|-----------|------|------|
| Sidebar | `Sidebar.tsx` | Directory tree with expandable folders |
| FileGrid | `FileGrid.tsx` | Icon grid or list view of current directory |

**Features:**

- Breadcrumb navigation bar
- Back/forward navigation
- Double-click: folders to enter, files to open in TextEditor
- `.url` files open external links in a new tab
- `.app` files launch the associated application
- Right-click context menu: Open, Rename, Delete, New Folder, New File
- Distinct icons per file type (folder, .md, .txt, .pdf, .url, .app)

### TextEditor

`src/apps/TextEditor/TextEditor.tsx`

CodeMirror 6-based text editor.

**Features:**

- Markdown syntax highlighting
- Line numbers
- Word wrap
- Find/replace (`Cmd+F` / `Ctrl+F`)
- Reads content from the virtual filesystem
- Edits update the filesystem store in real-time
- Title bar shows the filename

**Dependencies:** `@codemirror/lang-markdown`, `@codemirror/language`, `@codemirror/search`, `@codemirror/state`, `@codemirror/view`

### Browser

`src/apps/Browser/Browser.tsx`

Bookmarks-style project showcase.

**Features:**

- Project cards with name, description, tech stack, and links
- Cards link to live demos and GitHub repos
- Visual design matching the OS theme

### Settings

`src/apps/Settings/Settings.tsx`

System preferences panel.

**Sections:**

| Section | Controls |
|---------|----------|
| Wallpaper | Pick from presets or use gradient |
| Appearance | Dark/light theme toggle |
| Accent color | Color picker for system accent |

Changes apply immediately via the settingsStore. No save button needed.

### Snake

`src/apps/Snake/Snake.tsx`

Classic Snake game, themed to match the OS color scheme.

**Features:**

- Arrow key controls
- Score tracking
- Game over and restart
- Themed colors from CSS custom properties

### About

`src/apps/AboutThisComputer/About.tsx`

System information modal (macOS "About This Mac" style).

**Displays:**

- OS name and version
- Simulated hardware specs
- Bio and links
- Renders as both a windowed app and a system modal (via modalStore)

## Effects

### EffectsLayer

`src/components/Effects/EffectsLayer.tsx`

Container that reads `effectsStore.activeEffect` and conditionally renders:

- `'kernelPanic'` renders `GlitchEffect`
- `'matrix'` renders `MatrixRain`
- `null` renders nothing

### MatrixRain

`src/components/Effects/MatrixRain.tsx`

Canvas-based Matrix digital rain animation. Green falling characters over the entire viewport. Triggered by the `matrix` terminal command. Auto-clears after a set duration.

### GlitchEffect

`src/components/Effects/GlitchEffect.tsx`

CRT-style screen glitch and kernel panic. Triggered by `sudo rm -rf /` in the terminal. Includes screen tearing, color channel separation, and fake error text. After the effect completes, the app "reboots" back to the boot sequence.

## Boot

### BootSequence

`src/components/Boot/BootSequence.tsx`

Simulated BIOS POST screen.

**Phase 1 (POST, ~1.5s):** Green monospace text on black. Lines appear one by one: CPU detection, memory test, storage, network, kernel modules. Scanline overlay and blinking cursor for CRT effect.

**Phase 2 (Splash, ~0.5s):** Apple logo SVG + spinning loader. Fade-in with scale animation. Calls `onComplete` to transition to login.

### LoginScreen

`src/components/Boot/LoginScreen.tsx`

Lock screen with user avatar and login prompt.

- Centered layout with avatar, username, and click-to-enter button
- On click: sets `sessionStorage('rahulos-booted')` flag, calls `markBootComplete()`, transitions to Desktop
- No real authentication (portfolio piece)

## Mobile

### MobileFallback

`src/components/Mobile/MobileFallback.tsx`

Responsive fallback for viewports under 768px. Since the window manager requires a desktop screen, mobile visitors get a clean card-based layout.

**Contents:**

- Profile header with initials, name, and bio
- Project cards with title, description, and tech stack badges
- Links section (GitHub, LinkedIn, Portfolio, Email)
- Banner encouraging desktop visit

## Notifications

### NotificationCenter

`src/components/Notifications/NotificationCenter.tsx`

Toast notification renderer.

**Behavior:**

- Renders in the top-right corner
- Notifications slide in from the right
- Auto-dismiss after their configured `duration`
- Click to dismiss early
- Stacks vertically for multiple simultaneous notifications
