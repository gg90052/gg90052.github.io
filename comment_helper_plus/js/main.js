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
	auth: 'user_photos,user_posts,manage_pages',
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
				if (authStr.indexOf('manage_pages') >= 0 && authStr.indexOf('user_posts') >= 0) {
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
							var _i6 = _step5.value;

							fid.push(_i6.from.id);
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
							var _i7 = _step6.value;

							var promise = fb.getName(_i7).then(function (res) {
								var _iteratorNormalCompletion14 = true;
								var _didIteratorError14 = false;
								var _iteratorError14 = undefined;

								try {
									for (var _iterator14 = Object.keys(res)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
										var _i8 = _step14.value;

										names[_i8] = res[_i8];
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

					var postdata = JSON.parse(localStorage.postdata);
					if (command == 'comments') {
						if (postdata.type === 'personal') {
							FB.api("/me", function (res) {
								if (res.name === postdata.owner) {
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
								} else {
									swal({
										title: '個人貼文只有發文者本人能抓',
										html: "\u8CBC\u6587\u5E33\u865F\u540D\u7A31\uFF1A" + postdata.owner + "<br>\u76EE\u524D\u5E33\u865F\u540D\u7A31\uFF1A" + res.name,
										type: 'warning'
									}).done();
								}
							});
						} else if (postdata.type === 'group') {
							var _iteratorNormalCompletion8 = true;
							var _didIteratorError8 = false;
							var _iteratorError8 = undefined;

							try {
								for (var _iterator8 = extend[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
									var i = _step8.value;

									i.message = i.story;
									delete i.story;
									delete i.postlink;
									i.like_count = 'N/A';
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
						} else {
							var _iteratorNormalCompletion9 = true;
							var _didIteratorError9 = false;
							var _iteratorError9 = undefined;

							try {
								for (var _iterator9 = extend[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
									var _i = _step9.value;

									_i.message = _i.story;
									delete _i.story;
									delete _i.postlink;
									_i.like_count = 'N/A';
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
						}
					}

					if (command == 'reactions') {
						if (postdata.type === 'personal') {
							FB.api("/me", function (res) {
								if (res.name === postdata.owner) {
									var _iteratorNormalCompletion10 = true;
									var _didIteratorError10 = false;
									var _iteratorError10 = undefined;

									try {
										for (var _iterator10 = extend[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
											var _i2 = _step10.value;

											delete _i2.story;
											delete _i2.created_time;
											delete _i2.postlink;
											delete _i2.like_count;
											_i2.type = 'LIKE';
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
								} else {
									swal({
										title: '個人貼文只有發文者本人能抓',
										html: "\u8CBC\u6587\u5E33\u865F\u540D\u7A31\uFF1A" + postdata.owner + "<br>\u76EE\u524D\u5E33\u865F\u540D\u7A31\uFF1A" + res.name,
										type: 'warning'
									}).done();
								}
							});
						} else if (postdata.type === 'group') {
							var _iteratorNormalCompletion11 = true;
							var _didIteratorError11 = false;
							var _iteratorError11 = undefined;

							try {
								for (var _iterator11 = extend[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
									var _i3 = _step11.value;

									delete _i3.story;
									delete _i3.created_time;
									delete _i3.postlink;
									delete _i3.like_count;
									_i3.type = 'LIKE';
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
						} else {
							var _iteratorNormalCompletion12 = true;
							var _didIteratorError12 = false;
							var _iteratorError12 = undefined;

							try {
								for (var _iterator12 = extend[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
									var _i4 = _step12.value;

									delete _i4.story;
									delete _i4.created_time;
									delete _i4.postlink;
									delete _i4.like_count;
									_i4.type = 'LIKE';
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
						}
					}

					Promise.all(promise_array).then(function () {
						var _iteratorNormalCompletion13 = true;
						var _didIteratorError13 = false;
						var _iteratorError13 = undefined;

						try {
							for (var _iterator13 = extend[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
								var _i5 = _step13.value;

								_i5.from.name = names[_i5.from.id] ? names[_i5.from.id].name : _i5.from.name;
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
		var _iteratorNormalCompletion15 = true;
		var _didIteratorError15 = false;
		var _iteratorError15 = undefined;

		try {
			var _loop = function _loop() {
				var i = _step15.value;

				temp_data.data = {};
				var promise = data.get(temp_data, i).then(function (res) {
					temp_data.data[i] = res;
				});
				data.promise_array.push(promise);
			};

			for (var _iterator15 = commands[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
				_loop();
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
					var _iteratorNormalCompletion16 = true;
					var _didIteratorError16 = false;
					var _iteratorError16 = undefined;

					try {
						for (var _iterator16 = res.data[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
							var d = _step16.value;

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
					var _iteratorNormalCompletion17 = true;
					var _didIteratorError17 = false;
					var _iteratorError17 = undefined;

					try {
						for (var _iterator17 = res.data[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
							var d = _step17.value;

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
							var _iteratorNormalCompletion18 = true;
							var _didIteratorError18 = false;
							var _iteratorError18 = undefined;

							try {
								for (var _iterator18 = res.data[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
									var _i9 = _step18.value;

									var name = '';
									if (_i9.story) {
										name = _i9.story.substring(0, _i9.story.indexOf(' shared'));
									} else {
										name = _i9.id.substring(0, _i9.id.indexOf("_"));
									}
									var id = _i9.id.substring(0, _i9.id.indexOf("_"));
									_i9.from = { id: id, name: name };
									datas.push(_i9);
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
		var _iteratorNormalCompletion19 = true;
		var _didIteratorError19 = false;
		var _iteratorError19 = undefined;

		try {
			for (var _iterator19 = Object.keys(rawData.data)[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
				var key = _step19.value;

				var isTag = $("#tag").prop("checked");
				if (key === 'reactions') isTag = false;
				var newData = _filter.totalFilter.apply(_filter, [rawData.data[key], key, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
				data.filtered[key] = newData;
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
		var _iteratorNormalCompletion20 = true;
		var _didIteratorError20 = false;
		var _iteratorError20 = undefined;

		try {
			for (var _iterator20 = Object.keys(filtered)[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
				var key = _step20.value;

				var thead = '';
				var tbody = '';
				if (key === 'reactions') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td>\u5FC3\u60C5</td>";
				} else if (key === 'sharedposts') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
				} else {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td>\u8B9A</td>\n\t\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
				}
				var _iteratorNormalCompletion22 = true;
				var _didIteratorError22 = false;
				var _iteratorError22 = undefined;

				try {
					for (var _iterator22 = filtered[key].entries()[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
						var _step22$value = _slicedToArray(_step22.value, 2),
						    j = _step22$value[0],
						    val = _step22$value[1];

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

				var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
				$(".tables ." + key + " table").html('').append(insert);
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
			var _iteratorNormalCompletion21 = true;
			var _didIteratorError21 = false;
			var _iteratorError21 = undefined;

			try {
				var _loop2 = function _loop2() {
					var i = _step21.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator21 = arr[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
					_loop2();
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

		var _iteratorNormalCompletion23 = true;
		var _didIteratorError23 = false;
		var _iteratorError23 = undefined;

		try {
			for (var _iterator23 = Object.keys(compare.raw)[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
				var _key = _step23.value;

				if (_key !== ignore) {
					var _iteratorNormalCompletion26 = true;
					var _didIteratorError26 = false;
					var _iteratorError26 = undefined;

					try {
						for (var _iterator26 = compare.raw[_key][Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
							var _i11 = _step26.value;

							base.push(_i11);
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
				}
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

		var sort = data.raw.extension ? 'name' : 'id';
		base = base.sort(function (a, b) {
			return a.from[sort] > b.from[sort] ? 1 : -1;
		});

		var _iteratorNormalCompletion24 = true;
		var _didIteratorError24 = false;
		var _iteratorError24 = undefined;

		try {
			for (var _iterator24 = base[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
				var _i12 = _step24.value;

				_i12.match = 0;
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

		var temp = '';
		var temp_name = '';
		// console.log(base);
		for (var _i10 in base) {
			var obj = base[_i10];
			if (obj.from.id == temp || data.raw.extension && obj.from.name == temp_name) {
				var tar = final[final.length - 1];
				tar.match++;
				var _iteratorNormalCompletion25 = true;
				var _didIteratorError25 = false;
				var _iteratorError25 = undefined;

				try {
					for (var _iterator25 = Object.keys(obj)[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
						var key = _step25.value;

						if (!tar[key]) tar[key] = obj[key]; //合併資料
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
		var _iteratorNormalCompletion27 = true;
		var _didIteratorError27 = false;
		var _iteratorError27 = undefined;

		try {
			for (var _iterator27 = data_and.entries()[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
				var _step27$value = _slicedToArray(_step27.value, 2),
				    j = _step27$value[0],
				    val = _step27$value[1];

				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '0') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
			}
		} catch (err) {
			_didIteratorError27 = true;
			_iteratorError27 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion27 && _iterator27.return) {
					_iterator27.return();
				}
			} finally {
				if (_didIteratorError27) {
					throw _iteratorError27;
				}
			}
		}

		$(".tables .total .table_compare.and tbody").html('').append(tbody);

		var data_or = compare.or;
		var tbody2 = '';
		var _iteratorNormalCompletion28 = true;
		var _didIteratorError28 = false;
		var _iteratorError28 = undefined;

		try {
			for (var _iterator28 = data_or.entries()[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
				var _step28$value = _slicedToArray(_step28.value, 2),
				    j = _step28$value[0],
				    val = _step28$value[1];

				var _td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var _tr = "<tr>" + _td + "</tr>";
				tbody2 += _tr;
			}
		} catch (err) {
			_didIteratorError28 = true;
			_iteratorError28 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion28 && _iterator28.return) {
					_iterator28.return();
				}
			} finally {
				if (_didIteratorError28) {
					throw _iteratorError28;
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
			var _iteratorNormalCompletion29 = true;
			var _didIteratorError29 = false;
			var _iteratorError29 = undefined;

			try {
				var _loop3 = function _loop3() {
					var i = _step29.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator29 = arr[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
					_loop3();
				}
			} catch (err) {
				_didIteratorError29 = true;
				_iteratorError29 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion29 && _iterator29.return) {
						_iterator29.return();
					}
				} finally {
					if (_didIteratorError29) {
						throw _iteratorError29;
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
		var _iteratorNormalCompletion30 = true;
		var _didIteratorError30 = false;
		var _iteratorError30 = undefined;

		try {
			for (var _iterator30 = choose.award[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
				var _i13 = _step30.value;

				var row = tempArr.length == 0 ? _i13 : tempArr[_i13];
				var _tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
				insert += '<tr>' + _tar + '</tr>';
			}
		} catch (err) {
			_didIteratorError30 = true;
			_iteratorError30 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion30 && _iterator30.return) {
					_iterator30.return();
				}
			} finally {
				if (_didIteratorError30) {
					throw _iteratorError30;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJoYXNoIiwibG9jYXRpb24iLCJpbmRleE9mIiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInNlc3Npb25TdG9yYWdlIiwiYWxlcnQiLCJocmVmIiwibGFzdERhdGEiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwiZGF0YSIsImZpbmlzaCIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJlIiwiZ2V0QXV0aCIsImN0cmxLZXkiLCJhbHRLZXkiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGlrZXMiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJvcmRlciIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJuZXh0IiwidHlwZSIsIkZCIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJmYmlkIiwiUHJvbWlzZSIsImFsbCIsImdldE1lIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsIm9wdGlvbnMiLCJpIiwiaiIsImlkIiwibmFtZSIsImh0bWwiLCJvcHRpb25EaXNwbGF5IiwiY2hlY2tib3giLCJwcm9wIiwic2VsZWN0UGFnZSIsInRhciIsImF0dHIiLCJzZXRUb2tlbiIsInN0ZXAiLCJzdGVwMSIsInBhZ2VpZCIsInBhZ2VzIiwiYWNjZXNzX3Rva2VuIiwiaGlkZGVuU3RhcnQiLCJwYWdlSUQiLCJzcGxpdCIsImFwaSIsImVycm9yIiwiY2xlYXIiLCJlbXB0eSIsImZpbmQiLCJjb21tYW5kIiwicGFnaW5nIiwic3RyIiwiZ2VuRGF0YSIsIm1lc3NhZ2UiLCJyZWNvbW1hbmQiLCJnZW5DYXJkIiwib2JqIiwiaWRzIiwibGluayIsIm1lc3MiLCJyZXBsYWNlIiwidGltZUNvbnZlcnRlciIsImNyZWF0ZWRfdGltZSIsInNyYyIsImZ1bGxfcGljdHVyZSIsInJlc29sdmUiLCJyZWplY3QiLCJhcnIiLCJleHRlbnNpb25BdXRoIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJzZXRJdGVtIiwiZXh0ZW5kIiwiZmlkIiwicHVzaCIsImZyb20iLCJwcm9taXNlX2FycmF5IiwibmFtZXMiLCJwcm9taXNlIiwiZ2V0TmFtZSIsIk9iamVjdCIsImtleXMiLCJwb3N0ZGF0YSIsIm93bmVyIiwic3RvcnkiLCJwb3N0bGluayIsImxpa2VfY291bnQiLCJ0aXRsZSIsInRvU3RyaW5nIiwic2Nyb2xsVG9wIiwic3RlcDIiLCJmaWx0ZXJlZCIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInRlc3QiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImZ1bGxJRCIsImNvbW1hbmRzIiwidGVtcF9kYXRhIiwiZ2V0IiwiZGF0YXMiLCJzaGFyZUVycm9yIiwiZ2V0U2hhcmUiLCJkIiwidXBkYXRlZF90aW1lIiwiZ2V0TmV4dCIsImdldEpTT04iLCJmYWlsIiwiYWZ0ZXIiLCJzdWJzdHJpbmciLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsImtleSIsImlzVGFnIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwibmV3T2JqIiwiZWFjaCIsInRtcCIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsInBpYyIsInRoZWFkIiwidGJvZHkiLCJlbnRyaWVzIiwicGljdHVyZSIsInRkIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYW5kIiwib3IiLCJpZ25vcmUiLCJiYXNlIiwiZmluYWwiLCJjb21wYXJlX251bSIsInNvcnQiLCJhIiwiYiIsIm1hdGNoIiwidGVtcCIsInRlbXBfbmFtZSIsImRhdGFfYW5kIiwiZGF0YV9vciIsInRib2R5MiIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsImN0cmwiLCJuIiwicGFyc2VJbnQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsInRlbXBBcnIiLCJjb2x1bW4iLCJpbmRleCIsInJvdyIsIm5vZGUiLCJpbm5lckhUTUwiLCJrIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0IiwiZm9yRWFjaCIsIml0ZW0iLCJuZXdBcnkiLCJncmVwIiwibWVzc2FnZV90YWdzIiwidCIsInRpbWVfYXJ5IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwidWkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJtYXAiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFlQyxTQUFmOztBQUVBLFNBQVNBLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXVCQyxHQUF2QixFQUEyQkMsQ0FBM0IsRUFDQTtBQUNDLEtBQUksQ0FBQ04sWUFBTCxFQUFrQjtBQUNqQk8sVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWdELDRCQUFoRDtBQUNBQyxJQUFFLGlCQUFGLEVBQXFCQyxNQUFyQjtBQUNBVixpQkFBZSxJQUFmO0FBQ0E7QUFDRCxRQUFPLEtBQVA7QUFDQTtBQUNEUyxFQUFFRSxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUMzQixLQUFJQyxXQUFXLENBQWY7QUFDQUosR0FBRSxRQUFGLEVBQVlLLEtBQVosQ0FBa0IsWUFBVTtBQUMzQkQ7QUFDQSxNQUFJQSxZQUFZLENBQWhCLEVBQWtCO0FBQ2pCSixLQUFFLFFBQUYsRUFBWU0sR0FBWixDQUFnQixPQUFoQjtBQUNBTixLQUFFLDBCQUFGLEVBQThCTyxXQUE5QixDQUEwQyxNQUExQztBQUNBO0FBQ0QsRUFORDs7QUFRQSxLQUFJQyxPQUFPQyxTQUFTRCxJQUFwQjtBQUNBLEtBQUlBLEtBQUtFLE9BQUwsQ0FBYSxPQUFiLEtBQXlCLENBQTdCLEVBQStCO0FBQzlCQyxlQUFh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LENBQWxCLEVBQThCO0FBQzFCcUosVUFBTyxNQUFNOEMsUUFBUW5NLENBQVIsRUFBV29KLEtBQVgsQ0FBTixHQUEwQixJQUFqQztBQUNIOztBQUVEQyxNQUFJZ0QsS0FBSixDQUFVLENBQVYsRUFBYWhELElBQUlsTSxNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQWlQLFNBQU8vQyxNQUFNLE1BQWI7QUFDSDs7QUFFRCxLQUFJK0MsT0FBTyxFQUFYLEVBQWU7QUFDWGpTLFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJbVMsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWUwsWUFBWTdKLE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUltSyxNQUFNLHVDQUF1Q0MsVUFBVUosR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUlsSyxPQUFPM0ksU0FBU2tULGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBdkssTUFBSzlILElBQUwsR0FBWW1TLEdBQVo7O0FBRUE7QUFDQXJLLE1BQUt3SyxLQUFMLEdBQWEsbUJBQWI7QUFDQXhLLE1BQUt5SyxRQUFMLEdBQWdCTCxXQUFXLE1BQTNCOztBQUVBO0FBQ0EvUyxVQUFTcVQsSUFBVCxDQUFjQyxXQUFkLENBQTBCM0ssSUFBMUI7QUFDQUEsTUFBS3hJLEtBQUw7QUFDQUgsVUFBU3FULElBQVQsQ0FBY0UsV0FBZCxDQUEwQjVLLElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0bGV0IGhpZGVhcmVhID0gMDtcclxuXHQkKCdoZWFkZXInKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aGlkZWFyZWErKztcclxuXHRcdGlmIChoaWRlYXJlYSA+PSA1KXtcclxuXHRcdFx0JCgnaGVhZGVyJykub2ZmKCdjbGljaycpO1xyXG5cdFx0XHQkKCcjZmJpZF9idXR0b24sICNwdXJlX2ZiaWQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImNsZWFyXCIpID49IDApe1xyXG5cdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3JhdycpO1xyXG5cdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnbG9naW4nKTtcclxuXHRcdGFsZXJ0KCflt7LmuIXpmaTmmqvlrZjvvIzoq4vph43mlrDpgLLooYznmbvlhaUnKTtcclxuXHRcdGxvY2F0aW9uLmhyZWYgPSAnaHR0cHM6Ly9nZzkwMDUyLmdpdGh1Yi5pby9jb21tZW50X2hlbHBlcl9wbHVzJztcclxuXHR9XHJcblx0bGV0IGxhc3REYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJhd1wiKSk7XHJcblxyXG5cdGlmIChsYXN0RGF0YSl7XHJcblx0XHRkYXRhLmZpbmlzaChsYXN0RGF0YSk7XHJcblx0fVxyXG5cdGlmIChzZXNzaW9uU3RvcmFnZS5sb2dpbil7XHJcblx0XHRmYi5nZW5PcHRpb24oSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbikpO1xyXG5cdH1cclxuXHJcblx0Ly8gJChcIi50YWJsZXMgPiAuc2hhcmVkcG9zdHMgYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdC8vIFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0Ly8gXHRcdGZiLmV4dGVuc2lvbkF1dGgoJ2ltcG9ydCcpO1xyXG5cdC8vIFx0fWVsc2V7XHJcblx0Ly8gXHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9KTtcclxuXHRcclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX3N0YXJ0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHRjaG9vc2UuaW5pdCh0cnVlKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8ICFlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi50YWJsZXMgLmZpbHRlcnMgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5jb21wYXJlX2NvbmRpdGlvbicpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuJysgJCh0aGlzKS52YWwoKSkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XHJcblx0XHRcInNpbmdsZURhdGVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS1NTS1ERCAgIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSxmdW5jdGlvbihzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShub3dEYXRlKCkpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGlmIChlLmN0cmxLZXkpe1xyXG5cdFx0XHRsZXQgZGQ7XHJcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGFbdGFiLm5vd10pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBkZDtcclxuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XHJcblx0XHRcdHdpbmRvdy5mb2N1cygpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApe1xyXG5cdFx0XHRcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGFbdGFiLm5vd10pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpe1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZihlLmN0cmxLZXkpe1xyXG5cdFx0XHRmYi5nZXRBdXRoKCdzaGFyZWRwb3N0cycpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UnLCdmcm9tJywnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFsnY3JlYXRlZF90aW1lJywnZnJvbScsJ21lc3NhZ2UnLCdzdG9yeSddLFxyXG5cdFx0bGlrZXM6IFsnbmFtZSddXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJyxcclxuXHRcdGxpa2VzOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi4xMicsXHJcblx0XHRyZWFjdGlvbnM6ICd2Mi4xMicsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YyLjEyJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjEyJyxcclxuXHRcdGZlZWQ6ICd2Mi4xMicsXHJcblx0XHRncm91cDogJ3YyLjEyJyxcclxuXHRcdG5ld2VzdDogJ3YyLjEyJ1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0b3JkZXI6ICcnLFxyXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLG1hbmFnZV9wYWdlcycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0bmV4dDogJycsXHJcblx0Z2V0QXV0aDogKHR5cGUpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRcdGZiLnN0YXJ0KCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5o6I5qyK5aSx5pWX77yM6KuL57Wm5LqI5omA5pyJ5qyK6ZmQJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKCk9PntcclxuXHRcdFByb21pc2UuYWxsKFtmYi5nZXRNZSgpLGZiLmdldFBhZ2UoKSwgZmIuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0c2Vzc2lvblN0b3JhZ2UubG9naW4gPSBKU09OLnN0cmluZ2lmeShyZXMpO1xyXG5cdFx0XHRmYi5nZW5PcHRpb24ocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2VuT3B0aW9uOiAocmVzKT0+e1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IG9wdGlvbnMgPSBgPGlucHV0IGlkPVwicHVyZV9mYmlkXCIgY2xhc3M9XCJoaWRlXCI+PGJ1dHRvbiBpZD1cImZiaWRfYnV0dG9uXCIgY2xhc3M9XCJidG4gaGlkZVwiIG9uY2xpY2s9XCJmYi5oaWRkZW5TdGFydCgpXCI+55SxRkJJROaTt+WPljwvYnV0dG9uPjxsYWJlbD48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25jaGFuZ2U9XCJmYi5vcHRpb25EaXNwbGF5KHRoaXMpXCI+6Zqx6JeP5YiX6KGoPC9sYWJlbD48YnI+YDtcclxuXHRcdGxldCB0eXBlID0gLTE7XHJcblx0XHQkKCcjYnRuX3N0YXJ0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdGZvcihsZXQgaSBvZiByZXMpe1xyXG5cdFx0XHR0eXBlKys7XHJcblx0XHRcdGZvcihsZXQgaiBvZiBpKXtcclxuXHRcdFx0XHRvcHRpb25zICs9IGA8ZGl2IGNsYXNzPVwicGFnZV9idG5cIiBhdHRyLXR5cGU9XCIke3R5cGV9XCIgYXR0ci12YWx1ZT1cIiR7ai5pZH1cIiBvbmNsaWNrPVwiZmIuc2VsZWN0UGFnZSh0aGlzKVwiPiR7ai5uYW1lfTwvZGl2PmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJyNlbnRlclVSTCcpLmh0bWwob3B0aW9ucykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9LFxyXG5cdG9wdGlvbkRpc3BsYXk6IChjaGVja2JveCk9PntcclxuXHRcdGlmICgkKGNoZWNrYm94KS5wcm9wKCdjaGVja2VkJykpe1xyXG5cdFx0XHQkKCcucGFnZV9idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQoJy5wYWdlX2J0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzZWxlY3RQYWdlOiAoZSk9PntcclxuXHRcdCQoJyNlbnRlclVSTCAucGFnZV9idG4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgdGFyID0gJChlKTtcclxuXHRcdHRhci5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRpZiAodGFyLmF0dHIoJ2F0dHItdHlwZScpID09IDEpe1xyXG5cdFx0XHRmYi5zZXRUb2tlbih0YXIuYXR0cignYXR0ci12YWx1ZScpKTtcclxuXHRcdH1cclxuXHRcdGZiLmZlZWQodGFyLmF0dHIoJ2F0dHItdmFsdWUnKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0KTtcclxuXHRcdHN0ZXAuc3RlcDEoKTtcclxuXHR9LFxyXG5cdHNldFRva2VuOiAocGFnZWlkKT0+e1xyXG5cdFx0bGV0IHBhZ2VzID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbilbMV07XHJcblx0XHRmb3IobGV0IGkgb2YgcGFnZXMpe1xyXG5cdFx0XHRpZiAoaS5pZCA9PSBwYWdlaWQpe1xyXG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSBpLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0aGlkZGVuU3RhcnQ6ICgpPT57XHJcblx0XHRsZXQgZmJpZCA9ICQoJyNwdXJlX2ZiaWQnKS52YWwoKTtcclxuXHRcdGxldCBwYWdlSUQgPSBmYmlkLnNwbGl0KCdfJylbMF07XHJcblx0XHRGQi5hcGkoYC8ke3BhZ2VJRH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0aWYgKHJlcy5lcnJvcil7XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pe1xyXG5cdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmVlZDogKHBhZ2VJRCwgdHlwZSwgdXJsID0gJycsIGNsZWFyID0gdHJ1ZSk9PntcclxuXHRcdGlmIChjbGVhcil7XHJcblx0XHRcdCQoJy5yZWNvbW1hbmRzLCAuZmVlZHMgdGJvZHknKS5lbXB0eSgpO1xyXG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy5mZWVkcyAuYnRuJykub2ZmKCdjbGljaycpLmNsaWNrKCgpPT57XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoJyNlbnRlclVSTCBzZWxlY3QnKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKTtcclxuXHRcdFx0XHRmYi5mZWVkKHRhci52YWwoKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0LCBmYWxzZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGNvbW1hbmQgPSAodHlwZSA9PSAnMicpID8gJ2ZlZWQnOidwb3N0cyc7XHJcblx0XHRsZXQgYXBpO1xyXG5cdFx0aWYgKHVybCA9PSAnJyl7XHJcblx0XHRcdGFwaSA9IGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlSUR9LyR7Y29tbWFuZH0/ZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTI1YDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRhcGkgPSB1cmw7XHJcblx0XHR9XHJcblx0XHRGQi5hcGkoYXBpLCAocmVzKT0+e1xyXG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID09IDApe1xyXG5cdFx0XHRcdCQoJy5mZWVkcyAuYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmYi5uZXh0ID0gcmVzLnBhZ2luZy5uZXh0O1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdGxldCBzdHIgPSBnZW5EYXRhKGkpO1xyXG5cdFx0XHRcdCQoJy5zZWN0aW9uIC5mZWVkcyB0Ym9keScpLmFwcGVuZChzdHIpO1xyXG5cdFx0XHRcdGlmIChpLm1lc3NhZ2UgJiYgaS5tZXNzYWdlLmluZGV4T2YoJ+aKvScpID49IDApe1xyXG5cdFx0XHRcdFx0bGV0IHJlY29tbWFuZCA9IGdlbkNhcmQoaSk7XHJcblx0XHRcdFx0XHQkKCcuZG9uYXRlX2FyZWEgLnJlY29tbWFuZHMnKS5hcHBlbmQocmVjb21tYW5kKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdlbkRhdGEob2JqKXtcclxuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XHJcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xyXG5cclxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0bGV0IHN0ciA9IGA8dHI+XHJcblx0XHRcdFx0XHRcdDx0ZD48ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgIG9uY2xpY2s9XCJkYXRhLnN0YXJ0KCcke29iai5pZH0nKVwiPumWi+WnizwvZGl2PjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bWVzc308L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKG9iai5jcmVhdGVkX3RpbWUpfTwvdGQ+XHJcblx0XHRcdFx0XHRcdDwvdHI+YDtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGdlbkNhcmQob2JqKXtcclxuXHRcdFx0bGV0IHNyYyA9IG9iai5mdWxsX3BpY3R1cmUgfHwgJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzAweDIyNSc7XHJcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xyXG5cdFx0XHRsZXQgbGluayA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJytpZHNbMF0rJy9wb3N0cy8nK2lkc1sxXTtcclxuXHRcdFx0XHJcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XHJcblx0XHRcdGxldFx0c3RyID0gYDxkaXYgY2xhc3M9XCJjYXJkXCI+XHJcblx0XHRcdDxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWltYWdlXCI+XHJcblx0XHRcdDxmaWd1cmUgY2xhc3M9XCJpbWFnZSBpcy00YnkzXCI+XHJcblx0XHRcdDxpbWcgc3JjPVwiJHtzcmN9XCIgYWx0PVwiXCI+XHJcblx0XHRcdDwvZmlndXJlPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9hPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1jb250ZW50XCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcblx0XHRcdCR7bWVzc31cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+XHJcblx0XHRcdDwvZGl2PmA7XHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRNZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XHJcblx0XHRcdFx0bGV0IGFyciA9IFtyZXNdO1xyXG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQXV0aDogKGNvbW1hbmQgPSAnJyk9PntcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlLCBjb21tYW5kKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkNhbGxiYWNrOiAocmVzcG9uc2UsIGNvbW1hbmQgPSAnJyk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRkYXRhLnJhdy5leHRlbnNpb24gPSB0cnVlO1xyXG5cdFx0XHRcdGlmIChjb21tYW5kID09ICdpbXBvcnQnKXtcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2hhcmVkcG9zdHNcIiwgJCgnI2ltcG9ydCcpLnZhbCgpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IGV4dGVuZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaGFyZWRwb3N0c1wiKSk7XHJcblx0XHRcdFx0bGV0IGZpZCA9IFtdO1xyXG5cdFx0XHRcdGxldCBpZHMgPSBbXTtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdGZpZC5wdXNoKGkuZnJvbS5pZCk7XHJcblx0XHRcdFx0XHRpZiAoZmlkLmxlbmd0aCA+PTQ1KXtcclxuXHRcdFx0XHRcdFx0aWRzLnB1c2goZmlkKTtcclxuXHRcdFx0XHRcdFx0ZmlkID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlkcy5wdXNoKGZpZCk7XHJcblx0XHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXSwgbmFtZXMgPSB7fTtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgaWRzKXtcclxuXHRcdFx0XHRcdGxldCBwcm9taXNlID0gZmIuZ2V0TmFtZShpKS50aGVuKChyZXMpPT57XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBPYmplY3Qua2V5cyhyZXMpKXtcclxuXHRcdFx0XHRcdFx0XHRuYW1lc1tpXSA9IHJlc1tpXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRwcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBwb3N0ZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnBvc3RkYXRhKTtcclxuXHRcdFx0XHRpZiAoY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0XHRcdGlmIChwb3N0ZGF0YS50eXBlID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHRcdEZCLmFwaShcIi9tZVwiLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlcy5uYW1lID09PSBwb3N0ZGF0YS5vd25lcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGkubWVzc2FnZSA9IGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0aS5saWtlX2NvdW50ID0gJ04vQSc7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6ICflgIvkurrosrzmloflj6rmnInnmbzmlofogIXmnKzkurrog73mipMnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRodG1sOiBg6LK85paH5biz6Jmf5ZCN56ix77yaJHtwb3N0ZGF0YS5vd25lcn08YnI+55uu5YmN5biz6Jmf5ZCN56ix77yaJHtyZXMubmFtZX1gLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fWVsc2UgaWYocG9zdGRhdGEudHlwZSA9PT0gJ2dyb3VwJyl7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGkubWVzc2FnZSA9IGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0aS5saWtlX2NvdW50ID0gJ04vQSc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRpLm1lc3NhZ2UgPSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGkubGlrZV9jb3VudCA9ICdOL0EnO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRpZiAocG9zdGRhdGEudHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0XHRGQi5hcGkoXCIvbWVcIiwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXMubmFtZSA9PT0gcG9zdGRhdGEub3duZXIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuY3JlYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aS50eXBlID0gJ0xJS0UnO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAn5YCL5Lq66LK85paH5Y+q5pyJ55m85paH6ICF5pys5Lq66IO95oqTJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aHRtbDogYOiyvOaWh+W4s+iZn+WQjeeose+8miR7cG9zdGRhdGEub3duZXJ9PGJyPuebruWJjeW4s+iZn+WQjeeose+8miR7cmVzLm5hbWV9YCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1lbHNlIGlmKHBvc3RkYXRhLnR5cGUgPT09ICdncm91cCcpe1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5jcmVhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0XHRpLnR5cGUgPSAnTElLRSc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5jcmVhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0XHRpLnR5cGUgPSAnTElLRSc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFByb21pc2UuYWxsKHByb21pc2VfYXJyYXkpLnRoZW4oKCk9PntcclxuXHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRpLmZyb20ubmFtZSA9IG5hbWVzW2kuZnJvbS5pZF0gPyBuYW1lc1tpLmZyb20uaWRdLm5hbWUgOiBpLmZyb20ubmFtZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGRhdGEucmF3LmRhdGFbY29tbWFuZF0gPSBleHRlbmQ7XHJcblx0XHRcdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldE5hbWU6IChpZHMpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vP2lkcz0ke2lkcy50b1N0cmluZygpfWAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5sZXQgc3RlcCA9IHtcclxuXHRzdGVwMTogKCk9PntcclxuXHRcdCQoJy5zZWN0aW9uJykucmVtb3ZlQ2xhc3MoJ3N0ZXAyJyk7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XHJcblx0fSxcclxuXHRzdGVwMjogKCk9PntcclxuXHRcdCQoJy5yZWNvbW1hbmRzLCAuZmVlZHMgdGJvZHknKS5lbXB0eSgpO1xyXG5cdFx0JCgnLnNlY3Rpb24nKS5hZGRDbGFzcygnc3RlcDInKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzoge30sXHJcblx0ZmlsdGVyZWQ6IHt9LFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cHJvbWlzZV9hcnJheTogW10sXHJcblx0dGVzdDogKGlkKT0+e1xyXG5cdFx0Y29uc29sZS5sb2coaWQpO1xyXG5cdH0sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRkYXRhLnByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdGRhdGEucmF3ID0gW107XHJcblx0fSxcclxuXHRzdGFydDogKGZiaWQpPT57XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdGxldCBvYmogPSB7XHJcblx0XHRcdGZ1bGxJRDogZmJpZFxyXG5cdFx0fVxyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGxldCBjb21tYW5kcyA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnLCdzaGFyZWRwb3N0cyddO1xyXG5cdFx0bGV0IHRlbXBfZGF0YSA9IG9iajtcclxuXHRcdGZvcihsZXQgaSBvZiBjb21tYW5kcyl7XHJcblx0XHRcdHRlbXBfZGF0YS5kYXRhID0ge307XHJcblx0XHRcdGxldCBwcm9taXNlID0gZGF0YS5nZXQodGVtcF9kYXRhLCBpKS50aGVuKChyZXMpPT57XHJcblx0XHRcdFx0dGVtcF9kYXRhLmRhdGFbaV0gPSByZXM7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRkYXRhLnByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdH1cclxuXHJcblx0XHRQcm9taXNlLmFsbChkYXRhLnByb21pc2VfYXJyYXkpLnRoZW4oKCk9PntcclxuXHRcdFx0ZGF0YS5maW5pc2godGVtcF9kYXRhKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCwgY29tbWFuZCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IHNoYXJlRXJyb3IgPSAwO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0aWYgKGNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdGdldFNoYXJlKCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtjb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtjb21tYW5kXX0mb3JkZXI9Y2hyb25vbG9naWNhbCZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufSZmaWVsZHM9JHtjb25maWcuZmllbGRbY29tbWFuZF0udG9TdHJpbmcoKX1gLChyZXMpPT57XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGQuZnJvbSl7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XHJcblx0XHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKXtcclxuXHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0PTApe1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCl7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywnbGltaXQ9JytsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGQuZnJvbSl7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XHJcblx0XHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKXtcclxuXHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpPT57XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0U2hhcmUoYWZ0ZXI9Jycpe1xyXG5cdFx0XHRcdGxldCB1cmwgPSBgaHR0cHM6Ly9hbTY2YWhndHA4LmV4ZWN1dGUtYXBpLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vc2hhcmU/ZmJpZD0ke2ZiaWQuZnVsbElEfSZhZnRlcj0ke2FmdGVyfWA7XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGlmIChyZXMgPT09ICdlbmQnKXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvck1lc3NhZ2Upe1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZihyZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdFx0Ly8gc2hhcmVFcnJvciA9IDA7XHJcblx0XHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0XHRcdGxldCBuYW1lID0gJyc7XHJcblx0XHRcdFx0XHRcdFx0XHRpZihpLnN0b3J5KXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZSA9IGkuc3Rvcnkuc3Vic3RyaW5nKDAsIGkuc3RvcnkuaW5kZXhPZignIHNoYXJlZCcpKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lID0gaS5pZC5zdWJzdHJpbmcoMCwgaS5pZC5pbmRleE9mKFwiX1wiKSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgaWQgPSBpLmlkLnN1YnN0cmluZygwLCBpLmlkLmluZGV4T2YoXCJfXCIpKTtcclxuXHRcdFx0XHRcdFx0XHRcdGkuZnJvbSA9IHtpZCwgbmFtZX07XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGkpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRnZXRTaGFyZShyZXMuYWZ0ZXIpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZmJpZCk9PntcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0c3RlcC5zdGVwMigpO1xyXG5cdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHQkKCcucmVzdWx0X2FyZWEgPiAudGl0bGUgc3BhbicpLnRleHQoZmJpZC5mdWxsSUQpO1xyXG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyYXdcIiwgSlNPTi5zdHJpbmdpZnkoZmJpZCkpO1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH0sXHJcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSk9PntcclxuXHRcdGRhdGEuZmlsdGVyZWQgPSB7fTtcclxuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocmF3RGF0YS5kYXRhKSl7XHJcblx0XHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0XHRpZiAoa2V5ID09PSAncmVhY3Rpb25zJykgaXNUYWcgPSBmYWxzZTtcclxuXHRcdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YS5kYXRhW2tleV0sIGtleSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1x0XHJcblx0XHRcdGRhdGEuZmlsdGVyZWRba2V5XSA9IG5ld0RhdGE7XHJcblx0XHR9XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpe1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbHRlcmVkKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gZGF0YS5maWx0ZXJlZDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4Y2VsOiAocmF3KT0+e1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKXtcclxuXHRcdFx0JC5lYWNoKHJhdyxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIiA6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi6Kmy5YiG5Lqr6K6a5pW4XCIgOiB0aGlzLmxpa2VfY291bnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JC5lYWNoKHJhdyxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLlv4Pmg4VcIiA6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCIgOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKT0+e1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9PntcclxuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJlZCA9IHJhd2RhdGE7XHJcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoZmlsdGVyZWQpKXtcclxuXHRcdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0XHRpZihrZXkgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5b+D5oOFPC90ZD5gO1xyXG5cdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmVkW2tleV0uZW50cmllcygpKXtcclxuXHRcdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRcdGlmIChwaWMpe1xyXG5cdFx0XHRcdFx0Ly8gcGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtwaWN0dXJlfSR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5gO1xyXG5cdFx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdFx0fWVsc2UgaWYoa2V5ID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8IHZhbC5zdG9yeX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdFx0JChcIi50YWJsZXMgLlwiK2tleStcIiB0YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0YWN0aXZlKCk7XHJcblx0XHR0YWIuaW5pdCgpO1xyXG5cdFx0Y29tcGFyZS5pbml0KCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IGFyciA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnLCdzaGFyZWRwb3N0cyddO1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0XHRsZXQgdGFibGUgPSAkKCcudGFibGVzIC4nK2krJyB0YWJsZScpLkRhdGFUYWJsZSgpO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpPT57XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY29tcGFyZSA9IHtcclxuXHRhbmQ6IFtdLFxyXG5cdG9yOiBbXSxcclxuXHRyYXc6IFtdLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHRjb21wYXJlLmFuZCA9IFtdO1xyXG5cdFx0Y29tcGFyZS5vciA9IFtdO1xyXG5cdFx0Y29tcGFyZS5yYXcgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRsZXQgaWdub3JlID0gJCgnLnRhYmxlcyAudG90YWwgLmZpbHRlcnMgc2VsZWN0JykudmFsKCk7XHJcblx0XHRsZXQgYmFzZSA9IFtdO1xyXG5cdFx0bGV0IGZpbmFsID0gW107XHJcblx0XHRsZXQgY29tcGFyZV9udW0gPSAxO1xyXG5cdFx0aWYgKGlnbm9yZSA9PT0gJ2lnbm9yZScpIGNvbXBhcmVfbnVtID0gMjtcclxuXHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhjb21wYXJlLnJhdykpe1xyXG5cdFx0XHRpZiAoa2V5ICE9PSBpZ25vcmUpe1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBjb21wYXJlLnJhd1trZXldKXtcclxuXHRcdFx0XHRcdGJhc2UucHVzaChpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGxldCBzb3J0ID0gKGRhdGEucmF3LmV4dGVuc2lvbikgPyAnbmFtZSc6J2lkJztcclxuXHRcdGJhc2UgPSBiYXNlLnNvcnQoKGEsYik9PntcclxuXHRcdFx0cmV0dXJuIGEuZnJvbVtzb3J0XSA+IGIuZnJvbVtzb3J0XSA/IDE6LTE7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmb3IobGV0IGkgb2YgYmFzZSl7XHJcblx0XHRcdGkubWF0Y2ggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRsZXQgdGVtcF9uYW1lID0gJyc7XHJcblx0XHQvLyBjb25zb2xlLmxvZyhiYXNlKTtcclxuXHRcdGZvcihsZXQgaSBpbiBiYXNlKXtcclxuXHRcdFx0bGV0IG9iaiA9IGJhc2VbaV07XHJcblx0XHRcdGlmIChvYmouZnJvbS5pZCA9PSB0ZW1wIHx8IChkYXRhLnJhdy5leHRlbnNpb24gJiYgKG9iai5mcm9tLm5hbWUgPT0gdGVtcF9uYW1lKSkpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSBmaW5hbFtmaW5hbC5sZW5ndGgtMV07XHJcblx0XHRcdFx0dGFyLm1hdGNoKys7XHJcblx0XHRcdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSl7XHJcblx0XHRcdFx0XHRpZiAoIXRhcltrZXldKSB0YXJba2V5XSA9IG9ialtrZXldOyAvL+WQiOS9teizh+aWmVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGFyLm1hdGNoID09IGNvbXBhcmVfbnVtKXtcclxuXHRcdFx0XHRcdHRlbXBfbmFtZSA9ICcnO1xyXG5cdFx0XHRcdFx0dGVtcCA9ICcnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmluYWwucHVzaChvYmopO1xyXG5cdFx0XHRcdHRlbXAgPSBvYmouZnJvbS5pZDtcclxuXHRcdFx0XHR0ZW1wX25hbWUgPSBvYmouZnJvbS5uYW1lO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0XHJcblx0XHRjb21wYXJlLm9yID0gZmluYWw7XHJcblx0XHRjb21wYXJlLmFuZCA9IGNvbXBhcmUub3IuZmlsdGVyKCh2YWwpPT57XHJcblx0XHRcdHJldHVybiB2YWwubWF0Y2ggPT0gY29tcGFyZV9udW07XHJcblx0XHR9KTtcclxuXHRcdGNvbXBhcmUuZ2VuZXJhdGUoKTtcclxuXHR9LFxyXG5cdGdlbmVyYXRlOiAoKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBkYXRhX2FuZCA9IGNvbXBhcmUuYW5kO1xyXG5cclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX2FuZC5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnMCd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLmFuZCB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cclxuXHRcdGxldCBkYXRhX29yID0gY29tcGFyZS5vcjtcclxuXHRcdGxldCB0Ym9keTIgPSAnJztcclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9vci5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+JHt2YWwudHlwZSB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkyICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLm9yIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keTIpO1xyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IGFyciA9IFsnYW5kJywnb3InXTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoY3RybCA9IGZhbHNlKT0+e1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApe1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oY3RybCk7XHJcblx0fSxcclxuXHRnbzogKGN0cmwpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9IHRhYi5ub3c7XHJcblx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YVtjb21tYW5kXS5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1x0XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRsZXQgdGVtcEFyciA9IFtdO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLmNvbHVtbigyKS5kYXRhKCkuZWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpe1xyXG5cdFx0XHRcdGxldCB3b3JkID0gJCgnLnNlYXJjaENvbW1lbnQnKS52YWwoKTtcclxuXHRcdFx0XHRpZiAodmFsdWUuaW5kZXhPZih3b3JkKSA+PSAwKSB0ZW1wQXJyLnB1c2goaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiBjaG9vc2UuYXdhcmQpe1xyXG5cdFx0XHRsZXQgcm93ID0gKHRlbXBBcnIubGVuZ3RoID09IDApID8gaTp0ZW1wQXJyW2ldO1xyXG5cdFx0XHRsZXQgdGFyID0gJCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5yb3cocm93KS5ub2RlKCkuaW5uZXJIVE1MO1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0cj4nICsgdGFyICsgJzwvdHI+JztcclxuXHRcdH1cclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKGluc2VydCk7XHJcblx0XHRpZiAoIWN0cmwpe1xyXG5cdFx0XHQkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0Ly8gbGV0IHRhciA9ICQodGhpcykuZmluZCgndGQnKS5lcSgxKTtcclxuXHRcdFx0XHQvLyBsZXQgaWQgPSB0YXIuZmluZCgnYScpLmF0dHIoJ2F0dHItZmJpZCcpO1xyXG5cdFx0XHRcdC8vIHRhci5wcmVwZW5kKGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYoY2hvb3NlLmRldGFpbCl7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiN1wiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcclxuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3LCBjb21tYW5kLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBlbmRUaW1lKT0+e1xyXG5cdFx0bGV0IGRhdGEgPSByYXc7XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmICh3b3JkICE9PSAnJyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50YWcoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgZW5kVGltZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgdCk9PntcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIil7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKT0+e1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpPT57XHJcblxyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYiA9IHtcclxuXHRub3c6IFwiY29tbWVudHNcIixcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHR0YWIubm93ID0gJCh0aGlzKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdFx0bGV0IHRhciA9ICQodGhpcykuaW5kZXgoKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLmVxKHRhcikuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRjb21wYXJlLmluaXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKXtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyK1wiLVwiK21vbnRoK1wiLVwiK2RhdGUrXCItXCIraG91citcIi1cIittaW4rXCItXCIrc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKXtcclxuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XHJcbiAgICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuICAgICBpZiAoZGF0ZSA8IDEwKXtcclxuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xyXG4gICAgIH1cclxuICAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuICAgICBpZiAoaG91ciA8IDEwKXtcclxuICAgICBcdGhvdXIgPSBcIjBcIitob3VyO1xyXG4gICAgIH1cclxuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcbiAgICAgaWYgKG1pbiA8IDEwKXtcclxuICAgICBcdG1pbiA9IFwiMFwiK21pbjtcclxuICAgICB9XHJcbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG4gICAgIGlmIChzZWMgPCAxMCl7XHJcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XHJcbiAgICAgfVxyXG4gICAgIHZhciB0aW1lID0geWVhcisnLScrbW9udGgrJy0nK2RhdGUrXCIgXCIraG91cisnOicrbWluKyc6JytzZWMgO1xyXG4gICAgIHJldHVybiB0aW1lO1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xyXG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG4gXHRcdHJldHVybiBbdmFsdWVdO1xyXG4gXHR9KTtcclxuIFx0cmV0dXJuIGFycmF5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuIFx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG4gXHR2YXIgaSwgciwgdDtcclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0YXJ5W2ldID0gaTtcclxuIFx0fVxyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcbiBcdFx0dCA9IGFyeVtyXTtcclxuIFx0XHRhcnlbcl0gPSBhcnlbaV07XHJcbiBcdFx0YXJ5W2ldID0gdDtcclxuIFx0fVxyXG4gXHRyZXR1cm4gYXJ5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuICAgIFxyXG4gICAgdmFyIENTViA9ICcnOyAgICBcclxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG4gICAgXHJcbiAgICAvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG4gICAgaWYgKFNob3dMYWJlbCkge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcclxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXHJcbiAgICBcclxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG4gICAgXHJcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcbiAgICBcclxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxyXG4gICAgbGluay5ocmVmID0gdXJpO1xyXG4gICAgXHJcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG4gICAgbGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG4gICAgXHJcbiAgICAvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgIGxpbmsuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
