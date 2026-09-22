import React from 'react';
import { Field } from '../primitives/Field';
import { Select } from '../primitives/Select';
import { TaxonomyItem } from '../../types/domain';

export interface LanguageSelectorProps {
  languages: TaxonomyItem[];
  selectedCode?: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedCode,
  onChange,
  disabled = false,
}) => {
  const options = [
    { value: '', label: 'Auto-detect language (Recommended)' },
    ...languages.map(l => ({
      value: l.code,
      label: `${l.label} (${l.nativeLabel || l.label})`,
    })),
  ];

  return (
    <Field
      id="request-language-select"
      label="Language (Optional)"
      optionalLabel="Auto-detected by default"
      helperText="Our engine automatically identifies English, Kannada, or Hindi. You can also explicitly specify it here."
    >
      <Select
        id="request-language-select"
        options={options}
        value={selectedCode || ''}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
    </Field>
  );
};
