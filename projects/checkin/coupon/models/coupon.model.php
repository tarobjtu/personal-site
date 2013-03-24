<?php
	
	class Coupon{
		
		/*
			The find static method selects coupons
			from the database and returns them as
			an array of Coupon objects.
		*/
		
		public static function find($arr = array()){
			global $db;
			
			if(empty($arr)){
				$st = $db->prepare("SELECT * FROM coupon");
			}
			else if($arr['id']){
				$st = $db->prepare("SELECT * FROM coupon WHERE id=:id");
			}
			else{
				throw new PDOException("Coupon::find  Unsupported property!");
			}
			
			$st->execute($arr);
			
			// Returns an array of Coupon objects:
			return $st->fetchAll(PDO::FETCH_CLASS, "coupon");
		}
		
		/*
			The update static method update the 
			database of coupon and returns row number 
			which row is updated.
		*/
		public static function update($arr = array()){
			global $db;
			
			if($arr['id']){
				$st = $db->prepare("UPDATE coupon SET number=:number WHERE id=:id");
			}
			else{
				throw new PDOException("Coupon::update  Unsupported property!");
			}
			
			// Returns row number which row is updated.
			return $st->execute($arr);
		}
		
	}
	
?>