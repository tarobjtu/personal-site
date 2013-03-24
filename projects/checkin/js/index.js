/***************************************************************************/
/*                              OPTIONS                                    */
/***************************************************************************/
var option = {
	shopIdList : [306632109406994, 152113931478420, 158913180788176, 144699755567092], // campaign shops facebook place id witch is used in checkin service.
	appId : '260874077337184',   // Facebook App ID
	maxDistance : 2  // If straight line distance between user location and shop location is taller than 'option.maxDistance'. User can't check in this location.
};


/***************************************************************************/
/*                               SHOP                                      */
/***************************************************************************/
var shop = {
	info : null,
	customer : null,
	init : function(data){
		this.info = data;
		return this;
	},
	getId : function(){
		return this.info.id;
	},
	getName : function(){
		return this.info.name;
	},
	getAddress : function(){
		var address = null,
		location = this.info.location;
		address = location.state + ' ' + location.city + ' ' + location.street;
		return address;
	},
	getLink : function(){
		return this.info.link;
	},
	getCoordinate : function(){
		return {'latitude':this.info.location.latitude, 'longitude':this.info.location.longitude};
	},
	getCoordinateString : function(){
		return this.info.location.latitude + ',' + this.info.location.longitude;
	},
	getLikes : function(){
		return this.info.likes;
	},
	getCheckins : function(){
		return this.info.checkins;
	},
	//直線距離
	getStraightLineDistance : function(){
		return position.calcDistanceBetween(this.getCoordinate().latitude, 
					this.getCoordinate().longitude, customerCoord.lat, customerCoord.lng);
	},
	getTrafficDistance : function(){
		return position.trafficDistance(this.getCoordinate().latitude, 
					this.getCoordinate().longitude, customerCoord.lat, customerCoord.lng, this.getId(), position.travelMode.WALKING);
	},
	getCostTime : function(){
		
	},
	isChecked : function(){
		
	},
	install : function(){
		var html = "<li class='shop'>\n";
		html += "<div class='clearfix'>\n";
		html += "<div class='left'>\n";
		html += "<div class='shop-title clearfix'><a href='" + this.getLink() + "' target='_blank' class='name'>" + this.getName() + "</a>\n";
		html += "<div class='sns'><img src='img/checkin.png' width='25' /><span class='checkins'>" + this.getCheckins() + "</span>";
		html += "<img src='img/like.png' width='70' /><span class='likes'>" + this.getLikes() + "</span></div></div>\n";
		html += "<p class='address'><span>アドレス：</span>" + this.getAddress() + "</p>\n";
		html += "<p class='straight-line-distance'><span>お客様からの直線距離：</span>" + this.getStraightLineDistance() + "キロメートル</p>\n";
		html += "<p class='traffic-distance' id='" + this.getId() + "'>" + this.getTrafficDistance() + "</p>\n";
		html += "<p><a class='car' target='_blank' href='http://maps.google.com/maps?saddr=" + customerCoordString + "&daddr=" + this.getCoordinateString() + "'>経路</a>";
		html += "<a class='car' target='_blank' href='http://maps.google.com/maps?saddr=" + customerCoordString + "&daddr=" + this.getCoordinateString() + "&dirflg=d'>車の経路</a>";
		html += "<a class='metro' target='_blank' href='http://maps.google.com/maps?saddr=" + customerCoordString + "&daddr=" + this.getCoordinateString() + "&dirflg=m'>電車の経路</a>";
		html += "<a class='walk' target='_blank' href='http://maps.google.com/maps?saddr=" + customerCoordString + "&daddr=" + this.getCoordinateString() + "&dirflg=w'>徒歩の経路</a></p>";
		html += "</div>\n";
		html += "<div class='right'>\n";
		// If straight line distance between user location and shop location is taller than 1km
		// User can't check in this location.
		if(this.getStraightLineDistance() < option.maxDistance){
			html += "<a href='#' class='check-in'><img src='img/checkin.png' alt='check in' width='100' /></a>";
		}
		else{
			html += "<a><img src='img/xcheckin.png' width='100' /></a>";
		}
		html += "</div>\n";
		html += "</div>\n";
		html += "<div class='checkin-result'></div>\n";
		html += "</li>\n";
		return html;
	}
};


