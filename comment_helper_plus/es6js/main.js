var errorMessage = false;
window.onerror=handleErr

function handleErr(msg,url,l)
{
	$('.console .error').text(`${JSON.stringify(last_command)} 發生錯誤，請截圖通知管理員`);
	if (!errorMessage){
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址","font-size:30px; color:#F00");
		console.log("Error occur URL： " + $('#enterURL .url').val());
		$(".console .error").fadeIn();
		errorMessage = true;	
	}
	return false;
}
$(document).ready(function(){
	$("#btn_login").click(function(){
		fb.getAuth('login');
	});
	$('#select').change(function(){
		let id = $(this).val();
		let name = $(this).find("option:selected").text();
		let type = $(this).find("option:selected").attr('data-type');
		let page = {id,name,type};
		if (page.id !== '0'){
			step.step2(page);
		}
	});


	$("#btn_comments").click(function(e){
		fb.getAuth('comments');
	});

	$("#btn_like").click(function(){
		fb.getAuth('reactions');
	});

	$("#btn_pay").click(function(){
		fb.getAuth('addScope');
	});
	$("#btn_choose").click(function(){
		choose.init();
	});
	

	$("#endTime").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		}else{
			$(this).addClass("active");
		}
	});

	$("#btn_addPrize").click(function(){
		$(".prizeDetail").append(`<div class="prize"><div class="input_group">品名：<input type="text"></div><div class="input_group">抽獎人數：<input type="number"></div></div>`);
	});

	$("#unique, #tag").on('change',function(){
		config.filter.isDuplicate = $("#unique").prop("checked");
		table.redo();
	});

	$('.optionFilter input').dateDropper();
	$('.pick-submit').on('click',function(){
		// config.filter.endTime = $('.optionFilter input').val()+"-23-59-59";
		// table.redo();
	})

	$(".uipanel .react").change(function(){
		config.filter.react = $(this).val();
		table.redo();
	});

});

