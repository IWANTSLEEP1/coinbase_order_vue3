import {
  getOrderPanelData,
  getOrderAmountMonthlyData,
  getOrderAmountWeekData,
  getOrderstatustMonthData,
} from '@/api/index';

const actions = {
  async getOrderPanelData({ dispatch }) {
    const data = await getOrderPanelData();
    return data;
  },
  async getOrderAmountMonthlyData({ dispatch }) {
    const data = await getOrderAmountWeekData();
    return data;
  },
  async getOrderAmountWeekData({ dispatch }) {
    const data = await getOrderAmountMonthlyData();
    return data;
  },
  async getOrderStatusMonthData({ dispatch }) {
    const data = await getOrderstatustMonthData();
    return data;
  },
};
export default { actions };
