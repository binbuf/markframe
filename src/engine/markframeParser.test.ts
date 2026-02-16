import { parseMarkframe } from './markframeParser'
import type { MarkframeNode } from '../types/markframe'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Shorthand: parse and assert no error, return the tree Map */
function parse(source: string) {
  const result = parseMarkframe(source)
  expect(result.error).toBeNull()
  expect(result.tree).not.toBeNull()
  return result.tree!
}

/** Get a surface's flat list of descendant nodes (BFS) */
function flatNodes(surface: MarkframeNode): MarkframeNode[] {
  const out: MarkframeNode[] = []
  const queue = [...(surface.children ?? [])]
  while (queue.length > 0) {
    const node = queue.shift()!
    out.push(node)
    queue.push(...(node.children ?? []))
  }
  return out
}

// ===========================================================================
// 1. Basic Parsing
// ===========================================================================
describe('Basic Parsing', () => {
  it('empty document returns empty Map', () => {
    const result = parseMarkframe('')
    expect(result.error).toBeNull()
    expect(result.tree).toBeInstanceOf(Map)
    expect(result.tree!.size).toBe(0)
    expect(result.surfaces).toEqual([])
  })

  it('single component produces correct node', () => {
    const tree = parse('view home\n  Button "Click me"')
    const surface = tree.get('home')!
    expect(surface.children).toHaveLength(1)
    const btn = surface.children![0]
    expect(btn.type).toBe('Button')
    expect(btn.props?.label).toBe('Click me')
    expect(btn.parentId).toBe('home')
  })

  it('component with no props', () => {
    const tree = parse('view home\n  Button')
    const btn = tree.get('home')!.children![0]
    expect(btn.type).toBe('Button')
    expect(btn.props).toBeUndefined()
  })

  it('component type is case-sensitive', () => {
    const tree = parse('view home\n  Button "A"\n  button "B"')
    const children = tree.get('home')!.children!
    expect(children[0].type).toBe('Button')
    expect(children[1].type).toBe('button')
  })

  it('surface node has correct structure', () => {
    const tree = parse('view login')
    const surface = tree.get('login')!
    expect(surface.id).toBe('login')
    expect(surface.type).toBe('Surface')
    expect(surface.parentId).toBeNull()
    expect(surface.surfaceId).toBe('login')
    expect(surface.props).toEqual({ label: 'login' })
    expect(surface.children).toEqual([])
  })

  it('whitespace-only document returns empty Map', () => {
    const result = parseMarkframe('   \n  \n\n   ')
    expect(result.error).toBeNull()
    expect(result.tree!.size).toBe(0)
  })
})

// ===========================================================================
// 2. Primary Props
// ===========================================================================
describe('Primary Props', () => {
  it('quoted string primary prop for Button', () => {
    const tree = parse('view v\n  Button "Sign In"')
    expect(tree.get('v')!.children![0].props?.label).toBe('Sign In')
  })

  it('bare number primary prop for Spacer', () => {
    const tree = parse('view v\n  Spacer 16')
    expect(tree.get('v')!.children![0].props?.size).toBe(16)
  })

  it('bare float number primary prop for Spacer', () => {
    const tree = parse('view v\n  Spacer 8.5')
    expect(tree.get('v')!.children![0].props?.size).toBe(8.5)
  })

  it('bare number primary prop for Grid cols', () => {
    const tree = parse('view v\n  Grid 3')
    expect(tree.get('v')!.children![0].props?.cols).toBe(3)
  })

  it('bare number primary prop for ProgressBar value', () => {
    const tree = parse('view v\n  ProgressBar 75')
    expect(tree.get('v')!.children![0].props?.value).toBe(75)
  })

  it('bare word primary prop for Icon name', () => {
    const tree = parse('view v\n  Icon home')
    expect(tree.get('v')!.children![0].props?.name).toBe('home')
  })

  it('bare word primary prop for Fab icon', () => {
    const tree = parse('view v\n  Fab add')
    expect(tree.get('v')!.children![0].props?.icon).toBe('add')
  })

  it('component without primary prop', () => {
    const tree = parse('view v\n  Divider')
    const node = tree.get('v')!.children![0]
    expect(node.type).toBe('Divider')
    expect(node.props).toBeUndefined()
  })

  it.each([
    ['Navbar', 'title', 'My App'],
    ['Text', 'text', 'Hello'],
    ['TextField', 'label', 'Email'],
    ['Card', 'title', 'Card Title'],
    ['ListItem', 'title', 'Item'],
    ['Chip', 'text', 'Tag'],
    ['Badge', 'text', '5'],
    ['Link', 'text', 'Click here'],
    ['Checkbox', 'label', 'Accept'],
    ['Radio', 'label', 'Option A'],
    ['Switch', 'label', 'Dark Mode'],
    ['Toggle', 'label', 'Notifications'],
    ['Dialog', 'title', 'Confirm'],
    ['Popup', 'title', 'Details'],
    ['Actions', 'title', 'Choose'],
    ['Sheet', 'title', 'More Info'],
    ['Block', 'text', 'Content'],
    ['Image', 'src', 'photo.jpg'],
    ['DialogButton', 'label', 'OK'],
    ['ActionsButton', 'label', 'Delete'],
    ['Tab', 'label', 'Home'],
    ['Avatar', 'src', 'avatar.png'],
    ['Message', 'text', 'Hi there'],
    ['MediaCard', 'title', 'Media'],
    ['Stat', 'value', '42'],
    ['Post', 'text', 'Post content'],
    ['Story', 'label', 'My Story'],
    ['MenuItem', 'title', 'Settings'],
    ['Toast', 'text', 'Saved'],
  ])('PRIMARY_PROP: %s → %s = "%s"', (component, propName, value) => {
    const tree = parse(`view v\n  ${component} "${value}"`)
    expect(tree.get('v')!.children![0].props?.[propName]).toBe(value)
  })
})

