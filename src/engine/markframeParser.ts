import type { MarkframeNode, ParseResult } from '../types/markframe';

/** Maps component type → primary prop name */
const PRIMARY_PROP: Record<string, string> = {
  Navbar: 'title', Text: 'text', Button: 'label', TextField: 'label',
  Card: 'title', ListItem: 'title', Icon: 'name', Chip: 'text',
  Badge: 'text', Link: 'text', Checkbox: 'label', Radio: 'label',
  Switch: 'label', Toggle: 'label', Dialog: 'title', Popup: 'title',
  Actions: 'title', Sheet: 'title', Fab: 'icon', Spacer: 'size',
  Block: 'text', Image: 'src', DialogButton: 'label', ActionsButton: 'label',
  Tab: 'label', ProgressBar: 'value', Grid: 'cols', Avatar: 'src',
  Message: 'text', MediaCard: 'title', Stat: 'value',
  Post: 'text', IconCircle: 'icon', Story: 'label',
  MenuItem: 'title',
  Stepper: 'value', Range: 'value', Toast: 'text',
};

interface ParsedLine {
  indent: number;
  kind: 'view' | 'app' | 'separator' | 'tabbar' | 'tab' | 'component';
  type: string;        // component type or keyword
  rawArgs: string;     // everything after the keyword
  lineNumber: number;
}

/**
 * Parse a markframe document into a MarkframeNode tree structure
 * used by the rendering engine.
 */
export function parseMarkframe(source: string): ParseResult {
  const lines = source.split(/\r?\n/);
  const parsed: ParsedLine[] = [];
  const warnings: { line: number; message: string }[] = [];

  // 1. Preprocess: strip comments, blank lines, extract indent + token
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    // Skip blank lines
    if (trimmed === '') continue;
    // Skip comment lines
    if (trimmed.startsWith('//')) continue;
    // Check for separator before regex (--- matches [\w-]+ so must be caught first)
    if (trimmed === '---') {
      parsed.push({ indent: 0, kind: 'separator', type: '---', rawArgs: '', lineNumber: i + 1 });
      continue;
    }

    const match = raw.match(/^(\s*)([\w-]+)\s*(.*?)\s*$/);
    if (!match) {
      return { error: `Line ${i + 1}: Cannot parse "${trimmed}"`, tree: null, surfaces: [] };
    }

    const indent = match[1].length;
    const keyword = match[2];
    const rest = match[3];

    let kind: ParsedLine['kind'];
    const lowerKeyword = keyword.toLowerCase();
    if (lowerKeyword === 'view') kind = 'view';
    else if (lowerKeyword === 'app') kind = 'app';
    else if (lowerKeyword === 'tabbar') kind = 'tabbar';
    else if (lowerKeyword === 'tab') kind = 'tab';
    else kind = 'component';

    parsed.push({ indent, kind, type: keyword, rawArgs: rest, lineNumber: i + 1 });
  }

  if (parsed.length === 0) {
    return { error: null, tree: new Map(), surfaces: [], warnings };
  }

  const nodeMap = new Map<string, MarkframeNode>();
  const roots = new Map<string, MarkframeNode>();
  const surfaces: { id: string; surfaceId: string; label: string }[] = [];
  let globalCounter = 0;

  // Track app-level component data
  let appBlock: { nodes: MarkframeNode[]; tabbarIndex: number | null } | null = null;

  // Split into sections by --- or by view/app at indent 0
  const sections: ParsedLine[][] = [];
  let currentSection: ParsedLine[] = [];
  for (const line of parsed) {
    if (line.kind === 'separator') {
      if (currentSection.length > 0) {
        sections.push(currentSection);
        currentSection = [];
      }
      continue;
    }
    // Auto-split when a new view or app block starts at column 0
    if ((line.kind === 'view' || line.kind === 'app') && line.indent === 0 && currentSection.length > 0) {
      sections.push(currentSection);
      currentSection = [];
    }
    currentSection.push(line);
  }
  if (currentSection.length > 0) {
    sections.push(currentSection);
  }

  let hasAppBlock = false;

  for (const section of sections) {
    if (section.length === 0) continue;
    const first = section[0];

    if (first.kind === 'app') {
      appBlock = parseAppBlock(section, warnings);
      hasAppBlock = true;
      continue;
    }

    if (first.kind === 'view') {
      const result = parseViewSection(section, globalCounter, nodeMap, roots, surfaces, appBlock, warnings);
      if (result.error) return { error: result.error, tree: null, surfaces: [], warnings };
      globalCounter = result.counter;
      continue;
    }

    return { error: `Line ${first.lineNumber}: Expected "view" or "app", got "${first.type}"`, tree: null, surfaces: [], warnings };
  }

  // If we have an app block but no views yet, create a temporary preview surface
  if (hasAppBlock && surfaces.length === 0) {
    const previewSurfaceId = '_app-preview';
    const previewSurface: MarkframeNode = {
      id: previewSurfaceId,
      type: 'Surface',
      parentId: null,
      surfaceId: previewSurfaceId,
      props: { label: 'App Preview' },
      children: [],
    };

    if (appBlock && appBlock.nodes.length > 0) {
      const counterRef = { value: globalCounter };

      for (let i = 0; i < appBlock.nodes.length; i++) {
        const template = appBlock.nodes[i];
        const clone = cloneNodeTree(template, previewSurfaceId, counterRef, nodeMap, previewSurfaceId);

        // For Tabbar in preview, default active to 0
        if (i === appBlock.tabbarIndex) {
          if (!clone.props) clone.props = {};
          if (clone.props.active === undefined) {
            clone.props.active = 0;
          }
        }

        previewSurface.children!.push(clone);
      }

      globalCounter = counterRef.value;
    }

    nodeMap.set(previewSurfaceId, previewSurface);
    roots.set(previewSurfaceId, previewSurface);
    surfaces.push({ id: previewSurfaceId, surfaceId: previewSurfaceId, label: 'App Preview' });
  }

  return { error: null, tree: nodeMap, surfaces, warnings: warnings.length > 0 ? warnings : undefined };
}

