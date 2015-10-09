<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 07/10/2015
 * Time: 19:26
 */
require_once('/ext/words.php');

set_time_limit(300);
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

    $clean_post = strip_tags($post);
    $clean_post = utf8_decode(utf8_decode($clean_post));

//    echo "<br /><hr />" . $clean_post . "<br />";

    $dom = new DOMDocument();
    $dom->loadHTML($post);
    foreach($dom->getElementsByTagName('a') as $node) {

        $query_check = "SELECT * FROM media WHERE Media_URL='" . $dom->saveHTML($node) . "'";
        $result_check = $mysqli->query($query_check);
        $media_url = $dom->saveHTML($node);

        // Delete this url from the clean_post
//        echo $media_url . "<br />";
//        echo strip_tags(utf8_decode($media_url)) . "<br />";
//        str_replace($media_url, "", $clean_post);

        // Check if it's already in the db.
        if($result_check->num_rows == 0) {

            // Insert the media
            $inserts = "'" . $url_id . "'" . ", " . "'" . $media_url . "'";
            $query2 = "INSERT INTO media (Id_Post, Media_URL) VALUES (" . $inserts . ")";
            $result2 = $mysqli->query($query2);

        } else {

//            echo "Already on the DB. <br />";

        }
//        echo $dom->saveHTML($node), PHP_EOL;
    }

    // Processing words
    $word_count = str_word_count($clean_post);

    // Explode the posts
    $words_array = explode(" ", $clean_post);

    foreach($words_array as $single_word) {



        // Check that this word is not among the most used Swedish words
        if(!array_search($single_word, explode(" ", $words))) {

//            echo "______ " . array_search($single_word, explode(" ", $words)) . " _______";
            // Check that this word is not already stored
            $query1 = "SELECT * FROM keywords WHERE Term='" . $single_word . "'";
            $result1 = $mysqli->query($query1);

            if($result1->num_rows == 0) {
//                echo "N";

//                echo "<br />==============>" . $single_word . "<br />";

                // If the keyword is not stored
                $query1 = "INSERT INTO keywords (Term) VALUES ('" . $single_word . "')";
                $r1 = $mysqli->query($query1);

            } else {

                // If the keyword already exists
                $data2 = $result1->fetch_assoc();
                $id_keyword = $data2['Id'];
                $query1 = "SELECT * FROM words_freq WHERE Id_keyword='" . $id_keyword . "' AND Id_post='" . $post_id . "'";
                $r2 = $mysqli->query($query1);

                if($r2->num_rows == 0) {
//                    echo "A";

                    // If it's the first time the keyword appears in this post
                    $inserts = "'" . $post_id . "', '" . $id_keyword . "', '1'";
                    $q1 = "INSERT INTO words_freq (Id_post, Id_keyword, Frequency) VALUES (" . $inserts . ")";
                    $r3 = $mysqli->query($q1);

                } else {
//                    echo "+";

                    // If the keyword already appeared in this post
                    $d1 = $r2->fetch_assoc();
                    $freq_old = $d1['Frequency'];
                    $freq_new = $freq_old + 1;
//                    echo "FREQ: " . $freq_old . "^^^^^^^^^^" . $freq_new;
                    // Update the frequency +1
                    $q1 = "UPDATE words_freq SET Frequency='" . $freq_new . "' WHERE Id='" . $d1['Id'] . "'";
                    $r3 = $mysqli->query($q1);
                }
            }
//        $keywords = $result1->fetch_assoc();

            // Levenshtein

        } else {
            // Nothing
            echo "E";
        }

    }

//    echo "<br />WORD COUNT: " . $word_count . " in ----> " . $url . "<br />";
//    echo $clean_post . "<br /><hr />";


}