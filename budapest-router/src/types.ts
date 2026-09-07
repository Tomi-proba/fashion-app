export type EdgeMode = 'walk' | 'transit' | 'car';

export interface GraphNode {
  id: string;
  name: string;
  side: 'buda' | 'pest';
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  mode: EdgeMode;
  distanceKm: number;
}

export type Criterion = 'distance' | 'time' | 'cost';

export interface RouteStep {
  edge: GraphEdge;
  timeMin: number;
  costHuf: number;
}

export interface Route {
  criterion: Criterion;
  nodeIds: string[];
  steps: RouteStep[];
  totalDistanceKm: number;
  totalTimeMin: number;
  totalCostHuf: number;
}
