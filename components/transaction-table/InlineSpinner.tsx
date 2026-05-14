import React from 'react';

const sizeClass = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-4' } as const;

export function InlineSpinner({ size = 'md' }: { size?: keyof typeof sizeClass }) {
  return (
    <div
      className={`${sizeClass[size]} animate-spin rounded-full border-blue-600 border-t-transparent`}
      aria-hidden
    />
  );
}
