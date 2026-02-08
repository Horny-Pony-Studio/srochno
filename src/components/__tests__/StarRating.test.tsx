import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from '../StarRating';

// Mock Telegram haptic hook
vi.mock('@/src/hooks/useTelegram', () => ({
  useHaptic: () => ({
    selection: vi.fn(),
    impact: vi.fn(),
    notification: vi.fn(),
  }),
}));

describe('StarRating', () => {
  it('renders 5 star buttons', () => {
    render(<StarRating value={0} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('calls onChange with star number on click', () => {
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]); // 3rd star
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('does not call onChange when readonly', () => {
    const onChange = vi.fn();
    render(<StarRating value={3} onChange={onChange} readonly />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables buttons when readonly', () => {
    render(<StarRating value={3} readonly />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('does not disable buttons when interactive', () => {
    render(<StarRating value={3} onChange={vi.fn()} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).not.toBeDisabled();
    });
  });

  it('calls onChange with 1 when clicking first star', () => {
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('calls onChange with 5 when clicking last star', () => {
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);

    fireEvent.click(screen.getAllByRole('button')[4]);
    expect(onChange).toHaveBeenCalledWith(5);
  });
});