/***************************************************************************/
/*                              SHOP LIST                                  */
/***************************************************************************/
var shopList = {
	createShop : function(metaData){
		shop.init(metaData);
		$(shop.install())
			.appendTo('.shoplist')
			.data('info', {
				id : shop.getId(), 
				name : shop.getName(),
				coordinate : shop.getCoordinate()
			});
	},
	sort : function(list){
		function sortRule(a, b){
			shop.init(a);
			var aDistance = shop.getStraightLineDistance();
			shop.init(b);
			var bDistance = shop.getStraightLineDistance();
			return aDistance - bDistance;
		}
		list.sort(sortRule);
	},
	createShopList : function(){
		var shopMetaDataList = new Array(),
			count = 0;
		for(var i=0, length = option.shopIdList.length; i<length; i++){
			var url = 'https://graph.facebook.com/',
				fburl = url + option.shopIdList[i],
				shoplist = this;
			$.ajax({
				url : fburl,
				type : 'GET',
				dataType : 'json',
				success : function(metaData){
					shopMetaDataList.push(metaData);
					count++;
					if(count == option.shopIdList.length){
						shoplist.sort(shopMetaDataList);
						for(var j=0, l=shopMetaDataList.length; j<l; j++){
							shoplist.createShop(shopMetaDataList[j]);
						}
					}
				}
			});
		}
	}
};


/***************************************************************************/
/*                               POSITION                                  */
/***************************************************************************/
var position = {
	lat : null,
	lng : null,
	acc: null,
	travelMode : {
		WALKING : google.maps.TravelMode.WALKING,
		BICYCLING : google.maps.TravelMode.BICYCLING,
		DRIVING : google.maps.TravelMode.DRIVING
	},
	success : function(pos){
		this.lat = pos.coords.latitude;
		this.lng = pos.coords.longitude;
		this.acc = pos.coords.accuracy;
		//global variable
		customerCoord = {"lat":this.lat, "lng":this.lng};
		customerCoordString = this.lat + ", " + this.lng;
		$('#pos').html("Your latitude is: " + this.lat + " and your longitude is: " + this.lng + " within " + this.acc + " meters.");
	},
	error : function (){
		$('#pos').html("お客様の携帯電話はGPSをサポートできません。");
	},
	calcDistanceBetween : function(lat1, lon1, lat2, lon2){
		//console.log(lat1 + " "+ lon1 + " "+ lat2 + " "+ lon2);
		var R = 6371; // Radius of the earth in km
		var dLat = this.toRad(lat2-lat1);  // Javascript functions in radians
		var dLon = this.toRad(lon2-lon1); 
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) 
				+ Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) 
				* Math.sin(dLon/2) * Math.sin(dLon/2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c; // Distance in km
		return Math.round(d*100)/100;  // 精度 0.00km
	},
	toRad : function(Value) {
		/** Converts numeric degrees to radians */
		return Value * Math.PI / 180;
	},
	trafficDistance : function (lat1, lon1, lat2, lon2, id, travelMode){
        $('body').gmap3({
          action:'getDistance',
          options:{ 
            origins:[[lat1, lon1]], 
            destinations:[[lat2, lon2]],
            travelMode: travelMode
          },
          callback: function(results){
            var html = '';
            if (results){
              for (var i = 0; i < results.rows.length; i++){
                var elements = results.rows[i].elements;
                for(var j=0; j<elements.length; j++){
					switch(elements[j].status){
						case google.maps.DistanceMatrixStatus.OK:
							html += '歩く距離：' + elements[j].distance.text + '；　歩く時間：' + elements[j].duration.text + '<br />';
							break;
						case google.maps.DistanceMatrixStatus.NOT_FOUND:
							html += 'The origin and/or destination of this pairing could not be geocoded<br />';
							break;
						case google.maps.DistanceMatrixStatus.ZERO_RESULTS:
							html += 'No route could be found between the origin and destination.<br />';
							break;
					}
				}
              } 
            } else {
              html = 'error';
            }
			var selector = "#" + id;
            $(selector).html( html );
          }
        });
    }
};


/***************************************************************************/
/*                              GLOBALS                                    */
/***************************************************************************/
var customerCoord = null,
	customerCoordString = '';

