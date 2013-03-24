<?php
	require_once "../util/util.php";
	require_once "requestHandler.php";
	require_once "generateHandler.php";
	
	if( $_POST["id"] == "form01" ) {
		form01_handler();
	}
	else if( $_POST["id"] == "form02" ) {
		form02_handler();
	}
	else if( $_POST["id"] == "generate" ) {
		generate_handler();
	}
	
?>