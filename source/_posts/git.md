---
    title: Git版本管理快速入门 # 文章标题  
    date: 2021/07/30 11:09:29
    tags:
    - 其他
    categories: 其他 # 分类
    thumbnail: https://img.zssaer.cn/gitLogo.png?x-oss-process=style/small # 略缩图
---
<h1 align = "center">Git版本管理快速入门</h1>

# 前言

早期的项目开发,复杂繁琐,程序员与程序员之间联系困难,项目分工最后合并都要单独上传到服务器,最后拷贝下来.整个过程非常繁琐且枯燥,而且多人代码之间合并还容易出错.

然而为了解决这些困难,便出现分布式版本控制系统.项目与项目之间可以实现无缝对接,最重要的是可以实现版本回滚,一些设置造成了运行的错误,回滚就如同穿越时空,防止代码出错.

分布式版本控制系统有很多,如SVN,Git,BitKeeper等等, 而在众多分布式版本控制系统中Git是目前最流行且方便的.而且它是开源的,使用不需要付费.

![](https://img.zssaer.cn/git.png)

Git 是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目,适合单人,多人合作开发。

一些人初学Git时,肯定会想到大名鼎鼎的GitHub,并且将其挂接在一起,其实这是错误的.

![](https://img.zssaer.cn/gitIsNotGitHub.png)

Git是一种开源的代码版本控制**系统**,但它并不是版本控制**系统**的创始作,而创始人是Linus Torvalds(也就是Linux之父),他写Git的原因只是不满BitKeeper(当时流行的版本控制系统)的收费和闭源.要知道Linux系统的就是为开源而存在的,BitKeeper不开源自然Linux就不得放弃使用它,而这时为了解决Linux系统上的代码版本控制,Linus便自己写了一款开源的控制系统(不得不说,大神牛逼,全部自研!)

因为Git在Linux上的出色,便随后推出了Windows和Mac版本.而这时当年的BitKeeper眼睁睁看着自己的领域被流失,最后在Git诞生11年也只好被迫开源了,但那时也为时已晚.(不得不说一句,开源必将成功),如今我们站在上帝视角去指责bitkeeper其实不太合适，其实bitkeeper当年的选择也没什么错，在那个时代，通过闭源软件获取利润无疑是最稳妥的做法，就像微软公司一样，何况他还免费授权给Linus使用，只是可惜他碰到了天才的Linus。只能说，bitkeeper就像诺基亚一样，没有做错什么，但就是输了。

而GitHub是一个面向开源及私有软件项目的托管平台，因为只支持Git作为唯一的版本库格式进行托管(Git开源,免费使用)，故名GitHub,它只是一个集中管理的云项目网站.用户可以把本地的Git项目放置在他们的网站上实现云存储管理功能。

所以GitHub只是一个使用Git功能的云存储管理网站,热度非常高,它与Git没有直接的关系.当然还有国外的GitLab,国内Gitee都是相同网站.

所以,学习Git就等于学习了GitHub等等这类网站的使用方法,非常重要.



# Git 与 SVN 区别

Git和SVN都是项目版本控制软件,在一些企业中都有使用,但一些区别:

**Git 是分布式的，SVN 不是**：这是 Git 和其它非分布式的版本控制系统，例如 SVN，CVS 等，最核心的区别。

**Git 把内容按元数据方式存储，而 SVN 是按文件：**所有的资源控制系统都是把文件的元信息隐藏在一个类似 .svn、.cvs 等的文件夹里。

**Git 分支和 SVN 的分支不同：**分支在 SVN 中一点都不特别，其实它就是版本库中的另外一个目录。

**Git 没有一个全局的版本号，而 SVN 有：**目前为止这是跟 SVN 相比 Git 缺少的最大的一个特征。

**Git 的内容完整性要优于 SVN：**Git 的内容存储使用的是 SHA-1 哈希算法。这能确保代码内容的完整性，确保在遇到磁盘故障和网络问题时降低对版本库的破坏。

在目前国内大部分公司优先使用Git为主,一部分对内公司采用SVN.



# Git安装

Git 各平台安装包下载地址为：http://git-scm.com/downloads

## Linux 平台上安装

Git 的工作需要调用 curl，zlib，openssl，expat，libiconv 等库的代码，所以需要先安装这些依赖工具。

在有 yum 的系统上（比如 Fedora）或者有 apt-get 的系统上（比如 Debian 体系），可以用下面的命令安装：

各 Linux 系统可以使用其安装包管理工具（apt-get、yum 等）进行安装：

```
$ yum install curl-devel expat-devel gettext-devel \
  openssl-devel zlib-devel

$ yum -y install git-core

$ git --version
git version 1.7.1
```

## Git 配置

Git 提供了一个叫做 git config 的工具，专门用来配置或读取相应的工作环境变量。

在 Windows 系统上，Git 会找寻用户主目录下的 .gitconfig 文件。主目录即 $HOME 变量指定的目录，一般都是 C:\Documents and Settings\$USER。

Git 还会尝试找寻 /etc/gitconfig 文件，只不过看当初 Git 装在什么目录，就以此作为根目录来定位。



配置个人的用户名称和电子邮件地址：

```bash
$ git config --global user.name "runoob"
$ git config --global user.email test@runoob.com
```

如果用了 **--global** 选项，那么更改的配置文件就是位于你用户主目录下的那个，以后你所有的项目都会默认使用这里配置的用户信息。



我们先来理解下 Git 工作区、暂存区和版本库概念：

- **工作区：**就是你在电脑里能看到的目录。

- **暂存区：**英文叫 stage 或 index。一般存放在 **.git** 目录下的 index 文件（.git/index）中，所以我们把暂存区有时也叫作索引（index）。

- **版本库：**工作区有一个隐藏目录 **.git**，这个不算工作区，而是 Git 的版本库。

# Git使用入门

这儿有一份快速入门指南:http://rogerdudler.github.io/git-guide/index.zh.html 也可以选择阅读.

使用Git前，需要先建立一个仓库(repository)。您可以使用一个已经存在的目录作为Git仓库或创建一个空目录,或者去克隆其他项目

1.使用命令在其项目文件夹下来创建Git项目,或者从其他项目下克隆下来

```bash
git init    #新建项目到文件夹
git clone [项目地址]  #克隆其他项目到当前文件夹
```

2.设置该项目的远程服务器位置(可以在Github,Gitee上进行新建项目以便获取地址),以便之后上传文件(克隆项目跳过此步骤)

```
git remote add origin [项目地址]
```

2.使用命令来添加需要提交的文件

```bash
git add [文件名][文件名]...  #添加指定文件到暂存区
git add [dir]   	 #添加指定目录到暂存区，包括子目录
git add . 			#添加当前目录下的所有文件到暂存区
```

3.现在我们已经添加了这些文件，我们希望它们能够真正被保存在Git HEAD中。

```bash
git commit -m "提交信息" 
git commit -a     # -a 参数设置后下次修改文件后不需要执行 git add 命令，直接来提交
```

4.现在我们修改之后可以进行推送到服务器中。

```bash
git push -u origin master  #将其HEAD区推出至远程服务器中的Master分支中
git push #将其推出至当前所在分支中
```

5.当远程服务器中代码更新后,你可以从远程服务器中获取最新代码并合并本地的版本。

```bash
git pull #默认将当前分支更新合并
git pull origin master:feature_A          #将远程服务器中的origin 的 master 分支拉取过来，与本地的 feature_A 分支合并。
```

6.获取历史提交版本信息

```bash
git log
```

7.撤回版本

```
git reset [版本值]   #返回至指定版本(版本值只需要一部分头部即可)
git reset HEAD^     #回退至上个版本
```





## 分支管理

几乎每一种版本控制系统都以某种形式支持分支。

使用分支意味着你可以从开发主线上分离开来，然后在不影响主线的同时继续工作。

用于多功能多人合作工作.



1.创建分支 切换分支:

```bash
git branch [分支名]		#创建分支
git checkout [分支名]		#切换分支
git checkout -b [分支名]	#创建并切换分支
```

2.删除分支

```bash
git branch -d [分支名]
```

3.合并分支:一旦某分支有了独立内容，你终究会希望将它合并回到你的主分支。 你可以使用以下命令将任何分支合并到当前分支中去

```
git merge [分支名]       #将其分支内容合并到当前分支
```

但不是每次合并都会非常成功,如果其中同一个文件内容之间有区别,则会发生冲突.这时Git会将其两分支文件合并并标记冲突位置.

手动解决冲突后使用`git add`来告知Git文件冲突已解决.并提交保存

```
git add [文件名]
git commit -m [信息]
```



## 保存点

在进行合并分支操作时,一般都会出现代码冲突,为了安全起见,一般可以使用设置保存点方式来进行合并测试.

方式步骤:

1. 确保你在正确的分支上并且你有一个干净的工作状态(暂存区)。

   ```bash
   git status
   ```

   ```bash
   # On branch master
   nothing to commit (working directory clean)
   ```

   

2. 创建一个新的分支作为保存点,但不要切换到它.

   ```bash
   git branch savepoint
   ```

   

3. 进行合并操作等

   ```bash
   git merge spiffy_new_feature
   ```

4. **切换到您的可视化工具并预测刷新时其视图将如何变化。**

5. 对结果满意吗？

   如果满意,删除保存点

   ```bash
   git branch -d savepoint
   ```

   如果不满意,将分支重置到保存点

   ```bash
   git reset --hard savepoint
   ```

   如果要清理，现在可以使用`git branch -d savepoint`

## cherry-pick

对于多分支的代码库，将代码从一个分支转移到另一个分支是常见需求。

这时分两种情况。一种情况是，你需要另一个分支的所有代码变动，那么就采用合并（`git merge`）。

另一种情况是，你只需要部分代码提交的变动（某几个提交），这时可以采用 `Cherry-pick`命令。

<img src="https://img.zssaer.cn/reachability-example.png" style="zoom:130%;" />

如果您目前在此图中的 H提交点,并输入了`git cherry-pick E[SHA]`,你将获取E提交点到H后面

<img src="https://img.zssaer.cn/cherry-pick-example-1.png" style="zoom:130%;" />

同理,你可以连续获取并合并多个提交点,你输入类似`git cherry-pick C D E`，你会在完成后得到这个：

<img src="https://img.zssaer.cn/cherry-pick-example-2.png" style="zoom:130%;" />

但其中C D E 必须是按由前到后的先后顺序来的,否则会合并会报错.