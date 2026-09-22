import { ReferenceTaxonomy } from '../../types/domain';

export const TAXONOMY: ReferenceTaxonomy = {
  languages: [
    { code: 'en', label: 'English', nativeLabel: 'English', description: 'English' },
    { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', description: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', description: 'हिन्दी' },
  ],
  categories: [
    { code: 'water', label: 'Water Supply', description: 'Drinking water, borewells, tanker shortages, pipeline leakages' },
    { code: 'roads', label: 'Roads & Transport', description: 'Potholes, unpaved roads, traffic signals, bus connectivity' },
    { code: 'sanitation', label: 'Sanitation & Waste', description: 'Garbage accumulation, stormwater drains, sewage overflow' },
    { code: 'health', label: 'Healthcare', description: 'Primary health centres, medicines, emergency service access' },
    { code: 'electricity', label: 'Electricity & Power', description: 'Frequent outages, damaged transformers, streetlights' },
    { code: 'education', label: 'Public Education', description: 'Government school infrastructure, sanitation in schools' },
  ],
  severities: [
    { code: 'high', label: 'High', description: 'Urgent risk to health, safety, or critical infrastructure' },
    { code: 'medium', label: 'Medium', description: 'Substantial recurring disruption to daily civic life' },
    { code: 'low', label: 'Low', description: 'Maintenance or non-hazardous civic request' },
  ]
};
