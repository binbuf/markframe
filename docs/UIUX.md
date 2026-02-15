# markframe - UI/UX Guidelines (v0.1)

## 1. Design Philosophy
markframe aims for a **"Studio-Grade"** aesthetic combined with **mobile-first accuracy**. It should feel like a professional developer tool (like VS Code or Figma) while providing pixel-perfect mobile UI previews.

**Core Principles:**
*   **Minimalist:** Interface chrome should be unobtrusive, letting the preview shine
*   **Responsive:** Zero-latency feedback loop - typing code = seeing results
*   **Native Feel:** Previews must look indistinguishable from real iOS/Android apps
*   **Multi-Device:** Support the full spectrum of mobile devices (phones to tablets)
*   **Platform-Accurate:** Respect iOS Human Interface Guidelines and Material Design principles

## 2. Layout & Structure

### 2.1 Main Window (The "Studio")
The application uses a standard 2-column IDE layout optimized for desktop workflows.

```
┌────────────────────────────────────────────────────────────┐
│  TOOLBAR (Fixed, 48px height, dark gray #1e1e1e)          │
│  [Logo] [File] [Device ▼] [↻] [Surface ▼] [iOS/MD] [Zoom]│
├────────────────────────┬───────────────────────────────────┤
│                        │                                   │
│  EDITOR PANE           │  PREVIEW PANE                     │
│  (Monaco, dark theme)  │  (Canvas with device frame)       │
│                        │                                   │
│  • Line numbers        │  • Realistic device bezel         │
│  • Syntax highlight    │  • Notch/Island/Punch-hole        │
│  • Code folding        │  • Auto-scaled to fit             │
│  • Minimap             │  • Info overlay (device name)     │
│  • Error indicators    │  • Touch cursor (future)          │
│                        │                                   │
│  Resizable ←→          │                                   │
│  (300px min)           │  (300px min)                      │
│                        │                                   │
└────────────────────────┴───────────────────────────────────┘
```

**Layout Considerations:**
- Minimum window size: 1280×720 (laptop standard)
- Optimal size: 1920×1080 (desktop standard)
- Split pane defaults to 50/50 but remembers user preference
- Both panes scrollable independently
- No mobile/responsive layout (desktop-only tool)

### 2.2 Toolbar Sections

**Left Section (Identity & File Management):**
```
[☰] [Logo] "markframe" | [Open] [Save] [Close] filename.mf
```
- Menu toggle button (hamburger) shows/hides the editor pane

**Center Section (Preview Controls):**
```
[Phone Icon] Device ▼ | [↻] | [Surface ▼]
```
- Device dropdown grouped by platform and form factor (iOS Phones, iOS Tablets, Android Phones, Android Tablets)
- Orientation toggle icon rotates 90° in landscape mode
- Surface dropdown lists all defined views

**Right Section (Display):**
```
[iOS/Material indicator] | [Zoom −/+/%] | [Shortcuts Help]
```

**Notes:**
- Theme is auto-derived from device platform (iOS devices → iOS theme, Android → Material)
- No manual theme toggle — switching devices automatically switches the theme

### 2.3 Device Selector Dropdown

**Grouping Strategy:**
```
Device Selector ▼
├─ iOS Phones
│  ├─ iPhone 15 Pro (Dynamic Island) ★
│  ├─ iPhone 15 Pro Max (large)
│  ├─ iPhone 16 Pro
│  └─ iPhone 16 Pro Max (large)
├─ iOS Tablets
│  ├─ iPad mini
│  ├─ iPad Pro 11"
│  └─ iPad Pro 12.9"
├─ Android Phones
│  ├─ Google Pixel 7
│  ├─ Google Pixel 9
│  ├─ Google Pixel 9 Pro XL
│  ├─ Samsung Galaxy S23
│  ├─ Samsung Galaxy S24 Ultra
│  ├─ Samsung Galaxy S25 Ultra
│  └─ OnePlus 11
└─ Android Tablets
   ├─ Google Pixel Tablet
   └─ Samsung Galaxy Tab S9
```

**Visual Indicators:**
- Current device shown as selected in dropdown
- Icon changes (phone vs tablet) based on selection
- Default: iPhone 15 Pro (modern, common baseline)

### 2.4 Zoom Controls

**Zoom Levels:**
- 50% - Overview mode, see full device even on small screens
- 75% - Comfortable working size
- 100% - Native size (default)
- 125% - Detail inspection
- 150% - Pixel-perfect design work

