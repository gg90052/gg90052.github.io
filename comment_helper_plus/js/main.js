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

		var response = {
			status: 'connected',
			authResponse: {
				grantedScopes: 'groups_access_member_info'
			}
		};
		fb.extensionCallback(response, command);
		// FB.login(function(response) {
		// 	fb.extensionCallback(response, command);
		// }, {scope: config.auth ,return_scopes: true});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJoYXNoIiwibG9jYXRpb24iLCJpbmRleE9mIiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInNlc3Npb25TdG9yYWdlIiwiYWxlcnQiLCJocmVmIiwibGFzdERhdGEiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwiZGF0YSIsImZpbmlzaCIsImxvZ2luIiwiZmIiLCJnZW5PcHRpb24iLCJlIiwiZ2V0QXV0aCIsImN0cmxLZXkiLCJhbHRLZXkiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiY29tcGFyZSIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJyYXciLCJkZCIsInRhYiIsIm5vdyIsInN0cmluZ2lmeSIsIm9wZW4iLCJmb2N1cyIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGlrZXMiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJvcmRlciIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJuZXh0IiwidHlwZSIsIkZCIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsImF1dGhfdHlwZSIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJmYmlkIiwiUHJvbWlzZSIsImFsbCIsImdldE1lIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsIm9wdGlvbnMiLCJpIiwiaiIsImlkIiwibmFtZSIsImh0bWwiLCJvcHRpb25EaXNwbGF5IiwiY2hlY2tib3giLCJwcm9wIiwic2VsZWN0UGFnZSIsInRhciIsImF0dHIiLCJzZXRUb2tlbiIsInN0ZXAiLCJzdGVwMSIsInBhZ2VpZCIsInBhZ2VzIiwiYWNjZXNzX3Rva2VuIiwiaGlkZGVuU3RhcnQiLCJwYWdlSUQiLCJzcGxpdCIsImFwaSIsImVycm9yIiwiY2xlYXIiLCJlbXB0eSIsImZpbmQiLCJjb21tYW5kIiwicGFnaW5nIiwic3RyIiwiZ2VuRGF0YSIsIm1lc3NhZ2UiLCJyZWNvbW1hbmQiLCJnZW5DYXJkIiwib2JqIiwiaWRzIiwibGluayIsIm1lc3MiLCJyZXBsYWNlIiwidGltZUNvbnZlcnRlciIsImNyZWF0ZWRfdGltZSIsInNyYyIsImZ1bGxfcGljdHVyZSIsInJlc29sdmUiLCJyZWplY3QiLCJhcnIiLCJpdGVtIiwiYWRtaW5pc3RyYXRvciIsImV4dGVuc2lvbkF1dGgiLCJleHRlbnNpb25DYWxsYmFjayIsInNldEl0ZW0iLCJleHRlbmQiLCJmaWQiLCJwdXNoIiwiZnJvbSIsInByb21pc2VfYXJyYXkiLCJuYW1lcyIsInByb21pc2UiLCJnZXROYW1lIiwiT2JqZWN0Iiwia2V5cyIsInBvc3RkYXRhIiwic3RvcnkiLCJwb3N0bGluayIsImxpa2VfY291bnQiLCJ0aXRsZSIsInRvU3RyaW5nIiwic2Nyb2xsVG9wIiwic3RlcDIiLCJmaWx0ZXJlZCIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInRlc3QiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImZ1bGxJRCIsImNvbW1hbmRzIiwidGVtcF9kYXRhIiwiZ2V0IiwiZGF0YXMiLCJzaGFyZUVycm9yIiwiYXBpX2ZiaWQiLCJnZXRTaGFyZSIsImQiLCJ1cGRhdGVkX3RpbWUiLCJnZXROZXh0IiwiZ2V0SlNPTiIsImZhaWwiLCJhZnRlciIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwia2V5IiwiaXNUYWciLCJuZXdEYXRhIiwidG90YWxGaWx0ZXIiLCJvYmoyQXJyYXkiLCJuZXdPYmoiLCJlYWNoIiwidG1wIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwicGljIiwidGhlYWQiLCJ0Ym9keSIsImVudHJpZXMiLCJwaWN0dXJlIiwidGQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJzZWFyY2giLCJ2YWx1ZSIsImRyYXciLCJhbmQiLCJvciIsImlnbm9yZSIsImJhc2UiLCJmaW5hbCIsImNvbXBhcmVfbnVtIiwic29ydCIsImEiLCJiIiwibWF0Y2giLCJ0ZW1wIiwidGVtcF9uYW1lIiwiZGF0YV9hbmQiLCJkYXRhX29yIiwidGJvZHkyIiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwiY3RybCIsIm4iLCJwYXJzZUludCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwidGVtcEFyciIsImNvbHVtbiIsImluZGV4Iiwicm93Iiwibm9kZSIsImlubmVySFRNTCIsImsiLCJlcSIsImluc2VydEJlZm9yZSIsInRhZyIsInRpbWUiLCJ1bmlxdWUiLCJvdXRwdXQiLCJmb3JFYWNoIiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsIm1vbWVudCIsIkRhdGUiLCJfZCIsInVpIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwibWFwIiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBZUMsU0FBZjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNOLFlBQUwsRUFBa0I7QUFDakJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUMsSUFBRSxpQkFBRixFQUFxQkMsTUFBckI7QUFDQVYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRFMsRUFBRUUsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0IsS0FBSUMsV0FBVyxDQUFmO0FBQ0FKLEdBQUUsUUFBRixFQUFZSyxLQUFaLENBQWtCLFlBQVU7QUFDM0JEO0FBQ0EsTUFBSUEsWUFBWSxDQUFoQixFQUFrQjtBQUNqQkosS0FBRSxRQUFGLEVBQVlNLEdBQVosQ0FBZ0IsT0FBaEI7QUFDQU4sS0FBRSwwQkFBRixFQUE4Qk8sV0FBOUIsQ0FBMEMsTUFBMUM7QUFDQTtBQUNELEVBTkQ7O0FBUUEsS0FBSUMsT0FBT0MsU0FBU0QsSUFBcEI7QUFDQSxLQUFJQSxLQUFLRSxPQUFMLENBQWEsT0FBYixLQUF5QixDQUE3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QUFRbk0sQ0FBUixDQUFsQixFQUE4QjtBQUMxQnNKLFVBQU8sTUFBTTZDLFFBQVFuTSxDQUFSLEVBQVdxSixLQUFYLENBQU4sR0FBMEIsSUFBakM7QUFDSDs7QUFFREMsTUFBSStDLEtBQUosQ0FBVSxDQUFWLEVBQWEvQyxJQUFJcE0sTUFBSixHQUFhLENBQTFCOztBQUVBO0FBQ0FrUCxTQUFPOUMsTUFBTSxNQUFiO0FBQ0g7O0FBRUQsS0FBSThDLE9BQU8sRUFBWCxFQUFlO0FBQ1hsUyxRQUFNLGNBQU47QUFDQTtBQUNIOztBQUVEO0FBQ0EsS0FBSW9TLFdBQVcsRUFBZjtBQUNBO0FBQ0FBLGFBQVlMLFlBQVk3SixPQUFaLENBQW9CLElBQXBCLEVBQXlCLEdBQXpCLENBQVo7O0FBRUE7QUFDQSxLQUFJbUssTUFBTSx1Q0FBdUNDLFVBQVVKLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJbEssT0FBTzVJLFNBQVNtVCxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQXZLLE1BQUsvSCxJQUFMLEdBQVlvUyxHQUFaOztBQUVBO0FBQ0FySyxNQUFLd0ssS0FBTCxHQUFhLG1CQUFiO0FBQ0F4SyxNQUFLeUssUUFBTCxHQUFnQkwsV0FBVyxNQUEzQjs7QUFFQTtBQUNBaFQsVUFBU3NULElBQVQsQ0FBY0MsV0FBZCxDQUEwQjNLLElBQTFCO0FBQ0FBLE1BQUt6SSxLQUFMO0FBQ0FILFVBQVNzVCxJQUFULENBQWNFLFdBQWQsQ0FBMEI1SyxJQUExQjtBQUNIIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKXtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIixcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdGxldCBoaWRlYXJlYSA9IDA7XHJcblx0JCgnaGVhZGVyJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGhpZGVhcmVhKys7XHJcblx0XHRpZiAoaGlkZWFyZWEgPj0gNSl7XHJcblx0XHRcdCQoJ2hlYWRlcicpLm9mZignY2xpY2snKTtcclxuXHRcdFx0JCgnI2ZiaWRfYnV0dG9uLCAjcHVyZV9mYmlkJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJjbGVhclwiKSA+PSAwKXtcclxuXHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdyYXcnKTtcclxuXHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2xvZ2luJyk7XHJcblx0XHRhbGVydCgn5bey5riF6Zmk5pqr5a2Y77yM6KuL6YeN5paw6YCy6KGM55m75YWlJyk7XHJcblx0XHRsb2NhdGlvbi5ocmVmID0gJ2h0dHBzOi8vZ2c5MDA1Mi5naXRodWIuaW8vY29tbWVudF9oZWxwZXJfcGx1cyc7XHJcblx0fVxyXG5cdGxldCBsYXN0RGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyYXdcIikpO1xyXG5cclxuXHRpZiAobGFzdERhdGEpe1xyXG5cdFx0ZGF0YS5maW5pc2gobGFzdERhdGEpO1xyXG5cdH1cclxuXHRpZiAoc2Vzc2lvblN0b3JhZ2UubG9naW4pe1xyXG5cdFx0ZmIuZ2VuT3B0aW9uKEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pKTtcclxuXHR9XHJcblxyXG5cdC8vICQoXCIudGFibGVzID4gLnNoYXJlZHBvc3RzIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHQvLyBcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdC8vIFx0XHRmYi5leHRlbnNpb25BdXRoKCdpbXBvcnQnKTtcclxuXHQvLyBcdH1lbHNle1xyXG5cdC8vIFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfSk7XHJcblx0XHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9zdGFydFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KXtcclxuXHRcdFx0Y2hvb3NlLmluaXQodHJ1ZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLmluaXQoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoIWUuY3RybEtleSB8fCAhZS5hbHRLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6RVhDRUxcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudGFibGVzIC5maWx0ZXJzIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcuY29tcGFyZV9jb25kaXRpb24nKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLicrICQodGhpcykudmFsKCkpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVktTU0tREQgICBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUobm93RGF0ZSgpKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5KXtcclxuXHRcdFx0bGV0IGRkO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKXtcclxuXHRcdFx0XHRkZCA9IEpTT04uc3RyaW5naWZ5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZGQgPSBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhW3RhYi5ub3ddKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgZGQ7XHJcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xyXG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKXtcclxuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChjb21wYXJlWyQoJy5jb21wYXJlX2NvbmRpdGlvbicpLnZhbCgpXSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhW3RhYi5ub3ddKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRjaV9jb3VudGVyKys7XHJcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KXtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYoZS5jdHJsS2V5KXtcclxuXHRcdFx0ZmIuZ2V0QXV0aCgnc2hhcmVkcG9zdHMnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCdtZXNzYWdlX3RhZ3MnLCdtZXNzYWdlJywnZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbJ2NyZWF0ZWRfdGltZScsJ2Zyb20nLCdtZXNzYWdlJywnc3RvcnknXSxcclxuXHRcdGxpa2VzOiBbJ25hbWUnXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjMuMicsXHJcblx0XHRyZWFjdGlvbnM6ICd2My4yJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjMuMicsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2My4yJyxcclxuXHRcdGZlZWQ6ICd2My4yJyxcclxuXHRcdGdyb3VwOiAndjMuMicsXHJcblx0XHRuZXdlc3Q6ICd2My4yJ1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0b3JkZXI6ICcnLFxyXG5cdGF1dGg6ICdtYW5hZ2VfcGFnZXMsZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0bmV4dDogJycsXHJcblx0Z2V0QXV0aDogKHR5cGUpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcsXHJcblx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCl7XHJcblx0XHRcdFx0XHRmYi5zdGFydCgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+aOiOasiuWkseaVl++8jOiri+e1puS6iOaJgOacieasiumZkCcsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRQcm9taXNlLmFsbChbZmIuZ2V0TWUoKSxmYi5nZXRQYWdlKCksIGZiLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XHJcblx0XHRcdHNlc3Npb25TdG9yYWdlLmxvZ2luID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuXHRcdFx0ZmIuZ2VuT3B0aW9uKHJlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbk9wdGlvbjogKHJlcyk9PntcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCBvcHRpb25zID0gYDxpbnB1dCBpZD1cInB1cmVfZmJpZFwiIGNsYXNzPVwiaGlkZVwiPjxidXR0b24gaWQ9XCJmYmlkX2J1dHRvblwiIGNsYXNzPVwiYnRuIGhpZGVcIiBvbmNsaWNrPVwiZmIuaGlkZGVuU3RhcnQoKVwiPueUsUZCSUTmk7flj5Y8L2J1dHRvbj48bGFiZWw+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG9uY2hhbmdlPVwiZmIub3B0aW9uRGlzcGxheSh0aGlzKVwiPumaseiXj+WIl+ihqDwvbGFiZWw+PGJyPmA7XHJcblx0XHRsZXQgdHlwZSA9IC0xO1xyXG5cdFx0JCgnI2J0bl9zdGFydCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcclxuXHRcdFx0dHlwZSsrO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgaSl7XHJcblx0XHRcdFx0b3B0aW9ucyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgYXR0ci10eXBlPVwiJHt0eXBlfVwiIGF0dHItdmFsdWU9XCIke2ouaWR9XCIgb25jbGljaz1cImZiLnNlbGVjdFBhZ2UodGhpcylcIj4ke2oubmFtZX08L2Rpdj5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcjZW50ZXJVUkwnKS5odG1sKG9wdGlvbnMpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0fSxcclxuXHRvcHRpb25EaXNwbGF5OiAoY2hlY2tib3gpPT57XHJcblx0XHRpZiAoJChjaGVja2JveCkucHJvcCgnY2hlY2tlZCcpKXtcclxuXHRcdFx0JCgnLnBhZ2VfYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKCcucGFnZV9idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c2VsZWN0UGFnZTogKGUpPT57XHJcblx0XHQkKCcjZW50ZXJVUkwgLnBhZ2VfYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IHRhciA9ICQoZSk7XHJcblx0XHR0YXIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0aWYgKHRhci5hdHRyKCdhdHRyLXR5cGUnKSA9PSAxKXtcclxuXHRcdFx0ZmIuc2V0VG9rZW4odGFyLmF0dHIoJ2F0dHItdmFsdWUnKSk7XHJcblx0XHR9XHJcblx0XHRmYi5mZWVkKHRhci5hdHRyKCdhdHRyLXZhbHVlJyksIHRhci5hdHRyKCdhdHRyLXR5cGUnKSwgZmIubmV4dCk7XHJcblx0XHQkKCcuZm9yZmInKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnN0ZXAxJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdHN0ZXAuc3RlcDEoKTtcclxuXHR9LFxyXG5cdHNldFRva2VuOiAocGFnZWlkKT0+e1xyXG5cdFx0bGV0IHBhZ2VzID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbilbMV07XHJcblx0XHRmb3IobGV0IGkgb2YgcGFnZXMpe1xyXG5cdFx0XHRpZiAoaS5pZCA9PSBwYWdlaWQpe1xyXG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSBpLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0aGlkZGVuU3RhcnQ6IChlKT0+e1xyXG5cdFx0bGV0IGZiaWQgPSAkKCcjcHVyZV9mYmlkJykudmFsKCk7XHJcblx0XHRsZXQgcGFnZUlEID0gZmJpZC5zcGxpdCgnXycpWzBdO1xyXG5cdFx0RkIuYXBpKGAvJHtwYWdlSUR9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdGlmIChyZXMuZXJyb3Ipe1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKXtcclxuXHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQsICdsaXZlJyk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmZWVkOiAocGFnZUlELCB0eXBlLCB1cmwgPSAnJywgY2xlYXIgPSB0cnVlKT0+e1xyXG5cdFx0aWYgKGNsZWFyKXtcclxuXHRcdFx0JCgnLnJlY29tbWFuZHMsIC5mZWVkcyB0Ym9keScpLmVtcHR5KCk7XHJcblx0XHRcdCQoJy5mZWVkcyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLmZlZWRzIC5idG4nKS5vZmYoJ2NsaWNrJykuY2xpY2soKCk9PntcclxuXHRcdFx0XHRsZXQgdGFyID0gJCgnI2VudGVyVVJMIHNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xyXG5cdFx0XHRcdGZiLmZlZWQodGFyLnZhbCgpLCB0YXIuYXR0cignYXR0ci10eXBlJyksIGZiLm5leHQsIGZhbHNlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRsZXQgY29tbWFuZCA9ICh0eXBlID09ICcyJykgPyAnZmVlZCc6J3Bvc3RzJztcclxuXHRcdGxldCBhcGk7XHJcblx0XHRpZiAodXJsID09ICcnKXtcclxuXHRcdFx0YXBpID0gYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VJRH0vJHtjb21tYW5kfT9maWVsZHM9bGluayxmdWxsX3BpY3R1cmUsY3JlYXRlZF90aW1lLG1lc3NhZ2UmbGltaXQ9MjVgO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFwaSA9IHVybDtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShhcGksIChyZXMpPT57XHJcblx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPT0gMCl7XHJcblx0XHRcdFx0JCgnLmZlZWRzIC5idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZiLm5leHQgPSByZXMucGFnaW5nLm5leHQ7XHJcblx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0bGV0IHN0ciA9IGdlbkRhdGEoaSk7XHJcblx0XHRcdFx0JCgnLnNlY3Rpb24gLmZlZWRzIHRib2R5JykuYXBwZW5kKHN0cik7XHJcblx0XHRcdFx0aWYgKGkubWVzc2FnZSAmJiBpLm1lc3NhZ2UuaW5kZXhPZign5oq9JykgPj0gMCl7XHJcblx0XHRcdFx0XHRsZXQgcmVjb21tYW5kID0gZ2VuQ2FyZChpKTtcclxuXHRcdFx0XHRcdCQoJy5kb25hdGVfYXJlYSAucmVjb21tYW5kcycpLmFwcGVuZChyZWNvbW1hbmQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2VuRGF0YShvYmope1xyXG5cdFx0XHRsZXQgaWRzID0gb2JqLmlkLnNwbGl0KFwiX1wiKTtcclxuXHRcdFx0bGV0IGxpbmsgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycraWRzWzBdKycvcG9zdHMvJytpZHNbMV07XHJcblxyXG5cdFx0XHRsZXQgbWVzcyA9IG9iai5tZXNzYWdlID8gb2JqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRsZXQgc3RyID0gYDx0cj5cclxuXHRcdFx0XHRcdFx0PHRkPjxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiAgb25jbGljaz1cImRhdGEuc3RhcnQoJyR7b2JqLmlkfScpXCI+6ZaL5aeLPC9kaXY+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIob2JqLmNyZWF0ZWRfdGltZSl9PC90ZD5cclxuXHRcdFx0XHRcdFx0PC90cj5gO1xyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZ2VuQ2FyZChvYmope1xyXG5cdFx0XHRsZXQgc3JjID0gb2JqLmZ1bGxfcGljdHVyZSB8fCAnaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4MjI1JztcclxuXHRcdFx0bGV0IGlkcyA9IG9iai5pZC5zcGxpdChcIl9cIik7XHJcblx0XHRcdGxldCBsaW5rID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nK2lkc1swXSsnL3Bvc3RzLycraWRzWzFdO1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IG1lc3MgPSBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0bGV0XHRzdHIgPSBgPGRpdiBjbGFzcz1cImNhcmRcIj5cclxuXHRcdFx0PGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNhcmQtaW1hZ2VcIj5cclxuXHRcdFx0PGZpZ3VyZSBjbGFzcz1cImltYWdlIGlzLTRieTNcIj5cclxuXHRcdFx0PGltZyBzcmM9XCIke3NyY31cIiBhbHQ9XCJcIj5cclxuXHRcdFx0PC9maWd1cmU+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2E+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkLWNvbnRlbnRcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuXHRcdFx0JHttZXNzfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJwaWNrXCIgYXR0ci12YWw9XCIke29iai5pZH1cIiBvbmNsaWNrPVwiZGF0YS5zdGFydCgnJHtvYmouaWR9JylcIj7plovlp4s8L2Rpdj5cclxuXHRcdFx0PC9kaXY+YDtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldE1lOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lYCwgKHJlcyk9PntcclxuXHRcdFx0XHRsZXQgYXJyID0gW3Jlc107XHJcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2ZpZWxkcz1uYW1lLGlkLGFkbWluaXN0cmF0b3ImbGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlIChyZXMuZGF0YS5maWx0ZXIoaXRlbT0+e3JldHVybiBpdGVtLmFkbWluaXN0cmF0b3IgPT09IHRydWV9KSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoY29tbWFuZCA9ICcnKT0+e1xyXG5cdFx0bGV0IHJlc3BvbnNlID0ge1xyXG5cdFx0XHRzdGF0dXM6ICdjb25uZWN0ZWQnLFxyXG5cdFx0XHRhdXRoUmVzcG9uc2U6e1xyXG5cdFx0XHRcdGdyYW50ZWRTY29wZXM6ICdncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJyxcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UsIGNvbW1hbmQpO1xyXG5cdFx0Ly8gRkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdC8vIFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UsIGNvbW1hbmQpO1xyXG5cdFx0Ly8gfSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSwgY29tbWFuZCA9ICcnKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycpID49IDApe1xyXG5cdFx0XHRcdGRhdGEucmF3LmV4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ2ltcG9ydCcpe1xyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaGFyZWRwb3N0c1wiLCAkKCcjaW1wb3J0JykudmFsKCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgZXh0ZW5kID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNoYXJlZHBvc3RzXCIpKTtcclxuXHRcdFx0XHRsZXQgZmlkID0gW107XHJcblx0XHRcdFx0bGV0IGlkcyA9IFtdO1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0ZmlkLnB1c2goaS5mcm9tLmlkKTtcclxuXHRcdFx0XHRcdGlmIChmaWQubGVuZ3RoID49NDUpe1xyXG5cdFx0XHRcdFx0XHRpZHMucHVzaChmaWQpO1xyXG5cdFx0XHRcdFx0XHRmaWQgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWRzLnB1c2goZmlkKTtcclxuXHRcdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdLCBuYW1lcyA9IHt9O1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiBpZHMpe1xyXG5cdFx0XHRcdFx0bGV0IHByb21pc2UgPSBmYi5nZXROYW1lKGkpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIE9iamVjdC5rZXlzKHJlcykpe1xyXG5cdFx0XHRcdFx0XHRcdG5hbWVzW2ldID0gcmVzW2ldO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHBvc3RkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucG9zdGRhdGEpO1xyXG5cdFx0XHRcdGlmIChjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRcdFx0aWYgKHBvc3RkYXRhLnR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdFx0Ly8gRkIuYXBpKFwiL21lXCIsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAocmVzLm5hbWUgPT09IHBvc3RkYXRhLm93bmVyKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aS5tZXNzYWdlID0gaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpLmxpa2VfY291bnQgPSAnTi9BJztcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR0aXRsZTogJ+WAi+S6uuiyvOaWh+WPquacieeZvOaWh+iAheacrOS6uuiDveaKkycsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGh0bWw6IGDosrzmlofluLPomZ/lkI3nqLHvvJoke3Bvc3RkYXRhLm93bmVyfTxicj7nm67liY3luLPomZ/lkI3nqLHvvJoke3Jlcy5uYW1lfWAsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfSk7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGkubGlrZV9jb3VudCA9ICdOL0EnO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9ZWxzZSBpZihwb3N0ZGF0YS50eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0aS5saWtlX2NvdW50ID0gJ04vQSc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRpLmxpa2VfY291bnQgPSAnTi9BJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0aWYgKHBvc3RkYXRhLnR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdFx0Ly8gRkIuYXBpKFwiL21lXCIsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAocmVzLm5hbWUgPT09IHBvc3RkYXRhLm93bmVyKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLmNyZWF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGRlbGV0ZSBpLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGkudHlwZSA9ICdMSUtFJztcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR0aXRsZTogJ+WAi+S6uuiyvOaWh+WPquacieeZvOaWh+iAheacrOS6uuiDveaKkycsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGh0bWw6IGDosrzmlofluLPomZ/lkI3nqLHvvJoke3Bvc3RkYXRhLm93bmVyfTxicj7nm67liY3luLPomZ/lkI3nqLHvvJoke3Jlcy5uYW1lfWAsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfSk7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaSBvZiBleHRlbmQpe1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnN0b3J5O1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmNyZWF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5wb3N0bGluaztcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9ZWxzZSBpZihwb3N0ZGF0YS50eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuc3Rvcnk7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkuY3JlYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLnBvc3RsaW5rO1xyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBpLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGkgb2YgZXh0ZW5kKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5zdG9yeTtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgaS5jcmVhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkucG9zdGxpbms7XHJcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGkubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0UHJvbWlzZS5hbGwocHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIGV4dGVuZCl7XHJcblx0XHRcdFx0XHRcdGkuZnJvbS5uYW1lID0gbmFtZXNbaS5mcm9tLmlkXSA/IG5hbWVzW2kuZnJvbS5pZF0ubmFtZSA6IGkuZnJvbS5uYW1lO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZGF0YS5yYXcuZGF0YVtjb21tYW5kXSA9IGV4dGVuZDtcclxuXHRcdFx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcyk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcbmxldCBzdGVwID0ge1xyXG5cdHN0ZXAxOiAoKT0+e1xyXG5cdFx0JCgnLnNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc3RlcDInKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcclxuXHR9LFxyXG5cdHN0ZXAyOiAoKT0+e1xyXG5cdFx0JCgnLmZvcmZiJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy5yZWNvbW1hbmRzLCAuZmVlZHMgdGJvZHknKS5lbXB0eSgpO1xyXG5cdFx0JCgnLnNlY3Rpb24nKS5hZGRDbGFzcygnc3RlcDInKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnNjcm9sbFRvcCgwKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzoge2RhdGE6e319LFxyXG5cdGZpbHRlcmVkOiB7fSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdHRlc3Q6IChpZCk9PntcclxuXHRcdGNvbnNvbGUubG9nKGlkKTtcclxuXHR9LFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKT0+e1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRmdWxsSUQ6IGZiaWRcclxuXHRcdH1cclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgY29tbWFuZHMgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcclxuXHRcdGxldCB0ZW1wX2RhdGEgPSBvYmo7XHJcblx0XHRmb3IobGV0IGkgb2YgY29tbWFuZHMpe1xyXG5cdFx0XHR0ZW1wX2RhdGEuZGF0YSA9IHt9O1xyXG5cdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KHRlbXBfZGF0YSwgaSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdHRlbXBfZGF0YS5kYXRhW2ldID0gcmVzO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdGRhdGEuZmluaXNoKHRlbXBfZGF0YSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQsIGNvbW1hbmQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBzaGFyZUVycm9yID0gMDtcclxuXHRcdFx0bGV0IGFwaV9mYmlkID0gZmJpZC5mdWxsSUQ7XHJcblx0XHRcdGlmICgkKCcucGFnZV9idG4uYWN0aXZlJykuYXR0cignYXR0ci10eXBlJykgPT0gMil7XHJcblx0XHRcdFx0YXBpX2ZiaWQgPSBmYmlkLmZ1bGxJRC5zcGxpdCgnXycpWzFdO1xyXG5cdFx0XHRcdGlmIChjb21tYW5kID09PSAncmVhY3Rpb25zJykgY29tbWFuZCA9ICdsaWtlcyc7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJykgY29tbWFuZCA9ICdncm91cCc7XHJcblx0XHRcdGlmIChjb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0XHRnZXRTaGFyZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRGQi5hcGkoYCR7YXBpX2ZiaWR9LyR7Y29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbY29tbWFuZF19Jm9yZGVyPWNocm9ub2xvZ2ljYWwmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9YCwocmVzKT0+e1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldFNoYXJlKGFmdGVyPScnKXtcclxuXHRcdFx0XHRsZXQgdXJsID0gYGh0dHBzOi8vYW02NmFoZ3RwOC5leGVjdXRlLWFwaS5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tL3NoYXJlP2ZiaWQ9JHtmYmlkLmZ1bGxJRH0mYWZ0ZXI9JHthZnRlcn1gO1xyXG5cdFx0XHRcdHJlc29sdmUoW10pO1xyXG5cdFx0XHRcdC8vICQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0Ly8gXHRpZiAocmVzID09PSAnZW5kJyl7XHJcblx0XHRcdFx0Ly8gXHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdC8vIFx0fWVsc2V7XHJcblx0XHRcdFx0Ly8gXHRcdGlmIChyZXMuZXJyb3JNZXNzYWdlKXtcclxuXHRcdFx0XHQvLyBcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHQvLyBcdFx0fWVsc2UgaWYocmVzLmRhdGEpe1xyXG5cdFx0XHRcdC8vIFx0XHRcdC8vIHNoYXJlRXJyb3IgPSAwO1xyXG5cdFx0XHRcdC8vIFx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgbmFtZSA9ICcnO1xyXG5cdFx0XHRcdC8vIFx0XHRcdFx0aWYoaS5zdG9yeSl7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHRcdG5hbWUgPSBpLnN0b3J5LnN1YnN0cmluZygwLCBpLnN0b3J5LmluZGV4T2YoJyBzaGFyZWQnKSk7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQvLyBcdFx0XHRcdFx0bmFtZSA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xyXG5cdFx0XHRcdC8vIFx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGlkID0gaS5pZC5zdWJzdHJpbmcoMCwgaS5pZC5pbmRleE9mKFwiX1wiKSk7XHJcblx0XHRcdFx0Ly8gXHRcdFx0XHRpLmZyb20gPSB7aWQsIG5hbWV9O1xyXG5cdFx0XHRcdC8vIFx0XHRcdFx0ZGF0YXMucHVzaChpKTtcclxuXHRcdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdFx0Ly8gXHRcdFx0Z2V0U2hhcmUocmVzLmFmdGVyKTtcclxuXHRcdFx0XHQvLyBcdFx0fWVsc2V7XHJcblx0XHRcdFx0Ly8gXHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHQvLyB9KVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdHN0ZXAuc3RlcDIoKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0JCgnLnJlc3VsdF9hcmVhID4gLnRpdGxlIHNwYW4nKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmF3XCIsIEpTT04uc3RyaW5naWZ5KGZiaWQpKTtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XHJcblx0XHRkYXRhLmZpbHRlcmVkID0ge307XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHJhd0RhdGEuZGF0YSkpe1xyXG5cdFx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdFx0aWYgKGtleSA9PT0gJ3JlYWN0aW9ucycpIGlzVGFnID0gZmFsc2U7XHJcblx0XHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEuZGF0YVtrZXldLCBrZXksIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcdFxyXG5cdFx0XHRkYXRhLmZpbHRlcmVkW2tleV0gPSBuZXdEYXRhO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKXtcclxuXHRcdFx0dGFibGUuZ2VuZXJhdGUoZGF0YS5maWx0ZXJlZCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIGRhdGEuZmlsdGVyZWQ7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdyk9PntcclxuXHRcdHZhciBuZXdPYmogPSBbXTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbil7XHJcblx0XHRcdCQuZWFjaChyYXcsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkLmVhY2gocmF3LGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLlv4Pmg4VcIiA6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCIgOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKT0+e1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9PntcclxuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJlZCA9IHJhd2RhdGE7XHJcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoZmlsdGVyZWQpKXtcclxuXHRcdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0XHRpZihrZXkgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5b+D5oOFPC90ZD5gO1xyXG5cdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmVkW2tleV0uZW50cmllcygpKXtcclxuXHRcdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRcdGlmIChwaWMpe1xyXG5cdFx0XHRcdFx0Ly8gcGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdFx0PHRkPjxhIGhyZWY9J2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgYXR0ci1mYmlkPVwiJHt2YWwuZnJvbS5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdFx0aWYoa2V5ID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0XHR9ZWxzZSBpZihrZXkgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8IHZhbC5zdG9yeX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2V9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHRcdCQoXCIudGFibGVzIC5cIitrZXkrXCIgdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGFjdGl2ZSgpO1xyXG5cdFx0dGFiLmluaXQoKTtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBhcnIgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNvbXBhcmUgPSB7XHJcblx0YW5kOiBbXSxcclxuXHRvcjogW10sXHJcblx0cmF3OiBbXSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0Y29tcGFyZS5hbmQgPSBbXTtcclxuXHRcdGNvbXBhcmUub3IgPSBbXTtcclxuXHRcdGNvbXBhcmUucmF3ID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0bGV0IGlnbm9yZSA9ICQoJy50YWJsZXMgLnRvdGFsIC5maWx0ZXJzIHNlbGVjdCcpLnZhbCgpO1xyXG5cdFx0bGV0IGJhc2UgPSBbXTtcclxuXHRcdGxldCBmaW5hbCA9IFtdO1xyXG5cdFx0bGV0IGNvbXBhcmVfbnVtID0gMTtcclxuXHRcdGlmIChpZ25vcmUgPT09ICdpZ25vcmUnKSBjb21wYXJlX251bSA9IDI7XHJcblxyXG5cdFx0Zm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoY29tcGFyZS5yYXcpKXtcclxuXHRcdFx0aWYgKGtleSAhPT0gaWdub3JlKXtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgY29tcGFyZS5yYXdba2V5XSl7XHJcblx0XHRcdFx0XHRiYXNlLnB1c2goaSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRsZXQgc29ydCA9IChkYXRhLnJhdy5leHRlbnNpb24pID8gJ25hbWUnOidpZCc7XHJcblx0XHRiYXNlID0gYmFzZS5zb3J0KChhLGIpPT57XHJcblx0XHRcdHJldHVybiBhLmZyb21bc29ydF0gPiBiLmZyb21bc29ydF0gPyAxOi0xO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Zm9yKGxldCBpIG9mIGJhc2Upe1xyXG5cdFx0XHRpLm1hdGNoID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0bGV0IHRlbXBfbmFtZSA9ICcnO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coYmFzZSk7XHJcblx0XHRmb3IobGV0IGkgaW4gYmFzZSl7XHJcblx0XHRcdGxldCBvYmogPSBiYXNlW2ldO1xyXG5cdFx0XHRpZiAob2JqLmZyb20uaWQgPT0gdGVtcCB8fCAoZGF0YS5yYXcuZXh0ZW5zaW9uICYmIChvYmouZnJvbS5uYW1lID09IHRlbXBfbmFtZSkpKXtcclxuXHRcdFx0XHRsZXQgdGFyID0gZmluYWxbZmluYWwubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdHRhci5tYXRjaCsrO1xyXG5cdFx0XHRcdGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKG9iaikpe1xyXG5cdFx0XHRcdFx0aWYgKCF0YXJba2V5XSkgdGFyW2tleV0gPSBvYmpba2V5XTsgLy/lkIjkvbXos4fmlplcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRhci5tYXRjaCA9PSBjb21wYXJlX251bSl7XHJcblx0XHRcdFx0XHR0ZW1wX25hbWUgPSAnJztcclxuXHRcdFx0XHRcdHRlbXAgPSAnJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZpbmFsLnB1c2gob2JqKTtcclxuXHRcdFx0XHR0ZW1wID0gb2JqLmZyb20uaWQ7XHJcblx0XHRcdFx0dGVtcF9uYW1lID0gb2JqLmZyb20ubmFtZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdFxyXG5cdFx0Y29tcGFyZS5vciA9IGZpbmFsO1xyXG5cdFx0Y29tcGFyZS5hbmQgPSBjb21wYXJlLm9yLmZpbHRlcigodmFsKT0+e1xyXG5cdFx0XHRyZXR1cm4gdmFsLm1hdGNoID09IGNvbXBhcmVfbnVtO1xyXG5cdFx0fSk7XHJcblx0XHRjb21wYXJlLmdlbmVyYXRlKCk7XHJcblx0fSxcclxuXHRnZW5lcmF0ZTogKCk9PntcclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZGF0YV9hbmQgPSBjb21wYXJlLmFuZDtcclxuXHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZGF0YV9hbmQuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnMCd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5IHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSkgfHwgJyd9PC90ZD5gO1xyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS5hbmQgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHJcblx0XHRsZXQgZGF0YV9vciA9IGNvbXBhcmUub3I7XHJcblx0XHRsZXQgdGJvZHkyID0gJyc7XHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGFfb3IuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlIHx8ICcnfVwiPjwvc3Bhbj4ke3ZhbC50eXBlIHx8ICcnfTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlIHx8ICcnfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudCB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3RvcnkgfHwgJyd9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKSB8fCAnJ308L3RkPmA7XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5MiArPSB0cjtcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS5vciB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkyKTtcclxuXHRcdFxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIC50b3RhbCB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBhcnIgPSBbJ2FuZCcsJ29yJ107XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKGN0cmwgPSBmYWxzZSk9PntcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcclxuXHRcdGNob29zZS5saXN0ID0gW107XHJcblx0XHRjaG9vc2UubnVtID0gMDtcclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKXtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKGN0cmwpO1xyXG5cdH0sXHJcblx0Z286IChjdHJsKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSB0YWIubm93O1xyXG5cdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJyl7XHJcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGFbY29tbWFuZF0ubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcdFxyXG5cdFx0fVxyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0bGV0IHRlbXBBcnIgPSBbXTtcclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKXtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5jb2x1bW4oMikuZGF0YSgpLmVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KXtcclxuXHRcdFx0XHRsZXQgd29yZCA9ICQoJy5zZWFyY2hDb21tZW50JykudmFsKCk7XHJcblx0XHRcdFx0aWYgKHZhbHVlLmluZGV4T2Yod29yZCkgPj0gMCkgdGVtcEFyci5wdXNoKGluZGV4KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcclxuXHRcdFx0bGV0IHJvdyA9ICh0ZW1wQXJyLmxlbmd0aCA9PSAwKSA/IGk6dGVtcEFycltpXTtcclxuXHRcdFx0bGV0IHRhciA9ICQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkucm93KHJvdykubm9kZSgpLmlubmVySFRNTDtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHI+JyArIHRhciArICc8L3RyPic7XHJcblx0XHR9XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0aWYgKCFjdHJsKXtcclxuXHRcdFx0JChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdC8vIGxldCB0YXIgPSAkKHRoaXMpLmZpbmQoJ3RkJykuZXEoMSk7XHJcblx0XHRcdFx0Ly8gbGV0IGlkID0gdGFyLmZpbmQoJ2EnKS5hdHRyKCdhdHRyLWZiaWQnKTtcclxuXHRcdFx0XHQvLyB0YXIucHJlcGVuZChgPGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke2lkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHJcblx0XHRpZihjaG9vc2UuZGV0YWlsKXtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvcihsZXQgayBpbiBjaG9vc2UubGlzdCl7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI3XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXcsIGNvbW1hbmQsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIGVuZFRpbWUpPT57XHJcblx0XHRsZXQgZGF0YSA9IHJhdztcclxuXHRcdGlmICh3b3JkICE9PSAnJyAmJiBjb21tYW5kID09ICdjb21tZW50cycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50YWcoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgZW5kVGltZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9LFxyXG5cdHVuaXF1ZTogKGRhdGEpPT57XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCB0KT0+e1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XHJcblx0XHRpZiAodGFyID09ICdhbGwnKXtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCk9PntcclxuXHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFiID0ge1xyXG5cdG5vdzogXCJjb21tZW50c1wiLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKCcjY29tbWVudF90YWJsZSAudGFicyAudGFiJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnI2NvbW1lbnRfdGFibGUgLnRhYnMgLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdHRhYi5ub3cgPSAkKHRoaXMpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0XHRsZXQgdGFyID0gJCh0aGlzKS5pbmRleCgpO1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHQkKCcudGFibGVzID4gZGl2JykuZXEodGFyKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdGlmICh0YWIubm93ID09PSAnY29tcGFyZScpe1xyXG5cdFx0XHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpe1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xyXG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcclxuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgIGlmIChkYXRlIDwgMTApe1xyXG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XHJcbiAgICAgfVxyXG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgIGlmIChob3VyIDwgMTApe1xyXG4gICAgIFx0aG91ciA9IFwiMFwiK2hvdXI7XHJcbiAgICAgfVxyXG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgICBpZiAobWluIDwgMTApe1xyXG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xyXG4gICAgIH1cclxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgaWYgKHNlYyA8IDEwKXtcclxuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcclxuICAgICB9XHJcbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XHJcbiAgICAgcmV0dXJuIHRpbWU7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
