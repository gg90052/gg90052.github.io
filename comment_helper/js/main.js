"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
window.onerror = handleErr;
var TABLE;
var lastCommand = 'comments';
var addLink = false;

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
	$("#morepost").click(function () {
		ui.addLink();
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
	getAuth: function getAuth() {
		var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		if (type === '') {
			addLink = true;
			type = lastCommand;
		} else {
			addLink = false;
			lastCommand = type;
		}
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
		if (!addLink) {
			data.raw = [];
		}
	},
	start: function start(fbid) {
		$(".waiting").removeClass("hide");
		$('.pure_fbid').text(fbid.fullID);
		data.get(fbid).then(function (res) {
			// fbid.data = res;
			fbid.data = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = res[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var i = _step.value;

					fbid.data.push(i);
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
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = res.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var d = _step2.value;

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
			});

			function getNext(url) {
				var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

				if (limit !== 0) {
					url = url.replace('limit=500', 'limit=' + limit);
				}
				$.getJSON(url, function (res) {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = res.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var d = _step3.value;

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

		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = filterdata.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var _step4$value = _slicedToArray(_step4.value, 2),
				    j = _step4$value[0],
				    val = _step4$value[1];

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
		var _iteratorNormalCompletion5 = true;
		var _didIteratorError5 = false;
		var _iteratorError5 = undefined;

		try {
			for (var _iterator5 = awards[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
				var i = _step5.value;

				if (i.award_name === true) {
					li += "<li class=\"prizeName\">" + i.name + "</li>";
				} else {
					li += "<li>\n\t\t\t\t<a href=\"https://www.facebook.com/" + i.userid + "\" target=\"_blank\"><img src=\"http://graph.facebook.com/" + i.userid + "/picture?type=large\" alt=\"\"></a>\n\t\t\t\t<div class=\"info\">\n\t\t\t\t<p class=\"name\"><a href=\"https://www.facebook.com/" + i.userid + "\" target=\"_blank\">" + i.name + "</a></p>\n\t\t\t\t<p class=\"message\"><a href=\"" + i.link + "\" target=\"_blank\">" + i.message + "</a></p>\n\t\t\t\t<p class=\"time\"><a href=\"" + i.link + "\" target=\"_blank\">" + i.time + "</a></p>\n\t\t\t\t</div>\n\t\t\t\t</li>";
				}
			}
		} catch (err) {
			_didIteratorError5 = true;
			_iteratorError5 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion5 && _iterator5.return) {
					_iterator5.return();
				}
			} finally {
				if (_didIteratorError5) {
					throw _iteratorError5;
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
			var url = '';
			if (addLink) {
				url = fbid.format($('.morelink .addurl').val());
				$('.morelink .addurl').val('');
			} else {
				url = fbid.format($('#enterURL .url').val());
			}
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
					var obj = { pageID: id, type: urltype, command: type, data: [] };
					if (addLink) obj.data = data.raw.data; //追加貼文
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
	addLink: function addLink() {
		var tar = $('.inputarea .morelink');
		if (tar.hasClass('show')) {
			tar.removeClass('show');
		} else {
			tar.addClass('show');
		}
	},
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIlRBQkxFIiwibGFzdENvbW1hbmQiLCJhZGRMaW5rIiwibXNnIiwidXJsIiwibCIsImNvbnNvbGUiLCJsb2ciLCIkIiwidmFsIiwiYXBwZW5kIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImhhc2giLCJsb2NhdGlvbiIsInNlYXJjaCIsImluZGV4T2YiLCJyZW1vdmVDbGFzcyIsImRhdGEiLCJleHRlbnNpb24iLCJjbGljayIsImUiLCJmYiIsImV4dGVuc2lvbkF1dGgiLCJkYXRhcyIsImNvbW1hbmQiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJyYW5rZXIiLCJyYXciLCJmaW5pc2giLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJnZXRBdXRoIiwibGlrZXMiLCJjaG9vc2UiLCJpbml0IiwidWkiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwia2V5ZG93biIsInRleHQiLCJrZXl1cCIsIm9uIiwidGFibGUiLCJyZWRvIiwiY2hhbmdlIiwiZmlsdGVyIiwicmVhY3QiLCJkYXRlcmFuZ2VwaWNrZXIiLCJzdGFydCIsImVuZCIsImxhYmVsIiwiZW5kVGltZSIsImZvcm1hdCIsInNldFN0YXJ0RGF0ZSIsIm5vd0RhdGUiLCJmaWx0ZXJEYXRhIiwic3RyaW5naWZ5Iiwib3BlbiIsImZvY3VzIiwibGVuZ3RoIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiZXhjZWwiLCJleGNlbFN0cmluZyIsImNpX2NvdW50ZXIiLCJpbXBvcnQiLCJmaWxlcyIsInNoYXJlQlROIiwiYWxlcnQiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJ3b3JkIiwiYXV0aCIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsInN3YWwiLCJkb25lIiwidGl0bGUiLCJodG1sIiwiZmJpZCIsImV4dGVuc2lvbkNhbGxiYWNrIiwidXNlcmlkIiwibm93TGVuZ3RoIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJnZXQiLCJ0aGVuIiwicmVzIiwiaSIsInB1c2giLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2VfYXJyYXkiLCJwdXJlSUQiLCJ0b1N0cmluZyIsImFwaSIsImQiLCJmcm9tIiwiaWQiLCJuYW1lIiwiY3JlYXRlZF90aW1lIiwidXBkYXRlZF90aW1lIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwic3RvcnkiLCJsaWtlX2NvdW50IiwibWVzc2FnZSIsInRpbWVDb252ZXJ0ZXIiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50Iiwic3RyIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsInBpYyIsImhvc3QiLCJlbnRyaWVzIiwiaiIsInBpY3R1cmUiLCJ0ZCIsInNjb3JlIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwibiIsInBhcnNlSW50IiwiZmluZCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwibWFwIiwiaW5kZXgiLCJyb3dzIiwibm9kZXMiLCJpbm5lckhUTUwiLCJub3ciLCJrIiwidGFyIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJnZW5fYmlnX2F3YXJkIiwibGkiLCJhd2FyZHMiLCJoYXNBdHRyaWJ1dGUiLCJhd2FyZF9uYW1lIiwiYXR0ciIsImxpbmsiLCJ0aW1lIiwiY2xvc2VfYmlnX2F3YXJkIiwiZW1wdHkiLCJzdWJzdHJpbmciLCJwb3N0dXJsIiwib2JqIiwib2dfb2JqZWN0IiwicmVnZXgiLCJuZXd1cmwiLCJzdWJzdHIiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsInZpZGVvIiwicmVnZXgyIiwidGVtcCIsInRlc3QiLCJwYWdlbmFtZSIsImVycm9yIiwidGFnIiwidW5pcXVlIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsInNwbGl0IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwiYSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwicm93Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdz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aEUsT0FBT2xNLFNBQVN3USxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQXRFLE1BQUt1RSxJQUFMLEdBQVlILEdBQVo7O0FBRUE7QUFDQXBFLE1BQUt3RSxLQUFMLEdBQWEsbUJBQWI7QUFDQXhFLE1BQUt5RSxRQUFMLEdBQWdCTixXQUFXLE1BQTNCOztBQUVBO0FBQ0FyUSxVQUFTNFEsSUFBVCxDQUFjQyxXQUFkLENBQTBCM0UsSUFBMUI7QUFDQUEsTUFBS3pMLEtBQUw7QUFDQVQsVUFBUzRRLElBQVQsQ0FBY0UsV0FBZCxDQUEwQjVFLElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyO1xyXG52YXIgVEFCTEU7XHJcbnZhciBsYXN0Q29tbWFuZCA9ICdjb21tZW50cyc7XHJcbnZhciBhZGRMaW5rID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5hcHBlbmQoXCI8YnI+XCIrJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcdFxyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHRsZXQgaGFzaCA9IGxvY2F0aW9uLnNlYXJjaDtcclxuXHRpZiAoaGFzaC5pbmRleE9mKFwiZXh0ZW5zaW9uXCIpID49IDApe1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRkYXRhLmV4dGVuc2lvbiA9IHRydWU7XHJcblxyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aCBidXR0b25cIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRpZiAoaGFzaC5pbmRleE9mKFwicmFua2VyXCIpID49IDApe1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiAncmFua2VyJyxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucmFua2VyKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcblxyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0Y29uZmlnLmxpa2VzID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgndXJsX2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fcGF5XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHQkKFwiI21vcmVwb3N0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR1aS5hZGRMaW5rKCk7XHJcblx0fSk7XHJcblx0XHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6RVhDRUxcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XHJcblx0XHRcInNpbmdsZURhdGVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS1NTS1ERCAgIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSxmdW5jdGlvbihzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShub3dEYXRlKCkpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YSk7XHJcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xyXG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKXtcclxuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0fWVsc2V7XHRcclxuXHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpe1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZihlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHRcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHNoYXJlQlROKCl7XHJcblx0YWxlcnQoJ+iqjeecn+eci+WujOi3s+WHuuS+hueahOmCo+mggeS4iumdouWvq+S6huS7gOm6vFxcblxcbueci+WujOS9oOWwseacg+efpemBk+S9oOeCuuS7gOm6vOS4jeiDveaKk+WIhuS6qycpO1xyXG59XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZScsJ2Zyb20nLCdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogW10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnLFxyXG5cdFx0bGlrZXM6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YyLjcnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuNycsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YyLjknLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuNycsXHJcblx0XHRmZWVkOiAndjIuOScsXHJcblx0XHRncm91cDogJ3YyLjcnXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRvcmRlcjogJycsXHJcblx0YXV0aDogJ3VzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9tYW5hZ2VkX2dyb3VwcycsXHJcblx0bGlrZXM6IGZhbHNlXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHR1c2VyX3Bvc3RzOiBmYWxzZSxcclxuXHRnZXRBdXRoOiAodHlwZSA9ICcnKT0+e1xyXG5cdFx0aWYgKHR5cGUgPT09ICcnKXtcclxuXHRcdFx0YWRkTGluayA9IHRydWU7XHJcblx0XHRcdHR5cGUgPSBsYXN0Q29tbWFuZDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRhZGRMaW5rID0gZmFsc2U7XHJcblx0XHRcdGxhc3RDb21tYW5kID0gdHlwZTtcclxuXHRcdH1cclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XHJcblx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlrozmiJDvvIzoq4vlho3mrKHln7fooYzmipPnlZnoqIAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGaW5pc2hlZCEgUGxlYXNlIGdldENvbW1lbnRzIGFnYWluLicsXHJcblx0XHRcdFx0XHRcdCdzdWNjZXNzJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlpLHmlZfvvIzoq4voga/ntaHnrqHnkIblk6Hnorroqo0nLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2UgaWYgKHR5cGUgPT0gXCJzaGFyZWRwb3N0c1wiKXtcclxuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKFwidXNlcl9wb3N0c1wiKSA8IDApe1xyXG5cdFx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZihcInVzZXJfcG9zdHNcIikgPj0gMCl7XHJcblx0XHRcdFx0XHRmYi51c2VyX3Bvc3RzID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1x0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4dGVuc2lvbkF1dGg6ICgpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25DYWxsYmFjazogKHJlc3BvbnNlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0aWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzLmluZGV4T2YoXCJ1c2VyX3Bvc3RzXCIpIDwgMCl7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0XHRcdGNvbW1hbmQ6ICdzaGFyZWRwb3N0cycsXHJcblx0XHRcdFx0XHRkYXRhOiBKU09OLnBhcnNlKCQoXCIuY2hyb21lXCIpLnZhbCgpKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IFtdLFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W6LOH5paZ5LitLi4uJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRpZiAoIWFkZExpbmspe1xyXG5cdFx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKT0+e1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoJy5wdXJlX2ZiaWQnKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEuZ2V0KGZiaWQpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0Ly8gZmJpZC5kYXRhID0gcmVzO1xyXG5cdFx0XHRmYmlkLmRhdGEgPSBbXTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcyl7XHJcblx0XHRcdFx0ZmJpZC5kYXRhLnB1c2goaSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YS5maW5pc2goZmJpZCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gZmJpZC5jb21tYW5kO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJyAmJiBmYmlkLmNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKSBmYmlkLmZ1bGxJRCA9IGZiaWQucHVyZUlEO1xyXG5cdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmRlYnVnPWFsbGApO1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZvcmRlcj0ke2NvbmZpZy5vcmRlcn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mZGVidWc9YWxsYCwocmVzKT0+e1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0aWYgKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpe1xyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBkLnR5cGUgPSBcIkxJS0VcIjtcclxuXHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLmlkfTtcclxuXHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGQuaWQpe1xyXG5cdFx0XHRcdFx0XHRcdGlmIChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcclxuXHRcdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYgKGQuZnJvbSl7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLmlkfTtcclxuXHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIudXBkYXRlX2FyZWEsLmRvbmF0ZV9hcmVhXCIpLnNsaWRlVXAoKTtcclxuXHRcdCQoXCIucmVzdWx0X2FyZWFcIikuc2xpZGVEb3duKCk7XHJcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdHVpLnJlc2V0KCk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKT0+e1xyXG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKXtcclxuXHRcdFx0dGFibGUuZ2VuZXJhdGUocmF3RGF0YSk7XHRcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gcmF3RGF0YTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4Y2VsOiAocmF3KT0+e1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKXtcclxuXHRcdFx0JC5lYWNoKHJhdy5kYXRhLGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkLmVhY2gocmF3LmRhdGEsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi6KGo5oOFXCIgOiB0aGlzLnR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiIDogdGltZUNvbnZlcnRlcih0aGlzLmNyZWF0ZWRfdGltZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3T2JqO1xyXG5cdH0sXHJcblx0aW1wb3J0OiAoZmlsZSk9PntcclxuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHRcdFx0ZGF0YS5yYXcgPSBKU09OLnBhcnNlKHN0cik7XHJcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmRhdGEgPSByYXdkYXRhLmZpbHRlcmVkO1xyXG5cdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuihqOaDhTwvdGQ+YDtcclxuXHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9ZWxzZSBpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuaOkuWQjTwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+5YiG5pW4PC90ZD5gO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGhvc3QgPSAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJztcclxuXHRcdGlmIChkYXRhLnJhdy50eXBlID09PSAndXJsX2NvbW1lbnRzJykgaG9zdCA9ICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkgKyAnP2ZiX2NvbW1lbnRfaWQ9JztcclxuXHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmRhdGEuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHBpY3R1cmUgPSAnJztcclxuXHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0cGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0aWYocmF3ZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpe1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHR9ZWxzZSBpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHR9ZWxzZSBpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKXtcclxuXHRcdFx0XHR0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHQgIDx0ZD4ke3ZhbC5zY29yZX08L3RkPmA7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCIke2hvc3R9JHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblxyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRUQUJMRSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUQUJMRVxyXG5cdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQkKFwiI3NlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUQUJMRVxyXG5cdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcclxuXHRcdGNob29zZS5saXN0ID0gW107XHJcblx0XHRjaG9vc2UubnVtID0gMDtcclxuXHRcdGlmKCQoXCIjc2VhcmNoQ29tbWVudFwiKS52YWwoKSAhPSAnJyl7XHJcblx0XHRcdHRhYmxlLnJlZG8oKTtcclxuXHRcdH1cclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKXtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKCk7XHJcblx0fSxcclxuXHRnbzogKCk9PntcclxuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhLmZpbHRlcmVkLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRjaG9vc2UuYXdhcmQubWFwKCh2YWwsIGluZGV4KT0+e1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0ciB0aXRsZT1cIuesrCcrKGluZGV4KzEpKyflkI1cIj4nICsgJCgnLm1haW5fdGFibGUnKS5EYXRhVGFibGUoKS5yb3dzKHtzZWFyY2g6J2FwcGxpZWQnfSkubm9kZXMoKVt2YWxdLmlubmVySFRNTCArICc8L3RyPic7XHJcblx0XHR9KVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xyXG5cdFx0XHRsZXQgbm93ID0gMDtcclxuXHRcdFx0Zm9yKGxldCBrIGluIGNob29zZS5saXN0KXtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjVcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH0sXHJcblx0Z2VuX2JpZ19hd2FyZDogKCk9PntcclxuXHRcdGxldCBsaSA9ICcnO1xyXG5cdFx0bGV0IGF3YXJkcyA9IFtdO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0Ym9keSB0cicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIHZhbCl7XHJcblx0XHRcdGxldCBhd2FyZCA9IHt9O1xyXG5cdFx0XHRpZiAodmFsLmhhc0F0dHJpYnV0ZSgndGl0bGUnKSl7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgxKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLnVzZXJpZCA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJykucmVwbGFjZSgnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJywnJyk7XHJcblx0XHRcdFx0YXdhcmQubWVzc2FnZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDIpLmZpbmQoJ2EnKS50ZXh0KCk7XHJcblx0XHRcdFx0YXdhcmQubGluayA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDIpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJyk7XHJcblx0XHRcdFx0YXdhcmQudGltZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKCQodmFsKS5maW5kKCd0ZCcpLmxlbmd0aC0xKS50ZXh0KCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSB0cnVlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS50ZXh0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXdhcmRzLnB1c2goYXdhcmQpO1xyXG5cdFx0fSk7XHJcblx0XHRmb3IobGV0IGkgb2YgYXdhcmRzKXtcclxuXHRcdFx0aWYgKGkuYXdhcmRfbmFtZSA9PT0gdHJ1ZSl7XHJcblx0XHRcdFx0bGkgKz0gYDxsaSBjbGFzcz1cInByaXplTmFtZVwiPiR7aS5uYW1lfTwvbGk+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGkgKz0gYDxsaT5cclxuXHRcdFx0XHQ8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+PGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aS51c2VyaWR9L3BpY3R1cmU/dHlwZT1sYXJnZVwiIGFsdD1cIlwiPjwvYT5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5mb1wiPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibmFtZVwiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubmFtZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubWVzc2FnZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwidGltZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kudGltZX08L2E+PC9wPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvbGk+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmFwcGVuZChsaSk7XHJcblx0XHQkKCcuYmlnX2F3YXJkJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHR9LFxyXG5cdGNsb3NlX2JpZ19hd2FyZDogKCk9PntcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmVtcHR5KCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmJpZCA9IHtcclxuXHRmYmlkOiBbXSxcclxuXHRpbml0OiAodHlwZSk9PntcclxuXHRcdGZiaWQuZmJpZCA9IFtdO1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRGQi5hcGkoXCIvbWVcIixmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRkYXRhLnVzZXJpZCA9IHJlcy5pZDtcclxuXHRcdFx0bGV0IHVybCA9ICcnO1xyXG5cdFx0XHRpZiAoYWRkTGluayl7XHJcblx0XHRcdFx0dXJsID0gZmJpZC5mb3JtYXQoJCgnLm1vcmVsaW5rIC5hZGR1cmwnKS52YWwoKSk7XHJcblx0XHRcdFx0JCgnLm1vcmVsaW5rIC5hZGR1cmwnKS52YWwoJycpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodXJsLmluZGV4T2YoJy5waHA/JykgPT09IC0xICYmIHVybC5pbmRleE9mKCc/JykgPiAwKXtcclxuXHRcdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKCc/JykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZiaWQuZ2V0KHVybCwgdHlwZSkudGhlbigoZmJpZCk9PntcclxuXHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQvLyAkKCcuaWRlbnRpdHknKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoYOeZu+WFpei6q+S7ve+8mjxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Jlcy5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PHNwYW4+JHtyZXMubmFtZX08L3NwYW4+YCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKHVybCwgdHlwZSk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRpZiAodHlwZSA9PSAndXJsX2NvbW1lbnRzJyl7XHJcblx0XHRcdFx0bGV0IHBvc3R1cmwgPSB1cmw7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIj9cIikgPiAwKXtcclxuXHRcdFx0XHRcdHBvc3R1cmwgPSBwb3N0dXJsLnN1YnN0cmluZygwLHBvc3R1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRGQi5hcGkoYC8ke3Bvc3R1cmx9YCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtmdWxsSUQ6IHJlcy5vZ19vYmplY3QuaWQsIHR5cGU6IHR5cGUsIGNvbW1hbmQ6ICdjb21tZW50cyd9O1xyXG5cdFx0XHRcdFx0Y29uZmlnLmxpbWl0Wydjb21tZW50cyddID0gJzI1JztcclxuXHRcdFx0XHRcdGNvbmZpZy5vcmRlciA9ICcnO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRcdGxldCBuZXd1cmwgPSB1cmwuc3Vic3RyKHVybC5pbmRleE9mKCcvJywyOCkrMSwyMDApO1xyXG5cdFx0XHRcdC8vIGh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8g5YWxMjXlrZflhYPvvIzlm6DmraTpgbgyOOmWi+Wni+aJvi9cclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gbmV3dXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XHJcblx0XHRcdFx0ZmJpZC5jaGVja1BhZ2VJRCh1cmwsIHVybHR5cGUpLnRoZW4oKGlkKT0+e1xyXG5cdFx0XHRcdFx0aWYgKGlkID09PSAncGVyc29uYWwnKXtcclxuXHRcdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XHJcblx0XHRcdFx0XHRcdGlkID0gZGF0YS51c2VyaWQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge3BhZ2VJRDogaWQsIHR5cGU6IHVybHR5cGUsIGNvbW1hbmQ6IHR5cGUsIGRhdGE6W119O1xyXG5cdFx0XHRcdFx0aWYgKGFkZExpbmspIG9iai5kYXRhID0gZGF0YS5yYXcuZGF0YTsgLy/ov73liqDosrzmlodcclxuXHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAncGVyc29uYWwnKXtcclxuXHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ2ZiaWQ9Jyk7XHJcblx0XHRcdFx0XHRcdGlmKHN0YXJ0ID49IDApe1xyXG5cdFx0XHRcdFx0XHRcdGxldCBlbmQgPSB1cmwuaW5kZXhPZihcIiZcIixzdGFydCk7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQrNSxlbmQpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZigncG9zdHMvJyk7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQrNix1cmwubGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRsZXQgdmlkZW8gPSB1cmwuaW5kZXhPZigndmlkZW9zLycpO1xyXG5cdFx0XHRcdFx0XHRpZiAodmlkZW8gPj0gMCl7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdH1lbHNlIGlmICh1cmx0eXBlID09PSAncHVyZScpe1xyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gdXJsLnJlcGxhY2UoL1xcXCIvZywnJyk7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ2V2ZW50Jyl7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSl7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5omA5pyJ55WZ6KiAXHJcblx0XHRcdFx0XHRcdFx0XHRvYmouY29tbWFuZCA9ICdmZWVkJztcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHRcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3mn5Dnr4fnlZnoqIDnmoTnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMV07XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ2dyb3VwJyl7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGZiLnVzZXJfcG9zdHMpe1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgXCJfXCIgK29iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6ICfnpL7lnJjkvb/nlKjpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlnJgnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdwaG90bycpe1xyXG5cdFx0XHRcdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHJlc3VsdCA9IHVybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKXtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3VubmFtZScpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoZWNrVHlwZTogKHBvc3R1cmwpPT57XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCl7XHJcblx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ3Blcm1hbGluaycpID49IDApe1xyXG5cdFx0XHRcdHJldHVybiAndW5uYW1lJztcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0cmV0dXJuICdwZXJzb25hbCc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL2dyb3Vwcy9cIikgPj0gMCl7XHJcblx0XHRcdHJldHVybiAnZ3JvdXAnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJldmVudHNcIikgPj0gMCl7XHJcblx0XHRcdHJldHVybiAnZXZlbnQnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvcGhvdG9zL1wiKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdwaG90byc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignXCInKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdwdXJlJztcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJ25vcm1hbCc7XHJcblx0fSxcclxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IHN0YXJ0ID0gcG9zdHVybC5pbmRleE9mKFwiZmFjZWJvb2suY29tXCIpKzEzO1xyXG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcclxuXHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0aWYgKGVuZCA8IDApe1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ2ZiaWQ9JykgPj0gMCl7XHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3VubmFtZScpe1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCd1bm5hbWUnKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShwb3N0dXJsLm1hdGNoKHJlZ2V4KVsxXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgZ3JvdXAgPSBwb3N0dXJsLmluZGV4T2YoJy9ncm91cHMvJyk7XHJcblx0XHRcdFx0bGV0IGV2ZW50ID0gcG9zdHVybC5pbmRleE9mKCcvZXZlbnRzLycpXHJcblx0XHRcdFx0aWYgKGdyb3VwID49IDApe1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBncm91cCs4O1xyXG5cdFx0XHRcdFx0ZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcclxuXHRcdFx0XHRcdGxldCByZWdleDIgPSAvXFxkezYsfS9nO1xyXG5cdFx0XHRcdFx0bGV0IHRlbXAgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCxlbmQpO1xyXG5cdFx0XHRcdFx0aWYgKHJlZ2V4Mi50ZXN0KHRlbXApKXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0ZW1wKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdncm91cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNlIGlmKGV2ZW50ID49IDApe1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSgnZXZlbnQnKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHZhciBwYWdlbmFtZSA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LGVuZCk7XHJcblx0XHRcdFx0XHRGQi5hcGkoYC8ke3BhZ2VuYW1lfWAsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcil7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShyZXMuaWQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Zm9ybWF0OiAodXJsKT0+e1xyXG5cdFx0aWYgKHVybC5pbmRleE9mKCdidXNpbmVzcy5mYWNlYm9vay5jb20vJykgPj0gMCl7XHJcblx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhd2RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIGVuZFRpbWUpPT57XHJcblx0XHRsZXQgZGF0YSA9IHJhd2RhdGEuZGF0YTtcclxuXHRcdGlmICh3b3JkICE9PSAnJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9ZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJyl7XHJcblxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBlbmRUaW1lKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSk9PntcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHQpPT57XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLChwYXJzZUludCh0aW1lX2FyeVsxXSktMSksdGltZV9hcnlbMl0sdGltZV9hcnlbM10sdGltZV9hcnlbNF0sdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmIChjcmVhdGVkX3RpbWUgPCB0aW1lIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcik9PntcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKT0+e1xyXG5cclxuXHR9LFxyXG5cdGFkZExpbms6ICgpPT57XHJcblx0XHRsZXQgdGFyID0gJCgnLmlucHV0YXJlYSAubW9yZWxpbmsnKTtcclxuXHRcdGlmICh0YXIuaGFzQ2xhc3MoJ3Nob3cnKSl7XHJcblx0XHRcdHRhci5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRhci5hZGRDbGFzcygnc2hvdycpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVzZXQ6ICgpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKXtcclxuXHRcdFx0JCgnbGFiZWwudGFnJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZiAoJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIikpe1xyXG5cdFx0XHRcdCQoXCIjdGFnXCIpLmNsaWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnbGFiZWwudGFnJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCl7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSsxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XHJcblx0IHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xyXG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG4gICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICAgaWYgKGRhdGUgPCAxMCl7XHJcbiAgICAgXHRkYXRlID0gXCIwXCIrZGF0ZTtcclxuICAgICB9XHJcbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcbiAgICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG4gICAgIGlmIChtaW4gPCAxMCl7XHJcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XHJcbiAgICAgfVxyXG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuICAgICBpZiAoc2VjIDwgMTApe1xyXG4gICAgIFx0c2VjID0gXCIwXCIrc2VjO1xyXG4gICAgIH1cclxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcclxuICAgICByZXR1cm4gdGltZTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcbiAgICBcclxuICAgIHZhciBDU1YgPSAnJzsgICAgXHJcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuICAgIFxyXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuICAgIGlmIChTaG93TGFiZWwpIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXHJcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSAgIFxyXG4gICAgXHJcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcbiAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxyXG4gICAgXHJcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuICAgIFxyXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG4gICAgXHJcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcclxuICAgIGxpbmsuaHJlZiA9IHVyaTtcclxuICAgIFxyXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuICAgIFxyXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
