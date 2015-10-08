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

    $post_xml = simplexml_load_string($post);
    $dom = new DOMDocument();
    $dom->loadHTML($post);
    foreach($dom->getElementsByTagName('a') as $node) {

        $inserts = "'" . $url_id . "'" . ", " . "'" . $dom->saveHTML($node) . "'";
        $query2 = "INSERT INTO media (Id_Post, Media_URL) VALUES (" . $inserts . ")";
        $result2 = $mysqli->query($query2);
        echo $dom->saveHTML($node), PHP_EOL;
    }

    $post2 = strip_tags($post);
    $post2 = utf8_decode(utf8_decode($post2));

//    print_r($post_xml->children());
//    print_r($post_dom);
//    echo "<br />";
//    echo $post2;
//    echo $data['Post_URL'];
    echo "<br />";
    echo "<hr />";
}