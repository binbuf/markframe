import { type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import type { MarkframeNode } from '../types/markframe';
import { OverlayProvider } from '../catalog/OverlayContext';
import { NavigationProvider } from '../catalog/NavigationContext';
import { TreeProvider } from '../catalog/TreeContext';
import { DeviceProvider } from '../catalog/DeviceContext';
import type { DeviceSpec } from '../types/device';

/**
 * Factory for creating MarkframeNode test fixtures.
 */
export function makeNode(overrides: Partial<MarkframeNode> = {}): MarkframeNode {
  return {
    id: 'test-node-1',
    type: 'Button',
    parentId: null,
    props: {},
    children: [],
    ...overrides,
  };
}

/**
 * Default test device spec for components that require DeviceContext.
 */
export const testDevice: DeviceSpec = {
  id: 'test-phone',
  name: 'Test Phone',
  platform: 'ios',
  formFactor: 'phone',
  dimensions: { width: 390, height: 844, scale: 3 },
  safeArea: { top: 47, bottom: 34 },
  features: {},
  frame: {
    borderWidth: 1,
    borderColor: '#333',
    shadow: 'none',
    backgroundColor: '#000',
  },
};

/**
 * Wrapper that provides all required contexts for catalog components.
 */
export function AllProviders({
  children,
  navigate,
  tree,
}: {
  children: ReactNode;
  navigate?: (id: string) => void;
  tree?: Map<string, MarkframeNode> | null;
}) {
  return (
    <DeviceProvider value={{ device: testDevice, orientation: 'portrait', theme: 'ios' }}>
      <NavigationProvider value={navigate}>
        <TreeProvider tree={tree ?? null}>
          <OverlayProvider>
            {children}
          </OverlayProvider>
        </TreeProvider>
      </NavigationProvider>
    </DeviceProvider>
  );
}

/**
 * Custom render that wraps components in all required context providers.
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    navigate?: (id: string) => void;
    tree?: Map<string, MarkframeNode> | null;
  },
) {
  const { navigate, tree, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders navigate={navigate} tree={tree}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}
