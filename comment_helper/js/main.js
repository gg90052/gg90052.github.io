"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var comments = [];
var data = [];
var id_array = [];
var gettype;
var isGroup = false;
var length_now = 0;
var userid, urlid;
var cleanURL = false;
var pageid = "";
var postid = "";
var cursor = "";
var pureFBID = false;
var errorTime = 0;
var backend_data = { "data": "" };
var noPageName = false;
var endTime = nowDate();
var filterReaction = 'all';
var ci_counter = 0;
var limit = 500;
var hideName = false;
var isEvent = false;
var extension = false;
var url = "";
var userid = "";
var award = [];

var errorMessage = false;
window.onerror = handleErr;

function handleErr(msg, url, l) {
	limit = 100;
	if (!errorMessage) {
		console.log("%c發生錯誤，請點擊錯誤開頭的小三角形箭頭\n並將完整錯誤訊息截圖傳送給管理員", "font-size:30px; color:#F00");
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}

function render(file) {
	var reader = new FileReader();

	reader.onload = function (event) {
		var str = event.target.result;
		// var s = str.indexOf("<body>");
		// var e = str.lastIndexOf("</body>");
		// var json = str.substring((s+6),e);
		data = JSON.parse(str);
		getJSON();
	};

	reader.readAsText(file);
}

$(document).ready(function () {
	var hash = location.search;
	if (hash.indexOf("extension") >= 0) {
		$(".loading.checkAuth").removeClass("hide");
		extension = true;
	}

	$("#inputJSON").change(function () {
		render(this.files[0]);
	});

	$("#btn_comments").click(function (e) {
		if (e.ctrlKey) {
			hideName = true;
		}
		getAuth('comments');
	});

	$(".loading.checkAuth button").click(function (e) {
		checkAuth();
	});

	$(".ci").click(function (e) {
		ci_counter++;
		if (ci_counter >= 5) {
			$(".source .url, .source .btn").addClass("hide");
			$("#inputJSON").removeClass("hide");
		}
		if (e.ctrlKey) {
			getAuth('sharedposts');
			limit = 100;
		}
	});

	$(window).keydown(function (e) {
		if (e.ctrlKey) {
			$("#btn_excel").text("輸出JSON");
		}
	});
	$(window).keyup(function (e) {
		if (!e.ctrlKey) {
			$("#btn_excel").text("輸出EXCEL");
		}
	});

	$(".uipanel .react").change(function () {
		filterReaction = $(this).val();
		redoTable();
	});
	$("#btn_like").click(function () {
		getAuth('reactions');
	});
	$("#btn_url").click(function () {
		getAuth('url_comments');
	});
	$("#btn_pay").click(function () {
		getAuth('addScope');
	});
	$("#btn_choose").click(function () {
		choose();
	});
	$("#btn_excel").click(function (e) {
		var filterData = totalFilter(data, $("#unique").prop("checked"), $("#tag").prop("checked"));
		if (e.ctrlKey) {
			var url = 'data:text/json;charset=utf8,' + JSON.stringify(filterData);
			window.open(url, '_blank');
			window.focus();
		} else {
			if (data.length > 7000) {
				$(".bigExcel").removeClass("hide");
			} else {
				JSONToCSVConvertor(forExcel(filterData), "Comment_helper", true);
			}
		}
	});

	$("#moreprize").click(function () {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		} else {
			$(this).addClass("active");
			$(".gettotal").addClass("fadeout");
			$('.prizeDetail').addClass("fadein");
		}
	});
	$("#endTime").click(function () {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
	});
	$("#btn_addPrize").click(function () {
		$(".prizeDetail").append('<div class="prize"><div class="input_group">品名：<input type="text"></div><div class="input_group">抽獎人數：<input type="number"></div></div>');
	});

	$("#genExcel").click(function () {
		var filterData = totalFilter(data, $("#unique").prop("checked"), $("#tag").prop("checked"));
		var excelString = forExcel(filterData);
		$("#exceldata").val(JSON.stringify(excelString));
	});

	$('.rangeDate').daterangepicker({
		"singleDatePicker": true,
		"timePicker": true,
		"timePicker24Hour": true,
		"locale": {
			"format": "YYYY-MM-DD   HH:mm",
			"separator": "-",
			"applyLabel": "確定",
			"cancelLabel": "取消",
			"fromLabel": "From",
			"toLabel": "To",
			"customRangeLabel": "Custom",
			"daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
			"monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			"firstDay": 1
		}
	}, function (start, end, label) {
		endTime = start.format('YYYY-MM-DD-HH-mm-ss');
		redoTable();
	});
	$('.rangeDate').data('daterangepicker').setStartDate(endTime);
});

function init() {
	data = [];
	id_array = [];
	length_now = 0;
	$(".main_table").DataTable().destroy();
	$(".main_table tbody").html("");
	$("#awardList tbody").html("");
	$("#awardList").hide();
}

function getAuth(type) {
	gettype = type;
	if (type == "addScope" || type == "sharedposts") {
		FB.login(function (response) {
			callback(response);
		}, { scope: 'read_stream,user_photos,user_posts,user_groups', return_scopes: true });
	} else {
		FB.getLoginStatus(function (response) {
			callback(response);
		});
	}
}

function callback(response) {
	if (response.status === 'connected') {
		var accessToken = response.authResponse.accessToken;
		if (gettype == "addScope") {
			if (response.authResponse.grantedScopes.indexOf('read_stream') >= 0) {
				bootbox.alert("付費授權完成，請再次執行抓留言/讚\nAuthorization Finished! Please getComments or getLikes again.");
			} else {
				bootbox.alert("付費授權失敗，請聯絡管理員進行確認\nAuthorization Failed! Please contact the administrator.");
			}
		} else if (gettype == "sharedposts") {
			if (response.authResponse.grantedScopes.indexOf("read_stream") < 0) {
				bootbox.alert("抓分享需要付費，詳情請見粉絲專頁");
			} else {
				getFBID(gettype);
			}
		} else {
			getFBID(gettype);
		}
	} else {
		FB.login(function (response) {
			callback(response);
		}, { scope: 'read_stream,user_photos,user_posts,user_groups', return_scopes: true });
	}
}

function getFBID(type) {
	//init
	comments = [];
	data = [];
	id_array = [];
	length_now = 0;
	pageid = "";
	$(".main_table").DataTable().destroy();
	$(".main_table tbody").html("");
	$("#awardList tbody").html("");
	$("#awardList").hide();

	id_array = fbid_check();
	$(".console .message").text('');

	if (type == "url_comments") {
		var t = setInterval(function () {
			if (gettype == "comments") {
				clearInterval(t);
				waitingFBID("comments");
			}
		}, 100);
	} else {
		var t = setInterval(function () {
			if (pageid != "") {
				clearInterval(t);
				waitingFBID(type);
			}
		}, 100);
	}

	FB.api("https://graph.facebook.com/v2.3/me", function (res) {
		userid = res.id;
	});
}

