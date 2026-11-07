import { LayoutType, FilterType, StickerItem, FrameTheme } from '../types';

interface RenderOptions {
  photos: string[]; // data URLs
  layout: LayoutType;
  filter: FilterType;
  frameTheme: FrameTheme;
  stickers: StickerItem[];
  eventName: string;
  subTitle: string;
  showDate: boolean;
  dateText: string;
  twinStrip?: boolean;
  customLogoUrl?: string;
}

// Helper to draw an image covering target rectangle (object-fit: cover) with rounded corners
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number = 8,
  filter: FilterType = 'none'
) {
  ctx.save();

  // Create rounded rectangle clip
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.clip();

  // Apply CSS filter simulation to canvas
  ctx.filter = getCanvasFilterString(filter);

  // Compute cover dimensions
  const imgAspect = img.width / img.height;
  const targetAspect = w / h;
  let renderW = w;
  let renderH = h;
  let offsetX = 0;
  let offsetY = 0;

  if (imgAspect > targetAspect) {
    // Image is wider
    renderW = h * imgAspect;
    offsetX = -(renderW - w) / 2;
  } else {
    // Image is taller
    renderH = w / imgAspect;
    offsetY = -(renderH - h) / 2;
  }

  ctx.drawImage(img, x + offsetX, y + offsetY, renderW, renderH);

  // Soft glow or film color wash overlays
  switch (filter) {
    case 'vintage_film':
    case 'vintage':
      ctx.fillStyle = 'rgba(255, 230, 180, 0.12)';
      ctx.fillRect(x, y, w, h);
      break;
    case 'cool_nordic':
    case 'cool':
      ctx.fillStyle = 'rgba(180, 225, 255, 0.12)';
      ctx.fillRect(x, y, w, h);
      break;
    case 'soft_glow':
    case 'kglow':
      ctx.fillStyle = 'rgba(255, 220, 230, 0.08)';
      ctx.fillRect(x, y, w, h);
      break;
    case 'golden_hour':
      ctx.fillStyle = 'rgba(255, 195, 110, 0.14)';
      ctx.fillRect(x, y, w, h);
      break;
    case 'peach_blush':
      ctx.fillStyle = 'rgba(255, 180, 160, 0.12)';
      ctx.fillRect(x, y, w, h);
      break;
    case 'warm_cashmere':
      ctx.fillStyle = 'rgba(245, 225, 200, 0.12)';
      ctx.fillRect(x, y, w, h);
      break;
    case 'retro_polaroid':
      ctx.fillStyle = 'rgba(255, 250, 230, 0.08)';
      ctx.fillRect(x, y, w, h);
      break;
    case 'pastel_dream':
      ctx.fillStyle = 'rgba(235, 205, 255, 0.1)';
      ctx.fillRect(x, y, w, h);
      break;
    case 'emerald_noir':
      ctx.fillStyle = 'rgba(30, 150, 110, 0.1)';
      ctx.fillRect(x, y, w, h);
      break;
    case 'velvet_dusk':
      ctx.fillStyle = 'rgba(160, 100, 220, 0.12)';
      ctx.fillRect(x, y, w, h);
      break;
    case 'moody_cinematic':
      ctx.fillStyle = 'rgba(40, 180, 200, 0.1)';
      ctx.fillRect(x, y, w, h);
      break;
  }

  ctx.restore();
}

