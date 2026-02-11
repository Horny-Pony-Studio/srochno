'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sheet, List, ListItem, Block, Preloader } from 'konsta/react';
import { Search, ChevronDown, X, Check, MapPin } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSearching = search.trim().length > 0;

  const filtered = useMemo(() => {
    if (!isSearching) return options.filter((opt) => TOP_CITIES.has(opt));
    const q = search.trim().toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search, isSearching]);

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

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [search]);

  const displayValue = value || placeholder;
  const isPlaceholder = !value;

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`inline-flex items-center gap-1 bg-transparent text-sm transition-all duration-200 active:opacity-60 ${
          isPlaceholder ? 'opacity-55' : ''
        } ${disabled ? 'opacity-30' : ''} ${className}`}
      >
        {isLoading ? (
          <Preloader className="w-4 h-4" />
        ) : (
          <>
            <span className="truncate">{displayValue}</span>
            <ChevronDown className="w-4 h-4 shrink-0 opacity-40" />
          </>
        )}
      </button>

      {/* Bottom Sheet — portaled to body to avoid overflow clipping */}
      {mounted && createPortal(
        <Sheet
          opened={isOpen}
          onBackdropClick={handleClose}
          className="pb-safe"
        >
          <div className="flex flex-col" style={{ maxHeight: '70dvh' }}>
            {/* Handle bar */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-9 h-1 rounded-full bg-black/15 dark:bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-2">
              <h3 className="text-lg font-semibold">{label}</h3>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 active:opacity-60"
              >
                <X className="w-4 h-4 opacity-55" />
              </button>
            </div>

            {/* Search input */}
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск города..."
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-sm placeholder:opacity-40"
                />
                {isSearching && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-black/10 dark:bg-white/20 active:opacity-60"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Section label */}
            {!isSearching && (
              <div className="px-4 pb-1">
                <span className="text-xs uppercase tracking-wide opacity-40">
                  Популярные города
                </span>
              </div>
            )}

            {/* Scrollable list */}
            <div ref={listRef} className="overflow-y-auto hide-scrollbar flex-1 min-h-0">
              {isLoading ? (
                <Block className="flex items-center justify-center py-10">
                  <Preloader />
                </Block>
              ) : visible.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <MapPin className="w-8 h-8 opacity-20" />
                  <p className="text-sm opacity-40">Город не найден</p>
                </div>
              ) : (
                <List strongIos insetIos className="m-0">
                  {clearLabel && !isSearching && (
                    <ListItem
                      title={clearLabel}
                      onClick={() => handleSelect('')}
                      after={!value ? <Check className="w-5 h-5 text-primary" /> : undefined}
                    />
                  )}
                  {visible.map((opt) => (
                    <ListItem
                      key={opt}
                      title={opt}
                      onClick={() => handleSelect(opt)}
                      after={opt === value ? <Check className="w-5 h-5 text-primary" /> : undefined}
                    />
                  ))}
                  {hasMore && (
                    <ListItem
                      title={`Ещё ${filtered.length - MAX_VISIBLE} — уточните поиск`}
                      className="opacity-40 italic"
                    />
                  )}
                </List>
              )}
            </div>
          </div>
        </Sheet>,
        document.body,
      )}
    </>
  );
}

export default React.memo(SearchableSelect);
