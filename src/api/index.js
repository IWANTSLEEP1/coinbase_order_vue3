import request from '@/utils/request.js';
export const getOrderPanelData = async () => {
  return request({
    url: '/getOrderPanelData',
    method: 'get',
  });
};

export const getOrderAmountMonthlyData = async () => {
  return request({
    url: '/getOrderAmountMonthlyData',
    method: 'get',
  });
};
