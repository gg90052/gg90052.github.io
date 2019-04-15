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
		comments: 'v3.2',
		reactions: 'v3.2',
		sharedposts: 'v3.2',
		url_comments: 'v3.2',
		feed: 'v3.2',
		group: 'v3.2',
		newest: 'v3.2'
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
		var options = "<input id=\"pure_fbid\" class=\"hide\"><button id=\"fbid_button\" class=\"btn hide\" onclick=\"fb.hiddenStart(this)\">\u7531FBID\u64F7\u53D6</button><label><input type=\"checkbox\" onchange=\"fb.optionDisplay(this)\">\u96B1\u85CF\u5217\u8868</label><br>";
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
	raw: { data: {} },
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
			var api_fbid = fbid.fullID;
			if ($('.page_btn.active').attr('attr-type') == 2) {
				api_fbid = fbid.fullID.split('_')[1];
				if (command === 'reactions') command = 'likes';
			}
			if (fbid.type === 'group') command = 'group';
			if (command === 'sharedposts') {
				getShare();
			} else {
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
				resolve([]);
				// $.getJSON(url, function(res){
				// 	if (res === 'end'){
				// 		resolve(datas);
				// 	}else{
				// 		if (res.errorMessage){
				// 			resolve(datas);
				// 		}else if(res.data){
				// 			// shareError = 0;
				// 			for(let i of res.data){
				// 				let name = '';
				// 				if(i.story){
				// 					name = i.story.substring(0, i.story.indexOf(' shared'));
				// 				}else{
				// 					name = i.id.substring(0, i.id.indexOf("_"));
				// 				}
				// 				let id = i.id.substring(0, i.id.indexOf("_"));
				// 				i.from = {id, name};
				// 				datas.push(i);
				// 			}
				// 			getShare(res.after);
				// 		}else{
				// 			resolve(datas);
				// 		}
				// 	}
				// })
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJoYXNoIiwibG9jYXRpb24iLCJpbmRleE9mIiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInNlc3Npb25TdG9yYWdlIiwiYWxlcnQiLCJocmVmIiwibGFzdERhdGEiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwiZGF0YSIsImZpbmlzaCIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJlIiwiZ2V0QXV0aCIsImN0cmxLZXkiLCJhbHRLZXkiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGlrZXMiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJvcmRlciIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJuZXh0IiwidHlwZSIsIkZCIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsImF1dGhfdHlwZSIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiaW5jbHVkZXMiLCJzd2FsIiwiZG9uZSIsImZiaWQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwib3B0aW9ucyIsImkiLCJqIiwiaWQiLCJuYW1lIiwiaHRtbCIsIm9wdGlvbkRpc3BsYXkiLCJjaGVja2JveCIsInByb3AiLCJzZWxlY3RQYWdlIiwidGFyIiwiYXR0ciIsInNldFRva2VuIiwic3RlcCIsInN0ZXAxIiwicGFnZWlkIiwicGFnZXMiLCJhY2Nlc3NfdG9rZW4iLCJoaWRkZW5TdGFydCIsInBhZ2VJRCIsInNwbGl0IiwiYXBpIiwiZXJyb3IiLCJjbGVhciIsImVtcHR5IiwiZmluZCIsImNvbW1hbmQiLCJwYWdpbmciLCJzdHIiLCJnZW5EYXRhIiwibWVzc2FnZSIsInJlY29tbWFuZCIsImdlbkNhcmQiLCJvYmoiLCJpZHMiLCJsaW5rIiwibWVzcyIsInJlcGxhY2UiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwic3JjIiwiZnVsbF9waWN0dXJlIiwicmVzb2x2ZSIsInJlamVjdCIsImFyciIsIml0ZW0iLCJhZG1pbmlzdHJhdG9yIiwiZXh0ZW5zaW9uQXV0aCIsImV4dGVuc2lvbkNhbGxiYWNrIiwic2V0SXRlbSIsImV4dGVuZCIsImZpZCIsInB1c2giLCJmcm9tIiwicHJvbWlzZV9hcnJheSIsIm5hbWVzIiwicHJvbWlzZSIsImdldE5hbWUiLCJPYmplY3QiLCJrZXlzIiwicG9zdGRhdGEiLCJzdG9yeSIsInBvc3RsaW5rIiwibGlrZV9jb3VudCIsInRpdGxlIiwidG9TdHJpbmciLCJzY3JvbGxUb3AiLCJzdGVwMiIsImZpbHRlcmVkIiwidXNlcmlkIiwibm93TGVuZ3RoIiwidGVzdCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwiY29tbWFuZHMiLCJ0ZW1wX2RhdGEiLCJnZXQiLCJkYXRhcyIsInNoYXJlRXJyb3IiLCJhcGlfZmJpZCIsImdldFNoYXJlIiwiZCIsInVwZGF0ZWRfdGltZSIsImdldE5leHQiLCJnZXRKU09OIiwiZmFpbCIsImFmdGVyIiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJrZXkiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsIm5ld09iaiIsImVhY2giLCJ0bXAiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50IiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJwaWMiLCJ0aGVhZCIsInRib2R5IiwiZW50cmllcyIsInBpY3R1cmUiLCJ0ZCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInNlYXJjaCIsInZhbHVlIiwiZHJhdyIsImFuZCIsIm9yIiwiaWdub3JlIiwiYmFzZSIsImZpbmFsIiwiY29tcGFyZV9udW0iLCJzb3J0IiwiYSIsImIiLCJtYXRjaCIsInRlbXAiLCJ0ZW1wX25hbWUiLCJkYXRhX2FuZCIsImRhdGFfb3IiLCJ0Ym9keTIiLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJjdHJsIiwibiIsInBhcnNlSW50IiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJ0ZW1wQXJyIiwiY29sdW1uIiwiaW5kZXgiLCJyb3ciLCJub2RlIiwiaW5uZXJIVE1MIiwiayIsImVxIiwiaW5zZXJ0QmVmb3JlIiwidGFnIiwidGltZSIsInVuaXF1ZSIsIm91dHB1dCIsImZvckVhY2giLCJuZXdBcnkiLCJncmVwIiwibWVzc2FnZV90YWdzIiwidCIsInRpbWVfYXJ5IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwidWkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJtYXAiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFlQyxTQUFmOztBQUVBLFNBQVNBLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXVCQyxHQUF2QixFQUEyQkMsQ0FBM0IsRUFDQTtBQUNDLEtBQUksQ0FBQ04sWUFBTCxFQUFrQjtBQUNqQk8sVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWdELDRCQUFoRDtBQUNBQyxJQUFFLGlCQUFGLEVBQXFCQyxNQUFyQjtBQUNBVixpQkFBZSxJQUFmO0FBQ0E7QUFDRCxRQUFPLEtBQVA7QUFDQTtBQUNEUyxFQUFFRSxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUMzQixLQUFJQyxXQUFXLENBQWY7QUFDQUosR0FBRSxRQUFGLEVBQVlLLEtBQVosQ0FBa0IsWUFBVTtBQUMzQkQ7QUFDQSxNQUFJQSxZQUFZLENBQWhCLEVBQWtCO0FBQ2pCSixLQUFFLFFBQUYsRUFBWU0sR0FBWixDQUFnQixPQUFoQjtBQUNBTixLQUFFLDBCQUFGLEVBQThCTyxXQUE5QixDQUEwQyxNQUExQztBQUNBO0FBQ0QsRUFORDs7QUFRQSxLQUFJQyxPQUFPQyxTQUFTRCxJQUFwQjtBQUNBLEtBQUlBLEtBQUtFLE9BQUwsQ0FBYSxPQUFi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QztBQUNyQyxNQUFJc0osTUFBTSxFQUFWOztBQUVBO0FBQ0EsT0FBSyxJQUFJRCxLQUFULElBQWtCOEMsUUFBUW5NLENBQVIsQ0FBbEIsRUFBOEI7QUFDMUJzSixVQUFPLE1BQU02QyxRQUFRbk0sQ0FBUixFQUFXcUosS0FBWCxDQUFOLEdBQTBCLElBQWpDO0FBQ0g7O0FBRURDLE1BQUkrQyxLQUFKLENBQVUsQ0FBVixFQUFhL0MsSUFBSXJNLE1BQUosR0FBYSxDQUExQjs7QUFFQTtBQUNBbVAsU0FBTzlDLE1BQU0sTUFBYjtBQUNIOztBQUVELEtBQUk4QyxPQUFPLEVBQVgsRUFBZTtBQUNYblMsUUFBTSxjQUFOO0FBQ0E7QUFDSDs7QUFFRDtBQUNBLEtBQUlxUyxXQUFXLEVBQWY7QUFDQTtBQUNBQSxhQUFZTCxZQUFZN0osT0FBWixDQUFvQixJQUFwQixFQUF5QixHQUF6QixDQUFaOztBQUVBO0FBQ0EsS0FBSW1LLE1BQU0sdUNBQXVDQyxVQUFVSixHQUFWLENBQWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSWxLLE9BQU83SSxTQUFTb1QsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0F2SyxNQUFLaEksSUFBTCxHQUFZcVMsR0FBWjs7QUFFQTtBQUNBckssTUFBS3dLLEtBQUwsR0FBYSxtQkFBYjtBQUNBeEssTUFBS3lLLFFBQUwsR0FBZ0JMLFdBQVcsTUFBM0I7O0FBRUE7QUFDQWpULFVBQVN1VCxJQUFULENBQWNDLFdBQWQsQ0FBMEIzSyxJQUExQjtBQUNBQSxNQUFLMUksS0FBTDtBQUNBSCxVQUFTdVQsSUFBVCxDQUFjRSxXQUFkLENBQTBCNUssSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHRsZXQgaGlkZWFyZWEgPSAwO1xyXG5cdCQoJ2hlYWRlcicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRoaWRlYXJlYSsrO1xyXG5cdFx0aWYgKGhpZGVhcmVhID49IDUpe1xyXG5cdFx0XHQkKCdoZWFkZXInKS5vZmYoJ2NsaWNrJyk7XHJcblx0XHRcdCQoJyNmYmlkX2J1dHRvbiwgI3B1cmVfZmJpZCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uaGFzaDtcclxuXHRpZiAoaGFzaC5pbmRleE9mKFwiY2xlYXJcIikgPj0gMCl7XHJcblx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncmF3Jyk7XHJcblx0XHRzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdsb2dpbicpO1xyXG5cdFx0YWxlcnQoJ+W3sua4hemZpOaaq+WtmO+8jOiri+mHjeaWsOmAsuihjOeZu+WFpScpO1xyXG5cdFx0bG9jYXRpb24uaHJlZiA9ICdodHRwczovL2dnOTAwNTIuZ2l0aHViLmlvL2NvbW1lbnRfaGVscGVyX3BsdXMnO1xyXG5cdH1cclxuXHRsZXQgbGFzdERhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmF3XCIpKTtcclxuXHJcblx0aWYgKGxhc3REYXRhKXtcclxuXHRcdGRhdGEuZmluaXNoKGxhc3REYXRhKTtcclxuXHR9XHJcblx0aWYgKHNlc3Npb25TdG9yYWdlLmxvZ2luKXtcclxuXHRcdGZiLmdlbk9wdGlvbihKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKSk7XHJcblx0fVxyXG5cclxuXHQvLyAkKFwiLnRhYmxlcyA+IC5zaGFyZWRwb3N0cyBidXR0b25cIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0Ly8gXHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHQvLyBcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgnaW1wb3J0Jyk7XHJcblx0Ly8gXHR9ZWxzZXtcclxuXHQvLyBcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH0pO1xyXG5cdFxyXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fc3RhcnRcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdGNob29zZS5pbml0KHRydWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5pbml0KCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0XHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgIWUuYWx0S2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLnRhYmxlcyAuZmlsdGVycyAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnRhYmxlcyAudG90YWwgLmZpbHRlcnMgc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb21wYXJlLmluaXQoKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLmNvbXBhcmVfY29uZGl0aW9uJykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZScpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHQkKCcudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS4nKyAkKHRoaXMpLnZhbCgpKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwic2luZ2xlRGF0ZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZLU1NLUREICAgSEg6bW1cIixcclxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXHJcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxyXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXHJcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxyXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxyXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcclxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcclxuXHRcdFx0XCLml6VcIixcclxuXHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XCLkuoxcIixcclxuXHRcdFx0XCLkuIlcIixcclxuXHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XCLkupRcIixcclxuXHRcdFx0XCLlha1cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xyXG5cdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcIuS6jOaciFwiLFxyXG5cdFx0XHRcIuS4ieaciFwiLFxyXG5cdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcIuS6lOaciFwiLFxyXG5cdFx0XHRcIuWFreaciFwiLFxyXG5cdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcIuWFq+aciFwiLFxyXG5cdFx0XHRcIuS5neaciFwiLFxyXG5cdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcIuWNgeS4gOaciFwiLFxyXG5cdFx0XHRcIuWNgeS6jOaciFwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwiZmlyc3REYXlcIjogMVxyXG5cdFx0fSxcclxuXHR9LGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSl7XHJcblx0XHRcdGxldCBkZDtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YVt0YWIubm93XSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIGRkO1xyXG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHRcdFx0d2luZG93LmZvY3VzKCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCl7XHJcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YVt0YWIubm93XSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcblxyXG5cdGxldCBjaV9jb3VudGVyID0gMDtcclxuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSl7XHJcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdH1cclxuXHRcdGlmKGUuY3RybEtleSl7XHJcblx0XHRcdGZiLmdldEF1dGgoJ3NoYXJlZHBvc3RzJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZScsJ2Zyb20nLCdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCdmcm9tJywnbWVzc2FnZScsJ3N0b3J5J10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnLFxyXG5cdFx0bGlrZXM6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YzLjInLFxyXG5cdFx0cmVhY3Rpb25zOiAndjMuMicsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YzLjInLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjMuMicsXHJcblx0XHRmZWVkOiAndjMuMicsXHJcblx0XHRncm91cDogJ3YzLjInLFxyXG5cdFx0bmV3ZXN0OiAndjMuMidcclxuXHR9LFxyXG5cdGZpbHRlcjoge1xyXG5cdFx0d29yZDogJycsXHJcblx0XHRyZWFjdDogJ2FsbCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnJyxcclxuXHRhdXRoOiAnbWFuYWdlX3BhZ2VzLGdyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cGFnZVRva2VuOiAnJyxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdG5leHQ6ICcnLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRhdXRoX3R5cGU6ICdyZXJlcXVlc3QnLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluY2x1ZGVzKCdncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJykpe1xyXG5cdFx0XHRcdFx0ZmIuc3RhcnQoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrmqqLmn6XpjK/oqqTvvIzoqbLlip/og73pnIDku5josrsnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIEl0IGlzIGEgcGFpZCBmZWF0dXJlLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1x0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKT0+e1xyXG5cdFx0UHJvbWlzZS5hbGwoW2ZiLmdldE1lKCksZmIuZ2V0UGFnZSgpLCBmYi5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5sb2dpbiA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcblx0XHRcdGZiLmdlbk9wdGlvbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5PcHRpb246IChyZXMpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgb3B0aW9ucyA9IGA8aW5wdXQgaWQ9XCJwdXJlX2ZiaWRcIiBjbGFzcz1cImhpZGVcIj48YnV0dG9uIGlkPVwiZmJpZF9idXR0b25cIiBjbGFzcz1cImJ0biBoaWRlXCIgb25jbGljaz1cImZiLmhpZGRlblN0YXJ0KHRoaXMpXCI+55SxRkJJROaTt+WPljwvYnV0dG9uPjxsYWJlbD48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25jaGFuZ2U9XCJmYi5vcHRpb25EaXNwbGF5KHRoaXMpXCI+6Zqx6JeP5YiX6KGoPC9sYWJlbD48YnI+YDtcclxuXHRcdGxldCB0eXBlID0gLTE7XHJcblx0XHQkKCcjYnRuX3N0YXJ0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdGZvcihsZXQgaSBvZiByZXMpe1xyXG5cdFx0XHR0eXBlKys7XHJcblx0XHRcdGZvcihsZXQgaiBvZiBpKXtcclxuXHRcdFx0XHRvcHRpb25zICs9IGA8ZGl2IGNsYXNzPVwicGFnZV9idG5cIiBhdHRyLXR5cGU9XCIke3R5cGV9XCIgYXR0ci12YWx1ZT1cIiR7ai5pZH1cIiBvbmNsaWNrPVwiZmIuc2VsZWN0UGFnZSh0aGlzKVwiPiR7ai5uYW1lfTwvZGl2PmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJyNlbnRlclVSTCcpLmh0bWwob3B0aW9ucykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9LFxyXG5cdG9wdGlvbkRpc3BsYXk6IChjaGVja2JveCk9PntcclxuXHRcdGlmICgkKGNoZWNrYm94KS5wcm9wKCdjaGVja2VkJykpe1xyXG5cdFx0XHQkKCcucGFnZV9idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQoJy5wYWdlX2J0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzZWxlY3RQYWdlOiAoZSk9PntcclxuXHRcdCQoJyNlbnRlclVSTCAucGFnZV9idG4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgdGFyID0gJChlKTtcclxuXHRcdHRhci5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRpZiAodGFyLmF0dHIoJ2F0dHItdHlwZScpID09IDEpe1xyXG5cdFx0XHRmYi5zZXRUb2tlbih0YXIuYXR0cignYXR0ci12YWx1ZScpKTtcclxuXHRcdH1cclxuXHRcdGZiLmZlZWQodGFyLmF0dHIoJ2F0dHItdmFsdWUnKSwgdGFyLmF0dHIoJ2F0dHItdHlwZScpLCBmYi5uZXh0KTtcclxuXHRcdCQoJy5mb3JmYicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHQkKCcuc3RlcDEnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0c3RlcC5zdGVwMSgpO1xyXG5cdH0sXHJcblx0c2V0VG9rZW46IChwYWdlaWQpPT57XHJcblx0XHRsZXQgcGFnZXMgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKVsxXTtcclxuXHRcdGZvcihsZXQgaSBvZiBwYWdlcyl7XHJcblx0XHRcdGlmIChpLmlkID09IHBhZ2VpZCl7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IGkuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRoaWRkZW5TdGFydDogKGUpPT57XHJcblx0XHRsZXQgZmJpZCA9ICQoJyNwdXJlX2ZiaWQnKS52YWwoKTtcclxuXHRcdGxldCBwYWdlSUQgPSBmYmlkLnNwbGl0KCdfJylbMF07XHJcblx0XHRGQi5hcGkoYC8ke3BhZ2VJRH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0aWYgKHJlcy5lcnJvcil7XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pe1xyXG5cdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCwgJ2xpdmUnKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpPT57XHJcblx0XHRpZiAoY2xlYXIpe1xyXG5cdFx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcclxuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcuZmVlZHMgLmJ0bicpLm9mZignY2xpY2snKS5jbGljaygoKT0+e1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKCcjZW50ZXJVUkwgc2VsZWN0JykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJyk7XHJcblx0XHRcdFx0ZmIuZmVlZCh0YXIudmFsKCksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCwgZmFsc2UpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGxldCBjb21tYW5kID0gKHR5cGUgPT0gJzInKSA/ICdmZWVkJzoncG9zdHMnO1xyXG5cdFx0bGV0IGFwaTtcclxuXHRcdGlmICh1cmwgPT0gJycpe1xyXG5cdFx0XHRhcGkgPSBgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZUlEfS8ke2NvbW1hbmR9P2ZpZWxkcz1saW5rLGZ1bGxfcGljdHVyZSxjcmVhdGVkX3RpbWUsbWVzc2FnZSZsaW1pdD0yNWA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YXBpID0gdXJsO1xyXG5cdFx0fVxyXG5cdFx0RkIuYXBpKGFwaSwgKHJlcyk9PntcclxuXHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0XHQkKCcuZmVlZHMgLmJ0bicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZmIubmV4dCA9IHJlcy5wYWdpbmcubmV4dDtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRsZXQgc3RyID0gZ2VuRGF0YShpKTtcclxuXHRcdFx0XHQkKCcuc2VjdGlvbiAuZmVlZHMgdGJvZHknKS5hcHBlbmQoc3RyKTtcclxuXHRcdFx0XHRpZiAoaS5tZXNzYWdlICYmIGkubWVzc2FnZS5pbmRleE9mKCfmir0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdGxldCByZWNvbW1hbmQgPSBnZW5DYXJkKGkpO1xyXG5cdFx0XHRcdFx0JCgnLmRvbmF0ZV9hcmVhIC5yZWNvbW1hbmRzJykuYXBwZW5kKHJlY29tbWFuZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRmdW5jdGlvbiBnZW5EYXRhKG9iail7XHJcblx0XHRcdGxldCBpZHMgPSBvYmouaWQuc3BsaXQoXCJfXCIpO1xyXG5cdFx0XHRsZXQgbGluayA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJytpZHNbMF0rJy9wb3N0cy8nK2lkc1sxXTtcclxuXHJcblx0XHRcdGxldCBtZXNzID0gb2JqLm1lc3NhZ2UgPyBvYmoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XHJcblx0XHRcdGxldCBzdHIgPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGRpdiBjbGFzcz1cInBpY2tcIiBhdHRyLXZhbD1cIiR7b2JqLmlkfVwiICBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke21lc3N9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcihvYmouY3JlYXRlZF90aW1lKX08L3RkPlxyXG5cdFx0XHRcdFx0XHQ8L3RyPmA7XHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBnZW5DYXJkKG9iail7XHJcblx0XHRcdGxldCBzcmMgPSBvYmouZnVsbF9waWN0dXJlIHx8ICdodHRwOi8vcGxhY2Vob2xkLml0LzMwMHgyMjUnO1xyXG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcclxuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRsZXRcdHN0ciA9IGA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxyXG5cdFx0XHQ8YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZVwiPlxyXG5cdFx0XHQ8ZmlndXJlIGNsYXNzPVwiaW1hZ2UgaXMtNGJ5M1wiPlxyXG5cdFx0XHQ8aW1nIHNyYz1cIiR7c3JjfVwiIGFsdD1cIlwiPlxyXG5cdFx0XHQ8L2ZpZ3VyZT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvYT5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtY29udGVudFwiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG5cdFx0XHQke21lc3N9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cInBpY2tcIiBhdHRyLXZhbD1cIiR7b2JqLmlkfVwiIG9uY2xpY2s9XCJkYXRhLnN0YXJ0KCcke29iai5pZH0nKVwiPumWi+WnizwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5gO1xyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TWU6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWVgLCAocmVzKT0+e1xyXG5cdFx0XHRcdGxldCBhcnIgPSBbcmVzXTtcclxuXHRcdFx0XHRyZXNvbHZlKGFycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRQYWdlOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2FjY291bnRzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRHcm91cDogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9ncm91cHM/ZmllbGRzPW5hbWUsaWQsYWRtaW5pc3RyYXRvciZsaW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUgKHJlcy5kYXRhLmZpbHRlcihpdGVtPT57cmV0dXJuIGl0ZW0uYWRtaW5pc3RyYXRvciA9PT0gdHJ1ZX0pKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkF1dGg6IChjb21tYW5kID0gJycpPT57XHJcblx0XHQvLyBsZXQgcmVzcG9uc2UgPSB7XHJcblx0XHQvLyBcdHN0YXR1czogJ2Nvbm5lY3RlZCcsXHJcblx0XHQvLyBcdGF1dGhSZXNwb25zZTp7XHJcblx0XHQvLyBcdFx0Z3JhbnRlZFNjb3BlczogJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nLFxyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyB9XHJcblx0XHQvLyBmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSwgY29tbWFuZCk7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSwgY29tbWFuZCk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25DYWxsYmFjazogKHJlc3BvbnNlLCBjb21tYW5kID0gJycpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCdncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJykgPj0gMCl7XHJcblx0XHRcdFx0ZGF0YS5yYXcuZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAoY29tbWFuZCA9PSAnaW1wb3J0Jyl7XHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNoYXJlZHBvc3RzXCIsICQoJyNpbXBvcnQnKS52YWwoKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBleHRlbmQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2hhcmVkcG9zdHNcIikpO1xyXG5cdFx0XHRcdGxldCBmaWQgPSBbXTtcclxuXHRcdFx0XHRsZXQgaWRzID0gW107XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRmaWQucHVzaChpLmZyb20uaWQpO1xyXG5cdFx0XHRcdFx0aWYgKGZpZC5sZW5ndGggPj00NSl7XHJcblx0XHRcdFx0XHRcdGlkcy5wdXNoKGZpZCk7XHJcblx0XHRcdFx0XHRcdGZpZCA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZHMucHVzaChmaWQpO1xyXG5cdFx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW10sIG5hbWVzID0ge307XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGlkcyl7XHJcblx0XHRcdFx0XHRsZXQgcHJvbWlzZSA9IGZiLmdldE5hbWUoaSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgT2JqZWN0LmtleXMocmVzKSl7XHJcblx0XHRcdFx0XHRcdFx0bmFtZXNbaV0gPSByZXNbaV07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgcG9zdGRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5wb3N0ZGF0YSk7XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdFx0XHRpZiAocG9zdGRhdGEudHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0XHQvLyBGQi5hcGkoXCIvbWVcIiwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChyZXMubmFtZSA9PT0gcG9zdGRhdGEub3duZXIpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpLm1lc3NhZ2UgPSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGkubGlrZV9jb3VudCA9ICdOL0EnO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHRpdGxlOiAn5YCL5Lq66LK85paH5Y+q5pyJ55m85paH6ICF5pys5Lq66IO95oqTJyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aHRtbDogYOiyvOaWh+W4s+iZn+WQjeeose+8miR7cG9zdGRhdGEub3duZXJ9PGJyPuebruWJjeW4s+iZn+WQjeeose+8miR7cmVzLm5hbWV9YCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9KTtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0aS5saWtlX2NvdW50ID0gJ04vQSc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNlIGlmKHBvc3RkYXRhLnR5cGUgPT09ICdncm91cCcpe1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRpLmxpa2VfY291bnQgPSAnTi9BJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGkubGlrZV9jb3VudCA9ICdOL0EnO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRpZiAocG9zdGRhdGEudHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0XHQvLyBGQi5hcGkoXCIvbWVcIiwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChyZXMubmFtZSA9PT0gcG9zdGRhdGEub3duZXIpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkuY3JlYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aS50eXBlID0gJ0xJS0UnO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHRpdGxlOiAn5YCL5Lq66LK85paH5Y+q5pyJ55m85paH6ICF5pys5Lq66IO95oqTJyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aHRtbDogYOiyvOaWh+W4s+iZn+WQjeeose+8miR7cG9zdGRhdGEub3duZXJ9PGJyPuebruWJjeW4s+iZn+WQjeeose+8miR7cmVzLm5hbWV9YCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9KTtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuY3JlYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNlIGlmKHBvc3RkYXRhLnR5cGUgPT09ICdncm91cCcpe1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5jcmVhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmNyZWF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRQcm9taXNlLmFsbChwcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0aS5mcm9tLm5hbWUgPSBuYW1lc1tpLmZyb20uaWRdID8gbmFtZXNbaS5mcm9tLmlkXS5uYW1lIDogaS5mcm9tLm5hbWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkYXRhLnJhdy5kYXRhW2NvbW1hbmRdID0gZXh0ZW5kO1xyXG5cdFx0XHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXROYW1lOiAoaWRzKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9Lz9pZHM9JHtpZHMudG9TdHJpbmcoKX1gLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxubGV0IHN0ZXAgPSB7XHJcblx0c3RlcDE6ICgpPT57XHJcblx0XHQkKCcuc2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH0sXHJcblx0c3RlcDI6ICgpPT57XHJcblx0XHQkKCcuZm9yZmInKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHQkKCcuc2VjdGlvbicpLmFkZENsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiB7ZGF0YTp7fX0sXHJcblx0ZmlsdGVyZWQ6IHt9LFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cHJvbWlzZV9hcnJheTogW10sXHJcblx0dGVzdDogKGlkKT0+e1xyXG5cdFx0Y29uc29sZS5sb2coaWQpO1xyXG5cdH0sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRkYXRhLnByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdGRhdGEucmF3ID0gW107XHJcblx0fSxcclxuXHRzdGFydDogKGZiaWQpPT57XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdGxldCBvYmogPSB7XHJcblx0XHRcdGZ1bGxJRDogZmJpZFxyXG5cdFx0fVxyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGxldCBjb21tYW5kcyA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnLCdzaGFyZWRwb3N0cyddO1xyXG5cdFx0bGV0IHRlbXBfZGF0YSA9IG9iajtcclxuXHRcdGZvcihsZXQgaSBvZiBjb21tYW5kcyl7XHJcblx0XHRcdHRlbXBfZGF0YS5kYXRhID0ge307XHJcblx0XHRcdGxldCBwcm9taXNlID0gZGF0YS5nZXQodGVtcF9kYXRhLCBpKS50aGVuKChyZXMpPT57XHJcblx0XHRcdFx0dGVtcF9kYXRhLmRhdGFbaV0gPSByZXM7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRkYXRhLnByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdH1cclxuXHJcblx0XHRQcm9taXNlLmFsbChkYXRhLnByb21pc2VfYXJyYXkpLnRoZW4oKCk9PntcclxuXHRcdFx0ZGF0YS5maW5pc2godGVtcF9kYXRhKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCwgY29tbWFuZCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IHNoYXJlRXJyb3IgPSAwO1xyXG5cdFx0XHRsZXQgYXBpX2ZiaWQgPSBmYmlkLmZ1bGxJRDtcclxuXHRcdFx0aWYgKCQoJy5wYWdlX2J0bi5hY3RpdmUnKS5hdHRyKCdhdHRyLXR5cGUnKSA9PSAyKXtcclxuXHRcdFx0XHRhcGlfZmJpZCA9IGZiaWQuZnVsbElELnNwbGl0KCdfJylbMV07XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT09ICdyZWFjdGlvbnMnKSBjb21tYW5kID0gJ2xpa2VzJztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0aWYgKGNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdGdldFNoYXJlKCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdEZCLmFwaShgJHthcGlfZmJpZH0vJHtjb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtjb21tYW5kXX0mb3JkZXI9Y2hyb25vbG9naWNhbCZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufSZmaWVsZHM9JHtjb25maWcuZmllbGRbY29tbWFuZF0udG9TdHJpbmcoKX1gLChyZXMpPT57XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGQuZnJvbSl7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XHJcblx0XHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKXtcclxuXHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0PTApe1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCl7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywnbGltaXQ9JytsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGQuZnJvbSl7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XHJcblx0XHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKXtcclxuXHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpPT57XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0U2hhcmUoYWZ0ZXI9Jycpe1xyXG5cdFx0XHRcdGxldCB1cmwgPSBgaHR0cHM6Ly9hbTY2YWhndHA4LmV4ZWN1dGUtYXBpLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vc2hhcmU/ZmJpZD0ke2ZiaWQuZnVsbElEfSZhZnRlcj0ke2FmdGVyfWA7XHJcblx0XHRcdFx0cmVzb2x2ZShbXSk7XHJcblx0XHRcdFx0Ly8gJC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHQvLyBcdGlmIChyZXMgPT09ICdlbmQnKXtcclxuXHRcdFx0XHQvLyBcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0Ly8gXHR9ZWxzZXtcclxuXHRcdFx0XHQvLyBcdFx0aWYgKHJlcy5lcnJvck1lc3NhZ2Upe1xyXG5cdFx0XHRcdC8vIFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdC8vIFx0XHR9ZWxzZSBpZihyZXMuZGF0YSl7XHJcblx0XHRcdFx0Ly8gXHRcdFx0Ly8gc2hhcmVFcnJvciA9IDA7XHJcblx0XHRcdFx0Ly8gXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHQvLyBcdFx0XHRcdGxldCBuYW1lID0gJyc7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHRpZihpLnN0b3J5KXtcclxuXHRcdFx0XHQvLyBcdFx0XHRcdFx0bmFtZSA9IGkuc3Rvcnkuc3Vic3RyaW5nKDAsIGkuc3RvcnkuaW5kZXhPZignIHNoYXJlZCcpKTtcclxuXHRcdFx0XHQvLyBcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdC8vIFx0XHRcdFx0XHRuYW1lID0gaS5pZC5zdWJzdHJpbmcoMCwgaS5pZC5pbmRleE9mKFwiX1wiKSk7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgaWQgPSBpLmlkLnN1YnN0cmluZygwLCBpLmlkLmluZGV4T2YoXCJfXCIpKTtcclxuXHRcdFx0XHQvLyBcdFx0XHRcdGkuZnJvbSA9IHtpZCwgbmFtZX07XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHRkYXRhcy5wdXNoKGkpO1xyXG5cdFx0XHRcdC8vIFx0XHRcdH1cclxuXHRcdFx0XHQvLyBcdFx0XHRnZXRTaGFyZShyZXMuYWZ0ZXIpO1xyXG5cdFx0XHRcdC8vIFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQvLyBcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdC8vIH0pXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZmJpZCk9PntcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0c3RlcC5zdGVwMigpO1xyXG5cdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHQkKCcucmVzdWx0X2FyZWEgPiAudGl0bGUgc3BhbicpLnRleHQoZmJpZC5mdWxsSUQpO1xyXG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyYXdcIiwgSlNPTi5zdHJpbmdpZnkoZmJpZCkpO1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH0sXHJcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSk9PntcclxuXHRcdGRhdGEuZmlsdGVyZWQgPSB7fTtcclxuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocmF3RGF0YS5kYXRhKSl7XHJcblx0XHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0XHRpZiAoa2V5ID09PSAncmVhY3Rpb25zJykgaXNUYWcgPSBmYWxzZTtcclxuXHRcdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YS5kYXRhW2tleV0sIGtleSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1x0XHJcblx0XHRcdGRhdGEuZmlsdGVyZWRba2V5XSA9IG5ld0RhdGE7XHJcblx0XHR9XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpe1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbHRlcmVkKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gZGF0YS5maWx0ZXJlZDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4Y2VsOiAocmF3KT0+e1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKXtcclxuXHRcdFx0JC5lYWNoKHJhdyxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCIgOiB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIuipsuWIhuS6q+iumuaVuFwiIDogdGhpcy5saWtlX2NvdW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuW/g+aDhVwiIDogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpPT57XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmVkID0gcmF3ZGF0YTtcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhmaWx0ZXJlZCkpe1xyXG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRcdGlmKGtleSA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZD7lv4Pmg4U8L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZWRba2V5XS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0XHQvLyBwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0XHRpZihrZXkgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgdmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdFx0JChcIi50YWJsZXMgLlwiK2tleStcIiB0YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0YWN0aXZlKCk7XHJcblx0XHR0YWIuaW5pdCgpO1xyXG5cdFx0Y29tcGFyZS5pbml0KCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IGFyciA9IFsnY29tbWVudHMnLCdyZWFjdGlvbnMnLCdzaGFyZWRwb3N0cyddO1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0XHRsZXQgdGFibGUgPSAkKCcudGFibGVzIC4nK2krJyB0YWJsZScpLkRhdGFUYWJsZSgpO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpPT57XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY29tcGFyZSA9IHtcclxuXHRhbmQ6IFtdLFxyXG5cdG9yOiBbXSxcclxuXHRyYXc6IFtdLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHRjb21wYXJlLmFuZCA9IFtdO1xyXG5cdFx0Y29tcGFyZS5vciA9IFtdO1xyXG5cdFx0Y29tcGFyZS5yYXcgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRsZXQgaWdub3JlID0gJCgnLnRhYmxlcyAudG90YWwgLmZpbHRlcnMgc2VsZWN0JykudmFsKCk7XHJcblx0XHRsZXQgYmFzZSA9IFtdO1xyXG5cdFx0bGV0IGZpbmFsID0gW107XHJcblx0XHRsZXQgY29tcGFyZV9udW0gPSAxO1xyXG5cdFx0aWYgKGlnbm9yZSA9PT0gJ2lnbm9yZScpIGNvbXBhcmVfbnVtID0gMjtcclxuXHJcblx0XHRmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhjb21wYXJlLnJhdykpe1xyXG5cdFx0XHRpZiAoa2V5ICE9PSBpZ25vcmUpe1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBjb21wYXJlLnJhd1trZXldKXtcclxuXHRcdFx0XHRcdGJhc2UucHVzaChpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGxldCBzb3J0ID0gKGRhdGEucmF3LmV4dGVuc2lvbikgPyAnbmFtZSc6J2lkJztcclxuXHRcdGJhc2UgPSBiYXNlLnNvcnQoKGEsYik9PntcclxuXHRcdFx0cmV0dXJuIGEuZnJvbVtzb3J0XSA+IGIuZnJvbVtzb3J0XSA/IDE6LTE7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmb3IobGV0IGkgb2YgYmFzZSl7XHJcblx0XHRcdGkubWF0Y2ggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRsZXQgdGVtcF9uYW1lID0gJyc7XHJcblx0XHQvLyBjb25zb2xlLmxvZyhiYXNlKTtcclxuXHRcdGZvcihsZXQgaSBpbiBiYXNlKXtcclxuXHRcdFx0bGV0IG9iaiA9IGJhc2VbaV07XHJcblx0XHRcdGlmIChvYmouZnJvbS5pZCA9PSB0ZW1wIHx8IChkYXRhLnJhdy5leHRlbnNpb24gJiYgKG9iai5mcm9tLm5hbWUgPT0gdGVtcF9uYW1lKSkpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSBmaW5hbFtmaW5hbC5sZW5ndGgtMV07XHJcblx0XHRcdFx0dGFyLm1hdGNoKys7XHJcblx0XHRcdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSl7XHJcblx0XHRcdFx0XHRpZiAoIXRhcltrZXldKSB0YXJba2V5XSA9IG9ialtrZXldOyAvL+WQiOS9teizh+aWmVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGFyLm1hdGNoID09IGNvbXBhcmVfbnVtKXtcclxuXHRcdFx0XHRcdHRlbXBfbmFtZSA9ICcnO1xyXG5cdFx0XHRcdFx0dGVtcCA9ICcnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmluYWwucHVzaChvYmopO1xyXG5cdFx0XHRcdHRlbXAgPSBvYmouZnJvbS5pZDtcclxuXHRcdFx0XHR0ZW1wX25hbWUgPSBvYmouZnJvbS5uYW1lO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0XHJcblx0XHRjb21wYXJlLm9yID0gZmluYWw7XHJcblx0XHRjb21wYXJlLmFuZCA9IGNvbXBhcmUub3IuZmlsdGVyKCh2YWwpPT57XHJcblx0XHRcdHJldHVybiB2YWwubWF0Y2ggPT0gY29tcGFyZV9udW07XHJcblx0XHR9KTtcclxuXHRcdGNvbXBhcmUuZ2VuZXJhdGUoKTtcclxuXHR9LFxyXG5cdGdlbmVyYXRlOiAoKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBkYXRhX2FuZCA9IGNvbXBhcmUuYW5kO1xyXG5cclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBkYXRhX2FuZC5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcwJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLmFuZCB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cclxuXHRcdGxldCBkYXRhX29yID0gY29tcGFyZS5vcjtcclxuXHRcdGxldCB0Ym9keTIgPSAnJztcclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9vci5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50IHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpIHx8ICcnfTwvdGQ+YDtcclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkyICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLm9yIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keTIpO1xyXG5cdFx0XHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IGFyciA9IFsnYW5kJywnb3InXTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoY3RybCA9IGZhbHNlKT0+e1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApe1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oY3RybCk7XHJcblx0fSxcclxuXHRnbzogKGN0cmwpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9IHRhYi5ub3c7XHJcblx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YVtjb21tYW5kXS5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1x0XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRsZXQgdGVtcEFyciA9IFtdO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2LmFjdGl2ZSB0YWJsZScpLkRhdGFUYWJsZSgpLmNvbHVtbigyKS5kYXRhKCkuZWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpe1xyXG5cdFx0XHRcdGxldCB3b3JkID0gJCgnLnNlYXJjaENvbW1lbnQnKS52YWwoKTtcclxuXHRcdFx0XHRpZiAodmFsdWUuaW5kZXhPZih3b3JkKSA+PSAwKSB0ZW1wQXJyLnB1c2goaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiBjaG9vc2UuYXdhcmQpe1xyXG5cdFx0XHRsZXQgcm93ID0gKHRlbXBBcnIubGVuZ3RoID09IDApID8gaTp0ZW1wQXJyW2ldO1xyXG5cdFx0XHRsZXQgdGFyID0gJCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5yb3cocm93KS5ub2RlKCkuaW5uZXJIVE1MO1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0cj4nICsgdGFyICsgJzwvdHI+JztcclxuXHRcdH1cclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKGluc2VydCk7XHJcblx0XHRpZiAoIWN0cmwpe1xyXG5cdFx0XHQkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0Ly8gbGV0IHRhciA9ICQodGhpcykuZmluZCgndGQnKS5lcSgxKTtcclxuXHRcdFx0XHQvLyBsZXQgaWQgPSB0YXIuZmluZCgnYScpLmF0dHIoJ2F0dHItZmJpZCcpO1xyXG5cdFx0XHRcdC8vIHRhci5wcmVwZW5kKGA8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xyXG5cdFx0XHRsZXQgbm93ID0gMDtcclxuXHRcdFx0Zm9yKGxldCBrIGluIGNob29zZS5saXN0KXtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjdcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhdywgY29tbWFuZCwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9PntcclxuXHRcdGxldCBkYXRhID0gcmF3O1xyXG5cdFx0aWYgKHdvcmQgIT09ICcnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kICE9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBlbmRUaW1lKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnJlYWN0KGRhdGEsIHJlYWN0KTtcclxuXHRcdH1cclxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSk9PntcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHQpPT57XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLChwYXJzZUludCh0aW1lX2FyeVsxXSktMSksdGltZV9hcnlbMl0sdGltZV9hcnlbM10sdGltZV9hcnlbNF0sdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmIChjcmVhdGVkX3RpbWUgPCB0aW1lIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcik9PntcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKT0+e1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWIgPSB7XHJcblx0bm93OiBcImNvbW1lbnRzXCIsXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0dGFiLm5vdyA9ICQodGhpcykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHRcdGxldCB0YXIgPSAkKHRoaXMpLmluZGV4KCk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5lcSh0YXIpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCl7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSsxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XHJcblx0IHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xyXG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG4gICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICAgaWYgKGRhdGUgPCAxMCl7XHJcbiAgICAgXHRkYXRlID0gXCIwXCIrZGF0ZTtcclxuICAgICB9XHJcbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcbiAgICAgaWYgKGhvdXIgPCAxMCl7XHJcbiAgICAgXHRob3VyID0gXCIwXCIraG91cjtcclxuICAgICB9XHJcbiAgICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG4gICAgIGlmIChtaW4gPCAxMCl7XHJcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XHJcbiAgICAgfVxyXG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuICAgICBpZiAoc2VjIDwgMTApe1xyXG4gICAgIFx0c2VjID0gXCIwXCIrc2VjO1xyXG4gICAgIH1cclxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcclxuICAgICByZXR1cm4gdGltZTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcbiAgICBcclxuICAgIHZhciBDU1YgPSAnJzsgICAgXHJcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuICAgIFxyXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuICAgIGlmIChTaG93TGFiZWwpIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXHJcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSAgIFxyXG4gICAgXHJcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcbiAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxyXG4gICAgXHJcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuICAgIFxyXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG4gICAgXHJcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcclxuICAgIGxpbmsuaHJlZiA9IHVyaTtcclxuICAgIFxyXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuICAgIFxyXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
