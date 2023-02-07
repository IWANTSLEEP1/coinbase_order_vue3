import request from '@/utils/request.js';
import { setting } from '@/config/setting';
const { tokenName } = setting;
export const login = async (data) => {
  const fd = new FormData();
  fd.append('username', data['form']['name']);
  fd.append('password', data['form']['password']);
  return request({
    url: 'auth/login?captcha=' + data['captcha'] + '&code_id=' + data['code_id'],
    method: 'post',
    data: fd,
  });
};

export const getUserInfo = (accessToken) => {
  return request({
    url: '/userInfo',
    method: 'get',
    data: {
      [tokenName]: accessToken,
    },
  });
};

export const captcha = async () => {
  return request({
    url: '/auth/gen_captcha',
    method: 'get',
  });
};

export const signIn = async () => {
  return request({
    url: '/sign_in',
    method: 'get',
  });
};

// 获取全部用户信息
export const getAllUsers = () => {
  return request({
    url: '/admin/all',
    method: 'get',
  });
};

//获取全部的角色信息
export const getAllRoles = () => {
  return request({
    url: '/admin/roles',
    method: 'get',
  });
};

// 添加管理员用户
export const addUser = async (data) => {
  return request({
    url: '/admin/add',
    method: 'post',
    data,
  });
};

// 创建超级管理员用户
export const addSuperUser = async (pwd) => {
  return request({
    url: '/create_super_user?password=' + pwd,
    method: 'post',
  });
};

// 获取单一用户
export const getUser = async (email) => {
  return request({
    url: '/admin/' + email,
    method: 'get',
  });
};
// 修改用户
export const editUser = async (data) => {
  return request({
    url: '/admin/' + data['email'],
    method: 'post',
    data,
  });
};
//删除用户
export const deleteUser = async (email) => {
  return request({
    url: '/admin/' + email,
    method: 'delete',
  });
};
//添加角色
export const addRole = async (data) => {
  return request({
    url: '/admin/role',
    method: 'post',
    data,
  });
};
//获取单个角色
export const getRole = async (name) => {
  return request({
    url: '/admin/role/' + name,
    method: 'get',
  });
};
//修改单个角色
export const editRole = async (data) => {
  return request({
    url: '/admin/role/' + data['name'],
    method: 'post',
    data,
  });
};
//删除单个角色
export const delRole = async (name) => {
  return request({
    url: '/admin/role/' + name,
    method: 'delete',
  });
};

//修改密码
export const editPwd = async (data) => {
  return request({
    url: '/admin/user/' + data['name'],
    method: 'post',
    data: {
      old: data['old'],
      new: data['new'],
      confirm: data['confirm'],
    },
  });
};
