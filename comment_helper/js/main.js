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
		if (data.raw.type == 'group') {
			if (auth_scope.includes('groups_access_member_info')) {
				swal('完成！', 'Done!', 'success').done();
				data.raw = fbid;
				data.filter(data.raw, true);
				ui.reset();
			} else {
				swal('付費授權檢查錯誤，抓社團貼文需付費', 'Authorization Failed! It is a paid feature.', 'error').done();
			}
		} else {
			swal('完成！', 'Done!', 'success').done();
			data.raw = fbid;
			data.filter(data.raw, true);
			ui.reset();
		}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwiZmJlcnJvciIsIndpbmRvdyIsIm9uZXJyb3IiLCJoYW5kbGVFcnIiLCJUQUJMRSIsImxhc3RDb21tYW5kIiwiYWRkTGluayIsImF1dGhfc2NvcGUiLCJtc2ciLCJ1cmwiLCJsIiwiJCIsInZhbCIsImNvbnNvbGUiLCJsb2ciLCJhcHBlbmQiLCJmYWRlSW4iLCJkb2N1bWVudCIsInJlYWR5IiwiaGFzaCIsImxvY2F0aW9uIiwic2VhcmNoIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwiZGF0YSIsImV4dGVuc2lvbiIsImNsaWNrIiwiZSIsImZiIiwiZXh0ZW5zaW9uQXV0aCIsImRhdGFzIiwiY29tbWFuZCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsInJhbmtlciIsInJhdyIsImZpbmlzaCIsImdldEF1dGgiLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJsaWtlcyIsImNob29zZSIsImluaXQiLCJ1aSIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJmaWx0ZXIiLCJyZWFjdCIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJzdGFydFRpbWUiLCJmb3JtYXQiLCJlbmRUaW1lIiwic2V0U3RhcnREYXRlIiwiZmlsdGVyRGF0YSIsImV4cG9ydFRvSnNvbkZpbGUiLCJleGNlbFN0cmluZyIsImV4Y2VsIiwic3RyaW5naWZ5IiwiY2lfY291bnRlciIsImZyb21fZXh0ZW5zaW9uIiwiaW1wb3J0IiwiZmlsZXMiLCJqc29uRGF0YSIsImRhdGFTdHIiLCJkYXRhVXJpIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiZXhwb3J0RmlsZURlZmF1bHROYW1lIiwibGlua0VsZW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwic2hhcmVCVE4iLCJhbGVydCIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJub3dEYXRlIiwiYXV0aCIsInBhZ2VUb2tlbiIsInVzZXJUb2tlbiIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJhdXRoX3R5cGUiLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJhY2Nlc3NUb2tlbiIsImdyYW50ZWRTY29wZXMiLCJhcGkiLCJyZXMiLCJvYmoiLCJ0b2tlbiIsInVzZXJuYW1lIiwibmFtZSIsImFwcF9zY29wZV9pZCIsImlkIiwicG9zdCIsIm1lc3NhZ2UiLCJjb2RlIiwicGFnZV9zZWxlY3RvciIsInNob3ciLCJmYmlkIiwiYXV0aE9LIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJnZXQiLCJyZXMyIiwic3dhbCIsInRpdGxlIiwiaHRtbCIsImRvbmUiLCJwb3N0ZGF0YSIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwidGhlbiIsImkiLCJwdXNoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwcm9taXNlX2FycmF5IiwicHVyZUlEIiwidG9TdHJpbmciLCJsZW5ndGgiLCJkIiwiZnJvbSIsInVwZGF0ZWRfdGltZSIsImNyZWF0ZWRfdGltZSIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsImluY2x1ZGVzIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwic3RvcnkiLCJ0aW1lQ29udmVydGVyIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInN0ciIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwiZmlsdGVyZGF0YSIsInRoZWFkIiwidGJvZHkiLCJwaWMiLCJob3N0IiwiZW50cmllcyIsImoiLCJwaWN0dXJlIiwidGQiLCJzY29yZSIsImxpa2VfY291bnQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJuIiwicGFyc2VJbnQiLCJmaW5kIiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJtYXAiLCJpbmRleCIsInJvd3MiLCJub2RlcyIsImlubmVySFRNTCIsIm5vdyIsImsiLCJ0YXIiLCJlcSIsImluc2VydEJlZm9yZSIsImdlbl9iaWdfYXdhcmQiLCJsaSIsImF3YXJkcyIsImhhc0F0dHJpYnV0ZSIsImF3YXJkX25hbWUiLCJhdHRyIiwibGluayIsInRpbWUiLCJjbG9zZV9iaWdfYXdhcmQiLCJlbXB0eSIsInN1YnN0cmluZyIsInJlZ2V4IiwibmV3dXJsIiwic3Vic3RyIiwibWF0Y2giLCJ1cmx0eXBlIiwiY2hlY2tUeXBlIiwiY2hlY2tQYWdlSUQiLCJwYWdlSUQiLCJ2aWRlbyIsImxpdmVfc3RhdHVzIiwiZXJyb3IiLCJhY2Nlc3NfdG9rZW4iLCJwb3N0dXJsIiwicmVnZXgyIiwidGVtcCIsInRlc3QiLCJwYWdlbmFtZSIsInRhZyIsInVuaXF1ZSIsIm91dHB1dCIsImtleXMiLCJmb3JFYWNoIiwiaXRlbSIsImtleSIsIm5ld0FyeSIsImdyZXAiLCJ1bmRlZmluZWQiLCJtZXNzYWdlX3RhZ3MiLCJzdCIsInQiLCJ0aW1lX2FyeTIiLCJzcGxpdCIsInRpbWVfYXJ5IiwiZW5kdGltZSIsIm1vbWVudCIsIkRhdGUiLCJfZCIsInN0YXJ0dGltZSIsInBhZ2VzIiwiZ3JvdXBzIiwiZ2V0QWRtaW4iLCJhbGwiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJnZW5BZG1pbiIsImFkbWluaXN0cmF0b3IiLCJzZWxlY3RQYWdlIiwicGFnZV9pZCIsInBlcm1hbGlua191cmwiLCJzZWxlY3RQb3N0IiwiYSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05Ub0NTVkNvbnZlcnRvciIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwicm93Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImhyZWYiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBLElBQUlDLFVBQVUsRUFBZDtBQUNBQyxPQUFPQyxPQUFQLEdBQWlCQyxTQUFqQjtBQUNBLElBQUlDLEtBQUo7QUFDQSxJQUFJQyxjQUFjLFVBQWxCO0FBQ0EsSUFBSUMsVUFBVSxLQUFkO0FBQ0EsSUFBSUMsYUFBYSxFQUFqQjs7QUFFQSxTQUFTSixTQUFULENBQW1CSyxHQUFuQixFQUF3QkMsR0FBeEIsRUFBNkJDLENBQTdCLEVBQWdDO0FBQy9CLEtBQUksQ0FBQ1gsWUFBTCxFQUFtQjtBQUNsQixNQUFJVSxPQUFNRSxFQUFFLGdCQUFGLEVBQW9CQyxHQUFwQixFQUFWO0FBQ0FDLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFpRCw0QkFBakQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQkwsSUFBbEM7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ZCxDQUEwQjVGLElBQTFCO0FBQ0FBLE1BQUtqTixLQUFMO0FBQ0FULFVBQVNxVCxJQUFULENBQWNFLFdBQWQsQ0FBMEI3RixJQUExQjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbnZhciBmYmVycm9yID0gJyc7XHJcbndpbmRvdy5vbmVycm9yID0gaGFuZGxlRXJyO1xyXG52YXIgVEFCTEU7XHJcbnZhciBsYXN0Q29tbWFuZCA9ICdjb21tZW50cyc7XHJcbnZhciBhZGRMaW5rID0gZmFsc2U7XHJcbnZhciBhdXRoX3Njb3BlID0gJyc7XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLCB1cmwsIGwpIHtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSkge1xyXG5cdFx0bGV0IHVybCA9ICQoJyNlbnRlclVSTCAudXJsJykudmFsKCk7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsIFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArIHVybCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmFwcGVuZChgPGJyPjxicj4ke2ZiZXJyb3J9PGJyPjxicj4ke3VybH1gKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uc2VhcmNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJleHRlbnNpb25cIikgPj0gMCkge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRkYXRhLmV4dGVuc2lvbiA9IHRydWU7XHJcblxyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aCBidXR0b25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJyYW5rZXJcIikgPj0gMCkge1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiAncmFua2VyJyxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucmFua2VyKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcblxyXG5cdCQoXCIjYnRuX3BhZ2Vfc2VsZWN0b3JcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGZiLmdldEF1dGgoJ3BhZ2Vfc2VsZWN0b3InKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9sb2dpblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgncGFnZV9zZWxlY3RvcicpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLmxpa2VzID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRmYi5nZXRBdXRoKCd1cmxfY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHQkKFwiI21vcmVwb3N0XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdHVpLmFkZExpbmsoKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLopIfoo73ooajmoLzlhaflrrlcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS9NTS9ERCBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSwgZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLnN0YXJ0VGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gZW5kLmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUoY29uZmlnLmZpbHRlci5zdGFydFRpbWUpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRleHBvcnRUb0pzb25GaWxlKGZpbHRlckRhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gaWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCkge1xyXG5cdFx0XHQvLyBcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQvLyB9IGVsc2Uge1xyXG5cdFx0XHQvLyBcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGEpLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpIHtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRjb25maWcuZnJvbV9leHRlbnNpb24gPSB0cnVlO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZXhwb3J0VG9Kc29uRmlsZShqc29uRGF0YSkge1xyXG4gICAgbGV0IGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShqc29uRGF0YSk7XHJcbiAgICBsZXQgZGF0YVVyaSA9ICdkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCwnKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVN0cik7XHJcbiAgICBcclxuICAgIGxldCBleHBvcnRGaWxlRGVmYXVsdE5hbWUgPSAnZGF0YS5qc29uJztcclxuICAgIFxyXG4gICAgbGV0IGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgZGF0YVVyaSk7XHJcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZXhwb3J0RmlsZURlZmF1bHROYW1lKTtcclxuICAgIGxpbmtFbGVtZW50LmNsaWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNoYXJlQlROKCkge1xyXG5cdGFsZXJ0KCfoqo3nnJ/nnIvlrozot7Plh7rkvobnmoTpgqPpoIHkuIrpnaLlr6vkuobku4DpurxcXG5cXG7nnIvlrozkvaDlsLHmnIPnn6XpgZPkvaDngrrku4DpurzkuI3og73mipPliIbkuqsnKTtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsICdtZXNzYWdlX3RhZ3MnLCAnbWVzc2FnZScsICdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCAnZnJvbScsICdtZXNzYWdlJywgJ3N0b3J5J10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzE1JyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjcuMCcsXHJcblx0XHRyZWFjdGlvbnM6ICd2Ny4wJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjcuMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Ny4wJyxcclxuXHRcdGZlZWQ6ICd2Ny4wJyxcclxuXHRcdGdyb3VwOiAndjcuMCcsXHJcblx0XHRuZXdlc3Q6ICd2Ny4wJ1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdHN0YXJ0VGltZTogJzIwMDAtMTItMzEtMDAtMDAtMDAnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRvcmRlcjogJ2Nocm9ub2xvZ2ljYWwnLFxyXG5cdGF1dGg6ICdncm91cHNfc2hvd19saXN0LCBwYWdlc19zaG93X2xpc3QsIHBhZ2VzX3JlYWRfZW5nYWdlbWVudCwgcGFnZXNfcmVhZF91c2VyX2NvbnRlbnQnLFxyXG5cdGxpa2VzOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG5cdHVzZXJUb2tlbjogJycsXHJcblx0ZnJvbV9leHRlbnNpb246IGZhbHNlLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJykgPT4ge1xyXG5cdFx0aWYgKHR5cGUgPT09ICcnKSB7XHJcblx0XHRcdGFkZExpbmsgPSB0cnVlO1xyXG5cdFx0XHR0eXBlID0gbGFzdENvbW1hbmQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZGRMaW5rID0gZmFsc2U7XHJcblx0XHRcdGxhc3RDb21tYW5kID0gdHlwZTtcclxuXHRcdH1cclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcgLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0Ly8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLnVzZXJUb2tlbiA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5hY2Nlc3NUb2tlbjtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRjb25maWcuZnJvbV9leHRlbnNpb24gPSBmYWxzZTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKSB7XHJcblx0XHRcdFx0Ly8gaWYgKGF1dGhfc2NvcGUuaW5jbHVkZXMoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSl7XHJcblx0XHRcdFx0Ly8gXHRzd2FsKFxyXG5cdFx0XHRcdC8vIFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcclxuXHRcdFx0XHQvLyBcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxyXG5cdFx0XHRcdC8vIFx0XHQnc3VjY2VzcydcclxuXHRcdFx0XHQvLyBcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdC8vIH1lbHNle1xyXG5cdFx0XHRcdC8vIFx0c3dhbChcclxuXHRcdFx0XHQvLyBcdFx0J+S7mOiyu+aOiOasiuaqouafpemMr+iqpO+8jOipsuWKn+iDvemcgOS7mOiyuycsXHJcblx0XHRcdFx0Ly8gXHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgSXQgaXMgYSBwYWlkIGZlYXR1cmUuJyxcclxuXHRcdFx0XHQvLyBcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdC8vIFx0KS5kb25lKCk7XHJcblx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdEZCLmFwaShgL21lP2ZpZWxkcz1pZCxuYW1lYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0dG9rZW46IC0xLFxyXG5cdFx0XHRcdFx0XHR1c2VybmFtZTogcmVzLm5hbWUsXHJcblx0XHRcdFx0XHRcdGFwcF9zY29wZV9pZDogcmVzLmlkXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkLnBvc3QoJ2h0dHBzOi8vc2NyaXB0Lmdvb2dsZS5jb20vbWFjcm9zL3MvQUtmeWNieGFHWGthT3pUMkFEQ0M4ci1BNHFCTWc2OVd6XzE2OEFIRXIwZlovZXhlYycsIG9iaiwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdFx0YWxlcnQocmVzLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmNvZGUgPT0gMSl7XHJcblx0XHRcdFx0XHRcdFx0Ly8gbG9jYXRpb24uaHJlZiA9IFwiaW5kZXguaHRtbFwiO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09IFwicGFnZV9zZWxlY3RvclwiKSB7XHRcclxuXHRcdFx0XHRwYWdlX3NlbGVjdG9yLnNob3coKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmYi51c2VyX3Bvc3RzID0gdHJ1ZTtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQXV0aDogKCkgPT4ge1xyXG5cdFx0ZmIuYXV0aE9LKCk7XHJcblx0XHQvLyBGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdC8vIFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0Ly8gfSwge1xyXG5cdFx0Ly8gXHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHQvLyBcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdC8vIH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRGQi5hcGkoYC9tZT9maWVsZHM9aWQsbmFtZWAsIChyZXMpID0+IHtcclxuXHRcdFx0XHQkLmdldCgnaHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4YUdYa2FPelQyQURDQzhyLUE0cUJNZzY5V3pfMTY4QUhFcjBmWi9leGVjP2lkPScrcmVzLmlkLCBmdW5jdGlvbihyZXMyKXtcclxuXHRcdFx0XHRcdGlmIChyZXMyID09PSAndHJ1ZScpe1xyXG5cdFx0XHRcdFx0XHRmYi5hdXRoT0soKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRcdFx0aHRtbDogJzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+PGJyPnVzZXJJRO+8micrcmVzLmlkLFxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRhdXRoT0s6ICgpID0+IHtcclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0bGV0IHBvc3RkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucG9zdGRhdGEpO1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiBwb3N0ZGF0YS5jb21tYW5kLFxyXG5cdFx0XHRkYXRhOiBKU09OLnBhcnNlKCQoXCIuY2hyb21lXCIpLnZhbCgpKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzogW10sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluizh+aWmeS4rS4uLicpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0aWYgKCFhZGRMaW5rKSB7XHJcblx0XHRcdGRhdGEucmF3ID0gW107XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKGZiaWQpID0+IHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKCcucHVyZV9mYmlkJykudGV4dChmYmlkLmZ1bGxJRCk7XHJcblx0XHRkYXRhLmdldChmYmlkKS50aGVuKChyZXMpID0+IHtcclxuXHRcdFx0Ly8gZmJpZC5kYXRhID0gcmVzO1xyXG5cdFx0XHRmb3IgKGxldCBpIG9mIHJlcykge1xyXG5cdFx0XHRcdGZiaWQuZGF0YS5wdXNoKGkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEuZmluaXNoKGZiaWQpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IGNvbW1hbmQgPSBmYmlkLmNvbW1hbmQ7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpe1xyXG5cdFx0XHRcdGZiaWQuZnVsbElEID0gZmJpZC5wdXJlSUQ7XHJcblx0XHRcdFx0Y29tbWFuZCA9ICdncm91cCc7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJyAmJiBmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpIHtcclxuXHRcdFx0XHRmYmlkLmZ1bGxJRCA9IGZiaWQucHVyZUlEO1xyXG5cdFx0XHRcdGZiaWQuY29tbWFuZCA9ICdsaWtlcyc7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGNvbmZpZy5saWtlcykgZmJpZC5jb21tYW5kID0gJ2xpa2VzJztcclxuXHRcdFx0Y29uc29sZS5sb2coYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZmaWVsZHM9JHtjb25maWcuZmllbGRbZmJpZC5jb21tYW5kXS50b1N0cmluZygpfSZkZWJ1Zz1hbGxgKTtcclxuXHRcdFx0bGV0IHRva2VuID0gY29uZmlnLnBhZ2VUb2tlbiA9PSAnJyA/IGAmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnVzZXJUb2tlbn1gOmAmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn1gO1xyXG5cclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mb3JkZXI9JHtjb25maWcub3JkZXJ9JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JHt0b2tlbn0mZGVidWc9YWxsYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdGZvciAobGV0IGQgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdGlmICgoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGZiaWQuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IGQubmFtZVxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKGNvbmZpZy5saWtlcykgZC50eXBlID0gXCJMSUtFXCI7XHJcblx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSkge1xyXG5cdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQgPSAwKSB7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKSB7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywgJ2xpbWl0PScgKyBsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkLmlkKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgZmJpZC5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHQvLyBpZiAoZGF0YS5ub3dMZW5ndGggPCAxODApIHtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKSA9PiB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIudXBkYXRlX2FyZWEsLmRvbmF0ZV9hcmVhXCIpLnNsaWRlVXAoKTtcclxuXHRcdCQoXCIucmVzdWx0X2FyZWFcIikuc2xpZGVEb3duKCk7XHJcblx0XHRpZiAoZGF0YS5yYXcudHlwZSA9PSAnZ3JvdXAnKXtcclxuXHRcdFx0aWYgKGF1dGhfc2NvcGUuaW5jbHVkZXMoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSl7XHJcblx0XHRcdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHRcdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0XHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdFx0XHR1aS5yZXNldCgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0J+S7mOiyu+aOiOasiuaqouafpemMr+iqpO+8jOaKk+ekvuWcmOiyvOaWh+mcgOS7mOiyuycsXHJcblx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIEl0IGlzIGEgcGFpZCBmZWF0dXJlLicsXHJcblx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0XHRcdHVpLnJlc2V0KCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKSA9PiB7XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Ly8gaWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9PT0gZmFsc2UgJiYgcmF3RGF0YS5jb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHQvLyBcdHJhd0RhdGEuZGF0YSA9IHJhd0RhdGEuZGF0YS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHQvLyBcdFx0cmV0dXJuIGl0ZW0uaXNfaGlkZGVuID09PSBmYWxzZVxyXG5cdFx0Ly8gXHR9KTtcclxuXHRcdC8vIH1cclxuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKSB7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdykgPT4ge1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0Y29uc29sZS5sb2cocmF3KTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbikge1xyXG5cdFx0XHRpZiAocmF3LmNvbW1hbmQgPT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCI6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLooajmg4VcIjogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKSA9PiB7XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSkgPT4ge1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJkYXRhID0gcmF3ZGF0YS5maWx0ZXJlZDtcclxuXHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0aWYgKChyYXdkYXRhLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgcmF3ZGF0YS5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7ooajmg4U8L3RkPmA7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMTEwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7mjpLlkI08L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuWIhuaVuDwvdGQ+YDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGhvc3QgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyc7XHJcblx0XHRpZiAoZGF0YS5yYXcudHlwZSA9PT0gJ3VybF9jb21tZW50cycpIGhvc3QgPSAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpICsgJz9mYl9jb21tZW50X2lkPSc7XHJcblxyXG5cdFx0Zm9yIChsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpIHtcclxuXHRcdFx0bGV0IHBpY3R1cmUgPSAnJztcclxuXHRcdFx0aWYgKHBpYykge1xyXG5cdFx0XHRcdHBpY3R1cmUgPSBgPGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0aWYgKChyYXdkYXRhLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgcmF3ZGF0YS5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3Rvcnl9PC9hPjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblx0XHRcdFx0dGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdFx0XHQgIDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPiR7dmFsLnNjb3JlfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgcG9zdGxpbmsgPSBob3N0ICsgdmFsLmlkO1xyXG5cdFx0XHRcdGlmIChjb25maWcuZnJvbV9leHRlbnNpb24pIHtcclxuXHRcdFx0XHRcdHBvc3RsaW5rID0gdmFsLnBvc3RsaW5rO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiJHtwb3N0bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCkge1xyXG5cdFx0XHRUQUJMRSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2VhcmNoQ29tbWVudFwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEFCTEVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCkgPT4ge1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjc2VhcmNoQ29tbWVudFwiKS52YWwoKSAhPSAnJykge1xyXG5cdFx0XHR0YWJsZS5yZWRvKCk7XHJcblx0XHR9XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCkge1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcIm5hbWVcIjogcCxcclxuXHRcdFx0XHRcdFx0XCJudW1cIjogblxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oKTtcclxuXHR9LFxyXG5cdGdvOiAoKSA9PiB7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YS5maWx0ZXJlZC5sZW5ndGgpLnNwbGljZSgwLCBjaG9vc2UubnVtKTtcclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGNob29zZS5hd2FyZC5tYXAoKHZhbCwgaW5kZXgpID0+IHtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHIgdGl0bGU9XCLnrKwnICsgKGluZGV4ICsgMSkgKyAn5ZCNXCI+JyArICQoJy5tYWluX3RhYmxlJykuRGF0YVRhYmxlKCkucm93cyh7XHJcblx0XHRcdFx0c2VhcmNoOiAnYXBwbGllZCdcclxuXHRcdFx0fSkubm9kZXMoKVt2YWxdLmlubmVySFRNTCArICc8L3RyPic7XHJcblx0XHR9KVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmIChjaG9vc2UuZGV0YWlsKSB7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IgKGxldCBrIGluIGNob29zZS5saXN0KSB7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI1XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9LFxyXG5cdGdlbl9iaWdfYXdhcmQ6ICgpID0+IHtcclxuXHRcdGxldCBsaSA9ICcnO1xyXG5cdFx0bGV0IGF3YXJkcyA9IFtdO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0Ym9keSB0cicpLmVhY2goZnVuY3Rpb24gKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0bGV0IGF3YXJkID0ge307XHJcblx0XHRcdGlmICh2YWwuaGFzQXR0cmlidXRlKCd0aXRsZScpKSB7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgxKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLnVzZXJpZCA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJykucmVwbGFjZSgnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycsICcnKTtcclxuXHRcdFx0XHRhd2FyZC5tZXNzYWdlID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC5saW5rID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0XHRhd2FyZC50aW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoJCh2YWwpLmZpbmQoJ3RkJykubGVuZ3RoIC0gMSkudGV4dCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSB0cnVlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS50ZXh0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXdhcmRzLnB1c2goYXdhcmQpO1xyXG5cdFx0fSk7XHJcblx0XHRmb3IgKGxldCBpIG9mIGF3YXJkcykge1xyXG5cdFx0XHRpZiAoaS5hd2FyZF9uYW1lID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bGkgKz0gYDxsaSBjbGFzcz1cInByaXplTmFtZVwiPiR7aS5uYW1lfTwvbGk+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpPlxyXG5cdFx0XHRcdDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aS51c2VyaWR9L3BpY3R1cmU/dHlwZT1sYXJnZSZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufVwiIGFsdD1cIlwiPjwvYT5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5mb1wiPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibmFtZVwiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubmFtZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubWVzc2FnZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwidGltZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kudGltZX08L2E+PC9wPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvbGk+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmFwcGVuZChsaSk7XHJcblx0XHQkKCcuYmlnX2F3YXJkJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHR9LFxyXG5cdGNsb3NlX2JpZ19hd2FyZDogKCkgPT4ge1xyXG5cdFx0JCgnLmJpZ19hd2FyZCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuZW1wdHkoKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmYmlkID0ge1xyXG5cdGZiaWQ6IFtdLFxyXG5cdGluaXQ6ICh0eXBlKSA9PiB7XHJcblx0XHRmYmlkLmZiaWQgPSBbXTtcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0RkIuYXBpKFwiL21lXCIsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0ZGF0YS51c2VyaWQgPSByZXMuaWQ7XHJcblx0XHRcdGxldCB1cmwgPSAnJztcclxuXHRcdFx0aWYgKGFkZExpbmspIHtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgpKTtcclxuXHRcdFx0XHQkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgnJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dXJsID0gZmJpZC5mb3JtYXQoJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHVybC5pbmRleE9mKCcucGhwPycpID09PSAtMSAmJiB1cmwuaW5kZXhPZignPycpID4gMCkge1xyXG5cdFx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoJz8nKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZmJpZC5nZXQodXJsLCB0eXBlKS50aGVuKChmYmlkKSA9PiB7XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Ly8gJCgnLmlkZW50aXR5JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKGDnmbvlhaXouqvku73vvJo8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cmVzLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48c3Bhbj4ke3Jlcy5uYW1lfTwvc3Bhbj5gKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAodXJsLCB0eXBlKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRsZXQgbmV3dXJsID0gdXJsLnN1YnN0cih1cmwuaW5kZXhPZignLycsIDI4KSArIDEsIDIwMCk7XHJcblx0XHRcdC8vIGh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8g5YWxMjXlrZflhYPvvIzlm6DmraTpgbgyOOmWi+Wni+aJvi9cclxuXHRcdFx0bGV0IHJlc3VsdCA9IG5ld3VybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdGxldCB1cmx0eXBlID0gZmJpZC5jaGVja1R5cGUodXJsKTtcclxuXHRcdFx0ZmJpZC5jaGVja1BhZ2VJRCh1cmwsIHVybHR5cGUpLnRoZW4oKGlkKSA9PiB7XHJcblx0XHRcdFx0aWYgKGlkID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHR1cmx0eXBlID0gJ3BlcnNvbmFsJztcclxuXHRcdFx0XHRcdGlkID0gZGF0YS51c2VyaWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0XHRwYWdlSUQ6IGlkLFxyXG5cdFx0XHRcdFx0dHlwZTogdXJsdHlwZSxcclxuXHRcdFx0XHRcdGNvbW1hbmQ6IHR5cGUsXHJcblx0XHRcdFx0XHRkYXRhOiBbXVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKGFkZExpbmspIG9iai5kYXRhID0gZGF0YS5yYXcuZGF0YTsgLy/ov73liqDosrzmlodcclxuXHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ2ZiaWQ9Jyk7XHJcblx0XHRcdFx0XHRpZiAoc3RhcnQgPj0gMCkge1xyXG5cdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsIHN0YXJ0KTtcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQgKyA1LCBlbmQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCArIDYsIHVybC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGV0IHZpZGVvID0gdXJsLmluZGV4T2YoJ3ZpZGVvcy8nKTtcclxuXHRcdFx0XHRcdGlmICh2aWRlbyA+PSAwKSB7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAncHVyZScpIHtcclxuXHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCAnJyk7XHJcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyBcIl9cIiArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdwaG90bycpIHtcclxuXHRcdFx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRcdFx0bGV0IHJlc3VsdCA9IHVybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3ZpZGVvJykge1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0RkIuYXBpKGAvJHtvYmoucHVyZUlEfT9maWVsZHM9bGl2ZV9zdGF0dXNgLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlcy5saXZlX3N0YXR1cyA9PT0gJ0xJVkUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSB8fCByZXN1bHQubGVuZ3RoID09IDMpIHtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICd1bm5hbWUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0RkIuYXBpKGAvJHtvYmoucGFnZUlEfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoZWNrVHlwZTogKHBvc3R1cmwpID0+IHtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJmYmlkPVwiKSA+PSAwKSB7XHJcblx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ3Blcm1hbGluaycpID49IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3VubmFtZSc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuICdwZXJzb25hbCc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL2dyb3Vwcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ2dyb3VwJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdldmVudCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9waG90b3MvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdwaG90byc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi92aWRlb3MvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICd2aWRlbyc7XHJcblx0XHR9XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdwdXJlJztcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJ25vcm1hbCc7XHJcblx0fSxcclxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBzdGFydCA9IHBvc3R1cmwuaW5kZXhPZihcImZhY2Vib29rLmNvbVwiKSArIDEzO1xyXG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLCBzdGFydCk7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGlmIChlbmQgPCAwKSB7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignZmJpZD0nKSA+PSAwKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3VubmFtZScpIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgndW5uYW1lJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IGdyb3VwID0gcG9zdHVybC5pbmRleE9mKCcvZ3JvdXBzLycpO1xyXG5cdFx0XHRcdGxldCBldmVudCA9IHBvc3R1cmwuaW5kZXhPZignL2V2ZW50cy8nKVxyXG5cdFx0XHRcdGlmIChncm91cCA+PSAwKSB7XHJcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwICsgODtcclxuXHRcdFx0XHRcdGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIiwgc3RhcnQpO1xyXG5cdFx0XHRcdFx0bGV0IHJlZ2V4MiA9IC9cXGR7Nix9L2c7XHJcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xyXG5cdFx0XHRcdFx0aWYgKHJlZ2V4Mi50ZXN0KHRlbXApKSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUodGVtcCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdncm91cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZXZlbnQgPj0gMCkge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSgnZXZlbnQnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XHJcblx0XHRcdFx0XHRGQi5hcGkoYC8ke3BhZ2VuYW1lfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0ZmJlcnJvciA9IHJlcy5lcnJvci5tZXNzYWdlO1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmb3JtYXQ6ICh1cmwpID0+IHtcclxuXHRcdGlmICh1cmwuaW5kZXhPZignYnVzaW5lc3MuZmFjZWJvb2suY29tLycpID49IDApIHtcclxuXHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXdkYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBzdGFydFRpbWUsIGVuZFRpbWUpID0+IHtcclxuXHRcdGxldCBkYXRhID0gcmF3ZGF0YS5kYXRhO1xyXG5cdFx0aWYgKHdvcmQgIT09ICcnKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmICgocmF3ZGF0YS5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IHJhd2RhdGEuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgc3RhcnRUaW1lLCBlbmRUaW1lKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9LFxyXG5cdHVuaXF1ZTogKGRhdGEpID0+IHtcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0aWYgKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCkgPT4ge1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpZiAobi5zdG9yeS5pbmRleE9mKHdvcmQpID4gLTEpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKSA9PiB7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncykge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgc3QsIHQpID0+IHtcclxuXHRcdGxldCB0aW1lX2FyeTIgPSBzdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCBlbmR0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLCAocGFyc2VJbnQodGltZV9hcnlbMV0pIC0gMSksIHRpbWVfYXJ5WzJdLCB0aW1lX2FyeVszXSwgdGltZV9hcnlbNF0sIHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgc3RhcnR0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5MlswXSwgKHBhcnNlSW50KHRpbWVfYXJ5MlsxXSkgLSAxKSwgdGltZV9hcnkyWzJdLCB0aW1lX2FyeTJbM10sIHRpbWVfYXJ5Mls0XSwgdGltZV9hcnkyWzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoKGNyZWF0ZWRfdGltZSA+IHN0YXJ0dGltZSAmJiBjcmVhdGVkX3RpbWUgPCBlbmR0aW1lKSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKSA9PiB7XHJcblx0XHRpZiAodGFyID09ICdhbGwnKSB7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpID0+IHtcclxuXHJcblx0fSxcclxuXHRhZGRMaW5rOiAoKSA9PiB7XHJcblx0XHRsZXQgdGFyID0gJCgnLmlucHV0YXJlYSAubW9yZWxpbmsnKTtcclxuXHRcdGlmICh0YXIuaGFzQ2xhc3MoJ3Nob3cnKSkge1xyXG5cdFx0XHR0YXIucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRhci5hZGRDbGFzcygnc2hvdycpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVzZXQ6ICgpID0+IHtcclxuXHRcdGxldCBjb21tYW5kID0gZGF0YS5yYXcuY29tbWFuZDtcclxuXHRcdGlmICgoY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBjb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKSB7XHJcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5sZXQgcGFnZV9zZWxlY3RvciA9IHtcclxuXHRwYWdlczogW10sXHJcblx0Z3JvdXBzOiBbXSxcclxuXHRzaG93OiAoKT0+e1xyXG5cdFx0JCgnLnBhZ2Vfc2VsZWN0b3InKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0cGFnZV9zZWxlY3Rvci5nZXRBZG1pbigpO1xyXG5cdH0sXHJcblx0Z2V0QWRtaW46ICgpPT57XHJcblx0XHRQcm9taXNlLmFsbChbcGFnZV9zZWxlY3Rvci5nZXRQYWdlKCksIHBhZ2Vfc2VsZWN0b3IuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0cGFnZV9zZWxlY3Rvci5nZW5BZG1pbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRQYWdlOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2FjY291bnRzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRHcm91cDogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9ncm91cHM/ZmllbGRzPW5hbWUsaWQsYWRtaW5pc3RyYXRvciZsaW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUgKHJlcy5kYXRhLmZpbHRlcihpdGVtPT57cmV0dXJuIGl0ZW0uYWRtaW5pc3RyYXRvciA9PT0gdHJ1ZX0pKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbkFkbWluOiAocmVzKT0+e1xyXG5cdFx0bGV0IHBhZ2VzID0gJyc7XHJcblx0XHRsZXQgZ3JvdXBzID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzWzBdKXtcclxuXHRcdFx0cGFnZXMgKz0gYDxkaXYgY2xhc3M9XCJwYWdlX2J0blwiIGRhdGEtdHlwZT1cIjFcIiBkYXRhLXZhbHVlPVwiJHtpLmlkfVwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBhZ2UodGhpcylcIj4ke2kubmFtZX08L2Rpdj5gO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBpIG9mIHJlc1sxXSl7XHJcblx0XHRcdGdyb3VwcyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgZGF0YS10eXBlPVwiMlwiIGRhdGEtdmFsdWU9XCIke2kuaWR9XCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UGFnZSh0aGlzKVwiPiR7aS5uYW1lfTwvZGl2PmA7XHJcblx0XHR9XHJcblx0XHQkKCcuc2VsZWN0X3BhZ2UnKS5odG1sKHBhZ2VzKTtcclxuXHRcdCQoJy5zZWxlY3RfZ3JvdXAnKS5odG1sKGdyb3Vwcyk7XHJcblx0fSxcclxuXHRzZWxlY3RQYWdlOiAodGFyZ2V0KT0+e1xyXG5cdFx0bGV0IHBhZ2VfaWQgPSAkKHRhcmdldCkuZGF0YSgndmFsdWUnKTtcclxuXHRcdCQoJyNwb3N0X3RhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHQkKCcuZmJfbG9hZGluZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRGQi5hcGkoYC8ke3BhZ2VfaWR9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKSB7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VfaWR9L2xpdmVfdmlkZW9zP2ZpZWxkcz1zdGF0dXMscGVybWFsaW5rX3VybCx0aXRsZSxjcmVhdGlvbl90aW1lYCwgKHJlcyk9PntcclxuXHRcdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRcdGZvcihsZXQgdHIgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdGlmICh0ci5zdGF0dXMgPT09ICdMSVZFJyl7XHJcblx0XHRcdFx0XHR0aGVhZCArPSBgPHRyPjx0ZD48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbmNsaWNrPVwicGFnZV9zZWxlY3Rvci5zZWxlY3RQb3N0KCcke3RyLmlkfScpXCI+6YG45pOH6LK85paHPC9idXR0b24+KExJVkUpPC90ZD48dGQ+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbSR7dHIucGVybWFsaW5rX3VybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3RyLnRpdGxlfTwvYT48L3RkPjx0ZD4ke3RpbWVDb252ZXJ0ZXIodHIuY3JlYXRlZF90aW1lKX08L3RkPjwvdHI+YDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRoZWFkICs9IGA8dHI+PHRkPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBvc3QoJyR7dHIuaWR9JylcIj7pgbjmk4fosrzmloc8L2J1dHRvbj48L3RkPjx0ZD48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tJHt0ci5wZXJtYWxpbmtfdXJsfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dHIudGl0bGV9PC9hPjwvdGQ+PHRkPiR7dGltZUNvbnZlcnRlcih0ci5jcmVhdGVkX3RpbWUpfTwvdGQ+PC90cj5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQkKCcjcG9zdF90YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0fSk7XHJcblx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VfaWR9L2ZlZWQ/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0JCgnLmZiX2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdFx0Zm9yKGxldCB0ciBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0dGJvZHkgKz0gYDx0cj48dGQ+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UG9zdCgnJHt0ci5pZH0nKVwiPumBuOaTh+iyvOaWhzwvYnV0dG9uPjwvdGQ+PHRkPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt0ci5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3RyLm1lc3NhZ2V9PC9hPjwvdGQ+PHRkPiR7dGltZUNvbnZlcnRlcih0ci5jcmVhdGVkX3RpbWUpfTwvdGQ+PC90cj5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJyNwb3N0X3RhYmxlIHRib2R5JykuaHRtbCh0Ym9keSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHNlbGVjdFBvc3Q6IChmYmlkKT0+e1xyXG5cdFx0JCgnLnBhZ2Vfc2VsZWN0b3InKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnNlbGVjdF9wYWdlJykuaHRtbCgnJyk7XHJcblx0XHQkKCcuc2VsZWN0X2dyb3VwJykuaHRtbCgnJyk7XHJcblx0XHQkKCcjcG9zdF90YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0bGV0IGlkID0gJ1wiJytmYmlkKydcIic7XHJcblx0XHQkKCcjZW50ZXJVUkwgLnVybCcpLnZhbChpZCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpIHtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpICsgMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBkYXRlICsgXCItXCIgKyBob3VyICsgXCItXCIgKyBtaW4gKyBcIi1cIiArIHNlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCkge1xyXG5cdHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuXHR2YXIgbW9udGhzID0gWycwMScsICcwMicsICcwMycsICcwNCcsICcwNScsICcwNicsICcwNycsICcwOCcsICcwOScsICcxMCcsICcxMScsICcxMiddO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0aWYgKGRhdGUgPCAxMCkge1xyXG5cdFx0ZGF0ZSA9IFwiMFwiICsgZGF0ZTtcclxuXHR9XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdGlmIChtaW4gPCAxMCkge1xyXG5cdFx0bWluID0gXCIwXCIgKyBtaW47XHJcblx0fVxyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRpZiAoc2VjIDwgMTApIHtcclxuXHRcdHNlYyA9IFwiMFwiICsgc2VjO1xyXG5cdH1cclxuXHR2YXIgdGltZSA9IHllYXIgKyAnLScgKyBtb250aCArICctJyArIGRhdGUgKyBcIiBcIiArIGhvdXIgKyAnOicgKyBtaW4gKyAnOicgKyBzZWM7XHJcblx0cmV0dXJuIHRpbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9iajJBcnJheShvYmopIHtcclxuXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBbdmFsdWVdO1xyXG5cdH0pO1xyXG5cdHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG5cdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgaSwgciwgdDtcclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRhcnlbaV0gPSBpO1xyXG5cdH1cclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcblx0XHR0ID0gYXJ5W3JdO1xyXG5cdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG5cdFx0YXJ5W2ldID0gdDtcclxuXHR9XHJcblx0cmV0dXJuIGFyeTtcclxufVxyXG5cclxuZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcblx0Ly9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuXHR2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcblxyXG5cdHZhciBDU1YgPSAnJztcclxuXHQvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuXHJcblx0Ly8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG5cdC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcblx0aWYgKFNob3dMYWJlbCkge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG5cclxuXHRcdFx0Ly9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuXHRcdFx0cm93ICs9IGluZGV4ICsgJywnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcblxyXG5cdFx0Ly9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0Ly8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuXHRcdFx0cm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0Ly9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHRpZiAoQ1NWID09ICcnKSB7XHJcblx0XHRhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuXHR2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG5cdC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG5cdGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZywgXCJfXCIpO1xyXG5cclxuXHQvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG5cdHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcblxyXG5cdC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG5cdC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcblx0Ly8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcblx0Ly8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuXHJcblx0Ly90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcblx0bGluay5ocmVmID0gdXJpO1xyXG5cclxuXHQvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG5cdGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcblx0bGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcblxyXG5cdC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHRsaW5rLmNsaWNrKCk7XHJcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
