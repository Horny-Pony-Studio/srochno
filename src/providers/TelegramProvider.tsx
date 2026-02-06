'use client';

import { type ReactNode, useEffect } from 'react';
import { init, backButton, mainButton, viewport, themeParams, initData } from '@telegram-apps/sdk-react';

export function TelegramProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      // Initialize Telegram Mini App SDK
      init();

      // Expand viewport to full height
      if (viewport.mount.isAvailable()) {
        viewport.mount();
        viewport.expand();
      }

      console.log('Telegram Mini App initialized:', {
        initData: initData.raw(),
        user: initData.user(),
        platform: initData.startParam(),
        themeParams: themeParams.get(),
      });
    } catch (error) {
      console.error('Failed to initialize Telegram SDK:', error);
      console.warn('Running in development mode without Telegram environment');
    }
  }, []);

  return <>{children}</>;
}

// Re-export useful SDK functions and hooks
export {
  useLaunchParams,
  useRawInitData,
  useSignal,
} from '@telegram-apps/sdk-react';

export {
  backButton,
  mainButton,
  viewport,
  themeParams,
  initData,
  hapticFeedback,
} from '@telegram-apps/sdk-react';
