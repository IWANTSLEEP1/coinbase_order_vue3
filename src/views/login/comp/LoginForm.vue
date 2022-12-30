<template>
  <el-form :model="ruleForm" :rules="rules" ref="validateForm" class="login-ruleForm">
    <el-form-item prop="name">
      <el-input :placeholder="请输入用户名" v-model.trim="ruleForm.name">
        <template #prefix>
          <icon-user theme="outline" size="16" fill="#999" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        :placeholder="请输入密码"
        type="password"
        v-model.trim="ruleForm.password"
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
            :placeholder="请输入验证码"
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
      <el-button type="primary" :loading="loading" class="login-btn" round @click="handleLogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { reactive, toRefs, ref, unref, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { ElMessage} from 'element-plus';
  export default {
    setup() {
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
          name: [{ required: true, message: "请输入用户名", trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
        },

      });
      
      store
        .dispatch('user/signIn')
        .then((res) => {
          if(res.code==307){
            ElMessage({
                type: 'success',
                message: res.message,
            });
            router.push('/superuser')
            return
          }
        }).catch((err) => {});  

      store
        .dispatch('user/captcha')
        .then((res) => {
          state.code_id=res
          state.captcha_img = "/auth/get_captcha?code_id=" + state.code_id
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
                   sessionStorage.clear();
                  localStorage.clear();
                  localStorage.token = res.data[0].access_token;
                  localStorage.username = res.data[0].username;
                  state.redirect === '/404' || state.redirect === '/401' ? '/' : state.redirect;
                  router.push('/').catch((err) => {console.log('router err', err)});
                  state.loading = false;
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
          state.captcha_img = "/auth/get_captcha?code_id=" + state.code_id
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
