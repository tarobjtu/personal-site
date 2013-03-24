<?php
	require_once "../util/util.php";
	
	function form01_handler() {
		
		if(! isset($_FILES["csv"]) ) {
			echo "Please first upload a csv file.";
			return;
		}
		
		$url = upload_file($_FILES["csv"], "data");
		
		if( $url && is_csv($url) ){
			$_SESSION["csv_file_url"] = $url;
			header('Content-type: text/json');
			$arr = csv_to_array($url);
			arrayRecursive($arr, 'urlencode', false);
			$json_with_unicode = json_encode( $arr );
			$json = urldecode( $json_with_unicode );
			echo $json;
		}
		else{
			echo "The uploaded file is not a csv file.";
		}
	}
	
	function form02_handler() {
		$url = upload_file($_FILES["html"], "template");
		
		if( $url && is_html($url) ){
			$_SESSION["html_file_url"] = $url;
			echo htmlspecialchars(file_get_contents($url));
		}
		else{
			echo "Error: The uploaded file is not a html file.";	
		}
	}
	
	/* Upload a file from form */
	function upload_file($file, $name) {
		if( $file["error"] > 0 ) {
			echo "Error: " . $file["error"] . "<br />";	
		}
		else {
			// TODO: If upload folder doesn't exist create one.
			
			
			if( file_exists("../upload/".$file["name"]) ) {
				echo $file["name"] . " already exists. ";	
			}
			else {
				$patten = "/\.\w+$/";
				preg_match($patten, $file["name"], $matches);
				$dest = "../upload/" . $name  . time() . $matches[0];
				move_uploaded_file($file["tmp_name"], $dest);
			}
		}
		return $dest;
	}
	
	
?>