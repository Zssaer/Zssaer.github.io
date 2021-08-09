---
    title:  Docker入门教程(一) # 文章标题  
    date: 2021/08/09 14:18:32  # 文章发表时间
    tags:
    - 后端
    categories: 后端 # 分类
    thumbnail: https://zssaer-img.oss-cn-chengdu.aliyuncs.com/dockerlogo.jpg # 略缩图
---

<h1 align = "center"> Docker入门教程(一)</h1>

### 前言

在开发过程中一个常见的问题是环境一致性问题。由于开发环境、测试环境、生产环境不一致，导致有些 bug 并未在开发过程中被发现。

发布一项项目就需要在服务器上进行各种相关环境配置，非常繁琐，而且极易出现兼容错误（“这段代码在我机器上没问题啊”）等，甚至导致项目发布延期，就算单个项目可能顺利了，但如果项目做集群的话，那么就会非常困难。

这时人们就在想，如果有一个容器直接配置好所有运行环境，就想系统ISO文件一样，使用克隆应用直接克隆不就轻松了吗？

所以这时Docker就诞生了，Docker采用的镜像提供了除内核外完整的运行时环境，确保了应用运行环境一致性，从而不会再出现 *「这段代码在我机器上没问题啊」* 这类问题。



### 简介

![](https://zssaer-img.oss-cn-chengdu.aliyuncs.com/docker.jpg)

**Docker** 最初是 `dotCloud` 公司创始人 [Solomon Hykes](https://github.com/shykes)在法国期间发起的一个公司内部项目，它是基于 `dotCloud` 公司多年云服务技术的一次革新，并于 [2013 年 3 月以 Apache 2.0 授权协议开源 ](https://en.wikipedia.org/wiki/Docker_(software))，主要项目代码在 [GitHub](https://github.com/moby/moby)上进行维护。`Docker` 项目后来还加入了 Linux 基金会，并成立推动 [开放容器联盟（OCI）](https://opencontainers.org/)。

**Docker** 自开源后受到广泛的关注和讨论，至今其 [GitHub 项目 ](https://github.com/moby/moby)已经超过 5 万 7 千个星标和一万多个 `fork`。甚至由于 `Docker` 项目的火爆，在 `2013` 年底，[dotCloud 公司决定改名为 Docker ](https://www.docker.com/blog/dotcloud-is-becoming-docker-inc/)。`Docker` 最初是在 `Ubuntu 12.04` 上开发实现的；`Red Hat` 则从 `RHEL 6.5` 开始对 `Docker` 进行支持；`Google` 也在其 `PaaS` 产品中广泛应用 `Docker`。

Docker由Google推出的Go语言开发。对进程进行封装隔离，属于 [操作系统层面的虚拟化技术 ](https://en.wikipedia.org/wiki/Operating-system-level_virtualization)。由于隔离的进程独立于宿主和其它的隔离的进程，因此也称其为容器。

Docker拥有Linux端、Mac端、Windows端，但主要以Linux端为主，因为正常工作环境下，服务器也是在Linux搭建的，所以推荐使用Linux搭建Docker。

当然也可以在实际搭建前进行体验练习Docker，[Play with Docker](https://labs.play-with-docker.com/)这个网站支持在线网络上进行体验Docker,每次申请体验有时间限制,但过时候可以继续申请,完全免费。



### 特点

* **更高效的利用系统资源**

由于容器不需要进行硬件虚拟以及运行完整操作系统等额外开销，`Docker` 对系统资源的利用率更高。无论是应用执行速度、内存损耗或者文件存储速度，都要比传统虚拟机技术更高效。因此，相比虚拟机技术，一个相同配置的主机，往往可以运行更多数量的应用。

* **更快速的启动时间**

传统的虚拟机技术启动应用服务往往需要数分钟，而 `Docker` 容器应用，由于直接运行于宿主内核，无需启动完整的操作系统，因此可以做到秒级、甚至毫秒级的启动时间。大大的节约了开发、测试、部署的时间。

* **一致的运行环境**

`Docker` 的镜像提供了除内核外完整的运行时环境，确保了应用运行环境一致性，从而不会再出现 *「这段代码在我机器上没问题啊」* 这类问题。

* **持续交付和部署**

使用 `Docker` 可以通过定制应用镜像来实现持续集成、持续交付、部署。开发人员可以通过 [Dockerfile](https://vuepress.mirror.docker-practice.com/image/dockerfile/) 来进行镜像构建，并结合 [持续集成(Continuous Integration)](https://en.wikipedia.org/wiki/Continuous_integration)系统进行集成测试，而运维人员则可以直接在生产环境中快速部署该镜像，甚至结合 [持续部署(Continuous Delivery/Deployment)](https://en.wikipedia.org/wiki/Continuous_delivery)系统进行自动部署。

而且使用 [`Dockerfile`](https://vuepress.mirror.docker-practice.com/image/build.html) 使镜像构建透明化，不仅仅开发团队可以理解应用运行环境，也方便运维团队理解应用运行所需条件，帮助更好的生产环境中部署该镜像。

### 对比传统虚拟机

| 特性       | 容器               | 虚拟机      |
| :--------- | :----------------- | :---------- |
| 启动       | 秒级               | 分钟级      |
| 硬盘使用   | 一般为 `MB`        | 一般为 `GB` |
| 性能       | 接近原生           | 弱于        |
| 系统支持量 | 单机支持上千个容器 | 一般几十个  |

### 基本概念

**Docker** 包括三个基本概念

- **镜像**（`Image`）
- **容器**（`Container`）
- **仓库**（`Repository`）

<img src="https://zssaer-img.oss-cn-chengdu.aliyuncs.com/docker.png" style="zoom:110%;" />

#### 镜像

或许都知道，操作系统分为 **内核** 和 **用户空间**。对于`Linux` 而言，内核启动后，会挂载 `root` 文件系统为其提供用户空间支持。而 **Docker 镜像**（`Image`），就相当于是一个 `root` 文件系统。比如Docker官方镜像 `ubuntu:18.04` 就包含了完整的一套 Ubuntu 18.04 最小系统的 `root` 文件系统。

**Docker 镜像 是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。**
镜像 **不包含** 任何动态数据，其内容在构建之后也不会被改变。说的通俗点，Docker就是使用了分层存储技术的软件压缩包。

#### 容器

容器的实质是进程，但与直接在外部执行的进程不同，容器进程运行于属于自己的独立的 [命名空间 (opens new window)](https://en.wikipedia.org/wiki/Linux_namespaces)。因此容器可以拥有自己的 `root` 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。

容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于系统的虚拟机下操作一样。

这种特性使得容器封装的应用比直接在宿主运行更加安全。也因为这种隔离的特性，所以很多人初学 Docker 时常常会混淆容器和虚拟机。

每一个容器运行时，是以镜像为基础层，在其上创建一个当前容器的存储层，我们可以称这个为容器运行时读写而准备的存储层为 **容器存储层**。容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡。因此，任何保存于容器存储层的信息都会随容器**删除**而丢失。按照 Docker 最佳实践的要求，容器不应该向其存储层内写入任何数据，容器存储层要保持无状态化。

所以所有的文件写入操作，都应该使用 [数据卷（Volume）](https://vuepress.mirror.docker-practice.com/data_management/volume.html)、或者 [绑定宿主目录](https://vuepress.mirror.docker-practice.com/data_management/bind-mounts.html)，在这些位置的读写会跳过容器存储层，直接对宿主（或网络存储）发生读写，其性能和稳定性更高。


#### 镜像与容器关系

镜像（`Image`）和容器（`Container`）的关系，就像是面向对象程序设计中的 `类` 和 `实例` 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。


#### Docker Registry/仓库

镜像构建完成后，可以很容易的在当前宿主机上运行，但是，如果需要在其它服务器上使用这个镜像，我们就需要一个集中的存储、分发镜像的服务，[Docker Registry](https://vuepress.mirror.docker-practice.com/repository/registry.html) 就是这样的服务。

一个 **Docker Registry** 中可以包含多个 **仓库**（`Repository`）；每个仓库可以包含多个 **标签**（`Tag`）；每个标签对应一个镜像。

通常，一个仓库会包含同一个软件不同版本的镜像，而标签就常用于对应该软件的各个版本。我们可以通过 `<仓库名>:<标签>` 的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以 `latest` 作为默认标签。

仓库名经常以 *两段式路径* 形式出现，比如 `jwilder/nginx-proxy`，前者往往意味着 Docker Registry 多用户环境下的用户名，后者则往往是对应的软件名。但这并非绝对，取决于所使用的具体 Docker Registry 的软件或服务。

Docker Registry 拥有一个公开服务，它开放给用户使用、允许用户管理镜像的 Registry 服务，允许用户免费上传、下载公开的镜像，并可能提供收费服务供用户管理私有镜像。就类似于Maven和NPM这些架包管理器一样。

Docker默认的Registry 公开服务使用的是 [Docker Hub](https://hub.docker.com/)除此以外，还有 Red Hat 的 [Quay.io ](https://quay.io/repository/)；Google的 [Google Container Registry ](https://cloud.google.com/container-registry/)，[Kubernetes ](https://kubernetes.io/)的镜像使用的就是这个服务；当然代码托管平台 [GitHub ](https://github.com/)也推出了 [ghcr.io ](https://docs.github.com/cn/packages/working-with-a-github-packages-registry/working-with-the-container-registry)。

由于某些活蟹原因，在国内访问这些服务可能会比较慢。国内有Docker下载加速器，常见的有 [阿里云加速器 ](https://www.aliyun.com/product/acr?source=5176.11533457&userCode=8lx5zmtu)、[DaoCloud 加速器 ](https://www.daocloud.io/mirror#accelerator-doc)等。

除了使用公开服务外，用户还可以在本地搭建私有 Docker Registry。



### Docker镜像

#### 获取镜像

可以前往[Docker Hub](https://hub.docker.com/search?q=&type=image)上获取官方高质量的镜像。

从 Docker 镜像仓库获取镜像的命令是 `docker pull`。其命令格式为：

```shell
$ docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]
```

具体的选项可以通过 `docker pull --help` 命令看到，这里我们说一下镜像名称的格式。

- Docker 镜像仓库地址：地址的格式一般是 `<域名/IP>[:端口号]`。默认地址是 Docker Hub(`docker.io`)。
- 仓库名：如之前所说，这里的仓库名是两段式名称，即 `<用户名>/<软件名>`。对于 Docker Hub，如果不给出用户名，则默认为 `library`，也就是官方镜像。

#### 查询本地镜像

从远程仓库获取镜像下载成功后，可以使用`docker images ls`查看当前已拥有的镜像。

```shell
$ docker image ls
REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
redis                latest              5f515359c7f8        5 days ago          183 MB
nginx                latest              05a60462f8ba        5 days ago          181 MB
mongo                3.2                 fe9198c04d62        5 days ago          342 MB
<none>               <none>              00285df0df87        5 days ago          342 MB
ubuntu               18.04               329ed837d508        3 days ago          63.3MB
ubuntu               bionic              329ed837d508        3 days ago          63.3MB
```

列表包含了 `仓库名`、`标签`、`镜像 ID`、`创建时间` 以及 `所占用的空间`。

其中**镜像 ID** 则是镜像的唯一标识，一个镜像可以对应多个 **标签**。因此，在上面的例子中，我们可以看到 `ubuntu:18.04` 和 `ubuntu:bionic` 拥有相同的 ID，因为它们其实对应的是同一个镜像。

上面的镜像列表中，还可以看到一个特殊的镜像，这个镜像既没有仓库名，也没有标签，均为 `<none>`。我们把它叫做悬浮镜像。这个镜像原本是有镜像名和标签的，原来为 `mongo:3.2`，随着官方镜像维护，发布了新版本后，重新 `docker pull mongo:3.2` 时，`mongo:3.2` 这个镜像名被转移到了新下载的镜像身上，而旧的镜像上的这个名称则被取消，从而成为了 `<none>`，代表着这个镜像已经过时了，所以也可以随意删除它。



#### 运行本地镜像

有了镜像后，我们就能够以这个镜像为**基础启动并运行一个容器**。以上面的 `ubuntu:18.04` 为例，如果我们打算启动里面的 `bash`终端 并且进行交互式操作的话，使用`docker run`命令:

```shell
$ docker run -it --rm -p 80:80 --name ubuntu-test ubuntu:18.04 bash

root@e7009c6ce357:/#
```

`docker run`命令参数:

- `-it`：这是两个参数，一个是 `-i`：交互式操作，一个是 `-t` 终端,两个参数可以合二为一。我们这里打算进入 `bash` 执行一些命令并查看返回结果，因此我们需要交互式终端。
- `-p`：定义端口，前为本地主机端口，后为容器端口。
- `--rm`：这个参数是说容器退出后随之将其删除。默认情况下，为了排障需求，退出的容器并不会立即删除，除非手动 `docker rm`。我们这里只是随便执行个命令，看看结果，不需要排障和保留结果，因此使用 `--rm` 可以避免浪费空间。
- `--name`：定义启动后的容器名称。
- `ubuntu:18.04`：这是指用 `ubuntu:18.04` 镜像为基础来启动容器。
- `bash`：放在镜像名后的是 **命令**，这里我们希望有个交互式 Shell，因此用的是 `bash`。
- `-d`:后台运行,不会堵塞shell终端.

使用 `docker port` 来查看当前映射的端口配置，也可以查看到绑定的地址

```bash
$ docker port fa 80
0.0.0.0:32768
```



#### 删除本地镜像

如果要删除本地的镜像，可以使用 `docker image rm` 命令。

```bash
$ docker image rm [选项] <镜像1> [<镜像2> ...]
```

其中，`<镜像>` 可以是 `镜像短 ID`(id前几位数字)、`镜像长 ID`、`镜像名` 或者 `镜像摘要`。

可以 用 docker image ls 命令来配合删除多个镜像。比如删除所有的redis镜像：

```shell
$ docker image rm $(docker image ls -q redis)
```



####  commit定制镜像

当我们修改好容器中的文件后，也就是改动了容器的存储层。可以通过 `docker diff` 命令看到具体的改动。

```bash
$ docker diff webserver
C /root
A /root/.bash_history
C /run
C /usr
```

容器中任何文件修改都会被记录于容器存储层里。而 Docker 提供了一个 `docker commit` 命令，可以将容器的存储层保存下来成为新的镜像。

```bash
$docker commit [选项] <容器ID或容器名> [<仓库名>[:<标签>]]
```

使用方法例如:

```bash
$ docker commit --author "Tao Wang <twang2218@gmail.com>" \
    --message "修改了默认网页" webserver nginx:v2
```

将其当前webserver容器打包为`nginx:v2`镜像，其中 `--author` 是指定修改的作者，而 `--message` 则是记录本次修改的内容。这点和 `git` 版本控制相似，不过这里这些信息可以省略留空。

是不是觉得这样工作环境下就使用commit进行打包成镜像就行了？

虽然使用 `docker commit` 命令虽然可以比较直观的帮助理解镜像分层存储的概念，但是实际环境中并不会这样使用。

因为使用commit打包安装软件包、编译构建，会有大量的无关内容被添加进来，将会导致镜像极为臃肿。此外，使用 `docker commit` 意味着所有对镜像的操作都是黑箱操作，生成的镜像也被称为 **黑箱镜像**，就是除了制作镜像的人知道执行过什么命令、怎么生成的镜像，别人根本无从得知，这种黑箱镜像的维护工作是非常痛苦的。

所以定制镜像应该使用 `Dockerfile` 来完成，而不是使用`docker commit`。但`docker commit` 命令除了学习之外，其实还有一些特殊的应用场合，比如被入侵后保存现场等。



#### Dockerfile定制镜像

镜像的定制实际上就是定制每一层所添加的配置、文件。如果我们可以把每一层修改、安装、构建、操作的命令都写入一个脚本，用这个脚本来构建、定制镜像，那么之前提及的无法重复的问题、镜像构建透明性的问题、体积的问题就都会解决。这个脚本就是 Dockerfile。

Dockerfile 是一个文本文件，其内包含了一条条的 **指令(Instruction)**，每一条指令构建一层，因此每一条指令的内容，就是描述该层应当如何构建。

以Nginx为例:

在一个空白目录中，建立一个文本文件，并命名为 `Dockerfile`：

```shell
$ mkdir mynginx
$ cd mynginx
$ touch Dockerfile
```

编辑里面内容为:

```dockerfile
FROM nginx
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```

* FROM 指定基础镜像
* RUN 用来执行命令行命令,由于命令行的强大能力，`RUN` 指令在定制镜像时是最常用的指令之一。RUN命令可以叠加,建议使用`&&`叠加,执行就和手工建立镜像的过程一样。在撰写 Dockerfile 的时候，要经常提醒自己，这并不是在写 Shell 脚本，而是在定义每一层该如何构建。

```dockerfile
FROM debian:stretch

RUN set -x; buildDeps='gcc libc6-dev make wget' \
    && apt-get update \
    && apt-get install -y $buildDeps \
    && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
    && mkdir -p /usr/src/redis \
    && tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1 \
    && make -C /usr/src/redis \
    && make -C /usr/src/redis install \
    && rm -rf /var/lib/apt/lists/* \
    && rm redis.tar.gz \
    && rm -r /usr/src/redis \
    && apt-get purge -y --auto-remove $buildDeps
```

这里为了格式化还进行了换行。Dockerfile 支持 Shell 类的行尾添加 `\` 的命令换行方式，以及行首 `#` 进行注释的格式。

Dockerfile中的本地主机地址都是使用相对地址,而内部容器定义使用的是绝对地址。

定制完Dockerfile文件后,在其文件目录下的执行`docker build`命令:

```bash
$ docker build -t nginx:v3 .
Sending build context to Docker daemon 2.048 kB
Step 1 : FROM nginx
 ---> e43d811ce2f4
Step 2 : RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
 ---> Running in 9cdc27646c7b
 ---> 44aa4490ce2c
Removing intermediate container 9cdc27646c7b
Successfully built 44aa4490ce2c
```

从命令的输出结果中，我们可以清晰的看到镜像的构建过程。在 `Step 2` 中，如同我们之前所说的那样，`RUN` 指令启动了一个容器 `9cdc27646c7b`，执行了所要求的命令，并最后提交了这一层 `44aa4490ce2c`，随后删除了所用到的这个容器 `9cdc27646c7b`。最终生成了`nginx:v3`镜像。

**注意：**

我们会看到 `docker build` 命令最后有一个 `.`，`.` 表示当前目录，而 `Dockerfile` 就在当前目录，因此不少初学者以为这个路径是在指定 `Dockerfile` 所在路径，这么理解其实是不准确的。如果对应上面的命令格式，你可能会发现，这是在指定 **上下文路径**。

**其它 `docker build` 的用法**

`docker build` 还支持从 URL 构建，比如可以直接从 Git repo 中构建：

```shell
# $env:DOCKER_BUILDKIT=0
# export DOCKER_BUILDKIT=0

$ docker build -t hello-world https://github.com/docker-library/hello-world.git#master:amd64/hello-world

Step 1/3 : FROM scratch
 --->
Step 2/3 : COPY hello /
 ---> ac779757d46e
Step 3/3 : CMD ["/hello"]
 ---> Running in d2a513a760ed
Removing intermediate container d2a513a760ed
 ---> 038ad4142d2b
Successfully built 038ad4142d2b
```

这行命令指定了构建所需的 Git repo，并且指定分支为 `master`，构建目录为 `/amd64/hello-world/`，然后 Docker 就会自己去 `git clone` 这个项目、切换到指定分支、并进入到指定目录后开始构建。]



### Docker容器

#### 启动容器

启动容器有两种方式，一种是基于镜像新建一个容器并启动，另外一个是将在终止状态（`exited`）的容器重新启动。

* 新建并启动：在第一次获取到的镜像时，启动为镜像。使用`docker run ` 命令。已经在运行本地镜像中说明，所以略过。

* 启动已终止容器：可以利用 `docker container start` 命令，直接将一个已经终止运行（`exited`）的容器重新启动运行。可以利用`docker ps`命令查看容器状态。

  此外，`docker container restart` 命令会将一个运行态的容器终止，然后再重新启动它。

  

#### 终止容器

可以使用 `docker container stop` 来终止一个运行中的容器。

此外，当 Docker 容器中指定的应用终结时，容器也自动终止。

只启动了一个终端的容器，用户通过 `exit` 命令或 `Ctrl+d` 来退出终端时，所创建的容器立刻终止。

终止状态的容器可以用 `docker container ls -a` 命令看到。



#### 容器后台运行

正常使用`docker run`时，运行容器会直接进入容器内容的终端中。

而更多的时候，需要让 Docker 在后台运行而不是直接把执行命令的结果输出在当前宿主机下。此时，可以通过添加 `-d` 参数来实现。

```shell
$ docker run -d ubuntu:18.04 /bin/sh -c "while true; do echo hello world; sleep 1; done"
77b2dc01fe0f3f1265df143181e7b9af5e05279a884f4776ee75350ea9d8017a
```

这时会返回容器ID,并且继续保持主机的Shell终端中,而不会进入容器内,从而避免堵塞。

容器会在后台运行并不会把输出的结果 (STDOUT) 打印到宿主机上面(输出结果可以用 `docker logs` 查看)。

**注意：** 容器是否会长久运行，是和 `docker run` 指定的命令有关，和 `-d` 参数无关。



#### 进入容器内部

在使用 `-d` 参数时，容器启动后会进入后台。

某些时候需要进入容器进行操作，包括使用 `docker attach` 命令或 `docker exec` 命令，推荐大家使用 `docker exec` 命令

* `docker attach` 命令：`docker attach + 容器ID/容器名称` 如果用这种方法从这个 容器 中 exit，会导致容器的停止。

* `docker exec`命令:`docker exec` 后边可以跟多个参数，这里主要说明 `-i` `-t` 参数。

  只用 `-i` 参数时，由于没有分配伪终端，界面没有我们熟悉的 Linux 命令提示符，但命令执行结果仍然可以返回。

  当 `-i` `-t` 参数一起使用时，则可以看到我们熟悉的 Linux 命令提示符。

  ```shell
  $ docker run -dit ubuntu
  69d137adef7a8a689cbcb059e94da5489d3cddd240ff675c640c8d96e84fe1f6
  
  $ docker container ls
  CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
  69d137adef7a        ubuntu:latest       "/bin/bash"         18 seconds ago      Up 17 seconds                           zealous_swirles
  
  $ docker exec -i 69d1 bash
  ls
  bin
  boot
  dev
  ...
  
  $ docker exec -it 69d1 bash
  root@69d137adef7a:/#
  ```

  这个操作在容器中使用exit，不会导致容器的停止。这就是为什么推荐大家使用 `docker exec` 的原因。

#### 导出和导入容器

如果要导出本地某个容器为tar压缩包，可以使用 `docker export` 命令。

```bash
$ docker container ls -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                    PORTS               NAMES
7691a814370e        ubuntu:18.04        "/bin/bash"         36 hours ago        Exited (0) 21 hours ago                       test
$ docker export 7691a814370e > ubuntu.tar

```

如果要将某个容器tar压缩包导入到docker镜像的话，可以使用 `docker import` 命令。

```bash
$ cat ubuntu.tar | docker import - test/ubuntu:v1.0
$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED              VIRTUAL SIZE
test/ubuntu         v1.0                9d37a6082e97        About a minute ago   171.3 MB
```

此外，也可以通过指定 URL 或者某个目录来导入，例如:

```bash
$ docker import http://example.com/exampleimage.tgz example/imagerepo
```

#### 删除容器

可以使用 `docker container rm` 来删除一个处于终止状态的容器。例如:

```bash
$ docker container rm trusting_newton
trusting_newton
```

如果要删除一个运行中的容器，可以添加 `-f` 参数。Docker 会发送 `SIGKILL` 信号给容器。

用 `docker container ls -a` 命令可以查看所有已经创建的包括终止状态的容器，如果数量太多要一个个删除可能会很麻烦，用下面的命令可以清理掉所有处于终止状态的容器。

```bash
$ docker container prune
```



### Docker仓库

仓库（`Repository`）是集中存放镜像的地方。类似于Maven中的lib仓库。

一个容易混淆的概念是注册服务器（`Registry`）。实际上注册服务器是管理仓库的具体服务器，每个服务器上可以有多个仓库，而每个仓库下面有多个镜像。从这方面来说，仓库可以被认为是一个具体的项目或目录。例如对于仓库地址 `docker.io/ubuntu` 来说，`docker.io` 是注册服务器地址，`ubuntu` 是仓库名。

但大部分时候，并不需要严格区分这两者的概念。

#### Docker Hub

Docker默认公开服务使用的远程仓库为[Docker Hub](https://hub.docker.com/)。

大部分需求都可以通过在 Docker Hub 中直接下载镜像来实现。

使用它这前需要在上面注册一个Docker账号。可以通过执行 `docker login` 命令交互式的输入用户名及密码来完成在命令行界面登录 Docker Hub。你可以通过 `docker logout` 退出登录。

你可以通过 `docker search` 命令来查找官方仓库中的镜像，并利用 `docker pull` 命令来将它下载到本地。

```bash
$ docker search centos
NAME                               DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
centos                             The official build of CentOS.                   6449      [OK]
ansible/centos7-ansible            Ansible on Centos7                              132                  [OK]
consol/centos-xfce-vnc             Centos container with "headless" VNC session…   126                  [OK]
jdeathe/centos-ssh                 OpenSSH / Supervisor / EPEL/IUS/SCL Repos - …   117                  [OK]
centos/systemd                     systemd enabled base container.                 96                   [OK]
```

当然更推荐前往网站上进行搜索,然后直接获取pull地址.

![](https://zssaer-img.oss-cn-chengdu.aliyuncs.com/dockerhub.png)

用户也可以在登录后通过 `docker push` 命令来将自己的镜像推送到 Docker Hub。

```bash
$ docker tag ubuntu:18.04 username/ubuntu:18.04

$ docker image ls

REPOSITORY                                               TAG                    IMAGE ID            CREATED             SIZE
ubuntu                                                   18.04                  275d79972a86        6 days ago          94.6MB
username/ubuntu                                          18.04                  275d79972a86        6 days ago          94.6MB

$ docker push username/ubuntu:18.04

$ docker search username

NAME                      DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
username/ubuntu
```

上面命令中的 `username` 请替换为你的 Docker 账号用户名即可。



#### 私有仓库

有时候使用 Docker Hub 这样的公共仓库可能不方便，用户可以创建一个本地仓库供私人使用。

[`docker-registry` ](https://docs.docker.com/registry/)是官方提供的工具，可以用于构建私有的镜像仓库。本文内容基于 [`docker-registry`](https://github.com/docker/distribution)v2.x 版本。

##### 启动仓库

使用官方 `registry` 镜像来运行docker-registry。

```bash
$ docker run -d -p 5000:5000 --restart=always --name registry registry
```

这将使用官方的 `registry` 镜像来启动私有仓库。

默认情况下，仓库会被创建在容器的 `/var/lib/registry` 目录下。你可以通过 `-v` 参数来将镜像文件存放在本地的指定路径。

```bash
$ docker run -d \
    -p 5000:5000 \
    -v /opt/data/registry:/var/lib/registry \
    registry
```

##### 上传镜像

创建好私有仓库之后，上传这前为了防止混淆镜像名称,可以先使用 `docker tag` 来标记一个镜像，然后推送它到仓库。

例如,使用 `docker tag` 将 `ubuntu:latest` 这个镜像标记为 `127.0.0.1:5000/ubuntu:latest`。

```bash
$ docker tag ubuntu:latest 127.0.0.1:5000/ubuntu:latest
$ docker image ls
REPOSITORY                        TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
ubuntu                            latest              ba5877dc9bec        6 weeks ago         192.7 MB
127.0.0.1:5000/ubuntu:latest      latest              ba5877dc9bec        6 weeks ago         192.7 MB
```

格式为 `docker tag IMAGE[:TAG] [REGISTRY_HOST[:REGISTRY_PORT]/]REPOSITORY[:TAG]`。

使用 `docker push` 上传标记的镜像。

```bash
$ docker push 127.0.0.1:5000/ubuntu:latest
```

用 `curl` 命令查看仓库中的镜像。

```bash
$ curl 127.0.0.1:5000/v2/_catalog
{"repositories":["ubuntu"]}
```

##### 获取镜像

```bash
$ docker pull 127.0.0.1:5000/ubuntu:latest
```

#### 修改默认仓库地址

如果你不想使用 `127.0.0.1:5000` 作为仓库地址，比如想让本网段的其他主机也能把镜像推送到私有仓库。你就得把例如 `192.168.199.100:5000` 这样的内网地址作为私有仓库地址，这时你会发现无法成功推送镜像。

因为 Docker 默认不允许非 `HTTPS` 方式推送镜像。我们可以通过 Docker 的配置选项来取消这个限制，或者查看下一节配置能够通过 `HTTPS` 访问的私有仓库。

对于使用 `systemd` (Ubuntu 16.04+, Debian 8+, centos 7)的系统，请在 `/etc/docker/daemon.json` 中写入如下内容（如果文件不存在请新建该文件）

```json
{
  "registry-mirror": [
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ],
  "insecure-registries": [
    "192.168.199.100:5000"
  ]
}
```

对于 Docker Desktop for Windows 、 Docker Desktop for Mac 在设置中的 `Docker Engine` 中进行编辑 ，增加和上边一样的字符串即可。



**作者:Zssaer 转载请著名。**