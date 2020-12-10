import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "@/views/Home";
import Info from "@/views/Info";
import Login from "@/views/Login";
import Good from "@/views/Good";
import Order from "@/views/Order";
import User from "@/views/User";
import Admin from "@/views/Admin";
import Banner from "@/views/Banner";
import Category from "@/views/Category";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/info',
    children:[
      {path: 'info', component: Info},
      {path: 'good', component: Good},
      {path: 'order', component: Order},
      {path: 'user', component: User},
      {path: 'admin', component: Admin},
      {path: 'banner', component: Banner},
      {path: 'category', component: Category},
    ]
  },
  {path: '/login', name: 'login', component: Login},

]

const router = new VueRouter({
  routes
})

// eslint-disable-next-line no-unused-vars
router.beforeEach((to,from,next)=>{
  // chrome
  document.body.scrollTop = 0
  // firefox
  document.documentElement.scrollTop = 0
  // safari
  window.pageYOffset = 0

  if(to.path!=='/login'&&window.sessionStorage.getItem("token")===null){
    next('/login')
  }else if (to.path==='/admin'&&window.sessionStorage.getItem("authority")!=='系统管理员'){
    alert('无权限访问！')
    next(from.path)
  } else {
    next()
  }
})

export default router
