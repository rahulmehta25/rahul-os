<p align="center">
  <img src="public/icons/rahulos-logo.svg" alt="RahulOS Logo" width="80" />
</p>

<h1 align="center">RahulOS</h1>

<p align="center">
  <strong>An interactive macOS-style portfolio OS, built entirely in the browser.</strong>
</p>

<p align="center">
  <a href="https://rahulos.vercel.app">🚀 Live Demo</a> &nbsp;&bull;&nbsp;
  <a href="docs/ARCHITECTURE.md">📐 Architecture</a> &nbsp;&bull;&nbsp;
  <a href="docs/COMPONENTS.md">🧩 Components</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/Zustand-5-764ABC?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0id2hpdGUiPjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgcng9IjQiLz48L3N2Zz4=&logoColor=white" alt="Zustand 5" />
</p>

---

## What is this?

RahulOS is a fully interactive desktop operating system simulation running in your browser. Instead of scrolling through a traditional portfolio, visitors boot into a desktop environment, drag and resize windows, browse a virtual filesystem, run terminal commands, and explore projects through an experience that feels like using a real OS.

Every feature is designed to land in under 60 seconds. Open an app, run a command, explore a folder. Three "that's cool" moments in the first minute.

<p align="center">
  <img src="docs/screenshots/desktop.png" alt="RahulOS Desktop" width="800" />
  <br />
  <em>Multiple windows, dock, menu bar, and desktop icons running in the browser</em>
</p>

## Screenshots

| Boot Sequence | Desktop Environment |
|:---:|:---:|
| ![Boot](docs/screenshots/boot.png) | ![Desktop](docs/screenshots/desktop.png) |

| Terminal & Neofetch | File Manager |
|:---:|:---:|
| ![Terminal](docs/screenshots/terminal.png) | ![Files](docs/screenshots/filemanager.png) |

> Screenshots coming soon. Run `npm run dev` to see it live.

## Features

| Feature | Description |
|---------|-------------|
| 🖥️ **Boot Sequence** | POST screen with scrolling BIOS text, Apple splash screen, and login prompt |
| 🪟 **Window Manager** | Drag, resize (8-directional), minimize, maximize, focus, close, cascade stacking |
| 🚀 **Dock** | macOS-style app launcher with bounce animations, running indicators, and tooltips |
| 📋 **Menu Bar** | Apple menu dropdown, live clock, battery and Wi-Fi status icons |
| ⌨️ **Terminal** | 20+ commands: `ls`, `cd`, `cat`, `neofetch`, `projects`, `cowsay`, and easter eggs |
| 📁 **File Manager** | Two-pane browser with sidebar tree, icon/list views, breadcrumbs, and context menus |
| ✏️ **Text Editor** | CodeMirror 6 with markdown highlighting, line numbers, and virtual FS integration |
| 🌐 **Browser** | Bookmarks page showcasing project cards with live links |
| ⚙️ **Settings** | Wallpaper picker, dark/light theme toggle, accent color customization |
| 🐍 **Snake** | Fully playable Snake game as an easter egg |
| 💾 **Virtual Filesystem** | In-memory FS with directories, files, path resolution, and CRUD operations |
| 🔔 **Notifications** | macOS-style toast notifications with auto-dismiss |
| ✨ **Effects** | Matrix rain overlay and glitch/kernel panic triggered by easter egg commands |
| ⌘ **Keyboard Shortcuts** | `Cmd+W` close, `Cmd+M` minimize, `Cmd+Q` quit, `Tab` cycle windows |
| 📱 **Mobile Fallback** | Clean responsive fallback with project cards for devices under 768px |
| 🖱️ **Context Menu** | Right-click desktop for quick actions (new folder, change wallpaper, about) |

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build tool | Vite 8 |
| Language | TypeScript 5.9 (strict) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| State | Zustand 5 (6 stores) |
| Code editor | CodeMirror 6 |
| Deployment | Vercel |

Zero backend dependencies. Everything runs client-side. The virtual filesystem resets on refresh by design.

## Architecture overview

```
App.tsx
 ├── BootSequence (POST → Splash)
 ├── LoginScreen
 └── Desktop
      ├── MenuBar
      ├── DesktopIcons
      ├── WindowManager
      │    └── Window (per instance)
      │         ├── TitleBar
      │         └── AppLoader → lazy(Terminal | FileManager | TextEditor | ...)
      ├── Dock
      ├── ContextMenu
      └── NotificationCenter
 └── EffectsLayer (MatrixRain | GlitchEffect)
```