**Keyboard Shortcuts:**
- `Cmd/Ctrl + 0` - Reset to 100%
- `Cmd/Ctrl + Plus` - Zoom in
- `Cmd/Ctrl + Minus` - Zoom out

**UI Behavior:**
- Zoom applies to device frame and content
- Maintains centering in preview pane
- Info overlay shows current zoom percentage

### 2.5 The Landing Experience ("Blank State")
When the user visits markframe for the first time or has no file open:

**Visual Hierarchy:**
1. **Background:** Dark slate (`slate-900`)
2. **Centered Card:** Elevated panel
3. **Logo:** App logo image + "markframe" title
4. **Tagline:** "Declarative mobile UI, instantly previewed."
5. **Actions (2 primary buttons):**
   - **New Project** → Opens blueprint picker modal
   - **Open File** → Triggers File System API picker

**Blueprint Picker Modal:**
```
┌─────────────────────────────────────────┐
│  Choose a Blueprint              [X]    │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │ Login Screen                      │  │
│  │ Simple auth form with inputs      │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Dashboard App                  ★  │  │
│  │ Multi-screen with nav             │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Social Feed                       │  │
│  │ Scrollable list with cards        │  │
│  └───────────────────────────────────┘  │
│  ... (12 blueprints)                    │
└─────────────────────────────────────────┘
```

## 3. User Flows

### 3.1 Creating/Opening a Project

**Flow: New Project**
1. User clicks "New Project" button
2. Blueprint picker modal slides up
3. User selects blueprint (or "Blank")
4. Modal closes, editor populates with markframe content
5. Preview renders first view automatically

**Flow: Open Existing File**
1. User clicks "Open" (or `Cmd+O`)
2. Browser File System API picker appears
3. User selects `.mf` file
4. File loads into editor
5. First view auto-selected and rendered
6. Filename displayed in toolbar

**Persistence:**
- Last opened file remembered (future: recent files list)
- Device/orientation/theme persist via localStorage
- Window layout (split ratio) persists

### 3.2 Editing & Live Preview

**Real-Time Update Flow:**
```
User types markframe in editor
     ↓ (keystroke)
Debounce timer starts (200ms)
     ↓ (no more keystrokes)
markframe parsed (tokenize → indent tree → nodes)
     ↓ (validation)
Render tree constructed
     ↓ (if valid)
Preview re-renders
     ↓ (smooth transition)
User sees updated UI

If error:
     ↓ (parse failed)
Red error overlay appears in preview
Error message displayed with line/column
Editor shows red squiggles (future)
Previous valid state preserved
```

**Visual Feedback:**
- Successful update: No flash, seamless render
- Parse error: Red overlay on preview with error message
- Long operations (>500ms): Subtle spinner in toolbar

### 3.3 Switching Views (Multi-Screen Navigation)

**Manual Navigation:**
1. User selects different view from dropdown
2. Preview smoothly transitions (fade or slide)
3. Editor content unchanged (all views in one file)

**Interactive Navigation (Future):**
1. Button in preview has `-> settings` navigation
2. User clicks button in preview
3. Preview navigates to settings view
4. Dropdown updates to reflect new view
5. Validates that navigation logic works

### 3.4 Device Switching

**User Journey:**
```
User on iPhone 15 Pro (393×852)
     ↓
Clicks device dropdown
     ↓
Selects "iPad Pro 12.9"" (1024×1366)
     ↓
Preview animates transition:
  • Frame scales down (was larger than viewport)
  • Dimensions update smoothly
  • Notch disappears (iPads have no notch)
  • Safe areas adjust
     ↓
Info overlay updates: "iPad Pro 12.9" • 1024×1366 • 78%"
     ↓
UI reflows to tablet layout
```

