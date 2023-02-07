<template>
  <div class="flex-grow max-w-lg text-left">
    <div class="source">
      <div class="mt-4">
        <input :value="post.id" type="text" disabled class="w-full rounded-none input-sm input-bordered max-w-xs disabled:bg-gray-300" placeholder="請按下方按鈕選擇貼文"/>
        <button class="btn btn-blue btn-sm" @click="copy">複製</button>
        <button class="btn btn-sm mt-4" :class="post.id === '' ? 'btn-blue':'btn-outline'" @click="fbInit">從粉絲專頁/社團選擇貼文</button>
      </div>
    </div>
    <div class="mt-4 flex flex-nowrap items-end" v-if="post.id !== ''">
      <button class="bg-blue-500 hover:bg-blue-400 transition-colors px-3 py-1 text-white font-bold rounded-md btn-free-height mr-2" @click="getData('comments')">
        <svg class="svg-icon fill-current w-10 mx-2" viewBox="0 0 20 20">
					<path d="M14.999,8.543c0,0.229-0.188,0.417-0.416,0.417H5.417C5.187,8.959,5,8.772,5,8.543s0.188-0.417,0.417-0.417h9.167C14.812,8.126,14.999,8.314,14.999,8.543 M12.037,10.213H5.417C5.187,10.213,5,10.4,5,10.63c0,0.229,0.188,0.416,0.417,0.416h6.621c0.229,0,0.416-0.188,0.416-0.416C12.453,10.4,12.266,10.213,12.037,10.213 M14.583,6.046H5.417C5.187,6.046,5,6.233,5,6.463c0,0.229,0.188,0.417,0.417,0.417h9.167c0.229,0,0.416-0.188,0.416-0.417C14.999,6.233,14.812,6.046,14.583,6.046 M17.916,3.542v10c0,0.229-0.188,0.417-0.417,0.417H9.373l-2.829,2.796c-0.117,0.116-0.71,0.297-0.71-0.296v-2.5H2.5c-0.229,0-0.417-0.188-0.417-0.417v-10c0-0.229,0.188-0.417,0.417-0.417h15C17.729,3.126,17.916,3.313,17.916,3.542 M17.083,3.959H2.917v9.167H6.25c0.229,0,0.417,0.187,0.417,0.416v1.919l2.242-2.215c0.079-0.077,0.184-0.12,0.294-0.12h7.881V3.959z"></path>
				</svg>
        抓留言
      </button>
      <button class="bg-blue-500 hover:bg-blue-400 transition-colors px-3 py-1 text-white font-bold rounded-md btn-free-height mr-2" @click="getData('reactions')">
        <svg class="svg-icon fill-current w-10 mx-2" viewBox="0 0 20 20">
          <path d="M9.719,17.073l-6.562-6.51c-0.27-0.268-0.504-0.567-0.696-0.888C1.385,7.89,1.67,5.613,3.155,4.14c0.864-0.856,2.012-1.329,3.233-1.329c1.924,0,3.115,1.12,3.612,1.752c0.499-0.634,1.689-1.752,3.612-1.752c1.221,0,2.369,0.472,3.233,1.329c1.484,1.473,1.771,3.75,0.693,5.537c-0.19,0.32-0.425,0.618-0.695,0.887l-6.562,6.51C10.125,17.229,9.875,17.229,9.719,17.073 M6.388,3.61C5.379,3.61,4.431,4,3.717,4.707C2.495,5.92,2.259,7.794,3.145,9.265c0.158,0.265,0.351,0.51,0.574,0.731L10,16.228l6.281-6.232c0.224-0.221,0.416-0.466,0.573-0.729c0.887-1.472,0.651-3.346-0.571-4.56C15.57,4,14.621,3.61,13.612,3.61c-1.43,0-2.639,0.786-3.268,1.863c-0.154,0.264-0.536,0.264-0.69,0C9.029,4.397,7.82,3.61,6.388,3.61"></path>
        </svg>
        抓按讚
      </button>
      <button class="bg-blue-500 hover:bg-blue-400 transition-colors px-3 py-1 text-white font-bold rounded-md btn-free-height mr-2" @click="getData('shares')">
        <svg class="svg-icon fill-current w-10 mx-2" viewBox="0 0 20 20">
          <path d="M14.68,12.621c-0.9,0-1.702,0.43-2.216,1.09l-4.549-2.637c0.284-0.691,0.284-1.457,0-2.146l4.549-2.638c0.514,0.661,1.315,1.09,2.216,1.09c1.549,0,2.809-1.26,2.809-2.808c0-1.548-1.26-2.809-2.809-2.809c-1.548,0-2.808,1.26-2.808,2.809c0,0.38,0.076,0.741,0.214,1.073l-4.55,2.638c-0.515-0.661-1.316-1.09-2.217-1.09c-1.548,0-2.808,1.26-2.808,2.809s1.26,2.808,2.808,2.808c0.9,0,1.702-0.43,2.217-1.09l4.55,2.637c-0.138,0.332-0.214,0.693-0.214,1.074c0,1.549,1.26,2.809,2.808,2.809c1.549,0,2.809-1.26,2.809-2.809S16.229,12.621,14.68,12.621M14.68,2.512c1.136,0,2.06,0.923,2.06,2.06S15.815,6.63,14.68,6.63s-2.059-0.923-2.059-2.059S13.544,2.512,14.68,2.512M5.319,12.061c-1.136,0-2.06-0.924-2.06-2.06s0.923-2.059,2.06-2.059c1.135,0,2.06,0.923,2.06,2.059S6.454,12.061,5.319,12.061M14.68,17.488c-1.136,0-2.059-0.922-2.059-2.059s0.923-2.061,2.059-2.061s2.06,0.924,2.06,2.061S15.815,17.488,14.68,17.488"></path>
        </svg>
        抓分享
      </button>
      <div class="text-center">
        <button @click="importShare" class="bg-blue-500 hover:bg-blue-400 transition-colors px-3 py-1 text-white rounded-md font-bold btn-sm block">導入抓分享資料</button>
        <a href="https://www.facebook.com/commenthelper/posts/4583917594974372" target="_blank" class="text-blue-400 text-sm">如何抓分享</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getNextAPI } from '@/api/api';
