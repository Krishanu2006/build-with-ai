import React from 'react';
import { Mic, Type } from 'lucide-react';
import { RequestChannel } from '../../types/domain';

export interface ModeToggleProps {
  mode: RequestChannel;
  onChange: (mode: RequestChannel) => void;
  disabled?: boolean;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onChange, disabled }) => {
  return (
    <div
      role="radiogroup"
      aria-label="Input Mode Selection"
      className="grid grid-cols-2 p-1 bg-brand-surface-alt border border-brand-border rounded-lg max-w-sm mx-auto shadow-inner"
    >
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'voice'}
        disabled={disabled}
        onClick={() => onChange('voice')}
        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus ${
          mode === 'voice'
            ? 'bg-white text-brand-primary font-semibold shadow-sm'
            : 'text-brand-text-muted hover:text-brand-text'
        }`}
      >
        <Mic className={`w-4 h-4 ${mode === 'voice' ? 'text-brand-primary' : 'text-brand-text-muted'}`} />
        <span>Speak Voice Request</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={mode === 'text'}
        disabled={disabled}
        onClick={() => onChange('text')}
        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus ${
          mode === 'text'
            ? 'bg-white text-brand-primary font-semibold shadow-sm'
            : 'text-brand-text-muted hover:text-brand-text'
        }`}
      >
        <Type className={`w-4 h-4 ${mode === 'text' ? 'text-brand-primary' : 'text-brand-text-muted'}`} />
        <span>Type Free Text</span>
      </button>
    </div>
  );
};
