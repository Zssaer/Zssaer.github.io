---
    title: C++学习笔记（上）   # 文章标题  
    date: 2023/09/16 17:08:08
    tags:
    - C++
    categories: C++ # 分类
    thumbnail: https://zssaer.oss-cn-chengdu.aliyuncs.com/wallhaven-72rd8e.jpg?x-oss-process=style/wallpaper # 略缩图
---
# C++学习笔记（上）

## C++与C的区别

C++是C Plus Plus”的简称，也常写作CPP，顾名思义，C++ 是在C语言的基础上增加新特性。

从语法上看，C语言是 C++ 的一部分，C语言代码几乎不用修改就能够以 C++ 的方式编译。

从语言类型的角度来说，C++ 支持面向过程编程、面向对象编程和泛型编程，而C语言仅支持面向过程编程。

C++在C语言的基础上扩展了**类（Class）**和**对象（Object）**这两个概念。

在C语言中，动态分配内存用 malloc() 函数，释放内存用 free() 函数。如下所示：

```c
int* p = (int*) malloc( sizeof(int) * 10 );  //分配10个int型的内存空间
free(p);  //释放内存
```

在C++中，这两个函数仍然可以使用，但是C++又新增了两个关键字，new 和 delete：new 用来动态分配内存，delete 用来释放内存。

用 new 和 delete 分配内存更加简单：

```c++
int* p = new int;  //分配1个int型的内存空间
delete p;  //释放内存

int* p = new int[10];  //分配10个int型的内存空间
delete[] p;
```

new 操作符会根据后面的数据类型来推断所需空间的大小。

**和 malloc() 一样，new 也是在堆区分配内存，必须手动释放，否则只能等到程序运行结束由操作系统回收。为了避免内存泄露，通常 new 和 delete、new[] 和 delete[] 操作符应该成对出现，并且不要和C语言中 malloc()、free() 一起混用。**



## 指针

指针是 C 语言最重要的概念之一，也是最难理解的概念之一。

指针是什么？首先，它是一个值，这个值代表一个内存地址，因此指针相当于指向某个内存地址的路标。C语言用变量来存储数据，用函数来定义一段可以重复使用的代码，它们最终都要放到内存中才能供 CPU 使用。

CPU 访问内存时需要的是地址，而不是变量名和函数名！变量名和函数名只是地址的一种助记符，当源文件被编译和链接成可执行程序后，它们都会被替换成地址。编译和链接过程的一项重要任务就是找到这些名称所对应的地址。

### 指针变量定义

数据在内存中的地址也称为**指针**，如果一个变量存储了一份数据的指针，我们就称它为**指针变量**。

在C语言中，允许用一个变量来存放指针，这种变量称为指针变量。指针变量的值就是某份数据的地址，这样的一份数据可以是数组、字符串、函数，也可以是另外的一个普通变量或指针变量。

*定义方法：*

```c
datatype *name;
datatype *name = value;
int* p1;  //定义方法一
int * p2;  //定义方法二
int *p3;  //定义方法三

```

星号`*`可以放在变量名与类型关键字之间的任何地方，该变量为指针变量。其类型表示该指针变量的数据类型，用来存储相对应的类型变量的内存地址。

为了代码清晰明了，我们常常使用定义方法一，它能更好的与普通变量区分。当然其实这个并没有绝对的标准。比如在一次性批量定义多个变量时，会采用第三种定义方法：

```c
int x, y, *px = &x, *py = &y;
```

指针变量可以被通过普通变量赋值，表示该指针变量内存地址指向普通变量。 

```c
int a = 100;
int* p_a = &a;
```

在普通变量名前上取地址符``&`` ，表示该变量的内存地址。和普通变量一样，指针变量也可以被多次写入，只要你想，随时都能够改变指针变量的值。

```c
//定义普通变量
float a = 99.5, b = 10.6;
char c = '@', d = '#';
//定义指针变量
float* p1 = &a;
char* p2 = &c;
//修改指针变量的值
p1 = &b;
p2 = &d;
```

值得注意的是，定义 指针变量时必须带`*`，后续给指针变量赋值时不能带`*`，因为后续能自动识别该变量为指针变量。

### 指针变量读取变量数据、修改变量数据

指针变量存储了数据的地址，通过指针变量也能够获得该地址上的数据。

```c
int a = 15;
int *p = &a;
if (*p == a) {
	printf("%d\n", *p);   // 15
}
```

通过在非定义的时候，在指针变量前加上``*``，表示取出该指针变量的值。这样取出来的值与原变量等价。

CPU 读写数据必须要知道数据在内存中的地址，普通变量和指针变量都是地址的助记符，虽然通过 *p 和 a 获取到的数据一样，但它们的运行过程稍有不同：a 只需要一次运算就能够取得数据，而 *p 要经过两次运算，多了一层“间接”。所以通过指针变量来取变量，性能不如直接使用原变量。

![](E:/JavaLeaningDoc/picture/1IG3MJ-2.jpg)

除了读取之外，指针变量还可以修改原变量数据：

```c
int a = 15, b = 99, c = 222;
int *p = &a;  //定义指针变量
*p = b;  //通过指针变量修改内存上的数据  等价于 a=99
c = *p;  //通过指针变量获取内存上的数据  等价于 c=a
printf("%d, %d, %d, %d\n", a, b, c, *p);  //99, 99, 99, 99
```



### 指针变量的运算

指针本质上就是一个无符号整数，代表了内存地址。它可以进行运算，但是规则并不是整数运算的规则。

指针变量的加法，并不是传统的在内存地址进行相应的加法，而是依旧指针变量的类型的字节单位来做加法的。

```c
short* j;
j = (short*)0x1234;
j = j + 1; // 0x1236
```

这里的指针j +1并不是 0x1235，那是因为short类型占据两个字节的宽度。所以相当于向高位移动两个字节，所以同样的，`j - 1`得到的结果是`0x1232`。

**指针只能与整数值进行加减运算，两个指针进行加法是非法的。**

### 关于 * 和 & 混用

一些题目中，总出这种脑残的题目，比如：`*&a`和`&*pa`分别是什么意思呢？

其中`*&a`，表示`*(&a)`，相当于普通变量取内存地址然后再从地址中取回普通变量的数据，绕来绕去，相当于回到了原点。

`&*pa`相当于`&(*pa)`

### 多级指针变量

如果一个指针指向的是另外一个指针，我们就称它为二级指针，或者指向指针的指针。

![](E:/JavaLeaningDoc/picture/1544314910-0.jpg)

```c
int a =100;
int* p1 = &a;
int** p2 = &p1;
```

创建多级指针变量只需要添加多个``*``就可以。

其实实际开发中会经常使用一级指针和二级指针，但几乎用不到更高级的指针。

对于多级指针变量的读取，只需要在其前加上对应数量的`*`即可。


### 指针函数

C语言允许函数的返回值是一个指针（地址），我们将这样的函数称为指针函数。下面的例子定义了一个函数 strlong()，用来返回两个字符串中较长的一个：

```c
#include <stdio.h>
#include <string.h>

char* strlong(char* str1, char* str2){
    if(strlen(str1) >= strlen(str2)){
        return str1;
    }else{
        return str2;
    }
}
int main(){
    char str1[30], str2[30], *str;
    gets(str1);
    gets(str2);
    str = strlong(str1, str2);
    printf("Longer string: %s\n", str);
    return 0;
}
```

