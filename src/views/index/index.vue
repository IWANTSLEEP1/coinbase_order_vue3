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
          <Echarts
            title="订单金额月统计图"
            :index="1"
            headerIcon="icon-chart-line"
            :style="{
              height: '250px',
            }"
            :options="orderMonthOptions"
          />
          <el-card class="card" shadow="hover">
            <template #header>
              <h3 class="title">{{ orderMonthOptions }}</h3>
              <el-button @click="orderMonthOptions.series[1].data = [1, 2, 4, 89]">123</el-button>
            </template>
            <el-descriptions class="margin-top" :column="3" border>
              <el-descriptions-item v-for="(value, key) in packpage.dependencies" :key="key">
                <template #label>
                  {{ key }}
                </template>
                {{ value }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
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
  import packpage from '../../../package.json';
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
    legend: {},
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
        axisLabel: {
          formatter: '{value}',
        },
      },
      {
        type: 'value',
        name: '每日订单总额',
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
        // smooth: true,
        yAxisIndex: 1,
        data: [],
      },
    ],
  });
  const state = reactive({
    orderList: []
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
  const onGetOrderPanelData = () => {
    store.dispatch('index/getOrderPanelData').then((res) => {
      state.orderList = res;
    });
  };
  const onGetOrderMonth = () => {
    store.dispatch('index/getOrderAmountMonthlyData').then((res) => {
      orderMonthOptions.xAxis[0].data = res[0];
      orderMonthOptions.series[0].data = res[1];
      orderMonthOptions.series[1].data = res[2];
    });
  };
  onMounted(async () => {
    onGetOrderPanelData();
    onGetOrderMonth();
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
