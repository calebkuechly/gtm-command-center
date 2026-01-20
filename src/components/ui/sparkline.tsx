'use client'

import { cn } from '@/lib/utils'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  className?: string
  color?: string
  showArea?: boolean
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  className,
  color = 'currentColor',
  showArea = false,
}: SparklineProps) {
  if (!data.length) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  const areaPoints = showArea
    ? `0,${height} ${points} ${width},${height}`
    : ''

  return (
    <svg
      width={width}
      height={height}
      className={cn('overflow-visible', className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      {showArea && (
        <polygon
          points={areaPoints}
          fill={color}
          fillOpacity={0.1}
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r={2}
        fill={color}
      />
    </svg>
  )
}
