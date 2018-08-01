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
	auth: 'manage_pages',
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
				if (authStr.indexOf('manage_pages') >= 0) {
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
			FB.api(config.apiVersion.newest + "/me/groups?fields=name,id,administrator&limit=100", function (res) {
				resolve(res.data.filter(function (item) {
					return item.administrator === true;
				}));
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
			if (authStr.indexOf('manage_pages') >= 0) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJoYXNoIiwibG9jYXRpb24iLCJpbmRleE9mIiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInNlc3Npb25TdG9yYWdlIiwiYWxlcnQiLCJocmVmIiwibGFzdERhdGEiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwiZGF0YSIsImZpbmlzaCIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJlIiwiZ2V0QXV0aCIsImN0cmxLZXkiLCJhbHRLZXkiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGlrZXMiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJvcmRlciIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJuZXh0IiwidHlwZSIsIkZCIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJmYmlkIiwiUHJvbWlzZSIsImFsbCIsImdldE1lIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsIm9wdGlvbnMiLCJpIiwiaiIsImlkIiwibmFtZSIsImh0bWwiLCJvcHRpb25EaXNwbGF5IiwiY2hlY2tib3giLCJwcm9wIiwic2VsZWN0UGFnZSIsInRhciIsImF0dHIiLCJzZXRUb2tlbiIsInN0ZXAiLCJzdGVwMSIsInBhZ2VpZCIsInBhZ2VzIiwiYWNjZXNzX3Rva2VuIiwiaGlkZGVuU3RhcnQiLCJwYWdlSUQiLCJzcGxpdCIsImFwaSIsImVycm9yIiwiY2xlYXIiLCJlbXB0eSIsImZpbmQiLCJjb21tYW5kIiwicGFnaW5nIiwic3RyIiwiZ2VuRGF0YSIsIm1lc3NhZ2UiLCJyZWNvbW1hbmQiLCJnZW5DYXJkIiwib2JqIiwiaWRzIiwibGluayIsIm1lc3MiLCJyZXBsYWNlIiwidGltZUNvbnZlcnRlciIsImNyZWF0ZWRfdGltZSIsInNyYyIsImZ1bGxfcGljdHVyZSIsInJlc29sdmUiLCJyZWplY3QiLCJhcnIiLCJpdGVtIiwiYWRtaW5pc3RyYXRvciIsImV4dGVuc2lvbkF1dGgiLCJleHRlbnNpb25DYWxsYmFjayIsInNldEl0ZW0iLCJleHRlbmQiLCJmaWQiLCJwdXNoIiwiZnJvbSIsInByb21pc2VfYXJyYXkiLCJuYW1lcyIsInByb21pc2UiLCJnZXROYW1lIiwiT2JqZWN0Iiwia2V5cyIsInBvc3RkYXRhIiwic3RvcnkiLCJwb3N0bGluayIsImxpa2VfY291bnQiLCJ0aXRsZSIsInRvU3RyaW5nIiwic2Nyb2xsVG9wIiwic3RlcDIiLCJmaWx0ZXJlZCIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInRlc3QiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImZ1bGxJRCIsImNvbW1hbmRzIiwidGVtcF9kYXRhIiwiZ2V0IiwiZGF0YXMiLCJzaGFyZUVycm9yIiwiZ2V0U2hhcmUiLCJkIiwidXBkYXRlZF90aW1lIiwiZ2V0TmV4dCIsImdldEpTT04iLCJmYWlsIiwiYWZ0ZXIiLCJzdWJzdHJpbmciLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsImtleSIsImlzVGFnIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwibmV3T2JqIiwiZWFjaCIsInRtcCIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsInBpYyIsInRoZWFkIiwidGJvZHkiLCJlbnRyaWVzIiwicGljdHVyZSIsInRkIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYW5kIiwib3IiLCJpZ25vcmUiLCJiYXNlIiwiZmluYWwiLCJjb21wYXJlX251bSIsInNvcnQiLCJhIiwiYiIsIm1hdGNoIiwidGVtcCIsInRlbXBfbmFtZSIsImRhdGFfYW5kIiwiZGF0YV9vciIsInRib2R5MiIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsImN0cmwiLCJuIiwicGFyc2VJbnQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsInRlbXBBcnIiLCJjb2x1bW4iLCJpbmRleCIsInJvdyIsIm5vZGUiLCJpbm5lckhUTUwiLCJrIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0IiwiZm9yRWFjaCIsIm5ld0FyeSIsImdyZXAiLCJtZXNzYWdlX3RhZ3MiLCJ0IiwidGltZV9hcnkiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJ1aSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsIm1hcCIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBO0FBQ0RTLEVBQUVFLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFVO0FBQzNCLEtBQUlDLFdBQVcsQ0FBZjtBQUNBSixHQUFFLFFBQUYsRUFBWUssS0FBWixDQUFrQixZQUFVO0FBQzNCRDtBQUNBLE1BQUlBLFlBQVksQ0FBaEIsRUFBa0I7QUFDakJKLEtBQUUsUUFBRixFQUFZTSxHQUFaLENBQWdCLE9BQWhCO0FBQ0FOLEtBQUUsMEJBQUYsRUFBOEJPLFdBQTlCLENBQTBDLE1BQTFDO0FBQ0E7QUFDRCxFQU5EOztBQVFBLEtBQUlDLE9BQU9DLFNBQVNELElBQXBCO0FBQ0EsS0FBSUEsS0FBS0UsT0FBTCxDQUFhLE9BQWIsS0FBeUIsQ0FBN0IsRUFBK0I7QUFD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cVQsSUFBVCxDQUFjQyxXQUFkLENBQTBCM0ssSUFBMUI7QUFDQUEsTUFBS3hJLEtBQUw7QUFDQUgsVUFBU3FULElBQVQsQ0FBY0UsV0FBZCxDQUEwQjVLLElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0bGV0IGhpZGVhcmVhID0gMDtcclxuXHQkKCdoZWFkZXInKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aGlkZWFyZWErKztcclxuXHRcdGlmIChoaWRlYXJlYSA+PSA1KXtcclxuXHRcdFx0JCgnaGVhZGVyJykub2ZmKCdjbGljaycpO1xyXG5cdFx0XHQkKCcjZmJpZF9idXR0b24sICNwdXJlX2ZiaWQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImNsZWFyXCIpID49IDApe1xyXG5cdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3JhdycpO1xyXG5cdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnbG9naW4nKTtcclxuXHRcdGFsZXJ0KCflt7LmuIXpmaTmmqvlrZjvvIzoq4vph43mlrDpgLLooYznmbvlhaUnKTtcclxuXHRcdGxvY2F0aW9uLmhyZWYgPSAnaHR0cHM6Ly9nZzkwMDUyLmdpdGh1Yi5pby9jb21tZW50X2hlbHBlcl9wbHVzJztcclxuXHR9XHJcblx0bGV0IGxhc3REYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJhd1wiKSk7XHJcblxyXG5cdGlmIChsYXN0RGF0YSl7XHJcblx0XHRkYXRhLmZpbmlzaChsYXN0RGF0YSk7XHJcblx0fVxyXG5cdGlmIChzZXNzaW9uU3RvcmFnZS5sb2dpbil7XHJcblx0XHRmYi5nZW5PcHRpb24oSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbikpO1xyXG5cdH1cclxuXHJcblx0Ly8gJChcIi50YWJsZXMgPiAuc2hhcmVkcG9zdHMgYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdC8vIFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0Ly8gXHRcdGZiLmV4dGVuc2lvbkF1dGgoJ2ltcG9ydCcpO1xyXG5cdC8vIFx0fWVsc2V7XHJcblx0Ly8gXHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9KTtcclxuXHRcclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX3N0YXJ0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHRjaG9vc2UuaW5pdCh0cnVlKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8ICFlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi50YWJsZXMgLmZpbHRlcnMgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5jb21wYXJlX2NvbmRpdGlvbicpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuJysgJCh0aGlzKS52YWwoKSkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XHJcblx0XHRcInNpbmdsZURhdGVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS1NTS1ERCAgIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSxmdW5jdGlvbihzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShub3dEYXRlKCkpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGlmIChlLmN0cmxLZXkpe1xyXG5cdFx0XHRsZXQgZGQ7XHJcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGFbdGFiLm5vd10pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBkZDtcclxuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XHJcblx0XHRcdHdpbmRvdy5mb2N1cygpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApe1xyXG5cdFx0XHRcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGFbdGFiLm5vd10pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpe1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZihlLmN0cmxLZXkpe1xyXG5cdFx0XHRmYi5nZXRBdXRoKCdzaGFyZWRwb3N0cycpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UnLCdmcm9tJywnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFsnY3JlYXRlZF90aW1lJywnZnJvbScsJ21lc3NhZ2UnLCdzdG9yeSddLFxyXG5cdFx0bGlrZXM6IFsnbmFtZSddXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJyxcclxuXHRcdGxpa2VzOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi4xMicsXHJcblx0XHRyZWFjdGlvbnM6ICd2Mi4xMicsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YyLjEyJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjEyJyxcclxuXHRcdGZlZWQ6ICd2Mi4xMicsXHJcblx0XHRncm91cDogJ3YyLjEyJyxcclxuXHRcdG5ld2VzdDogJ3YyLjEyJ1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0b3JkZXI6ICcnLFxyXG5cdGF1dGg6ICdtYW5hZ2VfcGFnZXMnLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cGFnZVRva2VuOiAnJyxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdG5leHQ6ICcnLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDApe1xyXG5cdFx0XHRcdFx0ZmIuc3RhcnQoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfmjojmrIrlpLHmlZfvvIzoq4vntabkuojmiYDmnInmrIrpmZAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1x0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKT0+e1xyXG5cdFx0UHJvbWlzZS5hbGwoW2ZiLmdldE1lKCksZmIuZ2V0UGFnZSgpLCBmYi5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5sb2dpbiA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcblx0XHRcdGZiLmdlbk9wdGlvbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5PcHRpb246IChyZXMpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgb3B0aW9ucyA9IGA8aW5wdXQgaWQ9XCJwdXJlX2ZiaWRcIiBjbGFzcz1cImhpZGVcIj48YnV0dG9uIGlkPVwiZmJpZF9idXR0b25cIiBjbGFzcz1cImJ0biBoaWRlXCIgb25jbGljaz1cImZiLmhpZGRlblN0YXJ0KClcIj7nlLFGQklE5pO35Y+WPC9idXR0b24+PGxhYmVsPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbmNoYW5nZT1cImZiLm9wdGlvbkRpc3BsYXkodGhpcylcIj7pmrHol4/liJfooag8L2xhYmVsPjxicj5gO1xyXG5cdFx0bGV0IHR5cGUgPSAtMTtcclxuXHRcdCQoJyNidG5fc3RhcnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJlcyl7XHJcblx0XHRcdHR5cGUrKztcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGkpe1xyXG5cdFx0XHRcdG9wdGlvbnMgKz0gYDxkaXYgY2xhc3M9XCJwYWdlX2J0blwiIGF0dHItdHlwZT1cIiR7dHlwZX1cIiBhdHRyLXZhbHVlPVwiJHtqLmlkfVwiIG9uY2xpY2s9XCJmYi5zZWxlY3RQYWdlKHRoaXMpXCI+JHtqLm5hbWV9PC9kaXY+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnI2VudGVyVVJMJykuaHRtbChvcHRpb25zKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdH0sXHJcblx0b3B0aW9uRGlzcGxheTogKGNoZWNrYm94KT0+e1xyXG5cdFx0aWYgKCQoY2hlY2tib3gpLnByb3AoJ2NoZWNrZWQnKSl7XHJcblx0XHRcdCQoJy5wYWdlX2J0bicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCgnLnBhZ2VfYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6IChlKT0+e1xyXG5cdFx0JCgnI2VudGVyVVJMIC5wYWdlX2J0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCB0YXIgPSAkKGUpO1xyXG5cdFx0dGFyLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGlmICh0YXIuYXR0cignYXR0ci10eXBlJykgPT0gMSl7XHJcblx0XHRcdGZiLnNldFRva2VuKHRhci5hdHRyKCdhdHRyLXZhbHVlJykpO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZmVlZCh0YXIuYXR0cignYXR0ci12YWx1ZScpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQpO1xyXG5cdFx0c3RlcC5zdGVwMSgpO1xyXG5cdH0sXHJcblx0c2V0VG9rZW46IChwYWdlaWQpPT57XHJcblx0XHRsZXQgcGFnZXMgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKVsxXTtcclxuXHRcdGZvcihsZXQgaSBvZiBwYWdlcyl7XHJcblx0XHRcdGlmIChpLmlkID09IHBhZ2VpZCl7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IGkuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRoaWRkZW5TdGFydDogKCk9PntcclxuXHRcdGxldCBmYmlkID0gJCgnI3B1cmVfZmJpZCcpLnZhbCgpO1xyXG5cdFx0bGV0IHBhZ2VJRCA9IGZiaWQuc3BsaXQoJ18nKVswXTtcclxuXHRcdEZCLmFwaShgLyR7cGFnZUlEfT9maWVsZHM9YWNjZXNzX3Rva2VuYCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRpZiAocmVzLmVycm9yKXtcclxuXHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbil7XHJcblx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmZWVkOiAocGFnZUlELCB0eXBlLCB1cmwgPSAnJywgY2xlYXIgPSB0cnVlKT0+e1xyXG5cdFx0aWYgKGNsZWFyKXtcclxuXHRcdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHRcdCQoJy5mZWVkcyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5vZmYoJ2NsaWNrJykuY2xpY2soKCk9PntcclxuXHRcdFx0XHRsZXQgdGFyID0gJCgnI2VudGVyVVJMIHNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xyXG5cdFx0XHRcdGZiLmZlZWQodGFyLnZhbCgpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQsIGZhbHNlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRsZXQgY29tbWFuZCA9ICh0eXBlID09ICcyJykgPyAnZmVlZCc6J3Bvc3RzJztcclxuXHRcdGxldCBhcGk7XHJcblx0XHRpZiAodXJsID09ICcnKXtcclxuXHRcdFx0YXBpID0gYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VJRH0vJHtjb21tYW5kfT9maWVsZHM9bGluayxmdWxsX3BpY3R1cmUsY3JlYXRlZF90aW1lLG1lc3NhZ2UmbGltaXQ9MjVgO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFwaSA9IHVybDtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShhcGksIChyZXMpPT57XHJcblx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPT0gMCl7XHJcblx0XHRcdFx0JCgnLmZlZWRzIC5idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZiLm5leHQgPSByZXMucGFnaW5nLm5leHQ7XHJcblx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0bGV0IHN0ciA9IGdlbkRhdGEoaSk7XHJcblx0XHRcdFx0JCgnLnNlY3Rpb24gLmZlZWRzIHRib2R5JykuYXBwZW5kKHN0cik7XHJcblx0XHRcdFx0aWYgKGkubWVzc2FnZSAmJiBpLm1lc3NhZ2UuaW5kZXhPZign5oq9JykgPj0gMCl7XHJcblx0XHRcdFx0XHRsZXQgcmVjb21tYW5kID0gZ2VuQ2FyZChpKTtcclxuXHRcdFx0XHRcdCQoJy5kb25hdGVfYXJlYSAucmVjb21tYW5kcycpLmFwcGVuZChyZWNvbW1hbmQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2VuRGF0YShvYmope1xyXG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcclxuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XHJcblxyXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRsZXQgc3RyID0gYDx0cj5cclxuXHRcdFx0XHRcdFx0PHRkPjxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiAgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIob2JqLmNyZWF0ZWRfdGltZSl9PC90ZD5cclxuXHRcdFx0XHRcdFx0PC90cj5gO1xyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZ2VuQ2FyZChvYmope1xyXG5cdFx0XHRsZXQgc3JjID0gb2JqLmZ1bGxfcGljdHVyZSB8fCAnaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4MjI1JztcclxuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XHJcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0bGV0XHRzdHIgPSBgPGRpdiBjbGFzcz1cImNhcmRcIj5cclxuXHRcdFx0PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtaW1hZ2VcIj5cclxuXHRcdFx0PGZpZ3VyZSBjbGFzcz1cImltYWdlIGlzLTRieTNcIj5cclxuXHRcdFx0PGltZyBzcmM9XCIke3NyY31cIiBhbHQ9XCJcIj5cclxuXHRcdFx0PC9maWd1cmU+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2E+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWNvbnRlbnRcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuXHRcdFx0JHttZXNzfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj5cclxuXHRcdFx0PC9kaXY+YDtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldE1lOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lYCwgKHJlcyk9PntcclxuXHRcdFx0XHRsZXQgYXJyID0gW3Jlc107XHJcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2ZpZWxkcz1uYW1lLGlkLGFkbWluaXN0cmF0b3ImbGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlIChyZXMuZGF0YS5maWx0ZXIoaXRlbT0+e3JldHVybiBpdGVtLmFkbWluaXN0cmF0b3IgPT09IHRydWV9KSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoY29tbWFuZCA9ICcnKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UsIGNvbW1hbmQpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSwgY29tbWFuZCA9ICcnKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCl7XHJcblx0XHRcdFx0ZGF0YS5yYXcuZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAoY29tbWFuZCA9PSAnaW1wb3J0Jyl7XHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNoYXJlZHBvc3RzXCIsICQoJyNpbXBvcnQnKS52YWwoKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBleHRlbmQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2hhcmVkcG9zdHNcIikpO1xyXG5cdFx0XHRcdGxldCBmaWQgPSBbXTtcclxuXHRcdFx0XHRsZXQgaWRzID0gW107XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRmaWQucHVzaChpLmZyb20uaWQpO1xyXG5cdFx0XHRcdFx0aWYgKGZpZC5sZW5ndGggPj00NSl7XHJcblx0XHRcdFx0XHRcdGlkcy5wdXNoKGZpZCk7XHJcblx0XHRcdFx0XHRcdGZpZCA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZHMucHVzaChmaWQpO1xyXG5cdFx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW10sIG5hbWVzID0ge307XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIGlkcyl7XHJcblx0XHRcdFx0XHRsZXQgcHJvbWlzZSA9IGZiLmdldE5hbWUoaSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgT2JqZWN0LmtleXMocmVzKSl7XHJcblx0XHRcdFx0XHRcdFx0bmFtZXNbaV0gPSByZXNbaV07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgcG9zdGRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5wb3N0ZGF0YSk7XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdFx0XHRpZiAocG9zdGRhdGEudHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0XHQvLyBGQi5hcGkoXCIvbWVcIiwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChyZXMubmFtZSA9PT0gcG9zdGRhdGEub3duZXIpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpLm1lc3NhZ2UgPSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGkubGlrZV9jb3VudCA9ICdOL0EnO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHRpdGxlOiAn5YCL5Lq66LK85paH5Y+q5pyJ55m85paH6ICF5pys5Lq66IO95oqTJyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aHRtbDogYOiyvOaWh+W4s+iZn+WQjeeose+8miR7cG9zdGRhdGEub3duZXJ9PGJyPuebruWJjeW4s+iZn+WQjeeose+8miR7cmVzLm5hbWV9YCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9KTtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0aS5saWtlX2NvdW50ID0gJ04vQSc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNlIGlmKHBvc3RkYXRhLnR5cGUgPT09ICdncm91cCcpe1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRpLmxpa2VfY291bnQgPSAnTi9BJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGkubGlrZV9jb3VudCA9ICdOL0EnO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRpZiAocG9zdGRhdGEudHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0XHQvLyBGQi5hcGkoXCIvbWVcIiwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChyZXMubmFtZSA9PT0gcG9zdGRhdGEub3duZXIpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkuY3JlYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aS50eXBlID0gJ0xJS0UnO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHRpdGxlOiAn5YCL5Lq66LK85paH5Y+q5pyJ55m85paH6ICF5pys5Lq66IO95oqTJyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aHRtbDogYOiyvOaWh+W4s+iZn+WQjeeose+8miR7cG9zdGRhdGEub3duZXJ9PGJyPuebruWJjeW4s+iZn+WQjeeose+8miR7cmVzLm5hbWV9YCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9KTtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuY3JlYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNlIGlmKHBvc3RkYXRhLnR5cGUgPT09ICdncm91cCcpe1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5jcmVhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmNyZWF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRQcm9taXNlLmFsbChwcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0aS5mcm9tLm5hbWUgPSBuYW1lc1tpLmZyb20uaWRdID8gbmFtZXNbaS5mcm9tLmlkXS5uYW1lIDogaS5mcm9tLm5hbWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkYXRhLnJhdy5kYXRhW2NvbW1hbmRdID0gZXh0ZW5kO1xyXG5cdFx0XHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXROYW1lOiAoaWRzKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9Lz9pZHM9JHtpZHMudG9TdHJpbmcoKX1gLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxubGV0IHN0ZXAgPSB7XHJcblx0c3RlcDE6ICgpPT57XHJcblx0XHQkKCcuc2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH0sXHJcblx0c3RlcDI6ICgpPT57XHJcblx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzIHRib2R5JykuZW1wdHkoKTtcclxuXHRcdCQoJy5zZWN0aW9uJykuYWRkQ2xhc3MoJ3N0ZXAyJyk7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IHt9LFxyXG5cdGZpbHRlcmVkOiB7fSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdHRlc3Q6IChpZCk9PntcclxuXHRcdGNvbnNvbGUubG9nKGlkKTtcclxuXHR9LFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKT0+e1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRmdWxsSUQ6IGZiaWRcclxuXHRcdH1cclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgY29tbWFuZHMgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcclxuXHRcdGxldCB0ZW1wX2RhdGEgPSBvYmo7XHJcblx0XHRmb3IobGV0IGkgb2YgY29tbWFuZHMpe1xyXG5cdFx0XHR0ZW1wX2RhdGEuZGF0YSA9IHt9O1xyXG5cdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KHRlbXBfZGF0YSwgaSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdHRlbXBfZGF0YS5kYXRhW2ldID0gcmVzO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdGRhdGEuZmluaXNoKHRlbXBfZGF0YSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQsIGNvbW1hbmQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBzaGFyZUVycm9yID0gMDtcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJykgY29tbWFuZCA9ICdncm91cCc7XHJcblx0XHRcdGlmIChjb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0XHRnZXRTaGFyZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7Y29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbY29tbWFuZF19Jm9yZGVyPWNocm9ub2xvZ2ljYWwmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9YCwocmVzKT0+e1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldFNoYXJlKGFmdGVyPScnKXtcclxuXHRcdFx0XHRsZXQgdXJsID0gYGh0dHBzOi8vYW02NmFoZ3RwOC5leGVjdXRlLWFwaS5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tL3NoYXJlP2ZiaWQ9JHtmYmlkLmZ1bGxJRH0mYWZ0ZXI9JHthZnRlcn1gO1xyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRpZiAocmVzID09PSAnZW5kJyl7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3JNZXNzYWdlKXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYocmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRcdC8vIHNoYXJlRXJyb3IgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgbmFtZSA9ICcnO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoaS5zdG9yeSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBpLnN0b3J5LnN1YnN0cmluZygwLCBpLnN0b3J5LmluZGV4T2YoJyBzaGFyZWQnKSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZSA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGlkID0gaS5pZC5zdWJzdHJpbmcoMCwgaS5pZC5pbmRleE9mKFwiX1wiKSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpLmZyb20gPSB7aWQsIG5hbWV9O1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChpKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0Z2V0U2hhcmUocmVzLmFmdGVyKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdHN0ZXAuc3RlcDIoKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0JCgnLnJlc3VsdF9hcmVhID4gLnRpdGxlIHNwYW4nKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmF3XCIsIEpTT04uc3RyaW5naWZ5KGZiaWQpKTtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XHJcblx0XHRkYXRhLmZpbHRlcmVkID0ge307XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHJhd0RhdGEuZGF0YSkpe1xyXG5cdFx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdFx0aWYgKGtleSA9PT0gJ3JlYWN0aW9ucycpIGlzVGFnID0gZmFsc2U7XHJcblx0XHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEuZGF0YVtrZXldLCBrZXksIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcdFxyXG5cdFx0XHRkYXRhLmZpbHRlcmVkW2tleV0gPSBuZXdEYXRhO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKXtcclxuXHRcdFx0dGFibGUuZ2VuZXJhdGUoZGF0YS5maWx0ZXJlZCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIGRhdGEuZmlsdGVyZWQ7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdyk9PntcclxuXHRcdHZhciBuZXdPYmogPSBbXTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbil7XHJcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCIgOiB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIuipsuWIhuS6q+iumuaVuFwiIDogdGhpcy5saWtlX2NvdW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi5b+D5oOFXCIgOiB0aGlzLnR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiIDogdGltZUNvbnZlcnRlcih0aGlzLmNyZWF0ZWRfdGltZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3T2JqO1xyXG5cdH0sXHJcblx0aW1wb3J0OiAoZmlsZSk9PntcclxuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHRcdFx0ZGF0YS5yYXcgPSBKU09OLnBhcnNlKHN0cik7XHJcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpPT57XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZmlsdGVyZWQgPSByYXdkYXRhO1xyXG5cdFx0bGV0IHBpYyA9ICQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKGZpbHRlcmVkKSl7XHJcblx0XHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkPuW/g+aDhTwvdGQ+YDtcclxuXHRcdFx0fWVsc2UgaWYoa2V5ID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdFx0PHRkIHdpZHRoPVwiMTEwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0XHQ8dGQ+6K6aPC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJlZFtrZXldLmVudHJpZXMoKSl7XHJcblx0XHRcdFx0bGV0IHBpY3R1cmUgPSAnJztcclxuXHRcdFx0XHRpZiAocGljKXtcclxuXHRcdFx0XHRcdC8vIHBpY3R1cmUgPSBgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0XHRpZihrZXkgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCB2YWwuc3Rvcnl9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2V9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHRcdCQoXCIudGFibGVzIC5cIitrZXkrXCIgdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGFjdGl2ZSgpO1xyXG5cdFx0dGFiLmluaXQoKTtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBhcnIgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNvbXBhcmUgPSB7XHJcblx0YW5kOiBbXSxcclxuXHRvcjogW10sXHJcblx0cmF3OiBbXSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0Y29tcGFyZS5hbmQgPSBbXTtcclxuXHRcdGNvbXBhcmUub3IgPSBbXTtcclxuXHRcdGNvbXBhcmUucmF3ID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0bGV0IGlnbm9yZSA9ICQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLnZhbCgpO1xyXG5cdFx0bGV0IGJhc2UgPSBbXTtcclxuXHRcdGxldCBmaW5hbCA9IFtdO1xyXG5cdFx0bGV0IGNvbXBhcmVfbnVtID0gMTtcclxuXHRcdGlmIChpZ25vcmUgPT09ICdpZ25vcmUnKSBjb21wYXJlX251bSA9IDI7XHJcblxyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoY29tcGFyZS5yYXcpKXtcclxuXHRcdFx0aWYgKGtleSAhPT0gaWdub3JlKXtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgY29tcGFyZS5yYXdba2V5XSl7XHJcblx0XHRcdFx0XHRiYXNlLnB1c2goaSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRsZXQgc29ydCA9IChkYXRhLnJhdy5leHRlbnNpb24pID8gJ25hbWUnOidpZCc7XHJcblx0XHRiYXNlID0gYmFzZS5zb3J0KChhLGIpPT57XHJcblx0XHRcdHJldHVybiBhLmZyb21bc29ydF0gPiBiLmZyb21bc29ydF0gPyAxOi0xO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Zm9yKGxldCBpIG9mIGJhc2Upe1xyXG5cdFx0XHRpLm1hdGNoID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0bGV0IHRlbXBfbmFtZSA9ICcnO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coYmFzZSk7XHJcblx0XHRmb3IobGV0IGkgaW4gYmFzZSl7XHJcblx0XHRcdGxldCBvYmogPSBiYXNlW2ldO1xyXG5cdFx0XHRpZiAob2JqLmZyb20uaWQgPT0gdGVtcCB8fCAoZGF0YS5yYXcuZXh0ZW5zaW9uICYmIChvYmouZnJvbS5uYW1lID09IHRlbXBfbmFtZSkpKXtcclxuXHRcdFx0XHRsZXQgdGFyID0gZmluYWxbZmluYWwubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdHRhci5tYXRjaCsrO1xyXG5cdFx0XHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKG9iaikpe1xyXG5cdFx0XHRcdFx0aWYgKCF0YXJba2V5XSkgdGFyW2tleV0gPSBvYmpba2V5XTsgLy/lkIjkvbXos4fmlplcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRhci5tYXRjaCA9PSBjb21wYXJlX251bSl7XHJcblx0XHRcdFx0XHR0ZW1wX25hbWUgPSAnJztcclxuXHRcdFx0XHRcdHRlbXAgPSAnJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZpbmFsLnB1c2gob2JqKTtcclxuXHRcdFx0XHR0ZW1wID0gb2JqLmZyb20uaWQ7XHJcblx0XHRcdFx0dGVtcF9uYW1lID0gb2JqLmZyb20ubmFtZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdFxyXG5cdFx0Y29tcGFyZS5vciA9IGZpbmFsO1xyXG5cdFx0Y29tcGFyZS5hbmQgPSBjb21wYXJlLm9yLmZpbHRlcigodmFsKT0+e1xyXG5cdFx0XHRyZXR1cm4gdmFsLm1hdGNoID09IGNvbXBhcmVfbnVtO1xyXG5cdFx0fSk7XHJcblx0XHRjb21wYXJlLmdlbmVyYXRlKCk7XHJcblx0fSxcclxuXHRnZW5lcmF0ZTogKCk9PntcclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZGF0YV9hbmQgPSBjb21wYXJlLmFuZDtcclxuXHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9hbmQuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnQgfHwgJzAnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS5hbmQgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHJcblx0XHRsZXQgZGF0YV9vciA9IGNvbXBhcmUub3I7XHJcblx0XHRsZXQgdGJvZHkyID0gJyc7XHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfb3IuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20uaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPiR7dmFsLnR5cGUgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZSB8fCAnJ308L2E+PC90ZD5cclxuXHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnQgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5MiArPSB0cjtcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS5vciB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkyKTtcclxuXHRcdFxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBhcnIgPSBbJ2FuZCcsJ29yJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKGN0cmwgPSBmYWxzZSk9PntcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcclxuXHRcdGNob29zZS5saXN0ID0gW107XHJcblx0XHRjaG9vc2UubnVtID0gMDtcclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKXtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKGN0cmwpO1xyXG5cdH0sXHJcblx0Z286IChjdHJsKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSB0YWIubm93O1xyXG5cdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGFbY29tbWFuZF0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcdFxyXG5cdFx0fVxyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0bGV0IHRlbXBBcnIgPSBbXTtcclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKXtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5jb2x1bW4oMikuZGF0YSgpLmVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KXtcclxuXHRcdFx0XHRsZXQgd29yZCA9ICQoJy5zZWFyY2hDb21tZW50JykudmFsKCk7XHJcblx0XHRcdFx0aWYgKHZhbHVlLmluZGV4T2Yod29yZCkgPj0gMCkgdGVtcEFyci5wdXNoKGluZGV4KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcclxuXHRcdFx0bGV0IHJvdyA9ICh0ZW1wQXJyLmxlbmd0aCA9PSAwKSA/IGk6dGVtcEFycltpXTtcclxuXHRcdFx0bGV0IHRhciA9ICQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkucm93KHJvdykubm9kZSgpLmlubmVySFRNTDtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHI+JyArIHRhciArICc8L3RyPic7XHJcblx0XHR9XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0aWYgKCFjdHJsKXtcclxuXHRcdFx0JChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdC8vIGxldCB0YXIgPSAkKHRoaXMpLmZpbmQoJ3RkJykuZXEoMSk7XHJcblx0XHRcdFx0Ly8gbGV0IGlkID0gdGFyLmZpbmQoJ2EnKS5hdHRyKCdhdHRyLWZiaWQnKTtcclxuXHRcdFx0XHQvLyB0YXIucHJlcGVuZChgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xyXG5cdFx0XHRsZXQgbm93ID0gMDtcclxuXHRcdFx0Zm9yKGxldCBrIGluIGNob29zZS5saXN0KXtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjdcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhdywgY29tbWFuZCwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9PntcclxuXHRcdGxldCBkYXRhID0gcmF3O1xyXG5cdFx0aWYgKGlzRHVwbGljYXRlKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAod29yZCAhPT0gJycgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnICYmIGNvbW1hbmQgPT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIGVuZFRpbWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSk9PntcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHQpPT57XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLChwYXJzZUludCh0aW1lX2FyeVsxXSktMSksdGltZV9hcnlbMl0sdGltZV9hcnlbM10sdGltZV9hcnlbNF0sdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmIChjcmVhdGVkX3RpbWUgPCB0aW1lIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcik9PntcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKT0+e1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWIgPSB7XHJcblx0bm93OiBcImNvbW1lbnRzXCIsXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0dGFiLm5vdyA9ICQodGhpcykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHRcdGxldCB0YXIgPSAkKHRoaXMpLmluZGV4KCk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQoJy50YWJsZXMgPiBkaXYnKS5lcSh0YXIpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCl7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSsxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XHJcblx0IHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xyXG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG4gICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICAgaWYgKGRhdGUgPCAxMCl7XHJcbiAgICAgXHRkYXRlID0gXCIwXCIrZGF0ZTtcclxuICAgICB9XHJcbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcbiAgICAgaWYgKGhvdXIgPCAxMCl7XHJcbiAgICAgXHRob3VyID0gXCIwXCIraG91cjtcclxuICAgICB9XHJcbiAgICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG4gICAgIGlmIChtaW4gPCAxMCl7XHJcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XHJcbiAgICAgfVxyXG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuICAgICBpZiAoc2VjIDwgMTApe1xyXG4gICAgIFx0c2VjID0gXCIwXCIrc2VjO1xyXG4gICAgIH1cclxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcclxuICAgICByZXR1cm4gdGltZTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcbiAgICBcclxuICAgIHZhciBDU1YgPSAnJzsgICAgXHJcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuICAgIFxyXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuICAgIGlmIChTaG93TGFiZWwpIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXHJcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSAgIFxyXG4gICAgXHJcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcbiAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxyXG4gICAgXHJcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuICAgIFxyXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG4gICAgXHJcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcclxuICAgIGxpbmsuaHJlZiA9IHVyaTtcclxuICAgIFxyXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuICAgIFxyXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
