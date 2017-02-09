"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
window.onerror = handleErr;

function handleErr(msg, url, l) {
	if (!errorMessage) {
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}
$(document).ready(function () {
	var lastData = JSON.parse(localStorage.getItem("raw"));
	if (lastData) {
		data.finish(lastData);
	}
	if (sessionStorage.login) {
		fb.genOption(JSON.parse(sessionStorage.login));
	}

	$(".tables > .sharedposts button").click(function (e) {
		fb.extensionAuth();
	});

	$("#btn_comments").click(function (e) {
		fb.getAuth('comments');
	});

	$("#btn_start").click(function () {
		fb.getAuth('addScope');
	});
	$("#btn_choose").click(function (e) {
		if (e.ctrlKey || e.altKey) {
			choose.init(true);
		} else {
			choose.init();
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
		$(".prizeDetail").append("<div class=\"prize\"><div class=\"input_group\">\u54C1\u540D\uFF1A<input type=\"text\"></div><div class=\"input_group\">\u62BD\u734E\u4EBA\u6578\uFF1A<input type=\"number\"></div></div>");
	});

	$(window).keydown(function (e) {
		if (e.ctrlKey || e.altKey) {
			$("#btn_excel").text("輸出JSON");
		}
	});
	$(window).keyup(function (e) {
		if (!e.ctrlKey || !e.altKey) {
			$("#btn_excel").text("輸出EXCEL");
		}
	});

	$("#unique, #tag").on('change', function () {
		table.redo();
	});

	$(".tables .filters .react").change(function () {
		config.filter.react = $(this).val();
		table.redo();
	});

	$('.tables .total .filters select').change(function () {
		compare.init();
	});

	$('.compare_condition').change(function () {
		$('.tables .total .table_compare').addClass('hide');
		$('.tables .total .table_compare.' + $(this).val()).removeClass('hide');
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
		if (e.ctrlKey) {
			var dd = void 0;
			if (tab.now === 'compare') {
				dd = JSON.stringify(compare[$('.compare_condition').val()]);
			} else {
				dd = JSON.stringify(filterData[tab.now]);
			}
			var url = 'data:text/json;charset=utf8,' + dd;
			window.open(url, '_blank');
			window.focus();
		} else {
			if (filterData.length > 7000) {
				$(".bigExcel").removeClass("hide");
			} else {
				if (tab.now === 'compare') {
					JSONToCSVConvertor(data.excel(compare[$('.compare_condition').val()]), "Comment_helper", true);
				} else {
					JSONToCSVConvertor(data.excel(filterData[tab.now]), "Comment_helper", true);
				}
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
		if (e.ctrlKey) {
			fb.getAuth('sharedposts');
		}
	});
	$("#inputJSON").change(function () {
		$(".waiting").removeClass("hide");
		$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
		data.import(this.files[0]);
	});
});

var config = {
	field: {
		comments: ['like_count', 'message_tags', 'message,from', 'created_time'],
		reactions: [],
		sharedposts: ['story', 'from', 'created_time'],
		url_comments: [],
		feed: []
	},
	limit: {
		comments: '500',
		reactions: '500',
		sharedposts: '500',
		url_comments: '500',
		feed: '500'
	},
	apiVersion: {
		comments: 'v2.7',
		reactions: 'v2.7',
		sharedposts: 'v2.3',
		url_comments: 'v2.7',
		feed: 'v2.3',
		group: 'v2.3',
		newest: 'v2.8'
	},
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	auth: 'user_photos,user_posts,user_managed_groups,manage_pages',
	extension: false
};

var fb = {
	next: '',
	getAuth: function getAuth(type) {
		FB.login(function (response) {
			fb.callback(response, type);
		}, { scope: config.auth, return_scopes: true });
	},
	callback: function callback(response, type) {
		if (response.status === 'connected') {
			console.log(response);
			if (type == "addScope") {
				var authStr = response.authResponse.grantedScopes;
				if (authStr.indexOf('manage_pages') >= 0 && authStr.indexOf('user_managed_groups') >= 0 && authStr.indexOf('user_posts') >= 0) {
					fb.start();
				} else {
					swal('授權失敗，請給予所有權限', 'Authorization Failed! Please contact the admin.', 'error').done();
				}
			} else {
				fbid.init(type);
			}
		} else {
			FB.login(function (response) {
				fb.callback(response, type);
			}, { scope: config.auth, return_scopes: true });
		}
	},
	start: function start() {
		Promise.all([fb.getMe(), fb.getPage(), fb.getGroup()]).then(function (res) {
			sessionStorage.login = JSON.stringify(res);
			fb.genOption(res);
		});
	},
	genOption: function genOption(res) {
		fb.next = '';
		var options = '';
		var type = -1;
		$('#btn_start').addClass('hide');
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = res[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var i = _step.value;

				type++;
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = i[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var j = _step2.value;

						options += "<div class=\"page_btn\" attr-type=\"" + type + "\" attr-value=\"" + j.id + "\" onclick=\"fb.selectPage(this)\">" + j.name + "</div>";
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

		$('#enterURL').append(options).removeClass('hide');
	},
	selectPage: function selectPage(e) {
		$('#enterURL .page_btn').removeClass('active');
		fb.next = '';
		var tar = $(e);
		tar.addClass('active');
		fb.feed(tar.attr('attr-value'), tar.attr('attr-type'), fb.next);
		step.step1();
	},
	hiddenStart: function hiddenStart() {
		var fbid = $('header .dev input').val();
		data.start(fbid);
	},
	feed: function feed(pageID, type) {
		var url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
		var clear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

		if (clear) {
			$('.recommands, .feeds tbody').empty();
			$('.feeds .btn').removeClass('hide');
			$('.feeds .btn').off('click').click(function () {
				var tar = $('#enterURL select').find('option:selected');
				fb.feed(tar.val(), tar.attr('attr-type'), fb.next, false);
			});
		}
		var command = type == '2' ? 'feed' : 'posts';
		var api = void 0;
		if (url == '') {
			api = config.apiVersion.newest + "/" + pageID + "/" + command + "?fields=link,full_picture,created_time,message&limit=25";
		} else {
			api = url;
		}
		FB.api(api, function (res) {
			if (res.data.length == 0) {
				$('.feeds .btn').addClass('hide');
			}
			fb.next = res.paging.next;
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = res.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var i = _step3.value;

					var str = genData(i);
					$('.section .feeds tbody').append(str);
					if (i.message && i.message.indexOf('抽') >= 0) {
						var recommand = genCard(i);
						$('.donate_area .recommands').append(recommand);
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
		});

		function genData(obj) {
			var ids = obj.id.split("_");
			var link = 'https://www.facebook.com/' + ids[0] + '/posts/' + ids[1];

			var mess = obj.message ? obj.message.replace(/\n/g, "<br />") : "";
			var str = "<tr>\n\t\t\t\t\t\t<td><div class=\"pick\" attr-val=\"" + obj.id + "\"  onclick=\"data.start('" + obj.id + "')\">\u958B\u59CB</div></td>\n\t\t\t\t\t\t<td><a href=\"" + link + "\" target=\"_blank\">" + mess + "</a></td>\n\t\t\t\t\t\t<td class=\"nowrap\">" + timeConverter(obj.created_time) + "</td>\n\t\t\t\t\t\t</tr>";
			return str;
		}
		function genCard(obj) {
			var src = obj.full_picture || 'http://placehold.it/300x225';
			var ids = obj.id.split("_");
			var link = 'https://www.facebook.com/' + ids[0] + '/posts/' + ids[1];

			var mess = obj.message ? obj.message.replace(/\n/g, "<br />") : "";
			var str = "<div class=\"card\">\n\t\t\t<a href=\"" + link + "\" target=\"_blank\">\n\t\t\t<div class=\"card-image\">\n\t\t\t<figure class=\"image is-4by3\">\n\t\t\t<img src=\"" + src + "\" alt=\"\">\n\t\t\t</figure>\n\t\t\t</div>\n\t\t\t</a>\n\t\t\t<div class=\"card-content\">\n\t\t\t<div class=\"content\">\n\t\t\t" + mess + "\n\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"pick\" attr-val=\"" + obj.id + "\" onclick=\"data.start('" + obj.id + "')\">\u958B\u59CB</div>\n\t\t\t</div>";
			return str;
		}
	},
	getMe: function getMe() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/me", function (res) {
				var arr = [res];
				resolve(arr);
			});
		});
	},
	getPage: function getPage() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/me/accounts", function (res) {
				resolve(res.data);
			});
		});
	},
	getGroup: function getGroup() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/me/groups", function (res) {
				resolve(res.data);
			});
		});
	},
	extensionAuth: function extensionAuth() {
		FB.login(function (response) {
			fb.extensionCallback(response);
		}, { scope: config.auth, return_scopes: true });
	},
	extensionCallback: function extensionCallback(response) {
		if (response.status === 'connected') {
			var authStr = response.authResponse.grantedScopes;
			if (authStr.indexOf('manage_pages') >= 0 && authStr.indexOf('user_managed_groups') >= 0 && authStr.indexOf('user_posts') >= 0) {
				(function () {
					data.raw.extension = true;
					var extend = JSON.parse(localStorage.getItem("sharedposts"));
					var fid = [];
					var ids = [];
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = extend[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var i = _step4.value;

							fid.push(i.from.id);
							if (fid.length >= 45) {
								ids.push(fid);
								fid = [];
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

					ids.push(fid);
					var promise_array = [],
					    names = {};
					var _iteratorNormalCompletion5 = true;
					var _didIteratorError5 = false;
					var _iteratorError5 = undefined;

					try {
						for (var _iterator5 = ids[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
							var _i = _step5.value;

							var promise = fb.getName(_i).then(function (res) {
								var _iteratorNormalCompletion7 = true;
								var _didIteratorError7 = false;
								var _iteratorError7 = undefined;

								try {
									for (var _iterator7 = Object.keys(res)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
										var _i2 = _step7.value;

										names[_i2] = res[_i2];
									}
								} catch (err) {
									_didIteratorError7 = true;
									_iteratorError7 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion7 && _iterator7.return) {
											_iterator7.return();
										}
									} finally {
										if (_didIteratorError7) {
											throw _iteratorError7;
										}
									}
								}
							});
							promise_array.push(promise);
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

					Promise.all(promise_array).then(function () {
						var _iteratorNormalCompletion6 = true;
						var _didIteratorError6 = false;
						var _iteratorError6 = undefined;

						try {
							for (var _iterator6 = extend[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
								var i = _step6.value;

								i.from.name = names[i.from.id] ? names[i.from.id].name : i.from.name;
							}
						} catch (err) {
							_didIteratorError6 = true;
							_iteratorError6 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion6 && _iterator6.return) {
									_iterator6.return();
								}
							} finally {
								if (_didIteratorError6) {
									throw _iteratorError6;
								}
							}
						}

						data.raw.data.sharedposts = extend;
						data.finish(data.raw);
					});
				})();
			} else {
				swal({
					title: '抓分享需付費，詳情請見粉絲專頁',
					html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
					type: 'warning'
				}).done();
			}
		} else {
			FB.login(function (response) {
				fb.extensionCallback(response);
			}, { scope: config.auth, return_scopes: true });
		}
	},
	getName: function getName(ids) {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/?ids=" + ids.toString(), function (res) {
				resolve(res);
			});
		});
	}
};
var step = {
	step1: function step1() {
		$('.section').removeClass('step2');
		$("html, body").scrollTop(0);
	},
	step2: function step2() {
		$('.recommands, .feeds tbody').empty();
		$('.section').addClass('step2');
		$("html, body").scrollTop(0);
	}
};