指针函数其效果也和普通的函数一样。用指针作为函数返回值时需要注意的一点是，函数运行结束后会销毁在它内部定义的所有局部数据，包括局部变量、局部数组和形式参数，函数返回的指针请尽量不要指向这些数据。

```c
int *func(){
    int n = 100;
    return &n;
}

int main(){
    int *p = func(), n;
    printf("c.biancheng.net\n");
    n = *p;
    printf("value = %d\n", n); // n将不会是100
    return 0;
}
```



### 函数指针

函数也能创建对应的指针，这种指针指向于函数，被称为函数指针。

函数指针它可以用来存储并调用特定类型函数的地址。函数指针的大小取决于所在的平台和编译器，通常它的大小与普通指针相同，即在32位系统上占用4个字节，在64位系统上占用8个字节。

函数指针在C++中有许多用途，它们可以提供一种动态选择和调用函数的机制，使代码更加灵活和可扩展。以下是函数指针常见的应用场景：

1. 回调函数：函数指针常用于实现回调机制，即将一个函数的地址传递给另一个函数，在特定事件发生时，调用这个函数来执行特定的任务。例如，在图形界面库中，可以通过函数指针注册一个回调函数，当用户点击按钮时，库会调用该函数来处理按钮点击事件。
2. 排序函数：函数指针可用于实现通用的排序算法，允许在运行时根据不同的比较条件来排序数据。
3. 函数选择：在某些情况下，需要根据运行时条件选择不同的函数执行。函数指针允许在运行时动态地选择要执行的函数，从而避免大量的if-else语句或switch语句。
4. 插件架构：函数指针常用于实现插件架构，允许动态加载和调用插件中的函数。
5. 多态：通过函数指针和虚函数，可以实现C++中的多态性，允许在运行时调用派生类的特定函数。
6. 状态机：函数指针可以用于实现状态机模式，根据当前状态调用不同的函数来处理特定的操作。

> 虽然函数指针在某些情况下很有用，但在现代C++中，更常见的做法是使用std::function和lambda表达式，这些功能提供了更高级、类型安全和灵活的函数封装方式。它们能够处理更复杂的场景，同时提供更好的代码可读性和维护性。

下面是一个简单的函数指针的例子：

```c
void print(int a) {
  printf("%d\n", a);
}

void (*print_ptr1)(int) = &print;  // 或者 void (*print_ptr)(int) = print;
auto print_ptr2 = print;  //auto print_ptr2 = &print; 

(*print_ptr1)(10);  // 或者print_ptr(10) ,效果等同与执行print(10);
print_ptr2(10);
```

上面示例中，变量`print_ptr1`和`print_ptr2`是函数指针，它指向函数`print()`的地址。函数`print()`的地址可以用`&print`获得(这里也可以不使用&)。注意，`(*print_ptr)`一定要写在圆括号里面，否则函数参数`(int)`的优先级高于`*`，整个式子就会变成`void* print_ptr(int)`。



函数指针的创建:

> 返回参数类型 (*函数指针名)(函数参数,...);  --创建一个空函数指针。
>
> 返回参数类型 (*函数指针名)(函数参数,...) = 函数();   --拷贝创建已知函数 的 函数指针。

**为了简单创建使用函数指针，推荐直接使用auto 创建。**

除了auto之外，还可以使用typedef来定义一种类型来简化编写：

```c++
typedef void (*print_ptr)(int);
print_ptr function = print;
function(10);
```



除此之外，函数指针也可以被用做函数的参数。

```c
void printInt(int a)
{
	std::cout << a << std::endl;
}

void forEachCallFunc(const std::vector<int>& values, void(*func)(int))
{
	for (const int& value : values)
	{
		func(value);
	}
}

int main()
{
    std::vector<int> values = { 1,3,5,7,2,1,8 };
	forEachCallFunc(values,printInt);
	std::cin.get();
}
```

上述forEachCallFunc函数接受两个参数，其中一个参数为函数指针。在调用函数时，传入满足条件函数即可实现动态调用。上面的例子实现下来 就类似于 Python中的map函数一样，对容器中的每个对象执行了特定的函数。



### 使用new来创建对象

C++中使用new来创建对象,意为在程序中分配一部分内存来存储。

C++中使用new创建对象或者数组，利用指针来进行控制。

```c++
int* pt = new int;
XXX* ps  = new XXX;
int* psome = new int[10];
```

使用new创建的对象将存储在堆内存中，相较于直接声明变量，like`int s = 1;`这种存储在栈内存中的对象，更方便管理。

使用new创建的对象能够方便管理，动态分配内存。

### 使用delete释放对象内存

当需要内存时，可以使用new来请求。当new创建的对象无用之后务必记住 使用delete来进行释放内存。

```c++
int* pt = new int;
...
delete pt;
```

当时请不要尝试去释放那些声明变量来的内存:

```c++
int i = 1;
int * pt = &i;
...
delete pt;  // 错误操作
```

对于new创建的数组，同样需要使用`delete[]`来释放，因为方括号告诉程序，应该释放整个数组，而不仅仅是指针指向的元素：

```c++
int* psome = new int[10];
delete[] psome;
```

总而言之,使用new 和delete时,应该遵循以下规则:

- 不要使用delete来释放不是new分配的内存。
- 不要使用delete释放同一个内存块两次。
- 如果使用new[]为数值分配内存，应该也应该使用delete[]来释放。
- 如果使用new为一个实体分配内存，则应该使用delete（没有方括号）来释放。
- 对空指针应用delete是安全的。





### 使用指针作为字符串

或许经常在一些类定义中看见使用指针作为char字符串属性：

```c++
class Student{
public:
    char* name;
    ...
};
```

使用指针作为字符串的属性有一些好处：

1. 动态内存分配：使用指针允许我们在运行时动态地为字符串分配内存，而不需要在编译时指定固定大小。这样可以避免固定大小字符串的限制，使字符串的长度可以根据实际需要进行调整。
2. 省内存：如果`name`属性不是指针，而是一个固定大小的字符数组（例如`char name[50];`），那么每个`Student`对象都会占用相同大小的内存，不管实际存储的字符串长度是多少。而使用指针可以根据字符串的实际长度来动态分配内存，从而节省内存空间。
3. 灵活性：指针允许我们轻松地对字符串进行操作，例如拷贝、连接、截取等。这样我们可以更方便地处理字符串的操作和逻辑。

**然而，需要注意的是，使用指针也会增加一些额外的责任**，如：

1. 内存管理：由于使用了动态内存分配，需要负责在合适的时候释放内存，以避免内存泄漏。
2. 空指针检查：需要确保指针指向有效的内存地址，否则在访问指针指向的数据时可能会导致程序崩溃。

**为了避免上述问题，通常在C++中可以使用`std::string`类代替指针来表示字符串属性，它是C++标准库中提供的字符串类，可以自动管理内存，更加安全和方便。例如：`std::string name;`。**



### 使用指针创建类对象

```c++
Student* pStu = new Student;
```

这句C++语句`Student* pStu = new Student;`创建了一个`Student`指针，并通过动态内存分配使用`new`关键字为该指针分配了一个`Student`对象的内存空间。

使用对象指针后，可以通过箭头`->`来访问对象的成员变量和成员函数。

```c++
pStu -> name = "小明";
pStu -> age = 15;
pStu -> score = 92.5f;
pStu -> say();
```

对象指针时候完后，记得需要手动执行delete，删除掉，已腾空内存。

```c++
delete pStu;  //删除对象
```



其中使用指针创建对象的主要好处是动态内存分配，以及对象的生存期控制：

