<?php
	
	function csv_to_array($url){
		$file = fopen($url, "r");
		$ret = array();
		$count = -1;
		while(! feof($file)){
			$count++;
			$arr = fgetcsv($file);
			if($arr){
				$ret[$count] = $arr;
			}
		}
		fclose($file);
		return $ret;
	}
	
	function is_csv($url){
		$patten = "/\.csv$/i";
		if( preg_match($patten, $url, $matches) ) {
			return true;
		}
		return false;
	}
	
	function is_html($url){
		$patten = "/\.(html|htm)$/i";
		if( preg_match($patten, $url, $matches) ) {
			return true;
		}
		return false;
	}
	
	function get_indent($template, $search){
		$_search = str_replace(array('[', ']'), array('\[', '\]'), $search);
		$patten = '/\t*'.$_search.'/';
		if(preg_match($patten, $template, $matches)){
			return str_replace($search, "", $matches[0]);
		}
		return "";
	}
	
	function create_file($dir, $html, $def_folder = "../result"){
		if(substr($dir, 0, 1) != "/"){
			$_dir = $def_folder . "/" . $dir;
		}
		else{
			$_dir = $def_folder . $dir;
		}
		
		$arr = explode("/", $_dir);
		
		/* To create the folder where the file be saved. */
		for($i=0; $i<count($arr)-1; $i++){
			if($arr[$i]){
				if($i > 0 && trim($arr[$i-1])){
					$arr[$i] = $arr[$i-1] . "/" . $arr[$i];
					if(! is_dir($arr[$i])){
						mkdir($arr[$i]);
					}
				}
			}
		}
		
		/* To create the file */
		$patten = '/\.(html|htm)$/i';
		if($arr[$i]){
			if(! preg_match($patten, $arr[$i])){
				return array(false, "'$dir' can not be a file path.");
			}
			else{
				$arr[$i] = $arr[$i-1] . "/" . $arr[$i];
			}
		}
		else{
			$arr[$i] = $arr[$i-1] . "/" . 'index.html';
		}
		if(! is_file($arr[$i])){
			file_put_contents($arr[$i], $html);
			return array(true, $arr[$i]);
		}
		else {
			return array(false, "Failed to create file " . $arr[$i]);
		}
	}
	
	/* 
	 * 功能：对数组的每一个值进行URL字符编码
	 * 目的：调用PHP的json_encode方法把array转化为json格式时，汉字或日文会被转化为unicode格式字符。
	 * 为了避免被转化为unicode字符，先使用urlencode对array中的每一个key与value进行编码。
	 */
	function arrayRecursive(&$array, $function, $apply_to_keys_also = false) {
		foreach ($array as $key => $value) {
			if (is_array($value)) {
				arrayRecursive($array[$key], $function, $apply_to_keys_also);
			} else {
				$array[$key] = $function($value);
			}

			if ($apply_to_keys_also && is_string($key)) {
				$new_key = $function($key);
				if ($new_key != $key) {
					$array[$new_key] = $array[$key];
					unset($array[$key]);
				}
			}
		}
	}
	
?>