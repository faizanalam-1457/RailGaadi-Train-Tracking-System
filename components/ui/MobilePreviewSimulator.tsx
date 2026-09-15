'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, ZoomIn, ZoomOut, X, Tablet, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DevicePreset {
  id: string;
  name: string;
  type: 'phone' | 'tablet';
  width: number;
  height: number;
  borderRadius: string;
  hasDynamicIsland?: boolean;
}

const DEVICES: DevicePreset[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    type: 'phone',
    width: 393,
    height: 852,
    borderRadius: 'rounded-[48px]',
    hasDynamicIsland: true,
  },
  {
    id: 'pixel-8',
    name: 'Google Pixel 8',
    type: 'phone',
    width: 412,
    height: 915,
    borderRadius: 'rounded-[44px]',
    hasDynamicIsland: false,
  },
  {
    id: 'samsung-s24',
    name: 'Samsung Galaxy S24',
    type: 'phone',
    width: 360,
    height: 780,
    borderRadius: 'rounded-[40px]',
    hasDynamicIsland: false,
  },
  {
    id: 'ipad-mini',
    name: 'iPad Mini',
    type: 'tablet',
    width: 744,
    height: 1040,
    borderRadius: 'rounded-[32px]',
    hasDynamicIsland: false,
  },
];

export function MobilePreviewSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('iphone-15-pro');
  const [isLandscape, setIsLandscape] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [currentUrl, setCurrentUrl] = useState<string>('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [isOpen]);

  const selectedDevice = DEVICES.find((d) => d.id === selectedDeviceId) || DEVICES[0];

  const deviceWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const deviceHeight = isLandscape ? selectedDevice.width : selectedDevice.height;

  // Auto adjust zoom on small desktop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setZoomScale(0.65);
      } else if (window.innerHeight < 900) {
        setZoomScale(0.75);
      } else {
        setZoomScale(0.85);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold bg-rail-blue/10 text-rail-blue hover:bg-rail-blue/20 dark:bg-rail-blue/20 dark:text-sky-300 dark:hover:bg-rail-blue/30 transition-all border border-rail-blue/20 shadow-sm"
        title="Mobile Phone Viewport Preview"
      >
        <Smartphone className="h-4 w-4" />
        <span className="hidden sm:inline">Mobile Preview</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200 overflow-hidden select-none">
      {/* Top Bar Controls */}
      <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <Smartphone className="h-5 w-5 text-rail-blue" />
            <span>Mobile Device Simulator</span>
          </div>
          <span className="hidden md:inline-block text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {deviceWidth} × {deviceHeight} px
          </span>
        </div>

        {/* Device Switcher & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Preset Buttons */}
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
            {DEVICES.map((device) => {
              const isSelected = device.id === selectedDeviceId;
              return (
                <button
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all',
                    isSelected
                      ? 'bg-rail-blue text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  {device.type === 'tablet' ? (
                    <Tablet className="h-3.5 w-3.5" />
                  ) : (
                    <Smartphone className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">{device.name}</span>
                </button>
              );
            })}
          </div>

          {/* Orientation Button */}
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className={cn(
              'flex items-center justify-center p-2 rounded-xl border text-xs font-medium transition-all',
              isLandscape
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            )}
            title="Rotate Device Orientation"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => setZoomScale(Math.max(0.5, zoomScale - 0.1))}
              className="p-1 text-slate-400 hover:text-white rounded-md"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono font-medium text-slate-300">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale(Math.min(1.2, zoomScale + 0.1))}
              className="p-1 text-slate-400 hover:text-white rounded-md"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center h-9 w-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
            title="Exit Mobile Simulator"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Simulator Viewport Area */}
      <main className="flex-1 relative flex items-center justify-center p-4 overflow-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div
          className="transition-all duration-300 ease-out origin-center flex items-center justify-center"
          style={{
            transform: `scale(${zoomScale})`,
          }}
        >
          {/* Phone Frame */}
          <div
            className={cn(
              'relative bg-slate-900 border-[10px] border-slate-800 shadow-2xl transition-all duration-300 ring-1 ring-slate-700/50 overflow-hidden',
              selectedDevice.borderRadius
            )}
            style={{
              width: deviceWidth + 20,
              height: deviceHeight + 20,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(2, 132, 199, 0.15)',
            }}
          >
            {/* Phone Bezel Buttons (Volume & Power simulation) */}
            <div className="absolute -left-[14px] top-24 h-12 w-1 bg-slate-700 rounded-l-md" />
            <div className="absolute -left-[14px] top-40 h-12 w-1 bg-slate-700 rounded-l-md" />
            <div className="absolute -right-[14px] top-28 h-16 w-1 bg-slate-700 rounded-r-md" />

            {/* Device Screen Area */}
            <div
              className="relative bg-slate-950 overflow-hidden h-full w-full flex flex-col"
              style={{
                borderRadius: 'calc(var(--radius) * 1.8)',
              }}
            >
              {/* Dynamic Island / Notch */}
              {selectedDevice.hasDynamicIsland && !isLandscape && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 h-5 w-24 bg-black rounded-full flex items-center justify-between px-2 shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-slate-900 border border-slate-700" />
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              )}

              {!selectedDevice.hasDynamicIsland && !isLandscape && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 z-50 h-4 w-28 bg-black rounded-b-xl flex items-center justify-center">
                  <div className="h-1.5 w-12 rounded-full bg-slate-800" />
                </div>
              )}

              {/* Status Bar */}
              <div className="h-7 w-full bg-slate-950 text-white flex items-center justify-between px-6 pt-1 text-[11px] font-semibold z-40 select-none">
                <span>9:41</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Interactive Screen iFrame */}
              <div className="flex-1 w-full h-full relative bg-background">
                <iframe
                  key={iframeKey}
                  src={currentUrl}
                  className="w-full h-full border-0 select-auto"
                  title="Mobile Preview Frame"
                />
              </div>

              {/* Home Bar Indicator */}
              <div className="h-5 w-full bg-slate-950 flex items-center justify-center z-40 select-none">
                <div className="h-1 w-32 bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="h-8 border-t border-slate-800 bg-slate-900 px-4 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Check className="h-3 w-3 text-emerald-400" />
          <span>Live Interactive Touch Preview Mode</span>
        </div>
        <div>
          <span>Tip: Click elements inside phone frame to test navigation & views</span>
        </div>
      </footer>
    </div>
  );
}