function parseAppBlock(lines: ParsedLine[], warnings: { line: number; message: string }[]): { nodes: MarkframeNode[]; tabbarIndex: number | null } {
  const nodes: MarkframeNode[] = [];
  const result = { nodes, tabbarIndex: null as number | null };

  if (lines.length <= 1) return result;

  const rootIndent = lines[0].indent;
  // Stack tracks indent level + node (null = app root)
  const stack: { indent: number; node: MarkframeNode | null }[] = [
    { indent: rootIndent, node: null }
  ];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Map lowercase tabbar/tab to PascalCase component types
    let componentType = line.type;
    if (line.kind === 'tabbar') componentType = 'Tabbar';
    else if (line.kind === 'tab') componentType = 'Tab';

    const props = parseProps(line.rawArgs, componentType, line.lineNumber, warnings);

    const node: MarkframeNode = {
      id: `_app-${componentType.toLowerCase()}-${i}`,
      type: componentType,
      parentId: null,
      props: Object.keys(props).length > 0 ? props : undefined,
      children: [],
    };

    // Pop stack to find parent by indent
    while (stack.length > 1 && stack[stack.length - 1].indent >= line.indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];
    if (parent.node === null) {
      // Direct child of app block (top-level)
      if (componentType === 'Tabbar') {
        result.tabbarIndex = nodes.length;
      }
      nodes.push(node);
    } else {
      parent.node.children!.push(node);
    }

    stack.push({ indent: line.indent, node });
  }

  return result;
}

/** Deep-clone an app-level node tree, assigning new IDs for a specific view */
function cloneNodeTree(
  template: MarkframeNode,
  viewId: string,
  counterRef: { value: number },
  nodeMap: Map<string, MarkframeNode>,
  parentId: string,
): MarkframeNode {
  const nodeId = `${viewId}-${template.type.toLowerCase()}-${counterRef.value}`;
  counterRef.value++;

  const clone: MarkframeNode = {
    id: nodeId,
    type: template.type,
    parentId,
    props: template.props ? { ...template.props } : undefined,
    children: [],
  };

  nodeMap.set(nodeId, clone);

  for (const child of template.children ?? []) {
    clone.children!.push(cloneNodeTree(child, viewId, counterRef, nodeMap, nodeId));
  }

  return clone;
}