var data = {
	raw: {},
	filtered: {},
	userid: '',
	nowLength: 0,
	extension: false,
	promise_array: [],
	test: function test(id) {
		console.log(id);
	},
	init: function init() {
		$(".main_table").DataTable().destroy();
		$("#awardList").hide();
		$(".console .message").text('');
		data.nowLength = 0;
		data.promise_array = [];
		data.raw = [];
	},
	start: function start(fbid) {
		data.init();
		var obj = {
			fullID: fbid
		};
		$(".waiting").removeClass("hide");
		var commands = ['comments', 'reactions', 'sharedposts'];
		var temp_data = obj;
		var _iteratorNormalCompletion8 = true;
		var _didIteratorError8 = false;
		var _iteratorError8 = undefined;

		try {
			var _loop = function _loop() {
				var i = _step8.value;

				temp_data.data = {};
				var promise = data.get(temp_data, i).then(function (res) {
					temp_data.data[i] = res;
				});
				data.promise_array.push(promise);
			};

			for (var _iterator8 = commands[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
				_loop();
			}
		} catch (err) {
			_didIteratorError8 = true;
			_iteratorError8 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion8 && _iterator8.return) {
					_iterator8.return();
				}
			} finally {
				if (_didIteratorError8) {
					throw _iteratorError8;
				}
			}
		}

		Promise.all(data.promise_array).then(function () {
			data.finish(temp_data);
		});
	},
	get: function get(fbid, command) {
		return new Promise(function (resolve, reject) {
			var datas = [];
			var promise_array = [];
			if (fbid.type === 'group') command = 'group';
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/" + command + "?limit=" + config.limit[command] + "&order=chronological&fields=" + config.field[command].toString(), function (res) {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				var _iteratorNormalCompletion9 = true;
				var _didIteratorError9 = false;
				var _iteratorError9 = undefined;

				try {
					for (var _iterator9 = res.data[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
						var d = _step9.value;

						if (command == 'reactions') {
							d.from = { id: d.id, name: d.name };
						}
						datas.push(d);
					}
				} catch (err) {
					_didIteratorError9 = true;
					_iteratorError9 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion9 && _iterator9.return) {
							_iterator9.return();
						}
					} finally {
						if (_didIteratorError9) {
							throw _iteratorError9;
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
					var _iteratorNormalCompletion10 = true;
					var _didIteratorError10 = false;
					var _iteratorError10 = undefined;

					try {
						for (var _iterator10 = res.data[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
							var d = _step10.value;

							if (command == 'reactions') {
								d.from = { id: d.id, name: d.name };
							}
							datas.push(d);
						}
					} catch (err) {
						_didIteratorError10 = true;
						_iteratorError10 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion10 && _iterator10.return) {
								_iterator10.return();
							}
						} finally {
							if (_didIteratorError10) {
								throw _iteratorError10;
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
		step.step2();
		swal('完成！', 'Done!', 'success').done();
		$('.result_area > .title span').text(fbid.fullID);
		data.raw = fbid;
		localStorage.setItem("raw", JSON.stringify(fbid));
		data.filter(data.raw, true);
	},
	filter: function filter(rawData) {
		var generate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		data.filtered = {};
		var isDuplicate = $("#unique").prop("checked");
		var isTag = $("#tag").prop("checked");
		var _iteratorNormalCompletion11 = true;
		var _didIteratorError11 = false;
		var _iteratorError11 = undefined;

		try {
			for (var _iterator11 = Object.keys(rawData.data)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
				var key = _step11.value;

				if (key === 'reactions') isTag = false;
				var newData = _filter.totalFilter.apply(_filter, [rawData.data[key], key, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
				data.filtered[key] = newData;
			}
		} catch (err) {
			_didIteratorError11 = true;
			_iteratorError11 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion11 && _iterator11.return) {
					_iterator11.return();
				}
			} finally {
				if (_didIteratorError11) {
					throw _iteratorError11;
				}
			}
		}

		if (generate === true) {
			table.generate(data.filtered);
		} else {
			return data.filtered;
		}
	},
	excel: function excel(raw) {
		var newObj = [];
		if (data.extension) {
			$.each(raw, function (i) {
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
			$.each(raw, function (i) {
				var tmp = {
					"序號": i + 1,
					"臉書連結": 'http://www.facebook.com/' + this.from.id,
					"姓名": this.from.name,
					"心情": this.type || '',
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
		$(".tables table").DataTable().destroy();
		var filtered = rawdata;
		var pic = $("#picture").prop("checked");
		var _iteratorNormalCompletion12 = true;
		var _didIteratorError12 = false;
		var _iteratorError12 = undefined;

		try {
			for (var _iterator12 = Object.keys(filtered)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
				var key = _step12.value;

				var thead = '';
				var tbody = '';
				if (key === 'reactions') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td>\u5FC3\u60C5</td>";
				} else if (key === 'sharedposts') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
				} else {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td>\u8B9A</td>\n\t\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
				}
				var _iteratorNormalCompletion14 = true;
				var _didIteratorError14 = false;
				var _iteratorError14 = undefined;

				try {
					for (var _iterator14 = filtered[key].entries()[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
						var _step14$value = _slicedToArray(_step14.value, 2),
						    j = _step14$value[0],
						    val = _step14$value[1];

						var picture = '';
						if (pic) {
							// picture = `<img src="http://graph.facebook.com/${val.from.id}/picture?type=small"><br>`;
						}
						var td = "<td>" + (j + 1) + "</td>\n\t\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + picture + val.from.name + "</a></td>";
						if (key === 'reactions') {
							td += "<td class=\"center\"><span class=\"react " + val.type + "\"></span>" + val.type + "</td>";
						} else if (key === 'sharedposts') {
							td += "<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + val.story + "</a></td>\n\t\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
						} else {
							td += "<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + val.message + "</a></td>\n\t\t\t\t\t<td>" + val.like_count + "</td>\n\t\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
						}
						var tr = "<tr>" + td + "</tr>";
						tbody += tr;
					}
				} catch (err) {
					_didIteratorError14 = true;
					_iteratorError14 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion14 && _iterator14.return) {
							_iterator14.return();
						}
					} finally {
						if (_didIteratorError14) {
							throw _iteratorError14;
						}
					}
				}

				var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
				$(".tables ." + key + " table").html('').append(insert);
			}
		} catch (err) {
			_didIteratorError12 = true;
			_iteratorError12 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion12 && _iterator12.return) {
					_iterator12.return();
				}
			} finally {
				if (_didIteratorError12) {
					throw _iteratorError12;
				}
			}
		}

		active();
		tab.init();
		compare.init();

		function active() {
			var table = $(".tables table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			var arr = ['comments', 'reactions', 'sharedposts'];
			var _iteratorNormalCompletion13 = true;
			var _didIteratorError13 = false;
			var _iteratorError13 = undefined;

			try {
				var _loop2 = function _loop2() {
					var i = _step13.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator13 = arr[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
					_loop2();
				}
			} catch (err) {
				_didIteratorError13 = true;
				_iteratorError13 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion13 && _iterator13.return) {
						_iterator13.return();
					}
				} finally {
					if (_didIteratorError13) {
						throw _iteratorError13;
					}
				}
			}
		}
	},
	redo: function redo() {
		data.filter(data.raw, true);
	}
};

var compare = {
	and: [],
	or: [],
	raw: [],
	init: function init() {
		compare.and = [];
		compare.or = [];
		compare.raw = data.filter(data.raw);
		var ignore = $('.tables .total .filters select').val();
		var base = [];
		var final = [];
		var compare_num = 1;
		if (ignore === 'ignore') compare_num = 2;

		var _iteratorNormalCompletion15 = true;
		var _didIteratorError15 = false;
		var _iteratorError15 = undefined;

		try {
			for (var _iterator15 = Object.keys(compare.raw)[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
				var _key = _step15.value;

				if (_key !== ignore) {
					var _iteratorNormalCompletion18 = true;
					var _didIteratorError18 = false;
					var _iteratorError18 = undefined;

					try {
						for (var _iterator18 = compare.raw[_key][Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
							var _i4 = _step18.value;

							base.push(_i4);
						}
					} catch (err) {
						_didIteratorError18 = true;
						_iteratorError18 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion18 && _iterator18.return) {
								_iterator18.return();
							}
						} finally {
							if (_didIteratorError18) {
								throw _iteratorError18;
							}
						}
					}
				}
			}
		} catch (err) {
			_didIteratorError15 = true;
			_iteratorError15 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion15 && _iterator15.return) {
					_iterator15.return();
				}
			} finally {
				if (_didIteratorError15) {
					throw _iteratorError15;
				}
			}
		}

		var sort = data.raw.extension ? 'name' : 'id';
		base = base.sort(function (a, b) {
			return a.from[sort] > b.from[sort] ? 1 : -1;
		});

		var _iteratorNormalCompletion16 = true;
		var _didIteratorError16 = false;
		var _iteratorError16 = undefined;

		try {
			for (var _iterator16 = base[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
				var _i5 = _step16.value;

				_i5.match = 0;
			}
		} catch (err) {
			_didIteratorError16 = true;
			_iteratorError16 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion16 && _iterator16.return) {
					_iterator16.return();
				}
			} finally {
				if (_didIteratorError16) {
					throw _iteratorError16;
				}
			}
		}

		var temp = '';
		var temp_name = '';
		for (var _i3 in base) {
			var obj = base[_i3];
			if (obj.from.id == temp || data.raw.extension && obj.from.name == temp_name) {
				var tar = final[final.length - 1];
				tar.match++;
				var _iteratorNormalCompletion17 = true;
				var _didIteratorError17 = false;
				var _iteratorError17 = undefined;

				try {
					for (var _iterator17 = Object.keys(obj)[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
						var key = _step17.value;

						if (!tar[key]) tar[key] = obj[key];
					}
				} catch (err) {
					_didIteratorError17 = true;
					_iteratorError17 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion17 && _iterator17.return) {
							_iterator17.return();
						}
					} finally {
						if (_didIteratorError17) {
							throw _iteratorError17;
						}
					}
				}
			} else {
				final.push(obj);
				temp = obj.from.id;
				temp_name = obj.from.name;
			}
		}

		compare.or = final;
		compare.and = compare.or.filter(function (val) {
			return val.match == compare_num;
		});
		compare.generate();
	},
	generate: function generate() {
		$(".tables .total table").DataTable().destroy();
		var data_and = compare.and;

		var tbody = '';
		var _iteratorNormalCompletion19 = true;
		var _didIteratorError19 = false;
		var _iteratorError19 = undefined;

		try {
			for (var _iterator19 = data_and.entries()[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
				var _step19$value = _slicedToArray(_step19.value, 2),
				    j = _step19$value[0],
				    val = _step19$value[1];

				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '0') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
			}
		} catch (err) {
			_didIteratorError19 = true;
			_iteratorError19 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion19 && _iterator19.return) {
					_iterator19.return();
				}
			} finally {
				if (_didIteratorError19) {
					throw _iteratorError19;
				}
			}
		}

		$(".tables .total .table_compare.and tbody").html('').append(tbody);

		var data_or = compare.or;
		var tbody2 = '';
		var _iteratorNormalCompletion20 = true;
		var _didIteratorError20 = false;
		var _iteratorError20 = undefined;

		try {
			for (var _iterator20 = data_or.entries()[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
				var _step20$value = _slicedToArray(_step20.value, 2),
				    j = _step20$value[0],
				    val = _step20$value[1];

				var _td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var _tr = "<tr>" + _td + "</tr>";
				tbody2 += _tr;
			}
		} catch (err) {
			_didIteratorError20 = true;
			_iteratorError20 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion20 && _iterator20.return) {
					_iterator20.return();
				}
			} finally {
				if (_didIteratorError20) {
					throw _iteratorError20;
				}
			}
		}

		$(".tables .total .table_compare.or tbody").html('').append(tbody2);

		active();

		function active() {
			var table = $(".tables .total table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			var arr = ['and', 'or'];
			var _iteratorNormalCompletion21 = true;
			var _didIteratorError21 = false;
			var _iteratorError21 = undefined;

			try {
				var _loop3 = function _loop3() {
					var i = _step21.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator21 = arr[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
					_loop3();
				}
			} catch (err) {
				_didIteratorError21 = true;
				_iteratorError21 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion21 && _iterator21.return) {
						_iterator21.return();
					}
				} finally {
					if (_didIteratorError21) {
						throw _iteratorError21;
					}
				}
			}
		}
	}
};

