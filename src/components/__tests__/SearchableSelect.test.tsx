import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock Konsta UI
vi.mock('konsta/react', () => ({
  Sheet: ({ children, opened, onBackdropClick }: {
    children: React.ReactNode;
    opened: boolean;
    onBackdropClick?: () => void;
    className?: string;
  }) => opened ? (
    <div data-testid="sheet" onClick={(e) => {
      if (e.target === e.currentTarget) onBackdropClick?.();
    }}>
      {children}
    </div>
  ) : null,
  List: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  ListItem: ({ title, onClick, after }: {
    title: string;
    onClick?: () => void;
    after?: React.ReactNode;
    className?: string;
  }) => (
    <li onClick={onClick} data-testid={`option-${title}`}>
      <span>{title}</span>
      {after}
    </li>
  ),
  Block: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  Preloader: ({ className }: { className?: string }) => (
    <div data-testid="preloader" className={className} />
  ),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Search: () => <svg data-testid="icon-search" />,
  ChevronDown: () => <svg data-testid="icon-chevron" />,
  X: () => <svg data-testid="icon-x" />,
  Check: () => <svg data-testid="icon-check" />,
  MapPin: () => <svg data-testid="icon-map-pin" />,
}));

// Mock createPortal to render inline (no document.body in tests)
vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof import('react-dom')>('react-dom');
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

import SearchableSelect from '../SearchableSelect';

const CITIES = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Самара',
  'Омск',
  'Ростов-на-Дону',
  'Абакан',
  'Воронеж',
];

describe('SearchableSelect', () => {
  const defaultProps = {
    value: '',
    onSelect: vi.fn(),
    options: CITIES,
    placeholder: 'Выберите город',
    label: 'Город',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger button with placeholder', () => {
    render(<SearchableSelect {...defaultProps} />);
    expect(screen.getByText('Выберите город')).toBeInTheDocument();
  });

  it('renders trigger button with selected value', () => {
    render(<SearchableSelect {...defaultProps} value="Москва" />);
    expect(screen.getByText('Москва')).toBeInTheDocument();
  });

  it('opens sheet on trigger click', () => {
    render(<SearchableSelect {...defaultProps} />);

    fireEvent.click(screen.getByText('Выберите город'));

    expect(screen.getByTestId('sheet')).toBeInTheDocument();
    expect(screen.getByText('Город')).toBeInTheDocument();
  });

  it('does not open when disabled', () => {
    render(<SearchableSelect {...defaultProps} disabled />);

    fireEvent.click(screen.getByText('Выберите город'));

    expect(screen.queryByTestId('sheet')).not.toBeInTheDocument();
  });

  it('shows popular cities when search is empty', () => {
    render(<SearchableSelect {...defaultProps} />);

    fireEvent.click(screen.getByText('Выберите город'));

    // Top cities should appear
    expect(screen.getByTestId('option-Москва')).toBeInTheDocument();
    expect(screen.getByTestId('option-Санкт-Петербург')).toBeInTheDocument();
    expect(screen.getByTestId('option-Казань')).toBeInTheDocument();

    // Non-top city should NOT appear when not searching
    expect(screen.queryByTestId('option-Абакан')).not.toBeInTheDocument();
    expect(screen.queryByTestId('option-Воронеж')).not.toBeInTheDocument();
  });

  it('filters cities by search query', () => {
    render(<SearchableSelect {...defaultProps} />);

    fireEvent.click(screen.getByText('Выберите город'));

    const input = screen.getByPlaceholderText('Поиск города...');
    fireEvent.change(input, { target: { value: 'Ворон' } });

    expect(screen.getByTestId('option-Воронеж')).toBeInTheDocument();
    expect(screen.queryByTestId('option-Москва')).not.toBeInTheDocument();
  });

  it('shows empty state when no cities match search', () => {
    render(<SearchableSelect {...defaultProps} />);

    fireEvent.click(screen.getByText('Выберите город'));

    const input = screen.getByPlaceholderText('Поиск города...');
    fireEvent.change(input, { target: { value: 'xyz' } });

    expect(screen.getByText('Город не найден')).toBeInTheDocument();
  });

  it('calls onSelect and closes sheet when city clicked', () => {
    const onSelect = vi.fn();
    render(<SearchableSelect {...defaultProps} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Выберите город'));
    fireEvent.click(screen.getByTestId('option-Москва'));

    expect(onSelect).toHaveBeenCalledWith('Москва');
    expect(screen.queryByTestId('sheet')).not.toBeInTheDocument();
  });

  it('renders clearLabel option and calls onSelect with empty string', () => {
    const onSelect = vi.fn();
    render(
      <SearchableSelect {...defaultProps} onSelect={onSelect} value="Москва" clearLabel="Все города" />,
    );

    fireEvent.click(screen.getByText('Москва'));
    fireEvent.click(screen.getByTestId('option-Все города'));

    expect(onSelect).toHaveBeenCalledWith('');
  });

  it('shows check mark for selected value', () => {
    render(<SearchableSelect {...defaultProps} value="Казань" />);

    fireEvent.click(screen.getByText('Казань'));

    const kazanOption = screen.getByTestId('option-Казань');
    expect(kazanOption.querySelector('[data-testid="icon-check"]')).toBeInTheDocument();
  });

  it('shows preloader when isLoading', () => {
    render(<SearchableSelect {...defaultProps} isLoading />);

    expect(screen.getByTestId('preloader')).toBeInTheDocument();
  });

  it('shows "Популярные города" label when not searching', () => {
    render(<SearchableSelect {...defaultProps} />);

    fireEvent.click(screen.getByText('Выберите город'));

    expect(screen.getByText('Популярные города')).toBeInTheDocument();
  });

  it('hides "Популярные города" label when searching', () => {
    render(<SearchableSelect {...defaultProps} />);

    fireEvent.click(screen.getByText('Выберите город'));

    const input = screen.getByPlaceholderText('Поиск города...');
    fireEvent.change(input, { target: { value: 'Мос' } });

    expect(screen.queryByText('Популярные города')).not.toBeInTheDocument();
  });

  it('clears search input via X button', () => {
    render(<SearchableSelect {...defaultProps} />);

    fireEvent.click(screen.getByText('Выберите город'));

    const input = screen.getByPlaceholderText('Поиск города...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');

    // Find the clear button (the one inside the search area, not the sheet close)
    const clearButtons = screen.getAllByRole('button');
    const clearSearchBtn = clearButtons.find(
      (btn) => btn.querySelector('[data-testid="icon-x"]') && btn.closest('.relative'),
    );
    if (clearSearchBtn) {
      fireEvent.click(clearSearchBtn);
      expect(input.value).toBe('');
    }
  });
});
