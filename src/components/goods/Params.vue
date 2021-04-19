<template>
  <div>
    <!-- 面包屑区域 -->
    <breadcrumb :names="breadCrumbData"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示区域 -->
      <div>
        <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning"
          show-icon
          :closable="false"
        >
        </el-alert>
      </div>
      <!-- 商品分类选择区域 -->
      <el-row style="margin: 20px 0">
        <el-col>
          <span>请选择商品分类</span>
          <el-cascader
            v-model="selectedKeys"
            :options="goodsCateData"
            :props="cascaderProp"
            :clearable="true"
            @change="handleChange"
            @blur="handleBlur"
            style="width: 20%; margin:10px"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 表格区域 -->
          <el-table
            :data="manyTableData"
            border
            stripe
            v-if="this.selectedKeys.length > 0"
            @expand-change="expandSelect"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row, index)"
                  >{{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="showWarning(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格区域 -->
          <el-table
            :data="onlyTableData"
            border
            stripe
            v-if="this.selectedKeys.length > 0"
            @expand-change="expandSelect"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row, index)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="showWarning(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数、静态属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="addFormData"
        label-width="120px"
        :rules="addFormRules"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editFormData" label-width="120px">
        <el-form-item :label="titleText + '名字'">
          <el-input v-model="editFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="nameUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import { getCateDataRequest } from '@/api/category.js'
import {
  getParamsListRequest,
  addParamsRequest,
  editParamsRequest,
  deleteParamsRequest
} from '@/api/params.js'
import { addAttributeRequest, deleteAttributeRequest } from '@/api/attribute.js'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      // 面包屑数据
      breadCrumbData: ['商品管理', '参数列表'],
      //   级联选择器选中的值
      selectedKeys: [],
      //   级联选择器配置
      cascaderProp: {
        label: 'cat_name',
        value: 'cat_id',
        expandTrigger: 'hover'
      },
      //   商品分类数据
      goodsCateData: [],
      //   默认tab
      activeName: 'many',
      //   动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      //   添加动态参数、静态属性对话框的显示
      addDialogVisible: false,
      //   添加对话框的数据
      addFormData: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '111',
            trigger: 'blur'
          }
        ]
      },
      // 修改对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑表单的信息
      editFormData: {
        // 分类id
        id: '',
        // 参数id
        attrId: '',
        // 属性名
        attr_name: '',
        // 属性类型 only many
        attr_sel: ''
      },
      inputVisible: false,
      inputValue: '',
      expands: [],
      getRowKeys(row) {
        return row.attr_id
      }
    }
  },
  created() {
    this.getAllGoodsCate()
  },
  methods: {
    // 解决展开栏 展开多栏问题
    expandSelect(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = []
        if (row) {
          this.expands.push(row.attr_id)
        }
      } else {
        this.expands = []
      }
    },
    //   获取参数列表
    async getParamsList() {
      if (this.selectedKeys.length !== 3) {
        this.manyTableData = []
        this.onlyTableData = []
        return this.$message.error('请选择三级分类')
      } else {
        // const { data: res } = await this.$http.get(
        //   `categories/${this.selectedId}/attributes`,
        //   {
        //     params: {
        //       sel: this.activeName
        //     }
        //   }
        // )
        const { data: res } = await getParamsListRequest(
          this.selectedId,
          this.activeName
        )
        if (res.meta.status !== 200) {
          this.$message.error('获取参数列表失败')
        } else {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          })
          if (this.activeName === 'many') {
            this.manyTableData = res.data
          } else {
            this.onlyTableData = res.data
          }
        }
      }
    },
    //   获取分类数据
    async getAllGoodsCate() {
      const { data: res } = await getCateDataRequest()
      //   console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      } else {
        this.goodsCateData = res.data
      }
    },
    // 级联选择框选择修改
    handleChange() {
      this.getParamsList()
      // console.log(this.selectedKeys)
    },
    // 处理 级联选择器失去焦点
    handleBlur() {
      if (this.selectedKeys.length <= 2) {
        this.selectedKeys = []
      }
    },
    // tab标签分页
    handleTabClick() {
      this.getParamsList()
    },
    // 对话框关闭处理函数
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('表单验证不通过')
        } else {
          const { data: res } = await addParamsRequest(
            this.selectedKeys[2],
            this.addFormData.attr_name,
            this.activeName
          )

          if (res.meta.status !== 201) {
            return this.$message.error('添加失败')
          } else {
            this.getParamsList()
            this.$message.success('添加成功')
            this.addDialogVisible = false
          }
        }
      })
    },
    // 显示修改参数对话框
    showEditDialog(row) {
      // 设置修改参数名称所需要的信息
      this.editFormData.id = this.selectedKeys[2]
      this.editFormData.attrId = row.attr_id
      this.editFormData.attr_name = row.attr_name
      this.editFormData.attr_sel = this.activeName
      this.editDialogVisible = true
      console.log(row)
    },
    // 关闭修改参数对话框
    editDialogClosed() {
      // this.editFormData.id = ''
      // this.editFormData.attrId = ''
      // this.editFormData.attr_name = ''
      // this.editFormData.attr_sel = ''
    },
    // 提交修改参数名称函数
    async nameUpdate() {
      // const { data: res } = await this.$http.put(
      //   `categories/${this.selectedKeys[2]}/attributes/${this.editFormData.attrId}`,
      //   this.editFormData
      // )
      const { data: res } = await editParamsRequest(
        this.selectedKeys[2],
        this.editFormData
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      } else {
        this.getParamsList()
        this.editDialogVisible = false
        this.$message.success('更新成功')
      }
    },
    // 点击删除 显示警告
    showWarning(row) {
      console.log(row)
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteParamsRequest(
            this.selectedKeys[2],
            row.attr_id
          )

          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          } else {
            this.getParamsList()
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
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本框失去焦点 或 按下回车后调用
    async handleInputConfirm(row) {
      const inputValue = this.inputValue
      // 如果输入了值
      if (inputValue) {
        this.editFormData.id = this.selectedId
        this.editFormData.attrId = row.attr_id
        this.editFormData.attr_name = row.attr_name
        this.editFormData.attr_sel = this.activeName
        let vals = row.attr_vals
        vals.push(inputValue)
        vals = vals.join(',')
        console.log(vals)
        // const { data: res } = await this.$http.put(
        //   `categories/${this.editFormData.id}/attributes/${this.editFormData.attrId}`,
        //   {
        //     attr_name: this.editFormData.attr_name,
        //     attr_sel: this.editFormData.attr_sel,
        //     attr_vals: vals
        //   }
        // )
        const { data: res } = await addAttributeRequest(this.editFormData, vals)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('添加失败')
        }
        this.getParamsList()
        this.$message.success('添加成功')
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 标签关闭触发
    async handleClose(row, index) {
      // 在attr_vals中删除 tag
      row.attr_vals.splice(index, 1)
      const { data: res } = await deleteAttributeRequest(
        this.selectedId,
        this.activeName,
        row
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      } else {
        this.$message.success('更新成功')
        this.getParamsList()
      }
    }
  },
  computed: {
    //   按钮是否需要被禁用
    // 禁用返回true 否则返回false
    isBtnDisabled() {
      if (this.selectedKeys.length === 3) {
        return false
      }
      return true
    },
    // 当前选择的三级ID
    selectedId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      } else {
        return null
      }
    },
    // 返回对话框名字
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-left: 0.8rem;
  height: 2.1rem;
}
.button-new-tag {
  margin-left: 0.8rem;
  height: 2.1rem;
  line-height: 2rem;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 5rem;
  margin-left: 0.8rem;
  vertical-align: bottom;
}
</style>
