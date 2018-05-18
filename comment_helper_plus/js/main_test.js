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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW5fdGVzdC5qcyJdLCJuYW1lcyI6WyJlcnJvck1lc3NhZ2UiLCJ3aW5kb3ciLCJvbmVycm9yIiwiaGFuZGxlRXJyIiwibXNnIiwidXJsIiwibCIsImNvbnNvbGUiLCJsb2ciLCIkIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImhpZGVhcmVhIiwiY2xpY2siLCJvZmYiLCJyZW1vdmVDbGFzcyIsImhhc2giLCJsb2NhdGlvbiIsImluZGV4T2YiLCJsb2NhbFN0b3JhZ2UiLCJyZW1vdmVJdGVtIiwic2Vzc2lvblN0b3JhZ2UiLCJhbGVydCIsImhyZWYiLCJsYXN0RGF0YSIsIkpTT04iLCJwYXJzZSIsImdldEl0ZW0iLCJkYXRhIiwiZmluaXNoIiwibG9naW4iLCJmYiIsImdlbk9wdGlvbiIsImUiLCJnZXRBdXRoIiwiY3RybEtleSIsImFsdEtleSIsImNob29zZSIsImluaXQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwia2V5ZG93biIsInRleHQiLCJrZXl1cCIsIm9uIiwidGFibGUiLCJyZWRvIiwiY2hhbmdlIiwiY29uZmlnIiwiZmlsdGVyIiwicmVhY3QiLCJ2YWwiLCJjb21wYXJlIiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsImVuZFRpbWUiLCJmb3JtYXQiLCJzZXRTdGFydERhdGUiLCJub3dEYXRlIiwiZmlsdGVyRGF0YSIsInJhdyIsImRkIiwidGFiIiwibm93Iiwic3RyaW5naWZ5Iiwib3BlbiIsImZvY3VzIiwibGVuZ3RoIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiZXhjZWwiLCJleGNlbFN0cmluZyIsImNpX2NvdW50ZXIiLCJpbXBvcnQiLCJmaWxlcyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaWtlcyIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwibmV3ZXN0Iiwid29yZCIsIm9yZGVyIiwiYXV0aCIsImV4dGVuc2lvbiIsInBhZ2VUb2tlbiIsIm5leHQiLCJ0eXBlIiwiRkIiLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFN0ciIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJzd2FsIiwiZG9uZSIsImZiaWQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwib3B0aW9ucyIsImkiLCJqIiwiaWQiLCJuYW1lIiwiaHRtbCIsIm9wdGlvbkRpc3BsYXkiLCJjaGVja2JveCIsInByb3AiLCJzZWxlY3RQYWdlIiwidGFyIiwiYXR0ciIsInNldFRva2VuIiwic3RlcCIsInN0ZXAxIiwicGFnZWlkIiwicGFnZXMiLCJhY2Nlc3NfdG9rZW4iLCJoaWRkZW5TdGFydCIsInBhZ2VJRCIsInNwbGl0IiwiYXBpIiwiZXJyb3IiLCJjbGVhciIsImVtcHR5IiwiZmluZCIsImNvbW1hbmQiLCJwYWdpbmciLCJzdHIiLCJnZW5EYXRhIiwibWVzc2FnZSIsInJlY29tbWFuZCIsImdlbkNhcmQiLCJvYmoiLCJpZHMiLCJsaW5rIiwibWVzcyIsInJlcGxhY2UiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwic3JjIiwiZnVsbF9waWN0dXJlIiwicmVzb2x2ZSIsInJlamVjdCIsImFyciIsImV4dGVuc2lvbkF1dGgiLCJleHRlbnNpb25DYWxsYmFjayIsInNldEl0ZW0iLCJleHRlbmQiLCJmaWQiLCJwdXNoIiwiZnJvbSIsInByb21pc2VfYXJyYXkiLCJuYW1lcyIsInByb21pc2UiLCJnZXROYW1lIiwiT2JqZWN0Iiwia2V5cyIsInN0b3J5IiwicG9zdGxpbmsiLCJsaWtlX2NvdW50IiwidGl0bGUiLCJ0b1N0cmluZyIsInNjcm9sbFRvcCIsInN0ZXAyIiwiZmlsdGVyZWQiLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJ0ZXN0IiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJjb21tYW5kcyIsInRlbXBfZGF0YSIsImdldCIsImRhdGFzIiwic2hhcmVFcnJvciIsImdldFNoYXJlIiwiZCIsInVwZGF0ZWRfdGltZSIsImdldE5leHQiLCJnZXRKU09OIiwiZmFpbCIsImFmdGVyIiwic3Vic3RyaW5nIiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJrZXkiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsIm5ld09iaiIsImVhY2giLCJ0bXAiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50IiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJwaWMiLCJ0aGVhZCIsInRib2R5IiwiZW50cmllcyIsInBpY3R1cmUiLCJ0ZCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInNlYXJjaCIsInZhbHVlIiwiZHJhdyIsImFuZCIsIm9yIiwiaWdub3JlIiwiYmFzZSIsImZpbmFsIiwiY29tcGFyZV9udW0iLCJzb3J0IiwiYSIsImIiLCJtYXRjaCIsInRlbXAiLCJ0ZW1wX25hbWUiLCJkYXRhX2FuZCIsImRhdGFfb3IiLCJ0Ym9keTIiLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJjdHJsIiwibiIsInBhcnNlSW50IiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJ0ZW1wQXJyIiwiY29sdW1uIiwiaW5kZXgiLCJyb3ciLCJub2RlIiwiaW5uZXJIVE1MIiwiayIsImVxIiwiaW5zZXJ0QmVmb3JlIiwidW5pcXVlIiwidGFnIiwidGltZSIsIm91dHB1dCIsImZvckVhY2giLCJpdGVtIiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsIm1vbWVudCIsIkRhdGUiLCJfZCIsInVpIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwibWFwIiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBZUMsU0FBZjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNOLFlBQUwsRUFBa0I7QUFDakJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUMsSUFBRSxpQkFBRixFQUFxQkMsTUFBckI7QUFDQVYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRFMsRUFBRUUsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0IsS0FBSUMsV0FBVyxDQUFmO0FBQ0FKLEdBQUUsUUFBRixFQUFZSyxLQUFaLENBQWtCLFlBQVU7QUFDM0JEO0FBQ0EsTUFBSUEsWUFBWSxDQUFoQixFQUFrQjtBQUNqQkosS0FBRSxRQUFGLEVBQVlNLEdBQVosQ0FBZ0IsT0FBaEI7QUFDQU4sS0FBRSwwQkFBRixFQUE4Qk8sV0FBOUIsQ0FBMEMsTUFBMUM7QUFDQTtBQUNELEVBTkQ7O0FBUUEsS0FBSUMsT0FBT0MsU0FBU0QsSUFBcEI7QUFDQSxLQUFJQSxLQUFLRSxPQUFMLENBQWEsT0FBYixLQUF5QixDQUE3QixFQUErQjtBQUM5QkMsZUFBYUMsVUFBYixDQUF3QixL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LENBQWxCLEVBQThCO0FBQzFCbUosVUFBTyxNQUFNOEMsUUFBUWpNLENBQVIsRUFBV2tKLEtBQVgsQ0FBTixHQUEwQixJQUFqQztBQUNIOztBQUVEQyxNQUFJZ0QsS0FBSixDQUFVLENBQVYsRUFBYWhELElBQUloTSxNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQStPLFNBQU8vQyxNQUFNLE1BQWI7QUFDSDs7QUFFRCxLQUFJK0MsT0FBTyxFQUFYLEVBQWU7QUFDWC9SLFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJaVMsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWUwsWUFBWTNKLE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUlpSyxNQUFNLHVDQUF1Q0MsVUFBVUosR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUloSyxPQUFPM0ksU0FBU2dULGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBckssTUFBSzlILElBQUwsR0FBWWlTLEdBQVo7O0FBRUE7QUFDQW5LLE1BQUtzSyxLQUFMLEdBQWEsbUJBQWI7QUFDQXRLLE1BQUt1SyxRQUFMLEdBQWdCTCxXQUFXLE1BQTNCOztBQUVBO0FBQ0E3UyxVQUFTbVQsSUFBVCxDQUFjQyxXQUFkLENBQTBCekssSUFBMUI7QUFDQUEsTUFBS3hJLEtBQUw7QUFDQUgsVUFBU21ULElBQVQsQ0FBY0UsV0FBZCxDQUEwQjFLLElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbl90ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHRsZXQgaGlkZWFyZWEgPSAwO1xyXG5cdCQoJ2hlYWRlcicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRoaWRlYXJlYSsrO1xyXG5cdFx0aWYgKGhpZGVhcmVhID49IDUpe1xyXG5cdFx0XHQkKCdoZWFkZXInKS5vZmYoJ2NsaWNrJyk7XHJcblx0XHRcdCQoJyNmYmlkX2J1dHRvbiwgI3B1cmVfZmJpZCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uaGFzaDtcclxuXHRpZiAoaGFzaC5pbmRleE9mKFwiY2xlYXJcIikgPj0gMCl7XHJcblx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncmF3Jyk7XHJcblx0XHRzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdsb2dpbicpO1xyXG5cdFx0YWxlcnQoJ+W3sua4hemZpOaaq+WtmO+8jOiri+mHjeaWsOmAsuihjOeZu+WFpScpO1xyXG5cdFx0bG9jYXRpb24uaHJlZiA9ICdodHRwczovL2dnOTAwNTIuZ2l0aHViLmlvL2NvbW1lbnRfaGVscGVyX3BsdXMnO1xyXG5cdH1cclxuXHRsZXQgbGFzdERhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmF3XCIpKTtcclxuXHJcblx0aWYgKGxhc3REYXRhKXtcclxuXHRcdGRhdGEuZmluaXNoKGxhc3REYXRhKTtcclxuXHR9XHJcblx0aWYgKHNlc3Npb25TdG9yYWdlLmxvZ2luKXtcclxuXHRcdGZiLmdlbk9wdGlvbihKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKSk7XHJcblx0fVxyXG5cclxuXHQvLyAkKFwiLnRhYmxlcyA+IC5zaGFyZWRwb3N0cyBidXR0b25cIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0Ly8gXHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHQvLyBcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgnaW1wb3J0Jyk7XHJcblx0Ly8gXHR9ZWxzZXtcclxuXHQvLyBcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH0pO1xyXG5cdFxyXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fc3RhcnRcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdGNob29zZS5pbml0KHRydWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5pbml0KCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0XHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgIWUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLnRhYmxlcyAuZmlsdGVycyAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnRhYmxlcyAudG90YWwgLmZpbHRlcnMgc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb21wYXJlLmluaXQoKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLmNvbXBhcmVfY29uZGl0aW9uJykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZScpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS4nKyAkKHRoaXMpLnZhbCgpKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwic2luZ2xlRGF0ZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZLU1NLUREICAgSEg6bW1cIixcclxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXHJcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxyXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXHJcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxyXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxyXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcclxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcclxuXHRcdFx0XCLml6VcIixcclxuXHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XCLkuoxcIixcclxuXHRcdFx0XCLkuIlcIixcclxuXHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XCLkupRcIixcclxuXHRcdFx0XCLlha1cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xyXG5cdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcIuS6jOaciFwiLFxyXG5cdFx0XHRcIuS4ieaciFwiLFxyXG5cdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcIuS6lOaciFwiLFxyXG5cdFx0XHRcIuWFreaciFwiLFxyXG5cdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcIuWFq+aciFwiLFxyXG5cdFx0XHRcIuS5neaciFwiLFxyXG5cdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcIuWNgeS4gOaciFwiLFxyXG5cdFx0XHRcIuWNgeS6jOaciFwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwiZmlyc3REYXlcIjogMVxyXG5cdFx0fSxcclxuXHR9LGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSl7XHJcblx0XHRcdGxldCBkZDtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YVt0YWIubm93XSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIGRkO1xyXG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHRcdFx0d2luZG93LmZvY3VzKCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCl7XHJcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YVt0YWIubm93XSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcblxyXG5cdGxldCBjaV9jb3VudGVyID0gMDtcclxuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSl7XHJcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdH1cclxuXHRcdGlmKGUuY3RybEtleSl7XHJcblx0XHRcdGZiLmdldEF1dGgoJ3NoYXJlZHBvc3RzJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZScsJ2Zyb20nLCdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCdmcm9tJywnbWVzc2FnZScsJ3N0b3J5J10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnLFxyXG5cdFx0bGlrZXM6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YyLjEyJyxcclxuXHRcdHJlYWN0aW9uczogJ3YyLjEyJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjIuMTInLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuMTInLFxyXG5cdFx0ZmVlZDogJ3YyLjEyJyxcclxuXHRcdGdyb3VwOiAndjIuMTInLFxyXG5cdFx0bmV3ZXN0OiAndjIuMTInXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRvcmRlcjogJycsXHJcblx0YXV0aDogJ3VzZXJfbWFuYWdlZF9ncm91cHMnLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cGFnZVRva2VuOiAnJyxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdG5leHQ6ICcnLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRcdGZiLnN0YXJ0KCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5o6I5qyK5aSx5pWX77yM6KuL57Wm5LqI5omA5pyJ5qyK6ZmQJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKCk9PntcclxuXHRcdFByb21pc2UuYWxsKFtmYi5nZXRNZSgpLGZiLmdldFBhZ2UoKSwgZmIuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0c2Vzc2lvblN0b3JhZ2UubG9naW4gPSBKU09OLnN0cmluZ2lmeShyZXMpO1xyXG5cdFx0XHRmYi5nZW5PcHRpb24ocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2VuT3B0aW9uOiAocmVzKT0+e1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IG9wdGlvbnMgPSBgPGlucHV0IGlkPVwicHVyZV9mYmlkXCIgY2xhc3M9XCJoaWRlXCI+PGJ1dHRvbiBpZD1cImZiaWRfYnV0dG9uXCIgY2xhc3M9XCJidG4gaGlkZVwiIG9uY2xpY2s9XCJmYi5oaWRkZW5TdGFydCgpXCI+55SxRkJJROaTt+WPljwvYnV0dG9uPjxsYWJlbD48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25jaGFuZ2U9XCJmYi5vcHRpb25EaXNwbGF5KHRoaXMpXCI+6Zqx6JeP5YiX6KGoPC9sYWJlbD48YnI+YDtcclxuXHRcdGxldCB0eXBlID0gLTE7XHJcblx0XHQkKCcjYnRuX3N0YXJ0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdGZvcihsZXQgaSBvZiByZXMpe1xyXG5cdFx0XHR0eXBlKys7XHJcblx0XHRcdGZvcihsZXQgaiBvZiBpKXtcclxuXHRcdFx0XHRvcHRpb25zICs9IGA8ZGl2IGNsYXNzPVwicGFnZV9idG5cIiBhdHRyLXR5cGU9XCIke3R5cGV9XCIgYXR0ci12YWx1ZT1cIiR7ai5pZH1cIiBvbmNsaWNrPVwiZmIuc2VsZWN0UGFnZSh0aGlzKVwiPiR7ai5uYW1lfTwvZGl2PmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJyNlbnRlclVSTCcpLmh0bWwob3B0aW9ucykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9LFxyXG5cdG9wdGlvbkRpc3BsYXk6IChjaGVja2JveCk9PntcclxuXHRcdGlmICgkKGNoZWNrYm94KS5wcm9wKCdjaGVja2VkJykpe1xyXG5cdFx0XHQkKCcucGFnZV9idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQoJy5wYWdlX2J0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzZWxlY3RQYWdlOiAoZSk9PntcclxuXHRcdCQoJyNlbnRlclVSTCAucGFnZV9idG4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgdGFyID0gJChlKTtcclxuXHRcdHRhci5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRpZiAodGFyLmF0dHIoJ2F0dHItdHlwZScpID09IDEpe1xyXG5cdFx0XHRmYi5zZXRUb2tlbih0YXIuYXR0cignYXR0ci12YWx1ZScpKTtcclxuXHRcdH1cclxuXHRcdGZiLmZlZWQodGFyLmF0dHIoJ2F0dHItdmFsdWUnKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0KTtcclxuXHRcdHN0ZXAuc3RlcDEoKTtcclxuXHR9LFxyXG5cdHNldFRva2VuOiAocGFnZWlkKT0+e1xyXG5cdFx0bGV0IHBhZ2VzID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbilbMV07XHJcblx0XHRmb3IobGV0IGkgb2YgcGFnZXMpe1xyXG5cdFx0XHRpZiAoaS5pZCA9PSBwYWdlaWQpe1xyXG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSBpLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0aGlkZGVuU3RhcnQ6ICgpPT57XHJcblx0XHRsZXQgZmJpZCA9ICQoJyNwdXJlX2ZiaWQnKS52YWwoKTtcclxuXHRcdGxldCBwYWdlSUQgPSBmYmlkLnNwbGl0KCdfJylbMF07XHJcblx0XHRGQi5hcGkoYC8ke3BhZ2VJRH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0aWYgKHJlcy5lcnJvcil7XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pe1xyXG5cdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmVlZDogKHBhZ2VJRCwgdHlwZSwgdXJsID0gJycsIGNsZWFyID0gdHJ1ZSk9PntcclxuXHRcdGlmIChjbGVhcil7XHJcblx0XHRcdCQoJy5yZWNvbW1hbmRzLCAuZmVlZHMgdGJvZHknKS5lbXB0eSgpO1xyXG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy5mZWVkcyAuYnRuJykub2ZmKCdjbGljaycpLmNsaWNrKCgpPT57XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoJyNlbnRlclVSTCBzZWxlY3QnKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKTtcclxuXHRcdFx0XHRmYi5mZWVkKHRhci52YWwoKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0LCBmYWxzZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGNvbW1hbmQgPSAodHlwZSA9PSAnMicpID8gJ2ZlZWQnOidwb3N0cyc7XHJcblx0XHRsZXQgYXBpO1xyXG5cdFx0aWYgKHVybCA9PSAnJyl7XHJcblx0XHRcdGFwaSA9IGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlSUR9LyR7Y29tbWFuZH0/ZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTI1YDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRhcGkgPSB1cmw7XHJcblx0XHR9XHJcblx0XHRGQi5hcGkoYXBpLCAocmVzKT0+e1xyXG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID09IDApe1xyXG5cdFx0XHRcdCQoJy5mZWVkcyAuYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmYi5uZXh0ID0gcmVzLnBhZ2luZy5uZXh0O1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdGxldCBzdHIgPSBnZW5EYXRhKGkpO1xyXG5cdFx0XHRcdCQoJy5zZWN0aW9uIC5mZWVkcyB0Ym9keScpLmFwcGVuZChzdHIpO1xyXG5cdFx0XHRcdGlmIChpLm1lc3NhZ2UgJiYgaS5tZXNzYWdlLmluZGV4T2YoJ+aKvScpID49IDApe1xyXG5cdFx0XHRcdFx0bGV0IHJlY29tbWFuZCA9IGdlbkNhcmQoaSk7XHJcblx0XHRcdFx0XHQkKCcuZG9uYXRlX2FyZWEgLnJlY29tbWFuZHMnKS5hcHBlbmQocmVjb21tYW5kKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdlbkRhdGEob2JqKXtcclxuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XHJcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xyXG5cclxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0bGV0IHN0ciA9IGA8dHI+XHJcblx0XHRcdFx0XHRcdDx0ZD48ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgIG9uY2xpY2s9XCJkYXRhLnN0YXJ0KCcke29iai5pZH0nKVwiPumWi+WnizwvZGl2PjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bWVzc308L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKG9iai5jcmVhdGVkX3RpbWUpfTwvdGQ+XHJcblx0XHRcdFx0XHRcdDwvdHI+YDtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGdlbkNhcmQob2JqKXtcclxuXHRcdFx0bGV0IHNyYyA9IG9iai5mdWxsX3BpY3R1cmUgfHwgJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzAweDIyNSc7XHJcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xyXG5cdFx0XHRsZXQgbGluayA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJytpZHNbMF0rJy9wb3N0cy8nK2lkc1sxXTtcclxuXHRcdFx0XHJcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XHJcblx0XHRcdGxldFx0c3RyID0gYDxkaXYgY2xhc3M9XCJjYXJkXCI+XHJcblx0XHRcdDxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWltYWdlXCI+XHJcblx0XHRcdDxmaWd1cmUgY2xhc3M9XCJpbWFnZSBpcy00YnkzXCI+XHJcblx0XHRcdDxpbWcgc3JjPVwiJHtzcmN9XCIgYWx0PVwiXCI+XHJcblx0XHRcdDwvZmlndXJlPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9hPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1jb250ZW50XCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcblx0XHRcdCR7bWVzc31cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+XHJcblx0XHRcdDwvZGl2PmA7XHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRNZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XHJcblx0XHRcdFx0bGV0IGFyciA9IFtyZXNdO1xyXG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQXV0aDogKGNvbW1hbmQgPSAnJyk9PntcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlLCBjb21tYW5kKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkNhbGxiYWNrOiAocmVzcG9uc2UsIGNvbW1hbmQgPSAnJyk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRkYXRhLnJhdy5leHRlbnNpb24gPSB0cnVlO1xyXG5cdFx0XHRcdGlmIChjb21tYW5kID09ICdpbXBvcnQnKXtcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2hhcmVkcG9zdHNcIiwgJCgnI2ltcG9ydCcpLnZhbCgpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IGV4dGVuZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaGFyZWRwb3N0c1wiKSk7XHJcblx0XHRcdFx0bGV0IGZpZCA9IFtdO1xyXG5cdFx0XHRcdGxldCBpZHMgPSBbXTtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdGZpZC5wdXNoKGkuZnJvbS5pZCk7XHJcblx0XHRcdFx0XHRpZiAoZmlkLmxlbmd0aCA+PTQ1KXtcclxuXHRcdFx0XHRcdFx0aWRzLnB1c2goZmlkKTtcclxuXHRcdFx0XHRcdFx0ZmlkID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlkcy5wdXNoKGZpZCk7XHJcblx0XHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXSwgbmFtZXMgPSB7fTtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgaWRzKXtcclxuXHRcdFx0XHRcdGxldCBwcm9taXNlID0gZmIuZ2V0TmFtZShpKS50aGVuKChyZXMpPT57XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBPYmplY3Qua2V5cyhyZXMpKXtcclxuXHRcdFx0XHRcdFx0XHRuYW1lc1tpXSA9IHJlc1tpXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRwcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdGkubWVzc2FnZSA9IGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0aS5saWtlX2NvdW50ID0gJ04vQSc7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0ZGVsZXRlIGkuY3JlYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0aS50eXBlID0gJ0xJS0UnO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0UHJvbWlzZS5hbGwocHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdGkuZnJvbS5uYW1lID0gbmFtZXNbaS5mcm9tLmlkXSA/IG5hbWVzW2kuZnJvbS5pZF0ubmFtZSA6IGkuZnJvbS5uYW1lO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZGF0YS5yYXcuZGF0YVtjb21tYW5kXSA9IGV4dGVuZDtcclxuXHRcdFx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcyk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcbmxldCBzdGVwID0ge1xyXG5cdHN0ZXAxOiAoKT0+e1xyXG5cdFx0JCgnLnNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc3RlcDInKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcclxuXHR9LFxyXG5cdHN0ZXAyOiAoKT0+e1xyXG5cdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHQkKCcuc2VjdGlvbicpLmFkZENsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiB7fSxcclxuXHRmaWx0ZXJlZDoge30sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwcm9taXNlX2FycmF5OiBbXSxcclxuXHR0ZXN0OiAoaWQpPT57XHJcblx0XHRjb25zb2xlLmxvZyhpZCk7XHJcblx0fSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGRhdGEucHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCk9PntcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0ZnVsbElEOiBmYmlkXHJcblx0XHR9XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0bGV0IGNvbW1hbmRzID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRsZXQgdGVtcF9kYXRhID0gb2JqO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGNvbW1hbmRzKXtcclxuXHRcdFx0dGVtcF9kYXRhLmRhdGEgPSB7fTtcclxuXHRcdFx0bGV0IHByb21pc2UgPSBkYXRhLmdldCh0ZW1wX2RhdGEsIGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHR0ZW1wX2RhdGEuZGF0YVtpXSA9IHJlcztcclxuXHRcdFx0fSk7XHJcblx0XHRcdGRhdGEucHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdFByb21pc2UuYWxsKGRhdGEucHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRkYXRhLmZpbmlzaCh0ZW1wX2RhdGEpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkLCBjb21tYW5kKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgc2hhcmVFcnJvciA9IDA7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpIGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHRpZiAoY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0Z2V0U2hhcmUoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2NvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2NvbW1hbmRdfSZvcmRlcj1jaHJvbm9sb2dpY2FsJmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtjb21tYW5kXS50b1N0cmluZygpfWAsKHJlcyk9PntcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLmlkfTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLmlkfTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXRTaGFyZShhZnRlcj0nJyl7XHJcblx0XHRcdFx0bGV0IHVybCA9IGBodHRwczovL2FtNjZhaGd0cDguZXhlY3V0ZS1hcGkuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbS9zaGFyZT9mYmlkPSR7ZmJpZC5mdWxsSUR9JmFmdGVyPSR7YWZ0ZXJ9YDtcclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0aWYgKHJlcyA9PT0gJ2VuZCcpe1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yTWVzc2FnZSl7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHRcdH1lbHNlIGlmKHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0XHQvLyBzaGFyZUVycm9yID0gMDtcclxuXHRcdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IG5hbWUgPSAnJztcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGkuc3Rvcnkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lID0gaS5zdG9yeS5zdWJzdHJpbmcoMCwgaS5zdG9yeS5pbmRleE9mKCcgc2hhcmVkJykpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBpLmlkLnN1YnN0cmluZygwLCBpLmlkLmluZGV4T2YoXCJfXCIpKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGxldCBpZCA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aS5mcm9tID0ge2lkLCBuYW1lfTtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goaSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGdldFNoYXJlKHJlcy5hZnRlcik7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKT0+e1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRzdGVwLnN0ZXAyKCk7XHJcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdCQoJy5yZXN1bHRfYXJlYSA+IC50aXRsZSBzcGFuJykudGV4dChmYmlkLmZ1bGxJRCk7XHJcblx0XHRkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJhd1wiLCBKU09OLnN0cmluZ2lmeShmYmlkKSk7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXJlZCA9IHt9O1xyXG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhyYXdEYXRhLmRhdGEpKXtcclxuXHRcdFx0bGV0IGlzVGFnID0gJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRcdGlmIChrZXkgPT09ICdyZWFjdGlvbnMnKSBpc1RhZyA9IGZhbHNlO1xyXG5cdFx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLmRhdGFba2V5XSwga2V5LCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHRcclxuXHRcdFx0ZGF0YS5maWx0ZXJlZFtrZXldID0gbmV3RGF0YTtcclxuXHRcdH1cclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSl7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmlsdGVyZWQpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBkYXRhLmZpbHRlcmVkO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpPT57XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pe1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuW/g+aDhVwiIDogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpPT57XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmVkID0gcmF3ZGF0YTtcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhmaWx0ZXJlZCkpe1xyXG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZD7lv4Pmg4U8L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgdmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0XHQkKFwiLnRhYmxlcyAuXCIra2V5K1wiIHRhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHRcdHRhYi5pbml0KCk7XHJcblx0XHRjb21wYXJlLmluaXQoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjb21wYXJlID0ge1xyXG5cdGFuZDogW10sXHJcblx0b3I6IFtdLFxyXG5cdHJhdzogW10sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdGNvbXBhcmUuYW5kID0gW107XHJcblx0XHRjb21wYXJlLm9yID0gW107XHJcblx0XHRjb21wYXJlLnJhdyA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGxldCBpZ25vcmUgPSAkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS52YWwoKTtcclxuXHRcdGxldCBiYXNlID0gW107XHJcblx0XHRsZXQgZmluYWwgPSBbXTtcclxuXHRcdGxldCBjb21wYXJlX251bSA9IDE7XHJcblx0XHRpZiAoaWdub3JlID09PSAnaWdub3JlJykgY29tcGFyZV9udW0gPSAyO1xyXG5cclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGNvbXBhcmUucmF3KSl7XHJcblx0XHRcdGlmIChrZXkgIT09IGlnbm9yZSl7XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGNvbXBhcmUucmF3W2tleV0pe1xyXG5cdFx0XHRcdFx0YmFzZS5wdXNoKGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IHNvcnQgPSAoZGF0YS5yYXcuZXh0ZW5zaW9uKSA/ICduYW1lJzonaWQnO1xyXG5cdFx0YmFzZSA9IGJhc2Uuc29ydCgoYSxiKT0+e1xyXG5cdFx0XHRyZXR1cm4gYS5mcm9tW3NvcnRdID4gYi5mcm9tW3NvcnRdID8gMTotMTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGZvcihsZXQgaSBvZiBiYXNlKXtcclxuXHRcdFx0aS5tYXRjaCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdGxldCB0ZW1wX25hbWUgPSAnJztcclxuXHRcdC8vIGNvbnNvbGUubG9nKGJhc2UpO1xyXG5cdFx0Zm9yKGxldCBpIGluIGJhc2Upe1xyXG5cdFx0XHRsZXQgb2JqID0gYmFzZVtpXTtcclxuXHRcdFx0aWYgKG9iai5mcm9tLmlkID09IHRlbXAgfHwgKGRhdGEucmF3LmV4dGVuc2lvbiAmJiAob2JqLmZyb20ubmFtZSA9PSB0ZW1wX25hbWUpKSl7XHJcblx0XHRcdFx0bGV0IHRhciA9IGZpbmFsW2ZpbmFsLmxlbmd0aC0xXTtcclxuXHRcdFx0XHR0YXIubWF0Y2grKztcclxuXHRcdFx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKXtcclxuXHRcdFx0XHRcdGlmICghdGFyW2tleV0pIHRhcltrZXldID0gb2JqW2tleV07IC8v5ZCI5L216LOH5paZXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0YXIubWF0Y2ggPT0gY29tcGFyZV9udW0pe1xyXG5cdFx0XHRcdFx0dGVtcF9uYW1lID0gJyc7XHJcblx0XHRcdFx0XHR0ZW1wID0gJyc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmaW5hbC5wdXNoKG9iaik7XHJcblx0XHRcdFx0dGVtcCA9IG9iai5mcm9tLmlkO1xyXG5cdFx0XHRcdHRlbXBfbmFtZSA9IG9iai5mcm9tLm5hbWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdGNvbXBhcmUub3IgPSBmaW5hbDtcclxuXHRcdGNvbXBhcmUuYW5kID0gY29tcGFyZS5vci5maWx0ZXIoKHZhbCk9PntcclxuXHRcdFx0cmV0dXJuIHZhbC5tYXRjaCA9PSBjb21wYXJlX251bTtcclxuXHRcdH0pO1xyXG5cdFx0Y29tcGFyZS5nZW5lcmF0ZSgpO1xyXG5cdH0sXHJcblx0Z2VuZXJhdGU6ICgpPT57XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGRhdGFfYW5kID0gY29tcGFyZS5hbmQ7XHJcblxyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfYW5kLmVudHJpZXMoKSl7XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcwJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuYW5kIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XHJcblxyXG5cdFx0bGV0IGRhdGFfb3IgPSBjb21wYXJlLm9yO1xyXG5cdFx0bGV0IHRib2R5MiA9ICcnO1xyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX29yLmVudHJpZXMoKSl7XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keTIgKz0gdHI7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUub3IgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5Mik7XHJcblx0XHRcclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydhbmQnLCdvciddO1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0XHRsZXQgdGFibGUgPSAkKCcudGFibGVzIC4nK2krJyB0YWJsZScpLkRhdGFUYWJsZSgpO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBjaG9vc2UgPSB7XHJcblx0ZGF0YTogW10sXHJcblx0YXdhcmQ6IFtdLFxyXG5cdG51bTogMCxcclxuXHRkZXRhaWw6IGZhbHNlLFxyXG5cdGxpc3Q6IFtdLFxyXG5cdGluaXQ6IChjdHJsID0gZmFsc2UpPT57XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCl7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbyhjdHJsKTtcclxuXHR9LFxyXG5cdGdvOiAoY3RybCk9PntcclxuXHRcdGxldCBjb21tYW5kID0gdGFiLm5vdztcclxuXHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXS5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhW2NvbW1hbmRdLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHRcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGxldCB0ZW1wQXJyID0gW107XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkuY29sdW1uKDIpLmRhdGEoKS5lYWNoKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCl7XHJcblx0XHRcdFx0bGV0IHdvcmQgPSAkKCcuc2VhcmNoQ29tbWVudCcpLnZhbCgpO1xyXG5cdFx0XHRcdGlmICh2YWx1ZS5pbmRleE9mKHdvcmQpID49IDApIHRlbXBBcnIucHVzaChpbmRleCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBpIG9mIGNob29zZS5hd2FyZCl7XHJcblx0XHRcdGxldCByb3cgPSAodGVtcEFyci5sZW5ndGggPT0gMCkgPyBpOnRlbXBBcnJbaV07XHJcblx0XHRcdGxldCB0YXIgPSAkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLnJvdyhyb3cpLm5vZGUoKS5pbm5lckhUTUw7XHJcblx0XHRcdGluc2VydCArPSAnPHRyPicgKyB0YXIgKyAnPC90cj4nO1xyXG5cdFx0fVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdGlmICghY3RybCl7XHJcblx0XHRcdCQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQvLyBsZXQgdGFyID0gJCh0aGlzKS5maW5kKCd0ZCcpLmVxKDEpO1xyXG5cdFx0XHRcdC8vIGxldCBpZCA9IHRhci5maW5kKCdhJykuYXR0cignYXR0ci1mYmlkJyk7XHJcblx0XHRcdFx0Ly8gdGFyLnByZXBlbmQoYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke2lkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHJcblx0XHRpZihjaG9vc2UuZGV0YWlsKXtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvcihsZXQgayBpbiBjaG9vc2UubGlzdCl7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI3XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXcsIGNvbW1hbmQsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIGVuZFRpbWUpPT57XHJcblx0XHRsZXQgZGF0YSA9IHJhdztcclxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHdvcmQgIT09ICcnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kICE9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBlbmRUaW1lKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnJlYWN0KGRhdGEsIHJlYWN0KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9LFxyXG5cdHVuaXF1ZTogKGRhdGEpPT57XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCB0KT0+e1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XHJcblx0XHRpZiAodGFyID09ICdhbGwnKXtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCk9PntcclxuXHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFiID0ge1xyXG5cdG5vdzogXCJjb21tZW50c1wiLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdHRhYi5ub3cgPSAkKHRoaXMpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0XHRsZXQgdGFyID0gJCh0aGlzKS5pbmRleCgpO1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2JykuZXEodGFyKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpe1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xyXG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcclxuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgIGlmIChkYXRlIDwgMTApe1xyXG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XHJcbiAgICAgfVxyXG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgIGlmIChob3VyIDwgMTApe1xyXG4gICAgIFx0aG91ciA9IFwiMFwiK2hvdXI7XHJcbiAgICAgfVxyXG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgICBpZiAobWluIDwgMTApe1xyXG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xyXG4gICAgIH1cclxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgaWYgKHNlYyA8IDEwKXtcclxuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcclxuICAgICB9XHJcbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XHJcbiAgICAgcmV0dXJuIHRpbWU7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