// ===========================================================================
// 3. Named Props
// ===========================================================================
describe('Named Props', () => {
  it('simple key=value bare word', () => {
    const tree = parse('view v\n  Button "Go" color=red')
    expect(tree.get('v')!.children![0].props?.color).toBe('red')
  })

  it('key=quoted string', () => {
    const tree = parse('view v\n  TextField "Email" placeholder="Enter email"')
    expect(tree.get('v')!.children![0].props?.placeholder).toBe('Enter email')
  })

  it('key=true boolean', () => {
    const tree = parse('view v\n  Button "X" disabled=true')
    expect(tree.get('v')!.children![0].props?.disabled).toBe(true)
  })

  it('key=false boolean', () => {
    const tree = parse('view v\n  Button "X" disabled=false')
    expect(tree.get('v')!.children![0].props?.disabled).toBe(false)
  })

  it('key=number', () => {
    const tree = parse('view v\n  Range "Vol" value=50')
    expect(tree.get('v')!.children![0].props?.value).toBe(50)
  })

  it('key=percentage', () => {
    const tree = parse('view v\n  Block "A" width=50%')
    expect(tree.get('v')!.children![0].props?.width).toBe('50%')
  })

  it('key=array of bare words', () => {
    const tree = parse('view v\n  Radio "Pick" options=[Option A, Option B]')
    expect(tree.get('v')!.children![0].props?.options).toEqual(['Option A', 'Option B'])
  })

  it('key=array with quoted items', () => {
    const tree = parse('view v\n  Radio "Pick" options=["Opt A", "Opt B", Opt C]')
    expect(tree.get('v')!.children![0].props?.options).toEqual(['Opt A', 'Opt B', 'Opt C'])
  })

  it('multiple named props on one line', () => {
    const tree = parse('view v\n  TextField "Name" type=email placeholder="Enter"')
    const props = tree.get('v')!.children![0].props!
    expect(props.type).toBe('email')
    expect(props.placeholder).toBe('Enter')
  })
})

// ===========================================================================
// 4. Boolean Flags
// ===========================================================================
describe('Boolean Flags', () => {
  it('bare word flag becomes true', () => {
    const tree = parse('view v\n  Button "Go" outline')
    expect(tree.get('v')!.children![0].props?.outline).toBe(true)
  })

  it('multiple flags', () => {
    const tree = parse('view v\n  Button "Go" outline raised disabled')
    const props = tree.get('v')!.children![0].props!
    expect(props.outline).toBe(true)
    expect(props.raised).toBe(true)
    expect(props.disabled).toBe(true)
  })

  it('Icon bare word is treated as icon name, not flag', () => {
    const tree = parse('view v\n  Icon home')
    const props = tree.get('v')!.children![0].props!
    expect(props.name).toBe('home')
    // Should NOT be treated as flag { home: true }
    expect(props.home).toBeUndefined()
  })

  it('Icon with named prop is not confused', () => {
    const tree = parse('view v\n  Icon name=settings')
    const props = tree.get('v')!.children![0].props!
    expect(props.name).toBe('settings')
  })

  it('flags after primary prop', () => {
    const tree = parse('view v\n  Button "Submit" disabled outline')
    const props = tree.get('v')!.children![0].props!
    expect(props.label).toBe('Submit')
    expect(props.disabled).toBe(true)
    expect(props.outline).toBe(true)
  })
})

