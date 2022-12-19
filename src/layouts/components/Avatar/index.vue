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
        <el-dropdown-item command="editpwd">{{ t('navbar.editPwd') }}</el-dropdown-item>
        <el-dropdown-item command="logout" divided>{{ t('navbar.logOut') }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

   <el-dialog v-model="dialogFormVisible" :title="t('navbar.editPwd')"  width="20%" center @close="dialogClose">
    <el-form :model="ruleForm" :rules="rules" ref="validateForm">
      <el-form-item label="Password1" :label-width="formLabelWidth" prop="password">
        <el-input v-model.trim="ruleForm.password1" autocomplete="off" :placeholder="t('navbar.pwd')" />
      </el-form-item>
       <el-form-item label="Password2" :label-width="formLabelWidth" prop="password">
        <el-input v-model.trim="ruleForm.password2" autocomplete="off" :placeholder="t('navbar.pwd_agin')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="summit">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script>
  export default {
    name: 'Avatar',
  };
</script>

<script setup>
  import { ref ,reactive,toRefs} from 'vue';
  import { useStore } from 'vuex';
  import { ElMessageBox } from 'element-plus';
  import { setting } from '@/config/setting';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';

  const { title, recordRoute } = setting;
  const { t } = useI18n();
  const user = localStorage.username
  const avatar = ref('https://i.gtimg.cn/club/item/face/img/2/15922_100.gif');
  const userName = ref(user);
  const store = useStore();
  const router = useRouter();
  const state = reactive({
       dialogFormVisible:false,
       ruleForm: {
         password1:"",
         password2:"",
       },
  })
  
  if(user==undefined){
       router.push('/login');
    }

  defineProps({
    color: {
      type: String,
      default: '#666',
    },
  });

  const handleCommand = (command) => {
    switch (command) {
      case 'logout':
        handleLogout();
        break;
      case 'editpwd':
         handleEditPwd();;
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    ElMessageBox.confirm(`${t('confirm.msg')}${title}？`, t('confirm.title'), {
      confirmButtonText: t('btn.confirm'),
      cancelButtonText: t('btn.cancel'),
      dangerouslyUseHTMLString: true,
      type: 'warning',
    })
      .then(async () => {
        await store.dispatch('user/logout');
         router.push('/login');
        // if (recordRoute) {
        //   const { fullPath } = router.currentRoute._value;
        //   location.replace('/login');
        // } else {
        //   router.push('/login');
        // }
      })
      .catch(() => {});
  };

  const handleEditPwd = () => {
    state.dialogFormVisible=true
    console.log(state.dialogFormVisible)
 };

  const dialogClose = () => {
    state.dialogFormVisible=false
    state.validateForm.resetFields()
  }

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
