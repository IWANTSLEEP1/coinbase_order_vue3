<template>
  <el-dropdown @command="handleCommand">
    <span class="avatar-dropdown" :style="{ color }">
      <!--<el-avatar class="user-avatar" :src="avatar"></el-avatar>-->
      <img class="user-avatar" :src="avatar" alt="" />
      <div class="user-name">
        {{ userName }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="editpwd">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <el-dialog v-model="dialogFormVisible" title="修改密码" width="30%" center>
    <el-form :model="ruleForm" :rules="rules" ref="validateForm">
      <el-form-item label="Old Password" :label-width="formLabelWidth" prop="oldPwd">
        <el-input
          v-model.trim="ruleForm.oldPwd"
          autocomplete="off"
          :placeholder="请输入原密码"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item label="New Password" :label-width="formLabelWidth" prop="newPwd">
        <el-input
          v-model.trim="ruleForm.newPwd"
          autocomplete="off"
          :placeholder="请输入要修改的密码"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item label="New Password" :label-width="formLabelWidth" prop="confirmPwd">
        <el-input
          v-model.trim="ruleForm.confirmPwd"
          autocomplete="off"
          :placeholder="请确认密码"
          type="password"
          show-password
           @keyup.enter="summit"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="summit"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>



<script>
import { ref, reactive, toRefs, unref } from 'vue';
import { useStore } from 'vuex';
import { ElMessageBox,ElMessage} from 'element-plus';
import { setting } from '@/config/setting';
import { useRouter } from 'vue-router';
export default {
  name: 'Avatar',
  setup() {
    const { title } = setting;
    const formLabelWidth = '140px';
    const user = localStorage.username;
    const avatar = ref('https://i.gtimg.cn/club/item/face/img/2/15922_100.gif');
    const userName = ref(user);
    const validateForm = ref(null);
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      dialogFormVisible: false,
      ruleForm: {
        oldPwd:"",
        newPwd: '',
        confirmPwd: '',
      },
      rules: {
        oldPwd: [{ required: true, message: '请输入要修改的密码', trigger: 'blur' }],
        newPwd: [
          { required: true, message: '请输入要修改的密码', trigger: 'blur' },
          {pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/,
           message: '密码过于简单(至少8个字符,至少1个字母,1个数字和1个特殊字符)', trigger: 'blur'}
        ],
        confirmPwd:[{
           required: true, message: '请确认密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== state.ruleForm.newPwd) {
                callback(new Error('两次密码不匹配，请重新输入'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },]
      },
    });

    if (user == undefined) {
      router.push('/login');
    }

    const handleCommand = (command) => {
      switch (command) {
        case 'logout':
          handleLogout();
          break;
        case 'editpwd':
          handleEditPwd();
          break;
        default:
          break;
      }
    };

    const handleLogout = () => {
      ElMessageBox.confirm(`${"您确定要退出"}${title}？`, '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }).then(() => {
          sessionStorage.clear();
          localStorage.clear();
          router.push('/login');
        })
        .catch(() => {});
    };

    const handleEditPwd = () => {
      state.dialogFormVisible = true;
    };

    const summit = async () => {
      const form = unref(validateForm);
      if (!form) return;
      await form.validate((valid) => {
        if (valid) {
          store.dispatch('user/editPwd', {
            "name":user,
            "old":state.ruleForm.oldPwd,
            "new":state.ruleForm.newPwd,
            "confirm":state.ruleForm.confirmPwd,
          }).then(async () => {
            state.dialogFormVisible = false;
            ElMessage({
              type: 'success',
              message: '修改成功，请重新登录',
            });
            await store.dispatch('user/logout');
            router.push('/login');
          });
        }
      });
    };
    return {
      ...toRefs(state),
      validateForm,
      formLabelWidth,
      handleCommand,
      handleLogout,
      avatar,
      userName,
      summit,
    };
  },
};
</script>

<style lang="scss" scoped>
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: $base-avatar-dropdown-height;
  padding: $base-padding-10;
  .user-avatar {
    width: $base-avatar-widht;
    height: $base-avatar-height;
    cursor: pointer;
    border-radius: $base-border-radius-circle;
  }

  .user-name {
    position: relative;
    margin-left: $base-margin-5;
    margin-left: $base-margin-5;
    cursor: pointer;
  }
}
</style>
