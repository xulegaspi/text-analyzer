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
            //alert(d.Term);
            d3.event.preventDefault();
        })
        .on("click", function (d) {
            console.log(this);
            if(!d3.event.shiftKey && !d3.event.ctrlKey) {
                nodesArray = [];
                excludedNodes = [];
                nodesArray.push(d);
            }
            if(d3.event.shiftKey) {
                if(nodesArray.indexOf(d) == -1)
                    nodesArray.push(d);
                console.log(nodesArray);
            }
            if(d3.event.ctrlKey) {
                var indexD = excludedNodes.indexOf(d);
                if(indexD == -1)
                    excludedNodes.push(d);
                console.log(excludedNodes);
            }

            if(d3.event.ctrlKey) {
                fExcludeNode(d, this);
                d3.select(this)
                    .style("stroke", node_excluded_color)
                    .style("stroke-width", 5);
            } else {
                fSelectNode(d, this);
            }

            if(!d3.event.shiftKey && !d3.event.ctrlKey)
                fUnselectNodes(d);

            selected_node = d;

            //if(!d3.event.ctrlKey)
            mouseclick_node(d);

            //d3.select(this)
            //    .style("stroke", node_selected_color)
            //    .style("stroke-width", 5);
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
            selected_node = d;
            var node_change = node.filter(function(d) {
                //console.log(this);
                return d == selected_node;
                //return d == this;
            });
            var aux = node_change[0];
            node_change = aux[0];
            console.log(node_change);

            if(!d3.event.shiftKey && !d3.event.ctrlKey) {
                nodesArray = [];
                excludedNodes = [];
                nodesArray.push(d);
            }
            if(d3.event.shiftKey) {
                if(nodesArray.indexOf(d) == -1)
                    nodesArray.push(d);
                console.log(nodesArray);
            }
            if(d3.event.ctrlKey) {
                var indexD = excludedNodes.indexOf(d);
                if(indexD == -1)
                    excludedNodes.push(d);
                console.log(excludedNodes);
            }

            if(d3.event.ctrlKey) {
                fExcludeNode(d, node_change);


                d3.select(node_change)
                    .style("stroke", node_excluded_color)
                    .style("stroke-width", 5);
            } else {
                fSelectNode(d, node_change);
            }

            if(!d3.event.shiftKey && !d3.event.ctrlKey)
                fUnselectNodes(d);


            mouseclick_node(d);


            //if(!d3.event.shiftKey) {
            //    nodesArray = [];
            //    nodesArray.push(d);
            //}
            //if(d3.event.shiftKey) {
            //    if(nodesArray.indexOf(d) == -1)
            //        nodesArray.push(d);
            //    console.log(nodesArray);
            //}
            //if(d3.event.ctrlKey) {
            //    var indexD = nodesArray.indexOf(d);
            //    if(indexD != -1)
            //        nodesArray.splice(indexD, 1);
            //    console.log(nodesArray);
            //}
            //
            //selected_node = d;
            //mouseclick_node(d);
            //
            //
            //fSelectNode(d, node_change);
            //if(!d3.event.shiftKey)
            //    fUnselectNodes(d);
            //
            //node_change
            //    .style("stroke", node_selected_color)
            //    .style("stroke-width", 5);
            ////.style("fill", node_selected_color);
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
    var neighbors = {};
    neighbors[d.index] = true;

    node.filter(function(d) {
        return !neighbors[d.index];
    })
        .style("stroke-width", 0);

    label.filter(function (d) {
        return !neighbors[d.index]
    })
        .style("fill-opacity", 0.2);
    label.filter(function (d) {
        return neighbors[d.index]
    })
        .attr("font-size", 16);
}

function fSelectNode(d, thisNode) {
    if(selected_node != null && selected_node != d) {
        var node_change = node.filter(function(d) {
            return d == selected_node;
        });
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

function fExcludeNode(d, thisNode) {

    //d3.select(thisNode)
    //    .style("stroke", node_excluded_color)
    //    .style("stroke-width", 5);

    if(selected_node != null && selected_node != d) {
        var node_change = node.filter(function(d) {
            return d == selected_node;
        });
        selected_node = d;
        label.filter(function(d) {
            return d == selected_node;
        }).style("fill-opacity", 1)
            .attr("font-size", 16);
        lock = true;
        click_node = true;
        d3.select(thisNode)
            .style("stroke", node_excluded_color)
            .style("stroke-width", 5);
        //.attr("fill", node_selected_color);
    } else {
        lock = lock ? false : true;
        click_node = true;
    }
}

function fSelectDataBars() {
    var exclusion = [];
    var array = [];
    var array_aux = [];
    var resul = [];
    var kk = 0;

    exclusion = fExclusionArray();
    //console.log(exclusion);

    //console.log(nodesArray);
    // Check all the selected nodes/keywords
    for(var zz = 0; zz < nodesArray.length; zz++) {
        array_aux = [];
        // Check in all the klass_data where the Term match
        for (var jj = 0; jj < klass_data.length; jj++) {
            if (klass_data[jj].Term == nodesArray[zz].Term) {
                //Check if it's excluded
                if(exclusion != "[]" && exclusion.indexOf(klass_data[jj].klass_url) == -1) {
                    // Check if the URL also include previous selections so that it includes all the selected words
                    if (zz > 0) {
                        var indexAux = array[zz - 1].indexOf(klass_data[jj].klass_url);
                        // TODO: exclude if in other array

                        if (indexAux != -1) {
                            //console.log(array[zz-1][indexAux] + " --> " + klass_data[jj].klass_url);
                            array_aux.push(klass_data[jj].klass_url);
                        }
                    } else { // If no previous selections, just add the URL
                        array_aux.push(klass_data[jj].klass_url);
                    }
                }
            }
        }
        //console.log(array_aux);
        array.push(array_aux);
    }

    //console.log(array);

    var refined_array = [];

    var newArray = array[nodesArray.length - 1];

    //console.log(newArray);

    for (var zz = 0; zz < newArray.length; zz++) {
        if (refined_array.indexOf(newArray[zz]) == -1) {
            refined_array.push(newArray[zz]);
        }
    }

    console.log("Number of webs: " + refined_array.length);
    //console.log(refined_array);

    //console.log(num_posts);

    var resul = fSortDataBars(refined_array);
    return resul;

}

function fSortDataBars(array) {
    var resul = [];
    switch(sort) {
        case "posts":
            for(var kk = 0; kk < num_posts.length; kk++) {
                for(var zz = 0; zz < array.length; zz++) {
                    if(num_posts[kk].URL == array[zz])
                        resul.push(num_posts[kk]);
                }
            }
            //console.log(resul);
            break;
        case "post_length":
            for(var kk = 0; kk < avg_length.length; kk++) {
                for(var zz = 0; zz < array.length; zz++) {
                    if(avg_length[kk].url == array[zz])
                        resul.push(avg_length[kk]);
                }
            }
            //console.log(resul);
            break;
        case "num_photos":
            for(var kk = 0; kk < num_media.length; kk++) {
                for(var zz = 0; zz < array.length; zz++) {
                    if(num_media[kk].url == array[zz])
                        resul.push(num_media[kk]);
                }
            }
            //console.log(resul);
            break;
        default:

            break;
    }
    return resul;
}

function fSelectDataList() {
    var array = [];  // klass_data[kk]
    var array2 = []; // Only post_url
    var array_aux = [];
    var array_aux2 = [];
    var resul = [];
    var kk = 0;

    //
    for(var zz = 0; zz < nodesArray.length; zz++) {
        array_aux = [];
        array_aux2 = [];
        for (var jj = 0; jj < klass_data.length; jj++) {
            if (klass_data[jj].Term == nodesArray[zz].Term) {
                if(zz > 0) {
                    var indexAux = array2[zz-1].indexOf(klass_data[jj].post_url);
                    if(indexAux != -1) {
                        array_aux.push(klass_data[jj]);
                        array_aux2.push(klass_data[jj].post_url);
                    }
                } else {
                    array_aux.push(klass_data[jj]);
                    array_aux2.push(klass_data[jj].post_url);
                }
            }
        }
        array.push(array_aux);
        array2.push(array_aux2);
    }

    console.log(array);

    var refined_array = [];

    var newArray = array[nodesArray.length - 1];
    console.log("Number of posts: " + newArray.length);
    //console.log(newArray);

    for (var zz = 0; zz < newArray.length; zz++) {
        if (refined_array.indexOf(newArray[zz]) == -1) {
            refined_array.push(newArray[zz]);
        }
    }

    var resul = [];
    resul = refined_array;

    //console.log(refined_array);

    console.log(resul);

    //var resul = fSortDataBars(refined_array);
    return resul;

}

function fExclusionArray() {
    var array = [];
    //var array_aux = [];
    console.log(excludedNodes);
    for(var zz = 0; zz < excludedNodes.length; zz++) {
        //array_aux = [];
        // Check in all the klass_data where the Term match
        for (var jj = 0; jj < klass_data.length; jj++) {
            if (klass_data[jj].Term == excludedNodes[zz].Term) {
                console.log("hey");

                var indexAux = array.indexOf(klass_data[jj].klass_url)
                if(indexAux == -1)
                    array.push(klass_data[jj].klass_url);

            }
        }
        //console.log(array_aux);
        //array.push(array_aux);
    }
    console.log("Exclussion Array:");
    console.log(array);
    return array;
}