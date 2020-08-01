var input = [
    {
        bedrooms: 0,
        total: 79
    },
    {
        bedrooms: 1,
        total: 684
    },
    {
        bedrooms: 2,
        total: 221
    },
    {
        bedrooms: 3,
        total: 78
    },
    {
        bedrooms: 4,
        total: 20
    }
]

var height = 500;
var width = 500;
var marginbottom = 100;
var margintop = 50;

var svg = d3.select('div')
    .append('svg')
    .attr('width', width)
    .attr('height', height + marginbottom + margintop)
    .append("g")
    .attr("transform", "translate(20," + margintop + ")");


//var habitacion = featureCollection.features["Palacio"].properties.avgbedrooms;

//Creacion de escalas
var xscale = d3.scaleBand()
    .domain(input.map(function (d) {
        return d.bedrooms;
    }))
    .range([10, width])
    .padding(0.1)

var yscale = d3.scaleLinear()
    .domain([0, d3.max(input, function (d) {
        return d.total;
    })])
    .range([height, 10]);

var xaxis = d3.axisBottom(xscale);
var yaxis = d3.axisLeft(yscale);

//Cada barra
var rect = svg
    .selectAll('rect')
    .data(input)
    .enter()
    .append('rect')
    .attr("fill", "#b30000");

rect
    .attr("x", function (d) {
        return xscale(d.bedrooms);
    })
    .attr('y', d => {
        return yscale(d.total)
    })
    .attr("width", xscale.bandwidth())
    .attr("height", function (d) {
        return height - yscale(d.total);
    });
//Texto correspondiente a cada rectangulo
var text = svg.selectAll('text')
    .data(input)
    .enter()
    .append('text')
    .text(d => d.total)
    .style("text-anchor", "middle")
    .attr("x", function (d) {
        return xscale(d.bedrooms) + xscale.bandwidth()/2;
    })
    .attr('y', d => {
        return yscale(d.total+1)
    })
    .style("opacity", 1);

//Dibujar ejes
svg.append("g")
    .attr("transform", "translate(10, 0)")
    .call(yaxis)

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis);

svg.append("text")
    .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + 40) + ")")
    .style("text-anchor", "middle")
    .text("Bedrooms");

// Titulo y axis
svg.append("text")
    .attr("y", -20)
    .attr("x", 50)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("No. properties");

svg.append("text")
    .attr("y", -20)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .style("text-anchor", "rigth")
    .style("text-decoration", "underline")
    .text("Neighbourhood: Palacio");
