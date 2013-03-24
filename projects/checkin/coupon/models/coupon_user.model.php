<?php
	
	class CouponUser{
		
		/*
			The find static method selects categories
			from the database and returns them as
			an array of CouponUser objects.
		*/
		
		public static function find($arr = array()){
			global $db;
			
			if(empty($arr)){
				$st = $db->prepare("SELECT * FROM coupon_user");
			}
			else if($arr['id']){
				$st = $db->prepare("SELECT * FROM coupon_user WHERE id=:id");
			}
			else{
				throw new Exception("Unsupported property!");
			}
			
			$st->execute($arr);
			
			// Returns an array of CouponUser objects:
			return $st->fetchAll(PDO::FETCH_CLASS, "coupon_user");
		}
	}
	
?>