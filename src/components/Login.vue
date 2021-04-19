<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <!-- 表单 -->
      <el-form
        :model="loginForm"
        :rules="LoginRules"
        ref="loginFormRef"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登陆信息
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登陆规则
      LoginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    created() {
      console.log(111)
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        this.$store.dispatch('my/login', this.loginForm)
        // const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        // if (res.meta.status !== 200) return this.$message.error('登入失败')
        // this.$message.success('登入成功')
        // window.sessionStorage.setItem('token', res.data.token)
        // this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 30rem;
  height: 20rem;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 10rem;
    width: 8.66rem;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 1rem;
    position: absolute;
    left: 50%;
    box-shadow: 0 0 1rem #ddd;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 3rem;
    box-sizing: border-box;
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
