# Markframe Language Specification (v0.1)

markframe is a DSL for describing mobile user interfaces. It replaces verbose JSON adjacency lists with a minimal, readable format where hierarchy is expressed through indentation and IDs are auto-generated.

**Design Goals:**
- **Readable** — A login screen is 6 lines, not 62
- **Hierarchical** — Indentation = parent-child, no manual ID wiring
- **Terse** — Primary props via positional strings, boolean flags as bare words
- **AI-friendly** — Easy for LLMs to generate and humans to review

---

## 1. Syntax Overview

### 1.1 Minimal Example

```markframe
view login
  Navbar "Login"
  Text "Welcome Back" variant=title
  TextField "Email" type=email
  TextField "Password" type=password
  Button "Sign In"
```

This produces a single screen with a navbar, title text, two input fields, and a button.

### 1.2 File Extension

`.mf`

### 1.3 Encoding

UTF-8. Lines terminated by `\n` or `\r\n`.

---

## 2. Core Syntax Rules

### 2.1 Views

Views are top-level screens declared at column 0:

```markframe
view <id> [label="Display Name"]
```

- `<id>` — A kebab-case identifier (e.g., `home`, `product-detail`, `user-profile`)
- `label` — Optional display name shown in the surface selector. If omitted, the ID is used.

```markframe
view home label="Home Screen"
  Navbar "Home"
  Text "Welcome!"
```

### 2.2 Multi-View Files

Multiple views are separated by `---` on its own line:

```markframe
view home
  Navbar "Home"
  Text "Welcome!"

---

view settings
  Navbar "Settings"
  List
    ListItem "Account"
    ListItem "Privacy"
```

### 2.3 Components

Components are PascalCase names indented under a view or parent component:

```markframe
Button "Sign In"
Card "Welcome"
  Text "Hello world"
```

### 2.4 Indentation

- **2 spaces** per level (tabs are not allowed)
- Each indentation level makes the component a child of the nearest less-indented component above it

```markframe
view home
  List                    // child of view
    ListItem "Item 1"     // child of List
    ListItem "Item 2"     // child of List
  Button "Done"           // child of view (back to 2-space indent)
```

### 2.5 Comments

Line comments start with `//`:

```markframe
view home
  // Navigation bar
  Navbar "Home"
  // Main content
  Text "Hello"
```

Comments must be on their own line. Inline comments after component declarations are not supported.

### 2.6 Blank Lines

Blank lines are ignored and can be used freely for readability:

```markframe
view home
  Navbar "Home"

  Text "Section 1" variant=title
  Text "Some content"

  Text "Section 2" variant=title
  Text "More content"
```

---

## 3. Props

### 3.1 Primary Prop (Positional)

The first quoted string after a component name maps to that component's **primary prop**. This avoids repetitive `label=` or `title=` for the most common property.

```markframe
Button "Sign In"          // → { label: "Sign In" }
Navbar "Home"             // → { title: "Home" }
Text "Hello World"        // → { text: "Hello World" }
TextField "Email"         // → { label: "Email" }
```

For `Spacer`, the primary prop is a bare number:

```markframe
Spacer 16                 // → { size: 16 }
```

See Section 5 for the complete primary prop mapping table.

### 3.2 Named Props

Named props follow the primary prop using `key=value` syntax:

```markframe
Button "Sign In" variant=outline color=primary
TextField "Email" type=email placeholder="user@example.com"
```

### 3.3 Prop Value Types

| Syntax | Type | Example |
|--------|------|---------|
| `"text"` | String | `title="Hello World"` |
| `123` | Number | `gap=8` |
| `true` / `false` | Explicit boolean | `checked=false` |
| bare word flag | Boolean `true` | `checked`, `raised`, `outline` |
| `[a, b, c]` | Array of strings | `options=[Day, Week, Month]` |

**String values:** Use quotes for strings containing spaces. Unquoted single-word values are also valid strings for named props:

```markframe
Button "OK" variant=outline      // variant is string "outline"
Button "OK" variant="outline"    // equivalent
Text "Hello" color="red"         // string "red"
```

**Boolean flags:** A bare word that isn't a `key=value` pair is treated as a boolean `true` flag:

```markframe
Button "Delete" destructive      // → { destructive: true }
ListItem "Settings" chevron link // → { chevron: true, link: true }
Switch "Wi-Fi" checked           // → { checked: true }
```

**Arrays:** Square brackets with comma-separated values:

```markframe
Segmented options=[Day, Week, Month] active=0
```

---

## 4. Navigation

### 4.1 Push Navigation

Use `->` at the end of a component line to indicate push navigation to another view:

```markframe
Button "View Details" -> product-detail
ListItem "Settings" chevron link -> settings
```

### 4.2 Back Navigation

Use `backButton` on a Navbar to show a back arrow. Combine with `->` to specify the destination:

```markframe
Navbar "Product Details" backButton -> shop
```

### 4.3 App Block (Persistent Components)

An optional `app` block defines app-level UI elements that should appear on every screen, like a tab bar, a side navigation panel, or a persistent toast. Without `app`, you'd need to manually repeat these components in each `view`.

Components inside `app` are automatically included in every view's render tree. The most common use case is a `tabbar` with `tab` children for tab navigation, but `app` supports any component type: `Panel`, `Toast`, `Sheet`, etc.

**Tab navigation:**

```markframe
app
  tabbar
    tab "Home" icon=home -> home
    tab "Search" icon=search -> search
    tab "Cart" icon=cart -> cart
    tab "Profile" icon=person -> profile

---

view home
  Navbar "Home"
  Text "Welcome!"

---

view search
  Navbar "Search"
  TextField "Search..." type=search

---

view cart
  Navbar "Cart"
  Text "Your cart is empty"

---

view profile
  Navbar "Profile"
  Text "User Profile"
```

**Mixed app-level components:**

```markframe
app
  Panel side=left
    List
      ListItem "Home" -> home
      ListItem "Settings" -> settings
  tabbar
    tab "Home" icon=home -> home
    tab "Settings" icon=settings -> settings

---

view home
  Navbar "Home"
  Text "Welcome!"
```

In this example, both the `Panel` and `Tabbar` are injected into every view. The `tabbar`/`tab` keywords (lowercase) are aliases for `Tabbar`/`Tab` component types when used inside an `app` block.

**Notes:**
- App-level components are deep-cloned per view, so each view gets its own copy with unique IDs
- For `Tabbar`, the active tab is auto-detected based on which tab's `-> target` matches the current view ID
- An empty `app` block (with no children) does not inject anything

### 4.4 Overlays

Overlays (Sheet, Popup, Dialog, Actions) are declared inline within a view. They are hidden by default and can be shown in two ways:

1. **Static preview** — Use the `opened` flag to always show the overlay (useful for design preview)
2. **Interactive** — Give the overlay an `id` prop and use `->` from a trigger component to open it on tap

**Static (always visible):**
```markframe
Sheet "Options" opened
  List
    ListItem "Share"
    ListItem "Copy Link"
```

**Interactive (opened on tap):**
```markframe
List
  ListItem "Open Sheet" chevron link -> my-sheet
  ListItem "Open Dialog" chevron link -> my-dialog

Sheet "Options" id=my-sheet
  List
    ListItem "Share"
    ListItem "Copy Link"

Dialog "Confirm?" content="Are you sure?" id=my-dialog
  DialogButton "Cancel"
  DialogButton "OK"
```

The `->` navigation syntax works for both views and overlays. When the target matches a view ID, it navigates to that view. When it matches an overlay `id`, it opens that overlay.

**Dialog:**
```markframe
Dialog "Confirm Delete" content="This action cannot be undone."
  DialogButton "Cancel"
  DialogButton "Delete" destructive
```

**Actions (Action Sheet):**
```markframe
Actions "Share Photo" opened
  ActionsGroup
    ActionsButton "Share to Feed"
    ActionsButton "Send as Message"
    ActionsButton "Copy Link"
  ActionsGroup
    ActionsButton "Cancel" bold
```

**Popup:**
```markframe
Popup "Edit Profile" opened
  Navbar "Edit Profile"
  List
    TextField "Name" value="John"
    TextField "Bio" value="Hello!"
  Button "Save"
```

---

## 5. Primary Prop Mapping

Every component has a designated primary prop that receives the first positional string (or number for Spacer).

