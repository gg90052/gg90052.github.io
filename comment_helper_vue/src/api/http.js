import axios from 'axios'

const $axios = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-type': 'application/json',
  },
})

// 攔截請求
$axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  config.headers.Authorization = `Bearer ${token}`
  return config
}, error => {
  return Promise.reject(error)
})

// 攔截回應
$axios.interceptors.response.use(res => {
  switch (res.status) {
    case 200:
      return Promise.resolve(res)
    default:
      console.log(res.status)
  }
}, error => {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        console.error(error.response)
        alert(JSON.stringify(error.response.data.errors));
        break
      case 401:
        console.error(error)
        break
      default:
        console.error('攔截錯誤請求', error.response.status)
        return Promise.reject(error)
    }
  }
})

/**
 * 封裝get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
 function get(url, params = {}) {
  return new Promise((resolve, reject) => {
      $axios.get(url, {
          params
      }).then(response => {
          resolve(response.data)
      }).catch(err => {
          reject(err)
      })
  })
}

/**
* 封裝post請求
* @param url
* @param data
* @returns {Promise}
*/
function post(url, data = {}) {
  return new Promise((resolve, reject) => {
      $axios.post(url, data).then(response => {
          resolve(response.data)
      }, err => {
          reject(err)
      })
  })
}

/**
* 封裝put請求
* @param url
* @param data
* @returns {Promise}
*/
function put(url, data = {}) {
  return new Promise((resolve, reject) => {
      $axios.put(url, data).then(response => {
          resolve(response.data)
      }, err => {
          reject(err)
      })
  })
}

const $http = {
  get: (params) => {
    return get(params.url, params.params)
  },
  post: (params) => {
    return post(params.url, params.params)
  },
  put: (params) => {
    return put(params.url, params.params)
  }
}

export default $http
