import React, { useState, useRef } from 'react';
import {
  Palette,
  Image as ImageIcon,
  Smile,
  Type,
  ArrowRight,
  RotateCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  Tag
} from 'lucide-react';
import { LayoutType, FilterType, FrameTheme, StickerItem, PhotoboothConfig } from '../types';
import { FRAME_THEMES, FILTERS, EMOJI_STICKERS, WORD_BADGES } from '../constants';
import { sound } from '../utils/sound';

interface EditScreenProps {
  photos: string[];
  layout: LayoutType;
  config: PhotoboothConfig;
  onFinishEdit: (data: {
    filter: FilterType;
    frameTheme: FrameTheme;
    stickers: StickerItem[];
    eventName: string;
    subTitle: string;
    showDate: boolean;
    dateText: string;
  }) => void;
  onRetake: () => void;
}

export const EditScreen: React.FC<EditScreenProps> = ({
  photos,
  layout,
  config,
  onFinishEdit,
  onRetake
}) => {
  const [activeTab, setActiveTab] = useState<'filter' | 'frame' | 'stickers' | 'text'>('frame');
  const [stickerCategory, setStickerCategory] = useState<'emoji' | 'badge'>('emoji');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('soft_glow');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Natural' | 'Vintage' | 'Monochrome' | 'Cinematic' | 'Vibrant'>('All');
  const [selectedTheme, setSelectedTheme] = useState<FrameTheme>(FRAME_THEMES[0]);
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [draggingStickerId, setDraggingStickerId] = useState<string | null>(null);
  const [eventName, setEventName] = useState(config.eventName);
  const [subTitle, setSubTitle] = useState(config.subTitle);
  const [showDate, setShowDate] = useState(config.showDate);
  const [dateText, setDateText] = useState(config.dateText);
  const [isRendering, setIsRendering] = useState(false);
  const [customBadgeInput, setCustomBadgeInput] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Add custom typed badge sticker
  const handleAddCustomBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBadgeInput.trim()) return;
    addSticker(customBadgeInput.trim().toUpperCase());
    setCustomBadgeInput('');
  };

  // Add sticker onto the photostrip safely clamped within frame
  const addSticker = (symbol: string, initialX?: number, initialY?: number) => {
    sound.playClick();
    const newId = Math.random().toString(36).substring(2, 9);
    const newSticker: StickerItem = {
      id: newId,
      symbol,
      x: initialX !== undefined ? Math.max(10, Math.min(90, initialX)) : (35 + Math.random() * 30),
      y: initialY !== undefined ? Math.max(10, Math.min(88, initialY)) : (25 + Math.random() * 50),
      size: /^[A-Z0-9\s!]+$/i.test(symbol) ? 22 : 32,
      rotation: 0
    };
    setStickers(prev => [...prev, newSticker]);
    setSelectedStickerId(newId);
  };

  const removeSticker = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    setStickers(prev => prev.filter(s => s.id !== id));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };

  const updateStickerSize = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setStickers(prev =>
      prev.map(s => (s.id === id ? { ...s, size: Math.max(14, Math.min(56, s.size + delta)) } : s))
    );
  };

  const rotateSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setStickers(prev =>
      prev.map(s => (s.id === id ? { ...s, rotation: (s.rotation + 30) % 360 } : s))
    );
  };

  // Dragging logic with bounds clamping so stickers NEVER go out of frame
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedStickerId(id);
    setDraggingStickerId(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingStickerId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Strictly clamp within 8% - 92% of frame boundaries
    const x = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(8, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));

    setStickers(prev =>
      prev.map(s => (s.id === draggingStickerId ? { ...s, x, y } : s))
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingStickerId) {
      setDraggingStickerId(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Drag and drop from palette to frame
  const handlePaletteDragStart = (e: React.DragEvent, symbol: string) => {
    e.dataTransfer.setData('text/plain', symbol);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleFrameDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleFrameDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const symbol = e.dataTransfer.getData('text/plain');
    if (!symbol || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(8, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    addSticker(symbol, x, y);
  };

  const handleNext = () => {
    sound.playSuccess();
    setIsRendering(true);
    onFinishEdit({
      filter: selectedFilter,
      frameTheme: selectedTheme,
      stickers,
      eventName,
      subTitle,
      showDate,
      dateText
    });
  };

  const getCssFilter = (f: FilterType) => {
    switch (f) {
      case 'soft_glow':
      case 'kglow':
        return 'brightness(112%) contrast(104%) saturate(112%)';
      case 'mono_noir':
      case 'bw':
        return 'grayscale(100%) contrast(130%) brightness(102%)';
      case 'clean_white':
        return 'brightness(115%) contrast(108%) saturate(102%)';
      case 'golden_hour':
        return 'sepia(24%) saturate(130%) brightness(106%) contrast(105%)';
      case 'peach_blush':
        return 'saturate(125%) brightness(108%) sepia(15%)';
      case 'warm_cashmere':
        return 'sepia(26%) brightness(108%) contrast(102%) saturate(106%)';
      case 'vintage_film':
      case 'vintage':
        return 'sepia(32%) contrast(110%) brightness(105%) saturate(92%)';
      case 'retro_polaroid':
        return 'contrast(115%) brightness(105%) saturate(110%) sepia(20%)';
      case 'sepia_archive':
      case 'sepia':
        return 'sepia(80%) contrast(110%) brightness(96%)';
      case 'pastel_dream':
        return 'brightness(112%) contrast(96%) saturate(118%)';
      case 'silver_halide':
        return 'grayscale(100%) contrast(145%) brightness(105%)';
      case 'matte_editorial':
        return 'contrast(92%) brightness(108%) saturate(85%)';
      case 'cool_nordic':
      case 'cool':
        return 'hue-rotate(185deg) saturate(92%) contrast(112%) brightness(104%)';
      case 'moody_cinematic':
        return 'contrast(120%) brightness(98%) saturate(115%) hue-rotate(345deg)';
      case 'emerald_noir':
        return 'contrast(118%) brightness(96%) hue-rotate(320deg) saturate(110%)';
      case 'velvet_dusk':
        return 'contrast(115%) brightness(102%) hue-rotate(270deg) saturate(90%)';
      case 'cyber_tokyo':
        return 'saturate(145%) contrast(118%) brightness(102%)';
      case 'candid_flash':
        return 'brightness(118%) contrast(125%) saturate(115%)';
      case 'vivid_pop':
        return 'saturate(160%) contrast(112%) brightness(104%)';
      default:
        return 'none';
    }
  };

  const isStrip = layout === 'strip4' || layout === 'strip3' || layout === 'strip2' || layout === 'strip5' || layout === 'strip6';

  // Compute CSS background for the live preview frame
  const getFrameBackgroundStyle = () => {
    if (selectedTheme.styleType === 'gradient' && selectedTheme.gradientColors) {
      if (selectedTheme.gradientColors.length === 2) {
        return {
          background: `linear-gradient(to bottom, ${selectedTheme.gradientColors[0]}, ${selectedTheme.gradientColors[1]})`
        };
      }
      return {
        background: `linear-gradient(to bottom, ${selectedTheme.gradientColors[0]}, ${selectedTheme.gradientColors[1]}, ${selectedTheme.gradientColors[2]})`
      };
    }
    return { backgroundColor: selectedTheme.colorHex };
  };

  return (
    <div
      onClick={() => setSelectedStickerId(null)}
      className="flex-1 flex flex-col justify-between p-3 sm:p-6 max-w-6xl mx-auto w-full select-none overflow-y-auto"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <button
          onClick={() => {
            sound.playClick();
            onRetake();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-neutral-300 text-xs font-semibold border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Foto Ulang</span>
        </button>

        <span className="text-[11px] sm:text-xs px-3 py-1 rounded-full studio-glass text-neutral-300 font-semibold tracking-wider uppercase">
          LANGKAH 3: KUSTOMISASI STUDIO & BINGKAI
        </span>

        <button
          onClick={handleNext}
          disabled={isRendering}
          className="px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 transition"
        >
          <span>Selesai & Cetak</span>
          <ArrowRight className="w-4 h-4 text-neutral-950" />
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 items-center justify-center my-auto py-2">
        {/* Photostrip Live Interactive Canvas Preview */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-5 studio-card rounded-2xl sm:rounded-3xl shrink-0">
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDragOver={handleFrameDragOver}
            onDrop={handleFrameDrop}
            className={`relative rounded-xl p-2.5 sm:p-3 shadow-2xl transition-all duration-300 border ${
              isStrip
                ? 'w-[160px] h-[410px] sm:w-[200px] sm:h-[510px]'
                : 'w-[280px] h-[410px] sm:w-[350px] sm:h-[510px]'
            } flex flex-col justify-between overflow-hidden touch-none`}
            style={{
              ...getFrameBackgroundStyle(),
              borderColor: selectedTheme.borderColor || (selectedTheme.textColor === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')
            }}
          >
            {/* Film 35mm Sprocket Holes Simulation */}
            {selectedTheme.styleType === 'film' && (
              <>
                <div className="absolute top-0 bottom-0 left-1 w-2 flex flex-col justify-around py-3 pointer-events-none z-10">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-2.5 rounded-[1px] bg-white/20"></div>
                  ))}
                </div>
                <div className="absolute top-0 bottom-0 right-1 w-2 flex flex-col justify-around py-3 pointer-events-none z-10">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-2.5 rounded-[1px] bg-white/20"></div>
                  ))}
                </div>
              </>
            )}

            {/* Photos Container - Supports all 20 layout formats */}
            <div className="flex-1 flex flex-col justify-between gap-1 sm:gap-1.5 overflow-hidden z-0">
              {/* Vertical Strips */}
              {isStrip && (
                <div className="h-full flex flex-col gap-1 sm:gap-1.5">
                  {photos.map((p, i) => (
                    <div key={i} className="flex-1 rounded-md overflow-hidden bg-black/10 relative">
                      <img
                        src={p}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover transition duration-300 pointer-events-none"
                        style={{ filter: getCssFilter(selectedFilter) }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 2x2 Grid */}
              {layout === 'grid2x2' && (
                <div className="h-full grid grid-cols-2 gap-1.5 sm:gap-2">
                  {photos.slice(0, 4).map((p, i) => (
                    <div key={i} className="rounded-md overflow-hidden bg-black/10 relative">
                      <img
                        src={p}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover transition duration-300 pointer-events-none"
                        style={{ filter: getCssFilter(selectedFilter) }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 3x2 Grid */}
              {layout === 'grid3x2' && (
                <div className="h-full grid grid-cols-2 gap-1">
                  {photos.slice(0, 6).map((p, i) => (
                    <div key={i} className="rounded-sm overflow-hidden bg-black/10 relative">
                      <img
                        src={p}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover pointer-events-none"
                        style={{ filter: getCssFilter(selectedFilter) }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 3x3 Micro Matrix */}
              {layout === 'grid3x3' && (
                <div className="h-full grid grid-cols-3 gap-0.5">
                  {photos.slice(0, 9).map((p, i) => (
                    <div key={i} className="rounded-sm overflow-hidden bg-black/10 relative">
                      <img
                        src={p}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover pointer-events-none"
                        style={{ filter: getCssFilter(selectedFilter) }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Hero Left + 2 Stack */}
              {layout === 'hero1_split2' && (
                <div className="h-full flex gap-1.5">
                  <div className="w-[58%] rounded-md overflow-hidden bg-black/10 relative">
                    <img src={photos[0]} alt="Hero" className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                  </div>
                  <div className="w-[42%] flex flex-col gap-1.5">
                    <div className="flex-1 rounded-md overflow-hidden bg-black/10 relative">
                      <img src={photos[1] || photos[0]} alt="Stack 1" className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                    </div>
                    <div className="flex-1 rounded-md overflow-hidden bg-black/10 relative">
                      <img src={photos[2] || photos[0]} alt="Stack 2" className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Hero Banner Top + 3 Bottom */}
              {layout === 'hero1_bottom3' && (
                <div className="h-full flex flex-col gap-1.5">
                  <div className="h-[62%] rounded-md overflow-hidden bg-black/10 relative">
                    <img src={photos[0]} alt="Hero" className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                  </div>
                  <div className="h-[38%] flex gap-1">
                    {[1, 2, 3].map(idx => (
                      <div key={idx} className="flex-1 rounded-md overflow-hidden bg-black/10 relative">
                        <img src={photos[idx] || photos[0]} alt={`Sub ${idx}`} className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Triptych Panorama */}
              {layout === 'triptych' && (
                <div className="h-full flex gap-1.5">
                  {[0, 1, 2].map(idx => (
                    <div key={idx} className="flex-1 rounded-md overflow-hidden bg-black/10 relative">
                      <img src={photos[idx] || photos[0]} alt={`Triptych ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Duo Landscape */}
              {layout === 'duo_landscape' && (
                <div className="h-full flex flex-col gap-2">
                  {[0, 1].map(idx => (
                    <div key={idx} className="flex-1 rounded-md overflow-hidden bg-black/10 relative">
                      <img src={photos[idx] || photos[0]} alt={`Duo ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Cinema Dual */}
              {layout === 'cinema_duo' && (
                <div className="h-full flex flex-col justify-around gap-2 py-3">
                  {[0, 1].map(idx => (
                    <div key={idx} className="h-[36%] rounded-md overflow-hidden bg-black/10 relative">
                      <img src={photos[idx] || photos[0]} alt={`Cinema ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Spotlight Center (Pose 1 Left, Pose 2 Center Hero, Pose 3 Right) */}
              {layout === 'hero_center' && (
                <div className="h-full flex gap-1.5">
                  <div className="w-1/4 rounded-md overflow-hidden bg-black/10 relative">
                    <img src={photos[0] || photos[0]} alt="Side Left" className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                  </div>
                  <div className="w-1/2 rounded-md overflow-hidden bg-black/10 relative">
                    <img src={photos[1] || photos[0]} alt="Center Hero" className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                  </div>
                  <div className="w-1/4 rounded-md overflow-hidden bg-black/10 relative">
                    <img src={photos[2] || photos[0]} alt="Side Right" className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                  </div>
                </div>
              )}

              {/* Asymmetric 4-Collage */}
              {layout === 'asymmetric4' && (
                <div className="h-full flex flex-col gap-1.5">
                  <div className="flex-1 flex gap-1.5">
                    <div className="w-[62%] rounded-md overflow-hidden bg-black/10 relative">
                      <img src={photos[0] || photos[0]} alt="Pose 1" className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                    </div>
                    <div className="w-[38%] rounded-md overflow-hidden bg-black/10 relative">
                      <img src={photos[1] || photos[0]} alt="Pose 2" className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                    </div>
                  </div>
                  <div className="flex-1 flex gap-1.5">
                    <div className="w-[38%] rounded-md overflow-hidden bg-black/10 relative">
                      <img src={photos[2] || photos[0]} alt="Pose 3" className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                    </div>
                    <div className="w-[62%] rounded-md overflow-hidden bg-black/10 relative">
                      <img src={photos[3] || photos[0]} alt="Pose 4" className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Postage Stamp Quad */}
              {layout === 'postage_stamps' && (
                <div className="h-full grid grid-cols-2 gap-2 p-1">
                  {[0, 1, 2, 3].map(idx => (
                    <div key={idx} className="bg-white p-1 pb-1.5 rounded-sm shadow-md flex flex-col relative overflow-hidden">
                      <div className="flex-1 rounded-[2px] overflow-hidden bg-black/10 relative">
                        <img src={photos[idx] || photos[0]} alt={`Stamp ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                      </div>
                      <div className="text-[7px] font-mono font-bold text-neutral-800 text-right mt-0.5 tracking-tighter">
                        POSTAGE #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4 Mini Polaroids Sheet */}
              {layout === 'quad_polaroid' && (
                <div className="h-full grid grid-cols-2 gap-2 p-1">
                  {[0, 1, 2, 3].map(idx => (
                    <div key={idx} className="bg-white p-1 pb-3 rounded shadow-md flex flex-col relative">
                      <div className="w-full aspect-[4/3] rounded-[2px] overflow-hidden bg-black/10 relative">
                        <img src={photos[idx] || photos[0]} alt={`Mini Polaroid ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" style={{ filter: getCssFilter(selectedFilter) }} />
                      </div>
                      <span className="text-[7px] font-mono text-neutral-600 font-bold text-center mt-1">
                        POSE #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Editorial Magazine Cover */}
              {layout === 'magazine_cover' && (
                <div className="h-full rounded-md overflow-hidden bg-black/10 relative">
                  <img
                    src={photos[0]}
                    alt="Cover Hero"
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ filter: getCssFilter(selectedFilter) }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white text-[8px] font-bold tracking-widest uppercase border border-white/20">
                    STUDIO ISSUE
                  </div>
                  <div className="absolute bottom-2 left-2 flex gap-1.5">
                    <div className="w-12 h-12 rounded border-2 border-white overflow-hidden shadow-lg">
                      <img src={photos[1] || photos[0]} alt="Inset 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-12 h-12 rounded border-2 border-white overflow-hidden shadow-lg">
                      <img src={photos[2] || photos[0]} alt="Inset 2" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              )}

              {/* Solo Full Portrait */}
              {layout === 'single' && (
                <div className="h-full rounded-md overflow-hidden bg-black/10 relative">
                  <img
                    src={photos[0]}
                    alt="Photo Solo"
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ filter: getCssFilter(selectedFilter) }}
                  />
                </div>
              )}

              {/* Polaroid Wide Shot */}
              {layout === 'polaroid_wide' && (
                <div className="h-full bg-white p-2.5 pb-5 rounded-lg shadow-lg flex flex-col justify-between">
                  <div className="w-full h-[82%] rounded overflow-hidden bg-black/10 relative">
                    <img
                      src={photos[0]}
                      alt="Polaroid Wide"
                      className="w-full h-full object-cover pointer-events-none"
                      style={{ filter: getCssFilter(selectedFilter) }}
                    />
                  </div>
                  <div className="text-center font-mono text-[9px] text-neutral-800 font-bold">
                    {eventName || 'STUDIO PHOTO'}
                  </div>
                </div>
              )}
            </div>

            {/* Placed Stickers Layer with Drag & Drop Controls */}
            {stickers.map((s) => {
              const isSelected = selectedStickerId === s.id;
              const isWord = /^[A-Z0-9\s!]+$/i.test(s.symbol);

              return (
                <div
                  key={s.id}
                  onPointerDown={(e) => handlePointerDown(s.id, e)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStickerId(s.id);
                  }}
                  className={`absolute cursor-grab active:cursor-grabbing select-none transition-transform z-20 touch-none ${
                    isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black/60 z-30' : ''
                  }`}
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`
                  }}
                >
                  {isWord ? (
                    <div className="px-2 py-0.5 rounded-md bg-neutral-900 border border-white/60 text-white font-extrabold text-[10px] sm:text-xs tracking-wider whitespace-nowrap shadow-lg">
                      {s.symbol}
                    </div>
                  ) : (
                    <span
                      className="leading-none block pointer-events-none"
                      style={{ fontSize: `${s.size}px` }}
                    >
                      {s.symbol}
                    </span>
                  )}

                  {/* Active floating controls bar for selected sticker */}
                  {isSelected && (
                    <div
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-lg bg-neutral-900/95 border border-white/20 shadow-2xl z-40 whitespace-nowrap"
                    >
                      <button
                        type="button"
                        onClick={(e) => updateStickerSize(s.id, -4, e)}
                        title="Perkecil"
                        className="p-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white"
                      >
                        <ZoomOut className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => updateStickerSize(s.id, 4, e)}
                        title="Perbesar"
                        className="p-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white"
                      >
                        <ZoomIn className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => rotateSticker(s.id, e)}
                        title="Putar"
                        className="p-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => removeSticker(s.id, e)}
                        title="Hapus"
                        className="p-1 rounded hover:bg-rose-900/60 text-rose-400 hover:text-rose-200"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Photobooth Footer */}
            <div className="text-center pt-2 pb-0.5 z-10" style={{ color: selectedTheme.textColor }}>
              {config.customLogoUrl ? (
                <img
                  src={config.customLogoUrl}
                  alt="Logo"
                  className="h-6 sm:h-7 mx-auto object-contain mb-0.5"
                />
              ) : (
                <p className="font-bold text-[9px] sm:text-xs uppercase tracking-widest opacity-90">
                  {subTitle}
                </p>
              )}
              <p className="font-extrabold text-xs sm:text-sm tracking-tight font-heading leading-tight">
                {eventName}
              </p>
              {showDate && (
                <p className="text-[8px] sm:text-[10px] opacity-75 font-mono mt-0.5">
                  {dateText}
                </p>
              )}
            </div>
          </div>
          <p className="text-[10px] text-neutral-400 mt-2 text-center">
            Tip: Geser stiker bebas dengan jari/mouse. Stiker aman di dalam bingkai.
          </p>
        </div>

        {/* Studio Controls Panel */}
        <div className="w-full lg:w-96 flex flex-col studio-glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-white/10 shrink-0">
          {/* Main Category Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black/60 border border-white/10 mb-4">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('frame');
              }}
              className={`py-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition ${
                activeTab === 'frame' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Bingkai ({FRAME_THEMES.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('filter');
              }}
              className={`py-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition ${
                activeTab === 'filter' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Filter ({FILTERS.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('stickers');
              }}
              className={`py-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition ${
                activeTab === 'stickers' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Stiker</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('text');
              }}
              className={`py-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition ${
                activeTab === 'text' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Teks</span>
            </button>
          </div>

          {/* Tab 1: 20 Creative & Non-Rigid Frames */}
          {activeTab === 'frame' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-neutral-300 font-semibold">20 Bingkai Kreatif & Artistik</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                  {FRAME_THEMES.length} Pilihan
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[250px] sm:max-h-[340px] overflow-y-auto pr-1">
                {FRAME_THEMES.map((theme) => {
                  const isSelected = selectedTheme.id === theme.id;
                  const isGrad = theme.styleType === 'gradient' && theme.gradientColors;

                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedTheme(theme);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-1.5 transition ${
                        isSelected
                          ? 'border-white bg-white/[0.12] shadow-md ring-1 ring-white'
                          : 'border-white/[0.06] bg-black/40 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm shrink-0"
                          style={{
                            background: isGrad
                              ? `linear-gradient(135deg, ${theme.gradientColors![0]}, ${theme.gradientColors![1]})`
                              : theme.colorHex
                          }}
                        />
                        {theme.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-white/10 text-neutral-300 uppercase">
                            {theme.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-neutral-200 truncate">{theme.name}</p>
                        <p className="text-[10px] text-neutral-400 truncate">{theme.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: 20 Top Modern & Beautiful Filters */}
          {activeTab === 'filter' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-neutral-400 font-medium">20 Filter Modern & Beautiful:</p>
                <span className="text-[10px] text-pink-400 font-bold px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
                  {FILTERS.find(f => f.id === selectedFilter)?.label || 'Filter'}
                </span>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {(['All', 'Natural', 'Vintage', 'Monochrome', 'Cinematic', 'Vibrant'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      sound.playClick();
                      setFilterCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition ${
                      filterCategory === cat
                        ? 'bg-white text-neutral-950 font-bold shadow'
                        : 'bg-white/[0.06] text-neutral-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {cat === 'All' ? `Semua (${FILTERS.length})` : cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[250px] sm:max-h-[340px] overflow-y-auto pr-1">
                {FILTERS
                  .filter(f => filterCategory === 'All' || f.category === filterCategory)
                  .map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedFilter(f.id);
                      }}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        selectedFilter === f.id
                          ? 'bg-white/[0.14] border-white text-white shadow-md ring-1 ring-white/50'
                          : 'bg-black/40 border-white/[0.06] text-neutral-300 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="w-4 h-4 rounded-full border border-white/30 shrink-0 shadow-sm"
                          style={{
                            background: f.previewCss === 'none'
                              ? '#f4f4f5'
                              : f.category === 'Monochrome'
                              ? 'linear-gradient(135deg, #18181b, #a1a1aa)'
                              : f.category === 'Vintage'
                              ? 'linear-gradient(135deg, #d97706, #78350f)'
                              : f.category === 'Cinematic'
                              ? 'linear-gradient(135deg, #0d9488, #1e293b)'
                              : f.category === 'Vibrant'
                              ? 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                              : 'linear-gradient(135deg, #fbcfe8, #fed7aa)'
                          }}
                        />
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-white/10 text-neutral-300 uppercase">
                          {f.category}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-xs">{f.label}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-2">{f.desc}</p>
                      </div>
                    </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Stickers (Separated Sub-Tabs: Emojis vs Word Badges) */}
          {activeTab === 'stickers' && (
            <div className="space-y-2.5">
              {/* Sub-tab Switcher: Emoji vs Word Badges */}
              <div className="flex p-0.5 rounded-lg bg-black/60 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setStickerCategory('emoji');
                  }}
                  className={`flex-1 py-1.5 rounded-md font-semibold flex items-center justify-center gap-1.5 transition ${
                    stickerCategory === 'emoji' ? 'bg-white/20 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Smile className="w-3.5 h-3.5" />
                  <span>Emoji & Ikon</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setStickerCategory('badge');
                  }}
                  className={`flex-1 py-1.5 rounded-md font-semibold flex items-center justify-center gap-1.5 transition ${
                    stickerCategory === 'badge' ? 'bg-white/20 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Badge Kata Estetik</span>
                </button>
              </div>

              {/* Action bar */}
              <div className="flex justify-between items-center">
                <p className="text-[11px] text-neutral-400">
                  {stickerCategory === 'emoji' ? 'Pilih emoji (drag ke foto / klik):' : 'Pilih badge kata (drag ke foto / klik):'}
                </p>
                {stickers.length > 0 && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setStickers([]);
                      setSelectedStickerId(null);
                    }}
                    className="text-[10px] text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3 h-3" />
                    Hapus ({stickers.length})
                  </button>
                )}
              </div>

              {/* Category 1: Emoji Grid */}
              {stickerCategory === 'emoji' && (
                <div className="grid grid-cols-6 gap-2 max-h-[220px] sm:max-h-[280px] overflow-y-auto p-1.5 bg-black/30 rounded-xl border border-white/[0.06]">
                  {EMOJI_STICKERS.map((stk, idx) => (
                    <button
                      key={idx}
                      draggable
                      onDragStart={(e) => handlePaletteDragStart(e, stk)}
                      onClick={() => addSticker(stk)}
                      className="h-10 sm:h-11 rounded-xl bg-neutral-900 hover:bg-white/10 border border-white/10 flex items-center justify-center text-lg sm:text-xl transition active:scale-90 cursor-grab active:cursor-grabbing"
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              )}

              {/* Category 2: Word Badges (Rendered as proper horizontal pills that NEVER overflow!) */}
              {stickerCategory === 'badge' && (
                <div className="space-y-2">
                  {/* Custom Word Input */}
                  <form onSubmit={handleAddCustomBadge} className="flex gap-1.5">
                    <input
                      type="text"
                      maxLength={14}
                      value={customBadgeInput}
                      onChange={(e) => setCustomBadgeInput(e.target.value)}
                      placeholder="Ketik kata kustom (cth: ANNIV)..."
                      className="flex-1 py-1.5 px-3 rounded-lg bg-black/60 border border-white/15 text-xs text-white uppercase font-bold focus:border-white focus:outline-none placeholder:normal-case placeholder:font-normal placeholder:text-neutral-500"
                    />
                    <button
                      type="submit"
                      disabled={!customBadgeInput.trim()}
                      className="px-3 py-1.5 rounded-lg bg-white text-neutral-950 font-bold text-xs disabled:opacity-40 transition active:scale-95 shrink-0"
                    >
                      + Tambah
                    </button>
                  </form>

                  <div className="grid grid-cols-2 gap-2 max-h-[170px] sm:max-h-[220px] overflow-y-auto p-1.5 bg-black/30 rounded-xl border border-white/[0.06]">
                    {WORD_BADGES.map((word, idx) => (
                      <button
                        key={idx}
                        draggable
                        onDragStart={(e) => handlePaletteDragStart(e, word)}
                        onClick={() => addSticker(word)}
                        className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-white/10 border border-white/15 text-white font-extrabold text-xs tracking-wider flex items-center justify-center transition active:scale-95 cursor-grab active:cursor-grabbing shadow-sm"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-neutral-400 text-center">
                Tarik stiker langsung ke frame foto, atau tap untuk menambahkan.
              </p>
            </div>
          )}

          {/* Tab 4: Text customization */}
          {activeTab === 'text' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Nama Judul</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-black/60 border border-white/10 text-white focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Tagline / Sub Judul</label>
                <input
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-black/60 border border-white/10 text-white focus:border-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="dateCheck"
                  checked={showDate}
                  onChange={(e) => setShowDate(e.target.checked)}
                  className="w-4 h-4 rounded bg-black border-white/20 text-white focus:ring-0"
                />
                <label htmlFor="dateCheck" className="text-neutral-300 cursor-pointer">
                  Tampilkan Tanggal
                </label>
              </div>

              {showDate && (
                <div>
                  <input
                    type="text"
                    value={dateText}
                    onChange={(e) => setDateText(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
