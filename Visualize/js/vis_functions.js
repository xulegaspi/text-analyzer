/**
 * Created by Xurxo on 20/10/2015.
 */

var node_color = "#FFE47A";
//var bar_color = "#6c7b93";
//var bar_color = "#b3d9ff";
//var bar_color = "#91b7dd";
var bar_color = "#81a7cd";
var node_selected_color = "#80b3ff";
var node_excluded_color = "#cc0000";
var node_mouse_color = "#90DAFF";

var node_low_color = "#ffebcc";
var node_high_color = "#ffa31a";

var node_label_color = "#000000";
var bar_mouse_color = "#1C68FF";
var bar_selected_color = "";
var bar_label_color = "#000000";
var bar_label_mouse_color = "#B38F00";
var bar_label_selected_color = "yellow";
var bar_list_color = "#b3d9ff";
var label_list_color = "#000d1a";
var margin = {top: 25, right: 20, bottom: 70, left: 40};

var node_title;
var label_title;

var click_node = false;
var click_bar = false;
var click_list = false;

var selected_node;
//var excluded_node;
var selected_bar;
var selected_list;
var nodesArray = [];
var excludedNodes = [];

var bubble_values;
var bar_values;
var list_values;

var reminder = false;


/**
 * @name remove
 * @description Erase the whole visualization
 * Not used anymore, kept for debugging purposes
 */
function remove() {
    svg_bubble.remove();
    svg_bars.remove();
    node.remove();
}

/**
 * @name draw
 * @description Draws the whole visualization
 * Not used anymore, kept for debugging purposes
 */
function draw() {
    draw_bar_chart(graph);
    draw_bubble_chart(graph);
}

/**
 * @name draw_bubble_chart
 * @description Draws the Bubble Chart
 * @param graph
 */
function draw_bubble_chart(graph) {

    force = d3.layout.force()
        .linkDistance(50)
        .gravity(gravity)
        .size([width, height])
        .nodes(bubble_values = graph.filter(function(d) {
            return d.freq > freq;
        }))
        .charge(function(d) {
            return -4 * d.freq;
        })
        .on("tick", tick);

    force.start();

    svg_bubble = d3.select("#bubble_chart").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .on("click", function() {
            if(!click_node) {
                //console.log(selected_bar);
                if(selected_node != null && selected_bar == null) {
                    svg_bars.remove();
                    switch (sort) {
                        case "posts":
                            draw_bar_chart(num_posts, sort);
                            break;
                        case "post_length":
                            draw_bar_chart(avg_length, sort);
                            break;
                        case "num_photos":
                            draw_bar_chart(num_media, sort);
                            break;
                        default:
                            break;
                    }
                } else if (selected_node != null && selected_bar != null) {
                    svg_bars.remove();
                    switch (sort) {
                        case "posts":
                            draw_bar_chart(num_posts, sort);
                            break;
                        case "post_length":
                            draw_bar_chart(avg_length, sort);
                            break;
                        case "num_photos":
                            draw_bar_chart(num_media, sort);
                            break;
                        default:
                            break;
                    }
                    bars.filter(function(d) {
                        return d == selected_bar;
                    }).attr("fill", bar_mouse_color);
                }
                if(lock) lock = false;
                mouseout_node();
                selected_node = null;
                if(!d3.event.shiftKey && !d3.event.ctrlKey) {
                    nodesArray = [];
                    excludedNodes = [];
                }
                var data = selectDataList(klass_data);
                draw_list(data);

                //console.log(klass_data);

                if(selected_bar == null && selected_list == null) {

                    if(document.getElementById("slider1").value != 23) {
                        if (!reminder)
                            reminder_popup();
                    }
                    diam = 3.5;
                    gravity = 40 * 0.005;
                    freq = 23;
                    document.getElementById("slider1").value = freq;
                    var span = document.getElementById('slider1-value');
                    while (span.firstChild) {
                        span.removeChild(span.firstChild);
                    }
                    span.appendChild(document.createTextNode(freq));
                    document.getElementById("tittle_bubble").value = "Overall";
                    span = document.getElementById('tittle_bubble');
                    while (span.firstChild) {
                        span.removeChild(span.firstChild);
                    }
                    span.appendChild(document.createTextNode("Overall"));
                    svg_bubble.remove();
                    draw_bubble_chart(words_data);
                    graph_raw = words_data;


                }

            } else {
                //console.log("B");
                click_node = false;
            }
        });

    main = svg_bubble.append("g")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("class", "graph");

    node = main.selectAll(".node_circle")
        .data(force.nodes());

    nodeEnter = fNodeEnter();

    node_title = node.append("svg:title")
        .text(function(d) {
            //console.log(d);
            var array = selectDataBars(d.Term, klass_data);
           return "Number of posts it appears: " + array.length + ", FREQ: " + d.freq;
        });

    node.call(force.drag);

    label = main.selectAll(".node_label")
        .data(force.nodes());

    fLabelEnter();

    label_title = label.append("svg:title")
        .text(function(d) {
            //console.log(d);
            var array = selectDataBars(d.Term, klass_data);
            return "Number of posts it appears: " + array.length;
        });

}

