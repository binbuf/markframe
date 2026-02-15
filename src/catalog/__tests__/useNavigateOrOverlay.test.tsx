import { renderHook, act } from '@testing-library/react';
import { useNavigateOrOverlay } from '../useNavigateOrOverlay';
import { useOverlay } from '../OverlayContext';
import { AllProviders, makeNode } from '../../test/helpers';
import { OVERLAY_TYPES } from '../shared';
import type { MarkframeNode } from '../../types/markframe';

describe('useNavigateOrOverlay', () => {
  it('returns a function', () => {
    const { result } = renderHook(() => useNavigateOrOverlay(), {
      wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
    });
    expect(typeof result.current).toBe('function');
  });

  it('calls navigate for non-overlay targets', () => {
    const navigate = vi.fn();
    const tree = new Map<string, MarkframeNode>();
    tree.set('page-1', makeNode({ id: 'page-1', type: 'Surface' }));

    const { result } = renderHook(() => useNavigateOrOverlay(), {
      wrapper: ({ children }) => (
        <AllProviders navigate={navigate} tree={tree}>
          {children}
        </AllProviders>
      ),
    });

    result.current('page-1');
    expect(navigate).toHaveBeenCalledWith('page-1');
  });

  it('does nothing when navigateTo is undefined', () => {
    const navigate = vi.fn();
    const { result } = renderHook(() => useNavigateOrOverlay(), {
      wrapper: ({ children }) => (
        <AllProviders navigate={navigate}>
          {children}
        </AllProviders>
      ),
    });

    result.current(undefined);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('opens overlay for overlay target types', () => {
    const tree = new Map<string, MarkframeNode>();
    tree.set('sheet-1', makeNode({ id: 'sheet-1', type: 'Sheet' }));

    const { result } = renderHook(
      () => ({
        handleNav: useNavigateOrOverlay(),
        overlay: useOverlay(),
      }),
      {
        wrapper: ({ children }) => (
          <AllProviders tree={tree}>
            {children}
          </AllProviders>
        ),
      },
    );

    act(() => result.current.handleNav('sheet-1'));
    expect(result.current.overlay.activeOverlays.has('sheet-1')).toBe(true);
  });

  it('does not call navigate for overlay target types', () => {
    const navigate = vi.fn();
    const tree = new Map<string, MarkframeNode>();
    tree.set('popup-1', makeNode({ id: 'popup-1', type: 'Popup' }));

    const { result } = renderHook(
      () => ({
        handleNav: useNavigateOrOverlay(),
        overlay: useOverlay(),
      }),
      {
        wrapper: ({ children }) => (
          <AllProviders navigate={navigate} tree={tree}>
            {children}
          </AllProviders>
        ),
      },
    );

    act(() => result.current.handleNav('popup-1'));
    expect(navigate).not.toHaveBeenCalled();
    expect(result.current.overlay.activeOverlays.has('popup-1')).toBe(true);
  });

  it.each(OVERLAY_TYPES)('routes %s type to overlay open', (overlayType) => {
    const navigate = vi.fn();
    const nodeId = `${overlayType.toLowerCase()}-1`;
    const tree = new Map<string, MarkframeNode>();
    tree.set(nodeId, makeNode({ id: nodeId, type: overlayType }));

    const { result } = renderHook(
      () => ({
        handleNav: useNavigateOrOverlay(),
        overlay: useOverlay(),
      }),
      {
        wrapper: ({ children }) => (
          <AllProviders navigate={navigate} tree={tree}>
            {children}
          </AllProviders>
        ),
      },
    );

    act(() => result.current.handleNav(nodeId));
    expect(navigate).not.toHaveBeenCalled();
    expect(result.current.overlay.activeOverlays.has(nodeId)).toBe(true);
  });

  it('calls navigate when target node is not in tree', () => {
    const navigate = vi.fn();
    const tree = new Map<string, MarkframeNode>();

    const { result } = renderHook(() => useNavigateOrOverlay(), {
      wrapper: ({ children }) => (
        <AllProviders navigate={navigate} tree={tree}>
          {children}
        </AllProviders>
      ),
    });

    result.current('unknown-target');
    expect(navigate).toHaveBeenCalledWith('unknown-target');
  });

  it('calls navigate for non-overlay component types', () => {
    const navigate = vi.fn();
    const nonOverlayTypes = ['Surface', 'Button', 'Text', 'List', 'Card', 'Navbar'];

    for (const type of nonOverlayTypes) {
      navigate.mockClear();
      const nodeId = `${type.toLowerCase()}-1`;
      const tree = new Map<string, MarkframeNode>();
      tree.set(nodeId, makeNode({ id: nodeId, type }));

      const { result } = renderHook(() => useNavigateOrOverlay(), {
        wrapper: ({ children }) => (
          <AllProviders navigate={navigate} tree={tree}>
            {children}
          </AllProviders>
        ),
      });

      result.current(nodeId);
      expect(navigate).toHaveBeenCalledWith(nodeId);
    }
  });
});