| Component | Primary Prop | Example | Result |
|-----------|-------------|---------|--------|
| `Navbar` | `title` | `Navbar "Home"` | `{ title: "Home" }` |
| `Text` | `text` | `Text "Hello"` | `{ text: "Hello" }` |
| `Button` | `label` | `Button "OK"` | `{ label: "OK" }` |
| `TextField` | `label` | `TextField "Email"` | `{ label: "Email" }` |
| `Card` | `title` | `Card "Welcome"` | `{ title: "Welcome" }` |
| `ListItem` | `title` | `ListItem "Settings"` | `{ title: "Settings" }` |
| `Icon` | `name` | `Icon "heart"` | `{ name: "heart" }` |
| `Chip` | `text` | `Chip "Active"` | `{ text: "Active" }` |
| `Badge` | `text` | `Badge "3"` | `{ text: "3" }` |
| `Link` | `text` | `Link "View All"` | `{ text: "View All" }` |
| `Checkbox` | `label` | `Checkbox "Agree"` | `{ label: "Agree" }` |
| `Radio` | `label` | `Radio "Option A"` | `{ label: "Option A" }` |
| `Switch` | `label` | `Switch "Notifications"` | `{ label: "Notifications" }` |
| `Toggle` | `label` | `Toggle "Dark Mode"` | `{ label: "Dark Mode" }` |
| `Dialog` | `title` | `Dialog "Confirm"` | `{ title: "Confirm" }` |
| `Popup` | `title` | `Popup "Edit"` | `{ title: "Edit" }` |
| `Actions` | `title` | `Actions "Options"` | `{ title: "Options" }` |
| `Fab` | `icon` | `Fab "add"` | `{ icon: "add" }` |
| `Spacer` | `size` | `Spacer 16` | `{ size: 16 }` |
| `Block` | `text` | `Block "Info"` | `{ text: "Info" }` |
| `Image` | `src` | `Image "https://..."` | `{ src: "https://..." }` |
| `Sheet` | `title` | `Sheet "Options"` | `{ title: "Options" }` |
| `DialogButton` | `label` | `DialogButton "OK"` | `{ label: "OK" }` |
| `ActionsButton` | `label` | `ActionsButton "Share"` | `{ label: "Share" }` |
| `ProgressBar` | `value` | `ProgressBar 84` | `{ value: 84 }` |
| `Grid` | `cols` | `Grid 3` | `{ cols: 3 }` |
| `Avatar` | `src` | `Avatar "https://..."` | `{ src: "https://..." }` |
| `Message` | `text` | `Message "Hello"` | `{ text: "Hello" }` |
| `MediaCard` | `title` | `MediaCard "Name"` | `{ title: "Name" }` |
| `Stat` | `value` | `Stat "8,432"` | `{ value: "8,432" }` |
| `Post` | `text` | `Post "Hello"` | `{ text: "Hello" }` |
| `IconCircle` | `icon` | `IconCircle "heart"` | `{ icon: "heart" }` |
| `Story` | `label` | `Story "alice"` | `{ label: "alice" }` |
| `Stepper` | `value` | `Stepper 3` | `{ value: 3 }` |
| `Range` | `value` | `Range 50` | `{ value: 50 }` |
| `Toast` | `text` | `Toast "Saved!"` | `{ text: "Saved!" }` |

**Components with no primary prop** (use only named props or children):

`Row`, `Column`, `List`, `ListGroup`, `Divider`, `ListDivider`, `Toolbar`, `Tabbar`, `Tabs`, `Segmented`, `ActionsGroup`, `Center`, `StoryRow`, `Preloader`

---

## 6. Complete Component Reference

### 6.1 Layout Components

#### `view` (Surface)

Top-level screen container. Declared at column 0.

| Prop | Type | Description |
|------|------|-------------|
| `id` | string | **Required.** Positional after `view` keyword. |
| `label` | string | Display name in surface selector. |
| `noApp` | flag | Prevent injection of `app` block components (e.g., Tabbar). |

```markframe
view home label="Home Screen"
  Navbar "Home"
  Text "Content here"
```

#### `Row`

Horizontal flex container.

| Prop | Type | Description |
|------|------|-------------|
| `gap` | number | Gap between children (px). |
| `align` | string | Align items: `start`, `center`, `end`, `stretch`. |
| `justify` | string | Justify content: `start`, `center`, `end`, `between`, `around`. |
| `scroll` | flag | Enable horizontal scrolling (prevents wrapping and shrinking). |
| `p` | number | Padding (Tailwind scale). |
| `px` | number | Horizontal padding (Tailwind scale). |
| `py` | number | Vertical padding (Tailwind scale). |
| `pt` | number | Top padding (Tailwind scale). |
| `pb` | number | Bottom padding (Tailwind scale). |
| `pl` | number | Left padding (Tailwind scale). |
| `pr` | number | Right padding (Tailwind scale). |
| `mx` | number | Horizontal margin (Tailwind scale). |
| `fill` | flag | Fill available space (`flex-1`). |
| `mt` | number | Margin-top in Tailwind units. |
| `mb` | number | Margin-bottom in Tailwind units. |
| `borderTop` | flag | Add top border. |
| `borderBottom` | flag | Add bottom border. |
| `className` | string | Custom CSS classes. |

```markframe
Row gap=8 justify=between
  Button "Cancel" variant=outline
  Button "Save"

// Horizontal scrolling list
Row gap=12 scroll
  Card "Item 1"
  Card "Item 2"
  Card "Item 3"
```

#### `Column`

Vertical flex container.

| Prop | Type | Description |
|------|------|-------------|
| `gap` | number | Gap between children (px). |
| `align` | string | Align items: `start`, `center`, `end`, `stretch`. |
| `p` | number | Padding (Tailwind scale). |
| `px` | number | Horizontal padding (Tailwind scale). |
| `py` | number | Vertical padding (Tailwind scale). |
| `pt` | number | Top padding (Tailwind scale). |
| `pb` | number | Bottom padding (Tailwind scale). |
| `pl` | number | Left padding (Tailwind scale). |
| `pr` | number | Right padding (Tailwind scale). |
| `mx` | number | Horizontal margin (Tailwind scale). |
| `fill` | flag | Fill available space (`flex-1`). |
| `mt` | number | Margin-top in Tailwind units. |
| `mb` | number | Margin-bottom in Tailwind units. |
| `className` | string | Custom CSS classes. |

```markframe
Column gap=16
  Text "Title" variant=title
  Text "Description"
```

#### `Block`

Content block with padding.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | | **Primary.** Block text content. |
| `variant` | string | | `title` for BlockTitle, `header` for BlockHeader, `footer` for BlockFooter. |
| `inset` | flag | `false` | Inset style (with side margins). |
| `strong` | flag | `false` | Strong visual emphasis. |
| `outline` | flag | `false` | Outlined style. |
| `align` | string | | Align items: `start`, `center`, `end`, `stretch`. |
| `justify` | string | | Justify content: `start`, `center`, `end`, `between`, `around`. |
| `bg` | string | | Background color (Tailwind name, e.g., `gray-100`). |
| `p` | number | | Padding override (Tailwind scale: 0-8). |
| `px` | number | | Horizontal padding override (Tailwind scale). |
| `py` | number | | Vertical padding override (Tailwind scale). |
| `pt` | number | | Top padding override (Tailwind scale). |
| `pb` | number | | Bottom padding override (Tailwind scale). |
| `pl` | number | | Left padding override (Tailwind scale). |
| `pr` | number | | Right padding override (Tailwind scale). |
| `mx` | number | | Horizontal margin override (Tailwind scale). |
| `width` | number/string | | Width (number=px, string=CSS value). |
| `height` | number/string | | Height (number=px, string=CSS value). |
| `flush` | flag | `false` | Remove all Konsta spacing (`!p-0 !m-0`). |
| `rounded` | flag | `false` | Rounded corners (`rounded-lg`). |
| `border` | flag | `false` | Add border. |
| `fill` | flag | `false` | Fill available space (`flex-1`). |
| `mt` | number | | Margin-top in Tailwind units. |
| `mb` | number | | Margin-bottom in Tailwind units. |
| `borderTop` | flag | `false` | Add top border. |
| `borderBottom` | flag | `false` | Add bottom border. |
| `className` | string | | Custom CSS classes. |

```markframe
Block "Account Settings" variant=title
Block strong inset align=center
  Text "Your profile information is visible to other users."
```

#### `Divider`

Horizontal visual separator.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | number/string | `100%` | Width (number=px, string=CSS value). |
| `spacing` | number | 16 | Vertical margin in pixels. |
| `thickness` | number | 1 | Line thickness in pixels. |
| `color` | string | `gray` | Color (`gray`, `primary`, `red`, `green`). |
| `inset` | flag | `false` | Left margin for inset style. |

```markframe
Divider
Divider width=48 spacing=4
```

#### `Spacer`

Vertical spacing.

| Prop | Type | Description |
|------|------|-------------|
| `size` | number | **Primary.** Height in pixels. |

```markframe
Spacer 24
```

#### `ListDivider`

Divider within a List context.

```markframe
List
  ListItem "Item 1"
  ListDivider
  ListItem "Item 2"
```

### 6.2 Navigation Components

#### `Navbar`

Top navigation bar.

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | **Primary.** Navigation bar title. |
| `subtitle` | string | Smaller text below title. |
| `backButton` | flag | Show back arrow. |
| `transparent` | flag | Transparent background. |
| `className` | string | Custom CSS classes. |

```markframe
Navbar "Product Details" backButton -> shop
Navbar "Home" subtitle="Welcome back"
```

#### `Toolbar`

Bottom toolbar with action buttons.

