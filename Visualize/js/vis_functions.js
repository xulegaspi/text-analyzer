/**
 * Created by Xurxo on 20/10/2015.
 */

var node_color = "#FFE47A";
var bar_color = "#1C68FF";
var node_selected_color = "#1AD1FF";
var node_mouse_color = "#90DAFF";
var node_label_color = "#000000";
var bar_mouse_color = "#1C68FF";
var bar_selected_color = "";
var bar_label_color = "#FFFFE3";
var bar_label_mouse_color = "#B38F00";
var bar_label_selected_color = "yellow";


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
        .charge(-200)
        .linkDistance(50)
        .gravity(gravity)
        .size([width, height])
        .nodes(graph.filter(function(d) {
            return d.freq > freq;
        }))
        .on("tick", tick);

    force.start();

    svg_bubble = d3.select("#bubble_chart").append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    main = svg_bubble.append("g")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("class", "graph");

    node = main.selectAll(".node_circle")
        .data(force.nodes());

    nodeEnter = node.enter()
        .append("circle")
        .attr("class", "node_circle")
        .attr("r", function (d) {
            return diam * Math.sqrt(d.freq);
        })
        //.style("fill", function (d) {
        //    //return kind_to_color(d);
        //})
        .style("fill", node_color)  // COLOUR
        .on("mouseover", function(d) {
            mouseover_node(d);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("class", "mouse_node");
            mouseout_node(d);
        })
        .on("click", function(d) {
            //lock = true;
            lock = lock ? false : true;
            mouseclick_node(d);
                d3.select(this)
                    .style("fill", node_selected_color);
                    //.attr("class", "selected_node");
        });

    node.call(force.drag);

    label = main.selectAll(".node_label")
        .data(force.nodes());
    //label = node
    label.enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("class", "node_label")
        .attr("font-family", "Verdana")
        .attr("font-size", 12)
        .style("fill", node_label_color)
        .on("mouseover", function(d) {
            mouseover_node(d);
        })
        .on("mouseout", function(d) {
            mouseout_node(d);
        })
        .on("click", function(d) {
            //lock = true;
            lock = lock ? false : true;
            mouseclick_node(d);
        })
        .text(function (d) {
            return d.Term;
        });

}

/**
 * @name draw_bar_chart
 * @description Draws the Bar Chart
 */
