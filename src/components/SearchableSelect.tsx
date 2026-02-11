'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Popup, Searchbar, List, ListItem, Navbar, NavbarBackLink, Block, Preloader } from 'konsta/react';

const MAX_VISIBLE = 50;

const TOP_CITIES = new Set([
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
]);

export interface SearchableSelectProps {
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  clearLabel?: string;
}

function SearchableSelect({
  value,
  onSelect,
  options,
  placeholder = 'Выберите...',
  label = 'Выбрать',
  disabled = false,
  isLoading = false,
  className = '',
  clearLabel,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isSearchEmpty = !search.trim();

  const filtered = useMemo(() => {
    if (isSearchEmpty) return options.filter((opt) => TOP_CITIES.has(opt));
    const q = search.trim().toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search, isSearchEmpty]);

  const visible = useMemo(() => filtered.slice(0, MAX_VISIBLE), [filtered]);
  const hasMore = filtered.length > MAX_VISIBLE;

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setSearch('');
    setIsOpen(true);
  }, [disabled]);

  const handleSelect = useCallback(
    (val: string) => {
      onSelect(val);
      setIsOpen(false);
    },
    [onSelect],
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setSearch('');
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const displayValue = value || placeholder;
  const isPlaceholder = !value;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`bg-transparent text-sm text-right transition-all duration-200 ${
          isPlaceholder ? 'text-gray-400' : ''
        } ${disabled ? 'opacity-50' : ''} ${className}`}
      >
        {isLoading ? <Preloader className="w-4 h-4" /> : displayValue}
      </button>

      <Popup opened={isOpen} onBackdropClick={handleClose}>
        <Navbar
          title={label}
          left={<NavbarBackLink text="Назад" onClick={handleClose} />}
        />

        <Searchbar
          placeholder="Поиск..."
          value={search}
          onInput={handleSearchInput}
          onClear={handleClear}
          clearButton
          ref={(node: HTMLElement | null) => {
            if (node) {
              inputRef.current = node.querySelector('input');
            }
          }}
        />

        {isLoading ? (
          <Block className="flex items-center justify-center py-10">
            <Preloader />
          </Block>
        ) : visible.length === 0 ? (
          <Block className="text-center text-gray-500 py-10">
            Ничего не найдено
          </Block>
        ) : (
          <List strongIos outlineIos>
            {clearLabel && !search.trim() && (
              <ListItem
                title={clearLabel}
                onClick={() => handleSelect('')}
                after={!value ? '✓' : undefined}
                className="font-medium"
              />
            )}
            {visible.map((opt) => (
              <ListItem
                key={opt}
                title={opt}
                onClick={() => handleSelect(opt)}
                after={opt === value ? '✓' : undefined}
              />
            ))}
            {hasMore && (
              <ListItem
                title={`Ещё ${filtered.length - MAX_VISIBLE}... Уточните поиск`}
                className="text-gray-400 italic"
              />
            )}
          </List>
        )}
      </Popup>
    </>
  );
}

export default React.memo(SearchableSelect);
