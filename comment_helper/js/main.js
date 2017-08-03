"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
window.onerror = handleErr;

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
			var table = $(".main_table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});

			$("#searchName").on('blur change keyup', function () {
				table.columns(1).search(this.value).draw();
			});
			$("#searchComment").on('blur change keyup', function () {
				table.columns(2).search(this.value).draw();
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
				award.time = $(val).find('td').eq(4).text();
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
					li += "<li>\n\t\t\t\t<a href=\"https://www.facebook.com/" + i.userid + "\" target=\"_blank\"><img src=\"http://graph.facebook.com/" + i.userid + "/picture?type=large\" alt=\"\"></a>\n\t\t\t\t<div class=\"info\">\n\t\t\t\t<p class=\"name\"><a href=\"https://www.facebook.com/" + i.userid + "\" target=\"_blank\">" + i.name + "</a></p>\n\t\t\t\t<p class=\"message\"><a href=\"https://www.facebook.com/" + i.link + "\" target=\"_blank\">" + i.message + "</a></p>\n\t\t\t\t<p class=\"time\"><a href=\"https://www.facebook.com/" + i.link + "\" target=\"_blank\">" + i.time + "</a></p>\n\t\t\t\t</div>\n\t\t\t\t</li>";
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
		if (isDuplicate) {
			data = _filter.unique(data);
		}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsInZhbCIsImFwcGVuZCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJkYXRhIiwiZXh0ZW5zaW9uIiwiY2xpY2siLCJlIiwiZmIiLCJleHRlbnNpb25BdXRoIiwiZGF0YXMiLCJjb21tYW5kIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwicmFua2VyIiwicmF3IiwiZmluaXNoIiwiY3RybEtleSIsImFsdEtleSIsImNvbmZpZyIsIm9yZGVyIiwiZ2V0QXV0aCIsImxpa2VzIiwiY2hvb3NlIiwiaW5pdCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJmaWx0ZXIiLCJyZWFjdCIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwic2hhcmVCVE4iLCJhbGVydCIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIndvcmQiLCJhdXRoIiwidXNlcl9wb3N0cyIsInR5cGUiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJ0aXRsZSIsImh0bWwiLCJmYmlkIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImdldCIsInRoZW4iLCJyZXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2VfYXJyYXkiLCJmdWxsSUQiLCJwdXJlSUQiLCJ0b1N0cmluZyIsImFwaSIsImQiLCJmcm9tIiwiaWQiLCJuYW1lIiwicHVzaCIsImNyZWF0ZWRfdGltZSIsInVwZGF0ZWRfdGltZSIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsInVpIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsImkiLCJ0bXAiLCJwb3N0bGluayIsInN0b3J5IiwibGlrZV9jb3VudCIsIm1lc3NhZ2UiLCJ0aW1lQ29udmVydGVyIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInN0ciIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwiZmlsdGVyZGF0YSIsInRoZWFkIiwidGJvZHkiLCJwaWMiLCJob3N0IiwiZW50cmllcyIsImoiLCJwaWN0dXJlIiwidGQiLCJzY29yZSIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInZhbHVlIiwiZHJhdyIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsIm4iLCJwYXJzZUludCIsImZpbmQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsIm1hcCIsImluZGV4Iiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwibm93IiwiayIsInRhciIsImVxIiwiaW5zZXJ0QmVmb3JlIiwiZ2VuX2JpZ19hd2FyZCIsImxpIiwiYXdhcmRzIiwiaGFzQXR0cmlidXRlIiwiYXdhcmRfbmFtZSIsImF0dHIiLCJsaW5rIiwidGltZSIsImNsb3NlX2JpZ19hd2FyZCIsImVtcHR5Iiwic3Vic3RyaW5nIiwicG9zdHVybCIsIm9iaiIsIm9nX29iamVjdCIsInJlZ2V4IiwibmV3dXJsIiwic3Vic3RyIiwibWF0Y2giLCJ1cmx0eXBlIiwiY2hlY2tUeXBlIiwiY2hlY2tQYWdlSUQiLCJwYWdlSUQiLCJ2aWRlbyIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJlcnJvciIsInVuaXF1ZSIsInRhZyIsIm91dHB1dCIsImtleXMiLCJmb3JFYWNoIiwiaXRlbSIsImtleSIsIm5ld0FyeSIsImdyZXAiLCJtZXNzYWdlX3RhZ3MiLCJ0IiwidGltZV9hcnkiLCJzcGxpdCIsIm1vbWVudCIsIkRhdGUiLCJfZCIsImEiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5C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QTBCNUUsSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXG5cbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXG57XG5cdGlmICghZXJyb3JNZXNzYWdlKXtcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuYXBwZW5kKFwiPGJyPlwiKyQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcdFxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdGxldCBoYXNoID0gbG9jYXRpb24uc2VhcmNoO1xuXHRpZiAoaGFzaC5pbmRleE9mKFwiZXh0ZW5zaW9uXCIpID49IDApe1xuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdGRhdGEuZXh0ZW5zaW9uID0gdHJ1ZTtcblxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGggYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xuXHRcdH0pO1xuXHR9XG5cdGlmIChoYXNoLmluZGV4T2YoXCJyYW5rZXJcIikgPj0gMCl7XG5cdFx0bGV0IGRhdGFzID0ge1xuXHRcdFx0Y29tbWFuZDogJ3JhbmtlcicsXG5cdFx0XHRkYXRhOiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5yYW5rZXIpXG5cdFx0fVxuXHRcdGRhdGEucmF3ID0gZGF0YXM7XG5cdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xuXHR9XG5cblxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcblx0XHR9XG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcblx0fSk7XG5cblx0JChcIiNidG5fbGlrZVwiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcblx0XHRcdGNvbmZpZy5saWtlcyA9IHRydWU7XG5cdFx0fVxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xuXHR9KTtcblx0JChcIiNidG5fdXJsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0ZmIuZ2V0QXV0aCgndXJsX2NvbW1lbnRzJyk7XG5cdH0pO1xuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xuXHR9KTtcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0Y2hvb3NlLmluaXQoKTtcblx0fSk7XG5cdFxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XG5cdFx0fWVsc2V7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xuXHR9KTtcblxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xuXHRcdH1cblx0fSk7XG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcblx0XHRpZiAoIWUuY3RybEtleSB8fCBlLmFsdEtleSl7XG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6RVhDRUxcIik7XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xuXHRcdHRhYmxlLnJlZG8oKTtcblx0fSk7XG5cblx0JChcIi51aXBhbmVsIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcblx0XHR0YWJsZS5yZWRvKCk7XG5cdH0pO1xuXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xuXHRcdFwic2luZ2xlRGF0ZVBpY2tlclwiOiB0cnVlLFxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxuXHRcdFwibG9jYWxlXCI6IHtcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS1NTS1ERCAgIEhIOm1tXCIsXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xuXHRcdFx0XCLml6VcIixcblx0XHRcdFwi5LiAXCIsXG5cdFx0XHRcIuS6jFwiLFxuXHRcdFx0XCLkuIlcIixcblx0XHRcdFwi5ZubXCIsXG5cdFx0XHRcIuS6lFwiLFxuXHRcdFx0XCLlha1cIlxuXHRcdFx0XSxcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXG5cdFx0XHRcIuS4gOaciFwiLFxuXHRcdFx0XCLkuozmnIhcIixcblx0XHRcdFwi5LiJ5pyIXCIsXG5cdFx0XHRcIuWbm+aciFwiLFxuXHRcdFx0XCLkupTmnIhcIixcblx0XHRcdFwi5YWt5pyIXCIsXG5cdFx0XHRcIuS4g+aciFwiLFxuXHRcdFx0XCLlhavmnIhcIixcblx0XHRcdFwi5Lmd5pyIXCIsXG5cdFx0XHRcIuWNgeaciFwiLFxuXHRcdFx0XCLljYHkuIDmnIhcIixcblx0XHRcdFwi5Y2B5LqM5pyIXCJcblx0XHRcdF0sXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcblx0XHR9LFxuXHR9LGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XG5cdFx0dGFibGUucmVkbygpO1xuXHR9KTtcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShub3dEYXRlKCkpO1xuXG5cblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YSk7XG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcblx0XHRcdHdpbmRvdy5mb2N1cygpO1xuXHRcdH1lbHNle1xuXHRcdFx0aWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCl7XG5cdFx0XHRcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdFx0fWVsc2V7XHRcblx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xuXHR9KTtcblxuXHRsZXQgY2lfY291bnRlciA9IDA7XG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0Y2lfY291bnRlcisrO1xuXHRcdGlmIChjaV9jb3VudGVyID49IDUpe1xuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHR9XG5cdFx0aWYoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcblx0XHRcdFxuXHRcdH1cblx0fSk7XG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XG5cdH0pO1xufSk7XG5cbmZ1bmN0aW9uIHNoYXJlQlROKCl7XG5cdGFsZXJ0KCfoqo3nnJ/nnIvlrozot7Plh7rkvobnmoTpgqPpoIHkuIrpnaLlr6vkuobku4DpurxcXG5cXG7nnIvlrozkvaDlsLHmnIPnn6XpgZPkvaDngrrku4DpurzkuI3og73mipPliIbkuqsnKTtcbn1cblxubGV0IGNvbmZpZyA9IHtcblx0ZmllbGQ6IHtcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZScsJ2Zyb20nLCdjcmVhdGVkX3RpbWUnXSxcblx0XHRyZWFjdGlvbnM6IFtdLFxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcblx0XHR1cmxfY29tbWVudHM6IFtdLFxuXHRcdGZlZWQ6IFtdLFxuXHRcdGxpa2VzOiBbJ25hbWUnXVxuXHR9LFxuXHRsaW1pdDoge1xuXHRcdGNvbW1lbnRzOiAnNTAwJyxcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxuXHRcdGZlZWQ6ICc1MDAnLFxuXHRcdGxpa2VzOiAnNTAwJ1xuXHR9LFxuXHRhcGlWZXJzaW9uOiB7XG5cdFx0Y29tbWVudHM6ICd2Mi43Jyxcblx0XHRyZWFjdGlvbnM6ICd2Mi43Jyxcblx0XHRzaGFyZWRwb3N0czogJ3YyLjknLFxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxuXHRcdGZlZWQ6ICd2Mi45Jyxcblx0XHRncm91cDogJ3YyLjcnXG5cdH0sXG5cdGZpbHRlcjoge1xuXHRcdHdvcmQ6ICcnLFxuXHRcdHJlYWN0OiAnYWxsJyxcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcblx0fSxcblx0b3JkZXI6ICcnLFxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX21hbmFnZWRfZ3JvdXBzJyxcblx0bGlrZXM6IGZhbHNlXG59XG5cbmxldCBmYiA9IHtcblx0dXNlcl9wb3N0czogZmFsc2UsXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHR9LFxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xuXHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xuXHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcztcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIil7XG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcblx0XHRcdFx0XHRzd2FsKFxuXHRcdFx0XHRcdFx0J+S7mOiyu+aOiOasiuWujOaIkO+8jOiri+WGjeasoeWft+ihjOaKk+eVmeiogCcsXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGaW5pc2hlZCEgUGxlYXNlIGdldENvbW1lbnRzIGFnYWluLicsXG5cdFx0XHRcdFx0XHQnc3VjY2Vzcydcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRzd2FsKFxuXHRcdFx0XHRcdFx0J+S7mOiyu+aOiOasiuWkseaVl++8jOiri+iBr+e1oeeuoeeQhuWToeeiuuiqjScsXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xuXHRcdFx0XHRcdFx0KS5kb25lKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNlIGlmICh0eXBlID09IFwic2hhcmVkcG9zdHNcIil7XG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoXCJ1c2VyX3Bvc3RzXCIpIDwgMCl7XG5cdFx0XHRcdFx0c3dhbCh7XG5cdFx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXG5cdFx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXG5cdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcblx0XHRcdFx0XHR9KS5kb25lKCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xuXHRcdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoXCJ1c2VyX3Bvc3RzXCIpID49IDApe1xuXHRcdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcdFx0XHRcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0XHR9XG5cdH0sXG5cdGV4dGVuc2lvbkF1dGg6ICgpPT57XG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XG5cdH0sXG5cdGV4dGVuc2lvbkNhbGxiYWNrOiAocmVzcG9uc2UpPT57XG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcblx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmRleE9mKFwidXNlcl9wb3N0c1wiKSA8IDApe1xuXHRcdFx0XHRzd2FsKHtcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXG5cdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xuXHRcdFx0XHR9KS5kb25lKCk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5hZGRDbGFzcyhcImhpZGVcIik7XG5cdFx0XHRcdGxldCBkYXRhcyA9IHtcblx0XHRcdFx0XHRjb21tYW5kOiAnc2hhcmVkcG9zdHMnLFxuXHRcdFx0XHRcdGRhdGE6IEpTT04ucGFyc2UoJChcIi5jaHJvbWVcIikudmFsKCkpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZGF0YS5yYXcgPSBkYXRhcztcblx0XHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xuXHRcdFx0fVxuXHRcdH1lbHNle1xuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHRcdH1cblx0fVxufVxuXG5sZXQgZGF0YSA9IHtcblx0cmF3OiBbXSxcblx0dXNlcmlkOiAnJyxcblx0bm93TGVuZ3RoOiAwLFxuXHRleHRlbnNpb246IGZhbHNlLFxuXHRpbml0OiAoKT0+e1xuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5bos4fmlpnkuK0uLi4nKTtcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XG5cdFx0ZGF0YS5yYXcgPSBbXTtcblx0fSxcblx0c3RhcnQ6IChmYmlkKT0+e1xuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0ZGF0YS5nZXQoZmJpZCkudGhlbigocmVzKT0+e1xuXHRcdFx0ZmJpZC5kYXRhID0gcmVzO1xuXHRcdFx0ZGF0YS5maW5pc2goZmJpZCk7XG5cdFx0fSk7XG5cdH0sXG5cdGdldDogKGZiaWQpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XG5cdFx0XHRsZXQgY29tbWFuZCA9IGZiaWQuY29tbWFuZDtcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpIGNvbW1hbmQgPSAnZ3JvdXAnO1xuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJyAmJiBmYmlkLmNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKSBmYmlkLmZ1bGxJRCA9IGZiaWQucHVyZUlEO1xuXHRcdFx0aWYgKGNvbmZpZy5saWtlcykgZmJpZC5jb21tYW5kID0gJ2xpa2VzJztcblx0XHRcdGNvbnNvbGUubG9nKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mZGVidWc9YWxsYCk7XG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZvcmRlcj0ke2NvbmZpZy5vcmRlcn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mZGVidWc9YWxsYCwocmVzKT0+e1xuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xuXHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRcdGlmIChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGNvbmZpZy5saWtlcykgZC50eXBlID0gXCJMSUtFXCI7XG5cdFx0XHRcdFx0aWYgKGQuZnJvbSl7XG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0Ly9ldmVudFxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLmlkfTtcblx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCl7XG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XG5cdFx0XHRcdFx0XHRpZiAoZC5pZCl7XG5cdFx0XHRcdFx0XHRcdGlmIChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKGQuZnJvbSl7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0Ly9ldmVudFxuXHRcdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pLmZhaWwoKCk9Pntcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdGZpbmlzaDogKGZiaWQpPT57XG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdCQoXCIudXBkYXRlX2FyZWEsLmRvbmF0ZV9hcmVhXCIpLnNsaWRlVXAoKTtcblx0XHQkKFwiLnJlc3VsdF9hcmVhXCIpLnNsaWRlRG93bigpO1xuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xuXHRcdGRhdGEucmF3ID0gZmJpZDtcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XG5cdFx0dWkucmVzZXQoKTtcblx0fSxcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSk9Pntcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcblx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcblx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XG5cdFx0cmF3RGF0YS5maWx0ZXJlZCA9IG5ld0RhdGE7XG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKXtcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1x0XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gcmF3RGF0YTtcblx0XHR9XG5cdH0sXG5cdGV4Y2VsOiAocmF3KT0+e1xuXHRcdHZhciBuZXdPYmogPSBbXTtcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pe1xuXHRcdFx0JC5lYWNoKHJhdy5kYXRhLGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHR2YXIgdG1wID0ge1xuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxuXHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCIgOiB0aGlzLnBvc3RsaW5rLFxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxuXHRcdFx0XHRcdFwi6Kmy5YiG5Lqr6K6a5pW4XCIgOiB0aGlzLmxpa2VfY291bnRcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHQkLmVhY2gocmF3LmRhdGEsZnVuY3Rpb24oaSl7XG5cdFx0XHRcdHZhciB0bXAgPSB7XG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXG5cdFx0XHRcdFx0XCLooajmg4VcIiA6IHRoaXMudHlwZSB8fCAnJyxcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXG5cdFx0XHRcdH1cblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gbmV3T2JqO1xuXHR9LFxuXHRpbXBvcnQ6IChmaWxlKT0+e1xuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xuXHRcdH1cblxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuXHR9XG59XG5cbmxldCB0YWJsZSA9IHtcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XG5cdFx0bGV0IGZpbHRlcmRhdGEgPSByYXdkYXRhLmZpbHRlcmVkO1xuXHRcdGxldCB0aGVhZCA9ICcnO1xuXHRcdGxldCB0Ym9keSA9ICcnO1xuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XG5cdFx0aWYocmF3ZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpe1xuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cblx0XHRcdDx0ZD7ooajmg4U8L3RkPmA7XG5cdFx0fWVsc2UgaWYocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XG5cdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XG5cdFx0fWVsc2UgaWYocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJyl7XG5cdFx0XHR0aGVhZCA9IGA8dGQ+5o6S5ZCNPC90ZD5cblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxuXHRcdFx0PHRkPuWIhuaVuDwvdGQ+YDtcblx0XHR9ZWxzZXtcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxuXHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cblx0XHRcdDx0ZD7orpo8L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xuXHRcdH1cblxuXHRcdGxldCBob3N0ID0gJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyc7XG5cdFx0aWYgKGRhdGEucmF3LnR5cGUgPT09ICd1cmxfY29tbWVudHMnKSBob3N0ID0gJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSArICc/ZmJfY29tbWVudF9pZD0nO1xuXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJkYXRhLmVudHJpZXMoKSl7XG5cdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xuXHRcdFx0XG5cdFx0XHRpZiAocGljKXtcblx0XHRcdFx0cGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XG5cdFx0XHR9XG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcblx0XHRcdGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XG5cdFx0XHR9ZWxzZSBpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpe1xuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3Rvcnl9PC9hPjwvdGQ+XG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XG5cdFx0XHR9ZWxzZSBpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKXtcblx0XHRcdFx0dGQgPSBgPHRkPiR7aisxfTwvdGQ+XG5cdFx0XHRcdFx0ICA8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cblx0XHRcdFx0XHQgIDx0ZD4ke3ZhbC5zY29yZX08L3RkPmA7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cIiR7aG9zdH0ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxuXHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xuXHRcdFx0fVxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcblx0XHRcdHRib2R5ICs9IHRyO1xuXHRcdH1cblx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xuXG5cblx0XHRhY3RpdmUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xuXHRcdFx0bGV0IHRhYmxlID0gJChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSh7XG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxuXHRcdFx0fSk7XG5cblx0XHRcdCQoXCIjc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0YWJsZVxuXHRcdFx0XHQuY29sdW1ucygxKVxuXHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXG5cdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHR9KTtcblx0XHRcdCQoXCIjc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0YWJsZVxuXHRcdFx0XHQuY29sdW1ucygyKVxuXHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXG5cdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdHJlZG86ICgpPT57XG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xuXHR9XG59XG5cbmxldCBjaG9vc2UgPSB7XG5cdGRhdGE6IFtdLFxuXHRhd2FyZDogW10sXG5cdG51bTogMCxcblx0ZGV0YWlsOiBmYWxzZSxcblx0bGlzdDogW10sXG5cdGluaXQ6ICgpPT57XG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xuXHRcdGNob29zZS5udW0gPSAwO1xuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xuXHRcdFx0XHRpZiAobiA+IDApe1xuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XG5cdFx0fVxuXHRcdGNob29zZS5nbygpO1xuXHR9LFxuXHRnbzogKCk9Pntcblx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YS5maWx0ZXJlZC5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1xuXHRcdGxldCBpbnNlcnQgPSAnJztcblx0XHRjaG9vc2UuYXdhcmQubWFwKCh2YWwsIGluZGV4KT0+e1xuXHRcdFx0aW5zZXJ0ICs9ICc8dHIgdGl0bGU9XCLnrKwnKyhpbmRleCsxKSsn5ZCNXCI+JyArICQoJy5tYWluX3RhYmxlJykuRGF0YVRhYmxlKCkucm93cyh7c2VhcmNoOidhcHBsaWVkJ30pLm5vZGVzKClbdmFsXS5pbm5lckhUTUwgKyAnPC90cj4nO1xuXHRcdH0pXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcblxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xuXHRcdFx0bGV0IG5vdyA9IDA7XG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI1XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xuXHRcdFx0fVxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xuXHRcdH1cblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XG5cdH0sXG5cdGdlbl9iaWdfYXdhcmQ6ICgpPT57XG5cdFx0bGV0IGxpID0gJyc7XG5cdFx0bGV0IGF3YXJkcyA9IFtdO1xuXHRcdCQoJyNhd2FyZExpc3QgdGJvZHkgdHInKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCB2YWwpe1xuXHRcdFx0bGV0IGF3YXJkID0ge307XG5cdFx0XHRpZiAodmFsLmhhc0F0dHJpYnV0ZSgndGl0bGUnKSl7XG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSBmYWxzZTtcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS50ZXh0KCk7XG5cdFx0XHRcdGF3YXJkLnVzZXJpZCA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJykucmVwbGFjZSgnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJywnJyk7XG5cdFx0XHRcdGF3YXJkLm1lc3NhZ2UgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykudGV4dCgpO1xuXHRcdFx0XHRhd2FyZC5saW5rID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcblx0XHRcdFx0YXdhcmQudGltZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDQpLnRleHQoKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRhd2FyZC5hd2FyZF9uYW1lID0gdHJ1ZTtcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLnRleHQoKTtcblx0XHRcdH1cblx0XHRcdGF3YXJkcy5wdXNoKGF3YXJkKTtcblx0XHR9KTtcblx0XHRmb3IobGV0IGkgb2YgYXdhcmRzKXtcblx0XHRcdGlmIChpLmF3YXJkX25hbWUgPT09IHRydWUpe1xuXHRcdFx0XHRsaSArPSBgPGxpIGNsYXNzPVwicHJpemVOYW1lXCI+JHtpLm5hbWV9PC9saT5gO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGxpICs9IGA8bGk+XG5cdFx0XHRcdDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH0vcGljdHVyZT90eXBlPWxhcmdlXCIgYWx0PVwiXCI+PC9hPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5mb1wiPlxuXHRcdFx0XHQ8cCBjbGFzcz1cIm5hbWVcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLm5hbWV9PC9hPjwvcD5cblx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubWVzc2FnZX08L2E+PC9wPlxuXHRcdFx0XHQ8cCBjbGFzcz1cInRpbWVcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS50aW1lfTwvYT48L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2xpPmA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCQoJy5iaWdfYXdhcmQgdWwnKS5hcHBlbmQobGkpO1xuXHRcdCQoJy5iaWdfYXdhcmQnKS5hZGRDbGFzcygnc2hvdycpO1xuXHR9LFxuXHRjbG9zZV9iaWdfYXdhcmQ6ICgpPT57XG5cdFx0JCgnLmJpZ19hd2FyZCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmVtcHR5KCk7XG5cdH1cbn1cblxubGV0IGZiaWQgPSB7XG5cdGZiaWQ6IFtdLFxuXHRpbml0OiAodHlwZSk9Pntcblx0XHRmYmlkLmZiaWQgPSBbXTtcblx0XHRkYXRhLmluaXQoKTtcblx0XHRGQi5hcGkoXCIvbWVcIixmdW5jdGlvbihyZXMpe1xuXHRcdFx0ZGF0YS51c2VyaWQgPSByZXMuaWQ7XG5cdFx0XHRsZXQgdXJsID0gZmJpZC5mb3JtYXQoJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XG5cdFx0XHRpZiAodXJsLmluZGV4T2YoJy5waHA/JykgPT09IC0xICYmIHVybC5pbmRleE9mKCc/JykgPiAwKXtcblx0XHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZignPycpKTtcblx0XHRcdH1cblx0XHRcdGZiaWQuZ2V0KHVybCwgdHlwZSkudGhlbigoZmJpZCk9Pntcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcblx0XHRcdH0pXG5cdFx0XHQvLyAkKCcuaWRlbnRpdHknKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoYOeZu+WFpei6q+S7ve+8mjxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Jlcy5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PHNwYW4+JHtyZXMubmFtZX08L3NwYW4+YCk7XG5cdFx0fSk7XG5cdH0sXG5cdGdldDogKHVybCwgdHlwZSk9Pntcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9Pntcblx0XHRcdGlmICh0eXBlID09ICd1cmxfY29tbWVudHMnKXtcblx0XHRcdFx0bGV0IHBvc3R1cmwgPSB1cmw7XG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCI/XCIpID4gMCl7XG5cdFx0XHRcdFx0cG9zdHVybCA9IHBvc3R1cmwuc3Vic3RyaW5nKDAscG9zdHVybC5pbmRleE9mKFwiP1wiKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0RkIuYXBpKGAvJHtwb3N0dXJsfWAsZnVuY3Rpb24ocmVzKXtcblx0XHRcdFx0XHRsZXQgb2JqID0ge2Z1bGxJRDogcmVzLm9nX29iamVjdC5pZCwgdHlwZTogdHlwZSwgY29tbWFuZDogJ2NvbW1lbnRzJ307XG5cdFx0XHRcdFx0Y29uZmlnLmxpbWl0Wydjb21tZW50cyddID0gJzI1Jztcblx0XHRcdFx0XHRjb25maWcub3JkZXIgPSAnJztcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XG5cdFx0XHRcdGxldCBuZXd1cmwgPSB1cmwuc3Vic3RyKHVybC5pbmRleE9mKCcvJywyOCkrMSwyMDApO1xuXHRcdFx0XHQvLyBodHRwczovL3d3dy5mYWNlYm9vay5jb20vIOWFsTI15a2X5YWD77yM5Zug5q2k6YG4Mjjplovlp4vmib4vXG5cdFx0XHRcdGxldCByZXN1bHQgPSBuZXd1cmwubWF0Y2gocmVnZXgpO1xuXHRcdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XG5cdFx0XHRcdGZiaWQuY2hlY2tQYWdlSUQodXJsLCB1cmx0eXBlKS50aGVuKChpZCk9Pntcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpe1xuXHRcdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XG5cdFx0XHRcdFx0XHRpZCA9IGRhdGEudXNlcmlkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsZXQgb2JqID0ge3BhZ2VJRDogaWQsIHR5cGU6IHVybHR5cGUsIGNvbW1hbmQ6IHR5cGV9O1xuXHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAncGVyc29uYWwnKXtcblx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdmYmlkPScpO1xuXHRcdFx0XHRcdFx0aWYoc3RhcnQgPj0gMCl7XG5cdFx0XHRcdFx0XHRcdGxldCBlbmQgPSB1cmwuaW5kZXhPZihcIiZcIixzdGFydCk7XG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzUsZW5kKTtcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZigncG9zdHMvJyk7XG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzYsdXJsLmxlbmd0aCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRsZXQgdmlkZW8gPSB1cmwuaW5kZXhPZigndmlkZW9zLycpO1xuXHRcdFx0XHRcdFx0aWYgKHZpZGVvID49IDApe1xuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHRcdH1lbHNlIGlmICh1cmx0eXBlID09PSAncHVyZScpe1xuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHVybC5yZXBsYWNlKC9cXFwiL2csJycpO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdldmVudCcpe1xuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxKXtcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5omA5pyJ55WZ6KiAXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmNvbW1hbmQgPSAnZmVlZCc7XG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFswXTtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHRcblx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reafkOevh+eVmeiogOeahOeVmeiogFxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMV07XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ2dyb3VwJyl7XG5cdFx0XHRcdFx0XHRcdGlmIChmYi51c2VyX3Bvc3RzKXtcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XG5cdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFswXTtcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArIFwiX1wiICtvYmoucHVyZUlEO1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcblx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0c3dhbCh7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aXRsZTogJ+ekvuWcmOS9v+eUqOmcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWcmCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcblx0XHRcdFx0XHRcdFx0XHR9KS5kb25lKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1lbHNlIGlmICh1cmx0eXBlID09PSAncGhvdG8nKXtcblx0XHRcdFx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcblx0XHRcdFx0XHRcdFx0bGV0IHJlc3VsdCA9IHVybC5tYXRjaChyZWdleCk7XG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcblx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSB8fCByZXN1bHQubGVuZ3RoID09IDMpe1xuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcblx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICd1bm5hbWUnKXtcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRjaGVja1R5cGU6IChwb3N0dXJsKT0+e1xuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJmYmlkPVwiKSA+PSAwKXtcblx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ3Blcm1hbGluaycpID49IDApe1xuXHRcdFx0XHRyZXR1cm4gJ3VubmFtZSc7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0cmV0dXJuICdwZXJzb25hbCc7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL2dyb3Vwcy9cIikgPj0gMCl7XG5cdFx0XHRyZXR1cm4gJ2dyb3VwJztcblx0XHR9O1xuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJldmVudHNcIikgPj0gMCl7XG5cdFx0XHRyZXR1cm4gJ2V2ZW50Jztcblx0XHR9O1xuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvcGhvdG9zL1wiKSA+PSAwKXtcblx0XHRcdHJldHVybiAncGhvdG8nO1xuXHRcdH07XG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignXCInKSA+PSAwKXtcblx0XHRcdHJldHVybiAncHVyZSc7XG5cdFx0fTtcblx0XHRyZXR1cm4gJ25vcm1hbCc7XG5cdH0sXG5cdGNoZWNrUGFnZUlEOiAocG9zdHVybCwgdHlwZSk9Pntcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9Pntcblx0XHRcdGxldCBzdGFydCA9IHBvc3R1cmwuaW5kZXhPZihcImZhY2Vib29rLmNvbVwiKSsxMztcblx0XHRcdGxldCBlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsc3RhcnQpO1xuXHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcblx0XHRcdGlmIChlbmQgPCAwKXtcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignZmJpZD0nKSA+PSAwKXtcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3VubmFtZScpe1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSgndW5uYW1lJyk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0cmVzb2x2ZShwb3N0dXJsLm1hdGNoKHJlZ2V4KVsxXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNle1xuXHRcdFx0XHRsZXQgZ3JvdXAgPSBwb3N0dXJsLmluZGV4T2YoJy9ncm91cHMvJyk7XG5cdFx0XHRcdGxldCBldmVudCA9IHBvc3R1cmwuaW5kZXhPZignL2V2ZW50cy8nKVxuXHRcdFx0XHRpZiAoZ3JvdXAgPj0gMCl7XG5cdFx0XHRcdFx0c3RhcnQgPSBncm91cCs4O1xuXHRcdFx0XHRcdGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIixzdGFydCk7XG5cdFx0XHRcdFx0bGV0IHJlZ2V4MiA9IC9cXGR7Nix9L2c7XG5cdFx0XHRcdFx0bGV0IHRlbXAgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCxlbmQpO1xuXHRcdFx0XHRcdGlmIChyZWdleDIudGVzdCh0ZW1wKSl7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRlbXApO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSgnZ3JvdXAnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1lbHNlIGlmKGV2ZW50ID49IDApe1xuXHRcdFx0XHRcdHJlc29sdmUoJ2V2ZW50Jyk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHZhciBwYWdlbmFtZSA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LGVuZCk7XG5cdFx0XHRcdFx0RkIuYXBpKGAvJHtwYWdlbmFtZX1gLGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKXtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0Zm9ybWF0OiAodXJsKT0+e1xuXHRcdGlmICh1cmwuaW5kZXhPZignYnVzaW5lc3MuZmFjZWJvb2suY29tLycpID49IDApe1xuXHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xuXHRcdFx0cmV0dXJuIHVybDtcblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybiB1cmw7XG5cdFx0fVxuXHR9XG59XG5cbmxldCBmaWx0ZXIgPSB7XG5cdHRvdGFsRmlsdGVyOiAocmF3ZGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9Pntcblx0XHRsZXQgZGF0YSA9IHJhd2RhdGEuZGF0YTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XG5cdFx0fVxuXHRcdGlmICh3b3JkICE9PSAnJyl7XG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XG5cdFx0fVxuXHRcdGlmIChpc1RhZyl7XG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcblx0XHR9XG5cdFx0aWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1x0XG5cdFx0fWVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3Jhbmtlcicpe1xuXG5cdFx0fWVsc2V7XG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgZW5kVGltZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH0sXG5cdHVuaXF1ZTogKGRhdGEpPT57XG5cdFx0bGV0IG91dHB1dCA9IFtdO1xuXHRcdGxldCBrZXlzID0gW107XG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH0sXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0dGFnOiAoZGF0YSk9Pntcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3QXJ5O1xuXHR9LFxuXHR0aW1lOiAoZGF0YSwgdCk9Pntcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuZXdBcnk7XG5cdFx0fVxuXHR9XG59XG5cbmxldCB1aSA9IHtcblx0aW5pdDogKCk9PntcblxuXHR9LFxuXHRyZXNldDogKCk9Pntcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XG5cdFx0aWYgKGNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuXHRcdH1lbHNle1xuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHR9XG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xuXHRcdFx0JCgnbGFiZWwudGFnJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcblx0XHR9ZWxzZXtcblx0XHRcdGlmICgkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKSl7XG5cdFx0XHRcdCQoXCIjdGFnXCIpLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHQkKCdsYWJlbC50YWcnKS5hZGRDbGFzcygnaGlkZScpO1xuXHRcdH1cblx0fVxufVxuXG5cblxuXG5mdW5jdGlvbiBub3dEYXRlKCl7XG5cdHZhciBhID0gbmV3IERhdGUoKTtcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSsxO1xuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XG5cdHJldHVybiB5ZWFyK1wiLVwiK21vbnRoK1wiLVwiK2RhdGUrXCItXCIraG91citcIi1cIittaW4rXCItXCIrc2VjO1xufVxuXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKXtcblx0IHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcbiAgICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XG4gICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xuICAgICBpZiAoZGF0ZSA8IDEwKXtcbiAgICAgXHRkYXRlID0gXCIwXCIrZGF0ZTtcbiAgICAgfVxuICAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcbiAgICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xuICAgICBpZiAobWluIDwgMTApe1xuICAgICBcdG1pbiA9IFwiMFwiK21pbjtcbiAgICAgfVxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XG4gICAgIGlmIChzZWMgPCAxMCl7XG4gICAgIFx0c2VjID0gXCIwXCIrc2VjO1xuICAgICB9XG4gICAgIHZhciB0aW1lID0geWVhcisnLScrbW9udGgrJy0nK2RhdGUrXCIgXCIraG91cisnOicrbWluKyc6JytzZWMgO1xuICAgICByZXR1cm4gdGltZTtcbiB9XG5cbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gXHRcdHJldHVybiBbdmFsdWVdO1xuIFx0fSk7XG4gXHRyZXR1cm4gYXJyYXk7XG4gfVxuXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xuIFx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xuIFx0dmFyIGksIHIsIHQ7XG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcbiBcdFx0YXJ5W2ldID0gaTtcbiBcdH1cbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xuIFx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XG4gXHRcdHQgPSBhcnlbcl07XG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcbiBcdFx0YXJ5W2ldID0gdDtcbiBcdH1cbiBcdHJldHVybiBhcnk7XG4gfVxuXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XG4gICAgXG4gICAgdmFyIENTViA9ICcnOyAgICBcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcbiAgICBcbiAgICAvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcblxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXG4gICAgaWYgKFNob3dMYWJlbCkge1xuICAgICAgICB2YXIgcm93ID0gXCJcIjtcbiAgICAgICAgXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xuICAgICAgICB9XG5cbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xuICAgIH1cbiAgICBcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XG4gICAgICAgIFxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xuICAgICAgICB9XG5cbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcbiAgICAgICAgXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XG4gICAgfVxuXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfSAgIFxuICAgIFxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcbiAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXG4gICAgXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xuICAgIFxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcbiAgICBcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXG4gICAgbGluay5ocmVmID0gdXJpO1xuICAgIFxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XG4gICAgbGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcbiAgICBcbiAgICAvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgbGluay5jbGljaygpO1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG59Il19
