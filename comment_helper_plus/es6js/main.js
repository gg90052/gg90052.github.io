var errorMessage = false;
window.onerror = handleErr

function handleErr(msg, url, l) {
	if (!errorMessage) {
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}
$(document).ready(function () {
	let hash = location.hash;
	if (hash.indexOf("clear") >= 0) {
		localStorage.removeItem('raw');
		sessionStorage.removeItem('login');
		alert('已清除暫存，請重新進行登入');
		location.href = 'https://gg90052.github.io/comment_helper_plus';
	}
	let lastData = JSON.parse(localStorage.getItem("raw"));

	if (lastData) {
		data.finish(lastData, true);
	}
	// if (sessionStorage.login){
	// 	fb.genOption(JSON.parse(sessionStorage.login));
	// }

	// $(".tables > .sharedposts button").click(function(e){
	// 	if (e.ctrlKey || e.altKey){
	// 		fb.extensionAuth('import');
	// 	}else{
	// 		fb.extensionAuth();
	// 	}
	// });

	$("#btn_start").click(function () {
		fb.getAuth('signin');
	});
	$("#btn_auth").click(function () {
		fb.getAuth('signup');
	});
	$("#btn_choose").click(function (e) {
		if (e.ctrlKey || e.altKey) {
			choose.init(true);
		} else {
			choose.init();
		}
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
		if (!e.ctrlKey || !e.altKey) {
			$("#btn_excel").text("複製表格內容");
		}
	});

	$("#unique, #tag").on('change', function () {
		table.redo();
	});

	$(".tables .filters .react").change(function () {
		config.filter.react = $(this).val();
		table.redo();
	});

	$('.tables .total .filters select').change(function () {
		compare.init();
	});

	$('.compare_condition').change(function () {
		$('.tables .total .table_compare').addClass('hide');
		$('.tables .total .table_compare table').removeClass('table-active');
		$('.tables .total .table_compare.' + $(this).val()).removeClass('hide');
		$('.tables .total .table_compare.' + $(this).val() + ' table').addClass('table-active');
	});

	$('.rangeDate').daterangepicker({
		"singleDatePicker": true,
		"timePicker": true,
		"timePicker24Hour": true,
		"locale": {
			"format": "YYYY-MM-DD   HH:mm",
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
		config.filter.endTime = start.format('YYYY-MM-DD-HH-mm-ss');
		table.redo();
	});
	$('.rangeDate').data('daterangepicker').setStartDate(nowDate());


	$("#btn_excel").click(function (e) {
		let filterData = data.filter(data.raw);
		if (e.ctrlKey) {
			let dd;
			if (tab.now === 'compare') {
				dd = JSON.stringify(compare[$('.compare_condition').val()]);
			} else {
				dd = JSON.stringify(filterData[tab.now]);
			}
			var url = 'data:text/json;charset=utf8,' + dd;
			window.open(url, '_blank');
			window.focus();
		}
	});

	let ci_counter = 0;
	$(".ci").click(function (e) {
		ci_counter++;
		if (ci_counter >= 5) {
			$(".source .url, .source .btn").addClass("hide");
			$("#inputJSON").removeClass("hide");
		}
		if (e.ctrlKey) {
			fb.getAuth('sharedposts');
		}
	});
	$("#inputJSON").change(function () {
		$(".waiting").removeClass("hide");
		$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
		data.import(this.files[0]);
	});
});

let config = {
	field: {
		comments: ['like_count', 'message_tags', 'message', 'from', 'created_time'],
		reactions: [],
		url_comments: [],
		feed: ['created_time', 'from', 'message', 'story'],
		likes: ['name']
	},
	limit: '30',
	apiVersion: 'v8.0',
	filter: {
		word: '',
		react: 'all',
		startTime: '2000-12-31-00-00-00',
		endTime: nowDate()
	},
	target: '',
	command: '',
	order: 'chronological',
	auth: 'groups_show_list, pages_show_list, pages_read_engagement, pages_read_user_content, groups_access_member_info',
	likes: false,
	pageToken: false,
	userToken: '',
	from_extension: false,
	auth_user: false,
	signin: false,
}

let fb = {
	next: '',
	getAuth: (type) => {
		if (config.signin === true) {
			page_selector.show();
			return false;
		}
		FB.login(function (response) {
			fb.callback(response, type);
		}, {
			auth_type: 'rerequest',
			scope: config.auth,
			return_scopes: true
		});
	},
	callback: (response, type) => {
		if (response.status === 'connected') {
			config.userToken = response.authResponse.accessToken;
			config.me = response.authResponse.userID;
			config.from_extension = false;

			if (type == 'signup') {
				// 註冊

				let token = $('#pay_token').val() == '' ? '-1':$('#pay_token').val();
				FB.api(`/me?fields=id,name`, (res) => {
					let obj = {
						token,
						username: res.name,
						app_scope_id: res.id
					}
					$('.waiting').removeClass('hide');
					$.post('https://script.google.com/macros/s/AKfycbzjwRWn_3VkILLnZS3KEISKZBEDiyCRJLJ_Q_vIqn2SqQgoYFk/exec', obj, function (res2) {
						$('.waiting').addClass('hide');
						if (res2.code == 1) {
							alert(res2.message);
							fb.callback(response, 'signin');
						} else {
							alert(res2.message + '\n' + JSON.stringify(obj));
							// fb.callback(response, 'signin');
						}
					});
				});
			}

			if (type == 'signin') {
				$('.waiting').removeClass('hide');
				$.get('https://script.google.com/macros/s/AKfycbzjwRWn_3VkILLnZS3KEISKZBEDiyCRJLJ_Q_vIqn2SqQgoYFk/exec?id=' + config.me, function (res2) {
					$('.waiting').addClass('hide');
					if (res2 === 'true') {
						config.auth_user = true;
						fb.start();
					} else {
						config.auth_user = false;
						swal({
							title: 'PLUS為付費產品，詳情請見粉絲專頁',
							html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a><br>userID：' + config.me,
							type: 'warning'
						}).done();
					}
				});
			}

			if (type == "page_selector") {
				page_selector.show();
			}
		} else {
			FB.login(function (response) {
				fb.callback(response, type);
			}, { scope: config.auth, return_scopes: true });
		}
	},
	start: () => {
		page_selector.show();
		fb.next = '';
		let options = `
		<button class="btn" onclick="page_selector.show()">從粉絲專頁/社團選擇貼文</button><br>
		<input id="pure_fbid">
		<button id="fbid_button" class="btn" onclick="fb.hiddenStart(this)">由FBID擷取</button>
		<a href="javascript:;" onclick="data.finish(data.raw)" style="margin-left:20px;">強制跳轉到表格</a><br>`;
		let type = -1;
		$('#btn_start').addClass('hide');
		$('#enterURL').html(options).removeClass('hide');
	},
	extensionAuth: (command = '') => {
		FB.login(function (response) {
			fb.extensionCallback(response, command);
		}, { scope: config.auth, return_scopes: true });
	},
	extensionCallback: (response, command = '') => {
		if (response.status === 'connected') {
			config.from_extension = true;
			auth_scope = response.authResponse.grantedScopes;
			let me = response.authResponse.userID;
			$('.waiting').removeClass('hide');
			$.get('https://script.google.com/macros/s/AKfycbzjwRWn_3VkILLnZS3KEISKZBEDiyCRJLJ_Q_vIqn2SqQgoYFk/exec?id=' + me, function (res2) {
				$('.waiting').addClass('hide');
				if (res2 === 'true') {
					extension_start();
				} else {
					swal({
						title: 'PLUS為付費產品，詳情請見粉絲專頁',
						html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a><br>userID：' + me,
						type: 'warning'
					}).done();
				}
			});
			function extension_start() {
				data.raw.extension = true;
				if (command == 'import') {
					localStorage.setItem("sharedposts", $('#import').val());
				}
				let extend = JSON.parse(localStorage.getItem("sharedposts"));
				let fid = [];
				let ids = [];
				for (let i of extend) {
					fid.push(i.from.id);
					if (fid.length >= 45) {
						ids.push(fid);
						fid = [];
					}
				}
				ids.push(fid);
				let promise_array = [], names = {};
				for (let i of ids) {
					let promise = fb.getName(i).then((res) => {
						for (let i of Object.keys(res)) {
							names[i] = res[i];
						}
					});
					promise_array.push(promise);
				}
				let postdata = JSON.parse(localStorage.postdata);
				if (command == 'comments') {
					if (postdata.type === 'personal') {
						// FB.api("/me", function (res) {
						// 	if (res.name === postdata.owner) {
						// 		for(let i of extend){
						// 			i.message = i.story;
						// 			delete i.story;
						// 			delete i.postlink;
						// 			i.like_count = 'N/A';
						// 		}
						// 	}else{
						// 		swal({
						// 			title: '個人貼文只有發文者本人能抓',
						// 			html: `貼文帳號名稱：${postdata.owner}<br>目前帳號名稱：${res.name}`,
						// 			type: 'warning'
						// 		}).done();
						// 	}
						// });
						for (let i of extend) {
							delete i.story;
							delete i.postlink;
							i.like_count = 'N/A';
						}
					} else if (postdata.type === 'group') {
						for (let i of extend) {
							delete i.story;
							delete i.postlink;
							i.like_count = 'N/A';
						}
					} else {
						for (let i of extend) {
							delete i.story;
							delete i.postlink;
							i.like_count = 'N/A';
						}
					}
				}

				if (command == 'reactions') {
					if (postdata.type === 'personal') {
						// FB.api("/me", function (res) {
						// 	if (res.name === postdata.owner) {
						// 		for(let i of extend){
						// 			delete i.story;
						// 			delete i.created_time;
						// 			delete i.postlink;
						// 			delete i.like_count;
						// 			i.type = 'LIKE';
						// 		}
						// 	}else{
						// 		swal({
						// 			title: '個人貼文只有發文者本人能抓',
						// 			html: `貼文帳號名稱：${postdata.owner}<br>目前帳號名稱：${res.name}`,
						// 			type: 'warning'
						// 		}).done();
						// 	}
						// });
						for (let i of extend) {
							delete i.story;
							delete i.created_time;
							delete i.postlink;
							delete i.like_count;
						}
					} else if (postdata.type === 'group') {
						for (let i of extend) {
							delete i.story;
							delete i.created_time;
							delete i.postlink;
							delete i.like_count;
						}
					} else {
						for (let i of extend) {
							delete i.story;
							delete i.created_time;
							delete i.postlink;
							delete i.like_count;
						}
					}
				}

				Promise.all(promise_array).then(() => {
					for (let i of extend) {
						i.from.name = names[i.from.id] ? names[i.from.id].name : i.from.name;
					}
					data.raw.data[command] = extend;
					data.finish(data.raw);
				});
			}
		} else {
			FB.login(function (response) {
				fb.extensionCallback(response);
			}, { scope: config.auth, return_scopes: true });
		}
	},
	getName: (ids) => {
		return new Promise((resolve, reject) => {
			FB.api(`${config.apiVersion}/?ids=${ids.toString()}`, (res) => {
				resolve(res);
			});
		});
	}
}
let step = {
	step1: () => {
		$('.section').removeClass('step2');
		$("html, body").scrollTop(0);
	},
	step2: () => {
		$('.forfb').addClass('hide');
		$('.recommands, .feeds tbody').empty();
		$('.section').addClass('step2');
		$("html, body").scrollTop(0);
	}
}

let data = {
	raw: {
		comments: [],
		reactions: [],
		sharedposts: [],
	},
	fullID: '',
	filtered: {},
	userid: '',
	nowLength: 0,
	promise_array: [],
	init: () => {
		$(".main_table").DataTable().destroy();
		$("#awardList").hide();
		$(".console .message").text('');
		data.raw = {
			comments: [],
			reactions: [],
			sharedposts: [],
		};
		data.fullID = '';
		data.nowLength = 0;
		data.promise_array = [];
	},
	start: (fbid) => {
		data.init();
		data.fullID = fbid;
		$(".waiting").removeClass("hide");
		let commands = ['comments', 'reactions'];
		for (let i of commands) {
			data.promise_array.push(data.get(fbid, i));
		}

		Promise.all(data.promise_array).then((res) => {
			data.finish(res);
		});
	},
	get: (fbid, command) => {
		return new Promise((resolve, reject) => {
			let datas = [];
			// if ($('.page_btn.active').attr('attr-type') == 2){
			// 	api_fbid = fbid.fullID.split('_')[1];
			// 	if (command === 'reactions') command = 'likes';
			// }
			FB.api(`${fbid}/${command}?limit=${config.limit}&order=${config.order}&access_token=${config.pageToken}&fields=${config.field[command].toString()}`, (res) => {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				groupData(res);
				if (res.data.length > 0 && res.paging.next) {
					getNext(res.paging.next);
				} else {
					resolve(datas);
				}
			});
			function groupData(res) {
				for (let d of res.data) {
					if ((config.command == 'reactions' || config.command == 'likes') || config.likes) {
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
			}

			function getNext(url, limit = 0) {
				if (limit !== 0) {
					url = url.replace('limit=500', 'limit=' + limit);
				}
				$.getJSON(url, function (res) {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					groupData(res);
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
	finish: (rawdata, lastData = false) => {
		$(".waiting").addClass("hide");
		$(".main_table").removeClass("hide");
		step.step2();
		swal('完成！', 'Done!', 'success').done();
		$('.result_area > .title span').text(data.fullID);
		if (lastData === false){
			data.raw.comments = rawdata[0];
			data.raw.reactions = rawdata[1];
			localStorage.setItem("raw", JSON.stringify(data.raw));
		}else{
			data.raw = JSON.parse(localStorage.raw);
		}
		data.filter(data.raw, true);
	},
	filter: (rawData, generate = false) => {
		data.filtered = {};
		let isDuplicate = $("#unique").prop("checked");
		for (let key of Object.keys(rawData)) {
			let isTag = $("#tag").prop("checked");
			if (key === 'reactions') isTag = false;
			let newData = filter.totalFilter(rawData[key], key, isDuplicate, isTag, ...obj2Array(config.filter));
			data.filtered[key] = newData;
		}
		if (generate === true) {
			table.generate(data.filtered);
		} else {
			return data.filtered;
		}
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
	generate: (filterData) => {
		$(".tables table").DataTable().destroy();
		let filtered = filterData;
		let pic = $("#picture").prop("checked");
		for (let key of Object.keys(filtered)) {
			let thead = '';
			let tbody = '';
			if (key === 'reactions') {
				thead = `<td>序號</td>
				<td>名字</td>
				<td>心情</td>`;
			} else if (key === 'sharedposts') {
				thead = `<td>序號</td>
				<td>名字</td>
				<td class="force-break">留言內容</td>
				<td width="110">留言時間</td>`;
			} else {
				thead = `<td>序號</td>
				<td width="200">名字</td>
				<td class="force-break">留言內容</td>
				<td>讚</td>
				<td class="nowrap">留言時間</td>`;
			}
			for (let [j, val] of filtered[key].entries()) {
				let picture = '';
				if (pic) {
					// picture = `<img src="https://graph.facebook.com/${val.from.id}/picture?type=small&access_token=${config.pageToken}"><br>`;
				}
				let td = `<td>${j + 1}</td>
				<td><a href='https://www.facebook.com/${val.from.id}' attr-fbid="${val.from.id}" target="_blank">${picture}${val.from.name}</a></td>`;
				if (key === 'reactions') {
					td += `<td class="center"><span class="react ${val.type}"></span>${val.type}</td>`;
				} else if (key === 'sharedposts') {
					td += `<td class="force-break"><a href="https://www.facebook.com/${val.id}" target="_blank">${val.message || val.story}</a></td>
					<td class="nowrap">${timeConverter(val.created_time)}</td>`;
				} else {
					td += `<td class="force-break"><a href="https://www.facebook.com/${val.id}" target="_blank">${val.message}</a></td>
					<td>${val.like_count}</td>
					<td class="nowrap">${timeConverter(val.created_time)}</td>`;
				}
				let tr = `<tr>${td}</tr>`;
				tbody += tr;
			}
			let insert = `<thead><tr align="center">${thead}</tr></thead><tbody>${tbody}</tbody>`;
			$(".tables ." + key + " table").html('').append(insert);
		}

		active();
		tab.init();
		compare.init();

		function active() {
			let table = $(".tables table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			let arr = ['comments', 'reactions', 'sharedposts'];
			for (let i of arr) {
				let table = $('.tables .' + i + ' table').DataTable();
				$(".tables ." + i + " .searchName").on('blur change keyup', function () {
					table
						.columns(1)
						.search(this.value)
						.draw();
				});
				$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
					table
						.columns(2)
						.search(this.value)
						.draw();
					config.filter.word = this.value;
				});
			}
		}
	},
	redo: () => {
		data.filter(data.raw, true);
	}
}

let compare = {
	and: [],
	or: [],
	raw: [],
	init: () => {
		compare.and = [];
		compare.or = [];
		compare.raw = data.filter(data.raw);
		let ignore = $('.tables .total .filters select').val();
		let base = [];
		let final = [];
		let compare_num = 1;
		if (ignore === 'ignore') compare_num = 2;

		for (let key of Object.keys(compare.raw)) {
			if (key !== ignore) {
				for (let i of compare.raw[key]) {
					base.push(i);
				}
			}
		}
		let sort = (data.raw.extension) ? 'name' : 'id';
		base = base.sort((a, b) => {
			return a.from[sort] > b.from[sort] ? 1 : -1;
		});

		for (let i of base) {
			i.match = 0;
		}

		let temp = '';
		let temp_name = '';
		// console.log(base);
		for (let i in base) {
			let obj = base[i];
			if (obj.from.id == temp || (data.raw.extension && (obj.from.name == temp_name))) {
				let tar = final[final.length - 1];
				tar.match++;
				for (let key of Object.keys(obj)) {
					if (!tar[key]) tar[key] = obj[key]; //合併資料
				}
				if (tar.match == compare_num) {
					temp_name = '';
					temp = '';
				}
			} else {
				final.push(obj);
				temp = obj.from.id;
				temp_name = obj.from.name;
			}
		}


		compare.or = final;
		compare.and = compare.or.filter((val) => {
			return val.match == compare_num;
		});
		compare.generate();
	},
	generate: () => {
		$(".tables .total table").DataTable().destroy();
		let data_and = compare.and;

		let tbody = '';
		for (let [j, val] of data_and.entries()) {
			let td = `<td>${j + 1}</td>
			<td><a href='https://www.facebook.com/${val.from.id}' attr-fbid="${val.from.id}" target="_blank">${val.from.name}</a></td>
			<td class="center"><span class="react ${val.type || ''}"></span>${val.type || ''}</td>
			<td class="force-break"><a href="https://www.facebook.com/${val.id}" target="_blank">${val.message || ''}</a></td>
			<td>${val.like_count || '0'}</td>
			<td class="force-break"><a href="https://www.facebook.com/${val.id}" target="_blank">${val.story || ''}</a></td>
			<td class="nowrap">${timeConverter(val.created_time) || ''}</td>`;
			let tr = `<tr>${td}</tr>`;
			tbody += tr;
		}
		$(".tables .total .table_compare.and tbody").html('').append(tbody);

		let data_or = compare.or;
		let tbody2 = '';
		for (let [j, val] of data_or.entries()) {
			let td = `<td>${j + 1}</td>
			<td><a href='https://www.facebook.com/${val.from.id}' attr-fbid="${val.from.id}" target="_blank">${val.from.name}</a></td>
			<td class="center"><span class="react ${val.type || ''}"></span>${val.type || ''}</td>
			<td class="force-break"><a href="https://www.facebook.com/${val.id}" target="_blank">${val.message || ''}</a></td>
			<td>${val.like_count || ''}</td>
			<td class="force-break"><a href="https://www.facebook.com/${val.id}" target="_blank">${val.story || ''}</a></td>
			<td class="nowrap">${timeConverter(val.created_time) || ''}</td>`;
			let tr = `<tr>${td}</tr>`;
			tbody2 += tr;
		}
		$(".tables .total .table_compare.or tbody").html('').append(tbody2);

		active();

		function active() {
			let table = $(".tables .total table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			let arr = ['and', 'or'];
			for (let i of arr) {
				let table = $('.tables .' + i + ' table').DataTable();
				$(".tables ." + i + " .searchName").on('blur change keyup', function () {
					table
						.columns(1)
						.search(this.value)
						.draw();
				});
				$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
					table
						.columns(2)
						.search(this.value)
						.draw();
					config.filter.word = this.value;
				});
			}
		}
	}
}

let choose = {
	data: [],
	award: [],
	num: 0,
	detail: false,
	list: [],
	init: (ctrl = false) => {
		let thead = $('.main_table thead').html();
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
		choose.go(ctrl);
	},
	go: (ctrl) => {
		let command = tab.now;
		if (tab.now === 'compare') {
			choose.award = genRandomArray(compare[$('.compare_condition').val()].length).splice(0, choose.num);
		} else {
			choose.award = genRandomArray(choose.data[command].length).splice(0, choose.num);
		}
		let insert = '';
		let tempArr = [];
		if (command === 'comments') {
			$('.tables > div.active table').DataTable().column(2).data().each(function (value, index) {
				let word = $('.searchComment').val();
				if (value.indexOf(word) >= 0) tempArr.push(index);
			});
		}
		for (let i of choose.award) {
			let row = (tempArr.length == 0) ? i : tempArr[i];
			let tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
			insert += '<tr>' + tar + '</tr>';
		}
		$('#awardList table tbody').html(insert);
		if (!ctrl) {
			$("#awardList tbody tr").each(function () {
				// let tar = $(this).find('td').eq(1);
				// let id = tar.find('a').attr('attr-fbid');
				// tar.prepend(`<img src="https://graph.facebook.com/${id}/picture?type=small"><br>`);
			});
		}

		$('#awardList table tbody tr').addClass('success');

		if (choose.detail) {
			let now = 0;
			for (let k in choose.list) {
				let tar = $("#awardList tbody tr").eq(now);
				$(`<tr><td class="prizeName" colspan="7">獎品： ${choose.list[k].name} <span>共 ${choose.list[k].num} 名</span></td></tr>`).insertBefore(tar);
				now += (choose.list[k].num + 1);
			}
			$("#moreprize").removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		}
		$("#awardList").fadeIn(1000);
	},
}

let page_selector = {
	pages: [],
	groups: [],
	page_id: false,
	show: () => {
		$('.page_selector').removeClass('hide');
		config.pageToken = false;
		$('#live_id').val('');
		if (config.signin === false) {
			page_selector.getAdmin();
		}
	},
	hide: ()=>{
		$('.page_selector').addClass('hide');
	},
	getAdmin: () => {
		Promise.all([page_selector.getPage(), page_selector.getGroup()]).then((res) => {
			page_selector.genAdmin(res);
		});
	},
	getPage: () => {
		return new Promise((resolve, reject) => {
			FB.api(`${config.apiVersion}/me/accounts?limit=100`, (res) => {
				resolve(res.data);
			});
		});
	},
	getGroup: () => {
		return new Promise((resolve, reject) => {
			FB.api(`${config.apiVersion}/me/groups?fields=name,id,administrator&limit=100`, (res) => {
				resolve(res.data.filter(item => { return item.administrator === true }));
			});
		});
	},
	genAdmin: (res) => {
		let pages = '';
		let groups = '';
		for (let i of res[0]) {
			pages += `<div class="page_btn" data-type="1" data-value="${i.id}" onclick="page_selector.selectPage(this)">${i.name}</div>`;
		}
		if (config.auth_user === true) {
			for (let i of res[1]) {
				groups += `<div class="page_btn" data-type="2" data-value="${i.id}" onclick="page_selector.selectPage(this)">${i.name}</div>`;
			}
		}
		$('.select_page').html(pages);
		$('.select_group').html(groups);
		config.signin = true;
	},
	selectPage: (target) => {
		page_selector.page_id = $(target).data('value');
		if ($(target).data('type') == '2') {
			config.target = 'group';
		} else {
			config.target = 'fanpage';
		}
		$('#post_table tbody').html('');
		$('.fb_loading').removeClass('hide');
		FB.api(`/${page_selector.page_id}?fields=access_token`, function (res) {
			if (res.access_token) {
				config.pageToken = res.access_token;
			} else {
				config.pageToken = '';
			}
		});
		FB.api(`${config.apiVersion}/${page_selector.page_id}/feed?limit=100`, (res) => {
			$('.fb_loading').addClass('hide');
			let tbody = '';
			for (let tr of res.data) {
				tbody += `<tr><td><button type="button" onclick="page_selector.selectPost('${tr.id}')">選擇貼文</button></td><td><a href="https://www.facebook.com/${tr.id}" target="_blank">${tr.message}</a></td><td>${timeConverter(tr.created_time)}</td></tr>`;
			}
			$('#post_table tbody').html(tbody);
		});
	},
	golive() {
		if (config.pageToken === false) {
			alert('請先選擇對應直播的粉絲專頁');
		} else {
			$('.page_selector').addClass('hide');
			$('#post_table tbody').html('');
			$('#enterURL .url').val(page_selector.page_id + '_' + $('#live_id').val());
		}
	},
	selectPost: (fbid) => {
		$('.page_selector').addClass('hide');
		$('.select_page').html('');
		$('.select_group').html('');
		$('#post_table tbody').html('');
		data.start(fbid);
	}
}

let filter = {
	totalFilter: (raw, command, isDuplicate, isTag, word, react, startTime, endTime) => {
		let datas = raw;
		if (word !== '' && command == 'comments') {
			datas = filter.word(datas, word);
		}
		if (isTag && command == 'comments') {
			datas = filter.tag(datas);
		}
		if (command !== 'reactions') {
			datas = filter.time(datas, endTime);
		} else {
			datas = filter.react(datas, react);
		}
		if (isDuplicate) {
			datas = filter.unique(datas);
		}

		return datas;
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
		let newAry = data.filter(item=>{
			return item.message.indexOf(word) > -1;
		});
		return newAry;
	},
	tag: (data) => {
		let newAry = data.filter(item=>{
			return item.message_tags
		});
		return newAry;
	},
	time: (data, t) => {
		let time_ary = t.split("-");
		let time = moment(new Date(time_ary[0], (parseInt(time_ary[1]) - 1), time_ary[2], time_ary[3], time_ary[4], time_ary[5]));
		let newAry = data.filter(item=>{
			if (item.created_time == ''){
				return true;
			}else{
				return moment(item.created_time) < time;
			}
		});
		return newAry;
	},
	react: (data, tar) => {
		if (tar == 'all') {
			return data;
		} else {
			let newAry = data.filter(item=>{
				return item.type == tar
			});
			return newAry;
		}
	}
}

let ui = {
	init: () => {

	}
}

let tab = {
	now: "comments",
	init: () => {
		$('#comment_table .tabs .tab').click(function () {
			$('#comment_table .tabs .tab').removeClass('active');
			$(this).addClass('active');
			tab.now = $(this).attr('attr-type');
			let tar = $(this).index();
			$('.tables > div').removeClass('active');
			$('.tables > div').eq(tar).addClass('active');
			if (tab.now === 'compare') {
				compare.init();
			}
		});
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
	if (hour < 10) {
		hour = "0" + hour;
	}
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