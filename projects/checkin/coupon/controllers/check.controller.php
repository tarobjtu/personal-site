<?php
	
	/* This controller check the coupon info
		and user have checked in or not.   */
	
	class CheckController{
		public function handleRequest(){
			
			//Check the user
			$uid = $_POST['uid'];
			$user_have_not_checkin = true;
			$coupon_exist = true;
			
			// If the user info doesn't exist, throw a exception.
			if(empty($uid)){
				throw new Exception("User id and name do not exist!");
			}
			
			// If the user get a coupon in duplicate.
			$user = User::find( array('id' => $uid) );
			if(!empty($user)){
				$user_have_not_checkin = false;
			}
			
			// If coupon doesn't exist.
			$coupons = Coupon::find();
			if(empty($coupons)){
				$coupon_exist = false;
			}
			
			// If coupon doesn't exist.
			$coupon = getCoupon($coupons);
			if(!$coupon){
				$coupon_exist = false;
			}
			
			// return JSON format data
			echo json_encode(array(
				'user_have_not_checkin' => $user_have_not_checkin,
				'coupon_exist' => $coupon_exist
			));
		}
	}
	
?>