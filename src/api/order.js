import request from '@/utils/request.js';
export const getOrderData = async () => {
  return request({
    url: '/getOrderData',
    method: 'get',
  });
};
export const getOrderStatus = async () => {
  return request({
    url: '/order/status',
    method: 'get',
  });
};
export const getOrderAccount = async () => {
  return request({
    url: '/order/accounts',
    method: 'get',
  });
};
export const getOrderQuery = async (data) => {
  return request({
    url: '/order/query',
    method: 'post',
    data
  });
};
