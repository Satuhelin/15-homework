import * as d3 from 'd3'

const margin = { top: 100, left: 50, right: 150, bottom: 200 }

const height = 700 - margin.top - margin.bottom

const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const parseTime = d3.timeParse('%B-%y')

const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd'
  ])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })

d3.csv(require('/data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  const dates = datapoints.map(d => d.datetime)
  const prices = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(dates))
  yPositionScale.domain(d3.extent(prices))

  d3.select('#temp-path').on('stepin', function() {
    console.log(nested, 'show me the data')
    svg
      .selectAll('path-lines')
      .data(nested)
      .enter()
      .append('path')
      .attr('class', 'path-lines')
      .attr('class', 'temp-path')
      .attr('d', function(d) {
        return line(d.values)
      })
      .attr('stroke', function(d) {
        return colorScale(d.key)
      })
      .attr('stroke-width', 2)
      .attr('fill', 'none')
  })
  d3.select('#temp-step').on('stepin', function() {
    svg.selectAll('path')
    svg.selectAll('.temp-path').attr('stroke', 'lightgrey')
    svg.selectAll('circle')
    svg.selectAll('.temp-circle').attr('fill', 'lightgrey')

    svg.selectAll('rect').attr('fill', 'none')
  })
  d3.select('#temp-step1').on('stepin', function() {
    svg.selectAll('path')
  })
  d3.select('#temp-step').on('stepin', function() {
    svg
      .selectAll('.temp-path')
      .attr('stroke', function(d) {
        if (d.key === 'U.S.') {
          return 'red'
        } else {
          return 'lightgrey'
        }
      })
      .raise()
    svg
      .selectAll('.temp-circle')
      .attr('fill', function(d) {
        if (d.key === 'U.S.') {
          return 'red'
        } else {
          return 'lightgrey'
        }
      })
      .attr('stroke', 'none')
    svg
      .selectAll('.temp-text')
      .attr('font-weight', 'bold')
      .attr('fill', function(d) {
        if (d.key === 'U.S.') {
          return 'red'
        } else {
          return 'lightgrey'
        }
      })
  })
  d3.select('#temp-step4').on('stepin', function() {
    svg
      .selectAll('rect')
      .attr('fill', '#C2DFFF')
      .lower()
    svg
      .selectAll('temp-rect')
      .attr('x', xPositionScale(parseTime('December-16')))
      .attr('y', 0)
      .attr('width', rectWidth)
      .attr('height', height)
      .attr('fill', 'none')

    svg.selectAll('temp-path').attr('stroke', 'lightgrey')
    svg.selectAll('.temp-path').attr('stroke', function(d) {
      return colorScale(d.key)
    })
    svg.selectAll('temp-circle').attr('fill', 'lightgrey')
    svg.selectAll('circle').attr('fill', function(d) {
      return colorScale(d.key)
    })
  })
  const nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(datapoints)

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'temp-circle')
    .attr('fill', function(d) {
      return colorScale(d.key)
    })
    .attr('r', 4)
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('cx', function(d) {
      return xPositionScale(d.values[0].datetime)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'temp-text')
    .attr('y', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('x', function(d) {
      return xPositionScale(d.values[0].datetime)
    })

    .text(function(d) {
      return d.key.toLowerCase().replace(/[a-z]/g, '')
    })
    .attr('dx', 6)
    .attr('dy', 4)
    .attr('fill', 'grey')
    .attr('font-size', '12')

  svg
    .append('text')
    .attr('class', 'temp-text1')
    .attr('font-size', '24')
    .attr('text-anchor', 'middle')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('dx', 40)

  const rectWidth =
    xPositionScale(parseTime('February-17')) -
    xPositionScale(parseTime('November-16'))

  svg
    .append('rect')
    .attr('class', 'temp-rect')
    .attr('fill', 'none')

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(9)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  function render() {
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    // Do you want it to be full height? Pick one of the two below
    const svgHeight = height + margin.top + margin.bottom
    // const svgHeight = window.innerHeight

    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)

    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom

    // Update our scale
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])

    // Update things you draw

    // circles

    svg
      .selectAll('.temp-circle')
      .attr('cy', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[0].datetime)
      })
    // labels

    svg
      .selectAll('.temp-text')
      .attr('y', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('x', function(d) {
        return xPositionScale(d.values[0].datetime)
      })
      .text(function(d) {
        return d.key
      })
    // title

    svg

      .selectAll('.temp-text1')
      .attr('text-anchor', 'middle')
      .text('U.S. housing prices fall in winter')
      .attr('x', newWidth / 2)

    // rect
    svg
      .select('.temp-rect')
      .attr('x', xPositionScale(parseTime('December-16')))
      .attr('y', 0)
      .attr('width', rectWidth)
      .attr('height', newHeight)

    // line
    const line = d3
      .line()
      .x(function(d) {
        return xPositionScale(d.datetime)
      })
      .y(function(d) {
        return yPositionScale(d.price)
      })
    svg.selectAll('.path-lines').attr('d', function(d) {
      return line(d.values)
    })

    // Update axes

    svg
      .select('.y-axis')
      .transition()
      .call(yAxis)

    if (svgWidth < 400) {
      xAxis.ticks(2)
    } else if (svgWidth < 550) {
      xAxis.ticks(4)
    } else {
      xAxis.ticks(null)
    }

    svg
      .select('.x-axis')
      .transition()
      .attr('transform', 'translate(0,' + newHeight + ')')
      .call(xAxis)
  }

  // When the window resizes, run the function
  // that redraws everything
  window.addEventListener('resize', render)

  // And now that the page has loaded, let's just try
  // to do it once before the page has resized
  render()
}