import { useDataStore } from '@/store/modules/data';
// import shareData from './shareData.js';
const dataStore = useDataStore();
const emit = defineEmits(['fbLogged', 'showLoading']);
function openURL(url: string, target?: string) {
  window.open(url, target);
}
const post = ref({id:''});
const page = ref({access_token: ''});
const fields = {
  comments: ['like_count', 'message_tags', 'message', 'from', 'created_time'],
  reactions: ['type', 'name'],
}
let rawData = [];

function fbInit(){
  emit('showLoading');
  FB.login(function (response: any) {
    emit('fbLogged', response, 'type');
  }, {
    auth_type: 'rerequest',
    scope: 'pages_show_list, pages_read_engagement, pages_read_user_content, groups_access_member_info',
    return_scopes: true
  });
}

const copy = () => {
  if (post.value.id === '') {
    return;
  }
  navigator.clipboard.writeText(post.value.id)
    .then(() => {
    alert("已複製：" + post.value.id);
  })
    .catch(err => {
    alert('Something went wrong' + err);
  })
}

const importShare = (shareData) => {
  localStorage.sharedposts = JSON.stringify(shareData);
  alert('匯入分享完成');
  dataStore.setRawData(shareData);
  dataStore.setNeedPay(true);
}
const importComment = (commentData) => {
  localStorage.commentPosts = JSON.stringify(commentData);
  alert('匯入留言完成');
  dataStore.setRawData(commentData);
  dataStore.setNeedPay(true);
}

const getData = async (command: string) => {
  emit('showLoading');
  rawData = [];
  dataStore.setCommand(command);
  if (command === 'shares'){
    const fbid = post.value.id.split('_')[post.value.id.split('_').length-1];
		window.open(`https://m.facebook.com/browse/shares?id=${fbid}`);
    emit('showLoading', false);
  }else{
    FB.api(`/${post.value.id}/${command}`, {
      fields: fields[command].join(','),
      limit: 100,
      order: 'chronological',
      access_token: page.value.access_token,
    }, (res: any)=>{
      rawData = rawData.concat(res.data);
      if(res.paging && res.paging.next){
        getNext(res.paging.next);
      }else{
        finishFetch();
      }
    });
  }
}

const getNext = async (url) => {
  const res = await getNextAPI(url);
  rawData = rawData.concat(res.data);
  if (res.paging.next){
    getNext(res.paging.next);
  }else{
    finishFetch();
  }
}

const finishFetch = () => {
  if (rawData.length === 0){
    alert('沒有資料');
  }else{
    console.log(rawData);
    dataStore.setRawData(rawData);
  }
  emit('showLoading', false);
}

const getPost = (target: any, target_page: any) => {
  post.value = target;
  page.value = target_page;
}

onMounted(()=>{
  window.addEventListener('importShare', function(e){
    importShare(e.detail.data);
  });
  window.addEventListener('importComment', function(e){
    importComment(e.detail.data);
  });
})

defineExpose({
  getPost
})


</script>