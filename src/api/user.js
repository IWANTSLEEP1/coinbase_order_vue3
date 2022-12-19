import request from '@/utils/request.js';
import { setting } from '@/config/setting';
const { tokenName } = setting;
export const login = async (data) => {
  return request({
    url: 'user/login?captcha=' + data["captcha"] + '&code_id=' + data["code_id"],
    method: 'post',
    data:{
      "username":data['form']['name'],
      "password":data["form"]["password"]
    },
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


// export const logout = () => {
//   return request({
//     url: '/logout',
//     method: 'post',
//   });
// };

export const register = async () => {
  return request({
    url: '/register',
    method: 'post',
  });
};

export const captcha = async () => {
  return request({
    url: '/user/gen_captcha'
  });
};

// 获取全部用户信息
export const getAllUsers = () => {
  return request({
    url: '/user/all',
    method: 'get',
  });
};

//获取全部的角色信息
export const getAllRoles = () => {
  return request({
    url: '/user/roles',
    method: 'get',
  });
};

// 添加管理员用户
export const addUser = async (data) => {
  if (data["role"] == ""){
     delete data['role']
  }
  return request({
    url: '/user/add',
    method: 'post',
    data
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
export const getUser = async(email) => {
  return request({
    url: '/user/'+email,
    method: 'get',
  });
};
// 修改用户
export const editUser = async(data) => {
  if (data["role"] == ""){
    delete data['role']
 }
  return request({
    url: '/user/'+data['email'],
    method: 'post',
    data
  });
};
//删除用户
export const deleteUser = async(email) => {
  return request({
    url: '/user/'+email,
    method: 'delete',
  });
};