1. 动态内存分配：通过使用指针和`new`操作符，对象的内存空间是在运行时动态分配的，而不是在编译时固定分配。这允许我们在程序运行时根据需要创建和销毁对象，避免了固定大小数组或对象的限制。
2. 控制对象生存期：当我们使用指针创建对象时，对象的生存期不再由其定义的作用域限制。这样，我们可以在需要的时候手动控制对象的释放，而不是仅限于定义的作用域内。例如，在需要时我们可以使用`delete`操作符来释放对象的内存，这样可以防止内存泄漏。
3. 对象共享：通过创建指针，可以实现多个指针指向同一个对象，从而实现对象的共享和数据的共享。这在某些情况下可以提高程序的效率和灵活性。

然而，需要注意的是，使用动态内存分配和指针也带来了一些额外的责任，例如：

1. 内存泄漏：需要在适当的时候手动释放通过`new`分配的内存，否则会导致内存泄漏，造成程序运行时内存消耗不断增加。
2. 空指针和野指针：需要避免使用未初始化的指针，以及在对象释放后继续使用指针（野指针）。

相比之下，使用栈上的对象（例如`Student stu;`）可以简化代码，并且不需要手动管理内存。这些对象的生存期由其定义的作用域自动管理，当超出作用域时会自动调用析构函数进行清理。这样可以减少程序出错的可能性，但是在某些情况下，需要动态创建对象或共享对象时，使用指针会更合适。综合考虑情况，我们需要根据具体的需求来选择适当的对象创建方式。

### 数组类型指针取值和赋值

前面简绍了关于指针的赋值和取值，我们通常在赋值上使用`*`调取值。

```c++
int value = 42;
int* ptr = &value; 
std::cout << "Value: " << *ptr << std::endl;
```

但其实对于数组类型的指针我们不需要使用`*`来调取值。

```c++
const char* names[] = { "Alice", "Bob", "Charlie", "David" }; // 字符串数组

// 打印字符串数组的各个字符串
for (int i = 0; i < 4; ++i) {
        std::cout << names[i] << std::endl; // 通过指针变量names访问字符串数组中的各个字符串
}

int* pIntArray = new int[5]; // 动态分配5个整数的内存空间，并将起始地址赋值给指针变量pIntArray
for (int i = 0; i < 5; ++i) {
    pIntArray[i] = i; // 通过指针变量pIntArray访问数组元素，并将值赋值给数组元素
}
```

1. 对于普通数组类型的指针（例如`int*`、`char*`等）：数组名本身就是一个指向数组首元素的指针，因此可以直接通过索引的方式访问数组元素，无需使用解引用操作符。这在前面提到的例子中已经展示过。
2. 对于指向动态分配的数组的指针（例如`int* pIntArray = new int[5];`）：在这种情况下，指针变量`pIntArray`是指向动态分配的数组的指针，仍然可以通过索引的方式访问数组元素，同样不需要使用解引用操作符。



### 智能指针

在传统C++语言中，创建一个实体，分为栈内存创建和堆内存创建以及常量创建。

其中常常使用new方法创建实体指针方式 在堆内存创建，堆内存创建的实体需要后续手动清理。

为了方便，C++提出了智能指针这个概念，它能实现了创建、自动清理功能。

智能指针在C++11中主要是 unique_ptr唯一指针、shared_ptr共享指针、weak_ptr弱指针。而在C++98中引入的auto_ptr已经被废弃，所以就不做赘述了。

> C++ 智能指针底层是采用**引用计数**的方式实现的。简单的理解，智能指针在申请堆内存空间的同时，会为其配备一个整形值（初始值为 1），每当有新对象使用此堆内存时，该整形值 +1；反之，每当使用此堆内存的对象被释放时，该整形值减 1。当堆空间对应的整形值为 0 时，即表明不再有对象使用它，该堆空间就会被释放掉。



#### 唯一指针(unique_ptr)

```c++
#include <memory>
...
std::unique_ptr<int> p1();  //不传入任何实参
std::unique_ptr<int> p2(nullptr);  //传入空指针 nullptr
std::unique_ptr<int> p3(new int);  //使用new创建
std::unique_ptr<int>  p4 = std::make_unique<int>();  //使用 std::make_unique<T> 模板函数创建
```

唯一指针作为智能指针的一种，unique_ptr 指针自然也具备“在适当时机自动释放堆内存空间”的能力。和 shared_ptr 指针最大的不同之处在于，unique_ptr 指针指向的堆内存无法同其它 unique_ptr 共享，也就是说，每个 unique_ptr 指针都独自拥有对其所指堆内存空间的所有权，无法将其再赋值给另外一个指针。

```c++
std::unique_ptr<XXX> p0;
std::unique_ptr<XXX> p1(new XXX());
p0 = p1 //编译错误，unique_ptr不能共享。
```

唯一指针的作用就是在作用域范围内存在，超过作用域范围，自动清理内存，相当于执行了delete操作。

```c++
int main(){
    {
        std::unique_ptr<XXX> sharedXXX(new XXX()); 
    }  //sharedXXX作用范围结束，sharedXXX指针被清理。
}
```





#### 共享指针(shared_ptr )

```c++
#include <memory>
...
std::shared_ptr<int> p1;             //不传入任何实参
std::shared_ptr<int> p2(nullptr);    //传入空指针 nullptr
std::shared_ptr<int> p3(new int(10));  //使用new创建
std::shared_ptr<int> p3 = std::make_shared<int>(10);  //使用 std::make_shared<T> 模板函数创建
```

和 unique_ptr不同之处在于，多个 shared_ptr 智能指针可以共同使用同一块堆内存。并且，由于该类型智能指针在实现上采用的是引用计数机制，即便有一个 shared_ptr 指针放弃了堆内存的“使用权”（引用计数减 1），也不会影响其他指向同一堆内存的 shared_ptr 指针（只有引用计数为 0 时，堆内存才会被自动释放）。

用通俗的话来讲就是，**共享指针允许有多个共享指针指向同一个指针，并且只有当所有同类共享指针都经过了作用域范围，指针才会失效。**

```c++
int main(){
    {
        std::shared_ptr<XXX> e0;
        {
            std::shared_ptr<XXX> sharedXXX = std::make_shared<XXX>(); // 等同于std::shared_ptr<XXX> sharedXXX(new XXX())
		   e0 = sharedXXX;
        }  //此时由于e0作用范围没有结束，所以sharedXXX指针依然存在。
    }  //e0作用范围结束，所以sharedXXX指针被即使清理，e0也被智能指针清理。
}
```



#### 弱指针(weak_ptr)

```c++
#include <memory>
...
std::weak_ptr<int> p1;             //不传入任何实参
std::weak_ptr<int> p2(nullptr);    //传入空指针 nullptr
std::weak_ptr<int> p3(new int(10));  //使用new创建
```

weak_ptr 指针更常用于指向某一 shared_ptr 指针拥有的堆内存，因为在构建weak_ptr 指针对象时，可以利用已有的 shared_ptr 指针为其初始化。例如：

```c++
std::shared_ptr<int> sp (new int);
std::weak_ptr<int> wp3 (sp);
```

弱指针的作用就是为共享指针做无引用计数的指针。

共享指针之间将会被一一关联，只有当程序中的每一个同类共享指针 都超出作用域范围时，指针才会被统一清理。而弱指针由于无引用计数，可以关联共享指针，并且不会被关联，主共享指针一旦超出作用域范围，即会被清理，不需要理会弱指针。

