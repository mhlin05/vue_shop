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
          >
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit">修改</el-button>
                <el-button type="danger" icon="el-icon-delete">删除</el-button>
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
          >
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit">修改</el-button>
                <el-button type="danger" icon="el-icon-delete">删除</el-button>
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
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'

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
      }
    }
  },
  created() {
    this.getAllGoodsCate()
  },
  methods: {
    //   获取参数列表
    async getParamsList() {
      const { data: res } = await this.$http.get(
        `categories/${this.selectedId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        this.$message.error('获取参数列表失败')
      } else {
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      }
      console.log(res)
    },
    //   获取分类数据
    async getAllGoodsCate() {
      const { data: res } = await this.$http.get('categories')
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
      console.log(this.selectedKeys)
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
          const { data: res } = await this.$http.post(
            `categories/${this.selectedKeys[2]}/attributes`,
            {
              attr_id: this.selectedKeys[2],
              attr_name: this.addFormData.attr_name,
              attr_sel: this.activeName
            }
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

<style lang="less" scoped></style>
