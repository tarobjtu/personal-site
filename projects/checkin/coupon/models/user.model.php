<?php
	
	class User{
		
		// The find static method returns an array
		// with User objects from the database.
		
		public static function find($arr){
			global $db;
			
			if(empty($arr)){
				$st = $db->prepare("SELECT * FROM user");
			}
			else if($arr['id']){
				$st = $db->prepare("SELECT * FROM user WHERE id=:id");
			}
			else{
				throw new PDOException("User::find  Unsupported property!");
			}
			
			$st->execute($arr);
			
			return $st->fetchAll(PDO::FETCH_CLASS, "user");
		}
		
		// Insert the user info into the user table.
		public static function insert($arr){
			global $db;
			
			if($arr['id']){
				$st = $db->prepare("INSERT INTO user VALUES (:id, :name)");
			}
			else{
				throw new PDOException("User::insert  Unsupported property!");
			}
			
			return $st->execute($arr);
		}
		
	}
	
?>