// ===========================================================================
// 5. Navigation Syntax
// ===========================================================================
describe('Navigation Syntax', () => {
  it('arrow navigation on Button', () => {
    const tree = parse('view home\n  Button "Go" -> settings')
    expect(tree.get('home')!.children![0].props?.navigateTo).toBe('settings')
  })

  it('navigation with label', () => {
    const tree = parse('view home\n  ListItem "Profile" -> profile')
    const props = tree.get('home')!.children![0].props!
    expect(props.title).toBe('Profile')
    expect(props.navigateTo).toBe('profile')
  })

  it('navigation without label', () => {
    const tree = parse('view home\n  Button -> settings')
    expect(tree.get('home')!.children![0].props?.navigateTo).toBe('settings')
  })

  it('navigation with hyphenated target', () => {
    const tree = parse('view home\n  Button "Go" -> my-settings')
    expect(tree.get('home')!.children![0].props?.navigateTo).toBe('my-settings')
  })

  it('multiple navigations in one document', () => {
    const source = `view home
  Button "Settings" -> settings
  Button "Profile" -> profile
---
view settings
  Button "Back" -> home`
    const tree = parse(source)
    const homeChildren = tree.get('home')!.children!
    expect(homeChildren[0].props?.navigateTo).toBe('settings')
    expect(homeChildren[1].props?.navigateTo).toBe('profile')
    expect(tree.get('settings')!.children![0].props?.navigateTo).toBe('home')
  })

  it('navigation does not interfere with other props', () => {
    const tree = parse('view v\n  Button "Go" outline -> next')
    const props = tree.get('v')!.children![0].props!
    expect(props.label).toBe('Go')
    expect(props.outline).toBe(true)
    expect(props.navigateTo).toBe('next')
  })
})

// ===========================================================================
// 6. Indentation & Hierarchy
// ===========================================================================
describe('Indentation & Hierarchy', () => {
  it('2-space indent creates parent-child', () => {
    const tree = parse('view v\n  List\n    ListItem "A"\n    ListItem "B"')
    const list = tree.get('v')!.children![0]
    expect(list.type).toBe('List')
    expect(list.children).toHaveLength(2)
    expect(list.children![0].type).toBe('ListItem')
    expect(list.children![1].type).toBe('ListItem')
  })

  it('multiple nesting levels (3+ deep)', () => {
    const source = `view v
  Card
    Block
      Text "Deep"
        Badge "1"`
    const tree = parse(source)
    const card = tree.get('v')!.children![0]
    const block = card.children![0]
    const text = block.children![0]
    const badge = text.children![0]
    expect(card.type).toBe('Card')
    expect(block.type).toBe('Block')
    expect(text.type).toBe('Text')
    expect(badge.type).toBe('Badge')
    expect(badge.props?.text).toBe('1')
  })

  it('siblings at same indent level', () => {
    const tree = parse('view v\n  Button "A"\n  Button "B"\n  Button "C"')
    const children = tree.get('v')!.children!
    expect(children).toHaveLength(3)
    expect(children.every(c => c.parentId === 'v')).toBe(true)
  })

  it('returning to lower indent level after nesting', () => {
    const source = `view v
  Card
    Text "Inside"
  Button "Outside"`
    const tree = parse(source)
    const children = tree.get('v')!.children!
    expect(children).toHaveLength(2)
    expect(children[0].type).toBe('Card')
    expect(children[0].children![0].type).toBe('Text')
    expect(children[1].type).toBe('Button')
    expect(children[1].parentId).toBe('v')
  })

  it('mixed indent depths', () => {
    const source = `view v
  List
    ListItem "A"
      Badge "1"
    ListItem "B"
  Button "Done"`
    const tree = parse(source)
    const children = tree.get('v')!.children!
    expect(children).toHaveLength(2) // List + Button
    const list = children[0]
    expect(list.children).toHaveLength(2)
    expect(list.children![0].children).toHaveLength(1) // Badge
    expect(list.children![1].children).toHaveLength(0)
  })

  it('parentId references are correct', () => {
    const source = `view v
  Card
    Text "Hello"`
    const tree = parse(source)
    const card = tree.get('v')!.children![0]
    const text = card.children![0]
    expect(card.parentId).toBe('v')
    expect(text.parentId).toBe(card.id)
  })
})

// ===========================================================================
// 7. Multi-View Documents
// ===========================================================================
describe('Multi-View Documents', () => {
  it('--- separator splits views', () => {
    const source = `view home
  Text "Home"
---
view settings
  Text "Settings"`
    const tree = parse(source)
    expect(tree.has('home')).toBe(true)
    expect(tree.has('settings')).toBe(true)
    expect(tree.get('home')!.type).toBe('Surface')
    expect(tree.get('settings')!.type).toBe('Surface')
  })

  it('view declarations auto-split without separator', () => {
    const source = `view home
  Text "Home"
view settings
  Text "Settings"`
    const tree = parse(source)
    expect(tree.has('home')).toBe(true)
    expect(tree.has('settings')).toBe(true)
    expect(tree.get('home')!.type).toBe('Surface')
    expect(tree.get('settings')!.type).toBe('Surface')
  })

  it('multiple views with unique IDs', () => {
    const source = `view a
  Text "A"
---
view b
  Text "B"
---
view c
  Text "C"`
    const result = parseMarkframe(source)
    expect(result.surfaces).toHaveLength(3)
    expect(result.surfaces.map(s => s.id)).toEqual(['a', 'b', 'c'])
  })

  it('surfaces array matches views', () => {
    const source = `view login
  Text "Login"
---
view dashboard
  Text "Dashboard"`
    const result = parseMarkframe(source)
    expect(result.surfaces).toEqual([
      { id: 'login', surfaceId: 'login', label: 'login' },
      { id: 'dashboard', surfaceId: 'dashboard', label: 'dashboard' },
    ])
  })

  it('view with custom label', () => {
    const source = 'view settings label="App Settings"'
    const result = parseMarkframe(source)
    expect(result.surfaces[0].label).toBe('App Settings')
    expect(result.tree!.get('settings')!.props?.label).toBe('App Settings')
  })

  it('view names with hyphens', () => {
    const source = 'view my-settings\n  Text "Hi"'
    const tree = parse(source)
    expect(tree.has('my-settings')).toBe(true)
  })
})

