import $http from './http.js';

const Api = {
  
}

//Login
// export const getCaptcha = (params?: {w?:Number, h?:Number}) =>{
//   let queryString;
//   if (params){
//     queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
//   }
//   return $http.get({ url: `${Api.common.captcha}?${queryString}` });
// }

export const getNextAPI = (url) =>{
  return $http.get({ url });
}
