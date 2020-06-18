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
		startTime: '2000-12-31-00-00-00',
		endTime: nowDate()
	},
	order: 'chronological',
	auth: 'manage_pages,groups_access_member_info',
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
				if (auth_scope.includes('groups_access_member_info')) {
					swal('付費授權完成，請再次執行抓留言', 'Authorization Finished! Please getComments again.', 'success').done();
				} else {
					swal('付費授權檢查錯誤，該功能需付費', 'Authorization Failed! It is a paid feature.', 'error').done();
				}
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
					var link = val.id;
					if (config.from_extension) {
						link = val.postlink;
					}
					td += '<td class="force-break"><a href="' + host + link + '" target="_blank">' + val.message + '</a></td>\n\t\t\t\t<td>' + val.like_count + '</td>\n\t\t\t\t<td class="nowrap">' + timeConverter(val.created_time) + '</td>';
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwiZmJlcnJvciIsIndpbmRvdyIsIm9uZXJyb3IiLCJoYW5kbGVFcnIiLCJUQUJMRSIsImxhc3RDb21tYW5kIiwiYWRkTGluayIsImF1dGhfc2NvcGUiLCJtc2ciLCJ1cmwiLCJsIiwiJCIsInZhbCIsImNvbnNvbGUiLCJsb2ciLCJhcHBlbmQiLCJmYWRlSW4iLCJkb2N1bWVudCIsInJlYWR5IiwiaGFzaCIsImxvY2F0aW9uIiwic2VhcmNoIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwiZGF0YSIsImV4dGVuc2lvbiIsImNsaWNrIiwiZSIsImZiIiwiZXh0ZW5zaW9uQXV0aCIsImRhdGFzIiwiY29tbWFuZCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsInJhbmtlciIsInJhdyIsImZpbmlzaCIsImdldEF1dGgiLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJsaWtlcyIsImNob29zZSIsImluaXQiLCJ1aSIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJmaWx0ZXIiLCJyZWFjdCIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJzdGFydFRpbWUiLCJmb3JtYXQiLCJlbmRUaW1lIiwic2V0U3RhcnREYXRlIiwiZmlsdGVyRGF0YSIsImV4cG9ydFRvSnNvbkZpbGUiLCJleGNlbFN0cmluZyIsImV4Y2VsIiwic3RyaW5naWZ5IiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwianNvbkRhdGEiLCJkYXRhU3RyIiwiZGF0YVVyaSIsImVuY29kZVVSSUNvbXBvbmVudCIsImV4cG9ydEZpbGVEZWZhdWx0TmFtZSIsImxpbmtFbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsInNoYXJlQlROIiwiYWxlcnQiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJuZXdlc3QiLCJ3b3JkIiwibm93RGF0ZSIsImF1dGgiLCJwYWdlVG9rZW4iLCJ1c2VyVG9rZW4iLCJmcm9tX2V4dGVuc2lvbiIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJhdXRoX3R5cGUiLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJhY2Nlc3NUb2tlbiIsImdyYW50ZWRTY29wZXMiLCJpbmNsdWRlcyIsInN3YWwiLCJkb25lIiwicGFnZV9zZWxlY3RvciIsInNob3ciLCJmYmlkIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJ0aXRsZSIsImh0bWwiLCJhdXRoT0siLCJwb3N0ZGF0YSIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwiZ2V0IiwidGhlbiIsInJlcyIsImkiLCJwdXNoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwcm9taXNlX2FycmF5IiwicHVyZUlEIiwidG9TdHJpbmciLCJ0b2tlbiIsImFwaSIsImxlbmd0aCIsImQiLCJmcm9tIiwiaWQiLCJuYW1lIiwidXBkYXRlZF90aW1lIiwiY3JlYXRlZF90aW1lIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwibWVzc2FnZSIsInN0b3J5IiwidGltZUNvbnZlcnRlciIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJzdHIiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsImZpbHRlcmRhdGEiLCJ0aGVhZCIsInRib2R5IiwicGljIiwiaG9zdCIsImVudHJpZXMiLCJqIiwicGljdHVyZSIsInRkIiwic2NvcmUiLCJsaW5rIiwibGlrZV9jb3VudCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInZhbHVlIiwiZHJhdyIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsIm4iLCJwYXJzZUludCIsImZpbmQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsIm1hcCIsImluZGV4Iiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwibm93IiwiayIsInRhciIsImVxIiwiaW5zZXJ0QmVmb3JlIiwiZ2VuX2JpZ19hd2FyZCIsImxpIiwiYXdhcmRzIiwiaGFzQXR0cmlidXRlIiwiYXdhcmRfbmFtZSIsImF0dHIiLCJ0aW1lIiwiY2xvc2VfYmlnX2F3YXJkIiwiZW1wdHkiLCJzdWJzdHJpbmciLCJyZWdleCIsIm5ld3VybCIsInN1YnN0ciIsIm1hdGNoIiwidXJsdHlwZSIsImNoZWNrVHlwZSIsImNoZWNrUGFnZUlEIiwib2JqIiwicGFnZUlEIiwidmlkZW8iLCJsaXZlX3N0YXR1cyIsImVycm9yIiwiYWNjZXNzX3Rva2VuIiwicG9zdHVybCIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJ0YWciLCJ1bmlxdWUiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJuZXdBcnkiLCJncmVwIiwidW5kZWZpbmVkIiwibWVzc2FnZV90YWdzIiwic3QiLCJ0IiwidGltZV9hcnkyIiwic3BsaXQiLCJ0aW1lX2FyeSIsImVuZHRpbWUiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJzdGFydHRpbWUiLCJwYWdlcyIsImdyb3VwcyIsImdldEFkbWluIiwiYWxsIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwiZ2VuQWRtaW4iLCJhZG1pbmlzdHJhdG9yIiwic2VsZWN0UGFnZSIsInBhZ2VfaWQiLCJwZXJtYWxpbmtfdXJsIiwic2VsZWN0UG9zdCIsImEiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQSxJQUFJQyxVQUFVLEVBQWQ7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQkMsU0FBakI7QUFDQSxJQUFJQyxLQUFKO0FBQ0EsSUFBSUMsY0FBYyxVQUFsQjtBQUNBLElBQUlDLFVBQVUsS0FBZDtBQUNBLElBQUlDLGFBQWEsRUFBakI7O0FBRUEsU0FBU0osU0FBVCxDQUFtQkssR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxDQUE3QixFQUFnQztBQUMvQixLQUFJLENBQUNYLFlBQUwsRUFBbUI7QUFDbEIsTUFBSVUsT0FBTUUsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBVjtBQUNBQyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBaUQsNEJBQWpEO0FBQ0FELFVBQVFDLEdBQVIsQ0FBWSxzQkFBc0JMLElBQWxDO0FBQ0FFLElBQUUsaUJBQUYsRUFBcUJJLE1BQXJCLGNBQXVDZixPQUF2QyxnQkFB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TUFBTSxNQUFiO0FBQ0E7O0FBRUQsS0FBSUQsT0FBTyxFQUFYLEVBQWU7QUFDZHJPLFFBQU0sY0FBTjtBQUNBO0FBQ0E7O0FBRUQ7QUFDQSxLQUFJd08sV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWU4sWUFBWTVKLE9BQVosQ0FBb0IsSUFBcEIsRUFBMEIsR0FBMUIsQ0FBWjs7QUFFQTtBQUNBLEtBQUltSyxNQUFNLHVDQUF1Q0MsVUFBVUwsR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUlySCxPQUFPbEwsU0FBUytELGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBbUgsTUFBSzJILElBQUwsR0FBWUYsR0FBWjs7QUFFQTtBQUNBekgsTUFBSzRILEtBQUwsR0FBYSxtQkFBYjtBQUNBNUgsTUFBSzZILFFBQUwsR0FBZ0JMLFdBQVcsTUFBM0I7O0FBRUE7QUFDQTFTLFVBQVNnVCxJQUFULENBQWNDLFdBQWQsQ0FBMEIvSCxJQUExQjtBQUNBQSxNQUFLekssS0FBTDtBQUNBVCxVQUFTZ1QsSUFBVCxDQUFjRSxXQUFkLENBQTBCaEksSUFBMUI7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG52YXIgZmJlcnJvciA9ICcnO1xyXG53aW5kb3cub25lcnJvciA9IGhhbmRsZUVycjtcclxudmFyIFRBQkxFO1xyXG52YXIgbGFzdENvbW1hbmQgPSAnY29tbWVudHMnO1xyXG52YXIgYWRkTGluayA9IGZhbHNlO1xyXG52YXIgYXV0aF9zY29wZSA9ICcnO1xyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZywgdXJsLCBsKSB7XHJcblx0aWYgKCFlcnJvck1lc3NhZ2UpIHtcclxuXHRcdGxldCB1cmwgPSAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpO1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLCBcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0Y29uc29sZS5sb2coXCJFcnJvciBvY2N1ciBVUkzvvJogXCIgKyB1cmwpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5hcHBlbmQoYDxicj48YnI+JHtmYmVycm9yfTxicj48YnI+JHt1cmx9YCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHRsZXQgaGFzaCA9IGxvY2F0aW9uLnNlYXJjaDtcclxuXHRpZiAoaGFzaC5pbmRleE9mKFwiZXh0ZW5zaW9uXCIpID49IDApIHtcclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0ZGF0YS5leHRlbnNpb24gPSB0cnVlO1xyXG5cclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGggYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRpZiAoaGFzaC5pbmRleE9mKFwicmFua2VyXCIpID49IDApIHtcclxuXHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0Y29tbWFuZDogJ3JhbmtlcicsXHJcblx0XHRcdGRhdGE6IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnJhbmtlcilcclxuXHRcdH1cclxuXHRcdGRhdGEucmF3ID0gZGF0YXM7XHJcblx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0fVxyXG5cclxuXHQkKFwiI2J0bl9wYWdlX3NlbGVjdG9yXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRmYi5nZXRBdXRoKCdwYWdlX3NlbGVjdG9yJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLm9yZGVyID0gJ2Nocm9ub2xvZ2ljYWwnO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fbGlrZVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRjb25maWcubGlrZXMgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZ2V0QXV0aCgncmVhY3Rpb25zJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fdXJsXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGZiLmdldEF1dGgoJ3VybF9jb21tZW50cycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3BheVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdH0pO1xyXG5cdCQoXCIjbW9yZXBvc3RcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0dWkuYWRkTGluaygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIuikh+ijveihqOagvOWFp+WuuVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi51aXBhbmVsIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZL01NL0REIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFx0XCLml6VcIixcclxuXHRcdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFx0XCLkuIlcIixcclxuXHRcdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFx0XCLlha1cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xyXG5cdFx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XHRcIuS4ieaciFwiLFxyXG5cdFx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XHRcIuWFreaciFwiLFxyXG5cdFx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XHRcIuS5neaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XHRcIuWNgeS6jOaciFwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwiZmlyc3REYXlcIjogMVxyXG5cdFx0fSxcclxuXHR9LCBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIuc3RhcnRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBlbmQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShjb25maWcuZmlsdGVyLnN0YXJ0VGltZSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGV4cG9ydFRvSnNvbkZpbGUoZmlsdGVyRGF0YSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKSB7XHJcblx0XHRcdC8vIFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdC8vIFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdC8vIH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSkge1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGV4cG9ydFRvSnNvbkZpbGUoanNvbkRhdGEpIHtcclxuICAgIGxldCBkYXRhU3RyID0gSlNPTi5zdHJpbmdpZnkoanNvbkRhdGEpO1xyXG4gICAgbGV0IGRhdGFVcmkgPSAnZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgsJysgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFTdHIpO1xyXG4gICAgXHJcbiAgICBsZXQgZXhwb3J0RmlsZURlZmF1bHROYW1lID0gJ2RhdGEuanNvbic7XHJcbiAgICBcclxuICAgIGxldCBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsIGRhdGFVcmkpO1xyXG4gICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGV4cG9ydEZpbGVEZWZhdWx0TmFtZSk7XHJcbiAgICBsaW5rRWxlbWVudC5jbGljaygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaGFyZUJUTigpIHtcclxuXHRhbGVydCgn6KqN55yf55yL5a6M6Lez5Ye65L6G55qE6YKj6aCB5LiK6Z2i5a+r5LqG5LuA6bq8XFxuXFxu55yL5a6M5L2g5bCx5pyD55+l6YGT5L2g54K65LuA6bq85LiN6IO95oqT5YiG5LqrJyk7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCAnbWVzc2FnZV90YWdzJywgJ21lc3NhZ2UnLCAnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsICdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFsnY3JlYXRlZF90aW1lJywgJ2Zyb20nLCAnbWVzc2FnZScsICdzdG9yeSddLFxyXG5cdFx0bGlrZXM6IFsnbmFtZSddXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICcxNScsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnLFxyXG5cdFx0bGlrZXM6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3Y2LjAnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjYuMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJ3Y2LjAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjYuMCcsXHJcblx0XHRmZWVkOiAndjYuMCcsXHJcblx0XHRncm91cDogJ3Y2LjAnLFxyXG5cdFx0bmV3ZXN0OiAndjYuMCdcclxuXHR9LFxyXG5cdGZpbHRlcjoge1xyXG5cdFx0d29yZDogJycsXHJcblx0XHRyZWFjdDogJ2FsbCcsXHJcblx0XHRzdGFydFRpbWU6ICcyMDAwLTEyLTMxLTAwLTAwLTAwJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0b3JkZXI6ICdjaHJvbm9sb2dpY2FsJyxcclxuXHRhdXRoOiAnbWFuYWdlX3BhZ2VzLGdyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nLFxyXG5cdGxpa2VzOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG5cdHVzZXJUb2tlbjogJycsXHJcblx0ZnJvbV9leHRlbnNpb246IGZhbHNlLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJykgPT4ge1xyXG5cdFx0aWYgKHR5cGUgPT09ICcnKSB7XHJcblx0XHRcdGFkZExpbmsgPSB0cnVlO1xyXG5cdFx0XHR0eXBlID0gbGFzdENvbW1hbmQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZGRMaW5rID0gZmFsc2U7XHJcblx0XHRcdGxhc3RDb21tYW5kID0gdHlwZTtcclxuXHRcdH1cclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcgLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0Ly8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLnVzZXJUb2tlbiA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5hY2Nlc3NUb2tlbjtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRjb25maWcuZnJvbV9leHRlbnNpb24gPSBmYWxzZTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKSB7XHJcblx0XHRcdFx0aWYgKGF1dGhfc2NvcGUuaW5jbHVkZXMoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSl7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxyXG5cdFx0XHRcdFx0XHQnc3VjY2VzcydcclxuXHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+S7mOiyu+aOiOasiuaqouafpemMr+iqpO+8jOipsuWKn+iDvemcgOS7mOiyuycsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgSXQgaXMgYSBwYWlkIGZlYXR1cmUuJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT0gXCJwYWdlX3NlbGVjdG9yXCIpIHtcdFxyXG5cdFx0XHRcdHBhZ2Vfc2VsZWN0b3Iuc2hvdygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKSA9PiB7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRpZiAoYXV0aF9zY29wZS5pbmRleE9mKFwiZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mb1wiKSA8IDApIHtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZmIuYXV0aE9LKCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YXV0aE9LOiAoKSA9PiB7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGxldCBwb3N0ZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnBvc3RkYXRhKTtcclxuXHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0Y29tbWFuZDogcG9zdGRhdGEuY29tbWFuZCxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZSgkKFwiLmNocm9tZVwiKS52YWwoKSlcclxuXHRcdH1cclxuXHRcdGRhdGEucmF3ID0gZGF0YXM7XHJcblx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IFtdLFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5bos4fmlpnkuK0uLi4nKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGlmICghYWRkTGluaykge1xyXG5cdFx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JCgnLnB1cmVfZmJpZCcpLnRleHQoZmJpZC5mdWxsSUQpO1xyXG5cdFx0ZGF0YS5nZXQoZmJpZCkudGhlbigocmVzKSA9PiB7XHJcblx0XHRcdC8vIGZiaWQuZGF0YSA9IHJlcztcclxuXHRcdFx0Zm9yIChsZXQgaSBvZiByZXMpIHtcclxuXHRcdFx0XHRmYmlkLmRhdGEucHVzaChpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhLmZpbmlzaChmYmlkKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gZmJpZC5jb21tYW5kO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRmYmlkLmZ1bGxJRCA9IGZiaWQucHVyZUlEO1xyXG5cdFx0XHRcdGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcgJiYgZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnKSB7XHJcblx0XHRcdFx0ZmJpZC5mdWxsSUQgPSBmYmlkLnB1cmVJRDtcclxuXHRcdFx0XHRmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjb25maWcubGlrZXMpIGZiaWQuY29tbWFuZCA9ICdsaWtlcyc7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mZGVidWc9YWxsYCk7XHJcblx0XHRcdGxldCB0b2tlbiA9IGNvbmZpZy5wYWdlVG9rZW4gPT0gJycgPyBgJmFjY2Vzc190b2tlbj0ke2NvbmZpZy51c2VyVG9rZW59YDpgJmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59YDtcclxuXHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19Jm9yZGVyPSR7Y29uZmlnLm9yZGVyfSZmaWVsZHM9JHtjb25maWcuZmllbGRbZmJpZC5jb21tYW5kXS50b1N0cmluZygpfSR7dG9rZW59JmRlYnVnPWFsbGAsIChyZXMpID0+IHtcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJyArIGRhdGEubm93TGVuZ3RoICsgJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRpZiAoKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBmYmlkLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBkLm5hbWVcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChjb25maWcubGlrZXMpIGQudHlwZSA9IFwiTElLRVwiO1xyXG5cdFx0XHRcdFx0aWYgKGQuZnJvbSkge1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogZC5pZFxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0ID0gMCkge1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsICdsaW1pdD0nICsgbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZC5pZCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICgoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGZiaWQuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGQubmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYgKGQuZnJvbSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0Ly8gaWYgKGRhdGEubm93TGVuZ3RoIDwgMTgwKSB7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCkgPT4ge1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZmJpZCkgPT4ge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLnVwZGF0ZV9hcmVhLC5kb25hdGVfYXJlYVwiKS5zbGlkZVVwKCk7XHJcblx0XHQkKFwiLnJlc3VsdF9hcmVhXCIpLnNsaWRlRG93bigpO1xyXG5cdFx0aWYgKGRhdGEucmF3LnR5cGUgPT0gJ2dyb3VwJyl7XHJcblx0XHRcdGlmIChhdXRoX3Njb3BlLmluY2x1ZGVzKCdncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJykpe1xyXG5cdFx0XHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0XHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdFx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0XHRcdFx0dWkucmVzZXQoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdCfku5josrvmjojmrIrmqqLmn6XpjK/oqqTvvIzmipPnpL7lnJjosrzmlofpnIDku5josrsnLFxyXG5cdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBJdCBpcyBhIHBhaWQgZmVhdHVyZS4nLFxyXG5cdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdFx0XHR1aS5yZXNldCgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSkgPT4ge1xyXG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdC8vIGlmIChjb25maWcuZnJvbV9leHRlbnNpb24gPT09IGZhbHNlICYmIHJhd0RhdGEuY29tbWFuZCA9PT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0Ly8gXHRyYXdEYXRhLmRhdGEgPSByYXdEYXRhLmRhdGEuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0Ly8gXHRcdHJldHVybiBpdGVtLmlzX2hpZGRlbiA9PT0gZmFsc2VcclxuXHRcdC8vIFx0fSk7XHJcblx0XHQvLyB9XHJcblx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHJcblx0XHRyYXdEYXRhLmZpbHRlcmVkID0gbmV3RGF0YTtcclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShyYXdEYXRhKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiByYXdEYXRhO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpID0+IHtcclxuXHRcdHZhciBuZXdPYmogPSBbXTtcclxuXHRcdGNvbnNvbGUubG9nKHJhdyk7XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pIHtcclxuXHRcdFx0aWYgKHJhdy5jb21tYW5kID09ICdjb21tZW50cycpIHtcclxuXHRcdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA6YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMubWVzc2FnZSxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiOiB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi6KGo5oOFXCI6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIjogdGltZUNvbnZlcnRlcih0aGlzLmNyZWF0ZWRfdGltZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3T2JqO1xyXG5cdH0sXHJcblx0aW1wb3J0OiAoZmlsZSkgPT4ge1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHRcdFx0ZGF0YS5yYXcgPSBKU09OLnBhcnNlKHN0cik7XHJcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpID0+IHtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZmlsdGVyZGF0YSA9IHJhd2RhdGEuZmlsdGVyZWQ7XHJcblx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0bGV0IHBpYyA9ICQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGlmICgocmF3ZGF0YS5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IHJhd2RhdGEuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+6KGo5oOFPC90ZD5gO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5o6S5ZCNPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7liIbmlbg8L3RkPmA7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHQ8dGQ+6K6aPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBob3N0ID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nO1xyXG5cdFx0aWYgKGRhdGEucmF3LnR5cGUgPT09ICd1cmxfY29tbWVudHMnKSBob3N0ID0gJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSArICc/ZmJfY29tbWVudF9pZD0nO1xyXG5cclxuXHRcdGZvciAobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmRhdGEuZW50cmllcygpKSB7XHJcblx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdGlmIChwaWMpIHtcclxuXHRcdFx0XHRwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdGlmICgocmF3ZGF0YS5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IHJhd2RhdGEuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpIHtcclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJykge1xyXG5cdFx0XHRcdHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdFx0ICA8dGQ+PGEgaHJlZj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHQgIDx0ZD4ke3ZhbC5zY29yZX08L3RkPmA7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IGxpbmsgPSB2YWwuaWQ7XHJcblx0XHRcdFx0aWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbikge1xyXG5cdFx0XHRcdFx0bGluayA9IHZhbC5wb3N0bGluaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cIiR7aG9zdH0ke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblxyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpIHtcclxuXHRcdFx0VEFCTEUgPSAkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JChcIiNzZWFyY2hOYW1lXCIpLm9uKCdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUQUJMRVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQkKFwiI3NlYXJjaENvbW1lbnRcIikub24oJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpID0+IHtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjaG9vc2UgPSB7XHJcblx0ZGF0YTogW10sXHJcblx0YXdhcmQ6IFtdLFxyXG5cdG51bTogMCxcclxuXHRkZXRhaWw6IGZhbHNlLFxyXG5cdGxpc3Q6IFtdLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcclxuXHRcdGNob29zZS5saXN0ID0gW107XHJcblx0XHRjaG9vc2UubnVtID0gMDtcclxuXHRcdGlmICgkKFwiI3NlYXJjaENvbW1lbnRcIikudmFsKCkgIT0gJycpIHtcclxuXHRcdFx0dGFibGUucmVkbygpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApIHtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XCJuYW1lXCI6IHAsXHJcblx0XHRcdFx0XHRcdFwibnVtXCI6IG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKCk7XHJcblx0fSxcclxuXHRnbzogKCkgPT4ge1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGEuZmlsdGVyZWQubGVuZ3RoKS5zcGxpY2UoMCwgY2hvb3NlLm51bSk7XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRjaG9vc2UuYXdhcmQubWFwKCh2YWwsIGluZGV4KSA9PiB7XHJcblx0XHRcdGluc2VydCArPSAnPHRyIHRpdGxlPVwi56ysJyArIChpbmRleCArIDEpICsgJ+WQjVwiPicgKyAkKCcubWFpbl90YWJsZScpLkRhdGFUYWJsZSgpLnJvd3Moe1xyXG5cdFx0XHRcdHNlYXJjaDogJ2FwcGxpZWQnXHJcblx0XHRcdH0pLm5vZGVzKClbdmFsXS5pbm5lckhUTUwgKyAnPC90cj4nO1xyXG5cdFx0fSlcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKGluc2VydCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHJcblx0XHRpZiAoY2hvb3NlLmRldGFpbCkge1xyXG5cdFx0XHRsZXQgbm93ID0gMDtcclxuXHRcdFx0Zm9yIChsZXQgayBpbiBjaG9vc2UubGlzdCkge1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiNVwiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcclxuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fSxcclxuXHRnZW5fYmlnX2F3YXJkOiAoKSA9PiB7XHJcblx0XHRsZXQgbGkgPSAnJztcclxuXHRcdGxldCBhd2FyZHMgPSBbXTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGJvZHkgdHInKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgdmFsKSB7XHJcblx0XHRcdGxldCBhd2FyZCA9IHt9O1xyXG5cdFx0XHRpZiAodmFsLmhhc0F0dHJpYnV0ZSgndGl0bGUnKSkge1xyXG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSBmYWxzZTtcclxuXHRcdFx0XHRhd2FyZC5uYW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC51c2VyaWQgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgxKS5maW5kKCdhJykuYXR0cignaHJlZicpLnJlcGxhY2UoJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nLCAnJyk7XHJcblx0XHRcdFx0YXdhcmQubWVzc2FnZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDIpLmZpbmQoJ2EnKS50ZXh0KCk7XHJcblx0XHRcdFx0YXdhcmQubGluayA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDIpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJyk7XHJcblx0XHRcdFx0YXdhcmQudGltZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKCQodmFsKS5maW5kKCd0ZCcpLmxlbmd0aCAtIDEpLnRleHQoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhd2FyZC5hd2FyZF9uYW1lID0gdHJ1ZTtcclxuXHRcdFx0XHRhd2FyZC5uYW1lID0gJCh2YWwpLmZpbmQoJ3RkJykudGV4dCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF3YXJkcy5wdXNoKGF3YXJkKTtcclxuXHRcdH0pO1xyXG5cdFx0Zm9yIChsZXQgaSBvZiBhd2FyZHMpIHtcclxuXHRcdFx0aWYgKGkuYXdhcmRfbmFtZSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdGxpICs9IGA8bGkgY2xhc3M9XCJwcml6ZU5hbWVcIj4ke2kubmFtZX08L2xpPmA7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGkgKz0gYDxsaT5cclxuXHRcdFx0XHQ8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+PGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfS9waWN0dXJlP3R5cGU9bGFyZ2UmYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn1cIiBhbHQ9XCJcIj48L2E+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cImluZm9cIj5cclxuXHRcdFx0XHQ8cCBjbGFzcz1cIm5hbWVcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLm5hbWV9PC9hPjwvcD5cclxuXHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIj48YSBocmVmPVwiJHtpLmxpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLm1lc3NhZ2V9PC9hPjwvcD5cclxuXHRcdFx0XHQ8cCBjbGFzcz1cInRpbWVcIj48YSBocmVmPVwiJHtpLmxpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLnRpbWV9PC9hPjwvcD5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2xpPmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJy5iaWdfYXdhcmQgdWwnKS5hcHBlbmQobGkpO1xyXG5cdFx0JCgnLmJpZ19hd2FyZCcpLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0fSxcclxuXHRjbG9zZV9iaWdfYXdhcmQ6ICgpID0+IHtcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmVtcHR5KCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmJpZCA9IHtcclxuXHRmYmlkOiBbXSxcclxuXHRpbml0OiAodHlwZSkgPT4ge1xyXG5cdFx0ZmJpZC5mYmlkID0gW107XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdEZCLmFwaShcIi9tZVwiLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdGRhdGEudXNlcmlkID0gcmVzLmlkO1xyXG5cdFx0XHRsZXQgdXJsID0gJyc7XHJcblx0XHRcdGlmIChhZGRMaW5rKSB7XHJcblx0XHRcdFx0dXJsID0gZmJpZC5mb3JtYXQoJCgnLm1vcmVsaW5rIC5hZGR1cmwnKS52YWwoKSk7XHJcblx0XHRcdFx0JCgnLm1vcmVsaW5rIC5hZGR1cmwnKS52YWwoJycpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHVybCA9IGZiaWQuZm9ybWF0KCQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh1cmwuaW5kZXhPZignLnBocD8nKSA9PT0gLTEgJiYgdXJsLmluZGV4T2YoJz8nKSA+IDApIHtcclxuXHRcdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKCc/JykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZiaWQuZ2V0KHVybCwgdHlwZSkudGhlbigoZmJpZCkgPT4ge1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC8vICQoJy5pZGVudGl0eScpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChg55m75YWl6Lqr5Lu977yaPGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Jlcy5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PHNwYW4+JHtyZXMubmFtZX08L3NwYW4+YCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKHVybCwgdHlwZSkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0bGV0IG5ld3VybCA9IHVybC5zdWJzdHIodXJsLmluZGV4T2YoJy8nLCAyOCkgKyAxLCAyMDApO1xyXG5cdFx0XHQvLyBodHRwczovL3d3dy5mYWNlYm9vay5jb20vIOWFsTI15a2X5YWD77yM5Zug5q2k6YG4Mjjplovlp4vmib4vXHJcblx0XHRcdGxldCByZXN1bHQgPSBuZXd1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XHJcblx0XHRcdGZiaWQuY2hlY2tQYWdlSUQodXJsLCB1cmx0eXBlKS50aGVuKChpZCkgPT4ge1xyXG5cdFx0XHRcdGlmIChpZCA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XHJcblx0XHRcdFx0XHRpZCA9IGRhdGEudXNlcmlkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0cGFnZUlEOiBpZCxcclxuXHRcdFx0XHRcdHR5cGU6IHVybHR5cGUsXHJcblx0XHRcdFx0XHRjb21tYW5kOiB0eXBlLFxyXG5cdFx0XHRcdFx0ZGF0YTogW11cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmIChhZGRMaW5rKSBvYmouZGF0YSA9IGRhdGEucmF3LmRhdGE7IC8v6L+95Yqg6LK85paHXHJcblx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdmYmlkPScpO1xyXG5cdFx0XHRcdFx0aWYgKHN0YXJ0ID49IDApIHtcclxuXHRcdFx0XHRcdFx0bGV0IGVuZCA9IHVybC5pbmRleE9mKFwiJlwiLCBzdGFydCk7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0ICsgNSwgZW5kKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdwb3N0cy8nKTtcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQgKyA2LCB1cmwubGVuZ3RoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCB2aWRlbyA9IHVybC5pbmRleE9mKCd2aWRlb3MvJyk7XHJcblx0XHRcdFx0XHRpZiAodmlkZW8gPj0gMCkge1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3B1cmUnKSB7XHJcblx0XHRcdFx0XHRvYmouZnVsbElEID0gdXJsLnJlcGxhY2UoL1xcXCIvZywgJycpO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ2dyb3VwJykge1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgXCJfXCIgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAncGhvdG8nKSB7XHJcblx0XHRcdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICd2aWRlbycpIHtcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdEZCLmFwaShgLyR7b2JqLnB1cmVJRH0/ZmllbGRzPWxpdmVfc3RhdHVzYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXMubGl2ZV9zdGF0dXMgPT09ICdMSVZFJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdEZCLmFwaShgLyR7b2JqLnBhZ2VJRH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjaGVja1R5cGU6IChwb3N0dXJsKSA9PiB7XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCkge1xyXG5cdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdwZXJtYWxpbmsnKSA+PSAwKSB7XHJcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiAncGVyc29uYWwnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9ncm91cHMvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdncm91cCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImV2ZW50c1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAnZXZlbnQnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvcGhvdG9zL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAncGhvdG8nO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvdmlkZW9zL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAndmlkZW8nO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignXCInKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAncHVyZSc7XHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICdub3JtYWwnO1xyXG5cdH0sXHJcblx0Y2hlY2tQYWdlSUQ6IChwb3N0dXJsLCB0eXBlKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgc3RhcnQgPSBwb3N0dXJsLmluZGV4T2YoXCJmYWNlYm9vay5jb21cIikgKyAxMztcclxuXHRcdFx0bGV0IGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIiwgc3RhcnQpO1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRpZiAoZW5kIDwgMCkge1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ2ZiaWQ9JykgPj0gMCkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICd1bm5hbWUnKSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3VubmFtZScpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShwb3N0dXJsLm1hdGNoKHJlZ2V4KVsxXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBncm91cCA9IHBvc3R1cmwuaW5kZXhPZignL2dyb3Vwcy8nKTtcclxuXHRcdFx0XHRsZXQgZXZlbnQgPSBwb3N0dXJsLmluZGV4T2YoJy9ldmVudHMvJylcclxuXHRcdFx0XHRpZiAoZ3JvdXAgPj0gMCkge1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBncm91cCArIDg7XHJcblx0XHRcdFx0XHRlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsIHN0YXJ0KTtcclxuXHRcdFx0XHRcdGxldCByZWdleDIgPSAvXFxkezYsfS9nO1xyXG5cdFx0XHRcdFx0bGV0IHRlbXAgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcclxuXHRcdFx0XHRcdGlmIChyZWdleDIudGVzdCh0ZW1wKSkge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRlbXApO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgnZ3JvdXAnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYgKGV2ZW50ID49IDApIHtcclxuXHRcdFx0XHRcdHJlc29sdmUoJ2V2ZW50Jyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHZhciBwYWdlbmFtZSA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xyXG5cdFx0XHRcdFx0RkIuYXBpKGAvJHtwYWdlbmFtZX0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdGZiZXJyb3IgPSByZXMuZXJyb3IubWVzc2FnZTtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShyZXMuaWQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Zm9ybWF0OiAodXJsKSA9PiB7XHJcblx0XHRpZiAodXJsLmluZGV4T2YoJ2J1c2luZXNzLmZhY2Vib29rLmNvbS8nKSA+PSAwKSB7XHJcblx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3ZGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgc3RhcnRUaW1lLCBlbmRUaW1lKSA9PiB7XHJcblx0XHRsZXQgZGF0YSA9IHJhd2RhdGEuZGF0YTtcclxuXHRcdGlmICh3b3JkICE9PSAnJykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50YWcoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAoKHJhd2RhdGEuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCByYXdkYXRhLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIHN0YXJ0VGltZSwgZW5kVGltZSk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKSA9PiB7XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmIChrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0aWYgKG4uc3RvcnkuaW5kZXhPZih3b3JkKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSkgPT4ge1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3MpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHN0LCB0KSA9PiB7XHJcblx0XHRsZXQgdGltZV9hcnkyID0gc3Quc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgZW5kdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwgKHBhcnNlSW50KHRpbWVfYXJ5WzFdKSAtIDEpLCB0aW1lX2FyeVsyXSwgdGltZV9hcnlbM10sIHRpbWVfYXJ5WzRdLCB0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IHN0YXJ0dGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeTJbMF0sIChwYXJzZUludCh0aW1lX2FyeTJbMV0pIC0gMSksIHRpbWVfYXJ5MlsyXSwgdGltZV9hcnkyWzNdLCB0aW1lX2FyeTJbNF0sIHRpbWVfYXJ5Mls1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKChjcmVhdGVkX3RpbWUgPiBzdGFydHRpbWUgJiYgY3JlYXRlZF90aW1lIDwgZW5kdGltZSkgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIikge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcikgPT4ge1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJykge1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcikge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKSA9PiB7XHJcblxyXG5cdH0sXHJcblx0YWRkTGluazogKCkgPT4ge1xyXG5cdFx0bGV0IHRhciA9ICQoJy5pbnB1dGFyZWEgLm1vcmVsaW5rJyk7XHJcblx0XHRpZiAodGFyLmhhc0NsYXNzKCdzaG93JykpIHtcclxuXHRcdFx0dGFyLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YXIuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlc2V0OiAoKSA9PiB7XHJcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XHJcblx0XHRpZiAoKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpIHtcclxuXHRcdFx0JCgnbGFiZWwudGFnJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICgkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKSkge1xyXG5cdFx0XHRcdCQoXCIjdGFnXCIpLmNsaWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnbGFiZWwudGFnJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxubGV0IHBhZ2Vfc2VsZWN0b3IgPSB7XHJcblx0cGFnZXM6IFtdLFxyXG5cdGdyb3VwczogW10sXHJcblx0c2hvdzogKCk9PntcclxuXHRcdCQoJy5wYWdlX3NlbGVjdG9yJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdHBhZ2Vfc2VsZWN0b3IuZ2V0QWRtaW4oKTtcclxuXHR9LFxyXG5cdGdldEFkbWluOiAoKT0+e1xyXG5cdFx0UHJvbWlzZS5hbGwoW3BhZ2Vfc2VsZWN0b3IuZ2V0UGFnZSgpLCBwYWdlX3NlbGVjdG9yLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XHJcblx0XHRcdHBhZ2Vfc2VsZWN0b3IuZ2VuQWRtaW4ocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2ZpZWxkcz1uYW1lLGlkLGFkbWluaXN0cmF0b3ImbGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlIChyZXMuZGF0YS5maWx0ZXIoaXRlbT0+e3JldHVybiBpdGVtLmFkbWluaXN0cmF0b3IgPT09IHRydWV9KSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5BZG1pbjogKHJlcyk9PntcclxuXHRcdGxldCBwYWdlcyA9ICcnO1xyXG5cdFx0bGV0IGdyb3VwcyA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJlc1swXSl7XHJcblx0XHRcdHBhZ2VzICs9IGA8ZGl2IGNsYXNzPVwicGFnZV9idG5cIiBkYXRhLXR5cGU9XCIxXCIgZGF0YS12YWx1ZT1cIiR7aS5pZH1cIiBvbmNsaWNrPVwicGFnZV9zZWxlY3Rvci5zZWxlY3RQYWdlKHRoaXMpXCI+JHtpLm5hbWV9PC9kaXY+YDtcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiByZXNbMV0pe1xyXG5cdFx0XHRncm91cHMgKz0gYDxkaXYgY2xhc3M9XCJwYWdlX2J0blwiIGRhdGEtdHlwZT1cIjJcIiBkYXRhLXZhbHVlPVwiJHtpLmlkfVwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBhZ2UodGhpcylcIj4ke2kubmFtZX08L2Rpdj5gO1xyXG5cdFx0fVxyXG5cdFx0JCgnLnNlbGVjdF9wYWdlJykuaHRtbChwYWdlcyk7XHJcblx0XHQkKCcuc2VsZWN0X2dyb3VwJykuaHRtbChncm91cHMpO1xyXG5cdH0sXHJcblx0c2VsZWN0UGFnZTogKHRhcmdldCk9PntcclxuXHRcdGxldCBwYWdlX2lkID0gJCh0YXJnZXQpLmRhdGEoJ3ZhbHVlJyk7XHJcblx0XHQkKCcjcG9zdF90YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0JCgnLmZiX2xvYWRpbmcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0RkIuYXBpKGAvJHtwYWdlX2lkfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlX2lkfS9saXZlX3ZpZGVvcz9maWVsZHM9c3RhdHVzLHBlcm1hbGlua191cmwsdGl0bGUsY3JlYXRpb25fdGltZWAsIChyZXMpPT57XHJcblx0XHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0XHRmb3IobGV0IHRyIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRpZiAodHIuc3RhdHVzID09PSAnTElWRScpe1xyXG5cdFx0XHRcdFx0dGhlYWQgKz0gYDx0cj48dGQ+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UG9zdCgnJHt0ci5pZH0nKVwiPumBuOaTh+iyvOaWhzwvYnV0dG9uPihMSVZFKTwvdGQ+PHRkPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20ke3RyLnBlcm1hbGlua191cmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt0ci50aXRsZX08L2E+PC90ZD48dGQ+JHt0aW1lQ29udmVydGVyKHRyLmNyZWF0ZWRfdGltZSl9PC90ZD48L3RyPmA7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0aGVhZCArPSBgPHRyPjx0ZD48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbmNsaWNrPVwicGFnZV9zZWxlY3Rvci5zZWxlY3RQb3N0KCcke3RyLmlkfScpXCI+6YG45pOH6LK85paHPC9idXR0b24+PC90ZD48dGQ+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbSR7dHIucGVybWFsaW5rX3VybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3RyLnRpdGxlfTwvYT48L3RkPjx0ZD4ke3RpbWVDb252ZXJ0ZXIodHIuY3JlYXRlZF90aW1lKX08L3RkPjwvdHI+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnI3Bvc3RfdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdH0pO1xyXG5cdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlX2lkfS9mZWVkP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdCQoJy5mYl9sb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRcdGZvcihsZXQgdHIgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdHRib2R5ICs9IGA8dHI+PHRkPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBvc3QoJyR7dHIuaWR9JylcIj7pgbjmk4fosrzmloc8L2J1dHRvbj48L3RkPjx0ZD48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dHIuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt0ci5tZXNzYWdlfTwvYT48L3RkPjx0ZD4ke3RpbWVDb252ZXJ0ZXIodHIuY3JlYXRlZF90aW1lKX08L3RkPjwvdHI+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCcjcG9zdF90YWJsZSB0Ym9keScpLmh0bWwodGJvZHkpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzZWxlY3RQb3N0OiAoZmJpZCk9PntcclxuXHRcdCQoJy5wYWdlX3NlbGVjdG9yJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCQoJy5zZWxlY3RfcGFnZScpLmh0bWwoJycpO1xyXG5cdFx0JCgnLnNlbGVjdF9ncm91cCcpLmh0bWwoJycpO1xyXG5cdFx0JCgnI3Bvc3RfdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGxldCBpZCA9ICdcIicrZmJpZCsnXCInO1xyXG5cdFx0JCgnI2VudGVyVVJMIC51cmwnKS52YWwoaWQpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKSB7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSArIDE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyICsgXCItXCIgKyBtb250aCArIFwiLVwiICsgZGF0ZSArIFwiLVwiICsgaG91ciArIFwiLVwiICsgbWluICsgXCItXCIgKyBzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApIHtcclxuXHR2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcblx0dmFyIG1vbnRocyA9IFsnMDEnLCAnMDInLCAnMDMnLCAnMDQnLCAnMDUnLCAnMDYnLCAnMDcnLCAnMDgnLCAnMDknLCAnMTAnLCAnMTEnLCAnMTInXTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdGlmIChkYXRlIDwgMTApIHtcclxuXHRcdGRhdGUgPSBcIjBcIiArIGRhdGU7XHJcblx0fVxyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHRpZiAobWluIDwgMTApIHtcclxuXHRcdG1pbiA9IFwiMFwiICsgbWluO1xyXG5cdH1cclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0aWYgKHNlYyA8IDEwKSB7XHJcblx0XHRzZWMgPSBcIjBcIiArIHNlYztcclxuXHR9XHJcblx0dmFyIHRpbWUgPSB5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBkYXRlICsgXCIgXCIgKyBob3VyICsgJzonICsgbWluICsgJzonICsgc2VjO1xyXG5cdHJldHVybiB0aW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvYmoyQXJyYXkob2JqKSB7XHJcblx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuXHR9KTtcclxuXHRyZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcblx0dmFyIGksIHIsIHQ7XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0YXJ5W2ldID0gaTtcclxuXHR9XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG5cdFx0dCA9IGFyeVtyXTtcclxuXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuXHRcdGFyeVtpXSA9IHQ7XHJcblx0fVxyXG5cdHJldHVybiBhcnk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG5cdC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcblx0dmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG5cclxuXHR2YXIgQ1NWID0gJyc7XHJcblx0Ly9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcblxyXG5cdC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuXHQvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG5cdGlmIChTaG93TGFiZWwpIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuXHJcblx0XHRcdC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRcdHJvdyArPSBpbmRleCArICcsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG5cclxuXHRcdC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcblx0XHRcdHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG5cclxuXHRcdC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0aWYgKENTViA9PSAnJykge1xyXG5cdFx0YWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcblx0dmFyIGZpbGVOYW1lID0gXCJcIjtcclxuXHQvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuXHRmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csIFwiX1wiKTtcclxuXHJcblx0Ly9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuXHR2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG5cclxuXHQvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuXHQvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG5cdC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG5cdC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcblxyXG5cdC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG5cdGxpbmsuaHJlZiA9IHVyaTtcclxuXHJcblx0Ly9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuXHRsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG5cdGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG5cclxuXHQvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcblx0bGluay5jbGljaygpO1xyXG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