| Prop | Type | Description |
|------|------|-------------|
| `position` | string | `top` or `bottom` (default: `bottom`). |
| `className` | string | Custom CSS classes. |

```markframe
Toolbar
  Link "Edit"
  Link "Share"
  Link "Delete"
```

#### `Tabbar`

Bottom tab navigation bar.

The active tab is **auto-detected** based on the current view. When the tabbar is injected into a view, the tab whose `-> target` matches the view's ID is automatically highlighted. No manual `active` prop is needed.

| Prop | Type | Description |
|------|------|-------------|
| `className` | string | Custom CSS classes. |

```markframe
Tabbar
  Tab "Home" icon=home -> home
  Tab "Profile" icon=person -> profile
```

#### `Tabs`

Horizontal switchable tab content areas. Tab labels can be defined either using child `Tab` components or via the `tabs` array prop.

| Prop | Type | Description |
|------|------|-------------|
| `active` | number | Index of the active tab (0-based). |
| `tabs` | array | Tab labels (alternative to child Tab components). |
| `className` | string | Custom CSS classes. |

```markframe
// Using child Tab components (preferred)
Tabs active=0
  Tab "Posts"
  Tab "Replies"
  Tab "Media"

// Using tabs array prop
Tabs tabs=[Posts, Replies, Media] active=0
```

#### `Segmented`

iOS-style segmented control.

> **Note:** This component includes default vertical and horizontal margins (`my-4 mx-4`) to ensure proper spacing from screen edges. You can override this using `className` with `!m-0` if needed.

| Prop | Type | Description |
|------|------|-------------|
| `options` | array | Segment labels. |
| `active` | number | Active segment index (0-based). |
| `strong` | flag | Strong visual style. |
| `rounded` | flag | Rounded pill style. |
| `fill` | flag | Fill available space (`flex-1`). |
| `mt` | number | Margin-top override (Tailwind units). |
| `mb` | number | Margin-bottom override (Tailwind units). |
| `width` | number/string | Width (number=px, string=CSS value). |
| `className` | string | Custom CSS classes. |

```markframe
Segmented options=[Day, Week, Month] active=0 strong rounded
```

#### `Link`

Navigation or action link.

| Prop | Type | Description |
|------|------|-------------|
| `text` | string | **Primary.** Link text. |
| `navbar` | flag | Styled for use inside Navbar. |
| `toolbar` | flag | Styled for use inside Toolbar. |
| `tabbar` | flag | Styled for use inside Tabbar. |
| `push` | flag | Margin-left auto (push to right). |
| `className` | string | Custom CSS classes. |

```markframe
Link "View All" -> all-items
```

### 6.3 Form Components

#### `Button`

Tappable action button.

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | **Primary.** Button text. |
| `variant` | string | `outline`, `clear`, `fill` (default), `tonal`. |
| `color` | string | Color name (e.g., `primary`, `red`, `green`). |
| `raised` | flag | Elevated with shadow. |
| `rounded` | flag | Pill-shaped corners. |
| `small` | flag | Compact size. |
| `large` | flag | Larger size. |
| `disabled` | flag | Non-interactive. |
| `fill` | flag | Flex-1 on wrapper (fill available width). |
| `push` | flag | Margin-left auto (push to right). |
| `mt` | number | Margin-top in Tailwind units. |
| `mb` | number | Margin-bottom in Tailwind units. |
| `className` | string | Custom CSS classes. |

```markframe
Button "Sign In"
Button "Cancel" variant=outline
Button "Delete" color=red
Button "Add to Cart" raised rounded
```

#### `TextField`

Text input field.

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | **Primary.** Input label. |
| `placeholder` | string | Placeholder text. |
| `type` | string | `text`, `email`, `password`, `number`, `tel`, `url`, `search`. |
| `value` | string | Pre-filled value. |
| `disabled` | flag | Non-editable. |
| `readonly` | flag | Read-only. |
| `required` | flag | Required field indicator. |
| `fill` | flag | Fill available space (`flex-1`). |
| `mt` | number | Margin-top in Tailwind units. |
| `mb` | number | Margin-bottom in Tailwind units. |
| `className` | string | Custom CSS classes. |

```markframe
TextField "Email" type=email placeholder="user@example.com"
TextField "Password" type=password
TextField "Phone" type=tel value="+1 555-0123"
```

#### `Checkbox`

Boolean checkbox input.

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | **Primary.** Checkbox label. |
| `checked` | flag | Initially checked. |
| `disabled` | flag | Non-interactive. |
| `className` | string | Custom CSS classes. |

```markframe
Checkbox "I agree to the terms" checked
Checkbox "Subscribe to newsletter"
```

#### `Radio`

Radio button (use multiple in a group).

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | **Primary.** Radio label. |
| `checked` | flag | Initially selected. |
| `name` | string | Group name (radios with same name are mutually exclusive). |
| `disabled` | flag | Non-interactive. |
| `className` | string | Custom CSS classes. |

```markframe
Radio "Small" name=size checked
Radio "Medium" name=size
Radio "Large" name=size
```

#### `Switch`

iOS-style toggle switch.

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | **Primary.** Switch label. |
| `checked` | flag | Initially on. |
| `disabled` | flag | Non-interactive. |
| `className` | string | Custom CSS classes. |

```markframe
Switch "Notifications" checked
Switch "Location Services"
```

#### `Toggle`

Material-style toggle.

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | **Primary.** Toggle label. |
| `checked` | flag | Initially on. |
| `disabled` | flag | Non-interactive. |
| `className` | string | Custom CSS classes. |

```markframe
Toggle "Dark Mode" checked
Toggle "Auto-Update"
```

### 6.4 Content Components

#### `Text`

Text display element. The `title` and `header` variants render as section headers with vertical margins. All other variants (`body`, `caption`, `subtitle`) render as lightweight inline `<div>` elements with no margins — they stack tightly when consecutive, which is ideal for labels and descriptions.

| Prop | Type | Description |
|------|------|-------------|
| `text` | string | **Primary.** Text content. |
| `variant` | string | `title`, `body`, `caption`, `subtitle`. |
| `color` | string | Text color. |
| `bold` | flag | Bold weight (`font-bold`). Alias: `strong`. |
| `semibold` | flag | Semibold weight (`font-semibold`). |
| `size` | string or number | Named: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`–`6xl`. Numeric: pixel value (e.g., `24`). |
| `align` | string | Text alignment: `left`, `center`, `right`. |
| `mono` | flag | Monospace font (`font-mono`). |
| `className` | string | Custom CSS classes. |

**Usage notes:**
- Use `variant=title` only for **section headers** (e.g., "Settings", "Daily Goal"). It adds top/bottom margins for visual separation.
- For **data values** (numbers, prices, stats), use `bold size=xl` or similar — NOT `variant=title`.
- Consecutive non-title Text elements stack tightly with no gap. Use `Spacer` or wrap in `Column gap=N` for spacing.
- Text elements should be inside a `Block`, `Card`, `Column`, or `Row` for proper padding. Direct view-level Text (other than titles) has no horizontal padding.

```markframe
// Section header
Text "Welcome Back" variant=title

// Tight label pair (no gap between them)
Text "Please sign in to continue" variant=caption color=gray

// Data value (NOT variant=title)
Text "8,432" bold size=2xl
Text "Steps" variant=caption
```

#### `Card`

Content card container.

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | **Primary.** Card title. |
| `subtitle` | string | Card subtitle. |
| `content` | string | Card body text. |
| `footer` | string | Footer text. |
| `outline` | flag | Outlined style (no shadow). |
| `raised` | flag | Elevated with shadow. |
| `flush` | flag | Remove internal padding and hide overflow. |
| `width` | number | Fixed width in pixels. |
| `shrink` | boolean | Set to `false` to prevent flex shrinking (`shrink-0`). |
| `align` | string | Align items: `start`, `center`, `end`, `stretch`. |
| `justify` | string | Justify content: `start`, `center`, `end`, `between`, `around`. |
| `mt` | number | Margin-top in Tailwind units. |
| `mb` | number | Margin-bottom in Tailwind units. |
| `className` | string | Custom CSS classes. |

```markframe
Card "Today's Stats" subtitle="Dashboard" align=center
  Row gap=8
    Text "Steps: 8,432"
    Text "Calories: 342"
```

#### `List`

List container for ListItem components.

> **CRITICAL:** `ListItem` and `ListDivider` components MUST always be wrapped in a `List` or `ListGroup`. Rendering them as direct children of other components (like `Card` or `view`) will result in incorrect styling (e.g., bullet points) as they are rendered as `<li>` elements and require a `<ul>` or `<ol>` parent.

| Prop | Type | Description |
|------|------|-------------|
| `inset` | flag | Inset style with side margins (default: `true`). |
| `full` | flag | Full-width list (sets `inset=false`). Semantic alias for edge-to-edge lists. |
| `strong` | flag | Strong background. |
| `outline` | flag | Outlined style. |
| `className` | string | Custom CSS classes. |

```markframe
List inset strong outline
  ListItem "Account"
  ListItem "Privacy"
  ListItem "Notifications"