```c++
#include <memory>

int main(){
    {
        std::weak_ptr<XXX> e0;
        {
            std::shared_ptr<XXX> sharedXXX = std::make_shared<XXX>(); // 等同于std::shared_ptr<XXX> sharedXXX(new XXX())
		   e0 = sharedXXX;
        }  //sharedXXX被清理,e0指向一个无效实体.
    }
}
```









## 函数

C++的函数和其他语言基本一致，这里就不多赘述了。

### 入口函数

C 语言规定，`main()`是程序的入口函数，即所有的程序一定要包含一个`main()`函数。程序总是从这个函数开始执行，如果没有该函数，程序就无法启动。其他函数都是通过它引入程序的。

```c
int main(void) {
  printf("Hello World\n");
  return 0;
}
```

和其他函数的void返回不一样，C的入口函数返回的是一个int类型，一般最后的`return 0;`表示函数结束运行，返回`0`。

正常情况下，如果`main()`里面省略`return 0`这一行，编译也不会报错，因为编译器会自动加上，即`main()`的默认返回值为0。但这种情况仅限于再入口函数上。

C语言的函数定义需要在入口函数的前面，否则入口函数调用不到。



### 函数参数

C语言的函数参数与其它语言的函数不同，它只能作用、影响在函数内部，不能对参数变量在外部进行影响。

```c
void increment(int a) {
  a++;
}

int i = 10;
increment(i);

printf("%d\n", i); // 10
```

上面示例中，调用`increment(i)`以后，变量`i`本身不会发生变化，还是等于`10`。因为传入函数的是`i`的拷贝，而不是`i`本身，拷贝的变化，影响不到原始变量。这就叫做“传值引用”。要实现参数变化，最好把它作为返回值传出来。

```c
void Swap(int x, int y) {
  int temp;
  temp = x;
  x = y;
  y = temp;
}

int a = 1;
int b = 2;
Swap(a, b);// 无效
```

上面的写法不会产生交换变量值的效果，因为传入的变量是原始变量`a`和`b`的拷贝，不管函数内部怎么操作，都影响不了原始变量。

如果想要传入变量本身，只有一个办法，就是传入变量的地址。通过将俩个变量指针进行互换 ,来实现将其变量值互换。

```c
void Swap(int* x, int* y) {
  int temp;
  temp = *x;
  *x = *y;
  *y = temp;
}

int a = 1;
int b = 2;
Swap(&a, &b);
```

 当然，这种写法十分麻烦，我们通常使用引用



### 引用外部文件的函数 - extern

对于多文件的项目，源码文件会用到其他文件声明的函数。这时，当前文件里面，需要给出外部函数的原型，并用`extern`说明该函数的定义来自其他文件。

```c
// int foo(int arg1, char arg2);
extern int foo(int arg1, char arg2);  // 来自与项目的其他文件中定义的foo函数。

int main(void) {
  int a = foo(2, 3);
  // ...
  return 0;
}
```

当然函数原型默认就是`extern`，所以这里不加`extern`，效果是一样的。



### 静态说明符 - static

`static`用于函数内部声明变量时，表示该变量只需要初始化一次，不需要在每次调用时都进行初始化。也就是说，它的值在两次调用之间保持不变。

```c
void counter(void) {
  static int count = 1;  // 只初始化一次
  printf("%d\n", count);
  count++;
}
int main(void) {
  counter();  // 1
  counter();  // 2
  counter();  // 3
  counter();  // 4
}
```

注意，`static`修饰的变量初始化时，只能赋值为常量，不能赋值为变量。

```c
int i = 3;
static int j = i; // 错误
```

static 也可用与修饰函数本身。表示该函数只能在该文件中使用，无法在其他文件中调用，即使外部文件使用extern修饰符。

```c
static void Log(){
    ...
}
```

### 常量修饰符 - const

使用const修饰符修饰的函数参数，为常量参数。表示函数内部不能修改该参数。

```c
void Log(const int* a){
    *a++; //操作错误 
}
```

但是上面这种写法，只限制修改a所指向的值，而`a`本身的地址是可以修改的。

```c
void Log(const int* a){
    int x = 13;
    a = &x; //操作成功 
}
```

当需要将其限制修改内存地址，需要把`const`与参数类型 位置互调。但这样则可以修改值。

```c
void Log(int* const a){
    int x = 13;
    a = &x; //操作错误 
}
```

如果都想限制修改的话，则需要在参数类型前后都加上`const`修饰符。

```c
void f(const int* const p) {
  // ...
}
```

**关于const 在数据类型位置，总结一句话，在前则限制 指针参数指向的值，在后 则限制本身地址。前值后址。 前后都有则全限制**

`int const*`和`const int*`是相同的。 当指针标记的符号`*`在const上时，相当于const与数据类型位置反过来。



const还有一种用法就是在类中定义方法上使用：

```c++
class XXX{
private:
    int m_X, m_Y;
public:
    int getX() const{
        m_X=2; //const原因，所以这里会报错
        return m_X;
    }
    int getY() {
        return m_Y;
    }
}
```

在类方法中const置于函数的参数括号后。意为该方法只读，不支持修改类中的参数。所以这里的`m_X=2` 编译会报错。

**如果该方法不需要修改类的参数，你应该总是把它标记为const。**

为什么需要这么做？

当一个函数中参数是 该类的const引用，即表示 该引用不能被修改，如：

```c++
getXXXin_m_X(const XXX& e)
```

那么这引用只能调用 不修改其中内容的方法，如一些Getter之内。但编译器要识别调用的方法是否是不含修改的操作，就需要查看该方法上是否含有const修饰符。否则调用就会报错：

```c++
getXXXin_m_X(const XXX& e){
    std::cout << e.getY() << std::endl;  //由于XX类中getY()函数定义上并没有const修饰符，编译器不能确保该函数是否会对类进行修改，所以这里会报错。
    std::cout << e.getX() << std::endl;  //带有const的类方法，成功执行。
}
```

所以这就是为什么你应该总是把不需要做修改类方法标记为const。

**注意：在同类中，可以存在同名的非const修饰符的方法和使用const修饰符的方法**：

```c++
int getX() {
        return m_X;
}
int getX() const{
        return m_X;
}
```



### 常量表达式修饰符 - constexpr

`constexpr` 是 C++11 引入的一个关键字，用于指定某个值是**在编译时常量**，或者某个函数/方法在给定常量参数时能够在编译时计算其结果。

`constexpr` 的作用：

- 编译时计算：***`constexpr` 允许表达式在编译时被计算，而不是运行时。***
- 性能优化：由于 `constexpr` 保证了某些计算在编译时完成，这可以避免运行时的开销。
- 模板元编程和静态断言：`constexpr` 可以与模板元编程和静态断言一起使用，以在编译时进行更复杂的计算和验证。

使用`constexpr` 后该函数 or 对象的值将会在编译时进行计算，利用这一个特点，`constexpr` 常常用来优化size返回、size设定：

```c++
constexpr size_t size(size_t originSize){
    return originSize + 1;
}
...
size_t s = 5;
constexpr size_t k = 3;

int array[s]  // 编译报错
int array[k];  // 编译正常
int array[size(s)];  //编译正常
```





### 可变函数

C语言允许用户传入未定义的函数，只需要在函数参数中设置`...`，表示函数接受可变数量的参数。

```c
int printf(const char* format, ...);
```

注意，...符号必须放在参数序列的结尾，否则会报错。这点和Python一样。
头文件stdarg.h定义了一些宏，可以操作可变参数。

- va_list：一个数据类型，用来定义一个可变参数对象。它必须在操作可变参数时，首先使用。

