import Vue from 'vue'
import App from './App.vue'
import router from './router';
import iView from 'iview';
import './init.js'
import 'iview/dist/styles/iview.css';
import '@mdi/font/css/materialdesignicons.css'
import './assets/base.scss'

Vue.config.productionTip = false
Vue.use(iView);

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

Vue.prototype.confirmDialog = (text, loading = false, okCallback, cancelCallBack) => {
  iView.Modal.confirm({
    width: 300,
    loading,
    render: h => {
      return h('div', [
        h('Icon', {
          props: {
            size: 24,
            type: 'md-information-circle',
            color: '#f1ae3a'
          }
        }),
        h('span', {
          attrs: {
            style: 'font-size: 16px; padding-left: 5px',
          }
        }, text)
      ])
    },
    onOk: () => {
      if (typeof okCallback === 'function') {
        okCallback()
      }
    },
    onCancel: () => {
      if (typeof cancelCallBack === 'function') {
        cancelCallBack()
      }
    }
  })
}