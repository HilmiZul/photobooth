import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, FlipHorizontal, RefreshCw, Sparkles, Check, AlertCircle } from 'lucide-react';
import { LayoutType, PhotoboothConfig } from '../types';
import { LAYOUT_OPTIONS } from '../constants';
import { sound } from '../utils/sound';

interface CaptureScreenProps {
  layout: LayoutType;
  config: PhotoboothConfig;
  onPhotosCaptured: (photos: string[]) => void;
  onBack: () => void;
}

export const CaptureScreen: React.FC<CaptureScreenProps> = ({
  layout,
  config,
  onPhotosCaptured,
  onBack
}) => {
  const currentLayoutOption = LAYOUT_OPTIONS.find(l => l.id === layout);
  const targetPhotoCount = currentLayoutOption ? currentLayoutOption.photoCount : 4;

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isMirrored, setIsMirrored] = useState(true);
  const [cameraError, setCameraError] = useState<string>('');
  
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const sessionPhotosRef = useRef<string[]>([]);
  const activeTimerRef = useRef<number | null>(null);
  const activeTimeoutRef = useRef<number | null>(null);

  const [currentPoseIndex, setCurrentPoseIndex] = useState(0); // 0 to targetPhotoCount - 1
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (activeTimerRef.current !== null) {
        clearInterval(activeTimerRef.current);
      }
      if (activeTimeoutRef.current !== null) {
        clearTimeout(activeTimeoutRef.current);
      }
    };
  }, []);

  // Initialize camera
  const startCamera = useCallback(async (deviceId?: string) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      // Enumerate camera devices
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
      setDevices(videoDevices);
      setCameraError('');
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan di browser.');
    }
  }, []);

  useEffect(() => {
    startCamera(selectedDeviceId);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [selectedDeviceId, startCamera]);

  // Capture a single photo frame from the video stream
  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video) return null;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.95);
  }, [isMirrored]);

  // Take photo sequence loop - strictly single-threaded & protected against double invocation
  const startCountdownForPose = useCallback((poseIdx: number) => {
    // Clear any existing active timer or pending timeout
    if (activeTimerRef.current !== null) {
      clearInterval(activeTimerRef.current);
      activeTimerRef.current = null;
    }
    if (activeTimeoutRef.current !== null) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }

    setCurrentPoseIndex(poseIdx);
    let count = config.countdownSeconds;
    setCountdown(count);

    if (config.voiceGuide) {
      sound.speak(`Pose ${poseIdx + 1}`);
    }

    const timer = window.setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        if (config.voiceGuide && count <= 3) {
          sound.speak(`${count}`);
        }
      } else if (count === 0) {
        if (activeTimerRef.current !== null) {
          clearInterval(activeTimerRef.current);
          activeTimerRef.current = null;
        }
        setCountdown(null);

        // Flash screen & Shutter sound
        setIsFlashing(true);
        sound.playShutter();
        if (config.voiceGuide) {
          sound.speak('Senyum!');
        }

        activeTimeoutRef.current = window.setTimeout(() => {
          setIsFlashing(false);
          const photoData = captureFrame();

          if (photoData) {
            // Append strictly to our session ref to avoid any state closure staleness
            sessionPhotosRef.current.push(photoData);
            const currentList = [...sessionPhotosRef.current];
            setCapturedPhotos(currentList);

            if (currentList.length >= targetPhotoCount) {
              // All poses completed!
              setIsSessionActive(false);
              sound.playSuccess();
              activeTimeoutRef.current = window.setTimeout(() => {
                onPhotosCaptured(currentList);
              }, 800);
            } else {
              // Proceed to next pose with a distinct 1.5s preparation pause
              const nextIndex = currentList.length;
              setCurrentPoseIndex(nextIndex);
              activeTimeoutRef.current = window.setTimeout(() => {
                startCountdownForPose(nextIndex);
              }, 1500);
            }
          }
        }, 150);
      }
    }, 1000);

    activeTimerRef.current = timer;
  }, [config.countdownSeconds, config.voiceGuide, captureFrame, targetPhotoCount, onPhotosCaptured]);

  // Start the photoshoot session
  const handleStartShooting = () => {
    sound.playClick();
    if (activeTimerRef.current !== null) {
      clearInterval(activeTimerRef.current);
      activeTimerRef.current = null;
    }
    if (activeTimeoutRef.current !== null) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }
    sessionPhotosRef.current = [];
    setCapturedPhotos([]);
    setCurrentPoseIndex(0);
    setIsSessionActive(true);
    startCountdownForPose(0);
  };

  const handleRetakeAll = () => {
    sound.playClick();
    if (activeTimerRef.current !== null) {
      clearInterval(activeTimerRef.current);
      activeTimerRef.current = null;
    }
    if (activeTimeoutRef.current !== null) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }
    sessionPhotosRef.current = [];
    setCapturedPhotos([]);
    setCurrentPoseIndex(0);
    setIsSessionActive(false);
    setCountdown(null);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-6 max-w-6xl mx-auto w-full select-none relative overflow-y-auto">
      {/* Flash overlay */}
      {isFlashing && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none animate-flash"></div>
      )}

      {/* Top Bar with Camera Controls */}
      <div className="flex items-center justify-between z-10 mb-2 sm:mb-4 gap-2">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          disabled={isSessionActive}
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-neutral-300 text-xs font-semibold disabled:opacity-40 border border-white/10"
        >
          ← Format
        </button>

        {/* Pose step indicator */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full studio-glass text-xs">
          <span className="font-bold text-white text-[11px] sm:text-xs">
            Pose {Math.min(capturedPhotos.length + 1, targetPhotoCount)}/{targetPhotoCount}
          </span>
          <div className="flex gap-1 ml-1 sm:ml-2">
            {Array.from({ length: targetPhotoCount }).map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                  idx < capturedPhotos.length
                    ? 'bg-emerald-400'
                    : idx === currentPoseIndex && isSessionActive
                    ? 'bg-white scale-125 animate-pulse'
                    : 'bg-neutral-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Camera settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {devices.length > 1 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="py-1 px-2 sm:py-1.5 sm:px-3 rounded-xl bg-neutral-900 border border-white/10 text-xs text-neutral-300 max-w-[110px] sm:max-w-[140px] truncate"
            >
              {devices.map((d, i) => (
                <option key={d.deviceId || i} value={d.deviceId}>
                  {d.label || `Kamera ${i + 1}`}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setIsMirrored(!isMirrored)}
            title="Mirror Kamera (Cermin)"
            className={`p-1.5 sm:p-2 rounded-xl border transition ${
              isMirrored ? 'bg-white/20 border-white text-white' : 'bg-neutral-900 border-white/10 text-neutral-400'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewport & Side Rail */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 sm:gap-4 items-center justify-center relative my-auto">
        {/* Camera Viewport */}
        <div className="relative w-full max-w-3xl aspect-[3/4] sm:aspect-[4/3] bg-black rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center max-h-[52vh] sm:max-h-[64vh]">
          {cameraError ? (
            <div className="text-center p-6 max-w-md">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <h4 className="font-bold text-base sm:text-lg mb-1">Akses Kamera Diperlukan</h4>
              <p className="text-xs text-neutral-400 mb-4">{cameraError}</p>
              <button
                onClick={() => startCamera(selectedDeviceId)}
                className="px-5 py-2.5 rounded-xl bg-white text-neutral-950 font-semibold text-xs"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-transform ${
                  isMirrored ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Composition Guidelines Overlay */}
              <div className="absolute inset-0 pointer-events-none border border-white/10 m-2 sm:m-4 rounded-xl sm:rounded-2xl flex flex-col justify-between p-3 sm:p-4">
                <div className="flex justify-between text-[10px] font-mono text-white/40">
                  <span>STUDIO LIVE VIEW</span>
                  <span>1080P • RAW</span>
                </div>

                {/* Center crosshair */}
                <div className="self-center my-auto w-12 h-12 sm:w-16 sm:h-16 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white/70 rounded-full"></div>
                </div>

                <div className="flex justify-between items-end text-[10px] text-white/40">
                  <span>PHOTOBOOTH KIOSK</span>
                  <span>{isSessionActive ? 'POSE SESI AKTIF' : 'READY TO SNAP'}</span>
                </div>
              </div>

              {/* Big Animated Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white text-neutral-950 flex items-center justify-center text-5xl sm:text-7xl font-black shadow-2xl animate-bounce">
                    {countdown}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Thumbnails Rail: Horizontal on mobile, vertical on desktop */}
        <div className="w-full lg:w-44 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto p-2 bg-neutral-900/60 rounded-2xl border border-white/10 shrink-0">
          <p className="text-[10px] font-bold text-neutral-400 hidden lg:block text-center uppercase tracking-wider mb-1">
            Thumbnail
          </p>
          <div className="flex lg:flex-col gap-2 w-full justify-center">
            {Array.from({ length: targetPhotoCount }).map((_, idx) => {
              const photo = capturedPhotos[idx];
              return (
                <div
                  key={idx}
                  className={`w-14 h-18 sm:w-20 sm:h-24 lg:w-full lg:h-24 rounded-xl overflow-hidden border flex items-center justify-center relative shrink-0 ${
                    photo
                      ? 'border-emerald-500 bg-neutral-950 shadow-md'
                      : idx === currentPoseIndex && isSessionActive
                      ? 'border-white bg-white/10 animate-pulse'
                      : 'border-white/10 bg-neutral-950/50'
                  }`}
                >
                  {photo ? (
                    <>
                      <img src={photo} alt={`Pose ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-emerald-400 text-[8px] font-bold">
                        #{idx + 1}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-semibold">
                      #{idx + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-center gap-3 mt-3 sm:mt-4 z-10 shrink-0">
        {!isSessionActive && capturedPhotos.length === 0 && (
          <button
            onClick={handleStartShooting}
            className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-black text-base sm:text-lg shadow-2xl transition transform active:scale-95 flex items-center justify-center gap-2.5"
          >
            <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-950 stroke-[2.5]" />
            <span>MULAI SESI FOTO ({targetPhotoCount} POSE)</span>
          </button>
        )}

        {isSessionActive && (
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full studio-glass text-white font-semibold text-xs sm:text-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>SIAPKAN GAYA TERBAIKMU...</span>
          </div>
        )}

        {!isSessionActive && capturedPhotos.length > 0 && capturedPhotos.length < targetPhotoCount && (
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={handleRetakeAll}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 font-semibold text-xs transition"
            >
              Foto Ulang
            </button>
            <button
              onClick={() => startCountdownForPose(capturedPhotos.length)}
              className="px-6 py-2.5 rounded-xl bg-white text-neutral-950 font-bold text-xs shadow-lg transition"
            >
              Lanjutkan Pose Berikutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

