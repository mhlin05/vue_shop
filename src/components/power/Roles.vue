<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :names="nameList"></breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色区域 -->
      <div class="btnStyle">
        <el-button type="primary" @click="addRoleDialogVisible = true"
          >添加角色</el-button
        >
      </div>
      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialogVisible"
        width="30%"
        @close="addRoleDialogClosed"
      >
        <el-form
          ref="addRoleFormRef"
          :model="addRoleFormData"
          label-width="100px"
          :rules="addRoleFormRules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleFormData.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRoleFormData.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 角色列表区域 -->
      <div>
        <el-table :data="rolesData" stripe style="width: 100%" border>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row
                v-for="(item, index) in scope.row.children"
                :key="item.id"
                :class="[
                  'line_bottom',
                  index === 0 ? 'line_top' : '',
                  'vcenter'
                ]"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag
                    :closable="true"
                    @close="removeRightById(scope.row, item.id)"
                    >{{ item.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级和三级权限 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item2, index2) in item.children"
                    :key="item2.id"
                    :class="[index2 === 0 ? '' : 'line_top', 'vcenter']"
                    :gutter="0"
                  >
                    <el-col :span="6"
                      ><el-tag
                        type="success"
                        :closable="true"
                        @close="removeRightById(scope.row, item2.id)"
                      >
                        {{ item2.authName }}
                        <i class="el-icon-caret-right"></i> </el-tag
                    ></el-col>
                    <el-col :span="13">
                      <el-tag
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        :closable="true"
                        @close="removeRightById(scope.row, item3.id)"
                      >
                        {{ item3.authName }}
                        <i class="el-icon-caret-right"></i>
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- <pre>
                      {{ scope.row }}
                  </pre
              > -->
              <!-- {{ scope.row }} -->
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column label="#" type="index"> </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column label="操作" width="400px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteRole(scope.row)"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
              <!-- {{scope.row}} -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 编辑角色对话框 -->
    <el-dialog
      width="30%"
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
    >
      <el-form
        :model="editRoleData"
        ref="editRoleFormRef"
        :rules="addRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editRoleData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限dialog -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      @close="closeRightsDialog"
    >
      <el-tree
        :data="rightsData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import {
  getRolesDataRequest,
  addRoleRequest,
  modifyRoleRequest,
  deleteRoleRequest
} from '@/api/role.js'
import {
  deletePowerAsId,
  getRightsTreeRequest,
  allotRightsRequest
} from '@/api/power.js'
export default {
  created() {
    // 获取权限和角色数据
    this.getRolesData()
  },
  components: {
    Breadcrumb
  },
  data() {
    return {
      // 面包屑数据
      nameList: ['权限管理', '角色列表'],
      // 角色数据
      rolesData: [],
      // 权限数据
      rightsData: [],
      // 分配权限对话框
      rightDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认勾选的key数组
      defKeys: [],
      // 当前即将分配权限的id
      roleId: '',
      // 添加角色的表单数据
      addRoleFormData: {
        // 角色名
        roleName: '',
        // 角色描述
        roleDesc: ''
      },
      // 添加角色对话框
      addRoleDialogVisible: false,
      // 添加角色验证规则
      addRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      },
      // 编辑对话框visible
      editRoleDialogVisible: false,
      editRoleData: {
        id: '',
        // 角色名
        roleName: '',
        // 角色描述
        roleDesc: ''
      }
    }
  },
  methods: {
    // 获取角色数据
    async getRolesData() {
      const { data: res } = await getRolesDataRequest()
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesData = res.data
      //   console.log(res.data)
    },
    // 根据id删除对应权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      } else {
        console.log('确认了删除')
        const { data: res } = await deletePowerAsId(role, rightId)

        if (res.meta.status !== 200) {
          return this.$message.error('取消权限失败')
        }
        this.$message.success('取消权限成功')
        // this.getRolesData()
        role.children = res.data
      }
    },
    // 展示分配权限的对话框
    showSetRightDialog(row) {
      this.roleId = row.id
      this.getRightsTree()
      this.getLeafsKeys(row, this.defKeys)
      this.rightDialogVisible = true
    },
    // 获取所有权限列表 树状
    async getRightsTree() {
      const { data: res } = await getRightsTreeRequest()
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightsData = res.data
      // console.log(this.rightsData)
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组
    getLeafsKeys(node, arr) {
      // 结点为三级节点 将id存入数组
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafsKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    closeRightsDialog() {
      this.defKeys.length = 0
    },
    // 分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await allotRightsRequest(this.roleId, idStr)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.getRolesData()
      // this.getRightsTree()
      this.rightDialogVisible = false
      this.$message.success('分配权限成功')
    },
    // 添加角色
    async addRole() {
      // 表单验证'
      this.$refs.addRoleFormRef.validate(async valid => {
        if (valid === true) {
          const { data: res } = await addRoleRequest(this.addRoleFormData)
          if (res.meta.status !== 201) {
            return this.$message.error('创建角色失败')
          }
          this.getRolesData()
          this.addRoleDialogVisible = false
        } else {
          return this.$message.error('表单验证失败')
        }
      })
    },
    // 添加角色对话框关闭
    addRoleDialogClosed() {
      this.addRoleFormData.roleName = ''
      this.addRoleFormData.roleDesc = ''
      this.$refs.addRoleFormRef.resetFields()
    },
    // 显示编辑角色对话框
    showEditDialog(row) {
      console.log(row)
      this.editRoleData.id = row.id
      this.editRoleData.roleName = row.roleName
      this.editRoleData.roleDesc = row.roleDesc
      this.editRoleDialogVisible = true
    },
    // 提交角色修改信息
    editRoleInfo() {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('表单验证不通过')
        } else {
          const { data: res } = await modifyRoleRequest(this.editRoleData)
          if (res.meta.status !== 200) {
            return this.$message.error('修改角色信息失败')
          } else {
            this.getRolesData()
            this.editRoleDialogVisible = false
            this.$message.success('修改角色信息成功')
          }
        }
      })
    },
    // 删除角色
    deleteRole(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteRoleRequest(row.id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除角色失败')
          } else {
            this.getRolesData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.btnStyle {
  display: flex;
  align-items: flex-start;
}
.el-tag {
  margin: 7px;
}

.line_top {
  border-top: 1px solid #eee;
}
.line_bottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
