/*
 * author : qitao 祁涛 チータオ
 * website : http://www.tarobjtu.com
 *
 */

(function( $, window, document, undefined ) {
	
	/*
	 * Define window.console method only if it doesn't exist. 
	 */
	window.console || ( window.console = { log : function( arg ){ window.alert( arg ); } } );
	
	
	/*
	 * Stop all the animation for style test.
	 */
	//jQuery.fx.off = true;
	
	
	// After page loaded.
	$( function() {
		setTimeout( start, 1000 );
	} );

	$( '.popup' ).find( '.close' ).on( 'click',  close );
	//$( window ).on( 'scroll', update );
	
	function close() {
		popup.hide();
	}
	
	function start() {
		popup.show();
	}
	
	function update() {
		var pos = $( window ).scrollTop();
		
		if(pos >= 1500){
			if( !popup.isVisible() ) {
				popup.show();
			}
		}
		
		if(pos < 1300){
			if( popup.isVisible() ) {
				popup.hide();
			}
		}
	}
	
	/*
	 * All the animations 
	 */
	var popup = ( function() {
	
		var $container = $( '.popup' );
		var $logo = $( '.popup' ).find( '.logo img' );
		var $main = $( '.popup' ).find( '.main' );
		var $advise = $( '.popup' ).find( '.main h2' );
		var $browsers = $( '.popup' ).find( '.browser li' );
		var $titles = $( '.popup' ).find( '.title li' );
		var $thumbnail = $( '.popup' ).find( '.thumbnail img' );
		var $words = $( '.popup' ).find( '.words li' );
		var $close = $( '.popup' ).find( '.close' );
		var height = $container.height();
		var visible = false;
		
		(function init(){
		}());
		
		var show = function(){
			visible = true;
			$container.show();
			$.when( logoRise() )
			 .then( slideDown )
			 .then( adviseRise )
			 .then( browserRise )
			 .then( profileThumbnailLeft )
			 .then( profileTitleSlideLeft )
			 .then( profileWordsSlideLeft )
			 .then( closeDisplay );
		};
		
		var hide = function(){
			visible = false;
			$.when( closeDisappear() )
			 .then( profileWordsSlideRight )
			 .then( profileTitleSlideRight )
			 .then( profileThumbnailRight )
			 .then( browserDown )
			 .then( adviseDown )
			 .then( slideUp )
			 .then( logoDown );
		};
		
		var isVisible = function(){
			return visible;
		}
		
		
		/*
		 * The following functions are inner ones. 
		*/
		
		/* ::::::::::::::::::show:::::::::::::::::: */
		
		function logoRise(){
			var dfd = $.Deferred();
			$logo.stop(true, true).animate({top : -18}, 1000, 'easeOutBounce', dfd.resolve );
			return dfd.promise();
		}
		
		function slideDown(){
			var dfd = $.Deferred();
			$main.show();
			$main.animate( {width : '100%', left : 0}, 800 );
			$main.animate( {height : 150}, 500, dfd.resolve );
			return dfd.promise();
		}
		
		function adviseRise(){
			var dfd = $.Deferred();
			$advise.animate( {top : 10}, 800, 'easeInOutCubic', function(){
				adviseUtil.normal();
				dfd.resolve();
			} );
			return dfd.promise();
		}
		
		function browserRise(){
			var dfd = $.Deferred();
			var delayTime = 300;
			var counter = 0;
			
			$browsers.each( function(){
				$(this).delay( delayTime ).animate( {top : 50}, 1500, 'easeOutElastic', function(){
					counter++;
					if( counter === $browsers.length ){
						dfd.resolve();
					}
				} );
				delayTime += 100;
			});
			
			return dfd.promise();
		}
		
		function profileThumbnailLeft(){
			var dfd = $.Deferred();
			$thumbnail.animate( {left : 0}, 800, 'easeOutCubic', dfd.resolve);
			return dfd.promise();
		}
		
		function profileTitleSlideLeft(){
			var dfd = $.Deferred();
			var delayTime = 0;
			var distance = 0;
			var counter = 0;
			
			$titles.each( function(){
				$(this).delay(delayTime).animate( {left : distance}, 1000, 'easeOutCubic', function(){
					counter++;
					if( counter === $titles.length ){
						dfd.resolve();
					}
				} );
				delayTime += 150;
				distance += 24;
			} );
			
			return dfd.promise();
		}
		
		function profileWordsSlideLeft(){
			var dfd = $.Deferred();
			var delayTime = 0;
			var counter = 0;
			
			$words.each( function(){
				$(this).delay(delayTime).animate( {left : 0}, 1000, 'easeOutCubic', function(){
					counter++;
					if( counter == $words.length ){
						dfd.resolve();
					}
				} );
				delayTime += 150;
			} );
			
			return dfd.promise();
		}
		
		function closeDisplay(){
			var dfd = $.Deferred();
			
			$close.fadeIn(300);
			$close.animate( {
					right : 600, 
					top : -250
			}, 1000, 'easeInOutQuad' );
			$close.animate( {
					right : [ 800, 'easeInQuad' ], 
					top : [ -400, 'easeOutQuad' ]
			}, 600  );
			$close.animate( {
					right : [ 1000, 'easeOutQuad' ], 
					top : [ -250, 'easeInQuad' ]
			}, 600  );
			$close.animate( {
					right : [ 600, 'easeInQuad' ], 
					top : [ -100, 'easeOutQuad' ]
			}, 800  );
			$close.animate( {
					right : [ 450, 'easeOutQuad' ], 
					top : [ -170, 'easeInQuad' ]
			}, 300  );
			$close.animate( {
					right : [ 550, 'easeInQuad' ], 
					top : [ -240, 'easeOutQuad' ]
			}, 300  );
			$close.animate( {
					right : [ 650, 'easeOutQuad' ], 
					top : [ -170, 'easeInQuad' ]
			}, 300  );
			$close.animate( {
					right : [ 10, 'easeInQuad' ], 
					top : [ -15, 'easeOutQuad' ]
			}, 800, dfd.resolve );
			
			return dfd.promise();
		}
		
		
		/* ::::::::::::::::::hide:::::::::::::::::: */
		
		function logoDown(){
			var dfd = $.Deferred();
			$logo.stop(true, true).animate({top : 160}, 1000, 'easeInOutBack', function(){
				$container.hide();
				dfd.resolve();
			});
			return dfd.promise();
		}
		
		function slideUp(){
			var dfd = $.Deferred();
			$main.animate({height : 1}, 500);
			$main.animate({width : 1, left : '50%'}, 800);
			$main.hide(1, dfd.resolve);
			return dfd.promise();
		}
		
		function adviseDown(){
			var dfd = $.Deferred();
			adviseUtil.down();
			$advise.animate( {top : 150}, 800, 'easeInOutBack', function(){
				adviseUtil.up();
				dfd.resolve();
			} );
			return dfd.promise();
		}
		
		function browserDown(){
			var dfd = $.Deferred();
			var delayTime = 200 * $browsers.length;
			var counter = 0;
			
			$browsers.each(function(index){
				var $that = $(this);
				$that.delay( delayTime ).animate( {top : 150}, 1000, 'easeInOutBack', function(){
					counter++;
					if( counter == $browsers.length ) {
						dfd.resolve();
					}
				});
				delayTime -= 200;
			});
			
			return dfd.promise();
		}
		
		function profileThumbnailRight(){
			var dfd = $.Deferred();
			$thumbnail.animate( {left : 1000}, 1200, 'easeInCubic', dfd.resolve);
			return dfd.promise();
		}
		
		function profileTitleSlideRight(){
			var dfd = $.Deferred();
			var delayTime = 150 * ( $titles.length - 1 );
			var counter = 0;
			
			$titles.each( function(){
				$(this).delay(delayTime).animate( {left : 1000}, 1500, 'easeInCubic', function(){
					counter++;
					if( counter === $titles.length ){
						dfd.resolve();
					}
				} );
				delayTime -= 150;
			} );
			
			return dfd.promise();
		}
		
		function profileWordsSlideRight(){
			var dfd = $.Deferred();
			var delayTime = 150 * ( $words.length - 1 );
			var counter = 0;
			
			$words.each( function(){
				$(this).delay(delayTime).animate( {left : 1000}, 1500, 'easeInCubic', function(){
					counter++;
					if( counter === $words.length ){
						dfd.resolve();
					}
				} );
				delayTime -= 150;
			} );
			
			return dfd.promise();
		}
		
		function closeDisappear(){
			var dfd = $.Deferred();
			$close.fadeOut( 1500, dfd.resolve );
			return dfd.promise();
		}
		
		
		/* ::::::::::::::::::Util:::::::::::::::::: */
		
		var adviseUtil = (function(){
			
			var $image = $advise.find( 'img' );
			var src = $image.attr( 'src' );
			
			function normal(){
				src = src.replace(/_up/, '' );
				$image.attr( 'src', src);
			}
			
			function down(){
				src = src.replace(/\.png/, '_down.png' );
				$image.attr( 'src', src);
			}
			
			function up(){
				src = src.replace(/\_down.png/, '_up.png' );
				$image.attr( 'src', src);
			}
			
			return {
				up : up,
				down : down,
				normal : normal
			};
			
		}());
		
		return {
			show : show,
			hide : hide,
			isVisible : isVisible
		};
		
	})();
	
})(jQuery, window, document);