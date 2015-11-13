/**
 * Created by Xurxo on 23/10/2015.
 */
var width  = 1000,
    height = 800;

var gravity = 40 * 0.005;
var diam = 3.5;
var freq = 23;

var path = "data/";

var force;       // Force layout for the Bubble Chart
var svg_bubble;  // Bubble Chart SVG
var svg_bars;    // Bar Chart SVG
var svg_list;
var list;        // List of posts
var list_title;  // Word shown for the list
var main;        // Bubble Chart
var bubble;
var node;        // Bubble Chart nodes (bubbles)
var nodeEnter;
var bars;
var bars_list;
var label;       // Labels of the Bubbles
var label_bars;
var label_list;
var graph;       // Data loaded and filtered from the Keywords and their Frequencies
var graph_raw;
var words_data;  // Raw data loaded from total_freq.json
var klass_data;  // Raw data loaded from freq_klass_final.json
var klass_fil;
var num_posts;
var posts_fil;
var num_media;
var media_fil;
var media;
var sort;
var avg_length;  // Raw data from avg_length.json
var scale;

var lock = false;
var lock_bar = false;


//d3.json("vis.php", function(error, graph) {
d3.json(path + "total_freq.json", function(error, graph2) {
    if (error) throw error;

    //console.log(graph2);

    words_data = graph2;
    graph_raw = words_data;

    slider_handlers(words_data);

    //graph = filterData(15, graph2);

    //draw();
    //draw_bar_chart(num_posts);

    d3.json(path + "freq_klass_final.json", function(error, data) {
        if (error) throw error;

        klass_data = data;

        console.log(data);
        draw_bubble_chart(graph2);
    });
    //setTimeout(draw_bubble_chart(graph2), 2000);


});


//d3.json("vis.php", function(error, data) {



d3.json(path + "num_posts.json", function(error, data) {
    if (error) throw error;

    num_posts = data;
    posts_fil = num_posts;
    sort = "posts";

    draw_bar_chart(num_posts, sort);
    //console.log(data);
});

d3.json(path + "media_final.json", function(error, data) {
    if (error) throw error;

    num_media = data;
    media_fil = num_media;

    //draw_bar_chart(num_media, "media");
    //console.log(data);
});

d3.json(path + "media.json", function(error, data) {
    if (error) throw error;

    media = data;
});

d3.json(path + "avg_length.json", function(error, data) {
    if (error) throw error;

    avg_length = data;

});
