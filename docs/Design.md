# markframe - System Design Document (v0.1)

## 1. Overview
markframe is a web-based "Mermaid-for-UI" tool that enables developers and designers to build mobile user interfaces (Android/iOS) using a declarative indentation-based DSL called **markframe**. It provides a real-time, side-by-side IDE experience where code changes instantly reflect in high-fidelity mobile previews across multiple device types and orientations.

**Key Differentiators:**
- **Multi-device preview:** Support for 16 iOS and Android devices (phones and tablets)
- **Platform-accurate rendering:** Proper iOS vs Material Design styling via Konsta UI
- **Orientation support:** Portrait and landscape modes
- **Zero backend:** Complete client-side SPA using File System Access API
- **Production exports:** JSON, React Native, and HTML export capabilities (planned)

## 2. Architecture

### 2.1 High-Level Architecture
markframe functions as a client-side Single Page Application (SPA). It minimizes backend dependency by utilizing browser-native APIs for file handling.

```
┌─────────────────────────────────────────────────────────┐
│                    markframe Web App                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────┐    ┌──────────────────────────┐  │
│  │   Editor Pane    │    │    Preview Pane          │  │
│  │                  │    │                          │  │
│  │  Monaco Editor   │◄───┤  Device Frame Renderer   │  │
│  │  (markframe mode)  │    │  • iOS/Android devices   │  │
│  │                  │    │  • Portrait/Landscape    │  │
│  │  Debounced ──────┼───►│  • Zoom 50%-150%         │  │
│  │  Updates (200ms) │    │  • Safe areas            │  │
│  └──────────────────┘    │  • Drag-to-scroll        │  │
│                          └──────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Component Catalog (52)                 │  │
│  │  • Forms: Button, Input, Checkbox, Radio, etc.  │  │
│  │  • Navigation: Navbar, Tabs, Toolbar, Tabbar    │  │
│  │  • Content: List, Card, Text, Icon, Image       │  │
│  │  • Overlays: Sheet, Popup, Dialog, Actions      │  │
│  │  • Layout: Block, Divider, Spacer, Row, Column  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │             Parsing Engine                       │  │
│  │  markframe Text → Indent Tree → markframeNode[]        │  │
│  │  → Konsta UI Components                          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
             │                         │
             ▼                         ▼
    File System API            localStorage
    (*.mf)              (prefs, recent files)
```

### 2.2 Tech Stack
*   **Core Framework:** React 19+, Vite (Rolldown)
*   **Languages:** TypeScript / TSX
*   **UI Components:** Konsta UI 5+ (mobile-first React components)
*   **Styling:** Tailwind CSS 4+ (app shell), Konsta themes (preview)
*   **Editor:** Monaco Editor (`@monaco-editor/react`)
*   **Icons:** Ionicons (via Konsta) + Lucide React (toolbar)
*   **Build:** Vite with Rolldown bundler

### 2.3 Component Layer Separation
```
Application Shell (Tailwind)
└─ Dark IDE theme, toolbar, split panes

Device Preview Frame (CSS)
└─ Device bezels, notches, shadows

Konsta UI App Context (Konsta)
└─ Theme provider, safe areas, touch ripple

markframe Component Catalog (Konsta + Custom, 52 types)
└─ Mapped components with platform props
```

## 3. Data Flow & Core Logic

### 3.1 The markframe Data Model
The core input format is **markframe** — an indentation-based DSL stored in `.mf` files. See `docs/Markframe-Language-Specification.md` for the complete language specification.

**Overview:**
```markframe
view login
  Navbar "Login"
  TextField "Email" type=email
  TextField "Password" type=password
  Button "Sign In"
```

**Key Concepts:**
- **Views:** Top-level screens declared with `view <id>` at column 0
- **App block:** Optional `app` block defines persistent components (tabbar, panels, toasts, etc.) injected into all views (unless `noApp` flag is used)
- **Hierarchy:** Components nest via 2-space indentation
- **Primary props:** First quoted string maps to each component's default prop
- **Named props:** `key=value` pairs for additional configuration
- **Navigation:** `->` syntax for push navigation between views

markframe is parsed into the internal `markframeNode[]` format used by the rendering engine.

### 3.2 The Parsing Pipeline (markframe to Render Tree)
To render the UI, markframe text must be converted through a multi-stage pipeline.

