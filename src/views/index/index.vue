<template>
  <div class="index-conntainer">
    <div class="head-card">
      <div class="avatar">
        <el-avatar :size="50" :src="avatar"></el-avatar>
      </div>
      <div class="head-card-content">
        <h2 class="title">{{ sayHi }}! {{ userName }}, 开始您一天的工作吧！</h2>
        <p class="desc"></p>
      </div>
    </div>
    <div class="content">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
          <el-card class="card" shadow="hover">
            <Echarts
              title="订单金额月统计图"
              :index="1"
              headerIcon="icon-chart-line"
              :style="{
                height: '350px',
              }"
              :options="orderMonthOptions"
            />
          </el-card>

          <Echarts
            title="订单状态月统计图"
            :index="3"
            headerIcon="icon-chart-line"
            :style="{
              height: '350px',
            }"
            :options="orderStatusOptions"
          />
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <el-card class="card" shadow="hover">
            <template #header>
              <h3 class="title">订单清单</h3>
            </template>
            <div class="count-box">
              <div class="item" v-for="(item, index) in state.orderList" :key="index">
                <span class="label">{{ item.key }}</span>
                <CountTo
                  class="count"
                  :class="item.status"
                  :startVal="0"
                  :endVal="item.value"
                  :duration="3000"
                ></CountTo>
              </div>
            </div>
          </el-card>
          <el-card class="card" shadow="hover">
            <Echarts
              title="订单金额周统计图"
              :index="2"
              headerIcon="icon-chart-line"
              :style="{
                height: '300px',
              }"
              :options="orderWeekOptions"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
  };
</script>

<script setup>
  import { ref, computed, reactive, onMounted } from 'vue';
  import { CountTo } from 'vue3-count-to';
  import Echarts from '@/components/Echarts/index.vue';
  import { useStore } from 'vuex';
  const store = useStore();
  const user = localStorage.username;
  const userName = ref(user);
  const orderMonthOptions = reactive({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: { top: -0 },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        data: [],
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '每日订单数',
        position: 'right',
        min:0,
        max:50,
        axisLabel: {
          formatter: '{value}',
        },
      },
      {
        type: 'value',
        name: '每日订单总额',
        position: 'left',
        min:0,
        max:1000,
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '每日订单数',
        type: 'bar',
        yAxisIndex: 0,
        data: [],
      },
      {
        name: '每日订单总额',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: [],
      },
    ],
  });
  const orderWeekOptions = reactive({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: { top: -6 },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        data: [],
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '每日订单数',
        position: 'right',
        min:0,
        max:100,
        axisLabel: {
          formatter: '{value}',
        },
      },
      {
        type: 'value',
        name: '每日订单总额',
        min:0,
        max:1000,
        position: 'left',
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '每日订单数',
        type: 'bar',
        yAxisIndex: 0,
        data: [],
      },
      {
        name: '每日订单总额',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: [],
      },
    ],
  });
  const orderStatusOptions = reactive({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    yAxis: {
      type: 'value',
      min:0,
      max:100,
    },
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true,
      },
      data: [],
    },
    series: [],
  });
  const state = reactive({
    orderList: [],
  });
  const hour = new Date().getHours();
  const thisTime =
    hour < 8
      ? '早上好'
      : hour <= 11
      ? '上午好'
      : hour <= 13
      ? '中午好'
      : hour < 18
      ? '下午好'
      : '晚上好';
  const sayHi = ref(thisTime);
  const avatar = ref('https://i.gtimg.cn/club/item/face/img/2/15922_100.gif');

  const isMobile = computed(() => {
    return store.getters['setting/isMobile'];
  });
  const onGetOrderPanelData = async () => {
    store.dispatch('index/getOrderPanelData').then((res) => {
      state.orderList = res.data;
    });
  };
  const onGetOrderMonth = async () => {
    store.dispatch('index/getOrderAmountMonthlyData').then((res) => {
      orderMonthOptions.xAxis[0].data = res.data[0];
      orderMonthOptions.series[0].data = res.data[1];
      orderMonthOptions.series[1].data = res.data[2];
    });
  };
  const onGetOrderWeek = async () => {
    store.dispatch('index/getOrderAmountWeekData').then((res) => {
      orderWeekOptions.xAxis[0].data = res.data[0];
      orderWeekOptions.series[0].data = res.data[1];
      orderWeekOptions.series[1].data = res.data[2];
    });
  };
  const onGetOrderStatus = async () => {
    store.dispatch('index/getOrderStatusMonthData').then((res) => {
      orderStatusOptions.xAxis.data = res.data.date;
      delete res.data.date
      const keys = Object.keys(res.data);
      keys.forEach((key) => {
        const vaule = {
          name: '',
          type: 'bar',
          stack: 'total',
          label: {
            show: false,
          },
          emphasis: {
            focus: 'series',
          },
          data: [],
        };
        vaule.name=key
        vaule.data=res.data[key]
        orderStatusOptions.series.push(vaule)
        console.log(orderStatusOptions,12321)
      });
    });
  };
  onMounted(async () => {
    await onGetOrderPanelData();
    await onGetOrderMonth();
    await onGetOrderWeek();
    await onGetOrderStatus();
  });
</script>

<style lang="scss" scoped>
  .index-conntainer {
    width: $base-width;
    .head-card {
      display: flex;
      align-items: center;
      padding: $base-main-padding;
      background-color: $base-color-white;
      &-content {
        padding-left: 15px;
        .desc {
          color: $base-font-color;
        }
      }
    }
    .content {
      margin: 15px 0;
      .count-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item {
          display: flex;
          flex-direction: column;
          text-align: center;
          .label {
            padding: 10px 0;
            font-size: $base-font-size-big;
          }
          .count {
            font-size: $base-font-size-max;
            font-weight: bolder;
            color: $base-color-primary;
            &.error {
              color: var(--el-color-danger);
            }
            &.success {
              color: var(--el-color-success);
            }
          }
        }
      }
      .title {
        margin: 0;
      }
      .skill-title {
        padding: 10px 0;
        font-weight: 500;
      }
      .card {
        margin-bottom: 15px;
        &-body {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          &.mobile {
            grid-template-columns: repeat(1, 1fr);
          }
          .item {
            box-sizing: border-box;
            padding: 10px 20px;
            margin-top: -1px;
            margin-left: -1px;
            overflow: hidden;
            cursor: pointer;
            border: 1px solid black;
            border: 1px solid #eee;
            transition: box-shadow 0.5;
            .lf {
              display: flex;
              align-items: center;
              max-width: 140px;
              .img {
                width: auto;
                max-width: 120px;
                height: auto;
                max-height: 40px;
              }
            }
            &:hover {
              box-shadow: $base-box-shadow;
            }
            .title {
              padding-left: 5px;
              font-size: 18px;
              font-weight: bold;
            }
            .desc {
              padding: 5px 0;
              font-size: 13px;
              line-height: 1.5;
              color: $base-font-color;
            }
          }
        }
      }
    }
  }
</style>
