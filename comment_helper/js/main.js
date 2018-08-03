"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
window.onerror = handleErr;
var TABLE;
var lastCommand = 'comments';
var addLink = false;

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
		$(".prizeDetail").append("<div class=\"prize\"><div class=\"input_group\">\u54C1\u540D\uFF1A<input type=\"text\"></div><div class=\"input_group\">\u62BD\u734E\u4EBA\u6578\uFF1A<input type=\"number\"></div></div>");
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
		comments: ['like_count', 'message_tags', 'message', 'from', 'created_time', 'is_hidden'],
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
		comments: 'v2.7',
		reactions: 'v2.7',
		sharedposts: 'v2.9',
		url_comments: 'v2.7',
		feed: 'v2.9',
		group: 'v2.7'
	},
	filter: {
		word: '',
		react: 'all',
		startTime: '2000-12-31-00-00-00',
		endTime: nowDate()
	},
	order: '',
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
			var authStr = response.authResponse.grantedScopes;
			config.from_extension = false;
			if (type == "addScope") {
				if (authStr.indexOf('groups_access_member_info') >= 0) {
					swal('付費授權完成，請再次執行抓留言', 'Authorization Finished! Please getComments again.', 'success').done();
				} else {
					swal('付費授權失敗，請聯絡管理員確認', 'Authorization Failed! Please contact the admin.', 'error').done();
				}
			} else if (type == "sharedposts") {
				if (authStr.indexOf("groups_access_member_info") < 0) {
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
			if (response.authResponse.grantedScopes.indexOf("groups_access_member_info") < 0) {
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
			console.log(config.apiVersion[command] + "/" + fbid.fullID + "/" + fbid.command + "?limit=" + config.limit[fbid.command] + "&fields=" + config.field[fbid.command].toString() + "&debug=all");

			// if($('.token').val() === ''){
			// 	$('.token').val(config.pageToken);
			// }else{
			// 	config.pageToken = $('.token').val();
			// }

			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/" + fbid.command + "?limit=" + config.limit[fbid.command] + "&order=" + config.order + "&fields=" + config.field[fbid.command].toString() + "&access_token=" + config.pageToken + "&debug=all", function (res) {
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
		if (config.from_extension === false && rawData.command === 'comments') {
			rawData.data = rawData.data.filter(function (item) {
				return item.is_hidden === false;
			});
		}
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
						"臉書連結": 'http://www.facebook.com/' + this.from.id,
						"姓名": this.from.name,
						"留言連結": 'http://www.facebook.com/' + this.postlink,
						"留言內容": this.message
					};
					newObj.push(tmp);
				});
			} else {
				$.each(raw.filtered, function (i) {
					var tmp = {
						"序號": i + 1,
						"臉書連結": 'http://www.facebook.com/' + this.from.id,
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
					"臉書連結": 'http://www.facebook.com/' + this.from.id,
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
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u8868\u60C5</td>";
		} else if (rawdata.command === 'sharedposts') {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
		} else if (rawdata.command === 'ranker') {
			thead = "<td>\u6392\u540D</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u5206\u6578</td>";
		} else {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td>\u8B9A</td>\n\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
		}

		var host = 'http://www.facebook.com/';
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
					picture = "<img src=\"http://graph.facebook.com/" + val.from.id + "/picture?type=small\"><br>";
				}
				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' target=\"_blank\">" + picture + val.from.name + "</a></td>";
				if (rawdata.command === 'reactions' || config.likes) {
					td += "<td class=\"center\"><span class=\"react " + val.type + "\"></span>" + val.type + "</td>";
				} else if (rawdata.command === 'sharedposts') {
					td += "<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + val.story + "</a></td>\n\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
				} else if (rawdata.command === 'ranker') {
					td = "<td>" + (j + 1) + "</td>\n\t\t\t\t\t  <td><a href='http://www.facebook.com/" + val.from.id + "' target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t\t\t  <td>" + val.score + "</td>";
				} else {
					var link = val.id;
					if (config.from_extension) {
						link = val.postlink;
					}
					td += "<td class=\"force-break\"><a href=\"" + host + link + "\" target=\"_blank\">" + val.message + "</a></td>\n\t\t\t\t<td>" + val.like_count + "</td>\n\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
				}
				var tr = "<tr>" + td + "</tr>";
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

		var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
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
				$("<tr><td class=\"prizeName\" colspan=\"5\">\u734E\u54C1\uFF1A " + choose.list[k].name + " <span>\u5171 " + choose.list[k].num + " \u540D</span></td></tr>").insertBefore(tar);
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
				award.userid = $(val).find('td').eq(1).find('a').attr('href').replace('http://www.facebook.com/', '');
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
					li += "<li class=\"prizeName\">" + i.name + "</li>";
				} else {
					li += "<li>\n\t\t\t\t<a href=\"https://www.facebook.com/" + i.userid + "\" target=\"_blank\"><img src=\"http://graph.facebook.com/" + i.userid + "/picture?type=large\" alt=\"\"></a>\n\t\t\t\t<div class=\"info\">\n\t\t\t\t<p class=\"name\"><a href=\"https://www.facebook.com/" + i.userid + "\" target=\"_blank\">" + i.name + "</a></p>\n\t\t\t\t<p class=\"message\"><a href=\"" + i.link + "\" target=\"_blank\">" + i.message + "</a></p>\n\t\t\t\t<p class=\"time\"><a href=\"" + i.link + "\" target=\"_blank\">" + i.time + "</a></p>\n\t\t\t\t</div>\n\t\t\t\t</li>";
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
			// $('.identity').removeClass('hide').html(`登入身份：<img src="http://graph.facebook.com/${res.id}/picture?type=small"><span>${res.name}</span>`);
		});
	},
	get: function get(url, type) {
		return new Promise(function (resolve, reject) {
			if (type == 'url_comments') {
				var posturl = url;
				if (posturl.indexOf("?") > 0) {
					posturl = posturl.substring(0, posturl.indexOf("?"));
				}
				FB.api("/" + posturl, function (res) {
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
							if (fb.user_posts) {
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
							FB.api("/" + obj.pureID + "?fields=live_status", function (res) {
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
								FB.api("/" + obj.pageID + "?fields=access_token", function (res) {
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
					FB.api("/" + pagename + "?fields=access_token", function (res) {
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
	var arrData = (typeof JSONData === "undefined" ? "undefined" : _typeof(JSONData)) != 'object' ? JSON.parse(JSONData) : JSONData;

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
	var uri = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(CSV);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIlRBQkxFIiwibGFzdENvbW1hbmQiLCJhZGRMaW5rIiwibXNnIiwidXJsIiwibCIsImNvbnNvbGUiLCJsb2ciLCIkIiwidmFsIiwiYXBwZW5kIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImhhc2giLCJsb2NhdGlvbiIsInNlYXJjaCIsImluZGV4T2YiLCJyZW1vdmVDbGFzcyIsImRhdGEiLCJleHRlbnNpb24iLCJjbGljayIsImUiLCJmYiIsImV4dGVuc2lvbkF1dGgiLCJkYXRhcyIsImNvbW1hbmQiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJyYW5rZXIiLCJyYXciLCJmaW5pc2giLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJnZXRBdXRoIiwibGlrZXMiLCJjaG9vc2UiLCJpbml0IiwidWkiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwia2V5ZG93biIsInRleHQiLCJrZXl1cCIsIm9uIiwidGFibGUiLCJyZWRvIiwiY2hhbmdlIiwiZmlsdGVyIiwicmVhY3QiLCJkYXRlcmFuZ2VwaWNrZXIiLCJzdGFydCIsImVuZCIsImxhYmVsIiwic3RhcnRUaW1lIiwiZm9ybWF0IiwiZW5kVGltZSIsInNldFN0YXJ0RGF0ZSIsImZpbHRlckRhdGEiLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwic2hhcmVCVE4iLCJhbGVydCIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIndvcmQiLCJub3dEYXRlIiwiYXV0aCIsInBhZ2VUb2tlbiIsImZyb21fZXh0ZW5zaW9uIiwidXNlcl9wb3N0cyIsInR5cGUiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJ0aXRsZSIsImh0bWwiLCJmYmlkIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJwb3N0ZGF0YSIsImF1dGhPSyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwiZ2V0IiwidGhlbiIsInJlcyIsImkiLCJwdXNoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwcm9taXNlX2FycmF5IiwicHVyZUlEIiwidG9TdHJpbmciLCJhcGkiLCJkIiwiZnJvbSIsImlkIiwibmFtZSIsInVwZGF0ZWRfdGltZSIsImNyZWF0ZWRfdGltZSIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsInJlc2V0IiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJwcm9wIiwiaXNUYWciLCJpdGVtIiwiaXNfaGlkZGVuIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwiZmlsdGVyZWQiLCJuZXdPYmoiLCJlYWNoIiwidG1wIiwicG9zdGxpbmsiLCJtZXNzYWdlIiwic3RvcnkiLCJ0aW1lQ29udmVydGVyIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInN0ciIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwiZmlsdGVyZGF0YSIsInRoZWFkIiwidGJvZHkiLCJwaWMiLCJob3N0IiwiZW50cmllcyIsImoiLCJwaWN0dXJlIiwidGQiLCJzY29yZSIsImxpbmsiLCJsaWtlX2NvdW50IiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwibiIsInBhcnNlSW50IiwiZmluZCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwibWFwIiwiaW5kZXgiLCJyb3dzIiwibm9kZXMiLCJpbm5lckhUTUwiLCJub3ciLCJrIiwidGFyIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJnZW5fYmlnX2F3YXJkIiwibGkiLCJhd2FyZHMiLCJoYXNBdHRyaWJ1dGUiLCJhd2FyZF9uYW1lIiwiYXR0ciIsInRpbWUiLCJjbG9zZV9iaWdfYXdhcmQiLCJlbXB0eSIsInN1YnN0cmluZyIsInBvc3R1cmwiLCJvYmoiLCJvZ19vYmplY3QiLCJyZWdleCIsIm5ld3VybCIsInN1YnN0ciIsIm1hdGNoIiwidXJsdHlwZSIsImNoZWNrVHlwZSIsImNoZWNrUGFnZUlEIiwicGFnZUlEIiwidmlkZW8iLCJsaXZlX3N0YXR1cyIsImVycm9yIiwiYWNjZXNzX3Rva2VuIiwicmVnZXgyIiwidGVtcCIsInRlc3QiLCJwYWdlbmFtZSIsInRhZyIsInVuaXF1ZSIsIm91dHB1dCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsInVuZGVmaW5lZCIsIm1lc3NhZ2VfdGFncyIsInN0IiwidCIsInRpbWVfYXJ5MiIsInNwbGl0IiwidGltZV9hcnkiLCJlbmR0aW1lIiwibW9tZW50IiwiRGF0ZSIsIl9kIiwic3RhcnR0aW1lIiwiYSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwicm93Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQkMsU0FBakI7QUFDQSxJQUFJQyxLQUFKO0FBQ0EsSUFBSUMsY0FBYyxVQUFsQjtBQUNBLElBQUlDLFVBQVUsS0FBZDs7QUFFQSxTQUFTSCxTQUFULENBQW1CSSxHQUFuQixFQUF3QkMsR0FBeEIsRUFBNkJDLENBQTdCLEVBQWdDO0FBQy9CLEtBQUksQ0FBQ1QsWUFBTCxFQUFtQjtBQUNsQlUsVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWlELDRCQUFqRDtBQUNBRCxVQUFRQyxHQUFSLENBQVksc0JBQXNCQyxFQUFFLGdCQUFGLEVBQW9CQyxHQUFwQixFQUFsQztBQUNBRCxJQUFFLGlCQUFGLEVBQXFCRSxNQUFyQixDQUE0QixTQUFTRixFQUFFLGdCQUFGLEVBQW9CQyxHQUFwQixFQUFyQztBQUNBRCxJQUFFLGlCQUFGLEVBQXFCRyxNQUFyQjtBQUNBZixpQkFBZSxJQUFmO0FBQ0E7QUFDRCxRQUFPLEtBQVA7QUFDQTtBQUNEWSxFQUFFSSxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBWTtBQUM3QixLQUFJQyxPQUFPQyxTQUFTQyxNQUFwQjtBQUNBLEtBQUlGLEtBQUtHLE9BQUwsQ0FBYSxXQUFiLEtBQTZCLENBQWpDLEVBQW9DO0FBQ25DVCxJQUFFLG9CQUFGLEVBQXdCVSxXQUF4QixDQUFvQyxNQUFwQztBQUNBQyxPQUFLQyxTQUFMLEdBQWlCLElBQWpCOztBQUVBWixJQUFFLDJCQUFGLEVBQStCYSxLQUEvQixDQUFxQyxVQUFVQyxDQUFWLEVBQWE7QUFDakRDLE1BQUdDLGFBQUg7QUFDQSxHQUZEO0FBR0E7QUFDRCxLQUFJVixLQUFLRyxPQUFMLENBQWEsUUFBYixLQUEwQixDQUE5QixFQUFpQztBQUNoQyxNQUFJUSxRQUFRO0FBQ1hDLFlBQVMsUUFERTtBQUVYUCxTQUFNUSxLQUFLQyxLQUFMLENBQVdDLGFBQWFDLE1BQXhCO0FBRkssR0FBWjtBQUlBWCxPQUFLWSxHQUFMLEdBQVdOLEtBQVg7QUFDQU4sT0FBS2EsTUFBTCxDQUFZYixLQUFLWSxHQUFqQjtBQUNBOztBQUdEdkIsR0FBRSxlQUFGLEVBQW1CYSxLQUFuQixDQUF5QixVQUFVQyxDQUFWLEVBQWE7QUFDckNoQixVQUFRQyxHQUFSLENBQVllLENBQVo7QUFDQSxNQUFJQSxFQUFFVyxPQUFGLElBQWFYLEVBQUVZLE1BQW5CLEVBQTJCO0FBQzFCQyxVQUFPQyxLQUFQLEdBQWUsZUFBZjtBQUNBO0FBQ0RiLEtBQUdjLE9BQUgsQ0FBVyxVQUFYO0FBQ0EsRUFORDs7QUFRQTdCLEdBQUUsV0FBRixFQUFlYSxLQUFmLENBQXFCLFVBQVVDLENBQVYsRUFBYTtBQUNqQyxNQUFJQSxFQUFFVyxPQUFGLElBQWFYLEVBQUVZLE1BQW5CLEVBQTJCO0FBQzFCQyxVQUFPRyxLQUFQLEdBQWUsSUFBZjtBQUNBO0FBQ0RmLEtBQUdjLE9BQUgsQ0FBVyxXQUFYO0FBQ0EsRUFMRDtBQU1BN0IsR0FBRSxVQUFGLEVBQWNhLEtBQWQsQ0FBb0IsWUFBWTtBQUMvQkUsS0FBR2MsT0FBSCxDQUFXLGNBQVg7QUFDQSxFQUZEO0FBR0E3QixHQUFFLFVBQUYsRUFBY2EsS0FBZCxDQUFvQixZQUFZO0FBQy9CRSxLQUFHYyxPQUFILENBQVcsVUFBWDtBQUNBLEVBRkQ7QUFHQTdCLEdBQUUsYUFBRixFQUFpQmEsS0FBakIsQ0FBdUIsWUFBWTtBQUNsQ2tCLFNBQU9DLElBQVA7QUFDQSxFQUZEO0FBR0FoQyxHQUFFLFdBQUYsRUFBZWEsS0FBZixDQUFxQixZQUFZO0FBQ2hDb0IsS0FBR3ZDLE9BQUg7QUFDQSxFQUZEOztBQUlBTSxHQUFFLFlBQUYsRUFBZ0JhLEtBQWhCLENBQXNCLFlBQVk7QUFDakMsTUFBSWIsRUFBRSxJQUFGLEVBQVFrQyxRQUFSLENBQWlCLFFBQWpCLENBQUosRUFBZ0M7QUFDL0JsQyxLQUFFLElBQUYsRUFBUVUsV0FBUixDQUFvQixRQUFwQjtBQUNBVixLQUFFLFdBQUYsRUFBZVUsV0FBZixDQUEyQixTQUEzQjtBQUNBVixLQUFFLGNBQUYsRUFBa0JVLFdBQWxCLENBQThCLFFBQTlCO0FBQ0EsR0FKRCxNQUlPO0FBQ05WLEtBQUUsSUFBRixFQUFRbUMsUUFBUixDQUFpQixRQUFqQjtBQUNBbkMsS0FBRSxXQUFGLEVBQWVtQyxRQUFmLENBQXdCLFNBQXhCO0FBQ0FuQyxLQUFFLGNBQUYsRUFBa0JtQyxRQUFsQixDQUEyQixRQUEzQjtBQUNBO0FBQ0QsRUFWRDs7QUFZQW5DLEdBQUUsVUFBRixFQUFjYSxLQUFkLENBQW9CLFlBQVk7QUFDL0IsTUFBSWIsRUFBRSxJQUFGLEVBQVFrQyxRQUFSLENBQWlCLFFBQWpCLENBQUosRUFBZ0M7QUFDL0JsQyxLQUFFLElBQUYsRUFBUVUsV0FBUixDQUFvQixRQUFwQjtBQUNBLEdBRkQsTUFFTztBQUNOVixLQUFFLElBQUYsRUFBUW1DLFFBQVIsQ0FBaUIsUUFBakI7QUFDQTtBQUNELEVBTkQ7O0FBUUFuQyxHQUFFLGVBQUYsRUFBbUJhLEtBQW5CLENBQXlCLFlBQVk7QUFDcENiLElBQUUsY0FBRixFQUFrQkUsTUFBbEI7QUFDQSxFQUZEOztBQUlBRixHQUFFWCxNQUFGLEVBQVUrQyxPQUFWLENBQWtCLFVBQVV0QixDQUFWLEVBQWE7QUFDOUIsTUFBSUEsRUFBRVcsT0FBRixJQUFhWCxFQUFFWSxNQUFuQixFQUEyQjtBQUMxQjFCLEtBQUUsWUFBRixFQUFnQnFDLElBQWhCLENBQXFCLFFBQXJCO0FBQ0E7QUFDRCxFQUpEO0FBS0FyQyxHQUFFWCxNQUFGLEVBQVVpRCxLQUFWLENBQWdCLFVBQVV4QixDQUFWLEVBQWE7QUFDNUIsTUFBSSxDQUFDQSxFQUFFVyxPQUFILElBQWNYLEVBQUVZLE1BQXBCLEVBQTRCO0FBQzNCMUIsS0FBRSxZQUFGLEVBQWdCcUMsSUFBaEIsQ0FBcUIsU0FBckI7QUFDQTtBQUNELEVBSkQ7O0FBTUFyQyxHQUFFLGVBQUYsRUFBbUJ1QyxFQUFuQixDQUFzQixRQUF0QixFQUFnQyxZQUFZO0FBQzNDQyxRQUFNQyxJQUFOO0FBQ0EsRUFGRDs7QUFJQXpDLEdBQUUsaUJBQUYsRUFBcUIwQyxNQUFyQixDQUE0QixZQUFZO0FBQ3ZDZixTQUFPZ0IsTUFBUCxDQUFjQyxLQUFkLEdBQXNCNUMsRUFBRSxJQUFGLEVBQVFDLEdBQVIsRUFBdEI7QUFDQXVDLFFBQU1DLElBQU47QUFDQSxFQUhEOztBQUtBekMsR0FBRSxZQUFGLEVBQWdCNkMsZUFBaEIsQ0FBZ0M7QUFDL0IsZ0JBQWMsSUFEaUI7QUFFL0Isc0JBQW9CLElBRlc7QUFHL0IsWUFBVTtBQUNULGFBQVUsa0JBREQ7QUFFVCxnQkFBYSxHQUZKO0FBR1QsaUJBQWMsSUFITDtBQUlULGtCQUFlLElBSk47QUFLVCxnQkFBYSxNQUxKO0FBTVQsY0FBVyxJQU5GO0FBT1QsdUJBQW9CLFFBUFg7QUFRVCxpQkFBYyxDQUNiLEdBRGEsRUFFYixHQUZhLEVBR2IsR0FIYSxFQUliLEdBSmEsRUFLYixHQUxhLEVBTWIsR0FOYSxFQU9iLEdBUGEsQ0FSTDtBQWlCVCxpQkFBYyxDQUNiLElBRGEsRUFFYixJQUZhLEVBR2IsSUFIYSxFQUliLElBSmEsRUFLYixJQUxhLEVBTWIsSUFOYSxFQU9iLElBUGEsRUFRYixJQVJhLEVBU2IsSUFUYSxFQVViLElBVmEsRUFXYixLQVhhLEVBWWIsS0FaYSxDQWpCTDtBQStCVCxlQUFZO0FBL0JIO0FBSHFCLEVBQWhDLEVBb0NHLFVBQVVDLEtBQVYsRUFBaUJDLEdBQWpCLEVBQXNCQyxLQUF0QixFQUE2QjtBQUMvQnJCLFNBQU9nQixNQUFQLENBQWNNLFNBQWQsR0FBMEJILE1BQU1JLE1BQU4sQ0FBYSxxQkFBYixDQUExQjtBQUNBdkIsU0FBT2dCLE1BQVAsQ0FBY1EsT0FBZCxHQUF3QkosSUFBSUcsTUFBSixDQUFXLHFCQUFYLENBQXhCO0FBQ0FWLFFBQU1DLElBQU47QUFDQSxFQXhDRDtBQXlDQXpDLEdBQUUsWUFBRixFQUFnQlcsSUFBaEIsQ0FBcUIsaUJBQXJCLEVBQXdDeUMsWUFBeEMsQ0FBcUR6QixPQUFPZ0IsTUFBUCxDQUFjTSxTQUFuRTs7QUFHQWpELEdBQUUsWUFBRixFQUFnQmEsS0FBaEIsQ0FBc0IsVUFBVUMsQ0FBVixFQUFhO0FBQ2xDLE1BQUl1QyxhQUFhMUMsS0FBS2dDLE1BQUwsQ0FBWWhDLEtBQUtZLEdBQWpCLENBQWpCO0FBQ0EsTUFBSVQsRUFBRVcsT0FBRixJQUFhWCxFQUFFWSxNQUFuQixFQUEyQjtBQUMxQixPQUFJOUIsTUFBTSxpQ0FBaUN1QixLQUFLbUMsU0FBTCxDQUFlRCxVQUFmLENBQTNDO0FBQ0FoRSxVQUFPa0UsSUFBUCxDQUFZM0QsR0FBWixFQUFpQixRQUFqQjtBQUNBUCxVQUFPbUUsS0FBUDtBQUNBLEdBSkQsTUFJTztBQUNOLE9BQUlILFdBQVdJLE1BQVgsR0FBb0IsSUFBeEIsRUFBOEI7QUFDN0J6RCxNQUFFLFdBQUYsRUFBZVUsV0FBZixDQUEyQixNQUEzQjtBQUNBLElBRkQsTUFFTztBQUNOZ0QsdUJBQW1CL0MsS0FBS2dELEtBQUwsQ0FBV04sVUFBWCxDQUFuQixFQUEyQyxnQkFBM0MsRUFBNkQsSUFBN0Q7QUFDQTtBQUNEO0FBQ0QsRUFiRDs7QUFlQXJELEdBQUUsV0FBRixFQUFlYSxLQUFmLENBQXFCLFlBQVk7QUFDaEMsTUFBSXdDLGFBQWExQyxLQUFLZ0MsTUFBTCxDQUFZaEMsS0FBS1ksR0FBakIsQ0FBakI7QUFDQSxNQUFJcUMsY0FBY2pELEtBQUtnRCxLQUFMLENBQVdOLFVBQVgsQ0FBbEI7QUFDQXJELElBQUUsWUFBRixFQUFnQkMsR0FBaEIsQ0FBb0JrQixLQUFLbUMsU0FBTCxDQUFlTSxXQUFmLENBQXBCO0FBQ0EsRUFKRDs7QUFNQSxLQUFJQyxhQUFhLENBQWpCO0FBQ0E3RCxHQUFFLEtBQUYsRUFBU2EsS0FBVCxDQUFlLFVBQVVDLENBQVYsRUFBYTtBQUMzQitDO0FBQ0EsTUFBSUEsY0FBYyxDQUFsQixFQUFxQjtBQUNwQjdELEtBQUUsNEJBQUYsRUFBZ0NtQyxRQUFoQyxDQUF5QyxNQUF6QztBQUNBbkMsS0FBRSxZQUFGLEVBQWdCVSxXQUFoQixDQUE0QixNQUE1QjtBQUNBO0FBQ0QsTUFBSUksRUFBRVcsT0FBRixJQUFhWCxFQUFFWSxNQUFuQixFQUEyQixDQUUxQjtBQUNELEVBVEQ7QUFVQTFCLEdBQUUsWUFBRixFQUFnQjBDLE1BQWhCLENBQXVCLFlBQVk7QUFDbEMxQyxJQUFFLFVBQUYsRUFBY1UsV0FBZCxDQUEwQixNQUExQjtBQUNBVixJQUFFLG1CQUFGLEVBQXVCcUMsSUFBdkIsQ0FBNEIsaUNBQTVCO0FBQ0ExQixPQUFLbUQsTUFBTCxDQUFZLEtBQUtDLEtBQUwsQ0FBVyxDQUFYLENBQVo7QUFDQSxFQUpEO0FBS0EsQ0E1S0Q7O0FBOEtBLFNBQVNDLFFBQVQsR0FBb0I7QUFDbkJDLE9BQU0sc0NBQU47QUFDQTs7QUFFRCxJQUFJdEMsU0FBUztBQUNadUMsUUFBTztBQUNOQyxZQUFVLENBQUMsWUFBRCxFQUFlLGNBQWYsRUFBK0IsU0FBL0IsRUFBMEMsTUFBMUMsRUFBa0QsY0FBbEQsRUFBa0UsV0FBbEUsQ0FESjtBQUVOQyxhQUFXLEVBRkw7QUFHTkMsZUFBYSxDQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCLGNBQWxCLENBSFA7QUFJTkMsZ0JBQWMsRUFKUjtBQUtOQyxRQUFNLENBQUMsY0FBRCxFQUFpQixNQUFqQixFQUF5QixTQUF6QixFQUFvQyxPQUFwQyxDQUxBO0FBTU56QyxTQUFPLENBQUMsTUFBRDtBQU5ELEVBREs7QUFTWjBDLFFBQU87QUFDTkwsWUFBVSxLQURKO0FBRU5DLGFBQVcsS0FGTDtBQUdOQyxlQUFhLEtBSFA7QUFJTkMsZ0JBQWMsS0FKUjtBQUtOQyxRQUFNLEtBTEE7QUFNTnpDLFNBQU87QUFORCxFQVRLO0FBaUJaMkMsYUFBWTtBQUNYTixZQUFVLE1BREM7QUFFWEMsYUFBVyxNQUZBO0FBR1hDLGVBQWEsTUFIRjtBQUlYQyxnQkFBYyxNQUpIO0FBS1hDLFFBQU0sTUFMSztBQU1YRyxTQUFPO0FBTkksRUFqQkE7QUF5QlovQixTQUFRO0FBQ1BnQyxRQUFNLEVBREM7QUFFUC9CLFNBQU8sS0FGQTtBQUdQSyxhQUFXLHFCQUhKO0FBSVBFLFdBQVN5QjtBQUpGLEVBekJJO0FBK0JaaEQsUUFBTyxFQS9CSztBQWdDWmlELE9BQU0sd0NBaENNO0FBaUNaL0MsUUFBTyxLQWpDSztBQWtDWmdELFlBQVcsRUFsQ0M7QUFtQ1pDLGlCQUFnQjtBQW5DSixDQUFiOztBQXNDQSxJQUFJaEUsS0FBSztBQUNSaUUsYUFBWSxLQURKO0FBRVJuRCxVQUFTLG1CQUFlO0FBQUEsTUFBZG9ELElBQWMsdUVBQVAsRUFBTzs7QUFDdkIsTUFBSUEsU0FBUyxFQUFiLEVBQWlCO0FBQ2hCdkYsYUFBVSxJQUFWO0FBQ0F1RixVQUFPeEYsV0FBUDtBQUNBLEdBSEQsTUFHTztBQUNOQyxhQUFVLEtBQVY7QUFDQUQsaUJBQWN3RixJQUFkO0FBQ0E7QUFDREMsS0FBR0MsS0FBSCxDQUFTLFVBQVVDLFFBQVYsRUFBb0I7QUFDNUJyRSxNQUFHc0UsUUFBSCxDQUFZRCxRQUFaLEVBQXNCSCxJQUF0QjtBQUNBLEdBRkQsRUFFRztBQUNGSyxVQUFPM0QsT0FBT2tELElBRFo7QUFFRlUsa0JBQWU7QUFGYixHQUZIO0FBTUEsRUFoQk87QUFpQlJGLFdBQVUsa0JBQUNELFFBQUQsRUFBV0gsSUFBWCxFQUFvQjtBQUM3Qm5GLFVBQVFDLEdBQVIsQ0FBWXFGLFFBQVo7QUFDQSxNQUFJQSxTQUFTSSxNQUFULEtBQW9CLFdBQXhCLEVBQXFDO0FBQ3BDLE9BQUlDLFVBQVVMLFNBQVNNLFlBQVQsQ0FBc0JDLGFBQXBDO0FBQ0FoRSxVQUFPb0QsY0FBUCxHQUF3QixLQUF4QjtBQUNBLE9BQUlFLFFBQVEsVUFBWixFQUF3QjtBQUN2QixRQUFJUSxRQUFRaEYsT0FBUixDQUFnQiwyQkFBaEIsS0FBZ0QsQ0FBcEQsRUFBdUQ7QUFDdERtRixVQUNDLGlCQURELEVBRUMsbURBRkQsRUFHQyxTQUhELEVBSUVDLElBSkY7QUFLQSxLQU5ELE1BTU87QUFDTkQsVUFDQyxpQkFERCxFQUVDLGlEQUZELEVBR0MsT0FIRCxFQUlFQyxJQUpGO0FBS0E7QUFDRCxJQWRELE1BY08sSUFBSVosUUFBUSxhQUFaLEVBQTJCO0FBQ2pDLFFBQUlRLFFBQVFoRixPQUFSLENBQWdCLDJCQUFoQixJQUErQyxDQUFuRCxFQUFzRDtBQUNyRG1GLFVBQUs7QUFDSkUsYUFBTyxpQkFESDtBQUVKQyxZQUFNLCtHQUZGO0FBR0pkLFlBQU07QUFIRixNQUFMLEVBSUdZLElBSkg7QUFLQSxLQU5ELE1BTU87QUFDTjlFLFFBQUdpRSxVQUFILEdBQWdCLElBQWhCO0FBQ0FnQixVQUFLaEUsSUFBTCxDQUFVaUQsSUFBVjtBQUNBO0FBQ0QsSUFYTSxNQVdBO0FBQ05sRSxPQUFHaUUsVUFBSCxHQUFnQixJQUFoQjtBQUNBZ0IsU0FBS2hFLElBQUwsQ0FBVWlELElBQVY7QUFDQTtBQUNELEdBaENELE1BZ0NPO0FBQ05DLE1BQUdDLEtBQUgsQ0FBUyxVQUFVQyxRQUFWLEVBQW9CO0FBQzVCckUsT0FBR3NFLFFBQUgsQ0FBWUQsUUFBWjtBQUNBLElBRkQsRUFFRztBQUNGRSxXQUFPM0QsT0FBT2tELElBRFo7QUFFRlUsbUJBQWU7QUFGYixJQUZIO0FBTUE7QUFDRCxFQTNETztBQTREUnZFLGdCQUFlLHlCQUFNO0FBQ3BCa0UsS0FBR0MsS0FBSCxDQUFTLFVBQVVDLFFBQVYsRUFBb0I7QUFDNUJyRSxNQUFHa0YsaUJBQUgsQ0FBcUJiLFFBQXJCO0FBQ0EsR0FGRCxFQUVHO0FBQ0ZFLFVBQU8zRCxPQUFPa0QsSUFEWjtBQUVGVSxrQkFBZTtBQUZiLEdBRkg7QUFNQSxFQW5FTztBQW9FUlUsb0JBQW1CLDJCQUFDYixRQUFELEVBQWM7QUFDaEMsTUFBSUEsU0FBU0ksTUFBVCxLQUFvQixXQUF4QixFQUFxQztBQUNwQzdELFVBQU9vRCxjQUFQLEdBQXdCLElBQXhCO0FBQ0EsT0FBSUssU0FBU00sWUFBVCxDQUFzQkMsYUFBdEIsQ0FBb0NsRixPQUFwQyxDQUE0QywyQkFBNUMsSUFBMkUsQ0FBL0UsRUFBa0Y7QUFDakZtRixTQUFLO0FBQ0pFLFlBQU8saUJBREg7QUFFSkMsV0FBTSwrR0FGRjtBQUdKZCxXQUFNO0FBSEYsS0FBTCxFQUlHWSxJQUpIO0FBS0EsSUFORCxNQU1PO0FBQ04sUUFBSUssV0FBVy9FLEtBQUtDLEtBQUwsQ0FBV0MsYUFBYTZFLFFBQXhCLENBQWY7QUFDQSxRQUFJQSxTQUFTakIsSUFBVCxLQUFrQixVQUF0QixFQUFrQztBQUNqQ2xFLFFBQUdvRixNQUFIO0FBQ0EsS0FGRCxNQUVPLElBQUlELFNBQVNqQixJQUFULEtBQWtCLE9BQXRCLEVBQStCO0FBQ3JDbEUsUUFBR29GLE1BQUg7QUFDQSxLQUZNLE1BRUE7QUFDTnBGLFFBQUdvRixNQUFIO0FBQ0E7QUFDRDtBQUNELEdBbEJELE1Ba0JPO0FBQ05qQixNQUFHQyxLQUFILENBQVMsVUFBVUMsUUFBVixFQUFvQjtBQUM1QnJFLE9BQUdrRixpQkFBSCxDQUFxQmIsUUFBckI7QUFDQSxJQUZELEVBRUc7QUFDRkUsV0FBTzNELE9BQU9rRCxJQURaO0FBRUZVLG1CQUFlO0FBRmIsSUFGSDtBQU1BO0FBQ0QsRUEvRk87QUFnR1JZLFNBQVEsa0JBQU07QUFDYm5HLElBQUUsb0JBQUYsRUFBd0JtQyxRQUF4QixDQUFpQyxNQUFqQztBQUNBLE1BQUkrRCxXQUFXL0UsS0FBS0MsS0FBTCxDQUFXQyxhQUFhNkUsUUFBeEIsQ0FBZjtBQUNBLE1BQUlqRixRQUFRO0FBQ1hDLFlBQVNnRixTQUFTaEYsT0FEUDtBQUVYUCxTQUFNUSxLQUFLQyxLQUFMLENBQVdwQixFQUFFLFNBQUYsRUFBYUMsR0FBYixFQUFYO0FBRkssR0FBWjtBQUlBVSxPQUFLWSxHQUFMLEdBQVdOLEtBQVg7QUFDQU4sT0FBS2EsTUFBTCxDQUFZYixLQUFLWSxHQUFqQjtBQUNBO0FBekdPLENBQVQ7O0FBNEdBLElBQUlaLE9BQU87QUFDVlksTUFBSyxFQURLO0FBRVY2RSxTQUFRLEVBRkU7QUFHVkMsWUFBVyxDQUhEO0FBSVZ6RixZQUFXLEtBSkQ7QUFLVm9CLE9BQU0sZ0JBQU07QUFDWGhDLElBQUUsYUFBRixFQUFpQnNHLFNBQWpCLEdBQTZCQyxPQUE3QjtBQUNBdkcsSUFBRSxZQUFGLEVBQWdCd0csSUFBaEI7QUFDQXhHLElBQUUsbUJBQUYsRUFBdUJxQyxJQUF2QixDQUE0QixVQUE1QjtBQUNBMUIsT0FBSzBGLFNBQUwsR0FBaUIsQ0FBakI7QUFDQSxNQUFJLENBQUMzRyxPQUFMLEVBQWM7QUFDYmlCLFFBQUtZLEdBQUwsR0FBVyxFQUFYO0FBQ0E7QUFDRCxFQWJTO0FBY1Z1QixRQUFPLGVBQUNrRCxJQUFELEVBQVU7QUFDaEJoRyxJQUFFLFVBQUYsRUFBY1UsV0FBZCxDQUEwQixNQUExQjtBQUNBVixJQUFFLFlBQUYsRUFBZ0JxQyxJQUFoQixDQUFxQjJELEtBQUtTLE1BQTFCO0FBQ0E5RixPQUFLK0YsR0FBTCxDQUFTVixJQUFULEVBQWVXLElBQWYsQ0FBb0IsVUFBQ0MsR0FBRCxFQUFTO0FBQzVCO0FBQ0EsT0FBSVosS0FBS2YsSUFBTCxJQUFhLGNBQWpCLEVBQWlDO0FBQ2hDZSxTQUFLckYsSUFBTCxHQUFZLEVBQVo7QUFDQTtBQUoyQjtBQUFBO0FBQUE7O0FBQUE7QUFLNUIseUJBQWNpRyxHQUFkLDhIQUFtQjtBQUFBLFNBQVZDLENBQVU7O0FBQ2xCYixVQUFLckYsSUFBTCxDQUFVbUcsSUFBVixDQUFlRCxDQUFmO0FBQ0E7QUFQMkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFRNUJsRyxRQUFLYSxNQUFMLENBQVl3RSxJQUFaO0FBQ0EsR0FURDtBQVVBLEVBM0JTO0FBNEJWVSxNQUFLLGFBQUNWLElBQUQsRUFBVTtBQUNkLFNBQU8sSUFBSWUsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN2QyxPQUFJaEcsUUFBUSxFQUFaO0FBQ0EsT0FBSWlHLGdCQUFnQixFQUFwQjtBQUNBLE9BQUloRyxVQUFVOEUsS0FBSzlFLE9BQW5CO0FBQ0EsT0FBSThFLEtBQUtmLElBQUwsS0FBYyxPQUFsQixFQUEyQi9ELFVBQVUsT0FBVjtBQUMzQixPQUFJOEUsS0FBS2YsSUFBTCxLQUFjLE9BQWQsSUFBeUJlLEtBQUs5RSxPQUFMLEtBQWlCLFdBQTlDLEVBQTJEOEUsS0FBS1MsTUFBTCxHQUFjVCxLQUFLbUIsTUFBbkI7QUFDM0QsT0FBSXhGLE9BQU9HLEtBQVgsRUFBa0JrRSxLQUFLOUUsT0FBTCxHQUFlLE9BQWY7QUFDbEJwQixXQUFRQyxHQUFSLENBQWU0QixPQUFPOEMsVUFBUCxDQUFrQnZELE9BQWxCLENBQWYsU0FBNkM4RSxLQUFLUyxNQUFsRCxTQUE0RFQsS0FBSzlFLE9BQWpFLGVBQWtGUyxPQUFPNkMsS0FBUCxDQUFhd0IsS0FBSzlFLE9BQWxCLENBQWxGLGdCQUF1SFMsT0FBT3VDLEtBQVAsQ0FBYThCLEtBQUs5RSxPQUFsQixFQUEyQmtHLFFBQTNCLEVBQXZIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFsQyxNQUFHbUMsR0FBSCxDQUFVMUYsT0FBTzhDLFVBQVAsQ0FBa0J2RCxPQUFsQixDQUFWLFNBQXdDOEUsS0FBS1MsTUFBN0MsU0FBdURULEtBQUs5RSxPQUE1RCxlQUE2RVMsT0FBTzZDLEtBQVAsQ0FBYXdCLEtBQUs5RSxPQUFsQixDQUE3RSxlQUFpSFMsT0FBT0MsS0FBeEgsZ0JBQXdJRCxPQUFPdUMsS0FBUCxDQUFhOEIsS0FBSzlFLE9BQWxCLEVBQTJCa0csUUFBM0IsRUFBeEksc0JBQThMekYsT0FBT21ELFNBQXJNLGlCQUE0TixVQUFDOEIsR0FBRCxFQUFTO0FBQ3BPakcsU0FBSzBGLFNBQUwsSUFBa0JPLElBQUlqRyxJQUFKLENBQVM4QyxNQUEzQjtBQUNBekQsTUFBRSxtQkFBRixFQUF1QnFDLElBQXZCLENBQTRCLFVBQVUxQixLQUFLMEYsU0FBZixHQUEyQixTQUF2RDtBQUZvTztBQUFBO0FBQUE7O0FBQUE7QUFHcE8sMkJBQWNPLElBQUlqRyxJQUFsQixtSUFBd0I7QUFBQSxVQUFmMkcsQ0FBZTs7QUFDdkIsVUFBSXRCLEtBQUs5RSxPQUFMLElBQWdCLFdBQWhCLElBQStCUyxPQUFPRyxLQUExQyxFQUFpRDtBQUNoRHdGLFNBQUVDLElBQUYsR0FBUztBQUNSQyxZQUFJRixFQUFFRSxFQURFO0FBRVJDLGNBQU1ILEVBQUVHO0FBRkEsUUFBVDtBQUlBO0FBQ0QsVUFBSTlGLE9BQU9HLEtBQVgsRUFBa0J3RixFQUFFckMsSUFBRixHQUFTLE1BQVQ7QUFDbEIsVUFBSXFDLEVBQUVDLElBQU4sRUFBWTtBQUNYdEcsYUFBTTZGLElBQU4sQ0FBV1EsQ0FBWDtBQUNBLE9BRkQsTUFFTztBQUNOO0FBQ0FBLFNBQUVDLElBQUYsR0FBUztBQUNSQyxZQUFJRixFQUFFRSxFQURFO0FBRVJDLGNBQU1ILEVBQUVFO0FBRkEsUUFBVDtBQUlBLFdBQUlGLEVBQUVJLFlBQU4sRUFBb0I7QUFDbkJKLFVBQUVLLFlBQUYsR0FBaUJMLEVBQUVJLFlBQW5CO0FBQ0E7QUFDRHpHLGFBQU02RixJQUFOLENBQVdRLENBQVg7QUFDQTtBQUNEO0FBeEJtTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQXlCcE8sUUFBSVYsSUFBSWpHLElBQUosQ0FBUzhDLE1BQVQsR0FBa0IsQ0FBbEIsSUFBdUJtRCxJQUFJZ0IsTUFBSixDQUFXQyxJQUF0QyxFQUE0QztBQUMzQ0MsYUFBUWxCLElBQUlnQixNQUFKLENBQVdDLElBQW5CO0FBQ0EsS0FGRCxNQUVPO0FBQ05iLGFBQVEvRixLQUFSO0FBQ0E7QUFDRCxJQTlCRDs7QUFnQ0EsWUFBUzZHLE9BQVQsQ0FBaUJsSSxHQUFqQixFQUFpQztBQUFBLFFBQVg0RSxLQUFXLHVFQUFILENBQUc7O0FBQ2hDLFFBQUlBLFVBQVUsQ0FBZCxFQUFpQjtBQUNoQjVFLFdBQU1BLElBQUltSSxPQUFKLENBQVksV0FBWixFQUF5QixXQUFXdkQsS0FBcEMsQ0FBTjtBQUNBO0FBQ0R4RSxNQUFFZ0ksT0FBRixDQUFVcEksR0FBVixFQUFlLFVBQVVnSCxHQUFWLEVBQWU7QUFDN0JqRyxVQUFLMEYsU0FBTCxJQUFrQk8sSUFBSWpHLElBQUosQ0FBUzhDLE1BQTNCO0FBQ0F6RCxPQUFFLG1CQUFGLEVBQXVCcUMsSUFBdkIsQ0FBNEIsVUFBVTFCLEtBQUswRixTQUFmLEdBQTJCLFNBQXZEO0FBRjZCO0FBQUE7QUFBQTs7QUFBQTtBQUc3Qiw0QkFBY08sSUFBSWpHLElBQWxCLG1JQUF3QjtBQUFBLFdBQWYyRyxDQUFlOztBQUN2QixXQUFJQSxFQUFFRSxFQUFOLEVBQVU7QUFDVCxZQUFJeEIsS0FBSzlFLE9BQUwsSUFBZ0IsV0FBaEIsSUFBK0JTLE9BQU9HLEtBQTFDLEVBQWlEO0FBQ2hEd0YsV0FBRUMsSUFBRixHQUFTO0FBQ1JDLGNBQUlGLEVBQUVFLEVBREU7QUFFUkMsZ0JBQU1ILEVBQUVHO0FBRkEsVUFBVDtBQUlBO0FBQ0QsWUFBSUgsRUFBRUMsSUFBTixFQUFZO0FBQ1h0RyxlQUFNNkYsSUFBTixDQUFXUSxDQUFYO0FBQ0EsU0FGRCxNQUVPO0FBQ047QUFDQUEsV0FBRUMsSUFBRixHQUFTO0FBQ1JDLGNBQUlGLEVBQUVFLEVBREU7QUFFUkMsZ0JBQU1ILEVBQUVFO0FBRkEsVUFBVDtBQUlBLGFBQUlGLEVBQUVJLFlBQU4sRUFBb0I7QUFDbkJKLFlBQUVLLFlBQUYsR0FBaUJMLEVBQUVJLFlBQW5CO0FBQ0E7QUFDRHpHLGVBQU02RixJQUFOLENBQVdRLENBQVg7QUFDQTtBQUNEO0FBQ0Q7QUF6QjRCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBMEI3QixTQUFJVixJQUFJakcsSUFBSixDQUFTOEMsTUFBVCxHQUFrQixDQUFsQixJQUF1Qm1ELElBQUlnQixNQUFKLENBQVdDLElBQXRDLEVBQTRDO0FBQzNDQyxjQUFRbEIsSUFBSWdCLE1BQUosQ0FBV0MsSUFBbkI7QUFDQSxNQUZELE1BRU87QUFDTmIsY0FBUS9GLEtBQVI7QUFDQTtBQUNELEtBL0JELEVBK0JHZ0gsSUEvQkgsQ0ErQlEsWUFBTTtBQUNiSCxhQUFRbEksR0FBUixFQUFhLEdBQWI7QUFDQSxLQWpDRDtBQWtDQTtBQUNELEdBdEZNLENBQVA7QUF1RkEsRUFwSFM7QUFxSFY0QixTQUFRLGdCQUFDd0UsSUFBRCxFQUFVO0FBQ2pCaEcsSUFBRSxVQUFGLEVBQWNtQyxRQUFkLENBQXVCLE1BQXZCO0FBQ0FuQyxJQUFFLGFBQUYsRUFBaUJVLFdBQWpCLENBQTZCLE1BQTdCO0FBQ0FWLElBQUUsMkJBQUYsRUFBK0JrSSxPQUEvQjtBQUNBbEksSUFBRSxjQUFGLEVBQWtCbUksU0FBbEI7QUFDQXZDLE9BQUssS0FBTCxFQUFZLE9BQVosRUFBcUIsU0FBckIsRUFBZ0NDLElBQWhDO0FBQ0FsRixPQUFLWSxHQUFMLEdBQVd5RSxJQUFYO0FBQ0FyRixPQUFLZ0MsTUFBTCxDQUFZaEMsS0FBS1ksR0FBakIsRUFBc0IsSUFBdEI7QUFDQVUsS0FBR21HLEtBQUg7QUFDQSxFQTlIUztBQStIVnpGLFNBQVEsZ0JBQUMwRixPQUFELEVBQStCO0FBQUEsTUFBckJDLFFBQXFCLHVFQUFWLEtBQVU7O0FBQ3RDLE1BQUlDLGNBQWN2SSxFQUFFLFNBQUYsRUFBYXdJLElBQWIsQ0FBa0IsU0FBbEIsQ0FBbEI7QUFDQSxNQUFJQyxRQUFRekksRUFBRSxNQUFGLEVBQVV3SSxJQUFWLENBQWUsU0FBZixDQUFaO0FBQ0EsTUFBSTdHLE9BQU9vRCxjQUFQLEtBQTBCLEtBQTFCLElBQW1Dc0QsUUFBUW5ILE9BQVIsS0FBb0IsVUFBM0QsRUFBdUU7QUFDdEVtSCxXQUFRMUgsSUFBUixHQUFlMEgsUUFBUTFILElBQVIsQ0FBYWdDLE1BQWIsQ0FBb0IsZ0JBQVE7QUFDMUMsV0FBTytGLEtBQUtDLFNBQUwsS0FBbUIsS0FBMUI7QUFDQSxJQUZjLENBQWY7QUFHQTtBQUNELE1BQUlDLFVBQVVqRyxRQUFPa0csV0FBUCxpQkFBbUJSLE9BQW5CLEVBQTRCRSxXQUE1QixFQUF5Q0UsS0FBekMsNEJBQW1ESyxVQUFVbkgsT0FBT2dCLE1BQWpCLENBQW5ELEdBQWQ7QUFDQTBGLFVBQVFVLFFBQVIsR0FBbUJILE9BQW5CO0FBQ0EsTUFBSU4sYUFBYSxJQUFqQixFQUF1QjtBQUN0QjlGLFNBQU04RixRQUFOLENBQWVELE9BQWY7QUFDQSxHQUZELE1BRU87QUFDTixVQUFPQSxPQUFQO0FBQ0E7QUFDRCxFQTlJUztBQStJVjFFLFFBQU8sZUFBQ3BDLEdBQUQsRUFBUztBQUNmLE1BQUl5SCxTQUFTLEVBQWI7QUFDQWxKLFVBQVFDLEdBQVIsQ0FBWXdCLEdBQVo7QUFDQSxNQUFJWixLQUFLQyxTQUFULEVBQW9CO0FBQ25CLE9BQUlXLElBQUlMLE9BQUosSUFBZSxVQUFuQixFQUErQjtBQUM5QmxCLE1BQUVpSixJQUFGLENBQU8xSCxJQUFJd0gsUUFBWCxFQUFxQixVQUFVbEMsQ0FBVixFQUFhO0FBQ2pDLFNBQUlxQyxNQUFNO0FBQ1QsWUFBTXJDLElBQUksQ0FERDtBQUVULGNBQVEsNkJBQTZCLEtBQUtVLElBQUwsQ0FBVUMsRUFGdEM7QUFHVCxZQUFNLEtBQUtELElBQUwsQ0FBVUUsSUFIUDtBQUlULGNBQVEsNkJBQTZCLEtBQUswQixRQUpqQztBQUtULGNBQVEsS0FBS0M7QUFMSixNQUFWO0FBT0FKLFlBQU9sQyxJQUFQLENBQVlvQyxHQUFaO0FBQ0EsS0FURDtBQVVBLElBWEQsTUFXTztBQUNObEosTUFBRWlKLElBQUYsQ0FBTzFILElBQUl3SCxRQUFYLEVBQXFCLFVBQVVsQyxDQUFWLEVBQWE7QUFDakMsU0FBSXFDLE1BQU07QUFDVCxZQUFNckMsSUFBSSxDQUREO0FBRVQsY0FBUSw2QkFBNkIsS0FBS1UsSUFBTCxDQUFVQyxFQUZ0QztBQUdULFlBQU0sS0FBS0QsSUFBTCxDQUFVRSxJQUhQO0FBSVQsY0FBUSxLQUFLMEIsUUFKSjtBQUtULGNBQVEsS0FBS0U7QUFMSixNQUFWO0FBT0FMLFlBQU9sQyxJQUFQLENBQVlvQyxHQUFaO0FBQ0EsS0FURDtBQVVBO0FBQ0QsR0F4QkQsTUF3Qk87QUFDTmxKLEtBQUVpSixJQUFGLENBQU8xSCxJQUFJd0gsUUFBWCxFQUFxQixVQUFVbEMsQ0FBVixFQUFhO0FBQ2pDLFFBQUlxQyxNQUFNO0FBQ1QsV0FBTXJDLElBQUksQ0FERDtBQUVULGFBQVEsNkJBQTZCLEtBQUtVLElBQUwsQ0FBVUMsRUFGdEM7QUFHVCxXQUFNLEtBQUtELElBQUwsQ0FBVUUsSUFIUDtBQUlULFdBQU0sS0FBS3hDLElBQUwsSUFBYSxFQUpWO0FBS1QsYUFBUSxLQUFLbUUsT0FBTCxJQUFnQixLQUFLQyxLQUxwQjtBQU1ULGFBQVFDLGNBQWMsS0FBSzNCLFlBQW5CO0FBTkMsS0FBVjtBQVFBcUIsV0FBT2xDLElBQVAsQ0FBWW9DLEdBQVo7QUFDQSxJQVZEO0FBV0E7QUFDRCxTQUFPRixNQUFQO0FBQ0EsRUF4TFM7QUF5TFZsRixTQUFRLGlCQUFDeUYsSUFBRCxFQUFVO0FBQ2pCLE1BQUlDLFNBQVMsSUFBSUMsVUFBSixFQUFiOztBQUVBRCxTQUFPRSxNQUFQLEdBQWdCLFVBQVVDLEtBQVYsRUFBaUI7QUFDaEMsT0FBSUMsTUFBTUQsTUFBTUUsTUFBTixDQUFhQyxNQUF2QjtBQUNBbkosUUFBS1ksR0FBTCxHQUFXSixLQUFLQyxLQUFMLENBQVd3SSxHQUFYLENBQVg7QUFDQWpKLFFBQUthLE1BQUwsQ0FBWWIsS0FBS1ksR0FBakI7QUFDQSxHQUpEOztBQU1BaUksU0FBT08sVUFBUCxDQUFrQlIsSUFBbEI7QUFDQTtBQW5NUyxDQUFYOztBQXNNQSxJQUFJL0csUUFBUTtBQUNYOEYsV0FBVSxrQkFBQzBCLE9BQUQsRUFBYTtBQUN0QmhLLElBQUUsYUFBRixFQUFpQnNHLFNBQWpCLEdBQTZCQyxPQUE3QjtBQUNBLE1BQUkwRCxhQUFhRCxRQUFRakIsUUFBekI7QUFDQSxNQUFJbUIsUUFBUSxFQUFaO0FBQ0EsTUFBSUMsUUFBUSxFQUFaO0FBQ0EsTUFBSUMsTUFBTXBLLEVBQUUsVUFBRixFQUFjd0ksSUFBZCxDQUFtQixTQUFuQixDQUFWO0FBQ0EsTUFBSXdCLFFBQVE5SSxPQUFSLEtBQW9CLFdBQXBCLElBQW1DUyxPQUFPRyxLQUE5QyxFQUFxRDtBQUNwRG9JO0FBR0EsR0FKRCxNQUlPLElBQUlGLFFBQVE5SSxPQUFSLEtBQW9CLGFBQXhCLEVBQXVDO0FBQzdDZ0o7QUFJQSxHQUxNLE1BS0EsSUFBSUYsUUFBUTlJLE9BQVIsS0FBb0IsUUFBeEIsRUFBa0M7QUFDeENnSjtBQUdBLEdBSk0sTUFJQTtBQUNOQTtBQUtBOztBQUVELE1BQUlHLE9BQU8sMEJBQVg7QUFDQSxNQUFJMUosS0FBS1ksR0FBTCxDQUFTMEQsSUFBVCxLQUFrQixjQUF0QixFQUFzQ29GLE9BQU9ySyxFQUFFLGdCQUFGLEVBQW9CQyxHQUFwQixLQUE0QixpQkFBbkM7O0FBNUJoQjtBQUFBO0FBQUE7O0FBQUE7QUE4QnRCLHlCQUFxQmdLLFdBQVdLLE9BQVgsRUFBckIsbUlBQTJDO0FBQUE7QUFBQSxRQUFqQ0MsQ0FBaUM7QUFBQSxRQUE5QnRLLEdBQThCOztBQUMxQyxRQUFJdUssVUFBVSxFQUFkO0FBQ0EsUUFBSUosR0FBSixFQUFTO0FBQ1JJLHlEQUFpRHZLLElBQUlzSCxJQUFKLENBQVNDLEVBQTFEO0FBQ0E7QUFDRCxRQUFJaUQsZUFBWUYsSUFBRSxDQUFkLDJEQUNtQ3RLLElBQUlzSCxJQUFKLENBQVNDLEVBRDVDLDRCQUNtRWdELE9BRG5FLEdBQzZFdkssSUFBSXNILElBQUosQ0FBU0UsSUFEdEYsY0FBSjtBQUVBLFFBQUl1QyxRQUFROUksT0FBUixLQUFvQixXQUFwQixJQUFtQ1MsT0FBT0csS0FBOUMsRUFBcUQ7QUFDcEQySSx5REFBK0N4SyxJQUFJZ0YsSUFBbkQsa0JBQW1FaEYsSUFBSWdGLElBQXZFO0FBQ0EsS0FGRCxNQUVPLElBQUkrRSxRQUFROUksT0FBUixLQUFvQixhQUF4QixFQUF1QztBQUM3Q3VKLDRFQUFrRXhLLElBQUl1SCxFQUF0RSw2QkFBNkZ2SCxJQUFJb0osS0FBakcsZ0RBQ3FCQyxjQUFjckosSUFBSTBILFlBQWxCLENBRHJCO0FBRUEsS0FITSxNQUdBLElBQUlxQyxRQUFROUksT0FBUixLQUFvQixRQUF4QixFQUFrQztBQUN4Q3VKLG9CQUFZRixJQUFFLENBQWQsaUVBQzBDdEssSUFBSXNILElBQUosQ0FBU0MsRUFEbkQsNEJBQzBFdkgsSUFBSXNILElBQUosQ0FBU0UsSUFEbkYsbUNBRVN4SCxJQUFJeUssS0FGYjtBQUdBLEtBSk0sTUFJQTtBQUNOLFNBQUlDLE9BQU8xSyxJQUFJdUgsRUFBZjtBQUNBLFNBQUk3RixPQUFPb0QsY0FBWCxFQUEyQjtBQUMxQjRGLGFBQU8xSyxJQUFJa0osUUFBWDtBQUNBO0FBQ0RzQixvREFBMENKLElBQTFDLEdBQWlETSxJQUFqRCw2QkFBMEUxSyxJQUFJbUosT0FBOUUsK0JBQ01uSixJQUFJMkssVUFEViw0Q0FFcUJ0QixjQUFjckosSUFBSTBILFlBQWxCLENBRnJCO0FBR0E7QUFDRCxRQUFJa0QsY0FBWUosRUFBWixVQUFKO0FBQ0FOLGFBQVNVLEVBQVQ7QUFDQTtBQXpEcUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUEwRHRCLE1BQUlDLDBDQUFzQ1osS0FBdEMsNEJBQWtFQyxLQUFsRSxhQUFKO0FBQ0FuSyxJQUFFLGFBQUYsRUFBaUIrRixJQUFqQixDQUFzQixFQUF0QixFQUEwQjdGLE1BQTFCLENBQWlDNEssTUFBakM7O0FBR0FDOztBQUVBLFdBQVNBLE1BQVQsR0FBa0I7QUFDakJ2TCxXQUFRUSxFQUFFLGFBQUYsRUFBaUJzRyxTQUFqQixDQUEyQjtBQUNsQyxrQkFBYyxJQURvQjtBQUVsQyxpQkFBYSxJQUZxQjtBQUdsQyxvQkFBZ0I7QUFIa0IsSUFBM0IsQ0FBUjs7QUFNQXRHLEtBQUUsYUFBRixFQUFpQnVDLEVBQWpCLENBQW9CLG1CQUFwQixFQUF5QyxZQUFZO0FBQ3BEL0MsVUFDRXdMLE9BREYsQ0FDVSxDQURWLEVBRUV4SyxNQUZGLENBRVMsS0FBS3lLLEtBRmQsRUFHRUMsSUFIRjtBQUlBLElBTEQ7QUFNQWxMLEtBQUUsZ0JBQUYsRUFBb0J1QyxFQUFwQixDQUF1QixtQkFBdkIsRUFBNEMsWUFBWTtBQUN2RC9DLFVBQ0V3TCxPQURGLENBQ1UsQ0FEVixFQUVFeEssTUFGRixDQUVTLEtBQUt5SyxLQUZkLEVBR0VDLElBSEY7QUFJQXZKLFdBQU9nQixNQUFQLENBQWNnQyxJQUFkLEdBQXFCLEtBQUtzRyxLQUExQjtBQUNBLElBTkQ7QUFPQTtBQUNELEVBdEZVO0FBdUZYeEksT0FBTSxnQkFBTTtBQUNYOUIsT0FBS2dDLE1BQUwsQ0FBWWhDLEtBQUtZLEdBQWpCLEVBQXNCLElBQXRCO0FBQ0E7QUF6RlUsQ0FBWjs7QUE0RkEsSUFBSVEsU0FBUztBQUNacEIsT0FBTSxFQURNO0FBRVp3SyxRQUFPLEVBRks7QUFHWkMsTUFBSyxDQUhPO0FBSVpDLFNBQVEsS0FKSTtBQUtaQyxPQUFNLEVBTE07QUFNWnRKLE9BQU0sZ0JBQU07QUFDWCxNQUFJa0ksUUFBUWxLLEVBQUUsbUJBQUYsRUFBdUIrRixJQUF2QixFQUFaO0FBQ0EvRixJQUFFLHdCQUFGLEVBQTRCK0YsSUFBNUIsQ0FBaUNtRSxLQUFqQztBQUNBbEssSUFBRSx3QkFBRixFQUE0QitGLElBQTVCLENBQWlDLEVBQWpDO0FBQ0FoRSxTQUFPcEIsSUFBUCxHQUFjQSxLQUFLZ0MsTUFBTCxDQUFZaEMsS0FBS1ksR0FBakIsQ0FBZDtBQUNBUSxTQUFPb0osS0FBUCxHQUFlLEVBQWY7QUFDQXBKLFNBQU91SixJQUFQLEdBQWMsRUFBZDtBQUNBdkosU0FBT3FKLEdBQVAsR0FBYSxDQUFiO0FBQ0EsTUFBSXBMLEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLE1BQTZCLEVBQWpDLEVBQXFDO0FBQ3BDdUMsU0FBTUMsSUFBTjtBQUNBO0FBQ0QsTUFBSXpDLEVBQUUsWUFBRixFQUFnQmtDLFFBQWhCLENBQXlCLFFBQXpCLENBQUosRUFBd0M7QUFDdkNILFVBQU9zSixNQUFQLEdBQWdCLElBQWhCO0FBQ0FyTCxLQUFFLHFCQUFGLEVBQXlCaUosSUFBekIsQ0FBOEIsWUFBWTtBQUN6QyxRQUFJc0MsSUFBSUMsU0FBU3hMLEVBQUUsSUFBRixFQUFReUwsSUFBUixDQUFhLHNCQUFiLEVBQXFDeEwsR0FBckMsRUFBVCxDQUFSO0FBQ0EsUUFBSXlMLElBQUkxTCxFQUFFLElBQUYsRUFBUXlMLElBQVIsQ0FBYSxvQkFBYixFQUFtQ3hMLEdBQW5DLEVBQVI7QUFDQSxRQUFJc0wsSUFBSSxDQUFSLEVBQVc7QUFDVnhKLFlBQU9xSixHQUFQLElBQWNJLFNBQVNELENBQVQsQ0FBZDtBQUNBeEosWUFBT3VKLElBQVAsQ0FBWXhFLElBQVosQ0FBaUI7QUFDaEIsY0FBUTRFLENBRFE7QUFFaEIsYUFBT0g7QUFGUyxNQUFqQjtBQUlBO0FBQ0QsSUFWRDtBQVdBLEdBYkQsTUFhTztBQUNOeEosVUFBT3FKLEdBQVAsR0FBYXBMLEVBQUUsVUFBRixFQUFjQyxHQUFkLEVBQWI7QUFDQTtBQUNEOEIsU0FBTzRKLEVBQVA7QUFDQSxFQWxDVztBQW1DWkEsS0FBSSxjQUFNO0FBQ1Q1SixTQUFPb0osS0FBUCxHQUFlUyxlQUFlN0osT0FBT3BCLElBQVAsQ0FBWW9JLFFBQVosQ0FBcUJ0RixNQUFwQyxFQUE0Q29JLE1BQTVDLENBQW1ELENBQW5ELEVBQXNEOUosT0FBT3FKLEdBQTdELENBQWY7QUFDQSxNQUFJTixTQUFTLEVBQWI7QUFDQS9JLFNBQU9vSixLQUFQLENBQWFXLEdBQWIsQ0FBaUIsVUFBQzdMLEdBQUQsRUFBTThMLEtBQU4sRUFBZ0I7QUFDaENqQixhQUFVLGtCQUFrQmlCLFFBQVEsQ0FBMUIsSUFBK0IsS0FBL0IsR0FBdUMvTCxFQUFFLGFBQUYsRUFBaUJzRyxTQUFqQixHQUE2QjBGLElBQTdCLENBQWtDO0FBQ2xGeEwsWUFBUTtBQUQwRSxJQUFsQyxFQUU5Q3lMLEtBRjhDLEdBRXRDaE0sR0FGc0MsRUFFakNpTSxTQUZOLEdBRWtCLE9BRjVCO0FBR0EsR0FKRDtBQUtBbE0sSUFBRSx3QkFBRixFQUE0QitGLElBQTVCLENBQWlDK0UsTUFBakM7QUFDQTlLLElBQUUsMkJBQUYsRUFBK0JtQyxRQUEvQixDQUF3QyxTQUF4Qzs7QUFFQSxNQUFJSixPQUFPc0osTUFBWCxFQUFtQjtBQUNsQixPQUFJYyxNQUFNLENBQVY7QUFDQSxRQUFLLElBQUlDLENBQVQsSUFBY3JLLE9BQU91SixJQUFyQixFQUEyQjtBQUMxQixRQUFJZSxNQUFNck0sRUFBRSxxQkFBRixFQUF5QnNNLEVBQXpCLENBQTRCSCxHQUE1QixDQUFWO0FBQ0FuTSx3RUFBK0MrQixPQUFPdUosSUFBUCxDQUFZYyxDQUFaLEVBQWUzRSxJQUE5RCxzQkFBOEUxRixPQUFPdUosSUFBUCxDQUFZYyxDQUFaLEVBQWVoQixHQUE3RiwrQkFBdUhtQixZQUF2SCxDQUFvSUYsR0FBcEk7QUFDQUYsV0FBUXBLLE9BQU91SixJQUFQLENBQVljLENBQVosRUFBZWhCLEdBQWYsR0FBcUIsQ0FBN0I7QUFDQTtBQUNEcEwsS0FBRSxZQUFGLEVBQWdCVSxXQUFoQixDQUE0QixRQUE1QjtBQUNBVixLQUFFLFdBQUYsRUFBZVUsV0FBZixDQUEyQixTQUEzQjtBQUNBVixLQUFFLGNBQUYsRUFBa0JVLFdBQWxCLENBQThCLFFBQTlCO0FBQ0E7QUFDRFYsSUFBRSxZQUFGLEVBQWdCRyxNQUFoQixDQUF1QixJQUF2QjtBQUNBLEVBMURXO0FBMkRacU0sZ0JBQWUseUJBQU07QUFDcEIsTUFBSUMsS0FBSyxFQUFUO0FBQ0EsTUFBSUMsU0FBUyxFQUFiO0FBQ0ExTSxJQUFFLHFCQUFGLEVBQXlCaUosSUFBekIsQ0FBOEIsVUFBVThDLEtBQVYsRUFBaUI5TCxHQUFqQixFQUFzQjtBQUNuRCxPQUFJa0wsUUFBUSxFQUFaO0FBQ0EsT0FBSWxMLElBQUkwTSxZQUFKLENBQWlCLE9BQWpCLENBQUosRUFBK0I7QUFDOUJ4QixVQUFNeUIsVUFBTixHQUFtQixLQUFuQjtBQUNBekIsVUFBTTFELElBQU4sR0FBYXpILEVBQUVDLEdBQUYsRUFBT3dMLElBQVAsQ0FBWSxJQUFaLEVBQWtCYSxFQUFsQixDQUFxQixDQUFyQixFQUF3QmIsSUFBeEIsQ0FBNkIsR0FBN0IsRUFBa0NwSixJQUFsQyxFQUFiO0FBQ0E4SSxVQUFNL0UsTUFBTixHQUFlcEcsRUFBRUMsR0FBRixFQUFPd0wsSUFBUCxDQUFZLElBQVosRUFBa0JhLEVBQWxCLENBQXFCLENBQXJCLEVBQXdCYixJQUF4QixDQUE2QixHQUE3QixFQUFrQ29CLElBQWxDLENBQXVDLE1BQXZDLEVBQStDOUUsT0FBL0MsQ0FBdUQsMEJBQXZELEVBQW1GLEVBQW5GLENBQWY7QUFDQW9ELFVBQU0vQixPQUFOLEdBQWdCcEosRUFBRUMsR0FBRixFQUFPd0wsSUFBUCxDQUFZLElBQVosRUFBa0JhLEVBQWxCLENBQXFCLENBQXJCLEVBQXdCYixJQUF4QixDQUE2QixHQUE3QixFQUFrQ3BKLElBQWxDLEVBQWhCO0FBQ0E4SSxVQUFNUixJQUFOLEdBQWEzSyxFQUFFQyxHQUFGLEVBQU93TCxJQUFQLENBQVksSUFBWixFQUFrQmEsRUFBbEIsQ0FBcUIsQ0FBckIsRUFBd0JiLElBQXhCLENBQTZCLEdBQTdCLEVBQWtDb0IsSUFBbEMsQ0FBdUMsTUFBdkMsQ0FBYjtBQUNBMUIsVUFBTTJCLElBQU4sR0FBYTlNLEVBQUVDLEdBQUYsRUFBT3dMLElBQVAsQ0FBWSxJQUFaLEVBQWtCYSxFQUFsQixDQUFxQnRNLEVBQUVDLEdBQUYsRUFBT3dMLElBQVAsQ0FBWSxJQUFaLEVBQWtCaEksTUFBbEIsR0FBMkIsQ0FBaEQsRUFBbURwQixJQUFuRCxFQUFiO0FBQ0EsSUFQRCxNQU9PO0FBQ044SSxVQUFNeUIsVUFBTixHQUFtQixJQUFuQjtBQUNBekIsVUFBTTFELElBQU4sR0FBYXpILEVBQUVDLEdBQUYsRUFBT3dMLElBQVAsQ0FBWSxJQUFaLEVBQWtCcEosSUFBbEIsRUFBYjtBQUNBO0FBQ0RxSyxVQUFPNUYsSUFBUCxDQUFZcUUsS0FBWjtBQUNBLEdBZEQ7QUFIb0I7QUFBQTtBQUFBOztBQUFBO0FBa0JwQix5QkFBY3VCLE1BQWQsbUlBQXNCO0FBQUEsUUFBYjdGLENBQWE7O0FBQ3JCLFFBQUlBLEVBQUUrRixVQUFGLEtBQWlCLElBQXJCLEVBQTJCO0FBQzFCSCx3Q0FBK0I1RixFQUFFWSxJQUFqQztBQUNBLEtBRkQsTUFFTztBQUNOZ0YsaUVBQ29DNUYsRUFBRVQsTUFEdEMsa0VBQ3FHUyxFQUFFVCxNQUR2Ryx3SUFHb0RTLEVBQUVULE1BSHRELDZCQUdpRlMsRUFBRVksSUFIbkYseURBSThCWixFQUFFOEQsSUFKaEMsNkJBSXlEOUQsRUFBRXVDLE9BSjNELHNEQUsyQnZDLEVBQUU4RCxJQUw3Qiw2QkFLc0Q5RCxFQUFFaUcsSUFMeEQ7QUFRQTtBQUNEO0FBL0JtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWdDcEI5TSxJQUFFLGVBQUYsRUFBbUJFLE1BQW5CLENBQTBCdU0sRUFBMUI7QUFDQXpNLElBQUUsWUFBRixFQUFnQm1DLFFBQWhCLENBQXlCLE1BQXpCO0FBQ0EsRUE3Rlc7QUE4Rlo0SyxrQkFBaUIsMkJBQU07QUFDdEIvTSxJQUFFLFlBQUYsRUFBZ0JVLFdBQWhCLENBQTRCLE1BQTVCO0FBQ0FWLElBQUUsZUFBRixFQUFtQmdOLEtBQW5CO0FBQ0E7QUFqR1csQ0FBYjs7QUFvR0EsSUFBSWhILE9BQU87QUFDVkEsT0FBTSxFQURJO0FBRVZoRSxPQUFNLGNBQUNpRCxJQUFELEVBQVU7QUFDZnRELFNBQU9tRCxTQUFQLEdBQW1CLEVBQW5CO0FBQ0FrQixPQUFLQSxJQUFMLEdBQVksRUFBWjtBQUNBckYsT0FBS3FCLElBQUw7QUFDQWtELEtBQUdtQyxHQUFILENBQU8sS0FBUCxFQUFjLFVBQVVULEdBQVYsRUFBZTtBQUM1QmpHLFFBQUt5RixNQUFMLEdBQWNRLElBQUlZLEVBQWxCO0FBQ0EsT0FBSTVILE1BQU0sRUFBVjtBQUNBLE9BQUlGLE9BQUosRUFBYTtBQUNaRSxVQUFNb0csS0FBSzlDLE1BQUwsQ0FBWWxELEVBQUUsbUJBQUYsRUFBdUJDLEdBQXZCLEVBQVosQ0FBTjtBQUNBRCxNQUFFLG1CQUFGLEVBQXVCQyxHQUF2QixDQUEyQixFQUEzQjtBQUNBLElBSEQsTUFHTztBQUNOTCxVQUFNb0csS0FBSzlDLE1BQUwsQ0FBWWxELEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQVosQ0FBTjtBQUNBO0FBQ0QsT0FBSUwsSUFBSWEsT0FBSixDQUFZLE9BQVosTUFBeUIsQ0FBQyxDQUExQixJQUErQmIsSUFBSWEsT0FBSixDQUFZLEdBQVosSUFBbUIsQ0FBdEQsRUFBeUQ7QUFDeERiLFVBQU1BLElBQUlxTixTQUFKLENBQWMsQ0FBZCxFQUFpQnJOLElBQUlhLE9BQUosQ0FBWSxHQUFaLENBQWpCLENBQU47QUFDQTtBQUNEdUYsUUFBS1UsR0FBTCxDQUFTOUcsR0FBVCxFQUFjcUYsSUFBZCxFQUFvQjBCLElBQXBCLENBQXlCLFVBQUNYLElBQUQsRUFBVTtBQUNsQ3JGLFNBQUttQyxLQUFMLENBQVdrRCxJQUFYO0FBQ0EsSUFGRDtBQUdBO0FBQ0EsR0FoQkQ7QUFpQkEsRUF2QlM7QUF3QlZVLE1BQUssYUFBQzlHLEdBQUQsRUFBTXFGLElBQU4sRUFBZTtBQUNuQixTQUFPLElBQUk4QixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3ZDLE9BQUloQyxRQUFRLGNBQVosRUFBNEI7QUFDM0IsUUFBSWlJLFVBQVV0TixHQUFkO0FBQ0EsUUFBSXNOLFFBQVF6TSxPQUFSLENBQWdCLEdBQWhCLElBQXVCLENBQTNCLEVBQThCO0FBQzdCeU0sZUFBVUEsUUFBUUQsU0FBUixDQUFrQixDQUFsQixFQUFxQkMsUUFBUXpNLE9BQVIsQ0FBZ0IsR0FBaEIsQ0FBckIsQ0FBVjtBQUNBO0FBQ0R5RSxPQUFHbUMsR0FBSCxPQUFXNkYsT0FBWCxFQUFzQixVQUFVdEcsR0FBVixFQUFlO0FBQ3BDLFNBQUl1RyxNQUFNO0FBQ1QxRyxjQUFRRyxJQUFJd0csU0FBSixDQUFjNUYsRUFEYjtBQUVUdkMsWUFBTUEsSUFGRztBQUdUL0QsZUFBUztBQUhBLE1BQVY7QUFLQVMsWUFBTzZDLEtBQVAsQ0FBYSxVQUFiLElBQTJCLElBQTNCO0FBQ0E3QyxZQUFPQyxLQUFQLEdBQWUsRUFBZjtBQUNBb0YsYUFBUW1HLEdBQVI7QUFDQSxLQVREO0FBVUEsSUFmRCxNQWVPO0FBQ04sUUFBSUUsUUFBUSxTQUFaO0FBQ0EsUUFBSUMsU0FBUzFOLElBQUkyTixNQUFKLENBQVczTixJQUFJYSxPQUFKLENBQVksR0FBWixFQUFpQixFQUFqQixJQUF1QixDQUFsQyxFQUFxQyxHQUFyQyxDQUFiO0FBQ0E7QUFDQSxRQUFJcUosU0FBU3dELE9BQU9FLEtBQVAsQ0FBYUgsS0FBYixDQUFiO0FBQ0EsUUFBSUksVUFBVXpILEtBQUswSCxTQUFMLENBQWU5TixHQUFmLENBQWQ7QUFDQW9HLFNBQUsySCxXQUFMLENBQWlCL04sR0FBakIsRUFBc0I2TixPQUF0QixFQUErQjlHLElBQS9CLENBQW9DLFVBQUNhLEVBQUQsRUFBUTtBQUMzQyxTQUFJQSxPQUFPLFVBQVgsRUFBdUI7QUFDdEJpRyxnQkFBVSxVQUFWO0FBQ0FqRyxXQUFLN0csS0FBS3lGLE1BQVY7QUFDQTtBQUNELFNBQUkrRyxNQUFNO0FBQ1RTLGNBQVFwRyxFQURDO0FBRVR2QyxZQUFNd0ksT0FGRztBQUdUdk0sZUFBUytELElBSEE7QUFJVHRFLFlBQU07QUFKRyxNQUFWO0FBTUEsU0FBSWpCLE9BQUosRUFBYXlOLElBQUl4TSxJQUFKLEdBQVdBLEtBQUtZLEdBQUwsQ0FBU1osSUFBcEIsQ0FYOEIsQ0FXSjtBQUN2QyxTQUFJOE0sWUFBWSxVQUFoQixFQUE0QjtBQUMzQixVQUFJM0ssUUFBUWxELElBQUlhLE9BQUosQ0FBWSxPQUFaLENBQVo7QUFDQSxVQUFJcUMsU0FBUyxDQUFiLEVBQWdCO0FBQ2YsV0FBSUMsTUFBTW5ELElBQUlhLE9BQUosQ0FBWSxHQUFaLEVBQWlCcUMsS0FBakIsQ0FBVjtBQUNBcUssV0FBSWhHLE1BQUosR0FBYXZILElBQUlxTixTQUFKLENBQWNuSyxRQUFRLENBQXRCLEVBQXlCQyxHQUF6QixDQUFiO0FBQ0EsT0FIRCxNQUdPO0FBQ04sV0FBSUQsU0FBUWxELElBQUlhLE9BQUosQ0FBWSxRQUFaLENBQVo7QUFDQTBNLFdBQUloRyxNQUFKLEdBQWF2SCxJQUFJcU4sU0FBSixDQUFjbkssU0FBUSxDQUF0QixFQUF5QmxELElBQUk2RCxNQUE3QixDQUFiO0FBQ0E7QUFDRCxVQUFJb0ssUUFBUWpPLElBQUlhLE9BQUosQ0FBWSxTQUFaLENBQVo7QUFDQSxVQUFJb04sU0FBUyxDQUFiLEVBQWdCO0FBQ2ZWLFdBQUloRyxNQUFKLEdBQWEyQyxPQUFPLENBQVAsQ0FBYjtBQUNBO0FBQ0RxRCxVQUFJMUcsTUFBSixHQUFhMEcsSUFBSVMsTUFBSixHQUFhLEdBQWIsR0FBbUJULElBQUloRyxNQUFwQztBQUNBSCxjQUFRbUcsR0FBUjtBQUNBLE1BZkQsTUFlTyxJQUFJTSxZQUFZLE1BQWhCLEVBQXdCO0FBQzlCTixVQUFJMUcsTUFBSixHQUFhN0csSUFBSW1JLE9BQUosQ0FBWSxLQUFaLEVBQW1CLEVBQW5CLENBQWI7QUFDQWYsY0FBUW1HLEdBQVI7QUFDQSxNQUhNLE1BR0E7QUFDTixVQUFJTSxZQUFZLE9BQWhCLEVBQXlCO0FBQ3hCLFdBQUkzRCxPQUFPckcsTUFBUCxJQUFpQixDQUFyQixFQUF3QjtBQUN2QjtBQUNBMEosWUFBSWpNLE9BQUosR0FBYyxNQUFkO0FBQ0FpTSxZQUFJMUcsTUFBSixHQUFhcUQsT0FBTyxDQUFQLENBQWI7QUFDQTlDLGdCQUFRbUcsR0FBUjtBQUNBLFFBTEQsTUFLTztBQUNOO0FBQ0FBLFlBQUkxRyxNQUFKLEdBQWFxRCxPQUFPLENBQVAsQ0FBYjtBQUNBOUMsZ0JBQVFtRyxHQUFSO0FBQ0E7QUFDRCxPQVhELE1BV08sSUFBSU0sWUFBWSxPQUFoQixFQUF5QjtBQUMvQixXQUFJMU0sR0FBR2lFLFVBQVAsRUFBbUI7QUFDbEJtSSxZQUFJaEcsTUFBSixHQUFhMkMsT0FBT0EsT0FBT3JHLE1BQVAsR0FBZ0IsQ0FBdkIsQ0FBYjtBQUNBMEosWUFBSVMsTUFBSixHQUFhOUQsT0FBTyxDQUFQLENBQWI7QUFDQXFELFlBQUkxRyxNQUFKLEdBQWEwRyxJQUFJUyxNQUFKLEdBQWEsR0FBYixHQUFtQlQsSUFBSWhHLE1BQXBDO0FBQ0FILGdCQUFRbUcsR0FBUjtBQUNBLFFBTEQsTUFLTztBQUNOdkgsYUFBSztBQUNKRSxnQkFBTyxpQkFESDtBQUVKQyxlQUFNLCtHQUZGO0FBR0pkLGVBQU07QUFIRixTQUFMLEVBSUdZLElBSkg7QUFLQTtBQUNELE9BYk0sTUFhQSxJQUFJNEgsWUFBWSxPQUFoQixFQUF5QjtBQUMvQixXQUFJSixTQUFRLFNBQVo7QUFDQSxXQUFJdkQsVUFBU2xLLElBQUk0TixLQUFKLENBQVVILE1BQVYsQ0FBYjtBQUNBRixXQUFJaEcsTUFBSixHQUFhMkMsUUFBT0EsUUFBT3JHLE1BQVAsR0FBZ0IsQ0FBdkIsQ0FBYjtBQUNBMEosV0FBSTFHLE1BQUosR0FBYTBHLElBQUlTLE1BQUosR0FBYSxHQUFiLEdBQW1CVCxJQUFJaEcsTUFBcEM7QUFDQUgsZUFBUW1HLEdBQVI7QUFDQSxPQU5NLE1BTUEsSUFBSU0sWUFBWSxPQUFoQixFQUF5QjtBQUMvQk4sV0FBSWhHLE1BQUosR0FBYTJDLE9BQU9BLE9BQU9yRyxNQUFQLEdBQWdCLENBQXZCLENBQWI7QUFDQXlCLFVBQUdtQyxHQUFILE9BQVc4RixJQUFJaEcsTUFBZiwwQkFBNEMsVUFBVVAsR0FBVixFQUFlO0FBQzFELFlBQUlBLElBQUlrSCxXQUFKLEtBQW9CLE1BQXhCLEVBQWdDO0FBQy9CWCxhQUFJMUcsTUFBSixHQUFhMEcsSUFBSWhHLE1BQWpCO0FBQ0EsU0FGRCxNQUVPO0FBQ05nRyxhQUFJMUcsTUFBSixHQUFhMEcsSUFBSVMsTUFBSixHQUFhLEdBQWIsR0FBbUJULElBQUloRyxNQUFwQztBQUNBO0FBQ0RILGdCQUFRbUcsR0FBUjtBQUNBLFFBUEQ7QUFRQSxPQVZNLE1BVUE7QUFDTixXQUFJckQsT0FBT3JHLE1BQVAsSUFBaUIsQ0FBakIsSUFBc0JxRyxPQUFPckcsTUFBUCxJQUFpQixDQUEzQyxFQUE4QztBQUM3QzBKLFlBQUloRyxNQUFKLEdBQWEyQyxPQUFPLENBQVAsQ0FBYjtBQUNBcUQsWUFBSTFHLE1BQUosR0FBYTBHLElBQUlTLE1BQUosR0FBYSxHQUFiLEdBQW1CVCxJQUFJaEcsTUFBcEM7QUFDQUgsZ0JBQVFtRyxHQUFSO0FBQ0EsUUFKRCxNQUlPO0FBQ04sWUFBSU0sWUFBWSxRQUFoQixFQUEwQjtBQUN6Qk4sYUFBSWhHLE1BQUosR0FBYTJDLE9BQU8sQ0FBUCxDQUFiO0FBQ0FxRCxhQUFJUyxNQUFKLEdBQWE5RCxPQUFPQSxPQUFPckcsTUFBUCxHQUFnQixDQUF2QixDQUFiO0FBQ0EsU0FIRCxNQUdPO0FBQ04wSixhQUFJaEcsTUFBSixHQUFhMkMsT0FBT0EsT0FBT3JHLE1BQVAsR0FBZ0IsQ0FBdkIsQ0FBYjtBQUNBO0FBQ0QwSixZQUFJMUcsTUFBSixHQUFhMEcsSUFBSVMsTUFBSixHQUFhLEdBQWIsR0FBbUJULElBQUloRyxNQUFwQztBQUNBakMsV0FBR21DLEdBQUgsT0FBVzhGLElBQUlTLE1BQWYsMkJBQTZDLFVBQVVoSCxHQUFWLEVBQWU7QUFDM0QsYUFBSUEsSUFBSW1ILEtBQVIsRUFBZTtBQUNkL0csa0JBQVFtRyxHQUFSO0FBQ0EsVUFGRCxNQUVPO0FBQ04sY0FBSXZHLElBQUlvSCxZQUFSLEVBQXNCO0FBQ3JCck0sa0JBQU9tRCxTQUFQLEdBQW1COEIsSUFBSW9ILFlBQXZCO0FBQ0E7QUFDRGhILGtCQUFRbUcsR0FBUjtBQUNBO0FBQ0QsU0FURDtBQVVBO0FBQ0Q7QUFDRDtBQUNELEtBakdEO0FBa0dBO0FBQ0QsR0F6SE0sQ0FBUDtBQTBIQSxFQW5KUztBQW9KVk8sWUFBVyxtQkFBQ1IsT0FBRCxFQUFhO0FBQ3ZCLE1BQUlBLFFBQVF6TSxPQUFSLENBQWdCLE9BQWhCLEtBQTRCLENBQWhDLEVBQW1DO0FBQ2xDLE9BQUl5TSxRQUFRek0sT0FBUixDQUFnQixXQUFoQixLQUFnQyxDQUFwQyxFQUF1QztBQUN0QyxXQUFPLFFBQVA7QUFDQSxJQUZELE1BRU87QUFDTixXQUFPLFVBQVA7QUFDQTtBQUNEO0FBQ0QsTUFBSXlNLFFBQVF6TSxPQUFSLENBQWdCLFVBQWhCLEtBQStCLENBQW5DLEVBQXNDO0FBQ3JDLFVBQU8sT0FBUDtBQUNBO0FBQ0QsTUFBSXlNLFFBQVF6TSxPQUFSLENBQWdCLFFBQWhCLEtBQTZCLENBQWpDLEVBQW9DO0FBQ25DLFVBQU8sT0FBUDtBQUNBO0FBQ0QsTUFBSXlNLFFBQVF6TSxPQUFSLENBQWdCLFVBQWhCLEtBQStCLENBQW5DLEVBQXNDO0FBQ3JDLFVBQU8sT0FBUDtBQUNBO0FBQ0QsTUFBSXlNLFFBQVF6TSxPQUFSLENBQWdCLFVBQWhCLEtBQStCLENBQW5DLEVBQXNDO0FBQ3JDLFVBQU8sT0FBUDtBQUNBO0FBQ0QsTUFBSXlNLFFBQVF6TSxPQUFSLENBQWdCLEdBQWhCLEtBQXdCLENBQTVCLEVBQStCO0FBQzlCLFVBQU8sTUFBUDtBQUNBO0FBQ0QsU0FBTyxRQUFQO0FBQ0EsRUE1S1M7QUE2S1ZrTixjQUFhLHFCQUFDVCxPQUFELEVBQVVqSSxJQUFWLEVBQW1CO0FBQy9CLFNBQU8sSUFBSThCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdkMsT0FBSW5FLFFBQVFvSyxRQUFRek0sT0FBUixDQUFnQixjQUFoQixJQUFrQyxFQUE5QztBQUNBLE9BQUlzQyxNQUFNbUssUUFBUXpNLE9BQVIsQ0FBZ0IsR0FBaEIsRUFBcUJxQyxLQUFyQixDQUFWO0FBQ0EsT0FBSXVLLFFBQVEsU0FBWjtBQUNBLE9BQUl0SyxNQUFNLENBQVYsRUFBYTtBQUNaLFFBQUltSyxRQUFRek0sT0FBUixDQUFnQixPQUFoQixLQUE0QixDQUFoQyxFQUFtQztBQUNsQyxTQUFJd0UsU0FBUyxRQUFiLEVBQXVCO0FBQ3RCK0IsY0FBUSxRQUFSO0FBQ0EsTUFGRCxNQUVPO0FBQ05BLGNBQVEsVUFBUjtBQUNBO0FBQ0QsS0FORCxNQU1PO0FBQ05BLGFBQVFrRyxRQUFRTSxLQUFSLENBQWNILEtBQWQsRUFBcUIsQ0FBckIsQ0FBUjtBQUNBO0FBQ0QsSUFWRCxNQVVPO0FBQ04sUUFBSTNJLFFBQVF3SSxRQUFRek0sT0FBUixDQUFnQixVQUFoQixDQUFaO0FBQ0EsUUFBSWtKLFFBQVF1RCxRQUFRek0sT0FBUixDQUFnQixVQUFoQixDQUFaO0FBQ0EsUUFBSWlFLFNBQVMsQ0FBYixFQUFnQjtBQUNmNUIsYUFBUTRCLFFBQVEsQ0FBaEI7QUFDQTNCLFdBQU1tSyxRQUFRek0sT0FBUixDQUFnQixHQUFoQixFQUFxQnFDLEtBQXJCLENBQU47QUFDQSxTQUFJbUwsU0FBUyxTQUFiO0FBQ0EsU0FBSUMsT0FBT2hCLFFBQVFELFNBQVIsQ0FBa0JuSyxLQUFsQixFQUF5QkMsR0FBekIsQ0FBWDtBQUNBLFNBQUlrTCxPQUFPRSxJQUFQLENBQVlELElBQVosQ0FBSixFQUF1QjtBQUN0QmxILGNBQVFrSCxJQUFSO0FBQ0EsTUFGRCxNQUVPO0FBQ05sSCxjQUFRLE9BQVI7QUFDQTtBQUNELEtBVkQsTUFVTyxJQUFJMkMsU0FBUyxDQUFiLEVBQWdCO0FBQ3RCM0MsYUFBUSxPQUFSO0FBQ0EsS0FGTSxNQUVBO0FBQ04sU0FBSW9ILFdBQVdsQixRQUFRRCxTQUFSLENBQWtCbkssS0FBbEIsRUFBeUJDLEdBQXpCLENBQWY7QUFDQW1DLFFBQUdtQyxHQUFILE9BQVcrRyxRQUFYLDJCQUEyQyxVQUFVeEgsR0FBVixFQUFlO0FBQ3pELFVBQUlBLElBQUltSCxLQUFSLEVBQWU7QUFDZC9HLGVBQVEsVUFBUjtBQUNBLE9BRkQsTUFFTztBQUNOLFdBQUlKLElBQUlvSCxZQUFSLEVBQXNCO0FBQ3JCck0sZUFBT21ELFNBQVAsR0FBbUI4QixJQUFJb0gsWUFBdkI7QUFDQTtBQUNEaEgsZUFBUUosSUFBSVksRUFBWjtBQUNBO0FBQ0QsTUFURDtBQVVBO0FBQ0Q7QUFDRCxHQTNDTSxDQUFQO0FBNENBLEVBMU5TO0FBMk5WdEUsU0FBUSxnQkFBQ3RELEdBQUQsRUFBUztBQUNoQixNQUFJQSxJQUFJYSxPQUFKLENBQVksd0JBQVosS0FBeUMsQ0FBN0MsRUFBZ0Q7QUFDL0NiLFNBQU1BLElBQUlxTixTQUFKLENBQWMsQ0FBZCxFQUFpQnJOLElBQUlhLE9BQUosQ0FBWSxHQUFaLENBQWpCLENBQU47QUFDQSxVQUFPYixHQUFQO0FBQ0EsR0FIRCxNQUdPO0FBQ04sVUFBT0EsR0FBUDtBQUNBO0FBQ0Q7QUFsT1MsQ0FBWDs7QUFxT0EsSUFBSStDLFVBQVM7QUFDWmtHLGNBQWEscUJBQUNtQixPQUFELEVBQVV6QixXQUFWLEVBQXVCRSxLQUF2QixFQUE4QjlELElBQTlCLEVBQW9DL0IsS0FBcEMsRUFBMkNLLFNBQTNDLEVBQXNERSxPQUF0RCxFQUFrRTtBQUM5RSxNQUFJeEMsT0FBT3FKLFFBQVFySixJQUFuQjtBQUNBLE1BQUlnRSxTQUFTLEVBQWIsRUFBaUI7QUFDaEJoRSxVQUFPZ0MsUUFBT2dDLElBQVAsQ0FBWWhFLElBQVosRUFBa0JnRSxJQUFsQixDQUFQO0FBQ0E7QUFDRCxNQUFJOEQsS0FBSixFQUFXO0FBQ1Y5SCxVQUFPZ0MsUUFBTzBMLEdBQVAsQ0FBVzFOLElBQVgsQ0FBUDtBQUNBO0FBQ0QsTUFBSXFKLFFBQVE5SSxPQUFSLEtBQW9CLFdBQXBCLElBQW1DUyxPQUFPRyxLQUE5QyxFQUFxRDtBQUNwRG5CLFVBQU9nQyxRQUFPQyxLQUFQLENBQWFqQyxJQUFiLEVBQW1CaUMsS0FBbkIsQ0FBUDtBQUNBLEdBRkQsTUFFTyxJQUFJb0gsUUFBUTlJLE9BQVIsS0FBb0IsUUFBeEIsRUFBa0MsQ0FFeEMsQ0FGTSxNQUVBO0FBQ05QLFVBQU9nQyxRQUFPbUssSUFBUCxDQUFZbk0sSUFBWixFQUFrQnNDLFNBQWxCLEVBQTZCRSxPQUE3QixDQUFQO0FBQ0E7QUFDRCxNQUFJb0YsV0FBSixFQUFpQjtBQUNoQjVILFVBQU9nQyxRQUFPMkwsTUFBUCxDQUFjM04sSUFBZCxDQUFQO0FBQ0E7O0FBRUQsU0FBT0EsSUFBUDtBQUNBLEVBckJXO0FBc0JaMk4sU0FBUSxnQkFBQzNOLElBQUQsRUFBVTtBQUNqQixNQUFJNE4sU0FBUyxFQUFiO0FBQ0EsTUFBSUMsT0FBTyxFQUFYO0FBQ0E3TixPQUFLOE4sT0FBTCxDQUFhLFVBQVUvRixJQUFWLEVBQWdCO0FBQzVCLE9BQUlnRyxNQUFNaEcsS0FBS25CLElBQUwsQ0FBVUMsRUFBcEI7QUFDQSxPQUFJZ0gsS0FBSy9OLE9BQUwsQ0FBYWlPLEdBQWIsTUFBc0IsQ0FBQyxDQUEzQixFQUE4QjtBQUM3QkYsU0FBSzFILElBQUwsQ0FBVTRILEdBQVY7QUFDQUgsV0FBT3pILElBQVAsQ0FBWTRCLElBQVo7QUFDQTtBQUNELEdBTkQ7QUFPQSxTQUFPNkYsTUFBUDtBQUNBLEVBakNXO0FBa0NaNUosT0FBTSxjQUFDaEUsSUFBRCxFQUFPZ0UsS0FBUCxFQUFnQjtBQUNyQixNQUFJZ0ssU0FBUzNPLEVBQUU0TyxJQUFGLENBQU9qTyxJQUFQLEVBQWEsVUFBVTRLLENBQVYsRUFBYTFFLENBQWIsRUFBZ0I7QUFDekMsT0FBSTBFLEVBQUVuQyxPQUFGLEtBQWN5RixTQUFsQixFQUE2QjtBQUM1QixRQUFJdEQsRUFBRWxDLEtBQUYsQ0FBUTVJLE9BQVIsQ0FBZ0JrRSxLQUFoQixJQUF3QixDQUFDLENBQTdCLEVBQWdDO0FBQy9CLFlBQU8sSUFBUDtBQUNBO0FBQ0QsSUFKRCxNQUlPO0FBQ04sUUFBSTRHLEVBQUVuQyxPQUFGLENBQVUzSSxPQUFWLENBQWtCa0UsS0FBbEIsSUFBMEIsQ0FBQyxDQUEvQixFQUFrQztBQUNqQyxZQUFPLElBQVA7QUFDQTtBQUNEO0FBQ0QsR0FWWSxDQUFiO0FBV0EsU0FBT2dLLE1BQVA7QUFDQSxFQS9DVztBQWdEWk4sTUFBSyxhQUFDMU4sSUFBRCxFQUFVO0FBQ2QsTUFBSWdPLFNBQVMzTyxFQUFFNE8sSUFBRixDQUFPak8sSUFBUCxFQUFhLFVBQVU0SyxDQUFWLEVBQWExRSxDQUFiLEVBQWdCO0FBQ3pDLE9BQUkwRSxFQUFFdUQsWUFBTixFQUFvQjtBQUNuQixXQUFPLElBQVA7QUFDQTtBQUNELEdBSlksQ0FBYjtBQUtBLFNBQU9ILE1BQVA7QUFDQSxFQXZEVztBQXdEWjdCLE9BQU0sY0FBQ25NLElBQUQsRUFBT29PLEVBQVAsRUFBV0MsQ0FBWCxFQUFpQjtBQUN0QixNQUFJQyxZQUFZRixHQUFHRyxLQUFILENBQVMsR0FBVCxDQUFoQjtBQUNBLE1BQUlDLFdBQVdILEVBQUVFLEtBQUYsQ0FBUSxHQUFSLENBQWY7QUFDQSxNQUFJRSxVQUFVQyxPQUFPLElBQUlDLElBQUosQ0FBU0gsU0FBUyxDQUFULENBQVQsRUFBdUIzRCxTQUFTMkQsU0FBUyxDQUFULENBQVQsSUFBd0IsQ0FBL0MsRUFBbURBLFNBQVMsQ0FBVCxDQUFuRCxFQUFnRUEsU0FBUyxDQUFULENBQWhFLEVBQTZFQSxTQUFTLENBQVQsQ0FBN0UsRUFBMEZBLFNBQVMsQ0FBVCxDQUExRixDQUFQLEVBQStHSSxFQUE3SDtBQUNBLE1BQUlDLFlBQVlILE9BQU8sSUFBSUMsSUFBSixDQUFTTCxVQUFVLENBQVYsQ0FBVCxFQUF3QnpELFNBQVN5RCxVQUFVLENBQVYsQ0FBVCxJQUF5QixDQUFqRCxFQUFxREEsVUFBVSxDQUFWLENBQXJELEVBQW1FQSxVQUFVLENBQVYsQ0FBbkUsRUFBaUZBLFVBQVUsQ0FBVixDQUFqRixFQUErRkEsVUFBVSxDQUFWLENBQS9GLENBQVAsRUFBcUhNLEVBQXJJO0FBQ0EsTUFBSVosU0FBUzNPLEVBQUU0TyxJQUFGLENBQU9qTyxJQUFQLEVBQWEsVUFBVTRLLENBQVYsRUFBYTFFLENBQWIsRUFBZ0I7QUFDekMsT0FBSWMsZUFBZTBILE9BQU85RCxFQUFFNUQsWUFBVCxFQUF1QjRILEVBQTFDO0FBQ0EsT0FBSzVILGVBQWU2SCxTQUFmLElBQTRCN0gsZUFBZXlILE9BQTVDLElBQXdEN0QsRUFBRTVELFlBQUYsSUFBa0IsRUFBOUUsRUFBa0Y7QUFDakYsV0FBTyxJQUFQO0FBQ0E7QUFDRCxHQUxZLENBQWI7QUFNQSxTQUFPZ0gsTUFBUDtBQUNBLEVBcEVXO0FBcUVaL0wsUUFBTyxlQUFDakMsSUFBRCxFQUFPMEwsR0FBUCxFQUFlO0FBQ3JCLE1BQUlBLE9BQU8sS0FBWCxFQUFrQjtBQUNqQixVQUFPMUwsSUFBUDtBQUNBLEdBRkQsTUFFTztBQUNOLE9BQUlnTyxTQUFTM08sRUFBRTRPLElBQUYsQ0FBT2pPLElBQVAsRUFBYSxVQUFVNEssQ0FBVixFQUFhMUUsQ0FBYixFQUFnQjtBQUN6QyxRQUFJMEUsRUFBRXRHLElBQUYsSUFBVW9ILEdBQWQsRUFBbUI7QUFDbEIsWUFBTyxJQUFQO0FBQ0E7QUFDRCxJQUpZLENBQWI7QUFLQSxVQUFPc0MsTUFBUDtBQUNBO0FBQ0Q7QUFoRlcsQ0FBYjs7QUFtRkEsSUFBSTFNLEtBQUs7QUFDUkQsT0FBTSxnQkFBTSxDQUVYLENBSE87QUFJUnRDLFVBQVMsbUJBQU07QUFDZCxNQUFJMk0sTUFBTXJNLEVBQUUsc0JBQUYsQ0FBVjtBQUNBLE1BQUlxTSxJQUFJbkssUUFBSixDQUFhLE1BQWIsQ0FBSixFQUEwQjtBQUN6Qm1LLE9BQUkzTCxXQUFKLENBQWdCLE1BQWhCO0FBQ0EsR0FGRCxNQUVPO0FBQ04yTCxPQUFJbEssUUFBSixDQUFhLE1BQWI7QUFDQTtBQUNELEVBWE87QUFZUmlHLFFBQU8saUJBQU07QUFDWixNQUFJbEgsVUFBVVAsS0FBS1ksR0FBTCxDQUFTTCxPQUF2QjtBQUNBLE1BQUlBLFlBQVksV0FBWixJQUEyQlMsT0FBT0csS0FBdEMsRUFBNkM7QUFDNUM5QixLQUFFLDRCQUFGLEVBQWdDbUMsUUFBaEMsQ0FBeUMsTUFBekM7QUFDQW5DLEtBQUUsaUJBQUYsRUFBcUJVLFdBQXJCLENBQWlDLE1BQWpDO0FBQ0EsR0FIRCxNQUdPO0FBQ05WLEtBQUUsNEJBQUYsRUFBZ0NVLFdBQWhDLENBQTRDLE1BQTVDO0FBQ0FWLEtBQUUsaUJBQUYsRUFBcUJtQyxRQUFyQixDQUE4QixNQUE5QjtBQUNBO0FBQ0QsTUFBSWpCLFlBQVksVUFBaEIsRUFBNEI7QUFDM0JsQixLQUFFLFdBQUYsRUFBZVUsV0FBZixDQUEyQixNQUEzQjtBQUNBLEdBRkQsTUFFTztBQUNOLE9BQUlWLEVBQUUsTUFBRixFQUFVd0ksSUFBVixDQUFlLFNBQWYsQ0FBSixFQUErQjtBQUM5QnhJLE1BQUUsTUFBRixFQUFVYSxLQUFWO0FBQ0E7QUFDRGIsS0FBRSxXQUFGLEVBQWVtQyxRQUFmLENBQXdCLE1BQXhCO0FBQ0E7QUFDRDtBQTdCTyxDQUFUOztBQWlDQSxTQUFTeUMsT0FBVCxHQUFtQjtBQUNsQixLQUFJNkssSUFBSSxJQUFJSCxJQUFKLEVBQVI7QUFDQSxLQUFJSSxPQUFPRCxFQUFFRSxXQUFGLEVBQVg7QUFDQSxLQUFJQyxRQUFRSCxFQUFFSSxRQUFGLEtBQWUsQ0FBM0I7QUFDQSxLQUFJQyxPQUFPTCxFQUFFTSxPQUFGLEVBQVg7QUFDQSxLQUFJQyxPQUFPUCxFQUFFUSxRQUFGLEVBQVg7QUFDQSxLQUFJQyxNQUFNVCxFQUFFVSxVQUFGLEVBQVY7QUFDQSxLQUFJQyxNQUFNWCxFQUFFWSxVQUFGLEVBQVY7QUFDQSxRQUFPWCxPQUFPLEdBQVAsR0FBYUUsS0FBYixHQUFxQixHQUFyQixHQUEyQkUsSUFBM0IsR0FBa0MsR0FBbEMsR0FBd0NFLElBQXhDLEdBQStDLEdBQS9DLEdBQXFERSxHQUFyRCxHQUEyRCxHQUEzRCxHQUFpRUUsR0FBeEU7QUFDQTs7QUFFRCxTQUFTOUcsYUFBVCxDQUF1QmdILGNBQXZCLEVBQXVDO0FBQ3RDLEtBQUliLElBQUlKLE9BQU9pQixjQUFQLEVBQXVCZixFQUEvQjtBQUNBLEtBQUlnQixTQUFTLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CLEVBQXFDLElBQXJDLEVBQTJDLElBQTNDLEVBQWlELElBQWpELEVBQXVELElBQXZELEVBQTZELElBQTdELEVBQW1FLElBQW5FLENBQWI7QUFDQSxLQUFJYixPQUFPRCxFQUFFRSxXQUFGLEVBQVg7QUFDQSxLQUFJQyxRQUFRVyxPQUFPZCxFQUFFSSxRQUFGLEVBQVAsQ0FBWjtBQUNBLEtBQUlDLE9BQU9MLEVBQUVNLE9BQUYsRUFBWDtBQUNBLEtBQUlELE9BQU8sRUFBWCxFQUFlO0FBQ2RBLFNBQU8sTUFBTUEsSUFBYjtBQUNBO0FBQ0QsS0FBSUUsT0FBT1AsRUFBRVEsUUFBRixFQUFYO0FBQ0EsS0FBSUMsTUFBTVQsRUFBRVUsVUFBRixFQUFWO0FBQ0EsS0FBSUQsTUFBTSxFQUFWLEVBQWM7QUFDYkEsUUFBTSxNQUFNQSxHQUFaO0FBQ0E7QUFDRCxLQUFJRSxNQUFNWCxFQUFFWSxVQUFGLEVBQVY7QUFDQSxLQUFJRCxNQUFNLEVBQVYsRUFBYztBQUNiQSxRQUFNLE1BQU1BLEdBQVo7QUFDQTtBQUNELEtBQUl0RCxPQUFPNEMsT0FBTyxHQUFQLEdBQWFFLEtBQWIsR0FBcUIsR0FBckIsR0FBMkJFLElBQTNCLEdBQWtDLEdBQWxDLEdBQXdDRSxJQUF4QyxHQUErQyxHQUEvQyxHQUFxREUsR0FBckQsR0FBMkQsR0FBM0QsR0FBaUVFLEdBQTVFO0FBQ0EsUUFBT3RELElBQVA7QUFDQTs7QUFFRCxTQUFTaEUsU0FBVCxDQUFtQnFFLEdBQW5CLEVBQXdCO0FBQ3ZCLEtBQUlxRCxRQUFReFEsRUFBRThMLEdBQUYsQ0FBTXFCLEdBQU4sRUFBVyxVQUFVbEMsS0FBVixFQUFpQmMsS0FBakIsRUFBd0I7QUFDOUMsU0FBTyxDQUFDZCxLQUFELENBQVA7QUFDQSxFQUZXLENBQVo7QUFHQSxRQUFPdUYsS0FBUDtBQUNBOztBQUVELFNBQVM1RSxjQUFULENBQXdCTCxDQUF4QixFQUEyQjtBQUMxQixLQUFJa0YsTUFBTSxJQUFJQyxLQUFKLEVBQVY7QUFDQSxLQUFJN0osQ0FBSixFQUFPOEosQ0FBUCxFQUFVM0IsQ0FBVjtBQUNBLE1BQUtuSSxJQUFJLENBQVQsRUFBWUEsSUFBSTBFLENBQWhCLEVBQW1CLEVBQUUxRSxDQUFyQixFQUF3QjtBQUN2QjRKLE1BQUk1SixDQUFKLElBQVNBLENBQVQ7QUFDQTtBQUNELE1BQUtBLElBQUksQ0FBVCxFQUFZQSxJQUFJMEUsQ0FBaEIsRUFBbUIsRUFBRTFFLENBQXJCLEVBQXdCO0FBQ3ZCOEosTUFBSUMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCdkYsQ0FBM0IsQ0FBSjtBQUNBeUQsTUFBSXlCLElBQUlFLENBQUosQ0FBSjtBQUNBRixNQUFJRSxDQUFKLElBQVNGLElBQUk1SixDQUFKLENBQVQ7QUFDQTRKLE1BQUk1SixDQUFKLElBQVNtSSxDQUFUO0FBQ0E7QUFDRCxRQUFPeUIsR0FBUDtBQUNBOztBQUVELFNBQVMvTSxrQkFBVCxDQUE0QnFOLFFBQTVCLEVBQXNDQyxXQUF0QyxFQUFtREMsU0FBbkQsRUFBOEQ7QUFDN0Q7QUFDQSxLQUFJQyxVQUFVLFFBQU9ILFFBQVAseUNBQU9BLFFBQVAsTUFBbUIsUUFBbkIsR0FBOEI1UCxLQUFLQyxLQUFMLENBQVcyUCxRQUFYLENBQTlCLEdBQXFEQSxRQUFuRTs7QUFFQSxLQUFJSSxNQUFNLEVBQVY7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUlGLFNBQUosRUFBZTtBQUNkLE1BQUlHLE1BQU0sRUFBVjs7QUFFQTtBQUNBLE9BQUssSUFBSXJGLEtBQVQsSUFBa0JtRixRQUFRLENBQVIsQ0FBbEIsRUFBOEI7O0FBRTdCO0FBQ0FFLFVBQU9yRixRQUFRLEdBQWY7QUFDQTs7QUFFRHFGLFFBQU1BLElBQUlDLEtBQUosQ0FBVSxDQUFWLEVBQWEsQ0FBQyxDQUFkLENBQU47O0FBRUE7QUFDQUYsU0FBT0MsTUFBTSxNQUFiO0FBQ0E7O0FBRUQ7QUFDQSxNQUFLLElBQUl2SyxJQUFJLENBQWIsRUFBZ0JBLElBQUlxSyxRQUFRek4sTUFBNUIsRUFBb0NvRCxHQUFwQyxFQUF5QztBQUN4QyxNQUFJdUssTUFBTSxFQUFWOztBQUVBO0FBQ0EsT0FBSyxJQUFJckYsS0FBVCxJQUFrQm1GLFFBQVFySyxDQUFSLENBQWxCLEVBQThCO0FBQzdCdUssVUFBTyxNQUFNRixRQUFRckssQ0FBUixFQUFXa0YsS0FBWCxDQUFOLEdBQTBCLElBQWpDO0FBQ0E7O0FBRURxRixNQUFJQyxLQUFKLENBQVUsQ0FBVixFQUFhRCxJQUFJM04sTUFBSixHQUFhLENBQTFCOztBQUVBO0FBQ0EwTixTQUFPQyxNQUFNLE1BQWI7QUFDQTs7QUFFRCxLQUFJRCxPQUFPLEVBQVgsRUFBZTtBQUNkbE4sUUFBTSxjQUFOO0FBQ0E7QUFDQTs7QUFFRDtBQUNBLEtBQUlxTixXQUFXLEVBQWY7QUFDQTtBQUNBQSxhQUFZTixZQUFZakosT0FBWixDQUFvQixJQUFwQixFQUEwQixHQUExQixDQUFaOztBQUVBO0FBQ0EsS0FBSXdKLE1BQU0sdUNBQXVDQyxVQUFVTCxHQUFWLENBQWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSXhHLE9BQU92SyxTQUFTcVIsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0E5RyxNQUFLK0csSUFBTCxHQUFZSCxHQUFaOztBQUVBO0FBQ0E1RyxNQUFLZ0gsS0FBTCxHQUFhLG1CQUFiO0FBQ0FoSCxNQUFLaUgsUUFBTCxHQUFnQk4sV0FBVyxNQUEzQjs7QUFFQTtBQUNBbFIsVUFBU3lSLElBQVQsQ0FBY0MsV0FBZCxDQUEwQm5ILElBQTFCO0FBQ0FBLE1BQUs5SixLQUFMO0FBQ0FULFVBQVN5UixJQUFULENBQWNFLFdBQWQsQ0FBMEJwSCxJQUExQjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yID0gaGFuZGxlRXJyO1xyXG52YXIgVEFCTEU7XHJcbnZhciBsYXN0Q29tbWFuZCA9ICdjb21tZW50cyc7XHJcbnZhciBhZGRMaW5rID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLCB1cmwsIGwpIHtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSkge1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLCBcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0Y29uc29sZS5sb2coXCJFcnJvciBvY2N1ciBVUkzvvJogXCIgKyAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuYXBwZW5kKFwiPGJyPlwiICsgJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHRsZXQgaGFzaCA9IGxvY2F0aW9uLnNlYXJjaDtcclxuXHRpZiAoaGFzaC5pbmRleE9mKFwiZXh0ZW5zaW9uXCIpID49IDApIHtcclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0ZGF0YS5leHRlbnNpb24gPSB0cnVlO1xyXG5cclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGggYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRpZiAoaGFzaC5pbmRleE9mKFwicmFua2VyXCIpID49IDApIHtcclxuXHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0Y29tbWFuZDogJ3JhbmtlcicsXHJcblx0XHRcdGRhdGE6IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnJhbmtlcilcclxuXHRcdH1cclxuXHRcdGRhdGEucmF3ID0gZGF0YXM7XHJcblx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0fVxyXG5cclxuXHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRjb25maWcub3JkZXIgPSAnY2hyb25vbG9naWNhbCc7XHJcblx0XHR9XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9saWtlXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5saWtlcyA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmYi5nZXRBdXRoKCdyZWFjdGlvbnMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl91cmxcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgndXJsX2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fcGF5XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGNob29zZS5pbml0KCk7XHJcblx0fSk7XHJcblx0JChcIiNtb3JlcG9zdFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHR1aS5hZGRMaW5rKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoIWUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6RVhDRUxcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS9NTS9ERCBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSwgZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLnN0YXJ0VGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gZW5kLmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUoY29uZmlnLmZpbHRlci5zdGFydFRpbWUpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YSk7XHJcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xyXG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApIHtcclxuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcblxyXG5cdGxldCBjaV9jb3VudGVyID0gMDtcclxuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRjaV9jb3VudGVyKys7XHJcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KSB7XHJcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdH1cclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gc2hhcmVCVE4oKSB7XHJcblx0YWxlcnQoJ+iqjeecn+eci+WujOi3s+WHuuS+hueahOmCo+mggeS4iumdouWvq+S6huS7gOm6vFxcblxcbueci+WujOS9oOWwseacg+efpemBk+S9oOeCuuS7gOm6vOS4jeiDveaKk+WIhuS6qycpO1xyXG59XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywgJ21lc3NhZ2VfdGFncycsICdtZXNzYWdlJywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJywgJ2lzX2hpZGRlbiddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCAnZnJvbScsICdtZXNzYWdlJywgJ3N0b3J5J10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnLFxyXG5cdFx0bGlrZXM6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YyLjcnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuNycsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YyLjknLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuNycsXHJcblx0XHRmZWVkOiAndjIuOScsXHJcblx0XHRncm91cDogJ3YyLjcnXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0c3RhcnRUaW1lOiAnMjAwMC0xMi0zMS0wMC0wMC0wMCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnJyxcclxuXHRhdXRoOiAnbWFuYWdlX3BhZ2VzLGdyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nLFxyXG5cdGxpa2VzOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG5cdGZyb21fZXh0ZW5zaW9uOiBmYWxzZSxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdHVzZXJfcG9zdHM6IGZhbHNlLFxyXG5cdGdldEF1dGg6ICh0eXBlID0gJycpID0+IHtcclxuXHRcdGlmICh0eXBlID09PSAnJykge1xyXG5cdFx0XHRhZGRMaW5rID0gdHJ1ZTtcclxuXHRcdFx0dHlwZSA9IGxhc3RDb21tYW5kO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YWRkTGluayA9IGZhbHNlO1xyXG5cdFx0XHRsYXN0Q29tbWFuZCA9IHR5cGU7XHJcblx0XHR9XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gZmFsc2U7XHJcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIikge1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSA+PSAwKSB7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxyXG5cdFx0XHRcdFx0XHQnc3VjY2VzcydcclxuXHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5aSx5pWX77yM6KuL6IGv57Wh566h55CG5ZOh56K66KqNJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT0gXCJzaGFyZWRwb3N0c1wiKSB7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZihcImdyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm9cIikgPCAwKSB7XHJcblx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0XHRodG1sOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZmIudXNlcl9wb3N0cyA9IHRydWU7XHJcblx0XHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKSA9PiB7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0aWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzLmluZGV4T2YoXCJncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvXCIpIDwgMCkge1xyXG5cdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0aHRtbDogJzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgcG9zdGRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5wb3N0ZGF0YSk7XHJcblx0XHRcdFx0aWYgKHBvc3RkYXRhLnR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdGZiLmF1dGhPSygpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAocG9zdGRhdGEudHlwZSA9PT0gJ2dyb3VwJykge1xyXG5cdFx0XHRcdFx0ZmIuYXV0aE9LKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZiLmF1dGhPSygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRhdXRoT0s6ICgpID0+IHtcclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0bGV0IHBvc3RkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucG9zdGRhdGEpO1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiBwb3N0ZGF0YS5jb21tYW5kLFxyXG5cdFx0XHRkYXRhOiBKU09OLnBhcnNlKCQoXCIuY2hyb21lXCIpLnZhbCgpKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzogW10sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluizh+aWmeS4rS4uLicpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0aWYgKCFhZGRMaW5rKSB7XHJcblx0XHRcdGRhdGEucmF3ID0gW107XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKGZiaWQpID0+IHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKCcucHVyZV9mYmlkJykudGV4dChmYmlkLmZ1bGxJRCk7XHJcblx0XHRkYXRhLmdldChmYmlkKS50aGVuKChyZXMpID0+IHtcclxuXHRcdFx0Ly8gZmJpZC5kYXRhID0gcmVzO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09IFwidXJsX2NvbW1lbnRzXCIpIHtcclxuXHRcdFx0XHRmYmlkLmRhdGEgPSBbXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCBpIG9mIHJlcykge1xyXG5cdFx0XHRcdGZiaWQuZGF0YS5wdXNoKGkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEuZmluaXNoKGZiaWQpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IGNvbW1hbmQgPSBmYmlkLmNvbW1hbmQ7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpIGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnICYmIGZiaWQuY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpIGZiaWQuZnVsbElEID0gZmJpZC5wdXJlSUQ7XHJcblx0XHRcdGlmIChjb25maWcubGlrZXMpIGZiaWQuY29tbWFuZCA9ICdsaWtlcyc7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mZGVidWc9YWxsYCk7XHJcblxyXG5cdFx0XHQvLyBpZigkKCcudG9rZW4nKS52YWwoKSA9PT0gJycpe1xyXG5cdFx0XHQvLyBcdCQoJy50b2tlbicpLnZhbChjb25maWcucGFnZVRva2VuKTtcclxuXHRcdFx0Ly8gfWVsc2V7XHJcblx0XHRcdC8vIFx0Y29uZmlnLnBhZ2VUb2tlbiA9ICQoJy50b2tlbicpLnZhbCgpO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZvcmRlcj0ke2NvbmZpZy5vcmRlcn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn0mZGVidWc9YWxsYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdGZvciAobGV0IGQgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdGlmIChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBkLm5hbWVcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChjb25maWcubGlrZXMpIGQudHlwZSA9IFwiTElLRVwiO1xyXG5cdFx0XHRcdFx0aWYgKGQuZnJvbSkge1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogZC5pZFxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0ID0gMCkge1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsICdsaW1pdD0nICsgbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZC5pZCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmIChkLmZyb20pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGQuaWRcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKSA9PiB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIudXBkYXRlX2FyZWEsLmRvbmF0ZV9hcmVhXCIpLnNsaWRlVXAoKTtcclxuXHRcdCQoXCIucmVzdWx0X2FyZWFcIikuc2xpZGVEb3duKCk7XHJcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdHVpLnJlc2V0KCk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKSA9PiB7XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0aWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9PT0gZmFsc2UgJiYgcmF3RGF0YS5jb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdHJhd0RhdGEuZGF0YSA9IHJhd0RhdGEuZGF0YS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW0uaXNfaGlkZGVuID09PSBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKSB7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdykgPT4ge1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0Y29uc29sZS5sb2cocmF3KTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbikge1xyXG5cdFx0XHRpZiAocmF3LmNvbW1hbmQgPT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOmAo+e1kFwiOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMubWVzc2FnZSxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCI6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuihqOaDhVwiOiB0aGlzLnR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCI6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpID0+IHtcclxuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmRhdGEgPSByYXdkYXRhLmZpbHRlcmVkO1xyXG5cdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+6KGo5oOFPC90ZD5gO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpIHtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5o6S5ZCNPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7liIbmlbg8L3RkPmA7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHQ8dGQ+6K6aPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBob3N0ID0gJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyc7XHJcblx0XHRpZiAoZGF0YS5yYXcudHlwZSA9PT0gJ3VybF9jb21tZW50cycpIGhvc3QgPSAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpICsgJz9mYl9jb21tZW50X2lkPSc7XHJcblxyXG5cdFx0Zm9yIChsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpIHtcclxuXHRcdFx0bGV0IHBpY3R1cmUgPSAnJztcclxuXHRcdFx0aWYgKHBpYykge1xyXG5cdFx0XHRcdHBpY3R1cmUgPSBgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5zdG9yeX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHRcdFx0XHR0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHQgIDx0ZD4ke3ZhbC5zY29yZX08L3RkPmA7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IGxpbmsgPSB2YWwuaWQ7XHJcblx0XHRcdFx0aWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbikge1xyXG5cdFx0XHRcdFx0bGluayA9IHZhbC5wb3N0bGluaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cIiR7aG9zdH0ke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblxyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpIHtcclxuXHRcdFx0VEFCTEUgPSAkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JChcIiNzZWFyY2hOYW1lXCIpLm9uKCdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUQUJMRVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQkKFwiI3NlYXJjaENvbW1lbnRcIikub24oJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpID0+IHtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjaG9vc2UgPSB7XHJcblx0ZGF0YTogW10sXHJcblx0YXdhcmQ6IFtdLFxyXG5cdG51bTogMCxcclxuXHRkZXRhaWw6IGZhbHNlLFxyXG5cdGxpc3Q6IFtdLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcclxuXHRcdGNob29zZS5saXN0ID0gW107XHJcblx0XHRjaG9vc2UubnVtID0gMDtcclxuXHRcdGlmICgkKFwiI3NlYXJjaENvbW1lbnRcIikudmFsKCkgIT0gJycpIHtcclxuXHRcdFx0dGFibGUucmVkbygpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApIHtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XCJuYW1lXCI6IHAsXHJcblx0XHRcdFx0XHRcdFwibnVtXCI6IG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKCk7XHJcblx0fSxcclxuXHRnbzogKCkgPT4ge1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGEuZmlsdGVyZWQubGVuZ3RoKS5zcGxpY2UoMCwgY2hvb3NlLm51bSk7XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRjaG9vc2UuYXdhcmQubWFwKCh2YWwsIGluZGV4KSA9PiB7XHJcblx0XHRcdGluc2VydCArPSAnPHRyIHRpdGxlPVwi56ysJyArIChpbmRleCArIDEpICsgJ+WQjVwiPicgKyAkKCcubWFpbl90YWJsZScpLkRhdGFUYWJsZSgpLnJvd3Moe1xyXG5cdFx0XHRcdHNlYXJjaDogJ2FwcGxpZWQnXHJcblx0XHRcdH0pLm5vZGVzKClbdmFsXS5pbm5lckhUTUwgKyAnPC90cj4nO1xyXG5cdFx0fSlcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKGluc2VydCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHJcblx0XHRpZiAoY2hvb3NlLmRldGFpbCkge1xyXG5cdFx0XHRsZXQgbm93ID0gMDtcclxuXHRcdFx0Zm9yIChsZXQgayBpbiBjaG9vc2UubGlzdCkge1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiNVwiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcclxuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fSxcclxuXHRnZW5fYmlnX2F3YXJkOiAoKSA9PiB7XHJcblx0XHRsZXQgbGkgPSAnJztcclxuXHRcdGxldCBhd2FyZHMgPSBbXTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGJvZHkgdHInKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgdmFsKSB7XHJcblx0XHRcdGxldCBhd2FyZCA9IHt9O1xyXG5cdFx0XHRpZiAodmFsLmhhc0F0dHJpYnV0ZSgndGl0bGUnKSkge1xyXG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSBmYWxzZTtcclxuXHRcdFx0XHRhd2FyZC5uYW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC51c2VyaWQgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgxKS5maW5kKCdhJykuYXR0cignaHJlZicpLnJlcGxhY2UoJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycsICcnKTtcclxuXHRcdFx0XHRhd2FyZC5tZXNzYWdlID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC5saW5rID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0XHRhd2FyZC50aW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoJCh2YWwpLmZpbmQoJ3RkJykubGVuZ3RoIC0gMSkudGV4dCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSB0cnVlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS50ZXh0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXdhcmRzLnB1c2goYXdhcmQpO1xyXG5cdFx0fSk7XHJcblx0XHRmb3IgKGxldCBpIG9mIGF3YXJkcykge1xyXG5cdFx0XHRpZiAoaS5hd2FyZF9uYW1lID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bGkgKz0gYDxsaSBjbGFzcz1cInByaXplTmFtZVwiPiR7aS5uYW1lfTwvbGk+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpPlxyXG5cdFx0XHRcdDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH0vcGljdHVyZT90eXBlPWxhcmdlXCIgYWx0PVwiXCI+PC9hPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJpbmZvXCI+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJuYW1lXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5uYW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS5tZXNzYWdlfTwvYT48L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJ0aW1lXCI+PGEgaHJlZj1cIiR7aS5saW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7aS50aW1lfTwvYT48L3A+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9saT5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuYXBwZW5kKGxpKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0Y2xvc2VfYmlnX2F3YXJkOiAoKSA9PiB7XHJcblx0XHQkKCcuYmlnX2F3YXJkJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdCQoJy5iaWdfYXdhcmQgdWwnKS5lbXB0eSgpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZiaWQgPSB7XHJcblx0ZmJpZDogW10sXHJcblx0aW5pdDogKHR5cGUpID0+IHtcclxuXHRcdGNvbmZpZy5wYWdlVG9rZW4gPSAnJztcclxuXHRcdGZiaWQuZmJpZCA9IFtdO1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRGQi5hcGkoXCIvbWVcIiwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRkYXRhLnVzZXJpZCA9IHJlcy5pZDtcclxuXHRcdFx0bGV0IHVybCA9ICcnO1xyXG5cdFx0XHRpZiAoYWRkTGluaykge1xyXG5cdFx0XHRcdHVybCA9IGZiaWQuZm9ybWF0KCQoJy5tb3JlbGluayAuYWRkdXJsJykudmFsKCkpO1xyXG5cdFx0XHRcdCQoJy5tb3JlbGluayAuYWRkdXJsJykudmFsKCcnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodXJsLmluZGV4T2YoJy5waHA/JykgPT09IC0xICYmIHVybC5pbmRleE9mKCc/JykgPiAwKSB7XHJcblx0XHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZignPycpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmYmlkLmdldCh1cmwsIHR5cGUpLnRoZW4oKGZiaWQpID0+IHtcclxuXHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQvLyAkKCcuaWRlbnRpdHknKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoYOeZu+WFpei6q+S7ve+8mjxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Jlcy5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PHNwYW4+JHtyZXMubmFtZX08L3NwYW4+YCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKHVybCwgdHlwZSkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0aWYgKHR5cGUgPT0gJ3VybF9jb21tZW50cycpIHtcclxuXHRcdFx0XHRsZXQgcG9zdHVybCA9IHVybDtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiP1wiKSA+IDApIHtcclxuXHRcdFx0XHRcdHBvc3R1cmwgPSBwb3N0dXJsLnN1YnN0cmluZygwLCBwb3N0dXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0RkIuYXBpKGAvJHtwb3N0dXJsfWAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0XHRcdGZ1bGxJRDogcmVzLm9nX29iamVjdC5pZCxcclxuXHRcdFx0XHRcdFx0dHlwZTogdHlwZSxcclxuXHRcdFx0XHRcdFx0Y29tbWFuZDogJ2NvbW1lbnRzJ1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGNvbmZpZy5saW1pdFsnY29tbWVudHMnXSA9ICcyNSc7XHJcblx0XHRcdFx0XHRjb25maWcub3JkZXIgPSAnJztcclxuXHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRcdGxldCBuZXd1cmwgPSB1cmwuc3Vic3RyKHVybC5pbmRleE9mKCcvJywgMjgpICsgMSwgMjAwKTtcclxuXHRcdFx0XHQvLyBodHRwczovL3d3dy5mYWNlYm9vay5jb20vIOWFsTI15a2X5YWD77yM5Zug5q2k6YG4Mjjplovlp4vmib4vXHJcblx0XHRcdFx0bGV0IHJlc3VsdCA9IG5ld3VybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdFx0bGV0IHVybHR5cGUgPSBmYmlkLmNoZWNrVHlwZSh1cmwpO1xyXG5cdFx0XHRcdGZiaWQuY2hlY2tQYWdlSUQodXJsLCB1cmx0eXBlKS50aGVuKChpZCkgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKGlkID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHRcdHVybHR5cGUgPSAncGVyc29uYWwnO1xyXG5cdFx0XHRcdFx0XHRpZCA9IGRhdGEudXNlcmlkO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0cGFnZUlEOiBpZCxcclxuXHRcdFx0XHRcdFx0dHlwZTogdXJsdHlwZSxcclxuXHRcdFx0XHRcdFx0Y29tbWFuZDogdHlwZSxcclxuXHRcdFx0XHRcdFx0ZGF0YTogW11cclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRpZiAoYWRkTGluaykgb2JqLmRhdGEgPSBkYXRhLnJhdy5kYXRhOyAvL+i/veWKoOiyvOaWh1xyXG5cdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ2ZiaWQ9Jyk7XHJcblx0XHRcdFx0XHRcdGlmIChzdGFydCA+PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGVuZCA9IHVybC5pbmRleE9mKFwiJlwiLCBzdGFydCk7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQgKyA1LCBlbmQpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdwb3N0cy8nKTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCArIDYsIHVybC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGxldCB2aWRlbyA9IHVybC5pbmRleE9mKCd2aWRlb3MvJyk7XHJcblx0XHRcdFx0XHRcdGlmICh2aWRlbyA+PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3B1cmUnKSB7XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCAnJyk7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZXZlbnQnKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reaJgOacieeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmNvbW1hbmQgPSAnZmVlZCc7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5p+Q56+H55WZ6KiA55qE55WZ6KiAXHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGZiLnVzZXJfcG9zdHMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgXCJfXCIgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6ICfnpL7lnJjkvb/nlKjpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlnJgnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRodG1sOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3Bob3RvJykge1xyXG5cdFx0XHRcdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHJlc3VsdCA9IHVybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAndmlkZW8nKSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0RkIuYXBpKGAvJHtvYmoucHVyZUlEfT9maWVsZHM9bGl2ZV9zdGF0dXNgLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmxpdmVfc3RhdHVzID09PSAnTElWRScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSB8fCByZXN1bHQubGVuZ3RoID09IDMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0RkIuYXBpKGAvJHtvYmoucGFnZUlEfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjaGVja1R5cGU6IChwb3N0dXJsKSA9PiB7XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCkge1xyXG5cdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdwZXJtYWxpbmsnKSA+PSAwKSB7XHJcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiAncGVyc29uYWwnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9ncm91cHMvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdncm91cCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImV2ZW50c1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAnZXZlbnQnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvcGhvdG9zL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAncGhvdG8nO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvdmlkZW9zL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAndmlkZW8nO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignXCInKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAncHVyZSc7XHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICdub3JtYWwnO1xyXG5cdH0sXHJcblx0Y2hlY2tQYWdlSUQ6IChwb3N0dXJsLCB0eXBlKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgc3RhcnQgPSBwb3N0dXJsLmluZGV4T2YoXCJmYWNlYm9vay5jb21cIikgKyAxMztcclxuXHRcdFx0bGV0IGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIiwgc3RhcnQpO1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRpZiAoZW5kIDwgMCkge1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ2ZiaWQ9JykgPj0gMCkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICd1bm5hbWUnKSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3VubmFtZScpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShwb3N0dXJsLm1hdGNoKHJlZ2V4KVsxXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBncm91cCA9IHBvc3R1cmwuaW5kZXhPZignL2dyb3Vwcy8nKTtcclxuXHRcdFx0XHRsZXQgZXZlbnQgPSBwb3N0dXJsLmluZGV4T2YoJy9ldmVudHMvJylcclxuXHRcdFx0XHRpZiAoZ3JvdXAgPj0gMCkge1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBncm91cCArIDg7XHJcblx0XHRcdFx0XHRlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsIHN0YXJ0KTtcclxuXHRcdFx0XHRcdGxldCByZWdleDIgPSAvXFxkezYsfS9nO1xyXG5cdFx0XHRcdFx0bGV0IHRlbXAgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcclxuXHRcdFx0XHRcdGlmIChyZWdleDIudGVzdCh0ZW1wKSkge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRlbXApO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgnZ3JvdXAnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYgKGV2ZW50ID49IDApIHtcclxuXHRcdFx0XHRcdHJlc29sdmUoJ2V2ZW50Jyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHZhciBwYWdlbmFtZSA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xyXG5cdFx0XHRcdFx0RkIuYXBpKGAvJHtwYWdlbmFtZX0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmb3JtYXQ6ICh1cmwpID0+IHtcclxuXHRcdGlmICh1cmwuaW5kZXhPZignYnVzaW5lc3MuZmFjZWJvb2suY29tLycpID49IDApIHtcclxuXHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXdkYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBzdGFydFRpbWUsIGVuZFRpbWUpID0+IHtcclxuXHRcdGxldCBkYXRhID0gcmF3ZGF0YS5kYXRhO1xyXG5cdFx0aWYgKHdvcmQgIT09ICcnKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnJlYWN0KGRhdGEsIHJlYWN0KTtcclxuXHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJykge1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBzdGFydFRpbWUsIGVuZFRpbWUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSkgPT4ge1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZiAoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKSA9PiB7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGlmIChuLnN0b3J5LmluZGV4T2Yod29yZCkgPiAtMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCBzdCwgdCkgPT4ge1xyXG5cdFx0bGV0IHRpbWVfYXJ5MiA9IHN0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IGVuZHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sIChwYXJzZUludCh0aW1lX2FyeVsxXSkgLSAxKSwgdGltZV9hcnlbMl0sIHRpbWVfYXJ5WzNdLCB0aW1lX2FyeVs0XSwgdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBzdGFydHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnkyWzBdLCAocGFyc2VJbnQodGltZV9hcnkyWzFdKSAtIDEpLCB0aW1lX2FyeTJbMl0sIHRpbWVfYXJ5MlszXSwgdGltZV9hcnkyWzRdLCB0aW1lX2FyeTJbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmICgoY3JlYXRlZF90aW1lID4gc3RhcnR0aW1lICYmIGNyZWF0ZWRfdGltZSA8IGVuZHRpbWUpIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpID0+IHtcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpIHtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCkgPT4ge1xyXG5cclxuXHR9LFxyXG5cdGFkZExpbms6ICgpID0+IHtcclxuXHRcdGxldCB0YXIgPSAkKCcuaW5wdXRhcmVhIC5tb3JlbGluaycpO1xyXG5cdFx0aWYgKHRhci5oYXNDbGFzcygnc2hvdycpKSB7XHJcblx0XHRcdHRhci5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGFyLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZXNldDogKCkgPT4ge1xyXG5cdFx0bGV0IGNvbW1hbmQgPSBkYXRhLnJhdy5jb21tYW5kO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKSB7XHJcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKSB7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSArIDE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyICsgXCItXCIgKyBtb250aCArIFwiLVwiICsgZGF0ZSArIFwiLVwiICsgaG91ciArIFwiLVwiICsgbWluICsgXCItXCIgKyBzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApIHtcclxuXHR2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcblx0dmFyIG1vbnRocyA9IFsnMDEnLCAnMDInLCAnMDMnLCAnMDQnLCAnMDUnLCAnMDYnLCAnMDcnLCAnMDgnLCAnMDknLCAnMTAnLCAnMTEnLCAnMTInXTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdGlmIChkYXRlIDwgMTApIHtcclxuXHRcdGRhdGUgPSBcIjBcIiArIGRhdGU7XHJcblx0fVxyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHRpZiAobWluIDwgMTApIHtcclxuXHRcdG1pbiA9IFwiMFwiICsgbWluO1xyXG5cdH1cclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0aWYgKHNlYyA8IDEwKSB7XHJcblx0XHRzZWMgPSBcIjBcIiArIHNlYztcclxuXHR9XHJcblx0dmFyIHRpbWUgPSB5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBkYXRlICsgXCIgXCIgKyBob3VyICsgJzonICsgbWluICsgJzonICsgc2VjO1xyXG5cdHJldHVybiB0aW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvYmoyQXJyYXkob2JqKSB7XHJcblx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuXHR9KTtcclxuXHRyZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcblx0dmFyIGksIHIsIHQ7XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0YXJ5W2ldID0gaTtcclxuXHR9XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG5cdFx0dCA9IGFyeVtyXTtcclxuXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuXHRcdGFyeVtpXSA9IHQ7XHJcblx0fVxyXG5cdHJldHVybiBhcnk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG5cdC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcblx0dmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG5cclxuXHR2YXIgQ1NWID0gJyc7XHJcblx0Ly9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcblxyXG5cdC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuXHQvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG5cdGlmIChTaG93TGFiZWwpIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuXHJcblx0XHRcdC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRcdHJvdyArPSBpbmRleCArICcsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG5cclxuXHRcdC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcblx0XHRcdHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG5cclxuXHRcdC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0aWYgKENTViA9PSAnJykge1xyXG5cdFx0YWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcblx0dmFyIGZpbGVOYW1lID0gXCJcIjtcclxuXHQvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuXHRmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csIFwiX1wiKTtcclxuXHJcblx0Ly9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuXHR2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG5cclxuXHQvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuXHQvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG5cdC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG5cdC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcblxyXG5cdC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG5cdGxpbmsuaHJlZiA9IHVyaTtcclxuXHJcblx0Ly9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuXHRsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG5cdGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG5cclxuXHQvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcblx0bGluay5jbGljaygpO1xyXG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
