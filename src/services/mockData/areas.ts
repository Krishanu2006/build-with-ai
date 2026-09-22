import { GeographicArea } from '../../types/domain';

// Helper to generate a realistic closed GeoJSON polygon around a centroid
function makePolygon(centerLat: number, centerLng: number, radiusLat: number, radiusLng: number): GeoJSON.Polygon {
  const steps = 7;
  const coordinates: [number, number][] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i * 2 * Math.PI) / steps;
    // Add small pseudo-random variance for realistic administrative boundary shapes
    const rVar = 0.8 + 0.35 * Math.sin(i * 2.3 + centerLat);
    const lng = centerLng + radiusLng * rVar * Math.cos(angle);
    const lat = centerLat + radiusLat * rVar * Math.sin(angle);
    coordinates.push([Number(lng.toFixed(5)), Number(lat.toFixed(5))]);
  }
  // Close the polygon
  coordinates.push(coordinates[0]);
  return {
    type: 'Polygon',
    coordinates: [coordinates]
  };
}

export const GEOGRAPHIC_AREAS: GeographicArea[] = [
  {
    areaId: 'area-mahadevapura',
    name: 'Mahadevapura',
    adminLevel: 'BBMP Zone',
    centroid: [12.9860, 77.6970],
    population: 524000,
    geometry: makePolygon(12.9860, 77.6970, 0.038, 0.042)
  },
  {
    areaId: 'area-bommanahalli',
    name: 'Bommanahalli',
    adminLevel: 'BBMP Zone',
    centroid: [12.9080, 77.6240],
    population: 489000,
    geometry: makePolygon(12.9080, 77.6240, 0.032, 0.036)
  },
  {
    areaId: 'area-yelahanka',
    name: 'Yelahanka',
    adminLevel: 'BBMP Zone / Taluk',
    centroid: [13.1007, 77.5963],
    population: 345000,
    geometry: makePolygon(13.1007, 77.5963, 0.045, 0.048)
  },
  {
    areaId: 'area-anekal',
    name: 'Anekal',
    adminLevel: 'Taluk',
    centroid: [12.7107, 77.6963],
    population: 298000,
    geometry: makePolygon(12.7107, 77.6963, 0.048, 0.052)
  },
  {
    areaId: 'area-whitefield',
    name: 'Whitefield',
    adminLevel: 'Ward Cluster',
    centroid: [12.9698, 77.7499],
    population: 310000,
    geometry: makePolygon(12.9698, 77.7499, 0.035, 0.038)
  },
  {
    areaId: 'area-bellandur',
    name: 'Bellandur',
    adminLevel: 'Ward Cluster',
    centroid: [12.9290, 77.6740],
    population: 285000,
    geometry: makePolygon(12.9290, 77.6740, 0.028, 0.032)
  },
  {
    areaId: 'area-electronic-city',
    name: 'Electronic City',
    adminLevel: 'Industrial / Mixed Ward',
    centroid: [12.8452, 77.6602],
    population: 240000,
    geometry: makePolygon(12.8452, 77.6602, 0.034, 0.036)
  },
  {
    areaId: 'area-rr-nagar',
    name: 'Rajarajeshwari Nagar',
    adminLevel: 'BBMP Zone',
    centroid: [12.9260, 77.5180],
    population: 462000,
    geometry: makePolygon(12.9260, 77.5180, 0.036, 0.040)
  },
  {
    areaId: 'area-dasarahalli',
    name: 'Dasarahalli',
    adminLevel: 'BBMP Zone',
    centroid: [13.0430, 77.5140],
    population: 356000,
    geometry: makePolygon(13.0430, 77.5140, 0.035, 0.038)
  },
  {
    areaId: 'area-kengeri',
    name: 'Kengeri',
    adminLevel: 'Ward Cluster',
    centroid: [12.9177, 77.4838],
    population: 215000,
    geometry: makePolygon(12.9177, 77.4838, 0.034, 0.037)
  },
  {
    areaId: 'area-peenya',
    name: 'Peenya Industrial Area',
    adminLevel: 'Ward Cluster',
    centroid: [13.0285, 77.5195],
    population: 275000,
    geometry: makePolygon(13.0285, 77.5195, 0.030, 0.033)
  },
  {
    areaId: 'area-hebbal',
    name: 'Hebbal',
    adminLevel: 'Ward Cluster',
    centroid: [13.0358, 77.5970],
    population: 295000,
    geometry: makePolygon(13.0358, 77.5970, 0.031, 0.034)
  },
  {
    areaId: 'area-koramangala',
    name: 'Koramangala',
    adminLevel: 'Ward Cluster',
    centroid: [12.9352, 77.6245],
    population: 220000,
    geometry: makePolygon(12.9352, 77.6245, 0.024, 0.027)
  },
  {
    areaId: 'area-hsr-layout',
    name: 'HSR Layout',
    adminLevel: 'Ward Cluster',
    centroid: [12.9121, 77.6446],
    population: 198000,
    geometry: makePolygon(12.9121, 77.6446, 0.023, 0.026)
  },
  {
    areaId: 'area-marathahalli',
    name: 'Marathahalli',
    adminLevel: 'Ward Cluster',
    centroid: [12.9591, 77.6974],
    population: 260000,
    geometry: makePolygon(12.9591, 77.6974, 0.025, 0.028)
  },
  {
    areaId: 'area-kr-puram',
    name: 'KR Puram (K.R. Pura)',
    adminLevel: 'Taluk / Ward Cluster',
    centroid: [13.0075, 77.6959],
    population: 380000,
    geometry: makePolygon(13.0075, 77.6959, 0.036, 0.039)
  },
  {
    areaId: 'area-jayanagar',
    name: 'Jayanagar',
    adminLevel: 'Ward Cluster',
    centroid: [12.9308, 77.5838],
    population: 235000,
    geometry: makePolygon(12.9308, 77.5838, 0.026, 0.029)
  },
  {
    areaId: 'area-btm-layout',
    name: 'BTM Layout',
    adminLevel: 'Ward Cluster',
    centroid: [12.9166, 77.6101],
    population: 210000,
    geometry: makePolygon(12.9166, 77.6101, 0.022, 0.025)
  },
  {
    areaId: 'area-banashankari',
    name: 'Banashankari',
    adminLevel: 'Ward Cluster',
    centroid: [12.9150, 77.5736],
    population: 320000,
    geometry: makePolygon(12.9150, 77.5736, 0.030, 0.033)
  },
  {
    areaId: 'area-vijayanagar',
    name: 'Vijayanagar',
    adminLevel: 'Ward Cluster',
    centroid: [12.9710, 77.5400],
    population: 270000,
    geometry: makePolygon(12.9710, 77.5400, 0.026, 0.029)
  },
  {
    areaId: 'area-rajajinagar',
    name: 'Rajajinagar',
    adminLevel: 'Ward Cluster',
    centroid: [12.9901, 77.5525],
    population: 245000,
    geometry: makePolygon(12.9901, 77.5525, 0.025, 0.028)
  },
  {
    areaId: 'area-malleshwaram',
    name: 'Malleshwaram',
    adminLevel: 'Ward Cluster',
    centroid: [13.0031, 77.5700],
    population: 195000,
    geometry: makePolygon(13.0031, 77.5700, 0.024, 0.027)
  },
  {
    areaId: 'area-yeshwanthpur',
    name: 'Yeshwanthpur',
    adminLevel: 'Ward Cluster',
    centroid: [13.0238, 77.5529],
    population: 285000,
    geometry: makePolygon(13.0238, 77.5529, 0.027, 0.030)
  },
  {
    areaId: 'area-shivajinagar',
    name: 'Shivajinagar',
    adminLevel: 'Ward Cluster',
    centroid: [12.9857, 77.6057],
    population: 230000,
    geometry: makePolygon(12.9857, 77.6057, 0.023, 0.026)
  },
  {
    areaId: 'area-indiranagar',
    name: 'Indiranagar',
    adminLevel: 'Ward Cluster',
    centroid: [12.9784, 77.6408],
    population: 185000,
    geometry: makePolygon(12.9784, 77.6408, 0.022, 0.025)
  },
  {
    areaId: 'area-sarjapur',
    name: 'Sarjapur Road Corridor',
    adminLevel: 'Peri-Urban Corridor',
    centroid: [12.9050, 77.6850],
    population: 230000,
    geometry: makePolygon(12.9050, 77.6850, 0.035, 0.038)
  },
  {
    areaId: 'area-bangalore-north',
    name: 'Bangalore North Taluk',
    adminLevel: 'Taluk',
    centroid: [13.0800, 77.5400],
    population: 410000,
    geometry: makePolygon(13.0800, 77.5400, 0.045, 0.050)
  },
  {
    areaId: 'area-bangalore-south',
    name: 'Bangalore South Taluk',
    adminLevel: 'Taluk',
    centroid: [12.8700, 77.5300],
    population: 395000,
    geometry: makePolygon(12.8700, 77.5300, 0.042, 0.046)
  }
];
