<template>
  <div style="width:35%;position: absolute;top: 40%;left: 50%;transform: translate(-50%, -50%);" >
  <img src="@/assets/imgs/Coinbase1.jpg" style="width:25%;margin-left:200px;margin-bottom: 10px;">
    <el-form :model="ruleForm" :rules="rules" ref="validateForm" class="login-ruleForm">
      <el-form-item prop="password" label="Password">
        <el-input
          :placeholder="t('login.password')"
          type="password"
          v-model.trim="ruleForm.password"
          show-password
          style="width:100%"
        >
          <template #prefix>
            <icon-lock theme="outline" size="16" fill="#999" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain :loading="loading" class="login-btn" round @click="handleLogin">{{
          t('login.loginBtn')
        }}</el-button>
      </el-form-item>
  </el-form>
  </div>
</template>

<script>
  import { reactive, toRefs, ref, unref, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { ElMessage, ElMessageBox } from 'element-plus';
  export default {
    setup() {
      const { t } = useI18n();
      const store = useStore();
      const router = useRouter();
      const validateForm = ref(null);
      const state = reactive({
        ruleForm: {
          password: '',
        },
        loading: false,
        redirect: undefined,
        captcha_img:"",
        code_id:"",
        rules: {
          password: [{ required: true, message: t('login.rules.password'), trigger: 'blur' }],
        },
      });

      const handleLogin = async () => {
        const form = unref(validateForm);
        if (!form) return;
        await form.validate((valid) => {
          if (valid) {
            state.valid = true;
            state.loading = true;
            store
              .dispatch('user/createSuperUser',state.ruleForm.password)
              .then(() => {
                // 创建成功
                ElMessage({
                  type: 'success',
                  message: 'Success',
                });
                router.push('/login');
                state.loading = false;
              })
              .catch(() => {
                state.loading = false;
              });
          }
        });
      };
      return {
        ...toRefs(state),
        validateForm,
        handleLogin,
        t,
      };
    },
  };
</script>
<style lang="scss" scoped>
  .login-ruleForm {
    margin-top: 1rem;
    :deep(.el-input__prefix) {
      top: 2px;
      padding: 0 4px;
    }
    .login-methods {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .login-btn {
      width: 100%;
      margin-top: 10px;
    }
    .login-check {
      width: 100%;
      display: flex;
      align-content: center;
      justify-content: space-between;
    }
  }
</style>