/**
 * @name draw_bar_chart
 * @description Draws the Bar Chart
 * @param graph
 * @param mode
 */
function draw_bar_chart(graph, mode) {

    //window.onload = function() {

    svg_bars = d3.select("#bar_chart").append("svg")
        .attr("width", "100%")
        .attr("height", graph.length * 20 + 50)
        .on("click", function () {
            if (!click_bar) {
                if (lock_bar) lock_bar = false;
                var bar_change = bars.filter(function (d) {
                    return d == selected_bar;
                });
                //console.log(bar_change);
                bar_change.attr("fill", bar_color);
                selected_bar = null;
                var data = selectDataList(klass_data);
                draw_list(data);

                if(selected_node == null) {
                    if(document.getElementById("slider1").value != 23) {
                        if (!reminder)
                            reminder_popup();
                    }
                    diam = 3.5;
                    gravity = 40 * 0.005;
                    freq = 23;
                    document.getElementById("slider1").value = freq;
                    var span = document.getElementById('slider1-value');
                    while (span.firstChild) {
                        span.removeChild(span.firstChild);
                    }
                    span.appendChild(document.createTextNode(freq));
                    document.getElementById("tittle_bubble").value = "Overall";
                    span = document.getElementById('tittle_bubble');
                    while (span.firstChild) {
                        span.removeChild(span.firstChild);
                    }
                    span.appendChild(document.createTextNode("Overall"));
                    svg_bubble.remove();
                    draw_bubble_chart(words_data);
                    graph_raw = words_data;

                }
            } else {
                click_bar = false;
            }
        })
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var w_svg = svg_bars.style("width");
    w_svg = w_svg.substr(0, w_svg.length - 2);
    var max;

    switch (mode) {
        case "posts":
            max = d3.max(graph, function (d) {
                return +d.num_posts;
            });
            //console.log(max);
            bars_data = graph.sort(function (a, b) {
                return +b.num_posts - +a.num_posts;
            });
            bars = svg_bars.selectAll("rect")
                .data(graph.sort(function (a, b) {
                    return +b.num_posts - +a.num_posts;
                }));
            //console.log(graph);
            scale = d3.scale.linear()
                .domain([0, max])
                .range([0, w_svg - 15]);
            break;
        case "post_length":
            max = d3.max(graph, function (d) {
                return +d.avg_length;
            });
            //console.log(max);
            bars_data = graph.sort(function (a, b) {
                return +b.avg_length - +a.avg_length;
            });
            bars = svg_bars.selectAll("rect")
                .data(graph.sort(function (a, b) {
                    return +b.avg_length - +a.avg_length;
                }));
            scale = d3.scale.linear()
                .domain([0, max])
                .range([0, w_svg - 15]);
            break;
        case "num_photos":
            var graph = selectDataImages(graph);
            max = d3.max(graph, function (d) {
                return +d.freq_image;
            });
            //console.log(max);
            bars_data = graph.sort(function (a, b) {
                return +b.freq_image - +a.freq_image;
            });
            bars = svg_bars.selectAll("rect")
                .data(graph.sort(function (a, b) {
                    return +b.freq_image - +a.freq_image;
                }));
            scale = d3.scale.linear()
                .domain([0, max])
                .range([0, w_svg - 15]);
            break;
        case "num_videos":
            max = d3.max(graph, function (d) {
                return +d.freq_video;
            });
            //console.log(max);
            bars_data = graph.sort(function (a, b) {
                return +b.freq_video - +a.freq_video;
            });
            bars = svg_bars.selectAll("rect")
                .data(graph.sort(function (a, b) {
                    return +b.freq_video - +a.freq_video;
                }));
            scale = d3.scale.linear()
                .domain([0, max])
                .range([0, w_svg - 15]);
            break;
        default :
            return resul(d.freq);
    }

    fBarsEnter(mode);

    label_bars = svg_bars.selectAll("text")
        .data(graph)
        .enter()
        .append("text")
        .attr("fill", bar_label_color)
        .attr("class", "label")
        .attr("y", function (d, i) {
            return i * 20 + 14;
        })
        .attr("x", 5)
        .on("mouseover", function () {
            if (!lock_bar) {
                d3.select(this)
                    .attr("fill", bar_label_mouse_color);
                //mouseover_bar(d);
            }
        })
        .on("mouseout", function () {
            if (!lock_bar) {
                d3.select(this)
                    .attr("fill", bar_label_color);
            }
            //mouseout_bar(d);
        })
        .on("click", function (d, i) {

            if (selected_bar != null && selected_bar != d) {
                var bar_change = bars.filter(function (d) {
                    return d == selected_bar;
                });
                bar_change.attr("fill", bar_color);
                selected_bar = d;
                lock_bar = true;
                click_bar = true;
                var this_bar = bars.filter(function (d) {
                    return d == selected_bar;
                });
                this_bar.attr("fill", bar_mouse_color);
            } else {
                lock_bar = lock_bar ? false : true;
                click_bar = true;
            }
            selected_bar = d;
            var this_bar = bars.filter(function (d) {
                return d == selected_bar;
            });
            this_bar.attr("fill", bar_mouse_color);
            mouseclick_bar(d);
            d3.select(this)
                .attr("fill", bar_label_color);
        })
        .attr("transform", "translate(5," + margin.top + ")")
        .text(function (d) {
            //return d.Term;
            //console.log(d);
            switch (mode) {
                case "posts":
                    return extractTitleURL(d.URL);
                    break;
                case "post_length":
                    return extractTitleURL(d.url);
                    break;
                case "num_photos":
                    return extractTitleURL(d.url);
                    break;
                case "num_videos":
                    return extractTitleURL(d.url);
                    break;
                default :
                    return resul(d.URL);
            }
            //return d.URL;
        });

    var xAxis = d3.svg.axis()
        .orient("top")
        .scale(scale);

    svg_bars.append("g")
        .attr("class", "xaxis")   // give it a class so it can be used to select only xaxis labels  below
        .attr("transform", "translate(5," + margin.top + ")")
        .call(xAxis);

}

