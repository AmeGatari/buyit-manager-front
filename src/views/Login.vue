<template>
  <div>
    <div class="login-header-bg">
      <header class="container flex">
        <div class="login-header"><router-link to="/"><img src="../assets/images/logo.png" alt="logo" height="50px"/></router-link></div>
        <div class="login-header"><h1>管理员登录</h1></div>
      </header>
    </div>
    <div class="login-background">
      <div class="login-main">
        <img src="../assets/images/bg.png" alt="bg" class="login-bgimg">
        <div class="login-form">
          <el-form :model="adminLogin" :rules="rules" ref="adminLogin" class="login-form-contain">
            <el-form-item prop="phone">
              <el-input
                  style="width: 300px"
                  class="login-input"
                  placeholder="管理员名"
                  prefix-icon="el-icon-user"
                  v-model="adminLogin.adminName"
                  clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                  style="width:300px"
                  class="login-input"
                  placeholder="密码"
                  prefix-icon="el-icon-lock"
                  v-model="adminLogin.password"
                  show-password
                  clearable>
              </el-input>
            </el-form-item>
            <JcRange status="status"></JcRange>
            <br>
            <el-button type="primary" round @click="submitForm('adminLogin')">登录</el-button>

          </el-form>

        </div>
      </div>
    </div>
    <c-footer></c-footer>

  </div>
</template>

<script>
import JcRange from "@/components/JcRange";
import CFooter from "@/components/Footer";

export default {
  name: "Login",
  components: {
    JcRange,
    CFooter
  },
  data() {
    return {
      status: false,
      adminLogin: {
        adminName: '',
        password: ''
      },
      rules: {
        adminName: [
          { required: true, message: '请输入管理员名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.status === true) {
            this.$axios.post('http://localhost:8181/admin/isExist/' + this.adminLogin.adminName).then((resp) => {
              if (resp.data === true) {
                this.$axios.post('http://localhost:8181/admin/adminCheckPassword' , this.adminLogin).then((resp) => {
                  if (resp.data === true) {
                    this.$axios.post('http://localhost:8181/admin/adminLogin',this.adminLogin).then((resp)=> {
                      console.log(resp.data)
                      if('已停用'!==resp.data.status){
                        this.$message({
                          message: '登录成功',
                          type: 'success'
                        });
                        const admin = resp.data;
                        window.sessionStorage.setItem("adminId",admin.adminId)
                        window.sessionStorage.setItem("authority",admin.authority)
                        window.sessionStorage.setItem("token",admin.token)
                        this.$router.push('/')
                      }else{
                        this.$message.error('账号已停用！');
                      }
                    })

                  }else {
                    this.$message.error('密码错误！');

                  }
                })

              }else {
                this.$message.error('账号不存在！');
              }
            })

          }else {
            this.$message.error('请拖动验证滑块');
            return false;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}

</script>

<style lang="less" >
@import "../assets/style/common";

.login-header-bg{
  background-color: #fff;
}

.login-header{
  margin: 20px;
}

.login-background{
  background-color: @color2;
  //background-color: #414dd9;
  //background-color: @main-color;
  width: 100%;
  height: 550px;
}

.login-main{
  width: 1200px;
  margin: 0 auto;
  .between-center;
  padding: 30px;
}

.login-bgimg{
  height: 500px;
  //width: 500px;
}

.login-form{
  width: 400px;
  background-color: white;
  padding: 30px;
  border-radius: 4px

}

.login-form-contain{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-input{
  width: 300px;
  display: block;
}

</style>
