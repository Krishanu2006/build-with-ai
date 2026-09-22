import React from 'react';
import { Field } from '../primitives/Field';

export interface TextRequestInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
}

export const TextRequestInput: React.FC<TextRequestInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  return (
    <Field
      id="citizen-request-text"
      label="Describe the civic or development problem"
      required
      helperText="Type in your own language (English, ಕನ್ನಡ, हिन्दी). You do not need to fit your request into rigid categories or technical terms."
      error={error}
    >
      <textarea
        id="citizen-request-text"
        rows={6}
        disabled={disabled}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="For example: ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್ಲೈನ್ ಒಡೆದುಹೋಗಿದ್ದು ಮೂರು ದಿನಗಳಿಂದ ನೀರು ಬರುತ್ತಿಲ್ಲ... / हमारे मोहल्ले में मुख्य सड़क पर गड्ढों की वजह से पानी भर गया है... / Low water pressure and broken streetlights near the railway underpass..."
        className={`w-full p-3.5 text-base sm:text-sm bg-white border rounded-lg text-brand-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus focus-visible:border-brand-primary disabled:bg-brand-surface-alt disabled:cursor-not-allowed resize-y ${
          error ? 'border-brand-error' : 'border-brand-border hover:border-gray-400'
        }`}
      />
    </Field>
  );
};