// ===========================================================================
// 8. App Block & Tabbar
// ===========================================================================
describe('App Block & Tabbar', () => {
  it('app block with tabbar injects into views', () => {
    const source = `app
  Tabbar
    Tab "Home"
    Tab "Settings"
---
view home
  Text "Welcome"`
    const tree = parse(source)
    const home = tree.get('home')!
    // Should have Text + injected Tabbar
    const types = home.children!.map(c => c.type)
    expect(types).toContain('Text')
    expect(types).toContain('Tabbar')
  })

  it('tabbar is injected into all views', () => {
    const source = `app
  Tabbar
    Tab "Home"
    Tab "Settings"
---
view home
  Text "A"
---
view settings
  Text "B"`
    const tree = parse(source)
    for (const [, node] of tree) {
      if (node.type !== 'Surface') continue
      const hasTabbar = node.children!.some(c => c.type === 'Tabbar')
      expect(hasTabbar).toBe(true)
    }
  })

  it('tab children are inside tabbar node', () => {
    const source = `app
  Tabbar
    Tab "Home"
    Tab "Profile"
---
view home
  Text "Hi"`
    const tree = parse(source)
    const tabbar = tree.get('home')!.children!.find(c => c.type === 'Tabbar')!
    expect(tabbar.children).toHaveLength(2)
    expect(tabbar.children![0].type).toBe('Tab')
    expect(tabbar.children![0].props?.label).toBe('Home')
    expect(tabbar.children![1].props?.label).toBe('Profile')
  })

  it('tab with navigation targets', () => {
    const source = `app
  Tabbar
    Tab "Home" -> home
    Tab "Settings" -> settings
---
view home
  Text "Hi"`
    const tree = parse(source)
    const tabbar = tree.get('home')!.children!.find(c => c.type === 'Tabbar')!
    expect(tabbar.children![0].props?.navigateTo).toBe('home')
    expect(tabbar.children![1].props?.navigateTo).toBe('settings')
  })

  it('auto-detects active tab based on current view', () => {
    const source = `app
  Tabbar
    Tab "Home" -> home
    Tab "Search" -> search
    Tab "Profile" -> profile
---
view home
  Text "A"
---
view search
  Text "B"
---
view profile
  Text "C"`
    const tree = parse(source)
    const homeTabbar = tree.get('home')!.children!.find(c => c.type === 'Tabbar')!
    const searchTabbar = tree.get('search')!.children!.find(c => c.type === 'Tabbar')!
    const profileTabbar = tree.get('profile')!.children!.find(c => c.type === 'Tabbar')!
    expect(homeTabbar.props?.active).toBe(0)
    expect(searchTabbar.props?.active).toBe(1)
    expect(profileTabbar.props?.active).toBe(2)
  })

  it('defaults active to 0 when no tab matches the view', () => {
    const source = `app
  Tabbar
    Tab "Home" -> home
    Tab "Settings" -> settings
---
view home
  Text "A"
---
view other
  Text "B"`
    const tree = parse(source)
    const homeTabbar = tree.get('home')!.children!.find(c => c.type === 'Tabbar')!
    const otherTabbar = tree.get('other')!.children!.find(c => c.type === 'Tabbar')!
    expect(homeTabbar.props?.active).toBe(0)
    expect(otherTabbar.props?.active).toBe(0) // no tab targets "other", defaults to 0
  })

  it('app block without components does not inject anything', () => {
    const source = `app
---
view home
  Text "Hi"`
    const tree = parse(source)
    const home = tree.get('home')!
    expect(home.children).toHaveLength(1)
    expect(home.children![0].type).toBe('Text')
  })
})

