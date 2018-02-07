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
		"timePicker": true,
		"timePicker24Hour": true,
		"locale": {
			"format": "YYYY/MM/DD HH:mm",
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
		config.filter.startTime = start.format('YYYY-MM-DD-HH-mm-ss');
		config.filter.endTime = end.format('YYYY-MM-DD-HH-mm-ss');
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
		feed: ['created_time', 'from', 'message', 'story'],
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
		startTime: '1988-12-31-00-00-00',
		endTime: nowDate()
	},
	order: '',
	auth: 'user_photos,user_posts,user_managed_groups',
	likes: false,
	pageToken: ''
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
			if (fbid.type == "url_comments") {
				fbid.data = [];
			}

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
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/", function (res) {
				if (res.created_time) {
					config.filter.startTime = moment(res.created_time).format('YYYY-MM-DD-HH-mm-ss');
				} else if (res.start_time) {
					config.filter.startTime = moment(res.start_time).format('YYYY-MM-DD-HH-mm-ss');
				}
			});
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/" + fbid.command + "?limit=" + config.limit[fbid.command] + "&order=" + config.order + "&fields=" + config.field[fbid.command].toString() + "&access_token=" + config.pageToken + "&debug=all", function (res) {
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
					FB.api("/" + pagename + "?fields=access_token", function (res) {
						if (res.error) {
							resolve('personal');
						} else {
							if (res.access_token) {
								config.pageToken = res.access_token;
							}
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
	totalFilter: function totalFilter(rawdata, isDuplicate, isTag, word, react, startTime, endTime) {
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
			data = _filter.time(data, startTime, endTime);
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
	time: function time(data, st, t) {
		var time_ary2 = st.split("-");
		var time_ary = t.split("-");
		var endtime = moment(new Date(time_ary[0], parseInt(time_ary[1]) - 1, time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;
		var starttime = moment(new Date(time_ary2[0], parseInt(time_ary2[1]) - 1, time_ary2[2], time_ary2[3], time_ary2[4], time_ary2[5]))._d;
		var newAry = $.grep(data, function (n, i) {
			var created_time = moment(n.created_time)._d;
			if (created_time > starttime && created_time < endtime || n.created_time == "") {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4yLmpzIl0sIm5hbWVzIjpbImVycm9yTWVzc2FnZSIsIndpbmRvdyIsIm9uZXJyb3IiLCJoYW5kbGVFcnIiLCJUQUJMRSIsImxhc3RDb21tYW5kIiwiYWRkTGluayIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsInZhbCIsImFwcGVuZCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJkYXRhIiwiZXh0ZW5zaW9uIiwiY2xpY2siLCJlIiwiZmIiLCJleHRlbnNpb25BdXRoIiwiZGF0YXMiLCJjb21tYW5kIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwicmFua2VyIiwicmF3IiwiZmluaXNoIiwiY3RybEtleSIsImFsdEtleSIsImNvbmZpZyIsIm9yZGVyIiwiZ2V0QXV0aCIsImxpa2VzIiwiY2hvb3NlIiwiaW5pdCIsInVpIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImZpbHRlciIsInJlYWN0IiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsInN0YXJ0VGltZSIsImZvcm1hdCIsImVuZFRpbWUiLCJzZXRTdGFydERhdGUiLCJub3dEYXRlIiwiZmlsdGVyRGF0YSIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJzaGFyZUJUTiIsImFsZXJ0IiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwid29yZCIsImF1dGgiLCJwYWdlVG9rZW4iLCJ1c2VyX3Bvc3RzIiwidHlwZSIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFN0ciIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJzd2FsIiwiZG9uZSIsInRpdGxlIiwiaHRtbCIsImZiaWQiLCJleHRlbnNpb25DYWxsYmFjayIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwiZ2V0IiwidGhlbiIsInJlcyIsImkiLCJwdXNoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwcm9taXNlX2FycmF5IiwicHVyZUlEIiwidG9TdHJpbmciLCJhcGkiLCJjcmVhdGVkX3RpbWUiLCJtb21lbnQiLCJzdGFydF90aW1lIiwiZCIsImZyb20iLCJpZCIsIm5hbWUiLCJ1cGRhdGVkX3RpbWUiLCJwYWdpbmciLCJuZXh0IiwiZ2V0TmV4dCIsInJlcGxhY2UiLCJnZXRKU09OIiwiZmFpbCIsInNsaWRlVXAiLCJzbGlkZURvd24iLCJyZXNldCIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwiZmlsdGVyZWQiLCJuZXdPYmoiLCJlYWNoIiwidG1wIiwicG9zdGxpbmsiLCJzdG9yeSIsImxpa2VfY291bnQiLCJtZXNzYWdlIiwidGltZUNvbnZlcnRlciIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJzdHIiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsImZpbHRlcmRhdGEiLCJ0aGVhZCIsInRib2R5IiwicGljIiwiaG9zdCIsImVudHJpZXMiLCJqIiwicGljdHVyZSIsInRkIiwic2NvcmUiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJuIiwicGFyc2VJbnQiLCJmaW5kIiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJtYXAiLCJpbmRleCIsInJvd3MiLCJub2RlcyIsImlubmVySFRNTCIsIm5vdyIsImsiLCJ0YXIiLCJlcSIsImluc2VydEJlZm9yZSIsImdlbl9iaWdfYXdhcmQiLCJsaSIsImF3YXJkcyIsImhhc0F0dHJpYnV0ZSIsImF3YXJkX25hbWUiLCJhdHRyIiwibGluayIsInRpbWUiLCJjbG9zZV9iaWdfYXdhcmQiLCJlbXB0eSIsInN1YnN0cmluZyIsInBvc3R1cmwiLCJvYmoiLCJvZ19vYmplY3QiLCJyZWdleCIsIm5ld3VybCIsInN1YnN0ciIsIm1hdGNoIiwidXJsdHlwZSIsImNoZWNrVHlwZSIsImNoZWNrUGFnZUlEIiwicGFnZUlEIiwidmlkZW8iLCJyZWdleDIiLCJ0ZW1wIiwidGVzdCIsInBhZ2VuYW1lIiwiZXJyb3IiLCJhY2Nlc3NfdG9rZW4iLCJ0YWciLCJ1bmlxdWUiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJuZXdBcnkiLCJncmVwIiwibWVzc2FnZV90YWdzIiwic3QiLCJ0IiwidGltZV9hcnkyIiwic3BsaXQiLCJ0aW1lX2FyeSIsImVuZHRpbWUiLCJEYXRlIiwiX2QiLCJzdGFydHRpbWUiLCJhIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJyb3ciLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwiY3JlYXRlRWxlbWVudCIsImhyZWYiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7QUFDQSxJQUFJQyxLQUFKO0FBQ0EsSUFBSUMsY0FBYyxVQUFsQjtBQUNBLElBQUlDLFVBQVUsS0FBZDs7QUFFQSxTQUFTSCxTQUFULENBQW1CSSxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNULFlBQUwsRUFBa0I7QUFDakJVLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQkMsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBbEM7QUFDQUQsSUFBRSxpQkFBRixFQUFxQkUsTUFBckIsQ0FBNEIsU0FBT0YsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBbkM7QUFDQUQsSUFBRSxpQkFBRixFQUFxQkcsTUFBckI7QUFDQWYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRFksRUFBRUksUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0IsS0FBSUMsT0FBT0MsU0FBU0MsTUFBcEI7QUFDQSxLQUFJRixLQUFLRyxPQUFMLENBQWEsV0FBYixLQUE2QixDQUFqQyxFQUFtQztBQUNsQ1QsSUFBRSxvQkFBRixFQUF3QlUsV0FBeEIsQ0FBb0MsTUFBcEM7QUFDQUMsT0FBS0MsU0FBTCxHQUFpQixJQUFqQjs7QUFFQVosSUFBRSwyQkFBRixFQUErQmEsS0FBL0IsQ0FBcUMsVUFBU0MsQ0FBVCxFQUFXO0FBQy9DQyxNQUFHQyxhQUFIO0FBQ0EsR0FGRDtBQUdBO0FBQ0QsS0FBSVYsS0FBS0csT0FBTCxDQUFhLFFBQWIsS0FBMEIsQ0FBOUIsRUFBZ0M7QUFDL0IsTUFBSVEsUUFBUTtBQUNYQyxZQUFT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QUNBO0FBQ0FBLGFBQVlOLFlBQVk3SSxPQUFaLENBQW9CLElBQXBCLEVBQXlCLEdBQXpCLENBQVo7O0FBRUE7QUFDQSxLQUFJb0osTUFBTSx1Q0FBdUNDLFVBQVVMLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJcEUsT0FBT3RNLFNBQVNnUixhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQTFFLE1BQUsyRSxJQUFMLEdBQVlILEdBQVo7O0FBRUE7QUFDQXhFLE1BQUs0RSxLQUFMLEdBQWEsbUJBQWI7QUFDQTVFLE1BQUs2RSxRQUFMLEdBQWdCTixXQUFXLE1BQTNCOztBQUVBO0FBQ0E3USxVQUFTb1IsSUFBVCxDQUFjQyxXQUFkLENBQTBCL0UsSUFBMUI7QUFDQUEsTUFBSzdMLEtBQUw7QUFDQVQsVUFBU29SLElBQVQsQ0FBY0UsV0FBZCxDQUEwQmhGLElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbjIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVycjtcclxudmFyIFRBQkxFO1xyXG52YXIgbGFzdENvbW1hbmQgPSAnY29tbWVudHMnO1xyXG52YXIgYWRkTGluayA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKXtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIixcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0Y29uc29sZS5sb2coXCJFcnJvciBvY2N1ciBVUkzvvJogXCIgKyAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuYXBwZW5kKFwiPGJyPlwiKyQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHRcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5zZWFyY2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImV4dGVuc2lvblwiKSA+PSAwKXtcclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0ZGF0YS5leHRlbnNpb24gPSB0cnVlO1xyXG5cclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGggYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0aWYgKGhhc2guaW5kZXhPZihcInJhbmtlclwiKSA+PSAwKXtcclxuXHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0Y29tbWFuZDogJ3JhbmtlcicsXHJcblx0XHRcdGRhdGE6IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnJhbmtlcilcclxuXHRcdH1cclxuXHRcdGRhdGEucmF3ID0gZGF0YXM7XHJcblx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0fVxyXG5cclxuXHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHRjb25maWcub3JkZXIgPSAnY2hyb25vbG9naWNhbCc7XHJcblx0XHR9XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9saWtlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdGNvbmZpZy5saWtlcyA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmYi5nZXRBdXRoKCdyZWFjdGlvbnMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl91cmxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ3VybF9jb21tZW50cycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3BheVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGNob29zZS5pbml0KCk7XHJcblx0fSk7XHJcblx0JChcIiNtb3JlcG9zdFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dWkuYWRkTGluaygpO1xyXG5cdH0pO1xyXG5cdFxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLnVpcGFuZWwgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZL01NL0REIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSxmdW5jdGlvbihzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5zdGFydFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IGVuZC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhKTtcclxuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XHJcblx0XHRcdHdpbmRvdy5mb2N1cygpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApe1xyXG5cdFx0XHRcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHR9ZWxzZXtcdFxyXG5cdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGEpLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcblxyXG5cdGxldCBjaV9jb3VudGVyID0gMDtcclxuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSl7XHJcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdH1cclxuXHRcdGlmKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gc2hhcmVCVE4oKXtcclxuXHRhbGVydCgn6KqN55yf55yL5a6M6Lez5Ye65L6G55qE6YKj6aCB5LiK6Z2i5a+r5LqG5LuA6bq8XFxuXFxu55yL5a6M5L2g5bCx5pyD55+l6YGT5L2g54K65LuA6bq85LiN6IO95oqT5YiG5LqrJyk7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCdtZXNzYWdlX3RhZ3MnLCdtZXNzYWdlJywnZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbJ2NyZWF0ZWRfdGltZScsJ2Zyb20nLCdtZXNzYWdlJywnc3RvcnknXSxcclxuXHRcdGxpa2VzOiBbJ25hbWUnXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuNycsXHJcblx0XHRyZWFjdGlvbnM6ICd2Mi43JyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjIuOScsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi43JyxcclxuXHRcdGZlZWQ6ICd2Mi45JyxcclxuXHRcdGdyb3VwOiAndjIuNydcclxuXHR9LFxyXG5cdGZpbHRlcjoge1xyXG5cdFx0d29yZDogJycsXHJcblx0XHRyZWFjdDogJ2FsbCcsXHJcblx0XHRzdGFydFRpbWU6ICcxOTg4LTEyLTMxLTAwLTAwLTAwJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0b3JkZXI6ICcnLFxyXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLHVzZXJfbWFuYWdlZF9ncm91cHMnLFxyXG5cdGxpa2VzOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJyk9PntcclxuXHRcdGlmICh0eXBlID09PSAnJyl7XHJcblx0XHRcdGFkZExpbmsgPSB0cnVlO1xyXG5cdFx0XHR0eXBlID0gbGFzdENvbW1hbmQ7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YWRkTGluayA9IGZhbHNlO1xyXG5cdFx0XHRsYXN0Q29tbWFuZCA9IHR5cGU7XHJcblx0XHR9XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxyXG5cdFx0XHRcdFx0XHQnc3VjY2VzcydcclxuXHRcdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5aSx5pWX77yM6KuL6IGv57Wh566h55CG5ZOh56K66KqNJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNlIGlmICh0eXBlID09IFwic2hhcmVkcG9zdHNcIil7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZihcInVzZXJfcG9zdHNcIikgPCAwKXtcclxuXHRcdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRmYi51c2VyX3Bvc3RzID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoXCJ1c2VyX3Bvc3RzXCIpID49IDApe1xyXG5cdFx0XHRcdFx0ZmIudXNlcl9wb3N0cyA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmRleE9mKFwidXNlcl9wb3N0c1wiKSA8IDApe1xyXG5cdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdFx0XHRjb21tYW5kOiAnc2hhcmVkcG9zdHMnLFxyXG5cdFx0XHRcdFx0ZGF0YTogSlNPTi5wYXJzZSgkKFwiLmNocm9tZVwiKS52YWwoKSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiBbXSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluizh+aWmeS4rS4uLicpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0aWYgKCFhZGRMaW5rKXtcclxuXHRcdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCk9PntcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKCcucHVyZV9mYmlkJykudGV4dChmYmlkLmZ1bGxJRCk7XHJcblx0XHRkYXRhLmdldChmYmlkKS50aGVuKChyZXMpPT57XHJcblx0XHRcdC8vIGZiaWQuZGF0YSA9IHJlcztcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PSBcInVybF9jb21tZW50c1wiKXtcclxuXHRcdFx0XHRmYmlkLmRhdGEgPSBbXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcyl7XHJcblx0XHRcdFx0ZmJpZC5kYXRhLnB1c2goaSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YS5maW5pc2goZmJpZCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gZmJpZC5jb21tYW5kO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJyAmJiBmYmlkLmNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKSBmYmlkLmZ1bGxJRCA9IGZiaWQucHVyZUlEO1xyXG5cdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmRlYnVnPWFsbGApO1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9L2AsIChyZXMpPT57XHJcblx0XHRcdFx0aWYgKHJlcy5jcmVhdGVkX3RpbWUpe1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci5zdGFydFRpbWUgPSBtb21lbnQocmVzLmNyZWF0ZWRfdGltZSkuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHRcdFx0fWVsc2UgaWYocmVzLnN0YXJ0X3RpbWUpe1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci5zdGFydFRpbWUgPSBtb21lbnQocmVzLnN0YXJ0X3RpbWUpLmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19Jm9yZGVyPSR7Y29uZmlnLm9yZGVyfSZmaWVsZHM9JHtjb25maWcuZmllbGRbZmJpZC5jb21tYW5kXS50b1N0cmluZygpfSZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufSZkZWJ1Zz1hbGxgLChyZXMpPT57XHJcblx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRpZiAoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChjb25maWcubGlrZXMpIGQudHlwZSA9IFwiTElLRVwiO1xyXG5cdFx0XHRcdFx0aWYgKGQuZnJvbSl7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoZC5pZCl7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZmJpZCk9PntcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi51cGRhdGVfYXJlYSwuZG9uYXRlX2FyZWFcIikuc2xpZGVVcCgpO1xyXG5cdFx0JChcIi5yZXN1bHRfYXJlYVwiKS5zbGlkZURvd24oKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdFx0dWkucmVzZXQoKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xyXG5cdFx0cmF3RGF0YS5maWx0ZXJlZCA9IG5ld0RhdGE7XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpe1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShyYXdEYXRhKTtcdFxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiByYXdEYXRhO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpPT57XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pe1xyXG5cdFx0XHQkLmVhY2gocmF3LmRhdGEsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCIgOiB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIuipsuWIhuS6q+iumuaVuFwiIDogdGhpcy5saWtlX2NvdW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQuZWFjaChyYXcuZGF0YSxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLooajmg4VcIiA6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCIgOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKT0+e1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9PntcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZmlsdGVyZGF0YSA9IHJhd2RhdGEuZmlsdGVyZWQ7XHJcblx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0bGV0IHBpYyA9ICQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+6KGo5oOFPC90ZD5gO1xyXG5cdFx0fWVsc2UgaWYocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3Jhbmtlcicpe1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5o6S5ZCNPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7liIbmlbg8L3RkPmA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaG9zdCA9ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nO1xyXG5cdFx0aWYgKGRhdGEucmF3LnR5cGUgPT09ICd1cmxfY29tbWVudHMnKSBob3N0ID0gJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSArICc/ZmJfY29tbWVudF9pZD0nO1xyXG5cclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRpZiAocGljKXtcclxuXHRcdFx0XHRwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHtwaWN0dXJlfSR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5gO1xyXG5cdFx0XHRpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3Jhbmtlcicpe1xyXG5cdFx0XHRcdHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdFx0ICA8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPiR7dmFsLnNjb3JlfTwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cIiR7aG9zdH0ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdFRBQkxFID0gJChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoXCIjc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpPT57XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYoJChcIiNzZWFyY2hDb21tZW50XCIpLnZhbCgpICE9ICcnKXtcclxuXHRcdFx0dGFibGUucmVkbygpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApe1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oKTtcclxuXHR9LFxyXG5cdGdvOiAoKT0+e1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGEuZmlsdGVyZWQubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGNob29zZS5hd2FyZC5tYXAoKHZhbCwgaW5kZXgpPT57XHJcblx0XHRcdGluc2VydCArPSAnPHRyIHRpdGxlPVwi56ysJysoaW5kZXgrMSkrJ+WQjVwiPicgKyAkKCcubWFpbl90YWJsZScpLkRhdGFUYWJsZSgpLnJvd3Moe3NlYXJjaDonYXBwbGllZCd9KS5ub2RlcygpW3ZhbF0uaW5uZXJIVE1MICsgJzwvdHI+JztcclxuXHRcdH0pXHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYoY2hvb3NlLmRldGFpbCl7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiNVwiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcclxuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fSxcclxuXHRnZW5fYmlnX2F3YXJkOiAoKT0+e1xyXG5cdFx0bGV0IGxpID0gJyc7XHJcblx0XHRsZXQgYXdhcmRzID0gW107XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRib2R5IHRyJykuZWFjaChmdW5jdGlvbihpbmRleCwgdmFsKXtcclxuXHRcdFx0bGV0IGF3YXJkID0ge307XHJcblx0XHRcdGlmICh2YWwuaGFzQXR0cmlidXRlKCd0aXRsZScpKXtcclxuXHRcdFx0XHRhd2FyZC5hd2FyZF9uYW1lID0gZmFsc2U7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS50ZXh0KCk7XHJcblx0XHRcdFx0YXdhcmQudXNlcmlkID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLmF0dHIoJ2hyZWYnKS5yZXBsYWNlKCdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nLCcnKTtcclxuXHRcdFx0XHRhd2FyZC5tZXNzYWdlID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC5saW5rID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0XHRhd2FyZC50aW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoJCh2YWwpLmZpbmQoJ3RkJykubGVuZ3RoLTEpLnRleHQoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IHRydWU7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLnRleHQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhd2FyZHMucHVzaChhd2FyZCk7XHJcblx0XHR9KTtcclxuXHRcdGZvcihsZXQgaSBvZiBhd2FyZHMpe1xyXG5cdFx0XHRpZiAoaS5hd2FyZF9uYW1lID09PSB0cnVlKXtcclxuXHRcdFx0XHRsaSArPSBgPGxpIGNsYXNzPVwicHJpemVOYW1lXCI+JHtpLm5hbWV9PC9saT5gO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsaSArPSBgPGxpPlxyXG5cdFx0XHRcdDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH0vcGljdHVyZT90eXBlPWxhcmdlXCIgYWx0PVwiXCI+PC9hPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJpbmZvXCI+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJuYW1lXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5uYW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5tZXNzYWdlfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJ0aW1lXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS50aW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9saT5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuYXBwZW5kKGxpKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0Y2xvc2VfYmlnX2F3YXJkOiAoKT0+e1xyXG5cdFx0JCgnLmJpZ19hd2FyZCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuZW1wdHkoKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmYmlkID0ge1xyXG5cdGZiaWQ6IFtdLFxyXG5cdGluaXQ6ICh0eXBlKT0+e1xyXG5cdFx0ZmJpZC5mYmlkID0gW107XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdEZCLmFwaShcIi9tZVwiLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdGRhdGEudXNlcmlkID0gcmVzLmlkO1xyXG5cdFx0XHRsZXQgdXJsID0gJyc7XHJcblx0XHRcdGlmIChhZGRMaW5rKXtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgpKTtcclxuXHRcdFx0XHQkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgnJyk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHVybCA9IGZiaWQuZm9ybWF0KCQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh1cmwuaW5kZXhPZignLnBocD8nKSA9PT0gLTEgJiYgdXJsLmluZGV4T2YoJz8nKSA+IDApe1xyXG5cdFx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoJz8nKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZmJpZC5nZXQodXJsLCB0eXBlKS50aGVuKChmYmlkKT0+e1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC8vICQoJy5pZGVudGl0eScpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChg55m75YWl6Lqr5Lu977yaPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cmVzLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48c3Bhbj4ke3Jlcy5uYW1lfTwvc3Bhbj5gKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAodXJsLCB0eXBlKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGlmICh0eXBlID09ICd1cmxfY29tbWVudHMnKXtcclxuXHRcdFx0XHRsZXQgcG9zdHVybCA9IHVybDtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiP1wiKSA+IDApe1xyXG5cdFx0XHRcdFx0cG9zdHVybCA9IHBvc3R1cmwuc3Vic3RyaW5nKDAscG9zdHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdEZCLmFwaShgLyR7cG9zdHVybH1gLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge2Z1bGxJRDogcmVzLm9nX29iamVjdC5pZCwgdHlwZTogdHlwZSwgY29tbWFuZDogJ2NvbW1lbnRzJ307XHJcblx0XHRcdFx0XHRjb25maWcubGltaXRbJ2NvbW1lbnRzJ10gPSAnMjUnO1xyXG5cdFx0XHRcdFx0Y29uZmlnLm9yZGVyID0gJyc7XHJcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdFx0bGV0IG5ld3VybCA9IHVybC5zdWJzdHIodXJsLmluZGV4T2YoJy8nLDI4KSsxLDIwMCk7XHJcblx0XHRcdFx0Ly8gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyDlhbEyNeWtl+WFg++8jOWboOatpOmBuDI46ZaL5aeL5om+L1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSBuZXd1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdGxldCB1cmx0eXBlID0gZmJpZC5jaGVja1R5cGUodXJsKTtcclxuXHRcdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpPT57XHJcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpe1xyXG5cdFx0XHRcdFx0XHR1cmx0eXBlID0gJ3BlcnNvbmFsJztcclxuXHRcdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBvYmogPSB7cGFnZUlEOiBpZCwgdHlwZTogdXJsdHlwZSwgY29tbWFuZDogdHlwZSwgZGF0YTpbXX07XHJcblx0XHRcdFx0XHRpZiAoYWRkTGluaykgb2JqLmRhdGEgPSBkYXRhLnJhdy5kYXRhOyAvL+i/veWKoOiyvOaWh1xyXG5cdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdwZXJzb25hbCcpe1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcclxuXHRcdFx0XHRcdFx0aWYoc3RhcnQgPj0gMCl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGVuZCA9IHVybC5pbmRleE9mKFwiJlwiLHN0YXJ0KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs1LGVuZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdwb3N0cy8nKTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs2LHVybC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGxldCB2aWRlbyA9IHVybC5pbmRleE9mKCd2aWRlb3MvJyk7XHJcblx0XHRcdFx0XHRcdGlmICh2aWRlbyA+PSAwKXtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdwdXJlJyl7XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCcnKTtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZXZlbnQnKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxKXtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3miYDmnInnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5jb21tYW5kID0gJ2ZlZWQnO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcdFxyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reafkOevh+eVmeiogOeahOeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1lbHNlIGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZmIudXNlcl9wb3N0cyl7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyBcIl9cIiArb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aXRsZTogJ+ekvuWcmOS9v+eUqOmcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWcmCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3Bob3RvJyl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gdXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSB8fCByZXN1bHQubGVuZ3RoID09IDMpe1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcclxuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2hlY2tUeXBlOiAocG9zdHVybCk9PntcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJmYmlkPVwiKSA+PSAwKXtcclxuXHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZigncGVybWFsaW5rJykgPj0gMCl7XHJcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRyZXR1cm4gJ3BlcnNvbmFsJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvZ3JvdXBzL1wiKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdncm91cCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImV2ZW50c1wiKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdldmVudCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9waG90b3MvXCIpID49IDApe1xyXG5cdFx0XHRyZXR1cm4gJ3Bob3RvJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApe1xyXG5cdFx0XHRyZXR1cm4gJ3B1cmUnO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiAnbm9ybWFsJztcclxuXHR9LFxyXG5cdGNoZWNrUGFnZUlEOiAocG9zdHVybCwgdHlwZSk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgc3RhcnQgPSBwb3N0dXJsLmluZGV4T2YoXCJmYWNlYm9vay5jb21cIikrMTM7XHJcblx0XHRcdGxldCBlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsc3RhcnQpO1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRpZiAoZW5kIDwgMCl7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignZmJpZD0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAndW5uYW1lJyl7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3VubmFtZScpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGxldCBncm91cCA9IHBvc3R1cmwuaW5kZXhPZignL2dyb3Vwcy8nKTtcclxuXHRcdFx0XHRsZXQgZXZlbnQgPSBwb3N0dXJsLmluZGV4T2YoJy9ldmVudHMvJylcclxuXHRcdFx0XHRpZiAoZ3JvdXAgPj0gMCl7XHJcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwKzg7XHJcblx0XHRcdFx0XHRlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsc3RhcnQpO1xyXG5cdFx0XHRcdFx0bGV0IHJlZ2V4MiA9IC9cXGR7Nix9L2c7XHJcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LGVuZCk7XHJcblx0XHRcdFx0XHRpZiAocmVnZXgyLnRlc3QodGVtcCkpe1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRlbXApO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ2dyb3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2UgaWYoZXZlbnQgPj0gMCl7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCdldmVudCcpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcclxuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZW5hbWV9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3Ipe1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKXtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmb3JtYXQ6ICh1cmwpPT57XHJcblx0XHRpZiAodXJsLmluZGV4T2YoJ2J1c2luZXNzLmZhY2Vib29rLmNvbS8nKSA+PSAwKXtcclxuXHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3ZGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgc3RhcnRUaW1lLCBlbmRUaW1lKT0+e1xyXG5cdFx0bGV0IGRhdGEgPSByYXdkYXRhLmRhdGE7XHJcblx0XHRpZiAod29yZCAhPT0gJycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fWVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3Jhbmtlcicpe1xyXG5cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgc3RhcnRUaW1lLCBlbmRUaW1lKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSk9PntcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHN0LCB0KT0+e1xyXG5cdFx0bGV0IHRpbWVfYXJ5MiA9IHN0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IGVuZHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IHN0YXJ0dGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeTJbMF0sKHBhcnNlSW50KHRpbWVfYXJ5MlsxXSktMSksdGltZV9hcnkyWzJdLHRpbWVfYXJ5MlszXSx0aW1lX2FyeTJbNF0sdGltZV9hcnkyWzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoKGNyZWF0ZWRfdGltZSA+IHN0YXJ0dGltZSAmJiBjcmVhdGVkX3RpbWUgPCBlbmR0aW1lKSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XHJcblx0XHRpZiAodGFyID09ICdhbGwnKXtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCk9PntcclxuXHJcblx0fSxcclxuXHRhZGRMaW5rOiAoKT0+e1xyXG5cdFx0bGV0IHRhciA9ICQoJy5pbnB1dGFyZWEgLm1vcmVsaW5rJyk7XHJcblx0XHRpZiAodGFyLmhhc0NsYXNzKCdzaG93Jykpe1xyXG5cdFx0XHR0YXIucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHR0YXIuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlc2V0OiAoKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSBkYXRhLnJhdy5jb21tYW5kO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKXtcclxuXHRcdFx0XHQkKFwiI3RhZ1wiKS5jbGljaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpe1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xyXG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcclxuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgIGlmIChkYXRlIDwgMTApe1xyXG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XHJcbiAgICAgfVxyXG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgICBpZiAobWluIDwgMTApe1xyXG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xyXG4gICAgIH1cclxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgaWYgKHNlYyA8IDEwKXtcclxuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcclxuICAgICB9XHJcbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XHJcbiAgICAgcmV0dXJuIHRpbWU7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
