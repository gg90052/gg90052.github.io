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
							shareError = 0;
							var _iteratorNormalCompletion11 = true;
							var _didIteratorError11 = false;
							var _iteratorError11 = undefined;

							try {
								for (var _iterator11 = res.data[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
									var _i3 = _step11.value;

									var name = _i3.story.substring(0, _i3.story.indexOf(' shared'));
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

						if (!tar[key]) tar[key] = obj[key];
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJsYXN0RGF0YSIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJkYXRhIiwiZmluaXNoIiwic2Vzc2lvblN0b3JhZ2UiLCJsb2dpbiIsImZiIiwiZ2VuT3B0aW9uIiwiY2xpY2siLCJlIiwiZXh0ZW5zaW9uQXV0aCIsImdldEF1dGgiLCJjdHJsS2V5IiwiYWx0S2V5IiwiY2hvb3NlIiwiaW5pdCIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJuZXdlc3QiLCJ3b3JkIiwiYXV0aCIsImV4dGVuc2lvbiIsIm5leHQiLCJ0eXBlIiwiRkIiLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFN0ciIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJpbmRleE9mIiwic3dhbCIsImRvbmUiLCJmYmlkIiwiUHJvbWlzZSIsImFsbCIsImdldE1lIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsIm9wdGlvbnMiLCJpIiwiaiIsImlkIiwibmFtZSIsInNlbGVjdFBhZ2UiLCJ0YXIiLCJhdHRyIiwic3RlcCIsInN0ZXAxIiwiaGlkZGVuU3RhcnQiLCJwYWdlSUQiLCJjbGVhciIsImVtcHR5Iiwib2ZmIiwiZmluZCIsImNvbW1hbmQiLCJhcGkiLCJwYWdpbmciLCJzdHIiLCJnZW5EYXRhIiwibWVzc2FnZSIsInJlY29tbWFuZCIsImdlbkNhcmQiLCJvYmoiLCJpZHMiLCJzcGxpdCIsImxpbmsiLCJtZXNzIiwicmVwbGFjZSIsInRpbWVDb252ZXJ0ZXIiLCJjcmVhdGVkX3RpbWUiLCJzcmMiLCJmdWxsX3BpY3R1cmUiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJyIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJleHRlbmQiLCJmaWQiLCJwdXNoIiwiZnJvbSIsInByb21pc2VfYXJyYXkiLCJuYW1lcyIsInByb21pc2UiLCJnZXROYW1lIiwiT2JqZWN0Iiwia2V5cyIsInRpdGxlIiwiaHRtbCIsInRvU3RyaW5nIiwic2Nyb2xsVG9wIiwic3RlcDIiLCJmaWx0ZXJlZCIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInRlc3QiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImZ1bGxJRCIsImNvbW1hbmRzIiwidGVtcF9kYXRhIiwiZ2V0IiwiZGF0YXMiLCJzaGFyZUVycm9yIiwiZ2V0U2hhcmUiLCJkIiwiZ2V0TmV4dCIsImdldEpTT04iLCJmYWlsIiwiYWZ0ZXIiLCJzdG9yeSIsInN1YnN0cmluZyIsInNldEl0ZW0iLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsImtleSIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsIm5ld09iaiIsImVhY2giLCJ0bXAiLCJwb3N0bGluayIsImxpa2VfY291bnQiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50IiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJwaWMiLCJ0aGVhZCIsInRib2R5IiwiZW50cmllcyIsInBpY3R1cmUiLCJ0ZCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInNlYXJjaCIsInZhbHVlIiwiZHJhdyIsImFuZCIsIm9yIiwiaWdub3JlIiwiYmFzZSIsImZpbmFsIiwiY29tcGFyZV9udW0iLCJzb3J0IiwiYSIsImIiLCJtYXRjaCIsInRlbXAiLCJ0ZW1wX25hbWUiLCJkYXRhX2FuZCIsImRhdGFfb3IiLCJ0Ym9keTIiLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJjdHJsIiwibiIsInBhcnNlSW50IiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJ0ZW1wQXJyIiwiY29sdW1uIiwiaW5kZXgiLCJyb3ciLCJub2RlIiwiaW5uZXJIVE1MIiwiZXEiLCJwcmVwZW5kIiwiayIsImluc2VydEJlZm9yZSIsInVuaXF1ZSIsInRhZyIsInRpbWUiLCJvdXRwdXQiLCJmb3JFYWNoIiwiaXRlbSIsIm5ld0FyeSIsImdyZXAiLCJtZXNzYWdlX3RhZ3MiLCJ0IiwidGltZV9hcnkiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJ1aSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsIm1hcCIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwic2xpY2UiLCJhbGVydCIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwiY3JlYXRlRWxlbWVudCIsImhyZWYiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBO0FBQ0RTLEVBQUVFLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFVO0FBQzNCLEtBQUlDLFdBQVdDLEtBQUtDLEtBQUwsQ0FBV0MsYUFBYUMsT0FBYixDQUFxQixLQUFyQixDQUFYLENBQWY7QUFDQSxLQUFJSixRQUFKLEVBQWE7QUFDWkssT0FBS0MsTUFBTCxDQUFZTixRQUFaO0FBQ0E7QUFDRCxLQUFJTyxlQUFlQyxLQUFuQixFQUF5QjtBQUN4QkMsS0FBR0MsU0FBSCxDQUFhVCxLQUFLQyxLQUFMLENBQVdLLGVBQWVDLEtBQTFCLENBQWI7QUFDQTs7QUFFRFosR0FBRSwrQkFBRixFQUFtQ2UsS0FBbkMsQ0FBeUMsVUFBU0MsQ0FBVCxFQUFXO0FBQ25ESCxLQUFHSSxhQUFIO0FBQ0EsRUFGRDs7QUFJQWpCLEdBQUUsZUFBRixFQUFtQmUsS0FBbkIsQ0FBeUIsVUFBU0MsQ0FBVCxFQUFXO0FBQ25DSCxLQUFHSyxPQUFILENBQVcsVUFBWDtBQUNBLEVBRkQ7O0FBSUFsQixHQUFFLFlBQUYsRUFBZ0JlLEtBQWhCLENBQXNCLFlBQVU7QUFDL0JGLEtBQUdLLE9BQUgsQ0FBVyxVQUFY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QVgsRUFBZTtBQUNYRSxRQUFNLGNBQU47QUFDQTtBQUNIOztBQUVEO0FBQ0EsS0FBSUMsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWU4sWUFBWTVKLE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUltSyxNQUFNLHVDQUF1Q0MsVUFBVUwsR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUlqSyxPQUFPMUgsU0FBU2lTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBdkssTUFBS3dLLElBQUwsR0FBWUgsR0FBWjs7QUFFQTtBQUNBckssTUFBS3lLLEtBQUwsR0FBYSxtQkFBYjtBQUNBekssTUFBSzBLLFFBQUwsR0FBZ0JOLFdBQVcsTUFBM0I7O0FBRUE7QUFDQTlSLFVBQVNxUyxJQUFULENBQWNDLFdBQWQsQ0FBMEI1SyxJQUExQjtBQUNBQSxNQUFLN0csS0FBTDtBQUNBYixVQUFTcVMsSUFBVCxDQUFjRSxXQUFkLENBQTBCN0ssSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1x0XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdGxldCBsYXN0RGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyYXdcIikpO1xyXG5cdGlmIChsYXN0RGF0YSl7XHJcblx0XHRkYXRhLmZpbmlzaChsYXN0RGF0YSk7XHJcblx0fVxyXG5cdGlmIChzZXNzaW9uU3RvcmFnZS5sb2dpbil7XHJcblx0XHRmYi5nZW5PcHRpb24oSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbikpO1xyXG5cdH1cclxuXHJcblx0JChcIi50YWJsZXMgPiAuc2hhcmVkcG9zdHMgYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdH0pO1xyXG5cdFxyXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fc3RhcnRcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdGNob29zZS5pbml0KHRydWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5pbml0KCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0XHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgIWUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLnRhYmxlcyAuZmlsdGVycyAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnRhYmxlcyAudG90YWwgLmZpbHRlcnMgc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb21wYXJlLmluaXQoKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLmNvbXBhcmVfY29uZGl0aW9uJykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZScpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS4nKyAkKHRoaXMpLnZhbCgpKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwic2luZ2xlRGF0ZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZLU1NLUREICAgSEg6bW1cIixcclxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXHJcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxyXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXHJcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxyXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxyXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcclxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcclxuXHRcdFx0XCLml6VcIixcclxuXHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XCLkuoxcIixcclxuXHRcdFx0XCLkuIlcIixcclxuXHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XCLkupRcIixcclxuXHRcdFx0XCLlha1cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xyXG5cdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcIuS6jOaciFwiLFxyXG5cdFx0XHRcIuS4ieaciFwiLFxyXG5cdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcIuS6lOaciFwiLFxyXG5cdFx0XHRcIuWFreaciFwiLFxyXG5cdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcIuWFq+aciFwiLFxyXG5cdFx0XHRcIuS5neaciFwiLFxyXG5cdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcIuWNgeS4gOaciFwiLFxyXG5cdFx0XHRcIuWNgeS6jOaciFwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwiZmlyc3REYXlcIjogMVxyXG5cdFx0fSxcclxuXHR9LGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSl7XHJcblx0XHRcdGxldCBkZDtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YVt0YWIubm93XSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIGRkO1xyXG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHRcdFx0d2luZG93LmZvY3VzKCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCl7XHJcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YVt0YWIubm93XSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcblxyXG5cdGxldCBjaV9jb3VudGVyID0gMDtcclxuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSl7XHJcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdH1cclxuXHRcdGlmKGUuY3RybEtleSl7XHJcblx0XHRcdGZiLmdldEF1dGgoJ3NoYXJlZHBvc3RzJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZSxmcm9tJywnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFtdXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi43JyxcclxuXHRcdHJlYWN0aW9uczogJ3YyLjcnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4zJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxyXG5cdFx0ZmVlZDogJ3YyLjMnLFxyXG5cdFx0Z3JvdXA6ICd2Mi4zJyxcclxuXHRcdG5ld2VzdDogJ3YyLjgnXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX21hbmFnZWRfZ3JvdXBzLG1hbmFnZV9wYWdlcycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdG5leHQ6ICcnLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRcdGZiLnN0YXJ0KCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5o6I5qyK5aSx5pWX77yM6KuL57Wm5LqI5omA5pyJ5qyK6ZmQJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKCk9PntcclxuXHRcdFByb21pc2UuYWxsKFtmYi5nZXRNZSgpLGZiLmdldFBhZ2UoKSwgZmIuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0c2Vzc2lvblN0b3JhZ2UubG9naW4gPSBKU09OLnN0cmluZ2lmeShyZXMpO1xyXG5cdFx0XHRmYi5nZW5PcHRpb24ocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2VuT3B0aW9uOiAocmVzKT0+e1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IG9wdGlvbnMgPSAnJztcclxuXHRcdGxldCB0eXBlID0gLTE7XHJcblx0XHQkKCcjYnRuX3N0YXJ0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdGZvcihsZXQgaSBvZiByZXMpe1xyXG5cdFx0XHR0eXBlKys7XHJcblx0XHRcdGZvcihsZXQgaiBvZiBpKXtcclxuXHRcdFx0XHRvcHRpb25zICs9IGA8ZGl2IGNsYXNzPVwicGFnZV9idG5cIiBhdHRyLXR5cGU9XCIke3R5cGV9XCIgYXR0ci12YWx1ZT1cIiR7ai5pZH1cIiBvbmNsaWNrPVwiZmIuc2VsZWN0UGFnZSh0aGlzKVwiPiR7ai5uYW1lfTwvZGl2PmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJyNlbnRlclVSTCcpLmFwcGVuZChvcHRpb25zKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdH0sXHJcblx0c2VsZWN0UGFnZTogKGUpPT57XHJcblx0XHQkKCcjZW50ZXJVUkwgLnBhZ2VfYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IHRhciA9ICQoZSk7XHJcblx0XHR0YXIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0ZmIuZmVlZCh0YXIuYXR0cignYXR0ci12YWx1ZScpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQpO1xyXG5cdFx0c3RlcC5zdGVwMSgpO1xyXG5cdH0sXHJcblx0aGlkZGVuU3RhcnQ6ICgpPT57XHJcblx0XHRsZXQgZmJpZCA9ICQoJ2hlYWRlciAuZGV2IGlucHV0JykudmFsKCk7XHJcblx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdH0sXHJcblx0ZmVlZDogKHBhZ2VJRCwgdHlwZSwgdXJsID0gJycsIGNsZWFyID0gdHJ1ZSk9PntcclxuXHRcdGlmIChjbGVhcil7XHJcblx0XHRcdCQoJy5yZWNvbW1hbmRzLCAuZmVlZHMgdGJvZHknKS5lbXB0eSgpO1xyXG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy5mZWVkcyAuYnRuJykub2ZmKCdjbGljaycpLmNsaWNrKCgpPT57XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoJyNlbnRlclVSTCBzZWxlY3QnKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKTtcclxuXHRcdFx0XHRmYi5mZWVkKHRhci52YWwoKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0LCBmYWxzZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGNvbW1hbmQgPSAodHlwZSA9PSAnMicpID8gJ2ZlZWQnOidwb3N0cyc7XHJcblx0XHRsZXQgYXBpO1xyXG5cdFx0aWYgKHVybCA9PSAnJyl7XHJcblx0XHRcdGFwaSA9IGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlSUR9LyR7Y29tbWFuZH0/ZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTI1YDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRhcGkgPSB1cmw7XHJcblx0XHR9XHJcblx0XHRGQi5hcGkoYXBpLCAocmVzKT0+e1xyXG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID09IDApe1xyXG5cdFx0XHRcdCQoJy5mZWVkcyAuYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmYi5uZXh0ID0gcmVzLnBhZ2luZy5uZXh0O1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdGxldCBzdHIgPSBnZW5EYXRhKGkpO1xyXG5cdFx0XHRcdCQoJy5zZWN0aW9uIC5mZWVkcyB0Ym9keScpLmFwcGVuZChzdHIpO1xyXG5cdFx0XHRcdGlmIChpLm1lc3NhZ2UgJiYgaS5tZXNzYWdlLmluZGV4T2YoJ+aKvScpID49IDApe1xyXG5cdFx0XHRcdFx0bGV0IHJlY29tbWFuZCA9IGdlbkNhcmQoaSk7XHJcblx0XHRcdFx0XHQkKCcuZG9uYXRlX2FyZWEgLnJlY29tbWFuZHMnKS5hcHBlbmQocmVjb21tYW5kKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdlbkRhdGEob2JqKXtcclxuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XHJcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xyXG5cclxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0bGV0IHN0ciA9IGA8dHI+XHJcblx0XHRcdFx0XHRcdDx0ZD48ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgIG9uY2xpY2s9XCJkYXRhLnN0YXJ0KCcke29iai5pZH0nKVwiPumWi+WnizwvZGl2PjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bWVzc308L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKG9iai5jcmVhdGVkX3RpbWUpfTwvdGQ+XHJcblx0XHRcdFx0XHRcdDwvdHI+YDtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGdlbkNhcmQob2JqKXtcclxuXHRcdFx0bGV0IHNyYyA9IG9iai5mdWxsX3BpY3R1cmUgfHwgJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzAweDIyNSc7XHJcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xyXG5cdFx0XHRsZXQgbGluayA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJytpZHNbMF0rJy9wb3N0cy8nK2lkc1sxXTtcclxuXHRcdFx0XHJcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XHJcblx0XHRcdGxldFx0c3RyID0gYDxkaXYgY2xhc3M9XCJjYXJkXCI+XHJcblx0XHRcdDxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWltYWdlXCI+XHJcblx0XHRcdDxmaWd1cmUgY2xhc3M9XCJpbWFnZSBpcy00YnkzXCI+XHJcblx0XHRcdDxpbWcgc3JjPVwiJHtzcmN9XCIgYWx0PVwiXCI+XHJcblx0XHRcdDwvZmlndXJlPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9hPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1jb250ZW50XCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcblx0XHRcdCR7bWVzc31cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+XHJcblx0XHRcdDwvZGl2PmA7XHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRNZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XHJcblx0XHRcdFx0bGV0IGFyciA9IFtyZXNdO1xyXG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHNgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkF1dGg6ICgpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25DYWxsYmFjazogKHJlc3BvbnNlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xyXG5cdFx0XHRcdGRhdGEucmF3LmV4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRcdFx0bGV0IGV4dGVuZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaGFyZWRwb3N0c1wiKSk7XHJcblx0XHRcdFx0bGV0IGZpZCA9IFtdO1xyXG5cdFx0XHRcdGxldCBpZHMgPSBbXTtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdGZpZC5wdXNoKGkuZnJvbS5pZCk7XHJcblx0XHRcdFx0XHRpZiAoZmlkLmxlbmd0aCA+PTQ1KXtcclxuXHRcdFx0XHRcdFx0aWRzLnB1c2goZmlkKTtcclxuXHRcdFx0XHRcdFx0ZmlkID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlkcy5wdXNoKGZpZCk7XHJcblx0XHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXSwgbmFtZXMgPSB7fTtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgaWRzKXtcclxuXHRcdFx0XHRcdGxldCBwcm9taXNlID0gZmIuZ2V0TmFtZShpKS50aGVuKChyZXMpPT57XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBPYmplY3Qua2V5cyhyZXMpKXtcclxuXHRcdFx0XHRcdFx0XHRuYW1lc1tpXSA9IHJlc1tpXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRwcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRQcm9taXNlLmFsbChwcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0aS5mcm9tLm5hbWUgPSBuYW1lc1tpLmZyb20uaWRdID8gbmFtZXNbaS5mcm9tLmlkXS5uYW1lIDogaS5mcm9tLm5hbWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkYXRhLnJhdy5kYXRhLnNoYXJlZHBvc3RzID0gZXh0ZW5kO1xyXG5cdFx0XHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXROYW1lOiAoaWRzKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9Lz9pZHM9JHtpZHMudG9TdHJpbmcoKX1gLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxubGV0IHN0ZXAgPSB7XHJcblx0c3RlcDE6ICgpPT57XHJcblx0XHQkKCcuc2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH0sXHJcblx0c3RlcDI6ICgpPT57XHJcblx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcclxuXHRcdCQoJy5zZWN0aW9uJykuYWRkQ2xhc3MoJ3N0ZXAyJyk7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IHt9LFxyXG5cdGZpbHRlcmVkOiB7fSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdHRlc3Q6IChpZCk9PntcclxuXHRcdGNvbnNvbGUubG9nKGlkKTtcclxuXHR9LFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKT0+e1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRmdWxsSUQ6IGZiaWRcclxuXHRcdH1cclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgY29tbWFuZHMgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcclxuXHRcdGxldCB0ZW1wX2RhdGEgPSBvYmo7XHJcblx0XHRmb3IobGV0IGkgb2YgY29tbWFuZHMpe1xyXG5cdFx0XHR0ZW1wX2RhdGEuZGF0YSA9IHt9O1xyXG5cdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KHRlbXBfZGF0YSwgaSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdHRlbXBfZGF0YS5kYXRhW2ldID0gcmVzO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdGRhdGEuZmluaXNoKHRlbXBfZGF0YSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQsIGNvbW1hbmQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBzaGFyZUVycm9yID0gMDtcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJykgY29tbWFuZCA9ICdncm91cCc7XHJcblx0XHRcdGlmIChjb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0XHRnZXRTaGFyZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7Y29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbY29tbWFuZF19Jm9yZGVyPWNocm9ub2xvZ2ljYWwmZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9YCwocmVzKT0+e1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldFNoYXJlKGFmdGVyPScnKXtcclxuXHRcdFx0XHRsZXQgdXJsID0gYGh0dHBzOi8vYW02NmFoZ3RwOC5leGVjdXRlLWFwaS5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tL3NoYXJlP2ZiaWQ9JHtmYmlkLmZ1bGxJRH0mYWZ0ZXI9JHthZnRlcn1gO1xyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRpZiAocmVzID09PSAnZW5kJyl7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3JNZXNzYWdlKXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYocmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRcdHNoYXJlRXJyb3IgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgbmFtZSA9IGkuc3Rvcnkuc3Vic3RyaW5nKDAsIGkuc3RvcnkuaW5kZXhPZignIHNoYXJlZCcpKTtcclxuXHRcdFx0XHRcdFx0XHRcdGxldCBpZCA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aS5mcm9tID0ge2lkLCBuYW1lfTtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goaSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGdldFNoYXJlKHJlcy5hZnRlcik7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKT0+e1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRzdGVwLnN0ZXAyKCk7XHJcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdCQoJy5yZXN1bHRfYXJlYSA+IC50aXRsZSBzcGFuJykudGV4dChmYmlkLmZ1bGxJRCk7XHJcblx0XHRkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJhd1wiLCBKU09OLnN0cmluZ2lmeShmYmlkKSk7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXJlZCA9IHt9O1xyXG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHJhd0RhdGEuZGF0YSkpe1xyXG5cdFx0XHRpZiAoa2V5ID09PSAncmVhY3Rpb25zJykgaXNUYWcgPSBmYWxzZTtcclxuXHRcdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YS5kYXRhW2tleV0sIGtleSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1x0XHJcblx0XHRcdGRhdGEuZmlsdGVyZWRba2V5XSA9IG5ld0RhdGE7XHJcblx0XHR9XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpe1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbHRlcmVkKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gZGF0YS5maWx0ZXJlZDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4Y2VsOiAocmF3KT0+e1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKXtcclxuXHRcdFx0JC5lYWNoKHJhdyxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIiA6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi6Kmy5YiG5Lqr6K6a5pW4XCIgOiB0aGlzLmxpa2VfY291bnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JC5lYWNoKHJhdyxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLlv4Pmg4VcIiA6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCIgOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKT0+e1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9PntcclxuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJlZCA9IHJhd2RhdGE7XHJcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoZmlsdGVyZWQpKXtcclxuXHRcdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0XHRpZihrZXkgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5b+D5oOFPC90ZD5gO1xyXG5cdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmVkW2tleV0uZW50cmllcygpKXtcclxuXHRcdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRcdGlmIChwaWMpe1xyXG5cdFx0XHRcdFx0Ly8gcGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtwaWN0dXJlfSR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5gO1xyXG5cdFx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdFx0fWVsc2UgaWYoa2V5ID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8IHZhbC5zdG9yeX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdFx0JChcIi50YWJsZXMgLlwiK2tleStcIiB0YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0YWN0aXZlKCk7XHJcblx0XHR0YWIuaW5pdCgpO1xyXG5cdFx0Y29tcGFyZS5pbml0KCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IGFyciA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnLCdzaGFyZWRwb3N0cyddO1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0XHRsZXQgdGFibGUgPSAkKCcudGFibGVzIC4nK2krJyB0YWJsZScpLkRhdGFUYWJsZSgpO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpPT57XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY29tcGFyZSA9IHtcclxuXHRhbmQ6IFtdLFxyXG5cdG9yOiBbXSxcclxuXHRyYXc6IFtdLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHRjb21wYXJlLmFuZCA9IFtdO1xyXG5cdFx0Y29tcGFyZS5vciA9IFtdO1xyXG5cdFx0Y29tcGFyZS5yYXcgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRsZXQgaWdub3JlID0gJCgnLnRhYmxlcyAudG90YWwgLmZpbHRlcnMgc2VsZWN0JykudmFsKCk7XHJcblx0XHRsZXQgYmFzZSA9IFtdO1xyXG5cdFx0bGV0IGZpbmFsID0gW107XHJcblx0XHRsZXQgY29tcGFyZV9udW0gPSAxO1xyXG5cdFx0aWYgKGlnbm9yZSA9PT0gJ2lnbm9yZScpIGNvbXBhcmVfbnVtID0gMjtcclxuXHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhjb21wYXJlLnJhdykpe1xyXG5cdFx0XHRpZiAoa2V5ICE9PSBpZ25vcmUpe1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBjb21wYXJlLnJhd1trZXldKXtcclxuXHRcdFx0XHRcdGJhc2UucHVzaChpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGxldCBzb3J0ID0gKGRhdGEucmF3LmV4dGVuc2lvbikgPyAnbmFtZSc6J2lkJztcclxuXHRcdGJhc2UgPSBiYXNlLnNvcnQoKGEsYik9PntcclxuXHRcdFx0cmV0dXJuIGEuZnJvbVtzb3J0XSA+IGIuZnJvbVtzb3J0XSA/IDE6LTE7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmb3IobGV0IGkgb2YgYmFzZSl7XHJcblx0XHRcdGkubWF0Y2ggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRsZXQgdGVtcF9uYW1lID0gJyc7XHJcblx0XHRmb3IobGV0IGkgaW4gYmFzZSl7XHJcblx0XHRcdGxldCBvYmogPSBiYXNlW2ldO1xyXG5cdFx0XHRpZiAob2JqLmZyb20uaWQgPT0gdGVtcCB8fCAoZGF0YS5yYXcuZXh0ZW5zaW9uICYmIChvYmouZnJvbS5uYW1lID09IHRlbXBfbmFtZSkpKXtcclxuXHRcdFx0XHRsZXQgdGFyID0gZmluYWxbZmluYWwubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdHRhci5tYXRjaCsrO1xyXG5cdFx0XHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKG9iaikpe1xyXG5cdFx0XHRcdFx0aWYgKCF0YXJba2V5XSkgdGFyW2tleV0gPSBvYmpba2V5XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZpbmFsLnB1c2gob2JqKTtcclxuXHRcdFx0XHR0ZW1wID0gb2JqLmZyb20uaWQ7XHJcblx0XHRcdFx0dGVtcF9uYW1lID0gb2JqLmZyb20ubmFtZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdFxyXG5cdFx0Y29tcGFyZS5vciA9IGZpbmFsO1xyXG5cdFx0Y29tcGFyZS5hbmQgPSBjb21wYXJlLm9yLmZpbHRlcigodmFsKT0+e1xyXG5cdFx0XHRyZXR1cm4gdmFsLm1hdGNoID09IGNvbXBhcmVfbnVtO1xyXG5cdFx0fSk7XHJcblx0XHRjb21wYXJlLmdlbmVyYXRlKCk7XHJcblx0fSxcclxuXHRnZW5lcmF0ZTogKCk9PntcclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZGF0YV9hbmQgPSBjb21wYXJlLmFuZDtcclxuXHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9hbmQuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnQgfHwgJzAnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS5hbmQgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHJcblx0XHRsZXQgZGF0YV9vciA9IGNvbXBhcmUub3I7XHJcblx0XHRsZXQgdGJvZHkyID0gJyc7XHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfb3IuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnQgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5MiArPSB0cjtcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS5vciB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkyKTtcclxuXHRcdFxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBhcnIgPSBbJ2FuZCcsJ29yJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKGN0cmwgPSBmYWxzZSk9PntcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcclxuXHRcdGNob29zZS5saXN0ID0gW107XHJcblx0XHRjaG9vc2UubnVtID0gMDtcclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKXtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKGN0cmwpO1xyXG5cdH0sXHJcblx0Z286IChjdHJsKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSB0YWIubm93O1xyXG5cdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGFbY29tbWFuZF0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcdFxyXG5cdFx0fVxyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0bGV0IHRlbXBBcnIgPSBbXTtcclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKXtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5jb2x1bW4oMikuZGF0YSgpLmVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KXtcclxuXHRcdFx0XHRsZXQgd29yZCA9ICQoJy5zZWFyY2hDb21tZW50JykudmFsKCk7XHJcblx0XHRcdFx0aWYgKHZhbHVlLmluZGV4T2Yod29yZCkgPj0gMCkgdGVtcEFyci5wdXNoKGluZGV4KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcclxuXHRcdFx0bGV0IHJvdyA9ICh0ZW1wQXJyLmxlbmd0aCA9PSAwKSA/IGk6dGVtcEFycltpXTtcclxuXHRcdFx0bGV0IHRhciA9ICQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkucm93KHJvdykubm9kZSgpLmlubmVySFRNTDtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHI+JyArIHRhciArICc8L3RyPic7XHJcblx0XHR9XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0aWYgKCFjdHJsKXtcclxuXHRcdFx0JChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKHRoaXMpLmZpbmQoJ3RkJykuZXEoMSk7XHJcblx0XHRcdFx0bGV0IGlkID0gdGFyLmZpbmQoJ2EnKS5hdHRyKCdhdHRyLWZiaWQnKTtcclxuXHRcdFx0XHR0YXIucHJlcGVuZChgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xyXG5cdFx0XHRsZXQgbm93ID0gMDtcclxuXHRcdFx0Zm9yKGxldCBrIGluIGNob29zZS5saXN0KXtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjdcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhdywgY29tbWFuZCwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9PntcclxuXHRcdGxldCBkYXRhID0gcmF3O1xyXG5cdFx0aWYgKGlzRHVwbGljYXRlKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAod29yZCAhPT0gJycgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIGVuZFRpbWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSk9PntcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHQpPT57XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLChwYXJzZUludCh0aW1lX2FyeVsxXSktMSksdGltZV9hcnlbMl0sdGltZV9hcnlbM10sdGltZV9hcnlbNF0sdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmIChjcmVhdGVkX3RpbWUgPCB0aW1lIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcik9PntcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKT0+e1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWIgPSB7XHJcblx0bm93OiBcImNvbW1lbnRzXCIsXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0dGFiLm5vdyA9ICQodGhpcykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHRcdGxldCB0YXIgPSAkKHRoaXMpLmluZGV4KCk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5lcSh0YXIpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCl7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSsxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XHJcblx0IHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xyXG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG4gICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICAgaWYgKGRhdGUgPCAxMCl7XHJcbiAgICAgXHRkYXRlID0gXCIwXCIrZGF0ZTtcclxuICAgICB9XHJcbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcbiAgICAgaWYgKGhvdXIgPCAxMCl7XHJcbiAgICAgXHRob3VyID0gXCIwXCIraG91cjtcclxuICAgICB9XHJcbiAgICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG4gICAgIGlmIChtaW4gPCAxMCl7XHJcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XHJcbiAgICAgfVxyXG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuICAgICBpZiAoc2VjIDwgMTApe1xyXG4gICAgIFx0c2VjID0gXCIwXCIrc2VjO1xyXG4gICAgIH1cclxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcclxuICAgICByZXR1cm4gdGltZTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcbiAgICBcclxuICAgIHZhciBDU1YgPSAnJzsgICAgXHJcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuICAgIFxyXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuICAgIGlmIChTaG93TGFiZWwpIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXHJcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSAgIFxyXG4gICAgXHJcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcbiAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxyXG4gICAgXHJcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuICAgIFxyXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG4gICAgXHJcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcclxuICAgIGxpbmsuaHJlZiA9IHVyaTtcclxuICAgIFxyXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuICAgIFxyXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