// ===========================================================================
// 8b. Generalized App Block
// ===========================================================================
describe('Generalized App Block', () => {
  it('app block with non-tabbar component injects into views', () => {
    const source = `app
  Panel "Side Menu"
---
view home
  Text "Welcome"`
    const tree = parse(source)
    const home = tree.get('home')!
    const types = home.children!.map(c => c.type)
    expect(types).toContain('Text')
    expect(types).toContain('Panel')
  })

  it('app block with multiple non-tabbar components', () => {
    const source = `app
  Panel "Side Menu"
  Toast "Saved"
---
view home
  Text "Welcome"`
    const tree = parse(source)
    const home = tree.get('home')!
    const types = home.children!.map(c => c.type)
    expect(types).toContain('Panel')
    expect(types).toContain('Toast')
    expect(types).toContain('Text')
  })

  it('app block with mixed tabbar + other components', () => {
    const source = `app
  Panel "Side Menu"
  Tabbar
    Tab "Home" -> home
    Tab "Settings" -> settings
---
view home
  Text "Welcome"
---
view settings
  Text "Settings"`
    const tree = parse(source)
    const home = tree.get('home')!
    const types = home.children!.map(c => c.type)
    expect(types).toContain('Panel')
    expect(types).toContain('Tabbar')
    expect(types).toContain('Text')

    // Tabbar active detection still works
    const homeTabbar = home.children!.find(c => c.type === 'Tabbar')!
    expect(homeTabbar.props?.active).toBe(0)

    const settings = tree.get('settings')!
    const settingsTabbar = settings.children!.find(c => c.type === 'Tabbar')!
    expect(settingsTabbar.props?.active).toBe(1)
  })

  it('app block with nested components', () => {
    const source = `app
  Panel title="Menu"
    List
      ListItem "Home" -> home
      ListItem "Settings" -> settings
---
view home
  Text "Welcome"`
    const tree = parse(source)
    const home = tree.get('home')!
    const panel = home.children!.find(c => c.type === 'Panel')!
    expect(panel).toBeDefined()
    expect(panel.props?.title).toBe('Menu')
    const list = panel.children![0]
    expect(list.type).toBe('List')
    expect(list.children).toHaveLength(2)
    expect(list.children![0].type).toBe('ListItem')
    expect(list.children![1].type).toBe('ListItem')
  })

  it('app-level nodes are cloned per view with unique IDs', () => {
    const source = `app
  Toast "Saved"
---
view home
  Text "A"
---
view settings
  Text "B"`
    const tree = parse(source)
    const homeToast = tree.get('home')!.children!.find(c => c.type === 'Toast')!
    const settingsToast = tree.get('settings')!.children!.find(c => c.type === 'Toast')!
    expect(homeToast.id).not.toBe(settingsToast.id)
    expect(homeToast.parentId).toBe('home')
    expect(settingsToast.parentId).toBe('settings')
  })

  it('preview surface includes all app-level nodes', () => {
    const source = `app
  Panel "Menu"
  Tabbar
    Tab "Home"`
    const result = parseMarkframe(source)
    expect(result.surfaces).toHaveLength(1)
    expect(result.surfaces[0].surfaceId).toBe('_app-preview')

    const surface = result.tree!.get('_app-preview')!
    const types = surface.children!.map(c => c.type)
    expect(types).toContain('Panel')
    expect(types).toContain('Tabbar')
  })

  it('lowercase tabbar/tab in app block are mapped to PascalCase', () => {
    const source = `app
  tabbar
    tab "Home" -> home
---
view home
  Text "Hi"`
    const tree = parse(source)
    const tabbar = tree.get('home')!.children!.find(c => c.type === 'Tabbar')!
    expect(tabbar).toBeDefined()
    expect(tabbar.children![0].type).toBe('Tab')
  })
})

// ===========================================================================
// 9. Comments & Whitespace
// ===========================================================================
describe('Comments & Whitespace', () => {
  it('// line comments are stripped', () => {
    const source = `view v
  // This is a comment
  Button "Click"`
    const tree = parse(source)
    expect(tree.get('v')!.children).toHaveLength(1)
    expect(tree.get('v')!.children![0].type).toBe('Button')
  })

  it('blank lines are skipped', () => {
    const source = `view v

  Button "A"

  Button "B"
`
    const tree = parse(source)
    expect(tree.get('v')!.children).toHaveLength(2)
  })

  it('comment-only document returns empty Map', () => {
    const source = `// Just a comment
// Another comment`
    const result = parseMarkframe(source)
    expect(result.error).toBeNull()
    expect(result.tree!.size).toBe(0)
  })

  it('trailing whitespace is handled', () => {
    const source = 'view v   \n  Button "Click"   '
    const tree = parse(source)
    expect(tree.get('v')!.children![0].props?.label).toBe('Click')
  })

  it('comments between components do not affect hierarchy', () => {
    const source = `view v
  List
    // Header items
    ListItem "A"
    // Footer items
    ListItem "B"`
    const tree = parse(source)
    const list = tree.get('v')!.children![0]
    expect(list.children).toHaveLength(2)
  })
})