**Considerations:**
- Tablet surfaces often need different layouts (more columns, sidebars)
- Safe areas differ (phones have notches, tablets don't)
- Scale auto-adjusts to fit (large tablets scale down)

### 3.5 Orientation Toggle

**Portrait → Landscape:**
```
User clicks ↻ button (or presses Cmd+R)
     ↓
Icon rotates 90° (CSS transform)
     ↓
Device dimensions swap:
  • iPhone 15 Pro: 393×852 → 852×393
  • Dynamic Island moves from top to left
  • Safe areas rotate
     ↓
Frame animates smoothly (300ms transition)
     ↓
Content reflows to landscape layout
```

**Use Cases:**
- Video players (always landscape)
- Games (often landscape-only)
- Tablets (common to use in landscape)
- Testing responsive layouts

### 3.6 Theming (Auto-Derived from Device)

Theme is automatically set based on the selected device's platform. Selecting an iOS device applies the iOS theme; selecting an Android device applies the Material theme. There is no manual toggle.

**Visual differences between themes:**
```
Visual changes when switching platforms:
  • Buttons: flat → raised with shadow
  • Buttons: rounded → rectangular
  • Navbar: large title → fixed height
  • Navbar: translucent → solid with elevation
  • Inputs: rounded → underlined
  • Cards: subtle shadow → prominent elevation
  • Lists: inset/grouped → full-width
     ↓
Transition: instant, no animation needed
```

**Platform-Specific Traits:**

| Element | iOS Style | Material Style |
|---------|-----------|----------------|
| Buttons | Flat, rounded, system blue | Raised, shadow, rectangular |
| Navbar | Large title, translucent | Fixed, solid, elevated |
| Inputs | Rounded, floating label | Underlined, label above |
| Lists | Inset, grouped | Full-width, divided |
| Cards | Subtle shadow | Prominent elevation |
| Tabs | Segmented control | Underlined tabs |
| Switches | iOS toggle | Material switch |

### 3.7 Exporting (Planned)

> **Status:** Not yet implemented. Export functionality is planned for a future release. See Design.md Section 8 for planned formats (JSON, React Native, HTML).

## 4. Visual Style Guide

### 4.1 Color Palette

**App Shell (Dark Theme):**
```css
--background:     #1e1e1e  /* Main background */
--surface:        #2d2d2d  /* Elevated panels */
--surface-hover:  #383838  /* Hover states */
--border:         #333333  /* Subtle dividers */
--border-hover:   #444444  /* Active borders */

--text-primary:   #ffffff  /* High contrast text */
--text-secondary: #a0a0a0  /* Lower contrast */
--text-disabled:  #666666  /* Disabled state */

--accent-blue:    #3b82f6  /* Primary actions */
--accent-green:   #22c55e  /* Success */
--accent-red:     #ef4444  /* Errors */
--accent-yellow:  #eab308  /* Warnings */
```

**Canvas Background:**
- `#2d2d2d` with subtle dot pattern (Figma-style)
- Dot color: `rgba(136, 136, 136, 0.2)`
- Dot size: 1px
- Grid spacing: 20px

**Device Frame Colors:**
- iOS frames: Black (`#000000`) or dark gray (`#1f2937`)
- Android frames: Varies by device (black, dark gray, slate)
- Border: Dark gray (`#1f2937`) - subtle but visible
- Shadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5)` - realistic depth

### 4.2 Typography

**App UI Font Stack:**
```css
font-family: Inter, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
             'Helvetica Neue', sans-serif;
```

**Code Editor Font Stack:**
```css
font-family: 'Fira Code', 'JetBrains Mono',
             'Consolas', 'Monaco',
             'Courier New', monospace;
```

**Preview Content Fonts:**
- **iOS theme:** San Francisco (system-ui) → `-apple-system, BlinkMacSystemFont`
- **Material theme:** Roboto → `'Roboto', sans-serif` (imported from Google Fonts)

**Font Sizes:**
- Toolbar: 13px (small, compact)
- Editor: 14px (code readability)
- Device info: 11px (subtle overlay)
- Headings: 18-24px (modals, welcome screen)

### 4.3 Iconography

**Toolbar Icons:**
- Source: Lucide React (outlined, consistent stroke)
- Size: 16-18px (compact toolbar)
- Color: `#a0a0a0` (gray)
- Hover: `#ffffff` (white)
- Active: `#3b82f6` (blue)

**Preview Icons:**
- Source: Ionicons (via Konsta UI)
- Size: Varies (16-32px depending on context)
- Follows platform theme (filled on iOS, outlined on Material)

**Icon Usage:**
```typescript
// Toolbar icons (Lucide)
import { FolderOpen, Save, Smartphone, RotateCw } from 'lucide-react';

// Preview icons (markframe)
// Icon "heart"
// → renders as Ionicon heart icon in the preview
```

### 4.4 Shadows & Elevation

**App Shell:**
- No shadows (flat dark theme)
- Borders only for separation

**Device Frame:**
```css
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
/* Simulates physical device on desk */
```

**Modals & Overlays:**
```css
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3),
            0 10px 10px -5px rgba(0, 0, 0, 0.2);
/* Prominent elevation for focus */
```

**Preview Content:**
- Controlled by Konsta UI theme
- iOS: Subtle shadows, translucency
- Material: Prominent elevation, sharp shadows

### 4.5 Animations & Transitions

**Performance First:**
- Only animate properties that don't trigger layout (transform, opacity)
- Use `will-change` sparingly
- Prefer CSS over JS animations

