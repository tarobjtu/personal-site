<?php
	
	function getCoupon($coupons = array()){
		
		$total_coupon_number = 0;
		$numbers = array();
		$result = null;
		
		for($i = 0; $i < count($coupons); $i++){
			$coupon = $coupons[$i];
			$total_coupon_number += $coupon->number;
			$numbers[$i] = $coupon->number;
		}
		
		//There are coupons exist.
		if($total_coupon_number > 0){
			
			// $random >= 1
			// $random <= $total_coupon_number
			$random = rand(1, $total_coupon_number);
			
			$count = 0;
			for($j = 0; $j < count($numbers); $j++){
				$number = $numbers[$j];
				$count += $number;
				
				if($random <= $count){
					break;
				}
			}
			
			$result = $coupons[$j];
		}
		
		return $result;
		
	}
	
?>