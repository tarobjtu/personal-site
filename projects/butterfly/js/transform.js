$(function(){
	
	var $box01 = $('#box01'),
		$box02 = $('#box02'),
		$box03 = $('#box03'),
		$box04 = $('#box04'),
		$box06 = $('#box06'),
		count01 = 30, count02 = 1.5, count03 = 10, count04 = 0, count06 = 45,
		increase01 = 0.01, increase02 = 0.3, increase03 = 1,
		BOX01, BOX02, BOX03, BOX04, BOX06;
	
	
	$box01.on('click', function(){
		clearInterval(BOX01);
		BOX01 = setInterval(function(){startRotate($box01)}, 10);
	});
	$box02.on('click', function(){
		clearInterval(BOX02);
		BOX02 = setInterval(function(){startScale($box02)}, 10);
	});
	$box03.on('click', function(){
		clearInterval(BOX03);
		BOX03 = setInterval(function(){startSkew($box03)}, 10);
	});
	$box04.on('click', function(){
		clearInterval(BOX04);
		BOX04 = setInterval(function(){startTranslate($box04)}, 10);
	});
	$box06.on('click', function(){
		clearInterval(BOX06);
		BOX06 = setInterval(function(){startRotateY($box06)}, 10);
	});
		
	function startRotate($e){
		count01++;
		if(count01>=360){
			count01=0;
			clearInterval(BOX01);
		}
		$e.css({
			transform : 'rotate('+ count01 +'deg)',
			webkitTransform : 'rotate('+ count01 +'deg)',
			MozTransform : 'rotate('+ count01 +'deg)',
			msTransform : 'rotate('+ count01 +'deg)'
		});
	}
	
	function startScale($e){
		if(count02>=1.5 && count02 <= 2.5){
			count02 = count02 + increase01;
		}
		else if(count02 > 2.5){
			increase01 = -increase01;
			count02 = count02 + increase01;
		}
		else{
			count02 = 1.5;
			increase01 = -increase01;
			clearInterval(BOX02);
		}
		$e.css({
			transform : 'scale('+ count02 +',' + count02 + ')',
			webkitTransform : 'scale('+ count02 +',' + count02 + ')',
			MozTransform : 'scale('+ count02 +',' + count02 + ')',
			msTransform : 'scale('+ count02 +',' + count02 + ')'
		});
	}
	
	function startSkew($e){
		count03 = count03 + increase02;
		if(count03 >= 40){
			increase02 = -increase02;
		}
		else if(count03 < 10){
			increase02 = -increase02;
			count03 = 10;
			clearInterval(BOX03);
		}
		else{
			$e.css({
				transform : 'skew('+ count03 +'deg,' + (count03+5) + 'deg)',
				webkitTransform : 'skew('+ count03 +'deg,' + (count03+5) + 'deg)',
				MozTransform : 'skew('+ count03 +'deg,' + (count03+5) + 'deg)',
				msTransform : 'skew('+ count03 +'deg,' + (count03+5) + 'deg)'
			});
		}
	}
	
	function startTranslate($e){
		count04 = count04 + increase03;
		if(count04>=200){
			increase03 = -increase03;
		}
		else if(count04 < 0){
			count04 = 0;
			increase03 = -increase03;
			clearInterval(BOX04);
		}
		else{
			$e.css({
				transform : 'translate('+ count04 +'px,'+ count04/2 +'px)',
				webkitTransform : 'translate('+ count04 +'px,'+ count04/2 +'px)',
				MozTransform : 'translate('+ count04 +'px,'+ count04/2 +'px)',
				msTransform : 'translate('+ count04 +'px,'+ count04/2 +'px)'
			});
		}
	}
	
	function startRotateY($e){
		count06++;
		if(count06>405){
			count06=45;
			clearInterval(BOX06);
		}
		$e.css({
			transform : 'rotateY('+ count06 +'deg)',
			webkitTransform : 'rotateY('+ count06 +'deg)',
			MozTransform : 'rotateY('+ count06 +'deg)',
			msTransform : 'rotateY('+ count06 +'deg)'
		});
	}
	
});