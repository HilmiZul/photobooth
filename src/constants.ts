import { FrameTheme, FilterType, LayoutType } from './types';

// 20 Creative, Dynamic & Non-Rigid Frame Themes
export const FRAME_THEMES: FrameTheme[] = [
  {
    id: 'sunset-dream',
    name: 'Sunset Horizon',
    subtitle: 'Gradasi senja hangat & estetik',
    bgClass: 'bg-gradient-to-b from-[#ff5e62] to-[#ff9966]',
    colorHex: '#ff5e62',
    textColor: '#ffffff',
    styleType: 'gradient',
    gradientColors: ['#ff5e62', '#ff9966'],
    badge: 'Gradient'
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    subtitle: 'Gradasi kosmik hijau toska & teal',
    bgClass: 'bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#2c5364]',
    colorHex: '#0f2027',
    textColor: '#81e6d9',
    styleType: 'gradient',
    gradientColors: ['#0f2027', '#203a43', '#2c5364'],
    badge: 'Gradient'
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    subtitle: 'Warna pastel manis & dreamy',
    bgClass: 'bg-gradient-to-b from-[#ffdde1] to-[#ee9ca7]',
    colorHex: '#ffdde1',
    textColor: '#9d174d',
    styleType: 'gradient',
    gradientColors: ['#ffdde1', '#ee9ca7'],
    badge: 'Pastel'
  },
  {
    id: 'cyber-violet',
    name: 'Electric Cyber Violet',
    subtitle: 'Gradasi neon ungu & magenta energetik',
    bgClass: 'bg-gradient-to-b from-[#8a2387] via-[#e94057] to-[#f27121]',
    colorHex: '#8a2387',
    textColor: '#ffffff',
    styleType: 'gradient',
    gradientColors: ['#8a2387', '#e94057', '#f27121'],
    badge: 'Vibrant'
  },
  {
    id: 'film-strip-35mm',
    name: 'Film 35mm Classic',
    subtitle: 'Gaya klise film dengan lubang sprocket',
    bgClass: 'bg-[#09090b] border-2 border-white/20',
    colorHex: '#09090b',
    textColor: '#e4e4e7',
    styleType: 'film',
    borderColor: '#e4e4e7',
    badge: 'Vintage'
  },
  {
    id: 'polaroid-warm',
    name: 'Warm Polaroid Paper',
    subtitle: 'Tekstur kertas vintage khas polaroid',
    bgClass: 'bg-[#fdfbf7] border border-[#e5e0d8]',
    colorHex: '#fdfbf7',
    textColor: '#27272a',
    styleType: 'polaroid',
    borderColor: '#d4ceb8',
    badge: 'Retro'
  },
  {
    id: 'golden-glam',
    name: 'Golden Hour Glam',
    subtitle: 'Kilau emas mewah & hangat',
    bgClass: 'bg-gradient-to-b from-[#bf953f] via-[#fcf6ba] to-[#b38728]',
    colorHex: '#bf953f',
    textColor: '#3e2723',
    styleType: 'gradient',
    gradientColors: ['#bf953f', '#fcf6ba', '#b38728'],
    badge: 'Luxury'
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Forest',
    subtitle: 'Hijau daun lembut & menenangkan',
    bgClass: 'bg-gradient-to-b from-[#d8e2dc] to-[#b7b7a4]',
    colorHex: '#d8e2dc',
    textColor: '#2b3a2f',
    styleType: 'gradient',
    gradientColors: ['#d8e2dc', '#b7b7a4'],
    badge: 'Earthy'
  },
  {
    id: 'deep-galaxy',
    name: 'Deep Galaxy Night',
    subtitle: 'Biru antariksa gelap dengan aksen bintang',
    bgClass: 'bg-gradient-to-b from-[#000428] to-[#004e92]',
    colorHex: '#000428',
    textColor: '#bae6fd',
    styleType: 'gradient',
    gradientColors: ['#000428', '#004e92'],
    badge: 'Cosmic'
  },
  {
    id: 'checkerboard-retro',
    name: 'Retro 90s Checker',
    subtitle: 'Motif kotak-kotak Y2K hitam putih ikonik',
    bgClass: 'bg-[#18181b] border-2 border-dashed border-white/40',
    colorHex: '#18181b',
    textColor: '#ffffff',
    styleType: 'pattern',
    badge: 'Y2K'
  },
  {
    id: 'blush-romance',
    name: 'Blush Floral Romance',
    subtitle: 'Merah muda kelopak bunga romantis',
    bgClass: 'bg-gradient-to-b from-[#ffe5ec] to-[#ffb3c6]',
    colorHex: '#ffe5ec',
    textColor: '#9f1239',
    styleType: 'gradient',
    gradientColors: ['#ffe5ec', '#ffb3c6'],
    badge: 'Pastel'
  },
  {
    id: 'ocean-teal',
    name: 'Ocean Wave Turquoise',
    subtitle: 'Kesejukan ombak laut toska menyala',
    bgClass: 'bg-gradient-to-b from-[#134e5e] to-[#71b280]',
    colorHex: '#134e5e',
    textColor: '#e6fffa',
    styleType: 'gradient',
    gradientColors: ['#134e5e', '#71b280'],
    badge: 'Nature'
  },
  {
    id: 'terracotta-warm',
    name: 'Terracotta Sunset',
    subtitle: 'Nuansa tembikar oranye hangat Mediterania',
    bgClass: 'bg-gradient-to-b from-[#e76f51] to-[#f4a261]',
    colorHex: '#e76f51',
    textColor: '#ffffff',
    styleType: 'gradient',
    gradientColors: ['#e76f51', '#f4a261'],
    badge: 'Warm'
  },
  {
    id: 'cozy-latte',
    name: 'Coffee & Cream',
    subtitle: 'Hangatnya seduhan kopi susu & moka',
    bgClass: 'bg-gradient-to-b from-[#ddb892] to-[#7f5539]',
    colorHex: '#ddb892',
    textColor: '#fffaf0',
    styleType: 'gradient',
    gradientColors: ['#ddb892', '#7f5539'],
    badge: 'Cozy'
  },
  {
    id: 'neon-cyber-cyan',
    name: 'Cyberpunk Neon Glow',
    subtitle: 'Hitam legam dengan border neon cyan',
    bgClass: 'bg-[#050508] border-2 border-[#00f2fe]',
    colorHex: '#050508',
    textColor: '#00f2fe',
    styleType: 'solid',
    borderColor: '#00f2fe',
    badge: 'Neon'
  },
  {
    id: 'vintage-newspaper',
    name: 'Editorial Newsprint',
    subtitle: 'Kertas koran klasik dengan garis elegan',
    bgClass: 'bg-[#f4ebd9] border-2 border-[#5c4033]',
    colorHex: '#f4ebd9',
    textColor: '#3d2b1f',
    styleType: 'solid',
    borderColor: '#5c4033',
    badge: 'Editorial'
  },
  {
    id: 'lavender-haze',
    name: 'Lavender Dusk',
    subtitle: 'Ungu senja lembut berpadu oranye mawar',
    bgClass: 'bg-gradient-to-b from-[#c471ed] via-[#f64f59] to-[#12c2e9]',
    colorHex: '#c471ed',
    textColor: '#ffffff',
    styleType: 'gradient',
    gradientColors: ['#c471ed', '#f64f59', '#12c2e9'],
    badge: 'Vibrant'
  },
  {
    id: 'onyx-minimalist',
    name: 'Onyx Studio Black',
    subtitle: 'Hitam pekat monokrom dengan aksen tajam',
    bgClass: 'bg-[#121214] border border-white/20',
    colorHex: '#121214',
    textColor: '#f4f4f5',
    styleType: 'solid',
    badge: 'Minimal'
  },
  {
    id: 'pure-studio-white',
    name: 'Pure Gallery White',
    subtitle: 'Putih bersih kanvas pameran foto',
    bgClass: 'bg-[#ffffff] border border-neutral-300',
    colorHex: '#ffffff',
    textColor: '#18181b',
    styleType: 'solid',
    badge: 'Clean'
  },
  {
    id: 'midnight-navy',
    name: 'Midnight Royal Blue',
    subtitle: 'Biru safir malam yang elegan & berkelas',
    bgClass: 'bg-gradient-to-b from-[#141e30] to-[#243b55]',
    colorHex: '#141e30',
    textColor: '#e0e7ff',
    styleType: 'gradient',
    gradientColors: ['#141e30', '#243b55'],
    badge: 'Classic'
  }
];

