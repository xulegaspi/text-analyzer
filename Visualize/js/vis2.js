/**
 * Created by Xurxo on 23/10/2015.
 */
var width  = 1200,
    height = 800;

var gravity = 0.30;

var path = "data/";

//d3.json("vis.php", function(error, graph) {
d3.json(path + "total_freq.json", function(error, graph) {
    if (error) throw error;

    var filterData = function(freq, d) {
        
    };

    var kind_to_color = function(d){
        var resul = d3.scale.linear()
            .domain([1, 50, 150])
            .range(["grey", "green"]);
        return resul(d.freq);
    };

    var force = d3.layout.force()
        .charge( function(d) { return -35 * Math.sqrt(d.freq)} )
        .linkDistance(50)
        .gravity(gravity)
        .size([width - 250, height])
        .nodes(graph);

    force.start();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var main = svg.append("g")
        .attr("class", "graph");

    var node = main.selectAll(".node_circle")
        .data(graph)
        .enter().append("circle")
        .attr("class", "node_circle")
        .attr("r", function(d) { return 3.5 * Math.sqrt(d.freq); })
        .style("fill", function(d){ return kind_to_color(d); } )
        .call(force.drag);

    var label = main.selectAll(".node_label")
        .data(graph)
        .enter().append("text")
        .attr("class", "node_label")
        .attr("dx", function(d) { return 2 + 0.5 * Math.sqrt(d.freq); })
        .attr("dy", ".4em")
        .attr("font-family", "Verdana")
        .attr("font-size", 12)
        .style("fill", "#000000")
        .text(function(d) { return d.Term; });

    force.on("tick", function(e) {
        var q = d3.geom.quadtree(node),
            i = 0,
            n = node.length;

        while (++i < n) q.visit(collide(node[i]));

        svg.selectAll("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        svg.selectAll("text")
            .attr("dx", function(d) { return d.x; })
            .attr("dy", function(d) { return d.y; });
    });


    function collide(node) {
        var r = node.radius + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
        return function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.radius + quad.point.radius;
                if (l < r) {
                    l = (l - r) / l * .5;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }
});