/**
 * @name draw_list
 * @description Draws/writes the list with the posts links
 * @param data
 */
function draw_list(data) {

    //console.log(data);
    if(svg_list) svg_list.remove();

    if(data == "[]") return;
    //console.log(data);

    svg_list = d3.select("#list").append("svg")
        .attr("width", "100%")
        .attr("height", data.length * 20 + 50)
        .on("click", function() {
            if(!click_list) {
                if(lock_list) lock_list = false;
                var list_change = bars_list.filter(function(d) {
                    return d == selected_list;
                });
                list_change.attr("fill", bar_list_color);
                selected_list = null;

                console.log(selected_bar);
                if(selected_bar != null) {

                }
                //mouseclick_bar(selected_bar);
            } else {
                click_list = false;
            }
        })
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var w_svg_list = svg_list.style("width");
    w_svg_list = w_svg_list.substr(0, w_svg_list.length - 2);
    var max = d3.max(data, function(d) {
        return +d.freq;
    });
    //console.log(max);

    bars_list = svg_list.selectAll("rect")
        .data(data.sort(function(a,b) { return +b.freq - +a.freq; }));

    var xscale = d3.scale.linear()
        .domain([0, max])
        .range([w_svg_list - 15, 20]);

    var xscale2 = d3.scale.linear()
        .domain([0, max])
        .range([20, w_svg_list - 15]);

    fBarListEnter(w_svg_list, xscale2);

    label_list = svg_list.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("fill", label_list_color)
        .attr("class", "label")
        .attr("y", function (d, i) {
            return i * 20 + 14;
        })
        .text(function (d) {
            return extractTitlePost(d.post_url);
        })
        .on("click", function(d, i) {
            if(selected_list != null && selected_list != d) {
                var bar_list_change = bars_list.filter(function(d) {
                    return d == selected_list;
                });
                bar_list_change.attr("fill", bar_list_color);
                selected_list = d;
                lock_list = true;
                click_list = true;
                var this_list = bars_list.filter(function(d) {
                    return d == selected_list;
                });
                this_list.attr("fill", bar_mouse_color);
            } else {
                lock_list = lock_list ? false : true;
                click_list = true;
            }
            selected_list = d;
            var this_list = bars_list.filter(function(d) {
                return d == selected_list;
            });
            this_list.attr("fill", bar_mouse_color);
            mouseclick_list(d);
            d3.select(this)
                .attr("fill", label_list_color);
        })
        .on("dblclick", function(d) { window.open(d.post_url); })
        .attr("transform", "translate(-15," + margin.top + ")")
        .attr("x", function(d) {
            var w_svg_list = svg_list.style("width");
            w_svg_list = w_svg_list.substr(0, w_svg_list.length-2);
            return w_svg_list - this.getComputedTextLength() - 5;
        });

    var xAxis = d3.svg.axis()
        //.attr("class", "axis-text")
        .orient("top")
        .scale(xscale);

    svg_list.append("g")
        .attr("class", "xaxis")   // give it a class so it can be used to select only xaxis labels  below
        .attr("transform", "translate(0," + margin.top + ")")
        .call(xAxis);

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
            return d.freq >= freq;
        }))
        .charge(function (d) {
            return -40 * Math.sqrt(d.freq);
            //return -freq * d.freq;
            //return -20 * d.freq;
        });


    node = node.data(force.nodes())
        .style("fill", function(d) { return kind_to_color(d) });

    nodeEnter = fNodeEnter();

    node_title = node.append("svg:title")
        .text(function(d) {
            //console.log(d);
            var array = selectDataBars(d.Term, klass_data);
            return "Number of posts it appears: " + array.length + ", FREQ: " + d.freq;
        });

    node.transition()
        .duration(500);

    node.exit()
        .transition()
        .attr("r", 0)
        .duration(500)
        .remove();

    //node.transition()
    //    .attr("class", "node_circle");

    node.call(force.drag);

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
            selected_node = d;
            var node_change = node.filter(function(d) {
                return d == selected_node;
            });
            node_change
                .style("stroke", node_selected_color)
                .style("stroke-width", 5);
                //.style("fill", node_selected_color);
            lock = lock ? false : true;
            click_node = true;
            mouseclick_node(d);
            d3.select(this)
                //.style("fill", "red")
                .attr("class", "selected_node");
        })
        .text(function (d) {
            return d.Term;
        });

    label_title = label.append("svg:title")
        .text(function(d) {
            //console.log(d);
            var array = selectDataBars(d.Term, klass_data);
            return "Number of posts it appears: " + array.length;
        });

    label.exit()
        .transition()
        .duration(500)
        .remove();

    force.start();

}

