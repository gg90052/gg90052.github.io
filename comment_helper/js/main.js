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
			var url = 'data:text/json;charset=utf8,' + JSON.stringify(filterData);
			window.open(url, '_blank');
			window.focus();
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
				if (auth_scope.indexOf('groups_access_member_info') >= 0) {
					swal('付費授權完成，請再次執行抓留言', 'Authorization Finished! Please getComments again.', 'success').done();
				} else {
					swal('付費授權失敗，請聯絡管理員確認', 'Authorization Failed! Please contact the admin.', 'error').done();
				}
			} else if (type == "sharedposts") {
				if (auth_scope.indexOf("groups_access_member_info") < 0) {
					swal({
						title: '抓分享需付費，詳情請見粉絲專頁',
						html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
						type: 'warning'
					}).done();
				} else {
					fb.user_posts = true;
					fbid.init(type);
				}
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
				var postdata = JSON.parse(localStorage.postdata);
				if (postdata.type === 'personal') {
					fb.authOK();
				} else if (postdata.type === 'group') {
					fb.authOK();
				} else {
					fb.authOK();
				}
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
			if (fbid.type === 'group') command = 'group';
			if (fbid.type === 'group' && fbid.command !== 'reactions') fbid.fullID = fbid.pureID;
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

						if (fbid.command == 'reactions' || config.likes) {
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
								if (fbid.command == 'reactions' || config.likes) {
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
		if (rawdata.command === 'reactions' || config.likes) {
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
				if (rawdata.command === 'reactions' || config.likes) {
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
					li += '<li>\n\t\t\t\t<a href="https://www.facebook.com/' + i.userid + '" target="_blank"><img src="https://graph.facebook.com/' + i.userid + '/picture?type=large" alt=""></a>\n\t\t\t\t<div class="info">\n\t\t\t\t<p class="name"><a href="https://www.facebook.com/' + i.userid + '" target="_blank">' + i.name + '</a></p>\n\t\t\t\t<p class="message"><a href="' + i.link + '" target="_blank">' + i.message + '</a></p>\n\t\t\t\t<p class="time"><a href="' + i.link + '" target="_blank">' + i.time + '</a></p>\n\t\t\t\t</div>\n\t\t\t\t</li>';
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
							if (auth_scope.indexOf("groups_access_member_info") > 0) {
								obj.pureID = result[result.length - 1];
								obj.pageID = result[0];
								obj.fullID = obj.pageID + "_" + obj.pureID;
								resolve(obj);
							} else {
								swal({
									title: '社團使用需付費，詳情請見粉絲團',
									html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
									type: 'warning'
								}).done();
							}
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
		if (rawdata.command === 'reactions' || config.likes) {
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
		if (command === 'reactions' || config.likes) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIlRBQkxFIiwibGFzdENvbW1hbmQiLCJhZGRMaW5rIiwiYXV0aF9zY29wZSIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsInZhbCIsImFwcGVuZCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJkYXRhIiwiZXh0ZW5zaW9uIiwiY2xpY2siLCJlIiwiZmIiLCJleHRlbnNpb25BdXRoIiwiZGF0YXMiLCJjb21tYW5kIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwicmFua2VyIiwicmF3IiwiZmluaXNoIiwiY3RybEtleSIsImFsdEtleSIsImNvbmZpZyIsIm9yZGVyIiwiZ2V0QXV0aCIsImxpa2VzIiwiY2hvb3NlIiwiaW5pdCIsInVpIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImZpbHRlciIsInJlYWN0IiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsInN0YXJ0VGltZSIsImZvcm1hdCIsImVuZFRpbWUiLCJzZXRTdGFydERhdGUiLCJmaWx0ZXJEYXRhIiwic3RyaW5naWZ5Iiwib3BlbiIsImZvY3VzIiwibGVuZ3RoIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiZXhjZWwiLCJleGNlbFN0cmluZyIsImNpX2NvdW50ZXIiLCJpbXBvcnQiLCJmaWxlcyIsInNoYXJlQlROIiwiYWxlcnQiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJ3b3JkIiwibm93RGF0ZSIsImF1dGgiLCJwYWdlVG9rZW4iLCJmcm9tX2V4dGVuc2lvbiIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJhdXRoX3R5cGUiLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJ0aXRsZSIsImh0bWwiLCJmYmlkIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJwb3N0ZGF0YSIsImF1dGhPSyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwiZ2V0IiwidGhlbiIsInJlcyIsImkiLCJwdXNoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwcm9taXNlX2FycmF5IiwicHVyZUlEIiwidG9TdHJpbmciLCJhcGkiLCJkIiwiZnJvbSIsImlkIiwibmFtZSIsInVwZGF0ZWRfdGltZSIsImNyZWF0ZWRfdGltZSIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsInJlc2V0IiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJwcm9wIiwiaXNUYWciLCJuZXdEYXRhIiwidG90YWxGaWx0ZXIiLCJvYmoyQXJyYXkiLCJmaWx0ZXJlZCIsIm5ld09iaiIsImVhY2giLCJ0bXAiLCJwb3N0bGluayIsIm1lc3NhZ2UiLCJzdG9yeSIsInRpbWVDb252ZXJ0ZXIiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50Iiwic3RyIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsInBpYyIsImhvc3QiLCJlbnRyaWVzIiwiaiIsInBpY3R1cmUiLCJ0ZCIsInNjb3JlIiwibGluayIsImxpa2VfY291bnQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJuIiwicGFyc2VJbnQiLCJmaW5kIiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJtYXAiLCJpbmRleCIsInJvd3MiLCJub2RlcyIsImlubmVySFRNTCIsIm5vdyIsImsiLCJ0YXIiLCJlcSIsImluc2VydEJlZm9yZSIsImdlbl9iaWdfYXdhcmQiLCJsaSIsImF3YXJkcyIsImhhc0F0dHJpYnV0ZSIsImF3YXJkX25hbWUiLCJhdHRyIiwidGltZSIsImNsb3NlX2JpZ19hd2FyZCIsImVtcHR5Iiwic3Vic3RyaW5nIiwicG9zdHVybCIsIm9iaiIsIm9nX29iamVjdCIsInJlZ2V4IiwibmV3dXJsIiwic3Vic3RyIiwibWF0Y2giLCJ1cmx0eXBlIiwiY2hlY2tUeXBlIiwiY2hlY2tQYWdlSUQiLCJwYWdlSUQiLCJ2aWRlbyIsImxpdmVfc3RhdHVzIiwiZXJyb3IiLCJhY2Nlc3NfdG9rZW4iLCJyZWdleDIiLCJ0ZW1wIiwidGVzdCIsInBhZ2VuYW1lIiwidGFnIiwidW5pcXVlIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsInVuZGVmaW5lZCIsIm1lc3NhZ2VfdGFncyIsInN0IiwidCIsInRpbWVfYXJ5MiIsInNwbGl0IiwidGltZV9hcnkiLCJlbmR0aW1lIiwibW9tZW50IiwiRGF0ZSIsIl9kIiwic3RhcnR0aW1lIiwiYSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwicm93Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQkMsU0FBakI7QUFDQSxJQUFJQyxLQUFKO0FBQ0EsSUFBSUMsY0FBYyxVQUFsQjtBQUNBLElBQUlDLFVBQVUsS0FBZDtBQUNBLElBQUlDLGFBQWEsRUFBakI7O0FBRUEsU0FBU0osU0FBVCxDQUFtQkssR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxDQUE3QixFQUFnQztBQUMvQixLQUFJLENBQUNWLFlBQUwsRUFBbUI7QUFDbEJXLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFpRCw0QkFBakQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQkMsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBbEM7QUFDQUQsSUFBRSxpQkFBRixFQUFxQkUsTUFBckIsQ0FBNEIsU0FBU0YsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBckM7QUFDQUQsSUFBRSxpQkFBRixFQUFxQkcsTUFBckI7QUFDQWhCLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBO0FBQ0RhLEVBQUVJLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFZO0FBQzdCLEtBQUlDLE9BQU9DLFNBQVNDLE1BQXBCO0FBQ0EsS0FBSUYsS0FBS0csT0FBTCxDQUFhLFdBQWIsS0FBNkIsQ0FBakMsRUFBb0M7QUFDbkNULElBQUUsb0JBQUYsRUFBd0JVLFdBQXhCLENBQW9DLE1BQXBDO0FBQ0FDLE9BQUtDLFNBQUwsR0FBaUIsSUFBakI7O0FBRUFaLElBQUUsMkJBQUYsRUFBK0JhLEtBQS9CLENBQXFDLFVBQVVDLENBQVYsRUFBYTtBQUNqREMsTUFBR0MsYUFBSDtB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S2tILFFBQUwsR0FBZ0JOLFdBQVcsTUFBM0I7O0FBRUE7QUFDQWpSLFVBQVN3UixJQUFULENBQWNDLFdBQWQsQ0FBMEJwSCxJQUExQjtBQUNBQSxNQUFLNUosS0FBTDtBQUNBVCxVQUFTd1IsSUFBVCxDQUFjRSxXQUFkLENBQTBCckgsSUFBMUI7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvciA9IGhhbmRsZUVycjtcclxudmFyIFRBQkxFO1xyXG52YXIgbGFzdENvbW1hbmQgPSAnY29tbWVudHMnO1xyXG52YXIgYWRkTGluayA9IGZhbHNlO1xyXG52YXIgYXV0aF9zY29wZSA9ICcnO1xyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZywgdXJsLCBsKSB7XHJcblx0aWYgKCFlcnJvck1lc3NhZ2UpIHtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIiwgXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXIgVVJM77yaIFwiICsgJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmFwcGVuZChcIjxicj5cIiArICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5zZWFyY2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImV4dGVuc2lvblwiKSA+PSAwKSB7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGRhdGEuZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0aWYgKGhhc2guaW5kZXhPZihcInJhbmtlclwiKSA+PSAwKSB7XHJcblx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdGNvbW1hbmQ6ICdyYW5rZXInLFxyXG5cdFx0XHRkYXRhOiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5yYW5rZXIpXHJcblx0XHR9XHJcblx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdH1cclxuXHJcblxyXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLm9yZGVyID0gJ2Nocm9ub2xvZ2ljYWwnO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fbGlrZVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRjb25maWcubGlrZXMgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZ2V0QXV0aCgncmVhY3Rpb25zJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fdXJsXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGZiLmdldEF1dGgoJ3VybF9jb21tZW50cycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3BheVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdH0pO1xyXG5cdCQoXCIjbW9yZXBvc3RcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0dWkuYWRkTGluaygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLnVpcGFuZWwgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVkvTU0vREQgSEg6bW1cIixcclxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXHJcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxyXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXHJcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxyXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxyXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcclxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcclxuXHRcdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFx0XCLkuoxcIixcclxuXHRcdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFx0XCLkupRcIixcclxuXHRcdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XHRcIuS6jOaciFwiLFxyXG5cdFx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XHRcIuS6lOaciFwiLFxyXG5cdFx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XHRcIuWFq+aciFwiLFxyXG5cdFx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XHRcIuWNgeS4gOaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sIGZ1bmN0aW9uIChzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5zdGFydFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IGVuZC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKGNvbmZpZy5maWx0ZXIuc3RhcnRUaW1lKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGEpO1xyXG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHRcdFx0d2luZG93LmZvY3VzKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKSB7XHJcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSkge1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHNoYXJlQlROKCkge1xyXG5cdGFsZXJ0KCfoqo3nnJ/nnIvlrozot7Plh7rkvobnmoTpgqPpoIHkuIrpnaLlr6vkuobku4DpurxcXG5cXG7nnIvlrozkvaDlsLHmnIPnn6XpgZPkvaDngrrku4DpurzkuI3og73mipPliIbkuqsnKTtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsICdtZXNzYWdlX3RhZ3MnLCAnbWVzc2FnZScsICdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCAnZnJvbScsICdtZXNzYWdlJywgJ3N0b3J5J10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnLFxyXG5cdFx0bGlrZXM6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YzLjInLFxyXG5cdFx0cmVhY3Rpb25zOiAndjMuMicsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YzLjInLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjMuMicsXHJcblx0XHRmZWVkOiAndjMuMicsXHJcblx0XHRncm91cDogJ3YzLjInXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0c3RhcnRUaW1lOiAnMjAwMC0xMi0zMS0wMC0wMC0wMCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnY2hyb25vbG9naWNhbCcsXHJcblx0YXV0aDogJ21hbmFnZV9wYWdlcyxncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJyxcclxuXHRsaWtlczogZmFsc2UsXHJcblx0cGFnZVRva2VuOiAnJyxcclxuXHRmcm9tX2V4dGVuc2lvbjogZmFsc2UsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHR1c2VyX3Bvc3RzOiBmYWxzZSxcclxuXHRnZXRBdXRoOiAodHlwZSA9ICcnKSA9PiB7XHJcblx0XHRpZiAodHlwZSA9PT0gJycpIHtcclxuXHRcdFx0YWRkTGluayA9IHRydWU7XHJcblx0XHRcdHR5cGUgPSBsYXN0Q29tbWFuZDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFkZExpbmsgPSBmYWxzZTtcclxuXHRcdFx0bGFzdENvbW1hbmQgPSB0eXBlO1xyXG5cdFx0fVxyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdH0sIHtcclxuXHRcdFx0YXV0aF90eXBlOiAncmVyZXF1ZXN0JyAsXHJcblx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKSA9PiB7XHJcblx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRhdXRoX3Njb3BlID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpIHtcclxuXHRcdFx0XHRpZiAoYXV0aF9zY29wZS5pbmRleE9mKCdncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJykgPj0gMCkge1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+S7mOiyu+aOiOasiuWujOaIkO+8jOiri+WGjeasoeWft+ihjOaKk+eVmeiogCcsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZpbmlzaGVkISBQbGVhc2UgZ2V0Q29tbWVudHMgYWdhaW4uJyxcclxuXHRcdFx0XHRcdFx0J3N1Y2Nlc3MnXHJcblx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+S7mOiyu+aOiOasiuWkseaVl++8jOiri+iBr+e1oeeuoeeQhuWToeeiuuiqjScsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09IFwic2hhcmVkcG9zdHNcIikge1xyXG5cdFx0XHRcdGlmIChhdXRoX3Njb3BlLmluZGV4T2YoXCJncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvXCIpIDwgMCkge1xyXG5cdFx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdFx0aHRtbDogJzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmYi51c2VyX3Bvc3RzID0gdHJ1ZTtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQXV0aDogKCkgPT4ge1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdH0sIHtcclxuXHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkNhbGxiYWNrOiAocmVzcG9uc2UpID0+IHtcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9IHRydWU7XHJcblx0XHRcdGF1dGhfc2NvcGUgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0aWYgKGF1dGhfc2NvcGUuaW5kZXhPZihcImdyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm9cIikgPCAwKSB7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBwb3N0ZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnBvc3RkYXRhKTtcclxuXHRcdFx0XHRpZiAocG9zdGRhdGEudHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0ZmIuYXV0aE9LKCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChwb3N0ZGF0YS50eXBlID09PSAnZ3JvdXAnKSB7XHJcblx0XHRcdFx0XHRmYi5hdXRoT0soKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZmIuYXV0aE9LKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGF1dGhPSzogKCkgPT4ge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgcG9zdGRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5wb3N0ZGF0YSk7XHJcblx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdGNvbW1hbmQ6IHBvc3RkYXRhLmNvbW1hbmQsXHJcblx0XHRcdGRhdGE6IEpTT04ucGFyc2UoJChcIi5jaHJvbWVcIikudmFsKCkpXHJcblx0XHR9XHJcblx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiBbXSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W6LOH5paZ5LitLi4uJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRpZiAoIWFkZExpbmspIHtcclxuXHRcdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCkgPT4ge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoJy5wdXJlX2ZiaWQnKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEuZ2V0KGZiaWQpLnRoZW4oKHJlcykgPT4ge1xyXG5cdFx0XHQvLyBmYmlkLmRhdGEgPSByZXM7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT0gXCJ1cmxfY29tbWVudHNcIikge1xyXG5cdFx0XHRcdGZiaWQuZGF0YSA9IFtdO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGkgb2YgcmVzKSB7XHJcblx0XHRcdFx0ZmJpZC5kYXRhLnB1c2goaSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YS5maW5pc2goZmJpZCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgY29tbWFuZCA9IGZiaWQuY29tbWFuZDtcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJykgY29tbWFuZCA9ICdncm91cCc7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcgJiYgZmJpZC5jb21tYW5kICE9PSAncmVhY3Rpb25zJykgZmJpZC5mdWxsSUQgPSBmYmlkLnB1cmVJRDtcclxuXHRcdFx0aWYgKGNvbmZpZy5saWtlcykgZmJpZC5jb21tYW5kID0gJ2xpa2VzJztcclxuXHRcdFx0Y29uc29sZS5sb2coYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZmaWVsZHM9JHtjb25maWcuZmllbGRbZmJpZC5jb21tYW5kXS50b1N0cmluZygpfSZkZWJ1Zz1hbGxgKTtcclxuXHJcblx0XHRcdC8vIGlmKCQoJy50b2tlbicpLnZhbCgpID09PSAnJyl7XHJcblx0XHRcdC8vIFx0JCgnLnRva2VuJykudmFsKGNvbmZpZy5wYWdlVG9rZW4pO1xyXG5cdFx0XHQvLyB9ZWxzZXtcclxuXHRcdFx0Ly8gXHRjb25maWcucGFnZVRva2VuID0gJCgnLnRva2VuJykudmFsKCk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19Jm9yZGVyPSR7Y29uZmlnLm9yZGVyfSZmaWVsZHM9JHtjb25maWcuZmllbGRbZmJpZC5jb21tYW5kXS50b1N0cmluZygpfSZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufSZkZWJ1Zz1hbGxgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0aWYgKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IGQubmFtZVxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKGNvbmZpZy5saWtlcykgZC50eXBlID0gXCJMSUtFXCI7XHJcblx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSkge1xyXG5cdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQgPSAwKSB7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKSB7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywgJ2xpbWl0PScgKyBsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkLmlkKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGQubmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYgKGQuZnJvbSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpID0+IHtcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpID0+IHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi51cGRhdGVfYXJlYSwuZG9uYXRlX2FyZWFcIikuc2xpZGVVcCgpO1xyXG5cdFx0JChcIi5yZXN1bHRfYXJlYVwiKS5zbGlkZURvd24oKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdFx0dWkucmVzZXQoKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpID0+IHtcclxuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0bGV0IGlzVGFnID0gJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHQvLyBpZiAoY29uZmlnLmZyb21fZXh0ZW5zaW9uID09PSBmYWxzZSAmJiByYXdEYXRhLmNvbW1hbmQgPT09ICdjb21tZW50cycpIHtcclxuXHRcdC8vIFx0cmF3RGF0YS5kYXRhID0gcmF3RGF0YS5kYXRhLmZpbHRlcihpdGVtID0+IHtcclxuXHRcdC8vIFx0XHRyZXR1cm4gaXRlbS5pc19oaWRkZW4gPT09IGZhbHNlXHJcblx0XHQvLyBcdH0pO1xyXG5cdFx0Ly8gfVxyXG5cdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xyXG5cdFx0cmF3RGF0YS5maWx0ZXJlZCA9IG5ld0RhdGE7XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpIHtcclxuXHRcdFx0dGFibGUuZ2VuZXJhdGUocmF3RGF0YSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gcmF3RGF0YTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4Y2VsOiAocmF3KSA9PiB7XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRjb25zb2xlLmxvZyhyYXcpO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKSB7XHJcblx0XHRcdGlmIChyYXcuY29tbWFuZCA9PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIjogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuihqOaDhVwiOiB0aGlzLnR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCI6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpID0+IHtcclxuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmRhdGEgPSByYXdkYXRhLmZpbHRlcmVkO1xyXG5cdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+6KGo5oOFPC90ZD5gO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5o6S5ZCNPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7liIbmlbg8L3RkPmA7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHQ8dGQ+6K6aPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBob3N0ID0gJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nO1xyXG5cdFx0aWYgKGRhdGEucmF3LnR5cGUgPT09ICd1cmxfY29tbWVudHMnKSBob3N0ID0gJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSArICc/ZmJfY29tbWVudF9pZD0nO1xyXG5cclxuXHRcdGZvciAobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmRhdGEuZW50cmllcygpKSB7XHJcblx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdGlmIChwaWMpIHtcclxuXHRcdFx0XHRwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3Rvcnl9PC9hPjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblx0XHRcdFx0dGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdFx0XHQgIDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPiR7dmFsLnNjb3JlfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgbGluayA9IHZhbC5pZDtcclxuXHRcdFx0XHRpZiAoY29uZmlnLmZyb21fZXh0ZW5zaW9uKSB7XHJcblx0XHRcdFx0XHRsaW5rID0gdmFsLnBvc3RsaW5rO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiJHtob3N0fSR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCkge1xyXG5cdFx0XHRUQUJMRSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2VhcmNoQ29tbWVudFwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEFCTEVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCkgPT4ge1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjc2VhcmNoQ29tbWVudFwiKS52YWwoKSAhPSAnJykge1xyXG5cdFx0XHR0YWJsZS5yZWRvKCk7XHJcblx0XHR9XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCkge1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcIm5hbWVcIjogcCxcclxuXHRcdFx0XHRcdFx0XCJudW1cIjogblxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oKTtcclxuXHR9LFxyXG5cdGdvOiAoKSA9PiB7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YS5maWx0ZXJlZC5sZW5ndGgpLnNwbGljZSgwLCBjaG9vc2UubnVtKTtcclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGNob29zZS5hd2FyZC5tYXAoKHZhbCwgaW5kZXgpID0+IHtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHIgdGl0bGU9XCLnrKwnICsgKGluZGV4ICsgMSkgKyAn5ZCNXCI+JyArICQoJy5tYWluX3RhYmxlJykuRGF0YVRhYmxlKCkucm93cyh7XHJcblx0XHRcdFx0c2VhcmNoOiAnYXBwbGllZCdcclxuXHRcdFx0fSkubm9kZXMoKVt2YWxdLmlubmVySFRNTCArICc8L3RyPic7XHJcblx0XHR9KVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmIChjaG9vc2UuZGV0YWlsKSB7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IgKGxldCBrIGluIGNob29zZS5saXN0KSB7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI1XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9LFxyXG5cdGdlbl9iaWdfYXdhcmQ6ICgpID0+IHtcclxuXHRcdGxldCBsaSA9ICcnO1xyXG5cdFx0bGV0IGF3YXJkcyA9IFtdO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0Ym9keSB0cicpLmVhY2goZnVuY3Rpb24gKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0bGV0IGF3YXJkID0ge307XHJcblx0XHRcdGlmICh2YWwuaGFzQXR0cmlidXRlKCd0aXRsZScpKSB7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgxKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLnVzZXJpZCA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJykucmVwbGFjZSgnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycsICcnKTtcclxuXHRcdFx0XHRhd2FyZC5tZXNzYWdlID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC5saW5rID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0XHRhd2FyZC50aW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoJCh2YWwpLmZpbmQoJ3RkJykubGVuZ3RoIC0gMSkudGV4dCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSB0cnVlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS50ZXh0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXdhcmRzLnB1c2goYXdhcmQpO1xyXG5cdFx0fSk7XHJcblx0XHRmb3IgKGxldCBpIG9mIGF3YXJkcykge1xyXG5cdFx0XHRpZiAoaS5hd2FyZF9uYW1lID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bGkgKz0gYDxsaSBjbGFzcz1cInByaXplTmFtZVwiPiR7aS5uYW1lfTwvbGk+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpPlxyXG5cdFx0XHRcdDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aS51c2VyaWR9L3BpY3R1cmU/dHlwZT1sYXJnZVwiIGFsdD1cIlwiPjwvYT5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5mb1wiPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibmFtZVwiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubmFtZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubWVzc2FnZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwidGltZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kudGltZX08L2E+PC9wPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvbGk+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmFwcGVuZChsaSk7XHJcblx0XHQkKCcuYmlnX2F3YXJkJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHR9LFxyXG5cdGNsb3NlX2JpZ19hd2FyZDogKCkgPT4ge1xyXG5cdFx0JCgnLmJpZ19hd2FyZCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuZW1wdHkoKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmYmlkID0ge1xyXG5cdGZiaWQ6IFtdLFxyXG5cdGluaXQ6ICh0eXBlKSA9PiB7XHJcblx0XHRjb25maWcucGFnZVRva2VuID0gJyc7XHJcblx0XHRmYmlkLmZiaWQgPSBbXTtcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0RkIuYXBpKFwiL21lXCIsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0ZGF0YS51c2VyaWQgPSByZXMuaWQ7XHJcblx0XHRcdGxldCB1cmwgPSAnJztcclxuXHRcdFx0aWYgKGFkZExpbmspIHtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgpKTtcclxuXHRcdFx0XHQkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgnJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dXJsID0gZmJpZC5mb3JtYXQoJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHVybC5pbmRleE9mKCcucGhwPycpID09PSAtMSAmJiB1cmwuaW5kZXhPZignPycpID4gMCkge1xyXG5cdFx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoJz8nKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZmJpZC5nZXQodXJsLCB0eXBlKS50aGVuKChmYmlkKSA9PiB7XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Ly8gJCgnLmlkZW50aXR5JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKGDnmbvlhaXouqvku73vvJo8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cmVzLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48c3Bhbj4ke3Jlcy5uYW1lfTwvc3Bhbj5gKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAodXJsLCB0eXBlKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRpZiAodHlwZSA9PSAndXJsX2NvbW1lbnRzJykge1xyXG5cdFx0XHRcdGxldCBwb3N0dXJsID0gdXJsO1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCI/XCIpID4gMCkge1xyXG5cdFx0XHRcdFx0cG9zdHVybCA9IHBvc3R1cmwuc3Vic3RyaW5nKDAsIHBvc3R1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRGQi5hcGkoYC8ke3Bvc3R1cmx9YCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0ZnVsbElEOiByZXMub2dfb2JqZWN0LmlkLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiB0eXBlLFxyXG5cdFx0XHRcdFx0XHRjb21tYW5kOiAnY29tbWVudHMnXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0Y29uZmlnLmxpbWl0Wydjb21tZW50cyddID0gJzI1JztcclxuXHRcdFx0XHRcdGNvbmZpZy5vcmRlciA9ICcnO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdFx0bGV0IG5ld3VybCA9IHVybC5zdWJzdHIodXJsLmluZGV4T2YoJy8nLCAyOCkgKyAxLCAyMDApO1xyXG5cdFx0XHRcdC8vIGh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8g5YWxMjXlrZflhYPvvIzlm6DmraTpgbgyOOmWi+Wni+aJvi9cclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gbmV3dXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XHJcblx0XHRcdFx0ZmJpZC5jaGVja1BhZ2VJRCh1cmwsIHVybHR5cGUpLnRoZW4oKGlkKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XHJcblx0XHRcdFx0XHRcdGlkID0gZGF0YS51c2VyaWQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0XHRwYWdlSUQ6IGlkLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiB1cmx0eXBlLFxyXG5cdFx0XHRcdFx0XHRjb21tYW5kOiB0eXBlLFxyXG5cdFx0XHRcdFx0XHRkYXRhOiBbXVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGlmIChhZGRMaW5rKSBvYmouZGF0YSA9IGRhdGEucmF3LmRhdGE7IC8v6L+95Yqg6LK85paHXHJcblx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcclxuXHRcdFx0XHRcdFx0aWYgKHN0YXJ0ID49IDApIHtcclxuXHRcdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsIHN0YXJ0KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCArIDUsIGVuZCk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0ICsgNiwgdXJsLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bGV0IHZpZGVvID0gdXJsLmluZGV4T2YoJ3ZpZGVvcy8nKTtcclxuXHRcdFx0XHRcdFx0aWYgKHZpZGVvID49IDApIHtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAncHVyZScpIHtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHVybC5yZXBsYWNlKC9cXFwiL2csICcnKTtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdldmVudCcpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5omA5pyJ55WZ6KiAXHJcblx0XHRcdFx0XHRcdFx0XHRvYmouY29tbWFuZCA9ICdmZWVkJztcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3mn5Dnr4fnlZnoqIDnmoTnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMV07XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdncm91cCcpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoYXV0aF9zY29wZS5pbmRleE9mKFwiZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mb1wiKSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgXCJfXCIgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6ICfnpL7lnJjkvb/nlKjpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlnJgnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRodG1sOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3Bob3RvJykge1xyXG5cdFx0XHRcdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHJlc3VsdCA9IHVybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAndmlkZW8nKSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0RkIuYXBpKGAvJHtvYmoucHVyZUlEfT9maWVsZHM9bGl2ZV9zdGF0dXNgLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmxpdmVfc3RhdHVzID09PSAnTElWRScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSB8fCByZXN1bHQubGVuZ3RoID09IDMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0RkIuYXBpKGAvJHtvYmoucGFnZUlEfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjaGVja1R5cGU6IChwb3N0dXJsKSA9PiB7XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCkge1xyXG5cdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdwZXJtYWxpbmsnKSA+PSAwKSB7XHJcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiAncGVyc29uYWwnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9ncm91cHMvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdncm91cCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImV2ZW50c1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAnZXZlbnQnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvcGhvdG9zL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAncGhvdG8nO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvdmlkZW9zL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAndmlkZW8nO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignXCInKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAncHVyZSc7XHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICdub3JtYWwnO1xyXG5cdH0sXHJcblx0Y2hlY2tQYWdlSUQ6IChwb3N0dXJsLCB0eXBlKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgc3RhcnQgPSBwb3N0dXJsLmluZGV4T2YoXCJmYWNlYm9vay5jb21cIikgKyAxMztcclxuXHRcdFx0bGV0IGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIiwgc3RhcnQpO1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRpZiAoZW5kIDwgMCkge1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ2ZiaWQ9JykgPj0gMCkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICd1bm5hbWUnKSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3VubmFtZScpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShwb3N0dXJsLm1hdGNoKHJlZ2V4KVsxXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBncm91cCA9IHBvc3R1cmwuaW5kZXhPZignL2dyb3Vwcy8nKTtcclxuXHRcdFx0XHRsZXQgZXZlbnQgPSBwb3N0dXJsLmluZGV4T2YoJy9ldmVudHMvJylcclxuXHRcdFx0XHRpZiAoZ3JvdXAgPj0gMCkge1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBncm91cCArIDg7XHJcblx0XHRcdFx0XHRlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsIHN0YXJ0KTtcclxuXHRcdFx0XHRcdGxldCByZWdleDIgPSAvXFxkezYsfS9nO1xyXG5cdFx0XHRcdFx0bGV0IHRlbXAgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcclxuXHRcdFx0XHRcdGlmIChyZWdleDIudGVzdCh0ZW1wKSkge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRlbXApO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgnZ3JvdXAnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYgKGV2ZW50ID49IDApIHtcclxuXHRcdFx0XHRcdHJlc29sdmUoJ2V2ZW50Jyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHZhciBwYWdlbmFtZSA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xyXG5cdFx0XHRcdFx0RkIuYXBpKGAvJHtwYWdlbmFtZX0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmb3JtYXQ6ICh1cmwpID0+IHtcclxuXHRcdGlmICh1cmwuaW5kZXhPZignYnVzaW5lc3MuZmFjZWJvb2suY29tLycpID49IDApIHtcclxuXHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXdkYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBzdGFydFRpbWUsIGVuZFRpbWUpID0+IHtcclxuXHRcdGxldCBkYXRhID0gcmF3ZGF0YS5kYXRhO1xyXG5cdFx0aWYgKHdvcmQgIT09ICcnKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnJlYWN0KGRhdGEsIHJlYWN0KTtcclxuXHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJykge1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBzdGFydFRpbWUsIGVuZFRpbWUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSkgPT4ge1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZiAoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKSA9PiB7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGlmIChuLnN0b3J5LmluZGV4T2Yod29yZCkgPiAtMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCBzdCwgdCkgPT4ge1xyXG5cdFx0bGV0IHRpbWVfYXJ5MiA9IHN0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IGVuZHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sIChwYXJzZUludCh0aW1lX2FyeVsxXSkgLSAxKSwgdGltZV9hcnlbMl0sIHRpbWVfYXJ5WzNdLCB0aW1lX2FyeVs0XSwgdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBzdGFydHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnkyWzBdLCAocGFyc2VJbnQodGltZV9hcnkyWzFdKSAtIDEpLCB0aW1lX2FyeTJbMl0sIHRpbWVfYXJ5MlszXSwgdGltZV9hcnkyWzRdLCB0aW1lX2FyeTJbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmICgoY3JlYXRlZF90aW1lID4gc3RhcnR0aW1lICYmIGNyZWF0ZWRfdGltZSA8IGVuZHRpbWUpIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpID0+IHtcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpIHtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCkgPT4ge1xyXG5cclxuXHR9LFxyXG5cdGFkZExpbms6ICgpID0+IHtcclxuXHRcdGxldCB0YXIgPSAkKCcuaW5wdXRhcmVhIC5tb3JlbGluaycpO1xyXG5cdFx0aWYgKHRhci5oYXNDbGFzcygnc2hvdycpKSB7XHJcblx0XHRcdHRhci5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGFyLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZXNldDogKCkgPT4ge1xyXG5cdFx0bGV0IGNvbW1hbmQgPSBkYXRhLnJhdy5jb21tYW5kO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKSB7XHJcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKSB7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSArIDE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyICsgXCItXCIgKyBtb250aCArIFwiLVwiICsgZGF0ZSArIFwiLVwiICsgaG91ciArIFwiLVwiICsgbWluICsgXCItXCIgKyBzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApIHtcclxuXHR2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcblx0dmFyIG1vbnRocyA9IFsnMDEnLCAnMDInLCAnMDMnLCAnMDQnLCAnMDUnLCAnMDYnLCAnMDcnLCAnMDgnLCAnMDknLCAnMTAnLCAnMTEnLCAnMTInXTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdGlmIChkYXRlIDwgMTApIHtcclxuXHRcdGRhdGUgPSBcIjBcIiArIGRhdGU7XHJcblx0fVxyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHRpZiAobWluIDwgMTApIHtcclxuXHRcdG1pbiA9IFwiMFwiICsgbWluO1xyXG5cdH1cclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0aWYgKHNlYyA8IDEwKSB7XHJcblx0XHRzZWMgPSBcIjBcIiArIHNlYztcclxuXHR9XHJcblx0dmFyIHRpbWUgPSB5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBkYXRlICsgXCIgXCIgKyBob3VyICsgJzonICsgbWluICsgJzonICsgc2VjO1xyXG5cdHJldHVybiB0aW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvYmoyQXJyYXkob2JqKSB7XHJcblx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuXHR9KTtcclxuXHRyZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcblx0dmFyIGksIHIsIHQ7XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0YXJ5W2ldID0gaTtcclxuXHR9XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG5cdFx0dCA9IGFyeVtyXTtcclxuXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuXHRcdGFyeVtpXSA9IHQ7XHJcblx0fVxyXG5cdHJldHVybiBhcnk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG5cdC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcblx0dmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG5cclxuXHR2YXIgQ1NWID0gJyc7XHJcblx0Ly9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcblxyXG5cdC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuXHQvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG5cdGlmIChTaG93TGFiZWwpIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuXHJcblx0XHRcdC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRcdHJvdyArPSBpbmRleCArICcsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG5cclxuXHRcdC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcblx0XHRcdHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG5cclxuXHRcdC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0aWYgKENTViA9PSAnJykge1xyXG5cdFx0YWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcblx0dmFyIGZpbGVOYW1lID0gXCJcIjtcclxuXHQvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuXHRmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csIFwiX1wiKTtcclxuXHJcblx0Ly9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuXHR2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG5cclxuXHQvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuXHQvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG5cdC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG5cdC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcblxyXG5cdC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG5cdGxpbmsuaHJlZiA9IHVyaTtcclxuXHJcblx0Ly9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuXHRsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG5cdGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG5cclxuXHQvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcblx0bGluay5jbGljaygpO1xyXG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
