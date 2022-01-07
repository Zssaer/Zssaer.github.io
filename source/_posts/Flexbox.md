---
    title:  Flexbox布局模块 # 文章标题  
    date: 2021/09/23 17:08:55  # 文章发表时间
    tags:
    - 前端
    categories: 前端 # 分类
    thumbnail: https://img.zssaer.cn/wallhaven-pk8pzj.png?x-oss-process=style/wallpaper # 略缩图

---

## 介绍

Flexbox是CSS3的新布局.

弹性框布局模块，可以更轻松地设计灵活的响应式布局结构，而无需使用浮动或定位。

它可以自动拉伸框使其与最长的框一样长.

它在 Internet Explorer 10 或更早版本中不起作用。

本文的内容节选于阮一峰老师的博客:https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

## 概念

采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。

![](https://img.zssaer.cn/image-20210923170847828.png)

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`；交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。

项目默认沿主轴排列。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。



## 定义 Flex 容器

`弹性布局中必须有一个 *display* 属性设置为 *flex* 的父元素。`

**注意:设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效。**

```css
.flex-container {
  display: flex;
  background-color: DodgerBlue;
}
```

```html
<div class="flex-container">
  <div>1</div>
  <div>2</div>
  <div>3</div>  
</div>
```

弹性容器的直接子元素会自动成为弹性项目。

<img src="https://img.zssaer.cn/flexbox.png" style="zoom:90%;" />

使用Flexbox布局的容器中 的控件组件默认没有间隔。

两个地方值得注意。

> （1）弹性布局默认不改变项目的宽度。
>
> （2）弹性布局默认左对齐，所以两个控件会从行首开始排列。



### flex-direction属性(更改组件排序方向)

`flex-direction`属性决定主轴的方向（即项目的组件排列方向）。

```css
flex-direction: row | row-reverse | column | column-reverse;
```

- `row`（默认值）：主轴为水平方向，起点在左端。
- `row-reverse`：主轴为水平方向，起点在右端。
- `column`：主轴为垂直方向，起点在上沿。
- `column-reverse`：主轴为垂直方向，起点在下沿。



###  flex-wrap属性(换行规则)

默认情况下，项目都排在一条线（又称"轴线"）上。`flex-wrap`属性定义，如果一条轴线排不下，如何换行。

```css
flex-wrap: nowrap | wrap | wrap-reverse;
```

- `nowrap`（默认）：不换行。控件会逐渐压缩宽度/高度
- `wrap`：换行，第一行在上方。
- `wrap-reverse`：换行，第一行在下方。



### flex-flow属性(排序\换行)

`flex-flow`属性是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`。



### justify-content属性(主轴对齐方式)

`justify-content`属性定义了项目在主轴(默认左右)上的对齐方式。

```css
justify-content: flex-start | flex-end | center | space-between | space-around;
```

![](https://img.zssaer.cn/bg2015071010.png)

具体对齐方式与轴的方向有关。下面假设主轴为从左到右。

- `flex-start`（默认值）：左对齐
- `flex-end`：右对齐
- `center`： 居中
- `space-between`：两端对齐，项目之间的间隔都相等。
- `space-around`：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。



### align-items属性(交叉轴对齐方式)

`align-items`属性定义项目在交叉轴(默认上下)上如何对齐。

![](https://img.zssaer.cn/bg2015071011.png)

具体的对齐方式与交叉轴的方向有关，下面假设交叉轴从上到下。	

- `flex-start`：交叉轴的起点对齐。
- `flex-end`：交叉轴的终点对齐。
- `center`：交叉轴的中点对齐。
- `baseline`: 项目的第一行文字的基线对齐。
- `stretch`（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。



### align-content属性(多行交叉轴线的对齐方式)

```css
align-content: flex-start | flex-end | center | space-between | space-around | stretch;
```

![](https://img.zssaer.cn/bg2015071012.png)

该属性可能取6个值。

> - `flex-start`：与交叉轴的起点对齐。
> - `flex-end`：与交叉轴的终点对齐。
> - `center`：与交叉轴的中点对齐。
> - `space-between`：与交叉轴两端对齐，轴线之间的间隔平均分布。
> - `space-around`：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
> - `stretch`（默认值）：轴线占满整个交叉轴。



### 单个组件属性

以下6个属性设置在项目上。

> - `order`
> - `flex-grow`
> - `flex-shrink`
> - `flex-basis`
> - `flex`
> - `align-self`

order:定义组件的排列顺序。数值越小，排列越靠前，默认为0。

```css
order: <integer> /* default 0 */
```

`flex-grow`:定义组件的放大比例，默认为`0`，即如果存在剩余空间，也不放大。

```css
flex-grow: <number>; /* default 0 */
```

如果我们希望将其某个控件占据剩余的宽度的话，只需要给其控件指定的`flex-grow`属性为`1`。

`flex-grow`属性默认等于`0`，即使用本来的宽度，不拉伸。它的值代表占据剩余空间的比例。

------------



**弹性布局默认不改变项目的宽度，但是它默认改变项目的高度**。**所以如果项目没有显式指定高度，就将占据容器的所有高度，一个最高控件 将会把其他控件也拉伸。**

![](https://img.zssaer.cn/image-20210923170815335.png)



在其他控件中加入`align-self`属性可以改变这种行为。

`align-self`属性可以取四个值。

> - `flex-start`：顶边对齐，高度不拉伸
> - `flex-end`：底边对齐，高度不拉伸
> - `center`：居中，高度不拉伸
> - `stretch`：默认值，高度自动拉伸



![](https://img.zssaer.cn/bg2018101806.png)

如果项目很多，一个个地设置`align-self`属性就很麻烦。这时，可以在容器元素上设置`align-items`属性，它的值被所有子项目的`align-self`属性继承。