/**
 * @name change_gravity
 * @description Updates the bubble chart applying the new gravity property
 * @param slider2
 * Not used anymore, kept for improvement purposes
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

    freq = 23;

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

    document.getElementById("select").value = "posts";

    diam = 3.5;
    gravity = 40 * 0.005;
    selected_bar = null;
    selected_node = null;
    selected_list = null;

    lock_bar = false;
    remove();
    draw_bubble_chart(words_data);
    sort = "posts";
    graph_raw = words_data;
    draw_bar_chart(num_posts, sort);
    if(svg_list) svg_list.remove();

    //alert("Selected bar: " + selected_bar + "\nSelected node: " + selected_node + "\nSelected list: " + selected_list);

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
function selectDataList(d) {
    var array = [];
    var resul = [];
    var kk = 0;
    var zz = 0;
    var Term = "";
    var Url = "";
    //console.log("node: " + selected_node + ", bar: " + selected_bar);

    if(selected_node != null && selected_bar != null) {
        //console.log("BOTH");

        Term = selected_node.Term;
        for(var jj = 0; jj < d.length; jj++) {
            if(d[jj].Term == Term) {
                //console.log(d[jj]);
                array[kk] = d[jj];
                kk++;
            }
        }

        switch(sort) {
            case "posts":
                Url = selected_bar.URL;
                break;
            default :
                Url = selected_bar.url;
                break;
        }

        //console.log(selected_bar);
        for(var ii = 0; ii < array.length; ii++) {
            if(array[ii].klass_url == Url) {
                resul[zz] = array[ii];
                //console.log("AAA");
                zz++;
            }
        }
        return resul;

    } else if(selected_node != null) {

        //console.log("NODE");
        //console.log(selected_node.Term);
        Term = selected_node.Term;
        for(var jj = 0; jj < d.length; jj++) {
            if(d[jj].Term == Term) {
                //console.log(d[jj]);
                array[kk] = d[jj];
                kk++;
            }
        }
        return array;

    } else if(selected_bar != null) {

        var vv = 0;

        switch(sort) {
            case "posts":
                Url = selected_bar.URL;
                break;
            default :
                Url = selected_bar.url;
                //console.log(Url);
                break;
        }


        for(var hh = 0; hh < d.length; hh++) {
            var exists = false;
            if(d[hh].klass_url == Url) {
                for(var abc = 0; abc < array.length; abc++) {
                    if(array[abc].post_url == d[hh].post_url) {
                        exists = true;
                    }
                }
                if(!exists) {
                    //console.log(d[hh]);
                    array[vv] = d[hh];
                    vv++;
                }
            }
        }



    } else {
        //console.log("NTH");

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

    // Get all the klass_urls where the Term appear (there will be duplicated urls)
    for (var jj = 0; jj < d.length; jj++) {

        if (d[jj].Term == Term) {
            //console.log(d[jj].klass_url);
            array[kk] = d[jj].klass_url;
            kk++;
        }
    }
    kk = 0;
    var ii = 0;
    var x = false;
    //console.log(array.length);

    // array contains a list of the Terms and the URL where they appear
    // now we have to group those URLs (when more than one word appear in the same URL)
    for (jj = 0; jj < array.length; jj++) {

        switch(sort) {
            case "posts":
                //console.log(num_posts.length);
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
                //console.log(avg_length.length);
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
            case "num_photos":
                //console.log(media.length);
                // loop all the media file
                for (kk = 0; kk < num_media.length; kk++) {
                    // Check if it's the same url
                    if (array[jj] == num_media[kk].url) {
                        // Loop all the resul array
                        for(var xx = 0; xx < resul.length; xx++) {
                            // Check if it's already added
                            if (resul[xx].url == num_media[kk].url) {
                                x = true;
                            }
                        }
                        // If it's not added, add it
                        if(!x) {
                            resul[ii] = num_media[kk];
                            //console.log(num_media[kk]);
                            ii++;
                        }
                    }
                }
                //console.log(resul.length);
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

function selectDataImages(data) {
    var length_data = data.length;
    var kk = 0;
    var jj = 0;
    var ii = 0;
    var array = [];
    for(kk=0; kk<length_data; kk++) {
        var found = false;
        for(jj=0; jj<array.length; jj++) {


            if(data[kk].url == array[jj].url) {

                //console.log("SUM: " + array[jj].freq_image + " + " + data[kk].freq_image);
                found = jj;
                array[jj].freq_image = parseInt(array[jj].freq_image) + parseInt(data[kk].freq_image);


            }
        }
        if(!found) {
            //console.log("ADD NEW: " + data[kk]);
            array[ii] = data[kk];
            ii++;
        }

    }
    //console.log(array);
    return array;
}

/**
 * @name selectDataBubbles
 * @description Filters the bubbles that will be shown depending on the selected URL in the bar chart
 * @param url
 * @param data
 * @returns {Array}
 */
