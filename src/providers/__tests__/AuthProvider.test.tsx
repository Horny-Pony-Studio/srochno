import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';

const mockGetMe = vi.fn();
const mockSetAuthToken = vi.fn();
const mockInitDataRaw = vi.fn();

vi.mock('@telegram-apps/sdk-react', () => ({
  initData: {
    raw: () => mockInitDataRaw(),
  },
}));

vi.mock('@/lib/api', () => ({
  getMe: () => mockGetMe(),
  setAuthToken: (token: string | null) => mockSetAuthToken(token),
}));

import { AuthProvider, useAuth } from '../AuthProvider';

function TestConsumer() {
  const { user, isLoading, isAuthenticated, error } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="error">{error ?? 'none'}</span>
      <span data-testid="user">{user ? user.first_name : 'null'}</span>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets user on successful auth', async () => {
    mockInitDataRaw.mockReturnValue('init-data-raw-string');
    mockGetMe.mockResolvedValue({
      id: 1,
      first_name: 'TestUser',
      telegram_id: 12345,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('TestUser');
    expect(screen.getByTestId('error')).toHaveTextContent('none');
    expect(mockSetAuthToken).toHaveBeenCalledWith('init-data-raw-string');
  });

  it('sets error when initData is empty', async () => {
    mockInitDataRaw.mockReturnValue(undefined);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Telegram initData not available',
    );
  });

  it('sets error when initData.raw() throws', async () => {
    mockInitDataRaw.mockImplementation(() => {
      throw new Error('SDK not ready');
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Telegram initData not available',
    );
  });

  it('sets error when getMe() fails', async () => {
    mockInitDataRaw.mockReturnValue('valid-init-data');
    mockGetMe.mockRejectedValue(new Error('Network error'));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('Network error');
  });

  it('refetchUser re-fetches the profile', async () => {
    mockInitDataRaw.mockReturnValue('init-data');
    mockGetMe
      .mockResolvedValueOnce({ id: 1, first_name: 'Before', telegram_id: 1 })
      .mockResolvedValueOnce({ id: 1, first_name: 'After', telegram_id: 1 });

    function RefetchConsumer() {
      const { user, refetchUser, isLoading } = useAuth();
      return (
        <div>
          <span data-testid="name">{user?.first_name ?? 'null'}</span>
          <span data-testid="loading">{String(isLoading)}</span>
          <button onClick={() => refetchUser()}>refetch</button>
        </div>
      );
    }

    render(
      <AuthProvider>
        <RefetchConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('name')).toHaveTextContent('Before');
    });

    await act(async () => {
      screen.getByText('refetch').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('name')).toHaveTextContent('After');
    });
  });
});
