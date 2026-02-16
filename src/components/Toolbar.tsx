import { Smartphone, Tablet, Menu, FolderOpen, Save, X, RotateCw, ZoomIn, ZoomOut, HelpCircle } from 'lucide-react';
import { formatShortcutHint } from '../constants/shortcuts';
import { ZOOM_LEVELS } from '../engine/useMarkframe';
import type { DeviceSpec, DeviceOrientation } from '../types/device';

interface ToolbarProps {
  surfaces: { id: string; surfaceId: string; label: string }[];
  activeSurfaceId: string | null;
  onSurfaceChange: (surfaceId: string) => void;
  theme: 'ios' | 'material';
  onOpen: () => void;
  onSave: () => void;
  onClose: () => void;
  fileName: string | null;
  selectedDevice: DeviceSpec;
  onDeviceChange: (device: DeviceSpec) => void;
  availableDevices: DeviceSpec[];
  orientation: DeviceOrientation;
  onOrientationChange: (orientation: DeviceOrientation) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onShowShortcuts: () => void;
  onToggleEditor: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  surfaces,
  activeSurfaceId,
  onSurfaceChange,
  theme,
  onOpen,
  onSave,
  onClose,
  fileName,
  selectedDevice,
  onDeviceChange,
  availableDevices,
  orientation,
  onOrientationChange,
  zoom,
  onZoomChange,
  onShowShortcuts,
  onToggleEditor,
}) => {
  const toggleOrientation = () => {
    onOrientationChange(orientation === 'portrait' ? 'landscape' : 'portrait');
  };

  const zoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      onZoomChange(ZOOM_LEVELS[currentIndex + 1]);
    }
  };

  const zoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex > 0) {
      onZoomChange(ZOOM_LEVELS[currentIndex - 1]);
    }
  };

  const resetZoom = () => {
    onZoomChange(1.0);
  };
  return (
    <header className="flex items-center justify-between h-12 px-4 bg-[#1e1e1e] border-b border-[#333] text-white shrink-0">
      {/* Left Section: Branding & Menu */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleEditor}
          className="p-1 hover:bg-[#333] rounded-md transition-colors"
        >
          <Menu size={18} className="text-gray-400" />
        </button>
  
        <div className="flex items-center gap-2 select-none mr-4">
          <img src={`${import.meta.env.BASE_URL}app.png`} alt="Logo" className="w-8 h-8 object-cover rounded-lg" />          
          <span className="font-semibold tracking-wide">markframe</span>
        </div>
        
        {/* File Actions */}
        <div className="flex items-center gap-1 border-l border-[#333] pl-3">
          <button onClick={onOpen} className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors" title={`Open (${formatShortcutHint('Cmd+O')})`}>
            <FolderOpen size={16} />
          </button>
          <button onClick={onSave} className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors" title={`Save (${formatShortcutHint('Cmd+S')})`}>
            <Save size={16} />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors" title="Close Project">
            <X size={16} />
          </button>
        </div>

        {/* File Name */}
        {fileName && (
          <span className="text-xs text-gray-500 ml-1 truncate max-w-[200px]">{fileName}</span>
        )}
      </div>

      {/* Center Section: Device & Surface Selectors */}
      <div className="flex-1 flex justify-center items-center gap-3">
        {/* Device Selector */}
        <div className="relative flex items-center gap-2">
          {/* Device Icon */}
          <div className="text-gray-400">
            {selectedDevice.formFactor === 'tablet' ? (
              <Tablet size={16} />
            ) : (
              <Smartphone size={16} />
            )}
          </div>

          {/* Device Dropdown */}
          <select
            className="appearance-none flex items-center gap-2 px-3 py-1.5 pr-8 bg-[#2d2d2d] rounded text-sm text-gray-300 hover:bg-[#383838] cursor-pointer transition-colors border border-transparent hover:border-[#444] outline-none focus:border-blue-500"
            value={selectedDevice.id}
            onChange={(e) => {
              const device = availableDevices.find(d => d.id === e.target.value);
              if (device) onDeviceChange(device);
            }}
          >
            <optgroup label="iOS Phones">
              {availableDevices
                .filter(d => d.platform === 'ios' && d.formFactor === 'phone')
                .map(d => (
                  <option key={d.id} value={d.id}>
                    {d.shortName || d.name}
                  </option>
                ))
              }
            </optgroup>
            <optgroup label="iOS Tablets">
              {availableDevices
                .filter(d => d.platform === 'ios' && d.formFactor === 'tablet')
                .map(d => (
                  <option key={d.id} value={d.id}>
                    {d.shortName || d.name}
                  </option>
                ))
              }
            </optgroup>
            <optgroup label="Android Phones">
              {availableDevices
                .filter(d => d.platform === 'android' && d.formFactor === 'phone')
                .map(d => (
                  <option key={d.id} value={d.id}>
                    {d.shortName || d.name}
                  </option>
                ))
              }
            </optgroup>
            <optgroup label="Android Tablets">
              {availableDevices
                .filter(d => d.platform === 'android' && d.formFactor === 'tablet')
                .map(d => (
                  <option key={d.id} value={d.id}>
                    {d.shortName || d.name}
                  </option>
                ))
              }
            </optgroup>
          </select>

          {/* Custom Arrow */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
            ▼
          </div>
        </div>

        {/* Orientation Toggle */}
        <button
          onClick={toggleOrientation}
          className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors"
          title={`Switch to ${orientation === 'portrait' ? 'Landscape' : 'Portrait'} (${formatShortcutHint('Cmd+R')})`}
        >
          <RotateCw
            size={16}
            className={`transition-transform duration-200 ${
              orientation === 'landscape' ? 'rotate-90' : ''
            }`}
          />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-[#444]" />

        {/* Surface Selector */}
        <div className="relative">
          <select
            className="appearance-none flex items-center gap-2 px-3 py-1.5 pr-8 bg-[#2d2d2d] rounded text-sm text-gray-300 hover:bg-[#383838] cursor-pointer transition-colors border border-transparent hover:border-[#444] outline-none focus:border-blue-500"
            value={activeSurfaceId || ''}
            onChange={(e) => onSurfaceChange(e.target.value)}
            disabled={surfaces.length === 0}
          >
            {surfaces.length === 0 ? (
               <option value="" disabled>No surfaces</option>
            ) : (
              surfaces.map((s) => (
                <option key={s.id} value={s.surfaceId}>
                  {s.label || s.surfaceId}
                </option>
              ))
            )}
          </select>
           {/* Custom Arrow Icon Overlay since appearance-none removes default arrow */}
           <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
              ▼
           </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-[#444]" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={zoom === ZOOM_LEVELS[0]}
            className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title={`Zoom Out (${formatShortcutHint('Cmd+-')})`}
          >
            <ZoomOut size={16} />
          </button>

          <button
            onClick={resetZoom}
            className="px-2 py-1 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors text-sm font-mono min-w-[4rem] text-center"
            title={`Reset Zoom (${formatShortcutHint('Cmd+0')})`}
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={zoomIn}
            disabled={zoom === ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
            className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title={`Zoom In (${formatShortcutHint('Cmd++')})`}
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Indicator (read-only, driven by device selection) */}
        <span className="ml-2 px-2 py-1 text-xs text-gray-400 select-none">
          {theme === 'ios' ? 'iOS' : 'Material'}
        </span>
        
        <button
          onClick={onShowShortcuts}
          className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors ml-2"
          title={`Keyboard Shortcuts (${formatShortcutHint('Cmd+?')})`}
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </header>
  );
};

export default Toolbar;
