import router from '@/router';
import store from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { setting } from '@/config/setting';
let { authentication, loginInterception, progressBar, routesWhiteList, recordRoute } = setting;
authentication = 'all';
NProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});
router.beforeEach(async (to, from, next) => {
  if (progressBar) NProgress.start();

  let hasToken = store.getters['user/accessToken'];
  if (!loginInterception) hasToken = true;

  if (true) {
    if (to.path === '/login') {
      next();
      if (progressBar) NProgress.done();
    } else {
      const hasPermissions =
        store.getters['user/permissions'] && store.getters['user/permissions'].length > 0;
      if (hasPermissions) {
        next();
      } else {
        try {
          let permissions;
          await store.dispatch('user/setPermissions', ['admin']);
          permissions = ['admin'];
          let accessRoutes = [];
          if (authentication === 'intelligence') {
            accessRoutes = await store.dispatch('routes/setRoutes', permissions);
          } else if (authentication === 'all') {
            accessRoutes = await store.dispatch('routes/setAllRoutes');
          }
          accessRoutes.forEach((item) => {
            router.addRoute(item);
          });
          next({ ...to, replace: true });
        } catch {
          await store.dispatch('user/resetAccessToken');
          if (progressBar) NProgress.done();
        }
      }
    }
  } else {
    // 免登录路由
    if (routesWhiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (recordRoute) {
        next(`/login?redirect=${to.path}`);
      } else {
        next('/login');
      }
      if (progressBar) NProgress.done();
    }
  }
  document.title = '订单管理系统';
});
router.afterEach(() => {
  if (progressBar) NProgress.done();
});
