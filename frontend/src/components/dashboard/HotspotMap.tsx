import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { Hotspot, GeographicArea } from '../../types/domain';
import { MapLegend } from './MapLegend';
import { useEffect, useMemo } from 'react';

export interface HotspotMapProps {
  hotspots: Hotspot[];
  areas: GeographicArea[];
  selectedHotspotId?: string;
  onSelectHotspot: (hotspotId: string) => void;
}

// Color ramp calculator based on requestCount
function getFillColor(count: number): string {
  if (count >= 13) return '#2D6193';
  if (count >= 9) return '#5789B3';
  if (count >= 6) return '#89AECD';
  if (count >= 3) return '#B9CFE3';
  if (count >= 1) return '#E3ECF4';
  return '#F1F5F9';
}

// Controller component to pan/zoom when selected hotspot changes
function MapFocusController({ selectedCentroid }: { selectedCentroid?: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCentroid) {
      map.setView(selectedCentroid, 13, { animate: true });
    }
  }, [selectedCentroid, map]);

  return null;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({
  hotspots,
  areas,
  selectedHotspotId,
  onSelectHotspot,
}) => {
  // Center of Bengaluru: [12.9716, 77.5946]
  const defaultCenter: [number, number] = [12.9716, 77.5946];
  const defaultZoom = 11;

  // Map areaId -> Hotspot lookup
  const hotspotByAreaId = useMemo(() => {
    const map = new Map<string, Hotspot>();
    hotspots.forEach(h => map.set(h.areaId, h));
    return map;
  }, [hotspots]);

  // Selected hotspot centroid
  const selectedHotspot = hotspots.find(h => h.id === selectedHotspotId);

  // GeoJSON style builder
  const getFeatureStyle = (feature: any) => {
    const areaId = feature?.properties?.areaId;
    const hotspot = hotspotByAreaId.get(areaId);
    const count = hotspot ? hotspot.requestCount : 0;
    const isSelected = hotspot && hotspot.id === selectedHotspotId;

    return {
      fillColor: getFillColor(count),
      weight: isSelected ? 3 : 1.5,
      opacity: 1,
      color: isSelected ? '#1F4E79' : '#94A3B8',
      fillOpacity: isSelected ? 0.85 : count > 0 ? 0.65 : 0.25,
      cursor: 'pointer',
    };
  };

  // Build GeoJSON FeatureCollection
  const geoJsonData = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: areas
        .filter(a => Boolean(a.geometry))
        .map(a => ({
          type: 'Feature' as const,
          id: a.areaId,
          properties: {
            areaId: a.areaId,
            name: a.name,
            adminLevel: a.adminLevel,
          },
          geometry: a.geometry!,
        })),
    };
  }, [areas]);

  return (
    <div
      role="region"
      aria-label="Geographic Demand Hotspot Map. An accessible list equivalent is available in the adjacent Hotspot List."
      className="relative w-full h-full min-h-[420px] bg-slate-100"
    >
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        <MapFocusController selectedCentroid={selectedHotspot?.centroid} />

        {/* Polygons with GeoJSON */}
        <GeoJSON
          key={`geojson-${hotspots.length}-${selectedHotspotId}`}
          data={geoJsonData}
          style={getFeatureStyle}
          onEachFeature={(feature, layer) => {
            const areaId = feature.properties?.areaId;
            const areaName = feature.properties?.name;
            const hotspot = hotspotByAreaId.get(areaId);
            const count = hotspot ? hotspot.requestCount : 0;
            const category = hotspot ? hotspot.dominantCategory : 'No active reports';

            layer.bindTooltip(
              `<strong>${areaName}</strong><br/>${count} reports • ${category}`,
              { className: 'civic-tooltip', sticky: true }
            );

            layer.on({
              click: () => {
                if (hotspot) {
                  onSelectHotspot(hotspot.id);
                }
              },
            });
          }}
        />

        {/* Centroid Circle Markers for areas that might have small geometry or fallback */}
        {areas.map(area => {
          const hotspot = hotspotByAreaId.get(area.areaId);
          const count = hotspot ? hotspot.requestCount : 0;
          const isSelected = hotspot && hotspot.id === selectedHotspotId;

          return (
            <CircleMarker
              key={area.areaId}
              center={area.centroid}
              radius={isSelected ? 8 : Math.max(4, Math.min(12, 3 + count * 0.7))}
              pathOptions={{
                fillColor: getFillColor(count),
                color: isSelected ? '#1F4E79' : '#0F172A',
                weight: isSelected ? 3 : 1,
                fillOpacity: 0.9,
              }}
              eventHandlers={{
                click: () => {
                  if (hotspot) onSelectHotspot(hotspot.id);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -5]} className="civic-tooltip">
                <span>
                  <strong>{area.name}</strong> ({area.adminLevel})<br />
                  {count} citizen reports
                  {hotspot ? ` • ${hotspot.dominantCategory}` : ''}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Floating Legend */}
      <div className="absolute bottom-4 left-4 z-[400] pointer-events-auto">
        <MapLegend />
      </div>
    </div>
  );
};
