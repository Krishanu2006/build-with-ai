import React from 'react';

export const MapLegend: React.FC = () => {
  const steps = [
    { label: '1 - 2', color: '#E3ECF4', textColor: '#16202B' },
    { label: '3 - 5', color: '#B9CFE3', textColor: '#16202B' },
    { label: '6 - 8', color: '#89AECD', textColor: '#16202B' },
    { label: '9 - 12', color: '#5789B3', textColor: '#FFFFFF' },
    { label: '13+', color: '#2D6193', textColor: '#FFFFFF' },
  ];

  return (
    <div
      aria-label="Map Intensity Legend"
      className="bg-white/95 backdrop-blur-sm border border-brand-border p-3 rounded-lg shadow-level-1 space-y-2 text-xs max-w-[240px]"
    >
      <div className="space-y-0.5">
        <div className="font-semibold text-brand-text">Demand Intensity Scale</div>
        <div className="text-[11px] text-brand-text-muted leading-tight">
          Metric: Citizen development requests per area
        </div>
      </div>

      {/* 5-step color ramp */}
      <div className="flex items-center gap-1 pt-1">
        {steps.map(step => (
          <div key={step.label} className="flex-1 flex flex-col items-center">
            <div
              className="w-full h-4 rounded-sm border border-black/10"
              style={{ backgroundColor: step.color }}
            />
            <span className="text-[10px] text-brand-text-muted mt-1 font-mono tabular-nums">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-1.5 border-t border-brand-border/60 text-[10px] text-brand-text-muted flex items-center justify-between">
        <span>Low Concentration</span>
        <span>High Hotspot</span>
      </div>
    </div>
  );
};
