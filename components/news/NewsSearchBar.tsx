'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface NewsSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearchSubmit: (val: string) => void;
  placeholder?: string;
}

export function NewsSearchBar({
  value,
  onChange,
  onSearchSubmit,
  placeholder = 'Search railway news...',
}: NewsSearchBarProps) {
  const [internalVal, setInternalVal] = useState(value);

  useEffect(() => {
    setInternalVal(value);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(internalVal);
    } else if (e.key === 'Escape') {
      setInternalVal('');
      onChange('');
      onSearchSubmit('');
    }
  };

  const handleClear = () => {
    setInternalVal('');
    onChange('');
    onSearchSubmit('');
  };

  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={internalVal}
        onChange={(e) => {
          setInternalVal(e.target.value);
          onChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-background pl-10 pr-10 py-2.5 text-xs font-semibold outline-none focus:border-rail-blue/50 focus:ring-2 focus:ring-rail-blue/20 transition-all text-slate-900 dark:text-white placeholder-slate-400"
      />
      {internalVal && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
