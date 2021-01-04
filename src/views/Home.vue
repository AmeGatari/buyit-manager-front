<template>
  <div>

    <el-container>

      <el-header class="between-center">
        <div style="width: 320px" class="between-center">
          <img src="../assets/images/logo.png" alt="logo" height="40"><span>Buyit 数码商城后台管理系统</span>
        </div>
        <div>
          <el-dropdown placement="bottom" class="header-item">

            <span class="el-dropdown-link">
            {{ admin.adminName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="signOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="header-item">权限类型：{{admin.authority}}</span>

        </div>
      </el-header>

      <el-container>

        <el-aside width="300px">

          <el-menu
              router="true"
              default-active="1"
              unique-opened="true"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose">

            <el-menu-item index="/info">

              <template slot="title">
                <i class="el-icon-info"></i>
                <span>商城信息概览</span>
              </template>

            </el-menu-item>

            <el-submenu index="2">

              <template slot="title">
                <i class="el-icon-s-shop"></i>
                <span>商城内容管理</span>
              </template>

              <el-menu-item index="/banner">首页轮播图管理</el-menu-item>

            </el-submenu>

            <el-submenu index="3">

              <template slot="title">
                <i class="el-icon-s-goods"></i>
                <span>商品管理</span>
              </template>

              <el-menu-item index="/category">商品分类管理</el-menu-item>
              <el-menu-item index="/good">在售商品管理</el-menu-item>

            </el-submenu>

            <el-menu-item index="/order">

              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>订单管理</span>
              </template>

            </el-menu-item>

            <el-menu-item index="/user">

              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span>会员用户管理</span>
              </template>

            </el-menu-item>

            <el-menu-item v-if="admin.authority==='超级管理员'" index="/admin">

              <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span>管理员账号管理</span>
              </template>

            </el-menu-item>

          </el-menu>

        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>

      </el-container>

      <c-footer></c-footer>

    </el-container>

  </div>
</template>

<script>
import CFooter from "@/components/Footer";

export default {
  name: "Home",
  components: {
    CFooter
  },
  data() {
    return {
      admin: {
        adminId: window.sessionStorage.getItem("adminId"),
      }

    }
  },
  created() {
    this.$axios.post('http://localhost:8181/admin/findAdminByAdminId/'+this.admin.adminId).then((resp)=> {
      this.admin = resp.data

    })
  },
  methods: {
    signOut() {
      window.sessionStorage.clear();
      location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
@import "../assets/style/common";

.header-item{
  margin: 0 10px;
}
</style>