- va_start：一个函数，用来初始化可变参数对象。它接受两个参数，第一个参数是可变参数对象，第二个参数是原始函数里面，可变参数之前的那个参数，用来为可变参数定位。

- va_arg：一个函数，用来取出当前那个可变参数，每次调用后，内部指针就会指向下一个可变参数。它接受两个参数，第一个是可变参数对象，第二个是当前可变参数的类型。

- va_end：一个函数，用来清理可变参数对象。


下面是一个例子。

```c
double average(int i, ...) {
  double total = 0;
  va_list ap;
  va_start(ap, i);
  for (int j = 1; j <= i; ++j) {
    total += va_arg(ap, double);
  }
  va_end(ap);
  return total / i;
}
```

上面示例中，`va_list ap`定义`ap`为可变参数对象，`va_start(ap, i)`将参数`i`后面的参数统一放入`ap`，`va_arg(ap, double)`用来从`ap`依次取出一个参数，并且指定该参数为 double 类型，`va_end(ap)`用来清理可变参数对象。



### Lambda函数

C++11 引入了 Lambda 表达式，它是一种匿名函数，允许你在需要函数对象的地方创建一个临时的函数对象。Lambda 表达式在 C++ 中的主要作用是简化代码、提高可读性，并且可以捕获外部作用域的变量。

Lambda 表达式的一般形式如下：

```c++
[ captures ] ( parameters ) -> return_type {
    // Lambda 函数体
}

```

其中：

- `captures` 是可选的捕获列表，用于捕获外部作用域中的变量。可以通过值传递或引用传递捕获变量，并在 Lambda 函数体中使用这些变量。
- `parameters` 是可选的参数列表，类似于普通函数的参数。可以没有参数，也可以有多个参数。
- `return_type` 是可选的返回类型，可以自动推导，也可以显式指定。

**和其他语言不一样的是，C++中的Lambda函数内部是获取不到外部的数据的，要想获取外部的数据，所以 设计上多了一个所谓的捕获列表，用于指定 Lambda 表达式在创建时要捕获的外部作用域中的变量。**

举个简单例子：

```c++
int main() {
    int x = 10;
    int y = 20;

    // Lambda 表达式捕获 x 和 y
    auto lambda = [x, &y]() {
        std::cout << "Captured x: " << x << std::endl;
        std::cout << "Captured y (by reference): " << y << std::endl;
    };
    
    x = 100;
    y = 200;
    // 调用 Lambda 表达式
    lambda();
    return 0;
}
```

上面的lambda函数是一个Lambda表达式创建的，其中[ ]包含的捕获列表提前获取了x实际对象、y引用对象，然后在函数内部中进行了对应的处理，这样就不需要额外的设置两个函数参数去使用时获取。

### function

`std::function` 是一个通用的函数封装类模板，定义在 `<functional>` 头文件中。

它允许你以一种类型安全的方式存储、复制、调用可调用对象（函数、函数指针、Lambda 表达式、成员函数等），并可以用于实现回调机制、通用的接口设计等场景。它在 C++ 11中能够更好地替代函数指针，并且提供更多的灵活性和类型安全性。它使得在函数封装和函数对象传递等场景中变得更加方便和易于维护。

`std::function` 的定义语法如下：

```cpp
std::function<return_type(parameters)> func;
```

其中，`return_type` 是函数的返回类型，`parameters` 是函数的参数列表。

#### 优点

`std::function` 的优点和使用场景：

1. 类型安全：`std::function` 提供了类型安全的函数封装，避免了在使用函数指针时可能出现的类型不匹配的问题。它可以自动进行类型检查，确保在运行时调用时传递正确的参数。
2. 通用性：`std::function` 可以封装各种可调用对象，包括普通函数、函数指针、Lambda 表达式、成员函数等。这使得它在实现通用的接口设计或函数回调机制时非常灵活。
3. 可替代性：`std::function` 可以完全取代函数指针，而且更强大。函数指针只能指向特定的函数签名，而 `std::function` 可以在运行时保存任意可调用对象，并在需要时进行调用。

示例：

```c++
#include <iostream>
#include <functional>
int add(int a, int b) {
    return a + b;
}
int main() {
    // 使用 std::function 封装普通函数
    std::function<int(int, int)> func = add;
    // 使用 Lambda 表达式
    std::function<int(int, int)> lambdaFunc = [](int x, int y) {
        return x * y;
    };
    // 调用封装的函数
    int result1 = func(2, 3);
    int result2 = lambdaFunc(4, 5);
    std::cout << "Result 1: " << result1 << std::endl;
    std::cout << "Result 2: " << result2 << std::endl;
    return 0;
}
```



### C++中的计时

在 C++ 中，你可能想要测量代码的执行时间，无论是为了性能分析，还是为了其他目的。C++ 提供了几种方法来进行计时：

**C++11 的 `<chrono>` 库**: 这是最现代和推荐的方法来在 C++ 中进行计时。

```c++
#include <iostream>
#include <chrono>

int main() {
    auto start = std::chrono::high_resolution_clock::now();
	...
    auto end = std::chrono::high_resolution_clock::now();
    // 得到代码运行时间
    std::chrono::duration<double> duration = end - start;
	//  duration下的count方法可以返回 秒。
    std::cout << "Elapsed time: " << duration.count() << " seconds" << std::endl;
}
```

`<chrono>` 库提供了多种时间单位，如 `std::chrono::milliseconds`、`std::chrono::microseconds` 等，这使得时间测量更加灵活。



**C 的 `clock()` 函数**: 这是一个传统的方法，使用 C 语言的 `clock()` 函数来测量 CPU 时间。

```c
#include <iostream>
#include <ctime>

int main() {
    clock_t start = clock();
    ...
    clock_t end = clock();
    double duration = static_cast<double>(end - start) / CLOCKS_PER_SEC;

    std::cout << "Elapsed time: " << duration << " seconds" << std::endl;
}
```

注意：`clock()` 函数测量的是 CPU 时间，而不是实际的墙钟时间。这意味着它测量的是程序在 CPU 上执行的时间，而不是程序从开始到结束的实际时间。

在大多数情况下，使用 C++11 的 `<chrono>` 库是最好的选择，因为它是标准的、跨平台的，并提供了高精度的计时功能。



我们可以将其计时操作封装为一个struct ，利用栈内存清理原理 和 析构函数，来方便调用计时操作。

```cpp
struct Timer
{
    std::chrono::timer_point<std::chrono::steady_clock> start, end;
    std::chrono::duration<float> duration;
    Timer()
    {
        std::cout << "代码计时开始! " << std::endl;
        start = std::chrono::high_resolution_clock::now();
    }
    ~Timer()
    {
        end = std::chrono::high_resolution_clock::now();
        duration =  end - start;
        std::cout << "代码计时结束! " << std::endl;
        std::cout << "代码运行花费时间: " << duration.count() * 1000.0f << "毫秒" << std::endl;
    }
}

int main()
{
    {
        Timer timer;
        ...
    }
}
```



## 类型

### 类型转换

在 C++ 中，有几种不同类型的类型转换方式，用于在不同数据类型之间进行转换。以下是常见的 C++ 类型转换方式：

1. **隐式类型转换（Implicit Type Conversion）**：也称为自动类型转换，是由编译器自动完成的类型转换。例如，将整数赋值给浮点数变量，或将一个字符赋值给整数类型变量等。这种类型转换通常用于保证数据不丢失或提高表达式的精度。

