var comments = [];
var data = [];
var id_array = [];
var gettype;
var isGroup = false;
var length_now = 0;
var userid,urlid;
var cleanURL = false;

$(document).ready(function(){
	$("#btn_comments").click(function(){
		init();
		getAuth('comments');
	});
	$("#btn_like").click(function(){
		init();
		getAuth('likes');
	});
	$("#btn_url").click(function(){
		init();
		getAuth('url_comments');
	});
	$("#btn_pay").click(function(){
		getAuth('addScope');
	});
	$("#btn_choose").click(function(){
		choose();
	});
	$("#btn_excel").click(function(e){
		if (data.length > 7000 || e.ctrlKey == true){
			// bootbox.alert("您的資料量過多，需要使用別的方法，請聯繫管理員");
			$(".bigExcel").removeClass("hide");
		}else{
			var filterData = totalFilter(data,$("#unique").prop("checked"),$("#tag").prop("checked"));	
			JSONToCSVConvertor(forExcel(filterData), "Comment_helper", true);
		}
	});

	$("#genExcel").click(function(){
		var filterData = totalFilter(data,$("#unique").prop("checked"),$("#tag").prop("checked"));
		var excelString = forExcel(filterData);
		$("#exceldata").val(JSON.stringify(excelString));
	});

	var clipboard = new Clipboard('.copybtn');
	clipboard.on('success', function(e) {
		console.log(e);
	});
	clipboard.on('error', function(e) {
		console.error(e);
	});
});

function init(){
	data = [];
	id_array = [];
	length_now = 0;
	$(".main_table").DataTable().destroy();
	$(".main_table tbody").html("");
}

function getAuth(type){
	gettype = type;
	if (type == "addScope"){
		FB.login(function(response) {
			callback(response);
		}, {scope: 'read_stream,user_photos,user_posts,user_groups',return_scopes: true});
	}else{
		FB.getLoginStatus(function(response) {
			callback(response);
		});
	}
}

function callback(response){
	if (response.status === 'connected') {
		var accessToken = response.authResponse.accessToken;
		if (gettype == "addScope"){
			if (response.authResponse.grantedScopes.indexOf('read_stream') >= 0){
				bootbox.alert("付費授權完成，請再次執行抓留言/讚\nAuthorization Finished! Please getComments or getLikes again.");
			}else{
				bootbox.alert("付費授權失敗，請聯絡管理員進行確認\nAuthorization Failed! Please contact the administrator.");
			}
		}else{
			getFBID(gettype);			
		}
	}else{
		FB.login(function(response) {
			callback(response);
		}, {scope: 'read_stream,user_photos,user_posts,user_groups',return_scopes: true});
	}
}


function getFBID(type){
	var comments = new Array();
	var data = new Array();
	var length_now = 0;
	id_array = fbid_check();
	$(".console .message").text('');
	$(".main_table").DataTable().destroy();

	if (type == "url_comments"){
		var t = setInterval(function(){
			if (gettype  == "comments"){
				clearInterval(t);
				waitingFBID("comments");
			}
		},100);
	}else{
		waitingFBID(type);
	}
}

function fbid_check(){
	var fbid_array = new Array();
	if (gettype == "url_comments"){
		var posturl = $($("#enterURL .url")[0]).val();
		if (posturl.indexOf("?") > 0){
			posturl = posturl.substring(0,posturl.indexOf("?"));
		}
		cleanURL = posturl;
		FB.api("https://graph.facebook.com/v2.3/"+cleanURL+"/",function(res){
			fbid_array.push(res.og_object.id);
			urlid = fbid_array.toString();
			gettype = "comments";
			id_array = fbid_array;
		});
	}else{
		var regex = /\d{4,}/g;
		for(var i=0; i<$("#enterURL .url").length; i++){
			var posturl = $($("#enterURL .url")[i]).val();
			var checkType = posturl.indexOf("fbid=");
			var checkType2 = posturl.indexOf("events");
			var checkGroup = posturl.indexOf("/groups/");
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
					gettype = "feed";
				}else{
					if (result.length == 1 || result.length == 3){
						fbid_array.push(result[0]);
					}else{
						fbid_array.push(result[result.length-1]);
					}
				}
				if (checkGroup > 0) isGroup = true;
			}
		}
		urlid = fbid_array.toString();
		return fbid_array;
	}
}

