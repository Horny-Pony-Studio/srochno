import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock Konsta UI — ESM resolution issues in jsdom
vi.mock('konsta/react', () => ({
  Block: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

import InfoBlock from '../InfoBlock';

describe('InfoBlock', () => {
  it('renders message prop', () => {
    render(<InfoBlock message="Тестовое сообщение" />);
    expect(screen.getByText('Тестовое сообщение')).toBeInTheDocument();
  });

  it('renders children over message', () => {
    render(<InfoBlock message="Скрытое">Видимое</InfoBlock>);
    expect(screen.getByText('Видимое')).toBeInTheDocument();
    expect(screen.queryByText('Скрытое')).not.toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(<InfoBlock icon="🔥" message="С иконкой" />);
    expect(screen.getByText('🔥')).toBeInTheDocument();
  });

  it('applies green variant class', () => {
    const { container } = render(<InfoBlock variant="green" message="Успех" />);
    expect(container.innerHTML).toContain('k-color-green');
  });

  it('applies red variant class', () => {
    const { container } = render(<InfoBlock variant="red" message="Ошибка" />);
    expect(container.innerHTML).toContain('k-color-red');
  });

  it('applies yellow variant class', () => {
    const { container } = render(<InfoBlock variant="yellow" message="Предупреждение" />);
    expect(container.innerHTML).toContain('k-color-yellow');
  });

  it('applies blue variant class', () => {
    const { container } = render(<InfoBlock variant="blue" message="Инфо" />);
    expect(container.innerHTML).toContain('k-color-primary');
  });

  it('defaults to red variant', () => {
    const { container } = render(<InfoBlock message="По умолчанию" />);
    expect(container.innerHTML).toContain('k-color-red');
  });

  it('applies custom className', () => {
    const { container } = render(<InfoBlock className="mt-4" message="Стиль" />);
    expect(container.innerHTML).toContain('mt-4');
  });

  it('renders fallback text when no children/message', () => {
    render(<InfoBlock />);
    expect(screen.getByText('Плашка')).toBeInTheDocument();
  });
});
