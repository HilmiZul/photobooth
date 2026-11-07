import React, { useState } from 'react';
import { X, Lock, CheckCircle2, DollarSign, Sliders, Calendar, Clock, RotateCcw } from 'lucide-react';
import { PhotoboothConfig } from '../types';
import { sound } from '../utils/sound';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PhotoboothConfig;
  onSaveConfig: (newConfig: PhotoboothConfig) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState<PhotoboothConfig>({ ...config });

  if (!isOpen) return null;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === config.adminPin || pinInput === '1234') {
      setIsAuthenticated(true);
      setErrorMsg('');
      sound.playSuccess();
    } else {
      setErrorMsg('PIN salah! Coba default: 1234');
      sound.playBeep(300);
    }
  };

  const handleSave = () => {
    onSaveConfig(form);
    sound.playSuccess();
    onClose();
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleClose = () => {
    onClose();
    setIsAuthenticated(false);
    setPinInput('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg studio-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative text-neutral-100 max-h-[90vh] flex flex-col my-auto border border-white/10">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="py-6 sm:py-8 text-center my-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mb-4">
              <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 font-heading">Pengaturan Admin Kiosk</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6">Masukkan PIN keamanan untuk konfigurasi photobooth</p>

            <form onSubmit={handleAuth} className="max-w-xs mx-auto space-y-4">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN (Default: 1234)"
                autoFocus
                className="w-full text-center text-xl sm:text-2xl tracking-widest font-mono py-2.5 sm:py-3 px-4 rounded-xl bg-black/80 border border-white/15 focus:border-white focus:outline-none text-white"
              />
              {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white text-neutral-950 font-bold text-sm shadow-xl transition active:scale-95 hover:bg-neutral-100"
              >
                Buka Pengaturan
              </button>
            </form>
          </div>
        ) : (
          /* Configuration Settings */
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-heading">Kiosk & Event Studio Setup</h3>
                <p className="text-[11px] text-neutral-400">Atur branding, pembayaran, dan alur photobooth</p>
              </div>
            </div>

            {/* Business & Hardware Analytics Dashboard */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/60 border border-white/10">
              <div className="text-center">
                <p className="text-[10px] text-neutral-400 uppercase font-semibold">Sesi Hari Ini</p>
                <p className="text-lg font-black text-white font-heading mt-0.5">{form.totalSessionsToday}</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-[10px] text-neutral-400 uppercase font-semibold">Omzet Estimasi</p>
                <p className="text-sm sm:text-base font-black text-emerald-400 font-heading mt-1">
                  {form.currency} {(form.totalSessionsToday * form.price).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-neutral-400 uppercase font-semibold">Sisa Kertas</p>
                <p className="text-xs font-bold text-amber-300 mt-1">
                  {Math.max(0, form.paperRollCapacity - form.totalPrintsToday)} / {form.paperRollCapacity}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Event Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Nama Brand / Event</label>
                <input
                  type="text"
                  value={form.eventName}
                  onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-black/60 border border-white/10 focus:border-white focus:outline-none text-white"
                  placeholder="Contoh: SNAPBOOTH, WEDDING OF DIMAS & SITI"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Sub Judul / Tagline Frame</label>
                <input
                  type="text"
                  value={form.subTitle}
                  onChange={(e) => setForm({ ...form, subTitle: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-black/60 border border-white/10 focus:border-white focus:outline-none text-white"
                  placeholder="Contoh: PHOTO STUDIO • SPECIAL MEMORIES"
                />
              </div>

              {/* Custom Logo Upload */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Logo Kustom Event (Opsional PNG)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setForm({ ...form, customLogoUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-neutral-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-white/10 file:text-neutral-200 hover:file:bg-white/20"
                  />
                  {form.customLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, customLogoUrl: undefined })}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              {/* Date stamp */}
              <div className="grid grid-cols-2 gap-2.5 items-center">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Teks Tanggal</label>
                  <input
                    type="text"
                    value={form.dateText}
                    onChange={(e) => setForm({ ...form, dateText: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl bg-black/60 border border-white/10 focus:border-white focus:outline-none text-white font-mono text-xs"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showDate}
                      onChange={(e) => setForm({ ...form, showDate: e.target.checked })}
                      className="w-4 h-4 rounded text-white bg-black border-white/20"
                    />
                    <span className="text-xs text-neutral-300">Tampilkan Tanggal</span>
                  </label>
                </div>
              </div>

              {/* Payment Mode */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-xs text-neutral-200">Mode Bayar Mandiri (QRIS)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.requirePayment}
                      onChange={(e) => setForm({ ...form, requirePayment: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>

                {form.requirePayment && (
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Harga Sesi (Rp)</label>
                      <input
                        type="number"
                        step={5000}
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className="w-full py-1.5 px-3 rounded-lg bg-black border border-white/10 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Mata Uang</label>
                      <input
                        type="text"
                        value={form.currency}
                        onChange={(e) => setForm({ ...form, currency: e.target.value })}
                        className="w-full py-1.5 px-3 rounded-lg bg-black border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Timer Settings */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Countdown Pose</label>
                  <select
                    value={form.countdownSeconds}
                    onChange={(e) => setForm({ ...form, countdownSeconds: Number(e.target.value) })}
                    className="w-full py-2 px-3 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  >
                    <option value={3}>3 Detik (Cepat)</option>
                    <option value={5}>5 Detik (Ideal)</option>
                    <option value={8}>8 Detik (Santai)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Auto-Reset Selesai</label>
                  <select
                    value={form.autoResetSeconds}
                    onChange={(e) => setForm({ ...form, autoResetSeconds: Number(e.target.value) })}
                    className="w-full py-2 px-3 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  >
                    <option value={30}>30 Detik</option>
                    <option value={60}>60 Detik</option>
                    <option value={120}>2 Menit</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-neutral-300 font-medium text-xs transition border border-white/10"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-neutral-100 font-bold text-xs text-neutral-950 shadow-xl transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-neutral-950" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

