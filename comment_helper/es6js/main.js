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
	let hash = location.search;
	if (hash.indexOf("extension") >= 0) {
		$(".loading.checkAuth").removeClass("hide");
		data.extension = true;

		$(".loading.checkAuth button").click(function (e) {
			fb.extensionAuth();
		});
	}
	if (hash.indexOf("ranker") >= 0) {
		let datas = {
			command: 'ranker',
			data: JSON.parse(localStorage.ranker)
		}
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
		$(".prizeDetail").append(`<div class="prize"><div class="input_group">品名：<input type="text"></div><div class="input_group">抽獎人數：<input type="number"></div></div>`);
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
			"daysOfWeek": [
				"日",
				"一",
				"二",
				"三",
				"四",
				"五",
				"六"
			],
			"monthNames": [
				"一月",
				"二月",
				"三月",
				"四月",
				"五月",
				"六月",
				"七月",
				"八月",
				"九月",
				"十月",
				"十一月",
				"十二月"
			],
			"firstDay": 1
		},
	}, function (start, end, label) {
		config.filter.startTime = start.format('YYYY-MM-DD-HH-mm-ss');
		config.filter.endTime = end.format('YYYY-MM-DD-HH-mm-ss');
		table.redo();
	});
	$('.rangeDate').data('daterangepicker').setStartDate(config.filter.startTime);


	$("#btn_excel").click(function (e) {
		let filterData = data.filter(data.raw);
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
		var excelString = data.excel(filterData)
		$("#exceldata").val(JSON.stringify(excelString));
	});

	let ci_counter = 0;
	$(".ci").click(function (e) {
		ci_counter++;
		if (ci_counter >= 5) {
			$(".source .url, .source .btn").addClass("hide");
			$("#inputJSON").removeClass("hide");
		}
		if (e.ctrlKey || e.altKey) {

		}
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

let config = {
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
	order: '',
	auth: 'manage_pages,groups_access_member_info',
	likes: false,
	pageToken: '',
	from_extension: false,
}

let fb = {
	user_posts: false,
	getAuth: (type = '') => {
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
	callback: (response, type) => {
		console.log(response);
		if (response.status === 'connected') {
			auth_scope = response.authResponse.grantedScopes;
			config.from_extension = false;
			if (type == "addScope") {
				if (auth_scope.indexOf('groups_access_member_info') >= 0) {
					swal(
						'付費授權完成，請再次執行抓留言',
						'Authorization Finished! Please getComments again.',
						'success'
					).done();
				} else {
					swal(
						'付費授權失敗，請聯絡管理員確認',
						'Authorization Failed! Please contact the admin.',
						'error'
					).done();
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
	extensionAuth: () => {
		FB.login(function (response) {
			fb.extensionCallback(response);
		}, {
			scope: config.auth,
			return_scopes: true
		});
	},
	extensionCallback: (response) => {
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
				let postdata = JSON.parse(localStorage.postdata);
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
	authOK: () => {
		$(".loading.checkAuth").addClass("hide");
		let postdata = JSON.parse(localStorage.postdata);
		let datas = {
			command: postdata.command,
			data: JSON.parse($(".chrome").val())
		}
		data.raw = datas;
		data.finish(data.raw);
	}
}

let data = {
	raw: [],
	userid: '',
	nowLength: 0,
	extension: false,
	init: () => {
		$(".main_table").DataTable().destroy();
		$("#awardList").hide();
		$(".console .message").text('截取資料中...');
		data.nowLength = 0;
		if (!addLink) {
			data.raw = [];
		}
	},
	start: (fbid) => {
		$(".waiting").removeClass("hide");
		$('.pure_fbid').text(fbid.fullID);
		data.get(fbid).then((res) => {
			// fbid.data = res;
			if (fbid.type == "url_comments") {
				fbid.data = [];
			}
			for (let i of res) {
				fbid.data.push(i);
			}
			data.finish(fbid);
		});
	},
	get: (fbid) => {
		return new Promise((resolve, reject) => {
			let datas = [];
			let promise_array = [];
			let command = fbid.command;
			if (fbid.type === 'group') command = 'group';
			if (fbid.type === 'group' && fbid.command !== 'reactions') fbid.fullID = fbid.pureID;
			if (config.likes) fbid.command = 'likes';
			console.log(`${config.apiVersion[command]}/${fbid.fullID}/${fbid.command}?limit=${config.limit[fbid.command]}&fields=${config.field[fbid.command].toString()}&debug=all`);

			// if($('.token').val() === ''){
			// 	$('.token').val(config.pageToken);
			// }else{
			// 	config.pageToken = $('.token').val();
			// }

			FB.api(`${config.apiVersion[command]}/${fbid.fullID}/${fbid.command}?limit=${config.limit[fbid.command]}&order=${config.order}&fields=${config.field[fbid.command].toString()}&access_token=${config.pageToken}&debug=all`, (res) => {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				for (let d of res.data) {
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
				if (res.data.length > 0 && res.paging.next) {
					getNext(res.paging.next);
				} else {
					resolve(datas);
				}
			});

			function getNext(url, limit = 0) {
				if (limit !== 0) {
					url = url.replace('limit=500', 'limit=' + limit);
				}
				$.getJSON(url, function (res) {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					for (let d of res.data) {
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
					if (res.data.length > 0 && res.paging.next) {
						getNext(res.paging.next);
					} else {
						resolve(datas);
					}
				}).fail(() => {
					getNext(url, 200);
				});
			}
		});
	},
	finish: (fbid) => {
		$(".waiting").addClass("hide");
		$(".main_table").removeClass("hide");
		$(".update_area,.donate_area").slideUp();
		$(".result_area").slideDown();
		swal('完成！', 'Done!', 'success').done();
		data.raw = fbid;
		data.filter(data.raw, true);
		ui.reset();
	},
	filter: (rawData, generate = false) => {
		let isDuplicate = $("#unique").prop("checked");
		let isTag = $("#tag").prop("checked");
		if (config.from_extension === false && rawData.command === 'comments') {
			rawData.data = rawData.data.filter(item => {
				return item.is_hidden === false
			});
		}
		let newData = filter.totalFilter(rawData, isDuplicate, isTag, ...obj2Array(config.filter));
		rawData.filtered = newData;
		if (generate === true) {
			table.generate(rawData);
		} else {
			return rawData;
		}
	},
	excel: (raw) => {
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
						"留言內容": this.message,
					}
					newObj.push(tmp);
				});
			} else {
				$.each(raw.filtered, function (i) {
					var tmp = {
						"序號": i + 1,
						"臉書連結": 'https://www.facebook.com/' + this.from.id,
						"姓名": this.from.name,
						"分享連結": this.postlink,
						"留言內容": this.story,
					}
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
				}
				newObj.push(tmp);
			});
		}
		return newObj;
	},
	import: (file) => {
		let reader = new FileReader();

		reader.onload = function (event) {
			let str = event.target.result;
			data.raw = JSON.parse(str);
			data.finish(data.raw);
		}

		reader.readAsText(file);
	}
}

let table = {
	generate: (rawdata) => {
		$(".main_table").DataTable().destroy();
		let filterdata = rawdata.filtered;
		let thead = '';
		let tbody = '';
		let pic = $("#picture").prop("checked");
		if (rawdata.command === 'reactions' || config.likes) {
			thead = `<td>序號</td>
			<td>名字</td>
			<td>表情</td>`;
		} else if (rawdata.command === 'sharedposts') {
			thead = `<td>序號</td>
			<td>名字</td>
			<td class="force-break">留言內容</td>
			<td width="110">留言時間</td>`;
		} else if (rawdata.command === 'ranker') {
			thead = `<td>排名</td>
			<td>名字</td>
			<td>分數</td>`;
		} else {
			thead = `<td>序號</td>
			<td width="200">名字</td>
			<td class="force-break">留言內容</td>
			<td>讚</td>
			<td class="nowrap">留言時間</td>`;
		}

		let host = 'https://www.facebook.com/';
		if (data.raw.type === 'url_comments') host = $('#enterURL .url').val() + '?fb_comment_id=';

		for (let [j, val] of filterdata.entries()) {
			let picture = '';
			if (pic) {
				picture = `<img src="https://graph.facebook.com/${val.from.id}/picture?type=small"><br>`;
			}
			let td = `<td>${j+1}</td>
			<td><a href='https://www.facebook.com/${val.from.id}' target="_blank">${picture}${val.from.name}</a></td>`;
			if (rawdata.command === 'reactions' || config.likes) {
				td += `<td class="center"><span class="react ${val.type}"></span>${val.type}</td>`;
			} else if (rawdata.command === 'sharedposts') {
				td += `<td class="force-break"><a href="https://www.facebook.com/${val.id}" target="_blank">${val.story}</a></td>
				<td class="nowrap">${timeConverter(val.created_time)}</td>`;
			} else if (rawdata.command === 'ranker') {
				td = `<td>${j+1}</td>
					  <td><a href='https://www.facebook.com/${val.from.id}' target="_blank">${val.from.name}</a></td>
					  <td>${val.score}</td>`;
			} else {
				let link = val.id;
				if (config.from_extension) {
					link = val.postlink;
				}
				td += `<td class="force-break"><a href="${host}${link}" target="_blank">${val.message}</a></td>
				<td>${val.like_count}</td>
				<td class="nowrap">${timeConverter(val.created_time)}</td>`;
			}
			let tr = `<tr>${td}</tr>`;
			tbody += tr;
		}
		let insert = `<thead><tr align="center">${thead}</tr></thead><tbody>${tbody}</tbody>`;
		$(".main_table").html('').append(insert);


		active();

		function active() {
			TABLE = $(".main_table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});

			$("#searchName").on('blur change keyup', function () {
				TABLE
					.columns(1)
					.search(this.value)
					.draw();
			});
			$("#searchComment").on('blur change keyup', function () {
				TABLE
					.columns(2)
					.search(this.value)
					.draw();
				config.filter.word = this.value;
			});
		}
	},
	redo: () => {
		data.filter(data.raw, true);
	}
}

let choose = {
	data: [],
	award: [],
	num: 0,
	detail: false,
	list: [],
	init: () => {
		let thead = $('.main_table thead').html();
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
	go: () => {
		choose.award = genRandomArray(choose.data.filtered.length).splice(0, choose.num);
		let insert = '';
		choose.award.map((val, index) => {
			insert += '<tr title="第' + (index + 1) + '名">' + $('.main_table').DataTable().rows({
				search: 'applied'
			}).nodes()[val].innerHTML + '</tr>';
		})
		$('#awardList table tbody').html(insert);
		$('#awardList table tbody tr').addClass('success');

		if (choose.detail) {
			let now = 0;
			for (let k in choose.list) {
				let tar = $("#awardList tbody tr").eq(now);
				$(`<tr><td class="prizeName" colspan="5">獎品： ${choose.list[k].name} <span>共 ${choose.list[k].num} 名</span></td></tr>`).insertBefore(tar);
				now += (choose.list[k].num + 1);
			}
			$("#moreprize").removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		}
		$("#awardList").fadeIn(1000);
	},
	gen_big_award: () => {
		let li = '';
		let awards = [];
		$('#awardList tbody tr').each(function (index, val) {
			let award = {};
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
		for (let i of awards) {
			if (i.award_name === true) {
				li += `<li class="prizeName">${i.name}</li>`;
			} else {
				li += `<li>
				<a href="https://www.facebook.com/${i.userid}" target="_blank"><img src="https://graph.facebook.com/${i.userid}/picture?type=large" alt=""></a>
				<div class="info">
				<p class="name"><a href="https://www.facebook.com/${i.userid}" target="_blank">${i.name}</a></p>
				<p class="message"><a href="${i.link}" target="_blank">${i.message}</a></p>
				<p class="time"><a href="${i.link}" target="_blank">${i.time}</a></p>
				</div>
				</li>`;
			}
		}
		$('.big_award ul').append(li);
		$('.big_award').addClass('show');
	},
	close_big_award: () => {
		$('.big_award').removeClass('show');
		$('.big_award ul').empty();
	}
}

let fbid = {
	fbid: [],
	init: (type) => {
		config.pageToken = '';
		fbid.fbid = [];
		data.init();
		FB.api("/me", function (res) {
			data.userid = res.id;
			let url = '';
			if (addLink) {
				url = fbid.format($('.morelink .addurl').val());
				$('.morelink .addurl').val('');
			} else {
				url = fbid.format($('#enterURL .url').val());
			}
			if (url.indexOf('.php?') === -1 && url.indexOf('?') > 0) {
				url = url.substring(0, url.indexOf('?'));
			}
			fbid.get(url, type).then((fbid) => {
				data.start(fbid);
			})
			// $('.identity').removeClass('hide').html(`登入身份：<img src="https://graph.facebook.com/${res.id}/picture?type=small"><span>${res.name}</span>`);
		});
	},
	get: (url, type) => {
		return new Promise((resolve, reject) => {
			if (type == 'url_comments') {
				let posturl = url;
				if (posturl.indexOf("?") > 0) {
					posturl = posturl.substring(0, posturl.indexOf("?"));
				}
				FB.api(`/${posturl}`, function (res) {
					let obj = {
						fullID: res.og_object.id,
						type: type,
						command: 'comments'
					};
					config.limit['comments'] = '25';
					config.order = '';
					resolve(obj);
				});
			} else {
				let regex = /\d{4,}/g;
				let newurl = url.substr(url.indexOf('/', 28) + 1, 200);
				// https://www.facebook.com/ 共25字元，因此選28開始找/
				let result = newurl.match(regex);
				let urltype = fbid.checkType(url);
				fbid.checkPageID(url, urltype).then((id) => {
					if (id === 'personal') {
						urltype = 'personal';
						id = data.userid;
					}
					let obj = {
						pageID: id,
						type: urltype,
						command: type,
						data: []
					};
					if (addLink) obj.data = data.raw.data; //追加貼文
					if (urltype === 'personal') {
						let start = url.indexOf('fbid=');
						if (start >= 0) {
							let end = url.indexOf("&", start);
							obj.pureID = url.substring(start + 5, end);
						} else {
							let start = url.indexOf('posts/');
							obj.pureID = url.substring(start + 6, url.length);
						}
						let video = url.indexOf('videos/');
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
							let regex = /\d{4,}/g;
							let result = url.match(regex);
							obj.pureID = result[result.length - 1];
							obj.fullID = obj.pageID + '_' + obj.pureID;
							resolve(obj);
						} else if (urltype === 'video') {
							obj.pureID = result[result.length - 1];
							FB.api(`/${obj.pureID}?fields=live_status`, function (res) {
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
								FB.api(`/${obj.pageID}?fields=access_token`, function (res) {
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
	checkType: (posturl) => {
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
	checkPageID: (posturl, type) => {
		return new Promise((resolve, reject) => {
			let start = posturl.indexOf("facebook.com") + 13;
			let end = posturl.indexOf("/", start);
			let regex = /\d{4,}/g;
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
				let group = posturl.indexOf('/groups/');
				let event = posturl.indexOf('/events/')
				if (group >= 0) {
					start = group + 8;
					end = posturl.indexOf("/", start);
					let regex2 = /\d{6,}/g;
					let temp = posturl.substring(start, end);
					if (regex2.test(temp)) {
						resolve(temp);
					} else {
						resolve('group');
					}
				} else if (event >= 0) {
					resolve('event');
				} else {
					var pagename = posturl.substring(start, end);
					FB.api(`/${pagename}?fields=access_token`, function (res) {
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
	format: (url) => {
		if (url.indexOf('business.facebook.com/') >= 0) {
			url = url.substring(0, url.indexOf("?"));
			return url;
		} else {
			return url;
		}
	}
}

let filter = {
	totalFilter: (rawdata, isDuplicate, isTag, word, react, startTime, endTime) => {
		let data = rawdata.data;
		if (word !== '') {
			data = filter.word(data, word);
		}
		if (isTag) {
			data = filter.tag(data);
		}
		if (rawdata.command === 'reactions' || config.likes) {
			data = filter.react(data, react);
		} else if (rawdata.command === 'ranker') {

		} else {
			data = filter.time(data, startTime, endTime);
		}
		if (isDuplicate) {
			data = filter.unique(data);
		}

		return data;
	},
	unique: (data) => {
		let output = [];
		let keys = [];
		data.forEach(function (item) {
			let key = item.from.id;
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	},
	word: (data, word) => {
		let newAry = $.grep(data, function (n, i) {
			if (n.message === undefined) {
				if (n.story.indexOf(word) > -1) {
					return true;
				}
			} else {
				if (n.message.indexOf(word) > -1) {
					return true;
				}
			}
		});
		return newAry;
	},
	tag: (data) => {
		let newAry = $.grep(data, function (n, i) {
			if (n.message_tags) {
				return true;
			}
		});
		return newAry;
	},
	time: (data, st, t) => {
		let time_ary2 = st.split("-");
		let time_ary = t.split("-");
		let endtime = moment(new Date(time_ary[0], (parseInt(time_ary[1]) - 1), time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;
		let starttime = moment(new Date(time_ary2[0], (parseInt(time_ary2[1]) - 1), time_ary2[2], time_ary2[3], time_ary2[4], time_ary2[5]))._d;
		let newAry = $.grep(data, function (n, i) {
			let created_time = moment(n.created_time)._d;
			if ((created_time > starttime && created_time < endtime) || n.created_time == "") {
				return true;
			}
		});
		return newAry;
	},
	react: (data, tar) => {
		if (tar == 'all') {
			return data;
		} else {
			let newAry = $.grep(data, function (n, i) {
				if (n.type == tar) {
					return true;
				}
			});
			return newAry;
		}
	}
}

let ui = {
	init: () => {

	},
	addLink: () => {
		let tar = $('.inputarea .morelink');
		if (tar.hasClass('show')) {
			tar.removeClass('show');
		} else {
			tar.addClass('show');
		}
	},
	reset: () => {
		let command = data.raw.command;
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
}


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
	let array = $.map(obj, function (value, index) {
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
	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

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