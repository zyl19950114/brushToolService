import axios from 'axios';
import Vue from 'vue';
import Message from 'iview/src/components/message';
console.log('初始化');

// const codeMessage: any = {
//   106: "Tonken Error",
//   200: "OK",
//   201: "Created",
//   401: "Unauthorized",
//   403: "Forbidden",
//   404: "Not Found"
// }

axios.get('/webConfig.json').then((res)=>{
  axios.defaults.baseURL = res.data.baseURL;
  document.title = res.data.webTtitle;
  Vue.prototype.$fileServerUrl = res.data.fileServerUrl;
})

// 请求拦截
axios.interceptors.request.use(
  (config) => {
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
// export default axios
