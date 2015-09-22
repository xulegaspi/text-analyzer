<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 21/09/2015
 * Time: 2:59
 */

$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["my_file"]["name"]);
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
//$file = $_POST["my_file"]["tmp_name"];
// Check if image file is a actual image or fake image
if(isset($_POST["submit_my_file"])) {
	$check = getimagesize($_FILES["my_file"]["tmp_name"]);
	if($check !== false) {
		echo "File is an image - " . $check["mime"] . ".";
		$uploadOk = 1;
	} else {
		echo "File is not an image.";

//		$file = file_get_contents($_FILES['my_file']['tmp_name']);
		$xml = simplexml_load_file($_FILES['my_file']['tmp_name']) or die("Error: Cannot create object");

//		echo $xml->map->markers;
		echo "<br />";
//		print_r($xml->children()->children());

		$ii = 0;
		foreach($xml->children()->children() as $marker) {
			$ii++;
//			echo $marker->children()->DetailsHTML;
//			echo $marker->DetailsHTML;
			if($ii==9) {
//			echo $ii;
//			echo $marker['DetailsHTML'];
//			echo "<br />";
//			echo "<hr />";
				print_r($marker->children());
			}

		}

//		$xml=simplexml_load_file("note.xml") or die("Error: Cannot create object");
//		print_r($xml);
//		echo $xml->getName();
		$uploadOk = 0;
	}
}