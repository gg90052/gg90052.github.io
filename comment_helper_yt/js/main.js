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
		if (e.ctrlKey || e.altKey) {
			config.order = 'chronological';
		}
		fb.getAuth($('.url').val());
	});

	$("#btn_choose").click(function () {
		choose.init();
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

	$("#inputJSON").change(function () {
		$(".waiting").removeClass("hide");
		$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
		data.import(this.files[0]);
	});
});

var config = {
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
	from_extension: false,
	key: 'AIzaSyAZ2nPKYagV6hqw_DPmpXbAG7GNONXApBY'
};

var fb = {
	user_posts: false,
	getAuth: function getAuth() {
		var videoID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		data.init();
		$.get('https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2CliveStreamingDetails&id=' + videoID + '&key=' + config.key, function (res) {
			data.start(res);
		});
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
	},
	start: function start(video_detail) {
		var fbid = {
			detail: video_detail.items[0],
			data: []
		};
		$(".waiting").removeClass("hide");
		$('.pure_fbid').text(fbid.detail.id);
		if (video_detail.items[0].liveStreamingDetails) {} else {
			data.get(video_detail.items[0].id).then(function (res) {
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
		}
	},
	get: function get(id) {
		return new Promise(function (resolve, reject) {
			var datas = [];
			var promise_array = [];
			var api_url = 'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=100&order=time&videoId=' + id + '&key=' + config.key;

			$.get(api_url, function (res) {
				data.nowLength += res.items.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = res.items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var d = _step2.value;

						if (d.snippet) {
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

				if (res.items.length > 0 && res.nextPageToken) {
					getNext(api_url + '&pageToken=' + res.nextPageToken);
				} else {
					resolve(datas);
				}
			});

			function getNext(url) {
				var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

				$.getJSON(url, function (res) {
					data.nowLength += res.items.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = res.items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var d = _step3.value;

							if (d.snippet) {
								datas.push(d);
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

					if (res.items.length > 0 && res.nextPageToken) {
						getNext(api_url + '&pageToken=' + res.nextPageToken);
					} else {
						resolve(datas);
					}
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
		var total_r = 0;

		thead = '<td>\u5E8F\u865F</td>\n\t\t\t<td width="200">\u540D\u5B57</td>\n\t\t\t<td class="force-break">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td>\u559C\u6B61</td>\n\t\t\t<td>\u56DE\u8986\u6578</td>\n\t\t\t<td class="nowrap">\u7559\u8A00\u6642\u9593</td>';

		var host = 'https://www.youtube.com/watch?v=' + rawdata.detail.id;

		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = filterdata.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var _step4$value = _slicedToArray(_step4.value, 2),
				    j = _step4$value[0],
				    val = _step4$value[1];

				var picture = '';
				var tar = val.snippet.topLevelComment.snippet;
				total_r += val.snippet.totalReplyCount;
				if (pic) {
					picture = '<img src="' + tar.authorProfileImageUrl + '"><br>';
				}
				var td = '<td>' + (j + 1) + '</td>\n\t\t\t<td><a href=\'' + tar.authorChannelUrl + '\' target="_blank" img="' + tar.authorProfileImageUrl + '">' + picture + tar.authorDisplayName + '</a></td>';

				td += '<td class="force-break"><a href="' + host + '&lc=' + val.snippet.topLevelComment.id + '" target="_blank">' + tar.textDisplay + '</a></td>\n\t\t\t\t<td>' + tar.likeCount + '</td>\n\t\t\t\t<td>' + val.snippet.totalReplyCount + '</td>\n\t\t\t\t<td class="nowrap">' + timeConverter(tar.publishedAt) + '</td>';

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

		$('.filters .total_detail .t').text(rawdata.data.length);
		$('.filters .total_detail .r').text(total_r);
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
				award.pic = $(val).find('td').eq(1).find('a').attr('img');
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
		console.log(awards);
		var _iteratorNormalCompletion5 = true;
		var _didIteratorError5 = false;
		var _iteratorError5 = undefined;

		try {
			for (var _iterator5 = awards[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
				var i = _step5.value;

				if (i.award_name === true) {
					li += '<li class="prizeName">' + i.name + '</li>';
				} else {
					li += '<li>\n\t\t\t\t<a href="' + i.link + '" target="_blank"><img src="' + i.pic + '" alt=""></a>\n\t\t\t\t<div class="info">\n\t\t\t\t<p class="name"><a href="' + i.userid + '" target="_blank">' + i.name + '</a></p>\n\t\t\t\t<p class="message"><a href="' + i.link + '" target="_blank">' + i.message + '</a></p>\n\t\t\t\t<p class="time"><a href="' + i.link + '" target="_blank">' + i.time + '</a></p>\n\t\t\t\t</div>\n\t\t\t\t</li>';
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
			// data = filter.tag(data);
		}

		data = _filter.time(data, startTime, endTime);

		if (isDuplicate) {
			data = _filter.unique(data);
		}

		return data;
	},
	unique: function unique(data) {
		var output = [];
		var keys = [];
		data.forEach(function (item) {
			var key = item.snippet.topLevelComment.snippet.authorChannelUrl;
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	},
	word: function word(data, _word) {
		var newAry = $.grep(data, function (n, i) {
			if (n.snippet.topLevelComment.snippet.textOriginal.indexOf(_word) > -1) {
				return true;
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
			var created_time = moment(n.snippet.topLevelComment.snippet.publishedAt)._d;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIlRBQkxFIiwibGFzdENvbW1hbmQiLCJhZGRMaW5rIiwiYXV0aF9zY29wZSIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsInZhbCIsImFwcGVuZCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJkYXRhIiwiZXh0ZW5zaW9uIiwiY2xpY2siLCJlIiwiZmIiLCJleHRlbnNpb25BdXRoIiwiZGF0YXMiLCJjb21tYW5kIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwicmFua2VyIiwicmF3IiwiZmluaXNoIiwiY3RybEtleSIsImFsdEtleSIsImNvbmZpZyIsIm9yZGVyIiwiZ2V0QXV0aCIsImNob29zZSIsImluaXQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwia2V5ZG93biIsInRleHQiLCJrZXl1cCIsIm9uIiwidGFibGUiLCJyZWRvIiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsImZpbHRlciIsInN0YXJ0VGltZSIsImZvcm1hdCIsImVuZFRpbWUiLCJzZXRTdGFydERhdGUiLCJmaWx0ZXJEYXRhIiwic3RyaW5naWZ5Iiwib3BlbiIsImZvY3VzIiwibGVuZ3RoIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiZXhjZWwiLCJleGNlbFN0cmluZyIsImNoYW5nZSIsImltcG9ydCIsImZpbGVzIiwid29yZCIsInJlYWN0Iiwibm93RGF0ZSIsImF1dGgiLCJsaWtlcyIsInBhZ2VUb2tlbiIsImZyb21fZXh0ZW5zaW9uIiwia2V5IiwidXNlcl9wb3N0cyIsInZpZGVvSUQiLCJnZXQiLCJyZXMiLCJhdXRoT0siLCJwb3N0ZGF0YSIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwidmlkZW9fZGV0YWlsIiwiZmJpZCIsImRldGFpbCIsIml0ZW1zIiwiaWQiLCJsaXZlU3RyZWFtaW5nRGV0YWlscyIsInRoZW4iLCJpIiwicHVzaCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicHJvbWlzZV9hcnJheSIsImFwaV91cmwiLCJkIiwic25pcHBldCIsIm5leHRQYWdlVG9rZW4iLCJnZXROZXh0IiwibGltaXQiLCJnZXRKU09OIiwic2xpZGVVcCIsInNsaWRlRG93biIsInN3YWwiLCJkb25lIiwidWkiLCJyZXNldCIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwiZmlsdGVyZWQiLCJuZXdPYmoiLCJlYWNoIiwidG1wIiwiZnJvbSIsIm5hbWUiLCJwb3N0bGluayIsIm1lc3NhZ2UiLCJzdG9yeSIsInR5cGUiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInN0ciIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwiZmlsdGVyZGF0YSIsInRoZWFkIiwidGJvZHkiLCJwaWMiLCJ0b3RhbF9yIiwiaG9zdCIsImVudHJpZXMiLCJqIiwicGljdHVyZSIsInRhciIsInRvcExldmVsQ29tbWVudCIsInRvdGFsUmVwbHlDb3VudCIsImF1dGhvclByb2ZpbGVJbWFnZVVybCIsInRkIiwiYXV0aG9yQ2hhbm5lbFVybCIsImF1dGhvckRpc3BsYXlOYW1lIiwidGV4dERpc3BsYXkiLCJsaWtlQ291bnQiLCJwdWJsaXNoZWRBdCIsInRyIiwiaW5zZXJ0IiwiaHRtbCIsImFjdGl2ZSIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImxpc3QiLCJuIiwicGFyc2VJbnQiLCJmaW5kIiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJtYXAiLCJpbmRleCIsInJvd3MiLCJub2RlcyIsImlubmVySFRNTCIsIm5vdyIsImsiLCJlcSIsImluc2VydEJlZm9yZSIsImdlbl9iaWdfYXdhcmQiLCJsaSIsImF3YXJkcyIsImhhc0F0dHJpYnV0ZSIsImF3YXJkX25hbWUiLCJhdHRyIiwicmVwbGFjZSIsImxpbmsiLCJ0aW1lIiwiY2xvc2VfYmlnX2F3YXJkIiwiZW1wdHkiLCJGQiIsImFwaSIsInN1YnN0cmluZyIsInBvc3R1cmwiLCJvYmoiLCJmdWxsSUQiLCJvZ19vYmplY3QiLCJyZWdleCIsIm5ld3VybCIsInN1YnN0ciIsIm1hdGNoIiwidXJsdHlwZSIsImNoZWNrVHlwZSIsImNoZWNrUGFnZUlEIiwicGFnZUlEIiwicHVyZUlEIiwidmlkZW8iLCJ0aXRsZSIsImxpdmVfc3RhdHVzIiwiZXJyb3IiLCJhY2Nlc3NfdG9rZW4iLCJncm91cCIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJ1bmlxdWUiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJuZXdBcnkiLCJncmVwIiwidGV4dE9yaWdpbmFsIiwidGFnIiwibWVzc2FnZV90YWdzIiwic3QiLCJ0IiwidGltZV9hcnkyIiwic3BsaXQiLCJ0aW1lX2FyeSIsImVuZHRpbWUiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJzdGFydHRpbWUiLCJhIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJyb3ciLCJzbGljZSIsImFsZXJ0IiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBaUJDLFNBQWpCO0FBQ0EsSUFBSUMsS0FBSjtBQUNBLElBQUlDLGNBQWMsVUFBbEI7QUFDQSxJQUFJQyxVQUFVLEtBQWQ7QUFDQSxJQUFJQyxhQUFhLEVBQWpCOztBQUVBLFNBQVNKLFNBQVQsQ0FBbUJLLEdBQW5CLEVBQXdCQyxHQUF4QixFQUE2QkMsQ0FBN0IsRUFBZ0M7QUFDL0IsS0FBSSxDQUFDVixZQUFMLEVBQW1CO0FBQ2xCVyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBaUQsNEJBQWpEO0FBQ0FELFVBQVFDLEdBQVIsQ0FBWSxzQkFBc0JDLEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQWxDO0FBQ0FELElBQUUsaUJBQUYsRUFBcUJFLE1BQXJCLENBQTRCLFNBQVNGLEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQXJDO0FBQ0FELElBQUUsaUJBQUYsRUFBcUJHLE1BQXJCO0FBQ0FoQixpQkFBZSxJQUFmO0FBQ0E7QUFDRCxRQUFPLEtBQVA7QUFDQTs7QUFFRGEsRUFBRUksUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVk7QUFDN0IsS0FBSUMsT0FBT0MsU0FBU0MsTUFBcEI7QUFDQSxLQUFJRixLQUFLRyxPQUFMLENBQWEsV0FBYixLQUE2QixDQUFqQyxFQUFvQztBQUNuQ1QsSUFBRSxvQkFBRixFQUF3QlUsV0FBeEIsQ0FBb0MsTUFBcEM7QUFDQUMsT0FBS0MsU0FBTCxHQUFpQixJQUFqQjs7QUFFQVosSUFBRSwyQkFBRixFQUErQmEsS0FBL0IsQ0FBcUMsVUFBVUMsQ0FBVixFQUFhO0FBQ2pEQyxNQUFHQyxhQUFIO0FBQ0EsR0FGRDtBQUdBO0FBQ0QsS0FBSVYsS0FBS0csT0FBTCxDQUFhLFFBQWIsS0FBMEIsQ0FB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Q0FBY0MsV0FBZCxDQUEwQnhGLElBQTFCO0FBQ0FBLE1BQUs5SyxLQUFMO0FBQ0FULFVBQVM4USxJQUFULENBQWNFLFdBQWQsQ0FBMEJ6RixJQUExQjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yID0gaGFuZGxlRXJyO1xyXG52YXIgVEFCTEU7XHJcbnZhciBsYXN0Q29tbWFuZCA9ICdjb21tZW50cyc7XHJcbnZhciBhZGRMaW5rID0gZmFsc2U7XHJcbnZhciBhdXRoX3Njb3BlID0gJyc7XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLCB1cmwsIGwpIHtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSkge1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLCBcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0Y29uc29sZS5sb2coXCJFcnJvciBvY2N1ciBVUkzvvJogXCIgKyAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuYXBwZW5kKFwiPGJyPlwiICsgJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5zZWFyY2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImV4dGVuc2lvblwiKSA+PSAwKSB7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGRhdGEuZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0aWYgKGhhc2guaW5kZXhPZihcInJhbmtlclwiKSA+PSAwKSB7XHJcblx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdGNvbW1hbmQ6ICdyYW5rZXInLFxyXG5cdFx0XHRkYXRhOiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5yYW5rZXIpXHJcblx0XHR9XHJcblx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdH1cclxuXHJcblxyXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJCgnLnVybCcpLnZhbCgpKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGNob29zZS5pbml0KCk7XHJcblx0fSk7XHJcblx0XHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVkvTU0vREQgSEg6bW1cIixcclxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXHJcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxyXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXHJcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxyXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxyXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcclxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcclxuXHRcdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFx0XCLkuoxcIixcclxuXHRcdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFx0XCLkupRcIixcclxuXHRcdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XHRcIuS6jOaciFwiLFxyXG5cdFx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XHRcIuS6lOaciFwiLFxyXG5cdFx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XHRcIuWFq+aciFwiLFxyXG5cdFx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XHRcIuWNgeS4gOaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sIGZ1bmN0aW9uIChzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5zdGFydFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IGVuZC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKGNvbmZpZy5maWx0ZXIuc3RhcnRUaW1lKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGEpO1xyXG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHRcdFx0d2luZG93LmZvY3VzKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKSB7XHJcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpbHRlcjoge1xyXG5cdFx0d29yZDogJycsXHJcblx0XHRyZWFjdDogJ2FsbCcsXHJcblx0XHRzdGFydFRpbWU6ICcyMDAwLTEyLTMxLTAwLTAwLTAwJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0b3JkZXI6ICdjaHJvbm9sb2dpY2FsJyxcclxuXHRhdXRoOiAnbWFuYWdlX3BhZ2VzLGdyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nLFxyXG5cdGxpa2VzOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG5cdGZyb21fZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRrZXk6ICdBSXphU3lBWjJuUEtZYWdWNmhxd19EUG1wWGJBRzdHTk9OWEFwQlknLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHZpZGVvSUQgPSAnJykgPT4ge1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHQkLmdldChgaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20veW91dHViZS92My92aWRlb3M/cGFydD1zbmlwcGV0JTJDY29udGVudERldGFpbHMlMkNsaXZlU3RyZWFtaW5nRGV0YWlscyZpZD0ke3ZpZGVvSUR9JmtleT0ke2NvbmZpZy5rZXl9YCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0ZGF0YS5zdGFydChyZXMpO1xyXG5cdFx0fSlcclxuXHR9LFxyXG5cdGF1dGhPSzogKCkgPT4ge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgcG9zdGRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5wb3N0ZGF0YSk7XHJcblx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdGNvbW1hbmQ6IHBvc3RkYXRhLmNvbW1hbmQsXHJcblx0XHRcdGRhdGE6IEpTT04ucGFyc2UoJChcIi5jaHJvbWVcIikudmFsKCkpXHJcblx0XHR9XHJcblx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiBbXSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W6LOH5paZ5LitLi4uJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0fSxcclxuXHRzdGFydDogKHZpZGVvX2RldGFpbCkgPT4ge1xyXG5cdFx0bGV0IGZiaWQgPSB7XHJcblx0XHRcdGRldGFpbDogdmlkZW9fZGV0YWlsLml0ZW1zWzBdLFxyXG5cdFx0XHRkYXRhOiBbXSxcclxuXHRcdH07XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JCgnLnB1cmVfZmJpZCcpLnRleHQoZmJpZC5kZXRhaWwuaWQpO1xyXG5cdFx0aWYgKHZpZGVvX2RldGFpbC5pdGVtc1swXS5saXZlU3RyZWFtaW5nRGV0YWlscyl7XHJcblxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGRhdGEuZ2V0KHZpZGVvX2RldGFpbC5pdGVtc1swXS5pZCkudGhlbigocmVzKSA9PiB7XHJcblx0XHRcdFx0Zm9yIChsZXQgaSBvZiByZXMpIHtcclxuXHRcdFx0XHRcdGZiaWQuZGF0YS5wdXNoKGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhLmZpbmlzaChmYmlkKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXQ6IChpZCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBhcGlfdXJsID0gYGh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3lvdXR1YmUvdjMvY29tbWVudFRocmVhZHM/cGFydD1zbmlwcGV0JTJDcmVwbGllcyZtYXhSZXN1bHRzPTEwMCZvcmRlcj10aW1lJnZpZGVvSWQ9JHtpZH0ma2V5PSR7Y29uZmlnLmtleX1gO1xyXG5cclxuXHRcdFx0JC5nZXQoYXBpX3VybCwgKHJlcyk9PntcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuaXRlbXMubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuaXRlbXMpIHtcclxuXHRcdFx0XHRcdGlmIChkLnNuaXBwZXQpIHtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5pdGVtcy5sZW5ndGggPiAwICYmIHJlcy5uZXh0UGFnZVRva2VuKSB7XHJcblx0XHRcdFx0XHRnZXROZXh0KGAke2FwaV91cmx9JnBhZ2VUb2tlbj0ke3Jlcy5uZXh0UGFnZVRva2VufWApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0ID0gMCkge1xyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5pdGVtcy5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuaXRlbXMpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGQuc25pcHBldCkge1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuaXRlbXMubGVuZ3RoID4gMCAmJiByZXMubmV4dFBhZ2VUb2tlbikge1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KGAke2FwaV91cmx9JnBhZ2VUb2tlbj0ke3Jlcy5uZXh0UGFnZVRva2VufWApO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIudXBkYXRlX2FyZWEsLmRvbmF0ZV9hcmVhXCIpLnNsaWRlVXAoKTtcclxuXHRcdCQoXCIucmVzdWx0X2FyZWFcIikuc2xpZGVEb3duKCk7XHJcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdHVpLnJlc2V0KCk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKSA9PiB7XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Ly8gaWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9PT0gZmFsc2UgJiYgcmF3RGF0YS5jb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHQvLyBcdHJhd0RhdGEuZGF0YSA9IHJhd0RhdGEuZGF0YS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHQvLyBcdFx0cmV0dXJuIGl0ZW0uaXNfaGlkZGVuID09PSBmYWxzZVxyXG5cdFx0Ly8gXHR9KTtcclxuXHRcdC8vIH1cclxuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKSB7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdykgPT4ge1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0Y29uc29sZS5sb2cocmF3KTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbikge1xyXG5cdFx0XHRpZiAocmF3LmNvbW1hbmQgPT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCI6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLooajmg4VcIjogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKSA9PiB7XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSkgPT4ge1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJkYXRhID0gcmF3ZGF0YS5maWx0ZXJlZDtcclxuXHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0bGV0IHRvdGFsX3IgPSAwO1xyXG5cclxuXHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZD7llpzmraE8L3RkPlxyXG5cdFx0XHQ8dGQ+5Zue6KaG5pW4PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cclxuXHRcdGxldCBob3N0ID0gYGh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9JHtyYXdkYXRhLmRldGFpbC5pZH1gO1xyXG5cclxuXHRcdGZvciAobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmRhdGEuZW50cmllcygpKSB7XHJcblx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdGxldCB0YXIgPSB2YWwuc25pcHBldC50b3BMZXZlbENvbW1lbnQuc25pcHBldDtcclxuXHRcdFx0dG90YWxfciArPSB2YWwuc25pcHBldC50b3RhbFJlcGx5Q291bnQ7XHJcblx0XHRcdGlmIChwaWMpIHtcclxuXHRcdFx0XHRwaWN0dXJlID0gYDxpbWcgc3JjPVwiJHt0YXIuYXV0aG9yUHJvZmlsZUltYWdlVXJsfVwiPjxicj5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9JyR7dGFyLmF1dGhvckNoYW5uZWxVcmx9JyB0YXJnZXQ9XCJfYmxhbmtcIiBpbWc9XCIke3Rhci5hdXRob3JQcm9maWxlSW1hZ2VVcmx9XCI+JHtwaWN0dXJlfSR7dGFyLmF1dGhvckRpc3BsYXlOYW1lfTwvYT48L3RkPmA7XHJcblxyXG5cdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiJHtob3N0fSZsYz0ke3ZhbC5zbmlwcGV0LnRvcExldmVsQ29tbWVudC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3Rhci50ZXh0RGlzcGxheX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQ+JHt0YXIubGlrZUNvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkPiR7dmFsLnNuaXBwZXQudG90YWxSZXBseUNvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHRhci5wdWJsaXNoZWRBdCl9PC90ZD5gO1xyXG5cclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHQkKCcuZmlsdGVycyAudG90YWxfZGV0YWlsIC50JykudGV4dChyYXdkYXRhLmRhdGEubGVuZ3RoKTtcclxuXHRcdCQoJy5maWx0ZXJzIC50b3RhbF9kZXRhaWwgLnInKS50ZXh0KHRvdGFsX3IpO1xyXG5cdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cclxuXHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKSB7XHJcblx0XHRcdFRBQkxFID0gJChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoXCIjc2VhcmNoTmFtZVwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEFCTEVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChcIiNzZWFyY2hDb21tZW50XCIpLm9uKCdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUQUJMRVxyXG5cdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKSA9PiB7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNzZWFyY2hDb21tZW50XCIpLnZhbCgpICE9ICcnKSB7XHJcblx0XHRcdHRhYmxlLnJlZG8oKTtcclxuXHRcdH1cclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKSB7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XHJcblx0XHRcdFx0XHRcdFwibmFtZVwiOiBwLFxyXG5cdFx0XHRcdFx0XHRcIm51bVwiOiBuXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbygpO1xyXG5cdH0sXHJcblx0Z286ICgpID0+IHtcclxuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhLmZpbHRlcmVkLmxlbmd0aCkuc3BsaWNlKDAsIGNob29zZS5udW0pO1xyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0Y2hvb3NlLmF3YXJkLm1hcCgodmFsLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0ciB0aXRsZT1cIuesrCcgKyAoaW5kZXggKyAxKSArICflkI1cIj4nICsgJCgnLm1haW5fdGFibGUnKS5EYXRhVGFibGUoKS5yb3dzKHtcclxuXHRcdFx0XHRzZWFyY2g6ICdhcHBsaWVkJ1xyXG5cdFx0XHR9KS5ub2RlcygpW3ZhbF0uaW5uZXJIVE1MICsgJzwvdHI+JztcclxuXHRcdH0pXHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYgKGNob29zZS5kZXRhaWwpIHtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvciAobGV0IGsgaW4gY2hvb3NlLmxpc3QpIHtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjVcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH0sXHJcblx0Z2VuX2JpZ19hd2FyZDogKCkgPT4ge1xyXG5cdFx0bGV0IGxpID0gJyc7XHJcblx0XHRsZXQgYXdhcmRzID0gW107XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRib2R5IHRyJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHZhbCkge1xyXG5cdFx0XHRsZXQgYXdhcmQgPSB7fTtcclxuXHRcdFx0aWYgKHZhbC5oYXNBdHRyaWJ1dGUoJ3RpdGxlJykpIHtcclxuXHRcdFx0XHRhd2FyZC5hd2FyZF9uYW1lID0gZmFsc2U7XHJcblx0XHRcdFx0YXdhcmQubmFtZSA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS50ZXh0KCk7XHJcblx0XHRcdFx0YXdhcmQucGljID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMSkuZmluZCgnYScpLmF0dHIoJ2ltZycpO1xyXG5cdFx0XHRcdGF3YXJkLnVzZXJpZCA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJykucmVwbGFjZSgnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycsICcnKTtcclxuXHRcdFx0XHRhd2FyZC5tZXNzYWdlID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC5saW5rID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0XHRhd2FyZC50aW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoJCh2YWwpLmZpbmQoJ3RkJykubGVuZ3RoIC0gMSkudGV4dCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSB0cnVlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS50ZXh0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXdhcmRzLnB1c2goYXdhcmQpO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhhd2FyZHMpXHJcblx0XHRmb3IgKGxldCBpIG9mIGF3YXJkcykge1xyXG5cdFx0XHRpZiAoaS5hd2FyZF9uYW1lID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bGkgKz0gYDxsaSBjbGFzcz1cInByaXplTmFtZVwiPiR7aS5uYW1lfTwvbGk+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpPlxyXG5cdFx0XHRcdDxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cIiR7aS5waWN9XCIgYWx0PVwiXCI+PC9hPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJpbmZvXCI+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJuYW1lXCI+PGEgaHJlZj1cIiR7aS51c2VyaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLm5hbWV9PC9hPjwvcD5cclxuXHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIj48YSBocmVmPVwiJHtpLmxpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLm1lc3NhZ2V9PC9hPjwvcD5cclxuXHRcdFx0XHQ8cCBjbGFzcz1cInRpbWVcIj48YSBocmVmPVwiJHtpLmxpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtpLnRpbWV9PC9hPjwvcD5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2xpPmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJy5iaWdfYXdhcmQgdWwnKS5hcHBlbmQobGkpO1xyXG5cdFx0JCgnLmJpZ19hd2FyZCcpLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0fSxcclxuXHRjbG9zZV9iaWdfYXdhcmQ6ICgpID0+IHtcclxuXHRcdCQoJy5iaWdfYXdhcmQnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmVtcHR5KCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmJpZCA9IHtcclxuXHRmYmlkOiBbXSxcclxuXHRpbml0OiAodHlwZSkgPT4ge1xyXG5cdFx0Y29uZmlnLnBhZ2VUb2tlbiA9ICcnO1xyXG5cdFx0ZmJpZC5mYmlkID0gW107XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdEZCLmFwaShcIi9tZVwiLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdGRhdGEudXNlcmlkID0gcmVzLmlkO1xyXG5cdFx0XHRsZXQgdXJsID0gJyc7XHJcblx0XHRcdGlmIChhZGRMaW5rKSB7XHJcblx0XHRcdFx0dXJsID0gZmJpZC5mb3JtYXQoJCgnLm1vcmVsaW5rIC5hZGR1cmwnKS52YWwoKSk7XHJcblx0XHRcdFx0JCgnLm1vcmVsaW5rIC5hZGR1cmwnKS52YWwoJycpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHVybCA9IGZiaWQuZm9ybWF0KCQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh1cmwuaW5kZXhPZignLnBocD8nKSA9PT0gLTEgJiYgdXJsLmluZGV4T2YoJz8nKSA+IDApIHtcclxuXHRcdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKCc/JykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZiaWQuZ2V0KHVybCwgdHlwZSkudGhlbigoZmJpZCkgPT4ge1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC8vICQoJy5pZGVudGl0eScpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChg55m75YWl6Lqr5Lu977yaPGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Jlcy5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PHNwYW4+JHtyZXMubmFtZX08L3NwYW4+YCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKHVybCwgdHlwZSkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0aWYgKHR5cGUgPT0gJ3VybF9jb21tZW50cycpIHtcclxuXHRcdFx0XHRsZXQgcG9zdHVybCA9IHVybDtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiP1wiKSA+IDApIHtcclxuXHRcdFx0XHRcdHBvc3R1cmwgPSBwb3N0dXJsLnN1YnN0cmluZygwLCBwb3N0dXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0RkIuYXBpKGAvJHtwb3N0dXJsfWAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0XHRcdGZ1bGxJRDogcmVzLm9nX29iamVjdC5pZCxcclxuXHRcdFx0XHRcdFx0dHlwZTogdHlwZSxcclxuXHRcdFx0XHRcdFx0Y29tbWFuZDogJ2NvbW1lbnRzJ1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGNvbmZpZy5saW1pdFsnY29tbWVudHMnXSA9ICcyNSc7XHJcblx0XHRcdFx0XHRjb25maWcub3JkZXIgPSAnJztcclxuXHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRcdGxldCBuZXd1cmwgPSB1cmwuc3Vic3RyKHVybC5pbmRleE9mKCcvJywgMjgpICsgMSwgMjAwKTtcclxuXHRcdFx0XHQvLyBodHRwczovL3d3dy5mYWNlYm9vay5jb20vIOWFsTI15a2X5YWD77yM5Zug5q2k6YG4Mjjplovlp4vmib4vXHJcblx0XHRcdFx0bGV0IHJlc3VsdCA9IG5ld3VybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdFx0bGV0IHVybHR5cGUgPSBmYmlkLmNoZWNrVHlwZSh1cmwpO1xyXG5cdFx0XHRcdGZiaWQuY2hlY2tQYWdlSUQodXJsLCB1cmx0eXBlKS50aGVuKChpZCkgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKGlkID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHRcdHVybHR5cGUgPSAncGVyc29uYWwnO1xyXG5cdFx0XHRcdFx0XHRpZCA9IGRhdGEudXNlcmlkO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0cGFnZUlEOiBpZCxcclxuXHRcdFx0XHRcdFx0dHlwZTogdXJsdHlwZSxcclxuXHRcdFx0XHRcdFx0Y29tbWFuZDogdHlwZSxcclxuXHRcdFx0XHRcdFx0ZGF0YTogW11cclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRpZiAoYWRkTGluaykgb2JqLmRhdGEgPSBkYXRhLnJhdy5kYXRhOyAvL+i/veWKoOiyvOaWh1xyXG5cdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdwZXJzb25hbCcpIHtcclxuXHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ2ZiaWQ9Jyk7XHJcblx0XHRcdFx0XHRcdGlmIChzdGFydCA+PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGVuZCA9IHVybC5pbmRleE9mKFwiJlwiLCBzdGFydCk7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQgKyA1LCBlbmQpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdwb3N0cy8nKTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCArIDYsIHVybC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGxldCB2aWRlbyA9IHVybC5pbmRleE9mKCd2aWRlb3MvJyk7XHJcblx0XHRcdFx0XHRcdGlmICh2aWRlbyA+PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3B1cmUnKSB7XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCAnJyk7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZXZlbnQnKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reaJgOacieeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmNvbW1hbmQgPSAnZmVlZCc7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5p+Q56+H55WZ6KiA55qE55WZ6KiAXHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGF1dGhfc2NvcGUuaW5kZXhPZihcImdyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm9cIikgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArIFwiX1wiICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAn56S+5ZyY5L2/55So6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5ZyYJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aHRtbDogJzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdwaG90bycpIHtcclxuXHRcdFx0XHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRcdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3ZpZGVvJykge1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdEZCLmFwaShgLyR7b2JqLnB1cmVJRH0/ZmllbGRzPWxpdmVfc3RhdHVzYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5saXZlX3N0YXR1cyA9PT0gJ0xJVkUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3VubmFtZScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdEZCLmFwaShgLyR7b2JqLnBhZ2VJRH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2hlY2tUeXBlOiAocG9zdHVybCkgPT4ge1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImZiaWQ9XCIpID49IDApIHtcclxuXHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZigncGVybWFsaW5rJykgPj0gMCkge1xyXG5cdFx0XHRcdHJldHVybiAndW5uYW1lJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3BlcnNvbmFsJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvZ3JvdXBzL1wiKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiAnZ3JvdXAnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJldmVudHNcIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ2V2ZW50JztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL3Bob3Rvcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3Bob3RvJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL3ZpZGVvcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3ZpZGVvJztcclxuXHRcdH1cclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ1wiJykgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ3B1cmUnO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiAnbm9ybWFsJztcclxuXHR9LFxyXG5cdGNoZWNrUGFnZUlEOiAocG9zdHVybCwgdHlwZSkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IHN0YXJ0ID0gcG9zdHVybC5pbmRleE9mKFwiZmFjZWJvb2suY29tXCIpICsgMTM7XHJcblx0XHRcdGxldCBlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsIHN0YXJ0KTtcclxuXHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0aWYgKGVuZCA8IDApIHtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdmYmlkPScpID49IDApIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAndW5uYW1lJykge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCd1bm5hbWUnKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc29sdmUocG9zdHVybC5tYXRjaChyZWdleClbMV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgZ3JvdXAgPSBwb3N0dXJsLmluZGV4T2YoJy9ncm91cHMvJyk7XHJcblx0XHRcdFx0bGV0IGV2ZW50ID0gcG9zdHVybC5pbmRleE9mKCcvZXZlbnRzLycpXHJcblx0XHRcdFx0aWYgKGdyb3VwID49IDApIHtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gZ3JvdXAgKyA4O1xyXG5cdFx0XHRcdFx0ZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLCBzdGFydCk7XHJcblx0XHRcdFx0XHRsZXQgcmVnZXgyID0gL1xcZHs2LH0vZztcclxuXHRcdFx0XHRcdGxldCB0ZW1wID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XHJcblx0XHRcdFx0XHRpZiAocmVnZXgyLnRlc3QodGVtcCkpIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0ZW1wKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ2dyb3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmIChldmVudCA+PSAwKSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCdldmVudCcpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgcGFnZW5hbWUgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcclxuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZW5hbWV9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShyZXMuaWQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Zm9ybWF0OiAodXJsKSA9PiB7XHJcblx0XHRpZiAodXJsLmluZGV4T2YoJ2J1c2luZXNzLmZhY2Vib29rLmNvbS8nKSA+PSAwKSB7XHJcblx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3ZGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgc3RhcnRUaW1lLCBlbmRUaW1lKSA9PiB7XHJcblx0XHRsZXQgZGF0YSA9IHJhd2RhdGEuZGF0YTtcclxuXHRcdGlmICh3b3JkICE9PSAnJykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcpIHtcclxuXHRcdFx0Ly8gZGF0YSA9IGZpbHRlci50YWcoZGF0YSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIHN0YXJ0VGltZSwgZW5kVGltZSk7XHJcblxyXG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSkgPT4ge1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5zbmlwcGV0LnRvcExldmVsQ29tbWVudC5zbmlwcGV0LmF1dGhvckNoYW5uZWxVcmw7XHJcblx0XHRcdGlmIChrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4uc25pcHBldC50b3BMZXZlbENvbW1lbnQuc25pcHBldC50ZXh0T3JpZ2luYWwuaW5kZXhPZih3b3JkKSA+IC0xKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCBzdCwgdCkgPT4ge1xyXG5cdFx0bGV0IHRpbWVfYXJ5MiA9IHN0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IGVuZHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sIChwYXJzZUludCh0aW1lX2FyeVsxXSkgLSAxKSwgdGltZV9hcnlbMl0sIHRpbWVfYXJ5WzNdLCB0aW1lX2FyeVs0XSwgdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBzdGFydHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnkyWzBdLCAocGFyc2VJbnQodGltZV9hcnkyWzFdKSAtIDEpLCB0aW1lX2FyeTJbMl0sIHRpbWVfYXJ5MlszXSwgdGltZV9hcnkyWzRdLCB0aW1lX2FyeTJbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLnNuaXBwZXQudG9wTGV2ZWxDb21tZW50LnNuaXBwZXQucHVibGlzaGVkQXQpLl9kO1xyXG5cdFx0XHRpZiAoKGNyZWF0ZWRfdGltZSA+IHN0YXJ0dGltZSAmJiBjcmVhdGVkX3RpbWUgPCBlbmR0aW1lKSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKSA9PiB7XHJcblx0XHRpZiAodGFyID09ICdhbGwnKSB7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpID0+IHtcclxuXHJcblx0fSxcclxuXHRhZGRMaW5rOiAoKSA9PiB7XHJcblx0XHRsZXQgdGFyID0gJCgnLmlucHV0YXJlYSAubW9yZWxpbmsnKTtcclxuXHRcdGlmICh0YXIuaGFzQ2xhc3MoJ3Nob3cnKSkge1xyXG5cdFx0XHR0YXIucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRhci5hZGRDbGFzcygnc2hvdycpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVzZXQ6ICgpID0+IHtcclxuXHRcdGxldCBjb21tYW5kID0gZGF0YS5yYXcuY29tbWFuZDtcclxuXHRcdGlmIChjb21tYW5kID09PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpIHtcclxuXHRcdFx0JCgnbGFiZWwudGFnJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICgkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKSkge1xyXG5cdFx0XHRcdCQoXCIjdGFnXCIpLmNsaWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnbGFiZWwudGFnJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCkge1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkgKyAxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGRhdGUgKyBcIi1cIiArIGhvdXIgKyBcIi1cIiArIG1pbiArIFwiLVwiICsgc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKSB7XHJcblx0dmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG5cdHZhciBtb250aHMgPSBbJzAxJywgJzAyJywgJzAzJywgJzA0JywgJzA1JywgJzA2JywgJzA3JywgJzA4JywgJzA5JywgJzEwJywgJzExJywgJzEyJ107XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHRpZiAoZGF0ZSA8IDEwKSB7XHJcblx0XHRkYXRlID0gXCIwXCIgKyBkYXRlO1xyXG5cdH1cclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0aWYgKG1pbiA8IDEwKSB7XHJcblx0XHRtaW4gPSBcIjBcIiArIG1pbjtcclxuXHR9XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdGlmIChzZWMgPCAxMCkge1xyXG5cdFx0c2VjID0gXCIwXCIgKyBzZWM7XHJcblx0fVxyXG5cdHZhciB0aW1lID0geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF0ZSArIFwiIFwiICsgaG91ciArICc6JyArIG1pbiArICc6JyArIHNlYztcclxuXHRyZXR1cm4gdGltZTtcclxufVxyXG5cclxuZnVuY3Rpb24gb2JqMkFycmF5KG9iaikge1xyXG5cdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0cmV0dXJuIFt2YWx1ZV07XHJcblx0fSk7XHJcblx0cmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcblx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG5cdHZhciBpLCByLCB0O1xyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdGFyeVtpXSA9IGk7XHJcblx0fVxyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuXHRcdHQgPSBhcnlbcl07XHJcblx0XHRhcnlbcl0gPSBhcnlbaV07XHJcblx0XHRhcnlbaV0gPSB0O1xyXG5cdH1cclxuXHRyZXR1cm4gYXJ5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuXHQvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG5cdHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuXHJcblx0dmFyIENTViA9ICcnO1xyXG5cdC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG5cclxuXHQvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcblx0Ly9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuXHRpZiAoU2hvd0xhYmVsKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcblxyXG5cdFx0XHQvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG5cdFx0XHRyb3cgKz0gaW5kZXggKyAnLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuXHJcblx0XHQvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHQvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG5cdFx0XHRyb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuXHJcblx0XHQvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdGlmIChDU1YgPT0gJycpIHtcclxuXHRcdGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG5cdHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcblx0Ly90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcblx0ZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLCBcIl9cIik7XHJcblxyXG5cdC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcblx0dmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuXHJcblx0Ly8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcblx0Ly8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuXHQvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuXHQvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG5cclxuXHQvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuXHRsaW5rLmhyZWYgPSB1cmk7XHJcblxyXG5cdC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcblx0bGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuXHRsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuXHJcblx0Ly90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG5cdGxpbmsuY2xpY2soKTtcclxuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
