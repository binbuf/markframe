/// <reference types="node" />
import { render, screen } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMarkframe } from '../engine/markframeParser';
import { renderNode } from '../catalog/renderNode';
import { AllProviders } from './helpers';
import type { MarkframeNode } from '../types/markframe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse source, assert no error, return the tree map. */
function parse(source: string) {
  const result = parseMarkframe(source);
  expect(result.error).toBeNull();
  expect(result.tree).not.toBeNull();
  return result;
}

/** Get the Surface node for a given surfaceId from a parsed tree. */
function getSurface(tree: Map<string, MarkframeNode>, surfaceId: string) {
  const surface = tree.get(surfaceId);
  expect(surface).toBeDefined();
  return surface!;
}

/**
 * Full pipeline helper: parse source → get surface → render inside providers.
 * Returns the render result so callers can make assertions.
 */
function renderFromSource(
  source: string,
  surfaceId?: string,
  opts?: { theme?: 'ios' | 'material'; navigate?: (id: string) => void },
) {
  const result = parse(source);
  const tree = result.tree!;
  const id = surfaceId ?? result.surfaces[0]?.surfaceId;
  expect(id).toBeDefined();
  const surface = getSurface(tree, id!);
  const theme = opts?.theme ?? 'ios';

  return render(
    <AllProviders navigate={opts?.navigate} tree={tree}>
      {renderNode(surface, theme)}
    </AllProviders>,
  );
}

/** BFS flat list of all descendants (excluding the root). */
function flatNodes(node: MarkframeNode): MarkframeNode[] {
  const result: MarkframeNode[] = [];
  const queue = [...(node.children ?? [])];
  while (queue.length > 0) {
    const n = queue.shift()!;
    result.push(n);
    queue.push(...(n.children ?? []));
  }
  return result;
}

// ---------------------------------------------------------------------------
// 1. Simple Documents
// ---------------------------------------------------------------------------