**Pipeline:**
1.  **Input:** Raw markframe text from Monaco Editor
2.  **Tokenize:** Split into lines, strip comments and blank lines
3.  **Indent Tree:** Build tree structure from indentation levels
4.  **Component Mapping:** Map each node to its component type, primary prop, named props, and navigation target
5.  **markframeNode[] Generation:** Produce flat adjacency list with auto-generated IDs and parentId references
6.  **Tree Construction:** Index by ID, assign children, identify root surfaces
7.  **Render:** `DevicePreview` recursively traverses tree via `renderNode()`
8.  **Map:** Each type maps to Konsta UI component (e.g., Button → `<Button>`)

**Performance:**
- Parsing: ~1-2ms for 100 nodes
- Debounced updates: 200ms after last keystroke
- Memoized tree: Only recomputes when content changes

### 3.3 State Management (`usemarkframe` Hook)

**Global State:**
```typescript
interface markframeState {
  // Content
  content: string | null;               // Raw markframe editor content
  parsed: ParseResult;                  // Computed tree structure

  // Navigation
  activeSurfaceId: string | null;        // Current screen ID
  surfaces: SurfaceInfo[];               // Available screens

  // Theming (auto-derived from selected device platform)
  theme: 'ios' | 'material';            // Platform theme

  // Device Preview
  selectedDevice: DeviceSpec;            // Current device (iPhone, Pixel, etc.)
  orientation: 'portrait' | 'landscape'; // Device orientation

  // File Management
  fileHandle: FileSystemFileHandle | null;
  fileName: string | null;

  // Actions
  openProject: () => Promise<void>;
  saveProject: () => Promise<void>;
  closeProject: () => void;
}
```

**Persistence:**
- Device selection: `localStorage`
- Orientation: `localStorage`
- Theme: `localStorage`
- Recent files: `localStorage` (future)

## 4. Component Architecture

### 4.1 Layout (`App.tsx`)
```
┌────────────────────────────────────────────┐
│  Toolbar (Navbar)                          │
│  • File: Open, Save, Close                │
│  • Device Selector (16 devices)             │
│  • Orientation Toggle (portrait/landscape) │
│  • Surface Selector                        │
│  • Theme Indicator (auto from device)      │
│  • Zoom Controls (50%-150%)                │
│  • Export, Help                            │
├──────────────┬─────────────────────────────┤
│              │                             │
│  EditorPane  │  DevicePreview              │
│  (Monaco)    │  • Device frame             │
│              │  • Notch/Island/Punch-hole  │
│  markframe     │  • Konsta App wrapper       │
│  editor with │  • Rendered component tree  │
│  debouncing  │  • Safe areas               │
│  200ms       │  • Auto-scaling             │
│              │                             │
└──────────────┴─────────────────────────────┘
```

### 4.2 Editor Pane (`EditorPane.tsx`)
*   Hosts Monaco Editor with markframe language mode
*   Debounced updates (200ms) to prevent render thrashing
*   Syntax highlighting, code folding, minimap
*   Future: markframe language server with autocomplete and validation

### 4.3 Preview Pane (`DevicePreview.tsx`)
**Responsibilities:**
1. Render device frame with accurate dimensions
2. Display device-specific features (notch, Dynamic Island, etc.)
3. Apply orientation transformations
4. Handle zoom scaling
5. Wrap content in Konsta App context
6. Render component tree
7. Display parsing errors
8. **Mobile Emulation:**
   - Disable text selection (except inputs)
   - Custom 'grab' cursor for touch emulation
   - Hide scrollbars for native app look

**Device Features:**
- **iPhone 15/16 Pro:** Dynamic Island (pill-shaped cutout)
- **Android Phones:** Punch-hole cameras (center/left)
- **Tablets:** Larger dimensions, no notches or punch-holes

**Auto-Scaling:**
- Calculates scale to fit device in container
- Preserves aspect ratio
- Shows scale percentage in info overlay
- Prevents upscaling beyond 100% (devices render at native size or smaller)

### 4.4 Catalog (Component Mapping)
Located in `src/catalog/`, these components bridge markframe definitions to React components.

**Catalog Structure:**
```typescript
interface ComponentProps {
  node: markframeNode;        // The parsed node definition
  children?: ReactNode;  // Nested child components
  theme: 'ios' | 'material'; // Current theme
}

const catalog: Record<string, FC<ComponentProps>> = {
  // 52 component types mapped
  Surface: KSurface,
  Button: KButton,
  // ... etc
};
```

**Component Responsibilities:**
1. Extract props from `node.props`
2. Map to appropriate Konsta UI component
3. Render children recursively
4. Apply variant/styling from props

