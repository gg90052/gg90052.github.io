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
			if (authStr.indexOf('manage_pages') >= 0 && authStr.indexOf('user_posts') >= 0) {
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
							var _i7 = _step5.value;

							fid.push(_i7.from.id);
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
							var _i8 = _step6.value;

							var promise = fb.getName(_i8).then(function (res) {
								var _iteratorNormalCompletion14 = true;
								var _didIteratorError14 = false;
								var _iteratorError14 = undefined;

								try {
									for (var _iterator14 = Object.keys(res)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
										var _i9 = _step14.value;

										names[_i9] = res[_i9];
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
							// FB.api("/me", function (res) {
							// 	if (res.name === postdata.owner) {
							// 		for(let i of extend){
							// 			i.message = i.story;
							// 			delete i.story;
							// 			delete i.postlink;
							// 			i.like_count = 'N/A';
							// 		}
							// 	}else{
							// 		swal({
							// 			title: '個人貼文只有發文者本人能抓',
							// 			html: `貼文帳號名稱：${postdata.owner}<br>目前帳號名稱：${res.name}`,
							// 			type: 'warning'
							// 		}).done();
							// 	}
							// });
							var _iteratorNormalCompletion7 = true;
							var _didIteratorError7 = false;
							var _iteratorError7 = undefined;

							try {
								for (var _iterator7 = extend[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
									var i = _step7.value;

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
						} else if (postdata.type === 'group') {
							var _iteratorNormalCompletion8 = true;
							var _didIteratorError8 = false;
							var _iteratorError8 = undefined;

							try {
								for (var _iterator8 = extend[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
									var _i = _step8.value;

									delete _i.story;
									delete _i.postlink;
									_i.like_count = 'N/A';
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
									var _i2 = _step9.value;

									delete _i2.story;
									delete _i2.postlink;
									_i2.like_count = 'N/A';
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
							// FB.api("/me", function (res) {
							// 	if (res.name === postdata.owner) {
							// 		for(let i of extend){
							// 			delete i.story;
							// 			delete i.created_time;
							// 			delete i.postlink;
							// 			delete i.like_count;
							// 			i.type = 'LIKE';
							// 		}
							// 	}else{
							// 		swal({
							// 			title: '個人貼文只有發文者本人能抓',
							// 			html: `貼文帳號名稱：${postdata.owner}<br>目前帳號名稱：${res.name}`,
							// 			type: 'warning'
							// 		}).done();
							// 	}
							// });
							var _iteratorNormalCompletion10 = true;
							var _didIteratorError10 = false;
							var _iteratorError10 = undefined;

							try {
								for (var _iterator10 = extend[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
									var _i3 = _step10.value;

									delete _i3.story;
									delete _i3.created_time;
									delete _i3.postlink;
									delete _i3.like_count;
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
						} else if (postdata.type === 'group') {
							var _iteratorNormalCompletion11 = true;
							var _didIteratorError11 = false;
							var _iteratorError11 = undefined;

							try {
								for (var _iterator11 = extend[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
									var _i4 = _step11.value;

									delete _i4.story;
									delete _i4.created_time;
									delete _i4.postlink;
									delete _i4.like_count;
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
									var _i5 = _step12.value;

									delete _i5.story;
									delete _i5.created_time;
									delete _i5.postlink;
									delete _i5.like_count;
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
								var _i6 = _step13.value;

								_i6.from.name = names[_i6.from.id] ? names[_i6.from.id].name : _i6.from.name;
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
									var _i10 = _step18.value;

									var name = '';
									if (_i10.story) {
										name = _i10.story.substring(0, _i10.story.indexOf(' shared'));
									} else {
										name = _i10.id.substring(0, _i10.id.indexOf("_"));
									}
									var id = _i10.id.substring(0, _i10.id.indexOf("_"));
									_i10.from = { id: id, name: name };
									datas.push(_i10);
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
							var _i12 = _step26.value;

							base.push(_i12);
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
				var _i13 = _step24.value;

				_i13.match = 0;
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
		for (var _i11 in base) {
			var obj = base[_i11];
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
				var _i14 = _step30.value;

				var row = tempArr.length == 0 ? _i14 : tempArr[_i14];
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJoYXNoIiwibG9jYXRpb24iLCJpbmRleE9mIiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInNlc3Npb25TdG9yYWdlIiwiYWxlcnQiLCJocmVmIiwibGFzdERhdGEiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwiZGF0YSIsImZpbmlzaCIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJlIiwiZ2V0QXV0aCIsImN0cmxLZXkiLCJhbHRLZXkiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGlrZXMiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJvcmRlciIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJuZXh0IiwidHlwZSIsIkZCIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJmYmlkIiwiUHJvbWlzZSIsImFsbCIsImdldE1lIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsIm9wdGlvbnMiLCJpIiwiaiIsImlkIiwibmFtZSIsImh0bWwiLCJvcHRpb25EaXNwbGF5IiwiY2hlY2tib3giLCJwcm9wIiwic2VsZWN0UGFnZSIsInRhciIsImF0dHIiLCJzZXRUb2tlbiIsInN0ZXAiLCJzdGVwMSIsInBhZ2VpZCIsInBhZ2VzIiwiYWNjZXNzX3Rva2VuIiwiaGlkZGVuU3RhcnQiLCJwYWdlSUQiLCJzcGxpdCIsImFwaSIsImVycm9yIiwiY2xlYXIiLCJlbXB0eSIsImZpbmQiLCJjb21tYW5kIiwicGFnaW5nIiwic3RyIiwiZ2VuRGF0YSIsIm1lc3NhZ2UiLCJyZWNvbW1hbmQiLCJnZW5DYXJkIiwib2JqIiwiaWRzIiwibGluayIsIm1lc3MiLCJyZXBsYWNlIiwidGltZUNvbnZlcnRlciIsImNyZWF0ZWRfdGltZSIsInNyYyIsImZ1bGxfcGljdHVyZSIsInJlc29sdmUiLCJyZWplY3QiLCJhcnIiLCJleHRlbnNpb25BdXRoIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJzZXRJdGVtIiwiZXh0ZW5kIiwiZmlkIiwicHVzaCIsImZyb20iLCJwcm9taXNlX2FycmF5IiwibmFtZXMiLCJwcm9taXNlIiwiZ2V0TmFtZSIsIk9iamVjdCIsImtleXMiLCJwb3N0ZGF0YSIsInN0b3J5IiwicG9zdGxpbmsiLCJsaWtlX2NvdW50IiwidGl0bGUiLCJ0b1N0cmluZyIsInNjcm9sbFRvcCIsInN0ZXAyIiwiZmlsdGVyZWQiLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJ0ZXN0IiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJjb21tYW5kcyIsInRlbXBfZGF0YSIsImdldCIsImRhdGFzIiwic2hhcmVFcnJvciIsImdldFNoYXJlIiwiZCIsInVwZGF0ZWRfdGltZSIsImdldE5leHQiLCJnZXRKU09OIiwiZmFpbCIsImFmdGVyIiwic3Vic3RyaW5nIiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJrZXkiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsIm5ld09iaiIsImVhY2giLCJ0bXAiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50IiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJwaWMiLCJ0aGVhZCIsInRib2R5IiwiZW50cmllcyIsInBpY3R1cmUiLCJ0ZCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInNlYXJjaCIsInZhbHVlIiwiZHJhdyIsImFuZCIsIm9yIiwiaWdub3JlIiwiYmFzZSIsImZpbmFsIiwiY29tcGFyZV9udW0iLCJzb3J0IiwiYSIsImIiLCJtYXRjaCIsInRlbXAiLCJ0ZW1wX25hbWUiLCJkYXRhX2FuZCIsImRhdGFfb3IiLCJ0Ym9keTIiLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJjdHJsIiwibiIsInBhcnNlSW50IiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJ0ZW1wQXJyIiwiY29sdW1uIiwiaW5kZXgiLCJyb3ciLCJub2RlIiwiaW5uZXJIVE1MIiwiayIsImVxIiwiaW5zZXJ0QmVmb3JlIiwidW5pcXVlIiwidGFnIiwidGltZSIsIm91dHB1dCIsImZvckVhY2giLCJpdGVtIiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsIm1vbWVudCIsIkRhdGUiLCJfZCIsInVpIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwibWFwIiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBZUMsU0FBZjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNOLFlBQUwsRUFBa0I7QUFDakJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUMsSUFBRSxpQkFBRixFQUFxQkMsTUFBckI7QUFDQVYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRFMsRUFBRUUsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0IsS0FBSUMsV0FBVyxDQUFmO0FBQ0FKLEdBQUUsUUFBRixFQUFZSyxLQUFaLENBQWtCLFlBQVU7QUFDM0JEO0FBQ0EsTUFBSUEsWUFBWSxDQUFoQixFQUFrQjtBQUNqQkosS0FBRSxRQUFGLEVBQVlNLEdBQVosQ0FBZ0IsT0FBaEI7QUFDQU4sS0FBRSwwQkFBRixFQUE4Qk8sV0FBOUIsQ0FBMEMsTUFBMUM7QUFDQTtBQUNELEVBTkQ7O0FBUUEsS0FBSUMsT0FBT0MsU0FBU0QsSUFBcEI7QUFDQSxLQUFJQSxLQUFLRSxPQUFMLENBQWEsT0FBYixLQUF5QixDQUE3QixFQUErQjtBQUM5QkMsZUFBYUMsVUFBYixD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QVQsQ0FBY0MsV0FBZCxDQUEwQjFLLElBQTFCO0FBQ0FBLE1BQUt4SSxLQUFMO0FBQ0FILFVBQVNvVCxJQUFULENBQWNFLFdBQWQsQ0FBMEIzSyxJQUExQjtBQUNIIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKXtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIixcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdGxldCBoaWRlYXJlYSA9IDA7XHJcblx0JCgnaGVhZGVyJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGhpZGVhcmVhKys7XHJcblx0XHRpZiAoaGlkZWFyZWEgPj0gNSl7XHJcblx0XHRcdCQoJ2hlYWRlcicpLm9mZignY2xpY2snKTtcclxuXHRcdFx0JCgnI2ZiaWRfYnV0dG9uLCAjcHVyZV9mYmlkJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJjbGVhclwiKSA+PSAwKXtcclxuXHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdyYXcnKTtcclxuXHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2xvZ2luJyk7XHJcblx0XHRhbGVydCgn5bey5riF6Zmk5pqr5a2Y77yM6KuL6YeN5paw6YCy6KGM55m75YWlJyk7XHJcblx0XHRsb2NhdGlvbi5ocmVmID0gJ2h0dHBzOi8vZ2c5MDA1Mi5naXRodWIuaW8vY29tbWVudF9oZWxwZXJfcGx1cyc7XHJcblx0fVxyXG5cdGxldCBsYXN0RGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyYXdcIikpO1xyXG5cclxuXHRpZiAobGFzdERhdGEpe1xyXG5cdFx0ZGF0YS5maW5pc2gobGFzdERhdGEpO1xyXG5cdH1cclxuXHRpZiAoc2Vzc2lvblN0b3JhZ2UubG9naW4pe1xyXG5cdFx0ZmIuZ2VuT3B0aW9uKEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pKTtcclxuXHR9XHJcblxyXG5cdC8vICQoXCIudGFibGVzID4gLnNoYXJlZHBvc3RzIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHQvLyBcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdC8vIFx0XHRmYi5leHRlbnNpb25BdXRoKCdpbXBvcnQnKTtcclxuXHQvLyBcdH1lbHNle1xyXG5cdC8vIFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfSk7XHJcblx0XHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9zdGFydFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0Y2hvb3NlLmluaXQodHJ1ZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLmluaXQoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoIWUuY3RybEtleSB8fCAhZS5hbHRLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6RVhDRUxcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudGFibGVzIC5maWx0ZXJzIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcuY29tcGFyZV9jb25kaXRpb24nKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLicrICQodGhpcykudmFsKCkpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVktTU0tREQgICBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUobm93RGF0ZSgpKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5KXtcclxuXHRcdFx0bGV0IGRkO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhW3RhYi5ub3ddKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgZGQ7XHJcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xyXG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKXtcclxuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhW3RhYi5ub3ddKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRjaV9jb3VudGVyKys7XHJcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KXtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYoZS5jdHJsS2V5KXtcclxuXHRcdFx0ZmIuZ2V0QXV0aCgnc2hhcmVkcG9zdHMnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCdtZXNzYWdlX3RhZ3MnLCdtZXNzYWdlJywnZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbJ2NyZWF0ZWRfdGltZScsJ2Zyb20nLCdtZXNzYWdlJywnc3RvcnknXSxcclxuXHRcdGxpa2VzOiBbJ25hbWUnXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuMTInLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuMTInLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4xMicsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi4xMicsXHJcblx0XHRmZWVkOiAndjIuMTInLFxyXG5cdFx0Z3JvdXA6ICd2Mi4xMicsXHJcblx0XHRuZXdlc3Q6ICd2Mi4xMidcclxuXHR9LFxyXG5cdGZpbHRlcjoge1xyXG5cdFx0d29yZDogJycsXHJcblx0XHRyZWFjdDogJ2FsbCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnJyxcclxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyxtYW5hZ2VfcGFnZXMnLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cGFnZVRva2VuOiAnJyxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdG5leHQ6ICcnLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XHJcblx0XHRcdFx0XHRmYi5zdGFydCgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+aOiOasiuWkseaVl++8jOiri+e1puS6iOaJgOacieasiumZkCcsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRQcm9taXNlLmFsbChbZmIuZ2V0TWUoKSxmYi5nZXRQYWdlKCksIGZiLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XHJcblx0XHRcdHNlc3Npb25TdG9yYWdlLmxvZ2luID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuXHRcdFx0ZmIuZ2VuT3B0aW9uKHJlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbk9wdGlvbjogKHJlcyk9PntcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCBvcHRpb25zID0gYDxpbnB1dCBpZD1cInB1cmVfZmJpZFwiIGNsYXNzPVwiaGlkZVwiPjxidXR0b24gaWQ9XCJmYmlkX2J1dHRvblwiIGNsYXNzPVwiYnRuIGhpZGVcIiBvbmNsaWNrPVwiZmIuaGlkZGVuU3RhcnQoKVwiPueUsUZCSUTmk7flj5Y8L2J1dHRvbj48bGFiZWw+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG9uY2hhbmdlPVwiZmIub3B0aW9uRGlzcGxheSh0aGlzKVwiPumaseiXj+WIl+ihqDwvbGFiZWw+PGJyPmA7XHJcblx0XHRsZXQgdHlwZSA9IC0xO1xyXG5cdFx0JCgnI2J0bl9zdGFydCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcclxuXHRcdFx0dHlwZSsrO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgaSl7XHJcblx0XHRcdFx0b3B0aW9ucyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgYXR0ci10eXBlPVwiJHt0eXBlfVwiIGF0dHItdmFsdWU9XCIke2ouaWR9XCIgb25jbGljaz1cImZiLnNlbGVjdFBhZ2UodGhpcylcIj4ke2oubmFtZX08L2Rpdj5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcjZW50ZXJVUkwnKS5odG1sKG9wdGlvbnMpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0fSxcclxuXHRvcHRpb25EaXNwbGF5OiAoY2hlY2tib3gpPT57XHJcblx0XHRpZiAoJChjaGVja2JveCkucHJvcCgnY2hlY2tlZCcpKXtcclxuXHRcdFx0JCgnLnBhZ2VfYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKCcucGFnZV9idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c2VsZWN0UGFnZTogKGUpPT57XHJcblx0XHQkKCcjZW50ZXJVUkwgLnBhZ2VfYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IHRhciA9ICQoZSk7XHJcblx0XHR0YXIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0aWYgKHRhci5hdHRyKCdhdHRyLXR5cGUnKSA9PSAxKXtcclxuXHRcdFx0ZmIuc2V0VG9rZW4odGFyLmF0dHIoJ2F0dHItdmFsdWUnKSk7XHJcblx0XHR9XHJcblx0XHRmYi5mZWVkKHRhci5hdHRyKCdhdHRyLXZhbHVlJyksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCk7XHJcblx0XHRzdGVwLnN0ZXAxKCk7XHJcblx0fSxcclxuXHRzZXRUb2tlbjogKHBhZ2VpZCk9PntcclxuXHRcdGxldCBwYWdlcyA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pWzFdO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHBhZ2VzKXtcclxuXHRcdFx0aWYgKGkuaWQgPT0gcGFnZWlkKXtcclxuXHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gaS5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGhpZGRlblN0YXJ0OiAoKT0+e1xyXG5cdFx0bGV0IGZiaWQgPSAkKCcjcHVyZV9mYmlkJykudmFsKCk7XHJcblx0XHRsZXQgcGFnZUlEID0gZmJpZC5zcGxpdCgnXycpWzBdO1xyXG5cdFx0RkIuYXBpKGAvJHtwYWdlSUR9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdGlmIChyZXMuZXJyb3Ipe1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKXtcclxuXHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpPT57XHJcblx0XHRpZiAoY2xlYXIpe1xyXG5cdFx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcclxuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLm9mZignY2xpY2snKS5jbGljaygoKT0+e1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKCcjZW50ZXJVUkwgc2VsZWN0JykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJyk7XHJcblx0XHRcdFx0ZmIuZmVlZCh0YXIudmFsKCksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCwgZmFsc2UpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGxldCBjb21tYW5kID0gKHR5cGUgPT0gJzInKSA/ICdmZWVkJzoncG9zdHMnO1xyXG5cdFx0bGV0IGFwaTtcclxuXHRcdGlmICh1cmwgPT0gJycpe1xyXG5cdFx0XHRhcGkgPSBgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZUlEfS8ke2NvbW1hbmR9P2ZpZWxkcz1saW5rLGZ1bGxfcGljdHVyZSxjcmVhdGVkX3RpbWUsbWVzc2FnZSZsaW1pdD0yNWA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YXBpID0gdXJsO1xyXG5cdFx0fVxyXG5cdFx0RkIuYXBpKGFwaSwgKHJlcyk9PntcclxuXHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0XHQkKCcuZmVlZHMgLmJ0bicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZmIubmV4dCA9IHJlcy5wYWdpbmcubmV4dDtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRsZXQgc3RyID0gZ2VuRGF0YShpKTtcclxuXHRcdFx0XHQkKCcuc2VjdGlvbiAuZmVlZHMgdGJvZHknKS5hcHBlbmQoc3RyKTtcclxuXHRcdFx0XHRpZiAoaS5tZXNzYWdlICYmIGkubWVzc2FnZS5pbmRleE9mKCfmir0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdGxldCByZWNvbW1hbmQgPSBnZW5DYXJkKGkpO1xyXG5cdFx0XHRcdFx0JCgnLmRvbmF0ZV9hcmVhIC5yZWNvbW1hbmRzJykuYXBwZW5kKHJlY29tbWFuZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRmdW5jdGlvbiBnZW5EYXRhKG9iail7XHJcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xyXG5cdFx0XHRsZXQgbGluayA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJytpZHNbMF0rJy9wb3N0cy8nK2lkc1sxXTtcclxuXHJcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XHJcblx0XHRcdGxldCBzdHIgPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGRpdiBjbGFzcz1cInBpY2tcIiBhdHRyLXZhbD1cIiR7b2JqLmlkfVwiICBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke21lc3N9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcihvYmouY3JlYXRlZF90aW1lKX08L3RkPlxyXG5cdFx0XHRcdFx0XHQ8L3RyPmA7XHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBnZW5DYXJkKG9iail7XHJcblx0XHRcdGxldCBzcmMgPSBvYmouZnVsbF9waWN0dXJlIHx8ICdodHRwOi8vcGxhY2Vob2xkLml0LzMwMHgyMjUnO1xyXG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcclxuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRsZXRcdHN0ciA9IGA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxyXG5cdFx0XHQ8YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZVwiPlxyXG5cdFx0XHQ8ZmlndXJlIGNsYXNzPVwiaW1hZ2UgaXMtNGJ5M1wiPlxyXG5cdFx0XHQ8aW1nIHNyYz1cIiR7c3JjfVwiIGFsdD1cIlwiPlxyXG5cdFx0XHQ8L2ZpZ3VyZT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvYT5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtY29udGVudFwiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG5cdFx0XHQke21lc3N9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cInBpY2tcIiBhdHRyLXZhbD1cIiR7b2JqLmlkfVwiIG9uY2xpY2s9XCJkYXRhLnN0YXJ0KCcke29iai5pZH0nKVwiPumWi+WnizwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5gO1xyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TWU6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWVgLCAocmVzKT0+e1xyXG5cdFx0XHRcdGxldCBhcnIgPSBbcmVzXTtcclxuXHRcdFx0XHRyZXNvbHZlKGFycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRQYWdlOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2FjY291bnRzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRHcm91cDogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9ncm91cHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkF1dGg6IChjb21tYW5kID0gJycpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSwgY29tbWFuZCk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25DYWxsYmFjazogKHJlc3BvbnNlLCBjb21tYW5kID0gJycpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCdtYW5hZ2VfcGFnZXMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xyXG5cdFx0XHRcdGRhdGEucmF3LmV4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ2ltcG9ydCcpe1xyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaGFyZWRwb3N0c1wiLCAkKCcjaW1wb3J0JykudmFsKCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgZXh0ZW5kID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNoYXJlZHBvc3RzXCIpKTtcclxuXHRcdFx0XHRsZXQgZmlkID0gW107XHJcblx0XHRcdFx0bGV0IGlkcyA9IFtdO1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0ZmlkLnB1c2goaS5mcm9tLmlkKTtcclxuXHRcdFx0XHRcdGlmIChmaWQubGVuZ3RoID49NDUpe1xyXG5cdFx0XHRcdFx0XHRpZHMucHVzaChmaWQpO1xyXG5cdFx0XHRcdFx0XHRmaWQgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWRzLnB1c2goZmlkKTtcclxuXHRcdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdLCBuYW1lcyA9IHt9O1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBpZHMpe1xyXG5cdFx0XHRcdFx0bGV0IHByb21pc2UgPSBmYi5nZXROYW1lKGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIE9iamVjdC5rZXlzKHJlcykpe1xyXG5cdFx0XHRcdFx0XHRcdG5hbWVzW2ldID0gcmVzW2ldO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHBvc3RkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucG9zdGRhdGEpO1xyXG5cdFx0XHRcdGlmIChjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRcdFx0aWYgKHBvc3RkYXRhLnR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdFx0Ly8gRkIuYXBpKFwiL21lXCIsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAocmVzLm5hbWUgPT09IHBvc3RkYXRhLm93bmVyKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aS5tZXNzYWdlID0gaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpLmxpa2VfY291bnQgPSAnTi9BJztcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR0aXRsZTogJ+WAi+S6uuiyvOaWh+WPquacieeZvOaWh+iAheacrOS6uuiDveaKkycsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGh0bWw6IGDosrzmlofluLPomZ/lkI3nqLHvvJoke3Bvc3RkYXRhLm93bmVyfTxicj7nm67liY3luLPomZ/lkI3nqLHvvJoke3Jlcy5uYW1lfWAsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfSk7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGkubGlrZV9jb3VudCA9ICdOL0EnO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9ZWxzZSBpZihwb3N0ZGF0YS50eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0aS5saWtlX2NvdW50ID0gJ04vQSc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRpLmxpa2VfY291bnQgPSAnTi9BJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0aWYgKHBvc3RkYXRhLnR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdFx0Ly8gRkIuYXBpKFwiL21lXCIsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAocmVzLm5hbWUgPT09IHBvc3RkYXRhLm93bmVyKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLmNyZWF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGkudHlwZSA9ICdMSUtFJztcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR0aXRsZTogJ+WAi+S6uuiyvOaWh+WPquacieeZvOaWh+iAheacrOS6uuiDveaKkycsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGh0bWw6IGDosrzmlofluLPomZ/lkI3nqLHvvJoke3Bvc3RkYXRhLm93bmVyfTxicj7nm67liY3luLPomZ/lkI3nqLHvvJoke3Jlcy5uYW1lfWAsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfSk7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmNyZWF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9ZWxzZSBpZihwb3N0ZGF0YS50eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuY3JlYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5jcmVhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0UHJvbWlzZS5hbGwocHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdGkuZnJvbS5uYW1lID0gbmFtZXNbaS5mcm9tLmlkXSA/IG5hbWVzW2kuZnJvbS5pZF0ubmFtZSA6IGkuZnJvbS5uYW1lO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZGF0YS5yYXcuZGF0YVtjb21tYW5kXSA9IGV4dGVuZDtcclxuXHRcdFx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcyk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcbmxldCBzdGVwID0ge1xyXG5cdHN0ZXAxOiAoKT0+e1xyXG5cdFx0JCgnLnNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc3RlcDInKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcclxuXHR9LFxyXG5cdHN0ZXAyOiAoKT0+e1xyXG5cdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHQkKCcuc2VjdGlvbicpLmFkZENsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiB7fSxcclxuXHRmaWx0ZXJlZDoge30sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwcm9taXNlX2FycmF5OiBbXSxcclxuXHR0ZXN0OiAoaWQpPT57XHJcblx0XHRjb25zb2xlLmxvZyhpZCk7XHJcblx0fSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGRhdGEucHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCk9PntcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0ZnVsbElEOiBmYmlkXHJcblx0XHR9XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0bGV0IGNvbW1hbmRzID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRsZXQgdGVtcF9kYXRhID0gb2JqO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGNvbW1hbmRzKXtcclxuXHRcdFx0dGVtcF9kYXRhLmRhdGEgPSB7fTtcclxuXHRcdFx0bGV0IHByb21pc2UgPSBkYXRhLmdldCh0ZW1wX2RhdGEsIGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHR0ZW1wX2RhdGEuZGF0YVtpXSA9IHJlcztcclxuXHRcdFx0fSk7XHJcblx0XHRcdGRhdGEucHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdFByb21pc2UuYWxsKGRhdGEucHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRkYXRhLmZpbmlzaCh0ZW1wX2RhdGEpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkLCBjb21tYW5kKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgc2hhcmVFcnJvciA9IDA7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpIGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHRpZiAoY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0Z2V0U2hhcmUoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2NvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2NvbW1hbmRdfSZvcmRlcj1jaHJvbm9sb2dpY2FsJmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtjb21tYW5kXS50b1N0cmluZygpfWAsKHJlcyk9PntcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLmlkfTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLmlkfTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXRTaGFyZShhZnRlcj0nJyl7XHJcblx0XHRcdFx0bGV0IHVybCA9IGBodHRwczovL2FtNjZhaGd0cDguZXhlY3V0ZS1hcGkuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbS9zaGFyZT9mYmlkPSR7ZmJpZC5mdWxsSUR9JmFmdGVyPSR7YWZ0ZXJ9YDtcclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0aWYgKHJlcyA9PT0gJ2VuZCcpe1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yTWVzc2FnZSl7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHRcdH1lbHNlIGlmKHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0XHQvLyBzaGFyZUVycm9yID0gMDtcclxuXHRcdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IG5hbWUgPSAnJztcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGkuc3Rvcnkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lID0gaS5zdG9yeS5zdWJzdHJpbmcoMCwgaS5zdG9yeS5pbmRleE9mKCcgc2hhcmVkJykpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBpLmlkLnN1YnN0cmluZygwLCBpLmlkLmluZGV4T2YoXCJfXCIpKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGxldCBpZCA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aS5mcm9tID0ge2lkLCBuYW1lfTtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goaSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGdldFNoYXJlKHJlcy5hZnRlcik7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKT0+e1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRzdGVwLnN0ZXAyKCk7XHJcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdCQoJy5yZXN1bHRfYXJlYSA+IC50aXRsZSBzcGFuJykudGV4dChmYmlkLmZ1bGxJRCk7XHJcblx0XHRkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJhd1wiLCBKU09OLnN0cmluZ2lmeShmYmlkKSk7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXJlZCA9IHt9O1xyXG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhyYXdEYXRhLmRhdGEpKXtcclxuXHRcdFx0bGV0IGlzVGFnID0gJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRcdGlmIChrZXkgPT09ICdyZWFjdGlvbnMnKSBpc1RhZyA9IGZhbHNlO1xyXG5cdFx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLmRhdGFba2V5XSwga2V5LCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHRcclxuXHRcdFx0ZGF0YS5maWx0ZXJlZFtrZXldID0gbmV3RGF0YTtcclxuXHRcdH1cclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSl7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmlsdGVyZWQpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBkYXRhLmZpbHRlcmVkO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpPT57XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pe1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuW/g+aDhVwiIDogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpPT57XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmVkID0gcmF3ZGF0YTtcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhmaWx0ZXJlZCkpe1xyXG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZD7lv4Pmg4U8L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgdmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0XHQkKFwiLnRhYmxlcyAuXCIra2V5K1wiIHRhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHRcdHRhYi5pbml0KCk7XHJcblx0XHRjb21wYXJlLmluaXQoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjb21wYXJlID0ge1xyXG5cdGFuZDogW10sXHJcblx0b3I6IFtdLFxyXG5cdHJhdzogW10sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdGNvbXBhcmUuYW5kID0gW107XHJcblx0XHRjb21wYXJlLm9yID0gW107XHJcblx0XHRjb21wYXJlLnJhdyA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGxldCBpZ25vcmUgPSAkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS52YWwoKTtcclxuXHRcdGxldCBiYXNlID0gW107XHJcblx0XHRsZXQgZmluYWwgPSBbXTtcclxuXHRcdGxldCBjb21wYXJlX251bSA9IDE7XHJcblx0XHRpZiAoaWdub3JlID09PSAnaWdub3JlJykgY29tcGFyZV9udW0gPSAyO1xyXG5cclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGNvbXBhcmUucmF3KSl7XHJcblx0XHRcdGlmIChrZXkgIT09IGlnbm9yZSl7XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGNvbXBhcmUucmF3W2tleV0pe1xyXG5cdFx0XHRcdFx0YmFzZS5wdXNoKGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IHNvcnQgPSAoZGF0YS5yYXcuZXh0ZW5zaW9uKSA/ICduYW1lJzonaWQnO1xyXG5cdFx0YmFzZSA9IGJhc2Uuc29ydCgoYSxiKT0+e1xyXG5cdFx0XHRyZXR1cm4gYS5mcm9tW3NvcnRdID4gYi5mcm9tW3NvcnRdID8gMTotMTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGZvcihsZXQgaSBvZiBiYXNlKXtcclxuXHRcdFx0aS5tYXRjaCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdGxldCB0ZW1wX25hbWUgPSAnJztcclxuXHRcdC8vIGNvbnNvbGUubG9nKGJhc2UpO1xyXG5cdFx0Zm9yKGxldCBpIGluIGJhc2Upe1xyXG5cdFx0XHRsZXQgb2JqID0gYmFzZVtpXTtcclxuXHRcdFx0aWYgKG9iai5mcm9tLmlkID09IHRlbXAgfHwgKGRhdGEucmF3LmV4dGVuc2lvbiAmJiAob2JqLmZyb20ubmFtZSA9PSB0ZW1wX25hbWUpKSl7XHJcblx0XHRcdFx0bGV0IHRhciA9IGZpbmFsW2ZpbmFsLmxlbmd0aC0xXTtcclxuXHRcdFx0XHR0YXIubWF0Y2grKztcclxuXHRcdFx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKXtcclxuXHRcdFx0XHRcdGlmICghdGFyW2tleV0pIHRhcltrZXldID0gb2JqW2tleV07IC8v5ZCI5L216LOH5paZXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0YXIubWF0Y2ggPT0gY29tcGFyZV9udW0pe1xyXG5cdFx0XHRcdFx0dGVtcF9uYW1lID0gJyc7XHJcblx0XHRcdFx0XHR0ZW1wID0gJyc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmaW5hbC5wdXNoKG9iaik7XHJcblx0XHRcdFx0dGVtcCA9IG9iai5mcm9tLmlkO1xyXG5cdFx0XHRcdHRlbXBfbmFtZSA9IG9iai5mcm9tLm5hbWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdGNvbXBhcmUub3IgPSBmaW5hbDtcclxuXHRcdGNvbXBhcmUuYW5kID0gY29tcGFyZS5vci5maWx0ZXIoKHZhbCk9PntcclxuXHRcdFx0cmV0dXJuIHZhbC5tYXRjaCA9PSBjb21wYXJlX251bTtcclxuXHRcdH0pO1xyXG5cdFx0Y29tcGFyZS5nZW5lcmF0ZSgpO1xyXG5cdH0sXHJcblx0Z2VuZXJhdGU6ICgpPT57XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGRhdGFfYW5kID0gY29tcGFyZS5hbmQ7XHJcblxyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfYW5kLmVudHJpZXMoKSl7XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcwJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuYW5kIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XHJcblxyXG5cdFx0bGV0IGRhdGFfb3IgPSBjb21wYXJlLm9yO1xyXG5cdFx0bGV0IHRib2R5MiA9ICcnO1xyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX29yLmVudHJpZXMoKSl7XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keTIgKz0gdHI7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUub3IgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5Mik7XHJcblx0XHRcclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyAudG90YWwgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydhbmQnLCdvciddO1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0XHRsZXQgdGFibGUgPSAkKCcudGFibGVzIC4nK2krJyB0YWJsZScpLkRhdGFUYWJsZSgpO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBjaG9vc2UgPSB7XHJcblx0ZGF0YTogW10sXHJcblx0YXdhcmQ6IFtdLFxyXG5cdG51bTogMCxcclxuXHRkZXRhaWw6IGZhbHNlLFxyXG5cdGxpc3Q6IFtdLFxyXG5cdGluaXQ6IChjdHJsID0gZmFsc2UpPT57XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCl7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbyhjdHJsKTtcclxuXHR9LFxyXG5cdGdvOiAoY3RybCk9PntcclxuXHRcdGxldCBjb21tYW5kID0gdGFiLm5vdztcclxuXHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXS5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhW2NvbW1hbmRdLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHRcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGxldCB0ZW1wQXJyID0gW107XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkuY29sdW1uKDIpLmRhdGEoKS5lYWNoKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCl7XHJcblx0XHRcdFx0bGV0IHdvcmQgPSAkKCcuc2VhcmNoQ29tbWVudCcpLnZhbCgpO1xyXG5cdFx0XHRcdGlmICh2YWx1ZS5pbmRleE9mKHdvcmQpID49IDApIHRlbXBBcnIucHVzaChpbmRleCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBpIG9mIGNob29zZS5hd2FyZCl7XHJcblx0XHRcdGxldCByb3cgPSAodGVtcEFyci5sZW5ndGggPT0gMCkgPyBpOnRlbXBBcnJbaV07XHJcblx0XHRcdGxldCB0YXIgPSAkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLnJvdyhyb3cpLm5vZGUoKS5pbm5lckhUTUw7XHJcblx0XHRcdGluc2VydCArPSAnPHRyPicgKyB0YXIgKyAnPC90cj4nO1xyXG5cdFx0fVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdGlmICghY3RybCl7XHJcblx0XHRcdCQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQvLyBsZXQgdGFyID0gJCh0aGlzKS5maW5kKCd0ZCcpLmVxKDEpO1xyXG5cdFx0XHRcdC8vIGxldCBpZCA9IHRhci5maW5kKCdhJykuYXR0cignYXR0ci1mYmlkJyk7XHJcblx0XHRcdFx0Ly8gdGFyLnByZXBlbmQoYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke2lkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHJcblx0XHRpZihjaG9vc2UuZGV0YWlsKXtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvcihsZXQgayBpbiBjaG9vc2UubGlzdCl7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI3XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXcsIGNvbW1hbmQsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIGVuZFRpbWUpPT57XHJcblx0XHRsZXQgZGF0YSA9IHJhdztcclxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHdvcmQgIT09ICcnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kICE9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBlbmRUaW1lKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnJlYWN0KGRhdGEsIHJlYWN0KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9LFxyXG5cdHVuaXF1ZTogKGRhdGEpPT57XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCB0KT0+e1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XHJcblx0XHRpZiAodGFyID09ICdhbGwnKXtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCk9PntcclxuXHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFiID0ge1xyXG5cdG5vdzogXCJjb21tZW50c1wiLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdHRhYi5ub3cgPSAkKHRoaXMpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0XHRsZXQgdGFyID0gJCh0aGlzKS5pbmRleCgpO1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2JykuZXEodGFyKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpe1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xyXG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcclxuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgIGlmIChkYXRlIDwgMTApe1xyXG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XHJcbiAgICAgfVxyXG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgIGlmIChob3VyIDwgMTApe1xyXG4gICAgIFx0aG91ciA9IFwiMFwiK2hvdXI7XHJcbiAgICAgfVxyXG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgICBpZiAobWluIDwgMTApe1xyXG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xyXG4gICAgIH1cclxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgaWYgKHNlYyA8IDEwKXtcclxuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcclxuICAgICB9XHJcbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XHJcbiAgICAgcmV0dXJuIHRpbWU7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
