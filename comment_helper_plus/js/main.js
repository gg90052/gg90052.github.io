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
		var pageID = fbid.split('_')[0];
		FB.api("/" + pageID + "?fields=access_token", function (res) {
			if (res.error) {
				data.start(fbid);
			} else {
				if (res.access_token) {
					config.pageToken = res.access_token;
				}
				data.start(fbid);
			}
		});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJoYXNoIiwibG9jYXRpb24iLCJpbmRleE9mIiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInNlc3Npb25TdG9yYWdlIiwiYWxlcnQiLCJocmVmIiwibGFzdERhdGEiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwiZGF0YSIsImZpbmlzaCIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJlIiwiY3RybEtleSIsImFsdEtleSIsImV4dGVuc2lvbkF1dGgiLCJnZXRBdXRoIiwiY2hvb3NlIiwiaW5pdCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJhcHBlbmQiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJjb25maWciLCJmaWx0ZXIiLCJyZWFjdCIsInZhbCIsImNvbXBhcmUiLCJkYXRlcmFuZ2VwaWNrZXIiLCJzdGFydCIsImVuZCIsImxhYmVsIiwiZW5kVGltZSIsImZvcm1hdCIsInNldFN0YXJ0RGF0ZSIsIm5vd0RhdGUiLCJmaWx0ZXJEYXRhIiwicmF3IiwiZGQiLCJ0YWIiLCJub3ciLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpa2VzIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJuZXdlc3QiLCJ3b3JkIiwib3JkZXIiLCJhdXRoIiwiZXh0ZW5zaW9uIiwicGFnZVRva2VuIiwibmV4dCIsInR5cGUiLCJGQiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsInN3YWwiLCJkb25lIiwiZmJpZCIsIlByb21pc2UiLCJhbGwiLCJnZXRNZSIsImdldFBhZ2UiLCJnZXRHcm91cCIsInRoZW4iLCJyZXMiLCJvcHRpb25zIiwiaSIsImoiLCJpZCIsIm5hbWUiLCJodG1sIiwic2VsZWN0UGFnZSIsInRhciIsImF0dHIiLCJzZXRUb2tlbiIsInN0ZXAiLCJzdGVwMSIsInBhZ2VpZCIsInBhZ2VzIiwiYWNjZXNzX3Rva2VuIiwiaGlkZGVuU3RhcnQiLCJwYWdlSUQiLCJzcGxpdCIsImFwaSIsImVycm9yIiwiY2xlYXIiLCJlbXB0eSIsImZpbmQiLCJjb21tYW5kIiwicGFnaW5nIiwic3RyIiwiZ2VuRGF0YSIsIm1lc3NhZ2UiLCJyZWNvbW1hbmQiLCJnZW5DYXJkIiwib2JqIiwiaWRzIiwibGluayIsIm1lc3MiLCJyZXBsYWNlIiwidGltZUNvbnZlcnRlciIsImNyZWF0ZWRfdGltZSIsInNyYyIsImZ1bGxfcGljdHVyZSIsInJlc29sdmUiLCJyZWplY3QiLCJhcnIiLCJleHRlbnNpb25DYWxsYmFjayIsInNldEl0ZW0iLCJleHRlbmQiLCJmaWQiLCJwdXNoIiwiZnJvbSIsInByb21pc2VfYXJyYXkiLCJuYW1lcyIsInByb21pc2UiLCJnZXROYW1lIiwiT2JqZWN0Iiwia2V5cyIsInRpdGxlIiwidG9TdHJpbmciLCJzY3JvbGxUb3AiLCJzdGVwMiIsImZpbHRlcmVkIiwidXNlcmlkIiwibm93TGVuZ3RoIiwidGVzdCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwiY29tbWFuZHMiLCJ0ZW1wX2RhdGEiLCJnZXQiLCJkYXRhcyIsInNoYXJlRXJyb3IiLCJnZXRTaGFyZSIsImQiLCJ1cGRhdGVkX3RpbWUiLCJnZXROZXh0IiwiZ2V0SlNPTiIsImZhaWwiLCJhZnRlciIsInN0b3J5Iiwic3Vic3RyaW5nIiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJwcm9wIiwiaXNUYWciLCJrZXkiLCJuZXdEYXRhIiwidG90YWxGaWx0ZXIiLCJvYmoyQXJyYXkiLCJuZXdPYmoiLCJlYWNoIiwidG1wIiwicG9zdGxpbmsiLCJsaWtlX2NvdW50IiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwicGljIiwidGhlYWQiLCJ0Ym9keSIsImVudHJpZXMiLCJwaWN0dXJlIiwidGQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJzZWFyY2giLCJ2YWx1ZSIsImRyYXciLCJhbmQiLCJvciIsImlnbm9yZSIsImJhc2UiLCJmaW5hbCIsImNvbXBhcmVfbnVtIiwic29ydCIsImEiLCJiIiwibWF0Y2giLCJ0ZW1wIiwidGVtcF9uYW1lIiwiZGF0YV9hbmQiLCJkYXRhX29yIiwidGJvZHkyIiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwiY3RybCIsIm4iLCJwYXJzZUludCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwidGVtcEFyciIsImNvbHVtbiIsImluZGV4Iiwicm93Iiwibm9kZSIsImlubmVySFRNTCIsImsiLCJlcSIsImluc2VydEJlZm9yZSIsInVuaXF1ZSIsInRhZyIsInRpbWUiLCJvdXRwdXQiLCJmb3JFYWNoIiwiaXRlbSIsIm5ld0FyeSIsImdyZXAiLCJtZXNzYWdlX3RhZ3MiLCJ0IiwidGltZV9hcnkiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJ1aSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsIm1hcCIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBO0FBQ0RTLEVBQUVFLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFVO0FBQzNCLEtBQUlDLFdBQVcsQ0FBZjtBQUNBSixHQUFFLFFBQUYsRUFBWUssS0FBWixDQUFrQixZQUFVO0FBQzNCRDtBQUNBLE1BQUlBLFlBQVksQ0FBaEIsRUFBa0I7QUFDakJKLEtBQUUsUUFBRixFQUFZTSxHQUFaLENBQWdCLE9BQWhCO0FBQ0FOLEtBQUUsMEJBQUYsRUFBOEJPLFdBQTlCLENBQTBDLE1BQTFDO0FBQ0E7QUFDRCxFQU5EOztBQVFBLEtBQUlDLE9BQU9DLFNBQVNELElBQXBCO0FBQ0EsS0FBSUEsS0FBS0UsT0FBTCxDQUFhLE9BQWIsS0FBeUIsQ0FBN0IsRUFBK0I7QUFDOUJDLGVBQWFDLFVBQWIsQ0FBd0IsS0FBeEI7QUFDQUMsaUJBQWVELFVBQWYsQ0FBMEIsT0FB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IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxuXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxue1xuXHRpZiAoIWVycm9yTWVzc2FnZSl7XG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdGxldCBoaWRlYXJlYSA9IDA7XG5cdCQoJ2hlYWRlcicpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0aGlkZWFyZWErKztcblx0XHRpZiAoaGlkZWFyZWEgPj0gNSl7XG5cdFx0XHQkKCdoZWFkZXInKS5vZmYoJ2NsaWNrJyk7XG5cdFx0XHQkKCcjZmJpZF9idXR0b24sICNwdXJlX2ZiaWQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuXHRcdH1cblx0fSk7XG5cblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoO1xuXHRpZiAoaGFzaC5pbmRleE9mKFwiY2xlYXJcIikgPj0gMCl7XG5cdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3JhdycpO1xuXHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2xvZ2luJyk7XG5cdFx0YWxlcnQoJ+W3sua4hemZpOaaq+WtmO+8jOiri+mHjeaWsOmAsuihjOeZu+WFpScpO1xuXHRcdGxvY2F0aW9uLmhyZWYgPSAnaHR0cHM6Ly9nZzkwMDUyLmdpdGh1Yi5pby9jb21tZW50X2hlbHBlcl9wbHVzJztcblx0fVxuXHRsZXQgbGFzdERhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmF3XCIpKTtcblxuXHRpZiAobGFzdERhdGEpe1xuXHRcdGRhdGEuZmluaXNoKGxhc3REYXRhKTtcblx0fVxuXHRpZiAoc2Vzc2lvblN0b3JhZ2UubG9naW4pe1xuXHRcdGZiLmdlbk9wdGlvbihKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKSk7XG5cdH1cblxuXHQkKFwiLnRhYmxlcyA+IC5zaGFyZWRwb3N0cyBidXR0b25cIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCdpbXBvcnQnKTtcblx0XHR9ZWxzZXtcblx0XHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcblx0XHR9XG5cdH0pO1xuXHRcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcblx0fSk7XG5cblx0JChcIiNidG5fc3RhcnRcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xuXHR9KTtcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0Y2hvb3NlLmluaXQodHJ1ZSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRjaG9vc2UuaW5pdCgpO1xuXHRcdH1cblx0fSk7XG5cdFxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XG5cdFx0fWVsc2V7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xuXHR9KTtcblxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xuXHRcdH1cblx0fSk7XG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcblx0XHRpZiAoIWUuY3RybEtleSB8fCAhZS5hbHRLZXkpe1xuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xuXHRcdH1cblx0fSk7XG5cblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcblx0XHR0YWJsZS5yZWRvKCk7XG5cdH0pO1xuXG5cdCQoXCIudGFibGVzIC5maWx0ZXJzIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcblx0XHR0YWJsZS5yZWRvKCk7XG5cdH0pO1xuXG5cdCQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpe1xuXHRcdGNvbXBhcmUuaW5pdCgpO1xuXHR9KTtcblxuXHQkKCcuY29tcGFyZV9jb25kaXRpb24nKS5jaGFuZ2UoZnVuY3Rpb24oKXtcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZScpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuJysgJCh0aGlzKS52YWwoKSkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcblx0fSk7XG5cblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXG5cdFx0XCJsb2NhbGVcIjoge1xuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZLU1NLUREICAgSEg6bW1cIixcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXG5cdFx0XHRcIuaXpVwiLFxuXHRcdFx0XCLkuIBcIixcblx0XHRcdFwi5LqMXCIsXG5cdFx0XHRcIuS4iVwiLFxuXHRcdFx0XCLlm5tcIixcblx0XHRcdFwi5LqUXCIsXG5cdFx0XHRcIuWFrVwiXG5cdFx0XHRdLFxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcblx0XHRcdFwi5LiA5pyIXCIsXG5cdFx0XHRcIuS6jOaciFwiLFxuXHRcdFx0XCLkuInmnIhcIixcblx0XHRcdFwi5Zub5pyIXCIsXG5cdFx0XHRcIuS6lOaciFwiLFxuXHRcdFx0XCLlha3mnIhcIixcblx0XHRcdFwi5LiD5pyIXCIsXG5cdFx0XHRcIuWFq+aciFwiLFxuXHRcdFx0XCLkuZ3mnIhcIixcblx0XHRcdFwi5Y2B5pyIXCIsXG5cdFx0XHRcIuWNgeS4gOaciFwiLFxuXHRcdFx0XCLljYHkuozmnIhcIlxuXHRcdFx0XSxcblx0XHRcdFwiZmlyc3REYXlcIjogMVxuXHRcdH0sXG5cdH0sZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcblx0XHR0YWJsZS5yZWRvKCk7XG5cdH0pO1xuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XG5cblxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcblx0XHRpZiAoZS5jdHJsS2V5KXtcblx0XHRcdGxldCBkZDtcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGFbdGFiLm5vd10pO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIGRkO1xuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcblx0XHR9ZWxzZXtcblx0XHRcdGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApe1xuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGFbdGFiLm5vd10pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xuXHR9KTtcblxuXHRsZXQgY2lfY291bnRlciA9IDA7XG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0Y2lfY291bnRlcisrO1xuXHRcdGlmIChjaV9jb3VudGVyID49IDUpe1xuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHR9XG5cdFx0aWYoZS5jdHJsS2V5KXtcblx0XHRcdGZiLmdldEF1dGgoJ3NoYXJlZHBvc3RzJyk7XG5cdFx0fVxuXHR9KTtcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcblx0fSk7XG59KTtcblxubGV0IGNvbmZpZyA9IHtcblx0ZmllbGQ6IHtcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZScsJ2Zyb20nLCdjcmVhdGVkX3RpbWUnXSxcblx0XHRyZWFjdGlvbnM6IFtdLFxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcblx0XHR1cmxfY29tbWVudHM6IFtdLFxuXHRcdGZlZWQ6IFsnY3JlYXRlZF90aW1lJywnZnJvbScsJ21lc3NhZ2UnLCdzdG9yeSddLFxuXHRcdGxpa2VzOiBbJ25hbWUnXVxuXHR9LFxuXHRsaW1pdDoge1xuXHRcdGNvbW1lbnRzOiAnNTAwJyxcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxuXHRcdGZlZWQ6ICc1MDAnLFxuXHRcdGxpa2VzOiAnNTAwJ1xuXHR9LFxuXHRhcGlWZXJzaW9uOiB7XG5cdFx0Y29tbWVudHM6ICd2Mi43Jyxcblx0XHRyZWFjdGlvbnM6ICd2Mi43Jyxcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxuXHRcdGZlZWQ6ICd2Mi45Jyxcblx0XHRncm91cDogJ3YyLjknLFxuXHRcdG5ld2VzdDogJ3YyLjgnXG5cdH0sXG5cdGZpbHRlcjoge1xuXHRcdHdvcmQ6ICcnLFxuXHRcdHJlYWN0OiAnYWxsJyxcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcblx0fSxcblx0b3JkZXI6ICcnLFxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX21hbmFnZWRfZ3JvdXBzLG1hbmFnZV9wYWdlcycsXG5cdGV4dGVuc2lvbjogZmFsc2UsXG5cdHBhZ2VUb2tlbjogJycsXG59XG5cbmxldCBmYiA9IHtcblx0bmV4dDogJycsXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHR9LFxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCdtYW5hZ2VfcGFnZXMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9tYW5hZ2VkX2dyb3VwcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XG5cdFx0XHRcdFx0ZmIuc3RhcnQoKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0c3dhbChcblx0XHRcdFx0XHRcdCfmjojmrIrlpLHmlZfvvIzoq4vntabkuojmiYDmnInmrIrpmZAnLFxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcblx0XHRcdFx0XHRcdCdlcnJvcidcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1x0XHRcdFxuXHRcdFx0fVxuXHRcdH1lbHNle1xuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHRcdH1cblx0fSxcblx0c3RhcnQ6ICgpPT57XG5cdFx0UHJvbWlzZS5hbGwoW2ZiLmdldE1lKCksZmIuZ2V0UGFnZSgpLCBmYi5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xuXHRcdFx0c2Vzc2lvblN0b3JhZ2UubG9naW4gPSBKU09OLnN0cmluZ2lmeShyZXMpO1xuXHRcdFx0ZmIuZ2VuT3B0aW9uKHJlcyk7XG5cdFx0fSk7XG5cdH0sXG5cdGdlbk9wdGlvbjogKHJlcyk9Pntcblx0XHRmYi5uZXh0ID0gJyc7XG5cdFx0bGV0IG9wdGlvbnMgPSBgPGlucHV0IGlkPVwicHVyZV9mYmlkXCIgY2xhc3M9XCJoaWRlXCI+PGJ1dHRvbiBpZD1cImZiaWRfYnV0dG9uXCIgY2xhc3M9XCJidG4gaGlkZVwiIG9uY2xpY2s9XCJmYi5oaWRkZW5TdGFydCgpXCI+55SxRkJJROaTt+WPljwvYnV0dG9uPjxicj5gO1xuXHRcdGxldCB0eXBlID0gLTE7XG5cdFx0JCgnI2J0bl9zdGFydCcpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0Zm9yKGxldCBpIG9mIHJlcyl7XG5cdFx0XHR0eXBlKys7XG5cdFx0XHRmb3IobGV0IGogb2YgaSl7XG5cdFx0XHRcdG9wdGlvbnMgKz0gYDxkaXYgY2xhc3M9XCJwYWdlX2J0blwiIGF0dHItdHlwZT1cIiR7dHlwZX1cIiBhdHRyLXZhbHVlPVwiJHtqLmlkfVwiIG9uY2xpY2s9XCJmYi5zZWxlY3RQYWdlKHRoaXMpXCI+JHtqLm5hbWV9PC9kaXY+YDtcblx0XHRcdH1cblx0XHR9XG5cdFx0JCgnI2VudGVyVVJMJykuaHRtbChvcHRpb25zKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuXHR9LFxuXHRzZWxlY3RQYWdlOiAoZSk9Pntcblx0XHQkKCcjZW50ZXJVUkwgLnBhZ2VfYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdGZiLm5leHQgPSAnJztcblx0XHRsZXQgdGFyID0gJChlKTtcblx0XHR0YXIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdGlmICh0YXIuYXR0cignYXR0ci10eXBlJykgPT0gMSl7XG5cdFx0XHRmYi5zZXRUb2tlbih0YXIuYXR0cignYXR0ci12YWx1ZScpKTtcblx0XHR9XG5cdFx0ZmIuZmVlZCh0YXIuYXR0cignYXR0ci12YWx1ZScpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQpO1xuXHRcdHN0ZXAuc3RlcDEoKTtcblx0fSxcblx0c2V0VG9rZW46IChwYWdlaWQpPT57XG5cdFx0bGV0IHBhZ2VzID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbilbMV07XG5cdFx0Zm9yKGxldCBpIG9mIHBhZ2VzKXtcblx0XHRcdGlmIChpLmlkID09IHBhZ2VpZCl7XG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSBpLmFjY2Vzc190b2tlbjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGhpZGRlblN0YXJ0OiAoKT0+e1xuXHRcdGxldCBmYmlkID0gJCgnI3B1cmVfZmJpZCcpLnZhbCgpO1xuXHRcdGxldCBwYWdlSUQgPSBmYmlkLnNwbGl0KCdfJylbMF07XG5cdFx0RkIuYXBpKGAvJHtwYWdlSUR9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRpZiAocmVzLmVycm9yKXtcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbil7XG5cdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XG5cdFx0XHRcdH1cblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0ZmVlZDogKHBhZ2VJRCwgdHlwZSwgdXJsID0gJycsIGNsZWFyID0gdHJ1ZSk9Pntcblx0XHRpZiAoY2xlYXIpe1xuXHRcdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLm9mZignY2xpY2snKS5jbGljaygoKT0+e1xuXHRcdFx0XHRsZXQgdGFyID0gJCgnI2VudGVyVVJMIHNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xuXHRcdFx0XHRmYi5mZWVkKHRhci52YWwoKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0LCBmYWxzZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0bGV0IGNvbW1hbmQgPSAodHlwZSA9PSAnMicpID8gJ2ZlZWQnOidwb3N0cyc7XG5cdFx0bGV0IGFwaTtcblx0XHRpZiAodXJsID09ICcnKXtcblx0XHRcdGFwaSA9IGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlSUR9LyR7Y29tbWFuZH0/ZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTI1YDtcblx0XHR9ZWxzZXtcblx0XHRcdGFwaSA9IHVybDtcblx0XHR9XG5cdFx0RkIuYXBpKGFwaSwgKHJlcyk9Pntcblx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPT0gMCl7XG5cdFx0XHRcdCQoJy5mZWVkcyAuYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRcdH1cblx0XHRcdGZiLm5leHQgPSByZXMucGFnaW5nLm5leHQ7XG5cdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRsZXQgc3RyID0gZ2VuRGF0YShpKTtcblx0XHRcdFx0JCgnLnNlY3Rpb24gLmZlZWRzIHRib2R5JykuYXBwZW5kKHN0cik7XG5cdFx0XHRcdGlmIChpLm1lc3NhZ2UgJiYgaS5tZXNzYWdlLmluZGV4T2YoJ+aKvScpID49IDApe1xuXHRcdFx0XHRcdGxldCByZWNvbW1hbmQgPSBnZW5DYXJkKGkpO1xuXHRcdFx0XHRcdCQoJy5kb25hdGVfYXJlYSAucmVjb21tYW5kcycpLmFwcGVuZChyZWNvbW1hbmQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRmdW5jdGlvbiBnZW5EYXRhKG9iail7XG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xuXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xuXHRcdFx0bGV0IHN0ciA9IGA8dHI+XG5cdFx0XHRcdFx0XHQ8dGQ+PGRpdiBjbGFzcz1cInBpY2tcIiBhdHRyLXZhbD1cIiR7b2JqLmlkfVwiICBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj48L3RkPlxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzfTwvYT48L3RkPlxuXHRcdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKG9iai5jcmVhdGVkX3RpbWUpfTwvdGQ+XG5cdFx0XHRcdFx0XHQ8L3RyPmA7XG5cdFx0XHRyZXR1cm4gc3RyO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZW5DYXJkKG9iail7XG5cdFx0XHRsZXQgc3JjID0gb2JqLmZ1bGxfcGljdHVyZSB8fCAnaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4MjI1Jztcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XG5cdFx0XHRcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XG5cdFx0XHRsZXRcdHN0ciA9IGA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxuXHRcdFx0PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWltYWdlXCI+XG5cdFx0XHQ8ZmlndXJlIGNsYXNzPVwiaW1hZ2UgaXMtNGJ5M1wiPlxuXHRcdFx0PGltZyBzcmM9XCIke3NyY31cIiBhbHQ9XCJcIj5cblx0XHRcdDwvZmlndXJlPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2E+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1jb250ZW50XCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxuXHRcdFx0JHttZXNzfVxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj5cblx0XHRcdDwvZGl2PmA7XG5cdFx0XHRyZXR1cm4gc3RyO1xuXHRcdH1cblx0fSxcblx0Z2V0TWU6ICgpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XG5cdFx0XHRcdGxldCBhcnIgPSBbcmVzXTtcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdGdldFBhZ2U6ICgpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXRHcm91cDogKCk9Pntcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9Pntcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9saW1pdD0xMDBgLCAocmVzKT0+e1xuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRleHRlbnNpb25BdXRoOiAoY29tbWFuZCA9ICcnKT0+e1xuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSwgY29tbWFuZCk7XG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHR9LFxuXHRleHRlbnNpb25DYWxsYmFjazogKHJlc3BvbnNlLCBjb21tYW5kID0gJycpPT57XG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcblx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XG5cdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCdtYW5hZ2VfcGFnZXMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9tYW5hZ2VkX2dyb3VwcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XG5cdFx0XHRcdGRhdGEucmF3LmV4dGVuc2lvbiA9IHRydWU7XG5cdFx0XHRcdGlmIChjb21tYW5kID09ICdpbXBvcnQnKXtcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNoYXJlZHBvc3RzXCIsICQoJyNpbXBvcnQnKS52YWwoKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IGV4dGVuZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaGFyZWRwb3N0c1wiKSk7XG5cdFx0XHRcdGxldCBmaWQgPSBbXTtcblx0XHRcdFx0bGV0IGlkcyA9IFtdO1xuXHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcblx0XHRcdFx0XHRmaWQucHVzaChpLmZyb20uaWQpO1xuXHRcdFx0XHRcdGlmIChmaWQubGVuZ3RoID49NDUpe1xuXHRcdFx0XHRcdFx0aWRzLnB1c2goZmlkKTtcblx0XHRcdFx0XHRcdGZpZCA9IFtdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZHMucHVzaChmaWQpO1xuXHRcdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdLCBuYW1lcyA9IHt9O1xuXHRcdFx0XHRmb3IobGV0IGkgb2YgaWRzKXtcblx0XHRcdFx0XHRsZXQgcHJvbWlzZSA9IGZiLmdldE5hbWUoaSkudGhlbigocmVzKT0+e1xuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIE9iamVjdC5rZXlzKHJlcykpe1xuXHRcdFx0XHRcdFx0XHRuYW1lc1tpXSA9IHJlc1tpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRwcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRQcm9taXNlLmFsbChwcm9taXNlX2FycmF5KS50aGVuKCgpPT57XG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XG5cdFx0XHRcdFx0XHRpLmZyb20ubmFtZSA9IG5hbWVzW2kuZnJvbS5pZF0gPyBuYW1lc1tpLmZyb20uaWRdLm5hbWUgOiBpLmZyb20ubmFtZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZGF0YS5yYXcuZGF0YS5zaGFyZWRwb3N0cyA9IGV4dGVuZDtcblx0XHRcdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHN3YWwoe1xuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXG5cdFx0XHRcdH0pLmRvbmUoKTtcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0XHR9XG5cdH0sXG5cdGdldE5hbWU6IChpZHMpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9Pntcblx0XHRcdFx0cmVzb2x2ZShyZXMpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cbn1cbmxldCBzdGVwID0ge1xuXHRzdGVwMTogKCk9Pntcblx0XHQkKCcuc2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzdGVwMicpO1xuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcblx0fSxcblx0c3RlcDI6ICgpPT57XG5cdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XG5cdFx0JCgnLnNlY3Rpb24nKS5hZGRDbGFzcygnc3RlcDInKTtcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XG5cdH1cbn1cblxubGV0IGRhdGEgPSB7XG5cdHJhdzoge30sXG5cdGZpbHRlcmVkOiB7fSxcblx0dXNlcmlkOiAnJyxcblx0bm93TGVuZ3RoOiAwLFxuXHRleHRlbnNpb246IGZhbHNlLFxuXHRwcm9taXNlX2FycmF5OiBbXSxcblx0dGVzdDogKGlkKT0+e1xuXHRcdGNvbnNvbGUubG9nKGlkKTtcblx0fSxcblx0aW5pdDogKCk9Pntcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xuXHRcdGRhdGEucHJvbWlzZV9hcnJheSA9IFtdO1xuXHRcdGRhdGEucmF3ID0gW107XG5cdH0sXG5cdHN0YXJ0OiAoZmJpZCk9Pntcblx0XHRkYXRhLmluaXQoKTtcblx0XHRsZXQgb2JqID0ge1xuXHRcdFx0ZnVsbElEOiBmYmlkXG5cdFx0fVxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0bGV0IGNvbW1hbmRzID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XG5cdFx0bGV0IHRlbXBfZGF0YSA9IG9iajtcblx0XHRmb3IobGV0IGkgb2YgY29tbWFuZHMpe1xuXHRcdFx0dGVtcF9kYXRhLmRhdGEgPSB7fTtcblx0XHRcdGxldCBwcm9taXNlID0gZGF0YS5nZXQodGVtcF9kYXRhLCBpKS50aGVuKChyZXMpPT57XG5cdFx0XHRcdHRlbXBfZGF0YS5kYXRhW2ldID0gcmVzO1xuXHRcdFx0fSk7XG5cdFx0XHRkYXRhLnByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcblx0XHR9XG5cblx0XHRQcm9taXNlLmFsbChkYXRhLnByb21pc2VfYXJyYXkpLnRoZW4oKCk9Pntcblx0XHRcdGRhdGEuZmluaXNoKHRlbXBfZGF0YSk7XG5cdFx0fSk7XG5cdH0sXG5cdGdldDogKGZiaWQsIGNvbW1hbmQpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XG5cdFx0XHRsZXQgc2hhcmVFcnJvciA9IDA7XG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcblx0XHRcdGlmIChjb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcblx0XHRcdFx0Z2V0U2hhcmUoKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7Y29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbY29tbWFuZF19Jm9yZGVyPWNocm9ub2xvZ2ljYWwmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9YCwocmVzKT0+e1xuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0PTApe1xuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KS5mYWlsKCgpPT57XG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBnZXRTaGFyZShhZnRlcj0nJyl7XG5cdFx0XHRcdGxldCB1cmwgPSBgaHR0cHM6Ly9hbTY2YWhndHA4LmV4ZWN1dGUtYXBpLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vc2hhcmU/ZmJpZD0ke2ZiaWQuZnVsbElEfSZhZnRlcj0ke2FmdGVyfWA7XG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRcdFx0aWYgKHJlcyA9PT0gJ2VuZCcpe1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yTWVzc2FnZSl7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHRcdFx0fWVsc2UgaWYocmVzLmRhdGEpe1xuXHRcdFx0XHRcdFx0XHQvLyBzaGFyZUVycm9yID0gMDtcblx0XHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0XHRcdFx0XHRsZXQgbmFtZSA9ICcnO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGkuc3Rvcnkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZSA9IGkuc3Rvcnkuc3Vic3RyaW5nKDAsIGkuc3RvcnkuaW5kZXhPZignIHNoYXJlZCcpKTtcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBpLmlkLnN1YnN0cmluZygwLCBpLmlkLmluZGV4T2YoXCJfXCIpKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0bGV0IGlkID0gaS5pZC5zdWJzdHJpbmcoMCwgaS5pZC5pbmRleE9mKFwiX1wiKSk7XG5cdFx0XHRcdFx0XHRcdFx0aS5mcm9tID0ge2lkLCBuYW1lfTtcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGkpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGdldFNoYXJlKHJlcy5hZnRlcik7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRmaW5pc2g6IChmYmlkKT0+e1xuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHRzdGVwLnN0ZXAyKCk7XG5cdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XG5cdFx0JCgnLnJlc3VsdF9hcmVhID4gLnRpdGxlIHNwYW4nKS50ZXh0KGZiaWQuZnVsbElEKTtcblx0XHRkYXRhLnJhdyA9IGZiaWQ7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyYXdcIiwgSlNPTi5zdHJpbmdpZnkoZmJpZCkpO1xuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcblx0fSxcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSk9Pntcblx0XHRkYXRhLmZpbHRlcmVkID0ge307XG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XG5cdFx0bGV0IGlzVGFnID0gJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIik7XG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocmF3RGF0YS5kYXRhKSl7XG5cdFx0XHRpZiAoa2V5ID09PSAncmVhY3Rpb25zJykgaXNUYWcgPSBmYWxzZTtcblx0XHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEuZGF0YVtrZXldLCBrZXksIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcdFxuXHRcdFx0ZGF0YS5maWx0ZXJlZFtrZXldID0gbmV3RGF0YTtcblx0XHR9XG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKXtcblx0XHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmlsdGVyZWQpO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIGRhdGEuZmlsdGVyZWQ7XG5cdFx0fVxuXHR9LFxuXHRleGNlbDogKHJhdyk9Pntcblx0XHR2YXIgbmV3T2JqID0gW107XG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKXtcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XG5cdFx0XHRcdHZhciB0bXAgPSB7XG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXG5cdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIiA6IHRoaXMucG9zdGxpbmssXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMuc3RvcnksXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxuXHRcdFx0XHR9XG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XG5cdFx0XHRcdHZhciB0bXAgPSB7XG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXG5cdFx0XHRcdFx0XCLlv4Pmg4VcIiA6IHRoaXMudHlwZSB8fCAnJyxcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXG5cdFx0XHRcdH1cblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gbmV3T2JqO1xuXHR9LFxuXHRpbXBvcnQ6IChmaWxlKT0+e1xuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xuXHRcdH1cblxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuXHR9XG59XG5cbmxldCB0YWJsZSA9IHtcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcblx0XHRsZXQgZmlsdGVyZWQgPSByYXdkYXRhO1xuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoZmlsdGVyZWQpKXtcblx0XHRcdGxldCB0aGVhZCA9ICcnO1xuXHRcdFx0bGV0IHRib2R5ID0gJyc7XG5cdFx0XHRpZihrZXkgPT09ICdyZWFjdGlvbnMnKXtcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxuXHRcdFx0XHQ8dGQ+5b+D5oOFPC90ZD5gO1xuXHRcdFx0fWVsc2UgaWYoa2V5ID09PSAnc2hhcmVkcG9zdHMnKXtcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cblx0XHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxuXHRcdFx0XHQ8dGQ+6K6aPC90ZD5cblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJlZFtrZXldLmVudHJpZXMoKSl7XG5cdFx0XHRcdGxldCBwaWN0dXJlID0gJyc7XG5cdFx0XHRcdGlmIChwaWMpe1xuXHRcdFx0XHRcdC8vIHBpY3R1cmUgPSBgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cblx0XHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcblx0XHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XG5cdFx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgdmFsLnN0b3J5fTwvYT48L3RkPlxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxuXHRcdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xuXHRcdFx0XHR0Ym9keSArPSB0cjtcblx0XHRcdH1cblx0XHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcblx0XHRcdCQoXCIudGFibGVzIC5cIitrZXkrXCIgdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XG5cdFx0fVxuXHRcdFxuXHRcdGFjdGl2ZSgpO1xuXHRcdHRhYi5pbml0KCk7XG5cdFx0Y29tcGFyZS5pbml0KCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSh7XG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0XHRsZXQgYXJyID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0YWJsZVxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxuXHRcdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHRhYmxlXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXG5cdFx0XHRcdFx0LmRyYXcoKTtcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHJlZG86ICgpPT57XG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xuXHR9XG59XG5cbmxldCBjb21wYXJlID0ge1xuXHRhbmQ6IFtdLFxuXHRvcjogW10sXG5cdHJhdzogW10sXG5cdGluaXQ6ICgpPT57XG5cdFx0Y29tcGFyZS5hbmQgPSBbXTtcblx0XHRjb21wYXJlLm9yID0gW107XG5cdFx0Y29tcGFyZS5yYXcgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XG5cdFx0bGV0IGlnbm9yZSA9ICQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLnZhbCgpO1xuXHRcdGxldCBiYXNlID0gW107XG5cdFx0bGV0IGZpbmFsID0gW107XG5cdFx0bGV0IGNvbXBhcmVfbnVtID0gMTtcblx0XHRpZiAoaWdub3JlID09PSAnaWdub3JlJykgY29tcGFyZV9udW0gPSAyO1xuXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoY29tcGFyZS5yYXcpKXtcblx0XHRcdGlmIChrZXkgIT09IGlnbm9yZSl7XG5cdFx0XHRcdGZvcihsZXQgaSBvZiBjb21wYXJlLnJhd1trZXldKXtcblx0XHRcdFx0XHRiYXNlLnB1c2goaSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0bGV0IHNvcnQgPSAoZGF0YS5yYXcuZXh0ZW5zaW9uKSA/ICduYW1lJzonaWQnO1xuXHRcdGJhc2UgPSBiYXNlLnNvcnQoKGEsYik9Pntcblx0XHRcdHJldHVybiBhLmZyb21bc29ydF0gPiBiLmZyb21bc29ydF0gPyAxOi0xO1xuXHRcdH0pO1xuXG5cdFx0Zm9yKGxldCBpIG9mIGJhc2Upe1xuXHRcdFx0aS5tYXRjaCA9IDA7XG5cdFx0fVxuXG5cdFx0bGV0IHRlbXAgPSAnJztcblx0XHRsZXQgdGVtcF9uYW1lID0gJyc7XG5cdFx0Ly8gY29uc29sZS5sb2coYmFzZSk7XG5cdFx0Zm9yKGxldCBpIGluIGJhc2Upe1xuXHRcdFx0bGV0IG9iaiA9IGJhc2VbaV07XG5cdFx0XHRpZiAob2JqLmZyb20uaWQgPT0gdGVtcCB8fCAoZGF0YS5yYXcuZXh0ZW5zaW9uICYmIChvYmouZnJvbS5uYW1lID09IHRlbXBfbmFtZSkpKXtcblx0XHRcdFx0bGV0IHRhciA9IGZpbmFsW2ZpbmFsLmxlbmd0aC0xXTtcblx0XHRcdFx0dGFyLm1hdGNoKys7XG5cdFx0XHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKG9iaikpe1xuXHRcdFx0XHRcdGlmICghdGFyW2tleV0pIHRhcltrZXldID0gb2JqW2tleV07IC8v5ZCI5L216LOH5paZXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRhci5tYXRjaCA9PSBjb21wYXJlX251bSl7XG5cdFx0XHRcdFx0dGVtcF9uYW1lID0gJyc7XG5cdFx0XHRcdFx0dGVtcCA9ICcnO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZmluYWwucHVzaChvYmopO1xuXHRcdFx0XHR0ZW1wID0gb2JqLmZyb20uaWQ7XG5cdFx0XHRcdHRlbXBfbmFtZSA9IG9iai5mcm9tLm5hbWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0XG5cdFx0Y29tcGFyZS5vciA9IGZpbmFsO1xuXHRcdGNvbXBhcmUuYW5kID0gY29tcGFyZS5vci5maWx0ZXIoKHZhbCk9Pntcblx0XHRcdHJldHVybiB2YWwubWF0Y2ggPT0gY29tcGFyZV9udW07XG5cdFx0fSk7XG5cdFx0Y29tcGFyZS5nZW5lcmF0ZSgpO1xuXHR9LFxuXHRnZW5lcmF0ZTogKCk9Pntcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xuXHRcdGxldCBkYXRhX2FuZCA9IGNvbXBhcmUuYW5kO1xuXG5cdFx0bGV0IHRib2R5ID0gJyc7XG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX2FuZC5lbnRyaWVzKCkpe1xuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCAnJ308L2E+PC90ZD5cblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcwJ308L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcblx0XHRcdHRib2R5ICs9IHRyO1xuXHRcdH1cblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuYW5kIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XG5cblx0XHRsZXQgZGF0YV9vciA9IGNvbXBhcmUub3I7XG5cdFx0bGV0IHRib2R5MiA9ICcnO1xuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9vci5lbnRyaWVzKCkpe1xuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCAnJ308L2E+PC90ZD5cblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcnfTwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xuXHRcdFx0dGJvZHkyICs9IHRyO1xuXHRcdH1cblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUub3IgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5Mik7XG5cdFx0XG5cdFx0YWN0aXZlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoe1xuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdFx0bGV0IGFyciA9IFsnYW5kJywnb3InXTtcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xuXHRcdFx0XHRsZXQgdGFibGUgPSAkKCcudGFibGVzIC4nK2krJyB0YWJsZScpLkRhdGFUYWJsZSgpO1xuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHRhYmxlXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXG5cdFx0XHRcdFx0LmRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dGFibGVcblx0XHRcdFx0XHQuY29sdW1ucygyKVxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcblx0XHRcdFx0XHQuZHJhdygpO1xuXHRcdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5sZXQgY2hvb3NlID0ge1xuXHRkYXRhOiBbXSxcblx0YXdhcmQ6IFtdLFxuXHRudW06IDAsXG5cdGRldGFpbDogZmFsc2UsXG5cdGxpc3Q6IFtdLFxuXHRpbml0OiAoY3RybCA9IGZhbHNlKT0+e1xuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcblx0XHRjaG9vc2UubnVtID0gMDtcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcblx0XHRcdFx0aWYgKG4gPiAwKXtcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xuXHRcdH1cblx0XHRjaG9vc2UuZ28oY3RybCk7XG5cdH0sXG5cdGdvOiAoY3RybCk9Pntcblx0XHRsZXQgY29tbWFuZCA9IHRhYi5ub3c7XG5cdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XG5cdFx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXS5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1xuXHRcdH1lbHNle1xuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGFbY29tbWFuZF0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcdFxuXHRcdH1cblx0XHRsZXQgaW5zZXJ0ID0gJyc7XG5cdFx0bGV0IHRlbXBBcnIgPSBbXTtcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XG5cdFx0XHQkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLmNvbHVtbigyKS5kYXRhKCkuZWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpe1xuXHRcdFx0XHRsZXQgd29yZCA9ICQoJy5zZWFyY2hDb21tZW50JykudmFsKCk7XG5cdFx0XHRcdGlmICh2YWx1ZS5pbmRleE9mKHdvcmQpID49IDApIHRlbXBBcnIucHVzaChpbmRleCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Zm9yKGxldCBpIG9mIGNob29zZS5hd2FyZCl7XG5cdFx0XHRsZXQgcm93ID0gKHRlbXBBcnIubGVuZ3RoID09IDApID8gaTp0ZW1wQXJyW2ldO1xuXHRcdFx0bGV0IHRhciA9ICQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkucm93KHJvdykubm9kZSgpLmlubmVySFRNTDtcblx0XHRcdGluc2VydCArPSAnPHRyPicgKyB0YXIgKyAnPC90cj4nO1xuXHRcdH1cblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xuXHRcdGlmICghY3RybCl7XG5cdFx0XHQkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdC8vIGxldCB0YXIgPSAkKHRoaXMpLmZpbmQoJ3RkJykuZXEoMSk7XG5cdFx0XHRcdC8vIGxldCBpZCA9IHRhci5maW5kKCdhJykuYXR0cignYXR0ci1mYmlkJyk7XG5cdFx0XHRcdC8vIHRhci5wcmVwZW5kKGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdFxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xuXG5cdFx0aWYoY2hvb3NlLmRldGFpbCl7XG5cdFx0XHRsZXQgbm93ID0gMDtcblx0XHRcdGZvcihsZXQgayBpbiBjaG9vc2UubGlzdCl7XG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjdcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XG5cdFx0XHR9XG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XG5cdFx0fVxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcblx0fVxufVxuXG5sZXQgZmlsdGVyID0ge1xuXHR0b3RhbEZpbHRlcjogKHJhdywgY29tbWFuZCwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9Pntcblx0XHRsZXQgZGF0YSA9IHJhdztcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XG5cdFx0fVxuXHRcdGlmICh3b3JkICE9PSAnJyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xuXHRcdH1cblx0XHRpZiAoaXNUYWcgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xuXHRcdH1cblx0XHRpZiAoY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIGVuZFRpbWUpO1xuXHRcdH1lbHNle1xuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH0sXG5cdHVuaXF1ZTogKGRhdGEpPT57XG5cdFx0bGV0IG91dHB1dCA9IFtdO1xuXHRcdGxldCBrZXlzID0gW107XG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH0sXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0dGFnOiAoZGF0YSk9Pntcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3QXJ5O1xuXHR9LFxuXHR0aW1lOiAoZGF0YSwgdCk9Pntcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuZXdBcnk7XG5cdFx0fVxuXHR9XG59XG5cbmxldCB1aSA9IHtcblx0aW5pdDogKCk9PntcblxuXHR9XG59XG5cbmxldCB0YWIgPSB7XG5cdG5vdzogXCJjb21tZW50c1wiLFxuXHRpbml0OiAoKT0+e1xuXHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0dGFiLm5vdyA9ICQodGhpcykuYXR0cignYXR0ci10eXBlJyk7XG5cdFx0XHRsZXQgdGFyID0gJCh0aGlzKS5pbmRleCgpO1xuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5lcSh0YXIpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xuXHRcdFx0XHRjb21wYXJlLmluaXQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5cblxuZnVuY3Rpb24gbm93RGF0ZSgpe1xuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcbn1cblxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcbiAgICAgaWYgKGRhdGUgPCAxMCl7XG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XG4gICAgIH1cbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XG4gICAgIGlmIChob3VyIDwgMTApe1xuICAgICBcdGhvdXIgPSBcIjBcIitob3VyO1xuICAgICB9XG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcbiAgICAgaWYgKG1pbiA8IDEwKXtcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XG4gICAgIH1cbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xuICAgICBpZiAoc2VjIDwgMTApe1xuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcbiAgICAgfVxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcbiAgICAgcmV0dXJuIHRpbWU7XG4gfVxuXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcbiBcdH0pO1xuIFx0cmV0dXJuIGFycmF5O1xuIH1cblxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcbiBcdHZhciBpLCByLCB0O1xuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XG4gXHRcdGFyeVtpXSA9IGk7XG4gXHR9XG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xuIFx0XHR0ID0gYXJ5W3JdO1xuIFx0XHRhcnlbcl0gPSBhcnlbaV07XG4gXHRcdGFyeVtpXSA9IHQ7XG4gXHR9XG4gXHRyZXR1cm4gYXJ5O1xuIH1cblxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xuICAgIFxuICAgIHZhciBDU1YgPSAnJzsgICAgXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXG4gICAgXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XG5cbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxuICAgIGlmIChTaG93TGFiZWwpIHtcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XG4gICAgICAgIFxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcbiAgICB9XG4gICAgXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xuICAgICAgICBcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xuICAgIH1cblxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gICBcbiAgICBcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxuICAgIFxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcbiAgICBcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXG4gICAgXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxuICAgIGxpbmsuaHJlZiA9IHVyaTtcbiAgICBcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XG4gICAgXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpbmsuY2xpY2soKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xufSJdfQ==
