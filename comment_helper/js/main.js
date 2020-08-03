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
		FB.login(function (response) {
			fb.extensionCallback(response);
		}, {
			scope: config.auth,
			return_scopes: true
		});
	},
	extensionCallback: function extensionCallback(response) {
		if (response.status === 'connected') {
			config.from_extension = true;
			auth_scope = response.authResponse.grantedScopes;
			FB.api('/me?fields=id,name', function (res) {
				$.get('https://script.google.com/macros/s/AKfycbxaGXkaOzT2ADCC8r-A4qBMg69Wz_168AHEr0fZ/exec?id=' + res.id, function (res) {
					if (res === true) {
						fb.authOK();
					} else {
						swal({
							title: '抓分享需付費，詳情請見粉絲專頁',
							html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwiZmJlcnJvciIsIndpbmRvdyIsIm9uZXJyb3IiLCJoYW5kbGVFcnIiLCJUQUJMRSIsImxhc3RDb21tYW5kIiwiYWRkTGluayIsImF1dGhfc2NvcGUiLCJtc2ciLCJ1cmwiLCJsIiwiJCIsInZhbCIsImNvbnNvbGUiLCJsb2ciLCJhcHBlbmQiLCJmYWRlSW4iLCJkb2N1bWVudCIsInJlYWR5IiwiaGFzaCIsImxvY2F0aW9uIiwic2VhcmNoIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwiZGF0YSIsImV4dGVuc2lvbiIsImNsaWNrIiwiZSIsImZiIiwiZXh0ZW5zaW9uQXV0aCIsImRhdGFzIiwiY29tbWFuZCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsInJhbmtlciIsInJhdyIsImZpbmlzaCIsImdldEF1dGgiLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJsaWtlcyIsImNob29zZSIsImluaXQiLCJ1aSIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJmaWx0ZXIiLCJyZWFjdCIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJzdGFydFRpbWUiLCJmb3JtYXQiLCJlbmRUaW1lIiwic2V0U3RhcnREYXRlIiwiZmlsdGVyRGF0YSIsImV4cG9ydFRvSnNvbkZpbGUiLCJleGNlbFN0cmluZyIsImV4Y2VsIiwic3RyaW5naWZ5IiwiY2lfY291bnRlciIsImZyb21fZXh0ZW5zaW9uIiwiaW1wb3J0IiwiZmlsZXMiLCJqc29uRGF0YSIsImRhdGFTdHIiLCJkYXRhVXJpIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiZXhwb3J0RmlsZURlZmF1bHROYW1lIiwibGlua0VsZW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwic2hhcmVCVE4iLCJhbGVydCIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJub3dEYXRlIiwiYXV0aCIsInBhZ2VUb2tlbiIsInVzZXJUb2tlbiIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJhdXRoX3R5cGUiLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJhY2Nlc3NUb2tlbiIsImdyYW50ZWRTY29wZXMiLCJhcGkiLCJyZXMiLCJvYmoiLCJ0b2tlbiIsInVzZXJuYW1lIiwibmFtZSIsImFwcF9zY29wZV9pZCIsImlkIiwicG9zdCIsIm1lc3NhZ2UiLCJjb2RlIiwicGFnZV9zZWxlY3RvciIsInNob3ciLCJmYmlkIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJnZXQiLCJhdXRoT0siLCJzd2FsIiwidGl0bGUiLCJodG1sIiwiZG9uZSIsInBvc3RkYXRhIiwidXNlcmlkIiwibm93TGVuZ3RoIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJ0aGVuIiwiaSIsInB1c2giLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2VfYXJyYXkiLCJwdXJlSUQiLCJ0b1N0cmluZyIsImxlbmd0aCIsImQiLCJmcm9tIiwidXBkYXRlZF90aW1lIiwiY3JlYXRlZF90aW1lIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwiaW5jbHVkZXMiLCJyZXNldCIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwiZmlsdGVyZWQiLCJuZXdPYmoiLCJlYWNoIiwidG1wIiwicG9zdGxpbmsiLCJzdG9yeSIsInRpbWVDb252ZXJ0ZXIiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50Iiwic3RyIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsInBpYyIsImhvc3QiLCJlbnRyaWVzIiwiaiIsInBpY3R1cmUiLCJ0ZCIsInNjb3JlIiwibGlrZV9jb3VudCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInZhbHVlIiwiZHJhdyIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsIm4iLCJwYXJzZUludCIsImZpbmQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsIm1hcCIsImluZGV4Iiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwibm93IiwiayIsInRhciIsImVxIiwiaW5zZXJ0QmVmb3JlIiwiZ2VuX2JpZ19hd2FyZCIsImxpIiwiYXdhcmRzIiwiaGFzQXR0cmlidXRlIiwiYXdhcmRfbmFtZSIsImF0dHIiLCJsaW5rIiwidGltZSIsImNsb3NlX2JpZ19hd2FyZCIsImVtcHR5Iiwic3Vic3RyaW5nIiwicmVnZXgiLCJuZXd1cmwiLCJzdWJzdHIiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsInZpZGVvIiwibGl2ZV9zdGF0dXMiLCJlcnJvciIsImFjY2Vzc190b2tlbiIsInBvc3R1cmwiLCJyZWdleDIiLCJ0ZW1wIiwidGVzdCIsInBhZ2VuYW1lIiwidGFnIiwidW5pcXVlIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsInVuZGVmaW5lZCIsIm1lc3NhZ2VfdGFncyIsInN0IiwidCIsInRpbWVfYXJ5MiIsInNwbGl0IiwidGltZV9hcnkiLCJlbmR0aW1lIiwibW9tZW50IiwiRGF0ZSIsIl9kIiwic3RhcnR0aW1lIiwicGFnZXMiLCJncm91cHMiLCJnZXRBZG1pbiIsImFsbCIsImdldFBhZ2UiLCJnZXRHcm91cCIsImdlbkFkbWluIiwiYWRtaW5pc3RyYXRvciIsInNlbGVjdFBhZ2UiLCJwYWdlX2lkIiwicGVybWFsaW5rX3VybCIsInNlbGVjdFBvc3QiLCJhIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJyb3ciLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0EsSUFBSUMsVUFBVSxFQUFkO0FBQ0FDLE9BQU9DLE9BQVAsR0FBaUJDLFNBQWpCO0FBQ0EsSUFBSUMsS0FBSjtBQUNBLElBQUlDLGNBQWMsVUFBbEI7QUFDQSxJQUFJQyxVQUFVLEtBQWQ7QUFDQSxJQUFJQyxhQUFhLEVBQWpCOztBQUVBLFNBQVNKLFNBQVQsQ0FBbUJLLEdBQW5CLEVBQXdCQyxHQUF4QixFQUE2QkMsQ0FBN0IsRUFBZ0M7QUFDL0IsS0FBSSxDQUFDWCxZQUFMLEVBQW1CO0FBQ2xCLE1BQUlVLE9BQU1FLEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQVY7QUFDQUMsVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWlELDRCQUFqRDtBQUNBRCxVQUFRQyxHQUFSLENBQVksc0JBQXNCTCxJQUFsQztBQUNBRSxJ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RixNQUFLMEYsUUFBTCxHQUFnQkwsV0FBVyxNQUEzQjs7QUFFQTtBQUNBOVMsVUFBU29ULElBQVQsQ0FBY0MsV0FBZCxDQUEwQjVGLElBQTFCO0FBQ0FBLE1BQUtoTixLQUFMO0FBQ0FULFVBQVNvVCxJQUFULENBQWNFLFdBQWQsQ0FBMEI3RixJQUExQjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbnZhciBmYmVycm9yID0gJyc7XHJcbndpbmRvdy5vbmVycm9yID0gaGFuZGxlRXJyO1xyXG52YXIgVEFCTEU7XHJcbnZhciBsYXN0Q29tbWFuZCA9ICdjb21tZW50cyc7XHJcbnZhciBhZGRMaW5rID0gZmFsc2U7XHJcbnZhciBhdXRoX3Njb3BlID0gJyc7XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLCB1cmwsIGwpIHtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSkge1xyXG5cdFx0bGV0IHVybCA9ICQoJyNlbnRlclVSTCAudXJsJykudmFsKCk7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsIFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArIHVybCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmFwcGVuZChgPGJyPjxicj4ke2ZiZXJyb3J9PGJyPjxicj4ke3VybH1gKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uc2VhcmNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJleHRlbnNpb25cIikgPj0gMCkge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRkYXRhLmV4dGVuc2lvbiA9IHRydWU7XHJcblxyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aCBidXR0b25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJyYW5rZXJcIikgPj0gMCkge1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiAncmFua2VyJyxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucmFua2VyKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcblxyXG5cdCQoXCIjYnRuX3BhZ2Vfc2VsZWN0b3JcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGZiLmdldEF1dGgoJ3BhZ2Vfc2VsZWN0b3InKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9sb2dpblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgncGFnZV9zZWxlY3RvcicpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLmxpa2VzID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRmYi5nZXRBdXRoKCd1cmxfY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHQkKFwiI21vcmVwb3N0XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdHVpLmFkZExpbmsoKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLopIfoo73ooajmoLzlhaflrrlcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS9NTS9ERCBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSwgZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLnN0YXJ0VGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gZW5kLmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUoY29uZmlnLmZpbHRlci5zdGFydFRpbWUpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRleHBvcnRUb0pzb25GaWxlKGZpbHRlckRhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gaWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCkge1xyXG5cdFx0XHQvLyBcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQvLyB9IGVsc2Uge1xyXG5cdFx0XHQvLyBcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGEpLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpIHtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRjb25maWcuZnJvbV9leHRlbnNpb24gPSB0cnVlO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZXhwb3J0VG9Kc29uRmlsZShqc29uRGF0YSkge1xyXG4gICAgbGV0IGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShqc29uRGF0YSk7XHJcbiAgICBsZXQgZGF0YVVyaSA9ICdkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCwnKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVN0cik7XHJcbiAgICBcclxuICAgIGxldCBleHBvcnRGaWxlRGVmYXVsdE5hbWUgPSAnZGF0YS5qc29uJztcclxuICAgIFxyXG4gICAgbGV0IGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgZGF0YVVyaSk7XHJcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZXhwb3J0RmlsZURlZmF1bHROYW1lKTtcclxuICAgIGxpbmtFbGVtZW50LmNsaWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNoYXJlQlROKCkge1xyXG5cdGFsZXJ0KCfoqo3nnJ/nnIvlrozot7Plh7rkvobnmoTpgqPpoIHkuIrpnaLlr6vkuobku4DpurxcXG5cXG7nnIvlrozkvaDlsLHmnIPnn6XpgZPkvaDngrrku4DpurzkuI3og73mipPliIbkuqsnKTtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsICdtZXNzYWdlX3RhZ3MnLCAnbWVzc2FnZScsICdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCAnZnJvbScsICdtZXNzYWdlJywgJ3N0b3J5J10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzE1JyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjcuMCcsXHJcblx0XHRyZWFjdGlvbnM6ICd2Ny4wJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjcuMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Ny4wJyxcclxuXHRcdGZlZWQ6ICd2Ny4wJyxcclxuXHRcdGdyb3VwOiAndjcuMCcsXHJcblx0XHRuZXdlc3Q6ICd2Ny4wJ1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdHN0YXJ0VGltZTogJzIwMDAtMTItMzEtMDAtMDAtMDAnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRvcmRlcjogJ2Nocm9ub2xvZ2ljYWwnLFxyXG5cdGF1dGg6ICdncm91cHNfc2hvd19saXN0LCBwYWdlc19zaG93X2xpc3QsIHBhZ2VzX3JlYWRfZW5nYWdlbWVudCwgcGFnZXNfcmVhZF91c2VyX2NvbnRlbnQnLFxyXG5cdGxpa2VzOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG5cdHVzZXJUb2tlbjogJycsXHJcblx0ZnJvbV9leHRlbnNpb246IGZhbHNlLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJykgPT4ge1xyXG5cdFx0aWYgKHR5cGUgPT09ICcnKSB7XHJcblx0XHRcdGFkZExpbmsgPSB0cnVlO1xyXG5cdFx0XHR0eXBlID0gbGFzdENvbW1hbmQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZGRMaW5rID0gZmFsc2U7XHJcblx0XHRcdGxhc3RDb21tYW5kID0gdHlwZTtcclxuXHRcdH1cclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcgLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0Ly8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLnVzZXJUb2tlbiA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5hY2Nlc3NUb2tlbjtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRjb25maWcuZnJvbV9leHRlbnNpb24gPSBmYWxzZTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKSB7XHJcblx0XHRcdFx0Ly8gaWYgKGF1dGhfc2NvcGUuaW5jbHVkZXMoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSl7XHJcblx0XHRcdFx0Ly8gXHRzd2FsKFxyXG5cdFx0XHRcdC8vIFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcclxuXHRcdFx0XHQvLyBcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxyXG5cdFx0XHRcdC8vIFx0XHQnc3VjY2VzcydcclxuXHRcdFx0XHQvLyBcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdC8vIH1lbHNle1xyXG5cdFx0XHRcdC8vIFx0c3dhbChcclxuXHRcdFx0XHQvLyBcdFx0J+S7mOiyu+aOiOasiuaqouafpemMr+iqpO+8jOipsuWKn+iDvemcgOS7mOiyuycsXHJcblx0XHRcdFx0Ly8gXHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgSXQgaXMgYSBwYWlkIGZlYXR1cmUuJyxcclxuXHRcdFx0XHQvLyBcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdC8vIFx0KS5kb25lKCk7XHJcblx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdEZCLmFwaShgL21lP2ZpZWxkcz1pZCxuYW1lYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0dG9rZW46IC0xLFxyXG5cdFx0XHRcdFx0XHR1c2VybmFtZTogcmVzLm5hbWUsXHJcblx0XHRcdFx0XHRcdGFwcF9zY29wZV9pZDogcmVzLmlkXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkLnBvc3QoJ2h0dHBzOi8vc2NyaXB0Lmdvb2dsZS5jb20vbWFjcm9zL3MvQUtmeWNieGFHWGthT3pUMkFEQ0M4ci1BNHFCTWc2OVd6XzE2OEFIRXIwZlovZXhlYycsIG9iaiwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdFx0YWxlcnQocmVzLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmNvZGUgPT0gMSl7XHJcblx0XHRcdFx0XHRcdFx0Ly8gbG9jYXRpb24uaHJlZiA9IFwiaW5kZXguaHRtbFwiO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09IFwicGFnZV9zZWxlY3RvclwiKSB7XHRcclxuXHRcdFx0XHRwYWdlX3NlbGVjdG9yLnNob3coKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmYi51c2VyX3Bvc3RzID0gdHJ1ZTtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQXV0aDogKCkgPT4ge1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdH0sIHtcclxuXHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkNhbGxiYWNrOiAocmVzcG9uc2UpID0+IHtcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRcdGF1dGhfc2NvcGUgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0RkIuYXBpKGAvbWU/ZmllbGRzPWlkLG5hbWVgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0JC5nZXQoJ2h0dHBzOi8vc2NyaXB0Lmdvb2dsZS5jb20vbWFjcm9zL3MvQUtmeWNieGFHWGthT3pUMkFEQ0M4ci1BNHFCTWc2OVd6XzE2OEFIRXIwZlovZXhlYz9pZD0nK3Jlcy5pZCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGlmIChyZXMgPT09IHRydWUpe1xyXG5cdFx0XHRcdFx0XHRmYi5hdXRoT0soKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRcdFx0aHRtbDogJzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YXV0aE9LOiAoKSA9PiB7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGxldCBwb3N0ZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnBvc3RkYXRhKTtcclxuXHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0Y29tbWFuZDogcG9zdGRhdGEuY29tbWFuZCxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZSgkKFwiLmNocm9tZVwiKS52YWwoKSlcclxuXHRcdH1cclxuXHRcdGRhdGEucmF3ID0gZGF0YXM7XHJcblx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IFtdLFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5bos4fmlpnkuK0uLi4nKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGlmICghYWRkTGluaykge1xyXG5cdFx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JCgnLnB1cmVfZmJpZCcpLnRleHQoZmJpZC5mdWxsSUQpO1xyXG5cdFx0ZGF0YS5nZXQoZmJpZCkudGhlbigocmVzKSA9PiB7XHJcblx0XHRcdC8vIGZiaWQuZGF0YSA9IHJlcztcclxuXHRcdFx0Zm9yIChsZXQgaSBvZiByZXMpIHtcclxuXHRcdFx0XHRmYmlkLmRhdGEucHVzaChpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhLmZpbmlzaChmYmlkKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gZmJpZC5jb21tYW5kO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRmYmlkLmZ1bGxJRCA9IGZiaWQucHVyZUlEO1xyXG5cdFx0XHRcdGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcgJiYgZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnKSB7XHJcblx0XHRcdFx0ZmJpZC5mdWxsSUQgPSBmYmlkLnB1cmVJRDtcclxuXHRcdFx0XHRmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjb25maWcubGlrZXMpIGZiaWQuY29tbWFuZCA9ICdsaWtlcyc7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mZGVidWc9YWxsYCk7XHJcblx0XHRcdGxldCB0b2tlbiA9IGNvbmZpZy5wYWdlVG9rZW4gPT0gJycgPyBgJmFjY2Vzc190b2tlbj0ke2NvbmZpZy51c2VyVG9rZW59YDpgJmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59YDtcclxuXHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19Jm9yZGVyPSR7Y29uZmlnLm9yZGVyfSZmaWVsZHM9JHtjb25maWcuZmllbGRbZmJpZC5jb21tYW5kXS50b1N0cmluZygpfSR7dG9rZW59JmRlYnVnPWFsbGAsIChyZXMpID0+IHtcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJyArIGRhdGEubm93TGVuZ3RoICsgJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRpZiAoKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBmYmlkLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBkLm5hbWVcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChjb25maWcubGlrZXMpIGQudHlwZSA9IFwiTElLRVwiO1xyXG5cdFx0XHRcdFx0aWYgKGQuZnJvbSkge1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogZC5pZFxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0ID0gMCkge1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsICdsaW1pdD0nICsgbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZC5pZCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICgoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGZiaWQuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGQubmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYgKGQuZnJvbSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0Ly8gaWYgKGRhdGEubm93TGVuZ3RoIDwgMTgwKSB7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCkgPT4ge1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZmJpZCkgPT4ge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLnVwZGF0ZV9hcmVhLC5kb25hdGVfYXJlYVwiKS5zbGlkZVVwKCk7XHJcblx0XHQkKFwiLnJlc3VsdF9hcmVhXCIpLnNsaWRlRG93bigpO1xyXG5cdFx0aWYgKGRhdGEucmF3LnR5cGUgPT0gJ2dyb3VwJyl7XHJcblx0XHRcdGlmIChhdXRoX3Njb3BlLmluY2x1ZGVzKCdncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJykpe1xyXG5cdFx0XHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0XHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdFx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0XHRcdFx0dWkucmVzZXQoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdCfku5josrvmjojmrIrmqqLmn6XpjK/oqqTvvIzmipPnpL7lnJjosrzmlofpnIDku5josrsnLFxyXG5cdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBJdCBpcyBhIHBhaWQgZmVhdHVyZS4nLFxyXG5cdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdFx0XHR1aS5yZXNldCgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSkgPT4ge1xyXG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdC8vIGlmIChjb25maWcuZnJvbV9leHRlbnNpb24gPT09IGZhbHNlICYmIHJhd0RhdGEuY29tbWFuZCA9PT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0Ly8gXHRyYXdEYXRhLmRhdGEgPSByYXdEYXRhLmRhdGEuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0Ly8gXHRcdHJldHVybiBpdGVtLmlzX2hpZGRlbiA9PT0gZmFsc2VcclxuXHRcdC8vIFx0fSk7XHJcblx0XHQvLyB9XHJcblx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHJcblx0XHRyYXdEYXRhLmZpbHRlcmVkID0gbmV3RGF0YTtcclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShyYXdEYXRhKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiByYXdEYXRhO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpID0+IHtcclxuXHRcdHZhciBuZXdPYmogPSBbXTtcclxuXHRcdGNvbnNvbGUubG9nKHJhdyk7XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pIHtcclxuXHRcdFx0aWYgKHJhdy5jb21tYW5kID09ICdjb21tZW50cycpIHtcclxuXHRcdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA6YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMubWVzc2FnZSxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiOiB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi6KGo5oOFXCI6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIjogdGltZUNvbnZlcnRlcih0aGlzLmNyZWF0ZWRfdGltZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3T2JqO1xyXG5cdH0sXHJcblx0aW1wb3J0OiAoZmlsZSkgPT4ge1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHRcdFx0ZGF0YS5yYXcgPSBKU09OLnBhcnNlKHN0cik7XHJcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpID0+IHtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZmlsdGVyZGF0YSA9IHJhd2RhdGEuZmlsdGVyZWQ7XHJcblx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0bGV0IHBpYyA9ICQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGlmICgocmF3ZGF0YS5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IHJhd2RhdGEuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+6KGo5oOFPC90ZD5gO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5o6S5ZCNPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7liIbmlbg8L3RkPmA7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHQ8dGQ+6K6aPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBob3N0ID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nO1xyXG5cdFx0aWYgKGRhdGEucmF3LnR5cGUgPT09ICd1cmxfY29tbWVudHMnKSBob3N0ID0gJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSArICc/ZmJfY29tbWVudF9pZD0nO1xyXG5cclxuXHRcdGZvciAobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmRhdGEuZW50cmllcygpKSB7XHJcblx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdGlmIChwaWMpIHtcclxuXHRcdFx0XHRwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdGlmICgocmF3ZGF0YS5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IHJhd2RhdGEuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpIHtcclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJykge1xyXG5cdFx0XHRcdHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdFx0ICA8dGQ+PGEgaHJlZj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHQgIDx0ZD4ke3ZhbC5zY29yZX08L3RkPmA7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IHBvc3RsaW5rID0gaG9zdCArIHZhbC5pZDtcclxuXHRcdFx0XHRpZiAoY29uZmlnLmZyb21fZXh0ZW5zaW9uKSB7XHJcblx0XHRcdFx0XHRwb3N0bGluayA9IHZhbC5wb3N0bGluaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cIiR7cG9zdGxpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblxyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpIHtcclxuXHRcdFx0VEFCTEUgPSAkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JChcIiNzZWFyY2hOYW1lXCIpLm9uKCdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUQUJMRVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQkKFwiI3NlYXJjaENvbW1lbnRcIikub24oJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpID0+IHtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjaG9vc2UgPSB7XHJcblx0ZGF0YTogW10sXHJcblx0YXdhcmQ6IFtdLFxyXG5cdG51bTogMCxcclxuXHRkZXRhaWw6IGZhbHNlLFxyXG5cdGxpc3Q6IFtdLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcclxuXHRcdGNob29zZS5saXN0ID0gW107XHJcblx0XHRjaG9vc2UubnVtID0gMDtcclxuXHRcdGlmICgkKFwiI3NlYXJjaENvbW1lbnRcIikudmFsKCkgIT0gJycpIHtcclxuXHRcdFx0dGFibGUucmVkbygpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApIHtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XCJuYW1lXCI6IHAsXHJcblx0XHRcdFx0XHRcdFwibnVtXCI6IG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKCk7XHJcblx0fSxcclxuXHRnbzogKCkgPT4ge1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGEuZmlsdGVyZWQubGVuZ3RoKS5zcGxpY2UoMCwgY2hvb3NlLm51bSk7XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRjaG9vc2UuYXdhcmQubWFwKCh2YWwsIGluZGV4KSA9PiB7XHJcblx0XHRcdGluc2VydCArPSAnPHRyIHRpdGxlPVwi56ysJyArIChpbmRleCArIDEpICsgJ+WQjVwiPicgKyAkKCcubWFpbl90YWJsZScpLkRhdGFUYWJsZSgpLnJvd3Moe1xyXG5cdFx0XHRcdHNlYXJjaDogJ2FwcGxpZWQnXHJcblx0XHRcdH0pLm5vZGVzKClbdmFsXS5pbm5lckhUTUwgKyAnPC90cj4nO1xyXG5cdFx0fSlcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKGluc2VydCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHJcblx0XHRpZiAoY2hvb3NlLmRldGFpbCkge1xyXG5cdFx0XHRsZXQgbm93ID0gMDtcclxuXHRcdFx0Zm9yIChsZXQgayBpbiBjaG9vc2UubGlzdCkge1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiNVwiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcclxuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fSxcclxuXHRnZW5fYmlnX2F3YXJkOiAoKSA9PiB7XHJcblx0XHRsZXQgbGkgPSAnJztcclxuXHRcdGxldCBhd2FyZHMgPSBbXTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGJvZHkgdHInKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgdmFsKSB7XHJcblx0XHRcdGxldCBhd2FyZCA9IHt9O1xyXG5cdFx0XHRpZiAodmFsLmhhc0F0dHJpYnV0ZSgndGl0bGUnKSkge1xyXG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSBmYWxzZTtcclxuXHRcdFx0XHRhd2FyZC5uYW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC51c2VyaWQgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgxKS5maW5kKCdhJykuYXR0cignaHJlZicpLnJlcGxhY2UoJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nLCAnJyk7XHJcblx0XHRcdFx0YXdhcmQubWVzc2FnZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDIpLmZpbmQoJ2EnKS50ZXh0KCk7XHJcblx0XHRcdFx0YXdhcmQubGluayA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDIpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJyk7XHJcblx0XHRcdFx0YXdhcmQudGltZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKCQodmFsKS5maW5kKCd0ZCcpLmxlbmd0aCAtIDEpLnRleHQoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhd2FyZC5hd2FyZF9uYW1lID0gdHJ1ZTtcclxuXHRcdFx0XHRhd2FyZC5uYW1lID0gJCh2YWwpLmZpbmQoJ3RkJykudGV4dCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF3YXJkcy5wdXNoKGF3YXJkKTtcclxuXHRcdH0pO1xyXG5cdFx0Zm9yIChsZXQgaSBvZiBhd2FyZHMpIHtcclxuXHRcdFx0aWYgKGkuYXdhcmRfbmFtZSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdGxpICs9IGA8bGkgY2xhc3M9XCJwcml6ZU5hbWVcIj4ke2kubmFtZX08L2xpPmA7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGkgKz0gYDxsaT5cclxuXHRcdFx0XHQ8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+PGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfS9waWN0dXJlP3R5cGU9bGFyZ2UmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn1cIiBhbHQ9XCJcIj48L2E+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cImluZm9cIj5cclxuXHRcdFx0XHQ8cCBjbGFzcz1cIm5hbWVcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLm5hbWV9PC9hPjwvcD5cclxuXHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIj48YSBocmVmPVwiJHtpLmxpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLm1lc3NhZ2V9PC9hPjwvcD5cclxuXHRcdFx0XHQ8cCBjbGFzcz1cInRpbWVcIj48YSBocmVmPVwiJHtpLmxpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLnRpbWV9PC9hPjwvcD5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2xpPmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJy5iaWdfYXdhcmQgdWwnKS5hcHBlbmQobGkpO1xyXG5cdFx0JCgnLmJpZ19hd2FyZCcpLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0fSxcclxuXHRjbG9zZV9iaWdfYXdhcmQ6ICgpID0+IHtcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmVtcHR5KCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmJpZCA9IHtcclxuXHRmYmlkOiBbXSxcclxuXHRpbml0OiAodHlwZSkgPT4ge1xyXG5cdFx0ZmJpZC5mYmlkID0gW107XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdEZCLmFwaShcIi9tZVwiLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdGRhdGEudXNlcmlkID0gcmVzLmlkO1xyXG5cdFx0XHRsZXQgdXJsID0gJyc7XHJcblx0XHRcdGlmIChhZGRMaW5rKSB7XHJcblx0XHRcdFx0dXJsID0gZmJpZC5mb3JtYXQoJCgnLm1vcmVsaW5rIC5hZGR1cmwnKS52YWwoKSk7XHJcblx0XHRcdFx0JCgnLm1vcmVsaW5rIC5hZGR1cmwnKS52YWwoJycpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHVybCA9IGZiaWQuZm9ybWF0KCQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh1cmwuaW5kZXhPZignLnBocD8nKSA9PT0gLTEgJiYgdXJsLmluZGV4T2YoJz8nKSA+IDApIHtcclxuXHRcdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKCc/JykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZiaWQuZ2V0KHVybCwgdHlwZSkudGhlbigoZmJpZCkgPT4ge1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC8vICQoJy5pZGVudGl0eScpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChg55m75YWl6Lqr5Lu977yaPGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Jlcy5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PHNwYW4+JHtyZXMubmFtZX08L3NwYW4+YCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKHVybCwgdHlwZSkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0bGV0IG5ld3VybCA9IHVybC5zdWJzdHIodXJsLmluZGV4T2YoJy8nLCAyOCkgKyAxLCAyMDApO1xyXG5cdFx0XHQvLyBodHRwczovL3d3dy5mYWNlYm9vay5jb20vIOWFsTI15a2X5YWD77yM5Zug5q2k6YG4Mjjplovlp4vmib4vXHJcblx0XHRcdGxldCByZXN1bHQgPSBuZXd1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XHJcblx0XHRcdGZiaWQuY2hlY2tQYWdlSUQodXJsLCB1cmx0eXBlKS50aGVuKChpZCkgPT4ge1xyXG5cdFx0XHRcdGlmIChpZCA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XHJcblx0XHRcdFx0XHRpZCA9IGRhdGEudXNlcmlkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0cGFnZUlEOiBpZCxcclxuXHRcdFx0XHRcdHR5cGU6IHVybHR5cGUsXHJcblx0XHRcdFx0XHRjb21tYW5kOiB0eXBlLFxyXG5cdFx0XHRcdFx0ZGF0YTogW11cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmIChhZGRMaW5rKSBvYmouZGF0YSA9IGRhdGEucmF3LmRhdGE7IC8v6L+95Yqg6LK85paHXHJcblx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdmYmlkPScpO1xyXG5cdFx0XHRcdFx0aWYgKHN0YXJ0ID49IDApIHtcclxuXHRcdFx0XHRcdFx0bGV0IGVuZCA9IHVybC5pbmRleE9mKFwiJlwiLCBzdGFydCk7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0ICsgNSwgZW5kKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdwb3N0cy8nKTtcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQgKyA2LCB1cmwubGVuZ3RoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCB2aWRlbyA9IHVybC5pbmRleE9mKCd2aWRlb3MvJyk7XHJcblx0XHRcdFx0XHRpZiAodmlkZW8gPj0gMCkge1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3B1cmUnKSB7XHJcblx0XHRcdFx0XHRvYmouZnVsbElEID0gdXJsLnJlcGxhY2UoL1xcXCIvZywgJycpO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ2dyb3VwJykge1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgXCJfXCIgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAncGhvdG8nKSB7XHJcblx0XHRcdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICd2aWRlbycpIHtcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdEZCLmFwaShgLyR7b2JqLnB1cmVJRH0/ZmllbGRzPWxpdmVfc3RhdHVzYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXMubGl2ZV9zdGF0dXMgPT09ICdMSVZFJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdEZCLmFwaShgLyR7b2JqLnBhZ2VJRH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjaGVja1R5cGU6IChwb3N0dXJsKSA9PiB7XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCkge1xyXG5cdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdwZXJtYWxpbmsnKSA+PSAwKSB7XHJcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiAncGVyc29uYWwnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9ncm91cHMvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdncm91cCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImV2ZW50c1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAnZXZlbnQnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvcGhvdG9zL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAncGhvdG8nO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvdmlkZW9zL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAndmlkZW8nO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignXCInKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAncHVyZSc7XHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICdub3JtYWwnO1xyXG5cdH0sXHJcblx0Y2hlY2tQYWdlSUQ6IChwb3N0dXJsLCB0eXBlKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgc3RhcnQgPSBwb3N0dXJsLmluZGV4T2YoXCJmYWNlYm9vay5jb21cIikgKyAxMztcclxuXHRcdFx0bGV0IGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIiwgc3RhcnQpO1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRpZiAoZW5kIDwgMCkge1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ2ZiaWQ9JykgPj0gMCkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICd1bm5hbWUnKSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3VubmFtZScpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShwb3N0dXJsLm1hdGNoKHJlZ2V4KVsxXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBncm91cCA9IHBvc3R1cmwuaW5kZXhPZignL2dyb3Vwcy8nKTtcclxuXHRcdFx0XHRsZXQgZXZlbnQgPSBwb3N0dXJsLmluZGV4T2YoJy9ldmVudHMvJylcclxuXHRcdFx0XHRpZiAoZ3JvdXAgPj0gMCkge1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBncm91cCArIDg7XHJcblx0XHRcdFx0XHRlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsIHN0YXJ0KTtcclxuXHRcdFx0XHRcdGxldCByZWdleDIgPSAvXFxkezYsfS9nO1xyXG5cdFx0XHRcdFx0bGV0IHRlbXAgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcclxuXHRcdFx0XHRcdGlmIChyZWdleDIudGVzdCh0ZW1wKSkge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRlbXApO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgnZ3JvdXAnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYgKGV2ZW50ID49IDApIHtcclxuXHRcdFx0XHRcdHJlc29sdmUoJ2V2ZW50Jyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHZhciBwYWdlbmFtZSA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xyXG5cdFx0XHRcdFx0RkIuYXBpKGAvJHtwYWdlbmFtZX0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdGZiZXJyb3IgPSByZXMuZXJyb3IubWVzc2FnZTtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShyZXMuaWQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Zm9ybWF0OiAodXJsKSA9PiB7XHJcblx0XHRpZiAodXJsLmluZGV4T2YoJ2J1c2luZXNzLmZhY2Vib29rLmNvbS8nKSA+PSAwKSB7XHJcblx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3ZGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgc3RhcnRUaW1lLCBlbmRUaW1lKSA9PiB7XHJcblx0XHRsZXQgZGF0YSA9IHJhd2RhdGEuZGF0YTtcclxuXHRcdGlmICh3b3JkICE9PSAnJykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50YWcoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAoKHJhd2RhdGEuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCByYXdkYXRhLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIHN0YXJ0VGltZSwgZW5kVGltZSk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKSA9PiB7XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmIChrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0aWYgKG4uc3RvcnkuaW5kZXhPZih3b3JkKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSkgPT4ge1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3MpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHN0LCB0KSA9PiB7XHJcblx0XHRsZXQgdGltZV9hcnkyID0gc3Quc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgZW5kdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwgKHBhcnNlSW50KHRpbWVfYXJ5WzFdKSAtIDEpLCB0aW1lX2FyeVsyXSwgdGltZV9hcnlbM10sIHRpbWVfYXJ5WzRdLCB0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IHN0YXJ0dGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeTJbMF0sIChwYXJzZUludCh0aW1lX2FyeTJbMV0pIC0gMSksIHRpbWVfYXJ5MlsyXSwgdGltZV9hcnkyWzNdLCB0aW1lX2FyeTJbNF0sIHRpbWVfYXJ5Mls1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKChjcmVhdGVkX3RpbWUgPiBzdGFydHRpbWUgJiYgY3JlYXRlZF90aW1lIDwgZW5kdGltZSkgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIikge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcikgPT4ge1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJykge1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcikge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKSA9PiB7XHJcblxyXG5cdH0sXHJcblx0YWRkTGluazogKCkgPT4ge1xyXG5cdFx0bGV0IHRhciA9ICQoJy5pbnB1dGFyZWEgLm1vcmVsaW5rJyk7XHJcblx0XHRpZiAodGFyLmhhc0NsYXNzKCdzaG93JykpIHtcclxuXHRcdFx0dGFyLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YXIuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlc2V0OiAoKSA9PiB7XHJcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XHJcblx0XHRpZiAoKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpIHtcclxuXHRcdFx0JCgnbGFiZWwudGFnJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICgkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKSkge1xyXG5cdFx0XHRcdCQoXCIjdGFnXCIpLmNsaWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnbGFiZWwudGFnJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxubGV0IHBhZ2Vfc2VsZWN0b3IgPSB7XHJcblx0cGFnZXM6IFtdLFxyXG5cdGdyb3VwczogW10sXHJcblx0c2hvdzogKCk9PntcclxuXHRcdCQoJy5wYWdlX3NlbGVjdG9yJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdHBhZ2Vfc2VsZWN0b3IuZ2V0QWRtaW4oKTtcclxuXHR9LFxyXG5cdGdldEFkbWluOiAoKT0+e1xyXG5cdFx0UHJvbWlzZS5hbGwoW3BhZ2Vfc2VsZWN0b3IuZ2V0UGFnZSgpLCBwYWdlX3NlbGVjdG9yLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XHJcblx0XHRcdHBhZ2Vfc2VsZWN0b3IuZ2VuQWRtaW4ocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2ZpZWxkcz1uYW1lLGlkLGFkbWluaXN0cmF0b3ImbGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlIChyZXMuZGF0YS5maWx0ZXIoaXRlbT0+e3JldHVybiBpdGVtLmFkbWluaXN0cmF0b3IgPT09IHRydWV9KSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5BZG1pbjogKHJlcyk9PntcclxuXHRcdGxldCBwYWdlcyA9ICcnO1xyXG5cdFx0bGV0IGdyb3VwcyA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJlc1swXSl7XHJcblx0XHRcdHBhZ2VzICs9IGA8ZGl2IGNsYXNzPVwicGFnZV9idG5cIiBkYXRhLXR5cGU9XCIxXCIgZGF0YS12YWx1ZT1cIiR7aS5pZH1cIiBvbmNsaWNrPVwicGFnZV9zZWxlY3Rvci5zZWxlY3RQYWdlKHRoaXMpXCI+JHtpLm5hbWV9PC9kaXY+YDtcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiByZXNbMV0pe1xyXG5cdFx0XHRncm91cHMgKz0gYDxkaXYgY2xhc3M9XCJwYWdlX2J0blwiIGRhdGEtdHlwZT1cIjJcIiBkYXRhLXZhbHVlPVwiJHtpLmlkfVwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBhZ2UodGhpcylcIj4ke2kubmFtZX08L2Rpdj5gO1xyXG5cdFx0fVxyXG5cdFx0JCgnLnNlbGVjdF9wYWdlJykuaHRtbChwYWdlcyk7XHJcblx0XHQkKCcuc2VsZWN0X2dyb3VwJykuaHRtbChncm91cHMpO1xyXG5cdH0sXHJcblx0c2VsZWN0UGFnZTogKHRhcmdldCk9PntcclxuXHRcdGxldCBwYWdlX2lkID0gJCh0YXJnZXQpLmRhdGEoJ3ZhbHVlJyk7XHJcblx0XHQkKCcjcG9zdF90YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0JCgnLmZiX2xvYWRpbmcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0RkIuYXBpKGAvJHtwYWdlX2lkfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlX2lkfS9saXZlX3ZpZGVvcz9maWVsZHM9c3RhdHVzLHBlcm1hbGlua191cmwsdGl0bGUsY3JlYXRpb25fdGltZWAsIChyZXMpPT57XHJcblx0XHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0XHRmb3IobGV0IHRyIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRpZiAodHIuc3RhdHVzID09PSAnTElWRScpe1xyXG5cdFx0XHRcdFx0dGhlYWQgKz0gYDx0cj48dGQ+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UG9zdCgnJHt0ci5pZH0nKVwiPumBuOaTh+iyvOaWhzwvYnV0dG9uPihMSVZFKTwvdGQ+PHRkPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20ke3RyLnBlcm1hbGlua191cmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt0ci50aXRsZX08L2E+PC90ZD48dGQ+JHt0aW1lQ29udmVydGVyKHRyLmNyZWF0ZWRfdGltZSl9PC90ZD48L3RyPmA7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0aGVhZCArPSBgPHRyPjx0ZD48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbmNsaWNrPVwicGFnZV9zZWxlY3Rvci5zZWxlY3RQb3N0KCcke3RyLmlkfScpXCI+6YG45pOH6LK85paHPC9idXR0b24+PC90ZD48dGQ+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbSR7dHIucGVybWFsaW5rX3VybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3RyLnRpdGxlfTwvYT48L3RkPjx0ZD4ke3RpbWVDb252ZXJ0ZXIodHIuY3JlYXRlZF90aW1lKX08L3RkPjwvdHI+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnI3Bvc3RfdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdH0pO1xyXG5cdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlX2lkfS9mZWVkP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdCQoJy5mYl9sb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRcdGZvcihsZXQgdHIgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdHRib2R5ICs9IGA8dHI+PHRkPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBvc3QoJyR7dHIuaWR9JylcIj7pgbjmk4fosrzmloc8L2J1dHRvbj48L3RkPjx0ZD48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dHIuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt0ci5tZXNzYWdlfTwvYT48L3RkPjx0ZD4ke3RpbWVDb252ZXJ0ZXIodHIuY3JlYXRlZF90aW1lKX08L3RkPjwvdHI+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCcjcG9zdF90YWJsZSB0Ym9keScpLmh0bWwodGJvZHkpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzZWxlY3RQb3N0OiAoZmJpZCk9PntcclxuXHRcdCQoJy5wYWdlX3NlbGVjdG9yJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy5zZWxlY3RfcGFnZScpLmh0bWwoJycpO1xyXG5cdFx0JCgnLnNlbGVjdF9ncm91cCcpLmh0bWwoJycpO1xyXG5cdFx0JCgnI3Bvc3RfdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGxldCBpZCA9ICdcIicrZmJpZCsnXCInO1xyXG5cdFx0JCgnI2VudGVyVVJMIC51cmwnKS52YWwoaWQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKSB7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSArIDE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyICsgXCItXCIgKyBtb250aCArIFwiLVwiICsgZGF0ZSArIFwiLVwiICsgaG91ciArIFwiLVwiICsgbWluICsgXCItXCIgKyBzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApIHtcclxuXHR2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcblx0dmFyIG1vbnRocyA9IFsnMDEnLCAnMDInLCAnMDMnLCAnMDQnLCAnMDUnLCAnMDYnLCAnMDcnLCAnMDgnLCAnMDknLCAnMTAnLCAnMTEnLCAnMTInXTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdGlmIChkYXRlIDwgMTApIHtcclxuXHRcdGRhdGUgPSBcIjBcIiArIGRhdGU7XHJcblx0fVxyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHRpZiAobWluIDwgMTApIHtcclxuXHRcdG1pbiA9IFwiMFwiICsgbWluO1xyXG5cdH1cclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0aWYgKHNlYyA8IDEwKSB7XHJcblx0XHRzZWMgPSBcIjBcIiArIHNlYztcclxuXHR9XHJcblx0dmFyIHRpbWUgPSB5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBkYXRlICsgXCIgXCIgKyBob3VyICsgJzonICsgbWluICsgJzonICsgc2VjO1xyXG5cdHJldHVybiB0aW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvYmoyQXJyYXkob2JqKSB7XHJcblx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuXHR9KTtcclxuXHRyZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcblx0dmFyIGksIHIsIHQ7XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0YXJ5W2ldID0gaTtcclxuXHR9XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG5cdFx0dCA9IGFyeVtyXTtcclxuXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuXHRcdGFyeVtpXSA9IHQ7XHJcblx0fVxyXG5cdHJldHVybiBhcnk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG5cdC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcblx0dmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG5cclxuXHR2YXIgQ1NWID0gJyc7XHJcblx0Ly9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcblxyXG5cdC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuXHQvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG5cdGlmIChTaG93TGFiZWwpIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuXHJcblx0XHRcdC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRcdHJvdyArPSBpbmRleCArICcsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG5cclxuXHRcdC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcblx0XHRcdHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG5cclxuXHRcdC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0aWYgKENTViA9PSAnJykge1xyXG5cdFx0YWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcblx0dmFyIGZpbGVOYW1lID0gXCJcIjtcclxuXHQvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuXHRmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csIFwiX1wiKTtcclxuXHJcblx0Ly9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuXHR2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG5cclxuXHQvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuXHQvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG5cdC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG5cdC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcblxyXG5cdC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG5cdGxpbmsuaHJlZiA9IHVyaTtcclxuXHJcblx0Ly9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuXHRsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG5cdGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG5cclxuXHQvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcblx0bGluay5jbGljaygpO1xyXG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