function parseViewSection(
  lines: ParsedLine[],
  startCounter: number,
  nodeMap: Map<string, MarkframeNode>,
  roots: Map<string, MarkframeNode>,
  surfaces: { id: string; surfaceId: string; label: string }[],
  appBlock: { nodes: MarkframeNode[]; tabbarIndex: number | null } | null,
  warnings: { line: number; message: string }[],
): { error: string | null; counter: number } {
  const viewLine = lines[0];
  let counter = startCounter;

  // Parse view ID and props from rawArgs
  // "view <id> [label="..."]"
  const viewParts = viewLine.rawArgs.match(/^([\w-]+)\s*(.*?)\s*$/);
  if (!viewParts) {
    return { error: `Line ${viewLine.lineNumber}: view missing ID`, counter };
  }

  const viewId = viewParts[1];
  const viewPropsStr = viewParts[2];
  const viewProps = viewPropsStr ? parseProps(viewPropsStr, 'view') : {};
  const viewLabel = (viewProps.label as string) || viewId;

  // Create Surface node
  const surfaceNode: MarkframeNode = {
    id: viewId,
    type: 'Surface',
    parentId: null,
    surfaceId: viewId,
    props: { label: viewLabel },
    children: [],
  };
  nodeMap.set(viewId, surfaceNode);
  roots.set(viewId, surfaceNode);
  surfaces.push({ id: viewId, surfaceId: viewId, label: viewLabel });

  // Build parent stack: array of { indent, id }
  const stack: { indent: number; id: string }[] = [{ indent: viewLine.indent, id: viewId }];

  // Process component lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const componentType = line.type;

    // Determine parent by popping stack to find nearest lower indent
    while (stack.length > 1 && stack[stack.length - 1].indent >= line.indent) {
      stack.pop();
    }
    const parentId = stack[stack.length - 1].id;

    // Generate node ID
    const nodeId = `${viewId}-${componentType.toLowerCase()}-${counter}`;
    counter++;

    // Parse props
    const props = parseProps(line.rawArgs, componentType, line.lineNumber, warnings);

    // Use id prop if available, otherwise use generated ID
    const effectiveId = (props.id as string) || nodeId;

    // Create node
    const node: MarkframeNode = {
      id: effectiveId,
      type: componentType,
      parentId,
      props: Object.keys(props).length > 0 ? props : undefined,
      children: [],
    };

    nodeMap.set(effectiveId, node);

    // Attach to parent
    const parent = nodeMap.get(parentId);
    if (parent) {
      parent.children!.push(node);
    }

    // Push onto stack for potential children
    stack.push({ indent: line.indent, id: effectiveId });
  }

  // Inject app-level nodes into this view's surface
  if (appBlock && appBlock.nodes.length > 0 && !viewProps.noApp) {
    const counterRef = { value: counter };

    for (let i = 0; i < appBlock.nodes.length; i++) {
      const template = appBlock.nodes[i];
      const clone = cloneNodeTree(template, viewId, counterRef, nodeMap, viewId);

      // Special handling for Tabbar: auto-detect active tab
      if (i === appBlock.tabbarIndex) {
        const tabs = clone.children ?? [];
        const autoActive = tabs.findIndex(t => t.props?.navigateTo === viewId);
        if (!clone.props) clone.props = {};
        clone.props.active = autoActive >= 0 ? autoActive : 0;
      }

      surfaceNode.children!.push(clone);
    }

    counter = counterRef.value;
  }

  return { error: null, counter };
}

/**
 * Parse the rest-of-line into a props object.
 * Handles: primary prop (first quoted string or bare number for Spacer),
 * named props (key=value), boolean flags, navigation (-> target)
 */
function parseProps(rawArgs: string, componentType: string, lineNumber?: number, warnings?: { line: number; message: string }[]): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  if (!rawArgs.trim()) return props;

  let rest = rawArgs.trim();

  // 1. Extract navigation "-> target" from end
  const navMatch = rest.match(/->\s*([\w-]+)\s*$/);
  if (navMatch) {
    props.navigateTo = navMatch[1];
    rest = rest.slice(0, navMatch.index).trim();
  }

  // 2. Extract primary prop
  const primaryPropName = PRIMARY_PROP[componentType];
  if (primaryPropName) {
    // Try quoted string
    const quotedMatch = rest.match(/^"((?:[^"\\]|\\.)*)"/);
    if (quotedMatch) {
      props[primaryPropName] = unescapeString(quotedMatch[1]);
      rest = rest.slice(quotedMatch[0].length).trim();
    } else if (primaryPropName === 'size' || primaryPropName === 'icon' || primaryPropName === 'name' || primaryPropName === 'value' || primaryPropName === 'cols') {
      // For Spacer/ProgressBar/Grid: bare number as primary prop
      // For Fab/Icon: bare word as primary prop (icon name)
      const numMatch = rest.match(/^(\d+(?:\.\d+)?)\b/);
      if (numMatch) {
        props[primaryPropName] = parseFloat(numMatch[1]);
        rest = rest.slice(numMatch[0].length).trim();
      } else if (primaryPropName === 'icon' || primaryPropName === 'name') {
        // Fab/Icon primary prop: bare word (icon name) - but only if not key=value
        const bareMatch = rest.match(/^([\w-]+)(?=\s|$)/);
        if (bareMatch && !rest.slice(bareMatch[0].length).trimStart().startsWith('=')) {
          // Make sure it's not a known prop key
          if (!isNamedPropKey(bareMatch[1], rest.slice(bareMatch[0].length))) {
            props[primaryPropName] = bareMatch[1];
            rest = rest.slice(bareMatch[0].length).trim();
          }
        }
      }
    }
  }

  // 3. Parse remaining tokens: key=value pairs and boolean flags
  while (rest.length > 0) {
    // Try key=value
    const kvMatch = rest.match(/^([\w]+)=/);
    if (kvMatch) {
      const key = kvMatch[1];
      rest = rest.slice(kvMatch[0].length);

      // Parse value
      const { value, remaining } = parseValue(rest);
      props[key] = value;
      rest = remaining.trim();
      continue;
    }

    // Boolean flag (bare word)
    const flagMatch = rest.match(/^([\w-]+)(?:\s|$)/);
    if (flagMatch) {
      props[flagMatch[1]] = true;
      rest = rest.slice(flagMatch[0].length).trim();
      continue;
    }

    // Skip unrecognized character and warn
    const skippedChar = rest[0];
    if (lineNumber !== undefined && warnings) {
      warnings.push({
        line: lineNumber,
        message: `Unrecognized character '${skippedChar}' in props`,
      });
    }
    rest = rest.slice(1).trim();
  }

  return props;
}

