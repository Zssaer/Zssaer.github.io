---
    title:  Vue-router路由快速教程 # 文章标题  
    date: 2021/7/23 13:48:25  # 文章发表时间
    tags:
    - 前端
    categories: 前端 # 分类
    thumbnail: http://img.zssaer.cn//vueRouter.jpg # 略缩图


---

<h1 align = "center">Vue-router路由快速教程</h1>

## 为什么要使用Router(路由)?

由于Vue中是动态生成的页面,所以在链接上不可以使用url来进行跳转,这时跳转应该使用Router功能.

![](http://img.zssaer.cn//vuerouter2.png)

## 官方简绍

Vue Router 是 Vue.js官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：

- 嵌套的路由/视图表
- 模块化的、基于组件的路由配置
- 路由参数、查询、通配符
- 基于 Vue.js 过渡系统的视图过渡效果
- 细粒度的导航控制
- 带有自动激活的 CSS class 的链接
- HTML5 历史模式或 hash 模式，在 IE9 中自动降级
- 自定义的滚动条行为

所以VueRouter主要功能是做页面导航,用来控制页面之间的跳转的

Vue-Router 官方文档:https://router.vuejs.org/zh/installation.html

## 开始入门

1.在项目中安装vue-router(如果使用脚手架构建vue项目时安装了router的话可以跳过)

```bash
npm install vue-router --save-dev
//cnpm install vue-router --save-dev
```

2.在src下新建router文件夹,并创建index.js文件进行配置Router. ('index.js'为Vue默认下的router文件)

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
/*导入相关组件*/
import Content from '../components/Content'
import IndexPage from '../components/Index'

//安装路由
Vue.use(VueRouter);

//配置导出路由
export default new VueRouter({
  routes:[
    {
      //路由路径  相当于Spring中的@RequestMapping
      path:'/content',
      name:'content',
      //跳转的组件
      component: Content
    },
    {
      path:'/main',
      name:'main',
      component: IndexPage
    }
      ...
  ]
});
```

注意:使用import引入component的话,会导致其项目打包时路由里的所有component都会打包在一个js中，造成进入首页时，需要加载的内容过多，时间相对比较长。

当你用require这种方式引入的时候，会将你的component分别打包成不同的js，加载的时候也是按需加载，只用访问这个路由网址时才会加载这个js。

```javascript
resolve => require(['../components/Index'], resolve),
```

```javascript
{
      // 进行路由配置,规定'/'引入到home组件
      path: '/',
      component: resolve => require(['../components/Index'], resolve),
      meta: {
        title: 'home'
}
```



3.在入口main.js文件下导入,配置router

```javascript
import Router from './router'  //Vue默认配置下会自动扫描router下的index文件

new Vue({
  el: '#app',
  //配置路由
  router:Router,
  ...
})
```

4.在显示Vue下进行使用Router

```vue
<template>
  <div id="app">
    <H1>ONEREPULIC OF THE POP ARTISTS FROM UNITED STATES OF AMERICA</H1>
    <!-- 设置Router超链接,相当于a -->
    <router-link to="/content">CONTENT</router-link>
    <router-link to="/main">INDEX</router-link>
    <!-- 展示Router内容 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
```

`<router-link>:进行设置路由链接    <router-view>:进行展示路由内容`



在方法中进行路由转发跳转导航:

```javascript
// 使用vue-router路由到指定页面,该方式叫做编程式导航
this.$router.push("/main");
```

### 路由嵌套

在一个页面中部分切换显示内容,而不跳转新页面. 做到局部刷新,则可以使用Vue-router的路由嵌套方法.  如导航栏点击切换主内容,页面局部刷新,导航栏部分不变,主内容改变.

```vue
...
<el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i>用户管理</template>
          <el-menu-item index="1-1">
          	  <!-- 设置路由跳转链接 -->
              <router-link to="/user/profile">个人信息</router-link>  
          </el-menu-item>
        <el-menu-item index="1-2">
        	  <!-- 设置路由跳转链接 -->
              <router-link to="/user/list">用户列表</router-link> 
        </el-menu-item>
 </el-submenu>
...

<el-main>
    <!-- 在该部分进行路由显示 -->
    <router-view />
</el-main>
```

在路由配置文件下:

```javascript
routes:[
    ...
    {
      path:'/main',
      component: resolve => require(['../views/Main.vue'],resolve),
      // 嵌套路由,做到局部刷新
      children:[
        {
          path:'/user/profile',
          component: resolve => require(['../views/user/Profile.vue'],resolve)
        },
        {
          path:'/user/list',
          component: resolve => require(['../views/user/List.vue'],resolve)
        },
      ]
    },
    ...
  ]
```



### 路由参数传递

路由跳转时,可以传递参数.  

```vue
<router-link :to="{name:'UserProfile',params:{id:23}}">个人信息</router-link>  
```

在路由配置中:

```javascript
{
      path:'/main',
      component: resolve => require(['../views/Main.vue'],resolve),
      // 嵌套路由
      children:[
        {
          // 后续添加:参数名,以实现参数传递
          path:'/user/profile:id',
          //定义其路由名
          name:'UserProfile',
          component: resolve => require(['../views/user/Profile.vue'],resolve)
        },
        {
          path:'/user/list',
          component: resolve => require(['../views/user/List.vue'],resolve)
}
```

v-bind:to="{name:'路由名(在配置中定义)',params:{参数名:参数值}}"

 	<font color="red">--但会在地址中 会暴露参数值 --</font>

#### 1.通过路由直接获取参数值

在传递后的页面中显示:

```vue
<template>
<div>
    <h1>个人信息</h1>
    {{$route.params.id}}
</div>   
</template>
```

​	使用{{$route.params.参数名}}进行提取出参数值

​	<font color="red">**注意:在Vue中声明其template下只能存在一个根元素,不能存在一个以上的元素.**</font>

#### 2.通过props进行获取参数

在路由配置中:

```
{
   path:'/user/profile:id',
   name:'UserProfile',
   component: resolve => require(['../views/user/Profile.vue'],resolve),
   // 设置其允许接收属性值
   props:true
}
```

在传递后的页面中显示:

```vue
<div>
    <h1>个人信息</h1>
    {{id}}
</div>   

<script>
    export default {
    	// 获取其传递的值
        props:['id'],
        name: "UserProfile"
    }
</script>
```

### 路由重定向

使用Vue-Router可以将转发页面进行重定向.

在路由配置中:

```javascript
{
  path:'/goHome',
  // 跳转页面进行重定向
  redirect:'/main'
}
```

