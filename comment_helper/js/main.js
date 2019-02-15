'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
window.onerror = handleErr;
var TABLE;
var lastCommand = 'comments';
var addLink = false;
var auth_scope = '';

function handleErr(msg, url, l) {
	if (!errorMessage) {
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		console.log("Error occur URL： " + $('#enterURL .url').val());
		$(".console .error").append("<br>" + $('#enterURL .url').val());
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
			$("#btn_excel").text("輸出EXCEL");
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
			if (filterData.length > 7000) {
				$(".bigExcel").removeClass("hide");
			} else {
				JSONToCSVConvertor(data.excel(filterData), "Comment_helper", true);
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
				swal('付費授權完成，請再次執行抓留言', 'Authorization Finished! Please getComments again.', 'success').done();
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
			// if (auth_scope.indexOf("groups_access_member_info") < 0) {
			// 	swal({
			// 		title: '抓分享需付費，詳情請見粉絲專頁',
			// 		html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
			// 		type: 'warning'
			// 	}).done();
			// } else {
			// 	let postdata = JSON.parse(localStorage.postdata);
			// 	if (postdata.type === 'personal') {
			// 		fb.authOK();
			// 	} else if (postdata.type === 'group') {
			// 		fb.authOK();
			// 	} else {
			// 		fb.authOK();
			// 	}
			// }
			var postdata = JSON.parse(localStorage.postdata);
			if (postdata.type === 'personal') {
				fb.authOK();
			} else if (postdata.type === 'group') {
				fb.authOK();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIlRBQkxFIiwibGFzdENvbW1hbmQiLCJhZGRMaW5rIiwiYXV0aF9zY29wZSIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsInZhbCIsImFwcGVuZCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJkYXRhIiwiZXh0ZW5zaW9uIiwiY2xpY2siLCJlIiwiZmIiLCJleHRlbnNpb25BdXRoIiwiZGF0YXMiLCJjb21tYW5kIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwicmFua2VyIiwicmF3IiwiZmluaXNoIiwiY3RybEtleSIsImFsdEtleSIsImNvbmZpZyIsIm9yZGVyIiwiZ2V0QXV0aCIsImxpa2VzIiwiY2hvb3NlIiwiaW5pdCIsInVpIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImZpbHRlciIsInJlYWN0IiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsInN0YXJ0VGltZSIsImZvcm1hdCIsImVuZFRpbWUiLCJzZXRTdGFydERhdGUiLCJmaWx0ZXJEYXRhIiwiZXhwb3J0VG9Kc29uRmlsZSIsImxlbmd0aCIsIkpTT05Ub0NTVkNvbnZlcnRvciIsImV4Y2VsIiwiZXhjZWxTdHJpbmciLCJzdHJpbmdpZnkiLCJjaV9jb3VudGVyIiwiaW1wb3J0IiwiZmlsZXMiLCJqc29uRGF0YSIsImRhdGFTdHIiLCJkYXRhVXJpIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiZXhwb3J0RmlsZURlZmF1bHROYW1lIiwibGlua0VsZW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwic2hhcmVCVE4iLCJhbGVydCIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIndvcmQiLCJub3dEYXRlIiwiYXV0aCIsInBhZ2VUb2tlbiIsImZyb21fZXh0ZW5zaW9uIiwidXNlcl9wb3N0cyIsInR5cGUiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsImF1dGhfdHlwZSIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJzd2FsIiwiZG9uZSIsImZiaWQiLCJleHRlbnNpb25DYWxsYmFjayIsInBvc3RkYXRhIiwiYXV0aE9LIiwidXNlcmlkIiwibm93TGVuZ3RoIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJmdWxsSUQiLCJnZXQiLCJ0aGVuIiwicmVzIiwiaSIsInB1c2giLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2VfYXJyYXkiLCJwdXJlSUQiLCJ0b1N0cmluZyIsImFwaSIsImQiLCJmcm9tIiwiaWQiLCJuYW1lIiwidXBkYXRlZF90aW1lIiwiY3JlYXRlZF90aW1lIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsInRtcCIsInBvc3RsaW5rIiwibWVzc2FnZSIsInN0b3J5IiwidGltZUNvbnZlcnRlciIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJzdHIiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsImZpbHRlcmRhdGEiLCJ0aGVhZCIsInRib2R5IiwicGljIiwiaG9zdCIsImVudHJpZXMiLCJqIiwicGljdHVyZSIsInRkIiwic2NvcmUiLCJsaW5rIiwibGlrZV9jb3VudCIsInRyIiwiaW5zZXJ0IiwiaHRtbCIsImFjdGl2ZSIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJuIiwicGFyc2VJbnQiLCJmaW5kIiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJtYXAiLCJpbmRleCIsInJvd3MiLCJub2RlcyIsImlubmVySFRNTCIsIm5vdyIsImsiLCJ0YXIiLCJlcSIsImluc2VydEJlZm9yZSIsImdlbl9iaWdfYXdhcmQiLCJsaSIsImF3YXJkcyIsImhhc0F0dHJpYnV0ZSIsImF3YXJkX25hbWUiLCJhdHRyIiwidGltZSIsImNsb3NlX2JpZ19hd2FyZCIsImVtcHR5Iiwic3Vic3RyaW5nIiwicG9zdHVybCIsIm9iaiIsIm9nX29iamVjdCIsInJlZ2V4IiwibmV3dXJsIiwic3Vic3RyIiwibWF0Y2giLCJ1cmx0eXBlIiwiY2hlY2tUeXBlIiwiY2hlY2tQYWdlSUQiLCJwYWdlSUQiLCJ2aWRlbyIsImxpdmVfc3RhdHVzIiwiZXJyb3IiLCJhY2Nlc3NfdG9rZW4iLCJyZWdleDIiLCJ0ZW1wIiwidGVzdCIsInBhZ2VuYW1lIiwidGFnIiwidW5pcXVlIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsInVuZGVmaW5lZCIsIm1lc3NhZ2VfdGFncyIsInN0IiwidCIsInRpbWVfYXJ5MiIsInNwbGl0IiwidGltZV9hcnkiLCJlbmR0aW1lIiwibW9tZW50IiwiRGF0ZSIsIl9kIiwic3RhcnR0aW1lIiwiYSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwicm93Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImhyZWYiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWlCQyxTQUFqQjtBQUNBLElBQUlDLEtBQUo7QUFDQSxJQUFJQyxjQUFjLFVBQWxCO0FBQ0EsSUFBSUMsVUFBVSxLQUFkO0FBQ0EsSUFBSUMsYUFBYSxFQUFqQjs7QUFFQSxTQUFTSixTQUFULENBQW1CSyxHQUFuQixFQUF3QkMsR0FBeEIsRUFBNkJDLENBQTdCLEVBQWdDO0FBQy9CLEtBQUksQ0FBQ1YsWUFBTCxFQUFtQjtBQUNsQlcsVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWlELDRCQUFqRDtBQUNBRCxVQUFRQyxHQUFSLENBQVksc0JBQXNCQyxFQUFFLGdCQUFGLEVBQW9CQyxHQUFwQixFQUFsQztBQUNBRCxJQUFFLGlCQUFGLEVBQXFCRSxNQUFyQixDQUE0QixTQUFTRixFQUFFLGdCQUFGLEVBQW9CQyxHQUFwQixFQUFyQztBQUNBRCxJQUFFLGlCQUFGLEVBQXFCRyxNQUFyQjtBQUNBaEIsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRGEsRUFBRUksUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVk7QUFDN0IsS0FBSUMsT0FBT0MsU0FBU0MsTUFBcEI7QUFDQSxLQUFJRixLQUFLRyxPQUFMLENBQWEsV0FBYixLQUE2QixDQUFqQyxFQUFvQztBQUNuQ1QsSUFBRSxvQkFBRixFQUF3QlUsV0FBeEIsQ0FBb0MsTUFBcEM7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LEdBQXZCLENBQVg7QUFDQXlHLE1BQUtnSCxJQUFMLEdBQVlGLEdBQVo7O0FBRUE7QUFDQTlHLE1BQUtpSCxLQUFMLEdBQWEsbUJBQWI7QUFDQWpILE1BQUtrSCxRQUFMLEdBQWdCTCxXQUFXLE1BQTNCOztBQUVBO0FBQ0F2UixVQUFTNlIsSUFBVCxDQUFjQyxXQUFkLENBQTBCcEgsSUFBMUI7QUFDQUEsTUFBS2pLLEtBQUw7QUFDQVQsVUFBUzZSLElBQVQsQ0FBY0UsV0FBZCxDQUEwQnJILElBQTFCO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3IgPSBoYW5kbGVFcnI7XHJcbnZhciBUQUJMRTtcclxudmFyIGxhc3RDb21tYW5kID0gJ2NvbW1lbnRzJztcclxudmFyIGFkZExpbmsgPSBmYWxzZTtcclxudmFyIGF1dGhfc2NvcGUgPSAnJztcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csIHVybCwgbCkge1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsIFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5hcHBlbmQoXCI8YnI+XCIgKyAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uc2VhcmNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJleHRlbnNpb25cIikgPj0gMCkge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRkYXRhLmV4dGVuc2lvbiA9IHRydWU7XHJcblxyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aCBidXR0b25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJyYW5rZXJcIikgPj0gMCkge1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiAncmFua2VyJyxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucmFua2VyKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcblxyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLmxpa2VzID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRmYi5nZXRBdXRoKCd1cmxfY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHQkKFwiI21vcmVwb3N0XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdHVpLmFkZExpbmsoKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi51aXBhbmVsIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZL01NL0REIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFx0XCLml6VcIixcclxuXHRcdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFx0XCLkuIlcIixcclxuXHRcdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFx0XCLlha1cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xyXG5cdFx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XHRcIuS4ieaciFwiLFxyXG5cdFx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XHRcIuWFreaciFwiLFxyXG5cdFx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XHRcIuS5neaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XHRcIuWNgeS6jOaciFwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwiZmlyc3REYXlcIjogMVxyXG5cdFx0fSxcclxuXHR9LCBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIuc3RhcnRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBlbmQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShjb25maWcuZmlsdGVyLnN0YXJ0VGltZSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGV4cG9ydFRvSnNvbkZpbGUoZmlsdGVyRGF0YSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKSB7XHJcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSkge1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGV4cG9ydFRvSnNvbkZpbGUoanNvbkRhdGEpIHtcclxuICAgIGxldCBkYXRhU3RyID0gSlNPTi5zdHJpbmdpZnkoanNvbkRhdGEpO1xyXG4gICAgbGV0IGRhdGFVcmkgPSAnZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgsJysgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFTdHIpO1xyXG4gICAgXHJcbiAgICBsZXQgZXhwb3J0RmlsZURlZmF1bHROYW1lID0gJ2RhdGEuanNvbic7XHJcbiAgICBcclxuICAgIGxldCBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsIGRhdGFVcmkpO1xyXG4gICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGV4cG9ydEZpbGVEZWZhdWx0TmFtZSk7XHJcbiAgICBsaW5rRWxlbWVudC5jbGljaygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaGFyZUJUTigpIHtcclxuXHRhbGVydCgn6KqN55yf55yL5a6M6Lez5Ye65L6G55qE6YKj6aCB5LiK6Z2i5a+r5LqG5LuA6bq8XFxuXFxu55yL5a6M5L2g5bCx5pyD55+l6YGT5L2g54K65LuA6bq85LiN6IO95oqT5YiG5LqrJyk7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCAnbWVzc2FnZV90YWdzJywgJ21lc3NhZ2UnLCAnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsICdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFsnY3JlYXRlZF90aW1lJywgJ2Zyb20nLCAnbWVzc2FnZScsICdzdG9yeSddLFxyXG5cdFx0bGlrZXM6IFsnbmFtZSddXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJyxcclxuXHRcdGxpa2VzOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2My4yJyxcclxuXHRcdHJlYWN0aW9uczogJ3YzLjInLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2My4yJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YzLjInLFxyXG5cdFx0ZmVlZDogJ3YzLjInLFxyXG5cdFx0Z3JvdXA6ICd2My4yJ1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdHN0YXJ0VGltZTogJzIwMDAtMTItMzEtMDAtMDAtMDAnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRvcmRlcjogJ2Nocm9ub2xvZ2ljYWwnLFxyXG5cdGF1dGg6ICdtYW5hZ2VfcGFnZXMsZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycsXHJcblx0bGlrZXM6IGZhbHNlLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcblx0ZnJvbV9leHRlbnNpb246IGZhbHNlLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJykgPT4ge1xyXG5cdFx0aWYgKHR5cGUgPT09ICcnKSB7XHJcblx0XHRcdGFkZExpbmsgPSB0cnVlO1xyXG5cdFx0XHR0eXBlID0gbGFzdENvbW1hbmQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZGRMaW5rID0gZmFsc2U7XHJcblx0XHRcdGxhc3RDb21tYW5kID0gdHlwZTtcclxuXHRcdH1cclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcgLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRjb25maWcuZnJvbV9leHRlbnNpb24gPSBmYWxzZTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKSB7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxyXG5cdFx0XHRcdFx0XHQnc3VjY2VzcydcclxuXHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT0gXCJzaGFyZWRwb3N0c1wiKSB7XHRcclxuXHRcdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKSA9PiB7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHQvLyBpZiAoYXV0aF9zY29wZS5pbmRleE9mKFwiZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mb1wiKSA8IDApIHtcclxuXHRcdFx0Ly8gXHRzd2FsKHtcclxuXHRcdFx0Ly8gXHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0Ly8gXHRcdGh0bWw6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdC8vIFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0Ly8gXHR9KS5kb25lKCk7XHJcblx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdC8vIFx0bGV0IHBvc3RkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucG9zdGRhdGEpO1xyXG5cdFx0XHQvLyBcdGlmIChwb3N0ZGF0YS50eXBlID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdC8vIFx0XHRmYi5hdXRoT0soKTtcclxuXHRcdFx0Ly8gXHR9IGVsc2UgaWYgKHBvc3RkYXRhLnR5cGUgPT09ICdncm91cCcpIHtcclxuXHRcdFx0Ly8gXHRcdGZiLmF1dGhPSygpO1xyXG5cdFx0XHQvLyBcdH0gZWxzZSB7XHJcblx0XHRcdC8vIFx0XHRmYi5hdXRoT0soKTtcclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0bGV0IHBvc3RkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucG9zdGRhdGEpO1xyXG5cdFx0XHRcdGlmIChwb3N0ZGF0YS50eXBlID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHRmYi5hdXRoT0soKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHBvc3RkYXRhLnR5cGUgPT09ICdncm91cCcpIHtcclxuXHRcdFx0XHRcdGZiLmF1dGhPSygpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmYi5hdXRoT0soKTtcclxuXHRcdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGF1dGhPSzogKCkgPT4ge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgcG9zdGRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5wb3N0ZGF0YSk7XHJcblx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdGNvbW1hbmQ6IHBvc3RkYXRhLmNvbW1hbmQsXHJcblx0XHRcdGRhdGE6IEpTT04ucGFyc2UoJChcIi5jaHJvbWVcIikudmFsKCkpXHJcblx0XHR9XHJcblx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiBbXSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W6LOH5paZ5LitLi4uJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRpZiAoIWFkZExpbmspIHtcclxuXHRcdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCkgPT4ge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoJy5wdXJlX2ZiaWQnKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEuZ2V0KGZiaWQpLnRoZW4oKHJlcykgPT4ge1xyXG5cdFx0XHQvLyBmYmlkLmRhdGEgPSByZXM7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT0gXCJ1cmxfY29tbWVudHNcIikge1xyXG5cdFx0XHRcdGZiaWQuZGF0YSA9IFtdO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGkgb2YgcmVzKSB7XHJcblx0XHRcdFx0ZmJpZC5kYXRhLnB1c2goaSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YS5maW5pc2goZmJpZCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgY29tbWFuZCA9IGZiaWQuY29tbWFuZDtcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJyl7XHJcblx0XHRcdFx0ZmJpZC5mdWxsSUQgPSBmYmlkLnB1cmVJRDtcclxuXHRcdFx0XHRjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnICYmIGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJykge1xyXG5cdFx0XHRcdGZiaWQuZnVsbElEID0gZmJpZC5wdXJlSUQ7XHJcblx0XHRcdFx0ZmJpZC5jb21tYW5kID0gJ2xpa2VzJztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmRlYnVnPWFsbGApO1xyXG5cclxuXHRcdFx0Ly8gaWYoJCgnLnRva2VuJykudmFsKCkgPT09ICcnKXtcclxuXHRcdFx0Ly8gXHQkKCcudG9rZW4nKS52YWwoY29uZmlnLnBhZ2VUb2tlbik7XHJcblx0XHRcdC8vIH1lbHNle1xyXG5cdFx0XHQvLyBcdGNvbmZpZy5wYWdlVG9rZW4gPSAkKCcudG9rZW4nKS52YWwoKTtcclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mb3JkZXI9JHtjb25maWcub3JkZXJ9JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59JmRlYnVnPWFsbGAsIChyZXMpID0+IHtcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJyArIGRhdGEubm93TGVuZ3RoICsgJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRpZiAoKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBmYmlkLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBkLm5hbWVcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChjb25maWcubGlrZXMpIGQudHlwZSA9IFwiTElLRVwiO1xyXG5cdFx0XHRcdFx0aWYgKGQuZnJvbSkge1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogZC5pZFxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0ID0gMCkge1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsICdsaW1pdD0nICsgbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZC5pZCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICgoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGZiaWQuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGQubmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYgKGQuZnJvbSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpID0+IHtcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpID0+IHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi51cGRhdGVfYXJlYSwuZG9uYXRlX2FyZWFcIikuc2xpZGVVcCgpO1xyXG5cdFx0JChcIi5yZXN1bHRfYXJlYVwiKS5zbGlkZURvd24oKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdFx0dWkucmVzZXQoKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpID0+IHtcclxuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0bGV0IGlzVGFnID0gJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHQvLyBpZiAoY29uZmlnLmZyb21fZXh0ZW5zaW9uID09PSBmYWxzZSAmJiByYXdEYXRhLmNvbW1hbmQgPT09ICdjb21tZW50cycpIHtcclxuXHRcdC8vIFx0cmF3RGF0YS5kYXRhID0gcmF3RGF0YS5kYXRhLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdC8vIFx0XHRyZXR1cm4gaXRlbS5pc19oaWRkZW4gPT09IGZhbHNlXHJcblx0XHQvLyBcdH0pO1xyXG5cdFx0Ly8gfVxyXG5cdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xyXG5cdFx0cmF3RGF0YS5maWx0ZXJlZCA9IG5ld0RhdGE7XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpIHtcclxuXHRcdFx0dGFibGUuZ2VuZXJhdGUocmF3RGF0YSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gcmF3RGF0YTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4Y2VsOiAocmF3KSA9PiB7XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRjb25zb2xlLmxvZyhyYXcpO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKSB7XHJcblx0XHRcdGlmIChyYXcuY29tbWFuZCA9PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIjogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuihqOaDhVwiOiB0aGlzLnR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCI6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpID0+IHtcclxuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmRhdGEgPSByYXdkYXRhLmZpbHRlcmVkO1xyXG5cdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRpZiAoKHJhd2RhdGEuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCByYXdkYXRhLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuihqOaDhTwvdGQ+YDtcclxuXHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuaOkuWQjTwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+5YiG5pW4PC90ZD5gO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaG9zdCA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJztcclxuXHRcdGlmIChkYXRhLnJhdy50eXBlID09PSAndXJsX2NvbW1lbnRzJykgaG9zdCA9ICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkgKyAnP2ZiX2NvbW1lbnRfaWQ9JztcclxuXHJcblx0XHRmb3IgKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJkYXRhLmVudHJpZXMoKSkge1xyXG5cdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRpZiAocGljKSB7XHJcblx0XHRcdFx0cGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHtwaWN0dXJlfSR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5gO1xyXG5cdFx0XHRpZiAoKHJhd2RhdGEuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCByYXdkYXRhLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKSB7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHRcdFx0XHR0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPjxhIGhyZWY9J2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0ICA8dGQ+JHt2YWwuc2NvcmV9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBsaW5rID0gdmFsLmlkO1xyXG5cdFx0XHRcdGlmIChjb25maWcuZnJvbV9leHRlbnNpb24pIHtcclxuXHRcdFx0XHRcdGxpbmsgPSB2YWwucG9zdGxpbms7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCIke2hvc3R9JHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2V9PC9hPjwvdGQ+XHJcblx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cclxuXHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKSB7XHJcblx0XHRcdFRBQkxFID0gJChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoXCIjc2VhcmNoTmFtZVwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEFCTEVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChcIiNzZWFyY2hDb21tZW50XCIpLm9uKCdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUQUJMRVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKSA9PiB7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNzZWFyY2hDb21tZW50XCIpLnZhbCgpICE9ICcnKSB7XHJcblx0XHRcdHRhYmxlLnJlZG8oKTtcclxuXHRcdH1cclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKSB7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XHJcblx0XHRcdFx0XHRcdFwibmFtZVwiOiBwLFxyXG5cdFx0XHRcdFx0XHRcIm51bVwiOiBuXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbygpO1xyXG5cdH0sXHJcblx0Z286ICgpID0+IHtcclxuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhLmZpbHRlcmVkLmxlbmd0aCkuc3BsaWNlKDAsIGNob29zZS5udW0pO1xyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0Y2hvb3NlLmF3YXJkLm1hcCgodmFsLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0ciB0aXRsZT1cIuesrCcgKyAoaW5kZXggKyAxKSArICflkI1cIj4nICsgJCgnLm1haW5fdGFibGUnKS5EYXRhVGFibGUoKS5yb3dzKHtcclxuXHRcdFx0XHRzZWFyY2g6ICdhcHBsaWVkJ1xyXG5cdFx0XHR9KS5ub2RlcygpW3ZhbF0uaW5uZXJIVE1MICsgJzwvdHI+JztcclxuXHRcdH0pXHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYgKGNob29zZS5kZXRhaWwpIHtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvciAobGV0IGsgaW4gY2hvb3NlLmxpc3QpIHtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjVcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH0sXHJcblx0Z2VuX2JpZ19hd2FyZDogKCkgPT4ge1xyXG5cdFx0bGV0IGxpID0gJyc7XHJcblx0XHRsZXQgYXdhcmRzID0gW107XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRib2R5IHRyJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHZhbCkge1xyXG5cdFx0XHRsZXQgYXdhcmQgPSB7fTtcclxuXHRcdFx0aWYgKHZhbC5oYXNBdHRyaWJ1dGUoJ3RpdGxlJykpIHtcclxuXHRcdFx0XHRhd2FyZC5hd2FyZF9uYW1lID0gZmFsc2U7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS50ZXh0KCk7XHJcblx0XHRcdFx0YXdhcmQudXNlcmlkID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLmF0dHIoJ2hyZWYnKS5yZXBsYWNlKCdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJywgJycpO1xyXG5cdFx0XHRcdGF3YXJkLm1lc3NhZ2UgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLmxpbmsgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykuYXR0cignaHJlZicpO1xyXG5cdFx0XHRcdGF3YXJkLnRpbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgkKHZhbCkuZmluZCgndGQnKS5sZW5ndGggLSAxKS50ZXh0KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IHRydWU7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLnRleHQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhd2FyZHMucHVzaChhd2FyZCk7XHJcblx0XHR9KTtcclxuXHRcdGZvciAobGV0IGkgb2YgYXdhcmRzKSB7XHJcblx0XHRcdGlmIChpLmF3YXJkX25hbWUgPT09IHRydWUpIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpIGNsYXNzPVwicHJpemVOYW1lXCI+JHtpLm5hbWV9PC9saT5gO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxpICs9IGA8bGk+XHJcblx0XHRcdFx0PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPjxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH0vcGljdHVyZT90eXBlPWxhcmdlJmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59XCIgYWx0PVwiXCI+PC9hPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJpbmZvXCI+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJuYW1lXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5uYW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5tZXNzYWdlfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJ0aW1lXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS50aW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9saT5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuYXBwZW5kKGxpKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0Y2xvc2VfYmlnX2F3YXJkOiAoKSA9PiB7XHJcblx0XHQkKCcuYmlnX2F3YXJkJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQgdWwnKS5lbXB0eSgpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZiaWQgPSB7XHJcblx0ZmJpZDogW10sXHJcblx0aW5pdDogKHR5cGUpID0+IHtcclxuXHRcdGNvbmZpZy5wYWdlVG9rZW4gPSAnJztcclxuXHRcdGZiaWQuZmJpZCA9IFtdO1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRGQi5hcGkoXCIvbWVcIiwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRkYXRhLnVzZXJpZCA9IHJlcy5pZDtcclxuXHRcdFx0bGV0IHVybCA9ICcnO1xyXG5cdFx0XHRpZiAoYWRkTGluaykge1xyXG5cdFx0XHRcdHVybCA9IGZiaWQuZm9ybWF0KCQoJy5tb3JlbGluayAuYWRkdXJsJykudmFsKCkpO1xyXG5cdFx0XHRcdCQoJy5tb3JlbGluayAuYWRkdXJsJykudmFsKCcnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodXJsLmluZGV4T2YoJy5waHA/JykgPT09IC0xICYmIHVybC5pbmRleE9mKCc/JykgPiAwKSB7XHJcblx0XHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZignPycpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmYmlkLmdldCh1cmwsIHR5cGUpLnRoZW4oKGZiaWQpID0+IHtcclxuXHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQvLyAkKCcuaWRlbnRpdHknKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoYOeZu+WFpei6q+S7ve+8mjxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtyZXMuaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxzcGFuPiR7cmVzLm5hbWV9PC9zcGFuPmApO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6ICh1cmwsIHR5cGUpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGlmICh0eXBlID09ICd1cmxfY29tbWVudHMnKSB7XHJcblx0XHRcdFx0bGV0IHBvc3R1cmwgPSB1cmw7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIj9cIikgPiAwKSB7XHJcblx0XHRcdFx0XHRwb3N0dXJsID0gcG9zdHVybC5zdWJzdHJpbmcoMCwgcG9zdHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdEZCLmFwaShgLyR7cG9zdHVybH1gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0XHRmdWxsSUQ6IHJlcy5vZ19vYmplY3QuaWQsXHJcblx0XHRcdFx0XHRcdHR5cGU6IHR5cGUsXHJcblx0XHRcdFx0XHRcdGNvbW1hbmQ6ICdjb21tZW50cydcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRjb25maWcubGltaXRbJ2NvbW1lbnRzJ10gPSAnMjUnO1xyXG5cdFx0XHRcdFx0Y29uZmlnLm9yZGVyID0gJyc7XHJcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRsZXQgbmV3dXJsID0gdXJsLnN1YnN0cih1cmwuaW5kZXhPZignLycsIDI4KSArIDEsIDIwMCk7XHJcblx0XHRcdFx0Ly8gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyDlhbEyNeWtl+WFg++8jOWboOatpOmBuDI46ZaL5aeL5om+L1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSBuZXd1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdGxldCB1cmx0eXBlID0gZmJpZC5jaGVja1R5cGUodXJsKTtcclxuXHRcdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpID0+IHtcclxuXHRcdFx0XHRcdGlmIChpZCA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0XHR1cmx0eXBlID0gJ3BlcnNvbmFsJztcclxuXHRcdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0XHRcdHBhZ2VJRDogaWQsXHJcblx0XHRcdFx0XHRcdHR5cGU6IHVybHR5cGUsXHJcblx0XHRcdFx0XHRcdGNvbW1hbmQ6IHR5cGUsXHJcblx0XHRcdFx0XHRcdGRhdGE6IFtdXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0aWYgKGFkZExpbmspIG9iai5kYXRhID0gZGF0YS5yYXcuZGF0YTsgLy/ov73liqDosrzmlodcclxuXHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdmYmlkPScpO1xyXG5cdFx0XHRcdFx0XHRpZiAoc3RhcnQgPj0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdGxldCBlbmQgPSB1cmwuaW5kZXhPZihcIiZcIiwgc3RhcnQpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0ICsgNSwgZW5kKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZigncG9zdHMvJyk7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQgKyA2LCB1cmwubGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRsZXQgdmlkZW8gPSB1cmwuaW5kZXhPZigndmlkZW9zLycpO1xyXG5cdFx0XHRcdFx0XHRpZiAodmlkZW8gPj0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdwdXJlJykge1xyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gdXJsLnJlcGxhY2UoL1xcXCIvZywgJycpO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ2V2ZW50Jykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3miYDmnInnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5jb21tYW5kID0gJ2ZlZWQnO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reafkOevh+eVmeiogOeahOeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ2dyb3VwJykge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgXCJfXCIgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdwaG90bycpIHtcclxuXHRcdFx0XHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRcdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3ZpZGVvJykge1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdEZCLmFwaShgLyR7b2JqLnB1cmVJRH0/ZmllbGRzPWxpdmVfc3RhdHVzYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5saXZlX3N0YXR1cyA9PT0gJ0xJVkUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3VubmFtZScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdEZCLmFwaShgLyR7b2JqLnBhZ2VJRH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2hlY2tUeXBlOiAocG9zdHVybCkgPT4ge1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImZiaWQ9XCIpID49IDApIHtcclxuXHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZigncGVybWFsaW5rJykgPj0gMCkge1xyXG5cdFx0XHRcdHJldHVybiAndW5uYW1lJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3BlcnNvbmFsJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvZ3JvdXBzL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAnZ3JvdXAnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJldmVudHNcIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ2V2ZW50JztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL3Bob3Rvcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3Bob3RvJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL3ZpZGVvcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3ZpZGVvJztcclxuXHRcdH1cclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ1wiJykgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3B1cmUnO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiAnbm9ybWFsJztcclxuXHR9LFxyXG5cdGNoZWNrUGFnZUlEOiAocG9zdHVybCwgdHlwZSkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IHN0YXJ0ID0gcG9zdHVybC5pbmRleE9mKFwiZmFjZWJvb2suY29tXCIpICsgMTM7XHJcblx0XHRcdGxldCBlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsIHN0YXJ0KTtcclxuXHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0aWYgKGVuZCA8IDApIHtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdmYmlkPScpID49IDApIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAndW5uYW1lJykge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCd1bm5hbWUnKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc29sdmUocG9zdHVybC5tYXRjaChyZWdleClbMV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgZ3JvdXAgPSBwb3N0dXJsLmluZGV4T2YoJy9ncm91cHMvJyk7XHJcblx0XHRcdFx0bGV0IGV2ZW50ID0gcG9zdHVybC5pbmRleE9mKCcvZXZlbnRzLycpXHJcblx0XHRcdFx0aWYgKGdyb3VwID49IDApIHtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gZ3JvdXAgKyA4O1xyXG5cdFx0XHRcdFx0ZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLCBzdGFydCk7XHJcblx0XHRcdFx0XHRsZXQgcmVnZXgyID0gL1xcZHs2LH0vZztcclxuXHRcdFx0XHRcdGxldCB0ZW1wID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XHJcblx0XHRcdFx0XHRpZiAocmVnZXgyLnRlc3QodGVtcCkpIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0ZW1wKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ2dyb3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmIChldmVudCA+PSAwKSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCdldmVudCcpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgcGFnZW5hbWUgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcclxuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZW5hbWV9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShyZXMuaWQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Zm9ybWF0OiAodXJsKSA9PiB7XHJcblx0XHRpZiAodXJsLmluZGV4T2YoJ2J1c2luZXNzLmZhY2Vib29rLmNvbS8nKSA+PSAwKSB7XHJcblx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3ZGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgc3RhcnRUaW1lLCBlbmRUaW1lKSA9PiB7XHJcblx0XHRsZXQgZGF0YSA9IHJhd2RhdGEuZGF0YTtcclxuXHRcdGlmICh3b3JkICE9PSAnJykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50YWcoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAoKHJhd2RhdGEuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCByYXdkYXRhLmNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIHN0YXJ0VGltZSwgZW5kVGltZSk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKSA9PiB7XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmIChrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0aWYgKG4uc3RvcnkuaW5kZXhPZih3b3JkKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSkgPT4ge1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3MpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHN0LCB0KSA9PiB7XHJcblx0XHRsZXQgdGltZV9hcnkyID0gc3Quc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgZW5kdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwgKHBhcnNlSW50KHRpbWVfYXJ5WzFdKSAtIDEpLCB0aW1lX2FyeVsyXSwgdGltZV9hcnlbM10sIHRpbWVfYXJ5WzRdLCB0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IHN0YXJ0dGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeTJbMF0sIChwYXJzZUludCh0aW1lX2FyeTJbMV0pIC0gMSksIHRpbWVfYXJ5MlsyXSwgdGltZV9hcnkyWzNdLCB0aW1lX2FyeTJbNF0sIHRpbWVfYXJ5Mls1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKChjcmVhdGVkX3RpbWUgPiBzdGFydHRpbWUgJiYgY3JlYXRlZF90aW1lIDwgZW5kdGltZSkgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIikge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcikgPT4ge1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJykge1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcikge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKSA9PiB7XHJcblxyXG5cdH0sXHJcblx0YWRkTGluazogKCkgPT4ge1xyXG5cdFx0bGV0IHRhciA9ICQoJy5pbnB1dGFyZWEgLm1vcmVsaW5rJyk7XHJcblx0XHRpZiAodGFyLmhhc0NsYXNzKCdzaG93JykpIHtcclxuXHRcdFx0dGFyLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YXIuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlc2V0OiAoKSA9PiB7XHJcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XHJcblx0XHRpZiAoKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpIHtcclxuXHRcdFx0JCgnbGFiZWwudGFnJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICgkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKSkge1xyXG5cdFx0XHRcdCQoXCIjdGFnXCIpLmNsaWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnbGFiZWwudGFnJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCkge1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkgKyAxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGRhdGUgKyBcIi1cIiArIGhvdXIgKyBcIi1cIiArIG1pbiArIFwiLVwiICsgc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKSB7XHJcblx0dmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG5cdHZhciBtb250aHMgPSBbJzAxJywgJzAyJywgJzAzJywgJzA0JywgJzA1JywgJzA2JywgJzA3JywgJzA4JywgJzA5JywgJzEwJywgJzExJywgJzEyJ107XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHRpZiAoZGF0ZSA8IDEwKSB7XHJcblx0XHRkYXRlID0gXCIwXCIgKyBkYXRlO1xyXG5cdH1cclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0aWYgKG1pbiA8IDEwKSB7XHJcblx0XHRtaW4gPSBcIjBcIiArIG1pbjtcclxuXHR9XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdGlmIChzZWMgPCAxMCkge1xyXG5cdFx0c2VjID0gXCIwXCIgKyBzZWM7XHJcblx0fVxyXG5cdHZhciB0aW1lID0geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF0ZSArIFwiIFwiICsgaG91ciArICc6JyArIG1pbiArICc6JyArIHNlYztcclxuXHRyZXR1cm4gdGltZTtcclxufVxyXG5cclxuZnVuY3Rpb24gb2JqMkFycmF5KG9iaikge1xyXG5cdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0cmV0dXJuIFt2YWx1ZV07XHJcblx0fSk7XHJcblx0cmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcblx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG5cdHZhciBpLCByLCB0O1xyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdGFyeVtpXSA9IGk7XHJcblx0fVxyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuXHRcdHQgPSBhcnlbcl07XHJcblx0XHRhcnlbcl0gPSBhcnlbaV07XHJcblx0XHRhcnlbaV0gPSB0O1xyXG5cdH1cclxuXHRyZXR1cm4gYXJ5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuXHQvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG5cdHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuXHJcblx0dmFyIENTViA9ICcnO1xyXG5cdC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG5cclxuXHQvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcblx0Ly9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuXHRpZiAoU2hvd0xhYmVsKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcblxyXG5cdFx0XHQvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG5cdFx0XHRyb3cgKz0gaW5kZXggKyAnLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuXHJcblx0XHQvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHQvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG5cdFx0XHRyb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuXHJcblx0XHQvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdGlmIChDU1YgPT0gJycpIHtcclxuXHRcdGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG5cdHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcblx0Ly90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcblx0ZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLCBcIl9cIik7XHJcblxyXG5cdC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcblx0dmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuXHJcblx0Ly8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcblx0Ly8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuXHQvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuXHQvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG5cclxuXHQvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuXHRsaW5rLmhyZWYgPSB1cmk7XHJcblxyXG5cdC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcblx0bGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuXHRsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuXHJcblx0Ly90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG5cdGxpbmsuY2xpY2soKTtcclxuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