```c++
std::string s1 = "I'm actually char type"; // 右值实际上是char数组，隐式转换为string类型。
```



2. **显式类型转换（Explicit Type Conversion）**：也称为强制类型转换，是通过使用 C++ 中的类型转换运算符来实现的。有三种形式的显式类型转换：

    - `static_cast`：静态转换，用于基本数据类型之间的转换，以及一些类层次间的向上转型和向下转型。
    - `dynamic_cast`：动态转换，用于在继承关系中进行安全的向下转型，需要有虚函数的参与，用于运行时类型检查。
    - `const_cast`：用于添加或去除 `const` 修饰符，从而改变指针或引用的常量性。
    - `reinterpret_cast`：用于不同类型之间的二进制位模式的转换，通常用于低级操作和平台特定的需求。




### 类型双关

所谓类型双关，即 使用特殊编程手段，绕过类型系统，将其语言中的类型进行强转。 

下面是 C++绕过类型系统实现类型双关 的例子：

```c++
int a = 50;  //a在内存中为 32 00 00 00（int 4字节）值为50；
double b = a; //普通赋值并不会直接转换，而是经过隐式转换，b实际在内存中为00 00 00 00 00 00 49 40（double 8字节）值为50.000000000；
double c = *(double*)&a  //通过将其对象地址 强制类型转换为 相应指针，再解引用，从而转换为对应值。c在内存中为32 00 00 00 cc cc cc cc值为-925e+61；
```

普通的类型转换 将经过类型系统进行相应的数据转换操作，内存数据 将被篡改为 符合转换类型的数据。 （上方例子中 a 到b 内存则是由32 00 00 00到了00 00 00 00 00 00 49 40 ）

C++中实现类型双关操作 ：**取址 强转为 指针 再解引用**，这种方法原数据内存将不被改变。（上方例子中 a 到c 内存则是由32 00 00 00到了32 00 00 00 cc cc cc cc）【c在内存中表示不存在的占位】。

*总结：*

*类型系统的 转换，保证了值的不变（大概部分），但自然内存将被改变。*

*通过指针转换 绕过类型系统 ，保证了内存不变，但自然值将被改变。*



### Union - 成员共享内存的struct

`union` 是一种C++中特殊的数据结构，允许在**相同的内存位置**存储不同的数据类型。

与结构体（`struct`）不同，`union` 中的所有成员共享同一块内存，因此 **`union` 的大小等于其中最大成员的大小**。当某个成员被赋值后，其他成员的值将变得无效。

正是这个原因，`union` 主要用于需要在不同的数据类型之间节省内存空间的情况，同时也需要注意使用时的潜在问题。

以下是一个简单的 `union` 示例：

```c++
#include <iostream>

union MyUnion {
    int i;
    double d;
    char c;
};
int main() {
    MyUnion u;

    u.i = 42;
    std::cout << "i: " << u.i << std::endl;

    u.d = 3.14;
    std::cout << "d: " << u.d << std::endl;

    u.c = 'A';
    std::cout << "c: " << u.c << std::endl;

    std::cout << "After changing member:" << std::endl;
    std::cout << "i: " << u.i << std::endl;
    std::cout << "d: " << u.d << std::endl;
    std::cout << "c: " << u.c << std::endl;

    return 0;
}
```

输出结果:

> i: 42
> d: 3.14
> c: U
> After changing member:
> i: 1374389589
> d: 3.14
> c: U

上面结果中，对Union对象u 单一赋值时，马上输出对应成员的值都能显示被正常赋值。但当最后统一输出打印发现，里面的值除了 最大的值 和 最后赋值（或者修改）的值 以外，其他成员的值都被篡改。

int、double、char中类型大小最大的是 double（8字节）所以最终都不会被篡改，char最后修改，所以也不会被篡改，最终唯独里面int类型成员被修改。

> 为什么union的最大类型 的值 始终不变呢？那上面的例子讲：
>
> 正常win32中，`int` 的大小为 4 字节，`double` 的大小为 8 字节，`char` 的大小为 1 字节。得知`double`大于`int`和`char`所以处于内存中高字节部分，而低字节部分的`int`和`char`怎么修改都不会到达 那部分，所以这就表名了Union中的最大类型成员始终不变。

所以使用 union 需要注意以下几点：

1. 在 `union` 中的不同成员可以拥有不同的数据类型，但只能同时使用一个成员。
2. 当一个成员被赋值后，其他成员的值或将变得无效（主要是非最大空间成员），因此需要小心使用。
3. 在使用 `union` 时，要确保你清楚每次访问时要使用哪个成员，以避免出现未定义行为。
4. `union` 的大小等于最大成员的大小，这可能会导致内存浪费。
5. C++11 引入了对 `union` 的新特性，允许在 `union` 中定义成员函数，使其更加灵活。

当Union包含匿名struct时，分配规则方法将不一样。

 下面是Union 包含匿名struct案例：

```c++
union MyUnion
{
	struct
	{
		int i;
		int z;
	};

	struct
	{
		int a;
		int b;
		int c;
	};
};

int main()
{
	MyUnion u;
	u.a = 4;
	u.b = 9;
	u.c = 10;

	u.i = 5;
	u.z = 7;

	std::cout << "a = " << u.a << std::endl;  \\ a = 5
	std::cout << "b = " << u.b << std::endl;  \\ b = 7
	std::cout << "c = " << u.c << std::endl;  \\ c = 10
    
	std::cout << "i = " << u.i << std::endl;  \\ i = 5
	std::cout << "z = " << u.z << std::endl;  \\ z = 7
	std::cin.get();
}
```

根据Union的特性，上方的MyUnion在内存中大小为12字节（成员多的匿名struct 最大）。

分配按照最大类型分配，所以按 成员多的匿名struct的布局分配。

其中（同为int）前4字节 i，a 共同争夺，中间4字节z，b共同争夺，而剩余4字节 稳定留给 c。最终c始终不变。



总结：

union大小由最大元素决定。当最大元素为匿名struct时，union的成员值将按照该匿名类中成员按顺序分配。最终剩余空间无争夺的成员将始终不变。



### 静态转换 - static_cast

在C语言中，类型转换存在 隐式转换和显式转换。

隐式转换顾名思义，就是在用户不进行任何操作下，编译器自动转换某个对象类型为另外一个对象，常见情况有 char数组转换为string等等。

而显式转换，则需要在编码中主动进行类型转换。C中常常在对象中以（cast type）存在。其意思为强制转换类型。

而在C++中，提出了`static_cast` 是一种类型转换运算符，用于在相关类型之间进行转换。它是编译时类型转换，这意味着转换的有效性在编译时进行检查，而不是在运行时。

```c++
double d = 3.14;
int i = static_cast<int>(d);  // 将double转换为int

class Base {};
class Derived : public Base {};

Derived* derived = new Derived();
Base* base = static_cast<Base*>(derived);  // 派生类指针转换为基类指针 下转上 子转父
Derived derivedObj;
Base& baseRef = static_cast<Base&>(derivedObj);  //同上原理, 引用转换

enum Color { RED, GREEN, BLUE };
int colorValue = static_cast<int>(GREEN);  // 将枚举转换为int
```

`static_cast` 是C++中最常用的类型转换工具之一。但是它并不具有判断可行性能力，只是一种强制转换。其本身效果和C中的强制类型转换一样。

当用它将类型 转换为不相关的类型时，如从 `void*` 到其他指针类型，或者当基类 转 派生类这种不符合条件的转换时，使用它会编译出现报错。这时就需要使用具有判断能力的`dynamic_cast`动态类型转换函数了。



