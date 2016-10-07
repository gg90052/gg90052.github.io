"use strict";

var rawlist = [];
var withList = [];
var placeList = [];
var uploadURL;
var userid = "";

$(".update").click(function () {
	FB.login(function (response) {
		callback(response);
	});
});

$(".goSearch").click(function (e) {
	$(this).removeClass("noresult");
	$(this).blur();
	filterInit($(".search"));
	var word = $(".search").val();
	var newList = filter('message', word);
	if (newList.length == 0) {
		$(this).addClass("noresult");
	}
	renderList(newList);
});

$(".stat").click(function () {
	$(".statistics").removeClass('hide').click(function (e) {
		if ($(e.target).hasClass('statistics')) {
			$(".statistics").addClass('hide');
			$(".statistics").off('click');
		}
	});
	$(".statistics .header .close").click(function () {
		$(".statistics").addClass('hide');
		$(".statistics").off('click');
	});
});

function callback(response) {
	if (response.status === 'connected') {
		getList();
	} else {
		FB.login(function (response) {
			callback(response);
		});
	}
}

function getList() {
	$("#feeds").html("");
	rawlist = [];
	$(".waiting").removeClass("hide");
	var fbid = $('.ui .fbid').val();
	FB.api("https://graph.facebook.com/v2.7/" + fbid + "/posts?fields=source,link,status_type,message_tags,with_tags,place,full_picture,created_time,from,message&limit=50", function (res) {
		userid = res.data[0].from.id;
		for (var i = 0; i < res.data.length; i++) {
			var obj = res.data[i];
			obj.origin_time = obj.created_time;
			obj.created_time = timeConverter(obj.created_time);
			rawlist.push(obj);
		}
		if (res.paging) {
			if (res.paging.next) {
				getNext(res.paging.next);
			} else {
				finish();
			}
		} else {
			finish();
		}
	});
}

function getNext(url) {
	$.getJSON(url, function (res) {
		console.log(res);
		for (var i = 0; i < res.data.length; i++) {
			var obj = res.data[i];
			obj.origin_time = obj.created_time;
			obj.created_time = timeConverter(obj.created_time);
			rawlist.push(obj);
		}
		$(".console .message").text('已截取  ' + rawlist.length + ' 筆資料...');
		if (res.paging) {
			if (res.paging.next) {
				getNext(res.paging.next);
			} else {
				finish();
			}
		} else {
			finish();
		}
	});
}

function genData(obj) {
	var src = obj.full_picture || 'http://placehold.it/300x225';
	var ids = obj.id.split("_");
	var link = 'https://www.facebook.com/' + ids[0] + '/posts/' + ids[1];

	var mess = obj.message ? obj.message.replace(/\n/g, "<br />") : "";
	var str = "<div class=\"card\">\n\t\t\t\t<a href=\"" + link + "\" target=\"_blank\">\n\t\t\t\t\t<div class=\"card-image\">\n\t\t\t\t\t\t<figure class=\"image is-4by3\">\n\t\t\t\t\t\t\t<img src=\"" + src + "\" alt=\"\">\n\t\t\t\t\t\t</figure>\n\t\t\t\t\t</div>\n\t\t\t\t</a>\n\t\t\t\t<div class=\"card-content\">\n\t\t\t\t\t<div class=\"content\">\n\t\t\t\t\t\t" + mess + "\n\t\t\t\t\t\t<br>\n\t\t\t\t\t\t<a href=\"" + link + "\" target=\"_blank\"><small>" + obj.created_time + "</small></a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>";
	return str;
}