// ===========================================================================
// 10. Auto ID Generation
// ===========================================================================
describe('Auto ID Generation', () => {
  it('IDs follow {viewId}-{type}-{counter} format', () => {
    const tree = parse('view home\n  Button "A"')
    const btn = tree.get('home')!.children![0]
    expect(btn.id).toMatch(/^home-button-\d+$/)
  })

  it('IDs are deterministic', () => {
    const source = 'view v\n  Button "A"\n  Text "B"'
    const tree1 = parse(source)
    const tree2 = parse(source)
    const ids1 = tree1.get('v')!.children!.map(c => c.id)
    const ids2 = tree2.get('v')!.children!.map(c => c.id)
    expect(ids1).toEqual(ids2)
  })

  it('counter increments across components in a view', () => {
    const tree = parse('view v\n  Button "A"\n  Button "B"\n  Text "C"')
    const children = tree.get('v')!.children!
    const ids = children.map(c => c.id)
    // Each should have a unique counter
    const counters = ids.map(id => parseInt(id.split('-').pop()!))
    expect(new Set(counters).size).toBe(3)
    // Counters should be sequential
    expect(counters[1]).toBe(counters[0] + 1)
    expect(counters[2]).toBe(counters[1] + 1)
  })

  it('counter continues across views', () => {
    const source = `view a
  Button "A"
---
view b
  Button "B"`
    const tree = parse(source)
    const aBtn = tree.get('a')!.children![0]
    const bBtn = tree.get('b')!.children![0]
    const aCounter = parseInt(aBtn.id.split('-').pop()!)
    const bCounter = parseInt(bBtn.id.split('-').pop()!)
    expect(bCounter).toBeGreaterThan(aCounter)
  })

  it('surface ID equals view name', () => {
    const tree = parse('view my-page\n  Text "Hi"')
    const surface = tree.get('my-page')!
    expect(surface.id).toBe('my-page')
    expect(surface.surfaceId).toBe('my-page')
  })

  it('component type in ID is lowercase', () => {
    const tree = parse('view v\n  ListItem "X"')
    const item = tree.get('v')!.children![0]
    expect(item.id).toContain('listitem')
  })
})

// ===========================================================================
// 11. String Escaping
// ===========================================================================
describe('String Escaping', () => {
  it('escaped quotes inside strings', () => {
    const tree = parse('view v\n  Text "He said \\"hello\\""')
    expect(tree.get('v')!.children![0].props?.text).toBe('He said "hello"')
  })

  it('escaped backslashes', () => {
    const tree = parse('view v\n  Text "path\\\\to\\\\file"')
    expect(tree.get('v')!.children![0].props?.text).toBe('path\\to\\file')
  })

  it('escaped newlines', () => {
    const tree = parse('view v\n  Text "line1\\nline2"')
    expect(tree.get('v')!.children![0].props?.text).toBe('line1\nline2')
  })

  it('escaping in named prop values', () => {
    const tree = parse('view v\n  Button "X" tooltip="Say \\"hi\\""')
    expect(tree.get('v')!.children![0].props?.tooltip).toBe('Say "hi"')
  })
})

// ===========================================================================
// 12. Edge Cases & Error Handling
// ===========================================================================
describe('Edge Cases & Error Handling', () => {
  it('unrecognized characters in props generate warnings', () => {
    const result = parseMarkframe('view v\n  Button "X" @weird')
    expect(result.error).toBeNull()
    expect(result.warnings).toBeDefined()
    expect(result.warnings!.length).toBeGreaterThan(0)
    expect(result.warnings![0].message).toContain('@')
  })

  it('very long lines parse without error', () => {
    const longLabel = 'A'.repeat(1000)
    const tree = parse(`view v\n  Button "${longLabel}"`)
    expect(tree.get('v')!.children![0].props?.label).toBe(longLabel)
  })

  it('deeply nested components (10+ levels)', () => {
    let source = 'view v\n'
    let indent = 2
    for (let i = 0; i < 12; i++) {
      source += ' '.repeat(indent) + `Block "Level ${i}"\n`
      indent += 2
    }
    const tree = parse(source)
    let node = tree.get('v')!.children![0]
    for (let i = 0; i < 11; i++) {
      expect(node.children!.length).toBeGreaterThanOrEqual(1)
      node = node.children![0]
    }
    expect(node.type).toBe('Block')
  })

  it('unknown component types still parse', () => {
    const tree = parse('view v\n  FooBar "test"')
    const node = tree.get('v')!.children![0]
    expect(node.type).toBe('FooBar')
    // No primary prop mapping for unknown type, so no props extracted as primary
    // "test" would remain unparsed since FooBar is not in PRIMARY_PROP
  })

  it('--- as first line', () => {
    const source = `---
view home
  Text "Hi"`
    const tree = parse(source)
    expect(tree.has('home')).toBe(true)
  })

  it('consecutive --- separators', () => {
    const source = `view a
  Text "A"
---
---
view b
  Text "B"`
    const tree = parse(source)
    expect(tree.has('a')).toBe(true)
    expect(tree.has('b')).toBe(true)
  })

  it('unicode in strings', () => {
    const tree = parse('view v\n  Text "Hello 🌍 Привет 你好"')
    expect(tree.get('v')!.children![0].props?.text).toBe('Hello 🌍 Привет 你好')
  })

  it('unicode in prop values', () => {
    const tree = parse('view v\n  Button "X" tooltip="Ñoño"')
    expect(tree.get('v')!.children![0].props?.tooltip).toBe('Ñoño')
  })

  it('error for non-view at top level', () => {
    const result = parseMarkframe('Button "X"')
    expect(result.error).not.toBeNull()
    expect(result.error).toContain('Expected "view" or "app"')
  })

  it('error for view without ID', () => {
    const result = parseMarkframe('view')
    expect(result.error).not.toBeNull()
    expect(result.error).toContain('view missing ID')
  })

  it('Windows line endings (\\r\\n) are handled', () => {
    const source = 'view v\r\n  Button "A"\r\n  Button "B"'
    const tree = parse(source)
    expect(tree.get('v')!.children).toHaveLength(2)
  })
})

