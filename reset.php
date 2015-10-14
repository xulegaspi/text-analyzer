<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 14/10/2015
 * Time: 17:05
 */

set_time_limit(300);
$mysqli = new mysqli("localhost", "root", "", "textanalyzer1");

$query_posts = "SELECT * FROM posts";
$result_posts = $mysqli->query($query_posts);

$num_rows = $result_posts->num_rows;
$ii = 0;

for($ii=0; $ii < $num_rows; $ii++) {

    $data_posts = $result_posts->fetch_array();
    $id_post = $data_posts['Id'];

    $query = "UPDATE posts SET Mined='0000-00-00 00:00:00' WHERE Id='" . $id_post . "'";
    $mysqli->query($query);

}

$query_keywords = "TRUNCATE keywords";
$query_words = "TRUNCATE words_freq";

$mysqli->query($query_keywords);
$mysqli->query($query_words);

echo "RESET FINISHED!";