function selectDataBubbles(url, data) {
    var array = [];
    var hist = [];
    var final = [];
    var kk = 0;

    array = data.filter(function(d) {
        return d.klass_url == url;
    });

    array.map(function(a) {
       if(a.Term in hist) {
           hist[a.Term] += parseInt(a.freq);
       } else {
           hist[a.Term] = parseInt(a.freq);
       }
    });

    //console.log(hist);

    for (var k in hist){
        if (hist.hasOwnProperty(k)) {
            var aux = {};
            aux.Term = k;
            aux.freq = hist[k];
            final.push(aux);
            //console.log("Key is " + k + ", value is " + hist[k]);
        }
    }

    //console.log(final);


    //// Loop to read the klass_data file (data)
    //for(var jj = 0; jj < data.length; jj++) {
    //
    //    if(data[jj].klass_url == url) {
    //
    //        aux = array.filter(function(d) {
    //            //console.log(d);
    //            return d.Term == data[jj].Term;
    //        });
    //        //console.log(aux);
    //        if(aux.length > 0) {
    //
    //            //aux[0].freq = parseInt(aux[0].freq) + parseInt(data[jj].freq);
    //        } else {
    //            array.push(data[jj]);
    //
    //            //console.log(data[jj]);
    //            //array[kk] = copy_data[jj];
    //            //kk++;
    //
    //        }
    //    }
    //}

    return final;
}

