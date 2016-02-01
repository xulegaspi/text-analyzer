/**
 * Created by Xurxo on 29/01/2016.
 */

function fNodeEnter() {
    var nodeEnter = node.enter()
        .append("circle")
        .attr("class", "node_circle")
        .attr("r", function (d) {
            return diam * Math.sqrt(d.freq);
        })
        .style("fill", function(d) {
            return kind_to_color(d);
        })
        .on("mouseover", function (d) {
            mouseover_node(d);
        })
        .on("mouseout", function (d) {
            mouseout_node(d);
        })
        .on("contextmenu", function(d) {
            alert(d.Term);
            d3.event.preventDefault();
        })
        .on("click", function (d) {

            if(d3.event.shiftKey) {
                console.log(d);
            }
            fSelectNode(d, this);

            selected_node = d;
            mouseclick_node(d);
            d3.select(this)
                .style("stroke", node_selected_color)
                .style("stroke-width", 5);
            //.style("fill", node_selected_color);
        });

    return nodeEnter;
}

function fNodeExit() {
    node.exit()
        .transition()
        .attr("r", 0)
        .duration(500)
        .remove();
}

function fLabelEnter() {
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
            var node_change;

            if(selected_node != null && selected_node != d) {
                node_change = node.filter(function(d) {
                    return d == selected_node;
                });
                //console.log(node_change);
                node_change.style("fill", function(d) {
                    return kind_to_color(d);
                });
                var label_change = label.filter(function(d) {
                    return d == selected_node;
                });
                label_change.style("fill-opacity", 0.2)
                    .attr("font-size", 12);
                selected_node = d;
                label.filter(function(d) {
                    return d == selected_node;
                }).style("fill-opacity", 1)
                    .attr("font-size", 16);
                lock = true;
                click_node = true;
                node_change = node.filter(function(d) {
                    return d == selected_node;
                });
                node_change
                    .style("stroke", node_selected_color)
                    .style("stroke-width", 5);
                //.style("fill", node_selected_color);
            } else {
                lock = lock ? false : true;
                click_node = true;
            }

            selected_node = d;
            mouseclick_node(d);
            node_change = node.filter(function(d) {
                return d == selected_node;
            });
            node_change
                .style("stroke", node_selected_color)
                .style("stroke-width", 5);
            //.style("fill", node_selected_color);
        })
        .text(function (d) {
            return d.Term;
        });
}

function fLabelExit() {
    label.exit()
        .transition()
        .duration(500)
        .remove();
}

function fBarsEnter(mode) {
    bars.enter()
        .append("rect")
        .attr("height", 18)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .attr("width", function (d, i) {
            switch (mode) {
                case "posts":
                    return scale(d.num_posts);
                    break;
                case "post_length":
                    return scale(d.avg_length);
                    break;
                case "num_photos":
                    return scale(d.freq_image);
                    break;
                case "num_videos":
                    return scale(d.freq_video);
                    break;
                default :
                    return scale(d.freq);
            }
        })
        .on("mouseover", function () {
            if (!lock_bar) {
                d3.select(this)
                    .attr("fill", bar_mouse_color);
            }// COLOUR
            //mouseover_bar(d);
        })
        .on("mouseout", function () {
            if (!lock_bar) {
                d3.select(this)
                    .attr("fill", bar_color);
            }// COLOUR
            //mouseout_bar(d);
        })
        .on("click", function (d) {
            //console.log(d);
            if (selected_bar != null && selected_bar != d) {
                var bar_change = bars.filter(function (d) {
                    return d == selected_bar;
                });
                bar_change.attr("fill", bar_color);
                selected_bar = d;
                lock_bar = true;
                click_bar = true;
                d3.select(this)
                    .attr("fill", bar_mouse_color);
            } else {
                lock_bar = lock_bar ? false : true;
                click_bar = true;
            }
            selected_bar = d;
            mouseclick_bar(d);
            d3.select(this)
                .attr("fill", bar_mouse_color);
        })
        .on("dblclick", function (d) {
            switch (sort) {
                case "posts":
                    window.open(d.URL);
                    break;
                default :
                    window.open(d.url);
            }
        })
        .attr("transform", "translate(5," + margin.top + ")")
        .attr("fill", bar_color);  // COLOUR
}

function fBarListEnter(w_svg_list, xscale2) {
    bars_list.enter()
        .append("rect")
        .attr("height", 18)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .attr("x", function(d) {
            return w_svg_list - xscale2(d.freq) + 20;
            //return 0;
        })
        .attr("width", function (d, i) {
            return xscale2(d.freq) - 20;
        })
        .on("click", function(d) {
            if(selected_list != null && selected_list != d) {
                var bar_list_change = bars_list.filter(function(d) {
                    return d == selected_list;
                });
                bar_list_change.attr("fill", bar_list_color);
                selected_list = d;
                lock_list = true;
                click_list = true;
                d3.select(this)
                    .attr("fill", bar_mouse_color);
            } else {
                lock_list = lock_list ? false : true;
                click_list = true;
            }
            selected_list = d;
            d3.select(this)
                .attr("fill", bar_mouse_color);
            mouseclick_list(d);

        })
        .on("dblclick", function(d) { window.open(d.post_url); })
        .attr("transform", "translate(-15," + margin.top + ")")
        .attr("fill", bar_list_color);  // COLOUR
}

function fUnselectNodes(d) {

}

function fSelectNode(d, thisNode) {
    if(selected_node != null && selected_node != d) {
        var node_change = node.filter(function(d) {
            return d == selected_node;
        });
        //console.log(node_change);
        node_change.style("fill", function(d) {
            return kind_to_color(d);
        });
        var label_change = label.filter(function(d) {
            return d == selected_node;
        });
        label_change.style("fill-opacity", 0.2)
            .attr("font-size", 12);
        selected_node = d;
        label.filter(function(d) {
            return d == selected_node;
        }).style("fill-opacity", 1)
            .attr("font-size", 16);
        lock = true;
        click_node = true;
        d3.select(thisNode)
            .style("stroke", node_selected_color)
            .style("stroke-width", 5);
        //.attr("fill", node_selected_color);
    } else {
        lock = lock ? false : true;
        click_node = true;
    }
}