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
echo "<br />";

$ii = 0;
for($ii=0; $ii < $num_rows; $ii++) {
    // Access each row
    $data = $result->fetch_array();
//    print_r($data);
    echo $data['URL'];
    echo "<br /><hr />";


    $id_url = $data['Id'];
    $url = $data['URL'];
    $xml = simplexml_load_file($url . "/feed") or die("Error: Cannot create object");
//    file_put_contents("Tmpfile.xml", fopen($url . "/feed", 'r'));

    echo $xml->asXML();
}


//foreach($data as $url) {
//    echo $url['URL'];
//    echo "<br />";
//}