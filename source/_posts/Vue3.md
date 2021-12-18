---
    title:  Vue3特点解析 # 文章标题  
    date: 2021/8/12 21:18:25  # 文章发表时间
    tags:
    - 前端
    categories: 前端 # 分类
    thumbnail: http://img.zssaer.cn/wallhaven-k7kv37.png?x-oss-process=style/small # 略缩图
---

本文章主要是为有 Vue 2 经验的用户希望了解 Vue 3 的新功能和更改而提供的。

Vue3相对于Vue2.x变换不是非常大,在一些写法上是互相通融,vue2的写法在vue3也是通用的,所以要上手Vue3也是非常轻松的。

![](http://img.zssaer.cn//vueLogo.jpg)

对于 Vue 3，你应该使用 npm 上可用的 Vue CLI v4.5 作为 @vue/cli。
要升级，你应该需要全局重新安装最新版本的 @vue/cli：

```bash
yarn global add @vue/cli
# OR
npm install -g @vue/cli
```

#### 创建项目

1.使用命令行创建

```
vue create `项目名`
```

2.使用图形UI创建

```
vue ui
```

#### Setup()

使用 `setup` 函数时，它将接受两个参数：

1. `props`

2. `context`

其中

​     Props: `setup` 函数中的第一个参数是 `props`。正如在一个标准组件中所期望的那样，`setup` 函数中的 `props` 是响应式的，当传入新的 prop 时，它将被更新。

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

但是，因为 `props` 是响应式的，你**不能使用 ES6 解构**，因为它会消除 prop 的响应性。



​	context: 是一个上下文对象，可以通过 context 来访问 Vue 的实力 this。context包含三个属性:  `attrs`,`slots`,`emit`.

在 只需要使用单个属性时可以解构只引用对于属性即可.

```js
export default {
	setup(props, { emit }) {
        ...
	}
}
```



##### 响应式变量

在Setup中的变量如果直接定义则为其非响应式的,这意味着无法在其Setup中进行动态更改.

所以在其Setup定义变量时需要创建一个响应式引用.



###### reactive声明响应式状态变量

`reactive` 相当于 Vue 2.x 中的 `Vue.observable()` API，为避免与 RxJS 中的 observables 混淆因此对其重命名。该 API 返回一个响应式的对象状态。该响应式转换是“深度转换”——它会影响嵌套对象传递的所有 property。

```
import { reactive } from 'vue'

// 响应式状态
const state = reactive({
  count: 0
})
```



###### ref声明响应式状态变量

在 Vue 3.0 中，可以通过一个新的 `ref` 函数使任何响应式变量在任何地方起作用.

```
import { ref } from 'vue'

const counter = ref(0)
```

`ref` 接收参数并将其包裹在一个带有 `value` property 的对象中返回. 使用 变量.value 可获取到值. 



```
import { ref } from 'vue'

const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```

`ref`在setup返回至模板时,它将自动浅层次解包内部值。只有访问嵌套的 ref 时需要在模板中添加 `.value`

```vue
<template>
<div>
    <span>{{ count }}</span>
    <button @click="count ++">Increment count</button>
    //只有访问嵌套的 ref 时需要在模板中添加value
    <button @click="nested.count.value ++">Nested Increment count</button>
</div>
</template>
<script>
  import { ref } from 'vue'
  export default {
    setup() {
      const count = ref(0)
      return {
        count,
        nested: {
          count
        }
      }
    }
  }
</script>
```

当 `ref` 作为响应式对象的 property 被访问或更改时，为使其行为类似于普通 property，它会自动解包

```js
onst count = ref(0)
const state = reactive({
  count
})

// 不需要使用state.count.value来访问
console.log(state.count) // 0
// 同理
state.count = 1
console.log(count.value) // 1
```

需要对其props中的属性进行解构获取的话需要使用`toRefs`函数或者使用`toRef`进行将props响应式解包

```js
import { toRefs } from 'vue'

props: {
    user: {
      type: String
    }
},
setup (props) {
    // 使用 `toRefs` 创建对prop的 `user` property 的响应式引用
    // 如果 user 是一个可选的属性，可以使用使用 toRef(),如下：
    // const user = toRef(props, 'user')
    const { user } = toRefs(props)
    // 在 user prop 的响应式引用上设置一个侦听器
	watch(user, getUserRepositories)
    return user
}
```



###### reactive和ref区别

两种函数进行声明都会成为响应式状态变量.

但其 `ref` 为数据响应式监听。ref 函数传入一个值作为参数，一般传入基本数据类型,返回一个基于该值的响应式Ref对象.

​	`ref`对象需要通过修改 其value 的值来 改变参数.

而`reactive`是用来定义更加复杂的数据类型,如对象等. 其内部值可以直接修改,不需要使用value属性修改.



##### 响应式`watch`

在setup中使用watch时,使用从 Vue 导入的 `watch` 函数执行相同的操作. 它接受 3 个参数：

- 一个想要侦听的**响应式引用**或 getter 函数
- 一个回调
- 可选的配置选项

```js
import { ref, watch } from 'vue'

export default {
	setup(){
		const counter = ref(0)
    
	    const getUserRepositories = counter =>{
	        console.log('The new counter value is: ' + counter.value)
	    }
	    // 1类,直接监听
		watch(counter, (newValue, oldValue) => {
		  console.log('The new counter value is: ' + counter.value)
		})
	    // 2类,监听调用函数
		watch(counter, getUserRepositories)
        ...
	}
}
```

每当 `counter` 被修改时，例如 `counter.value=5`，侦听将触发并执行回调 (第二个参数).

了确保我们的侦听器能够根据 对象的变化做出反应。其被监听对象需要带响应式引用.

##### 独立的 `computed` 属性

使用从 Vue 导入的 `computed` 计算函数在 Vue 组件外部创建计算属性.

```js
import { ref, computed } from 'vue'
export default {
	setup(){
    	const counter = ref(0);
        // 定义计算函数,get方法为获取counter的两倍值
        const twichTheConunter = computed(() => counter.value * 2);
        // 计算属性的函数中如果传入一个对象，表示的是get和set
    	const twichTheConunter2 = computed({
          get() {
              return counter.value * 2;
          },
          set(val) {
              counter.value = val;
          },
        });
        console.log(twiceTheCounter.value); // 2
        ...
	}
}
```

给 `computed` 函数传递了第一个参数，它是一个类似 getter 的回调函数，输出的也是一个*只读*的**响应式引用**。所以访问新创建的计算变量的 **value**，我们也需要像 `ref` 一样使用 `.value` property。

给 `computed` 函数传递一个带有get函数和set函数的对象即可设定计算函数的getter和setter回调函数.



##### Provide / Inject (依赖注入)

通常，当我们需要从父组件向子组件传递数据时，我们使用 [props](https://v3.cn.vuejs.org/guide/component-props.html).但是当组件结构非常庞大时,其数据就需要由上到下依次传递,非常麻烦.

使用依赖注入方式的话,我们可直接跳过传递步骤,无论组件位置多深,都可以直接远程传递数据,非常方便,如下图所示.

<img src="http://img.zssaer.cn/components_provide.png" style="zoom:90%;" />

父组件使用**Provide**提供传递的数据:

```js
import { provide } from 'vue'
export default{
    ...
    setup() {
        provide("location", 'China,Chengdu')
        provide("geolocation",{
            longitude: 40,
            latitude: 225
        })
		...
	}
}
```

其中`provide` 函数允许你通过两个参数定义 property：

1. name (`<String>` 类型)
2. value

子组件使用**inject**获取传递的数据:

```js
import { inject } from 'vue'

export default{
    ...
    setup() {
        const userLocation = inject('location', 'The Universe')
        const userGeolocation = inject('geolocation')
        ...
        return {
          userLocation,
          userGeolocation
        }
	}
}
```

其中`inject` 函数有两个参数：

1. 要 inject 的 property 的 name
2. 默认值 (**可选**)



###### 使用响应式property

在上面的例子中,默认情况下，`provide/inject` 绑定*并不是*响应式的,所以其provide传递的数据是不能进行动态响应变化的.

为了增加 provide 值和 inject 值之间的响应性，可以在 provide 值时使用 `ref` 或 `reactive` 来声明响应式状态。

```js
import { provide, reactive, ref } from 'vue'

export default{
    ...
    setup() {
    	const location = ref('China,Chengdu')
        const geolocation = reactive({
            longitude: 40,
            latitude: 225
        })
        
        provide("location", location)
        provide("geolocation", geolocation)
		...
	}
}
```



###### 修改响应式property

注意:在需要修改响应式 provide / inject 值的时候,**尽可能对绑定的响应式property所有修改操作 限制 在定义provide的那个组件内部**.而不是在inject获取的组件中修改.

```js
import { provide, reactive, ref } from 'vue'

export default{
    ...
    setup() {
    	const location = ref('China,Chengdu')
        const geolocation = reactive({
            longitude: 40,
            latitude: 225
        })
        
        provide("location", location)
        provide("geolocation", geolocation)
		return {
          location
        }
	},
	methods: {
        updateLocation() {
          // 修改provide绑定的响应式属性,最后只在该组件中,而不是在inject获取的子组件中.
          this.location = 'South Pole'
        }
  	}
}
```

但当我们有需求需要在注入数据的组件内部更新inject的property的话,这种情况下,建议 在provide的组件中创建一个方法来负责改变响应式的property.

```js
import { provide, reactive, ref } from 'vue'

export default{
    ...
    setup() {
    	const location = ref('China,Chengdu')
        const geolocation = reactive({
            longitude: 40,
            latitude: 225
        })
        // 专门用来inject更新location数据
        const updateLocation = () => {
          location.value = 'South Pole'
        }
        
        provide("location", location)
        provide("geolocation", geolocation)
        provide("updateLocation", updateLocation)
	}
}
```

在inject注入的组件中获取updateLocation属性后,调用函数即可 通过provide的组件来更新property.

为了防止inject注入的组件 去修改provide传递的数据,可以在其provide组件下对其使用`readonly`进行只读化.

```js
import { provide, reactive, readonly, ref } from 'vue'
...
provide("location", readonly(location))
provide("geolocation", readonly(geolocation))
```



##### 	总结

​	1.Vue3 的一大特性函数 ---- setup

​	2.setup函数是 Composition API（组合API）的入口

​	3.在setup函数中定义的变量和方法最后都是需要 return 出去的 不然无法在模板中使用



#### 深入slot插槽

Vue 实现了一套内容分发的 API,将 `<slot>` 元素作为承载分发内容的出口。

插槽允许用户合成自定义内容:

```html
<todo-button>
  Add todo
</todo-button>
```

`<todo-button>` 的模板中:

```html
<!-- todo-button 组件模板 -->
<button class="btn-primary">
  <slot></slot>
</button>
```

最终渲染的时候,`<slot>`标签就会被替换为"Add todo"

```html
<!-- 渲染 HTML -->
<button class="btn-primary">
  Add todo
</button
```

如果 组件 中**没有**包含一个 `<slot>` 元素，则引用该组件 中起始标签 和 结束标签 之间的任何内容都会被抛弃.



##### 插槽备用内容

组件中含有`<slot>`标签,但在父级组件引用时,其中如果并没有内容,那么 默认情况就会为空.

为了防止为空的尴尬情况,可以在`<slot>`标签中添加内容,作为其插槽的备用内容

```html
<!-- submit-button组件 -->
<button type="submit">
  <slot>Submit</slot>
</button>
```

现在当在一个父级组件中使用 `<submit-button` > 并且不提供任何插槽内容时：

```html
<submit-button></submit-button>
```

其就会被渲染为:

```html
<button type="submit">
  Submit
</button>
```

当然,如果父级组件中使用`<submit-button` >含有插槽内容的话,这个备用内容就不会被渲染.



##### 插槽具名

顾名思义就是把插槽命名.

`<slot>` 元素有一个特殊的 attribute：`name`。这个 attribute 可以用来定义额外的插槽, `name`属性具有单一性,所以不能重复出现相同名称。

有时我们需要多个插槽。例如对于一个带有如下模板的 `<base-layout>` 组件：

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

父组件在向具名插槽提供内容的时候，我们可以在一个创建一个 `<template>` 元素,在上使用 `v-slot:插槽名称`,来绑定对应插槽.

```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>
  <!-- 默认插槽也可以不需要template绑定 -->
  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

默认使用`<slot>`标签而不命名的话,其该插槽默认为'default'(由于name属性原因,所以不能连续不命名使用`<slot>`标签).

注意，其中**`v-slot` 只能添加在 `<template>` 上** ,只有一个[例外](#soloSlot)



##### 插槽渲染作用域

在插槽中使用数据时,例如

```html
<todo-button>
  Delete a {{ item.name }}
</todo-button>
```

该插槽可以访问与引用组件其余部分相同的实例 property (即相同的“作用域”),但不能访问其组件内部的property,即插槽**不能**访问 `<todo-button>` 的作用域。

<img src="http://img.zssaer.cn/slot%20(1).png" style="zoom:70%;" />

Vue官方有条规则:

> 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。



有时让插槽内容能够访问子组件中才有的数据是很有用的。实现在父组件获取自定义的子组件内容.

**例如，我们有一个组件，包含 todo-items 的列表。**

```html
app.component('todo-list', {
  data() {
    return {
      items: ['Feed a cat', 'Buy milk']
    }
  },
  template: `
    <ul>
      <li v-for="(item, index) in items">
        {{ item }}
      </li>
    </ul>
  `
})
```

我们可能会想把 `{{ item }}` 替换为 `<slot>`，以便在父组件上自定义。

```html
<todo-list>
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

就如上面说的那样,这时`{{item}}`并不会被子组件所识别. 由于子组件上定义的v-for, 只有 它本身才可以访问 `item`.

要使父组件获取到子组件的值,可以添加一个 `<slot>`,并将其绑定为属性：

```html
<ul>
  <li v-for="( item, index ) in items">
    <slot :item="item"></slot>
  </li>
</ul>
```

绑定在 `<slot>` 元素上的 attribute 被称为**插槽 prop**。

现在在父级作用域中，我们可以使用带值的 `v-slot` 来定义我们提供的插槽 prop 的名字(可以自定义),然后在调用时使用 `自定义名称.插槽 prop`

```html
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <!-- 获取到 子组件的item值 -->
    <span class="green">{{ slotProps.item }}</span>
  </template>
</todo-list>
```

其整个过程图如下:

<img src="http://img.zssaer.cn/scoped-slot.png" style="zoom:65%;" />



###### <span id="soloSlot">独占默认插槽写法</span>

上面插槽具名中说明了`v-slot`属性只能出现在`template`标签中.只有一个例外,那就是默认插槽的写法.

当被提供的内容**只有默认插槽**时，组件的标签才可以被当作插槽的模板来使用。这样我们就可以把 `v-slot` 直接用在组件上：

```html
<todo-list v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

注意!默认插槽的缩写方法不能与其具名插槽进行混用!因为它会导致作用域不明确:

```html
<!-- 无效，会导致警告 -->
<todo-list v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
  
  <template v-slot:other="otherSlotProps">
    slotProps is NOT available here
  </template>
</todo-list>
```

所有如果出现多个插槽的话,请使用默认的`<template>`的语法.



##### 插槽Prop的解构

作用域插槽的内部工作原理是将你的插槽内容包括在一个传入单个参数的函数里：

```js
function (slotProps) {
  // ... 插槽内容 ...
}
```

所以`v-slot`的值实际上可以是任何能够作为函数定义中的参数的 JavaScript 表达式。

所以可以使用ES6的解构,来单独获取单一属性,.而不需要获取整个对象.

```html
<!-- 解构子组件的slot,获取单一的item属性 -->
<todo-list v-slot="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

也可以定义备用内容，用于插槽 prop的对应属性 是 undefined 的情形：

```html
<!-- 当其子组件的item属性未定义的时候 ,其值为'Placeholder' -->
<todo-list v-slot="{ item = 'Placeholder' }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```



##### 具名插槽的缩写

跟 `v-on` 和 `v-bind` 一样，`v-slot` 也有缩写，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`：

```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

然而，和其它指令一样，该缩写只在其有参数的时候才可用。这意味着以下语法是无效的.如果你希望使用缩写的话，你必须始终以明确插槽名取而代之

```html
<todo-list #default="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```



#### 模板引用

不同于Vue2.x的Options-API,Vue3.x采用的Composition-API,在setup()中无法调用`this`关键字.所以将不能使用this.$refs.XXX来直接获取模板对象实例.

Vue3为了获得对模板内元素或组件实例的引用，我们可以像往常一样声明 ref 并从 [setup()](https://v3.cn.vuejs.org/guide/composition-api-setup.html) 返回：

```vue
<template> 
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // DOM 元素将在初始渲染后分配给 ref
        console.log(root.value) // <div>This is a root element</div>
      })

      return {
        root
      }
    }
  }
</script>
```

使用ref(null)来获取模板实例,渲染上下文中暴露 `root`，并通过 `ref="root"`，将其绑定到 div 作为其 ref。

这里的获取实例的常量名称必须是其模板ref调用的值.

分配过程是在虚拟 DOM 挂载/打补丁中执行的，因此模板引用只会在初始渲染之后获得赋值。

作为模板使用的 ref 的行为与任何其他 ref 一样：它们是响应式的，可以传递到 (或从中返回) 复合函数中。





**vue 2.0 生命周期对比 3.0 生命周期**

```
2.0 周期名称    3.0 周期名称    说明
                setup
beforeCreate   beforeCreate     组件创建之前
created         created    组件创建完成
beforeMount    onBeforeMount    组件挂载之前
mounted        onMounted    组件挂载完成
beforeUpdate    onBeforeUpdate    数据更新，虚拟 DOM 打补丁之前
updated        onUpdated    数据更新，虚拟 DOM 渲染完成
beforeDestroy    onBeforeUnmount    组件销毁之前
destroyed       onUnmounted    组件销毁后
```

执行 `setup` 时，组件实例尚未被创建。因此，你只能访问以下 property：

- `props`

- `attrs`

- `slots`

- `emit`

也就是无法访问:data computed methods...

但 setup可以将其中定义的属性 变量 方法 返回出去.

如果 `setup` 返回一个对象，则可以在组件的模板中可以想props一样访问直接使用该对象的 property：

```vue
<template>
  <div>{{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from 'vue'

  export default {
    setup() {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })

      // expose to template
      return {
        readersNumber,
        book
      }
    }
  }
</script>
```

注意，从 `setup` 返回的 [refs](https://v3.cn.vuejs.org/api/refs-api.html#ref) 在模板中访问时是[被自动浅解包](https://v3.cn.vuejs.org/guide/reactivity-fundamentals.html#ref-解包)的，因此不应在模板中使用 `.value`。

关于this:

**在 `setup()` 内部，`this` 不会是该活跃实例的引用**，因为 `setup()` 是在解析其它组件选项之前被调用的，所以 `setup()` 内部的 `this` 的行为与其它选项中的 `this` 完全不同。这在和其它选项式 API 一起使用 `setup()` 时可能会导致混淆。



####  v-model的更新

vue常用的数据双向绑定v-model在其Vue3.x中有所改变,导致如果使用Vue2.x的旧方法就会失效.所以务必知晓:

v-model其实 是vue中的一个语法糖,它融合了其`v-bind` 数据绑定 和` v-on` 控件绑定 两种组件.

```vue
<input v-model="lovingVue"></input>
<!-- 被解析为 -->
<input
      type="checkbox"
      v-bind:modelValue="checked"
      v-on:change="$emit('update:modelValue', $event.target.checked)"
></input>
```

在子组件向父组件 回显数据时 使用 **$emit函数**.

在Vue2.x中,`v-model` 默认会利用名为 `value` 的 prop 和名为 `input` 的事件. 不能多个自定义prop进行双向数据绑定

在Vue3.x中,`v-model` 默认会利用名为 `modelValue ` 的 prop 和名为 `update:modelValue` 的事件. 可以使用`v-model:xxx`进行多个自定义prop进行双向绑定

 ```html
<user-name
  v-model:first-name="firstName"
  v-model:last-name="lastName"
></user-name>
 ```

```js
app.component('user-name', {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName'],
  ...
  emit("update:firstName", newValue);
  ...
  emit("update:lastName", newValue);
})
```