// 20 Top Modern & Beautiful Filters
export const FILTERS: {
  id: FilterType;
  label: string;
  desc: string;
  category: 'Natural' | 'Vintage' | 'Monochrome' | 'Cinematic' | 'Vibrant';
  previewCss: string;
}[] = [
  {
    id: 'none',
    label: 'Original Studio',
    desc: 'Warna asli tajam & natural',
    category: 'Natural',
    previewCss: 'none'
  },
  {
    id: 'soft_glow',
    label: 'Soft Glow',
    desc: 'Pencerah lembut & kulit glowing mempesona',
    category: 'Natural',
    previewCss: 'brightness(112%) contrast(104%) saturate(112%)'
  },
  {
    id: 'clean_white',
    label: 'Clean Minimalist',
    desc: 'Putih jernih berkarakter modern & cerah',
    category: 'Natural',
    previewCss: 'brightness(115%) contrast(108%) saturate(102%)'
  },
  {
    id: 'golden_hour',
    label: 'Golden Hour',
    desc: 'Kilau hangat cahaya matahari senja keemasan',
    category: 'Natural',
    previewCss: 'sepia(24%) saturate(130%) brightness(106%) contrast(105%)'
  },
  {
    id: 'peach_blush',
    label: 'Peach Sunkissed',
    desc: 'Rona pipi persik hangat & segar alami',
    category: 'Natural',
    previewCss: 'saturate(125%) brightness(108%) sepia(15%)'
  },
  {
    id: 'warm_cashmere',
    label: 'Warm Cashmere',
    desc: 'Nuansa krem lembut mewah nan nyaman',
    category: 'Natural',
    previewCss: 'sepia(26%) brightness(108%) contrast(102%) saturate(106%)'
  },
  {
    id: 'vintage_film',
    label: 'Vintage 35mm',
    desc: 'Warna hangat nostalgia film analog 90-an',
    category: 'Vintage',
    previewCss: 'sepia(32%) contrast(110%) brightness(105%) saturate(92%)'
  },
  {
    id: 'retro_polaroid',
    label: 'Retro Polaroid 80s',
    desc: 'Karakter otentik kamera cetak instan',
    category: 'Vintage',
    previewCss: 'contrast(115%) brightness(105%) saturate(110%) sepia(20%)'
  },
  {
    id: 'sepia_archive',
    label: 'Sepia Antique',
    desc: 'Klasik abadi bernuansa arsip bersejarah',
    category: 'Vintage',
    previewCss: 'sepia(80%) contrast(110%) brightness(96%)'
  },
  {
    id: 'pastel_dream',
    label: 'Pastel Dream',
    desc: 'Gradasi manis lembut bernuansa dreamy',
    category: 'Vintage',
    previewCss: 'brightness(112%) contrast(96%) saturate(118%)'
  },
  {
    id: 'mono_noir',
    label: 'Mono Noir Studio',
    desc: 'Hitam putih pekat dengan kontras studio',
    category: 'Monochrome',
    previewCss: 'grayscale(100%) contrast(130%) brightness(102%)'
  },
  {
    id: 'silver_halide',
    label: 'Silver Halide B&W',
    desc: 'Monokrom tajam perak khas cetak kamar gelap',
    category: 'Monochrome',
    previewCss: 'grayscale(100%) contrast(145%) brightness(105%)'
  },
  {
    id: 'matte_editorial',
    label: 'Matte Editorial',
    desc: 'Hitam pudar elegan majalah fashion',
    category: 'Monochrome',
    previewCss: 'contrast(92%) brightness(108%) saturate(85%)'
  },
  {
    id: 'cool_nordic',
    label: 'Nordic Cool',
    desc: 'Tone sejuk kebiruan modern & estetik',
    category: 'Cinematic',
    previewCss: 'hue-rotate(185deg) saturate(92%) contrast(112%) brightness(104%)'
  },
  {
    id: 'moody_cinematic',
    label: 'Cinematic Teal',
    desc: 'Gradasi film sinematik teal & amber layar lebar',
    category: 'Cinematic',
    previewCss: 'contrast(120%) brightness(98%) saturate(115%) hue-rotate(345deg)'
  },
  {
    id: 'emerald_noir',
    label: 'Emerald Luxe',
    desc: 'Sentuhan hijau botol zamrud nan megah',
    category: 'Cinematic',
    previewCss: 'contrast(118%) brightness(96%) hue-rotate(320deg) saturate(110%)'
  },
  {
    id: 'velvet_dusk',
    label: 'Velvet Dusk',
    desc: 'Lembayung senja ungu violet memikat',
    category: 'Cinematic',
    previewCss: 'contrast(115%) brightness(102%) hue-rotate(270deg) saturate(90%)'
  },
  {
    id: 'cyber_tokyo',
    label: 'Cyber Neon',
    desc: 'Cahaya neon energetik & tajam',
    category: 'Vibrant',
    previewCss: 'saturate(145%) contrast(118%) brightness(102%)'
  },
  {
    id: 'candid_flash',
    label: 'Candid Flash',
    desc: 'Efek blitz pesta malam bold & berkilau',
    category: 'Vibrant',
    previewCss: 'brightness(118%) contrast(125%) saturate(115%)'
  },
  {
    id: 'vivid_pop',
    label: 'Vivid Pop Art',
    desc: 'Warna pop ultra-vibrant ceria & ekspresif',
    category: 'Vibrant',
    previewCss: 'saturate(160%) contrast(112%) brightness(104%)'
  }
];

