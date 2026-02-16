# markframe

<p align="center">
  <img src="public/app.png" alt="markframe Preview" width="128">
</p>

<p align="center">
  A declarative, indentation-based DSL for rapid mobile prototyping.
</p>

<p align="center">
  <a href="https://github.com/binbuf/markframe/actions"><img src="https://img.shields.io/badge/Build-passing-brightgreen.svg" alt="Build Status"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/version-0.1.0-green.svg" alt="Version">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
</p>

---

**markframe** is a specialized markup language and IDE that lets you build high-fidelity mobile user interfaces in seconds. Instead of wrestling with verbose JSON or complex UI builders, you write simple, indentation-based code and instantly see platform-accurate iOS and Android previews.

<div align="center">
  <video src="https://github.com/user-attachments/assets/d961fda2-94ea-4557-8509-3fbe9cfc79e2" autoplay loop muted playsinline style="width: 100%; display: block;"></video>
</div>

[✨ Live Demo](#) | [📖 Language Spec](docs/Markframe-Language-Specification.md) | [🚀 Quick Start](#-getting-started) | [🧩 Components](#-component-catalog)

## ✨ Key Features

- **🚅 Lightning Fast DSL** — Write a login screen in 6 lines, not 60. Indentation defines hierarchy automatically.
- **📱 12+ Device Frames** — From iPhone SE to iPad Pro, Pixel 7 to Galaxy Tab S9.
- **🎨 Platform Themes** — Switch between **iOS** and **Material Design** styling with a single click.
- **🔄 Orientation Support** — Toggle between Portrait and Landscape modes with full safe-area handling.
- **🖼️ Smart Assets** — Built-in local placeholder assets. Avatars and category images (`food`, `nature`, `city`) are auto-assigned based on tree position.
- **🔹 Premium Icons** — Built-in support of large icon set.
- **⚡ Real-time Feedback** — 200ms debounced live preview as you type in the integrated Monaco editor.
- **🛠️ Rich Component Library** — 30+ components including Overlays (Sheets, Popups, Dialogs), FABs, and native-feeling Lists.
- **🤖 AI-Friendly** — Designed specifically for LLMs to generate and humans to review easily.
- **💾 Zero-Backend** — Fully client-side SPA using the browser's File System Access API for local file management.

## 📝 The markframe DSL

```markframe
view login
  Navbar "Login"
  Text "Welcome Back" variant=title
  
  Block strong inset
    TextField "Email" type=email placeholder="user@example.com"
    TextField "Password" type=password
    Button "Sign In" large rounded raised
    
  Center
    Link "Forgot Password?" -> recover-password
```

This simple block renders a fully styled login screen with platform-accurate components, spacing, and interaction patterns.

## 🧩 Component Catalog

| Category | Components |
| :--- | :--- |
| **Layout** | `Row`, `Column`, `Block`, `Divider`, `Spacer`, `Grid`, `Center` |
| **Navigation** | `Navbar`, `Toolbar`, `Tabbar`, `Tabs`, `Segmented`, `Link`, `Breadcrumbs`, `Searchbar` |
| **Forms** | `Button`, `TextField`, `Checkbox`, `Radio`, `Switch`, `Toggle`, `Stepper`, `Range` |
| **Content** | `Text`, `Card`, `List`, `ListItem`, `ListGroup`, `Icon`, `Badge`, `Chip`, `Image`, `Avatar`, `Stat`, `Preloader`, `ProgressBar` |
| **Overlays** | `Sheet`, `Popup`, `Dialog`, `Actions`, `Panel`, `Popover`, `Toast` |
| **Social** | `Post`, `Message`, `StoryRow`, `Story`, `IconCircle` |

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A modern browser (Chrome, Edge, or Safari 16+)

### Installation

```bash
# Clone the repository
git clone https://github.com/binbuf/markframe.git

# Navigate to the project directory
cd markframe

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Testing

markframe uses [Vitest](https://vitest.dev/) for unit and integration testing.

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl/Cmd + O` | Open file |
| `Ctrl/Cmd + S` | Save file |
| `Ctrl/Cmd + T` | Toggle iOS/Material theme |
| `Ctrl/Cmd + R` | Toggle orientation |
| `Ctrl/Cmd + ]` / `[` | Next/previous device |
| `Ctrl/Cmd + =` / `-` | Zoom in/out |
| `Ctrl/Cmd + 0` | Reset zoom |
| `Ctrl/Cmd + ?` | Show all shortcuts |

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Konsta UI](https://konstaui.com/) (Mobile-first iOS/Material components)
- **Icons:** [Ionicons](https://ionic.io/ionicons)
- **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Bundler:** [Vite](https://vitejs.dev/) (powered by Rolldown)
- **Testing:** [Vitest](https://vitest.dev/)

## 📖 Documentation

- [**Language Specification**](docs/Markframe-Language-Specification.md) — Detailed syntax, component props, and examples.
- [**System Design**](docs/Design.md) — Architectural overview and data flow.
- [**UI/UX Guidelines**](docs/UIUX.md) — Best practices for building apps with markframe.

## 🗺️ Roadmap

- [ ] **VS Code Extension** — Syntax highlighting and snippets for `.mf` files.
- [ ] **Interactive States** — Support for variables and simple state transitions.
- [ ] **Component Library** — Ability to define and reuse custom component blocks.
- [ ] **Explore Template Export** — Explore ideas of converting markframe templates into functional UI boilerplate for various frameworks.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👏 Media Credits

- Placeholder images sourced from [Unsplash](https://unsplash.com)
- Avatars sourced from [i.pravatar.cc](https://i.pravatar.cc)

All media used in this project are the property of their respective owners and are used under their respective licenses.

## 📄 License


Distributed under the MIT License. See `LICENSE` for more information.
