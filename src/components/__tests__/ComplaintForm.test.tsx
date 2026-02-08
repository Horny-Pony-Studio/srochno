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
  List: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  ListItem: ({
    title,
    media,
    label,
  }: {
    title?: string;
    media?: React.ReactNode;
    label?: boolean;
  }) => (
    <div>
      {media}
      {label ? <label>{title}</label> : <span>{title}</span>}
    </div>
  ),
  Radio: ({
    checked,
    onChange,
  }: {
    checked?: boolean;
    onChange?: () => void;
  }) => (
    <input type="radio" checked={checked} onChange={onChange} />
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

vi.mock('@/src/hooks/useTelegram', () => ({
  useHaptic: () => ({
    selection: vi.fn(),
    impact: vi.fn(),
    notification: vi.fn(),
  }),
}));

vi.mock('@/src/hooks/useReviews', () => ({
  useSubmitComplaint: () => ({
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
  COMPLAINT_REASONS: [
    'Не відповідав',
    'Відмінив замовлення',
    'Неадекватна поведінка',
    'Неправдива інформація',
    'Інше',
  ],
  executorComplaintSchema: {
    safeParse: (data: Record<string, unknown>) => {
      if (!data.complaint) {
        return { success: false, error: { issues: [{ message: 'Reason required' }] } };
      }
      return { success: true, data };
    },
  },
}));

vi.mock('@/types/api', () => ({
  // type-only import, just need it to exist
}));

import ComplaintForm from '../ComplaintForm';

describe('ComplaintForm', () => {
  beforeEach(() => {
    mockMutateAsync.mockClear();
    mockMutateAsync.mockResolvedValue({ success: true });
  });

  it('renders form with complaint reasons and submit button', () => {
    render(<ComplaintForm orderId="order-1" />);

    expect(screen.getByText('Пожаловаться на клиента')).toBeInTheDocument();
    expect(screen.getByText('Не відповідав')).toBeInTheDocument();
    expect(screen.getByText('Відмінив замовлення')).toBeInTheDocument();
    expect(screen.getByText('Отправить жалобу')).toBeInTheDocument();
  });

  it('disables submit when no reason selected', () => {
    render(<ComplaintForm orderId="order-1" />);

    const submitBtn = screen.getByText('Отправить жалобу').closest('button');
    expect(submitBtn).toBeDisabled();
  });

  it('enables submit after selecting a reason', () => {
    render(<ComplaintForm orderId="order-1" />);

    const radio = screen.getAllByRole('radio')[0];
    fireEvent.click(radio);

    const submitBtn = screen.getByText('Отправить жалобу').closest('button');
    expect(submitBtn).not.toBeDisabled();
  });

  it('calls mutateAsync with correct data on submit', async () => {
    render(<ComplaintForm orderId="order-1" />);

    const radio = screen.getAllByRole('radio')[0];
    fireEvent.click(radio);

    const submitBtn = screen.getByText('Отправить жалобу');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        order_id: 'order-1',
        complaint: 'Не відповідав',
        comment: null,
      });
    });
  });
});
