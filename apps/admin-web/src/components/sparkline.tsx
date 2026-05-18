'use client';

import React, { useMemo } from 'react';

interface SparklineProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({
  data = [10, 25, 15, 40, 30, 55, 45, 70, 60],
  color = 'currentColor',
  width = 80,
  height = 30,
}: SparklineProps) {
  const { points, areaPoints } = useMemo(() => {
    if (!data.length) return { points: '', areaPoints: '' };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const mapped = data.map((val, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2;
      const y = height - ((val - min) / range) * height;
      return { x, y };
    });

    const pointsStr = mapped.map((p) => `${p.x},${p.y}`).join(' ');
    const areaPointsStr = `${width},${height} 0,${height} ${pointsStr}`;

    return { points: pointsStr, areaPoints: areaPointsStr };
  }, [data, width, height]);

  const gradientId = useMemo(() => `sparkline-grad-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#${gradientId})`} points={areaPoints} className="pointer-events-none" />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="opacity-60"
      />
    </svg>
  );
}
