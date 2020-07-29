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
			if (auth_scope.indexOf("groups_access_member_info") < 0) {
				swal({
					title: '抓分享需付費，詳情請見粉絲專頁',
					html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
					type: 'warning'
				}).done();
			} else {
				fb.authOK();
			}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwiZmJlcnJvciIsIndpbmRvdyIsIm9uZXJyb3IiLCJoYW5kbGVFcnIiLCJUQUJMRSIsImxhc3RDb21tYW5kIiwiYWRkTGluayIsImF1dGhfc2NvcGUiLCJtc2ciLCJ1cmwiLCJsIiwiJCIsInZhbCIsImNvbnNvbGUiLCJsb2ciLCJhcHBlbmQiLCJmYWRlSW4iLCJkb2N1bWVudCIsInJlYWR5IiwiaGFzaCIsImxvY2F0aW9uIiwic2VhcmNoIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwiZGF0YSIsImV4dGVuc2lvbiIsImNsaWNrIiwiZSIsImZiIiwiZXh0ZW5zaW9uQXV0aCIsImRhdGFzIiwiY29tbWFuZCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsInJhbmtlciIsInJhdyIsImZpbmlzaCIsImdldEF1dGgiLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJsaWtlcyIsImNob29zZSIsImluaXQiLCJ1aSIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJmaWx0ZXIiLCJyZWFjdCIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJzdGFydFRpbWUiLCJmb3JtYXQiLCJlbmRUaW1lIiwic2V0U3RhcnREYXRlIiwiZmlsdGVyRGF0YSIsImV4cG9ydFRvSnNvbkZpbGUiLCJleGNlbFN0cmluZyIsImV4Y2VsIiwic3RyaW5naWZ5IiwiY2lfY291bnRlciIsImZyb21fZXh0ZW5zaW9uIiwiaW1wb3J0IiwiZmlsZXMiLCJqc29uRGF0YSIsImRhdGFTdHIiLCJkYXRhVXJpIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiZXhwb3J0RmlsZURlZmF1bHROYW1lIiwibGlua0VsZW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwic2hhcmVCVE4iLCJhbGVydCIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsIndvcmQiLCJub3dEYXRlIiwiYXV0aCIsInBhZ2VUb2tlbiIsInVzZXJUb2tlbiIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJhdXRoX3R5cGUiLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJhY2Nlc3NUb2tlbiIsImdyYW50ZWRTY29wZXMiLCJhcGkiLCJyZXMiLCJvYmoiLCJ0b2tlbiIsInVzZXJuYW1lIiwibmFtZSIsImFwcF9zY29wZV9pZCIsImlkIiwicG9zdCIsIm1lc3NhZ2UiLCJjb2RlIiwicGFnZV9zZWxlY3RvciIsInNob3ciLCJmYmlkIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJzd2FsIiwidGl0bGUiLCJodG1sIiwiZG9uZSIsImF1dGhPSyIsInBvc3RkYXRhIiwidXNlcmlkIiwibm93TGVuZ3RoIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJnZXQiLCJ0aGVuIiwiaSIsInB1c2giLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2VfYXJyYXkiLCJwdXJlSUQiLCJ0b1N0cmluZyIsImxlbmd0aCIsImQiLCJmcm9tIiwidXBkYXRlZF90aW1lIiwiY3JlYXRlZF90aW1lIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwiaW5jbHVkZXMiLCJyZXNldCIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwiZmlsdGVyZWQiLCJuZXdPYmoiLCJlYWNoIiwidG1wIiwicG9zdGxpbmsiLCJzdG9yeSIsInRpbWVDb252ZXJ0ZXIiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50Iiwic3RyIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsInBpYyIsImhvc3QiLCJlbnRyaWVzIiwiaiIsInBpY3R1cmUiLCJ0ZCIsInNjb3JlIiwibGlrZV9jb3VudCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInZhbHVlIiwiZHJhdyIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsIm4iLCJwYXJzZUludCIsImZpbmQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsIm1hcCIsImluZGV4Iiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwibm93IiwiayIsInRhciIsImVxIiwiaW5zZXJ0QmVmb3JlIiwiZ2VuX2JpZ19hd2FyZCIsImxpIiwiYXdhcmRzIiwiaGFzQXR0cmlidXRlIiwiYXdhcmRfbmFtZSIsImF0dHIiLCJsaW5rIiwidGltZSIsImNsb3NlX2JpZ19hd2FyZCIsImVtcHR5Iiwic3Vic3RyaW5nIiwicmVnZXgiLCJuZXd1cmwiLCJzdWJzdHIiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsInZpZGVvIiwibGl2ZV9zdGF0dXMiLCJlcnJvciIsImFjY2Vzc190b2tlbiIsInBvc3R1cmwiLCJyZWdleDIiLCJ0ZW1wIiwidGVzdCIsInBhZ2VuYW1lIiwidGFnIiwidW5pcXVlIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsInVuZGVmaW5lZCIsIm1lc3NhZ2VfdGFncyIsInN0IiwidCIsInRpbWVfYXJ5MiIsInNwbGl0IiwidGltZV9hcnkiLCJlbmR0aW1lIiwibW9tZW50IiwiRGF0ZSIsIl9kIiwic3RhcnR0aW1lIiwicGFnZXMiLCJncm91cHMiLCJnZXRBZG1pbiIsImFsbCIsImdldFBhZ2UiLCJnZXRHcm91cCIsImdlbkFkbWluIiwiYWRtaW5pc3RyYXRvciIsInNlbGVjdFBhZ2UiLCJwYWdlX2lkIiwicGVybWFsaW5rX3VybCIsInNlbGVjdFBvc3QiLCJhIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJyb3ciLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0EsSUFBSUMsVUFBVSxFQUFkO0FBQ0FDLE9BQU9DLE9BQVAsR0FBaUJDLFNBQWpCO0FBQ0EsSUFBSUMsS0FBSjtBQUNBLElBQUlDLGNBQWMsVUFBbEI7QUFDQSxJQUFJQyxVQUFVLEtBQWQ7QUFDQSxJQUFJQyxhQUFhLEVBQWpCOztBQUVBLFNBQVNKLFNBQVQsQ0FBbUJLLEdBQW5CLEVBQXdCQyxHQUF4QixFQUE2QkMsQ0FBN0IsRUFBZ0M7QUFDL0IsS0FBSSxDQUFDWCxZQUFMLEVBQW1CO0FBQ2xCLE1BQUlVLE9BQU1FLEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQVY7QUFDQUMsVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWlELDRCQUFqRDtBQUNBRCxVQUFRQyxHQUFSLENBQVksc0JBQXNCTCxJQUFsQztBQUNBRSxJ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Q0FULFVBQVNvVCxJQUFULENBQWNFLFdBQWQsQ0FBMEI3RixJQUExQjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbnZhciBmYmVycm9yID0gJyc7XHJcbndpbmRvdy5vbmVycm9yID0gaGFuZGxlRXJyO1xyXG52YXIgVEFCTEU7XHJcbnZhciBsYXN0Q29tbWFuZCA9ICdjb21tZW50cyc7XHJcbnZhciBhZGRMaW5rID0gZmFsc2U7XHJcbnZhciBhdXRoX3Njb3BlID0gJyc7XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLCB1cmwsIGwpIHtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSkge1xyXG5cdFx0bGV0IHVybCA9ICQoJyNlbnRlclVSTCAudXJsJykudmFsKCk7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsIFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArIHVybCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmFwcGVuZChgPGJyPjxicj4ke2ZiZXJyb3J9PGJyPjxicj4ke3VybH1gKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uc2VhcmNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJleHRlbnNpb25cIikgPj0gMCkge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRkYXRhLmV4dGVuc2lvbiA9IHRydWU7XHJcblxyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aCBidXR0b25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJyYW5rZXJcIikgPj0gMCkge1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiAncmFua2VyJyxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucmFua2VyKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcblxyXG5cdCQoXCIjYnRuX3BhZ2Vfc2VsZWN0b3JcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGZiLmdldEF1dGgoJ3BhZ2Vfc2VsZWN0b3InKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9sb2dpblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgncGFnZV9zZWxlY3RvcicpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLmxpa2VzID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRmYi5nZXRBdXRoKCd1cmxfY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHQkKFwiI21vcmVwb3N0XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdHVpLmFkZExpbmsoKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLopIfoo73ooajmoLzlhaflrrlcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS9NTS9ERCBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSwgZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLnN0YXJ0VGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gZW5kLmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUoY29uZmlnLmZpbHRlci5zdGFydFRpbWUpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRleHBvcnRUb0pzb25GaWxlKGZpbHRlckRhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gaWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCkge1xyXG5cdFx0XHQvLyBcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQvLyB9IGVsc2Uge1xyXG5cdFx0XHQvLyBcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGEpLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpIHtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRjb25maWcuZnJvbV9leHRlbnNpb24gPSB0cnVlO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZXhwb3J0VG9Kc29uRmlsZShqc29uRGF0YSkge1xyXG4gICAgbGV0IGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShqc29uRGF0YSk7XHJcbiAgICBsZXQgZGF0YVVyaSA9ICdkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCwnKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVN0cik7XHJcbiAgICBcclxuICAgIGxldCBleHBvcnRGaWxlRGVmYXVsdE5hbWUgPSAnZGF0YS5qc29uJztcclxuICAgIFxyXG4gICAgbGV0IGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgZGF0YVVyaSk7XHJcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZXhwb3J0RmlsZURlZmF1bHROYW1lKTtcclxuICAgIGxpbmtFbGVtZW50LmNsaWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNoYXJlQlROKCkge1xyXG5cdGFsZXJ0KCfoqo3nnJ/nnIvlrozot7Plh7rkvobnmoTpgqPpoIHkuIrpnaLlr6vkuobku4DpurxcXG5cXG7nnIvlrozkvaDlsLHmnIPnn6XpgZPkvaDngrrku4DpurzkuI3og73mipPliIbkuqsnKTtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsICdtZXNzYWdlX3RhZ3MnLCAnbWVzc2FnZScsICdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCAnZnJvbScsICdtZXNzYWdlJywgJ3N0b3J5J10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzE1JyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjcuMCcsXHJcblx0XHRyZWFjdGlvbnM6ICd2Ny4wJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjcuMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Ny4wJyxcclxuXHRcdGZlZWQ6ICd2Ny4wJyxcclxuXHRcdGdyb3VwOiAndjcuMCcsXHJcblx0XHRuZXdlc3Q6ICd2Ny4wJ1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdHN0YXJ0VGltZTogJzIwMDAtMTItMzEtMDAtMDAtMDAnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRvcmRlcjogJ2Nocm9ub2xvZ2ljYWwnLFxyXG5cdGF1dGg6ICdncm91cHNfc2hvd19saXN0LCBwYWdlc19zaG93X2xpc3QsIHBhZ2VzX3JlYWRfZW5nYWdlbWVudCwgcGFnZXNfcmVhZF91c2VyX2NvbnRlbnQnLFxyXG5cdGxpa2VzOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG5cdHVzZXJUb2tlbjogJycsXHJcblx0ZnJvbV9leHRlbnNpb246IGZhbHNlLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJykgPT4ge1xyXG5cdFx0aWYgKHR5cGUgPT09ICcnKSB7XHJcblx0XHRcdGFkZExpbmsgPSB0cnVlO1xyXG5cdFx0XHR0eXBlID0gbGFzdENvbW1hbmQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZGRMaW5rID0gZmFsc2U7XHJcblx0XHRcdGxhc3RDb21tYW5kID0gdHlwZTtcclxuXHRcdH1cclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcgLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0Ly8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLnVzZXJUb2tlbiA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5hY2Nlc3NUb2tlbjtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRjb25maWcuZnJvbV9leHRlbnNpb24gPSBmYWxzZTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKSB7XHJcblx0XHRcdFx0Ly8gaWYgKGF1dGhfc2NvcGUuaW5jbHVkZXMoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSl7XHJcblx0XHRcdFx0Ly8gXHRzd2FsKFxyXG5cdFx0XHRcdC8vIFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcclxuXHRcdFx0XHQvLyBcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxyXG5cdFx0XHRcdC8vIFx0XHQnc3VjY2VzcydcclxuXHRcdFx0XHQvLyBcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdC8vIH1lbHNle1xyXG5cdFx0XHRcdC8vIFx0c3dhbChcclxuXHRcdFx0XHQvLyBcdFx0J+S7mOiyu+aOiOasiuaqouafpemMr+iqpO+8jOipsuWKn+iDvemcgOS7mOiyuycsXHJcblx0XHRcdFx0Ly8gXHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgSXQgaXMgYSBwYWlkIGZlYXR1cmUuJyxcclxuXHRcdFx0XHQvLyBcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdC8vIFx0KS5kb25lKCk7XHJcblx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdEZCLmFwaShgL21lP2ZpZWxkcz1pZCxuYW1lYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0dG9rZW46IC0xLFxyXG5cdFx0XHRcdFx0XHR1c2VybmFtZTogcmVzLm5hbWUsXHJcblx0XHRcdFx0XHRcdGFwcF9zY29wZV9pZDogcmVzLmlkXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkLnBvc3QoJ2h0dHBzOi8vc2NyaXB0Lmdvb2dsZS5jb20vbWFjcm9zL3MvQUtmeWNieGFHWGthT3pUMkFEQ0M4ci1BNHFCTWc2OVd6XzE2OEFIRXIwZlovZXhlYycsIG9iaiwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdFx0YWxlcnQocmVzLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmNvZGUgPT0gMSl7XHJcblx0XHRcdFx0XHRcdFx0Ly8gbG9jYXRpb24uaHJlZiA9IFwiaW5kZXguaHRtbFwiO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09IFwicGFnZV9zZWxlY3RvclwiKSB7XHRcclxuXHRcdFx0XHRwYWdlX3NlbGVjdG9yLnNob3coKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmYi51c2VyX3Bvc3RzID0gdHJ1ZTtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQXV0aDogKCkgPT4ge1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdH0sIHtcclxuXHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkNhbGxiYWNrOiAocmVzcG9uc2UpID0+IHtcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRcdGF1dGhfc2NvcGUgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKGF1dGhfc2NvcGUuaW5kZXhPZihcImdyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm9cIikgPCAwKSB7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZiLmF1dGhPSygpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGF1dGhPSzogKCkgPT4ge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgcG9zdGRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5wb3N0ZGF0YSk7XHJcblx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdGNvbW1hbmQ6IHBvc3RkYXRhLmNvbW1hbmQsXHJcblx0XHRcdGRhdGE6IEpTT04ucGFyc2UoJChcIi5jaHJvbWVcIikudmFsKCkpXHJcblx0XHR9XHJcblx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiBbXSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W6LOH5paZ5LitLi4uJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRpZiAoIWFkZExpbmspIHtcclxuXHRcdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCkgPT4ge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoJy5wdXJlX2ZiaWQnKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEuZ2V0KGZiaWQpLnRoZW4oKHJlcykgPT4ge1xyXG5cdFx0XHQvLyBmYmlkLmRhdGEgPSByZXM7XHJcblx0XHRcdGZvciAobGV0IGkgb2YgcmVzKSB7XHJcblx0XHRcdFx0ZmJpZC5kYXRhLnB1c2goaSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YS5maW5pc2goZmJpZCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgY29tbWFuZCA9IGZiaWQuY29tbWFuZDtcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJyl7XHJcblx0XHRcdFx0ZmJpZC5mdWxsSUQgPSBmYmlkLnB1cmVJRDtcclxuXHRcdFx0XHRjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnICYmIGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJykge1xyXG5cdFx0XHRcdGZiaWQuZnVsbElEID0gZmJpZC5wdXJlSUQ7XHJcblx0XHRcdFx0ZmJpZC5jb21tYW5kID0gJ2xpa2VzJztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmRlYnVnPWFsbGApO1xyXG5cdFx0XHRsZXQgdG9rZW4gPSBjb25maWcucGFnZVRva2VuID09ICcnID8gYCZhY2Nlc3NfdG9rZW49JHtjb25maWcudXNlclRva2VufWA6YCZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufWA7XHJcblxyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZvcmRlcj0ke2NvbmZpZy5vcmRlcn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0ke3Rva2VufSZkZWJ1Zz1hbGxgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0aWYgKChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgZmJpZC5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogZC5uYW1lXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBkLnR5cGUgPSBcIkxJS0VcIjtcclxuXHRcdFx0XHRcdGlmIChkLmZyb20pIHtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IGQuaWRcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdCA9IDApIHtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApIHtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCAnbGltaXQ9JyArIGxpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJyArIGRhdGEubm93TGVuZ3RoICsgJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvciAobGV0IGQgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGQuaWQpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBmYmlkLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmIChkLmZyb20pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGQuaWRcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdC8vIGlmIChkYXRhLm5vd0xlbmd0aCA8IDE4MCkge1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpID0+IHtcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpID0+IHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi51cGRhdGVfYXJlYSwuZG9uYXRlX2FyZWFcIikuc2xpZGVVcCgpO1xyXG5cdFx0JChcIi5yZXN1bHRfYXJlYVwiKS5zbGlkZURvd24oKTtcclxuXHRcdGlmIChkYXRhLnJhdy50eXBlID09ICdncm91cCcpe1xyXG5cdFx0XHRpZiAoYXV0aF9zY29wZS5pbmNsdWRlcygnZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycpKXtcclxuXHRcdFx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdFx0XHRkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRcdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdFx0XHRcdHVpLnJlc2V0KCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5qqi5p+l6Yyv6Kqk77yM5oqT56S+5ZyY6LK85paH6ZyA5LuY6LK7JyxcclxuXHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgSXQgaXMgYSBwYWlkIGZlYXR1cmUuJyxcclxuXHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0XHRkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdFx0dWkucmVzZXQoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpID0+IHtcclxuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0bGV0IGlzVGFnID0gJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHQvLyBpZiAoY29uZmlnLmZyb21fZXh0ZW5zaW9uID09PSBmYWxzZSAmJiByYXdEYXRhLmNvbW1hbmQgPT09ICdjb21tZW50cycpIHtcclxuXHRcdC8vIFx0cmF3RGF0YS5kYXRhID0gcmF3RGF0YS5kYXRhLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdC8vIFx0XHRyZXR1cm4gaXRlbS5pc19oaWRkZW4gPT09IGZhbHNlXHJcblx0XHQvLyBcdH0pO1xyXG5cdFx0Ly8gfVxyXG5cdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xyXG5cdFx0cmF3RGF0YS5maWx0ZXJlZCA9IG5ld0RhdGE7XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpIHtcclxuXHRcdFx0dGFibGUuZ2VuZXJhdGUocmF3RGF0YSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gcmF3RGF0YTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4Y2VsOiAocmF3KSA9PiB7XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRjb25zb2xlLmxvZyhyYXcpO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKSB7XHJcblx0XHRcdGlmIChyYXcuY29tbWFuZCA9PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIjogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuihqOaDhVwiOiB0aGlzLnR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCI6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpID0+IHtcclxuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmRhdGEgPSByYXdkYXRhLmZpbHRlcmVkO1xyXG5cdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRpZiAoKHJhd2RhdGEuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCByYXdkYXRhLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuihqOaDhTwvdGQ+YDtcclxuXHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuaOkuWQjTwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+5YiG5pW4PC90ZD5gO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaG9zdCA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJztcclxuXHRcdGlmIChkYXRhLnJhdy50eXBlID09PSAndXJsX2NvbW1lbnRzJykgaG9zdCA9ICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkgKyAnP2ZiX2NvbW1lbnRfaWQ9JztcclxuXHJcblx0XHRmb3IgKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJkYXRhLmVudHJpZXMoKSkge1xyXG5cdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRpZiAocGljKSB7XHJcblx0XHRcdFx0cGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHtwaWN0dXJlfSR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5gO1xyXG5cdFx0XHRpZiAoKHJhd2RhdGEuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCByYXdkYXRhLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKSB7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHRcdFx0XHR0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPjxhIGhyZWY9J2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0ICA8dGQ+JHt2YWwuc2NvcmV9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBwb3N0bGluayA9IGhvc3QgKyB2YWwuaWQ7XHJcblx0XHRcdFx0aWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbikge1xyXG5cdFx0XHRcdFx0cG9zdGxpbmsgPSB2YWwucG9zdGxpbms7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCIke3Bvc3RsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2V9PC9hPjwvdGQ+XHJcblx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cclxuXHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKSB7XHJcblx0XHRcdFRBQkxFID0gJChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoXCIjc2VhcmNoTmFtZVwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEFCTEVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChcIiNzZWFyY2hDb21tZW50XCIpLm9uKCdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUQUJMRVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKSA9PiB7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNzZWFyY2hDb21tZW50XCIpLnZhbCgpICE9ICcnKSB7XHJcblx0XHRcdHRhYmxlLnJlZG8oKTtcclxuXHRcdH1cclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKSB7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XHJcblx0XHRcdFx0XHRcdFwibmFtZVwiOiBwLFxyXG5cdFx0XHRcdFx0XHRcIm51bVwiOiBuXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbygpO1xyXG5cdH0sXHJcblx0Z286ICgpID0+IHtcclxuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhLmZpbHRlcmVkLmxlbmd0aCkuc3BsaWNlKDAsIGNob29zZS5udW0pO1xyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0Y2hvb3NlLmF3YXJkLm1hcCgodmFsLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0ciB0aXRsZT1cIuesrCcgKyAoaW5kZXggKyAxKSArICflkI1cIj4nICsgJCgnLm1haW5fdGFibGUnKS5EYXRhVGFibGUoKS5yb3dzKHtcclxuXHRcdFx0XHRzZWFyY2g6ICdhcHBsaWVkJ1xyXG5cdFx0XHR9KS5ub2RlcygpW3ZhbF0uaW5uZXJIVE1MICsgJzwvdHI+JztcclxuXHRcdH0pXHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYgKGNob29zZS5kZXRhaWwpIHtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvciAobGV0IGsgaW4gY2hvb3NlLmxpc3QpIHtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjVcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH0sXHJcblx0Z2VuX2JpZ19hd2FyZDogKCkgPT4ge1xyXG5cdFx0bGV0IGxpID0gJyc7XHJcblx0XHRsZXQgYXdhcmRzID0gW107XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRib2R5IHRyJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHZhbCkge1xyXG5cdFx0XHRsZXQgYXdhcmQgPSB7fTtcclxuXHRcdFx0aWYgKHZhbC5oYXNBdHRyaWJ1dGUoJ3RpdGxlJykpIHtcclxuXHRcdFx0XHRhd2FyZC5hd2FyZF9uYW1lID0gZmFsc2U7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS50ZXh0KCk7XHJcblx0XHRcdFx0YXdhcmQudXNlcmlkID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLmF0dHIoJ2hyZWYnKS5yZXBsYWNlKCdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJywgJycpO1xyXG5cdFx0XHRcdGF3YXJkLm1lc3NhZ2UgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLmxpbmsgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykuYXR0cignaHJlZicpO1xyXG5cdFx0XHRcdGF3YXJkLnRpbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgkKHZhbCkuZmluZCgndGQnKS5sZW5ndGggLSAxKS50ZXh0KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IHRydWU7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLnRleHQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhd2FyZHMucHVzaChhd2FyZCk7XHJcblx0XHR9KTtcclxuXHRcdGZvciAobGV0IGkgb2YgYXdhcmRzKSB7XHJcblx0XHRcdGlmIChpLmF3YXJkX25hbWUgPT09IHRydWUpIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpIGNsYXNzPVwicHJpemVOYW1lXCI+JHtpLm5hbWV9PC9saT5gO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxpICs9IGA8bGk+XHJcblx0XHRcdFx0PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPjxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH0vcGljdHVyZT90eXBlPWxhcmdlJmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59XCIgYWx0PVwiXCI+PC9hPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJpbmZvXCI+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJuYW1lXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5uYW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5tZXNzYWdlfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJ0aW1lXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS50aW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9saT5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuYXBwZW5kKGxpKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0Y2xvc2VfYmlnX2F3YXJkOiAoKSA9PiB7XHJcblx0XHQkKCcuYmlnX2F3YXJkJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQgdWwnKS5lbXB0eSgpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZiaWQgPSB7XHJcblx0ZmJpZDogW10sXHJcblx0aW5pdDogKHR5cGUpID0+IHtcclxuXHRcdGZiaWQuZmJpZCA9IFtdO1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRGQi5hcGkoXCIvbWVcIiwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRkYXRhLnVzZXJpZCA9IHJlcy5pZDtcclxuXHRcdFx0bGV0IHVybCA9ICcnO1xyXG5cdFx0XHRpZiAoYWRkTGluaykge1xyXG5cdFx0XHRcdHVybCA9IGZiaWQuZm9ybWF0KCQoJy5tb3JlbGluayAuYWRkdXJsJykudmFsKCkpO1xyXG5cdFx0XHRcdCQoJy5tb3JlbGluayAuYWRkdXJsJykudmFsKCcnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodXJsLmluZGV4T2YoJy5waHA/JykgPT09IC0xICYmIHVybC5pbmRleE9mKCc/JykgPiAwKSB7XHJcblx0XHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZignPycpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmYmlkLmdldCh1cmwsIHR5cGUpLnRoZW4oKGZiaWQpID0+IHtcclxuXHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQvLyAkKCcuaWRlbnRpdHknKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoYOeZu+WFpei6q+S7ve+8mjxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtyZXMuaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxzcGFuPiR7cmVzLm5hbWV9PC9zcGFuPmApO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6ICh1cmwsIHR5cGUpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGxldCBuZXd1cmwgPSB1cmwuc3Vic3RyKHVybC5pbmRleE9mKCcvJywgMjgpICsgMSwgMjAwKTtcclxuXHRcdFx0Ly8gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyDlhbEyNeWtl+WFg++8jOWboOatpOmBuDI46ZaL5aeL5om+L1xyXG5cdFx0XHRsZXQgcmVzdWx0ID0gbmV3dXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0bGV0IHVybHR5cGUgPSBmYmlkLmNoZWNrVHlwZSh1cmwpO1xyXG5cdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpID0+IHtcclxuXHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdHVybHR5cGUgPSAncGVyc29uYWwnO1xyXG5cdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdHBhZ2VJRDogaWQsXHJcblx0XHRcdFx0XHR0eXBlOiB1cmx0eXBlLFxyXG5cdFx0XHRcdFx0Y29tbWFuZDogdHlwZSxcclxuXHRcdFx0XHRcdGRhdGE6IFtdXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoYWRkTGluaykgb2JqLmRhdGEgPSBkYXRhLnJhdy5kYXRhOyAvL+i/veWKoOiyvOaWh1xyXG5cdFx0XHRcdGlmICh1cmx0eXBlID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcclxuXHRcdFx0XHRcdGlmIChzdGFydCA+PSAwKSB7XHJcblx0XHRcdFx0XHRcdGxldCBlbmQgPSB1cmwuaW5kZXhPZihcIiZcIiwgc3RhcnQpO1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCArIDUsIGVuZCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZigncG9zdHMvJyk7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0ICsgNiwgdXJsLmxlbmd0aCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgdmlkZW8gPSB1cmwuaW5kZXhPZigndmlkZW9zLycpO1xyXG5cdFx0XHRcdFx0aWYgKHZpZGVvID49IDApIHtcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdwdXJlJykge1xyXG5cdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHVybC5yZXBsYWNlKC9cXFwiL2csICcnKTtcclxuXHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdncm91cCcpIHtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArIFwiX1wiICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3Bob3RvJykge1xyXG5cdFx0XHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gdXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAndmlkZW8nKSB7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRGQi5hcGkoYC8ke29iai5wdXJlSUR9P2ZpZWxkcz1saXZlX3N0YXR1c2AsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzLmxpdmVfc3RhdHVzID09PSAnTElWRScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxIHx8IHJlc3VsdC5sZW5ndGggPT0gMykge1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3VubmFtZScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRGQi5hcGkoYC8ke29iai5wYWdlSUR9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2hlY2tUeXBlOiAocG9zdHVybCkgPT4ge1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImZiaWQ9XCIpID49IDApIHtcclxuXHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZigncGVybWFsaW5rJykgPj0gMCkge1xyXG5cdFx0XHRcdHJldHVybiAndW5uYW1lJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3BlcnNvbmFsJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvZ3JvdXBzL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAnZ3JvdXAnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJldmVudHNcIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ2V2ZW50JztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL3Bob3Rvcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3Bob3RvJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL3ZpZGVvcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3ZpZGVvJztcclxuXHRcdH1cclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ1wiJykgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3B1cmUnO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiAnbm9ybWFsJztcclxuXHR9LFxyXG5cdGNoZWNrUGFnZUlEOiAocG9zdHVybCwgdHlwZSkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IHN0YXJ0ID0gcG9zdHVybC5pbmRleE9mKFwiZmFjZWJvb2suY29tXCIpICsgMTM7XHJcblx0XHRcdGxldCBlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsIHN0YXJ0KTtcclxuXHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0aWYgKGVuZCA8IDApIHtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdmYmlkPScpID49IDApIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAndW5uYW1lJykge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCd1bm5hbWUnKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc29sdmUocG9zdHVybC5tYXRjaChyZWdleClbMV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgZ3JvdXAgPSBwb3N0dXJsLmluZGV4T2YoJy9ncm91cHMvJyk7XHJcblx0XHRcdFx0bGV0IGV2ZW50ID0gcG9zdHVybC5pbmRleE9mKCcvZXZlbnRzLycpXHJcblx0XHRcdFx0aWYgKGdyb3VwID49IDApIHtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gZ3JvdXAgKyA4O1xyXG5cdFx0XHRcdFx0ZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLCBzdGFydCk7XHJcblx0XHRcdFx0XHRsZXQgcmVnZXgyID0gL1xcZHs2LH0vZztcclxuXHRcdFx0XHRcdGxldCB0ZW1wID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XHJcblx0XHRcdFx0XHRpZiAocmVnZXgyLnRlc3QodGVtcCkpIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0ZW1wKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ2dyb3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmIChldmVudCA+PSAwKSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCdldmVudCcpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgcGFnZW5hbWUgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcclxuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZW5hbWV9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRmYmVycm9yID0gcmVzLmVycm9yLm1lc3NhZ2U7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmlkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZvcm1hdDogKHVybCkgPT4ge1xyXG5cdFx0aWYgKHVybC5pbmRleE9mKCdidXNpbmVzcy5mYWNlYm9vay5jb20vJykgPj0gMCkge1xyXG5cdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhd2RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIHN0YXJ0VGltZSwgZW5kVGltZSkgPT4ge1xyXG5cdFx0bGV0IGRhdGEgPSByYXdkYXRhLmRhdGE7XHJcblx0XHRpZiAod29yZCAhPT0gJycpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKChyYXdkYXRhLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgcmF3ZGF0YS5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnJlYWN0KGRhdGEsIHJlYWN0KTtcclxuXHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJykge1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBzdGFydFRpbWUsIGVuZFRpbWUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSkgPT4ge1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZiAoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKSA9PiB7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGlmIChuLnN0b3J5LmluZGV4T2Yod29yZCkgPiAtMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCBzdCwgdCkgPT4ge1xyXG5cdFx0bGV0IHRpbWVfYXJ5MiA9IHN0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IGVuZHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sIChwYXJzZUludCh0aW1lX2FyeVsxXSkgLSAxKSwgdGltZV9hcnlbMl0sIHRpbWVfYXJ5WzNdLCB0aW1lX2FyeVs0XSwgdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBzdGFydHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnkyWzBdLCAocGFyc2VJbnQodGltZV9hcnkyWzFdKSAtIDEpLCB0aW1lX2FyeTJbMl0sIHRpbWVfYXJ5MlszXSwgdGltZV9hcnkyWzRdLCB0aW1lX2FyeTJbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmICgoY3JlYXRlZF90aW1lID4gc3RhcnR0aW1lICYmIGNyZWF0ZWRfdGltZSA8IGVuZHRpbWUpIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpID0+IHtcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpIHtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCkgPT4ge1xyXG5cclxuXHR9LFxyXG5cdGFkZExpbms6ICgpID0+IHtcclxuXHRcdGxldCB0YXIgPSAkKCcuaW5wdXRhcmVhIC5tb3JlbGluaycpO1xyXG5cdFx0aWYgKHRhci5oYXNDbGFzcygnc2hvdycpKSB7XHJcblx0XHRcdHRhci5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGFyLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZXNldDogKCkgPT4ge1xyXG5cdFx0bGV0IGNvbW1hbmQgPSBkYXRhLnJhdy5jb21tYW5kO1xyXG5cdFx0aWYgKChjb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIikpIHtcclxuXHRcdFx0XHQkKFwiI3RhZ1wiKS5jbGljaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbmxldCBwYWdlX3NlbGVjdG9yID0ge1xyXG5cdHBhZ2VzOiBbXSxcclxuXHRncm91cHM6IFtdLFxyXG5cdHNob3c6ICgpPT57XHJcblx0XHQkKCcucGFnZV9zZWxlY3RvcicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRwYWdlX3NlbGVjdG9yLmdldEFkbWluKCk7XHJcblx0fSxcclxuXHRnZXRBZG1pbjogKCk9PntcclxuXHRcdFByb21pc2UuYWxsKFtwYWdlX3NlbGVjdG9yLmdldFBhZ2UoKSwgcGFnZV9zZWxlY3Rvci5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRwYWdlX3NlbGVjdG9yLmdlbkFkbWluKHJlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9maWVsZHM9bmFtZSxpZCxhZG1pbmlzdHJhdG9yJmxpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZSAocmVzLmRhdGEuZmlsdGVyKGl0ZW09PntyZXR1cm4gaXRlbS5hZG1pbmlzdHJhdG9yID09PSB0cnVlfSkpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2VuQWRtaW46IChyZXMpPT57XHJcblx0XHRsZXQgcGFnZXMgPSAnJztcclxuXHRcdGxldCBncm91cHMgPSAnJztcclxuXHRcdGZvcihsZXQgaSBvZiByZXNbMF0pe1xyXG5cdFx0XHRwYWdlcyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgZGF0YS10eXBlPVwiMVwiIGRhdGEtdmFsdWU9XCIke2kuaWR9XCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UGFnZSh0aGlzKVwiPiR7aS5uYW1lfTwvZGl2PmA7XHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzWzFdKXtcclxuXHRcdFx0Z3JvdXBzICs9IGA8ZGl2IGNsYXNzPVwicGFnZV9idG5cIiBkYXRhLXR5cGU9XCIyXCIgZGF0YS12YWx1ZT1cIiR7aS5pZH1cIiBvbmNsaWNrPVwicGFnZV9zZWxlY3Rvci5zZWxlY3RQYWdlKHRoaXMpXCI+JHtpLm5hbWV9PC9kaXY+YDtcclxuXHRcdH1cclxuXHRcdCQoJy5zZWxlY3RfcGFnZScpLmh0bWwocGFnZXMpO1xyXG5cdFx0JCgnLnNlbGVjdF9ncm91cCcpLmh0bWwoZ3JvdXBzKTtcclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6ICh0YXJnZXQpPT57XHJcblx0XHRsZXQgcGFnZV9pZCA9ICQodGFyZ2V0KS5kYXRhKCd2YWx1ZScpO1xyXG5cdFx0JCgnI3Bvc3RfdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdCQoJy5mYl9sb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdEZCLmFwaShgLyR7cGFnZV9pZH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZV9pZH0vbGl2ZV92aWRlb3M/ZmllbGRzPXN0YXR1cyxwZXJtYWxpbmtfdXJsLHRpdGxlLGNyZWF0aW9uX3RpbWVgLCAocmVzKT0+e1xyXG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdFx0Zm9yKGxldCB0ciBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0aWYgKHRyLnN0YXR1cyA9PT0gJ0xJVkUnKXtcclxuXHRcdFx0XHRcdHRoZWFkICs9IGA8dHI+PHRkPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBvc3QoJyR7dHIuaWR9JylcIj7pgbjmk4fosrzmloc8L2J1dHRvbj4oTElWRSk8L3RkPjx0ZD48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tJHt0ci5wZXJtYWxpbmtfdXJsfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dHIudGl0bGV9PC9hPjwvdGQ+PHRkPiR7dGltZUNvbnZlcnRlcih0ci5jcmVhdGVkX3RpbWUpfTwvdGQ+PC90cj5gO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dGhlYWQgKz0gYDx0cj48dGQ+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UG9zdCgnJHt0ci5pZH0nKVwiPumBuOaTh+iyvOaWhzwvYnV0dG9uPjwvdGQ+PHRkPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20ke3RyLnBlcm1hbGlua191cmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt0ci50aXRsZX08L2E+PC90ZD48dGQ+JHt0aW1lQ29udmVydGVyKHRyLmNyZWF0ZWRfdGltZSl9PC90ZD48L3RyPmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdCQoJyNwb3N0X3RhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHR9KTtcclxuXHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZV9pZH0vZmVlZD9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHQkKCcuZmJfbG9hZGluZycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0XHRmb3IobGV0IHRyIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHR0Ym9keSArPSBgPHRyPjx0ZD48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbmNsaWNrPVwicGFnZV9zZWxlY3Rvci5zZWxlY3RQb3N0KCcke3RyLmlkfScpXCI+6YG45pOH6LK85paHPC9idXR0b24+PC90ZD48dGQ+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3RyLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dHIubWVzc2FnZX08L2E+PC90ZD48dGQ+JHt0aW1lQ29udmVydGVyKHRyLmNyZWF0ZWRfdGltZSl9PC90ZD48L3RyPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnI3Bvc3RfdGFibGUgdGJvZHknKS5odG1sKHRib2R5KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0c2VsZWN0UG9zdDogKGZiaWQpPT57XHJcblx0XHQkKCcucGFnZV9zZWxlY3RvcicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHQkKCcuc2VsZWN0X3BhZ2UnKS5odG1sKCcnKTtcclxuXHRcdCQoJy5zZWxlY3RfZ3JvdXAnKS5odG1sKCcnKTtcclxuXHRcdCQoJyNwb3N0X3RhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRsZXQgaWQgPSAnXCInK2ZiaWQrJ1wiJztcclxuXHRcdCQoJyNlbnRlclVSTCAudXJsJykudmFsKGlkKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCkge1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkgKyAxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGRhdGUgKyBcIi1cIiArIGhvdXIgKyBcIi1cIiArIG1pbiArIFwiLVwiICsgc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKSB7XHJcblx0dmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG5cdHZhciBtb250aHMgPSBbJzAxJywgJzAyJywgJzAzJywgJzA0JywgJzA1JywgJzA2JywgJzA3JywgJzA4JywgJzA5JywgJzEwJywgJzExJywgJzEyJ107XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHRpZiAoZGF0ZSA8IDEwKSB7XHJcblx0XHRkYXRlID0gXCIwXCIgKyBkYXRlO1xyXG5cdH1cclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0aWYgKG1pbiA8IDEwKSB7XHJcblx0XHRtaW4gPSBcIjBcIiArIG1pbjtcclxuXHR9XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdGlmIChzZWMgPCAxMCkge1xyXG5cdFx0c2VjID0gXCIwXCIgKyBzZWM7XHJcblx0fVxyXG5cdHZhciB0aW1lID0geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF0ZSArIFwiIFwiICsgaG91ciArICc6JyArIG1pbiArICc6JyArIHNlYztcclxuXHRyZXR1cm4gdGltZTtcclxufVxyXG5cclxuZnVuY3Rpb24gb2JqMkFycmF5KG9iaikge1xyXG5cdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0cmV0dXJuIFt2YWx1ZV07XHJcblx0fSk7XHJcblx0cmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcblx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG5cdHZhciBpLCByLCB0O1xyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdGFyeVtpXSA9IGk7XHJcblx0fVxyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuXHRcdHQgPSBhcnlbcl07XHJcblx0XHRhcnlbcl0gPSBhcnlbaV07XHJcblx0XHRhcnlbaV0gPSB0O1xyXG5cdH1cclxuXHRyZXR1cm4gYXJ5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuXHQvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG5cdHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuXHJcblx0dmFyIENTViA9ICcnO1xyXG5cdC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG5cclxuXHQvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcblx0Ly9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuXHRpZiAoU2hvd0xhYmVsKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcblxyXG5cdFx0XHQvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG5cdFx0XHRyb3cgKz0gaW5kZXggKyAnLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuXHJcblx0XHQvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHQvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG5cdFx0XHRyb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuXHJcblx0XHQvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdGlmIChDU1YgPT0gJycpIHtcclxuXHRcdGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG5cdHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcblx0Ly90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcblx0ZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLCBcIl9cIik7XHJcblxyXG5cdC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcblx0dmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuXHJcblx0Ly8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcblx0Ly8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuXHQvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuXHQvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG5cclxuXHQvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuXHRsaW5rLmhyZWYgPSB1cmk7XHJcblxyXG5cdC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcblx0bGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuXHRsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuXHJcblx0Ly90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG5cdGxpbmsuY2xpY2soKTtcclxuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
