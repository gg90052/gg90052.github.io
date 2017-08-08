"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
window.onerror = handleErr;
var TABLE;

function handleErr(msg, url, l) {
	if (!errorMessage) {
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		console.log("Error occur URL： " + $('#enterURL .url').val());
		$(".console .error").append("<br>" + $('#enterURL .url').val());
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}
$(document).ready(function () {
	var hash = location.search;
	if (hash.indexOf("extension") >= 0) {
		$(".loading.checkAuth").removeClass("hide");
		data.extension = true;

		$(".loading.checkAuth button").click(function (e) {
			fb.extensionAuth();
		});
	}
	if (hash.indexOf("ranker") >= 0) {
		var datas = {
			command: 'ranker',
			data: JSON.parse(localStorage.ranker)
		};
		data.raw = datas;
		data.finish(data.raw);
	}

	$("#btn_comments").click(function (e) {
		console.log(e);
		if (e.ctrlKey || e.altKey) {
			config.order = 'chronological';
		}
		fb.getAuth('comments');
	});

	$("#btn_like").click(function (e) {
		if (e.ctrlKey || e.altKey) {
			config.likes = true;
		}
		fb.getAuth('reactions');
	});
	$("#btn_url").click(function () {
		fb.getAuth('url_comments');
	});
	$("#btn_pay").click(function () {
		fb.getAuth('addScope');
	});
	$("#btn_choose").click(function () {
		choose.init();
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
		$(".prizeDetail").append("<div class=\"prize\"><div class=\"input_group\">\u54C1\u540D\uFF1A<input type=\"text\"></div><div class=\"input_group\">\u62BD\u734E\u4EBA\u6578\uFF1A<input type=\"number\"></div></div>");
	});

	$(window).keydown(function (e) {
		if (e.ctrlKey || e.altKey) {
			$("#btn_excel").text("輸出JSON");
		}
	});
	$(window).keyup(function (e) {
		if (!e.ctrlKey || e.altKey) {
			$("#btn_excel").text("輸出EXCEL");
		}
	});

	$("#unique, #tag").on('change', function () {
		table.redo();
	});

	$(".uipanel .react").change(function () {
		config.filter.react = $(this).val();
		table.redo();
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
		config.filter.endTime = start.format('YYYY-MM-DD-HH-mm-ss');
		table.redo();
	});
	$('.rangeDate').data('daterangepicker').setStartDate(nowDate());

	$("#btn_excel").click(function (e) {
		var filterData = data.filter(data.raw);
		if (e.ctrlKey || e.altKey) {
			var url = 'data:text/json;charset=utf8,' + JSON.stringify(filterData);
			window.open(url, '_blank');
			window.focus();
		} else {
			if (filterData.length > 7000) {
				$(".bigExcel").removeClass("hide");
			} else {
				JSONToCSVConvertor(data.excel(filterData), "Comment_helper", true);
			}
		}
	});

	$("#genExcel").click(function () {
		var filterData = data.filter(data.raw);
		var excelString = data.excel(filterData);
		$("#exceldata").val(JSON.stringify(excelString));
	});

	var ci_counter = 0;
	$(".ci").click(function (e) {
		ci_counter++;
		if (ci_counter >= 5) {
			$(".source .url, .source .btn").addClass("hide");
			$("#inputJSON").removeClass("hide");
		}
		if (e.ctrlKey || e.altKey) {}
	});
	$("#inputJSON").change(function () {
		$(".waiting").removeClass("hide");
		$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
		data.import(this.files[0]);
	});
});

function shareBTN() {
	alert('認真看完跳出來的那頁上面寫了什麼\n\n看完你就會知道你為什麼不能抓分享');
}

var config = {
	field: {
		comments: ['like_count', 'message_tags', 'message', 'from', 'created_time'],
		reactions: [],
		sharedposts: ['story', 'from', 'created_time'],
		url_comments: [],
		feed: [],
		likes: ['name']
	},
	limit: {
		comments: '500',
		reactions: '500',
		sharedposts: '500',
		url_comments: '500',
		feed: '500',
		likes: '500'
	},
	apiVersion: {
		comments: 'v2.7',
		reactions: 'v2.7',
		sharedposts: 'v2.9',
		url_comments: 'v2.7',
		feed: 'v2.9',
		group: 'v2.7'
	},
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	order: '',
	auth: 'user_photos,user_posts,user_managed_groups',
	likes: false
};

var fb = {
	user_posts: false,
	getAuth: function getAuth(type) {
		FB.login(function (response) {
			fb.callback(response, type);
		}, { scope: config.auth, return_scopes: true });
	},
	callback: function callback(response, type) {
		console.log(response);
		if (response.status === 'connected') {
			var authStr = response.authResponse.grantedScopes;
			if (type == "addScope") {
				if (authStr.indexOf('user_posts') >= 0) {
					swal('付費授權完成，請再次執行抓留言', 'Authorization Finished! Please getComments again.', 'success').done();
				} else {
					swal('付費授權失敗，請聯絡管理員確認', 'Authorization Failed! Please contact the admin.', 'error').done();
				}
			} else if (type == "sharedposts") {
				if (authStr.indexOf("user_posts") < 0) {
					swal({
						title: '抓分享需付費，詳情請見粉絲專頁',
						html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
						type: 'warning'
					}).done();
				} else {
					fb.user_posts = true;
					fbid.init(type);
				}
			} else {
				if (authStr.indexOf("user_posts") >= 0) {
					fb.user_posts = true;
				}
				fbid.init(type);
			}
		} else {
			FB.login(function (response) {
				fb.callback(response);
			}, { scope: config.auth, return_scopes: true });
		}
	},
	extensionAuth: function extensionAuth() {
		FB.login(function (response) {
			fb.extensionCallback(response);
		}, { scope: config.auth, return_scopes: true });
	},
	extensionCallback: function extensionCallback(response) {
		if (response.status === 'connected') {
			if (response.authResponse.grantedScopes.indexOf("user_posts") < 0) {
				swal({
					title: '抓分享需付費，詳情請見粉絲專頁',
					html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
					type: 'warning'
				}).done();
			} else {
				$(".loading.checkAuth").addClass("hide");
				var datas = {
					command: 'sharedposts',
					data: JSON.parse($(".chrome").val())
				};
				data.raw = datas;
				data.finish(data.raw);
			}
		} else {
			FB.login(function (response) {
				fb.extensionCallback(response);
			}, { scope: config.auth, return_scopes: true });
		}
	}
};

var data = {
	raw: [],
	userid: '',
	nowLength: 0,
	extension: false,
	init: function init() {
		$(".main_table").DataTable().destroy();
		$("#awardList").hide();
		$(".console .message").text('截取資料中...');
		data.nowLength = 0;
		data.raw = [];
	},
	start: function start(fbid) {
		$(".waiting").removeClass("hide");
		data.get(fbid).then(function (res) {
			fbid.data = res;
			data.finish(fbid);
		});
	},
	get: function get(fbid) {
		return new Promise(function (resolve, reject) {
			var datas = [];
			var promise_array = [];
			var command = fbid.command;
			if (fbid.type === 'group') command = 'group';
			if (fbid.type === 'group' && fbid.command !== 'reactions') fbid.fullID = fbid.pureID;
			if (config.likes) fbid.command = 'likes';
			console.log(config.apiVersion[command] + "/" + fbid.fullID + "/" + fbid.command + "?limit=" + config.limit[fbid.command] + "&fields=" + config.field[fbid.command].toString() + "&debug=all");
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/" + fbid.command + "?limit=" + config.limit[fbid.command] + "&order=" + config.order + "&fields=" + config.field[fbid.command].toString() + "&debug=all", function (res) {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = res.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var d = _step.value;

						if (fbid.command == 'reactions' || config.likes) {
							d.from = { id: d.id, name: d.name };
						}
						if (config.likes) d.type = "LIKE";
						if (d.from) {
							datas.push(d);
						} else {
							//event
							d.from = { id: d.id, name: d.id };
							d.created_time = d.updated_time;
							datas.push(d);
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

				if (res.data.length > 0 && res.paging.next) {
					getNext(res.paging.next);
				} else {
					resolve(datas);
				}
			});

			function getNext(url) {
				var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

				if (limit !== 0) {
					url = url.replace('limit=500', 'limit=' + limit);
				}
				$.getJSON(url, function (res) {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = res.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var d = _step2.value;

							if (d.id) {
								if (fbid.command == 'reactions' || config.likes) {
									d.from = { id: d.id, name: d.name };
								}
								if (d.from) {
									datas.push(d);
								} else {
									//event
									d.from = { id: d.id, name: d.id };
									d.created_time = d.updated_time;
									datas.push(d);
								}
							}
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					if (res.data.length > 0 && res.paging.next) {
						getNext(res.paging.next);
					} else {
						resolve(datas);
					}
				}).fail(function () {
					getNext(url, 200);
				});
			}
		});
	},
	finish: function finish(fbid) {
		$(".waiting").addClass("hide");
		$(".main_table").removeClass("hide");
		$(".update_area,.donate_area").slideUp();
		$(".result_area").slideDown();
		swal('完成！', 'Done!', 'success').done();
		data.raw = fbid;
		data.filter(data.raw, true);
		ui.reset();
	},
	filter: function filter(rawData) {
		var generate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var isDuplicate = $("#unique").prop("checked");
		var isTag = $("#tag").prop("checked");
		var newData = _filter.totalFilter.apply(_filter, [rawData, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
		rawData.filtered = newData;
		if (generate === true) {
			table.generate(rawData);
		} else {
			return rawData;
		}
	},
	excel: function excel(raw) {
		var newObj = [];
		if (data.extension) {
			$.each(raw.data, function (i) {
				var tmp = {
					"序號": i + 1,
					"臉書連結": 'http://www.facebook.com/' + this.from.id,
					"姓名": this.from.name,
					"分享連結": this.postlink,
					"留言內容": this.story,
					"該分享讚數": this.like_count
				};
				newObj.push(tmp);
			});
		} else {
			$.each(raw.data, function (i) {
				var tmp = {
					"序號": i + 1,
					"臉書連結": 'http://www.facebook.com/' + this.from.id,
					"姓名": this.from.name,
					"表情": this.type || '',
					"留言內容": this.message || this.story,
					"留言時間": timeConverter(this.created_time)
				};
				newObj.push(tmp);
			});
		}
		return newObj;
	},
	import: function _import(file) {
		var reader = new FileReader();

		reader.onload = function (event) {
			var str = event.target.result;
			data.raw = JSON.parse(str);
			data.finish(data.raw);
		};

		reader.readAsText(file);
	}
};

var table = {
	generate: function generate(rawdata) {
		$(".main_table").DataTable().destroy();
		var filterdata = rawdata.filtered;
		var thead = '';
		var tbody = '';
		var pic = $("#picture").prop("checked");
		if (rawdata.command === 'reactions' || config.likes) {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u8868\u60C5</td>";
		} else if (rawdata.command === 'sharedposts') {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
		} else if (rawdata.command === 'ranker') {
			thead = "<td>\u6392\u540D</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u5206\u6578</td>";
		} else {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td>\u8B9A</td>\n\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
		}

		var host = 'http://www.facebook.com/';
		if (data.raw.type === 'url_comments') host = $('#enterURL .url').val() + '?fb_comment_id=';

		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = filterdata.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var _step3$value = _slicedToArray(_step3.value, 2),
				    j = _step3$value[0],
				    val = _step3$value[1];

				var picture = '';
				if (pic) {
					picture = "<img src=\"http://graph.facebook.com/" + val.from.id + "/picture?type=small\"><br>";
				}
				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' target=\"_blank\">" + picture + val.from.name + "</a></td>";
				if (rawdata.command === 'reactions' || config.likes) {
					td += "<td class=\"center\"><span class=\"react " + val.type + "\"></span>" + val.type + "</td>";
				} else if (rawdata.command === 'sharedposts') {
					td += "<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + val.story + "</a></td>\n\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
				} else if (rawdata.command === 'ranker') {
					td = "<td>" + (j + 1) + "</td>\n\t\t\t\t\t  <td><a href='http://www.facebook.com/" + val.from.id + "' target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t\t\t  <td>" + val.score + "</td>";
				} else {
					td += "<td class=\"force-break\"><a href=\"" + host + val.id + "\" target=\"_blank\">" + val.message + "</a></td>\n\t\t\t\t<td>" + val.like_count + "</td>\n\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
				}
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}

		var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
		$(".main_table").html('').append(insert);

		active();

		function active() {
			TABLE = $(".main_table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});

			$("#searchName").on('blur change keyup', function () {
				TABLE.columns(1).search(this.value).draw();
			});
			$("#searchComment").on('blur change keyup', function () {
				TABLE.columns(2).search(this.value).draw();
				config.filter.word = this.value;
			});
		}
	},
	redo: function redo() {
		data.filter(data.raw, true);
	}
};

var choose = {
	data: [],
	award: [],
	num: 0,
	detail: false,
	list: [],
	init: function init() {
		var thead = $('.main_table thead').html();
		$('#awardList table thead').html(thead);
		$('#awardList table tbody').html('');
		choose.data = data.filter(data.raw);
		choose.award = [];
		choose.list = [];
		choose.num = 0;
		if ($("#searchComment").val() != '') {
			table.redo();
		}
		if ($("#moreprize").hasClass("active")) {
			choose.detail = true;
			$(".prizeDetail .prize").each(function () {
				var n = parseInt($(this).find("input[type='number']").val());
				var p = $(this).find("input[type='text']").val();
				if (n > 0) {
					choose.num += parseInt(n);
					choose.list.push({ "name": p, "num": n });
				}
			});
		} else {
			choose.num = $("#howmany").val();
		}
		choose.go();
	},
	go: function go() {
		choose.award = genRandomArray(choose.data.filtered.length).splice(0, choose.num);
		var insert = '';
		choose.award.map(function (val, index) {
			insert += '<tr title="第' + (index + 1) + '名">' + $('.main_table').DataTable().rows({ search: 'applied' }).nodes()[val].innerHTML + '</tr>';
		});
		$('#awardList table tbody').html(insert);
		$('#awardList table tbody tr').addClass('success');

		if (choose.detail) {
			var now = 0;
			for (var k in choose.list) {
				var tar = $("#awardList tbody tr").eq(now);
				$("<tr><td class=\"prizeName\" colspan=\"5\">\u734E\u54C1\uFF1A " + choose.list[k].name + " <span>\u5171 " + choose.list[k].num + " \u540D</span></td></tr>").insertBefore(tar);
				now += choose.list[k].num + 1;
			}
			$("#moreprize").removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		}
		$("#awardList").fadeIn(1000);
	},
	gen_big_award: function gen_big_award() {
		var li = '';
		var awards = [];
		$('#awardList tbody tr').each(function (index, val) {
			var award = {};
			if (val.hasAttribute('title')) {
				award.award_name = false;
				award.name = $(val).find('td').eq(1).find('a').text();
				award.userid = $(val).find('td').eq(1).find('a').attr('href').replace('http://www.facebook.com/', '');
				award.message = $(val).find('td').eq(2).find('a').text();
				award.link = $(val).find('td').eq(2).find('a').attr('href');
				award.time = $(val).find('td').eq($(val).find('td').length - 1).text();
			} else {
				award.award_name = true;
				award.name = $(val).find('td').text();
			}
			awards.push(award);
		});
		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = awards[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var i = _step4.value;

				if (i.award_name === true) {
					li += "<li class=\"prizeName\">" + i.name + "</li>";
				} else {
					li += "<li>\n\t\t\t\t<a href=\"https://www.facebook.com/" + i.userid + "\" target=\"_blank\"><img src=\"http://graph.facebook.com/" + i.userid + "/picture?type=large\" alt=\"\"></a>\n\t\t\t\t<div class=\"info\">\n\t\t\t\t<p class=\"name\"><a href=\"https://www.facebook.com/" + i.userid + "\" target=\"_blank\">" + i.name + "</a></p>\n\t\t\t\t<p class=\"message\"><a href=\"" + i.link + "\" target=\"_blank\">" + i.message + "</a></p>\n\t\t\t\t<p class=\"time\"><a href=\"" + i.link + "\" target=\"_blank\">" + i.time + "</a></p>\n\t\t\t\t</div>\n\t\t\t\t</li>";
				}
			}
		} catch (err) {
			_didIteratorError4 = true;
			_iteratorError4 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion4 && _iterator4.return) {
					_iterator4.return();
				}
			} finally {
				if (_didIteratorError4) {
					throw _iteratorError4;
				}
			}
		}

		$('.big_award ul').append(li);
		$('.big_award').addClass('show');
	},
	close_big_award: function close_big_award() {
		$('.big_award').removeClass('show');
		$('.big_award ul').empty();
	}
};