// ===========================================================================
// 13. Snapshot Tests (Complex Multi-View Documents)
// ===========================================================================
describe('Snapshot Tests', () => {
  it('login screen snapshot', () => {
    const source = `view login
  Navbar "Login"
  TextField "Email" type=email
  TextField "Password" type=password
  Button "Sign In" -> dashboard
  Link "Forgot Password?" -> forgot`
    const result = parseMarkframe(source)
    expect(result.error).toBeNull()
    expect(result.surfaces).toMatchSnapshot()

    // Snapshot the tree structure (serialize Map)
    const surface = result.tree!.get('login')!
    expect(surface.children!.map(c => ({
      type: c.type,
      props: c.props,
    }))).toMatchSnapshot()
  })

  it('multi-view app with tabbar snapshot', () => {
    const source = `app
  Tabbar
    Tab "Home" -> home
    Tab "Search" -> search
    Tab "Profile" -> profile
---
view home
  Navbar "Home"
  Card "Welcome"
    Text "Hello, user!"
  List
    ListItem "Recent Activity"
    ListItem "Notifications"
---
view search
  Navbar "Search"
  TextField "Search" placeholder="Search..."
  List
    ListItem "Result 1"
    ListItem "Result 2"
---
view profile
  Navbar "Profile"
  Avatar "avatar.png"
  Text "John Doe"
  Button "Edit Profile"
  Button "Logout" outline`
    const result = parseMarkframe(source)
    expect(result.error).toBeNull()
    expect(result.surfaces).toHaveLength(3)

    // Snapshot each view's component types
    for (const { surfaceId } of result.surfaces) {
      const surface = result.tree!.get(surfaceId)!
      const nodes = flatNodes(surface)
      expect({
        viewId: surfaceId,
        components: nodes.map(n => ({ type: n.type, props: n.props })),
      }).toMatchSnapshot()
    }
  })

  it('settings page with nested lists snapshot', () => {
    const source = `view settings
  Navbar "Settings"
  List
    ListItem "Account" -> account
    ListItem "Notifications" -> notifications
    ListItem "Privacy" -> privacy
  BlockHeader "Preferences"
  List
    ListItem "Dark Mode"
      Switch "Enabled"
    ListItem "Language"
      Chip "English"
  Button "Sign Out" outline`
    const result = parseMarkframe(source)
    expect(result.error).toBeNull()

    const surface = result.tree!.get('settings')!
    const nodes = flatNodes(surface)
    expect(nodes.map(n => ({
      type: n.type,
      props: n.props,
      childCount: n.children?.length ?? 0,
    }))).toMatchSnapshot()
  })
})

