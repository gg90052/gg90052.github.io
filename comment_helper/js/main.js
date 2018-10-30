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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIlRBQkxFIiwibGFzdENvbW1hbmQiLCJhZGRMaW5rIiwiYXV0aF9zY29wZSIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsInZhbCIsImFwcGVuZCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJkYXRhIiwiZXh0ZW5zaW9uIiwiY2xpY2siLCJlIiwiZmIiLCJleHRlbnNpb25BdXRoIiwiZGF0YXMiLCJjb21tYW5kIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwicmFua2VyIiwicmF3IiwiZmluaXNoIiwiY3RybEtleSIsImFsdEtleSIsImNvbmZpZyIsIm9yZGVyIiwiZ2V0QXV0aCIsImxpa2VzIiwiY2hvb3NlIiwiaW5pdCIsInVpIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImZpbHRlciIsInJlYWN0IiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsInN0YXJ0VGltZSIsImZvcm1hdCIsImVuZFRpbWUiLCJzZXRTdGFydERhdGUiLCJmaWx0ZXJEYXRhIiwic3RyaW5naWZ5Iiwib3BlbiIsImZvY3VzIiwibGVuZ3RoIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiZXhjZWwiLCJleGNlbFN0cmluZyIsImNpX2NvdW50ZXIiLCJpbXBvcnQiLCJmaWxlcyIsInNoYXJlQlROIiwiYWxlcnQiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJ3b3JkIiwibm93RGF0ZSIsImF1dGgiLCJwYWdlVG9rZW4iLCJmcm9tX2V4dGVuc2lvbiIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJ0aXRsZSIsImh0bWwiLCJmYmlkIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJwb3N0ZGF0YSIsImF1dGhPSyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwiZ2V0IiwidGhlbiIsInJlcyIsImkiLCJwdXNoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwcm9taXNlX2FycmF5IiwicHVyZUlEIiwidG9TdHJpbmciLCJhcGkiLCJkIiwiZnJvbSIsImlkIiwibmFtZSIsInVwZGF0ZWRfdGltZSIsImNyZWF0ZWRfdGltZSIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsInJlc2V0IiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJwcm9wIiwiaXNUYWciLCJuZXdEYXRhIiwidG90YWxGaWx0ZXIiLCJvYmoyQXJyYXkiLCJmaWx0ZXJlZCIsIm5ld09iaiIsImVhY2giLCJ0bXAiLCJwb3N0bGluayIsIm1lc3NhZ2UiLCJzdG9yeSIsInRpbWVDb252ZXJ0ZXIiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50Iiwic3RyIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsInBpYyIsImhvc3QiLCJlbnRyaWVzIiwiaiIsInBpY3R1cmUiLCJ0ZCIsInNjb3JlIiwibGluayIsImxpa2VfY291bnQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJuIiwicGFyc2VJbnQiLCJmaW5kIiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJtYXAiLCJpbmRleCIsInJvd3MiLCJub2RlcyIsImlubmVySFRNTCIsIm5vdyIsImsiLCJ0YXIiLCJlcSIsImluc2VydEJlZm9yZSIsImdlbl9iaWdfYXdhcmQiLCJsaSIsImF3YXJkcyIsImhhc0F0dHJpYnV0ZSIsImF3YXJkX25hbWUiLCJhdHRyIiwidGltZSIsImNsb3NlX2JpZ19hd2FyZCIsImVtcHR5Iiwic3Vic3RyaW5nIiwicG9zdHVybCIsIm9iaiIsIm9nX29iamVjdCIsInJlZ2V4IiwibmV3dXJsIiwic3Vic3RyIiwibWF0Y2giLCJ1cmx0eXBlIiwiY2hlY2tUeXBlIiwiY2hlY2tQYWdlSUQiLCJwYWdlSUQiLCJ2aWRlbyIsImxpdmVfc3RhdHVzIiwiZXJyb3IiLCJhY2Nlc3NfdG9rZW4iLCJyZWdleDIiLCJ0ZW1wIiwidGVzdCIsInBhZ2VuYW1lIiwidGFnIiwidW5pcXVlIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsInVuZGVmaW5lZCIsIm1lc3NhZ2VfdGFncyIsInN0IiwidCIsInRpbWVfYXJ5MiIsInNwbGl0IiwidGltZV9hcnkiLCJlbmR0aW1lIiwibW9tZW50IiwiRGF0ZSIsIl9kIiwic3RhcnR0aW1lIiwiYSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwicm93Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQkMsU0FBakI7QUFDQSxJQUFJQyxLQUFKO0FBQ0EsSUFBSUMsY0FBYyxVQUFsQjtBQUNBLElBQUlDLFVBQVUsS0FBZDtBQUNBLElBQUlDLGFBQWEsRUFBakI7O0FBRUEsU0FBU0osU0FBVCxDQUFtQkssR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxDQUE3QixFQUFnQztBQUMvQixLQUFJLENBQUNWLFlBQUwsRUFBbUI7QUFDbEJXLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFpRCw0QkFBakQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQkMsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBbEM7QUFDQUQsSUFBRSxpQkFBRixFQUFxQkUsTUFBckIsQ0FBNEIsU0FBU0YsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBckM7QUFDQUQsSUFBRSxpQkFBRixFQUFxQkcsTUFBckI7QUFDQWhCLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBO0FBQ0RhLEVBQUVJLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFZO0FBQzdCLEtBQUlDLE9BQU9DLFNBQVNDLE1BQXBCO0FBQ0EsS0FBSUYsS0FBS0csT0FBTCxDQUFhLFdBQWIsS0FBNkIsQ0FBakMsRUFBb0M7QUFDbkNULElBQUUsb0JBQUYsRUFBd0JVLFdBQXhCLENBQW9DLE1BQXBDO0FBQ0FDLE9BQUtDLFNBQUwsR0FBaUIsSUFBakI7O0FBRUFaLElBQUUsMkJBQUYsRUFBK0JhLEtBQS9CLENBQXFDLFVBQVVDLENBQVYsRUFBYTtBQUNqREMsTUFBR0MsYUFBSDtBQUNBLEdBRkQ7QUFH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RUE7QUFDQWhSLFVBQVN1UixJQUFULENBQWNDLFdBQWQsQ0FBMEJwSCxJQUExQjtBQUNBQSxNQUFLM0osS0FBTDtBQUNBVCxVQUFTdVIsSUFBVCxDQUFjRSxXQUFkLENBQTBCckgsSUFBMUI7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvciA9IGhhbmRsZUVycjtcclxudmFyIFRBQkxFO1xyXG52YXIgbGFzdENvbW1hbmQgPSAnY29tbWVudHMnO1xyXG52YXIgYWRkTGluayA9IGZhbHNlO1xyXG52YXIgYXV0aF9zY29wZSA9ICcnO1xyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZywgdXJsLCBsKSB7XHJcblx0aWYgKCFlcnJvck1lc3NhZ2UpIHtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIiwgXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXIgVVJM77yaIFwiICsgJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmFwcGVuZChcIjxicj5cIiArICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5zZWFyY2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImV4dGVuc2lvblwiKSA+PSAwKSB7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGRhdGEuZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0aWYgKGhhc2guaW5kZXhPZihcInJhbmtlclwiKSA+PSAwKSB7XHJcblx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdGNvbW1hbmQ6ICdyYW5rZXInLFxyXG5cdFx0XHRkYXRhOiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5yYW5rZXIpXHJcblx0XHR9XHJcblx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdH1cclxuXHJcblxyXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhlKTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLm9yZGVyID0gJ2Nocm9ub2xvZ2ljYWwnO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fbGlrZVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRjb25maWcubGlrZXMgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZ2V0QXV0aCgncmVhY3Rpb25zJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fdXJsXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGZiLmdldEF1dGgoJ3VybF9jb21tZW50cycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3BheVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdH0pO1xyXG5cdCQoXCIjbW9yZXBvc3RcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0dWkuYWRkTGluaygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLnVpcGFuZWwgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVkvTU0vREQgSEg6bW1cIixcclxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXHJcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxyXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXHJcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxyXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxyXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcclxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcclxuXHRcdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFx0XCLkuoxcIixcclxuXHRcdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFx0XCLkupRcIixcclxuXHRcdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XHRcIuS6jOaciFwiLFxyXG5cdFx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XHRcIuS6lOaciFwiLFxyXG5cdFx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XHRcIuWFq+aciFwiLFxyXG5cdFx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XHRcIuWNgeS4gOaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sIGZ1bmN0aW9uIChzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5zdGFydFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IGVuZC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKGNvbmZpZy5maWx0ZXIuc3RhcnRUaW1lKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGEpO1xyXG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHRcdFx0d2luZG93LmZvY3VzKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKSB7XHJcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSkge1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHNoYXJlQlROKCkge1xyXG5cdGFsZXJ0KCfoqo3nnJ/nnIvlrozot7Plh7rkvobnmoTpgqPpoIHkuIrpnaLlr6vkuobku4DpurxcXG5cXG7nnIvlrozkvaDlsLHmnIPnn6XpgZPkvaDngrrku4DpurzkuI3og73mipPliIbkuqsnKTtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsICdtZXNzYWdlX3RhZ3MnLCAnbWVzc2FnZScsICdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCAnZnJvbScsICdtZXNzYWdlJywgJ3N0b3J5J10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnLFxyXG5cdFx0bGlrZXM6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YzLjInLFxyXG5cdFx0cmVhY3Rpb25zOiAndjMuMicsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YzLjInLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjMuMicsXHJcblx0XHRmZWVkOiAndjMuMicsXHJcblx0XHRncm91cDogJ3YzLjInXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0c3RhcnRUaW1lOiAnMjAwMC0xMi0zMS0wMC0wMC0wMCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnY2hyb25vbG9naWNhbCcsXHJcblx0YXV0aDogJ21hbmFnZV9wYWdlcyxncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJyxcclxuXHRsaWtlczogZmFsc2UsXHJcblx0cGFnZVRva2VuOiAnJyxcclxuXHRmcm9tX2V4dGVuc2lvbjogZmFsc2UsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHR1c2VyX3Bvc3RzOiBmYWxzZSxcclxuXHRnZXRBdXRoOiAodHlwZSA9ICcnKSA9PiB7XHJcblx0XHRpZiAodHlwZSA9PT0gJycpIHtcclxuXHRcdFx0YWRkTGluayA9IHRydWU7XHJcblx0XHRcdHR5cGUgPSBsYXN0Q29tbWFuZDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFkZExpbmsgPSBmYWxzZTtcclxuXHRcdFx0bGFzdENvbW1hbmQgPSB0eXBlO1xyXG5cdFx0fVxyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdH0sIHtcclxuXHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpID0+IHtcclxuXHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGF1dGhfc2NvcGUgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gZmFsc2U7XHJcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIikge1xyXG5cdFx0XHRcdGlmIChhdXRoX3Njb3BlLmluZGV4T2YoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSA+PSAwKSB7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxyXG5cdFx0XHRcdFx0XHQnc3VjY2VzcydcclxuXHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5aSx5pWX77yM6KuL6IGv57Wh566h55CG5ZOh56K66KqNJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT0gXCJzaGFyZWRwb3N0c1wiKSB7XHJcblx0XHRcdFx0aWYgKGF1dGhfc2NvcGUuaW5kZXhPZihcImdyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm9cIikgPCAwKSB7XHJcblx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0XHRodG1sOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZmIudXNlcl9wb3N0cyA9IHRydWU7XHJcblx0XHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKSA9PiB7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRpZiAoYXV0aF9zY29wZS5pbmRleE9mKFwiZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mb1wiKSA8IDApIHtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IHBvc3RkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucG9zdGRhdGEpO1xyXG5cdFx0XHRcdGlmIChwb3N0ZGF0YS50eXBlID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHRmYi5hdXRoT0soKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHBvc3RkYXRhLnR5cGUgPT09ICdncm91cCcpIHtcclxuXHRcdFx0XHRcdGZiLmF1dGhPSygpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmYi5hdXRoT0soKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YXV0aE9LOiAoKSA9PiB7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGxldCBwb3N0ZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnBvc3RkYXRhKTtcclxuXHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0Y29tbWFuZDogcG9zdGRhdGEuY29tbWFuZCxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZSgkKFwiLmNocm9tZVwiKS52YWwoKSlcclxuXHRcdH1cclxuXHRcdGRhdGEucmF3ID0gZGF0YXM7XHJcblx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IFtdLFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5bos4fmlpnkuK0uLi4nKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGlmICghYWRkTGluaykge1xyXG5cdFx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JCgnLnB1cmVfZmJpZCcpLnRleHQoZmJpZC5mdWxsSUQpO1xyXG5cdFx0ZGF0YS5nZXQoZmJpZCkudGhlbigocmVzKSA9PiB7XHJcblx0XHRcdC8vIGZiaWQuZGF0YSA9IHJlcztcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PSBcInVybF9jb21tZW50c1wiKSB7XHJcblx0XHRcdFx0ZmJpZC5kYXRhID0gW107XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgaSBvZiByZXMpIHtcclxuXHRcdFx0XHRmYmlkLmRhdGEucHVzaChpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhLmZpbmlzaChmYmlkKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gZmJpZC5jb21tYW5kO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJyAmJiBmYmlkLmNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKSBmYmlkLmZ1bGxJRCA9IGZiaWQucHVyZUlEO1xyXG5cdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmRlYnVnPWFsbGApO1xyXG5cclxuXHRcdFx0Ly8gaWYoJCgnLnRva2VuJykudmFsKCkgPT09ICcnKXtcclxuXHRcdFx0Ly8gXHQkKCcudG9rZW4nKS52YWwoY29uZmlnLnBhZ2VUb2tlbik7XHJcblx0XHRcdC8vIH1lbHNle1xyXG5cdFx0XHQvLyBcdGNvbmZpZy5wYWdlVG9rZW4gPSAkKCcudG9rZW4nKS52YWwoKTtcclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mb3JkZXI9JHtjb25maWcub3JkZXJ9JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59JmRlYnVnPWFsbGAsIChyZXMpID0+IHtcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJyArIGRhdGEubm93TGVuZ3RoICsgJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRpZiAoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogZC5uYW1lXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoY29uZmlnLmxpa2VzKSBkLnR5cGUgPSBcIkxJS0VcIjtcclxuXHRcdFx0XHRcdGlmIChkLmZyb20pIHtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IGQuaWRcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdCA9IDApIHtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApIHtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCAnbGltaXQ9JyArIGxpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJyArIGRhdGEubm93TGVuZ3RoICsgJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvciAobGV0IGQgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGQuaWQpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCkgPT4ge1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZmJpZCkgPT4ge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLnVwZGF0ZV9hcmVhLC5kb25hdGVfYXJlYVwiKS5zbGlkZVVwKCk7XHJcblx0XHQkKFwiLnJlc3VsdF9hcmVhXCIpLnNsaWRlRG93bigpO1xyXG5cdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHRkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0XHR1aS5yZXNldCgpO1xyXG5cdH0sXHJcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSkgPT4ge1xyXG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdC8vIGlmIChjb25maWcuZnJvbV9leHRlbnNpb24gPT09IGZhbHNlICYmIHJhd0RhdGEuY29tbWFuZCA9PT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0Ly8gXHRyYXdEYXRhLmRhdGEgPSByYXdEYXRhLmRhdGEuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0Ly8gXHRcdHJldHVybiBpdGVtLmlzX2hpZGRlbiA9PT0gZmFsc2VcclxuXHRcdC8vIFx0fSk7XHJcblx0XHQvLyB9XHJcblx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHJcblx0XHRyYXdEYXRhLmZpbHRlcmVkID0gbmV3RGF0YTtcclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShyYXdEYXRhKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiByYXdEYXRhO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpID0+IHtcclxuXHRcdHZhciBuZXdPYmogPSBbXTtcclxuXHRcdGNvbnNvbGUubG9nKHJhdyk7XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pIHtcclxuXHRcdFx0aWYgKHJhdy5jb21tYW5kID09ICdjb21tZW50cycpIHtcclxuXHRcdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA6YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMubWVzc2FnZSxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiOiB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi6KGo5oOFXCI6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIjogdGltZUNvbnZlcnRlcih0aGlzLmNyZWF0ZWRfdGltZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3T2JqO1xyXG5cdH0sXHJcblx0aW1wb3J0OiAoZmlsZSkgPT4ge1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHRcdFx0ZGF0YS5yYXcgPSBKU09OLnBhcnNlKHN0cik7XHJcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpID0+IHtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZmlsdGVyZGF0YSA9IHJhd2RhdGEuZmlsdGVyZWQ7XHJcblx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0bGV0IHBpYyA9ICQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7ooajmg4U8L3RkPmA7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMTEwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7mjpLlkI08L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuWIhuaVuDwvdGQ+YDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGhvc3QgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyc7XHJcblx0XHRpZiAoZGF0YS5yYXcudHlwZSA9PT0gJ3VybF9jb21tZW50cycpIGhvc3QgPSAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpICsgJz9mYl9jb21tZW50X2lkPSc7XHJcblxyXG5cdFx0Zm9yIChsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpIHtcclxuXHRcdFx0bGV0IHBpY3R1cmUgPSAnJztcclxuXHRcdFx0aWYgKHBpYykge1xyXG5cdFx0XHRcdHBpY3R1cmUgPSBgPGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0aWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKSB7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHRcdFx0XHR0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPjxhIGhyZWY9J2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0ICA8dGQ+JHt2YWwuc2NvcmV9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBsaW5rID0gdmFsLmlkO1xyXG5cdFx0XHRcdGlmIChjb25maWcuZnJvbV9leHRlbnNpb24pIHtcclxuXHRcdFx0XHRcdGxpbmsgPSB2YWwucG9zdGxpbms7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCIke2hvc3R9JHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLm1lc3NhZ2V9PC9hPjwvdGQ+XHJcblx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cclxuXHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKSB7XHJcblx0XHRcdFRBQkxFID0gJChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoXCIjc2VhcmNoTmFtZVwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEFCTEVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChcIiNzZWFyY2hDb21tZW50XCIpLm9uKCdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUQUJMRVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKSA9PiB7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNzZWFyY2hDb21tZW50XCIpLnZhbCgpICE9ICcnKSB7XHJcblx0XHRcdHRhYmxlLnJlZG8oKTtcclxuXHRcdH1cclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKSB7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XHJcblx0XHRcdFx0XHRcdFwibmFtZVwiOiBwLFxyXG5cdFx0XHRcdFx0XHRcIm51bVwiOiBuXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbygpO1xyXG5cdH0sXHJcblx0Z286ICgpID0+IHtcclxuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhLmZpbHRlcmVkLmxlbmd0aCkuc3BsaWNlKDAsIGNob29zZS5udW0pO1xyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0Y2hvb3NlLmF3YXJkLm1hcCgodmFsLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0ciB0aXRsZT1cIuesrCcgKyAoaW5kZXggKyAxKSArICflkI1cIj4nICsgJCgnLm1haW5fdGFibGUnKS5EYXRhVGFibGUoKS5yb3dzKHtcclxuXHRcdFx0XHRzZWFyY2g6ICdhcHBsaWVkJ1xyXG5cdFx0XHR9KS5ub2RlcygpW3ZhbF0uaW5uZXJIVE1MICsgJzwvdHI+JztcclxuXHRcdH0pXHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYgKGNob29zZS5kZXRhaWwpIHtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvciAobGV0IGsgaW4gY2hvb3NlLmxpc3QpIHtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjVcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH0sXHJcblx0Z2VuX2JpZ19hd2FyZDogKCkgPT4ge1xyXG5cdFx0bGV0IGxpID0gJyc7XHJcblx0XHRsZXQgYXdhcmRzID0gW107XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRib2R5IHRyJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHZhbCkge1xyXG5cdFx0XHRsZXQgYXdhcmQgPSB7fTtcclxuXHRcdFx0aWYgKHZhbC5oYXNBdHRyaWJ1dGUoJ3RpdGxlJykpIHtcclxuXHRcdFx0XHRhd2FyZC5hd2FyZF9uYW1lID0gZmFsc2U7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS50ZXh0KCk7XHJcblx0XHRcdFx0YXdhcmQudXNlcmlkID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLmF0dHIoJ2hyZWYnKS5yZXBsYWNlKCdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJywgJycpO1xyXG5cdFx0XHRcdGF3YXJkLm1lc3NhZ2UgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLmxpbmsgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykuYXR0cignaHJlZicpO1xyXG5cdFx0XHRcdGF3YXJkLnRpbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgkKHZhbCkuZmluZCgndGQnKS5sZW5ndGggLSAxKS50ZXh0KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IHRydWU7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLnRleHQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhd2FyZHMucHVzaChhd2FyZCk7XHJcblx0XHR9KTtcclxuXHRcdGZvciAobGV0IGkgb2YgYXdhcmRzKSB7XHJcblx0XHRcdGlmIChpLmF3YXJkX25hbWUgPT09IHRydWUpIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpIGNsYXNzPVwicHJpemVOYW1lXCI+JHtpLm5hbWV9PC9saT5gO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxpICs9IGA8bGk+XHJcblx0XHRcdFx0PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPjxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH0vcGljdHVyZT90eXBlPWxhcmdlXCIgYWx0PVwiXCI+PC9hPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJpbmZvXCI+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJuYW1lXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5uYW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5tZXNzYWdlfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJ0aW1lXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS50aW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9saT5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuYXBwZW5kKGxpKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0Y2xvc2VfYmlnX2F3YXJkOiAoKSA9PiB7XHJcblx0XHQkKCcuYmlnX2F3YXJkJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQgdWwnKS5lbXB0eSgpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZiaWQgPSB7XHJcblx0ZmJpZDogW10sXHJcblx0aW5pdDogKHR5cGUpID0+IHtcclxuXHRcdGNvbmZpZy5wYWdlVG9rZW4gPSAnJztcclxuXHRcdGZiaWQuZmJpZCA9IFtdO1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRGQi5hcGkoXCIvbWVcIiwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRkYXRhLnVzZXJpZCA9IHJlcy5pZDtcclxuXHRcdFx0bGV0IHVybCA9ICcnO1xyXG5cdFx0XHRpZiAoYWRkTGluaykge1xyXG5cdFx0XHRcdHVybCA9IGZiaWQuZm9ybWF0KCQoJy5tb3JlbGluayAuYWRkdXJsJykudmFsKCkpO1xyXG5cdFx0XHRcdCQoJy5tb3JlbGluayAuYWRkdXJsJykudmFsKCcnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodXJsLmluZGV4T2YoJy5waHA/JykgPT09IC0xICYmIHVybC5pbmRleE9mKCc/JykgPiAwKSB7XHJcblx0XHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZignPycpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmYmlkLmdldCh1cmwsIHR5cGUpLnRoZW4oKGZiaWQpID0+IHtcclxuXHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQvLyAkKCcuaWRlbnRpdHknKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoYOeZu+WFpei6q+S7ve+8mjxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtyZXMuaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxzcGFuPiR7cmVzLm5hbWV9PC9zcGFuPmApO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6ICh1cmwsIHR5cGUpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGlmICh0eXBlID09ICd1cmxfY29tbWVudHMnKSB7XHJcblx0XHRcdFx0bGV0IHBvc3R1cmwgPSB1cmw7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIj9cIikgPiAwKSB7XHJcblx0XHRcdFx0XHRwb3N0dXJsID0gcG9zdHVybC5zdWJzdHJpbmcoMCwgcG9zdHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdEZCLmFwaShgLyR7cG9zdHVybH1gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0XHRmdWxsSUQ6IHJlcy5vZ19vYmplY3QuaWQsXHJcblx0XHRcdFx0XHRcdHR5cGU6IHR5cGUsXHJcblx0XHRcdFx0XHRcdGNvbW1hbmQ6ICdjb21tZW50cydcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRjb25maWcubGltaXRbJ2NvbW1lbnRzJ10gPSAnMjUnO1xyXG5cdFx0XHRcdFx0Y29uZmlnLm9yZGVyID0gJyc7XHJcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRsZXQgbmV3dXJsID0gdXJsLnN1YnN0cih1cmwuaW5kZXhPZignLycsIDI4KSArIDEsIDIwMCk7XHJcblx0XHRcdFx0Ly8gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyDlhbEyNeWtl+WFg++8jOWboOatpOmBuDI46ZaL5aeL5om+L1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSBuZXd1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdGxldCB1cmx0eXBlID0gZmJpZC5jaGVja1R5cGUodXJsKTtcclxuXHRcdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpID0+IHtcclxuXHRcdFx0XHRcdGlmIChpZCA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0XHR1cmx0eXBlID0gJ3BlcnNvbmFsJztcclxuXHRcdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0XHRcdHBhZ2VJRDogaWQsXHJcblx0XHRcdFx0XHRcdHR5cGU6IHVybHR5cGUsXHJcblx0XHRcdFx0XHRcdGNvbW1hbmQ6IHR5cGUsXHJcblx0XHRcdFx0XHRcdGRhdGE6IFtdXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0aWYgKGFkZExpbmspIG9iai5kYXRhID0gZGF0YS5yYXcuZGF0YTsgLy/ov73liqDosrzmlodcclxuXHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdmYmlkPScpO1xyXG5cdFx0XHRcdFx0XHRpZiAoc3RhcnQgPj0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdGxldCBlbmQgPSB1cmwuaW5kZXhPZihcIiZcIiwgc3RhcnQpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0ICsgNSwgZW5kKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZigncG9zdHMvJyk7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQgKyA2LCB1cmwubGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRsZXQgdmlkZW8gPSB1cmwuaW5kZXhPZigndmlkZW9zLycpO1xyXG5cdFx0XHRcdFx0XHRpZiAodmlkZW8gPj0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdwdXJlJykge1xyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gdXJsLnJlcGxhY2UoL1xcXCIvZywgJycpO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ2V2ZW50Jykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3miYDmnInnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5jb21tYW5kID0gJ2ZlZWQnO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reafkOevh+eVmeiogOeahOeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ2dyb3VwJykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChhdXRoX3Njb3BlLmluZGV4T2YoXCJncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvXCIpID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyBcIl9cIiArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aXRsZTogJ+ekvuWcmOS9v+eUqOmcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWcmCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGh0bWw6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAncGhvdG8nKSB7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gdXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICd2aWRlbycpIHtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRGQi5hcGkoYC8ke29iai5wdXJlSUR9P2ZpZWxkcz1saXZlX3N0YXR1c2AsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChyZXMubGl2ZV9zdGF0dXMgPT09ICdMSVZFJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxIHx8IHJlc3VsdC5sZW5ndGggPT0gMykge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICd1bm5hbWUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRGQi5hcGkoYC8ke29iai5wYWdlSUR9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoZWNrVHlwZTogKHBvc3R1cmwpID0+IHtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJmYmlkPVwiKSA+PSAwKSB7XHJcblx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ3Blcm1hbGluaycpID49IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3VubmFtZSc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuICdwZXJzb25hbCc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL2dyb3Vwcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ2dyb3VwJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdldmVudCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9waG90b3MvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdwaG90byc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi92aWRlb3MvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICd2aWRlbyc7XHJcblx0XHR9XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdwdXJlJztcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJ25vcm1hbCc7XHJcblx0fSxcclxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBzdGFydCA9IHBvc3R1cmwuaW5kZXhPZihcImZhY2Vib29rLmNvbVwiKSArIDEzO1xyXG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLCBzdGFydCk7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGlmIChlbmQgPCAwKSB7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignZmJpZD0nKSA+PSAwKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3VubmFtZScpIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgndW5uYW1lJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IGdyb3VwID0gcG9zdHVybC5pbmRleE9mKCcvZ3JvdXBzLycpO1xyXG5cdFx0XHRcdGxldCBldmVudCA9IHBvc3R1cmwuaW5kZXhPZignL2V2ZW50cy8nKVxyXG5cdFx0XHRcdGlmIChncm91cCA+PSAwKSB7XHJcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwICsgODtcclxuXHRcdFx0XHRcdGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIiwgc3RhcnQpO1xyXG5cdFx0XHRcdFx0bGV0IHJlZ2V4MiA9IC9cXGR7Nix9L2c7XHJcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xyXG5cdFx0XHRcdFx0aWYgKHJlZ2V4Mi50ZXN0KHRlbXApKSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUodGVtcCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdncm91cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZXZlbnQgPj0gMCkge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSgnZXZlbnQnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XHJcblx0XHRcdFx0XHRGQi5hcGkoYC8ke3BhZ2VuYW1lfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmlkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZvcm1hdDogKHVybCkgPT4ge1xyXG5cdFx0aWYgKHVybC5pbmRleE9mKCdidXNpbmVzcy5mYWNlYm9vay5jb20vJykgPj0gMCkge1xyXG5cdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhd2RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIHN0YXJ0VGltZSwgZW5kVGltZSkgPT4ge1xyXG5cdFx0bGV0IGRhdGEgPSByYXdkYXRhLmRhdGE7XHJcblx0XHRpZiAod29yZCAhPT0gJycpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIHN0YXJ0VGltZSwgZW5kVGltZSk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKSA9PiB7XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmIChrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0aWYgKG4uc3RvcnkuaW5kZXhPZih3b3JkKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSkgPT4ge1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3MpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHN0LCB0KSA9PiB7XHJcblx0XHRsZXQgdGltZV9hcnkyID0gc3Quc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgZW5kdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwgKHBhcnNlSW50KHRpbWVfYXJ5WzFdKSAtIDEpLCB0aW1lX2FyeVsyXSwgdGltZV9hcnlbM10sIHRpbWVfYXJ5WzRdLCB0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IHN0YXJ0dGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeTJbMF0sIChwYXJzZUludCh0aW1lX2FyeTJbMV0pIC0gMSksIHRpbWVfYXJ5MlsyXSwgdGltZV9hcnkyWzNdLCB0aW1lX2FyeTJbNF0sIHRpbWVfYXJ5Mls1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKChjcmVhdGVkX3RpbWUgPiBzdGFydHRpbWUgJiYgY3JlYXRlZF90aW1lIDwgZW5kdGltZSkgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIikge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcikgPT4ge1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJykge1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcikge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKSA9PiB7XHJcblxyXG5cdH0sXHJcblx0YWRkTGluazogKCkgPT4ge1xyXG5cdFx0bGV0IHRhciA9ICQoJy5pbnB1dGFyZWEgLm1vcmVsaW5rJyk7XHJcblx0XHRpZiAodGFyLmhhc0NsYXNzKCdzaG93JykpIHtcclxuXHRcdFx0dGFyLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YXIuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlc2V0OiAoKSA9PiB7XHJcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIikpIHtcclxuXHRcdFx0XHQkKFwiI3RhZ1wiKS5jbGljaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpIHtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpICsgMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBkYXRlICsgXCItXCIgKyBob3VyICsgXCItXCIgKyBtaW4gKyBcIi1cIiArIHNlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCkge1xyXG5cdHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuXHR2YXIgbW9udGhzID0gWycwMScsICcwMicsICcwMycsICcwNCcsICcwNScsICcwNicsICcwNycsICcwOCcsICcwOScsICcxMCcsICcxMScsICcxMiddO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0aWYgKGRhdGUgPCAxMCkge1xyXG5cdFx0ZGF0ZSA9IFwiMFwiICsgZGF0ZTtcclxuXHR9XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdGlmIChtaW4gPCAxMCkge1xyXG5cdFx0bWluID0gXCIwXCIgKyBtaW47XHJcblx0fVxyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRpZiAoc2VjIDwgMTApIHtcclxuXHRcdHNlYyA9IFwiMFwiICsgc2VjO1xyXG5cdH1cclxuXHR2YXIgdGltZSA9IHllYXIgKyAnLScgKyBtb250aCArICctJyArIGRhdGUgKyBcIiBcIiArIGhvdXIgKyAnOicgKyBtaW4gKyAnOicgKyBzZWM7XHJcblx0cmV0dXJuIHRpbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9iajJBcnJheShvYmopIHtcclxuXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBbdmFsdWVdO1xyXG5cdH0pO1xyXG5cdHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG5cdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgaSwgciwgdDtcclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRhcnlbaV0gPSBpO1xyXG5cdH1cclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcblx0XHR0ID0gYXJ5W3JdO1xyXG5cdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG5cdFx0YXJ5W2ldID0gdDtcclxuXHR9XHJcblx0cmV0dXJuIGFyeTtcclxufVxyXG5cclxuZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcblx0Ly9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuXHR2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcblxyXG5cdHZhciBDU1YgPSAnJztcclxuXHQvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuXHJcblx0Ly8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG5cdC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcblx0aWYgKFNob3dMYWJlbCkge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG5cclxuXHRcdFx0Ly9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuXHRcdFx0cm93ICs9IGluZGV4ICsgJywnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcblxyXG5cdFx0Ly9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0Ly8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuXHRcdFx0cm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0Ly9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHRpZiAoQ1NWID09ICcnKSB7XHJcblx0XHRhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuXHR2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG5cdC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG5cdGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZywgXCJfXCIpO1xyXG5cclxuXHQvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG5cdHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcblxyXG5cdC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG5cdC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcblx0Ly8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcblx0Ly8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuXHJcblx0Ly90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcblx0bGluay5ocmVmID0gdXJpO1xyXG5cclxuXHQvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG5cdGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcblx0bGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcblxyXG5cdC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHRsaW5rLmNsaWNrKCk7XHJcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
