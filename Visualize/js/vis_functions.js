/**
 * Created by Xurxo on 20/10/2015.
 */

/**
 * @name remove
 * @description Erase the whole visualization
 */
function remove() {
    svg_bubble.remove();
    svg_bars.remove();
    node.remove();
}

/**
 * @name draw
 * @description Draws the whole visualization
 */
function draw() {
    draw_bar_chart(graph);
    draw_bubble_chart(graph);
}

/**
 * @name draw_bubble_chart
 * @description Draws the Bubble Chart
 */
function draw_bubble_chart(graph) {

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
        .attr("width", "100%")
        .attr("height", "100%");

    main = svg_bubble.append("g")
        .attr("width", "100%")
        .attr("height", "100%")
        //.attr("transform", "translate(-150,0)")
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
        .on("mouseover", function(d) {
            mouseover_node(d);
        })
        .on("mouseout", function(d) {
            mouseout_node(d);
        })
        .on("click", function(d) {
            mouseclick_node(d);
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
 * @name draw_bar_chart
 * @description Draws the Bar Chart
 */
function draw_bar_chart(graph, mode) {

    svg_bars = d3.select("#bar_chart").append("svg")
        .attr("width", 500)
        .attr("height", graph.length * 20);
        //.attr("height", 800);

    bars = svg_bars.selectAll("rect")
        //.data(graph.sort(function(a,b) { return +b.freq - +a.freq; }))
        .data(graph.sort(function(a,b) { return +b.num_posts - +a.num_posts; }))
        .enter()
        .append("rect")
        //.attr("id", function(d) {
        //    return d.URL;
        //})
        .attr("width", 500)
        .attr("height", 18)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .attr("width", function (d, i) {
            var resul = d3.scale.linear()
                //.domain([0, 0.4]);
                .domain([0, 0.05]);
            //return resul(d.freq);
            return resul(d.num_posts);
        })
        .on("mouseover", function(d) {
            mouseover_bar(d);
        })
        .on("mouseout", function(d) {
            mouseout_bar(d);
        })
        .on("click", function(d) {
            mouseclick_bar(d);
            //alert(d.URL);
        })
        .attr("fill", "steelblue");

    label_bars = svg_bars.selectAll("text")
        .data(graph)
        .enter()
        .append("text")
        .attr("fill", "lightgray")
        .attr("y", function (d, i) {
            return i * 20 + 14;
        })
        .attr("x", 5)
        .on("mouseover", function(d) {
            mouseover_bar(d);
        })
        .on("mouseout", function(d) {
            mouseout_bar(d);
        })
        .on("click", function(d) {
            mouseclick_bar(d);
            //alert(d.URL);
        })
        .text(function (d) {
            //return d.Term;
            return d.URL;
        });
}

/**
 * @name draw_list
 * @description Draws/writes the list with the posts links
 * @param data
 */
function draw_list(data) {

    if(list) list.remove();

    list = d3.select("#list")
        .append("ul")
        .selectAll("text")
            .data(data)
        .enter().append("li")
        .attr("y", function(d, i) {
            return i * 20;
        })
        .attr("height", 18)
        .text(function(d) { return d.post_url } )
        .on("click", function(d) { window.open(d.post_url); });

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
function update(slider1, graph2) {

    d3.select("#slider1-value").text(slider1);
    d3.select("#slider").property("value", slider1);

    graph = filterData(slider1, graph2);

    remove();
    //draw();
    draw_bar_chart(num_posts);
    draw_bubble_chart(graph);

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
    //draw();
    draw_bar_chart(num_posts);
    draw_bubble_chart(graph);
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
 * @name selectDataList
 * @description Selects the list of posts where a specific term appears
 * @param Term
 * @param d
 * @returns {Array}
 */
function selectDataList(Term, d) {
    var array = [];
    var kk = 0;
    for(var jj = 0; jj < d.length; jj++) {
        if(d[jj].Term == Term) {
            array[kk] = d[jj];
            kk++;
        }
    }
    return array;
}

/**
 * @name selectDataBars
 * @description Selects the urls/schools that have posts that contains the specific term
 * @param Term
 * @param d
 * @returns {Array}
 */
function selectDataBars(Term, d) {
    var array = [];
    var resul = [];
    var kk = 0;
    for (var jj = 0; jj < d.length; jj++) {
        if (d[jj].Term == Term) {
            array[kk] = d[jj].klass_url;
            kk++;
        }
    }
    kk = 0;
    var ii = 0;
    var x = false;
    for (jj = 0; jj < array.length; jj++) {
        for (kk = 0; kk < num_posts.length; kk++) {
            if (array[jj] == num_posts[kk].URL) {
                for(var xx = 0; xx < resul.length; xx++) {
                    if (resul[xx] == num_posts[kk]) {
                        x = true;
                    }
                }
                if(!x) {
                    resul[ii] = num_posts[kk];
                    ii++;
                }
            }
        }
        x = false;
    }
    return resul;
}

function selectDataBubbles(url, data) {

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

/**
 * @name slider_handlers
 * @description Manages the sliders and call the respective functions
 * @param words_data
 */
function slider_handlers(words_data) {

    // Frequency Slider
    d3.select("#slider1").on("input", function () {
        update(+this.value, words_data);
    });

    // Gravity Slider
    d3.select("#slider2").on("input", function () {
        change_gravity(+this.value);
    });
}

/**
 *
 * @param z
 */
function mouseover_node(z) {
    //lock = false;
    if(!lock) {
        var neighbors = {};
        neighbors[z.index] = true;
        //alert(z.index);
        node.filter(function (d) {
            return neighbors[d.index]
        })
            .style("stroke-width", 3)
            .style("fill", "yellow");
        label.filter(function (d) {
            return !neighbors[d.index]
        })
            .style("fill-opacity", 0.2);
        label.filter(function (d) {
            return neighbors[d.index]
        })
            .attr("font-size", 16);
    }
}

/**
 *
 * @param z
 */
function mouseout_node(z) {
    if(!lock) {
        node
            .style("stroke-width", 1)
            .style("fill", "green");
        label
            .attr("font-size", 12)
            .style("fill-opacity", 1);
    }
}

function mouseclick_node(z) {
    //alert(z.Term);
    //lock = lock ? false : true;
    //lock = true;
    //mouseover_node(z);

    var data = selectDataList(z.Term, klass_data);

    if(list_title) {
        list_title.text(z.Term);
    } else {
        list_title = d3.select("#list_title")
            .append("text")
            .text(z.Term)
            .style("font-weight", "bold")
            .style("font-size", 20);
    }


    //list.remove();
    remove();
    draw_list(data);
    draw_bubble_chart(graph);
    draw_bar_chart(selectDataBars(z.Term, klass_data));

}

function mouseover_bar(z) {
    var neighbors = {};
    neighbors[z] = true;
    //var x = 1;
    //alert(z.URL);
    bars.filter(function (d, i) {
        //console.log(bars.id);
        //return neighbors[i]

        return bars[i]
    })
        .style("stroke-width", 3)
        .style("fill", "yellow");
    label_bars.filter(function (d, i) {
        //return !neighbors[d.index]
        return !bars[i]
    })
        .style("fill-opacity", 0.2);
    label_bars.filter(function (d, i) {
        //return neighbors[d.index]
        return bars[i]
    })
        .attr("font-size", 16);
}

function mouseout_bar(z) {
    if(!lock) {
        bars
            .style("stroke-width", 1)
            .style("fill", "steelblue");
        label_bars
            .attr("font-size", 12)
            .style("fill-opacity", 1);
    }
}

function mouseclick_bar(z) {
    console.log(z);
}
