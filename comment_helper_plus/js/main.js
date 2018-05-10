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
		var isTag = $("#tag").prop("checked");
		var _iteratorNormalCompletion15 = true;
		var _didIteratorError15 = false;
		var _iteratorError15 = undefined;

		try {
			for (var _iterator15 = Object.keys(rawData.data)[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
				var key = _step15.value;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJoYXNoIiwibG9jYXRpb24iLCJpbmRleE9mIiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInNlc3Npb25TdG9yYWdlIiwiYWxlcnQiLCJocmVmIiwibGFzdERhdGEiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwiZGF0YSIsImZpbmlzaCIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJlIiwiZ2V0QXV0aCIsImN0cmxLZXkiLCJhbHRLZXkiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGlrZXMiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJvcmRlciIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJuZXh0IiwidHlwZSIsIkZCIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJmYmlkIiwiUHJvbWlzZSIsImFsbCIsImdldE1lIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsIm9wdGlvbnMiLCJpIiwiaiIsImlkIiwibmFtZSIsImh0bWwiLCJvcHRpb25EaXNwbGF5IiwiY2hlY2tib3giLCJwcm9wIiwic2VsZWN0UGFnZSIsInRhciIsImF0dHIiLCJzZXRUb2tlbiIsInN0ZXAiLCJzdGVwMSIsInBhZ2VpZCIsInBhZ2VzIiwiYWNjZXNzX3Rva2VuIiwiaGlkZGVuU3RhcnQiLCJwYWdlSUQiLCJzcGxpdCIsImFwaSIsImVycm9yIiwiY2xlYXIiLCJlbXB0eSIsImZpbmQiLCJjb21tYW5kIiwicGFnaW5nIiwic3RyIiwiZ2VuRGF0YSIsIm1lc3NhZ2UiLCJyZWNvbW1hbmQiLCJnZW5DYXJkIiwib2JqIiwiaWRzIiwibGluayIsIm1lc3MiLCJyZXBsYWNlIiwidGltZUNvbnZlcnRlciIsImNyZWF0ZWRfdGltZSIsInNyYyIsImZ1bGxfcGljdHVyZSIsInJlc29sdmUiLCJyZWplY3QiLCJhcnIiLCJleHRlbnNpb25BdXRoIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJzZXRJdGVtIiwiZXh0ZW5kIiwiZmlkIiwicHVzaCIsImZyb20iLCJwcm9taXNlX2FycmF5IiwibmFtZXMiLCJwcm9taXNlIiwiZ2V0TmFtZSIsIk9iamVjdCIsImtleXMiLCJzdG9yeSIsInBvc3RsaW5rIiwibGlrZV9jb3VudCIsInRpdGxlIiwidG9TdHJpbmciLCJzY3JvbGxUb3AiLCJzdGVwMiIsImZpbHRlcmVkIiwidXNlcmlkIiwibm93TGVuZ3RoIiwidGVzdCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwiY29tbWFuZHMiLCJ0ZW1wX2RhdGEiLCJnZXQiLCJkYXRhcyIsInNoYXJlRXJyb3IiLCJnZXRTaGFyZSIsImQiLCJ1cGRhdGVkX3RpbWUiLCJnZXROZXh0IiwiZ2V0SlNPTiIsImZhaWwiLCJhZnRlciIsInN1YnN0cmluZyIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwiaXNUYWciLCJrZXkiLCJuZXdEYXRhIiwidG90YWxGaWx0ZXIiLCJvYmoyQXJyYXkiLCJuZXdPYmoiLCJlYWNoIiwidG1wIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwicGljIiwidGhlYWQiLCJ0Ym9keSIsImVudHJpZXMiLCJwaWN0dXJlIiwidGQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJzZWFyY2giLCJ2YWx1ZSIsImRyYXciLCJhbmQiLCJvciIsImlnbm9yZSIsImJhc2UiLCJmaW5hbCIsImNvbXBhcmVfbnVtIiwic29ydCIsImEiLCJiIiwibWF0Y2giLCJ0ZW1wIiwidGVtcF9uYW1lIiwiZGF0YV9hbmQiLCJkYXRhX29yIiwidGJvZHkyIiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwiY3RybCIsIm4iLCJwYXJzZUludCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwidGVtcEFyciIsImNvbHVtbiIsImluZGV4Iiwicm93Iiwibm9kZSIsImlubmVySFRNTCIsImsiLCJlcSIsImluc2VydEJlZm9yZSIsInVuaXF1ZSIsInRhZyIsInRpbWUiLCJvdXRwdXQiLCJmb3JFYWNoIiwiaXRlbSIsIm5ld0FyeSIsImdyZXAiLCJtZXNzYWdlX3RhZ3MiLCJ0IiwidGltZV9hcnkiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJ1aSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsIm1hcCIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBO0FBQ0RTLEVBQUVFLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFVO0FBQzNCLEtBQUlDLFdBQVcsQ0FBZjtBQUNBSixHQUFFLFFBQUYsRUFBWUssS0FBWixDQUFrQixZQUFVO0FBQzNCRDtBQUNBLE1BQUlBLFlBQVksQ0FBaEIsRUFBa0I7QUFDakJKLEtBQUUsUUFBRixFQUFZTSxHQUFaLENBQWdCLE9BQWhCO0FBQ0FOLEtBQUUsMEJBQUYsRUFBOEJPLFdBQTlCLENBQTBDLE1BQTFDO0FBQ0E7QUFDRCxFQU5EOztBQVFBLEtBQUlDLE9BQU9DLFNBQVNELElBQXBCO0FBQ0EsS0FBSUEsS0FBS0UsT0FBTCxDQUFhLE9BQWIsS0FBeUIsQ0FBN0IsRUFBK0I7QUFDOUJDLGVBQWFDLFVBQWIsQ0FBd0IsS0FBeEI7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QixFQUE4QjtBQUMxQm1KLFVBQU8sTUFBTThDLFFBQVFqTSxDQUFSLEVBQVdrSixLQUFYLENBQU4sR0FBMEIsSUFBakM7QUFDSDs7QUFFREMsTUFBSWdELEtBQUosQ0FBVSxDQUFWLEVBQWFoRCxJQUFJaE0sTUFBSixHQUFhLENBQTFCOztBQUVBO0FBQ0ErTyxTQUFPL0MsTUFBTSxNQUFiO0FBQ0g7O0FBRUQsS0FBSStDLE9BQU8sRUFBWCxFQUFlO0FBQ1gvUixRQUFNLGNBQU47QUFDQTtBQUNIOztBQUVEO0FBQ0EsS0FBSWlTLFdBQVcsRUFBZjtBQUNBO0FBQ0FBLGFBQVlMLFlBQVkzSixPQUFaLENBQW9CLElBQXBCLEVBQXlCLEdBQXpCLENBQVo7O0FBRUE7QUFDQSxLQUFJaUssTUFBTSx1Q0FBdUNDLFVBQVVKLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJaEssT0FBTzNJLFNBQVNnVCxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQXJLLE1BQUs5SCxJQUFMLEdBQVlpUyxHQUFaOztBQUVBO0FBQ0FuSyxNQUFLc0ssS0FBTCxHQUFhLG1CQUFiO0FBQ0F0SyxNQUFLdUssUUFBTCxHQUFnQkwsV0FBVyxNQUEzQjs7QUFFQTtBQUNBN1MsVUFBU21ULElBQVQsQ0FBY0MsV0FBZCxDQUEwQnpLLElBQTFCO0FBQ0FBLE1BQUt4SSxLQUFMO0FBQ0FILFVBQVNtVCxJQUFULENBQWNFLFdBQWQsQ0FBMEIxSyxJQUExQjtBQUNIIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKXtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIixcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdGxldCBoaWRlYXJlYSA9IDA7XHJcblx0JCgnaGVhZGVyJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGhpZGVhcmVhKys7XHJcblx0XHRpZiAoaGlkZWFyZWEgPj0gNSl7XHJcblx0XHRcdCQoJ2hlYWRlcicpLm9mZignY2xpY2snKTtcclxuXHRcdFx0JCgnI2ZiaWRfYnV0dG9uLCAjcHVyZV9mYmlkJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJjbGVhclwiKSA+PSAwKXtcclxuXHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdyYXcnKTtcclxuXHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2xvZ2luJyk7XHJcblx0XHRhbGVydCgn5bey5riF6Zmk5pqr5a2Y77yM6KuL6YeN5paw6YCy6KGM55m75YWlJyk7XHJcblx0XHRsb2NhdGlvbi5ocmVmID0gJ2h0dHBzOi8vZ2c5MDA1Mi5naXRodWIuaW8vY29tbWVudF9oZWxwZXJfcGx1cyc7XHJcblx0fVxyXG5cdGxldCBsYXN0RGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyYXdcIikpO1xyXG5cclxuXHRpZiAobGFzdERhdGEpe1xyXG5cdFx0ZGF0YS5maW5pc2gobGFzdERhdGEpO1xyXG5cdH1cclxuXHRpZiAoc2Vzc2lvblN0b3JhZ2UubG9naW4pe1xyXG5cdFx0ZmIuZ2VuT3B0aW9uKEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pKTtcclxuXHR9XHJcblxyXG5cdC8vICQoXCIudGFibGVzID4gLnNoYXJlZHBvc3RzIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHQvLyBcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdC8vIFx0XHRmYi5leHRlbnNpb25BdXRoKCdpbXBvcnQnKTtcclxuXHQvLyBcdH1lbHNle1xyXG5cdC8vIFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfSk7XHJcblx0XHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9zdGFydFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0Y2hvb3NlLmluaXQodHJ1ZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLmluaXQoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoIWUuY3RybEtleSB8fCAhZS5hbHRLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6RVhDRUxcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudGFibGVzIC5maWx0ZXJzIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcuY29tcGFyZV9jb25kaXRpb24nKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLicrICQodGhpcykudmFsKCkpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVktTU0tREQgICBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUobm93RGF0ZSgpKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5KXtcclxuXHRcdFx0bGV0IGRkO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhW3RhYi5ub3ddKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgZGQ7XHJcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xyXG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKXtcclxuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhW3RhYi5ub3ddKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRjaV9jb3VudGVyKys7XHJcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KXtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYoZS5jdHJsS2V5KXtcclxuXHRcdFx0ZmIuZ2V0QXV0aCgnc2hhcmVkcG9zdHMnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCdtZXNzYWdlX3RhZ3MnLCdtZXNzYWdlJywnZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbJ2NyZWF0ZWRfdGltZScsJ2Zyb20nLCdtZXNzYWdlJywnc3RvcnknXSxcclxuXHRcdGxpa2VzOiBbJ25hbWUnXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuMTInLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuMTInLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4xMicsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi4xMicsXHJcblx0XHRmZWVkOiAndjIuMTInLFxyXG5cdFx0Z3JvdXA6ICd2Mi4xMicsXHJcblx0XHRuZXdlc3Q6ICd2Mi4xMidcclxuXHR9LFxyXG5cdGZpbHRlcjoge1xyXG5cdFx0d29yZDogJycsXHJcblx0XHRyZWFjdDogJ2FsbCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnJyxcclxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX21hbmFnZWRfZ3JvdXBzLG1hbmFnZV9wYWdlcycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0bmV4dDogJycsXHJcblx0Z2V0QXV0aDogKHR5cGUpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xyXG5cdFx0XHRcdFx0ZmIuc3RhcnQoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfmjojmrIrlpLHmlZfvvIzoq4vntabkuojmiYDmnInmrIrpmZAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1x0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKT0+e1xyXG5cdFx0UHJvbWlzZS5hbGwoW2ZiLmdldE1lKCksZmIuZ2V0UGFnZSgpLCBmYi5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5sb2dpbiA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcblx0XHRcdGZiLmdlbk9wdGlvbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5PcHRpb246IChyZXMpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgb3B0aW9ucyA9IGA8aW5wdXQgaWQ9XCJwdXJlX2ZiaWRcIiBjbGFzcz1cImhpZGVcIj48YnV0dG9uIGlkPVwiZmJpZF9idXR0b25cIiBjbGFzcz1cImJ0biBoaWRlXCIgb25jbGljaz1cImZiLmhpZGRlblN0YXJ0KClcIj7nlLFGQklE5pO35Y+WPC9idXR0b24+PGxhYmVsPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbmNoYW5nZT1cImZiLm9wdGlvbkRpc3BsYXkodGhpcylcIj7pmrHol4/liJfooag8L2xhYmVsPjxicj5gO1xyXG5cdFx0bGV0IHR5cGUgPSAtMTtcclxuXHRcdCQoJyNidG5fc3RhcnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJlcyl7XHJcblx0XHRcdHR5cGUrKztcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGkpe1xyXG5cdFx0XHRcdG9wdGlvbnMgKz0gYDxkaXYgY2xhc3M9XCJwYWdlX2J0blwiIGF0dHItdHlwZT1cIiR7dHlwZX1cIiBhdHRyLXZhbHVlPVwiJHtqLmlkfVwiIG9uY2xpY2s9XCJmYi5zZWxlY3RQYWdlKHRoaXMpXCI+JHtqLm5hbWV9PC9kaXY+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnI2VudGVyVVJMJykuaHRtbChvcHRpb25zKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdH0sXHJcblx0b3B0aW9uRGlzcGxheTogKGNoZWNrYm94KT0+e1xyXG5cdFx0aWYgKCQoY2hlY2tib3gpLnByb3AoJ2NoZWNrZWQnKSl7XHJcblx0XHRcdCQoJy5wYWdlX2J0bicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCgnLnBhZ2VfYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6IChlKT0+e1xyXG5cdFx0JCgnI2VudGVyVVJMIC5wYWdlX2J0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCB0YXIgPSAkKGUpO1xyXG5cdFx0dGFyLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGlmICh0YXIuYXR0cignYXR0ci10eXBlJykgPT0gMSl7XHJcblx0XHRcdGZiLnNldFRva2VuKHRhci5hdHRyKCdhdHRyLXZhbHVlJykpO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZmVlZCh0YXIuYXR0cignYXR0ci12YWx1ZScpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQpO1xyXG5cdFx0c3RlcC5zdGVwMSgpO1xyXG5cdH0sXHJcblx0c2V0VG9rZW46IChwYWdlaWQpPT57XHJcblx0XHRsZXQgcGFnZXMgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKVsxXTtcclxuXHRcdGZvcihsZXQgaSBvZiBwYWdlcyl7XHJcblx0XHRcdGlmIChpLmlkID09IHBhZ2VpZCl7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IGkuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRoaWRkZW5TdGFydDogKCk9PntcclxuXHRcdGxldCBmYmlkID0gJCgnI3B1cmVfZmJpZCcpLnZhbCgpO1xyXG5cdFx0bGV0IHBhZ2VJRCA9IGZiaWQuc3BsaXQoJ18nKVswXTtcclxuXHRcdEZCLmFwaShgLyR7cGFnZUlEfT9maWVsZHM9YWNjZXNzX3Rva2VuYCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRpZiAocmVzLmVycm9yKXtcclxuXHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbil7XHJcblx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmZWVkOiAocGFnZUlELCB0eXBlLCB1cmwgPSAnJywgY2xlYXIgPSB0cnVlKT0+e1xyXG5cdFx0aWYgKGNsZWFyKXtcclxuXHRcdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHRcdCQoJy5mZWVkcyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5vZmYoJ2NsaWNrJykuY2xpY2soKCk9PntcclxuXHRcdFx0XHRsZXQgdGFyID0gJCgnI2VudGVyVVJMIHNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xyXG5cdFx0XHRcdGZiLmZlZWQodGFyLnZhbCgpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQsIGZhbHNlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRsZXQgY29tbWFuZCA9ICh0eXBlID09ICcyJykgPyAnZmVlZCc6J3Bvc3RzJztcclxuXHRcdGxldCBhcGk7XHJcblx0XHRpZiAodXJsID09ICcnKXtcclxuXHRcdFx0YXBpID0gYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VJRH0vJHtjb21tYW5kfT9maWVsZHM9bGluayxmdWxsX3BpY3R1cmUsY3JlYXRlZF90aW1lLG1lc3NhZ2UmbGltaXQ9MjVgO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFwaSA9IHVybDtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShhcGksIChyZXMpPT57XHJcblx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPT0gMCl7XHJcblx0XHRcdFx0JCgnLmZlZWRzIC5idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZiLm5leHQgPSByZXMucGFnaW5nLm5leHQ7XHJcblx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0bGV0IHN0ciA9IGdlbkRhdGEoaSk7XHJcblx0XHRcdFx0JCgnLnNlY3Rpb24gLmZlZWRzIHRib2R5JykuYXBwZW5kKHN0cik7XHJcblx0XHRcdFx0aWYgKGkubWVzc2FnZSAmJiBpLm1lc3NhZ2UuaW5kZXhPZign5oq9JykgPj0gMCl7XHJcblx0XHRcdFx0XHRsZXQgcmVjb21tYW5kID0gZ2VuQ2FyZChpKTtcclxuXHRcdFx0XHRcdCQoJy5kb25hdGVfYXJlYSAucmVjb21tYW5kcycpLmFwcGVuZChyZWNvbW1hbmQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2VuRGF0YShvYmope1xyXG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcclxuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XHJcblxyXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRsZXQgc3RyID0gYDx0cj5cclxuXHRcdFx0XHRcdFx0PHRkPjxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiAgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIob2JqLmNyZWF0ZWRfdGltZSl9PC90ZD5cclxuXHRcdFx0XHRcdFx0PC90cj5gO1xyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZ2VuQ2FyZChvYmope1xyXG5cdFx0XHRsZXQgc3JjID0gb2JqLmZ1bGxfcGljdHVyZSB8fCAnaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4MjI1JztcclxuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XHJcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0bGV0XHRzdHIgPSBgPGRpdiBjbGFzcz1cImNhcmRcIj5cclxuXHRcdFx0PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtaW1hZ2VcIj5cclxuXHRcdFx0PGZpZ3VyZSBjbGFzcz1cImltYWdlIGlzLTRieTNcIj5cclxuXHRcdFx0PGltZyBzcmM9XCIke3NyY31cIiBhbHQ9XCJcIj5cclxuXHRcdFx0PC9maWd1cmU+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2E+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWNvbnRlbnRcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuXHRcdFx0JHttZXNzfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj5cclxuXHRcdFx0PC9kaXY+YDtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldE1lOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lYCwgKHJlcyk9PntcclxuXHRcdFx0XHRsZXQgYXJyID0gW3Jlc107XHJcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoY29tbWFuZCA9ICcnKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UsIGNvbW1hbmQpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSwgY29tbWFuZCA9ICcnKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xyXG5cdFx0XHRcdGRhdGEucmF3LmV4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ2ltcG9ydCcpe1xyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaGFyZWRwb3N0c1wiLCAkKCcjaW1wb3J0JykudmFsKCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgZXh0ZW5kID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNoYXJlZHBvc3RzXCIpKTtcclxuXHRcdFx0XHRsZXQgZmlkID0gW107XHJcblx0XHRcdFx0bGV0IGlkcyA9IFtdO1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0ZmlkLnB1c2goaS5mcm9tLmlkKTtcclxuXHRcdFx0XHRcdGlmIChmaWQubGVuZ3RoID49NDUpe1xyXG5cdFx0XHRcdFx0XHRpZHMucHVzaChmaWQpO1xyXG5cdFx0XHRcdFx0XHRmaWQgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWRzLnB1c2goZmlkKTtcclxuXHRcdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdLCBuYW1lcyA9IHt9O1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBpZHMpe1xyXG5cdFx0XHRcdFx0bGV0IHByb21pc2UgPSBmYi5nZXROYW1lKGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIE9iamVjdC5rZXlzKHJlcykpe1xyXG5cdFx0XHRcdFx0XHRcdG5hbWVzW2ldID0gcmVzW2ldO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0aS5tZXNzYWdlID0gaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRpLmxpa2VfY291bnQgPSAnTi9BJztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgaS5jcmVhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgaS5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHRpLnR5cGUgPSAnTElLRSc7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRQcm9taXNlLmFsbChwcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0aS5mcm9tLm5hbWUgPSBuYW1lc1tpLmZyb20uaWRdID8gbmFtZXNbaS5mcm9tLmlkXS5uYW1lIDogaS5mcm9tLm5hbWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkYXRhLnJhdy5kYXRhW2NvbW1hbmRdID0gZXh0ZW5kO1xyXG5cdFx0XHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXROYW1lOiAoaWRzKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9Lz9pZHM9JHtpZHMudG9TdHJpbmcoKX1gLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxubGV0IHN0ZXAgPSB7XHJcblx0c3RlcDE6ICgpPT57XHJcblx0XHQkKCcuc2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH0sXHJcblx0c3RlcDI6ICgpPT57XHJcblx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcclxuXHRcdCQoJy5zZWN0aW9uJykuYWRkQ2xhc3MoJ3N0ZXAyJyk7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IHt9LFxyXG5cdGZpbHRlcmVkOiB7fSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdHRlc3Q6IChpZCk9PntcclxuXHRcdGNvbnNvbGUubG9nKGlkKTtcclxuXHR9LFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKT0+e1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRmdWxsSUQ6IGZiaWRcclxuXHRcdH1cclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgY29tbWFuZHMgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcclxuXHRcdGxldCB0ZW1wX2RhdGEgPSBvYmo7XHJcblx0XHRmb3IobGV0IGkgb2YgY29tbWFuZHMpe1xyXG5cdFx0XHR0ZW1wX2RhdGEuZGF0YSA9IHt9O1xyXG5cdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KHRlbXBfZGF0YSwgaSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdHRlbXBfZGF0YS5kYXRhW2ldID0gcmVzO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdGRhdGEuZmluaXNoKHRlbXBfZGF0YSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQsIGNvbW1hbmQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBzaGFyZUVycm9yID0gMDtcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJykgY29tbWFuZCA9ICdncm91cCc7XHJcblx0XHRcdGlmIChjb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0XHRnZXRTaGFyZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7Y29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbY29tbWFuZF19Jm9yZGVyPWNocm9ub2xvZ2ljYWwmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9YCwocmVzKT0+e1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldFNoYXJlKGFmdGVyPScnKXtcclxuXHRcdFx0XHRsZXQgdXJsID0gYGh0dHBzOi8vYW02NmFoZ3RwOC5leGVjdXRlLWFwaS5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tL3NoYXJlP2ZiaWQ9JHtmYmlkLmZ1bGxJRH0mYWZ0ZXI9JHthZnRlcn1gO1xyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRpZiAocmVzID09PSAnZW5kJyl7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3JNZXNzYWdlKXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYocmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRcdC8vIHNoYXJlRXJyb3IgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgbmFtZSA9ICcnO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoaS5zdG9yeSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBpLnN0b3J5LnN1YnN0cmluZygwLCBpLnN0b3J5LmluZGV4T2YoJyBzaGFyZWQnKSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZSA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGlkID0gaS5pZC5zdWJzdHJpbmcoMCwgaS5pZC5pbmRleE9mKFwiX1wiKSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpLmZyb20gPSB7aWQsIG5hbWV9O1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChpKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0Z2V0U2hhcmUocmVzLmFmdGVyKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdHN0ZXAuc3RlcDIoKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0JCgnLnJlc3VsdF9hcmVhID4gLnRpdGxlIHNwYW4nKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmF3XCIsIEpTT04uc3RyaW5naWZ5KGZiaWQpKTtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XHJcblx0XHRkYXRhLmZpbHRlcmVkID0ge307XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocmF3RGF0YS5kYXRhKSl7XHJcblx0XHRcdGlmIChrZXkgPT09ICdyZWFjdGlvbnMnKSBpc1RhZyA9IGZhbHNlO1xyXG5cdFx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLmRhdGFba2V5XSwga2V5LCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHRcclxuXHRcdFx0ZGF0YS5maWx0ZXJlZFtrZXldID0gbmV3RGF0YTtcclxuXHRcdH1cclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSl7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmlsdGVyZWQpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBkYXRhLmZpbHRlcmVkO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpPT57XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pe1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuW/g+aDhVwiIDogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpPT57XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmVkID0gcmF3ZGF0YTtcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhmaWx0ZXJlZCkpe1xyXG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZD7lv4Pmg4U8L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgdmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0XHQkKFwiLnRhYmxlcyAuXCIra2V5K1wiIHRhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHRcdHRhYi5pbml0KCk7XHJcblx0XHRjb21wYXJlLmluaXQoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjb21wYXJlID0ge1xyXG5cdGFuZDogW10sXHJcblx0b3I6IFtdLFxyXG5cdHJhdzogW10sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdGNvbXBhcmUuYW5kID0gW107XHJcblx0XHRjb21wYXJlLm9yID0gW107XHJcblx0XHRjb21wYXJlLnJhdyA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGxldCBpZ25vcmUgPSAkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS52YWwoKTtcclxuXHRcdGxldCBiYXNlID0gW107XHJcblx0XHRsZXQgZmluYWwgPSBbXTtcclxuXHRcdGxldCBjb21wYXJlX251bSA9IDE7XHJcblx0XHRpZiAoaWdub3JlID09PSAnaWdub3JlJykgY29tcGFyZV9udW0gPSAyO1xyXG5cclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGNvbXBhcmUucmF3KSl7XHJcblx0XHRcdGlmIChrZXkgIT09IGlnbm9yZSl7XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGNvbXBhcmUucmF3W2tleV0pe1xyXG5cdFx0XHRcdFx0YmFzZS5wdXNoKGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IHNvcnQgPSAoZGF0YS5yYXcuZXh0ZW5zaW9uKSA/ICduYW1lJzonaWQnO1xyXG5cdFx0YmFzZSA9IGJhc2Uuc29ydCgoYSxiKT0+e1xyXG5cdFx0XHRyZXR1cm4gYS5mcm9tW3NvcnRdID4gYi5mcm9tW3NvcnRdID8gMTotMTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGZvcihsZXQgaSBvZiBiYXNlKXtcclxuXHRcdFx0aS5tYXRjaCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdGxldCB0ZW1wX25hbWUgPSAnJztcclxuXHRcdC8vIGNvbnNvbGUubG9nKGJhc2UpO1xyXG5cdFx0Zm9yKGxldCBpIGluIGJhc2Upe1xyXG5cdFx0XHRsZXQgb2JqID0gYmFzZVtpXTtcclxuXHRcdFx0aWYgKG9iai5mcm9tLmlkID09IHRlbXAgfHwgKGRhdGEucmF3LmV4dGVuc2lvbiAmJiAob2JqLmZyb20ubmFtZSA9PSB0ZW1wX25hbWUpKSl7XHJcblx0XHRcdFx0bGV0IHRhciA9IGZpbmFsW2ZpbmFsLmxlbmd0aC0xXTtcclxuXHRcdFx0XHR0YXIubWF0Y2grKztcclxuXHRcdFx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKXtcclxuXHRcdFx0XHRcdGlmICghdGFyW2tleV0pIHRhcltrZXldID0gb2JqW2tleV07IC8v5ZCI5L216LOH5paZXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0YXIubWF0Y2ggPT0gY29tcGFyZV9udW0pe1xyXG5cdFx0XHRcdFx0dGVtcF9uYW1lID0gJyc7XHJcblx0XHRcdFx0XHR0ZW1wID0gJyc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmaW5hbC5wdXNoKG9iaik7XHJcblx0XHRcdFx0dGVtcCA9IG9iai5mcm9tLmlkO1xyXG5cdFx0XHRcdHRlbXBfbmFtZSA9IG9iai5mcm9tLm5hbWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdGNvbXBhcmUub3IgPSBmaW5hbDtcclxuXHRcdGNvbXBhcmUuYW5kID0gY29tcGFyZS5vci5maWx0ZXIoKHZhbCk9PntcclxuXHRcdFx0cmV0dXJuIHZhbC5tYXRjaCA9PSBjb21wYXJlX251bTtcclxuXHRcdH0pO1xyXG5cdFx0Y29tcGFyZS5nZW5lcmF0ZSgpO1xyXG5cdH0sXHJcblx0Z2VuZXJhdGU6ICgpPT57XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGRhdGFfYW5kID0gY29tcGFyZS5hbmQ7XHJcblxyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfYW5kLmVudHJpZXMoKSl7XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcwJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuYW5kIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XHJcblxyXG5cdFx0bGV0IGRhdGFfb3IgPSBjb21wYXJlLm9yO1xyXG5cdFx0bGV0IHRib2R5MiA9ICcnO1xyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX29yLmVudHJpZXMoKSl7XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keTIgKz0gdHI7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUub3IgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5Mik7XHJcblx0XHRcclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydhbmQnLCdvciddO1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0XHRsZXQgdGFibGUgPSAkKCcudGFibGVzIC4nK2krJyB0YWJsZScpLkRhdGFUYWJsZSgpO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBjaG9vc2UgPSB7XHJcblx0ZGF0YTogW10sXHJcblx0YXdhcmQ6IFtdLFxyXG5cdG51bTogMCxcclxuXHRkZXRhaWw6IGZhbHNlLFxyXG5cdGxpc3Q6IFtdLFxyXG5cdGluaXQ6IChjdHJsID0gZmFsc2UpPT57XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCl7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbyhjdHJsKTtcclxuXHR9LFxyXG5cdGdvOiAoY3RybCk9PntcclxuXHRcdGxldCBjb21tYW5kID0gdGFiLm5vdztcclxuXHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXS5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhW2NvbW1hbmRdLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHRcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGxldCB0ZW1wQXJyID0gW107XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkuY29sdW1uKDIpLmRhdGEoKS5lYWNoKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCl7XHJcblx0XHRcdFx0bGV0IHdvcmQgPSAkKCcuc2VhcmNoQ29tbWVudCcpLnZhbCgpO1xyXG5cdFx0XHRcdGlmICh2YWx1ZS5pbmRleE9mKHdvcmQpID49IDApIHRlbXBBcnIucHVzaChpbmRleCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBpIG9mIGNob29zZS5hd2FyZCl7XHJcblx0XHRcdGxldCByb3cgPSAodGVtcEFyci5sZW5ndGggPT0gMCkgPyBpOnRlbXBBcnJbaV07XHJcblx0XHRcdGxldCB0YXIgPSAkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLnJvdyhyb3cpLm5vZGUoKS5pbm5lckhUTUw7XHJcblx0XHRcdGluc2VydCArPSAnPHRyPicgKyB0YXIgKyAnPC90cj4nO1xyXG5cdFx0fVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdGlmICghY3RybCl7XHJcblx0XHRcdCQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQvLyBsZXQgdGFyID0gJCh0aGlzKS5maW5kKCd0ZCcpLmVxKDEpO1xyXG5cdFx0XHRcdC8vIGxldCBpZCA9IHRhci5maW5kKCdhJykuYXR0cignYXR0ci1mYmlkJyk7XHJcblx0XHRcdFx0Ly8gdGFyLnByZXBlbmQoYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke2lkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHJcblx0XHRpZihjaG9vc2UuZGV0YWlsKXtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvcihsZXQgayBpbiBjaG9vc2UubGlzdCl7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI3XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXcsIGNvbW1hbmQsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIGVuZFRpbWUpPT57XHJcblx0XHRsZXQgZGF0YSA9IHJhdztcclxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHdvcmQgIT09ICcnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kICE9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBlbmRUaW1lKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnJlYWN0KGRhdGEsIHJlYWN0KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9LFxyXG5cdHVuaXF1ZTogKGRhdGEpPT57XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCB0KT0+e1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XHJcblx0XHRpZiAodGFyID09ICdhbGwnKXtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCk9PntcclxuXHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFiID0ge1xyXG5cdG5vdzogXCJjb21tZW50c1wiLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdHRhYi5ub3cgPSAkKHRoaXMpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0XHRsZXQgdGFyID0gJCh0aGlzKS5pbmRleCgpO1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2JykuZXEodGFyKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpe1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xyXG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcclxuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgIGlmIChkYXRlIDwgMTApe1xyXG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XHJcbiAgICAgfVxyXG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgIGlmIChob3VyIDwgMTApe1xyXG4gICAgIFx0aG91ciA9IFwiMFwiK2hvdXI7XHJcbiAgICAgfVxyXG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgICBpZiAobWluIDwgMTApe1xyXG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xyXG4gICAgIH1cclxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgaWYgKHNlYyA8IDEwKXtcclxuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcclxuICAgICB9XHJcbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XHJcbiAgICAgcmV0dXJuIHRpbWU7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
