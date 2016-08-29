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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiY29tbWVudHMiLCJkYXRhIiwiaWRfYXJyYXkiLCJnZXR0eXBlIiwiaXNHcm91cCIsImxlbmd0aF9ub3ciLCJ1c2VyaWQiLCJ1cmxpZCIsImNsZWFuVVJMIiwicGFnZWlkIiwicG9zdGlkIiwiY3Vyc29yIiwicHVyZUZCSUQiLCJlcnJvclRpbWUiLCJiYWNrZW5kX2RhdGEiLCJub1BhZ2VOYW1lIiwiZW5kVGltZSIsIm5vd0RhdGUiLCJmaWx0ZXJSZWFjdGlvbiIsImNpX2NvdW50ZXIiLCJsaW1pdCIsImhpZGVOYW1lIiwiaXNFdmVudCIsImV4dGVuc2lvbiIsInVybCIsImVycm9yTWVzc2FnZSIsIndpbmRvdyIsIm9uZXJyb3IiLCJoYW5kbGVFcnIiLCJtc2ciLCJsIiwiY29uc29sZSIsImxvZyIsIiQiLCJmYWRlSW4iLCJyZW5kZXIiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50Iiwic3RyIiwidGFyZ2V0IiwicmVzdWx0IiwiSlNPTiIsInBhcnNlIiwiZ2V0SlNPTiIsInJlYWRBc1RleHQiLCJkb2N1bWVudCIsInJlYWR5IiwiaGFzaCIsImxvY2F0aW9uIiwic2VhcmNoIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwiY2hhbmdlIiwiZmlsZXMiLCJjbGljayIsImUiLCJjdHJsS2V5IiwiZ2V0QXV0aCIsImNoZWNrQXV0aCIsImFkZENsYXNzIiwia2V5ZG93biIsInRleHQiLCJrZXl1cCIsInZhbCIsInJlZG9UYWJsZSIsImNob29zZSIsImZpbHRlckRhdGEiLCJ0b3RhbEZpbHRlciIsInByb3AiLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJmb3JFeGNlbCIsImhhc0NsYXNzIiwiYXBwZW5kIiwiZXhjZWxTdHJpbmciLCJkYXRlcmFuZ2VwaWNrZXIiLCJzdGFydCIsImVuZCIsImxhYmVsIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwiaW5pdCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJodG1sIiwiaGlkZSIsInR5cGUiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsImdldExvZ2luU3RhdHVzIiwic3RhdHVzIiwiYWNjZXNzVG9rZW4iLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiYm9vdGJveCIsImFsZXJ0IiwiZ2V0RkJJRCIsImZiaWRfY2hlY2siLCJ0Iiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwid2FpdGluZ0ZCSUQiLCJhcGkiLCJyZXMiLCJpZCIsImZiaWRfYXJyYXkiLCJwb3N0dXJsIiwic3Vic3RyaW5nIiwicHVzaCIsIm9nX29iamVjdCIsInRvU3RyaW5nIiwicmVnZXgiLCJpIiwiY2hlY2tUeXBlIiwiY2hlY2tUeXBlMiIsImNoZWNrR3JvdXAiLCJjaGVja19wZXJzb25hbCIsImNoZWNrUHVyZSIsInBhZ2VfcyIsInBhZ2VfZSIsIm1hdGNoIiwicGFnZW5hbWUiLCJzcGxpdCIsInJlcGxhY2UiLCJmYmlkIiwiZ2V0RGF0YSIsInBvcCIsInNsaWRlVXAiLCJwb3N0X2lkIiwiYXBpX2NvbW1hbmQiLCJ1bmRlZmluZWQiLCJhcGlVUkwiLCJlcnJvciIsInNlcmlhbCIsInJlYWxuYW1lIiwiZnJvbSIsIm5hbWUiLCJyZWFsdGltZSIsInRpbWVDb252ZXJ0ZXIiLCJjcmVhdGVkX3RpbWUiLCJmcm9taWQiLCJsaW5rIiwibWVzc2FnZSIsInBvc3RsaW5rIiwibWVzc2FnZV90YWdzIiwicGFnaW5nIiwibmV4dCIsImdldERhdGFOZXh0X2V2ZW50IiwiY3Vyc29ycyIsImFmdGVyIiwiZ2V0RGF0YU5leHQiLCJmaW5pc2hlZCIsIm1heCIsInNldFRpbWVvdXQiLCJnZXQiLCJOZXh0dXJsIiwiZCIsIkRhdGUiLCJ0ZW1wIiwiYWpheCIsIm1ldGhvZCIsImNvbnRlbnRUeXBlIiwiZGF0YVR5cGUiLCJoaWRlTmFtZUZ1biIsIm1hcCIsImxpa2VzIiwibGlrZV9jb3VudCIsImluc2VydFRhYmxlIiwiYWN0aXZlRGF0YVRhYmxlIiwiZmlsdGVyRXZlbnQiLCJzbGlkZURvd24iLCJpbnNlcnRRdWVyeSIsInRhYmxlIiwib24iLCJjb2x1bW5zIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJBcnJheSIsImxpc3QiLCJudW0iLCJkZXRhaWwiLCJlYWNoIiwibiIsInBhcnNlSW50IiwiZmluZCIsInAiLCJ1bmlxdWUiLCJpc3RhZyIsImFmdGVyRmlsdGVyRGF0YSIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwiaiIsImFwcGVuZFRvIiwibm93IiwiayIsInRhciIsImVxIiwiaW5zZXJ0QmVmb3JlIiwiYXJ5IiwiaXNEdXBsaWNhdGUiLCJpc1RhZyIsIndvcmQiLCJmaWx0ZXJlZERhdGEiLCJmaWx0ZXJfdW5pcXVlIiwiZmlsdGVyX3dvcmQiLCJmaWx0ZXJfdGFnIiwiZmlsdGVyX3RpbWUiLCJmaWx0ZXJfcmVhY3QiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJuZXdBcnkiLCJncmVwIiwidGltZV9hcnkiLCJ0aW1lIiwibW9tZW50IiwiX2QiLCJVTklYX3RpbWVzdGFtcCIsImEiLCJtb250aHMiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJuZXdPYmoiLCJ0bXAiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsImluZGV4Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiY2FsbGJhY2tBdXRo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SUMsY0FBY04sU0FBU08sWUFBVCxDQUFzQkQsV0FBeEM7QUFDQSxNQUFJTixTQUFTTyxZQUFULENBQXNCQyxhQUF0QixDQUFvQ2xELE9BQXBDLENBQTRDLGFBQTVDLElBQTZELENBQWpFLEVBQW1FO0FBQ2xFbUQsV0FBUUMsS0FBUixDQUFjLGtCQUFkO0FBQ0EsR0FGRCxNQUVLO0FBQ0p4RSxLQUFFLG9CQUFGLEVBQXdCNkIsUUFBeEIsQ0FBaUMsTUFBakM7QUFDQTdELFVBQU8yQyxLQUFLQyxLQUFMLENBQVdaLEVBQUUsU0FBRixFQUFhaUMsR0FBYixFQUFYLENBQVA7QUFDQXBCO0FBQ0E7QUFDRCxFQVRELE1BU0s7QUFDSitDLEtBQUdDLEtBQUgsQ0FBUyxVQUFTQyxRQUFULEVBQW1CO0FBQzNCQyxZQUFTRCxRQUFUO0FBQ0EsR0FGRCxFQUVHLEVBQUNFLE9BQU8sZ0RBQVIsRUFBeURDLGVBQWUsSUFBeEUsRUFGSDtBQUdBO0FBQ0QiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBjb21tZW50cyA9IFtdO1xyXG52YXIgZGF0YSA9IFtdO1xyXG52YXIgaWRfYXJyYXkgPSBbXTtcclxudmFyIGdldHR5cGU7XHJcbnZhciBpc0dyb3VwID0gZmFsc2U7XHJcbnZhciBsZW5ndGhfbm93ID0gMDtcclxudmFyIHVzZXJpZCx1cmxpZDtcclxudmFyIGNsZWFuVVJMID0gZmFsc2U7XHJcbnZhciBwYWdlaWQgPSBcIlwiO1xyXG52YXIgcG9zdGlkID0gXCJcIjtcclxudmFyIGN1cnNvciA9IFwiXCI7XHJcbnZhciBwdXJlRkJJRCA9IGZhbHNlO1xyXG52YXIgZXJyb3JUaW1lID0gMDtcclxudmFyIGJhY2tlbmRfZGF0YSA9IHtcImRhdGFcIjpcIlwifTtcclxudmFyIG5vUGFnZU5hbWUgPSBmYWxzZTtcclxudmFyIGVuZFRpbWUgPSBub3dEYXRlKCk7XHJcbnZhciBmaWx0ZXJSZWFjdGlvbiA9ICdhbGwnO1xyXG52YXIgY2lfY291bnRlciA9IDA7XHJcbnZhciBsaW1pdCA9IDUwMDtcclxudmFyIGhpZGVOYW1lID0gZmFsc2U7XHJcbnZhciBpc0V2ZW50ID0gZmFsc2U7XHJcbnZhciBleHRlbnNpb24gPSBmYWxzZTtcclxudmFyIHVybCA9IFwiXCI7XHJcbnZhciB1c2VyaWQgPSBcIlwiO1xyXG5cclxudmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRsaW1pdCA9IDEwMDtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL6bue5pOK6Yyv6Kqk6ZaL6aCt55qE5bCP5LiJ6KeS5b2i566t6aCtXFxu5Lim5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOhXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1x0XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKGZpbGUpIHtcclxuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgXHR2YXIgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuICBcdC8vIHZhciBzID0gc3RyLmluZGV4T2YoXCI8Ym9keT5cIik7XHJcbiAgXHQvLyB2YXIgZSA9IHN0ci5sYXN0SW5kZXhPZihcIjwvYm9keT5cIik7XHJcbiAgXHQvLyB2YXIganNvbiA9IHN0ci5zdWJzdHJpbmcoKHMrNiksZSk7XHJcbiAgXHRkYXRhID0gSlNPTi5wYXJzZShzdHIpO1xyXG4gIFx0Z2V0SlNPTigpO1xyXG4gIH1cclxuXHJcbiAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0dmFyIGhhc2ggPSBsb2NhdGlvbi5zZWFyY2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImV4dGVuc2lvblwiKSA+PSAwKXtcclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0ZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuXHRcdHJlbmRlcih0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5KXtcclxuXHRcdFx0aGlkZU5hbWUgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Z2V0QXV0aCgnY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aCBidXR0b25cIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRjaGVja0F1dGgoKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpe1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZihlLmN0cmxLZXkpe1xyXG5cdFx0XHRnZXRBdXRoKCdzaGFyZWRwb3N0cycpO1xyXG5cdFx0XHRsaW1pdCA9IDEwMDtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6RVhDRUxcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRmaWx0ZXJSZWFjdGlvbiA9ICQodGhpcykudmFsKCk7XHJcblx0XHRyZWRvVGFibGUoKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9saWtlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRnZXRBdXRoKCdyZWFjdGlvbnMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl91cmxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGdldEF1dGgoJ3VybF9jb21tZW50cycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3BheVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0Z2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGNob29zZSgpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSB0b3RhbEZpbHRlcihkYXRhLCQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpLCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKTtcclxuXHRcdGlmIChlLmN0cmxLZXkpe1xyXG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YSk7XHJcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xyXG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZiAoZGF0YS5sZW5ndGggPiA3MDAwKXtcclxuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0fWVsc2V7XHRcclxuXHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZm9yRXhjZWwoZmlsdGVyRGF0YSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj4nKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSB0b3RhbEZpbHRlcihkYXRhLCQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpLCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGZvckV4Y2VsKGZpbHRlckRhdGEpO1xyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVktTU0tREQgICBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHJlZG9UYWJsZSgpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUoZW5kVGltZSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpe1xyXG5cdGRhdGEgPSBbXTtcclxuXHRpZF9hcnJheSA9IFtdO1xyXG5cdGxlbmd0aF9ub3cgPSAwO1xyXG5cdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0JChcIi5tYWluX3RhYmxlIHRib2R5XCIpLmh0bWwoXCJcIik7XHJcblx0JChcIiNhd2FyZExpc3QgdGJvZHlcIikuaHRtbChcIlwiKTtcclxuXHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEF1dGgodHlwZSl7XHJcblx0Z2V0dHlwZSA9IHR5cGU7XHJcblx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiIHx8IHR5cGUgPT0gXCJzaGFyZWRwb3N0c1wiKXtcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdH0sIHtzY29wZTogJ3JlYWRfc3RyZWFtLHVzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9ncm91cHMnLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9ZWxzZXtcclxuXHRcdEZCLmdldExvZ2luU3RhdHVzKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2FsbGJhY2socmVzcG9uc2Upe1xyXG5cdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHR2YXIgYWNjZXNzVG9rZW4gPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuYWNjZXNzVG9rZW47XHJcblx0XHRpZiAoZ2V0dHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZigncmVhZF9zdHJlYW0nKSA+PSAwKXtcclxuXHRcdFx0XHRib290Ym94LmFsZXJ0KFwi5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAL+iumlxcbkF1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBvciBnZXRMaWtlcyBhZ2Fpbi5cIik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGJvb3Rib3guYWxlcnQoXCLku5josrvmjojmrIrlpLHmlZfvvIzoq4voga/ntaHnrqHnkIblk6HpgLLooYznorroqo1cXG5BdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluaXN0cmF0b3IuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZ2V0dHlwZSA9PSBcInNoYXJlZHBvc3RzXCIpe1xyXG5cdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZihcInJlYWRfc3RyZWFtXCIpIDwgMCl7XHJcblx0XHRcdFx0Ym9vdGJveC5hbGVydChcIuaKk+WIhuS6q+mcgOimgeS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggVwiKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2V0RkJJRChnZXR0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGdldEZCSUQoZ2V0dHlwZSk7XHRcdFx0XHJcblx0XHR9XHJcblx0fWVsc2V7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRjYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHR9LCB7c2NvcGU6ICdyZWFkX3N0cmVhbSx1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLHVzZXJfZ3JvdXBzJyxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0RkJJRCh0eXBlKXtcclxuXHQvL2luaXRcclxuXHRjb21tZW50cyA9IFtdO1xyXG5cdGRhdGEgPSBbXTtcclxuXHRpZF9hcnJheSA9IFtdO1xyXG5cdGxlbmd0aF9ub3cgPSAwO1xyXG5cdHBhZ2VpZCA9IFwiXCI7XHJcblx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHQkKFwiLm1haW5fdGFibGUgdGJvZHlcIikuaHRtbChcIlwiKTtcclxuXHQkKFwiI2F3YXJkTGlzdCB0Ym9keVwiKS5odG1sKFwiXCIpO1xyXG5cdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHJcblx0aWRfYXJyYXkgPSBmYmlkX2NoZWNrKCk7XHJcblx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cclxuXHRpZiAodHlwZSA9PSBcInVybF9jb21tZW50c1wiKXtcclxuXHRcdHZhciB0ID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKGdldHR5cGUgID09IFwiY29tbWVudHNcIil7XHJcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0KTtcclxuXHRcdFx0XHR3YWl0aW5nRkJJRChcImNvbW1lbnRzXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9LDEwMCk7XHJcblx0fWVsc2V7XHJcblx0XHR2YXIgdCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmIChwYWdlaWQgIT0gXCJcIil7XHJcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0KTtcclxuXHRcdFx0XHR3YWl0aW5nRkJJRCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSwxMDApO1xyXG5cdH1cclxuXHJcblx0RkIuYXBpKFwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjIuMy9tZVwiLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHR1c2VyaWQgPSByZXMuaWQ7XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZiaWRfY2hlY2soKXtcclxuXHR2YXIgZmJpZF9hcnJheSA9IFtdO1xyXG5cdGJhY2tlbmRfZGF0YS50eXBlID0gZ2V0dHlwZTtcclxuXHRpZiAoZ2V0dHlwZSA9PSBcInVybF9jb21tZW50c1wiKXtcclxuXHRcdHB1cmVGQklEID0gdHJ1ZTtcclxuXHRcdHZhciBwb3N0dXJsID0gJCgkKFwiI2VudGVyVVJMIC51cmxcIilbMF0pLnZhbCgpO1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIj9cIikgPiAwKXtcclxuXHRcdFx0cG9zdHVybCA9IHBvc3R1cmwuc3Vic3RyaW5nKDAscG9zdHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHR9XHJcblx0XHRjbGVhblVSTCA9IHBvc3R1cmw7XHJcblx0XHRGQi5hcGkoXCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS92Mi4zL1wiK2NsZWFuVVJMK1wiL1wiLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdGZiaWRfYXJyYXkucHVzaChyZXMub2dfb2JqZWN0LmlkKTtcclxuXHRcdFx0dXJsaWQgPSBmYmlkX2FycmF5LnRvU3RyaW5nKCk7XHJcblx0XHRcdGdldHR5cGUgPSBcImNvbW1lbnRzXCI7XHJcblx0XHRcdGlkX2FycmF5ID0gZmJpZF9hcnJheTtcclxuXHRcdH0pO1xyXG5cdH1lbHNle1xyXG5cdFx0dmFyIHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdGZvcih2YXIgaT0wOyBpPCQoXCIjZW50ZXJVUkwgLnVybFwiKS5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdHZhciBwb3N0dXJsID0gJCgkKFwiI2VudGVyVVJMIC51cmxcIilbaV0pLnZhbCgpO1xyXG5cdFx0XHR2YXIgY2hlY2tUeXBlID0gcG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIik7XHJcblx0XHRcdHZhciBjaGVja1R5cGUyID0gcG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpO1xyXG5cdFx0XHR2YXIgY2hlY2tHcm91cCA9IHBvc3R1cmwuaW5kZXhPZihcIi9ncm91cHMvXCIpO1xyXG5cdFx0XHR2YXIgY2hlY2tfcGVyc29uYWwgPSBwb3N0dXJsLmluZGV4T2YoXCIrXCIpO1xyXG5cdFx0XHR2YXIgY2hlY2tQdXJlID0gcG9zdHVybC5pbmRleE9mKCdcIicpO1xyXG5cclxuXHRcdFx0dmFyIHBhZ2VfcyA9IHBvc3R1cmwuaW5kZXhPZihcImZhY2Vib29rLmNvbVwiKSsxMztcclxuXHRcdFx0aWYgKGNoZWNrR3JvdXAgPiAwKXtcclxuXHRcdFx0XHRwYWdlX3MgPSBjaGVja0dyb3VwKzg7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHBhZ2VfZSA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIixwYWdlX3MpO1xyXG5cdFx0XHRpZiAocGFnZV9lIDwgMCl7XHJcblx0XHRcdFx0cGFnZWlkID0gcG9zdHVybC5tYXRjaChyZWdleClbMV07XHJcblx0XHRcdFx0bm9QYWdlTmFtZSA9IHRydWU7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHZhciBwYWdlbmFtZSA9IHBvc3R1cmwuc3Vic3RyaW5nKHBhZ2VfcyxwYWdlX2UpO1xyXG5cdFx0XHRcdGlmIChjaGVja19wZXJzb25hbCA8IDApe1xyXG5cdFx0XHRcdFx0RkIuYXBpKFwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjIuMy9cIitwYWdlbmFtZStcIi9cIixmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0XHRwYWdlaWQgPSByZXMuaWQ7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cdFxyXG5cclxuXHRcdFx0dmFyIHJlc3VsdCA9IHBvc3R1cmwubWF0Y2gocmVnZXgpO1xyXG5cclxuXHRcdFx0aWYgKGNoZWNrX3BlcnNvbmFsID4gMCl7XHJcblx0XHRcdFx0cGFnZWlkID0gcG9zdHVybC5zcGxpdChcIitcIilbMF07XHJcblx0XHRcdFx0ZmJpZF9hcnJheS5wdXNoKHBvc3R1cmwuc3BsaXQoXCIrXCIpWzFdKTtcclxuXHRcdFx0fWVsc2UgaWYoY2hlY2tQdXJlID49IDApe1xyXG5cdFx0XHRcdGZiaWRfYXJyYXkucHVzaChwb3N0dXJsLnJlcGxhY2UoL1xcXCIvZywnJykpO1xyXG5cdFx0XHRcdHB1cmVGQklEID0gdHJ1ZTtcclxuXHRcdFx0XHRub1BhZ2VOYW1lID0gZmFsc2U7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmIChjaGVja1R5cGUgPiAwKXtcclxuXHRcdFx0XHRcdHZhciBzdGFydCA9IGNoZWNrVHlwZSs1O1xyXG5cdFx0XHRcdFx0dmFyIGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIiZcIixzdGFydCk7XHJcblx0XHRcdFx0XHR2YXIgZmJpZCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LGVuZCk7XHJcblx0XHRcdFx0XHRwdXJlRkJJRCA9IHRydWU7XHJcblx0XHRcdFx0XHRmYmlkX2FycmF5LnB1c2goZmJpZCk7XHJcblx0XHRcdFx0fWVsc2UgaWYgKGNoZWNrVHlwZTIgPiAwICYmIHJlc3VsdC5sZW5ndGggPT0gMSl7XHJcblx0XHRcdFx0XHRmYmlkX2FycmF5LnB1c2gocmVzdWx0WzBdKTtcclxuXHRcdFx0XHRcdGxpbWl0ID0gNTA7XHJcblx0XHRcdFx0XHRnZXR0eXBlID0gXCJmZWVkXCI7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxIHx8IHJlc3VsdC5sZW5ndGggPT0gMyl7XHJcblx0XHRcdFx0XHRcdGZiaWRfYXJyYXkucHVzaChyZXN1bHRbMF0pO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGZiaWRfYXJyYXkucHVzaChyZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChjaGVja0dyb3VwID4gMCkgaXNHcm91cCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHVybGlkID0gZmJpZF9hcnJheS50b1N0cmluZygpO1xyXG5cdFx0cmV0dXJuIGZiaWRfYXJyYXk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB3YWl0aW5nRkJJRCh0eXBlKXtcclxuXHQkKFwiLnNoYXJlX3Bvc3RcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdCQoXCIubGlrZV9jb21tZW50XCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRnZXREYXRhKGlkX2FycmF5LnBvcCgpKTtcclxuXHQkKFwiLnVwZGF0ZV9kb25hdGVcIikuc2xpZGVVcCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXREYXRhKHBvc3RfaWQpe1xyXG5cdHBvc3RpZCA9IHBvc3RfaWQ7XHJcblx0dmFyIGFwaV9jb21tYW5kID0gZ2V0dHlwZTtcclxuXHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdGlmICgocGFnZWlkID09IHVuZGVmaW5lZCB8fCBwdXJlRkJJRCA9PSB0cnVlKSAmJiBub1BhZ2VOYW1lID09IGZhbHNlKXtcclxuXHRcdHBhZ2VpZCA9IFwiXCI7XHJcblx0fWVsc2V7XHJcblx0XHRwYWdlaWQgKz0gXCJfXCI7XHJcblx0fVxyXG5cdHVybCA9IHBhZ2VpZCArIHBvc3RfaWQ7XHJcblx0dmFyIGFwaVVSTCA9IFwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjIuMy9cIitwYWdlaWQrcG9zdF9pZCtcIi9cIithcGlfY29tbWFuZCtcIj9saW1pdD1cIitsaW1pdDtcclxuXHRpZiAoYXBpX2NvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0YXBpVVJMID0gXCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS92Mi43L1wiK3BhZ2VpZCtwb3N0X2lkK1wiL3JlYWN0aW9ucz9saW1pdD01MDBcIjtcclxuXHR9XHJcblx0RkIuYXBpKGFwaVVSTCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0Ly8gY29uc29sZS50YWJsZShyZXMpO1xyXG5cdFx0aWYocmVzLmVycm9yKXtcclxuXHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+eZvOeUn+mMr+iqpO+8jOiri+eiuuiqjeaCqOeahOe2suWdgOeEoeiqpO+8jOS4pumHjeaWsOaVtOeQhuWGjeasoeWYl+ippicpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0Ym9vdGJveC5hbGVydChcIuaykuacieizh+aWmeaIlueEoeazleWPluW+l1xcbuWwj+WKqeaJi+WDheWFjeiyu+aUr+aPtOeyiee1suWcmOaKveeNju+8jOiLpeaYr+imgeaTt+WPluekvuWcmOeVmeiogOiri+S7mOiyu1xcbk5vIGNvbW1lbnRzLiBJZiB5b3Ugd2FudCBnZXQgZ3JvdXAgY29tbWVudHMsIHlvdSBuZWVkIHRvIHBheSBmb3IgaXQuXCIpO1xyXG5cdFx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGZvciAodmFyIGk9MDsgaTxyZXMuZGF0YS5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0ZGF0YS5wdXNoKHJlcy5kYXRhW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLmxlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0Zm9yICh2YXIgaT1sZW5ndGhfbm93OyBpPGRhdGEubGVuZ3RoOyBpKyspe1x0XHJcblx0XHRcdFx0ZGF0YVtpXS5zZXJpYWwgPSBpKzE7XHRcclxuXHRcdFx0XHRpZiAoYXBpX2NvbW1hbmQgPT0gXCJjb21tZW50c1wiIHx8IGFwaV9jb21tYW5kID09IFwiZmVlZFwiIHx8IGFwaV9jb21tYW5kID09IFwic2hhcmVkcG9zdHNcIil7XHJcblx0XHRcdFx0XHRkYXRhW2ldLnJlYWxuYW1lID0gZGF0YVtpXS5mcm9tLm5hbWU7XHJcblx0XHRcdFx0XHRkYXRhW2ldLnJlYWx0aW1lID0gdGltZUNvbnZlcnRlcihkYXRhW2ldLmNyZWF0ZWRfdGltZSk7XHJcblx0XHRcdFx0XHRkYXRhW2ldLmZyb21pZCA9IGRhdGFbaV0uZnJvbS5pZDtcclxuXHRcdFx0XHRcdGRhdGFbaV0ubGluayA9IFwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vXCIrZGF0YVtpXS5mcm9tLmlkO1x0XHJcblx0XHRcdFx0XHRkYXRhW2ldLnRleHQgPSBkYXRhW2ldLm1lc3NhZ2U7XHJcblx0XHRcdFx0XHRpZiAoIWRhdGFbaV0ubWVzc2FnZSl7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0udGV4dCA9IFwiXCI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIWNsZWFuVVJMKXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5wb3N0bGluayA9IFwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vXCIrZGF0YVtpXS5pZDtcdFxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ucG9zdGxpbmsgPSBjbGVhblVSTCtcIj9mYl9jb21tZW50X2lkPVwiK2RhdGFbaV0uaWQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIWRhdGFbaV0ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5tZXNzYWdlX3RhZ3MgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChhcGlfY29tbWFuZCA9PSBcInNoYXJlZHBvc3RzXCIpe1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLmxpbmsgPSBkYXRhW2ldLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLnRleHQgPSBcIlwiO1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLm1lc3NhZ2VfdGFncyA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNlIGlmIChhcGlfY29tbWFuZCA9PSBcInJlYWN0aW9uc1wiKXtcclxuXHRcdFx0XHRcdGRhdGFbaV0ucmVhbG5hbWUgPSBkYXRhW2ldLm5hbWU7XHJcblx0XHRcdFx0XHRkYXRhW2ldLmZyb21pZCA9IGRhdGFbaV0uaWQ7XHJcblx0XHRcdFx0XHRkYXRhW2ldLmxpbmsgPSBcImh0dHA6Ly93d3cuZmFjZWJvb2suY29tL1wiK2RhdGFbaV0uaWQ7XHJcblx0XHRcdFx0XHRpZiAoIWRhdGFbaV0ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5tZXNzYWdlX3RhZ3MgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0bGVuZ3RoX25vdyArPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0aWYgKGFwaV9jb21tYW5kID09IFwiZmVlZFwiKXtcclxuXHRcdFx0XHR2YXIgdXJsID0gcmVzLnBhZ2luZy5uZXh0O1xyXG5cdFx0XHRcdGdldERhdGFOZXh0X2V2ZW50KHVybCxhcGlfY29tbWFuZCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmIChyZXMucGFnaW5nLmN1cnNvcnMuYWZ0ZXIpe1xyXG5cdFx0XHRcdFx0Y3Vyc29yID0gcmVzLnBhZ2luZy5jdXJzb3JzLmFmdGVyO1xyXG5cdFx0XHRcdFx0Z2V0RGF0YU5leHQocG9zdF9pZCxjdXJzb3IsYXBpX2NvbW1hbmQsbGltaXQpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0aWYgKGlkX2FycmF5Lmxlbmd0aCA9PSAwKXtcdFxyXG5cdFx0XHRcdFx0XHRmaW5pc2hlZCgpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGdldERhdGEoaWRfYXJyYXkucG9wKCksYXBpX2NvbW1hbmQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXREYXRhTmV4dChwb3N0X2lkLG5leHQsYXBpX2NvbW1hbmQsbWF4KXtcclxuXHR2YXIgYXBpVVJMID0gXCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS92Mi4zL1wiK3BhZ2VpZCtwb3N0X2lkK1wiL1wiK2FwaV9jb21tYW5kK1wiP2FmdGVyPVwiK25leHQrXCImbGltaXQ9XCIrbWF4O1xyXG5cdGlmIChhcGlfY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRhcGlVUkwgPSBcImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tL3YyLjcvXCIrcGFnZWlkK3Bvc3RfaWQrXCIvcmVhY3Rpb25zP2FmdGVyPVwiK25leHQrXCImbGltaXQ9NTAwXCI7XHJcblx0fVxyXG5cdEZCLmFwaShhcGlVUkwsZnVuY3Rpb24ocmVzKXtcclxuXHRcdGNvbnNvbGUubG9nKHJlcyk7XHJcblx0XHRpZiAocmVzLmVycm9yKXtcclxuXHRcdFx0ZXJyb3JUaW1lKys7XHJcblx0XHRcdGlmIChlcnJvclRpbWUgPj0gMjAwKXtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn6Yyv6Kqk5qyh5pW46YGO5aSa77yM6KuL5oyJ5LiL6YeN5paw5pW055CG6YeN6KmmJyk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfnmbznlJ/pjK/oqqTvvIw156eS5b6M6Ieq5YuV6YeN6Kmm77yM6KuL56iN5b6FJyk7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+e5vOe6jOaIquWPluizh+aWmScpO1xyXG5cdFx0XHRcdFx0Z2V0RGF0YU5leHQocG9zdF9pZCxjdXJzb3IsYXBpX2NvbW1hbmQsNSk7XHJcblx0XHRcdFx0fSw1MDAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGZpbmlzaGVkKCk7XHJcblx0XHRcdH0sMTAwMCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPHJlcy5kYXRhLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRkYXRhLnB1c2gocmVzLmRhdGFbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRmb3IgKHZhciBpID0gbGVuZ3RoX25vdzsgaTxkYXRhLmxlbmd0aDsgaSsrKXtcdFxyXG5cdFx0XHRcdGRhdGFbaV0uc2VyaWFsID0gaSsxO1x0XHJcblx0XHRcdFx0aWYgKGFwaV9jb21tYW5kID09IFwiY29tbWVudHNcIiB8fCBhcGlfY29tbWFuZCA9PSBcImZlZWRcIiB8fCBhcGlfY29tbWFuZCA9PSBcInNoYXJlZHBvc3RzXCIpe1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5yZWFsbmFtZSA9IGRhdGFbaV0uZnJvbS5uYW1lO1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5yZWFsdGltZSA9IHRpbWVDb252ZXJ0ZXIoZGF0YVtpXS5jcmVhdGVkX3RpbWUpO1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5mcm9taWQgPSBkYXRhW2ldLmZyb20uaWQ7XHJcblx0XHRcdFx0XHRkYXRhW2ldLmxpbmsgPSBcImh0dHA6Ly93d3cuZmFjZWJvb2suY29tL1wiK2RhdGFbaV0uZnJvbS5pZDtcdFxyXG5cdFx0XHRcdFx0ZGF0YVtpXS50ZXh0ID0gZGF0YVtpXS5tZXNzYWdlO1xyXG5cdFx0XHRcdFx0aWYgKCFkYXRhW2ldLm1lc3NhZ2Upe1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLnRleHQgPSBcIlwiO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCFjbGVhblVSTCl7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ucG9zdGxpbmsgPSBcImh0dHA6Ly93d3cuZmFjZWJvb2suY29tL1wiK2RhdGFbaV0uaWQ7XHRcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLnBvc3RsaW5rID0gY2xlYW5VUkwrXCI/ZmJfY29tbWVudF9pZD1cIitkYXRhW2ldLmlkO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCFkYXRhW2ldLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ubWVzc2FnZV90YWdzID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoYXBpX2NvbW1hbmQgPT0gXCJzaGFyZWRwb3N0c1wiKXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5saW5rID0gZGF0YVtpXS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS50ZXh0ID0gXCJcIjtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5tZXNzYWdlX3RhZ3MgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZSBpZiAoYXBpX2NvbW1hbmQgPT0gXCJyZWFjdGlvbnNcIil7XHJcblx0XHRcdFx0XHRkYXRhW2ldLnJlYWxuYW1lID0gZGF0YVtpXS5uYW1lO1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5mcm9taWQgPSBkYXRhW2ldLmlkO1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5saW5rID0gXCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS9cIitkYXRhW2ldLmlkO1xyXG5cdFx0XHRcdFx0aWYgKCFkYXRhW2ldLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ubWVzc2FnZV90YWdzID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZW5ndGhfbm93ICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0aWYgKHJlcy5wYWdpbmcuY3Vyc29ycy5hZnRlcil7XHJcblx0XHRcdFx0Y3Vyc29yID0gcmVzLnBhZ2luZy5jdXJzb3JzLmFmdGVyO1xyXG5cdFx0XHRcdGdldERhdGFOZXh0KHBvc3RfaWQsY3Vyc29yLGFwaV9jb21tYW5kLGxpbWl0KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKGlkX2FycmF5Lmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdGZpbmlzaGVkKCk7XHJcblx0XHRcdFx0XHR9LDEwMDApO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0Z2V0RGF0YShpZF9hcnJheS5wb3AoKSxhcGlfY29tbWFuZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGFOZXh0X2V2ZW50KHVybCxhcGlfY29tbWFuZCl7XHJcblx0JC5nZXQodXJsLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRpZiAocmVzLmVycm9yKXtcclxuXHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+eZvOeUn+mMr+iqpO+8jDXnp5Llvozoh6rli5Xph43oqabvvIzoq4vnqI3lvoUnKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfnubznuozmiKrlj5bos4fmlpknKTtcclxuXHRcdFx0XHRnZXREYXRhTmV4dF9ldmVudCh1cmwsYXBpX2NvbW1hbmQpO1xyXG5cdFx0XHR9LDUwMDApO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdFx0aXNFdmVudCA9IHRydWU7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRmaW5pc2hlZCgpO1xyXG5cdFx0XHR9LDEwMDApO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGZvciAodmFyIGk9MDsgaTxyZXMuZGF0YS5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0ZGF0YS5wdXNoKHJlcy5kYXRhW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLmxlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IGxlbmd0aF9ub3c7IGk8ZGF0YS5sZW5ndGg7IGkrKyl7XHRcclxuXHRcdFx0XHRkYXRhW2ldLnNlcmlhbCA9IGkrMTtcdFxyXG5cdFx0XHRcdGlmIChhcGlfY29tbWFuZCA9PSBcImNvbW1lbnRzXCIgfHwgYXBpX2NvbW1hbmQgPT0gXCJmZWVkXCIgfHwgYXBpX2NvbW1hbmQgPT0gXCJzaGFyZWRwb3N0c1wiKXtcclxuXHRcdFx0XHRcdGRhdGFbaV0ucmVhbG5hbWUgPSBkYXRhW2ldLmZyb20ubmFtZTtcclxuXHRcdFx0XHRcdGRhdGFbaV0ucmVhbHRpbWUgPSB0aW1lQ29udmVydGVyKGRhdGFbaV0uY3JlYXRlZF90aW1lKTtcclxuXHRcdFx0XHRcdGRhdGFbaV0uZnJvbWlkID0gZGF0YVtpXS5mcm9tLmlkO1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5saW5rID0gXCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS9cIitkYXRhW2ldLmZyb20uaWQ7XHRcclxuXHRcdFx0XHRcdGRhdGFbaV0udGV4dCA9IGRhdGFbaV0ubWVzc2FnZTtcclxuXHRcdFx0XHRcdGlmICghZGF0YVtpXS5tZXNzYWdlKXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS50ZXh0ID0gXCJcIjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICghY2xlYW5VUkwpe1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLnBvc3RsaW5rID0gXCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS9cIitkYXRhW2ldLmlkO1x0XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpXS5wb3N0bGluayA9IGNsZWFuVVJMK1wiP2ZiX2NvbW1lbnRfaWQ9XCIrZGF0YVtpXS5pZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICghZGF0YVtpXS5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdFx0XHRkYXRhW2ldLm1lc3NhZ2VfdGFncyA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKGFwaV9jb21tYW5kID09IFwic2hhcmVkcG9zdHNcIil7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ubGluayA9IGRhdGFbaV0ucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0udGV4dCA9IFwiXCI7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ubWVzc2FnZV90YWdzID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2UgaWYgKGFwaV9jb21tYW5kID09IFwibGlrZXNcIil7XHJcblx0XHRcdFx0XHRkYXRhW2ldLnJlYWxuYW1lID0gZGF0YVtpXS5uYW1lO1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5mcm9taWQgPSBkYXRhW2ldLmlkO1xyXG5cdFx0XHRcdFx0ZGF0YVtpXS5saW5rID0gXCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS9cIitkYXRhW2ldLmlkO1xyXG5cdFx0XHRcdFx0aWYgKCFkYXRhW2ldLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0XHRcdGRhdGFbaV0ubWVzc2FnZV90YWdzID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZW5ndGhfbm93ICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0dmFyIE5leHR1cmwgPSByZXMucGFnaW5nLm5leHQ7XHJcblx0XHRcdGdldERhdGFOZXh0X2V2ZW50KE5leHR1cmwsYXBpX2NvbW1hbmQpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRKU09OKCl7XHJcblx0Y29tbWVudHMgPSBbXTtcclxuXHRpZF9hcnJheSA9IFtdO1xyXG5cclxuXHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdCQoXCIubWFpbl90YWJsZSB0Ym9keVwiKS5odG1sKFwiXCIpO1xyXG5cdCQoXCIjYXdhcmRMaXN0IHRib2R5XCIpLmh0bWwoXCJcIik7XHJcblx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cclxuXHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XHJcblxyXG5cdCQoXCIuc2hhcmVfcG9zdFwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0JChcIi5saWtlX2NvbW1lbnRcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdCQoXCIudXBkYXRlX2RvbmF0ZVwiKS5zbGlkZVVwKCk7XHJcblxyXG5cdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblxyXG5cdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0ZmluaXNoZWQoKTtcclxuXHR9LDEwMDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5pc2hlZCgpe1xyXG5cdGlmIChkYXRhLmxlbmd0aCA+PSAxMDAwKXtcclxuXHRcdHZhciBkID0gbmV3IERhdGUoKTtcclxuXHRcdHZhciB0ZW1wID0ge1widXJsXCI6IHVybCwgXCJ1c2VyXCI6IHVzZXJpZCwgXCJ0aW1lXCI6IGQsIFwibGVuZ3RoXCI6IGRhdGEubGVuZ3RoLCBcImNvbW1hbmRcIjogZ2V0dHlwZX07XHJcblx0XHR0ZW1wID0gIEpTT04uc3RyaW5naWZ5KHRlbXApO1xyXG5cdFx0JC5hamF4KHtcclxuXHRcdFx0dXJsOiBcImh0dHBzOi8veDJxbTUzNTVvOS5leGVjdXRlLWFwaS51cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9kZXYvcmVzdGZ1bFwiLFxyXG5cdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxyXG5cdFx0XHRjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcblx0XHRcdGRhdGFUeXBlOiBcImpzb25cIixcclxuXHRcdFx0ZGF0YTogdGVtcFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRpZiAoaGlkZU5hbWUpe1xyXG5cdFx0aGlkZU5hbWVGdW4oKTtcclxuXHR9XHJcblxyXG5cdGlmIChnZXR0eXBlID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0fWVsc2V7XHJcblx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdH1cclxuXHJcblx0aWYgKGlzRXZlbnQpe1xyXG5cdFx0ZGF0YS5tYXAoZnVuY3Rpb24oZCl7XHJcblx0XHRcdGlmIChkLmxpa2VzKXtcclxuXHRcdFx0XHRkLmxpa2VfY291bnQgPSBkLmxpa2VzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRkLmxpa2VfY291bnQgPSAwO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGluc2VydFRhYmxlKGRhdGEpO1xyXG5cdGFjdGl2ZURhdGFUYWJsZSgpO1xyXG5cdGZpbHRlckV2ZW50KCk7XHJcblx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdCQoXCIudXBkYXRlX2FyZWEsLmRvbmF0ZV9hcmVhXCIpLnNsaWRlVXAoKTtcclxuXHQkKFwiLnJlc3VsdF9hcmVhXCIpLnNsaWRlRG93bigpO1xyXG5cdGJvb3Rib3guYWxlcnQoXCJkb25lXCIpO1x0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc2VydFRhYmxlKGRhdGEpe1xyXG5cdHZhciBmaWx0ZXJEYXRhID0gdG90YWxGaWx0ZXIoZGF0YSwkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKSwkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKSk7XHJcblx0Zm9yKHZhciBpPTA7IGk8ZmlsdGVyRGF0YS5sZW5ndGg7IGkrKyl7XHJcblx0XHR2YXIgaW5zZXJ0UXVlcnk7XHJcblx0XHRmaWx0ZXJEYXRhW2ldLnR5cGUgPSBmaWx0ZXJEYXRhW2ldLnR5cGUgfHwgJyc7XHJcblx0XHRpZiAoJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpID09IHRydWUpe1xyXG5cdFx0XHRpbnNlcnRRdWVyeSA9ICc8dHI+PHRkPicrKGkrMSkrJzwvdGQ+PHRkPjxhIGhyZWY9XCInK2ZpbHRlckRhdGFbaV0ubGluaysnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+PGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLycrZmlsdGVyRGF0YVtpXS5mcm9taWQrJy9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+JytmaWx0ZXJEYXRhW2ldLnJlYWxuYW1lKyc8L2E+PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAnK2ZpbHRlckRhdGFbaV0udHlwZSsnXCI+PC9zcGFuPicrZmlsdGVyRGF0YVtpXS50eXBlKyc8L3RkPjwvdGQ+PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiJytmaWx0ZXJEYXRhW2ldLnBvc3RsaW5rKydcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nK2ZpbHRlckRhdGFbaV0udGV4dCsnPC9hPjwvdGQ+PHRkPicrZmlsdGVyRGF0YVtpXS5saWtlX2NvdW50Kyc8L3RkPjx0ZD4nK2ZpbHRlckRhdGFbaV0ucmVhbHRpbWUrJzwvdGQ+PC90cj4nO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGluc2VydFF1ZXJ5ID0gJzx0cj48dGQ+JysoaSsxKSsnPC90ZD48dGQ+PGEgaHJlZj1cIicrZmlsdGVyRGF0YVtpXS5saW5rKydcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nK2ZpbHRlckRhdGFbaV0ucmVhbG5hbWUrJzwvYT48L3RkPjx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJytmaWx0ZXJEYXRhW2ldLnR5cGUrJ1wiPjwvc3Bhbj4nK2ZpbHRlckRhdGFbaV0udHlwZSsnPC90ZD48dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCInK2ZpbHRlckRhdGFbaV0ucG9zdGxpbmsrJ1wiIHRhcmdldD1cIl9ibGFua1wiPicrZmlsdGVyRGF0YVtpXS50ZXh0Kyc8L2E+PC90ZD48dGQ+JytmaWx0ZXJEYXRhW2ldLmxpa2VfY291bnQrJzwvdGQ+PHRkPicrZmlsdGVyRGF0YVtpXS5yZWFsdGltZSsnPC90ZD48L3RyPic7XHRcdFx0XHJcblx0XHR9XHJcblx0XHQkKFwiLmxpa2VfY29tbWVudFwiKS5hcHBlbmQoaW5zZXJ0UXVlcnkpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWN0aXZlRGF0YVRhYmxlKCl7XHJcblx0dmFyIHRhYmxlID0gJChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3NlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdHRhYmxlXHJcblx0XHQuY29sdW1ucygxKVxyXG5cdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0LmRyYXcoKTtcclxuXHR9KTtcclxuXHQkKFwiI3NlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdHRhYmxlXHJcblx0XHQuY29sdW1ucygzKVxyXG5cdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0LmRyYXcoKTtcclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsdGVyRXZlbnQoKXtcclxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xyXG5cdFx0cmVkb1RhYmxlKCk7XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZG9UYWJsZSgpe1xyXG5cdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0JChcIi5tYWluX3RhYmxlIHRib2R5XCIpLmh0bWwoXCJcIik7XHJcblx0aW5zZXJ0VGFibGUoZGF0YSk7XHJcblx0YWN0aXZlRGF0YVRhYmxlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNob29zZSgpe1xyXG5cdCQoXCIjYXdhcmRMaXN0IHRib2R5XCIpLmh0bWwoXCJcIik7XHJcblx0YXdhcmQgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cdHZhciBudW0gPSAwO1xyXG5cdHZhciBkZXRhaWwgPSBmYWxzZTtcclxuXHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0ZGV0YWlsID0gdHJ1ZTtcclxuXHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRpZiAobiA+IDApe1xyXG5cdFx0XHRcdG51bSArPSBuO1xyXG5cdFx0XHRcdGxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9ZWxzZXtcclxuXHRcdG51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHR9XHJcblx0XHJcblxyXG5cdHZhciB1bmlxdWUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHR2YXIgaXN0YWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHJcblx0dmFyIGFmdGVyRmlsdGVyRGF0YSA9IHRvdGFsRmlsdGVyKGRhdGEsIHVuaXF1ZSwgaXN0YWcpO1xyXG5cclxuXHR2YXIgdGVtcCA9IGdlblJhbmRvbUFycmF5KGFmdGVyRmlsdGVyRGF0YS5sZW5ndGgpLnNwbGljZSgwLG51bSk7XHJcblx0Zm9yICh2YXIgaT0wOyBpPG51bTsgaSsrKXtcclxuXHRcdGF3YXJkLnB1c2goYWZ0ZXJGaWx0ZXJEYXRhW3RlbXBbaV1dKTtcclxuXHR9XHJcblxyXG5cdGZvciAodmFyIGo9MDsgajxudW07IGorKyl7XHJcblx0XHRhd2FyZFtqXS50eXBlID0gYXdhcmRbal0udHlwZSB8fCBcIlwiO1xyXG5cdFx0aWYgKCQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKSA9PSB0cnVlKXtcclxuXHRcdFx0JChcIjx0ciBhbGlnbj0nY2VudGVyJyBjbGFzcz0nc3VjY2Vzcyc+PHRkPjwvdGQ+PHRkPjxhIGhyZWY9J1wiK2F3YXJkW2pdLmxpbmsrXCInIHRhcmdldD0nX2JsYW5rJz48aW1nIHNyYz0naHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS9cIithd2FyZFtqXS5mcm9taWQrXCIvcGljdHVyZT90eXBlPXNtYWxsJz48YnI+XCIrYXdhcmRbal0ucmVhbG5hbWUrXCI8L2E+PC90ZD48dGQgY2xhc3M9J2NlbnRlcic+PHNwYW4gY2xhc3M9J3JlYWN0IFwiK2F3YXJkW2pdLnR5cGUrXCInPjwvc3Bhbj5cIithd2FyZFtqXS50eXBlK1wiPC90ZD48dGQgY2xhc3M9J2ZvcmNlLWJyZWFrJz48YSBocmVmPSdcIithd2FyZFtqXS5wb3N0bGluaytcIicgdGFyZ2V0PSdfYmxhbmsnPlwiK2F3YXJkW2pdLnRleHQrXCI8L2E+PC90ZD48dGQ+XCIrYXdhcmRbal0ubGlrZV9jb3VudCtcIjwvdGQ+PHRkPlwiK2F3YXJkW2pdLnJlYWx0aW1lK1wiPC90ZD48L3RyPlwiKS5hcHBlbmRUbyhcIiNhd2FyZExpc3QgdGJvZHlcIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JChcIjx0ciBhbGlnbj0nY2VudGVyJyBjbGFzcz0nc3VjY2Vzcyc+PHRkPjwvdGQ+PHRkPjxhIGhyZWY9J1wiK2F3YXJkW2pdLmxpbmsrXCInIHRhcmdldD0nX2JsYW5rJz5cIithd2FyZFtqXS5yZWFsbmFtZStcIjwvYT48L3RkPjx0ZCBjbGFzcz0nY2VudGVyJz48c3BhbiBjbGFzcz0ncmVhY3QgXCIrYXdhcmRbal0udHlwZStcIic+PC9zcGFuPlwiK2F3YXJkW2pdLnR5cGUrXCI8L3RkPjx0ZCBjbGFzcz0nZm9yY2UtYnJlYWsnPjxhIGhyZWY9J1wiK2F3YXJkW2pdLnBvc3RsaW5rK1wiJyB0YXJnZXQ9J19ibGFuayc+XCIrYXdhcmRbal0udGV4dCtcIjwvYT48L3RkPjx0ZD5cIithd2FyZFtqXS5saWtlX2NvdW50K1wiPC90ZD48dGQ+XCIrYXdhcmRbal0ucmVhbHRpbWUrXCI8L3RkPjwvdHI+XCIpLmFwcGVuZFRvKFwiI2F3YXJkTGlzdCB0Ym9keVwiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYoZGV0YWlsKXtcclxuXHRcdHZhciBub3cgPSAwO1xyXG5cdFx0Zm9yKHZhciBrPTA7IGs8bGlzdC5sZW5ndGg7IGsrKyl7XHJcblx0XHRcdHZhciB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHQkKCc8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjVcIj7njY7lk4HvvJonK2xpc3Rba10ubmFtZSsnPHNwYW4+5YWxICcrbGlzdFtrXS5udW0rJyDlkI08L3NwYW4+PC90ZD48L3RyPicpLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRub3cgKz0gKGxpc3Rba10ubnVtICsgMSk7XHJcblx0XHR9XHJcblx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0fVxyXG5cclxuXHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvdGFsRmlsdGVyKGFyeSxpc0R1cGxpY2F0ZSxpc1RhZyl7XHJcblx0dmFyIHdvcmQgPSAkKFwiI3NlYXJjaENvbW1lbnRcIikudmFsKCk7XHJcblx0dmFyIGZpbHRlcmVkRGF0YSA9IGFyeTtcclxuXHRpZiAoaXNEdXBsaWNhdGUpe1xyXG5cdFx0ZmlsdGVyZWREYXRhID0gZmlsdGVyX3VuaXF1ZShmaWx0ZXJlZERhdGEpO1xyXG5cdH1cclxuXHRmaWx0ZXJlZERhdGEgPSBmaWx0ZXJfd29yZChmaWx0ZXJlZERhdGEsd29yZCk7XHJcblx0aWYgKGlzVGFnKXtcclxuXHRcdGZpbHRlcmVkRGF0YSA9IGZpbHRlcl90YWcoZmlsdGVyZWREYXRhKTtcclxuXHR9XHJcblx0ZmlsdGVyZWREYXRhID0gZmlsdGVyX3RpbWUoZmlsdGVyZWREYXRhLGVuZFRpbWUpO1xyXG5cclxuXHRpZiAoZ2V0dHlwZSA9PSBcInJlYWN0aW9uc1wiKXtcclxuXHRcdGZpbHRlcmVkRGF0YSA9IGZpbHRlcl9yZWFjdChmaWx0ZXJlZERhdGEsIGZpbHRlclJlYWN0aW9uKTtcclxuXHR9XHJcblx0cmV0dXJuIGZpbHRlcmVkRGF0YTtcclxufVxyXG5mdW5jdGlvbiBmaWx0ZXJfdW5pcXVlKGZpbHRlcmVkRGF0YSl7XHJcblx0dmFyIG91dHB1dCA9IFtdO1xyXG5cdHZhciBrZXlzID0gW107XHJcblx0ZmlsdGVyZWREYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0dmFyIGtleSA9IGl0ZW1bXCJmcm9taWRcIl07XHJcblx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdHJldHVybiBvdXRwdXQ7XHJcbn1cclxuZnVuY3Rpb24gZmlsdGVyX3dvcmQoYXJ5LHRhcil7XHJcblx0aWYgKGdldHR5cGUgPT0gXCJyZWFjdGlvbnNcIil7XHJcblx0XHRyZXR1cm4gYXJ5O1xyXG5cdH1lbHNle1xyXG5cdFx0dmFyIG5ld0FyeSA9ICQuZ3JlcChhcnksZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLnRleHQuaW5kZXhPZih0YXIpID4gLTEpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIGZpbHRlcl90aW1lKGFyeSx0KXtcclxuXHRpZiAoZ2V0dHlwZSA9PSBcInJlYWN0aW9uc1wiKXtcclxuXHRcdHJldHVybiBhcnk7XHJcblx0fWVsc2V7XHJcblx0XHR2YXIgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdHZhciB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLChwYXJzZUludCh0aW1lX2FyeVsxXSktMSksdGltZV9hcnlbMl0sdGltZV9hcnlbM10sdGltZV9hcnlbNF0sdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdHZhciBuZXdBcnkgPSAkLmdyZXAoYXJ5LGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHR2YXIgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5yZWFsdGltZSA9PSBcIlwiKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH1cclxufVxyXG5mdW5jdGlvbiBmaWx0ZXJfcmVhY3QoYXJ5LHRhcil7XHJcblx0aWYgKGdldHR5cGUgPT0gXCJyZWFjdGlvbnNcIil7XHJcblx0XHRpZiAodGFyID09ICdhbGwnKXtcclxuXHRcdFx0cmV0dXJuIGFyeTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHR2YXIgbmV3QXJ5ID0gJC5ncmVwKGFyeSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5mdW5jdGlvbiBmaWx0ZXJfdGFnKGFyeSl7XHJcblx0dmFyIG5ld0FyeSA9ICQuZ3JlcChhcnksZnVuY3Rpb24obiwgaSl7XHJcblx0XHRpZiAobi5tZXNzYWdlX3RhZ3MubGVuZ3RoID4gMCl7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdHJldHVybiBuZXdBcnk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKXtcclxuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XHJcbiAgICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuICAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcbiAgICAgaWYgKG1pbiA8IDEwKXtcclxuICAgICBcdG1pbiA9IFwiMFwiK21pbjtcclxuICAgICB9XHJcbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG4gICAgIGlmIChzZWMgPCAxMCl7XHJcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XHJcbiAgICAgfVxyXG4gICAgIHZhciB0aW1lID0geWVhcisnLScrbW9udGgrJy0nK2RhdGUrXCIgXCIraG91cisnOicrbWluKyc6JytzZWMgO1xyXG4gICAgIHJldHVybiB0aW1lO1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuICB2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiAgdmFyIGksIHIsIHQ7XHJcbiAgZm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiAgIGFyeVtpXSA9IGk7XHJcbiAgfVxyXG4gIGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gICByID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcbiAgIHQgPSBhcnlbcl07XHJcbiAgIGFyeVtyXSA9IGFyeVtpXTtcclxuICAgYXJ5W2ldID0gdDtcclxuICB9XHJcbiAgcmV0dXJuIGFyeTtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9yRXhjZWwoZGF0YSl7XHJcblx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdGlmIChleHRlbnNpb24pe1xyXG5cdFx0JC5lYWNoKGRhdGEsZnVuY3Rpb24oaSl7XHJcblx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiB0aGlzLmxpbmssXHJcblx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMucmVhbG5hbWUsXHJcblx0XHRcdFx0XCLliIbkuqvpgKPntZBcIiA6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMudGV4dCxcclxuXHRcdFx0XHRcIuipsuWIhuS6q+iumuaVuFwiIDogdGhpcy5saWtlX2NvdW50XHJcblx0XHRcdH1cclxuXHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdH0pO1xyXG5cdH1lbHNle1xyXG5cdFx0JC5lYWNoKGRhdGEsZnVuY3Rpb24oaSl7XHJcblx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XCLluo/omZ9cIjogdGhpcy5zZXJpYWwsXHJcblx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6IHRoaXMubGluayxcclxuXHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5yZWFsbmFtZSxcclxuXHRcdFx0XHRcIuihqOaDhVwiIDogdGhpcy50eXBlLFxyXG5cdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRoaXMucmVhbHRpbWVcclxuXHRcdFx0fVxyXG5cdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdHJldHVybiBuZXdPYmo7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuICAgIFxyXG4gICAgdmFyIENTViA9ICcnOyAgICBcclxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG4gICAgXHJcbiAgICAvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG4gICAgaWYgKFNob3dMYWJlbCkge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcclxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXHJcbiAgICBcclxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG4gICAgXHJcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcbiAgICBcclxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxyXG4gICAgbGluay5ocmVmID0gdXJpO1xyXG4gICAgXHJcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG4gICAgbGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG4gICAgXHJcbiAgICAvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgIGxpbmsuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKXtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyK1wiLVwiK21vbnRoK1wiLVwiK2RhdGUrXCItXCIraG91citcIi1cIittaW4rXCItXCIrc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlTmFtZUZ1bigpe1xyXG5cdGNvbnNvbGUubG9nKFwiQVwiKTtcclxuXHRmb3IodmFyIGk9MDsgaTxkYXRhLmxlbmd0aDsgaSsrKXtcclxuXHRcdGRhdGFbaV0ucmVhbG5hbWUgPSBcIi1cIjtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrQXV0aCgpe1xyXG5cdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRjYWxsYmFja0F1dGgocmVzcG9uc2UpO1xyXG5cdH0sIHtzY29wZTogJ3JlYWRfc3RyZWFtLHVzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9ncm91cHMnLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FsbGJhY2tBdXRoKHJlc3BvbnNlKXtcclxuXHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0dmFyIGFjY2Vzc1Rva2VuID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmFjY2Vzc1Rva2VuO1xyXG5cdFx0aWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzLmluZGV4T2YoXCJyZWFkX3N0cmVhbVwiKSA8IDApe1xyXG5cdFx0XHRib290Ym94LmFsZXJ0KFwi5oqT5YiG5Lqr6ZyA6KaB5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHRkYXRhID0gSlNPTi5wYXJzZSgkKFwiLmNocm9tZVwiKS52YWwoKSk7XHJcblx0XHRcdGdldEpTT04oKTtcclxuXHRcdH1cclxuXHR9ZWxzZXtcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdH0sIHtzY29wZTogJ3JlYWRfc3RyZWFtLHVzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9ncm91cHMnLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9XHJcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
