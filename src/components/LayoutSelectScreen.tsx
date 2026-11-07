import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles, Filter } from 'lucide-react';
import { LayoutType } from '../types';
import { LAYOUT_OPTIONS } from '../constants';
import { sound } from '../utils/sound';

interface LayoutSelectScreenProps {
  selectedLayout: LayoutType;
  onSelectLayout: (layout: LayoutType) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LayoutSelectScreen: React.FC<LayoutSelectScreenProps> = ({
  selectedLayout,
  onSelectLayout,
  onNext,
  onBack
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Strip' | 'Grid' | 'Editorial' | 'Creative'>('All');

  const handleSelect = (id: LayoutType) => {
    sound.playClick();
    onSelectLayout(id);
  };

  const handleProceed = () => {
    sound.playClick();
    onNext();
  };

  const filteredOptions = activeCategory === 'All'
    ? LAYOUT_OPTIONS
    : LAYOUT_OPTIONS.filter(item => item.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-6 md:p-8 max-w-6xl mx-auto w-full select-none overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-neutral-300 text-xs sm:text-sm font-medium transition border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <span className="text-[11px] sm:text-xs px-3 py-1 rounded-full studio-glass text-neutral-300 font-semibold tracking-wider uppercase">
          LANGKAH 1: PILIH DARI 20 FORMAT CETAK
        </span>
      </div>

      {/* Main Selection Header */}
      <div className="text-center mb-3 shrink-0">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-1.5 font-heading tracking-tight">
          20 Format Cetak Kekinian
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto mb-3">
          Tersedia format strip 2x6 inci vertikal, kolase postcard 4x6, editorial majalah, hingga triptych panorama.
        </p>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 px-2 max-w-2xl mx-auto">
          {[
            { id: 'All', label: 'Semua (20)' },
            { id: 'Strip', label: 'Photostrip (2x6")' },
            { id: 'Grid', label: 'Grid Album (4x6")' },
            { id: 'Editorial', label: 'Editorial Magazine' },
            { id: 'Creative', label: 'Kreatif & Unik' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-white text-neutral-950 shadow-md font-bold'
                  : 'bg-white/[0.06] text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[50vh] sm:max-h-[56vh] overflow-y-auto p-1.5 my-auto">
        {filteredOptions.map((item) => {
          const isSelected = selectedLayout === item.id;
          const isStrip = item.paperSize === '2x6';

          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`relative p-3 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col items-center justify-between text-center ${
                isSelected
                  ? 'bg-white/[0.12] border-white shadow-xl scale-[1.02] ring-1 ring-white'
                  : 'bg-neutral-900/60 border-white/[0.08] hover:border-white/20 hover:bg-neutral-900'
              }`}
            >
              {/* Badge if selected */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-lg font-bold z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Tag / Badge */}
              <div className="w-full flex justify-between items-center mb-2 text-[9px] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                  {item.paperSize}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300">
                  {item.photoCount} Pose
                </span>
              </div>

              {/* Visual Thumbnail Representation */}
              <div
                className={`${
                  isStrip ? 'w-16 h-28' : 'w-24 h-28'
                } rounded-lg bg-black p-1.5 flex flex-col justify-between mb-2 shadow-inner border border-white/10`}
              >
                {/* Visual miniature layout slots */}
                <div className="w-full h-full flex flex-col justify-between gap-1 overflow-hidden">
                  {item.id === 'strip4' && (
                    <div className="h-full flex flex-col justify-between gap-0.5">
                      {[1, 2, 3, 4].map(n => <div key={n} className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>)}
                    </div>
                  )}
                  {item.id === 'strip3' && (
                    <div className="h-full flex flex-col justify-between gap-1">
                      {[1, 2, 3].map(n => <div key={n} className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>)}
                    </div>
                  )}
                  {item.id === 'strip2' && (
                    <div className="h-full flex flex-col justify-between gap-1">
                      {[1, 2].map(n => <div key={n} className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>)}
                    </div>
                  )}
                  {item.id === 'strip5' && (
                    <div className="h-full flex flex-col justify-between gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => <div key={n} className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>)}
                    </div>
                  )}
                  {item.id === 'strip6' && (
                    <div className="h-full flex flex-col justify-between gap-0.5">
                      {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>)}
                    </div>
                  )}
                  {item.id === 'grid2x2' && (
                    <div className="h-full grid grid-cols-2 gap-1">
                      {[1, 2, 3, 4].map(n => <div key={n} className="rounded-[2px] bg-neutral-800 border border-neutral-700"></div>)}
                    </div>
                  )}
                  {item.id === 'grid3x2' && (
                    <div className="h-full grid grid-cols-2 gap-0.5">
                      {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="rounded-[2px] bg-neutral-800 border border-neutral-700"></div>)}
                    </div>
                  )}
                  {item.id === 'grid3x3' && (
                    <div className="h-full grid grid-cols-3 gap-0.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <div key={n} className="rounded-[2px] bg-neutral-800 border border-neutral-700"></div>)}
                    </div>
                  )}
                  {item.id === 'single' && (
                    <div className="h-full rounded-[2px] bg-neutral-800 border border-neutral-700"></div>
                  )}
                  {item.id === 'hero1_split2' && (
                    <div className="h-full flex gap-1">
                      <div className="w-1/2 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>
                      <div className="w-1/2 flex flex-col gap-1">
                        <div className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>
                        <div className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>
                      </div>
                    </div>
                  )}
                  {item.id === 'hero1_bottom3' && (
                    <div className="h-full flex flex-col gap-1">
                      <div className="h-2/3 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>
                      <div className="h-1/3 flex gap-1">
                        <div className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>
                        <div className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>
                        <div className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>
                      </div>
                    </div>
                  )}
                  {item.id === 'polaroid_wide' && (
                    <div className="h-full flex flex-col justify-start p-1 bg-white rounded-[2px]">
                      <div className="h-3/4 rounded-[2px] bg-neutral-800"></div>
                    </div>
                  )}
                  {item.id === 'triptych' && (
                    <div className="h-full flex gap-1">
                      {[1, 2, 3].map(n => <div key={n} className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>)}
                    </div>
                  )}
                  {item.id === 'duo_landscape' && (
                    <div className="h-full flex flex-col gap-1">
                      {[1, 2].map(n => <div key={n} className="flex-1 rounded-[2px] bg-neutral-800 border border-neutral-700"></div>)}
                    </div>
                  )}
                  {item.id === 'magazine_cover' && (
                    <div className="h-full relative rounded-[2px] bg-neutral-800 p-1 flex flex-col justify-end">
                      <div className="flex gap-1">
                        <div className="w-4 h-4 bg-white/40 rounded-[1px]"></div>
                        <div className="w-4 h-4 bg-white/40 rounded-[1px]"></div>
                      </div>
                    </div>
                  )}
                  {item.id === 'asymmetric4' && (
                    <div className="h-full flex flex-col gap-1">
                      <div className="flex-1 flex gap-1">
                        <div className="w-2/3 bg-neutral-800 rounded-[2px]"></div>
                        <div className="w-1/3 bg-neutral-800 rounded-[2px]"></div>
                      </div>
                      <div className="flex-1 flex gap-1">
                        <div className="w-1/3 bg-neutral-800 rounded-[2px]"></div>
                        <div className="w-2/3 bg-neutral-800 rounded-[2px]"></div>
                      </div>
                    </div>
                  )}
                  {item.id === 'postage_stamps' && (
                    <div className="h-full grid grid-cols-2 gap-1 border border-dashed border-white/30 p-0.5">
                      {[1, 2, 3, 4].map(n => <div key={n} className="rounded-[1px] bg-neutral-800"></div>)}
                    </div>
                  )}
                  {item.id === 'cinema_duo' && (
                    <div className="h-full flex flex-col justify-around gap-1 py-1">
                      <div className="h-1/3 rounded-[2px] bg-neutral-800"></div>
                      <div className="h-1/3 rounded-[2px] bg-neutral-800"></div>
                    </div>
                  )}
                  {item.id === 'hero_center' && (
                    <div className="h-full flex gap-1">
                      <div className="w-1/4 rounded-[2px] bg-neutral-800"></div>
                      <div className="w-1/2 rounded-[2px] bg-neutral-800"></div>
                      <div className="w-1/4 rounded-[2px] bg-neutral-800"></div>
                    </div>
                  )}
                  {item.id === 'quad_polaroid' && (
                    <div className="h-full grid grid-cols-2 gap-1 p-0.5">
                      {[1, 2, 3, 4].map(n => (
                        <div key={n} className="bg-white p-0.5 rounded-[1px] flex flex-col justify-start">
                          <div className="h-3/4 bg-neutral-800"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="w-full">
                <h3 className="font-bold text-xs text-white mb-0.5 truncate">{item.name}</h3>
                <p className="text-[10px] text-neutral-400 leading-tight line-clamp-1">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Proceed */}
      <div className="flex justify-end pt-3 mt-2 border-t border-white/[0.08] shrink-0">
        <button
          onClick={handleProceed}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm sm:text-base shadow-xl transition active:scale-95 flex items-center justify-center gap-2.5"
        >
          <span>Lanjut ke Kamera ({LAYOUT_OPTIONS.find(l => l.id === selectedLayout)?.photoCount} Pose)</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-950" />
        </button>
      </div>
    </div>
  );
};