// Full-width (edge-to-edge) list
List full
  ListItem "Item 1"
  ListItem "Item 2"
```

#### `ListItem`

Individual list row. Must be a child of `List` or `ListGroup`.

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | **Primary.** Main text. |
| `subtitle` | string | Secondary text below title. |
| `text` | string | Additional text. |
| `after` | string | Right-side text (e.g., "ON", "5 GB"). |
| `chevron` | flag | Show right chevron arrow. |
| `link` | flag | Styled as tappable link. |
| `header` | flag | Group header style. |
| `media` | string | Left icon name. |
| `className` | string | Custom CSS classes. |

```markframe
ListItem "Wi-Fi" after="Connected" chevron link -> wifi-settings
ListItem "Bluetooth" after="On" chevron link
ListItem "Storage" subtitle="64 GB available" after="128 GB" chevron
```

#### `ListGroup`

Groups list items with a header.

| Prop | Type | Description |
|------|------|-------------|
| `className` | string | Custom CSS classes. |

```markframe
List
  ListGroup
    ListItem "Group Header" header
    ListItem "Item 1"
    ListItem "Item 2"
```

#### `MenuList`

Container for menu items.

| Prop | Type | Description |
|------|------|-------------|
| `outline` | flag | Outlined style. |
| `strong` | flag | Strong background style. |
| `inset` | flag | Inset style. |
| `className` | string | Custom CSS classes. |

```markframe
MenuList outline
  MenuItem "Item 1"
```

#### `MenuItem`

Item within a MenuList.

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | **Primary.** Main text. |
| `media` | string | Icon name or image URL. |
| `subtitle` | string | Secondary text. |
| `active` | flag | Active state. |
| `className` | string | Custom CSS classes. |

```markframe
MenuItem "Settings" media=settings
```

#### `Icon`

Icon display (uses Ionicons library).

| Prop | Type | Description |
|------|------|-------------|
| `name` | string | **Primary.** Ionicon name (e.g., `heart`, `star`, `settings`). Bare or quoted. |
| `size` | number | Icon size in px. |
| `color` | string | Icon color. |
| `push` | flag | Wraps in ml-auto span (push to right). |
| `className` | string | Custom CSS classes. |

```markframe
Icon "heart" color=red
Icon heart color=red           // bare name also works
Icon "star" size=24 color=gold
```

#### `Badge`

Small status indicator.

| Prop | Type | Description |
|------|------|-------------|
| `text` | string | **Primary.** Badge content. |
| `color` | string | Badge color. |
| `className` | string | Custom CSS classes. |

```markframe
Badge "3" color=red
Badge "NEW" color=green
```

#### `Chip`

Compact element for tags, filters, or status.

| Prop | Type | Description |
|------|------|-------------|
| `text` | string | **Primary.** Chip text. |
| `outline` | flag | Outlined style. |
| `color` | string | Chip color. |
| `media` | string | Icon name or image URL to show in chip. |
| `small` | flag | Compact size. |
| `className` | string | Custom CSS classes. |

```markframe
Chip "Running" color=green
Chip "Design" outline
Chip "React" media=logo-react
```

#### `Image`

Image display.

| Prop | Type | Description |
|------|------|-------------|
| `src` | string | **Primary.** Image URL. |
| `alt` | string | Accessibility text. |
| `width` | number | Width in px. |
| `height` | number | Height in px. |
| `circle` | flag | Circular image (rounded-full + aspect-square + object-cover + shrink-0). |
| `rounded` | flag | Rounded corners (`rounded-lg`). |
| `fit` | string | Object fit: `cover`, `contain`, `fill`. |
| `ratio` | string | Aspect ratio: `square`, `video`, or custom like `3/2`. |
| `size` | number | Shorthand for equal width and height. |
| `border` | string | Border color (Tailwind color name, e.g., `pink`). |
| `mt` | number | Margin-top in Tailwind units. |
| `mb` | number | Margin-bottom in Tailwind units. |
| `className` | string | Custom CSS classes. |

**Sizing & Avatars:**
By default, images take up 100% of the available width (`w-full`). To create fixed-size images like avatars, use the `circle` prop or provide `width`/`height` props. The `size` prop is a shorthand for setting both width and height.

```markframe
// Default (Responsive) — using preset keyword
Image "mountains" alt="Banner"

// Raw URL still works
Image "https://picsum.photos/400/200" alt="Banner"

// Category keyword (resolved to local asset)
Image "food" size=200 rounded

// Grid of square images
Image "food" ratio=square fit=cover

// Rounded image with border
Image "ocean" rounded border=blue
```

### 6.5 Overlay Components

#### `Sheet`

Bottom sheet overlay.

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | **Primary.** Sheet title (optional). |
| `id` | string | Overlay ID, targetable via `->` from other components. |
| `opened` | flag | Show in preview. |
| `className` | string | Custom CSS classes. |

```markframe
Sheet "Options" id=my-sheet
  List
    ListItem "Share"
    ListItem "Copy"
    ListItem "Delete" color=danger
```

#### `Popup`

Full-screen or centered modal overlay.

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | **Primary.** Popup title (optional). |
| `id` | string | Overlay ID, targetable via `->` from other components. |
| `opened` | flag | Show in preview. |
| `className` | string | Custom CSS classes. |

```markframe
Popup "Edit Profile" opened
  Navbar "Edit Profile"
  TextField "Name" value="John"
  Button "Save"
```

#### `Dialog`

Alert or confirmation dialog.

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | **Primary.** Dialog title. |
| `content` | string | Dialog body text. |
| `id` | string | Overlay ID, targetable via `->` from other components. |
| `opened` | flag | Show in preview. |
| `className` | string | Custom CSS classes. |

Children can include `DialogButton` components for actions:

```markframe
Dialog "Delete Item?" content="This cannot be undone." opened
  DialogButton "Cancel"
  DialogButton "Delete" destructive
```

#### `Actions`

Action sheet (iOS-style bottom menu).

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | **Primary.** Action sheet title. |
| `id` | string | Overlay ID, targetable via `->` from other components. |
| `opened` | flag | Show in preview. |
| `className` | string | Custom CSS classes. |

Children use `ActionsGroup` and `ActionsButton`:

```markframe
Actions "Photo Options" opened
  ActionsGroup
    ActionsButton "Take Photo"
    ActionsButton "Choose from Library"
  ActionsGroup
    ActionsButton "Cancel" bold
```

#### `Panel`

Side panel or drawer overlay.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | string | `left` | Panel side: `left` or `right`. |
| `size` | string | `w-72` | Panel width (CSS class or width). |
| `opened` | flag | `false` | Show in preview. |
| `floating` | flag | `false` | Floating style. |
| `className` | string | | Custom CSS classes. |

```markframe
Panel "Filters" side=right
  Block "Price Range"
    Checkbox "Under $50"
```

#### `Popover`

Contextual popup anchored to a target element.

| Prop | Type | Description |
|------|------|-------------|
| `target` | string | **Required.** ID of the target element to anchor to. |
| `opened` | flag | Show in preview. |
| `className` | string | Custom CSS classes. |

```markframe
Button "Options" id=btn-opt -> pop-opt
Popover id=pop-opt target=btn-opt
  MenuList
    MenuItem "Edit"
```

#### `Breadcrumbs`

Navigation helper showing hierarchy.

| Prop | Type | Description |
|------|------|-------------|
| `className` | string | Custom CSS classes. |

Children should be `BreadcrumbsItem`.

```markframe
Breadcrumbs
  BreadcrumbsItem "Home"
  BreadcrumbsItem "Catalog"
  BreadcrumbsItem "Shoes" active
```

#### `Searchbar`

iOS/Material style search bar.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | string | `Search` | Placeholder text. |
| `value` | string | | Current value. |
| `disableButton` | flag | `false` | Show cancel button (iOS). |
| `className` | string | | Custom CSS classes. |

```markframe
Searchbar placeholder="Search apps..." disableButton
```

### 6.6 Action Components

#### `Fab`

Floating action button.

| Prop | Type | Description |
|------|------|-------------|
| `icon` | string | **Primary.** Icon name. |
| `position` | string | Fixed position overlay: `right-bottom` (default), `left-bottom`, `right-top`, `left-top`, `center-bottom`, `center-top`. |
| `color` | string | Button color. |
| `text` | string | Extended FAB label text. |
| `className` | string | Custom CSS classes. |

**Positioning Behavior:**
- **With `position`:** The FAB is removed from the document flow and fixed to the specified corner of the view (overlay). It will *not* scroll with the content.
- **Without `position`:** The FAB is rendered inline as a block element and scrolls with the content.

```markframe
// Inline FAB (scrolls with content)
Fab "add"

// Fixed Overlay FAB (stays on screen)
Fab "edit" position=right-bottom color=blue

