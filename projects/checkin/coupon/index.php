<?php
	
	/*
		This is the index file of our website.
		It routes requets to the appropriate controllers
	*/
	
	require_once "main.php";
	
	try {
		
		if($_POST['check']){
			$c = new CheckController();
		}
		else if($_POST['checkin']){
			$c = new CheckinController();
		}
		else throw new Exception('Wrong page!');
		
		$c->handleRequest();
	}
	catch(Exception $e) {
		echo json_encode($e->getMessage());
	}
	
?>