function waitingFBID(type){
	$(".share_post").addClass("hide");
	$(".like_comment").removeClass("hide");
	getData(id_array.pop());
	$(".update_donate").slideUp();
}

function getData(post_id){
	var api_command = gettype;
	$(".waiting").removeClass("hide");
	FB.api("https://graph.facebook.com/v2.3/"+post_id+"/"+api_command+"?limit=500",function(res){
		if(res.error){
			$(".console .message").text('發生錯誤，5秒後自動重試，請稍待');
			setTimeout(function(){
				$(".console .message").text('重新截取資料');
				getData(post_id);
			},5000);
		}
		if (res.data.length == 0){
			bootbox.alert("沒有資料或無法取得\n小助手僅免費支援粉絲團抽獎，若是要擷取社團留言請付費\nNo comments. If you want get group comments, you need to pay for it.");
			$(".waiting").addClass("hide");
		}else{
			for (var i=0; i<res.data.length; i++){
				data.push(res.data[i]);
			}
			$(".console .message").text('已截取  '+ data.length +' 筆資料...');
			for (var i=length_now; i<data.length; i++){	
				data[i].serial = i+1;	
				if (api_command == "comments" || api_command == "feed"){
					data[i].realname = data[i].from.name;
					data[i].realtime = timeConverter(data[i].created_time);
					data[i].fromid = data[i].from.id;
					data[i].link = "http://www.facebook.com/"+data[i].from.id;	
					data[i].text = data[i].message;
					if (!data[i].message){
						data[i].text = "";
					}
					if (!cleanURL){
						data[i].postlink = "http://www.facebook.com/"+data[i].id;	
					}else{
						data[i].postlink = cleanURL+"?fb_comment_id="+data[i].id;
					}
					if (!data[i].message_tags){
						data[i].message_tags = [];
					}
				}else if (api_command == "likes"){
					data[i].realname = data[i].name;
					data[i].fromid = data[i].id;
					data[i].link = "http://www.facebook.com/"+data[i].id;
					if (!data[i].message_tags){
						data[i].message_tags = [];
					}
				}
			}
			length_now += data.length;

			if (res.paging.next){
				getDataNext(res.paging.next,api_command);
			}else{
				if (id_array.length == 0){	
					finished();
				}else{
					getData(id_array.pop(),api_command);
				}
			}
		}
	});
}

function getDataNext(url,api_command){
	$.get(url,function(res){
		if (res.data.length == 0){
			$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
			setTimeout(function(){
				finished();
			},1000);
		}else{
			for (var i=0; i<res.data.length; i++){
				data.push(res.data[i]);
			}
			$(".console .message").text('已截取  '+ data.length +' 筆資料...');
			for (var i = length_now; i<data.length; i++){	
				data[i].serial = i+1;	
				if (api_command == "comments" || api_command == "feed"){
					data[i].realname = data[i].from.name;
					data[i].realtime = timeConverter(data[i].created_time);
					data[i].fromid = data[i].from.id;
					data[i].link = "http://www.facebook.com/"+data[i].from.id;	
					data[i].text = data[i].message;
					if (!data[i].message){
						data[i].text = "";
					}
					if (!cleanURL){
						data[i].postlink = "http://www.facebook.com/"+data[i].id;	
					}else{
						data[i].postlink = cleanURL+"?fb_comment_id="+data[i].id;
					}
					if (!data[i].message_tags){
						data[i].message_tags = [];
					}
				}else if (api_command == "likes"){
					data[i].realname = data[i].name;
					data[i].fromid = data[i].id;
					data[i].link = "http://www.facebook.com/"+data[i].id;
					if (!data[i].message_tags){
						data[i].message_tags = [];
					}
				}
			}

			length_now += res.data.length;

			if (res.paging.next){
				getDataNext(res.paging.next,api_command);
			}else{
				if (id_array.length == 0){
					$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
					setTimeout(function(){
						finished();
					},1000);
				}else{
					getData(id_array.pop(),api_command);
				}
			}
		}
	}).fail(function(){
		$(".console .message").text('發生錯誤，10秒後自動重試，請稍待');
		setTimeout(function(){
			$(".console .message").text('繼續截取資料');
			getDataNext(url,api_command);
		},10000);
	});	
}

function finished(){
	insertTable(data);
	activeDataTable();
	filterEvent();
	$(".waiting").addClass("hide");
	$(".main_table").removeClass("hide");
	$(".update_area,.donate_area").slideUp();
	$(".result_area").slideDown();
	bootbox.alert("done");	
}