function selectDataBubbles2(url, data) {
    var array = [];
    var kk = 0;
    for(var jj = 0; jj < data.length; jj++) {
        if(data[jj].post_url == url) {

            var aux = array.filter(function(d) {
                return d.Term == data[jj].Term;
            });

            if(aux.length > 0) {
                aux[0].freq = parseInt(aux[0].freq) + parseInt(data[jj].freq);
            } else {

                array[kk] = data[jj];
                kk++;

            }
        }
    }
    //console.log(array);
    return array;
}

/**
 * @name kind_to_color
 * @description Codifies some information in the color
 * @param d
 * @returns {*}
 */
function kind_to_color(d) {
    //console.log(d);

    var array = selectDataBars(d.Term, klass_data);
    //console.log(array.length);
    var resul = d3.scale.linear()
        .domain([10, 50])
        .range([node_low_color, node_high_color]);
    return resul(array.length);
    //return node_color;  // COLOUR
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
        if(document.getElementById("slider1").value != 23) {
            if (!reminder)
                reminder_popup();
        }
        reset();

    });

    // Dropdown list
    d3.select("select").on("change", function(d) {
        sort = this.value;
        switch (sort) {
                case "posts":
                    graph = num_posts;

                    remove_carousel();
                    //console.log(graph);
                    break;
                case "post_length":
                    graph = avg_length;
                    //console.log(graph);
                    break;
                case "num_photos":
                    graph = num_media;

                    bubble_div = d3.select('#bubble_chart');

                    //d3.select('#bubble_chart')
                    append_carousel();

                    //console.log(graph);
                    break;
                case "num_videos":
                    graph = num_media;
                    //console.log(graph);
                    break;
                default :
                    return resul(d.URL);
            }
        svg_bars.remove();

        if(selected_node != null) {

            //console.log(selected_node);
            graph = selectDataBars(selected_node.Term, klass_data);
            draw_bar_chart(graph, sort);

        } else {

            draw_bar_chart(graph, sort);

        }

        if(selected_list != null) {

            //console.log(selected_list);
            var bar_change = bars.filter(function(d) {
                //console.log(d);
                switch(sort) {
                    case "posts":
                        return selected_list.klass_url == d.URL;
                    default:
                        return selected_list.klass_url == d.url;

                }
                //return selected_list.klass_url == d.URL;
            });
            bar_change.attr("fill", bar_mouse_color);
            //selected_bar = bar_change;

            var aux = null;
            bar_change.text(function(d) {
                aux = d;
            });
            selected_bar = aux;
            //console.log(aux);
            lock_bar = true;
            click_bar = true;
        }

        if(selected_bar != null) {
            var new_bar = bars.filter(function(d) {
                return d.Id == selected_bar.Id;
            });

            new_bar.attr("fill", bar_mouse_color);
            selected_bar = new_bar[0][0]["__data__"];
        }

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
            .style("stroke", node_selected_color)
            .style("fill", function(d) { return kind_to_color(d) });
            //.style("fill", node_color);  // COLOUR

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
            .style("stroke-width", 0)
            .style("fill", function(d) { return kind_to_color(d) });
            //.style("fill", node_color);  // COLOUR
        label
            .attr("font-size", 12)
            .style("fill-opacity", 1);
    }
}

function mouseout_bar() {
    if(!lock) {
        label_bars
            .style("fill", bar_label_color);
    }
}

function mouseclick_node(z) {

    //var data = selectDataList(klass_data);
    //console.log(data);
    var data = fSelectDataList();

    svg_bars.remove();
    draw_list(data);

    //console.log(z);
    //posts_fil = selectDataBars(z.Term, klass_data);

    posts_fil = fSelectDataBars();

    //console.log(posts_fil);
    draw_bar_chart(posts_fil, sort);

    if(selected_bar != null) {
        //console.log(selected_bar);
        var bar_change = bars.filter(function(d) {
            //console.log("d: " + d);
            switch(sort) {
                case "posts":
                    return d.URL == selected_bar.URL;
                default:
                    return d.url == selected_bar.url;
            }
        });

        bar_change.attr("fill", bar_mouse_color);

    }

}