// Extended FAB
Fab "add" text="New Item" position=right-bottom
```

### 6.7 Enriched Components

#### `ProgressBar`

Progress bar indicator.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | | **Primary.** Progress value (0-100). |
| `max` | number | 100 | Maximum value. |
| `color` | string | `primary` | Bar color. |
| `height` | number | 4 | Bar height in pixels. |
| `rounded` | flag | `true` | Rounded ends. |
| `className` | string | | Custom CSS classes. |

```markframe
ProgressBar 84 color=blue
ProgressBar value=60 color=green height=8
```

#### `Grid`

CSS Grid layout container.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | number | | **Primary.** Number of columns. |
| `rows` | number | | Number of rows (optional). |
| `gap` | number | 4 | Gap between items in pixels. |
| `p` | number | | Padding. |
| `className` | string | | Custom CSS classes. |

```markframe
Grid cols=3 gap=4
  Image "https://picsum.photos/300" ratio=square fit=cover
  Image "https://picsum.photos/301" ratio=square fit=cover
  Image "https://picsum.photos/302" ratio=square fit=cover
```

#### `Avatar`

Circular avatar image. When no `src` is provided, a face is auto-assigned from bundled local assets (deterministic per component instance). Use `gender` to filter the pool.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | *(auto)* | **Primary.** Image URL or path. If omitted, auto-assigned from local pool. |
| `size` | number | 40 | Diameter in pixels. |
| `gender` | string | | Filter pool: `male` or `female`. Only used when `src` is omitted. |
| `border` | string | | Border color (Tailwind color name). |
| `badge` | string | | Badge text (online indicator, count). |
| `placeholder` | string | | Icon name when no image (disables auto-assign). |
| `className` | string | | Custom CSS classes. |

```markframe
Avatar size=48                              // auto-assigned face
Avatar gender=female size=64 border=pink    // random female face
Avatar "https://example.com/custom.jpg" size=48  // explicit URL
Avatar placeholder=person size=40           // icon placeholder, no auto-assign
```

#### `Center`

Centers content horizontally and vertically.

| Prop | Type | Description |
|------|------|-------------|
| `fill` | flag | Fill available space (`flex-1 h-full`). |
| `p` | number | Padding. |
| `className` | string | Custom CSS classes. |

```markframe
Center fill p=8
  Icon "rocket" size=80 color=blue
  Text "Welcome" variant=title
```

#### `Message`

Chat message bubble.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | | **Primary.** Message content. |
| `time` | string | | Timestamp. |
| `sent` | flag | `false` | Sent by current user (right-aligned, colored). |
| `avatar` | flag/string | | Show avatar (auto-assigned) or explicit URL. |
| `color` | string | `green` | Bubble color for sent messages. |
| `read` | flag | `false` | Show read receipts. |
| `className` | string | | Custom CSS classes. |

```markframe
Message "Hey! Are you free?" time="10:30 AM" avatar
Message "Yes, absolutely!" time="10:31 AM" sent read
```

#### `MediaCard`

Card with header image and content.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | | **Primary.** Card title. |
| `subtitle` | string | | Card subtitle. |
| `image` | string | | Header image URL. |
| `imageHeight` | number | 128 | Image section height in pixels. |
| `width` | number | | Fixed card width (for carousels). |
| `footer` | string | | Footer text. |
| `rating` | string/number | | Rating value displayed as pill badge (e.g., `4.3 ★`). |
| `tags` | array | | Array of tag strings shown as outline chips below subtitle. |
| `className` | string | | Custom CSS classes. |

```markframe
MediaCard "Restaurant Name" subtitle="Italian - 4.5 stars" image="https://picsum.photos/400/200" width=264
```

#### `Stat`

Stat display with big number and label.

| Prop | Type | Description |
|------|------|-------------|
| `value` | string | **Primary.** The metric value. |
| `label` | string | Metric label. |
| `icon` | string | Icon name. |
| `color` | string | Accent color for value and icon (Tailwind color name, e.g., `green-300`, `blue-500`). |
| `labelColor` | string | Label text color (Tailwind color name). If not specified, defaults to `gray-500`. |
| `trend` | string | Trend indicator (e.g., `+12.5%`). |
| `className` | string | Custom CSS classes. |

```markframe
Stat "8,432" label="Steps" icon=footsteps color=blue-500
Stat "342" label="Calories" trend="+5.2%"
Stat "+$1,240" label="Since last month" color=green-300 labelColor=white
```

#### `Stepper`

Numeric stepper with increment/decrement buttons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | 0 | **Primary.** Current value. |
| `input` | flag | `false` | Show value input field. |
| `rounded` | flag | `false` | Rounded style. |
| `small` | flag | `false` | Compact size. |
| `large` | flag | `false` | Larger size. |
| `raised` | flag | `false` | Elevated with shadow. |
| `outline` | flag | `false` | Outlined style. |
| `fill` | flag | `false` | Fill available space (`flex-1`). |
| `mt` | number | | Margin-top in Tailwind units. |
| `mb` | number | | Margin-bottom in Tailwind units. |
| `className` | string | | Custom CSS classes. |

```markframe
Stepper 3 input
Stepper 1 rounded outline
```

#### `Range`

Slider input for selecting a numeric value within a range.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | 50 | **Primary.** Current value. |
| `min` | number | 0 | Minimum value. |
| `max` | number | 100 | Maximum value. |
| `step` | number | 1 | Increment step. |
| `disabled` | flag | `false` | Non-interactive. |
| `label` | string | | Optional label text above the slider. |
| `fill` | flag | `false` | Fill available space (`flex-1`). |
| `mt` | number | | Margin-top in Tailwind units. |
| `mb` | number | | Margin-bottom in Tailwind units. |
| `className` | string | | Custom CSS classes. |

```markframe
Range 50 min=0 max=100
Range 75 label="Volume" step=5
```

#### `Toast`

Temporary notification message (snackbar).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | | **Primary.** Toast message. |
| `opened` | flag | `true` | Whether the toast is visible. |
| `position` | string | `left` | Position on wide screens: `left`, `center`, `right`. |
| `className` | string | | Custom CSS classes. |

```markframe
Toast "Item saved successfully!"
Toast "Error occurred" position=center
```

#### `Preloader`

Loading spinner indicator.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | number | 32 | Spinner size in pixels. |
| `className` | string | | Custom CSS classes. |

```markframe
Preloader
Preloader size=48
```

### 6.8 Social Components

#### `Post`

Self-contained social feed post with author, text, optional image, and engagement actions.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | | **Primary.** Post body text. |
| `author` | string | | Author display name. |
| `avatar` | string | | Author avatar URL. |
| `verified` | flag | `false` | Show blue verified badge. |
| `time` | string | | Time label (e.g., "2h", "1d"). |
| `image` | string | | Optional post image URL. |
| `likes` | string | | Like count text. |
| `comments` | string | | Comment count text. |
| `reposts` | string | | Repost count text. |
| `liked` | flag | `false` | Show filled red heart (liked state). |
| `className` | string | | Custom CSS classes. |

```markframe
Post "Hello world!" author="Alice" avatar=alice verified time="2h" likes="42" comments="5"
Post "Great news!" author="Bob" avatar=bob time="1d" image=nature likes="123" liked
```

#### `IconCircle`

Circular icon with background color and optional label caption.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | string | | **Primary.** Ionicon name. Bare or quoted. |
| `label` | string | | Caption text below the circle. |
| `color` | string | `gray` | Icon color. |
| `bg` | string | `{color}-100` | Background color (Tailwind name, e.g., `green-100`). |
| `size` | number | 64 | Circle diameter in px. |
| `iconSize` | number | size×0.5 | Icon size in px. |
| `className` | string | | Custom CSS classes. |

```markframe
IconCircle basket label="Grocery" color=green bg=green-100
IconCircle wine label="Alcohol" color=blue bg=blue-100
```

#### `StoryRow` / `Story`

Horizontal scrollable avatar strip. `StoryRow` is the container; child `Story` nodes define each avatar circle.

**StoryRow props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | number | 64 | Avatar circle diameter. |
| `border` | string | `pink` | Border color for avatar circles. |
| `className` | string | | Custom CSS classes. |

**Story props (child of StoryRow):**

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | **Primary.** Caption text below avatar. |
| `avatar` | string | Avatar image URL. If omitted, auto-assigned from local pool. |
| `add` | flag | Show "+" icon instead of avatar (for "Add Story"). |

```markframe
StoryRow size=64 border=pink
  Story "Your Story" add
  Story "alice"
  Story "bob"
```

Avatars are auto-assigned from local assets. Use `avatar="https://..."` to override with a custom URL.

---

## 7. Embedded Controls

When a `Switch`, `Toggle`, `Checkbox`, or `Radio` is a direct child of a `ListItem`, it is automatically embedded in the list item's "after" slot rather than being rendered as a standalone component below it.

```markframe
List
  ListItem "Wi-Fi"
    Switch checked
  ListItem "Bluetooth"
    Switch
  ListItem "Airplane Mode"
    Switch
