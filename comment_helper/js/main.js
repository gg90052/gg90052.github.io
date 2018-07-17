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
	auth: 'user_photos,user_posts,manage_pages',
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
				if (authStr.indexOf('user_posts') >= 0) {
					swal('付費授權完成，請再次執行抓留言', 'Authorization Finished! Please getComments again.', 'success').done();
				} else {
					swal('付費授權失敗，請聯絡管理員確認', 'Authorization Failed! Please contact the admin.', 'error').done();
				}
			} else if (type == "sharedposts") {
				if (authStr.indexOf("user_posts") < 0) {
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
				console.log(authStr);
				if (authStr.indexOf("user_posts") >= 0 && authStr.indexOf("manage_pages") >= 0) {
					fb.user_posts = true;
					fbid.init(type);
				} else {
					swal({
						title: '此系統需要付費，免費版本請點以下網址',
						html: '<a href="http://gg90052.github.io/comment_helper_free/" target="_blank">http://gg90052.github.io/comment_helper_free/</a>',
						type: 'warning'
					}).done();
				}
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
			if (response.authResponse.grantedScopes.indexOf("user_posts") < 0) {
				swal({
					title: '抓分享需付費，詳情請見粉絲專頁',
					html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
					type: 'warning'
				}).done();
			} else {
				var postdata = JSON.parse(localStorage.postdata);
				if (postdata.type === 'personal') {
					// FB.api("/me", function (res) {
					// 	if (res.name === postdata.owner) {
					// 		fb.authOK();
					// 	}else{
					// 		swal({
					// 			title: '個人貼文只有發文者本人能抓',
					// 			html: `貼文帳號名稱：${postdata.owner}<br>目前帳號名稱：${res.name}`,
					// 			type: 'warning'
					// 		}).done();
					// 	}
					// });
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
		if (data.extension) {
			$.each(raw.data, function (i) {
				var tmp = {
					"序號": i + 1,
					"臉書連結": 'http://www.facebook.com/' + this.from.id,
					"姓名": this.from.name,
					"分享連結": this.postlink,
					"留言內容": this.story,
					"該分享讚數": this.like_count
				};
				newObj.push(tmp);
			});
		} else {
			$.each(raw.data, function (i) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIlRBQkxFIiwibGFzdENvbW1hbmQiLCJhZGRMaW5rIiwibXNnIiwidXJsIiwibCIsImNvbnNvbGUiLCJsb2ciLCIkIiwidmFsIiwiYXBwZW5kIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImhhc2giLCJsb2NhdGlvbiIsInNlYXJjaCIsImluZGV4T2YiLCJyZW1vdmVDbGFzcyIsImRhdGEiLCJleHRlbnNpb24iLCJjbGljayIsImUiLCJmYiIsImV4dGVuc2lvbkF1dGgiLCJkYXRhcyIsImNvbW1hbmQiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJyYW5rZXIiLCJyYXciLCJmaW5pc2giLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJnZXRBdXRoIiwibGlrZXMiLCJjaG9vc2UiLCJpbml0IiwidWkiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwia2V5ZG93biIsInRleHQiLCJrZXl1cCIsIm9uIiwidGFibGUiLCJyZWRvIiwiY2hhbmdlIiwiZmlsdGVyIiwicmVhY3QiLCJkYXRlcmFuZ2VwaWNrZXIiLCJzdGFydCIsImVuZCIsImxhYmVsIiwic3RhcnRUaW1lIiwiZm9ybWF0IiwiZW5kVGltZSIsInNldFN0YXJ0RGF0ZSIsImZpbHRlckRhdGEiLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwic2hhcmVCVE4iLCJhbGVydCIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIndvcmQiLCJub3dEYXRlIiwiYXV0aCIsInBhZ2VUb2tlbiIsImZyb21fZXh0ZW5zaW9uIiwidXNlcl9wb3N0cyIsInR5cGUiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJ0aXRsZSIsImh0bWwiLCJmYmlkIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJwb3N0ZGF0YSIsImF1dGhPSyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZnVsbElEIiwiZ2V0IiwidGhlbiIsInJlcyIsImkiLCJwdXNoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwcm9taXNlX2FycmF5IiwicHVyZUlEIiwidG9TdHJpbmciLCJhcGkiLCJkIiwiZnJvbSIsImlkIiwibmFtZSIsInVwZGF0ZWRfdGltZSIsImNyZWF0ZWRfdGltZSIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsInJlc2V0IiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJwcm9wIiwiaXNUYWciLCJpdGVtIiwiaXNfaGlkZGVuIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwiZmlsdGVyZWQiLCJuZXdPYmoiLCJlYWNoIiwidG1wIiwicG9zdGxpbmsiLCJzdG9yeSIsImxpa2VfY291bnQiLCJtZXNzYWdlIiwidGltZUNvbnZlcnRlciIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJzdHIiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwicmF3ZGF0YSIsImZpbHRlcmRhdGEiLCJ0aGVhZCIsInRib2R5IiwicGljIiwiaG9zdCIsImVudHJpZXMiLCJqIiwicGljdHVyZSIsInRkIiwic2NvcmUiLCJsaW5rIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwibiIsInBhcnNlSW50IiwiZmluZCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwibWFwIiwiaW5kZXgiLCJyb3dzIiwibm9kZXMiLCJpbm5lckhUTUwiLCJub3ciLCJrIiwidGFyIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJnZW5fYmlnX2F3YXJkIiwibGkiLCJhd2FyZHMiLCJoYXNBdHRyaWJ1dGUiLCJhd2FyZF9uYW1lIiwiYXR0ciIsInRpbWUiLCJjbG9zZV9iaWdfYXdhcmQiLCJlbXB0eSIsInN1YnN0cmluZyIsInBvc3R1cmwiLCJvYmoiLCJvZ19vYmplY3QiLCJyZWdleCIsIm5ld3VybCIsInN1YnN0ciIsIm1hdGNoIiwidXJsdHlwZSIsImNoZWNrVHlwZSIsImNoZWNrUGFnZUlEIiwicGFnZUlEIiwidmlkZW8iLCJlcnJvciIsImFjY2Vzc190b2tlbiIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJ0YWciLCJ1bmlxdWUiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsIm5ld0FyeSIsImdyZXAiLCJ1bmRlZmluZWQiLCJtZXNzYWdlX3RhZ3MiLCJzdCIsInQiLCJ0aW1lX2FyeTIiLCJzcGxpdCIsInRpbWVfYXJ5IiwiZW5kdGltZSIsIm1vbWVudCIsIkRhdGUiLCJfZCIsInN0YXJ0dGltZSIsImEiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBaUJDLFNBQWpCO0FBQ0EsSUFBSUMsS0FBSjtBQUNBLElBQUlDLGNBQWMsVUFBbEI7QUFDQSxJQUFJQyxVQUFVLEtBQWQ7O0FBRUEsU0FBU0gsU0FBVCxDQUFtQkksR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxDQUE3QixFQUFnQztBQUMvQixLQUFJLENBQUNULFlBQUwsRUFBbUI7QUFDbEJVLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFpRCw0QkFBakQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQkMsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBbEM7QUFDQUQsSUFBRSxpQkFBRixFQUFxQkUsTUFBckIsQ0FBNEIsU0FBU0YsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBckM7QUFDQUQsSUFBRSxpQkFBRixFQUFxQkcsTUFBckI7QUFDQWYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRFksRUFBRUksUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVk7QUFDN0IsS0FBSUMsT0FBT0MsU0FBU0MsTUFBcEI7QUFDQSxLQUFJRixLQUFLRyxPQUFMLENBQWEsV0FBYixLQUE2QixDQUFqQyxFQUFvQztBQUNuQ1QsSUFBRSxvQkFBRixFQUF3QlUsV0FBeEIsQ0FBb0MsTUFBcEM7QUFDQUMsT0FBS0MsU0FBTCxHQUFpQixJQUFqQjs7QUFFQVosSUFBRSwyQkFBRixFQUErQmEsS0FBL0IsQ0FBcUMsVUFBVUMsQ0FBVixFQUFhO0FBQ2pEQyxNQUFHQyxhQUFIO0FBQ0EsR0FGRDtBQUdBO0FBQ0QsS0FBSVYsS0FBS0csT0FBTCxDQUFhLFFBQWIsS0FBMEIsQ0FBOUIsRUFBaUM7QUFDaEMsTUFBSVEsUUFBUTtBQUNYQyxZQUFTLFFBREU7QUFFWFAsU0FBTVEsS0FBS0MsS0FBTCxDQUFXQyxhQUFhQyxNQUF4QjtBQUZLLEdBQVo7QUFJQVgsT0FBS1ksR0FBTCxHQUFXTixLQUFYO0FBQ0FOLE9BQUthLE1BQUwsQ0FBWWIsS0FBS1ksR0FBakI7QUFDQTs7QUFHRHZCLEdBQUUsZUFBRixFQUFtQmEsS0FBbkIsQ0FBeUIsVUFBVUMsQ0FBVixFQUFhO0FBQ3JDaEIsVUFBUUMsR0FBUixDQUFZZSxDQUFaO0FBQ0EsTUFBSUEsRUFBRVcsT0FBRixJQUFhWCxFQUFFWSxNQUFuQixFQUEyQjtBQUMxQkMsVUFBT0MsS0FBUCxHQUFlLGVBQWY7QUFDQTtBQUNEYixLQUFHYyxPQUFILENBQVcsVUFBWDtBQUNBLEVBTkQ7O0FBUUE3QixHQUFFLFdBQUYsRUFBZWEsS0FBZixDQUFxQixVQUFVQyxDQUFWLEVBQWE7QUFDakMsTUFBSUEsRUFBRVcsT0FBRixJQUFhWCxFQUFFWSxNQUFuQixFQUEyQjtBQUMxQkMsVUFBT0csS0FBUCxHQUFlLElBQWY7QUFDQTtBQUNEZixLQUFHYyxPQUFILENBQVcsV0FBWDtBQUNBLEVBTEQ7QUFNQTdCLEdBQUUsVUFBRixFQUFjYSxLQUFkLENBQW9CLFlBQVk7QUFDL0JFLEtBQUdjLE9BQUgsQ0FBVyxjQUFYO0FBQ0EsRUFGRDtBQUdBN0IsR0FBRSxVQUFGLEVBQWNhLEtBQWQsQ0FBb0IsWUFBWTtBQUMvQkUsS0FBR2MsT0FBSCxDQUFXLFVBQVg7QUFDQSxFQUZEO0FBR0E3QixHQUFFLGFBQUYsRUFBaUJhLEtBQWpCLENBQXVCLFlBQVk7QUFDbENrQixTQUFPQyxJQUFQO0FBQ0EsRUFGRDtBQUdBaEMsR0FBRSxXQUFGLEVBQWVhLEtBQWYsQ0FBcUIsWUFBWTtBQUNoQ29CLEtBQUd2QyxPQUFIO0FBQ0EsRUFGRDs7QUFJQU0sR0FBRSxZQUFGLEVBQWdCYSxLQUFoQixDQUFzQixZQUFZO0FBQ2pDLE1BQUliLEVBQUUsSUFBRixFQUFRa0MsUUFBUixDQUFpQixRQUFqQixDQUFKLEVBQWdDO0FBQy9CbEMsS0FBRSxJQUFGLEVBQVFVLFdBQVIsQ0FBb0IsUUFBcEI7QUFDQVYsS0FBRSxXQUFGLEVBQWVVLFdBQWYsQ0FBMkIsU0FBM0I7QUFDQVYsS0FBRSxjQUFGLEVBQWtCVSxXQUFsQixDQUE4QixRQUE5QjtBQUNBLEdBSkQsTUFJTztBQUNOVixLQUFFLElBQUYsRUFBUW1DLFFBQVIsQ0FBaUIsUUFBakI7QUFDQW5DLEtBQUUsV0FBRixFQUFlbUMsUUFBZixDQUF3QixTQUF4QjtBQUNBbkMsS0FBRSxjQUFGLEVBQWtCbUMsUUFBbEIsQ0FBMkIsUUFBM0I7QUFDQTtBQUNELEVBVkQ7O0FBWUFuQyxHQUFFLFVBQUYsRUFBY2EsS0FBZCxDQUFvQixZQUFZO0FBQy9CLE1BQUliLEVBQUUsSUFBRixFQUFRa0MsUUFBUixDQUFpQixRQUFqQixDQUFKLEVBQWdDO0FBQy9CbEMsS0FBRSxJQUFGLEVBQVFVLFdBQVIsQ0FBb0IsUUFBcEI7QUFDQSxHQUZELE1BRU87QUFDTlYsS0FBRSxJQUFGLEVBQVFtQyxRQUFSLENBQWlCLFFBQWpCO0FBQ0E7QUFDRCxFQU5EOztBQVFBbkMsR0FBRSxlQUFGLEVBQW1CYSxLQUFuQixDQUF5QixZQUFZO0FBQ3BDYixJQUFFLGNBQUYsRUFBa0JFLE1BQWxCO0FBQ0EsRUFGRDs7QUFJQUYsR0FBRVgsTUFBRixFQUFVK0MsT0FBVixDQUFrQixVQUFVdEIsQ0FBVixFQUFhO0FBQzlCLE1BQUlBLEVBQUVXLE9BQUYsSUFBYVgsRUFBRVksTUFBbkIsRUFBMkI7QUFDMUIxQixLQUFFLFlBQUYsRUFBZ0JxQyxJQUFoQixDQUFxQixRQUFyQjtBQUNBO0FBQ0QsRUFKRDtBQUtBckMsR0FBRVgsTUFBRixFQUFVaUQsS0FBVixDQUFnQixVQUFVeEIsQ0FBVixFQUFhO0FBQzVCLE1BQUksQ0FBQ0EsRUFBRVcsT0FBSCxJQUFjWCxFQUFFWSxNQUFwQixFQUE0QjtBQUMzQjFCLEtBQUUsWUFBRixFQUFnQnFDLElBQWhCLENBQXFCLFNBQXJCO0FBQ0E7QUFDRCxFQUpEOztBQU1BckMsR0FBRSxlQUFGLEVBQW1CdUMsRUFBbkIsQ0FBc0IsUUFBdEIsRUFBZ0MsWUFBWTtBQUMzQ0MsUUFBTUMsSUFBTjtBQUNBLEVBRkQ7O0FBSUF6QyxHQUFFLGlCQUFGLEVBQXFCMEMsTUFBckIsQ0FBNEIsWUFBWTtBQUN2Q2YsU0FBT2dCLE1BQVAsQ0FBY0MsS0FBZCxHQUFzQjVDLEVBQUUsSUFBRixFQUFRQyxHQUFSLEVBQXRCO0FBQ0F1QyxRQUFNQyxJQUFOO0FBQ0EsRUFIRDs7QUFLQXpDLEdBQUUsWUFBRixFQUFnQjZDLGVBQWhCLENBQWdDO0FBQy9CLGdCQUFjLElBRGlCO0FBRS9CLHNCQUFvQixJQUZXO0FBRy9CLFlBQVU7QUFDVCxhQUFVLGtCQUREO0FBRVQsZ0JBQWEsR0FGSjtBQUdULGlCQUFjLElBSEw7QUFJVCxrQkFBZSxJQUpOO0FBS1QsZ0JBQWEsTUFMSjtBQU1ULGNBQVcsSUFORjtBQU9ULHVCQUFvQixRQVBYO0FBUVQsaUJBQWMsQ0FDYixHQURhLEVBRWIsR0FGYSxFQUdiLEdBSGEsRUFJYixHQUphLEVBS2IsR0FMYSxFQU1iLEdBTmEsRUFPYixHQVBhLENBUkw7QUFpQlQsaUJBQWMsQ0FDYixJQURhLEVBRWIsSUFGYSxFQUdiLElBSGEsRUFJYixJQUphLEVBS2IsSUFMYSxFQU1iLElBTmEsRUFPYixJQVBhLEVBUWIsSUFSYSxFQVNiLElBVGEsRUFVYixJQVZhLEVBV2IsS0FYYSxFQVliLEtBWmEsQ0FqQkw7QUErQlQsZUFBWTtBQS9CSDtBQUhxQixFQUFoQyxFQW9DRyxVQUFVQyxLQUFWLEVBQWlCQyxHQUFqQixFQUFzQkMsS0FBdEIsRUFBNkI7QUFDL0JyQixTQUFPZ0IsTUFBUCxDQUFjTSxTQUFkLEdBQTBCSCxNQUFNSSxNQUFOLENBQWEscUJBQWIsQ0FBMUI7QUFDQXZCLFNBQU9nQixNQUFQLENBQWNRLE9BQWQsR0FBd0JKLElBQUlHLE1BQUosQ0FBVyxxQkFBWCxDQUF4QjtBQUNBVixRQUFNQyxJQUFOO0FBQ0EsRUF4Q0Q7QUF5Q0F6QyxHQUFFLFlBQUYsRUFBZ0JXLElBQWhCLENBQXFCLGlCQUFyQixFQUF3Q3lDLFlBQXhDLENBQXFEekIsT0FBT2dCLE1BQVAsQ0FBY00sU0FBbkU7O0FBR0FqRCxHQUFFLFlBQUYsRUFBZ0JhLEtBQWhCLENBQXNCLFVBQVVDLENBQVYsRUFBYTtBQUNsQyxNQUFJdUMsYUFBYTFDLEtBQUtnQyxNQUFMLENBQVloQyxLQUFLWSxHQUFqQixDQUFqQjtBQUNBLE1BQUlULEVBQUVXLE9BQUYsSUFBYVgsRUFBRVksTUFBbkIsRUFBMkI7QUFDMUIsT0FBSTlCLE1BQU0saUNBQWlDdUIsS0FBS21DLFNBQUwsQ0FBZUQsVUFBZixDQUEzQztBQUNBaEUsVUFBT2tFLElBQVAsQ0FBWTNELEdBQVosRUFBaUIsUUFBakI7QUFDQVAsVUFBT21FLEtBQVA7QUFDQSxHQUpELE1BSU87QUFDTixPQUFJSCxXQUFXSSxNQUFYLEdBQW9CLElBQXhCLEVBQThCO0FBQzdCekQsTUFBRSxXQUFGLEVBQWVVLFdBQWYsQ0FBMkIsTUFBM0I7QUFDQSxJQUZELE1BRU87QUFDTmdELHVCQUFtQi9DLEtBQUtnRCxLQUFMLENBQVdOLFVBQVgsQ0FBbkIsRUFBMkMsZ0JBQTNDLEVBQTZELElBQTdEO0FBQ0E7QUFDRDtBQUNELEVBYkQ7O0FBZUFyRCxHQUFFLFdBQUYsRUFBZWEsS0FBZixDQUFxQixZQUFZO0FBQ2hDLE1BQUl3QyxhQUFhMUMsS0FBS2dDLE1BQUwsQ0FBWWhDLEtBQUtZLEdBQWpCLENBQWpCO0FBQ0EsTUFBSXFDLGNBQWNqRCxLQUFLZ0QsS0FBTCxDQUFXTixVQUFYLENBQWxCO0FBQ0FyRCxJQUFFLFlBQUYsRUFBZ0JDLEdBQWhCLENBQW9Ca0IsS0FBS21DLFNBQUwsQ0FBZU0sV0FBZixDQUFwQjtBQUNBLEVBSkQ7O0FBTUEsS0FBSUMsYUFBYSxDQUFqQjtBQUNBN0QsR0FBRSxLQUFGLEVBQVNhLEtBQVQsQ0FBZSxVQUFVQyxDQUFWLEVBQWE7QUFDM0IrQztBQUNBLE1BQUlBLGNBQWMsQ0FBbEIsRUFBcUI7QUFDcEI3RCxLQUFFLDRCQUFGLEVBQWdDbUMsUUFBaEMsQ0FBeUMsTUFBekM7QUFDQW5DLEtBQUUsWUFBRixFQUFnQlUsV0FBaEIsQ0FBNEIsTUFBNUI7QUFDQTtBQUNELE1BQUlJLEVBQUVXLE9BQUYsSUFBYVgsRUFBRVksTUFBbkIsRUFBMkIsQ0FFMUI7QUFDRCxFQVREO0FBVUExQixHQUFFLFlBQUYsRUFBZ0IwQyxNQUFoQixDQUF1QixZQUFZO0FBQ2xDMUMsSUFBRSxVQUFGLEVBQWNVLFdBQWQsQ0FBMEIsTUFBMUI7QUFDQVYsSUFBRSxtQkFBRixFQUF1QnFDLElBQXZCLENBQTRCLGlDQUE1QjtBQUNBMUIsT0FBS21ELE1BQUwsQ0FBWSxLQUFLQyxLQUFMLENBQVcsQ0FBWCxDQUFaO0FBQ0EsRUFKRDtBQUtBLENBNUtEOztBQThLQSxTQUFTQyxRQUFULEdBQW9CO0FBQ25CQyxPQUFNLHNDQUFOO0FBQ0E7O0FBRUQsSUFBSXRDLFNBQVM7QUFDWnVDLFFBQU87QUFDTkMsWUFBVSxDQUFDLFlBQUQsRUFBZSxjQUFmLEVBQStCLFNBQS9CLEVBQTBDLE1BQTFDLEVBQWtELGNBQWxELEVBQWtFLFdBQWxFLENBREo7QUFFTkMsYUFBVyxFQUZMO0FBR05DLGVBQWEsQ0FBQyxPQUFELEVBQVUsTUFBVixFQUFrQixjQUFsQixDQUhQO0FBSU5DLGdCQUFjLEVBSlI7QUFLTkMsUUFBTSxDQUFDLGNBQUQsRUFBaUIsTUFBakIsRUFBeUIsU0FBekIsRUFBb0MsT0FBcEMsQ0FMQTtBQU1OekMsU0FBTyxDQUFDLE1BQUQ7QUFORCxFQURLO0FBU1owQyxRQUFPO0FBQ05MLFlBQVUsS0FESjtBQUVOQyxhQUFXLEtBRkw7QUFHTkMsZUFBYSxLQUhQO0FBSU5DLGdCQUFjLEtBSlI7QUFLTkMsUUFBTSxLQUxBO0FBTU56QyxTQUFPO0FBTkQsRUFUSztBQWlCWjJDLGFBQVk7QUFDWE4sWUFBVSxNQURDO0FBRVhDLGFBQVcsTUFGQTtBQUdYQyxlQUFhLE1BSEY7QUFJWEMsZ0JBQWMsTUFKSDtBQUtYQyxRQUFNLE1BTEs7QUFNWEcsU0FBTztBQU5JLEVBakJBO0FBeUJaL0IsU0FBUTtBQUNQZ0MsUUFBTSxFQURDO0FBRVAvQixTQUFPLEtBRkE7QUFHUEssYUFBVyxxQkFISjtBQUlQRSxXQUFTeUI7QUFKRixFQXpCSTtBQStCWmhELFFBQU8sRUEvQks7QUFnQ1ppRCxPQUFNLHFDQWhDTTtBQWlDWi9DLFFBQU8sS0FqQ0s7QUFrQ1pnRCxZQUFXLEVBbENDO0FBbUNaQyxpQkFBZ0I7QUFuQ0osQ0FBYjs7QUFzQ0EsSUFBSWhFLEtBQUs7QUFDUmlFLGFBQVksS0FESjtBQUVSbkQsVUFBUyxtQkFBZTtBQUFBLE1BQWRvRCxJQUFjLHVFQUFQLEVBQU87O0FBQ3ZCLE1BQUlBLFNBQVMsRUFBYixFQUFpQjtBQUNoQnZGLGFBQVUsSUFBVjtBQUNBdUYsVUFBT3hGLFdBQVA7QUFDQSxHQUhELE1BR087QUFDTkMsYUFBVSxLQUFWO0FBQ0FELGlCQUFjd0YsSUFBZDtBQUNBO0FBQ0RDLEtBQUdDLEtBQUgsQ0FBUyxVQUFVQyxRQUFWLEVBQW9CO0FBQzVCckUsTUFBR3NFLFFBQUgsQ0FBWUQsUUFBWixFQUFzQkgsSUFBdEI7QUFDQSxHQUZELEVBRUc7QUFDRkssVUFBTzNELE9BQU9rRCxJQURaO0FBRUZVLGtCQUFlO0FBRmIsR0FGSDtBQU1BLEVBaEJPO0FBaUJSRixXQUFVLGtCQUFDRCxRQUFELEVBQVdILElBQVgsRUFBb0I7QUFDN0JuRixVQUFRQyxHQUFSLENBQVlxRixRQUFaO0FBQ0EsTUFBSUEsU0FBU0ksTUFBVCxLQUFvQixXQUF4QixFQUFxQztBQUNwQyxPQUFJQyxVQUFVTCxTQUFTTSxZQUFULENBQXNCQyxhQUFwQztBQUNBaEUsVUFBT29ELGNBQVAsR0FBd0IsS0FBeEI7QUFDQSxPQUFJRSxRQUFRLFVBQVosRUFBd0I7QUFDdkIsUUFBSVEsUUFBUWhGLE9BQVIsQ0FBZ0IsWUFBaEIsS0FBaUMsQ0FBckMsRUFBd0M7QUFDdkNtRixVQUNDLGlCQURELEVBRUMsbURBRkQsRUFHQyxTQUhELEVBSUVDLElBSkY7QUFLQSxLQU5ELE1BTU87QUFDTkQsVUFDQyxpQkFERCxFQUVDLGlEQUZELEVBR0MsT0FIRCxFQUlFQyxJQUpGO0FBS0E7QUFDRCxJQWRELE1BY08sSUFBSVosUUFBUSxhQUFaLEVBQTJCO0FBQ2pDLFFBQUlRLFFBQVFoRixPQUFSLENBQWdCLFlBQWhCLElBQWdDLENBQXBDLEVBQXVDO0FBQ3RDbUYsVUFBSztBQUNKRSxhQUFPLGlCQURIO0FBRUpDLFlBQU0sK0dBRkY7QUFHSmQsWUFBTTtBQUhGLE1BQUwsRUFJR1ksSUFKSDtBQUtBLEtBTkQsTUFNTztBQUNOOUUsUUFBR2lFLFVBQUgsR0FBZ0IsSUFBaEI7QUFDQWdCLFVBQUtoRSxJQUFMLENBQVVpRCxJQUFWO0FBQ0E7QUFDRCxJQVhNLE1BV0E7QUFDTm5GLFlBQVFDLEdBQVIsQ0FBWTBGLE9BQVo7QUFDQSxRQUFJQSxRQUFRaEYsT0FBUixDQUFnQixZQUFoQixLQUFpQyxDQUFqQyxJQUFzQ2dGLFFBQVFoRixPQUFSLENBQWdCLGNBQWhCLEtBQW1DLENBQTdFLEVBQWdGO0FBQy9FTSxRQUFHaUUsVUFBSCxHQUFnQixJQUFoQjtBQUNBZ0IsVUFBS2hFLElBQUwsQ0FBVWlELElBQVY7QUFDQSxLQUhELE1BR087QUFDTlcsVUFBSztBQUNKRSxhQUFPLG9CQURIO0FBRUpDLFlBQU0sMkhBRkY7QUFHSmQsWUFBTTtBQUhGLE1BQUwsRUFJR1ksSUFKSDtBQUtBO0FBQ0Q7QUFDRCxHQXpDRCxNQXlDTztBQUNOWCxNQUFHQyxLQUFILENBQVMsVUFBVUMsUUFBVixFQUFvQjtBQUM1QnJFLE9BQUdzRSxRQUFILENBQVlELFFBQVo7QUFDQSxJQUZELEVBRUc7QUFDRkUsV0FBTzNELE9BQU9rRCxJQURaO0FBRUZVLG1CQUFlO0FBRmIsSUFGSDtBQU1BO0FBQ0QsRUFwRU87QUFxRVJ2RSxnQkFBZSx5QkFBTTtBQUNwQmtFLEtBQUdDLEtBQUgsQ0FBUyxVQUFVQyxRQUFWLEVBQW9CO0FBQzVCckUsTUFBR2tGLGlCQUFILENBQXFCYixRQUFyQjtBQUNBLEdBRkQsRUFFRztBQUNGRSxVQUFPM0QsT0FBT2tELElBRFo7QUFFRlUsa0JBQWU7QUFGYixHQUZIO0FBTUEsRUE1RU87QUE2RVJVLG9CQUFtQiwyQkFBQ2IsUUFBRCxFQUFjO0FBQ2hDLE1BQUlBLFNBQVNJLE1BQVQsS0FBb0IsV0FBeEIsRUFBcUM7QUFDcEM3RCxVQUFPb0QsY0FBUCxHQUF3QixJQUF4QjtBQUNBLE9BQUlLLFNBQVNNLFlBQVQsQ0FBc0JDLGFBQXRCLENBQW9DbEYsT0FBcEMsQ0FBNEMsWUFBNUMsSUFBNEQsQ0FBaEUsRUFBbUU7QUFDbEVtRixTQUFLO0FBQ0pFLFlBQU8saUJBREg7QUFFSkMsV0FBTSwrR0FGRjtBQUdKZCxXQUFNO0FBSEYsS0FBTCxFQUlHWSxJQUpIO0FBS0EsSUFORCxNQU1PO0FBQ04sUUFBSUssV0FBVy9FLEtBQUtDLEtBQUwsQ0FBV0MsYUFBYTZFLFFBQXhCLENBQWY7QUFDQSxRQUFJQSxTQUFTakIsSUFBVCxLQUFrQixVQUF0QixFQUFrQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FsRSxRQUFHb0YsTUFBSDtBQUNBLEtBYkQsTUFhTyxJQUFJRCxTQUFTakIsSUFBVCxLQUFrQixPQUF0QixFQUErQjtBQUNyQ2xFLFFBQUdvRixNQUFIO0FBQ0EsS0FGTSxNQUVBO0FBQ05wRixRQUFHb0YsTUFBSDtBQUNBO0FBQ0Q7QUFDRCxHQTdCRCxNQTZCTztBQUNOakIsTUFBR0MsS0FBSCxDQUFTLFVBQVVDLFFBQVYsRUFBb0I7QUFDNUJyRSxPQUFHa0YsaUJBQUgsQ0FBcUJiLFFBQXJCO0FBQ0EsSUFGRCxFQUVHO0FBQ0ZFLFdBQU8zRCxPQUFPa0QsSUFEWjtBQUVGVSxtQkFBZTtBQUZiLElBRkg7QUFNQTtBQUNELEVBbkhPO0FBb0hSWSxTQUFRLGtCQUFNO0FBQ2JuRyxJQUFFLG9CQUFGLEVBQXdCbUMsUUFBeEIsQ0FBaUMsTUFBakM7QUFDQSxNQUFJK0QsV0FBVy9FLEtBQUtDLEtBQUwsQ0FBV0MsYUFBYTZFLFFBQXhCLENBQWY7QUFDQSxNQUFJakYsUUFBUTtBQUNYQyxZQUFTZ0YsU0FBU2hGLE9BRFA7QUFFWFAsU0FBTVEsS0FBS0MsS0FBTCxDQUFXcEIsRUFBRSxTQUFGLEVBQWFDLEdBQWIsRUFBWDtBQUZLLEdBQVo7QUFJQVUsT0FBS1ksR0FBTCxHQUFXTixLQUFYO0FBQ0FOLE9BQUthLE1BQUwsQ0FBWWIsS0FBS1ksR0FBakI7QUFDQTtBQTdITyxDQUFUOztBQWdJQSxJQUFJWixPQUFPO0FBQ1ZZLE1BQUssRUFESztBQUVWNkUsU0FBUSxFQUZFO0FBR1ZDLFlBQVcsQ0FIRDtBQUlWekYsWUFBVyxLQUpEO0FBS1ZvQixPQUFNLGdCQUFNO0FBQ1hoQyxJQUFFLGFBQUYsRUFBaUJzRyxTQUFqQixHQUE2QkMsT0FBN0I7QUFDQXZHLElBQUUsWUFBRixFQUFnQndHLElBQWhCO0FBQ0F4RyxJQUFFLG1CQUFGLEVBQXVCcUMsSUFBdkIsQ0FBNEIsVUFBNUI7QUFDQTFCLE9BQUswRixTQUFMLEdBQWlCLENBQWpCO0FBQ0EsTUFBSSxDQUFDM0csT0FBTCxFQUFjO0FBQ2JpQixRQUFLWSxHQUFMLEdBQVcsRUFBWDtBQUNBO0FBQ0QsRUFiUztBQWNWdUIsUUFBTyxlQUFDa0QsSUFBRCxFQUFVO0FBQ2hCaEcsSUFBRSxVQUFGLEVBQWNVLFdBQWQsQ0FBMEIsTUFBMUI7QUFDQVYsSUFBRSxZQUFGLEVBQWdCcUMsSUFBaEIsQ0FBcUIyRCxLQUFLUyxNQUExQjtBQUNBOUYsT0FBSytGLEdBQUwsQ0FBU1YsSUFBVCxFQUFlVyxJQUFmLENBQW9CLFVBQUNDLEdBQUQsRUFBUztBQUM1QjtBQUNBLE9BQUlaLEtBQUtmLElBQUwsSUFBYSxjQUFqQixFQUFpQztBQUNoQ2UsU0FBS3JGLElBQUwsR0FBWSxFQUFaO0FBQ0E7QUFKMkI7QUFBQTtBQUFBOztBQUFBO0FBSzVCLHlCQUFjaUcsR0FBZCw4SEFBbUI7QUFBQSxTQUFWQyxDQUFVOztBQUNsQmIsVUFBS3JGLElBQUwsQ0FBVW1HLElBQVYsQ0FBZUQsQ0FBZjtBQUNBO0FBUDJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBUTVCbEcsUUFBS2EsTUFBTCxDQUFZd0UsSUFBWjtBQUNBLEdBVEQ7QUFVQSxFQTNCUztBQTRCVlUsTUFBSyxhQUFDVixJQUFELEVBQVU7QUFDZCxTQUFPLElBQUllLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdkMsT0FBSWhHLFFBQVEsRUFBWjtBQUNBLE9BQUlpRyxnQkFBZ0IsRUFBcEI7QUFDQSxPQUFJaEcsVUFBVThFLEtBQUs5RSxPQUFuQjtBQUNBLE9BQUk4RSxLQUFLZixJQUFMLEtBQWMsT0FBbEIsRUFBMkIvRCxVQUFVLE9BQVY7QUFDM0IsT0FBSThFLEtBQUtmLElBQUwsS0FBYyxPQUFkLElBQXlCZSxLQUFLOUUsT0FBTCxLQUFpQixXQUE5QyxFQUEyRDhFLEtBQUtTLE1BQUwsR0FBY1QsS0FBS21CLE1BQW5CO0FBQzNELE9BQUl4RixPQUFPRyxLQUFYLEVBQWtCa0UsS0FBSzlFLE9BQUwsR0FBZSxPQUFmO0FBQ2xCcEIsV0FBUUMsR0FBUixDQUFlNEIsT0FBTzhDLFVBQVAsQ0FBa0J2RCxPQUFsQixDQUFmLFNBQTZDOEUsS0FBS1MsTUFBbEQsU0FBNERULEtBQUs5RSxPQUFqRSxlQUFrRlMsT0FBTzZDLEtBQVAsQ0FBYXdCLEtBQUs5RSxPQUFsQixDQUFsRixnQkFBdUhTLE9BQU91QyxLQUFQLENBQWE4QixLQUFLOUUsT0FBbEIsRUFBMkJrRyxRQUEzQixFQUF2SDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBbEMsTUFBR21DLEdBQUgsQ0FBVTFGLE9BQU84QyxVQUFQLENBQWtCdkQsT0FBbEIsQ0FBVixTQUF3QzhFLEtBQUtTLE1BQTdDLFNBQXVEVCxLQUFLOUUsT0FBNUQsZUFBNkVTLE9BQU82QyxLQUFQLENBQWF3QixLQUFLOUUsT0FBbEIsQ0FBN0UsZUFBaUhTLE9BQU9DLEtBQXhILGdCQUF3SUQsT0FBT3VDLEtBQVAsQ0FBYThCLEtBQUs5RSxPQUFsQixFQUEyQmtHLFFBQTNCLEVBQXhJLHNCQUE4THpGLE9BQU9tRCxTQUFyTSxpQkFBNE4sVUFBQzhCLEdBQUQsRUFBUztBQUNwT2pHLFNBQUswRixTQUFMLElBQWtCTyxJQUFJakcsSUFBSixDQUFTOEMsTUFBM0I7QUFDQXpELE1BQUUsbUJBQUYsRUFBdUJxQyxJQUF2QixDQUE0QixVQUFVMUIsS0FBSzBGLFNBQWYsR0FBMkIsU0FBdkQ7QUFGb087QUFBQTtBQUFBOztBQUFBO0FBR3BPLDJCQUFjTyxJQUFJakcsSUFBbEIsbUlBQXdCO0FBQUEsVUFBZjJHLENBQWU7O0FBQ3ZCLFVBQUl0QixLQUFLOUUsT0FBTCxJQUFnQixXQUFoQixJQUErQlMsT0FBT0csS0FBMUMsRUFBaUQ7QUFDaER3RixTQUFFQyxJQUFGLEdBQVM7QUFDUkMsWUFBSUYsRUFBRUUsRUFERTtBQUVSQyxjQUFNSCxFQUFFRztBQUZBLFFBQVQ7QUFJQTtBQUNELFVBQUk5RixPQUFPRyxLQUFYLEVBQWtCd0YsRUFBRXJDLElBQUYsR0FBUyxNQUFUO0FBQ2xCLFVBQUlxQyxFQUFFQyxJQUFOLEVBQVk7QUFDWHRHLGFBQU02RixJQUFOLENBQVdRLENBQVg7QUFDQSxPQUZELE1BRU87QUFDTjtBQUNBQSxTQUFFQyxJQUFGLEdBQVM7QUFDUkMsWUFBSUYsRUFBRUUsRUFERTtBQUVSQyxjQUFNSCxFQUFFRTtBQUZBLFFBQVQ7QUFJQSxXQUFJRixFQUFFSSxZQUFOLEVBQW9CO0FBQ25CSixVQUFFSyxZQUFGLEdBQWlCTCxFQUFFSSxZQUFuQjtBQUNBO0FBQ0R6RyxhQUFNNkYsSUFBTixDQUFXUSxDQUFYO0FBQ0E7QUFDRDtBQXhCbU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUF5QnBPLFFBQUlWLElBQUlqRyxJQUFKLENBQVM4QyxNQUFULEdBQWtCLENBQWxCLElBQXVCbUQsSUFBSWdCLE1BQUosQ0FBV0MsSUFBdEMsRUFBNEM7QUFDM0NDLGFBQVFsQixJQUFJZ0IsTUFBSixDQUFXQyxJQUFuQjtBQUNBLEtBRkQsTUFFTztBQUNOYixhQUFRL0YsS0FBUjtBQUNBO0FBQ0QsSUE5QkQ7O0FBZ0NBLFlBQVM2RyxPQUFULENBQWlCbEksR0FBakIsRUFBaUM7QUFBQSxRQUFYNEUsS0FBVyx1RUFBSCxDQUFHOztBQUNoQyxRQUFJQSxVQUFVLENBQWQsRUFBaUI7QUFDaEI1RSxXQUFNQSxJQUFJbUksT0FBSixDQUFZLFdBQVosRUFBeUIsV0FBV3ZELEtBQXBDLENBQU47QUFDQTtBQUNEeEUsTUFBRWdJLE9BQUYsQ0FBVXBJLEdBQVYsRUFBZSxVQUFVZ0gsR0FBVixFQUFlO0FBQzdCakcsVUFBSzBGLFNBQUwsSUFBa0JPLElBQUlqRyxJQUFKLENBQVM4QyxNQUEzQjtBQUNBekQsT0FBRSxtQkFBRixFQUF1QnFDLElBQXZCLENBQTRCLFVBQVUxQixLQUFLMEYsU0FBZixHQUEyQixTQUF2RDtBQUY2QjtBQUFBO0FBQUE7O0FBQUE7QUFHN0IsNEJBQWNPLElBQUlqRyxJQUFsQixtSUFBd0I7QUFBQSxXQUFmMkcsQ0FBZTs7QUFDdkIsV0FBSUEsRUFBRUUsRUFBTixFQUFVO0FBQ1QsWUFBSXhCLEtBQUs5RSxPQUFMLElBQWdCLFdBQWhCLElBQStCUyxPQUFPRyxLQUExQyxFQUFpRDtBQUNoRHdGLFdBQUVDLElBQUYsR0FBUztBQUNSQyxjQUFJRixFQUFFRSxFQURFO0FBRVJDLGdCQUFNSCxFQUFFRztBQUZBLFVBQVQ7QUFJQTtBQUNELFlBQUlILEVBQUVDLElBQU4sRUFBWTtBQUNYdEcsZUFBTTZGLElBQU4sQ0FBV1EsQ0FBWDtBQUNBLFNBRkQsTUFFTztBQUNOO0FBQ0FBLFdBQUVDLElBQUYsR0FBUztBQUNSQyxjQUFJRixFQUFFRSxFQURFO0FBRVJDLGdCQUFNSCxFQUFFRTtBQUZBLFVBQVQ7QUFJQSxhQUFJRixFQUFFSSxZQUFOLEVBQW9CO0FBQ25CSixZQUFFSyxZQUFGLEdBQWlCTCxFQUFFSSxZQUFuQjtBQUNBO0FBQ0R6RyxlQUFNNkYsSUFBTixDQUFXUSxDQUFYO0FBQ0E7QUFDRDtBQUNEO0FBekI0QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQTBCN0IsU0FBSVYsSUFBSWpHLElBQUosQ0FBUzhDLE1BQVQsR0FBa0IsQ0FBbEIsSUFBdUJtRCxJQUFJZ0IsTUFBSixDQUFXQyxJQUF0QyxFQUE0QztBQUMzQ0MsY0FBUWxCLElBQUlnQixNQUFKLENBQVdDLElBQW5CO0FBQ0EsTUFGRCxNQUVPO0FBQ05iLGNBQVEvRixLQUFSO0FBQ0E7QUFDRCxLQS9CRCxFQStCR2dILElBL0JILENBK0JRLFlBQU07QUFDYkgsYUFBUWxJLEdBQVIsRUFBYSxHQUFiO0FBQ0EsS0FqQ0Q7QUFrQ0E7QUFDRCxHQXRGTSxDQUFQO0FBdUZBLEVBcEhTO0FBcUhWNEIsU0FBUSxnQkFBQ3dFLElBQUQsRUFBVTtBQUNqQmhHLElBQUUsVUFBRixFQUFjbUMsUUFBZCxDQUF1QixNQUF2QjtBQUNBbkMsSUFBRSxhQUFGLEVBQWlCVSxXQUFqQixDQUE2QixNQUE3QjtBQUNBVixJQUFFLDJCQUFGLEVBQStCa0ksT0FBL0I7QUFDQWxJLElBQUUsY0FBRixFQUFrQm1JLFNBQWxCO0FBQ0F2QyxPQUFLLEtBQUwsRUFBWSxPQUFaLEVBQXFCLFNBQXJCLEVBQWdDQyxJQUFoQztBQUNBbEYsT0FBS1ksR0FBTCxHQUFXeUUsSUFBWDtBQUNBckYsT0FBS2dDLE1BQUwsQ0FBWWhDLEtBQUtZLEdBQWpCLEVBQXNCLElBQXRCO0FBQ0FVLEtBQUdtRyxLQUFIO0FBQ0EsRUE5SFM7QUErSFZ6RixTQUFRLGdCQUFDMEYsT0FBRCxFQUErQjtBQUFBLE1BQXJCQyxRQUFxQix1RUFBVixLQUFVOztBQUN0QyxNQUFJQyxjQUFjdkksRUFBRSxTQUFGLEVBQWF3SSxJQUFiLENBQWtCLFNBQWxCLENBQWxCO0FBQ0EsTUFBSUMsUUFBUXpJLEVBQUUsTUFBRixFQUFVd0ksSUFBVixDQUFlLFNBQWYsQ0FBWjtBQUNBLE1BQUk3RyxPQUFPb0QsY0FBUCxLQUEwQixLQUExQixJQUFtQ3NELFFBQVFuSCxPQUFSLEtBQW9CLFVBQTNELEVBQXVFO0FBQ3RFbUgsV0FBUTFILElBQVIsR0FBZTBILFFBQVExSCxJQUFSLENBQWFnQyxNQUFiLENBQW9CLGdCQUFRO0FBQzFDLFdBQU8rRixLQUFLQyxTQUFMLEtBQW1CLEtBQTFCO0FBQ0EsSUFGYyxDQUFmO0FBR0E7QUFDRCxNQUFJQyxVQUFVakcsUUFBT2tHLFdBQVAsaUJBQW1CUixPQUFuQixFQUE0QkUsV0FBNUIsRUFBeUNFLEtBQXpDLDRCQUFtREssVUFBVW5ILE9BQU9nQixNQUFqQixDQUFuRCxHQUFkO0FBQ0EwRixVQUFRVSxRQUFSLEdBQW1CSCxPQUFuQjtBQUNBLE1BQUlOLGFBQWEsSUFBakIsRUFBdUI7QUFDdEI5RixTQUFNOEYsUUFBTixDQUFlRCxPQUFmO0FBQ0EsR0FGRCxNQUVPO0FBQ04sVUFBT0EsT0FBUDtBQUNBO0FBQ0QsRUE5SVM7QUErSVYxRSxRQUFPLGVBQUNwQyxHQUFELEVBQVM7QUFDZixNQUFJeUgsU0FBUyxFQUFiO0FBQ0EsTUFBSXJJLEtBQUtDLFNBQVQsRUFBb0I7QUFDbkJaLEtBQUVpSixJQUFGLENBQU8xSCxJQUFJWixJQUFYLEVBQWlCLFVBQVVrRyxDQUFWLEVBQWE7QUFDN0IsUUFBSXFDLE1BQU07QUFDVCxXQUFNckMsSUFBSSxDQUREO0FBRVQsYUFBUSw2QkFBNkIsS0FBS1UsSUFBTCxDQUFVQyxFQUZ0QztBQUdULFdBQU0sS0FBS0QsSUFBTCxDQUFVRSxJQUhQO0FBSVQsYUFBUSxLQUFLMEIsUUFKSjtBQUtULGFBQVEsS0FBS0MsS0FMSjtBQU1ULGNBQVMsS0FBS0M7QUFOTCxLQUFWO0FBUUFMLFdBQU9sQyxJQUFQLENBQVlvQyxHQUFaO0FBQ0EsSUFWRDtBQVdBLEdBWkQsTUFZTztBQUNObEosS0FBRWlKLElBQUYsQ0FBTzFILElBQUlaLElBQVgsRUFBaUIsVUFBVWtHLENBQVYsRUFBYTtBQUM3QixRQUFJcUMsTUFBTTtBQUNULFdBQU1yQyxJQUFJLENBREQ7QUFFVCxhQUFRLDZCQUE2QixLQUFLVSxJQUFMLENBQVVDLEVBRnRDO0FBR1QsV0FBTSxLQUFLRCxJQUFMLENBQVVFLElBSFA7QUFJVCxXQUFNLEtBQUt4QyxJQUFMLElBQWEsRUFKVjtBQUtULGFBQVEsS0FBS3FFLE9BQUwsSUFBZ0IsS0FBS0YsS0FMcEI7QUFNVCxhQUFRRyxjQUFjLEtBQUs1QixZQUFuQjtBQU5DLEtBQVY7QUFRQXFCLFdBQU9sQyxJQUFQLENBQVlvQyxHQUFaO0FBQ0EsSUFWRDtBQVdBO0FBQ0QsU0FBT0YsTUFBUDtBQUNBLEVBM0tTO0FBNEtWbEYsU0FBUSxpQkFBQzBGLElBQUQsRUFBVTtBQUNqQixNQUFJQyxTQUFTLElBQUlDLFVBQUosRUFBYjs7QUFFQUQsU0FBT0UsTUFBUCxHQUFnQixVQUFVQyxLQUFWLEVBQWlCO0FBQ2hDLE9BQUlDLE1BQU1ELE1BQU1FLE1BQU4sQ0FBYUMsTUFBdkI7QUFDQXBKLFFBQUtZLEdBQUwsR0FBV0osS0FBS0MsS0FBTCxDQUFXeUksR0FBWCxDQUFYO0FBQ0FsSixRQUFLYSxNQUFMLENBQVliLEtBQUtZLEdBQWpCO0FBQ0EsR0FKRDs7QUFNQWtJLFNBQU9PLFVBQVAsQ0FBa0JSLElBQWxCO0FBQ0E7QUF0TFMsQ0FBWDs7QUF5TEEsSUFBSWhILFFBQVE7QUFDWDhGLFdBQVUsa0JBQUMyQixPQUFELEVBQWE7QUFDdEJqSyxJQUFFLGFBQUYsRUFBaUJzRyxTQUFqQixHQUE2QkMsT0FBN0I7QUFDQSxNQUFJMkQsYUFBYUQsUUFBUWxCLFFBQXpCO0FBQ0EsTUFBSW9CLFFBQVEsRUFBWjtBQUNBLE1BQUlDLFFBQVEsRUFBWjtBQUNBLE1BQUlDLE1BQU1ySyxFQUFFLFVBQUYsRUFBY3dJLElBQWQsQ0FBbUIsU0FBbkIsQ0FBVjtBQUNBLE1BQUl5QixRQUFRL0ksT0FBUixLQUFvQixXQUFwQixJQUFtQ1MsT0FBT0csS0FBOUMsRUFBcUQ7QUFDcERxSTtBQUdBLEdBSkQsTUFJTyxJQUFJRixRQUFRL0ksT0FBUixLQUFvQixhQUF4QixFQUF1QztBQUM3Q2lKO0FBSUEsR0FMTSxNQUtBLElBQUlGLFFBQVEvSSxPQUFSLEtBQW9CLFFBQXhCLEVBQWtDO0FBQ3hDaUo7QUFHQSxHQUpNLE1BSUE7QUFDTkE7QUFLQTs7QUFFRCxNQUFJRyxPQUFPLDBCQUFYO0FBQ0EsTUFBSTNKLEtBQUtZLEdBQUwsQ0FBUzBELElBQVQsS0FBa0IsY0FBdEIsRUFBc0NxRixPQUFPdEssRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsS0FBNEIsaUJBQW5DOztBQTVCaEI7QUFBQTtBQUFBOztBQUFBO0FBOEJ0Qix5QkFBcUJpSyxXQUFXSyxPQUFYLEVBQXJCLG1JQUEyQztBQUFBO0FBQUEsUUFBakNDLENBQWlDO0FBQUEsUUFBOUJ2SyxHQUE4Qjs7QUFDMUMsUUFBSXdLLFVBQVUsRUFBZDtBQUNBLFFBQUlKLEdBQUosRUFBUztBQUNSSSx5REFBaUR4SyxJQUFJc0gsSUFBSixDQUFTQyxFQUExRDtBQUNBO0FBQ0QsUUFBSWtELGVBQVlGLElBQUUsQ0FBZCwyREFDbUN2SyxJQUFJc0gsSUFBSixDQUFTQyxFQUQ1Qyw0QkFDbUVpRCxPQURuRSxHQUM2RXhLLElBQUlzSCxJQUFKLENBQVNFLElBRHRGLGNBQUo7QUFFQSxRQUFJd0MsUUFBUS9JLE9BQVIsS0FBb0IsV0FBcEIsSUFBbUNTLE9BQU9HLEtBQTlDLEVBQXFEO0FBQ3BENEkseURBQStDekssSUFBSWdGLElBQW5ELGtCQUFtRWhGLElBQUlnRixJQUF2RTtBQUNBLEtBRkQsTUFFTyxJQUFJZ0YsUUFBUS9JLE9BQVIsS0FBb0IsYUFBeEIsRUFBdUM7QUFDN0N3Siw0RUFBa0V6SyxJQUFJdUgsRUFBdEUsNkJBQTZGdkgsSUFBSW1KLEtBQWpHLGdEQUNxQkcsY0FBY3RKLElBQUkwSCxZQUFsQixDQURyQjtBQUVBLEtBSE0sTUFHQSxJQUFJc0MsUUFBUS9JLE9BQVIsS0FBb0IsUUFBeEIsRUFBa0M7QUFDeEN3SixvQkFBWUYsSUFBRSxDQUFkLGlFQUMwQ3ZLLElBQUlzSCxJQUFKLENBQVNDLEVBRG5ELDRCQUMwRXZILElBQUlzSCxJQUFKLENBQVNFLElBRG5GLG1DQUVTeEgsSUFBSTBLLEtBRmI7QUFHQSxLQUpNLE1BSUE7QUFDTixTQUFJQyxPQUFPM0ssSUFBSXVILEVBQWY7QUFDQSxTQUFJN0YsT0FBT29ELGNBQVgsRUFBMkI7QUFDMUI2RixhQUFPM0ssSUFBSWtKLFFBQVg7QUFDQTtBQUNEdUIsb0RBQTBDSixJQUExQyxHQUFpRE0sSUFBakQsNkJBQTBFM0ssSUFBSXFKLE9BQTlFLCtCQUNNckosSUFBSW9KLFVBRFYsNENBRXFCRSxjQUFjdEosSUFBSTBILFlBQWxCLENBRnJCO0FBR0E7QUFDRCxRQUFJa0QsY0FBWUgsRUFBWixVQUFKO0FBQ0FOLGFBQVNTLEVBQVQ7QUFDQTtBQXpEcUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUEwRHRCLE1BQUlDLDBDQUFzQ1gsS0FBdEMsNEJBQWtFQyxLQUFsRSxhQUFKO0FBQ0FwSyxJQUFFLGFBQUYsRUFBaUIrRixJQUFqQixDQUFzQixFQUF0QixFQUEwQjdGLE1BQTFCLENBQWlDNEssTUFBakM7O0FBR0FDOztBQUVBLFdBQVNBLE1BQVQsR0FBa0I7QUFDakJ2TCxXQUFRUSxFQUFFLGFBQUYsRUFBaUJzRyxTQUFqQixDQUEyQjtBQUNsQyxrQkFBYyxJQURvQjtBQUVsQyxpQkFBYSxJQUZxQjtBQUdsQyxvQkFBZ0I7QUFIa0IsSUFBM0IsQ0FBUjs7QUFNQXRHLEtBQUUsYUFBRixFQUFpQnVDLEVBQWpCLENBQW9CLG1CQUFwQixFQUF5QyxZQUFZO0FBQ3BEL0MsVUFDRXdMLE9BREYsQ0FDVSxDQURWLEVBRUV4SyxNQUZGLENBRVMsS0FBS3lLLEtBRmQsRUFHRUMsSUFIRjtBQUlBLElBTEQ7QUFNQWxMLEtBQUUsZ0JBQUYsRUFBb0J1QyxFQUFwQixDQUF1QixtQkFBdkIsRUFBNEMsWUFBWTtBQUN2RC9DLFVBQ0V3TCxPQURGLENBQ1UsQ0FEVixFQUVFeEssTUFGRixDQUVTLEtBQUt5SyxLQUZkLEVBR0VDLElBSEY7QUFJQXZKLFdBQU9nQixNQUFQLENBQWNnQyxJQUFkLEdBQXFCLEtBQUtzRyxLQUExQjtBQUNBLElBTkQ7QUFPQTtBQUNELEVBdEZVO0FBdUZYeEksT0FBTSxnQkFBTTtBQUNYOUIsT0FBS2dDLE1BQUwsQ0FBWWhDLEtBQUtZLEdBQWpCLEVBQXNCLElBQXRCO0FBQ0E7QUF6RlUsQ0FBWjs7QUE0RkEsSUFBSVEsU0FBUztBQUNacEIsT0FBTSxFQURNO0FBRVp3SyxRQUFPLEVBRks7QUFHWkMsTUFBSyxDQUhPO0FBSVpDLFNBQVEsS0FKSTtBQUtaQyxPQUFNLEVBTE07QUFNWnRKLE9BQU0sZ0JBQU07QUFDWCxNQUFJbUksUUFBUW5LLEVBQUUsbUJBQUYsRUFBdUIrRixJQUF2QixFQUFaO0FBQ0EvRixJQUFFLHdCQUFGLEVBQTRCK0YsSUFBNUIsQ0FBaUNvRSxLQUFqQztBQUNBbkssSUFBRSx3QkFBRixFQUE0QitGLElBQTVCLENBQWlDLEVBQWpDO0FBQ0FoRSxTQUFPcEIsSUFBUCxHQUFjQSxLQUFLZ0MsTUFBTCxDQUFZaEMsS0FBS1ksR0FBakIsQ0FBZDtBQUNBUSxTQUFPb0osS0FBUCxHQUFlLEVBQWY7QUFDQXBKLFNBQU91SixJQUFQLEdBQWMsRUFBZDtBQUNBdkosU0FBT3FKLEdBQVAsR0FBYSxDQUFiO0FBQ0EsTUFBSXBMLEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLE1BQTZCLEVBQWpDLEVBQXFDO0FBQ3BDdUMsU0FBTUMsSUFBTjtBQUNBO0FBQ0QsTUFBSXpDLEVBQUUsWUFBRixFQUFnQmtDLFFBQWhCLENBQXlCLFFBQXpCLENBQUosRUFBd0M7QUFDdkNILFVBQU9zSixNQUFQLEdBQWdCLElBQWhCO0FBQ0FyTCxLQUFFLHFCQUFGLEVBQXlCaUosSUFBekIsQ0FBOEIsWUFBWTtBQUN6QyxRQUFJc0MsSUFBSUMsU0FBU3hMLEVBQUUsSUFBRixFQUFReUwsSUFBUixDQUFhLHNCQUFiLEVBQXFDeEwsR0FBckMsRUFBVCxDQUFSO0FBQ0EsUUFBSXlMLElBQUkxTCxFQUFFLElBQUYsRUFBUXlMLElBQVIsQ0FBYSxvQkFBYixFQUFtQ3hMLEdBQW5DLEVBQVI7QUFDQSxRQUFJc0wsSUFBSSxDQUFSLEVBQVc7QUFDVnhKLFlBQU9xSixHQUFQLElBQWNJLFNBQVNELENBQVQsQ0FBZDtBQUNBeEosWUFBT3VKLElBQVAsQ0FBWXhFLElBQVosQ0FBaUI7QUFDaEIsY0FBUTRFLENBRFE7QUFFaEIsYUFBT0g7QUFGUyxNQUFqQjtBQUlBO0FBQ0QsSUFWRDtBQVdBLEdBYkQsTUFhTztBQUNOeEosVUFBT3FKLEdBQVAsR0FBYXBMLEVBQUUsVUFBRixFQUFjQyxHQUFkLEVBQWI7QUFDQTtBQUNEOEIsU0FBTzRKLEVBQVA7QUFDQSxFQWxDVztBQW1DWkEsS0FBSSxjQUFNO0FBQ1Q1SixTQUFPb0osS0FBUCxHQUFlUyxlQUFlN0osT0FBT3BCLElBQVAsQ0FBWW9JLFFBQVosQ0FBcUJ0RixNQUFwQyxFQUE0Q29JLE1BQTVDLENBQW1ELENBQW5ELEVBQXNEOUosT0FBT3FKLEdBQTdELENBQWY7QUFDQSxNQUFJTixTQUFTLEVBQWI7QUFDQS9JLFNBQU9vSixLQUFQLENBQWFXLEdBQWIsQ0FBaUIsVUFBQzdMLEdBQUQsRUFBTThMLEtBQU4sRUFBZ0I7QUFDaENqQixhQUFVLGtCQUFrQmlCLFFBQVEsQ0FBMUIsSUFBK0IsS0FBL0IsR0FBdUMvTCxFQUFFLGFBQUYsRUFBaUJzRyxTQUFqQixHQUE2QjBGLElBQTdCLENBQWtDO0FBQ2xGeEwsWUFBUTtBQUQwRSxJQUFsQyxFQUU5Q3lMLEtBRjhDLEdBRXRDaE0sR0FGc0MsRUFFakNpTSxTQUZOLEdBRWtCLE9BRjVCO0FBR0EsR0FKRDtBQUtBbE0sSUFBRSx3QkFBRixFQUE0QitGLElBQTVCLENBQWlDK0UsTUFBakM7QUFDQTlLLElBQUUsMkJBQUYsRUFBK0JtQyxRQUEvQixDQUF3QyxTQUF4Qzs7QUFFQSxNQUFJSixPQUFPc0osTUFBWCxFQUFtQjtBQUNsQixPQUFJYyxNQUFNLENBQVY7QUFDQSxRQUFLLElBQUlDLENBQVQsSUFBY3JLLE9BQU91SixJQUFyQixFQUEyQjtBQUMxQixRQUFJZSxNQUFNck0sRUFBRSxxQkFBRixFQUF5QnNNLEVBQXpCLENBQTRCSCxHQUE1QixDQUFWO0FBQ0FuTSx3RUFBK0MrQixPQUFPdUosSUFBUCxDQUFZYyxDQUFaLEVBQWUzRSxJQUE5RCxzQkFBOEUxRixPQUFPdUosSUFBUCxDQUFZYyxDQUFaLEVBQWVoQixHQUE3RiwrQkFBdUhtQixZQUF2SCxDQUFvSUYsR0FBcEk7QUFDQUYsV0FBUXBLLE9BQU91SixJQUFQLENBQVljLENBQVosRUFBZWhCLEdBQWYsR0FBcUIsQ0FBN0I7QUFDQTtBQUNEcEwsS0FBRSxZQUFGLEVBQWdCVSxXQUFoQixDQUE0QixRQUE1QjtBQUNBVixLQUFFLFdBQUYsRUFBZVUsV0FBZixDQUEyQixTQUEzQjtBQUNBVixLQUFFLGNBQUYsRUFBa0JVLFdBQWxCLENBQThCLFFBQTlCO0FBQ0E7QUFDRFYsSUFBRSxZQUFGLEVBQWdCRyxNQUFoQixDQUF1QixJQUF2QjtBQUNBLEVBMURXO0FBMkRacU0sZ0JBQWUseUJBQU07QUFDcEIsTUFBSUMsS0FBSyxFQUFUO0FBQ0EsTUFBSUMsU0FBUyxFQUFiO0FBQ0ExTSxJQUFFLHFCQUFGLEVBQXlCaUosSUFBekIsQ0FBOEIsVUFBVThDLEtBQVYsRUFBaUI5TCxHQUFqQixFQUFzQjtBQUNuRCxPQUFJa0wsUUFBUSxFQUFaO0FBQ0EsT0FBSWxMLElBQUkwTSxZQUFKLENBQWlCLE9BQWpCLENBQUosRUFBK0I7QUFDOUJ4QixVQUFNeUIsVUFBTixHQUFtQixLQUFuQjtBQUNBekIsVUFBTTFELElBQU4sR0FBYXpILEVBQUVDLEdBQUYsRUFBT3dMLElBQVAsQ0FBWSxJQUFaLEVBQWtCYSxFQUFsQixDQUFxQixDQUFyQixFQUF3QmIsSUFBeEIsQ0FBNkIsR0FBN0IsRUFBa0NwSixJQUFsQyxFQUFiO0FBQ0E4SSxVQUFNL0UsTUFBTixHQUFlcEcsRUFBRUMsR0FBRixFQUFPd0wsSUFBUCxDQUFZLElBQVosRUFBa0JhLEVBQWxCLENBQXFCLENBQXJCLEVBQXdCYixJQUF4QixDQUE2QixHQUE3QixFQUFrQ29CLElBQWxDLENBQXVDLE1BQXZDLEVBQStDOUUsT0FBL0MsQ0FBdUQsMEJBQXZELEVBQW1GLEVBQW5GLENBQWY7QUFDQW9ELFVBQU03QixPQUFOLEdBQWdCdEosRUFBRUMsR0FBRixFQUFPd0wsSUFBUCxDQUFZLElBQVosRUFBa0JhLEVBQWxCLENBQXFCLENBQXJCLEVBQXdCYixJQUF4QixDQUE2QixHQUE3QixFQUFrQ3BKLElBQWxDLEVBQWhCO0FBQ0E4SSxVQUFNUCxJQUFOLEdBQWE1SyxFQUFFQyxHQUFGLEVBQU93TCxJQUFQLENBQVksSUFBWixFQUFrQmEsRUFBbEIsQ0FBcUIsQ0FBckIsRUFBd0JiLElBQXhCLENBQTZCLEdBQTdCLEVBQWtDb0IsSUFBbEMsQ0FBdUMsTUFBdkMsQ0FBYjtBQUNBMUIsVUFBTTJCLElBQU4sR0FBYTlNLEVBQUVDLEdBQUYsRUFBT3dMLElBQVAsQ0FBWSxJQUFaLEVBQWtCYSxFQUFsQixDQUFxQnRNLEVBQUVDLEdBQUYsRUFBT3dMLElBQVAsQ0FBWSxJQUFaLEVBQWtCaEksTUFBbEIsR0FBMkIsQ0FBaEQsRUFBbURwQixJQUFuRCxFQUFiO0FBQ0EsSUFQRCxNQU9PO0FBQ044SSxVQUFNeUIsVUFBTixHQUFtQixJQUFuQjtBQUNBekIsVUFBTTFELElBQU4sR0FBYXpILEVBQUVDLEdBQUYsRUFBT3dMLElBQVAsQ0FBWSxJQUFaLEVBQWtCcEosSUFBbEIsRUFBYjtBQUNBO0FBQ0RxSyxVQUFPNUYsSUFBUCxDQUFZcUUsS0FBWjtBQUNBLEdBZEQ7QUFIb0I7QUFBQTtBQUFBOztBQUFBO0FBa0JwQix5QkFBY3VCLE1BQWQsbUlBQXNCO0FBQUEsUUFBYjdGLENBQWE7O0FBQ3JCLFFBQUlBLEVBQUUrRixVQUFGLEtBQWlCLElBQXJCLEVBQTJCO0FBQzFCSCx3Q0FBK0I1RixFQUFFWSxJQUFqQztBQUNBLEtBRkQsTUFFTztBQUNOZ0YsaUVBQ29DNUYsRUFBRVQsTUFEdEMsa0VBQ3FHUyxFQUFFVCxNQUR2Ryx3SUFHb0RTLEVBQUVULE1BSHRELDZCQUdpRlMsRUFBRVksSUFIbkYseURBSThCWixFQUFFK0QsSUFKaEMsNkJBSXlEL0QsRUFBRXlDLE9BSjNELHNEQUsyQnpDLEVBQUUrRCxJQUw3Qiw2QkFLc0QvRCxFQUFFaUcsSUFMeEQ7QUFRQTtBQUNEO0FBL0JtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWdDcEI5TSxJQUFFLGVBQUYsRUFBbUJFLE1BQW5CLENBQTBCdU0sRUFBMUI7QUFDQXpNLElBQUUsWUFBRixFQUFnQm1DLFFBQWhCLENBQXlCLE1BQXpCO0FBQ0EsRUE3Rlc7QUE4Rlo0SyxrQkFBaUIsMkJBQU07QUFDdEIvTSxJQUFFLFlBQUYsRUFBZ0JVLFdBQWhCLENBQTRCLE1BQTVCO0FBQ0FWLElBQUUsZUFBRixFQUFtQmdOLEtBQW5CO0FBQ0E7QUFqR1csQ0FBYjs7QUFvR0EsSUFBSWhILE9BQU87QUFDVkEsT0FBTSxFQURJO0FBRVZoRSxPQUFNLGNBQUNpRCxJQUFELEVBQVU7QUFDZnRELFNBQU9tRCxTQUFQLEdBQW1CLEVBQW5CO0FBQ0FrQixPQUFLQSxJQUFMLEdBQVksRUFBWjtBQUNBckYsT0FBS3FCLElBQUw7QUFDQWtELEtBQUdtQyxHQUFILENBQU8sS0FBUCxFQUFjLFVBQVVULEdBQVYsRUFBZTtBQUM1QmpHLFFBQUt5RixNQUFMLEdBQWNRLElBQUlZLEVBQWxCO0FBQ0EsT0FBSTVILE1BQU0sRUFBVjtBQUNBLE9BQUlGLE9BQUosRUFBYTtBQUNaRSxVQUFNb0csS0FBSzlDLE1BQUwsQ0FBWWxELEVBQUUsbUJBQUYsRUFBdUJDLEdBQXZCLEVBQVosQ0FBTjtBQUNBRCxNQUFFLG1CQUFGLEVBQXVCQyxHQUF2QixDQUEyQixFQUEzQjtBQUNBLElBSEQsTUFHTztBQUNOTCxVQUFNb0csS0FBSzlDLE1BQUwsQ0FBWWxELEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQVosQ0FBTjtBQUNBO0FBQ0QsT0FBSUwsSUFBSWEsT0FBSixDQUFZLE9BQVosTUFBeUIsQ0FBQyxDQUExQixJQUErQmIsSUFBSWEsT0FBSixDQUFZLEdBQVosSUFBbUIsQ0FBdEQsRUFBeUQ7QUFDeERiLFVBQU1BLElBQUlxTixTQUFKLENBQWMsQ0FBZCxFQUFpQnJOLElBQUlhLE9BQUosQ0FBWSxHQUFaLENBQWpCLENBQU47QUFDQTtBQUNEdUYsUUFBS1UsR0FBTCxDQUFTOUcsR0FBVCxFQUFjcUYsSUFBZCxFQUFvQjBCLElBQXBCLENBQXlCLFVBQUNYLElBQUQsRUFBVTtBQUNsQ3JGLFNBQUttQyxLQUFMLENBQVdrRCxJQUFYO0FBQ0EsSUFGRDtBQUdBO0FBQ0EsR0FoQkQ7QUFpQkEsRUF2QlM7QUF3QlZVLE1BQUssYUFBQzlHLEdBQUQsRUFBTXFGLElBQU4sRUFBZTtBQUNuQixTQUFPLElBQUk4QixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3ZDLE9BQUloQyxRQUFRLGNBQVosRUFBNEI7QUFDM0IsUUFBSWlJLFVBQVV0TixHQUFkO0FBQ0EsUUFBSXNOLFFBQVF6TSxPQUFSLENBQWdCLEdBQWhCLElBQXVCLENBQTNCLEVBQThCO0FBQzdCeU0sZUFBVUEsUUFBUUQsU0FBUixDQUFrQixDQUFsQixFQUFxQkMsUUFBUXpNLE9BQVIsQ0FBZ0IsR0FBaEIsQ0FBckIsQ0FBVjtBQUNBO0FBQ0R5RSxPQUFHbUMsR0FBSCxPQUFXNkYsT0FBWCxFQUFzQixVQUFVdEcsR0FBVixFQUFlO0FBQ3BDLFNBQUl1RyxNQUFNO0FBQ1QxRyxjQUFRRyxJQUFJd0csU0FBSixDQUFjNUYsRUFEYjtBQUVUdkMsWUFBTUEsSUFGRztBQUdUL0QsZUFBUztBQUhBLE1BQVY7QUFLQVMsWUFBTzZDLEtBQVAsQ0FBYSxVQUFiLElBQTJCLElBQTNCO0FBQ0E3QyxZQUFPQyxLQUFQLEdBQWUsRUFBZjtBQUNBb0YsYUFBUW1HLEdBQVI7QUFDQSxLQVREO0FBVUEsSUFmRCxNQWVPO0FBQ04sUUFBSUUsUUFBUSxTQUFaO0FBQ0EsUUFBSUMsU0FBUzFOLElBQUkyTixNQUFKLENBQVczTixJQUFJYSxPQUFKLENBQVksR0FBWixFQUFpQixFQUFqQixJQUF1QixDQUFsQyxFQUFxQyxHQUFyQyxDQUFiO0FBQ0E7QUFDQSxRQUFJc0osU0FBU3VELE9BQU9FLEtBQVAsQ0FBYUgsS0FBYixDQUFiO0FBQ0EsUUFBSUksVUFBVXpILEtBQUswSCxTQUFMLENBQWU5TixHQUFmLENBQWQ7QUFDQW9HLFNBQUsySCxXQUFMLENBQWlCL04sR0FBakIsRUFBc0I2TixPQUF0QixFQUErQjlHLElBQS9CLENBQW9DLFVBQUNhLEVBQUQsRUFBUTtBQUMzQyxTQUFJQSxPQUFPLFVBQVgsRUFBdUI7QUFDdEJpRyxnQkFBVSxVQUFWO0FBQ0FqRyxXQUFLN0csS0FBS3lGLE1BQVY7QUFDQTtBQUNELFNBQUkrRyxNQUFNO0FBQ1RTLGNBQVFwRyxFQURDO0FBRVR2QyxZQUFNd0ksT0FGRztBQUdUdk0sZUFBUytELElBSEE7QUFJVHRFLFlBQU07QUFKRyxNQUFWO0FBTUEsU0FBSWpCLE9BQUosRUFBYXlOLElBQUl4TSxJQUFKLEdBQVdBLEtBQUtZLEdBQUwsQ0FBU1osSUFBcEIsQ0FYOEIsQ0FXSjtBQUN2QyxTQUFJOE0sWUFBWSxVQUFoQixFQUE0QjtBQUMzQixVQUFJM0ssUUFBUWxELElBQUlhLE9BQUosQ0FBWSxPQUFaLENBQVo7QUFDQSxVQUFJcUMsU0FBUyxDQUFiLEVBQWdCO0FBQ2YsV0FBSUMsTUFBTW5ELElBQUlhLE9BQUosQ0FBWSxHQUFaLEVBQWlCcUMsS0FBakIsQ0FBVjtBQUNBcUssV0FBSWhHLE1BQUosR0FBYXZILElBQUlxTixTQUFKLENBQWNuSyxRQUFRLENBQXRCLEVBQXlCQyxHQUF6QixDQUFiO0FBQ0EsT0FIRCxNQUdPO0FBQ04sV0FBSUQsU0FBUWxELElBQUlhLE9BQUosQ0FBWSxRQUFaLENBQVo7QUFDQTBNLFdBQUloRyxNQUFKLEdBQWF2SCxJQUFJcU4sU0FBSixDQUFjbkssU0FBUSxDQUF0QixFQUF5QmxELElBQUk2RCxNQUE3QixDQUFiO0FBQ0E7QUFDRCxVQUFJb0ssUUFBUWpPLElBQUlhLE9BQUosQ0FBWSxTQUFaLENBQVo7QUFDQSxVQUFJb04sU0FBUyxDQUFiLEVBQWdCO0FBQ2ZWLFdBQUloRyxNQUFKLEdBQWE0QyxPQUFPLENBQVAsQ0FBYjtBQUNBO0FBQ0RvRCxVQUFJMUcsTUFBSixHQUFhMEcsSUFBSVMsTUFBSixHQUFhLEdBQWIsR0FBbUJULElBQUloRyxNQUFwQztBQUNBSCxjQUFRbUcsR0FBUjtBQUNBLE1BZkQsTUFlTyxJQUFJTSxZQUFZLE1BQWhCLEVBQXdCO0FBQzlCTixVQUFJMUcsTUFBSixHQUFhN0csSUFBSW1JLE9BQUosQ0FBWSxLQUFaLEVBQW1CLEVBQW5CLENBQWI7QUFDQWYsY0FBUW1HLEdBQVI7QUFDQSxNQUhNLE1BR0E7QUFDTixVQUFJTSxZQUFZLE9BQWhCLEVBQXlCO0FBQ3hCLFdBQUkxRCxPQUFPdEcsTUFBUCxJQUFpQixDQUFyQixFQUF3QjtBQUN2QjtBQUNBMEosWUFBSWpNLE9BQUosR0FBYyxNQUFkO0FBQ0FpTSxZQUFJMUcsTUFBSixHQUFhc0QsT0FBTyxDQUFQLENBQWI7QUFDQS9DLGdCQUFRbUcsR0FBUjtBQUNBLFFBTEQsTUFLTztBQUNOO0FBQ0FBLFlBQUkxRyxNQUFKLEdBQWFzRCxPQUFPLENBQVAsQ0FBYjtBQUNBL0MsZ0JBQVFtRyxHQUFSO0FBQ0E7QUFDRCxPQVhELE1BV08sSUFBSU0sWUFBWSxPQUFoQixFQUF5QjtBQUMvQixXQUFJMU0sR0FBR2lFLFVBQVAsRUFBbUI7QUFDbEJtSSxZQUFJaEcsTUFBSixHQUFhNEMsT0FBT0EsT0FBT3RHLE1BQVAsR0FBZ0IsQ0FBdkIsQ0FBYjtBQUNBMEosWUFBSVMsTUFBSixHQUFhN0QsT0FBTyxDQUFQLENBQWI7QUFDQW9ELFlBQUkxRyxNQUFKLEdBQWEwRyxJQUFJUyxNQUFKLEdBQWEsR0FBYixHQUFtQlQsSUFBSWhHLE1BQXBDO0FBQ0FILGdCQUFRbUcsR0FBUjtBQUNBLFFBTEQsTUFLTztBQUNOdkgsYUFBSztBQUNKRSxnQkFBTyxpQkFESDtBQUVKQyxlQUFNLCtHQUZGO0FBR0pkLGVBQU07QUFIRixTQUFMLEVBSUdZLElBSkg7QUFLQTtBQUNELE9BYk0sTUFhQSxJQUFJNEgsWUFBWSxPQUFoQixFQUF5QjtBQUMvQixXQUFJSixTQUFRLFNBQVo7QUFDQSxXQUFJdEQsVUFBU25LLElBQUk0TixLQUFKLENBQVVILE1BQVYsQ0FBYjtBQUNBRixXQUFJaEcsTUFBSixHQUFhNEMsUUFBT0EsUUFBT3RHLE1BQVAsR0FBZ0IsQ0FBdkIsQ0FBYjtBQUNBMEosV0FBSTFHLE1BQUosR0FBYTBHLElBQUlTLE1BQUosR0FBYSxHQUFiLEdBQW1CVCxJQUFJaEcsTUFBcEM7QUFDQUgsZUFBUW1HLEdBQVI7QUFDQSxPQU5NLE1BTUE7QUFDTixXQUFJcEQsT0FBT3RHLE1BQVAsSUFBaUIsQ0FBakIsSUFBc0JzRyxPQUFPdEcsTUFBUCxJQUFpQixDQUEzQyxFQUE4QztBQUM3QzBKLFlBQUloRyxNQUFKLEdBQWE0QyxPQUFPLENBQVAsQ0FBYjtBQUNBb0QsWUFBSTFHLE1BQUosR0FBYTBHLElBQUlTLE1BQUosR0FBYSxHQUFiLEdBQW1CVCxJQUFJaEcsTUFBcEM7QUFDQUgsZ0JBQVFtRyxHQUFSO0FBQ0EsUUFKRCxNQUlPO0FBQ04sWUFBSU0sWUFBWSxRQUFoQixFQUEwQjtBQUN6Qk4sYUFBSWhHLE1BQUosR0FBYTRDLE9BQU8sQ0FBUCxDQUFiO0FBQ0FvRCxhQUFJUyxNQUFKLEdBQWE3RCxPQUFPQSxPQUFPdEcsTUFBUCxHQUFnQixDQUF2QixDQUFiO0FBQ0EsU0FIRCxNQUdPO0FBQ04wSixhQUFJaEcsTUFBSixHQUFhNEMsT0FBT0EsT0FBT3RHLE1BQVAsR0FBZ0IsQ0FBdkIsQ0FBYjtBQUNBO0FBQ0QwSixZQUFJMUcsTUFBSixHQUFhMEcsSUFBSVMsTUFBSixHQUFhLEdBQWIsR0FBbUJULElBQUloRyxNQUFwQztBQUNBakMsV0FBR21DLEdBQUgsT0FBVzhGLElBQUlTLE1BQWYsMkJBQTZDLFVBQVVoSCxHQUFWLEVBQWU7QUFDM0QsYUFBSUEsSUFBSWtILEtBQVIsRUFBZTtBQUNkOUcsa0JBQVFtRyxHQUFSO0FBQ0EsVUFGRCxNQUVPO0FBQ04sY0FBSXZHLElBQUltSCxZQUFSLEVBQXNCO0FBQ3JCcE0sa0JBQU9tRCxTQUFQLEdBQW1COEIsSUFBSW1ILFlBQXZCO0FBQ0E7QUFDRC9HLGtCQUFRbUcsR0FBUjtBQUNBO0FBQ0QsU0FURDtBQVVBO0FBQ0Q7QUFDRDtBQUNELEtBdkZEO0FBd0ZBO0FBQ0QsR0EvR00sQ0FBUDtBQWdIQSxFQXpJUztBQTBJVk8sWUFBVyxtQkFBQ1IsT0FBRCxFQUFhO0FBQ3ZCLE1BQUlBLFFBQVF6TSxPQUFSLENBQWdCLE9BQWhCLEtBQTRCLENBQWhDLEVBQW1DO0FBQ2xDLE9BQUl5TSxRQUFRek0sT0FBUixDQUFnQixXQUFoQixLQUFnQyxDQUFwQyxFQUF1QztBQUN0QyxXQUFPLFFBQVA7QUFDQSxJQUZELE1BRU87QUFDTixXQUFPLFVBQVA7QUFDQTtBQUNEO0FBQ0QsTUFBSXlNLFFBQVF6TSxPQUFSLENBQWdCLFVBQWhCLEtBQStCLENBQW5DLEVBQXNDO0FBQ3JDLFVBQU8sT0FBUDtBQUNBO0FBQ0QsTUFBSXlNLFFBQVF6TSxPQUFSLENBQWdCLFFBQWhCLEtBQTZCLENBQWpDLEVBQW9DO0FBQ25DLFVBQU8sT0FBUDtBQUNBO0FBQ0QsTUFBSXlNLFFBQVF6TSxPQUFSLENBQWdCLFVBQWhCLEtBQStCLENBQW5DLEVBQXNDO0FBQ3JDLFVBQU8sT0FBUDtBQUNBO0FBQ0QsTUFBSXlNLFFBQVF6TSxPQUFSLENBQWdCLEdBQWhCLEtBQXdCLENBQTVCLEVBQStCO0FBQzlCLFVBQU8sTUFBUDtBQUNBO0FBQ0QsU0FBTyxRQUFQO0FBQ0EsRUEvSlM7QUFnS1ZrTixjQUFhLHFCQUFDVCxPQUFELEVBQVVqSSxJQUFWLEVBQW1CO0FBQy9CLFNBQU8sSUFBSThCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdkMsT0FBSW5FLFFBQVFvSyxRQUFRek0sT0FBUixDQUFnQixjQUFoQixJQUFrQyxFQUE5QztBQUNBLE9BQUlzQyxNQUFNbUssUUFBUXpNLE9BQVIsQ0FBZ0IsR0FBaEIsRUFBcUJxQyxLQUFyQixDQUFWO0FBQ0EsT0FBSXVLLFFBQVEsU0FBWjtBQUNBLE9BQUl0SyxNQUFNLENBQVYsRUFBYTtBQUNaLFFBQUltSyxRQUFRek0sT0FBUixDQUFnQixPQUFoQixLQUE0QixDQUFoQyxFQUFtQztBQUNsQyxTQUFJd0UsU0FBUyxRQUFiLEVBQXVCO0FBQ3RCK0IsY0FBUSxRQUFSO0FBQ0EsTUFGRCxNQUVPO0FBQ05BLGNBQVEsVUFBUjtBQUNBO0FBQ0QsS0FORCxNQU1PO0FBQ05BLGFBQVFrRyxRQUFRTSxLQUFSLENBQWNILEtBQWQsRUFBcUIsQ0FBckIsQ0FBUjtBQUNBO0FBQ0QsSUFWRCxNQVVPO0FBQ04sUUFBSTNJLFFBQVF3SSxRQUFRek0sT0FBUixDQUFnQixVQUFoQixDQUFaO0FBQ0EsUUFBSW1KLFFBQVFzRCxRQUFRek0sT0FBUixDQUFnQixVQUFoQixDQUFaO0FBQ0EsUUFBSWlFLFNBQVMsQ0FBYixFQUFnQjtBQUNmNUIsYUFBUTRCLFFBQVEsQ0FBaEI7QUFDQTNCLFdBQU1tSyxRQUFRek0sT0FBUixDQUFnQixHQUFoQixFQUFxQnFDLEtBQXJCLENBQU47QUFDQSxTQUFJa0wsU0FBUyxTQUFiO0FBQ0EsU0FBSUMsT0FBT2YsUUFBUUQsU0FBUixDQUFrQm5LLEtBQWxCLEVBQXlCQyxHQUF6QixDQUFYO0FBQ0EsU0FBSWlMLE9BQU9FLElBQVAsQ0FBWUQsSUFBWixDQUFKLEVBQXVCO0FBQ3RCakgsY0FBUWlILElBQVI7QUFDQSxNQUZELE1BRU87QUFDTmpILGNBQVEsT0FBUjtBQUNBO0FBQ0QsS0FWRCxNQVVPLElBQUk0QyxTQUFTLENBQWIsRUFBZ0I7QUFDdEI1QyxhQUFRLE9BQVI7QUFDQSxLQUZNLE1BRUE7QUFDTixTQUFJbUgsV0FBV2pCLFFBQVFELFNBQVIsQ0FBa0JuSyxLQUFsQixFQUF5QkMsR0FBekIsQ0FBZjtBQUNBbUMsUUFBR21DLEdBQUgsT0FBVzhHLFFBQVgsMkJBQTJDLFVBQVV2SCxHQUFWLEVBQWU7QUFDekQsVUFBSUEsSUFBSWtILEtBQVIsRUFBZTtBQUNkOUcsZUFBUSxVQUFSO0FBQ0EsT0FGRCxNQUVPO0FBQ04sV0FBSUosSUFBSW1ILFlBQVIsRUFBc0I7QUFDckJwTSxlQUFPbUQsU0FBUCxHQUFtQjhCLElBQUltSCxZQUF2QjtBQUNBO0FBQ0QvRyxlQUFRSixJQUFJWSxFQUFaO0FBQ0E7QUFDRCxNQVREO0FBVUE7QUFDRDtBQUNELEdBM0NNLENBQVA7QUE0Q0EsRUE3TVM7QUE4TVZ0RSxTQUFRLGdCQUFDdEQsR0FBRCxFQUFTO0FBQ2hCLE1BQUlBLElBQUlhLE9BQUosQ0FBWSx3QkFBWixLQUF5QyxDQUE3QyxFQUFnRDtBQUMvQ2IsU0FBTUEsSUFBSXFOLFNBQUosQ0FBYyxDQUFkLEVBQWlCck4sSUFBSWEsT0FBSixDQUFZLEdBQVosQ0FBakIsQ0FBTjtBQUNBLFVBQU9iLEdBQVA7QUFDQSxHQUhELE1BR087QUFDTixVQUFPQSxHQUFQO0FBQ0E7QUFDRDtBQXJOUyxDQUFYOztBQXdOQSxJQUFJK0MsVUFBUztBQUNaa0csY0FBYSxxQkFBQ29CLE9BQUQsRUFBVTFCLFdBQVYsRUFBdUJFLEtBQXZCLEVBQThCOUQsSUFBOUIsRUFBb0MvQixLQUFwQyxFQUEyQ0ssU0FBM0MsRUFBc0RFLE9BQXRELEVBQWtFO0FBQzlFLE1BQUl4QyxPQUFPc0osUUFBUXRKLElBQW5CO0FBQ0EsTUFBSWdFLFNBQVMsRUFBYixFQUFpQjtBQUNoQmhFLFVBQU9nQyxRQUFPZ0MsSUFBUCxDQUFZaEUsSUFBWixFQUFrQmdFLElBQWxCLENBQVA7QUFDQTtBQUNELE1BQUk4RCxLQUFKLEVBQVc7QUFDVjlILFVBQU9nQyxRQUFPeUwsR0FBUCxDQUFXek4sSUFBWCxDQUFQO0FBQ0E7QUFDRCxNQUFJc0osUUFBUS9JLE9BQVIsS0FBb0IsV0FBcEIsSUFBbUNTLE9BQU9HLEtBQTlDLEVBQXFEO0FBQ3BEbkIsVUFBT2dDLFFBQU9DLEtBQVAsQ0FBYWpDLElBQWIsRUFBbUJpQyxLQUFuQixDQUFQO0FBQ0EsR0FGRCxNQUVPLElBQUlxSCxRQUFRL0ksT0FBUixLQUFvQixRQUF4QixFQUFrQyxDQUV4QyxDQUZNLE1BRUE7QUFDTlAsVUFBT2dDLFFBQU9tSyxJQUFQLENBQVluTSxJQUFaLEVBQWtCc0MsU0FBbEIsRUFBNkJFLE9BQTdCLENBQVA7QUFDQTtBQUNELE1BQUlvRixXQUFKLEVBQWlCO0FBQ2hCNUgsVUFBT2dDLFFBQU8wTCxNQUFQLENBQWMxTixJQUFkLENBQVA7QUFDQTs7QUFFRCxTQUFPQSxJQUFQO0FBQ0EsRUFyQlc7QUFzQlowTixTQUFRLGdCQUFDMU4sSUFBRCxFQUFVO0FBQ2pCLE1BQUkyTixTQUFTLEVBQWI7QUFDQSxNQUFJQyxPQUFPLEVBQVg7QUFDQTVOLE9BQUs2TixPQUFMLENBQWEsVUFBVTlGLElBQVYsRUFBZ0I7QUFDNUIsT0FBSStGLE1BQU0vRixLQUFLbkIsSUFBTCxDQUFVQyxFQUFwQjtBQUNBLE9BQUkrRyxLQUFLOU4sT0FBTCxDQUFhZ08sR0FBYixNQUFzQixDQUFDLENBQTNCLEVBQThCO0FBQzdCRixTQUFLekgsSUFBTCxDQUFVMkgsR0FBVjtBQUNBSCxXQUFPeEgsSUFBUCxDQUFZNEIsSUFBWjtBQUNBO0FBQ0QsR0FORDtBQU9BLFNBQU80RixNQUFQO0FBQ0EsRUFqQ1c7QUFrQ1ozSixPQUFNLGNBQUNoRSxJQUFELEVBQU9nRSxLQUFQLEVBQWdCO0FBQ3JCLE1BQUkrSixTQUFTMU8sRUFBRTJPLElBQUYsQ0FBT2hPLElBQVAsRUFBYSxVQUFVNEssQ0FBVixFQUFhMUUsQ0FBYixFQUFnQjtBQUN6QyxPQUFJMEUsRUFBRWpDLE9BQUYsS0FBY3NGLFNBQWxCLEVBQTZCO0FBQzVCLFFBQUlyRCxFQUFFbkMsS0FBRixDQUFRM0ksT0FBUixDQUFnQmtFLEtBQWhCLElBQXdCLENBQUMsQ0FBN0IsRUFBZ0M7QUFDL0IsWUFBTyxJQUFQO0FBQ0E7QUFDRCxJQUpELE1BSU87QUFDTixRQUFJNEcsRUFBRWpDLE9BQUYsQ0FBVTdJLE9BQVYsQ0FBa0JrRSxLQUFsQixJQUEwQixDQUFDLENBQS9CLEVBQWtDO0FBQ2pDLFlBQU8sSUFBUDtBQUNBO0FBQ0Q7QUFDRCxHQVZZLENBQWI7QUFXQSxTQUFPK0osTUFBUDtBQUNBLEVBL0NXO0FBZ0RaTixNQUFLLGFBQUN6TixJQUFELEVBQVU7QUFDZCxNQUFJK04sU0FBUzFPLEVBQUUyTyxJQUFGLENBQU9oTyxJQUFQLEVBQWEsVUFBVTRLLENBQVYsRUFBYTFFLENBQWIsRUFBZ0I7QUFDekMsT0FBSTBFLEVBQUVzRCxZQUFOLEVBQW9CO0FBQ25CLFdBQU8sSUFBUDtBQUNBO0FBQ0QsR0FKWSxDQUFiO0FBS0EsU0FBT0gsTUFBUDtBQUNBLEVBdkRXO0FBd0RaNUIsT0FBTSxjQUFDbk0sSUFBRCxFQUFPbU8sRUFBUCxFQUFXQyxDQUFYLEVBQWlCO0FBQ3RCLE1BQUlDLFlBQVlGLEdBQUdHLEtBQUgsQ0FBUyxHQUFULENBQWhCO0FBQ0EsTUFBSUMsV0FBV0gsRUFBRUUsS0FBRixDQUFRLEdBQVIsQ0FBZjtBQUNBLE1BQUlFLFVBQVVDLE9BQU8sSUFBSUMsSUFBSixDQUFTSCxTQUFTLENBQVQsQ0FBVCxFQUF1QjFELFNBQVMwRCxTQUFTLENBQVQsQ0FBVCxJQUF3QixDQUEvQyxFQUFtREEsU0FBUyxDQUFULENBQW5ELEVBQWdFQSxTQUFTLENBQVQsQ0FBaEUsRUFBNkVBLFNBQVMsQ0FBVCxDQUE3RSxFQUEwRkEsU0FBUyxDQUFULENBQTFGLENBQVAsRUFBK0dJLEVBQTdIO0FBQ0EsTUFBSUMsWUFBWUgsT0FBTyxJQUFJQyxJQUFKLENBQVNMLFVBQVUsQ0FBVixDQUFULEVBQXdCeEQsU0FBU3dELFVBQVUsQ0FBVixDQUFULElBQXlCLENBQWpELEVBQXFEQSxVQUFVLENBQVYsQ0FBckQsRUFBbUVBLFVBQVUsQ0FBVixDQUFuRSxFQUFpRkEsVUFBVSxDQUFWLENBQWpGLEVBQStGQSxVQUFVLENBQVYsQ0FBL0YsQ0FBUCxFQUFxSE0sRUFBckk7QUFDQSxNQUFJWixTQUFTMU8sRUFBRTJPLElBQUYsQ0FBT2hPLElBQVAsRUFBYSxVQUFVNEssQ0FBVixFQUFhMUUsQ0FBYixFQUFnQjtBQUN6QyxPQUFJYyxlQUFleUgsT0FBTzdELEVBQUU1RCxZQUFULEVBQXVCMkgsRUFBMUM7QUFDQSxPQUFLM0gsZUFBZTRILFNBQWYsSUFBNEI1SCxlQUFld0gsT0FBNUMsSUFBd0Q1RCxFQUFFNUQsWUFBRixJQUFrQixFQUE5RSxFQUFrRjtBQUNqRixXQUFPLElBQVA7QUFDQTtBQUNELEdBTFksQ0FBYjtBQU1BLFNBQU8rRyxNQUFQO0FBQ0EsRUFwRVc7QUFxRVo5TCxRQUFPLGVBQUNqQyxJQUFELEVBQU8wTCxHQUFQLEVBQWU7QUFDckIsTUFBSUEsT0FBTyxLQUFYLEVBQWtCO0FBQ2pCLFVBQU8xTCxJQUFQO0FBQ0EsR0FGRCxNQUVPO0FBQ04sT0FBSStOLFNBQVMxTyxFQUFFMk8sSUFBRixDQUFPaE8sSUFBUCxFQUFhLFVBQVU0SyxDQUFWLEVBQWExRSxDQUFiLEVBQWdCO0FBQ3pDLFFBQUkwRSxFQUFFdEcsSUFBRixJQUFVb0gsR0FBZCxFQUFtQjtBQUNsQixZQUFPLElBQVA7QUFDQTtBQUNELElBSlksQ0FBYjtBQUtBLFVBQU9xQyxNQUFQO0FBQ0E7QUFDRDtBQWhGVyxDQUFiOztBQW1GQSxJQUFJek0sS0FBSztBQUNSRCxPQUFNLGdCQUFNLENBRVgsQ0FITztBQUlSdEMsVUFBUyxtQkFBTTtBQUNkLE1BQUkyTSxNQUFNck0sRUFBRSxzQkFBRixDQUFWO0FBQ0EsTUFBSXFNLElBQUluSyxRQUFKLENBQWEsTUFBYixDQUFKLEVBQTBCO0FBQ3pCbUssT0FBSTNMLFdBQUosQ0FBZ0IsTUFBaEI7QUFDQSxHQUZELE1BRU87QUFDTjJMLE9BQUlsSyxRQUFKLENBQWEsTUFBYjtBQUNBO0FBQ0QsRUFYTztBQVlSaUcsUUFBTyxpQkFBTTtBQUNaLE1BQUlsSCxVQUFVUCxLQUFLWSxHQUFMLENBQVNMLE9BQXZCO0FBQ0EsTUFBSUEsWUFBWSxXQUFaLElBQTJCUyxPQUFPRyxLQUF0QyxFQUE2QztBQUM1QzlCLEtBQUUsNEJBQUYsRUFBZ0NtQyxRQUFoQyxDQUF5QyxNQUF6QztBQUNBbkMsS0FBRSxpQkFBRixFQUFxQlUsV0FBckIsQ0FBaUMsTUFBakM7QUFDQSxHQUhELE1BR087QUFDTlYsS0FBRSw0QkFBRixFQUFnQ1UsV0FBaEMsQ0FBNEMsTUFBNUM7QUFDQVYsS0FBRSxpQkFBRixFQUFxQm1DLFFBQXJCLENBQThCLE1BQTlCO0FBQ0E7QUFDRCxNQUFJakIsWUFBWSxVQUFoQixFQUE0QjtBQUMzQmxCLEtBQUUsV0FBRixFQUFlVSxXQUFmLENBQTJCLE1BQTNCO0FBQ0EsR0FGRCxNQUVPO0FBQ04sT0FBSVYsRUFBRSxNQUFGLEVBQVV3SSxJQUFWLENBQWUsU0FBZixDQUFKLEVBQStCO0FBQzlCeEksTUFBRSxNQUFGLEVBQVVhLEtBQVY7QUFDQTtBQUNEYixLQUFFLFdBQUYsRUFBZW1DLFFBQWYsQ0FBd0IsTUFBeEI7QUFDQTtBQUNEO0FBN0JPLENBQVQ7O0FBaUNBLFNBQVN5QyxPQUFULEdBQW1CO0FBQ2xCLEtBQUk0SyxJQUFJLElBQUlILElBQUosRUFBUjtBQUNBLEtBQUlJLE9BQU9ELEVBQUVFLFdBQUYsRUFBWDtBQUNBLEtBQUlDLFFBQVFILEVBQUVJLFFBQUYsS0FBZSxDQUEzQjtBQUNBLEtBQUlDLE9BQU9MLEVBQUVNLE9BQUYsRUFBWDtBQUNBLEtBQUlDLE9BQU9QLEVBQUVRLFFBQUYsRUFBWDtBQUNBLEtBQUlDLE1BQU1ULEVBQUVVLFVBQUYsRUFBVjtBQUNBLEtBQUlDLE1BQU1YLEVBQUVZLFVBQUYsRUFBVjtBQUNBLFFBQU9YLE9BQU8sR0FBUCxHQUFhRSxLQUFiLEdBQXFCLEdBQXJCLEdBQTJCRSxJQUEzQixHQUFrQyxHQUFsQyxHQUF3Q0UsSUFBeEMsR0FBK0MsR0FBL0MsR0FBcURFLEdBQXJELEdBQTJELEdBQTNELEdBQWlFRSxHQUF4RTtBQUNBOztBQUVELFNBQVM1RyxhQUFULENBQXVCOEcsY0FBdkIsRUFBdUM7QUFDdEMsS0FBSWIsSUFBSUosT0FBT2lCLGNBQVAsRUFBdUJmLEVBQS9CO0FBQ0EsS0FBSWdCLFNBQVMsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsSUFBL0IsRUFBcUMsSUFBckMsRUFBMkMsSUFBM0MsRUFBaUQsSUFBakQsRUFBdUQsSUFBdkQsRUFBNkQsSUFBN0QsRUFBbUUsSUFBbkUsQ0FBYjtBQUNBLEtBQUliLE9BQU9ELEVBQUVFLFdBQUYsRUFBWDtBQUNBLEtBQUlDLFFBQVFXLE9BQU9kLEVBQUVJLFFBQUYsRUFBUCxDQUFaO0FBQ0EsS0FBSUMsT0FBT0wsRUFBRU0sT0FBRixFQUFYO0FBQ0EsS0FBSUQsT0FBTyxFQUFYLEVBQWU7QUFDZEEsU0FBTyxNQUFNQSxJQUFiO0FBQ0E7QUFDRCxLQUFJRSxPQUFPUCxFQUFFUSxRQUFGLEVBQVg7QUFDQSxLQUFJQyxNQUFNVCxFQUFFVSxVQUFGLEVBQVY7QUFDQSxLQUFJRCxNQUFNLEVBQVYsRUFBYztBQUNiQSxRQUFNLE1BQU1BLEdBQVo7QUFDQTtBQUNELEtBQUlFLE1BQU1YLEVBQUVZLFVBQUYsRUFBVjtBQUNBLEtBQUlELE1BQU0sRUFBVixFQUFjO0FBQ2JBLFFBQU0sTUFBTUEsR0FBWjtBQUNBO0FBQ0QsS0FBSXJELE9BQU8yQyxPQUFPLEdBQVAsR0FBYUUsS0FBYixHQUFxQixHQUFyQixHQUEyQkUsSUFBM0IsR0FBa0MsR0FBbEMsR0FBd0NFLElBQXhDLEdBQStDLEdBQS9DLEdBQXFERSxHQUFyRCxHQUEyRCxHQUEzRCxHQUFpRUUsR0FBNUU7QUFDQSxRQUFPckQsSUFBUDtBQUNBOztBQUVELFNBQVNoRSxTQUFULENBQW1CcUUsR0FBbkIsRUFBd0I7QUFDdkIsS0FBSW9ELFFBQVF2USxFQUFFOEwsR0FBRixDQUFNcUIsR0FBTixFQUFXLFVBQVVsQyxLQUFWLEVBQWlCYyxLQUFqQixFQUF3QjtBQUM5QyxTQUFPLENBQUNkLEtBQUQsQ0FBUDtBQUNBLEVBRlcsQ0FBWjtBQUdBLFFBQU9zRixLQUFQO0FBQ0E7O0FBRUQsU0FBUzNFLGNBQVQsQ0FBd0JMLENBQXhCLEVBQTJCO0FBQzFCLEtBQUlpRixNQUFNLElBQUlDLEtBQUosRUFBVjtBQUNBLEtBQUk1SixDQUFKLEVBQU82SixDQUFQLEVBQVUzQixDQUFWO0FBQ0EsTUFBS2xJLElBQUksQ0FBVCxFQUFZQSxJQUFJMEUsQ0FBaEIsRUFBbUIsRUFBRTFFLENBQXJCLEVBQXdCO0FBQ3ZCMkosTUFBSTNKLENBQUosSUFBU0EsQ0FBVDtBQUNBO0FBQ0QsTUFBS0EsSUFBSSxDQUFULEVBQVlBLElBQUkwRSxDQUFoQixFQUFtQixFQUFFMUUsQ0FBckIsRUFBd0I7QUFDdkI2SixNQUFJQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0J0RixDQUEzQixDQUFKO0FBQ0F3RCxNQUFJeUIsSUFBSUUsQ0FBSixDQUFKO0FBQ0FGLE1BQUlFLENBQUosSUFBU0YsSUFBSTNKLENBQUosQ0FBVDtBQUNBMkosTUFBSTNKLENBQUosSUFBU2tJLENBQVQ7QUFDQTtBQUNELFFBQU95QixHQUFQO0FBQ0E7O0FBRUQsU0FBUzlNLGtCQUFULENBQTRCb04sUUFBNUIsRUFBc0NDLFdBQXRDLEVBQW1EQyxTQUFuRCxFQUE4RDtBQUM3RDtBQUNBLEtBQUlDLFVBQVUsUUFBT0gsUUFBUCx5Q0FBT0EsUUFBUCxNQUFtQixRQUFuQixHQUE4QjNQLEtBQUtDLEtBQUwsQ0FBVzBQLFFBQVgsQ0FBOUIsR0FBcURBLFFBQW5FOztBQUVBLEtBQUlJLE1BQU0sRUFBVjtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSUYsU0FBSixFQUFlO0FBQ2QsTUFBSUcsTUFBTSxFQUFWOztBQUVBO0FBQ0EsT0FBSyxJQUFJcEYsS0FBVCxJQUFrQmtGLFFBQVEsQ0FBUixDQUFsQixFQUE4Qjs7QUFFN0I7QUFDQUUsVUFBT3BGLFFBQVEsR0FBZjtBQUNBOztBQUVEb0YsUUFBTUEsSUFBSUMsS0FBSixDQUFVLENBQVYsRUFBYSxDQUFDLENBQWQsQ0FBTjs7QUFFQTtBQUNBRixTQUFPQyxNQUFNLE1BQWI7QUFDQTs7QUFFRDtBQUNBLE1BQUssSUFBSXRLLElBQUksQ0FBYixFQUFnQkEsSUFBSW9LLFFBQVF4TixNQUE1QixFQUFvQ29ELEdBQXBDLEVBQXlDO0FBQ3hDLE1BQUlzSyxNQUFNLEVBQVY7O0FBRUE7QUFDQSxPQUFLLElBQUlwRixLQUFULElBQWtCa0YsUUFBUXBLLENBQVIsQ0FBbEIsRUFBOEI7QUFDN0JzSyxVQUFPLE1BQU1GLFFBQVFwSyxDQUFSLEVBQVdrRixLQUFYLENBQU4sR0FBMEIsSUFBakM7QUFDQTs7QUFFRG9GLE1BQUlDLEtBQUosQ0FBVSxDQUFWLEVBQWFELElBQUkxTixNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQXlOLFNBQU9DLE1BQU0sTUFBYjtBQUNBOztBQUVELEtBQUlELE9BQU8sRUFBWCxFQUFlO0FBQ2RqTixRQUFNLGNBQU47QUFDQTtBQUNBOztBQUVEO0FBQ0EsS0FBSW9OLFdBQVcsRUFBZjtBQUNBO0FBQ0FBLGFBQVlOLFlBQVloSixPQUFaLENBQW9CLElBQXBCLEVBQTBCLEdBQTFCLENBQVo7O0FBRUE7QUFDQSxLQUFJdUosTUFBTSx1Q0FBdUNDLFVBQVVMLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJdEcsT0FBT3hLLFNBQVNvUixhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQTVHLE1BQUs2RyxJQUFMLEdBQVlILEdBQVo7O0FBRUE7QUFDQTFHLE1BQUs4RyxLQUFMLEdBQWEsbUJBQWI7QUFDQTlHLE1BQUsrRyxRQUFMLEdBQWdCTixXQUFXLE1BQTNCOztBQUVBO0FBQ0FqUixVQUFTd1IsSUFBVCxDQUFjQyxXQUFkLENBQTBCakgsSUFBMUI7QUFDQUEsTUFBSy9KLEtBQUw7QUFDQVQsVUFBU3dSLElBQVQsQ0FBY0UsV0FBZCxDQUEwQmxILElBQTFCO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3IgPSBoYW5kbGVFcnI7XHJcbnZhciBUQUJMRTtcclxudmFyIGxhc3RDb21tYW5kID0gJ2NvbW1lbnRzJztcclxudmFyIGFkZExpbmsgPSBmYWxzZTtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csIHVybCwgbCkge1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsIFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5hcHBlbmQoXCI8YnI+XCIgKyAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uc2VhcmNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJleHRlbnNpb25cIikgPj0gMCkge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRkYXRhLmV4dGVuc2lvbiA9IHRydWU7XHJcblxyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aCBidXR0b25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJyYW5rZXJcIikgPj0gMCkge1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiAncmFua2VyJyxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucmFua2VyKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcblxyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLmxpa2VzID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRmYi5nZXRBdXRoKCd1cmxfY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHQkKFwiI21vcmVwb3N0XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdHVpLmFkZExpbmsoKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi51aXBhbmVsIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZL01NL0REIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFx0XCLml6VcIixcclxuXHRcdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFx0XCLkuIlcIixcclxuXHRcdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFx0XCLlha1cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xyXG5cdFx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XHRcIuS4ieaciFwiLFxyXG5cdFx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XHRcIuWFreaciFwiLFxyXG5cdFx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XHRcIuS5neaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XHRcIuWNgeS6jOaciFwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwiZmlyc3REYXlcIjogMVxyXG5cdFx0fSxcclxuXHR9LCBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIuc3RhcnRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBlbmQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShjb25maWcuZmlsdGVyLnN0YXJ0VGltZSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhKTtcclxuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XHJcblx0XHRcdHdpbmRvdy5mb2N1cygpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCkge1xyXG5cdFx0XHRcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGEpLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpIHtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBzaGFyZUJUTigpIHtcclxuXHRhbGVydCgn6KqN55yf55yL5a6M6Lez5Ye65L6G55qE6YKj6aCB5LiK6Z2i5a+r5LqG5LuA6bq8XFxuXFxu55yL5a6M5L2g5bCx5pyD55+l6YGT5L2g54K65LuA6bq85LiN6IO95oqT5YiG5LqrJyk7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCAnbWVzc2FnZV90YWdzJywgJ21lc3NhZ2UnLCAnZnJvbScsICdjcmVhdGVkX3RpbWUnLCAnaXNfaGlkZGVuJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCAnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbJ2NyZWF0ZWRfdGltZScsICdmcm9tJywgJ21lc3NhZ2UnLCAnc3RvcnknXSxcclxuXHRcdGxpa2VzOiBbJ25hbWUnXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuNycsXHJcblx0XHRyZWFjdGlvbnM6ICd2Mi43JyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjIuOScsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi43JyxcclxuXHRcdGZlZWQ6ICd2Mi45JyxcclxuXHRcdGdyb3VwOiAndjIuNydcclxuXHR9LFxyXG5cdGZpbHRlcjoge1xyXG5cdFx0d29yZDogJycsXHJcblx0XHRyZWFjdDogJ2FsbCcsXHJcblx0XHRzdGFydFRpbWU6ICcyMDAwLTEyLTMxLTAwLTAwLTAwJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0b3JkZXI6ICcnLFxyXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLG1hbmFnZV9wYWdlcycsXHJcblx0bGlrZXM6IGZhbHNlLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcblx0ZnJvbV9leHRlbnNpb246IGZhbHNlLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJykgPT4ge1xyXG5cdFx0aWYgKHR5cGUgPT09ICcnKSB7XHJcblx0XHRcdGFkZExpbmsgPSB0cnVlO1xyXG5cdFx0XHR0eXBlID0gbGFzdENvbW1hbmQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZGRMaW5rID0gZmFsc2U7XHJcblx0XHRcdGxhc3RDb21tYW5kID0gdHlwZTtcclxuXHRcdH1cclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKSA9PiB7XHJcblx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRjb25maWcuZnJvbV9leHRlbnNpb24gPSBmYWxzZTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKSB7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApIHtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlrozmiJDvvIzoq4vlho3mrKHln7fooYzmipPnlZnoqIAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGaW5pc2hlZCEgUGxlYXNlIGdldENvbW1lbnRzIGFnYWluLicsXHJcblx0XHRcdFx0XHRcdCdzdWNjZXNzJ1xyXG5cdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlpLHmlZfvvIzoq4voga/ntaHnrqHnkIblk6Hnorroqo0nLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PSBcInNoYXJlZHBvc3RzXCIpIHtcclxuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKFwidXNlcl9wb3N0c1wiKSA8IDApIHtcclxuXHRcdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRcdGh0bWw6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmYi51c2VyX3Bvc3RzID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYXV0aFN0cik7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZihcInVzZXJfcG9zdHNcIikgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoXCJtYW5hZ2VfcGFnZXNcIikgPj0gMCkge1xyXG5cdFx0XHRcdFx0ZmIudXNlcl9wb3N0cyA9IHRydWU7XHJcblx0XHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHR0aXRsZTogJ+atpOezu+e1semcgOimgeS7mOiyu++8jOWFjeiyu+eJiOacrOiri+m7nuS7peS4i+e2suWdgCcsXHJcblx0XHRcdFx0XHRcdGh0bWw6ICc8YSBocmVmPVwiaHR0cDovL2dnOTAwNTIuZ2l0aHViLmlvL2NvbW1lbnRfaGVscGVyX2ZyZWUvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cDovL2dnOTAwNTIuZ2l0aHViLmlvL2NvbW1lbnRfaGVscGVyX2ZyZWUvPC9hPicsXHJcblx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKSA9PiB7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0aWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzLmluZGV4T2YoXCJ1c2VyX3Bvc3RzXCIpIDwgMCkge1xyXG5cdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0aHRtbDogJzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgcG9zdGRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5wb3N0ZGF0YSk7XHJcblx0XHRcdFx0aWYgKHBvc3RkYXRhLnR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdC8vIEZCLmFwaShcIi9tZVwiLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHQvLyBcdGlmIChyZXMubmFtZSA9PT0gcG9zdGRhdGEub3duZXIpIHtcclxuXHRcdFx0XHRcdC8vIFx0XHRmYi5hdXRoT0soKTtcclxuXHRcdFx0XHRcdC8vIFx0fWVsc2V7XHJcblx0XHRcdFx0XHQvLyBcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHQvLyBcdFx0XHR0aXRsZTogJ+WAi+S6uuiyvOaWh+WPquacieeZvOaWh+iAheacrOS6uuiDveaKkycsXHJcblx0XHRcdFx0XHQvLyBcdFx0XHRodG1sOiBg6LK85paH5biz6Jmf5ZCN56ix77yaJHtwb3N0ZGF0YS5vd25lcn08YnI+55uu5YmN5biz6Jmf5ZCN56ix77yaJHtyZXMubmFtZX1gLFxyXG5cdFx0XHRcdFx0Ly8gXHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHQvLyBcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHQvLyB9KTtcclxuXHRcdFx0XHRcdGZiLmF1dGhPSygpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAocG9zdGRhdGEudHlwZSA9PT0gJ2dyb3VwJykge1xyXG5cdFx0XHRcdFx0ZmIuYXV0aE9LKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZiLmF1dGhPSygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRhdXRoT0s6ICgpID0+IHtcclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0bGV0IHBvc3RkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucG9zdGRhdGEpO1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiBwb3N0ZGF0YS5jb21tYW5kLFxyXG5cdFx0XHRkYXRhOiBKU09OLnBhcnNlKCQoXCIuY2hyb21lXCIpLnZhbCgpKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzogW10sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluizh+aWmeS4rS4uLicpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0aWYgKCFhZGRMaW5rKSB7XHJcblx0XHRcdGRhdGEucmF3ID0gW107XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKGZiaWQpID0+IHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKCcucHVyZV9mYmlkJykudGV4dChmYmlkLmZ1bGxJRCk7XHJcblx0XHRkYXRhLmdldChmYmlkKS50aGVuKChyZXMpID0+IHtcclxuXHRcdFx0Ly8gZmJpZC5kYXRhID0gcmVzO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09IFwidXJsX2NvbW1lbnRzXCIpIHtcclxuXHRcdFx0XHRmYmlkLmRhdGEgPSBbXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCBpIG9mIHJlcykge1xyXG5cdFx0XHRcdGZiaWQuZGF0YS5wdXNoKGkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEuZmluaXNoKGZiaWQpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IGNvbW1hbmQgPSBmYmlkLmNvbW1hbmQ7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpIGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnICYmIGZiaWQuY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpIGZiaWQuZnVsbElEID0gZmJpZC5wdXJlSUQ7XHJcblx0XHRcdGlmIChjb25maWcubGlrZXMpIGZiaWQuY29tbWFuZCA9ICdsaWtlcyc7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mZGVidWc9YWxsYCk7XHJcblxyXG5cdFx0XHQvLyBpZigkKCcudG9rZW4nKS52YWwoKSA9PT0gJycpe1xyXG5cdFx0XHQvLyBcdCQoJy50b2tlbicpLnZhbChjb25maWcucGFnZVRva2VuKTtcclxuXHRcdFx0Ly8gfWVsc2V7XHJcblx0XHRcdC8vIFx0Y29uZmlnLnBhZ2VUb2tlbiA9ICQoJy50b2tlbicpLnZhbCgpO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZvcmRlcj0ke2NvbmZpZy5vcmRlcn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn0mZGVidWc9YWxsYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdGZvciAobGV0IGQgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdGlmIChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBkLm5hbWVcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChjb25maWcubGlrZXMpIGQudHlwZSA9IFwiTElLRVwiO1xyXG5cdFx0XHRcdFx0aWYgKGQuZnJvbSkge1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9ldmVudFxyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogZC5pZFxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0ID0gMCkge1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsICdsaW1pdD0nICsgbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZC5pZCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmIChkLmZyb20pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vZXZlbnRcclxuXHRcdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGQuaWRcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZC5jcmVhdGVkX3RpbWUgPSBkLnVwZGF0ZWRfdGltZTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKSA9PiB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIudXBkYXRlX2FyZWEsLmRvbmF0ZV9hcmVhXCIpLnNsaWRlVXAoKTtcclxuXHRcdCQoXCIucmVzdWx0X2FyZWFcIikuc2xpZGVEb3duKCk7XHJcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdHVpLnJlc2V0KCk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKSA9PiB7XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0aWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9PT0gZmFsc2UgJiYgcmF3RGF0YS5jb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdHJhd0RhdGEuZGF0YSA9IHJhd0RhdGEuZGF0YS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW0uaXNfaGlkZGVuID09PSBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKSB7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdykgPT4ge1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKSB7XHJcblx0XHRcdCQuZWFjaChyYXcuZGF0YSwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIjogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIuipsuWIhuS6q+iumuaVuFwiOiB0aGlzLmxpa2VfY291bnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkLmVhY2gocmF3LmRhdGEsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi6KGo5oOFXCI6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIjogdGltZUNvbnZlcnRlcih0aGlzLmNyZWF0ZWRfdGltZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3T2JqO1xyXG5cdH0sXHJcblx0aW1wb3J0OiAoZmlsZSkgPT4ge1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHRcdFx0ZGF0YS5yYXcgPSBKU09OLnBhcnNlKHN0cik7XHJcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpID0+IHtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZmlsdGVyZGF0YSA9IHJhd2RhdGEuZmlsdGVyZWQ7XHJcblx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0bGV0IHBpYyA9ICQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7ooajmg4U8L3RkPmA7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMTEwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7mjpLlkI08L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuWIhuaVuDwvdGQ+YDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGhvc3QgPSAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJztcclxuXHRcdGlmIChkYXRhLnJhdy50eXBlID09PSAndXJsX2NvbW1lbnRzJykgaG9zdCA9ICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkgKyAnP2ZiX2NvbW1lbnRfaWQ9JztcclxuXHJcblx0XHRmb3IgKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJkYXRhLmVudHJpZXMoKSkge1xyXG5cdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRpZiAocGljKSB7XHJcblx0XHRcdFx0cGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0aWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKSB7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH0gZWxzZSBpZiAocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJykge1xyXG5cdFx0XHRcdHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHRcdFx0ICA8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPiR7dmFsLnNjb3JlfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgbGluayA9IHZhbC5pZDtcclxuXHRcdFx0XHRpZiAoY29uZmlnLmZyb21fZXh0ZW5zaW9uKSB7XHJcblx0XHRcdFx0XHRsaW5rID0gdmFsLnBvc3RsaW5rO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiJHtob3N0fSR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCkge1xyXG5cdFx0XHRUQUJMRSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2VhcmNoQ29tbWVudFwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEFCTEVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCkgPT4ge1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjc2VhcmNoQ29tbWVudFwiKS52YWwoKSAhPSAnJykge1xyXG5cdFx0XHR0YWJsZS5yZWRvKCk7XHJcblx0XHR9XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCkge1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcIm5hbWVcIjogcCxcclxuXHRcdFx0XHRcdFx0XCJudW1cIjogblxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oKTtcclxuXHR9LFxyXG5cdGdvOiAoKSA9PiB7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YS5maWx0ZXJlZC5sZW5ndGgpLnNwbGljZSgwLCBjaG9vc2UubnVtKTtcclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGNob29zZS5hd2FyZC5tYXAoKHZhbCwgaW5kZXgpID0+IHtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHIgdGl0bGU9XCLnrKwnICsgKGluZGV4ICsgMSkgKyAn5ZCNXCI+JyArICQoJy5tYWluX3RhYmxlJykuRGF0YVRhYmxlKCkucm93cyh7XHJcblx0XHRcdFx0c2VhcmNoOiAnYXBwbGllZCdcclxuXHRcdFx0fSkubm9kZXMoKVt2YWxdLmlubmVySFRNTCArICc8L3RyPic7XHJcblx0XHR9KVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmIChjaG9vc2UuZGV0YWlsKSB7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IgKGxldCBrIGluIGNob29zZS5saXN0KSB7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI1XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9LFxyXG5cdGdlbl9iaWdfYXdhcmQ6ICgpID0+IHtcclxuXHRcdGxldCBsaSA9ICcnO1xyXG5cdFx0bGV0IGF3YXJkcyA9IFtdO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0Ym9keSB0cicpLmVhY2goZnVuY3Rpb24gKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0bGV0IGF3YXJkID0ge307XHJcblx0XHRcdGlmICh2YWwuaGFzQXR0cmlidXRlKCd0aXRsZScpKSB7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgxKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLnVzZXJpZCA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJykucmVwbGFjZSgnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJywgJycpO1xyXG5cdFx0XHRcdGF3YXJkLm1lc3NhZ2UgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLmxpbmsgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgyKS5maW5kKCdhJykuYXR0cignaHJlZicpO1xyXG5cdFx0XHRcdGF3YXJkLnRpbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgkKHZhbCkuZmluZCgndGQnKS5sZW5ndGggLSAxKS50ZXh0KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IHRydWU7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLnRleHQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhd2FyZHMucHVzaChhd2FyZCk7XHJcblx0XHR9KTtcclxuXHRcdGZvciAobGV0IGkgb2YgYXdhcmRzKSB7XHJcblx0XHRcdGlmIChpLmF3YXJkX25hbWUgPT09IHRydWUpIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpIGNsYXNzPVwicHJpemVOYW1lXCI+JHtpLm5hbWV9PC9saT5gO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxpICs9IGA8bGk+XHJcblx0XHRcdFx0PGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPjxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfS9waWN0dXJlP3R5cGU9bGFyZ2VcIiBhbHQ9XCJcIj48L2E+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cImluZm9cIj5cclxuXHRcdFx0XHQ8cCBjbGFzcz1cIm5hbWVcIj48YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLm5hbWV9PC9hPjwvcD5cclxuXHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIj48YSBocmVmPVwiJHtpLmxpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLm1lc3NhZ2V9PC9hPjwvcD5cclxuXHRcdFx0XHQ8cCBjbGFzcz1cInRpbWVcIj48YSBocmVmPVwiJHtpLmxpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLnRpbWV9PC9hPjwvcD5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2xpPmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJy5iaWdfYXdhcmQgdWwnKS5hcHBlbmQobGkpO1xyXG5cdFx0JCgnLmJpZ19hd2FyZCcpLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0fSxcclxuXHRjbG9zZV9iaWdfYXdhcmQ6ICgpID0+IHtcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmVtcHR5KCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmJpZCA9IHtcclxuXHRmYmlkOiBbXSxcclxuXHRpbml0OiAodHlwZSkgPT4ge1xyXG5cdFx0Y29uZmlnLnBhZ2VUb2tlbiA9ICcnO1xyXG5cdFx0ZmJpZC5mYmlkID0gW107XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdEZCLmFwaShcIi9tZVwiLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdGRhdGEudXNlcmlkID0gcmVzLmlkO1xyXG5cdFx0XHRsZXQgdXJsID0gJyc7XHJcblx0XHRcdGlmIChhZGRMaW5rKSB7XHJcblx0XHRcdFx0dXJsID0gZmJpZC5mb3JtYXQoJCgnLm1vcmVsaW5rIC5hZGR1cmwnKS52YWwoKSk7XHJcblx0XHRcdFx0JCgnLm1vcmVsaW5rIC5hZGR1cmwnKS52YWwoJycpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHVybCA9IGZiaWQuZm9ybWF0KCQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh1cmwuaW5kZXhPZignLnBocD8nKSA9PT0gLTEgJiYgdXJsLmluZGV4T2YoJz8nKSA+IDApIHtcclxuXHRcdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKCc/JykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZiaWQuZ2V0KHVybCwgdHlwZSkudGhlbigoZmJpZCkgPT4ge1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC8vICQoJy5pZGVudGl0eScpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChg55m75YWl6Lqr5Lu977yaPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cmVzLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48c3Bhbj4ke3Jlcy5uYW1lfTwvc3Bhbj5gKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAodXJsLCB0eXBlKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRpZiAodHlwZSA9PSAndXJsX2NvbW1lbnRzJykge1xyXG5cdFx0XHRcdGxldCBwb3N0dXJsID0gdXJsO1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCI/XCIpID4gMCkge1xyXG5cdFx0XHRcdFx0cG9zdHVybCA9IHBvc3R1cmwuc3Vic3RyaW5nKDAsIHBvc3R1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRGQi5hcGkoYC8ke3Bvc3R1cmx9YCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0ZnVsbElEOiByZXMub2dfb2JqZWN0LmlkLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiB0eXBlLFxyXG5cdFx0XHRcdFx0XHRjb21tYW5kOiAnY29tbWVudHMnXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0Y29uZmlnLmxpbWl0Wydjb21tZW50cyddID0gJzI1JztcclxuXHRcdFx0XHRcdGNvbmZpZy5vcmRlciA9ICcnO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdFx0bGV0IG5ld3VybCA9IHVybC5zdWJzdHIodXJsLmluZGV4T2YoJy8nLCAyOCkgKyAxLCAyMDApO1xyXG5cdFx0XHRcdC8vIGh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8g5YWxMjXlrZflhYPvvIzlm6DmraTpgbgyOOmWi+Wni+aJvi9cclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gbmV3dXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XHJcblx0XHRcdFx0ZmJpZC5jaGVja1BhZ2VJRCh1cmwsIHVybHR5cGUpLnRoZW4oKGlkKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XHJcblx0XHRcdFx0XHRcdGlkID0gZGF0YS51c2VyaWQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0XHRwYWdlSUQ6IGlkLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiB1cmx0eXBlLFxyXG5cdFx0XHRcdFx0XHRjb21tYW5kOiB0eXBlLFxyXG5cdFx0XHRcdFx0XHRkYXRhOiBbXVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGlmIChhZGRMaW5rKSBvYmouZGF0YSA9IGRhdGEucmF3LmRhdGE7IC8v6L+95Yqg6LK85paHXHJcblx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcclxuXHRcdFx0XHRcdFx0aWYgKHN0YXJ0ID49IDApIHtcclxuXHRcdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsIHN0YXJ0KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCArIDUsIGVuZCk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0ICsgNiwgdXJsLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bGV0IHZpZGVvID0gdXJsLmluZGV4T2YoJ3ZpZGVvcy8nKTtcclxuXHRcdFx0XHRcdFx0aWYgKHZpZGVvID49IDApIHtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAncHVyZScpIHtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHVybC5yZXBsYWNlKC9cXFwiL2csICcnKTtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdldmVudCcpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5omA5pyJ55WZ6KiAXHJcblx0XHRcdFx0XHRcdFx0XHRvYmouY29tbWFuZCA9ICdmZWVkJztcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3mn5Dnr4fnlZnoqIDnmoTnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMV07XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdncm91cCcpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZmIudXNlcl9wb3N0cykge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyBcIl9cIiArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aXRsZTogJ+ekvuWcmOS9v+eUqOmcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWcmCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGh0bWw6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAncGhvdG8nKSB7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gdXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3VubmFtZScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdEZCLmFwaShgLyR7b2JqLnBhZ2VJRH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2hlY2tUeXBlOiAocG9zdHVybCkgPT4ge1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImZiaWQ9XCIpID49IDApIHtcclxuXHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZigncGVybWFsaW5rJykgPj0gMCkge1xyXG5cdFx0XHRcdHJldHVybiAndW5uYW1lJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3BlcnNvbmFsJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvZ3JvdXBzL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAnZ3JvdXAnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJldmVudHNcIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ2V2ZW50JztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL3Bob3Rvcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3Bob3RvJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdwdXJlJztcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJ25vcm1hbCc7XHJcblx0fSxcclxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBzdGFydCA9IHBvc3R1cmwuaW5kZXhPZihcImZhY2Vib29rLmNvbVwiKSArIDEzO1xyXG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLCBzdGFydCk7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGlmIChlbmQgPCAwKSB7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignZmJpZD0nKSA+PSAwKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3VubmFtZScpIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgndW5uYW1lJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IGdyb3VwID0gcG9zdHVybC5pbmRleE9mKCcvZ3JvdXBzLycpO1xyXG5cdFx0XHRcdGxldCBldmVudCA9IHBvc3R1cmwuaW5kZXhPZignL2V2ZW50cy8nKVxyXG5cdFx0XHRcdGlmIChncm91cCA+PSAwKSB7XHJcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwICsgODtcclxuXHRcdFx0XHRcdGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIiwgc3RhcnQpO1xyXG5cdFx0XHRcdFx0bGV0IHJlZ2V4MiA9IC9cXGR7Nix9L2c7XHJcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xyXG5cdFx0XHRcdFx0aWYgKHJlZ2V4Mi50ZXN0KHRlbXApKSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUodGVtcCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdncm91cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZXZlbnQgPj0gMCkge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSgnZXZlbnQnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XHJcblx0XHRcdFx0XHRGQi5hcGkoYC8ke3BhZ2VuYW1lfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmlkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZvcm1hdDogKHVybCkgPT4ge1xyXG5cdFx0aWYgKHVybC5pbmRleE9mKCdidXNpbmVzcy5mYWNlYm9vay5jb20vJykgPj0gMCkge1xyXG5cdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhd2RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIHN0YXJ0VGltZSwgZW5kVGltZSkgPT4ge1xyXG5cdFx0bGV0IGRhdGEgPSByYXdkYXRhLmRhdGE7XHJcblx0XHRpZiAod29yZCAhPT0gJycpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIHN0YXJ0VGltZSwgZW5kVGltZSk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKSA9PiB7XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmIChrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0aWYgKG4uc3RvcnkuaW5kZXhPZih3b3JkKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSkgPT4ge1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3MpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHN0LCB0KSA9PiB7XHJcblx0XHRsZXQgdGltZV9hcnkyID0gc3Quc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgZW5kdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwgKHBhcnNlSW50KHRpbWVfYXJ5WzFdKSAtIDEpLCB0aW1lX2FyeVsyXSwgdGltZV9hcnlbM10sIHRpbWVfYXJ5WzRdLCB0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IHN0YXJ0dGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeTJbMF0sIChwYXJzZUludCh0aW1lX2FyeTJbMV0pIC0gMSksIHRpbWVfYXJ5MlsyXSwgdGltZV9hcnkyWzNdLCB0aW1lX2FyeTJbNF0sIHRpbWVfYXJ5Mls1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKChjcmVhdGVkX3RpbWUgPiBzdGFydHRpbWUgJiYgY3JlYXRlZF90aW1lIDwgZW5kdGltZSkgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIikge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcikgPT4ge1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJykge1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcikge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKSA9PiB7XHJcblxyXG5cdH0sXHJcblx0YWRkTGluazogKCkgPT4ge1xyXG5cdFx0bGV0IHRhciA9ICQoJy5pbnB1dGFyZWEgLm1vcmVsaW5rJyk7XHJcblx0XHRpZiAodGFyLmhhc0NsYXNzKCdzaG93JykpIHtcclxuXHRcdFx0dGFyLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YXIuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlc2V0OiAoKSA9PiB7XHJcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIikpIHtcclxuXHRcdFx0XHQkKFwiI3RhZ1wiKS5jbGljaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpIHtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpICsgMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBkYXRlICsgXCItXCIgKyBob3VyICsgXCItXCIgKyBtaW4gKyBcIi1cIiArIHNlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCkge1xyXG5cdHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuXHR2YXIgbW9udGhzID0gWycwMScsICcwMicsICcwMycsICcwNCcsICcwNScsICcwNicsICcwNycsICcwOCcsICcwOScsICcxMCcsICcxMScsICcxMiddO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0aWYgKGRhdGUgPCAxMCkge1xyXG5cdFx0ZGF0ZSA9IFwiMFwiICsgZGF0ZTtcclxuXHR9XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdGlmIChtaW4gPCAxMCkge1xyXG5cdFx0bWluID0gXCIwXCIgKyBtaW47XHJcblx0fVxyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRpZiAoc2VjIDwgMTApIHtcclxuXHRcdHNlYyA9IFwiMFwiICsgc2VjO1xyXG5cdH1cclxuXHR2YXIgdGltZSA9IHllYXIgKyAnLScgKyBtb250aCArICctJyArIGRhdGUgKyBcIiBcIiArIGhvdXIgKyAnOicgKyBtaW4gKyAnOicgKyBzZWM7XHJcblx0cmV0dXJuIHRpbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9iajJBcnJheShvYmopIHtcclxuXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBbdmFsdWVdO1xyXG5cdH0pO1xyXG5cdHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG5cdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgaSwgciwgdDtcclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRhcnlbaV0gPSBpO1xyXG5cdH1cclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcblx0XHR0ID0gYXJ5W3JdO1xyXG5cdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG5cdFx0YXJ5W2ldID0gdDtcclxuXHR9XHJcblx0cmV0dXJuIGFyeTtcclxufVxyXG5cclxuZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcblx0Ly9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuXHR2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcblxyXG5cdHZhciBDU1YgPSAnJztcclxuXHQvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuXHJcblx0Ly8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG5cdC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcblx0aWYgKFNob3dMYWJlbCkge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG5cclxuXHRcdFx0Ly9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuXHRcdFx0cm93ICs9IGluZGV4ICsgJywnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcblxyXG5cdFx0Ly9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0Ly8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuXHRcdFx0cm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0Ly9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHRpZiAoQ1NWID09ICcnKSB7XHJcblx0XHRhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuXHR2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG5cdC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG5cdGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZywgXCJfXCIpO1xyXG5cclxuXHQvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG5cdHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcblxyXG5cdC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG5cdC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcblx0Ly8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcblx0Ly8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuXHJcblx0Ly90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcblx0bGluay5ocmVmID0gdXJpO1xyXG5cclxuXHQvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG5cdGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcblx0bGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcblxyXG5cdC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHRsaW5rLmNsaWNrKCk7XHJcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
