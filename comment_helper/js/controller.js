var myApp = angular.module('MyApp', []);
myApp.filter('unique', function() {
	return function(collection, keyname) {
		var output = [], 
		keys = [];

		angular.forEach(collection, function(item) {
			var key = item[keyname];
			if(keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});

		return output;
	};
});

myApp.controller('Tbody', function($scope){
	$scope.comments = [];
	$scope.data = [];
	$scope.at = "";
	$scope.id_array;
	$scope.gettype;
	$scope.update = function(){
		$scope.comments.splice(0,0);
	}

	$scope.getFBID = function(type){
		$(".update_donate").slideUp();
		$scope.comments = new Array();
		$scope.data = new Array();
		$scope.id_array = $scope.fbid_check();
		console.log($scope.id_array);
		if (type == "comment"){
			$(".share_post").addClass("hide");
			$(".like_comment").removeClass("hide");
			$scope.getComments($scope.id_array.pop());
		}
		if (type == "like"){
			$(".share_post").addClass("hide");
			$(".like_comment").removeClass("hide");
			$scope.getLikes($scope.id_array.pop());
		}
		if (type == "share"){
			$(".share_post").removeClass("hide");
			$(".like_comment").addClass("hide");
			$scope.getShares($scope.id_array.pop());
		}
	}

	$scope.getComments = function(post_id){
		FB.api("https://graph.facebook.com/"+post_id+"/comments",function(res){
			console.log(res);
			for (var i=0; i<res.data.length; i++){
				$scope.data.push(res.data[i]);
			}

			data = $scope.data;
			for (var i=0; i<$scope.data.length; i++){
				data[i].realname = $scope.data[i].from.name;
				data[i].realtime = timeConverter($scope.data[i].created_time);
				data[i].serial = i+1;
				data[i].fromid = $scope.data[i].from.id;
				data[i].text = $scope.data[i].message;
				data[i].link = "http://www.facebook.com/"+$scope.data[i].from.id;
			}

			if (res.paging.next){
				$scope.getCommentsNext(res.paging.next);
			}else{
				if ($scope.id_array.length == 0){
					alert("done");
					$scope.comments = data;
					$scope.$apply();
				}else{
					$scope.getComments($scope.id_array.pop());
				}
			}
		});
	}


	$scope.getCommentsNext = function(url){
			$.get(url,function(res){
			for (var i=0; i<res.data.length; i++){
				$scope.data.push(res.data[i]);
			}

			data = $scope.data;
			for (var i=0; i<$scope.data.length; i++){
				data[i].realname = $scope.data[i].from.name;
				data[i].realtime = timeConverter($scope.data[i].created_time);
				data[i].serial = i+1;
				data[i].fromid = $scope.data[i].from.id;
				data[i].text = $scope.data[i].message;
				data[i].link = "http://www.facebook.com/"+$scope.data[i].from.id;
			}

			$scope.comments = data;
			$scope.$apply();
	
			if (res.paging.next){
				$scope.getCommentsNext(res.paging.next);
			}else{
				if ($scope.id_array.length == 0){
					alert("done");
				}else{
					$scope.getComments($scope.id_array.pop());
				}
			}
		});	
	}


	$scope.getLikes = function(post_id){
		FB.api("https://graph.facebook.com/"+post_id+"/likes",function(res){
			  console.log(res);
			for (var i=0; i<res.data.length; i++){
				$scope.data.push(res.data[i]);
			}

			data = $scope.data;
			for (var i=0; i<$scope.data.length; i++){
				data[i].realname = $scope.data[i].name;
				data[i].serial = i+1;
				data[i].fromid = $scope.data[i].id;
				data[i].link = "http://www.facebook.com/"+$scope.data[i].id;
			}

			if (res.paging.next){
				$scope.getLikesNext(res.paging.next);
			}else{
				if ($scope.id_array.length == 0){
					alert("done");
					$scope.comments = data;
					$scope.$apply();
				}else{
					$scope.getLikes($scope.id_array.pop());
				}
			}
		});
	}

	$scope.getLikesNext = function(url){
			$.get(url,function(res){
			for (var i=0; i<res.data.length; i++){
				$scope.data.push(res.data[i]);
			}

			data = $scope.data;
			for (var i=0; i<$scope.data.length; i++){
				data[i].realname = $scope.data[i].name;
				data[i].serial = i+1;
				data[i].fromid = $scope.data[i].id;
				data[i].link = "http://www.facebook.com/"+$scope.data[i].id;
			}

			$scope.comments = data;
			$scope.$apply();
	
			if (res.paging.next){
				$scope.getLikesNext(res.paging.next);
			}else{
				if ($scope.id_array.length == 0){
					alert("done");
				}else{
					$scope.getLikes($scope.id_array.pop());
				}
			}
		});	
	}

	$scope.getAuth = function(type){
		$scope.gettype = type;
		FB.getLoginStatus(function(response) {
			$scope.callback(response,type);
		});
	}

	$scope.callback = function(response){
		if (response.status === 'connected') {
      		var accessToken = response.authResponse.accessToken;
      		var id = response.authResponse.userID;
      		if ($scope.gettype == "like") $scope.getFBID("like");
      		if ($scope.gettype == "comment") $scope.getFBID("comment");
      		if ($scope.gettype == "share") $scope.getFBID("share");
		}else{
			FB.login(function(response) {
				$scope.callback(response);
			}, {scope: 'read_stream'});
		}
	}

	$scope.getShares = function(post_id){
		FB.api("https://graph.facebook.com/"+post_id+"/sharedposts",function(res){
			  // console.log(res);
			for (var i=0; i<res.data.length; i++){
				$scope.data.push(res.data[i]);
			}

			data = $scope.data;
			for (var i=0; i<$scope.data.length; i++){
				data[i].realname = $scope.data[i].from.name;
				data[i].serial = i+1;
				data[i].fromid = $scope.data[i].from.id;
				data[i].manlink = "http://www.facebook.com/"+$scope.data[i].from.id;
				data[i].link = "http://www.facebook.com/"+$scope.data[i].id;
				if ($scope.data[i].message){
					data[i].share_message = $scope.data[i].message;
				}else{
					data[i].share_message = $scope.data[i].story;
				}
			}

			if (res.paging.next){
				$scope.getSharesNext(res.paging.next);
			}else{
				if ($scope.id_array.length == 0){
					alert("done");
					$scope.comments = data;
					$scope.$apply();
				}else{
					$scope.getShares($scope.id_array.pop());
				}
			}
		});
	}
	$scope.getSharesNext = function(url){
			$.get(url,function(res){
			for (var i=0; i<res.data.length; i++){
				$scope.data.push(res.data[i]);
			}

			data = $scope.data;
			for (var i=0; i<$scope.data.length; i++){
				data[i].realname = $scope.data[i].from.name;
				data[i].serial = i+1;
				data[i].fromid = $scope.data[i].from.id;
				data[i].manlink = "http://www.facebook.com/"+$scope.data[i].from.id;
				data[i].link = "http://www.facebook.com/"+$scope.data[i].id;
				if ($scope.data[i].message){
					data[i].share_message = $scope.data[i].message;
				}else{
					data[i].share_message = $scope.data[i].story;
				}
			}

			$scope.comments = data;
			$scope.$apply();
	
			if (res.paging.next){
				$scope.getSharesNext(res.paging.next);
			}else{
				if ($scope.id_array.length == 0){
					alert("done");
				}else{
					$scope.getShares($scope.id_array.pop());
				}
			}
		});	
	}


	$scope.fbid_check = function(){

		var fbid_array = new Array();
		for(var i=0; i<$("#enterURL .url").length; i++){
			var posturl = $($("#enterURL .url")[i]).val();
			var start,end;
			var fbid;

			var checkType12 = posturl.indexOf('posts');
			if (checkType12 > 0){
				// type2
				start = checkType12+6;
				end = posturl.length;
				fbid = posturl.substring(start,end);
			}else{
				var checkType23 = posturl.indexOf('/?type');
				if (checkType23 > 0){
					// type1
					end = posturl.indexOf('/?type');
					start = posturl.lastIndexOf('/',end-1)+1;
					fbid = posturl.substring(start,end);
				}else{
					var checkType34 = posturl.indexOf('story_fbid');
					if (checkType34 > 0){
						start = checkType34+11;
						end = posturl.lastIndexOf('&id');
						fbid = posturl.substring(start,end);
					}else{
						var checkType5 = posturl.indexOf('v=');
						if (checkType5 > 0){
							start = checkType5+2;
							end = posturl.indexOf("&",start);
							fbid = posturl.substring(start,end);
						}else{
							// type3
							fbid = posturl;
						}
					}
				}
			}
			if (fbid != ""){
				fbid_array.push(fbid);
			}
		}
		// type1 分享照片  https://www.facebook.com/appledaily.tw/photos/a.364361237068.207658.232633627068/10152652767797069/?type=1
		// type2 分享文字、連結  https://www.facebook.com/stormmedia/posts/318807414967642 
		// type3 直接輸入FBID 10152652767797069
		// type4 是甚麼我也不知道 https://www.facebook.com/permalink.php?story_fbid=344077265740581&id=341275322687442
		// type5 分享影片 https://www.facebook.com/video.php?v=393632764145871&set=vb.237337546442061
		return fbid_array;
	}
});

