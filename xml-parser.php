<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 21/09/2015
 * Time: 2:59
 */

class Upload_Box {
    public static function get_instance() {
        if( null == self::$instance ) {
            self::$instance = new self;
        }

        return self::$instance;
    }

    private function __construct() {
        add_action( 'add_meta_boxes', array( $this, 'add_file_meta_box'));
        add_action( 'save_post', array( $this, 'save_custom_meta_data'));
    }

    public function post_media_display( $post ) {

        wp_nonce_field( plugin_basename(__FILE__), $this->nonce);

    }

    public function save_custom_meta_data( $post_id ) {
        // First, make sure the user can save the post
        if( $this->user_can_save( $post_id, $this->nonce ) ) {

            // If the user uploaded an image, let's upload it to the server
            if (!empty($_FILES) && isset($_FILES['post_media'])) {

                // Upload the goal image to the uploads directory, resize the image, then upload the resized version
                $goal_image_file = wp_upload_bits($_FILES['post_media']['name'], null, wp_remote_get($_FILES['post_media']['tmp_name']));

                // Set post meta about this image. Need the comment ID and need the path.
                if (false == $goal_image_file['error']) {

                    // Since we've already added the key for this, we'll just update it with the file.
                    update_post_meta($post_id, 'umb_file', $goal_image_file['url']);

                } // end if/else

            } // end if

        }

    }

    function user_can_save( $post_id, $nonce ) {

        $is_autosave = wp_is_post_autosave( $post_id );
        $is_revision = wp_is_post_revision( $post_id );
        $is_valid_nonce = ( isset( $_POST[ $nonce ] ) && wp_verify_nonce( $_POST[ $nonce ], plugin_basename( __FILE__ ) ) );

        // Return true if the user is able to save; otherwise, false.
        return ! ( $is_autosave || $is_revision ) && $is_valid_nonce;

    }

}