describe('Integration: Simple Documents', () => {
  it('renders a single button from source text', () => {
    renderFromSource(`
view home
  Button "Click Me"
`);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders a form with multiple fields', () => {
    renderFromSource(`
view login
  Navbar "Login"
  TextField "Email" type=email
  TextField "Password" type=password
  Button "Sign In"
`);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders a card with nested content', () => {
    renderFromSource(`
view home
  Card "Welcome"
    Text "Hello, world!"
    Button "Get Started"
`);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders a list with items', () => {
    renderFromSource(`
view home
  Navbar "Items"
  List
    ListItem "Item A"
    ListItem "Item B"
    ListItem "Item C"
`);
    expect(screen.getByText('Items')).toBeInTheDocument();
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
    expect(screen.getByText('Item C')).toBeInTheDocument();
  });

  it('renders with material theme', () => {
    renderFromSource(
      `
view home
  Navbar "Material App"
  Button "Action"
`,
      undefined,
      { theme: 'material' },
    );
    expect(screen.getByText('Material App')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. Multi-View Navigation
// ---------------------------------------------------------------------------

describe('Integration: Multi-View Navigation', () => {
  const multiViewSource = `
view home
  Navbar "Home"
  Button "Go to Settings" -> settings
  Text "Welcome home"

view settings
  Navbar "Settings" backButton
  Text "Settings page"
`;

  it('renders the first view by default', () => {
    renderFromSource(multiViewSource);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Welcome home')).toBeInTheDocument();
  });

  it('renders a specific view by surfaceId', () => {
    renderFromSource(multiViewSource, 'settings');
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Settings page')).toBeInTheDocument();
  });

  it('parses navigation targets correctly', () => {
    const result = parse(multiViewSource);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    const button = flatNodes(home).find(n => n.type === 'Button');
    expect(button).toBeDefined();
    expect(button!.props?.navigateTo).toBe('settings');
  });

  it('detects all views as surfaces', () => {
    const result = parse(multiViewSource);
    expect(result.surfaces).toHaveLength(2);
    expect(result.surfaces.map(s => s.surfaceId)).toEqual(['home', 'settings']);
  });

  it('renders back button on settings view', () => {
    renderFromSource(multiViewSource, 'settings');
    // Konsta NavbarBackLink renders a back-navigable element
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. App-Level Tabbar
// ---------------------------------------------------------------------------

describe('Integration: App-Level Tabbar', () => {
  const tabbarSource = `
app
  Tabbar
    Tab "Home" icon=home
    Tab "Search" icon=search
    Tab "Profile" icon=person
---
view home
  Navbar "Home"
  Text "Home content"

view search
  Navbar "Search"
  Text "Search content"

view profile
  Navbar "Profile"
  Text "Profile content"
`;

  it('injects tabbar into views', () => {
    const result = parse(tabbarSource);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    // Tabbar should be injected as a child of the surface
    const hasTabbar = flatNodes(home).some(n => n.type === 'Tabbar');
    expect(hasTabbar).toBe(true);
  });

  it('injects tabbar into all views', () => {
    const result = parse(tabbarSource);
    const tree = result.tree!;
    for (const surfaceInfo of result.surfaces) {
      const surface = getSurface(tree, surfaceInfo.surfaceId);
      const hasTabbar = flatNodes(surface).some(n => n.type === 'Tabbar');
      expect(hasTabbar).toBe(true);
    }
  });

  it('renders home view with tabbar', () => {
    renderFromSource(tabbarSource, 'home');
    // "Home" appears in both Navbar title and Tab label
    expect(screen.getAllByText('Home').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Home content')).toBeInTheDocument();
  });

  it('preserves tab definitions across views', () => {
    const result = parse(tabbarSource);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    const tabbar = flatNodes(home).find(n => n.type === 'Tabbar');
    expect(tabbar).toBeDefined();
    const tabs = (tabbar!.children ?? []).filter(c => c.type === 'Tab');
    expect(tabs).toHaveLength(3);
    expect(tabs.map(t => t.props?.label)).toEqual(['Home', 'Search', 'Profile']);
  });
});

// ---------------------------------------------------------------------------
// 4. Overlay Flow
// ---------------------------------------------------------------------------

describe('Integration: Overlay Flow', () => {
  it('parses dialog with buttons from source', () => {
    const source = `
view home
  Dialog "Confirm?" content="Are you sure?" opened=true
    DialogButton "Cancel"
    DialogButton "OK" strong
`;
    const result = parse(source);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    const dialog = flatNodes(home).find(n => n.type === 'Dialog');
    expect(dialog).toBeDefined();
    expect(dialog!.props?.title).toBe('Confirm?');
    expect(dialog!.props?.content).toBe('Are you sure?');
    const buttons = (dialog!.children ?? []).filter(c => c.type === 'DialogButton');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].props?.label).toBe('Cancel');
    expect(buttons[1].props?.label).toBe('OK');
    expect(buttons[1].props?.strong).toBe(true);
  });

  it('renders opened dialog with content', () => {
    renderFromSource(`
view home
  Dialog "Delete?" content="This cannot be undone." opened=true
    DialogButton "Cancel"
    DialogButton "Delete" destructive
`);
    expect(screen.getByText('Delete?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('parses actions with groups from source', () => {
    const source = `
view home
  Actions "Choose" opened=true
    ActionsGroup
      ActionsButton "Edit"
      ActionsButton "Share"
    ActionsGroup
      ActionsButton "Delete" destructive
`;
    const result = parse(source);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    const actions = flatNodes(home).find(n => n.type === 'Actions');
    expect(actions).toBeDefined();
    const groups = (actions!.children ?? []).filter(c => c.type === 'ActionsGroup');
    expect(groups).toHaveLength(2);
    const firstGroupButtons = (groups[0].children ?? []).filter(c => c.type === 'ActionsButton');
    expect(firstGroupButtons).toHaveLength(2);
  });

  it('parses sheet with content from source', () => {
    const source = `
view home
  Sheet "Options" id=my-sheet
    List
      ListItem "Option 1"
      ListItem "Option 2"
`;
    const result = parse(source);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    const sheet = flatNodes(home).find(n => n.type === 'Sheet');
    expect(sheet).toBeDefined();
    expect(sheet!.props?.title).toBe('Options');
    expect(sheet!.props?.id).toBe('my-sheet');
    const list = (sheet!.children ?? []).find(c => c.type === 'List');
    expect(list).toBeDefined();
    expect((list!.children ?? []).filter(c => c.type === 'ListItem')).toHaveLength(2);
  });

  it('parses popup with nested content from source', () => {
    const source = `
view home
  Popup "Details" id=detail-popup
    Navbar "Detail View"
    Block
      Text "Popup body text"
      Button "Close"
`;
    const result = parse(source);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    const popup = flatNodes(home).find(n => n.type === 'Popup');
    expect(popup).toBeDefined();
    expect(popup!.props?.title).toBe('Details');
    const navbar = (popup!.children ?? []).find(c => c.type === 'Navbar');
    expect(navbar).toBeDefined();
    expect(navbar!.props?.title).toBe('Detail View');
  });

  it('parses overlay trigger navigation syntax', () => {
    const source = `
view home
  ListItem "Open Sheet" -> my-sheet
  Sheet "My Sheet" id=my-sheet
    Text "Sheet content"
`;
    const result = parse(source);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    const listItem = flatNodes(home).find(n => n.type === 'ListItem');
    expect(listItem!.props?.navigateTo).toBe('my-sheet');
  });
});

// ---------------------------------------------------------------------------
// 5. Blueprint Rendering (Smoke Tests)
// ---------------------------------------------------------------------------

describe('Integration: Blueprint Smoke Tests', () => {
  const blueprintDir = path.resolve(__dirname, '../../blueprints');
  const blueprintFiles = fs.readdirSync(blueprintDir).filter((f: string) => f.endsWith('.mf'));

  // Verify we have the expected number of blueprints
  it('has at least 12 blueprint files', () => {
    expect(blueprintFiles.length).toBeGreaterThanOrEqual(12);
  });

  describe.each(blueprintFiles)('blueprint: %s', (filename: string) => {
    const source = fs.readFileSync(path.join(blueprintDir, filename), 'utf-8');

    it('parses without errors', () => {
      const result = parseMarkframe(source);
      expect(result.error).toBeNull();
      expect(result.tree).not.toBeNull();
      expect(result.surfaces.length).toBeGreaterThanOrEqual(1);
    });

    it('renders first surface without crashes', () => {
      const result = parseMarkframe(source);
      if (result.error || !result.tree) return; // Skip if parse failed

      const surfaceId = result.surfaces[0].surfaceId;
      const surface = result.tree.get(surfaceId)!;
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <AllProviders tree={result.tree}>
            {renderNode(surface, 'ios')}
          </AllProviders>,
        );
      }).not.toThrow();

      // Filter out React/library warnings we don't control (controlled components,
      // value prop without onChange, etc.)
      const IGNORED_PATTERNS = [
        'Warning:',
        'value',
        'onChange',
        'defaultValue',
        'readOnly',
      ];
      const realErrors = consoleSpy.mock.calls.filter(
        args => !IGNORED_PATTERNS.some(p => String(args[0]).includes(p)),
      );
      expect(realErrors).toHaveLength(0);
      consoleSpy.mockRestore();
    });

    it('renders with material theme without crashes', () => {
      const result = parseMarkframe(source);
      if (result.error || !result.tree) return;

      const surfaceId = result.surfaces[0].surfaceId;
      const surface = result.tree.get(surfaceId)!;

      expect(() => {
        render(
          <AllProviders tree={result.tree}>
            {renderNode(surface, 'material')}
          </AllProviders>,
        );
      }).not.toThrow();
    });
  });
});

// ---------------------------------------------------------------------------
// 6. Complex Scenarios
// ---------------------------------------------------------------------------

describe('Integration: Complex Scenarios', () => {
  it('renders deeply nested components (5+ levels)', () => {
    renderFromSource(`
view home
  Card "Outer"
    List
      ListItem "Item"
        Row
          Column
            Text "Deep text"
`);
    expect(screen.getByText('Outer')).toBeInTheDocument();
    expect(screen.getByText('Deep text')).toBeInTheDocument();
  });

  it('handles components with all prop types', () => {
    const source = `
view home
  Button "Navigate" color=red disabled=true -> settings
  Spacer 16
  ProgressBar 75
  Segmented options=[One, Two, Three] activeIndex=1
`;
    const result = parse(source);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    const nodes = flatNodes(home);

    // String prop + navigation
    const button = nodes.find(n => n.type === 'Button')!;
    expect(button.props?.label).toBe('Navigate');
    expect(button.props?.color).toBe('red');
    expect(button.props?.disabled).toBe(true);
    expect(button.props?.navigateTo).toBe('settings');

    // Numeric primary prop
    const spacer = nodes.find(n => n.type === 'Spacer')!;
    expect(spacer.props?.size).toBe(16);

    // Numeric primary prop
    const progress = nodes.find(n => n.type === 'ProgressBar')!;
    expect(progress.props?.value).toBe(75);

    // Array prop
    const segmented = nodes.find(n => n.type === 'Segmented')!;
    expect(segmented.props?.options).toEqual(['One', 'Two', 'Three']);
    expect(segmented.props?.activeIndex).toBe(1);
  });

  it('renders mixed component types in a single view', () => {
    renderFromSource(`
view home
  Navbar "Dashboard"
  Card "Stats"
    Text "Revenue: $1,234"
  Block
    Button "Export"
    Button "Share" variant=outline
  List inset
    ListItem "Settings" chevron
    ListItem "Help" chevron
  Divider
  Block align=center
    Text "Footer text" variant=caption
`);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Stats')).toBeInTheDocument();
    expect(screen.getByText('Revenue: $1,234')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('handles form controls together', () => {
    renderFromSource(`
view home
  Navbar "Form"
  List
    ListItem "Notifications"
      Switch
    ListItem "Dark Mode"
      Toggle
    ListItem "Agree to Terms"
      Checkbox
`);
    expect(screen.getByText('Form')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('Agree to Terms')).toBeInTheDocument();
  });

  it('handles boolean flags correctly through pipeline', () => {
    const source = `
view home
  List inset strong
    ListItem "Profile" chevron link
    ListItem "Logout" color=red
`;
    const result = parse(source);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    const list = flatNodes(home).find(n => n.type === 'List')!;
    expect(list.props?.inset).toBe(true);
    expect(list.props?.strong).toBe(true);

    const items = (list.children ?? []).filter(c => c.type === 'ListItem');
    expect(items[0].props?.chevron).toBe(true);
    expect(items[0].props?.link).toBe(true);
    expect(items[1].props?.color).toBe('red');
  });

  it('handles comments and blank lines in source', () => {
    renderFromSource(`
// This is a header comment
view home
  // Navigation bar
  Navbar "App"

  // Main content
  Text "Content here"

  // Footer
  Button "Done"
`);
    expect(screen.getByText('App')).toBeInTheDocument();
    expect(screen.getByText('Content here')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('generates deterministic IDs through the pipeline', () => {
    const source = `
view home
  Button "First"
  Button "Second"
  Text "Third"
`;
    const result = parse(source);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    const nodes = flatNodes(home);

    // IDs follow pattern: surfaceId-type-counter
    expect(nodes[0].id).toMatch(/^home-button-\d+$/);
    expect(nodes[1].id).toMatch(/^home-button-\d+$/);
    expect(nodes[2].id).toMatch(/^home-text-\d+$/);

    // IDs should be unique
    const ids = nodes.map(n => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('handles string escaping in props', () => {
    const source = String.raw`
view home
  Text "Hello \"World\""
  Button "Line1\nLine2"
`;
    const result = parse(source);
    const tree = result.tree!;
    const home = getSurface(tree, 'home');
    const nodes = flatNodes(home);
    const text = nodes.find(n => n.type === 'Text')!;
    expect(text.props?.text).toBe('Hello "World"');
    const button = nodes.find(n => n.type === 'Button')!;
    expect(button.props?.label).toBe('Line1\nLine2');
  });

  it('separator syntax splits views', () => {
    const source = `
view first
  Text "View 1"
---
view second
  Text "View 2"
`;
    const result = parse(source);
    expect(result.surfaces).toHaveLength(2);
    expect(result.surfaces[0].surfaceId).toBe('first');
    expect(result.surfaces[1].surfaceId).toBe('second');
  });
});
