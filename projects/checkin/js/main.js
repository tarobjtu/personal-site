var shopPlaceIdList = [306632109406994, 152113931478420, 158913180788176, 144699755567092];
var shopPlaceDataList = new Array();
for(var i=0, length = shopPlaceIdList.length; i<length; i++){
	var url = "https://graph.facebook.com/",
	fburl = url + shopPlaceIdList[i];
	$.getJSON(fburl, function(data){
		shopPlaceDataList.push(data);
	});
}
setTimeout(function(){
	console.log(shopPlaceDataList);
}, 1000);


// The function assigned to window.fbAsyncInit is run as soon as the SDK is loaded. 
window.fbAsyncInit = function() {
	
	FB.init({
		appId      : '260874077337184', // App ID
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true,  // parse XFBML
		oauth      : true
	});
	
	var checked = false;
	// イベントお店はもうチェックインしたかどうかを判断です。
	FB.getLoginStatus(function(response) {
		//console.log("getLoginStatus");
		if (response.status === 'connected') {
			FB.api(
				{
					method: 'fql.query',
					query: 'SELECT page_id FROM checkin WHERE author_uid= me() AND page_id='
				},
				function(response) {
					console.log(response);
					if(isCheckin(response, shopPlaceIdList)){
						console.log("You have checked in.");
						checked = true;
					}
					else{
						console.log("You never checked in.");
					}
				}
			);
			function isCheckin(userCheckinPlaces, shopPlaceIdList){
				for(var i=0, l=userCheckinPlaces.length; i<l; i++){
					for(var j=0, l2=shopPlaceIdList.length; j<l2; j++){
						console.log(userCheckinPlaces[i].page_id + " " + shopPlaceIdList[j]);
						if(userCheckinPlaces[i].page_id == shopPlaceIdList[j]){
							return true;
						}
					}
				}
				return false;
			}
		}
		else if (response.status === 'not_authorized') {
			//console.log("not_authorized");
		} 
		else {
			//console.log("not_connected");
		}
	});
	
	console.log(checked);
	
	//Logout操作
	$(".logout a img").on("click", function(){
		FB.logout(function(response) {
			window.location.reload();
		});
		return false;
	});
	
	// Additional initialization code here
	var uname = "";
	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			
			//user info
			FB.api('/me', function(user) {
				//console.log(user);
				uname = user.name;
				
				var html = "こにちは、" +user.hometown.name+"からの"+ user.first_name + "さん。";
				html += "今は" + user.location.name + "の辺に生活しています。";
				$(".user-info").html(html);
			});
			
			//read existed checkins 
			FB.api('/me/checkins', function(response) {
				if(response.data && response.data.length > 0){
					var html = "<ul class='clearfix'>\n";
					for(var i=0, length=response.data.length; i<length; i++){
						var checkin = response.data[i];
						var friend = checkin.tags ? checkin.tags.data[0].name + "と一緒に" : "一人で";
						html += "<li>" + friend + "<a href='https://www.facebook.com/pages/"+ checkin.place.name +"/"+checkin.place.id + " '>";
						html +=  checkin.place.name + "</a>にいました。</li>\n";
					}
					html += "</li>\n";
					$(".checkins .right").html(html);
				}
			});
			//friends Info
			FB.api('/me/friends', function(response) {
				if(response.data && response.data.length > 0){
					var html = "<ul class='clearfix'>\n";
					for(var i=0, length=response.data.length; i<length; i++){
						var friend = response.data[i];
						html += "<li><a href='https://www.facebook.com/profile.php?id=" + friend.id + " '>";
						html +=  friend.name + "</a></li>\n";
					}
					html += "</li>\n";
					$(".friend-list").html(html);
				}
			});
		}
		else {
			//console.log("the user isn't logged in to Facebook.");
			$(".warning").html("まず、ログインしてください。");
			FB.login(function(response) {
				console.log('FB.login callback', response);
				if (response.status === 'connected') {
					console.log('User is logged in');
					} else {
					console.log('User is logged out');
				}
			});
		}
	});
	
	//Feed Dialog by FB.ui();
	var feedParameter = {
		method: 'feed',
		message: 'getting educated about Facebook Connect',
		name: 'ホームページ',
		caption: 'チータオ　ホームページへ来て感想',
		description: (
		'ホームページは良いかどうか教えてください。' +
		'ご利用をいただきもう一回ありがとうございます。'
		),
		link: 'http://www.tarobjtu.com/',
		picture: 'http://www.tarobjtu.com/img/logo.jpg',
		actions: [
        { name: 'チータオ', link: 'http://www.tarobjtu.com/' }
		],
		user_message_prompt: 'Share your thoughts about チータオ'
	};
	function feedFunction(response) {
		if (response && response.post_id) {
			console.log('Post was published.');
			} else {
			console.log('Post was not published.');
		}
	}
	$(".feed button").on("click", function(){
		FB.ui(feedParameter,  feedFunction);
	});
	
	//post new checkin
	$(".check-in").on("click", function(){
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				var uid = response.authResponse.userID,
					parameter = {
					'message' : '今日私はチータオと言うプラザへ行って楽しかったです。',
					'picture' : 'http://www.tarobjtu.com/img/logo.jpg',
					'coordinates' : {
						'latitude' : '35.652730016065',
						'longitude' : '139.69054881759',
					},
					"place" : 306632109406994
				};
				FB.api('/me/checkins', 'post', parameter, function(response){
					console.log(response);
					$.ajax({
						url : "index.php?checkin=true",
						type : "POST",
						dataType : "json",
						data : "uid=" +uid+ "&uname=" + uname,
						success : function(data){
						}
					});
					$(".check-in-info").html("チータオのチェックインをご利用いただきありがとうございます。");
				});
			}
			else if (response.status === 'not_authorized') {
				$(".warning").html("まず、ログインしてください。");
				console.log("response.status === 'not_authorized'");
			}
			else {
				console.log("the user isn't logged in to Facebook.");
				$(".warning").html("まず、ログインしてください。");
				FB.login(function(response) {
					console.log('FB.login callback', response);
					if (response.status === 'connected') {
						console.log('User is logged in');
						} else {
						console.log('User is logged out');
					}
				});
			}
		});	
		return false;
	});
};