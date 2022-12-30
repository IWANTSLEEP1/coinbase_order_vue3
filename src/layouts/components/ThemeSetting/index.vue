<template>
  <el-drawer
    :title="主题设置"
    v-model="settings.isDrawerSetting"
    :direction="direction"
    :before-close="handleClose"
    destroy-on-close
    :size="320"
  >
    <div class="theme-wrapper">
      <el-scrollbar height="85vh">
        <div class="form">
          <el-form label-width="100px" label-position="left">
            <el-form-item :label="布局">
              <el-select
                class="theme-select-width"
                v-model="settings.mode"
                size="small"
                placeholder="请选择"
                @change="handleChangeMode"
              >
                <el-option
                  v-for="item in setting.modeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item :label="主题">
              <el-select
                class="theme-select-width"
                v-model="settings.theme"
                size="small"
                placeholder="请选择"
                @change="handleChangeTheme"
              >
                <el-option
                  v-for="item in setting.colorOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="Logo">
              <el-switch v-model="settings.isLogo" />
            </el-form-item>
            <el-form-item :label="标签">
              <el-switch @change="handleChangeTag" v-model="setting.tag" />
            </el-form-item>
            <el-form-item :label="面包导航">
              <el-switch
                :disabled="settings.mode === 'horizontal'"
                @change="handleChangeBread"
                v-model="setting.isBreadcrumb"
              />
            </el-form-item>
            <el-form-item :label="固定头部">
              <el-switch :disabled="isMobile" v-model="settings.fixedHead" />
            </el-form-item>
            <el-form-item :label="全屏">
              <el-switch v-model="settings.fullScreen" />
            </el-form-item>
            <el-form-item :label="刷新">
              <el-switch v-model="settings.refresh" />
            </el-form-item>
            <el-form-item :label="通知">
              <el-switch v-model="settings.notice" />
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
    <template #footer>
      <div class="drawer-footer">
        <el-button size="small">恢复默认</el-button>
        <el-button type="primary" size="small" @click="handleToSave">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script>
  export default {
    name: 'ThemeSetting',
  };
</script>

<script setup>
  import { ref, reactive, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import { themeConfig } from '@/config/theme';

  const { themeOptions } = themeConfig;

  const store = useStore();

  const setting = reactive({
    tag: true,
    chalk: '',
    isLogo: true,
    mode: 'vertical',
    isBreadcrumb: true,
    fixedHead: true,
    fullscreen: true,
    refresh: true,
    notice: true,
    modeOption: [
      {
        value: 'vertical',
        label: '纵向',
      },
      {
        value: 'horizontal',
        label: '横向',
      },
    ],
    colorOptions: [
      {
        value: 'theme1',
        label: '蓝白',
      },
      {
        value: 'theme2',
        label: '蓝黑',
      },
      {
        value: 'theme3',
        label: '绿白',
      },
      {
        value: 'theme4',
        label: '绿黑',
      },
      {
        value: 'theme5',
        label: '红白',
      },
      {
        value: 'theme6',
        label:'红黑',
      },
    ],
  });

  const direction = ref('rtl');

  const settings = computed(() => {
    return store.getters['setting/settings'];
  });

  const isMobile = computed(() => {
    return store.getters['setting/isMobile'];
  });

  const handleToSave = () => {
    store.dispatch('setting/setSettingOptions', settings);
    store.dispatch('setting/setSettingDrawer', false);
  };

  const handleChangeTag = (val) => {
    store.dispatch('setting/setTag', val);
  };

  const handleChangeBread = (val) => {
    store.dispatch('setting/setBreadcrumb', val);
  };

  const handleChangeMode = (val) => {
    store.dispatch('setting/setSettingOptions', settings);
    store.dispatch('setting/setMode', val);
  };

  const handleChangeTheme = (val) => {
    store.dispatch('setting/setTheme', val);
  };

  const handleClose = () => {
    store.dispatch('setting/setSettingDrawer', false);
  };
</script>

<style lang="scss" scoped>
  .theme-wrapper {
    display: flex;
    flex-direction: column;
    height: $base-height;
    .form {
      flex: 1;
    }
    :deep(.el-form-item__content) {
      text-align: right;
    }
    .theme-select-width {
      width: $base-select-width-small;
    }
  }
  .drawer-footer {
    box-sizing: border-box;
    align-content: center;
    justify-content: space-between;
    padding: 10px 0;
    background-color: $base-color-white;
    border-top: 1px solid $base-border-color;
  }
  :deep(.el-form-item__content) {
    justify-content: flex-end;
  }
</style>
