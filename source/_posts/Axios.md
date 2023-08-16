---
    title:  Axios异步通讯快速教程 # 文章标题  
    date: 2021/7/23 13:48:25  # 文章发表时间
    tags:
    - 前端
    categories: 前端 # 分类
    thumbnail: https://zssaer.oss-cn-chengdu.aliyuncs.com//axios.jpg # 略缩图

---

<h1 align = "center">Axios异步通讯快速教程</h1>

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中实现ajax 异步通讯的扩展插件。

## 特性

- 从浏览器中创建 [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- 从 node.js 创建 [http](http://nodejs.org/api/http.html) 请求
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)

## 在Vue中使用Axuis

安装Axios:

```
npm install --save axios vue-axios
```

Axios API:使用`axios` 可以传递其他链接下的数据,以及传递数据.

main.js中进行配置Axios:

```javascript
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
```

​	在前后端分离项目进行前后端链接通讯.

````html
<div id="vue">
    <div>
        {{info.name}}
        {{info.address.city}}
        <a v-bind:href="info.url">Baidu</a>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue@2.5.21/dist/vue.min.js"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
    var vm = new Vue({
        el: "#vue",
        data:{
            info:null
        },
        mounted(){ //钩子函数
            axios.get('../data.json').then(response=>(this.info=response.data));
        }
    });
</script>
````

data.json:

```json
{
  "name":"test",
  "url": "http://baidu.com",
  "page": 1,
  "isNonProfit":true,
  "address": {
    "street": "含光门",
    "city":"陕西西安",
    "country": "中国"
  },
  "links": [
    {
      "name": "bilibili",
      "url": "https,://www.bilibili.com/"
    },
    {
     "name": "4399",
      "url": "https,://www.4399.com/"
    },
    {
      "name": "百度",
      "url": "https,://www.baidu.com/"
    }
  ]
}
```

```javascript
 mounted(){ //钩子函数
            axios.get('../data.json').then(response=>(this.info=response.data));
        }
```

