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
			$("#btn_excel").text("Xuất excel");
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
					"Mã số": i + 1,
					"臉書連結": 'http://www.facebook.com/' + this.from.id,
					"Tên": this.from.name,
					"分享連結": this.postlink,
					"Nội dung tin nhắn": this.story,
					"Like": this.like_count
				};
				newObj.push(tmp);
			});
		} else {
			$.each(raw, function (i) {
				var tmp = {
					"Mã số": i + 1,
					"臉書連結": 'http://www.facebook.com/' + this.from.id,
					"Tên": this.from.name,
					"Tâm trạng": this.type || '',
					"Nội dung tin nhắn": this.message || this.story,
					"Thời gian để lại lời nhắn": timeConverter(this.created_time)
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
					thead = "<td>M\xE3 s\u1ED1</td>\n\t\t\t\t<td>T\xEAn</td>\n\t\t\t\t<td>T\xE2m tr\u1EA1ng</td>";
				} else if (key === 'sharedposts') {
					thead = "<td>M\xE3 s\u1ED1</td>\n\t\t\t\t<td>T\xEAn</td>\n\t\t\t\t<td class=\"force-break\">N\u1ED9i dung tin nh\u1EAFn</td>\n\t\t\t\t<td width=\"110\">Th\u1EDDi gian \u0111\u1EC3 l\u1EA1i l\u1EDDi nh\u1EAFn</td>";
				} else {
					thead = "<td>M\xE3 s\u1ED1</td>\n\t\t\t\t<td width=\"200\">T\xEAn</td>\n\t\t\t\t<td class=\"force-break\">N\u1ED9i dung tin nh\u1EAFn</td>\n\t\t\t\t<td>Like</td>\n\t\t\t\t<td class=\"nowrap\">Th\u1EDDi gian \u0111\u1EC3 l\u1EA1i l\u1EDDi nh\u1EAFn</td>";
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
				$("<tr><td class=\"prizeName\" colspan=\"7\">T\xEAn s\u1EA3n ph\u1EA9m\uFF1A " + choose.list[k].name + " <span>\u5171 " + choose.list[k].num + " \u540D</span></td></tr>").insertBefore(tar);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4tdmlldG5hbS5qcyJdLCJuYW1lcyI6WyJlcnJvck1lc3NhZ2UiLCJ3aW5kb3ciLCJvbmVycm9yIiwiaGFuZGxlRXJyIiwibXNnIiwidXJsIiwibCIsImNvbnNvbGUiLCJsb2ciLCIkIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImxhc3REYXRhIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImRhdGEiLCJmaW5pc2giLCJzZXNzaW9uU3RvcmFnZSIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJjbGljayIsImUiLCJleHRlbnNpb25BdXRoIiwiZ2V0QXV0aCIsImN0cmxLZXkiLCJhbHRLZXkiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwia2V5ZG93biIsInRleHQiLCJrZXl1cCIsIm9uIiwidGFibGUiLCJyZWRvIiwiY2hhbmdlIiwiY29uZmlnIiwiZmlsdGVyIiwicmVhY3QiLCJ2YWwiLCJjb21wYXJlIiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsImVuZFRpbWUiLCJmb3JtYXQiLCJzZXRTdGFydERhdGUiLCJub3dEYXRlIiwiZmlsdGVyRGF0YSIsInJhdyIsImRkIiwidGFiIiwibm93Iiwic3RyaW5naWZ5Iiwib3BlbiIsImZvY3VzIiwibGVuZ3RoIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiZXhjZWwiLCJleGNlbFN0cmluZyIsImNpX2NvdW50ZXIiLCJpbXBvcnQiLCJmaWxlcyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaWtlcyIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwibmV3ZXN0Iiwid29yZCIsIm9yZGVyIiwiYXV0aCIsImV4dGVuc2lvbiIsInBhZ2VUb2tlbiIsIm5leHQiLCJ0eXBlIiwiRkIiLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFN0ciIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJpbmRleE9mIiwic3dhbCIsImRvbmUiLCJmYmlkIiwiUHJvbWlzZSIsImFsbCIsImdldE1lIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsIm9wdGlvbnMiLCJpIiwiaiIsImlkIiwibmFtZSIsInNlbGVjdFBhZ2UiLCJ0YXIiLCJhdHRyIiwic2V0VG9rZW4iLCJzdGVwIiwic3RlcDEiLCJwYWdlaWQiLCJwYWdlcyIsImFjY2Vzc190b2tlbiIsImhpZGRlblN0YXJ0IiwicGFnZUlEIiwiY2xlYXIiLCJlbXB0eSIsIm9mZiIsImZpbmQiLCJjb21tYW5kIiwiYXBpIiwicGFnaW5nIiwic3RyIiwiZ2VuRGF0YSIsIm1lc3NhZ2UiLCJyZWNvbW1hbmQiLCJnZW5DYXJkIiwib2JqIiwiaWRzIiwic3BsaXQiLCJsaW5rIiwibWVzcyIsInJlcGxhY2UiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwic3JjIiwiZnVsbF9waWN0dXJlIiwicmVzb2x2ZSIsInJlamVjdCIsImFyciIsImV4dGVuc2lvbkNhbGxiYWNrIiwiZXh0ZW5kIiwiZmlkIiwicHVzaCIsImZyb20iLCJwcm9taXNlX2FycmF5IiwibmFtZXMiLCJwcm9taXNlIiwiZ2V0TmFtZSIsIk9iamVjdCIsImtleXMiLCJ0aXRsZSIsImh0bWwiLCJ0b1N0cmluZyIsInNjcm9sbFRvcCIsInN0ZXAyIiwiZmlsdGVyZWQiLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJ0ZXN0IiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJjb21tYW5kcyIsInRlbXBfZGF0YSIsImdldCIsImRhdGFzIiwic2hhcmVFcnJvciIsImdldFNoYXJlIiwiZCIsInVwZGF0ZWRfdGltZSIsImdldE5leHQiLCJnZXRKU09OIiwiZmFpbCIsImFmdGVyIiwic3RvcnkiLCJzdWJzdHJpbmciLCJzZXRJdGVtIiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJwcm9wIiwiaXNUYWciLCJrZXkiLCJuZXdEYXRhIiwidG90YWxGaWx0ZXIiLCJvYmoyQXJyYXkiLCJuZXdPYmoiLCJlYWNoIiwidG1wIiwicG9zdGxpbmsiLCJsaWtlX2NvdW50IiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwicGljIiwidGhlYWQiLCJ0Ym9keSIsImVudHJpZXMiLCJwaWN0dXJlIiwidGQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJzZWFyY2giLCJ2YWx1ZSIsImRyYXciLCJhbmQiLCJvciIsImlnbm9yZSIsImJhc2UiLCJmaW5hbCIsImNvbXBhcmVfbnVtIiwic29ydCIsImEiLCJiIiwibWF0Y2giLCJ0ZW1wIiwidGVtcF9uYW1lIiwiZGF0YV9hbmQiLCJkYXRhX29yIiwidGJvZHkyIiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwiY3RybCIsIm4iLCJwYXJzZUludCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwidGVtcEFyciIsImNvbHVtbiIsImluZGV4Iiwicm93Iiwibm9kZSIsImlubmVySFRNTCIsImVxIiwicHJlcGVuZCIsImsiLCJpbnNlcnRCZWZvcmUiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0IiwiZm9yRWFjaCIsIml0ZW0iLCJuZXdBcnkiLCJncmVwIiwibWVzc2FnZV90YWdzIiwidCIsInRpbWVfYXJ5IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwidWkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJtYXAiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInNsaWNlIiwiYWxlcnQiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFlQyxTQUFmOztBQUVBLFNBQVNBLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXVCQyxHQUF2QixFQUEyQkMsQ0FBM0IsRUFDQTtBQUNDLEtBQUksQ0FBQ04sWUFBTCxFQUFrQjtBQUNqQk8sVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWdELDRCQUFoRDtBQUNBQyxJQUFFLGlCQUFGLEVBQXFCQyxNQUFyQjtBQUNBVixpQkFBZSxJQUFmO0FBQ0E7QUFDRCxRQUFPLEtBQVA7QUFDQTtBQUNEUyxFQUFFRSxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUMzQixLQUFJQyxXQUFXQyxLQUFLQyxLQUFMLENBQVdDLGFBQWFDLE9BQWIsQ0FBcUIsS0FBckIsQ0FBWCxDQUFmO0FBQ0EsS0FBSUosUUFBSixFQUFhO0FBQ1pLLE9BQUtDLE1BQUwsQ0FBWU4sUUFBWjtBQUNBO0FBQ0QsS0FBSU8sZUFBZUMsS0FBbkIsRUFBeUI7QUFDeEJDLEtBQUdDLFNBQUgsQ0FBYVQsS0FBS0MsS0FBTCxDQUFXSyxlQUFlQyxLQUExQixDQUFiO0FBQ0E7O0FBRURaLEdBQUUsK0JBQUYsRUFBbUNlLEtBQW5DLENBQXlDLFVBQVNDLENBQVQsRUFBVztBQUNuREgsS0FBR0ksYUFBSDtBQUNBLEVBRkQ7O0FBSUFqQixHQUFFLGVBQUYsRUFBbUJlLEtBQW5CLENBQXlCLFVBQVNDLENBQVQsRUFBVztBQUNuQ0gsS0FBR0ss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UzZTLElBQVQsQ0FBY0MsV0FBZCxDQUEwQjdLLElBQTFCO0FBQ0FBLE1BQUtwSCxLQUFMO0FBQ0FiLFVBQVM2UyxJQUFULENBQWNFLFdBQWQsQ0FBMEI5SyxJQUExQjtBQUNIIiwiZmlsZSI6Im1haW4tdmlldG5hbS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcdFxyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHRsZXQgbGFzdERhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmF3XCIpKTtcclxuXHRpZiAobGFzdERhdGEpe1xyXG5cdFx0ZGF0YS5maW5pc2gobGFzdERhdGEpO1xyXG5cdH1cclxuXHRpZiAoc2Vzc2lvblN0b3JhZ2UubG9naW4pe1xyXG5cdFx0ZmIuZ2VuT3B0aW9uKEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pKTtcclxuXHR9XHJcblxyXG5cdCQoXCIudGFibGVzID4gLnNoYXJlZHBvc3RzIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcclxuXHR9KTtcclxuXHRcclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX3N0YXJ0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHRjaG9vc2UuaW5pdCh0cnVlKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8ICFlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCJYdeG6pXQgZXhjZWxcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudGFibGVzIC5maWx0ZXJzIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcuY29tcGFyZV9jb25kaXRpb24nKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLicrICQodGhpcykudmFsKCkpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVktTU0tREQgICBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUobm93RGF0ZSgpKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5KXtcclxuXHRcdFx0bGV0IGRkO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhW3RhYi5ub3ddKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgZGQ7XHJcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xyXG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKXtcclxuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhW3RhYi5ub3ddKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRjaV9jb3VudGVyKys7XHJcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KXtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYoZS5jdHJsS2V5KXtcclxuXHRcdFx0ZmIuZ2V0QXV0aCgnc2hhcmVkcG9zdHMnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCdtZXNzYWdlX3RhZ3MnLCdtZXNzYWdlJywnZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbJ2NyZWF0ZWRfdGltZScsJ2Zyb20nLCdtZXNzYWdlJywnc3RvcnknXSxcclxuXHRcdGxpa2VzOiBbJ25hbWUnXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuNycsXHJcblx0XHRyZWFjdGlvbnM6ICd2Mi43JyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjIuMycsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi43JyxcclxuXHRcdGZlZWQ6ICd2Mi45JyxcclxuXHRcdGdyb3VwOiAndjIuOScsXHJcblx0XHRuZXdlc3Q6ICd2Mi44J1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0b3JkZXI6ICcnLFxyXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLHVzZXJfbWFuYWdlZF9ncm91cHMsbWFuYWdlX3BhZ2VzJyxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRuZXh0OiAnJyxcclxuXHRnZXRBdXRoOiAodHlwZSk9PntcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIil7XHJcblx0XHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCdtYW5hZ2VfcGFnZXMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9tYW5hZ2VkX2dyb3VwcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XHJcblx0XHRcdFx0XHRmYi5zdGFydCgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+aOiOasiuWkseaVl++8jOiri+e1puS6iOaJgOacieasiumZkCcsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRQcm9taXNlLmFsbChbZmIuZ2V0TWUoKSxmYi5nZXRQYWdlKCksIGZiLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XHJcblx0XHRcdHNlc3Npb25TdG9yYWdlLmxvZ2luID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuXHRcdFx0ZmIuZ2VuT3B0aW9uKHJlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbk9wdGlvbjogKHJlcyk9PntcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCBvcHRpb25zID0gJyc7XHJcblx0XHRsZXQgdHlwZSA9IC0xO1xyXG5cdFx0JCgnI2J0bl9zdGFydCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcclxuXHRcdFx0dHlwZSsrO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgaSl7XHJcblx0XHRcdFx0b3B0aW9ucyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgYXR0ci10eXBlPVwiJHt0eXBlfVwiIGF0dHItdmFsdWU9XCIke2ouaWR9XCIgb25jbGljaz1cImZiLnNlbGVjdFBhZ2UodGhpcylcIj4ke2oubmFtZX08L2Rpdj5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcjZW50ZXJVUkwnKS5hcHBlbmQob3B0aW9ucykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6IChlKT0+e1xyXG5cdFx0JCgnI2VudGVyVVJMIC5wYWdlX2J0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCB0YXIgPSAkKGUpO1xyXG5cdFx0dGFyLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGlmICh0YXIuYXR0cignYXR0ci10eXBlJykgPT0gMSl7XHJcblx0XHRcdGZiLnNldFRva2VuKHRhci5hdHRyKCdhdHRyLXZhbHVlJykpO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZmVlZCh0YXIuYXR0cignYXR0ci12YWx1ZScpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQpO1xyXG5cdFx0c3RlcC5zdGVwMSgpO1xyXG5cdH0sXHJcblx0c2V0VG9rZW46IChwYWdlaWQpPT57XHJcblx0XHRsZXQgcGFnZXMgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKVsxXTtcclxuXHRcdGZvcihsZXQgaSBvZiBwYWdlcyl7XHJcblx0XHRcdGlmIChpLmlkID09IHBhZ2VpZCl7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IGkuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRoaWRkZW5TdGFydDogKCk9PntcclxuXHRcdGxldCBmYmlkID0gJCgnaGVhZGVyIC5kZXYgaW5wdXQnKS52YWwoKTtcclxuXHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0fSxcclxuXHRmZWVkOiAocGFnZUlELCB0eXBlLCB1cmwgPSAnJywgY2xlYXIgPSB0cnVlKT0+e1xyXG5cdFx0aWYgKGNsZWFyKXtcclxuXHRcdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHRcdCQoJy5mZWVkcyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5vZmYoJ2NsaWNrJykuY2xpY2soKCk9PntcclxuXHRcdFx0XHRsZXQgdGFyID0gJCgnI2VudGVyVVJMIHNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xyXG5cdFx0XHRcdGZiLmZlZWQodGFyLnZhbCgpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQsIGZhbHNlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRsZXQgY29tbWFuZCA9ICh0eXBlID09ICcyJykgPyAnZmVlZCc6J3Bvc3RzJztcclxuXHRcdGxldCBhcGk7XHJcblx0XHRpZiAodXJsID09ICcnKXtcclxuXHRcdFx0YXBpID0gYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VJRH0vJHtjb21tYW5kfT9maWVsZHM9bGluayxmdWxsX3BpY3R1cmUsY3JlYXRlZF90aW1lLG1lc3NhZ2UmbGltaXQ9MjVgO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFwaSA9IHVybDtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShhcGksIChyZXMpPT57XHJcblx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPT0gMCl7XHJcblx0XHRcdFx0JCgnLmZlZWRzIC5idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZiLm5leHQgPSByZXMucGFnaW5nLm5leHQ7XHJcblx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0bGV0IHN0ciA9IGdlbkRhdGEoaSk7XHJcblx0XHRcdFx0JCgnLnNlY3Rpb24gLmZlZWRzIHRib2R5JykuYXBwZW5kKHN0cik7XHJcblx0XHRcdFx0aWYgKGkubWVzc2FnZSAmJiBpLm1lc3NhZ2UuaW5kZXhPZign5oq9JykgPj0gMCl7XHJcblx0XHRcdFx0XHRsZXQgcmVjb21tYW5kID0gZ2VuQ2FyZChpKTtcclxuXHRcdFx0XHRcdCQoJy5kb25hdGVfYXJlYSAucmVjb21tYW5kcycpLmFwcGVuZChyZWNvbW1hbmQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2VuRGF0YShvYmope1xyXG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcclxuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XHJcblxyXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRsZXQgc3RyID0gYDx0cj5cclxuXHRcdFx0XHRcdFx0PHRkPjxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiAgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIob2JqLmNyZWF0ZWRfdGltZSl9PC90ZD5cclxuXHRcdFx0XHRcdFx0PC90cj5gO1xyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZ2VuQ2FyZChvYmope1xyXG5cdFx0XHRsZXQgc3JjID0gb2JqLmZ1bGxfcGljdHVyZSB8fCAnaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4MjI1JztcclxuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XHJcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0bGV0XHRzdHIgPSBgPGRpdiBjbGFzcz1cImNhcmRcIj5cclxuXHRcdFx0PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtaW1hZ2VcIj5cclxuXHRcdFx0PGZpZ3VyZSBjbGFzcz1cImltYWdlIGlzLTRieTNcIj5cclxuXHRcdFx0PGltZyBzcmM9XCIke3NyY31cIiBhbHQ9XCJcIj5cclxuXHRcdFx0PC9maWd1cmU+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2E+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWNvbnRlbnRcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuXHRcdFx0JHttZXNzfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj5cclxuXHRcdFx0PC9kaXY+YDtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldE1lOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lYCwgKHJlcyk9PntcclxuXHRcdFx0XHRsZXQgYXJyID0gW3Jlc107XHJcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRkYXRhLnJhdy5leHRlbnNpb24gPSB0cnVlO1xyXG5cdFx0XHRcdGxldCBleHRlbmQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2hhcmVkcG9zdHNcIikpO1xyXG5cdFx0XHRcdGxldCBmaWQgPSBbXTtcclxuXHRcdFx0XHRsZXQgaWRzID0gW107XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRmaWQucHVzaChpLmZyb20uaWQpO1xyXG5cdFx0XHRcdFx0aWYgKGZpZC5sZW5ndGggPj00NSl7XHJcblx0XHRcdFx0XHRcdGlkcy5wdXNoKGZpZCk7XHJcblx0XHRcdFx0XHRcdGZpZCA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZHMucHVzaChmaWQpO1xyXG5cdFx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW10sIG5hbWVzID0ge307XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGlkcyl7XHJcblx0XHRcdFx0XHRsZXQgcHJvbWlzZSA9IGZiLmdldE5hbWUoaSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgT2JqZWN0LmtleXMocmVzKSl7XHJcblx0XHRcdFx0XHRcdFx0bmFtZXNbaV0gPSByZXNbaV07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0UHJvbWlzZS5hbGwocHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdGkuZnJvbS5uYW1lID0gbmFtZXNbaS5mcm9tLmlkXSA/IG5hbWVzW2kuZnJvbS5pZF0ubmFtZSA6IGkuZnJvbS5uYW1lO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZGF0YS5yYXcuZGF0YS5zaGFyZWRwb3N0cyA9IGV4dGVuZDtcclxuXHRcdFx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcyk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcbmxldCBzdGVwID0ge1xyXG5cdHN0ZXAxOiAoKT0+e1xyXG5cdFx0JCgnLnNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc3RlcDInKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcclxuXHR9LFxyXG5cdHN0ZXAyOiAoKT0+e1xyXG5cdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHQkKCcuc2VjdGlvbicpLmFkZENsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiB7fSxcclxuXHRmaWx0ZXJlZDoge30sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwcm9taXNlX2FycmF5OiBbXSxcclxuXHR0ZXN0OiAoaWQpPT57XHJcblx0XHRjb25zb2xlLmxvZyhpZCk7XHJcblx0fSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGRhdGEucHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCk9PntcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0ZnVsbElEOiBmYmlkXHJcblx0XHR9XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0bGV0IGNvbW1hbmRzID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRsZXQgdGVtcF9kYXRhID0gb2JqO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGNvbW1hbmRzKXtcclxuXHRcdFx0dGVtcF9kYXRhLmRhdGEgPSB7fTtcclxuXHRcdFx0bGV0IHByb21pc2UgPSBkYXRhLmdldCh0ZW1wX2RhdGEsIGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHR0ZW1wX2RhdGEuZGF0YVtpXSA9IHJlcztcclxuXHRcdFx0fSk7XHJcblx0XHRcdGRhdGEucHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdFByb21pc2UuYWxsKGRhdGEucHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRkYXRhLmZpbmlzaCh0ZW1wX2RhdGEpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkLCBjb21tYW5kKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgc2hhcmVFcnJvciA9IDA7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpIGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHRpZiAoY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0Z2V0U2hhcmUoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2NvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2NvbW1hbmRdfSZvcmRlcj1jaHJvbm9sb2dpY2FsJmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtjb21tYW5kXS50b1N0cmluZygpfWAsKHJlcyk9PntcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLmlkfTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLmlkfTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXRTaGFyZShhZnRlcj0nJyl7XHJcblx0XHRcdFx0bGV0IHVybCA9IGBodHRwczovL2FtNjZhaGd0cDguZXhlY3V0ZS1hcGkuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbS9zaGFyZT9mYmlkPSR7ZmJpZC5mdWxsSUR9JmFmdGVyPSR7YWZ0ZXJ9YDtcclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0aWYgKHJlcyA9PT0gJ2VuZCcpe1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yTWVzc2FnZSl7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHRcdH1lbHNlIGlmKHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0XHQvLyBzaGFyZUVycm9yID0gMDtcclxuXHRcdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IG5hbWUgPSAnJztcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGkuc3Rvcnkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lID0gaS5zdG9yeS5zdWJzdHJpbmcoMCwgaS5zdG9yeS5pbmRleE9mKCcgc2hhcmVkJykpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBpLmlkLnN1YnN0cmluZygwLCBpLmlkLmluZGV4T2YoXCJfXCIpKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGxldCBpZCA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aS5mcm9tID0ge2lkLCBuYW1lfTtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goaSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGdldFNoYXJlKHJlcy5hZnRlcik7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKT0+e1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRzdGVwLnN0ZXAyKCk7XHJcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdCQoJy5yZXN1bHRfYXJlYSA+IC50aXRsZSBzcGFuJykudGV4dChmYmlkLmZ1bGxJRCk7XHJcblx0XHRkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJhd1wiLCBKU09OLnN0cmluZ2lmeShmYmlkKSk7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXJlZCA9IHt9O1xyXG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHJhd0RhdGEuZGF0YSkpe1xyXG5cdFx0XHRpZiAoa2V5ID09PSAncmVhY3Rpb25zJykgaXNUYWcgPSBmYWxzZTtcclxuXHRcdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YS5kYXRhW2tleV0sIGtleSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1x0XHJcblx0XHRcdGRhdGEuZmlsdGVyZWRba2V5XSA9IG5ld0RhdGE7XHJcblx0XHR9XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpe1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbHRlcmVkKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gZGF0YS5maWx0ZXJlZDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4Y2VsOiAocmF3KT0+e1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKXtcclxuXHRcdFx0JC5lYWNoKHJhdyxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCJNw6Mgc+G7kVwiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIlTDqm5cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIiA6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcIk7hu5lpIGR1bmcgdGluIG5o4bqvblwiIDogdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwiTGlrZVwiIDogdGhpcy5saWtlX2NvdW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwiTcOjIHPhu5FcIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCJUw6puXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwiVMOibSB0cuG6oW5nXCIgOiB0aGlzLnR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIk7hu5lpIGR1bmcgdGluIG5o4bqvblwiIDogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIlRo4budaSBnaWFuIMSR4buDIGzhuqFpIGzhu51pIG5o4bqvblwiIDogdGltZUNvbnZlcnRlcih0aGlzLmNyZWF0ZWRfdGltZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3T2JqO1xyXG5cdH0sXHJcblx0aW1wb3J0OiAoZmlsZSk9PntcclxuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHRcdFx0ZGF0YS5yYXcgPSBKU09OLnBhcnNlKHN0cik7XHJcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpPT57XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZmlsdGVyZWQgPSByYXdkYXRhO1xyXG5cdFx0bGV0IHBpYyA9ICQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGZpbHRlcmVkKSl7XHJcblx0XHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPk3DoyBz4buRPC90ZD5cclxuXHRcdFx0XHQ8dGQ+VMOqbjwvdGQ+XHJcblx0XHRcdFx0PHRkPlTDom0gdHLhuqFuZzwvdGQ+YDtcclxuXHRcdFx0fWVsc2UgaWYoa2V5ID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+TcOjIHPhu5E8L3RkPlxyXG5cdFx0XHRcdDx0ZD5Uw6puPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPk7hu5lpIGR1bmcgdGluIG5o4bqvbjwvdGQ+XHJcblx0XHRcdFx0PHRkIHdpZHRoPVwiMTEwXCI+VGjhu51pIGdpYW4gxJHhu4MgbOG6oWkgbOG7nWkgbmjhuq9uPC90ZD5gO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+TcOjIHPhu5E8L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPlTDqm48L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+TuG7mWkgZHVuZyB0aW4gbmjhuq9uPC90ZD5cclxuXHRcdFx0XHQ8dGQ+TGlrZTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+VGjhu51pIGdpYW4gxJHhu4MgbOG6oWkgbOG7nWkgbmjhuq9uPC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgdmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0XHQkKFwiLnRhYmxlcyAuXCIra2V5K1wiIHRhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHRcdHRhYi5pbml0KCk7XHJcblx0XHRjb21wYXJlLmluaXQoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjb21wYXJlID0ge1xyXG5cdGFuZDogW10sXHJcblx0b3I6IFtdLFxyXG5cdHJhdzogW10sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdGNvbXBhcmUuYW5kID0gW107XHJcblx0XHRjb21wYXJlLm9yID0gW107XHJcblx0XHRjb21wYXJlLnJhdyA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGxldCBpZ25vcmUgPSAkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS52YWwoKTtcclxuXHRcdGxldCBiYXNlID0gW107XHJcblx0XHRsZXQgZmluYWwgPSBbXTtcclxuXHRcdGxldCBjb21wYXJlX251bSA9IDE7XHJcblx0XHRpZiAoaWdub3JlID09PSAnaWdub3JlJykgY29tcGFyZV9udW0gPSAyO1xyXG5cclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGNvbXBhcmUucmF3KSl7XHJcblx0XHRcdGlmIChrZXkgIT09IGlnbm9yZSl7XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGNvbXBhcmUucmF3W2tleV0pe1xyXG5cdFx0XHRcdFx0YmFzZS5wdXNoKGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IHNvcnQgPSAoZGF0YS5yYXcuZXh0ZW5zaW9uKSA/ICduYW1lJzonaWQnO1xyXG5cdFx0YmFzZSA9IGJhc2Uuc29ydCgoYSxiKT0+e1xyXG5cdFx0XHRyZXR1cm4gYS5mcm9tW3NvcnRdID4gYi5mcm9tW3NvcnRdID8gMTotMTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGZvcihsZXQgaSBvZiBiYXNlKXtcclxuXHRcdFx0aS5tYXRjaCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdGxldCB0ZW1wX25hbWUgPSAnJztcclxuXHRcdC8vIGNvbnNvbGUubG9nKGJhc2UpO1xyXG5cdFx0Zm9yKGxldCBpIGluIGJhc2Upe1xyXG5cdFx0XHRsZXQgb2JqID0gYmFzZVtpXTtcclxuXHRcdFx0aWYgKG9iai5mcm9tLmlkID09IHRlbXAgfHwgKGRhdGEucmF3LmV4dGVuc2lvbiAmJiAob2JqLmZyb20ubmFtZSA9PSB0ZW1wX25hbWUpKSl7XHJcblx0XHRcdFx0bGV0IHRhciA9IGZpbmFsW2ZpbmFsLmxlbmd0aC0xXTtcclxuXHRcdFx0XHR0YXIubWF0Y2grKztcclxuXHRcdFx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKXtcclxuXHRcdFx0XHRcdGlmICghdGFyW2tleV0pIHRhcltrZXldID0gb2JqW2tleV07IC8v5ZCI5L216LOH5paZXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0YXIubWF0Y2ggPT0gY29tcGFyZV9udW0pe1xyXG5cdFx0XHRcdFx0dGVtcF9uYW1lID0gJyc7XHJcblx0XHRcdFx0XHR0ZW1wID0gJyc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmaW5hbC5wdXNoKG9iaik7XHJcblx0XHRcdFx0dGVtcCA9IG9iai5mcm9tLmlkO1xyXG5cdFx0XHRcdHRlbXBfbmFtZSA9IG9iai5mcm9tLm5hbWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdGNvbXBhcmUub3IgPSBmaW5hbDtcclxuXHRcdGNvbXBhcmUuYW5kID0gY29tcGFyZS5vci5maWx0ZXIoKHZhbCk9PntcclxuXHRcdFx0cmV0dXJuIHZhbC5tYXRjaCA9PSBjb21wYXJlX251bTtcclxuXHRcdH0pO1xyXG5cdFx0Y29tcGFyZS5nZW5lcmF0ZSgpO1xyXG5cdH0sXHJcblx0Z2VuZXJhdGU6ICgpPT57XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGRhdGFfYW5kID0gY29tcGFyZS5hbmQ7XHJcblxyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfYW5kLmVudHJpZXMoKSl7XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcwJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuYW5kIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XHJcblxyXG5cdFx0bGV0IGRhdGFfb3IgPSBjb21wYXJlLm9yO1xyXG5cdFx0bGV0IHRib2R5MiA9ICcnO1xyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX29yLmVudHJpZXMoKSl7XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keTIgKz0gdHI7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUub3IgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5Mik7XHJcblx0XHRcclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydhbmQnLCdvciddO1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0XHRsZXQgdGFibGUgPSAkKCcudGFibGVzIC4nK2krJyB0YWJsZScpLkRhdGFUYWJsZSgpO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBjaG9vc2UgPSB7XHJcblx0ZGF0YTogW10sXHJcblx0YXdhcmQ6IFtdLFxyXG5cdG51bTogMCxcclxuXHRkZXRhaWw6IGZhbHNlLFxyXG5cdGxpc3Q6IFtdLFxyXG5cdGluaXQ6IChjdHJsID0gZmFsc2UpPT57XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCl7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbyhjdHJsKTtcclxuXHR9LFxyXG5cdGdvOiAoY3RybCk9PntcclxuXHRcdGxldCBjb21tYW5kID0gdGFiLm5vdztcclxuXHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXS5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhW2NvbW1hbmRdLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHRcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGxldCB0ZW1wQXJyID0gW107XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkuY29sdW1uKDIpLmRhdGEoKS5lYWNoKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCl7XHJcblx0XHRcdFx0bGV0IHdvcmQgPSAkKCcuc2VhcmNoQ29tbWVudCcpLnZhbCgpO1xyXG5cdFx0XHRcdGlmICh2YWx1ZS5pbmRleE9mKHdvcmQpID49IDApIHRlbXBBcnIucHVzaChpbmRleCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBpIG9mIGNob29zZS5hd2FyZCl7XHJcblx0XHRcdGxldCByb3cgPSAodGVtcEFyci5sZW5ndGggPT0gMCkgPyBpOnRlbXBBcnJbaV07XHJcblx0XHRcdGxldCB0YXIgPSAkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLnJvdyhyb3cpLm5vZGUoKS5pbm5lckhUTUw7XHJcblx0XHRcdGluc2VydCArPSAnPHRyPicgKyB0YXIgKyAnPC90cj4nO1xyXG5cdFx0fVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdGlmICghY3RybCl7XHJcblx0XHRcdCQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRsZXQgdGFyID0gJCh0aGlzKS5maW5kKCd0ZCcpLmVxKDEpO1xyXG5cdFx0XHRcdGxldCBpZCA9IHRhci5maW5kKCdhJykuYXR0cignYXR0ci1mYmlkJyk7XHJcblx0XHRcdFx0dGFyLnByZXBlbmQoYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke2lkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHJcblx0XHRpZihjaG9vc2UuZGV0YWlsKXtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvcihsZXQgayBpbiBjaG9vc2UubGlzdCl7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI3XCI+VMOqbiBz4bqjbiBwaOG6qW3vvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhdywgY29tbWFuZCwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9PntcclxuXHRcdGxldCBkYXRhID0gcmF3O1xyXG5cdFx0aWYgKGlzRHVwbGljYXRlKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAod29yZCAhPT0gJycgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIGVuZFRpbWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSk9PntcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHQpPT57XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLChwYXJzZUludCh0aW1lX2FyeVsxXSktMSksdGltZV9hcnlbMl0sdGltZV9hcnlbM10sdGltZV9hcnlbNF0sdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmIChjcmVhdGVkX3RpbWUgPCB0aW1lIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcik9PntcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKT0+e1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWIgPSB7XHJcblx0bm93OiBcImNvbW1lbnRzXCIsXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0dGFiLm5vdyA9ICQodGhpcykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHRcdGxldCB0YXIgPSAkKHRoaXMpLmluZGV4KCk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5lcSh0YXIpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCl7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSsxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XHJcblx0IHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xyXG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG4gICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICAgaWYgKGRhdGUgPCAxMCl7XHJcbiAgICAgXHRkYXRlID0gXCIwXCIrZGF0ZTtcclxuICAgICB9XHJcbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcbiAgICAgaWYgKGhvdXIgPCAxMCl7XHJcbiAgICAgXHRob3VyID0gXCIwXCIraG91cjtcclxuICAgICB9XHJcbiAgICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG4gICAgIGlmIChtaW4gPCAxMCl7XHJcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XHJcbiAgICAgfVxyXG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuICAgICBpZiAoc2VjIDwgMTApe1xyXG4gICAgIFx0c2VjID0gXCIwXCIrc2VjO1xyXG4gICAgIH1cclxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcclxuICAgICByZXR1cm4gdGltZTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcbiAgICBcclxuICAgIHZhciBDU1YgPSAnJzsgICAgXHJcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuICAgIFxyXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuICAgIGlmIChTaG93TGFiZWwpIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXHJcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSAgIFxyXG4gICAgXHJcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcbiAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxyXG4gICAgXHJcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuICAgIFxyXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG4gICAgXHJcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcclxuICAgIGxpbmsuaHJlZiA9IHVyaTtcclxuICAgIFxyXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuICAgIFxyXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
