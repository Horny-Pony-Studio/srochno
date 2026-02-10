import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Track subscribers for mainButton.onClick
let onClickHandler: (() => void) | null = null;
const mockUnsub = vi.fn();
const mockSetParams = vi.fn();

vi.mock('@telegram-apps/sdk-react', () => ({
  useLaunchParams: vi.fn(),
  initData: { user: vi.fn(), raw: vi.fn(), startParam: vi.fn() },
  backButton: {
    show: { isAvailable: () => false },
    hide: { isAvailable: () => false },
    onClick: { isAvailable: () => false },
  },
  mainButton: {
    setParams: Object.assign(
      (params: Record<string, unknown>) => mockSetParams(params),
      { isAvailable: () => true }
    ),
    onClick: Object.assign(
      (handler: () => void) => {
        onClickHandler = handler;
        return mockUnsub;
      },
      { isAvailable: () => true }
    ),
  },
  themeParams: { state: vi.fn() },
  closingBehavior: {
    enableConfirmation: { isAvailable: () => false },
    disableConfirmation: { isAvailable: () => false },
  },
  popup: { show: { isAvailable: () => false } },
  openLink: { isAvailable: () => false },
  openTelegramLink: { isAvailable: () => false },
}));

// Must import AFTER mocks
import { useTelegramMainButton } from '../useTelegram';

describe('useTelegramMainButton', () => {
  beforeEach(() => {
    onClickHandler = null;
    mockUnsub.mockClear();
    mockSetParams.mockClear();
  });

  it('calls setParams with text, isVisible, isEnabled, isLoaderVisible', () => {
    renderHook(() => useTelegramMainButton('Submit', vi.fn()));

    expect(mockSetParams).toHaveBeenCalledWith({
      text: 'Submit',
      isVisible: true,
      isEnabled: true,
      isLoaderVisible: false,
    });
  });

  it('passes isEnabled and isLoading options to setParams', () => {
    renderHook(() =>
      useTelegramMainButton('Save', vi.fn(), { isEnabled: false, isLoading: true })
    );

    expect(mockSetParams).toHaveBeenCalledWith({
      text: 'Save',
      isVisible: true,
      isEnabled: false,
      isLoaderVisible: true,
    });
  });

  it('invokes the latest onClick callback via ref', () => {
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    const { rerender } = renderHook(
      ({ onClick }) => useTelegramMainButton('OK', onClick),
      { initialProps: { onClick: firstHandler } }
    );

    // Re-render with a new handler
    rerender({ onClick: secondHandler });

    // Simulate MainButton press
    act(() => {
      onClickHandler?.();
    });

    expect(firstHandler).not.toHaveBeenCalled();
    expect(secondHandler).toHaveBeenCalledOnce();
  });

  it('does not re-subscribe mainButton.onClick when only onClick changes', () => {
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    const { rerender } = renderHook(
      ({ onClick }) => useTelegramMainButton('OK', onClick),
      { initialProps: { onClick: firstHandler } }
    );

    // Initial subscription
    expect(mockUnsub).not.toHaveBeenCalled();

    // Re-render with new onClick — should NOT cause re-subscription
    rerender({ onClick: secondHandler });

    // unsub was NOT called (effect didn't re-run)
    expect(mockUnsub).not.toHaveBeenCalled();
    // setParams was called only once (initial mount)
    expect(mockSetParams).toHaveBeenCalledTimes(1);
  });

  it('re-subscribes when text changes', () => {
    const handler = vi.fn();

    const { rerender } = renderHook(
      ({ text }) => useTelegramMainButton(text, handler),
      { initialProps: { text: 'Create' } }
    );

    expect(mockSetParams).toHaveBeenCalledTimes(1);

    rerender({ text: 'Save' });

    // Effect re-ran: unsub called for cleanup, then new setParams
    expect(mockUnsub).toHaveBeenCalledTimes(1);
    expect(mockSetParams).toHaveBeenCalledTimes(3); // 1 initial + 1 cleanup(isVisible:false) + 1 new
    expect(mockSetParams).toHaveBeenLastCalledWith({
      text: 'Save',
      isVisible: true,
      isEnabled: true,
      isLoaderVisible: false,
    });
  });

  it('hides button on unmount', () => {
    const { unmount } = renderHook(() => useTelegramMainButton('OK', vi.fn()));

    mockSetParams.mockClear();
    unmount();

    expect(mockUnsub).toHaveBeenCalled();
    expect(mockSetParams).toHaveBeenCalledWith({ isVisible: false });
  });
});
