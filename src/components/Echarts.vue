<template>
  <div class="Echarts">
    <div id="main" style="width: 1000px;height:300px;"></div>
  </div>
</template>

<script>
export default {
  name: "Echarts",
  data() {
    return {
      xData:[],
      yData:[],
    }
  },
  methods: {
    myEcharts(){
      this.$axios.post('http://localhost:8181/order/findAllWeek').then((resp)=>{
        this.xData=resp.data

        this.$axios.post('http://localhost:8181/order/countOrderByWeek').then((resp2)=>{
          this.yData=resp2.data

          let myChart = this.$echarts.init(document.getElementById('main'));
          myChart.setOption({
            title: {
              text: '每周订单统计'
            },
            tooltip: {},
            legend: {
              data: ['订单量'],
            },

            xAxis: {
              data: this.xData
            },
            yAxis: {},
            series: [{
              name: '订单量',
              type: 'line',
              data: this.yData
            }]
          })
        })
      })
    }
  },
  mounted() {
    this.myEcharts();
  },
}
</script>

<style scoped>

</style>
