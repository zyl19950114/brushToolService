import axios from 'axios';
import Vue from 'vue';
import router from './router/index'
import Message from 'iview/src/components/message';
console.log('初始化');

axios.get('/webConfig.json').then((res) => {
  axios.defaults.baseURL = res.data.baseURL;
  axios.defaults.loginURL = res.data.loginURL;
  document.title = res.data.webTtitle;
  Vue.prototype.$fileServerUrl = res.data.fileServerUrl;
})

// 请求拦截
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) { // 判断是否存在token，如果存在的话，则每个http headers都加上token
      config.headers['X-Access-Token'] = token;  // 请求头加上token
    }
    if (config.url.includes('/login')) {
      config.baseURL = config.loginURL;
    }
    return config
  },
  (error) => {
    console.log('error', error)
  }
)

// 响应拦截
axios.interceptors.response.use(
  (config) => {
    return config
  }
)

Vue.prototype.$axios = axios;