function insertTable(data){
	var filterData = totalFilter(data,$("#unique").prop("checked"),$("#tag").prop("checked"));
	for(var i=0; i<filterData.length; i++){
		var insertQuery = '<tr><td>'+(i+1)+'</td><td>'+filterData[i].fromid+'</td><td><a href="'+filterData[i].link+'" target="_blank">'+filterData[i].realname+'</a></td><td class="force-break"><a href="'+filterData[i].postlink+'" target="_blank">'+filterData[i].text+'</a></td><td>'+filterData[i].realtime+'</td></tr>';
		$(".like_comment").append(insertQuery);
	}
}

function activeDataTable(){
	var table = $(".main_table").DataTable({
		"pageLength": 1000,
		"searching": true,
		"lengthChange": false
	});

	$("#searchName").on( 'blur change keyup', function () {
		table
		.columns(2)
		.search(this.value)
		.draw();
	});
	$("#searchComment").on( 'blur change keyup', function () {
		table
		.columns(3)
		.search(this.value)
		.draw();
	});
}

function filterEvent(){
	$("#unique, #tag").on('change',function(){
		var filterData = totalFilter(data,$("#unique").prop("checked"),$("#tag").prop("checked"));
		$(".main_table").DataTable().destroy();
		$(".main_table tbody").html("");
		insertTable(filterData);
		activeDataTable();
	});
}

function choose(){
	$("#awardList tbody").html("");
	award = new Array();
	var num = $("#howmany").val();

	var unique = $("#unique").prop("checked");
	var istag = $("#tag").prop("checked");

	var afterFilterData = totalFilter(data, unique, istag);

	var temp = genRandomArray(afterFilterData.length).splice(0,num);
	for (var i=0; i<num; i++){
		award.push(afterFilterData[temp[i]]);
	}

	for (var j=0; j<num; j++){
		$("<tr align='center' class='success'><td>"+award[j].serial+"</td><td class='fromid"+j+"'>"+award[j].fromid+"</td><td><a href='"+award[j].link+"' target='_blank'>"+award[j].realname+"</a></td><td class='force-break'><a href='"+award[j].postlink+"' target='_blank'>"+award[j].text+"</a></td><td>"+award[j].realtime+"</td></tr>").appendTo("#awardList tbody");
	}
	$("#awardList").fadeIn(1000);
}

function totalFilter(ary,isDuplicate,isTag){
	var word = $("#searchComment").val();
	var filteredData = ary;
	if (isDuplicate){
		filteredData = filter_unique(filteredData);
	}
	filteredData = filter_word(filteredData,word);
	if (isTag){
		filteredData = filter_tag(filteredData);
	}
	return filteredData;
}
function filter_unique(filteredData){
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
function filter_word(ary,tar){
	if (gettype == "likes"){
		return ary;
	}else{
		var newAry = $.grep(ary,function(n, i){
			if (n.text.indexOf(tar) > -1){
				return true;
			}
		});
		return newAry;
	}
}
function filter_tag(ary){
	var newAry = $.grep(ary,function(n, i){
		if (n.message_tags.length > 0){
			return true;
		}
	});
	return newAry;
}












function timeConverter(UNIX_timestamp){
	 var a = new Date(UNIX_timestamp);
 	 var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
     var year = a.getFullYear();
     var month = months[a.getMonth()];
     var date = a.getDate();
     var hour = a.getHours();
     var min = a.getMinutes();
     if (min < 10){
     	min = "0"+min;
     }
     var sec = a.getSeconds();
     if (sec < 10){
     	sec = "0"+sec;
     }
     var time = year+'-'+month+'-'+date+" "+hour+':'+min+':'+sec ;
     return time;
 }

 function genRandomArray(n) {
  var ary = new Array();
  var i, r, t;
  for (i = 0 ; i < n ; ++i) {
   ary[i] = i;
  }
  for (i = 0 ; i < n ; ++i) {
   r = Math.floor(Math.random() * n);
   t = ary[r];
   ary[r] = ary[i];
   ary[i] = t;
  }
  return ary;
}

function forExcel(data){
	var newObj = [];
	$.each(data,function(i){
		var tmp = {
			"序號": this.serial,
			"臉書連結" : this.link,
			"姓名" : this.realname,
			"留言內容" : this.message,
			"留言時間" : this.realtime
		}
		newObj.push(tmp);
	});
	return newObj;
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    // CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}