let config = {
	field: {
		comments: ['like_count','message_tags','message,from','created_time'],
		reactions: [],
		sharedposts: ['story','from', 'created_time'],
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
}

let fb = {
	user_posts: false,
	getAuth: (type)=>{
		FB.login(function(response) {
			fb.callback(response, type);
			console.log(response);
		}, {scope: config.auth ,return_scopes: true});
	},
	callback: (response, type)=>{
		if (response.status === 'connected') {
			if (type == "login"){
				if (response.authResponse.grantedScopes.indexOf('read_stream') >= 0){
					step.step1();
				}else{
					alert('沒有權限或授權不完成');
				}
			}else{
				step.step3();			
			}
		}else{
			FB.login(function(response) {
				fb.callback(response);
			}, {scope: config.auth ,return_scopes: true});
		}
	}
}
let fanpage = [];
let group = [];
let shortcut = [];
let last_command = {};
let url = {
	send: (tar, command)=>{
		let id = $(tar).parent().siblings('p').find('input').val();
		step.step3(id, command);
	}
}
let step = {
	step1: ()=>{
		$('.login').addClass('success');
		FB.api('v2.8/me/accounts', (res)=>{
			for(let i of res.data){
				fanpage.push(i);
				$("#select").prepend(`<option data-type="posts" value="${i.id}">${i.name}</option>`);
				FB.api(`v2.8/${i.id}/posts`, (res2)=>{
					for(let j of res2.data){
						if(j.message && j.message.indexOf('抽獎') >=0){
							let mess = j.message.replace(/\n/g,"<br />");
							$('.step1 .cards').append(`
								<div class="card" data-fbid="${j.id}">
								<p class="title">${i.name}</p>
								<p class="message" onclick="card.show(this)">${mess}</p>
								<div class="action">
								<div class="reactions" onclick="step.step3('${j.id}', 'reactions')">讚</div>
								<div class="comments" onclick="step.step3('${j.id}', 'comments')">留言</div>
								<div class="sharedposts" onclick="step.step3('${j.id}', 'sharedposts')">分享</div>
								</div>
								</div>
								`);
						}
					}
				});
			}
		});
		FB.api('v2.8/me/groups', (res)=>{
			for(let i of res.data){
				group.push(i);
				$("#select").prepend(`<option data-type="feed" value="${i.id}">${i.name}</option>`);
				FB.api(`v2.8/${i.id}/feed?fields=from,message,id`, (res2)=>{
					for(let j of res2.data){
						if(j.message && j.message.indexOf('抽獎') >=0 && j.from.id){
							let mess = j.message.replace(/\n/g,"<br />");
							$('.step1 .cards').append(`
								<div class="card" data-fbid="${j.id}">
								<p class="title">${i.name}</p>
								<p class="message">${mess}</p>
								<div class="action">
								<div class="reactions" onclick="step.step3('${j.id}', 'reactions')">讚</div>
								<div class="comments" onclick="step.step3('${j.id}', 'comments')">留言</div>
								<div class="sharedposts" onclick="step.step3('${j.id}', 'sharedposts')">分享</div>
								</div>
								</div>
								`);
						}
					}
				});
			}
		});
		FB.api('v2.8/me', (res)=>{
			$("#select").prepend(`<option data-type="posts" value="${res.id}">${res.name}</option>`);
			FB.api(`v2.8/me/posts`, (res2)=>{
				for(let j of res2.data){
					if(j.message && j.message.indexOf('抽獎') >=0){
						let mess = j.message.replace(/\n/g,"<br />");
						$('.step1 .cards').append(`
							<div class="card" data-fbid="${j.id}">
							<p class="title">${res.name}</p>
							<p class="message" onclick="card.show(this)">${mess}</p>
							<div class="action">
							<div class="reactions" onclick="step.step3('${j.id}', 'reactions')">讚</div>
							<div class="comments" onclick="step.step3('${j.id}', 'comments')">留言</div>
							<div class="sharedposts" onclick="step.step3('${j.id}', 'sharedposts')">分享</div>
							</div>
							</div>
							`);
					}
				}
			});
		});
	},
	step2: (page)=>{
		$('.step2').addClass('visible');
		$('.step2 .cards').html("");
		$('.step2 .head span').text(page.name);
		let command = page.type;
		FB.api(`v2.8/${page.id}/${command}`, (res)=>{
			for(let j of res.data){
				let mess = j.message ? j.message.replace(/\n/g,"<br />") : "";
				$('.step2 .cards').append(`
					<div class="card" data-fbid="${j.id}">
					<p class="message" onclick="card.show(this)">${mess}</p>
					<div class="action">
					<div class="reactions" onclick="step.step3('${j.id}', 'reactions')">讚</div>
					<div class="comments" onclick="step.step3('${j.id}', 'comments')">留言</div>
					<div class="sharedposts" onclick="step.step3('${j.id}', 'sharedposts')">分享</div>
					</div>
					</div>
					`);
			}
		});
	},
	step2to1: ()=>{
		$('#select').val(0);
		$('.step2').removeClass('visible');
	},
	step3hide: ()=>{
		$("#awardList").hide();
		$('.step3').removeClass('visible');
	},
	step3: (fbid, command)=>{
		last_command = {fbid,command};
		config.filter.endTime = nowDate();
		$('.step3').addClass('visible');
		$(".console .message").text('');
		$('.loading.waiting').addClass('visible');
		data.raw = [];
		data.filtered = [];
		data.command = command;
		if (command == 'reactions'){
			$('.optionFilter .react').removeClass('hide');
			$('.optionFilter .timelimit').addClass('hide');
		}
		FB.api(`${config.apiVersion[command]}/${fbid}/${command}`, (res)=>{
			console.log(res);
			data.length = res.data.length;
			for(let d of res.data){
				if (d.id){
					if (command == 'reactions'){
						d.from = {id: d.id, name: d.name};
					}
					if (d.from){
						data.raw.push(d);
					}
				}
			}
			if (res.data.length > 0 && res.paging.next){
				getNext(res.paging.next);
			}else{
				filter.totalFilter(data.raw, ...obj2Array(config.filter));
			}
		});

		function getNext(url){
			$.getJSON(url, function(res){
				data.length += res.data.length;
				$(".console .message").text('已截取  '+ data.length +' 筆資料...');
				for(let d of res.data){
					if (d.id){
						if (command == 'reactions'){
							d.from = {id: d.id, name: d.name};
						}
						if (d.from){
							data.raw.push(d);
						}
					}
				}
				if (res.data.length > 0 && res.paging.next){
					getNext(res.paging.next);
				}else{
					filter.totalFilter(data.raw, ...obj2Array(config.filter));
				}
			}).fail(()=>{
				getNext(url, 200);
			});
		}
	}
}

let card = {
	show: (e)=>{
		if ($(e).hasClass('visible')){
			$(e).removeClass('visible');
		}else{
			$(e).addClass('visible');
		}
	}
}

let data = {
	raw: [],
	filtered: [],
	command: '',
	length: 0
}

let table = {
	generate: ()=>{
		$('.loading.waiting').removeClass('visible');
		$(".main_table").DataTable().destroy();
		let filterdata = data.filtered;
		let thead = '';
		let tbody = '';
		if(data.command === 'reactions'){
			thead = `<td>序號</td>
			<td>名字</td>
			<td>表情</td>`;
		}else{
			thead = `<td>序號</td>
			<td width="200">名字</td>
			<td class="nowrap">留言時間</td>`;
		}

		let host = 'http://www.facebook.com/';

		for(let [j, val] of filterdata.entries()){
			let td = `<td><a href='http://www.facebook.com/${val.id}' target="_blank">${j+1}</a></td>
			<td><a href='http://www.facebook.com/${val.from.id}' target="_blank">${val.from.name}</a></td>`;
			if(data.command === 'reactions'){
				td += `<td class="center"><span class="react ${val.type}"></span>${val.type}</td>`;
			}else{
				td += `<td class="nowrap">${timeConverter(val.created_time)}</td>`;
			}
			let tr = `<tr>${td}</tr>`;
			tbody += tr;
		}
		let insert = `<thead><tr align="center">${thead}</tr></thead><tbody>${tbody}</tbody>`;
		$(".main_table").html('').append(insert);


		active();

		function active(){
			let table = $(".main_table").DataTable({
				"pageLength": 300,
				"searching": true,
				"lengthChange": false
			});

			$("#searchName").on( 'blur change keyup', function () {
				table
				.columns(1)
				.search(this.value)
				.draw();
			});
		}
	},
	redo: ()=>{
		filter.totalFilter(data.raw, ...obj2Array(config.filter));
	}
}

let choose = {
	data: [],
	award: [],
	num: 0,
	detail: false,
	list: [],
	init: ()=>{
		let thead = $('.main_table thead').html();
		$('#awardList table thead').html(thead);
		$('#awardList table tbody').html('');
		choose.data = data.filter(data.raw);
		choose.award = [];
		choose.list = [];
		choose.num = 0;
		if ($("#moreprize").hasClass("active")){
			choose.detail = true;
			$(".prizeDetail .prize").each(function(){
				var n = parseInt($(this).find("input[type='number']").val());
				var p = $(this).find("input[type='text']").val();
				if (n > 0){
					choose.num += parseInt(n);
					choose.list.push({"name":p, "num": n});
				}
			});
		}else{
			choose.num = $("#howmany").val();
		}
		choose.go();
	},
	go: ()=>{
		let num = $("#howmany").val();
		choose.award = genRandomArray(data.filtered.length).splice(0,num);
		let insert = '';
		for(let i of choose.award){
			insert += '<tr>' + $('.main_table').DataTable().rows({search:'applied'}).nodes()[i].innerHTML + '</tr>';
		}

		$('#awardList table tbody').html(insert);
		$('#awardList table tbody tr').addClass('success');

		$("#awardList").fadeIn(1000);
	}
}

let fbid = {
	fbid: [],
	init: (type)=>{
		fbid.fbid = [];
		data.init();
		FB.api("/me",function(res){
			data.userid = res.id;
			let url = fbid.format($('#enterURL .url').val());
			fbid.get(url, type).then((fbid)=>{
				data.start(fbid);
			})
			$('.identity').removeClass('hide').html(`登入身份：<img src="http://graph.facebook.com/${res.id}/picture?type=small"><span>${res.name}</span>`)
		});
	},
	get: (url, type)=>{
		return new Promise((resolve, reject)=>{
			if (type == 'url_comments'){
				let posturl = url;
				if (posturl.indexOf("?") > 0){
					posturl = posturl.substring(0,posturl.indexOf("?"));
				}
				FB.api(`/${posturl}`,function(res){
					let obj = {fullID: res.og_object.id, type: type, command: 'comments'};
					resolve(obj);
				});
			}else{
				let regex = /\d{4,}/g;
				let result = url.match(regex);
				let urltype = fbid.checkType(url);
				fbid.checkPageID(url, urltype).then((id)=>{
					if (id === 'personal'){
						urltype = 'personal';
						id = data.userid;
					}
					let obj = {pageID: id, type: urltype, command: type};
					if (urltype === 'personal'){
						let start = url.indexOf('fbid=');
						if(start >= 0){
							let end = url.indexOf("&",start);
							obj.pureID = url.substring(start+5,end);
						}else{
							let start = url.indexOf('posts/');
							obj.pureID = url.substring(start+6,url.length);
						}
						obj.fullID = obj.pageID + '_' + obj.pureID;
						resolve(obj);
					}else if (urltype === 'pure'){
						obj.fullID = url.replace(/\"/g,'');
						resolve(obj);
					}else{
						if (urltype === 'event'){
							if (result.length == 1){
								//抓EVENT中所有留言
								obj.command = 'feed';
								obj.fullID = result[0];
								resolve(obj);	
							}else{
								//抓EVENT中某篇留言的留言
								obj.fullID = result[1];
								resolve(obj);
							}
						}else if (urltype === 'group'){
							if (fb.user_posts){
								obj.pureID = result[result.length-1];
								obj.pageID = result[0];
								obj.fullID = obj.pageID + "_" +obj.pureID;
								resolve(obj);
							}else{
								swal({
									title: '社團使用需付費，詳情請見粉絲團',
									html:'<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
									type: 'warning'
								}).done();
							}
						}else{
							if (result.length == 1 || result.length == 3){
								obj.pureID = result[0];
								obj.fullID = obj.pageID + '_' + obj.pureID;
								resolve(obj);
							}else{
								if (urltype === 'unname'){
									obj.pureID = result[0];
									obj.pageID = result[result.length-1];
								}else{
									obj.pureID = result[result.length-1];
								}
								obj.fullID = obj.pageID + '_' + obj.pureID;
								resolve(obj);
							}
						}
					}
				});
			}
		});
	},
	checkType: (posturl)=>{
		if (posturl.indexOf("fbid=") >= 0){
			if (posturl.indexOf('permalink') >= 0){
				return 'unname';
			}else{
				return 'personal';
			}
		};
		if (posturl.indexOf("/groups/") >= 0){
			return 'group';
		};
		if (posturl.indexOf("events") >= 0){
			return 'event';
		};
		if (posturl.indexOf('"') >= 0){
			return 'pure';
		};
		return 'normal';
	},
	checkPageID: (posturl, type)=>{
		return new Promise((resolve, reject)=>{
			let start = posturl.indexOf("facebook.com")+13;
			let end = posturl.indexOf("/",start);
			let regex = /\d{4,}/g;
			if (end < 0){
				if (posturl.indexOf('fbid=') >= 0){
					if (type === 'unname'){
						resolve('unname');
					}else{
						resolve('personal');
					}
				}else{
					resolve(posturl.match(regex)[1]);
				}
			}else{
				let group = posturl.indexOf('/groups/');
				let event = posturl.indexOf('/events/')
				if (group >= 0){
					start = group+8;
					end = posturl.indexOf("/",start);
					let regex2 = /\d{6,}/g;
					let temp = posturl.substring(start,end);
					if (regex2.test(temp)){
						resolve(temp);
					}else{
						resolve('group');
					}
				}else if(event >= 0){
					resolve('event');
				}else{
					var pagename = posturl.substring(start,end);
					FB.api(`/${pagename}`,function(res){
						if (res.error){
							resolve('personal');
						}else{
							resolve(res.id);
						}
					});
				}
			}
		});
	},
	format: (url)=>{
		if (url.indexOf('business.facebook.com/') >= 0){
			url = url.substring(0, url.indexOf("?"));
			return url;
		}else{
			return url;
		}
	}
}

let filter = {
	totalFilter: (rawdata, isDuplicate, isTag, word, react, endTime)=>{
		let d = rawdata;
		if (isDuplicate){
			d = filter.unique(d);
		}
		if (word !== ''){
			d = filter.word(d, word);
		}
		if (isTag){
			d = filter.tag(d);
		}
		if (data.command !== 'reactions'){
			d = filter.time(d, endTime);
		}else{
			d = filter.react(d, react);
		}
		data.filtered = d;
		table.generate();
	},
	unique: (data)=>{
		let output = [];
		let keys = [];
		data.forEach(function(item) {
			let key = item.from.id;
			if(keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	},
	word: (data, word)=>{
		let newAry = $.grep(data,function(n, i){
			if (n.message.indexOf(word) > -1){
				return true;
			}
		});
		return newAry;
	},
	tag: (data)=>{
		let newAry = $.grep(data,function(n, i){
			if (n.message_tags){
				return true;
			}
		});
		return newAry;
	},
	time: (data, t)=>{
		let time_ary = t.split("-");
		let time = moment(new Date(time_ary[0],(parseInt(time_ary[1])-1),time_ary[2],time_ary[3],time_ary[4],time_ary[5]))._d;
		let newAry = $.grep(data,function(n, i){
			let created_time = moment(n.created_time)._d;
			if (created_time < time || n.created_time == ""){
				return true;
			}
		});
		return newAry;
	},
	react: (data, tar)=>{
		if (tar == 'all'){
			return data;
		}else{
			let newAry = $.grep(data,function(n, i){
				if (n.type == tar){
					return true;
				}
			});
			return newAry;
		}
	}
}

let ui = {
	init: ()=>{

	},
	reset: ()=>{
		let command = data.raw.command;
		if (command === 'reactions'){
			$('.limitTime, #searchComment').addClass('hide');
			$('.uipanel .react').removeClass('hide');
		}else{
			$('.limitTime, #searchComment').removeClass('hide');
			$('.uipanel .react').addClass('hide');
		}
		if (command === 'comments'){
			$('label.tag').removeClass('hide');
		}else{
			if ($("#tag").prop("checked")){
				$("#tag").click();
			}
			$('label.tag').addClass('hide');
		}
	}
}




function nowDate(){
	var a = new Date();
	var year = a.getFullYear();
	var month = a.getMonth()+1;
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	return year+"-"+month+"-"+date+"-"+hour+"-"+min+"-"+sec;
}

function timeConverter(UNIX_timestamp){
	 var a = moment(UNIX_timestamp)._d;
 	 var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
     var year = a.getFullYear();
     var month = months[a.getMonth()];
     var date = a.getDate();
     if (date < 10){
     	date = "0"+date;
     }
     var hour = a.getHours();
     var min = a.getMinutes();
     if (min < 10){
     	min = "0"+min;
     }
     var sec = a.getSeconds();
     if (sec < 10){
     	sec = "0"+sec;
     }
     var time = year+'-'+month+'-'+date+" "+hour+':'+min+':'+sec ;
     return time;
 }

 function obj2Array(obj){
 	let array = $.map(obj, function(value, index) {
 		return [value];
 	});
 	return array;
 }

 function genRandomArray(n) {
 	var ary = new Array();
 	var i, r, t;
 	for (i = 0 ; i < n ; ++i) {
 		ary[i] = i;
 	}
 	for (i = 0 ; i < n ; ++i) {
 		r = Math.floor(Math.random() * n);
 		t = ary[r];
 		ary[r] = ary[i];
 		ary[i] = t;
 	}
 	return ary;
 }