function fbid_check() {
	var fbid_array = [];
	backend_data.type = gettype;
	if (gettype == "url_comments") {
		pureFBID = true;
		var posturl = $($("#enterURL .url")[0]).val();
		if (posturl.indexOf("?") > 0) {
			posturl = posturl.substring(0, posturl.indexOf("?"));
		}
		cleanURL = posturl;
		FB.api("https://graph.facebook.com/v2.3/" + cleanURL + "/", function (res) {
			fbid_array.push(res.og_object.id);
			urlid = fbid_array.toString();
			gettype = "comments";
			id_array = fbid_array;
		});
	} else {
		var regex = /\d{4,}/g;
		for (var i = 0; i < $("#enterURL .url").length; i++) {
			var posturl = $($("#enterURL .url")[i]).val();
			var checkType = posturl.indexOf("fbid=");
			var checkType2 = posturl.indexOf("events");
			var checkGroup = posturl.indexOf("/groups/");
			var check_personal = posturl.indexOf("+");
			var checkPure = posturl.indexOf('"');

			var page_s = posturl.indexOf("facebook.com") + 13;
			if (checkGroup > 0) {
				page_s = checkGroup + 8;
			}
			var page_e = posturl.indexOf("/", page_s);
			if (page_e < 0) {
				pageid = posturl.match(regex)[1];
				noPageName = true;
			} else {
				var pagename = posturl.substring(page_s, page_e);
				if (check_personal < 0) {
					FB.api("https://graph.facebook.com/v2.3/" + pagename + "/", function (res) {
						pageid = res.id;
					});
				}
			}

			var result = posturl.match(regex);

			if (check_personal > 0) {
				pageid = posturl.split("+")[0];
				fbid_array.push(posturl.split("+")[1]);
			} else if (checkPure >= 0) {
				fbid_array.push(posturl.replace(/\"/g, ''));
				pureFBID = true;
				noPageName = false;
			} else {
				if (checkType > 0) {
					var start = checkType + 5;
					var end = posturl.indexOf("&", start);
					var fbid = posturl.substring(start, end);
					pureFBID = true;
					fbid_array.push(fbid);
				} else if (checkType2 > 0 && result.length == 1) {
					fbid_array.push(result[0]);
					limit = 50;
					gettype = "feed";
				} else {
					if (result.length == 1 || result.length == 3) {
						fbid_array.push(result[0]);
					} else {
						fbid_array.push(result[result.length - 1]);
					}
				}
				if (checkGroup > 0) isGroup = true;
			}
		}
		urlid = fbid_array.toString();
		return fbid_array;
	}
}

function waitingFBID(type) {
	$(".share_post").addClass("hide");
	$(".like_comment").removeClass("hide");
	getData(id_array.pop());
	$(".update_donate").slideUp();
}

function getData(post_id) {
	postid = post_id;
	var api_command = gettype;
	$(".waiting").removeClass("hide");
	if ((pageid == undefined || pureFBID == true) && noPageName == false) {
		pageid = "";
	} else {
		pageid += "_";
	}
	url = pageid + post_id;
	var apiURL = "https://graph.facebook.com/v2.3/" + pageid + post_id + "/" + api_command + "?limit=" + limit;
	if (api_command == 'reactions') {
		apiURL = "https://graph.facebook.com/v2.7/" + pageid + post_id + "/reactions?limit=500";
	}
	FB.api(apiURL, function (res) {
		// console.table(res);
		if (res.error) {
			$(".console .message").text('發生錯誤，請確認您的網址無誤，並重新整理再次嘗試');
		}
		if (res.data.length == 0) {
			bootbox.alert("沒有資料或無法取得\n小助手僅免費支援粉絲團抽獎，若是要擷取社團留言請付費\nNo comments. If you want get group comments, you need to pay for it.");
			$(".waiting").addClass("hide");
		} else {
			for (var i = 0; i < res.data.length; i++) {
				data.push(res.data[i]);
			}
			$(".console .message").text('已截取  ' + data.length + ' 筆資料...');
			for (var i = length_now; i < data.length; i++) {
				data[i].serial = i + 1;
				if (api_command == "comments" || api_command == "feed" || api_command == "sharedposts") {
					data[i].realname = data[i].from.name;
					data[i].realtime = timeConverter(data[i].created_time);
					data[i].fromid = data[i].from.id;
					data[i].link = "http://www.facebook.com/" + data[i].from.id;
					data[i].text = data[i].message;
					if (!data[i].message) {
						data[i].text = "";
					}
					if (!cleanURL) {
						data[i].postlink = "http://www.facebook.com/" + data[i].id;
					} else {
						data[i].postlink = cleanURL + "?fb_comment_id=" + data[i].id;
					}
					if (!data[i].message_tags) {
						data[i].message_tags = [];
					}
					if (api_command == "sharedposts") {
						data[i].link = data[i].postlink;
						data[i].text = "";
						data[i].message_tags = [];
					}
				} else if (api_command == "reactions") {
					data[i].realname = data[i].name;
					data[i].fromid = data[i].id;
					data[i].link = "http://www.facebook.com/" + data[i].id;
					if (!data[i].message_tags) {
						data[i].message_tags = [];
					}
				}
			}
			length_now += data.length;
			if (api_command == "feed") {
				var url = res.paging.next;
				getDataNext_event(url, api_command);
			} else {
				if (res.paging.cursors.after) {
					cursor = res.paging.cursors.after;
					getDataNext(post_id, cursor, api_command, limit);
				} else {
					if (id_array.length == 0) {
						finished();
					} else {
						getData(id_array.pop(), api_command);
					}
				}
			}
		}
	});
}

function getDataNext(post_id, next, api_command, max) {
	var apiURL = "https://graph.facebook.com/v2.3/" + pageid + post_id + "/" + api_command + "?after=" + next + "&limit=" + max;
	if (api_command == 'reactions') {
		apiURL = "https://graph.facebook.com/v2.7/" + pageid + post_id + "/reactions?after=" + next + "&limit=500";
	}
	FB.api(apiURL, function (res) {
		console.log(res);
		if (res.error) {
			errorTime++;
			if (errorTime >= 200) {
				$(".console .message").text('錯誤次數過多，請按下重新整理重試');
			} else {
				$(".console .message").text('發生錯誤，5秒後自動重試，請稍待');
				setTimeout(function () {
					$(".console .message").text('繼續截取資料');
					getDataNext(post_id, cursor, api_command, 5);
				}, 5000);
			}
		}
		if (res.data.length == 0) {
			$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
			setTimeout(function () {
				finished();
			}, 1000);
		} else {
			for (var i = 0; i < res.data.length; i++) {
				data.push(res.data[i]);
			}
			$(".console .message").text('已截取  ' + data.length + ' 筆資料...');
			for (var i = length_now; i < data.length; i++) {
				data[i].serial = i + 1;
				if (api_command == "comments" || api_command == "feed" || api_command == "sharedposts") {
					data[i].realname = data[i].from.name;
					data[i].realtime = timeConverter(data[i].created_time);
					data[i].fromid = data[i].from.id;
					data[i].link = "http://www.facebook.com/" + data[i].from.id;
					data[i].text = data[i].message;
					if (!data[i].message) {
						data[i].text = "";
					}
					if (!cleanURL) {
						data[i].postlink = "http://www.facebook.com/" + data[i].id;
					} else {
						data[i].postlink = cleanURL + "?fb_comment_id=" + data[i].id;
					}
					if (!data[i].message_tags) {
						data[i].message_tags = [];
					}
					if (api_command == "sharedposts") {
						data[i].link = data[i].postlink;
						data[i].text = "";
						data[i].message_tags = [];
					}
				} else if (api_command == "reactions") {
					data[i].realname = data[i].name;
					data[i].fromid = data[i].id;
					data[i].link = "http://www.facebook.com/" + data[i].id;
					if (!data[i].message_tags) {
						data[i].message_tags = [];
					}
				}
			}

			length_now += res.data.length;
			if (res.paging.cursors.after) {
				cursor = res.paging.cursors.after;
				getDataNext(post_id, cursor, api_command, limit);
			} else {
				if (id_array.length == 0) {
					$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
					setTimeout(function () {
						finished();
					}, 1000);
				} else {
					getData(id_array.pop(), api_command);
				}
			}
		}
	});
}

function getDataNext_event(url, api_command) {
	$.get(url, function (res) {
		if (res.error) {
			$(".console .message").text('發生錯誤，5秒後自動重試，請稍待');
			setTimeout(function () {
				$(".console .message").text('繼續截取資料');
				getDataNext_event(url, api_command);
			}, 5000);
		}
		if (res.data.length == 0) {
			$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
			isEvent = true;
			setTimeout(function () {
				finished();
			}, 1000);
		} else {
			for (var i = 0; i < res.data.length; i++) {
				data.push(res.data[i]);
			}
			$(".console .message").text('已截取  ' + data.length + ' 筆資料...');
			for (var i = length_now; i < data.length; i++) {
				data[i].serial = i + 1;
				if (api_command == "comments" || api_command == "feed" || api_command == "sharedposts") {
					data[i].realname = data[i].from.name;
					data[i].realtime = timeConverter(data[i].created_time);
					data[i].fromid = data[i].from.id;
					data[i].link = "http://www.facebook.com/" + data[i].from.id;
					data[i].text = data[i].message;
					if (!data[i].message) {
						data[i].text = "";
					}
					if (!cleanURL) {
						data[i].postlink = "http://www.facebook.com/" + data[i].id;
					} else {
						data[i].postlink = cleanURL + "?fb_comment_id=" + data[i].id;
					}
					if (!data[i].message_tags) {
						data[i].message_tags = [];
					}
					if (api_command == "sharedposts") {
						data[i].link = data[i].postlink;
						data[i].text = "";
						data[i].message_tags = [];
					}
				} else if (api_command == "likes") {
					data[i].realname = data[i].name;
					data[i].fromid = data[i].id;
					data[i].link = "http://www.facebook.com/" + data[i].id;
					if (!data[i].message_tags) {
						data[i].message_tags = [];
					}
				}
			}

			length_now += res.data.length;
			var Nexturl = res.paging.next;
			getDataNext_event(Nexturl, api_command);
		}
	});
}

function getJSON() {
	comments = [];
	id_array = [];

	$(".main_table").DataTable().destroy();
	$(".main_table tbody").html("");
	$("#awardList tbody").html("");
	$("#awardList").hide();

	$(".console .message").text('');

	$(".share_post").addClass("hide");
	$(".like_comment").removeClass("hide");
	$(".update_donate").slideUp();

	$(".waiting").removeClass("hide");

	$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
	setTimeout(function () {
		finished();
	}, 1000);
}

function finished() {
	if (data.length >= 1000) {
		var d = new Date();
		var temp = { "url": url, "user": userid, "time": d, "length": data.length, "command": gettype };
		temp = JSON.stringify(temp);
		$.ajax({
			url: "https://x2qm5355o9.execute-api.us-west-2.amazonaws.com/dev/restful",
			method: "POST",
			contentType: "application/json",
			dataType: "json",
			data: temp
		});
	}

	if (hideName) {
		hideNameFun();
	}

	if (gettype == 'reactions') {
		$('.uipanel .react').removeClass('hide');
	} else {
		$('.uipanel .react').addClass('hide');
	}

	if (isEvent) {
		data.map(function (d) {
			if (d.likes) {
				d.like_count = d.likes.data.length;
			} else {
				d.like_count = 0;
			}
		});
	}

	insertTable(data);
	activeDataTable();
	filterEvent();
	$(".waiting").addClass("hide");
	$(".main_table").removeClass("hide");
	$(".update_area,.donate_area").slideUp();
	$(".result_area").slideDown();
	bootbox.alert("done");
}

function insertTable(data) {
	var filterData = totalFilter(data, $("#unique").prop("checked"), $("#tag").prop("checked"));
	for (var i = 0; i < filterData.length; i++) {
		var insertQuery;
		filterData[i].type = filterData[i].type || '';
		if ($("#picture").prop("checked") == true) {
			insertQuery = '<tr><td>' + (i + 1) + '</td><td><a href="' + filterData[i].link + '" target="_blank"><img src="http://graph.facebook.com/' + filterData[i].fromid + '/picture?type=small"><br>' + filterData[i].realname + '</a><td class="center"><span class="react ' + filterData[i].type + '"></span>' + filterData[i].type + '</td></td><td class="force-break"><a href="' + filterData[i].postlink + '" target="_blank">' + filterData[i].text + '</a></td><td>' + filterData[i].like_count + '</td><td>' + filterData[i].realtime + '</td></tr>';
		} else {
			insertQuery = '<tr><td>' + (i + 1) + '</td><td><a href="' + filterData[i].link + '" target="_blank">' + filterData[i].realname + '</a></td><td class="center"><span class="react ' + filterData[i].type + '"></span>' + filterData[i].type + '</td><td class="force-break"><a href="' + filterData[i].postlink + '" target="_blank">' + filterData[i].text + '</a></td><td>' + filterData[i].like_count + '</td><td>' + filterData[i].realtime + '</td></tr>';
		}
		$(".like_comment").append(insertQuery);
	}
}

function activeDataTable() {
	var table = $(".main_table").DataTable({
		"pageLength": 1000,
		"searching": true,
		"lengthChange": false
	});

	$("#searchName").on('blur change keyup', function () {
		table.columns(1).search(this.value).draw();
	});
	$("#searchComment").on('blur change keyup', function () {
		table.columns(3).search(this.value).draw();
	});
}

function filterEvent() {
	$("#unique, #tag").on('change', function () {
		redoTable();
	});
}

function redoTable() {
	$(".main_table").DataTable().destroy();
	$(".main_table tbody").html("");
	insertTable(data);
	activeDataTable();
}

function choose() {
	$("#awardList tbody").html("");
	award = new Array();
	var list = [];
	var num = 0;
	var detail = false;
	if ($("#moreprize").hasClass("active")) {
		detail = true;
		$(".prizeDetail .prize").each(function () {
			var n = parseInt($(this).find("input[type='number']").val());
			var p = $(this).find("input[type='text']").val();
			if (n > 0) {
				num += n;
				list.push({ "name": p, "num": n });
			}
		});
	} else {
		num = $("#howmany").val();
	}

	var unique = $("#unique").prop("checked");
	var istag = $("#tag").prop("checked");

	var afterFilterData = totalFilter(data, unique, istag);

	var temp = genRandomArray(afterFilterData.length).splice(0, num);
	for (var i = 0; i < num; i++) {
		award.push(afterFilterData[temp[i]]);
	}

	for (var j = 0; j < num; j++) {
		award[j].type = award[j].type || "";
		if ($("#picture").prop("checked") == true) {
			$("<tr align='center' class='success'><td></td><td><a href='" + award[j].link + "' target='_blank'><img src='http://graph.facebook.com/" + award[j].fromid + "/picture?type=small'><br>" + award[j].realname + "</a></td><td class='center'><span class='react " + award[j].type + "'></span>" + award[j].type + "</td><td class='force-break'><a href='" + award[j].postlink + "' target='_blank'>" + award[j].text + "</a></td><td>" + award[j].like_count + "</td><td>" + award[j].realtime + "</td></tr>").appendTo("#awardList tbody");
		} else {
			$("<tr align='center' class='success'><td></td><td><a href='" + award[j].link + "' target='_blank'>" + award[j].realname + "</a></td><td class='center'><span class='react " + award[j].type + "'></span>" + award[j].type + "</td><td class='force-break'><a href='" + award[j].postlink + "' target='_blank'>" + award[j].text + "</a></td><td>" + award[j].like_count + "</td><td>" + award[j].realtime + "</td></tr>").appendTo("#awardList tbody");
		}
	}
	if (detail) {
		var now = 0;
		for (var k = 0; k < list.length; k++) {
			var tar = $("#awardList tbody tr").eq(now);
			$('<tr><td class="prizeName" colspan="5">獎品：' + list[k].name + '<span>共 ' + list[k].num + ' 名</span></td></tr>').insertBefore(tar);
			now += list[k].num + 1;
		}
		$("#moreprize").removeClass("active");
		$(".gettotal").removeClass("fadeout");
		$('.prizeDetail').removeClass("fadein");
	}

	$("#awardList").fadeIn(1000);
}

function totalFilter(ary, isDuplicate, isTag) {
	var word = $("#searchComment").val();
	var filteredData = ary;
	if (isDuplicate) {
		filteredData = filter_unique(filteredData);
	}
	filteredData = filter_word(filteredData, word);
	if (isTag) {
		filteredData = filter_tag(filteredData);
	}
	filteredData = filter_time(filteredData, endTime);

	if (gettype == "reactions") {
		filteredData = filter_react(filteredData, filterReaction);
	}
	return filteredData;
}
function filter_unique(filteredData) {
	var output = [];
	var keys = [];
	filteredData.forEach(function (item) {
		var key = item["fromid"];
		if (keys.indexOf(key) === -1) {
			keys.push(key);
			output.push(item);
		}
	});
	return output;
}
function filter_word(ary, tar) {
	if (gettype == "reactions") {
		return ary;
	} else {
		var newAry = $.grep(ary, function (n, i) {
			if (n.text.indexOf(tar) > -1) {
				return true;
			}
		});
		return newAry;
	}
}
function filter_time(ary, t) {
	if (gettype == "reactions") {
		return ary;
	} else {
		var time_ary = t.split("-");
		var time = moment(new Date(time_ary[0], parseInt(time_ary[1]) - 1, time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;
		var newAry = $.grep(ary, function (n, i) {
			var created_time = moment(n.created_time)._d;
			if (created_time < time || n.realtime == "") {
				return true;
			}
		});
		return newAry;
	}
}
function filter_react(ary, tar) {
	if (gettype == "reactions") {
		if (tar == 'all') {
			return ary;
		} else {
			var newAry = $.grep(ary, function (n, i) {
				if (n.type == tar) {
					return true;
				}
			});
			return newAry;
		}
	}
}
function filter_tag(ary) {
	var newAry = $.grep(ary, function (n, i) {
		if (n.message_tags.length > 0) {
			return true;
		}
	});
	return newAry;
}

function timeConverter(UNIX_timestamp) {
	var a = moment(UNIX_timestamp)._d;
	var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
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

function genRandomArray(n) {
	var ary = new Array();
	var i, r, t;
	for (i = 0; i < n; ++i) {
		ary[i] = i;
	}
	for (i = 0; i < n; ++i) {
		r = Math.floor(Math.random() * n);
		t = ary[r];
		ary[r] = ary[i];
		ary[i] = t;
	}
	return ary;
}

function forExcel(data) {
	var newObj = [];
	if (extension) {
		$.each(data, function (i) {
			var tmp = {
				"序號": i + 1,
				"臉書連結": this.link,
				"姓名": this.realname,
				"分享連結": this.postlink,
				"留言內容": this.text,
				"該分享讚數": this.like_count
			};
			newObj.push(tmp);
		});
	} else {
		$.each(data, function (i) {
			var tmp = {
				"序號": this.serial,
				"臉書連結": this.link,
				"姓名": this.realname,
				"表情": this.type,
				"留言內容": this.message,
				"留言時間": this.realtime
			};
			newObj.push(tmp);
		});
	}
	return newObj;
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
	//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
	var arrData = (typeof JSONData === "undefined" ? "undefined" : _typeof(JSONData)) != 'object' ? JSON.parse(JSONData) : JSONData;

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
	fileName += ReportTitle.replace(/ /g, "_");

	//Initialize file format you want csv or xls
	var uri = "data:text/csv;charset=utf-8,﻿" + encodeURI(CSV);

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

function nowDate() {
	var a = new Date();
	var year = a.getFullYear();
	var month = a.getMonth() + 1;
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	return year + "-" + month + "-" + date + "-" + hour + "-" + min + "-" + sec;
}

function hideNameFun() {
	console.log("A");
	for (var i = 0; i < data.length; i++) {
		data[i].realname = "-";
	}
}

function checkAuth() {
	FB.login(function (response) {
		callbackAuth(response);
	}, { scope: 'read_stream,user_photos,user_posts,user_groups', return_scopes: true });
}

function callbackAuth(response) {
	if (response.status === 'connected') {
		var accessToken = response.authResponse.accessToken;
		if (response.authResponse.grantedScopes.indexOf("read_stream") < 0) {
			bootbox.alert("抓分享需要付費，詳情請見粉絲專頁");
		} else {
			$(".loading.checkAuth").addClass("hide");
			data = JSON.parse($(".chrome").val());
			getJSON();
		}
	} else {
		FB.login(function (response) {
			callback(response);
		}, { scope: 'read_stream,user_photos,user_posts,user_groups', return_scopes: true });
	}
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiY29tbWVudHMiLCJkYXRhIiwiaWRfYXJyYXkiLCJnZXR0eXBlIiwiaXNHcm91cCIsImxlbmd0aF9ub3ciLCJ1c2VyaWQiLCJ1cmxpZCIsImNsZWFuVVJMIiwicGFnZWlkIiwicG9zdGlkIiwiY3Vyc29yIiwicHVyZUZCSUQiLCJlcnJvclRpbWUiLCJiYWNrZW5kX2RhdGEiLCJub1BhZ2VOYW1lIiwiZW5kVGltZSIsIm5vd0RhdGUiLCJmaWx0ZXJSZWFjdGlvbiIsImNpX2NvdW50ZXIiLCJsaW1pdCIsImhpZGVOYW1lIiwiaXNFdmVudCIsImV4dGVuc2lvbiIsInVybCIsImF3YXJkIiwiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsInJlbmRlciIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJzdHIiLCJ0YXJnZXQiLCJyZXN1bHQiLCJKU09OIiwicGFyc2UiLCJnZXRKU09OIiwicmVhZEFzVGV4dCIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJjaGFuZ2UiLCJmaWxlcyIsImNsaWNrIiwiZSIsImN0cmxLZXkiLCJnZXRBdXRoIiwiY2hlY2tBdXRoIiwiYWRkQ2xhc3MiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwidmFsIiwicmVkb1RhYmxlIiwiY2hvb3NlIiwiZmlsdGVyRGF0YSIsInRvdGFsRmlsdGVyIiwicHJvcCIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImZvckV4Y2VsIiwiaGFzQ2xhc3MiLCJhcHBlbmQiLCJleGNlbFN0cmluZyIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJmb3JtYXQiLCJzZXRTdGFydERhdGUiLCJpbml0IiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImh0bWwiLCJoaWRlIiwidHlwZSIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwiZ2V0TG9naW5TdGF0dXMiLCJzdGF0dXMiLCJhY2Nlc3NUb2tlbiIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJib290Ym94IiwiYWxlcnQiLCJnZXRGQklEIiwiZmJpZF9jaGVjayIsInQiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJ3YWl0aW5nRkJJRCIsImFwaSIsInJlcyIsImlkIiwiZmJpZF9hcnJheSIsInBvc3R1cmwiLCJzdWJzdHJpbmciLCJwdXNoIiwib2dfb2JqZWN0IiwidG9TdHJpbmciLCJyZWdleCIsImkiLCJjaGVja1R5cGUiLCJjaGVja1R5cGUyIiwiY2hlY2tHcm91cCIsImNoZWNrX3BlcnNvbmFsIiwiY2hlY2tQdXJlIiwicGFnZV9zIiwicGFnZV9lIiwibWF0Y2giLCJwYWdlbmFtZSIsInNwbGl0IiwicmVwbGFjZSIsImZiaWQiLCJnZXREYXRhIiwicG9wIiwic2xpZGVVcCIsInBvc3RfaWQiLCJhcGlfY29tbWFuZCIsInVuZGVmaW5lZCIsImFwaVVSTCIsImVycm9yIiwic2VyaWFsIiwicmVhbG5hbWUiLCJmcm9tIiwibmFtZSIsInJlYWx0aW1lIiwidGltZUNvbnZlcnRlciIsImNyZWF0ZWRfdGltZSIsImZyb21pZCIsImxpbmsiLCJtZXNzYWdlIiwicG9zdGxpbmsiLCJtZXNzYWdlX3RhZ3MiLCJwYWdpbmciLCJuZXh0IiwiZ2V0RGF0YU5leHRfZXZlbnQiLCJjdXJzb3JzIiwiYWZ0ZXIiLCJnZXREYXRhTmV4dCIsImZpbmlzaGVkIiwibWF4Iiwic2V0VGltZW91dCIsImdldCIsIk5leHR1cmwiLCJkIiwiRGF0ZSIsInRlbXAiLCJhamF4IiwibWV0aG9kIiwiY29udGVudFR5cGUiLCJkYXRhVHlwZSIsImhpZGVOYW1lRnVuIiwibWFwIiwibGlrZXMiLCJsaWtlX2NvdW50IiwiaW5zZXJ0VGFibGUiLCJhY3RpdmVEYXRhVGFibGUiLCJmaWx0ZXJFdmVudCIsInNsaWRlRG93biIsImluc2VydFF1ZXJ5IiwidGFibGUiLCJvbiIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJBcnJheSIsImxpc3QiLCJudW0iLCJkZXRhaWwiLCJlYWNoIiwibiIsInBhcnNlSW50IiwiZmluZCIsInAiLCJ1bmlxdWUiLCJpc3RhZyIsImFmdGVyRmlsdGVyRGF0YSIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwiaiIsImFwcGVuZFRvIiwibm93IiwiayIsInRhciIsImVxIiwiaW5zZXJ0QmVmb3JlIiwiYXJ5IiwiaXNEdXBsaWNhdGUiLCJpc1RhZyIsIndvcmQiLCJmaWx0ZXJlZERhdGEiLCJmaWx0ZXJfdW5pcXVlIiwiZmlsdGVyX3dvcmQiLCJmaWx0ZXJfdGFnIiwiZmlsdGVyX3RpbWUiLCJmaWx0ZXJfcmVhY3QiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJuZXdBcnkiLCJncmVwIiwidGltZV9hcnkiLCJ0aW1lIiwibW9tZW50IiwiX2QiLCJVTklYX3RpbWVzdGFtcCIsImEiLCJtb250aHMiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJuZXdPYmoiLCJ0bXAiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsImluZGV4Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiY2FsbGJhY2tBdXRo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QUFJQSxTQUFTSyxNQUFULEtBQW9CLFdBQXhCLEVBQXFDO0FBQ3BDLE1BQUlDLGNBQWNOLFNBQVNPLFlBQVQsQ0FBc0JELFdBQXhDO0FBQ0EsTUFBSU4sU0FBU08sWUFBVCxDQUFzQkMsYUFBdEIsQ0FBb0NsRCxPQUFwQyxDQUE0QyxhQUE1QyxJQUE2RCxDQUFqRSxFQUFtRTtBQUNsRW1ELFdBQVFDLEtBQVIsQ0FBYyxrQkFBZDtBQUNBLEdBRkQsTUFFSztBQUNKeEUsS0FBRSxvQkFBRixFQUF3QjZCLFFBQXhCLENBQWlDLE1BQWpDO0FBQ0E5RCxVQUFPNEMsS0FBS0MsS0FBTCxDQUFXWixFQUFFLFNBQUYsRUFBYWlDLEdBQWIsRUFBWCxDQUFQO0FBQ0FwQjtBQUNBO0FBQ0QsRUFURCxNQVNLO0FBQ0orQyxLQUFHQyxLQUFILENBQVMsVUFBU0MsUUFBVCxFQUFtQjtBQUMzQkMsWUFBU0QsUUFBVDtBQUNBLEdBRkQsRUFFRyxFQUFDRSxPQUFPLGdEQUFSLEVBQXlEQyxlQUFlLElBQXhFLEVBRkg7QUFHQTtBQUNEIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgY29tbWVudHMgPSBbXTtcclxudmFyIGRhdGEgPSBbXTtcclxudmFyIGlkX2FycmF5ID0gW107XHJcbnZhciBnZXR0eXBlO1xyXG52YXIgaXNHcm91cCA9IGZhbHNlO1xyXG52YXIgbGVuZ3RoX25vdyA9IDA7XHJcbnZhciB1c2VyaWQsdXJsaWQ7XHJcbnZhciBjbGVhblVSTCA9IGZhbHNlO1xyXG52YXIgcGFnZWlkID0gXCJcIjtcclxudmFyIHBvc3RpZCA9IFwiXCI7XHJcbnZhciBjdXJzb3IgPSBcIlwiO1xyXG52YXIgcHVyZUZCSUQgPSBmYWxzZTtcclxudmFyIGVycm9yVGltZSA9IDA7XHJcbnZhciBiYWNrZW5kX2RhdGEgPSB7XCJkYXRhXCI6XCJcIn07XHJcbnZhciBub1BhZ2VOYW1lID0gZmFsc2U7XHJcbnZhciBlbmRUaW1lID0gbm93RGF0ZSgpO1xyXG52YXIgZmlsdGVyUmVhY3Rpb24gPSAnYWxsJztcclxudmFyIGNpX2NvdW50ZXIgPSAwO1xyXG52YXIgbGltaXQgPSA1MDA7XHJcbnZhciBoaWRlTmFtZSA9IGZhbHNlO1xyXG52YXIgaXNFdmVudCA9IGZhbHNlO1xyXG52YXIgZXh0ZW5zaW9uID0gZmFsc2U7XHJcbnZhciB1cmwgPSBcIlwiO1xyXG52YXIgdXNlcmlkID0gXCJcIjtcclxudmFyIGF3YXJkID0gW107XHJcblxyXG52YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdGxpbWl0ID0gMTAwO1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKXtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vpu57mk4rpjK/oqqTplovpoK3nmoTlsI/kuInop5LlvaLnrq3poK1cXG7kuKblsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6FcIixcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHRcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXIoZmlsZSkge1xyXG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICBcdHZhciBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gIFx0Ly8gdmFyIHMgPSBzdHIuaW5kZXhPZihcIjxib2R5PlwiKTtcclxuICBcdC8vIHZhciBlID0gc3RyLmxhc3RJbmRleE9mKFwiPC9ib2R5PlwiKTtcclxuICBcdC8vIHZhciBqc29uID0gc3RyLnN1YnN0cmluZygocys2KSxlKTtcclxuICBcdGRhdGEgPSBKU09OLnBhcnNlKHN0cik7XHJcbiAgXHRnZXRKU09OKCk7XHJcbiAgfVxyXG5cclxuICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHR2YXIgaGFzaCA9IGxvY2F0aW9uLnNlYXJjaDtcclxuXHRpZiAoaGFzaC5pbmRleE9mKFwiZXh0ZW5zaW9uXCIpID49IDApe1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRleHRlbnNpb24gPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG5cdFx0cmVuZGVyKHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkpe1xyXG5cdFx0XHRoaWRlTmFtZSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRnZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGNoZWNrQXV0aCgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSl7XHJcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdH1cclxuXHRcdGlmKGUuY3RybEtleSl7XHJcblx0XHRcdGdldEF1dGgoJ3NoYXJlZHBvc3RzJyk7XHJcblx0XHRcdGxpbWl0ID0gMTAwO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoIWUuY3RybEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIi51aXBhbmVsIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGZpbHRlclJlYWN0aW9uID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHJlZG9UYWJsZSgpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0Z2V0QXV0aCgndXJsX2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fcGF5XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRnZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0Y2hvb3NlKCk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IHRvdGFsRmlsdGVyKGRhdGEsJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIiksJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIikpO1xyXG5cdFx0aWYgKGUuY3RybEtleSl7XHJcblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhKTtcclxuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XHJcblx0XHRcdHdpbmRvdy5mb2N1cygpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGlmIChkYXRhLmxlbmd0aCA+IDcwMDApe1xyXG5cdFx0XHRcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHR9ZWxzZXtcdFxyXG5cdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihmb3JFeGNlbChmaWx0ZXJEYXRhKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PicpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IHRvdGFsRmlsdGVyKGRhdGEsJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIiksJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIikpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZm9yRXhjZWwoZmlsdGVyRGF0YSk7XHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XHJcblx0XHRcInNpbmdsZURhdGVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS1NTS1ERCAgIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSxmdW5jdGlvbihzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0ZW5kVGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0cmVkb1RhYmxlKCk7XHJcblx0fSk7XHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShlbmRUaW1lKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBpbml0KCl7XHJcblx0ZGF0YSA9IFtdO1xyXG5cdGlkX2FycmF5ID0gW107XHJcblx0bGVuZ3RoX25vdyA9IDA7XHJcblx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHQkKFwiLm1haW5fdGFibGUgdGJvZHlcIikuaHRtbChcIlwiKTtcclxuXHQkKFwiI2F3YXJkTGlzdCB0Ym9keVwiKS5odG1sKFwiXCIpO1xyXG5cdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXV0aCh0eXBlKXtcclxuXHRnZXR0eXBlID0gdHlwZTtcclxuXHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIgfHwgdHlwZSA9PSBcInNoYXJlZHBvc3RzXCIpe1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0Y2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge3Njb3BlOiAncmVhZF9zdHJlYW0sdXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX2dyb3VwcycscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH1lbHNle1xyXG5cdFx0RkIuZ2V0TG9naW5TdGF0dXMoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0Y2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxsYmFjayhyZXNwb25zZSl7XHJcblx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdHZhciBhY2Nlc3NUb2tlbiA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5hY2Nlc3NUb2tlbjtcclxuXHRcdGlmIChnZXR0eXBlID09IFwiYWRkU2NvcGVcIil7XHJcblx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmRleE9mKCdyZWFkX3N0cmVhbScpID49IDApe1xyXG5cdFx0XHRcdGJvb3Rib3guYWxlcnQoXCLku5josrvmjojmrIrlrozmiJDvvIzoq4vlho3mrKHln7fooYzmipPnlZnoqIAv6K6aXFxuQXV0aG9yaXphdGlvbiBGaW5pc2hlZCEgUGxlYXNlIGdldENvbW1lbnRzIG9yIGdldExpa2VzIGFnYWluLlwiKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Ym9vdGJveC5hbGVydChcIuS7mOiyu+aOiOasiuWkseaVl++8jOiri+iBr+e1oeeuoeeQhuWToemAsuihjOeiuuiqjVxcbkF1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW5pc3RyYXRvci5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChnZXR0eXBlID09IFwic2hhcmVkcG9zdHNcIil7XHJcblx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmRleE9mKFwicmVhZF9zdHJlYW1cIikgPCAwKXtcclxuXHRcdFx0XHRib290Ym94LmFsZXJ0KFwi5oqT5YiG5Lqr6ZyA6KaB5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBXCIpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnZXRGQklEKGdldHR5cGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Z2V0RkJJRChnZXR0eXBlKTtcdFx0XHRcclxuXHRcdH1cclxuXHR9ZWxzZXtcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdH0sIHtzY29wZTogJ3JlYWRfc3RyZWFtLHVzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9ncm91cHMnLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRGQklEKHR5cGUpe1xyXG5cdC8vaW5pdFxyXG5cdGNvbW1lbnRzID0gW107XHJcblx0ZGF0YSA9IFtdO1xyXG5cdGlkX2FycmF5ID0gW107XHJcblx0bGVuZ3RoX25vdyA9IDA7XHJcblx0cGFnZWlkID0gXCJcIjtcclxuXHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdCQoXCIubWFpbl90YWJsZSB0Ym9keVwiKS5odG1sKFwiXCIpO1xyXG5cdCQoXCIjYXdhcmRMaXN0IHRib2R5XCIpLmh0bWwoXCJcIik7XHJcblx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cclxuXHRpZF9hcnJheSA9IGZiaWRfY2hlY2soKTtcclxuXHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XHJcblxyXG5cdGlmICh0eXBlID09IFwidXJsX2NvbW1lbnRzXCIpe1xyXG5cdFx0dmFyIHQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAoZ2V0dHlwZSAgPT0gXCJjb21tZW50c1wiKXtcclxuXHRcdFx0XHRjbGVhckludGVydmFsKHQpO1xyXG5cdFx0XHRcdHdhaXRpbmdGQklEKFwiY29tbWVudHNcIik7XHJcblx0XHRcdH1cclxuXHRcdH0sMTAwKTtcclxuXHR9ZWxzZXtcclxuXHRcdHZhciB0ID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKHBhZ2VpZCAhPSBcIlwiKXtcclxuXHRcdFx0XHRjbGVhckludGVydmFsKHQpO1xyXG5cdFx0XHRcdHdhaXRpbmdGQklEKHR5cGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9LDEwMCk7XHJcblx0fVxyXG5cclxuXHRGQi5hcGkoXCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS92Mi4zL21lXCIsZnVuY3Rpb24ocmVzKXtcclxuXHRcdHVzZXJpZCA9IHJlcy5pZDtcclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmJpZF9jaGVjaygpe1xyXG5cdHZhciBmYmlkX2FycmF5ID0gW107XHJcblx0YmFja2VuZF9kYXRhLnR5cGUgPSBnZXR0eXBlO1xyXG5cdGlmIChnZXR0eXBlID09IFwidXJsX2NvbW1lbnRzXCIpe1xyXG5cdFx0cHVyZUZCSUQgPSB0cnVlO1xyXG5cdFx0dmFyIHBvc3R1cmwgPSAkKCQoXCIjZW50ZXJVUkwgLnVybFwiKVswXSkudmFsKCk7XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiP1wiKSA+IDApe1xyXG5cdFx0XHRwb3N0dXJsID0gcG9zdHVybC5zdWJzdHJpbmcoMCxwb3N0dXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdH1cclxuXHRcdGNsZWFuVVJMID0gcG9zdHVybDtcclxuXHRcdEZCLmFwaShcImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tL3YyLjMvXCIrY2xlYW5VUkwrXCIvXCIsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0ZmJpZF9hcnJheS5wdXNoKHJlcy5vZ19vYmplY3QuaWQpO1xyXG5cdFx0XHR1cmxpZCA9IGZiaWRfYXJyYXkudG9TdHJpbmcoKTtcclxuXHRcdFx0Z2V0dHlwZSA9IFwiY29tbWVudHNcIjtcclxuXHRcdFx0aWRfYXJyYXkgPSBmYmlkX2FycmF5O1xyXG5cdFx0fSk7XHJcblx0fWVsc2V7XHJcblx0XHR2YXIgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0Zm9yKHZhciBpPTA7IGk8JChcIiNlbnRlclVSTCAudXJsXCIpLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0dmFyIHBvc3R1cmwgPSAkKCQoXCIjZW50ZXJVUkwgLnVybFwiKVtpXSkudmFsKCk7XHJcblx0XHRcdHZhciBjaGVja1R5cGUgPSBwb3N0dXJsLmluZGV4T2YoXCJmYmlkPVwiKTtcclxuXHRcdFx0dmFyIGNoZWNrVHlwZTIgPSBwb3N0dXJsLmluZGV4T2YoXCJldmVudHNcIik7XHJcblx0XHRcdHZhciBjaGVja0dyb3VwID0gcG9zdHVybC5pbmRleE9mKFwiL2dyb3Vwcy9cIik7XHJcblx0XHRcdHZhciBjaGVja19wZXJzb25hbCA9IHBvc3R1cmwuaW5kZXhPZihcIitcIik7XHJcblx0XHRcdHZhciBjaGVja1B1cmUgPSBwb3N0dXJsLmluZGV4T2YoJ1wiJyk7XHJcblxyXG5cdFx0XHR2YXIgcGFnZV9zID0gcG9zdHVybC5pbmRleE9mKFwiZmFjZWJvb2suY29tXCIpKzEzO1xyXG5cdFx0XHRpZiAoY2hlY2tHcm91cCA+IDApe1xyXG5cdFx0XHRcdHBhZ2VfcyA9IGNoZWNrR3JvdXArODtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgcGFnZV9lID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHBhZ2Vfcyk7XHJcblx0XHRcdGlmIChwYWdlX2UgPCAwKXtcclxuXHRcdFx0XHRwYWdlaWQgPSBwb3N0dXJsLm1hdGNoKHJlZ2V4KVsxXTtcclxuXHRcdFx0XHRub1BhZ2VOYW1lID0gdHJ1ZTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcocGFnZV9zLHBhZ2VfZSk7XHJcblx0XHRcdFx0aWYgKGNoZWNrX3BlcnNvbmFsIDwgMCl7XHJcblx0XHRcdFx0XHRGQi5hcGkoXCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS92Mi4zL1wiK3BhZ2VuYW1lK1wiL1wiLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRcdHBhZ2VpZCA9IHJlcy5pZDtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVx0XHJcblxyXG5cdFx0XHR2YXIgcmVzdWx0ID0gcG9zdHVybC5tYXRjaChyZWdleCk7XHJcblxyXG5cdFx0XHRpZiAoY2hlY2tfcGVyc29uYWwgPiAwKXtcclxuXHRcdFx0XHRwYWdlaWQgPSBwb3N0dXJsLnNwbGl0KFwiK1wiKVswXTtcclxuXHRcdFx0XHRmYmlkX2FycmF5LnB1c2gocG9zdHVybC5zcGxpdChcIitcIilbMV0pO1xyXG5cdFx0XHR9ZWxzZSBpZihjaGVja1B1cmUgPj0gMCl7XHJcblx0XHRcdFx0ZmJpZF9hcnJheS5wdXNoKHBvc3R1cmwucmVwbGFjZSgvXFxcIi9nLCcnKSk7XHJcblx0XHRcdFx0cHVyZUZCSUQgPSB0cnVlO1xyXG5cdFx0XHRcdG5vUGFnZU5hbWUgPSBmYWxzZTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKGNoZWNrVHlwZSA+IDApe1xyXG5cdFx0XHRcdFx0dmFyIHN0YXJ0ID0gY2hlY2tUeXBlKzU7XHJcblx0XHRcdFx0XHR2YXIgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiJlwiLHN0YXJ0KTtcclxuXHRcdFx0XHRcdHZhciBmYmlkID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcclxuXHRcdFx0XHRcdHB1cmVGQklEID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGZiaWRfYXJyYXkucHVzaChmYmlkKTtcclxuXHRcdFx0XHR9ZWxzZSBpZiAoY2hlY2tUeXBlMiA+IDAgJiYgcmVzdWx0Lmxlbmd0aCA9PSAxKXtcclxuXHRcdFx0XHRcdGZiaWRfYXJyYXkucHVzaChyZXN1bHRbMF0pO1xyXG5cdFx0XHRcdFx0bGltaXQgPSA1MDtcclxuXHRcdFx0XHRcdGdldHR5cGUgPSBcImZlZWRcIjtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKXtcclxuXHRcdFx0XHRcdFx0ZmJpZF9hcnJheS5wdXNoKHJlc3VsdFswXSk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0ZmJpZF9hcnJheS5wdXNoKHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGNoZWNrR3JvdXAgPiAwKSBpc0dyb3VwID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dXJsaWQgPSBmYmlkX2FycmF5LnRvU3RyaW5nKCk7XHJcblx0XHRyZXR1cm4gZmJpZF9hcnJheTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdhaXRpbmdGQklEKHR5cGUpe1xyXG5cdCQoXCIuc2hhcmVfcG9zdFwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0JChcIi5saWtlX2NvbW1lbnRcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdGdldERhdGEoaWRfYXJyYXkucG9wKCkpO1xyXG5cdCQoXCIudXBkYXRlX2RvbmF0ZVwiKS5zbGlkZVVwKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGEocG9zdF9pZCl7XHJcblx0cG9zdGlkID0gcG9zdF9pZDtcclxuXHR2YXIgYXBpX2NvbW1hbmQgPSBnZXR0eXBlO1xyXG5cdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0aWYgKChwYWdlaWQgPT0gdW5kZWZpbmVkIHx8IHB1cmVGQklEID09IHRydWUpICYmIG5vUGFnZU5hbWUgPT0gZmFsc2Upe1xyXG5cdFx0cGFnZWlkID0gXCJcIjtcclxuXHR9ZWxzZXtcclxuXHRcdHBhZ2VpZCArPSBcIl9cIjtcclxuXHR9XHJcblx0dXJsID0gcGFnZWlkICsgcG9zdF9pZDtcclxuXHR2YXIgYXBpVVJMID0gXCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS92Mi4zL1wiK3BhZ2VpZCtwb3N0X2lkK1wiL1wiK2FwaV9jb21tYW5kK1wiP2xpbWl0PVwiK2xpbWl0O1xyXG5cdGlmIChhcGlfY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRhcGlVUkwgPSBcImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tL3YyLjcvXCIrcGFnZWlkK3Bvc3RfaWQrXCIvcmVhY3Rpb25zP2xpbWl0PTUwMFwiO1xyXG5cdH1cclxuXHRGQi5hcGkoYXBpVVJMLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHQvLyBjb25zb2xlLnRhYmxlKHJlcyk7XHJcblx0XHRpZihyZXMuZXJyb3Ipe1xyXG5cdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn55m855Sf6Yyv6Kqk77yM6KuL56K66KqN5oKo55qE57ay5Z2A54Sh6Kqk77yM5Lim6YeN5paw5pW055CG5YaN5qyh5ZiX6KmmJyk7XHJcblx0XHR9XHJcblx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID09IDApe1xyXG5cdFx0XHRib290Ym94LmFsZXJ0KFwi5rKS5pyJ6LOH5paZ5oiW54Sh5rOV5Y+W5b6XXFxu5bCP5Yqp5omL5YOF5YWN6LK75pSv5o+057KJ57Wy5ZyY5oq9542O77yM6Iul5piv6KaB5pO35Y+W56S+5ZyY55WZ6KiA6KuL5LuY6LK7XFxuTm8gY29tbWVudHMuIElmIHlvdSB3YW50IGdldCBncm91cCBjb21tZW50cywgeW91IG5lZWQgdG8gcGF5IGZvciBpdC5cIik7XHJcblx0XHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPHJlcy5kYXRhLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRkYXRhLnB1c2gocmVzLmRhdGFbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRmb3IgKHZhciBpPWxlbmd0aF9ub3c7IGk8ZGF0YS5sZW5ndGg7IGkrKyl7XHRcclxuXHRcdFx0XHRkYXRhW2ldLnNlcmlhbCA9IGkrMTtcdFxyXG5cdFx0XHRcdGlmIChhcGlfY29tbWFuZCA9PSBcImNvbW1lbnRzXCIgfHwgYXBpX2NvbW1hbmQgPT0gXCJmZWVkXCIgfHwgYXBpX2NvbW1hbmQgPT0gXCJzaGFyZWRwb3N0c1wiKXtcclxuXHRcdFx0XHRcdGRhdGFbaV0ucmVhbG5hbWUgPSBkYXRhW2ldLmZyb20ubmFtZTtcclxuXHRcdFx0XHRcdGRhdGFbaV0ucmVhbHRpbWUgPSB0aW1lQ29udmVydGVyKGRhdGFbaV0uY3JlYXRlZF90aW1lKTtcclxuXHRcdFx0XHRcdGRhdGFbaV0uZnJvbWlkID0gZGF0YVtpXS5mcm9tLmlkO1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5saW5rID0gXCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS9cIitkYXRhW2ldLmZyb20uaWQ7XHRcclxuXHRcdFx0XHRcdGRhdGFbaV0udGV4dCA9IGRhdGFbaV0ubWVzc2FnZTtcclxuXHRcdFx0XHRcdGlmICghZGF0YVtpXS5tZXNzYWdlKXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS50ZXh0ID0gXCJcIjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICghY2xlYW5VUkwpe1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLnBvc3RsaW5rID0gXCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS9cIitkYXRhW2ldLmlkO1x0XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5wb3N0bGluayA9IGNsZWFuVVJMK1wiP2ZiX2NvbW1lbnRfaWQ9XCIrZGF0YVtpXS5pZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICghZGF0YVtpXS5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLm1lc3NhZ2VfdGFncyA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKGFwaV9jb21tYW5kID09IFwic2hhcmVkcG9zdHNcIil7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ubGluayA9IGRhdGFbaV0ucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0udGV4dCA9IFwiXCI7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ubWVzc2FnZV90YWdzID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2UgaWYgKGFwaV9jb21tYW5kID09IFwicmVhY3Rpb25zXCIpe1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5yZWFsbmFtZSA9IGRhdGFbaV0ubmFtZTtcclxuXHRcdFx0XHRcdGRhdGFbaV0uZnJvbWlkID0gZGF0YVtpXS5pZDtcclxuXHRcdFx0XHRcdGRhdGFbaV0ubGluayA9IFwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vXCIrZGF0YVtpXS5pZDtcclxuXHRcdFx0XHRcdGlmICghZGF0YVtpXS5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLm1lc3NhZ2VfdGFncyA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRsZW5ndGhfbm93ICs9IGRhdGEubGVuZ3RoO1xyXG5cdFx0XHRpZiAoYXBpX2NvbW1hbmQgPT0gXCJmZWVkXCIpe1xyXG5cdFx0XHRcdHZhciB1cmwgPSByZXMucGFnaW5nLm5leHQ7XHJcblx0XHRcdFx0Z2V0RGF0YU5leHRfZXZlbnQodXJsLGFwaV9jb21tYW5kKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHJlcy5wYWdpbmcuY3Vyc29ycy5hZnRlcil7XHJcblx0XHRcdFx0XHRjdXJzb3IgPSByZXMucGFnaW5nLmN1cnNvcnMuYWZ0ZXI7XHJcblx0XHRcdFx0XHRnZXREYXRhTmV4dChwb3N0X2lkLGN1cnNvcixhcGlfY29tbWFuZCxsaW1pdCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRpZiAoaWRfYXJyYXkubGVuZ3RoID09IDApe1x0XHJcblx0XHRcdFx0XHRcdGZpbmlzaGVkKCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Z2V0RGF0YShpZF9hcnJheS5wb3AoKSxhcGlfY29tbWFuZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGFOZXh0KHBvc3RfaWQsbmV4dCxhcGlfY29tbWFuZCxtYXgpe1xyXG5cdHZhciBhcGlVUkwgPSBcImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tL3YyLjMvXCIrcGFnZWlkK3Bvc3RfaWQrXCIvXCIrYXBpX2NvbW1hbmQrXCI/YWZ0ZXI9XCIrbmV4dCtcIiZsaW1pdD1cIittYXg7XHJcblx0aWYgKGFwaV9jb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdGFwaVVSTCA9IFwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjIuNy9cIitwYWdlaWQrcG9zdF9pZCtcIi9yZWFjdGlvbnM/YWZ0ZXI9XCIrbmV4dCtcIiZsaW1pdD01MDBcIjtcclxuXHR9XHJcblx0RkIuYXBpKGFwaVVSTCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0Y29uc29sZS5sb2cocmVzKTtcclxuXHRcdGlmIChyZXMuZXJyb3Ipe1xyXG5cdFx0XHRlcnJvclRpbWUrKztcclxuXHRcdFx0aWYgKGVycm9yVGltZSA+PSAyMDApe1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfpjK/oqqTmrKHmlbjpgY7lpJrvvIzoq4vmjInkuIvph43mlrDmlbTnkIbph43oqaYnKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+eZvOeUn+mMr+iqpO+8jDXnp5Llvozoh6rli5Xph43oqabvvIzoq4vnqI3lvoUnKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn57m857qM5oiq5Y+W6LOH5paZJyk7XHJcblx0XHRcdFx0XHRnZXREYXRhTmV4dChwb3N0X2lkLGN1cnNvcixhcGlfY29tbWFuZCw1KTtcclxuXHRcdFx0XHR9LDUwMDApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID09IDApe1xyXG5cdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0ZmluaXNoZWQoKTtcclxuXHRcdFx0fSwxMDAwKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8cmVzLmRhdGEubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdGRhdGEucHVzaChyZXMuZGF0YVtpXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5sZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdGZvciAodmFyIGkgPSBsZW5ndGhfbm93OyBpPGRhdGEubGVuZ3RoOyBpKyspe1x0XHJcblx0XHRcdFx0ZGF0YVtpXS5zZXJpYWwgPSBpKzE7XHRcclxuXHRcdFx0XHRpZiAoYXBpX2NvbW1hbmQgPT0gXCJjb21tZW50c1wiIHx8IGFwaV9jb21tYW5kID09IFwiZmVlZFwiIHx8IGFwaV9jb21tYW5kID09IFwic2hhcmVkcG9zdHNcIil7XHJcblx0XHRcdFx0XHRkYXRhW2ldLnJlYWxuYW1lID0gZGF0YVtpXS5mcm9tLm5hbWU7XHJcblx0XHRcdFx0XHRkYXRhW2ldLnJlYWx0aW1lID0gdGltZUNvbnZlcnRlcihkYXRhW2ldLmNyZWF0ZWRfdGltZSk7XHJcblx0XHRcdFx0XHRkYXRhW2ldLmZyb21pZCA9IGRhdGFbaV0uZnJvbS5pZDtcclxuXHRcdFx0XHRcdGRhdGFbaV0ubGluayA9IFwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vXCIrZGF0YVtpXS5mcm9tLmlkO1x0XHJcblx0XHRcdFx0XHRkYXRhW2ldLnRleHQgPSBkYXRhW2ldLm1lc3NhZ2U7XHJcblx0XHRcdFx0XHRpZiAoIWRhdGFbaV0ubWVzc2FnZSl7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0udGV4dCA9IFwiXCI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIWNsZWFuVVJMKXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5wb3N0bGluayA9IFwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vXCIrZGF0YVtpXS5pZDtcdFxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ucG9zdGxpbmsgPSBjbGVhblVSTCtcIj9mYl9jb21tZW50X2lkPVwiK2RhdGFbaV0uaWQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIWRhdGFbaV0ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5tZXNzYWdlX3RhZ3MgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChhcGlfY29tbWFuZCA9PSBcInNoYXJlZHBvc3RzXCIpe1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLmxpbmsgPSBkYXRhW2ldLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLnRleHQgPSBcIlwiO1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLm1lc3NhZ2VfdGFncyA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNlIGlmIChhcGlfY29tbWFuZCA9PSBcInJlYWN0aW9uc1wiKXtcclxuXHRcdFx0XHRcdGRhdGFbaV0ucmVhbG5hbWUgPSBkYXRhW2ldLm5hbWU7XHJcblx0XHRcdFx0XHRkYXRhW2ldLmZyb21pZCA9IGRhdGFbaV0uaWQ7XHJcblx0XHRcdFx0XHRkYXRhW2ldLmxpbmsgPSBcImh0dHA6Ly93d3cuZmFjZWJvb2suY29tL1wiK2RhdGFbaV0uaWQ7XHJcblx0XHRcdFx0XHRpZiAoIWRhdGFbaV0ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5tZXNzYWdlX3RhZ3MgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxlbmd0aF9ub3cgKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRpZiAocmVzLnBhZ2luZy5jdXJzb3JzLmFmdGVyKXtcclxuXHRcdFx0XHRjdXJzb3IgPSByZXMucGFnaW5nLmN1cnNvcnMuYWZ0ZXI7XHJcblx0XHRcdFx0Z2V0RGF0YU5leHQocG9zdF9pZCxjdXJzb3IsYXBpX2NvbW1hbmQsbGltaXQpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZiAoaWRfYXJyYXkubGVuZ3RoID09IDApe1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFx0ZmluaXNoZWQoKTtcclxuXHRcdFx0XHRcdH0sMTAwMCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRnZXREYXRhKGlkX2FycmF5LnBvcCgpLGFwaV9jb21tYW5kKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGF0YU5leHRfZXZlbnQodXJsLGFwaV9jb21tYW5kKXtcclxuXHQkLmdldCh1cmwsZnVuY3Rpb24ocmVzKXtcclxuXHRcdGlmIChyZXMuZXJyb3Ipe1xyXG5cdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn55m855Sf6Yyv6Kqk77yMNeenkuW+jOiHquWLlemHjeippu+8jOiri+eojeW+hScpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+e5vOe6jOaIquWPluizh+aWmScpO1xyXG5cdFx0XHRcdGdldERhdGFOZXh0X2V2ZW50KHVybCxhcGlfY29tbWFuZCk7XHJcblx0XHRcdH0sNTAwMCk7XHJcblx0XHR9XHJcblx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID09IDApe1xyXG5cdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xyXG5cdFx0XHRpc0V2ZW50ID0gdHJ1ZTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGZpbmlzaGVkKCk7XHJcblx0XHRcdH0sMTAwMCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPHJlcy5kYXRhLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRkYXRhLnB1c2gocmVzLmRhdGFbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRmb3IgKHZhciBpID0gbGVuZ3RoX25vdzsgaTxkYXRhLmxlbmd0aDsgaSsrKXtcdFxyXG5cdFx0XHRcdGRhdGFbaV0uc2VyaWFsID0gaSsxO1x0XHJcblx0XHRcdFx0aWYgKGFwaV9jb21tYW5kID09IFwiY29tbWVudHNcIiB8fCBhcGlfY29tbWFuZCA9PSBcImZlZWRcIiB8fCBhcGlfY29tbWFuZCA9PSBcInNoYXJlZHBvc3RzXCIpe1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5yZWFsbmFtZSA9IGRhdGFbaV0uZnJvbS5uYW1lO1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5yZWFsdGltZSA9IHRpbWVDb252ZXJ0ZXIoZGF0YVtpXS5jcmVhdGVkX3RpbWUpO1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5mcm9taWQgPSBkYXRhW2ldLmZyb20uaWQ7XHJcblx0XHRcdFx0XHRkYXRhW2ldLmxpbmsgPSBcImh0dHA6Ly93d3cuZmFjZWJvb2suY29tL1wiK2RhdGFbaV0uZnJvbS5pZDtcdFxyXG5cdFx0XHRcdFx0ZGF0YVtpXS50ZXh0ID0gZGF0YVtpXS5tZXNzYWdlO1xyXG5cdFx0XHRcdFx0aWYgKCFkYXRhW2ldLm1lc3NhZ2Upe1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLnRleHQgPSBcIlwiO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCFjbGVhblVSTCl7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ucG9zdGxpbmsgPSBcImh0dHA6Ly93d3cuZmFjZWJvb2suY29tL1wiK2RhdGFbaV0uaWQ7XHRcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLnBvc3RsaW5rID0gY2xlYW5VUkwrXCI/ZmJfY29tbWVudF9pZD1cIitkYXRhW2ldLmlkO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCFkYXRhW2ldLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ubWVzc2FnZV90YWdzID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoYXBpX2NvbW1hbmQgPT0gXCJzaGFyZWRwb3N0c1wiKXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5saW5rID0gZGF0YVtpXS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS50ZXh0ID0gXCJcIjtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5tZXNzYWdlX3RhZ3MgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZSBpZiAoYXBpX2NvbW1hbmQgPT0gXCJsaWtlc1wiKXtcclxuXHRcdFx0XHRcdGRhdGFbaV0ucmVhbG5hbWUgPSBkYXRhW2ldLm5hbWU7XHJcblx0XHRcdFx0XHRkYXRhW2ldLmZyb21pZCA9IGRhdGFbaV0uaWQ7XHJcblx0XHRcdFx0XHRkYXRhW2ldLmxpbmsgPSBcImh0dHA6Ly93d3cuZmFjZWJvb2suY29tL1wiK2RhdGFbaV0uaWQ7XHJcblx0XHRcdFx0XHRpZiAoIWRhdGFbaV0ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5tZXNzYWdlX3RhZ3MgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxlbmd0aF9ub3cgKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHR2YXIgTmV4dHVybCA9IHJlcy5wYWdpbmcubmV4dDtcclxuXHRcdFx0Z2V0RGF0YU5leHRfZXZlbnQoTmV4dHVybCxhcGlfY29tbWFuZCk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEpTT04oKXtcclxuXHRjb21tZW50cyA9IFtdO1xyXG5cdGlkX2FycmF5ID0gW107XHJcblxyXG5cdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0JChcIi5tYWluX3RhYmxlIHRib2R5XCIpLmh0bWwoXCJcIik7XHJcblx0JChcIiNhd2FyZExpc3QgdGJvZHlcIikuaHRtbChcIlwiKTtcclxuXHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblxyXG5cdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHJcblx0JChcIi5zaGFyZV9wb3N0XCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHQkKFwiLmxpa2VfY29tbWVudFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0JChcIi51cGRhdGVfZG9uYXRlXCIpLnNsaWRlVXAoKTtcclxuXHJcblx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHJcblx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRmaW5pc2hlZCgpO1xyXG5cdH0sMTAwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmlzaGVkKCl7XHJcblx0aWYgKGRhdGEubGVuZ3RoID49IDEwMDApe1xyXG5cdFx0dmFyIGQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0dmFyIHRlbXAgPSB7XCJ1cmxcIjogdXJsLCBcInVzZXJcIjogdXNlcmlkLCBcInRpbWVcIjogZCwgXCJsZW5ndGhcIjogZGF0YS5sZW5ndGgsIFwiY29tbWFuZFwiOiBnZXR0eXBlfTtcclxuXHRcdHRlbXAgPSAgSlNPTi5zdHJpbmdpZnkodGVtcCk7XHJcblx0XHQkLmFqYXgoe1xyXG5cdFx0XHR1cmw6IFwiaHR0cHM6Ly94MnFtNTM1NW85LmV4ZWN1dGUtYXBpLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tL2Rldi9yZXN0ZnVsXCIsXHJcblx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuXHRcdFx0ZGF0YVR5cGU6IFwianNvblwiLFxyXG5cdFx0XHRkYXRhOiB0ZW1wXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmIChoaWRlTmFtZSl7XHJcblx0XHRoaWRlTmFtZUZ1bigpO1xyXG5cdH1cclxuXHJcblx0aWYgKGdldHR5cGUgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9ZWxzZXtcclxuXHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0fVxyXG5cclxuXHRpZiAoaXNFdmVudCl7XHJcblx0XHRkYXRhLm1hcChmdW5jdGlvbihkKXtcclxuXHRcdFx0aWYgKGQubGlrZXMpe1xyXG5cdFx0XHRcdGQubGlrZV9jb3VudCA9IGQubGlrZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGQubGlrZV9jb3VudCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aW5zZXJ0VGFibGUoZGF0YSk7XHJcblx0YWN0aXZlRGF0YVRhYmxlKCk7XHJcblx0ZmlsdGVyRXZlbnQoKTtcclxuXHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0JChcIi51cGRhdGVfYXJlYSwuZG9uYXRlX2FyZWFcIikuc2xpZGVVcCgpO1xyXG5cdCQoXCIucmVzdWx0X2FyZWFcIikuc2xpZGVEb3duKCk7XHJcblx0Ym9vdGJveC5hbGVydChcImRvbmVcIik7XHRcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0VGFibGUoZGF0YSl7XHJcblx0dmFyIGZpbHRlckRhdGEgPSB0b3RhbEZpbHRlcihkYXRhLCQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpLCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKTtcclxuXHRmb3IodmFyIGk9MDsgaTxmaWx0ZXJEYXRhLmxlbmd0aDsgaSsrKXtcclxuXHRcdHZhciBpbnNlcnRRdWVyeTtcclxuXHRcdGZpbHRlckRhdGFbaV0udHlwZSA9IGZpbHRlckRhdGFbaV0udHlwZSB8fCAnJztcclxuXHRcdGlmICgkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIikgPT0gdHJ1ZSl7XHJcblx0XHRcdGluc2VydFF1ZXJ5ID0gJzx0cj48dGQ+JysoaSsxKSsnPC90ZD48dGQ+PGEgaHJlZj1cIicrZmlsdGVyRGF0YVtpXS5saW5rKydcIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJytmaWx0ZXJEYXRhW2ldLmZyb21pZCsnL3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj4nK2ZpbHRlckRhdGFbaV0ucmVhbG5hbWUrJzwvYT48dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICcrZmlsdGVyRGF0YVtpXS50eXBlKydcIj48L3NwYW4+JytmaWx0ZXJEYXRhW2ldLnR5cGUrJzwvdGQ+PC90ZD48dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCInK2ZpbHRlckRhdGFbaV0ucG9zdGxpbmsrJ1wiIHRhcmdldD1cIl9ibGFua1wiPicrZmlsdGVyRGF0YVtpXS50ZXh0Kyc8L2E+PC90ZD48dGQ+JytmaWx0ZXJEYXRhW2ldLmxpa2VfY291bnQrJzwvdGQ+PHRkPicrZmlsdGVyRGF0YVtpXS5yZWFsdGltZSsnPC90ZD48L3RyPic7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aW5zZXJ0UXVlcnkgPSAnPHRyPjx0ZD4nKyhpKzEpKyc8L3RkPjx0ZD48YSBocmVmPVwiJytmaWx0ZXJEYXRhW2ldLmxpbmsrJ1wiIHRhcmdldD1cIl9ibGFua1wiPicrZmlsdGVyRGF0YVtpXS5yZWFsbmFtZSsnPC9hPjwvdGQ+PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAnK2ZpbHRlckRhdGFbaV0udHlwZSsnXCI+PC9zcGFuPicrZmlsdGVyRGF0YVtpXS50eXBlKyc8L3RkPjx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cIicrZmlsdGVyRGF0YVtpXS5wb3N0bGluaysnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JytmaWx0ZXJEYXRhW2ldLnRleHQrJzwvYT48L3RkPjx0ZD4nK2ZpbHRlckRhdGFbaV0ubGlrZV9jb3VudCsnPC90ZD48dGQ+JytmaWx0ZXJEYXRhW2ldLnJlYWx0aW1lKyc8L3RkPjwvdHI+JztcdFx0XHRcclxuXHRcdH1cclxuXHRcdCQoXCIubGlrZV9jb21tZW50XCIpLmFwcGVuZChpbnNlcnRRdWVyeSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhY3RpdmVEYXRhVGFibGUoKXtcclxuXHR2YXIgdGFibGUgPSAkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0fSk7XHJcblxyXG5cdCQoXCIjc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0dGFibGVcclxuXHRcdC5jb2x1bW5zKDEpXHJcblx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHQuZHJhdygpO1xyXG5cdH0pO1xyXG5cdCQoXCIjc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0dGFibGVcclxuXHRcdC5jb2x1bW5zKDMpXHJcblx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHQuZHJhdygpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaWx0ZXJFdmVudCgpe1xyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHRyZWRvVGFibGUoKTtcclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVkb1RhYmxlKCl7XHJcblx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHQkKFwiLm1haW5fdGFibGUgdGJvZHlcIikuaHRtbChcIlwiKTtcclxuXHRpbnNlcnRUYWJsZShkYXRhKTtcclxuXHRhY3RpdmVEYXRhVGFibGUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hvb3NlKCl7XHJcblx0JChcIiNhd2FyZExpc3QgdGJvZHlcIikuaHRtbChcIlwiKTtcclxuXHRhd2FyZCA9IG5ldyBBcnJheSgpO1xyXG5cdHZhciBsaXN0ID0gW107XHJcblx0dmFyIG51bSA9IDA7XHJcblx0dmFyIGRldGFpbCA9IGZhbHNlO1xyXG5cdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRkZXRhaWwgPSB0cnVlO1xyXG5cdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdGlmIChuID4gMCl7XHJcblx0XHRcdFx0bnVtICs9IG47XHJcblx0XHRcdFx0bGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1lbHNle1xyXG5cdFx0bnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdH1cclxuXHRcclxuXHJcblx0dmFyIHVuaXF1ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdHZhciBpc3RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cclxuXHR2YXIgYWZ0ZXJGaWx0ZXJEYXRhID0gdG90YWxGaWx0ZXIoZGF0YSwgdW5pcXVlLCBpc3RhZyk7XHJcblxyXG5cdHZhciB0ZW1wID0gZ2VuUmFuZG9tQXJyYXkoYWZ0ZXJGaWx0ZXJEYXRhLmxlbmd0aCkuc3BsaWNlKDAsbnVtKTtcclxuXHRmb3IgKHZhciBpPTA7IGk8bnVtOyBpKyspe1xyXG5cdFx0YXdhcmQucHVzaChhZnRlckZpbHRlckRhdGFbdGVtcFtpXV0pO1xyXG5cdH1cclxuXHJcblx0Zm9yICh2YXIgaj0wOyBqPG51bTsgaisrKXtcclxuXHRcdGF3YXJkW2pdLnR5cGUgPSBhd2FyZFtqXS50eXBlIHx8IFwiXCI7XHJcblx0XHRpZiAoJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpID09IHRydWUpe1xyXG5cdFx0XHQkKFwiPHRyIGFsaWduPSdjZW50ZXInIGNsYXNzPSdzdWNjZXNzJz48dGQ+PC90ZD48dGQ+PGEgaHJlZj0nXCIrYXdhcmRbal0ubGluaytcIicgdGFyZ2V0PSdfYmxhbmsnPjxpbWcgc3JjPSdodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tL1wiK2F3YXJkW2pdLmZyb21pZCtcIi9waWN0dXJlP3R5cGU9c21hbGwnPjxicj5cIithd2FyZFtqXS5yZWFsbmFtZStcIjwvYT48L3RkPjx0ZCBjbGFzcz0nY2VudGVyJz48c3BhbiBjbGFzcz0ncmVhY3QgXCIrYXdhcmRbal0udHlwZStcIic+PC9zcGFuPlwiK2F3YXJkW2pdLnR5cGUrXCI8L3RkPjx0ZCBjbGFzcz0nZm9yY2UtYnJlYWsnPjxhIGhyZWY9J1wiK2F3YXJkW2pdLnBvc3RsaW5rK1wiJyB0YXJnZXQ9J19ibGFuayc+XCIrYXdhcmRbal0udGV4dCtcIjwvYT48L3RkPjx0ZD5cIithd2FyZFtqXS5saWtlX2NvdW50K1wiPC90ZD48dGQ+XCIrYXdhcmRbal0ucmVhbHRpbWUrXCI8L3RkPjwvdHI+XCIpLmFwcGVuZFRvKFwiI2F3YXJkTGlzdCB0Ym9keVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKFwiPHRyIGFsaWduPSdjZW50ZXInIGNsYXNzPSdzdWNjZXNzJz48dGQ+PC90ZD48dGQ+PGEgaHJlZj0nXCIrYXdhcmRbal0ubGluaytcIicgdGFyZ2V0PSdfYmxhbmsnPlwiK2F3YXJkW2pdLnJlYWxuYW1lK1wiPC9hPjwvdGQ+PHRkIGNsYXNzPSdjZW50ZXInPjxzcGFuIGNsYXNzPSdyZWFjdCBcIithd2FyZFtqXS50eXBlK1wiJz48L3NwYW4+XCIrYXdhcmRbal0udHlwZStcIjwvdGQ+PHRkIGNsYXNzPSdmb3JjZS1icmVhayc+PGEgaHJlZj0nXCIrYXdhcmRbal0ucG9zdGxpbmsrXCInIHRhcmdldD0nX2JsYW5rJz5cIithd2FyZFtqXS50ZXh0K1wiPC9hPjwvdGQ+PHRkPlwiK2F3YXJkW2pdLmxpa2VfY291bnQrXCI8L3RkPjx0ZD5cIithd2FyZFtqXS5yZWFsdGltZStcIjwvdGQ+PC90cj5cIikuYXBwZW5kVG8oXCIjYXdhcmRMaXN0IHRib2R5XCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZihkZXRhaWwpe1xyXG5cdFx0dmFyIG5vdyA9IDA7XHJcblx0XHRmb3IodmFyIGs9MDsgazxsaXN0Lmxlbmd0aDsgaysrKXtcclxuXHRcdFx0dmFyIHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdCQoJzx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiNVwiPueNjuWTge+8micrbGlzdFtrXS5uYW1lKyc8c3Bhbj7lhbEgJytsaXN0W2tdLm51bSsnIOWQjTwvc3Bhbj48L3RkPjwvdHI+JykuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdG5vdyArPSAobGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHR9XHJcblxyXG5cdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdG90YWxGaWx0ZXIoYXJ5LGlzRHVwbGljYXRlLGlzVGFnKXtcclxuXHR2YXIgd29yZCA9ICQoXCIjc2VhcmNoQ29tbWVudFwiKS52YWwoKTtcclxuXHR2YXIgZmlsdGVyZWREYXRhID0gYXJ5O1xyXG5cdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRmaWx0ZXJlZERhdGEgPSBmaWx0ZXJfdW5pcXVlKGZpbHRlcmVkRGF0YSk7XHJcblx0fVxyXG5cdGZpbHRlcmVkRGF0YSA9IGZpbHRlcl93b3JkKGZpbHRlcmVkRGF0YSx3b3JkKTtcclxuXHRpZiAoaXNUYWcpe1xyXG5cdFx0ZmlsdGVyZWREYXRhID0gZmlsdGVyX3RhZyhmaWx0ZXJlZERhdGEpO1xyXG5cdH1cclxuXHRmaWx0ZXJlZERhdGEgPSBmaWx0ZXJfdGltZShmaWx0ZXJlZERhdGEsZW5kVGltZSk7XHJcblxyXG5cdGlmIChnZXR0eXBlID09IFwicmVhY3Rpb25zXCIpe1xyXG5cdFx0ZmlsdGVyZWREYXRhID0gZmlsdGVyX3JlYWN0KGZpbHRlcmVkRGF0YSwgZmlsdGVyUmVhY3Rpb24pO1xyXG5cdH1cclxuXHRyZXR1cm4gZmlsdGVyZWREYXRhO1xyXG59XHJcbmZ1bmN0aW9uIGZpbHRlcl91bmlxdWUoZmlsdGVyZWREYXRhKXtcclxuXHR2YXIgb3V0cHV0ID0gW107XHJcblx0dmFyIGtleXMgPSBbXTtcclxuXHRmaWx0ZXJlZERhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHR2YXIga2V5ID0gaXRlbVtcImZyb21pZFwiXTtcclxuXHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0cmV0dXJuIG91dHB1dDtcclxufVxyXG5mdW5jdGlvbiBmaWx0ZXJfd29yZChhcnksdGFyKXtcclxuXHRpZiAoZ2V0dHlwZSA9PSBcInJlYWN0aW9uc1wiKXtcclxuXHRcdHJldHVybiBhcnk7XHJcblx0fWVsc2V7XHJcblx0XHR2YXIgbmV3QXJ5ID0gJC5ncmVwKGFyeSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4udGV4dC5pbmRleE9mKHRhcikgPiAtMSl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gZmlsdGVyX3RpbWUoYXJ5LHQpe1xyXG5cdGlmIChnZXR0eXBlID09IFwicmVhY3Rpb25zXCIpe1xyXG5cdFx0cmV0dXJuIGFyeTtcclxuXHR9ZWxzZXtcclxuXHRcdHZhciB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0dmFyIHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0dmFyIG5ld0FyeSA9ICQuZ3JlcChhcnksZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdHZhciBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLnJlYWx0aW1lID09IFwiXCIpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIGZpbHRlcl9yZWFjdChhcnksdGFyKXtcclxuXHRpZiAoZ2V0dHlwZSA9PSBcInJlYWN0aW9uc1wiKXtcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xyXG5cdFx0XHRyZXR1cm4gYXJ5O1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHZhciBuZXdBcnkgPSAkLmdyZXAoYXJ5LGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIGZpbHRlcl90YWcoYXJ5KXtcclxuXHR2YXIgbmV3QXJ5ID0gJC5ncmVwKGFyeSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdGlmIChuLm1lc3NhZ2VfdGFncy5sZW5ndGggPiAwKXtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0cmV0dXJuIG5ld0FyeTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xyXG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcclxuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgICBpZiAobWluIDwgMTApe1xyXG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xyXG4gICAgIH1cclxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgaWYgKHNlYyA8IDEwKXtcclxuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcclxuICAgICB9XHJcbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XHJcbiAgICAgcmV0dXJuIHRpbWU7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gIHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuICB2YXIgaSwgciwgdDtcclxuICBmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuICAgYXJ5W2ldID0gaTtcclxuICB9XHJcbiAgZm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiAgIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuICAgdCA9IGFyeVtyXTtcclxuICAgYXJ5W3JdID0gYXJ5W2ldO1xyXG4gICBhcnlbaV0gPSB0O1xyXG4gIH1cclxuICByZXR1cm4gYXJ5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JFeGNlbChkYXRhKXtcclxuXHR2YXIgbmV3T2JqID0gW107XHJcblx0aWYgKGV4dGVuc2lvbil7XHJcblx0XHQkLmVhY2goZGF0YSxmdW5jdGlvbihpKXtcclxuXHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6IHRoaXMubGluayxcclxuXHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5yZWFsbmFtZSxcclxuXHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy50ZXh0LFxyXG5cdFx0XHRcdFwi6Kmy5YiG5Lqr6K6a5pW4XCIgOiB0aGlzLmxpa2VfY291bnRcclxuXHRcdFx0fVxyXG5cdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0fSk7XHJcblx0fWVsc2V7XHJcblx0XHQkLmVhY2goZGF0YSxmdW5jdGlvbihpKXtcclxuXHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcIuW6j+iZn1wiOiB0aGlzLnNlcmlhbCxcclxuXHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogdGhpcy5saW5rLFxyXG5cdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLnJlYWxuYW1lLFxyXG5cdFx0XHRcdFwi6KGo5oOFXCIgOiB0aGlzLnR5cGUsXHJcblx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSxcclxuXHRcdFx0XHRcIueVmeiogOaZgumWk1wiIDogdGhpcy5yZWFsdGltZVxyXG5cdFx0XHR9XHJcblx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0cmV0dXJuIG5ld09iajtcclxufVxyXG5cclxuZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpe1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGVOYW1lRnVuKCl7XHJcblx0Y29uc29sZS5sb2coXCJBXCIpO1xyXG5cdGZvcih2YXIgaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspe1xyXG5cdFx0ZGF0YVtpXS5yZWFsbmFtZSA9IFwiLVwiO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tBdXRoKCl7XHJcblx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdGNhbGxiYWNrQXV0aChyZXNwb25zZSk7XHJcblx0fSwge3Njb3BlOiAncmVhZF9zdHJlYW0sdXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX2dyb3VwcycscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxsYmFja0F1dGgocmVzcG9uc2Upe1xyXG5cdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHR2YXIgYWNjZXNzVG9rZW4gPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuYWNjZXNzVG9rZW47XHJcblx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZihcInJlYWRfc3RyZWFtXCIpIDwgMCl7XHJcblx0XHRcdGJvb3Rib3guYWxlcnQoXCLmipPliIbkuqvpnIDopoHku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIFcIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdGRhdGEgPSBKU09OLnBhcnNlKCQoXCIuY2hyb21lXCIpLnZhbCgpKTtcclxuXHRcdFx0Z2V0SlNPTigpO1xyXG5cdFx0fVxyXG5cdH1lbHNle1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0Y2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge3Njb3BlOiAncmVhZF9zdHJlYW0sdXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX2dyb3VwcycscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
