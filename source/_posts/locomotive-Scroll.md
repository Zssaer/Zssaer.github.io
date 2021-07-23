---
    title:  Locomotive Scroll(视差滚动) # 文章标题  
    date: 2021/7/23 13:48:25  # 文章发表时间
    tags:
    - 前端
    categories: 前端 # 分类
    thumbnail: http://qworezhg7.hn-bkt.clouddn.com/chris-ried-ieic5Tq8YMk-unsplash.jpg # 略缩图
---

<h1 align = "center">Locomotive Scroll(视差滚动)</h1>

视差滚动简单的认识就是移动滚动条或者滚动鼠标滑轮,dom盒子移动的速度加减的差别造成页面的不同的效果

GitHub项目地址:`https://github.com/locomotivemtl/locomotive-scroll`



### 安装\引用

```bash
npm install locomotive-scroll
<!--引用-->
<script src="https://cdn.jsdelivr.net/npm/locomotive-scroll@3.5.4/dist/locomotive-scroll.min.js"></script>
```

### 使用

| 属性                                                      | 描述                   |
| :-------------------------------------------------------- | :--------------------- |
| data-scroll-container                                     | 定义容器               |
| data-scroll                                               | 检测是否在视野中       |
| data-scroll-speed="number"                                | 元素视差速度,负数反转  |
| data-scroll-target="#xxx"                                 | 目标元素在视图中的位置 |
| data-scroll-directio n="vertical 垂直 \| horizontal 水平" | 视差的方向             |

```html
<div data-scroll-container>
    <div data-scroll-section>
        <h1 data-scroll>Hey</h1>
        <p data-scroll>👋</p>
    </div>
    <div data-scroll-section>
        <h2 data-scroll data-scroll-speed="1">What's up?</h2>
        <p data-scroll data-scroll-speed="2">😬</p>
    </div>
</div>
```

添加Locomotive Scroll Css文件

```
https://github.com/locomotivemtl/locomotive-scroll/blob/master/dist/locomotive-scroll.css
```

js:

```js
import LocomotiveScroll from 'locomotive-scroll';

const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true
});
```
