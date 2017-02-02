"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
window.onerror = handleErr;

function handleErr(msg, url, l) {
	$('.console .error').text(JSON.stringify(last_command) + " \u767C\u751F\u932F\u8AA4\uFF0C\u8ACB\u622A\u5716\u901A\u77E5\u7BA1\u7406\u54E1");
	if (!errorMessage) {
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		console.log("Error occur URL： " + $('#enterURL .url').val());
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}
$(document).ready(function () {
	$("#btn_login").click(function () {
		fb.getAuth('login');
	});
	$('#select').change(function () {
		var id = $(this).val();
		var name = $(this).find("option:selected").text();
		var type = $(this).find("option:selected").attr('data-type');
		var page = { id: id, name: name, type: type };
		if (page.id !== '0') {
			step.step2(page);
		}
	});

	$("#btn_comments").click(function (e) {
		fb.getAuth('comments');
	});

	$("#btn_like").click(function () {
		fb.getAuth('reactions');
	});

	$("#btn_pay").click(function () {
		fb.getAuth('addScope');
	});
	$("#btn_choose").click(function () {
		choose.init();
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

	$("#unique, #tag").on('change', function () {
		config.filter.isDuplicate = $("#unique").prop("checked");
		table.redo();
	});

	$('.optionFilter input').dateDropper();
	$('.pick-submit').on('click', function () {
		// config.filter.endTime = $('.optionFilter input').val()+"-23-59-59";
		// table.redo();
	});

	$(".uipanel .react").change(function () {
		config.filter.react = $(this).val();
		table.redo();
	});
});

var config = {
	field: {
		comments: ['like_count', 'message_tags', 'message,from', 'created_time'],
		reactions: [],
		sharedposts: ['story', 'from', 'created_time'],
		url_comments: [],
		feed: []
	},
	limit: {
		comments: '500',
		reactions: '500',
		sharedposts: '500',
		url_comments: '500',
		feed: '500'
	},
	apiVersion: {
		comments: 'v2.8',
		reactions: 'v2.8',
		sharedposts: 'v2.3',
		url_comments: 'v2.8',
		feed: 'v2.3',
		group: 'v2.8'
	},
	filter: {
		isDuplicate: true,
		isTag: false,
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	auth: 'user_photos,user_posts,user_managed_groups,manage_pages'
};

var fb = {
	user_posts: false,
	getAuth: function getAuth(type) {
		FB.login(function (response) {
			fb.callback(response, type);
			console.log(response);
		}, { scope: config.auth, return_scopes: true });
	},
	callback: function callback(response, type) {
		if (response.status === 'connected') {
			if (type == "login") {
				if (response.authResponse.grantedScopes.indexOf('read_stream') >= 0) {
					step.step1();
				} else {
					alert('沒有權限或授權不完成');
				}
			} else {
				step.step3();
			}
		} else {
			FB.login(function (response) {
				fb.callback(response);
			}, { scope: config.auth, return_scopes: true });
		}
	}
};
var fanpage = [];
var group = [];
var shortcut = [];
var last_command = {};
var url = {
	send: function send(tar, command) {
		var id = $(tar).parent().siblings('p').find('input').val();
		step.step3(id, command);
	}
};
var step = {
	step1: function step1() {
		$('.login').addClass('success');
		FB.api('v2.8/me/accounts', function (res) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				var _loop = function _loop() {
					var i = _step.value;

					fanpage.push(i);
					$("#select").prepend("<option data-type=\"posts\" value=\"" + i.id + "\">" + i.name + "</option>");
					FB.api("v2.8/" + i.id + "/posts", function (res2) {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = res2.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var j = _step2.value;

								if (j.message && j.message.indexOf('抽獎') >= 0) {
									var mess = j.message.replace(/\n/g, "<br />");
									$('.step1 .cards').append("\n\t\t\t\t\t\t\t\t<div class=\"card\" data-fbid=\"" + j.id + "\">\n\t\t\t\t\t\t\t\t<p class=\"title\">" + i.name + "</p>\n\t\t\t\t\t\t\t\t<p class=\"message\" onclick=\"card.show(this)\">" + mess + "</p>\n\t\t\t\t\t\t\t\t<div class=\"action\">\n\t\t\t\t\t\t\t\t<div class=\"reactions\" onclick=\"step.step3('" + j.id + "', 'reactions')\">\u8B9A</div>\n\t\t\t\t\t\t\t\t<div class=\"comments\" onclick=\"step.step3('" + j.id + "', 'comments')\">\u7559\u8A00</div>\n\t\t\t\t\t\t\t\t<div class=\"sharedposts\" onclick=\"step.step3('" + j.id + "', 'sharedposts')\">\u5206\u4EAB</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t");
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
					});
				};

				for (var _iterator = res.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					_loop();
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
		});
		FB.api('v2.8/me/groups', function (res) {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				var _loop2 = function _loop2() {
					var i = _step3.value;

					group.push(i);
					$("#select").prepend("<option data-type=\"feed\" value=\"" + i.id + "\">" + i.name + "</option>");
					FB.api("v2.8/" + i.id + "/feed?fields=from,message,id", function (res2) {
						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;

						try {
							for (var _iterator4 = res2.data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								var j = _step4.value;

								if (j.message && j.message.indexOf('抽獎') >= 0 && j.from.id) {
									var mess = j.message.replace(/\n/g, "<br />");
									$('.step1 .cards').append("\n\t\t\t\t\t\t\t\t<div class=\"card\" data-fbid=\"" + j.id + "\">\n\t\t\t\t\t\t\t\t<p class=\"title\">" + i.name + "</p>\n\t\t\t\t\t\t\t\t<p class=\"message\">" + mess + "</p>\n\t\t\t\t\t\t\t\t<div class=\"action\">\n\t\t\t\t\t\t\t\t<div class=\"reactions\" onclick=\"step.step3('" + j.id + "', 'reactions')\">\u8B9A</div>\n\t\t\t\t\t\t\t\t<div class=\"comments\" onclick=\"step.step3('" + j.id + "', 'comments')\">\u7559\u8A00</div>\n\t\t\t\t\t\t\t\t<div class=\"sharedposts\" onclick=\"step.step3('" + j.id + "', 'sharedposts')\">\u5206\u4EAB</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t");
								}
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
					});
				};

				for (var _iterator3 = res.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					_loop2();
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
		});
		FB.api('v2.8/me', function (res) {
			$("#select").prepend("<option data-type=\"posts\" value=\"" + res.id + "\">" + res.name + "</option>");
			FB.api("v2.8/me/posts", function (res2) {
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = res2.data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var j = _step5.value;

						if (j.message && j.message.indexOf('抽獎') >= 0) {
							var mess = j.message.replace(/\n/g, "<br />");
							$('.step1 .cards').append("\n\t\t\t\t\t\t\t<div class=\"card\" data-fbid=\"" + j.id + "\">\n\t\t\t\t\t\t\t<p class=\"title\">" + res.name + "</p>\n\t\t\t\t\t\t\t<p class=\"message\" onclick=\"card.show(this)\">" + mess + "</p>\n\t\t\t\t\t\t\t<div class=\"action\">\n\t\t\t\t\t\t\t<div class=\"reactions\" onclick=\"step.step3('" + j.id + "', 'reactions')\">\u8B9A</div>\n\t\t\t\t\t\t\t<div class=\"comments\" onclick=\"step.step3('" + j.id + "', 'comments')\">\u7559\u8A00</div>\n\t\t\t\t\t\t\t<div class=\"sharedposts\" onclick=\"step.step3('" + j.id + "', 'sharedposts')\">\u5206\u4EAB</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t");
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
			});
		});
	},
	step2: function step2(page) {
		$('.step2').addClass('visible');
		$('.step2 .cards').html("");
		$('.step2 .head span').text(page.name);
		var command = page.type;
		FB.api("v2.8/" + page.id + "/" + command, function (res) {
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = res.data[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var j = _step6.value;

					var mess = j.message ? j.message.replace(/\n/g, "<br />") : "";
					$('.step2 .cards').append("\n\t\t\t\t\t<div class=\"card\" data-fbid=\"" + j.id + "\">\n\t\t\t\t\t<p class=\"message\" onclick=\"card.show(this)\">" + mess + "</p>\n\t\t\t\t\t<div class=\"action\">\n\t\t\t\t\t<div class=\"reactions\" onclick=\"step.step3('" + j.id + "', 'reactions')\">\u8B9A</div>\n\t\t\t\t\t<div class=\"comments\" onclick=\"step.step3('" + j.id + "', 'comments')\">\u7559\u8A00</div>\n\t\t\t\t\t<div class=\"sharedposts\" onclick=\"step.step3('" + j.id + "', 'sharedposts')\">\u5206\u4EAB</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t");
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
		});
	},
	step2to1: function step2to1() {
		$('#select').val(0);
		$('.step2').removeClass('visible');
	},
	step3hide: function step3hide() {
		$("#awardList").hide();
		$('.step3').removeClass('visible');
	},
	step3: function step3(fbid, command) {
		last_command = { fbid: fbid, command: command };
		config.filter.endTime = nowDate();
		$('.step3').addClass('visible');
		$(".console .message").text('');
		$('.loading.waiting').addClass('visible');
		data.raw = [];
		data.filtered = [];
		data.command = command;
		if (command == 'reactions') {
			$('.optionFilter .react').removeClass('hide');
			$('.optionFilter .timelimit').addClass('hide');
		}
		FB.api(config.apiVersion[command] + "/" + fbid + "/" + command, function (res) {
			console.log(res);
			data.length = res.data.length;
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = res.data[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var d = _step7.value;

					if (d.id) {
						if (command == 'reactions') {
							d.from = { id: d.id, name: d.name };
						}
						if (d.from) {
							data.raw.push(d);
						}
					}
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

			if (res.data.length > 0 && res.paging.next) {
				getNext(res.paging.next);
			} else {
				filter.totalFilter.apply(filter, [data.raw].concat(_toConsumableArray(obj2Array(config.filter))));
			}
		});

		function getNext(url) {
			$.getJSON(url, function (res) {
				data.length += res.data.length;
				$(".console .message").text('已截取  ' + data.length + ' 筆資料...');
				var _iteratorNormalCompletion8 = true;
				var _didIteratorError8 = false;
				var _iteratorError8 = undefined;

				try {
					for (var _iterator8 = res.data[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
						var d = _step8.value;

						if (d.id) {
							if (command == 'reactions') {
								d.from = { id: d.id, name: d.name };
							}
							if (d.from) {
								data.raw.push(d);
							}
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

				if (res.data.length > 0 && res.paging.next) {
					getNext(res.paging.next);
				} else {
					filter.totalFilter.apply(filter, [data.raw].concat(_toConsumableArray(obj2Array(config.filter))));
				}
			}).fail(function () {
				getNext(url, 200);
			});
		}
	}
};

var card = {
	show: function show(e) {
		if ($(e).hasClass('visible')) {
			$(e).removeClass('visible');
		} else {
			$(e).addClass('visible');
		}
	}
};

var data = {
	raw: [],
	filtered: [],
	command: '',
	length: 0
};

var table = {
	generate: function generate() {
		$('.loading.waiting').removeClass('visible');
		$(".main_table").DataTable().destroy();
		var filterdata = data.filtered;
		var thead = '';
		var tbody = '';
		if (data.command === 'reactions') {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u8868\u60C5</td>";
		} else {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
		}

		var host = 'http://www.facebook.com/';

		var _iteratorNormalCompletion9 = true;
		var _didIteratorError9 = false;
		var _iteratorError9 = undefined;

		try {
			for (var _iterator9 = filterdata.entries()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
				var _step9$value = _slicedToArray(_step9.value, 2),
				    j = _step9$value[0],
				    val = _step9$value[1];

				var td = "<td><a href='http://www.facebook.com/" + val.id + "' target=\"_blank\">" + (j + 1) + "</a></td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' target=\"_blank\">" + val.from.name + "</a></td>";
				if (data.command === 'reactions') {
					td += "<td class=\"center\"><span class=\"react " + val.type + "\"></span>" + val.type + "</td>";
				} else {
					td += "<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
				}
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
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

		var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
		$(".main_table").html('').append(insert);

		active();

		function active() {
			var table = $(".main_table").DataTable({
				"pageLength": 300,
				"searching": true,
				"lengthChange": false
			});

			$("#searchName").on('blur change keyup', function () {
				table.columns(1).search(this.value).draw();
			});
		}
	},
	redo: function redo() {
		filter.totalFilter.apply(filter, [data.raw].concat(_toConsumableArray(obj2Array(config.filter))));
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
		if ($("#moreprize").hasClass("active")) {
			choose.detail = true;
			$(".prizeDetail .prize").each(function () {
				var n = parseInt($(this).find("input[type='number']").val());
				var p = $(this).find("input[type='text']").val();
				if (n > 0) {
					choose.num += parseInt(n);
					choose.list.push({ "name": p, "num": n });
				}
			});
		} else {
			choose.num = $("#howmany").val();
		}
		choose.go();
	},
	go: function go() {
		var num = $("#howmany").val();
		choose.award = genRandomArray(data.filtered.length).splice(0, num);
		var insert = '';
		var _iteratorNormalCompletion10 = true;
		var _didIteratorError10 = false;
		var _iteratorError10 = undefined;

		try {
			for (var _iterator10 = choose.award[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
				var _i = _step10.value;

				insert += '<tr>' + $('.main_table').DataTable().rows({ search: 'applied' }).nodes()[_i].innerHTML + '</tr>';
			}
		} catch (err) {
			_didIteratorError10 = true;
			_iteratorError10 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion10 && _iterator10.return) {
					_iterator10.return();
				}
			} finally {
				if (_didIteratorError10) {
					throw _iteratorError10;
				}
			}
		}

		$('#awardList table tbody').html(insert);
		$('#awardList table tbody tr').addClass('success');

		$("#awardList").fadeIn(1000);
	}
};

var fbid = {
	fbid: [],
	init: function init(type) {
		fbid.fbid = [];
		data.init();
		FB.api("/me", function (res) {
			data.userid = res.id;
			var url = fbid.format($('#enterURL .url').val());
			fbid.get(url, type).then(function (fbid) {
				data.start(fbid);
			});
			$('.identity').removeClass('hide').html("\u767B\u5165\u8EAB\u4EFD\uFF1A<img src=\"http://graph.facebook.com/" + res.id + "/picture?type=small\"><span>" + res.name + "</span>");
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
					var obj = { fullID: res.og_object.id, type: type, command: 'comments' };
					resolve(obj);
				});
			} else {
				(function () {
					var regex = /\d{4,}/g;
					var result = url.match(regex);
					var urltype = fbid.checkType(url);
					fbid.checkPageID(url, urltype).then(function (id) {
						if (id === 'personal') {
							urltype = 'personal';
							id = data.userid;
						}
						var obj = { pageID: id, type: urltype, command: type };
						if (urltype === 'personal') {
							var start = url.indexOf('fbid=');
							if (start >= 0) {
								var end = url.indexOf("&", start);
								obj.pureID = url.substring(start + 5, end);
							} else {
								var _start = url.indexOf('posts/');
								obj.pureID = url.substring(_start + 6, url.length);
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
									resolve(obj);
								}
							}
						}
					});
				})();
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
				var _group = posturl.indexOf('/groups/');
				var event = posturl.indexOf('/events/');
				if (_group >= 0) {
					start = _group + 8;
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
					FB.api("/" + pagename, function (res) {
						if (res.error) {
							resolve('personal');
						} else {
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

var filter = {
	totalFilter: function totalFilter(rawdata, isDuplicate, isTag, word, react, endTime) {
		var d = rawdata;
		if (isDuplicate) {
			d = filter.unique(d);
		}
		if (word !== '') {
			d = filter.word(d, word);
		}
		if (isTag) {
			d = filter.tag(d);
		}
		if (data.command !== 'reactions') {
			d = filter.time(d, endTime);
		} else {
			d = filter.react(d, react);
		}
		data.filtered = d;
		table.generate();
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
			if (n.message.indexOf(_word) > -1) {
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
	time: function time(data, t) {
		var time_ary = t.split("-");
		var time = moment(new Date(time_ary[0], parseInt(time_ary[1]) - 1, time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;
		var newAry = $.grep(data, function (n, i) {
			var created_time = moment(n.created_time)._d;
			if (created_time < time || n.created_time == "") {
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
	reset: function reset() {
		var command = data.raw.command;
		if (command === 'reactions') {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW5fbS5qcyJdLCJuYW1lcyI6WyJlcnJvck1lc3NhZ2UiLCJ3aW5kb3ciLCJvbmVycm9yIiwiaGFuZGxlRXJyIiwibXNnIiwidXJsIiwibCIsIiQiLCJ0ZXh0IiwiSlNPTiIsInN0cmluZ2lmeSIsImxhc3RfY29tbWFuZCIsImNvbnNvbGUiLCJsb2ciLCJ2YWwiLCJmYWRlSW4iLCJkb2N1bWVudCIsInJlYWR5IiwiY2xpY2siLCJmYiIsImdldEF1dGgiLCJjaGFuZ2UiLCJpZCIsIm5hbWUiLCJmaW5kIiwidHlwZSIsImF0dHIiLCJwYWdlIiwic3RlcCIsInN0ZXAyIiwiZSIsImNob29zZSIsImluaXQiLCJoYXNDbGFzcyIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJhcHBlbmQiLCJvbiIsImNvbmZpZyIsImZpbHRlciIsImlzRHVwbGljYXRlIiwicHJvcCIsInRhYmxlIiwicmVkbyIsImRhdGVEcm9wcGVyIiwicmVhY3QiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJpc1RhZyIsIndvcmQiLCJlbmRUaW1lIiwibm93RGF0ZSIsImF1dGgiLCJ1c2VyX3Bvc3RzIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiaW5kZXhPZiIsInN0ZXAxIiwiYWxlcnQiLCJzdGVwMyIsImZhbnBhZ2UiLCJzaG9ydGN1dCIsInNlbmQiLCJ0YXIiLCJjb21tYW5kIiwicGFyZW50Iiwic2libGluZ3MiLCJhcGkiLCJyZXMiLCJpIiwicHVzaCIsInByZXBlbmQiLCJyZXMyIiwiZGF0YSIsImoiLCJtZXNzYWdlIiwibWVzcyIsInJlcGxhY2UiLCJmcm9tIiwiaHRtbCIsInN0ZXAydG8xIiwic3RlcDNoaWRlIiwiaGlkZSIsImZiaWQiLCJyYXciLCJmaWx0ZXJlZCIsImxlbmd0aCIsImQiLCJwYWdpbmciLCJuZXh0IiwiZ2V0TmV4dCIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwiZ2V0SlNPTiIsImZhaWwiLCJjYXJkIiwic2hvdyIsImdlbmVyYXRlIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImZpbHRlcmRhdGEiLCJ0aGVhZCIsInRib2R5IiwiaG9zdCIsImVudHJpZXMiLCJ0ZCIsInRpbWVDb252ZXJ0ZXIiLCJjcmVhdGVkX3RpbWUiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJzZWFyY2giLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJlYWNoIiwibiIsInBhcnNlSW50IiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJyb3dzIiwibm9kZXMiLCJpbm5lckhUTUwiLCJ1c2VyaWQiLCJmb3JtYXQiLCJnZXQiLCJ0aGVuIiwic3RhcnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInBvc3R1cmwiLCJzdWJzdHJpbmciLCJvYmoiLCJmdWxsSUQiLCJvZ19vYmplY3QiLCJyZWdleCIsInJlc3VsdCIsIm1hdGNoIiwidXJsdHlwZSIsImNoZWNrVHlwZSIsImNoZWNrUGFnZUlEIiwicGFnZUlEIiwiZW5kIiwicHVyZUlEIiwic3dhbCIsInRpdGxlIiwiZG9uZSIsImV2ZW50IiwicmVnZXgyIiwidGVtcCIsInRlc3QiLCJwYWdlbmFtZSIsImVycm9yIiwicmF3ZGF0YSIsInVuaXF1ZSIsInRhZyIsInRpbWUiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJuZXdBcnkiLCJncmVwIiwibWVzc2FnZV90YWdzIiwidCIsInRpbWVfYXJ5Iiwic3BsaXQiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJ1aSIsInJlc2V0IiwiYSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsIm1hcCIsImluZGV4IiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBZUMsU0FBZjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQ0MsR0FBRSxpQkFBRixFQUFxQkMsSUFBckIsQ0FBNkJDLEtBQUtDLFNBQUwsQ0FBZUMsWUFBZixDQUE3QjtBQUNBLEtBQUksQ0FBQ1gsWUFBTCxFQUFrQjtBQUNqQlksVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWdELDRCQUFoRDtBQUNBRCxVQUFRQyxHQUFSLENBQVksc0JBQXNCTixFQUFFLGdCQUFGLEVBQW9CTyxHQUFwQixFQUFsQztBQUNBUCxJQUFFLGlCQUFGLEVBQXFCUSxNQUFyQjtBQUNBZixpQkFBZSxJQUFmO0FBQ0E7QUFDRCxRQUFPLEtBQVA7QUFDQTtBQUNETyxFQUFFUyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUMzQlYsR0FBRSxZQUFGLEVBQWdCVyxLQUFoQixDQUFzQixZQUFVO0FBQy9CQyxLQUFHQyxPQUFILENBQVcsT0FBWDtBQUNBLEVBRkQ7QUFHQWIsR0FBRSxTQUFGLEVBQWFjLE1BQWIsQ0FBb0IsWUFBVTtBQUM3QixNQUFJQyxLQUFLZixFQUFFLElBQUYsRUFBUU8sR0FBUixFQUFUO0FBQ0EsTUFBSVMsT0FBT2hCLEVBQUUsSUFBRixFQUFRaUIsSUFBUixDQUFhLGlCQUFiLEVBQWdDaEIsSUFBaEMsRUFBWDtBQUNBLE1BQUlpQixPQUFPbEIsRUFBRSxJQUFGLEVBQVFpQixJQUFSLENBQWEsaUJBQWIsRUFBZ0NFLElBQWhDLENBQXFDLFdBQXJDLENBQVg7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bkQsQ0FBdkIsRUFBMEI7QUFDekJpSSxNQUFJakksQ0FBSixJQUFTQSxDQUFUO0FBQ0E7QUFDRCxNQUFLQSxJQUFJLENBQVQsRUFBYUEsSUFBSW1ELENBQWpCLEVBQXFCLEVBQUVuRCxDQUF2QixFQUEwQjtBQUN6Qm1JLE1BQUlDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsTUFBTCxLQUFnQm5GLENBQTNCLENBQUo7QUFDQW9ELE1BQUkwQixJQUFJRSxDQUFKLENBQUo7QUFDQUYsTUFBSUUsQ0FBSixJQUFTRixJQUFJakksQ0FBSixDQUFUO0FBQ0FpSSxNQUFJakksQ0FBSixJQUFTdUcsQ0FBVDtBQUNBO0FBQ0QsUUFBTzBCLEdBQVA7QUFDQSIsImZpbGUiOiJtYWluX20uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdCQoJy5jb25zb2xlIC5lcnJvcicpLnRleHQoYCR7SlNPTi5zdHJpbmdpZnkobGFzdF9jb21tYW5kKX0g55m855Sf6Yyv6Kqk77yM6KuL5oiq5ZyW6YCa55+l566h55CG5ZOhYCk7XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHRcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0JChcIiNidG5fbG9naW5cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ2xvZ2luJyk7XHJcblx0fSk7XHJcblx0JCgnI3NlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0bGV0IGlkID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdGxldCBuYW1lID0gJCh0aGlzKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnRleHQoKTtcclxuXHRcdGxldCB0eXBlID0gJCh0aGlzKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLmF0dHIoJ2RhdGEtdHlwZScpO1xyXG5cdFx0bGV0IHBhZ2UgPSB7aWQsbmFtZSx0eXBlfTtcclxuXHRcdGlmIChwYWdlLmlkICE9PSAnMCcpe1xyXG5cdFx0XHRzdGVwLnN0ZXAyKHBhZ2UpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9saWtlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdyZWFjdGlvbnMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fcGF5XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHRcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHRjb25maWcuZmlsdGVyLmlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5vcHRpb25GaWx0ZXIgaW5wdXQnKS5kYXRlRHJvcHBlcigpO1xyXG5cdCQoJy5waWNrLXN1Ym1pdCcpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuXHRcdC8vIGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9ICQoJy5vcHRpb25GaWx0ZXIgaW5wdXQnKS52YWwoKStcIi0yMy01OS01OVwiO1xyXG5cdFx0Ly8gdGFibGUucmVkbygpO1xyXG5cdH0pXHJcblxyXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcbn0pO1xyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UsZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuOCcsXHJcblx0XHRyZWFjdGlvbnM6ICd2Mi44JyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjIuMycsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi44JyxcclxuXHRcdGZlZWQ6ICd2Mi4zJyxcclxuXHRcdGdyb3VwOiAndjIuOCdcclxuXHR9LFxyXG5cdGZpbHRlcjoge1xyXG5cdFx0aXNEdXBsaWNhdGU6IHRydWUsXHJcblx0XHRpc1RhZzogZmFsc2UsXHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0YXV0aDogJ3VzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9tYW5hZ2VkX2dyb3VwcyxtYW5hZ2VfcGFnZXMnXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHR1c2VyX3Bvc3RzOiBmYWxzZSxcclxuXHRnZXRBdXRoOiAodHlwZSk9PntcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGlmICh0eXBlID09IFwibG9naW5cIil7XHJcblx0XHRcdFx0aWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzLmluZGV4T2YoJ3JlYWRfc3RyZWFtJykgPj0gMCl7XHJcblx0XHRcdFx0XHRzdGVwLnN0ZXAxKCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRhbGVydCgn5rKS5pyJ5qyK6ZmQ5oiW5o6I5qyK5LiN5a6M5oiQJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzdGVwLnN0ZXAzKCk7XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5sZXQgZmFucGFnZSA9IFtdO1xyXG5sZXQgZ3JvdXAgPSBbXTtcclxubGV0IHNob3J0Y3V0ID0gW107XHJcbmxldCBsYXN0X2NvbW1hbmQgPSB7fTtcclxubGV0IHVybCA9IHtcclxuXHRzZW5kOiAodGFyLCBjb21tYW5kKT0+e1xyXG5cdFx0bGV0IGlkID0gJCh0YXIpLnBhcmVudCgpLnNpYmxpbmdzKCdwJykuZmluZCgnaW5wdXQnKS52YWwoKTtcclxuXHRcdHN0ZXAuc3RlcDMoaWQsIGNvbW1hbmQpO1xyXG5cdH1cclxufVxyXG5sZXQgc3RlcCA9IHtcclxuXHRzdGVwMTogKCk9PntcclxuXHRcdCQoJy5sb2dpbicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblx0XHRGQi5hcGkoJ3YyLjgvbWUvYWNjb3VudHMnLCAocmVzKT0+e1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdGZhbnBhZ2UucHVzaChpKTtcclxuXHRcdFx0XHQkKFwiI3NlbGVjdFwiKS5wcmVwZW5kKGA8b3B0aW9uIGRhdGEtdHlwZT1cInBvc3RzXCIgdmFsdWU9XCIke2kuaWR9XCI+JHtpLm5hbWV9PC9vcHRpb24+YCk7XHJcblx0XHRcdFx0RkIuYXBpKGB2Mi44LyR7aS5pZH0vcG9zdHNgLCAocmVzMik9PntcclxuXHRcdFx0XHRcdGZvcihsZXQgaiBvZiByZXMyLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZihqLm1lc3NhZ2UgJiYgai5tZXNzYWdlLmluZGV4T2YoJ+aKveeNjicpID49MCl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IG1lc3MgPSBqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIik7XHJcblx0XHRcdFx0XHRcdFx0JCgnLnN0ZXAxIC5jYXJkcycpLmFwcGVuZChgXHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZFwiIGRhdGEtZmJpZD1cIiR7ai5pZH1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidGl0bGVcIj4ke2kubmFtZX08L3A+XHJcblx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIiBvbmNsaWNrPVwiY2FyZC5zaG93KHRoaXMpXCI+JHttZXNzfTwvcD5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyZWFjdGlvbnNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdyZWFjdGlvbnMnKVwiPuiumjwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbW1lbnRzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnY29tbWVudHMnKVwiPueVmeiogDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNoYXJlZHBvc3RzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnc2hhcmVkcG9zdHMnKVwiPuWIhuS6qzwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdGApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0RkIuYXBpKCd2Mi44L21lL2dyb3VwcycsIChyZXMpPT57XHJcblx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0Z3JvdXAucHVzaChpKTtcclxuXHRcdFx0XHQkKFwiI3NlbGVjdFwiKS5wcmVwZW5kKGA8b3B0aW9uIGRhdGEtdHlwZT1cImZlZWRcIiB2YWx1ZT1cIiR7aS5pZH1cIj4ke2kubmFtZX08L29wdGlvbj5gKTtcclxuXHRcdFx0XHRGQi5hcGkoYHYyLjgvJHtpLmlkfS9mZWVkP2ZpZWxkcz1mcm9tLG1lc3NhZ2UsaWRgLCAocmVzMik9PntcclxuXHRcdFx0XHRcdGZvcihsZXQgaiBvZiByZXMyLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZihqLm1lc3NhZ2UgJiYgai5tZXNzYWdlLmluZGV4T2YoJ+aKveeNjicpID49MCAmJiBqLmZyb20uaWQpe1xyXG5cdFx0XHRcdFx0XHRcdGxldCBtZXNzID0gai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpO1xyXG5cdFx0XHRcdFx0XHRcdCQoJy5zdGVwMSAuY2FyZHMnKS5hcHBlbmQoYFxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRcIiBkYXRhLWZiaWQ9XCIke2ouaWR9XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInRpdGxlXCI+JHtpLm5hbWV9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+JHttZXNzfTwvcD5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyZWFjdGlvbnNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdyZWFjdGlvbnMnKVwiPuiumjwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbW1lbnRzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnY29tbWVudHMnKVwiPueVmeiogDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNoYXJlZHBvc3RzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnc2hhcmVkcG9zdHMnKVwiPuWIhuS6qzwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdGApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0RkIuYXBpKCd2Mi44L21lJywgKHJlcyk9PntcclxuXHRcdFx0JChcIiNzZWxlY3RcIikucHJlcGVuZChgPG9wdGlvbiBkYXRhLXR5cGU9XCJwb3N0c1wiIHZhbHVlPVwiJHtyZXMuaWR9XCI+JHtyZXMubmFtZX08L29wdGlvbj5gKTtcclxuXHRcdFx0RkIuYXBpKGB2Mi44L21lL3Bvc3RzYCwgKHJlczIpPT57XHJcblx0XHRcdFx0Zm9yKGxldCBqIG9mIHJlczIuZGF0YSl7XHJcblx0XHRcdFx0XHRpZihqLm1lc3NhZ2UgJiYgai5tZXNzYWdlLmluZGV4T2YoJ+aKveeNjicpID49MCl7XHJcblx0XHRcdFx0XHRcdGxldCBtZXNzID0gai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpO1xyXG5cdFx0XHRcdFx0XHQkKCcuc3RlcDEgLmNhcmRzJykuYXBwZW5kKGBcclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZFwiIGRhdGEtZmJpZD1cIiR7ai5pZH1cIj5cclxuXHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInRpdGxlXCI+JHtyZXMubmFtZX08L3A+XHJcblx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCIgb25jbGljaz1cImNhcmQuc2hvdyh0aGlzKVwiPiR7bWVzc308L3A+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImFjdGlvblwiPlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyZWFjdGlvbnNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdyZWFjdGlvbnMnKVwiPuiumjwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb21tZW50c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ2NvbW1lbnRzJylcIj7nlZnoqIA8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2hhcmVkcG9zdHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdzaGFyZWRwb3N0cycpXCI+5YiG5LqrPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0YCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0c3RlcDI6IChwYWdlKT0+e1xyXG5cdFx0JCgnLnN0ZXAyJykuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdCQoJy5zdGVwMiAuY2FyZHMnKS5odG1sKFwiXCIpO1xyXG5cdFx0JCgnLnN0ZXAyIC5oZWFkIHNwYW4nKS50ZXh0KHBhZ2UubmFtZSk7XHJcblx0XHRsZXQgY29tbWFuZCA9IHBhZ2UudHlwZTtcclxuXHRcdEZCLmFwaShgdjIuOC8ke3BhZ2UuaWR9LyR7Y29tbWFuZH1gLCAocmVzKT0+e1xyXG5cdFx0XHRmb3IobGV0IGogb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdGxldCBtZXNzID0gai5tZXNzYWdlID8gai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpIDogXCJcIjtcclxuXHRcdFx0XHQkKCcuc3RlcDIgLmNhcmRzJykuYXBwZW5kKGBcclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkXCIgZGF0YS1mYmlkPVwiJHtqLmlkfVwiPlxyXG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCIgb25jbGljaz1cImNhcmQuc2hvdyh0aGlzKVwiPiR7bWVzc308L3A+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVhY3Rpb25zXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAncmVhY3Rpb25zJylcIj7orpo8L2Rpdj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb21tZW50c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ2NvbW1lbnRzJylcIj7nlZnoqIA8L2Rpdj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzaGFyZWRwb3N0c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3NoYXJlZHBvc3RzJylcIj7liIbkuqs8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzdGVwMnRvMTogKCk9PntcclxuXHRcdCQoJyNzZWxlY3QnKS52YWwoMCk7XHJcblx0XHQkKCcuc3RlcDInKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xyXG5cdH0sXHJcblx0c3RlcDNoaWRlOiAoKT0+e1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JCgnLnN0ZXAzJykucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHR9LFxyXG5cdHN0ZXAzOiAoZmJpZCwgY29tbWFuZCk9PntcclxuXHRcdGxhc3RfY29tbWFuZCA9IHtmYmlkLGNvbW1hbmR9O1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gbm93RGF0ZSgpO1xyXG5cdFx0JCgnLnN0ZXAzJykuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdCQoJy5sb2FkaW5nLndhaXRpbmcnKS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHRcdGRhdGEuZmlsdGVyZWQgPSBbXTtcclxuXHRcdGRhdGEuY29tbWFuZCA9IGNvbW1hbmQ7XHJcblx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdCQoJy5vcHRpb25GaWx0ZXIgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLm9wdGlvbkZpbHRlciAudGltZWxpbWl0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkfS8ke2NvbW1hbmR9YCwgKHJlcyk9PntcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzKTtcclxuXHRcdFx0ZGF0YS5sZW5ndGggPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0aWYgKGQuaWQpe1xyXG5cdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0ZGF0YS5yYXcucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZpbHRlci50b3RhbEZpbHRlcihkYXRhLnJhdywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwpe1xyXG5cdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdGRhdGEubGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLmxlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0aWYgKGQuaWQpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGEucmF3LnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGZpbHRlci50b3RhbEZpbHRlcihkYXRhLnJhdywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2FyZCA9IHtcclxuXHRzaG93OiAoZSk9PntcclxuXHRcdGlmICgkKGUpLmhhc0NsYXNzKCd2aXNpYmxlJykpe1xyXG5cdFx0XHQkKGUpLnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JChlKS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiBbXSxcclxuXHRmaWx0ZXJlZDogW10sXHJcblx0Y29tbWFuZDogJycsXHJcblx0bGVuZ3RoOiAwXHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKCk9PntcclxuXHRcdCQoJy5sb2FkaW5nLndhaXRpbmcnKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJkYXRhID0gZGF0YS5maWx0ZXJlZDtcclxuXHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRpZihkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+6KGo5oOFPC90ZD5gO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGhvc3QgPSAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJztcclxuXHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmRhdGEuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7aisxfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5gO1xyXG5cdFx0XHRpZihkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblxyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMzAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGZpbHRlci50b3RhbEZpbHRlcihkYXRhLnJhdywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjaG9vc2UgPSB7XHJcblx0ZGF0YTogW10sXHJcblx0YXdhcmQ6IFtdLFxyXG5cdG51bTogMCxcclxuXHRkZXRhaWw6IGZhbHNlLFxyXG5cdGxpc3Q6IFtdLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCl7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbygpO1xyXG5cdH0sXHJcblx0Z286ICgpPT57XHJcblx0XHRsZXQgbnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoZGF0YS5maWx0ZXJlZC5sZW5ndGgpLnNwbGljZSgwLG51bSk7XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHI+JyArICQoJy5tYWluX3RhYmxlJykuRGF0YVRhYmxlKCkucm93cyh7c2VhcmNoOidhcHBsaWVkJ30pLm5vZGVzKClbaV0uaW5uZXJIVE1MICsgJzwvdHI+JztcclxuXHRcdH1cclxuXHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZiaWQgPSB7XHJcblx0ZmJpZDogW10sXHJcblx0aW5pdDogKHR5cGUpPT57XHJcblx0XHRmYmlkLmZiaWQgPSBbXTtcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0RkIuYXBpKFwiL21lXCIsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0ZGF0YS51c2VyaWQgPSByZXMuaWQ7XHJcblx0XHRcdGxldCB1cmwgPSBmYmlkLmZvcm1hdCgkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdFx0ZmJpZC5nZXQodXJsLCB0eXBlKS50aGVuKChmYmlkKT0+e1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdCQoJy5pZGVudGl0eScpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChg55m75YWl6Lqr5Lu977yaPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cmVzLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48c3Bhbj4ke3Jlcy5uYW1lfTwvc3Bhbj5gKVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6ICh1cmwsIHR5cGUpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0aWYgKHR5cGUgPT0gJ3VybF9jb21tZW50cycpe1xyXG5cdFx0XHRcdGxldCBwb3N0dXJsID0gdXJsO1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCI/XCIpID4gMCl7XHJcblx0XHRcdFx0XHRwb3N0dXJsID0gcG9zdHVybC5zdWJzdHJpbmcoMCxwb3N0dXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0RkIuYXBpKGAvJHtwb3N0dXJsfWAsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGxldCBvYmogPSB7ZnVsbElEOiByZXMub2dfb2JqZWN0LmlkLCB0eXBlOiB0eXBlLCBjb21tYW5kOiAnY29tbWVudHMnfTtcclxuXHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gdXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XHJcblx0XHRcdFx0ZmJpZC5jaGVja1BhZ2VJRCh1cmwsIHVybHR5cGUpLnRoZW4oKGlkKT0+e1xyXG5cdFx0XHRcdFx0aWYgKGlkID09PSAncGVyc29uYWwnKXtcclxuXHRcdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XHJcblx0XHRcdFx0XHRcdGlkID0gZGF0YS51c2VyaWQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge3BhZ2VJRDogaWQsIHR5cGU6IHVybHR5cGUsIGNvbW1hbmQ6IHR5cGV9O1xyXG5cdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdwZXJzb25hbCcpe1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcclxuXHRcdFx0XHRcdFx0aWYoc3RhcnQgPj0gMCl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGVuZCA9IHVybC5pbmRleE9mKFwiJlwiLHN0YXJ0KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs1LGVuZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdwb3N0cy8nKTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs2LHVybC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdwdXJlJyl7XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCcnKTtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZXZlbnQnKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxKXtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3miYDmnInnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5jb21tYW5kID0gJ2ZlZWQnO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcdFxyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reafkOevh+eVmeiogOeahOeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1lbHNlIGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZmIudXNlcl9wb3N0cyl7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyBcIl9cIiArb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aXRsZTogJ+ekvuWcmOS9v+eUqOmcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWcmCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxIHx8IHJlc3VsdC5sZW5ndGggPT0gMyl7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICd1bm5hbWUnKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjaGVja1R5cGU6IChwb3N0dXJsKT0+e1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImZiaWQ9XCIpID49IDApe1xyXG5cdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdwZXJtYWxpbmsnKSA+PSAwKXtcclxuXHRcdFx0XHRyZXR1cm4gJ3VubmFtZSc7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHJldHVybiAncGVyc29uYWwnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9ncm91cHMvXCIpID49IDApe1xyXG5cdFx0XHRyZXR1cm4gJ2dyb3VwJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpID49IDApe1xyXG5cdFx0XHRyZXR1cm4gJ2V2ZW50JztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApe1xyXG5cdFx0XHRyZXR1cm4gJ3B1cmUnO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiAnbm9ybWFsJztcclxuXHR9LFxyXG5cdGNoZWNrUGFnZUlEOiAocG9zdHVybCwgdHlwZSk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgc3RhcnQgPSBwb3N0dXJsLmluZGV4T2YoXCJmYWNlYm9vay5jb21cIikrMTM7XHJcblx0XHRcdGxldCBlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsc3RhcnQpO1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRpZiAoZW5kIDwgMCl7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignZmJpZD0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAndW5uYW1lJyl7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3VubmFtZScpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGxldCBncm91cCA9IHBvc3R1cmwuaW5kZXhPZignL2dyb3Vwcy8nKTtcclxuXHRcdFx0XHRsZXQgZXZlbnQgPSBwb3N0dXJsLmluZGV4T2YoJy9ldmVudHMvJylcclxuXHRcdFx0XHRpZiAoZ3JvdXAgPj0gMCl7XHJcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwKzg7XHJcblx0XHRcdFx0XHRlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsc3RhcnQpO1xyXG5cdFx0XHRcdFx0bGV0IHJlZ2V4MiA9IC9cXGR7Nix9L2c7XHJcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LGVuZCk7XHJcblx0XHRcdFx0XHRpZiAocmVnZXgyLnRlc3QodGVtcCkpe1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRlbXApO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ2dyb3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2UgaWYoZXZlbnQgPj0gMCl7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCdldmVudCcpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcclxuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZW5hbWV9YCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmb3JtYXQ6ICh1cmwpPT57XHJcblx0XHRpZiAodXJsLmluZGV4T2YoJ2J1c2luZXNzLmZhY2Vib29rLmNvbS8nKSA+PSAwKXtcclxuXHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3ZGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9PntcclxuXHRcdGxldCBkID0gcmF3ZGF0YTtcclxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRcdGQgPSBmaWx0ZXIudW5pcXVlKGQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHdvcmQgIT09ICcnKXtcclxuXHRcdFx0ZCA9IGZpbHRlci53b3JkKGQsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnKXtcclxuXHRcdFx0ZCA9IGZpbHRlci50YWcoZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoZGF0YS5jb21tYW5kICE9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdGQgPSBmaWx0ZXIudGltZShkLCBlbmRUaW1lKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkID0gZmlsdGVyLnJlYWN0KGQsIHJlYWN0KTtcclxuXHRcdH1cclxuXHRcdGRhdGEuZmlsdGVyZWQgPSBkO1xyXG5cdFx0dGFibGUuZ2VuZXJhdGUoKTtcclxuXHR9LFxyXG5cdHVuaXF1ZTogKGRhdGEpPT57XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCB0KT0+e1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XHJcblx0XHRpZiAodGFyID09ICdhbGwnKXtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCk9PntcclxuXHJcblx0fSxcclxuXHRyZXNldDogKCk9PntcclxuXHRcdGxldCBjb21tYW5kID0gZGF0YS5yYXcuY29tbWFuZDtcclxuXHRcdGlmIChjb21tYW5kID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKXtcclxuXHRcdFx0XHQkKFwiI3RhZ1wiKS5jbGljaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCl7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSsxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XHJcblx0IHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xyXG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG4gICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICAgaWYgKGRhdGUgPCAxMCl7XHJcbiAgICAgXHRkYXRlID0gXCIwXCIrZGF0ZTtcclxuICAgICB9XHJcbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcbiAgICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG4gICAgIGlmIChtaW4gPCAxMCl7XHJcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XHJcbiAgICAgfVxyXG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuICAgICBpZiAoc2VjIDwgMTApe1xyXG4gICAgIFx0c2VjID0gXCIwXCIrc2VjO1xyXG4gICAgIH1cclxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcclxuICAgICByZXR1cm4gdGltZTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuIl19
