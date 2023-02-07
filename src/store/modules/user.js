import {
  getUserInfo,
  login,
  captcha,
  getAllUsers,
  getAllRoles,
  getRole,
  editRole,
  delRole,
  addUser,
  getUser,
  editUser,
  deleteUser,
  addSuperUser,
  signIn,
  addRole,
  editPwd,
} from '@/api/user';
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken';

import { setting } from '@/config/setting';
const { title, tokenName } = setting;
import { ElMessage } from 'element-plus';

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
  async login({ commit }, form) {
    const data = await login(form);
    return data;
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
  async captcha({ dispatch }) {
    const data = await captcha();
    return data;
  },

  async getAllUsers({ dispatch }) {
    const data = await getAllUsers();
    return data;
  },

  async signIn({ dispatch }) {
    const data = await signIn();
    return data;
  },
  async getUser({ dispatch }, email) {
    const data = await getUser(email);
    return data;
  },

  async addUser({ dispatch }, data) {
    const res = await addUser(data);
    return res;
  },
  async editUser({ dispatch }, data) {
    const res = await editUser(data);
    return res;
  },
  async deleteUser({ dispatch }, email) {
    const res = await deleteUser(email);
    return res;
  },
  async createSuperUser({ dispatch }, pwd) {
    const res = await addSuperUser(pwd);
    return res;
  },
  async getAllRoles({ dispatch }) {
    const data = await getAllRoles();
    return data;
  },
  async addRole({ dispatch }, form) {
    const res = await addRole(form);
    return res;
  },
  async getRole({ dispatch }, name) {
    const res = await getRole(name);
    return res;
  },
  async editRole({ dispatch }, data) {
    const res = await editRole(data);
    return res;
  },
  async delRole({ dispatch }, name) {
    const res = await delRole(name);
    return res;
  },
  async editPwd({ dispatch }, data) {
    const res = await editPwd(data);
    return res;
  },
  resetAccessToken({ commit }) {
    commit('setPermissions', []);
    commit('setAccessToken', '');
    removeAccessToken();
  },
};
export default { state, actions, getters, mutations };
