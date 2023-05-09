

// title

d3.select('#main').append('h1').attr('id', 'title').text('United States Educational Attainment');

// description

d3.select('#main').append('div').attr('id', 'description').text(`Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)`);


// datas


const USAEduData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

const USACountyData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

const w = 960;
const h = 600;




// svg

const svg = d3.select('#main').append('svg').attr('width', w).attr('height', h);





// tooltip
const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style("opacity", 0);


// legend 



const x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

const color = d3
    .scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
    .range(d3.schemeGreens[9]);

const g = d3.select('svg')
    .append('g')
    .attr('class', 'key')
    .attr('id', 'legend')
    .attr('transform', 'translate(0,40)');


const lAxis = d3.axisBottom(x).tickSize(13).tickFormat(d => {
    return Math.round(d) + '%';
}).tickValues(color.domain());


g.selectAll('rect')
    .data(
        color.range().map(d => {
            d = color.invertExtent(d);
            if (d[0] === null) {
                d[0] = x.domain()[0];
            }
            if (d[1] === null) {
                d[1] = x.domain()[1];
            }
            return d;
        }))
    .enter()
    .append('rect')
    .attr('height', 8)
    .attr('x', d => x(d[0]))
    .attr('width', d => {
        return d[0] && d[1] ? x(d[1]) - x(d[0]) : x(null);
    })
    .attr('fill', d => color(d[0]))


g.append('text')
    .attr('class', 'caption')
    .attr('x', x.range()[0])
    .attr('y', -6)
    .attr('fill', '#000')
    .attr('text-anchor', 'start')
    .attr('font-weight', 'bold');


g.call(lAxis).select('.domain').remove();





// use data 

Promise.all([
    d3.json(USACountyData), d3.json(USAEduData)
]).then(data => ready(data[0], data[1]))
    .catch(error => console.log(error));


function ready(usa, education) {
    d3.select('svg')
        .append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(topojson.feature(usa, usa.objects.counties).features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('data-fips', d => d.id)
        .attr('data-education', d => {
            let result = education.filter(o => { return o.fips === d.id });
            if (result[0]) {
                return result[0].bachelorsOrHigher;
            }

            return 0;
        })
        .attr('fill', d => {
            let result = education.filter(o => { return o.fips === d.id });
            if (result[0]) {
                return color(result[0].bachelorsOrHigher);
            }
            return color(0);
        })
        .attr('d', d3.geoPath())
        .on('mouseover', (event, d) => {
            tooltip.style('opacity', 0.9);
            tooltip.html(() => {
                let result = education.filter(o => o.fips === d.id);
                if (result[0]) {
                    return (
                        result[0]['area_name'] + ', ' + result[0]['state'] + ': ' + result[0].bachelorsOrHigher + '%'
                    )
                }
                return 0;


            })
                .attr('data-education', () => {
                    let result = education.filter(o => o.fips === d.id);
                    if (result[0]) {
                        return result[0].bachelorsOrHigher;
                    }
                    return 0;
                })
                .style('left', event.pageX + 20 + 'px')
                .style('top', event.pageY + 20 + 'px');
        })
        .on('mouseout', () => { tooltip.style('opacity', 0) });


    d3.select('svg').append('path')
        .datum(topojson.mesh(usa, usa.objects.states, (x, y) => {
            return x !== y;
        }))
        .attr('class', 'states')
        .attr('d', d3.geoPath());




}


































