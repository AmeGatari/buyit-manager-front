<template>
  <div>
    <el-table
        :data="categorys"
        @sort-change="handleSortChange"
        style="width: 100%"
        height="550">
      <el-table-column
          fixed
          sortable="custom"
          prop="categoryId"
          label="分类编号">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="categoryKey"
          label="分类索引词">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="categoryName"
          label="分类名">
      </el-table-column>

      <el-table-column
          fixed="right"
          width="220">
        <template slot="header">
          <el-button type="primary" round @click="addCategoryDialogFormVisible=true">添加分类</el-button>
        </template>

        <template slot-scope="scope">

          <el-tooltip content="修改分类信息" placement="top">
            <el-button type="primary" circle plain @click="categoryEdit(scope.$index, scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="删除分类" placement="top">
            <el-button type="danger" circle plain @click="categoryDelete(scope.$index, scope.row)">
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

    <!--分类添加对话框-->
    <el-dialog title="添加分类" :visible.sync="addCategoryDialogFormVisible">

      <el-form :model="addCategoryData" :rules="categoryRules" ref="addCategoryData" :inline="true">

        <el-form-item label="分类索引词" prop="categoryKey">
          <el-input v-model="addCategoryData.categoryKey" clearable></el-input>
        </el-form-item>

        <el-form-item label="分类名" prop="categoryName">
          <el-input v-model="addCategoryData.categoryName" clearable></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCategoryAdd('addCategoryData')">确 定</el-button>
      </div>
    </el-dialog>

    <!--分类编辑对话框-->
    <el-dialog title="编辑分类分类信息" :visible.sync="editCategoryDialogFormVisible">

      <el-form :model="editCategoryData" :rules="categoryRules" ref="editCategoryData" :inline="true">

        <el-form-item label="分类编号">
          <el-input v-model="editCategoryData.categoryId" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="分类索引词" prop="categoryKey">
          <el-input v-model="editCategoryData.categoryKey" clearable></el-input>
        </el-form-item>

        <el-form-item label="分类名" prop="categoryName">
          <el-input v-model="editCategoryData.categoryName" clearable></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editCategoryDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCategoryEdit('editCategoryData')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      categorys: [],
      addCategoryData: {},
      editCategoryData: {},
      editCategoryDialogFormVisible: false,
      addCategoryDialogFormVisible: false,
      currentPage: 1,
      listInfo: {
        start: 0,
        pageSize: 5,
        prop: 'categoryId',
        order: 'asc',
      },
      total: 0,
      // 输入验证
      categoryRules: {

        categoryKey: [
          {required: true, message: '请输入分类索引词', trigger: 'blur'},
        ],
        categoryName: [
          {required: true, message: '请输入分类名', trigger: 'blur'}
        ],

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
      this.$axios.post('http://localhost:8181/category/findAllCategoryByPage', this.listInfo).then((resp) => {
        console.log(resp.data)
        this.categorys = resp.data
      })
      this.loading = false
    },

    totalCount() {
      this.$axios.post('http://localhost:8181/category/categoryCount').then((resp) => {
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

    saveCategoryAdd(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          // this.$axios.post('http://localhost:8181/category/isExistCategory/' + this.addCategoryData.categoryName).then((resp) => {
          //   if (resp.data !== true) {
              this.$axios.post('http://localhost:8181/category/createCategory', this.addCategoryData).then((resp) => {
                if (resp.data > 0) {
                  this.$message({
                    message: '分类已添加',
                    type: 'success'
                  });
                }
                this.getData()

              })
              this.addCategoryDialogFormVisible = false

            // } else {
            //   this.$message.error('添加失败，分类索引词已存在');

            }
          // })
        // }
      })
    },


    categoryEdit(index, row) {
      console.log(index, row);
      this.editCategoryData = row
      this.editCategoryDialogFormVisible = true
    },

    saveCategoryEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8181/category/setCategoryInfo', this.editCategoryData).then((resp) => {
            if (resp.data > 0) {
              this.$message({
                message: '分类信息已修改',
                type: 'success'
              });
            }
            this.getData()

          })
          this.editCategoryDialogFormVisible = false
        }
      })

    },

    categoryDelete(index, row) {
      this.$confirm('确认删除此分类?', '提示', {
        confirmButtonText: '删除分类',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/category/deleteCategoryByCategoryId/' + row.categoryId).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '分类已删除',
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

