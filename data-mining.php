<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 07/10/2015
 * Time: 19:26
 */

$EXEC_TIME = 30;  // 25 minutes

require_once('/ext/words.php');
require_once('/ext/Levenshtein_SQL.php');  // This must be included manually in the phpMyAdmin page, SQL section

set_time_limit($EXEC_TIME);
$mysqli = new mysqli("localhost", "root", "", "textanalyzer1");

//echo $levenshtein_sql . "<br />";

//$result_function = $mysqli->query($levenshtein_sql);
//var_dump($result_function);

$query_posts = "SELECT * FROM posts";
$result_posts = $mysqli->query($query_posts);

echo "Number of entries: " . $result_posts->num_rows . "<br />";
$num_rows = $result_posts->num_rows;

$ii = 0;

/**
 *
 *
 */

for($ii=0; $ii < $num_rows; $ii++) {

    // Access each row
    $data_posts = $result_posts->fetch_array();

    $post = $data_posts['Post'];
    $post_id = $data_posts['Id'];
    $url_id = $data_posts['Id_URL'];
    $url = $data_posts['Post_URL'];
    $pubDate = $data_posts['pubDate'];
    $minedDate = $data_posts['Mined'];

    $date_p = new DateTime($pubDate);
    $date_m = new DateTime($minedDate);
    $yesterday = new DateTime();
    $today = new DateTime();

    $yesterday->modify('-1 day');

    echo "Mining post nº: " . $ii . "<br />";

//    echo "Mod: " . $date_m->format('Y-m-d H:i:s') . " <-----> " . $yesterday->format('Y-m-d H:i:s') . "<br />";

    // TODO check if the post was already mined
    if($date_m > $yesterday) {

//        echo "1: Modified recently ==> " . $date_m->format('Y-m-d H:i:s') . "<br />";

    } else {

//        echo "2: Modifying date ==> " . $today->format('Y-m-d H:i:s') . "<br />";

        $query_date = "UPDATE posts SET Mined='" . $today->format('Y-m-d H:i:s') . "' WHERE Id='" . $post_id . "'";
        $result_date = $mysqli->query($query_date);

        //echo $data_posts['pubDate'];

        // Delete the old data
        $query_delete = "DELETE FROM words_freq WHERE Id_post='" . $post_id . "'";
        $result_delete = $mysqli->query($query_delete);

        $clean_post = strip_tags($post);
        $clean_post = utf8_decode(utf8_decode($clean_post));

//    echo "<br /><hr />" . $clean_post . "<br />";

        // Processing media
        $dom = new DOMDocument();
        $dom->loadHTML($post);
        foreach($dom->getElementsByTagName('a') as $node) {

            // TODO it's enough to extract the url
            $media_url = $node->getAttribute( 'href' );
            $media_url = utf8_decode(utf8_decode($media_url));
//            $query_check = "SELECT * FROM media WHERE Media_URL='" . $dom->saveHTML($node) . "'";
            $query_check = "SELECT * FROM media WHERE Media_URL='" . $media_url . "'";
            $result_check = $mysqli->query($query_check);


            // TODO Delete this url from the clean_post
//        echo $media_url . "<br />";
//        echo strip_tags(utf8_decode($media_url)) . "<br />";
//        str_replace($media_url, "", $clean_post);

            // Check if it's already in the db.
            if($result_check->num_rows == 0) {

                // Classify the media
                $type = extractMedia($media_url);

                // Insert the media
                $inserts = "'" . $url_id . "'" . ", " . "'" . $media_url . "'" . ", " . "'" . $type . "'";
                $query2 = "INSERT INTO media (Id_Post, Media_URL, Type) VALUES (" . $inserts . ")";
                $result2 = $mysqli->query($query2);

            } else {

                // TODO do sth
//            echo "Already on the DB. <br />";

            }

        }

        // Processing words
        $word_count = str_word_count($clean_post);

        // Explode the posts
        $words_array = explode(" ", $clean_post);


        foreach($words_array as $single_word) {

            // Check that this word is not among the most used Swedish words
            // echo "Checking $single_word -> " . array_search($single_word, explode(PHP_EOL, $words)) . "<br />";

            // Check for different blank spaces
            $url_word = urlencode($single_word);
            if (strpos($url_word, "%0A")) {
                $url_word = str_replace("%0A", "%20", $url_word);
                $single_word = urldecode($url_word);
                $single_word1 = explode(" ", $single_word);
//                var_dump($single_word1);
                $pos = array_search($single_word, $words_array);
                array_splice($words_array, $pos, 0, $single_word1[1]);
                $single_word = $single_word1[0];
//                echo "WHITE";
            } else {
                $single_word1 = [];
                array_push($single_word1, $single_word);
            }

            foreach ($single_word1 as $single_word2) {

                $strange = chr(229) . chr(228) . chr(246) . chr(197) . chr(196) . chr(214);  // å ä ö Å Ä Ö
                $re = "/[^a-zA-Z" . $strange . "0-9]/";
                $re2 = "/[^a-zA-Z" . $strange . "]/";
                $single_word2 = preg_replace($re2, '', $single_word2);
//                echo $single_word2 . "<br />";

                if(mb_strtolower($single_word2) != "i" and $single_word2 != "") {

                    // Check if the word is among the common Swedish words
                    if (!array_search(mb_strtolower($single_word2), explode(PHP_EOL, $words))) {

                        // Check that this word is not already stored
                        if(strlen($single_word2 <= 3)) {

                            //                $query1 = "SELECT * FROM keywords WHERE Term='" . $single_word . "'";
                            $query_levenshtein = "SELECT * FROM keywords WHERE levenshtein('" . mb_strtolower($single_word2) . "', Term) BETWEEN 0 AND 1";
                            $result1 = $mysqli->query($query_levenshtein);

                        } else {

                            //                $query1 = "SELECT * FROM keywords WHERE Term='" . $single_word . "'";
                            $query_levenshtein = "SELECT * FROM keywords WHERE levenshtein('" . mb_strtolower($single_word2) . "', Term) BETWEEN 0 AND 2";
                            $result1 = $mysqli->query($query_levenshtein);

                            //                var_dump($result1);
                        }


                        if ($result1->num_rows == 0) {
                            //                echo "N";

                            // If the keyword is not stored
                            $query1 = "INSERT INTO keywords (Term) VALUES ('" . mb_strtolower($single_word2) . "')";
                            $r1 = $mysqli->query($query1);
//                            echo "Insert word: " . $single_word2 . "<br />";

                            $query1 = "SELECT * FROM keywords WHERE Term='" . mb_strtolower($single_word2) . "'";
                            $r1 = $mysqli->query($query1);

                            $d2 = $r1->fetch_assoc();
                            $id_keyword = $d2['Id'];
//                            echo "ID: " . $id_keyword . "<br />";
                            // If it's the first time the keyword appears in this post
                            $inserts = "'" . $post_id . "', '" . $id_keyword . "', '1'";
                            $q1 = "INSERT INTO words_freq (Id_post, Id_keyword, Frequency) VALUES (" . $inserts . ")";
                            $r3 = $mysqli->query($q1);

                        } else {

                            // If the keyword already exists
                            $data2 = $result1->fetch_assoc();
                            $id_keyword = $data2['Id'];
                            $query1 = "SELECT * FROM words_freq WHERE Id_keyword='" . $id_keyword . "' AND Id_post='" . $post_id . "'";
                            $r2 = $mysqli->query($query1);

//                            echo "LEVENSHTEIN: " . $single_word2 . " --> " . $data2['Term'] . "<br />";

                            if ($r2->num_rows == 0) {
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

                                // Update the frequency +1
                                $q1 = "UPDATE words_freq SET Frequency='" . $freq_new . "' WHERE Id='" . $d1['Id'] . "'";
                                $r3 = $mysqli->query($q1);
                            }
                        }


                        //        $keywords = $result1->fetch_assoc();

                        // Levenshtein

                    } else {
                        // Nothing
                        // echo "E";
                    }

                } else {
//                    echo "I FOUND<br />";
                }

            } // End foreach

        }

    }



//    echo "<br />WORD COUNT: " . $word_count . " in ----> " . $url . "<br />";
//    echo $clean_post . "<br /><hr />";


}

function extractMedia($url) {
    $resul = "";

    $path_parts = pathinfo($url);
    $ext = $path_parts['extension'];
    echo $url . " has EXT: " . $ext . "<br />";

    if($ext == "jpg" || $ext == "jpeg" || $ext == "png") {
        $resul = "IMAGE";
    } elseif($ext == "mkv" || $ext == "flv" || $ext == "avi" || $ext == "mov" || $ext == "wmv" || $ext == "mpg" || $ext == "mpeg") {
        $resul = "VIDEO";
    } elseif(strpos($url, 'video')) {
        $resul = "VIDEO";
    } elseif($ext == "doc" || $ext == "docx") {
        $resul = "DOC";
    } elseif($ext == "pdf") {
        $resul = "PDF";
    } else {
        $resul = "WEB";
    }

    return $resul;
}