var choose = {
	data: [],
	award: [],
	num: 0,
	detail: false,
	list: [],
	init: function init() {
		var ctrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

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
		choose.go(ctrl);
	},
	go: function go(ctrl) {
		var command = tab.now;
		if (tab.now === 'compare') {
			choose.award = genRandomArray(compare[$('.compare_condition').val()].length).splice(0, choose.num);
		} else {
			choose.award = genRandomArray(choose.data[command].length).splice(0, choose.num);
		}
		var insert = '';
		var tempArr = [];
		if (command === 'comments') {
			$('.tables > div.active table').DataTable().column(2).data().each(function (value, index) {
				var word = $('.searchComment').val();
				if (value.indexOf(word) >= 0) tempArr.push(index);
			});
		}
		var _iteratorNormalCompletion22 = true;
		var _didIteratorError22 = false;
		var _iteratorError22 = undefined;

		try {
			for (var _iterator22 = choose.award[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
				var _i6 = _step22.value;

				var row = tempArr.length == 0 ? _i6 : tempArr[_i6];
				var _tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
				insert += '<tr>' + _tar + '</tr>';
			}
		} catch (err) {
			_didIteratorError22 = true;
			_iteratorError22 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion22 && _iterator22.return) {
					_iterator22.return();
				}
			} finally {
				if (_didIteratorError22) {
					throw _iteratorError22;
				}
			}
		}

		$('#awardList table tbody').html(insert);
		if (!ctrl) {
			$("#awardList tbody tr").each(function () {
				var tar = $(this).find('td').eq(1);
				var id = tar.find('a').attr('attr-fbid');
				tar.prepend("<img src=\"http://graph.facebook.com/" + id + "/picture?type=small\"><br>");
			});
		}

		$('#awardList table tbody tr').addClass('success');

		if (choose.detail) {
			var now = 0;
			for (var k in choose.list) {
				var tar = $("#awardList tbody tr").eq(now);
				$("<tr><td class=\"prizeName\" colspan=\"7\">\u734E\u54C1\uFF1A " + choose.list[k].name + " <span>\u5171 " + choose.list[k].num + " \u540D</span></td></tr>").insertBefore(tar);
				now += choose.list[k].num + 1;
			}
			$("#moreprize").removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		}
		$("#awardList").fadeIn(1000);
	}
};

