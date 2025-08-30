import { useId } from 'react'

export default function FeaturesSectionDemo() {
  return (
    <div className="py-20 lg:py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
        {grid.map((feature) => (
          <div
            key={feature.title}
            className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-none overflow-hidden"
          >
            <Grid size={20} />
            <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
              {feature.title}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const grid = [
  {
    title: 'Renewable Project Mapping',
    description:
      'Interactive maps of solar, wind, storage, and pipeline projects across the hydrogen ecosystem.',
  },
  {
    title: 'Real-Time Analytics',
    description:
      'Monitor energy generation, storage capacity, and pipeline flows with detailed charts and KPIs.',
  },
  {
    title: 'Project Performance Insights',
    description:
      'Evaluate project efficiency and ROI across multiple assets using advanced analytics tools.',
  },
  {
    title: 'Regulatory Compliance',
    description:
      'Ensure all projects adhere to national energy regulations, safety standards, and environmental norms.',
  },
  {
    title: 'Capacity Forecasting',
    description:
      'Predict energy production and storage needs with AI-driven forecasting models for optimal planning.',
  },
  {
    title: 'Asset Health Monitoring',
    description:
      'Track the performance and maintenance status of renewable assets to prevent downtime.',
  },
  {
    title: 'Collaboration Tools',
    description:
      'Manage teams, assign roles, and streamline communication for project execution and reporting.',
  },
  {
    title: 'Customizable Dashboards',
    description:
      'Tailor your dashboards to visualize the metrics and projects most relevant to your business goals.',
  },
]

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][]
  size?: number
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ]
  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-primary/20"
        />
      </div>
    </div>
  )
}

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId()

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  )
}