//get the place coordinate of customer
navigator.geolocation.watchPosition(position.success, position.error, {enableHighAccuracy:true});

//create shop list.
shopList.createShopList();


/***************************************************************************/
/*                    CHECK THE COUPON IS USED UP OR NOT                   */
/*                    AND THE USER IS DUPLICATE CHECKIN                    */
/***************************************************************************/
window.fbAsyncInit = function() {

	FB.init({
		appId      : option.appId, // App ID
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true,  // parse XFBML
		oauth      : true
	});
		
	FB.getLoginStatus(function(response){
		if (response.status === 'connected') {

			var uid = response.authResponse.userID;

			$.ajax({
				url : '/coupon/index.php',
				type : 'POST',
				dataType : 'json',
				data : {
					check : true,
					uid : uid
				},
				success : function(data){
					console.log(data);
					if(data.coupon_exist && data.user_have_not_checkin){
						checkin();
					}
					else if(!data.coupon_exist){
						console.log('Coupon doesn\'t exist.');
						$('.warning').html('Coupon doesn\'t exist.');
					}
					else if(!data.user_have_not_checkin){
						console.log('User have checked in.');
						$('.warning').html('User have checked in.');
					}
				},
				error : function(data){
					console.error(data.responseText);
				}
			});
		}
		else if (response.status === 'not_authorized') {
			console.log('response.status === not_authorized');
			$('.warning').html('response.status === not_authorized');
		}
		else {
			console.log('the user isn\'t logged in to Facebook.');
			//If is not login, 
			login();
		}
	});	
};


/***************************************************************************/
/*                              CHECK IN                                   */
/***************************************************************************/
function checkin(){
	
	var uid = '',
		uname = '',
		accessToken,
		shopId,
		shopName,
		shopCoordinate,
		$resultBox;  
		
	//checkin
	$('.wrapper').on('click', '.check-in', function(){

		var shop = $(this).closest('.shop');
			shopInfo = shop.data('info');
		shopId = shopInfo.id;
		shopName = shopInfo.name;
		shopCoordinate = shopInfo.coordinate;
		$resultBox = shop.find('.checkin-result');
		
		FB.getLoginStatus(function(response){
		
			if (response.status === 'connected') {
			
				uid = response.authResponse.userID;
				accessToken = response.authResponse.accessToken;
				// To get the user name
				FB.api('/me', function(user) {
					uname = user.name;
				});
				// To check if user duplicately checkin.
				FB.api(
					{
						method: 'fql.query',
						query: 'SELECT page_id FROM checkin WHERE author_uid= me() AND page_id=' + shopId
					},
					function(response) {
						// The user already checked.
						if(response.length){
							console.log('The user already checked.');
							$resultBox.html('Sorry, You have already checkin.');
						}
						else{
							// Post a checkin
							postCheckin();
						}
					}
				);
			}
			else if (response.status === 'not_authorized') {
				console.log('response.status === not_authorized');
				$('.warning').html('response.status === not_authorized');
			}
			else {
				console.log('the user isn\'t logged in to Facebook.');
				//If is not login, 
				login();
			}
		});	
		
		return false;
	});
	
	/* Post a checkin */
	function postCheckin(){
		
		var parameter = {
			'message' : '今' + shopName + 'へ行ってウイスキーのクーポンをもらいます。',
			'picture' : 'http://www.tarobjtu.com/img/logo.jpg',
			'coordinates' : shopCoordinate,
			'place' : shopId
		};
	
		FB.api('/me/checkins', 'post', parameter, function(res){
			console.log("checkin begin...");
			console.log(res);
			$.ajax({
				url : "/coupon/index.php",
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
						$resultBox.html('おめでとうございます。クーポン：　'　+ data.result.category);
					}
					else{
						$resultBox.html(data);
						deleteCheckin(res.id);
					}
				},
				error : function(data){
					console.error(data.responseText);
				}
			});
		});
	}
	
	/* Delete a checkin */
	function deleteCheckin(postId){
		//TO-DO: delete checkin by postId.
		console.log('delete checkin by postId.' + postId);
		
		FB.api(postId, 'delete', function(res){
			console.log('delete checkin begin...');
			console.log(res);
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
}