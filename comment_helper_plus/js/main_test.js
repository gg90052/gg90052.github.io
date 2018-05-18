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

	// $(".tables > .sharedposts button").click(function(e){
	// 	if (e.ctrlKey || e.altKey){
	// 		fb.extensionAuth('import');
	// 	}else{
	// 		fb.extensionAuth();
	// 	}
	// });

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
		comments: 'v2.12',
		reactions: 'v2.12',
		sharedposts: 'v2.12',
		url_comments: 'v2.12',
		feed: 'v2.12',
		group: 'v2.12',
		newest: 'v2.12'
	},
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	order: '',
	auth: 'user_managed_groups',
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
				if (authStr.indexOf('user_managed_groups') >= 0) {
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
		var options = "<input id=\"pure_fbid\" class=\"hide\"><button id=\"fbid_button\" class=\"btn hide\" onclick=\"fb.hiddenStart()\">\u7531FBID\u64F7\u53D6</button><label><input type=\"checkbox\" onchange=\"fb.optionDisplay(this)\">\u96B1\u85CF\u5217\u8868</label><br>";
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
	optionDisplay: function optionDisplay(checkbox) {
		if ($(checkbox).prop('checked')) {
			$('.page_btn').addClass('hide');
		} else {
			$('.page_btn').removeClass('hide');
		}
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
							var _i3 = _step5.value;

							fid.push(_i3.from.id);
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
							var _i4 = _step6.value;

							var promise = fb.getName(_i4).then(function (res) {
								var _iteratorNormalCompletion10 = true;
								var _didIteratorError10 = false;
								var _iteratorError10 = undefined;

								try {
									for (var _iterator10 = Object.keys(res)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
										var _i5 = _step10.value;

										names[_i5] = res[_i5];
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

					if (command == 'comments') {
						var _iteratorNormalCompletion7 = true;
						var _didIteratorError7 = false;
						var _iteratorError7 = undefined;

						try {
							for (var _iterator7 = extend[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
								var i = _step7.value;

								i.message = i.story;
								delete i.story;
								delete i.postlink;
								i.like_count = 'N/A';
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
					}
					if (command == 'reactions') {
						var _iteratorNormalCompletion8 = true;
						var _didIteratorError8 = false;
						var _iteratorError8 = undefined;

						try {
							for (var _iterator8 = extend[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
								var _i = _step8.value;

								delete _i.story;
								delete _i.created_time;
								delete _i.postlink;
								delete _i.like_count;
								_i.type = 'LIKE';
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
					}

					Promise.all(promise_array).then(function () {
						var _iteratorNormalCompletion9 = true;
						var _didIteratorError9 = false;
						var _iteratorError9 = undefined;

						try {
							for (var _iterator9 = extend[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
								var _i2 = _step9.value;

								_i2.from.name = names[_i2.from.id] ? names[_i2.from.id].name : _i2.from.name;
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

						data.raw.data[command] = extend;
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
		var _iteratorNormalCompletion11 = true;
		var _didIteratorError11 = false;
		var _iteratorError11 = undefined;

		try {
			var _loop = function _loop() {
				var i = _step11.value;

				temp_data.data = {};
				var promise = data.get(temp_data, i).then(function (res) {
					temp_data.data[i] = res;
				});
				data.promise_array.push(promise);
			};

			for (var _iterator11 = commands[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
				_loop();
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
					var _iteratorNormalCompletion12 = true;
					var _didIteratorError12 = false;
					var _iteratorError12 = undefined;

					try {
						for (var _iterator12 = res.data[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
							var d = _step12.value;

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
					var _iteratorNormalCompletion13 = true;
					var _didIteratorError13 = false;
					var _iteratorError13 = undefined;

					try {
						for (var _iterator13 = res.data[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
							var d = _step13.value;

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
							var _iteratorNormalCompletion14 = true;
							var _didIteratorError14 = false;
							var _iteratorError14 = undefined;

							try {
								for (var _iterator14 = res.data[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
									var _i6 = _step14.value;

									var name = '';
									if (_i6.story) {
										name = _i6.story.substring(0, _i6.story.indexOf(' shared'));
									} else {
										name = _i6.id.substring(0, _i6.id.indexOf("_"));
									}
									var id = _i6.id.substring(0, _i6.id.indexOf("_"));
									_i6.from = { id: id, name: name };
									datas.push(_i6);
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
		var _iteratorNormalCompletion15 = true;
		var _didIteratorError15 = false;
		var _iteratorError15 = undefined;

		try {
			for (var _iterator15 = Object.keys(rawData.data)[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
				var key = _step15.value;

				var isTag = $("#tag").prop("checked");
				if (key === 'reactions') isTag = false;
				var newData = _filter.totalFilter.apply(_filter, [rawData.data[key], key, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
				data.filtered[key] = newData;
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
		var _iteratorNormalCompletion16 = true;
		var _didIteratorError16 = false;
		var _iteratorError16 = undefined;

		try {
			for (var _iterator16 = Object.keys(filtered)[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
				var key = _step16.value;

				var thead = '';
				var tbody = '';
				if (key === 'reactions') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td>\u5FC3\u60C5</td>";
				} else if (key === 'sharedposts') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
				} else {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td>\u8B9A</td>\n\t\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
				}
				var _iteratorNormalCompletion18 = true;
				var _didIteratorError18 = false;
				var _iteratorError18 = undefined;

				try {
					for (var _iterator18 = filtered[key].entries()[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
						var _step18$value = _slicedToArray(_step18.value, 2),
						    j = _step18$value[0],
						    val = _step18$value[1];

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

				var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
				$(".tables ." + key + " table").html('').append(insert);
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
			var _iteratorNormalCompletion17 = true;
			var _didIteratorError17 = false;
			var _iteratorError17 = undefined;

			try {
				var _loop2 = function _loop2() {
					var i = _step17.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator17 = arr[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
					_loop2();
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

		var _iteratorNormalCompletion19 = true;
		var _didIteratorError19 = false;
		var _iteratorError19 = undefined;

		try {
			for (var _iterator19 = Object.keys(compare.raw)[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
				var _key = _step19.value;

				if (_key !== ignore) {
					var _iteratorNormalCompletion22 = true;
					var _didIteratorError22 = false;
					var _iteratorError22 = undefined;

					try {
						for (var _iterator22 = compare.raw[_key][Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
							var _i8 = _step22.value;

							base.push(_i8);
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

		var sort = data.raw.extension ? 'name' : 'id';
		base = base.sort(function (a, b) {
			return a.from[sort] > b.from[sort] ? 1 : -1;
		});

		var _iteratorNormalCompletion20 = true;
		var _didIteratorError20 = false;
		var _iteratorError20 = undefined;

		try {
			for (var _iterator20 = base[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
				var _i9 = _step20.value;

				_i9.match = 0;
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

		var temp = '';
		var temp_name = '';
		// console.log(base);
		for (var _i7 in base) {
			var obj = base[_i7];
			if (obj.from.id == temp || data.raw.extension && obj.from.name == temp_name) {
				var tar = final[final.length - 1];
				tar.match++;
				var _iteratorNormalCompletion21 = true;
				var _didIteratorError21 = false;
				var _iteratorError21 = undefined;

				try {
					for (var _iterator21 = Object.keys(obj)[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
						var key = _step21.value;

						if (!tar[key]) tar[key] = obj[key]; //合併資料
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
		var _iteratorNormalCompletion23 = true;
		var _didIteratorError23 = false;
		var _iteratorError23 = undefined;

		try {
			for (var _iterator23 = data_and.entries()[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
				var _step23$value = _slicedToArray(_step23.value, 2),
				    j = _step23$value[0],
				    val = _step23$value[1];

				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '0') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
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

		$(".tables .total .table_compare.and tbody").html('').append(tbody);

		var data_or = compare.or;
		var tbody2 = '';
		var _iteratorNormalCompletion24 = true;
		var _didIteratorError24 = false;
		var _iteratorError24 = undefined;

		try {
			for (var _iterator24 = data_or.entries()[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
				var _step24$value = _slicedToArray(_step24.value, 2),
				    j = _step24$value[0],
				    val = _step24$value[1];

				var _td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var _tr = "<tr>" + _td + "</tr>";
				tbody2 += _tr;
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

		$(".tables .total .table_compare.or tbody").html('').append(tbody2);

		active();

		function active() {
			var table = $(".tables .total table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			var arr = ['and', 'or'];
			var _iteratorNormalCompletion25 = true;
			var _didIteratorError25 = false;
			var _iteratorError25 = undefined;

			try {
				var _loop3 = function _loop3() {
					var i = _step25.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator25 = arr[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
					_loop3();
				}
			} catch (err) {
				_didIteratorError25 = true;
				_iteratorError25 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion25 && _iterator25.return) {
						_iterator25.return();
					}
				} finally {
					if (_didIteratorError25) {
						throw _iteratorError25;
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
		var _iteratorNormalCompletion26 = true;
		var _didIteratorError26 = false;
		var _iteratorError26 = undefined;

		try {
			for (var _iterator26 = choose.award[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
				var _i10 = _step26.value;

				var row = tempArr.length == 0 ? _i10 : tempArr[_i10];
				var _tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
				insert += '<tr>' + _tar + '</tr>';
			}
		} catch (err) {
			_didIteratorError26 = true;
			_iteratorError26 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion26 && _iterator26.return) {
					_iterator26.return();
				}
			} finally {
				if (_didIteratorError26) {
					throw _iteratorError26;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW5fdGVzdC5qcyJdLCJuYW1lcyI6WyJlcnJvck1lc3NhZ2UiLCJ3aW5kb3ciLCJvbmVycm9yIiwiaGFuZGxlRXJyIiwibXNnIiwidXJsIiwibCIsImNvbnNvbGUiLCJsb2ciLCIkIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImhpZGVhcmVhIiwiY2xpY2siLCJvZmYiLCJyZW1vdmVDbGFzcyIsImhhc2giLCJsb2NhdGlvbiIsImluZGV4T2YiLCJsb2NhbFN0b3JhZ2UiLCJyZW1vdmVJdGVtIiwic2Vzc2lvblN0b3JhZ2UiLCJhbGVydCIsImhyZWYiLCJsYXN0RGF0YSIsIkpTT04iLCJwYXJzZSIsImdldEl0ZW0iLCJkYXRhIiwiZmluaXNoIiwibG9naW4iLCJmYiIsImdlbk9wdGlvbiIsImUiLCJnZXRBdXRoIiwiY3RybEtleSIsImFsdEtleSIsImNob29zZSIsImluaXQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwia2V5ZG93biIsInRleHQiLCJrZXl1cCIsIm9uIiwidGFibGUiLCJyZWRvIiwiY2hhbmdlIiwiY29uZmlnIiwiZmlsdGVyIiwicmVhY3QiLCJ2YWwiLCJjb21wYXJlIiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsImVuZFRpbWUiLCJmb3JtYXQiLCJzZXRTdGFydERhdGUiLCJub3dEYXRlIiwiZmlsdGVyRGF0YSIsInJhdyIsImRkIiwidGFiIiwibm93Iiwic3RyaW5naWZ5Iiwib3BlbiIsImZvY3VzIiwibGVuZ3RoIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiZXhjZWwiLCJleGNlbFN0cmluZyIsImNpX2NvdW50ZXIiLCJpbXBvcnQiLCJmaWxlcyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaWtlcyIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwibmV3ZXN0Iiwid29yZCIsIm9yZGVyIiwiYXV0aCIsImV4dGVuc2lvbiIsInBhZ2VUb2tlbiIsIm5leHQiLCJ0eXBlIiwiRkIiLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFN0ciIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJzd2FsIiwiZG9uZSIsImZiaWQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwib3B0aW9ucyIsImkiLCJqIiwiaWQiLCJuYW1lIiwiaHRtbCIsIm9wdGlvbkRpc3BsYXkiLCJjaGVja2JveCIsInByb3AiLCJzZWxlY3RQYWdlIiwidGFyIiwiYXR0ciIsInNldFRva2VuIiwic3RlcCIsInN0ZXAxIiwicGFnZWlkIiwicGFnZXMiLCJhY2Nlc3NfdG9rZW4iLCJoaWRkZW5TdGFydCIsInBhZ2VJRCIsInNwbGl0IiwiYXBpIiwiZXJyb3IiLCJjbGVhciIsImVtcHR5IiwiZmluZCIsImNvbW1hbmQiLCJwYWdpbmciLCJzdHIiLCJnZW5EYXRhIiwibWVzc2FnZSIsInJlY29tbWFuZCIsImdlbkNhcmQiLCJvYmoiLCJpZHMiLCJsaW5rIiwibWVzcyIsInJlcGxhY2UiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwic3JjIiwiZnVsbF9waWN0dXJlIiwicmVzb2x2ZSIsInJlamVjdCIsImFyciIsImV4dGVuc2lvbkF1dGgiLCJleHRlbnNpb25DYWxsYmFjayIsInNldEl0ZW0iLCJleHRlbmQiLCJmaWQiLCJwdXNoIiwiZnJvbSIsInByb21pc2VfYXJyYXkiLCJuYW1lcyIsInByb21pc2UiLCJnZXROYW1lIiwiT2JqZWN0Iiwia2V5cyIsInN0b3J5IiwicG9zdGxpbmsiLCJsaWtlX2NvdW50IiwidGl0bGUiLCJ0b1N0cmluZyIsInNjcm9sbFRvcCIsInN0ZXAyIiwiZmlsdGVyZWQiLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJ0ZXN0IiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJjb21tYW5kcyIsInRlbXBfZGF0YSIsImdldCIsImRhdGFzIiwic2hhcmVFcnJvciIsImdldFNoYXJlIiwiZCIsInVwZGF0ZWRfdGltZSIsImdldE5leHQiLCJnZXRKU09OIiwiZmFpbCIsImFmdGVyIiwic3Vic3RyaW5nIiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJrZXkiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsIm5ld09iaiIsImVhY2giLCJ0bXAiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50IiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJwaWMiLCJ0aGVhZCIsInRib2R5IiwiZW50cmllcyIsInBpY3R1cmUiLCJ0ZCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInNlYXJjaCIsInZhbHVlIiwiZHJhdyIsImFuZCIsIm9yIiwiaWdub3JlIiwiYmFzZSIsImZpbmFsIiwiY29tcGFyZV9udW0iLCJzb3J0IiwiYSIsImIiLCJtYXRjaCIsInRlbXAiLCJ0ZW1wX25hbWUiLCJkYXRhX2FuZCIsImRhdGFfb3IiLCJ0Ym9keTIiLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJjdHJsIiwibiIsInBhcnNlSW50IiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJ0ZW1wQXJyIiwiY29sdW1uIiwiaW5kZXgiLCJyb3ciLCJub2RlIiwiaW5uZXJIVE1MIiwiayIsImVxIiwiaW5zZXJ0QmVmb3JlIiwidW5pcXVlIiwidGFnIiwidGltZSIsIm91dHB1dCIsImZvckVhY2giLCJpdGVtIiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsIm1vbWVudCIsIkRhdGUiLCJfZCIsInVpIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwibWFwIiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBZUMsU0FBZjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNOLFlBQUwsRUFBa0I7QUFDakJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUMsSUFBRSxpQkFBRixFQUFxQkMsTUFBckI7QUFDQVYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRFMsRUFBRUUsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0IsS0FBSUMsV0FBVyxDQUFmO0FBQ0FKLEdBQUUsUUFBRixFQUFZSyxLQUFaLENBQWtCLFlBQVU7QUFDM0JEO0FBQ0EsTUFBSUEsWUFBWSxDQUFoQixFQUFrQjtBQUNqQkosS0FBRSxRQUFGLEVBQVlNLEdBQVosQ0FBZ0IsT0FBaEI7QUFDQU4sS0FBRSwwQkFBRixFQUE4Qk8sV0FBOUIsQ0FBMEMsTUFBMUM7QUFDQTtBQUNELEVBTkQ7O0FBUUEsS0FBSUMsT0FBT0MsU0FBU0QsSUFBcEI7QUFDQSxLQUFJQSxLQUFLRSxPQUFMLENBQWEsT0FBYixLQUF5QixDQUE3QixFQUErQjtBQUM5QkMsZUFBYUMsVUFBYixDQUF3QixL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QUlnRCxLQUFKLENBQVUsQ0FBVixFQUFhaEQsSUFBSWhNLE1BQUosR0FBYSxDQUExQjs7QUFFQTtBQUNBK08sU0FBTy9DLE1BQU0sTUFBYjtBQUNIOztBQUVELEtBQUkrQyxPQUFPLEVBQVgsRUFBZTtBQUNYL1IsUUFBTSxjQUFOO0FBQ0E7QUFDSDs7QUFFRDtBQUNBLEtBQUlpUyxXQUFXLEVBQWY7QUFDQTtBQUNBQSxhQUFZTCxZQUFZM0osT0FBWixDQUFvQixJQUFwQixFQUF5QixHQUF6QixDQUFaOztBQUVBO0FBQ0EsS0FBSWlLLE1BQU0sdUNBQXVDQyxVQUFVSixHQUFWLENBQWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSWhLLE9BQU8zSSxTQUFTZ1QsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0FySyxNQUFLOUgsSUFBTCxHQUFZaVMsR0FBWjs7QUFFQTtBQUNBbkssTUFBS3NLLEtBQUwsR0FBYSxtQkFBYjtBQUNBdEssTUFBS3VLLFFBQUwsR0FBZ0JMLFdBQVcsTUFBM0I7O0FBRUE7QUFDQTdTLFVBQVNtVCxJQUFULENBQWNDLFdBQWQsQ0FBMEJ6SyxJQUExQjtBQUNBQSxNQUFLeEksS0FBTDtBQUNBSCxVQUFTbVQsSUFBVCxDQUFjRSxXQUFkLENBQTBCMUssSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluX3Rlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKXtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIixcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdGxldCBoaWRlYXJlYSA9IDA7XHJcblx0JCgnaGVhZGVyJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGhpZGVhcmVhKys7XHJcblx0XHRpZiAoaGlkZWFyZWEgPj0gNSl7XHJcblx0XHRcdCQoJ2hlYWRlcicpLm9mZignY2xpY2snKTtcclxuXHRcdFx0JCgnI2ZiaWRfYnV0dG9uLCAjcHVyZV9mYmlkJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJjbGVhclwiKSA+PSAwKXtcclxuXHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdyYXcnKTtcclxuXHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2xvZ2luJyk7XHJcblx0XHRhbGVydCgn5bey5riF6Zmk5pqr5a2Y77yM6KuL6YeN5paw6YCy6KGM55m75YWlJyk7XHJcblx0XHRsb2NhdGlvbi5ocmVmID0gJ2h0dHBzOi8vZ2c5MDA1Mi5naXRodWIuaW8vY29tbWVudF9oZWxwZXJfcGx1cyc7XHJcblx0fVxyXG5cdGxldCBsYXN0RGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyYXdcIikpO1xyXG5cclxuXHRpZiAobGFzdERhdGEpe1xyXG5cdFx0ZGF0YS5maW5pc2gobGFzdERhdGEpO1xyXG5cdH1cclxuXHRpZiAoc2Vzc2lvblN0b3JhZ2UubG9naW4pe1xyXG5cdFx0ZmIuZ2VuT3B0aW9uKEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pKTtcclxuXHR9XHJcblxyXG5cdC8vICQoXCIudGFibGVzID4gLnNoYXJlZHBvc3RzIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHQvLyBcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdC8vIFx0XHRmYi5leHRlbnNpb25BdXRoKCdpbXBvcnQnKTtcclxuXHQvLyBcdH1lbHNle1xyXG5cdC8vIFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfSk7XHJcblx0XHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9zdGFydFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0Y2hvb3NlLmluaXQodHJ1ZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLmluaXQoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoIWUuY3RybEtleSB8fCAhZS5hbHRLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6RVhDRUxcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudGFibGVzIC5maWx0ZXJzIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcuY29tcGFyZV9jb25kaXRpb24nKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLicrICQodGhpcykudmFsKCkpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVktTU0tREQgICBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUobm93RGF0ZSgpKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5KXtcclxuXHRcdFx0bGV0IGRkO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhW3RhYi5ub3ddKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgZGQ7XHJcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xyXG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKXtcclxuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhW3RhYi5ub3ddKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRjaV9jb3VudGVyKys7XHJcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KXtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYoZS5jdHJsS2V5KXtcclxuXHRcdFx0ZmIuZ2V0QXV0aCgnc2hhcmVkcG9zdHMnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCdtZXNzYWdlX3RhZ3MnLCdtZXNzYWdlJywnZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbJ2NyZWF0ZWRfdGltZScsJ2Zyb20nLCdtZXNzYWdlJywnc3RvcnknXSxcclxuXHRcdGxpa2VzOiBbJ25hbWUnXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuMTInLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuMTInLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4xMicsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi4xMicsXHJcblx0XHRmZWVkOiAndjIuMTInLFxyXG5cdFx0Z3JvdXA6ICd2Mi4xMicsXHJcblx0XHRuZXdlc3Q6ICd2Mi4xMidcclxuXHR9LFxyXG5cdGZpbHRlcjoge1xyXG5cdFx0d29yZDogJycsXHJcblx0XHRyZWFjdDogJ2FsbCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnJyxcclxuXHRhdXRoOiAndXNlcl9tYW5hZ2VkX2dyb3VwcycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0bmV4dDogJycsXHJcblx0Z2V0QXV0aDogKHR5cGUpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZigndXNlcl9tYW5hZ2VkX2dyb3VwcycpID49IDApe1xyXG5cdFx0XHRcdFx0ZmIuc3RhcnQoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfmjojmrIrlpLHmlZfvvIzoq4vntabkuojmiYDmnInmrIrpmZAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1x0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKT0+e1xyXG5cdFx0UHJvbWlzZS5hbGwoW2ZiLmdldE1lKCksZmIuZ2V0UGFnZSgpLCBmYi5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5sb2dpbiA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcblx0XHRcdGZiLmdlbk9wdGlvbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5PcHRpb246IChyZXMpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgb3B0aW9ucyA9IGA8aW5wdXQgaWQ9XCJwdXJlX2ZiaWRcIiBjbGFzcz1cImhpZGVcIj48YnV0dG9uIGlkPVwiZmJpZF9idXR0b25cIiBjbGFzcz1cImJ0biBoaWRlXCIgb25jbGljaz1cImZiLmhpZGRlblN0YXJ0KClcIj7nlLFGQklE5pO35Y+WPC9idXR0b24+PGxhYmVsPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbmNoYW5nZT1cImZiLm9wdGlvbkRpc3BsYXkodGhpcylcIj7pmrHol4/liJfooag8L2xhYmVsPjxicj5gO1xyXG5cdFx0bGV0IHR5cGUgPSAtMTtcclxuXHRcdCQoJyNidG5fc3RhcnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJlcyl7XHJcblx0XHRcdHR5cGUrKztcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGkpe1xyXG5cdFx0XHRcdG9wdGlvbnMgKz0gYDxkaXYgY2xhc3M9XCJwYWdlX2J0blwiIGF0dHItdHlwZT1cIiR7dHlwZX1cIiBhdHRyLXZhbHVlPVwiJHtqLmlkfVwiIG9uY2xpY2s9XCJmYi5zZWxlY3RQYWdlKHRoaXMpXCI+JHtqLm5hbWV9PC9kaXY+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnI2VudGVyVVJMJykuaHRtbChvcHRpb25zKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdH0sXHJcblx0b3B0aW9uRGlzcGxheTogKGNoZWNrYm94KT0+e1xyXG5cdFx0aWYgKCQoY2hlY2tib3gpLnByb3AoJ2NoZWNrZWQnKSl7XHJcblx0XHRcdCQoJy5wYWdlX2J0bicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCgnLnBhZ2VfYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6IChlKT0+e1xyXG5cdFx0JCgnI2VudGVyVVJMIC5wYWdlX2J0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCB0YXIgPSAkKGUpO1xyXG5cdFx0dGFyLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGlmICh0YXIuYXR0cignYXR0ci10eXBlJykgPT0gMSl7XHJcblx0XHRcdGZiLnNldFRva2VuKHRhci5hdHRyKCdhdHRyLXZhbHVlJykpO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZmVlZCh0YXIuYXR0cignYXR0ci12YWx1ZScpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQpO1xyXG5cdFx0c3RlcC5zdGVwMSgpO1xyXG5cdH0sXHJcblx0c2V0VG9rZW46IChwYWdlaWQpPT57XHJcblx0XHRsZXQgcGFnZXMgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKVsxXTtcclxuXHRcdGZvcihsZXQgaSBvZiBwYWdlcyl7XHJcblx0XHRcdGlmIChpLmlkID09IHBhZ2VpZCl7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IGkuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRoaWRkZW5TdGFydDogKCk9PntcclxuXHRcdGxldCBmYmlkID0gJCgnI3B1cmVfZmJpZCcpLnZhbCgpO1xyXG5cdFx0bGV0IHBhZ2VJRCA9IGZiaWQuc3BsaXQoJ18nKVswXTtcclxuXHRcdEZCLmFwaShgLyR7cGFnZUlEfT9maWVsZHM9YWNjZXNzX3Rva2VuYCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRpZiAocmVzLmVycm9yKXtcclxuXHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbil7XHJcblx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmZWVkOiAocGFnZUlELCB0eXBlLCB1cmwgPSAnJywgY2xlYXIgPSB0cnVlKT0+e1xyXG5cdFx0aWYgKGNsZWFyKXtcclxuXHRcdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHRcdCQoJy5mZWVkcyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5vZmYoJ2NsaWNrJykuY2xpY2soKCk9PntcclxuXHRcdFx0XHRsZXQgdGFyID0gJCgnI2VudGVyVVJMIHNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xyXG5cdFx0XHRcdGZiLmZlZWQodGFyLnZhbCgpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQsIGZhbHNlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRsZXQgY29tbWFuZCA9ICh0eXBlID09ICcyJykgPyAnZmVlZCc6J3Bvc3RzJztcclxuXHRcdGxldCBhcGk7XHJcblx0XHRpZiAodXJsID09ICcnKXtcclxuXHRcdFx0YXBpID0gYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VJRH0vJHtjb21tYW5kfT9maWVsZHM9bGluayxmdWxsX3BpY3R1cmUsY3JlYXRlZF90aW1lLG1lc3NhZ2UmbGltaXQ9MjVgO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFwaSA9IHVybDtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShhcGksIChyZXMpPT57XHJcblx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPT0gMCl7XHJcblx0XHRcdFx0JCgnLmZlZWRzIC5idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZiLm5leHQgPSByZXMucGFnaW5nLm5leHQ7XHJcblx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0bGV0IHN0ciA9IGdlbkRhdGEoaSk7XHJcblx0XHRcdFx0JCgnLnNlY3Rpb24gLmZlZWRzIHRib2R5JykuYXBwZW5kKHN0cik7XHJcblx0XHRcdFx0aWYgKGkubWVzc2FnZSAmJiBpLm1lc3NhZ2UuaW5kZXhPZign5oq9JykgPj0gMCl7XHJcblx0XHRcdFx0XHRsZXQgcmVjb21tYW5kID0gZ2VuQ2FyZChpKTtcclxuXHRcdFx0XHRcdCQoJy5kb25hdGVfYXJlYSAucmVjb21tYW5kcycpLmFwcGVuZChyZWNvbW1hbmQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2VuRGF0YShvYmope1xyXG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcclxuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XHJcblxyXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRsZXQgc3RyID0gYDx0cj5cclxuXHRcdFx0XHRcdFx0PHRkPjxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiAgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIob2JqLmNyZWF0ZWRfdGltZSl9PC90ZD5cclxuXHRcdFx0XHRcdFx0PC90cj5gO1xyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZ2VuQ2FyZChvYmope1xyXG5cdFx0XHRsZXQgc3JjID0gb2JqLmZ1bGxfcGljdHVyZSB8fCAnaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4MjI1JztcclxuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XHJcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0bGV0XHRzdHIgPSBgPGRpdiBjbGFzcz1cImNhcmRcIj5cclxuXHRcdFx0PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtaW1hZ2VcIj5cclxuXHRcdFx0PGZpZ3VyZSBjbGFzcz1cImltYWdlIGlzLTRieTNcIj5cclxuXHRcdFx0PGltZyBzcmM9XCIke3NyY31cIiBhbHQ9XCJcIj5cclxuXHRcdFx0PC9maWd1cmU+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2E+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWNvbnRlbnRcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuXHRcdFx0JHttZXNzfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj5cclxuXHRcdFx0PC9kaXY+YDtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldE1lOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lYCwgKHJlcyk9PntcclxuXHRcdFx0XHRsZXQgYXJyID0gW3Jlc107XHJcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoY29tbWFuZCA9ICcnKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UsIGNvbW1hbmQpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSwgY29tbWFuZCA9ICcnKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xyXG5cdFx0XHRcdGRhdGEucmF3LmV4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ2ltcG9ydCcpe1xyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaGFyZWRwb3N0c1wiLCAkKCcjaW1wb3J0JykudmFsKCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgZXh0ZW5kID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNoYXJlZHBvc3RzXCIpKTtcclxuXHRcdFx0XHRsZXQgZmlkID0gW107XHJcblx0XHRcdFx0bGV0IGlkcyA9IFtdO1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0ZmlkLnB1c2goaS5mcm9tLmlkKTtcclxuXHRcdFx0XHRcdGlmIChmaWQubGVuZ3RoID49NDUpe1xyXG5cdFx0XHRcdFx0XHRpZHMucHVzaChmaWQpO1xyXG5cdFx0XHRcdFx0XHRmaWQgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWRzLnB1c2goZmlkKTtcclxuXHRcdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdLCBuYW1lcyA9IHt9O1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBpZHMpe1xyXG5cdFx0XHRcdFx0bGV0IHByb21pc2UgPSBmYi5nZXROYW1lKGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIE9iamVjdC5rZXlzKHJlcykpe1xyXG5cdFx0XHRcdFx0XHRcdG5hbWVzW2ldID0gcmVzW2ldO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0aS5tZXNzYWdlID0gaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRpLmxpa2VfY291bnQgPSAnTi9BJztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgaS5jcmVhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgaS5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHRpLnR5cGUgPSAnTElLRSc7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRQcm9taXNlLmFsbChwcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0aS5mcm9tLm5hbWUgPSBuYW1lc1tpLmZyb20uaWRdID8gbmFtZXNbaS5mcm9tLmlkXS5uYW1lIDogaS5mcm9tLm5hbWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkYXRhLnJhdy5kYXRhW2NvbW1hbmRdID0gZXh0ZW5kO1xyXG5cdFx0XHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXROYW1lOiAoaWRzKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9Lz9pZHM9JHtpZHMudG9TdHJpbmcoKX1gLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxubGV0IHN0ZXAgPSB7XHJcblx0c3RlcDE6ICgpPT57XHJcblx0XHQkKCcuc2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH0sXHJcblx0c3RlcDI6ICgpPT57XHJcblx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcclxuXHRcdCQoJy5zZWN0aW9uJykuYWRkQ2xhc3MoJ3N0ZXAyJyk7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IHt9LFxyXG5cdGZpbHRlcmVkOiB7fSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdHRlc3Q6IChpZCk9PntcclxuXHRcdGNvbnNvbGUubG9nKGlkKTtcclxuXHR9LFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKT0+e1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRmdWxsSUQ6IGZiaWRcclxuXHRcdH1cclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgY29tbWFuZHMgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcclxuXHRcdGxldCB0ZW1wX2RhdGEgPSBvYmo7XHJcblx0XHRmb3IobGV0IGkgb2YgY29tbWFuZHMpe1xyXG5cdFx0XHR0ZW1wX2RhdGEuZGF0YSA9IHt9O1xyXG5cdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KHRlbXBfZGF0YSwgaSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdHRlbXBfZGF0YS5kYXRhW2ldID0gcmVzO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdGRhdGEuZmluaXNoKHRlbXBfZGF0YSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQsIGNvbW1hbmQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBzaGFyZUVycm9yID0gMDtcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJykgY29tbWFuZCA9ICdncm91cCc7XHJcblx0XHRcdGlmIChjb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0XHRnZXRTaGFyZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7Y29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbY29tbWFuZF19Jm9yZGVyPWNocm9ub2xvZ2ljYWwmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9YCwocmVzKT0+e1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldFNoYXJlKGFmdGVyPScnKXtcclxuXHRcdFx0XHRsZXQgdXJsID0gYGh0dHBzOi8vYW02NmFoZ3RwOC5leGVjdXRlLWFwaS5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tL3NoYXJlP2ZiaWQ9JHtmYmlkLmZ1bGxJRH0mYWZ0ZXI9JHthZnRlcn1gO1xyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRpZiAocmVzID09PSAnZW5kJyl7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3JNZXNzYWdlKXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYocmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRcdC8vIHNoYXJlRXJyb3IgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgbmFtZSA9ICcnO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoaS5zdG9yeSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBpLnN0b3J5LnN1YnN0cmluZygwLCBpLnN0b3J5LmluZGV4T2YoJyBzaGFyZWQnKSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZSA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGlkID0gaS5pZC5zdWJzdHJpbmcoMCwgaS5pZC5pbmRleE9mKFwiX1wiKSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpLmZyb20gPSB7aWQsIG5hbWV9O1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChpKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0Z2V0U2hhcmUocmVzLmFmdGVyKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdHN0ZXAuc3RlcDIoKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0JCgnLnJlc3VsdF9hcmVhID4gLnRpdGxlIHNwYW4nKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmF3XCIsIEpTT04uc3RyaW5naWZ5KGZiaWQpKTtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XHJcblx0XHRkYXRhLmZpbHRlcmVkID0ge307XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHJhd0RhdGEuZGF0YSkpe1xyXG5cdFx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdFx0aWYgKGtleSA9PT0gJ3JlYWN0aW9ucycpIGlzVGFnID0gZmFsc2U7XHJcblx0XHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEuZGF0YVtrZXldLCBrZXksIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcdFxyXG5cdFx0XHRkYXRhLmZpbHRlcmVkW2tleV0gPSBuZXdEYXRhO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKXtcclxuXHRcdFx0dGFibGUuZ2VuZXJhdGUoZGF0YS5maWx0ZXJlZCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIGRhdGEuZmlsdGVyZWQ7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdyk9PntcclxuXHRcdHZhciBuZXdPYmogPSBbXTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbil7XHJcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCIgOiB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIuipsuWIhuS6q+iumuaVuFwiIDogdGhpcy5saWtlX2NvdW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi5b+D5oOFXCIgOiB0aGlzLnR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiIDogdGltZUNvbnZlcnRlcih0aGlzLmNyZWF0ZWRfdGltZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3T2JqO1xyXG5cdH0sXHJcblx0aW1wb3J0OiAoZmlsZSk9PntcclxuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHRcdFx0ZGF0YS5yYXcgPSBKU09OLnBhcnNlKHN0cik7XHJcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpPT57XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZmlsdGVyZWQgPSByYXdkYXRhO1xyXG5cdFx0bGV0IHBpYyA9ICQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGZpbHRlcmVkKSl7XHJcblx0XHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkPuW/g+aDhTwvdGQ+YDtcclxuXHRcdFx0fWVsc2UgaWYoa2V5ID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdFx0PHRkIHdpZHRoPVwiMTEwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0XHQ8dGQ+6K6aPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJlZFtrZXldLmVudHJpZXMoKSl7XHJcblx0XHRcdFx0bGV0IHBpY3R1cmUgPSAnJztcclxuXHRcdFx0XHRpZiAocGljKXtcclxuXHRcdFx0XHRcdC8vIHBpY3R1cmUgPSBgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0XHRpZihrZXkgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCB2YWwuc3Rvcnl9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2V9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHRcdCQoXCIudGFibGVzIC5cIitrZXkrXCIgdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGFjdGl2ZSgpO1xyXG5cdFx0dGFiLmluaXQoKTtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBhcnIgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNvbXBhcmUgPSB7XHJcblx0YW5kOiBbXSxcclxuXHRvcjogW10sXHJcblx0cmF3OiBbXSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0Y29tcGFyZS5hbmQgPSBbXTtcclxuXHRcdGNvbXBhcmUub3IgPSBbXTtcclxuXHRcdGNvbXBhcmUucmF3ID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0bGV0IGlnbm9yZSA9ICQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLnZhbCgpO1xyXG5cdFx0bGV0IGJhc2UgPSBbXTtcclxuXHRcdGxldCBmaW5hbCA9IFtdO1xyXG5cdFx0bGV0IGNvbXBhcmVfbnVtID0gMTtcclxuXHRcdGlmIChpZ25vcmUgPT09ICdpZ25vcmUnKSBjb21wYXJlX251bSA9IDI7XHJcblxyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoY29tcGFyZS5yYXcpKXtcclxuXHRcdFx0aWYgKGtleSAhPT0gaWdub3JlKXtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgY29tcGFyZS5yYXdba2V5XSl7XHJcblx0XHRcdFx0XHRiYXNlLnB1c2goaSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRsZXQgc29ydCA9IChkYXRhLnJhdy5leHRlbnNpb24pID8gJ25hbWUnOidpZCc7XHJcblx0XHRiYXNlID0gYmFzZS5zb3J0KChhLGIpPT57XHJcblx0XHRcdHJldHVybiBhLmZyb21bc29ydF0gPiBiLmZyb21bc29ydF0gPyAxOi0xO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Zm9yKGxldCBpIG9mIGJhc2Upe1xyXG5cdFx0XHRpLm1hdGNoID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0bGV0IHRlbXBfbmFtZSA9ICcnO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coYmFzZSk7XHJcblx0XHRmb3IobGV0IGkgaW4gYmFzZSl7XHJcblx0XHRcdGxldCBvYmogPSBiYXNlW2ldO1xyXG5cdFx0XHRpZiAob2JqLmZyb20uaWQgPT0gdGVtcCB8fCAoZGF0YS5yYXcuZXh0ZW5zaW9uICYmIChvYmouZnJvbS5uYW1lID09IHRlbXBfbmFtZSkpKXtcclxuXHRcdFx0XHRsZXQgdGFyID0gZmluYWxbZmluYWwubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdHRhci5tYXRjaCsrO1xyXG5cdFx0XHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKG9iaikpe1xyXG5cdFx0XHRcdFx0aWYgKCF0YXJba2V5XSkgdGFyW2tleV0gPSBvYmpba2V5XTsgLy/lkIjkvbXos4fmlplcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRhci5tYXRjaCA9PSBjb21wYXJlX251bSl7XHJcblx0XHRcdFx0XHR0ZW1wX25hbWUgPSAnJztcclxuXHRcdFx0XHRcdHRlbXAgPSAnJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZpbmFsLnB1c2gob2JqKTtcclxuXHRcdFx0XHR0ZW1wID0gb2JqLmZyb20uaWQ7XHJcblx0XHRcdFx0dGVtcF9uYW1lID0gb2JqLmZyb20ubmFtZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdFxyXG5cdFx0Y29tcGFyZS5vciA9IGZpbmFsO1xyXG5cdFx0Y29tcGFyZS5hbmQgPSBjb21wYXJlLm9yLmZpbHRlcigodmFsKT0+e1xyXG5cdFx0XHRyZXR1cm4gdmFsLm1hdGNoID09IGNvbXBhcmVfbnVtO1xyXG5cdFx0fSk7XHJcblx0XHRjb21wYXJlLmdlbmVyYXRlKCk7XHJcblx0fSxcclxuXHRnZW5lcmF0ZTogKCk9PntcclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZGF0YV9hbmQgPSBjb21wYXJlLmFuZDtcclxuXHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9hbmQuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnQgfHwgJzAnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS5hbmQgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHJcblx0XHRsZXQgZGF0YV9vciA9IGNvbXBhcmUub3I7XHJcblx0XHRsZXQgdGJvZHkyID0gJyc7XHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfb3IuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnQgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5MiArPSB0cjtcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS5vciB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkyKTtcclxuXHRcdFxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBhcnIgPSBbJ2FuZCcsJ29yJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKGN0cmwgPSBmYWxzZSk9PntcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcclxuXHRcdGNob29zZS5saXN0ID0gW107XHJcblx0XHRjaG9vc2UubnVtID0gMDtcclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKXtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKGN0cmwpO1xyXG5cdH0sXHJcblx0Z286IChjdHJsKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSB0YWIubm93O1xyXG5cdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGFbY29tbWFuZF0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcdFxyXG5cdFx0fVxyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0bGV0IHRlbXBBcnIgPSBbXTtcclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKXtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5jb2x1bW4oMikuZGF0YSgpLmVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KXtcclxuXHRcdFx0XHRsZXQgd29yZCA9ICQoJy5zZWFyY2hDb21tZW50JykudmFsKCk7XHJcblx0XHRcdFx0aWYgKHZhbHVlLmluZGV4T2Yod29yZCkgPj0gMCkgdGVtcEFyci5wdXNoKGluZGV4KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcclxuXHRcdFx0bGV0IHJvdyA9ICh0ZW1wQXJyLmxlbmd0aCA9PSAwKSA/IGk6dGVtcEFycltpXTtcclxuXHRcdFx0bGV0IHRhciA9ICQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkucm93KHJvdykubm9kZSgpLmlubmVySFRNTDtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHI+JyArIHRhciArICc8L3RyPic7XHJcblx0XHR9XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0aWYgKCFjdHJsKXtcclxuXHRcdFx0JChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdC8vIGxldCB0YXIgPSAkKHRoaXMpLmZpbmQoJ3RkJykuZXEoMSk7XHJcblx0XHRcdFx0Ly8gbGV0IGlkID0gdGFyLmZpbmQoJ2EnKS5hdHRyKCdhdHRyLWZiaWQnKTtcclxuXHRcdFx0XHQvLyB0YXIucHJlcGVuZChgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xyXG5cdFx0XHRsZXQgbm93ID0gMDtcclxuXHRcdFx0Zm9yKGxldCBrIGluIGNob29zZS5saXN0KXtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjdcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhdywgY29tbWFuZCwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9PntcclxuXHRcdGxldCBkYXRhID0gcmF3O1xyXG5cdFx0aWYgKGlzRHVwbGljYXRlKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAod29yZCAhPT0gJycgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIGVuZFRpbWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSk9PntcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHQpPT57XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLChwYXJzZUludCh0aW1lX2FyeVsxXSktMSksdGltZV9hcnlbMl0sdGltZV9hcnlbM10sdGltZV9hcnlbNF0sdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmIChjcmVhdGVkX3RpbWUgPCB0aW1lIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcik9PntcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKT0+e1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWIgPSB7XHJcblx0bm93OiBcImNvbW1lbnRzXCIsXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0dGFiLm5vdyA9ICQodGhpcykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHRcdGxldCB0YXIgPSAkKHRoaXMpLmluZGV4KCk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5lcSh0YXIpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCl7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSsxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XHJcblx0IHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xyXG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG4gICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICAgaWYgKGRhdGUgPCAxMCl7XHJcbiAgICAgXHRkYXRlID0gXCIwXCIrZGF0ZTtcclxuICAgICB9XHJcbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcbiAgICAgaWYgKGhvdXIgPCAxMCl7XHJcbiAgICAgXHRob3VyID0gXCIwXCIraG91cjtcclxuICAgICB9XHJcbiAgICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG4gICAgIGlmIChtaW4gPCAxMCl7XHJcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XHJcbiAgICAgfVxyXG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuICAgICBpZiAoc2VjIDwgMTApe1xyXG4gICAgIFx0c2VjID0gXCIwXCIrc2VjO1xyXG4gICAgIH1cclxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcclxuICAgICByZXR1cm4gdGltZTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcbiAgICBcclxuICAgIHZhciBDU1YgPSAnJzsgICAgXHJcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuICAgIFxyXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuICAgIGlmIChTaG93TGFiZWwpIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXHJcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSAgIFxyXG4gICAgXHJcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcbiAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxyXG4gICAgXHJcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuICAgIFxyXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG4gICAgXHJcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcclxuICAgIGxpbmsuaHJlZiA9IHVyaTtcclxuICAgIFxyXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuICAgIFxyXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
