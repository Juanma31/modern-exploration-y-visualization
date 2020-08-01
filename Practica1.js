d3.json('practica_airbnb.json')
    .then((featureCollection) => {
        drawMap(featureCollection);
    });
    
function drawMap(featureCollection) {
    console.log(featureCollection)
    console.log(featureCollection.features)
    var width = 800;
    var height = 800;

    var svg = d3.select('div')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g');

    var tooltip = d3.select("div").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute") //Para obtener la posicion correcta sobre los circulos
        .style("pointer-events", "none") //Para evitar el flicker
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px");

    var center = d3.geoCentroid(featureCollection); //Encontrar la coordenada central del mapa (de la featureCollection)

    console.log(center)

    //Para transformar geo coordinates[long,lat] en X,Y coordinates.
    var projection = d3.geoMercator()
        .fitSize([width, height], featureCollection) 

    console.log(projection)
    
    //Para crear paths a partir de una proyección 
    var pathProjection = d3.geoPath().projection(projection);
    var features = featureCollection.features;
    var scaleColor = d3.scaleOrdinal(d3.schemeTableau10);    
    
    var createdPath = svg.selectAll('path')
        .data(features)
        .enter()
        .append('path')
        .attr('d', (d) => pathProjection(d))
        .attr("stroke", "black")
        .attr("opacity", function(d, i) {
            d.opacity = 1
            return d.opacity
        
        })
        
    createdPath.on("mouseover", handleMouseOver)
    createdPath.on("mouseout", handleMouseOut);

    //Creacion de una leyenda
    var nblegend = 10;
    var widthRect = (width / nblegend) - 2;
    var heightRect = 10;

    var scaleLegend = d3.scaleLinear()
        .domain([0, nblegend])
        .range([0, width]);

    //Ordenar todos los precios promedios en un array (preciosOrdenados) 
    //y coger los valores maximos y minimo
    var arrayPrecios =[] 
    featuresTamaño = features.length
    for(let index=0;index<featuresTamaño;index++){
        arrayPrecios.push(features[index].properties.avgprice)
    }

    //console.log(arrayPrecios)
    preciosOrdenados=arrayPrecios.sort((a,b)=>a-b)
    //console.log(preciosOrdenados) 

    var minPrecio = preciosOrdenados[0]
    var maxPrecio = preciosOrdenados[featuresTamaño-1]

    //separacion de cada bloque de leyenda
    var pasoSeparacion = Math.round((maxPrecio-minPrecio)/nblegend)
    var numerosLegend=[minPrecio]
    
    for(let index=1;index<nblegend+1;index++){
        numerosLegend.push(numerosLegend[index-1]+pasoSeparacion)
    }
    //console.log(numerosLegend)

    createdPath.attr("fill",function(d,i){
        if(d.properties.avgprice>=minPrecio && d.properties.avgprice<numerosLegend[1])
            return d3.schemeTableau10[0]
        else if (d.properties.avgprice>=numerosLegend[1] && d.properties.avgprice<numerosLegend[2])
            return d3.schemeTableau10[1]
        else if (d.properties.avgprice>=numerosLegend[2] && d.properties.avgprice<numerosLegend[3])
            return d3.schemeTableau10[2]
        else if (d.properties.avgprice>=numerosLegend[3] && d.properties.avgprice<numerosLegend[4])
            return d3.schemeTableau10[3]
        else if (d.properties.avgprice>=numerosLegend[4] && d.properties.avgprice<numerosLegend[5])
            return d3.schemeTableau10[4]
        else if (d.properties.avgprice>=numerosLegend[5] && d.properties.avgprice<numerosLegend[6])
            return d3.schemeTableau10[5]
        else if (d.properties.avgprice>=numerosLegend[6] && d.properties.avgprice<numerosLegend[7])
            return d3.schemeTableau10[6]
        else if (d.properties.avgprice>=numerosLegend[7] && d.properties.avgprice<numerosLegend[8])
            return d3.schemeTableau10[7]
        else if (d.properties.avgprice>=numerosLegend[8] && d.properties.avgprice<numerosLegend[9])
            return d3.schemeTableau10[8]
        else
            return d3.schemeTableau10[9]
        });

    var legend = svg.append("g")
        .selectAll("rect")
        .data(d3.schemeTableau10)  
        .enter()
        .append("rect")
        .attr("width", widthRect-18)
        .attr("height", heightRect)   
        .attr("transform", "translate(" + 10 + ", " + 0 + ")")
        .attr("x", (d, i) => scaleLegend(i*widthRect/100)) 
        .attr("fill", (d) => d);
    
    var text_legend = svg.append("g")
        .selectAll("text")
        .data(numerosLegend) 
        .enter()
        .append("text")
        .attr("x", (d, i) => scaleLegend(i*(widthRect/100)))
        .attr("y", heightRect * 2.5)
        .text((d)=>d)
        .attr("font-size", 12)

    function handleMouseOver(d, i) {
        d3.select(this)
            .transition("transOver")
            .duration(500)
            .style("opacity",0.5)
    
        tooltip.transition()
            .duration(200)
            .style("visibility", "visible")
            // .style("opacity", .9)
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 30) + "px")
            .text(`${d.properties.name} - Price: ${d.properties.avgprice} USD`)
    
    }
    
    //Función para gestionar eventos de Mouse Out un elemento sobre un elemento.
    function handleMouseOut(d, i) {
        d3.select(this)
            .transition("transOver") //Para aplicar  diferentes transicciones 
            .duration(200)
            .style("opacity",1)
           
        tooltip.transition()
            .duration(200)
            .style("visibility", "hidden")
    }
}
