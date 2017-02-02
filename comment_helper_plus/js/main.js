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
		if (e.ctrlKey) {
			$("#btn_excel").text("輸出JSON");
		}
	});
	$(window).keyup(function (e) {
		if (!e.ctrlKey) {
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
			if (response.authResponse.grantedScopes.indexOf("read_stream") < 0) {
				swal({
					title: '抓分享需付費，詳情請見粉絲專頁',
					html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
					type: 'warning'
				}).done();
			} else {
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

								i.from.name = names[i.from.id].name;
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
		$("#awardList tbody tr").each(function () {
			var tar = $(this).find('td').eq(1);
			var id = tar.find('a').attr('attr-fbid');
			tar.prepend("<img src=\"http://graph.facebook.com/" + id + "/picture?type=small\"><br>");
		});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJsYXN0RGF0YSIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJkYXRhIiwiZmluaXNoIiwic2Vzc2lvblN0b3JhZ2UiLCJsb2dpbiIsImZiIiwiZ2VuT3B0aW9uIiwiY2xpY2siLCJlIiwiZXh0ZW5zaW9uQXV0aCIsImdldEF1dGgiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwia2V5ZG93biIsImN0cmxLZXkiLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJuZXdlc3QiLCJ3b3JkIiwiYXV0aCIsImV4dGVuc2lvbiIsIm5leHQiLCJ0eXBlIiwiRkIiLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFN0ciIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJpbmRleE9mIiwic3dhbCIsImRvbmUiLCJmYmlkIiwiUHJvbWlzZSIsImFsbCIsImdldE1lIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsIm9wdGlvbnMiLCJpIiwiaiIsImlkIiwibmFtZSIsInNlbGVjdFBhZ2UiLCJ0YXIiLCJhdHRyIiwic3RlcCIsInN0ZXAxIiwiaGlkZGVuU3RhcnQiLCJwYWdlSUQiLCJjbGVhciIsImVtcHR5Iiwib2ZmIiwiZmluZCIsImNvbW1hbmQiLCJhcGkiLCJwYWdpbmciLCJzdHIiLCJnZW5EYXRhIiwibWVzc2FnZSIsInJlY29tbWFuZCIsImdlbkNhcmQiLCJvYmoiLCJpZHMiLCJzcGxpdCIsImxpbmsiLCJtZXNzIiwicmVwbGFjZSIsInRpbWVDb252ZXJ0ZXIiLCJjcmVhdGVkX3RpbWUiLCJzcmMiLCJmdWxsX3BpY3R1cmUiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJyIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJ0aXRsZSIsImh0bWwiLCJleHRlbmQiLCJmaWQiLCJwdXNoIiwiZnJvbSIsInByb21pc2VfYXJyYXkiLCJuYW1lcyIsInByb21pc2UiLCJnZXROYW1lIiwiT2JqZWN0Iiwia2V5cyIsInRvU3RyaW5nIiwic2Nyb2xsVG9wIiwic3RlcDIiLCJmaWx0ZXJlZCIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInRlc3QiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImZ1bGxJRCIsImNvbW1hbmRzIiwidGVtcF9kYXRhIiwiZ2V0IiwiZGF0YXMiLCJkIiwiZ2V0TmV4dCIsImdldEpTT04iLCJmYWlsIiwic2V0SXRlbSIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwia2V5IiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwic3RvcnkiLCJsaWtlX2NvdW50IiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwicGljIiwidGhlYWQiLCJ0Ym9keSIsImVudHJpZXMiLCJwaWN0dXJlIiwidGQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJzZWFyY2giLCJ2YWx1ZSIsImRyYXciLCJhbmQiLCJvciIsImlnbm9yZSIsImJhc2UiLCJmaW5hbCIsImNvbXBhcmVfbnVtIiwic29ydCIsImEiLCJiIiwibWF0Y2giLCJ0ZW1wIiwidGVtcF9uYW1lIiwiZGF0YV9hbmQiLCJkYXRhX29yIiwidGJvZHkyIiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwibiIsInBhcnNlSW50IiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJ0ZW1wQXJyIiwiY29sdW1uIiwiaW5kZXgiLCJyb3ciLCJub2RlIiwiaW5uZXJIVE1MIiwiZXEiLCJwcmVwZW5kIiwiayIsImluc2VydEJlZm9yZSIsInVuaXF1ZSIsInRhZyIsInRpbWUiLCJvdXRwdXQiLCJmb3JFYWNoIiwiaXRlbSIsIm5ld0FyeSIsImdyZXAiLCJtZXNzYWdlX3RhZ3MiLCJ0IiwidGltZV9hcnkiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJ1aSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsIm1hcCIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwic2xpY2UiLCJhbGVydCIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwiY3JlYXRlRWxlbWVudCIsImhyZWYiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBO0FBQ0RTLEVBQUVFLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFVO0FBQzNCLEtBQUlDLFdBQVdDLEtBQUtDLEtBQUwsQ0FBV0MsYUFBYUMsT0FBYixDQUFxQixLQUFyQixDQUFYLENBQWY7QUFDQSxLQUFJSixRQUFKLEVBQWE7QUFDWkssT0FBS0MsTUFBTCxDQUFZTixRQUFaO0FBQ0E7QUFDRCxLQUFJTyxlQUFlQyxLQUFuQixFQUF5QjtBQUN4QkMsS0FBR0MsU0FBSCxDQUFhVCxLQUFLQyxLQUFMLENBQVdLLGVBQWVDLEtBQTFCLENBQWI7QUFDQTs7QUFFRFosR0FBRSwrQkFBRixFQUFtQ2UsS0FBbkMsQ0FBeUMsVUFBU0MsQ0FBVCxFQUFXO0FBQ25ESCxLQUFHSSxhQUFIO0FBQ0EsRUFGRDs7QUFJQWpCLEdBQUUsZUFBRixFQUFtQmUsS0FBbkIsQ0FBeUIsVUFBU0MsQ0FBVCxFQUFXO0FBQ25DSCxLQUFHSyxPQUFILENBQVcsVUFBWDtBQUNBLEVBRkQ7O0FBSUFsQixHQUFFLFlBQUYsRUFBZ0JlLEtBQWhCLENBQXNCLFlBQVU7QUFDL0JGLEtBQUdLLE9BQUgsQ0FBVyxVQUFYO0FBQ0EsRUFGRDtBQUdBbEIsR0FBRSxhQUFGLEVBQWlCZSxLQUFqQixDQUF1QixZQUFVO0FBQ2hDSSxT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QUQsU0FBT2hELE1BQU0sTUFBYjtBQUNIOztBQUVEO0FBQ0EsTUFBSyxJQUFJdEksSUFBSSxDQUFiLEVBQWdCQSxJQUFJcUwsUUFBUWhPLE1BQTVCLEVBQW9DMkMsR0FBcEMsRUFBeUM7QUFDckMsTUFBSXNJLE1BQU0sRUFBVjs7QUFFQTtBQUNBLE9BQUssSUFBSUQsS0FBVCxJQUFrQmdELFFBQVFyTCxDQUFSLENBQWxCLEVBQThCO0FBQzFCc0ksVUFBTyxNQUFNK0MsUUFBUXJMLENBQVIsRUFBV3FJLEtBQVgsQ0FBTixHQUEwQixJQUFqQztBQUNIOztBQUVEQyxNQUFJaUQsS0FBSixDQUFVLENBQVYsRUFBYWpELElBQUlqTCxNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQWlPLFNBQU9oRCxNQUFNLE1BQWI7QUFDSDs7QUFFRCxLQUFJZ0QsT0FBTyxFQUFYLEVBQWU7QUFDWEUsUUFBTSxjQUFOO0FBQ0E7QUFDSDs7QUFFRDtBQUNBLEtBQUlDLFdBQVcsRUFBZjtBQUNBO0FBQ0FBLGFBQVlOLFlBQVl2SixPQUFaLENBQW9CLElBQXBCLEVBQXlCLEdBQXpCLENBQVo7O0FBRUE7QUFDQSxLQUFJOEosTUFBTSx1Q0FBdUNDLFVBQVVMLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJNUosT0FBT3pILFNBQVMyUixhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQWxLLE1BQUttSyxJQUFMLEdBQVlILEdBQVo7O0FBRUE7QUFDQWhLLE1BQUtvSyxLQUFMLEdBQWEsbUJBQWI7QUFDQXBLLE1BQUtxSyxRQUFMLEdBQWdCTixXQUFXLE1BQTNCOztBQUVBO0FBQ0F4UixVQUFTK1IsSUFBVCxDQUFjQyxXQUFkLENBQTBCdkssSUFBMUI7QUFDQUEsTUFBSzVHLEtBQUw7QUFDQWIsVUFBUytSLElBQVQsQ0FBY0UsV0FBZCxDQUEwQnhLLElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcdFxyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHRsZXQgbGFzdERhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmF3XCIpKTtcclxuXHRpZiAobGFzdERhdGEpe1xyXG5cdFx0ZGF0YS5maW5pc2gobGFzdERhdGEpO1xyXG5cdH1cclxuXHRpZiAoc2Vzc2lvblN0b3JhZ2UubG9naW4pe1xyXG5cdFx0ZmIuZ2VuT3B0aW9uKEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pKTtcclxuXHR9XHJcblxyXG5cdCQoXCIudGFibGVzID4gLnNoYXJlZHBvc3RzIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcclxuXHR9KTtcclxuXHRcclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX3N0YXJ0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHRcclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoIWUuY3RybEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi50YWJsZXMgLmZpbHRlcnMgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5jb21wYXJlX2NvbmRpdGlvbicpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuJysgJCh0aGlzKS52YWwoKSkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XHJcblx0XHRcInNpbmdsZURhdGVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS1NTS1ERCAgIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSxmdW5jdGlvbihzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShub3dEYXRlKCkpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGlmIChlLmN0cmxLZXkpe1xyXG5cdFx0XHRsZXQgZGQ7XHJcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGFbdGFiLm5vd10pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBkZDtcclxuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XHJcblx0XHRcdHdpbmRvdy5mb2N1cygpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApe1xyXG5cdFx0XHRcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGFbdGFiLm5vd10pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpe1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZihlLmN0cmxLZXkpe1xyXG5cdFx0XHRmYi5nZXRBdXRoKCdzaGFyZWRwb3N0cycpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UsZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuNycsXHJcblx0XHRyZWFjdGlvbnM6ICd2Mi43JyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjIuMycsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi43JyxcclxuXHRcdGZlZWQ6ICd2Mi4zJyxcclxuXHRcdGdyb3VwOiAndjIuMycsXHJcblx0XHRuZXdlc3Q6ICd2Mi44J1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0YXV0aDogJ3VzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9tYW5hZ2VkX2dyb3VwcyxtYW5hZ2VfcGFnZXMnLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRuZXh0OiAnJyxcclxuXHRnZXRBdXRoOiAodHlwZSk9PntcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIil7XHJcblx0XHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCdtYW5hZ2VfcGFnZXMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9tYW5hZ2VkX2dyb3VwcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XHJcblx0XHRcdFx0XHRmYi5zdGFydCgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+aOiOasiuWkseaVl++8jOiri+e1puS6iOaJgOacieasiumZkCcsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRQcm9taXNlLmFsbChbZmIuZ2V0TWUoKSxmYi5nZXRQYWdlKCksIGZiLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XHJcblx0XHRcdHNlc3Npb25TdG9yYWdlLmxvZ2luID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuXHRcdFx0ZmIuZ2VuT3B0aW9uKHJlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbk9wdGlvbjogKHJlcyk9PntcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCBvcHRpb25zID0gJyc7XHJcblx0XHRsZXQgdHlwZSA9IC0xO1xyXG5cdFx0JCgnI2J0bl9zdGFydCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcclxuXHRcdFx0dHlwZSsrO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgaSl7XHJcblx0XHRcdFx0b3B0aW9ucyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgYXR0ci10eXBlPVwiJHt0eXBlfVwiIGF0dHItdmFsdWU9XCIke2ouaWR9XCIgb25jbGljaz1cImZiLnNlbGVjdFBhZ2UodGhpcylcIj4ke2oubmFtZX08L2Rpdj5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcjZW50ZXJVUkwnKS5hcHBlbmQob3B0aW9ucykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6IChlKT0+e1xyXG5cdFx0JCgnI2VudGVyVVJMIC5wYWdlX2J0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCB0YXIgPSAkKGUpO1xyXG5cdFx0dGFyLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGZiLmZlZWQodGFyLmF0dHIoJ2F0dHItdmFsdWUnKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0KTtcclxuXHRcdHN0ZXAuc3RlcDEoKTtcclxuXHR9LFxyXG5cdGhpZGRlblN0YXJ0OiAoKT0+e1xyXG5cdFx0bGV0IGZiaWQgPSAkKCdoZWFkZXIgLmRldiBpbnB1dCcpLnZhbCgpO1xyXG5cdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHR9LFxyXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpPT57XHJcblx0XHRpZiAoY2xlYXIpe1xyXG5cdFx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcclxuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLm9mZignY2xpY2snKS5jbGljaygoKT0+e1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKCcjZW50ZXJVUkwgc2VsZWN0JykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJyk7XHJcblx0XHRcdFx0ZmIuZmVlZCh0YXIudmFsKCksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCwgZmFsc2UpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGxldCBjb21tYW5kID0gKHR5cGUgPT0gJzInKSA/ICdmZWVkJzoncG9zdHMnO1xyXG5cdFx0bGV0IGFwaTtcclxuXHRcdGlmICh1cmwgPT0gJycpe1xyXG5cdFx0XHRhcGkgPSBgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZUlEfS8ke2NvbW1hbmR9P2ZpZWxkcz1saW5rLGZ1bGxfcGljdHVyZSxjcmVhdGVkX3RpbWUsbWVzc2FnZSZsaW1pdD0yNWA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YXBpID0gdXJsO1xyXG5cdFx0fVxyXG5cdFx0RkIuYXBpKGFwaSwgKHJlcyk9PntcclxuXHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0XHQkKCcuZmVlZHMgLmJ0bicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZmIubmV4dCA9IHJlcy5wYWdpbmcubmV4dDtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRsZXQgc3RyID0gZ2VuRGF0YShpKTtcclxuXHRcdFx0XHQkKCcuc2VjdGlvbiAuZmVlZHMgdGJvZHknKS5hcHBlbmQoc3RyKTtcclxuXHRcdFx0XHRpZiAoaS5tZXNzYWdlICYmIGkubWVzc2FnZS5pbmRleE9mKCfmir0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdGxldCByZWNvbW1hbmQgPSBnZW5DYXJkKGkpO1xyXG5cdFx0XHRcdFx0JCgnLmRvbmF0ZV9hcmVhIC5yZWNvbW1hbmRzJykuYXBwZW5kKHJlY29tbWFuZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRmdW5jdGlvbiBnZW5EYXRhKG9iail7XHJcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xyXG5cdFx0XHRsZXQgbGluayA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJytpZHNbMF0rJy9wb3N0cy8nK2lkc1sxXTtcclxuXHJcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XHJcblx0XHRcdGxldCBzdHIgPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGRpdiBjbGFzcz1cInBpY2tcIiBhdHRyLXZhbD1cIiR7b2JqLmlkfVwiICBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke21lc3N9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcihvYmouY3JlYXRlZF90aW1lKX08L3RkPlxyXG5cdFx0XHRcdFx0XHQ8L3RyPmA7XHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBnZW5DYXJkKG9iail7XHJcblx0XHRcdGxldCBzcmMgPSBvYmouZnVsbF9waWN0dXJlIHx8ICdodHRwOi8vcGxhY2Vob2xkLml0LzMwMHgyMjUnO1xyXG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcclxuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRsZXRcdHN0ciA9IGA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxyXG5cdFx0XHQ8YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZVwiPlxyXG5cdFx0XHQ8ZmlndXJlIGNsYXNzPVwiaW1hZ2UgaXMtNGJ5M1wiPlxyXG5cdFx0XHQ8aW1nIHNyYz1cIiR7c3JjfVwiIGFsdD1cIlwiPlxyXG5cdFx0XHQ8L2ZpZ3VyZT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvYT5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtY29udGVudFwiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG5cdFx0XHQke21lc3N9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cInBpY2tcIiBhdHRyLXZhbD1cIiR7b2JqLmlkfVwiIG9uY2xpY2s9XCJkYXRhLnN0YXJ0KCcke29iai5pZH0nKVwiPumWi+WnizwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5gO1xyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TWU6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWVgLCAocmVzKT0+e1xyXG5cdFx0XHRcdGxldCBhcnIgPSBbcmVzXTtcclxuXHRcdFx0XHRyZXNvbHZlKGFycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRQYWdlOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2FjY291bnRzYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwc2AsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmRleE9mKFwicmVhZF9zdHJlYW1cIikgPCAwKXtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZGF0YS5yYXcuZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0XHRsZXQgZXh0ZW5kID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNoYXJlZHBvc3RzXCIpKTtcclxuXHRcdFx0XHRsZXQgZmlkID0gW107XHJcblx0XHRcdFx0bGV0IGlkcyA9IFtdO1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0ZmlkLnB1c2goaS5mcm9tLmlkKTtcclxuXHRcdFx0XHRcdGlmIChmaWQubGVuZ3RoID49NDUpe1xyXG5cdFx0XHRcdFx0XHRpZHMucHVzaChmaWQpO1xyXG5cdFx0XHRcdFx0XHRmaWQgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWRzLnB1c2goZmlkKTtcclxuXHRcdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdLCBuYW1lcyA9IHt9O1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBpZHMpe1xyXG5cdFx0XHRcdFx0bGV0IHByb21pc2UgPSBmYi5nZXROYW1lKGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIE9iamVjdC5rZXlzKHJlcykpe1xyXG5cdFx0XHRcdFx0XHRcdG5hbWVzW2ldID0gcmVzW2ldO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFByb21pc2UuYWxsKHByb21pc2VfYXJyYXkpLnRoZW4oKCk9PntcclxuXHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRpLmZyb20ubmFtZSA9IG5hbWVzW2kuZnJvbS5pZF0ubmFtZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGRhdGEucmF3LmRhdGEuc2hhcmVkcG9zdHMgPSBleHRlbmQ7XHJcblx0XHRcdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcyk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcbmxldCBzdGVwID0ge1xyXG5cdHN0ZXAxOiAoKT0+e1xyXG5cdFx0JCgnLnNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc3RlcDInKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcclxuXHR9LFxyXG5cdHN0ZXAyOiAoKT0+e1xyXG5cdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHQkKCcuc2VjdGlvbicpLmFkZENsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiB7fSxcclxuXHRmaWx0ZXJlZDoge30sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwcm9taXNlX2FycmF5OiBbXSxcclxuXHR0ZXN0OiAoaWQpPT57XHJcblx0XHRjb25zb2xlLmxvZyhpZCk7XHJcblx0fSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGRhdGEucHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCk9PntcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0ZnVsbElEOiBmYmlkXHJcblx0XHR9XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0bGV0IGNvbW1hbmRzID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRsZXQgdGVtcF9kYXRhID0gb2JqO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGNvbW1hbmRzKXtcclxuXHRcdFx0dGVtcF9kYXRhLmRhdGEgPSB7fTtcclxuXHRcdFx0bGV0IHByb21pc2UgPSBkYXRhLmdldCh0ZW1wX2RhdGEsIGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHR0ZW1wX2RhdGEuZGF0YVtpXSA9IHJlcztcclxuXHRcdFx0fSk7XHJcblx0XHRcdGRhdGEucHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdFByb21pc2UuYWxsKGRhdGEucHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRkYXRhLmZpbmlzaCh0ZW1wX2RhdGEpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkLCBjb21tYW5kKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2NvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2NvbW1hbmRdfSZvcmRlcj1jaHJvbm9sb2dpY2FsJmZpZWxkcz0ke2NvbmZpZy5maWVsZFtjb21tYW5kXS50b1N0cmluZygpfWAsKHJlcyk9PntcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdHN0ZXAuc3RlcDIoKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0JCgnLnJlc3VsdF9hcmVhID4gLnRpdGxlIHNwYW4nKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmF3XCIsIEpTT04uc3RyaW5naWZ5KGZiaWQpKTtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XHJcblx0XHRkYXRhLmZpbHRlcmVkID0ge307XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocmF3RGF0YS5kYXRhKSl7XHJcblx0XHRcdGlmIChrZXkgPT09ICdyZWFjdGlvbnMnKSBpc1RhZyA9IGZhbHNlO1xyXG5cdFx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLmRhdGFba2V5XSwga2V5LCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHRcclxuXHRcdFx0ZGF0YS5maWx0ZXJlZFtrZXldID0gbmV3RGF0YTtcclxuXHRcdH1cclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSl7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmlsdGVyZWQpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBkYXRhLmZpbHRlcmVkO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpPT57XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pe1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuW/g+aDhVwiIDogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpPT57XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmVkID0gcmF3ZGF0YTtcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhmaWx0ZXJlZCkpe1xyXG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZD7lv4Pmg4U8L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0XHQkKFwiLnRhYmxlcyAuXCIra2V5K1wiIHRhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHRcdHRhYi5pbml0KCk7XHJcblx0XHRjb21wYXJlLmluaXQoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjb21wYXJlID0ge1xyXG5cdGFuZDogW10sXHJcblx0b3I6IFtdLFxyXG5cdHJhdzogW10sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdGNvbXBhcmUuYW5kID0gW107XHJcblx0XHRjb21wYXJlLm9yID0gW107XHJcblx0XHRjb21wYXJlLnJhdyA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGxldCBpZ25vcmUgPSAkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS52YWwoKTtcclxuXHRcdGxldCBiYXNlID0gW107XHJcblx0XHRsZXQgZmluYWwgPSBbXTtcclxuXHRcdGxldCBjb21wYXJlX251bSA9IDE7XHJcblx0XHRpZiAoaWdub3JlID09PSAnaWdub3JlJykgY29tcGFyZV9udW0gPSAyO1xyXG5cclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGNvbXBhcmUucmF3KSl7XHJcblx0XHRcdGlmIChrZXkgIT09IGlnbm9yZSl7XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGNvbXBhcmUucmF3W2tleV0pe1xyXG5cdFx0XHRcdFx0YmFzZS5wdXNoKGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IHNvcnQgPSAoZGF0YS5yYXcuZXh0ZW5zaW9uKSA/ICduYW1lJzonaWQnO1xyXG5cdFx0YmFzZSA9IGJhc2Uuc29ydCgoYSxiKT0+e1xyXG5cdFx0XHRyZXR1cm4gYS5mcm9tW3NvcnRdID4gYi5mcm9tW3NvcnRdID8gMTotMTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGZvcihsZXQgaSBvZiBiYXNlKXtcclxuXHRcdFx0aS5tYXRjaCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdGxldCB0ZW1wX25hbWUgPSAnJztcclxuXHRcdGZvcihsZXQgaSBpbiBiYXNlKXtcclxuXHRcdFx0bGV0IG9iaiA9IGJhc2VbaV07XHJcblx0XHRcdGlmIChvYmouZnJvbS5pZCA9PSB0ZW1wIHx8IChkYXRhLnJhdy5leHRlbnNpb24gJiYgKG9iai5mcm9tLm5hbWUgPT0gdGVtcF9uYW1lKSkpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSBmaW5hbFtmaW5hbC5sZW5ndGgtMV07XHJcblx0XHRcdFx0dGFyLm1hdGNoKys7XHJcblx0XHRcdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSl7XHJcblx0XHRcdFx0XHRpZiAoIXRhcltrZXldKSB0YXJba2V5XSA9IG9ialtrZXldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmluYWwucHVzaChvYmopO1xyXG5cdFx0XHRcdHRlbXAgPSBvYmouZnJvbS5pZDtcclxuXHRcdFx0XHR0ZW1wX25hbWUgPSBvYmouZnJvbS5uYW1lO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0XHJcblx0XHRjb21wYXJlLm9yID0gZmluYWw7XHJcblx0XHRjb21wYXJlLmFuZCA9IGNvbXBhcmUub3IuZmlsdGVyKCh2YWwpPT57XHJcblx0XHRcdHJldHVybiB2YWwubWF0Y2ggPT0gY29tcGFyZV9udW07XHJcblx0XHR9KTtcclxuXHRcdGNvbXBhcmUuZ2VuZXJhdGUoKTtcclxuXHR9LFxyXG5cdGdlbmVyYXRlOiAoKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBkYXRhX2FuZCA9IGNvbXBhcmUuYW5kO1xyXG5cclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX2FuZC5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnMCd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLmFuZCB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cclxuXHRcdGxldCBkYXRhX29yID0gY29tcGFyZS5vcjtcclxuXHRcdGxldCB0Ym9keTIgPSAnJztcclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9vci5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkyICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLm9yIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keTIpO1xyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IGFyciA9IFsnYW5kJywnb3InXTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApe1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oKTtcclxuXHR9LFxyXG5cdGdvOiAoKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSB0YWIubm93O1xyXG5cdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGFbY29tbWFuZF0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcdFxyXG5cdFx0fVxyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0bGV0IHRlbXBBcnIgPSBbXTtcclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKXtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5jb2x1bW4oMikuZGF0YSgpLmVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KXtcclxuXHRcdFx0XHRsZXQgd29yZCA9ICQoJy5zZWFyY2hDb21tZW50JykudmFsKCk7XHJcblx0XHRcdFx0aWYgKHZhbHVlLmluZGV4T2Yod29yZCkgPj0gMCkgdGVtcEFyci5wdXNoKGluZGV4KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcclxuXHRcdFx0bGV0IHJvdyA9ICh0ZW1wQXJyLmxlbmd0aCA9PSAwKSA/IGk6dGVtcEFycltpXTtcclxuXHRcdFx0bGV0IHRhciA9ICQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkucm93KHJvdykubm9kZSgpLmlubmVySFRNTDtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHI+JyArIHRhciArICc8L3RyPic7XHJcblx0XHR9XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRsZXQgdGFyID0gJCh0aGlzKS5maW5kKCd0ZCcpLmVxKDEpO1xyXG5cdFx0XHRsZXQgaWQgPSB0YXIuZmluZCgnYScpLmF0dHIoJ2F0dHItZmJpZCcpO1xyXG5cdFx0XHR0YXIucHJlcGVuZChgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gKTtcclxuXHRcdH0pO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYoY2hvb3NlLmRldGFpbCl7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiN1wiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcclxuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3LCBjb21tYW5kLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBlbmRUaW1lKT0+e1xyXG5cdFx0bGV0IGRhdGEgPSByYXc7XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmICh3b3JkICE9PSAnJyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50YWcoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgZW5kVGltZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgdCk9PntcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIil7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKT0+e1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpPT57XHJcblxyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYiA9IHtcclxuXHRub3c6IFwiY29tbWVudHNcIixcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHR0YWIubm93ID0gJCh0aGlzKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdFx0bGV0IHRhciA9ICQodGhpcykuaW5kZXgoKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLmVxKHRhcikuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRjb21wYXJlLmluaXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKXtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyK1wiLVwiK21vbnRoK1wiLVwiK2RhdGUrXCItXCIraG91citcIi1cIittaW4rXCItXCIrc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKXtcclxuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XHJcbiAgICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuICAgICBpZiAoZGF0ZSA8IDEwKXtcclxuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xyXG4gICAgIH1cclxuICAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuICAgICBpZiAoaG91ciA8IDEwKXtcclxuICAgICBcdGhvdXIgPSBcIjBcIitob3VyO1xyXG4gICAgIH1cclxuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcbiAgICAgaWYgKG1pbiA8IDEwKXtcclxuICAgICBcdG1pbiA9IFwiMFwiK21pbjtcclxuICAgICB9XHJcbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG4gICAgIGlmIChzZWMgPCAxMCl7XHJcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XHJcbiAgICAgfVxyXG4gICAgIHZhciB0aW1lID0geWVhcisnLScrbW9udGgrJy0nK2RhdGUrXCIgXCIraG91cisnOicrbWluKyc6JytzZWMgO1xyXG4gICAgIHJldHVybiB0aW1lO1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xyXG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG4gXHRcdHJldHVybiBbdmFsdWVdO1xyXG4gXHR9KTtcclxuIFx0cmV0dXJuIGFycmF5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuIFx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG4gXHR2YXIgaSwgciwgdDtcclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0YXJ5W2ldID0gaTtcclxuIFx0fVxyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcbiBcdFx0dCA9IGFyeVtyXTtcclxuIFx0XHRhcnlbcl0gPSBhcnlbaV07XHJcbiBcdFx0YXJ5W2ldID0gdDtcclxuIFx0fVxyXG4gXHRyZXR1cm4gYXJ5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuICAgIFxyXG4gICAgdmFyIENTViA9ICcnOyAgICBcclxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG4gICAgXHJcbiAgICAvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG4gICAgaWYgKFNob3dMYWJlbCkge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcclxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXHJcbiAgICBcclxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG4gICAgXHJcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcbiAgICBcclxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxyXG4gICAgbGluay5ocmVmID0gdXJpO1xyXG4gICAgXHJcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG4gICAgbGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG4gICAgXHJcbiAgICAvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgIGxpbmsuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
