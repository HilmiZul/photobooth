import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, QrCode, Sparkles, Ticket, ShieldCheck, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import { sound } from '../utils/sound';
import { PhotoboothConfig } from '../types';

interface PaymentScreenProps {
  config: PhotoboothConfig;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  config,
  onPaymentSuccess,
  onBack
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(180);

  // Generate dynamic QRIS barcode
  useEffect(() => {
    // Generate QR code encoding a simulated QRIS payload
    const qrisPayload = `00020101021226680016ID.CO.QRIS.WWW01189360091800000000000215ID10200000000000303UME51440014ID.GOV.BCA.WWW0215000000000000000520458125303360540${config.price}.005802ID5910SNAPBOOTH6007JAKARTA62070703A016304`;
    QRCode.toDataURL(qrisPayload, {
      width: 280,
      margin: 2,
      color: {
        dark: '#18181b',
        light: '#ffffff'
      }
    }).then(setQrUrl).catch(() => {});

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [config.price, onBack]);

  const handleSimulatePayment = () => {
    sound.playClick();
    setIsProcessing(true);
    setTimeout(() => {
      sound.playSuccess();
      onPaymentSuccess();
    }, 1200);
  };

  const handleVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (voucherCode.trim().toUpperCase() === 'FREE' || voucherCode.trim().toUpperCase() === 'VIP' || voucherCode.length >= 4) {
      sound.playSuccess();
      setIsProcessing(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 800);
    } else {
      sound.playBeep(300);
      setVoucherError('Voucher tidak valid. Coba: VIP atau FREE');
    }
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-6 max-w-4xl mx-auto w-full select-none overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-neutral-300 text-xs sm:text-sm font-medium transition border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
          <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
          <span>Batas Waktu: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
        </div>
      </div>

      {/* Main Payment Card */}
      <div className="my-auto py-2 sm:py-4 flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8">
        {/* QR Code Container */}
        <div className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col items-center text-neutral-900 border border-neutral-200 max-w-[280px] sm:max-w-xs w-full shrink-0">
          <div className="flex items-center justify-between w-full border-b border-neutral-200 pb-2 mb-3">
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-neutral-800">QRIS RESMI</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">SEMUA E-WALLET</span>
          </div>

          {qrUrl ? (
            <img src={qrUrl} alt="QRIS Payment" className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl shadow-inner" />
          ) : (
            <div className="w-48 h-48 sm:w-56 sm:h-56 bg-neutral-100 rounded-xl flex items-center justify-center">
              <QrCode className="w-12 h-12 text-neutral-300 animate-pulse" />
            </div>
          )}

          <div className="mt-3 text-center">
            <p className="text-[11px] text-neutral-500 font-medium">BCA, Mandiri, GoPay, OVO, ShopeePay, Dana, dll.</p>
          </div>
        </div>

        {/* Payment Details & Actions */}
        <div className="max-w-md w-full space-y-4 sm:space-y-5 text-left">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/[0.06] text-neutral-300 text-xs font-semibold tracking-wider uppercase border border-white/10">
              Self-Service Payment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-heading">
              Selesaikan Pembayaran
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Dapatkan 1 sesi foto lengkap (cetakan photostrip + file digital resolusi tinggi ke HP).
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl studio-glass space-y-2">
            <div className="flex justify-between text-xs sm:text-sm text-neutral-400">
              <span>Paket Photobooth</span>
              <span className="text-white font-medium">Photostrip (4 Pose)</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-neutral-400">
              <span>Biaya Layanan</span>
              <span className="text-emerald-400 font-medium">Termasuk</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between items-baseline">
              <span className="font-bold text-xs sm:text-sm text-neutral-200">Total Pembayaran</span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {config.currency} {config.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Quick simulation button */}
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="w-full py-3.5 sm:py-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm sm:text-base shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
                <span>Memproses Pembayaran...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-950" />
                <span>Simulasikan Pembayaran Berhasil</span>
              </>
            )}
          </button>

          {/* Voucher / Token bypass */}
          <div className="pt-2 border-t border-white/[0.08]">
            <p className="text-[11px] text-neutral-400 mb-1.5 font-medium flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>Punya Kode Voucher / Token Acara?</span>
            </p>
            <form onSubmit={handleVoucher} className="flex gap-2">
              <input
                type="text"
                placeholder="Kode (Cth: VIP)"
                value={voucherCode}
                onChange={(e) => {
                  setVoucherCode(e.target.value);
                  setVoucherError('');
                }}
                className="flex-1 py-1.5 px-3 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm focus:border-white focus:outline-none uppercase font-mono text-white"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-neutral-200 text-xs font-semibold border border-white/10"
              >
                Gunakan
              </button>
            </form>
            {voucherError && <p className="text-[11px] text-rose-400 mt-1">{voucherError}</p>}
          </div>
        </div>
      </div>

      {/* Footer secure badge */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pb-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Sistem Pembayaran Kiosk Aman & Terverifikasi Otomatis</span>
      </div>
    </div>
  );
};