**Timing Functions:**
```css
--ease-out:    cubic-bezier(0.33, 1, 0.68, 1);    /* Snappy */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);       /* Smooth */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55); /* Playful */
```

**Common Animations:**

| Element | Duration | Easing | Property |
|---------|----------|--------|----------|
| Device frame switch | 300ms | ease-smooth | transform, width, height |
| Orientation toggle | 300ms | ease-smooth | transform |
| Theme toggle | 100ms | instant | all components |
| Modal appear | 200ms | ease-out | opacity, transform |
| Button hover | 150ms | ease-out | background, color |
| Tooltip appear | 100ms | ease-out | opacity |

**Device Switch Animation:**
```css
.device-frame {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, width, height;
}
```

**Avoid:**
- Flashing/blinking (accessibility concern)
- Spinning animations longer than 2s (nausea)
- Parallax on scroll (preview is static)

## 5. Mobile Simulation Details

### 5.1 Device Frame Anatomy

```
┌─────────────────────────────────────┐ ← Device bezel (4-6px border)
│  ┌───────────────────────────────┐  │
│  │ 🔊 12:34 PM 📶 📶 📶 🔋      │  │ ← Status bar (safe area top)
│  │═══════════════════════════════│  │ ← Dynamic Island / Notch
│  │                               │  │
│  │         CONTENT               │  │ ← Scrollable area
│  │         (Konsta UI)           │  │
│  │                               │  │
│  │                               │  │
│  │                               │  │
│  │                               │  │
│  │───────────────────────────────│  │ ← Home indicator (safe area bottom)
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Safe Area Insets (iOS Phones):**
- Top: 59px (status bar + Dynamic Island)
- Bottom: 20px (home indicator; Konsta adds additional padding)
- Sides: 0px (full width allowed)

**Safe Area Insets (Android Phones):**
- Top: 24px (status bar)
- Bottom: 0px (gesture navigation, no visible bar)
- Sides: 0px

**Tablets:**
- Top: 24px (status bar only, no notch)
- Bottom: 10px (home indicator; Konsta adds additional padding)

### 5.2 Scrolling Behavior

**Preview Content:**
- Entire Page component scrolls
- Navbar fixed at top (Konsta default)
- Toolbar/Tabbar fixed at bottom (if present)
- Smooth scroll with momentum (native feel)
- **Scrollbars:** Hidden to simulate mobile environment

**Editor:**
- Monaco handles scrolling
- Minimap provides quick navigation
- Scroll position persists during edits

### 5.3 Touch Interaction Simulation

**Interactions:**
- **Drag-to-Scroll:** The preview area supports "grab and drag" scrolling, mimicking mobile touch behavior on desktop.
- **Bounce Effects:**
    - **iOS:** Rubber-band bounce effect at scroll boundaries (supported on macOS/some browsers).
    - **Android:** Native-like overscroll behavior.
- **Cursor:**
    - Default: `grab` (open hand)
    - Active Drag: `grabbing` (closed hand)
- **Text Selection:** Disabled within the device frame to prevent accidental selection during drag interactions.
- **Tap Highlight:** Disabled (`-webkit-tap-highlight-color: transparent`) for a cleaner app-like feel.

**Planned Features:**
- Cursor changes to touch circle (24px diameter) when hovering preview
- Long press shows context menu (future)
- Swipe gestures for navigation (future)

**Current MVP:**
- Drag-to-scroll emulation enabled
- Click events work for debugging
- Focus on visual accuracy and scrolling feel

## 6. Keyboard Shortcuts

### 6.1 General

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + O` | Open project |
| `Cmd/Ctrl + S` | Save project |
| `Cmd/Ctrl + ?` | Show keyboard shortcuts |

### 6.2 View Controls

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + R` | Toggle portrait/landscape |
| `Cmd/Ctrl + I` | Toggle device info overlay |
| `Cmd/Ctrl + 0` | Reset zoom to 100% |
| `Cmd/Ctrl + Plus` | Zoom in |
| `Cmd/Ctrl + Minus` | Zoom out |

### 6.3 Navigation

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + 1-9` | Select device by number |
| `Cmd/Ctrl + ]` | Next device |
| `Cmd/Ctrl + [` | Previous device |
| `Cmd/Ctrl + Shift + ]` | Next blueprint |
| `Cmd/Ctrl + Shift + [` | Previous blueprint |

