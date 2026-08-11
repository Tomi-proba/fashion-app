interface SparklineChartProps {
  values: number[];
  width?: number;
  height?: number;
  referenceValue?: number;
  positiveColor?: string;
  negativeColor?: string;
}

export default function SparklineChart({
  values,
  width = 240,
  height = 64,
  referenceValue,
  positiveColor = '#22c55e',
  negativeColor = '#f87171',
}: SparklineChartProps) {
  if (values.length < 2) {
    return <div style={{ width, height }} className="flex items-center justify-center text-xs text-slate-400">nincs elég adat</div>;
  }
  const min = Math.min(...values, referenceValue ?? values[0]);
  const max = Math.max(...values, referenceValue ?? values[0]);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = values[values.length - 1];
  const first = referenceValue ?? values[0];
  const color = last >= first ? positiveColor : negativeColor;
  const refY = referenceValue !== undefined ? height - ((referenceValue - min) / range) * height : null;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {refY !== null && (
        <line x1={0} y1={refY} x2={width} y2={refY} stroke="currentColor" strokeDasharray="3 3" className="text-slate-300 dark:text-slate-600" strokeWidth={1} />
      )}
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
