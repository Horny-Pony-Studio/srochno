import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockMutateAsync = vi.fn();

// Mock Konsta UI — ESM resolution issues in jsdom
vi.mock('konsta/react', () => ({
  Block: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  Button: ({
    children,
    onClick,
    disabled,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
  ListInput: ({
    label,
    value,
    onChange,
    placeholder,
  }: {
    label?: React.ReactNode;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
  }) => (
    <div>
      {label}
      <textarea value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  ),
}));

vi.mock('@/src/hooks/useReviews', () => ({
  useSubmitReview: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

vi.mock('@/src/hooks/useSubmittedGuard', () => ({
  useSubmittedGuard: () => ({
    isSubmitted: false,
    markSubmitted: vi.fn(),
  }),
}));

vi.mock('@/lib/validation/review.schema', () => ({
  clientReviewSchema: {
    safeParse: (data: Record<string, unknown>) => {
      if (!data.rating || (data.rating as number) < 1) {
        return { success: false, error: { issues: [{ message: 'Rating required' }] } };
      }
      return { success: true, data };
    },
  },
}));

import ReviewForm from '../ReviewForm';

describe('ReviewForm', () => {
  beforeEach(() => {
    mockMutateAsync.mockClear();
    mockMutateAsync.mockResolvedValue({ success: true });
  });

  it('renders form with star rating and submit button', () => {
    render(<ReviewForm orderId="order-1" />);

    expect(screen.getByText('Оставить отзыв')).toBeInTheDocument();
    expect(screen.getByText('Оценка:')).toBeInTheDocument();
    expect(screen.getByText('Отправить отзыв')).toBeInTheDocument();
  });

  it('disables submit when no rating selected', () => {
    render(<ReviewForm orderId="order-1" />);

    const submitBtn = screen.getByText('Отправить отзыв').closest('button');
    expect(submitBtn).toBeDisabled();
  });

  it('enables submit after selecting rating', () => {
    render(<ReviewForm orderId="order-1" />);

    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[3]); // 4th star

    const submitBtn = screen.getByText('Отправить отзыв').closest('button');
    expect(submitBtn).not.toBeDisabled();
  });

  it('calls mutateAsync with correct data on submit', async () => {
    render(<ReviewForm orderId="order-1" />);

    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[4]); // 5 stars

    const submitBtn = screen.getByText('Отправить отзыв');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        order_id: 'order-1',
        rating: 5,
        comment: null,
      });
    });
  });
});
