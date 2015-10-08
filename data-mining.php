<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 07/10/2015
 * Time: 19:26
 */
require_once('/ext/words.php');

$mysqli = new mysqli("localhost", "root", "", "textanalyzer1");

$query = "SELECT * FROM posts";
$result = $mysqli->query($query);

echo "Number of entries: " . $result->num_rows . "<br />";
$num_rows = $result->num_rows;

$ii = 0;
echo $words;
echo "<br /><hr />";
for($ii=0; $ii < $num_rows; $ii++) {

    // Access each row
    $data = $result->fetch_array();

    $post = $data['Post'];
    $post2 = strip_tags($post);
    $post2 = utf8_decode(utf8_decode($post2));

    echo $post2;

//    echo $data['Post_URL'];
    echo "<br />";
    echo "<hr />";
}