**Example Mapping:**
```typescript
// KButton.tsx
const KButton: FC<ComponentProps> = ({ node, children }) => {
  const label = node.props?.label as string;
  const outline = node.props?.variant === 'outline';

  return (
    <Button outline={outline}>
      {label || children}
    </Button>
  );
};
```

## 5. File Structure
```text
markframe/
├── public/                 # Static assets (avatars, category images)
├── src/
│   ├── api/                # File System Access API utilities
│   │   └── fileAccess.ts
│   ├── catalog/            # markframe → Konsta UI Mappers (52 components)
│   │   ├── index.ts        # Component registry
│   │   ├── renderNode.tsx  # Recursive renderer
│   │   ├── KButton.tsx
│   │   ├── KInput.tsx
│   │   ├── KCheckbox.tsx
│   │   ├── KRadio.tsx
│   │   ├── KToggle.tsx     # Switch + Toggle
│   │   ├── KTabs.tsx
│   │   ├── KToolbar.tsx
│   │   ├── KListItem.tsx
│   │   ├── KIcon.tsx
│   │   ├── KFab.tsx
│   │   ├── KChip.tsx
│   │   ├── KImage.tsx
│   │   ├── KSheet.tsx
│   │   ├── KPopup.tsx
│   │   └── ... (30+ more)
│   ├── components/         # Shared UI components
│   │   ├── Toolbar.tsx     # Main toolbar
│   │   ├── ErrorBoundary.tsx
│   │   ├── ValidationPanel.tsx
│   │   └── ShortcutsDialog.tsx
│   ├── constants/          # App constants
│   │   └── shortcuts.ts    # Keyboard shortcut definitions
│   ├── devices/            # Device specifications
│   │   ├── deviceLibrary.ts   # 16 device definitions
│   │   └── deviceUtils.ts     # Orientation, scaling helpers
│   ├── engine/             # Parsing logic and state hooks
│   │   ├── useMarkframe.ts    # Main state hook
│   │   └── markframeParser.ts # markframe parser (text → MarkframeNode tree)
│   ├── utils/              # Utility functions
│   │   └── validation.ts   # Content validation
│   ├── views/              # Major view containers
│   │   ├── DevicePreview.tsx
│   │   ├── EditorPane.tsx
│   │   └── WelcomeScreen.tsx
│   ├── types/              # Type definitions
│   │   ├── markframe.ts       # Node types (MarkframeNode, ParseResult)
│   │   └── device.ts       # Device specs
│   ├── blueprints.ts       # Blueprint registry
│   ├── App.tsx             # Main entry
│   └── main.tsx            # Root render
├── blueprints/             # Starter templates (12)
│   ├── blank.mf
│   ├── ecommerce-store.mf
│   ├── finance-dashboard.mf
│   ├── fitness-tracker.mf
│   ├── food-rush.mf
│   ├── messaging-app.mf
│   ├── music-service.mf
│   ├── news-magazine.mf
│   ├── social-media-1.mf
│   ├── social-media-2.mf
│   ├── tabbar-overflow.mf
│   └── travel-booking.mf
└── docs/
    ├── Design.md           # This file
    ├── Markframe-Language-Specification.md  # Language specification
    └── UIUX.md             # UI/UX guidelines
```

## 6. Device Library

### 6.1 Supported Devices

**iOS Phones (4):**
- iPhone 15 Pro - 393×852 - Dynamic Island
- iPhone 15 Pro Max - 430×932 - Dynamic Island, large
- iPhone 16 Pro - 402×874 - Dynamic Island
- iPhone 16 Pro Max - 440×956 - Dynamic Island, large

**iOS Tablets (3):**
- iPad mini (6th gen) - 744×1133
- iPad Pro 11" - 834×1194
- iPad Pro 12.9" - 1024×1366

**Android Phones (7):**
- Google Pixel 7 - 412×915 - Center punch-hole
- Google Pixel 9 - 412×923 - Center punch-hole
- Google Pixel 9 Pro XL - 448×998 - Center punch-hole
- Samsung Galaxy S23 - 360×780 - Center punch-hole
- Samsung Galaxy S24 Ultra - 412×915 - Center punch-hole
- Samsung Galaxy S25 Ultra - 412×915 - Center punch-hole
- OnePlus 11 - 412×919 - Left punch-hole

**Android Tablets (2):**
- Google Pixel Tablet - 800×1280
- Samsung Galaxy Tab S9 - 1024×1366

