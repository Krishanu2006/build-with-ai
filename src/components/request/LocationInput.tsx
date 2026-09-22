import React from 'react';
import { MapPin } from 'lucide-react';
import { Field } from '../primitives/Field';
import { Select } from '../primitives/Select';
import { GeographicArea } from '../../types/domain';

export interface LocationInputProps {
  locationText: string;
  onLocationTextChange: (text: string) => void;
  areaId?: string;
  onAreaIdChange: (areaId: string) => void;
  areas: GeographicArea[];
  disabled?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  locationText,
  onLocationTextChange,
  areaId,
  onAreaIdChange,
  areas,
  disabled = false,
}) => {
  const areaOptions = [
    { value: '', label: 'Select your administrative area / taluk (optional)' },
    ...areas.map(a => ({
      value: a.areaId,
      label: `${a.name} (${a.adminLevel})`,
    })),
  ];

  return (
    <div className="space-y-3 p-4 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
      <div className="flex items-center gap-2 text-xs font-semibold text-brand-primary">
        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Location Information (Helps Hotspot Mapping)</span>
      </div>

      <Field
        id="location-area-select"
        label="Administrative Zone / Ward"
        optionalLabel="Optional"
        helperText="Selecting your zone directly guarantees immediate geographic aggregation."
      >
        <Select
          id="location-area-select"
          options={areaOptions}
          value={areaId || ''}
          onChange={e => onAreaIdChange(e.target.value)}
          disabled={disabled}
        />
      </Field>

      <Field
        id="location-specific-text"
        label="Specific Landmark or Street"
        optionalLabel="Optional"
        helperText="E.g., Near Hoodi Circle, 1st Cross, Opposite Government Hospital"
      >
        <input
          id="location-specific-text"
          type="text"
          value={locationText}
          onChange={e => onLocationTextChange(e.target.value)}
          placeholder="Landmark, road name, or building"
          disabled={disabled}
          className="w-full px-3 py-2 text-sm bg-white border border-brand-border rounded text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus"
        />
      </Field>

      {!locationText && !areaId && (
        <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200/60 leading-relaxed">
          <strong>Note:</strong> If no location is provided, our AI will attempt to extract place names from your description. If no location can be found, the request is recorded but cannot appear on geographic hotspot maps.
        </p>
      )}
    </div>
  );
};
