<?php
	session_start();
	require_once "../util/util.php";
	require_once "../util/HZip.php";
	
	function generate_handler() {
		
		// Parameter validate
		if(! isset($_POST["file_name_column"], $_SESSION["csv_file_url"], $_SESSION["html_file_url"]) ) {
			echo "Please first upload csv and html file.";
			return;
		}
		
		// When the replacements are complex, please write the complex modules by yourself like this.
		$complex_mode = false;
		
		$index = (int)$_POST["file_name_column"];
		$csv_file_url = $_SESSION["csv_file_url"];
		$html_file_url = $_SESSION["html_file_url"];
		$result_folder = "../../result/" . session_id() . time();
		$zip_folder = "../../result/out" . time() . ".zip";
		
		//var_dump($index);
		//var_dump( isset($index, $csv_file_url, $html_file_url) );
		//var_dump($csv_file_url);
		//var_dump($html_file_url);
		
		// When the replacements are complex, please write the complex modules by yourself like this.
		if( $complex_mode ) {
			$applications = csv_to_array("applications.csv");
			$species = csv_to_array("class.csv");
		}
	
		$table = csv_to_array($csv_file_url);
		$template = file_get_contents($html_file_url);
		$report = array();
		$search = array();
		$counter = -1;
		
		foreach( $table as $row ){
			$counter++;
			if( $counter == 0 ){
				$search = assemble_search_array( $row );
				$report[$counter] = array( 'No.', 'File name' );
				continue;
			}
			
			// When the replacements are complex, please write the complex modules by yourself like this.
			if( $complex_mode ) {
				$module01 = html_module01($row, $applications, get_indent($template, "[[module01]]"));
				$module02 = html_module02($row, $species, get_indent($template, "[[module02]]"));
				$search = array_merge( $search, array( "[[module01]]", "[[module02]]" ) );
				$replace = array_merge( $row, array( $module01, $module02 ) );
				$html = str_replace($search, $replace, $template);
			}
			else {
				$html = str_replace($search, $row, $template);
			}
			
			$report[$counter] = create_file( $row[$index], $html, $result_folder );
			if( $report[$counter][0] ){
				$report[$counter][1] = str_replace( $result_folder, '', $report[$counter][1] );
			}
		}
		
		// Compress the generated HTML files with zip. 
		HZip::zipDir( $result_folder, $zip_folder );
		$report[++$counter] = array( 'url', 'result/' . pathinfo( $zip_folder, PATHINFO_BASENAME ) );
		
		header('Content-type: text/json');
		// encode the Chinese like GB2312 or Japanese like Shift-JS
		arrayRecursive( $report, 'urlencode', false );
		$json_with_unicode = json_encode( $report );
		$json = urldecode( $json_with_unicode );
		echo $json;
	}
	
	function assemble_search_array($arr){
		$ret = array();
		for($i=0; $i<count($arr); $i++){
			$ret[$i] = '[' . $arr[$i] . ']';
		}
		return $ret;
	}
	
	
	function html_module01($arr, $applications, $indent){
		$html = '';
		for($i=5; $i<=11; $i++){
			if(trim($arr[$i]) == null){
				break;
			}
			$url = get_applications_url($applications, $arr[$i]);
			if($i == 5){
				$html .= '<li class="m-text-button3">'."\n$indent";
				$html .= "\t".'<a href="'.$url.'">'.$arr[$i].'</a>'."\n$indent";
			}
			else if($i >= 6 && $i <= 7){
				$html .= '</li><li class="m-text-button3">'."\n$indent";
				$html .= "\t".'<a href="'.$url.'">'.$arr[$i].'</a>'."\n$indent";
			}
			else{
				$html .= '</li><li class="m-text-button3 g-mt15">'."\n$indent";
				$html .= "\t".'<a href="'.$url.'">'.$arr[$i].'</a>'."\n$indent";
			}
		}
		$html .= '</li>';
		return $html;
	}
	
	function html_module02($arr, $species, $indent){
		$html = '';
		$counter = -1;
		for($i=13; $i<=31; $i++){
			$counter++;
			if($counter == 0){
				$html .= '<li class="first">'."\n$indent";
			}
			else if($counter == 15){
				$html .= '</li><li class="bb br">'."\n$indent";
			}
			else if($counter == 16){
				$html .= '</li><li class="first bb">'."\n$indent";
			}
			else if($counter == 17){
				$html .= '</li><li class="second bb">'."\n$indent";
			}
			else if($counter == 18){
				$html .= '</li><li class="bb br">'."\n$indent";
			}
			else if($counter%4 == 0){
				$html .= '</li><li class="first">'."\n$indent";
			}
			else if($counter%4 == 1){
				$html .= '</li><li class="second">'."\n$indent";
			}
			else if($counter%4 == 2){
				$html .= '</li><li>'."\n$indent";
			}
			else if($counter%4 == 3){
				$html .= '</li><li class="br">'."\n$indent";
			}
			
			$on = true;
			if(trim($arr[$i]) == null){
				$on = false;
			}
			if($on){
				$html .= "\t".'<a href="'.$species[$counter][1].'">'.$species[$counter][0].'</a>'."\n$indent";
			}
			else{
				$html .= "\t".'<span class="m-matrix-button2-top"></span>'."\n$indent";
				$html .= "\t".'<span class="m-matrix-button2-middle">'.$species[$counter][0].'</span>'."\n$indent";
				$html .= "\t".'<span class="m-matrix-button2-bottom"></span>'."\n$indent";
			}
		}
		$html .= '</li>';
		
		return $html;
	}
	
	function get_applications_url($arr, $key){
		foreach($arr as $app){
			if($app[0] == $key){
				return $app[1];
			}
		}
		return "#";
	}
	
?>