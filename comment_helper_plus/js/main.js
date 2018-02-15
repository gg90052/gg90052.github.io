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

	var hash = location.hash;
	if (hash.indexOf("clear") >= 0) {
		localStorage.removeItem('raw');
		sessionStorage.removeItem('login');
		alert('已清除暫存，請重新進行登入');
		location.href = 'https://gg90052.github.io/comment_helper_plus';
	}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJoYXNoIiwibG9jYXRpb24iLCJpbmRleE9mIiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInNlc3Npb25TdG9yYWdlIiwiYWxlcnQiLCJocmVmIiwibGFzdERhdGEiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwiZGF0YSIsImZpbmlzaCIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJlIiwiY3RybEtleSIsImFsdEtleSIsImV4dGVuc2lvbkF1dGgiLCJnZXRBdXRoIiwiY2hvb3NlIiwiaW5pdCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJhcHBlbmQiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJjb25maWciLCJmaWx0ZXIiLCJyZWFjdCIsInZhbCIsImNvbXBhcmUiLCJkYXRlcmFuZ2VwaWNrZXIiLCJzdGFydCIsImVuZCIsImxhYmVsIiwiZW5kVGltZSIsImZvcm1hdCIsInNldFN0YXJ0RGF0ZSIsIm5vd0RhdGUiLCJmaWx0ZXJEYXRhIiwicmF3IiwiZGQiLCJ0YWIiLCJub3ciLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpa2VzIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJuZXdlc3QiLCJ3b3JkIiwib3JkZXIiLCJhdXRoIiwiZXh0ZW5zaW9uIiwicGFnZVRva2VuIiwibmV4dCIsInR5cGUiLCJGQiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsInN3YWwiLCJkb25lIiwiZmJpZCIsIlByb21pc2UiLCJhbGwiLCJnZXRNZSIsImdldFBhZ2UiLCJnZXRHcm91cCIsInRoZW4iLCJyZXMiLCJvcHRpb25zIiwiaSIsImoiLCJpZCIsIm5hbWUiLCJodG1sIiwic2VsZWN0UGFnZSIsInRhciIsImF0dHIiLCJzZXRUb2tlbiIsInN0ZXAiLCJzdGVwMSIsInBhZ2VpZCIsInBhZ2VzIiwiYWNjZXNzX3Rva2VuIiwiaGlkZGVuU3RhcnQiLCJwYWdlSUQiLCJjbGVhciIsImVtcHR5IiwiZmluZCIsImNvbW1hbmQiLCJhcGkiLCJwYWdpbmciLCJzdHIiLCJnZW5EYXRhIiwibWVzc2FnZSIsInJlY29tbWFuZCIsImdlbkNhcmQiLCJvYmoiLCJpZHMiLCJzcGxpdCIsImxpbmsiLCJtZXNzIiwicmVwbGFjZSIsInRpbWVDb252ZXJ0ZXIiLCJjcmVhdGVkX3RpbWUiLCJzcmMiLCJmdWxsX3BpY3R1cmUiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJyIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJzZXRJdGVtIiwiZXh0ZW5kIiwiZmlkIiwicHVzaCIsImZyb20iLCJwcm9taXNlX2FycmF5IiwibmFtZXMiLCJwcm9taXNlIiwiZ2V0TmFtZSIsIk9iamVjdCIsImtleXMiLCJ0aXRsZSIsInRvU3RyaW5nIiwic2Nyb2xsVG9wIiwic3RlcDIiLCJmaWx0ZXJlZCIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInRlc3QiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImZ1bGxJRCIsImNvbW1hbmRzIiwidGVtcF9kYXRhIiwiZ2V0IiwiZGF0YXMiLCJzaGFyZUVycm9yIiwiZ2V0U2hhcmUiLCJkIiwidXBkYXRlZF90aW1lIiwiZ2V0TmV4dCIsImdldEpTT04iLCJmYWlsIiwiYWZ0ZXIiLCJzdG9yeSIsInN1YnN0cmluZyIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwia2V5IiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwibGlrZV9jb3VudCIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsInBpYyIsInRoZWFkIiwidGJvZHkiLCJlbnRyaWVzIiwicGljdHVyZSIsInRkIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYW5kIiwib3IiLCJpZ25vcmUiLCJiYXNlIiwiZmluYWwiLCJjb21wYXJlX251bSIsInNvcnQiLCJhIiwiYiIsIm1hdGNoIiwidGVtcCIsInRlbXBfbmFtZSIsImRhdGFfYW5kIiwiZGF0YV9vciIsInRib2R5MiIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsImN0cmwiLCJuIiwicGFyc2VJbnQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsInRlbXBBcnIiLCJjb2x1bW4iLCJpbmRleCIsInJvdyIsIm5vZGUiLCJpbm5lckhUTUwiLCJrIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0IiwiZm9yRWFjaCIsIml0ZW0iLCJuZXdBcnkiLCJncmVwIiwibWVzc2FnZV90YWdzIiwidCIsInRpbWVfYXJ5IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwidWkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJtYXAiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFlQyxTQUFmOztBQUVBLFNBQVNBLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXVCQyxHQUF2QixFQUEyQkMsQ0FBM0IsRUFDQTtBQUNDLEtBQUksQ0FBQ04sWUFBTCxFQUFrQjtBQUNqQk8sVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWdELDRCQUFoRDtBQUNBQyxJQUFFLGlCQUFGLEVBQXFCQyxNQUFyQjtBQUNBVixpQkFBZSxJQUFmO0FBQ0E7QUFDRCxRQUFPLEtBQVA7QUFDQTtBQUNEUyxFQUFFRSxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUMzQixLQUFJQyxXQUFXLENBQWY7QUFDQUosR0FBRSxRQUFGLEVBQVlLLEtBQVosQ0FBa0IsWUFBVTtBQUMzQkQ7QUFDQSxNQUFJQSxZQUFZLENBQWhCLEVBQWtCO0FBQ2pCSixLQUFFLFFBQUYsRUFBWU0sR0FBWixDQUFnQixPQUFoQjtBQUNBTixLQUFFLDBCQUFGLEVBQThCTyxXQUE5QixDQUEwQyxNQUExQztBQUNBO0FBQ0QsRUFORDs7QUFRQSxLQUFJQyxPQUFPQyxTQUFTRCxJQUFwQjtBQUNBLEtBQUlBLEtBQUtFLE9BQUwsQ0FBYSxPQUFiLEtBQXlCLENBQTdCLEVBQStCO0FBQzlCQyxlQUFhQyxVQUFiLENBQXdCLEtBQXhCO0FBQ0FDLGlCQUFlRCxVQUFmLENBQTBCLE9BQTFCO0FBQ0FF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QUFqQztBQUNIOztBQUVEQyxNQUFJZ0QsS0FBSixDQUFVLENBQVYsRUFBYWhELElBQUk1TCxNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQTJPLFNBQU8vQyxNQUFNLE1BQWI7QUFDSDs7QUFFRCxLQUFJK0MsT0FBTyxFQUFYLEVBQWU7QUFDWDVSLFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJOFIsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWUwsWUFBWTNKLE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUlpSyxNQUFNLHVDQUF1Q0MsVUFBVUosR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUloSyxPQUFPeEksU0FBUzZTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBckssTUFBSzNILElBQUwsR0FBWThSLEdBQVo7O0FBRUE7QUFDQW5LLE1BQUtzSyxLQUFMLEdBQWEsbUJBQWI7QUFDQXRLLE1BQUt1SyxRQUFMLEdBQWdCTCxXQUFXLE1BQTNCOztBQUVBO0FBQ0ExUyxVQUFTZ1QsSUFBVCxDQUFjQyxXQUFkLENBQTBCekssSUFBMUI7QUFDQUEsTUFBS3JJLEtBQUw7QUFDQUgsVUFBU2dULElBQVQsQ0FBY0UsV0FBZCxDQUEwQjFLLElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxuXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxue1xuXHRpZiAoIWVycm9yTWVzc2FnZSl7XG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1x0XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0bGV0IGhpZGVhcmVhID0gMDtcblx0JCgnaGVhZGVyJykuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRoaWRlYXJlYSsrO1xuXHRcdGlmIChoaWRlYXJlYSA+PSA1KXtcblx0XHRcdCQoJ2hlYWRlcicpLm9mZignY2xpY2snKTtcblx0XHRcdCQoJyNmYmlkX2J1dHRvbiwgI3B1cmVfZmJpZCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0fVxuXHR9KTtcblxuXHRsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2g7XG5cdGlmIChoYXNoLmluZGV4T2YoXCJjbGVhclwiKSA+PSAwKXtcblx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncmF3Jyk7XG5cdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnbG9naW4nKTtcblx0XHRhbGVydCgn5bey5riF6Zmk5pqr5a2Y77yM6KuL6YeN5paw6YCy6KGM55m75YWlJyk7XG5cdFx0bG9jYXRpb24uaHJlZiA9ICdodHRwczovL2dnOTAwNTIuZ2l0aHViLmlvL2NvbW1lbnRfaGVscGVyX3BsdXMnO1xuXHR9XG5cdGxldCBsYXN0RGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyYXdcIikpO1xuXG5cdGlmIChsYXN0RGF0YSl7XG5cdFx0ZGF0YS5maW5pc2gobGFzdERhdGEpO1xuXHR9XG5cdGlmIChzZXNzaW9uU3RvcmFnZS5sb2dpbil7XG5cdFx0ZmIuZ2VuT3B0aW9uKEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pKTtcblx0fVxuXG5cdCQoXCIudGFibGVzID4gLnNoYXJlZHBvc3RzIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcblx0XHRcdGZiLmV4dGVuc2lvbkF1dGgoJ2ltcG9ydCcpO1xuXHRcdH1lbHNle1xuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xuXHRcdH1cblx0fSk7XG5cdFxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xuXHR9KTtcblxuXHQkKFwiI2J0bl9zdGFydFwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XG5cdH0pO1xuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XG5cdFx0XHRjaG9vc2UuaW5pdCh0cnVlKTtcblx0XHR9ZWxzZXtcblx0XHRcdGNob29zZS5pbml0KCk7XG5cdFx0fVxuXHR9KTtcblx0XG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xuXHRcdH1cblx0fSk7XG5cblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdH1lbHNle1xuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XG5cdH0pO1xuXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uKGUpe1xuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XG5cdFx0fVxuXHR9KTtcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uKGUpe1xuXHRcdGlmICghZS5jdHJsS2V5IHx8ICFlLmFsdEtleSl7XG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6RVhDRUxcIik7XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xuXHRcdHRhYmxlLnJlZG8oKTtcblx0fSk7XG5cblx0JChcIi50YWJsZXMgLmZpbHRlcnMgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbigpe1xuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xuXHRcdHRhYmxlLnJlZG8oKTtcblx0fSk7XG5cblx0JCgnLnRhYmxlcyAudG90YWwgLmZpbHRlcnMgc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdFx0Y29tcGFyZS5pbml0KCk7XG5cdH0pO1xuXG5cdCQoJy5jb21wYXJlX2NvbmRpdGlvbicpLmNoYW5nZShmdW5jdGlvbigpe1xuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlJykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS4nKyAkKHRoaXMpLnZhbCgpKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuXHR9KTtcblxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcblx0XHRcInNpbmdsZURhdGVQaWNrZXJcIjogdHJ1ZSxcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcblx0XHRcImxvY2FsZVwiOiB7XG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVktTU0tREQgICBISDptbVwiLFxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcblx0XHRcdFwi5pelXCIsXG5cdFx0XHRcIuS4gFwiLFxuXHRcdFx0XCLkuoxcIixcblx0XHRcdFwi5LiJXCIsXG5cdFx0XHRcIuWbm1wiLFxuXHRcdFx0XCLkupRcIixcblx0XHRcdFwi5YWtXCJcblx0XHRcdF0sXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xuXHRcdFx0XCLkuIDmnIhcIixcblx0XHRcdFwi5LqM5pyIXCIsXG5cdFx0XHRcIuS4ieaciFwiLFxuXHRcdFx0XCLlm5vmnIhcIixcblx0XHRcdFwi5LqU5pyIXCIsXG5cdFx0XHRcIuWFreaciFwiLFxuXHRcdFx0XCLkuIPmnIhcIixcblx0XHRcdFwi5YWr5pyIXCIsXG5cdFx0XHRcIuS5neaciFwiLFxuXHRcdFx0XCLljYHmnIhcIixcblx0XHRcdFwi5Y2B5LiA5pyIXCIsXG5cdFx0XHRcIuWNgeS6jOaciFwiXG5cdFx0XHRdLFxuXHRcdFx0XCJmaXJzdERheVwiOiAxXG5cdFx0fSxcblx0fSxmdW5jdGlvbihzdGFydCwgZW5kLCBsYWJlbCkge1xuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xuXHRcdHRhYmxlLnJlZG8oKTtcblx0fSk7XG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUobm93RGF0ZSgpKTtcblxuXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdGlmIChlLmN0cmxLZXkpe1xuXHRcdFx0bGV0IGRkO1xuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YVt0YWIubm93XSk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgZGQ7XG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcblx0XHRcdHdpbmRvdy5mb2N1cygpO1xuXHRcdH1lbHNle1xuXHRcdFx0aWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCl7XG5cdFx0XHRcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xuXHRcdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YVt0YWIubm93XSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XG5cdH0pO1xuXG5cdGxldCBjaV9jb3VudGVyID0gMDtcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRjaV9jb3VudGVyKys7XG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSl7XG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdH1cblx0XHRpZihlLmN0cmxLZXkpe1xuXHRcdFx0ZmIuZ2V0QXV0aCgnc2hhcmVkcG9zdHMnKTtcblx0XHR9XG5cdH0pO1xuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xuXHR9KTtcbn0pO1xuXG5sZXQgY29uZmlnID0ge1xuXHRmaWVsZDoge1xuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCdtZXNzYWdlX3RhZ3MnLCdtZXNzYWdlJywnZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxuXHRcdHJlYWN0aW9uczogW10sXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxuXHRcdHVybF9jb21tZW50czogW10sXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCdmcm9tJywnbWVzc2FnZScsJ3N0b3J5J10sXG5cdFx0bGlrZXM6IFsnbmFtZSddXG5cdH0sXG5cdGxpbWl0OiB7XG5cdFx0Y29tbWVudHM6ICc1MDAnLFxuXHRcdHJlYWN0aW9uczogJzUwMCcsXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXG5cdFx0ZmVlZDogJzUwMCcsXG5cdFx0bGlrZXM6ICc1MDAnXG5cdH0sXG5cdGFwaVZlcnNpb246IHtcblx0XHRjb21tZW50czogJ3YyLjcnLFxuXHRcdHJlYWN0aW9uczogJ3YyLjcnLFxuXHRcdHNoYXJlZHBvc3RzOiAndjIuMycsXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuNycsXG5cdFx0ZmVlZDogJ3YyLjknLFxuXHRcdGdyb3VwOiAndjIuOScsXG5cdFx0bmV3ZXN0OiAndjIuOCdcblx0fSxcblx0ZmlsdGVyOiB7XG5cdFx0d29yZDogJycsXG5cdFx0cmVhY3Q6ICdhbGwnLFxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxuXHR9LFxuXHRvcmRlcjogJycsXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLHVzZXJfbWFuYWdlZF9ncm91cHMsbWFuYWdlX3BhZ2VzJyxcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcblx0cGFnZVRva2VuOiAnJyxcbn1cblxubGV0IGZiID0ge1xuXHRuZXh0OiAnJyxcblx0Z2V0QXV0aDogKHR5cGUpPT57XG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XG5cdH0sXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIil7XG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcblx0XHRcdFx0XHRmYi5zdGFydCgpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRzd2FsKFxuXHRcdFx0XHRcdFx0J+aOiOasiuWkseaVl++8jOiri+e1puS6iOaJgOacieasiumZkCcsXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xuXHRcdFx0XHRcdFx0KS5kb25lKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNle1xuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHRcdFx0XG5cdFx0XHR9XG5cdFx0fWVsc2V7XG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XG5cdFx0fVxuXHR9LFxuXHRzdGFydDogKCk9Pntcblx0XHRQcm9taXNlLmFsbChbZmIuZ2V0TWUoKSxmYi5nZXRQYWdlKCksIGZiLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5sb2dpbiA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XG5cdFx0XHRmYi5nZW5PcHRpb24ocmVzKTtcblx0XHR9KTtcblx0fSxcblx0Z2VuT3B0aW9uOiAocmVzKT0+e1xuXHRcdGZiLm5leHQgPSAnJztcblx0XHRsZXQgb3B0aW9ucyA9IGA8aW5wdXQgaWQ9XCJwdXJlX2ZiaWRcIiBjbGFzcz1cImhpZGVcIj48YnV0dG9uIGlkPVwiZmJpZF9idXR0b25cIiBjbGFzcz1cImJ0biBoaWRlXCIgb25jbGljaz1cImZiLmhpZGRlblN0YXJ0KClcIj7nlLFGQklE5pO35Y+WPC9idXR0b24+PGJyPmA7XG5cdFx0bGV0IHR5cGUgPSAtMTtcblx0XHQkKCcjYnRuX3N0YXJ0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcblx0XHRcdHR5cGUrKztcblx0XHRcdGZvcihsZXQgaiBvZiBpKXtcblx0XHRcdFx0b3B0aW9ucyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgYXR0ci10eXBlPVwiJHt0eXBlfVwiIGF0dHItdmFsdWU9XCIke2ouaWR9XCIgb25jbGljaz1cImZiLnNlbGVjdFBhZ2UodGhpcylcIj4ke2oubmFtZX08L2Rpdj5gO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQkKCcjZW50ZXJVUkwnKS5odG1sKG9wdGlvbnMpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdH0sXG5cdHNlbGVjdFBhZ2U6IChlKT0+e1xuXHRcdCQoJyNlbnRlclVSTCAucGFnZV9idG4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0ZmIubmV4dCA9ICcnO1xuXHRcdGxldCB0YXIgPSAkKGUpO1xuXHRcdHRhci5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0aWYgKHRhci5hdHRyKCdhdHRyLXR5cGUnKSA9PSAxKXtcblx0XHRcdGZiLnNldFRva2VuKHRhci5hdHRyKCdhdHRyLXZhbHVlJykpO1xuXHRcdH1cblx0XHRmYi5mZWVkKHRhci5hdHRyKCdhdHRyLXZhbHVlJyksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCk7XG5cdFx0c3RlcC5zdGVwMSgpO1xuXHR9LFxuXHRzZXRUb2tlbjogKHBhZ2VpZCk9Pntcblx0XHRsZXQgcGFnZXMgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKVsxXTtcblx0XHRmb3IobGV0IGkgb2YgcGFnZXMpe1xuXHRcdFx0aWYgKGkuaWQgPT0gcGFnZWlkKXtcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IGkuYWNjZXNzX3Rva2VuO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0aGlkZGVuU3RhcnQ6ICgpPT57XG5cdFx0bGV0IGZiaWQgPSAkKCcjcHVyZV9mYmlkJykudmFsKCk7XG5cdFx0ZGF0YS5zdGFydChmYmlkKTtcblx0fSxcblx0ZmVlZDogKHBhZ2VJRCwgdHlwZSwgdXJsID0gJycsIGNsZWFyID0gdHJ1ZSk9Pntcblx0XHRpZiAoY2xlYXIpe1xuXHRcdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLm9mZignY2xpY2snKS5jbGljaygoKT0+e1xuXHRcdFx0XHRsZXQgdGFyID0gJCgnI2VudGVyVVJMIHNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xuXHRcdFx0XHRmYi5mZWVkKHRhci52YWwoKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0LCBmYWxzZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0bGV0IGNvbW1hbmQgPSAodHlwZSA9PSAnMicpID8gJ2ZlZWQnOidwb3N0cyc7XG5cdFx0bGV0IGFwaTtcblx0XHRpZiAodXJsID09ICcnKXtcblx0XHRcdGFwaSA9IGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlSUR9LyR7Y29tbWFuZH0/ZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTI1YDtcblx0XHR9ZWxzZXtcblx0XHRcdGFwaSA9IHVybDtcblx0XHR9XG5cdFx0RkIuYXBpKGFwaSwgKHJlcyk9Pntcblx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPT0gMCl7XG5cdFx0XHRcdCQoJy5mZWVkcyAuYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRcdH1cblx0XHRcdGZiLm5leHQgPSByZXMucGFnaW5nLm5leHQ7XG5cdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRsZXQgc3RyID0gZ2VuRGF0YShpKTtcblx0XHRcdFx0JCgnLnNlY3Rpb24gLmZlZWRzIHRib2R5JykuYXBwZW5kKHN0cik7XG5cdFx0XHRcdGlmIChpLm1lc3NhZ2UgJiYgaS5tZXNzYWdlLmluZGV4T2YoJ+aKvScpID49IDApe1xuXHRcdFx0XHRcdGxldCByZWNvbW1hbmQgPSBnZW5DYXJkKGkpO1xuXHRcdFx0XHRcdCQoJy5kb25hdGVfYXJlYSAucmVjb21tYW5kcycpLmFwcGVuZChyZWNvbW1hbmQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRmdW5jdGlvbiBnZW5EYXRhKG9iail7XG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xuXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xuXHRcdFx0bGV0IHN0ciA9IGA8dHI+XG5cdFx0XHRcdFx0XHQ8dGQ+PGRpdiBjbGFzcz1cInBpY2tcIiBhdHRyLXZhbD1cIiR7b2JqLmlkfVwiICBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj48L3RkPlxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzfTwvYT48L3RkPlxuXHRcdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKG9iai5jcmVhdGVkX3RpbWUpfTwvdGQ+XG5cdFx0XHRcdFx0XHQ8L3RyPmA7XG5cdFx0XHRyZXR1cm4gc3RyO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZW5DYXJkKG9iail7XG5cdFx0XHRsZXQgc3JjID0gb2JqLmZ1bGxfcGljdHVyZSB8fCAnaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4MjI1Jztcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XG5cdFx0XHRcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XG5cdFx0XHRsZXRcdHN0ciA9IGA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxuXHRcdFx0PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWltYWdlXCI+XG5cdFx0XHQ8ZmlndXJlIGNsYXNzPVwiaW1hZ2UgaXMtNGJ5M1wiPlxuXHRcdFx0PGltZyBzcmM9XCIke3NyY31cIiBhbHQ9XCJcIj5cblx0XHRcdDwvZmlndXJlPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2E+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1jb250ZW50XCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxuXHRcdFx0JHttZXNzfVxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj5cblx0XHRcdDwvZGl2PmA7XG5cdFx0XHRyZXR1cm4gc3RyO1xuXHRcdH1cblx0fSxcblx0Z2V0TWU6ICgpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XG5cdFx0XHRcdGxldCBhcnIgPSBbcmVzXTtcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdGdldFBhZ2U6ICgpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXRHcm91cDogKCk9Pntcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9Pntcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9saW1pdD0xMDBgLCAocmVzKT0+e1xuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRleHRlbnNpb25BdXRoOiAoY29tbWFuZCA9ICcnKT0+e1xuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSwgY29tbWFuZCk7XG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHR9LFxuXHRleHRlbnNpb25DYWxsYmFjazogKHJlc3BvbnNlLCBjb21tYW5kID0gJycpPT57XG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcblx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XG5cdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCdtYW5hZ2VfcGFnZXMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9tYW5hZ2VkX2dyb3VwcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XG5cdFx0XHRcdGRhdGEucmF3LmV4dGVuc2lvbiA9IHRydWU7XG5cdFx0XHRcdGlmIChjb21tYW5kID09ICdpbXBvcnQnKXtcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNoYXJlZHBvc3RzXCIsICQoJyNpbXBvcnQnKS52YWwoKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IGV4dGVuZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaGFyZWRwb3N0c1wiKSk7XG5cdFx0XHRcdGxldCBmaWQgPSBbXTtcblx0XHRcdFx0bGV0IGlkcyA9IFtdO1xuXHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcblx0XHRcdFx0XHRmaWQucHVzaChpLmZyb20uaWQpO1xuXHRcdFx0XHRcdGlmIChmaWQubGVuZ3RoID49NDUpe1xuXHRcdFx0XHRcdFx0aWRzLnB1c2goZmlkKTtcblx0XHRcdFx0XHRcdGZpZCA9IFtdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZHMucHVzaChmaWQpO1xuXHRcdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdLCBuYW1lcyA9IHt9O1xuXHRcdFx0XHRmb3IobGV0IGkgb2YgaWRzKXtcblx0XHRcdFx0XHRsZXQgcHJvbWlzZSA9IGZiLmdldE5hbWUoaSkudGhlbigocmVzKT0+e1xuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIE9iamVjdC5rZXlzKHJlcykpe1xuXHRcdFx0XHRcdFx0XHRuYW1lc1tpXSA9IHJlc1tpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRwcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRQcm9taXNlLmFsbChwcm9taXNlX2FycmF5KS50aGVuKCgpPT57XG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XG5cdFx0XHRcdFx0XHRpLmZyb20ubmFtZSA9IG5hbWVzW2kuZnJvbS5pZF0gPyBuYW1lc1tpLmZyb20uaWRdLm5hbWUgOiBpLmZyb20ubmFtZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZGF0YS5yYXcuZGF0YS5zaGFyZWRwb3N0cyA9IGV4dGVuZDtcblx0XHRcdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHN3YWwoe1xuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXG5cdFx0XHRcdH0pLmRvbmUoKTtcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0XHR9XG5cdH0sXG5cdGdldE5hbWU6IChpZHMpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9Pntcblx0XHRcdFx0cmVzb2x2ZShyZXMpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cbn1cbmxldCBzdGVwID0ge1xuXHRzdGVwMTogKCk9Pntcblx0XHQkKCcuc2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzdGVwMicpO1xuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcblx0fSxcblx0c3RlcDI6ICgpPT57XG5cdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XG5cdFx0JCgnLnNlY3Rpb24nKS5hZGRDbGFzcygnc3RlcDInKTtcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XG5cdH1cbn1cblxubGV0IGRhdGEgPSB7XG5cdHJhdzoge30sXG5cdGZpbHRlcmVkOiB7fSxcblx0dXNlcmlkOiAnJyxcblx0bm93TGVuZ3RoOiAwLFxuXHRleHRlbnNpb246IGZhbHNlLFxuXHRwcm9taXNlX2FycmF5OiBbXSxcblx0dGVzdDogKGlkKT0+e1xuXHRcdGNvbnNvbGUubG9nKGlkKTtcblx0fSxcblx0aW5pdDogKCk9Pntcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xuXHRcdGRhdGEucHJvbWlzZV9hcnJheSA9IFtdO1xuXHRcdGRhdGEucmF3ID0gW107XG5cdH0sXG5cdHN0YXJ0OiAoZmJpZCk9Pntcblx0XHRkYXRhLmluaXQoKTtcblx0XHRsZXQgb2JqID0ge1xuXHRcdFx0ZnVsbElEOiBmYmlkXG5cdFx0fVxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0bGV0IGNvbW1hbmRzID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XG5cdFx0bGV0IHRlbXBfZGF0YSA9IG9iajtcblx0XHRmb3IobGV0IGkgb2YgY29tbWFuZHMpe1xuXHRcdFx0dGVtcF9kYXRhLmRhdGEgPSB7fTtcblx0XHRcdGxldCBwcm9taXNlID0gZGF0YS5nZXQodGVtcF9kYXRhLCBpKS50aGVuKChyZXMpPT57XG5cdFx0XHRcdHRlbXBfZGF0YS5kYXRhW2ldID0gcmVzO1xuXHRcdFx0fSk7XG5cdFx0XHRkYXRhLnByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcblx0XHR9XG5cblx0XHRQcm9taXNlLmFsbChkYXRhLnByb21pc2VfYXJyYXkpLnRoZW4oKCk9Pntcblx0XHRcdGRhdGEuZmluaXNoKHRlbXBfZGF0YSk7XG5cdFx0fSk7XG5cdH0sXG5cdGdldDogKGZiaWQsIGNvbW1hbmQpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XG5cdFx0XHRsZXQgc2hhcmVFcnJvciA9IDA7XG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcblx0XHRcdGlmIChjb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcblx0XHRcdFx0Z2V0U2hhcmUoKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7Y29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbY29tbWFuZF19Jm9yZGVyPWNocm9ub2xvZ2ljYWwmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9YCwocmVzKT0+e1xuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0PTApe1xuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KS5mYWlsKCgpPT57XG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBnZXRTaGFyZShhZnRlcj0nJyl7XG5cdFx0XHRcdGxldCB1cmwgPSBgaHR0cHM6Ly9hbTY2YWhndHA4LmV4ZWN1dGUtYXBpLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vc2hhcmU/ZmJpZD0ke2ZiaWQuZnVsbElEfSZhZnRlcj0ke2FmdGVyfWA7XG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRcdFx0aWYgKHJlcyA9PT0gJ2VuZCcpe1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yTWVzc2FnZSl7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHRcdFx0fWVsc2UgaWYocmVzLmRhdGEpe1xuXHRcdFx0XHRcdFx0XHQvLyBzaGFyZUVycm9yID0gMDtcblx0XHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0XHRcdFx0XHRsZXQgbmFtZSA9ICcnO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGkuc3Rvcnkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZSA9IGkuc3Rvcnkuc3Vic3RyaW5nKDAsIGkuc3RvcnkuaW5kZXhPZignIHNoYXJlZCcpKTtcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBpLmlkLnN1YnN0cmluZygwLCBpLmlkLmluZGV4T2YoXCJfXCIpKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0bGV0IGlkID0gaS5pZC5zdWJzdHJpbmcoMCwgaS5pZC5pbmRleE9mKFwiX1wiKSk7XG5cdFx0XHRcdFx0XHRcdFx0aS5mcm9tID0ge2lkLCBuYW1lfTtcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGkpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGdldFNoYXJlKHJlcy5hZnRlcik7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRmaW5pc2g6IChmYmlkKT0+e1xuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHRzdGVwLnN0ZXAyKCk7XG5cdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XG5cdFx0JCgnLnJlc3VsdF9hcmVhID4gLnRpdGxlIHNwYW4nKS50ZXh0KGZiaWQuZnVsbElEKTtcblx0XHRkYXRhLnJhdyA9IGZiaWQ7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyYXdcIiwgSlNPTi5zdHJpbmdpZnkoZmJpZCkpO1xuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcblx0fSxcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSk9Pntcblx0XHRkYXRhLmZpbHRlcmVkID0ge307XG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XG5cdFx0bGV0IGlzVGFnID0gJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIik7XG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocmF3RGF0YS5kYXRhKSl7XG5cdFx0XHRpZiAoa2V5ID09PSAncmVhY3Rpb25zJykgaXNUYWcgPSBmYWxzZTtcblx0XHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEuZGF0YVtrZXldLCBrZXksIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcdFxuXHRcdFx0ZGF0YS5maWx0ZXJlZFtrZXldID0gbmV3RGF0YTtcblx0XHR9XG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKXtcblx0XHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmlsdGVyZWQpO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIGRhdGEuZmlsdGVyZWQ7XG5cdFx0fVxuXHR9LFxuXHRleGNlbDogKHJhdyk9Pntcblx0XHR2YXIgbmV3T2JqID0gW107XG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKXtcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XG5cdFx0XHRcdHZhciB0bXAgPSB7XG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXG5cdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIiA6IHRoaXMucG9zdGxpbmssXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMuc3RvcnksXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxuXHRcdFx0XHR9XG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XG5cdFx0XHRcdHZhciB0bXAgPSB7XG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXG5cdFx0XHRcdFx0XCLlv4Pmg4VcIiA6IHRoaXMudHlwZSB8fCAnJyxcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXG5cdFx0XHRcdH1cblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gbmV3T2JqO1xuXHR9LFxuXHRpbXBvcnQ6IChmaWxlKT0+e1xuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xuXHRcdH1cblxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuXHR9XG59XG5cbmxldCB0YWJsZSA9IHtcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcblx0XHRsZXQgZmlsdGVyZWQgPSByYXdkYXRhO1xuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoZmlsdGVyZWQpKXtcblx0XHRcdGxldCB0aGVhZCA9ICcnO1xuXHRcdFx0bGV0IHRib2R5ID0gJyc7XG5cdFx0XHRpZihrZXkgPT09ICdyZWFjdGlvbnMnKXtcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxuXHRcdFx0XHQ8dGQ+5b+D5oOFPC90ZD5gO1xuXHRcdFx0fWVsc2UgaWYoa2V5ID09PSAnc2hhcmVkcG9zdHMnKXtcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cblx0XHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxuXHRcdFx0XHQ8dGQ+6K6aPC90ZD5cblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJlZFtrZXldLmVudHJpZXMoKSl7XG5cdFx0XHRcdGxldCBwaWN0dXJlID0gJyc7XG5cdFx0XHRcdGlmIChwaWMpe1xuXHRcdFx0XHRcdC8vIHBpY3R1cmUgPSBgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cblx0XHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcblx0XHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XG5cdFx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgdmFsLnN0b3J5fTwvYT48L3RkPlxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxuXHRcdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xuXHRcdFx0XHR0Ym9keSArPSB0cjtcblx0XHRcdH1cblx0XHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcblx0XHRcdCQoXCIudGFibGVzIC5cIitrZXkrXCIgdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XG5cdFx0fVxuXHRcdFxuXHRcdGFjdGl2ZSgpO1xuXHRcdHRhYi5pbml0KCk7XG5cdFx0Y29tcGFyZS5pbml0KCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSh7XG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0XHRsZXQgYXJyID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0YWJsZVxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxuXHRcdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHRhYmxlXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXG5cdFx0XHRcdFx0LmRyYXcoKTtcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHJlZG86ICgpPT57XG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xuXHR9XG59XG5cbmxldCBjb21wYXJlID0ge1xuXHRhbmQ6IFtdLFxuXHRvcjogW10sXG5cdHJhdzogW10sXG5cdGluaXQ6ICgpPT57XG5cdFx0Y29tcGFyZS5hbmQgPSBbXTtcblx0XHRjb21wYXJlLm9yID0gW107XG5cdFx0Y29tcGFyZS5yYXcgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XG5cdFx0bGV0IGlnbm9yZSA9ICQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLnZhbCgpO1xuXHRcdGxldCBiYXNlID0gW107XG5cdFx0bGV0IGZpbmFsID0gW107XG5cdFx0bGV0IGNvbXBhcmVfbnVtID0gMTtcblx0XHRpZiAoaWdub3JlID09PSAnaWdub3JlJykgY29tcGFyZV9udW0gPSAyO1xuXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoY29tcGFyZS5yYXcpKXtcblx0XHRcdGlmIChrZXkgIT09IGlnbm9yZSl7XG5cdFx0XHRcdGZvcihsZXQgaSBvZiBjb21wYXJlLnJhd1trZXldKXtcblx0XHRcdFx0XHRiYXNlLnB1c2goaSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0bGV0IHNvcnQgPSAoZGF0YS5yYXcuZXh0ZW5zaW9uKSA/ICduYW1lJzonaWQnO1xuXHRcdGJhc2UgPSBiYXNlLnNvcnQoKGEsYik9Pntcblx0XHRcdHJldHVybiBhLmZyb21bc29ydF0gPiBiLmZyb21bc29ydF0gPyAxOi0xO1xuXHRcdH0pO1xuXG5cdFx0Zm9yKGxldCBpIG9mIGJhc2Upe1xuXHRcdFx0aS5tYXRjaCA9IDA7XG5cdFx0fVxuXG5cdFx0bGV0IHRlbXAgPSAnJztcblx0XHRsZXQgdGVtcF9uYW1lID0gJyc7XG5cdFx0Ly8gY29uc29sZS5sb2coYmFzZSk7XG5cdFx0Zm9yKGxldCBpIGluIGJhc2Upe1xuXHRcdFx0bGV0IG9iaiA9IGJhc2VbaV07XG5cdFx0XHRpZiAob2JqLmZyb20uaWQgPT0gdGVtcCB8fCAoZGF0YS5yYXcuZXh0ZW5zaW9uICYmIChvYmouZnJvbS5uYW1lID09IHRlbXBfbmFtZSkpKXtcblx0XHRcdFx0bGV0IHRhciA9IGZpbmFsW2ZpbmFsLmxlbmd0aC0xXTtcblx0XHRcdFx0dGFyLm1hdGNoKys7XG5cdFx0XHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKG9iaikpe1xuXHRcdFx0XHRcdGlmICghdGFyW2tleV0pIHRhcltrZXldID0gb2JqW2tleV07IC8v5ZCI5L216LOH5paZXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRhci5tYXRjaCA9PSBjb21wYXJlX251bSl7XG5cdFx0XHRcdFx0dGVtcF9uYW1lID0gJyc7XG5cdFx0XHRcdFx0dGVtcCA9ICcnO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZmluYWwucHVzaChvYmopO1xuXHRcdFx0XHR0ZW1wID0gb2JqLmZyb20uaWQ7XG5cdFx0XHRcdHRlbXBfbmFtZSA9IG9iai5mcm9tLm5hbWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0XG5cdFx0Y29tcGFyZS5vciA9IGZpbmFsO1xuXHRcdGNvbXBhcmUuYW5kID0gY29tcGFyZS5vci5maWx0ZXIoKHZhbCk9Pntcblx0XHRcdHJldHVybiB2YWwubWF0Y2ggPT0gY29tcGFyZV9udW07XG5cdFx0fSk7XG5cdFx0Y29tcGFyZS5nZW5lcmF0ZSgpO1xuXHR9LFxuXHRnZW5lcmF0ZTogKCk9Pntcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xuXHRcdGxldCBkYXRhX2FuZCA9IGNvbXBhcmUuYW5kO1xuXG5cdFx0bGV0IHRib2R5ID0gJyc7XG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX2FuZC5lbnRyaWVzKCkpe1xuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCAnJ308L2E+PC90ZD5cblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcwJ308L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcblx0XHRcdHRib2R5ICs9IHRyO1xuXHRcdH1cblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuYW5kIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XG5cblx0XHRsZXQgZGF0YV9vciA9IGNvbXBhcmUub3I7XG5cdFx0bGV0IHRib2R5MiA9ICcnO1xuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9vci5lbnRyaWVzKCkpe1xuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCAnJ308L2E+PC90ZD5cblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcnfTwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xuXHRcdFx0dGJvZHkyICs9IHRyO1xuXHRcdH1cblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUub3IgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5Mik7XG5cdFx0XG5cdFx0YWN0aXZlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoe1xuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdFx0bGV0IGFyciA9IFsnYW5kJywnb3InXTtcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xuXHRcdFx0XHRsZXQgdGFibGUgPSAkKCcudGFibGVzIC4nK2krJyB0YWJsZScpLkRhdGFUYWJsZSgpO1xuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHRhYmxlXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXG5cdFx0XHRcdFx0LmRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dGFibGVcblx0XHRcdFx0XHQuY29sdW1ucygyKVxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcblx0XHRcdFx0XHQuZHJhdygpO1xuXHRcdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5sZXQgY2hvb3NlID0ge1xuXHRkYXRhOiBbXSxcblx0YXdhcmQ6IFtdLFxuXHRudW06IDAsXG5cdGRldGFpbDogZmFsc2UsXG5cdGxpc3Q6IFtdLFxuXHRpbml0OiAoY3RybCA9IGZhbHNlKT0+e1xuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcblx0XHRjaG9vc2UubnVtID0gMDtcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcblx0XHRcdFx0aWYgKG4gPiAwKXtcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xuXHRcdH1cblx0XHRjaG9vc2UuZ28oY3RybCk7XG5cdH0sXG5cdGdvOiAoY3RybCk9Pntcblx0XHRsZXQgY29tbWFuZCA9IHRhYi5ub3c7XG5cdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XG5cdFx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXS5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1xuXHRcdH1lbHNle1xuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGFbY29tbWFuZF0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcdFxuXHRcdH1cblx0XHRsZXQgaW5zZXJ0ID0gJyc7XG5cdFx0bGV0IHRlbXBBcnIgPSBbXTtcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XG5cdFx0XHQkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLmNvbHVtbigyKS5kYXRhKCkuZWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpe1xuXHRcdFx0XHRsZXQgd29yZCA9ICQoJy5zZWFyY2hDb21tZW50JykudmFsKCk7XG5cdFx0XHRcdGlmICh2YWx1ZS5pbmRleE9mKHdvcmQpID49IDApIHRlbXBBcnIucHVzaChpbmRleCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Zm9yKGxldCBpIG9mIGNob29zZS5hd2FyZCl7XG5cdFx0XHRsZXQgcm93ID0gKHRlbXBBcnIubGVuZ3RoID09IDApID8gaTp0ZW1wQXJyW2ldO1xuXHRcdFx0bGV0IHRhciA9ICQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkucm93KHJvdykubm9kZSgpLmlubmVySFRNTDtcblx0XHRcdGluc2VydCArPSAnPHRyPicgKyB0YXIgKyAnPC90cj4nO1xuXHRcdH1cblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xuXHRcdGlmICghY3RybCl7XG5cdFx0XHQkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdC8vIGxldCB0YXIgPSAkKHRoaXMpLmZpbmQoJ3RkJykuZXEoMSk7XG5cdFx0XHRcdC8vIGxldCBpZCA9IHRhci5maW5kKCdhJykuYXR0cignYXR0ci1mYmlkJyk7XG5cdFx0XHRcdC8vIHRhci5wcmVwZW5kKGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdFxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xuXG5cdFx0aWYoY2hvb3NlLmRldGFpbCl7XG5cdFx0XHRsZXQgbm93ID0gMDtcblx0XHRcdGZvcihsZXQgayBpbiBjaG9vc2UubGlzdCl7XG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjdcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XG5cdFx0XHR9XG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XG5cdFx0fVxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcblx0fVxufVxuXG5sZXQgZmlsdGVyID0ge1xuXHR0b3RhbEZpbHRlcjogKHJhdywgY29tbWFuZCwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9Pntcblx0XHRsZXQgZGF0YSA9IHJhdztcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XG5cdFx0fVxuXHRcdGlmICh3b3JkICE9PSAnJyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xuXHRcdH1cblx0XHRpZiAoaXNUYWcgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xuXHRcdH1cblx0XHRpZiAoY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIGVuZFRpbWUpO1xuXHRcdH1lbHNle1xuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH0sXG5cdHVuaXF1ZTogKGRhdGEpPT57XG5cdFx0bGV0IG91dHB1dCA9IFtdO1xuXHRcdGxldCBrZXlzID0gW107XG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH0sXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0dGFnOiAoZGF0YSk9Pntcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3QXJ5O1xuXHR9LFxuXHR0aW1lOiAoZGF0YSwgdCk9Pntcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuZXdBcnk7XG5cdFx0fVxuXHR9XG59XG5cbmxldCB1aSA9IHtcblx0aW5pdDogKCk9PntcblxuXHR9XG59XG5cbmxldCB0YWIgPSB7XG5cdG5vdzogXCJjb21tZW50c1wiLFxuXHRpbml0OiAoKT0+e1xuXHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0dGFiLm5vdyA9ICQodGhpcykuYXR0cignYXR0ci10eXBlJyk7XG5cdFx0XHRsZXQgdGFyID0gJCh0aGlzKS5pbmRleCgpO1xuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5lcSh0YXIpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xuXHRcdFx0XHRjb21wYXJlLmluaXQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5cblxuZnVuY3Rpb24gbm93RGF0ZSgpe1xuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcbn1cblxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcbiAgICAgaWYgKGRhdGUgPCAxMCl7XG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XG4gICAgIH1cbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XG4gICAgIGlmIChob3VyIDwgMTApe1xuICAgICBcdGhvdXIgPSBcIjBcIitob3VyO1xuICAgICB9XG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcbiAgICAgaWYgKG1pbiA8IDEwKXtcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XG4gICAgIH1cbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xuICAgICBpZiAoc2VjIDwgMTApe1xuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcbiAgICAgfVxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcbiAgICAgcmV0dXJuIHRpbWU7XG4gfVxuXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcbiBcdH0pO1xuIFx0cmV0dXJuIGFycmF5O1xuIH1cblxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcbiBcdHZhciBpLCByLCB0O1xuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XG4gXHRcdGFyeVtpXSA9IGk7XG4gXHR9XG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xuIFx0XHR0ID0gYXJ5W3JdO1xuIFx0XHRhcnlbcl0gPSBhcnlbaV07XG4gXHRcdGFyeVtpXSA9IHQ7XG4gXHR9XG4gXHRyZXR1cm4gYXJ5O1xuIH1cblxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xuICAgIFxuICAgIHZhciBDU1YgPSAnJzsgICAgXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXG4gICAgXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XG5cbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxuICAgIGlmIChTaG93TGFiZWwpIHtcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XG4gICAgICAgIFxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcbiAgICB9XG4gICAgXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xuICAgICAgICBcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xuICAgIH1cblxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gICBcbiAgICBcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxuICAgIFxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcbiAgICBcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXG4gICAgXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxuICAgIGxpbmsuaHJlZiA9IHVyaTtcbiAgICBcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XG4gICAgXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpbmsuY2xpY2soKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xufSJdfQ==
