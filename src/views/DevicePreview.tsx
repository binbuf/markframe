import React, { useEffect, useRef } from 'react';
import { App } from 'konsta/react';
import type { MarkframeNode } from '../types/markframe';
import type { DeviceSpec, DeviceOrientation } from '../types/device';
import { renderNode } from '../catalog/renderNode';
import { NavigationProvider } from '../catalog/NavigationContext';
import { DeviceProvider } from '../catalog/DeviceContext';
import { TreeProvider } from '../catalog/TreeContext';
import { OverlayProvider } from '../catalog/OverlayContext';
import { getOrientedDimensions, getLandscapeFeatureStyle } from '../devices/deviceUtils';

interface DevicePreviewProps {
  activeSurface: MarkframeNode | null;
  theme: 'ios' | 'material';
  error: string | null;
  device: DeviceSpec;
  orientation: DeviceOrientation;
  zoom: number;
  showDeviceInfo?: boolean;
  onNavigate?: (surfaceId: string) => void;
  tree?: Map<string, MarkframeNode> | null;
}

const DevicePreview: React.FC<DevicePreviewProps> = ({
  activeSurface,
  theme,
  error,
  device,
  orientation,
  zoom,
  showDeviceInfo = true,
  onNavigate,
  tree = null,
}) => {
  const validZoom = Math.max(0.5, Math.min(1.5, zoom));
  const { width: deviceWidth, height: deviceHeight } = getOrientedDimensions(device, orientation);
  const screenRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll emulation
  useEffect(() => {
    const node = screenRef.current;
    if (!node) return;

    let isDown = false;
    let startY = 0;
    let startX = 0;
    let startScrollTop = 0;
    let startScrollLeft = 0;
    let scrollContainer: HTMLElement | null = null;
    let hasMoved = false;

    const handleMouseDown = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      scrollContainer = null;

      // Find scrollable ancestor
      while (target && target !== node) {
        const style = window.getComputedStyle(target);
        
        const isScrollableY = 
          (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          target.scrollHeight > target.clientHeight;

        const isScrollableX = 
          (style.overflowX === 'auto' || style.overflowX === 'scroll') &&
          target.scrollWidth > target.clientWidth;

        if (isScrollableY || isScrollableX) {
          scrollContainer = target;
          break;
        }
        target = target.parentElement as HTMLElement;
      }

      if (scrollContainer) {
        isDown = true;
        startY = e.pageY;
        startX = e.pageX;
        startScrollTop = scrollContainer.scrollTop;
        startScrollLeft = scrollContainer.scrollLeft;
        hasMoved = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown || !scrollContainer) return;
      e.preventDefault();
      
      const y = e.pageY;
      const x = e.pageX;
      
      const walkY = y - startY; // 1:1 movement
      const walkX = x - startX;
      
      scrollContainer.scrollTop = startScrollTop - walkY;
      scrollContainer.scrollLeft = startScrollLeft - walkX;

      if (Math.abs(walkY) > 5 || Math.abs(walkX) > 5) {
        hasMoved = true;
      }
    };

    const handleMouseUp = () => {
      isDown = false;
      // hasMoved reset happens in click or next interaction
    };

    const handleClick = (e: MouseEvent) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
      hasMoved = false;
    };

    // Prevent native drag of images/links and right-click context menu
    const handleDragStart = (e: DragEvent) => e.preventDefault();
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    node.addEventListener('mousedown', handleMouseDown);
    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseup', handleMouseUp);
    node.addEventListener('mouseleave', handleMouseUp);
    node.addEventListener('click', handleClick, true);
    node.addEventListener('dragstart', handleDragStart);
    node.addEventListener('contextmenu', handleContextMenu);

    return () => {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseup', handleMouseUp);
      node.removeEventListener('mouseleave', handleMouseUp);
      node.removeEventListener('click', handleClick, true);
      node.removeEventListener('dragstart', handleDragStart);
      node.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div
      className="w-full h-full bg-[#2d2d2d] relative overflow-auto"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#888 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Centering wrapper - uses min-height/min-width to allow scrolling when zoomed in */}
      <div
        className="flex items-center justify-center"
        style={{
          minWidth: `${deviceWidth * validZoom + 80}px`,
          minHeight: `${deviceHeight * validZoom + 80}px`,
          height: '100%',
        }}
      >
        {/* Device Frame */}
        <div
          className="relative bg-black shadow-2xl transition-all duration-500 ease-out overflow-hidden"
          style={{
            width: `${deviceWidth}px`,
            height: `${deviceHeight}px`,
            borderRadius: `${device.features.borderRadius || 40}px`,
            boxShadow: device.frame.shadow,
            transform: `scale(${validZoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Screen Content */}
          <div
            ref={screenRef}
            className="w-full h-full overflow-hidden device-screen mobile-touch-target"
            style={{
              borderRadius: `${device.features.borderRadius || 40}px`,
              color: '#000',
            }}
          >
            {/* Konsta App handles theming and layout.
                safeAreas={true} to use the CSS variables we inject below.
            */}
            <App
              theme={theme}
              className="!min-h-0 h-full"
              safeAreas={true}
            >
              {error && (
                <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
                  <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-100 font-mono text-sm whitespace-pre-wrap w-full max-w-md">
                    <strong className="block mb-2 text-red-400">Parsing Error</strong>
                    {error}
                  </div>
                </div>
              )}

              {!activeSurface && !error && (
                <div className="h-full flex items-center justify-center text-gray-400 p-8 text-center">
                  <p>No active surface found.<br/>Ensure your markframe includes a <code>view</code> declaration to start rendering.</p>
                </div>
              )}

              {activeSurface && !error && (
                <TreeProvider tree={tree}>
                  <OverlayProvider>
                    <DeviceProvider value={{ device, orientation, theme }}>
                      <NavigationProvider value={onNavigate}>
                        <div
                          className="absolute inset-0"
                          style={{
                            // Inject safe area CSS variables for Konsta UI
                            '--k-safe-area-top': `${orientation === 'portrait' ? device.safeArea.top : 0}px`,
                            '--k-safe-area-bottom': `${device.safeArea.bottom}px`,
                            '--k-safe-area-left': `${orientation === 'landscape' ? device.safeArea.top : 0}px`,
                            '--k-safe-area-right': '0px',
                          } as React.CSSProperties}
                        >
                          {renderNode(activeSurface, theme)}
                        </div>
                      </NavigationProvider>
                    </DeviceProvider>
                  </OverlayProvider>
                </TreeProvider>
              )}
            </App>
          </div>


          {/* Device features rendered AFTER screen content to overlay on top */}

          {/* Dynamic Island (iPhone 14 Pro+) */}
          {device.features.dynamicIsland && orientation === 'portrait' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-50 pointer-events-none"
              style={{
                top: '12px',
                width: '126px',
                height: '37px',
              }}
            />
          )}

          {/* Punch Hole Camera (Android) */}
          {device.features.punchHole && orientation === 'portrait' && (
            <div
              className="absolute bg-black rounded-full z-50 pointer-events-none"
              style={{
                top: '10px',
                width: `${device.features.punchHoleDiameter ?? 20}px`,
                height: `${device.features.punchHoleDiameter ?? 20}px`,
                left: device.features.punchHole === 'center'
                  ? '50%'
                  : device.features.punchHole === 'left'
                  ? '32px'
                  : 'auto',
                right: device.features.punchHole === 'right' ? '32px' : 'auto',
                transform: device.features.punchHole === 'center' ? 'translateX(-50%)' : 'none',
              }}
            />
          )}

          {/* Landscape Dynamic Island / Punch Hole */}
          {(() => {
            const landscapeFeatureStyle = getLandscapeFeatureStyle(device, orientation);
            return landscapeFeatureStyle && orientation === 'landscape' && (
              <div style={landscapeFeatureStyle} />
            );
          })()}

          {/* iOS Home Indicator */}
          {device.platform === 'ios' && device.safeArea.bottom > 0 && orientation === 'portrait' && (
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/30 rounded-full z-50 pointer-events-none"
              style={{
                width: device.formFactor === 'tablet' ? '160px' : '134px',
                height: '5px',
              }}
            />
          )}
        </div>
      </div>

      {/* Device Info Overlay */}
      {showDeviceInfo && (
        <div className="sticky bottom-4 w-full flex justify-center pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-gray-300">
            {device.shortName || device.name} • {deviceWidth}×{deviceHeight} • Zoom: {Math.round(validZoom * 100)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicePreview;

