export interface MarkframeNode {
  id: string;
  type: string;
  parentId: string | null;
  surfaceId?: string; // Only for Surface type
  props?: Record<string, unknown>;
  children?: MarkframeNode[];
}

export interface ParseResult {
  error: string | null;
  tree: Map<string, MarkframeNode> | null;
  surfaces: { id: string; surfaceId: string; label: string }[];
  warnings?: { line: number; message: string }[];
}