// ===========================================================================
// 11. App Preview (Incremental Rendering)
// ===========================================================================
describe('App Preview - Incremental Rendering', () => {
  it('creates preview surface when only "app" is typed', () => {
    const source = 'app'
    const result = parseMarkframe(source)
    expect(result.error).toBeNull()
    expect(result.surfaces).toHaveLength(1)
    expect(result.surfaces[0].surfaceId).toBe('_app-preview')

    const surface = result.tree!.get('_app-preview')!
    expect(surface.type).toBe('Surface')
    expect(surface.children).toHaveLength(0) // No tabbar yet
  })

  it('creates preview surface with empty tabbar when "app + tabbar" is typed', () => {
    const source = `app
  tabbar`
    const result = parseMarkframe(source)
    expect(result.error).toBeNull()
    expect(result.surfaces).toHaveLength(1)

    const surface = result.tree!.get('_app-preview')!
    expect(surface.children).toHaveLength(1)

    const tabbar = surface.children![0]
    expect(tabbar.type).toBe('Tabbar')
    expect(tabbar.children).toHaveLength(0) // No tabs yet
  })

  it('creates preview surface with empty tabbar that defaults active to 0', () => {
    const source = `app
  tabbar`
    const result = parseMarkframe(source)
    expect(result.error).toBeNull()
    expect(result.surfaces).toHaveLength(1)

    const surface = result.tree!.get('_app-preview')!
    expect(surface.children).toHaveLength(1)

    const tabbar = surface.children![0]
    expect(tabbar.type).toBe('Tabbar')
    expect(tabbar.props?.active).toBe(0)
    expect(tabbar.children).toHaveLength(0) // No tabs yet
  })

  it('creates preview surface with tabbar and tabs incrementally', () => {
    const source = `app
  tabbar
    tab "Home" icon=home -> home
    tab "Profile" icon=person -> profile`
    const result = parseMarkframe(source)
    expect(result.error).toBeNull()
    expect(result.surfaces).toHaveLength(1)

    const surface = result.tree!.get('_app-preview')!
    const tabbar = surface.children![0]
    expect(tabbar.type).toBe('Tabbar')
    expect(tabbar.props?.active).toBe(0) // defaults to 0 in preview
    expect(tabbar.children).toHaveLength(2)

    const tabs = tabbar.children!
    expect(tabs[0].type).toBe('Tab')
    expect(tabs[0].props?.label).toBe('Home')
    expect(tabs[0].props?.icon).toBe('home')
    expect(tabs[1].props?.label).toBe('Profile')
  })

  it('does NOT create preview surface when view exists', () => {
    const source = `app
  tabbar
    tab "Home" icon=home -> home

---

view home
  Navbar "Home"
  Text "Welcome"`
    const result = parseMarkframe(source)
    expect(result.error).toBeNull()
    expect(result.surfaces).toHaveLength(1)

    // Should have the real view, not the preview
    expect(result.surfaces[0].surfaceId).toBe('home')
    expect(result.tree!.has('_app-preview')).toBe(false)

    // Real view should have the tabbar injected
    const homeView = result.tree!.get('home')!
    const hasTabbar = homeView.children!.some(c => c.type === 'Tabbar')
    expect(hasTabbar).toBe(true)
  })

  it('preview surface disappears when first view is added', () => {
    // First state: just app + tabbar
    const state1 = `app
  tabbar
    tab "Home" icon=home`
    const result1 = parseMarkframe(state1)
    expect(result1.surfaces).toHaveLength(1)
    expect(result1.surfaces[0].surfaceId).toBe('_app-preview')

    // Second state: view added
    const state2 = `app
  tabbar
    tab "Home" icon=home

---

view home
  Navbar "Home"`
    const result2 = parseMarkframe(state2)
    expect(result2.surfaces).toHaveLength(1)
    expect(result2.surfaces[0].surfaceId).toBe('home')
    expect(result2.tree!.has('_app-preview')).toBe(false)
  })
})

// ===========================================================================
// 14. Array Escape Sequences
// ===========================================================================
describe('Array Escape Sequences', () => {
  it('array with escaped backslash in quoted item', () => {
    const tree = parse('view v\n  Radio "Pick" options=["path\\\\to\\\\file"]')
    expect(tree.get('v')!.children![0].props?.options).toEqual(['path\\to\\file'])
  })

  it('array with escaped quote in item', () => {
    const tree = parse('view v\n  Radio "Pick" options=["She said \\"hi\\""]')
    expect(tree.get('v')!.children![0].props?.options).toEqual(['She said "hi"'])
  })

  it('array ending with quoted string as last item', () => {
    const tree = parse('view v\n  Radio "Pick" options=["First", "Last"]')
    expect(tree.get('v')!.children![0].props?.options).toEqual(['First', 'Last'])
  })

  it('array with only quoted strings', () => {
    const tree = parse('view v\n  Radio "Pick" options=["Alpha", "Beta", "Gamma"]')
    expect(tree.get('v')!.children![0].props?.options).toEqual(['Alpha', 'Beta', 'Gamma'])
  })

  it('array with mixed bare and quoted items ending with quoted', () => {
    const tree = parse('view v\n  Radio "Pick" options=[Bare, "Quoted Last"]')
    expect(tree.get('v')!.children![0].props?.options).toEqual(['Bare', 'Quoted Last'])
  })

  it('array with escaped newline in quoted item', () => {
    const tree = parse('view v\n  Radio "Pick" options=["line1\\nline2"]')
    expect(tree.get('v')!.children![0].props?.options).toEqual(['line1\nline2'])
  })
})

// ===========================================================================
// 15. App Block Exclusion
// ===========================================================================
describe('App Block Exclusion', () => {
  it('view with noApp flag does NOT receive app block injection', () => {
    const source = `app
  Tabbar
    Tab "Home" -> home
---
view login noApp
  Text "Login"`
    const tree = parse(source)
    const login = tree.get('login')!
    // Should NOT have Tabbar
    const hasTabbar = login.children!.some(c => c.type === 'Tabbar')
    expect(hasTabbar).toBe(false)
  })

  it('view without noApp flag DOES receive app block injection', () => {
    const source = `app
  Tabbar
    Tab "Home" -> home
---
view home
  Text "Home"`
    const tree = parse(source)
    const home = tree.get('home')!
    // Should have Tabbar
    const hasTabbar = home.children!.some(c => c.type === 'Tabbar')
    expect(hasTabbar).toBe(true)
  })
})
