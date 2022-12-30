/**
 * @author hujiangjun 1217437592@qq.com
 * @description 路由控制
 */
import router from '@/router';
import store from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getPageTitle } from '@/utils/index';
import { setting } from '@/config/setting';
const { authentication, loginInterception, progressBar, routesWhiteList, recordRoute } = setting;

NProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});
router.beforeEach(async (to, from, next) => {
  if (progressBar) NProgress.start();
  next()
});
router.afterEach(() => {
  if (progressBar) NProgress.done();
});
