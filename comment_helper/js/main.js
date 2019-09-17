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
		comments: 'v3.2',
		reactions: 'v3.2',
		sharedposts: 'v3.2',
		url_comments: 'v3.2',
		feed: 'v3.2',
		group: 'v3.2'
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
		console.log(response);
		if (response.status === 'connected') {
			auth_scope = response.authResponse.grantedScopes;
			config.from_extension = false;
			if (type == "addScope") {
				if (auth_scope.includes('groups_access_member_info')) {
					swal('付費授權完成，請再次執行抓留言', 'Authorization Finished! Please getComments again.', 'success').done();
				} else {
					swal('付費授權檢查錯誤，該功能需付費', 'Authorization Failed! It is a paid feature.', 'error').done();
				}
			} else if (type == "sharedposts") {
				fb.user_posts = true;
				fbid.init(type);
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
			if (fbid.type == "url_comments") {
				fbid.data = [];
			}
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

			// if($('.token').val() === ''){
			// 	$('.token').val(config.pageToken);
			// }else{
			// 	config.pageToken = $('.token').val();
			// }

			FB.api(config.apiVersion[command] + '/' + fbid.fullID + '/' + fbid.command + '?limit=' + config.limit[fbid.command] + '&order=' + config.order + '&fields=' + config.field[fbid.command].toString() + '&access_token=' + config.pageToken + '&debug=all', function (res) {
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
		config.pageToken = '';
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
			if (type == 'url_comments') {
				var posturl = url;
				if (posturl.indexOf("?") > 0) {
					posturl = posturl.substring(0, posturl.indexOf("?"));
				}
				FB.api('/' + posturl, function (res) {
					var obj = {
						fullID: res.og_object.id,
						type: type,
						command: 'comments'
					};
					config.limit['comments'] = '25';
					config.order = '';
					resolve(obj);
				});
			} else {
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
						if (urltype === 'event') {
							if (result.length == 1) {
								//抓EVENT中所有留言
								obj.command = 'feed';
								obj.fullID = result[0];
								resolve(obj);
							} else {
								//抓EVENT中某篇留言的留言
								obj.fullID = result[1];
								resolve(obj);
							}
						} else if (urltype === 'group') {

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
			}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwiZmJlcnJvciIsIndpbmRvdyIsIm9uZXJyb3IiLCJoYW5kbGVFcnIiLCJUQUJMRSIsImxhc3RDb21tYW5kIiwiYWRkTGluayIsImF1dGhfc2NvcGUiLCJtc2ciLCJ1cmwiLCJsIiwiJCIsInZhbCIsImNvbnNvbGUiLCJsb2ciLCJhcHBlbmQiLCJmYWRlSW4iLCJkb2N1bWVudCIsInJlYWR5IiwiaGFzaCIsImxvY2F0aW9uIiwic2VhcmNoIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwiZGF0YSIsImV4dGVuc2lvbiIsImNsaWNrIiwiZSIsImZiIiwiZXh0ZW5zaW9uQXV0aCIsImRhdGFzIiwiY29tbWFuZCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsInJhbmtlciIsInJhdyIsImZpbmlzaCIsImN0cmxLZXkiLCJhbHRLZXkiLCJjb25maWciLCJvcmRlciIsImdldEF1dGgiLCJsaWtlcyIsImNob29zZSIsImluaXQiLCJ1aSIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJmaWx0ZXIiLCJyZWFjdCIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJzdGFydFRpbWUiLCJmb3JtYXQiLCJlbmRUaW1lIiwic2V0U3RhcnREYXRlIiwiZmlsdGVyRGF0YSIsImV4cG9ydFRvSnNvbkZpbGUiLCJleGNlbFN0cmluZyIsImV4Y2VsIiwic3RyaW5naWZ5IiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwianNvbkRhdGEiLCJkYXRhU3RyIiwiZGF0YVVyaSIsImVuY29kZVVSSUNvbXBvbmVudCIsImV4cG9ydEZpbGVEZWZhdWx0TmFtZSIsImxpbmtFbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsInNoYXJlQlROIiwiYWxlcnQiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJ3b3JkIiwibm93RGF0ZSIsImF1dGgiLCJwYWdlVG9rZW4iLCJmcm9tX2V4dGVuc2lvbiIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJhdXRoX3R5cGUiLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiaW5jbHVkZXMiLCJzd2FsIiwiZG9uZSIsImZiaWQiLCJleHRlbnNpb25DYWxsYmFjayIsInRpdGxlIiwiaHRtbCIsImF1dGhPSyIsInBvc3RkYXRhIiwidXNlcmlkIiwibm93TGVuZ3RoIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJnZXQiLCJ0aGVuIiwicmVzIiwiaSIsInB1c2giLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2VfYXJyYXkiLCJwdXJlSUQiLCJ0b1N0cmluZyIsImFwaSIsImxlbmd0aCIsImQiLCJmcm9tIiwiaWQiLCJuYW1lIiwidXBkYXRlZF90aW1lIiwiY3JlYXRlZF90aW1lIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwibWVzc2FnZSIsInN0b3J5IiwidGltZUNvbnZlcnRlciIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJzdHIiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsImZpbHRlcmRhdGEiLCJ0aGVhZCIsInRib2R5IiwicGljIiwiaG9zdCIsImVudHJpZXMiLCJqIiwicGljdHVyZSIsInRkIiwic2NvcmUiLCJsaW5rIiwibGlrZV9jb3VudCIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInZhbHVlIiwiZHJhdyIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsIm4iLCJwYXJzZUludCIsImZpbmQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsIm1hcCIsImluZGV4Iiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwibm93IiwiayIsInRhciIsImVxIiwiaW5zZXJ0QmVmb3JlIiwiZ2VuX2JpZ19hd2FyZCIsImxpIiwiYXdhcmRzIiwiaGFzQXR0cmlidXRlIiwiYXdhcmRfbmFtZSIsImF0dHIiLCJ0aW1lIiwiY2xvc2VfYmlnX2F3YXJkIiwiZW1wdHkiLCJzdWJzdHJpbmciLCJwb3N0dXJsIiwib2JqIiwib2dfb2JqZWN0IiwicmVnZXgiLCJuZXd1cmwiLCJzdWJzdHIiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsInZpZGVvIiwibGl2ZV9zdGF0dXMiLCJlcnJvciIsImFjY2Vzc190b2tlbiIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJ0YWciLCJ1bmlxdWUiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJuZXdBcnkiLCJncmVwIiwidW5kZWZpbmVkIiwibWVzc2FnZV90YWdzIiwic3QiLCJ0IiwidGltZV9hcnkyIiwic3BsaXQiLCJ0aW1lX2FyeSIsImVuZHRpbWUiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJzdGFydHRpbWUiLCJhIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJyb3ciLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0EsSUFBSUMsVUFBVSxFQUFkO0FBQ0FDLE9BQU9DLE9BQVAsR0FBaUJDLFNBQWpCO0FBQ0EsSUFBSUMsS0FBSjtBQUNBLElBQUlDLGNBQWMsVUFBbEI7QUFDQSxJQUFJQyxVQUFVLEtBQWQ7QUFDQSxJQUFJQyxhQUFhLEVBQWpCOztBQUVBLFNBQVNKLFNBQVQsQ0FBbUJLLEdBQW5CLEVBQXdCQyxHQUF4QixFQUE2QkMsQ0FBN0IsRUFBZ0M7QUFDL0IsS0FBSSxDQUFDWCxZQUFMLEVBQW1CO0FBQ2xCLE1BQUlVLE9BQU1FLEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQVY7QUFDQUMsVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWlELDRCQUFqRDtBQUNBRCxVQUFRQyxHQUFSLENBQVksc0JBQXNCTCxJQUFsQztBQUNBRSxJQUFFLGlCQUFGLEVBQXFCSSxNQUFyQixjQUF1Q2YsT0FBdkMsZ0JBQXlEUyxJQUF6RDtBQUNBRSxJQUFFLGlCQUFGLEVBQXFCSyxNQUFyQjtBQUNBakIsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRFksRUFBRU0sUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVk7QUFDN0IsS0FBSUMsT0FBT0MsU0FBU0MsTUFBcEI7QUFDQSxLQUFJRixLQUFLRyxPQUFMLENBQWEsV0FBYixLQUE2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QUVBO0FBQ0E4SixTQUFPQyxNQUFNLE1BQWI7QUFDQTs7QUFFRCxLQUFJRCxPQUFPLEVBQVgsRUFBZTtBQUNkcE4sUUFBTSxjQUFOO0FBQ0E7QUFDQTs7QUFFRDtBQUNBLEtBQUl1TixXQUFXLEVBQWY7QUFDQTtBQUNBQSxhQUFZTixZQUFZakosT0FBWixDQUFvQixJQUFwQixFQUEwQixHQUExQixDQUFaOztBQUVBO0FBQ0EsS0FBSXdKLE1BQU0sdUNBQXVDQyxVQUFVTCxHQUFWLENBQWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSTFHLE9BQU81SyxTQUFTK0QsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0E2RyxNQUFLZ0gsSUFBTCxHQUFZRixHQUFaOztBQUVBO0FBQ0E5RyxNQUFLaUgsS0FBTCxHQUFhLG1CQUFiO0FBQ0FqSCxNQUFLa0gsUUFBTCxHQUFnQkwsV0FBVyxNQUEzQjs7QUFFQTtBQUNBelIsVUFBUytSLElBQVQsQ0FBY0MsV0FBZCxDQUEwQnBILElBQTFCO0FBQ0FBLE1BQUtuSyxLQUFMO0FBQ0FULFVBQVMrUixJQUFULENBQWNFLFdBQWQsQ0FBMEJySCxJQUExQjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbnZhciBmYmVycm9yID0gJyc7XHJcbndpbmRvdy5vbmVycm9yID0gaGFuZGxlRXJyO1xyXG52YXIgVEFCTEU7XHJcbnZhciBsYXN0Q29tbWFuZCA9ICdjb21tZW50cyc7XHJcbnZhciBhZGRMaW5rID0gZmFsc2U7XHJcbnZhciBhdXRoX3Njb3BlID0gJyc7XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLCB1cmwsIGwpIHtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSkge1xyXG5cdFx0bGV0IHVybCA9ICQoJyNlbnRlclVSTCAudXJsJykudmFsKCk7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsIFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArIHVybCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmFwcGVuZChgPGJyPjxicj4ke2ZiZXJyb3J9PGJyPjxicj4ke3VybH1gKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uc2VhcmNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJleHRlbnNpb25cIikgPj0gMCkge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRkYXRhLmV4dGVuc2lvbiA9IHRydWU7XHJcblxyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aCBidXR0b25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJyYW5rZXJcIikgPj0gMCkge1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiAncmFua2VyJyxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucmFua2VyKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcblxyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLmxpa2VzID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRmYi5nZXRBdXRoKCd1cmxfY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHQkKFwiI21vcmVwb3N0XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdHVpLmFkZExpbmsoKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLopIfoo73ooajmoLzlhaflrrlcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS9NTS9ERCBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSwgZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLnN0YXJ0VGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gZW5kLmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUoY29uZmlnLmZpbHRlci5zdGFydFRpbWUpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRleHBvcnRUb0pzb25GaWxlKGZpbHRlckRhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gaWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCkge1xyXG5cdFx0XHQvLyBcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQvLyB9IGVsc2Uge1xyXG5cdFx0XHQvLyBcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGEpLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpIHtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBleHBvcnRUb0pzb25GaWxlKGpzb25EYXRhKSB7XHJcbiAgICBsZXQgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KGpzb25EYXRhKTtcclxuICAgIGxldCBkYXRhVXJpID0gJ2RhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04LCcrIGVuY29kZVVSSUNvbXBvbmVudChkYXRhU3RyKTtcclxuICAgIFxyXG4gICAgbGV0IGV4cG9ydEZpbGVEZWZhdWx0TmFtZSA9ICdkYXRhLmpzb24nO1xyXG4gICAgXHJcbiAgICBsZXQgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBkYXRhVXJpKTtcclxuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBleHBvcnRGaWxlRGVmYXVsdE5hbWUpO1xyXG4gICAgbGlua0VsZW1lbnQuY2xpY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2hhcmVCVE4oKSB7XHJcblx0YWxlcnQoJ+iqjeecn+eci+WujOi3s+WHuuS+hueahOmCo+mggeS4iumdouWvq+S6huS7gOm6vFxcblxcbueci+WujOS9oOWwseacg+efpemBk+S9oOeCuuS7gOm6vOS4jeiDveaKk+WIhuS6qycpO1xyXG59XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywgJ21lc3NhZ2VfdGFncycsICdtZXNzYWdlJywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCAnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbJ2NyZWF0ZWRfdGltZScsICdmcm9tJywgJ21lc3NhZ2UnLCAnc3RvcnknXSxcclxuXHRcdGxpa2VzOiBbJ25hbWUnXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnMTUnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJyxcclxuXHRcdGxpa2VzOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2My4yJyxcclxuXHRcdHJlYWN0aW9uczogJ3YzLjInLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2My4yJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YzLjInLFxyXG5cdFx0ZmVlZDogJ3YzLjInLFxyXG5cdFx0Z3JvdXA6ICd2My4yJ1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdHN0YXJ0VGltZTogJzIwMDAtMTItMzEtMDAtMDAtMDAnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRvcmRlcjogJ2Nocm9ub2xvZ2ljYWwnLFxyXG5cdGF1dGg6ICdtYW5hZ2VfcGFnZXMsZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycsXHJcblx0bGlrZXM6IGZhbHNlLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcblx0ZnJvbV9leHRlbnNpb246IGZhbHNlLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJykgPT4ge1xyXG5cdFx0aWYgKHR5cGUgPT09ICcnKSB7XHJcblx0XHRcdGFkZExpbmsgPSB0cnVlO1xyXG5cdFx0XHR0eXBlID0gbGFzdENvbW1hbmQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZGRMaW5rID0gZmFsc2U7XHJcblx0XHRcdGxhc3RDb21tYW5kID0gdHlwZTtcclxuXHRcdH1cclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcgLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRjb25maWcuZnJvbV9leHRlbnNpb24gPSBmYWxzZTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKSB7XHJcblx0XHRcdFx0aWYgKGF1dGhfc2NvcGUuaW5jbHVkZXMoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSl7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxyXG5cdFx0XHRcdFx0XHQnc3VjY2VzcydcclxuXHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+S7mOiyu+aOiOasiuaqouafpemMr+iqpO+8jOipsuWKn+iDvemcgOS7mOiyuycsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgSXQgaXMgYSBwYWlkIGZlYXR1cmUuJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT0gXCJzaGFyZWRwb3N0c1wiKSB7XHRcclxuXHRcdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKSA9PiB7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRpZiAoYXV0aF9zY29wZS5pbmRleE9mKFwiZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mb1wiKSA8IDApIHtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZmIuYXV0aE9LKCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YXV0aE9LOiAoKSA9PiB7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGxldCBwb3N0ZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnBvc3RkYXRhKTtcclxuXHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0Y29tbWFuZDogcG9zdGRhdGEuY29tbWFuZCxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZSgkKFwiLmNocm9tZVwiKS52YWwoKSlcclxuXHRcdH1cclxuXHRcdGRhdGEucmF3ID0gZGF0YXM7XHJcblx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IFtdLFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5bos4fmlpnkuK0uLi4nKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGlmICghYWRkTGluaykge1xyXG5cdFx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JCgnLnB1cmVfZmJpZCcpLnRleHQoZmJpZC5mdWxsSUQpO1xyXG5cdFx0ZGF0YS5nZXQoZmJpZCkudGhlbigocmVzKSA9PiB7XHJcblx0XHRcdC8vIGZiaWQuZGF0YSA9IHJlcztcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PSBcInVybF9jb21tZW50c1wiKSB7XHJcblx0XHRcdFx0ZmJpZC5kYXRhID0gW107XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgaSBvZiByZXMpIHtcclxuXHRcdFx0XHRmYmlkLmRhdGEucHVzaChpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhLmZpbmlzaChmYmlkKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gZmJpZC5jb21tYW5kO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRmYmlkLmZ1bGxJRCA9IGZiaWQucHVyZUlEO1xyXG5cdFx0XHRcdGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcgJiYgZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnKSB7XHJcblx0XHRcdFx0ZmJpZC5mdWxsSUQgPSBmYmlkLnB1cmVJRDtcclxuXHRcdFx0XHRmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjb25maWcubGlrZXMpIGZiaWQuY29tbWFuZCA9ICdsaWtlcyc7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mZGVidWc9YWxsYCk7XHJcblxyXG5cdFx0XHQvLyBpZigkKCcudG9rZW4nKS52YWwoKSA9PT0gJycpe1xyXG5cdFx0XHQvLyBcdCQoJy50b2tlbicpLnZhbChjb25maWcucGFnZVRva2VuKTtcclxuXHRcdFx0Ly8gfWVsc2V7XHJcblx0XHRcdC8vIFx0Y29uZmlnLnBhZ2VUb2tlbiA9ICQoJy50b2tlbicpLnZhbCgpO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZvcmRlcj0ke2NvbmZpZy5vcmRlcn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn0mZGVidWc9YWxsYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdGZvciAobGV0IGQgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdGlmICgoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGZiaWQuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IGQubmFtZVxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKGNvbmZpZy5saWtlcykgZC50eXBlID0gXCJMSUtFXCI7XHJcblx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSkge1xyXG5cdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQgPSAwKSB7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKSB7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywgJ2xpbWl0PScgKyBsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkLmlkKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgZmJpZC5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHQvLyBpZiAoZGF0YS5ub3dMZW5ndGggPCAxODApIHtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKSA9PiB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIudXBkYXRlX2FyZWEsLmRvbmF0ZV9hcmVhXCIpLnNsaWRlVXAoKTtcclxuXHRcdCQoXCIucmVzdWx0X2FyZWFcIikuc2xpZGVEb3duKCk7XHJcblx0XHRpZiAoZGF0YS5yYXcudHlwZSA9PSAnZ3JvdXAnKXtcclxuXHRcdFx0aWYgKGF1dGhfc2NvcGUuaW5jbHVkZXMoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSl7XHJcblx0XHRcdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHRcdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0XHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdFx0XHR1aS5yZXNldCgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0J+S7mOiyu+aOiOasiuaqouafpemMr+iqpO+8jOaKk+ekvuWcmOiyvOaWh+mcgOS7mOiyuycsXHJcblx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIEl0IGlzIGEgcGFpZCBmZWF0dXJlLicsXHJcblx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0XHRcdHVpLnJlc2V0KCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKSA9PiB7XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Ly8gaWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9PT0gZmFsc2UgJiYgcmF3RGF0YS5jb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHQvLyBcdHJhd0RhdGEuZGF0YSA9IHJhd0RhdGEuZGF0YS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHQvLyBcdFx0cmV0dXJuIGl0ZW0uaXNfaGlkZGVuID09PSBmYWxzZVxyXG5cdFx0Ly8gXHR9KTtcclxuXHRcdC8vIH1cclxuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKSB7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdykgPT4ge1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0Y29uc29sZS5sb2cocmF3KTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbikge1xyXG5cdFx0XHRpZiAocmF3LmNvbW1hbmQgPT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCI6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLooajmg4VcIjogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKSA9PiB7XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSkgPT4ge1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJkYXRhID0gcmF3ZGF0YS5maWx0ZXJlZDtcclxuXHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0aWYgKChyYXdkYXRhLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgcmF3ZGF0YS5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7ooajmg4U8L3RkPmA7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMTEwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7mjpLlkI08L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuWIhuaVuDwvdGQ+YDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGhvc3QgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyc7XHJcblx0XHRpZiAoZGF0YS5yYXcudHlwZSA9PT0gJ3VybF9jb21tZW50cycpIGhvc3QgPSAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpICsgJz9mYl9jb21tZW50X2lkPSc7XHJcblxyXG5cdFx0Zm9yIChsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpIHtcclxuXHRcdFx0bGV0IHBpY3R1cmUgPSAnJztcclxuXHRcdFx0aWYgKHBpYykge1xyXG5cdFx0XHRcdHBpY3R1cmUgPSBgPGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0aWYgKChyYXdkYXRhLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgcmF3ZGF0YS5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3Rvcnl9PC9hPjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblx0XHRcdFx0dGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdFx0XHQgIDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPiR7dmFsLnNjb3JlfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgbGluayA9IHZhbC5pZDtcclxuXHRcdFx0XHRpZiAoY29uZmlnLmZyb21fZXh0ZW5zaW9uKSB7XHJcblx0XHRcdFx0XHRsaW5rID0gdmFsLnBvc3RsaW5rO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiJHtob3N0fSR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCkge1xyXG5cdFx0XHRUQUJMRSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2VhcmNoQ29tbWVudFwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEFCTEVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCkgPT4ge1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjc2VhcmNoQ29tbWVudFwiKS52YWwoKSAhPSAnJykge1xyXG5cdFx0XHR0YWJsZS5yZWRvKCk7XHJcblx0XHR9XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCkge1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcIm5hbWVcIjogcCxcclxuXHRcdFx0XHRcdFx0XCJudW1cIjogblxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oKTtcclxuXHR9LFxyXG5cdGdvOiAoKSA9PiB7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YS5maWx0ZXJlZC5sZW5ndGgpLnNwbGljZSgwLCBjaG9vc2UubnVtKTtcclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGNob29zZS5hd2FyZC5tYXAoKHZhbCwgaW5kZXgpID0+IHtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHIgdGl0bGU9XCLnrKwnICsgKGluZGV4ICsgMSkgKyAn5ZCNXCI+JyArICQoJy5tYWluX3RhYmxlJykuRGF0YVRhYmxlKCkucm93cyh7XHJcblx0XHRcdFx0c2VhcmNoOiAnYXBwbGllZCdcclxuXHRcdFx0fSkubm9kZXMoKVt2YWxdLmlubmVySFRNTCArICc8L3RyPic7XHJcblx0XHR9KVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmIChjaG9vc2UuZGV0YWlsKSB7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IgKGxldCBrIGluIGNob29zZS5saXN0KSB7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI1XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9LFxyXG5cdGdlbl9iaWdfYXdhcmQ6ICgpID0+IHtcclxuXHRcdGxldCBsaSA9ICcnO1xyXG5cdFx0bGV0IGF3YXJkcyA9IFtdO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0Ym9keSB0cicpLmVhY2goZnVuY3Rpb24gKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0bGV0IGF3YXJkID0ge307XHJcblx0XHRcdGlmICh2YWwuaGFzQXR0cmlidXRlKCd0aXRsZScpKSB7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgxKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLnVzZXJpZCA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJykucmVwbGFjZSgnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycsICcnKTtcclxuXHRcdFx0XHRhd2FyZC5tZXNzYWdlID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC5saW5rID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0XHRhd2FyZC50aW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoJCh2YWwpLmZpbmQoJ3RkJykubGVuZ3RoIC0gMSkudGV4dCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSB0cnVlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS50ZXh0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXdhcmRzLnB1c2goYXdhcmQpO1xyXG5cdFx0fSk7XHJcblx0XHRmb3IgKGxldCBpIG9mIGF3YXJkcykge1xyXG5cdFx0XHRpZiAoaS5hd2FyZF9uYW1lID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bGkgKz0gYDxsaSBjbGFzcz1cInByaXplTmFtZVwiPiR7aS5uYW1lfTwvbGk+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpPlxyXG5cdFx0XHRcdDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aS51c2VyaWR9L3BpY3R1cmU/dHlwZT1sYXJnZSZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufVwiIGFsdD1cIlwiPjwvYT5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5mb1wiPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibmFtZVwiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubmFtZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubWVzc2FnZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwidGltZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kudGltZX08L2E+PC9wPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvbGk+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmFwcGVuZChsaSk7XHJcblx0XHQkKCcuYmlnX2F3YXJkJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHR9LFxyXG5cdGNsb3NlX2JpZ19hd2FyZDogKCkgPT4ge1xyXG5cdFx0JCgnLmJpZ19hd2FyZCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuZW1wdHkoKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmYmlkID0ge1xyXG5cdGZiaWQ6IFtdLFxyXG5cdGluaXQ6ICh0eXBlKSA9PiB7XHJcblx0XHRjb25maWcucGFnZVRva2VuID0gJyc7XHJcblx0XHRmYmlkLmZiaWQgPSBbXTtcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0RkIuYXBpKFwiL21lXCIsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0ZGF0YS51c2VyaWQgPSByZXMuaWQ7XHJcblx0XHRcdGxldCB1cmwgPSAnJztcclxuXHRcdFx0aWYgKGFkZExpbmspIHtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgpKTtcclxuXHRcdFx0XHQkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgnJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dXJsID0gZmJpZC5mb3JtYXQoJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHVybC5pbmRleE9mKCcucGhwPycpID09PSAtMSAmJiB1cmwuaW5kZXhPZignPycpID4gMCkge1xyXG5cdFx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoJz8nKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZmJpZC5nZXQodXJsLCB0eXBlKS50aGVuKChmYmlkKSA9PiB7XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Ly8gJCgnLmlkZW50aXR5JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKGDnmbvlhaXouqvku73vvJo8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cmVzLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48c3Bhbj4ke3Jlcy5uYW1lfTwvc3Bhbj5gKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAodXJsLCB0eXBlKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRpZiAodHlwZSA9PSAndXJsX2NvbW1lbnRzJykge1xyXG5cdFx0XHRcdGxldCBwb3N0dXJsID0gdXJsO1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCI/XCIpID4gMCkge1xyXG5cdFx0XHRcdFx0cG9zdHVybCA9IHBvc3R1cmwuc3Vic3RyaW5nKDAsIHBvc3R1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRGQi5hcGkoYC8ke3Bvc3R1cmx9YCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0ZnVsbElEOiByZXMub2dfb2JqZWN0LmlkLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiB0eXBlLFxyXG5cdFx0XHRcdFx0XHRjb21tYW5kOiAnY29tbWVudHMnXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0Y29uZmlnLmxpbWl0Wydjb21tZW50cyddID0gJzI1JztcclxuXHRcdFx0XHRcdGNvbmZpZy5vcmRlciA9ICcnO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdFx0bGV0IG5ld3VybCA9IHVybC5zdWJzdHIodXJsLmluZGV4T2YoJy8nLCAyOCkgKyAxLCAyMDApO1xyXG5cdFx0XHRcdC8vIGh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8g5YWxMjXlrZflhYPvvIzlm6DmraTpgbgyOOmWi+Wni+aJvi9cclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gbmV3dXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XHJcblx0XHRcdFx0ZmJpZC5jaGVja1BhZ2VJRCh1cmwsIHVybHR5cGUpLnRoZW4oKGlkKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XHJcblx0XHRcdFx0XHRcdGlkID0gZGF0YS51c2VyaWQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0XHRwYWdlSUQ6IGlkLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiB1cmx0eXBlLFxyXG5cdFx0XHRcdFx0XHRjb21tYW5kOiB0eXBlLFxyXG5cdFx0XHRcdFx0XHRkYXRhOiBbXVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGlmIChhZGRMaW5rKSBvYmouZGF0YSA9IGRhdGEucmF3LmRhdGE7IC8v6L+95Yqg6LK85paHXHJcblx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcclxuXHRcdFx0XHRcdFx0aWYgKHN0YXJ0ID49IDApIHtcclxuXHRcdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsIHN0YXJ0KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCArIDUsIGVuZCk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0ICsgNiwgdXJsLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bGV0IHZpZGVvID0gdXJsLmluZGV4T2YoJ3ZpZGVvcy8nKTtcclxuXHRcdFx0XHRcdFx0aWYgKHZpZGVvID49IDApIHtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAncHVyZScpIHtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHVybC5yZXBsYWNlKC9cXFwiL2csICcnKTtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdldmVudCcpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5omA5pyJ55WZ6KiAXHJcblx0XHRcdFx0XHRcdFx0XHRvYmouY29tbWFuZCA9ICdmZWVkJztcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3mn5Dnr4fnlZnoqIDnmoTnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMV07XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdncm91cCcpIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArIFwiX1wiICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAncGhvdG8nKSB7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gdXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICd2aWRlbycpIHtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRGQi5hcGkoYC8ke29iai5wdXJlSUR9P2ZpZWxkcz1saXZlX3N0YXR1c2AsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChyZXMubGl2ZV9zdGF0dXMgPT09ICdMSVZFJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxIHx8IHJlc3VsdC5sZW5ndGggPT0gMykge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICd1bm5hbWUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRGQi5hcGkoYC8ke29iai5wYWdlSUR9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoZWNrVHlwZTogKHBvc3R1cmwpID0+IHtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJmYmlkPVwiKSA+PSAwKSB7XHJcblx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ3Blcm1hbGluaycpID49IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3VubmFtZSc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuICdwZXJzb25hbCc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL2dyb3Vwcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ2dyb3VwJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdldmVudCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9waG90b3MvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdwaG90byc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi92aWRlb3MvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICd2aWRlbyc7XHJcblx0XHR9XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdwdXJlJztcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJ25vcm1hbCc7XHJcblx0fSxcclxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBzdGFydCA9IHBvc3R1cmwuaW5kZXhPZihcImZhY2Vib29rLmNvbVwiKSArIDEzO1xyXG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLCBzdGFydCk7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGlmIChlbmQgPCAwKSB7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignZmJpZD0nKSA+PSAwKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3VubmFtZScpIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgndW5uYW1lJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IGdyb3VwID0gcG9zdHVybC5pbmRleE9mKCcvZ3JvdXBzLycpO1xyXG5cdFx0XHRcdGxldCBldmVudCA9IHBvc3R1cmwuaW5kZXhPZignL2V2ZW50cy8nKVxyXG5cdFx0XHRcdGlmIChncm91cCA+PSAwKSB7XHJcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwICsgODtcclxuXHRcdFx0XHRcdGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIiwgc3RhcnQpO1xyXG5cdFx0XHRcdFx0bGV0IHJlZ2V4MiA9IC9cXGR7Nix9L2c7XHJcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xyXG5cdFx0XHRcdFx0aWYgKHJlZ2V4Mi50ZXN0KHRlbXApKSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUodGVtcCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdncm91cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZXZlbnQgPj0gMCkge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSgnZXZlbnQnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XHJcblx0XHRcdFx0XHRGQi5hcGkoYC8ke3BhZ2VuYW1lfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0ZmJlcnJvciA9IHJlcy5lcnJvci5tZXNzYWdlO1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmb3JtYXQ6ICh1cmwpID0+IHtcclxuXHRcdGlmICh1cmwuaW5kZXhPZignYnVzaW5lc3MuZmFjZWJvb2suY29tLycpID49IDApIHtcclxuXHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXdkYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBzdGFydFRpbWUsIGVuZFRpbWUpID0+IHtcclxuXHRcdGxldCBkYXRhID0gcmF3ZGF0YS5kYXRhO1xyXG5cdFx0aWYgKHdvcmQgIT09ICcnKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmICgocmF3ZGF0YS5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IHJhd2RhdGEuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgc3RhcnRUaW1lLCBlbmRUaW1lKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9LFxyXG5cdHVuaXF1ZTogKGRhdGEpID0+IHtcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0aWYgKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCkgPT4ge1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpZiAobi5zdG9yeS5pbmRleE9mKHdvcmQpID4gLTEpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKSA9PiB7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncykge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgc3QsIHQpID0+IHtcclxuXHRcdGxldCB0aW1lX2FyeTIgPSBzdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCBlbmR0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLCAocGFyc2VJbnQodGltZV9hcnlbMV0pIC0gMSksIHRpbWVfYXJ5WzJdLCB0aW1lX2FyeVszXSwgdGltZV9hcnlbNF0sIHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgc3RhcnR0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5MlswXSwgKHBhcnNlSW50KHRpbWVfYXJ5MlsxXSkgLSAxKSwgdGltZV9hcnkyWzJdLCB0aW1lX2FyeTJbM10sIHRpbWVfYXJ5Mls0XSwgdGltZV9hcnkyWzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoKGNyZWF0ZWRfdGltZSA+IHN0YXJ0dGltZSAmJiBjcmVhdGVkX3RpbWUgPCBlbmR0aW1lKSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKSA9PiB7XHJcblx0XHRpZiAodGFyID09ICdhbGwnKSB7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpID0+IHtcclxuXHJcblx0fSxcclxuXHRhZGRMaW5rOiAoKSA9PiB7XHJcblx0XHRsZXQgdGFyID0gJCgnLmlucHV0YXJlYSAubW9yZWxpbmsnKTtcclxuXHRcdGlmICh0YXIuaGFzQ2xhc3MoJ3Nob3cnKSkge1xyXG5cdFx0XHR0YXIucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRhci5hZGRDbGFzcygnc2hvdycpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVzZXQ6ICgpID0+IHtcclxuXHRcdGxldCBjb21tYW5kID0gZGF0YS5yYXcuY29tbWFuZDtcclxuXHRcdGlmICgoY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBjb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKSB7XHJcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKSB7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSArIDE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyICsgXCItXCIgKyBtb250aCArIFwiLVwiICsgZGF0ZSArIFwiLVwiICsgaG91ciArIFwiLVwiICsgbWluICsgXCItXCIgKyBzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApIHtcclxuXHR2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcblx0dmFyIG1vbnRocyA9IFsnMDEnLCAnMDInLCAnMDMnLCAnMDQnLCAnMDUnLCAnMDYnLCAnMDcnLCAnMDgnLCAnMDknLCAnMTAnLCAnMTEnLCAnMTInXTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdGlmIChkYXRlIDwgMTApIHtcclxuXHRcdGRhdGUgPSBcIjBcIiArIGRhdGU7XHJcblx0fVxyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHRpZiAobWluIDwgMTApIHtcclxuXHRcdG1pbiA9IFwiMFwiICsgbWluO1xyXG5cdH1cclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0aWYgKHNlYyA8IDEwKSB7XHJcblx0XHRzZWMgPSBcIjBcIiArIHNlYztcclxuXHR9XHJcblx0dmFyIHRpbWUgPSB5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBkYXRlICsgXCIgXCIgKyBob3VyICsgJzonICsgbWluICsgJzonICsgc2VjO1xyXG5cdHJldHVybiB0aW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvYmoyQXJyYXkob2JqKSB7XHJcblx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuXHR9KTtcclxuXHRyZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcblx0dmFyIGksIHIsIHQ7XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0YXJ5W2ldID0gaTtcclxuXHR9XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG5cdFx0dCA9IGFyeVtyXTtcclxuXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuXHRcdGFyeVtpXSA9IHQ7XHJcblx0fVxyXG5cdHJldHVybiBhcnk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG5cdC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcblx0dmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG5cclxuXHR2YXIgQ1NWID0gJyc7XHJcblx0Ly9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcblxyXG5cdC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuXHQvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG5cdGlmIChTaG93TGFiZWwpIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuXHJcblx0XHRcdC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRcdHJvdyArPSBpbmRleCArICcsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG5cclxuXHRcdC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcblx0XHRcdHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG5cclxuXHRcdC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0aWYgKENTViA9PSAnJykge1xyXG5cdFx0YWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcblx0dmFyIGZpbGVOYW1lID0gXCJcIjtcclxuXHQvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuXHRmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csIFwiX1wiKTtcclxuXHJcblx0Ly9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuXHR2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG5cclxuXHQvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuXHQvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG5cdC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG5cdC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcblxyXG5cdC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG5cdGxpbmsuaHJlZiA9IHVyaTtcclxuXHJcblx0Ly9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuXHRsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG5cdGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG5cclxuXHQvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcblx0bGluay5jbGljaygpO1xyXG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
