import { EDGES, NODES } from '../data/graph';
import { edgeCostHuf, edgeTimeMin } from './modeParams';
import type { Criterion, GraphEdge, Route, RouteStep } from '../types';

interface AdjacencyEntry {
  to: string;
  edge: GraphEdge;
}

// Roads/bridges/tram lines all run both ways, so every edge is usable in
// either direction.
function buildAdjacency(): Map<string, AdjacencyEntry[]> {
  const adjacency = new Map<string, AdjacencyEntry[]>();
  for (const node of NODES) adjacency.set(node.id, []);
  for (const edge of EDGES) {
    adjacency.get(edge.from)?.push({ to: edge.to, edge });
    adjacency.get(edge.to)?.push({ to: edge.from, edge });
  }
  return adjacency;
}

const ADJACENCY = buildAdjacency();

function edgeWeight(edge: GraphEdge, criterion: Criterion): number {
  if (criterion === 'distance') return edge.distanceKm;
  if (criterion === 'time') return edgeTimeMin(edge);
  return edgeCostHuf(edge);
}

// Plain Dijkstra over a ~27-node graph — small enough that a simple O(n^2)
// scan for the next closest node is plenty fast, no priority queue needed.
export function findRoute(startId: string, endId: string, criterion: Criterion): Route | null {
  const dist = new Map<string, number>();
  const prevEdge = new Map<string, AdjacencyEntry>();
  const visited = new Set<string>();

  for (const node of NODES) dist.set(node.id, Infinity);
  dist.set(startId, 0);

  while (visited.size < NODES.length) {
    let current: string | null = null;
    let currentDist = Infinity;
    for (const node of NODES) {
      if (visited.has(node.id)) continue;
      const d = dist.get(node.id) ?? Infinity;
      if (d < currentDist) {
        currentDist = d;
        current = node.id;
      }
    }
    if (current === null || currentDist === Infinity) break;
    if (current === endId) break;
    visited.add(current);

    for (const { to, edge } of ADJACENCY.get(current) ?? []) {
      if (visited.has(to)) continue;
      const candidate = currentDist + edgeWeight(edge, criterion);
      if (candidate < (dist.get(to) ?? Infinity)) {
        dist.set(to, candidate);
        prevEdge.set(to, { to: current, edge });
      }
    }
  }

  if ((dist.get(endId) ?? Infinity) === Infinity) return null;

  // Walk the predecessor chain back to the start.
  const nodeIds: string[] = [endId];
  const steps: RouteStep[] = [];
  let cursor = endId;
  while (cursor !== startId) {
    const step = prevEdge.get(cursor);
    if (!step) return null;
    steps.unshift({ edge: step.edge, timeMin: edgeTimeMin(step.edge), costHuf: edgeCostHuf(step.edge) });
    cursor = step.to;
    nodeIds.unshift(cursor);
  }

  const totalDistanceKm = steps.reduce((sum, s) => sum + s.edge.distanceKm, 0);
  const totalTimeMin = steps.reduce((sum, s) => sum + s.timeMin, 0);
  const totalCostHuf = steps.reduce((sum, s) => sum + s.costHuf, 0);

  return { criterion, nodeIds, steps, totalDistanceKm, totalTimeMin, totalCostHuf };
}

export function findAllRoutes(startId: string, endId: string): Record<Criterion, Route | null> {
  return {
    distance: findRoute(startId, endId, 'distance'),
    time: findRoute(startId, endId, 'time'),
    cost: findRoute(startId, endId, 'cost'),
  };
}
