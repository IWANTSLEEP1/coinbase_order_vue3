<template> 
<el-button type="primary" @click="addRole" :icon="Plus">Add Role</el-button>
  <el-table :data="tableData" border style="width: 100%;margin-top: 5px;" :loading="loading" >
    <el-table-column prop="name" label="Name" align="center"/>
    <el-table-column prop="description" label="Description" align="center"/>
    <el-table-column label="Operations" align="center">
      <template #default="scope">
        <el-button type="primary" @click="handleEdit(scope.row.name)" :icon="Edit">Edit</el-button>
        <el-button type="danger" @click="handleDelete(scope.row.name)" :icon="Delete">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="dialogFormVisible"
    :title="isAdd ? 'Add Role' : 'Edit Role'"
    width="35%"
    @close="dialogClose"
    center>
    <el-form :model="ruleForm" :rules="rules" ref="validateForm">
      <el-form-item label="Name" :label-width="formLabelWidth" prop="name">
        <el-input
          v-model.trim="ruleForm.name"
          autocomplete="off"
          :placeholder="请输入角色"
          :disabled="isAdd ? false : true"
        />
      </el-form-item>
      <el-form-item label="Description" :label-width="formLabelWidth" prop="description">
        <el-input
          v-model.trim="ruleForm.description"
          autocomplete="off"
          :placeholder="请输入角色描述"
        />
      </el-form-item>
      </el-form>
     <template #footer >
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="summit"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { reactive, toRefs, ref, unref } from 'vue';
  import { useStore } from 'vuex';
  import { ElMessage,ElMessageBox} from 'element-plus';
  import {Plus,Delete,Edit} from '@element-plus/icons-vue'
  export default {
    setup() {
      const store = useStore();
      const validateForm = ref(null);
      const formLabelWidth = '100px';
      const state = reactive({
        ruleForm: {
          name: '',
          description:"",
        },
        isAdd: true,
        tableData:[],
        dialogFormVisible: false,
        loading: false,
        validateForm,
        rules: {
          name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        },
      });

    getAllRoles()
    function getAllRoles() {
      store.dispatch('user/getAllRoles').then((res)=>{
        state.tableData = res['data'];
      }).catch(()=>{state.loading=false});
    }
    
    function getRole(name) {
      store.dispatch('user/getRole',name).then((res)=>{
        state.ruleForm = res['data'];
      }).catch(()=>{state.loading=false});
    }

    const addRole = () => {
      state.isAdd = true;
      state.dialogFormVisible = true;
    };
    
    const handleEdit = (name) => {
      state.isAdd = false;
      state.dialogFormVisible = true;
      getRole(name);
    };

    const summit = async () => {
      const form = unref(validateForm);
      if (!form) return;
      await form.validate((valid) => {
        if (valid) {
          if (state.isAdd) {
            // 添加
            store
              .dispatch('user/addRole', {
                  "name":state.ruleForm.name,
                  "description":state.ruleForm.description
              })
              .then((res) => {
                state.dialogFormVisible = false;
                ElMessage({
                  type: 'success',
                  message: 'Add completed',
                });
                getAllRoles()
              })
              .catch((res) => {
                state.loading = false;
              });
          } else {
            //修改
            store
              .dispatch('user/editRole',state.ruleForm)
              .then(() => {
                state.dialogFormVisible = false;
                ElMessage({
                  type: 'success',
                  message: 'Edit completed',
                });
                getAllRoles();
              })
              .catch((res) => {
                state.loading = false;
              });
          }
        }
      });
    };
    const handleDelete = (name) => {
      ElMessageBox.confirm("请确认是否要删除该角色信息，删除后不可恢复！", 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then((res) => {
          store
            .dispatch('user/delRole', name)
            .then((res) => {
              ElMessage({
                type: 'success',
                message: 'Delete completed',
              });
              getAllRoles();
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
        addRole,
        formLabelWidth,
        summit,
        handleEdit,
        dialogClose,
        handleDelete,
        Edit,
        Plus,
        Delete
    };
    }
  };
  
</script>
