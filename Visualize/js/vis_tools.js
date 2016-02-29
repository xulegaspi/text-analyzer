/**
 * Created by Xurxo on 29/01/2016.
 */

function fNodeEnter() {
    var nodeEnter = node.enter()
        .append("circle")
        .attr("class", "node_circle")
        .attr("r", function (d) {
            //if(freq_aux != null) {
            //    console.log("here");
            //    return diam * Math.sqrt(d.freq) / (freq_aux * 2);
            //} else {
                return diam * Math.sqrt(d.freq);
            //}
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
            var auxSecondClick = false;
            //console.log(this);
            if(!d3.event.shiftKey && !d3.event.ctrlKey) {
                nodesArray = [];
                excludedNodes = [];
                nodesArray.push(d);
            }
            if(d3.event.shiftKey) {
                var index = nodesArray.indexOf(d);
                if(index == -1) {
                    nodesArray.push(d);
                } else {
                    nodesArray.splice(index, 1);
                    //console.log("UUUU");
                    auxSecondClick = true;
                    d3.select(this)
                        .style("stroke-width", 0);
                    // TODO fUnselectThis()
                }
                //console.log(nodesArray);
            }
            if(d3.event.ctrlKey) {
                var indexD = excludedNodes.indexOf(d);
                if(indexD == -1)
                    excludedNodes.push(d);
                //console.log(excludedNodes);
            }

            if(d3.event.ctrlKey) {
                fExcludeNode(d, this);
                d3.select(this)
                    .style("stroke", node_excluded_color)
                    .style("stroke-width", 5);
            } else {
                //if(!auxSecondClick)
                fSelectNode(d, this);
            }

            if(!d3.event.shiftKey && !d3.event.ctrlKey)
                fUnselectNodes(d);

            selected_node = d;

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
            //console.log(node_change);

            if(!d3.event.shiftKey && !d3.event.ctrlKey) {
                nodesArray = [];
                excludedNodes = [];
                nodesArray.push(d);
            }
            if(d3.event.shiftKey) {
                var index = nodesArray.indexOf(d);
                if(index == -1) {
                    nodesArray.push(d);
                } else {
                    nodesArray.splice(index, 1);
                    // TODO fUnselectThis()
                }
                //console.log(nodesArray);
            }
            if(d3.event.ctrlKey) {
                var indexD = excludedNodes.indexOf(d);
                if(indexD == -1) {
                    excludedNodes.push(d);
                } else {

                }
                //console.log(excludedNodes);
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
            //if (selected_bar != null && selected_bar != d) {
            //    var bar_change = bars.filter(function (d) {
            //        return d == selected_bar;
            //    });
            //    bar_change.attr("fill", bar_color);
            //    selected_bar = d;
            //    lock_bar = true;
            //    click_bar = true;
            //    d3.select(this)
            //        .attr("fill", bar_mouse_color);
            //} else {
            //    lock_bar = lock_bar ? false : true;
            //    click_bar = true;
            //}

            var auxSecondClick = false;
            //console.log(this);
            if(!d3.event.shiftKey && !d3.event.ctrlKey) {
                barsArray = [];
                excludedBars = [];
                barsArray.push(d);
            }
            if(d3.event.shiftKey) {
                var index = barsArray.indexOf(d);
                if(index == -1) {
                    barsArray.push(d);
                } else {
                    barsArray.splice(index, 1);
                    //console.log("UUUU");
                    auxSecondClick = true;
                    d3.select(this)
                        .attr("fill", bar_color);
                    // TODO fUnselectThis()
                }
                //console.log(barsArray);
            }
            if(d3.event.ctrlKey) {
                var indexD = excludedBars.indexOf(d);
                if(indexD == -1)
                    excludedBars.push(d);
                //console.log(excludedNodes);
            }

            if(d3.event.ctrlKey) {
                //fExcludeNode(d, this);
                //d3.select(this)
                //    .style("stroke", node_excluded_color)
                //    .style("stroke-width", 5);
            } else {
                //if(!auxSecondClick)
                fSelectBar(d, this);
            }

            if(!d3.event.shiftKey && !d3.event.ctrlKey)
                fUnselectBars(d);

            selected_bar = d;
            mouseclick_bar(d);
            console.log(barsArray);
            fColourBars();
            //d3.select(this)
            //    .attr("fill", bar_mouse_color);
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
        .on("mouseover", function(d) {
            if(!click_list && selected_list == null) {
                //console.log(this);
                fHighlightBar(d);
                //mouseover_list(d);
                d3.select(this)
                    .attr("fill", bar_mouse_color);
            }
        })
        .on("mouseout", function(d) {
            if(!click_list && selected_list == null) {
                d3.select(this)
                    .attr("fill", bar_list_color);
                fPlayDownBar(d);
            }
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
            click_list = true;

        })
        .on("dblclick", function(d) { window.open(d.post_url); })
        .attr("transform", "translate(-15," + margin.top + ")")
        .attr("fill", bar_list_color);  // COLOUR
}

function fLabelListEnter(data) {
    svg_list.selectAll("text")
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
        .on("mouseover", function(d) {
            var auxPostURL = d.post_url;
            var barListChange = bars_list.filter(function(d) {
                return auxPostURL == d.post_url;
            });
            var helpMe = barListChange[0];
            barListChange = helpMe[0];
            //console.log(barListChange);

            if(!click_list && selected_list == null) {
                fHighlightBar(d);
                //mouseover_list(d);
                d3.select(barListChange)
                    .attr("fill", bar_mouse_color);
            }
        })
        .on("mouseout", function(d) {
            var auxPostURL = d.post_url;
            var barListChange = bars_list.filter(function(d) {
                return auxPostURL == d.post_url;
            });
            var helpMe = barListChange[0];
            barListChange = helpMe[0];
            //console.log(barListChange);
            if(!click_list && selected_list == null) {
                d3.select(barListChange)
                    .attr("fill", bar_list_color);
                fPlayDownBar(d);
            }
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
    console.log("hhhhhh");
    console.log(d);
    console.log(thisNode);
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

function fUnselectBars(d) {
    var neighbors = {};
    neighbors[d.index] = true;

    bars.filter(function(d) {
        return !neighbors[d.index];
    })
        .attr("fill", bar_color);
}

function fSelectBar(d, thisBar) {
    if (selected_bar != null && selected_bar != d) {
        var bar_change = bars.filter(function (d) {
            return d == selected_bar;
        });
        bar_change.attr("fill", bar_color);
        selected_bar = d;
        lock_bar = true;
        click_bar = true;
        d3.select(thisBar)
            .attr("fill", bar_mouse_color);
    } else {
        lock_bar = lock_bar ? false : true;
        click_bar = true;
    }
}

function fSelectDataNodes() {
    var exclusion = [];
    var data = klass_data;
    var hist = [];
    var hist_aux = [];
    var array = [];
    var array_aux = [];
    var resul = [];
    var kk = 0;

    for(var zz = 0; zz < barsArray.length; zz++) {

        array_aux = data.filter(function (d) {
            if (sort == "posts") {
                return d.klass_url == barsArray[zz].URL;
            } else {
                return d.klass_url == barsArray[zz].url;
            }
        });

        array_aux.map(function (a) {
            if (a.Term in hist_aux) {
                hist_aux[a.Term] += parseInt(a.freq);
            } else {
                hist_aux[a.Term] = parseInt(a.freq);
            }
        });

        //console.log(hist);

        for (var k in hist_aux) {
            if(k in hist) {
                hist[k] += parseInt(hist_aux[k]);
            } else {
                hist[k] = parseInt(hist_aux[k]);
            }
        }

        for (var k in hist){
            if (hist.hasOwnProperty(k)) {
                var aux = {};
                aux.Term = k;
                aux.freq = hist[k];
                resul.push(aux);
                //console.log("Key is " + k + ", value is " + hist[k]);
            }
        }

    }

    console.log(resul.length);
    return resul;

        //array_aux = [];
        //// Check in all the klass_data where the Term match
        //for (var jj = 0; jj < klass_data.length; jj++) {
        //    if (klass_data[jj].Term == nodesArray[zz].Term) {
        //        //Check if it's excluded
        //        if(exclusion != "[]" && exclusion.indexOf(klass_data[jj].klass_url) == -1) {
        //            // Check if the URL also include previous selections so that it includes all the selected words
        //            if (zz > 0) {
        //                var indexAux = array[zz - 1].indexOf(klass_data[jj].klass_url);
        //                // TODO: exclude if in other array
        //
        //                if (indexAux != -1) {
        //                    //console.log(array[zz-1][indexAux] + " --> " + klass_data[jj].klass_url);
        //                    array_aux.push(klass_data[jj].klass_url);
        //                }
        //            } else { // If no previous selections, just add the URL
        //                array_aux.push(klass_data[jj].klass_url);
        //            }
        //        }
        //    }
        //}
        ////console.log(array_aux);
        //array.push(array_aux);
    //}
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
    var exclussion = [];
    exclusion = fExclusionArray();

    for(var zz = 0; zz < nodesArray.length; zz++) {
        array_aux = [];
        array_aux2 = [];
        for (var jj = 0; jj < klass_data.length; jj++) {
            if (klass_data[jj].Term == nodesArray[zz].Term) {
                if(exclusion != "[]" && exclusion.indexOf(klass_data[jj].klass_url) == -1) {
                    if (zz > 0) {
                        var indexAux = array2[zz - 1].indexOf(klass_data[jj].post_url);
                        if (indexAux != -1) {
                            array_aux.push(klass_data[jj]);
                            array_aux2.push(klass_data[jj].post_url);
                        }
                    } else {
                        array_aux.push(klass_data[jj]);
                        array_aux2.push(klass_data[jj].post_url);
                    }
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


    console.log(selected_bar);
    if(selected_bar != null) {
        //console.log("AAAA");
        for(var zz = 0; zz < refined_array.length; zz++) {
            console.log(refined_array[zz].klass_url + " --> " + selected_bar.URL);
            switch (sort) {
                case "posts":
                    if(refined_array[zz].klass_url == selected_bar.URL)
                        resul.push(refined_array[zz]);
                    break;
                case "post_length":
                    if(refined_array[zz].klass_url == selected_bar.url)
                        resul.push(refined_array[zz]);
                    break;
            }
        }
    } else {
        console.log("BSAIHQW");
        resul = refined_array;
    }

    console.log(resul);

    //var resul = fSortDataBars(refined_array);
    return resul;

}

function fExclusionArray() {
    var array = [];
    for(var zz = 0; zz < excludedNodes.length; zz++) {
        // Check in all the klass_data where the Term match
        for (var jj = 0; jj < klass_data.length; jj++) {
            if (klass_data[jj].Term == excludedNodes[zz].Term) {
                //console.log("hey");
                var indexAux = array.indexOf(klass_data[jj].klass_url);
                if(indexAux == -1)
                    array.push(klass_data[jj].klass_url);

            }
        }
        //array.push(array_aux);
    }
    //console.log("Exclussion Array:");
    //console.log(array);
    return array;
}

function fHighlightBar(selected_list) {
    var bar_change = bars.filter(function(d) {
        switch(sort) {
            case "posts":
                return selected_list.klass_url == d.URL;
            default:
                return selected_list.klass_url == d.url;
        }
    });
    bar_change.attr("fill", bar_mouse_color);
}

function fPlayDownBar(selected_list) {
    var bar_change = bars.filter(function(d) {
        switch(sort) {
            case "posts":
                return selected_list.klass_url == d.URL;
            default:
                return selected_list.klass_url == d.url;
        }
    });
    if(selected_bar == null)
        bar_change.attr("fill", bar_color);
}

function fColourBars() {
    bars.attr("fill", bar_color);

    for(var xx = 0; xx < barsArray.length; xx++) {
        bars.filter(function(d) {
            return d == barsArray[xx];
        })
            .attr("fill", bar_mouse_color);
    }
}

function fSearchBox(key) {
    console.log(key.value);
}

function getSearchableArray() {
    var resul = [];
    console.log(words_data.length);
    for(var xx = 0; xx < words_data.length; xx++) {
        //console.log(words_data[xx].Term);
        resul.push(words_data[xx].Term);
    }
    console.log(resul);
    return resul;
}

function fHighlightNode(word) {
    console.log(word);
    var node_change = node.filter(function(d) {
        return d.Term == word;
    });


    var data_change = node_change.data();
    console.log(data_change[0]);
    selected_node = data_change[0];

    var circle = node_change[0];
    console.log(circle[0]);

    fSelectNode(data_change[0], circle[0]);
    d3.select(circle[0])
        .style("stroke", node_selected_color)
        .style("stroke-width", 5);


}