function draw_bar_chart(graph, mode) {

    svg_bars = d3.select("#bar_chart").append("svg")
        .attr("width", "100%")
        .attr("height", graph.length * 20);
        //.attr("height", 800);

    //tip = d3.tip()

    switch(mode) {
        case "posts":
            bars = svg_bars.selectAll("rect")
                .data(graph.sort(function(a,b) { return +b.num_posts - +a.num_posts; }));
            break;
        case "post_length":
            bars = svg_bars.selectAll("rect")
                //.data(graph.sort(function(a,b) { return +b.freq - +a.freq; }))
                .data(graph.sort(function(a,b) { return +b.avg_length - +a.avg_length; }));
            break;
        case "num_photos":
            bars = svg_bars.selectAll("rect")
                //.data(graph.sort(function(a,b) { return +b.freq - +a.freq; }))
                .data(graph.sort(function(a,b) { return +b.freq_image - +a.freq_image; }));
            break;
        case "num_videos":
            bars = svg_bars.selectAll("rect")
                //.data(graph.sort(function(a,b) { return +b.freq - +a.freq; }))
                .data(graph.sort(function(a,b) { return +b.freq_video - +a.freq_video; }));
            break;
        default :
            return resul(d.freq);
    }

    bars.enter()
        .append("rect")
        //.attr("id", function(d) {
        //    return d.URL;
        //})
        .attr("height", 18)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .attr("width", function (d, i) {
            var scale;// = d3.scale.linear()
                //.domain([0, 0.4]);
            //    .domain([0, 0.05]);
            switch (mode) {
                case "posts":
                    scale = d3.scale.linear()
                        //.domain([0, 0.4]);
                        .domain([0, 0.035]);
                    return scale(d.num_posts);
                    break;
                case "post_length":
                    scale = d3.scale.linear()
                        //.domain([0, 0.4]);
                        .domain([0, 0.5]);
                    return scale(d.avg_length);
                    break;
                case "num_photos":
                    scale = d3.scale.linear()
                        //.domain([0, 0.4]);
                        .domain([0, 0.09]);
                    return scale(d.freq_image);
                    break;
                case "num_videos":
                    scale = d3.scale.linear()
                        //.domain([0, 0.4]);
                        .domain([0, 0.01]);
                    return scale(d.freq_video);
                    break;
                default :
                    return scale(d.freq);
            }
            //return resul(d.freq);
            //return resul(d.num_posts);
        })
        .on("mouseover", function() {
            d3.select(this)
                .attr("fill", bar_mouse_color);  // COLOUR
            //mouseover_bar(d);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("fill", bar_color);  // COLOUR
            //mouseout_bar(d);
        })
        .on("click", function(d) {
            mouseclick_bar(d);
            //alert(d.URL);
        })
        .attr("fill", bar_color);  // COLOUR

    label_bars = svg_bars.selectAll("text")
        .data(graph)
        .enter()
        .append("text")
        .attr("fill", bar_label_color)
        .attr("y", function (d, i) {
            return i * 20 + 14;
        })
        .attr("x", 5)
        .on("mouseover", function() {
            d3.select(this)
                .attr("fill", bar_label_mouse_color);
            //mouseover_bar(d);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("fill", bar_label_color);
            //mouseout_bar(d);
        })
        .on("click", function(d) {
            mouseclick_bar(d);
            d3.select(this)
                .attr("fill", bar_label_selected_color);
            //alert(d.URL);
        })
        .text(function (d) {
            //return d.Term;
            switch (mode) {
                case "posts":
                    return d.URL;
                    break;
                case "post_length":
                    return d.url;
                    break;
                case "num_photos":
                    return d.url;
                    break;
                case "num_videos":
                    return d.url;
                    break;
                default :
                    return resul(d.URL);
            }
            //return d.URL;
        });

    var xAxis = d3.svg.axis()
        .orient("top")
        .scale(xScale);

    svg_bars.append("g")
        .attr("class", "xaxis")   // give it a class so it can be used to select only xaxis labels  below
        //.attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);
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
        //.text(function(d) { return d.post_url } )
        .text(function(d) { return extractTitlePost(d.post_url) } )
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
function update(slider1) {

    d3.select("#slider1-value").text(slider1);
    d3.select("#slider").property("value", slider1);

    freq = slider1;

    force.nodes(graph_raw.filter(function(d) {
            return d.freq > freq;
        }))
        .charge(function (d) {
            return -35 * Math.sqrt(d.freq)
        });


    //node = main.selectAll(".node_circle")
    node = node
        .data(force.nodes());

    nodeEnter = node.enter()
        .append("circle")
        .attr("class", "node_circle")
        .attr("r", function (d) {
            return diam * Math.sqrt(d.freq);
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
            //lock = true;
            lock = lock ? false : true;
            mouseclick_node(d);
            d3.select(this)
                .style("fill", "red")
                .attr("class", "selected_node");
        });

    node.transition()
        .duration(500);

    node.exit()
        .transition()
        .attr("r", 0)
        .duration(500)
        .remove();

    node.transition()
        .attr("class", "node_circle");

    node.call(force.drag);

    //label.remove();

    label = label.data(force.nodes());

    label.text(function(d) {
        return d.Term;
    });
    label.transition()
        .duration(750)
        .attr("font-size", 12);

    label.enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("class", "node_label")
        .attr("font-family", "Verdana")
        .attr("font-size", 12)
        .style("fill", "#000000")
        .on("mouseover", function(d) {
            mouseover_node(d);
        })
        .on("mouseout", function(d) {
            mouseout_node(d);
        })
        .on("click", function(d) {
            //lock = true;
            lock = lock ? false : true;
            mouseclick_node(d);
            d3.select(this)
                //.style("fill", "red")
                .attr("class", "selected_node");
        })
        .text(function (d) {
            return d.Term;
        });

    //label.transition()
        //.duration(500);

    label.exit()
        .transition()
        .duration(500)
        .remove();

    force.start();

    //graph = filterData(slider1, graph2);

    //remove();
    //draw();
    //draw_bar_chart(posts_fil, sort);
    //draw_bubble_chart(graph);

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
    draw_bar_chart(posts_fil, sort);
    draw_bubble_chart(graph);
}

function change_diam(slider3) {
    d3.select("#slider3-value").text(slider3);
    d3.select("#slider_diam").property("value", slider3);

    diam = slider3 * 0.5;
    svg_bubble.remove();
    draw_bubble_chart(graph);
}

function reset() {

    freq = 20;

    document.getElementById("slider1").value = freq;
    var span = document.getElementById('slider1-value');
    while( span.firstChild ) {
        span.removeChild( span.firstChild );
    }
    span.appendChild( document.createTextNode(freq) );

    document.getElementById("tittle_bubble").value = "Overall";
    span = document.getElementById('tittle_bubble');
    while( span.firstChild ) {
        span.removeChild( span.firstChild );
    }
    span.appendChild( document.createTextNode("Overall") );

    diam = 3.5;
    gravity = 40 * 0.005;
    remove();
    draw_bubble_chart(words_data);
    //graph_raw = words_data;
    console.log(words_data);
    sort = "posts";
    graph_raw = words_data;
    draw_bar_chart(num_posts, sort);
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

        switch(sort) {
            case "posts":
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
                break;
            case "post_length":
                for (kk = 0; kk < avg_length.length; kk++) {
                    if (array[jj] == avg_length[kk].url) {
                        for(var xx = 0; xx < resul.length; xx++) {
                            if (resul[xx] == avg_length[kk]) {
                                x = true;
                            }
                        }
                        if(!x) {
                            resul[ii] = avg_length[kk];
                            ii++;
                        }
                    }
                }
                x = false;
                break;
            default:
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
                break;
        }

    }
    return resul;
}

