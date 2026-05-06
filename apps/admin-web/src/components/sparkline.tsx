"use client";

import React, { useMemo } from "react";

interface SparklineProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ 
  data = [10, 25, 15, 40, 30, 55, 45, 70, 60], 
  color = "currentColor",
  width = 80,
  height = 30
}: SparklineProps) {
  const points = useMemo(() => {
    if (!data.length) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    return data.map((val, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");
  }, [data, width, height]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" aria-hidden="true">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="opacity-40"
      />
    </svg>
  );
}
