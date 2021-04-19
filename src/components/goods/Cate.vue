<template>
  <div>
    <breadcrumb :names="cateBreadCrumbData"> </breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col class="add_btn">
          <el-button type="primary" @click="addCategoriesDialogVisible = true"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        :data="goodCategoriesData"
        :columns="columns"
        border
        :show-row-hover="false"
        show-index
        index-text="#"
        :expand-type="false"
        :selection-type="false"
        class="treetable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="option" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditCateDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            @click="deleteCate(scope.row.cat_id)"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoriesDialogVisible"
      width="30%"
      @close="closeAddCateDialog"
    >
      <el-form
        :model="addCateFormData"
        :rules="rules"
        ref="addCateFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cateName">
          <el-input v-model="addCateFormData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            ref="cascaderRef"
            v-model="selectedKeys"
            :options="parentCateData"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name'
            }"
            clearable
            @change="parentCateChange"
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoriesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      @close="closeEditCateDialog"
      width="30%"
    >
      <el-form
        label-width="100px"
        ref="editDialogRef"
        :model="editCateData"
        :rules="editCateRules"
      >
        <el-form-item label="分类名称" prop="categoriesName">
          <el-input v-model="editCateData.categoriesName"></el-input>
        </el-form-item>
      </el-form>
      <span class="editCateBtn">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategories">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import {
  getParentsCateDataRequest,
  getCateDataRequest,
  addCateRequest,
  editCateRequest,
  deleteCateRequest
} from '@/api/category.js'
export default {
  components: { Breadcrumb },
  data() {
    return {
      // 面包屑数据
      cateBreadCrumbData: ['商品管理', '商品分类'],
      //   分类数据
      goodCategoriesData: [],
      parentCateData: [],
      queryInfo: {
        type: 3,
        //   当前页码
        pagenum: 1,
        //   页面大小
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      // 添加对话框的显示与隐藏
      addCategoriesDialogVisible: false,
      addCateFormData: {
        // 分类父 ID
        cat_pid: 0,
        cat_name: '',
        // 默认一级分类
        cat_level: 0
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 修改分类对话框
      editCateDialogVisible: false,
      // 修改分类数据
      editCateData: {
        categoriesName: '',
        categoriesId: ''
      },
      editCateRules: {
        categoriesName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCategoriesData()
    this.getParentCategories()
  },
  methods: {
    // 获取分页的 分类数据
    async getCategoriesData() {
      // const { data: res } = await this.$http.get('categories', {
      //   params: this.queryInfo
      // })
      const { data: res } = await getCateDataRequest(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      console.log(res.data)
      this.goodCategoriesData = res.data.result
      // console.log(this.goodCategoriesData)
      //   总数据条数赋值
      this.total = res.data.total
    },
    // 监听页面大小改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategoriesData()
    },
    // 监听页码改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCategoriesData()
    },
    // 分类对话框关闭
    closeAddCateDialog() {
      // 这里要一个个设置
      // 不然按照this.addCateFormData = {}
      // 会导致pid 或者level属性没有
      this.addCateFormData.cat_pid = 0
      this.addCateFormData.cat_level = 0
      this.addCateFormData.cat_name = ''
      // this.addCateFormData = {}
      this.selectedKeys = []
      this.$refs.addCateFromRef.resetFields()
    },
    // 获取父类分类
    async getParentCategories() {
      const { data: res } = await getParentsCateDataRequest()
      this.parentCateData = res.data
    },
    // 监听级联选择器 当选中节点变化时触发
    parentCateChange() {
      console.log(this.selectedKeys)
      // 如果selectedKeys的length>0 说明选了分类
      if (this.selectedKeys.length > 0) {
        // 设置分类的等级
        this.addCateFormData.cat_level = this.selectedKeys.length
        // 设置父级的ID
        this.addCateFormData.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
      } else {
        this.addCateFormData.cat_pid = 0
        this.addCateFormData.cat_level = 0
      }
    },
    // 确认   添加分类
    async addCategories() {
      // console.log(this.addCateFormData)
      const { data: res } = await addCateRequest(this.addCateFormData)
      if (res.meta.status !== 201) {
        return this.$message.error('创建分类失败')
      }
      this.getCategoriesData()
      this.$message.success('创建分类成功')
      this.addCategoriesDialogVisible = false
    },
    // 显示编辑对话框
    showEditCateDialog(row) {
      this.editCateDialogVisible = true
      this.editCateData.categoriesName = row.cat_name
      this.editCateData.categoriesId = row.cat_id
    },
    // 提交确认的编辑
    editCategories() {
      this.$refs.editDialogRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('表单校验不通过')
        }
        console.log(
          this.editCateData.categoriesName,
          this.editCateData.categoriesId
        )
        const { data: res } = await editCateRequest(this.editCateData)
        // const { data: res } = await this.$http.put(
        //   'categories/' + this.editCateData.categoriesId,
        //   { cat_name: this.editCateData.categoriesName }
        // )
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('更新分类失败')
        this.$message.success('更新分类成功')
        this.getCategoriesData()
      })

      this.editCateDialogVisible = false
    },
    closeEditCateDialog() {},
    // 删除分类
    deleteCate(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteCateRequest(id)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          // 刷新
          this.getCategoriesData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
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
.add_btn {
  display: flex;
  align-items: flex-start;
}
.treetable {
  margin-top: 1.5rem;
}
.el-cascader {
  width: 100%;
}
.editDialogStyle {
  display: flex;
  align-items: flex-start;
}
.editCateBtn {
  display: flex;
  justify-content: flex-end;
}
</style>
