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
//    $page_title = 'TextAnalyzer Settings';
//    $menu_title = 'Menu';
//    $capability = 'read';
//    $menu_slug  = 'Slug';
//    add_dashboard_page($page_title, $menu_title, $capability, $menu_slug);

    /* Creates new database field */
    add_option('hello_world_data', 'Default', '', 'yes');
}

function hello_world_remove() {
    /* Deletes the database field */
    delete_option('hello_world_data');
}

add_action('init', 'hello_world');
function hello_world() {
    echo "Hello world";
}

add_action('admin_menu', 'my_plugin_menu');

function my_plugin_menu() {

    add_options_page( 'My Plugin Options', 'Text Analyzer', 'manage_options', 'text-analyzer-settings', 'my_plugin_options' );

}

function my_plugin_options() {
    if ( !current_user_can( 'manage_options' ) )  {
        wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    }
    echo '<div class="wrap">';
    echo '<p>Here is where the form would go if I actually had options.</p>';
//    echo '<form action="/wordpress/wp-admin/options-general.php?page=text-analyzer-settings">';
    echo '<form action="/wordpress/wp-content/plugins/TextAnalyzer/xml-parser.php">';
    echo '<input type="file" name="File">';
    echo '<input type="submit" value="Upload">';
    echo '</form>';
    echo '</div>';
}


