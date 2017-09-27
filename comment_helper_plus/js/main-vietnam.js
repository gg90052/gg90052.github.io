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
		var _iteratorNormalCompletion13 = true;
		var _didIteratorError13 = false;
		var _iteratorError13 = undefined;

		try {
			for (var _iterator13 = Object.keys(filtered)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
				var key = _step13.value;

				var thead = '';
				var tbody = '';
				if (key === 'reactions') {
					thead = "<td>M\xE3 s\u1ED1</td>\n\t\t\t\t<td>T\xEAn</td>\n\t\t\t\t<td>T\xE2m tr\u1EA1ng</td>";
				} else if (key === 'sharedposts') {
					thead = "<td>M\xE3 s\u1ED1</td>\n\t\t\t\t<td>T\xEAn</td>\n\t\t\t\t<td class=\"force-break\">N\u1ED9i dung tin nh\u1EAFn</td>\n\t\t\t\t<td width=\"110\">Th\u1EDDi gian \u0111\u1EC3 l\u1EA1i l\u1EDDi nh\u1EAFn</td>";
				} else {
					thead = "<td>M\xE3 s\u1ED1</td>\n\t\t\t\t<td width=\"200\">T\xEAn</td>\n\t\t\t\t<td class=\"force-break\">N\u1ED9i dung tin nh\u1EAFn</td>\n\t\t\t\t<td>Like</td>\n\t\t\t\t<td class=\"nowrap\">Th\u1EDDi gian \u0111\u1EC3 l\u1EA1i l\u1EDDi nh\u1EAFn</td>";
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4tdmlldG5hbS5qcyJdLCJuYW1lcyI6WyJlcnJvck1lc3NhZ2UiLCJ3aW5kb3ciLCJvbmVycm9yIiwiaGFuZGxlRXJyIiwibXNnIiwidXJsIiwibCIsImNvbnNvbGUiLCJsb2ciLCIkIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImxhc3REYXRhIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImRhdGEiLCJmaW5pc2giLCJzZXNzaW9uU3RvcmFnZSIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJjbGljayIsImUiLCJleHRlbnNpb25BdXRoIiwiZ2V0QXV0aCIsImN0cmxLZXkiLCJhbHRLZXkiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwia2V5ZG93biIsInRleHQiLCJrZXl1cCIsIm9uIiwidGFibGUiLCJyZWRvIiwiY2hhbmdlIiwiY29uZmlnIiwiZmlsdGVyIiwicmVhY3QiLCJ2YWwiLCJjb21wYXJlIiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsImVuZFRpbWUiLCJmb3JtYXQiLCJzZXRTdGFydERhdGUiLCJub3dEYXRlIiwiZmlsdGVyRGF0YSIsInJhdyIsImRkIiwidGFiIiwibm93Iiwic3RyaW5naWZ5Iiwib3BlbiIsImZvY3VzIiwibGVuZ3RoIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiZXhjZWwiLCJleGNlbFN0cmluZyIsImNpX2NvdW50ZXIiLCJpbXBvcnQiLCJmaWxlcyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJhdXRoIiwiZXh0ZW5zaW9uIiwibmV4dCIsInR5cGUiLCJGQiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzd2FsIiwiZG9uZSIsImZiaWQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwib3B0aW9ucyIsImkiLCJqIiwiaWQiLCJuYW1lIiwic2VsZWN0UGFnZSIsInRhciIsImF0dHIiLCJzdGVwIiwic3RlcDEiLCJoaWRkZW5TdGFydCIsInBhZ2VJRCIsImNsZWFyIiwiZW1wdHkiLCJvZmYiLCJmaW5kIiwiY29tbWFuZCIsImFwaSIsInBhZ2luZyIsInN0ciIsImdlbkRhdGEiLCJtZXNzYWdlIiwicmVjb21tYW5kIiwiZ2VuQ2FyZCIsIm9iaiIsImlkcyIsInNwbGl0IiwibGluayIsIm1lc3MiLCJyZXBsYWNlIiwidGltZUNvbnZlcnRlciIsImNyZWF0ZWRfdGltZSIsInNyYyIsImZ1bGxfcGljdHVyZSIsInJlc29sdmUiLCJyZWplY3QiLCJhcnIiLCJleHRlbnNpb25DYWxsYmFjayIsImV4dGVuZCIsImZpZCIsInB1c2giLCJmcm9tIiwicHJvbWlzZV9hcnJheSIsIm5hbWVzIiwicHJvbWlzZSIsImdldE5hbWUiLCJPYmplY3QiLCJrZXlzIiwidGl0bGUiLCJodG1sIiwidG9TdHJpbmciLCJzY3JvbGxUb3AiLCJzdGVwMiIsImZpbHRlcmVkIiwidXNlcmlkIiwibm93TGVuZ3RoIiwidGVzdCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwiY29tbWFuZHMiLCJ0ZW1wX2RhdGEiLCJnZXQiLCJkYXRhcyIsInNoYXJlRXJyb3IiLCJnZXRTaGFyZSIsImQiLCJnZXROZXh0IiwiZ2V0SlNPTiIsImZhaWwiLCJhZnRlciIsInN0b3J5Iiwic3Vic3RyaW5nIiwic2V0SXRlbSIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwia2V5IiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwibGlrZV9jb3VudCIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsInBpYyIsInRoZWFkIiwidGJvZHkiLCJlbnRyaWVzIiwicGljdHVyZSIsInRkIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYW5kIiwib3IiLCJpZ25vcmUiLCJiYXNlIiwiZmluYWwiLCJjb21wYXJlX251bSIsInNvcnQiLCJhIiwiYiIsIm1hdGNoIiwidGVtcCIsInRlbXBfbmFtZSIsImRhdGFfYW5kIiwiZGF0YV9vciIsInRib2R5MiIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsImN0cmwiLCJuIiwicGFyc2VJbnQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsInRlbXBBcnIiLCJjb2x1bW4iLCJpbmRleCIsInJvdyIsIm5vZGUiLCJpbm5lckhUTUwiLCJlcSIsInByZXBlbmQiLCJrIiwiaW5zZXJ0QmVmb3JlIiwidW5pcXVlIiwidGFnIiwidGltZSIsIm91dHB1dCIsImZvckVhY2giLCJpdGVtIiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsIm1vbWVudCIsIkRhdGUiLCJfZCIsInVpIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwibWFwIiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJzbGljZSIsImFsZXJ0IiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBZUMsU0FBZjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNOLFlBQUwsRUFBa0I7QUFDakJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUMsSUFBRSxpQkFBRixFQUFxQkMsTUFBckI7QUFDQVYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRFMsRUFBRUUsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0IsS0FBSUMsV0FBV0MsS0FBS0MsS0FBTCxDQUFXQyxhQUFhQyxPQUFiLENBQXFCLEtBQXJCLENBQVgsQ0FBZjtBQUNBLEtBQUlKLFFBQUosRUFBYTtBQUNaSyxPQUFLQyxNQUFMLENBQVlOLFFBQVo7QUFDQTtBQUNELEtBQUlPLGVBQWVDLEtBQW5CLEVBQXlCO0FBQ3hCQyxLQUFHQyxTQUFILENBQWFULEtBQUtDLEtBQUwsQ0FBV0ssZUFBZUMsS0FBMUIsQ0FBYjtBQUNBOztBQUVEWixHQUFFLCtCQUFGLEVBQW1DZSxLQUFuQyxDQUF5QyxVQUFTQyxDQUFULEVBQVc7QUFDbkRILEtBQUdJLGFBQUg7QUFDQSxFQUZEOztBQUlBakIsR0FBRSxlQUFGLEVBQW1CZSxLQUFuQixDQUF5QixVQUFTQyxDQUFULEVBQVc7QUFDbkNILEtBQUdLLE9BQUgsQ0FBVyxVQUFYO0FBQ0EsRUFGRDs7QUFJQWxCLEdBQUUsWUFBRixFQUFnQmUsS0FBaEIsQ0FBc0IsWUFBVTtBQUMvQkYsS0FBR0ssT0FBSCxD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QXlDO0FBQ3JDLE1BQUkySSxNQUFNLEVBQVY7O0FBRUE7QUFDQSxPQUFLLElBQUlELEtBQVQsSUFBa0JnRCxRQUFRMUwsQ0FBUixDQUFsQixFQUE4QjtBQUMxQjJJLFVBQU8sTUFBTStDLFFBQVExTCxDQUFSLEVBQVcwSSxLQUFYLENBQU4sR0FBMEIsSUFBakM7QUFDSDs7QUFFREMsTUFBSWlELEtBQUosQ0FBVSxDQUFWLEVBQWFqRCxJQUFJdEwsTUFBSixHQUFhLENBQTFCOztBQUVBO0FBQ0FzTyxTQUFPaEQsTUFBTSxNQUFiO0FBQ0g7O0FBRUQsS0FBSWdELE9BQU8sRUFBWCxFQUFlO0FBQ1hFLFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJQyxXQUFXLEVBQWY7QUFDQTtBQUNBQSxhQUFZTixZQUFZNUosT0FBWixDQUFvQixJQUFwQixFQUF5QixHQUF6QixDQUFaOztBQUVBO0FBQ0EsS0FBSW1LLE1BQU0sdUNBQXVDQyxVQUFVTCxHQUFWLENBQWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSWpLLE9BQU8xSCxTQUFTaVMsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0F2SyxNQUFLd0ssSUFBTCxHQUFZSCxHQUFaOztBQUVBO0FBQ0FySyxNQUFLeUssS0FBTCxHQUFhLG1CQUFiO0FBQ0F6SyxNQUFLMEssUUFBTCxHQUFnQk4sV0FBVyxNQUEzQjs7QUFFQTtBQUNBOVIsVUFBU3FTLElBQVQsQ0FBY0MsV0FBZCxDQUEwQjVLLElBQTFCO0FBQ0FBLE1BQUs3RyxLQUFMO0FBQ0FiLFVBQVNxUyxJQUFULENBQWNFLFdBQWQsQ0FBMEI3SyxJQUExQjtBQUNIIiwiZmlsZSI6Im1haW4tdmlldG5hbS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxuXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxue1xuXHRpZiAoIWVycm9yTWVzc2FnZSl7XG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1x0XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0bGV0IGxhc3REYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJhd1wiKSk7XG5cdGlmIChsYXN0RGF0YSl7XG5cdFx0ZGF0YS5maW5pc2gobGFzdERhdGEpO1xuXHR9XG5cdGlmIChzZXNzaW9uU3RvcmFnZS5sb2dpbil7XG5cdFx0ZmIuZ2VuT3B0aW9uKEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pKTtcblx0fVxuXG5cdCQoXCIudGFibGVzID4gLnNoYXJlZHBvc3RzIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRmYi5leHRlbnNpb25BdXRoKCk7XG5cdH0pO1xuXHRcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcblx0fSk7XG5cblx0JChcIiNidG5fc3RhcnRcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xuXHR9KTtcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0Y2hvb3NlLmluaXQodHJ1ZSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRjaG9vc2UuaW5pdCgpO1xuXHRcdH1cblx0fSk7XG5cdFxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XG5cdFx0fWVsc2V7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xuXHR9KTtcblxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xuXHRcdH1cblx0fSk7XG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcblx0XHRpZiAoIWUuY3RybEtleSB8fCAhZS5hbHRLZXkpe1xuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIlh14bqldCBleGNlbFwiKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XG5cdFx0dGFibGUucmVkbygpO1xuXHR9KTtcblxuXHQkKFwiLnRhYmxlcyAuZmlsdGVycyAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XG5cdFx0dGFibGUucmVkbygpO1xuXHR9KTtcblxuXHQkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcblx0XHRjb21wYXJlLmluaXQoKTtcblx0fSk7XG5cblx0JCgnLmNvbXBhcmVfY29uZGl0aW9uJykuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUnKS5hZGRDbGFzcygnaGlkZScpO1xuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLicrICQodGhpcykudmFsKCkpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdH0pO1xuXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xuXHRcdFwic2luZ2xlRGF0ZVBpY2tlclwiOiB0cnVlLFxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxuXHRcdFwibG9jYWxlXCI6IHtcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS1NTS1ERCAgIEhIOm1tXCIsXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xuXHRcdFx0XCLml6VcIixcblx0XHRcdFwi5LiAXCIsXG5cdFx0XHRcIuS6jFwiLFxuXHRcdFx0XCLkuIlcIixcblx0XHRcdFwi5ZubXCIsXG5cdFx0XHRcIuS6lFwiLFxuXHRcdFx0XCLlha1cIlxuXHRcdFx0XSxcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXG5cdFx0XHRcIuS4gOaciFwiLFxuXHRcdFx0XCLkuozmnIhcIixcblx0XHRcdFwi5LiJ5pyIXCIsXG5cdFx0XHRcIuWbm+aciFwiLFxuXHRcdFx0XCLkupTmnIhcIixcblx0XHRcdFwi5YWt5pyIXCIsXG5cdFx0XHRcIuS4g+aciFwiLFxuXHRcdFx0XCLlhavmnIhcIixcblx0XHRcdFwi5Lmd5pyIXCIsXG5cdFx0XHRcIuWNgeaciFwiLFxuXHRcdFx0XCLljYHkuIDmnIhcIixcblx0XHRcdFwi5Y2B5LqM5pyIXCJcblx0XHRcdF0sXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcblx0XHR9LFxuXHR9LGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XG5cdFx0dGFibGUucmVkbygpO1xuXHR9KTtcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShub3dEYXRlKCkpO1xuXG5cblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XG5cdFx0aWYgKGUuY3RybEtleSl7XG5cdFx0XHRsZXQgZGQ7XG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhW3RhYi5ub3ddKTtcblx0XHRcdH1cblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBkZDtcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xuXHRcdFx0d2luZG93LmZvY3VzKCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKXtcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhW3RhYi5ub3ddKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcblx0fSk7XG5cblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGNpX2NvdW50ZXIrKztcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KXtcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0fVxuXHRcdGlmKGUuY3RybEtleSl7XG5cdFx0XHRmYi5nZXRBdXRoKCdzaGFyZWRwb3N0cycpO1xuXHRcdH1cblx0fSk7XG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XG5cdH0pO1xufSk7XG5cbmxldCBjb25maWcgPSB7XG5cdGZpZWxkOiB7XG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UsZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxuXHRcdHJlYWN0aW9uczogW10sXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxuXHRcdHVybF9jb21tZW50czogW10sXG5cdFx0ZmVlZDogW11cblx0fSxcblx0bGltaXQ6IHtcblx0XHRjb21tZW50czogJzUwMCcsXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcblx0XHRmZWVkOiAnNTAwJ1xuXHR9LFxuXHRhcGlWZXJzaW9uOiB7XG5cdFx0Y29tbWVudHM6ICd2Mi43Jyxcblx0XHRyZWFjdGlvbnM6ICd2Mi43Jyxcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxuXHRcdGZlZWQ6ICd2Mi4zJyxcblx0XHRncm91cDogJ3YyLjMnLFxuXHRcdG5ld2VzdDogJ3YyLjgnXG5cdH0sXG5cdGZpbHRlcjoge1xuXHRcdHdvcmQ6ICcnLFxuXHRcdHJlYWN0OiAnYWxsJyxcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcblx0fSxcblx0YXV0aDogJ3VzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9tYW5hZ2VkX2dyb3VwcyxtYW5hZ2VfcGFnZXMnLFxuXHRleHRlbnNpb246IGZhbHNlLFxufVxuXG5sZXQgZmIgPSB7XG5cdG5leHQ6ICcnLFxuXHRnZXRBdXRoOiAodHlwZSk9Pntcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0fSxcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9Pntcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcblx0XHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcztcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xuXHRcdFx0XHRcdGZiLnN0YXJ0KCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHN3YWwoXG5cdFx0XHRcdFx0XHQn5o6I5qyK5aSx5pWX77yM6KuL57Wm5LqI5omA5pyJ5qyK6ZmQJyxcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXG5cdFx0XHRcdFx0XHQnZXJyb3InXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcdFx0XHRcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0XHR9XG5cdH0sXG5cdHN0YXJ0OiAoKT0+e1xuXHRcdFByb21pc2UuYWxsKFtmYi5nZXRNZSgpLGZiLmdldFBhZ2UoKSwgZmIuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9Pntcblx0XHRcdHNlc3Npb25TdG9yYWdlLmxvZ2luID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcblx0XHRcdGZiLmdlbk9wdGlvbihyZXMpO1xuXHRcdH0pO1xuXHR9LFxuXHRnZW5PcHRpb246IChyZXMpPT57XG5cdFx0ZmIubmV4dCA9ICcnO1xuXHRcdGxldCBvcHRpb25zID0gJyc7XG5cdFx0bGV0IHR5cGUgPSAtMTtcblx0XHQkKCcjYnRuX3N0YXJ0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcblx0XHRcdHR5cGUrKztcblx0XHRcdGZvcihsZXQgaiBvZiBpKXtcblx0XHRcdFx0b3B0aW9ucyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgYXR0ci10eXBlPVwiJHt0eXBlfVwiIGF0dHItdmFsdWU9XCIke2ouaWR9XCIgb25jbGljaz1cImZiLnNlbGVjdFBhZ2UodGhpcylcIj4ke2oubmFtZX08L2Rpdj5gO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQkKCcjZW50ZXJVUkwnKS5hcHBlbmQob3B0aW9ucykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcblx0fSxcblx0c2VsZWN0UGFnZTogKGUpPT57XG5cdFx0JCgnI2VudGVyVVJMIC5wYWdlX2J0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRmYi5uZXh0ID0gJyc7XG5cdFx0bGV0IHRhciA9ICQoZSk7XG5cdFx0dGFyLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRmYi5mZWVkKHRhci5hdHRyKCdhdHRyLXZhbHVlJyksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCk7XG5cdFx0c3RlcC5zdGVwMSgpO1xuXHR9LFxuXHRoaWRkZW5TdGFydDogKCk9Pntcblx0XHRsZXQgZmJpZCA9ICQoJ2hlYWRlciAuZGV2IGlucHV0JykudmFsKCk7XG5cdFx0ZGF0YS5zdGFydChmYmlkKTtcblx0fSxcblx0ZmVlZDogKHBhZ2VJRCwgdHlwZSwgdXJsID0gJycsIGNsZWFyID0gdHJ1ZSk9Pntcblx0XHRpZiAoY2xlYXIpe1xuXHRcdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLm9mZignY2xpY2snKS5jbGljaygoKT0+e1xuXHRcdFx0XHRsZXQgdGFyID0gJCgnI2VudGVyVVJMIHNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xuXHRcdFx0XHRmYi5mZWVkKHRhci52YWwoKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0LCBmYWxzZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0bGV0IGNvbW1hbmQgPSAodHlwZSA9PSAnMicpID8gJ2ZlZWQnOidwb3N0cyc7XG5cdFx0bGV0IGFwaTtcblx0XHRpZiAodXJsID09ICcnKXtcblx0XHRcdGFwaSA9IGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlSUR9LyR7Y29tbWFuZH0/ZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTI1YDtcblx0XHR9ZWxzZXtcblx0XHRcdGFwaSA9IHVybDtcblx0XHR9XG5cdFx0RkIuYXBpKGFwaSwgKHJlcyk9Pntcblx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPT0gMCl7XG5cdFx0XHRcdCQoJy5mZWVkcyAuYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRcdH1cblx0XHRcdGZiLm5leHQgPSByZXMucGFnaW5nLm5leHQ7XG5cdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRsZXQgc3RyID0gZ2VuRGF0YShpKTtcblx0XHRcdFx0JCgnLnNlY3Rpb24gLmZlZWRzIHRib2R5JykuYXBwZW5kKHN0cik7XG5cdFx0XHRcdGlmIChpLm1lc3NhZ2UgJiYgaS5tZXNzYWdlLmluZGV4T2YoJ+aKvScpID49IDApe1xuXHRcdFx0XHRcdGxldCByZWNvbW1hbmQgPSBnZW5DYXJkKGkpO1xuXHRcdFx0XHRcdCQoJy5kb25hdGVfYXJlYSAucmVjb21tYW5kcycpLmFwcGVuZChyZWNvbW1hbmQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRmdW5jdGlvbiBnZW5EYXRhKG9iail7XG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xuXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xuXHRcdFx0bGV0IHN0ciA9IGA8dHI+XG5cdFx0XHRcdFx0XHQ8dGQ+PGRpdiBjbGFzcz1cInBpY2tcIiBhdHRyLXZhbD1cIiR7b2JqLmlkfVwiICBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj48L3RkPlxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzfTwvYT48L3RkPlxuXHRcdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKG9iai5jcmVhdGVkX3RpbWUpfTwvdGQ+XG5cdFx0XHRcdFx0XHQ8L3RyPmA7XG5cdFx0XHRyZXR1cm4gc3RyO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZW5DYXJkKG9iail7XG5cdFx0XHRsZXQgc3JjID0gb2JqLmZ1bGxfcGljdHVyZSB8fCAnaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4MjI1Jztcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XG5cdFx0XHRcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XG5cdFx0XHRsZXRcdHN0ciA9IGA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxuXHRcdFx0PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWltYWdlXCI+XG5cdFx0XHQ8ZmlndXJlIGNsYXNzPVwiaW1hZ2UgaXMtNGJ5M1wiPlxuXHRcdFx0PGltZyBzcmM9XCIke3NyY31cIiBhbHQ9XCJcIj5cblx0XHRcdDwvZmlndXJlPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2E+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1jb250ZW50XCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxuXHRcdFx0JHttZXNzfVxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj5cblx0XHRcdDwvZGl2PmA7XG5cdFx0XHRyZXR1cm4gc3RyO1xuXHRcdH1cblx0fSxcblx0Z2V0TWU6ICgpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XG5cdFx0XHRcdGxldCBhcnIgPSBbcmVzXTtcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdGdldFBhZ2U6ICgpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXRHcm91cDogKCk9Pntcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9Pntcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9saW1pdD0xMDBgLCAocmVzKT0+e1xuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRleHRlbnNpb25BdXRoOiAoKT0+e1xuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHR9LFxuXHRleHRlbnNpb25DYWxsYmFjazogKHJlc3BvbnNlKT0+e1xuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XG5cdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xuXHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xuXHRcdFx0XHRkYXRhLnJhdy5leHRlbnNpb24gPSB0cnVlO1xuXHRcdFx0XHRsZXQgZXh0ZW5kID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNoYXJlZHBvc3RzXCIpKTtcblx0XHRcdFx0bGV0IGZpZCA9IFtdO1xuXHRcdFx0XHRsZXQgaWRzID0gW107XG5cdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xuXHRcdFx0XHRcdGZpZC5wdXNoKGkuZnJvbS5pZCk7XG5cdFx0XHRcdFx0aWYgKGZpZC5sZW5ndGggPj00NSl7XG5cdFx0XHRcdFx0XHRpZHMucHVzaChmaWQpO1xuXHRcdFx0XHRcdFx0ZmlkID0gW107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlkcy5wdXNoKGZpZCk7XG5cdFx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW10sIG5hbWVzID0ge307XG5cdFx0XHRcdGZvcihsZXQgaSBvZiBpZHMpe1xuXHRcdFx0XHRcdGxldCBwcm9taXNlID0gZmIuZ2V0TmFtZShpKS50aGVuKChyZXMpPT57XG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgT2JqZWN0LmtleXMocmVzKSl7XG5cdFx0XHRcdFx0XHRcdG5hbWVzW2ldID0gcmVzW2ldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdFByb21pc2UuYWxsKHByb21pc2VfYXJyYXkpLnRoZW4oKCk9Pntcblx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcblx0XHRcdFx0XHRcdGkuZnJvbS5uYW1lID0gbmFtZXNbaS5mcm9tLmlkXSA/IG5hbWVzW2kuZnJvbS5pZF0ubmFtZSA6IGkuZnJvbS5uYW1lO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRkYXRhLnJhdy5kYXRhLnNoYXJlZHBvc3RzID0gZXh0ZW5kO1xuXHRcdFx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0c3dhbCh7XG5cdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxuXHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+Jyxcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcblx0XHRcdFx0fSkuZG9uZSgpO1xuXHRcdFx0fVxuXHRcdH1lbHNle1xuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHRcdH1cblx0fSxcblx0Z2V0TmFtZTogKGlkcyk9Pntcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9Pntcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9Lz9pZHM9JHtpZHMudG9TdHJpbmcoKX1gLCAocmVzKT0+e1xuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxufVxubGV0IHN0ZXAgPSB7XG5cdHN0ZXAxOiAoKT0+e1xuXHRcdCQoJy5zZWN0aW9uJykucmVtb3ZlQ2xhc3MoJ3N0ZXAyJyk7XG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xuXHR9LFxuXHRzdGVwMjogKCk9Pntcblx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcblx0XHQkKCcuc2VjdGlvbicpLmFkZENsYXNzKCdzdGVwMicpO1xuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcblx0fVxufVxuXG5sZXQgZGF0YSA9IHtcblx0cmF3OiB7fSxcblx0ZmlsdGVyZWQ6IHt9LFxuXHR1c2VyaWQ6ICcnLFxuXHRub3dMZW5ndGg6IDAsXG5cdGV4dGVuc2lvbjogZmFsc2UsXG5cdHByb21pc2VfYXJyYXk6IFtdLFxuXHR0ZXN0OiAoaWQpPT57XG5cdFx0Y29uc29sZS5sb2coaWQpO1xuXHR9LFxuXHRpbml0OiAoKT0+e1xuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XG5cdFx0ZGF0YS5yYXcgPSBbXTtcblx0fSxcblx0c3RhcnQ6IChmYmlkKT0+e1xuXHRcdGRhdGEuaW5pdCgpO1xuXHRcdGxldCBvYmogPSB7XG5cdFx0XHRmdWxsSUQ6IGZiaWRcblx0XHR9XG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHRsZXQgY29tbWFuZHMgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcblx0XHRsZXQgdGVtcF9kYXRhID0gb2JqO1xuXHRcdGZvcihsZXQgaSBvZiBjb21tYW5kcyl7XG5cdFx0XHR0ZW1wX2RhdGEuZGF0YSA9IHt9O1xuXHRcdFx0bGV0IHByb21pc2UgPSBkYXRhLmdldCh0ZW1wX2RhdGEsIGkpLnRoZW4oKHJlcyk9Pntcblx0XHRcdFx0dGVtcF9kYXRhLmRhdGFbaV0gPSByZXM7XG5cdFx0XHR9KTtcblx0XHRcdGRhdGEucHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xuXHRcdH1cblxuXHRcdFByb21pc2UuYWxsKGRhdGEucHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xuXHRcdFx0ZGF0YS5maW5pc2godGVtcF9kYXRhKTtcblx0XHR9KTtcblx0fSxcblx0Z2V0OiAoZmJpZCwgY29tbWFuZCk9Pntcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9Pntcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcblx0XHRcdGxldCBzaGFyZUVycm9yID0gMDtcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpIGNvbW1hbmQgPSAnZ3JvdXAnO1xuXHRcdFx0aWYgKGNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpe1xuXHRcdFx0XHRnZXRTaGFyZSgpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtjb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtjb21tYW5kXX0mb3JkZXI9Y2hyb25vbG9naWNhbCZmaWVsZHM9JHtjb25maWcuZmllbGRbY29tbWFuZF0udG9TdHJpbmcoKX1gLChyZXMpPT57XG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCl7XG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pLmZhaWwoKCk9Pntcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGdldFNoYXJlKGFmdGVyPScnKXtcblx0XHRcdFx0bGV0IHVybCA9IGBodHRwczovL2FtNjZhaGd0cDguZXhlY3V0ZS1hcGkuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbS9zaGFyZT9mYmlkPSR7ZmJpZC5mdWxsSUR9JmFmdGVyPSR7YWZ0ZXJ9YDtcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcblx0XHRcdFx0XHRpZiAocmVzID09PSAnZW5kJyl7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3JNZXNzYWdlKXtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XG5cdFx0XHRcdFx0XHR9ZWxzZSBpZihyZXMuZGF0YSl7XG5cdFx0XHRcdFx0XHRcdC8vIHNoYXJlRXJyb3IgPSAwO1xuXHRcdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRcdFx0XHRcdGxldCBuYW1lID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0aWYoaS5zdG9yeSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lID0gaS5zdG9yeS5zdWJzdHJpbmcoMCwgaS5zdG9yeS5pbmRleE9mKCcgc2hhcmVkJykpO1xuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZSA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRsZXQgaWQgPSBpLmlkLnN1YnN0cmluZygwLCBpLmlkLmluZGV4T2YoXCJfXCIpKTtcblx0XHRcdFx0XHRcdFx0XHRpLmZyb20gPSB7aWQsIG5hbWV9O1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goaSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Z2V0U2hhcmUocmVzLmFmdGVyKTtcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdGZpbmlzaDogKGZiaWQpPT57XG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdHN0ZXAuc3RlcDIoKTtcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcblx0XHQkKCcucmVzdWx0X2FyZWEgPiAudGl0bGUgc3BhbicpLnRleHQoZmJpZC5mdWxsSUQpO1xuXHRcdGRhdGEucmF3ID0gZmJpZDtcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJhd1wiLCBKU09OLnN0cmluZ2lmeShmYmlkKSk7XG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xuXHR9LFxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKT0+e1xuXHRcdGRhdGEuZmlsdGVyZWQgPSB7fTtcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcblx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhyYXdEYXRhLmRhdGEpKXtcblx0XHRcdGlmIChrZXkgPT09ICdyZWFjdGlvbnMnKSBpc1RhZyA9IGZhbHNlO1xuXHRcdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YS5kYXRhW2tleV0sIGtleSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1x0XG5cdFx0XHRkYXRhLmZpbHRlcmVkW2tleV0gPSBuZXdEYXRhO1xuXHRcdH1cblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpe1xuXHRcdFx0dGFibGUuZ2VuZXJhdGUoZGF0YS5maWx0ZXJlZCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gZGF0YS5maWx0ZXJlZDtcblx0XHR9XG5cdH0sXG5cdGV4Y2VsOiAocmF3KT0+e1xuXHRcdHZhciBuZXdPYmogPSBbXTtcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pe1xuXHRcdFx0JC5lYWNoKHJhdyxmdW5jdGlvbihpKXtcblx0XHRcdFx0dmFyIHRtcCA9IHtcblx0XHRcdFx0XHRcIk3DoyBz4buRXCI6IGkrMSxcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXG5cdFx0XHRcdFx0XCJUw6puXCIgOiB0aGlzLmZyb20ubmFtZSxcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcblx0XHRcdFx0XHRcIk7hu5lpIGR1bmcgdGluIG5o4bqvblwiIDogdGhpcy5zdG9yeSxcblx0XHRcdFx0XHRcIkxpa2VcIiA6IHRoaXMubGlrZV9jb3VudFxuXHRcdFx0XHR9XG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XG5cdFx0XHRcdHZhciB0bXAgPSB7XG5cdFx0XHRcdFx0XCJNw6Mgc+G7kVwiOiBpKzEsXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxuXHRcdFx0XHRcdFwiVMOqblwiIDogdGhpcy5mcm9tLm5hbWUsXG5cdFx0XHRcdFx0XCJUw6JtIHRy4bqhbmdcIiA6IHRoaXMudHlwZSB8fCAnJyxcblx0XHRcdFx0XHRcIk7hu5lpIGR1bmcgdGluIG5o4bqvblwiIDogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXG5cdFx0XHRcdFx0XCJUaOG7nWkgZ2lhbiDEkeG7gyBs4bqhaSBs4budaSBuaOG6r25cIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXG5cdFx0XHRcdH1cblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gbmV3T2JqO1xuXHR9LFxuXHRpbXBvcnQ6IChmaWxlKT0+e1xuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xuXHRcdH1cblxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuXHR9XG59XG5cbmxldCB0YWJsZSA9IHtcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcblx0XHRsZXQgZmlsdGVyZWQgPSByYXdkYXRhO1xuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoZmlsdGVyZWQpKXtcblx0XHRcdGxldCB0aGVhZCA9ICcnO1xuXHRcdFx0bGV0IHRib2R5ID0gJyc7XG5cdFx0XHRpZihrZXkgPT09ICdyZWFjdGlvbnMnKXtcblx0XHRcdFx0dGhlYWQgPSBgPHRkPk3DoyBz4buRPC90ZD5cblx0XHRcdFx0PHRkPlTDqm48L3RkPlxuXHRcdFx0XHQ8dGQ+VMOibSB0cuG6oW5nPC90ZD5gO1xuXHRcdFx0fWVsc2UgaWYoa2V5ID09PSAnc2hhcmVkcG9zdHMnKXtcblx0XHRcdFx0dGhlYWQgPSBgPHRkPk3DoyBz4buRPC90ZD5cblx0XHRcdFx0PHRkPlTDqm48L3RkPlxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPk7hu5lpIGR1bmcgdGluIG5o4bqvbjwvdGQ+XG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPlRo4budaSBnaWFuIMSR4buDIGzhuqFpIGzhu51pIG5o4bqvbjwvdGQ+YDtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+TcOjIHPhu5E8L3RkPlxuXHRcdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj5Uw6puPC90ZD5cblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj5O4buZaSBkdW5nIHRpbiBuaOG6r248L3RkPlxuXHRcdFx0XHQ8dGQ+TGlrZTwvdGQ+XG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPlRo4budaSBnaWFuIMSR4buDIGzhuqFpIGzhu51pIG5o4bqvbjwvdGQ+YDtcblx0XHRcdH1cblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xuXHRcdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xuXHRcdFx0XHRpZiAocGljKXtcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XG5cdFx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XG5cdFx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8IHZhbC5zdG9yeX08L2E+PC90ZD5cblx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cblx0XHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcblx0XHRcdFx0dGJvZHkgKz0gdHI7XG5cdFx0XHR9XG5cdFx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XG5cdFx0XHQkKFwiLnRhYmxlcyAuXCIra2V5K1wiIHRhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xuXHRcdH1cblx0XHRcblx0XHRhY3RpdmUoKTtcblx0XHR0YWIuaW5pdCgpO1xuXHRcdGNvbXBhcmUuaW5pdCgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdFx0bGV0IGFyciA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnLCdzaGFyZWRwb3N0cyddO1xuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dGFibGVcblx0XHRcdFx0XHQuY29sdW1ucygxKVxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcblx0XHRcdFx0XHQuZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0YWJsZVxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxuXHRcdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRyZWRvOiAoKT0+e1xuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcblx0fVxufVxuXG5sZXQgY29tcGFyZSA9IHtcblx0YW5kOiBbXSxcblx0b3I6IFtdLFxuXHRyYXc6IFtdLFxuXHRpbml0OiAoKT0+e1xuXHRcdGNvbXBhcmUuYW5kID0gW107XG5cdFx0Y29tcGFyZS5vciA9IFtdO1xuXHRcdGNvbXBhcmUucmF3ID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdGxldCBpZ25vcmUgPSAkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS52YWwoKTtcblx0XHRsZXQgYmFzZSA9IFtdO1xuXHRcdGxldCBmaW5hbCA9IFtdO1xuXHRcdGxldCBjb21wYXJlX251bSA9IDE7XG5cdFx0aWYgKGlnbm9yZSA9PT0gJ2lnbm9yZScpIGNvbXBhcmVfbnVtID0gMjtcblxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGNvbXBhcmUucmF3KSl7XG5cdFx0XHRpZiAoa2V5ICE9PSBpZ25vcmUpe1xuXHRcdFx0XHRmb3IobGV0IGkgb2YgY29tcGFyZS5yYXdba2V5XSl7XG5cdFx0XHRcdFx0YmFzZS5wdXNoKGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBzb3J0ID0gKGRhdGEucmF3LmV4dGVuc2lvbikgPyAnbmFtZSc6J2lkJztcblx0XHRiYXNlID0gYmFzZS5zb3J0KChhLGIpPT57XG5cdFx0XHRyZXR1cm4gYS5mcm9tW3NvcnRdID4gYi5mcm9tW3NvcnRdID8gMTotMTtcblx0XHR9KTtcblxuXHRcdGZvcihsZXQgaSBvZiBiYXNlKXtcblx0XHRcdGkubWF0Y2ggPSAwO1xuXHRcdH1cblxuXHRcdGxldCB0ZW1wID0gJyc7XG5cdFx0bGV0IHRlbXBfbmFtZSA9ICcnO1xuXHRcdC8vIGNvbnNvbGUubG9nKGJhc2UpO1xuXHRcdGZvcihsZXQgaSBpbiBiYXNlKXtcblx0XHRcdGxldCBvYmogPSBiYXNlW2ldO1xuXHRcdFx0aWYgKG9iai5mcm9tLmlkID09IHRlbXAgfHwgKGRhdGEucmF3LmV4dGVuc2lvbiAmJiAob2JqLmZyb20ubmFtZSA9PSB0ZW1wX25hbWUpKSl7XG5cdFx0XHRcdGxldCB0YXIgPSBmaW5hbFtmaW5hbC5sZW5ndGgtMV07XG5cdFx0XHRcdHRhci5tYXRjaCsrO1xuXHRcdFx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKXtcblx0XHRcdFx0XHRpZiAoIXRhcltrZXldKSB0YXJba2V5XSA9IG9ialtrZXldOyAvL+WQiOS9teizh+aWmVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0YXIubWF0Y2ggPT0gY29tcGFyZV9udW0pe1xuXHRcdFx0XHRcdHRlbXBfbmFtZSA9ICcnO1xuXHRcdFx0XHRcdHRlbXAgPSAnJztcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGZpbmFsLnB1c2gob2JqKTtcblx0XHRcdFx0dGVtcCA9IG9iai5mcm9tLmlkO1xuXHRcdFx0XHR0ZW1wX25hbWUgPSBvYmouZnJvbS5uYW1lO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdFxuXHRcdGNvbXBhcmUub3IgPSBmaW5hbDtcblx0XHRjb21wYXJlLmFuZCA9IGNvbXBhcmUub3IuZmlsdGVyKCh2YWwpPT57XG5cdFx0XHRyZXR1cm4gdmFsLm1hdGNoID09IGNvbXBhcmVfbnVtO1xuXHRcdH0pO1xuXHRcdGNvbXBhcmUuZ2VuZXJhdGUoKTtcblx0fSxcblx0Z2VuZXJhdGU6ICgpPT57XG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcblx0XHRsZXQgZGF0YV9hbmQgPSBjb21wYXJlLmFuZDtcblxuXHRcdGxldCB0Ym9keSA9ICcnO1xuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9hbmQuZW50cmllcygpKXtcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnMCd9PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XG5cdFx0XHR0Ym9keSArPSB0cjtcblx0XHR9XG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLmFuZCB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xuXG5cdFx0bGV0IGRhdGFfb3IgPSBjb21wYXJlLm9yO1xuXHRcdGxldCB0Ym9keTIgPSAnJztcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfb3IuZW50cmllcygpKXtcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnJ308L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcblx0XHRcdHRib2R5MiArPSB0cjtcblx0XHR9XG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLm9yIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keTIpO1xuXHRcdFxuXHRcdGFjdGl2ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKHtcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXG5cdFx0XHR9KTtcblx0XHRcdGxldCBhcnIgPSBbJ2FuZCcsJ29yJ107XG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0YWJsZVxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxuXHRcdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHRhYmxlXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXG5cdFx0XHRcdFx0LmRyYXcoKTtcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxubGV0IGNob29zZSA9IHtcblx0ZGF0YTogW10sXG5cdGF3YXJkOiBbXSxcblx0bnVtOiAwLFxuXHRkZXRhaWw6IGZhbHNlLFxuXHRsaXN0OiBbXSxcblx0aW5pdDogKGN0cmwgPSBmYWxzZSk9Pntcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xuXHRcdGNob29zZS5saXN0ID0gW107XG5cdFx0Y2hvb3NlLm51bSA9IDA7XG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XG5cdFx0XHRcdGlmIChuID4gMCl7XG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1lbHNle1xuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcblx0XHR9XG5cdFx0Y2hvb3NlLmdvKGN0cmwpO1xuXHR9LFxuXHRnbzogKGN0cmwpPT57XG5cdFx0bGV0IGNvbW1hbmQgPSB0YWIubm93O1xuXHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcblx0XHR9ZWxzZXtcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhW2NvbW1hbmRdLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHRcblx0XHR9XG5cdFx0bGV0IGluc2VydCA9ICcnO1xuXHRcdGxldCB0ZW1wQXJyID0gW107XG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5jb2x1bW4oMikuZGF0YSgpLmVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KXtcblx0XHRcdFx0bGV0IHdvcmQgPSAkKCcuc2VhcmNoQ29tbWVudCcpLnZhbCgpO1xuXHRcdFx0XHRpZiAodmFsdWUuaW5kZXhPZih3b3JkKSA+PSAwKSB0ZW1wQXJyLnB1c2goaW5kZXgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGZvcihsZXQgaSBvZiBjaG9vc2UuYXdhcmQpe1xuXHRcdFx0bGV0IHJvdyA9ICh0ZW1wQXJyLmxlbmd0aCA9PSAwKSA/IGk6dGVtcEFycltpXTtcblx0XHRcdGxldCB0YXIgPSAkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLnJvdyhyb3cpLm5vZGUoKS5pbm5lckhUTUw7XG5cdFx0XHRpbnNlcnQgKz0gJzx0cj4nICsgdGFyICsgJzwvdHI+Jztcblx0XHR9XG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcblx0XHRpZiAoIWN0cmwpe1xuXHRcdFx0JChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRsZXQgdGFyID0gJCh0aGlzKS5maW5kKCd0ZCcpLmVxKDEpO1xuXHRcdFx0XHRsZXQgaWQgPSB0YXIuZmluZCgnYScpLmF0dHIoJ2F0dHItZmJpZCcpO1xuXHRcdFx0XHR0YXIucHJlcGVuZChgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcblxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xuXHRcdFx0bGV0IG5vdyA9IDA7XG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI3XCI+VMOqbiBz4bqjbiBwaOG6qW3vvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XG5cdFx0XHR9XG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XG5cdFx0fVxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcblx0fVxufVxuXG5sZXQgZmlsdGVyID0ge1xuXHR0b3RhbEZpbHRlcjogKHJhdywgY29tbWFuZCwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9Pntcblx0XHRsZXQgZGF0YSA9IHJhdztcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XG5cdFx0fVxuXHRcdGlmICh3b3JkICE9PSAnJyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xuXHRcdH1cblx0XHRpZiAoaXNUYWcgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xuXHRcdH1cblx0XHRpZiAoY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIGVuZFRpbWUpO1xuXHRcdH1lbHNle1xuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH0sXG5cdHVuaXF1ZTogKGRhdGEpPT57XG5cdFx0bGV0IG91dHB1dCA9IFtdO1xuXHRcdGxldCBrZXlzID0gW107XG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH0sXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0dGFnOiAoZGF0YSk9Pntcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3QXJ5O1xuXHR9LFxuXHR0aW1lOiAoZGF0YSwgdCk9Pntcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuZXdBcnk7XG5cdFx0fVxuXHR9XG59XG5cbmxldCB1aSA9IHtcblx0aW5pdDogKCk9PntcblxuXHR9XG59XG5cbmxldCB0YWIgPSB7XG5cdG5vdzogXCJjb21tZW50c1wiLFxuXHRpbml0OiAoKT0+e1xuXHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0dGFiLm5vdyA9ICQodGhpcykuYXR0cignYXR0ci10eXBlJyk7XG5cdFx0XHRsZXQgdGFyID0gJCh0aGlzKS5pbmRleCgpO1xuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5lcSh0YXIpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xuXHRcdFx0XHRjb21wYXJlLmluaXQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5cblxuZnVuY3Rpb24gbm93RGF0ZSgpe1xuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcbn1cblxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcbiAgICAgaWYgKGRhdGUgPCAxMCl7XG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XG4gICAgIH1cbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XG4gICAgIGlmIChob3VyIDwgMTApe1xuICAgICBcdGhvdXIgPSBcIjBcIitob3VyO1xuICAgICB9XG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcbiAgICAgaWYgKG1pbiA8IDEwKXtcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XG4gICAgIH1cbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xuICAgICBpZiAoc2VjIDwgMTApe1xuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcbiAgICAgfVxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcbiAgICAgcmV0dXJuIHRpbWU7XG4gfVxuXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcbiBcdH0pO1xuIFx0cmV0dXJuIGFycmF5O1xuIH1cblxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcbiBcdHZhciBpLCByLCB0O1xuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XG4gXHRcdGFyeVtpXSA9IGk7XG4gXHR9XG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xuIFx0XHR0ID0gYXJ5W3JdO1xuIFx0XHRhcnlbcl0gPSBhcnlbaV07XG4gXHRcdGFyeVtpXSA9IHQ7XG4gXHR9XG4gXHRyZXR1cm4gYXJ5O1xuIH1cblxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xuICAgIFxuICAgIHZhciBDU1YgPSAnJzsgICAgXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXG4gICAgXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XG5cbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxuICAgIGlmIChTaG93TGFiZWwpIHtcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XG4gICAgICAgIFxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcbiAgICB9XG4gICAgXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xuICAgICAgICBcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xuICAgIH1cblxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gICBcbiAgICBcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxuICAgIFxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcbiAgICBcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXG4gICAgXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxuICAgIGxpbmsuaHJlZiA9IHVyaTtcbiAgICBcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XG4gICAgXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpbmsuY2xpY2soKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xufSJdfQ==
