<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 06/10/2015
 * Time: 18:51
 */

$url = $_POST['url'];

$mysqli = new mysqli("localhost", "root", "", "textanalyzer1");

$query = "SELECT * FROM posts WHERE Post_URL='" . $url . "'";
$result = $mysqli->query($query);

$data = $result->fetch_assoc();
$description = $data['Description'];
$post = $data['Post'];

echo utf8_decode(utf8_decode($post));