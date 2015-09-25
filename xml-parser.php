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

$mysqli = new mysqli("localhost", "root", "", "textanalyzer1");
//echo $c;

// Check if image file is a actual image or fake image
if(isset($_POST["submit_my_file"])) {
	$check = getimagesize($_FILES["my_file"]["tmp_name"]);
	if($check !== false) {
		echo "File is an image - " . $check["mime"] . ".";
		$uploadOk = 1;
	} else {
		echo "File is not an image.";
		$xml = simplexml_load_file($_FILES['my_file']['tmp_name']) or die("Error: Cannot create object");

		echo "<br />";


        $query = "SELECT * FROM markers";
        $result = $mysqli->query($query);

        $row = $result->fetch_array(MYSQLI_NUM);
//        printf ("%s (%s)\n", $row[0], $row[1]);



        echo "<br />";
        echo "<hr />";


        $ii = 0;
		foreach($xml->children()->children() as $marker) {
			$ii++;
			if($ii==9) {
                foreach($marker->children() as $mark) {
                    //print_r($mark);
//                    echo "<br /><======><br />";


//                    echo $mark->LatLong;
//                    echo "<br />";
//                    echo $mark->Title;
//                    echo "<br />";
//                    echo $mark->PinImage;
//                    echo "<br />";
                    echo urldecode($mark->DetailsHTML);
                    $urls = urldecode($mark->DetailsHTML);
                    echo "<br />";
                    echo "<hr />";

                    $inserts = "'" . $mark->LatLong . "'" . ", " . "'" .$mark->Title . "'" . ", " . "'" .$mark->PinImage . "'" . ", " . "'" . $urls . "'";


                    $query = "INSERT INTO markers (LatLong, Title, PinImage, DetailsHTML) VALUES " . "(" . $inserts . ")";
                    echo $query;
                    $result = $mysqli->query($query);

                }

			}

		}


//        $query = "SELECT * FROM markers";
//        $result = $mysqli->query($query);
//
//        $row = $result->fetch_array(MYSQLI_NUM);
//        printf ("%s (%s)\n", $row[0], $row[1]);

//		$xml=simplexml_load_file("note.xml") or die("Error: Cannot create object");
//		print_r($xml);
//		echo $xml->getName();
		$uploadOk = 0;
	}
}