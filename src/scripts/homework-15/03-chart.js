import * as d3 from 'd3'

const margin = { top: 10, left: 10, right: 10, bottom: 10 }

const height = 480 - margin.top - margin.bottom

const width = 480 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const radius = 200

const radiusScale = d3
  .scaleLinear()
  .domain([10, 100])
  .range([40, radius])

const angleScale = d3
  .scalePoint()
  .domain([
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
    'Blah'
  ])
  .range([0, Math.PI * 2])

const line = d3
  .radialArea()
  .outerRadius(function(d) {
    return radiusScale(d.high_temp)
  })
  .innerRadius(function(d) {
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    return angleScale(d.month_name)
  })

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const container = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  d3.select('#temp-step').on('stepin', function() {
    console.log('step')
    container.selectAll('path').attr('fill', 'none')

    container
      .selectAll('.temp')
      .attr('fill', 'green')
      .attr('opacity', 0.75)

      .raise()

    container.selectAll('text')
    container
      .selectAll('.city-name')
      .text('NYC')
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')
  })

  d3.select('#temp1-step').on('stepin', function() {
    container.selectAll('path').attr('fill', 'none')
    container
      .selectAll('.temp1')
      .attr('fill', 'yellow')
      .attr('opacity', 0.75)

      .raise()

    container.selectAll('text')
    container
      .selectAll('.city-name')
      .text('Beijing')
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')
  })
  d3.select('#temp2-step').on('stepin', function() {
    container.selectAll('path').attr('fill', 'none')
    container
      .selectAll('.temp2')
      .attr('fill', 'blue')
      .attr('opacity', 0.75)
      .raise()
    container
      .selectAll('.city-name')
      .text('Stockholm')
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')
  })

  d3.select('#temp3-step').on('stepin', function() {
    container.selectAll('path').attr('fill', 'none')
    container
      .selectAll('.temp3')
      .attr('fill', 'red')
      .attr('opacity', 0.75)

      .raise()

    container
      .selectAll('.city-name')
      .text('Lima')
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')
  })

  d3.select('#temp4-step').on('stepin', function() {
    container.selectAll('path').attr('fill', 'none')
    container
      .selectAll('.temp4')
      .attr('fill', 'purple')
      .attr('opacity', 0.75)

      .raise()

    container
      .selectAll('.city-name')
      .text('Tuscon')
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')
  })
  datapoints.forEach(d => {
    d.high_temp = +d.high_temp
    d.low_temp = +d.low_temp
  })

  const circleBands = [20, 30, 40, 50, 60, 70, 80, 90]
  const textBands = [30, 50, 70, 90]

  container
    .selectAll('.bands')
    .data(circleBands)
    .enter()
    .append('circle')
    .attr('class', 'bands')
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d) {
      return radiusScale(d)
    })
    .lower()

  container
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'city-name')

  container
    .selectAll('.temp-notes')
    .data(textBands)
    .enter()
    .append('text')
    .attr('class', 'temp-notes')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -2)
    .text(d => d + '°')
    .attr('text-anchor', 'middle')
    .attr('font-size', 8)

  // Filter it so I'm only looking at NYC datapoints
  const nycDatapoints = datapoints.filter(d => d.city === 'NYC')
  nycDatapoints.push(nycDatapoints[0])

  container
    .append('path')
    .attr('class', 'temp')
    .datum(nycDatapoints)
    .attr('d', line)

  const BeiDatapoints = datapoints.filter(d => d.city === 'Beijing')
  BeiDatapoints.push(BeiDatapoints[0])

  container
    .append('path')
    .attr('class', 'temp1')
    .datum(BeiDatapoints)
    .attr('d', line)

  const StoDatapoints = datapoints.filter(d => d.city === 'Stockholm')
  StoDatapoints.push(StoDatapoints[0])

  container
    .append('path')
    .attr('class', 'temp2')
    .datum(StoDatapoints)
    .attr('d', line)

  const LimaDatapoints = datapoints.filter(d => d.city === 'Lima')
  LimaDatapoints.push(LimaDatapoints[0])

  container
    .append('path')
    .attr('class', 'temp3')
    .datum(LimaDatapoints)
    .attr('d', line)

  const TusDatapoints = datapoints.filter(d => d.city === 'Tuscon')
  TusDatapoints.push(TusDatapoints[0])

  container
    .append('path')
    .attr('class', 'temp4')
    .datum(TusDatapoints)
    .attr('d', line)

  function render() {
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    // Do you want it to be full height? Pick one of the two below
    const svgHeight = window.innerHeight

    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)

    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom

    // Update our scale
    radiusScale.range([0, newWidth])

    // Update things you draw

    // circles

    // Update axes
  }

  // When the window resizes, run the function
  // that redraws everything
  window.addEventListener('resize', render)

  // And now that the page has loaded, let's just try
  // to do it once before the page has resized
  render()
}
