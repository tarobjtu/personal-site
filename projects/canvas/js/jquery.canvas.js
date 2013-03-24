$(function(){
	var $container = $('#wrap'),
		$board = $('#board'),
		$dashboard = $('#dashboard'),
		$export = $('#export-button'),
		param = [100, 300, 50, 50, 350, 160, 330, 300],
		drawList = [];
	
	draw();
	write();
	
	$dashboard.on('change', 'input', function(){
		$('#jqueryCanvas').remove();
		//console.log(typeof this.value);
		//console.log(typeof this.id);
		param[parseInt(this.id)] = parseInt(this.value);
		draw();
		write();
	});
	$('#save-button').on('click', function(){
		$export.removeProp('disabled');
		drawList.push([].concat(param));
		//console.log(drawList);
	});
	$export.on('click', function(){
		
	});
	
	function draw(){
		var $canvas = $('<canvas>')
					.attr({
						id     : 'jqueryCanvas',
						width  : 400,
						height : 400
					})
					.insertBefore($board),
			canvas = $canvas.get(0),
			ctx = canvas.getContext('2d');
		
		drawExist(ctx);
		
		// bezier curve
		ctx.beginPath();
		ctx.moveTo(param[0],param[1]);
		ctx.bezierCurveTo(param[2],param[3],param[4],param[5],param[6],param[7]);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'green';
		ctx.stroke();
		
		// begin point
		point(ctx, param[0], param[1]);
		text(ctx, 'begin point', param[0]-30, param[1]+20);
		// control 01 point
		point(ctx, param[2], param[3]);
		text(ctx, 'control point 1', param[2]-30, param[3]-10);
		// control 02 point
		point(ctx, param[4], param[5]);
		text(ctx, 'control point 2', param[4]-30, param[5]-10);
		// end point
		point(ctx, param[6], param[7]);
		text(ctx, 'end point', param[6]-30, param[7]+20);
		
		// Draw a line from begin to control01
		line(ctx, param[0], param[1], param[2], param[3]);
		// Draw a line from control01 to control02
		line(ctx, param[2], param[3], param[4], param[5]);
		// Draw a line from control02 to end
		line(ctx, param[4], param[5], param[6], param[7]);
		
		var cp01x = (param[2]+param[0])/2,  // center point of begin-control01 point
			cp01y = (param[3]+param[1])/2,	// center point of begin-control01 point
			cp02x = (param[4]+param[2])/2,	// center point of control01-control02 point
			cp02y = (param[5]+param[3])/2,	// center point of control01-control02 point
			cp03x = (param[6]+param[4])/2,	// center point of control02-end point
			cp03y = (param[7]+param[5])/2;	// center point of control02-end point
			
		//console.log("(" + cp01x + "," + cp01y + ")");
		//console.log("(" + cp02x + "," + cp02y + ")");
		//console.log("(" + cp03x + "," + cp03y + ")");
		
		// center point of the line from begin to control02
		smallPoint(ctx, cp01x, cp01y);
		// center point of the line from control01 to control02
		smallPoint(ctx, cp02x, cp02y);
		// center point of the line from control02 to end
		smallPoint(ctx, cp03x, cp03y);
		
		// Draw a line from cp01 to cp02
		line(ctx, cp01x, cp01y, cp02x, cp02y);
		// Draw a line from cp02 to cp03
		line(ctx, cp02x, cp02y, cp03x, cp03y);
		
		var ccp01x = (cp01x + cp02x)/2,
			ccp01y = (cp01y + cp02y)/2,
			ccp02x = (cp03x + cp02x)/2,
			ccp02y = (cp03y + cp02y)/2;
		
		// center point of the line from cp01 to cp02
		smallPoint(ctx, ccp01x, ccp01y);
		// center point of the line from cp02 to cp03
		smallPoint(ctx, ccp02x, ccp02y);
		
		// Draw a line from ccp01 to ccp02
		line(ctx, ccp01x, ccp01y, ccp02x, ccp02y);
		
	}
	
	function write(){
		var string = 'ctx.moveTo('+param[0]+', '+param[1]+');<br>';
			string += 'ctx.bezierCurveTo('+param[2]+', '+param[3]+', '+ param[4]+', '+param[5]+', '+param[6]+', '+param[7]+');';
		$('#show').html(string);
	}
	
	function drawExist(ctx){
		for(var i=0, l=drawList.length; i<l; i++){
			bezier(ctx, drawList[i]);
		}
	}
	
	function bezier(ctx, bparam){
		ctx.beginPath();
		ctx.moveTo(bparam[0], bparam[1]);
		ctx.bezierCurveTo(bparam[2],bparam[3],bparam[4],bparam[5],bparam[6],bparam[7]);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'green';
		ctx.stroke();
	}
	
	// Draw a point
	function point(ctx, x, y){
		var radius = 3;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2*Math.PI, false);
		ctx.lineWidth = 6;
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}
	
	// Draw a point
	function smallPoint(ctx, x, y){
		var radius = 2;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2*Math.PI, false);
		ctx.lineWidth = 4;
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}
	
	function line(ctx, fx, fy, tx, ty){
		ctx.beginPath();
		ctx.moveTo(fx, fy);
		ctx.lineTo(tx, ty);
		ctx.lineWidth = 1;
		ctx.stroke();
	}
	
	function text(ctx, content, x, y){
		ctx.font = '10pt Arial';
		ctx.fillText(content, x, y);
	}
	
});