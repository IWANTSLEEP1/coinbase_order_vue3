import { getOrderPanelData, getOrderAmountMonthlyData } from '@/api/index';

const actions = {
  async getOrderPanelData({ dispatch }) {
    // const data = await getOrderPanelData();
    const data = [
      {
        key: '每日成交总额',
        value: 3204,
        status: 'success',
      },
      {
        key: '每日成功订单数',
        value: 1817,
        status: 'error',
      },
    ];
    return data;
  },
  async getOrderAmountMonthlyData({ dispatch }) {
    // const data = await getOrderAmountMonthlyData();
    const data = [
      [
        "02-01",
        "02-02",
        "02-03",
        "02-04",
        "02-05",
        "02-06",
        "02-07",
        "02-08",
        "02-09",
        "02-10",
        "02-11",
        "02-12",
        "02-13",
        "02-14",
        "02-15",
        "02-16",
        "02-17",
        "02-18",
        "02-19",
        "02-20",
        "02-21",
        "02-22",
        "02-23",
        "02-24",
        "02-25",
        "02-26",
        "02-27",
        "02-28",
      ],
      [
        10, 20, 15, 25, 18, 12, 16, 22, 19, 14, 13, 17, 21, 16, 19, 11, 20, 18, 15, 22, 24, 21, 17,
        19, 14, 16, 18, 20,
      ],
      [
        1000, 2000, 1500, 2500, 1800, 1200, 1600, 2200, 1900, 1400, 1300, 1700, 2100, 1600, 1900,
        1100, 2000, 1800, 1500, 2200, 2400, 2100, 1700, 1900, 1400, 1600, 1800, 2000,
      ],
    ];
    return data;
  },
};
export default { actions };
