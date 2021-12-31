import axios from 'axios';
import Vue from 'vue';
import router from './router/index'
import Message from 'iview/src/components/message';
console.log('初始化');

document.title = process.env.VUE_APP_TITLE;
axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
Vue.prototype.$webConfig = process.env;

// 请求拦截
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) { // 判断是否存在token，如果存在的话，则每个http headers都加上token
      config.headers['X-Access-Token'] = token;  // 请求头加上token
    }
    if (config.url.includes('/login')) {
      console.log(process.env)
      config.baseURL = process.env.VUE_APP_LOGIN_API;
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
