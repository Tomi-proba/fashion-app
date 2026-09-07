export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place {
  label: string;
  position: LatLng;
}

export type Criterion = 'distance' | 'time' | 'cost';

export interface CriterionRoute {
  criterion: Criterion;
  positions: LatLng[];
  distanceKm: number;
  timeMin: number;
  costHuf: number;
}

export type RoutesResult = Partial<Record<Criterion, CriterionRoute>> | { error: string };
