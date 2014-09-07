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
	$scope.at = "";
	$scope.update = function(){
		$scope.comments.splice(0,0);
	}

	$scope.getComments = function(){
		$(".share_post").addClass("hide");
		$(".like_comment").removeClass("hide");

		$scope.comments = new Array();

		var post_id = $scope.fbid_check();

		timer = setInterval(function(){
			sec++;
		},1000);

		$scope.data = new Array();
		$.get("https://graph.facebook.com/"+post_id+"/comments",function(res){
			 // console.log(res);
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
				clearInterval(timer);
				alert("完成，共花費"+sec+"秒");
				$scope.comments = data;
				$scope.$apply();
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
				clearInterval(timer);
				alert("完成，共花費"+sec+"秒");
			}
		});	
	}


	$scope.getLikes = function(){
		$(".share_post").addClass("hide");
		$(".like_comment").removeClass("hide");

		$scope.comments = new Array();

		var post_id = $scope.fbid_check();

		timer = setInterval(function(){
			sec++;
		},1000);

		$scope.data = new Array();
		$.get("https://graph.facebook.com/"+post_id+"/likes",function(res){
			  //console.log(res);
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
				clearInterval(timer);
				alert("完成，共花費"+sec+"秒");
				$scope.comments = data;
				$scope.$apply();
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
				clearInterval(timer);
				alert("完成，共花費"+sec+"秒");
			}
		});	
	}

	$scope.getAuth = function(){
		FB.getLoginStatus(function(response) {
			$scope.callback(response);
		});
	}

	$scope.callback = function(response){
		if (response.status === 'connected') {
      		$scope.at = response.authResponse.accessToken;
      		$scope.getShares();
		}else{
			FB.login(function(response) {
				$scope.callback(response);
			}, {scope: 'read_stream'});
		}
	}

	$scope.getShares = function(){
		$(".share_post").removeClass("hide");
		$(".like_comment").addClass("hide");

		$scope.comments = new Array();

		var post_id = $scope.fbid_check();

		timer = setInterval(function(){
			sec++;
		},1000);

		$scope.data = new Array();
		$.get("https://graph.facebook.com/"+post_id+"/sharedposts?access_token="+$scope.at,function(res){
			  console.log(res);
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
				clearInterval(timer);
				alert("完成，共花費"+sec+"秒");
				$scope.comments = data;
				$scope.$apply();
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
				clearInterval(timer);
				alert("完成，共花費"+sec+"秒");
			}
		});	
	}


	$scope.fbid_check = function(){
		var posturl = $("#url").val();
		// type1 分享照片  https://www.facebook.com/appledaily.tw/photos/a.364361237068.207658.232633627068/10152652767797069/?type=1
		// type2 分享文字、連結  https://www.facebook.com/stormmedia/posts/318807414967642 
		// type3 直接輸入FBID 10152652767797069
		// type4 是甚麼我也不知道 https://www.facebook.com/permalink.php?story_fbid=344077265740581&id=341275322687442
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
					// type3
					fbid = posturl;
				}
			}
		}
		return fbid;
	}
});

