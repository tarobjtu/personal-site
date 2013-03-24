(function ( $, window ) {
	
	var document = window.document;
	
	(function () {
		//SyntaxHighlighter.defaults['highlight'] = alternateRow();
		function alternateRow() {
			var arr = [];
			for(var i=0; i<2000; i++){
				arr[i] = i*2;
			}
			return arr;
		}
	})();
	
	/* Render the Form01 (Step01 and Step02) */
	(function () {
		var $form01 = $( '#form01' );
		var form01File = $form01.find( 'input[type=file]' )[0];
		var $csvTable = $( '#csv-table' );
		var $csvTableInfo = $( '#csv-table-info' );
		var $options = $( '#select-file-name' );
		var $error = $( '#step02 .error' );
			
		$form01.submit( onSubmit );
			
		function onSubmit(){
			var formData, xhr;
			
			if( !window.FormData ) {
				alert('Please use Chrome, Safari, Firefox or IE10+');
				return;
			}
				
			formData = new FormData();
			formData.append( 'id', 'form01' );
			formData.append( 'csv', form01File.files[0] );
				
			$.ajax({
				url : 'php/controller/render.php',
				type : 'POST',
				data : formData,
				processData : false,
				contentType : false,
				success : onSuccess,
				error : onError
			});
				
			return false;
		}
			
		function onSuccess( data ) {
			//console.log( 'Form01 OK: ', data );
			if( $.isArray(data) ) {
				$csvTable.html( drawTable( data ) );
				$csvTableInfo.html( setTableInfo( data ) );
				$options.html( setOptions( data[0] ) );
				$error.html( '' );
			}
			else {
				$error.html( data );
			}
		}
			
		function onError( data ) {
			console.log( 'Form01 Error: ', data );
		}
		
		function drawTable( data ) {
			var html = drawTHead( data[0] );
			html += '<tbody>';
			for( var i=1, l=data.length; i<l; i++ ) {
				html += drawTBody( data[i] );
			}
			html += '</tbody>';
			return html;
		}
			
		function drawTHead( data ) {
			var html = '<thead><tr>';
			for( var i=0, l=data.length; i<l; i++ ) {
				html += '<th>' + data[i] + '</th>';
			}
			html += '</tr></thead>';
			return html;
		}
		
		function drawTBody( data ) {
			var html = '<tr>';
			for( var i=0, l=data.length; i<l; i++ ) {
				html += '<td>' + data[i] + '</td>';
			}
			html += '</tr>';
			return html;
		}
		
		function setTableInfo( data ) {
			var html = 'The csv file information: &nbsp;&nbsp;';
			html += data.length + 'row (include the title); &nbsp;&nbsp;&nbsp;';
			html += data[0].length + 'column.';
			return html;
		}
		
		function setOptions( data ) {
			var html = '';
			for( var i=0, l=data.length; i<l; i++ ) {
				html += '<option value="' + i + '">' + data[i] + '</option>';
			}
			return html;
		}
				
	})();
	
	/* Render the Form02 */
	(function () {
		var $form02 = $( '#form02' );
		var form02File = $form02.find( 'input[type=file]' )[0];
		var $form02Output = $( '#form02-output' );
		
		$form02.submit( onSubmit );
		
		function onSubmit(){
			var formData, xhr;
			
			if( !window.FormData ) {
				alert('Please use Chrome, Safari, Firefox or IE10+');
				return;
			}
				
			formData = new FormData();
			formData.append( 'id', 'form02' );
			formData.append( 'html', form02File.files[0] );
				
			$.ajax({
				url : 'php/controller/render.php',
				type : 'POST',
				data : formData,
				processData : false,
				contentType : false,
				success : onSuccess,
				error : onError
			});
				
			return false;
		}
		
		function onSuccess( data ) {
			//console.log( 'Form02 OK: ', data );
			var $divForm02Output = $( 'div#form02-output' );
			if( $divForm02Output.get(0) ) {
				$form02Output = clear( $divForm02Output );
			}
			$form02Output.html( data );
			SyntaxHighlighter.highlight();
		}

		function onError( data ) {
			console.log( 'Form02 Error: ', data );
			$form02Output.html( data );
		}
		
		function clear( target ) {
			var $form02Output = $( 'pre#form02-output' );
			if( !$form02Output.get(0) ) {
				var $parent = target.parent();
				target.remove();
				$form02Output = $('<pre id="form02-output" class="brush: html;"></pre>');
				$parent.append( $form02Output );
				return $form02Output;
			}
		}

	})();
	
	/* Render the Generate form */
	(function () {
		var $generate = $( '#generate' );
		var $options = $( '#select-file-name' );
		var $report = $( 'table#report' );
		var $modal = $( '.modal' );
		var $modalBG = $modal.find( '.grey-bg' );
		var $link = $modal.find( '#link' );
		var $linkData = $link.find( 'span' );
		
		$modalBG.on( 'click', function() {
			$modal.fadeOut();
		} );
		
		$generate.submit( onSubmit );
		
		function onSubmit(){
			var formData, xhr;
			
			if( !window.FormData ) {
				alert('Please use Chrome, Safari, Firefox or IE10+');
				return;
			}
			
			formData = new FormData();
			formData.append( 'id', 'generate' );
			formData.append( 'file_name_column', $options.find(':selected').attr('value') );
				
			$.ajax({
				url : 'php/controller/render.php',
				type : 'POST',
				data : formData,
				processData : false,
				contentType : false,
				success : onSuccess,
				error : onError
			});
			
			return false;
		}
		
		function onSuccess( data ) {
			console.log( 'Generate OK: ', data );
			$report.html( drawTable( data ) );
			$report.append( drawLink( data[data.length-1] ) );
			$modal.fadeIn();
		}
		
		function onError( data ) {
			console.log( 'Generate Error: ', data );
		}
		
		function drawLink( link ) {
			$link.attr( 'href', link[1] );
			$linkData.html( link[1] );
		}
		
		function drawTable( data ) {
			var html = drawTHead( data[0] );
			html += '<tbody>';
			for( var i=1, l=data.length; i<l-1; i++ ) {
				html += drawTBody( i, data[i] );
			}
			html += '</tbody>';
			return html;
		}
			
		function drawTHead( data ) {
			var html = '<thead><tr>';
			for( var i=0, l=data.length; i<l; i++ ) {
				html += '<th>' + data[i] + '</th>';
			}
			html += '</tr></thead>';
			return html;
		}
		
		function drawTBody( i, data ) {
			var html = '';
			if( !data[0] ){
				html = '<tr class="t-error">';
			}
			else{
				html = '<tr>';
			}
			html += '<th>' + i + '</th>';
			html += '<td>' + data[1] + '</td>';
			html += '</tr>';
			return html;
		}
		
	})();
	
})( jQuery, window );