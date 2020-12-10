<template>
  <div>
    <el-table
        :data="orders"
        @sort-change="handleSortChange"
        style="width: 100%"
        v-loading="loading"
        height="550">
      <el-table-column
          fixed
          sortable="custom"
          prop="orderId"
          label="订单号">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="goodId"
          label="商品编号">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="skuId"
          label="SKU编号">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="userId"
          label="用户ID">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="goodName"
          width="150"
          label="商品名">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="color"
          label="颜色">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="version"
          width="100"
          label="版本">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="quantity"
          label="数量">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="price"
          label="订单金额">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="orderTime"
          width="100"
          label="下单时间">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="status"
          label="订单状态">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="addressName"
          width="200"
          label="收货地址">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="receiver"
          label="收货人">
      </el-table-column>
      <el-table-column
          sortable="custom"
          prop="phone"
          width="110"
          label="收货手机号">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="180">
        <template slot-scope="scope">

          <el-tooltip content="发货" placement="top">
            <el-button type="primary" circle plain @click="orderShip(scope.$index, scope.row)"
                       :disabled="scope.row.status!=='待发货'" class="order-"><i class="el-icon-truck"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="取消订单" placement="top">
            <el-button type="warning" circle plain @click="orderCancel(scope.$index, scope.row)"
                       :disabled="(scope.row.status!=='待发货')&&(scope.row.status!=='待支付')" class="order-">
              <i class="el-icon-close"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="删除订单" placement="top">
            <el-button type="danger" circle plain @click="orderDelete(scope.$index, scope.row)"
                       :disabled="(scope.row.status!=='已完成')&&(scope.row.status!=='已取消')" class="order-">
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

  </div>
</template>

<script>
export default {
  name: "Order",
  data() {
    return {
      orders: [],
      dialogFormVisible: false,
      currentPage: 1,
      listInfo: {
        start: 0,
        pageSize: 5,
        prop: 'orderId',
        order: 'desc',
      },
      total: 0,
      loading: false
    }
  },
  created() {
    this.totalCount()
    this.getData()
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
      this.editOrder = row
      this.dialogFormVisible = true
    },

    orderShip(index, row) {
      let status = '待收货'
      this.$axios.post('http://localhost:8181/order/setOrderStatus/' + row.orderId + '/' + status).then((resp) => {
        console.log(resp.data)
        if (resp.data > 0) {
          this.$message({
            message: '订单已发货',
            type: 'success'
          });
        }
        this.getData()
      })
    },

    orderCancel(index, row) {
      this.$confirm('确认取消此订单?', '提示', {
        confirmButtonText: '取消订单',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/order/orderCancel',row).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '订单已取消',
              type: 'success'
            });
          }
          this.getData()
        })
      })
    },

    orderDelete(index, row) {
      this.$confirm('确认删除此订单?', '提示', {
        confirmButtonText: '删除订单',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/order/deleteOrderByOrderId/' + row.orderId).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '订单已删除',
              type: 'success'
            });
          }
          this.getData()
          this.totalCount()
        })
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

    getData() {
      this.loading = true
      this.$axios.post('http://localhost:8181/order/findAllOrderByPage', this.listInfo).then((resp) => {
        console.log(resp.data)
        this.orders = resp.data
      })
      this.loading = false
    },

    totalCount() {
      this.$axios.post('http://localhost:8181/order/orderCount').then((resp) => {
        console.log(resp.data)
        this.total = resp.data
      })
    }

  }
}
</script>

<style lang="less" scoped>
@import "../assets/style/common";

.order-button {
  margin: 0 5px;
}

</style>