### 动态转换 - dynamic_cast

`dynamic_cast` 是 C++ 中的另一种类型转换运算符，主要用于处理基类和派生类之间的转换，特别是在多态情境下。

与 `static_cast` 不同，`dynamic_cast` 是运行时类型转换，这意味着它在运行时检查转换的有效性。

```c++
class Base { virtual void foo() {} };  // 注意：至少需要一个虚函数
class Derived : public Base {};

Base* basePtr = new Derived();
Derived* derivedPtr = dynamic_cast<Derived*>(basePtr);  // 成功的转换

Base anotherBase;
Base* basePtr2 = &anotherBase;
Derived* derivedPtr2 = dynamic_cast<Derived*>(basePtr2);  // 返回 nullptr，因为basePtr2不指向Derived对象
```

使用dynamic_cast能够对类型转换进行判断，对于基类转派生类等不正常的转换，使用dynamic_cast会让其返回空指针，以阻止程序编译错误。

这里有个需要注意的细节：**对于使用dynamic_cast，需要对其基类相应的方法使用virtual以便称为虚函数**，dynamic_cast会对基类的虚函数进行判断，如果派生类拥有基类不拥有的方法的话，就会对其反回null prt以示阻止操作。

虽然`dynamic_cast` 能应付很多类型转换场景，但是由于 `dynamic_cast` 在运行时进行类型检查，它比其他类型的转换（如 `static_cast`）有更大的性能开销。因此，应该谨慎使用它，并只在确实需要运行时类型检查的情况下使用。常规情况下的类型转换还是尽量使用静态转换 - static_cast。









## 引用

### 使用方法

引用时C++的一种比指针更加便捷的传递聚合类型数据的方式。引用可以看做是数据的一个别名，通过这个别名和原来的名字都能够找到这份数据。引用类似于 Windows 中的快捷方式，一个可执行程序可以有多个快捷方式，通过这些快捷方式和可执行程序本身都能够运行程序。

引用和指针不一样，其引用不占有内存地址，只是在IDE中出现，不会出现在编译后中。

引用的定义方式类似于指针，只是用`&`取代了`*`，语法格式为：

```c++
int a = 15
int& name = a;
std::cout << std::to_string(name)  // 15
```

引用必须在定义的同时初始化，并且以后也要从一而终，不能再引用其它数据，这有点类似于常量（const 变量）。

### 引用作为函数参数

在定义或声明函数时，我们可以将函数的形参指定为引用的形式，这样在调用函数时就会将实参和形参绑定在一起，让它们都指代同一份数据。

```c++
void swap(int& a, int& b) {
	int temp = a;
	a = b;
	b = temp;
}

int main() {
	int a = 10;
	int b = 20;
	swap(a, b);
	Log(std::to_string(a).c_str());  // 20
}
```

使用引用作为函数参数可以轻松通过函数修改变量。这种方法比在函数参数中使用指针方便。



## 固定大小多类型容器 - tuple

tuple是是 C++11 引入的一个非常有用的模板类，它允许你将多个可能不同类型的值组合成一个单一对象。可以将 `std::tuple` 看作一个固定大小的容器，其中每个元素都可以有不同的类型。

### 创建和初始化

```c++
#include <tuple>

std::tuple<int, double, std::string> t1(1, 3.14, "Hello");
std::tuple<int, double, std::string> t2 = std::make_tuple(2, 2.71, "World");  //使用make_tuple函数创建,可以使用auto做返回类型.
```

### 常用函数

使用 `std::get<index>` 函数零开始的索引来访问 `tuple` 的元素。通过此方法亦能修改指定元素。

使用 `std::tuple_size<>` 来获取 `tuple` 的大小。

`std::tie` 可以用来解包 `tuple` 的内容到单独的变量中。

```c++
int i = std::get<0>(t1);        // i = 1
double d = std::get<1>(t1);     // d = 3.14
std::string s = std::get<2>(t1); // s = "Hello"
std::get<2>(t1) = "KKKK";

int size = std::tuple_size<decltype(t1)>::value;  // size = 3

int a;
double b;
std::string c;
std::tie(a, b, c) = t1;
```

### 结构化绑定

在C++17标准下，Tuple支持结构化绑定。类似于ES6那种，在返回类型中可以使用`auto [参数1,参数2...]`这种方式进行快速解析，将其tuple内的参数直接分配并创建新的参数上去。这样对于一些只需要 用几次的那种 返回多参数的情况，不再需要再去额外创建一个struct or class。

```cpp
std::tuple<std::string, int> analyzeData(const std::string& a, int b)
{
	std::tuple<std::string, int> f(a, b);
	return f;
}

int main()
{
	auto [a,b] = analyzeData("fefe", 222);  // 使用结构化绑定，直接将其返回的tuple内的元素分配到新的对象上。
	std::cout << a << "   " << b << std::endl;
	return 0;
}
```

Visual Studio 默认使用的是C++11标准。如果需要使用结构化标准则必须将其项目解决方案 C++标准修改到C++17才行。



## 动态容器 - vector

vector 容器是 STL(标准模板库) 中最常用的容器之一，它和 array 容器非常类似，都可以看做是对C++普通数组的“升级版”。不同之处在于，array 实现的是静态数组（容量固定的数组），而 vector 实现的是一个动态数组，即可以进行元素的插入和删除，在此过程中，vector 会动态调整所占用的内存空间，整个过程无需人工干预。

vector 常被称为向量容器，因为该容器擅长在尾部插入或删除元素，在常量时间内就可以完成，时间复杂度为`O(1)`；

而对于在容器头部或者中部插入或删除元素，则花费时间要长一些（移动元素需要耗费时间），时间复杂度为线性阶`O(n)`。

vector 容器以类模板 vector<T>（ T 表示存储元素的类型）的形式定义在 <vector> 头文件中，并位于 std 命名空间中。

```c++
#include <vector>
...
std::vector<XXX> values;
...
XXX a = values[0]; 
```

### 添加对象及问题

vector可以使用`push_back()`函数向内添加对象.

```c++
std::vector<XXX> values;
values.push_back(XXX(1));
```

这种方式非常简单，不需要进行额外设置vector空间大小。

**但是，其实这种方式会影响程序性能。**

vector虽然不需要主动给出size大小，但其实是会在每次添加时进行扩容。这种扩容会将其内容进行额外的复制，从而额外产生不必要的内存占用。

并且vector使用`push_back()`函数添加对象，其实并不是引用对象添加 对象地址消息，而是将其（）内的对象copy 赋值一份到vector数组中。

所以，又是`push_back()`函数复制 又是 vector自动扩容，自然浪费了很多内存空间。比如下面操作，通过类中的拷贝构造函数得知，短短添加3个对象，结果操作中白白复制了6次对象：

```c++
values.push_back(XXX(1));
values.push_back(XXX(2));
values.push_back(XXX(3));
```



如何解决上面的复制问题呢? 答案就是 ***明确数组数量，并使用`emplace_back()`函数 通过调用类的构造器创建，而非外部复制赋值添加。***

```c++
std::vector<XXX> values; //vector并没有初始化设置空间大小的构造函数。
values.reserve(3);  //设置vector空间大小,防止vector触发自动扩容。
values.emplace_back(1);  //emplace_back函数,通过调用存储类的相应构造函数在vector容器中自主创建对象。
values.emplace_back(2); 
values.emplace_back(3); 
```

通过上面修改后，vector添加操作就再也没有复制操作进行了。



