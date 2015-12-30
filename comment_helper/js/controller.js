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

myApp.filter('has', function() {
	return function(collection, keyname) {
		var output = []; 
		angular.forEach(collection, function(item) {
			var target_length = item["message_tags"].length;
			if (target_length >= keyname){
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
	$scope.vip = "-1";
	$scope.isGroup = false;
	$scope.unique_name = "fromid";
	$scope.tag_name = "0";
	$scope.length_now = 0;
	$scope.userid,$scope.urlid;
	$scope.cleanURL = false;
	$scope.update = function(){
		$scope.comments.splice(0,0);
	}
	$scope.getFBID = function(type){
		$scope.gettype = type;
		$scope.comments = new Array();
		$scope.data = new Array();
		$scope.length_now = 0;
		$scope.id_array = $scope.fbid_check();
		$(".console .message").text('');
		$(".main_table").DataTable().destroy();

		if ($scope.gettype == "url_comments"){
			var t = setInterval(function(){
				if ($scope.gettype  == "comments"){
					clearInterval(t);
					$scope.waitingFBID("comments");
				}
			},100);
		}else{
			$scope.waitingFBID(type);
		}
	}
	$scope.waitingFBID = function(type){
		$(".share_post").addClass("hide");
		$(".like_comment").removeClass("hide");
		if (type == "sharedposts"){
			$(".share_post").removeClass("hide");
			$(".like_comment").addClass("hide");
			$scope.getData($scope.id_array.pop());
		}else{
			$scope.getData($scope.id_array.pop());
		}
		$(".update_donate").slideUp();
	}

	$scope.getData = function(post_id){
		var api_command = $scope.gettype;
		$(".loading").removeClass("hide");
		FB.api("https://graph.facebook.com/v2.3/"+post_id+"/"+api_command+"?limit=500",function(res){
			// console.log(res);
			if(res.error){
				$(".console .message").text('發生錯誤，5秒後自動重試，請稍待');
				setTimeout(function(){
					$(".console .message").text('重新截取資料');
					$scope.getData(post_id);
				},5000);
			}
			if (res.data.length == 0){
				bootbox.alert("沒有資料或無法取得\n小助手僅免費支援粉絲團抽獎，若是要擷取社團留言請付費\nNo comments. If you want get group comments, you need to pay for it.");
				$(".loading").addClass("hide");
			}else{
				for (var i=0; i<res.data.length; i++){
					$scope.data.push(res.data[i]);
				}
				$(".console .message").text('已截取  '+ $scope.data.length +' 筆資料...');
				data = $scope.data;
				for (var i=$scope.length_now; i<$scope.data.length; i++){	
					data[i].serial = i+1;	
					if (api_command == "comments" || api_command == "feed"){
						data[i].realname = $scope.data[i].from.name;
						data[i].realtime = timeConverter($scope.data[i].created_time);
						data[i].fromid = $scope.data[i].from.id;
						data[i].link = "http://www.facebook.com/"+$scope.data[i].from.id;	
						data[i].text = $scope.data[i].message;
						if (!$scope.cleanURL){
							data[i].postlink = "http://www.facebook.com/"+$scope.data[i].id;	
						}else{
							data[i].postlink = $scope.cleanURL+"?fb_comment_id="+$scope.data[i].id;
						}
						if (!$scope.data[i].message_tags){
							data[i].message_tags = [];
						}
					}else if (api_command == "likes"){
						data[i].realname = $scope.data[i].name;
						data[i].fromid = $scope.data[i].id;
						data[i].link = "http://www.facebook.com/"+$scope.data[i].id;
						if (!$scope.data[i].message_tags){
							data[i].message_tags = [];
						}
					}else if (api_command == "sharedposts"){
						data[i].realname = $scope.data[i].from.name;
						data[i].realtime = timeConverter($scope.data[i].created_time);
						data[i].fromid = $scope.data[i].from.id;
						data[i].link = "http://www.facebook.com/"+$scope.data[i].from.id;
						data[i].text = "http://www.facebook.com/"+$scope.data[i].id;
						if (!$scope.data[i].message_tags){
							data[i].message_tags = [];
						}
					}
				}
				$scope.length_now += $scope.data.length;
				
				if (res.paging.next){
					$scope.getDataNext(res.paging.next,api_command);
				}else{
					if ($scope.id_array.length == 0){	
						$scope.comments = data;
						$scope.$apply();
						$scope.finished();
					}else{
						$scope.getData($scope.id_array.pop(),api_command);
					}
				}
			}
		});
	}
	$scope.getDataNext = function(url, api_command){
		$.get(url,function(res){
			if (res.data.length == 0){
				$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
				setTimeout(function(){
					$scope.comments = data;
					$scope.$apply();
					$scope.finished();
				},1000);
			}else{
				for (var i=0; i<res.data.length; i++){
					$scope.data.push(res.data[i]);
				}

				data = $scope.data;
				$(".console .message").text('已截取  '+ $scope.data.length +' 筆資料...');
				for (var i = $scope.length_now; i<$scope.data.length; i++){	
					data[i].serial = i+1;	
					if (api_command == "comments" || api_command == "feed"){
						data[i].realname = $scope.data[i].from.name;
						data[i].realtime = timeConverter($scope.data[i].created_time);
						data[i].fromid = $scope.data[i].from.id;
						data[i].link = "http://www.facebook.com/"+$scope.data[i].from.id;	
						data[i].text = $scope.data[i].message;
						if (!$scope.cleanURL){
							data[i].postlink = "http://www.facebook.com/"+$scope.data[i].id;	
						}else{
							data[i].postlink = $scope.cleanURL+"?fb_comment_id="+$scope.data[i].id;
						}
						if (!$scope.data[i].message_tags){
							data[i].message_tags = [];
						}
					}else if (api_command == "likes"){
						data[i].realname = $scope.data[i].name;
						data[i].fromid = $scope.data[i].id;
						data[i].link = "http://www.facebook.com/"+$scope.data[i].id;
						if (!$scope.data[i].message_tags){
							data[i].message_tags = [];
						}
					}else if (api_command == "sharedposts"){
						data[i].realname = $scope.data[i].from.name;
						data[i].realtime = timeConverter($scope.data[i].created_time);
						data[i].fromid = $scope.data[i].from.id;
						data[i].link = "http://www.facebook.com/"+$scope.data[i].from.id;
						data[i].text = "http://www.facebook.com/"+$scope.data[i].id;
						if (!$scope.data[i].message_tags){
							data[i].message_tags = [];
						}
					}
				}

				$scope.length_now += res.data.length;

				if (res.paging.next){
					$scope.getDataNext(res.paging.next,api_command);
				}else{
					if ($scope.id_array.length == 0){
						$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
						setTimeout(function(){
							$scope.comments = data;
							$scope.$apply();
							$scope.finished();
							var table = $(".main_table").DataTable({
								"pageLength": 1000,
								"searching": true,
								"lengthChange": false
							});

							$("#searchName").on( 'keyup', function () {
								table
								.columns(3)
								.search(this.value)
								.draw();
							});
							$("#searchComment").on( 'keyup', function () {
								table
								.columns(4)
								.search(this.value)
								.draw();
							});
						},1000);
					}else{
						$scope.getData($scope.id_array.pop(),api_command);
					}
				}
			}
		}).fail(function(){
			$(".console .message").text('發生錯誤，10秒後自動重試，請稍待');
			setTimeout(function(){
				$(".console .message").text('繼續截取資料');
				$scope.getDataNext(url,api_command);
			},10000);
		});	
	}
	$scope.finished = function(){
		$(".loading").addClass("hide");
		$(".uiPanel .left").addClass("move");
		$(".uiPanel .left").one('webkitTransitionEnd oTransitionEnd transitionend', function(){
			$(".uiPanel .right").addClass("move");
		});
		$(".main_table").removeClass("hide");


		$(".update_area,.donate_area").slideUp();
		$(".result_area").slideDown();
		bootbox.alert("done");	
	}
	$scope.checkvip = function(fbid){
		FB.api("https://graph.facebook.com/v2.3/"+fbid,function(res){
			if (res.to){
				$scope.vip = "1";
			}else{
				$scope.vip = "0";
			}
		});
	}

	$scope.getAuth = function(type){
		$scope.gettype = type;
		if (type == "addScope"){
			FB.login(function(response) {
				$scope.callback(response);
			}, {scope: 'read_stream,user_photos,user_posts,user_groups',return_scopes: true});
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
   			if ($scope.gettype == "addScope"){
   				if (response.authResponse.grantedScopes.indexOf('read_stream') >= 0){
   					bootbox.alert("付費授權完成，請再次執行抓留言/讚\nAuthorization Finished! Please getComments or getLikes again.");
   				}else{
   					bootbox.alert("付費授權失敗，請聯絡管理員進行確認\nAuthorization Failed! Please contact the administrator.");
   				}
   			}else{
   				if ($scope.gettype == "sharedposts"){
   					var getpermission = false;
   					FB.api("https://graph.facebook.com/v2.3/me/permissions",function(res){
   						for(var i=0; i<res.data.length; i++){
   							var now = res.data[i];
   							if (now.permission == "read_stream" && now.status == "granted"){
								getpermission = true;
   							}
   						}
   						if (getpermission){
   							$scope.getFBID($scope.gettype);	
   						}else{
   							bootbox.alert("抓分享功能需要先申請，詳細說明請見粉絲團");
   						}
   					});
   				}else{
   					$scope.getFBID($scope.gettype);	
   				}   				
   			}
		}else{
			FB.login(function(response) {
				$scope.callback(response);
			}, {scope: 'read_stream,user_photos,user_posts,user_groups',return_scopes: true});
		}
	}


	$scope.fbid_check = function(){
		var fbid_array = new Array();
		if ($scope.gettype == "url_comments"){
			var posturl = $($("#enterURL .url")[0]).val();
			if (posturl.indexOf("?") > 0){
				posturl = posturl.substring(0,posturl.indexOf("?"));
			}
			$scope.cleanURL = posturl;
			FB.api("https://graph.facebook.com/v2.3/"+posturl+"/",function(res){
				fbid_array.push(res.og_object.id);
				$scope.urlid = fbid_array.toString();
				$scope.gettype = "comments";
				$scope.id_array = fbid_array;
			});
		}else{
			var regex = /\d{4,}/g;
			for(var i=0; i<$("#enterURL .url").length; i++){
				var posturl = $($("#enterURL .url")[i]).val();
				var checkType = posturl.indexOf("fbid=");
				var checkType2 = posturl.indexOf("events");
				var check_personal = posturl.indexOf("+");
				var result = posturl.match(regex);

				if (check_personal > 0){
					fbid_array.push(posturl.replace("+","_"));
				}else{
					if (checkType > 0){
						var start = checkType+5;
						var end = posturl.indexOf("&",start);
						var fbid = posturl.substring(start,end);
						fbid_array.push(fbid);
					}else if (checkType2 > 0 && result.length == 1){
						fbid_array.push(result[0]);
						$scope.gettype = "feed";
					}else{
						if (result.length == 1 || result.length == 3){
							fbid_array.push(result[0]);
						}else{
							fbid_array.push(result[result.length-1]);
						}
					}
				}
			}
			$scope.urlid = fbid_array.toString();
			console.log(fbid_array);
			return fbid_array;
		}
	}

	$scope.choose = function(){
		$("#awardList tbody").html("");
		award = new Array();
		var num = $("#howmany").val();
		
		var unique = $("#unique").prop("checked");
		var filter_word = $("#searchComment").val();
		var istag = $("#tag").prop("checked");

		var afterFilterData = $scope.totalFilter(data, unique, filter_word, istag);

		var temp = genRandomArray(afterFilterData.length).splice(0,num);
		for (var i=0; i<num; i++){
			award.push(afterFilterData[temp[i]]);
		}

		for (var j=0; j<num; j++){
			$("<tr align='center' class='success'><td>"+award[j].serial+"</td><td class='fromid"+j+"'>"+award[j].fromid+"</td><td><a href='"+award[j].link+"' target='_blank'>"+award[j].realname+"</a></td><td class='force-break'><a href='"+award[j].postlink+"' target='_blank'>"+award[j].text+"</a></td><td>"+award[j].realtime+"</td></tr>").appendTo("#awardList tbody");
			if (award[j].liked == "true"){
				$("<td><i class='glyphicon glyphicon-thumbs-up'></i></td>").insertAfter(".fromid"+j);	
			}else{
				$("<td></td>").insertAfter(".fromid"+j);
			}
		}
		$("#awardList").fadeIn(1000);
	}

	$scope.getLikeInComments = function(){
		$scope.allLikeData = new Array();
		var id_array = $scope.fbid_check();

		$(".loading").removeClass("hide");
		FB.api("https://graph.facebook.com/v2.3/"+id_array[0]+"/likes?limit=500",function(res){
			for (var i=0; i<res.data.length; i++){
				$scope.allLikeData.push(res.data[i]);
			}
			if (res.paging.next){
				$scope.getLikeNext(res.paging.next);
			}else{		
				$scope.compare();
			}
		});
	}
	$scope.getLikeNext = function(url){
		$.get(url,function(res){
			for (var i=0; i<res.data.length; i++){
				$scope.allLikeData.push(res.data[i]);
			}
			if (res.paging.next){
				$scope.getLikeNext(res.paging.next);
			}else{
				$scope.compare();
			}
		});
	}
	$scope.compare = function(){
		for(var i=0; i<=$scope.comments.length-1; i++){
			for(var j=0; j<$scope.allLikeData.length; j++){
				if ($scope.comments[i].fromid == $scope.allLikeData[j].id){
					$scope.comments[i].liked = "true";
				}
			}
		}

		for(var i=0; i<=$scope.comments.length-1; i++){
			for(var j=0; j<$scope.filteredData.length; j++){
				if ($scope.comments[i].fromid == $scope.filteredData[j].id && $scope.comments[i].liked == "true"){
					$scope.filteredData[j].liked = "true";
				}
			}
		}

		$scope.$apply();
		$(".loading").addClass("hide");
		bootbox.alert("done");
	}
	$scope.totalFilter = function(ary,isDuplicate,filter,isTag){
		var filteredData = ary;
		if (isDuplicate){
			filteredData = $scope.filter_unique(filteredData);
		}
		filteredData = $scope.filter_word(data,filter);
		if (isTag){
			filteredData = $scope.filter_tag(filteredData);
		}
		return filteredData;
	}
	$scope.filter_unique = function(filteredData){
		var output = [];
		var keys = [];
		filteredData.forEach(function(item) {
			var key = item["fromid"];
			if(keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	}
	$scope.filter_word = function(ary,tar){
		var newAry = $.grep(ary,function(n, i){
			if (n.text.indexOf(tar) > -1){
				return true;
			}
		});
		return newAry;
	}
	$scope.filter_tag = function(ary){
		var newAry = $.grep(ary,function(n, i){
			if (n.message_tags.length > 0){
				return true;
			}
		});
		return newAry;
	}
});