var _filter = {
	totalFilter: function totalFilter(raw, command, isDuplicate, isTag, word, react, endTime) {
		var data = raw;
		if (isDuplicate) {
			data = _filter.unique(data);
		}
		if (word !== '' && command == 'comments') {
			data = _filter.word(data, word);
		}
		if (isTag && command == 'comments') {
			data = _filter.tag(data);
		}
		if (command !== 'reactions') {
			data = _filter.time(data, endTime);
		} else {
			data = _filter.react(data, react);
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
	init: function init() {}
};

var tab = {
	now: "comments",
	init: function init() {
		$('#comment_table .tabs .tab').click(function () {
			$('#comment_table .tabs .tab').removeClass('active');
			$(this).addClass('active');
			tab.now = $(this).attr('attr-type');
			var tar = $(this).index();
			$('.tables > div').removeClass('active');
			$('.tables > div').eq(tar).addClass('active');
			if (tab.now === 'compare') {
				compare.init();
			}
		});
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
	if (hour < 10) {
		hour = "0" + hour;
	}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJsYXN0RGF0YSIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJkYXRhIiwiZmluaXNoIiwic2Vzc2lvblN0b3JhZ2UiLCJsb2dpbiIsImZiIiwiZ2VuT3B0aW9uIiwiY2xpY2siLCJlIiwiZXh0ZW5zaW9uQXV0aCIsImdldEF1dGgiLCJjdHJsS2V5IiwiYWx0S2V5IiwiY2hvb3NlIiwiaW5pdCIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJuZXdlc3QiLCJ3b3JkIiwiYXV0aCIsImV4dGVuc2lvbiIsIm5leHQiLCJ0eXBlIiwiRkIiLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFN0ciIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJpbmRleE9mIiwic3dhbCIsImRvbmUiLCJmYmlkIiwiUHJvbWlzZSIsImFsbCIsImdldE1lIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsIm9wdGlvbnMiLCJpIiwiaiIsImlkIiwibmFtZSIsInNlbGVjdFBhZ2UiLCJ0YXIiLCJhdHRyIiwic3RlcCIsInN0ZXAxIiwiaGlkZGVuU3RhcnQiLCJwYWdlSUQiLCJjbGVhciIsImVtcHR5Iiwib2ZmIiwiZmluZCIsImNvbW1hbmQiLCJhcGkiLCJwYWdpbmciLCJzdHIiLCJnZW5EYXRhIiwibWVzc2FnZSIsInJlY29tbWFuZCIsImdlbkNhcmQiLCJvYmoiLCJpZHMiLCJzcGxpdCIsImxpbmsiLCJtZXNzIiwicmVwbGFjZSIsInRpbWVDb252ZXJ0ZXIiLCJjcmVhdGVkX3RpbWUiLCJzcmMiLCJmdWxsX3BpY3R1cmUiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJyIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJleHRlbmQiLCJmaWQiLCJwdXNoIiwiZnJvbSIsInByb21pc2VfYXJyYXkiLCJuYW1lcyIsInByb21pc2UiLCJnZXROYW1lIiwiT2JqZWN0Iiwia2V5cyIsInRpdGxlIiwiaHRtbCIsInRvU3RyaW5nIiwic2Nyb2xsVG9wIiwic3RlcDIiLCJmaWx0ZXJlZCIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInRlc3QiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImZ1bGxJRCIsImNvbW1hbmRzIiwidGVtcF9kYXRhIiwiZ2V0IiwiZGF0YXMiLCJkIiwiZ2V0TmV4dCIsImdldEpTT04iLCJmYWlsIiwic2V0SXRlbSIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwia2V5IiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwic3RvcnkiLCJsaWtlX2NvdW50IiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwicGljIiwidGhlYWQiLCJ0Ym9keSIsImVudHJpZXMiLCJwaWN0dXJlIiwidGQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJzZWFyY2giLCJ2YWx1ZSIsImRyYXciLCJhbmQiLCJvciIsImlnbm9yZSIsImJhc2UiLCJmaW5hbCIsImNvbXBhcmVfbnVtIiwic29ydCIsImEiLCJiIiwibWF0Y2giLCJ0ZW1wIiwidGVtcF9uYW1lIiwiZGF0YV9hbmQiLCJkYXRhX29yIiwidGJvZHkyIiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwiY3RybCIsIm4iLCJwYXJzZUludCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwidGVtcEFyciIsImNvbHVtbiIsImluZGV4Iiwicm93Iiwibm9kZSIsImlubmVySFRNTCIsImVxIiwicHJlcGVuZCIsImsiLCJpbnNlcnRCZWZvcmUiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0IiwiZm9yRWFjaCIsIml0ZW0iLCJuZXdBcnkiLCJncmVwIiwibWVzc2FnZV90YWdzIiwidCIsInRpbWVfYXJ5IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwidWkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJtYXAiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInNsaWNlIiwiYWxlcnQiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFlQyxTQUFmOztBQUVBLFNBQVNBLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXVCQyxHQUF2QixFQUEyQkMsQ0FBM0IsRUFDQTtBQUNDLEtBQUksQ0FBQ04sWUFBTCxFQUFrQjtBQUNqQk8sVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWdELDRCQUFoRDtBQUNBQyxJQUFFLGlCQUFGLEVBQXFCQyxNQUFyQjtBQUNBVixpQkFBZSxJQUFmO0FBQ0E7QUFDRCxRQUFPLEtBQVA7QUFDQTtBQUNEUyxFQUFFRSxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUMzQixLQUFJQyxXQUFXQyxLQUFLQyxLQUFMLENBQVdDLGFBQWFDLE9BQWIsQ0FBcUIsS0FBckIsQ0FBWCxDQUFmO0FBQ0EsS0FBSUosUUFBSixFQUFhO0FBQ1pLLE9BQUtDLE1BQUwsQ0FBWU4sUUFBWjtBQUNBO0FBQ0QsS0FBSU8sZUFBZUMsS0FBbkIsRUFBeUI7QUFDeEJDLEtBQUdDLFNBQUgsQ0FBYVQsS0FBS0MsS0FBTCxDQUFXSyxlQUFlQyxLQUExQixDQUFiO0FBQ0E7O0FBRURaLEdBQUUsK0JBQUYsRUFBbUNlLEtBQW5DLENBQXlDLFVBQVNDLENBQVQsRUFBVztBQUNuREgsS0FBR0ksYUFBSDtBQUNBLEVBRkQ7O0FBSUFqQixHQUFFLGVBQUYsRUFBbUJlLEtBQW5CLENBQXlCLFVBQVNDLENBQVQsRUFBVztBQUNuQ0gsS0FBR0ssT0FBSCxDQUFXLFVBQVg7QUFDQSxFQUZEOztBQUlBbEIsR0FBRSxZQUFGLEVBQWdCZSxLQUFoQixDQUFzQixZQUFVO0FBQy9CRixLQUFHSyxPQUFILENBQVcsVUFBWDtBQUNBLEVBRkQ7QUFHQWxCLEdBQUUsYUFBRixFQUFpQmUsS0FBakIsQ0FB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QXBCLEVBQXlCLEdBQXpCLENBQVo7O0FBRUE7QUFDQSxLQUFJK0osTUFBTSx1Q0FBdUNDLFVBQVVMLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJN0osT0FBTzFILFNBQVM2UixhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQW5LLE1BQUtvSyxJQUFMLEdBQVlILEdBQVo7O0FBRUE7QUFDQWpLLE1BQUtxSyxLQUFMLEdBQWEsbUJBQWI7QUFDQXJLLE1BQUtzSyxRQUFMLEdBQWdCTixXQUFXLE1BQTNCOztBQUVBO0FBQ0ExUixVQUFTaVMsSUFBVCxDQUFjQyxXQUFkLENBQTBCeEssSUFBMUI7QUFDQUEsTUFBSzdHLEtBQUw7QUFDQWIsVUFBU2lTLElBQVQsQ0FBY0UsV0FBZCxDQUEwQnpLLElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcdFxyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHRsZXQgbGFzdERhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmF3XCIpKTtcclxuXHRpZiAobGFzdERhdGEpe1xyXG5cdFx0ZGF0YS5maW5pc2gobGFzdERhdGEpO1xyXG5cdH1cclxuXHRpZiAoc2Vzc2lvblN0b3JhZ2UubG9naW4pe1xyXG5cdFx0ZmIuZ2VuT3B0aW9uKEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pKTtcclxuXHR9XHJcblxyXG5cdCQoXCIudGFibGVzID4gLnNoYXJlZHBvc3RzIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcclxuXHR9KTtcclxuXHRcclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX3N0YXJ0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHRjaG9vc2UuaW5pdCh0cnVlKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8ICFlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi50YWJsZXMgLmZpbHRlcnMgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5jb21wYXJlX2NvbmRpdGlvbicpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuJysgJCh0aGlzKS52YWwoKSkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XHJcblx0XHRcInNpbmdsZURhdGVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS1NTS1ERCAgIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSxmdW5jdGlvbihzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShub3dEYXRlKCkpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGlmIChlLmN0cmxLZXkpe1xyXG5cdFx0XHRsZXQgZGQ7XHJcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGFbdGFiLm5vd10pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBkZDtcclxuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XHJcblx0XHRcdHdpbmRvdy5mb2N1cygpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApe1xyXG5cdFx0XHRcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGFbdGFiLm5vd10pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpe1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZihlLmN0cmxLZXkpe1xyXG5cdFx0XHRmYi5nZXRBdXRoKCdzaGFyZWRwb3N0cycpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UsZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuNycsXHJcblx0XHRyZWFjdGlvbnM6ICd2Mi43JyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjIuMycsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi43JyxcclxuXHRcdGZlZWQ6ICd2Mi4zJyxcclxuXHRcdGdyb3VwOiAndjIuMycsXHJcblx0XHRuZXdlc3Q6ICd2Mi44J1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0YXV0aDogJ3VzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9tYW5hZ2VkX2dyb3VwcyxtYW5hZ2VfcGFnZXMnLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRuZXh0OiAnJyxcclxuXHRnZXRBdXRoOiAodHlwZSk9PntcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIil7XHJcblx0XHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCdtYW5hZ2VfcGFnZXMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9tYW5hZ2VkX2dyb3VwcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XHJcblx0XHRcdFx0XHRmYi5zdGFydCgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+aOiOasiuWkseaVl++8jOiri+e1puS6iOaJgOacieasiumZkCcsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRQcm9taXNlLmFsbChbZmIuZ2V0TWUoKSxmYi5nZXRQYWdlKCksIGZiLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XHJcblx0XHRcdHNlc3Npb25TdG9yYWdlLmxvZ2luID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuXHRcdFx0ZmIuZ2VuT3B0aW9uKHJlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbk9wdGlvbjogKHJlcyk9PntcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCBvcHRpb25zID0gJyc7XHJcblx0XHRsZXQgdHlwZSA9IC0xO1xyXG5cdFx0JCgnI2J0bl9zdGFydCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcclxuXHRcdFx0dHlwZSsrO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgaSl7XHJcblx0XHRcdFx0b3B0aW9ucyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgYXR0ci10eXBlPVwiJHt0eXBlfVwiIGF0dHItdmFsdWU9XCIke2ouaWR9XCIgb25jbGljaz1cImZiLnNlbGVjdFBhZ2UodGhpcylcIj4ke2oubmFtZX08L2Rpdj5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcjZW50ZXJVUkwnKS5hcHBlbmQob3B0aW9ucykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6IChlKT0+e1xyXG5cdFx0JCgnI2VudGVyVVJMIC5wYWdlX2J0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCB0YXIgPSAkKGUpO1xyXG5cdFx0dGFyLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGZiLmZlZWQodGFyLmF0dHIoJ2F0dHItdmFsdWUnKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0KTtcclxuXHRcdHN0ZXAuc3RlcDEoKTtcclxuXHR9LFxyXG5cdGhpZGRlblN0YXJ0OiAoKT0+e1xyXG5cdFx0bGV0IGZiaWQgPSAkKCdoZWFkZXIgLmRldiBpbnB1dCcpLnZhbCgpO1xyXG5cdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHR9LFxyXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpPT57XHJcblx0XHRpZiAoY2xlYXIpe1xyXG5cdFx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcclxuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLm9mZignY2xpY2snKS5jbGljaygoKT0+e1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKCcjZW50ZXJVUkwgc2VsZWN0JykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJyk7XHJcblx0XHRcdFx0ZmIuZmVlZCh0YXIudmFsKCksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCwgZmFsc2UpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGxldCBjb21tYW5kID0gKHR5cGUgPT0gJzInKSA/ICdmZWVkJzoncG9zdHMnO1xyXG5cdFx0bGV0IGFwaTtcclxuXHRcdGlmICh1cmwgPT0gJycpe1xyXG5cdFx0XHRhcGkgPSBgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZUlEfS8ke2NvbW1hbmR9P2ZpZWxkcz1saW5rLGZ1bGxfcGljdHVyZSxjcmVhdGVkX3RpbWUsbWVzc2FnZSZsaW1pdD0yNWA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YXBpID0gdXJsO1xyXG5cdFx0fVxyXG5cdFx0RkIuYXBpKGFwaSwgKHJlcyk9PntcclxuXHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0XHQkKCcuZmVlZHMgLmJ0bicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZmIubmV4dCA9IHJlcy5wYWdpbmcubmV4dDtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRsZXQgc3RyID0gZ2VuRGF0YShpKTtcclxuXHRcdFx0XHQkKCcuc2VjdGlvbiAuZmVlZHMgdGJvZHknKS5hcHBlbmQoc3RyKTtcclxuXHRcdFx0XHRpZiAoaS5tZXNzYWdlICYmIGkubWVzc2FnZS5pbmRleE9mKCfmir0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdGxldCByZWNvbW1hbmQgPSBnZW5DYXJkKGkpO1xyXG5cdFx0XHRcdFx0JCgnLmRvbmF0ZV9hcmVhIC5yZWNvbW1hbmRzJykuYXBwZW5kKHJlY29tbWFuZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRmdW5jdGlvbiBnZW5EYXRhKG9iail7XHJcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xyXG5cdFx0XHRsZXQgbGluayA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJytpZHNbMF0rJy9wb3N0cy8nK2lkc1sxXTtcclxuXHJcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XHJcblx0XHRcdGxldCBzdHIgPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGRpdiBjbGFzcz1cInBpY2tcIiBhdHRyLXZhbD1cIiR7b2JqLmlkfVwiICBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke21lc3N9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcihvYmouY3JlYXRlZF90aW1lKX08L3RkPlxyXG5cdFx0XHRcdFx0XHQ8L3RyPmA7XHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBnZW5DYXJkKG9iail7XHJcblx0XHRcdGxldCBzcmMgPSBvYmouZnVsbF9waWN0dXJlIHx8ICdodHRwOi8vcGxhY2Vob2xkLml0LzMwMHgyMjUnO1xyXG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcclxuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRsZXRcdHN0ciA9IGA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxyXG5cdFx0XHQ8YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZVwiPlxyXG5cdFx0XHQ8ZmlndXJlIGNsYXNzPVwiaW1hZ2UgaXMtNGJ5M1wiPlxyXG5cdFx0XHQ8aW1nIHNyYz1cIiR7c3JjfVwiIGFsdD1cIlwiPlxyXG5cdFx0XHQ8L2ZpZ3VyZT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvYT5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtY29udGVudFwiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG5cdFx0XHQke21lc3N9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cInBpY2tcIiBhdHRyLXZhbD1cIiR7b2JqLmlkfVwiIG9uY2xpY2s9XCJkYXRhLnN0YXJ0KCcke29iai5pZH0nKVwiPumWi+WnizwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5gO1xyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TWU6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWVgLCAocmVzKT0+e1xyXG5cdFx0XHRcdGxldCBhcnIgPSBbcmVzXTtcclxuXHRcdFx0XHRyZXNvbHZlKGFycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRQYWdlOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2FjY291bnRzYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwc2AsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRkYXRhLnJhdy5leHRlbnNpb24gPSB0cnVlO1xyXG5cdFx0XHRcdGxldCBleHRlbmQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2hhcmVkcG9zdHNcIikpO1xyXG5cdFx0XHRcdGxldCBmaWQgPSBbXTtcclxuXHRcdFx0XHRsZXQgaWRzID0gW107XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRmaWQucHVzaChpLmZyb20uaWQpO1xyXG5cdFx0XHRcdFx0aWYgKGZpZC5sZW5ndGggPj00NSl7XHJcblx0XHRcdFx0XHRcdGlkcy5wdXNoKGZpZCk7XHJcblx0XHRcdFx0XHRcdGZpZCA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZHMucHVzaChmaWQpO1xyXG5cdFx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW10sIG5hbWVzID0ge307XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGlkcyl7XHJcblx0XHRcdFx0XHRsZXQgcHJvbWlzZSA9IGZiLmdldE5hbWUoaSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgT2JqZWN0LmtleXMocmVzKSl7XHJcblx0XHRcdFx0XHRcdFx0bmFtZXNbaV0gPSByZXNbaV07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0UHJvbWlzZS5hbGwocHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdGkuZnJvbS5uYW1lID0gbmFtZXNbaS5mcm9tLmlkXSA/IG5hbWVzW2kuZnJvbS5pZF0ubmFtZSA6IGkuZnJvbS5uYW1lO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZGF0YS5yYXcuZGF0YS5zaGFyZWRwb3N0cyA9IGV4dGVuZDtcclxuXHRcdFx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcyk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcbmxldCBzdGVwID0ge1xyXG5cdHN0ZXAxOiAoKT0+e1xyXG5cdFx0JCgnLnNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc3RlcDInKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcclxuXHR9LFxyXG5cdHN0ZXAyOiAoKT0+e1xyXG5cdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHQkKCcuc2VjdGlvbicpLmFkZENsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiB7fSxcclxuXHRmaWx0ZXJlZDoge30sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwcm9taXNlX2FycmF5OiBbXSxcclxuXHR0ZXN0OiAoaWQpPT57XHJcblx0XHRjb25zb2xlLmxvZyhpZCk7XHJcblx0fSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGRhdGEucHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCk9PntcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0ZnVsbElEOiBmYmlkXHJcblx0XHR9XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0bGV0IGNvbW1hbmRzID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRsZXQgdGVtcF9kYXRhID0gb2JqO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGNvbW1hbmRzKXtcclxuXHRcdFx0dGVtcF9kYXRhLmRhdGEgPSB7fTtcclxuXHRcdFx0bGV0IHByb21pc2UgPSBkYXRhLmdldCh0ZW1wX2RhdGEsIGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHR0ZW1wX2RhdGEuZGF0YVtpXSA9IHJlcztcclxuXHRcdFx0fSk7XHJcblx0XHRcdGRhdGEucHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdFByb21pc2UuYWxsKGRhdGEucHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRkYXRhLmZpbmlzaCh0ZW1wX2RhdGEpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkLCBjb21tYW5kKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2NvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2NvbW1hbmRdfSZvcmRlcj1jaHJvbm9sb2dpY2FsJmZpZWxkcz0ke2NvbmZpZy5maWVsZFtjb21tYW5kXS50b1N0cmluZygpfWAsKHJlcyk9PntcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdHN0ZXAuc3RlcDIoKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0JCgnLnJlc3VsdF9hcmVhID4gLnRpdGxlIHNwYW4nKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmF3XCIsIEpTT04uc3RyaW5naWZ5KGZiaWQpKTtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XHJcblx0XHRkYXRhLmZpbHRlcmVkID0ge307XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocmF3RGF0YS5kYXRhKSl7XHJcblx0XHRcdGlmIChrZXkgPT09ICdyZWFjdGlvbnMnKSBpc1RhZyA9IGZhbHNlO1xyXG5cdFx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLmRhdGFba2V5XSwga2V5LCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHRcclxuXHRcdFx0ZGF0YS5maWx0ZXJlZFtrZXldID0gbmV3RGF0YTtcclxuXHRcdH1cclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSl7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmlsdGVyZWQpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBkYXRhLmZpbHRlcmVkO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpPT57XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pe1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuW/g+aDhVwiIDogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpPT57XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmVkID0gcmF3ZGF0YTtcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhmaWx0ZXJlZCkpe1xyXG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZD7lv4Pmg4U8L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0XHQkKFwiLnRhYmxlcyAuXCIra2V5K1wiIHRhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHRcdHRhYi5pbml0KCk7XHJcblx0XHRjb21wYXJlLmluaXQoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjb21wYXJlID0ge1xyXG5cdGFuZDogW10sXHJcblx0b3I6IFtdLFxyXG5cdHJhdzogW10sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdGNvbXBhcmUuYW5kID0gW107XHJcblx0XHRjb21wYXJlLm9yID0gW107XHJcblx0XHRjb21wYXJlLnJhdyA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGxldCBpZ25vcmUgPSAkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS52YWwoKTtcclxuXHRcdGxldCBiYXNlID0gW107XHJcblx0XHRsZXQgZmluYWwgPSBbXTtcclxuXHRcdGxldCBjb21wYXJlX251bSA9IDE7XHJcblx0XHRpZiAoaWdub3JlID09PSAnaWdub3JlJykgY29tcGFyZV9udW0gPSAyO1xyXG5cclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGNvbXBhcmUucmF3KSl7XHJcblx0XHRcdGlmIChrZXkgIT09IGlnbm9yZSl7XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGNvbXBhcmUucmF3W2tleV0pe1xyXG5cdFx0XHRcdFx0YmFzZS5wdXNoKGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IHNvcnQgPSAoZGF0YS5yYXcuZXh0ZW5zaW9uKSA/ICduYW1lJzonaWQnO1xyXG5cdFx0YmFzZSA9IGJhc2Uuc29ydCgoYSxiKT0+e1xyXG5cdFx0XHRyZXR1cm4gYS5mcm9tW3NvcnRdID4gYi5mcm9tW3NvcnRdID8gMTotMTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGZvcihsZXQgaSBvZiBiYXNlKXtcclxuXHRcdFx0aS5tYXRjaCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdGxldCB0ZW1wX25hbWUgPSAnJztcclxuXHRcdGZvcihsZXQgaSBpbiBiYXNlKXtcclxuXHRcdFx0bGV0IG9iaiA9IGJhc2VbaV07XHJcblx0XHRcdGlmIChvYmouZnJvbS5pZCA9PSB0ZW1wIHx8IChkYXRhLnJhdy5leHRlbnNpb24gJiYgKG9iai5mcm9tLm5hbWUgPT0gdGVtcF9uYW1lKSkpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSBmaW5hbFtmaW5hbC5sZW5ndGgtMV07XHJcblx0XHRcdFx0dGFyLm1hdGNoKys7XHJcblx0XHRcdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSl7XHJcblx0XHRcdFx0XHRpZiAoIXRhcltrZXldKSB0YXJba2V5XSA9IG9ialtrZXldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmluYWwucHVzaChvYmopO1xyXG5cdFx0XHRcdHRlbXAgPSBvYmouZnJvbS5pZDtcclxuXHRcdFx0XHR0ZW1wX25hbWUgPSBvYmouZnJvbS5uYW1lO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0XHJcblx0XHRjb21wYXJlLm9yID0gZmluYWw7XHJcblx0XHRjb21wYXJlLmFuZCA9IGNvbXBhcmUub3IuZmlsdGVyKCh2YWwpPT57XHJcblx0XHRcdHJldHVybiB2YWwubWF0Y2ggPT0gY29tcGFyZV9udW07XHJcblx0XHR9KTtcclxuXHRcdGNvbXBhcmUuZ2VuZXJhdGUoKTtcclxuXHR9LFxyXG5cdGdlbmVyYXRlOiAoKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBkYXRhX2FuZCA9IGNvbXBhcmUuYW5kO1xyXG5cclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX2FuZC5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnMCd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLmFuZCB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cclxuXHRcdGxldCBkYXRhX29yID0gY29tcGFyZS5vcjtcclxuXHRcdGxldCB0Ym9keTIgPSAnJztcclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9vci5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkyICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLm9yIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keTIpO1xyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IGFyciA9IFsnYW5kJywnb3InXTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoY3RybCA9IGZhbHNlKT0+e1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApe1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oY3RybCk7XHJcblx0fSxcclxuXHRnbzogKGN0cmwpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9IHRhYi5ub3c7XHJcblx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YVtjb21tYW5kXS5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1x0XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRsZXQgdGVtcEFyciA9IFtdO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLmNvbHVtbigyKS5kYXRhKCkuZWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpe1xyXG5cdFx0XHRcdGxldCB3b3JkID0gJCgnLnNlYXJjaENvbW1lbnQnKS52YWwoKTtcclxuXHRcdFx0XHRpZiAodmFsdWUuaW5kZXhPZih3b3JkKSA+PSAwKSB0ZW1wQXJyLnB1c2goaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiBjaG9vc2UuYXdhcmQpe1xyXG5cdFx0XHRsZXQgcm93ID0gKHRlbXBBcnIubGVuZ3RoID09IDApID8gaTp0ZW1wQXJyW2ldO1xyXG5cdFx0XHRsZXQgdGFyID0gJCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5yb3cocm93KS5ub2RlKCkuaW5uZXJIVE1MO1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0cj4nICsgdGFyICsgJzwvdHI+JztcclxuXHRcdH1cclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKGluc2VydCk7XHJcblx0XHRpZiAoIWN0cmwpe1xyXG5cdFx0XHQkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQodGhpcykuZmluZCgndGQnKS5lcSgxKTtcclxuXHRcdFx0XHRsZXQgaWQgPSB0YXIuZmluZCgnYScpLmF0dHIoJ2F0dHItZmJpZCcpO1xyXG5cdFx0XHRcdHRhci5wcmVwZW5kKGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYoY2hvb3NlLmRldGFpbCl7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiN1wiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcclxuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3LCBjb21tYW5kLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBlbmRUaW1lKT0+e1xyXG5cdFx0bGV0IGRhdGEgPSByYXc7XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmICh3b3JkICE9PSAnJyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50YWcoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgZW5kVGltZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgdCk9PntcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIil7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKT0+e1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpPT57XHJcblxyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYiA9IHtcclxuXHRub3c6IFwiY29tbWVudHNcIixcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHR0YWIubm93ID0gJCh0aGlzKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdFx0bGV0IHRhciA9ICQodGhpcykuaW5kZXgoKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLmVxKHRhcikuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRjb21wYXJlLmluaXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKXtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyK1wiLVwiK21vbnRoK1wiLVwiK2RhdGUrXCItXCIraG91citcIi1cIittaW4rXCItXCIrc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKXtcclxuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XHJcbiAgICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuICAgICBpZiAoZGF0ZSA8IDEwKXtcclxuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xyXG4gICAgIH1cclxuICAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuICAgICBpZiAoaG91ciA8IDEwKXtcclxuICAgICBcdGhvdXIgPSBcIjBcIitob3VyO1xyXG4gICAgIH1cclxuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcbiAgICAgaWYgKG1pbiA8IDEwKXtcclxuICAgICBcdG1pbiA9IFwiMFwiK21pbjtcclxuICAgICB9XHJcbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG4gICAgIGlmIChzZWMgPCAxMCl7XHJcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XHJcbiAgICAgfVxyXG4gICAgIHZhciB0aW1lID0geWVhcisnLScrbW9udGgrJy0nK2RhdGUrXCIgXCIraG91cisnOicrbWluKyc6JytzZWMgO1xyXG4gICAgIHJldHVybiB0aW1lO1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xyXG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG4gXHRcdHJldHVybiBbdmFsdWVdO1xyXG4gXHR9KTtcclxuIFx0cmV0dXJuIGFycmF5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuIFx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG4gXHR2YXIgaSwgciwgdDtcclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0YXJ5W2ldID0gaTtcclxuIFx0fVxyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcbiBcdFx0dCA9IGFyeVtyXTtcclxuIFx0XHRhcnlbcl0gPSBhcnlbaV07XHJcbiBcdFx0YXJ5W2ldID0gdDtcclxuIFx0fVxyXG4gXHRyZXR1cm4gYXJ5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuICAgIFxyXG4gICAgdmFyIENTViA9ICcnOyAgICBcclxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG4gICAgXHJcbiAgICAvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG4gICAgaWYgKFNob3dMYWJlbCkge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcclxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXHJcbiAgICBcclxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG4gICAgXHJcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcbiAgICBcclxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxyXG4gICAgbGluay5ocmVmID0gdXJpO1xyXG4gICAgXHJcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG4gICAgbGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG4gICAgXHJcbiAgICAvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgIGxpbmsuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
