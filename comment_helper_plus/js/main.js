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
		if (e.ctrlKey || e.altKey) {
			fb.extensionAuth('import');
		} else {
			fb.extensionAuth();
		}
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

		$('#enterURL').html(options).removeClass('hide');
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
			FB.api(config.apiVersion.newest + "/me/accounts?limit=100", function (res) {
				resolve(res.data);
			});
		});
	},
	getGroup: function getGroup() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/me/groups?limit=100", function (res) {
				resolve(res.data);
			});
		});
	},
	extensionAuth: function extensionAuth() {
		var command = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		FB.login(function (response) {
			fb.extensionCallback(response, command);
		}, { scope: config.auth, return_scopes: true });
	},
	extensionCallback: function extensionCallback(response) {
		var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

		if (response.status === 'connected') {
			var authStr = response.authResponse.grantedScopes;
			if (authStr.indexOf('manage_pages') >= 0 && authStr.indexOf('user_managed_groups') >= 0 && authStr.indexOf('user_posts') >= 0) {
				(function () {
					data.raw.extension = true;
					if (command == 'import') {
						localStorage.setItem("sharedposts", $('#import').val());
					}
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
			var shareError = 0;
			if (fbid.type === 'group') command = 'group';
			if (command === 'sharedposts') {
				getShare();
			} else {
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
			}

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

			function getShare() {
				var after = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

				var url = "https://am66ahgtp8.execute-api.ap-northeast-1.amazonaws.com/share?fbid=" + fbid.fullID + "&after=" + after;
				$.getJSON(url, function (res) {
					if (res === 'end') {
						resolve(datas);
					} else {
						if (res.errorMessage) {
							resolve(datas);
						} else if (res.data) {
							// shareError = 0;
							var _iteratorNormalCompletion11 = true;
							var _didIteratorError11 = false;
							var _iteratorError11 = undefined;

							try {
								for (var _iterator11 = res.data[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
									var _i3 = _step11.value;

									var name = '';
									if (_i3.story) {
										name = _i3.story.substring(0, _i3.story.indexOf(' shared'));
									} else {
										name = _i3.id.substring(0, _i3.id.indexOf("_"));
									}
									var id = _i3.id.substring(0, _i3.id.indexOf("_"));
									_i3.from = { id: id, name: name };
									datas.push(_i3);
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

							getShare(res.after);
						} else {
							resolve(datas);
						}
					}
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
		var _iteratorNormalCompletion12 = true;
		var _didIteratorError12 = false;
		var _iteratorError12 = undefined;

		try {
			for (var _iterator12 = Object.keys(rawData.data)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
				var key = _step12.value;

				if (key === 'reactions') isTag = false;
				var newData = _filter.totalFilter.apply(_filter, [rawData.data[key], key, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
				data.filtered[key] = newData;
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
		var _iteratorNormalCompletion13 = true;
		var _didIteratorError13 = false;
		var _iteratorError13 = undefined;

		try {
			for (var _iterator13 = Object.keys(filtered)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
				var key = _step13.value;

				var thead = '';
				var tbody = '';
				if (key === 'reactions') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td>\u5FC3\u60C5</td>";
				} else if (key === 'sharedposts') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
				} else {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td>\u8B9A</td>\n\t\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
				}
				var _iteratorNormalCompletion15 = true;
				var _didIteratorError15 = false;
				var _iteratorError15 = undefined;

				try {
					for (var _iterator15 = filtered[key].entries()[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
						var _step15$value = _slicedToArray(_step15.value, 2),
						    j = _step15$value[0],
						    val = _step15$value[1];

						var picture = '';
						if (pic) {
							// picture = `<img src="http://graph.facebook.com/${val.from.id}/picture?type=small"><br>`;
						}
						var td = "<td>" + (j + 1) + "</td>\n\t\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + picture + val.from.name + "</a></td>";
						if (key === 'reactions') {
							td += "<td class=\"center\"><span class=\"react " + val.type + "\"></span>" + val.type + "</td>";
						} else if (key === 'sharedposts') {
							td += "<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || val.story) + "</a></td>\n\t\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
						} else {
							td += "<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + val.message + "</a></td>\n\t\t\t\t\t<td>" + val.like_count + "</td>\n\t\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
						}
						var tr = "<tr>" + td + "</tr>";
						tbody += tr;
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

				var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
				$(".tables ." + key + " table").html('').append(insert);
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
			var _iteratorNormalCompletion14 = true;
			var _didIteratorError14 = false;
			var _iteratorError14 = undefined;

			try {
				var _loop2 = function _loop2() {
					var i = _step14.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator14 = arr[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
					_loop2();
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

		var _iteratorNormalCompletion16 = true;
		var _didIteratorError16 = false;
		var _iteratorError16 = undefined;

		try {
			for (var _iterator16 = Object.keys(compare.raw)[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
				var _key = _step16.value;

				if (_key !== ignore) {
					var _iteratorNormalCompletion19 = true;
					var _didIteratorError19 = false;
					var _iteratorError19 = undefined;

					try {
						for (var _iterator19 = compare.raw[_key][Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
							var _i5 = _step19.value;

							base.push(_i5);
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
				}
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

		var sort = data.raw.extension ? 'name' : 'id';
		base = base.sort(function (a, b) {
			return a.from[sort] > b.from[sort] ? 1 : -1;
		});

		var _iteratorNormalCompletion17 = true;
		var _didIteratorError17 = false;
		var _iteratorError17 = undefined;

		try {
			for (var _iterator17 = base[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
				var _i6 = _step17.value;

				_i6.match = 0;
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

		var temp = '';
		var temp_name = '';
		// console.log(base);
		for (var _i4 in base) {
			var obj = base[_i4];
			if (obj.from.id == temp || data.raw.extension && obj.from.name == temp_name) {
				var tar = final[final.length - 1];
				tar.match++;
				var _iteratorNormalCompletion18 = true;
				var _didIteratorError18 = false;
				var _iteratorError18 = undefined;

				try {
					for (var _iterator18 = Object.keys(obj)[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
						var key = _step18.value;

						if (!tar[key]) tar[key] = obj[key]; //合併資料
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

				if (tar.match == compare_num) {
					temp_name = '';
					temp = '';
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
		var _iteratorNormalCompletion20 = true;
		var _didIteratorError20 = false;
		var _iteratorError20 = undefined;

		try {
			for (var _iterator20 = data_and.entries()[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
				var _step20$value = _slicedToArray(_step20.value, 2),
				    j = _step20$value[0],
				    val = _step20$value[1];

				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '0') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
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

		$(".tables .total .table_compare.and tbody").html('').append(tbody);

		var data_or = compare.or;
		var tbody2 = '';
		var _iteratorNormalCompletion21 = true;
		var _didIteratorError21 = false;
		var _iteratorError21 = undefined;

		try {
			for (var _iterator21 = data_or.entries()[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
				var _step21$value = _slicedToArray(_step21.value, 2),
				    j = _step21$value[0],
				    val = _step21$value[1];

				var _td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var _tr = "<tr>" + _td + "</tr>";
				tbody2 += _tr;
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

		$(".tables .total .table_compare.or tbody").html('').append(tbody2);

		active();

		function active() {
			var table = $(".tables .total table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			var arr = ['and', 'or'];
			var _iteratorNormalCompletion22 = true;
			var _didIteratorError22 = false;
			var _iteratorError22 = undefined;

			try {
				var _loop3 = function _loop3() {
					var i = _step22.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator22 = arr[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
					_loop3();
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
		var _iteratorNormalCompletion23 = true;
		var _didIteratorError23 = false;
		var _iteratorError23 = undefined;

		try {
			for (var _iterator23 = choose.award[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
				var _i7 = _step23.value;

				var row = tempArr.length == 0 ? _i7 : tempArr[_i7];
				var _tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
				insert += '<tr>' + _tar + '</tr>';
			}
		} catch (err) {
			_didIteratorError23 = true;
			_iteratorError23 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion23 && _iterator23.return) {
					_iterator23.return();
				}
			} finally {
				if (_didIteratorError23) {
					throw _iteratorError23;
				}
			}
		}

		$('#awardList table tbody').html(insert);
		if (!ctrl) {
			$("#awardList tbody tr").each(function () {
				// let tar = $(this).find('td').eq(1);
				// let id = tar.find('a').attr('attr-fbid');
				// tar.prepend(`<img src="http://graph.facebook.com/${id}/picture?type=small"><br>`);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJsYXN0RGF0YSIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJkYXRhIiwiZmluaXNoIiwic2Vzc2lvblN0b3JhZ2UiLCJsb2dpbiIsImZiIiwiZ2VuT3B0aW9uIiwiY2xpY2siLCJlIiwiY3RybEtleSIsImFsdEtleSIsImV4dGVuc2lvbkF1dGgiLCJnZXRBdXRoIiwiY2hvb3NlIiwiaW5pdCIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJuZXdlc3QiLCJ3b3JkIiwiYXV0aCIsImV4dGVuc2lvbiIsIm5leHQiLCJ0eXBlIiwiRkIiLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFN0ciIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJpbmRleE9mIiwic3dhbCIsImRvbmUiLCJmYmlkIiwiUHJvbWlzZSIsImFsbCIsImdldE1lIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsIm9wdGlvbnMiLCJpIiwiaiIsImlkIiwibmFtZSIsImh0bWwiLCJzZWxlY3RQYWdlIiwidGFyIiwiYXR0ciIsInN0ZXAiLCJzdGVwMSIsImhpZGRlblN0YXJ0IiwicGFnZUlEIiwiY2xlYXIiLCJlbXB0eSIsIm9mZiIsImZpbmQiLCJjb21tYW5kIiwiYXBpIiwicGFnaW5nIiwic3RyIiwiZ2VuRGF0YSIsIm1lc3NhZ2UiLCJyZWNvbW1hbmQiLCJnZW5DYXJkIiwib2JqIiwiaWRzIiwic3BsaXQiLCJsaW5rIiwibWVzcyIsInJlcGxhY2UiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwic3JjIiwiZnVsbF9waWN0dXJlIiwicmVzb2x2ZSIsInJlamVjdCIsImFyciIsImV4dGVuc2lvbkNhbGxiYWNrIiwic2V0SXRlbSIsImV4dGVuZCIsImZpZCIsInB1c2giLCJmcm9tIiwicHJvbWlzZV9hcnJheSIsIm5hbWVzIiwicHJvbWlzZSIsImdldE5hbWUiLCJPYmplY3QiLCJrZXlzIiwidGl0bGUiLCJ0b1N0cmluZyIsInNjcm9sbFRvcCIsInN0ZXAyIiwiZmlsdGVyZWQiLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJ0ZXN0IiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJjb21tYW5kcyIsInRlbXBfZGF0YSIsImdldCIsImRhdGFzIiwic2hhcmVFcnJvciIsImdldFNoYXJlIiwiZCIsImdldE5leHQiLCJnZXRKU09OIiwiZmFpbCIsImFmdGVyIiwic3RvcnkiLCJzdWJzdHJpbmciLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsImtleSIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsIm5ld09iaiIsImVhY2giLCJ0bXAiLCJwb3N0bGluayIsImxpa2VfY291bnQiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50IiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJwaWMiLCJ0aGVhZCIsInRib2R5IiwiZW50cmllcyIsInBpY3R1cmUiLCJ0ZCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInNlYXJjaCIsInZhbHVlIiwiZHJhdyIsImFuZCIsIm9yIiwiaWdub3JlIiwiYmFzZSIsImZpbmFsIiwiY29tcGFyZV9udW0iLCJzb3J0IiwiYSIsImIiLCJtYXRjaCIsInRlbXAiLCJ0ZW1wX25hbWUiLCJkYXRhX2FuZCIsImRhdGFfb3IiLCJ0Ym9keTIiLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJjdHJsIiwibiIsInBhcnNlSW50IiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJ0ZW1wQXJyIiwiY29sdW1uIiwiaW5kZXgiLCJyb3ciLCJub2RlIiwiaW5uZXJIVE1MIiwiayIsImVxIiwiaW5zZXJ0QmVmb3JlIiwidW5pcXVlIiwidGFnIiwidGltZSIsIm91dHB1dCIsImZvckVhY2giLCJpdGVtIiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsIm1vbWVudCIsIkRhdGUiLCJfZCIsInVpIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwibWFwIiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJzbGljZSIsImFsZXJ0IiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBZUMsU0FBZjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNOLFlBQUwsRUFBa0I7QUFDakJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUMsSUFBRSxpQkFBRixFQUFxQkMsTUFBckI7QUFDQVYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRFMsRUFBRUUsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0IsS0FBSUMsV0FBV0MsS0FBS0MsS0FBTCxDQUFXQyxhQUFhQyxPQUFiLENBQXFCLEtBQXJCLENBQVgsQ0FBZjtBQUNBLEtBQUlKLFFBQUosRUFBYTtBQUNaSyxPQUFLQyxNQUFMLENBQVlOLFFBQVo7QUFDQTtBQUNELEtBQUlPLGVBQWVDLEtBQW5CLEVBQXlCO0FBQ3hCQyxLQUFHQyxTQUFILENBQWFULEtBQUtDLEtBQUwsQ0FBV0ssZUFBZUMsS0FBMUIsQ0FBYjtBQUNBOztBQUVEWixHQUFFLCtCQUFGLEVBQW1DZSxLQUFuQyxDQUF5QyxVQUFTQyxDQUFULEVBQVc7QUFDbkQsTUFBSUEsRUFBRUMsT0FBRixJQUFhRCxFQUFFRSxNQUFuQixFQUEwQjtBQUN6QkwsTUFBR00sYUFBSCxDQUFpQixRQUFqQjtBQUNBLEdBRkQsTUFFSztBQUNKTixNQUFHTSxhQUFIO0FBQ0E7QUFDRCxFQU5EOztBQVFBbkIsR0FBRSxlQUFGLEVBQW1CZSxLQUFuQixDQUF5QixVQUFTQyxDQUFULEVBQVc7QUFDbkNILEtBQUdPLE9BQUgsQ0FB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Q0g7O0FBRUQ7QUFDQSxNQUFLLElBQUkzSSxJQUFJLENBQWIsRUFBZ0JBLElBQUl5TCxRQUFRcE8sTUFBNUIsRUFBb0MyQyxHQUFwQyxFQUF5QztBQUNyQyxNQUFJMkksTUFBTSxFQUFWOztBQUVBO0FBQ0EsT0FBSyxJQUFJRCxLQUFULElBQWtCK0MsUUFBUXpMLENBQVIsQ0FBbEIsRUFBOEI7QUFDMUIySSxVQUFPLE1BQU04QyxRQUFRekwsQ0FBUixFQUFXMEksS0FBWCxDQUFOLEdBQTBCLElBQWpDO0FBQ0g7O0FBRURDLE1BQUlnRCxLQUFKLENBQVUsQ0FBVixFQUFhaEQsSUFBSXRMLE1BQUosR0FBYSxDQUExQjs7QUFFQTtBQUNBcU8sU0FBTy9DLE1BQU0sTUFBYjtBQUNIOztBQUVELEtBQUkrQyxPQUFPLEVBQVgsRUFBZTtBQUNYRSxRQUFNLGNBQU47QUFDQTtBQUNIOztBQUVEO0FBQ0EsS0FBSUMsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWU4sWUFBWTFKLE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUlpSyxNQUFNLHVDQUF1Q0MsVUFBVUwsR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUkvSixPQUFPM0gsU0FBU2dTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBckssTUFBS3NLLElBQUwsR0FBWUgsR0FBWjs7QUFFQTtBQUNBbkssTUFBS3VLLEtBQUwsR0FBYSxtQkFBYjtBQUNBdkssTUFBS3dLLFFBQUwsR0FBZ0JOLFdBQVcsTUFBM0I7O0FBRUE7QUFDQTdSLFVBQVNvUyxJQUFULENBQWNDLFdBQWQsQ0FBMEIxSyxJQUExQjtBQUNBQSxNQUFLOUcsS0FBTDtBQUNBYixVQUFTb1MsSUFBVCxDQUFjRSxXQUFkLENBQTBCM0ssSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXG5cbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXG57XG5cdGlmICghZXJyb3JNZXNzYWdlKXtcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHRcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRsZXQgbGFzdERhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmF3XCIpKTtcblx0aWYgKGxhc3REYXRhKXtcblx0XHRkYXRhLmZpbmlzaChsYXN0RGF0YSk7XG5cdH1cblx0aWYgKHNlc3Npb25TdG9yYWdlLmxvZ2luKXtcblx0XHRmYi5nZW5PcHRpb24oSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbikpO1xuXHR9XG5cblx0JChcIi50YWJsZXMgPiAuc2hhcmVkcG9zdHMgYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgnaW1wb3J0Jyk7XG5cdFx0fWVsc2V7XG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XG5cdFx0fVxuXHR9KTtcblx0XG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XG5cdH0pO1xuXG5cdCQoXCIjYnRuX3N0YXJ0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcblx0fSk7XG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcblx0XHRcdGNob29zZS5pbml0KHRydWUpO1xuXHRcdH1lbHNle1xuXHRcdFx0Y2hvb3NlLmluaXQoKTtcblx0XHR9XG5cdH0pO1xuXHRcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xuXHRcdH1lbHNle1xuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0fWVsc2V7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdH1cblx0fSk7XG5cblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcblx0fSk7XG5cblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24oZSl7XG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcblx0XHR9XG5cdH0pO1xuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24oZSl7XG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgIWUuYWx0S2V5KXtcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XG5cdFx0dGFibGUucmVkbygpO1xuXHR9KTtcblxuXHQkKFwiLnRhYmxlcyAuZmlsdGVycyAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XG5cdFx0dGFibGUucmVkbygpO1xuXHR9KTtcblxuXHQkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcblx0XHRjb21wYXJlLmluaXQoKTtcblx0fSk7XG5cblx0JCgnLmNvbXBhcmVfY29uZGl0aW9uJykuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUnKS5hZGRDbGFzcygnaGlkZScpO1xuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLicrICQodGhpcykudmFsKCkpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdH0pO1xuXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xuXHRcdFwic2luZ2xlRGF0ZVBpY2tlclwiOiB0cnVlLFxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxuXHRcdFwibG9jYWxlXCI6IHtcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS1NTS1ERCAgIEhIOm1tXCIsXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xuXHRcdFx0XCLml6VcIixcblx0XHRcdFwi5LiAXCIsXG5cdFx0XHRcIuS6jFwiLFxuXHRcdFx0XCLkuIlcIixcblx0XHRcdFwi5ZubXCIsXG5cdFx0XHRcIuS6lFwiLFxuXHRcdFx0XCLlha1cIlxuXHRcdFx0XSxcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXG5cdFx0XHRcIuS4gOaciFwiLFxuXHRcdFx0XCLkuozmnIhcIixcblx0XHRcdFwi5LiJ5pyIXCIsXG5cdFx0XHRcIuWbm+aciFwiLFxuXHRcdFx0XCLkupTmnIhcIixcblx0XHRcdFwi5YWt5pyIXCIsXG5cdFx0XHRcIuS4g+aciFwiLFxuXHRcdFx0XCLlhavmnIhcIixcblx0XHRcdFwi5Lmd5pyIXCIsXG5cdFx0XHRcIuWNgeaciFwiLFxuXHRcdFx0XCLljYHkuIDmnIhcIixcblx0XHRcdFwi5Y2B5LqM5pyIXCJcblx0XHRcdF0sXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcblx0XHR9LFxuXHR9LGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XG5cdFx0dGFibGUucmVkbygpO1xuXHR9KTtcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShub3dEYXRlKCkpO1xuXG5cblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XG5cdFx0aWYgKGUuY3RybEtleSl7XG5cdFx0XHRsZXQgZGQ7XG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhW3RhYi5ub3ddKTtcblx0XHRcdH1cblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBkZDtcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xuXHRcdFx0d2luZG93LmZvY3VzKCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKXtcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhW3RhYi5ub3ddKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcblx0fSk7XG5cblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGNpX2NvdW50ZXIrKztcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KXtcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0fVxuXHRcdGlmKGUuY3RybEtleSl7XG5cdFx0XHRmYi5nZXRBdXRoKCdzaGFyZWRwb3N0cycpO1xuXHRcdH1cblx0fSk7XG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XG5cdH0pO1xufSk7XG5cbmxldCBjb25maWcgPSB7XG5cdGZpZWxkOiB7XG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UsZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxuXHRcdHJlYWN0aW9uczogW10sXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxuXHRcdHVybF9jb21tZW50czogW10sXG5cdFx0ZmVlZDogW11cblx0fSxcblx0bGltaXQ6IHtcblx0XHRjb21tZW50czogJzUwMCcsXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcblx0XHRmZWVkOiAnNTAwJ1xuXHR9LFxuXHRhcGlWZXJzaW9uOiB7XG5cdFx0Y29tbWVudHM6ICd2Mi43Jyxcblx0XHRyZWFjdGlvbnM6ICd2Mi43Jyxcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxuXHRcdGZlZWQ6ICd2Mi4zJyxcblx0XHRncm91cDogJ3YyLjMnLFxuXHRcdG5ld2VzdDogJ3YyLjgnXG5cdH0sXG5cdGZpbHRlcjoge1xuXHRcdHdvcmQ6ICcnLFxuXHRcdHJlYWN0OiAnYWxsJyxcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcblx0fSxcblx0YXV0aDogJ3VzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9tYW5hZ2VkX2dyb3VwcyxtYW5hZ2VfcGFnZXMnLFxuXHRleHRlbnNpb246IGZhbHNlLFxufVxuXG5sZXQgZmIgPSB7XG5cdG5leHQ6ICcnLFxuXHRnZXRBdXRoOiAodHlwZSk9Pntcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0fSxcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9Pntcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcblx0XHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcztcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xuXHRcdFx0XHRcdGZiLnN0YXJ0KCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHN3YWwoXG5cdFx0XHRcdFx0XHQn5o6I5qyK5aSx5pWX77yM6KuL57Wm5LqI5omA5pyJ5qyK6ZmQJyxcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXG5cdFx0XHRcdFx0XHQnZXJyb3InXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcdFx0XHRcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0XHR9XG5cdH0sXG5cdHN0YXJ0OiAoKT0+e1xuXHRcdFByb21pc2UuYWxsKFtmYi5nZXRNZSgpLGZiLmdldFBhZ2UoKSwgZmIuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9Pntcblx0XHRcdHNlc3Npb25TdG9yYWdlLmxvZ2luID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcblx0XHRcdGZiLmdlbk9wdGlvbihyZXMpO1xuXHRcdH0pO1xuXHR9LFxuXHRnZW5PcHRpb246IChyZXMpPT57XG5cdFx0ZmIubmV4dCA9ICcnO1xuXHRcdGxldCBvcHRpb25zID0gJyc7XG5cdFx0bGV0IHR5cGUgPSAtMTtcblx0XHQkKCcjYnRuX3N0YXJ0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcblx0XHRcdHR5cGUrKztcblx0XHRcdGZvcihsZXQgaiBvZiBpKXtcblx0XHRcdFx0b3B0aW9ucyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgYXR0ci10eXBlPVwiJHt0eXBlfVwiIGF0dHItdmFsdWU9XCIke2ouaWR9XCIgb25jbGljaz1cImZiLnNlbGVjdFBhZ2UodGhpcylcIj4ke2oubmFtZX08L2Rpdj5gO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQkKCcjZW50ZXJVUkwnKS5odG1sKG9wdGlvbnMpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdH0sXG5cdHNlbGVjdFBhZ2U6IChlKT0+e1xuXHRcdCQoJyNlbnRlclVSTCAucGFnZV9idG4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0ZmIubmV4dCA9ICcnO1xuXHRcdGxldCB0YXIgPSAkKGUpO1xuXHRcdHRhci5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0ZmIuZmVlZCh0YXIuYXR0cignYXR0ci12YWx1ZScpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQpO1xuXHRcdHN0ZXAuc3RlcDEoKTtcblx0fSxcblx0aGlkZGVuU3RhcnQ6ICgpPT57XG5cdFx0bGV0IGZiaWQgPSAkKCdoZWFkZXIgLmRldiBpbnB1dCcpLnZhbCgpO1xuXHRcdGRhdGEuc3RhcnQoZmJpZCk7XG5cdH0sXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpPT57XG5cdFx0aWYgKGNsZWFyKXtcblx0XHRcdCQoJy5yZWNvbW1hbmRzLCAuZmVlZHMgdGJvZHknKS5lbXB0eSgpO1xuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5vZmYoJ2NsaWNrJykuY2xpY2soKCk9Pntcblx0XHRcdFx0bGV0IHRhciA9ICQoJyNlbnRlclVSTCBzZWxlY3QnKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKTtcblx0XHRcdFx0ZmIuZmVlZCh0YXIudmFsKCksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCwgZmFsc2UpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGxldCBjb21tYW5kID0gKHR5cGUgPT0gJzInKSA/ICdmZWVkJzoncG9zdHMnO1xuXHRcdGxldCBhcGk7XG5cdFx0aWYgKHVybCA9PSAnJyl7XG5cdFx0XHRhcGkgPSBgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZUlEfS8ke2NvbW1hbmR9P2ZpZWxkcz1saW5rLGZ1bGxfcGljdHVyZSxjcmVhdGVkX3RpbWUsbWVzc2FnZSZsaW1pdD0yNWA7XG5cdFx0fWVsc2V7XG5cdFx0XHRhcGkgPSB1cmw7XG5cdFx0fVxuXHRcdEZCLmFwaShhcGksIChyZXMpPT57XG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID09IDApe1xuXHRcdFx0XHQkKCcuZmVlZHMgLmJ0bicpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0XHR9XG5cdFx0XHRmYi5uZXh0ID0gcmVzLnBhZ2luZy5uZXh0O1xuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0bGV0IHN0ciA9IGdlbkRhdGEoaSk7XG5cdFx0XHRcdCQoJy5zZWN0aW9uIC5mZWVkcyB0Ym9keScpLmFwcGVuZChzdHIpO1xuXHRcdFx0XHRpZiAoaS5tZXNzYWdlICYmIGkubWVzc2FnZS5pbmRleE9mKCfmir0nKSA+PSAwKXtcblx0XHRcdFx0XHRsZXQgcmVjb21tYW5kID0gZ2VuQ2FyZChpKTtcblx0XHRcdFx0XHQkKCcuZG9uYXRlX2FyZWEgLnJlY29tbWFuZHMnKS5hcHBlbmQocmVjb21tYW5kKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gZ2VuRGF0YShvYmope1xuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XG5cdFx0XHRsZXQgbGluayA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJytpZHNbMF0rJy9wb3N0cy8nK2lkc1sxXTtcblxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcblx0XHRcdGxldCBzdHIgPSBgPHRyPlxuXHRcdFx0XHRcdFx0PHRkPjxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiAgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+PC90ZD5cblx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bWVzc308L2E+PC90ZD5cblx0XHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcihvYmouY3JlYXRlZF90aW1lKX08L3RkPlxuXHRcdFx0XHRcdFx0PC90cj5gO1xuXHRcdFx0cmV0dXJuIHN0cjtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2VuQ2FyZChvYmope1xuXHRcdFx0bGV0IHNyYyA9IG9iai5mdWxsX3BpY3R1cmUgfHwgJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzAweDIyNSc7XG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xuXHRcdFx0XG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xuXHRcdFx0bGV0XHRzdHIgPSBgPGRpdiBjbGFzcz1cImNhcmRcIj5cblx0XHRcdDxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZVwiPlxuXHRcdFx0PGZpZ3VyZSBjbGFzcz1cImltYWdlIGlzLTRieTNcIj5cblx0XHRcdDxpbWcgc3JjPVwiJHtzcmN9XCIgYWx0PVwiXCI+XG5cdFx0XHQ8L2ZpZ3VyZT5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PC9hPlxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtY29udGVudFwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cblx0XHRcdCR7bWVzc31cblx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+XG5cdFx0XHQ8L2Rpdj5gO1xuXHRcdFx0cmV0dXJuIHN0cjtcblx0XHR9XG5cdH0sXG5cdGdldE1lOiAoKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWVgLCAocmVzKT0+e1xuXHRcdFx0XHRsZXQgYXJyID0gW3Jlc107XG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXRQYWdlOiAoKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcyk9Pntcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0Z2V0R3JvdXA6ICgpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9ncm91cHM/bGltaXQ9MTAwYCwgKHJlcyk9Pntcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0ZXh0ZW5zaW9uQXV0aDogKGNvbW1hbmQgPSAnJyk9Pntcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UsIGNvbW1hbmQpO1xuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0fSxcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSwgY29tbWFuZCA9ICcnKT0+e1xuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XG5cdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xuXHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xuXHRcdFx0XHRkYXRhLnJhdy5leHRlbnNpb24gPSB0cnVlO1xuXHRcdFx0XHRpZiAoY29tbWFuZCA9PSAnaW1wb3J0Jyl7XG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaGFyZWRwb3N0c1wiLCAkKCcjaW1wb3J0JykudmFsKCkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCBleHRlbmQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2hhcmVkcG9zdHNcIikpO1xuXHRcdFx0XHRsZXQgZmlkID0gW107XG5cdFx0XHRcdGxldCBpZHMgPSBbXTtcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XG5cdFx0XHRcdFx0ZmlkLnB1c2goaS5mcm9tLmlkKTtcblx0XHRcdFx0XHRpZiAoZmlkLmxlbmd0aCA+PTQ1KXtcblx0XHRcdFx0XHRcdGlkcy5wdXNoKGZpZCk7XG5cdFx0XHRcdFx0XHRmaWQgPSBbXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWRzLnB1c2goZmlkKTtcblx0XHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXSwgbmFtZXMgPSB7fTtcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGlkcyl7XG5cdFx0XHRcdFx0bGV0IHByb21pc2UgPSBmYi5nZXROYW1lKGkpLnRoZW4oKHJlcyk9Pntcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBPYmplY3Qua2V5cyhyZXMpKXtcblx0XHRcdFx0XHRcdFx0bmFtZXNbaV0gPSByZXNbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0UHJvbWlzZS5hbGwocHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xuXHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xuXHRcdFx0XHRcdFx0aS5mcm9tLm5hbWUgPSBuYW1lc1tpLmZyb20uaWRdID8gbmFtZXNbaS5mcm9tLmlkXS5uYW1lIDogaS5mcm9tLm5hbWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRhdGEucmF3LmRhdGEuc2hhcmVkcG9zdHMgPSBleHRlbmQ7XG5cdFx0XHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRzd2FsKHtcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXG5cdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xuXHRcdFx0XHR9KS5kb25lKCk7XG5cdFx0XHR9XG5cdFx0fWVsc2V7XG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XG5cdFx0fVxuXHR9LFxuXHRnZXROYW1lOiAoaWRzKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vP2lkcz0ke2lkcy50b1N0cmluZygpfWAsIChyZXMpPT57XG5cdFx0XHRcdHJlc29sdmUocmVzKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG59XG5sZXQgc3RlcCA9IHtcblx0c3RlcDE6ICgpPT57XG5cdFx0JCgnLnNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc3RlcDInKTtcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XG5cdH0sXG5cdHN0ZXAyOiAoKT0+e1xuXHRcdCQoJy5yZWNvbW1hbmRzLCAuZmVlZHMgdGJvZHknKS5lbXB0eSgpO1xuXHRcdCQoJy5zZWN0aW9uJykuYWRkQ2xhc3MoJ3N0ZXAyJyk7XG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xuXHR9XG59XG5cbmxldCBkYXRhID0ge1xuXHRyYXc6IHt9LFxuXHRmaWx0ZXJlZDoge30sXG5cdHVzZXJpZDogJycsXG5cdG5vd0xlbmd0aDogMCxcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcblx0cHJvbWlzZV9hcnJheTogW10sXG5cdHRlc3Q6IChpZCk9Pntcblx0XHRjb25zb2xlLmxvZyhpZCk7XG5cdH0sXG5cdGluaXQ6ICgpPT57XG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcblx0XHRkYXRhLnByb21pc2VfYXJyYXkgPSBbXTtcblx0XHRkYXRhLnJhdyA9IFtdO1xuXHR9LFxuXHRzdGFydDogKGZiaWQpPT57XG5cdFx0ZGF0YS5pbml0KCk7XG5cdFx0bGV0IG9iaiA9IHtcblx0XHRcdGZ1bGxJRDogZmJpZFxuXHRcdH1cblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdGxldCBjb21tYW5kcyA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnLCdzaGFyZWRwb3N0cyddO1xuXHRcdGxldCB0ZW1wX2RhdGEgPSBvYmo7XG5cdFx0Zm9yKGxldCBpIG9mIGNvbW1hbmRzKXtcblx0XHRcdHRlbXBfZGF0YS5kYXRhID0ge307XG5cdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KHRlbXBfZGF0YSwgaSkudGhlbigocmVzKT0+e1xuXHRcdFx0XHR0ZW1wX2RhdGEuZGF0YVtpXSA9IHJlcztcblx0XHRcdH0pO1xuXHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XG5cdFx0fVxuXG5cdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XG5cdFx0XHRkYXRhLmZpbmlzaCh0ZW1wX2RhdGEpO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXQ6IChmYmlkLCBjb21tYW5kKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0bGV0IGRhdGFzID0gW107XG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xuXHRcdFx0bGV0IHNoYXJlRXJyb3IgPSAwO1xuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJykgY29tbWFuZCA9ICdncm91cCc7XG5cdFx0XHRpZiAoY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XG5cdFx0XHRcdGdldFNoYXJlKCk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2NvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2NvbW1hbmRdfSZvcmRlcj1jaHJvbm9sb2dpY2FsJmZpZWxkcz0ke2NvbmZpZy5maWVsZFtjb21tYW5kXS50b1N0cmluZygpfWAsKHJlcyk9Pntcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywnbGltaXQ9JytsaW1pdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZ2V0U2hhcmUoYWZ0ZXI9Jycpe1xuXHRcdFx0XHRsZXQgdXJsID0gYGh0dHBzOi8vYW02NmFoZ3RwOC5leGVjdXRlLWFwaS5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tL3NoYXJlP2ZiaWQ9JHtmYmlkLmZ1bGxJRH0mYWZ0ZXI9JHthZnRlcn1gO1xuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xuXHRcdFx0XHRcdGlmIChyZXMgPT09ICdlbmQnKXtcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvck1lc3NhZ2Upe1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcblx0XHRcdFx0XHRcdH1lbHNlIGlmKHJlcy5kYXRhKXtcblx0XHRcdFx0XHRcdFx0Ly8gc2hhcmVFcnJvciA9IDA7XG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IG5hbWUgPSAnJztcblx0XHRcdFx0XHRcdFx0XHRpZihpLnN0b3J5KXtcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBpLnN0b3J5LnN1YnN0cmluZygwLCBpLnN0b3J5LmluZGV4T2YoJyBzaGFyZWQnKSk7XG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lID0gaS5pZC5zdWJzdHJpbmcoMCwgaS5pZC5pbmRleE9mKFwiX1wiKSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGxldCBpZCA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xuXHRcdFx0XHRcdFx0XHRcdGkuZnJvbSA9IHtpZCwgbmFtZX07XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRnZXRTaGFyZShyZXMuYWZ0ZXIpO1xuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0ZmluaXNoOiAoZmJpZCk9Pntcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0c3RlcC5zdGVwMigpO1xuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xuXHRcdCQoJy5yZXN1bHRfYXJlYSA+IC50aXRsZSBzcGFuJykudGV4dChmYmlkLmZ1bGxJRCk7XG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmF3XCIsIEpTT04uc3RyaW5naWZ5KGZiaWQpKTtcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XG5cdH0sXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XG5cdFx0ZGF0YS5maWx0ZXJlZCA9IHt9O1xuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHJhd0RhdGEuZGF0YSkpe1xuXHRcdFx0aWYgKGtleSA9PT0gJ3JlYWN0aW9ucycpIGlzVGFnID0gZmFsc2U7XG5cdFx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLmRhdGFba2V5XSwga2V5LCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHRcblx0XHRcdGRhdGEuZmlsdGVyZWRba2V5XSA9IG5ld0RhdGE7XG5cdFx0fVxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSl7XG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbHRlcmVkKTtcblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybiBkYXRhLmZpbHRlcmVkO1xuXHRcdH1cblx0fSxcblx0ZXhjZWw6IChyYXcpPT57XG5cdFx0dmFyIG5ld09iaiA9IFtdO1xuXHRcdGlmIChkYXRhLmV4dGVuc2lvbil7XG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHR2YXIgdG1wID0ge1xuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxuXHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCIgOiB0aGlzLnBvc3RsaW5rLFxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxuXHRcdFx0XHRcdFwi6Kmy5YiG5Lqr6K6a5pW4XCIgOiB0aGlzLmxpa2VfY291bnRcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHR2YXIgdG1wID0ge1xuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxuXHRcdFx0XHRcdFwi5b+D5oOFXCIgOiB0aGlzLnR5cGUgfHwgJycsXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCIgOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxuXHRcdFx0XHR9XG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIG5ld09iajtcblx0fSxcblx0aW1wb3J0OiAoZmlsZSk9Pntcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcblx0XHR9XG5cblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcblx0fVxufVxuXG5sZXQgdGFibGUgPSB7XG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9Pntcblx0XHQkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XG5cdFx0bGV0IGZpbHRlcmVkID0gcmF3ZGF0YTtcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGZpbHRlcmVkKSl7XG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcblx0XHRcdGxldCB0Ym9keSA9ICcnO1xuXHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxuXHRcdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cblx0XHRcdFx0PHRkPuW/g+aDhTwvdGQ+YDtcblx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxuXHRcdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxuXHRcdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XG5cdFx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cblx0XHRcdFx0PHRkPuiumjwvdGQ+XG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcblx0XHRcdH1cblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xuXHRcdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xuXHRcdFx0XHRpZiAocGljKXtcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XG5cdFx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XG5cdFx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8IHZhbC5zdG9yeX08L2E+PC90ZD5cblx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cblx0XHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcblx0XHRcdFx0dGJvZHkgKz0gdHI7XG5cdFx0XHR9XG5cdFx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XG5cdFx0XHQkKFwiLnRhYmxlcyAuXCIra2V5K1wiIHRhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xuXHRcdH1cblx0XHRcblx0XHRhY3RpdmUoKTtcblx0XHR0YWIuaW5pdCgpO1xuXHRcdGNvbXBhcmUuaW5pdCgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdFx0bGV0IGFyciA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnLCdzaGFyZWRwb3N0cyddO1xuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dGFibGVcblx0XHRcdFx0XHQuY29sdW1ucygxKVxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcblx0XHRcdFx0XHQuZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0YWJsZVxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxuXHRcdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRyZWRvOiAoKT0+e1xuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcblx0fVxufVxuXG5sZXQgY29tcGFyZSA9IHtcblx0YW5kOiBbXSxcblx0b3I6IFtdLFxuXHRyYXc6IFtdLFxuXHRpbml0OiAoKT0+e1xuXHRcdGNvbXBhcmUuYW5kID0gW107XG5cdFx0Y29tcGFyZS5vciA9IFtdO1xuXHRcdGNvbXBhcmUucmF3ID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdGxldCBpZ25vcmUgPSAkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS52YWwoKTtcblx0XHRsZXQgYmFzZSA9IFtdO1xuXHRcdGxldCBmaW5hbCA9IFtdO1xuXHRcdGxldCBjb21wYXJlX251bSA9IDE7XG5cdFx0aWYgKGlnbm9yZSA9PT0gJ2lnbm9yZScpIGNvbXBhcmVfbnVtID0gMjtcblxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGNvbXBhcmUucmF3KSl7XG5cdFx0XHRpZiAoa2V5ICE9PSBpZ25vcmUpe1xuXHRcdFx0XHRmb3IobGV0IGkgb2YgY29tcGFyZS5yYXdba2V5XSl7XG5cdFx0XHRcdFx0YmFzZS5wdXNoKGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBzb3J0ID0gKGRhdGEucmF3LmV4dGVuc2lvbikgPyAnbmFtZSc6J2lkJztcblx0XHRiYXNlID0gYmFzZS5zb3J0KChhLGIpPT57XG5cdFx0XHRyZXR1cm4gYS5mcm9tW3NvcnRdID4gYi5mcm9tW3NvcnRdID8gMTotMTtcblx0XHR9KTtcblxuXHRcdGZvcihsZXQgaSBvZiBiYXNlKXtcblx0XHRcdGkubWF0Y2ggPSAwO1xuXHRcdH1cblxuXHRcdGxldCB0ZW1wID0gJyc7XG5cdFx0bGV0IHRlbXBfbmFtZSA9ICcnO1xuXHRcdC8vIGNvbnNvbGUubG9nKGJhc2UpO1xuXHRcdGZvcihsZXQgaSBpbiBiYXNlKXtcblx0XHRcdGxldCBvYmogPSBiYXNlW2ldO1xuXHRcdFx0aWYgKG9iai5mcm9tLmlkID09IHRlbXAgfHwgKGRhdGEucmF3LmV4dGVuc2lvbiAmJiAob2JqLmZyb20ubmFtZSA9PSB0ZW1wX25hbWUpKSl7XG5cdFx0XHRcdGxldCB0YXIgPSBmaW5hbFtmaW5hbC5sZW5ndGgtMV07XG5cdFx0XHRcdHRhci5tYXRjaCsrO1xuXHRcdFx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKXtcblx0XHRcdFx0XHRpZiAoIXRhcltrZXldKSB0YXJba2V5XSA9IG9ialtrZXldOyAvL+WQiOS9teizh+aWmVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0YXIubWF0Y2ggPT0gY29tcGFyZV9udW0pe1xuXHRcdFx0XHRcdHRlbXBfbmFtZSA9ICcnO1xuXHRcdFx0XHRcdHRlbXAgPSAnJztcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGZpbmFsLnB1c2gob2JqKTtcblx0XHRcdFx0dGVtcCA9IG9iai5mcm9tLmlkO1xuXHRcdFx0XHR0ZW1wX25hbWUgPSBvYmouZnJvbS5uYW1lO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdFxuXHRcdGNvbXBhcmUub3IgPSBmaW5hbDtcblx0XHRjb21wYXJlLmFuZCA9IGNvbXBhcmUub3IuZmlsdGVyKCh2YWwpPT57XG5cdFx0XHRyZXR1cm4gdmFsLm1hdGNoID09IGNvbXBhcmVfbnVtO1xuXHRcdH0pO1xuXHRcdGNvbXBhcmUuZ2VuZXJhdGUoKTtcblx0fSxcblx0Z2VuZXJhdGU6ICgpPT57XG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcblx0XHRsZXQgZGF0YV9hbmQgPSBjb21wYXJlLmFuZDtcblxuXHRcdGxldCB0Ym9keSA9ICcnO1xuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9hbmQuZW50cmllcygpKXtcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnMCd9PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XG5cdFx0XHR0Ym9keSArPSB0cjtcblx0XHR9XG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLmFuZCB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xuXG5cdFx0bGV0IGRhdGFfb3IgPSBjb21wYXJlLm9yO1xuXHRcdGxldCB0Ym9keTIgPSAnJztcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfb3IuZW50cmllcygpKXtcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnJ308L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcblx0XHRcdHRib2R5MiArPSB0cjtcblx0XHR9XG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLm9yIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keTIpO1xuXHRcdFxuXHRcdGFjdGl2ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKHtcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXG5cdFx0XHR9KTtcblx0XHRcdGxldCBhcnIgPSBbJ2FuZCcsJ29yJ107XG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0YWJsZVxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxuXHRcdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHRhYmxlXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXG5cdFx0XHRcdFx0LmRyYXcoKTtcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxubGV0IGNob29zZSA9IHtcblx0ZGF0YTogW10sXG5cdGF3YXJkOiBbXSxcblx0bnVtOiAwLFxuXHRkZXRhaWw6IGZhbHNlLFxuXHRsaXN0OiBbXSxcblx0aW5pdDogKGN0cmwgPSBmYWxzZSk9Pntcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xuXHRcdGNob29zZS5saXN0ID0gW107XG5cdFx0Y2hvb3NlLm51bSA9IDA7XG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XG5cdFx0XHRcdGlmIChuID4gMCl7XG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1lbHNle1xuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcblx0XHR9XG5cdFx0Y2hvb3NlLmdvKGN0cmwpO1xuXHR9LFxuXHRnbzogKGN0cmwpPT57XG5cdFx0bGV0IGNvbW1hbmQgPSB0YWIubm93O1xuXHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcblx0XHR9ZWxzZXtcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhW2NvbW1hbmRdLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHRcblx0XHR9XG5cdFx0bGV0IGluc2VydCA9ICcnO1xuXHRcdGxldCB0ZW1wQXJyID0gW107XG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5jb2x1bW4oMikuZGF0YSgpLmVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KXtcblx0XHRcdFx0bGV0IHdvcmQgPSAkKCcuc2VhcmNoQ29tbWVudCcpLnZhbCgpO1xuXHRcdFx0XHRpZiAodmFsdWUuaW5kZXhPZih3b3JkKSA+PSAwKSB0ZW1wQXJyLnB1c2goaW5kZXgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGZvcihsZXQgaSBvZiBjaG9vc2UuYXdhcmQpe1xuXHRcdFx0bGV0IHJvdyA9ICh0ZW1wQXJyLmxlbmd0aCA9PSAwKSA/IGk6dGVtcEFycltpXTtcblx0XHRcdGxldCB0YXIgPSAkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLnJvdyhyb3cpLm5vZGUoKS5pbm5lckhUTUw7XG5cdFx0XHRpbnNlcnQgKz0gJzx0cj4nICsgdGFyICsgJzwvdHI+Jztcblx0XHR9XG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcblx0XHRpZiAoIWN0cmwpe1xuXHRcdFx0JChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHQvLyBsZXQgdGFyID0gJCh0aGlzKS5maW5kKCd0ZCcpLmVxKDEpO1xuXHRcdFx0XHQvLyBsZXQgaWQgPSB0YXIuZmluZCgnYScpLmF0dHIoJ2F0dHItZmJpZCcpO1xuXHRcdFx0XHQvLyB0YXIucHJlcGVuZChgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcblxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xuXHRcdFx0bGV0IG5vdyA9IDA7XG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI3XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xuXHRcdFx0fVxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xuXHRcdH1cblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XG5cdH1cbn1cblxubGV0IGZpbHRlciA9IHtcblx0dG90YWxGaWx0ZXI6IChyYXcsIGNvbW1hbmQsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIGVuZFRpbWUpPT57XG5cdFx0bGV0IGRhdGEgPSByYXc7XG5cdFx0aWYgKGlzRHVwbGljYXRlKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xuXHRcdH1cblx0XHRpZiAod29yZCAhPT0gJycgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcblx0XHR9XG5cdFx0aWYgKGlzVGFnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcblx0XHR9XG5cdFx0aWYgKGNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBlbmRUaW1lKTtcblx0XHR9ZWxzZXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9LFxuXHR1bmlxdWU6IChkYXRhKT0+e1xuXHRcdGxldCBvdXRwdXQgPSBbXTtcblx0XHRsZXQga2V5cyA9IFtdO1xuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xuXHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9LFxuXHR3b3JkOiAoZGF0YSwgd29yZCk9Pntcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSl7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBuZXdBcnk7XG5cdH0sXG5cdHRhZzogKGRhdGEpPT57XG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0dGltZTogKGRhdGEsIHQpPT57XG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XG5cdFx0bGV0IHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIil7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBuZXdBcnk7XG5cdH0sXG5cdHJlYWN0OiAoZGF0YSwgdGFyKT0+e1xuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xuXHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0fWVsc2V7XG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xuXHRcdH1cblx0fVxufVxuXG5sZXQgdWkgPSB7XG5cdGluaXQ6ICgpPT57XG5cblx0fVxufVxuXG5sZXQgdGFiID0ge1xuXHRub3c6IFwiY29tbWVudHNcIixcblx0aW5pdDogKCk9Pntcblx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdHRhYi5ub3cgPSAkKHRoaXMpLmF0dHIoJ2F0dHItdHlwZScpO1xuXHRcdFx0bGV0IHRhciA9ICQodGhpcykuaW5kZXgoKTtcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHQkKCcudGFibGVzID4gZGl2JykuZXEodGFyKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcblx0XHRcdFx0Y29tcGFyZS5pbml0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuXG5cbmZ1bmN0aW9uIG5vd0RhdGUoKXtcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XG59XG5cbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XG4gICAgIGlmIChkYXRlIDwgMTApe1xuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xuICAgICB9XG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xuICAgICBpZiAoaG91ciA8IDEwKXtcbiAgICAgXHRob3VyID0gXCIwXCIraG91cjtcbiAgICAgfVxuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XG4gICAgIGlmIChtaW4gPCAxMCl7XG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xuICAgICB9XG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcbiAgICAgaWYgKHNlYyA8IDEwKXtcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XG4gICAgIH1cbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XG4gICAgIHJldHVybiB0aW1lO1xuIH1cblxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XG4gXHR9KTtcbiBcdHJldHVybiBhcnJheTtcbiB9XG5cbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XG4gXHR2YXIgaSwgciwgdDtcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xuIFx0XHRhcnlbaV0gPSBpO1xuIFx0fVxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcbiBcdFx0dCA9IGFyeVtyXTtcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xuIFx0XHRhcnlbaV0gPSB0O1xuIFx0fVxuIFx0cmV0dXJuIGFyeTtcbiB9XG5cbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcbiAgICBcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxuICAgIFxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xuXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xuICAgICAgICBcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XG4gICAgICAgIH1cblxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xuICAgICAgICBcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XG4gICAgfVxuICAgIFxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcm93ID0gXCJcIjtcbiAgICAgICAgXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XG4gICAgICAgIH1cblxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xuICAgICAgICBcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcbiAgICB9XG5cbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9ICAgXG4gICAgXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcbiAgICBcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XG4gICAgXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxuICAgIFxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcbiAgICBsaW5rLmhyZWYgPSB1cmk7XG4gICAgXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xuICAgIFxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICBsaW5rLmNsaWNrKCk7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcbn0iXX0=
