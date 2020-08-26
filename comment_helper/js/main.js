'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
var fberror = '';
window.onerror = handleErr;
var TABLE;
var lastCommand = 'comments';
var addLink = false;
var auth_scope = '';

function handleErr(msg, url, l) {
	if (!errorMessage) {
		var _url = $('#enterURL .url').val();
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		console.log("Error occur URL： " + _url);
		$(".console .error").append('<br><br>' + fberror + '<br><br>' + _url);
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}
$(document).ready(function () {
	var hash = location.search;
	if (hash.indexOf("extension") >= 0) {
		$(".loading.checkAuth").removeClass("hide");
		data.extension = true;

		$(".loading.checkAuth button").click(function (e) {
			fb.extensionAuth();
		});
	}
	if (hash.indexOf("ranker") >= 0) {
		var datas = {
			command: 'ranker',
			data: JSON.parse(localStorage.ranker)
		};
		data.raw = datas;
		data.finish(data.raw);
	}

	$("#btn_page_selector").click(function (e) {
		fb.getAuth('page_selector');
	});
	$("#btn_login").click(function (e) {
		fb.getAuth('page_selector');
	});

	$("#btn_comments").click(function (e) {
		console.log(e);
		if (e.ctrlKey || e.altKey) {
			config.order = 'chronological';
		}
		fb.getAuth('comments');
	});

	$("#btn_like").click(function (e) {
		if (e.ctrlKey || e.altKey) {
			config.likes = true;
		}
		fb.getAuth('reactions');
	});
	$("#btn_url").click(function () {
		fb.getAuth('url_comments');
	});
	$("#btn_pay").click(function () {
		fb.getAuth('addScope');
	});
	$("#btn_choose").click(function () {
		choose.init();
	});
	$("#morepost").click(function () {
		ui.addLink();
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
		$(".prizeDetail").append('<div class="prize"><div class="input_group">\u54C1\u540D\uFF1A<input type="text"></div><div class="input_group">\u62BD\u734E\u4EBA\u6578\uFF1A<input type="number"></div></div>');
	});

	$(window).keydown(function (e) {
		if (e.ctrlKey || e.altKey) {
			$("#btn_excel").text("輸出JSON");
		}
	});
	$(window).keyup(function (e) {
		if (!e.ctrlKey || e.altKey) {
			$("#btn_excel").text("複製表格內容");
		}
	});

	$("#unique, #tag").on('change', function () {
		table.redo();
	});

	$(".uipanel .react").change(function () {
		config.filter.react = $(this).val();
		table.redo();
	});

	$('.rangeDate').daterangepicker({
		"timePicker": true,
		"timePicker24Hour": true,
		"locale": {
			"format": "YYYY/MM/DD HH:mm",
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
		config.filter.startTime = start.format('YYYY-MM-DD-HH-mm-ss');
		config.filter.endTime = end.format('YYYY-MM-DD-HH-mm-ss');
		table.redo();
	});
	$('.rangeDate').data('daterangepicker').setStartDate(config.filter.startTime);

	$("#btn_excel").click(function (e) {
		var filterData = data.filter(data.raw);
		if (e.ctrlKey || e.altKey) {
			exportToJsonFile(filterData);
		} else {
			// if (filterData.length > 7000) {
			// 	$(".bigExcel").removeClass("hide");
			// } else {
			// 	JSONToCSVConvertor(data.excel(filterData), "Comment_helper", true);
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
		if (e.ctrlKey || e.altKey) {}
	});
	$("#inputJSON").change(function () {
		$(".waiting").removeClass("hide");
		$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
		config.from_extension = true;
		data.import(this.files[0]);
	});
});

function exportToJsonFile(jsonData) {
	var dataStr = JSON.stringify(jsonData);
	var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

	var exportFileDefaultName = 'data.json';

	var linkElement = document.createElement('a');
	linkElement.setAttribute('href', dataUri);
	linkElement.setAttribute('download', exportFileDefaultName);
	linkElement.click();
}

function shareBTN() {
	alert('認真看完跳出來的那頁上面寫了什麼\n\n看完你就會知道你為什麼不能抓分享');
}

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
		comments: '15',
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
		startTime: '2000-12-31-00-00-00',
		endTime: nowDate()
	},
	order: 'chronological',
	auth: 'groups_show_list, pages_show_list, pages_read_engagement, pages_read_user_content',
	likes: false,
	pageToken: '',
	userToken: '',
	from_extension: false
};

var fb = {
	user_posts: false,
	getAuth: function getAuth() {
		var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		if (type === '') {
			addLink = true;
			type = lastCommand;
		} else {
			addLink = false;
			lastCommand = type;
		}
		FB.login(function (response) {
			fb.callback(response, type);
		}, {
			auth_type: 'rerequest',
			scope: config.auth,
			return_scopes: true
		});
	},
	callback: function callback(response, type) {
		// console.log(response);
		if (response.status === 'connected') {
			config.userToken = response.authResponse.accessToken;
			auth_scope = response.authResponse.grantedScopes;
			config.from_extension = false;
			if (type == "addScope") {
				// if (auth_scope.includes('groups_access_member_info')){
				// 	swal(
				// 		'付費授權完成，請再次執行抓留言',
				// 		'Authorization Finished! Please getComments again.',
				// 		'success'
				// 	).done();
				// }else{
				// 	swal(
				// 		'付費授權檢查錯誤，該功能需付費',
				// 		'Authorization Failed! It is a paid feature.',
				// 		'error'
				// 	).done();
				// }
				FB.api('/me?fields=id,name', function (res) {
					var obj = {
						token: -1,
						username: res.name,
						app_scope_id: res.id
					};
					$.post('https://script.google.com/macros/s/AKfycbxaGXkaOzT2ADCC8r-A4qBMg69Wz_168AHEr0fZ/exec', obj, function (res) {
						alert(res.message);
						if (res.code == 1) {
							// location.href = "index.html";
						}
					});
				});
			} else if (type == "page_selector") {
				page_selector.show();
			} else {
				fb.user_posts = true;
				fbid.init(type);
			}
		} else {
			FB.login(function (response) {
				fb.callback(response);
			}, {
				scope: config.auth,
				return_scopes: true
			});
		}
	},
	extensionAuth: function extensionAuth() {
		fb.authOK();
		config.from_extension = true;
		// FB.login(function (response) {
		// 	fb.extensionCallback(response);
		// }, {
		// 	scope: config.auth,
		// 	return_scopes: true
		// });
	},
	extensionCallback: function extensionCallback(response) {
		if (response.status === 'connected') {
			config.from_extension = true;
			auth_scope = response.authResponse.grantedScopes;
			FB.api('/me?fields=id,name', function (res) {
				$.get('https://script.google.com/macros/s/AKfycbxaGXkaOzT2ADCC8r-A4qBMg69Wz_168AHEr0fZ/exec?id=' + res.id, function (res2) {
					if (res2 === 'true') {
						fb.authOK();
					} else {
						swal({
							title: '抓分享需付費，詳情請見粉絲專頁',
							html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a><br>userID：' + res.id,
							type: 'warning'
						}).done();
					}
				});
			});
		} else {
			FB.login(function (response) {
				fb.extensionCallback(response);
			}, {
				scope: config.auth,
				return_scopes: true
			});
		}
	},
	authOK: function authOK() {
		$(".loading.checkAuth").addClass("hide");
		var postdata = JSON.parse(localStorage.postdata);
		var datas = {
			command: postdata.command,
			data: JSON.parse($(".chrome").val())
		};
		data.raw = datas;
		data.finish(data.raw);
	}
};

var data = {
	raw: [],
	userid: '',
	nowLength: 0,
	extension: false,
	init: function init() {
		$(".main_table").DataTable().destroy();
		$("#awardList").hide();
		$(".console .message").text('截取資料中...');
		data.nowLength = 0;
		if (!addLink) {
			data.raw = [];
		}
	},
	start: function start(fbid) {
		$(".waiting").removeClass("hide");
		$('.pure_fbid').text(fbid.fullID);
		data.get(fbid).then(function (res) {
			// fbid.data = res;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = res[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var i = _step.value;

					fbid.data.push(i);
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

			data.finish(fbid);
		});
	},
	get: function get(fbid) {
		return new Promise(function (resolve, reject) {
			var datas = [];
			var promise_array = [];
			var command = fbid.command;
			if (fbid.type === 'group') {
				fbid.fullID = fbid.pureID;
				command = 'group';
			}
			if (fbid.type === 'group' && fbid.command == 'reactions') {
				fbid.fullID = fbid.pureID;
				fbid.command = 'likes';
			}
			if (config.likes) fbid.command = 'likes';
			console.log(config.apiVersion[command] + '/' + fbid.fullID + '/' + fbid.command + '?limit=' + config.limit[fbid.command] + '&fields=' + config.field[fbid.command].toString() + '&debug=all');
			var token = config.pageToken == '' ? '&access_token=' + config.userToken : '&access_token=' + config.pageToken;

			FB.api(config.apiVersion[command] + '/' + fbid.fullID + '/' + fbid.command + '?limit=' + config.limit[fbid.command] + '&order=' + config.order + '&fields=' + config.field[fbid.command].toString() + token + '&debug=all', function (res) {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = res.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var d = _step2.value;

						if (fbid.command == 'reactions' || fbid.command == 'likes' || config.likes) {
							d.from = {
								id: d.id,
								name: d.name
							};
						}
						if (config.likes) d.type = "LIKE";
						if (d.from) {
							datas.push(d);
						} else {
							//event
							d.from = {
								id: d.id,
								name: d.id
							};
							if (d.updated_time) {
								d.created_time = d.updated_time;
							}
							datas.push(d);
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
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = res.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var d = _step3.value;

							if (d.id) {
								if (fbid.command == 'reactions' || fbid.command == 'likes' || config.likes) {
									d.from = {
										id: d.id,
										name: d.name
									};
								}
								if (d.from) {
									datas.push(d);
								} else {
									//event
									d.from = {
										id: d.id,
										name: d.id
									};
									if (d.updated_time) {
										d.created_time = d.updated_time;
									}
									datas.push(d);
								}
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

					if (res.data.length > 0 && res.paging.next) {
						// if (data.nowLength < 180) {
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
		$(".update_area,.donate_area").slideUp();
		$(".result_area").slideDown();
		// if (data.raw.type == 'group'){
		// 	if (auth_scope.includes('groups_access_member_info')){
		// 		swal('完成！', 'Done!', 'success').done();
		// 		data.raw = fbid;
		// 		data.filter(data.raw, true);
		// 		ui.reset();
		// 	}else{
		// 		swal(
		// 			'付費授權檢查錯誤，抓社團貼文需付費',
		// 			'Authorization Failed! It is a paid feature.',
		// 			'error'
		// 		).done();
		// 	}
		// }else{
		// 	swal('完成！', 'Done!', 'success').done();
		// 	data.raw = fbid;
		// 	data.filter(data.raw, true);
		// 	ui.reset();
		// }
		swal('完成！', 'Done!', 'success').done();
		data.raw = fbid;
		data.filter(data.raw, true);
		ui.reset();
	},
	filter: function filter(rawData) {
		var generate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var isDuplicate = $("#unique").prop("checked");
		var isTag = $("#tag").prop("checked");
		// if (config.from_extension === false && rawData.command === 'comments') {
		// 	rawData.data = rawData.data.filter(item => {
		// 		return item.is_hidden === false
		// 	});
		// }
		var newData = _filter.totalFilter.apply(_filter, [rawData, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
		rawData.filtered = newData;
		if (generate === true) {
			table.generate(rawData);
		} else {
			return rawData;
		}
	},
	excel: function excel(raw) {
		var newObj = [];
		console.log(raw);
		if (data.extension) {
			if (raw.command == 'comments') {
				$.each(raw.filtered, function (i) {
					var tmp = {
						"序號": i + 1,
						"臉書連結": 'https://www.facebook.com/' + this.from.id,
						"姓名": this.from.name,
						"留言連結": 'https://www.facebook.com/' + this.postlink,
						"留言內容": this.message
					};
					newObj.push(tmp);
				});
			} else {
				$.each(raw.filtered, function (i) {
					var tmp = {
						"序號": i + 1,
						"臉書連結": 'https://www.facebook.com/' + this.from.id,
						"姓名": this.from.name,
						"分享連結": this.postlink,
						"留言內容": this.story
					};
					newObj.push(tmp);
				});
			}
		} else {
			$.each(raw.filtered, function (i) {
				var tmp = {
					"序號": i + 1,
					"臉書連結": 'https://www.facebook.com/' + this.from.id,
					"姓名": this.from.name,
					"表情": this.type || '',
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
		$(".main_table").DataTable().destroy();
		var filterdata = rawdata.filtered;
		var thead = '';
		var tbody = '';
		var pic = $("#picture").prop("checked");
		if (rawdata.command == 'reactions' || rawdata.command == 'likes' || config.likes) {
			thead = '<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u8868\u60C5</td>';
		} else if (rawdata.command === 'sharedposts') {
			thead = '<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td class="force-break">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td width="110">\u7559\u8A00\u6642\u9593</td>';
		} else if (rawdata.command === 'ranker') {
			thead = '<td>\u6392\u540D</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u5206\u6578</td>';
		} else {
			thead = '<td>\u5E8F\u865F</td>\n\t\t\t<td width="200">\u540D\u5B57</td>\n\t\t\t<td class="force-break">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td>\u8B9A</td>\n\t\t\t<td class="nowrap">\u7559\u8A00\u6642\u9593</td>';
		}

		var host = 'https://www.facebook.com/';
		if (data.raw.type === 'url_comments') host = $('#enterURL .url').val() + '?fb_comment_id=';

		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = filterdata.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var _step4$value = _slicedToArray(_step4.value, 2),
				    j = _step4$value[0],
				    val = _step4$value[1];

				var picture = '';
				if (pic) {
					picture = '<img src="https://graph.facebook.com/' + val.from.id + '/picture?type=small"><br>';
				}
				var td = '<td>' + (j + 1) + '</td>\n\t\t\t<td><a href=\'https://www.facebook.com/' + val.from.id + '\' target="_blank">' + picture + val.from.name + '</a></td>';
				if (rawdata.command == 'reactions' || rawdata.command == 'likes' || config.likes) {
					td += '<td class="center"><span class="react ' + val.type + '"></span>' + val.type + '</td>';
				} else if (rawdata.command === 'sharedposts') {
					td += '<td class="force-break"><a href="https://www.facebook.com/' + val.id + '" target="_blank">' + val.story + '</a></td>\n\t\t\t\t<td class="nowrap">' + timeConverter(val.created_time) + '</td>';
				} else if (rawdata.command === 'ranker') {
					td = '<td>' + (j + 1) + '</td>\n\t\t\t\t\t  <td><a href=\'https://www.facebook.com/' + val.from.id + '\' target="_blank">' + val.from.name + '</a></td>\n\t\t\t\t\t  <td>' + val.score + '</td>';
				} else {
					var postlink = host + val.id;
					if (config.from_extension) {
						postlink = val.postlink;
					}
					td += '<td class="force-break"><a href="' + postlink + '" target="_blank">' + val.message + '</a></td>\n\t\t\t\t<td>' + val.like_count + '</td>\n\t\t\t\t<td class="nowrap">' + timeConverter(val.created_time) + '</td>';
				}
				var tr = '<tr>' + td + '</tr>';
				tbody += tr;
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

		var insert = '<thead><tr align="center">' + thead + '</tr></thead><tbody>' + tbody + '</tbody>';
		$(".main_table").html('').append(insert);

		active();

		function active() {
			TABLE = $(".main_table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});

			$("#searchName").on('blur change keyup', function () {
				TABLE.columns(1).search(this.value).draw();
			});
			$("#searchComment").on('blur change keyup', function () {
				TABLE.columns(2).search(this.value).draw();
				config.filter.word = this.value;
			});
		}
	},
	redo: function redo() {
		data.filter(data.raw, true);
	}
};

var choose = {
	data: [],
	award: [],
	num: 0,
	detail: false,
	list: [],
	init: function init() {
		var thead = $('.main_table thead').html();
		$('#awardList table thead').html(thead);
		$('#awardList table tbody').html('');
		choose.data = data.filter(data.raw);
		choose.award = [];
		choose.list = [];
		choose.num = 0;
		if ($("#searchComment").val() != '') {
			table.redo();
		}
		if ($("#moreprize").hasClass("active")) {
			choose.detail = true;
			$(".prizeDetail .prize").each(function () {
				var n = parseInt($(this).find("input[type='number']").val());
				var p = $(this).find("input[type='text']").val();
				if (n > 0) {
					choose.num += parseInt(n);
					choose.list.push({
						"name": p,
						"num": n
					});
				}
			});
		} else {
			choose.num = $("#howmany").val();
		}
		choose.go();
	},
	go: function go() {
		choose.award = genRandomArray(choose.data.filtered.length).splice(0, choose.num);
		var insert = '';
		choose.award.map(function (val, index) {
			insert += '<tr title="第' + (index + 1) + '名">' + $('.main_table').DataTable().rows({
				search: 'applied'
			}).nodes()[val].innerHTML + '</tr>';
		});
		$('#awardList table tbody').html(insert);
		$('#awardList table tbody tr').addClass('success');

		if (choose.detail) {
			var now = 0;
			for (var k in choose.list) {
				var tar = $("#awardList tbody tr").eq(now);
				$('<tr><td class="prizeName" colspan="5">\u734E\u54C1\uFF1A ' + choose.list[k].name + ' <span>\u5171 ' + choose.list[k].num + ' \u540D</span></td></tr>').insertBefore(tar);
				now += choose.list[k].num + 1;
			}
			$("#moreprize").removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		}
		$("#awardList").fadeIn(1000);
	},
	gen_big_award: function gen_big_award() {
		var li = '';
		var awards = [];
		$('#awardList tbody tr').each(function (index, val) {
			var award = {};
			if (val.hasAttribute('title')) {
				award.award_name = false;
				award.name = $(val).find('td').eq(1).find('a').text();
				award.userid = $(val).find('td').eq(1).find('a').attr('href').replace('https://www.facebook.com/', '');
				award.message = $(val).find('td').eq(2).find('a').text();
				award.link = $(val).find('td').eq(2).find('a').attr('href');
				award.time = $(val).find('td').eq($(val).find('td').length - 1).text();
			} else {
				award.award_name = true;
				award.name = $(val).find('td').text();
			}
			awards.push(award);
		});
		var _iteratorNormalCompletion5 = true;
		var _didIteratorError5 = false;
		var _iteratorError5 = undefined;

		try {
			for (var _iterator5 = awards[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
				var i = _step5.value;

				if (i.award_name === true) {
					li += '<li class="prizeName">' + i.name + '</li>';
				} else {
					li += '<li>\n\t\t\t\t<a href="https://www.facebook.com/' + i.userid + '" target="_blank"><img src="https://graph.facebook.com/' + i.userid + '/picture?type=large&access_token=' + config.pageToken + '" alt=""></a>\n\t\t\t\t<div class="info">\n\t\t\t\t<p class="name"><a href="https://www.facebook.com/' + i.userid + '" target="_blank">' + i.name + '</a></p>\n\t\t\t\t<p class="message"><a href="' + i.link + '" target="_blank">' + i.message + '</a></p>\n\t\t\t\t<p class="time"><a href="' + i.link + '" target="_blank">' + i.time + '</a></p>\n\t\t\t\t</div>\n\t\t\t\t</li>';
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

		$('.big_award ul').append(li);
		$('.big_award').addClass('show');
	},
	close_big_award: function close_big_award() {
		$('.big_award').removeClass('show');
		$('.big_award ul').empty();
	}
};

var fbid = {
	fbid: [],
	init: function init(type) {
		fbid.fbid = [];
		data.init();
		FB.api("/me", function (res) {
			data.userid = res.id;
			var url = '';
			if (addLink) {
				url = fbid.format($('.morelink .addurl').val());
				$('.morelink .addurl').val('');
			} else {
				url = fbid.format($('#enterURL .url').val());
			}
			if (url.indexOf('.php?') === -1 && url.indexOf('?') > 0) {
				url = url.substring(0, url.indexOf('?'));
			}
			fbid.get(url, type).then(function (fbid) {
				data.start(fbid);
			});
			// $('.identity').removeClass('hide').html(`登入身份：<img src="https://graph.facebook.com/${res.id}/picture?type=small"><span>${res.name}</span>`);
		});
	},
	get: function get(url, type) {
		return new Promise(function (resolve, reject) {
			var regex = /\d{4,}/g;
			var newurl = url.substr(url.indexOf('/', 28) + 1, 200);
			// https://www.facebook.com/ 共25字元，因此選28開始找/
			var result = newurl.match(regex);
			var urltype = fbid.checkType(url);
			fbid.checkPageID(url, urltype).then(function (id) {
				if (id === 'personal') {
					urltype = 'personal';
					id = data.userid;
				}
				var obj = {
					pageID: id,
					type: urltype,
					command: type,
					data: []
				};
				if (addLink) obj.data = data.raw.data; //追加貼文
				if (urltype === 'personal') {
					var start = url.indexOf('fbid=');
					if (start >= 0) {
						var end = url.indexOf("&", start);
						obj.pureID = url.substring(start + 5, end);
					} else {
						var _start = url.indexOf('posts/');
						obj.pureID = url.substring(_start + 6, url.length);
					}
					var video = url.indexOf('videos/');
					if (video >= 0) {
						obj.pureID = result[0];
					}
					obj.fullID = obj.pageID + '_' + obj.pureID;
					resolve(obj);
				} else if (urltype === 'pure') {
					obj.fullID = url.replace(/\"/g, '');
					resolve(obj);
				} else {
					if (urltype === 'group') {

						obj.pureID = result[result.length - 1];
						obj.pageID = result[0];
						obj.fullID = obj.pageID + "_" + obj.pureID;
						resolve(obj);
					} else if (urltype === 'photo') {
						var _regex = /\d{4,}/g;
						var _result = url.match(_regex);
						obj.pureID = _result[_result.length - 1];
						obj.fullID = obj.pageID + '_' + obj.pureID;
						resolve(obj);
					} else if (urltype === 'video') {
						obj.pureID = result[result.length - 1];
						FB.api('/' + obj.pureID + '?fields=live_status', function (res) {
							if (res.live_status === 'LIVE') {
								obj.fullID = obj.pureID;
							} else {
								obj.fullID = obj.pageID + '_' + obj.pureID;
							}
							resolve(obj);
						});
					} else {
						if (result.length == 1 || result.length == 3) {
							obj.pureID = result[0];
							obj.fullID = obj.pageID + '_' + obj.pureID;
							resolve(obj);
						} else {
							if (urltype === 'unname') {
								obj.pureID = result[0];
								obj.pageID = result[result.length - 1];
							} else {
								obj.pureID = result[result.length - 1];
							}
							obj.fullID = obj.pageID + '_' + obj.pureID;
							FB.api('/' + obj.pageID + '?fields=access_token', function (res) {
								if (res.error) {
									resolve(obj);
								} else {
									if (res.access_token) {
										config.pageToken = res.access_token;
									}
									resolve(obj);
								}
							});
						}
					}
				}
			});
		});
	},
	checkType: function checkType(posturl) {
		if (posturl.indexOf("fbid=") >= 0) {
			if (posturl.indexOf('permalink') >= 0) {
				return 'unname';
			} else {
				return 'personal';
			}
		};
		if (posturl.indexOf("/groups/") >= 0) {
			return 'group';
		};
		if (posturl.indexOf("events") >= 0) {
			return 'event';
		};
		if (posturl.indexOf("/photos/") >= 0) {
			return 'photo';
		};
		if (posturl.indexOf("/videos/") >= 0) {
			return 'video';
		}
		if (posturl.indexOf('"') >= 0) {
			return 'pure';
		};
		return 'normal';
	},
	checkPageID: function checkPageID(posturl, type) {
		return new Promise(function (resolve, reject) {
			var start = posturl.indexOf("facebook.com") + 13;
			var end = posturl.indexOf("/", start);
			var regex = /\d{4,}/g;
			if (end < 0) {
				if (posturl.indexOf('fbid=') >= 0) {
					if (type === 'unname') {
						resolve('unname');
					} else {
						resolve('personal');
					}
				} else {
					resolve(posturl.match(regex)[1]);
				}
			} else {
				var group = posturl.indexOf('/groups/');
				var event = posturl.indexOf('/events/');
				if (group >= 0) {
					start = group + 8;
					end = posturl.indexOf("/", start);
					var regex2 = /\d{6,}/g;
					var temp = posturl.substring(start, end);
					if (regex2.test(temp)) {
						resolve(temp);
					} else {
						resolve('group');
					}
				} else if (event >= 0) {
					resolve('event');
				} else {
					var pagename = posturl.substring(start, end);
					FB.api('/' + pagename + '?fields=access_token', function (res) {
						if (res.error) {
							fberror = res.error.message;
							resolve('personal');
						} else {
							if (res.access_token) {
								config.pageToken = res.access_token;
							}
							resolve(res.id);
						}
					});
				}
			}
		});
	},
	format: function format(url) {
		if (url.indexOf('business.facebook.com/') >= 0) {
			url = url.substring(0, url.indexOf("?"));
			return url;
		} else {
			return url;
		}
	}
};

var _filter = {
	totalFilter: function totalFilter(rawdata, isDuplicate, isTag, word, react, startTime, endTime) {
		var data = rawdata.data;
		if (word !== '') {
			data = _filter.word(data, word);
		}
		if (isTag) {
			data = _filter.tag(data);
		}
		if (rawdata.command == 'reactions' || rawdata.command == 'likes' || config.likes) {
			data = _filter.react(data, react);
		} else if (rawdata.command === 'ranker') {} else {
			data = _filter.time(data, startTime, endTime);
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
			if (n.message === undefined) {
				if (n.story.indexOf(_word) > -1) {
					return true;
				}
			} else {
				if (n.message.indexOf(_word) > -1) {
					return true;
				}
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
	time: function time(data, st, t) {
		var time_ary2 = st.split("-");
		var time_ary = t.split("-");
		var endtime = moment(new Date(time_ary[0], parseInt(time_ary[1]) - 1, time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;
		var starttime = moment(new Date(time_ary2[0], parseInt(time_ary2[1]) - 1, time_ary2[2], time_ary2[3], time_ary2[4], time_ary2[5]))._d;
		var newAry = $.grep(data, function (n, i) {
			var created_time = moment(n.created_time)._d;
			if (created_time > starttime && created_time < endtime || n.created_time == "") {
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
	init: function init() {},
	addLink: function addLink() {
		var tar = $('.inputarea .morelink');
		if (tar.hasClass('show')) {
			tar.removeClass('show');
		} else {
			tar.addClass('show');
		}
	},
	reset: function reset() {
		var command = data.raw.command;
		if (command == 'reactions' || command == 'likes' || config.likes) {
			$('.limitTime, #searchComment').addClass('hide');
			$('.uipanel .react').removeClass('hide');
		} else {
			$('.limitTime, #searchComment').removeClass('hide');
			$('.uipanel .react').addClass('hide');
		}
		if (command === 'comments') {
			$('label.tag').removeClass('hide');
		} else {
			if ($("#tag").prop("checked")) {
				$("#tag").click();
			}
			$('label.tag').addClass('hide');
		}
	}
};
var page_selector = {
	pages: [],
	groups: [],
	show: function show() {
		$('.page_selector').removeClass('hide');
		page_selector.getAdmin();
	},
	getAdmin: function getAdmin() {
		Promise.all([page_selector.getPage(), page_selector.getGroup()]).then(function (res) {
			page_selector.genAdmin(res);
		});
	},
	getPage: function getPage() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + '/me/accounts?limit=100', function (res) {
				resolve(res.data);
			});
		});
	},
	getGroup: function getGroup() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + '/me/groups?fields=name,id,administrator&limit=100', function (res) {
				resolve(res.data.filter(function (item) {
					return item.administrator === true;
				}));
			});
		});
	},
	genAdmin: function genAdmin(res) {
		var pages = '';
		var groups = '';
		var _iteratorNormalCompletion6 = true;
		var _didIteratorError6 = false;
		var _iteratorError6 = undefined;

		try {
			for (var _iterator6 = res[0][Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
				var i = _step6.value;

				pages += '<div class="page_btn" data-type="1" data-value="' + i.id + '" onclick="page_selector.selectPage(this)">' + i.name + '</div>';
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

		var _iteratorNormalCompletion7 = true;
		var _didIteratorError7 = false;
		var _iteratorError7 = undefined;

		try {
			for (var _iterator7 = res[1][Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
				var _i = _step7.value;

				groups += '<div class="page_btn" data-type="2" data-value="' + _i.id + '" onclick="page_selector.selectPage(this)">' + _i.name + '</div>';
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

		$('.select_page').html(pages);
		$('.select_group').html(groups);
	},
	selectPage: function selectPage(target) {
		var page_id = $(target).data('value');
		$('#post_table tbody').html('');
		$('.fb_loading').removeClass('hide');
		FB.api('/' + page_id + '?fields=access_token', function (res) {
			if (res.access_token) {
				config.pageToken = res.access_token;
			} else {
				config.pageToken = '';
			}
		});
		FB.api(config.apiVersion.newest + '/' + page_id + '/live_videos?fields=status,permalink_url,title,creation_time', function (res) {
			var thead = '';
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = res.data[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var tr = _step8.value;

					if (tr.status === 'LIVE') {
						thead += '<tr><td><button type="button" onclick="page_selector.selectPost(\'' + tr.id + '\')">\u9078\u64C7\u8CBC\u6587</button>(LIVE)</td><td><a href="https://www.facebook.com' + tr.permalink_url + '" target="_blank">' + tr.title + '</a></td><td>' + timeConverter(tr.created_time) + '</td></tr>';
					} else {
						thead += '<tr><td><button type="button" onclick="page_selector.selectPost(\'' + tr.id + '\')">\u9078\u64C7\u8CBC\u6587</button></td><td><a href="https://www.facebook.com' + tr.permalink_url + '" target="_blank">' + tr.title + '</a></td><td>' + timeConverter(tr.created_time) + '</td></tr>';
					}
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

			$('#post_table thead').html(thead);
		});
		FB.api(config.apiVersion.newest + '/' + page_id + '/feed?limit=100', function (res) {
			$('.fb_loading').addClass('hide');
			var tbody = '';
			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = res.data[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var tr = _step9.value;

					tbody += '<tr><td><button type="button" onclick="page_selector.selectPost(\'' + tr.id + '\')">\u9078\u64C7\u8CBC\u6587</button></td><td><a href="https://www.facebook.com/' + tr.id + '" target="_blank">' + tr.message + '</a></td><td>' + timeConverter(tr.created_time) + '</td></tr>';
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

			$('#post_table tbody').html(tbody);
		});
	},
	selectPost: function selectPost(fbid) {
		$('.page_selector').addClass('hide');
		$('.select_page').html('');
		$('.select_group').html('');
		$('#post_table tbody').html('');
		var id = '"' + fbid + '"';
		$('#enterURL .url').val(id);
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
	var arrData = (typeof JSONData === 'undefined' ? 'undefined' : _typeof(JSONData)) != 'object' ? JSON.parse(JSONData) : JSONData;

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
	var uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(CSV);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwiZmJlcnJvciIsIndpbmRvdyIsIm9uZXJyb3IiLCJoYW5kbGVFcnIiLCJUQUJMRSIsImxhc3RDb21tYW5kIiwiYWRkTGluayIsImF1dGhfc2NvcGUiLCJtc2ciLCJ1cmwiLCJsIiwiJCIsInZhbCIsImNvbnNvbGUiLCJsb2ciLCJhcHBlbmQiLCJmYWRlSW4iLCJkb2N1bWVudCIsInJlYWR5IiwiaGFzaCIsImxvY2F0aW9uIiwic2VhcmNoIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwiZGF0YSIsImV4dGVuc2lvbiIsImNsaWNrIiwiZSIsImZiIiwiZXh0ZW5zaW9uQXV0aCIsImRhdGFzIiwiY29tbWFuZCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsInJhbmtlciIsInJhdyIsImZpbmlzaCIsImdldEF1dGgiLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJsaWtlcyIsImNob29zZSIsImluaXQiLCJ1aSIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJmaWx0ZXIiLCJyZWFjdCIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJzdGFydFRpbWUiLCJmb3JtYXQiLCJlbmRUaW1lIiwic2V0U3RhcnREYXRlIiwiZmlsdGVyRGF0YSIsImV4cG9ydFRvSnNvbkZpbGUiLCJleGNlbFN0cmluZyIsImV4Y2VsIiwic3RyaW5naWZ5IiwiY2lfY291bnRlciIsImZyb21fZXh0ZW5zaW9uIiwiaW1wb3J0IiwiZmlsZXMiLCJqc29uRGF0YSIsImRhdGFTdHIiLCJkYXRhVXJpIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiZXhwb3J0RmlsZURlZmF1bHROYW1lIiwibGlua0VsZW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwic2hhcmVCVE4iLCJhbGVydCIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJub3dEYXRlIiwiYXV0aCIsInBhZ2VUb2tlbiIsInVzZXJUb2tlbiIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJhdXRoX3R5cGUiLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJhY2Nlc3NUb2tlbiIsImdyYW50ZWRTY29wZXMiLCJhcGkiLCJyZXMiLCJvYmoiLCJ0b2tlbiIsInVzZXJuYW1lIiwibmFtZSIsImFwcF9zY29wZV9pZCIsImlkIiwicG9zdCIsIm1lc3NhZ2UiLCJjb2RlIiwicGFnZV9zZWxlY3RvciIsInNob3ciLCJmYmlkIiwiYXV0aE9LIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJnZXQiLCJyZXMyIiwic3dhbCIsInRpdGxlIiwiaHRtbCIsImRvbmUiLCJwb3N0ZGF0YSIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwidGhlbiIsImkiLCJwdXNoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwcm9taXNlX2FycmF5IiwicHVyZUlEIiwidG9TdHJpbmciLCJsZW5ndGgiLCJkIiwiZnJvbSIsInVwZGF0ZWRfdGltZSIsImNyZWF0ZWRfdGltZSIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsInJlc2V0IiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJwcm9wIiwiaXNUYWciLCJuZXdEYXRhIiwidG90YWxGaWx0ZXIiLCJvYmoyQXJyYXkiLCJmaWx0ZXJlZCIsIm5ld09iaiIsImVhY2giLCJ0bXAiLCJwb3N0bGluayIsInN0b3J5IiwidGltZUNvbnZlcnRlciIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJzdHIiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsImZpbHRlcmRhdGEiLCJ0aGVhZCIsInRib2R5IiwicGljIiwiaG9zdCIsImVudHJpZXMiLCJqIiwicGljdHVyZSIsInRkIiwic2NvcmUiLCJsaWtlX2NvdW50IiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwibiIsInBhcnNlSW50IiwiZmluZCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwibWFwIiwiaW5kZXgiLCJyb3dzIiwibm9kZXMiLCJpbm5lckhUTUwiLCJub3ciLCJrIiwidGFyIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJnZW5fYmlnX2F3YXJkIiwibGkiLCJhd2FyZHMiLCJoYXNBdHRyaWJ1dGUiLCJhd2FyZF9uYW1lIiwiYXR0ciIsImxpbmsiLCJ0aW1lIiwiY2xvc2VfYmlnX2F3YXJkIiwiZW1wdHkiLCJzdWJzdHJpbmciLCJyZWdleCIsIm5ld3VybCIsInN1YnN0ciIsIm1hdGNoIiwidXJsdHlwZSIsImNoZWNrVHlwZSIsImNoZWNrUGFnZUlEIiwicGFnZUlEIiwidmlkZW8iLCJsaXZlX3N0YXR1cyIsImVycm9yIiwiYWNjZXNzX3Rva2VuIiwicG9zdHVybCIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJ0YWciLCJ1bmlxdWUiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJuZXdBcnkiLCJncmVwIiwidW5kZWZpbmVkIiwibWVzc2FnZV90YWdzIiwic3QiLCJ0IiwidGltZV9hcnkyIiwic3BsaXQiLCJ0aW1lX2FyeSIsImVuZHRpbWUiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJzdGFydHRpbWUiLCJwYWdlcyIsImdyb3VwcyIsImdldEFkbWluIiwiYWxsIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwiZ2VuQWRtaW4iLCJhZG1pbmlzdHJhdG9yIiwic2VsZWN0UGFnZSIsInBhZ2VfaWQiLCJwZXJtYWxpbmtfdXJsIiwic2VsZWN0UG9zdCIsImEiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQSxJQUFJQyxVQUFVLEVBQWQ7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQkMsU0FBakI7QUFDQSxJQUFJQyxLQUFKO0FBQ0EsSUFBSUMsY0FBYyxVQUFsQjtBQUNBLElBQUlDLFVBQVUsS0FBZDtBQUNBLElBQUlDLGFBQWEsRUFBakI7O0FBRUEsU0FBU0osU0FBVCxDQUFtQkssR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxDQUE3QixFQUFnQztBQUMvQixLQUFJLENBQUNYLFlBQUwsRUFBbUI7QUFDbEIsTUFBSVUsT0FBTUUsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBVjtBQUNBQyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBaUQsNEJBQWpEO0FBQ0FELFVBQVFDLEdBQVIsQ0FBWSxzQkFBc0JMLElBQWxDO0FBQ0FFLElBQUUs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SyxRQUFRcEssTUFBNUIsRUFBb0NSLEdBQXBDLEVBQXlDO0FBQ3hDLE1BQUk4SyxNQUFNLEVBQVY7O0FBRUE7QUFDQSxPQUFLLElBQUlsRyxLQUFULElBQWtCZ0csUUFBUTVLLENBQVIsQ0FBbEIsRUFBOEI7QUFDN0I4SyxVQUFPLE1BQU1GLFFBQVE1SyxDQUFSLEVBQVc0RSxLQUFYLENBQU4sR0FBMEIsSUFBakM7QUFDQTs7QUFFRGtHLE1BQUlDLEtBQUosQ0FBVSxDQUFWLEVBQWFELElBQUl0SyxNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQXFLLFNBQU9DLE1BQU0sTUFBYjtBQUNBOztBQUVELEtBQUlELE9BQU8sRUFBWCxFQUFlO0FBQ2R4TyxRQUFNLGNBQU47QUFDQTtBQUNBOztBQUVEO0FBQ0EsS0FBSTJPLFdBQVcsRUFBZjtBQUNBO0FBQ0FBLGFBQVlOLFlBQVkxSixPQUFaLENBQW9CLElBQXBCLEVBQTBCLEdBQTFCLENBQVo7O0FBRUE7QUFDQSxLQUFJaUssTUFBTSx1Q0FBdUNDLFVBQVVMLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJbEYsT0FBT3pOLFNBQVNnRSxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQXlKLE1BQUt3RixJQUFMLEdBQVlGLEdBQVo7O0FBRUE7QUFDQXRGLE1BQUt5RixLQUFMLEdBQWEsbUJBQWI7QUFDQXpGLE1BQUswRixRQUFMLEdBQWdCTCxXQUFXLE1BQTNCOztBQUVBO0FBQ0E5UyxVQUFTb1QsSUFBVCxDQUFjQyxXQUFkLENBQTBCNUYsSUFBMUI7QUFDQUEsTUFBS2hOLEtBQUw7QUFDQVQsVUFBU29ULElBQVQsQ0FBY0UsV0FBZCxDQUEwQjdGLElBQTFCO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxudmFyIGZiZXJyb3IgPSAnJztcclxud2luZG93Lm9uZXJyb3IgPSBoYW5kbGVFcnI7XHJcbnZhciBUQUJMRTtcclxudmFyIGxhc3RDb21tYW5kID0gJ2NvbW1lbnRzJztcclxudmFyIGFkZExpbmsgPSBmYWxzZTtcclxudmFyIGF1dGhfc2NvcGUgPSAnJztcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csIHVybCwgbCkge1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKSB7XHJcblx0XHRsZXQgdXJsID0gJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIiwgXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXIgVVJM77yaIFwiICsgdXJsKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuYXBwZW5kKGA8YnI+PGJyPiR7ZmJlcnJvcn08YnI+PGJyPiR7dXJsfWApO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5zZWFyY2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImV4dGVuc2lvblwiKSA+PSAwKSB7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGRhdGEuZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0aWYgKGhhc2guaW5kZXhPZihcInJhbmtlclwiKSA+PSAwKSB7XHJcblx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdGNvbW1hbmQ6ICdyYW5rZXInLFxyXG5cdFx0XHRkYXRhOiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5yYW5rZXIpXHJcblx0XHR9XHJcblx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdH1cclxuXHJcblx0JChcIiNidG5fcGFnZV9zZWxlY3RvclwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgncGFnZV9zZWxlY3RvcicpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2xvZ2luXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRmYi5nZXRBdXRoKCdwYWdlX3NlbGVjdG9yJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLm9yZGVyID0gJ2Nocm9ub2xvZ2ljYWwnO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fbGlrZVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRjb25maWcubGlrZXMgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZ2V0QXV0aCgncmVhY3Rpb25zJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fdXJsXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGZiLmdldEF1dGgoJ3VybF9jb21tZW50cycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3BheVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdH0pO1xyXG5cdCQoXCIjbW9yZXBvc3RcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0dWkuYWRkTGluaygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIuikh+ijveihqOagvOWFp+WuuVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi51aXBhbmVsIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZL01NL0REIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFx0XCLml6VcIixcclxuXHRcdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFx0XCLkuIlcIixcclxuXHRcdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFx0XCLlha1cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xyXG5cdFx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XHRcIuS4ieaciFwiLFxyXG5cdFx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XHRcIuWFreaciFwiLFxyXG5cdFx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XHRcIuS5neaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XHRcIuWNgeS6jOaciFwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwiZmlyc3REYXlcIjogMVxyXG5cdFx0fSxcclxuXHR9LCBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIuc3RhcnRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBlbmQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShjb25maWcuZmlsdGVyLnN0YXJ0VGltZSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGV4cG9ydFRvSnNvbkZpbGUoZmlsdGVyRGF0YSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKSB7XHJcblx0XHRcdC8vIFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdC8vIFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdC8vIH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSkge1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBleHBvcnRUb0pzb25GaWxlKGpzb25EYXRhKSB7XHJcbiAgICBsZXQgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KGpzb25EYXRhKTtcclxuICAgIGxldCBkYXRhVXJpID0gJ2RhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04LCcrIGVuY29kZVVSSUNvbXBvbmVudChkYXRhU3RyKTtcclxuICAgIFxyXG4gICAgbGV0IGV4cG9ydEZpbGVEZWZhdWx0TmFtZSA9ICdkYXRhLmpzb24nO1xyXG4gICAgXHJcbiAgICBsZXQgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBkYXRhVXJpKTtcclxuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBleHBvcnRGaWxlRGVmYXVsdE5hbWUpO1xyXG4gICAgbGlua0VsZW1lbnQuY2xpY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2hhcmVCVE4oKSB7XHJcblx0YWxlcnQoJ+iqjeecn+eci+WujOi3s+WHuuS+hueahOmCo+mggeS4iumdouWvq+S6huS7gOm6vFxcblxcbueci+WujOS9oOWwseacg+efpemBk+S9oOeCuuS7gOm6vOS4jeiDveaKk+WIhuS6qycpO1xyXG59XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywgJ21lc3NhZ2VfdGFncycsICdtZXNzYWdlJywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCAnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbJ2NyZWF0ZWRfdGltZScsICdmcm9tJywgJ21lc3NhZ2UnLCAnc3RvcnknXSxcclxuXHRcdGxpa2VzOiBbJ25hbWUnXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnMTUnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJyxcclxuXHRcdGxpa2VzOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Ny4wJyxcclxuXHRcdHJlYWN0aW9uczogJ3Y3LjAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Ny4wJyxcclxuXHRcdHVybF9jb21tZW50czogJ3Y3LjAnLFxyXG5cdFx0ZmVlZDogJ3Y3LjAnLFxyXG5cdFx0Z3JvdXA6ICd2Ny4wJyxcclxuXHRcdG5ld2VzdDogJ3Y3LjAnXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0c3RhcnRUaW1lOiAnMjAwMC0xMi0zMS0wMC0wMC0wMCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnY2hyb25vbG9naWNhbCcsXHJcblx0YXV0aDogJ2dyb3Vwc19zaG93X2xpc3QsIHBhZ2VzX3Nob3dfbGlzdCwgcGFnZXNfcmVhZF9lbmdhZ2VtZW50LCBwYWdlc19yZWFkX3VzZXJfY29udGVudCcsXHJcblx0bGlrZXM6IGZhbHNlLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcblx0dXNlclRva2VuOiAnJyxcclxuXHRmcm9tX2V4dGVuc2lvbjogZmFsc2UsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHR1c2VyX3Bvc3RzOiBmYWxzZSxcclxuXHRnZXRBdXRoOiAodHlwZSA9ICcnKSA9PiB7XHJcblx0XHRpZiAodHlwZSA9PT0gJycpIHtcclxuXHRcdFx0YWRkTGluayA9IHRydWU7XHJcblx0XHRcdHR5cGUgPSBsYXN0Q29tbWFuZDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFkZExpbmsgPSBmYWxzZTtcclxuXHRcdFx0bGFzdENvbW1hbmQgPSB0eXBlO1xyXG5cdFx0fVxyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdH0sIHtcclxuXHRcdFx0YXV0aF90eXBlOiAncmVyZXF1ZXN0JyAsXHJcblx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKSA9PiB7XHJcblx0XHQvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRjb25maWcudXNlclRva2VuID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmFjY2Vzc1Rva2VuO1xyXG5cdFx0XHRhdXRoX3Njb3BlID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpIHtcclxuXHRcdFx0XHQvLyBpZiAoYXV0aF9zY29wZS5pbmNsdWRlcygnZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycpKXtcclxuXHRcdFx0XHQvLyBcdHN3YWwoXHJcblx0XHRcdFx0Ly8gXHRcdCfku5josrvmjojmrIrlrozmiJDvvIzoq4vlho3mrKHln7fooYzmipPnlZnoqIAnLFxyXG5cdFx0XHRcdC8vIFx0XHQnQXV0aG9yaXphdGlvbiBGaW5pc2hlZCEgUGxlYXNlIGdldENvbW1lbnRzIGFnYWluLicsXHJcblx0XHRcdFx0Ly8gXHRcdCdzdWNjZXNzJ1xyXG5cdFx0XHRcdC8vIFx0KS5kb25lKCk7XHJcblx0XHRcdFx0Ly8gfWVsc2V7XHJcblx0XHRcdFx0Ly8gXHRzd2FsKFxyXG5cdFx0XHRcdC8vIFx0XHQn5LuY6LK75o6I5qyK5qqi5p+l6Yyv6Kqk77yM6Kmy5Yqf6IO96ZyA5LuY6LK7JyxcclxuXHRcdFx0XHQvLyBcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBJdCBpcyBhIHBhaWQgZmVhdHVyZS4nLFxyXG5cdFx0XHRcdC8vIFx0XHQnZXJyb3InXHJcblx0XHRcdFx0Ly8gXHQpLmRvbmUoKTtcclxuXHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0RkIuYXBpKGAvbWU/ZmllbGRzPWlkLG5hbWVgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0XHR0b2tlbjogLTEsXHJcblx0XHRcdFx0XHRcdHVzZXJuYW1lOiByZXMubmFtZSxcclxuXHRcdFx0XHRcdFx0YXBwX3Njb3BlX2lkOiByZXMuaWRcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCQucG9zdCgnaHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4YUdYa2FPelQyQURDQzhyLUE0cUJNZzY5V3pfMTY4QUhFcjBmWi9leGVjJywgb2JqLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0XHRhbGVydChyZXMubWVzc2FnZSk7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuY29kZSA9PSAxKXtcclxuXHRcdFx0XHRcdFx0XHQvLyBsb2NhdGlvbi5ocmVmID0gXCJpbmRleC5odG1sXCI7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT0gXCJwYWdlX3NlbGVjdG9yXCIpIHtcdFxyXG5cdFx0XHRcdHBhZ2Vfc2VsZWN0b3Iuc2hvdygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKSA9PiB7XHJcblx0XHRmYi5hdXRoT0soKTtcclxuXHRcdGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9IHRydWU7XHJcblx0XHQvLyBGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdC8vIFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0Ly8gfSwge1xyXG5cdFx0Ly8gXHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHQvLyBcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdC8vIH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRGQi5hcGkoYC9tZT9maWVsZHM9aWQsbmFtZWAsIChyZXMpID0+IHtcclxuXHRcdFx0XHQkLmdldCgnaHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4YUdYa2FPelQyQURDQzhyLUE0cUJNZzY5V3pfMTY4QUhFcjBmWi9leGVjP2lkPScrcmVzLmlkLCBmdW5jdGlvbihyZXMyKXtcclxuXHRcdFx0XHRcdGlmIChyZXMyID09PSAndHJ1ZScpe1xyXG5cdFx0XHRcdFx0XHRmYi5hdXRoT0soKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRcdFx0aHRtbDogJzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+PGJyPnVzZXJJRO+8micrcmVzLmlkLFxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRhdXRoT0s6ICgpID0+IHtcclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0bGV0IHBvc3RkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucG9zdGRhdGEpO1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiBwb3N0ZGF0YS5jb21tYW5kLFxyXG5cdFx0XHRkYXRhOiBKU09OLnBhcnNlKCQoXCIuY2hyb21lXCIpLnZhbCgpKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzogW10sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluizh+aWmeS4rS4uLicpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0aWYgKCFhZGRMaW5rKSB7XHJcblx0XHRcdGRhdGEucmF3ID0gW107XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKGZiaWQpID0+IHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKCcucHVyZV9mYmlkJykudGV4dChmYmlkLmZ1bGxJRCk7XHJcblx0XHRkYXRhLmdldChmYmlkKS50aGVuKChyZXMpID0+IHtcclxuXHRcdFx0Ly8gZmJpZC5kYXRhID0gcmVzO1xyXG5cdFx0XHRmb3IgKGxldCBpIG9mIHJlcykge1xyXG5cdFx0XHRcdGZiaWQuZGF0YS5wdXNoKGkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEuZmluaXNoKGZiaWQpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IGNvbW1hbmQgPSBmYmlkLmNvbW1hbmQ7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpe1xyXG5cdFx0XHRcdGZiaWQuZnVsbElEID0gZmJpZC5wdXJlSUQ7XHJcblx0XHRcdFx0Y29tbWFuZCA9ICdncm91cCc7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJyAmJiBmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpIHtcclxuXHRcdFx0XHRmYmlkLmZ1bGxJRCA9IGZiaWQucHVyZUlEO1xyXG5cdFx0XHRcdGZiaWQuY29tbWFuZCA9ICdsaWtlcyc7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGNvbmZpZy5saWtlcykgZmJpZC5jb21tYW5kID0gJ2xpa2VzJztcclxuXHRcdFx0Y29uc29sZS5sb2coYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZmaWVsZHM9JHtjb25maWcuZmllbGRbZmJpZC5jb21tYW5kXS50b1N0cmluZygpfSZkZWJ1Zz1hbGxgKTtcclxuXHRcdFx0bGV0IHRva2VuID0gY29uZmlnLnBhZ2VUb2tlbiA9PSAnJyA/IGAmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnVzZXJUb2tlbn1gOmAmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn1gO1xyXG5cclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mb3JkZXI9JHtjb25maWcub3JkZXJ9JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JHt0b2tlbn0mZGVidWc9YWxsYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdGZvciAobGV0IGQgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdGlmICgoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGZiaWQuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IGQubmFtZVxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKGNvbmZpZy5saWtlcykgZC50eXBlID0gXCJMSUtFXCI7XHJcblx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSkge1xyXG5cdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQgPSAwKSB7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKSB7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywgJ2xpbWl0PScgKyBsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkLmlkKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgZmJpZC5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHQvLyBpZiAoZGF0YS5ub3dMZW5ndGggPCAxODApIHtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKSA9PiB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIudXBkYXRlX2FyZWEsLmRvbmF0ZV9hcmVhXCIpLnNsaWRlVXAoKTtcclxuXHRcdCQoXCIucmVzdWx0X2FyZWFcIikuc2xpZGVEb3duKCk7XHJcblx0XHQvLyBpZiAoZGF0YS5yYXcudHlwZSA9PSAnZ3JvdXAnKXtcclxuXHRcdC8vIFx0aWYgKGF1dGhfc2NvcGUuaW5jbHVkZXMoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSl7XHJcblx0XHQvLyBcdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHQvLyBcdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0Ly8gXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdC8vIFx0XHR1aS5yZXNldCgpO1xyXG5cdFx0Ly8gXHR9ZWxzZXtcclxuXHRcdC8vIFx0XHRzd2FsKFxyXG5cdFx0Ly8gXHRcdFx0J+S7mOiyu+aOiOasiuaqouafpemMr+iqpO+8jOaKk+ekvuWcmOiyvOaWh+mcgOS7mOiyuycsXHJcblx0XHQvLyBcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIEl0IGlzIGEgcGFpZCBmZWF0dXJlLicsXHJcblx0XHQvLyBcdFx0XHQnZXJyb3InXHJcblx0XHQvLyBcdFx0KS5kb25lKCk7XHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIH1lbHNle1xyXG5cdFx0Ly8gXHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdC8vIFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0Ly8gXHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0XHQvLyBcdHVpLnJlc2V0KCk7XHJcblx0XHQvLyB9XHJcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdHVpLnJlc2V0KCk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKSA9PiB7XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Ly8gaWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9PT0gZmFsc2UgJiYgcmF3RGF0YS5jb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHQvLyBcdHJhd0RhdGEuZGF0YSA9IHJhd0RhdGEuZGF0YS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHQvLyBcdFx0cmV0dXJuIGl0ZW0uaXNfaGlkZGVuID09PSBmYWxzZVxyXG5cdFx0Ly8gXHR9KTtcclxuXHRcdC8vIH1cclxuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKSB7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdykgPT4ge1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0Y29uc29sZS5sb2cocmF3KTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbikge1xyXG5cdFx0XHRpZiAocmF3LmNvbW1hbmQgPT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCI6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLooajmg4VcIjogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKSA9PiB7XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSkgPT4ge1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJkYXRhID0gcmF3ZGF0YS5maWx0ZXJlZDtcclxuXHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0aWYgKChyYXdkYXRhLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgcmF3ZGF0YS5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7ooajmg4U8L3RkPmA7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMTEwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7mjpLlkI08L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuWIhuaVuDwvdGQ+YDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGhvc3QgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyc7XHJcblx0XHRpZiAoZGF0YS5yYXcudHlwZSA9PT0gJ3VybF9jb21tZW50cycpIGhvc3QgPSAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpICsgJz9mYl9jb21tZW50X2lkPSc7XHJcblxyXG5cdFx0Zm9yIChsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpIHtcclxuXHRcdFx0bGV0IHBpY3R1cmUgPSAnJztcclxuXHRcdFx0aWYgKHBpYykge1xyXG5cdFx0XHRcdHBpY3R1cmUgPSBgPGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0aWYgKChyYXdkYXRhLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgcmF3ZGF0YS5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3Rvcnl9PC9hPjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblx0XHRcdFx0dGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdFx0XHQgIDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPiR7dmFsLnNjb3JlfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgcG9zdGxpbmsgPSBob3N0ICsgdmFsLmlkO1xyXG5cdFx0XHRcdGlmIChjb25maWcuZnJvbV9leHRlbnNpb24pIHtcclxuXHRcdFx0XHRcdHBvc3RsaW5rID0gdmFsLnBvc3RsaW5rO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiJHtwb3N0bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCkge1xyXG5cdFx0XHRUQUJMRSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2VhcmNoQ29tbWVudFwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEFCTEVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCkgPT4ge1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjc2VhcmNoQ29tbWVudFwiKS52YWwoKSAhPSAnJykge1xyXG5cdFx0XHR0YWJsZS5yZWRvKCk7XHJcblx0XHR9XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCkge1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcIm5hbWVcIjogcCxcclxuXHRcdFx0XHRcdFx0XCJudW1cIjogblxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oKTtcclxuXHR9LFxyXG5cdGdvOiAoKSA9PiB7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YS5maWx0ZXJlZC5sZW5ndGgpLnNwbGljZSgwLCBjaG9vc2UubnVtKTtcclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGNob29zZS5hd2FyZC5tYXAoKHZhbCwgaW5kZXgpID0+IHtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHIgdGl0bGU9XCLnrKwnICsgKGluZGV4ICsgMSkgKyAn5ZCNXCI+JyArICQoJy5tYWluX3RhYmxlJykuRGF0YVRhYmxlKCkucm93cyh7XHJcblx0XHRcdFx0c2VhcmNoOiAnYXBwbGllZCdcclxuXHRcdFx0fSkubm9kZXMoKVt2YWxdLmlubmVySFRNTCArICc8L3RyPic7XHJcblx0XHR9KVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmIChjaG9vc2UuZGV0YWlsKSB7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IgKGxldCBrIGluIGNob29zZS5saXN0KSB7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI1XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9LFxyXG5cdGdlbl9iaWdfYXdhcmQ6ICgpID0+IHtcclxuXHRcdGxldCBsaSA9ICcnO1xyXG5cdFx0bGV0IGF3YXJkcyA9IFtdO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0Ym9keSB0cicpLmVhY2goZnVuY3Rpb24gKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0bGV0IGF3YXJkID0ge307XHJcblx0XHRcdGlmICh2YWwuaGFzQXR0cmlidXRlKCd0aXRsZScpKSB7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgxKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLnVzZXJpZCA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJykucmVwbGFjZSgnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycsICcnKTtcclxuXHRcdFx0XHRhd2FyZC5tZXNzYWdlID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC5saW5rID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0XHRhd2FyZC50aW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoJCh2YWwpLmZpbmQoJ3RkJykubGVuZ3RoIC0gMSkudGV4dCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSB0cnVlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS50ZXh0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXdhcmRzLnB1c2goYXdhcmQpO1xyXG5cdFx0fSk7XHJcblx0XHRmb3IgKGxldCBpIG9mIGF3YXJkcykge1xyXG5cdFx0XHRpZiAoaS5hd2FyZF9uYW1lID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bGkgKz0gYDxsaSBjbGFzcz1cInByaXplTmFtZVwiPiR7aS5uYW1lfTwvbGk+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpPlxyXG5cdFx0XHRcdDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aS51c2VyaWR9L3BpY3R1cmU/dHlwZT1sYXJnZSZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufVwiIGFsdD1cIlwiPjwvYT5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5mb1wiPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibmFtZVwiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubmFtZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubWVzc2FnZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwidGltZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kudGltZX08L2E+PC9wPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvbGk+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmFwcGVuZChsaSk7XHJcblx0XHQkKCcuYmlnX2F3YXJkJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHR9LFxyXG5cdGNsb3NlX2JpZ19hd2FyZDogKCkgPT4ge1xyXG5cdFx0JCgnLmJpZ19hd2FyZCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuZW1wdHkoKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmYmlkID0ge1xyXG5cdGZiaWQ6IFtdLFxyXG5cdGluaXQ6ICh0eXBlKSA9PiB7XHJcblx0XHRmYmlkLmZiaWQgPSBbXTtcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0RkIuYXBpKFwiL21lXCIsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0ZGF0YS51c2VyaWQgPSByZXMuaWQ7XHJcblx0XHRcdGxldCB1cmwgPSAnJztcclxuXHRcdFx0aWYgKGFkZExpbmspIHtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgpKTtcclxuXHRcdFx0XHQkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgnJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dXJsID0gZmJpZC5mb3JtYXQoJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHVybC5pbmRleE9mKCcucGhwPycpID09PSAtMSAmJiB1cmwuaW5kZXhPZignPycpID4gMCkge1xyXG5cdFx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoJz8nKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZmJpZC5nZXQodXJsLCB0eXBlKS50aGVuKChmYmlkKSA9PiB7XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Ly8gJCgnLmlkZW50aXR5JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKGDnmbvlhaXouqvku73vvJo8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cmVzLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48c3Bhbj4ke3Jlcy5uYW1lfTwvc3Bhbj5gKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAodXJsLCB0eXBlKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRsZXQgbmV3dXJsID0gdXJsLnN1YnN0cih1cmwuaW5kZXhPZignLycsIDI4KSArIDEsIDIwMCk7XHJcblx0XHRcdC8vIGh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8g5YWxMjXlrZflhYPvvIzlm6DmraTpgbgyOOmWi+Wni+aJvi9cclxuXHRcdFx0bGV0IHJlc3VsdCA9IG5ld3VybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdGxldCB1cmx0eXBlID0gZmJpZC5jaGVja1R5cGUodXJsKTtcclxuXHRcdFx0ZmJpZC5jaGVja1BhZ2VJRCh1cmwsIHVybHR5cGUpLnRoZW4oKGlkKSA9PiB7XHJcblx0XHRcdFx0aWYgKGlkID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHR1cmx0eXBlID0gJ3BlcnNvbmFsJztcclxuXHRcdFx0XHRcdGlkID0gZGF0YS51c2VyaWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0XHRwYWdlSUQ6IGlkLFxyXG5cdFx0XHRcdFx0dHlwZTogdXJsdHlwZSxcclxuXHRcdFx0XHRcdGNvbW1hbmQ6IHR5cGUsXHJcblx0XHRcdFx0XHRkYXRhOiBbXVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKGFkZExpbmspIG9iai5kYXRhID0gZGF0YS5yYXcuZGF0YTsgLy/ov73liqDosrzmlodcclxuXHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ2ZiaWQ9Jyk7XHJcblx0XHRcdFx0XHRpZiAoc3RhcnQgPj0gMCkge1xyXG5cdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsIHN0YXJ0KTtcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQgKyA1LCBlbmQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCArIDYsIHVybC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGV0IHZpZGVvID0gdXJsLmluZGV4T2YoJ3ZpZGVvcy8nKTtcclxuXHRcdFx0XHRcdGlmICh2aWRlbyA+PSAwKSB7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAncHVyZScpIHtcclxuXHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCAnJyk7XHJcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyBcIl9cIiArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdwaG90bycpIHtcclxuXHRcdFx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRcdFx0bGV0IHJlc3VsdCA9IHVybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3ZpZGVvJykge1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0RkIuYXBpKGAvJHtvYmoucHVyZUlEfT9maWVsZHM9bGl2ZV9zdGF0dXNgLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlcy5saXZlX3N0YXR1cyA9PT0gJ0xJVkUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSB8fCByZXN1bHQubGVuZ3RoID09IDMpIHtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICd1bm5hbWUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0RkIuYXBpKGAvJHtvYmoucGFnZUlEfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoZWNrVHlwZTogKHBvc3R1cmwpID0+IHtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJmYmlkPVwiKSA+PSAwKSB7XHJcblx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ3Blcm1hbGluaycpID49IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3VubmFtZSc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuICdwZXJzb25hbCc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL2dyb3Vwcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ2dyb3VwJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdldmVudCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9waG90b3MvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdwaG90byc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi92aWRlb3MvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICd2aWRlbyc7XHJcblx0XHR9XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdwdXJlJztcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJ25vcm1hbCc7XHJcblx0fSxcclxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBzdGFydCA9IHBvc3R1cmwuaW5kZXhPZihcImZhY2Vib29rLmNvbVwiKSArIDEzO1xyXG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLCBzdGFydCk7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGlmIChlbmQgPCAwKSB7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignZmJpZD0nKSA+PSAwKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3VubmFtZScpIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgndW5uYW1lJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IGdyb3VwID0gcG9zdHVybC5pbmRleE9mKCcvZ3JvdXBzLycpO1xyXG5cdFx0XHRcdGxldCBldmVudCA9IHBvc3R1cmwuaW5kZXhPZignL2V2ZW50cy8nKVxyXG5cdFx0XHRcdGlmIChncm91cCA+PSAwKSB7XHJcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwICsgODtcclxuXHRcdFx0XHRcdGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIiwgc3RhcnQpO1xyXG5cdFx0XHRcdFx0bGV0IHJlZ2V4MiA9IC9cXGR7Nix9L2c7XHJcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xyXG5cdFx0XHRcdFx0aWYgKHJlZ2V4Mi50ZXN0KHRlbXApKSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUodGVtcCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdncm91cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZXZlbnQgPj0gMCkge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSgnZXZlbnQnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XHJcblx0XHRcdFx0XHRGQi5hcGkoYC8ke3BhZ2VuYW1lfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0ZmJlcnJvciA9IHJlcy5lcnJvci5tZXNzYWdlO1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmb3JtYXQ6ICh1cmwpID0+IHtcclxuXHRcdGlmICh1cmwuaW5kZXhPZignYnVzaW5lc3MuZmFjZWJvb2suY29tLycpID49IDApIHtcclxuXHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXdkYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBzdGFydFRpbWUsIGVuZFRpbWUpID0+IHtcclxuXHRcdGxldCBkYXRhID0gcmF3ZGF0YS5kYXRhO1xyXG5cdFx0aWYgKHdvcmQgIT09ICcnKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmICgocmF3ZGF0YS5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IHJhd2RhdGEuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgc3RhcnRUaW1lLCBlbmRUaW1lKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9LFxyXG5cdHVuaXF1ZTogKGRhdGEpID0+IHtcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0aWYgKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCkgPT4ge1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpZiAobi5zdG9yeS5pbmRleE9mKHdvcmQpID4gLTEpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKSA9PiB7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncykge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgc3QsIHQpID0+IHtcclxuXHRcdGxldCB0aW1lX2FyeTIgPSBzdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCBlbmR0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLCAocGFyc2VJbnQodGltZV9hcnlbMV0pIC0gMSksIHRpbWVfYXJ5WzJdLCB0aW1lX2FyeVszXSwgdGltZV9hcnlbNF0sIHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgc3RhcnR0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5MlswXSwgKHBhcnNlSW50KHRpbWVfYXJ5MlsxXSkgLSAxKSwgdGltZV9hcnkyWzJdLCB0aW1lX2FyeTJbM10sIHRpbWVfYXJ5Mls0XSwgdGltZV9hcnkyWzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoKGNyZWF0ZWRfdGltZSA+IHN0YXJ0dGltZSAmJiBjcmVhdGVkX3RpbWUgPCBlbmR0aW1lKSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKSA9PiB7XHJcblx0XHRpZiAodGFyID09ICdhbGwnKSB7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpID0+IHtcclxuXHJcblx0fSxcclxuXHRhZGRMaW5rOiAoKSA9PiB7XHJcblx0XHRsZXQgdGFyID0gJCgnLmlucHV0YXJlYSAubW9yZWxpbmsnKTtcclxuXHRcdGlmICh0YXIuaGFzQ2xhc3MoJ3Nob3cnKSkge1xyXG5cdFx0XHR0YXIucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRhci5hZGRDbGFzcygnc2hvdycpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVzZXQ6ICgpID0+IHtcclxuXHRcdGxldCBjb21tYW5kID0gZGF0YS5yYXcuY29tbWFuZDtcclxuXHRcdGlmICgoY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBjb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKSB7XHJcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5sZXQgcGFnZV9zZWxlY3RvciA9IHtcclxuXHRwYWdlczogW10sXHJcblx0Z3JvdXBzOiBbXSxcclxuXHRzaG93OiAoKT0+e1xyXG5cdFx0JCgnLnBhZ2Vfc2VsZWN0b3InKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0cGFnZV9zZWxlY3Rvci5nZXRBZG1pbigpO1xyXG5cdH0sXHJcblx0Z2V0QWRtaW46ICgpPT57XHJcblx0XHRQcm9taXNlLmFsbChbcGFnZV9zZWxlY3Rvci5nZXRQYWdlKCksIHBhZ2Vfc2VsZWN0b3IuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0cGFnZV9zZWxlY3Rvci5nZW5BZG1pbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRQYWdlOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2FjY291bnRzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRHcm91cDogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9ncm91cHM/ZmllbGRzPW5hbWUsaWQsYWRtaW5pc3RyYXRvciZsaW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUgKHJlcy5kYXRhLmZpbHRlcihpdGVtPT57cmV0dXJuIGl0ZW0uYWRtaW5pc3RyYXRvciA9PT0gdHJ1ZX0pKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbkFkbWluOiAocmVzKT0+e1xyXG5cdFx0bGV0IHBhZ2VzID0gJyc7XHJcblx0XHRsZXQgZ3JvdXBzID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzWzBdKXtcclxuXHRcdFx0cGFnZXMgKz0gYDxkaXYgY2xhc3M9XCJwYWdlX2J0blwiIGRhdGEtdHlwZT1cIjFcIiBkYXRhLXZhbHVlPVwiJHtpLmlkfVwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBhZ2UodGhpcylcIj4ke2kubmFtZX08L2Rpdj5gO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBpIG9mIHJlc1sxXSl7XHJcblx0XHRcdGdyb3VwcyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgZGF0YS10eXBlPVwiMlwiIGRhdGEtdmFsdWU9XCIke2kuaWR9XCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UGFnZSh0aGlzKVwiPiR7aS5uYW1lfTwvZGl2PmA7XHJcblx0XHR9XHJcblx0XHQkKCcuc2VsZWN0X3BhZ2UnKS5odG1sKHBhZ2VzKTtcclxuXHRcdCQoJy5zZWxlY3RfZ3JvdXAnKS5odG1sKGdyb3Vwcyk7XHJcblx0fSxcclxuXHRzZWxlY3RQYWdlOiAodGFyZ2V0KT0+e1xyXG5cdFx0bGV0IHBhZ2VfaWQgPSAkKHRhcmdldCkuZGF0YSgndmFsdWUnKTtcclxuXHRcdCQoJyNwb3N0X3RhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHQkKCcuZmJfbG9hZGluZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRGQi5hcGkoYC8ke3BhZ2VfaWR9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKSB7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VfaWR9L2xpdmVfdmlkZW9zP2ZpZWxkcz1zdGF0dXMscGVybWFsaW5rX3VybCx0aXRsZSxjcmVhdGlvbl90aW1lYCwgKHJlcyk9PntcclxuXHRcdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRcdGZvcihsZXQgdHIgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdGlmICh0ci5zdGF0dXMgPT09ICdMSVZFJyl7XHJcblx0XHRcdFx0XHR0aGVhZCArPSBgPHRyPjx0ZD48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbmNsaWNrPVwicGFnZV9zZWxlY3Rvci5zZWxlY3RQb3N0KCcke3RyLmlkfScpXCI+6YG45pOH6LK85paHPC9idXR0b24+KExJVkUpPC90ZD48dGQ+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbSR7dHIucGVybWFsaW5rX3VybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3RyLnRpdGxlfTwvYT48L3RkPjx0ZD4ke3RpbWVDb252ZXJ0ZXIodHIuY3JlYXRlZF90aW1lKX08L3RkPjwvdHI+YDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRoZWFkICs9IGA8dHI+PHRkPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBvc3QoJyR7dHIuaWR9JylcIj7pgbjmk4fosrzmloc8L2J1dHRvbj48L3RkPjx0ZD48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tJHt0ci5wZXJtYWxpbmtfdXJsfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dHIudGl0bGV9PC9hPjwvdGQ+PHRkPiR7dGltZUNvbnZlcnRlcih0ci5jcmVhdGVkX3RpbWUpfTwvdGQ+PC90cj5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQkKCcjcG9zdF90YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0fSk7XHJcblx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VfaWR9L2ZlZWQ/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0JCgnLmZiX2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdFx0Zm9yKGxldCB0ciBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0dGJvZHkgKz0gYDx0cj48dGQ+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UG9zdCgnJHt0ci5pZH0nKVwiPumBuOaTh+iyvOaWhzwvYnV0dG9uPjwvdGQ+PHRkPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt0ci5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3RyLm1lc3NhZ2V9PC9hPjwvdGQ+PHRkPiR7dGltZUNvbnZlcnRlcih0ci5jcmVhdGVkX3RpbWUpfTwvdGQ+PC90cj5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJyNwb3N0X3RhYmxlIHRib2R5JykuaHRtbCh0Ym9keSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHNlbGVjdFBvc3Q6IChmYmlkKT0+e1xyXG5cdFx0JCgnLnBhZ2Vfc2VsZWN0b3InKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnNlbGVjdF9wYWdlJykuaHRtbCgnJyk7XHJcblx0XHQkKCcuc2VsZWN0X2dyb3VwJykuaHRtbCgnJyk7XHJcblx0XHQkKCcjcG9zdF90YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0bGV0IGlkID0gJ1wiJytmYmlkKydcIic7XHJcblx0XHQkKCcjZW50ZXJVUkwgLnVybCcpLnZhbChpZCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpIHtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpICsgMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBkYXRlICsgXCItXCIgKyBob3VyICsgXCItXCIgKyBtaW4gKyBcIi1cIiArIHNlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCkge1xyXG5cdHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuXHR2YXIgbW9udGhzID0gWycwMScsICcwMicsICcwMycsICcwNCcsICcwNScsICcwNicsICcwNycsICcwOCcsICcwOScsICcxMCcsICcxMScsICcxMiddO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0aWYgKGRhdGUgPCAxMCkge1xyXG5cdFx0ZGF0ZSA9IFwiMFwiICsgZGF0ZTtcclxuXHR9XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdGlmIChtaW4gPCAxMCkge1xyXG5cdFx0bWluID0gXCIwXCIgKyBtaW47XHJcblx0fVxyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRpZiAoc2VjIDwgMTApIHtcclxuXHRcdHNlYyA9IFwiMFwiICsgc2VjO1xyXG5cdH1cclxuXHR2YXIgdGltZSA9IHllYXIgKyAnLScgKyBtb250aCArICctJyArIGRhdGUgKyBcIiBcIiArIGhvdXIgKyAnOicgKyBtaW4gKyAnOicgKyBzZWM7XHJcblx0cmV0dXJuIHRpbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9iajJBcnJheShvYmopIHtcclxuXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBbdmFsdWVdO1xyXG5cdH0pO1xyXG5cdHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG5cdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgaSwgciwgdDtcclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRhcnlbaV0gPSBpO1xyXG5cdH1cclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcblx0XHR0ID0gYXJ5W3JdO1xyXG5cdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG5cdFx0YXJ5W2ldID0gdDtcclxuXHR9XHJcblx0cmV0dXJuIGFyeTtcclxufVxyXG5cclxuZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcblx0Ly9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuXHR2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcblxyXG5cdHZhciBDU1YgPSAnJztcclxuXHQvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuXHJcblx0Ly8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG5cdC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcblx0aWYgKFNob3dMYWJlbCkge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG5cclxuXHRcdFx0Ly9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuXHRcdFx0cm93ICs9IGluZGV4ICsgJywnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcblxyXG5cdFx0Ly9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0Ly8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuXHRcdFx0cm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0Ly9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHRpZiAoQ1NWID09ICcnKSB7XHJcblx0XHRhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuXHR2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG5cdC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG5cdGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZywgXCJfXCIpO1xyXG5cclxuXHQvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG5cdHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcblxyXG5cdC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG5cdC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcblx0Ly8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcblx0Ly8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuXHJcblx0Ly90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcblx0bGluay5ocmVmID0gdXJpO1xyXG5cclxuXHQvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG5cdGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcblx0bGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcblxyXG5cdC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHRsaW5rLmNsaWNrKCk7XHJcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