```

This renders each switch inline at the right side of the list item, matching native iOS/Android settings patterns.

---

## 8. Custom Styling

### 8.1 className Prop

Any component can accept a `className` prop for custom Tailwind CSS classes:

```markframe
Text "Important" className="text-red-500 font-bold"
Button "Wide" className="w-full"
Card "Highlight" className="bg-yellow-50"
```

### 8.2 color Prop

Many components accept a `color` prop for semantic colors:

```markframe
Button "Delete" color=red
Button "Save" color=green
Chip "Active" color=blue
Badge "3" color=red
```

### 8.3 When to Use className vs Semantic Props

Prefer semantic props over `className` whenever possible. Use `className` only for styling that has no corresponding semantic prop.

**Use semantic props for:**
- Spacing: `mt`, `mb`, `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr`, `mx`
- Text color: `color=white`, `color=blue-100`, `color=white/60`
- Layout: `fill`, `push`, `width`, `height`
- Borders: `border`, `borderTop`, `borderBottom`
- Background: `bg=gray-100`

**Use className for:**
- Gradients: `className="bg-gradient-to-r from-purple-500 to-pink-500"`
- Absolute positioning: `className="absolute bottom-20 left-4"`
- Transforms: `className="rotate-90"`
- Complex multi-property overrides: `className="rounded-full w-8 h-8 flex items-center justify-center"`
- Properties without semantic prop equivalents

```markframe
// BEFORE: className for spacing + color
Block className="py-6"
Text "Hello" className="text-white"
Row className="px-4 pb-2"

// AFTER: Semantic props
Block py=6
Text "Hello" color=white
Row px=4 pb=2
```

### 8.4 Overriding Defaults

Many components (especially `Block`, `Card`, and `List`) come with default margins and paddings to match native platform aesthetics. To override these for custom layouts (like progress bars or dense calendars), use Tailwind's `!` (important) modifier in `className`.

```markframe
// Progress bar without default Block padding
Block className="w-full h-2 bg-gray-200 !p-0 !m-0"
  Block className="h-full w-[40%] bg-blue-500 !p-0 !m-0"
```

---

## 9. Smart Assets (Local)

markframe bundles **local placeholder assets** — avatar photos and category images — so prototypes look realistic without external URLs or network requests.

### 9.1 Avatars (Auto-Assigned)

The `Avatar` component **automatically shows a face** when no `src` is provided. The face is deterministically selected based on the component's position in the tree, so:
- The same Avatar always shows the same face across re-renders
- Two different Avatars on the same screen show different faces

**Pool:** 12 bundled portraits (6 male, 6 female) in `public/assets/avatars/`.

**Gender filtering:** Use `gender=male` or `gender=female` to restrict the pool.

```markframe
Avatar size=48                    // auto-assigned from all 12 faces
Avatar gender=female size=40      // random female face
Avatar gender=male size=64        // random male face
Avatar "https://custom.com/img.jpg" size=48  // explicit URL (no auto-assign)
Avatar placeholder=person size=40  // icon placeholder (no auto-assign)
```

The `Post` and `Message` components also auto-assign avatars. `Post` always shows one; `Message` shows one when the `avatar` flag is set:

```markframe
Post "Hello world!" author="Alice"      // auto-assigned avatar
Message "Hi there!" avatar              // auto-assigned avatar (received)
Message "Reply" sent                    // no avatar (sent messages)
```

### 9.2 Image Categories

The `Image`, `MediaCard`, and other image-accepting components recognize **category keywords** that resolve to bundled local photos:

| Keyword | Description |
|---------|-------------|
| `food` | Food & cooking photos |
| `nature` | Nature & landscapes |
| `city` | Urban & architecture |
| `tech` | Technology & devices |
| `fashion` | Fashion & clothing |
| `travel` | Travel & destinations |

Each category has 2 photos. The specific photo is chosen deterministically based on the component's position.

```markframe
Image "food" rounded           // local food photo
Image "nature" fit=cover       // local nature photo
MediaCard "Lunch" image=food   // local food photo on card
```

### 9.3 Passthrough Behavior

Any string that is **not** a category keyword passes through unchanged. Full URLs and local paths work as before:

```markframe
// Category keyword → local asset
Image "food" rounded

// Full URL → used as-is
Image "https://example.com/photo.jpg" rounded

// Local path → used as-is
Image "/my-custom/photo.jpg" rounded
```

---

## 10. Parser Output Mapping

markframe text is parsed into the `markframeNode` tree structure used by the rendering engine.

### 10.1 Mapping Rules

| markframe Syntax | markframeNode Field |
|---------|----------------|
| `view <id>` | `{ type: "Surface", surfaceId: id, parentId: null }` |
| Component name | `type` field |
| Primary prop | Mapped to the component's primary prop name in `props` |
| Named props | Added to `props` object |
| Boolean flags | Added to `props` as `true` |
| Indentation parent | `parentId` referencing auto-generated parent ID |
| `-> viewId` | `props.navigateTo` |
| `backButton` | `props.backButton: true` |

### 10.2 ID Generation

IDs are auto-generated based on component type and position:

```
view home          → id: "home" (surfaceId is used as id)
  Navbar "Home"    → id: "home-navbar-0"
  List             → id: "home-list-1"
    ListItem "A"   → id: "home-listitem-2"
    ListItem "B"   → id: "home-listitem-3"
```

### 10.3 Example Transformation

**markframe Input:**
```markframe
view login
  Navbar "Login"
  TextField "Email" type=email
  Button "Sign In"
```

**Parsed Output (markframeNode tree):**
```json
[
  { "id": "login", "type": "Surface", "parentId": null, "surfaceId": "login" },
  { "id": "login-navbar-0", "type": "Navbar", "parentId": "login", "props": { "title": "Login" } },
  { "id": "login-textfield-1", "type": "TextField", "parentId": "login", "props": { "label": "Email", "type": "email" } },
  { "id": "login-button-2", "type": "Button", "parentId": "login", "props": { "label": "Sign In" } }
]
```

---

## 11. Complete App Examples

### Example 1: Single View (Simplest Possible)

```markframe
view hello
  Text "Hello, World!" variant=title
```

### Example 2: Login Flow

```markframe
view login label="Sign In"
  Navbar "Welcome"
  Block strong inset
    Text "Sign in to your account" variant=caption

  TextField "Email" type=email placeholder="you@example.com"
  TextField "Password" type=password placeholder="********"

  Block
    Button "Sign In" large rounded
    Spacer 8
    Button "Create Account" variant=outline -> signup

---

view signup label="Create Account"
  Navbar "Sign Up" backButton -> login

  TextField "Full Name" placeholder="Jane Doe"
  TextField "Email" type=email placeholder="you@example.com"
  TextField "Password" type=password placeholder="Min 8 characters"
  TextField "Confirm Password" type=password

  Block
    Checkbox "I agree to the Terms of Service"
    Spacer 16
    Button "Create Account" large rounded
```

### Example 3: Tab-Based App

```markframe
app
  tabbar
    tab "Home" icon=home -> home
    tab "Explore" icon=compass -> explore
    tab "Notifications" icon=notifications -> notifications
    tab "Profile" icon=person -> profile

---

view home
  Navbar "Home"
  Card "Good Morning!" subtitle="Wednesday, Feb 5"
    Text "You have 3 tasks due today."
  Card "Recent Activity"
    List
      ListItem "Meeting at 2pm" subtitle="Conference Room B"
      ListItem "Code Review" subtitle="PR #142"
      ListItem "Deploy v2.1" subtitle="Staging"

---

view explore
  Navbar "Explore"
  TextField "Search..." type=search
  Block "Trending" variant=title
  Block
    Row gap=8
      Chip "Technology"
      Chip "Design"
      Chip "Science"
  List
    ListItem "Top Stories" chevron link
    ListItem "For You" chevron link
    ListItem "Following" chevron link

---

view notifications
  Navbar "Notifications"
  List
    ListItem "New follower" subtitle="@johndoe started following you" after="2m"
    ListItem "Comment" subtitle="Great post!" after="1h"
    ListItem "Like" subtitle="Sarah liked your photo" after="3h"

---

view profile
  Navbar "Profile"
  Block
    Text "Jane Smith" variant=title
    Text "@janesmith" variant=caption
  List inset
    ListItem "Edit Profile" chevron link
    ListItem "Settings" chevron link -> settings
    ListItem "Help" chevron link
```

### Example 4: Settings Screen

```markframe
view settings label="Settings"
  Navbar "Settings"

  List inset strong outline
    ListItem "Wi-Fi" after="Home Network" chevron link
      // Switch embedded in after slot
    ListItem "Bluetooth" after="On" chevron link
    ListItem "Cellular" chevron link
    ListItem "Hotspot" chevron link

  List inset strong outline
    ListItem "Notifications"
      Switch checked
    ListItem "Sounds & Haptics" chevron link
    ListItem "Focus" chevron link
    ListItem "Screen Time" chevron link

  List inset strong outline
    ListItem "General" chevron link
    ListItem "Accessibility" chevron link
    ListItem "Privacy & Security" chevron link

  List inset strong outline
    ListItem "Dark Mode"
      Toggle checked
    ListItem "Text Size" after="Medium" chevron link
    ListItem "Bold Text"
      Switch

  Block "App Settings" variant=title
  List inset strong outline
    ListItem "Language" after="English" chevron link
    ListItem "Region" after="United States" chevron link

  Spacer 32
  Block
    Button "Sign Out" color=red variant=outline