function getCanvasFilterString(filter: FilterType): string {
  switch (filter) {
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
}

// Asynchronously load an image
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function renderPhotoboothCanvas(options: RenderOptions): Promise<string> {
  const {
    photos,
    layout,
    filter,
    frameTheme,
    stickers,
    eventName,
    subTitle,
    showDate,
    dateText,
    twinStrip,
    customLogoUrl
  } = options;

  // Preload all photo images
  const loadedImages = await Promise.all(photos.map(src => loadImage(src)));
  const loadedLogo = customLogoUrl ? await loadImage(customLogoUrl).catch(() => null) : null;

  // Check if layout is a vertical 2x6 strip
  const isStrip = layout === 'strip4' || layout === 'strip3' || layout === 'strip2' || layout === 'strip5' || layout === 'strip6';

  // Helper to render one single sheet on a canvas
  const renderSingleSheet = (targetCanvas: HTMLCanvasElement) => {
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    const width = targetCanvas.width;
    const height = targetCanvas.height;

    // 1. Draw Frame Background (Solid or Gradient)
    if (frameTheme.styleType === 'gradient' && frameTheme.gradientColors) {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      if (frameTheme.gradientColors.length === 2) {
        grad.addColorStop(0, frameTheme.gradientColors[0]);
        grad.addColorStop(1, frameTheme.gradientColors[1]);
      } else if (frameTheme.gradientColors.length === 3) {
        grad.addColorStop(0, frameTheme.gradientColors[0]);
        grad.addColorStop(0.5, frameTheme.gradientColors[1]);
        grad.addColorStop(1, frameTheme.gradientColors[2]);
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = frameTheme.colorHex;
      ctx.fillRect(0, 0, width, height);
    }

    // Special Style: Film 35mm Sprocket Holes
    if (frameTheme.styleType === 'film') {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      const holeW = 12;
      const holeH = 18;
      const step = 45;
      for (let y = 30; y < height - 30; y += step) {
        ctx.beginPath();
        ctx.roundRect(8, y, holeW, holeH, 3);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(width - 8 - holeW, y, holeW, holeH, 3);
        ctx.fill();
      }
      ctx.restore();
    }

    // Special Style: Checkerboard
    if (frameTheme.styleType === 'pattern') {
      ctx.save();
      const sq = 16;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let x = 0; x < width; x += sq) {
        for (let y = 0; y < height; y += sq) {
          if ((x / sq + y / sq) % 2 === 0) {
            ctx.fillRect(x, y, sq, sq);
          }
        }
      }
      ctx.restore();
    }

    // Decorative inner border
    ctx.strokeStyle = frameTheme.borderColor || (frameTheme.textColor === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)');
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // 2. Compute Photo Slot Rectangles for all 20 Layouts
    const marginX = isStrip ? 32 : 50;
    const marginTop = isStrip ? 40 : 60;
    const footerHeight = 180;
    const usableHeight = height - marginTop - footerHeight;
    const usableWidth = width - (marginX * 2);

    const getImage = (index: number) => loadedImages[index] || loadedImages[loadedImages.length - 1];

    // Helper for vertical strip layouts (N items)
    const drawVerticalStrip = (count: number, gap: number = 20) => {
      const totalGaps = (count - 1) * gap;
      const photoH = (usableHeight - totalGaps) / count;
      for (let i = 0; i < count; i++) {
        const img = getImage(i);
        if (img) {
          const y = marginTop + i * (photoH + gap);
          drawCoverImage(ctx, img, marginX, y, usableWidth, photoH, 12, filter);
        }
      }
    };

    switch (layout) {
      // 1. Classic 4-Cut Strip
      case 'strip4':
        drawVerticalStrip(4, 24);
        break;

      // 2. Tall 3-Cut Strip
      case 'strip3':
        drawVerticalStrip(3, 28);
        break;

      // 3. Duo Split Strip
      case 'strip2':
        drawVerticalStrip(2, 32);
        break;

      // 4. 5-Cut Cine Strip
      case 'strip5':
        drawVerticalStrip(5, 16);
        break;

      // 5. 6-Cut Film Reel
      case 'strip6':
        drawVerticalStrip(6, 14);
        break;

      // 6. 2x2 Quad Grid (4x6)
      case 'grid2x2': {
        const gap = 30;
        const photoW = (usableWidth - gap) / 2;
        const photoH = (usableHeight - gap) / 2;
        for (let i = 0; i < 4; i++) {
          const img = getImage(i);
          if (img) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = marginX + col * (photoW + gap);
            const y = marginTop + row * (photoH + gap);
            drawCoverImage(ctx, img, x, y, photoW, photoH, 14, filter);
          }
        }
        break;
      }

      // 7. 6-Shot Matrix (3 rows x 2 cols)
      case 'grid3x2': {
        const gap = 20;
        const photoW = (usableWidth - gap) / 2;
        const photoH = (usableHeight - (2 * gap)) / 3;
        for (let i = 0; i < 6; i++) {
          const img = getImage(i);
          if (img) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = marginX + col * (photoW + gap);
            const y = marginTop + row * (photoH + gap);
            drawCoverImage(ctx, img, x, y, photoW, photoH, 10, filter);
          }
        }
        break;
      }

      // 8. 9-Shot Micro Grid (3x3)
      case 'grid3x3': {
        const gap = 16;
        const photoW = (usableWidth - (2 * gap)) / 3;
        const photoH = (usableHeight - (2 * gap)) / 3;
        for (let i = 0; i < 9; i++) {
          const img = getImage(i);
          if (img) {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = marginX + col * (photoW + gap);
            const y = marginTop + row * (photoH + gap);
            drawCoverImage(ctx, img, x, y, photoW, photoH, 8, filter);
          }
        }
        break;
      }

      // 9. Solo Full Portrait
      case 'single': {
        const img = getImage(0);
        if (img) {
          drawCoverImage(ctx, img, marginX, marginTop, usableWidth, usableHeight, 16, filter);
        }
        break;
      }

      // 10. Hero Left + 2 Stack Right (3 photos)
      case 'hero1_split2': {
        const gap = 24;
        const heroW = (usableWidth - gap) * 0.58;
        const rightW = usableWidth - gap - heroW;
        const rightH = (usableHeight - gap) / 2;

        const imgHero = getImage(0);
        if (imgHero) drawCoverImage(ctx, imgHero, marginX, marginTop, heroW, usableHeight, 14, filter);

        const imgRight1 = getImage(1);
        if (imgRight1) drawCoverImage(ctx, imgRight1, marginX + heroW + gap, marginTop, rightW, rightH, 12, filter);

        const imgRight2 = getImage(2);
        if (imgRight2) drawCoverImage(ctx, imgRight2, marginX + heroW + gap, marginTop + rightH + gap, rightW, rightH, 12, filter);
        break;
      }

      // 11. Hero Top Banner + 3 Mini Strip (4 photos)
      case 'hero1_bottom3': {
        const gap = 20;
        const bannerH = usableHeight * 0.62;
        const bottomH = usableHeight - gap - bannerH;
        const bottomW = (usableWidth - (2 * gap)) / 3;

        const imgBanner = getImage(0);
        if (imgBanner) drawCoverImage(ctx, imgBanner, marginX, marginTop, usableWidth, bannerH, 14, filter);

        for (let i = 0; i < 3; i++) {
          const img = getImage(i + 1);
          if (img) {
            const x = marginX + i * (bottomW + gap);
            const y = marginTop + bannerH + gap;
            drawCoverImage(ctx, img, x, y, bottomW, bottomH, 10, filter);
          }
        }
        break;
      }

      // 12. Polaroid Wide Shot (1 photo)
      case 'polaroid_wide': {
        const cardMargin = 40;
        const cardW = width - (cardMargin * 2);
        const cardH = height - (cardMargin * 2);
        // Draw white card background
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.18)';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.roundRect(cardMargin, cardMargin, cardW, cardH, 12);
        ctx.fill();
        ctx.restore();

        const innerPad = 40;
        const photoW = cardW - (innerPad * 2);
        const photoH = cardH * 0.72;
        const img = getImage(0);
        if (img) drawCoverImage(ctx, img, cardMargin + innerPad, cardMargin + innerPad, photoW, photoH, 8, filter);
        break;
      }

      // 13. Triptych 3-Panorama (3 vertical photos side-by-side)
      case 'triptych': {
        const gap = 24;
        const photoW = (usableWidth - (2 * gap)) / 3;
        for (let i = 0; i < 3; i++) {
          const img = getImage(i);
          if (img) {
            const x = marginX + i * (photoW + gap);
            drawCoverImage(ctx, img, x, marginTop, photoW, usableHeight, 12, filter);
          }
        }
        break;
      }

      // 14. Twin Landscape Stack (2 photos)
      case 'duo_landscape': {
        const gap = 28;
        const photoH = (usableHeight - gap) / 2;
        for (let i = 0; i < 2; i++) {
          const img = getImage(i);
          if (img) {
            const y = marginTop + i * (photoH + gap);
            drawCoverImage(ctx, img, marginX, y, usableWidth, photoH, 14, filter);
          }
        }
        break;
      }

      // 15. Magazine Cover (1 full + 2 inset accent frames)
      case 'magazine_cover': {
        const imgMain = getImage(0);
        if (imgMain) drawCoverImage(ctx, imgMain, marginX, marginTop, usableWidth, usableHeight, 14, filter);

        // 2 Inset thumbnails in bottom corner
        const insetSize = 220;
        const gap = 16;
        const insetY = marginTop + usableHeight - insetSize - 30;
        const insetX1 = marginX + 30;
        const insetX2 = insetX1 + insetSize + gap;

        const img1 = getImage(1);
        if (img1) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 6;
          ctx.strokeRect(insetX1 - 3, insetY - 3, insetSize + 6, insetSize + 6);
          drawCoverImage(ctx, img1, insetX1, insetY, insetSize, insetSize, 8, filter);
        }
        const img2 = getImage(2);
        if (img2) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 6;
          ctx.strokeRect(insetX2 - 3, insetY - 3, insetSize + 6, insetSize + 6);
          drawCoverImage(ctx, img2, insetX2, insetY, insetSize, insetSize, 8, filter);
        }
        break;
      }

      // 16. Asymmetric 4-Collage
      case 'asymmetric4': {
        const gap = 20;
        const rowH = (usableHeight - gap) / 2;
        // Row 1: 65% left, 35% right
        const w1 = (usableWidth - gap) * 0.62;
        const w2 = usableWidth - gap - w1;
        const img1 = getImage(0);
        if (img1) drawCoverImage(ctx, img1, marginX, marginTop, w1, rowH, 12, filter);
        const img2 = getImage(1);
        if (img2) drawCoverImage(ctx, img2, marginX + w1 + gap, marginTop, w2, rowH, 12, filter);

        // Row 2: 35% left, 65% right
        const w3 = w2;
        const w4 = w1;
        const y2 = marginTop + rowH + gap;
        const img3 = getImage(2);
        if (img3) drawCoverImage(ctx, img3, marginX, y2, w3, rowH, 12, filter);
        const img4 = getImage(3);
        if (img4) drawCoverImage(ctx, img4, marginX + w3 + gap, y2, w4, rowH, 12, filter);
        break;
      }

      // 17. Postage Stamp Quad
      case 'postage_stamps': {
        const gap = 36;
        const photoW = (usableWidth - gap) / 2;
        const photoH = (usableHeight - gap) / 2;
        for (let i = 0; i < 4; i++) {
          const img = getImage(i);
          if (img) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = marginX + col * (photoW + gap);
            const y = marginTop + row * (photoH + gap);

            // Stamp border
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x - 12, y - 12, photoW + 24, photoH + 24);
            ctx.restore();

            drawCoverImage(ctx, img, x, y, photoW, photoH, 4, filter);
          }
        }
        break;
      }

      // 18. Cinematic 2.39:1 Dual
      case 'cinema_duo': {
        const gap = 40;
        const cinemaH = usableWidth / 2.39;
        const totalCinemaH = (cinemaH * 2) + gap;
        const startY = marginTop + (usableHeight - totalCinemaH) / 2;

        for (let i = 0; i < 2; i++) {
          const img = getImage(i);
          if (img) {
            const y = startY + i * (cinemaH + gap);
            drawCoverImage(ctx, img, marginX, y, usableWidth, cinemaH, 6, filter);
          }
        }
        break;
      }

      // 19. Spotlight Center Stage
      case 'hero_center': {
        const gap = 20;
        const sideW = (usableWidth - (2 * gap)) * 0.26;
        const centerW = usableWidth - (2 * gap) - (sideW * 2);

        const imgLeft = getImage(0);
        if (imgLeft) drawCoverImage(ctx, imgLeft, marginX, marginTop, sideW, usableHeight, 10, filter);

        const imgCenter = getImage(1);
        if (imgCenter) drawCoverImage(ctx, imgCenter, marginX + sideW + gap, marginTop, centerW, usableHeight, 16, filter);

        const imgRight = getImage(2);
        if (imgRight) drawCoverImage(ctx, imgRight, marginX + sideW + gap + centerW + gap, marginTop, sideW, usableHeight, 10, filter);
        break;
      }

      // 20. 4 Mini Polaroids
      case 'quad_polaroid': {
        const gap = 36;
        const cardW = (usableWidth - gap) / 2;
        const cardH = (usableHeight - gap) / 2;

        for (let i = 0; i < 4; i++) {
          const img = getImage(i);
          if (img) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const cardX = marginX + col * (cardW + gap);
            const cardY = marginTop + row * (cardH + gap);

            // White Polaroid Card
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.15)';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, 8);
            ctx.fill();
            ctx.restore();

            const pPad = 18;
            const pW = cardW - (pPad * 2);
            const pH = cardH * 0.72;
            drawCoverImage(ctx, img, cardX + pPad, cardY + pPad, pW, pH, 4, filter);
          }
        }
        break;
      }

      default:
        drawVerticalStrip(4, 24);
        break;
    }

    // 3. Draw Stickers (Clamped safely within frame bounds)
    stickers.forEach(sticker => {
      ctx.save();
      const clampedX = Math.max(6, Math.min(94, sticker.x));
      const clampedY = Math.max(6, Math.min(94, sticker.y));
      const posX = (clampedX / 100) * width;
      const posY = (clampedY / 100) * height;

      ctx.translate(posX, posY);
      ctx.rotate((sticker.rotation * Math.PI) / 180);

      const isWord = /^[A-Z0-9\s!]+$/i.test(sticker.symbol);
      if (isWord) {
        // Draw studio pill badge
        const fontSize = sticker.size * 1.3;
        ctx.font = `800 ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
        const textMetrics = ctx.measureText(sticker.symbol);
        const padX = fontSize * 0.55;
        const padY = fontSize * 0.35;
        const badgeW = textMetrics.width + (padX * 2);
        const badgeH = fontSize + (padY * 2);

        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;

        ctx.fillStyle = '#121214';
        ctx.beginPath();
        ctx.roundRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 8);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.symbol, 0, 1);
      } else {
        ctx.font = `${sticker.size * 2.2}px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.symbol, 0, 0);
      }
      ctx.restore();
    });

    // 4. Draw Photobooth Footer / Branding
    ctx.save();
    ctx.fillStyle = frameTheme.textColor;
    ctx.textAlign = 'center';

    const footerCenterY = height - (footerHeight / 2) + 10;

    // Custom Logo if present
    if (loadedLogo) {
      const logoH = 45;
      const logoW = (loadedLogo.width / loadedLogo.height) * logoH;
      ctx.drawImage(loadedLogo, (width - logoW) / 2, footerCenterY - 45, logoW, logoH);
    } else {
      ctx.font = isStrip ? "700 20px 'Plus Jakarta Sans', sans-serif" : "700 26px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(subTitle || 'PHOTO STUDIO • MEMORIES', width / 2, footerCenterY - 30);
    }

    // Main Event Name
    ctx.font = isStrip ? "800 38px 'Plus Jakarta Sans', sans-serif" : "800 48px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(eventName || 'SNAPBOOTH', width / 2, footerCenterY + 12);

    // Date
    if (showDate) {
      ctx.font = isStrip ? "500 16px 'Plus Jakarta Sans', monospace" : "500 20px 'Plus Jakarta Sans', monospace";
      ctx.fillStyle = frameTheme.textColor === '#ffffff' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.6)';
      ctx.fillText(dateText || new Date().toISOString().slice(0, 10).replace(/-/g, '.'), width / 2, footerCenterY + 44);
    }

    ctx.restore();
  };

  // Check if Twin-Strip mode on 4x6 paper is requested
  if (isStrip && twinStrip) {
    const singleCanvas = document.createElement('canvas');
    singleCanvas.width = 600;
    singleCanvas.height = 1800;
    renderSingleSheet(singleCanvas);

    const twinCanvas = document.createElement('canvas');
    twinCanvas.width = 1200;
    twinCanvas.height = 1800;
    const twinCtx = twinCanvas.getContext('2d');
    if (!twinCtx) throw new Error('Twin canvas error');

    twinCtx.drawImage(singleCanvas, 0, 0);
    twinCtx.drawImage(singleCanvas, 600, 0);

    twinCtx.save();
    twinCtx.strokeStyle = 'rgba(128, 128, 128, 0.4)';
    twinCtx.lineWidth = 2;
    twinCtx.setLineDash([8, 8]);
    twinCtx.beginPath();
    twinCtx.moveTo(600, 20);
    twinCtx.lineTo(600, 1780);
    twinCtx.stroke();
    twinCtx.restore();

    return twinCanvas.toDataURL('image/png', 0.95);
  }

  // Normal sheet render
  const singleCanvas = document.createElement('canvas');
  singleCanvas.width = isStrip ? 600 : 1200;
  singleCanvas.height = 1800;
  renderSingleSheet(singleCanvas);

  return singleCanvas.toDataURL('image/png', 0.95);
}
