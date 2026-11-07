export type LayoutType =
  | 'strip4'
  | 'grid2x2'
  | 'strip3'
  | 'strip2'
  | 'single'
  | 'grid3x2'
  | 'hero1_split2'
  | 'hero1_bottom3'
  | 'polaroid_wide'
  | 'strip5'
  | 'triptych'
  | 'duo_landscape'
  | 'magazine_cover'
  | 'grid3x3'
  | 'strip6'
  | 'asymmetric4'
  | 'postage_stamps'
  | 'cinema_duo'
  | 'hero_center'
  | 'quad_polaroid';

export type FilterType =
  | 'none'
  | 'soft_glow'
  | 'mono_noir'
  | 'vintage_film'
  | 'clean_white'
  | 'golden_hour'
  | 'cool_nordic'
  | 'cyber_tokyo'
  | 'moody_cinematic'
  | 'sepia_archive'
  | 'pastel_dream'
  | 'matte_editorial'
  | 'peach_blush'
  | 'retro_polaroid'
  | 'emerald_noir'
  | 'velvet_dusk'
  | 'silver_halide'
  | 'candid_flash'
  | 'warm_cashmere'
  | 'vivid_pop'
  | 'bw'
  | 'vintage'
  | 'kglow'
  | 'cool'
  | 'sepia';

export interface StickerItem {
  id: string;
  symbol: string; // emoji or short word
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // in px
  rotation: number; // in degrees
}

export interface FrameTheme {
  id: string;
  name: string;
  subtitle: string;
  bgClass: string;
  colorHex: string;
  textColor: string;
  styleType?: 'solid' | 'gradient' | 'pattern' | 'film' | 'polaroid';
  gradientColors?: [string, string] | [string, string, string];
  borderColor?: string;
  badge?: string;
}

export interface PhotoboothConfig {
  eventName: string;
  subTitle: string;
  showDate: boolean;
  dateText: string;
  price: number;
  currency: string;
  countdownSeconds: number;
  autoResetSeconds: number;
  requirePayment: boolean;
  adminPin: string;
  soundEnabled: boolean;
  voiceGuide: boolean; // Voice countdown cue (Web Speech API)
  twinStripPrint: boolean; // Print 2 strips side-by-side on 4x6 paper
  customLogoUrl?: string; // Optional custom PNG logo
  totalSessionsToday: number;
  totalPrintsToday: number;
  paperRollCapacity: number; // e.g. 400 or 700 sheets per roll
}

export type AppStep = 'welcome' | 'payment' | 'layout' | 'capture' | 'edit' | 'result';


