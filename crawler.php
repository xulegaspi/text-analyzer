<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 28/09/2015
 * Time: 1:53
 */

//file_put_contents("Tmpfile.zip", fopen("http://someurl/file.zip", 'r'));

/*
 * $html = new simple_html_dom();
            $url = 'http://www.maticono.com/es/evento/' . $i . '/';


            $html->load_file($url);
 */

$target_dir = "uploads/";

$mysqli = new mysqli("localhost", "root", "", "textanalyzer1");

$query = "SELECT * FROM urls";
$result = $mysqli->query($query);

echo "Number of entries: " . $result->num_rows;
$num_rows = $result->num_rows;
//echo "<br />";

$ii = 0;
    for($ii=0; $ii < $num_rows; $ii++) {

        // Access each row
        $data = $result->fetch_array();
//    $result->free();
//    print_r($data);
        echo $data['URL'];
        echo "<br /><hr />";

        // Get the data of the blog
        $id_url = $data['Id'];
        $url = $data['URL'];
        echo "Trying to get ---> " . $url . "<br />";
        $xml = simplexml_load_file($url . "/feed") or die("Error: Cannot create object");

        // Extract the information
        foreach($xml->children()->children()->item as $item) {
            echo "The post is ---> " . $item->link;
            $post_link = $item->link;
            echo "<br />";

            echo "Publication Date: " . $item->pubDate;
            $pubDate = $item->pubDate;
            $pubDate = new DateTime($pubDate);
            $pubDate->format('Y-m-d H:i:s');
            echo "<br />";

            $description = $item->description;

//            echo $item->description->next();
//            foreach($item->children() as $node) {
//                echo "NODE -> " . $node;
//                echo "<br />";
//            }
//            print_r("CHILDREN -> " . $item->encoded);

            // get the HTML string out of the feed:
            $htmlString = $item->children('content', true)->encoded;
            // create DOMDocument for HTML parsing:
            $htmlParser = new DOMDocument();
            // load the HTML:
            $htmlParser->loadHTML($htmlString);
            // import it into simplexml:
            $html = simplexml_import_dom($htmlParser);

//            print_r($html->body->p);
            echo $html->body->asXML();
//            $postContent = $html->body->p->asXML();
            $postContent = $html->body->asXML();

//            echo $item
            echo "<br />";
            echo "<br />";

            $inserts = "'" . $id_url . "'" . ", " . "'" . $post_link . "'" . ", " . "'" . $description . "'" . ", " . "'" . $postContent . "'" . ", " . "'" . $pubDate->format('Y-m-d H:i:s') . "'";

            $query2 = "INSERT INTO posts (Id_URL, Post_URL, Description, Post, PubDate) VALUES " . "(" . $inserts . ")";
            $result2 = $mysqli->query($query2);

//            $post = simplexml_load_file()
        }




//    file_put_contents("Tmpfile.xml", fopen($url . "/feed", 'r'));

//    echo "ID = " . $id_url . "<br />";

//        $query = "UPDATE urls SET Raw_page='" . $xml . "' WHERE Id='" . $id_url . "'";
    //    $query = "UPDATE urls SET Raw_page='$ii' WHERE Id='$id_url'";
    //    echo "$query<br />";
//        $result2 = $mysqli->query($query) or die("Error: Query: " . $mysqli->error);

        echo "Page $ii added<br />";
        echo "Going to page $url";

//    echo $xml->asXML();
}


//foreach($data as $url) {
//    echo $url['URL'];
//    echo "<br />";
//}