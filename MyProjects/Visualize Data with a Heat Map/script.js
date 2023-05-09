
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

Promise.all([d3.json(url)])
    .then(data => ready(data[0].monthlyVariance, data[0].baseTemperature))
    .catch(err => console.log(err));



const w = 1600;
const h = 540;
const m = 100;

// heading

d3.select('#heading').append('h1').attr('id', 'title').text('Monthly Global Land-Surface Temperature');

d3.select('#heading').append('h3').attr('id', 'description').text('1753 - 2015: base temperature 8.66℃');


// svg 

const svg = d3.select('section').append('svg').attr('width', w).attr('height', h);


function ready(dataset, basetem) {


    // x-axis

    const xScale = d3.scaleLinear().domain([d3.min(dataset, d => d.year), d3.max(dataset, d => d.year)]).range([m, w - m]);


    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));


    // y-axis
    const yScale = d3.scaleTime().domain([
        d3.min(dataset, d => {
            let newd = new Date();
            newd.setMonth(d.month - 2);
            return newd.getTime();
        }),
        d3.max(dataset, d => {
            let newd = new Date();
            newd.setMonth(d.month - 1);

            return newd.getTime();
        })
    ]).range([m, h - m]);




    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));




    // append axises

    svg.append('g').attr('id', 'x-axis').attr('transform', `translate(${0},${h - m})`).call(xAxis);


    svg.append('g').attr('id', 'y-axis').attr('transform', `translate(${m},${0})`).call(yAxis);


    // rectangles


    svg.append('g').attr('transform', `translate(${m},${0})`).attr('class', 'map');



    svg.select('.map').selectAll('rect').data(dataset).enter().append('rect').attr('class', 'cell')
        .attr('x', (d, i) => 1400 / 263 * (d.year - 1753) - 2)
        .attr('y', d => m + (340.66 / 12) * (d.month - 1)).attr('width', 1400 / 263)
        .attr('height', 340.66 / 12)
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance + basetem)
        .attr('fill', d => {
            let veri = d.variance + basetem;
            if (2 < veri && veri < 3) {
                return 'rgb(69, 117, 180)'
            } else if (3 < veri && veri <= 4) {
                return 'rgb(116, 173, 209)'
            } else if (4 < veri && veri <= 5) {
                return 'rgb(171, 217, 233)'
            } else if (5 < veri && veri <= 6) {
                return 'rgb(224, 243, 248)'
            } else if (6 < veri && veri <= 7) {
                return 'rgb(255, 255, 191)'
            } else if (7 < veri && veri <= 8) {
                return 'rgb(254, 224, 144)'
            } else if (8 < veri && veri <= 9) {
                return 'rgb(253, 174, 97)'
            } else if (9 < veri && veri <= 10) {
                return 'rgb(244, 109, 67)'
            } else if (10 < veri && veri <= 11) {
                return 'rgb(215, 48, 39)'
            } else if (11 < veri && veri <= 12) {
                return 'rgb(165, 0, 38)'
            } else if (veri < 2) {
                return 'rgb(0, 117, 180)'
            } else if (veri > 12) {
                return 'rgb(100, 0, 38)'
            }
        });


    // legend 

    const legend = svg.append('g').attr('id', 'legend');


    // legend axis

    const lScale = d3.scaleLinear().domain([0, 13]).range([m, h]);

    const lAxis = d3.axisBottom(lScale);


    legend.append('g').attr('transform', `translate(0,${h - 20})`).call(lAxis);


    // legend rectangeles

    const rectLegs = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    legend.selectAll('rect').data(rectLegs).enter().append('rect')
        .attr('x', (d, i) => m - 2 + (448.78 / 13) * d)
        .attr('y', h - 46)
        .attr('width', 448.78 / 13)
        .attr('height', 27)
        .attr('fill', d => {
            switch (d) {
                case 2: return 'rgb(69, 117, 180)'; break;
                case 3: return 'rgb(116, 173, 209)'; break;
                case 4: return 'rgb(171, 217, 233)'; break;
                case 5: return 'rgb(224, 243, 248)'; break;
                case 6: return 'rgb(255, 255, 191)'; break;
                case 7: return 'rgb(254, 224, 144)'; break;
                case 8: return 'rgb(253, 174, 97)'; break;
                case 9: return 'rgb(244, 109, 67)'; break;
                case 10: return 'rgb(215, 48, 39)'; break;
                case 11: return 'rgb(165, 0, 38)'; break;
                default: 'black';
            }
        });



    // tooltip 

    const tooltip = d3.select('section').append('div').attr('id', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style("border", "solid")
        .style('border-color', 'rgba(0, 0, 0, 0.8)')
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style('width', '140px')
        .style('height', '90px')
        .style('box-sizing', 'border-box')
        .style('font', '15px sans-serif')
        .style('color', 'white')
        .style('padding', '0.5em')
        .style('background', 'rgba(0, 0, 0, 0.8)');


    d3.select('.map').selectAll('rect')
        .on('mouseover', (event, d) => {
            tooltip.html('')
                .attr('data-year', d.year)
                .style('visibility', 'visible')
                .style('top', event.pageY + 'px')
                .style('left', event.pageX + 'px');



            tooltip.append('div').text(`${d.year} - ${(d.month == 1) ?
                'January' :
                (d.month == 2) ?
                    'February' :
                    (d.month == 3) ?
                        'March' :
                        (d.month == 4) ?
                            'April' :
                            (d.month == 5) ?
                                'May' :
                                (d.month == 6) ?
                                    'June' :
                                    (d.month == 7) ?
                                        'July' :
                                        (d.month == 8) ?
                                            'August' :
                                            (d.month == 9) ?
                                                'September' :
                                                (d.month == 10) ?
                                                    'October' :
                                                    (d.month == 11) ?
                                                        'November' :
                                                        (d.month == 12) ?
                                                            'December' :
                                                            'none'}`);
            const add = basetem;

            const addCon = (x) => { let num = x + add; return num.toFixed(2) };

            tooltip.append('div').text(`${addCon(d.variance)}  C`).style('margin-top', '7px');



            tooltip.append('div').text(`${d.variance.toFixed(2)} C`).style('margin-top', '7px')

        })
        .on('mouseout', () => tooltip.style('visibility', 'hidden'))





}

