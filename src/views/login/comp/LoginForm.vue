<template>
  <el-form :model="ruleForm" :rules="rules" ref="validateForm" class="login-ruleForm">
    <el-form-item prop="name">
      <el-input :placeholder="t('login.username')" v-model.trim="ruleForm.name">
        <template #prefix>
          <icon-user theme="outline" size="16" fill="#999" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        :placeholder="t('login.password')"
        type="password"
        v-model.trim="ruleForm.password"
        show-password
      >
        <template #prefix>
          <icon-lock theme="outline" size="16" fill="#999" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="captcha">
      <el-input
            type="text"
            v-model.trim="ruleForm.captcha"
            autocomplete="off"
            :placeholder="t('login.captcha')"
            @keyup.enter="handleLogin"
          >
            <template #append>
              <img
                :src="captcha_img"
                @click="refreshCaptcha"
                style="width: 100px; height: 30px"
              />
            </template>
        </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" class="login-btn" round @click="handleLogin">{{
        t('login.loginBtn')
      }}</el-button>
    </el-form-item>
    <el-divider>{{ t('login.thirdparty') }}</el-divider>
    <el-form-item>
      <div class="login-methods">
        <icon-wechat theme="outline" size="24" fill="#333" />
        <icon-alipay theme="outline" size="24" fill="#333" />
        <icon-github theme="outline" size="24" fill="#333" />
        <icon-twitter theme="outline" size="24" fill="#333" />
        <icon-google theme="outline" size="24" fill="#333" />
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
  import { reactive, toRefs, ref, unref, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  export default {


    setup() {
      const { t } = useI18n();
      const store = useStore();
      const router = useRouter();
      const validateForm = ref(null);
      const state = reactive({
        ruleForm: {
          name: '',
          password: '',
        },
        loading: false,
        redirect: undefined,
        captcha_img:"",
        code_id:"",
        rules: {
          name: [{ required: true, message: t('login.rules.username'), trigger: 'blur' }],
          password: [{ required: true, message: t('login.rules.password'), trigger: 'blur' }],
          captcha: [{ required: true, message: t('login.rules.captcha'), trigger: 'blur' }]
        },

      });

      store
        .dispatch('user/captcha')
        .then((res) => {
          state.code_id=res
          state.captcha_img = "/api/user/get_captcha?code_id=" + state.code_id
        })
        .catch((err) => {
          state.loading = false;
        });
      
      watch(
        () => router.currentRoute,
        ({ _value }) => {
          const route = _value;
          state.redirect = (route.query && route.query.redirect) || '/';
        },
        {
          immediate: true,
        }
      );

      const handleLogin = async () => {
        const form = unref(validateForm);
        if (!form) return;
        await form.validate((valid) => {
          if (valid) {
            state.valid = true;
            state.loading = true;
            store
              .dispatch('user/login',{
              "captcha":state.ruleForm.captcha,
              "code_id":state.code_id,
              "form":state.ruleForm
            })
              .then((res) => {
                // 存储用户登录信息
                if (res.code==307){
                  router.push('/superuser')
                  return
                }else{
                   sessionStorage.clear();
                  localStorage.clear();
                  localStorage.token = res.accessToken;
                  localStorage.username = res.username;
                  // localStorage.email = res.email;
                  state.redirect === '/404' || state.redirect === '/401' ? '/' : state.redirect;
                  router.push('/').catch((err) => {console.log('router err', err)});
                  state.loading = false;
                }
              })
              .catch(() => {
                state.loading = false;
              });
          }
        });
      };
      const refreshCaptcha = async()=>{
         store
        .dispatch('user/captcha')
        .then((res) => {
          state.code_id=res
          state.captcha_img = "/api/user/get_captcha?code_id=" + state.code_id
        })
        .catch((err) => {
          state.loading = false;
        });
      }

      return {
        ...toRefs(state),
        validateForm,
        handleLogin,
        refreshCaptcha,
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
    }
    .login-check {
      width: 100%;
      display: flex;
      align-content: center;
      justify-content: space-between;
    }
  }
</style>
