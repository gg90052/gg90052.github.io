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
						} else {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJsYXN0RGF0YSIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJkYXRhIiwiZmluaXNoIiwic2Vzc2lvblN0b3JhZ2UiLCJsb2dpbiIsImZiIiwiZ2VuT3B0aW9uIiwiY2xpY2siLCJlIiwiZXh0ZW5zaW9uQXV0aCIsImdldEF1dGgiLCJjdHJsS2V5IiwiYWx0S2V5IiwiY2hvb3NlIiwiaW5pdCIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJuZXdlc3QiLCJ3b3JkIiwiYXV0aCIsImV4dGVuc2lvbiIsIm5leHQiLCJ0eXBlIiwiRkIiLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFN0ciIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJpbmRleE9mIiwic3dhbCIsImRvbmUiLCJmYmlkIiwiUHJvbWlzZSIsImFsbCIsImdldE1lIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsIm9wdGlvbnMiLCJpIiwiaiIsImlkIiwibmFtZSIsInNlbGVjdFBhZ2UiLCJ0YXIiLCJhdHRyIiwic3RlcCIsInN0ZXAxIiwiaGlkZGVuU3RhcnQiLCJwYWdlSUQiLCJjbGVhciIsImVtcHR5Iiwib2ZmIiwiZmluZCIsImNvbW1hbmQiLCJhcGkiLCJwYWdpbmciLCJzdHIiLCJnZW5EYXRhIiwibWVzc2FnZSIsInJlY29tbWFuZCIsImdlbkNhcmQiLCJvYmoiLCJpZHMiLCJzcGxpdCIsImxpbmsiLCJtZXNzIiwicmVwbGFjZSIsInRpbWVDb252ZXJ0ZXIiLCJjcmVhdGVkX3RpbWUiLCJzcmMiLCJmdWxsX3BpY3R1cmUiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJyIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJleHRlbmQiLCJmaWQiLCJwdXNoIiwiZnJvbSIsInByb21pc2VfYXJyYXkiLCJuYW1lcyIsInByb21pc2UiLCJnZXROYW1lIiwiT2JqZWN0Iiwia2V5cyIsInRpdGxlIiwiaHRtbCIsInRvU3RyaW5nIiwic2Nyb2xsVG9wIiwic3RlcDIiLCJmaWx0ZXJlZCIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInRlc3QiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImZ1bGxJRCIsImNvbW1hbmRzIiwidGVtcF9kYXRhIiwiZ2V0IiwiZGF0YXMiLCJnZXRTaGFyZSIsImQiLCJnZXROZXh0IiwiZ2V0SlNPTiIsImZhaWwiLCJhZnRlciIsInN0b3J5Iiwic3Vic3RyaW5nIiwic2V0SXRlbSIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwia2V5IiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwibGlrZV9jb3VudCIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsInBpYyIsInRoZWFkIiwidGJvZHkiLCJlbnRyaWVzIiwicGljdHVyZSIsInRkIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYW5kIiwib3IiLCJpZ25vcmUiLCJiYXNlIiwiZmluYWwiLCJjb21wYXJlX251bSIsInNvcnQiLCJhIiwiYiIsIm1hdGNoIiwidGVtcCIsInRlbXBfbmFtZSIsImRhdGFfYW5kIiwiZGF0YV9vciIsInRib2R5MiIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsImN0cmwiLCJuIiwicGFyc2VJbnQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsInRlbXBBcnIiLCJjb2x1bW4iLCJpbmRleCIsInJvdyIsIm5vZGUiLCJpbm5lckhUTUwiLCJlcSIsInByZXBlbmQiLCJrIiwiaW5zZXJ0QmVmb3JlIiwidW5pcXVlIiwidGFnIiwidGltZSIsIm91dHB1dCIsImZvckVhY2giLCJpdGVtIiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsIm1vbWVudCIsIkRhdGUiLCJfZCIsInVpIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwibWFwIiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJzbGljZSIsImFsZXJ0IiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBZUMsU0FBZjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNOLFlBQUwsRUFBa0I7QUFDakJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUMsSUFBRSxpQkFBRixFQUFxQkMsTUFBckI7QUFDQVYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRFMsRUFBRUUsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0IsS0FBSUMsV0FBV0MsS0FBS0MsS0FBTCxDQUFXQyxhQUFhQyxPQUFiLENBQXFCLEtBQXJCLENBQVgsQ0FBZjtBQUNBLEtBQUlKLFFBQUosRUFBYTtBQUNaSyxPQUFLQyxNQUFMLENBQVlOLFFBQVo7QUFDQTtBQUNELEtBQUlPLGVBQWVDLEtBQW5CLEVBQXlCO0FBQ3hCQyxLQUFHQyxTQUFILENBQWFULEtBQUtDLEtBQUwsQ0FBV0ssZUFBZUMsS0FBMUIsQ0FBYjtBQUNBOztBQUVEWixHQUFFLCtCQUFGLEVBQW1DZSxLQUFuQyxDQUF5QyxVQUFTQyxDQUFULEVBQVc7QUFDbkRILEtBQUdJLGFBQUg7QUFDQSxFQUZEOztBQUlBakIsR0FBRSxlQUFGLEVBQW1CZSxLQUFuQixDQUF5QixVQUFTQyxDQUFULEVBQVc7QUFDbkNILEtBQUdLLE9BQUgsQ0FBVyxVQUFYO0FBQ0EsRUFGRDs7QUFJQWxCLEdBQUUsWUFBRixFQUFnQmUsS0FBaEIsQ0FBc0IsWUFBVTtBQUMvQkYsS0FBR0ssT0FBSCxDQUFXLFVBQVg7QUFDQSxFQUZEO0FB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Wjs7QUFFQTtBQUNBLEtBQUlrSyxNQUFNLHVDQUF1Q0MsVUFBVUwsR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUloSyxPQUFPMUgsU0FBU2dTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBdEssTUFBS3VLLElBQUwsR0FBWUgsR0FBWjs7QUFFQTtBQUNBcEssTUFBS3dLLEtBQUwsR0FBYSxtQkFBYjtBQUNBeEssTUFBS3lLLFFBQUwsR0FBZ0JOLFdBQVcsTUFBM0I7O0FBRUE7QUFDQTdSLFVBQVNvUyxJQUFULENBQWNDLFdBQWQsQ0FBMEIzSyxJQUExQjtBQUNBQSxNQUFLN0csS0FBTDtBQUNBYixVQUFTb1MsSUFBVCxDQUFjRSxXQUFkLENBQTBCNUssSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1x0XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdGxldCBsYXN0RGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyYXdcIikpO1xyXG5cdGlmIChsYXN0RGF0YSl7XHJcblx0XHRkYXRhLmZpbmlzaChsYXN0RGF0YSk7XHJcblx0fVxyXG5cdGlmIChzZXNzaW9uU3RvcmFnZS5sb2dpbil7XHJcblx0XHRmYi5nZW5PcHRpb24oSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbikpO1xyXG5cdH1cclxuXHJcblx0JChcIi50YWJsZXMgPiAuc2hhcmVkcG9zdHMgYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdH0pO1xyXG5cdFxyXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fc3RhcnRcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdGNob29zZS5pbml0KHRydWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5pbml0KCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0XHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgIWUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLnRhYmxlcyAuZmlsdGVycyAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnRhYmxlcyAudG90YWwgLmZpbHRlcnMgc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb21wYXJlLmluaXQoKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLmNvbXBhcmVfY29uZGl0aW9uJykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZScpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS4nKyAkKHRoaXMpLnZhbCgpKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwic2luZ2xlRGF0ZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZLU1NLUREICAgSEg6bW1cIixcclxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXHJcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxyXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXHJcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxyXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxyXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcclxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcclxuXHRcdFx0XCLml6VcIixcclxuXHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XCLkuoxcIixcclxuXHRcdFx0XCLkuIlcIixcclxuXHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XCLkupRcIixcclxuXHRcdFx0XCLlha1cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xyXG5cdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcIuS6jOaciFwiLFxyXG5cdFx0XHRcIuS4ieaciFwiLFxyXG5cdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcIuS6lOaciFwiLFxyXG5cdFx0XHRcIuWFreaciFwiLFxyXG5cdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcIuWFq+aciFwiLFxyXG5cdFx0XHRcIuS5neaciFwiLFxyXG5cdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcIuWNgeS4gOaciFwiLFxyXG5cdFx0XHRcIuWNgeS6jOaciFwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwiZmlyc3REYXlcIjogMVxyXG5cdFx0fSxcclxuXHR9LGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSl7XHJcblx0XHRcdGxldCBkZDtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YVt0YWIubm93XSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIGRkO1xyXG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHRcdFx0d2luZG93LmZvY3VzKCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCl7XHJcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YVt0YWIubm93XSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcblxyXG5cdGxldCBjaV9jb3VudGVyID0gMDtcclxuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSl7XHJcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdH1cclxuXHRcdGlmKGUuY3RybEtleSl7XHJcblx0XHRcdGZiLmdldEF1dGgoJ3NoYXJlZHBvc3RzJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZSxmcm9tJywnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFtdXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi43JyxcclxuXHRcdHJlYWN0aW9uczogJ3YyLjcnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4zJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxyXG5cdFx0ZmVlZDogJ3YyLjMnLFxyXG5cdFx0Z3JvdXA6ICd2Mi4zJyxcclxuXHRcdG5ld2VzdDogJ3YyLjgnXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX21hbmFnZWRfZ3JvdXBzLG1hbmFnZV9wYWdlcycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdG5leHQ6ICcnLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRcdGZiLnN0YXJ0KCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5o6I5qyK5aSx5pWX77yM6KuL57Wm5LqI5omA5pyJ5qyK6ZmQJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKCk9PntcclxuXHRcdFByb21pc2UuYWxsKFtmYi5nZXRNZSgpLGZiLmdldFBhZ2UoKSwgZmIuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0c2Vzc2lvblN0b3JhZ2UubG9naW4gPSBKU09OLnN0cmluZ2lmeShyZXMpO1xyXG5cdFx0XHRmYi5nZW5PcHRpb24ocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2VuT3B0aW9uOiAocmVzKT0+e1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IG9wdGlvbnMgPSAnJztcclxuXHRcdGxldCB0eXBlID0gLTE7XHJcblx0XHQkKCcjYnRuX3N0YXJ0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdGZvcihsZXQgaSBvZiByZXMpe1xyXG5cdFx0XHR0eXBlKys7XHJcblx0XHRcdGZvcihsZXQgaiBvZiBpKXtcclxuXHRcdFx0XHRvcHRpb25zICs9IGA8ZGl2IGNsYXNzPVwicGFnZV9idG5cIiBhdHRyLXR5cGU9XCIke3R5cGV9XCIgYXR0ci12YWx1ZT1cIiR7ai5pZH1cIiBvbmNsaWNrPVwiZmIuc2VsZWN0UGFnZSh0aGlzKVwiPiR7ai5uYW1lfTwvZGl2PmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJyNlbnRlclVSTCcpLmFwcGVuZChvcHRpb25zKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdH0sXHJcblx0c2VsZWN0UGFnZTogKGUpPT57XHJcblx0XHQkKCcjZW50ZXJVUkwgLnBhZ2VfYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IHRhciA9ICQoZSk7XHJcblx0XHR0YXIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0ZmIuZmVlZCh0YXIuYXR0cignYXR0ci12YWx1ZScpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQpO1xyXG5cdFx0c3RlcC5zdGVwMSgpO1xyXG5cdH0sXHJcblx0aGlkZGVuU3RhcnQ6ICgpPT57XHJcblx0XHRsZXQgZmJpZCA9ICQoJ2hlYWRlciAuZGV2IGlucHV0JykudmFsKCk7XHJcblx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdH0sXHJcblx0ZmVlZDogKHBhZ2VJRCwgdHlwZSwgdXJsID0gJycsIGNsZWFyID0gdHJ1ZSk9PntcclxuXHRcdGlmIChjbGVhcil7XHJcblx0XHRcdCQoJy5yZWNvbW1hbmRzLCAuZmVlZHMgdGJvZHknKS5lbXB0eSgpO1xyXG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy5mZWVkcyAuYnRuJykub2ZmKCdjbGljaycpLmNsaWNrKCgpPT57XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoJyNlbnRlclVSTCBzZWxlY3QnKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKTtcclxuXHRcdFx0XHRmYi5mZWVkKHRhci52YWwoKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0LCBmYWxzZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGNvbW1hbmQgPSAodHlwZSA9PSAnMicpID8gJ2ZlZWQnOidwb3N0cyc7XHJcblx0XHRsZXQgYXBpO1xyXG5cdFx0aWYgKHVybCA9PSAnJyl7XHJcblx0XHRcdGFwaSA9IGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlSUR9LyR7Y29tbWFuZH0/ZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTI1YDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRhcGkgPSB1cmw7XHJcblx0XHR9XHJcblx0XHRGQi5hcGkoYXBpLCAocmVzKT0+e1xyXG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID09IDApe1xyXG5cdFx0XHRcdCQoJy5mZWVkcyAuYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmYi5uZXh0ID0gcmVzLnBhZ2luZy5uZXh0O1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdGxldCBzdHIgPSBnZW5EYXRhKGkpO1xyXG5cdFx0XHRcdCQoJy5zZWN0aW9uIC5mZWVkcyB0Ym9keScpLmFwcGVuZChzdHIpO1xyXG5cdFx0XHRcdGlmIChpLm1lc3NhZ2UgJiYgaS5tZXNzYWdlLmluZGV4T2YoJ+aKvScpID49IDApe1xyXG5cdFx0XHRcdFx0bGV0IHJlY29tbWFuZCA9IGdlbkNhcmQoaSk7XHJcblx0XHRcdFx0XHQkKCcuZG9uYXRlX2FyZWEgLnJlY29tbWFuZHMnKS5hcHBlbmQocmVjb21tYW5kKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdlbkRhdGEob2JqKXtcclxuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XHJcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xyXG5cclxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0bGV0IHN0ciA9IGA8dHI+XHJcblx0XHRcdFx0XHRcdDx0ZD48ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgIG9uY2xpY2s9XCJkYXRhLnN0YXJ0KCcke29iai5pZH0nKVwiPumWi+WnizwvZGl2PjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bWVzc308L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKG9iai5jcmVhdGVkX3RpbWUpfTwvdGQ+XHJcblx0XHRcdFx0XHRcdDwvdHI+YDtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGdlbkNhcmQob2JqKXtcclxuXHRcdFx0bGV0IHNyYyA9IG9iai5mdWxsX3BpY3R1cmUgfHwgJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzAweDIyNSc7XHJcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xyXG5cdFx0XHRsZXQgbGluayA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJytpZHNbMF0rJy9wb3N0cy8nK2lkc1sxXTtcclxuXHRcdFx0XHJcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XHJcblx0XHRcdGxldFx0c3RyID0gYDxkaXYgY2xhc3M9XCJjYXJkXCI+XHJcblx0XHRcdDxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWltYWdlXCI+XHJcblx0XHRcdDxmaWd1cmUgY2xhc3M9XCJpbWFnZSBpcy00YnkzXCI+XHJcblx0XHRcdDxpbWcgc3JjPVwiJHtzcmN9XCIgYWx0PVwiXCI+XHJcblx0XHRcdDwvZmlndXJlPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9hPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1jb250ZW50XCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcblx0XHRcdCR7bWVzc31cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+XHJcblx0XHRcdDwvZGl2PmA7XHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRNZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XHJcblx0XHRcdFx0bGV0IGFyciA9IFtyZXNdO1xyXG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHNgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkF1dGg6ICgpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25DYWxsYmFjazogKHJlc3BvbnNlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xyXG5cdFx0XHRcdGRhdGEucmF3LmV4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRcdFx0bGV0IGV4dGVuZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaGFyZWRwb3N0c1wiKSk7XHJcblx0XHRcdFx0bGV0IGZpZCA9IFtdO1xyXG5cdFx0XHRcdGxldCBpZHMgPSBbXTtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdGZpZC5wdXNoKGkuZnJvbS5pZCk7XHJcblx0XHRcdFx0XHRpZiAoZmlkLmxlbmd0aCA+PTQ1KXtcclxuXHRcdFx0XHRcdFx0aWRzLnB1c2goZmlkKTtcclxuXHRcdFx0XHRcdFx0ZmlkID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlkcy5wdXNoKGZpZCk7XHJcblx0XHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXSwgbmFtZXMgPSB7fTtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgaWRzKXtcclxuXHRcdFx0XHRcdGxldCBwcm9taXNlID0gZmIuZ2V0TmFtZShpKS50aGVuKChyZXMpPT57XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBPYmplY3Qua2V5cyhyZXMpKXtcclxuXHRcdFx0XHRcdFx0XHRuYW1lc1tpXSA9IHJlc1tpXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRwcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRQcm9taXNlLmFsbChwcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0aS5mcm9tLm5hbWUgPSBuYW1lc1tpLmZyb20uaWRdID8gbmFtZXNbaS5mcm9tLmlkXS5uYW1lIDogaS5mcm9tLm5hbWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkYXRhLnJhdy5kYXRhLnNoYXJlZHBvc3RzID0gZXh0ZW5kO1xyXG5cdFx0XHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXROYW1lOiAoaWRzKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9Lz9pZHM9JHtpZHMudG9TdHJpbmcoKX1gLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxubGV0IHN0ZXAgPSB7XHJcblx0c3RlcDE6ICgpPT57XHJcblx0XHQkKCcuc2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH0sXHJcblx0c3RlcDI6ICgpPT57XHJcblx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcclxuXHRcdCQoJy5zZWN0aW9uJykuYWRkQ2xhc3MoJ3N0ZXAyJyk7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IHt9LFxyXG5cdGZpbHRlcmVkOiB7fSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdHRlc3Q6IChpZCk9PntcclxuXHRcdGNvbnNvbGUubG9nKGlkKTtcclxuXHR9LFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKT0+e1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRmdWxsSUQ6IGZiaWRcclxuXHRcdH1cclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgY29tbWFuZHMgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcclxuXHRcdGxldCB0ZW1wX2RhdGEgPSBvYmo7XHJcblx0XHRmb3IobGV0IGkgb2YgY29tbWFuZHMpe1xyXG5cdFx0XHR0ZW1wX2RhdGEuZGF0YSA9IHt9O1xyXG5cdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KHRlbXBfZGF0YSwgaSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdHRlbXBfZGF0YS5kYXRhW2ldID0gcmVzO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdGRhdGEuZmluaXNoKHRlbXBfZGF0YSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQsIGNvbW1hbmQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpIGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHRpZiAoY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0Z2V0U2hhcmUoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2NvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2NvbW1hbmRdfSZvcmRlcj1jaHJvbm9sb2dpY2FsJmZpZWxkcz0ke2NvbmZpZy5maWVsZFtjb21tYW5kXS50b1N0cmluZygpfWAsKHJlcyk9PntcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXRTaGFyZShhZnRlcj0nJyl7XHJcblx0XHRcdFx0bGV0IHVybCA9IGBodHRwczovL2FtNjZhaGd0cDguZXhlY3V0ZS1hcGkuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbS9zaGFyZT9mYmlkPSR7ZmJpZC5mdWxsSUR9JmFmdGVyPSR7YWZ0ZXJ9YDtcclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0aWYgKHJlcyA9PT0gJ2VuZCcpe1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yTWVzc2FnZSl7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgbmFtZSA9IGkuc3Rvcnkuc3Vic3RyaW5nKDAsIGkuc3RvcnkuaW5kZXhPZignIHNoYXJlZCcpKTtcclxuXHRcdFx0XHRcdFx0XHRcdGxldCBpZCA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aS5mcm9tID0ge2lkLCBuYW1lfTtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goaSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGdldFNoYXJlKHJlcy5hZnRlcik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdHN0ZXAuc3RlcDIoKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0JCgnLnJlc3VsdF9hcmVhID4gLnRpdGxlIHNwYW4nKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmF3XCIsIEpTT04uc3RyaW5naWZ5KGZiaWQpKTtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XHJcblx0XHRkYXRhLmZpbHRlcmVkID0ge307XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocmF3RGF0YS5kYXRhKSl7XHJcblx0XHRcdGlmIChrZXkgPT09ICdyZWFjdGlvbnMnKSBpc1RhZyA9IGZhbHNlO1xyXG5cdFx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLmRhdGFba2V5XSwga2V5LCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHRcclxuXHRcdFx0ZGF0YS5maWx0ZXJlZFtrZXldID0gbmV3RGF0YTtcclxuXHRcdH1cclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSl7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmlsdGVyZWQpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBkYXRhLmZpbHRlcmVkO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpPT57XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pe1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuW/g+aDhVwiIDogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpPT57XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmVkID0gcmF3ZGF0YTtcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhmaWx0ZXJlZCkpe1xyXG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZD7lv4Pmg4U8L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgdmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0XHQkKFwiLnRhYmxlcyAuXCIra2V5K1wiIHRhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHRcdHRhYi5pbml0KCk7XHJcblx0XHRjb21wYXJlLmluaXQoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjb21wYXJlID0ge1xyXG5cdGFuZDogW10sXHJcblx0b3I6IFtdLFxyXG5cdHJhdzogW10sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdGNvbXBhcmUuYW5kID0gW107XHJcblx0XHRjb21wYXJlLm9yID0gW107XHJcblx0XHRjb21wYXJlLnJhdyA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGxldCBpZ25vcmUgPSAkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS52YWwoKTtcclxuXHRcdGxldCBiYXNlID0gW107XHJcblx0XHRsZXQgZmluYWwgPSBbXTtcclxuXHRcdGxldCBjb21wYXJlX251bSA9IDE7XHJcblx0XHRpZiAoaWdub3JlID09PSAnaWdub3JlJykgY29tcGFyZV9udW0gPSAyO1xyXG5cclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGNvbXBhcmUucmF3KSl7XHJcblx0XHRcdGlmIChrZXkgIT09IGlnbm9yZSl7XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGNvbXBhcmUucmF3W2tleV0pe1xyXG5cdFx0XHRcdFx0YmFzZS5wdXNoKGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IHNvcnQgPSAoZGF0YS5yYXcuZXh0ZW5zaW9uKSA/ICduYW1lJzonaWQnO1xyXG5cdFx0YmFzZSA9IGJhc2Uuc29ydCgoYSxiKT0+e1xyXG5cdFx0XHRyZXR1cm4gYS5mcm9tW3NvcnRdID4gYi5mcm9tW3NvcnRdID8gMTotMTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGZvcihsZXQgaSBvZiBiYXNlKXtcclxuXHRcdFx0aS5tYXRjaCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdGxldCB0ZW1wX25hbWUgPSAnJztcclxuXHRcdGZvcihsZXQgaSBpbiBiYXNlKXtcclxuXHRcdFx0bGV0IG9iaiA9IGJhc2VbaV07XHJcblx0XHRcdGlmIChvYmouZnJvbS5pZCA9PSB0ZW1wIHx8IChkYXRhLnJhdy5leHRlbnNpb24gJiYgKG9iai5mcm9tLm5hbWUgPT0gdGVtcF9uYW1lKSkpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSBmaW5hbFtmaW5hbC5sZW5ndGgtMV07XHJcblx0XHRcdFx0dGFyLm1hdGNoKys7XHJcblx0XHRcdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSl7XHJcblx0XHRcdFx0XHRpZiAoIXRhcltrZXldKSB0YXJba2V5XSA9IG9ialtrZXldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmluYWwucHVzaChvYmopO1xyXG5cdFx0XHRcdHRlbXAgPSBvYmouZnJvbS5pZDtcclxuXHRcdFx0XHR0ZW1wX25hbWUgPSBvYmouZnJvbS5uYW1lO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0XHJcblx0XHRjb21wYXJlLm9yID0gZmluYWw7XHJcblx0XHRjb21wYXJlLmFuZCA9IGNvbXBhcmUub3IuZmlsdGVyKCh2YWwpPT57XHJcblx0XHRcdHJldHVybiB2YWwubWF0Y2ggPT0gY29tcGFyZV9udW07XHJcblx0XHR9KTtcclxuXHRcdGNvbXBhcmUuZ2VuZXJhdGUoKTtcclxuXHR9LFxyXG5cdGdlbmVyYXRlOiAoKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBkYXRhX2FuZCA9IGNvbXBhcmUuYW5kO1xyXG5cclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX2FuZC5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnMCd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLmFuZCB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cclxuXHRcdGxldCBkYXRhX29yID0gY29tcGFyZS5vcjtcclxuXHRcdGxldCB0Ym9keTIgPSAnJztcclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9vci5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkyICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLm9yIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keTIpO1xyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IGFyciA9IFsnYW5kJywnb3InXTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoY3RybCA9IGZhbHNlKT0+e1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApe1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oY3RybCk7XHJcblx0fSxcclxuXHRnbzogKGN0cmwpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9IHRhYi5ub3c7XHJcblx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YVtjb21tYW5kXS5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1x0XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRsZXQgdGVtcEFyciA9IFtdO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLmNvbHVtbigyKS5kYXRhKCkuZWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpe1xyXG5cdFx0XHRcdGxldCB3b3JkID0gJCgnLnNlYXJjaENvbW1lbnQnKS52YWwoKTtcclxuXHRcdFx0XHRpZiAodmFsdWUuaW5kZXhPZih3b3JkKSA+PSAwKSB0ZW1wQXJyLnB1c2goaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiBjaG9vc2UuYXdhcmQpe1xyXG5cdFx0XHRsZXQgcm93ID0gKHRlbXBBcnIubGVuZ3RoID09IDApID8gaTp0ZW1wQXJyW2ldO1xyXG5cdFx0XHRsZXQgdGFyID0gJCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5yb3cocm93KS5ub2RlKCkuaW5uZXJIVE1MO1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0cj4nICsgdGFyICsgJzwvdHI+JztcclxuXHRcdH1cclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKGluc2VydCk7XHJcblx0XHRpZiAoIWN0cmwpe1xyXG5cdFx0XHQkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQodGhpcykuZmluZCgndGQnKS5lcSgxKTtcclxuXHRcdFx0XHRsZXQgaWQgPSB0YXIuZmluZCgnYScpLmF0dHIoJ2F0dHItZmJpZCcpO1xyXG5cdFx0XHRcdHRhci5wcmVwZW5kKGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYoY2hvb3NlLmRldGFpbCl7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiN1wiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcclxuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3LCBjb21tYW5kLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBlbmRUaW1lKT0+e1xyXG5cdFx0bGV0IGRhdGEgPSByYXc7XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmICh3b3JkICE9PSAnJyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50YWcoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgZW5kVGltZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgdCk9PntcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIil7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKT0+e1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpPT57XHJcblxyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYiA9IHtcclxuXHRub3c6IFwiY29tbWVudHNcIixcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHR0YWIubm93ID0gJCh0aGlzKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdFx0bGV0IHRhciA9ICQodGhpcykuaW5kZXgoKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLmVxKHRhcikuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRjb21wYXJlLmluaXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKXtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyK1wiLVwiK21vbnRoK1wiLVwiK2RhdGUrXCItXCIraG91citcIi1cIittaW4rXCItXCIrc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKXtcclxuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XHJcbiAgICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuICAgICBpZiAoZGF0ZSA8IDEwKXtcclxuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xyXG4gICAgIH1cclxuICAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuICAgICBpZiAoaG91ciA8IDEwKXtcclxuICAgICBcdGhvdXIgPSBcIjBcIitob3VyO1xyXG4gICAgIH1cclxuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcbiAgICAgaWYgKG1pbiA8IDEwKXtcclxuICAgICBcdG1pbiA9IFwiMFwiK21pbjtcclxuICAgICB9XHJcbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG4gICAgIGlmIChzZWMgPCAxMCl7XHJcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XHJcbiAgICAgfVxyXG4gICAgIHZhciB0aW1lID0geWVhcisnLScrbW9udGgrJy0nK2RhdGUrXCIgXCIraG91cisnOicrbWluKyc6JytzZWMgO1xyXG4gICAgIHJldHVybiB0aW1lO1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xyXG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG4gXHRcdHJldHVybiBbdmFsdWVdO1xyXG4gXHR9KTtcclxuIFx0cmV0dXJuIGFycmF5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuIFx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG4gXHR2YXIgaSwgciwgdDtcclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0YXJ5W2ldID0gaTtcclxuIFx0fVxyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcbiBcdFx0dCA9IGFyeVtyXTtcclxuIFx0XHRhcnlbcl0gPSBhcnlbaV07XHJcbiBcdFx0YXJ5W2ldID0gdDtcclxuIFx0fVxyXG4gXHRyZXR1cm4gYXJ5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuICAgIFxyXG4gICAgdmFyIENTViA9ICcnOyAgICBcclxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG4gICAgXHJcbiAgICAvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG4gICAgaWYgKFNob3dMYWJlbCkge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcclxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXHJcbiAgICBcclxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG4gICAgXHJcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcbiAgICBcclxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxyXG4gICAgbGluay5ocmVmID0gdXJpO1xyXG4gICAgXHJcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG4gICAgbGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG4gICAgXHJcbiAgICAvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgIGxpbmsuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
