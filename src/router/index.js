import Vue from "vue";
import VRouter from "vue-router"

Vue.use(VRouter)

const roures = new VRouter({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login'),
      meta: {
        navState: false,
      },
    },
    {
      path: '/',
      name: 'upload-apk',
      component: () => import('@/pages/upload-apk'),
      meta: {
        navState: true,
        navName: '上传apk',
        icon: 'md-cloud-upload'
      },
    },
    {
      path: '/import-terminal',
      name: 'import-terminal',
      component: () => import('@/pages/import-terminal'),
      meta: {
        navState: true,
        navName: '导入授权终端',
        icon: 'md-construct'
      },
    },
    // {
    //   path: '/terminal-list',
    //   name: 'terminal-list',
    //   component: () => import('@/pages/terminal-list'),
    //   meta: {
    //     navState: true,
    //     navName: '授权终端列表',
    //     icon: 'md-albums'
    //   },
    // },
    {
      path: '/log-list',
      name: 'log-list',
      component: () => import('@/pages/log-list'),
      meta: {
        navState: true,
        navName: '操作日志列表',
        icon: 'md-paper'
      },
    }
  ]
})


// 全局路由守卫
roures.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');
  if (to.path === '/login') {
    next();
  } else {
    if (!token) {
      next('/login');
    } else {
      next()
    }
  }
})

export default roures