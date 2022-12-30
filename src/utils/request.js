import axios from 'axios';
import { netConfig } from '@/config/net.config';
const { baseURL, contentType, invalidCode,notFound, noPermissionCode, requestTimeout, successCode } =
  netConfig;
import store from '@/store/index.js';
import router from '@/router/index.js';
import { ElMessageBox, ElMessage } from 'element-plus';
import qs from 'qs';
import { setting } from '@/config/setting';
const { tokenName } = setting;

// eslint-disable-next-line no-unused-vars
let tokenLose = true;

/**
 *
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
  switch (code) {
    case invalidCode:
      router.push({ path: '/login' }).catch(() => {});
      break;
    case noPermissionCode:
      router.push({ path: '/401' }).catch(() => {});
      break;
    case notFound:
      router.push({ path: '/404' }).catch(() => {});
      break;
    default:
      ElMessage.error(msg.detail || `后端接口${code}异常`);
      break;
  }
};
const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
    "Authorization":"Bearer "+localStorage.token
  },
});

instance.interceptors.request.use(
  console.log(localStorage.token),
  (config) => {
    if (store.getters['user/accessToken']) {
      config.headers[tokenName] = "Bearer "+localStorage.token;
    }
    if (
      config.data &&
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8'
    )
      config.data = qs.stringify(config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const res = response.data;
    const { status,data } = response;
    // const { code, msg } = data;
    // 操作成功
    if (response.status==200) {
      return res;
    } else {
      handleCode(status, data);
      return Promise.reject();
    }
  },
  (error) => {
    const { response, message } = error;
    if (error.response && error.response.data) {
      const { status, data } = response;
      handleCode(status, data || message);
      return Promise.reject(error);
    } else {
      let { message } = error;
      if (message === 'Network Error') {
        message = '后端接口连接异常';
      }
      if (message.includes('timeout')) {
        message = '后端接口请求超时';
      }
      if (message.includes('Request failed with status code')) {
        const code = message.substr(message.length - 3);
        if (code == 401){
          router.push({ path: '/login' }).catch(() => {});
        }
        message = '登录失效，请重新登录！！！';
      }
      ElMessage.error(message || `后端接口未知异常`);
      return Promise.reject(error);
    }
  }
);
export default instance;
