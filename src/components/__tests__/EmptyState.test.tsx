import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Search } from 'lucide-react';

// Mock Konsta UI — ESM resolution issues in jsdom
vi.mock('konsta/react', () => ({
  Block: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Нет заказов" />);
    expect(screen.getByText('Нет заказов')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Пусто" description="Создайте первый заказ" />);
    expect(screen.getByText('Создайте первый заказ')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Пусто" />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  it('renders action button when label and handler provided', () => {
    const onAction = vi.fn();
    render(<EmptyState title="Пусто" actionLabel="Создать" onAction={onAction} />);
    expect(screen.getByText('Создать')).toBeInTheDocument();
  });

  it('calls onAction when button clicked', () => {
    const onAction = vi.fn();
    render(<EmptyState title="Пусто" actionLabel="Создать" onAction={onAction} />);

    fireEvent.click(screen.getByText('Создать'));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('does not render button without actionLabel', () => {
    render(<EmptyState title="Пусто" onAction={vi.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render button without onAction', () => {
    render(<EmptyState title="Пусто" actionLabel="Создать" />);
    expect(screen.queryByText('Создать')).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = render(<EmptyState title="Поиск" icon={Search} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not render icon section when not provided', () => {
    const { container } = render(<EmptyState title="Пусто" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });
});
