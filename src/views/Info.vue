<template>
  <div>
    <div class="info-panel">

      <div class="info-block">
        <div class="info-item mag icon">
          <i class="el-icon-goods"></i>
        </div>
        <div class="info-item mag">
          <div class="mag">商品总数</div>
          <div class="mag" style="font-size: 40px">{{goodCount}}</div>
        </div>
      </div>

      <div class="info-block">
        <div class="info-item mag icon">
          <i class="el-icon-shopping-cart-full"></i>
        </div>
        <div class="info-item mag">
          <div class="mag">SKU总数</div>
          <div class="mag" style="font-size: 40px">{{skuCount}}</div>
        </div>
      </div>

      <div class="info-block">
        <div class="info-item mag icon">
          <i class="el-icon-document-checked"></i>
        </div>
        <div class="info-item mag">
          <div class="mag">订单总数</div>
          <div class="mag" style="font-size: 40px">{{orderCount}}</div>
        </div>
      </div>

      <div class="info-block">
        <div class="info-item mag icon">
          <i class="el-icon-user"></i>
        </div>
        <div class="info-item mag">
          <div class="mag">用户总数</div>
          <div class="mag" style="font-size: 40px">{{userCount}}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Info",
  data() {
    return {
      goodCount:0,
      skuCount:0,
      orderCount:0,
      userCount:0
    }
  },
  created() {
    this.totalCount()
  },
  methods:{
    totalCount(){
      this.$axios.post('http://localhost:8181/good/goodCount').then((resp) => {
        this.goodCount = resp.data
      })
      this.$axios.post('http://localhost:8181/sku/skuCount').then((resp) => {
        this.skuCount = resp.data
      })
      this.$axios.post('http://localhost:8181/order/orderCount').then((resp) => {
        this.orderCount = resp.data
      })
      this.$axios.post('http://localhost:8181/user/userCount').then((resp) => {
        this.userCount = resp.data
      })

    }
  }
}
</script>

<style lang="less" scoped>
@import "../assets/style/common";

.info-panel{
  display: flex;
  //flex-wrap: wrap;
}

.info-block{
  display: flex;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px;
}

.info-item{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.mag{
  margin: 10px;
}

.icon{
  font-size: 60px;
  color: #1D4E89
}
</style>
