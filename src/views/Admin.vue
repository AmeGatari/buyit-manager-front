<template>
  <div>
    <el-table
        :data="admins"
        @sort-change="handleSortChange"
        style="width: 100%"
        height="550">
      <el-table-column
          fixed
          sortable="custom"
          prop="adminId"
          label="管理员ID">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="adminName"
          label="管理员名">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="authority"
          label="权限类型">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="status"
          label="管理员状态">
      </el-table-column>

      <el-table-column
          fixed="right"
          width="220">
        <template slot="header">
          <el-button type="primary" round @click="addAdminDialogFormVisible=true">添加管理员</el-button>
        </template>

        <template slot-scope="scope">

          <el-tooltip content="修改管理员账号信息" placement="top">
            <el-button type="primary" circle plain @click="adminEdit(scope.$index, scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="修改密码" placement="top">
            <el-button type="primary" circle plain @click="setPassword(scope.$index, scope.row)">
              <i class="el-icon-key"></i>
            </el-button>
          </el-tooltip>


          <el-tooltip v-if="scope.row.status==='已启用'" content="停用管理员账号" placement="top">
            <el-button type="warning" circle plain @click="adminBan(scope.$index, scope.row)">
              <i class="el-icon-remove-outline"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip v-else-if="scope.row.status==='已停用'" content="启用用管理员账号" placement="top">
            <el-button type="success" circle plain @click="adminUnblock(scope.$index, scope.row)">
              <i class="el-icon-circle-check"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="删除管理员账号" placement="top">
            <el-button type="danger" circle plain @click="adminDelete(scope.$index, scope.row)">
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

    <!--管理员添加对话框-->
    <el-dialog title="添加管理员" :visible.sync="addAdminDialogFormVisible">

      <el-form :model="addAdminData" :rules="adminRules" ref="addAdminData" :inline="true">

        <el-form-item label="管理员名" prop="adminName">
          <el-input v-model="addAdminData.adminName" clearable></el-input>
        </el-form-item>

        <el-form-item label="权限类型">
          <el-radio-group v-model="addAdminData.authority">
            <el-radio label="普通管理员" border>普通管理员</el-radio>
            <el-radio label="超级管理员" border>超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addAdminData.password" clearable show-password></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="password2">
          <el-input v-model="addAdminData.password2" clearable show-password></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addAdminDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdminAdd('addAdminData')">确 定</el-button>
      </div>
    </el-dialog>

    <!--管理员编辑对话框-->
    <el-dialog title="编辑管理员账号信息" :visible.sync="editAdminDialogFormVisible">

      <el-form :model="editAdminData" :rules="adminRules" ref="editAdminData" :inline="true">

        <el-form-item label="管理员ID">
          <el-input v-model="editAdminData.adminId" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="管理员名" prop="adminName">
          <el-input v-model="editAdminData.adminName" clearable></el-input>
        </el-form-item>

        <el-form-item label="权限类型">
          <el-radio-group v-model="editAdminData.authority">
            <el-radio label="普通管理员" border>普通管理员</el-radio>
            <el-radio label="超级管理员" border>超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editAdminDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdminEdit('editAdminData')">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改密码对话框-->
    <el-dialog title="修改管理员密码" :visible.sync="setPasswordDialogFormVisible">

      <el-form :model="adminPassword" :rules="setPasswordRules" ref="adminPassword" :inline="true">

        <el-form-item label="密码" prop="password">
          <el-input v-model="adminPassword.password" clearable show-password></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="password2">
          <el-input v-model="adminPassword.password2" clearable show-password></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="setPasswordDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetPassword('adminPassword')">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "Admin",
  data() {
    let validatePassword = (rule, value, callback) => {
      if (value !== this.addAdminData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    let validateChangePassword = (rule, value, callback) => {
      if (value !== this.adminPassword.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      admins: [],
      addAdminData: {},
      editAdminData: {},
      adminPassword: {},
      editAdminDialogFormVisible: false,
      addAdminDialogFormVisible: false,
      setPasswordDialogFormVisible: false,
      currentPage: 1,
      listInfo: {
        start: 0,
        pageSize: 5,
        prop: 'adminId',
        order: 'asc',
      },
      total: 0,
      // 输入验证
      adminRules: {
        adminName: [
          {required: true, message: '请输入管理员名', trigger: 'blur'}
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
      this.$axios.post('http://localhost:8181/admin/findAllAdminByPage', this.listInfo).then((resp) => {
        console.log(resp.data)
        this.admins = resp.data
      })
      this.loading = false
    },

    totalCount() {
      this.$axios.post('http://localhost:8181/admin/adminCount').then((resp) => {
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

    saveAdminAdd(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8181/admin/isExist/' + this.addAdminData.adminName).then((resp) => {
            if (resp.data !== true) {
              this.$axios.post('http://localhost:8181/admin/createAdmin', this.addAdminData).then((resp) => {
                if (resp.data > 0) {
                  this.$message({
                    message: '管理员已添加',
                    type: 'success'
                  });
                }
                this.getData()

              })
              this.addAdminDialogFormVisible = false

            } else {
              this.$message.error('添加失败，管理员名已存在');

            }
          })
        }
      })
    },

    saveSetPassword(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8181/admin/setAdminPassword', this.adminPassword).then((resp) => {
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


    adminEdit(index, row) {
      console.log(index, row);
      this.editAdminData = row
      this.editAdminDialogFormVisible = true
    },

    saveAdminEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8181/admin/setAdminInfo', this.editAdminData).then((resp) => {
            if (resp.data > 0) {
              this.$message({
                message: '管理员信息已修改',
                type: 'success'
              });
            }
            this.getData()

          })
          this.editAdminDialogFormVisible = false
        }
      })

    },

    setPassword(index, row){
      this.adminPassword = row
      this.setPasswordDialogFormVisible = true
    },

    adminBan(index, row) {
      this.$confirm('确认停用此管理员账号?', '提示', {
        confirmButtonText: '停用账号',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/admin/disableAdminByAdminId/' + row.adminId).then((resp) => {
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

    adminUnblock(index, row) {
      this.$confirm('确认启用此管理员账号?', '提示', {
        confirmButtonText: '启用账号',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/admin/enableAdminByAdminId/' + row.adminId).then((resp) => {
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

    adminDelete(index, row) {
      this.$confirm('确认删除此管理员账号?', '提示', {
        confirmButtonText: '删除账号',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/admin/deleteAdminByAdminId/' + row.adminId).then((resp) => {
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

