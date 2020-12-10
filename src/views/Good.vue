<template>
  <div>
    <el-table
        :data="goods"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @sort-change="handleSortChange"
        @expand-change="expandChange"
        style="width: 100%"
        height="550">

      <!--      扩展表格显示SKU内容-->
      <el-table-column type="expand">
        <template>
          <el-table :data="skuOfCurrentGood" size="small">
            <el-table-column prop="skuId" label="SKU编号" sortable></el-table-column>
            <el-table-column prop="color" label="颜色" sortable></el-table-column>
            <el-table-column prop="version" label="版本" sortable></el-table-column>
            <el-table-column prop="price" label="售价" sortable></el-table-column>
            <el-table-column prop="stock" label="库存" sortable></el-table-column>
            <el-table-column label="SKU主图">
              <template slot-scope="scope">
                <el-image :src="scope.row.skuImg" style="height: 70px" fit="contain"
                          :preview-src-list="[scope.row.skuImg]"></el-image>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-tooltip content="编辑SKU" placement="top">
                  <el-button type="primary" circle plain @click="skuEdit(scope.$index, scope.row)">
                    <i class="el-icon-edit"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="下架" placement="top">
                  <el-button type="warning" circle plain @click="skuOffShelf(scope.$index, scope.row)">
                    <i class="el-icon-sold-out"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="删除SKU" placement="top">
                  <el-button type="danger" circle plain @click="skuDelete(scope.$index, scope.row)">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="设为主SKU" placement="top">
                  <el-button type="success" circle plain @click="setDefaultSku(scope.$index, scope.row)">
                    <i class="el-icon-s-flag"></i>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column
          sortable="custom"
          prop="goodId"
          label="商品编号">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="goodName"
          label="商品名">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="slogan"
          label="宣传语">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="categoryKey"
          label="商品分类">
      </el-table-column>
      <el-table-column label="商品详情图">
        <template slot-scope="scope">
          <el-image :src="scope.row.detailImg" style="height: 70px" fit="contain"
                    :preview-src-list="[scope.row.detailImg]"></el-image>
        </template>
      </el-table-column>

      <el-table-column
          sortable="custom"
          prop="defaultSkuId"
          label="主SKU编号">
      </el-table-column>
      <el-table-column
          label="操作"
          width="180">
        <!--        添加商品按钮-->
        <template slot="header">
          <el-button type="primary" round @click="addGoodDialogFormVisible=true">添加商品</el-button>
        </template>
        <template slot-scope="scope">

          <el-tooltip content="添加附属SKU" placement="top">
            <el-button type="success" circle plain @click="addSku(scope.$index, scope.row)">
              <i class="el-icon-plus"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="编辑商品" placement="top">
            <el-button type="primary" circle plain @click="goodEdit(scope.$index, scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="删除商品" placement="top">
            <el-button type="danger" circle plain @click="goodDelete(scope.$index, scope.row)">
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

    <!--商品编辑对话框-->
    <el-dialog title="编辑商品信息" :visible.sync="goodDialogFormVisible">

      <el-form :model="editGood" :rules="goodRules" ref="editGood" :inline="true">

        <el-form-item label="商品编号">
          <el-input v-model="editGood.goodId" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="商品名" prop="goodName">
          <el-input v-model="editGood.goodName" clearable></el-input>
        </el-form-item>

        <el-form-item label="宣传语">
          <el-input v-model="editGood.slogan" clearable></el-input>
        </el-form-item>

        <el-form-item label="商品分类" prop="categoryKey">
          <!--          <el-input v-model="editGood.categoryKey" clearable></el-input>-->
          <el-select v-model="editGood.categoryKey" placeholder="请选择商品分类">
            <el-option
                v-for="item in categories"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryKey">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="主SKU编号">
          <el-input-number v-model="editGood.defaultSkuId" :min="0" label="主SKU编号"></el-input-number>
        </el-form-item>

        <el-upload
            ref="detailImgUpload"
            action="http://localhost:8181/upload"
            :before-upload="beforeUpload"
            :auto-upload="false"
            list-type="picture-card"
            accept="image/*"
            :limit="1"
            name="picture"
            :data="{uploadType:'detailImg',id:editGood.goodId}"
            :file-list="detailImgFilelist">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">点击上传商品详情图，只能上传jpg/png文件,且不超过5M</div>
        </el-upload>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="goodDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGoodEdit('editGood')">确 定</el-button>
      </div>
    </el-dialog>

    <!--商品添加对话框-->
    <el-dialog title="添加商品" :visible.sync="addGoodDialogFormVisible">

      <el-form :model="addGood" :rules="goodRules" ref="addGood" :inline="true">

        <el-form-item label="商品名" prop="goodName">
          <el-input v-model="addGood.goodName"></el-input>
        </el-form-item>

        <el-form-item label="宣传语">
          <el-input v-model="addGood.slogan"></el-input>
        </el-form-item>

        <el-form-item label="商品分类" prop="categoryKey">
          <el-select v-model="addGood.categoryKey" placeholder="请选择商品分类">
            <el-option
                v-for="item in categories"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryKey">
            </el-option>
          </el-select>
        </el-form-item>

        <el-upload
            ref="addDetailImgUpload"
            action="http://localhost:8181/upload"
            :before-upload="beforeUpload"
            :auto-upload="false"
            list-type="picture-card"
            accept="image/*"
            :limit="1"
            name="picture"
            :data="addGoodUpload"
            :file-list="addDetailImgFilelist">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">点击上传商品详情图，只能上传jpg/png文件,且不超过5M</div>
        </el-upload>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addGoodDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="goodAdd('addGood')">确 定</el-button>
      </div>
    </el-dialog>

    <!--SKU编辑对话框-->
    <el-dialog title="编辑SKU信息" :visible.sync="skuDialogFormVisible">

      <el-form :model="editSku" :rules="skuRules" ref="editSku" :inline="true">

        <el-form-item label="SKU编号">
          <el-input v-model="editSku.skuId" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="颜色" prop="color">
          <el-input v-model="editSku.color" clearable></el-input>
        </el-form-item>

        <el-form-item label="版本" prop="version">
          <el-input v-model="editSku.version" clearable></el-input>
        </el-form-item>

        <el-form-item label="售价" prop="price">
          <el-input-number v-model="editSku.price" :min="0.01" :precision="2" label="售价"></el-input-number>
        </el-form-item>

        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="editSku.stock" :min="0" label="库存"></el-input-number>
        </el-form-item>

        <el-upload
            ref="skuImgUpload"
            action="http://localhost:8181/upload"
            :before-upload="beforeUpload"
            :auto-upload="false"
            list-type="picture-card"
            accept="image/*"
            :limit="1"
            name="picture"
            :data="{uploadType:'skuImg',id:editSku.skuId}"
            :file-list="skuImgFilelist">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">点击上传SKU主图，只能上传jpg/png文件,且不超过5M</div>
        </el-upload>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="skuDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSkuEdit('editSku')">确 定</el-button>
      </div>
    </el-dialog>

    <!--SKU添加对话框-->
    <el-dialog title="添加SKU" :visible.sync="addSkuDialogFormVisible">

      <el-form :model="addSkuData" :rules="skuRules" ref="addSkuData" :inline="true">

        <el-form-item label="商品编号">
          <el-input v-model="addSkuData.goodId" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="颜色" prop="color">
          <el-input v-model="addSkuData.color" clearable></el-input>
        </el-form-item>

        <el-form-item label="版本" prop="version">
          <el-input v-model="addSkuData.version" clearable></el-input>
        </el-form-item>

        <el-form-item label="售价" prop="price">
          <el-input-number v-model="addSkuData.price" :min="0.01" :precision="2" label="售价"></el-input-number>
        </el-form-item>

        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="addSkuData.stock" :min="0" label="库存" clearable></el-input-number>

        </el-form-item>

        <el-upload
            ref="addSkuImgUpload"
            action="http://localhost:8181/upload"
            :before-upload="beforeUpload"
            :auto-upload="false"
            list-type="picture-card"
            accept="image/*"
            :limit="1"
            name="picture"
            :data="addSkuUpload"
            :file-list="addSkuImgFilelist">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">点击上传SKU主图，只能上传jpg/png文件,且不超过5M</div>
        </el-upload>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addSkuDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSkuAdd('addSkuData')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Good",
  data() {
    return {
      goods: [],
      categories: [],
      goodDialogFormVisible: false,
      addGoodDialogFormVisible: false,
      skuDialogFormVisible: false,
      addSkuDialogFormVisible: false,
      editGood: [],
      addGood: {},
      addGoodUpload: {uploadType: 'detailImg', id: 0},
      editSku: [],
      addSkuData: {},
      addSkuUpload: {uploadType: 'skuImg', id: 0},
      currentGoodId: '',
      currentPage: 1,
      skuOfCurrentGood: [],
      listInfo: {
        start: 0,
        pageSize: 5,
        prop: 'goodId',
        order: 'asc',
      },
      total: 0,
      expands: [],
      getRowKeys(row) {
        return row.goodId
      },
      detailImgFilelist: [],
      addDetailImgFilelist: [],
      skuImgFilelist: [],
      addSkuImgFilelist: [],

      goodRules: {
        goodName: [
          {required: true, message: '请输入商品名', trigger: 'blur'},
        ],
        categoryKey: [
          {required: true, message: '请输入商品分类', trigger: 'blur'}
        ],

      },

      skuRules: {
        color: [
          {required: true, message: '请输入颜色信息', trigger: 'blur'},
        ],
        version: [
          {required: true, message: '请输入版本信息', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '请输入售价信息', trigger: 'blur'}
        ],
        stock: [
          {required: true, message: '请输入库存信息', trigger: 'blur'}
        ],
      },

    }
  },
  created() {
    this.getCategory()
    this.totalCount()
    this.getData()
  },
  methods: {

    getCategory() {
      this.$axios.post('http://localhost:8181/category/findAllCategory').then((resp) => {
        console.log(resp.data)
        this.categories = resp.data
      })

    },

    getData() {
      this.$axios.post('http://localhost:8181/good/findAllGoodByPage', this.listInfo).then((resp) => {
        console.log(resp.data)
        this.goods = resp.data
      })
    },

    getSkuData() {
      this.$axios.post('http://localhost:8181/sku/findSkuByGoodId/' + this.currentGoodId).then((resp) => {
        this.skuOfCurrentGood.splice(0, this.skuOfCurrentGood.length)
        resp.data.forEach((item, index) => {
          this.$set(this.skuOfCurrentGood, index, item)
        })
      })
    },

    totalCount() {
      this.$axios.post('http://localhost:8181/good/goodCount').then((resp) => {
        console.log(resp.data)
        this.total = resp.data
      })
    },

    goodEdit(index, row) {
      console.log(index, row);
      this.editGood = row
      this.goodDialogFormVisible = true
    },

    skuEdit(index, row) {
      console.log(index, row);
      this.editSku = row
      this.skuDialogFormVisible = true
    },

    saveGoodEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$refs.detailImgUpload.submit()
          this.$axios.post('http://localhost:8181/good/updateGood', this.editGood).then((resp) => {
            if (resp.data > 0) {
              this.$message({
                message: '商品信息已修改',
                type: 'success'
              });
            }
            this.getData()

          })
          this.goodDialogFormVisible = false
        }
      })

    },

    goodAdd(form) {
      // this.$refs.addDetailImgUpload.submit()
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8181/good/insertGood', this.addGood).then((resp) => {
            if (resp.data > 0) {
              this.addGoodUpload.id = resp.data
              this.$refs.addDetailImgUpload.submit()
              this.$message({
                message: '商品已添加',
                type: 'success'
              });
            }
            this.totalCount()
            this.getData()
          })
          this.addGoodDialogFormVisible = false
        }

      })

    },

    saveSkuEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$refs.skuImgUpload.submit()
          this.$axios.post('http://localhost:8181/sku/updateSku', this.editSku).then((resp) => {
            if (resp.data > 0) {
              this.$message({
                message: 'SKU信息已修改',
                type: 'success'
              });
            }
            this.getSkuData()

          })
          this.skuDialogFormVisible = false
        }
      })

    },

    saveSkuAdd(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8181/sku/insertSku', this.addSkuData).then((resp) => {
            if (resp.data > 0) {
              this.addSkuUpload.id = resp.data
              this.$refs.addSkuImgUpload.submit()
              this.$message({
                message: 'SKU已添加',
                type: 'success'
              });
            }

          })
          this.addSkuDialogFormVisible = false
        }
      })

      console.log(this.addSkuData)
    },

    goodDelete(index, row) {
      this.$confirm('确认删除此商品?', '提示', {
        confirmButtonText: '删除商品',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/good/deleteGoodByGoodId/' + row.goodId).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '商品已删除',
              type: 'success'
            });
          }
          this.getData()
          this.totalCount()
        })
      })
    },

    addSku(index, row) {
      this.addSkuData.goodId = row.goodId
      this.addSkuDialogFormVisible = true

    },

    skuOffShelf(index, row) {
      this.$confirm('下架SKU库存将设为0，确认下架?', '提示', {
        confirmButtonText: '下架SKU',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/sku/offShelfSkuBySkuId/' + row.skuId).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: 'SKU已下架',
              type: 'success'
            });
          }
          this.getSkuData()
        })
      })
    },

    skuDelete(index, row) {
      this.$confirm('确认删除此SKU?', '提示', {
        confirmButtonText: '删除SKU',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/sku/deleteSkuBySkuId/' + row.skuId).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: 'SKU已删除',
              type: 'success'
            });
          }
          this.getSkuData()
        })
      })
    },

    setDefaultSku(index, row) {
      this.$axios.post('http://localhost:8181/good/setDefaultSku/', row).then((resp) => {
        console.log(resp.data)
        if (resp.data > 0) {
          this.$message({
            message: '修改主SKU成功',
            type: 'success'
          });
        }
        this.getSkuData()
      })
    },

    expandChange(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = []
        if (row) {
          this.expands.push((row.goodId))
          this.currentGoodId = row.goodId
          this.getSkuData()
        }
      } else {
        this.expands = []
      }
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
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isIMG && isLt5M;
    },

  }
}
</script>
