"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var names = [];
$("form .send").click(function () {
	var text = $("textarea").val();
	var reg = /\n/g;
	var sep = text.split(reg);
	var day = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = sep.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _step$value = _slicedToArray(_step.value, 2);

			var _i = _step$value[0];
			var val = _step$value[1];

			if (val.search(/\d{2}/g) === -1) {
				sep.splice(_i, 1);
			}
			if (val.search(/\d{4}/g) == 0) {
				day.push(_i);
			}
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

	if (day.length === 0 || day[0] !== 0) {
		for (var i in day) {
			day[i]++;
		}
		day.unshift(0);
		var d = new Date();
		var date = d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate() + "(無日期資料，此日期為輸出日期)";
		sep.unshift(date);
	}

	sep_day(sep, day);
});

function sep_day(text, day) {
	var text_array = [];
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = day.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var _step2$value = _slicedToArray(_step2.value, 2);

			var i = _step2$value[0];
			var val = _step2$value[1];

			var obj = {};
			obj.day = text[val];
			obj.text = [];
			var next = day[i + 1] || text.length - 1;
			for (var j = val + 1; j < next; j++) {
				if (text[j].search(/\d{2}/g) == 0) {
					obj.text.push(text_analyze(text[j]));
				}
			}
			text_array.push(obj);
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

	finish(text_array);
}

function text_analyze(text) {
	var first = text.indexOf(" ");
	var second = text.indexOf(" ", first + 1);
	var time = text.substring(0, text.indexOf(" "));
	var name = text.substring(first + 1, text.indexOf(" ", first + 1));
	if (names.indexOf(name) === -1) {
		names.push(name);
	}
	var message = text.substring(second + 1, text.length);
	var obj = { time: time, name: name, message: message };
	return obj;
}