function selectDataBubbles(url, data) {
    var array = [];
    var kk = 0;
    for(var jj = 0; jj < data.length; jj++) {
        if(data[jj].klass_url == url) {
            array[kk] = data[jj];
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
    //var resul = d3.scale.linear()
    //    .domain([1, 50, 150])
    //    .range(["grey", "green"]);
    //return resul(d.freq);
    return node_color;  // COLOUR
}

/**
 * @name slider_handlers
 * @description Manages the sliders and call the respective functions
 * @param words_data
 */
function slider_handlers() {

    // Frequency Slider
    d3.select("#slider1").on("input", function () {
        update(+this.value);
    });

    // Gravity Slider
    d3.select("#slider2").on("input", function () {
        change_gravity(+this.value);
    });

    // Diam Slider
    d3.select("#slider3").on("input", function () {
        change_diam(+this.value);
    });

    // Reset Button
    d3.select("#reset").on("click", function () {
        reset();
    });

    // Dropdown list
    d3.select("select").on("change", function(d) {
        sort = this.value;
        console.log(sort);
        switch(sort) {
            case "posts":
                graph = num_posts;
                console.log(graph);
                break;
            case "post_length":
                graph = avg_length;
                console.log(graph);
                break;
            case "num_photos":
                graph = num_media;
                console.log(graph);
                break;
            case "num_videos":
                graph = num_media;
                console.log(graph);
                break;
            default :
                return resul(d.URL);
        }

        svg_bars.remove();
        draw_bar_chart(graph, sort);
    })
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
            //.attr("class", "node_circle_select")
            .style("stroke-width", 3)
            .style("fill", node_mouse_color);  // COLOUR
    //if(!lock) {
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
            //.attr("class", "node_circle")
            .style("stroke-width", 1)
            .style("fill", node_color);  // COLOUR
    //if(!lock) {
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

    //bars = bars.data(data.sort(function(a,b) { return +b.num_posts - +a.num_posts; }))
    //    .attr("width", function (d, i) {
    //            var resul = d3.scale.linear()
    //                //.domain([0, 0.4]);
    //                .domain([0, 0.05]);
    //            //switch (mode) {
    //            //    case "posts":
    //            //        return resul(d.num_posts);
    //            //        break;
    //            //    case "media":
    //            //        return resul(d.freq);
    //            //        break;
    //            //    default :
    //            //        return resul(d.freq);
    //            //}
    //            //return resul(d.freq);
    //            return resul(d.num_posts);
    //        });
    //bars.exit().remove();


    //bars.exit().remove();

    svg_bars.remove();
    draw_list(data);

    //draw_bubble_chart(graph);
    posts_fil = selectDataBars(z.Term, klass_data);

    //console.log(posts_fil.length);
    //console.log(bars.filter(function(d, i) {
    //    if(posts_fil.indexOf(d) > -1) {
    //        return d;
    //    }
    //}));
    //bars = bars
    //    .filter(function(d) {
    //    if(posts_fil.indexOf(d) > -1) {
    //        return d;
    //    }
    //})
    //    .transition();
    //svg_bars.transition();
    //bars.transition().duration(1000);

    console.log(z.Term);
    draw_bar_chart(posts_fil, sort);

}

function mouseclick_bar(z) {


    var array;
    var span;

    switch(sort) {
        case "posts":
            console.log(z.URL);
            array = selectDataBubbles(z.URL, klass_data);

            document.getElementById("tittle_bubble").value = z.URL;
            span = document.getElementById('tittle_bubble');
            while( span.firstChild ) {
                span.removeChild( span.firstChild );
            }
            span.appendChild( document.createTextNode(z.URL) );

            break;
        case "post_length":
            console.log(z.url);
            array = selectDataBubbles(z.url, klass_data);

            document.getElementById("tittle_bubble").value = z.url;
            span = document.getElementById('tittle_bubble');
            while( span.firstChild ) {
                span.removeChild( span.firstChild );
            }
            span.appendChild( document.createTextNode(z.url) );

            break;
        case "num_photos":
            console.log(z);
            array = extractImages(z.id_post);
            break;
        case "num_videos":
            break;
        default:
            array = selectDataBubbles(z.URL, klass_data);
            break;
    }
    


    freq = 1;
    document.getElementById("slider1").value = freq;
    span = document.getElementById('slider1-value');
    while( span.firstChild ) {
        span.removeChild( span.firstChild );
    }
    span.appendChild( document.createTextNode("1") );


    switch (sort) {
        case "posts":
        case "post_length":
            force.
                nodes(array.filter(function (d) {
                    return d.freq > freq;
                }))
                    .charge(function (d) {
                        return -35 * Math.sqrt(d.freq)
                    });

                node = node.data(force.nodes());

                nodeEnter = node.enter()
                    .append("circle")
                    .attr("class", "node_circle")
                    .attr("r", function (d) {
                        return diam * Math.sqrt(d.freq);
                    })
                    .style("fill", function (d) {
                        return kind_to_color(d);
                    })
                    .on("mouseover", function (d) {
                        mouseover_node(d);
                    })
                    .on("mouseout", function (d) {
                        mouseout_node(d);
                    })
                    .on("click", function (d) {
                        //lock = true;
                        lock = lock ? false : true;
                        mouseclick_node(d);
                        d3.select(this)
                            .style("fill", "red")
                            .attr("class", "selected_node");
                    });

                node.exit()
                    .transition()
                    .attr("r", 0)
                    .duration(500)
                    .remove();
                //node.call(force.drag);

                label = label.data(force.nodes())
                    .text(function (d) {
                        return d.Term;
                    });

                label.enter()
                    .append("text")
                    .attr("text-anchor", "middle")
                    .attr("class", "node_label")
                    .attr("font-family", "Verdana")
                    .attr("font-size", 12)
                    .style("fill", "#000000")
                    .on("mouseover", function (d) {
                        mouseover_node(d);
                    })
                    .on("mouseout", function (d) {
                        mouseout_node(d);
                    })
                    .on("click", function (d) {
                        //lock = true;
                        lock = lock ? false : true;
                        mouseclick_node(d);
                        d3.select(this)
                            //.style("fill", "red")
                            .attr("class", "selected_node");
                    })
                    .text(function (d) {
                        return d.Term;
                    });

                label.exit()
                    .transition()
                    .duration(500)
                    .remove();

                force.start();

                graph_raw = array;
                graph = graph_raw;

                diam = 13;

                node.transition()
                    .attr("r", function (d) {

                        return diam * Math.sqrt(d.freq);
                    })
                    .duration(1000)
                    .delay(500);

                force.gravity(12 * 0.005);
            break;
        case "num_photos":
            //console.log(array);
            force.nodes(array);
                //.charge(function (d) {
                //    return -35;
                //})
                //.on("tick", tick);

            node.remove();
            label.remove();

            node = node.data(force.nodes());

            nodeEnter = node.enter()
                .append("g")
                .attr("class", "node");
                //.attr("r", 200 )
                //.on("mouseover", function (d) {
                //    mouseover_node(d);
                //})
                //.on("mouseout", function (d) {
                //    mouseout_node(d);
                //})
                //.on("click", function (d) {
                //    //lock = true;
                //    lock = lock ? false : true;
                //    mouseclick_node(d);
                //    d3.select(this)
                //        .style("fill", "red")
                //        .attr("class", "selected_node");
                //})
                //.call(force.drag);

            var images = nodeEnter.append("image")
                .attr("xlink:href", function(d, i) { console.log("hey" + d + " --> " + i + " " + array.length); return d; })
                .attr("x", function(d, i) { return 1000 - i*5; })
                .attr("y", 400)
                .attr("width", "160px")
                .attr("height", "90px");

            //var images = nodeEnter.append("svg:image")
            //    .attr("xlink:href",  function(d) { return d;})
            //    .attr("x", function(d) { return -25;})
            //    .attr("y", function(d) { return -25;})
            //    .attr("height", 50)
            //    .attr("width", 50);

            node.exit()
                .transition()
                .attr("r", 0)
                .duration(500)
                .remove();
            //node.call(force.drag);

            label = label.data(force.nodes());
                //.text(function (d) {
                //    return d.Term;
                //});

            label.exit()
                .transition()
                .duration(500)
                .remove();

            //force.start();

            graph_raw = array;
            graph = graph_raw;

            diam = 13;

            //node.transition()
            //    .attr("r", function (d) {
            //
            //        return diam * Math.sqrt(d.freq);
            //    })
            //    .duration(1000)
            //    .delay(500);

            //force.gravity(12 * 0.005);
            break;
    }


}


function extractTitlePost(post) {
    var array = [];
    array = post.split("/");
    var l = array.length;

    return array[l-2];
}

function tick() {
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
}

function extractImages(post_id) {
    var array = [];
    var ii = 0;
    for(var kk = 0; kk < media.length; kk++) {
        if(media[kk].Id_Post == post_id && media[kk].Type == "IMAGE") {
            array[ii] = media[kk].Media_URL;
            ii++;
        }
    }

    return array;
}