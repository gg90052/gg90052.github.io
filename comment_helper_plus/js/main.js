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
		comments: 'v6.0',
		reactions: 'v6.0',
		sharedposts: 'v6.0',
		url_comments: 'v6.0',
		feed: 'v6.0',
		group: 'v6.0',
		newest: 'v6.0'
	},
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	order: '',
	auth: 'manage_pages,groups_access_member_info',
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
				if (authStr.includes('groups_access_member_info')) {
					fb.start();
				} else {
					swal('付費授權檢查錯誤，該功能需付費', 'Authorization Failed! It is a paid feature.', 'error').done();
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
		var options = "<input id=\"pure_fbid\" class=\"hide\">\n\t\t<button id=\"fbid_button\" class=\"btn hide\" onclick=\"fb.hiddenStart(this)\">\u7531FBID\u64F7\u53D6</button>\n\t\t<label><input type=\"checkbox\" onchange=\"fb.optionDisplay(this)\">\u96B1\u85CF\u5217\u8868</label>\n\t\t<a href=\"javascript:;\" onclick=\"data.finish(data.raw)\" style=\"margin-left:20px;\">\u5F37\u5236\u8DF3\u8F49\u5230\u8868\u683C</a><br>";
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
		$('.forfb').addClass('hide');
		$('.step1').removeClass('hide');
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
			var api_fbid = fbid.fullID;
			// if ($('.page_btn.active').attr('attr-type') == 2){
			// 	api_fbid = fbid.fullID.split('_')[1];
			// 	if (command === 'reactions') command = 'likes';
			// }
			if (fbid.type === 'group') command = 'group';
			FB.api(api_fbid + "/" + command + "?limit=" + config.limit[command] + "&order=chronological&access_token=" + config.pageToken + "&fields=" + config.field[command].toString(), function (res) {
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
		var _iteratorNormalCompletion18 = true;
		var _didIteratorError18 = false;
		var _iteratorError18 = undefined;

		try {
			for (var _iterator18 = Object.keys(rawData.data)[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
				var key = _step18.value;

				var isTag = $("#tag").prop("checked");
				if (key === 'reactions') isTag = false;
				var newData = _filter.totalFilter.apply(_filter, [rawData.data[key], key, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
				data.filtered[key] = newData;
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
		var _iteratorNormalCompletion19 = true;
		var _didIteratorError19 = false;
		var _iteratorError19 = undefined;

		try {
			for (var _iterator19 = Object.keys(filtered)[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
				var key = _step19.value;

				var thead = '';
				var tbody = '';
				if (key === 'reactions') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td>\u5FC3\u60C5</td>";
				} else if (key === 'sharedposts') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
				} else {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td>\u8B9A</td>\n\t\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
				}
				var _iteratorNormalCompletion21 = true;
				var _didIteratorError21 = false;
				var _iteratorError21 = undefined;

				try {
					for (var _iterator21 = filtered[key].entries()[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
						var _step21$value = _slicedToArray(_step21.value, 2),
						    j = _step21$value[0],
						    val = _step21$value[1];

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

				var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
				$(".tables ." + key + " table").html('').append(insert);
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
			var _iteratorNormalCompletion20 = true;
			var _didIteratorError20 = false;
			var _iteratorError20 = undefined;

			try {
				var _loop2 = function _loop2() {
					var i = _step20.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator20 = arr[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
					_loop2();
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

		var _iteratorNormalCompletion22 = true;
		var _didIteratorError22 = false;
		var _iteratorError22 = undefined;

		try {
			for (var _iterator22 = Object.keys(compare.raw)[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
				var _key = _step22.value;

				if (_key !== ignore) {
					var _iteratorNormalCompletion25 = true;
					var _didIteratorError25 = false;
					var _iteratorError25 = undefined;

					try {
						for (var _iterator25 = compare.raw[_key][Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
							var _i11 = _step25.value;

							base.push(_i11);
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

		var sort = data.raw.extension ? 'name' : 'id';
		base = base.sort(function (a, b) {
			return a.from[sort] > b.from[sort] ? 1 : -1;
		});

		var _iteratorNormalCompletion23 = true;
		var _didIteratorError23 = false;
		var _iteratorError23 = undefined;

		try {
			for (var _iterator23 = base[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
				var _i12 = _step23.value;

				_i12.match = 0;
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

		var temp = '';
		var temp_name = '';
		// console.log(base);
		for (var _i10 in base) {
			var obj = base[_i10];
			if (obj.from.id == temp || data.raw.extension && obj.from.name == temp_name) {
				var tar = final[final.length - 1];
				tar.match++;
				var _iteratorNormalCompletion24 = true;
				var _didIteratorError24 = false;
				var _iteratorError24 = undefined;

				try {
					for (var _iterator24 = Object.keys(obj)[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
						var key = _step24.value;

						if (!tar[key]) tar[key] = obj[key]; //合併資料
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
		var _iteratorNormalCompletion26 = true;
		var _didIteratorError26 = false;
		var _iteratorError26 = undefined;

		try {
			for (var _iterator26 = data_and.entries()[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
				var _step26$value = _slicedToArray(_step26.value, 2),
				    j = _step26$value[0],
				    val = _step26$value[1];

				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='https://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '0') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
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

		$(".tables .total .table_compare.and tbody").html('').append(tbody);

		var data_or = compare.or;
		var tbody2 = '';
		var _iteratorNormalCompletion27 = true;
		var _didIteratorError27 = false;
		var _iteratorError27 = undefined;

		try {
			for (var _iterator27 = data_or.entries()[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
				var _step27$value = _slicedToArray(_step27.value, 2),
				    j = _step27$value[0],
				    val = _step27$value[1];

				var _td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='https://www.facebook.com/" + val.from.id + "' attr-fbid=\"" + val.from.id + "\" target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>" + (val.type || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.message || '') + "</a></td>\n\t\t\t<td>" + (val.like_count || '') + "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/" + val.id + "\" target=\"_blank\">" + (val.story || '') + "</a></td>\n\t\t\t<td class=\"nowrap\">" + (timeConverter(val.created_time) || '') + "</td>";
				var _tr = "<tr>" + _td + "</tr>";
				tbody2 += _tr;
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

		$(".tables .total .table_compare.or tbody").html('').append(tbody2);

		active();

		function active() {
			var table = $(".tables .total table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			var arr = ['and', 'or'];
			var _iteratorNormalCompletion28 = true;
			var _didIteratorError28 = false;
			var _iteratorError28 = undefined;

			try {
				var _loop3 = function _loop3() {
					var i = _step28.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator28 = arr[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
					_loop3();
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
		var _iteratorNormalCompletion29 = true;
		var _didIteratorError29 = false;
		var _iteratorError29 = undefined;

		try {
			for (var _iterator29 = choose.award[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
				var _i13 = _step29.value;

				var row = tempArr.length == 0 ? _i13 : tempArr[_i13];
				var _tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
				insert += '<tr>' + _tar + '</tr>';
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJoYXNoIiwibG9jYXRpb24iLCJpbmRleE9mIiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInNlc3Npb25TdG9yYWdlIiwiYWxlcnQiLCJocmVmIiwibGFzdERhdGEiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwiZGF0YSIsImZpbmlzaCIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJlIiwiZ2V0QXV0aCIsImN0cmxLZXkiLCJhbHRLZXkiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImV4Y2VsU3RyaW5nIiwiZXhjZWwiLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGlrZXMiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJvcmRlciIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJuZXh0IiwidHlwZSIsIkZCIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsImF1dGhfdHlwZSIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiaW5jbHVkZXMiLCJzd2FsIiwiZG9uZSIsImZiaWQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwib3B0aW9ucyIsImkiLCJqIiwiaWQiLCJuYW1lIiwiaHRtbCIsIm9wdGlvbkRpc3BsYXkiLCJjaGVja2JveCIsInByb3AiLCJzZWxlY3RQYWdlIiwidGFyIiwiYXR0ciIsInNldFRva2VuIiwic3RlcCIsInN0ZXAxIiwicGFnZWlkIiwicGFnZXMiLCJhY2Nlc3NfdG9rZW4iLCJoaWRkZW5TdGFydCIsInBhZ2VJRCIsInNwbGl0IiwiYXBpIiwiZXJyb3IiLCJjbGVhciIsImVtcHR5IiwiZmluZCIsImNvbW1hbmQiLCJsZW5ndGgiLCJwYWdpbmciLCJzdHIiLCJnZW5EYXRhIiwibWVzc2FnZSIsInJlY29tbWFuZCIsImdlbkNhcmQiLCJvYmoiLCJpZHMiLCJsaW5rIiwibWVzcyIsInJlcGxhY2UiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwic3JjIiwiZnVsbF9waWN0dXJlIiwicmVzb2x2ZSIsInJlamVjdCIsImFyciIsIml0ZW0iLCJhZG1pbmlzdHJhdG9yIiwiZXh0ZW5zaW9uQXV0aCIsImV4dGVuc2lvbkNhbGxiYWNrIiwic2V0SXRlbSIsImV4dGVuZCIsImZpZCIsInB1c2giLCJmcm9tIiwicHJvbWlzZV9hcnJheSIsIm5hbWVzIiwicHJvbWlzZSIsImdldE5hbWUiLCJPYmplY3QiLCJrZXlzIiwicG9zdGRhdGEiLCJzdG9yeSIsInBvc3RsaW5rIiwibGlrZV9jb3VudCIsInRpdGxlIiwidG9TdHJpbmciLCJzY3JvbGxUb3AiLCJzdGVwMiIsImZ1bGxJRCIsImZpbHRlcmVkIiwidXNlcmlkIiwibm93TGVuZ3RoIiwidGVzdCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiY29tbWFuZHMiLCJ0ZW1wX2RhdGEiLCJnZXQiLCJkYXRhcyIsInNoYXJlRXJyb3IiLCJhcGlfZmJpZCIsImQiLCJ1cGRhdGVkX3RpbWUiLCJnZXROZXh0IiwiZ2V0SlNPTiIsImZhaWwiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsImtleSIsImlzVGFnIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwibmV3T2JqIiwiZWFjaCIsInRtcCIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsInBpYyIsInRoZWFkIiwidGJvZHkiLCJlbnRyaWVzIiwicGljdHVyZSIsInRkIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYW5kIiwib3IiLCJpZ25vcmUiLCJiYXNlIiwiZmluYWwiLCJjb21wYXJlX251bSIsInNvcnQiLCJhIiwiYiIsIm1hdGNoIiwidGVtcCIsInRlbXBfbmFtZSIsImRhdGFfYW5kIiwiZGF0YV9vciIsInRib2R5MiIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsImN0cmwiLCJuIiwicGFyc2VJbnQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsInRlbXBBcnIiLCJjb2x1bW4iLCJpbmRleCIsInJvdyIsIm5vZGUiLCJpbm5lckhUTUwiLCJrIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJ0YWciLCJ0aW1lIiwidW5pcXVlIiwib3V0cHV0IiwiZm9yRWFjaCIsIm5ld0FyeSIsImdyZXAiLCJtZXNzYWdlX3RhZ3MiLCJ0IiwidGltZV9hcnkiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJ1aSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsIm1hcCIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05Ub0NTVkNvbnZlcnRvciIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBO0FBQ0RTLEVBQUVFLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFVO0FBQzNCLEtBQUlDLFdBQVcsQ0FBZjtBQUNBSixHQUFFLFFBQUYsRUFBWUssS0FBWixDQUFrQixZQUFVO0FBQzNCRDtBQUNBLE1BQUlBLFlBQVksQ0FBaEIsRUFBa0I7QUFDakJKLEtBQUUsUUFBRixFQUFZTSxHQUFaLENBQWdCLE9BQWhCO0FBQ0FOLEtBQUUsMEJBQUYsRUFBOEJPLFdBQTlCLENBQTBDLE1BQTFDO0FBQ0E7QUFDRCxFQU5EOztBQVFBLEtBQUlDLE9BQU9DLFNBQVNELElBQXBCO0FBQ0EsS0FBSUEsS0FBS0UsT0FBTCxDQUFhLE9BQWIsS0FBeUIsQ0FBN0IsRUFBK0I7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RUE7QUFDQS9TLFVBQVNxVCxJQUFULENBQWNDLFdBQWQsQ0FBMEIxSyxJQUExQjtBQUNBQSxNQUFLekksS0FBTDtBQUNBSCxVQUFTcVQsSUFBVCxDQUFjRSxXQUFkLENBQTBCM0ssSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHRsZXQgaGlkZWFyZWEgPSAwO1xyXG5cdCQoJ2hlYWRlcicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRoaWRlYXJlYSsrO1xyXG5cdFx0aWYgKGhpZGVhcmVhID49IDUpe1xyXG5cdFx0XHQkKCdoZWFkZXInKS5vZmYoJ2NsaWNrJyk7XHJcblx0XHRcdCQoJyNmYmlkX2J1dHRvbiwgI3B1cmVfZmJpZCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uaGFzaDtcclxuXHRpZiAoaGFzaC5pbmRleE9mKFwiY2xlYXJcIikgPj0gMCl7XHJcblx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncmF3Jyk7XHJcblx0XHRzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdsb2dpbicpO1xyXG5cdFx0YWxlcnQoJ+W3sua4hemZpOaaq+WtmO+8jOiri+mHjeaWsOmAsuihjOeZu+WFpScpO1xyXG5cdFx0bG9jYXRpb24uaHJlZiA9ICdodHRwczovL2dnOTAwNTIuZ2l0aHViLmlvL2NvbW1lbnRfaGVscGVyX3BsdXMnO1xyXG5cdH1cclxuXHRsZXQgbGFzdERhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmF3XCIpKTtcclxuXHJcblx0aWYgKGxhc3REYXRhKXtcclxuXHRcdGRhdGEuZmluaXNoKGxhc3REYXRhKTtcclxuXHR9XHJcblx0aWYgKHNlc3Npb25TdG9yYWdlLmxvZ2luKXtcclxuXHRcdGZiLmdlbk9wdGlvbihKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKSk7XHJcblx0fVxyXG5cclxuXHQvLyAkKFwiLnRhYmxlcyA+IC5zaGFyZWRwb3N0cyBidXR0b25cIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0Ly8gXHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHQvLyBcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgnaW1wb3J0Jyk7XHJcblx0Ly8gXHR9ZWxzZXtcclxuXHQvLyBcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH0pO1xyXG5cdFxyXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fc3RhcnRcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdGNob29zZS5pbml0KHRydWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5pbml0KCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0XHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgIWUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIuikh+ijveihqOagvOWFp+WuuVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi50YWJsZXMgLmZpbHRlcnMgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5jb21wYXJlX2NvbmRpdGlvbicpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUgdGFibGUnKS5yZW1vdmVDbGFzcygndGFibGUtYWN0aXZlJyk7XHJcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS4nKyAkKHRoaXMpLnZhbCgpKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuJysgJCh0aGlzKS52YWwoKSArICcgdGFibGUnKS5hZGRDbGFzcygndGFibGUtYWN0aXZlJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVktTU0tREQgICBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUobm93RGF0ZSgpKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5KXtcclxuXHRcdFx0bGV0IGRkO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhW3RhYi5ub3ddKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgZGQ7XHJcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xyXG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQvLyBpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKXtcclxuXHRcdFx0Ly8gXHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0Ly8gfWVsc2V7XHJcblx0XHRcdC8vIFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdC8vIFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdC8vIFx0fWVsc2V7XHJcblx0XHRcdC8vIFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhW3RhYi5ub3ddKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRjaV9jb3VudGVyKys7XHJcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KXtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYoZS5jdHJsS2V5KXtcclxuXHRcdFx0ZmIuZ2V0QXV0aCgnc2hhcmVkcG9zdHMnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCdtZXNzYWdlX3RhZ3MnLCdtZXNzYWdlJywnZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbJ2NyZWF0ZWRfdGltZScsJ2Zyb20nLCdtZXNzYWdlJywnc3RvcnknXSxcclxuXHRcdGxpa2VzOiBbJ25hbWUnXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjYuMCcsXHJcblx0XHRyZWFjdGlvbnM6ICd2Ni4wJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjYuMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Ni4wJyxcclxuXHRcdGZlZWQ6ICd2Ni4wJyxcclxuXHRcdGdyb3VwOiAndjYuMCcsXHJcblx0XHRuZXdlc3Q6ICd2Ni4wJ1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0b3JkZXI6ICcnLFxyXG5cdGF1dGg6ICdtYW5hZ2VfcGFnZXMsZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0bmV4dDogJycsXHJcblx0Z2V0QXV0aDogKHR5cGUpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcsXHJcblx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5jbHVkZXMoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSl7XHJcblx0XHRcdFx0XHRmYi5zdGFydCgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+S7mOiyu+aOiOasiuaqouafpemMr+iqpO+8jOipsuWKn+iDvemcgOS7mOiyuycsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgSXQgaXMgYSBwYWlkIGZlYXR1cmUuJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRQcm9taXNlLmFsbChbZmIuZ2V0TWUoKSxmYi5nZXRQYWdlKCksIGZiLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XHJcblx0XHRcdHNlc3Npb25TdG9yYWdlLmxvZ2luID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuXHRcdFx0ZmIuZ2VuT3B0aW9uKHJlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbk9wdGlvbjogKHJlcyk9PntcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCBvcHRpb25zID0gYDxpbnB1dCBpZD1cInB1cmVfZmJpZFwiIGNsYXNzPVwiaGlkZVwiPlxyXG5cdFx0PGJ1dHRvbiBpZD1cImZiaWRfYnV0dG9uXCIgY2xhc3M9XCJidG4gaGlkZVwiIG9uY2xpY2s9XCJmYi5oaWRkZW5TdGFydCh0aGlzKVwiPueUsUZCSUTmk7flj5Y8L2J1dHRvbj5cclxuXHRcdDxsYWJlbD48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25jaGFuZ2U9XCJmYi5vcHRpb25EaXNwbGF5KHRoaXMpXCI+6Zqx6JeP5YiX6KGoPC9sYWJlbD5cclxuXHRcdDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBvbmNsaWNrPVwiZGF0YS5maW5pc2goZGF0YS5yYXcpXCIgc3R5bGU9XCJtYXJnaW4tbGVmdDoyMHB4O1wiPuW8t+WItui3s+i9ieWIsOihqOagvDwvYT48YnI+YDtcclxuXHRcdGxldCB0eXBlID0gLTE7XHJcblx0XHQkKCcjYnRuX3N0YXJ0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdGZvcihsZXQgaSBvZiByZXMpe1xyXG5cdFx0XHR0eXBlKys7XHJcblx0XHRcdGZvcihsZXQgaiBvZiBpKXtcclxuXHRcdFx0XHRvcHRpb25zICs9IGA8ZGl2IGNsYXNzPVwicGFnZV9idG5cIiBhdHRyLXR5cGU9XCIke3R5cGV9XCIgYXR0ci12YWx1ZT1cIiR7ai5pZH1cIiBvbmNsaWNrPVwiZmIuc2VsZWN0UGFnZSh0aGlzKVwiPiR7ai5uYW1lfTwvZGl2PmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJyNlbnRlclVSTCcpLmh0bWwob3B0aW9ucykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9LFxyXG5cdG9wdGlvbkRpc3BsYXk6IChjaGVja2JveCk9PntcclxuXHRcdGlmICgkKGNoZWNrYm94KS5wcm9wKCdjaGVja2VkJykpe1xyXG5cdFx0XHQkKCcucGFnZV9idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQoJy5wYWdlX2J0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzZWxlY3RQYWdlOiAoZSk9PntcclxuXHRcdCQoJyNlbnRlclVSTCAucGFnZV9idG4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgdGFyID0gJChlKTtcclxuXHRcdHRhci5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRpZiAodGFyLmF0dHIoJ2F0dHItdHlwZScpID09IDEpe1xyXG5cdFx0XHRmYi5zZXRUb2tlbih0YXIuYXR0cignYXR0ci12YWx1ZScpKTtcclxuXHRcdH1cclxuXHRcdGZiLmZlZWQodGFyLmF0dHIoJ2F0dHItdmFsdWUnKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0KTtcclxuXHRcdCQoJy5mb3JmYicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHQkKCcuc3RlcDEnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0c3RlcC5zdGVwMSgpO1xyXG5cdH0sXHJcblx0c2V0VG9rZW46IChwYWdlaWQpPT57XHJcblx0XHRsZXQgcGFnZXMgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKVsxXTtcclxuXHRcdGZvcihsZXQgaSBvZiBwYWdlcyl7XHJcblx0XHRcdGlmIChpLmlkID09IHBhZ2VpZCl7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IGkuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRoaWRkZW5TdGFydDogKGUpPT57XHJcblx0XHRsZXQgZmJpZCA9ICQoJyNwdXJlX2ZiaWQnKS52YWwoKTtcclxuXHRcdGxldCBwYWdlSUQgPSBmYmlkLnNwbGl0KCdfJylbMF07XHJcblx0XHRGQi5hcGkoYC8ke3BhZ2VJRH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0aWYgKHJlcy5lcnJvcil7XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pe1xyXG5cdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCwgJ2xpdmUnKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpPT57XHJcblx0XHRpZiAoY2xlYXIpe1xyXG5cdFx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcclxuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLm9mZignY2xpY2snKS5jbGljaygoKT0+e1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKCcjZW50ZXJVUkwgc2VsZWN0JykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJyk7XHJcblx0XHRcdFx0ZmIuZmVlZCh0YXIudmFsKCksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCwgZmFsc2UpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGxldCBjb21tYW5kID0gJ2ZlZWQnO1xyXG5cdFx0bGV0IGFwaTtcclxuXHRcdGlmICh1cmwgPT0gJycpe1xyXG5cdFx0XHRhcGkgPSBgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZUlEfS8ke2NvbW1hbmR9P2ZpZWxkcz1mdWxsX3BpY3R1cmUsY3JlYXRlZF90aW1lLG1lc3NhZ2UmbGltaXQ9MjVgO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFwaSA9IHVybDtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShhcGksIChyZXMpPT57XHJcblx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPT0gMCl7XHJcblx0XHRcdFx0JCgnLmZlZWRzIC5idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZiLm5leHQgPSByZXMucGFnaW5nLm5leHQ7XHJcblx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0bGV0IHN0ciA9IGdlbkRhdGEoaSk7XHJcblx0XHRcdFx0JCgnLnNlY3Rpb24gLmZlZWRzIHRib2R5JykuYXBwZW5kKHN0cik7XHJcblx0XHRcdFx0aWYgKGkubWVzc2FnZSAmJiBpLm1lc3NhZ2UuaW5kZXhPZign5oq9JykgPj0gMCl7XHJcblx0XHRcdFx0XHRsZXQgcmVjb21tYW5kID0gZ2VuQ2FyZChpKTtcclxuXHRcdFx0XHRcdCQoJy5kb25hdGVfYXJlYSAucmVjb21tYW5kcycpLmFwcGVuZChyZWNvbW1hbmQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2VuRGF0YShvYmope1xyXG5cdFx0XHRjb25zb2xlLmxvZyhvYmopO1xyXG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcclxuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XHJcblxyXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRsZXQgc3RyID0gYDx0cj5cclxuXHRcdFx0XHRcdFx0PHRkPjxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiAgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIob2JqLmNyZWF0ZWRfdGltZSl9PC90ZD5cclxuXHRcdFx0XHRcdFx0PC90cj5gO1xyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZ2VuQ2FyZChvYmope1xyXG5cdFx0XHRsZXQgc3JjID0gb2JqLmZ1bGxfcGljdHVyZSB8fCAnaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4MjI1JztcclxuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XHJcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0bGV0XHRzdHIgPSBgPGRpdiBjbGFzcz1cImNhcmRcIj5cclxuXHRcdFx0PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtaW1hZ2VcIj5cclxuXHRcdFx0PGZpZ3VyZSBjbGFzcz1cImltYWdlIGlzLTRieTNcIj5cclxuXHRcdFx0PGltZyBzcmM9XCIke3NyY31cIiBhbHQ9XCJcIj5cclxuXHRcdFx0PC9maWd1cmU+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2E+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWNvbnRlbnRcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuXHRcdFx0JHttZXNzfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj5cclxuXHRcdFx0PC9kaXY+YDtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldE1lOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lYCwgKHJlcyk9PntcclxuXHRcdFx0XHRsZXQgYXJyID0gW3Jlc107XHJcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2ZpZWxkcz1uYW1lLGlkLGFkbWluaXN0cmF0b3ImbGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlIChyZXMuZGF0YS5maWx0ZXIoaXRlbT0+e3JldHVybiBpdGVtLmFkbWluaXN0cmF0b3IgPT09IHRydWV9KSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoY29tbWFuZCA9ICcnKT0+e1xyXG5cdFx0Ly8gbGV0IHJlc3BvbnNlID0ge1xyXG5cdFx0Ly8gXHRzdGF0dXM6ICdjb25uZWN0ZWQnLFxyXG5cdFx0Ly8gXHRhdXRoUmVzcG9uc2U6e1xyXG5cdFx0Ly8gXHRcdGdyYW50ZWRTY29wZXM6ICdncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJyxcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gfVxyXG5cdFx0Ly8gZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UsIGNvbW1hbmQpO1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UsIGNvbW1hbmQpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSwgY29tbWFuZCA9ICcnKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycpID49IDApe1xyXG5cdFx0XHRcdGRhdGEucmF3LmV4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ2ltcG9ydCcpe1xyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaGFyZWRwb3N0c1wiLCAkKCcjaW1wb3J0JykudmFsKCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgZXh0ZW5kID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNoYXJlZHBvc3RzXCIpKTtcclxuXHRcdFx0XHRsZXQgZmlkID0gW107XHJcblx0XHRcdFx0bGV0IGlkcyA9IFtdO1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0ZmlkLnB1c2goaS5mcm9tLmlkKTtcclxuXHRcdFx0XHRcdGlmIChmaWQubGVuZ3RoID49NDUpe1xyXG5cdFx0XHRcdFx0XHRpZHMucHVzaChmaWQpO1xyXG5cdFx0XHRcdFx0XHRmaWQgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWRzLnB1c2goZmlkKTtcclxuXHRcdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdLCBuYW1lcyA9IHt9O1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBpZHMpe1xyXG5cdFx0XHRcdFx0bGV0IHByb21pc2UgPSBmYi5nZXROYW1lKGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIE9iamVjdC5rZXlzKHJlcykpe1xyXG5cdFx0XHRcdFx0XHRcdG5hbWVzW2ldID0gcmVzW2ldO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHBvc3RkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucG9zdGRhdGEpO1xyXG5cdFx0XHRcdGlmIChjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRcdFx0aWYgKHBvc3RkYXRhLnR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdFx0Ly8gRkIuYXBpKFwiL21lXCIsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAocmVzLm5hbWUgPT09IHBvc3RkYXRhLm93bmVyKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aS5tZXNzYWdlID0gaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpLmxpa2VfY291bnQgPSAnTi9BJztcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR0aXRsZTogJ+WAi+S6uuiyvOaWh+WPquacieeZvOaWh+iAheacrOS6uuiDveaKkycsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGh0bWw6IGDosrzmlofluLPomZ/lkI3nqLHvvJoke3Bvc3RkYXRhLm93bmVyfTxicj7nm67liY3luLPomZ/lkI3nqLHvvJoke3Jlcy5uYW1lfWAsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfSk7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGkubGlrZV9jb3VudCA9ICdOL0EnO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9ZWxzZSBpZihwb3N0ZGF0YS50eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0aS5saWtlX2NvdW50ID0gJ04vQSc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRpLmxpa2VfY291bnQgPSAnTi9BJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0aWYgKHBvc3RkYXRhLnR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdFx0Ly8gRkIuYXBpKFwiL21lXCIsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAocmVzLm5hbWUgPT09IHBvc3RkYXRhLm93bmVyKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLmNyZWF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGkudHlwZSA9ICdMSUtFJztcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR0aXRsZTogJ+WAi+S6uuiyvOaWh+WPquacieeZvOaWh+iAheacrOS6uuiDveaKkycsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGh0bWw6IGDosrzmlofluLPomZ/lkI3nqLHvvJoke3Bvc3RkYXRhLm93bmVyfTxicj7nm67liY3luLPomZ/lkI3nqLHvvJoke3Jlcy5uYW1lfWAsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfSk7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmNyZWF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9ZWxzZSBpZihwb3N0ZGF0YS50eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuY3JlYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5jcmVhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0UHJvbWlzZS5hbGwocHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdGkuZnJvbS5uYW1lID0gbmFtZXNbaS5mcm9tLmlkXSA/IG5hbWVzW2kuZnJvbS5pZF0ubmFtZSA6IGkuZnJvbS5uYW1lO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZGF0YS5yYXcuZGF0YVtjb21tYW5kXSA9IGV4dGVuZDtcclxuXHRcdFx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcyk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcbmxldCBzdGVwID0ge1xyXG5cdHN0ZXAxOiAoKT0+e1xyXG5cdFx0JCgnLnNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc3RlcDInKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcclxuXHR9LFxyXG5cdHN0ZXAyOiAoKT0+e1xyXG5cdFx0JCgnLmZvcmZiJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy5yZWNvbW1hbmRzLCAuZmVlZHMgdGJvZHknKS5lbXB0eSgpO1xyXG5cdFx0JCgnLnNlY3Rpb24nKS5hZGRDbGFzcygnc3RlcDInKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzoge2RhdGE6e1xyXG5cdFx0ZnVsbElEOiAnJyxcclxuXHRcdGNvbW1lbnRzOiBbXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogW10sXHJcblx0fX0sXHJcblx0ZmlsdGVyZWQ6IHt9LFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cHJvbWlzZV9hcnJheTogW10sXHJcblx0dGVzdDogKGlkKT0+e1xyXG5cdFx0Y29uc29sZS5sb2coaWQpO1xyXG5cdH0sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRkYXRhLnByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdGRhdGEucmF3ID0gW107XHJcblx0fSxcclxuXHRzdGFydDogKGZiaWQpPT57XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdGxldCBvYmogPSB7XHJcblx0XHRcdGZ1bGxJRDogZmJpZFxyXG5cdFx0fVxyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGxldCBjb21tYW5kcyA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnXTtcclxuXHRcdGxldCB0ZW1wX2RhdGEgPSBvYmo7XHJcblx0XHRmb3IobGV0IGkgb2YgY29tbWFuZHMpe1xyXG5cdFx0XHR0ZW1wX2RhdGEuZGF0YSA9IHt9O1xyXG5cdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KHRlbXBfZGF0YSwgaSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdHRlbXBfZGF0YS5kYXRhW2ldID0gcmVzO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdGRhdGEuZmluaXNoKHRlbXBfZGF0YSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQsIGNvbW1hbmQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBzaGFyZUVycm9yID0gMDtcclxuXHRcdFx0bGV0IGFwaV9mYmlkID0gZmJpZC5mdWxsSUQ7XHJcblx0XHRcdC8vIGlmICgkKCcucGFnZV9idG4uYWN0aXZlJykuYXR0cignYXR0ci10eXBlJykgPT0gMil7XHJcblx0XHRcdC8vIFx0YXBpX2ZiaWQgPSBmYmlkLmZ1bGxJRC5zcGxpdCgnXycpWzFdO1xyXG5cdFx0XHQvLyBcdGlmIChjb21tYW5kID09PSAncmVhY3Rpb25zJykgY29tbWFuZCA9ICdsaWtlcyc7XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJykgY29tbWFuZCA9ICdncm91cCc7XHJcblx0XHRcdEZCLmFwaShgJHthcGlfZmJpZH0vJHtjb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtjb21tYW5kXX0mb3JkZXI9Y2hyb25vbG9naWNhbCZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufSZmaWVsZHM9JHtjb25maWcuZmllbGRbY29tbWFuZF0udG9TdHJpbmcoKX1gLChyZXMpPT57XHJcblx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLmlkfTtcclxuXHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKXtcclxuXHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0PTApe1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCl7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywnbGltaXQ9JytsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGQuZnJvbSl7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XHJcblx0XHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKXtcclxuXHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpPT57XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZmJpZCk9PntcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0c3RlcC5zdGVwMigpO1xyXG5cdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHQkKCcucmVzdWx0X2FyZWEgPiAudGl0bGUgc3BhbicpLnRleHQoZmJpZC5mdWxsSUQpO1xyXG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyYXdcIiwgSlNPTi5zdHJpbmdpZnkoZmJpZCkpO1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH0sXHJcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSk9PntcclxuXHRcdGRhdGEuZmlsdGVyZWQgPSB7fTtcclxuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocmF3RGF0YS5kYXRhKSl7XHJcblx0XHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0XHRpZiAoa2V5ID09PSAncmVhY3Rpb25zJykgaXNUYWcgPSBmYWxzZTtcclxuXHRcdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YS5kYXRhW2tleV0sIGtleSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1x0XHJcblx0XHRcdGRhdGEuZmlsdGVyZWRba2V5XSA9IG5ld0RhdGE7XHJcblx0XHR9XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpe1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbHRlcmVkKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gZGF0YS5maWx0ZXJlZDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4Y2VsOiAocmF3KT0+e1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKXtcclxuXHRcdFx0JC5lYWNoKHJhdyxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCIgOiB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIuipsuWIhuS6q+iumuaVuFwiIDogdGhpcy5saWtlX2NvdW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuW/g+aDhVwiIDogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpPT57XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmVkID0gcmF3ZGF0YTtcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhmaWx0ZXJlZCkpe1xyXG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZD7lv4Pmg4U8L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0XHRpZihrZXkgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgdmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdFx0JChcIi50YWJsZXMgLlwiK2tleStcIiB0YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0YWN0aXZlKCk7XHJcblx0XHR0YWIuaW5pdCgpO1xyXG5cdFx0Y29tcGFyZS5pbml0KCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IGFyciA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnLCdzaGFyZWRwb3N0cyddO1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0XHRsZXQgdGFibGUgPSAkKCcudGFibGVzIC4nK2krJyB0YWJsZScpLkRhdGFUYWJsZSgpO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpPT57XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY29tcGFyZSA9IHtcclxuXHRhbmQ6IFtdLFxyXG5cdG9yOiBbXSxcclxuXHRyYXc6IFtdLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHRjb21wYXJlLmFuZCA9IFtdO1xyXG5cdFx0Y29tcGFyZS5vciA9IFtdO1xyXG5cdFx0Y29tcGFyZS5yYXcgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRsZXQgaWdub3JlID0gJCgnLnRhYmxlcyAudG90YWwgLmZpbHRlcnMgc2VsZWN0JykudmFsKCk7XHJcblx0XHRsZXQgYmFzZSA9IFtdO1xyXG5cdFx0bGV0IGZpbmFsID0gW107XHJcblx0XHRsZXQgY29tcGFyZV9udW0gPSAxO1xyXG5cdFx0aWYgKGlnbm9yZSA9PT0gJ2lnbm9yZScpIGNvbXBhcmVfbnVtID0gMjtcclxuXHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhjb21wYXJlLnJhdykpe1xyXG5cdFx0XHRpZiAoa2V5ICE9PSBpZ25vcmUpe1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBjb21wYXJlLnJhd1trZXldKXtcclxuXHRcdFx0XHRcdGJhc2UucHVzaChpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGxldCBzb3J0ID0gKGRhdGEucmF3LmV4dGVuc2lvbikgPyAnbmFtZSc6J2lkJztcclxuXHRcdGJhc2UgPSBiYXNlLnNvcnQoKGEsYik9PntcclxuXHRcdFx0cmV0dXJuIGEuZnJvbVtzb3J0XSA+IGIuZnJvbVtzb3J0XSA/IDE6LTE7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmb3IobGV0IGkgb2YgYmFzZSl7XHJcblx0XHRcdGkubWF0Y2ggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRsZXQgdGVtcF9uYW1lID0gJyc7XHJcblx0XHQvLyBjb25zb2xlLmxvZyhiYXNlKTtcclxuXHRcdGZvcihsZXQgaSBpbiBiYXNlKXtcclxuXHRcdFx0bGV0IG9iaiA9IGJhc2VbaV07XHJcblx0XHRcdGlmIChvYmouZnJvbS5pZCA9PSB0ZW1wIHx8IChkYXRhLnJhdy5leHRlbnNpb24gJiYgKG9iai5mcm9tLm5hbWUgPT0gdGVtcF9uYW1lKSkpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSBmaW5hbFtmaW5hbC5sZW5ndGgtMV07XHJcblx0XHRcdFx0dGFyLm1hdGNoKys7XHJcblx0XHRcdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSl7XHJcblx0XHRcdFx0XHRpZiAoIXRhcltrZXldKSB0YXJba2V5XSA9IG9ialtrZXldOyAvL+WQiOS9teizh+aWmVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGFyLm1hdGNoID09IGNvbXBhcmVfbnVtKXtcclxuXHRcdFx0XHRcdHRlbXBfbmFtZSA9ICcnO1xyXG5cdFx0XHRcdFx0dGVtcCA9ICcnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmluYWwucHVzaChvYmopO1xyXG5cdFx0XHRcdHRlbXAgPSBvYmouZnJvbS5pZDtcclxuXHRcdFx0XHR0ZW1wX25hbWUgPSBvYmouZnJvbS5uYW1lO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0XHJcblx0XHRjb21wYXJlLm9yID0gZmluYWw7XHJcblx0XHRjb21wYXJlLmFuZCA9IGNvbXBhcmUub3IuZmlsdGVyKCh2YWwpPT57XHJcblx0XHRcdHJldHVybiB2YWwubWF0Y2ggPT0gY29tcGFyZV9udW07XHJcblx0XHR9KTtcclxuXHRcdGNvbXBhcmUuZ2VuZXJhdGUoKTtcclxuXHR9LFxyXG5cdGdlbmVyYXRlOiAoKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBkYXRhX2FuZCA9IGNvbXBhcmUuYW5kO1xyXG5cclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX2FuZC5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcwJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLmFuZCB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cclxuXHRcdGxldCBkYXRhX29yID0gY29tcGFyZS5vcjtcclxuXHRcdGxldCB0Ym9keTIgPSAnJztcclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9vci5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkyICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLm9yIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keTIpO1xyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IGFyciA9IFsnYW5kJywnb3InXTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoY3RybCA9IGZhbHNlKT0+e1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApe1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oY3RybCk7XHJcblx0fSxcclxuXHRnbzogKGN0cmwpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9IHRhYi5ub3c7XHJcblx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YVtjb21tYW5kXS5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1x0XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRsZXQgdGVtcEFyciA9IFtdO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLmNvbHVtbigyKS5kYXRhKCkuZWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpe1xyXG5cdFx0XHRcdGxldCB3b3JkID0gJCgnLnNlYXJjaENvbW1lbnQnKS52YWwoKTtcclxuXHRcdFx0XHRpZiAodmFsdWUuaW5kZXhPZih3b3JkKSA+PSAwKSB0ZW1wQXJyLnB1c2goaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiBjaG9vc2UuYXdhcmQpe1xyXG5cdFx0XHRsZXQgcm93ID0gKHRlbXBBcnIubGVuZ3RoID09IDApID8gaTp0ZW1wQXJyW2ldO1xyXG5cdFx0XHRsZXQgdGFyID0gJCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5yb3cocm93KS5ub2RlKCkuaW5uZXJIVE1MO1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0cj4nICsgdGFyICsgJzwvdHI+JztcclxuXHRcdH1cclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKGluc2VydCk7XHJcblx0XHRpZiAoIWN0cmwpe1xyXG5cdFx0XHQkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0Ly8gbGV0IHRhciA9ICQodGhpcykuZmluZCgndGQnKS5lcSgxKTtcclxuXHRcdFx0XHQvLyBsZXQgaWQgPSB0YXIuZmluZCgnYScpLmF0dHIoJ2F0dHItZmJpZCcpO1xyXG5cdFx0XHRcdC8vIHRhci5wcmVwZW5kKGA8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xyXG5cdFx0XHRsZXQgbm93ID0gMDtcclxuXHRcdFx0Zm9yKGxldCBrIGluIGNob29zZS5saXN0KXtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjdcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhdywgY29tbWFuZCwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9PntcclxuXHRcdGxldCBkYXRhID0gcmF3O1xyXG5cdFx0aWYgKHdvcmQgIT09ICcnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kICE9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBlbmRUaW1lKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnJlYWN0KGRhdGEsIHJlYWN0KTtcclxuXHRcdH1cclxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSk9PntcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHQpPT57XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLChwYXJzZUludCh0aW1lX2FyeVsxXSktMSksdGltZV9hcnlbMl0sdGltZV9hcnlbM10sdGltZV9hcnlbNF0sdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmIChjcmVhdGVkX3RpbWUgPCB0aW1lIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcik9PntcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKT0+e1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWIgPSB7XHJcblx0bm93OiBcImNvbW1lbnRzXCIsXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0dGFiLm5vdyA9ICQodGhpcykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHRcdGxldCB0YXIgPSAkKHRoaXMpLmluZGV4KCk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5lcSh0YXIpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCl7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSsxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XHJcblx0IHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xyXG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG4gICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICAgaWYgKGRhdGUgPCAxMCl7XHJcbiAgICAgXHRkYXRlID0gXCIwXCIrZGF0ZTtcclxuICAgICB9XHJcbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcbiAgICAgaWYgKGhvdXIgPCAxMCl7XHJcbiAgICAgXHRob3VyID0gXCIwXCIraG91cjtcclxuICAgICB9XHJcbiAgICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG4gICAgIGlmIChtaW4gPCAxMCl7XHJcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XHJcbiAgICAgfVxyXG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuICAgICBpZiAoc2VjIDwgMTApe1xyXG4gICAgIFx0c2VjID0gXCIwXCIrc2VjO1xyXG4gICAgIH1cclxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcclxuICAgICByZXR1cm4gdGltZTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcbiAgICBcclxuICAgIHZhciBDU1YgPSAnJzsgICAgXHJcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuICAgIFxyXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuICAgIGlmIChTaG93TGFiZWwpIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXHJcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSAgIFxyXG4gICAgXHJcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcbiAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxyXG4gICAgXHJcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuICAgIFxyXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG4gICAgXHJcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcclxuICAgIGxpbmsuaHJlZiA9IHVyaTtcclxuICAgIFxyXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuICAgIFxyXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
