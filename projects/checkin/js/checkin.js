
// The function assigned to window.fbAsyncInit is run as soon as the SDK is loaded. 
window.fbAsyncInit = function() {
	
	FB.init({
		appId      : '260874077337184', // App ID
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true,  // parse XFBML
		oauth      : true
	});
	
	var uid = "",
		uname = "",
		placeId = 306632109406994,
		$resultBox = $(".checkin-result"),
		parameter = {
			'message' : '今日私はチータオと言うプラザへ行って楽しかったです。',
			'picture' : 'http://www.tarobjtu.com/img/logo.jpg',
			'coordinates' : {
				'latitude' : '35.652730016065',
				'longitude' : '139.69054881759'
			},
			"place" : placeId
		};
	
	//checkin
	$(".wrapper").on("click", ".check-in", function(){

		FB.getLoginStatus(function(response){
		
			if (response.status === 'connected') {
				
				uid = response.authResponse.userID,
				// To get the user name
				FB.api('/me', function(user) {
					uname = user.name;
				});
				
				// To check if user duplicately checkin.
				FB.api(
					{
						method: 'fql.query',
						query: 'SELECT page_id FROM checkin WHERE author_uid= me() AND page_id=' + placeId
					},
					function(response) {
						// The user already checked.
						if(response.length){
							console.log("The user already checked.");
							$resultBox.html("Sorry, You have already checkin.");
						}
						else{
							// Post a checkin
							checkin();
						}
					}
				);
			}
			else if (response.status === 'not_authorized') {
				console.log("response.status === 'not_authorized'");
			}
			else {
				console.log("the user isn't logged in to Facebook.");
				//If is not login, 
				login();
			}
		});	
		
		return false;
	});
	
	/* Post a checkin */
	function checkin(){
		FB.api('/me/checkins', 'post', parameter, function(res){
			console.log("checkin begin...");
			console.log(res);
			$.ajax({
				url : "index.php",
				type : "POST",
				dataType : "json",
				data : {
					checkin : true,
					uid : uid,
					uname : uname
				},
				success : function(data){
					console.log(data);
					if(data && data.result && data.result.success){
						$resultBox.html("おめでとうございます。クーポン：　"　+ data.result.category);
					}
					else{
						$resultBox.html(data);
					}
				},
				error : function(data){
					console.error(data.responseText);
				}
			});
		});
	}
	
	/* login */
	function login(){
		FB.login(function(response) {
			console.log('FB.login callback:', response);
			if (response.status === 'connected') {
				console.log('User is logged in');
				} else {
				console.log('User is logged out');
			}
		});
	}
};