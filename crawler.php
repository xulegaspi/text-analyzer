<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 28/09/2015
 * Time: 1:53
 */

$target_dir = "uploads/";
set_time_limit(300);
$mysqli = new mysqli("localhost", "root", "", "textanalyzer1");

$query = "SELECT * FROM urls";
$result = $mysqli->query($query);

echo "Number of entries: " . $result->num_rows;
$num_rows = $result->num_rows;

$ii = 0;
    for($ii=0; $ii < $num_rows; $ii++) {

        // Access each row
        $data = $result->fetch_array();
        echo $data['URL'];
        echo "<br /><hr />";

        // Get the data of the blog
        $id_url = $data['Id'];
        $url = $data['URL'];
        echo "Trying to get ---> " . $url . "<br />";
        $xml = simplexml_load_file($url . "/feed");

        // Throws error if the page is not valid (as an email)
        if ($xml) {

            // Extract the information
            foreach ($xml->children()->children()->item as $item) {
                echo "The post is ---> " . $item->link;
                $post_link = $item->link;
                echo "<br />";

                echo "Publication Date: " . $item->pubDate;
                $pubDate = $item->pubDate;
                $pubDate = new DateTime($pubDate);
                $pubDate->format('Y-m-d H:i:s');
                echo "<br />";

                $description = $item->description;

                // get the HTML string out of the feed:
                $htmlString = $item->children('content', true)->encoded;
                // create DOMDocument for HTML parsing:
                $htmlParser = new DOMDocument();
                // load the HTML:
                $htmlParser->loadHTML($htmlString);
                // import it into simplexml:
                $html = simplexml_import_dom($htmlParser);

                // Throws error if the post is not in a proper format
                try {
                    if ($html) {
                        $postContent = $html->body->asXML();
                        echo $id_url . " added correctly. <br />";
                    } else {
                        echo $id_url . " -----> " . $post_link . " is not working. <br />";
                        $postContent = "ERROR";
                    }
                } catch (Exception $e) {
                    print_r($e);
                }

                //            echo $item
                echo "<br />";
                echo "<br />";

                $inserts = "'" . $id_url . "'" . ", " . "'" . $post_link . "'" . ", " . "'" . $description . "'" . ", " . "'" . $postContent . "'" . ", " . "'" . $pubDate->format('Y-m-d H:i:s') . "'";

                $query2 = "INSERT INTO posts (Id_URL, Post_URL, Description, Post, PubDate) VALUES " . "(" . $inserts . ")";
                $result2 = $mysqli->query($query2);

                //            $post = simplexml_load_file()
            }

        } else {
            echo "ERROR LOADING ----> " . $url;
        }

        echo "Page $ii added<br />";
        echo "Going to page $url";

}