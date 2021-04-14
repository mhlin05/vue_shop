<template>
  <div>
    <!-- <my-table
      :tableInfo="tableInfo"
      :tableData="userList"
      @switchStateChanged="stateChange"
    ></my-table> -->
    <!-- 面包屑导航区域 -->
    <breadcrumb :names="UserBreadcrumbData"></breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            :clearable="true"
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改用户信息按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showModifyDialog(scope.row)"
            ></el-button>
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRoleDialogVisible(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="30%"
      @close="closeAddDialog"
    >
      <el-form
        ref="addFormRef"
        :model="addFormData"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFormData.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      @close="modifyDialogClosed"
      :visible.sync="modifyDialog"
      width="30%"
    >
      <el-form
        ref="modifyFormRef"
        :model="modifyFormData"
        label-width="80px"
        :rules="addFormRules"
      >
        <el-form-item label="用户名">
          <el-input v-model="modifyFormData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modifyFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="modifyFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialog = false">取 消</el-button>
        <el-button type="primary" @click="modifyUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="roleDialogVisible"
      @close="closeRoleDialog"
      width="30%"
    >
      <el-form ref="roleFormRef" :model="userInfo" label-width="100px">
        <el-form-item label="当前用户">
          <el-input disabled v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="当前角色">
          <el-input disabled v-model="userInfo.role_name"></el-input>
        </el-form-item>
        <el-form-item label="分配新角色">
          <el-select
            style="width: 100%"
            v-model="selectedRoleId"
            placeholder="请选择新角色"
          >
            <el-option
              v-for="(item, index) in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <span>
          <el-button @click="roleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserInfo,
  changeUserState,
  addUserRequest,
  modifyUserInfoRequest,
  deleteUserRequest
} from '@/api/user.js'
import { getRolesDataRequest, allotRolesRequest } from '@/api/role.js'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
// import MyTable from '../MyTable.vue'
export default {
  components: { Breadcrumb },
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (reg.test(value)) {
        return cb()
      } else {
        return cb(new Error('邮箱格式不正确'))
      }
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (reg.test(value)) {
        return cb()
      } else {
        return cb(new Error('手机号码格式不正确'))
      }
    }
    return {
      queryInfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 用户添加对话框的显示与隐藏
      addUserDialogVisible: false,
      // 修改用户对话框的显示与隐藏
      modifyDialog: false,
      // 分配角色对话框的显示与隐藏
      roleDialogVisible: false,
      // 添加用户数据
      addFormData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户数据
      modifyFormData: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 添加用户验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度3-10', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
          // { min: 3, max: 10, message: '用户名长度3-10', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
          // {
          //   type: 'email',
          //   message: '请输入正确的邮箱地址',
          //   trigger: ['blur', 'change']
          // }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
          // { min: 11, max: 11, message: '用户名长度要求为11位', trigger: 'blur' }
        ]
      },
      // 当前用户的信息
      userInfo: {},
      // 角色列表
      rolesList: [],
      selectedRoleId: '',
      // 面包屑数据
      UserBreadcrumbData: ['用户管理', '用户列表'],
      // table数据
      tableInfo: {
        label_prop: [
          { label: '姓名', prop: 'username' },
          { label: '邮箱', prop: 'email' },
          { label: '电话', prop: 'mobile' },
          { label: '角色', prop: 'role_name' }
        ],
        state: true,
        operate: true
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await getUserInfo(this.queryInfo)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      console.log('页面大小改变' + newSize)
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    // 监听当前页的改变
    handleCurrentChange(newPage) {
      console.log('当前页' + newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 用户状态改变
    async stateChange(row) {
      const { data: res } = await changeUserState(row.id, row.mg_state)
      if (res.meta.status !== 200) {
        // 更新失败 重置状态值
        row.mg_state = !row.mg_state
        return this.$message.error('更新用户状态失败')
      }
      console.log(row.mg_state)
      this.$message.success('更新用户状态成功')
    },
    // 确认添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (validateRes, obj) => {
        // 验证通过开始发起请求 添加用户
        if (validateRes === true) {
          const { data: res } = await addUserRequest(this.addFormData)
          if (res.meta.status !== 201) {
            console.log(res.meta)
            return this.$message.error('添加用户失败')
          } else {
            this.$message.success('添加用户成功')
            // 添加成功 隐藏对话框
            this.addUserDialogVisible = false
            // 重新获取用户列表
            this.getUserList()
          }
        } else {
          // console.log(obj)
          return this.$message.error(obj + '表单验证不通过')
        }
      })

      // console.log(res)
    },
    // 取消添加用户对话框 并重置表单
    closeAddDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 弹出修改用户信息对话框
    showModifyDialog(row) {
      this.modifyDialog = true
      this.modifyFormData.id = row.id
      this.modifyFormData.username = row.username
      this.modifyFormData.email = row.email
      this.modifyFormData.mobile = row.mobile
    },
    // 关闭对话框
    modifyDialogClosed() {
      this.$refs.modifyFormRef.resetFields()
    },
    // 修改用户信息
    modifyUserInfo() {
      this.$refs.modifyFormRef.validate(async valid => {
        if (valid === true) {
          // const { data: res } = await this.$http.put(
          //   `users/${this.modifyFormData.id}`,
          //   this.modifyFormData
          // )
          const { data: res } = await modifyUserInfoRequest(this.modifyFormData)
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户信息失败')
          }
          this.$message.success('修改用户信息成功')
          this.modifyDialog = false
          this.getUserList()
        } else {
          return this.$message.error('表单验证不通过')
        }
      })
      // console.log(res)
    },
    deleteUser(myid) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteUserRequest(myid)
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getUserList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 显示分配角色对话框
    async setRoleDialogVisible(row) {
      // 将这一行数据存入data
      this.userInfo = row
      // 获取角色列表
      const { data: res } = await getRolesDataRequest()
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.roleDialogVisible = true
      console.log(row)
    },
    // 点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      // const { data: res } = await this.$http.put(
      //   `users/${this.userInfo.id}/role`,
      //   {
      //     rid: this.selectedRoleId
      //   }
      // )
      const { data: res } = await allotRolesRequest(
        this.userInfo,
        this.selectedRoleId
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.roleDialogVisible = false
    },
    // 监听分配角色对话框的关闭
    closeRoleDialog() {
      this.userInfo = {}
      this.selectedRoleId = ''
    }
  }
}
</script>

<style lang="less" scpoed>
.el-pagination {
  display: flex;
  justify-content: center;
}
</style>
