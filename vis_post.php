<?php
/**
 * Created by PhpStorm.
 * User: Xurxo
 * Date: 06/10/2015
 * Time: 18:50
 */

$url = $_POST['url'];
echo "<a href='" . $url . "'>Go to the Web Site</a>";
echo "<br />";
$iframe = <<<FRAME
    <iframe src="$url" width="100%" height="800"></iframe>
FRAME;
echo $iframe;
echo "<br />";

$form = <<<FORM
    <form id="post" method="post" action="/wordpress/wp-content/plugins/TextAnalyzer/vis_metadata.php">
        <input id="url" type="hidden" name="url" value="$url" />
        <input id="meta_submit" name="meta_submit" type="submit" value="METADATA" />
    </form>
FORM;

echo $form;
