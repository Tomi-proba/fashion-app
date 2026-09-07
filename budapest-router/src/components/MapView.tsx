import { EDGES, NODES, getNode } from '../data/graph';
import type { Criterion, Route } from '../types';

const MODE_STROKE: Record<string, string> = {
  walk: '#94a3b8',
  transit: '#818cf8',
  car: '#f59e0b',
};

const ROUTE_STROKE: Record<Criterion, string> = {
  distance: '#2563eb',
  time: '#059669',
  cost: '#d97706',
};

interface MapViewProps {
  startId: string | null;
  endId: string | null;
  routes: Partial<Record<Criterion, Route | null>>;
  visibleCriteria: Set<Criterion>;
  onSelectNode: (id: string) => void;
}

export default function MapView({ startId, endId, routes, visibleCriteria, onSelectNode }: MapViewProps) {
  return (
    <svg viewBox="0 0 760 600" className="h-auto w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Sematikus Duna — nem GPS-pontos, csak tájékozódási segédlet */}
      <path
        d="M 415 0 C 400 130, 430 240, 410 350 C 395 430, 470 500, 480 600 L 525 600 C 500 500, 440 430, 450 350 C 460 240, 440 130, 460 0 Z"
        fill="#bfdbfe"
        className="dark:fill-slate-800"
        opacity={0.6}
      />

      {/* Alaphálózat */}
      {EDGES.map((edge, i) => {
        const from = getNode(edge.from)!;
        const to = getNode(edge.to)!;
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={MODE_STROKE[edge.mode]}
            strokeWidth={edge.mode === 'walk' ? 1.5 : 2.5}
            strokeDasharray={edge.mode === 'walk' ? '3 3' : undefined}
            opacity={0.55}
          />
        );
      })}

      {/* Kiszámolt útvonalak — típusonként külön szín, kicsit áttetsző, hogy az átfedések is látszódjanak */}
      {(['distance', 'time', 'cost'] as Criterion[]).map((criterion) => {
        const route = routes[criterion];
        if (!route || !visibleCriteria.has(criterion)) return null;
        const points = route.nodeIds.map((id) => {
          const n = getNode(id)!;
          return `${n.x},${n.y}`;
        });
        return (
          <polyline
            key={criterion}
            points={points.join(' ')}
            fill="none"
            stroke={ROUTE_STROKE[criterion]}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
        );
      })}

      {/* Csomópontok */}
      {NODES.map((node) => {
        const isStart = node.id === startId;
        const isEnd = node.id === endId;
        return (
          <g key={node.id} className="cursor-pointer" onClick={() => onSelectNode(node.id)}>
            <circle
              cx={node.x}
              cy={node.y}
              r={isStart || isEnd ? 8 : 5}
              fill={isStart ? '#16a34a' : isEnd ? '#dc2626' : '#475569'}
              stroke="white"
              strokeWidth={1.5}
            />
            <text
              x={node.x}
              y={node.y - 10}
              textAnchor="middle"
              fontSize={10}
              className="pointer-events-none fill-slate-700 dark:fill-slate-300"
            >
              {node.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
