export type BasemapKey = 'osm' | 'topo' | 'satellite';

export interface Basemap {
  key: BasemapKey;
  label: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

export const BASEMAPS: Record<BasemapKey, Basemap> = {
  osm: {
    key: 'osm',
    label: 'Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  topo: {
    key: 'topo',
    label: 'Topo',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; OpenStreetMap, SRTM | &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
  satellite: {
    key: 'satellite',
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, USGS, Maxar, etc.',
    maxZoom: 18,
  },
};
