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
    $post_id = $data['Id'];
    $url_id = $data['Id_URL'];
    $url = $data['Post_URL'];

    $dom = new DOMDocument();
    $dom->loadHTML($post);
    foreach($dom->getElementsByTagName('a') as $node) {

        $query_check = "SELECT * FROM media WHERE Media_URL='" . $dom->saveHTML($node) . "'";
        $result_check = $mysqli->query($query_check);

        // Check if it's already in the db.
        if($result_check->num_rows == 0) {

            // Insert the media
            $inserts = "'" . $url_id . "'" . ", " . "'" . $dom->saveHTML($node) . "'";
            $query2 = "INSERT INTO media (Id_Post, Media_URL) VALUES (" . $inserts . ")";
            $result2 = $mysqli->query($query2);

        } else {

//            echo "Already on the DB. <br />";

        }
//        echo $dom->saveHTML($node), PHP_EOL;
    }

    $clean_post = strip_tags($post);
    $clean_post = utf8_decode(utf8_decode($clean_post));

    // Processing words
    $word_count = str_word_count($clean_post);

    // Explode the posts
    $words_array = explode(" ", $clean_post);

    foreach($words_array as $single_word) {

        $query1 = "SELECT * FROM keywords WHERE Term='" . $single_word . "'";
        $result1 = $mysqli->query($query1);
//        $keywords = $result1->fetch_assoc();

        // Levenshtein


    }

    echo "WORD COUNT: " . $word_count . " in ----> " . $url . "<br />";
//    echo $clean_post . "<br /><hr />";


}