function finish() {
	// console.log(rawlist);
	$(".waiting").addClass("hide");
	$('input.time').bootstrapMaterialDatePicker({
		weekStart: 0,
		format: 'YYYY/MM/DD',
		time: false,
		maxDate: rawlist[0].created_time,
		minDate: rawlist[rawlist.length - 1].created_time
	}).on('change', function (e, date) {
		var start = Date.parse($("input.start").val());
		var end = Date.parse($("input.end").val());
		if (start && end) {
			$(".ui select, .ui input:not(.time)").val("");
			if (start > end) {
				var temp = start;
				start = end;
				end = temp;
			}
			var newList = filterTime(start, end);
			renderList(newList);
		}
	});

	renderList(rawlist.slice(0, 25));
	$("button").removeClass("is-loading");
	genStat();
	// alert("完成");

	FB.api("https://graph.facebook.com/v2.7/" + rawlist[0].id + "/comments?summary=true", function (res) {
		console.log(res);
	});
}

function renderList(list) {
	$("#feeds").html("");
	for (var i = 0; i < list.length; i++) {
		var obj = list[i];
		var str = genData(obj);
		$("#feeds").append(str);
	}
}

function timeConverter(UNIX_timestamp) {
	var a = moment(UNIX_timestamp)._d;
	var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	if (date < 10) {
		date = "0" + date;
	}
	if (min < 10) {
		min = "0" + min;
	}
	var sec = a.getSeconds();
	if (sec < 10) {
		sec = "0" + sec;
	}
	var time = year + '-' + month + '-' + date + " " + hour + ':' + min + ':' + sec;
	return time;
}

function filter(key, value) {
	var arr = [];
	if (value == 'allWith') {
		arr = $.grep(rawlist, function (obj) {
			return obj.with_tags;
		});
	} else if (value == 'allPlace') {
		arr = $.grep(rawlist, function (obj) {
			return obj.place;
		});
	} else {
		arr = $.grep(rawlist, function (obj) {
			var target = obj[key] || "";
			return JSON.stringify(target).indexOf(value) >= 0;
		});
	}
	return arr;
}

function filterTime(start, end) {
	var arr = $.grep(rawlist, function (obj) {
		var time = Date.parse(obj.created_time.substr(0, 10));
		return time >= start && time <= end + 86399000;
	});
	return arr;
}

function filterInit(tar) {
	var val = tar.val();
	$(".ui select, .ui input").val("");
	tar.val(val);
}

function genStat() {
	$(".shareCard .picture").html("");
	$(".shareCard .other").html("");
	var totalWords = 0;
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = rawlist[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var i = _step.value;

			if (i.message) {
				totalWords += i.message.length;
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	moment.locale('zh_tw');
	var regTime = moment(rawlist[rawlist.length - 1].created_time).toNow(true);

	$(".shareCard .picture").append("<img crossOrigin=\"Anonymous\" id=\"profile_pic\" src=\"http://graph.facebook.com/" + rawlist[0].from.id + "/picture?width=150&height=180\" />");
	// $(".shareCard .other").append(`<p>從 ${rawlist[rawlist.length-1].created_time.substr(0,10)} 在 Facebook 發表第一篇貼文</p>`);
	// $(".shareCard .other").append(`<p>在 ${regTime} 來發了 ${rawlist.length} 篇貼文，共 ${totalWords} 字</p>`);
	// $(".shareCard .other").append(`<p>曾和 ${withList.length} 位朋友一同出遊 </p>`);
	// $(".shareCard .other").append(`<p>在 ${placeList.length} 地方打過卡 </p>`);

	$(".shareCard .other").append("<p><span class=\"list\">第一篇貼文時間：</span><span class=\"listValue\">" + rawlist[rawlist.length - 1].created_time.substr(0, 10) + "</span></p>");
	$(".shareCard .other").append("<p><span class=\"list\">總發文篇數：</span><span class=\"listValue\">" + rawlist.length + " 篇</span></p>");
	$(".shareCard .other").append("<p><span class=\"list\">總發文字數：</span><span class=\"listValue\">" + totalWords + " 字</span></p>");
	$(".shareCard .other").append("<p><span class=\"list\">打卡總人數：</span><span class=\"listValue\">" + withList.length + " 人</span></p>");
	$(".shareCard .other").append("<p><span class=\"list\">打卡地點數：</span><span class=\"listValue\">" + placeList.length + "</span></p>");
}