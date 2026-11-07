import React from 'react';
import { Camera, ArrowRight, ShieldCheck, Sparkles, Image, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';
import { PhotoboothConfig } from '../types';

interface WelcomeScreenProps {
  config: PhotoboothConfig;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ config, onStart }) => {
  const handleClick = () => {
    sound.playClick();
    onStart();
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex-1 flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 cursor-pointer overflow-y-auto select-none bg-radial from-neutral-900 via-neutral-950 to-black w-full"
    >
      {/* Subtle Studio Glow background */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-neutral-700/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 sm:w-96 sm:h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Banner */}
      <div className="w-full max-w-4xl flex flex-wrap gap-2 justify-between items-center z-10 pt-1 sm:pt-2">
        <span className="px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-2 shadow-sm tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          AUTONOMOUS STUDIO KIOSK
        </span>
        {config.requirePayment ? (
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-sm">
            {config.currency} {config.price.toLocaleString('id-ID')} / SESI
          </span>
        ) : (
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold shadow-sm tracking-wide">
            EDISI EVENT KHUSUS
          </span>
        )}
      </div>

      {/* Center Hero Section */}
      <div className="my-auto text-center z-10 max-w-3xl flex flex-col items-center py-6 sm:py-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-4 sm:mb-6 text-neutral-300 text-xs sm:text-sm font-medium tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>FOTO STRIP BERKUALITAS STUDIO • CETAK & DIGITAL</span>
        </div>

        {/* Big Clean Title */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white mb-4 sm:mb-6 font-heading">
          {config.eventName}
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-neutral-400 font-normal max-w-xl mb-8 sm:mb-12 leading-relaxed px-4">
          {config.subTitle || 'Abadikan momen berharga dengan pencahayaan studio profesional, filter elegan, dan cetakan beresolusi tinggi.'}
        </p>

        {/* Big Tap to Start Button */}
        <div className="group relative inline-flex items-center justify-center">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 blur-lg opacity-40 group-hover:opacity-80 transition duration-500 group-hover:scale-105"></div>
          <button
            onClick={handleClick}
            className="relative px-8 py-4 sm:px-12 sm:py-5 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-base sm:text-xl tracking-wide shadow-2xl flex items-center gap-3 sm:gap-4 transition transform active:scale-95"
          >
            <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-950 stroke-[2.2]" />
            <span>SENTUH UNTUK MULAI</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-950 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Footer 4-Step Highlight Grid */}
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 z-10 pb-2 sm:pb-4">
        <div className="p-3 sm:p-4 rounded-2xl studio-glass text-center">
          <div className="w-7 h-7 mx-auto rounded-lg bg-white/[0.08] text-white flex items-center justify-center mb-1.5 font-bold text-xs">
            1
          </div>
          <p className="text-xs font-semibold text-neutral-200">Pilih Format</p>
          <p className="text-[11px] text-neutral-400">20 Gaya format cetak</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl studio-glass text-center">
          <div className="w-7 h-7 mx-auto rounded-lg bg-white/[0.08] text-white flex items-center justify-center mb-1.5 font-bold text-xs">
            2
          </div>
          <p className="text-xs font-semibold text-neutral-200">Sesi Foto</p>
          <p className="text-[11px] text-neutral-400">Pemandu suara otomatis</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl studio-glass text-center">
          <div className="w-7 h-7 mx-auto rounded-lg bg-white/[0.08] text-white flex items-center justify-center mb-1.5 font-bold text-xs">
            3
          </div>
          <p className="text-xs font-semibold text-neutral-200">Kustomisasi</p>
          <p className="text-[11px] text-neutral-400">20 Frame & 20 Filter</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl studio-glass text-center">
          <div className="w-7 h-7 mx-auto rounded-lg bg-white/[0.08] text-white flex items-center justify-center mb-1.5 font-bold text-xs">
            4
          </div>
          <p className="text-xs font-semibold text-neutral-200">Cetak & QR</p>
          <p className="text-[11px] text-neutral-400">Instan simpan ke HP</p>
        </div>
      </div>
    </div>
  );
};

