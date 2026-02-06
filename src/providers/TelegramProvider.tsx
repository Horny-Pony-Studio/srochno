'use client';

import { type ReactNode, useEffect } from 'react';
import {
  init,
  backButton,
  mainButton,
  viewport,
  themeParams,
  initData,
  miniApp,
  swipeBehavior,
  closingBehavior,
} from '@telegram-apps/sdk-react';

export function TelegramProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      init();

      // Mount mini app and signal ready
      if (miniApp.mountSync.isAvailable()) {
        miniApp.mountSync();
      }

      // Expand viewport to full height and bind CSS vars for safe areas
      if (viewport.mount.isAvailable()) {
        viewport.mount().then(() => {
          viewport.expand();
          if (viewport.bindCssVars.isAvailable()) {
            viewport.bindCssVars();
          }
        });
      }

      // Bind theme CSS variables
      if (miniApp.bindCssVars.isAvailable()) {
        miniApp.bindCssVars();
      }

      // Mount back button for sub-pages to use
      if (backButton.mount.isAvailable()) {
        backButton.mount();
      }

      // Mount main button for pages to use
      if (mainButton.mount.isAvailable()) {
        mainButton.mount();
      }

      // Mount closing behavior for form protection
      if (closingBehavior.mount.isAvailable()) {
        closingBehavior.mount();
      }

      // Disable vertical swipe to prevent accidental close
      if (swipeBehavior.mount.isAvailable()) {
        swipeBehavior.mount();
        if (swipeBehavior.disableVertical.isAvailable()) {
          swipeBehavior.disableVertical();
        }
      }

      // Set header and background colors to match theme
      try {
        const headerBg = themeParams.headerBackgroundColor();
        if (headerBg && miniApp.setHeaderColor.isAvailable()) {
          miniApp.setHeaderColor(headerBg);
        }
        const bgColor = themeParams.backgroundColor();
        if (bgColor && miniApp.setBackgroundColor.isAvailable()) {
          miniApp.setBackgroundColor(bgColor);
        }
      } catch {
        // Theme params may not be available
      }

      // Signal to Telegram that the app is ready
      if (miniApp.ready.isAvailable()) {
        miniApp.ready();
      }
    } catch (error) {
      console.error('Failed to initialize Telegram SDK:', error);
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
  miniApp,
  closingBehavior,
  swipeBehavior,
  popup,
  openLink,
  openTelegramLink,
} from '@telegram-apps/sdk-react';
