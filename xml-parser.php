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

//		echo "<br />";


        $query = "SELECT * FROM markers";
        $result = $mysqli->query($query);

        $row = $result->fetch_array(MYSQLI_NUM);
        $result->free();
//        printf ("%s (%s)\n", $row[0], $row[1]);



        /*echo "<br />";
        echo "<hr />";*/


        $ii = 0;
		foreach($xml->children()->children() as $marker) {
			$ii++;
			if($ii==9) {
                foreach($marker->children() as $mark) {
                    //print_r($mark);
                    echo "<br /><======><br />";

                    /*echo $mark->LatLong;
                    echo "<br />";
                    echo $mark->Title;
                    echo "<br />";
                    echo $mark->PinImage;
                    echo "<br />";*/

                    $urls = urldecode($mark->DetailsHTML);

                    /*echo $urls;
                    echo "<br />";*/

                    $pos = strpos($urls, 'href="');

//                    echo $pos;

                    $array_urls = explode("<", $urls);
                    $ii = 0;
                    $jj = 0;
                    $titles = [];
                    $links = [];
                    $final_link = [];
                    foreach($array_urls as $node) {
                        /*echo $node;
                        echo "<br />";*/

                        $ii++;

                        $str_to_find = "href=";
                        /*echo "Trying to find ->" . $str_to_find . "<- in =>" . $node;
                        echo "<br />";
                        echo "Position = " . strpos($node, $str_to_find);
                        echo "<br />";*/
                        if($pos = strpos($node, $str_to_find)) {

                            $links[$jj] = substr($node, $pos + 6);
                            $str2 = '"';
                            $pos2 = strpos($links[$jj], $str2);
                            $final_link[$jj] = substr($node, $pos + 6, $pos2);
//                            echo "<br /> -------->" . $final_link[$jj] . "<br />";

                            $titles[$jj] = $array_urls[$ii - 3];

                            if($pos3 = strpos($titles[$jj], ">")) {
                                $titles[$jj] = substr($titles[$jj], $pos3 + 1);
                            }

                            $jj++;

                        }

                    }
                    print_r($titles);
                    print_r($final_link);


                    // TODO check if they're already in database

                    echo "<br />";
                    echo "<hr />";

                    // Insert into markers
                    $inserts = "'" . $mark->LatLong . "'" . ", " . "'" . $mark->Title . "'" . ", " . "'" . $mark->PinImage . "'" . ", " . "'" . $urls . "'";
                    $query = "INSERT INTO markers (LatLong, Title, PinImage, DetailsHTML) VALUES " . "(" . $inserts . ")";
//                    echo $query;
                    $result = $mysqli->query($query);

                    // Insert into URLs
                    $query2 = "SELECT Id FROM markers WHERE Title='" . $mark->Title . "'";
                    $result = $mysqli->query($query2);

//                    echo "<br />";
//                    print_r($result->fetch_assoc());
                    $id_marker = $result->fetch_assoc()['Id'];

                    $kk = 0;
                    foreach($titles as $entry) {
                        $inserts = "'" . $result . "'" . ", " . "'" . $entry . "'" . ", " . "'" . $final_link[$kk] . "'";
                        $query3 = "INSERT INTO urls (Id_marker, Title_URL, URL) VALUES " . "(" . "";

                        $kk++;
                    }



                } // end foreach marker

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