<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 20/10/2015
 * Time: 17:54
 */

// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "textanalyzer1");

// Query the keywords
$query_keywords = "SELECT * FROM keywords";
$result_keywords = $mysqli->query($query_keywords);

$data_keywords = array();
for($ii = 0; $ii < $result_keywords->num_rows; $ii++) {
    $data_keywords[] = utf8_converter($result_keywords->fetch_assoc());
}

// Query the word frequencies
//$query_freq = "SELECT * FROM words_freq";
/*$query_freq = "SELECT * FROM words_freq WHERE Frequency > '1'";
$result_freq = $mysqli->query($query_freq);

$data_freq = array();
for($jj = 0; $jj < $result_freq->num_rows; $jj++) {
    $data_freq[] = $result_freq->fetch_assoc();
}*/

//$query_freq = "SELECT * FROM total_freq WHERE freq > '5'";
$query_freq = "SELECT * FROM freq_klass_final";
$result_freq = $mysqli->query($query_freq);

$data_freq = array();
for($jj = 0; $jj < $result_freq->num_rows; $jj++) {
    $data_freq[] = utf8_converter($result_freq->fetch_assoc());
}

//echo "KEYWORDS: <br />";
//echo json_encode($data_keywords);
//echo "<br /><hr /><br />";

//echo "FREQ: <br />";
echo json_encode($data_freq);
//echo "<br />";

//$js = file_get_contents("Visualize/js/vis.js");
//return $js;


function utf8_converter($array)
{
    array_walk_recursive($array, function(&$item, $key){
        if(!mb_detect_encoding($item, 'utf-8', true)){
            $item = utf8_encode($item);
        }
    });

    return $array;
}