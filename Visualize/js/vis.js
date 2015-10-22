/**
 * Created by Xurxo on 20/10/2015.
 * src = http://bl.ocks.org/mbostock/3885304
 */


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "%");

//    var svg = d3.select("body").append("svg")
//            .attr("width", width + margin.left + margin.right)
//            .attr("height", height + margin.top + margin.bottom)
//            .append("g")
//            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var path = "data/";
//    d3.json("vis.php", function(error, data) {
d3.json(path + "total_freq.json", function(error, data) {

    if (error) throw error;

//        x.domain(data.map(function (d) {
//            return d.keyword;
//        }));
//
//        svg.append("g")
//                .attr("class", "x axis")
//                .attr("transform", "translate(0, " + height + ")")
//                .call(xAxis);
//
//        svg.selectAll(".bar")
//                .data(data)
//                .enter().append("rect")
//                .attr("class", "bar")
//                .attr("x", function(d) { return x(d.keyword); })
//                .attr("width", x.rangeBand())


    var canvas = d3.select("body").append("svg")
        .attr("width", 500)
        .attr("height", data.length * 20);

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
        .attr("width", function (d, i) { return d.freq; })
        .attr("fill", "blue");

    canvas.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("fill", "lightgray")
        .attr("y", function (d, i) { return i * 20 + 14; })
        .attr("x", 5)
        .text(function (d) { return d.Term; });

});
