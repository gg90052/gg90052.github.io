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
	$scope.update = function(){
		$scope.comments.splice(0,0);
	}

	$scope.sendURL = function(){
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
				$scope.getNext(res.paging.next);
			}else{
				clearInterval(timer);
				alert("完成，共花費"+sec+"秒");
				$scope.comments = data;
				$scope.$apply();
			}
		});
	}

	$scope.getNext = function(url){
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
				$scope.getNext(res.paging.next);
			}else{
				clearInterval(timer);
				alert("完成，共花費"+sec+"秒");
			}
		});	
	}


	$scope.sendURL2 = function(){
		var post_id = $scope.fbid_check();

		// var comment = fb.getLike(post_id);
		// comment.done(function(res){
		// 	//console.log(res);
		// 	data = res[0];
		// 	for (var i=0; i<res[0].length; i++){
		// 		data[i].fromid = data[i].user_id;
		// 		data[i].realname = res[1][i].name;
		// 		data[i].serial = i+1;
		// 		data[i].link = "http://www.facebook.com/"+data[i].user_id;
		// 	}
		// 	$scope.comments = new Array();
		// 	$scope.$apply(function(){
		// 		$scope.comments = data;
		// 	});
		// });
	}

	$scope.fbid_check = function(){
		var posturl = $("#url").val();
		// type1 分享照片  https://www.facebook.com/appledaily.tw/photos/a.364361237068.207658.232633627068/10152652767797069/?type=1
		// type2 分享文字、連結  https://www.facebook.com/stormmedia/posts/318807414967642 
		// type3 直接輸入FBID 10152652767797069
		var start,end;
		var fbid;

		var checkType12 = posturl.indexOf('posts');
		if (checkType12 > 0){
			// type2
			start = checkType+6;
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
				// type3
				fbid = posturl;
			}
		}
		return fbid;
	}
});
