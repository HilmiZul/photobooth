import React, { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { LayoutSelectScreen } from './components/LayoutSelectScreen';
import { CaptureScreen } from './components/CaptureScreen';
import { EditScreen } from './components/EditScreen';
import { ResultScreen } from './components/ResultScreen';
import { AdminModal } from './components/AdminModal';
import { AppStep, LayoutType, PhotoboothConfig, FilterType, FrameTheme, StickerItem } from './types';
import { FRAME_THEMES } from './constants';
import { renderPhotoboothCanvas } from './utils/canvasRenderer';

const DEFAULT_CONFIG: PhotoboothConfig = {
  eventName: 'SNAPBOOTH',
  subTitle: 'PHOTO STUDIO • MEMORIES',
  showDate: true,
  dateText: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
  price: 30000,
  currency: 'Rp',
  countdownSeconds: 5,
  autoResetSeconds: 60,
  requirePayment: false, // Default false for smooth initial testing, toggleable in Admin
  adminPin: '1234',
  soundEnabled: true,
  voiceGuide: true,
  twinStripPrint: true,
  totalSessionsToday: 0,
  totalPrintsToday: 0,
  paperRollCapacity: 400
};

export const App: React.FC = () => {
  // Load config from localStorage if available
  const [config, setConfig] = useState<PhotoboothConfig>(() => {
    const saved = localStorage.getItem('snapbooth_config');
    if (saved) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('strip4');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [finalImage, setFinalImage] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const saveConfig = (newConfig: PhotoboothConfig) => {
    setConfig(newConfig);
    localStorage.setItem('snapbooth_config', JSON.stringify(newConfig));
  };

  const handleStart = () => {
    if (config.requirePayment) {
      setCurrentStep('payment');
    } else {
      setCurrentStep('layout');
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('layout');
  };

  const handleLayoutSelected = () => {
    setCurrentStep('capture');
  };

  const handlePhotosCaptured = (photos: string[]) => {
    setCapturedPhotos(photos);
    setCurrentStep('edit');
  };

  const handleFinishEdit = async (data: {
    filter: FilterType;
    frameTheme: FrameTheme;
    stickers: StickerItem[];
    eventName: string;
    subTitle: string;
    showDate: boolean;
    dateText: string;
  }) => {
    try {
      const renderedUrl = await renderPhotoboothCanvas({
        photos: capturedPhotos,
        layout: selectedLayout,
        filter: data.filter,
        frameTheme: data.frameTheme,
        stickers: data.stickers,
        eventName: data.eventName,
        subTitle: data.subTitle,
        showDate: data.showDate,
        dateText: data.dateText,
        customLogoUrl: config.customLogoUrl
      });
      setFinalImage(renderedUrl);
      setCurrentStep('result');
    } catch (err) {
      console.error('Rendering failed:', err);
    }
  };

  const handleResetSession = () => {
    setCapturedPhotos([]);
    setFinalImage('');
    setCurrentStep('welcome');
  };

  return (
    <div className="flex flex-col min-h-dvh h-dvh w-full overflow-hidden bg-neutral-950 text-neutral-100 selection:bg-pink-500/30">
      {/* Top Navigation Bar */}
      <HeaderBar
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isCapturing={currentStep === 'capture'}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
        {currentStep === 'welcome' && (
          <WelcomeScreen
            config={config}
            onStart={handleStart}
          />
        )}

        {currentStep === 'payment' && (
          <PaymentScreen
            config={config}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setCurrentStep('welcome')}
          />
        )}

        {currentStep === 'layout' && (
          <LayoutSelectScreen
            selectedLayout={selectedLayout}
            onSelectLayout={setSelectedLayout}
            onNext={handleLayoutSelected}
            onBack={() => setCurrentStep('welcome')}
          />
        )}

        {currentStep === 'capture' && (
          <CaptureScreen
            layout={selectedLayout}
            config={config}
            onPhotosCaptured={handlePhotosCaptured}
            onBack={() => setCurrentStep('layout')}
          />
        )}

        {currentStep === 'edit' && (
          <EditScreen
            photos={capturedPhotos}
            layout={selectedLayout}
            config={config}
            onFinishEdit={handleFinishEdit}
            onRetake={() => setCurrentStep('capture')}
          />
        )}

        {currentStep === 'result' && (
          <ResultScreen
            finalImageUrl={finalImage}
            photos={capturedPhotos}
            layout={selectedLayout}
            config={config}
            onFinishSession={handleResetSession}
          />
        )}
      </main>

      {/* Admin Settings Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSaveConfig={saveConfig}
      />
    </div>
  );
};

export default App;

