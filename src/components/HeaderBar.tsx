import React, { useState } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, Settings, Camera, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/sound';
import { PhotoboothConfig } from '../types';

interface HeaderBarProps {
  config: PhotoboothConfig;
  onOpenAdmin: () => void;
  isCapturing?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ config, onOpenAdmin, isCapturing }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundOn, setSoundOn] = useState(config.soundEnabled);

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.setEnabled(next);
    if (next) sound.playClick();
  };

  return (
    <header className="h-14 sm:h-16 px-4 sm:px-8 studio-glass border-b border-white/[0.08] flex items-center justify-between z-40 select-none shrink-0 print:hidden">
      {/* Brand logo & Studio Name */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center shadow-lg text-white">
          <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-200" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-sm sm:text-base text-white font-heading">
              {config.eventName}
            </span>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-md bg-white/[0.06] text-neutral-300 font-semibold border border-white/10 tracking-wider uppercase">
              Studio
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 hidden md:block">Self-Service Automated Photobooth</p>
        </div>
      </div>

      {/* Center status during capture */}
      {isCapturing && (
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] sm:text-xs font-semibold animate-pulse">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500"></span>
          <span className="hidden xs:inline">SESI FOTO AKTIF</span>
          <span className="xs:hidden">REC</span>
        </div>
      )}

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={toggleSound}
          title={soundOn ? 'Mute Audio' : 'Unmute Audio'}
          className="p-2 sm:p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white transition active:scale-95 border border-white/10"
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" />}
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh Kiosk'}
          className="p-2 sm:p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white transition active:scale-95 border border-white/10"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" /> : <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenAdmin();
          }}
          title="Pengaturan Admin Kiosk (PIN)"
          className="p-2 sm:p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white transition active:scale-95 border border-white/10"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </header>
  );
};

