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
	$('.rangeDate').data('daterangepicker').setStartDate(config.filter.startTime);

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
		startTime: '2000-12-31-00-00-00',
		endTime: nowDate()
	},
	order: '',
	auth: 'user_photos,user_posts,user_managed_groups,manage_pages',
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
				console.log(authStr);
				if (authStr.indexOf("user_posts") >= 0 && authStr.indexOf("manage_pages") >= 0) {
					fb.user_posts = true;
					fbid.init(type);
				} else {
					swal({
						title: '此系統需要付費，免費版本將於2018/03/01重新上線',
						type: 'warning'
					}).done();
				}
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
							if (d.updated_time) {
								d.created_time = d.updated_time;
							}
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
									if (d.updated_time) {
										d.created_time = d.updated_time;
									}
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
		config.pageToken = '';
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIlRBQkxFIiwibGFzdENvbW1hbmQiLCJhZGRMaW5rIiwibXNnIiwidXJsIiwibCIsImNvbnNvbGUiLCJsb2ciLCIkIiwidmFsIiwiYXBwZW5kIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImhhc2giLCJsb2NhdGlvbiIsInNlYXJjaCIsImluZGV4T2YiLCJyZW1vdmVDbGFzcyIsImRhdGEiLCJleHRlbnNpb24iLCJjbGljayIsImUiLCJmYiIsImV4dGVuc2lvbkF1dGgiLCJkYXRhcyIsImNvbW1hbmQiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJyYW5rZXIiLCJyYXciLCJmaW5pc2giLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJnZXRBdXRoIiwibGlrZXMiLCJjaG9vc2UiLCJpbml0IiwidWkiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwia2V5ZG93biIsInRleHQiLCJrZXl1cCIsIm9uIiwidGFibGUiLCJyZWRvIiwiY2hhbmdlIiwiZmlsdGVyIiwicmVhY3QiLCJkYXRlcmFuZ2VwaWNrZXIiLCJzdGFydCIsImVuZCIsImxhYmVsIiwic3RhcnRUaW1lIiwiZm9ybWF0IiwiZW5kVGltZSIsInNldFN0YXJ0RGF0ZSIsImZpbHRlckRhdGEiLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwic2hhcmVCVE4iLCJhbGVydCIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIndvcmQiLCJub3dEYXRlIiwiYXV0aCIsInBhZ2VUb2tlbiIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsInN3YWwiLCJkb25lIiwidGl0bGUiLCJodG1sIiwiZmJpZCIsImV4dGVuc2lvbkNhbGxiYWNrIiwidXNlcmlkIiwibm93TGVuZ3RoIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJnZXQiLCJ0aGVuIiwicmVzIiwiaSIsInB1c2giLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2VfYXJyYXkiLCJwdXJlSUQiLCJ0b1N0cmluZyIsImFwaSIsImQiLCJmcm9tIiwiaWQiLCJuYW1lIiwidXBkYXRlZF90aW1lIiwiY3JlYXRlZF90aW1lIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwic3RvcnkiLCJsaWtlX2NvdW50IiwibWVzc2FnZSIsInRpbWVDb252ZXJ0ZXIiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50Iiwic3RyIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsInBpYyIsImhvc3QiLCJlbnRyaWVzIiwiaiIsInBpY3R1cmUiLCJ0ZCIsInNjb3JlIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwibiIsInBhcnNlSW50IiwiZmluZCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwibWFwIiwiaW5kZXgiLCJyb3dzIiwibm9kZXMiLCJpbm5lckhUTUwiLCJub3ciLCJrIiwidGFyIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJnZW5fYmlnX2F3YXJkIiwibGkiLCJhd2FyZHMiLCJoYXNBdHRyaWJ1dGUiLCJhd2FyZF9uYW1lIiwiYXR0ciIsImxpbmsiLCJ0aW1lIiwiY2xvc2VfYmlnX2F3YXJkIiwiZW1wdHkiLCJzdWJzdHJpbmciLCJwb3N0dXJsIiwib2JqIiwib2dfb2JqZWN0IiwicmVnZXgiLCJuZXd1cmwiLCJzdWJzdHIiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsInZpZGVvIiwicmVnZXgyIiwidGVtcCIsInRlc3QiLCJwYWdlbmFtZSIsImVycm9yIiwiYWNjZXNzX3Rva2VuIiwidGFnIiwidW5pcXVlIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInN0IiwidCIsInRpbWVfYXJ5MiIsInNwbGl0IiwidGltZV9hcnkiLCJlbmR0aW1lIiwibW9tZW50IiwiRGF0ZSIsIl9kIiwic3RhcnR0aW1lIiwiYSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwicm93Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFlQyxTQUFmO0FBQ0EsSUFBSUMsS0FBSjtBQUNBLElBQUlDLGNBQWMsVUFBbEI7QUFDQSxJQUFJQyxVQUFVLEtBQWQ7O0FBRUEsU0FBU0gsU0FBVCxDQUFtQkksR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDVCxZQUFMLEVBQWtCO0FBQ2pCVSxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FELFVBQVFDLEdBQVIsQ0FBWSxzQkFBc0JDLEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQWxDO0FBQ0FELElBQUUsaUJBQUYsRUFBcUJFLE1BQXJCLENBQTRCLFNBQU9GLEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQW5DO0FBQ0FELElBQUUsaUJBQUYsRUFBcUJHLE1BQXJCO0FBQ0FmLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBO0FBQ0RZLEVBQUVJLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFVO0FBQzNCLEtBQUlDLE9BQU9DLFNBQVNDLE1BQXBCO0FBQ0EsS0FBSUYsS0FBS0csT0FBTCxDQUFhLFdBQWIsS0FBNkIsQ0FBakMsRUFBbUM7QUFDbENULElBQUUsb0JBQUYsRUFBd0JVLFdBQXhCLENBQW9DLE1BQXBDO0FBQ0FDLE9BQUtDLFNBQUwsR0FBaUIsSUFBakI7O0FBRUFaLElBQUUsMkJBQUYsRUFBK0JhLEtBQS9CLENBQXFDLFVBQVNDLENBQVQsRUFBVztBQUMvQ0MsTUFBR0MsYUFBSDtBQUNBLEdBRkQ7QUFHQTtBQUNELEtBQUlWLEtBQUtHLE9BQUwsQ0FBYSxRQUFiLEtBQTBCLENBQTlCLEVBQWdDO0FBQy9CLE1BQUlRLFFBQVE7QUFDWEMsWUFBUyxRQURFO0FBRVhQLFNB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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSXJFLE9BQU9wTSxTQUFTK1EsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0EzRSxNQUFLNEUsSUFBTCxHQUFZSCxHQUFaOztBQUVBO0FBQ0F6RSxNQUFLNkUsS0FBTCxHQUFhLG1CQUFiO0FBQ0E3RSxNQUFLOEUsUUFBTCxHQUFnQk4sV0FBVyxNQUEzQjs7QUFFQTtBQUNBNVEsVUFBU21SLElBQVQsQ0FBY0MsV0FBZCxDQUEwQmhGLElBQTFCO0FBQ0FBLE1BQUszTCxLQUFMO0FBQ0FULFVBQVNtUixJQUFULENBQWNFLFdBQWQsQ0FBMEJqRixJQUExQjtBQUNIIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVycjtcclxudmFyIFRBQkxFO1xyXG52YXIgbGFzdENvbW1hbmQgPSAnY29tbWVudHMnO1xyXG52YXIgYWRkTGluayA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKXtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIixcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0Y29uc29sZS5sb2coXCJFcnJvciBvY2N1ciBVUkzvvJogXCIgKyAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuYXBwZW5kKFwiPGJyPlwiKyQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHRcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5zZWFyY2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImV4dGVuc2lvblwiKSA+PSAwKXtcclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0ZGF0YS5leHRlbnNpb24gPSB0cnVlO1xyXG5cclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGggYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0aWYgKGhhc2guaW5kZXhPZihcInJhbmtlclwiKSA+PSAwKXtcclxuXHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0Y29tbWFuZDogJ3JhbmtlcicsXHJcblx0XHRcdGRhdGE6IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnJhbmtlcilcclxuXHRcdH1cclxuXHRcdGRhdGEucmF3ID0gZGF0YXM7XHJcblx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0fVxyXG5cclxuXHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHRjb25maWcub3JkZXIgPSAnY2hyb25vbG9naWNhbCc7XHJcblx0XHR9XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9saWtlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdGNvbmZpZy5saWtlcyA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmYi5nZXRBdXRoKCdyZWFjdGlvbnMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl91cmxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ3VybF9jb21tZW50cycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3BheVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGNob29zZS5pbml0KCk7XHJcblx0fSk7XHJcblx0JChcIiNtb3JlcG9zdFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dWkuYWRkTGluaygpO1xyXG5cdH0pO1xyXG5cdFxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLnVpcGFuZWwgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZL01NL0REIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSxmdW5jdGlvbihzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5zdGFydFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IGVuZC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKGNvbmZpZy5maWx0ZXIuc3RhcnRUaW1lKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGEpO1xyXG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHRcdFx0d2luZG93LmZvY3VzKCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCl7XHJcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdH1lbHNle1x0XHJcblx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRjaV9jb3VudGVyKys7XHJcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KXtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBzaGFyZUJUTigpe1xyXG5cdGFsZXJ0KCfoqo3nnJ/nnIvlrozot7Plh7rkvobnmoTpgqPpoIHkuIrpnaLlr6vkuobku4DpurxcXG5cXG7nnIvlrozkvaDlsLHmnIPnn6XpgZPkvaDngrrku4DpurzkuI3og73mipPliIbkuqsnKTtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UnLCdmcm9tJywnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFsnY3JlYXRlZF90aW1lJywnZnJvbScsJ21lc3NhZ2UnLCdzdG9yeSddLFxyXG5cdFx0bGlrZXM6IFsnbmFtZSddXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJyxcclxuXHRcdGxpa2VzOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi43JyxcclxuXHRcdHJlYWN0aW9uczogJ3YyLjcnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi45JyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxyXG5cdFx0ZmVlZDogJ3YyLjknLFxyXG5cdFx0Z3JvdXA6ICd2Mi43J1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdHN0YXJ0VGltZTogJzIwMDAtMTItMzEtMDAtMDAtMDAnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRvcmRlcjogJycsXHJcblx0YXV0aDogJ3VzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9tYW5hZ2VkX2dyb3VwcyxtYW5hZ2VfcGFnZXMnLFxyXG5cdGxpa2VzOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJyk9PntcclxuXHRcdGlmICh0eXBlID09PSAnJyl7XHJcblx0XHRcdGFkZExpbmsgPSB0cnVlO1xyXG5cdFx0XHR0eXBlID0gbGFzdENvbW1hbmQ7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YWRkTGluayA9IGZhbHNlO1xyXG5cdFx0XHRsYXN0Q29tbWFuZCA9IHR5cGU7XHJcblx0XHR9XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxyXG5cdFx0XHRcdFx0XHQnc3VjY2VzcydcclxuXHRcdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5aSx5pWX77yM6KuL6IGv57Wh566h55CG5ZOh56K66KqNJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNlIGlmICh0eXBlID09IFwic2hhcmVkcG9zdHNcIil7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZihcInVzZXJfcG9zdHNcIikgPCAwKXtcclxuXHRcdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRmYi51c2VyX3Bvc3RzID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGF1dGhTdHIpO1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoXCJ1c2VyX3Bvc3RzXCIpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKFwibWFuYWdlX3BhZ2VzXCIpID49IDApe1xyXG5cdFx0XHRcdFx0ZmIudXNlcl9wb3N0cyA9IHRydWU7XHJcblx0XHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0dGl0bGU6ICfmraTns7vntbHpnIDopoHku5josrvvvIzlhY3osrvniYjmnKzlsIfmlrwyMDE4LzAzLzAx6YeN5paw5LiK57eaJyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0fVx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmRleE9mKFwidXNlcl9wb3N0c1wiKSA8IDApe1xyXG5cdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdFx0XHRjb21tYW5kOiAnc2hhcmVkcG9zdHMnLFxyXG5cdFx0XHRcdFx0ZGF0YTogSlNPTi5wYXJzZSgkKFwiLmNocm9tZVwiKS52YWwoKSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiBbXSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluizh+aWmeS4rS4uLicpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0aWYgKCFhZGRMaW5rKXtcclxuXHRcdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCk9PntcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKCcucHVyZV9mYmlkJykudGV4dChmYmlkLmZ1bGxJRCk7XHJcblx0XHRkYXRhLmdldChmYmlkKS50aGVuKChyZXMpPT57XHJcblx0XHRcdC8vIGZiaWQuZGF0YSA9IHJlcztcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PSBcInVybF9jb21tZW50c1wiKXtcclxuXHRcdFx0XHRmYmlkLmRhdGEgPSBbXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcyl7XHJcblx0XHRcdFx0ZmJpZC5kYXRhLnB1c2goaSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YS5maW5pc2goZmJpZCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gZmJpZC5jb21tYW5kO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJyAmJiBmYmlkLmNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKSBmYmlkLmZ1bGxJRCA9IGZiaWQucHVyZUlEO1xyXG5cdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmRlYnVnPWFsbGApO1xyXG5cclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mb3JkZXI9JHtjb25maWcub3JkZXJ9JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59JmRlYnVnPWFsbGAsKHJlcyk9PntcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdGlmIChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKGNvbmZpZy5saWtlcykgZC50eXBlID0gXCJMSUtFXCI7XHJcblx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XHJcblx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XHJcblx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoZC5pZCl7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZmJpZCk9PntcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi51cGRhdGVfYXJlYSwuZG9uYXRlX2FyZWFcIikuc2xpZGVVcCgpO1xyXG5cdFx0JChcIi5yZXN1bHRfYXJlYVwiKS5zbGlkZURvd24oKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdFx0dWkucmVzZXQoKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xyXG5cdFx0cmF3RGF0YS5maWx0ZXJlZCA9IG5ld0RhdGE7XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpe1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShyYXdEYXRhKTtcdFxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiByYXdEYXRhO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpPT57XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pe1xyXG5cdFx0XHQkLmVhY2gocmF3LmRhdGEsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCIgOiB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIuipsuWIhuS6q+iumuaVuFwiIDogdGhpcy5saWtlX2NvdW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQuZWFjaChyYXcuZGF0YSxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLooajmg4VcIiA6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCIgOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKT0+e1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9PntcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZmlsdGVyZGF0YSA9IHJhd2RhdGEuZmlsdGVyZWQ7XHJcblx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0bGV0IHBpYyA9ICQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+6KGo5oOFPC90ZD5gO1xyXG5cdFx0fWVsc2UgaWYocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3Jhbmtlcicpe1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5o6S5ZCNPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7liIbmlbg8L3RkPmA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaG9zdCA9ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nO1xyXG5cdFx0aWYgKGRhdGEucmF3LnR5cGUgPT09ICd1cmxfY29tbWVudHMnKSBob3N0ID0gJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSArICc/ZmJfY29tbWVudF9pZD0nO1xyXG5cclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRpZiAocGljKXtcclxuXHRcdFx0XHRwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHtwaWN0dXJlfSR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5gO1xyXG5cdFx0XHRpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3Jhbmtlcicpe1xyXG5cdFx0XHRcdHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdFx0ICA8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPiR7dmFsLnNjb3JlfTwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cIiR7aG9zdH0ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdFRBQkxFID0gJChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoXCIjc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpPT57XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYoJChcIiNzZWFyY2hDb21tZW50XCIpLnZhbCgpICE9ICcnKXtcclxuXHRcdFx0dGFibGUucmVkbygpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApe1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oKTtcclxuXHR9LFxyXG5cdGdvOiAoKT0+e1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGEuZmlsdGVyZWQubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGNob29zZS5hd2FyZC5tYXAoKHZhbCwgaW5kZXgpPT57XHJcblx0XHRcdGluc2VydCArPSAnPHRyIHRpdGxlPVwi56ysJysoaW5kZXgrMSkrJ+WQjVwiPicgKyAkKCcubWFpbl90YWJsZScpLkRhdGFUYWJsZSgpLnJvd3Moe3NlYXJjaDonYXBwbGllZCd9KS5ub2RlcygpW3ZhbF0uaW5uZXJIVE1MICsgJzwvdHI+JztcclxuXHRcdH0pXHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYoY2hvb3NlLmRldGFpbCl7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiNVwiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcclxuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fSxcclxuXHRnZW5fYmlnX2F3YXJkOiAoKT0+e1xyXG5cdFx0bGV0IGxpID0gJyc7XHJcblx0XHRsZXQgYXdhcmRzID0gW107XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRib2R5IHRyJykuZWFjaChmdW5jdGlvbihpbmRleCwgdmFsKXtcclxuXHRcdFx0bGV0IGF3YXJkID0ge307XHJcblx0XHRcdGlmICh2YWwuaGFzQXR0cmlidXRlKCd0aXRsZScpKXtcclxuXHRcdFx0XHRhd2FyZC5hd2FyZF9uYW1lID0gZmFsc2U7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS50ZXh0KCk7XHJcblx0XHRcdFx0YXdhcmQudXNlcmlkID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLmF0dHIoJ2hyZWYnKS5yZXBsYWNlKCdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nLCcnKTtcclxuXHRcdFx0XHRhd2FyZC5tZXNzYWdlID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC5saW5rID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0XHRhd2FyZC50aW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoJCh2YWwpLmZpbmQoJ3RkJykubGVuZ3RoLTEpLnRleHQoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IHRydWU7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLnRleHQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhd2FyZHMucHVzaChhd2FyZCk7XHJcblx0XHR9KTtcclxuXHRcdGZvcihsZXQgaSBvZiBhd2FyZHMpe1xyXG5cdFx0XHRpZiAoaS5hd2FyZF9uYW1lID09PSB0cnVlKXtcclxuXHRcdFx0XHRsaSArPSBgPGxpIGNsYXNzPVwicHJpemVOYW1lXCI+JHtpLm5hbWV9PC9saT5gO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsaSArPSBgPGxpPlxyXG5cdFx0XHRcdDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH0vcGljdHVyZT90eXBlPWxhcmdlXCIgYWx0PVwiXCI+PC9hPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJpbmZvXCI+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJuYW1lXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5uYW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5tZXNzYWdlfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJ0aW1lXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS50aW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9saT5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuYXBwZW5kKGxpKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0Y2xvc2VfYmlnX2F3YXJkOiAoKT0+e1xyXG5cdFx0JCgnLmJpZ19hd2FyZCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuZW1wdHkoKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmYmlkID0ge1xyXG5cdGZiaWQ6IFtdLFxyXG5cdGluaXQ6ICh0eXBlKT0+e1xyXG5cdFx0Y29uZmlnLnBhZ2VUb2tlbiA9ICcnO1xyXG5cdFx0ZmJpZC5mYmlkID0gW107XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdEZCLmFwaShcIi9tZVwiLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdGRhdGEudXNlcmlkID0gcmVzLmlkO1xyXG5cdFx0XHRsZXQgdXJsID0gJyc7XHJcblx0XHRcdGlmIChhZGRMaW5rKXtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgpKTtcclxuXHRcdFx0XHQkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgnJyk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHVybCA9IGZiaWQuZm9ybWF0KCQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh1cmwuaW5kZXhPZignLnBocD8nKSA9PT0gLTEgJiYgdXJsLmluZGV4T2YoJz8nKSA+IDApe1xyXG5cdFx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoJz8nKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZmJpZC5nZXQodXJsLCB0eXBlKS50aGVuKChmYmlkKT0+e1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC8vICQoJy5pZGVudGl0eScpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChg55m75YWl6Lqr5Lu977yaPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cmVzLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48c3Bhbj4ke3Jlcy5uYW1lfTwvc3Bhbj5gKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAodXJsLCB0eXBlKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGlmICh0eXBlID09ICd1cmxfY29tbWVudHMnKXtcclxuXHRcdFx0XHRsZXQgcG9zdHVybCA9IHVybDtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiP1wiKSA+IDApe1xyXG5cdFx0XHRcdFx0cG9zdHVybCA9IHBvc3R1cmwuc3Vic3RyaW5nKDAscG9zdHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdEZCLmFwaShgLyR7cG9zdHVybH1gLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge2Z1bGxJRDogcmVzLm9nX29iamVjdC5pZCwgdHlwZTogdHlwZSwgY29tbWFuZDogJ2NvbW1lbnRzJ307XHJcblx0XHRcdFx0XHRjb25maWcubGltaXRbJ2NvbW1lbnRzJ10gPSAnMjUnO1xyXG5cdFx0XHRcdFx0Y29uZmlnLm9yZGVyID0gJyc7XHJcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdFx0bGV0IG5ld3VybCA9IHVybC5zdWJzdHIodXJsLmluZGV4T2YoJy8nLDI4KSsxLDIwMCk7XHJcblx0XHRcdFx0Ly8gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyDlhbEyNeWtl+WFg++8jOWboOatpOmBuDI46ZaL5aeL5om+L1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSBuZXd1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdGxldCB1cmx0eXBlID0gZmJpZC5jaGVja1R5cGUodXJsKTtcclxuXHRcdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpPT57XHJcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpe1xyXG5cdFx0XHRcdFx0XHR1cmx0eXBlID0gJ3BlcnNvbmFsJztcclxuXHRcdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBvYmogPSB7cGFnZUlEOiBpZCwgdHlwZTogdXJsdHlwZSwgY29tbWFuZDogdHlwZSwgZGF0YTpbXX07XHJcblx0XHRcdFx0XHRpZiAoYWRkTGluaykgb2JqLmRhdGEgPSBkYXRhLnJhdy5kYXRhOyAvL+i/veWKoOiyvOaWh1xyXG5cdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdwZXJzb25hbCcpe1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcclxuXHRcdFx0XHRcdFx0aWYoc3RhcnQgPj0gMCl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGVuZCA9IHVybC5pbmRleE9mKFwiJlwiLHN0YXJ0KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs1LGVuZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdwb3N0cy8nKTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs2LHVybC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGxldCB2aWRlbyA9IHVybC5pbmRleE9mKCd2aWRlb3MvJyk7XHJcblx0XHRcdFx0XHRcdGlmICh2aWRlbyA+PSAwKXtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdwdXJlJyl7XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCcnKTtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZXZlbnQnKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxKXtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3miYDmnInnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5jb21tYW5kID0gJ2ZlZWQnO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcdFxyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reafkOevh+eVmeiogOeahOeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1lbHNlIGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZmIudXNlcl9wb3N0cyl7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyBcIl9cIiArb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aXRsZTogJ+ekvuWcmOS9v+eUqOmcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWcmCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3Bob3RvJyl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gdXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSB8fCByZXN1bHQubGVuZ3RoID09IDMpe1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcclxuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2hlY2tUeXBlOiAocG9zdHVybCk9PntcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJmYmlkPVwiKSA+PSAwKXtcclxuXHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZigncGVybWFsaW5rJykgPj0gMCl7XHJcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRyZXR1cm4gJ3BlcnNvbmFsJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvZ3JvdXBzL1wiKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdncm91cCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImV2ZW50c1wiKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdldmVudCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9waG90b3MvXCIpID49IDApe1xyXG5cdFx0XHRyZXR1cm4gJ3Bob3RvJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApe1xyXG5cdFx0XHRyZXR1cm4gJ3B1cmUnO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiAnbm9ybWFsJztcclxuXHR9LFxyXG5cdGNoZWNrUGFnZUlEOiAocG9zdHVybCwgdHlwZSk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgc3RhcnQgPSBwb3N0dXJsLmluZGV4T2YoXCJmYWNlYm9vay5jb21cIikrMTM7XHJcblx0XHRcdGxldCBlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsc3RhcnQpO1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRpZiAoZW5kIDwgMCl7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignZmJpZD0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAndW5uYW1lJyl7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3VubmFtZScpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGxldCBncm91cCA9IHBvc3R1cmwuaW5kZXhPZignL2dyb3Vwcy8nKTtcclxuXHRcdFx0XHRsZXQgZXZlbnQgPSBwb3N0dXJsLmluZGV4T2YoJy9ldmVudHMvJylcclxuXHRcdFx0XHRpZiAoZ3JvdXAgPj0gMCl7XHJcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwKzg7XHJcblx0XHRcdFx0XHRlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsc3RhcnQpO1xyXG5cdFx0XHRcdFx0bGV0IHJlZ2V4MiA9IC9cXGR7Nix9L2c7XHJcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LGVuZCk7XHJcblx0XHRcdFx0XHRpZiAocmVnZXgyLnRlc3QodGVtcCkpe1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRlbXApO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ2dyb3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2UgaWYoZXZlbnQgPj0gMCl7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCdldmVudCcpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcclxuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZW5hbWV9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3Ipe1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKXtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmb3JtYXQ6ICh1cmwpPT57XHJcblx0XHRpZiAodXJsLmluZGV4T2YoJ2J1c2luZXNzLmZhY2Vib29rLmNvbS8nKSA+PSAwKXtcclxuXHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3ZGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgc3RhcnRUaW1lLCBlbmRUaW1lKT0+e1xyXG5cdFx0bGV0IGRhdGEgPSByYXdkYXRhLmRhdGE7XHJcblx0XHRpZiAod29yZCAhPT0gJycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fWVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3Jhbmtlcicpe1xyXG5cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgc3RhcnRUaW1lLCBlbmRUaW1lKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSk9PntcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHN0LCB0KT0+e1xyXG5cdFx0bGV0IHRpbWVfYXJ5MiA9IHN0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IGVuZHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IHN0YXJ0dGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeTJbMF0sKHBhcnNlSW50KHRpbWVfYXJ5MlsxXSktMSksdGltZV9hcnkyWzJdLHRpbWVfYXJ5MlszXSx0aW1lX2FyeTJbNF0sdGltZV9hcnkyWzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoKGNyZWF0ZWRfdGltZSA+IHN0YXJ0dGltZSAmJiBjcmVhdGVkX3RpbWUgPCBlbmR0aW1lKSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XHJcblx0XHRpZiAodGFyID09ICdhbGwnKXtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCk9PntcclxuXHJcblx0fSxcclxuXHRhZGRMaW5rOiAoKT0+e1xyXG5cdFx0bGV0IHRhciA9ICQoJy5pbnB1dGFyZWEgLm1vcmVsaW5rJyk7XHJcblx0XHRpZiAodGFyLmhhc0NsYXNzKCdzaG93Jykpe1xyXG5cdFx0XHR0YXIucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHR0YXIuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlc2V0OiAoKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSBkYXRhLnJhdy5jb21tYW5kO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKXtcclxuXHRcdFx0XHQkKFwiI3RhZ1wiKS5jbGljaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpe1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xyXG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcclxuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgIGlmIChkYXRlIDwgMTApe1xyXG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XHJcbiAgICAgfVxyXG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgICBpZiAobWluIDwgMTApe1xyXG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xyXG4gICAgIH1cclxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgaWYgKHNlYyA8IDEwKXtcclxuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcclxuICAgICB9XHJcbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XHJcbiAgICAgcmV0dXJuIHRpbWU7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