export const LAYOUT_OPTIONS: {
  id: LayoutType;
  name: string;
  subtitle: string;
  photoCount: number;
  paperSize: '2x6' | '4x6';
  category: 'Strip' | 'Grid' | 'Editorial' | 'Creative';
  badge: string;
}[] = [
  {
    id: 'strip4',
    name: 'Classic 4-Cut Strip',
    subtitle: '2x6 inci • 4 foto vertikal standar studio',
    photoCount: 4,
    paperSize: '2x6',
    category: 'Strip',
    badge: 'Populer'
  },
  {
    id: 'grid2x2',
    name: '2x2 Quad Grid',
    subtitle: '4x6 inci • 4 foto kotak simetris untuk album',
    photoCount: 4,
    paperSize: '4x6',
    category: 'Grid',
    badge: 'Klasik'
  },
  {
    id: 'strip3',
    name: 'Tall 3-Cut Strip',
    subtitle: '2x6 inci • 3 foto vertikal lebih tinggi & ekspresif',
    photoCount: 3,
    paperSize: '2x6',
    category: 'Strip',
    badge: 'Strip'
  },
  {
    id: 'strip2',
    name: 'Duo Split Strip',
    subtitle: '2x6 inci • 2 foto potret berukuran besar',
    photoCount: 2,
    paperSize: '2x6',
    category: 'Strip',
    badge: 'Duo'
  },
  {
    id: 'single',
    name: 'Solo Full Portrait',
    subtitle: '4x6 inci • 1 foto potret penuh resolusi tajam',
    photoCount: 1,
    paperSize: '4x6',
    category: 'Editorial',
    badge: 'Solo'
  },
  {
    id: 'grid3x2',
    name: '6-Shot Studio Matrix',
    subtitle: '4x6 inci • 6 foto mini (3 baris x 2 kolom)',
    photoCount: 6,
    paperSize: '4x6',
    category: 'Grid',
    badge: 'Multi-Pose'
  },
  {
    id: 'hero1_split2',
    name: 'Hero Left + 2 Stack',
    subtitle: '4x6 inci • 1 foto utama kiri + 2 foto bertingkat kanan',
    photoCount: 3,
    paperSize: '4x6',
    category: 'Editorial',
    badge: 'Editorial'
  },
  {
    id: 'hero1_bottom3',
    name: 'Hero Banner + 3 Strip',
    subtitle: '4x6 inci • 1 foto lanskap atas + 3 foto mini bawah',
    photoCount: 4,
    paperSize: '4x6',
    category: 'Editorial',
    badge: 'Banner'
  },
  {
    id: 'polaroid_wide',
    name: 'Polaroid Wide Shot',
    subtitle: '4x6 inci • 1 foto lanskap bingkai polaroid retro',
    photoCount: 1,
    paperSize: '4x6',
    category: 'Creative',
    badge: 'Polaroid'
  },
  {
    id: 'strip5',
    name: '5-Cut Cine Strip',
    subtitle: '2x6 inci • 5 foto vertikal sinematik berurutan',
    photoCount: 5,
    paperSize: '2x6',
    category: 'Strip',
    badge: 'Cine'
  },
  {
    id: 'triptych',
    name: 'Triptych 3-Panorama',
    subtitle: '4x6 inci • 3 foto vertikal berdampingan horisontal',
    photoCount: 3,
    paperSize: '4x6',
    category: 'Creative',
    badge: 'Triptych'
  },
  {
    id: 'duo_landscape',
    name: 'Twin Landscape Stack',
    subtitle: '4x6 inci • 2 foto lanskap bertingkat atas-bawah',
    photoCount: 2,
    paperSize: '4x6',
    category: 'Grid',
    badge: 'Twin'
  },
  {
    id: 'magazine_cover',
    name: 'Editorial Magazine Cover',
    subtitle: '4x6 inci • 1 foto utama elegan + 2 mini inset aksen',
    photoCount: 3,
    paperSize: '4x6',
    category: 'Editorial',
    badge: 'Magazine'
  },
  {
    id: 'grid3x3',
    name: '9-Shot Micro Matrix',
    subtitle: '4x6 inci • 9 foto mosaik mini untuk kelompok seru',
    photoCount: 9,
    paperSize: '4x6',
    category: 'Grid',
    badge: '9 Poses'
  },
  {
    id: 'strip6',
    name: '6-Cut Film Reel',
    subtitle: '2x6 inci • 6 foto vertikal roll klise bioskop',
    photoCount: 6,
    paperSize: '2x6',
    category: 'Strip',
    badge: 'Reel'
  },
  {
    id: 'asymmetric4',
    name: 'Asymmetric Collage',
    subtitle: '4x6 inci • 4 foto kolase ukuran dinamis & modern',
    photoCount: 4,
    paperSize: '4x6',
    category: 'Creative',
    badge: 'Kekinian'
  },
  {
    id: 'postage_stamps',
    name: 'Postage Stamp Quad',
    subtitle: '4x6 inci • 4 foto prangko klasik bernomor seri',
    photoCount: 4,
    paperSize: '4x6',
    category: 'Creative',
    badge: 'Prangko'
  },
  {
    id: 'cinema_duo',
    name: 'Cinematic 2.39:1 Dual',
    subtitle: '4x6 inci • 2 frame film ultra-wide layar lebar',
    photoCount: 2,
    paperSize: '4x6',
    category: 'Editorial',
    badge: 'Cinema'
  },
  {
    id: 'hero_center',
    name: 'Spotlight Center Stage',
    subtitle: '4x6 inci • 1 foto besar tengah diapit 2 foto samping',
    photoCount: 3,
    paperSize: '4x6',
    category: 'Editorial',
    badge: 'Spotlight'
  },
  {
    id: 'quad_polaroid',
    name: '4 Mini Polaroids Sheet',
    subtitle: '4x6 inci • 4 foto kartu polaroid mini di satu lembar',
    photoCount: 4,
    paperSize: '4x6',
    category: 'Creative',
    badge: 'Mini-Polaroid'
  }
];

// Separated Sticker Palettes so text words NEVER overflow!
export const EMOJI_STICKERS = [
  '✨', '🎀', '🧸', '💖', '🌸', '🍒', '⭐', '🔥', '🎉', '✌️', '🕶️', '👑', '🤍', '🍀',
  '🎈', '💎', '📸', '⚡', '🦋', '🥑', '🍭', '🫧', '🌙', '🥂', '🎂', '🎸', '🍿', '🌹', '🕊️', '💐'
];

export const WORD_BADGES = [
  'SMILE', 'BESTIES', 'LOVE', 'COOL', 'PARTY', 'HAPPY', 'VIBES', 'CHILL',
  'FOREVER', 'MEMORIES', 'XOXO', 'SWEET', 'DREAM', 'MOMENTS', 'LUCKY', 'SHINE'
];

// Combined for backwards compatibility
export const STICKER_PALETTE = [...EMOJI_STICKERS, ...WORD_BADGES];
