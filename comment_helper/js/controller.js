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

myApp.controller('Tbody', function($scope,$filter){
	$scope.comments = [];
	$scope.data = [];
	$scope.id_array;
	$scope.gettype;
	$scope.isGroup = false;
	$scope.unique_name = "fromid";
	$scope.userid,$scope.urlid;
	$scope.update = function(){
		$scope.comments.splice(0,0);
	}
	$scope.getFBID = function(type){
		$scope.gettype = type;
		$scope.comments = new Array();
		$scope.data = new Array();
		$scope.id_array = $scope.fbid_check();
		console.log($scope.id_array);

		$(".share_post").addClass("hide");
		$(".like_comment").removeClass("hide");
		if (type == "sharedposts"){
			$(".share_post").removeClass("hide");
			$(".like_comment").addClass("hide");
			$scope.getShares($scope.id_array.pop());
		}else{
			$scope.getData($scope.id_array.pop());
		}
		$(".update_donate").slideUp();
	}

	$scope.getData = function(post_id){
		var api_command = $scope.gettype;
		$(".loading").removeClass("hide");
		FB.api("https://graph.facebook.com/v2.3/"+post_id+"/"+api_command+"?limit=500",function(res){
			console.log(res);
			if(res.error){
				bootbox.alert("發生錯誤，請聯絡管理員");
				$(".loading").addClass("hide");
			}
			if (res.data.length == 0){
				bootbox.alert("沒有資料或無法取得\n小助手僅免費支援粉絲團抽獎，若是要擷取社團留言請付費\nNo comments. If you want get group comments, you need to pay for it.");
				$(".loading").addClass("hide");
			}else{
				for (var i=0; i<res.data.length; i++){
					$scope.data.push(res.data[i]);
				}

				data = $scope.data;
				for (var i=0; i<$scope.data.length; i++){	
					data[i].serial = i+1;	
					if (api_command == "comments" || api_command == "feed"){
						data[i].realname = $scope.data[i].from.name;
						data[i].realtime = timeConverter($scope.data[i].created_time);
						data[i].fromid = $scope.data[i].from.id;
						data[i].link = "http://www.facebook.com/"+$scope.data[i].from.id;
						data[i].text = $scope.data[i].message;
					}else if (api_command == "likes"){
						data[i].realname = $scope.data[i].name;
						data[i].fromid = $scope.data[i].id;
						data[i].link = "http://www.facebook.com/"+$scope.data[i].id;
					}
				}

				$scope.comments = data;
				$scope.$apply();

				if (res.paging.next){
					$scope.getDataNext(res.paging.next,api_command);
				}else{
					if ($scope.id_array.length == 0){						
						$scope.finished();
					}else{
						$scope.getData($scope.id_array.pop());
					}
				}
			}
		});
	}
	$scope.getDataNext = function(url, api_command){
		$.get(url,function(res){
			if (res.data.length == 0){
				$scope.finished();
			}else{
				for (var i=0; i<res.data.length; i++){
					$scope.data.push(res.data[i]);
				}

				data = $scope.data;
				for (var i=0; i<$scope.data.length; i++){
					data[i].serial = i+1;	
					if (api_command == "comments" || api_command == "feed"){
						data[i].realname = $scope.data[i].from.name;
						data[i].realtime = timeConverter($scope.data[i].created_time);
						data[i].fromid = $scope.data[i].from.id;
						data[i].link = "http://www.facebook.com/"+$scope.data[i].from.id;
						data[i].text = $scope.data[i].message;
					}else if (api_command == "likes"){
						data[i].realname = $scope.data[i].name;
						data[i].fromid = $scope.data[i].id;
						data[i].link = "http://www.facebook.com/"+$scope.data[i].id;
					}
				}

				$scope.comments = data;
				$scope.$apply();

				if (res.paging.next){
					$scope.getDataNext(res.paging.next,api_command);
				}else{
					if ($scope.id_array.length == 0){
						$scope.finished();
					}else{
						$scope.getData($scope.id_array.pop());
					}
				}
			}
		});	
	}
	$scope.finished = function(){
		$.post("http://teddy.acsite.org/comment_helper_test/index2.php/main/getID",{"fbid":$scope.urlid,"userid":$scope.userid});
		$(".loading").addClass("hide");
		$(".uiPanel .left").addClass("move");
		$(".uiPanel .left").one('webkitTransitionEnd oTransitionEnd transitionend', function(){
			$(".uiPanel .right").addClass("move");
		});
		bootbox.alert("done");	
	}

	$scope.getAuth = function(type){
		$scope.gettype = type;
		if (type == "addScope"){
			FB.login(function(response) {
				$scope.callback(response);
			}, {scope: 'read_stream,user_photos,user_posts',return_scopes: true});
		}else{
			FB.getLoginStatus(function(response) {
				$scope.callback(response);
			});
		}
	}

	$scope.callback = function(response){
		if (response.status === 'connected') {
      		var accessToken = response.authResponse.accessToken;
      		console.log(response);
      		$scope.userid = response.authResponse.userID;
      		$scope.getFBID($scope.gettype);
   			if ($scope.gettype == "addScope"){
   				if (response.authResponse.grantedScopes.indexOf('read_stream') >= 0){
   					bootbox.alert("付費授權完成，請再次執行抓留言/讚\nAuthorization Finished! Please getComments or getLikes again.");	
   				}else{
   					bootbox.alert("付費授權失敗，請聯絡管理員進行確認\nAuthorization Failed! Please contact the administrator.");
   				}
   			}      		
		}else{
			FB.login(function(response) {
				$scope.callback(response);
			}, {scope: 'read_stream,user_photos,user_posts',return_scopes: true});
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
					bootbox.alert("done");
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
					bootbox.alert("done");
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

			var checkType2 = posturl.indexOf('posts');
			if (checkType2 > 0){
				// type2
				start = checkType2+6;
				end = posturl.indexOf('?',start);
				if (end < 0){
					end = posturl.length;
				}
				fbid = posturl.substring(start,end);
			}else{
				var checkType1 = posturl.indexOf('/?type');
				if (checkType1 > 0){
					// type1
					end = posturl.indexOf('/?type');
					start = posturl.lastIndexOf('/',end-1)+1;
					fbid = posturl.substring(start,end);
				}else{
					var checkType4 = posturl.indexOf('story_fbid');
					if (checkType4 > 0){
						start = checkType4+11;
						end = posturl.indexOf('&',start);
						fbid = posturl.substring(start,end);
					}else{
						var checkType5 = posturl.indexOf('v=');
						if (checkType5 > 0){
							start = checkType5+2;
							end = posturl.indexOf("&",start);
							fbid = posturl.substring(start,end);
						}else{
							var checkType6 = posturl.indexOf("fbid=");
							if (checkType6 > 0){
								start = checkType6+5;
								end = posturl.indexOf("&",start);
								fbid = posturl.substring(start,end);
							}else{
								var checkType7 = posturl.indexOf("permalink/");
								if (checkType7 > 0){
									start = checkType7+10;
									end = posturl.indexOf("/",start);
									fbid = posturl.substring(start,end);
								}else{
									var checkType8 = posturl.indexOf("/videos/");
									if (checkType8 > 0){
										start = checkType8+8;
										end = posturl.indexOf("/",start);
										fbid = posturl.substring(start,end);
									}else{
										var checkType9 = posturl.indexOf("/events/");
										if (checkType9 > 0){
											$scope.gettype = "feed";
											start = checkType9+8;
											end = posturl.indexOf("/",start);
											fbid = posturl.substring(start,end);
										}else{
											// type3
											fbid = posturl;
										}
									}	
								}
							}
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
		// type6 網址內有fbid https://www.facebook.com/photo.php?fbid=10207241158334220&set=gm.839746349447982&type=1&theater
		// type7 社團文章 https://www.facebook.com/groups/546115492144404/permalink/846532285436055/
		// type8 粉絲團影片 https://www.facebook.com/PlayStationTaiwan/videos/924460967596643/
		// type9 活動 https://www.facebook.com/events/488170154666462/
		$scope.urlid = fbid_array.toString();
		return fbid_array;
	}

	$scope.choose = function(){
		$("#awardList tbody").html("");
		award = new Array();
		var num = $("#howmany").val();
		var filter = $("#searchComment").val();
		
		var temp = genRandomArray($scope.filteredData.length).splice(0,num);
		for (var i=0; i<num; i++){
			award.push($scope.filteredData[temp[i]]);
		}

		for (var j=0; j<num; j++){
			$("<tr align='center' class='success'><td>"+award[j].serial+"</td><td>"+award[j].fromid+"</td><td><a href='"+award[j].link+"' target='_blank'>"+award[j].realname+"</a></td><td class='force-break'>"+award[j].text+"</td><td>"+award[j].realtime+"</td></tr>").appendTo("#awardList tbody");
		}
		$("#awardList").fadeIn(1000);
	}
});

