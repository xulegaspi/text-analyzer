<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 06/10/2015
 * Time: 18:49
 */

$mysqli = new mysqli("localhost", "root", "", "textanalyzer1");

$query = "SELECT * FROM urls";
$result = $mysqli->query($query);
echo "Number of entries: " . $result->num_rows . "<br />";

$ii = 0;
for($ii=0; $ii < $num_rows; $ii++) {

}