```

### Example 5: E-Commerce App

```markframe
app
  tabbar
    tab "Shop" icon=storefront -> shop
    tab "Cart" icon=cart -> cart
    tab "Account" icon=person -> account

---

view shop
  Navbar "Shop"
  TextField "Search products..." type=search

  Block "Featured" variant=title
  Card "Summer Collection" subtitle="New Arrivals"
    Image "https://picsum.photos/400/200" alt="Summer collection"
    Text "Explore the latest trends for summer 2026"
    Button "Shop Now" -> product-list

  Block "Categories" variant=title
  List
    ListItem "Clothing" after="234 items" chevron link -> product-list
    ListItem "Shoes" after="89 items" chevron link -> product-list
    ListItem "Accessories" after="156 items" chevron link -> product-list

---

view product-list label="Products"
  Navbar "Clothing" backButton -> shop
  List
    ListItem "Classic T-Shirt" subtitle="$29.99" after="★ 4.5" chevron link -> product-detail
    ListItem "Slim Jeans" subtitle="$59.99" after="★ 4.8" chevron link -> product-detail
    ListItem "Canvas Sneakers" subtitle="$49.99" after="★ 4.2" chevron link -> product-detail
    ListItem "Leather Belt" subtitle="$34.99" after="★ 4.7" chevron link -> product-detail

---

view product-detail label="Product"
  Navbar "Classic T-Shirt" backButton -> product-list
  Image "https://picsum.photos/400/400" alt="Product photo"
  Block
    Text "Classic T-Shirt" variant=title
    Text "$29.99" variant=subtitle
    Spacer 8
    Text "A timeless wardrobe essential. Made from 100% organic cotton."
  Block "Size" variant=title
  Segmented options=[XS, S, M, L, XL] active=2
  Block "Color" variant=title
  Block
    Row gap=8
      Chip "Black" outline
      Chip "White"
      Chip "Navy" outline
  Spacer 16
  Block
    Button "Add to Cart" large rounded raised

---

view cart
  Navbar "Cart"
  List
    ListItem "Classic T-Shirt" subtitle="Size M, Black" after="$29.99"
    ListItem "Slim Jeans" subtitle="Size 32" after="$59.99"
  Divider
  Block
    Row justify=between
      Text "Total"
      Text "$89.98" variant=title
    Spacer 16
    Button "Checkout" large rounded raised

---

view account
  Navbar "Account"
  Block
    Text "Jane Smith" variant=title
    Text "jane@example.com" variant=caption
  List inset
    ListItem "Orders" chevron link
    ListItem "Wishlist" chevron link
    ListItem "Addresses" chevron link
    ListItem "Payment Methods" chevron link
  List inset
    ListItem "Help" chevron link
    ListItem "Sign Out" color=red
```

### Example 6: Social Feed

```markframe
app
  tabbar
    tab "Feed" icon=home -> feed
    tab "Search" icon=search -> search
    tab "Post" icon=add-circle -> create-post
    tab "Profile" icon=person -> profile

---

view feed
  Navbar "Feed"

  // Story row
  Block
    Row gap=12
      Column align=center
        Icon "add-circle" size=48 color=blue
        Text "Your Story" variant=caption
      Column align=center
        Icon "person-circle" size=48
        Text "Alice" variant=caption
      Column align=center
        Icon "person-circle" size=48
        Text "Bob" variant=caption
      Column align=center
        Icon "person-circle" size=48
        Text "Carol" variant=caption

  Divider

  // Post 1
  Card
    Row gap=8 align=center
      Icon "person-circle" size=32
      Column
        Text "Alice Johnson" variant=subtitle
        Text "2 hours ago" variant=caption
    Spacer 8
    Text "Just finished a beautiful hike in the mountains! The views were absolutely incredible."
    Image "https://picsum.photos/400/300" alt="Mountain hike"
    Spacer 8
    Row gap=16
      Link "♥ 42"
      Link "💬 8"
      Link "↗ Share"

  // Post 2
  Card
    Row gap=8 align=center
      Icon "person-circle" size=32
      Column
        Text "Bob Wilson" variant=subtitle
        Text "5 hours ago" variant=caption
    Spacer 8
    Text "Working on an exciting new project. Can't wait to share more details soon! 🚀"
    Row gap=16
      Link "♥ 23"
      Link "💬 5"
      Link "↗ Share"

  Fab "create" position=right-bottom -> create-post

---

view search
  Navbar "Search"
  TextField "Search people, posts..." type=search
  Block "Trending Topics" variant=title
  List
    ListItem "#Technology" subtitle="1.2K posts"
    ListItem "#Photography" subtitle="890 posts"
    ListItem "#Travel" subtitle="2.4K posts"
    ListItem "#Fitness" subtitle="567 posts"

---

view create-post label="New Post"
  Navbar "New Post" backButton -> feed
  Block
    TextField "What's on your mind?" type=text
    Spacer 16
    Row gap=8
      Button "Photo" variant=outline
      Button "Video" variant=outline
      Button "Poll" variant=outline
    Spacer 24
    Button "Post" large rounded

---

view profile
  Navbar "Profile"
  Block align=center
    Icon "person-circle" size=80
    Text "Jane Smith" variant=title
    Text "@janesmith" variant=caption
    Spacer 8
    Row gap=16
      Column align=center
        Text "142" variant=subtitle
        Text "Posts" variant=caption
      Column align=center
        Text "2.1K" variant=subtitle
        Text "Followers" variant=caption
      Column align=center
        Text "891" variant=subtitle
        Text "Following" variant=caption
  Spacer 8
  Button "Edit Profile" variant=outline
```

### Example 7: Messaging App

```markframe
app
  tabbar
    tab "Chats" icon=chatbubbles -> chats
    tab "Calls" icon=call -> calls
    tab "Contacts" icon=people -> contacts

---

view chats
  Navbar "Messages"

  TextField "Search messages..." type=search

  List
    ListItem "Alice Johnson" subtitle="See you tomorrow! 👋" after="2m" chevron link -> chat-detail
    ListItem "Design Team" subtitle="Bob: Updated the mockups" after="15m" chevron link -> chat-detail
    ListItem "Carol Williams" subtitle="Thanks for the help!" after="1h" chevron link -> chat-detail
    ListItem "David Chen" subtitle="Let's schedule a meeting" after="3h" chevron link -> chat-detail
    ListItem "Mom" subtitle="Call me when you're free" after="1d" chevron link -> chat-detail

  Fab "create" -> new-message

---

view chat-detail label="Chat"
  Navbar "Alice Johnson" backButton -> chats

  Message "Hey! Are you free tomorrow?" time="10:30 AM" avatar
  Message "Yes, I should be free after 2pm!" time="10:32 AM" sent read
  Message "See you tomorrow! 👋" time="10:33 AM" avatar

  Toolbar
    TextField "Type a message..." type=text
    Button "Send" variant=clear

---

view calls
  Navbar "Calls"
  List
    ListItem "Alice Johnson" subtitle="Incoming, 5 min" after="Today"
    ListItem "Bob Wilson" subtitle="Outgoing, 12 min" after="Yesterday"
    ListItem "Carol Williams" subtitle="Missed" after="Mon" color=red

---

view contacts
  Navbar "Contacts"
  TextField "Search contacts..." type=search
  List
    ListItem "A" header
    ListItem "Alice Johnson" subtitle="Online"
    ListItem "B" header
    ListItem "Bob Wilson" subtitle="Last seen 2h ago"
    ListItem "C" header
    ListItem "Carol Williams" subtitle="Busy"
    ListItem "D" header
    ListItem "David Chen" subtitle="Away"

---

view new-message label="New Message"
  Navbar "New Message" backButton -> chats
  TextField "To:" type=text
  Divider
  TextField "Type a message..." type=text
  Button "Send" large
```

### Example 8: Dashboard

```markframe
view dashboard
  Navbar "Dashboard" subtitle="Welcome back, Jane"

  // Stats cards
  Block
    Row gap=8
      Card "Revenue" subtitle="$12,450"
        Text "+12.5%" color=green
      Card "Orders" subtitle="1,234"
        Text "+8.2%" color=green

  Block
    Row gap=8
      Card "Users" subtitle="5,678"
        Text "+23.1%" color=green
      Card "Returns" subtitle="23"
        Text "-5.4%" color=red

  // Activity
  Block "Recent Activity" variant=title
  List
    ListItem "New order #1234" subtitle="Jane Smith - $89.99" after="2m ago"
    ListItem "Payment received" subtitle="Order #1230 - $156.00" after="15m ago"
    ListItem "New user signup" subtitle="bob@example.com" after="1h ago"
    ListItem "Product review" subtitle="★★★★★ Canvas Sneakers" after="2h ago"
    ListItem "Refund processed" subtitle="Order #1225 - $34.99" after="3h ago"

  // Quick actions
  Block "Quick Actions" variant=title
  Block
    Row gap=8
      Button "New Order" variant=outline
      Button "Add Product" variant=outline
      Button "Reports" variant=outline
