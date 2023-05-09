
const urlsets = {
    kickstarter: {
        title: 'Kickstarter Pledges',
        description: 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category',
        url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
    },
    movie: {
        title: 'Movie Sales',
        description: 'Top 100 Highest Grossing Movies Grouped By Genre',
        url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
    },
    videogame: {
        title: 'Video Game Sales',
        description: 'Top 100 Most Sold Video Games Grouped by Platform',
        url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
    }
};

const w = 960;
const h = 570;
const colors = [
    'yellow',
    'navy',
    'purple',
    'green',
    'blue',
    '#9edae5',
    'orange',
    'pink',
    'aqua',
    'indigo',
    'beige',
    '#d79b74',
    '#e377c2',
    '#f7b6d2',
    '#7f7f7f',
    '#c7c7c7',
    '#bcbd22',
    '#dbdb8d',
    '#17becf',
    'red'
];

const color = d3.scaleOrdinal().range(colors.map(c => d3.interpolateRgb(c, '#fff')(0.2)));

const treemap = d3.treemap().size([w, h]).paddingInner(1);



let urlParams = new URLSearchParams(window.location.search);
const defaultData = 'videogame';
const dataset = urlsets[urlParams.get('data') || defaultData];

document.getElementById('title').innerHTML = dataset.title

document.getElementById('description').innerHTML = dataset.description


d3.json(dataset.url).then((data) => {


    const tooltip = d3.select('#main').append('div').attr('id', 'tooltip').style('position', 'absolute').style('opacity', 0);


    let root = d3.hierarchy(data).eachBefore(d => { d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name; })
        .sum(d => d.value).sort((x, y) => { return y.height - x.height || y.value - x.value });

    treemap(root);

    const g = d3.select('#tree-map').selectAll('g').data(root.leaves()).enter()
        .append('g').attr('class', 'group').attr('transform', d => { return `translate(${d.x0},${d.y0})` });


    g.append('rect').attr('id', d => d.data.id).attr('class', 'tile').attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0).attr('data-name', d => d.data.name).attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value).attr('fill', d => color(d.data.category))
        .on('mouseover', (event, d) => {
            tooltip.html('')
                .style('top', event.pageY + 'px')
                .style('left', event.pageX + 'px')
                .attr('data-value', d.data.value)
                .style('opacity', 0.9);

            tooltip.append('text').text(`Name: ${d.data.name} `);
            tooltip.append('br');
            tooltip.append('text').text(`Category: ${d.data.category}`);
            tooltip.append('br');
            tooltip.append('text').text(`Value: ${d.data.value}`);
        })
        .on('mouseout', () => tooltip.style('opacity', 0));

    g.append('text').attr('id', 'tile-text').style('cursor', 'default').selectAll('tspan')
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g)).enter().append('tspan')
        .attr('x', 5).attr('y', (d, i) => 12 + i * 10).text(d => d);

    let cat = root.leaves().map(nodes => nodes.data.category);
    cat = cat.filter((c, i, s) => { return s.indexOf(c) === i });

    const legendWidth = 500;
    const legendOffSet = 10;
    const legendRectSize = 15;
    const legendHSpace = 150;
    const legendVSpace = 10;
    const legendTextX = 3;
    const legendTextY = -2;
    let legendRows = Math.floor(legendWidth / legendHSpace);

    const legendElements = d3.select('#legend').append('g')
        .attr('transform', ` translate(60, ${legendOffSet})`)
        .selectAll('g').data(cat).enter().append('g')
        .attr('transform', (d, i) => `translate( ${(i % legendRows) * legendHSpace}
        , ${(Math.floor(i / legendRows) * legendRectSize) + legendVSpace * Math.floor(i / legendRows)
            })`);

    legendElements.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('class', 'legend-item')
        .attr('fill', d => color(d))


    legendElements.append('text')
        .attr('x', legendRectSize + legendTextX)
        .attr('y', legendRectSize + legendTextY)
        .text(d => d)





}
).catch(e => console.log(e));


