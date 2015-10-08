<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 06/10/2015
 * Time: 18:49
 */

$mysqli = new mysqli("localhost", "root", "", "textanalyzer1");

$query = "SELECT * FROM posts";
$result = $mysqli->query($query);
$num_rows = $result->num_rows;
echo "Number of posts: " . $result->num_rows . "<br />";

$ii = 0;
for($ii=0; $ii < $num_rows; $ii++) {

    // Access each row
    $data = $result->fetch_array();

    $post_url = $data['Post_URL'];
    $id_url = $data['Id'];
    $form = <<<FORM
    <form id="post" method="post" action="/wordpress/wp-content/plugins/TextAnalyzer/vis_post.php">
        <input id="url" type="hidden" name="url" value="$post_url" />
        <input id="post_submit" name="post_submit" type="submit" value="Go to Post" />
    </form>
FORM;
    echo $id_url . " ---> <a href='" . $post_url . "'>" . $post_url . "</a> . $form . <br />";

}