```

### Example 9: Master-Detail (List to Detail)

```markframe
view recipes label="Recipes"
  Navbar "Recipes"
  TextField "Search recipes..." type=search

  Block "Popular Recipes" variant=title
  List
    ListItem "Spaghetti Carbonara" subtitle="Italian • 30 min" after="★ 4.8" chevron link -> recipe-detail
    ListItem "Chicken Tikka Masala" subtitle="Indian • 45 min" after="★ 4.6" chevron link -> recipe-detail
    ListItem "Caesar Salad" subtitle="American • 15 min" after="★ 4.3" chevron link -> recipe-detail
    ListItem "Pad Thai" subtitle="Thai • 25 min" after="★ 4.7" chevron link -> recipe-detail
    ListItem "Beef Tacos" subtitle="Mexican • 20 min" after="★ 4.5" chevron link -> recipe-detail

---

view recipe-detail label="Recipe"
  Navbar "Spaghetti Carbonara" backButton -> recipes

  Image "https://picsum.photos/400/250" alt="Spaghetti Carbonara"

  Block
    Text "Spaghetti Carbonara" variant=title
    Row gap=8
      Chip "Italian"
      Chip "30 min"
      Chip "Easy"
    Spacer 8
    Text "A classic Roman pasta dish made with eggs, cheese, pancetta, and pepper."

  Block "Ingredients" variant=title
  List
    ListItem "Spaghetti" after="400g"
    ListItem "Pancetta" after="200g"
    ListItem "Eggs" after="4"
    ListItem "Pecorino Romano" after="100g"
    ListItem "Black Pepper" after="to taste"

  Block "Instructions" variant=title
  List
    ListItem "1. Boil pasta in salted water"
    ListItem "2. Cook pancetta until crispy"
    ListItem "3. Mix eggs and cheese"
    ListItem "4. Combine pasta with pancetta"
    ListItem "5. Add egg mixture off heat"
    ListItem "6. Toss and serve immediately"

  Fab "heart" color=red
```

### Example 10: Onboarding Walkthrough

```markframe
view onboarding-1 label="Welcome"
  Center fill p=8
    Spacer 64
    Icon "rocket" size=80 color=blue
    Spacer 24
    Text "Welcome to markframe" variant=title
    Spacer 8
    Text "Build beautiful mobile UIs with a simple, declarative syntax." variant=caption
    Spacer 48
    Button "Get Started" large rounded -> onboarding-2
    Spacer 16
    Link "Skip" -> home

---

view onboarding-2 label="Preview"
  Navbar backButton -> onboarding-1
  Center fill p=8
    Spacer 48
    Icon "phone-portrait" size=80 color=green
    Spacer 24
    Text "Live Preview" variant=title
    Spacer 8
    Text "See your changes instantly on realistic device frames. Support for 12+ iOS and Android devices."
    Spacer 48
    Button "Next" large rounded -> onboarding-3
    Spacer 16
    Link "Skip" -> home

---

view onboarding-3 label="Themes"
  Navbar backButton -> onboarding-2
  Center fill p=8
    Spacer 48
    Icon "color-palette" size=80 color=purple
    Spacer 24
    Text "Platform Themes" variant=title
    Spacer 8
    Text "Toggle between iOS and Material Design to see how your app looks on both platforms."
    Spacer 48
    Button "Let's Go!" large rounded -> home
    Spacer 16
    Segmented options=[iOS, Material] active=0

---

view home
  Navbar "Home"
  Card "Getting Started"
    Text "You're all set! Start building your first screen."
    Spacer 8
    Button "Create New Screen" -> create
  Card "Documentation"
    Text "Learn the markframe syntax and component library."
    Button "View Docs" variant=outline
  Card "Examples"
    Text "Browse example apps for inspiration."
    Button "View Examples" variant=outline
```

---

## 12. Edge Cases & Notes

### 12.1 Empty Views

A view with no children is valid (renders an empty screen):

```markframe
view empty
```

### 12.2 Deeply Nested Components

Nesting works to arbitrary depth:

```markframe
view complex
  Card "Outer"
    Block
      Row gap=8
        Column
          Text "Deeply nested"
          Button "Action"
```

### 12.3 Multiple Views Without App Block

If there's no `app` block, views are standalone and navigated via the surface selector dropdown or `->` navigation:

```markframe
view page-1
  Navbar "Page 1"
  Button "Go to Page 2" -> page-2

---

view page-2
  Navbar "Page 2" backButton -> page-1
  Text "You're on page 2"
```

### 12.4 Components Outside Views

Components must be inside a `view` or `app` block. Bare components at column 0 (other than `view`, `app`, or `---`) are parse errors.

### 12.5 Reserved Words

The following words are reserved and cannot be used as view IDs:
- `app`
- `view`
- `tab`
- `tabbar`

### 12.6 Case Sensitivity

- **View IDs** are case-insensitive (kebab-case recommended)
- **Component names** are case-sensitive and must be PascalCase
- **Prop names** are case-sensitive and must be camelCase
- **Prop values** are case-sensitive

### 12.7 Escaping Characters

Use backslash to escape quotes and insert newlines within strings:

- `\"` — Double quote
- `\n` — Newline (renders as HTML line break)
- `\\` — Backslash

```markframe
Text "She said \"hello\""
Text "Line 1\nLine 2"
```

---

## Appendix A: Grammar (Informal)

```
file        = (app-block)? (view-block ("---" view-block)*)?
app-block   = "app" NEWLINE INDENT (component NEWLINE)*
view-block  = "view" ID (prop)* NEWLINE (INDENT component NEWLINE)*
component   = INDENT* TYPE (primary-prop)? (prop)* (navigation)?
primary-prop= QUOTED-STRING | NUMBER
prop        = KEY "=" VALUE | FLAG
navigation  = "->" ID
VALUE       = QUOTED-STRING | NUMBER | BOOLEAN | ARRAY
ARRAY       = "[" VALUE ("," VALUE)* "]"
FLAG        = WORD (treated as boolean true)
TYPE        = PascalCase word
ID          = kebab-case word
COMMENT     = "//" rest-of-line
```

---

## 13. Best Practices & Common Patterns

### 13.1 Avatars & Fixed Images

When using images in `Row` or other flex containers (like avatars), always ensure they don't get squished by adding `shrink-0`. Use `object-cover` to prevent image distortion if the aspect ratio doesn't match perfectly.

**Avatars auto-assign faces** from bundled local assets (see Section 9). No URL needed for placeholders.

```markframe
// BEST: Avatar auto-assigns a face
Avatar size=48

// GOOD: Avatar with gender filtering
Avatar gender=female size=48

// ALSO FINE: Explicit URL when needed
Avatar "https://example.com/photo.jpg" size=48

// INCORRECT: May squish or stretch
Image "https://example.com/photo.jpg" width=48 height=48 className="rounded-full"
```

### 13.2 Verified Badges

For "verified" checks (like on social media), use an `Icon` instead of a `Badge`. The `Badge` component renders a pill container with background color, which is usually not desired for a verified tick.

```markframe
// CORRECT: Verified Icon
Icon "checkmark-circle" size=16 color=blue

// INCORRECT: Renders a text badge inside a colored pill
Badge "✓" color=blue
```

### 13.3 Enriched Props Replace className Patterns

The v2 enriched props and new components replace many common `className` hacks with declarative, first-class props:

```markframe
// BEFORE: Avatar with className
Image "https://example.com/photo.jpg" width=48 height=48 className="rounded-full object-cover shrink-0"

// AFTER: Using Image circle prop
Image "https://example.com/photo.jpg" size=48 circle

// EVEN BETTER: Avatar with explicit URL
Avatar "https://example.com/photo.jpg" size=48

// BEST: Avatar auto-assigns a local face (see Section 9)
Avatar size=48

// BEFORE: Progress bar hack
Block className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden !p-0 !m-0"
  Block className="h-full w-[84%] bg-blue-500 rounded-full !p-0 !m-0"

// AFTER: ProgressBar component
ProgressBar 84 color=blue height=3
```

### 13.4 Using Semantic Margin & Layout Props

Props `mt`, `mb`, `push`, `fill`, `borderTop`, `borderBottom`, and directional spacing (`px`, `py`, `pt`, `pb`, `pl`, `pr`, `mx`) replace common `className` hacks:

```markframe
// BEFORE: className margin hacks
Block className="!mb-4"
Row className="mt-3 px-4"
Button "Edit" className="flex-1"
Icon "bookmark" className="ml-auto"
Row className="border-t border-b pb-2"

// AFTER: Semantic props
Block mb=4
Row mt=3 px=4
Button "Edit" fill
Icon "bookmark" push
Row borderTop borderBottom pb=2
```

---

**Document Version:** 1.5
**Last Updated:** 2026-02-15
**Status:** Specification complete, parser and catalog implemented (52 component types)

