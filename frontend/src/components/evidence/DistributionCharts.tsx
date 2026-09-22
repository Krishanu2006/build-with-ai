import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Cell 
} from 'recharts';
import { CategoryShare, SeverityDistribution } from '../../types/domain';

export interface DistributionChartsProps {
  categories: CategoryShare[];
  severity: SeverityDistribution;
}

export const DistributionCharts: React.FC<DistributionChartsProps> = ({
  categories,
  severity,
}) => {
  // Severity chart data
  const severityData = [
    { name: 'High', count: severity.high, color: '#2D6193', fillWeight: 'High (Immediate Action)' },
    { name: 'Medium', count: severity.medium, color: '#5789B3', fillWeight: 'Medium (Disruption)' },
    { name: 'Low', count: severity.low, color: '#B9CFE3', fillWeight: 'Low (Routine)' },
  ];

  // Category chart data
  const categoryData = categories.map(c => ({
    name: c.category,
    count: c.count,
    share: Math.round(c.share * 100),
  }));

  return (
    <div className="space-y-5">
      {/* Category breakdown Recharts BarChart */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider">
          Issue Category Breakdown
        </h4>
        <div className="h-44 w-full bg-brand-surface-alt/40 border border-brand-border rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontSize: 11, fill: '#16202B' }}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip
                formatter={(val: number) => [`${val} reports`, 'Count']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D7DDE4',
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#1F4E79" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Severity distribution Recharts BarChart */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider">
          Severity Breakdown (Observable Signals)
        </h4>
        <div className="h-32 w-full bg-brand-surface-alt/40 border border-brand-border rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={severityData}
              layout="vertical"
              margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={70}
                tick={{ fontSize: 11, fill: '#16202B' }}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip
                formatter={(val: number) => [`${val} reports`, 'Volume']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D7DDE4',
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {severityData.map(entry => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
