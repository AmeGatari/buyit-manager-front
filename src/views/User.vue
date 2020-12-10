<template>
  <div>
    <el-table
        :data="users"
        @sort-change="handleSortChange"
        style="width: 100%"
        height="550">
      <el-table-column
          fixed
          sortable="custom"
          prop="userId"
          label="用户ID">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="phone"
          label="手机号">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="userName"
          label="昵称">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="sex"
          label="性别">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="birthday"
          label="出生日期">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="status"
          label="用户状态">
      </el-table-column>

      <el-table-column label="头像">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.avatar" icon="el-icon-user-solid"></el-avatar>
        </template>
      </el-table-column>

      <el-table-column
          fixed="right"
          width="220">
        <template slot="header">
          <el-button type="primary" round @click="addUserDialogFormVisible=true">添加用户</el-button>
        </template>

        <template slot-scope="scope">

          <el-tooltip content="修改用户账号信息" placement="top">
            <el-button type="primary" circle plain @click="userEdit(scope.$index, scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="修改密码" placement="top">
            <el-button type="primary" circle plain @click="setPassword(scope.$index, scope.row)">
              <i class="el-icon-key"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip v-if="scope.row.status==='已启用'" content="停用用户账号" placement="top">
            <el-button type="warning" circle plain @click="userBan(scope.$index, scope.row)">
              <i class="el-icon-remove-outline"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip v-else-if="scope.row.status==='已停用'" content="启用用用户账号" placement="top">
            <el-button type="success" circle plain @click="userUnblock(scope.$index, scope.row)">
              <i class="el-icon-circle-check"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="删除用户账号" placement="top">
            <el-button type="danger" circle plain @click="userDelete(scope.$index, scope.row)">
              <i class="el-icon-delete"></i>
            </el-button>
          </el-tooltip>

        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        background
        :current-page.sync="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="listInfo.pageSize"
        :page-sizes="[5, 20, 50, 100, 500]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :total="total">
    </el-pagination>

    <!--用户添加对话框-->
    <el-dialog title="添加用户" :visible.sync="addUserDialogFormVisible">

      <el-form :model="addUserData" :rules="userRules" ref="addUserData" :inline="true">

        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="addUserData.phone" clearable></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="userName">
          <el-input v-model="addUserData.userName" clearable></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserData.password" clearable show-password></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="password2">
          <el-input v-model="addUserData.password2" clearable show-password></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserAdd('addUserData')">确 定</el-button>
      </div>
    </el-dialog>

    <!--用户编辑对话框-->
    <el-dialog title="编辑用户账号信息" :visible.sync="editUserDialogFormVisible">

      <el-form :model="editUserData" :rules="userRules" ref="editUserData" :inline="true">

        <el-form-item label="用户ID">
          <el-input v-model="editUserData.userId" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="editUserData.phone" clearable></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="userName">
          <el-input v-model="editUserData.userName" clearable></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="editUserData.sex">
            <el-radio label="男" border>男</el-radio>
            <el-radio label="女" border>女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="出生日期">
          <el-date-picker
              v-model="editUserData.birthday"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-upload
            ref="avatarUpload"
            action="http://localhost:8181/upload"
            :before-upload="beforeUpload"
            :auto-upload="false"
            list-type="picture-card"
            accept="image/*"
            :limit="1"
            name="picture"
            :data="{uploadType:'avatar',id:editUserData.userId}"
            :file-list="avatarFilelist">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">点击上传用户头像，只能上传jpg/png文件,且不超过2M</div>
        </el-upload>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserEdit('editUserData')">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改密码对话框-->
    <el-dialog title="修改用户密码" :visible.sync="setPasswordDialogFormVisible">

      <el-form :model="userPassword" :rules="setPasswordRules" ref="userPassword" :inline="true">

        <el-form-item label="密码" prop="password">
          <el-input v-model="userPassword.password" clearable show-password></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="password2">
          <el-input v-model="userPassword.password2" clearable show-password></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="setPasswordDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetPassword('userPassword')">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    let validatePassword = (rule, value, callback) => {
      if (value !== this.addUserData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    let validateChangePassword = (rule, value, callback) => {
      if (value !== this.userPassword.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      users: [],
      addUserData: {},
      editUserData: {},
      userPassword: {},
      editUserDialogFormVisible: false,
      addUserDialogFormVisible: false,
      setPasswordDialogFormVisible: false,
      currentPage: 1,
      listInfo: {
        start: 0,
        pageSize: 5,
        prop: 'userId',
        order: 'asc',
      },
      total: 0,
      avatarFilelist: [],
      // 输入验证
      userRules: {
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          // {type: 'number', message: '请输入正确的手机号', trigger: 'blur'},
          {pattern: /^1[345789]{1}\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        userName: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        password2: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          {validator: validatePassword, trigger: 'blur'}
        ]
      },
      setPasswordRules: {
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        password2: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          {validator: validateChangePassword, trigger: 'blur'}
        ]
      },


    }
  },
  created() {
    this.totalCount()
    this.getData()
  },
  methods: {

    getData() {
      this.loading = true
      this.$axios.post('http://localhost:8181/user/findAllUserByPage', this.listInfo).then((resp) => {
        console.log(resp.data)
        this.users = resp.data
      })
      this.loading = false
    },

    totalCount() {
      this.$axios.post('http://localhost:8181/user/userCount').then((resp) => {
        console.log(resp.data)
        this.total = resp.data
      })
    },


    handleCurrentChange(page) {
      this.listInfo.start = (page - 1) * this.listInfo.pageSize
      this.getData()
    },

    handleSizeChange(pageSize) {
      this.listInfo.pageSize = pageSize
      this.getData()
    },

    handleSortChange(column) {
      this.listInfo.start = 0
      this.currentPage = 1
      this.listInfo.prop = column.prop
      if (column.order === 'descending') {
        this.listInfo.order = 'desc'
      } else {
        this.listInfo.order = 'asc'
      }
      this.getData()
    },

    beforeUpload(file) {
      const isIMG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isIMG) {
        this.$message.error('只能上传图片文件!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isIMG && isLt2M;
    },


    setPassword(index, row){
      this.userPassword = row
      this.setPasswordDialogFormVisible = true
    },

    saveSetPassword(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8181/user/setUserPassword', this.userPassword).then((resp) => {
            if (resp.data > 0) {
              this.$message({
                message: '密码已修改',
                type: 'success'
              });
            }
            this.getData()

          })
          this.setPasswordDialogFormVisible = false

        }
      })
    },

    saveUserAdd(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8181/user/isRegistered/' + this.addUserData.phone).then((resp) => {
            if (resp.data !== true) {
              this.$axios.post('http://localhost:8181/user/register', this.addUserData).then((resp) => {
                if (resp.data > 0) {
                  this.$message({
                    message: '账号已添加',
                    type: 'success'
                  });
                }
                this.getData()

              })
              this.addUserDialogFormVisible = false

            } else {
              this.$message.error('账号添加失败，手机号已被注册');

            }
          })
        }
      })
    },


    userEdit(index, row) {
      console.log(index, row);
      this.editUserData = row
      this.editUserDialogFormVisible = true
    },

    saveUserEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$refs.avatarUpload.submit()
          this.$axios.post('http://localhost:8181/user/setUserInfo', this.editUserData).then((resp) => {
            if (resp.data > 0) {
              this.$message({
                message: '用户信息已修改',
                type: 'success'
              });
            }
            this.getData()

          })
          this.editUserDialogFormVisible = false

        }
      })

    },

    userBan(index, row) {
      this.$confirm('确认停用此账号?', '提示', {
        confirmButtonText: '停用账号',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/user/banUserByUserId/' + row.userId).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '账号已停用',
              type: 'success'
            });
          }
          this.getData()
          this.totalCount()
        })
      })
    },

    userUnblock(index, row) {
      this.$confirm('确认启用此账号?', '提示', {
        confirmButtonText: '启用账号',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/user/unblockUserByUserId/' + row.userId).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '账号已启用',
              type: 'success'
            });
          }
          this.getData()
          this.totalCount()
        })
      })
    },

    userDelete(index, row) {
      this.$confirm('确认删除此账号?', '提示', {
        confirmButtonText: '删除账号',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/user/deleteUserByUserId/' + row.userId).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '账号已删除',
              type: 'success'
            });
          }
          this.getData()
          this.totalCount()
        })
      })
    },

  }
}
</script>

<style lang="less" scoped>
@import "../assets/style/common";

</style>
