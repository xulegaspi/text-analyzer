<?php

/*
Plugin Name: Text Analyzer
Plugin URI: https://github.com/xulegaspi/text-analyzer
Description: A brief description of the Plugin.
Version: 1.0
Author: Xurxo Legaspi
License: GPLv3
*/

/* Runs when plugin is activated */
register_activation_hook(__FILE__, 'hello_world_install');

/* Runs when plugin is deactivated */
register_deactivation_hook(__FILE__, 'hello_world_remove');

function hello_world_install() {
    $page_title = 'TextAnalyzer Settings';
    $menu_title = 'Menu';
    $capability = 'read';
    $menu_slug  = 'Slug';
    /* Creates new database field */
    add_option('hello_world_data', 'Default', '', 'yes');
    add_dashboard_page($page_title, $menu_title, $capability, $menu_slug);
}

function hello_world_remove() {
    /* Deletes the database field */
    delete_option('hello_world_data');
}

add_action('init', 'hello_world');
function hello_world() {
    echo "Hello world";
}

if ( is_admin() ) {

    /* Call the html code */
    add_action('admin_menu', 'hello_world_admin_menu');

    function hello_world_admin_menu() {
        add_options_page('Hello World', 'Hello World', 'administrator',
            'hello-world', 'hello_world_html_page');
    }
}