### 排序

Vector容器可以使用sort来进行排序。

```c++
#include <algorithm>
...
std::vector<int> values = {3, 8, 6, 33, 123, 55, 765, 12, 34, 53};
std::sort(values.begin(), values.end());
```

在 C++ 中，`std::sort` 是标准库中提供的排序算法，用于对容器中的元素进行排序。它位于头文件<algorithm>下。你可以使用 `std::sort` 来对数组、向量（`std::vector`）、列表（`std::list`）等容器中的元素进行排序。

第一个参数是要排序的容器的开始迭代器，第二个参数是容器的结束迭代器。

sort支持提供第三个参数 - lambda函数，要求返回bool值，用于定义排序规则。

```c++
std::vector<int> values = {3, 8, 6, 33, 123, 55, 765, 12, 34, 53};
std::sort(values.begin(), values.end(),[](int a, int b){
    return a > b;
});  //sort排序从大到小。
```

要求lambda函数 取用两个参数，如果返回true，则第一个参数排在两者前；如果返回false，则第一个参数排在两者后。



## 固定容器 - array

array是 C++11 引入的一个容器，它表示一个固定大小的数组。与内置数组相比，它提供了更多的功能和类型安全性，但它们在内存中的表示是相同的，因此没有额外的运行时开销。

### 特点

`std::array` 的特点：

1. **固定大小**：`std::array` 的大小在编译时是固定的，不能在运行时更改。
2. **连续存储**：与内置数组一样，`std::array` 中的元素在内存中是连续存储的。
3. **类型安全**：提供了范围检查的成员函数 `at()`。
4. **STL 兼容**：`std::array` 是完全兼容 STL 的，这意味着你可以在 `std::array` 上使用 STL 算法。

### 使用方法

```c++
#include <array>
...
   // 创建一个大小为 3 的 int 类型的 array
    std::array<int, 3> arr = {1, 2, 3};

    // 访问元素
    std::cout << arr[0] << std::endl;  // 输出: 1
    std::cout << arr.at(1) << std::endl;  // 输出: 2

    // 遍历 array
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;  // 输出: 1 2 3 

    // 获取 array 的大小
    std::cout << "Size: " << arr.size() << std::endl; 
```

总的来说，`std::array` 是一个非常有用的容器，特别是当你知道数组的大小并且希望在编译时进行检查时。与内置数组相比，它提供了更多的功能和更好的类型安全性。



## 动态有序键值对容器 - map

`std::map` 是 C++ 标准库中的一个关联容器，用于存储键-值对 (在c++中存在专属于键值对的类型 - pair)。

### 特点

**有序容器**：`std::map` 中的元素按键的顺序自动排序。默认情况下，它使用 `<` 运算符进行排序。所以它是有序容器。

**唯一键**：每个键在 `std::map` 中只能出现一次。

**红黑树实现**：`std::map` 是基于**平衡二叉搜索树（通常是红黑树）**实现的，这确保了插入、删除和查找操作的对数时间复杂度。

### 使用方法

map有很多种方式初始化：

```cpp
std::map<std::string, int> ages;  //空值初始化
std::map<std::string, int> ages = {
    {"Alice", 30},
    {"Bob", 25},
    {"Charlie", 35}
};  //列表初始化
```

map使用它的insert方法进行向其中容器插入键值对(pair类型)：

```cpp
std::map<std::string, int> ages;
ages.insert(std::make_pair("Alice", 30));  // 使用std::make_pair函数创建一个pair对象
ages.insert({"Charlie", 35});  // 从 C++11 开始，也可以直接使用花括号
```

可以使用另一个 `map`（或 `std::multimap`）来初始化一个新的 `map`：

```c++
std::map<std::string, int> ages1 = {{"Alice", 30}, {"Bob", 25}};
std::map<std::string, int> ages2(ages1);  // 使用 ages1 初始化 ages2
```

从 C++11 开始，你还可以使用 `emplace` 方法直接在 `map` 中构造元素，而无需先创建键-值对：

```c++
std::map<std::string, int> ages;
ages.emplace("Alice", 30);
ages.emplace("Bob", 25);
```





### vector的简单实现

vector的实现主要内部拥有 3个成员。

size （用于记录成员数量），capacity（用于记录拥有的内存空间大小），Data（用于存储类型的数组）。

因为要实现其vector的动态扩容的功能。主要是利用 堆指针进行动态存储。

```cpp
template <typename T>
class Vector
{
private:
    T* m_Data;
    size_t m_Size;
    size_t m_Capacity;
private:
    /**
	 * \brief Reset m_Capacity
	 * \param newCapacity New capacity
	 */
    void ReAlloc(size_t newCapacity)
	{
		// T* newBlock = new T[newCapacity];
		T* newBlock = (T*)::operator new(newCapacity * sizeof(T));
		if (newCapacity < m_Size)
		{
			m_Size = newCapacity;
		}
		for (size_t i = 0; i < m_Size; ++i)
		{
			// newBlock[i] = std::move(m_Data[i]);
			new(&newBlock[i]) T(std::move(m_Data[i]));
		}
		for (size_t i = 0; i < m_Size; ++i)
		{
			m_Data[i].~T();
		}
		// delete[] m_Data;
		::operator delete(m_Data, m_Capacity * sizeof(T));
		m_Data = newBlock;
		m_Capacity = newCapacity;
	}
public:
    Vector()
    {
        ReAlloc(2);  // 默认设置容量为2
    }
    ~Vector()
    {
        Clear();
        //  清除m_Data
        ::operator delete(m_Data,m_Capacity * sizeof(T))
    }
    void PushBack(const T& value)
	{
		if (m_Capacity <= m_Size)
		{
			ReAlloc(m_Capacity + m_Capacity / 2);
		}
		m_Data[m_Size] = value;
		m_Size++;
	}
    void PushBack(T&& value)
	{
		if (m_Capacity <= m_Size)
		{
			ReAlloc(m_Capacity + m_Capacity / 2);
		}
		m_Data[m_Size] = std::move(value);
		m_Size++;
	}
    
    /**
	 * \brief Use element constructor push data
	 * \tparam Args constructor args
	 * \param args constructor args
	 * \return pushed data
	 */
    template <typename... Args>
	T& EmplaceBack(Args&&... args)
	{
		if (m_Capacity <= m_Size)
		{
			ReAlloc(m_Capacity + m_Capacity / 2);
		}
		// m_Data[m_Size] = T(std::forward<Args>(args)...);
		new(&m_Data[m_Size]) T(std::forward<Args>(args)...);
		return m_Data[m_Size++];
	}
    
    void PopBack()
	{
		if (m_Size > 0)
		{
			m_Data[m_Size].~T();
			m_Size--;
		}
	}

	void Clear()
	{
		for (size_t i = 0; i < m_Size; ++i)
		{
			m_Data[i].~T();
		}
		m_Size = 0;
	}

	size_t Size() const
	{
		return m_Size;
	}
    
    /**
	 * \brief Read Data by index
	 * \param index Data
	 * \return T&
	 */
	const T& operator[](size_t index) const
	{
		if (index > m_Size)
		{
			// assert
		}
		return m_Data[index];
	}

	/**
	 * \brief Change Data by index
	 * \param index 
	 * \return T&
	 */
	T& operator[](size_t index)
	{
		if (index > m_Size)
		{
			// assert
		}
		return m_Data[index];
	}  
};
```

其中拥有PushBack 函数，对于右值使用移动方式添加。EmplaceBack函数，使用对象的构造器进行直接添加。