State flows through six Zustand stores: `windowStore` (window lifecycle and z-index), `filesystemStore` (virtual FS tree), `settingsStore` (theme, wallpaper), `notificationStore` (toasts), `modalStore` (system dialogs), and `effectsStore` (visual effects).

Drag and resize use pointer capture with CSS transforms during interaction, committing final positions to the store only on release. This keeps React out of the hot path during pointer movement.

For full details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Getting started

### Prerequisites

- Node.js 18+
- npm (detected from `package-lock.json`)

### Development

```bash
git clone https://github.com/rahulmehta25/RahulOS.git
cd RahulOS
npm install
npm run dev
```

Open `http://localhost:5173`.

### Build

```bash
# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview
```

### Lint

```bash
npm run lint
```

## Deployment

Push to `main` and Vercel builds automatically. No environment variables required.

```bash
# Or deploy manually
npx vercel --prod
```

Production: [rahulos.vercel.app](https://rahulos.vercel.app)

## Project structure

```
src/
  App.tsx                    # Root: boot → login → desktop
  main.tsx                   # Entry point, filesystem init
  stores/                    # Zustand state (6 stores)
    windowStore.ts           # Window lifecycle, z-index, focus
    filesystemStore.ts       # Virtual filesystem tree + CRUD
    settingsStore.ts         # Theme, wallpaper, accent color
    notificationStore.ts     # Toast notifications
    modalStore.ts            # System dialog state
    effectsStore.ts          # Visual effects (matrix, glitch)
  components/
    Desktop/                 # Desktop shell
      Desktop.tsx            # Surface, wallpaper, window manager
      Dock.tsx               # App launcher dock
      MenuBar.tsx            # Top menu bar with clock
      DesktopIcons.tsx       # Grid-snapped desktop icons
      ContextMenu.tsx        # Right-click context menu
    Window/                  # Window chrome
      Window.tsx             # Drag, resize, focus, animations
      TitleBar.tsx           # Traffic light buttons + title
    Boot/                    # Startup sequence
      BootSequence.tsx       # BIOS POST + splash screen
      LoginScreen.tsx        # Avatar + click to enter
    Effects/                 # Visual overlays
      EffectsLayer.tsx       # Effect orchestrator
      MatrixRain.tsx         # Matrix rain canvas
      GlitchEffect.tsx       # Kernel panic glitch
    Notifications/           # Toast system
      NotificationCenter.tsx # Notification stack
    Mobile/                  # Small screen fallback
      MobileFallback.tsx     # Portfolio cards for mobile
  apps/                      # Each app is lazy-loaded
    registry.tsx             # App manifest + React.lazy loaders
    Terminal/                # Terminal emulator
      Terminal.tsx           # UI + input handling
      shell.ts               # Command parser + executor
      commands/              # Command implementations
        filesystem.ts        # ls, cd, cat, mkdir, rm, pwd
        system.ts            # whoami, neofetch, clear, help
        custom.ts            # projects, open, cowsay, easter eggs
    FileManager/             # Two-pane file browser
    TextEditor/              # CodeMirror markdown editor
    Browser/                 # Bookmarks / project showcase
    Settings/                # Theme and wallpaper settings
    Snake/                   # Snake game
    AboutThisComputer/       # System info modal
  hooks/                     # Custom React hooks
    useDrag.ts               # Pointer-capture window dragging
    useResize.ts             # 8-directional edge/corner resize
    useWindowKeyboard.ts     # Keyboard shortcuts (Esc, Tab)
  filesystem/                # Default filesystem tree
  styles/                    # CSS custom properties + globals
```

## Easter eggs

Try these in the terminal:

- `sudo rm -rf /` triggers a fake kernel panic with glitch effects, then reboots
- `matrix` starts a Matrix rain overlay
- `cat ~/secrets.txt` nice try :)
- `exit` there is no escape
- `cowsay <text>` ASCII cow says your text
- `fortune` random programming quote

## Credits

Built by [Rahul Mehta](https://rahul-mehta.me).

Inspired by the macOS desktop experience and the many browser-based OS projects in the open source community.

## License

[MIT](LICENSE)
