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
			$("#btn_excel").text("複製表格內容");
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
		$('.tables .total .table_compare table').removeClass('table-active');
		$('.tables .total .table_compare.' + $(this).val()).removeClass('hide');
		$('.tables .total .table_compare.' + $(this).val() + ' table').addClass('table-active');
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
			// if (filterData.length > 7000){
			// 	$(".bigExcel").removeClass("hide");
			// }else{
			// 	if (tab.now === 'compare'){
			// 		JSONToCSVConvertor(data.excel(compare[$('.compare_condition').val()]), "Comment_helper", true);
			// 	}else{
			// 		JSONToCSVConvertor(data.excel(filterData[tab.now]), "Comment_helper", true);
			// 	}
			// }
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
		comments: 'v7.0',
		reactions: 'v7.0',
		sharedposts: 'v7.0',
		url_comments: 'v7.0',
		feed: 'v7.0',
		group: 'v7.0',
		newest: 'v7.0'
	},
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	order: '',
	auth: 'groups_show_list, pages_show_list, pages_read_engagement, pages_read_user_content,groups_access_member_info',
	extension: false,
	pageToken: ''
};

var fb = {
	next: '',
	getAuth: function getAuth(type) {
		FB.login(function (response) {
			fb.callback(response, type);
		}, {
			auth_type: 'rerequest',
			scope: config.auth,
			return_scopes: true
		});
	},
	callback: function callback(response, type) {
		if (response.status === 'connected') {
			console.log(response);
			if (type == "addScope") {
				var authStr = response.authResponse.grantedScopes;
				// if (authStr.includes('groups_access_member_info')){
				// 	fb.start();
				// }else{
				// 	swal(
				// 		'付費授權檢查錯誤，該功能需付費',
				// 		'Authorization Failed! It is a paid feature.',
				// 		'error'
				// 	).done();
				// }
				fb.start();
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
		page_selector.show();
		fb.next = '';
		var options = "\n\t\t<button class=\"btn\" onclick=\"page_selector.show()\">\u5F9E\u7C89\u7D72\u5C08\u9801/\u793E\u5718\u9078\u64C7\u8CBC\u6587</button><br>\n\t\t<input id=\"pure_fbid\">\n\t\t<button id=\"fbid_button\" class=\"btn\" onclick=\"fb.hiddenStart(this)\">\u7531FBID\u64F7\u53D6</button>\n\t\t<a href=\"javascript:;\" onclick=\"data.finish(data.raw)\" style=\"margin-left:20px;\">\u5F37\u5236\u8DF3\u8F49\u5230\u8868\u683C</a><br>";
		var type = -1;
		$('#btn_start').addClass('hide');
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
		$('.forfb').addClass('hide');
		$('.step1').removeClass('hide');
		step.step1();
	},
	setToken: function setToken(pageid) {
		var pages = JSON.parse(sessionStorage.login)[1];
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = pages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var i = _step.value;

				if (i.id == pageid) {
					config.pageToken = i.access_token;
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
	},
	hiddenStart: function hiddenStart(e) {
		var fbid = $('#pure_fbid').val();
		var pageID = fbid.split('_')[0];
		FB.api("/" + pageID + "?fields=access_token", function (res) {
			if (res.error) {
				data.start(fbid);
			} else {
				if (res.access_token) {
					config.pageToken = res.access_token;
				}
				if (e.ctrlKey || e.altKey) {
					data.start(fbid, 'live');
				} else {
					data.start(fbid);
				}
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
		var command = 'feed';
		var api = void 0;
		if (url == '') {
			api = config.apiVersion.newest + "/" + pageID + "/" + command + "?fields=full_picture,created_time,message&limit=25";
		} else {
			api = url;
		}
		FB.api(api, function (res) {
			if (res.data.length == 0) {
				$('.feeds .btn').addClass('hide');
			}
			fb.next = res.paging.next;
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = res.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var i = _step2.value;

					var str = genData(i);
					$('.section .feeds tbody').append(str);
					if (i.message && i.message.indexOf('抽') >= 0) {
						var recommand = genCard(i);
						$('.donate_area .recommands').append(recommand);
					}
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
		});

		function genData(obj) {
			console.log(obj);
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
			FB.api(config.apiVersion.newest + "/me/groups?fields=name,id,administrator&limit=100", function (res) {
				resolve(res.data.filter(function (item) {
					return item.administrator === true;
				}));
			});
		});
	},
	extensionAuth: function extensionAuth() {
		var command = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		// let response = {
		// 	status: 'connected',
		// 	authResponse:{
		// 		grantedScopes: 'groups_access_member_info',
		// 	}
		// }
		// fb.extensionCallback(response, command);
		FB.login(function (response) {
			fb.extensionCallback(response, command);
		}, { scope: config.auth, return_scopes: true });
	},
	extensionCallback: function extensionCallback(response) {
		var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

		if (response.status === 'connected') {
			var authStr = response.authResponse.grantedScopes;
			if (authStr.indexOf('groups_access_member_info') >= 0) {
				(function () {
					data.raw.extension = true;
					if (command == 'import') {
						localStorage.setItem("sharedposts", $('#import').val());
					}
					var extend = JSON.parse(localStorage.getItem("sharedposts"));
					var fid = [];
					var ids = [];
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = extend[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var _i7 = _step3.value;

							fid.push(_i7.from.id);
							if (fid.length >= 45) {
								ids.push(fid);
								fid = [];
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

					ids.push(fid);
					var promise_array = [],
					    names = {};
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = ids[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var _i8 = _step4.value;

							var promise = fb.getName(_i8).then(function (res) {
								var _iteratorNormalCompletion12 = true;
								var _didIteratorError12 = false;
								var _iteratorError12 = undefined;

								try {
									for (var _iterator12 = Object.keys(res)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
										var _i9 = _step12.value;

										names[_i9] = res[_i9];
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
							});
							promise_array.push(promise);
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
							var _iteratorNormalCompletion5 = true;
							var _didIteratorError5 = false;
							var _iteratorError5 = undefined;

							try {
								for (var _iterator5 = extend[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
									var i = _step5.value;

									delete i.story;
									delete i.postlink;
									i.like_count = 'N/A';
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
						} else if (postdata.type === 'group') {
							var _iteratorNormalCompletion6 = true;
							var _didIteratorError6 = false;
							var _iteratorError6 = undefined;

							try {
								for (var _iterator6 = extend[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
									var _i = _step6.value;

									delete _i.story;
									delete _i.postlink;
									_i.like_count = 'N/A';
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
						} else {
							var _iteratorNormalCompletion7 = true;
							var _didIteratorError7 = false;
							var _iteratorError7 = undefined;

							try {
								for (var _iterator7 = extend[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
									var _i2 = _step7.value;

									delete _i2.story;
									delete _i2.postlink;
									_i2.like_count = 'N/A';
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
							var _iteratorNormalCompletion8 = true;
							var _didIteratorError8 = false;
							var _iteratorError8 = undefined;

							try {
								for (var _iterator8 = extend[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
									var _i3 = _step8.value;

									delete _i3.story;
									delete _i3.created_time;
									delete _i3.postlink;
									delete _i3.like_count;
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
						} else if (postdata.type === 'group') {
							var _iteratorNormalCompletion9 = true;
							var _didIteratorError9 = false;
							var _iteratorError9 = undefined;

							try {
								for (var _iterator9 = extend[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
									var _i4 = _step9.value;

									delete _i4.story;
									delete _i4.created_time;
									delete _i4.postlink;
									delete _i4.like_count;
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
						} else {
							var _iteratorNormalCompletion10 = true;
							var _didIteratorError10 = false;
							var _iteratorError10 = undefined;

							try {
								for (var _iterator10 = extend[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
									var _i5 = _step10.value;

									delete _i5.story;
									delete _i5.created_time;
									delete _i5.postlink;
									delete _i5.like_count;
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
						}
					}

					Promise.all(promise_array).then(function () {
						var _iteratorNormalCompletion11 = true;
						var _didIteratorError11 = false;
						var _iteratorError11 = undefined;

						try {
							for (var _iterator11 = extend[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
								var _i6 = _step11.value;

								_i6.from.name = names[_i6.from.id] ? names[_i6.from.id].name : _i6.from.name;
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
		$('.forfb').addClass('hide');
		$('.recommands, .feeds tbody').empty();
		$('.section').addClass('step2');
		$("html, body").scrollTop(0);
	}
};

var data = {
	raw: { data: {
			fullID: '',
			comments: [],
			reactions: [],
			sharedposts: []
		} },
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
		var commands = ['comments', 'reactions'];
		var temp_data = obj;
		var _iteratorNormalCompletion13 = true;
		var _didIteratorError13 = false;
		var _iteratorError13 = undefined;

		try {
			var _loop = function _loop() {
				var i = _step13.value;

				temp_data.data = {};
				var promise = data.get(temp_data, i).then(function (res) {
					temp_data.data[i] = res;
				});
				data.promise_array.push(promise);
			};

			for (var _iterator13 = commands[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
				_loop();
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

		Promise.all(data.promise_array).then(function () {
			data.finish(temp_data);
		});
	},
	get: function get(fbid, command) {
		return new Promise(function (resolve, reject) {
			var datas = [];
			var promise_array = [];
			var shareError = 0;
			var api_fbid = fbid.fullID;
			// if ($('.page_btn.active').attr('attr-type') == 2){
			// 	api_fbid = fbid.fullID.split('_')[1];
			// 	if (command === 'reactions') command = 'likes';
			// }
			if (fbid.type === 'group') command = 'group';
			FB.api(api_fbid + "/" + command + "?limit=" + config.limit[command] + "&order=chronological&access_token=" + config.pageToken + "&fields=" + config.field[command].toString(), function (res) {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				var _iteratorNormalCompletion14 = true;
				var _didIteratorError14 = false;
				var _iteratorError14 = undefined;

				try {
					for (var _iterator14 = res.data[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
						var d = _step14.value;

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

				if (res.data.length > 0 && res.paging.next) {
					getNext(res.paging.next);
				} else {
					resolve(datas);
				}
			});

			function getNext(url) {
				var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

				if (limit !== 0) {
					url = url.replace('limit=500', 'limit=' + limit);
				}
				$.getJSON(url, function (res) {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					var _iteratorNormalCompletion15 = true;
					var _didIteratorError15 = false;
					var _iteratorError15 = undefined;

					try {
						for (var _iterator15 = res.data[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
							var d = _step15.value;

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

					if (res.data.length > 0 && res.paging.next) {
						getNext(res.paging.next);
					} else {
						resolve(datas);
					}
				}).fail(function () {
					getNext(url, 200);
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
		var _iteratorNormalCompletion16 = true;
		var _didIteratorError16 = false;
		var _iteratorError16 = undefined;

		try {
			for (var _iterator16 = Object.keys(rawData.data)[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
				var key = _step16.value;

				var isTag = $("#tag").prop("checked");
				if (key === 'reactions') isTag = false;
				var newData = _filter.totalFilter.apply(_filter, [rawData.data[key], key, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
				data.filtered[key] = newData;
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
					"臉書連結": 'https://www.facebook.com/' + this.from.id,
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
					"臉書連結": 'https://www.facebook.com/' + this.from.id,
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
		var _iteratorNormalCompletion17 = true;
		var _didIteratorError17 = false;
		var _iteratorError17 = undefined;

		try {
			for (var _iterator17 = Object.keys(filtered)[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
				var key = _step17.value;

				var thead = '';
				var tbody = '';
				if (key === 'reactions') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td>\u5FC3\u60C5</td>";
				} else if (key === 'sharedposts') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
				} else {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td>\u8B9A</td>\n\t\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
				}
				var _iteratorNormalCompletion19 = true;
				var _didIteratorError19 = false;
				var _iteratorError19 = undefined;

				try {
					for (var _iterator19 = filtered[key].entries()[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
						var _step19$value = _slicedToArray(_step19.value, 2),
						    j = _step19$value[0],
						    val = _step19$value[1];

						var picture = '';
						if (pic) {
							// picture = `<img src="https://graph.facebook.com/${val.from.id}/picture?type=small"><br>`;
						}
						var td = "<td>" + (j + 1) + "</td>\n\t\t\t\t<td><a href='https://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + picture + val.from.name + "</a></td>";
						if (key === 'reactions') {
							td += "<td class=\"center\"><span class=\"react " + val.type + "\"></span>" + val.type + "</td>";
						} else if (key === 'sharedposts') {
							td += "<td class=\"force-break\"><a href=\"https://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || val.story) + "</a></td>\n\t\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
						} else {
							td += "<td class=\"force-break\"><a href=\"https://www.facebook.com/" + val.id + "\" target=\"_blank\">" + val.message + "</a></td>\n\t\t\t\t\t<td>" + val.like_count + "</td>\n\t\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
						}
						var tr = "<tr>" + td + "</tr>";
						tbody += tr;
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

				var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
				$(".tables ." + key + " table").html('').append(insert);
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
			var _iteratorNormalCompletion18 = true;
			var _didIteratorError18 = false;
			var _iteratorError18 = undefined;

			try {
				var _loop2 = function _loop2() {
					var i = _step18.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator18 = arr[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
					_loop2();
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

		var _iteratorNormalCompletion20 = true;
		var _didIteratorError20 = false;
		var _iteratorError20 = undefined;

		try {
			for (var _iterator20 = Object.keys(compare.raw)[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
				var _key = _step20.value;

				if (_key !== ignore) {
					var _iteratorNormalCompletion23 = true;
					var _didIteratorError23 = false;
					var _iteratorError23 = undefined;

					try {
						for (var _iterator23 = compare.raw[_key][Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
							var _i11 = _step23.value;

							base.push(_i11);
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

		var sort = data.raw.extension ? 'name' : 'id';
		base = base.sort(function (a, b) {
			return a.from[sort] > b.from[sort] ? 1 : -1;
		});

		var _iteratorNormalCompletion21 = true;
		var _didIteratorError21 = false;
		var _iteratorError21 = undefined;

		try {
			for (var _iterator21 = base[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
				var _i12 = _step21.value;

				_i12.match = 0;
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

		var temp = '';
		var temp_name = '';
		// console.log(base);
		for (var _i10 in base) {
			var obj = base[_i10];
			if (obj.from.id == temp || data.raw.extension && obj.from.name == temp_name) {
				var tar = final[final.length - 1];
				tar.match++;
				var _iteratorNormalCompletion22 = true;
				var _didIteratorError22 = false;
				var _iteratorError22 = undefined;

				try {
					for (var _iterator22 = Object.keys(obj)[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
						var key = _step22.value;

						if (!tar[key]) tar[key] = obj[key]; //合併資料
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
		var _iteratorNormalCompletion24 = true;
		var _didIteratorError24 = false;
		var _iteratorError24 = undefined;

		try {
			for (var _iterator24 = data_and.entries()[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
				var _step24$value = _slicedToArray(_step24.value, 2),
				    j = _step24$value[0],
				    val = _step24$value[1];

				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='https://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '0') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
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

		$(".tables .total .table_compare.and tbody").html('').append(tbody);

		var data_or = compare.or;
		var tbody2 = '';
		var _iteratorNormalCompletion25 = true;
		var _didIteratorError25 = false;
		var _iteratorError25 = undefined;

		try {
			for (var _iterator25 = data_or.entries()[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
				var _step25$value = _slicedToArray(_step25.value, 2),
				    j = _step25$value[0],
				    val = _step25$value[1];

				var _td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='https://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var _tr = "<tr>" + _td + "</tr>";
				tbody2 += _tr;
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

		$(".tables .total .table_compare.or tbody").html('').append(tbody2);

		active();

		function active() {
			var table = $(".tables .total table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			var arr = ['and', 'or'];
			var _iteratorNormalCompletion26 = true;
			var _didIteratorError26 = false;
			var _iteratorError26 = undefined;

			try {
				var _loop3 = function _loop3() {
					var i = _step26.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator26 = arr[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
					_loop3();
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
		var _iteratorNormalCompletion27 = true;
		var _didIteratorError27 = false;
		var _iteratorError27 = undefined;

		try {
			for (var _iterator27 = choose.award[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
				var _i13 = _step27.value;

				var row = tempArr.length == 0 ? _i13 : tempArr[_i13];
				var _tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
				insert += '<tr>' + _tar + '</tr>';
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

		$('#awardList table tbody').html(insert);
		if (!ctrl) {
			$("#awardList tbody tr").each(function () {
				// let tar = $(this).find('td').eq(1);
				// let id = tar.find('a').attr('attr-fbid');
				// tar.prepend(`<img src="https://graph.facebook.com/${id}/picture?type=small"><br>`);
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

var page_selector = {
	pages: [],
	groups: [],
	show: function show() {
		$('.page_selector').removeClass('hide');
		page_selector.getAdmin();
	},
	hide: function hide() {
		$('.page_selector').addClass('hide');
	},
	getAdmin: function getAdmin() {
		Promise.all([page_selector.getPage(), page_selector.getGroup()]).then(function (res) {
			page_selector.genAdmin(res);
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
			FB.api(config.apiVersion.newest + "/me/groups?fields=name,id,administrator&limit=100", function (res) {
				resolve(res.data.filter(function (item) {
					return item.administrator === true;
				}));
			});
		});
	},
	genAdmin: function genAdmin(res) {
		var pages = '';
		var groups = '';
		var _iteratorNormalCompletion28 = true;
		var _didIteratorError28 = false;
		var _iteratorError28 = undefined;

		try {
			for (var _iterator28 = res[0][Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
				var _i14 = _step28.value;

				pages += "<div class=\"page_btn\" data-type=\"1\" data-value=\"" + _i14.id + "\" onclick=\"page_selector.selectPage(this)\">" + _i14.name + "</div>";
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

		var _iteratorNormalCompletion29 = true;
		var _didIteratorError29 = false;
		var _iteratorError29 = undefined;

		try {
			for (var _iterator29 = res[1][Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
				var _i15 = _step29.value;

				groups += "<div class=\"page_btn\" data-type=\"2\" data-value=\"" + _i15.id + "\" onclick=\"page_selector.selectPage(this)\">" + _i15.name + "</div>";
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

		$('.select_page').html(pages);
		$('.select_group').html(groups);
	},
	selectPage: function selectPage(target) {
		var page_id = $(target).data('value');
		$('#post_table tbody').html('');
		$('.fb_loading').removeClass('hide');
		FB.api("/" + page_id + "?fields=access_token", function (res) {
			if (res.access_token) {
				config.pageToken = res.access_token;
			} else {
				config.pageToken = '';
			}
		});
		FB.api(config.apiVersion.newest + "/" + page_id + "/live_videos?fields=status,permalink_url,title,creation_time", function (res) {
			var thead = '';
			var _iteratorNormalCompletion30 = true;
			var _didIteratorError30 = false;
			var _iteratorError30 = undefined;

			try {
				for (var _iterator30 = res.data[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
					var tr = _step30.value;

					if (tr.status === 'LIVE') {
						thead += "<tr><td><button type=\"button\" onclick=\"page_selector.selectPost('" + tr.id + "')\">\u9078\u64C7\u8CBC\u6587</button>(LIVE)</td><td><a href=\"https://www.facebook.com" + tr.permalink_url + "\" target=\"_blank\">" + tr.title + "</a></td><td>" + timeConverter(tr.created_time) + "</td></tr>";
					} else {
						thead += "<tr><td><button type=\"button\" onclick=\"page_selector.selectPost('" + tr.id + "')\">\u9078\u64C7\u8CBC\u6587</button></td><td><a href=\"https://www.facebook.com" + tr.permalink_url + "\" target=\"_blank\">" + tr.title + "</a></td><td>" + timeConverter(tr.created_time) + "</td></tr>";
					}
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

			$('#post_table thead').html(thead);
		});
		FB.api(config.apiVersion.newest + "/" + page_id + "/feed?limit=100", function (res) {
			$('.fb_loading').addClass('hide');
			var tbody = '';
			var _iteratorNormalCompletion31 = true;
			var _didIteratorError31 = false;
			var _iteratorError31 = undefined;

			try {
				for (var _iterator31 = res.data[Symbol.iterator](), _step31; !(_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done); _iteratorNormalCompletion31 = true) {
					var tr = _step31.value;

					tbody += "<tr><td><button type=\"button\" onclick=\"page_selector.selectPost('" + tr.id + "')\">\u9078\u64C7\u8CBC\u6587</button></td><td><a href=\"https://www.facebook.com/" + tr.id + "\" target=\"_blank\">" + tr.message + "</a></td><td>" + timeConverter(tr.created_time) + "</td></tr>";
				}
			} catch (err) {
				_didIteratorError31 = true;
				_iteratorError31 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion31 && _iterator31.return) {
						_iterator31.return();
					}
				} finally {
					if (_didIteratorError31) {
						throw _iteratorError31;
					}
				}
			}

			$('#post_table tbody').html(tbody);
		});
	},
	selectPost: function selectPost(fbid) {
		$('.page_selector').addClass('hide');
		$('.select_page').html('');
		$('.select_group').html('');
		$('#post_table tbody').html('');
		data.start(fbid);
	}
};

var _filter = {
	totalFilter: function totalFilter(raw, command, isDuplicate, isTag, word, react, endTime) {
		var data = raw;
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
		if (isDuplicate) {
			data = _filter.unique(data);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJoYXNoIiwibG9jYXRpb24iLCJpbmRleE9mIiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInNlc3Npb25TdG9yYWdlIiwiYWxlcnQiLCJocmVmIiwibGFzdERhdGEiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwiZGF0YSIsImZpbmlzaCIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJlIiwiZ2V0QXV0aCIsImN0cmxLZXkiLCJhbHRLZXkiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImV4Y2VsU3RyaW5nIiwiZXhjZWwiLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGlrZXMiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJvcmRlciIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJuZXh0IiwidHlwZSIsIkZCIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsImF1dGhfdHlwZSIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiZmJpZCIsInBhZ2Vfc2VsZWN0b3IiLCJzaG93Iiwib3B0aW9ucyIsImh0bWwiLCJzZWxlY3RQYWdlIiwidGFyIiwiYXR0ciIsInNldFRva2VuIiwic3RlcCIsInN0ZXAxIiwicGFnZWlkIiwicGFnZXMiLCJpIiwiaWQiLCJhY2Nlc3NfdG9rZW4iLCJoaWRkZW5TdGFydCIsInBhZ2VJRCIsInNwbGl0IiwiYXBpIiwicmVzIiwiZXJyb3IiLCJjbGVhciIsImVtcHR5IiwiZmluZCIsImNvbW1hbmQiLCJsZW5ndGgiLCJwYWdpbmciLCJzdHIiLCJnZW5EYXRhIiwibWVzc2FnZSIsInJlY29tbWFuZCIsImdlbkNhcmQiLCJvYmoiLCJpZHMiLCJsaW5rIiwibWVzcyIsInJlcGxhY2UiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwic3JjIiwiZnVsbF9waWN0dXJlIiwiZ2V0TWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImFyciIsImdldFBhZ2UiLCJnZXRHcm91cCIsIml0ZW0iLCJhZG1pbmlzdHJhdG9yIiwiZXh0ZW5zaW9uQXV0aCIsImV4dGVuc2lvbkNhbGxiYWNrIiwic2V0SXRlbSIsImV4dGVuZCIsImZpZCIsInB1c2giLCJmcm9tIiwicHJvbWlzZV9hcnJheSIsIm5hbWVzIiwicHJvbWlzZSIsImdldE5hbWUiLCJ0aGVuIiwiT2JqZWN0Iiwia2V5cyIsInBvc3RkYXRhIiwic3RvcnkiLCJwb3N0bGluayIsImxpa2VfY291bnQiLCJhbGwiLCJuYW1lIiwic3dhbCIsInRpdGxlIiwiZG9uZSIsInRvU3RyaW5nIiwic2Nyb2xsVG9wIiwic3RlcDIiLCJmdWxsSUQiLCJmaWx0ZXJlZCIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInRlc3QiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImNvbW1hbmRzIiwidGVtcF9kYXRhIiwiZ2V0IiwiZGF0YXMiLCJzaGFyZUVycm9yIiwiYXBpX2ZiaWQiLCJkIiwidXBkYXRlZF90aW1lIiwiZ2V0TmV4dCIsImdldEpTT04iLCJmYWlsIiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJwcm9wIiwia2V5IiwiaXNUYWciLCJuZXdEYXRhIiwidG90YWxGaWx0ZXIiLCJvYmoyQXJyYXkiLCJuZXdPYmoiLCJlYWNoIiwidG1wIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwicGljIiwidGhlYWQiLCJ0Ym9keSIsImVudHJpZXMiLCJqIiwicGljdHVyZSIsInRkIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYW5kIiwib3IiLCJpZ25vcmUiLCJiYXNlIiwiZmluYWwiLCJjb21wYXJlX251bSIsInNvcnQiLCJhIiwiYiIsIm1hdGNoIiwidGVtcCIsInRlbXBfbmFtZSIsImRhdGFfYW5kIiwiZGF0YV9vciIsInRib2R5MiIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsImN0cmwiLCJuIiwicGFyc2VJbnQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsInRlbXBBcnIiLCJjb2x1bW4iLCJpbmRleCIsInJvdyIsIm5vZGUiLCJpbm5lckhUTUwiLCJrIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJncm91cHMiLCJnZXRBZG1pbiIsImdlbkFkbWluIiwicGFnZV9pZCIsInBlcm1hbGlua191cmwiLCJzZWxlY3RQb3N0IiwidGFnIiwidGltZSIsInVuaXF1ZSIsIm91dHB1dCIsImZvckVhY2giLCJuZXdBcnkiLCJncmVwIiwibWVzc2FnZV90YWdzIiwidCIsInRpbWVfYXJ5IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwidWkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJtYXAiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFlQyxTQUFmOztBQUVBLFNBQVNBLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXVCQyxHQUF2QixFQUEyQkMsQ0FBM0IsRUFDQTtBQUNDLEtBQUksQ0FBQ04sWUFBTCxFQUFrQjtBQUNqQk8sVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWdELDRCQUFoRDtBQUNBQyxJQUFFLGlCQUFGLEVBQXFCQyxNQUFyQjtBQUNBVixpQkFBZSxJQUFmO0FBQ0E7QUFDRCxRQUFPLEtBQVA7QUFDQTtBQUNEUyxFQUFFRSxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUMzQixLQUFJQyxXQUFXLENBQWY7QUFDQUosR0FBRSxRQUFGLEVBQVlLLEtBQVosQ0FBa0IsWUFBVTtBQUMzQkQ7QUFDQSxNQUFJQSxZQUFZLENBQWhCLEVBQWtCO0FBQ2pCSixLQUFFLFFBQUYsRUFBWU0sR0FBWixDQUFnQixPQUFoQjtBQUNBTixLQUFFLDBCQUFGLEVBQThCTyxXQUE5QixDQUEwQyxNQUExQztBQUNBO0FBQ0QsRUFORDs7QUFRQSxLQUFJQyxPQUFPQyxTQUFTRCxJ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QUFNb0QsUUFBUXZNLENBQVIsRUFBV2tKLEtBQVgsQ0FBTixHQUEwQixJQUFqQztBQUNIOztBQUVEQyxNQUFJc0QsS0FBSixDQUFVLENBQVYsRUFBYXRELElBQUl0SSxNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQTJMLFNBQU9yRCxNQUFNLE1BQWI7QUFDSDs7QUFFRCxLQUFJcUQsT0FBTyxFQUFYLEVBQWU7QUFDWHRTLFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJd1MsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWUwsWUFBWTdLLE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUltTCxNQUFNLHVDQUF1Q0MsVUFBVUosR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUlsTCxPQUFPaEksU0FBU3VULGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBdkwsTUFBS25ILElBQUwsR0FBWXdTLEdBQVo7O0FBRUE7QUFDQXJMLE1BQUt3TCxLQUFMLEdBQWEsbUJBQWI7QUFDQXhMLE1BQUt5TCxRQUFMLEdBQWdCTCxXQUFXLE1BQTNCOztBQUVBO0FBQ0FwVCxVQUFTMFQsSUFBVCxDQUFjQyxXQUFkLENBQTBCM0wsSUFBMUI7QUFDQUEsTUFBSzdILEtBQUw7QUFDQUgsVUFBUzBULElBQVQsQ0FBY0UsV0FBZCxDQUEwQjVMLElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0bGV0IGhpZGVhcmVhID0gMDtcclxuXHQkKCdoZWFkZXInKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aGlkZWFyZWErKztcclxuXHRcdGlmIChoaWRlYXJlYSA+PSA1KXtcclxuXHRcdFx0JCgnaGVhZGVyJykub2ZmKCdjbGljaycpO1xyXG5cdFx0XHQkKCcjZmJpZF9idXR0b24sICNwdXJlX2ZiaWQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImNsZWFyXCIpID49IDApe1xyXG5cdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3JhdycpO1xyXG5cdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnbG9naW4nKTtcclxuXHRcdGFsZXJ0KCflt7LmuIXpmaTmmqvlrZjvvIzoq4vph43mlrDpgLLooYznmbvlhaUnKTtcclxuXHRcdGxvY2F0aW9uLmhyZWYgPSAnaHR0cHM6Ly9nZzkwMDUyLmdpdGh1Yi5pby9jb21tZW50X2hlbHBlcl9wbHVzJztcclxuXHR9XHJcblx0bGV0IGxhc3REYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJhd1wiKSk7XHJcblxyXG5cdGlmIChsYXN0RGF0YSl7XHJcblx0XHRkYXRhLmZpbmlzaChsYXN0RGF0YSk7XHJcblx0fVxyXG5cdGlmIChzZXNzaW9uU3RvcmFnZS5sb2dpbil7XHJcblx0XHRmYi5nZW5PcHRpb24oSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbikpO1xyXG5cdH1cclxuXHJcblx0Ly8gJChcIi50YWJsZXMgPiAuc2hhcmVkcG9zdHMgYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdC8vIFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0Ly8gXHRcdGZiLmV4dGVuc2lvbkF1dGgoJ2ltcG9ydCcpO1xyXG5cdC8vIFx0fWVsc2V7XHJcblx0Ly8gXHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9KTtcclxuXHRcclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX3N0YXJ0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHRjaG9vc2UuaW5pdCh0cnVlKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8ICFlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLopIfoo73ooajmoLzlhaflrrlcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudGFibGVzIC5maWx0ZXJzIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcuY29tcGFyZV9jb25kaXRpb24nKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlIHRhYmxlJykucmVtb3ZlQ2xhc3MoJ3RhYmxlLWFjdGl2ZScpO1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuJysgJCh0aGlzKS52YWwoKSkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLicrICQodGhpcykudmFsKCkgKyAnIHRhYmxlJykuYWRkQ2xhc3MoJ3RhYmxlLWFjdGl2ZScpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwic2luZ2xlRGF0ZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZLU1NLUREICAgSEg6bW1cIixcclxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXHJcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxyXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXHJcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxyXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxyXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcclxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcclxuXHRcdFx0XCLml6VcIixcclxuXHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XCLkuoxcIixcclxuXHRcdFx0XCLkuIlcIixcclxuXHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XCLkupRcIixcclxuXHRcdFx0XCLlha1cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xyXG5cdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcIuS6jOaciFwiLFxyXG5cdFx0XHRcIuS4ieaciFwiLFxyXG5cdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcIuS6lOaciFwiLFxyXG5cdFx0XHRcIuWFreaciFwiLFxyXG5cdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcIuWFq+aciFwiLFxyXG5cdFx0XHRcIuS5neaciFwiLFxyXG5cdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcIuWNgeS4gOaciFwiLFxyXG5cdFx0XHRcIuWNgeS6jOaciFwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwiZmlyc3REYXlcIjogMVxyXG5cdFx0fSxcclxuXHR9LGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSl7XHJcblx0XHRcdGxldCBkZDtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YVt0YWIubm93XSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIGRkO1xyXG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHRcdFx0d2luZG93LmZvY3VzKCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Ly8gaWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCl7XHJcblx0XHRcdC8vIFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdC8vIH1lbHNle1xyXG5cdFx0XHQvLyBcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHQvLyBcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHQvLyBcdH1lbHNle1xyXG5cdFx0XHQvLyBcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YVt0YWIubm93XSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdC8vIFx0fVxyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcblxyXG5cdGxldCBjaV9jb3VudGVyID0gMDtcclxuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSl7XHJcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdH1cclxuXHRcdGlmKGUuY3RybEtleSl7XHJcblx0XHRcdGZiLmdldEF1dGgoJ3NoYXJlZHBvc3RzJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZScsJ2Zyb20nLCdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCdmcm9tJywnbWVzc2FnZScsJ3N0b3J5J10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnLFxyXG5cdFx0bGlrZXM6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3Y3LjAnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjcuMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJ3Y3LjAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjcuMCcsXHJcblx0XHRmZWVkOiAndjcuMCcsXHJcblx0XHRncm91cDogJ3Y3LjAnLFxyXG5cdFx0bmV3ZXN0OiAndjcuMCdcclxuXHR9LFxyXG5cdGZpbHRlcjoge1xyXG5cdFx0d29yZDogJycsXHJcblx0XHRyZWFjdDogJ2FsbCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnJyxcclxuXHRhdXRoOiAnZ3JvdXBzX3Nob3dfbGlzdCwgcGFnZXNfc2hvd19saXN0LCBwYWdlc19yZWFkX2VuZ2FnZW1lbnQsIHBhZ2VzX3JlYWRfdXNlcl9jb250ZW50LGdyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cGFnZVRva2VuOiAnJyxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdG5leHQ6ICcnLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRhdXRoX3R5cGU6ICdyZXJlcXVlc3QnLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRcdC8vIGlmIChhdXRoU3RyLmluY2x1ZGVzKCdncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJykpe1xyXG5cdFx0XHRcdC8vIFx0ZmIuc3RhcnQoKTtcclxuXHRcdFx0XHQvLyB9ZWxzZXtcclxuXHRcdFx0XHQvLyBcdHN3YWwoXHJcblx0XHRcdFx0Ly8gXHRcdCfku5josrvmjojmrIrmqqLmn6XpjK/oqqTvvIzoqbLlip/og73pnIDku5josrsnLFxyXG5cdFx0XHRcdC8vIFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIEl0IGlzIGEgcGFpZCBmZWF0dXJlLicsXHJcblx0XHRcdFx0Ly8gXHRcdCdlcnJvcidcclxuXHRcdFx0XHQvLyBcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRmYi5zdGFydCgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRwYWdlX3NlbGVjdG9yLnNob3coKTtcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCBvcHRpb25zID0gYFxyXG5cdFx0PGJ1dHRvbiBjbGFzcz1cImJ0blwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNob3coKVwiPuW+nueyiee1suWwiOmggS/npL7lnJjpgbjmk4fosrzmloc8L2J1dHRvbj48YnI+XHJcblx0XHQ8aW5wdXQgaWQ9XCJwdXJlX2ZiaWRcIj5cclxuXHRcdDxidXR0b24gaWQ9XCJmYmlkX2J1dHRvblwiIGNsYXNzPVwiYnRuXCIgb25jbGljaz1cImZiLmhpZGRlblN0YXJ0KHRoaXMpXCI+55SxRkJJROaTt+WPljwvYnV0dG9uPlxyXG5cdFx0PGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIG9uY2xpY2s9XCJkYXRhLmZpbmlzaChkYXRhLnJhdylcIiBzdHlsZT1cIm1hcmdpbi1sZWZ0OjIwcHg7XCI+5by35Yi26Lez6L2J5Yiw6KGo5qC8PC9hPjxicj5gO1xyXG5cdFx0bGV0IHR5cGUgPSAtMTtcclxuXHRcdCQoJyNidG5fc3RhcnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnI2VudGVyVVJMJykuaHRtbChvcHRpb25zKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdH0sXHJcblx0c2VsZWN0UGFnZTogKGUpPT57XHJcblx0XHQkKCcjZW50ZXJVUkwgLnBhZ2VfYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IHRhciA9ICQoZSk7XHJcblx0XHR0YXIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0aWYgKHRhci5hdHRyKCdhdHRyLXR5cGUnKSA9PSAxKXtcclxuXHRcdFx0ZmIuc2V0VG9rZW4odGFyLmF0dHIoJ2F0dHItdmFsdWUnKSk7XHJcblx0XHR9XHJcblx0XHRmYi5mZWVkKHRhci5hdHRyKCdhdHRyLXZhbHVlJyksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCk7XHJcblx0XHQkKCcuZm9yZmInKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnN0ZXAxJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdHN0ZXAuc3RlcDEoKTtcclxuXHR9LFxyXG5cdHNldFRva2VuOiAocGFnZWlkKT0+e1xyXG5cdFx0bGV0IHBhZ2VzID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbilbMV07XHJcblx0XHRmb3IobGV0IGkgb2YgcGFnZXMpe1xyXG5cdFx0XHRpZiAoaS5pZCA9PSBwYWdlaWQpe1xyXG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSBpLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0aGlkZGVuU3RhcnQ6IChlKT0+e1xyXG5cdFx0bGV0IGZiaWQgPSAkKCcjcHVyZV9mYmlkJykudmFsKCk7XHJcblx0XHRsZXQgcGFnZUlEID0gZmJpZC5zcGxpdCgnXycpWzBdO1xyXG5cdFx0RkIuYXBpKGAvJHtwYWdlSUR9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdGlmIChyZXMuZXJyb3Ipe1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKXtcclxuXHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQsICdsaXZlJyk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmZWVkOiAocGFnZUlELCB0eXBlLCB1cmwgPSAnJywgY2xlYXIgPSB0cnVlKT0+e1xyXG5cdFx0aWYgKGNsZWFyKXtcclxuXHRcdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHRcdCQoJy5mZWVkcyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5vZmYoJ2NsaWNrJykuY2xpY2soKCk9PntcclxuXHRcdFx0XHRsZXQgdGFyID0gJCgnI2VudGVyVVJMIHNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xyXG5cdFx0XHRcdGZiLmZlZWQodGFyLnZhbCgpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQsIGZhbHNlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRsZXQgY29tbWFuZCA9ICdmZWVkJztcclxuXHRcdGxldCBhcGk7XHJcblx0XHRpZiAodXJsID09ICcnKXtcclxuXHRcdFx0YXBpID0gYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VJRH0vJHtjb21tYW5kfT9maWVsZHM9ZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTI1YDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRhcGkgPSB1cmw7XHJcblx0XHR9XHJcblx0XHRGQi5hcGkoYXBpLCAocmVzKT0+e1xyXG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID09IDApe1xyXG5cdFx0XHRcdCQoJy5mZWVkcyAuYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmYi5uZXh0ID0gcmVzLnBhZ2luZy5uZXh0O1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdGxldCBzdHIgPSBnZW5EYXRhKGkpO1xyXG5cdFx0XHRcdCQoJy5zZWN0aW9uIC5mZWVkcyB0Ym9keScpLmFwcGVuZChzdHIpO1xyXG5cdFx0XHRcdGlmIChpLm1lc3NhZ2UgJiYgaS5tZXNzYWdlLmluZGV4T2YoJ+aKvScpID49IDApe1xyXG5cdFx0XHRcdFx0bGV0IHJlY29tbWFuZCA9IGdlbkNhcmQoaSk7XHJcblx0XHRcdFx0XHQkKCcuZG9uYXRlX2FyZWEgLnJlY29tbWFuZHMnKS5hcHBlbmQocmVjb21tYW5kKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdlbkRhdGEob2JqKXtcclxuXHRcdFx0Y29uc29sZS5sb2cob2JqKTtcclxuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XHJcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xyXG5cclxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0bGV0IHN0ciA9IGA8dHI+XHJcblx0XHRcdFx0XHRcdDx0ZD48ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgIG9uY2xpY2s9XCJkYXRhLnN0YXJ0KCcke29iai5pZH0nKVwiPumWi+WnizwvZGl2PjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bWVzc308L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKG9iai5jcmVhdGVkX3RpbWUpfTwvdGQ+XHJcblx0XHRcdFx0XHRcdDwvdHI+YDtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGdlbkNhcmQob2JqKXtcclxuXHRcdFx0bGV0IHNyYyA9IG9iai5mdWxsX3BpY3R1cmUgfHwgJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzAweDIyNSc7XHJcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xyXG5cdFx0XHRsZXQgbGluayA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJytpZHNbMF0rJy9wb3N0cy8nK2lkc1sxXTtcclxuXHRcdFx0XHJcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XHJcblx0XHRcdGxldFx0c3RyID0gYDxkaXYgY2xhc3M9XCJjYXJkXCI+XHJcblx0XHRcdDxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWltYWdlXCI+XHJcblx0XHRcdDxmaWd1cmUgY2xhc3M9XCJpbWFnZSBpcy00YnkzXCI+XHJcblx0XHRcdDxpbWcgc3JjPVwiJHtzcmN9XCIgYWx0PVwiXCI+XHJcblx0XHRcdDwvZmlndXJlPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9hPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1jb250ZW50XCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcblx0XHRcdCR7bWVzc31cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwicGlja1wiIGF0dHItdmFsPVwiJHtvYmouaWR9XCIgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+XHJcblx0XHRcdDwvZGl2PmA7XHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRNZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XHJcblx0XHRcdFx0bGV0IGFyciA9IFtyZXNdO1xyXG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9maWVsZHM9bmFtZSxpZCxhZG1pbmlzdHJhdG9yJmxpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZSAocmVzLmRhdGEuZmlsdGVyKGl0ZW09PntyZXR1cm4gaXRlbS5hZG1pbmlzdHJhdG9yID09PSB0cnVlfSkpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQXV0aDogKGNvbW1hbmQgPSAnJyk9PntcclxuXHRcdC8vIGxldCByZXNwb25zZSA9IHtcclxuXHRcdC8vIFx0c3RhdHVzOiAnY29ubmVjdGVkJyxcclxuXHRcdC8vIFx0YXV0aFJlc3BvbnNlOntcclxuXHRcdC8vIFx0XHRncmFudGVkU2NvcGVzOiAnZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycsXHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIH1cclxuXHRcdC8vIGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlLCBjb21tYW5kKTtcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlLCBjb21tYW5kKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkNhbGxiYWNrOiAocmVzcG9uc2UsIGNvbW1hbmQgPSAnJyk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSA+PSAwKXtcclxuXHRcdFx0XHRkYXRhLnJhdy5leHRlbnNpb24gPSB0cnVlO1xyXG5cdFx0XHRcdGlmIChjb21tYW5kID09ICdpbXBvcnQnKXtcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2hhcmVkcG9zdHNcIiwgJCgnI2ltcG9ydCcpLnZhbCgpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IGV4dGVuZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaGFyZWRwb3N0c1wiKSk7XHJcblx0XHRcdFx0bGV0IGZpZCA9IFtdO1xyXG5cdFx0XHRcdGxldCBpZHMgPSBbXTtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdGZpZC5wdXNoKGkuZnJvbS5pZCk7XHJcblx0XHRcdFx0XHRpZiAoZmlkLmxlbmd0aCA+PTQ1KXtcclxuXHRcdFx0XHRcdFx0aWRzLnB1c2goZmlkKTtcclxuXHRcdFx0XHRcdFx0ZmlkID0gW107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlkcy5wdXNoKGZpZCk7XHJcblx0XHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXSwgbmFtZXMgPSB7fTtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgaWRzKXtcclxuXHRcdFx0XHRcdGxldCBwcm9taXNlID0gZmIuZ2V0TmFtZShpKS50aGVuKChyZXMpPT57XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBPYmplY3Qua2V5cyhyZXMpKXtcclxuXHRcdFx0XHRcdFx0XHRuYW1lc1tpXSA9IHJlc1tpXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRwcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBwb3N0ZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnBvc3RkYXRhKTtcclxuXHRcdFx0XHRpZiAoY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0XHRcdGlmIChwb3N0ZGF0YS50eXBlID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHRcdC8vIEZCLmFwaShcIi9tZVwiLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWYgKHJlcy5uYW1lID09PSBwb3N0ZGF0YS5vd25lcikge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGkubWVzc2FnZSA9IGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aS5saWtlX2NvdW50ID0gJ04vQSc7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0dGl0bGU6ICflgIvkurrosrzmloflj6rmnInnmbzmlofogIXmnKzkurrog73mipMnLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRodG1sOiBg6LK85paH5biz6Jmf5ZCN56ix77yaJHtwb3N0ZGF0YS5vd25lcn08YnI+55uu5YmN5biz6Jmf5ZCN56ix77yaJHtyZXMubmFtZX1gLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdC8vIH0pO1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRpLmxpa2VfY291bnQgPSAnTi9BJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fWVsc2UgaWYocG9zdGRhdGEudHlwZSA9PT0gJ2dyb3VwJyl7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGkubGlrZV9jb3VudCA9ICdOL0EnO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0aS5saWtlX2NvdW50ID0gJ04vQSc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdGlmIChwb3N0ZGF0YS50eXBlID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHRcdC8vIEZCLmFwaShcIi9tZVwiLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWYgKHJlcy5uYW1lID09PSBwb3N0ZGF0YS5vd25lcikge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRkZWxldGUgaS5jcmVhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRkZWxldGUgaS5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpLnR5cGUgPSAnTElLRSc7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0dGl0bGU6ICflgIvkurrosrzmloflj6rmnInnmbzmlofogIXmnKzkurrog73mipMnLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRodG1sOiBg6LK85paH5biz6Jmf5ZCN56ix77yaJHtwb3N0ZGF0YS5vd25lcn08YnI+55uu5YmN5biz6Jmf5ZCN56ix77yaJHtyZXMubmFtZX1gLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdC8vIH0pO1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5jcmVhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fWVsc2UgaWYocG9zdGRhdGEudHlwZSA9PT0gJ2dyb3VwJyl7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmNyZWF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuY3JlYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFByb21pc2UuYWxsKHByb21pc2VfYXJyYXkpLnRoZW4oKCk9PntcclxuXHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRpLmZyb20ubmFtZSA9IG5hbWVzW2kuZnJvbS5pZF0gPyBuYW1lc1tpLmZyb20uaWRdLm5hbWUgOiBpLmZyb20ubmFtZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGRhdGEucmF3LmRhdGFbY29tbWFuZF0gPSBleHRlbmQ7XHJcblx0XHRcdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldE5hbWU6IChpZHMpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vP2lkcz0ke2lkcy50b1N0cmluZygpfWAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5sZXQgc3RlcCA9IHtcclxuXHRzdGVwMTogKCk9PntcclxuXHRcdCQoJy5zZWN0aW9uJykucmVtb3ZlQ2xhc3MoJ3N0ZXAyJyk7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XHJcblx0fSxcclxuXHRzdGVwMjogKCk9PntcclxuXHRcdCQoJy5mb3JmYicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcclxuXHRcdCQoJy5zZWN0aW9uJykuYWRkQ2xhc3MoJ3N0ZXAyJyk7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IHtkYXRhOntcclxuXHRcdGZ1bGxJRDogJycsXHJcblx0XHRjb21tZW50czogW10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFtdLFxyXG5cdH19LFxyXG5cdGZpbHRlcmVkOiB7fSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdHRlc3Q6IChpZCk9PntcclxuXHRcdGNvbnNvbGUubG9nKGlkKTtcclxuXHR9LFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKT0+e1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRmdWxsSUQ6IGZiaWRcclxuXHRcdH1cclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgY29tbWFuZHMgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJ107XHJcblx0XHRsZXQgdGVtcF9kYXRhID0gb2JqO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGNvbW1hbmRzKXtcclxuXHRcdFx0dGVtcF9kYXRhLmRhdGEgPSB7fTtcclxuXHRcdFx0bGV0IHByb21pc2UgPSBkYXRhLmdldCh0ZW1wX2RhdGEsIGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHR0ZW1wX2RhdGEuZGF0YVtpXSA9IHJlcztcclxuXHRcdFx0fSk7XHJcblx0XHRcdGRhdGEucHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdFByb21pc2UuYWxsKGRhdGEucHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRkYXRhLmZpbmlzaCh0ZW1wX2RhdGEpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkLCBjb21tYW5kKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgc2hhcmVFcnJvciA9IDA7XHJcblx0XHRcdGxldCBhcGlfZmJpZCA9IGZiaWQuZnVsbElEO1xyXG5cdFx0XHQvLyBpZiAoJCgnLnBhZ2VfYnRuLmFjdGl2ZScpLmF0dHIoJ2F0dHItdHlwZScpID09IDIpe1xyXG5cdFx0XHQvLyBcdGFwaV9mYmlkID0gZmJpZC5mdWxsSUQuc3BsaXQoJ18nKVsxXTtcclxuXHRcdFx0Ly8gXHRpZiAoY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycpIGNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpIGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHRGQi5hcGkoYCR7YXBpX2ZiaWR9LyR7Y29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbY29tbWFuZF19Jm9yZGVyPWNocm9ub2xvZ2ljYWwmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9YCwocmVzKT0+e1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XHJcblx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XHJcblx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdHN0ZXAuc3RlcDIoKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0JCgnLnJlc3VsdF9hcmVhID4gLnRpdGxlIHNwYW4nKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmF3XCIsIEpTT04uc3RyaW5naWZ5KGZiaWQpKTtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XHJcblx0XHRkYXRhLmZpbHRlcmVkID0ge307XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHJhd0RhdGEuZGF0YSkpe1xyXG5cdFx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdFx0aWYgKGtleSA9PT0gJ3JlYWN0aW9ucycpIGlzVGFnID0gZmFsc2U7XHJcblx0XHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEuZGF0YVtrZXldLCBrZXksIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcdFxyXG5cdFx0XHRkYXRhLmZpbHRlcmVkW2tleV0gPSBuZXdEYXRhO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKXtcclxuXHRcdFx0dGFibGUuZ2VuZXJhdGUoZGF0YS5maWx0ZXJlZCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIGRhdGEuZmlsdGVyZWQ7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdyk9PntcclxuXHRcdHZhciBuZXdPYmogPSBbXTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbil7XHJcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLlv4Pmg4VcIiA6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCIgOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKT0+e1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9PntcclxuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJlZCA9IHJhd2RhdGE7XHJcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoZmlsdGVyZWQpKXtcclxuXHRcdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0XHRpZihrZXkgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5b+D5oOFPC90ZD5gO1xyXG5cdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmVkW2tleV0uZW50cmllcygpKXtcclxuXHRcdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRcdGlmIChwaWMpe1xyXG5cdFx0XHRcdFx0Ly8gcGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdFx0PHRkPjxhIGhyZWY9J2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8IHZhbC5zdG9yeX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2V9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHRcdCQoXCIudGFibGVzIC5cIitrZXkrXCIgdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGFjdGl2ZSgpO1xyXG5cdFx0dGFiLmluaXQoKTtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBhcnIgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNvbXBhcmUgPSB7XHJcblx0YW5kOiBbXSxcclxuXHRvcjogW10sXHJcblx0cmF3OiBbXSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0Y29tcGFyZS5hbmQgPSBbXTtcclxuXHRcdGNvbXBhcmUub3IgPSBbXTtcclxuXHRcdGNvbXBhcmUucmF3ID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0bGV0IGlnbm9yZSA9ICQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLnZhbCgpO1xyXG5cdFx0bGV0IGJhc2UgPSBbXTtcclxuXHRcdGxldCBmaW5hbCA9IFtdO1xyXG5cdFx0bGV0IGNvbXBhcmVfbnVtID0gMTtcclxuXHRcdGlmIChpZ25vcmUgPT09ICdpZ25vcmUnKSBjb21wYXJlX251bSA9IDI7XHJcblxyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoY29tcGFyZS5yYXcpKXtcclxuXHRcdFx0aWYgKGtleSAhPT0gaWdub3JlKXtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgY29tcGFyZS5yYXdba2V5XSl7XHJcblx0XHRcdFx0XHRiYXNlLnB1c2goaSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRsZXQgc29ydCA9IChkYXRhLnJhdy5leHRlbnNpb24pID8gJ25hbWUnOidpZCc7XHJcblx0XHRiYXNlID0gYmFzZS5zb3J0KChhLGIpPT57XHJcblx0XHRcdHJldHVybiBhLmZyb21bc29ydF0gPiBiLmZyb21bc29ydF0gPyAxOi0xO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Zm9yKGxldCBpIG9mIGJhc2Upe1xyXG5cdFx0XHRpLm1hdGNoID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0bGV0IHRlbXBfbmFtZSA9ICcnO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coYmFzZSk7XHJcblx0XHRmb3IobGV0IGkgaW4gYmFzZSl7XHJcblx0XHRcdGxldCBvYmogPSBiYXNlW2ldO1xyXG5cdFx0XHRpZiAob2JqLmZyb20uaWQgPT0gdGVtcCB8fCAoZGF0YS5yYXcuZXh0ZW5zaW9uICYmIChvYmouZnJvbS5uYW1lID09IHRlbXBfbmFtZSkpKXtcclxuXHRcdFx0XHRsZXQgdGFyID0gZmluYWxbZmluYWwubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdHRhci5tYXRjaCsrO1xyXG5cdFx0XHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKG9iaikpe1xyXG5cdFx0XHRcdFx0aWYgKCF0YXJba2V5XSkgdGFyW2tleV0gPSBvYmpba2V5XTsgLy/lkIjkvbXos4fmlplcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRhci5tYXRjaCA9PSBjb21wYXJlX251bSl7XHJcblx0XHRcdFx0XHR0ZW1wX25hbWUgPSAnJztcclxuXHRcdFx0XHRcdHRlbXAgPSAnJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZpbmFsLnB1c2gob2JqKTtcclxuXHRcdFx0XHR0ZW1wID0gb2JqLmZyb20uaWQ7XHJcblx0XHRcdFx0dGVtcF9uYW1lID0gb2JqLmZyb20ubmFtZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdFxyXG5cdFx0Y29tcGFyZS5vciA9IGZpbmFsO1xyXG5cdFx0Y29tcGFyZS5hbmQgPSBjb21wYXJlLm9yLmZpbHRlcigodmFsKT0+e1xyXG5cdFx0XHRyZXR1cm4gdmFsLm1hdGNoID09IGNvbXBhcmVfbnVtO1xyXG5cdFx0fSk7XHJcblx0XHRjb21wYXJlLmdlbmVyYXRlKCk7XHJcblx0fSxcclxuXHRnZW5lcmF0ZTogKCk9PntcclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZGF0YV9hbmQgPSBjb21wYXJlLmFuZDtcclxuXHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9hbmQuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnMCd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS5hbmQgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHJcblx0XHRsZXQgZGF0YV9vciA9IGNvbXBhcmUub3I7XHJcblx0XHRsZXQgdGJvZHkyID0gJyc7XHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfb3IuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5MiArPSB0cjtcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS5vciB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkyKTtcclxuXHRcdFxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBhcnIgPSBbJ2FuZCcsJ29yJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKGN0cmwgPSBmYWxzZSk9PntcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcclxuXHRcdGNob29zZS5saXN0ID0gW107XHJcblx0XHRjaG9vc2UubnVtID0gMDtcclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKXtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKGN0cmwpO1xyXG5cdH0sXHJcblx0Z286IChjdHJsKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSB0YWIubm93O1xyXG5cdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGFbY29tbWFuZF0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcdFxyXG5cdFx0fVxyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0bGV0IHRlbXBBcnIgPSBbXTtcclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKXtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5jb2x1bW4oMikuZGF0YSgpLmVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KXtcclxuXHRcdFx0XHRsZXQgd29yZCA9ICQoJy5zZWFyY2hDb21tZW50JykudmFsKCk7XHJcblx0XHRcdFx0aWYgKHZhbHVlLmluZGV4T2Yod29yZCkgPj0gMCkgdGVtcEFyci5wdXNoKGluZGV4KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcclxuXHRcdFx0bGV0IHJvdyA9ICh0ZW1wQXJyLmxlbmd0aCA9PSAwKSA/IGk6dGVtcEFycltpXTtcclxuXHRcdFx0bGV0IHRhciA9ICQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkucm93KHJvdykubm9kZSgpLmlubmVySFRNTDtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHI+JyArIHRhciArICc8L3RyPic7XHJcblx0XHR9XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0aWYgKCFjdHJsKXtcclxuXHRcdFx0JChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdC8vIGxldCB0YXIgPSAkKHRoaXMpLmZpbmQoJ3RkJykuZXEoMSk7XHJcblx0XHRcdFx0Ly8gbGV0IGlkID0gdGFyLmZpbmQoJ2EnKS5hdHRyKCdhdHRyLWZiaWQnKTtcclxuXHRcdFx0XHQvLyB0YXIucHJlcGVuZChgPGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke2lkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHJcblx0XHRpZihjaG9vc2UuZGV0YWlsKXtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvcihsZXQgayBpbiBjaG9vc2UubGlzdCl7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI3XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9LFxyXG59XHJcblxyXG5sZXQgcGFnZV9zZWxlY3RvciA9IHtcclxuXHRwYWdlczogW10sXHJcblx0Z3JvdXBzOiBbXSxcclxuXHRzaG93OiAoKT0+e1xyXG5cdFx0JCgnLnBhZ2Vfc2VsZWN0b3InKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0cGFnZV9zZWxlY3Rvci5nZXRBZG1pbigpO1xyXG5cdH0sXHJcblx0aGlkZTogKCk9PntcclxuXHRcdCQoJy5wYWdlX3NlbGVjdG9yJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHR9LFxyXG5cdGdldEFkbWluOiAoKT0+e1xyXG5cdFx0UHJvbWlzZS5hbGwoW3BhZ2Vfc2VsZWN0b3IuZ2V0UGFnZSgpLCBwYWdlX3NlbGVjdG9yLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XHJcblx0XHRcdHBhZ2Vfc2VsZWN0b3IuZ2VuQWRtaW4ocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2ZpZWxkcz1uYW1lLGlkLGFkbWluaXN0cmF0b3ImbGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlIChyZXMuZGF0YS5maWx0ZXIoaXRlbT0+e3JldHVybiBpdGVtLmFkbWluaXN0cmF0b3IgPT09IHRydWV9KSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5BZG1pbjogKHJlcyk9PntcclxuXHRcdGxldCBwYWdlcyA9ICcnO1xyXG5cdFx0bGV0IGdyb3VwcyA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJlc1swXSl7XHJcblx0XHRcdHBhZ2VzICs9IGA8ZGl2IGNsYXNzPVwicGFnZV9idG5cIiBkYXRhLXR5cGU9XCIxXCIgZGF0YS12YWx1ZT1cIiR7aS5pZH1cIiBvbmNsaWNrPVwicGFnZV9zZWxlY3Rvci5zZWxlY3RQYWdlKHRoaXMpXCI+JHtpLm5hbWV9PC9kaXY+YDtcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiByZXNbMV0pe1xyXG5cdFx0XHRncm91cHMgKz0gYDxkaXYgY2xhc3M9XCJwYWdlX2J0blwiIGRhdGEtdHlwZT1cIjJcIiBkYXRhLXZhbHVlPVwiJHtpLmlkfVwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBhZ2UodGhpcylcIj4ke2kubmFtZX08L2Rpdj5gO1xyXG5cdFx0fVxyXG5cdFx0JCgnLnNlbGVjdF9wYWdlJykuaHRtbChwYWdlcyk7XHJcblx0XHQkKCcuc2VsZWN0X2dyb3VwJykuaHRtbChncm91cHMpO1xyXG5cdH0sXHJcblx0c2VsZWN0UGFnZTogKHRhcmdldCk9PntcclxuXHRcdGxldCBwYWdlX2lkID0gJCh0YXJnZXQpLmRhdGEoJ3ZhbHVlJyk7XHJcblx0XHQkKCcjcG9zdF90YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0JCgnLmZiX2xvYWRpbmcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0RkIuYXBpKGAvJHtwYWdlX2lkfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlX2lkfS9saXZlX3ZpZGVvcz9maWVsZHM9c3RhdHVzLHBlcm1hbGlua191cmwsdGl0bGUsY3JlYXRpb25fdGltZWAsIChyZXMpPT57XHJcblx0XHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0XHRmb3IobGV0IHRyIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRpZiAodHIuc3RhdHVzID09PSAnTElWRScpe1xyXG5cdFx0XHRcdFx0dGhlYWQgKz0gYDx0cj48dGQ+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UG9zdCgnJHt0ci5pZH0nKVwiPumBuOaTh+iyvOaWhzwvYnV0dG9uPihMSVZFKTwvdGQ+PHRkPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20ke3RyLnBlcm1hbGlua191cmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt0ci50aXRsZX08L2E+PC90ZD48dGQ+JHt0aW1lQ29udmVydGVyKHRyLmNyZWF0ZWRfdGltZSl9PC90ZD48L3RyPmA7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0aGVhZCArPSBgPHRyPjx0ZD48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbmNsaWNrPVwicGFnZV9zZWxlY3Rvci5zZWxlY3RQb3N0KCcke3RyLmlkfScpXCI+6YG45pOH6LK85paHPC9idXR0b24+PC90ZD48dGQ+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbSR7dHIucGVybWFsaW5rX3VybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3RyLnRpdGxlfTwvYT48L3RkPjx0ZD4ke3RpbWVDb252ZXJ0ZXIodHIuY3JlYXRlZF90aW1lKX08L3RkPjwvdHI+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnI3Bvc3RfdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdH0pO1xyXG5cdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlX2lkfS9mZWVkP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdCQoJy5mYl9sb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRcdGZvcihsZXQgdHIgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdHRib2R5ICs9IGA8dHI+PHRkPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBvc3QoJyR7dHIuaWR9JylcIj7pgbjmk4fosrzmloc8L2J1dHRvbj48L3RkPjx0ZD48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dHIuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt0ci5tZXNzYWdlfTwvYT48L3RkPjx0ZD4ke3RpbWVDb252ZXJ0ZXIodHIuY3JlYXRlZF90aW1lKX08L3RkPjwvdHI+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCcjcG9zdF90YWJsZSB0Ym9keScpLmh0bWwodGJvZHkpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzZWxlY3RQb3N0OiAoZmJpZCk9PntcclxuXHRcdCQoJy5wYWdlX3NlbGVjdG9yJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy5zZWxlY3RfcGFnZScpLmh0bWwoJycpO1xyXG5cdFx0JCgnLnNlbGVjdF9ncm91cCcpLmh0bWwoJycpO1xyXG5cdFx0JCgnI3Bvc3RfdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3LCBjb21tYW5kLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBlbmRUaW1lKT0+e1xyXG5cdFx0bGV0IGRhdGEgPSByYXc7XHJcblx0XHRpZiAod29yZCAhPT0gJycgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIGVuZFRpbWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzRHVwbGljYXRlKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgdCk9PntcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIil7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKT0+e1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpPT57XHJcblxyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYiA9IHtcclxuXHRub3c6IFwiY29tbWVudHNcIixcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHR0YWIubm93ID0gJCh0aGlzKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdFx0bGV0IHRhciA9ICQodGhpcykuaW5kZXgoKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLmVxKHRhcikuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRjb21wYXJlLmluaXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKXtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyK1wiLVwiK21vbnRoK1wiLVwiK2RhdGUrXCItXCIraG91citcIi1cIittaW4rXCItXCIrc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKXtcclxuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XHJcbiAgICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuICAgICBpZiAoZGF0ZSA8IDEwKXtcclxuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xyXG4gICAgIH1cclxuICAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuICAgICBpZiAoaG91ciA8IDEwKXtcclxuICAgICBcdGhvdXIgPSBcIjBcIitob3VyO1xyXG4gICAgIH1cclxuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcbiAgICAgaWYgKG1pbiA8IDEwKXtcclxuICAgICBcdG1pbiA9IFwiMFwiK21pbjtcclxuICAgICB9XHJcbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG4gICAgIGlmIChzZWMgPCAxMCl7XHJcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XHJcbiAgICAgfVxyXG4gICAgIHZhciB0aW1lID0geWVhcisnLScrbW9udGgrJy0nK2RhdGUrXCIgXCIraG91cisnOicrbWluKyc6JytzZWMgO1xyXG4gICAgIHJldHVybiB0aW1lO1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xyXG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG4gXHRcdHJldHVybiBbdmFsdWVdO1xyXG4gXHR9KTtcclxuIFx0cmV0dXJuIGFycmF5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuIFx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG4gXHR2YXIgaSwgciwgdDtcclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0YXJ5W2ldID0gaTtcclxuIFx0fVxyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcbiBcdFx0dCA9IGFyeVtyXTtcclxuIFx0XHRhcnlbcl0gPSBhcnlbaV07XHJcbiBcdFx0YXJ5W2ldID0gdDtcclxuIFx0fVxyXG4gXHRyZXR1cm4gYXJ5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuICAgIFxyXG4gICAgdmFyIENTViA9ICcnOyAgICBcclxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG4gICAgXHJcbiAgICAvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG4gICAgaWYgKFNob3dMYWJlbCkge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcclxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXHJcbiAgICBcclxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG4gICAgXHJcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcbiAgICBcclxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxyXG4gICAgbGluay5ocmVmID0gdXJpO1xyXG4gICAgXHJcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG4gICAgbGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG4gICAgXHJcbiAgICAvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgIGxpbmsuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
