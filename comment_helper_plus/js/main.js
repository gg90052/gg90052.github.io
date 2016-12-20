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
	auth: 'read_stream,user_photos,user_posts,user_groups,user_managed_groups'
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
		$("#awardList").hide();
		$('.step2, .step3').removeClass('visible');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCIkIiwidGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiLCJsYXN0X2NvbW1hbmQiLCJjb25zb2xlIiwibG9nIiwidmFsIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImNsaWNrIiwiZmIiLCJnZXRBdXRoIiwiY2hhbmdlIiwiaWQiLCJuYW1lIiwiZmluZCIsInR5cGUiLCJhdHRyIiwicGFnZSIsInN0ZXAiLCJzdGVwMiIsImUiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwib24iLCJjb25maWciLCJmaWx0ZXIiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJ0YWJsZSIsInJlZG8iLCJkYXRlRHJvcHBlciIsInJlYWN0IiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwiaXNUYWciLCJ3b3JkIiwiZW5kVGltZSIsIm5vd0RhdGUiLCJhdXRoIiwidXNlcl9wb3N0cyIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGVwMSIsImFsZXJ0Iiwic3RlcDMiLCJmYW5wYWdlIiwic2hvcnRjdXQiLCJzZW5kIiwidGFyIiwiY29tbWFuZCIsInBhcmVudCIsInNpYmxpbmdzIiwiYXBpIiwicmVzIiwiaSIsInB1c2giLCJwcmVwZW5kIiwicmVzMiIsImRhdGEiLCJqIiwibWVzc2FnZSIsIm1lc3MiLCJyZXBsYWNlIiwiZnJvbSIsImh0bWwiLCJzdGVwMnRvMSIsImhpZGUiLCJmYmlkIiwicmF3IiwiZmlsdGVyZWQiLCJsZW5ndGgiLCJkIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImdldEpTT04iLCJmYWlsIiwiY2FyZCIsInNob3ciLCJnZW5lcmF0ZSIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsImhvc3QiLCJlbnRyaWVzIiwidGQiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwiZWFjaCIsIm4iLCJwYXJzZUludCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwidXNlcmlkIiwiZm9ybWF0IiwiZ2V0IiwidGhlbiIsInN0YXJ0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwb3N0dXJsIiwic3Vic3RyaW5nIiwib2JqIiwiZnVsbElEIiwib2dfb2JqZWN0IiwicmVnZXgiLCJyZXN1bHQiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsImVuZCIsInB1cmVJRCIsInN3YWwiLCJ0aXRsZSIsImRvbmUiLCJldmVudCIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJlcnJvciIsInJhd2RhdGEiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsInNwbGl0IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwidWkiLCJyZXNldCIsImEiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJtYXAiLCJpbmRleCIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0NDLEdBQUUsaUJBQUYsRUFBcUJDLElBQXJCLENBQTZCQyxLQUFLQyxTQUFMLENBQWVDLFlBQWYsQ0FBN0I7QUFDQSxLQUFJLENBQUNYLFlBQUwsRUFBa0I7QUFDakJZLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQk4sRUFBRSxnQkFBRixFQUFvQk8sR0FBcEIsRUFBbEM7QUFDQVAsSUFBRSxpQkFBRixFQUFxQlEsTUFBckI7QUFDQWYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRE8sRUFBRVMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0JWLEdBQUUsWUFBRixFQUFnQlcsS0FBaEIsQ0FBc0IsWUFBVTtBQUMvQkMsS0FBR0MsT0FBSCxDQUFXLE9BQVg7QUFDQSxFQUZEO0FBR0FiLEdBQUUsU0FBRixFQUFhYyxNQUFiLENBQW9CLFlBQVU7QUFDN0IsTUFBSUMsS0FBS2YsRUFBRSxJQUFGLEVBQVFPLEdBQVIsRUFBVDtBQUNBLE1BQUlTLE9BQU9oQixFQUFFLElBQUYsRUFBUWlCLElBQVIsQ0FBYSxpQkFBYixFQUFnQ2hCLElBQWhDLEVBQVg7QUFDQSxNQUFJaUIsT0FBT2xCLEVBQUUsSUFBRixFQUFRaUIsSUFBUixDQUFhLGlCQUFiLEVBQWdDRSxJQUFoQyxDQUFxQyxXQUFyQyxDQUFYO0FBQ0EsTUFBSUMsT0FB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a0QsQ0FBakIsRUFBcUIsRUFBRWxELENBQXZCLEVBQTBCO0FBQ3pCa0ksTUFBSUMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCbkYsQ0FBM0IsQ0FBSjtBQUNBb0QsTUFBSTBCLElBQUlFLENBQUosQ0FBSjtBQUNBRixNQUFJRSxDQUFKLElBQVNGLElBQUloSSxDQUFKLENBQVQ7QUFDQWdJLE1BQUloSSxDQUFKLElBQVNzRyxDQUFUO0FBQ0E7QUFDRCxRQUFPMEIsR0FBUDtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdCQoJy5jb25zb2xlIC5lcnJvcicpLnRleHQoYCR7SlNPTi5zdHJpbmdpZnkobGFzdF9jb21tYW5kKX0g55m855Sf6Yyv6Kqk77yM6KuL5oiq5ZyW6YCa55+l566h55CG5ZOhYCk7XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHRcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0JChcIiNidG5fbG9naW5cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ2xvZ2luJyk7XHJcblx0fSk7XHJcblx0JCgnI3NlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0bGV0IGlkID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdGxldCBuYW1lID0gJCh0aGlzKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnRleHQoKTtcclxuXHRcdGxldCB0eXBlID0gJCh0aGlzKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLmF0dHIoJ2RhdGEtdHlwZScpO1xyXG5cdFx0bGV0IHBhZ2UgPSB7aWQsbmFtZSx0eXBlfTtcclxuXHRcdGlmIChwYWdlLmlkICE9PSAnMCcpe1xyXG5cdFx0XHRzdGVwLnN0ZXAyKHBhZ2UpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9saWtlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdyZWFjdGlvbnMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fcGF5XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHRcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHRjb25maWcuZmlsdGVyLmlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5vcHRpb25GaWx0ZXIgaW5wdXQnKS5kYXRlRHJvcHBlcigpO1xyXG5cdCQoJy5waWNrLXN1Ym1pdCcpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuXHRcdC8vIGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9ICQoJy5vcHRpb25GaWx0ZXIgaW5wdXQnKS52YWwoKStcIi0yMy01OS01OVwiO1xyXG5cdFx0Ly8gdGFibGUucmVkbygpO1xyXG5cdH0pXHJcblxyXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcbn0pO1xyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UsZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuOCcsXHJcblx0XHRyZWFjdGlvbnM6ICd2Mi44JyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjIuMycsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi44JyxcclxuXHRcdGZlZWQ6ICd2Mi4zJyxcclxuXHRcdGdyb3VwOiAndjIuOCdcclxuXHR9LFxyXG5cdGZpbHRlcjoge1xyXG5cdFx0aXNEdXBsaWNhdGU6IHRydWUsXHJcblx0XHRpc1RhZzogZmFsc2UsXHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0YXV0aDogJ3JlYWRfc3RyZWFtLHVzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9ncm91cHMsdXNlcl9tYW5hZ2VkX2dyb3VwcydcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdHVzZXJfcG9zdHM6IGZhbHNlLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJsb2dpblwiKXtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZigncmVhZF9zdHJlYW0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdHN0ZXAuc3RlcDEoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGFsZXJ0KCfmspLmnInmrIrpmZDmiJbmjojmrIrkuI3lrozmiJAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHN0ZXAuc3RlcDMoKTtcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbmxldCBmYW5wYWdlID0gW107XHJcbmxldCBncm91cCA9IFtdO1xyXG5sZXQgc2hvcnRjdXQgPSBbXTtcclxubGV0IGxhc3RfY29tbWFuZCA9IHt9O1xyXG5sZXQgdXJsID0ge1xyXG5cdHNlbmQ6ICh0YXIsIGNvbW1hbmQpPT57XHJcblx0XHRsZXQgaWQgPSAkKHRhcikucGFyZW50KCkuc2libGluZ3MoJ3AnKS5maW5kKCdpbnB1dCcpLnZhbCgpO1xyXG5cdFx0c3RlcC5zdGVwMyhpZCwgY29tbWFuZCk7XHJcblx0fVxyXG59XHJcbmxldCBzdGVwID0ge1xyXG5cdHN0ZXAxOiAoKT0+e1xyXG5cdFx0JCgnLmxvZ2luJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHRcdEZCLmFwaSgndjIuOC9tZS9hY2NvdW50cycsIChyZXMpPT57XHJcblx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0ZmFucGFnZS5wdXNoKGkpO1xyXG5cdFx0XHRcdCQoXCIjc2VsZWN0XCIpLnByZXBlbmQoYDxvcHRpb24gZGF0YS10eXBlPVwicG9zdHNcIiB2YWx1ZT1cIiR7aS5pZH1cIj4ke2kubmFtZX08L29wdGlvbj5gKTtcclxuXHRcdFx0XHRGQi5hcGkoYHYyLjgvJHtpLmlkfS9wb3N0c2AsIChyZXMyKT0+e1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBqIG9mIHJlczIuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmKGoubWVzc2FnZSAmJiBqLm1lc3NhZ2UuaW5kZXhPZign5oq9542OJykgPj0wKXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgbWVzcyA9IGoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKTtcclxuXHRcdFx0XHRcdFx0XHQkKCcuc3RlcDEgLmNhcmRzJykuYXBwZW5kKGBcclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkXCIgZGF0YS1mYmlkPVwiJHtqLmlkfVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0aXRsZVwiPiR7aS5uYW1lfTwvcD5cclxuXHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiIG9uY2xpY2s9XCJjYXJkLnNob3codGhpcylcIj4ke21lc3N9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImFjdGlvblwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlYWN0aW9uc1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3JlYWN0aW9ucycpXCI+6K6aPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29tbWVudHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdjb21tZW50cycpXCI+55WZ6KiAPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2hhcmVkcG9zdHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdzaGFyZWRwb3N0cycpXCI+5YiG5LqrPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0YCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRGQi5hcGkoJ3YyLjgvbWUvZ3JvdXBzJywgKHJlcyk9PntcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRncm91cC5wdXNoKGkpO1xyXG5cdFx0XHRcdCQoXCIjc2VsZWN0XCIpLnByZXBlbmQoYDxvcHRpb24gZGF0YS10eXBlPVwiZmVlZFwiIHZhbHVlPVwiJHtpLmlkfVwiPiR7aS5uYW1lfTwvb3B0aW9uPmApO1xyXG5cdFx0XHRcdEZCLmFwaShgdjIuOC8ke2kuaWR9L2ZlZWQ/ZmllbGRzPWZyb20sbWVzc2FnZSxpZGAsIChyZXMyKT0+e1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBqIG9mIHJlczIuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmKGoubWVzc2FnZSAmJiBqLm1lc3NhZ2UuaW5kZXhPZign5oq9542OJykgPj0wICYmIGouZnJvbS5pZCl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IG1lc3MgPSBqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIik7XHJcblx0XHRcdFx0XHRcdFx0JCgnLnN0ZXAxIC5jYXJkcycpLmFwcGVuZChgXHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZFwiIGRhdGEtZmJpZD1cIiR7ai5pZH1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidGl0bGVcIj4ke2kubmFtZX08L3A+XHJcblx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIj4ke21lc3N9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImFjdGlvblwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlYWN0aW9uc1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3JlYWN0aW9ucycpXCI+6K6aPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29tbWVudHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdjb21tZW50cycpXCI+55WZ6KiAPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2hhcmVkcG9zdHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdzaGFyZWRwb3N0cycpXCI+5YiG5LqrPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0YCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRGQi5hcGkoJ3YyLjgvbWUnLCAocmVzKT0+e1xyXG5cdFx0XHQkKFwiI3NlbGVjdFwiKS5wcmVwZW5kKGA8b3B0aW9uIGRhdGEtdHlwZT1cInBvc3RzXCIgdmFsdWU9XCIke3Jlcy5pZH1cIj4ke3Jlcy5uYW1lfTwvb3B0aW9uPmApO1xyXG5cdFx0XHRGQi5hcGkoYHYyLjgvbWUvcG9zdHNgLCAocmVzMik9PntcclxuXHRcdFx0XHRmb3IobGV0IGogb2YgcmVzMi5kYXRhKXtcclxuXHRcdFx0XHRcdGlmKGoubWVzc2FnZSAmJiBqLm1lc3NhZ2UuaW5kZXhPZign5oq9542OJykgPj0wKXtcclxuXHRcdFx0XHRcdFx0bGV0IG1lc3MgPSBqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIik7XHJcblx0XHRcdFx0XHRcdCQoJy5zdGVwMSAuY2FyZHMnKS5hcHBlbmQoYFxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkXCIgZGF0YS1mYmlkPVwiJHtqLmlkfVwiPlxyXG5cdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidGl0bGVcIj4ke3Jlcy5uYW1lfTwvcD5cclxuXHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIiBvbmNsaWNrPVwiY2FyZC5zaG93KHRoaXMpXCI+JHttZXNzfTwvcD5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlYWN0aW9uc1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3JlYWN0aW9ucycpXCI+6K6aPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbW1lbnRzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnY29tbWVudHMnKVwiPueVmeiogDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzaGFyZWRwb3N0c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3NoYXJlZHBvc3RzJylcIj7liIbkuqs8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzdGVwMjogKHBhZ2UpPT57XHJcblx0XHQkKCcuc3RlcDInKS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0JCgnLnN0ZXAyIC5jYXJkcycpLmh0bWwoXCJcIik7XHJcblx0XHQkKCcuc3RlcDIgLmhlYWQgc3BhbicpLnRleHQocGFnZS5uYW1lKTtcclxuXHRcdGxldCBjb21tYW5kID0gcGFnZS50eXBlO1xyXG5cdFx0RkIuYXBpKGB2Mi44LyR7cGFnZS5pZH0vJHtjb21tYW5kfWAsIChyZXMpPT57XHJcblx0XHRcdGZvcihsZXQgaiBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0bGV0IG1lc3MgPSBqLm1lc3NhZ2UgPyBqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRcdCQoJy5zdGVwMiAuY2FyZHMnKS5hcHBlbmQoYFxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRcIiBkYXRhLWZiaWQ9XCIke2ouaWR9XCI+XHJcblx0XHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIiBvbmNsaWNrPVwiY2FyZC5zaG93KHRoaXMpXCI+JHttZXNzfTwvcD5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyZWFjdGlvbnNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdyZWFjdGlvbnMnKVwiPuiumjwvZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbW1lbnRzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnY29tbWVudHMnKVwiPueVmeiogDwvZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNoYXJlZHBvc3RzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnc2hhcmVkcG9zdHMnKVwiPuWIhuS6qzwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdGApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHN0ZXAydG8xOiAoKT0+e1xyXG5cdFx0JCgnI3NlbGVjdCcpLnZhbCgwKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoJy5zdGVwMiwgLnN0ZXAzJykucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHR9LFxyXG5cdHN0ZXAzOiAoZmJpZCwgY29tbWFuZCk9PntcclxuXHRcdGxhc3RfY29tbWFuZCA9IHtmYmlkLGNvbW1hbmR9O1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gbm93RGF0ZSgpO1xyXG5cdFx0JCgnLnN0ZXAzJykuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdCQoJy5sb2FkaW5nLndhaXRpbmcnKS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHRcdGRhdGEuZmlsdGVyZWQgPSBbXTtcclxuXHRcdGRhdGEuY29tbWFuZCA9IGNvbW1hbmQ7XHJcblx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdCQoJy5vcHRpb25GaWx0ZXIgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLm9wdGlvbkZpbHRlciAudGltZWxpbWl0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkfS8ke2NvbW1hbmR9YCwgKHJlcyk9PntcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzKTtcclxuXHRcdFx0ZGF0YS5sZW5ndGggPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0aWYgKGQuaWQpe1xyXG5cdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0ZGF0YS5yYXcucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZpbHRlci50b3RhbEZpbHRlcihkYXRhLnJhdywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwpe1xyXG5cdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdGRhdGEubGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLmxlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0aWYgKGQuaWQpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGEucmF3LnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGZpbHRlci50b3RhbEZpbHRlcihkYXRhLnJhdywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2FyZCA9IHtcclxuXHRzaG93OiAoZSk9PntcclxuXHRcdGlmICgkKGUpLmhhc0NsYXNzKCd2aXNpYmxlJykpe1xyXG5cdFx0XHQkKGUpLnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JChlKS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiBbXSxcclxuXHRmaWx0ZXJlZDogW10sXHJcblx0Y29tbWFuZDogJycsXHJcblx0bGVuZ3RoOiAwXHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKCk9PntcclxuXHRcdCQoJy5sb2FkaW5nLndhaXRpbmcnKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJkYXRhID0gZGF0YS5maWx0ZXJlZDtcclxuXHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRpZihkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+6KGo5oOFPC90ZD5gO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGhvc3QgPSAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJztcclxuXHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGZpbHRlcmRhdGEuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7aisxfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5gO1xyXG5cdFx0XHRpZihkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblxyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMzAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGZpbHRlci50b3RhbEZpbHRlcihkYXRhLnJhdywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjaG9vc2UgPSB7XHJcblx0ZGF0YTogW10sXHJcblx0YXdhcmQ6IFtdLFxyXG5cdG51bTogMCxcclxuXHRkZXRhaWw6IGZhbHNlLFxyXG5cdGxpc3Q6IFtdLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCl7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbygpO1xyXG5cdH0sXHJcblx0Z286ICgpPT57XHJcblx0XHRsZXQgbnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoZGF0YS5maWx0ZXJlZC5sZW5ndGgpLnNwbGljZSgwLG51bSk7XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHI+JyArICQoJy5tYWluX3RhYmxlJykuRGF0YVRhYmxlKCkucm93cyh7c2VhcmNoOidhcHBsaWVkJ30pLm5vZGVzKClbaV0uaW5uZXJIVE1MICsgJzwvdHI+JztcclxuXHRcdH1cclxuXHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZiaWQgPSB7XHJcblx0ZmJpZDogW10sXHJcblx0aW5pdDogKHR5cGUpPT57XHJcblx0XHRmYmlkLmZiaWQgPSBbXTtcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0RkIuYXBpKFwiL21lXCIsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0ZGF0YS51c2VyaWQgPSByZXMuaWQ7XHJcblx0XHRcdGxldCB1cmwgPSBmYmlkLmZvcm1hdCgkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdFx0ZmJpZC5nZXQodXJsLCB0eXBlKS50aGVuKChmYmlkKT0+e1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdCQoJy5pZGVudGl0eScpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChg55m75YWl6Lqr5Lu977yaPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cmVzLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48c3Bhbj4ke3Jlcy5uYW1lfTwvc3Bhbj5gKVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6ICh1cmwsIHR5cGUpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0aWYgKHR5cGUgPT0gJ3VybF9jb21tZW50cycpe1xyXG5cdFx0XHRcdGxldCBwb3N0dXJsID0gdXJsO1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCI/XCIpID4gMCl7XHJcblx0XHRcdFx0XHRwb3N0dXJsID0gcG9zdHVybC5zdWJzdHJpbmcoMCxwb3N0dXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0RkIuYXBpKGAvJHtwb3N0dXJsfWAsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGxldCBvYmogPSB7ZnVsbElEOiByZXMub2dfb2JqZWN0LmlkLCB0eXBlOiB0eXBlLCBjb21tYW5kOiAnY29tbWVudHMnfTtcclxuXHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gdXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XHJcblx0XHRcdFx0ZmJpZC5jaGVja1BhZ2VJRCh1cmwsIHVybHR5cGUpLnRoZW4oKGlkKT0+e1xyXG5cdFx0XHRcdFx0aWYgKGlkID09PSAncGVyc29uYWwnKXtcclxuXHRcdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XHJcblx0XHRcdFx0XHRcdGlkID0gZGF0YS51c2VyaWQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge3BhZ2VJRDogaWQsIHR5cGU6IHVybHR5cGUsIGNvbW1hbmQ6IHR5cGV9O1xyXG5cdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdwZXJzb25hbCcpe1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcclxuXHRcdFx0XHRcdFx0aWYoc3RhcnQgPj0gMCl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGVuZCA9IHVybC5pbmRleE9mKFwiJlwiLHN0YXJ0KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs1LGVuZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdwb3N0cy8nKTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs2LHVybC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdwdXJlJyl7XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCcnKTtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZXZlbnQnKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxKXtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3miYDmnInnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5jb21tYW5kID0gJ2ZlZWQnO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcdFxyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reafkOevh+eVmeiogOeahOeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1lbHNlIGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZmIudXNlcl9wb3N0cyl7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyBcIl9cIiArb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aXRsZTogJ+ekvuWcmOS9v+eUqOmcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWcmCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxIHx8IHJlc3VsdC5sZW5ndGggPT0gMyl7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICd1bm5hbWUnKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjaGVja1R5cGU6IChwb3N0dXJsKT0+e1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImZiaWQ9XCIpID49IDApe1xyXG5cdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdwZXJtYWxpbmsnKSA+PSAwKXtcclxuXHRcdFx0XHRyZXR1cm4gJ3VubmFtZSc7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHJldHVybiAncGVyc29uYWwnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9ncm91cHMvXCIpID49IDApe1xyXG5cdFx0XHRyZXR1cm4gJ2dyb3VwJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpID49IDApe1xyXG5cdFx0XHRyZXR1cm4gJ2V2ZW50JztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApe1xyXG5cdFx0XHRyZXR1cm4gJ3B1cmUnO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiAnbm9ybWFsJztcclxuXHR9LFxyXG5cdGNoZWNrUGFnZUlEOiAocG9zdHVybCwgdHlwZSk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgc3RhcnQgPSBwb3N0dXJsLmluZGV4T2YoXCJmYWNlYm9vay5jb21cIikrMTM7XHJcblx0XHRcdGxldCBlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsc3RhcnQpO1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRpZiAoZW5kIDwgMCl7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignZmJpZD0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAndW5uYW1lJyl7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3VubmFtZScpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGxldCBncm91cCA9IHBvc3R1cmwuaW5kZXhPZignL2dyb3Vwcy8nKTtcclxuXHRcdFx0XHRsZXQgZXZlbnQgPSBwb3N0dXJsLmluZGV4T2YoJy9ldmVudHMvJylcclxuXHRcdFx0XHRpZiAoZ3JvdXAgPj0gMCl7XHJcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwKzg7XHJcblx0XHRcdFx0XHRlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsc3RhcnQpO1xyXG5cdFx0XHRcdFx0bGV0IHJlZ2V4MiA9IC9cXGR7Nix9L2c7XHJcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LGVuZCk7XHJcblx0XHRcdFx0XHRpZiAocmVnZXgyLnRlc3QodGVtcCkpe1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRlbXApO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoJ2dyb3VwJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2UgaWYoZXZlbnQgPj0gMCl7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCdldmVudCcpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcclxuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZW5hbWV9YCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmb3JtYXQ6ICh1cmwpPT57XHJcblx0XHRpZiAodXJsLmluZGV4T2YoJ2J1c2luZXNzLmZhY2Vib29rLmNvbS8nKSA+PSAwKXtcclxuXHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3ZGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9PntcclxuXHRcdGxldCBkID0gcmF3ZGF0YTtcclxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRcdGQgPSBmaWx0ZXIudW5pcXVlKGQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHdvcmQgIT09ICcnKXtcclxuXHRcdFx0ZCA9IGZpbHRlci53b3JkKGQsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnKXtcclxuXHRcdFx0ZCA9IGZpbHRlci50YWcoZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoZGF0YS5jb21tYW5kICE9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdGQgPSBmaWx0ZXIudGltZShkLCBlbmRUaW1lKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkID0gZmlsdGVyLnJlYWN0KGQsIHJlYWN0KTtcclxuXHRcdH1cclxuXHRcdGRhdGEuZmlsdGVyZWQgPSBkO1xyXG5cdFx0dGFibGUuZ2VuZXJhdGUoKTtcclxuXHR9LFxyXG5cdHVuaXF1ZTogKGRhdGEpPT57XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCB0KT0+e1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XHJcblx0XHRpZiAodGFyID09ICdhbGwnKXtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCk9PntcclxuXHJcblx0fSxcclxuXHRyZXNldDogKCk9PntcclxuXHRcdGxldCBjb21tYW5kID0gZGF0YS5yYXcuY29tbWFuZDtcclxuXHRcdGlmIChjb21tYW5kID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKXtcclxuXHRcdFx0XHQkKFwiI3RhZ1wiKS5jbGljaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCl7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSsxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XHJcblx0IHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xyXG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG4gICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICAgaWYgKGRhdGUgPCAxMCl7XHJcbiAgICAgXHRkYXRlID0gXCIwXCIrZGF0ZTtcclxuICAgICB9XHJcbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcbiAgICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG4gICAgIGlmIChtaW4gPCAxMCl7XHJcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XHJcbiAgICAgfVxyXG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuICAgICBpZiAoc2VjIDwgMTApe1xyXG4gICAgIFx0c2VjID0gXCIwXCIrc2VjO1xyXG4gICAgIH1cclxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcclxuICAgICByZXR1cm4gdGltZTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuIl19