function mouseclick_bar(z) {

    var array;
    var span;

    switch(sort) {
        case "posts":
            //console.log(z.URL);
            array = selectDataBubbles(z.URL, klass_data);

            document.getElementById("tittle_bubble").value = z.URL;
            span = document.getElementById('tittle_bubble');
            while( span.firstChild ) {
                span.removeChild( span.firstChild );
            }
            span.appendChild( document.createTextNode(z.URL) );

            break;
        case "post_length":
            //console.log(z.url);
            array = selectDataBubbles(z.url, klass_data);

            document.getElementById("tittle_bubble").value = z.url;
            span = document.getElementById('tittle_bubble');
            while( span.firstChild ) {
                span.removeChild( span.firstChild );
            }
            span.appendChild( document.createTextNode(z.url) );

            break;
        case "num_photos":
            array = selectDataBubbles(z.url, klass_data);

            document.getElementById("tittle_bubble").value = z.url;
            span = document.getElementById('tittle_bubble');
            while( span.firstChild ) {
                span.removeChild( span.firstChild );
            }
            span.appendChild( document.createTextNode(z.url) );
            break;
        case "num_videos":
            break;
        default:
            array = selectDataBubbles(z.URL, klass_data);
            break;
    }

    if(document.getElementById("slider1").value > 1) {
        //alert(reminder);
        if(!reminder)
            reminder_popup();
        //alert("The minimum frequency of the words that are shown is changed to 1.");
    }
    freq = 1;
    document.getElementById("slider1").value = freq;
    span = document.getElementById('slider1-value');
    while( span.firstChild ) {
        span.removeChild( span.firstChild );
    }
    span.appendChild( document.createTextNode("1") );

    force.nodes(array.filter(function (d) {
            return d.freq >= freq;
        }))
            .charge(function (d) {
                return -20 * d.freq;
            });

    node = node.data(force.nodes())
        .style("fill", function(d) { return kind_to_color(d) });

    nodeEnter = fNodeEnter();

    node_title = node.append("svg:title")
        .text(function(d) {
            var array = selectDataBars(d.Term, klass_data);
            return "Number of posts it appears: " + array.length;
        });

    fNodeExit();

    node.call(force.drag);

    label = label.data(force.nodes())
        .text(function (d) {
            return d.Term;
        });

    fLabelEnter();

    label_title = label.append("svg:title")
        .text(function(d) {
            var array = selectDataBars(d.Term, klass_data);
            return "Number of posts it appears: " + array.length;
        });

    fLabelExit();

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

    if(selected_node) {
        //console.log(selected_node);
        var node_change = node.filter(function(d) {
            return d.Term == selected_node.Term;
        });
        //console.log("FOUND: " + node_change);
        node_change
            .style("stroke", node_selected_color)
            .style("stroke-width", 5);
            //.style("fill", node_selected_color);


        var label_change = label.filter(function(d) {
            return d.Term == selected_node.Term;
        });
        var label_nochange = label.filter(function(d) {
            return d.Term != selected_node.Term;
        });
        label_change.attr("font-size", 16)
            .style("fill-opacity", 1);
        label_nochange.style("fill-opacity", 0.2);

    }

    var data = selectDataList(klass_data);
    draw_list(data);

}

function mouseclick_list(z) {

    var array = selectDataBubbles2(z.post_url, klass_data);
    if(document.getElementById("slider1").value > 1) {
        //alert(reminder);
        if(!reminder)
            reminder_popup();
        //alert("The minimum frequency of the words that are shown is changed to 1.");
    }
    freq = 1;
    document.getElementById("slider1").value = freq;
    span = document.getElementById('slider1-value');
    while( span.firstChild ) {
        span.removeChild( span.firstChild );
    }
    span.appendChild( document.createTextNode("1") );

    force.nodes(array.filter(function (d) {
        return d.freq >= freq;
    }))
        .charge(function (d) {
            return -35 * d.freq;
        });

    node = node.data(force.nodes())
        .style("fill", function(d) { return kind_to_color(d) });

    nodeEnter = fNodeEnter();

    node_title = node.append("svg:title")
        .text(function(d) {
            var array = selectDataBars(d.Term, klass_data);
            return "Number of posts it appears: " + array.length;
        });

    fNodeExit();

    node.call(force.drag);

    label = label.data(force.nodes())
        .text(function (d) {
            return d.Term;
        });

    fLabelEnter();

    label_title = label.append("svg:title")
        .text(function(d) {
            var array = selectDataBars(d.Term, klass_data);
            return "Number of posts it appears: " + array.length;
        });

    fLabelExit();

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

    if(selected_node) {
        //console.log(selected_node);
        var node_change = node.filter(function(d) {
            return d.Term == selected_node.Term;
        });
        //console.log("FOUND: " + node_change);
        node_change
            .style("stroke", node_selected_color)
            .style("stroke-width", 5);
            //.style("fill", node_selected_color);


        var label_change = label.filter(function(d) {
            return d.Term == selected_node.Term;
        });
        var label_nochange = label.filter(function(d) {
            return d.Term != selected_node.Term;
        });
        label_change.attr("font-size", 16)
            .style("fill-opacity", 1);
        label_nochange.style("fill-opacity", 0.2);

    }

    if(selected_bar == null) {
        //console.log(selected_list);
        var bar_change = bars.filter(function(d) {
            //console.log(d);
            switch(sort) {
                case "posts":
                    return selected_list.klass_url == d.URL;
                default:
                    return selected_list.klass_url == d.url;

            }
        });
        bar_change.attr("fill", bar_mouse_color);
        selected_bar = bar_change;
        lock_bar = true;
        click_bar = true;
        console.log(bar_change);
    } //

}


