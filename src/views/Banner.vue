<template>
  <div>
    <el-table
        :data="banners"
        @sort-change="handleSortChange"
        style="width: 100%"
        height="550">
      <el-table-column
          fixed
          sortable="custom"
          prop="bannerId"
          label="轮播图编号">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="bannerName"
          label="轮播图名">
      </el-table-column>
      <el-table-column label="轮播图预览">
        <template slot-scope="scope">
          <el-image :src="scope.row.bannerPath" style="height: 70px" fit="contain"
                    :preview-src-list="[scope.row.bannerPath]">
            <div slot="error" class="image-slot">
              轮播图未设置
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="link"
          label="导向链接">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="priority"
          label="优先级">
      </el-table-column>


      <el-table-column
          fixed="right"
          width="180">
        <template slot="header">
          <el-button type="primary" round @click="addBannerDialogFormVisible=true">添加轮播图</el-button>
        </template>

        <template slot-scope="scope">

          <el-tooltip content="修改轮播图信息" placement="top">
            <el-button type="primary" circle plain @click="bannerEdit(scope.$index, scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="删除轮播图" placement="top">
            <el-button type="danger" circle plain @click="bannerDelete(scope.$index, scope.row)">
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

    <!--轮播图添加对话框-->
    <el-dialog title="添加轮播图" :visible.sync="addBannerDialogFormVisible">

      <el-form :model="addBannerData" :rules="bannerRules" ref="addBannerData" :inline="true">

        <el-form-item label="轮播图名" prop="bannerName">
          <el-input v-model="addBannerData.bannerName" clearable></el-input>
        </el-form-item>

        <el-form-item label="导向链接" prop="link">
          <el-input v-model="addBannerData.link" clearable></el-input>
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model="editBannerData.priority" :min="1" label="优先级"></el-input-number>
        </el-form-item>

        <el-upload
            ref="addBannerUpload"
            action="http://localhost:8181/upload"
            :before-upload="beforeUpload"
            :auto-upload="false"
            list-type="picture-card"
            accept="image/*"
            :limit="1"
            name="picture"
            :data="addBannerUploadData"
            :file-list="addBannerFilelist">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">点击上传轮播图片，只能上传jpg/png文件,且不超过5M</div>
        </el-upload>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addBannerDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBannerAdd('addBannerData')">确 定</el-button>
      </div>
    </el-dialog>

    <!--轮播图编辑对话框-->
    <el-dialog title="编辑轮播图信息" :visible.sync="editBannerDialogFormVisible">

      <el-form :model="editBannerData" :rules="bannerRules" ref="editBannerData" :inline="true">

        <el-form-item label="轮播图编号">
          <el-input v-model="editBannerData.bannerId" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="轮播图名" prop="bannerName">
          <el-input v-model="editBannerData.bannerName" clearable></el-input>
        </el-form-item>

        <el-form-item label="导向链接" prop="link">
          <el-input v-model="editBannerData.link" clearable></el-input>
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model="editBannerData.priority" :min="1" label="优先级"></el-input-number>
        </el-form-item>

        <el-upload
            ref="editBannerUpload"
            action="http://localhost:8181/upload"
            :before-upload="beforeUpload"
            :auto-upload="false"
            list-type="picture-card"
            accept="image/*"
            :limit="1"
            name="picture"
            :data="{uploadType:'banner',id:editBannerData.bannerId}"
            :file-list="editBannerFilelist">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">点击上传轮播图片，只能上传jpg/png文件,且不超过2M</div>
        </el-upload>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editBannerDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBannerEdit('editBannerData')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Banner",
  data() {

    return {
      banners: [],
      addBannerData: {},
      addBannerUploadData:{
        uploadType:'banner',
        id:0
      },
      addBannerId:0,
      editBannerData: {},
      editBannerDialogFormVisible: false,
      addBannerDialogFormVisible: false,
      currentPage: 1,
      listInfo: {
        start: 0,
        pageSize: 5,
        prop: 'bannerId',
        order: 'asc',
      },
      total: 0,
      addBannerFilelist: [],
      editBannerFilelist: [],
      // 输入验证
      bannerRules: {
        bannerName: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        link:[
          {required: true, message: '请输入导向链接', trigger: 'blur'}
        ],
        priority:[
          {required: true, message: '请输入优先级', trigger: 'blur'}
        ]
      }

    }
  },
  created() {
    this.totalCount()
    this.getData()
  },
  methods: {

    getData() {
      this.$axios.post('http://localhost:8181/banner/findAllBannerByPage', this.listInfo).then((resp) => {
        console.log(resp.data)
        this.banners = resp.data
      })
    },

    totalCount() {
      this.$axios.post('http://localhost:8181/banner/bannerCount').then((resp) => {
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
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isIMG) {
        this.$message.error('只能上传图片文件!');
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!');
      }
      return isIMG && isLt5M;
    },


    saveBannerAdd(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {

          this.$axios.post('http://localhost:8181/banner/addBanner', this.addBannerData).then((resp) => {
            if (resp.data > 0) {
              console.log(resp.data)
              this.addBannerUploadData.id=resp.data
              this.$refs.addBannerUpload.submit()
              this.$message({
                message: '轮播图已添加',
                type: 'success'
              });
            }else {
              this.$message.error('轮播图添加失败!');
            }
            this.getData()

          })
          this.addBannerDialogFormVisible = false

        }
      })
    },


    bannerEdit(index, row) {
      console.log(index, row);
      this.editBannerData = row
      this.editBannerDialogFormVisible = true
    },

    saveBannerEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$refs.editBannerUpload.submit()
          this.$axios.post('http://localhost:8181/banner/updateBanner', this.editBannerData).then((resp) => {
            if (resp.data > 0) {
              this.$message({
                message: '轮播图信息已修改',
                type: 'success'
              });
            }
            this.getData()

          })
          this.editBannerDialogFormVisible = false

        }
      })

    },

    bannerDelete(index, row) {
      this.$confirm('确认删除此轮播图?', '提示', {
        confirmButtonText: '删除轮播图',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/banner/deleteBannerByBannerId/' + row.bannerId).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '轮播图已删除',
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
