import { renderHook, act } from '@testing-library/react';
import { useMarkframe, ZOOM_LEVELS } from './usemarkframe';

// Mock file access module
vi.mock('../api/fileAccess', () => ({
  openFile: vi.fn(),
  saveFile: vi.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe('useMarkframe', () => {
  describe('parsing', () => {
    it('parses source text into node tree', () => {
      const source = 'view home\n  Button "Click me"';
      const { result } = renderHook(() => useMarkframe(source));

      expect(result.current.parsed.error).toBeNull();
      expect(result.current.parsed.tree).not.toBeNull();
      expect(result.current.parsed.surfaces).toHaveLength(1);
      expect(result.current.parsed.surfaces[0].surfaceId).toBe('home');
    });

    it('returns surfaces from parsed views', () => {
      const source = 'view login\n  Button "Sign In"\n\nview dashboard\n  Text "Welcome"';
      const { result } = renderHook(() => useMarkframe(source));

      expect(result.current.parsed.surfaces).toHaveLength(2);
      expect(result.current.parsed.surfaces[0].surfaceId).toBe('login');
      expect(result.current.parsed.surfaces[1].surfaceId).toBe('dashboard');
    });

    it('produces tree with correct node structure', () => {
      const source = 'view home\n  Navbar "Home"\n  Button "Click"';
      const { result } = renderHook(() => useMarkframe(source));

      const tree = result.current.parsed.tree!;
      expect(tree.has('home')).toBe(true);

      const surface = tree.get('home')!;
      expect(surface.type).toBe('Surface');
      expect(surface.children).toHaveLength(2);
      expect(surface.children![0].type).toBe('Navbar');
      expect(surface.children![1].type).toBe('Button');
    });

    it('returns error state when parser fails', () => {
      const source = '!!!invalid markup';
      const { result } = renderHook(() => useMarkframe(source));

      expect(result.current.parsed.error).not.toBeNull();
      expect(result.current.parsed.tree).toBeNull();
    });

    it('returns empty result for null content', () => {
      const { result } = renderHook(() => useMarkframe(null));

      expect(result.current.parsed.error).toBeNull();
      expect(result.current.parsed.tree).toBeNull();
      expect(result.current.parsed.surfaces).toHaveLength(0);
    });

    it('returns empty tree for empty string', () => {
      const { result } = renderHook(() => useMarkframe(''));

      expect(result.current.parsed.error).toBeNull();
      expect(result.current.parsed.tree).not.toBeNull();
      expect(result.current.parsed.surfaces).toHaveLength(0);
    });
  });

  describe('memoization', () => {
    it('returns same parsed reference for same content', () => {
      const source = 'view home\n  Button "Click"';
      const { result, rerender } = renderHook(() => useMarkframe(source));

      const parsed1 = result.current.parsed;
      rerender();
      const parsed2 = result.current.parsed;

      expect(parsed1).toBe(parsed2);
    });

    it('recomputes when content changes via setContent', () => {
      const { result } = renderHook(() => useMarkframe('view home\n  Button "A"'));

      const parsed1 = result.current.parsed;

      act(() => result.current.setContent('view home\n  Button "B"'));

      const parsed2 = result.current.parsed;
      expect(parsed1).not.toBe(parsed2);
    });
  });

  describe('view state', () => {
    it('starts with null activeSurfaceId', () => {
      const { result } = renderHook(() => useMarkframe(null));
      expect(result.current.activeSurfaceId).toBeNull();
    });

    it('allows setting active surface', () => {
      const source = 'view home\n  Button "Click"\n\nview settings\n  Text "Prefs"';
      const { result } = renderHook(() => useMarkframe(source));

      act(() => result.current.setActiveSurfaceId('settings'));
      expect(result.current.activeSurfaceId).toBe('settings');
    });
  });

  describe('theme', () => {
    it('defaults to material theme', () => {
      const { result } = renderHook(() => useMarkframe(null));
      expect(result.current.theme).toBe('material');
    });

    it('allows changing theme', () => {
      const { result } = renderHook(() => useMarkframe(null));

      act(() => result.current.setTheme('ios'));
      expect(result.current.theme).toBe('ios');

      act(() => result.current.setTheme('material'));
      expect(result.current.theme).toBe('material');
    });
  });

  describe('device selection', () => {
    it('defaults to DEFAULT_DEVICE when no localStorage', () => {
      const { result } = renderHook(() => useMarkframe(null));
      // DEFAULT_DEVICE is iPhone 15 Pro
      expect(result.current.selectedDevice.id).toBe('iphone-15-pro');
    });

    it('persists device selection to localStorage', () => {
      const { result } = renderHook(() => useMarkframe(null));

      // The hook should write the default device to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'markframe-selected-device',
        expect.any(String),
      );
    });

    it('allows changing selected device', () => {
      const { result } = renderHook(() => useMarkframe(null));

      const newDevice = {
        ...result.current.selectedDevice,
        id: 'custom-device',
        name: 'Custom Device',
      };

      act(() => result.current.setSelectedDevice(newDevice));
      expect(result.current.selectedDevice.id).toBe('custom-device');
    });
  });

  describe('orientation', () => {
    it('defaults to portrait', () => {
      const { result } = renderHook(() => useMarkframe(null));
      expect(result.current.orientation).toBe('portrait');
    });

    it('loads persisted orientation from localStorage', () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'markframe-orientation') return 'landscape';
        return null;
      });

      const { result } = renderHook(() => useMarkframe(null));
      expect(result.current.orientation).toBe('landscape');
    });

    it('allows changing orientation', () => {
      const { result } = renderHook(() => useMarkframe(null));

      act(() => result.current.setOrientation('landscape'));
      expect(result.current.orientation).toBe('landscape');
    });

    it('persists orientation to localStorage', () => {
      const { result } = renderHook(() => useMarkframe(null));

      act(() => result.current.setOrientation('landscape'));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'markframe-orientation',
        'landscape',
      );
    });
  });

  describe('zoom', () => {
    it('defaults to 1.0', () => {
      const { result } = renderHook(() => useMarkframe(null));
      expect(result.current.zoom).toBe(1.0);
    });

    it('loads persisted zoom from localStorage', () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'markframe-zoom') return '0.75';
        return null;
      });

      const { result } = renderHook(() => useMarkframe(null));
      expect(result.current.zoom).toBe(0.75);
    });

    it('falls back to 1.0 for invalid localStorage zoom', () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'markframe-zoom') return '0.99'; // Not in ZOOM_LEVELS
        return null;
      });

      const { result } = renderHook(() => useMarkframe(null));
      expect(result.current.zoom).toBe(1.0);
    });

    it('allows changing zoom level', () => {
      const { result } = renderHook(() => useMarkframe(null));

      act(() => result.current.setZoom(1.5));
      expect(result.current.zoom).toBe(1.5);
    });

    it('persists zoom to localStorage', () => {
      const { result } = renderHook(() => useMarkframe(null));

      act(() => result.current.setZoom(0.5));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'markframe-zoom',
        '0.5',
      );
    });
  });

  describe('file management', () => {
    it('starts with null fileName', () => {
      const { result } = renderHook(() => useMarkframe(null));
      expect(result.current.fileName).toBeNull();
    });

    it('closeProject resets all state', () => {
      const source = 'view home\n  Button "Click"';
      const { result } = renderHook(() => useMarkframe(source));

      act(() => result.current.setActiveSurfaceId('home'));

      act(() => result.current.closeProject());

      expect(result.current.content).toBeNull();
      expect(result.current.fileName).toBeNull();
      expect(result.current.activeSurfaceId).toBeNull();
    });
  });

  describe('content updates', () => {
    it('allows setting content', () => {
      const { result } = renderHook(() => useMarkframe(null));

      act(() => result.current.setContent('view test\n  Text "Hello"'));

      expect(result.current.content).toBe('view test\n  Text "Hello"');
      expect(result.current.parsed.surfaces).toHaveLength(1);
    });

    it('re-parses when content changes', () => {
      const { result } = renderHook(() => useMarkframe('view a\n  Button "A"'));

      expect(result.current.parsed.surfaces[0].surfaceId).toBe('a');

      act(() => result.current.setContent('view b\n  Button "B"'));

      expect(result.current.parsed.surfaces[0].surfaceId).toBe('b');
    });
  });

  describe('ZOOM_LEVELS constant', () => {
    it('exports expected zoom levels', () => {
      expect(ZOOM_LEVELS).toEqual([0.5, 0.75, 1.0, 1.25, 1.5]);
    });

    it('includes 1.0 as default zoom', () => {
      expect(ZOOM_LEVELS).toContain(1.0);
    });
  });

  describe('openProject', () => {
    it('opens a file and sets content, fileHandle, and fileName', async () => {
      const { openFile } = await import('../api/fileAccess');
      const mockHandle = { name: 'test.mf' };
      (openFile as ReturnType<typeof vi.fn>).mockResolvedValue({
        handle: mockHandle,
        content: 'view home\n  Text "Hello"',
        name: 'test.mf',
      });

      const { result } = renderHook(() => useMarkframe(null));

      await act(async () => {
        await result.current.openProject();
      });

      expect(result.current.content).toBe('view home\n  Text "Hello"');
      expect(result.current.fileName).toBe('test.mf');
    });

    it('ignores AbortError when user cancels file picker', async () => {
      const { openFile } = await import('../api/fileAccess');
      const abortError = new DOMException('User cancelled', 'AbortError');
      (openFile as ReturnType<typeof vi.fn>).mockRejectedValue(abortError);
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useMarkframe(null));

      await act(async () => {
        await result.current.openProject();
      });

      // Should not log for AbortError
      expect(spy).not.toHaveBeenCalled();
      expect(result.current.content).toBeNull();
      spy.mockRestore();
    });

    it('logs non-AbortError errors', async () => {
      const { openFile } = await import('../api/fileAccess');
      const genericError = new Error('Disk error');
      (openFile as ReturnType<typeof vi.fn>).mockRejectedValue(genericError);
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useMarkframe(null));

      await act(async () => {
        await result.current.openProject();
      });

      expect(spy).toHaveBeenCalledWith('Failed to open file:', genericError);
      spy.mockRestore();
    });
  });

  describe('saveProject', () => {
    it('saves file and updates handle and fileName', async () => {
      const { saveFile } = await import('../api/fileAccess');
      const newHandle = { name: 'saved.mf' };
      (saveFile as ReturnType<typeof vi.fn>).mockResolvedValue(newHandle);

      const { result } = renderHook(() => useMarkframe('view home\n  Text "Hi"'));

      await act(async () => {
        await result.current.saveProject();
      });

      expect(result.current.fileName).toBe('saved.mf');
    });

    it('ignores AbortError when user cancels save dialog', async () => {
      const { saveFile } = await import('../api/fileAccess');
      const abortError = new DOMException('User cancelled', 'AbortError');
      (saveFile as ReturnType<typeof vi.fn>).mockRejectedValue(abortError);
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useMarkframe('view home\n  Text "Hi"'));

      await act(async () => {
        await result.current.saveProject();
      });

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('logs non-AbortError errors on save', async () => {
      const { saveFile } = await import('../api/fileAccess');
      const err = new Error('Write failed');
      (saveFile as ReturnType<typeof vi.fn>).mockRejectedValue(err);
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useMarkframe('some content'));

      await act(async () => {
        await result.current.saveProject();
      });

      expect(spy).toHaveBeenCalledWith('Failed to save file:', err);
      spy.mockRestore();
    });

    it('handles null handle from saveFile', async () => {
      const { saveFile } = await import('../api/fileAccess');
      (saveFile as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const { result } = renderHook(() => useMarkframe('content'));

      await act(async () => {
        await result.current.saveProject();
      });

      // fileName remains null since the returned handle is null
      expect(result.current.fileName).toBeNull();
    });
  });

  describe('auto-select surface', () => {
    it('auto-selects first surface when none is selected', async () => {
      vi.useFakeTimers();
      const source = 'view home\n  Button "Click"';
      const { result } = renderHook(() => useMarkframe(source));

      // The setTimeout(0) in the hook defers the auto-select
      await act(async () => {
        vi.runAllTimers();
      });

      expect(result.current.activeSurfaceId).toBe('home');
      vi.useRealTimers();
    });

    it('auto-selects first surface when current is invalid', async () => {
      vi.useFakeTimers();
      const source = 'view alpha\n  Text "A"\n\nview beta\n  Text "B"';
      const { result } = renderHook(() => useMarkframe(source));

      // Set an invalid surface ID
      act(() => result.current.setActiveSurfaceId('nonexistent'));
      await act(async () => {
        vi.runAllTimers();
      });

      expect(result.current.activeSurfaceId).toBe('alpha');
      vi.useRealTimers();
    });
  });

  describe('localStorage device restoration', () => {
    it('restores device from localStorage when valid', () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'markframe-selected-device') return 'iphone-15-pro';
        return null;
      });

      const { result } = renderHook(() => useMarkframe(null));
      expect(result.current.selectedDevice.id).toBe('iphone-15-pro');
    });

    it('falls back to DEFAULT_DEVICE for unknown device id', () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'markframe-selected-device') return 'nonexistent-device';
        return null;
      });

      const { result } = renderHook(() => useMarkframe(null));
      expect(result.current.selectedDevice.id).toBe('iphone-15-pro'); // DEFAULT_DEVICE
    });
  });
});
