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
	var hidearea = 0;
	$('header').click(function () {
		hidearea++;
		if (hidearea >= 5) {
			$('header').off('click');
			$('#fbid_button, #pure_fbid').removeClass('hide');
		}
	});
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
	$("#btn_cache").click(function () {
		localStorage.removeItem('raw');
		sessionStorage.removeItem('login');
		alert('已清除暫存，請重新進行登入');
		location.reload();
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
		sharedposts: 'v2.3',
		url_comments: 'v2.7',
		feed: 'v2.9',
		group: 'v2.9',
		newest: 'v2.8'
	},
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	order: '',
	auth: 'user_photos,user_posts,user_managed_groups,manage_pages',
	extension: false,
	pageToken: ''
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
		var options = "<input id=\"pure_fbid\" class=\"hide\"><button id=\"fbid_button\" class=\"btn hide\" onclick=\"fb.hiddenStart()\">\u7531FBID\u64F7\u53D6</button><br>";
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
		if (tar.attr('attr-type') == 1) {
			fb.setToken(tar.attr('attr-value'));
		}
		fb.feed(tar.attr('attr-value'), tar.attr('attr-type'), fb.next);
		step.step1();
	},
	setToken: function setToken(pageid) {
		var pages = JSON.parse(sessionStorage.login)[1];
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = pages[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var i = _step3.value;

				if (i.id == pageid) {
					config.pageToken = i.access_token;
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
	},
	hiddenStart: function hiddenStart() {
		var fbid = $('#pure_fbid').val();
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
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = res.data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var i = _step4.value;

					var str = genData(i);
					$('.section .feeds tbody').append(str);
					if (i.message && i.message.indexOf('抽') >= 0) {
						var recommand = genCard(i);
						$('.donate_area .recommands').append(recommand);
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
					var _iteratorNormalCompletion5 = true;
					var _didIteratorError5 = false;
					var _iteratorError5 = undefined;

					try {
						for (var _iterator5 = extend[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
							var i = _step5.value;

							fid.push(i.from.id);
							if (fid.length >= 45) {
								ids.push(fid);
								fid = [];
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

					ids.push(fid);
					var promise_array = [],
					    names = {};
					var _iteratorNormalCompletion6 = true;
					var _didIteratorError6 = false;
					var _iteratorError6 = undefined;

					try {
						for (var _iterator6 = ids[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
							var _i = _step6.value;

							var promise = fb.getName(_i).then(function (res) {
								var _iteratorNormalCompletion8 = true;
								var _didIteratorError8 = false;
								var _iteratorError8 = undefined;

								try {
									for (var _iterator8 = Object.keys(res)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
										var _i2 = _step8.value;

										names[_i2] = res[_i2];
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
							});
							promise_array.push(promise);
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

					Promise.all(promise_array).then(function () {
						var _iteratorNormalCompletion7 = true;
						var _didIteratorError7 = false;
						var _iteratorError7 = undefined;

						try {
							for (var _iterator7 = extend[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
								var i = _step7.value;

								i.from.name = names[i.from.id] ? names[i.from.id].name : i.from.name;
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
		var _iteratorNormalCompletion9 = true;
		var _didIteratorError9 = false;
		var _iteratorError9 = undefined;

		try {
			var _loop = function _loop() {
				var i = _step9.value;

				temp_data.data = {};
				var promise = data.get(temp_data, i).then(function (res) {
					temp_data.data[i] = res;
				});
				data.promise_array.push(promise);
			};

			for (var _iterator9 = commands[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
				_loop();
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
				FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/" + command + "?limit=" + config.limit[command] + "&order=chronological&access_token=" + config.pageToken + "&fields=" + config.field[command].toString(), function (res) {
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
					var _iteratorNormalCompletion11 = true;
					var _didIteratorError11 = false;
					var _iteratorError11 = undefined;

					try {
						for (var _iterator11 = res.data[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
							var d = _step11.value;

							if (command == 'reactions') {
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
							var _iteratorNormalCompletion12 = true;
							var _didIteratorError12 = false;
							var _iteratorError12 = undefined;

							try {
								for (var _iterator12 = res.data[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
									var _i3 = _step12.value;

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
		var _iteratorNormalCompletion13 = true;
		var _didIteratorError13 = false;
		var _iteratorError13 = undefined;

		try {
			for (var _iterator13 = Object.keys(rawData.data)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
				var key = _step13.value;

				if (key === 'reactions') isTag = false;
				var newData = _filter.totalFilter.apply(_filter, [rawData.data[key], key, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
				data.filtered[key] = newData;
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
		var _iteratorNormalCompletion14 = true;
		var _didIteratorError14 = false;
		var _iteratorError14 = undefined;

		try {
			for (var _iterator14 = Object.keys(filtered)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
				var key = _step14.value;

				var thead = '';
				var tbody = '';
				if (key === 'reactions') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td>\u5FC3\u60C5</td>";
				} else if (key === 'sharedposts') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
				} else {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td>\u8B9A</td>\n\t\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
				}
				var _iteratorNormalCompletion16 = true;
				var _didIteratorError16 = false;
				var _iteratorError16 = undefined;

				try {
					for (var _iterator16 = filtered[key].entries()[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
						var _step16$value = _slicedToArray(_step16.value, 2),
						    j = _step16$value[0],
						    val = _step16$value[1];

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

				var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
				$(".tables ." + key + " table").html('').append(insert);
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
			var _iteratorNormalCompletion15 = true;
			var _didIteratorError15 = false;
			var _iteratorError15 = undefined;

			try {
				var _loop2 = function _loop2() {
					var i = _step15.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator15 = arr[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
					_loop2();
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

		var _iteratorNormalCompletion17 = true;
		var _didIteratorError17 = false;
		var _iteratorError17 = undefined;

		try {
			for (var _iterator17 = Object.keys(compare.raw)[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
				var _key = _step17.value;

				if (_key !== ignore) {
					var _iteratorNormalCompletion20 = true;
					var _didIteratorError20 = false;
					var _iteratorError20 = undefined;

					try {
						for (var _iterator20 = compare.raw[_key][Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
							var _i5 = _step20.value;

							base.push(_i5);
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
				}
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

		var sort = data.raw.extension ? 'name' : 'id';
		base = base.sort(function (a, b) {
			return a.from[sort] > b.from[sort] ? 1 : -1;
		});

		var _iteratorNormalCompletion18 = true;
		var _didIteratorError18 = false;
		var _iteratorError18 = undefined;

		try {
			for (var _iterator18 = base[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
				var _i6 = _step18.value;

				_i6.match = 0;
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

		var temp = '';
		var temp_name = '';
		// console.log(base);
		for (var _i4 in base) {
			var obj = base[_i4];
			if (obj.from.id == temp || data.raw.extension && obj.from.name == temp_name) {
				var tar = final[final.length - 1];
				tar.match++;
				var _iteratorNormalCompletion19 = true;
				var _didIteratorError19 = false;
				var _iteratorError19 = undefined;

				try {
					for (var _iterator19 = Object.keys(obj)[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
						var key = _step19.value;

						if (!tar[key]) tar[key] = obj[key]; //合併資料
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
		var _iteratorNormalCompletion21 = true;
		var _didIteratorError21 = false;
		var _iteratorError21 = undefined;

		try {
			for (var _iterator21 = data_and.entries()[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
				var _step21$value = _slicedToArray(_step21.value, 2),
				    j = _step21$value[0],
				    val = _step21$value[1];

				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '0') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
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

		$(".tables .total .table_compare.and tbody").html('').append(tbody);

		var data_or = compare.or;
		var tbody2 = '';
		var _iteratorNormalCompletion22 = true;
		var _didIteratorError22 = false;
		var _iteratorError22 = undefined;

		try {
			for (var _iterator22 = data_or.entries()[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
				var _step22$value = _slicedToArray(_step22.value, 2),
				    j = _step22$value[0],
				    val = _step22$value[1];

				var _td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var _tr = "<tr>" + _td + "</tr>";
				tbody2 += _tr;
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

		$(".tables .total .table_compare.or tbody").html('').append(tbody2);

		active();

		function active() {
			var table = $(".tables .total table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			var arr = ['and', 'or'];
			var _iteratorNormalCompletion23 = true;
			var _didIteratorError23 = false;
			var _iteratorError23 = undefined;

			try {
				var _loop3 = function _loop3() {
					var i = _step23.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator23 = arr[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
					_loop3();
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
		var _iteratorNormalCompletion24 = true;
		var _didIteratorError24 = false;
		var _iteratorError24 = undefined;

		try {
			for (var _iterator24 = choose.award[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
				var _i7 = _step24.value;

				var row = tempArr.length == 0 ? _i7 : tempArr[_i7];
				var _tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
				insert += '<tr>' + _tar + '</tr>';
			}
		} catch (err) {
			_didIteratorError24 = true;
			_iteratorError24 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion24 && _iterator24.return) {
					_iterator24.return();
				}
			} finally {
				if (_didIteratorError24) {
					throw _iteratorError24;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJsYXN0RGF0YSIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJkYXRhIiwiZmluaXNoIiwic2Vzc2lvblN0b3JhZ2UiLCJsb2dpbiIsImZiIiwiZ2VuT3B0aW9uIiwiZSIsImN0cmxLZXkiLCJhbHRLZXkiLCJleHRlbnNpb25BdXRoIiwiZ2V0QXV0aCIsInJlbW92ZUl0ZW0iLCJhbGVydCIsImxvY2F0aW9uIiwicmVsb2FkIiwiY2hvb3NlIiwiaW5pdCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJhcHBlbmQiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJjb25maWciLCJmaWx0ZXIiLCJyZWFjdCIsInZhbCIsImNvbXBhcmUiLCJkYXRlcmFuZ2VwaWNrZXIiLCJzdGFydCIsImVuZCIsImxhYmVsIiwiZW5kVGltZSIsImZvcm1hdCIsInNldFN0YXJ0RGF0ZSIsIm5vd0RhdGUiLCJmaWx0ZXJEYXRhIiwicmF3IiwiZGQiLCJ0YWIiLCJub3ciLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpa2VzIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJuZXdlc3QiLCJ3b3JkIiwib3JkZXIiLCJhdXRoIiwiZXh0ZW5zaW9uIiwicGFnZVRva2VuIiwibmV4dCIsInR5cGUiLCJGQiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzd2FsIiwiZG9uZSIsImZiaWQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwib3B0aW9ucyIsImkiLCJqIiwiaWQiLCJuYW1lIiwiaHRtbCIsInNlbGVjdFBhZ2UiLCJ0YXIiLCJhdHRyIiwic2V0VG9rZW4iLCJzdGVwIiwic3RlcDEiLCJwYWdlaWQiLCJwYWdlcyIsImFjY2Vzc190b2tlbiIsImhpZGRlblN0YXJ0IiwicGFnZUlEIiwiY2xlYXIiLCJlbXB0eSIsImZpbmQiLCJjb21tYW5kIiwiYXBpIiwicGFnaW5nIiwic3RyIiwiZ2VuRGF0YSIsIm1lc3NhZ2UiLCJyZWNvbW1hbmQiLCJnZW5DYXJkIiwib2JqIiwiaWRzIiwic3BsaXQiLCJsaW5rIiwibWVzcyIsInJlcGxhY2UiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwic3JjIiwiZnVsbF9waWN0dXJlIiwicmVzb2x2ZSIsInJlamVjdCIsImFyciIsImV4dGVuc2lvbkNhbGxiYWNrIiwic2V0SXRlbSIsImV4dGVuZCIsImZpZCIsInB1c2giLCJmcm9tIiwicHJvbWlzZV9hcnJheSIsIm5hbWVzIiwicHJvbWlzZSIsImdldE5hbWUiLCJPYmplY3QiLCJrZXlzIiwidGl0bGUiLCJ0b1N0cmluZyIsInNjcm9sbFRvcCIsInN0ZXAyIiwiZmlsdGVyZWQiLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJ0ZXN0IiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJjb21tYW5kcyIsInRlbXBfZGF0YSIsImdldCIsImRhdGFzIiwic2hhcmVFcnJvciIsImdldFNoYXJlIiwiZCIsInVwZGF0ZWRfdGltZSIsImdldE5leHQiLCJnZXRKU09OIiwiZmFpbCIsImFmdGVyIiwic3RvcnkiLCJzdWJzdHJpbmciLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsImtleSIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsIm5ld09iaiIsImVhY2giLCJ0bXAiLCJwb3N0bGluayIsImxpa2VfY291bnQiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50IiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJwaWMiLCJ0aGVhZCIsInRib2R5IiwiZW50cmllcyIsInBpY3R1cmUiLCJ0ZCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInNlYXJjaCIsInZhbHVlIiwiZHJhdyIsImFuZCIsIm9yIiwiaWdub3JlIiwiYmFzZSIsImZpbmFsIiwiY29tcGFyZV9udW0iLCJzb3J0IiwiYSIsImIiLCJtYXRjaCIsInRlbXAiLCJ0ZW1wX25hbWUiLCJkYXRhX2FuZCIsImRhdGFfb3IiLCJ0Ym9keTIiLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJjdHJsIiwibiIsInBhcnNlSW50IiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJ0ZW1wQXJyIiwiY29sdW1uIiwiaW5kZXgiLCJyb3ciLCJub2RlIiwiaW5uZXJIVE1MIiwiayIsImVxIiwiaW5zZXJ0QmVmb3JlIiwidW5pcXVlIiwidGFnIiwidGltZSIsIm91dHB1dCIsImZvckVhY2giLCJpdGVtIiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsIm1vbWVudCIsIkRhdGUiLCJfZCIsInVpIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwibWFwIiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwiY3JlYXRlRWxlbWVudCIsImhyZWYiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBO0FBQ0RTLEVBQUVFLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFVO0FBQzNCLEtBQUlDLFdBQVcsQ0FBZjtBQUNBSixHQUFFLFFBQUYsRUFBWUssS0FBWixDQUFrQixZQUFVO0FBQzNCRDtBQUNBLE1BQUlBLFlBQVksQ0FBaEIsRUFBa0I7QUFDakJKLEtBQUUsUUFBRixFQUFZTSxHQUFaLENBQWdCLE9BQWhCO0FBQ0FOLEtBQUUsMEJBQUYsRUFBOEJPLFdBQTlCLENBQTBDLE1BQTFDO0FBQ0E7QUFDRCxFQU5EO0FBT0EsS0FBSUMsV0FBV0MsS0FBS0MsS0FBTCxDQUFXQyxhQUFhQyxPQUFiLENBQXFCLEtBQXJCLENBQVgsQ0FBZjtBQUNBLEtBQUlKLFFBQUosRUFBYTtBQUNaSyxPQUFLQyxNQUFMLENBQVlOLFFBQVo7QUFDQTtBQUNELEtBQUlPLGVBQWVDLEtBQW5C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MUI7O0FBRUE7QUFDQTRPLFNBQU8vQyxNQUFNLE1BQWI7QUFDSDs7QUFFRCxLQUFJK0MsT0FBTyxFQUFYLEVBQWU7QUFDWGhSLFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJa1IsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWUwsWUFBWTNKLE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUlpSyxNQUFNLHVDQUF1Q0MsVUFBVUosR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUloSyxPQUFPdkksU0FBUzRTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBckssTUFBS3NLLElBQUwsR0FBWUgsR0FBWjs7QUFFQTtBQUNBbkssTUFBS3VLLEtBQUwsR0FBYSxtQkFBYjtBQUNBdkssTUFBS3dLLFFBQUwsR0FBZ0JOLFdBQVcsTUFBM0I7O0FBRUE7QUFDQXpTLFVBQVNnVCxJQUFULENBQWNDLFdBQWQsQ0FBMEIxSyxJQUExQjtBQUNBQSxNQUFLcEksS0FBTDtBQUNBSCxVQUFTZ1QsSUFBVCxDQUFjRSxXQUFkLENBQTBCM0ssSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXG5cbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXG57XG5cdGlmICghZXJyb3JNZXNzYWdlKXtcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHRcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRsZXQgaGlkZWFyZWEgPSAwO1xuXHQkKCdoZWFkZXInKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGhpZGVhcmVhKys7XG5cdFx0aWYgKGhpZGVhcmVhID49IDUpe1xuXHRcdFx0JCgnaGVhZGVyJykub2ZmKCdjbGljaycpO1xuXHRcdFx0JCgnI2ZiaWRfYnV0dG9uLCAjcHVyZV9mYmlkJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcblx0XHR9XG5cdH0pO1xuXHRsZXQgbGFzdERhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmF3XCIpKTtcblx0aWYgKGxhc3REYXRhKXtcblx0XHRkYXRhLmZpbmlzaChsYXN0RGF0YSk7XG5cdH1cblx0aWYgKHNlc3Npb25TdG9yYWdlLmxvZ2luKXtcblx0XHRmYi5nZW5PcHRpb24oSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbikpO1xuXHR9XG5cblx0JChcIi50YWJsZXMgPiAuc2hhcmVkcG9zdHMgYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgnaW1wb3J0Jyk7XG5cdFx0fWVsc2V7XG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XG5cdFx0fVxuXHR9KTtcblx0XG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XG5cdH0pO1xuXG5cdCQoXCIjYnRuX3N0YXJ0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcblx0fSk7XG5cdCQoXCIjYnRuX2NhY2hlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3JhdycpO1xuXHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2xvZ2luJyk7XG5cdFx0YWxlcnQoJ+W3sua4hemZpOaaq+WtmO+8jOiri+mHjeaWsOmAsuihjOeZu+WFpScpO1xuXHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHR9KTtcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0Y2hvb3NlLmluaXQodHJ1ZSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRjaG9vc2UuaW5pdCgpO1xuXHRcdH1cblx0fSk7XG5cdFxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XG5cdFx0fWVsc2V7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xuXHR9KTtcblxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xuXHRcdH1cblx0fSk7XG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcblx0XHRpZiAoIWUuY3RybEtleSB8fCAhZS5hbHRLZXkpe1xuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xuXHRcdH1cblx0fSk7XG5cblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcblx0XHR0YWJsZS5yZWRvKCk7XG5cdH0pO1xuXG5cdCQoXCIudGFibGVzIC5maWx0ZXJzIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcblx0XHR0YWJsZS5yZWRvKCk7XG5cdH0pO1xuXG5cdCQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpe1xuXHRcdGNvbXBhcmUuaW5pdCgpO1xuXHR9KTtcblxuXHQkKCcuY29tcGFyZV9jb25kaXRpb24nKS5jaGFuZ2UoZnVuY3Rpb24oKXtcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZScpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuJysgJCh0aGlzKS52YWwoKSkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcblx0fSk7XG5cblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXG5cdFx0XCJsb2NhbGVcIjoge1xuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZLU1NLUREICAgSEg6bW1cIixcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXG5cdFx0XHRcIuaXpVwiLFxuXHRcdFx0XCLkuIBcIixcblx0XHRcdFwi5LqMXCIsXG5cdFx0XHRcIuS4iVwiLFxuXHRcdFx0XCLlm5tcIixcblx0XHRcdFwi5LqUXCIsXG5cdFx0XHRcIuWFrVwiXG5cdFx0XHRdLFxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcblx0XHRcdFwi5LiA5pyIXCIsXG5cdFx0XHRcIuS6jOaciFwiLFxuXHRcdFx0XCLkuInmnIhcIixcblx0XHRcdFwi5Zub5pyIXCIsXG5cdFx0XHRcIuS6lOaciFwiLFxuXHRcdFx0XCLlha3mnIhcIixcblx0XHRcdFwi5LiD5pyIXCIsXG5cdFx0XHRcIuWFq+aciFwiLFxuXHRcdFx0XCLkuZ3mnIhcIixcblx0XHRcdFwi5Y2B5pyIXCIsXG5cdFx0XHRcIuWNgeS4gOaciFwiLFxuXHRcdFx0XCLljYHkuozmnIhcIlxuXHRcdFx0XSxcblx0XHRcdFwiZmlyc3REYXlcIjogMVxuXHRcdH0sXG5cdH0sZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcblx0XHR0YWJsZS5yZWRvKCk7XG5cdH0pO1xuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XG5cblxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcblx0XHRpZiAoZS5jdHJsS2V5KXtcblx0XHRcdGxldCBkZDtcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGFbdGFiLm5vd10pO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIGRkO1xuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcblx0XHR9ZWxzZXtcblx0XHRcdGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApe1xuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGFbdGFiLm5vd10pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xuXHR9KTtcblxuXHRsZXQgY2lfY291bnRlciA9IDA7XG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0Y2lfY291bnRlcisrO1xuXHRcdGlmIChjaV9jb3VudGVyID49IDUpe1xuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHR9XG5cdFx0aWYoZS5jdHJsS2V5KXtcblx0XHRcdGZiLmdldEF1dGgoJ3NoYXJlZHBvc3RzJyk7XG5cdFx0fVxuXHR9KTtcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcblx0fSk7XG59KTtcblxubGV0IGNvbmZpZyA9IHtcblx0ZmllbGQ6IHtcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZScsJ2Zyb20nLCdjcmVhdGVkX3RpbWUnXSxcblx0XHRyZWFjdGlvbnM6IFtdLFxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcblx0XHR1cmxfY29tbWVudHM6IFtdLFxuXHRcdGZlZWQ6IFsnY3JlYXRlZF90aW1lJywnZnJvbScsJ21lc3NhZ2UnLCdzdG9yeSddLFxuXHRcdGxpa2VzOiBbJ25hbWUnXVxuXHR9LFxuXHRsaW1pdDoge1xuXHRcdGNvbW1lbnRzOiAnNTAwJyxcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxuXHRcdGZlZWQ6ICc1MDAnLFxuXHRcdGxpa2VzOiAnNTAwJ1xuXHR9LFxuXHRhcGlWZXJzaW9uOiB7XG5cdFx0Y29tbWVudHM6ICd2Mi43Jyxcblx0XHRyZWFjdGlvbnM6ICd2Mi43Jyxcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxuXHRcdGZlZWQ6ICd2Mi45Jyxcblx0XHRncm91cDogJ3YyLjknLFxuXHRcdG5ld2VzdDogJ3YyLjgnXG5cdH0sXG5cdGZpbHRlcjoge1xuXHRcdHdvcmQ6ICcnLFxuXHRcdHJlYWN0OiAnYWxsJyxcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcblx0fSxcblx0b3JkZXI6ICcnLFxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX21hbmFnZWRfZ3JvdXBzLG1hbmFnZV9wYWdlcycsXG5cdGV4dGVuc2lvbjogZmFsc2UsXG5cdHBhZ2VUb2tlbjogJycsXG59XG5cbmxldCBmYiA9IHtcblx0bmV4dDogJycsXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHR9LFxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCdtYW5hZ2VfcGFnZXMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9tYW5hZ2VkX2dyb3VwcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XG5cdFx0XHRcdFx0ZmIuc3RhcnQoKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0c3dhbChcblx0XHRcdFx0XHRcdCfmjojmrIrlpLHmlZfvvIzoq4vntabkuojmiYDmnInmrIrpmZAnLFxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcblx0XHRcdFx0XHRcdCdlcnJvcidcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1x0XHRcdFxuXHRcdFx0fVxuXHRcdH1lbHNle1xuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHRcdH1cblx0fSxcblx0c3RhcnQ6ICgpPT57XG5cdFx0UHJvbWlzZS5hbGwoW2ZiLmdldE1lKCksZmIuZ2V0UGFnZSgpLCBmYi5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xuXHRcdFx0c2Vzc2lvblN0b3JhZ2UubG9naW4gPSBKU09OLnN0cmluZ2lmeShyZXMpO1xuXHRcdFx0ZmIuZ2VuT3B0aW9uKHJlcyk7XG5cdFx0fSk7XG5cdH0sXG5cdGdlbk9wdGlvbjogKHJlcyk9Pntcblx0XHRmYi5uZXh0ID0gJyc7XG5cdFx0bGV0IG9wdGlvbnMgPSBgPGlucHV0IGlkPVwicHVyZV9mYmlkXCIgY2xhc3M9XCJoaWRlXCI+PGJ1dHRvbiBpZD1cImZiaWRfYnV0dG9uXCIgY2xhc3M9XCJidG4gaGlkZVwiIG9uY2xpY2s9XCJmYi5oaWRkZW5TdGFydCgpXCI+55SxRkJJROaTt+WPljwvYnV0dG9uPjxicj5gO1xuXHRcdGxldCB0eXBlID0gLTE7XG5cdFx0JCgnI2J0bl9zdGFydCcpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0Zm9yKGxldCBpIG9mIHJlcyl7XG5cdFx0XHR0eXBlKys7XG5cdFx0XHRmb3IobGV0IGogb2YgaSl7XG5cdFx0XHRcdG9wdGlvbnMgKz0gYDxkaXYgY2xhc3M9XCJwYWdlX2J0blwiIGF0dHItdHlwZT1cIiR7dHlwZX1cIiBhdHRyLXZhbHVlPVwiJHtqLmlkfVwiIG9uY2xpY2s9XCJmYi5zZWxlY3RQYWdlKHRoaXMpXCI+JHtqLm5hbWV9PC9kaXY+YDtcblx0XHRcdH1cblx0XHR9XG5cdFx0JCgnI2VudGVyVVJMJykuaHRtbChvcHRpb25zKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuXHR9LFxuXHRzZWxlY3RQYWdlOiAoZSk9Pntcblx0XHQkKCcjZW50ZXJVUkwgLnBhZ2VfYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdGZiLm5leHQgPSAnJztcblx0XHRsZXQgdGFyID0gJChlKTtcblx0XHR0YXIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdGlmICh0YXIuYXR0cignYXR0ci10eXBlJykgPT0gMSl7XG5cdFx0XHRmYi5zZXRUb2tlbih0YXIuYXR0cignYXR0ci12YWx1ZScpKTtcblx0XHR9XG5cdFx0ZmIuZmVlZCh0YXIuYXR0cignYXR0ci12YWx1ZScpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQpO1xuXHRcdHN0ZXAuc3RlcDEoKTtcblx0fSxcblx0c2V0VG9rZW46IChwYWdlaWQpPT57XG5cdFx0bGV0IHBhZ2VzID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbilbMV07XG5cdFx0Zm9yKGxldCBpIG9mIHBhZ2VzKXtcblx0XHRcdGlmIChpLmlkID09IHBhZ2VpZCl7XG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSBpLmFjY2Vzc190b2tlbjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGhpZGRlblN0YXJ0OiAoKT0+e1xuXHRcdGxldCBmYmlkID0gJCgnI3B1cmVfZmJpZCcpLnZhbCgpO1xuXHRcdGRhdGEuc3RhcnQoZmJpZCk7XG5cdH0sXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpPT57XG5cdFx0aWYgKGNsZWFyKXtcblx0XHRcdCQoJy5yZWNvbW1hbmRzLCAuZmVlZHMgdGJvZHknKS5lbXB0eSgpO1xuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5vZmYoJ2NsaWNrJykuY2xpY2soKCk9Pntcblx0XHRcdFx0bGV0IHRhciA9ICQoJyNlbnRlclVSTCBzZWxlY3QnKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKTtcblx0XHRcdFx0ZmIuZmVlZCh0YXIudmFsKCksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCwgZmFsc2UpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGxldCBjb21tYW5kID0gKHR5cGUgPT0gJzInKSA/ICdmZWVkJzoncG9zdHMnO1xuXHRcdGxldCBhcGk7XG5cdFx0aWYgKHVybCA9PSAnJyl7XG5cdFx0XHRhcGkgPSBgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZUlEfS8ke2NvbW1hbmR9P2ZpZWxkcz1saW5rLGZ1bGxfcGljdHVyZSxjcmVhdGVkX3RpbWUsbWVzc2FnZSZsaW1pdD0yNWA7XG5cdFx0fWVsc2V7XG5cdFx0XHRhcGkgPSB1cmw7XG5cdFx0fVxuXHRcdEZCLmFwaShhcGksIChyZXMpPT57XG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID09IDApe1xuXHRcdFx0XHQkKCcuZmVlZHMgLmJ0bicpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0XHR9XG5cdFx0XHRmYi5uZXh0ID0gcmVzLnBhZ2luZy5uZXh0O1xuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0bGV0IHN0ciA9IGdlbkRhdGEoaSk7XG5cdFx0XHRcdCQoJy5zZWN0aW9uIC5mZWVkcyB0Ym9keScpLmFwcGVuZChzdHIpO1xuXHRcdFx0XHRpZiAoaS5tZXNzYWdlICYmIGkubWVzc2FnZS5pbmRleE9mKCfmir0nKSA+PSAwKXtcblx0XHRcdFx0XHRsZXQgcmVjb21tYW5kID0gZ2VuQ2FyZChpKTtcblx0XHRcdFx0XHQkKCcuZG9uYXRlX2FyZWEgLnJlY29tbWFuZHMnKS5hcHBlbmQocmVjb21tYW5kKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gZ2VuRGF0YShvYmope1xuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XG5cdFx0XHRsZXQgbGluayA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJytpZHNbMF0rJy9wb3N0cy8nK2lkc1sxXTtcblxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcblx0XHRcdGxldCBzdHIgPSBgPHRyPlxuXHRcdFx0XHRcdFx0PHRkPjxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiAgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+PC90ZD5cblx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bWVzc308L2E+PC90ZD5cblx0XHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcihvYmouY3JlYXRlZF90aW1lKX08L3RkPlxuXHRcdFx0XHRcdFx0PC90cj5gO1xuXHRcdFx0cmV0dXJuIHN0cjtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2VuQ2FyZChvYmope1xuXHRcdFx0bGV0IHNyYyA9IG9iai5mdWxsX3BpY3R1cmUgfHwgJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzAweDIyNSc7XG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xuXHRcdFx0XG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xuXHRcdFx0bGV0XHRzdHIgPSBgPGRpdiBjbGFzcz1cImNhcmRcIj5cblx0XHRcdDxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZVwiPlxuXHRcdFx0PGZpZ3VyZSBjbGFzcz1cImltYWdlIGlzLTRieTNcIj5cblx0XHRcdDxpbWcgc3JjPVwiJHtzcmN9XCIgYWx0PVwiXCI+XG5cdFx0XHQ8L2ZpZ3VyZT5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PC9hPlxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtY29udGVudFwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cblx0XHRcdCR7bWVzc31cblx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+XG5cdFx0XHQ8L2Rpdj5gO1xuXHRcdFx0cmV0dXJuIHN0cjtcblx0XHR9XG5cdH0sXG5cdGdldE1lOiAoKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWVgLCAocmVzKT0+e1xuXHRcdFx0XHRsZXQgYXJyID0gW3Jlc107XG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXRQYWdlOiAoKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcyk9Pntcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0Z2V0R3JvdXA6ICgpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9ncm91cHM/bGltaXQ9MTAwYCwgKHJlcyk9Pntcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0ZXh0ZW5zaW9uQXV0aDogKGNvbW1hbmQgPSAnJyk9Pntcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UsIGNvbW1hbmQpO1xuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0fSxcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSwgY29tbWFuZCA9ICcnKT0+e1xuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XG5cdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xuXHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xuXHRcdFx0XHRkYXRhLnJhdy5leHRlbnNpb24gPSB0cnVlO1xuXHRcdFx0XHRpZiAoY29tbWFuZCA9PSAnaW1wb3J0Jyl7XG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaGFyZWRwb3N0c1wiLCAkKCcjaW1wb3J0JykudmFsKCkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCBleHRlbmQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2hhcmVkcG9zdHNcIikpO1xuXHRcdFx0XHRsZXQgZmlkID0gW107XG5cdFx0XHRcdGxldCBpZHMgPSBbXTtcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XG5cdFx0XHRcdFx0ZmlkLnB1c2goaS5mcm9tLmlkKTtcblx0XHRcdFx0XHRpZiAoZmlkLmxlbmd0aCA+PTQ1KXtcblx0XHRcdFx0XHRcdGlkcy5wdXNoKGZpZCk7XG5cdFx0XHRcdFx0XHRmaWQgPSBbXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWRzLnB1c2goZmlkKTtcblx0XHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXSwgbmFtZXMgPSB7fTtcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGlkcyl7XG5cdFx0XHRcdFx0bGV0IHByb21pc2UgPSBmYi5nZXROYW1lKGkpLnRoZW4oKHJlcyk9Pntcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBPYmplY3Qua2V5cyhyZXMpKXtcblx0XHRcdFx0XHRcdFx0bmFtZXNbaV0gPSByZXNbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0UHJvbWlzZS5hbGwocHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xuXHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xuXHRcdFx0XHRcdFx0aS5mcm9tLm5hbWUgPSBuYW1lc1tpLmZyb20uaWRdID8gbmFtZXNbaS5mcm9tLmlkXS5uYW1lIDogaS5mcm9tLm5hbWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRhdGEucmF3LmRhdGEuc2hhcmVkcG9zdHMgPSBleHRlbmQ7XG5cdFx0XHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRzd2FsKHtcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXG5cdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xuXHRcdFx0XHR9KS5kb25lKCk7XG5cdFx0XHR9XG5cdFx0fWVsc2V7XG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XG5cdFx0fVxuXHR9LFxuXHRnZXROYW1lOiAoaWRzKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vP2lkcz0ke2lkcy50b1N0cmluZygpfWAsIChyZXMpPT57XG5cdFx0XHRcdHJlc29sdmUocmVzKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG59XG5sZXQgc3RlcCA9IHtcblx0c3RlcDE6ICgpPT57XG5cdFx0JCgnLnNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc3RlcDInKTtcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XG5cdH0sXG5cdHN0ZXAyOiAoKT0+e1xuXHRcdCQoJy5yZWNvbW1hbmRzLCAuZmVlZHMgdGJvZHknKS5lbXB0eSgpO1xuXHRcdCQoJy5zZWN0aW9uJykuYWRkQ2xhc3MoJ3N0ZXAyJyk7XG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xuXHR9XG59XG5cbmxldCBkYXRhID0ge1xuXHRyYXc6IHt9LFxuXHRmaWx0ZXJlZDoge30sXG5cdHVzZXJpZDogJycsXG5cdG5vd0xlbmd0aDogMCxcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcblx0cHJvbWlzZV9hcnJheTogW10sXG5cdHRlc3Q6IChpZCk9Pntcblx0XHRjb25zb2xlLmxvZyhpZCk7XG5cdH0sXG5cdGluaXQ6ICgpPT57XG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcblx0XHRkYXRhLnByb21pc2VfYXJyYXkgPSBbXTtcblx0XHRkYXRhLnJhdyA9IFtdO1xuXHR9LFxuXHRzdGFydDogKGZiaWQpPT57XG5cdFx0ZGF0YS5pbml0KCk7XG5cdFx0bGV0IG9iaiA9IHtcblx0XHRcdGZ1bGxJRDogZmJpZFxuXHRcdH1cblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdGxldCBjb21tYW5kcyA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnLCdzaGFyZWRwb3N0cyddO1xuXHRcdGxldCB0ZW1wX2RhdGEgPSBvYmo7XG5cdFx0Zm9yKGxldCBpIG9mIGNvbW1hbmRzKXtcblx0XHRcdHRlbXBfZGF0YS5kYXRhID0ge307XG5cdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KHRlbXBfZGF0YSwgaSkudGhlbigocmVzKT0+e1xuXHRcdFx0XHR0ZW1wX2RhdGEuZGF0YVtpXSA9IHJlcztcblx0XHRcdH0pO1xuXHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XG5cdFx0fVxuXG5cdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XG5cdFx0XHRkYXRhLmZpbmlzaCh0ZW1wX2RhdGEpO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXQ6IChmYmlkLCBjb21tYW5kKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0bGV0IGRhdGFzID0gW107XG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xuXHRcdFx0bGV0IHNoYXJlRXJyb3IgPSAwO1xuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJykgY29tbWFuZCA9ICdncm91cCc7XG5cdFx0XHRpZiAoY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XG5cdFx0XHRcdGdldFNoYXJlKCk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2NvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2NvbW1hbmRdfSZvcmRlcj1jaHJvbm9sb2dpY2FsJmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtjb21tYW5kXS50b1N0cmluZygpfWAsKHJlcyk9Pntcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGQuZnJvbSl7XG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0Ly9ldmVudFxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xuXHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpe1xuXHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywnbGltaXQ9JytsaW1pdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGQuZnJvbSl7XG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0Ly9ldmVudFxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xuXHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpe1xuXHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZ2V0U2hhcmUoYWZ0ZXI9Jycpe1xuXHRcdFx0XHRsZXQgdXJsID0gYGh0dHBzOi8vYW02NmFoZ3RwOC5leGVjdXRlLWFwaS5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tL3NoYXJlP2ZiaWQ9JHtmYmlkLmZ1bGxJRH0mYWZ0ZXI9JHthZnRlcn1gO1xuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xuXHRcdFx0XHRcdGlmIChyZXMgPT09ICdlbmQnKXtcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvck1lc3NhZ2Upe1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcblx0XHRcdFx0XHRcdH1lbHNlIGlmKHJlcy5kYXRhKXtcblx0XHRcdFx0XHRcdFx0Ly8gc2hhcmVFcnJvciA9IDA7XG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IG5hbWUgPSAnJztcblx0XHRcdFx0XHRcdFx0XHRpZihpLnN0b3J5KXtcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBpLnN0b3J5LnN1YnN0cmluZygwLCBpLnN0b3J5LmluZGV4T2YoJyBzaGFyZWQnKSk7XG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lID0gaS5pZC5zdWJzdHJpbmcoMCwgaS5pZC5pbmRleE9mKFwiX1wiKSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGxldCBpZCA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xuXHRcdFx0XHRcdFx0XHRcdGkuZnJvbSA9IHtpZCwgbmFtZX07XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRnZXRTaGFyZShyZXMuYWZ0ZXIpO1xuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0ZmluaXNoOiAoZmJpZCk9Pntcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0c3RlcC5zdGVwMigpO1xuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xuXHRcdCQoJy5yZXN1bHRfYXJlYSA+IC50aXRsZSBzcGFuJykudGV4dChmYmlkLmZ1bGxJRCk7XG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmF3XCIsIEpTT04uc3RyaW5naWZ5KGZiaWQpKTtcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XG5cdH0sXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XG5cdFx0ZGF0YS5maWx0ZXJlZCA9IHt9O1xuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHJhd0RhdGEuZGF0YSkpe1xuXHRcdFx0aWYgKGtleSA9PT0gJ3JlYWN0aW9ucycpIGlzVGFnID0gZmFsc2U7XG5cdFx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLmRhdGFba2V5XSwga2V5LCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHRcblx0XHRcdGRhdGEuZmlsdGVyZWRba2V5XSA9IG5ld0RhdGE7XG5cdFx0fVxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSl7XG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbHRlcmVkKTtcblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybiBkYXRhLmZpbHRlcmVkO1xuXHRcdH1cblx0fSxcblx0ZXhjZWw6IChyYXcpPT57XG5cdFx0dmFyIG5ld09iaiA9IFtdO1xuXHRcdGlmIChkYXRhLmV4dGVuc2lvbil7XG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHR2YXIgdG1wID0ge1xuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxuXHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCIgOiB0aGlzLnBvc3RsaW5rLFxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxuXHRcdFx0XHRcdFwi6Kmy5YiG5Lqr6K6a5pW4XCIgOiB0aGlzLmxpa2VfY291bnRcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHR2YXIgdG1wID0ge1xuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxuXHRcdFx0XHRcdFwi5b+D5oOFXCIgOiB0aGlzLnR5cGUgfHwgJycsXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCIgOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxuXHRcdFx0XHR9XG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIG5ld09iajtcblx0fSxcblx0aW1wb3J0OiAoZmlsZSk9Pntcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcblx0XHR9XG5cblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcblx0fVxufVxuXG5sZXQgdGFibGUgPSB7XG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9Pntcblx0XHQkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XG5cdFx0bGV0IGZpbHRlcmVkID0gcmF3ZGF0YTtcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGZpbHRlcmVkKSl7XG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcblx0XHRcdGxldCB0Ym9keSA9ICcnO1xuXHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxuXHRcdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cblx0XHRcdFx0PHRkPuW/g+aDhTwvdGQ+YDtcblx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxuXHRcdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxuXHRcdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XG5cdFx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cblx0XHRcdFx0PHRkPuiumjwvdGQ+XG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcblx0XHRcdH1cblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xuXHRcdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xuXHRcdFx0XHRpZiAocGljKXtcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XG5cdFx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XG5cdFx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8IHZhbC5zdG9yeX08L2E+PC90ZD5cblx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cblx0XHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcblx0XHRcdFx0dGJvZHkgKz0gdHI7XG5cdFx0XHR9XG5cdFx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XG5cdFx0XHQkKFwiLnRhYmxlcyAuXCIra2V5K1wiIHRhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xuXHRcdH1cblx0XHRcblx0XHRhY3RpdmUoKTtcblx0XHR0YWIuaW5pdCgpO1xuXHRcdGNvbXBhcmUuaW5pdCgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdFx0bGV0IGFyciA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnLCdzaGFyZWRwb3N0cyddO1xuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dGFibGVcblx0XHRcdFx0XHQuY29sdW1ucygxKVxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcblx0XHRcdFx0XHQuZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0YWJsZVxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxuXHRcdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRyZWRvOiAoKT0+e1xuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcblx0fVxufVxuXG5sZXQgY29tcGFyZSA9IHtcblx0YW5kOiBbXSxcblx0b3I6IFtdLFxuXHRyYXc6IFtdLFxuXHRpbml0OiAoKT0+e1xuXHRcdGNvbXBhcmUuYW5kID0gW107XG5cdFx0Y29tcGFyZS5vciA9IFtdO1xuXHRcdGNvbXBhcmUucmF3ID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdGxldCBpZ25vcmUgPSAkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS52YWwoKTtcblx0XHRsZXQgYmFzZSA9IFtdO1xuXHRcdGxldCBmaW5hbCA9IFtdO1xuXHRcdGxldCBjb21wYXJlX251bSA9IDE7XG5cdFx0aWYgKGlnbm9yZSA9PT0gJ2lnbm9yZScpIGNvbXBhcmVfbnVtID0gMjtcblxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGNvbXBhcmUucmF3KSl7XG5cdFx0XHRpZiAoa2V5ICE9PSBpZ25vcmUpe1xuXHRcdFx0XHRmb3IobGV0IGkgb2YgY29tcGFyZS5yYXdba2V5XSl7XG5cdFx0XHRcdFx0YmFzZS5wdXNoKGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBzb3J0ID0gKGRhdGEucmF3LmV4dGVuc2lvbikgPyAnbmFtZSc6J2lkJztcblx0XHRiYXNlID0gYmFzZS5zb3J0KChhLGIpPT57XG5cdFx0XHRyZXR1cm4gYS5mcm9tW3NvcnRdID4gYi5mcm9tW3NvcnRdID8gMTotMTtcblx0XHR9KTtcblxuXHRcdGZvcihsZXQgaSBvZiBiYXNlKXtcblx0XHRcdGkubWF0Y2ggPSAwO1xuXHRcdH1cblxuXHRcdGxldCB0ZW1wID0gJyc7XG5cdFx0bGV0IHRlbXBfbmFtZSA9ICcnO1xuXHRcdC8vIGNvbnNvbGUubG9nKGJhc2UpO1xuXHRcdGZvcihsZXQgaSBpbiBiYXNlKXtcblx0XHRcdGxldCBvYmogPSBiYXNlW2ldO1xuXHRcdFx0aWYgKG9iai5mcm9tLmlkID09IHRlbXAgfHwgKGRhdGEucmF3LmV4dGVuc2lvbiAmJiAob2JqLmZyb20ubmFtZSA9PSB0ZW1wX25hbWUpKSl7XG5cdFx0XHRcdGxldCB0YXIgPSBmaW5hbFtmaW5hbC5sZW5ndGgtMV07XG5cdFx0XHRcdHRhci5tYXRjaCsrO1xuXHRcdFx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKXtcblx0XHRcdFx0XHRpZiAoIXRhcltrZXldKSB0YXJba2V5XSA9IG9ialtrZXldOyAvL+WQiOS9teizh+aWmVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0YXIubWF0Y2ggPT0gY29tcGFyZV9udW0pe1xuXHRcdFx0XHRcdHRlbXBfbmFtZSA9ICcnO1xuXHRcdFx0XHRcdHRlbXAgPSAnJztcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGZpbmFsLnB1c2gob2JqKTtcblx0XHRcdFx0dGVtcCA9IG9iai5mcm9tLmlkO1xuXHRcdFx0XHR0ZW1wX25hbWUgPSBvYmouZnJvbS5uYW1lO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdFxuXHRcdGNvbXBhcmUub3IgPSBmaW5hbDtcblx0XHRjb21wYXJlLmFuZCA9IGNvbXBhcmUub3IuZmlsdGVyKCh2YWwpPT57XG5cdFx0XHRyZXR1cm4gdmFsLm1hdGNoID09IGNvbXBhcmVfbnVtO1xuXHRcdH0pO1xuXHRcdGNvbXBhcmUuZ2VuZXJhdGUoKTtcblx0fSxcblx0Z2VuZXJhdGU6ICgpPT57XG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcblx0XHRsZXQgZGF0YV9hbmQgPSBjb21wYXJlLmFuZDtcblxuXHRcdGxldCB0Ym9keSA9ICcnO1xuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9hbmQuZW50cmllcygpKXtcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnMCd9PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XG5cdFx0XHR0Ym9keSArPSB0cjtcblx0XHR9XG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLmFuZCB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xuXG5cdFx0bGV0IGRhdGFfb3IgPSBjb21wYXJlLm9yO1xuXHRcdGxldCB0Ym9keTIgPSAnJztcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfb3IuZW50cmllcygpKXtcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnJ308L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcblx0XHRcdHRib2R5MiArPSB0cjtcblx0XHR9XG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLm9yIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keTIpO1xuXHRcdFxuXHRcdGFjdGl2ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKHtcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXG5cdFx0XHR9KTtcblx0XHRcdGxldCBhcnIgPSBbJ2FuZCcsJ29yJ107XG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0YWJsZVxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxuXHRcdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHRhYmxlXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXG5cdFx0XHRcdFx0LmRyYXcoKTtcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxubGV0IGNob29zZSA9IHtcblx0ZGF0YTogW10sXG5cdGF3YXJkOiBbXSxcblx0bnVtOiAwLFxuXHRkZXRhaWw6IGZhbHNlLFxuXHRsaXN0OiBbXSxcblx0aW5pdDogKGN0cmwgPSBmYWxzZSk9Pntcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xuXHRcdGNob29zZS5saXN0ID0gW107XG5cdFx0Y2hvb3NlLm51bSA9IDA7XG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XG5cdFx0XHRcdGlmIChuID4gMCl7XG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1lbHNle1xuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcblx0XHR9XG5cdFx0Y2hvb3NlLmdvKGN0cmwpO1xuXHR9LFxuXHRnbzogKGN0cmwpPT57XG5cdFx0bGV0IGNvbW1hbmQgPSB0YWIubm93O1xuXHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcblx0XHR9ZWxzZXtcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhW2NvbW1hbmRdLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHRcblx0XHR9XG5cdFx0bGV0IGluc2VydCA9ICcnO1xuXHRcdGxldCB0ZW1wQXJyID0gW107XG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5jb2x1bW4oMikuZGF0YSgpLmVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KXtcblx0XHRcdFx0bGV0IHdvcmQgPSAkKCcuc2VhcmNoQ29tbWVudCcpLnZhbCgpO1xuXHRcdFx0XHRpZiAodmFsdWUuaW5kZXhPZih3b3JkKSA+PSAwKSB0ZW1wQXJyLnB1c2goaW5kZXgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGZvcihsZXQgaSBvZiBjaG9vc2UuYXdhcmQpe1xuXHRcdFx0bGV0IHJvdyA9ICh0ZW1wQXJyLmxlbmd0aCA9PSAwKSA/IGk6dGVtcEFycltpXTtcblx0XHRcdGxldCB0YXIgPSAkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLnJvdyhyb3cpLm5vZGUoKS5pbm5lckhUTUw7XG5cdFx0XHRpbnNlcnQgKz0gJzx0cj4nICsgdGFyICsgJzwvdHI+Jztcblx0XHR9XG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcblx0XHRpZiAoIWN0cmwpe1xuXHRcdFx0JChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHQvLyBsZXQgdGFyID0gJCh0aGlzKS5maW5kKCd0ZCcpLmVxKDEpO1xuXHRcdFx0XHQvLyBsZXQgaWQgPSB0YXIuZmluZCgnYScpLmF0dHIoJ2F0dHItZmJpZCcpO1xuXHRcdFx0XHQvLyB0YXIucHJlcGVuZChgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcblxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xuXHRcdFx0bGV0IG5vdyA9IDA7XG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI3XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xuXHRcdFx0fVxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xuXHRcdH1cblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XG5cdH1cbn1cblxubGV0IGZpbHRlciA9IHtcblx0dG90YWxGaWx0ZXI6IChyYXcsIGNvbW1hbmQsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIGVuZFRpbWUpPT57XG5cdFx0bGV0IGRhdGEgPSByYXc7XG5cdFx0aWYgKGlzRHVwbGljYXRlKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xuXHRcdH1cblx0XHRpZiAod29yZCAhPT0gJycgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcblx0XHR9XG5cdFx0aWYgKGlzVGFnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcblx0XHR9XG5cdFx0aWYgKGNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBlbmRUaW1lKTtcblx0XHR9ZWxzZXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9LFxuXHR1bmlxdWU6IChkYXRhKT0+e1xuXHRcdGxldCBvdXRwdXQgPSBbXTtcblx0XHRsZXQga2V5cyA9IFtdO1xuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xuXHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9LFxuXHR3b3JkOiAoZGF0YSwgd29yZCk9Pntcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSl7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBuZXdBcnk7XG5cdH0sXG5cdHRhZzogKGRhdGEpPT57XG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0dGltZTogKGRhdGEsIHQpPT57XG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XG5cdFx0bGV0IHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIil7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBuZXdBcnk7XG5cdH0sXG5cdHJlYWN0OiAoZGF0YSwgdGFyKT0+e1xuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xuXHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0fWVsc2V7XG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xuXHRcdH1cblx0fVxufVxuXG5sZXQgdWkgPSB7XG5cdGluaXQ6ICgpPT57XG5cblx0fVxufVxuXG5sZXQgdGFiID0ge1xuXHRub3c6IFwiY29tbWVudHNcIixcblx0aW5pdDogKCk9Pntcblx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdHRhYi5ub3cgPSAkKHRoaXMpLmF0dHIoJ2F0dHItdHlwZScpO1xuXHRcdFx0bGV0IHRhciA9ICQodGhpcykuaW5kZXgoKTtcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHQkKCcudGFibGVzID4gZGl2JykuZXEodGFyKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcblx0XHRcdFx0Y29tcGFyZS5pbml0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuXG5cbmZ1bmN0aW9uIG5vd0RhdGUoKXtcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XG59XG5cbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XG4gICAgIGlmIChkYXRlIDwgMTApe1xuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xuICAgICB9XG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xuICAgICBpZiAoaG91ciA8IDEwKXtcbiAgICAgXHRob3VyID0gXCIwXCIraG91cjtcbiAgICAgfVxuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XG4gICAgIGlmIChtaW4gPCAxMCl7XG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xuICAgICB9XG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcbiAgICAgaWYgKHNlYyA8IDEwKXtcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XG4gICAgIH1cbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XG4gICAgIHJldHVybiB0aW1lO1xuIH1cblxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XG4gXHR9KTtcbiBcdHJldHVybiBhcnJheTtcbiB9XG5cbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XG4gXHR2YXIgaSwgciwgdDtcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xuIFx0XHRhcnlbaV0gPSBpO1xuIFx0fVxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcbiBcdFx0dCA9IGFyeVtyXTtcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xuIFx0XHRhcnlbaV0gPSB0O1xuIFx0fVxuIFx0cmV0dXJuIGFyeTtcbiB9XG5cbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcbiAgICBcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxuICAgIFxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xuXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xuICAgICAgICBcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XG4gICAgICAgIH1cblxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xuICAgICAgICBcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XG4gICAgfVxuICAgIFxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcm93ID0gXCJcIjtcbiAgICAgICAgXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XG4gICAgICAgIH1cblxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xuICAgICAgICBcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcbiAgICB9XG5cbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9ICAgXG4gICAgXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcbiAgICBcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XG4gICAgXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxuICAgIFxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcbiAgICBsaW5rLmhyZWYgPSB1cmk7XG4gICAgXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xuICAgIFxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICBsaW5rLmNsaWNrKCk7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcbn0iXX0=