**Device Spec Includes:**
```typescript
interface DeviceSpec {
  id: string;
  name: string;
  shortName?: string;
  platform: 'ios' | 'android';
  formFactor: 'phone' | 'tablet';
  dimensions: { width, height, scale, aspectRatio? };
  safeArea: { top, bottom, left?, right? };
  features: {
    dynamicIsland?: boolean;
    punchHole?: 'center' | 'left' | 'right';
    punchHoleDiameter?: number;
    roundedCorners?: boolean;
    borderRadius?: number;
  };
  frame: { borderWidth, borderColor, shadow, backgroundColor };
}
```

### 6.2 Orientation Support
- **Portrait:** Default, most common for phones
- **Landscape:** Essential for tablets, video apps, games
- **Safe area rotation:** Notches/islands move to side in landscape
- **Automatic scaling:** Maintains device fit in container
- **Keyboard shortcut:** Cmd+R / Ctrl+R to toggle

## 7. Component Catalog (52 Types)

### 7.1 Form Controls
| markframe Type | Konsta Component | Description |
|-----------|------------------|-------------|
| `Button` | Button | Primary, outline, clear, tonal variants |
| `TextField` | ListInput | Text input with label |
| `Checkbox` | Checkbox | Boolean checkbox |
| `Radio` | Radio | Radio button group |
| `Switch` | Toggle | iOS-style toggle |
| `Toggle` | Toggle | Material-style toggle |
| `Stepper` | Stepper | Numeric +/- control |
| `Range` | Range | Slider input |

### 7.2 Navigation
| markframe Type | Konsta Component | Description |
|-----------|------------------|-------------|
| `Navbar` | Navbar | Top navigation bar |
| `Toolbar` | Toolbar | Bottom toolbar |
| `Tabbar` | Tabbar | Bottom tab navigation |
| `Tabs` | Tabs/Tab | Horizontal tabs |
| `Segmented` | SegmentedControl | iOS segmented control |
| `Link` | Link | Navigation link |
| `Breadcrumbs` | Breadcrumbs | Breadcrumb navigation |

### 7.3 Content & Display
| markframe Type | Konsta Component | Description |
|-----------|------------------|-------------|
| `Text` | Block/BlockTitle | Text content |
| `Card` | Card | Content card |
| `List` | List | List container |
| `ListItem` | ListItem | Rich list item with chevron/media |
| `ListGroup` | ListGroup | Groups list items with header |
| `ListDivider` | ListDivider | Divider within list context |
| `Icon` | Icon (ionicons) | Icon display |
| `Image` | Custom (img wrapper) | Image display |
| `Badge` | Badge | Notification badge |
| `Chip` | Chip | Tag/filter chip |
| `Avatar` | Custom | Circular avatar with auto-assign |
| `MediaCard` | Custom | Card with header image |
| `Stat` | Custom | Stat display with value/label |

### 7.4 Layout & Structure
| markframe Type | Konsta Component | Description |
|-----------|------------------|-------------|
| `view` | Page (Surface) | Top-level screen |
| `Block` | Block | Content block (title/header/footer variants) |
| `Row` | Custom (flex) | Horizontal flex container |
| `Column` | Custom (flex) | Vertical flex container |
| `Grid` | Custom (CSS grid) | CSS grid layout |
| `Center` | Custom | Centers content horizontally/vertically |
| `Divider` | Custom | Horizontal divider |
| `Spacer` | Custom | Vertical spacing |

### 7.5 Overlays & Modals
| markframe Type | Konsta Component | Description |
|-----------|------------------|-------------|
| `Sheet` | Sheet | Bottom sheet |
| `Popup` | Popup | Center modal |
| `Actions` | Actions/ActionsGroup | Action sheet |
| `Dialog` | Dialog | Alert/confirm dialog |
| `Popover` | Popover | Contextual popup |
| `Panel` | Panel | Side panel/drawer |
| `Toast` | Custom | Temporary notification |

### 7.6 Action Components
| markframe Type | Konsta Component | Description |
|-----------|------------------|-------------|
| `Fab` | Fab | Floating action button |

### 7.7 Enriched Components
| markframe Type | Konsta Component | Description |
|-----------|------------------|-------------|
| `ProgressBar` | Custom | Progress bar indicator |
| `Preloader` | Preloader | Loading spinner |
| `Searchbar` | Searchbar | Search bar input |
| `MenuList` | MenuList | Menu container |
| `MenuItem` | MenuItem | Menu item |

