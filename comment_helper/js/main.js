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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwiZmJlcnJvciIsIndpbmRvdyIsIm9uZXJyb3IiLCJoYW5kbGVFcnIiLCJUQUJMRSIsImxhc3RDb21tYW5kIiwiYWRkTGluayIsImF1dGhfc2NvcGUiLCJtc2ciLCJ1cmwiLCJsIiwiJCIsInZhbCIsImNvbnNvbGUiLCJsb2ciLCJhcHBlbmQiLCJmYWRlSW4iLCJkb2N1bWVudCIsInJlYWR5IiwiaGFzaCIsImxvY2F0aW9uIiwic2VhcmNoIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwiZGF0YSIsImV4dGVuc2lvbiIsImNsaWNrIiwiZSIsImZiIiwiZXh0ZW5zaW9uQXV0aCIsImRhdGFzIiwiY29tbWFuZCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsInJhbmtlciIsInJhdyIsImZpbmlzaCIsImdldEF1dGgiLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJsaWtlcyIsImNob29zZSIsImluaXQiLCJ1aSIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJmaWx0ZXIiLCJyZWFjdCIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJzdGFydFRpbWUiLCJmb3JtYXQiLCJlbmRUaW1lIiwic2V0U3RhcnREYXRlIiwiZmlsdGVyRGF0YSIsImV4cG9ydFRvSnNvbkZpbGUiLCJleGNlbFN0cmluZyIsImV4Y2VsIiwic3RyaW5naWZ5IiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwianNvbkRhdGEiLCJkYXRhU3RyIiwiZGF0YVVyaSIsImVuY29kZVVSSUNvbXBvbmVudCIsImV4cG9ydEZpbGVEZWZhdWx0TmFtZSIsImxpbmtFbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsInNoYXJlQlROIiwiYWxlcnQiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJuZXdlc3QiLCJ3b3JkIiwibm93RGF0ZSIsImF1dGgiLCJwYWdlVG9rZW4iLCJ1c2VyVG9rZW4iLCJmcm9tX2V4dGVuc2lvbiIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJhdXRoX3R5cGUiLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJhY2Nlc3NUb2tlbiIsImdyYW50ZWRTY29wZXMiLCJpbmNsdWRlcyIsInN3YWwiLCJkb25lIiwicGFnZV9zZWxlY3RvciIsInNob3ciLCJmYmlkIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJ0aXRsZSIsImh0bWwiLCJhdXRoT0siLCJwb3N0ZGF0YSIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwiZ2V0IiwidGhlbiIsInJlcyIsImkiLCJwdXNoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwcm9taXNlX2FycmF5IiwicHVyZUlEIiwidG9TdHJpbmciLCJ0b2tlbiIsImFwaSIsImxlbmd0aCIsImQiLCJmcm9tIiwiaWQiLCJuYW1lIiwidXBkYXRlZF90aW1lIiwiY3JlYXRlZF90aW1lIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwibWVzc2FnZSIsInN0b3J5IiwidGltZUNvbnZlcnRlciIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJzdHIiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsImZpbHRlcmRhdGEiLCJ0aGVhZCIsInRib2R5IiwicGljIiwiaG9zdCIsImVudHJpZXMiLCJqIiwicGljdHVyZSIsInRkIiwic2NvcmUiLCJsaW5rIiwibGlrZV9jb3VudCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInZhbHVlIiwiZHJhdyIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsIm4iLCJwYXJzZUludCIsImZpbmQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsIm1hcCIsImluZGV4Iiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwibm93IiwiayIsInRhciIsImVxIiwiaW5zZXJ0QmVmb3JlIiwiZ2VuX2JpZ19hd2FyZCIsImxpIiwiYXdhcmRzIiwiaGFzQXR0cmlidXRlIiwiYXdhcmRfbmFtZSIsImF0dHIiLCJ0aW1lIiwiY2xvc2VfYmlnX2F3YXJkIiwiZW1wdHkiLCJzdWJzdHJpbmciLCJyZWdleCIsIm5ld3VybCIsInN1YnN0ciIsIm1hdGNoIiwidXJsdHlwZSIsImNoZWNrVHlwZSIsImNoZWNrUGFnZUlEIiwib2JqIiwicGFnZUlEIiwidmlkZW8iLCJsaXZlX3N0YXR1cyIsImVycm9yIiwiYWNjZXNzX3Rva2VuIiwicG9zdHVybCIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJ0YWciLCJ1bmlxdWUiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJuZXdBcnkiLCJncmVwIiwidW5kZWZpbmVkIiwibWVzc2FnZV90YWdzIiwic3QiLCJ0IiwidGltZV9hcnkyIiwic3BsaXQiLCJ0aW1lX2FyeSIsImVuZHRpbWUiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJzdGFydHRpbWUiLCJwYWdlcyIsImdyb3VwcyIsImdldEFkbWluIiwiYWxsIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwiZ2VuQWRtaW4iLCJhZG1pbmlzdHJhdG9yIiwic2VsZWN0UGFnZSIsInBhZ2VfaWQiLCJwZXJtYWxpbmtfdXJsIiwic2VsZWN0UG9zdCIsImEiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQSxJQUFJQyxVQUFVLEVBQWQ7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQkMsU0FBakI7QUFDQSxJQUFJQyxLQUFKO0FBQ0EsSUFBSUMsY0FBYyxVQUFsQjtBQUNBLElBQUlDLFVBQVUsS0FBZDtBQUNBLElBQUlDLGFBQWEsRUFBakI7O0FBRUEsU0FBU0osU0FBVCxDQUFtQkssR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxDQUE3QixFQUFnQztBQUMvQixLQUFJLENBQUNYLFlBQUwsRUFBbUI7QUFDbEIsTUFBSVUsT0FBTUUsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBVjtBQUNBQyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBaUQsNEJBQWpEO0FBQ0FELFVBQVFDLEdBQVIsQ0FBWSxzQkFBc0JMLElBQWxDO0FBQ0FFLElBQUUsaUJBQUYsRUFBcUJJLE1BQXJCLGNBQXVDZixPQUF2QyxnQkFB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QUFaLENBQW9CLElBQXBCLEVBQTBCLEdBQTFCLENBQVo7O0FBRUE7QUFDQSxLQUFJbUssTUFBTSx1Q0FBdUNDLFVBQVVMLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJckgsT0FBT2xMLFNBQVMrRCxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQW1ILE1BQUsySCxJQUFMLEdBQVlGLEdBQVo7O0FBRUE7QUFDQXpILE1BQUs0SCxLQUFMLEdBQWEsbUJBQWI7QUFDQTVILE1BQUs2SCxRQUFMLEdBQWdCTCxXQUFXLE1BQTNCOztBQUVBO0FBQ0ExUyxVQUFTZ1QsSUFBVCxDQUFjQyxXQUFkLENBQTBCL0gsSUFBMUI7QUFDQUEsTUFBS3pLLEtBQUw7QUFDQVQsVUFBU2dULElBQVQsQ0FBY0UsV0FBZCxDQUEwQmhJLElBQTFCO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxudmFyIGZiZXJyb3IgPSAnJztcclxud2luZG93Lm9uZXJyb3IgPSBoYW5kbGVFcnI7XHJcbnZhciBUQUJMRTtcclxudmFyIGxhc3RDb21tYW5kID0gJ2NvbW1lbnRzJztcclxudmFyIGFkZExpbmsgPSBmYWxzZTtcclxudmFyIGF1dGhfc2NvcGUgPSAnJztcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csIHVybCwgbCkge1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKSB7XHJcblx0XHRsZXQgdXJsID0gJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIiwgXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXIgVVJM77yaIFwiICsgdXJsKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuYXBwZW5kKGA8YnI+PGJyPiR7ZmJlcnJvcn08YnI+PGJyPiR7dXJsfWApO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5zZWFyY2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImV4dGVuc2lvblwiKSA+PSAwKSB7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGRhdGEuZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0aWYgKGhhc2guaW5kZXhPZihcInJhbmtlclwiKSA+PSAwKSB7XHJcblx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdGNvbW1hbmQ6ICdyYW5rZXInLFxyXG5cdFx0XHRkYXRhOiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5yYW5rZXIpXHJcblx0XHR9XHJcblx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdH1cclxuXHJcblx0JChcIiNidG5fcGFnZV9zZWxlY3RvclwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgncGFnZV9zZWxlY3RvcicpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLmxpa2VzID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRmYi5nZXRBdXRoKCd1cmxfY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHQkKFwiI21vcmVwb3N0XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdHVpLmFkZExpbmsoKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLopIfoo73ooajmoLzlhaflrrlcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS9NTS9ERCBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSwgZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLnN0YXJ0VGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gZW5kLmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUoY29uZmlnLmZpbHRlci5zdGFydFRpbWUpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRleHBvcnRUb0pzb25GaWxlKGZpbHRlckRhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gaWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCkge1xyXG5cdFx0XHQvLyBcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQvLyB9IGVsc2Uge1xyXG5cdFx0XHQvLyBcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGEpLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpIHtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBleHBvcnRUb0pzb25GaWxlKGpzb25EYXRhKSB7XHJcbiAgICBsZXQgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KGpzb25EYXRhKTtcclxuICAgIGxldCBkYXRhVXJpID0gJ2RhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04LCcrIGVuY29kZVVSSUNvbXBvbmVudChkYXRhU3RyKTtcclxuICAgIFxyXG4gICAgbGV0IGV4cG9ydEZpbGVEZWZhdWx0TmFtZSA9ICdkYXRhLmpzb24nO1xyXG4gICAgXHJcbiAgICBsZXQgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBkYXRhVXJpKTtcclxuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBleHBvcnRGaWxlRGVmYXVsdE5hbWUpO1xyXG4gICAgbGlua0VsZW1lbnQuY2xpY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2hhcmVCVE4oKSB7XHJcblx0YWxlcnQoJ+iqjeecn+eci+WujOi3s+WHuuS+hueahOmCo+mggeS4iumdouWvq+S6huS7gOm6vFxcblxcbueci+WujOS9oOWwseacg+efpemBk+S9oOeCuuS7gOm6vOS4jeiDveaKk+WIhuS6qycpO1xyXG59XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywgJ21lc3NhZ2VfdGFncycsICdtZXNzYWdlJywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCAnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbJ2NyZWF0ZWRfdGltZScsICdmcm9tJywgJ21lc3NhZ2UnLCAnc3RvcnknXSxcclxuXHRcdGxpa2VzOiBbJ25hbWUnXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnMTUnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJyxcclxuXHRcdGxpa2VzOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Ni4wJyxcclxuXHRcdHJlYWN0aW9uczogJ3Y2LjAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Ni4wJyxcclxuXHRcdHVybF9jb21tZW50czogJ3Y2LjAnLFxyXG5cdFx0ZmVlZDogJ3Y2LjAnLFxyXG5cdFx0Z3JvdXA6ICd2Ni4wJyxcclxuXHRcdG5ld2VzdDogJ3Y2LjAnXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0c3RhcnRUaW1lOiAnMjAwMC0xMi0zMS0wMC0wMC0wMCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnY2hyb25vbG9naWNhbCcsXHJcblx0YXV0aDogJ21hbmFnZV9wYWdlcyxncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJyxcclxuXHRsaWtlczogZmFsc2UsXHJcblx0cGFnZVRva2VuOiAnJyxcclxuXHR1c2VyVG9rZW46ICcnLFxyXG5cdGZyb21fZXh0ZW5zaW9uOiBmYWxzZSxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdHVzZXJfcG9zdHM6IGZhbHNlLFxyXG5cdGdldEF1dGg6ICh0eXBlID0gJycpID0+IHtcclxuXHRcdGlmICh0eXBlID09PSAnJykge1xyXG5cdFx0XHRhZGRMaW5rID0gdHJ1ZTtcclxuXHRcdFx0dHlwZSA9IGxhc3RDb21tYW5kO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YWRkTGluayA9IGZhbHNlO1xyXG5cdFx0XHRsYXN0Q29tbWFuZCA9IHR5cGU7XHJcblx0XHR9XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRhdXRoX3R5cGU6ICdyZXJlcXVlc3QnICxcclxuXHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpID0+IHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbmZpZy51c2VyVG9rZW4gPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuYWNjZXNzVG9rZW47XHJcblx0XHRcdGF1dGhfc2NvcGUgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gZmFsc2U7XHJcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIikge1xyXG5cdFx0XHRcdGlmIChhdXRoX3Njb3BlLmluY2x1ZGVzKCdncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJykpe1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+S7mOiyu+aOiOasiuWujOaIkO+8jOiri+WGjeasoeWft+ihjOaKk+eVmeiogCcsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZpbmlzaGVkISBQbGVhc2UgZ2V0Q29tbWVudHMgYWdhaW4uJyxcclxuXHRcdFx0XHRcdFx0J3N1Y2Nlc3MnXHJcblx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrmqqLmn6XpjK/oqqTvvIzoqbLlip/og73pnIDku5josrsnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIEl0IGlzIGEgcGFpZCBmZWF0dXJlLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09IFwicGFnZV9zZWxlY3RvclwiKSB7XHRcclxuXHRcdFx0XHRwYWdlX3NlbGVjdG9yLnNob3coKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmYi51c2VyX3Bvc3RzID0gdHJ1ZTtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQXV0aDogKCkgPT4ge1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdH0sIHtcclxuXHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkNhbGxiYWNrOiAocmVzcG9uc2UpID0+IHtcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRcdGF1dGhfc2NvcGUgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKGF1dGhfc2NvcGUuaW5kZXhPZihcImdyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm9cIikgPCAwKSB7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZiLmF1dGhPSygpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGF1dGhPSzogKCkgPT4ge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgcG9zdGRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5wb3N0ZGF0YSk7XHJcblx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdGNvbW1hbmQ6IHBvc3RkYXRhLmNvbW1hbmQsXHJcblx0XHRcdGRhdGE6IEpTT04ucGFyc2UoJChcIi5jaHJvbWVcIikudmFsKCkpXHJcblx0XHR9XHJcblx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiBbXSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W6LOH5paZ5LitLi4uJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRpZiAoIWFkZExpbmspIHtcclxuXHRcdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCkgPT4ge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoJy5wdXJlX2ZiaWQnKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEuZ2V0KGZiaWQpLnRoZW4oKHJlcykgPT4ge1xyXG5cdFx0XHQvLyBmYmlkLmRhdGEgPSByZXM7XHJcblx0XHRcdGZvciAobGV0IGkgb2YgcmVzKSB7XHJcblx0XHRcdFx0ZmJpZC5kYXRhLnB1c2goaSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YS5maW5pc2goZmJpZCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgY29tbWFuZCA9IGZiaWQuY29tbWFuZDtcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJyl7XHJcblx0XHRcdFx0ZmJpZC5mdWxsSUQgPSBmYmlkLnB1cmVJRDtcclxuXHRcdFx0XHRjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnICYmIGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJykge1xyXG5cdFx0XHRcdGZiaWQuZnVsbElEID0gZmJpZC5wdXJlSUQ7XHJcblx0XHRcdFx0ZmJpZC5jb21tYW5kID0gJ2xpa2VzJztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmRlYnVnPWFsbGApO1xyXG5cdFx0XHRsZXQgdG9rZW4gPSBjb25maWcucGFnZVRva2VuID09ICcnID8gYCZhY2Nlc3NfdG9rZW49JHtjb25maWcudXNlclRva2VufWA6YCZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufWA7XHJcblxyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZvcmRlcj0ke2NvbmZpZy5vcmRlcn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0ke3Rva2VufSZkZWJ1Zz1hbGxgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0aWYgKChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgZmJpZC5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogZC5uYW1lXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBkLnR5cGUgPSBcIkxJS0VcIjtcclxuXHRcdFx0XHRcdGlmIChkLmZyb20pIHtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IGQuaWRcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdCA9IDApIHtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApIHtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCAnbGltaXQ9JyArIGxpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJyArIGRhdGEubm93TGVuZ3RoICsgJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvciAobGV0IGQgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGQuaWQpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBmYmlkLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmIChkLmZyb20pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGQuaWRcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdC8vIGlmIChkYXRhLm5vd0xlbmd0aCA8IDE4MCkge1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpID0+IHtcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpID0+IHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi51cGRhdGVfYXJlYSwuZG9uYXRlX2FyZWFcIikuc2xpZGVVcCgpO1xyXG5cdFx0JChcIi5yZXN1bHRfYXJlYVwiKS5zbGlkZURvd24oKTtcclxuXHRcdGlmIChkYXRhLnJhdy50eXBlID09ICdncm91cCcpe1xyXG5cdFx0XHRpZiAoYXV0aF9zY29wZS5pbmNsdWRlcygnZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycpKXtcclxuXHRcdFx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdFx0XHRkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRcdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdFx0XHRcdHVpLnJlc2V0KCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5qqi5p+l6Yyv6Kqk77yM5oqT56S+5ZyY6LK85paH6ZyA5LuY6LK7JyxcclxuXHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgSXQgaXMgYSBwYWlkIGZlYXR1cmUuJyxcclxuXHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0XHRkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdFx0dWkucmVzZXQoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpID0+IHtcclxuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0bGV0IGlzVGFnID0gJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHQvLyBpZiAoY29uZmlnLmZyb21fZXh0ZW5zaW9uID09PSBmYWxzZSAmJiByYXdEYXRhLmNvbW1hbmQgPT09ICdjb21tZW50cycpIHtcclxuXHRcdC8vIFx0cmF3RGF0YS5kYXRhID0gcmF3RGF0YS5kYXRhLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdC8vIFx0XHRyZXR1cm4gaXRlbS5pc19oaWRkZW4gPT09IGZhbHNlXHJcblx0XHQvLyBcdH0pO1xyXG5cdFx0Ly8gfVxyXG5cdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xyXG5cdFx0cmF3RGF0YS5maWx0ZXJlZCA9IG5ld0RhdGE7XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpIHtcclxuXHRcdFx0dGFibGUuZ2VuZXJhdGUocmF3RGF0YSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gcmF3RGF0YTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4Y2VsOiAocmF3KSA9PiB7XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRjb25zb2xlLmxvZyhyYXcpO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKSB7XHJcblx0XHRcdGlmIChyYXcuY29tbWFuZCA9PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIjogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuihqOaDhVwiOiB0aGlzLnR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCI6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpID0+IHtcclxuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmRhdGEgPSByYXdkYXRhLmZpbHRlcmVkO1xyXG5cdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRpZiAoKHJhd2RhdGEuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCByYXdkYXRhLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuihqOaDhTwvdGQ+YDtcclxuXHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuaOkuWQjTwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+5YiG5pW4PC90ZD5gO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaG9zdCA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJztcclxuXHRcdGlmIChkYXRhLnJhdy50eXBlID09PSAndXJsX2NvbW1lbnRzJykgaG9zdCA9ICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkgKyAnP2ZiX2NvbW1lbnRfaWQ9JztcclxuXHJcblx0XHRmb3IgKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJkYXRhLmVudHJpZXMoKSkge1xyXG5cdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRpZiAocGljKSB7XHJcblx0XHRcdFx0cGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHtwaWN0dXJlfSR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5gO1xyXG5cdFx0XHRpZiAoKHJhd2RhdGEuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCByYXdkYXRhLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKSB7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHRcdFx0XHR0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPjxhIGhyZWY9J2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0ICA8dGQ+JHt2YWwuc2NvcmV9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBsaW5rID0gdmFsLmlkO1xyXG5cdFx0XHRcdGlmIChjb25maWcuZnJvbV9leHRlbnNpb24pIHtcclxuXHRcdFx0XHRcdGxpbmsgPSB2YWwucG9zdGxpbms7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCIke2hvc3R9JHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2V9PC9hPjwvdGQ+XHJcblx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cclxuXHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKSB7XHJcblx0XHRcdFRBQkxFID0gJChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoXCIjc2VhcmNoTmFtZVwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEFCTEVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChcIiNzZWFyY2hDb21tZW50XCIpLm9uKCdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUQUJMRVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKSA9PiB7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNzZWFyY2hDb21tZW50XCIpLnZhbCgpICE9ICcnKSB7XHJcblx0XHRcdHRhYmxlLnJlZG8oKTtcclxuXHRcdH1cclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKSB7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XHJcblx0XHRcdFx0XHRcdFwibmFtZVwiOiBwLFxyXG5cdFx0XHRcdFx0XHRcIm51bVwiOiBuXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbygpO1xyXG5cdH0sXHJcblx0Z286ICgpID0+IHtcclxuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhLmZpbHRlcmVkLmxlbmd0aCkuc3BsaWNlKDAsIGNob29zZS5udW0pO1xyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0Y2hvb3NlLmF3YXJkLm1hcCgodmFsLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0ciB0aXRsZT1cIuesrCcgKyAoaW5kZXggKyAxKSArICflkI1cIj4nICsgJCgnLm1haW5fdGFibGUnKS5EYXRhVGFibGUoKS5yb3dzKHtcclxuXHRcdFx0XHRzZWFyY2g6ICdhcHBsaWVkJ1xyXG5cdFx0XHR9KS5ub2RlcygpW3ZhbF0uaW5uZXJIVE1MICsgJzwvdHI+JztcclxuXHRcdH0pXHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYgKGNob29zZS5kZXRhaWwpIHtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvciAobGV0IGsgaW4gY2hvb3NlLmxpc3QpIHtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjVcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH0sXHJcblx0Z2VuX2JpZ19hd2FyZDogKCkgPT4ge1xyXG5cdFx0bGV0IGxpID0gJyc7XHJcblx0XHRsZXQgYXdhcmRzID0gW107XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRib2R5IHRyJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHZhbCkge1xyXG5cdFx0XHRsZXQgYXdhcmQgPSB7fTtcclxuXHRcdFx0aWYgKHZhbC5oYXNBdHRyaWJ1dGUoJ3RpdGxlJykpIHtcclxuXHRcdFx0XHRhd2FyZC5hd2FyZF9uYW1lID0gZmFsc2U7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS50ZXh0KCk7XHJcblx0XHRcdFx0YXdhcmQudXNlcmlkID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLmF0dHIoJ2hyZWYnKS5yZXBsYWNlKCdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJywgJycpO1xyXG5cdFx0XHRcdGF3YXJkLm1lc3NhZ2UgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLmxpbmsgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykuYXR0cignaHJlZicpO1xyXG5cdFx0XHRcdGF3YXJkLnRpbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgkKHZhbCkuZmluZCgndGQnKS5sZW5ndGggLSAxKS50ZXh0KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IHRydWU7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLnRleHQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhd2FyZHMucHVzaChhd2FyZCk7XHJcblx0XHR9KTtcclxuXHRcdGZvciAobGV0IGkgb2YgYXdhcmRzKSB7XHJcblx0XHRcdGlmIChpLmF3YXJkX25hbWUgPT09IHRydWUpIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpIGNsYXNzPVwicHJpemVOYW1lXCI+JHtpLm5hbWV9PC9saT5gO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxpICs9IGA8bGk+XHJcblx0XHRcdFx0PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPjxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH0vcGljdHVyZT90eXBlPWxhcmdlJmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59XCIgYWx0PVwiXCI+PC9hPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJpbmZvXCI+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJuYW1lXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5uYW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5tZXNzYWdlfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJ0aW1lXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS50aW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9saT5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuYXBwZW5kKGxpKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0Y2xvc2VfYmlnX2F3YXJkOiAoKSA9PiB7XHJcblx0XHQkKCcuYmlnX2F3YXJkJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQgdWwnKS5lbXB0eSgpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZiaWQgPSB7XHJcblx0ZmJpZDogW10sXHJcblx0aW5pdDogKHR5cGUpID0+IHtcclxuXHRcdGZiaWQuZmJpZCA9IFtdO1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRGQi5hcGkoXCIvbWVcIiwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRkYXRhLnVzZXJpZCA9IHJlcy5pZDtcclxuXHRcdFx0bGV0IHVybCA9ICcnO1xyXG5cdFx0XHRpZiAoYWRkTGluaykge1xyXG5cdFx0XHRcdHVybCA9IGZiaWQuZm9ybWF0KCQoJy5tb3JlbGluayAuYWRkdXJsJykudmFsKCkpO1xyXG5cdFx0XHRcdCQoJy5tb3JlbGluayAuYWRkdXJsJykudmFsKCcnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodXJsLmluZGV4T2YoJy5waHA/JykgPT09IC0xICYmIHVybC5pbmRleE9mKCc/JykgPiAwKSB7XHJcblx0XHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZignPycpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmYmlkLmdldCh1cmwsIHR5cGUpLnRoZW4oKGZiaWQpID0+IHtcclxuXHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQvLyAkKCcuaWRlbnRpdHknKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoYOeZu+WFpei6q+S7ve+8mjxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtyZXMuaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxzcGFuPiR7cmVzLm5hbWV9PC9zcGFuPmApO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6ICh1cmwsIHR5cGUpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGxldCBuZXd1cmwgPSB1cmwuc3Vic3RyKHVybC5pbmRleE9mKCcvJywgMjgpICsgMSwgMjAwKTtcclxuXHRcdFx0Ly8gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyDlhbEyNeWtl+WFg++8jOWboOatpOmBuDI46ZaL5aeL5om+L1xyXG5cdFx0XHRsZXQgcmVzdWx0ID0gbmV3dXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0bGV0IHVybHR5cGUgPSBmYmlkLmNoZWNrVHlwZSh1cmwpO1xyXG5cdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpID0+IHtcclxuXHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdHVybHR5cGUgPSAncGVyc29uYWwnO1xyXG5cdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdHBhZ2VJRDogaWQsXHJcblx0XHRcdFx0XHR0eXBlOiB1cmx0eXBlLFxyXG5cdFx0XHRcdFx0Y29tbWFuZDogdHlwZSxcclxuXHRcdFx0XHRcdGRhdGE6IFtdXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoYWRkTGluaykgb2JqLmRhdGEgPSBkYXRhLnJhdy5kYXRhOyAvL+i/veWKoOiyvOaWh1xyXG5cdFx0XHRcdGlmICh1cmx0eXBlID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcclxuXHRcdFx0XHRcdGlmIChzdGFydCA+PSAwKSB7XHJcblx0XHRcdFx0XHRcdGxldCBlbmQgPSB1cmwuaW5kZXhPZihcIiZcIiwgc3RhcnQpO1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCArIDUsIGVuZCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZigncG9zdHMvJyk7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0ICsgNiwgdXJsLmxlbmd0aCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgdmlkZW8gPSB1cmwuaW5kZXhPZigndmlkZW9zLycpO1xyXG5cdFx0XHRcdFx0aWYgKHZpZGVvID49IDApIHtcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdwdXJlJykge1xyXG5cdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHVybC5yZXBsYWNlKC9cXFwiL2csICcnKTtcclxuXHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdncm91cCcpIHtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArIFwiX1wiICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3Bob3RvJykge1xyXG5cdFx0XHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gdXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAndmlkZW8nKSB7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRGQi5hcGkoYC8ke29iai5wdXJlSUR9P2ZpZWxkcz1saXZlX3N0YXR1c2AsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzLmxpdmVfc3RhdHVzID09PSAnTElWRScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxIHx8IHJlc3VsdC5sZW5ndGggPT0gMykge1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3VubmFtZScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRGQi5hcGkoYC8ke29iai5wYWdlSUR9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2hlY2tUeXBlOiAocG9zdHVybCkgPT4ge1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImZiaWQ9XCIpID49IDApIHtcclxuXHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZigncGVybWFsaW5rJykgPj0gMCkge1xyXG5cdFx0XHRcdHJldHVybiAndW5uYW1lJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3BlcnNvbmFsJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvZ3JvdXBzL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAnZ3JvdXAnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJldmVudHNcIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ2V2ZW50JztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL3Bob3Rvcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3Bob3RvJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL3ZpZGVvcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3ZpZGVvJztcclxuXHRcdH1cclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ1wiJykgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3B1cmUnO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiAnbm9ybWFsJztcclxuXHR9LFxyXG5cdGNoZWNrUGFnZUlEOiAocG9zdHVybCwgdHlwZSkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IHN0YXJ0ID0gcG9zdHVybC5pbmRleE9mKFwiZmFjZWJvb2suY29tXCIpICsgMTM7XHJcblx0XHRcdGxldCBlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsIHN0YXJ0KTtcclxuXHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0aWYgKGVuZCA8IDApIHtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdmYmlkPScpID49IDApIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAndW5uYW1lJykge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCd1bm5hbWUnKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc29sdmUocG9zdHVybC5tYXRjaChyZWdleClbMV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgZ3JvdXAgPSBwb3N0dXJsLmluZGV4T2YoJy9ncm91cHMvJyk7XHJcblx0XHRcdFx0bGV0IGV2ZW50ID0gcG9zdHVybC5pbmRleE9mKCcvZXZlbnRzLycpXHJcblx0XHRcdFx0aWYgKGdyb3VwID49IDApIHtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gZ3JvdXAgKyA4O1xyXG5cdFx0XHRcdFx0ZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLCBzdGFydCk7XHJcblx0XHRcdFx0XHRsZXQgcmVnZXgyID0gL1xcZHs2LH0vZztcclxuXHRcdFx0XHRcdGxldCB0ZW1wID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XHJcblx0XHRcdFx0XHRpZiAocmVnZXgyLnRlc3QodGVtcCkpIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0ZW1wKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ2dyb3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmIChldmVudCA+PSAwKSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCdldmVudCcpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgcGFnZW5hbWUgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcclxuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZW5hbWV9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRmYmVycm9yID0gcmVzLmVycm9yLm1lc3NhZ2U7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmlkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZvcm1hdDogKHVybCkgPT4ge1xyXG5cdFx0aWYgKHVybC5pbmRleE9mKCdidXNpbmVzcy5mYWNlYm9vay5jb20vJykgPj0gMCkge1xyXG5cdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhd2RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIHN0YXJ0VGltZSwgZW5kVGltZSkgPT4ge1xyXG5cdFx0bGV0IGRhdGEgPSByYXdkYXRhLmRhdGE7XHJcblx0XHRpZiAod29yZCAhPT0gJycpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKChyYXdkYXRhLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgcmF3ZGF0YS5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnJlYWN0KGRhdGEsIHJlYWN0KTtcclxuXHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJykge1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBzdGFydFRpbWUsIGVuZFRpbWUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSkgPT4ge1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZiAoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKSA9PiB7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGlmIChuLnN0b3J5LmluZGV4T2Yod29yZCkgPiAtMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCBzdCwgdCkgPT4ge1xyXG5cdFx0bGV0IHRpbWVfYXJ5MiA9IHN0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IGVuZHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sIChwYXJzZUludCh0aW1lX2FyeVsxXSkgLSAxKSwgdGltZV9hcnlbMl0sIHRpbWVfYXJ5WzNdLCB0aW1lX2FyeVs0XSwgdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBzdGFydHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnkyWzBdLCAocGFyc2VJbnQodGltZV9hcnkyWzFdKSAtIDEpLCB0aW1lX2FyeTJbMl0sIHRpbWVfYXJ5MlszXSwgdGltZV9hcnkyWzRdLCB0aW1lX2FyeTJbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmICgoY3JlYXRlZF90aW1lID4gc3RhcnR0aW1lICYmIGNyZWF0ZWRfdGltZSA8IGVuZHRpbWUpIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpID0+IHtcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpIHtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCkgPT4ge1xyXG5cclxuXHR9LFxyXG5cdGFkZExpbms6ICgpID0+IHtcclxuXHRcdGxldCB0YXIgPSAkKCcuaW5wdXRhcmVhIC5tb3JlbGluaycpO1xyXG5cdFx0aWYgKHRhci5oYXNDbGFzcygnc2hvdycpKSB7XHJcblx0XHRcdHRhci5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGFyLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZXNldDogKCkgPT4ge1xyXG5cdFx0bGV0IGNvbW1hbmQgPSBkYXRhLnJhdy5jb21tYW5kO1xyXG5cdFx0aWYgKChjb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIikpIHtcclxuXHRcdFx0XHQkKFwiI3RhZ1wiKS5jbGljaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbmxldCBwYWdlX3NlbGVjdG9yID0ge1xyXG5cdHBhZ2VzOiBbXSxcclxuXHRncm91cHM6IFtdLFxyXG5cdHNob3c6ICgpPT57XHJcblx0XHQkKCcucGFnZV9zZWxlY3RvcicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRwYWdlX3NlbGVjdG9yLmdldEFkbWluKCk7XHJcblx0fSxcclxuXHRnZXRBZG1pbjogKCk9PntcclxuXHRcdFByb21pc2UuYWxsKFtwYWdlX3NlbGVjdG9yLmdldFBhZ2UoKSwgcGFnZV9zZWxlY3Rvci5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRwYWdlX3NlbGVjdG9yLmdlbkFkbWluKHJlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9maWVsZHM9bmFtZSxpZCxhZG1pbmlzdHJhdG9yJmxpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZSAocmVzLmRhdGEuZmlsdGVyKGl0ZW09PntyZXR1cm4gaXRlbS5hZG1pbmlzdHJhdG9yID09PSB0cnVlfSkpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2VuQWRtaW46IChyZXMpPT57XHJcblx0XHRsZXQgcGFnZXMgPSAnJztcclxuXHRcdGxldCBncm91cHMgPSAnJztcclxuXHRcdGZvcihsZXQgaSBvZiByZXNbMF0pe1xyXG5cdFx0XHRwYWdlcyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgZGF0YS10eXBlPVwiMVwiIGRhdGEtdmFsdWU9XCIke2kuaWR9XCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UGFnZSh0aGlzKVwiPiR7aS5uYW1lfTwvZGl2PmA7XHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzWzFdKXtcclxuXHRcdFx0Z3JvdXBzICs9IGA8ZGl2IGNsYXNzPVwicGFnZV9idG5cIiBkYXRhLXR5cGU9XCIyXCIgZGF0YS12YWx1ZT1cIiR7aS5pZH1cIiBvbmNsaWNrPVwicGFnZV9zZWxlY3Rvci5zZWxlY3RQYWdlKHRoaXMpXCI+JHtpLm5hbWV9PC9kaXY+YDtcclxuXHRcdH1cclxuXHRcdCQoJy5zZWxlY3RfcGFnZScpLmh0bWwocGFnZXMpO1xyXG5cdFx0JCgnLnNlbGVjdF9ncm91cCcpLmh0bWwoZ3JvdXBzKTtcclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6ICh0YXJnZXQpPT57XHJcblx0XHRsZXQgcGFnZV9pZCA9ICQodGFyZ2V0KS5kYXRhKCd2YWx1ZScpO1xyXG5cdFx0JCgnI3Bvc3RfdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdCQoJy5mYl9sb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdEZCLmFwaShgLyR7cGFnZV9pZH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZV9pZH0vbGl2ZV92aWRlb3M/ZmllbGRzPXN0YXR1cyxwZXJtYWxpbmtfdXJsLHRpdGxlLGNyZWF0aW9uX3RpbWVgLCAocmVzKT0+e1xyXG5cdFx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdFx0Zm9yKGxldCB0ciBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0aWYgKHRyLnN0YXR1cyA9PT0gJ0xJVkUnKXtcclxuXHRcdFx0XHRcdHRoZWFkICs9IGA8dHI+PHRkPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBvc3QoJyR7dHIuaWR9JylcIj7pgbjmk4fosrzmloc8L2J1dHRvbj4oTElWRSk8L3RkPjx0ZD48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tJHt0ci5wZXJtYWxpbmtfdXJsfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dHIudGl0bGV9PC9hPjwvdGQ+PHRkPiR7dGltZUNvbnZlcnRlcih0ci5jcmVhdGVkX3RpbWUpfTwvdGQ+PC90cj5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQkKCcjcG9zdF90YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0fSk7XHJcblx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VfaWR9L2ZlZWQ/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0JCgnLmZiX2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdFx0Zm9yKGxldCB0ciBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0dGJvZHkgKz0gYDx0cj48dGQ+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UG9zdCgnJHt0ci5pZH0nKVwiPumBuOaTh+iyvOaWhzwvYnV0dG9uPjwvdGQ+PHRkPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt0ci5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3RyLm1lc3NhZ2V9PC9hPjwvdGQ+PHRkPiR7dGltZUNvbnZlcnRlcih0ci5jcmVhdGVkX3RpbWUpfTwvdGQ+PC90cj5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJyNwb3N0X3RhYmxlIHRib2R5JykuaHRtbCh0Ym9keSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHNlbGVjdFBvc3Q6IChmYmlkKT0+e1xyXG5cdFx0JCgnLnBhZ2Vfc2VsZWN0b3InKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnNlbGVjdF9wYWdlJykuaHRtbCgnJyk7XHJcblx0XHQkKCcuc2VsZWN0X2dyb3VwJykuaHRtbCgnJyk7XHJcblx0XHQkKCcjcG9zdF90YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0bGV0IGlkID0gJ1wiJytmYmlkKydcIic7XHJcblx0XHQkKCcjZW50ZXJVUkwgLnVybCcpLnZhbChpZCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpIHtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpICsgMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBkYXRlICsgXCItXCIgKyBob3VyICsgXCItXCIgKyBtaW4gKyBcIi1cIiArIHNlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCkge1xyXG5cdHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuXHR2YXIgbW9udGhzID0gWycwMScsICcwMicsICcwMycsICcwNCcsICcwNScsICcwNicsICcwNycsICcwOCcsICcwOScsICcxMCcsICcxMScsICcxMiddO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0aWYgKGRhdGUgPCAxMCkge1xyXG5cdFx0ZGF0ZSA9IFwiMFwiICsgZGF0ZTtcclxuXHR9XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdGlmIChtaW4gPCAxMCkge1xyXG5cdFx0bWluID0gXCIwXCIgKyBtaW47XHJcblx0fVxyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRpZiAoc2VjIDwgMTApIHtcclxuXHRcdHNlYyA9IFwiMFwiICsgc2VjO1xyXG5cdH1cclxuXHR2YXIgdGltZSA9IHllYXIgKyAnLScgKyBtb250aCArICctJyArIGRhdGUgKyBcIiBcIiArIGhvdXIgKyAnOicgKyBtaW4gKyAnOicgKyBzZWM7XHJcblx0cmV0dXJuIHRpbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9iajJBcnJheShvYmopIHtcclxuXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBbdmFsdWVdO1xyXG5cdH0pO1xyXG5cdHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG5cdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgaSwgciwgdDtcclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRhcnlbaV0gPSBpO1xyXG5cdH1cclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcblx0XHR0ID0gYXJ5W3JdO1xyXG5cdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG5cdFx0YXJ5W2ldID0gdDtcclxuXHR9XHJcblx0cmV0dXJuIGFyeTtcclxufVxyXG5cclxuZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcblx0Ly9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuXHR2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcblxyXG5cdHZhciBDU1YgPSAnJztcclxuXHQvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuXHJcblx0Ly8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG5cdC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcblx0aWYgKFNob3dMYWJlbCkge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG5cclxuXHRcdFx0Ly9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuXHRcdFx0cm93ICs9IGluZGV4ICsgJywnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcblxyXG5cdFx0Ly9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0Ly8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuXHRcdFx0cm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0Ly9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHRpZiAoQ1NWID09ICcnKSB7XHJcblx0XHRhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuXHR2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG5cdC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG5cdGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZywgXCJfXCIpO1xyXG5cclxuXHQvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG5cdHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcblxyXG5cdC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG5cdC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcblx0Ly8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcblx0Ly8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuXHJcblx0Ly90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcblx0bGluay5ocmVmID0gdXJpO1xyXG5cclxuXHQvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG5cdGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcblx0bGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcblxyXG5cdC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHRsaW5rLmNsaWNrKCk7XHJcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
