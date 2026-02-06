'use client';

import {
  useLaunchParams,
  initData,
  backButton,
  mainButton,
  hapticFeedback,
  themeParams,
} from '@telegram-apps/sdk-react';

/**
 * Main hook to access Telegram Mini App data
 */
export function useTelegram() {
  try {
    const launchParams = useLaunchParams();

    return {
      user: initData.user(),
      initData: initData.raw(),
      platform: launchParams.platform,
      version: launchParams.version,
      themeParams: themeParams.get(),
      startParam: initData.startParam(),
    };
  } catch (error) {
    // Development mode fallback
    return {
      user: {
        id: 123456789,
        firstName: 'Dev',
        lastName: 'User',
        username: 'devuser',
        languageCode: 'uk',
      },
      initData: '',
      platform: 'web' as const,
      version: '7.0',
      themeParams: {},
      startParam: undefined,
    };
  }
}

/**
 * Haptic feedback helper
 */
export function useHaptic() {
  return {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
      try {
        hapticFeedback.impactOccurred(style);
      } catch (e) {
        console.warn('Haptic feedback not available');
      }
    },
    notification: (type: 'error' | 'success' | 'warning') => {
      try {
        hapticFeedback.notificationOccurred(type);
      } catch (e) {
        console.warn('Haptic feedback not available');
      }
    },
    selection: () => {
      try {
        hapticFeedback.selectionChanged();
      } catch (e) {
        console.warn('Haptic feedback not available');
      }
    },
  };
}

/**
 * BackButton helper
 */
export function useBackButton(onClick?: () => void) {
  try {
    if (onClick && backButton.onClick.isAvailable()) {
      backButton.onClick(onClick);
    }

    return {
      show: () => backButton.show(),
      hide: () => backButton.hide(),
      isVisible: backButton.isVisible(),
    };
  } catch (e) {
    return {
      show: () => {},
      hide: () => {},
      isVisible: false,
    };
  }
}

/**
 * MainButton helper
 */
export function useMainButton() {
  try {
    return {
      setText: (text: string) => mainButton.setText(text),
      onClick: (callback: () => void) => mainButton.onClick(callback),
      show: () => mainButton.show(),
      hide: () => mainButton.hide(),
      enable: () => mainButton.enable(),
      disable: () => mainButton.disable(),
      showProgress: () => mainButton.showLoader(),
      hideProgress: () => mainButton.hideLoader(),
      isVisible: mainButton.isVisible(),
      isEnabled: mainButton.isEnabled(),
    };
  } catch (e) {
    return {
      setText: () => {},
      onClick: () => {},
      show: () => {},
      hide: () => {},
      enable: () => {},
      disable: () => {},
      showProgress: () => {},
      hideProgress: () => {},
      isVisible: false,
      isEnabled: false,
    };
  }
}
