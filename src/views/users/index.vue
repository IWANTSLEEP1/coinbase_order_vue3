<template>
  <el-button type="primary" @click="addUser">Add User</el-button>
  <el-table
    :data="tableData"
    style="width: 100%; margin-top: 5px"
    :loading="loading"
    :stripe="true"
  >
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="mobile" label="Mobile" />
    <el-table-column prop="email" label="Email" />
    <el-table-column prop="role" label="Role" />
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button type="primary" @click="handleEdit(scope.row.email)">Edit</el-button>
        <el-button type="danger" @click="handleDelete(scope.row.email)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="dialogFormVisible"
    :title="isAdd ? 'Add User' : 'Edit User'"
    width="35%"
    center
    @close="dialogClose"
  >
    <el-form :model="ruleForm" :rules="rules" ref="validateForm">
      <el-form-item label="Username" :label-width="formLabelWidth" prop="name">
        <el-input
          v-model.trim="ruleForm.name"
          autocomplete="off"
          :placeholder="t('user.rules.username')"
        />
      </el-form-item>
      <el-form-item label="Password" :label-width="formLabelWidth" prop="password">
        <el-input
          v-model.trim="ruleForm.password"
          autocomplete="off"
          :placeholder="t('user.rules.password')"
        />
      </el-form-item>
      <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
        <el-input
          v-model.trim="ruleForm.email"
          autocomplete="off"
          :placeholder="t('user.rules.email')"
          :disabled="isAdd ? false : true"
        />
      </el-form-item>
      <el-form-item label="Mobile" :label-width="formLabelWidth" prop="mobile">
        <el-input
          v-model.trim="ruleForm.mobile"
          autocomplete="off"
          :placeholder="t('user.rules.mobile')"
        />
      </el-form-item>
      <el-form-item label="Is Robot" :label-width="formLabelWidth">
        <el-radio-group v-model="ruleForm.is_robot">
          <el-radio-button label="1">YES</el-radio-button>
          <el-radio-button label="0">NO</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Is Superuser" :label-width="formLabelWidth">
        <el-radio-group v-model="ruleForm.is_superuser" :disabled="isAdd ? false : true">
          <el-radio-button label="1">YES</el-radio-button>
          <el-radio-button label="0">NO</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Role" :label-width="formLabelWidth">
        <el-select
          v-model="ruleForm.role"
          class="m-2"
          :placeholder="t('user.rules.role')"
          clearable
        >
          <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
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
// import {Plus,Delete,Edit} from '@element-plus/icons-vue'
import { reactive, toRefs, ref, unref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const validateForm = ref(null);
    const formLabelWidth = '140px';
    const state = reactive({
      ruleForm: {
        name: '',
        password: '',
        email: '',
        mobile: '',
        is_robot: ref(0),
        is_superuser: ref(0),
        role: ref(''),
      },
      //  判断是新增还是编辑  true 代表新增 false 代表编辑
      isAdd: true,
      loading: false,
      tableData: [],
      dialogFormVisible: false,
      validateForm,
      roles: [],
      rules: {
        name: [{ required: true, message: t('user.rules.username'), trigger: 'blur' }],
        password: [{ required: true, message: t('user.rules.password'), trigger: 'blur' }],
        email: [
          { required: true, message: t('user.rules.email'), trigger: 'blur' },
          {
            pattern:
              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            message: t('user.rules.emailFormat'),
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: t('user.rules.mobile'), trigger: 'blur' },
          { pattern: /^1[345789]\d{9}$/, message: t('user.rules.mobileFormat'), trigger: 'blur' },
        ],
      },
    });

    getAllUsers();
    function getAllUsers() {
      store
        .dispatch('user/getAllUsers')
        .then((res) => {
          state.tableData = res['data'];
        })
        .catch((err) => {
          state.loading = false;
        });
    }
    function getAllRoles() {
      store
        .dispatch('user/getAllRoles')
        .then((res) => {
          state.roles = res['data'];
        })
        .catch((err) => {
          console.log(err);
        });
    }
    function getUser(email) {
      store
        .dispatch('user/getUser', email)
        .then((res) => {
          state.ruleForm = res['data'];
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const addUser = () => {
      state.isAdd = true;
      state.dialogFormVisible = true;
      getAllRoles();
    };
    const summit = async () => {
      const form = unref(validateForm);
      if (!form) return;
      await form.validate((valid) => {
        if (valid) {
          if (state.isAdd) {
            // 添加
            console.log(state.ruleForm.name, state.ruleForm.password, state.ruleForm.email);
            store
              .dispatch('user/addUser', state.ruleForm)
              .then((res) => {
                state.dialogFormVisible = false;
                ElMessage({
                  type: 'success',
                  message: 'Add completed',
                });
                getAllUsers();
              })
              .catch((res) => {
                state.loading = false;
              });
          } else {
            //修改
            store
              .dispatch('user/editUser', {
                name: state.ruleForm.name,
                password: state.ruleForm.password,
                mobile: state.ruleForm.mobile,
                email: state.ruleForm.email,
                is_robot: state.ruleForm.is_robot,
                role: state.ruleForm.role,
              })
              .then((res) => {
                state.dialogFormVisible = false;
                ElMessage({
                  type: 'success',
                  message: 'Edit completed',
                });
                getAllUsers();
              })
              .catch((res) => {
                state.loading = false;
              });
          }
        }
      });
    };

    const handleEdit = (email) => {
      state.isAdd = false;
      state.dialogFormVisible = true;
      getAllRoles();
      getUser(email);
    };

    const handleDelete = (email) => {
      ElMessageBox.confirm(t('user.delete'), 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then((res) => {
          store
            .dispatch('user/deleteUser', email)
            .then((res) => {
              ElMessage({
                type: 'success',
                message: 'Delete completed',
              });
              getAllUsers();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Delete canceled',
          });
        });
    };

    const dialogClose = () => {
      state.dialogFormVisible = false;
      state.validateForm.resetFields();
    };

    return {
      ...toRefs(state),
      validateForm,
      formLabelWidth,
      summit,
      addUser,
      t,
      handleEdit,
      handleDelete,
      dialogClose,
    };
  },
};
</script>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>