<template>
  <div class="home-div">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="@/assets/heima.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout"> 退出 </el-button>
      </el-header>
      <!-- 页面主体 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="sideWidth" class="asideStyle">
          <div class="toggle-button" @click="change">|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="iscollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menulist"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState('/' + subItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 内容主题区域 -->
        <el-main>
          <!-- 路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Request from '@/utils/request.js'
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      iscollapse: false,
      sideWidth: '200px',
      // 被激活的侧边栏地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    console.log(this.activePath)
  },
  methods: {
    // 切换菜单的折叠和展开
    change() {
      this.iscollapse = !this.iscollapse
      if (!this.iscollapse === true) {
        this.sideWidth = '200px'
      } else {
        this.sideWidth = '64px'
      }
    },
    logout() {
      // 清理token
      window.sessionStorage.clear()
      // 跳转到登录界面
      this.$router.push('/login')
    },
    // 获取菜单数据
    async getMenuList() {
      // const { data: res } = await this.$http.get('menus')
      const { data: res } = await Request({
        url: 'menus',
        method: 'get'
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res)
    },
    // 保存侧边栏的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  // 使左侧logo贴边显示 不留白
  padding-left: 0;
  // 使按钮居中显示 不贴边
  align-items: center;
  color: #fff;
  font-size: 1.3rem;
  width: 100%;
  > div {
    display: flex;
    align-items: center;
    > img {
      margin-left: 0.5rem;
    }
    > span {
      margin-left: 2rem;
    }
  }
}
.el-aside {
  background-color: #333744;
  align-items: center;
  text-align: center;

  .el-menu {
    border-right: 0;
    // display: grid;
    // justify-content: center;
    // align-items: center;

    .el-submenu {
      align-items: flex-start;

      // text-align: center;
      span {
        font-size: 0.9rem;
      }
      .el-submenu__title {
        position: absolute;
        top: 50%;
        left: 25%;
        // padding-left: 0;
      }
    }
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.home-div {
  height: 100%;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 0.7rem;
  line-height: 1.7rem;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
