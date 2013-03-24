<?php
	
	/* This controller renders the checkin */
	
	class CheckinController{
		public function handleRequest(){
			
			global $db;
			
			//Check the user
			$uid = $_POST['uid'];
			$uname = $_POST['uname'];
			
			// If the user info doesn't exist, throw a exception.
			if(empty($uid) || empty($uname)){
				throw new Exception("User id and name do not exist!");
			}
			
			// If coupon doesn't exist, throw a exception.
			$coupons = Coupon::find();
			if(empty($coupons)){
				throw new Exception("There is no coupon to fetch!");
			}
			
			// If coupon doesn't exist, throw a exception.
			$coupon = getCoupon($coupons);
			if(!$coupon){
				throw new Exception("Coupon doesn't exist and campaigin is over.");
			}
			
			
			// If the program goes to here
			// It means coupon exists and the user get a coupon in the first time. 
			// Congratulations! You are able to get a coupon only if the program 
			// failed to write user and coupon info into the database. Good luck! 
			
			try {
				
				//Begin a transaction, turning off autocommit.
				$db->beginTransaction();
				
				// Insert the user info into the user table.
				$user_insert_result = User::insert(array(
					'id' => $uid, 
					'name' => $uname
				));
				if(!$user_insert_result){
					throw new PDOException("Insert user failed.");
				}
				
				// Update the coupon table.
				$coupon_update_result = Coupon::update(array(
					'id' => $coupon->id,
					'number' => $coupon->number - 1
				));
				if(!$coupon_update_result){
					throw new PDOException("Update coupon failed.");
				}
				
				//If the two options both successed, commit them.
				$db->commit();
			}
			catch(Exception $e){
				//Recognize mistake and roll back the two options.
				$db->rollback();

				error_log( $e->getMessage() );
				
				throw new Exception( $e->getMessage() );
			}
			
			// return JSON format data
			echo json_encode(array(
				'result' => array(
					'success' => $coupon_update_result && $user_insert_result,
					'coupon_update_result' => $coupon_update_result,
					'user_insert_result' => $user_insert_result,
					'category' => $coupon->name
				)
			));
		}
	}
	
?>