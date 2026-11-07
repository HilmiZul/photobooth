import React, { useEffect, useState } from 'react';
import { Printer, Download, QrCode, CheckCircle2, Film, Layers, Copy, Share2 } from 'lucide-react';
import QRCode from 'qrcode';
import { sound } from '../utils/sound';
import { PhotoboothConfig, LayoutType } from '../types';

interface ResultScreenProps {
  finalImageUrl: string;
  photos?: string[];
  layout?: LayoutType;
  config: PhotoboothConfig;
  onFinishSession: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  finalImageUrl,
  photos = [],
  layout,
  config,
  onFinishSession
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [resetTimer, setResetTimer] = useState<number>(config.autoResetSeconds || 60);
  const [previewTab, setPreviewTab] = useState<'strip' | 'boomerang'>('strip');
  const [boomerangIndex, setBoomerangIndex] = useState(0);
  const isStripLayout = layout === 'strip4' || layout === 'strip3' || layout === 'strip2' || layout === 'strip5' || layout === 'strip6';
  const [isTwinStrip, setIsTwinStrip] = useState(config.twinStripPrint && isStripLayout);
  const [displayImageUrl, setDisplayImageUrl] = useState(finalImageUrl);

  // Generate twin strip image if enabled
  useEffect(() => {
    if (!isStripLayout || !isTwinStrip) {
      setDisplayImageUrl(finalImageUrl);
      return;
    }

    // Build side-by-side twin strip on 1200x1800 canvas
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw Left copy
      ctx.drawImage(img, 0, 0, 600, 1800);
      // Draw Right copy
      ctx.drawImage(img, 600, 0, 600, 1800);

      // Center dotted cut line
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(600, 30);
      ctx.lineTo(600, 1770);
      ctx.stroke();
      ctx.restore();

      setDisplayImageUrl(canvas.toDataURL('image/png', 0.95));
    };
    img.src = finalImageUrl;
  }, [isTwinStrip, finalImageUrl, layout]);

  // Boomerang loop
  useEffect(() => {
    if (previewTab !== 'boomerang' || photos.length === 0) return;
    const interval = setInterval(() => {
      setBoomerangIndex(prev => (prev + 1) % photos.length);
    }, 380);
    return () => clearInterval(interval);
  }, [previewTab, photos]);

  // Generate QR code and initialize session
  useEffect(() => {
    sound.playSuccess();

    // Generate QR code for mobile download
    const downloadPageUrl = window.location.href;
    QRCode.toDataURL(downloadPageUrl, {
      width: 240,
      margin: 2,
      color: {
        dark: '#09090b',
        light: '#ffffff'
      }
    }).then(setQrCodeUrl).catch(() => {});

    // Auto reset countdown
    const interval = setInterval(() => {
      setResetTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onFinishSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [config.autoResetSeconds, onFinishSession]);

  const [isPrinting, setIsPrinting] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);

  const handlePrint = () => {
    sound.playClick();
    setIsPrinting(true);
    setPrintProgress(10);

    const interval = setInterval(() => {
      setPrintProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsPrinting(false);
            window.print();
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleDownload = () => {
    sound.playClick();
    const link = document.createElement('a');
    link.download = `photobooth_${Date.now()}.png`;
    link.href = displayImageUrl;
    link.click();
  };

  const handleDone = () => {
    sound.playClick();
    onFinishSession();
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-6 max-w-5xl mx-auto w-full select-none overflow-y-auto">
      {/* Printable Area Only Visible During window.print() */}
      <div className="hidden print:block fixed inset-0 m-0 p-0 bg-white z-[99999]">
        <img
          src={displayImageUrl}
          alt="Photostrip Print"
          className="w-full h-full object-contain mx-auto"
          style={{ maxHeight: '100vh' }}
        />
      </div>

      {/* Printing In-Progress Overlay Modal */}
      {isPrinting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="studio-card p-6 sm:p-8 rounded-3xl max-w-sm w-full text-center space-y-4 border border-white/20 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center text-white relative">
              <Printer className="w-8 h-8 animate-pulse text-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping"></div>
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-white font-heading">Mencetak Photostrip...</h4>
              <p className="text-xs text-neutral-400 mt-1">Mengirim dokumen resolusi 300 DPI ke printer foto.</p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300 rounded-full"
                style={{ width: `${printProgress}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono">Harap ambil hasil cetak di baki keluar printer.</p>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex items-center justify-between z-10 print:hidden mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white font-heading">Selesai!</h3>
            <p className="text-[11px] text-neutral-400 hidden xs:block">Foto siap dicetak dan disimpan.</p>
          </div>
        </div>

        {/* Auto reset badge */}
        <div className="text-[11px] sm:text-xs px-3 py-1 rounded-full studio-glass text-neutral-300 font-mono flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>Reset: {resetTimer}s</span>
        </div>
      </div>

      {/* Main Content: Left is High-Res Preview, Right is Actions & QR Code */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 sm:gap-8 items-center justify-center my-auto print:hidden py-2">
        {/* Rendered Preview Card with Switcher */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          {photos.length > 1 && (
            <div className="flex p-1 rounded-xl bg-black/60 border border-white/10 text-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  setPreviewTab('strip');
                }}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                  previewTab === 'strip' ? 'bg-white text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Foto Strip</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setPreviewTab('boomerang');
                }}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                  previewTab === 'boomerang' ? 'bg-white text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Live Boomerang</span>
              </button>
            </div>
          )}

          <div className="max-h-[380px] sm:max-h-[480px] flex items-center justify-center p-3 studio-card rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            {previewTab === 'strip' ? (
              <img
                src={displayImageUrl}
                alt="Final Photostrip"
                className="max-h-[360px] sm:max-h-[450px] w-auto rounded-lg sm:rounded-xl shadow-lg border border-white/10 object-contain"
              />
            ) : (
              <div className="w-[240px] h-[340px] sm:w-[280px] sm:h-[420px] rounded-xl overflow-hidden relative flex flex-col items-center justify-center bg-black">
                <img
                  src={photos[boomerangIndex]}
                  alt="Boomerang Frame"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-emerald-400 font-bold border border-white/10">
                  FRAME #{boomerangIndex + 1}
                </div>
              </div>
            )}
          </div>

          {/* Twin Strip Toggle for all 2x6 Photostrips */}
          {isStripLayout && previewTab === 'strip' && (
            <button
              onClick={() => {
                sound.playClick();
                setIsTwinStrip(!isTwinStrip);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                isTwinStrip
                  ? 'bg-white/15 border-white text-white'
                  : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isTwinStrip ? '✓ Cetak 2 Strip (Twin 4x6")' : 'Cetak 1 Strip Tunggal (2x6")'}</span>
            </button>
          )}
        </div>

        {/* Actions & QR Delivery Panel */}
        <div className="w-full max-w-sm flex flex-col gap-3 sm:gap-4 shrink-0">
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-extrabold text-sm sm:text-base shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2.5"
          >
            <Printer className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-950" />
            <span>CETAK FOTO SEKARANG</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-bold text-xs sm:text-sm border border-white/10 shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-neutral-300" />
            <span>Download File Resolusi Penuh</span>
          </button>

          {/* Share to WhatsApp Button */}
          <button
            onClick={() => {
              sound.playClick();
              const message = encodeURIComponent(`Halo! Ini hasil foto studio photobooth saya dari ${config.eventName}: ${window.location.href}`);
              window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
            }}
            className="w-full py-2.5 sm:py-3 px-5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs sm:text-sm border border-emerald-500/30 shadow transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Kirim / Simpan ke WhatsApp</span>
          </button>

          {/* QR Code Delivery Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl studio-glass text-center flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>SCAN UNTUK SIMPAN KE HP</span>
            </div>

            {qrCodeUrl ? (
              <div className="p-2 bg-white rounded-xl shadow-inner">
                <img src={qrCodeUrl} alt="Scan to Phone" className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg" />
              </div>
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-neutral-800 rounded-xl flex items-center justify-center">
                <QrCode className="w-8 h-8 text-neutral-500 animate-pulse" />
              </div>
            )}

            <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-2 max-w-[220px]">
              Arahkan kamera HP ke QR code di atas untuk membuka & download foto ke galeri.
            </p>
          </div>

          {/* Finish & Return to Start */}
          <button
            onClick={handleDone}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white text-xs font-semibold border border-white/[0.08] transition"
          >
            Selesai & Mulai Sesi Baru
          </button>
        </div>
      </div>
    </div>
  );
};
