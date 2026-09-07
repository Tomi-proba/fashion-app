export type TransportMode = 'car' | 'metro' | 'bus' | 'tram';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place {
  label: string;
  position: LatLng;
}

export type Criterion = 'distance' | 'time' | 'cost';

export interface ModeRoute {
  mode: TransportMode;
  positions: LatLng[];
  distanceKm: number;
  timeMin: number;
  costHuf: number;
}

export interface ModeRouteError {
  mode: TransportMode;
  error: string;
}

export type ModeRouteResult = ModeRoute | ModeRouteError;
