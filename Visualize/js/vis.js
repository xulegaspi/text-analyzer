/**
 * Created by Xurxo on 20/10/2015.
 * src = http://bl.ocks.org/mbostock/3885304
 */

var width  = 800,
    height = 600;

//var force = d3.layout.force()
//    .charge( function(d) { return -35 * Math.sqrt(d.freq)} )
//    .linkDistance(50)
//    .gravity(0.15)
//    .size([width - 250, height]);

var pack = d3.layout.pack()
    .size([width, height - 50])
    .padding(10);

var path = "data/";

//    d3.json("vis.php", function(error, data) {
d3.json(path + "total_freq.json", function(error, data) {
    if (error) throw error;

    var nodes = pack.nodes(data);
    console.log(nodes);

    // Create the svg to print the bars
    var canvas = d3.select("body").append("svg")
        //.attr("class", "bubble")
        .attr("width", 5000)
        .attr("height", data.length * 20);

    /*var node = canvas.selectAll(".node")
        .data(data)
        .enter()
        .append("g")
            .attr("class", "node");
            //.attr("transform", function(d) {
            //    return "translate(" + d.x + "," + d.y + ")";
            //});

    node.append("circle")
        .attr("r", function (d) {return d.freq})
        .attr("fill", "steelblue")
        //.attr("opacity", 0.50)
        .attr("stroke-width", "2");

    node.append("text")
        .data(data)
        .text(function(d) { return d.Term; });*/


    // Create the bars
    canvas.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", function (d) {
            //console.log(d);
            return 500;
        })
        .attr("height", 18)
        .attr("y", function (d, i) { return i * 20; })
        .attr("width", function (d, i) {
            var resul = d3.scale.linear()
                .domain([0,0.4]);
            return resul(d.freq);
        })
        .attr("fill", function(d) {
            var resul = d3.scale.linear()
                .domain([1, 50, 150])
                .range(["blue", "red", "green"]);
            //console.log(resul);
            return resul(d.freq);
        });

    // Put text into the bars
    canvas.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("fill", "lightgray")
        .attr("y", function (d, i) { return i * 20 + 14; })
        .attr("x", 5)
        .text(function (d) { return d.Term; });

});
