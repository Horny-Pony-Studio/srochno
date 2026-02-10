'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  useLaunchParams,
  initData,
  backButton,
  mainButton,
  themeParams,
  closingBehavior,
  popup,
  openLink as sdkOpenLink,
  openTelegramLink as sdkOpenTelegramLink,
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
      themeParams: themeParams.state(),
      startParam: initData.startParam(),
    };
  } catch {
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
 * Native Telegram BackButton hook.
 * Shows the back button on mount, hides on unmount.
 * If no onClick is provided, navigates to `fallbackPath` or calls router.back().
 */
export function useTelegramBackButton(fallbackPath?: string) {
  const router = useRouter();

  useEffect(() => {
    try {
      if (backButton.show.isAvailable()) {
        backButton.show();
      }

      const handler = () => {
        if (fallbackPath) {
          router.replace(fallbackPath);
        } else {
          router.back();
        }
      };

      let unsub: VoidFunction | undefined;
      if (backButton.onClick.isAvailable()) {
        unsub = backButton.onClick(handler);
      }

      return () => {
        unsub?.();
        try {
          if (backButton.hide.isAvailable()) {
            backButton.hide();
          }
        } catch {
          // Cleanup
        }
      };
    } catch {
      // Not in Telegram environment
      return;
    }
  }, [router, fallbackPath]);
}

/**
 * Hides the Telegram BackButton (for home page).
 */
export function useHideBackButton() {
  useEffect(() => {
    try {
      if (backButton.hide.isAvailable()) {
        backButton.hide();
      }
    } catch {
      // Not in Telegram environment
    }
  }, []);
}

/**
 * Native Telegram MainButton hook.
 * Shows the MainButton on mount with given text, hides on unmount.
 */
export function useTelegramMainButton(
  text: string,
  onClick: () => void,
  options?: {
    isEnabled?: boolean;
    isLoading?: boolean;
  }
) {
  const isEnabled = options?.isEnabled ?? true;
  const isLoading = options?.isLoading ?? false;

  useEffect(() => {
    try {
      if (mainButton.setParams.isAvailable()) {
        mainButton.setParams({
          text,
          isVisible: true,
          isEnabled,
          isLoaderVisible: isLoading,
        });
      }

      let unsub: VoidFunction | undefined;
      if (mainButton.onClick.isAvailable()) {
        unsub = mainButton.onClick(onClick);
      }

      return () => {
        unsub?.();
        try {
          if (mainButton.setParams.isAvailable()) {
            mainButton.setParams({ isVisible: false });
          }
        } catch {
          // Cleanup
        }
      };
    } catch {
      // Not in Telegram environment
      return;
    }
  }, [text, onClick, isEnabled, isLoading]);
}

/**
 * Telegram popup confirm dialog.
 * Returns a promise that resolves to true (OK) or false (Cancel).
 */
export function useTelegramConfirm() {
  return useCallback(async (message: string): Promise<boolean> => {
    try {
      if (popup.show.isAvailable()) {
        const result = await popup.show({
          message,
          buttons: [
            { id: 'cancel', text: 'Отмена', type: 'destructive' },
            { id: 'ok', text: 'OK', type: 'default' },
          ],
        });
        return result === 'ok';
      }
    } catch {
      // Fallback
    }
    return window.confirm(message);
  }, []);
}

/**
 * Telegram closing confirmation for forms with unsaved data.
 * Enables/disables the "are you sure?" dialog when user tries to close the Mini App.
 */
export function useClosingConfirmation(enabled: boolean) {
  useEffect(() => {
    try {
      if (enabled) {
        if (closingBehavior.enableConfirmation.isAvailable()) {
          closingBehavior.enableConfirmation();
        }
      } else {
        if (closingBehavior.disableConfirmation.isAvailable()) {
          closingBehavior.disableConfirmation();
        }
      }

      return () => {
        try {
          if (closingBehavior.disableConfirmation.isAvailable()) {
            closingBehavior.disableConfirmation();
          }
        } catch {
          // Cleanup
        }
      };
    } catch {
      // Not in Telegram environment
      return;
    }
  }, [enabled]);
}

/**
 * Opens a Telegram link via native SDK (t.me links).
 * Falls back to window.open in dev mode.
 */
export function useTelegramLinks() {
  const openTelegramLink = useCallback((url: string) => {
    try {
      if (sdkOpenTelegramLink.isAvailable()) {
        sdkOpenTelegramLink(url);
        return;
      }
    } catch {
      // Fallback
    }
    window.open(url, '_blank');
  }, []);

  const openExternalLink = useCallback((url: string) => {
    try {
      if (sdkOpenLink.isAvailable()) {
        sdkOpenLink(url);
        return;
      }
    } catch {
      // Fallback
    }
    window.open(url, '_blank');
  }, []);

  return { openTelegramLink, openExternalLink };
}
