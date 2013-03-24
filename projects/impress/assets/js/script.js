$(function(){
	
	var imp = impress();
	
	$('#arrowLeft').click(function(e){
		imp.prev();
		e.preventDefault();
	});
	
	$('#arrowRight').click(function(e){
		imp.next();
		e.preventDefault();
	});
	
	$('#animation-button').click(function(){
		$('#animated_div').toggleClass('animated_div_run');
	});

});
