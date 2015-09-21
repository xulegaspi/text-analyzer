<?php

/*
Plugin Name: Text Analyzer
Plugin URI: https://github.com/xulegaspi/text-analyzer
Description: A brief description of the Plugin.
Version: 1.0
Author: Xurxo Legaspi
License: GPLv3
*/

/* Set the version number of the plugin. */
define( 'TextAnalyzer_version', 3.15 );

/* Set the path to the root directory */
define( 'ABSPATH', dirname(__FILE__) );
//$path = get_home_path();

/* Set constant path to the plugin directory. */
define( 'TextAnalyzer_path', plugin_dir_path( __FILE__ ) );

/* Set constant url to the plugin directory. */
define( 'TextAnalyzer_URL', plugin_dir_url( __FILE__ ) );

/* Set the constant path to the plugin's template directory. */
define( 'TEMPLATES', TextAnalyzer_path . trailingslashit( 'templates' ), true );

//require_once(TextAnalyzer_path . 'xml_parser.php');

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
    echo "Hello world yuuuuujuuuu";
}

add_action('admin_menu', 'my_plugin_menu');

function my_plugin_menu() {

    add_options_page( 'My Plugin Options', 'Text Analyzer', 'manage_options', 'text-analyzer-settings', 'my_plugin_options' );
	add_management_page('TextAnalyzer', 'TextAnalyzer', 'manage_options', 'text-analyzer', 'text_analyzer_page');

}

function my_plugin_options() {
    if ( !current_user_can( 'manage_options' ) )  {
        wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    }

    $response = file_get_contents(TEMPLATES . "settings.html");
    echo $response;

}

function text_analyzer_page() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}

	$response = file_get_contents(TEMPLATES . "text-analyzer.html");
	echo $response;
}


