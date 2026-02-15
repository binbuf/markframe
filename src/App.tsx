import { useEffect, useState, useMemo, useRef } from 'react';
import Toolbar from './components/Toolbar';
import ErrorBoundary from './components/ErrorBoundary';
import ValidationPanel from './components/ValidationPanel';
import ShortcutsDialog from './components/ShortcutsDialog';
import { SplitPane } from 'react-split-pane';
import EditorPane from './views/EditorPane';
import DevicePreview from './views/DevicePreview';
import WelcomeScreen from './views/WelcomeScreen';
import { useMarkframe, ZOOM_LEVELS } from './engine/useMarkframe';
import { blueprints } from './blueprints';
import { devices } from './devices/deviceLibrary';
import { validateMarkframe, type ValidationResult } from './utils/validation';

const DEFAULT_PROJECT_CONTENT = `view main\n  Text "New Project"\n`;

function App() {
  const {
    content, setContent,
    parsed,
    activeSurfaceId, setActiveSurfaceId,
    theme, setTheme,
    fileName, openProject, saveProject, closeProject,
    selectedDevice, setSelectedDevice,
    orientation, setOrientation,
    zoom, setZoom,
  } = useMarkframe(null);

  // Validation
  const [showValidation, setShowValidation] = useState(false);
  const validationResult = useMemo<ValidationResult | null>(() => {
    if (content === null) return null;
    return validateMarkframe(content);
  }, [content]);

  useEffect(() => {
    if (validationResult && (validationResult.errors.length > 0 || validationResult.warnings.length > 0)) {
      setShowValidation(true);
    }
  }, [validationResult]);

  // Update theme when device changes
  useEffect(() => {
    if (selectedDevice.platform === 'ios' && theme !== 'ios') {
      setTheme('ios');
    } else if (selectedDevice.platform === 'android' && theme !== 'material') {
      setTheme('material');
    }
  }, [selectedDevice.platform, theme, setTheme]);

  // Shortcuts dialog & device info overlay
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showDeviceInfo, setShowDeviceInfo] = useState(true);
  const [showEditor, setShowEditor] = useState(true);

  // Blueprint navigation tracking
  const blueprintIndexRef = useRef(0);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const cmdKey = e.ctrlKey || e.metaKey;
      if (!cmdKey) return;

      // Skip shortcuts when typing in input/textarea (let Monaco handle its own)
      const target = e.target as HTMLElement;
      const isEditorFocused = target.closest('.monaco-editor') != null;

      // Open project: Cmd+O
      if (e.key === 'o') {
        e.preventDefault();
        openProject();
        return;
      }

      // Save project: Cmd+S
      if (e.key === 's') {
        e.preventDefault();
        saveProject();
        return;
      }

      // Show shortcuts: Cmd+?
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
        return;
      }

      // Toggle orientation: Cmd+R
      if (e.key === 'r') {
        e.preventDefault();
        setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
        return;
      }

      // Toggle device info: Cmd+I
      if (!e.shiftKey && e.key === 'i' && !isEditorFocused) {
        e.preventDefault();
        setShowDeviceInfo(prev => !prev);
        return;
      }

      // Zoom In: Cmd + = or Cmd + +
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setZoom(prev => {
          const currentIndex = ZOOM_LEVELS.indexOf(prev);
          if (currentIndex === -1) return ZOOM_LEVELS[2]; // default to 1.0
          return currentIndex < ZOOM_LEVELS.length - 1 ? ZOOM_LEVELS[currentIndex + 1] : prev;
        });
        return;
      }

      // Zoom Out: Cmd + -
      if (e.key === '-') {
        e.preventDefault();
        setZoom(prev => {
          const currentIndex = ZOOM_LEVELS.indexOf(prev);
          if (currentIndex === -1) return ZOOM_LEVELS[2]; // default to 1.0
          return currentIndex > 0 ? ZOOM_LEVELS[currentIndex - 1] : prev;
        });
        return;
      }

      // Reset Zoom: Cmd + 0
      if (e.key === '0') {
        e.preventDefault();
        setZoom(1.0);
        return;
      }

      // Next device: Cmd+]
      if (!e.shiftKey && e.key === ']') {
        e.preventDefault();
        const currentIndex = devices.findIndex(d => d.id === selectedDevice.id);
        const nextIndex = (currentIndex + 1) % devices.length;
        setSelectedDevice(devices[nextIndex]);
        return;
      }

      // Previous device: Cmd+[
      if (!e.shiftKey && e.key === '[') {
        e.preventDefault();
        const currentIndex = devices.findIndex(d => d.id === selectedDevice.id);
        const prevIndex = (currentIndex - 1 + devices.length) % devices.length;
        setSelectedDevice(devices[prevIndex]);
        return;
      }

      // Next blueprint: Cmd+Shift+] (key is } when shift held)
      if (e.shiftKey && (e.key === '}' || e.key === ']')) {
        e.preventDefault();
        blueprintIndexRef.current = (blueprintIndexRef.current + 1) % blueprints.length;
        const bp = blueprints[blueprintIndexRef.current];
        setContent(bp.data);
        return;
      }

      // Previous blueprint: Cmd+Shift+[ (key is { when shift held)
      if (e.shiftKey && (e.key === '{' || e.key === '[')) {
        e.preventDefault();
        blueprintIndexRef.current = (blueprintIndexRef.current - 1 + blueprints.length) % blueprints.length;
        const bp = blueprints[blueprintIndexRef.current];
        setContent(bp.data);
        return;
      }

      // Select device by number: Cmd+1-9
      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const deviceIndex = parseInt(e.key) - 1;
        if (deviceIndex < devices.length) {
          setSelectedDevice(devices[deviceIndex]);
        }
        return;
      }

      // Focus editor: Cmd+E
      if (!e.shiftKey && e.key === 'e') {
        e.preventDefault();
        const editor = document.querySelector('.monaco-editor textarea') as HTMLElement;
        editor?.focus();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openProject, saveProject, setOrientation, setZoom, selectedDevice, setSelectedDevice, setContent]);

  const activeSurfaceNode = activeSurfaceId && parsed.tree ? parsed.tree.get(activeSurfaceId) || null : null;

  const handleNewProject = (initialData?: string) => {
    if (initialData) {
      setContent(initialData);
    } else {
      setContent(DEFAULT_PROJECT_CONTENT);
    }
  };

  if (content === null) {
    return (
      <WelcomeScreen 
        onNewProject={handleNewProject}
        onOpenFile={openProject}
      />
    );
  }


  return (
    <>
      <Toolbar
        surfaces={parsed.surfaces}
        activeSurfaceId={activeSurfaceId}
        onSurfaceChange={setActiveSurfaceId}
        theme={theme}
        onOpen={openProject}
        onSave={saveProject}
        onClose={closeProject}
        fileName={fileName}
        selectedDevice={selectedDevice}
        onDeviceChange={setSelectedDevice}
        availableDevices={devices}
        orientation={orientation}
        onOrientationChange={setOrientation}
        zoom={zoom}
        onZoomChange={setZoom}
        onShowShortcuts={() => setShowShortcuts(true)}
        onToggleEditor={() => setShowEditor(prev => !prev)}
      />
      <div className="flex-1 relative overflow-hidden">
        {showEditor ? (
          /* @ts-expect-error: react-split-pane types might be slightly off for React 18/19 */
          <SplitPane split="vertical" minSize={300} defaultSize="50%" maxSize={-300}>
            <div className="h-full w-full relative">
              <EditorPane value={content} onChange={setContent} />
              {showValidation && validationResult && (
                <ValidationPanel
                  errors={validationResult.errors}
                  warnings={validationResult.warnings}
                  onClose={() => setShowValidation(false)}
                />
              )}
            </div>
            <div className="h-full w-full">
              <ErrorBoundary
                onError={(error, errorInfo) => {
                  console.error('Preview error:', error, errorInfo);
                }}
              >
                <DevicePreview
                  activeSurface={activeSurfaceNode}
                  theme={theme}
                  error={parsed.error}
                  device={selectedDevice}
                  orientation={orientation}
                  zoom={zoom}
                  showDeviceInfo={showDeviceInfo}
                  tree={parsed.tree}
                  onNavigate={(surfaceId: string) => {
                    // Only navigate if the target is a known surface/view.
                    // Non-surface targets (e.g. overlay IDs) are handled by openOverlay in KListItem.
                    if (parsed.surfaces.some(s => s.surfaceId === surfaceId)) {
                      setActiveSurfaceId(surfaceId);
                    }
                  }}
                />
              </ErrorBoundary>
            </div>
          </SplitPane>
        ) : (
          <div className="h-full w-full">
            <ErrorBoundary
              onError={(error, errorInfo) => {
                console.error('Preview error:', error, errorInfo);
              }}
            >
              <DevicePreview
                activeSurface={activeSurfaceNode}
                theme={theme}
                error={parsed.error}
                device={selectedDevice}
                orientation={orientation}
                zoom={zoom}
                showDeviceInfo={showDeviceInfo}
                tree={parsed.tree}
                onNavigate={(surfaceId: string) => {
                  if (parsed.surfaces.some(s => s.surfaceId === surfaceId)) {
                    setActiveSurfaceId(surfaceId);
                  }
                }}
              />
            </ErrorBoundary>
          </div>
        )}
      </div>
      {showShortcuts && (
        <ShortcutsDialog onClose={() => setShowShortcuts(false)} />
      )}
    </>
  );
}

export default App;

