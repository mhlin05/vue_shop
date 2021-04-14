<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :names="breadcrumbData"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :active="activePane - ''"
        finish-status="success"
        class="steps_style"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addFormData"
        :rules="addFormRules"
        ref="addFormRef"
        class="demo-ruleForm"
        label-position="top"
      >
        <!-- 标签页 -->
        <el-tabs
          tab-position="left"
          class="tabs_style"
          v-model="activePane"
          :before-leave="tabChanged"
        >
          <!-- 基本信息面板 -->
          <el-tab-pane label="基本信息" :name="'0'">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFormData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addFormData.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addFormData.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addFormData.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addFormData.goods_cat"
                :options="goodsCateData"
                :props="cascaderProp"
                @change="handleCascaderChange"
                :clearable="true"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" :name="'1'">
            <el-form-item
              v-for="(item, index) in manyTableData"
              :key="index"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="vals"
                  v-for="(vals, i2) in item.attr_vals"
                  :key="i2"
                  border
                  >{{ vals }}</el-checkbox
                >
              </el-checkbox-group>
              <!-- <el-button @click="showcheckbox">1111</el-button> -->
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" :name="'2'">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals[0]"></el-input
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" :name="'3'">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" :name="'4'">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addFormData.goods_introduce"> </quill-editor>
            <el-button type="primary" class="addBtn" @click="add()"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 显示图片对话框 -->
    <el-dialog
      title="图片详情"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewImgURL" alt="" class="imgstyle" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import { getCateDataRequest, getCateAttributesRequest } from '@/api/category.js'
import { addGoodsRequest } from '@/api/goods.js'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      breadcrumbData: ['商品列表', '添加商品'],
      // 当前激活的面板
      activePane: '0',
      // 表单数据
      addFormData: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 级联选择器选中项
        goods_cat: [],
        // 文件
        pics: [],
        // 富文本编辑器内容
        goods_introduce: '',
        // 商品的参数 包含动态参数和静态属性
        attrs: []
      },
      // 表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ]
      },
      // 商品分类数据
      goodsCateData: [],
      // 级联选择器配置
      cascaderProp: {
        label: 'cat_name',
        value: 'cat_id',
        expandTrigger: 'hover'
      },
      // 属性值数组
      tagData: [],
      onlyTableData: [],
      manyTableData: [],
      // 文件列表
      fileList: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 显示图片详情的图片的URL
      previewImgURL: '',
      // 显示图片详情的对话框
      previewDialogVisible: false
    }
  },
  created() {
    this.getAllGoodsCate()
  },
  methods: {
    // 切换tab之前   验证是否完成表单
    tabChanged(activeName, oldActiveName) {
      let isOk
      this.$refs.addFormRef.validate(valid => {
        isOk = valid
        // 表单验证不通过，或者没填
        if (!valid) {
          return this.$message.info('表单验证不通过')
        }
      })
      if (!isOk) {
        return false
      }
      if (activeName === '1') {
        this.getCateList('many')
      } else if (activeName === '2') {
        this.getCateList('only')
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
    // 级联选择器选择改变触发
    handleCascaderChange() {
      // 只能选择三级分类
      if (this.addFormData.goods_cat.length !== 3) {
        this.addFormData.goods_cat = []
      }
    },
    // 获取参数 并将参数值处理为数组
    async getCateList(mysel) {
      const { data: res } = await getCateAttributesRequest(
        this.selectedId,
        mysel
      )
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('获取参数列表失败')
      } else {
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        if (mysel === 'only') {
          this.onlyTableData = res.data
          console.log(mysel, this.onlyTableData)
        } else {
          this.manyTableData = res.data
          console.log(mysel, this.manyTableData)
        }
        // this.tagData = res.data
      }
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file)
      this.previewImgURL = file.response.data.url
      this.previewDialogVisible = true
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      // 获取要删除的文件保存的临时路径
      const tempPath = file.response.data.tmp_path
      // 找到要删除的图片在数组中的索引
      const index = this.addFormData.pics.findIndex(item => {
        return item.pic === tempPath
      })
      // 删除
      this.addFormData.pics.splice(index, 1)
      console.log(this.addFormData.pics)
    },
    // 文件上传成功
    uploadSuccess(response) {
      console.log(response)
      // 拼接起一个对象
      const obj = {
        pic: response.data.tmp_path
      }
      // 放入数组
      this.addFormData.pics.push(obj)
      console.log(this.addFormData.pics)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        // 表单验证不通过，或者没填
        if (!valid) {
          return this.$message.info('表单验证不通过')
        }
        // 执行添加商品的逻辑

        //  处理attrs数组
        this.onlyTableData.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addFormData.attrs.push(obj)
        })
        this.manyTableData.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addFormData.attrs.push(obj)
        })
        // 深拷贝
        // 直接操作addFormData会报错，因为级联选择器要求绑定数组
        const form = _.cloneDeep(this.addFormData)
        // 将分类变为字符串
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)
        const { data: res } = await addGoodsRequest(form)
        // const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('创建商品失败')
        } else {
          this.$message.success('创建商品成功')
          this.$router.push('/goods')
        }
      })
    }
  },
  computed: {
    // 分类ID
    selectedId() {
      if (this.addFormData.goods_cat.length === 3) {
        return this.addFormData.goods_cat[2]
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.steps_style {
  margin-top: 30px;
}
.tabs_style {
  margin-top: 20px;
}
.vals_style {
  margin-left: 20px;
  // .el-tag {
  //   margin-left: 10px;
  // }
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.imgstyle {
  width: 100%;
}
.addBtn {
  margin: 20px 0 0 0;
}
</style>
