import { useState, useMemo, useEffect } from 'react';
import { parseMarkframe } from './markframeParser';
import { openFile, saveFile } from '../api/fileAccess';
import type { ParseResult } from '../types/markframe';
import { DEFAULT_DEVICE, getDeviceById } from '../devices/deviceLibrary';
import type { DeviceSpec, DeviceOrientation } from '../types/device';

export const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.25, 1.5];

export function useMarkframe(initialContent: string | null) {
  const [content, setContent] = useState<string | null>(initialContent);
  const [activeSurfaceId, setActiveSurfaceId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'ios' | 'material'>('material');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileHandle, setFileHandle] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Load persisted device
  const [selectedDevice, setSelectedDevice] = useState<DeviceSpec>(() => {
    const saved = localStorage.getItem('markframe-selected-device');
    if (saved) {
      const device = getDeviceById(saved);
      if (device) return device;
    }
    return DEFAULT_DEVICE;
  });

  // Load persisted orientation
  const [orientation, setOrientation] = useState<DeviceOrientation>(() => {
    const saved = localStorage.getItem('markframe-orientation');
    return saved === 'landscape' ? 'landscape' : 'portrait';
  });

  // Load persisted zoom level
  const [zoom, setZoom] = useState<number>(() => {
    const saved = localStorage.getItem('markframe-zoom');
    const parsed = saved ? parseFloat(saved) : 1.0;
    return ZOOM_LEVELS.includes(parsed) ? parsed : 1.0;
  });

  const parsed = useMemo<ParseResult>(() => {
    if (content === null) {
      return { error: null, tree: null, surfaces: [] };
    }
    return parseMarkframe(content);
  }, [content]);

  // Persist device selection
  useEffect(() => {
    localStorage.setItem('markframe-selected-device', selectedDevice.id);
  }, [selectedDevice]);

  // Persist orientation
  useEffect(() => {
    localStorage.setItem('markframe-orientation', orientation);
  }, [orientation]);

  // Persist zoom level
  useEffect(() => {
    localStorage.setItem('markframe-zoom', zoom.toString());
  }, [zoom]);

  // Auto-select first surface if activeSurfaceId is null or invalid
  useEffect(() => {
    if (parsed.surfaces.length > 0) {
      // If no active surface is selected, or the currently selected one is no longer in the list
      const currentExists = parsed.surfaces.some(s => s.surfaceId === activeSurfaceId);

      if (!activeSurfaceId || !currentExists) {
        const firstSurfaceId = parsed.surfaces[0].surfaceId;
        // Defer to next tick to avoid React state update during render
        setTimeout(() => setActiveSurfaceId(firstSurfaceId), 0);
      }
    }
  }, [parsed.surfaces, activeSurfaceId]);

  const openProject = async () => {
    try {
      const { handle, content: fileContent, name } = await openFile();
      setContent(fileContent);
      setFileHandle(handle);
      setFileName(name);
    } catch (err) {
      // Ignore AbortError (user cancelled)
      if ((err as Error).name !== 'AbortError') {
        console.error('Failed to open file:', err);
      }
    }
  };

  const saveProject = async () => {
    try {
      const handle = await saveFile(fileHandle, content || ''); // Handle null content safely
      setFileHandle(handle);
      if (handle && handle.name) setFileName(handle.name);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Failed to save file:', err);
      }
    }
  };

  const closeProject = () => {
    setContent(null);
    setFileHandle(null);
    setFileName(null);
    setActiveSurfaceId(null);
  };

  return {
    content, setContent,
    activeSurfaceId, setActiveSurfaceId,
    theme, setTheme,
    parsed,
    fileName,
    openProject,
    saveProject,
    closeProject,
    selectedDevice,
    setSelectedDevice,
    orientation,
    setOrientation,
    zoom,
    setZoom,
  };
}

