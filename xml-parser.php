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
		foreach ($_FILES as $key => $value) {
			echo '<p>'.$key.'</p>';
			foreach($value as $k => $v)
			{
				echo '<p>'.$k.'</p>';
				echo '<p>'.$v.'</p>';
				echo '<hr />';
			}

		}
//		echo file_get_contents($_FILES['my_file']['tmp_name']);
		echo file($_FILES['my_file']['tmp_name']);
//		echo $_FILES;
		$uploadOk = 0;
	}
}