function finish(text) {
	var str = "";
	var user = void 0;
	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = names[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var name = _step3.value;

			str += "<li>" + name + "</li>";
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

	$(".set form").addClass("hide");
	$(".set .names").removeClass("hide");
	$(".set .names ul").append(str);

	$(".set .names li").click(function () {
		user = $(this).index();
		gen_conversation(text, names[user]);
		names.splice(user, 1);
		if (names.length > 1) {
			$(".head").text("對話群組");
		} else {
			$(".head").text(names[0]);
		}
	});
}

function gen_conversation(text, user) {
	$(".set").addClass("hide");
	$(".show").removeClass("hide");

	var _iteratorNormalCompletion4 = true;
	var _didIteratorError4 = false;
	var _iteratorError4 = undefined;

	try {
		for (var _iterator4 = text[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
			var day = _step4.value;

			$(".show .messages").append("<p class='date'>" + day.day + "</p>");
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = day.text[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var mess = _step5.value;

					var str = "";
					if (mess.name === user) {
						str = "<div class=\"mess me\"><p class=\"name\">" + mess.name + "</p><span>" + mess.time + "</span><div class=\"text\">" + mess.message + "</div></div>";
					} else {
						str = "<div class=\"mess\"><p class=\"name\">" + mess.name + "</p><div class=\"text\">" + mess.message + "</div><span>" + mess.time + "</span></div>";
					}
					$(".show .messages").append(str);
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
}
//# sourceMappingURL=data:application/json;base64,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QixNQUFNLENBQU4sQ0FBaEI7QUFDQTtBQUNELEVBVEQ7QUFVQTs7QUFFRCxTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDLElBQWhDLEVBQXFDO0FBQ3BDLEdBQUUsTUFBRixFQUFVLFFBQVYsQ0FBbUIsTUFBbkI7QUFDQSxHQUFFLE9BQUYsRUFBVyxXQUFYLENBQXVCLE1BQXZCOztBQUZvQztBQUFBO0FBQUE7O0FBQUE7QUFJcEMsd0JBQWUsSUFBZixtSUFBb0I7QUFBQSxPQUFaLEdBQVk7O0FBQ25CLEtBQUUsaUJBQUYsRUFBcUIsTUFBckIsQ0FBNEIscUJBQW1CLElBQUksR0FBdkIsR0FBMkIsTUFBdkQ7QUFEbUI7QUFBQTtBQUFBOztBQUFBO0FBRW5CLDBCQUFnQixJQUFJLElBQXBCLG1JQUF5QjtBQUFBLFNBQWpCLElBQWlCOztBQUN4QixTQUFJLE1BQU0sRUFBVjtBQUNBLFNBQUksS0FBSyxJQUFMLEtBQWMsSUFBbEIsRUFBdUI7QUFDckIsMERBQThDLEtBQUssSUFBbkQsa0JBQW9FLEtBQUssSUFBekUsbUNBQXlHLEtBQUssT0FBOUc7QUFDRCxNQUZELE1BRUs7QUFDSCx1REFBMkMsS0FBSyxJQUFoRCxnQ0FBNkUsS0FBSyxPQUFsRixvQkFBd0csS0FBSyxJQUE3RztBQUNEO0FBQ0QsT0FBRSxpQkFBRixFQUFxQixNQUFyQixDQUE0QixHQUE1QjtBQUNBO0FBVmtCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXbkI7QUFmbUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWdCcEMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBuYW1lcyA9IFtdO1xyXG4kKFwiZm9ybSAuc2VuZFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdGxldCB0ZXh0ID0gJChcInRleHRhcmVhXCIpLnZhbCgpO1xyXG5cdGxldCByZWcgPSAvXFxuL2c7XHJcblx0bGV0IHNlcCA9IHRleHQuc3BsaXQocmVnKTtcclxuXHRsZXQgZGF5ID0gW107XHJcblx0Zm9yKGxldCBbaSwgdmFsXSBvZiBzZXAuZW50cmllcygpKXtcclxuXHRcdGlmICh2YWwuc2VhcmNoKC9cXGR7Mn0vZykgPT09IC0xKXtcclxuXHRcdFx0c2VwLnNwbGljZShpLCAxKTtcclxuXHRcdH1cclxuXHRcdGlmICh2YWwuc2VhcmNoKC9cXGR7NH0vZykgPT0gMCl7XHJcblx0XHRcdGRheS5wdXNoKGkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKGRheS5sZW5ndGggPT09IDAgfHwgZGF5WzBdICE9PSAwKXtcclxuXHRcdGZvcihsZXQgaSBpbiBkYXkpe1xyXG5cdFx0XHRkYXlbaV0rKztcclxuXHRcdH1cclxuXHRcdGRheS51bnNoaWZ0KDApO1xyXG5cdFx0bGV0IGQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0bGV0IGRhdGUgPSBkLmdldEZ1bGxZZWFyKCkgKyBcIi5cIiArIChkLmdldE1vbnRoKCkrMSkgKyBcIi5cIiArIGQuZ2V0RGF0ZSgpICsgXCIo54Sh5pel5pyf6LOH5paZ77yM5q2k5pel5pyf54K66Ly45Ye65pel5pyfKVwiO1xyXG5cdFx0c2VwLnVuc2hpZnQoZGF0ZSk7XHJcblx0fVxyXG5cclxuXHRzZXBfZGF5KHNlcCwgZGF5KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBzZXBfZGF5KHRleHQsIGRheSl7XHJcblx0bGV0IHRleHRfYXJyYXkgPSBbXTtcclxuXHRmb3IobGV0IFtpLCB2YWxdIG9mIGRheS5lbnRyaWVzKCkpe1xyXG5cdFx0bGV0IG9iaiA9IHt9O1xyXG5cdFx0b2JqLmRheSA9IHRleHRbdmFsXTtcclxuXHRcdG9iai50ZXh0ID0gW107XHJcblx0XHRsZXQgbmV4dCA9IGRheVtpKzFdIHx8IHRleHQubGVuZ3RoLTE7XHJcblx0XHRmb3IobGV0IGo9dmFsKzE7IGo8bmV4dDsgaisrKXtcclxuXHRcdFx0aWYgKHRleHRbal0uc2VhcmNoKC9cXGR7Mn0vZykgPT0gMCl7XHJcblx0XHRcdFx0b2JqLnRleHQucHVzaCh0ZXh0X2FuYWx5emUodGV4dFtqXSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0ZXh0X2FycmF5LnB1c2gob2JqKTtcclxuXHR9XHJcblx0ZmluaXNoKHRleHRfYXJyYXkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0ZXh0X2FuYWx5emUodGV4dCl7XHJcblx0bGV0IGZpcnN0ID0gdGV4dC5pbmRleE9mKFwiIFwiKTtcclxuXHRsZXQgc2Vjb25kID0gdGV4dC5pbmRleE9mKFwiIFwiLCBmaXJzdCsxKTtcclxuXHRsZXQgdGltZSA9IHRleHQuc3Vic3RyaW5nKDAsdGV4dC5pbmRleE9mKFwiIFwiKSk7XHJcblx0bGV0IG5hbWUgPSB0ZXh0LnN1YnN0cmluZyhmaXJzdCsxLHRleHQuaW5kZXhPZihcIiBcIiwgZmlyc3QrMSkpO1xyXG5cdGlmIChuYW1lcy5pbmRleE9mKG5hbWUpID09PSAtMSl7XHJcblx0XHRuYW1lcy5wdXNoKG5hbWUpO1xyXG5cdH1cclxuXHRsZXQgbWVzc2FnZSA9IHRleHQuc3Vic3RyaW5nKHNlY29uZCsxLHRleHQubGVuZ3RoKTtcclxuXHRsZXQgb2JqID0ge3RpbWUsIG5hbWUsIG1lc3NhZ2V9O1xyXG5cdHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmlzaCh0ZXh0KXtcclxuXHRsZXQgc3RyID0gXCJcIjtcclxuXHRsZXQgdXNlcjtcclxuXHRmb3IobGV0IG5hbWUgb2YgbmFtZXMpe1xyXG5cdFx0c3RyICs9IGA8bGk+JHtuYW1lfTwvbGk+YFxyXG5cdH1cclxuXHQkKFwiLnNldCBmb3JtXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHQkKFwiLnNldCAubmFtZXNcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdCQoXCIuc2V0IC5uYW1lcyB1bFwiKS5hcHBlbmQoc3RyKTtcclxuXHJcblx0JChcIi5zZXQgLm5hbWVzIGxpXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR1c2VyID0gJCh0aGlzKS5pbmRleCgpO1xyXG5cdFx0Z2VuX2NvbnZlcnNhdGlvbih0ZXh0LCBuYW1lc1t1c2VyXSk7XHJcblx0XHRuYW1lcy5zcGxpY2UodXNlciwgMSk7XHJcblx0XHRpZiAobmFtZXMubGVuZ3RoID4gMSl7XHJcblx0XHRcdCQoXCIuaGVhZFwiKS50ZXh0KFwi5bCN6Kmx576k57WEXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQoXCIuaGVhZFwiKS50ZXh0KG5hbWVzWzBdKTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuX2NvbnZlcnNhdGlvbih0ZXh0LCB1c2VyKXtcclxuXHQkKFwiLnNldFwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0JChcIi5zaG93XCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHJcblx0Zm9yKGxldCBkYXkgb2YgdGV4dCl7XHJcblx0XHQkKFwiLnNob3cgLm1lc3NhZ2VzXCIpLmFwcGVuZChcIjxwIGNsYXNzPSdkYXRlJz5cIitkYXkuZGF5K1wiPC9wPlwiKTtcclxuXHRcdGZvcihsZXQgbWVzcyBvZiBkYXkudGV4dCl7XHJcblx0XHRcdGxldCBzdHIgPSBcIlwiO1xyXG5cdFx0XHRpZiAobWVzcy5uYW1lID09PSB1c2VyKXtcclxuXHRcdFx0XHQgc3RyID0gYDxkaXYgY2xhc3M9XCJtZXNzIG1lXCI+PHAgY2xhc3M9XCJuYW1lXCI+JHttZXNzLm5hbWV9PC9wPjxzcGFuPiR7bWVzcy50aW1lfTwvc3Bhbj48ZGl2IGNsYXNzPVwidGV4dFwiPiR7bWVzcy5tZXNzYWdlfTwvZGl2PjwvZGl2PmBcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0IHN0ciA9IGA8ZGl2IGNsYXNzPVwibWVzc1wiPjxwIGNsYXNzPVwibmFtZVwiPiR7bWVzcy5uYW1lfTwvcD48ZGl2IGNsYXNzPVwidGV4dFwiPiR7bWVzcy5tZXNzYWdlfTwvZGl2PjxzcGFuPiR7bWVzcy50aW1lfTwvc3Bhbj48L2Rpdj5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIuc2hvdyAubWVzc2FnZXNcIikuYXBwZW5kKHN0cik7XHJcblx0XHR9XHJcblx0fVxyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
