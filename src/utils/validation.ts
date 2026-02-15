import { parseMarkframe } from '../engine/markframeParser';
import catalog from '../catalog/index';

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate markframe content
 */
export function validateMarkframe(content: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!content.trim()) {
    errors.push({
      path: 'root',
      message: 'Document is empty',
      severity: 'error',
    });
    return { valid: false, errors, warnings };
  }

  const result = parseMarkframe(content);

  if (result.error) {
    errors.push({
      path: 'root',
      message: result.error,
      severity: 'error',
    });
    return { valid: false, errors, warnings };
  }

  // Check for at least one view
  if (result.surfaces.length === 0) {
    warnings.push({
      path: 'root',
      message: 'No view declarations found. Add "view <id>" to define a screen.',
      severity: 'warning',
    });
  }

  // Check for unknown component types
  const knownTypes = new Set(Object.keys(catalog));
  if (result.tree) {
    for (const surface of result.tree.values()) {
      checkNodeTypes(surface, knownTypes, warnings);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function checkNodeTypes(
  node: { type: string; children?: { type: string; children?: any[] }[] },
  knownTypes: Set<string>,
  warnings: ValidationError[],
) {
  if (node.type !== 'Surface' && !knownTypes.has(node.type)) {
    warnings.push({
      path: node.type,
      message: `Unknown component type: ${node.type}`,
      severity: 'warning',
    });
  }
  if (node.children) {
    for (const child of node.children) {
      checkNodeTypes(child, knownTypes, warnings);
    }
  }
}

