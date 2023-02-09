import { getOrderData, getOrderStatus, getOrderAccount, getOrderQuery } from '@/api/order';

const actions = {
  async getOrderData({ dispatch }) {
    // const data = await getOrderData();
    const data = [
      {
        biz_id: 'BB2',
        domain: 'Manufacturing',
        udt: '2022-12-31',
        total_price: 85.89,
        status: 'Failed',
        account: 'Jane Doe',
      },
      {
        biz_id: 'AA1',
        domain: 'Healthcare',
        udt: '2022-12-31',
        total_price: 55.45,
        status: 'Failed',
        account: 'Jane Doe',
      },
      {
        biz_id: 'A1',
        domain: 'Services',
        udt: '2022-12-31',
        total_price: 71.3,
        status: 'Pending',
        account: 'Charlie Brown',
      },
      {
        biz_id: 'B2',
        domain: 'Healthcare',
        udt: '2022-12-31',
        total_price: 73.33,
        status: 'Pending',
        account: 'Alice Johnson',
      },
      {
        biz_id: 'A1',
        domain: 'Manufacturing',
        udt: '2022-12-31',
        total_price: 83.67,
        status: 'Failed',
        account: 'Jane Doe',
      },
      {
        biz_id: 'DB2',
        domain: 'Services',
        udt: '2022-12-31',
        total_price: 52.82,
        status: 'Pending',
        account: 'Alice Johnson',
      },
      {
        biz_id: 'B2',
        domain: 'Services',
        udt: '2022-12-31',
        total_price: 10.66,
        status: 'Failed',
        account: 'John Doe',
      },
      {
        biz_id: 'D4',
        domain: 'Finance',
        udt: '2022-12-31',
        total_price: 17.53,
        status: 'Pending',
        account: 'Bob Smith',
      },
      {
        biz_id: 'AC1',
        domain: 'Finance',
        udt: '2022-12-31',
        total_price: 23.07,
        status: 'Success',
        account: 'Bob Smith',
      },
      {
        biz_id: 'E5',
        domain: 'Finance',
        udt: '2022-12-31',
        total_price: 71.45,
        status: 'Success',
        account: 'Bob Smith',
      },
    ];
    return data;
  },
  async getOrderStatus({ dispatch }) {
    const data = await getOrderStatus();
    return data;
  },
  async getOrderAccount({ dispatch }) {
    const data = await getOrderAccount();
    return data;
  },
  async getOrderQuery({ dispatch }, query) {
    const data = await getOrderQuery(query);
    return data;
  },
};
export default { actions };
