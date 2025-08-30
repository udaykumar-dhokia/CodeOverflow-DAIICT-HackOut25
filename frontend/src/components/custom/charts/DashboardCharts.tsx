import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface Asset {
  _id: string
  project_name: string
  budget?: number
  capacity?: number
}

interface ChartProps {
  plants: Asset[]
  storage: Asset[]
  pipelines: Asset[]
  distributionHubs: Asset[]
}

const DashboardCharts: React.FC<ChartProps> = ({
  plants,
  storage,
  pipelines,
  distributionHubs,
}) => {
  const budgetChartRef = useRef<SVGSVGElement | null>(null)
  const projectsChartRef = useRef<SVGSVGElement | null>(null)
  const pieChartRef = useRef<SVGSVGElement | null>(null)
  const stackedChartRef = useRef<SVGSVGElement | null>(null)

  const assetTypes = [
    'Plants',
    'Storage',
    'Pipelines',
    'Distribution Hubs',
  ] as const
  const colors = ['#6BA292', '#82C0CC', '#A1D99B', '#4CAF50']

  const tooltipRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Create a single tooltip div
    let tooltip = d3.select(tooltipRef.current)
    if (tooltip.empty()) {
      // Tooltip div with correct type
      const tooltip = d3
        .select<HTMLDivElement, unknown>('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('opacity', '0')
        .style('background', 'rgba(0,0,0,0.7)')
        .style('color', '#fff')
        .style('padding', '5px 10px')
        .style('border-radius', '4px')
        .style('font-size', '12px')

      tooltipRef.current = tooltip.node() as HTMLElement
    }

    const budgets = [
      plants.reduce((a, p) => a + (p.budget || 0), 0),
      storage.reduce((a, s) => a + (s.budget || 0), 0),
      pipelines.reduce((a, pl) => a + (pl.budget || 0), 0),
      distributionHubs.reduce((a, d) => a + (d.budget || 0), 0),
    ]

    const capacities = [
      plants.reduce((a, p) => a + (p.capacity || 0), 0),
      storage.reduce((a, s) => a + (s.capacity || 0), 0),
      pipelines.reduce((a, pl) => a + (pl.capacity || 0), 0),
      distributionHubs.reduce((a, d) => a + (d.capacity || 0), 0),
    ]

    const projectCounts = [
      plants.length,
      storage.length,
      pipelines.length,
      distributionHubs.length,
    ]

    // ----------- Budget Bar Chart -----------
    if (budgetChartRef.current) {
      const svg = d3.select(budgetChartRef.current)
      svg.selectAll('*').remove()
      const width = 400
      const height = 250
      const margin = { top: 20, right: 20, bottom: 50, left: 50 }

      const x = d3
        .scaleBand()
        .domain(assetTypes)
        .range([margin.left, width - margin.right])
        .padding(0.3)
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(budgets)! * 1.1])
        .range([height - margin.bottom, margin.top])

      svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
      svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('$,.0f')))

      svg
        .selectAll('rect')
        .data(budgets)
        .enter()
        .append('rect')
        .attr('x', (_, i) => x(assetTypes[i])!)
        .attr('y', (d) => y(d))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - margin.bottom - y(d))
        .attr('fill', (_, i) => colors[i])
        .on('mouseover', function (event, d) {
          const i = budgets.indexOf(d)
          d3.select(this).attr('opacity', 0.7)
          tooltip
            .style('opacity', 1)
            .html(`${assetTypes[i]} Budget: $${d.toLocaleString()}`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`)
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 1)
          tooltip.style('opacity', 0)
        })
    }

    // ----------- Projects Count Bar Chart -----------
    if (projectsChartRef.current) {
      const svg = d3.select(projectsChartRef.current)
      svg.selectAll('*').remove()
      const width = 400
      const height = 250
      const margin = { top: 20, right: 20, bottom: 50, left: 50 }

      const x = d3
        .scaleBand()
        .domain(assetTypes)
        .range([margin.left, width - margin.right])
        .padding(0.3)
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(projectCounts)! * 1.1])
        .range([height - margin.bottom, margin.top])

      svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
      svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5))

      svg
        .selectAll('rect')
        .data(projectCounts)
        .enter()
        .append('rect')
        .attr('x', (_, i) => x(assetTypes[i])!)
        .attr('y', (d) => y(d))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - margin.bottom - y(d))
        .attr('fill', (_, i) => colors[i])
        .on('mouseover', function (event, d) {
          const i = projectCounts.indexOf(d)
          d3.select(this).attr('opacity', 0.7)
          tooltip
            .style('opacity', 1)
            .html(`${assetTypes[i]} Projects: ${d}`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`)
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 1)
          tooltip.style('opacity', 0)
        })
    }

    // ----------- Donut Chart -----------
    if (pieChartRef.current) {
      const svg = d3.select(pieChartRef.current)
      svg.selectAll('*').remove()
      const width = 400
      const height = 250
      const radius = Math.min(width, height) / 2 - 20

      const group = svg
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
      const pie = d3.pie<number>().value((d) => d)(budgets)
      const arc = d3
        .arc<d3.PieArcDatum<number>>()
        .innerRadius(radius * 0.5)
        .outerRadius(radius)

      group
        .selectAll('path')
        .data(pie)
        .enter()
        .append('path')
        .attr('d', arc as any)
        .attr('fill', (_, i) => colors[i])
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .on('mouseover', function (event, d) {
          d3.select(this).attr('opacity', 0.7)
          tooltip
            .style('opacity', 1)
            .html(`${assetTypes[d.index]}: $${d.data.toLocaleString()}`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`)
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 1)
          tooltip.style('opacity', 0)
        })
    }

    // ----------- Stacked Bar Chart (Budget + Capacity) -----------
    if (stackedChartRef.current) {
      const svg = d3.select(stackedChartRef.current)
      svg.selectAll('*').remove()
      const width = 400
      const height = 250
      const margin = { top: 20, right: 20, bottom: 50, left: 50 }

      const data = assetTypes.map((type, i) => ({
        type,
        budget: budgets[i],
        capacity: capacities[i],
      }))
      const keys: Array<'budget' | 'capacity'> = ['budget', 'capacity']

      const x = d3
        .scaleBand()
        .domain(assetTypes)
        .range([margin.left, width - margin.right])
        .padding(0.3)
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data.map((d) => d.budget + d.capacity))! * 1.1])
        .range([height - margin.bottom, margin.top])
      const colorScale = d3
        .scaleOrdinal<string>()
        .domain(keys)
        .range(['#6BA292', '#F6C177'])

      const stackedData = d3
        .stack<{
          type: string
          budget: number
          capacity: number
        }>()
        .keys(keys)(data as any)

      svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
      svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))

      svg
        .selectAll('g.layer')
        .data(stackedData)
        .enter()
        .append('g')
        .attr('fill', (d) => colorScale(d.key))
        .selectAll('rect')
        .data((d) => d)
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.data.type)!)
        .attr('y', (d) => y(d[1]))
        .attr('height', (d) => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth())
        .on('mouseover', function (event, d) {
          d3.select(this).attr('opacity', 0.7)
          const key = (
            d3.select(this.parentNode as SVGElement).datum() as { key: string }
          ).key
          tooltip
            .style('opacity', 1)
            .html(
              `${d.data.type} ${key}: ${d.data[key as 'budget' | 'capacity']}`,
            )
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`)
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 1)
          tooltip.style('opacity', 0)
        })
    }
  }, [plants, storage, pipelines, distributionHubs])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 text-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">Total Budget by Asset</h3>
        <svg ref={budgetChartRef} width={400} height={400}></svg>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Number of Projects</h3>
        <svg ref={projectsChartRef} width={400} height={400}></svg>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">
          Budget Share (Donut Chart)
        </h3>
        <svg ref={pieChartRef} width={400} height={400}></svg>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">
          Budget + Capacity (Stacked Bar)
        </h3>
        <svg ref={stackedChartRef} width={400} height={400}></svg>
      </div>
    </div>
  )
}

export default DashboardCharts