/**
 * Parse a value after `key=`. Returns the parsed value and remaining string.
 */
function parseValue(rest: string): { value: unknown; remaining: string } {
  // Quoted string
  const quotedMatch = rest.match(/^"((?:[^"\\]|\\.)*)"/);
  if (quotedMatch) {
    return {
      value: unescapeString(quotedMatch[1]),
      remaining: rest.slice(quotedMatch[0].length),
    };
  }

  // Array [a, b, c] - with quote-aware splitting
  if (rest.startsWith('[')) {
    const closeBracket = findClosingBracket(rest);
    if (closeBracket !== -1) {
      const inner = rest.slice(1, closeBracket);
      const items = splitArrayItems(inner);
      return {
        value: items,
        remaining: rest.slice(closeBracket + 1),
      };
    }
  }

  // Percentage (e.g. 100%, 50.5%)
  const percentMatch = rest.match(/^(\d+(?:\.\d+)?)%/);
  if (percentMatch) {
    return {
      value: percentMatch[0],
      remaining: rest.slice(percentMatch[0].length),
    };
  }

  // Number
  const numMatch = rest.match(/^(\d+(?:\.\d+)?)\b/);
  if (numMatch) {
    return {
      value: parseFloat(numMatch[1]),
      remaining: rest.slice(numMatch[0].length),
    };
  }

  // Boolean
  if (rest.startsWith('true')) {
    return { value: true, remaining: rest.slice(4) };
  }
  if (rest.startsWith('false')) {
    return { value: false, remaining: rest.slice(5) };
  }

  // Bare word (string value)
  const bareMatch = rest.match(/^([\w-]+)/);
  if (bareMatch) {
    return {
      value: bareMatch[1],
      remaining: rest.slice(bareMatch[0].length),
    };
  }

  return { value: '', remaining: rest };
}

function unescapeString(s: string): string {
  return s.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n');
}

/**
 * Find the closing bracket ']' for an array, accounting for quoted strings.
 * Returns the index of the closing bracket, or -1 if not found.
 */
function findClosingBracket(rest: string): number {
  let inQuotes = false;
  let escapeNext = false;

  for (let i = 0; i < rest.length; i++) {
    const char = rest[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && char === ']') {
      return i;
    }
  }

  return -1;
}

/**
 * Split array items by comma, accounting for quoted strings.
 * Handles commas inside quoted strings correctly.
 */
function splitArrayItems(inner: string): string[] {
  const items: string[] = [];
  let currentItem = '';
  let inQuotes = false;
  let escapeNext = false;

  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];

    if (escapeNext) {
      currentItem += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      currentItem += char;
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      currentItem += char;
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && char === ',') {
      const trimmed = currentItem.trim();
      if (trimmed.length > 0) {
        // Remove surrounding quotes if present
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          items.push(unescapeString(trimmed.slice(1, -1)));
        } else {
          items.push(trimmed);
        }
      }
      currentItem = '';
      continue;
    }

    currentItem += char;
  }

  // Add the last item
  const trimmed = currentItem.trim();
  if (trimmed.length > 0) {
    // Remove surrounding quotes if present
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      items.push(unescapeString(trimmed.slice(1, -1)));
    } else {
      items.push(trimmed);
    }
  }

  return items;
}

/**
 * Heuristic: check if a bare word is actually a named prop key
 * (i.e., followed by = after optional whitespace)
 */
function isNamedPropKey(word: string, afterWord: string): boolean {
  // Check if the remaining string starts with = or the word itself is followed by =
  return afterWord.trimStart().startsWith('=') || /^[\w]+=/.test(word + afterWord.trimStart().charAt(0));
}

