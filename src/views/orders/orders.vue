<template>
  <el-button type="primary" :icon="Search" size="large" @click="centerDialogVisible = true"
    >筛选</el-button
  >
  <el-table :data="tableData" border stript style="width: 100%; margin-top: 5px" :loading="loading">
    <el-table-column label="#" align="center" type="index" />
    <el-table-column prop="biz_id" label="订单编号" align="center" />
    <el-table-column prop="domain" label="订单域名" align="center" />
    <el-table-column prop="udt" label="订单时间" align="center" />
    <el-table-column prop="total_price" label="订单金额" align="center" />
    <el-table-column prop="status" label="订单状态" align="center" />
    <el-table-column prop="account" label="D站账号" align="center" />
  </el-table>
  <div
    class="text-center"
    style="display: flex; justify-content: center; align-items: center,background-color: white;"
  >
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[50, 100, 150, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="totals"
    />
  </div>
  <el-dialog v-model="centerDialogVisible" title="筛选订单" width="30%" center>
    <el-form :model="filterForm">
      <el-form-item label="时间：" :label-width="formLabelWidth">
        <div class="block">
          <el-date-picker
            v-model="times"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </div>
      </el-form-item>
      <el-form-item label="订单id：" :label-width="formLabelWidth">
        <el-input
          v-model="filterForm.order_id"
          class="w-50 m-2"
          placeholder="输入订单id"
          :prefix-icon="Search"
          style="width: 87%"
        />
      </el-form-item>
      <el-form-item label="域名：" :label-width="formLabelWidth">
        <el-input
          v-model="filterForm.domain"
          class="w-50 m-2"
          placeholder="输入域名"
          :prefix-icon="Search"
          style="width: 87%"
        />
      </el-form-item>
      <el-form-item label="D站账号：" :label-width="formLabelWidth">
        <el-select v-model="filterForm.account" clearable placeholder="Select">
          <el-option v-for="account in accounts" :key="account" :label="account" :value="account" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" :label-width="formLabelWidth">
        <el-select v-model="filterForm.status" clearable placeholder="Select">
          <el-option v-for="sta in status" :key="sta" :label="sta" :value="sta" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="summit"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { reactive, toRefs, ref, unref } from 'vue';
  import { useStore } from 'vuex';
  import { Search } from '@element-plus/icons-vue';
  export default {
    setup() {
      const store = useStore();
      const formLabelWidth = '100px';
      const centerDialogVisible = ref(false);
      const times = ref('');
      const state = reactive({
        filterForm: {
          time_gte: '',
          time_lte: '',
          order_id: '',
          domain: '',
          status: '',
          account: '',
        },
        tableData: [],
        status: [],
        accounts: [],
        loading: false,
      });
      const totals = ref(0);
      const currentPage = ref(1);
      const pageSize = ref(50);
      store
        .dispatch('order/getOrderData')
        .then((res) => {
          state.tableData = res;
        })
        .catch(() => {
          state.loading = false;
        });
      getAllStatus();
      function getAllStatus() {
        store.dispatch('order/getOrderStatus').then((res) => {
          state.status = res['data'];
        });
      }
      getAllAccount();
      function getAllAccount() {
        store.dispatch('order/getOrderAccount').then((res) => {
          state.accounts = res['data'];
        });
      }

      function formattedDate(date: Date) {
        if (date instanceof Date && !isNaN(date.getTime())) {
          return (
            date.getFullYear() +
            '-' +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            '-' +
            date.getDate().toString().padStart(2, '0')
          );
        } else {
          return '';
        }
      }
      const summit = async () => {
        if (state.filterForm.time_gte && state.filterForm.time_lte) {
          state.filterForm.time_gte = formattedDate(new Date(times.value[0]));
          state.filterForm.time_lte = formattedDate(new Date(times.value[1]));
        }
        store.dispatch('order/getOrderQuery', state.filterForm).then((res) => {
          state.tableData = res['data'];
        });
      };
      const handleSizeChange = (val: number) => {
        console.log(`${val} items per page`);
      };
      const handleCurrentChange = (val: number) => {
        console.log(`current page: ${val}`);
      };

      return {
        ...toRefs(state),
        formLabelWidth,
        Search,
        centerDialogVisible,
        summit,
        times,
        totals,
        handleSizeChange,
        handleCurrentChange,
        currentPage,
        pageSize,
      };
    },
  };
</script>
