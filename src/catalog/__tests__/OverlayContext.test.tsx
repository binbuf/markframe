import { renderHook, act } from '@testing-library/react';
import { OverlayProvider, useOverlay } from '../OverlayContext';

describe('OverlayContext', () => {
  it('provides overlay functions', () => {
    const { result } = renderHook(() => useOverlay(), {
      wrapper: ({ children }) => <OverlayProvider>{children}</OverlayProvider>,
    });
    expect(result.current.activeOverlays).toBeInstanceOf(Set);
    expect(typeof result.current.openOverlay).toBe('function');
    expect(typeof result.current.closeOverlay).toBe('function');
    expect(typeof result.current.toggleOverlay).toBe('function');
  });

  it('starts with empty active overlays', () => {
    const { result } = renderHook(() => useOverlay(), {
      wrapper: ({ children }) => <OverlayProvider>{children}</OverlayProvider>,
    });
    expect(result.current.activeOverlays.size).toBe(0);
  });

  it('opens and closes overlays', () => {
    const { result } = renderHook(() => useOverlay(), {
      wrapper: ({ children }) => <OverlayProvider>{children}</OverlayProvider>,
    });

    act(() => result.current.openOverlay('sheet-1'));
    expect(result.current.activeOverlays.has('sheet-1')).toBe(true);

    act(() => result.current.closeOverlay('sheet-1'));
    expect(result.current.activeOverlays.has('sheet-1')).toBe(false);
  });

  it('toggles overlays', () => {
    const { result } = renderHook(() => useOverlay(), {
      wrapper: ({ children }) => <OverlayProvider>{children}</OverlayProvider>,
    });

    act(() => result.current.toggleOverlay('dialog-1'));
    expect(result.current.activeOverlays.has('dialog-1')).toBe(true);

    act(() => result.current.toggleOverlay('dialog-1'));
    expect(result.current.activeOverlays.has('dialog-1')).toBe(false);
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useOverlay());
    }).toThrow('useOverlay must be used within an OverlayProvider');
  });

  it('supports multiple overlays open simultaneously', () => {
    const { result } = renderHook(() => useOverlay(), {
      wrapper: ({ children }) => <OverlayProvider>{children}</OverlayProvider>,
    });

    act(() => {
      result.current.openOverlay('sheet-1');
      result.current.openOverlay('dialog-1');
      result.current.openOverlay('popup-1');
    });

    expect(result.current.activeOverlays.has('sheet-1')).toBe(true);
    expect(result.current.activeOverlays.has('dialog-1')).toBe(true);
    expect(result.current.activeOverlays.has('popup-1')).toBe(true);
    expect(result.current.activeOverlays.size).toBe(3);
  });

  it('opening same overlay twice is idempotent', () => {
    const { result } = renderHook(() => useOverlay(), {
      wrapper: ({ children }) => <OverlayProvider>{children}</OverlayProvider>,
    });

    act(() => result.current.openOverlay('sheet-1'));
    expect(result.current.activeOverlays.size).toBe(1);

    act(() => result.current.openOverlay('sheet-1'));
    expect(result.current.activeOverlays.size).toBe(1);
    expect(result.current.activeOverlays.has('sheet-1')).toBe(true);
  });

  it('closing an already-closed overlay is safe', () => {
    const { result } = renderHook(() => useOverlay(), {
      wrapper: ({ children }) => <OverlayProvider>{children}</OverlayProvider>,
    });

    // Close an overlay that was never opened
    act(() => result.current.closeOverlay('nonexistent'));
    expect(result.current.activeOverlays.size).toBe(0);

    // Open then close twice
    act(() => result.current.openOverlay('sheet-1'));
    act(() => result.current.closeOverlay('sheet-1'));
    act(() => result.current.closeOverlay('sheet-1'));
    expect(result.current.activeOverlays.size).toBe(0);
  });

  it('closing one overlay does not affect others', () => {
    const { result } = renderHook(() => useOverlay(), {
      wrapper: ({ children }) => <OverlayProvider>{children}</OverlayProvider>,
    });

    act(() => {
      result.current.openOverlay('sheet-1');
      result.current.openOverlay('dialog-1');
    });
    expect(result.current.activeOverlays.size).toBe(2);

    act(() => result.current.closeOverlay('sheet-1'));
    expect(result.current.activeOverlays.has('sheet-1')).toBe(false);
    expect(result.current.activeOverlays.has('dialog-1')).toBe(true);
    expect(result.current.activeOverlays.size).toBe(1);
  });

  it('toggle works with multiple overlays', () => {
    const { result } = renderHook(() => useOverlay(), {
      wrapper: ({ children }) => <OverlayProvider>{children}</OverlayProvider>,
    });

    act(() => {
      result.current.openOverlay('sheet-1');
      result.current.openOverlay('dialog-1');
    });

    // Toggle sheet-1 off, dialog-1 should remain
    act(() => result.current.toggleOverlay('sheet-1'));
    expect(result.current.activeOverlays.has('sheet-1')).toBe(false);
    expect(result.current.activeOverlays.has('dialog-1')).toBe(true);

    // Toggle sheet-1 back on
    act(() => result.current.toggleOverlay('sheet-1'));
    expect(result.current.activeOverlays.has('sheet-1')).toBe(true);
    expect(result.current.activeOverlays.has('dialog-1')).toBe(true);
  });
});