### 7.8 Social Components
| markframe Type | Konsta Component | Description |
|-----------|------------------|-------------|
| `Post` | Custom | Social feed post |
| `Message` | Message | Chat message bubble |
| `IconCircle` | Custom | Circular icon with background |
| `StoryRow` / `Story` | Custom | Horizontal avatar strip |

### 7.9 Child/Helper Components (consumed by parents)
| markframe Type | Parent | Description |
|-----------|--------|-------------|
| `Tab` | Tabs/Tabbar | Tab definition |
| `DialogButton` | Dialog | Dialog action button |
| `ActionsButton` | Actions | Action sheet button |
| `ActionsGroup` | Actions | Action sheet group |
| `BreadcrumbsItem` | Breadcrumbs | Breadcrumb item |
| `Story` | StoryRow | Story avatar circle |

## 8. Export System (Planned)

> **Status:** Not yet implemented. The following describes planned export capabilities for a future release.

### 8.1 Planned Export Formats

**JSON Export:**
- Clean markframeNode[] JSON (parsed from markframe)
- Formatted/minified options
- Validation report included

**React Native Export:**
- Convert parsed tree → React Native components
- Map Konsta → React Native equivalents (Button, TextInput, etc.)
- Generate JSX file with proper imports
- Include navigation setup (React Navigation)
- TypeScript support

**HTML Export:**
- Standalone HTML file with Konsta UI CDN
- Embedded styles and scripts
- Static preview (no editing)
- Shareable via URL

## 9. Future Considerations (Post-MVP)

### 9.1 Planned Features
*   **Exploded View:** 2D component hierarchy diagram
*   **Data Binding:** Expression language for dynamic data (`$.user.name`)
*   **Component Library:** User-defined custom components
*   **Collaboration:** Real-time multi-user editing
*   **Version Control:** Git integration for `.mf` files
*   **Component Inspector:** Click components to edit props
*   **Drag-and-Drop:** Visual component placement
*   **Animation Timeline:** Define transitions and animations
*   **Variable System:** Shared colors, fonts, spacing tokens
*   **Responsive Breakpoints:** Define tablet/phone-specific layouts
*   **Accessibility:** ARIA labels and validation

### 9.2 Technical Improvements
*   **markframe Language Server:** Monaco autocomplete, inline errors, and hover docs
*   **Component Search:** Quick fuzzy search for components
*   **Version History:** Undo/redo beyond Monaco's built-in
*   **Cloud Storage:** Optional cloud sync for files
*   **Plugins:** Extension API for custom components
*   **Real Device Testing:** Connect to actual iOS/Android devices
*   **Performance:** Virtual scrolling for large component trees

### 9.3 Integration Targets
*   **Figma Plugin:** Import Figma designs as markframe
*   **VS Code Extension:** markframe editing in VS Code
*   **GitHub Actions:** CI/CD for markframe validation
*   **Storybook:** Generate Storybook from markframe
*   **Testing:** Generate test suites from markframe definitions

## 10. Performance Targets (MVP 1.0)

| Metric | Target | Notes |
|--------|--------|-------|
| Time to Interactive | < 2s | Initial app load |
| Editor Input Lag | < 50ms | Debounced to 200ms |
| Parse Time | < 5ms | For 100 components |
| Render Time | < 100ms | Tree to DOM |
| Build Size | < 2MB | Gzipped bundle |
| Device Switch | < 300ms | Frame animation |
| Theme Toggle | < 100ms | Instant re-render |

## 11. Browser Compatibility

**Required:**
- Chrome 90+ (File System Access API)
- Edge 90+
- Safari 16+ (limited file API support)
- Firefox 90+ (via polyfill for File System Access)

**Graceful Degradation:**
- Browsers without File System Access API: Use file download/upload fallback
- Mobile browsers: Display "desktop recommended" message

## 12. Success Metrics (MVP 1.0)

**Functional Completeness:**
- 52 component types (+ 6 child/helper types)
- 16 device frames
- iOS + Android theming (auto-derived from device)
- Portrait + landscape
- Zoom controls
- 12 blueprint examples
- Complete documentation

**Quality Metrics:**
- Zero console errors in production build
- All blueprints render correctly on all devices
- Theme toggle shows clear visual differences
- No accessibility violations (WCAG AA)
- Load time under 2 seconds on 4G connection

**Community Readiness:**
- README with video demo
- Component documentation
- Contributing guidelines
- Issue templates
- License (MIT)
- Changelog

---

**Document Version:** 3.2
**Last Updated:** 2026-02-15
**Status:** Design complete, markframe implemented
