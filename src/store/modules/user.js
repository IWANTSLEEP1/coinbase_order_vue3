import { getUserInfo, login, captcha, getAllUsers, getAllRoles, addUser,getUser,editUser} from '@/api/user';
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken';

import { setting } from '@/config/setting';
const { title, tokenName } = setting;
import { resetRouter } from '@/router';

import i18n from '@/locales';
const { global } = i18n;

import { ElMessage, ElNotification } from 'element-plus';

const state = {
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  permissions: [],
};

const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
};
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
    setAccessToken(accessToken);
  },
  setUsername(state, username) {
    state.username = username;
  },
  setAvatar(state, avatar) {
    state.avatar = avatar;
  },
  setPermissions(state, permissions) {
    state.permissions = permissions;
  },
};
const actions = {
  setPermissions({ commit }, permissions) {
    commit('setPermissions', permissions);
  },
  async login({ commit },form) {
    const data = await login(form);
    console.log(data,1111)
    // const accessToken = data[tokenName];
    // if (accessToken) {
    //   commit('setAccessToken', accessToken);
    //   const hour = new Date().getHours();
    //   const thisTime =
    //     hour < 8
    //       ? global.t('sayHi.early')
    //       : hour <= 11
    //       ? global.t('sayHi.morning')
    //       : hour <= 13s
    //       ? global.t('sayHi.noon')
    //       : hour < 18
    //       ? global.t('sayHi.afternoon')
    //       : global.t('sayHi.evening');
    //   ElNotification({
    //     title: `${thisTime}！`,
    //     message: `${global.t('notice.msg')}${title}!`,
    //     type: 'success',
    //   });
    // } else {
    //   ElMessage.error(`登录接口异常，未正确返回${tokenName}...`);
    // }
  },
  async getUserInfo({ commit, state }) {
    const { data } = await getUserInfo(state.accessToken);
    if (!data) {
      ElMessage.error('验证失败，请重新登录...');
      return false;
    }
    let { permissions, username, avatar } = data;
    if (permissions && username && Array.isArray(permissions)) {
      commit('setPermissions', permissions);
      commit('setUsername', username);
      commit('setAvatar', avatar);
      return permissions;
    } else {
      ElMessage.error('用户信息接口异常');
      return false;
    }
  },
  async logout({ dispatch }) {
    // await logout(state.accessToken);
    return await dispatch('resetAccessToken');
  },
  async captcha({ dispatch }) {
    const data = await captcha()
    return data
  },

  async getAllUsers({ dispatch }) {
    const data = await getAllUsers()
    return data
  },
  
  async getAllRoles({ dispatch }) {
    const data = await getAllRoles()
    return data
  },

  async getUser({ dispatch },email) {
    const data = await getUser(email)
    return data
  },

  async addUser({ dispatch },data) {
    const res = await addUser(data)
    return res
  },
  async editUser({ dispatch },data) {
    const res = await editUser(data)
    return res
  },
  resetAccessToken({ commit }) {
    commit('setPermissions', []);
    commit('setAccessToken', '');
    removeAccessToken();
  },
};
export default { state, getters, mutations, actions };
