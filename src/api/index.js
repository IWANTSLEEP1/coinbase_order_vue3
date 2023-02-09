import request from '@/utils/request.js';
export const getOrderPanelData = async () => {
  return request({
    url: '/order/daily/info',
    method: 'get',
  });
};

export const getOrderAmountMonthlyData = async () => {
  return request({
    url: '/order/monthly/sum',
    method: 'get',
  });
};

export const getOrderAmountWeekData = async () => {
  return request({
    url: '/order/weekly/sum',
    method: 'get',
  });
};

export const getOrderstatustMonthData = async () => {
  return request({
    url: '/order/monthly/status',
    method: 'get',
  });
};
