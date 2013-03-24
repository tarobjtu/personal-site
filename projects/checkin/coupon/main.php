<?php
	
	/*
		This is the main include file.
		It is only used in index.php and keeps it much cleaner.
	*/
	
	require_once "config.php";
	require_once "connect.php";
	require_once "utils.php";
	require_once "models/coupon.model.php";
	require_once "models/coupon_user.model.php";
	require_once "models/user.model.php";
	require_once "controllers/checkin.controller.php";
	require_once "controllers/check.controller.php";
	
	// The content type of response is JSON file. 
	header('Content-type: application/json');
	
?>