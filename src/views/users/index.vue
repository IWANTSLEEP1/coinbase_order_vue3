<template>
  <el-button type="primary" @click="addUser" :icon="Plus">Add User</el-button>
  <el-table
    :data="tableData"
    style="width: 100%; margin-top: 5px"
    :loading="loading"
    stripe
    border
    header-align="center"
  >
    <el-table-column prop="name" label="Name" align="center" />
    <el-table-column prop="mobile" label="Mobile" align="center" />
    <el-table-column prop="email" label="Email" align="center" />
    <el-table-column prop="role" label="Role" align="center" />
    <el-table-column label="Operations" align="center">
      <template #default="scope">
        <el-button type="primary" @click="handleEdit(scope.row.email)" :icon="Edit">Edit</el-button>
        <el-button type="danger" @click="handleDelete(scope.row.email)" :icon="Delete"
          >Delete</el-button
        >
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
        <el-input v-model.trim="ruleForm.name" autocomplete="off" :placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="Password" :label-width="formLabelWidth" prop="password" v-if="isAdd">
        <el-input
          v-model.trim="ruleForm.password"
          autocomplete="off"
          :placeholder="请输入密码"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
        <el-input
          v-model.trim="ruleForm.email"
          autocomplete="off"
          :placeholder="请输入邮箱"
          :disabled="isAdd ? false : true"
        />
      </el-form-item>
      <el-form-item label="Mobile" :label-width="formLabelWidth" prop="mobile">
        <el-input v-model.trim="ruleForm.mobile" autocomplete="off" :placeholder="请输入手机号码" />
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
        <el-select v-model="ruleForm.role" class="m-2" :placeholder="请选择角色名称" clearable>
          <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.name" />
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
  import { Plus, Delete, Edit } from '@element-plus/icons-vue';
  import { reactive, toRefs, ref, unref } from 'vue';
  import { useStore } from 'vuex';
  import { ElMessage, ElMessageBox } from 'element-plus';
  export default {
    setup() {
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
          name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {
              pattern:
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
              message: '邮箱格式不正确',
              trigger: 'blur',
            },
          ],
          mobile: [{ pattern: /^1[345789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }],
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
            state.ruleForm = res['data'][0];
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
              store
                .dispatch('user/addUser', {
                  name: state.ruleForm.name,
                  password: state.ruleForm.password,
                  mobile: state.ruleForm.mobile,
                  email: state.ruleForm.email,
                  is_robot: state.ruleForm.is_robot,
                  is_superuser: state.ruleForm.is_superuser,
                  role: state.ruleForm.role,
                })
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
                  mobile: state.ruleForm.mobile,
                  is_robot: state.ruleForm.is_robot,
                  email: state.ruleForm.email,
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
        ElMessageBox.confirm('请确认是否要删除该用户信息，删除后不可恢复', 'Warning', {
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
        handleEdit,
        handleDelete,
        dialogClose,
        Edit,
        Plus,
        Delete,
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