var fbid = {
	fbid: [],
	init: function init(type) {
		fbid.fbid = [];
		data.init();
		FB.api("/me", function (res) {
			data.userid = res.id;
			var url = fbid.format($('#enterURL .url').val());
			if (url.indexOf('.php?') === -1 && url.indexOf('?') > 0) {
				url = url.substring(0, url.indexOf('?'));
			}
			fbid.get(url, type).then(function (fbid) {
				data.start(fbid);
			});
			// $('.identity').removeClass('hide').html(`登入身份：<img src="http://graph.facebook.com/${res.id}/picture?type=small"><span>${res.name}</span>`);
		});
	},
	get: function get(url, type) {
		return new Promise(function (resolve, reject) {
			if (type == 'url_comments') {
				var posturl = url;
				if (posturl.indexOf("?") > 0) {
					posturl = posturl.substring(0, posturl.indexOf("?"));
				}
				FB.api("/" + posturl, function (res) {
					var obj = { fullID: res.og_object.id, type: type, command: 'comments' };
					config.limit['comments'] = '25';
					config.order = '';
					resolve(obj);
				});
			} else {
				var regex = /\d{4,}/g;
				var newurl = url.substr(url.indexOf('/', 28) + 1, 200);
				// https://www.facebook.com/ 共25字元，因此選28開始找/
				var result = newurl.match(regex);
				var urltype = fbid.checkType(url);
				fbid.checkPageID(url, urltype).then(function (id) {
					if (id === 'personal') {
						urltype = 'personal';
						id = data.userid;
					}
					var obj = { pageID: id, type: urltype, command: type };
					if (urltype === 'personal') {
						var start = url.indexOf('fbid=');
						if (start >= 0) {
							var end = url.indexOf("&", start);
							obj.pureID = url.substring(start + 5, end);
						} else {
							var _start = url.indexOf('posts/');
							obj.pureID = url.substring(_start + 6, url.length);
						}
						var video = url.indexOf('videos/');
						if (video >= 0) {
							obj.pureID = result[0];
						}
						obj.fullID = obj.pageID + '_' + obj.pureID;
						resolve(obj);
					} else if (urltype === 'pure') {
						obj.fullID = url.replace(/\"/g, '');
						resolve(obj);
					} else {
						if (urltype === 'event') {
							if (result.length == 1) {
								//抓EVENT中所有留言
								obj.command = 'feed';
								obj.fullID = result[0];
								resolve(obj);
							} else {
								//抓EVENT中某篇留言的留言
								obj.fullID = result[1];
								resolve(obj);
							}
						} else if (urltype === 'group') {
							if (fb.user_posts) {
								obj.pureID = result[result.length - 1];
								obj.pageID = result[0];
								obj.fullID = obj.pageID + "_" + obj.pureID;
								resolve(obj);
							} else {
								swal({
									title: '社團使用需付費，詳情請見粉絲團',
									html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
									type: 'warning'
								}).done();
							}
						} else if (urltype === 'photo') {
							var _regex = /\d{4,}/g;
							var _result = url.match(_regex);
							obj.pureID = _result[_result.length - 1];
							obj.fullID = obj.pageID + '_' + obj.pureID;
							resolve(obj);
						} else {
							if (result.length == 1 || result.length == 3) {
								obj.pureID = result[0];
								obj.fullID = obj.pageID + '_' + obj.pureID;
								resolve(obj);
							} else {
								if (urltype === 'unname') {
									obj.pureID = result[0];
									obj.pageID = result[result.length - 1];
								} else {
									obj.pureID = result[result.length - 1];
								}
								obj.fullID = obj.pageID + '_' + obj.pureID;
								resolve(obj);
							}
						}
					}
				});
			}
		});
	},
	checkType: function checkType(posturl) {
		if (posturl.indexOf("fbid=") >= 0) {
			if (posturl.indexOf('permalink') >= 0) {
				return 'unname';
			} else {
				return 'personal';
			}
		};
		if (posturl.indexOf("/groups/") >= 0) {
			return 'group';
		};
		if (posturl.indexOf("events") >= 0) {
			return 'event';
		};
		if (posturl.indexOf("/photos/") >= 0) {
			return 'photo';
		};
		if (posturl.indexOf('"') >= 0) {
			return 'pure';
		};
		return 'normal';
	},
	checkPageID: function checkPageID(posturl, type) {
		return new Promise(function (resolve, reject) {
			var start = posturl.indexOf("facebook.com") + 13;
			var end = posturl.indexOf("/", start);
			var regex = /\d{4,}/g;
			if (end < 0) {
				if (posturl.indexOf('fbid=') >= 0) {
					if (type === 'unname') {
						resolve('unname');
					} else {
						resolve('personal');
					}
				} else {
					resolve(posturl.match(regex)[1]);
				}
			} else {
				var group = posturl.indexOf('/groups/');
				var event = posturl.indexOf('/events/');
				if (group >= 0) {
					start = group + 8;
					end = posturl.indexOf("/", start);
					var regex2 = /\d{6,}/g;
					var temp = posturl.substring(start, end);
					if (regex2.test(temp)) {
						resolve(temp);
					} else {
						resolve('group');
					}
				} else if (event >= 0) {
					resolve('event');
				} else {
					var pagename = posturl.substring(start, end);
					FB.api("/" + pagename, function (res) {
						if (res.error) {
							resolve('personal');
						} else {
							resolve(res.id);
						}
					});
				}
			}
		});
	},
	format: function format(url) {
		if (url.indexOf('business.facebook.com/') >= 0) {
			url = url.substring(0, url.indexOf("?"));
			return url;
		} else {
			return url;
		}
	}
};

var _filter = {
	totalFilter: function totalFilter(rawdata, isDuplicate, isTag, word, react, endTime) {
		var data = rawdata.data;
		if (word !== '') {
			data = _filter.word(data, word);
		}
		if (isTag) {
			data = _filter.tag(data);
		}
		if (rawdata.command === 'reactions' || config.likes) {
			data = _filter.react(data, react);
		} else if (rawdata.command === 'ranker') {} else {
			data = _filter.time(data, endTime);
		}
		if (isDuplicate) {
			data = _filter.unique(data);
		}

		return data;
	},
	unique: function unique(data) {
		var output = [];
		var keys = [];
		data.forEach(function (item) {
			var key = item.from.id;
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	},
	word: function word(data, _word) {
		var newAry = $.grep(data, function (n, i) {
			if (n.message.indexOf(_word) > -1) {
				return true;
			}
		});
		return newAry;
	},
	tag: function tag(data) {
		var newAry = $.grep(data, function (n, i) {
			if (n.message_tags) {
				return true;
			}
		});
		return newAry;
	},
	time: function time(data, t) {
		var time_ary = t.split("-");
		var time = moment(new Date(time_ary[0], parseInt(time_ary[1]) - 1, time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;
		var newAry = $.grep(data, function (n, i) {
			var created_time = moment(n.created_time)._d;
			if (created_time < time || n.created_time == "") {
				return true;
			}
		});
		return newAry;
	},
	react: function react(data, tar) {
		if (tar == 'all') {
			return data;
		} else {
			var newAry = $.grep(data, function (n, i) {
				if (n.type == tar) {
					return true;
				}
			});
			return newAry;
		}
	}
};

var ui = {
	init: function init() {},
	reset: function reset() {
		var command = data.raw.command;
		if (command === 'reactions' || config.likes) {
			$('.limitTime, #searchComment').addClass('hide');
			$('.uipanel .react').removeClass('hide');
		} else {
			$('.limitTime, #searchComment').removeClass('hide');
			$('.uipanel .react').addClass('hide');
		}
		if (command === 'comments') {
			$('label.tag').removeClass('hide');
		} else {
			if ($("#tag").prop("checked")) {
				$("#tag").click();
			}
			$('label.tag').addClass('hide');
		}
	}
};

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

function timeConverter(UNIX_timestamp) {
	var a = moment(UNIX_timestamp)._d;
	var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	if (date < 10) {
		date = "0" + date;
	}
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

function obj2Array(obj) {
	var array = $.map(obj, function (value, index) {
		return [value];
	});
	return array;
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
	var uri = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(CSV);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIlRBQkxFIiwibXNnIiwidXJsIiwibCIsImNvbnNvbGUiLCJsb2ciLCIkIiwidmFsIiwiYXBwZW5kIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImhhc2giLCJsb2NhdGlvbiIsInNlYXJjaCIsImluZGV4T2YiLCJyZW1vdmVDbGFzcyIsImRhdGEiLCJleHRlbnNpb24iLCJjbGljayIsImUiLCJmYiIsImV4dGVuc2lvbkF1dGgiLCJkYXRhcyIsImNvbW1hbmQiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJyYW5rZXIiLCJyYXciLCJmaW5pc2giLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJnZXRBdXRoIiwibGlrZXMiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImZpbHRlciIsInJlYWN0IiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsImVuZFRpbWUiLCJmb3JtYXQiLCJzZXRTdGFydERhdGUiLCJub3dEYXRlIiwiZmlsdGVyRGF0YSIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJzaGFyZUJUTiIsImFsZXJ0IiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwid29yZCIsImF1dGgiLCJ1c2VyX3Bvc3RzIiwidHlwZSIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFN0ciIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJzd2FsIiwiZG9uZSIsInRpdGxlIiwiaHRtbCIsImZiaWQiLCJleHRlbnNpb25DYWxsYmFjayIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZ2V0IiwidGhlbiIsInJlcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicHJvbWlzZV9hcnJheSIsImZ1bGxJRCIsInB1cmVJRCIsInRvU3RyaW5nIiwiYXBpIiwiZCIsImZyb20iLCJpZCIsIm5hbWUiLCJwdXNoIiwiY3JlYXRlZF90aW1lIiwidXBkYXRlZF90aW1lIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwidWkiLCJyZXNldCIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwiZmlsdGVyZWQiLCJuZXdPYmoiLCJlYWNoIiwiaSIsInRtcCIsInBvc3RsaW5rIiwic3RvcnkiLCJsaWtlX2NvdW50IiwibWVzc2FnZSIsInRpbWVDb252ZXJ0ZXIiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50Iiwic3RyIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsInBpYyIsImhvc3QiLCJlbnRyaWVzIiwiaiIsInBpY3R1cmUiLCJ0ZCIsInNjb3JlIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwibiIsInBhcnNlSW50IiwiZmluZCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwibWFwIiwiaW5kZXgiLCJyb3dzIiwibm9kZXMiLCJpbm5lckhUTUwiLCJub3ciLCJrIiwidGFyIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJnZW5fYmlnX2F3YXJkIiwibGkiLCJhd2FyZHMiLCJoYXNBdHRyaWJ1dGUiLCJhd2FyZF9uYW1lIiwiYXR0ciIsImxpbmsiLCJ0aW1lIiwiY2xvc2VfYmlnX2F3YXJkIiwiZW1wdHkiLCJzdWJzdHJpbmciLCJwb3N0dXJsIiwib2JqIiwib2dfb2JqZWN0IiwicmVnZXgiLCJuZXd1cmwiLCJzdWJzdHIiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsInZpZGVvIiwicmVnZXgyIiwidGVtcCIsInRlc3QiLCJwYWdlbmFtZSIsImVycm9yIiwidGFnIiwidW5pcXVlIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsInNwbGl0IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwiYSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwicm93Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFlQyxTQUFmO0FBQ0EsSUFBSUMsS0FBSjs7QUFFQSxTQUFTRCxTQUFULENBQW1CRSxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNQLFlBQUwsRUFBa0I7QUFDakJRLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQkMsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBbEM7QUFDQUQsSUFBRSxpQkFBRixFQUFxQkUsTUFBckIsQ0FBNEIsU0FBT0YsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBbkM7QUFDQUQsSUFBRSxpQkFBRixFQUFxQkcsTUFBckI7QUFDQWIsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRFUsRUFBRUksUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0IsS0FBSUMsT0FBT0MsU0FBU0MsTUFBcEI7QUFDQSxLQUFJRixLQUFLRyxPQUFMLENBQWEsV0FBYixLQUE2QixDQUFqQyxFQUFtQztBQUNsQ1QsSUFBRSxvQkFBRixFQUF3QlUsV0FBeEIsQ0FBb0MsTUFBcEM7QUFDQUMsT0FBS0MsU0FBTCxHQUFpQixJQUFqQjs7QUFFQVosSUFBRSwyQkFBRixFQUErQmEsS0FBL0IsQ0FBcUMsVUFBU0MsQ0FBVCxFQUFXO0FBQy9DQyxNQUFHQyxhQUFIO0FBQ0EsR0FGRDtBQUdBO0FBQ0QsS0FBSVYsS0FBS0csT0FBTCxDQUFhLFFBQWIsS0FBMEIsQ0FBOUIsRUFBZ0M7QUFDL0IsTUFBSVEsUUFBUTtBQUNYQyxZQUFTLFFBREU7QUFFWFAsU0FBTVEsS0FBS0MsS0FBTCxDQUFXQyxhQUFhQyxNQUF4QjtBQUZLLEdBQVo7QUFJQVgsT0FBS1ksR0FBTCxHQUFXTixLQUFYO0FBQ0FOLE9BQUthLE1BQUwsQ0FBWWIsS0FBS1ksR0FBakI7QUFDQTs7QUFHRHZCLEdBQUUsZUFBRixFQUFtQmEsS0FBbkIsQ0FBeUIsVUFBU0MsQ0FBVCxFQUFXO0FBQ25DaEIsVUFBUUMsR0FBUixDQUFZZSxDQUFaO0FBQ0EsTUFBSUEsRUFBRVcsT0FBRixJQUFhWCxFQUFFWSxNQUFuQixFQUEwQjtBQUN6QkMsVUFBT0MsS0FBUCxHQUFlLGVBQWY7QUFDQTtBQUNEYixLQUFHYyxPQUFILENBQVcsVUFBWDtBQUNBLEVBTkQ7O0FBUUE3QixHQUFFLFdBQUYsRUFBZWEsS0FBZixDQUFxQixVQUFTQyxDQUFULEVBQVc7QUFDL0IsTUFBSUEsRUFBRVcsT0FBRixJQUFhWCxFQUFFWSxNQUFuQixFQUEwQjtBQUN6QkMsVUFBT0csS0FBUCxHQUFlLElBQWY7QUFDQTtBQUNEZixLQUFHYyxPQUFILENBQVcsV0FBWDtBQUNBLEVBTEQ7QUFNQTdCLEdBQUUsVUFBRixFQUFjYSxLQUFkLENBQW9CLFlBQVU7QUFDN0JFLEtBQUdjLE9BQUgsQ0FBVyxjQUFYO0FBQ0EsRUFGRDtBQUdBN0IsR0FBRSxVQUFGLEVBQWNhLEtBQWQsQ0FBb0IsWUFBVTtBQUM3QkUsS0FBR2MsT0FBSCxDQUFXLFVBQVg7QUFDQSxFQUZEO0FBR0E3QixHQUFFLGFBQUYsRUFBaUJhLEtBQWpCLENBQXVCLFlBQVU7QUFDaENrQixTQUFPQyxJQUFQO0FBQ0EsRUFGRDs7QUFJQWhDLEdBQUUsWUFBRixFQUFnQmEsS0FBaEIsQ0FBc0IsWUFBVTtBQUMvQixNQUFHYixFQUFFLElBQUYsRUFBUWlDLFFBQVIsQ0FBaUIsUUFBakIsQ0FBSCxFQUE4QjtBQUM3QmpDLEtBQUUsSUFBRixFQUFRVSxXQUFSLENBQW9CLFFBQXBCO0FBQ0FWLEtBQUUsV0FBRixFQUFlVSxXQUFmLENBQTJCLFNBQTNCO0FBQ0FWLEtBQUUsY0FBRixFQUFrQlUsV0FBbEIsQ0FBOEIsUUFBOUI7QUFDQSxHQUpELE1BSUs7QUFDSlYsS0FBRSxJQUFGLEVBQVFrQyxRQUFSLENBQWlCLFFBQWpCO0FBQ0FsQyxLQUFFLFdBQUYsRUFBZWtDLFFBQWYsQ0FBd0IsU0FBeEI7QUFDQWxDLEtBQUUsY0FBRixFQUFrQmtDLFFBQWxCLENBQTJCLFFBQTNCO0FBQ0E7QUFDRCxFQVZEOztBQVlBbEMsR0FBRSxVQUFGLEVBQWNhLEtBQWQsQ0FBb0IsWUFBVTtBQUM3QixNQUFHYixFQUFFLElBQUYsRUFBUWlDLFFBQVIsQ0FBaUIsUUFBakIsQ0FBSCxFQUE4QjtBQUM3QmpDLEtBQUUsSUFBRixFQUFRVSxXQUFSLENBQW9CLFFBQXBCO0FBQ0EsR0FGRCxNQUVLO0FBQ0pWLEtBQUUsSUFBRixFQUFRa0MsUUFBUixDQUFpQixRQUFqQjtBQUNBO0FBQ0QsRUFORDs7QUFRQWxDLEdBQUUsZUFBRixFQUFtQmEsS0FBbkIsQ0FBeUIsWUFBVTtBQUNsQ2IsSUFBRSxjQUFGLEVBQWtCRSxNQUFsQjtBQUNBLEVBRkQ7O0FBSUFGLEdBQUVULE1BQUYsRUFBVTRDLE9BQVYsQ0FBa0IsVUFBU3JCLENBQVQsRUFBVztBQUM1QixNQUFJQSxFQUFFVyxPQUFGLElBQWFYLEVBQUVZLE1BQW5CLEVBQTBCO0FBQ3pCMUIsS0FBRSxZQUFGLEVBQWdCb0MsSUFBaEIsQ0FBcUIsUUFBckI7QUFDQTtBQUNELEVBSkQ7QUFLQXBDLEdBQUVULE1BQUYsRUFBVThDLEtBQVYsQ0FBZ0IsVUFBU3ZCLENBQVQsRUFBVztBQUMxQixNQUFJLENBQUNBLEVBQUVXLE9BQUgsSUFBY1gsRUFBRVksTUFBcEIsRUFBMkI7QUFDMUIxQixLQUFFLFlBQUYsRUFBZ0JvQyxJQUFoQixDQUFxQixTQUFyQjtBQUNBO0FBQ0QsRUFKRDs7QUFNQXBDLEdBQUUsZUFBRixFQUFtQnNDLEVBQW5CLENBQXNCLFFBQXRCLEVBQStCLFlBQVU7QUFDeENDLFFBQU1DLElBQU47QUFDQSxFQUZEOztBQUlBeEMsR0FBRSxpQkFBRixFQUFxQnlDLE1BQXJCLENBQTRCLFlBQVU7QUFDckNkLFNBQU9lLE1BQVAsQ0FBY0MsS0FBZCxHQUFzQjNDLEVBQUUsSUFBRixFQUFRQyxHQUFSLEVBQXRCO0FBQ0FzQyxRQUFNQyxJQUFOO0FBQ0EsRUFIRDs7QUFLQXhDLEdBQUUsWUFBRixFQUFnQjRDLGVBQWhCLENBQWdDO0FBQy9CLHNCQUFvQixJQURXO0FBRS9CLGdCQUFjLElBRmlCO0FBRy9CLHNCQUFvQixJQUhXO0FBSS9CLFlBQVU7QUFDVCxhQUFVLG9CQUREO0FBRVQsZ0JBQWEsR0FGSjtBQUdULGlCQUFjLElBSEw7QUFJVCxrQkFBZSxJQUpOO0FBS1QsZ0JBQWEsTUFMSjtBQU1ULGNBQVcsSUFORjtBQU9ULHVCQUFvQixRQVBYO0FBUVQsaUJBQWMsQ0FDZCxHQURjLEVBRWQsR0FGYyxFQUdkLEdBSGMsRUFJZCxHQUpjLEVBS2QsR0FMYyxFQU1kLEdBTmMsRUFPZCxHQVBjLENBUkw7QUFpQlQsaUJBQWMsQ0FDZCxJQURjLEVBRWQsSUFGYyxFQUdkLElBSGMsRUFJZCxJQUpjLEVBS2QsSUFMYyxFQU1kLElBTmMsRUFPZCxJQVBjLEVBUWQsSUFSYyxFQVNkLElBVGMsRUFVZCxJQVZjLEVBV2QsS0FYYyxFQVlkLEtBWmMsQ0FqQkw7QUErQlQsZUFBWTtBQS9CSDtBQUpxQixFQUFoQyxFQXFDRSxVQUFTQyxLQUFULEVBQWdCQyxHQUFoQixFQUFxQkMsS0FBckIsRUFBNEI7QUFDN0JwQixTQUFPZSxNQUFQLENBQWNNLE9BQWQsR0FBd0JILE1BQU1JLE1BQU4sQ0FBYSxxQkFBYixDQUF4QjtBQUNBVixRQUFNQyxJQUFOO0FBQ0EsRUF4Q0Q7QUF5Q0F4QyxHQUFFLFlBQUYsRUFBZ0JXLElBQWhCLENBQXFCLGlCQUFyQixFQUF3Q3VDLFlBQXhDLENBQXFEQyxTQUFyRDs7QUFHQW5ELEdBQUUsWUFBRixFQUFnQmEsS0FBaEIsQ0FBc0IsVUFBU0MsQ0FBVCxFQUFXO0FBQ2hDLE1BQUlzQyxhQUFhekMsS0FBSytCLE1BQUwsQ0FBWS9CLEtBQUtZLEdBQWpCLENBQWpCO0FBQ0EsTUFBSVQsRUFBRVcsT0FBRixJQUFhWCxFQUFFWSxNQUFuQixFQUEwQjtBQUN6QixPQUFJOUIsTUFBTSxpQ0FBaUN1QixLQUFLa0MsU0FBTCxDQUFlRCxVQUFmLENBQTNDO0FBQ0E3RCxVQUFPK0QsSUFBUCxDQUFZMUQsR0FBWixFQUFpQixRQUFqQjtBQUNBTCxVQUFPZ0UsS0FBUDtBQUNBLEdBSkQsTUFJSztBQUNKLE9BQUlILFdBQVdJLE1BQVgsR0FBb0IsSUFBeEIsRUFBNkI7QUFDNUJ4RCxNQUFFLFdBQUYsRUFBZVUsV0FBZixDQUEyQixNQUEzQjtBQUNBLElBRkQsTUFFSztBQUNKK0MsdUJBQW1COUMsS0FBSytDLEtBQUwsQ0FBV04sVUFBWCxDQUFuQixFQUEyQyxnQkFBM0MsRUFBNkQsSUFBN0Q7QUFDQTtBQUNEO0FBQ0QsRUFiRDs7QUFlQXBELEdBQUUsV0FBRixFQUFlYSxLQUFmLENBQXFCLFlBQVU7QUFDOUIsTUFBSXVDLGFBQWF6QyxLQUFLK0IsTUFBTCxDQUFZL0IsS0FBS1ksR0FBakIsQ0FBakI7QUFDQSxNQUFJb0MsY0FBY2hELEtBQUsrQyxLQUFMLENBQVdOLFVBQVgsQ0FBbEI7QUFDQXBELElBQUUsWUFBRixFQUFnQkMsR0FBaEIsQ0FBb0JrQixLQUFLa0MsU0FBTCxDQUFlTSxXQUFmLENBQXBCO0FBQ0EsRUFKRDs7QUFNQSxLQUFJQyxhQUFhLENBQWpCO0FBQ0E1RCxHQUFFLEtBQUYsRUFBU2EsS0FBVCxDQUFlLFVBQVNDLENBQVQsRUFBVztBQUN6QjhDO0FBQ0EsTUFBSUEsY0FBYyxDQUFsQixFQUFvQjtBQUNuQjVELEtBQUUsNEJBQUYsRUFBZ0NrQyxRQUFoQyxDQUF5QyxNQUF6QztBQUNBbEMsS0FBRSxZQUFGLEVBQWdCVSxXQUFoQixDQUE0QixNQUE1QjtBQUNBO0FBQ0QsTUFBR0ksRUFBRVcsT0FBRixJQUFhWCxFQUFFWSxNQUFsQixFQUF5QixDQUV4QjtBQUNELEVBVEQ7QUFVQTFCLEdBQUUsWUFBRixFQUFnQnlDLE1BQWhCLENBQXVCLFlBQVc7QUFDakN6QyxJQUFFLFVBQUYsRUFBY1UsV0FBZCxDQUEwQixNQUExQjtBQUNBVixJQUFFLG1CQUFGLEVBQXVCb0MsSUFBdkIsQ0FBNEIsaUNBQTVCO0FBQ0F6QixPQUFLa0QsTUFBTCxDQUFZLEtBQUtDLEtBQUwsQ0FBVyxDQUFYLENBQVo7QUFDQSxFQUpEO0FBS0EsQ0F6S0Q7O0FBMktBLFNBQVNDLFFBQVQsR0FBbUI7QUFDbEJDLE9BQU0sc0NBQU47QUFDQTs7QUFFRCxJQUFJckMsU0FBUztBQUNac0MsUUFBTztBQUNOQyxZQUFVLENBQUMsWUFBRCxFQUFjLGNBQWQsRUFBNkIsU0FBN0IsRUFBdUMsTUFBdkMsRUFBOEMsY0FBOUMsQ0FESjtBQUVOQyxhQUFXLEVBRkw7QUFHTkMsZUFBYSxDQUFDLE9BQUQsRUFBUyxNQUFULEVBQWlCLGNBQWpCLENBSFA7QUFJTkMsZ0JBQWMsRUFKUjtBQUtOQyxRQUFNLEVBTEE7QUFNTnhDLFNBQU8sQ0FBQyxNQUFEO0FBTkQsRUFESztBQVNaeUMsUUFBTztBQUNOTCxZQUFVLEtBREo7QUFFTkMsYUFBVyxLQUZMO0FBR05DLGVBQWEsS0FIUDtBQUlOQyxnQkFBYyxLQUpSO0FBS05DLFFBQU0sS0FMQTtBQU1OeEMsU0FBTztBQU5ELEVBVEs7QUFpQlowQyxhQUFZO0FBQ1hOLFlBQVUsTUFEQztBQUVYQyxhQUFXLE1BRkE7QUFHWEMsZUFBYSxNQUhGO0FBSVhDLGdCQUFjLE1BSkg7QUFLWEMsUUFBTSxNQUxLO0FBTVhHLFNBQU87QUFOSSxFQWpCQTtBQXlCWi9CLFNBQVE7QUFDUGdDLFFBQU0sRUFEQztBQUVQL0IsU0FBTyxLQUZBO0FBR1BLLFdBQVNHO0FBSEYsRUF6Qkk7QUE4Qlp2QixRQUFPLEVBOUJLO0FBK0JaK0MsT0FBTSw0Q0EvQk07QUFnQ1o3QyxRQUFPO0FBaENLLENBQWI7O0FBbUNBLElBQUlmLEtBQUs7QUFDUjZELGFBQVksS0FESjtBQUVSL0MsVUFBUyxpQkFBQ2dELElBQUQsRUFBUTtBQUNoQkMsS0FBR0MsS0FBSCxDQUFTLFVBQVNDLFFBQVQsRUFBbUI7QUFDM0JqRSxNQUFHa0UsUUFBSCxDQUFZRCxRQUFaLEVBQXNCSCxJQUF0QjtBQUNBLEdBRkQsRUFFRyxFQUFDSyxPQUFPdkQsT0FBT2dELElBQWYsRUFBcUJRLGVBQWUsSUFBcEMsRUFGSDtBQUdBLEVBTk87QUFPUkYsV0FBVSxrQkFBQ0QsUUFBRCxFQUFXSCxJQUFYLEVBQWtCO0FBQzNCL0UsVUFBUUMsR0FBUixDQUFZaUYsUUFBWjtBQUNBLE1BQUlBLFNBQVNJLE1BQVQsS0FBb0IsV0FBeEIsRUFBcUM7QUFDcEMsT0FBSUMsVUFBVUwsU0FBU00sWUFBVCxDQUFzQkMsYUFBcEM7QUFDQSxPQUFJVixRQUFRLFVBQVosRUFBdUI7QUFDdEIsUUFBSVEsUUFBUTVFLE9BQVIsQ0FBZ0IsWUFBaEIsS0FBaUMsQ0FBckMsRUFBdUM7QUFDdEMrRSxVQUNDLGlCQURELEVBRUMsbURBRkQsRUFHQyxTQUhELEVBSUdDLElBSkg7QUFLQSxLQU5ELE1BTUs7QUFDSkQsVUFDQyxpQkFERCxFQUVDLGlEQUZELEVBR0MsT0FIRCxFQUlHQyxJQUpIO0FBS0E7QUFDRCxJQWRELE1BY00sSUFBSVosUUFBUSxhQUFaLEVBQTBCO0FBQy9CLFFBQUlRLFFBQVE1RSxPQUFSLENBQWdCLFlBQWhCLElBQWdDLENBQXBDLEVBQXNDO0FBQ3JDK0UsVUFBSztBQUNKRSxhQUFPLGlCQURIO0FBRUpDLFlBQUssK0dBRkQ7QUFHSmQsWUFBTTtBQUhGLE1BQUwsRUFJR1ksSUFKSDtBQUtBLEtBTkQsTUFNSztBQUNKMUUsUUFBRzZELFVBQUgsR0FBZ0IsSUFBaEI7QUFDQWdCLFVBQUs1RCxJQUFMLENBQVU2QyxJQUFWO0FBQ0E7QUFDRCxJQVhLLE1BV0Q7QUFDSixRQUFJUSxRQUFRNUUsT0FBUixDQUFnQixZQUFoQixLQUFpQyxDQUFyQyxFQUF1QztBQUN0Q00sUUFBRzZELFVBQUgsR0FBZ0IsSUFBaEI7QUFDQTtBQUNEZ0IsU0FBSzVELElBQUwsQ0FBVTZDLElBQVY7QUFDQTtBQUNELEdBakNELE1BaUNLO0FBQ0pDLE1BQUdDLEtBQUgsQ0FBUyxVQUFTQyxRQUFULEVBQW1CO0FBQzNCakUsT0FBR2tFLFFBQUgsQ0FBWUQsUUFBWjtBQUNBLElBRkQsRUFFRyxFQUFDRSxPQUFPdkQsT0FBT2dELElBQWYsRUFBcUJRLGVBQWUsSUFBcEMsRUFGSDtBQUdBO0FBQ0QsRUEvQ087QUFnRFJuRSxnQkFBZSx5QkFBSTtBQUNsQjhELEtBQUdDLEtBQUgsQ0FBUyxVQUFTQyxRQUFULEVBQW1CO0FBQzNCakUsTUFBRzhFLGlCQUFILENBQXFCYixRQUFyQjtBQUNBLEdBRkQsRUFFRyxFQUFDRSxPQUFPdkQsT0FBT2dELElBQWYsRUFBcUJRLGVBQWUsSUFBcEMsRUFGSDtBQUdBLEVBcERPO0FBcURSVSxvQkFBbUIsMkJBQUNiLFFBQUQsRUFBWTtBQUM5QixNQUFJQSxTQUFTSSxNQUFULEtBQW9CLFdBQXhCLEVBQXFDO0FBQ3BDLE9BQUlKLFNBQVNNLFlBQVQsQ0FBc0JDLGFBQXRCLENBQW9DOUUsT0FBcEMsQ0FBNEMsWUFBNUMsSUFBNEQsQ0FBaEUsRUFBa0U7QUFDakUrRSxTQUFLO0FBQ0pFLFlBQU8saUJBREg7QUFFSkMsV0FBSywrR0FGRDtBQUdKZCxXQUFNO0FBSEYsS0FBTCxFQUlHWSxJQUpIO0FBS0EsSUFORCxNQU1LO0FBQ0p6RixNQUFFLG9CQUFGLEVBQXdCa0MsUUFBeEIsQ0FBaUMsTUFBakM7QUFDQSxRQUFJakIsUUFBUTtBQUNYQyxjQUFTLGFBREU7QUFFWFAsV0FBTVEsS0FBS0MsS0FBTCxDQUFXcEIsRUFBRSxTQUFGLEVBQWFDLEdBQWIsRUFBWDtBQUZLLEtBQVo7QUFJQVUsU0FBS1ksR0FBTCxHQUFXTixLQUFYO0FBQ0FOLFNBQUthLE1BQUwsQ0FBWWIsS0FBS1ksR0FBakI7QUFDQTtBQUNELEdBaEJELE1BZ0JLO0FBQ0p1RCxNQUFHQyxLQUFILENBQVMsVUFBU0MsUUFBVCxFQUFtQjtBQUMzQmpFLE9BQUc4RSxpQkFBSCxDQUFxQmIsUUFBckI7QUFDQSxJQUZELEVBRUcsRUFBQ0UsT0FBT3ZELE9BQU9nRCxJQUFmLEVBQXFCUSxlQUFlLElBQXBDLEVBRkg7QUFHQTtBQUNEO0FBM0VPLENBQVQ7O0FBOEVBLElBQUl4RSxPQUFPO0FBQ1ZZLE1BQUssRUFESztBQUVWdUUsU0FBUSxFQUZFO0FBR1ZDLFlBQVcsQ0FIRDtBQUlWbkYsWUFBVyxLQUpEO0FBS1ZvQixPQUFNLGdCQUFJO0FBQ1RoQyxJQUFFLGFBQUYsRUFBaUJnRyxTQUFqQixHQUE2QkMsT0FBN0I7QUFDQWpHLElBQUUsWUFBRixFQUFnQmtHLElBQWhCO0FBQ0FsRyxJQUFFLG1CQUFGLEVBQXVCb0MsSUFBdkIsQ0FBNEIsVUFBNUI7QUFDQXpCLE9BQUtvRixTQUFMLEdBQWlCLENBQWpCO0FBQ0FwRixPQUFLWSxHQUFMLEdBQVcsRUFBWDtBQUNBLEVBWFM7QUFZVnNCLFFBQU8sZUFBQytDLElBQUQsRUFBUTtBQUNkNUYsSUFBRSxVQUFGLEVBQWNVLFdBQWQsQ0FBMEIsTUFBMUI7QUFDQUMsT0FBS3dGLEdBQUwsQ0FBU1AsSUFBVCxFQUFlUSxJQUFmLENBQW9CLFVBQUNDLEdBQUQsRUFBTztBQUMxQlQsUUFBS2pGLElBQUwsR0FBWTBGLEdBQVo7QUFDQTFGLFFBQUthLE1BQUwsQ0FBWW9FLElBQVo7QUFDQSxHQUhEO0FBSUEsRUFsQlM7QUFtQlZPLE1BQUssYUFBQ1AsSUFBRCxFQUFRO0FBQ1osU0FBTyxJQUFJVSxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQW1CO0FBQ3JDLE9BQUl2RixRQUFRLEVBQVo7QUFDQSxPQUFJd0YsZ0JBQWdCLEVBQXBCO0FBQ0EsT0FBSXZGLFVBQVUwRSxLQUFLMUUsT0FBbkI7QUFDQSxPQUFJMEUsS0FBS2YsSUFBTCxLQUFjLE9BQWxCLEVBQTJCM0QsVUFBVSxPQUFWO0FBQzNCLE9BQUkwRSxLQUFLZixJQUFMLEtBQWMsT0FBZCxJQUF5QmUsS0FBSzFFLE9BQUwsS0FBaUIsV0FBOUMsRUFBMkQwRSxLQUFLYyxNQUFMLEdBQWNkLEtBQUtlLE1BQW5CO0FBQzNELE9BQUloRixPQUFPRyxLQUFYLEVBQWtCOEQsS0FBSzFFLE9BQUwsR0FBZSxPQUFmO0FBQ2xCcEIsV0FBUUMsR0FBUixDQUFlNEIsT0FBTzZDLFVBQVAsQ0FBa0J0RCxPQUFsQixDQUFmLFNBQTZDMEUsS0FBS2MsTUFBbEQsU0FBNERkLEtBQUsxRSxPQUFqRSxlQUFrRlMsT0FBTzRDLEtBQVAsQ0FBYXFCLEtBQUsxRSxPQUFsQixDQUFsRixnQkFBdUhTLE9BQU9zQyxLQUFQLENBQWEyQixLQUFLMUUsT0FBbEIsRUFBMkIwRixRQUEzQixFQUF2SDtBQUNBOUIsTUFBRytCLEdBQUgsQ0FBVWxGLE9BQU82QyxVQUFQLENBQWtCdEQsT0FBbEIsQ0FBVixTQUF3QzBFLEtBQUtjLE1BQTdDLFNBQXVEZCxLQUFLMUUsT0FBNUQsZUFBNkVTLE9BQU80QyxLQUFQLENBQWFxQixLQUFLMUUsT0FBbEIsQ0FBN0UsZUFBaUhTLE9BQU9DLEtBQXhILGdCQUF3SUQsT0FBT3NDLEtBQVAsQ0FBYTJCLEtBQUsxRSxPQUFsQixFQUEyQjBGLFFBQTNCLEVBQXhJLGlCQUEwTCxVQUFDUCxHQUFELEVBQU87QUFDaE0xRixTQUFLb0YsU0FBTCxJQUFrQk0sSUFBSTFGLElBQUosQ0FBUzZDLE1BQTNCO0FBQ0F4RCxNQUFFLG1CQUFGLEVBQXVCb0MsSUFBdkIsQ0FBNEIsVUFBU3pCLEtBQUtvRixTQUFkLEdBQXlCLFNBQXJEO0FBRmdNO0FBQUE7QUFBQTs7QUFBQTtBQUdoTSwwQkFBYU0sSUFBSTFGLElBQWpCLDhIQUFzQjtBQUFBLFVBQWRtRyxDQUFjOztBQUNyQixVQUFJbEIsS0FBSzFFLE9BQUwsSUFBZ0IsV0FBaEIsSUFBK0JTLE9BQU9HLEtBQTFDLEVBQWdEO0FBQy9DZ0YsU0FBRUMsSUFBRixHQUFTLEVBQUNDLElBQUlGLEVBQUVFLEVBQVAsRUFBV0MsTUFBTUgsRUFBRUcsSUFBbkIsRUFBVDtBQUNBO0FBQ0QsVUFBSXRGLE9BQU9HLEtBQVgsRUFBa0JnRixFQUFFakMsSUFBRixHQUFTLE1BQVQ7QUFDbEIsVUFBSWlDLEVBQUVDLElBQU4sRUFBVztBQUNWOUYsYUFBTWlHLElBQU4sQ0FBV0osQ0FBWDtBQUNBLE9BRkQsTUFFSztBQUNKO0FBQ0FBLFNBQUVDLElBQUYsR0FBUyxFQUFDQyxJQUFJRixFQUFFRSxFQUFQLEVBQVdDLE1BQU1ILEVBQUVFLEVBQW5CLEVBQVQ7QUFDQUYsU0FBRUssWUFBRixHQUFpQkwsRUFBRU0sWUFBbkI7QUFDQW5HLGFBQU1pRyxJQUFOLENBQVdKLENBQVg7QUFDQTtBQUNEO0FBaEIrTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWlCaE0sUUFBSVQsSUFBSTFGLElBQUosQ0FBUzZDLE1BQVQsR0FBa0IsQ0FBbEIsSUFBdUI2QyxJQUFJZ0IsTUFBSixDQUFXQyxJQUF0QyxFQUEyQztBQUMxQ0MsYUFBUWxCLElBQUlnQixNQUFKLENBQVdDLElBQW5CO0FBQ0EsS0FGRCxNQUVLO0FBQ0pmLGFBQVF0RixLQUFSO0FBQ0E7QUFDRCxJQXRCRDs7QUF3QkEsWUFBU3NHLE9BQVQsQ0FBaUIzSCxHQUFqQixFQUE4QjtBQUFBLFFBQVIyRSxLQUFRLHVFQUFGLENBQUU7O0FBQzdCLFFBQUlBLFVBQVUsQ0FBZCxFQUFnQjtBQUNmM0UsV0FBTUEsSUFBSTRILE9BQUosQ0FBWSxXQUFaLEVBQXdCLFdBQVNqRCxLQUFqQyxDQUFOO0FBQ0E7QUFDRHZFLE1BQUV5SCxPQUFGLENBQVU3SCxHQUFWLEVBQWUsVUFBU3lHLEdBQVQsRUFBYTtBQUMzQjFGLFVBQUtvRixTQUFMLElBQWtCTSxJQUFJMUYsSUFBSixDQUFTNkMsTUFBM0I7QUFDQXhELE9BQUUsbUJBQUYsRUFBdUJvQyxJQUF2QixDQUE0QixVQUFTekIsS0FBS29GLFNBQWQsR0FBeUIsU0FBckQ7QUFGMkI7QUFBQTtBQUFBOztBQUFBO0FBRzNCLDRCQUFhTSxJQUFJMUYsSUFBakIsbUlBQXNCO0FBQUEsV0FBZG1HLENBQWM7O0FBQ3JCLFdBQUlBLEVBQUVFLEVBQU4sRUFBUztBQUNSLFlBQUlwQixLQUFLMUUsT0FBTCxJQUFnQixXQUFoQixJQUErQlMsT0FBT0csS0FBMUMsRUFBZ0Q7QUFDL0NnRixXQUFFQyxJQUFGLEdBQVMsRUFBQ0MsSUFBSUYsRUFBRUUsRUFBUCxFQUFXQyxNQUFNSCxFQUFFRyxJQUFuQixFQUFUO0FBQ0E7QUFDRCxZQUFJSCxFQUFFQyxJQUFOLEVBQVc7QUFDVjlGLGVBQU1pRyxJQUFOLENBQVdKLENBQVg7QUFDQSxTQUZELE1BRUs7QUFDSjtBQUNBQSxXQUFFQyxJQUFGLEdBQVMsRUFBQ0MsSUFBSUYsRUFBRUUsRUFBUCxFQUFXQyxNQUFNSCxFQUFFRSxFQUFuQixFQUFUO0FBQ0FGLFdBQUVLLFlBQUYsR0FBaUJMLEVBQUVNLFlBQW5CO0FBQ0FuRyxlQUFNaUcsSUFBTixDQUFXSixDQUFYO0FBQ0E7QUFDRDtBQUNEO0FBakIwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWtCM0IsU0FBSVQsSUFBSTFGLElBQUosQ0FBUzZDLE1BQVQsR0FBa0IsQ0FBbEIsSUFBdUI2QyxJQUFJZ0IsTUFBSixDQUFXQyxJQUF0QyxFQUEyQztBQUMxQ0MsY0FBUWxCLElBQUlnQixNQUFKLENBQVdDLElBQW5CO0FBQ0EsTUFGRCxNQUVLO0FBQ0pmLGNBQVF0RixLQUFSO0FBQ0E7QUFDRCxLQXZCRCxFQXVCR3lHLElBdkJILENBdUJRLFlBQUk7QUFDWEgsYUFBUTNILEdBQVIsRUFBYSxHQUFiO0FBQ0EsS0F6QkQ7QUEwQkE7QUFDRCxHQS9ETSxDQUFQO0FBZ0VBLEVBcEZTO0FBcUZWNEIsU0FBUSxnQkFBQ29FLElBQUQsRUFBUTtBQUNmNUYsSUFBRSxVQUFGLEVBQWNrQyxRQUFkLENBQXVCLE1BQXZCO0FBQ0FsQyxJQUFFLGFBQUYsRUFBaUJVLFdBQWpCLENBQTZCLE1BQTdCO0FBQ0FWLElBQUUsMkJBQUYsRUFBK0IySCxPQUEvQjtBQUNBM0gsSUFBRSxjQUFGLEVBQWtCNEgsU0FBbEI7QUFDQXBDLE9BQUssS0FBTCxFQUFZLE9BQVosRUFBcUIsU0FBckIsRUFBZ0NDLElBQWhDO0FBQ0E5RSxPQUFLWSxHQUFMLEdBQVdxRSxJQUFYO0FBQ0FqRixPQUFLK0IsTUFBTCxDQUFZL0IsS0FBS1ksR0FBakIsRUFBc0IsSUFBdEI7QUFDQXNHLEtBQUdDLEtBQUg7QUFDQSxFQTlGUztBQStGVnBGLFNBQVEsZ0JBQUNxRixPQUFELEVBQTZCO0FBQUEsTUFBbkJDLFFBQW1CLHVFQUFSLEtBQVE7O0FBQ3BDLE1BQUlDLGNBQWNqSSxFQUFFLFNBQUYsRUFBYWtJLElBQWIsQ0FBa0IsU0FBbEIsQ0FBbEI7QUFDQSxNQUFJQyxRQUFRbkksRUFBRSxNQUFGLEVBQVVrSSxJQUFWLENBQWUsU0FBZixDQUFaO0FBQ0EsTUFBSUUsVUFBVTFGLFFBQU8yRixXQUFQLGlCQUFtQk4sT0FBbkIsRUFBNEJFLFdBQTVCLEVBQXlDRSxLQUF6Qyw0QkFBbURHLFVBQVUzRyxPQUFPZSxNQUFqQixDQUFuRCxHQUFkO0FBQ0FxRixVQUFRUSxRQUFSLEdBQW1CSCxPQUFuQjtBQUNBLE1BQUlKLGFBQWEsSUFBakIsRUFBc0I7QUFDckJ6RixTQUFNeUYsUUFBTixDQUFlRCxPQUFmO0FBQ0EsR0FGRCxNQUVLO0FBQ0osVUFBT0EsT0FBUDtBQUNBO0FBQ0QsRUF6R1M7QUEwR1ZyRSxRQUFPLGVBQUNuQyxHQUFELEVBQU87QUFDYixNQUFJaUgsU0FBUyxFQUFiO0FBQ0EsTUFBSTdILEtBQUtDLFNBQVQsRUFBbUI7QUFDbEJaLEtBQUV5SSxJQUFGLENBQU9sSCxJQUFJWixJQUFYLEVBQWdCLFVBQVMrSCxDQUFULEVBQVc7QUFDMUIsUUFBSUMsTUFBTTtBQUNULFdBQU1ELElBQUUsQ0FEQztBQUVULGFBQVMsNkJBQTZCLEtBQUszQixJQUFMLENBQVVDLEVBRnZDO0FBR1QsV0FBTyxLQUFLRCxJQUFMLENBQVVFLElBSFI7QUFJVCxhQUFTLEtBQUsyQixRQUpMO0FBS1QsYUFBUyxLQUFLQyxLQUxMO0FBTVQsY0FBVSxLQUFLQztBQU5OLEtBQVY7QUFRQU4sV0FBT3RCLElBQVAsQ0FBWXlCLEdBQVo7QUFDQSxJQVZEO0FBV0EsR0FaRCxNQVlLO0FBQ0ozSSxLQUFFeUksSUFBRixDQUFPbEgsSUFBSVosSUFBWCxFQUFnQixVQUFTK0gsQ0FBVCxFQUFXO0FBQzFCLFFBQUlDLE1BQU07QUFDVCxXQUFNRCxJQUFFLENBREM7QUFFVCxhQUFTLDZCQUE2QixLQUFLM0IsSUFBTCxDQUFVQyxFQUZ2QztBQUdULFdBQU8sS0FBS0QsSUFBTCxDQUFVRSxJQUhSO0FBSVQsV0FBTyxLQUFLcEMsSUFBTCxJQUFhLEVBSlg7QUFLVCxhQUFTLEtBQUtrRSxPQUFMLElBQWdCLEtBQUtGLEtBTHJCO0FBTVQsYUFBU0csY0FBYyxLQUFLN0IsWUFBbkI7QUFOQSxLQUFWO0FBUUFxQixXQUFPdEIsSUFBUCxDQUFZeUIsR0FBWjtBQUNBLElBVkQ7QUFXQTtBQUNELFNBQU9ILE1BQVA7QUFDQSxFQXRJUztBQXVJVjNFLFNBQVEsaUJBQUNvRixJQUFELEVBQVE7QUFDZixNQUFJQyxTQUFTLElBQUlDLFVBQUosRUFBYjs7QUFFQUQsU0FBT0UsTUFBUCxHQUFnQixVQUFTQyxLQUFULEVBQWdCO0FBQy9CLE9BQUlDLE1BQU1ELE1BQU1FLE1BQU4sQ0FBYUMsTUFBdkI7QUFDQTdJLFFBQUtZLEdBQUwsR0FBV0osS0FBS0MsS0FBTCxDQUFXa0ksR0FBWCxDQUFYO0FBQ0EzSSxRQUFLYSxNQUFMLENBQVliLEtBQUtZLEdBQWpCO0FBQ0EsR0FKRDs7QUFNQTJILFNBQU9PLFVBQVAsQ0FBa0JSLElBQWxCO0FBQ0E7QUFqSlMsQ0FBWDs7QUFvSkEsSUFBSTFHLFFBQVE7QUFDWHlGLFdBQVUsa0JBQUMwQixPQUFELEVBQVc7QUFDcEIxSixJQUFFLGFBQUYsRUFBaUJnRyxTQUFqQixHQUE2QkMsT0FBN0I7QUFDQSxNQUFJMEQsYUFBYUQsUUFBUW5CLFFBQXpCO0FBQ0EsTUFBSXFCLFFBQVEsRUFBWjtBQUNBLE1BQUlDLFFBQVEsRUFBWjtBQUNBLE1BQUlDLE1BQU05SixFQUFFLFVBQUYsRUFBY2tJLElBQWQsQ0FBbUIsU0FBbkIsQ0FBVjtBQUNBLE1BQUd3QixRQUFReEksT0FBUixLQUFvQixXQUFwQixJQUFtQ1MsT0FBT0csS0FBN0MsRUFBbUQ7QUFDbEQ4SDtBQUdBLEdBSkQsTUFJTSxJQUFHRixRQUFReEksT0FBUixLQUFvQixhQUF2QixFQUFxQztBQUMxQzBJO0FBSUEsR0FMSyxNQUtBLElBQUdGLFFBQVF4SSxPQUFSLEtBQW9CLFFBQXZCLEVBQWdDO0FBQ3JDMEk7QUFHQSxHQUpLLE1BSUQ7QUFDSkE7QUFLQTs7QUFFRCxNQUFJRyxPQUFPLDBCQUFYO0FBQ0EsTUFBSXBKLEtBQUtZLEdBQUwsQ0FBU3NELElBQVQsS0FBa0IsY0FBdEIsRUFBc0NrRixPQUFPL0osRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsS0FBNEIsaUJBQW5DOztBQTVCbEI7QUFBQTtBQUFBOztBQUFBO0FBOEJwQix5QkFBb0IwSixXQUFXSyxPQUFYLEVBQXBCLG1JQUF5QztBQUFBO0FBQUEsUUFBaENDLENBQWdDO0FBQUEsUUFBN0JoSyxHQUE2Qjs7QUFDeEMsUUFBSWlLLFVBQVUsRUFBZDtBQUNBLFFBQUlKLEdBQUosRUFBUTtBQUNQSSx5REFBaURqSyxJQUFJOEcsSUFBSixDQUFTQyxFQUExRDtBQUNBO0FBQ0QsUUFBSW1ELGVBQVlGLElBQUUsQ0FBZCwyREFDbUNoSyxJQUFJOEcsSUFBSixDQUFTQyxFQUQ1Qyw0QkFDbUVrRCxPQURuRSxHQUM2RWpLLElBQUk4RyxJQUFKLENBQVNFLElBRHRGLGNBQUo7QUFFQSxRQUFHeUMsUUFBUXhJLE9BQVIsS0FBb0IsV0FBcEIsSUFBbUNTLE9BQU9HLEtBQTdDLEVBQW1EO0FBQ2xEcUkseURBQStDbEssSUFBSTRFLElBQW5ELGtCQUFtRTVFLElBQUk0RSxJQUF2RTtBQUNBLEtBRkQsTUFFTSxJQUFHNkUsUUFBUXhJLE9BQVIsS0FBb0IsYUFBdkIsRUFBcUM7QUFDMUNpSiw0RUFBa0VsSyxJQUFJK0csRUFBdEUsNkJBQTZGL0csSUFBSTRJLEtBQWpHLGdEQUNxQkcsY0FBYy9JLElBQUlrSCxZQUFsQixDQURyQjtBQUVBLEtBSEssTUFHQSxJQUFHdUMsUUFBUXhJLE9BQVIsS0FBb0IsUUFBdkIsRUFBZ0M7QUFDckNpSixvQkFBWUYsSUFBRSxDQUFkLGlFQUMwQ2hLLElBQUk4RyxJQUFKLENBQVNDLEVBRG5ELDRCQUMwRS9HLElBQUk4RyxJQUFKLENBQVNFLElBRG5GLG1DQUVTaEgsSUFBSW1LLEtBRmI7QUFHQSxLQUpLLE1BSUQ7QUFDSkQsb0RBQTBDSixJQUExQyxHQUFpRDlKLElBQUkrRyxFQUFyRCw2QkFBNEUvRyxJQUFJOEksT0FBaEYsK0JBQ005SSxJQUFJNkksVUFEViw0Q0FFcUJFLGNBQWMvSSxJQUFJa0gsWUFBbEIsQ0FGckI7QUFHQTtBQUNELFFBQUlrRCxjQUFZRixFQUFaLFVBQUo7QUFDQU4sYUFBU1EsRUFBVDtBQUNBO0FBckRtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQXNEcEIsTUFBSUMsMENBQXNDVixLQUF0Qyw0QkFBa0VDLEtBQWxFLGFBQUo7QUFDQTdKLElBQUUsYUFBRixFQUFpQjJGLElBQWpCLENBQXNCLEVBQXRCLEVBQTBCekYsTUFBMUIsQ0FBaUNvSyxNQUFqQzs7QUFHQUM7O0FBRUEsV0FBU0EsTUFBVCxHQUFpQjtBQUNoQjdLLFdBQVFNLEVBQUUsYUFBRixFQUFpQmdHLFNBQWpCLENBQTJCO0FBQ2xDLGtCQUFjLElBRG9CO0FBRWxDLGlCQUFhLElBRnFCO0FBR2xDLG9CQUFnQjtBQUhrQixJQUEzQixDQUFSOztBQU1BaEcsS0FBRSxhQUFGLEVBQWlCc0MsRUFBakIsQ0FBcUIsbUJBQXJCLEVBQTBDLFlBQVk7QUFDckQ1QyxVQUNDOEssT0FERCxDQUNTLENBRFQsRUFFQ2hLLE1BRkQsQ0FFUSxLQUFLaUssS0FGYixFQUdDQyxJQUhEO0FBSUEsSUFMRDtBQU1BMUssS0FBRSxnQkFBRixFQUFvQnNDLEVBQXBCLENBQXdCLG1CQUF4QixFQUE2QyxZQUFZO0FBQ3hENUMsVUFDQzhLLE9BREQsQ0FDUyxDQURULEVBRUNoSyxNQUZELENBRVEsS0FBS2lLLEtBRmIsRUFHQ0MsSUFIRDtBQUlBL0ksV0FBT2UsTUFBUCxDQUFjZ0MsSUFBZCxHQUFxQixLQUFLK0YsS0FBMUI7QUFDQSxJQU5EO0FBT0E7QUFDRCxFQWxGVTtBQW1GWGpJLE9BQU0sZ0JBQUk7QUFDVDdCLE9BQUsrQixNQUFMLENBQVkvQixLQUFLWSxHQUFqQixFQUFzQixJQUF0QjtBQUNBO0FBckZVLENBQVo7O0FBd0ZBLElBQUlRLFNBQVM7QUFDWnBCLE9BQU0sRUFETTtBQUVaZ0ssUUFBTyxFQUZLO0FBR1pDLE1BQUssQ0FITztBQUlaQyxTQUFRLEtBSkk7QUFLWkMsT0FBTSxFQUxNO0FBTVo5SSxPQUFNLGdCQUFJO0FBQ1QsTUFBSTRILFFBQVE1SixFQUFFLG1CQUFGLEVBQXVCMkYsSUFBdkIsRUFBWjtBQUNBM0YsSUFBRSx3QkFBRixFQUE0QjJGLElBQTVCLENBQWlDaUUsS0FBakM7QUFDQTVKLElBQUUsd0JBQUYsRUFBNEIyRixJQUE1QixDQUFpQyxFQUFqQztBQUNBNUQsU0FBT3BCLElBQVAsR0FBY0EsS0FBSytCLE1BQUwsQ0FBWS9CLEtBQUtZLEdBQWpCLENBQWQ7QUFDQVEsU0FBTzRJLEtBQVAsR0FBZSxFQUFmO0FBQ0E1SSxTQUFPK0ksSUFBUCxHQUFjLEVBQWQ7QUFDQS9JLFNBQU82SSxHQUFQLEdBQWEsQ0FBYjtBQUNBLE1BQUc1SyxFQUFFLGdCQUFGLEVBQW9CQyxHQUFwQixNQUE2QixFQUFoQyxFQUFtQztBQUNsQ3NDLFNBQU1DLElBQU47QUFDQTtBQUNELE1BQUl4QyxFQUFFLFlBQUYsRUFBZ0JpQyxRQUFoQixDQUF5QixRQUF6QixDQUFKLEVBQXVDO0FBQ3RDRixVQUFPOEksTUFBUCxHQUFnQixJQUFoQjtBQUNBN0ssS0FBRSxxQkFBRixFQUF5QnlJLElBQXpCLENBQThCLFlBQVU7QUFDdkMsUUFBSXNDLElBQUlDLFNBQVNoTCxFQUFFLElBQUYsRUFBUWlMLElBQVIsQ0FBYSxzQkFBYixFQUFxQ2hMLEdBQXJDLEVBQVQsQ0FBUjtBQUNBLFFBQUlpTCxJQUFJbEwsRUFBRSxJQUFGLEVBQVFpTCxJQUFSLENBQWEsb0JBQWIsRUFBbUNoTCxHQUFuQyxFQUFSO0FBQ0EsUUFBSThLLElBQUksQ0FBUixFQUFVO0FBQ1RoSixZQUFPNkksR0FBUCxJQUFjSSxTQUFTRCxDQUFULENBQWQ7QUFDQWhKLFlBQU8rSSxJQUFQLENBQVk1RCxJQUFaLENBQWlCLEVBQUMsUUFBT2dFLENBQVIsRUFBVyxPQUFPSCxDQUFsQixFQUFqQjtBQUNBO0FBQ0QsSUFQRDtBQVFBLEdBVkQsTUFVSztBQUNKaEosVUFBTzZJLEdBQVAsR0FBYTVLLEVBQUUsVUFBRixFQUFjQyxHQUFkLEVBQWI7QUFDQTtBQUNEOEIsU0FBT29KLEVBQVA7QUFDQSxFQS9CVztBQWdDWkEsS0FBSSxjQUFJO0FBQ1BwSixTQUFPNEksS0FBUCxHQUFlUyxlQUFlckosT0FBT3BCLElBQVAsQ0FBWTRILFFBQVosQ0FBcUIvRSxNQUFwQyxFQUE0QzZILE1BQTVDLENBQW1ELENBQW5ELEVBQXFEdEosT0FBTzZJLEdBQTVELENBQWY7QUFDQSxNQUFJTixTQUFTLEVBQWI7QUFDQXZJLFNBQU80SSxLQUFQLENBQWFXLEdBQWIsQ0FBaUIsVUFBQ3JMLEdBQUQsRUFBTXNMLEtBQU4sRUFBYztBQUM5QmpCLGFBQVUsa0JBQWdCaUIsUUFBTSxDQUF0QixJQUF5QixLQUF6QixHQUFpQ3ZMLEVBQUUsYUFBRixFQUFpQmdHLFNBQWpCLEdBQTZCd0YsSUFBN0IsQ0FBa0MsRUFBQ2hMLFFBQU8sU0FBUixFQUFsQyxFQUFzRGlMLEtBQXRELEdBQThEeEwsR0FBOUQsRUFBbUV5TCxTQUFwRyxHQUFnSCxPQUExSDtBQUNBLEdBRkQ7QUFHQTFMLElBQUUsd0JBQUYsRUFBNEIyRixJQUE1QixDQUFpQzJFLE1BQWpDO0FBQ0F0SyxJQUFFLDJCQUFGLEVBQStCa0MsUUFBL0IsQ0FBd0MsU0FBeEM7O0FBRUEsTUFBR0gsT0FBTzhJLE1BQVYsRUFBaUI7QUFDaEIsT0FBSWMsTUFBTSxDQUFWO0FBQ0EsUUFBSSxJQUFJQyxDQUFSLElBQWE3SixPQUFPK0ksSUFBcEIsRUFBeUI7QUFDeEIsUUFBSWUsTUFBTTdMLEVBQUUscUJBQUYsRUFBeUI4TCxFQUF6QixDQUE0QkgsR0FBNUIsQ0FBVjtBQUNBM0wsd0VBQStDK0IsT0FBTytJLElBQVAsQ0FBWWMsQ0FBWixFQUFlM0UsSUFBOUQsc0JBQThFbEYsT0FBTytJLElBQVAsQ0FBWWMsQ0FBWixFQUFlaEIsR0FBN0YsK0JBQXVIbUIsWUFBdkgsQ0FBb0lGLEdBQXBJO0FBQ0FGLFdBQVE1SixPQUFPK0ksSUFBUCxDQUFZYyxDQUFaLEVBQWVoQixHQUFmLEdBQXFCLENBQTdCO0FBQ0E7QUFDRDVLLEtBQUUsWUFBRixFQUFnQlUsV0FBaEIsQ0FBNEIsUUFBNUI7QUFDQVYsS0FBRSxXQUFGLEVBQWVVLFdBQWYsQ0FBMkIsU0FBM0I7QUFDQVYsS0FBRSxjQUFGLEVBQWtCVSxXQUFsQixDQUE4QixRQUE5QjtBQUNBO0FBQ0RWLElBQUUsWUFBRixFQUFnQkcsTUFBaEIsQ0FBdUIsSUFBdkI7QUFDQSxFQXJEVztBQXNEWjZMLGdCQUFlLHlCQUFJO0FBQ2xCLE1BQUlDLEtBQUssRUFBVDtBQUNBLE1BQUlDLFNBQVMsRUFBYjtBQUNBbE0sSUFBRSxxQkFBRixFQUF5QnlJLElBQXpCLENBQThCLFVBQVM4QyxLQUFULEVBQWdCdEwsR0FBaEIsRUFBb0I7QUFDakQsT0FBSTBLLFFBQVEsRUFBWjtBQUNBLE9BQUkxSyxJQUFJa00sWUFBSixDQUFpQixPQUFqQixDQUFKLEVBQThCO0FBQzdCeEIsVUFBTXlCLFVBQU4sR0FBbUIsS0FBbkI7QUFDQXpCLFVBQU0xRCxJQUFOLEdBQWFqSCxFQUFFQyxHQUFGLEVBQU9nTCxJQUFQLENBQVksSUFBWixFQUFrQmEsRUFBbEIsQ0FBcUIsQ0FBckIsRUFBd0JiLElBQXhCLENBQTZCLEdBQTdCLEVBQWtDN0ksSUFBbEMsRUFBYjtBQUNBdUksVUFBTTdFLE1BQU4sR0FBZTlGLEVBQUVDLEdBQUYsRUFBT2dMLElBQVAsQ0FBWSxJQUFaLEVBQWtCYSxFQUFsQixDQUFxQixDQUFyQixFQUF3QmIsSUFBeEIsQ0FBNkIsR0FBN0IsRUFBa0NvQixJQUFsQyxDQUF1QyxNQUF2QyxFQUErQzdFLE9BQS9DLENBQXVELDBCQUF2RCxFQUFrRixFQUFsRixDQUFmO0FBQ0FtRCxVQUFNNUIsT0FBTixHQUFnQi9JLEVBQUVDLEdBQUYsRUFBT2dMLElBQVAsQ0FBWSxJQUFaLEVBQWtCYSxFQUFsQixDQUFxQixDQUFyQixFQUF3QmIsSUFBeEIsQ0FBNkIsR0FBN0IsRUFBa0M3SSxJQUFsQyxFQUFoQjtBQUNBdUksVUFBTTJCLElBQU4sR0FBYXRNLEVBQUVDLEdBQUYsRUFBT2dMLElBQVAsQ0FBWSxJQUFaLEVBQWtCYSxFQUFsQixDQUFxQixDQUFyQixFQUF3QmIsSUFBeEIsQ0FBNkIsR0FBN0IsRUFBa0NvQixJQUFsQyxDQUF1QyxNQUF2QyxDQUFiO0FBQ0ExQixVQUFNNEIsSUFBTixHQUFhdk0sRUFBRUMsR0FBRixFQUFPZ0wsSUFBUCxDQUFZLElBQVosRUFBa0JhLEVBQWxCLENBQXFCOUwsRUFBRUMsR0FBRixFQUFPZ0wsSUFBUCxDQUFZLElBQVosRUFBa0J6SCxNQUFsQixHQUF5QixDQUE5QyxFQUFpRHBCLElBQWpELEVBQWI7QUFDQSxJQVBELE1BT0s7QUFDSnVJLFVBQU15QixVQUFOLEdBQW1CLElBQW5CO0FBQ0F6QixVQUFNMUQsSUFBTixHQUFhakgsRUFBRUMsR0FBRixFQUFPZ0wsSUFBUCxDQUFZLElBQVosRUFBa0I3SSxJQUFsQixFQUFiO0FBQ0E7QUFDRDhKLFVBQU9oRixJQUFQLENBQVl5RCxLQUFaO0FBQ0EsR0FkRDtBQUhrQjtBQUFBO0FBQUE7O0FBQUE7QUFrQmxCLHlCQUFhdUIsTUFBYixtSUFBb0I7QUFBQSxRQUFaeEQsQ0FBWTs7QUFDbkIsUUFBSUEsRUFBRTBELFVBQUYsS0FBaUIsSUFBckIsRUFBMEI7QUFDekJILHdDQUErQnZELEVBQUV6QixJQUFqQztBQUNBLEtBRkQsTUFFSztBQUNKZ0YsaUVBQ29DdkQsRUFBRTVDLE1BRHRDLGtFQUNxRzRDLEVBQUU1QyxNQUR2Ryx3SUFHb0Q0QyxFQUFFNUMsTUFIdEQsNkJBR2lGNEMsRUFBRXpCLElBSG5GLHlEQUk4QnlCLEVBQUU0RCxJQUpoQyw2QkFJeUQ1RCxFQUFFSyxPQUozRCxzREFLMkJMLEVBQUU0RCxJQUw3Qiw2QkFLc0Q1RCxFQUFFNkQsSUFMeEQ7QUFRQTtBQUNEO0FBL0JpQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWdDbEJ2TSxJQUFFLGVBQUYsRUFBbUJFLE1BQW5CLENBQTBCK0wsRUFBMUI7QUFDQWpNLElBQUUsWUFBRixFQUFnQmtDLFFBQWhCLENBQXlCLE1BQXpCO0FBQ0EsRUF4Rlc7QUF5RlpzSyxrQkFBaUIsMkJBQUk7QUFDcEJ4TSxJQUFFLFlBQUYsRUFBZ0JVLFdBQWhCLENBQTRCLE1BQTVCO0FBQ0FWLElBQUUsZUFBRixFQUFtQnlNLEtBQW5CO0FBQ0E7QUE1RlcsQ0FBYjs7QUErRkEsSUFBSTdHLE9BQU87QUFDVkEsT0FBTSxFQURJO0FBRVY1RCxPQUFNLGNBQUM2QyxJQUFELEVBQVE7QUFDYmUsT0FBS0EsSUFBTCxHQUFZLEVBQVo7QUFDQWpGLE9BQUtxQixJQUFMO0FBQ0E4QyxLQUFHK0IsR0FBSCxDQUFPLEtBQVAsRUFBYSxVQUFTUixHQUFULEVBQWE7QUFDekIxRixRQUFLbUYsTUFBTCxHQUFjTyxJQUFJVyxFQUFsQjtBQUNBLE9BQUlwSCxNQUFNZ0csS0FBSzNDLE1BQUwsQ0FBWWpELEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQVosQ0FBVjtBQUNBLE9BQUlMLElBQUlhLE9BQUosQ0FBWSxPQUFaLE1BQXlCLENBQUMsQ0FBMUIsSUFBK0JiLElBQUlhLE9BQUosQ0FBWSxHQUFaLElBQW1CLENBQXRELEVBQXdEO0FBQ3ZEYixVQUFNQSxJQUFJOE0sU0FBSixDQUFjLENBQWQsRUFBaUI5TSxJQUFJYSxPQUFKLENBQVksR0FBWixDQUFqQixDQUFOO0FBQ0E7QUFDRG1GLFFBQUtPLEdBQUwsQ0FBU3ZHLEdBQVQsRUFBY2lGLElBQWQsRUFBb0J1QixJQUFwQixDQUF5QixVQUFDUixJQUFELEVBQVE7QUFDaENqRixTQUFLa0MsS0FBTCxDQUFXK0MsSUFBWDtBQUNBLElBRkQ7QUFHQTtBQUNBLEdBVkQ7QUFXQSxFQWhCUztBQWlCVk8sTUFBSyxhQUFDdkcsR0FBRCxFQUFNaUYsSUFBTixFQUFhO0FBQ2pCLFNBQU8sSUFBSXlCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBbUI7QUFDckMsT0FBSTNCLFFBQVEsY0FBWixFQUEyQjtBQUMxQixRQUFJOEgsVUFBVS9NLEdBQWQ7QUFDQSxRQUFJK00sUUFBUWxNLE9BQVIsQ0FBZ0IsR0FBaEIsSUFBdUIsQ0FBM0IsRUFBNkI7QUFDNUJrTSxlQUFVQSxRQUFRRCxTQUFSLENBQWtCLENBQWxCLEVBQW9CQyxRQUFRbE0sT0FBUixDQUFnQixHQUFoQixDQUFwQixDQUFWO0FBQ0E7QUFDRHFFLE9BQUcrQixHQUFILE9BQVc4RixPQUFYLEVBQXFCLFVBQVN0RyxHQUFULEVBQWE7QUFDakMsU0FBSXVHLE1BQU0sRUFBQ2xHLFFBQVFMLElBQUl3RyxTQUFKLENBQWM3RixFQUF2QixFQUEyQm5DLE1BQU1BLElBQWpDLEVBQXVDM0QsU0FBUyxVQUFoRCxFQUFWO0FBQ0FTLFlBQU80QyxLQUFQLENBQWEsVUFBYixJQUEyQixJQUEzQjtBQUNBNUMsWUFBT0MsS0FBUCxHQUFlLEVBQWY7QUFDQTJFLGFBQVFxRyxHQUFSO0FBQ0EsS0FMRDtBQU1BLElBWEQsTUFXSztBQUNKLFFBQUlFLFFBQVEsU0FBWjtBQUNBLFFBQUlDLFNBQVNuTixJQUFJb04sTUFBSixDQUFXcE4sSUFBSWEsT0FBSixDQUFZLEdBQVosRUFBZ0IsRUFBaEIsSUFBb0IsQ0FBL0IsRUFBaUMsR0FBakMsQ0FBYjtBQUNBO0FBQ0EsUUFBSStJLFNBQVN1RCxPQUFPRSxLQUFQLENBQWFILEtBQWIsQ0FBYjtBQUNBLFFBQUlJLFVBQVV0SCxLQUFLdUgsU0FBTCxDQUFldk4sR0FBZixDQUFkO0FBQ0FnRyxTQUFLd0gsV0FBTCxDQUFpQnhOLEdBQWpCLEVBQXNCc04sT0FBdEIsRUFBK0I5RyxJQUEvQixDQUFvQyxVQUFDWSxFQUFELEVBQU07QUFDekMsU0FBSUEsT0FBTyxVQUFYLEVBQXNCO0FBQ3JCa0csZ0JBQVUsVUFBVjtBQUNBbEcsV0FBS3JHLEtBQUttRixNQUFWO0FBQ0E7QUFDRCxTQUFJOEcsTUFBTSxFQUFDUyxRQUFRckcsRUFBVCxFQUFhbkMsTUFBTXFJLE9BQW5CLEVBQTRCaE0sU0FBUzJELElBQXJDLEVBQVY7QUFDQSxTQUFJcUksWUFBWSxVQUFoQixFQUEyQjtBQUMxQixVQUFJckssUUFBUWpELElBQUlhLE9BQUosQ0FBWSxPQUFaLENBQVo7QUFDQSxVQUFHb0MsU0FBUyxDQUFaLEVBQWM7QUFDYixXQUFJQyxNQUFNbEQsSUFBSWEsT0FBSixDQUFZLEdBQVosRUFBZ0JvQyxLQUFoQixDQUFWO0FBQ0ErSixXQUFJakcsTUFBSixHQUFhL0csSUFBSThNLFNBQUosQ0FBYzdKLFFBQU0sQ0FBcEIsRUFBc0JDLEdBQXRCLENBQWI7QUFDQSxPQUhELE1BR0s7QUFDSixXQUFJRCxTQUFRakQsSUFBSWEsT0FBSixDQUFZLFFBQVosQ0FBWjtBQUNBbU0sV0FBSWpHLE1BQUosR0FBYS9HLElBQUk4TSxTQUFKLENBQWM3SixTQUFNLENBQXBCLEVBQXNCakQsSUFBSTRELE1BQTFCLENBQWI7QUFDQTtBQUNELFVBQUk4SixRQUFRMU4sSUFBSWEsT0FBSixDQUFZLFNBQVosQ0FBWjtBQUNBLFVBQUk2TSxTQUFTLENBQWIsRUFBZTtBQUNkVixXQUFJakcsTUFBSixHQUFhNkMsT0FBTyxDQUFQLENBQWI7QUFDQTtBQUNEb0QsVUFBSWxHLE1BQUosR0FBYWtHLElBQUlTLE1BQUosR0FBYSxHQUFiLEdBQW1CVCxJQUFJakcsTUFBcEM7QUFDQUosY0FBUXFHLEdBQVI7QUFDQSxNQWZELE1BZU0sSUFBSU0sWUFBWSxNQUFoQixFQUF1QjtBQUM1Qk4sVUFBSWxHLE1BQUosR0FBYTlHLElBQUk0SCxPQUFKLENBQVksS0FBWixFQUFrQixFQUFsQixDQUFiO0FBQ0FqQixjQUFRcUcsR0FBUjtBQUNBLE1BSEssTUFHRDtBQUNKLFVBQUlNLFlBQVksT0FBaEIsRUFBd0I7QUFDdkIsV0FBSTFELE9BQU9oRyxNQUFQLElBQWlCLENBQXJCLEVBQXVCO0FBQ3RCO0FBQ0FvSixZQUFJMUwsT0FBSixHQUFjLE1BQWQ7QUFDQTBMLFlBQUlsRyxNQUFKLEdBQWE4QyxPQUFPLENBQVAsQ0FBYjtBQUNBakQsZ0JBQVFxRyxHQUFSO0FBQ0EsUUFMRCxNQUtLO0FBQ0o7QUFDQUEsWUFBSWxHLE1BQUosR0FBYThDLE9BQU8sQ0FBUCxDQUFiO0FBQ0FqRCxnQkFBUXFHLEdBQVI7QUFDQTtBQUNELE9BWEQsTUFXTSxJQUFJTSxZQUFZLE9BQWhCLEVBQXdCO0FBQzdCLFdBQUluTSxHQUFHNkQsVUFBUCxFQUFrQjtBQUNqQmdJLFlBQUlqRyxNQUFKLEdBQWE2QyxPQUFPQSxPQUFPaEcsTUFBUCxHQUFjLENBQXJCLENBQWI7QUFDQW9KLFlBQUlTLE1BQUosR0FBYTdELE9BQU8sQ0FBUCxDQUFiO0FBQ0FvRCxZQUFJbEcsTUFBSixHQUFha0csSUFBSVMsTUFBSixHQUFhLEdBQWIsR0FBa0JULElBQUlqRyxNQUFuQztBQUNBSixnQkFBUXFHLEdBQVI7QUFDQSxRQUxELE1BS0s7QUFDSnBILGFBQUs7QUFDSkUsZ0JBQU8saUJBREg7QUFFSkMsZUFBSywrR0FGRDtBQUdKZCxlQUFNO0FBSEYsU0FBTCxFQUlHWSxJQUpIO0FBS0E7QUFDRCxPQWJLLE1BYUEsSUFBSXlILFlBQVksT0FBaEIsRUFBd0I7QUFDN0IsV0FBSUosU0FBUSxTQUFaO0FBQ0EsV0FBSXRELFVBQVM1SixJQUFJcU4sS0FBSixDQUFVSCxNQUFWLENBQWI7QUFDQUYsV0FBSWpHLE1BQUosR0FBYTZDLFFBQU9BLFFBQU9oRyxNQUFQLEdBQWMsQ0FBckIsQ0FBYjtBQUNBb0osV0FBSWxHLE1BQUosR0FBYWtHLElBQUlTLE1BQUosR0FBYSxHQUFiLEdBQW1CVCxJQUFJakcsTUFBcEM7QUFDQUosZUFBUXFHLEdBQVI7QUFDQSxPQU5LLE1BTUQ7QUFDSixXQUFJcEQsT0FBT2hHLE1BQVAsSUFBaUIsQ0FBakIsSUFBc0JnRyxPQUFPaEcsTUFBUCxJQUFpQixDQUEzQyxFQUE2QztBQUM1Q29KLFlBQUlqRyxNQUFKLEdBQWE2QyxPQUFPLENBQVAsQ0FBYjtBQUNBb0QsWUFBSWxHLE1BQUosR0FBYWtHLElBQUlTLE1BQUosR0FBYSxHQUFiLEdBQW1CVCxJQUFJakcsTUFBcEM7QUFDQUosZ0JBQVFxRyxHQUFSO0FBQ0EsUUFKRCxNQUlLO0FBQ0osWUFBSU0sWUFBWSxRQUFoQixFQUF5QjtBQUN4Qk4sYUFBSWpHLE1BQUosR0FBYTZDLE9BQU8sQ0FBUCxDQUFiO0FBQ0FvRCxhQUFJUyxNQUFKLEdBQWE3RCxPQUFPQSxPQUFPaEcsTUFBUCxHQUFjLENBQXJCLENBQWI7QUFDQSxTQUhELE1BR0s7QUFDSm9KLGFBQUlqRyxNQUFKLEdBQWE2QyxPQUFPQSxPQUFPaEcsTUFBUCxHQUFjLENBQXJCLENBQWI7QUFDQTtBQUNEb0osWUFBSWxHLE1BQUosR0FBYWtHLElBQUlTLE1BQUosR0FBYSxHQUFiLEdBQW1CVCxJQUFJakcsTUFBcEM7QUFDQUosZ0JBQVFxRyxHQUFSO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsS0F4RUQ7QUF5RUE7QUFDRCxHQTVGTSxDQUFQO0FBNkZBLEVBL0dTO0FBZ0hWTyxZQUFXLG1CQUFDUixPQUFELEVBQVc7QUFDckIsTUFBSUEsUUFBUWxNLE9BQVIsQ0FBZ0IsT0FBaEIsS0FBNEIsQ0FBaEMsRUFBa0M7QUFDakMsT0FBSWtNLFFBQVFsTSxPQUFSLENBQWdCLFdBQWhCLEtBQWdDLENBQXBDLEVBQXNDO0FBQ3JDLFdBQU8sUUFBUDtBQUNBLElBRkQsTUFFSztBQUNKLFdBQU8sVUFBUDtBQUNBO0FBQ0Q7QUFDRCxNQUFJa00sUUFBUWxNLE9BQVIsQ0FBZ0IsVUFBaEIsS0FBK0IsQ0FBbkMsRUFBcUM7QUFDcEMsVUFBTyxPQUFQO0FBQ0E7QUFDRCxNQUFJa00sUUFBUWxNLE9BQVIsQ0FBZ0IsUUFBaEIsS0FBNkIsQ0FBakMsRUFBbUM7QUFDbEMsVUFBTyxPQUFQO0FBQ0E7QUFDRCxNQUFJa00sUUFBUWxNLE9BQVIsQ0FBZ0IsVUFBaEIsS0FBK0IsQ0FBbkMsRUFBcUM7QUFDcEMsVUFBTyxPQUFQO0FBQ0E7QUFDRCxNQUFJa00sUUFBUWxNLE9BQVIsQ0FBZ0IsR0FBaEIsS0FBd0IsQ0FBNUIsRUFBOEI7QUFDN0IsVUFBTyxNQUFQO0FBQ0E7QUFDRCxTQUFPLFFBQVA7QUFDQSxFQXJJUztBQXNJVjJNLGNBQWEscUJBQUNULE9BQUQsRUFBVTlILElBQVYsRUFBaUI7QUFDN0IsU0FBTyxJQUFJeUIsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFtQjtBQUNyQyxPQUFJM0QsUUFBUThKLFFBQVFsTSxPQUFSLENBQWdCLGNBQWhCLElBQWdDLEVBQTVDO0FBQ0EsT0FBSXFDLE1BQU02SixRQUFRbE0sT0FBUixDQUFnQixHQUFoQixFQUFvQm9DLEtBQXBCLENBQVY7QUFDQSxPQUFJaUssUUFBUSxTQUFaO0FBQ0EsT0FBSWhLLE1BQU0sQ0FBVixFQUFZO0FBQ1gsUUFBSTZKLFFBQVFsTSxPQUFSLENBQWdCLE9BQWhCLEtBQTRCLENBQWhDLEVBQWtDO0FBQ2pDLFNBQUlvRSxTQUFTLFFBQWIsRUFBc0I7QUFDckIwQixjQUFRLFFBQVI7QUFDQSxNQUZELE1BRUs7QUFDSkEsY0FBUSxVQUFSO0FBQ0E7QUFDRCxLQU5ELE1BTUs7QUFDSkEsYUFBUW9HLFFBQVFNLEtBQVIsQ0FBY0gsS0FBZCxFQUFxQixDQUFyQixDQUFSO0FBQ0E7QUFDRCxJQVZELE1BVUs7QUFDSixRQUFJckksUUFBUWtJLFFBQVFsTSxPQUFSLENBQWdCLFVBQWhCLENBQVo7QUFDQSxRQUFJNEksUUFBUXNELFFBQVFsTSxPQUFSLENBQWdCLFVBQWhCLENBQVo7QUFDQSxRQUFJZ0UsU0FBUyxDQUFiLEVBQWU7QUFDZDVCLGFBQVE0QixRQUFNLENBQWQ7QUFDQTNCLFdBQU02SixRQUFRbE0sT0FBUixDQUFnQixHQUFoQixFQUFvQm9DLEtBQXBCLENBQU47QUFDQSxTQUFJMEssU0FBUyxTQUFiO0FBQ0EsU0FBSUMsT0FBT2IsUUFBUUQsU0FBUixDQUFrQjdKLEtBQWxCLEVBQXdCQyxHQUF4QixDQUFYO0FBQ0EsU0FBSXlLLE9BQU9FLElBQVAsQ0FBWUQsSUFBWixDQUFKLEVBQXNCO0FBQ3JCakgsY0FBUWlILElBQVI7QUFDQSxNQUZELE1BRUs7QUFDSmpILGNBQVEsT0FBUjtBQUNBO0FBQ0QsS0FWRCxNQVVNLElBQUc4QyxTQUFTLENBQVosRUFBYztBQUNuQjlDLGFBQVEsT0FBUjtBQUNBLEtBRkssTUFFRDtBQUNKLFNBQUltSCxXQUFXZixRQUFRRCxTQUFSLENBQWtCN0osS0FBbEIsRUFBd0JDLEdBQXhCLENBQWY7QUFDQWdDLFFBQUcrQixHQUFILE9BQVc2RyxRQUFYLEVBQXNCLFVBQVNySCxHQUFULEVBQWE7QUFDbEMsVUFBSUEsSUFBSXNILEtBQVIsRUFBYztBQUNicEgsZUFBUSxVQUFSO0FBQ0EsT0FGRCxNQUVLO0FBQ0pBLGVBQVFGLElBQUlXLEVBQVo7QUFDQTtBQUNELE1BTkQ7QUFPQTtBQUNEO0FBQ0QsR0F4Q00sQ0FBUDtBQXlDQSxFQWhMUztBQWlMVi9ELFNBQVEsZ0JBQUNyRCxHQUFELEVBQU87QUFDZCxNQUFJQSxJQUFJYSxPQUFKLENBQVksd0JBQVosS0FBeUMsQ0FBN0MsRUFBK0M7QUFDOUNiLFNBQU1BLElBQUk4TSxTQUFKLENBQWMsQ0FBZCxFQUFpQjlNLElBQUlhLE9BQUosQ0FBWSxHQUFaLENBQWpCLENBQU47QUFDQSxVQUFPYixHQUFQO0FBQ0EsR0FIRCxNQUdLO0FBQ0osVUFBT0EsR0FBUDtBQUNBO0FBQ0Q7QUF4TFMsQ0FBWDs7QUEyTEEsSUFBSThDLFVBQVM7QUFDWjJGLGNBQWEscUJBQUNxQixPQUFELEVBQVV6QixXQUFWLEVBQXVCRSxLQUF2QixFQUE4QnpELElBQTlCLEVBQW9DL0IsS0FBcEMsRUFBMkNLLE9BQTNDLEVBQXFEO0FBQ2pFLE1BQUlyQyxPQUFPK0ksUUFBUS9JLElBQW5CO0FBQ0EsTUFBSStELFNBQVMsRUFBYixFQUFnQjtBQUNmL0QsVUFBTytCLFFBQU9nQyxJQUFQLENBQVkvRCxJQUFaLEVBQWtCK0QsSUFBbEIsQ0FBUDtBQUNBO0FBQ0QsTUFBSXlELEtBQUosRUFBVTtBQUNUeEgsVUFBTytCLFFBQU9rTCxHQUFQLENBQVdqTixJQUFYLENBQVA7QUFDQTtBQUNELE1BQUkrSSxRQUFReEksT0FBUixLQUFvQixXQUFwQixJQUFtQ1MsT0FBT0csS0FBOUMsRUFBb0Q7QUFDbkRuQixVQUFPK0IsUUFBT0MsS0FBUCxDQUFhaEMsSUFBYixFQUFtQmdDLEtBQW5CLENBQVA7QUFDQSxHQUZELE1BRU0sSUFBSStHLFFBQVF4SSxPQUFSLEtBQW9CLFFBQXhCLEVBQWlDLENBRXRDLENBRkssTUFFRDtBQUNKUCxVQUFPK0IsUUFBTzZKLElBQVAsQ0FBWTVMLElBQVosRUFBa0JxQyxPQUFsQixDQUFQO0FBQ0E7QUFDRCxNQUFJaUYsV0FBSixFQUFnQjtBQUNmdEgsVUFBTytCLFFBQU9tTCxNQUFQLENBQWNsTixJQUFkLENBQVA7QUFDQTs7QUFFRCxTQUFPQSxJQUFQO0FBQ0EsRUFyQlc7QUFzQlprTixTQUFRLGdCQUFDbE4sSUFBRCxFQUFRO0FBQ2YsTUFBSW1OLFNBQVMsRUFBYjtBQUNBLE1BQUlDLE9BQU8sRUFBWDtBQUNBcE4sT0FBS3FOLE9BQUwsQ0FBYSxVQUFTQyxJQUFULEVBQWU7QUFDM0IsT0FBSUMsTUFBTUQsS0FBS2xILElBQUwsQ0FBVUMsRUFBcEI7QUFDQSxPQUFHK0csS0FBS3ROLE9BQUwsQ0FBYXlOLEdBQWIsTUFBc0IsQ0FBQyxDQUExQixFQUE2QjtBQUM1QkgsU0FBSzdHLElBQUwsQ0FBVWdILEdBQVY7QUFDQUosV0FBTzVHLElBQVAsQ0FBWStHLElBQVo7QUFDQTtBQUNELEdBTkQ7QUFPQSxTQUFPSCxNQUFQO0FBQ0EsRUFqQ1c7QUFrQ1pwSixPQUFNLGNBQUMvRCxJQUFELEVBQU8rRCxLQUFQLEVBQWM7QUFDbkIsTUFBSXlKLFNBQVNuTyxFQUFFb08sSUFBRixDQUFPek4sSUFBUCxFQUFZLFVBQVNvSyxDQUFULEVBQVlyQyxDQUFaLEVBQWM7QUFDdEMsT0FBSXFDLEVBQUVoQyxPQUFGLENBQVV0SSxPQUFWLENBQWtCaUUsS0FBbEIsSUFBMEIsQ0FBQyxDQUEvQixFQUFpQztBQUNoQyxXQUFPLElBQVA7QUFDQTtBQUNELEdBSlksQ0FBYjtBQUtBLFNBQU95SixNQUFQO0FBQ0EsRUF6Q1c7QUEwQ1pQLE1BQUssYUFBQ2pOLElBQUQsRUFBUTtBQUNaLE1BQUl3TixTQUFTbk8sRUFBRW9PLElBQUYsQ0FBT3pOLElBQVAsRUFBWSxVQUFTb0ssQ0FBVCxFQUFZckMsQ0FBWixFQUFjO0FBQ3RDLE9BQUlxQyxFQUFFc0QsWUFBTixFQUFtQjtBQUNsQixXQUFPLElBQVA7QUFDQTtBQUNELEdBSlksQ0FBYjtBQUtBLFNBQU9GLE1BQVA7QUFDQSxFQWpEVztBQWtEWjVCLE9BQU0sY0FBQzVMLElBQUQsRUFBTzJOLENBQVAsRUFBVztBQUNoQixNQUFJQyxXQUFXRCxFQUFFRSxLQUFGLENBQVEsR0FBUixDQUFmO0FBQ0EsTUFBSWpDLE9BQU9rQyxPQUFPLElBQUlDLElBQUosQ0FBU0gsU0FBUyxDQUFULENBQVQsRUFBc0J2RCxTQUFTdUQsU0FBUyxDQUFULENBQVQsSUFBc0IsQ0FBNUMsRUFBK0NBLFNBQVMsQ0FBVCxDQUEvQyxFQUEyREEsU0FBUyxDQUFULENBQTNELEVBQXVFQSxTQUFTLENBQVQsQ0FBdkUsRUFBbUZBLFNBQVMsQ0FBVCxDQUFuRixDQUFQLEVBQXdHSSxFQUFuSDtBQUNBLE1BQUlSLFNBQVNuTyxFQUFFb08sSUFBRixDQUFPek4sSUFBUCxFQUFZLFVBQVNvSyxDQUFULEVBQVlyQyxDQUFaLEVBQWM7QUFDdEMsT0FBSXZCLGVBQWVzSCxPQUFPMUQsRUFBRTVELFlBQVQsRUFBdUJ3SCxFQUExQztBQUNBLE9BQUl4SCxlQUFlb0YsSUFBZixJQUF1QnhCLEVBQUU1RCxZQUFGLElBQWtCLEVBQTdDLEVBQWdEO0FBQy9DLFdBQU8sSUFBUDtBQUNBO0FBQ0QsR0FMWSxDQUFiO0FBTUEsU0FBT2dILE1BQVA7QUFDQSxFQTVEVztBQTZEWnhMLFFBQU8sZUFBQ2hDLElBQUQsRUFBT2tMLEdBQVAsRUFBYTtBQUNuQixNQUFJQSxPQUFPLEtBQVgsRUFBaUI7QUFDaEIsVUFBT2xMLElBQVA7QUFDQSxHQUZELE1BRUs7QUFDSixPQUFJd04sU0FBU25PLEVBQUVvTyxJQUFGLENBQU96TixJQUFQLEVBQVksVUFBU29LLENBQVQsRUFBWXJDLENBQVosRUFBYztBQUN0QyxRQUFJcUMsRUFBRWxHLElBQUYsSUFBVWdILEdBQWQsRUFBa0I7QUFDakIsWUFBTyxJQUFQO0FBQ0E7QUFDRCxJQUpZLENBQWI7QUFLQSxVQUFPc0MsTUFBUDtBQUNBO0FBQ0Q7QUF4RVcsQ0FBYjs7QUEyRUEsSUFBSXRHLEtBQUs7QUFDUjdGLE9BQU0sZ0JBQUksQ0FFVCxDQUhPO0FBSVI4RixRQUFPLGlCQUFJO0FBQ1YsTUFBSTVHLFVBQVVQLEtBQUtZLEdBQUwsQ0FBU0wsT0FBdkI7QUFDQSxNQUFJQSxZQUFZLFdBQVosSUFBMkJTLE9BQU9HLEtBQXRDLEVBQTRDO0FBQzNDOUIsS0FBRSw0QkFBRixFQUFnQ2tDLFFBQWhDLENBQXlDLE1BQXpDO0FBQ0FsQyxLQUFFLGlCQUFGLEVBQXFCVSxXQUFyQixDQUFpQyxNQUFqQztBQUNBLEdBSEQsTUFHSztBQUNKVixLQUFFLDRCQUFGLEVBQWdDVSxXQUFoQyxDQUE0QyxNQUE1QztBQUNBVixLQUFFLGlCQUFGLEVBQXFCa0MsUUFBckIsQ0FBOEIsTUFBOUI7QUFDQTtBQUNELE1BQUloQixZQUFZLFVBQWhCLEVBQTJCO0FBQzFCbEIsS0FBRSxXQUFGLEVBQWVVLFdBQWYsQ0FBMkIsTUFBM0I7QUFDQSxHQUZELE1BRUs7QUFDSixPQUFJVixFQUFFLE1BQUYsRUFBVWtJLElBQVYsQ0FBZSxTQUFmLENBQUosRUFBOEI7QUFDN0JsSSxNQUFFLE1BQUYsRUFBVWEsS0FBVjtBQUNBO0FBQ0RiLEtBQUUsV0FBRixFQUFla0MsUUFBZixDQUF3QixNQUF4QjtBQUNBO0FBQ0Q7QUFyQk8sQ0FBVDs7QUF5QkEsU0FBU2lCLE9BQVQsR0FBa0I7QUFDakIsS0FBSXlMLElBQUksSUFBSUYsSUFBSixFQUFSO0FBQ0EsS0FBSUcsT0FBT0QsRUFBRUUsV0FBRixFQUFYO0FBQ0EsS0FBSUMsUUFBUUgsRUFBRUksUUFBRixLQUFhLENBQXpCO0FBQ0EsS0FBSUMsT0FBT0wsRUFBRU0sT0FBRixFQUFYO0FBQ0EsS0FBSUMsT0FBT1AsRUFBRVEsUUFBRixFQUFYO0FBQ0EsS0FBSUMsTUFBTVQsRUFBRVUsVUFBRixFQUFWO0FBQ0EsS0FBSUMsTUFBTVgsRUFBRVksVUFBRixFQUFWO0FBQ0EsUUFBT1gsT0FBSyxHQUFMLEdBQVNFLEtBQVQsR0FBZSxHQUFmLEdBQW1CRSxJQUFuQixHQUF3QixHQUF4QixHQUE0QkUsSUFBNUIsR0FBaUMsR0FBakMsR0FBcUNFLEdBQXJDLEdBQXlDLEdBQXpDLEdBQTZDRSxHQUFwRDtBQUNBOztBQUVELFNBQVN2RyxhQUFULENBQXVCeUcsY0FBdkIsRUFBc0M7QUFDcEMsS0FBSWIsSUFBSUgsT0FBT2dCLGNBQVAsRUFBdUJkLEVBQS9CO0FBQ0MsS0FBSWUsU0FBUyxDQUFDLElBQUQsRUFBTSxJQUFOLEVBQVcsSUFBWCxFQUFnQixJQUFoQixFQUFxQixJQUFyQixFQUEwQixJQUExQixFQUErQixJQUEvQixFQUFvQyxJQUFwQyxFQUF5QyxJQUF6QyxFQUE4QyxJQUE5QyxFQUFtRCxJQUFuRCxFQUF3RCxJQUF4RCxDQUFiO0FBQ0UsS0FBSWIsT0FBT0QsRUFBRUUsV0FBRixFQUFYO0FBQ0EsS0FBSUMsUUFBUVcsT0FBT2QsRUFBRUksUUFBRixFQUFQLENBQVo7QUFDQSxLQUFJQyxPQUFPTCxFQUFFTSxPQUFGLEVBQVg7QUFDQSxLQUFJRCxPQUFPLEVBQVgsRUFBYztBQUNiQSxTQUFPLE1BQUlBLElBQVg7QUFDQTtBQUNELEtBQUlFLE9BQU9QLEVBQUVRLFFBQUYsRUFBWDtBQUNBLEtBQUlDLE1BQU1ULEVBQUVVLFVBQUYsRUFBVjtBQUNBLEtBQUlELE1BQU0sRUFBVixFQUFhO0FBQ1pBLFFBQU0sTUFBSUEsR0FBVjtBQUNBO0FBQ0QsS0FBSUUsTUFBTVgsRUFBRVksVUFBRixFQUFWO0FBQ0EsS0FBSUQsTUFBTSxFQUFWLEVBQWE7QUFDWkEsUUFBTSxNQUFJQSxHQUFWO0FBQ0E7QUFDRCxLQUFJaEQsT0FBT3NDLE9BQUssR0FBTCxHQUFTRSxLQUFULEdBQWUsR0FBZixHQUFtQkUsSUFBbkIsR0FBd0IsR0FBeEIsR0FBNEJFLElBQTVCLEdBQWlDLEdBQWpDLEdBQXFDRSxHQUFyQyxHQUF5QyxHQUF6QyxHQUE2Q0UsR0FBeEQ7QUFDQSxRQUFPaEQsSUFBUDtBQUNIOztBQUVELFNBQVNqRSxTQUFULENBQW1Cc0UsR0FBbkIsRUFBdUI7QUFDdEIsS0FBSStDLFFBQVEzUCxFQUFFc0wsR0FBRixDQUFNc0IsR0FBTixFQUFXLFVBQVNuQyxLQUFULEVBQWdCYyxLQUFoQixFQUF1QjtBQUM3QyxTQUFPLENBQUNkLEtBQUQsQ0FBUDtBQUNBLEVBRlcsQ0FBWjtBQUdBLFFBQU9rRixLQUFQO0FBQ0E7O0FBRUQsU0FBU3ZFLGNBQVQsQ0FBd0JMLENBQXhCLEVBQTJCO0FBQzFCLEtBQUk2RSxNQUFNLElBQUlDLEtBQUosRUFBVjtBQUNBLEtBQUluSCxDQUFKLEVBQU9vSCxDQUFQLEVBQVV4QixDQUFWO0FBQ0EsTUFBSzVGLElBQUksQ0FBVCxFQUFhQSxJQUFJcUMsQ0FBakIsRUFBcUIsRUFBRXJDLENBQXZCLEVBQTBCO0FBQ3pCa0gsTUFBSWxILENBQUosSUFBU0EsQ0FBVDtBQUNBO0FBQ0QsTUFBS0EsSUFBSSxDQUFULEVBQWFBLElBQUlxQyxDQUFqQixFQUFxQixFQUFFckMsQ0FBdkIsRUFBMEI7QUFDekJvSCxNQUFJQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JsRixDQUEzQixDQUFKO0FBQ0F1RCxNQUFJc0IsSUFBSUUsQ0FBSixDQUFKO0FBQ0FGLE1BQUlFLENBQUosSUFBU0YsSUFBSWxILENBQUosQ0FBVDtBQUNBa0gsTUFBSWxILENBQUosSUFBUzRGLENBQVQ7QUFDQTtBQUNELFFBQU9zQixHQUFQO0FBQ0E7O0FBRUQsU0FBU25NLGtCQUFULENBQTRCeU0sUUFBNUIsRUFBc0NDLFdBQXRDLEVBQW1EQyxTQUFuRCxFQUE4RDtBQUMzRDtBQUNBLEtBQUlDLFVBQVUsUUFBT0gsUUFBUCx5Q0FBT0EsUUFBUCxNQUFtQixRQUFuQixHQUE4Qi9PLEtBQUtDLEtBQUwsQ0FBVzhPLFFBQVgsQ0FBOUIsR0FBcURBLFFBQW5FOztBQUVBLEtBQUlJLE1BQU0sRUFBVjtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSUYsU0FBSixFQUFlO0FBQ1gsTUFBSUcsTUFBTSxFQUFWOztBQUVBO0FBQ0EsT0FBSyxJQUFJaEYsS0FBVCxJQUFrQjhFLFFBQVEsQ0FBUixDQUFsQixFQUE4Qjs7QUFFMUI7QUFDQUUsVUFBT2hGLFFBQVEsR0FBZjtBQUNIOztBQUVEZ0YsUUFBTUEsSUFBSUMsS0FBSixDQUFVLENBQVYsRUFBYSxDQUFDLENBQWQsQ0FBTjs7QUFFQTtBQUNBRixTQUFPQyxNQUFNLE1BQWI7QUFDSDs7QUFFRDtBQUNBLE1BQUssSUFBSTdILElBQUksQ0FBYixFQUFnQkEsSUFBSTJILFFBQVE3TSxNQUE1QixFQUFvQ2tGLEdBQXBDLEVBQXlDO0FBQ3JDLE1BQUk2SCxNQUFNLEVBQVY7O0FBRUE7QUFDQSxPQUFLLElBQUloRixLQUFULElBQWtCOEUsUUFBUTNILENBQVIsQ0FBbEIsRUFBOEI7QUFDMUI2SCxVQUFPLE1BQU1GLFFBQVEzSCxDQUFSLEVBQVc2QyxLQUFYLENBQU4sR0FBMEIsSUFBakM7QUFDSDs7QUFFRGdGLE1BQUlDLEtBQUosQ0FBVSxDQUFWLEVBQWFELElBQUkvTSxNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQThNLFNBQU9DLE1BQU0sTUFBYjtBQUNIOztBQUVELEtBQUlELE9BQU8sRUFBWCxFQUFlO0FBQ1h0TSxRQUFNLGNBQU47QUFDQTtBQUNIOztBQUVEO0FBQ0EsS0FBSXlNLFdBQVcsRUFBZjtBQUNBO0FBQ0FBLGFBQVlOLFlBQVkzSSxPQUFaLENBQW9CLElBQXBCLEVBQXlCLEdBQXpCLENBQVo7O0FBRUE7QUFDQSxLQUFJa0osTUFBTSx1Q0FBdUNDLFVBQVVMLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJaEUsT0FBT2xNLFNBQVN3USxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQXRFLE1BQUt1RSxJQUFMLEdBQVlILEdBQVo7O0FBRUE7QUFDQXBFLE1BQUt3RSxLQUFMLEdBQWEsbUJBQWI7QUFDQXhFLE1BQUt5RSxRQUFMLEdBQWdCTixXQUFXLE1BQTNCOztBQUVBO0FBQ0FyUSxVQUFTNFEsSUFBVCxDQUFjQyxXQUFkLENBQTBCM0UsSUFBMUI7QUFDQUEsTUFBS3pMLEtBQUw7QUFDQVQsVUFBUzRRLElBQVQsQ0FBY0UsV0FBZCxDQUEwQjVFLElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVycjtcbnZhciBUQUJMRTtcblxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcbntcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIixcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xuXHRcdGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXIgVVJM77yaIFwiICsgJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5hcHBlbmQoXCI8YnI+XCIrJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1x0XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5zZWFyY2g7XG5cdGlmIChoYXNoLmluZGV4T2YoXCJleHRlbnNpb25cIikgPj0gMCl7XG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0ZGF0YS5leHRlbnNpb24gPSB0cnVlO1xuXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aCBidXR0b25cIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XG5cdFx0fSk7XG5cdH1cblx0aWYgKGhhc2guaW5kZXhPZihcInJhbmtlclwiKSA+PSAwKXtcblx0XHRsZXQgZGF0YXMgPSB7XG5cdFx0XHRjb21tYW5kOiAncmFua2VyJyxcblx0XHRcdGRhdGE6IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnJhbmtlcilcblx0XHR9XG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcblx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XG5cdH1cblxuXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0Y29uZmlnLm9yZGVyID0gJ2Nocm9ub2xvZ2ljYWwnO1xuXHRcdH1cblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xuXHR9KTtcblxuXHQkKFwiI2J0bl9saWtlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0Y29uZmlnLmxpa2VzID0gdHJ1ZTtcblx0XHR9XG5cdFx0ZmIuZ2V0QXV0aCgncmVhY3Rpb25zJyk7XG5cdH0pO1xuXHQkKFwiI2J0bl91cmxcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRmYi5nZXRBdXRoKCd1cmxfY29tbWVudHMnKTtcblx0fSk7XG5cdCQoXCIjYnRuX3BheVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XG5cdH0pO1xuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRjaG9vc2UuaW5pdCgpO1xuXHR9KTtcblx0XG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xuXHRcdH1cblx0fSk7XG5cblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdH1lbHNle1xuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XG5cdH0pO1xuXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uKGUpe1xuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XG5cdFx0fVxuXHR9KTtcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uKGUpe1xuXHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XG5cdFx0dGFibGUucmVkbygpO1xuXHR9KTtcblxuXHQkKFwiLnVpcGFuZWwgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbigpe1xuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xuXHRcdHRhYmxlLnJlZG8oKTtcblx0fSk7XG5cblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXG5cdFx0XCJsb2NhbGVcIjoge1xuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZLU1NLUREICAgSEg6bW1cIixcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXG5cdFx0XHRcIuaXpVwiLFxuXHRcdFx0XCLkuIBcIixcblx0XHRcdFwi5LqMXCIsXG5cdFx0XHRcIuS4iVwiLFxuXHRcdFx0XCLlm5tcIixcblx0XHRcdFwi5LqUXCIsXG5cdFx0XHRcIuWFrVwiXG5cdFx0XHRdLFxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcblx0XHRcdFwi5LiA5pyIXCIsXG5cdFx0XHRcIuS6jOaciFwiLFxuXHRcdFx0XCLkuInmnIhcIixcblx0XHRcdFwi5Zub5pyIXCIsXG5cdFx0XHRcIuS6lOaciFwiLFxuXHRcdFx0XCLlha3mnIhcIixcblx0XHRcdFwi5LiD5pyIXCIsXG5cdFx0XHRcIuWFq+aciFwiLFxuXHRcdFx0XCLkuZ3mnIhcIixcblx0XHRcdFwi5Y2B5pyIXCIsXG5cdFx0XHRcIuWNgeS4gOaciFwiLFxuXHRcdFx0XCLljYHkuozmnIhcIlxuXHRcdFx0XSxcblx0XHRcdFwiZmlyc3REYXlcIjogMVxuXHRcdH0sXG5cdH0sZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcblx0XHR0YWJsZS5yZWRvKCk7XG5cdH0pO1xuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XG5cblxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhKTtcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xuXHRcdFx0d2luZG93LmZvY3VzKCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKXtcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0XHR9ZWxzZXtcdFxuXHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XG5cdH0pO1xuXG5cdGxldCBjaV9jb3VudGVyID0gMDtcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRjaV9jb3VudGVyKys7XG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSl7XG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdH1cblx0XHRpZihlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0XG5cdFx0fVxuXHR9KTtcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcblx0fSk7XG59KTtcblxuZnVuY3Rpb24gc2hhcmVCVE4oKXtcblx0YWxlcnQoJ+iqjeecn+eci+WujOi3s+WHuuS+hueahOmCo+mggeS4iumdouWvq+S6huS7gOm6vFxcblxcbueci+WujOS9oOWwseacg+efpemBk+S9oOeCuuS7gOm6vOS4jeiDveaKk+WIhuS6qycpO1xufVxuXG5sZXQgY29uZmlnID0ge1xuXHRmaWVsZDoge1xuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCdtZXNzYWdlX3RhZ3MnLCdtZXNzYWdlJywnZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxuXHRcdHJlYWN0aW9uczogW10sXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxuXHRcdHVybF9jb21tZW50czogW10sXG5cdFx0ZmVlZDogW10sXG5cdFx0bGlrZXM6IFsnbmFtZSddXG5cdH0sXG5cdGxpbWl0OiB7XG5cdFx0Y29tbWVudHM6ICc1MDAnLFxuXHRcdHJlYWN0aW9uczogJzUwMCcsXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXG5cdFx0ZmVlZDogJzUwMCcsXG5cdFx0bGlrZXM6ICc1MDAnXG5cdH0sXG5cdGFwaVZlcnNpb246IHtcblx0XHRjb21tZW50czogJ3YyLjcnLFxuXHRcdHJlYWN0aW9uczogJ3YyLjcnLFxuXHRcdHNoYXJlZHBvc3RzOiAndjIuOScsXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuNycsXG5cdFx0ZmVlZDogJ3YyLjknLFxuXHRcdGdyb3VwOiAndjIuNydcblx0fSxcblx0ZmlsdGVyOiB7XG5cdFx0d29yZDogJycsXG5cdFx0cmVhY3Q6ICdhbGwnLFxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxuXHR9LFxuXHRvcmRlcjogJycsXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLHVzZXJfbWFuYWdlZF9ncm91cHMnLFxuXHRsaWtlczogZmFsc2Vcbn1cblxubGV0IGZiID0ge1xuXHR1c2VyX3Bvc3RzOiBmYWxzZSxcblx0Z2V0QXV0aDogKHR5cGUpPT57XG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XG5cdH0sXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XG5cdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XG5cdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xuXHRcdFx0XHRcdHN3YWwoXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZpbmlzaGVkISBQbGVhc2UgZ2V0Q29tbWVudHMgYWdhaW4uJyxcblx0XHRcdFx0XHRcdCdzdWNjZXNzJ1xuXHRcdFx0XHRcdFx0KS5kb25lKCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHN3YWwoXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5aSx5pWX77yM6KuL6IGv57Wh566h55CG5ZOh56K66KqNJyxcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXG5cdFx0XHRcdFx0XHQnZXJyb3InXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2UgaWYgKHR5cGUgPT0gXCJzaGFyZWRwb3N0c1wiKXtcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZihcInVzZXJfcG9zdHNcIikgPCAwKXtcblx0XHRcdFx0XHRzd2FsKHtcblx0XHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcblx0XHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+Jyxcblx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xuXHRcdFx0XHRcdH0pLmRvbmUoKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0ZmIudXNlcl9wb3N0cyA9IHRydWU7XG5cdFx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZihcInVzZXJfcG9zdHNcIikgPj0gMCl7XG5cdFx0XHRcdFx0ZmIudXNlcl9wb3N0cyA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1x0XHRcdFxuXHRcdFx0fVxuXHRcdH1lbHNle1xuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHRcdH1cblx0fSxcblx0ZXh0ZW5zaW9uQXV0aDogKCk9Pntcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0fSxcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSk9Pntcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xuXHRcdFx0aWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzLmluZGV4T2YoXCJ1c2VyX3Bvc3RzXCIpIDwgMCl7XG5cdFx0XHRcdHN3YWwoe1xuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXG5cdFx0XHRcdH0pLmRvbmUoKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcblx0XHRcdFx0bGV0IGRhdGFzID0ge1xuXHRcdFx0XHRcdGNvbW1hbmQ6ICdzaGFyZWRwb3N0cycsXG5cdFx0XHRcdFx0ZGF0YTogSlNPTi5wYXJzZSgkKFwiLmNocm9tZVwiKS52YWwoKSlcblx0XHRcdFx0fVxuXHRcdFx0XHRkYXRhLnJhdyA9IGRhdGFzO1xuXHRcdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XG5cdFx0XHR9XG5cdFx0fWVsc2V7XG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XG5cdFx0fVxuXHR9XG59XG5cbmxldCBkYXRhID0ge1xuXHRyYXc6IFtdLFxuXHR1c2VyaWQ6ICcnLFxuXHRub3dMZW5ndGg6IDAsXG5cdGV4dGVuc2lvbjogZmFsc2UsXG5cdGluaXQ6ICgpPT57XG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluizh+aWmeS4rS4uLicpO1xuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcblx0XHRkYXRhLnJhdyA9IFtdO1xuXHR9LFxuXHRzdGFydDogKGZiaWQpPT57XG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHRkYXRhLmdldChmYmlkKS50aGVuKChyZXMpPT57XG5cdFx0XHRmYmlkLmRhdGEgPSByZXM7XG5cdFx0XHRkYXRhLmZpbmlzaChmYmlkKTtcblx0XHR9KTtcblx0fSxcblx0Z2V0OiAoZmJpZCk9Pntcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9Pntcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcblx0XHRcdGxldCBjb21tYW5kID0gZmJpZC5jb21tYW5kO1xuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJykgY29tbWFuZCA9ICdncm91cCc7XG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnICYmIGZiaWQuY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpIGZiaWQuZnVsbElEID0gZmJpZC5wdXJlSUQ7XG5cdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xuXHRcdFx0Y29uc29sZS5sb2coYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZmaWVsZHM9JHtjb25maWcuZmllbGRbZmJpZC5jb21tYW5kXS50b1N0cmluZygpfSZkZWJ1Zz1hbGxgKTtcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19Jm9yZGVyPSR7Y29uZmlnLm9yZGVyfSZmaWVsZHM9JHtjb25maWcuZmllbGRbZmJpZC5jb21tYW5kXS50b1N0cmluZygpfSZkZWJ1Zz1hbGxgLChyZXMpPT57XG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XG5cdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XG5cdFx0XHRcdFx0aWYgKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpe1xuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBkLnR5cGUgPSBcIkxJS0VcIjtcblx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHQvL2V2ZW50XG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xuXHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywnbGltaXQ9JytsaW1pdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0XHRcdGlmIChkLmlkKXtcblx0XHRcdFx0XHRcdFx0aWYgKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpe1xuXHRcdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQvL2V2ZW50XG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLmlkfTtcblx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0ZmluaXNoOiAoZmJpZCk9Pntcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0JChcIi51cGRhdGVfYXJlYSwuZG9uYXRlX2FyZWFcIikuc2xpZGVVcCgpO1xuXHRcdCQoXCIucmVzdWx0X2FyZWFcIikuc2xpZGVEb3duKCk7XG5cdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcblx0XHR1aS5yZXNldCgpO1xuXHR9LFxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKT0+e1xuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcblx0XHRyYXdEYXRhLmZpbHRlcmVkID0gbmV3RGF0YTtcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpe1xuXHRcdFx0dGFibGUuZ2VuZXJhdGUocmF3RGF0YSk7XHRcblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybiByYXdEYXRhO1xuXHRcdH1cblx0fSxcblx0ZXhjZWw6IChyYXcpPT57XG5cdFx0dmFyIG5ld09iaiA9IFtdO1xuXHRcdGlmIChkYXRhLmV4dGVuc2lvbil7XG5cdFx0XHQkLmVhY2gocmF3LmRhdGEsZnVuY3Rpb24oaSl7XG5cdFx0XHRcdHZhciB0bXAgPSB7XG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXG5cdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIiA6IHRoaXMucG9zdGxpbmssXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMuc3RvcnksXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxuXHRcdFx0XHR9XG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdCQuZWFjaChyYXcuZGF0YSxmdW5jdGlvbihpKXtcblx0XHRcdFx0dmFyIHRtcCA9IHtcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcblx0XHRcdFx0XHRcIuihqOaDhVwiIDogdGhpcy50eXBlIHx8ICcnLFxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiIDogdGltZUNvbnZlcnRlcih0aGlzLmNyZWF0ZWRfdGltZSlcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBuZXdPYmo7XG5cdH0sXG5cdGltcG9ydDogKGZpbGUpPT57XG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuXHRcdFx0ZGF0YS5yYXcgPSBKU09OLnBhcnNlKHN0cik7XG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XG5cdFx0fVxuXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG5cdH1cbn1cblxubGV0IHRhYmxlID0ge1xuXHRnZW5lcmF0ZTogKHJhd2RhdGEpPT57XG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcblx0XHRsZXQgZmlsdGVyZGF0YSA9IHJhd2RhdGEuZmlsdGVyZWQ7XG5cdFx0bGV0IHRoZWFkID0gJyc7XG5cdFx0bGV0IHRib2R5ID0gJyc7XG5cdFx0bGV0IHBpYyA9ICQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcblx0XHRpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxuXHRcdFx0PHRkPuihqOaDhTwvdGQ+YDtcblx0XHR9ZWxzZSBpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpe1xuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cblx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcblx0XHR9ZWxzZSBpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKXtcblx0XHRcdHRoZWFkID0gYDx0ZD7mjpLlkI08L3RkPlxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XG5cdFx0XHQ8dGQ+5YiG5pW4PC90ZD5gO1xuXHRcdH1lbHNle1xuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxuXHRcdFx0PHRkPuiumjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XG5cdFx0fVxuXG5cdFx0bGV0IGhvc3QgPSAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJztcblx0XHRpZiAoZGF0YS5yYXcudHlwZSA9PT0gJ3VybF9jb21tZW50cycpIGhvc3QgPSAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpICsgJz9mYl9jb21tZW50X2lkPSc7XG5cblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmRhdGEuZW50cmllcygpKXtcblx0XHRcdGxldCBwaWN0dXJlID0gJyc7XG5cdFx0XHRpZiAocGljKXtcblx0XHRcdFx0cGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XG5cdFx0XHR9XG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcblx0XHRcdGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XG5cdFx0XHR9ZWxzZSBpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpe1xuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3Rvcnl9PC9hPjwvdGQ+XG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XG5cdFx0XHR9ZWxzZSBpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKXtcblx0XHRcdFx0dGQgPSBgPHRkPiR7aisxfTwvdGQ+XG5cdFx0XHRcdFx0ICA8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cblx0XHRcdFx0XHQgIDx0ZD4ke3ZhbC5zY29yZX08L3RkPmA7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cIiR7aG9zdH0ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxuXHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xuXHRcdFx0fVxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcblx0XHRcdHRib2R5ICs9IHRyO1xuXHRcdH1cblx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xuXG5cblx0XHRhY3RpdmUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xuXHRcdFx0VEFCTEUgPSAkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKHtcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXG5cdFx0XHR9KTtcblxuXHRcdFx0JChcIiNzZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFRBQkxFXG5cdFx0XHRcdC5jb2x1bW5zKDEpXG5cdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcblx0XHRcdFx0LmRyYXcoKTtcblx0XHRcdH0pO1xuXHRcdFx0JChcIiNzZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFRBQkxFXG5cdFx0XHRcdC5jb2x1bW5zKDIpXG5cdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcblx0XHRcdFx0LmRyYXcoKTtcblx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblx0cmVkbzogKCk9Pntcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XG5cdH1cbn1cblxubGV0IGNob29zZSA9IHtcblx0ZGF0YTogW10sXG5cdGF3YXJkOiBbXSxcblx0bnVtOiAwLFxuXHRkZXRhaWw6IGZhbHNlLFxuXHRsaXN0OiBbXSxcblx0aW5pdDogKCk9Pntcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xuXHRcdGNob29zZS5saXN0ID0gW107XG5cdFx0Y2hvb3NlLm51bSA9IDA7XG5cdFx0aWYoJChcIiNzZWFyY2hDb21tZW50XCIpLnZhbCgpICE9ICcnKXtcblx0XHRcdHRhYmxlLnJlZG8oKTtcblx0XHR9XG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XG5cdFx0XHRcdGlmIChuID4gMCl7XG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1lbHNle1xuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcblx0XHR9XG5cdFx0Y2hvb3NlLmdvKCk7XG5cdH0sXG5cdGdvOiAoKT0+e1xuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhLmZpbHRlcmVkLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XG5cdFx0bGV0IGluc2VydCA9ICcnO1xuXHRcdGNob29zZS5hd2FyZC5tYXAoKHZhbCwgaW5kZXgpPT57XG5cdFx0XHRpbnNlcnQgKz0gJzx0ciB0aXRsZT1cIuesrCcrKGluZGV4KzEpKyflkI1cIj4nICsgJCgnLm1haW5fdGFibGUnKS5EYXRhVGFibGUoKS5yb3dzKHtzZWFyY2g6J2FwcGxpZWQnfSkubm9kZXMoKVt2YWxdLmlubmVySFRNTCArICc8L3RyPic7XG5cdFx0fSlcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xuXG5cdFx0aWYoY2hvb3NlLmRldGFpbCl7XG5cdFx0XHRsZXQgbm93ID0gMDtcblx0XHRcdGZvcihsZXQgayBpbiBjaG9vc2UubGlzdCl7XG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjVcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XG5cdFx0XHR9XG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XG5cdFx0fVxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcblx0fSxcblx0Z2VuX2JpZ19hd2FyZDogKCk9Pntcblx0XHRsZXQgbGkgPSAnJztcblx0XHRsZXQgYXdhcmRzID0gW107XG5cdFx0JCgnI2F3YXJkTGlzdCB0Ym9keSB0cicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIHZhbCl7XG5cdFx0XHRsZXQgYXdhcmQgPSB7fTtcblx0XHRcdGlmICh2YWwuaGFzQXR0cmlidXRlKCd0aXRsZScpKXtcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IGZhbHNlO1xuXHRcdFx0XHRhd2FyZC5uYW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLnRleHQoKTtcblx0XHRcdFx0YXdhcmQudXNlcmlkID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLmF0dHIoJ2hyZWYnKS5yZXBsYWNlKCdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nLCcnKTtcblx0XHRcdFx0YXdhcmQubWVzc2FnZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDIpLmZpbmQoJ2EnKS50ZXh0KCk7XG5cdFx0XHRcdGF3YXJkLmxpbmsgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykuYXR0cignaHJlZicpO1xuXHRcdFx0XHRhd2FyZC50aW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoJCh2YWwpLmZpbmQoJ3RkJykubGVuZ3RoLTEpLnRleHQoKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRhd2FyZC5hd2FyZF9uYW1lID0gdHJ1ZTtcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLnRleHQoKTtcblx0XHRcdH1cblx0XHRcdGF3YXJkcy5wdXNoKGF3YXJkKTtcblx0XHR9KTtcblx0XHRmb3IobGV0IGkgb2YgYXdhcmRzKXtcblx0XHRcdGlmIChpLmF3YXJkX25hbWUgPT09IHRydWUpe1xuXHRcdFx0XHRsaSArPSBgPGxpIGNsYXNzPVwicHJpemVOYW1lXCI+JHtpLm5hbWV9PC9saT5gO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGxpICs9IGA8bGk+XG5cdFx0XHRcdDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH0vcGljdHVyZT90eXBlPWxhcmdlXCIgYWx0PVwiXCI+PC9hPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5mb1wiPlxuXHRcdFx0XHQ8cCBjbGFzcz1cIm5hbWVcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLm5hbWV9PC9hPjwvcD5cblx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5tZXNzYWdlfTwvYT48L3A+XG5cdFx0XHRcdDxwIGNsYXNzPVwidGltZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kudGltZX08L2E+PC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9saT5gO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuYXBwZW5kKGxpKTtcblx0XHQkKCcuYmlnX2F3YXJkJykuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0fSxcblx0Y2xvc2VfYmlnX2F3YXJkOiAoKT0+e1xuXHRcdCQoJy5iaWdfYXdhcmQnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xuXHRcdCQoJy5iaWdfYXdhcmQgdWwnKS5lbXB0eSgpO1xuXHR9XG59XG5cbmxldCBmYmlkID0ge1xuXHRmYmlkOiBbXSxcblx0aW5pdDogKHR5cGUpPT57XG5cdFx0ZmJpZC5mYmlkID0gW107XG5cdFx0ZGF0YS5pbml0KCk7XG5cdFx0RkIuYXBpKFwiL21lXCIsZnVuY3Rpb24ocmVzKXtcblx0XHRcdGRhdGEudXNlcmlkID0gcmVzLmlkO1xuXHRcdFx0bGV0IHVybCA9IGZiaWQuZm9ybWF0KCQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xuXHRcdFx0aWYgKHVybC5pbmRleE9mKCcucGhwPycpID09PSAtMSAmJiB1cmwuaW5kZXhPZignPycpID4gMCl7XG5cdFx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoJz8nKSk7XG5cdFx0XHR9XG5cdFx0XHRmYmlkLmdldCh1cmwsIHR5cGUpLnRoZW4oKGZiaWQpPT57XG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XG5cdFx0XHR9KVxuXHRcdFx0Ly8gJCgnLmlkZW50aXR5JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKGDnmbvlhaXouqvku73vvJo8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtyZXMuaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxzcGFuPiR7cmVzLm5hbWV9PC9zcGFuPmApO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXQ6ICh1cmwsIHR5cGUpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRpZiAodHlwZSA9PSAndXJsX2NvbW1lbnRzJyl7XG5cdFx0XHRcdGxldCBwb3N0dXJsID0gdXJsO1xuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiP1wiKSA+IDApe1xuXHRcdFx0XHRcdHBvc3R1cmwgPSBwb3N0dXJsLnN1YnN0cmluZygwLHBvc3R1cmwuaW5kZXhPZihcIj9cIikpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdEZCLmFwaShgLyR7cG9zdHVybH1gLGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtmdWxsSUQ6IHJlcy5vZ19vYmplY3QuaWQsIHR5cGU6IHR5cGUsIGNvbW1hbmQ6ICdjb21tZW50cyd9O1xuXHRcdFx0XHRcdGNvbmZpZy5saW1pdFsnY29tbWVudHMnXSA9ICcyNSc7XG5cdFx0XHRcdFx0Y29uZmlnLm9yZGVyID0gJyc7XG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xuXHRcdFx0XHRsZXQgbmV3dXJsID0gdXJsLnN1YnN0cih1cmwuaW5kZXhPZignLycsMjgpKzEsMjAwKTtcblx0XHRcdFx0Ly8gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyDlhbEyNeWtl+WFg++8jOWboOatpOmBuDI46ZaL5aeL5om+L1xuXHRcdFx0XHRsZXQgcmVzdWx0ID0gbmV3dXJsLm1hdGNoKHJlZ2V4KTtcblx0XHRcdFx0bGV0IHVybHR5cGUgPSBmYmlkLmNoZWNrVHlwZSh1cmwpO1xuXHRcdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpPT57XG5cdFx0XHRcdFx0aWYgKGlkID09PSAncGVyc29uYWwnKXtcblx0XHRcdFx0XHRcdHVybHR5cGUgPSAncGVyc29uYWwnO1xuXHRcdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtwYWdlSUQ6IGlkLCB0eXBlOiB1cmx0eXBlLCBjb21tYW5kOiB0eXBlfTtcblx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJyl7XG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcblx0XHRcdFx0XHRcdGlmKHN0YXJ0ID49IDApe1xuXHRcdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsc3RhcnQpO1xuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs1LGVuZCk7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs2LHVybC5sZW5ndGgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bGV0IHZpZGVvID0gdXJsLmluZGV4T2YoJ3ZpZGVvcy8nKTtcblx0XHRcdFx0XHRcdGlmICh2aWRlbyA+PSAwKXtcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcblx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3B1cmUnKXtcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCcnKTtcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZXZlbnQnKXtcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSl7XG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reaJgOacieeVmeiogFxuXHRcdFx0XHRcdFx0XHRcdG9iai5jb21tYW5kID0gJ2ZlZWQnO1xuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMF07XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1x0XG5cdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3mn5Dnr4fnlZnoqIDnmoTnlZnoqIBcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzFdO1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdncm91cCcpe1xuXHRcdFx0XHRcdFx0XHRpZiAoZmIudXNlcl9wb3N0cyl7XG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xuXHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbMF07XG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyBcIl9cIiArb2JqLnB1cmVJRDtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdHN3YWwoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6ICfnpL7lnJjkvb/nlKjpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlnJgnLFxuXHRcdFx0XHRcdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXG5cdFx0XHRcdFx0XHRcdFx0fSkuZG9uZSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3Bob3RvJyl7XG5cdFx0XHRcdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XG5cdFx0XHRcdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XG5cdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKXtcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0Y2hlY2tUeXBlOiAocG9zdHVybCk9Pntcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCl7XG5cdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdwZXJtYWxpbmsnKSA+PSAwKXtcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHJldHVybiAncGVyc29uYWwnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9ncm91cHMvXCIpID49IDApe1xuXHRcdFx0cmV0dXJuICdncm91cCc7XG5cdFx0fTtcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpID49IDApe1xuXHRcdFx0cmV0dXJuICdldmVudCc7XG5cdFx0fTtcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL3Bob3Rvcy9cIikgPj0gMCl7XG5cdFx0XHRyZXR1cm4gJ3Bob3RvJztcblx0XHR9O1xuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ1wiJykgPj0gMCl7XG5cdFx0XHRyZXR1cm4gJ3B1cmUnO1xuXHRcdH07XG5cdFx0cmV0dXJuICdub3JtYWwnO1xuXHR9LFxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRsZXQgc3RhcnQgPSBwb3N0dXJsLmluZGV4T2YoXCJmYWNlYm9vay5jb21cIikrMTM7XG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XG5cdFx0XHRpZiAoZW5kIDwgMCl7XG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ2ZiaWQ9JykgPj0gMCl7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICd1bm5hbWUnKXtcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3VubmFtZScpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHJlc29sdmUocG9zdHVybC5tYXRjaChyZWdleClbMV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0bGV0IGdyb3VwID0gcG9zdHVybC5pbmRleE9mKCcvZ3JvdXBzLycpO1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBwb3N0dXJsLmluZGV4T2YoJy9ldmVudHMvJylcblx0XHRcdFx0aWYgKGdyb3VwID49IDApe1xuXHRcdFx0XHRcdHN0YXJ0ID0gZ3JvdXArODtcblx0XHRcdFx0XHRlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsc3RhcnQpO1xuXHRcdFx0XHRcdGxldCByZWdleDIgPSAvXFxkezYsfS9nO1xuXHRcdFx0XHRcdGxldCB0ZW1wID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcblx0XHRcdFx0XHRpZiAocmVnZXgyLnRlc3QodGVtcCkpe1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0ZW1wKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHJlc29sdmUoJ2dyb3VwJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZSBpZihldmVudCA+PSAwKXtcblx0XHRcdFx0XHRyZXNvbHZlKCdldmVudCcpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHR2YXIgcGFnZW5hbWUgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCxlbmQpO1xuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZW5hbWV9YCxmdW5jdGlvbihyZXMpe1xuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcil7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShyZXMuaWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdGZvcm1hdDogKHVybCk9Pntcblx0XHRpZiAodXJsLmluZGV4T2YoJ2J1c2luZXNzLmZhY2Vib29rLmNvbS8nKSA+PSAwKXtcblx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKTtcblx0XHRcdHJldHVybiB1cmw7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gdXJsO1xuXHRcdH1cblx0fVxufVxuXG5sZXQgZmlsdGVyID0ge1xuXHR0b3RhbEZpbHRlcjogKHJhd2RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIGVuZFRpbWUpPT57XG5cdFx0bGV0IGRhdGEgPSByYXdkYXRhLmRhdGE7XG5cdFx0aWYgKHdvcmQgIT09ICcnKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcblx0XHR9XG5cdFx0aWYgKGlzVGFnKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xuXHRcdH1cblx0XHRpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XG5cdFx0fWVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3Jhbmtlcicpe1xuXG5cdFx0fWVsc2V7XG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgZW5kVGltZSk7XG5cdFx0fVxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGF0YTtcblx0fSxcblx0dW5pcXVlOiAoZGF0YSk9Pntcblx0XHRsZXQgb3V0cHV0ID0gW107XG5cdFx0bGV0IGtleXMgPSBbXTtcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcblx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fSxcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xuXHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3QXJ5O1xuXHR9LFxuXHR0YWc6IChkYXRhKT0+e1xuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncyl7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBuZXdBcnk7XG5cdH0sXG5cdHRpbWU6IChkYXRhLCB0KT0+e1xuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xuXHRcdGxldCB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLChwYXJzZUludCh0aW1lX2FyeVsxXSktMSksdGltZV9hcnlbMl0sdGltZV9hcnlbM10sdGltZV9hcnlbNF0sdGltZV9hcnlbNV0pKS5fZDtcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcblx0XHRcdGlmIChjcmVhdGVkX3RpbWUgPCB0aW1lIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3QXJ5O1xuXHR9LFxuXHRyZWFjdDogKGRhdGEsIHRhcik9Pntcblx0XHRpZiAodGFyID09ICdhbGwnKXtcblx0XHRcdHJldHVybiBkYXRhO1xuXHRcdH1lbHNle1xuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcil7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG5ld0FyeTtcblx0XHR9XG5cdH1cbn1cblxubGV0IHVpID0ge1xuXHRpbml0OiAoKT0+e1xuXG5cdH0sXG5cdHJlc2V0OiAoKT0+e1xuXHRcdGxldCBjb21tYW5kID0gZGF0YS5yYXcuY29tbWFuZDtcblx0XHRpZiAoY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0fWVsc2V7XG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xuXHRcdH1cblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuXHRcdH1lbHNle1xuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKXtcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcblx0XHRcdH1cblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0fVxuXHR9XG59XG5cblxuZnVuY3Rpb24gbm93RGF0ZSgpe1xuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcbn1cblxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcbiAgICAgaWYgKGRhdGUgPCAxMCl7XG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XG4gICAgIH1cbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcbiAgICAgaWYgKG1pbiA8IDEwKXtcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XG4gICAgIH1cbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xuICAgICBpZiAoc2VjIDwgMTApe1xuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcbiAgICAgfVxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcbiAgICAgcmV0dXJuIHRpbWU7XG4gfVxuXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcbiBcdH0pO1xuIFx0cmV0dXJuIGFycmF5O1xuIH1cblxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcbiBcdHZhciBpLCByLCB0O1xuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XG4gXHRcdGFyeVtpXSA9IGk7XG4gXHR9XG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xuIFx0XHR0ID0gYXJ5W3JdO1xuIFx0XHRhcnlbcl0gPSBhcnlbaV07XG4gXHRcdGFyeVtpXSA9IHQ7XG4gXHR9XG4gXHRyZXR1cm4gYXJ5O1xuIH1cblxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xuICAgIFxuICAgIHZhciBDU1YgPSAnJzsgICAgXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXG4gICAgXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XG5cbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxuICAgIGlmIChTaG93TGFiZWwpIHtcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XG4gICAgICAgIFxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcbiAgICB9XG4gICAgXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xuICAgICAgICBcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xuICAgIH1cblxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gICBcbiAgICBcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxuICAgIFxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcbiAgICBcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXG4gICAgXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxuICAgIGxpbmsuaHJlZiA9IHVyaTtcbiAgICBcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XG4gICAgXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpbmsuY2xpY2soKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xufSJdfQ==