### 6.4 Editing

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + E` | Focus editor |
| `Cmd/Ctrl + F` | Find (Monaco) |
| `Cmd/Ctrl + H` | Replace (Monaco) |
| `Cmd/Ctrl + Z` | Undo (Monaco) |
| `Cmd/Ctrl + Shift + Z` | Redo (Monaco) |

**Help Dialog:**
- Press `Cmd/Ctrl + ?` to show full shortcuts overlay
- Escape key to dismiss
- Platform-aware (shows Cmd on Mac, Ctrl on Windows)

## 7. Error States & Feedback

### 7.1 Parse Errors

**markframe Syntax Error:**
```
┌─────────────────────────────────┐
│  ⚠️  Parsing Error             │
│                                 │
│  Unknown component "Buton" at   │
│  line 3. Did you mean "Button"? │
│                                 │
│  > 3 |   Buton "OK"            │
│            ^^^^^                │
└─────────────────────────────────┘
```

**Indentation Error:**
```
┌─────────────────────────────────┐
│  ⚠️  Parsing Error             │
│                                 │
│  Unexpected indentation at      │
│  line 5. Expected 2 or 4        │
│  spaces, got 3.                 │
│                                 │
│  > 5 |    Text "Hello"         │
│         ^^^                     │
└─────────────────────────────────┘
```

**Visual Treatment:**
- Red overlay on preview (80% opacity black + red border)
- Error message in monospace font
- Line/column number highlighted
- Previous valid state preserved (no blank screen)
- Editor shows red squiggles at error location (future)

### 7.2 Validation Warnings

**Missing Required Props:**
```
⚠️ Warning: "Button" at line 42 has no label or children.
```

**Unknown Props:**
```
⚠️ Warning: "Button" at line 15 has unknown prop "colour".
   Did you mean "color"?
```

**Visual Treatment:**
- Yellow warning banner below toolbar
- Dismissible (but persists on page reload)
- Non-blocking (preview still renders)

### 7.3 Success States

**File Saved:**
```
✓ Saved dashboard.mf
```

**Export Complete:**
```
✓ Exported to dashboard.jsx
```

**Visual Treatment:**
- Green toast notification (top-right)
- Auto-dismiss after 3 seconds
- Subtle slide-in animation

### 7.4 Loading States

**File Opening:**
- Spinner in toolbar (right side)
- "Loading..." text
- Disabled interactions

**Large File Parse:**
- Progress bar (if >1000 components)
- "Parsing 1,234 components..."

## 8. Accessibility (WCAG AA)

### 8.1 Color Contrast

All text meets WCAG AA standards:
- White on `#1e1e1e`: 15.3:1 (AAA) ✓
- Gray `#a0a0a0` on `#1e1e1e`: 4.7:1 (AA) ✓
- Blue `#3b82f6` on `#1e1e1e`: 5.1:1 (AA) ✓
- Red `#ef4444` on black: 5.5:1 (AA) ✓

### 8.2 Keyboard Navigation

- All interactive elements focusable
- Visible focus indicators (blue outline)
- Tab order follows visual layout
- Escape dismisses modals
- Enter activates buttons
- Arrow keys navigate dropdowns

### 8.3 Screen Readers

**ARIA Labels:**
```html
<button aria-label="Toggle orientation (portrait to landscape)">
  <RotateCw />
</button>

<select aria-label="Select device">
  <optgroup label="iOS Phones">...</optgroup>
</select>
```

**Live Regions:**
```html
<div role="status" aria-live="polite">
  File saved successfully
</div>
```

### 8.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 9. Responsive Breakpoints (App Shell Only)

**Target:** Desktop-only tool (no mobile support)

**Minimum Supported:**
- 1280×720 (small laptop)
- Both panes visible at all times

**Graceful Degradation:**
- Below 1280px: Show "Use wider screen" message
- Below 1024px: Preview-only mode (editor hidden, view-only)
- Mobile browsers: Show "Desktop recommended" with QR code to share

## 10. Future UI Enhancements

### 10.1 Component Inspector (Post-MVP)
- Click any component in preview to select
- Right panel shows editable props
- Live updates as you type

### 10.2 Drag-and-Drop (Post-MVP)
- Drag components from palette
- Drop onto preview to place
- markframe updates automatically

### 10.3 Exploded View (Post-MVP)
- 2D node-link diagram
- Shows component hierarchy
- Click to navigate to code
- Zoom/pan controls

### 10.4 Collaboration (Post-MVP)
- Real-time cursors
- Presence indicators
- Shared viewport
- Comments/annotations

---

**Document Version:** 3.1
**Last Updated:** 2026-02-14
**Status:** Specifications complete, markframe implemented

