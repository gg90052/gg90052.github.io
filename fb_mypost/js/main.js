var rawlist = [];
var withList = [];
var placeList = [];
var userid = "";
var lastData = JSON.parse(localStorage.getItem("posts"));
if (lastData){
	rawlist = lastData;
	finish();
}

$(".update").click(function(){
	FB.login(function(response) {
		callback(response);
	}, {scope: 'user_posts',return_scopes: true});
});

$(".goSearch").click(function(e){
	$(this).removeClass("noresult");
	$(this).blur();
	filterInit($(".search"));
	let word = $(".search").val();
	let newList = filter('message', word);
	if (newList.length == 0){
		$(this).addClass("noresult");
	}
	renderList(newList);
});

$(".place select").change(function(){
	let val = $(this).val();
	if (val){
		if (val == 'undefined'){
			val = $(this).find(":selected").text();
		}
		filterInit($(this));
		let newList = filter('place', val);
		$(this).blur();
		renderList(newList);
	}
});

$(".with select").change(function(){
	let val = $(this).val();
	if (val){
		filterInit($(this));
		let newList = filter('with_tags', val);
		$(this).blur();
		renderList(newList);
	}
});


function callback(response) {
	if (response.status === 'connected') {
		if (response.authResponse.grantedScopes.indexOf('user_posts') >= 0){
			getList();
		}else{
			alert("需要完整授權，請再試一次");
		}
	}else{
		FB.login(function(response) {
			callback(response);
		}, {scope: 'user_posts',return_scopes: true});
	}
}

function getList(){
	$("#feeds").html("");
	rawlist = [];
	$(".waiting").removeClass("hide");
	FB.api("https://graph.facebook.com/v2.7/me/posts?fields=source,link,status_type,message_tags,with_tags,place,full_picture,created_time,from,message&limit=50",function(res){
		userid = res.data[0].from.id;
		for(var i=0; i<res.data.length; i++){
			let obj = res.data[i];
			obj.origin_time = obj.created_time;
			obj.created_time = timeConverter(obj.created_time);
			rawlist.push(obj);
		}
		if (res.paging){
			if (res.paging.next){
				getNext(res.paging.next);
			}else{
				finish();
			}
		}else{
			finish();
		}
	});

}

function getNext(url){
	$.getJSON(url, function(res){
		for(var i=0; i<res.data.length; i++){
			let obj = res.data[i];
			obj.origin_time = obj.created_time;
			obj.created_time = timeConverter(obj.created_time);
			rawlist.push(obj);
		}
		$(".console .message").text('已截取  '+ rawlist.length +' 筆資料...');
		if (res.paging){
			if (res.paging.next){
				getNext(res.paging.next);
			}else{
				finish();
			}
		}else{
			finish();
		}
	});
}

function genData(obj){
	let src = obj.full_picture || 'http://placehold.it/300x225';
	let ids = obj.id.split("_");
	let link = 'https://www.facebook.com/'+ids[0]+'/posts/'+ids[1];
	let withTag = "";
	let place = "";
	let addition = "";
	if (obj.with_tags){
		for(let i of obj.with_tags.data){
			if (JSON.stringify(withList).indexOf(i.id) === -1){
				withList.push(i);
			}
			withTag += i.name + "、";
		}
		withTag = withTag.slice(0,-1);
		addition += `和 ${withTag}`;
	}
	if (obj.place){
		if (JSON.stringify(placeList).indexOf(obj.place.id) === -1){
			placeList.push(obj.place);
		}
		place = obj.place.name;
		addition += ` 在 ${place}`;
	}

	let mess = obj.message ? obj.message.replace(/\n/g,"<br />") : "";
	let	str = `<div class="card">
				<a href="${link}" target="_blank">
					<div class="card-image">
						<figure class="image is-4by3">
							<img src="${src}" alt="">
						</figure>
					</div>
				</a>
				<div class="card-content">
					<div class="content">
						${mess}
						<br>
						<a href="${link}" target="_blank"><small>${obj.created_time}</small></a>
						<div class="message">${addition}</div>
					</div>
				</div>
			</div>`;
	return str;
}

function finish(){
	console.log(rawlist);
	$(".waiting").addClass("hide");
	$('input.time').bootstrapMaterialDatePicker({ 
		weekStart : 0,
		format : 'YYYY/MM/DD',
		time: false,
		maxDate: rawlist[0].created_time,
		minDate: rawlist[rawlist.length-1].created_time
	}).on('change',function(e, date){
		let start = Date.parse($("input.start").val());
		let end = Date.parse($("input.end").val());
		if (start && end){
			$(".ui select, .ui input:not(.time)").val("");
			if (start > end){
				let temp = start;
				start = end;
				end = temp;
			}
			let newList = filterTime(start, end);
			renderList(newList);
		}
	});

	genSelect(rawlist);
	renderList(rawlist.slice(0,25));
	localStorage.setItem("posts", JSON.stringify(rawlist));
	$("button").removeClass("is-loading");
	alert("完成");
}

function genSelect(list){
	for(let obj of list){
		if (obj.with_tags){
			for(let i of obj.with_tags.data){
				if (JSON.stringify(withList).indexOf(i.id) === -1){
					withList.push(i);
				}
			}
		}
		if (obj.place){
			if (JSON.stringify(placeList).indexOf(obj.place.id) === -1){
				placeList.push(obj.place);
			}
		}
	}
	for(let i of withList){
		$(".with select").append(`<option value="${i.id}">${i.name}</option>`);
	}
	for(let i of placeList){
		$(".place select").append(`<option value="${i.id}">${i.name}</option>`);
	}
}

function renderList(list){
	$("#feeds").html("");
	for(var i=0; i<list.length; i++){
		let obj = list[i];
		let str = genData(obj);
		$("#feeds").append(str);
	}
}

function timeConverter(UNIX_timestamp){
	var a = moment(UNIX_timestamp)._d;
	var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	if (date < 10){
		date = "0"+date;
	}
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

function filter(key, value){
	let arr = $.grep(rawlist, function(obj){
		let target = obj[key] || "";
		return JSON.stringify(target).indexOf(value) >= 0;
	});
	return arr;
}

function filterTime(start, end){
	let arr = $.grep(rawlist, function(obj){
		Date.parse($("input.start").val());
		let time = Date.parse(obj.created_time);
		return (time >= start && time <= (end + 86399000))
	});
	return arr;
}

function filterInit(tar){
	let val =  tar.val();
	$(".ui select, .ui input").val("");
	tar.val(val);
}
