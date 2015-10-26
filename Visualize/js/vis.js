/**
 * Created by Xurxo on 23/10/2015.
 */
var width  = 1000,
    height = 800;

var gravity = 40 * 0.005;

var path = "data/";

var force;       // Force layout for the Bubble Chart
var svg_bubble;  // Bubble Chart SVG
var svg_bars;    // Bar Chart SVG
var main;        // Bubble Chart
var node;        // Bubble Chart nodes (bubbles)
var label;       // Labels of the Bubbles
var graph;       // Data loaded and filtered from the Keywords and their Frequencies
var words_data;  // Raw data loaded from total_freq.json

//d3.json("vis.php", function(error, graph) {
d3.json(path + "total_freq.json", function(error, graph2) {
    if (error) throw error;

    words_data = graph2;

    slider_handlers(words_data);

    graph = filterData(15, graph2);

    draw();

});
