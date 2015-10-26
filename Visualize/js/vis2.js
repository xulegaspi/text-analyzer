/**
 * Created by Xurxo on 23/10/2015.
 */
var width  = 1000,
    height = 800;

var gravity = 40 * 0.005;

var path = "data/";

var force;       // Force layout for the buuble chart
var svg_bubble;  // Bubble Chart SVG
var svg_bars;    // Bar Chart SVG
var main;        // Bubble Chart
var node;        // Bubble Chart nodes (bubbles)
var label;       // Labels of the Bubbles

//d3.json("vis.php", function(error, graph) {
d3.json(path + "total_freq.json", function(error, graph2) {
    if (error) throw error;

    /**
     * Sliders control
     */
    // Frequency Slider
    d3.select("#slider1").on("input", function() {
        update(+this.value);
    });

    // Gravity Slider
    d3.select("#slider2").on("input", function() {
        change_gravity(+this.value);
    });

    var graph = filterData(15, graph2);
    draw();


    
    /**
     * @name remove
     * @description erase the whole visualization
     */
    function remove() {
        svg_bubble.remove();
        svg_bars.remove();
        node.remove();
    }

    /**
     * @name draw
     * @description draws the whole visualization
     */
    function draw() {

        force = d3.layout.force()
            .charge(function (d) {
                return -35 * Math.sqrt(d.freq)
            })
            .linkDistance(50)
            .gravity(gravity)
            .size([width, height])
            .nodes(graph);

        force.start();

        svg_bubble = d3.select("#bubble_chart").append("svg")
            .attr("width", width)
            .attr("height", height);
        //.attr("transform", "translate(600, 0)");

        svg_bars = d3.select("#bar_chart").append("svg")
            .attr("width", 500)
            .attr("height", graph.length * 20);

        svg_bars.selectAll("rect")
            .data(graph.sort(function(a,b) { return +b.freq - +a.freq; }))
            .enter()
            .append("rect")
            .attr("width", 500)
            .attr("height", 18)
            .attr("y", function (d, i) {
                return i * 20;
            })
            .attr("width", function (d, i) {
                var resul = d3.scale.linear()
                    .domain([0, 0.4]);
                return resul(d.freq);
            })
            .attr("fill", "steelblue");

        svg_bars.selectAll("text")
            .data(graph)
            .enter()
            .append("text")
            .attr("fill", "lightgray")
            .attr("y", function (d, i) {
                return i * 20 + 14;
            })
            .attr("x", 5)
            .text(function (d) {
                return d.Term;
            });

        main = svg_bubble.append("g")
            .attr("class", "graph");

        node = main.selectAll(".node_circle")
            .data(graph)
            .enter().append("circle")
            .attr("class", "node_circle")
            .attr("r", function (d) {
                return 3.5 * Math.sqrt(d.freq);
            })
            .style("fill", function (d) {
                return kind_to_color(d);
            })
            .call(force.drag);

        label = main.selectAll(".node_label")
            .data(graph)
            .enter().append("text")
            .attr("text-anchor", "middle")
            .attr("class", "node_label")
            .attr("font-family", "Verdana")
            .attr("font-size", 12)
            .style("fill", "#000000")
            .text(function (d) {
                return d.Term;
            });

        force.on("tick", function (e) {
            var q = d3.geom.quadtree(node),
                i = 0,
                n = node.length;

            while (++i < n) q.visit(collide(node[i]));

            svg_bubble.selectAll("circle")
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });

            svg_bubble.selectAll("text")
                .attr("dx", function (d) {
                    return d.x;
                })
                .attr("dy", function (d) {
                    return d.y;
                });
        });

    }


    /**
     * @name collide
     * @description Manages and avoid the overlay between nodes
     * @param node
     * @returns {Function}
     */
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

    /**
     * @name update
     * @description Updates the charts with the new data, adding or removing depending on the applied filters
     * @param slider1
     */
    function update(slider1) {

        d3.select("#slider1-value").text(slider1);
        d3.select("#slider").property("value", slider1);

        graph = filterData(slider1, graph2);

        remove();

        draw();

    }

    /**
     * @name change_gravity
     * @description Updates the bubble chart applying the new gravity property
     * @param slider2
     */
    function change_gravity(slider2) {
        d3.select("#slider2-value").text(slider2);
        d3.select("#slider_gravity").property("value", slider2);

        gravity = slider2 * 0.005;

        remove();
        draw();
    }

    /**
     * @name filterData
     * @description Filters the raw data returning only the values that are higher than the given frequency
     * @param freq1
     * @param d
     * @returns {Array}
     */
    function filterData(freq1, d) {
        var array = [];
        var kk = 0;
        for(var jj = 0; jj < d.length; jj++) {
            if(d[jj].freq >= freq1) {
                array[kk] = d[jj];
                kk++;
            }
        }
        return array;
    }

    /**
     * @name kind_to_color
     * @description Codifies some information in the color
     * @param d
     * @returns {*}
     */
    function kind_to_color(d) {
        var resul = d3.scale.linear()
            .domain([1, 50, 150])
            .range(["grey", "green"]);
        return resul(d.freq);
    }

});