function append_carousel() {
    bubble_div
        .transition()
        //.delay(0)
        .duration(1000)
        .style('height', '70%');

    svg_bubble.transition()
        .attr("height", "107%")
        .style("margin-top", "-5%");

    image_div = d3.select('#main')
        .append('div')
        //.transition()
        //.delay(1500)
        //.duration(5000)
        .attr("class", "container")
        .attr("id", "image-carousel");

    var carousel = d3.select("#image-carousel");

    var photos = allImages();
    console.log(photos);

    for(var jj = 0; jj < photos.length; jj++) {
        carousel.append('img')
            .attr("src", photos[jj])
            //.attr("height", "85px")
            .style('margin', '0px 3px 0px 3px')
            .on("click", function(d) {
                d3.select(this)
                    .style("stroke", node_selected_color)
                    .style("stroke-width", 5);
            })
            //.on('dbclick', window.open(photos[jj]))
            .attr("class", "img");
    }

    $('#image-carousel').slick({
        //arrows: false,
        //dots: true,
        centerMode: true,
        lazyLoad: 'ondemand',
        infinite: true,
        slidesToShow: 7,
        slidesToScroll: 3
    });
    //carousel();

    var stHeight = $('#image-carousel').height();
    $('.slick-slide')
        .css('height',stHeight - 55 + 'px' )
        .on("click", function() {
            context_menu();
        });

}

function remove_carousel() {
    if(bubble_div) {
        bubble_div
            .transition()
            .delay(500)
            .duration(1000)
            .style("height", "88%");

        svg_bubble.transition()
            .attr("height", "100%")
            .style("margin-top", "0%");
    }

    if(image_div) {
        image_div.transition()
            .delay(0)
            .duration(500)
            .remove();
    }
}

function extractTitlePost(post) {
    var array = post.split("/");
    var l = array.length;

    return array[l-2];
}

function extractTitleURL(url) {
    var pos1;
    if(url.indexOf("www") == -1) {
        pos1 = url.indexOf("//") + 2;
    } else {
        pos1 = url.indexOf("www") + 4;
    }
    url = url.substr(pos1);
    var pos2 = url.indexOf(".");
    url = url.substr(0, pos2);

    return url;
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

function allImages() {
    var count = 0;
    var array = [];
    for(var kk = 0; kk < media.length; kk++) {
        if(media[kk].Type == "IMAGE") {
            array.push(media[kk].Media_URL);
            count++;
            if(count > 15) return array;
        }
    }
    return array;
}

function reminder_popup() {
    //if(reminder) {
        $(function () {
            $("#dialog").dialog({
                create: function (e, ui) {
                    var pane = $(this).dialog("widget").find(".ui-dialog-buttonpane")
                    $("<label class='shut-up' ><input  type='checkbox'/> Remember my selection</label>").prependTo(pane)
                },
                buttons: {
                    "OK": function () {
                        $(this).dialog('close');
                        //callback(true);
                    }
                }
            });
        });
    //}
    $(document).on("change", ".shut-up input", function () {
        //alert("shut up! " + this.checked);
        reminder = true;
        //if(this.checked() == true) {
        //    reminder = true;
        //}
    })
}

function context_menu() {
    var tooltip = d3.select(this)
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");
    return tooltip.style("visibility", "visible");
}