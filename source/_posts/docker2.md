---
    title:  Docker入门教程(二) # 文章标题  
    date: 2021/08/09 14:37:04  # 文章发表时间
    tags:
    - 后端
    categories: 后端 # 分类
    thumbnail: https://zssaer.oss-cn-chengdu.aliyuncs.com/dockerlogo.jpg # 略缩图
---
<h1 align = "center"> Docker入门教程(二)</h1>

### Docker的容器数据管理

Docker中的容器数据分为下列关系:

![](https://zssaer.oss-cn-chengdu.aliyuncs.com/types-of-mounts.cd09b2d7.png)

- 数据卷（Volumes）
- 挂载主机目录 (Bind mounts)



#### 挂载主机目录

在启动镜像时,使用参数`v`可以实现将主机本地目录挂载到容器中去。

```bash
$ docker run -d -P \
    --name web \
    -v /src/webapp:/usr/share/nginx/html \
    nginx:alpine
```

上面的命令加载主机的 `/src/webapp` 目录到容器的 `/usr/share/nginx/html`目录。本地目录的路径必须是绝对路径,使用 `-v` 参数时如果本地目录不存在 Docker 会自动为你创建一个文件夹。

也可以使用参数`--mount`参数进行实现主机本地目录挂载到容器。

```bash
$ docker run -d -P \
    --name web \
    --mount type=bind,source=/src/webapp,target=/usr/share/nginx/html \
    nginx:alpine
```

但不同的是使用`--mount`参数时如果本地目录不存在，Docker 会报错。

Docker 挂载主机目录的默认权限是 `读写`，用户也可以通过增加`ro`或者 `readonly` 指定为 `只读`。

```bash
$ docker run -d -P \
    --name web \
    # -v /src/webapp:/usr/share/nginx/html:ro \
    --mount type=bind,source=/src/webapp,target=/usr/share/nginx/html,readonly \
    nginx:alpine
```

加了 `readonly` 之后，就挂载为 `只读` 了。如果你在容器内 `/usr/share/nginx/html` 目录新建文件，就会报错。



#### 查看容器的具体信息

在主机里使用`docker inspect`命令可以查看 指定 容器的信息。例如web容器的信息:

```bash
$ docker inspect web
```

`挂载主机目录` 的配置信息在 "Mounts" Key 下面。

```json
"Mounts": [
    {
        "Type": "bind",
        "Source": "/src/webapp",
        "Destination": "/usr/share/nginx/html",
        "Mode": "",
        "RW": true,
        "Propagation": "rprivate"
    }
],
```



#### 数据卷

`数据卷` 是一个可供一个或多个容器使用的特殊目录，它绕过 UFS，可以提供很多有用的特性：

- `数据卷` 可以在容器之间共享和重用
- 对 `数据卷` 的修改会立马生效
- 对 `数据卷` 的更新，不会影响镜像
- `数据卷` 默认会一直存在，即使容器被删除

> 注意：`数据卷` 的使用，类似于 Linux 下对目录或文件进行 mount，镜像中的被指定为挂载点的目录中的文件会复制到数据卷中（仅数据卷为空时会复制）。

**创建数据卷**

```bash
$ docker volume create my-vol
```

**查询数据卷**

查看所有的 `数据卷`

```bash
$ docker volume ls

DRIVER              VOLUME NAME
local               my-vol
```

在主机里使用以下命令可以查看指定 `数据卷` 的信息

```bash
$ docker volume inspect my-vol
[
    {
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/my-vol/_data",
        "Name": "my-vol",
        "Options": {},
        "Scope": "local"
    }
]
```

**启动一个挂载数据卷的容器**

在用 `docker run` 命令的时候，使用 `--mount` 标记来将 `数据卷` 挂载到容器里。在一次 `docker run` 中可以挂载多个 `数据卷`。

下面创建一个名为 `web` 的容器，并加载一个 `数据卷` 到容器的 `/usr/share/nginx/html` 目录。

```bash
$ docker run -d -P \
    --name web \
    # -v my-vol:/usr/share/nginx/html \
    --mount source=my-vol,target=/usr/share/nginx/html \
    nginx:alpine
```

**删除数据卷**

```bash
$ docker volume rm my-vol
```

`数据卷` 是被设计用来持久化数据的，它的生命周期独立于容器，Docker 不会在容器被删除后自动删除 `数据卷`，并且也不存在垃圾回收这样的机制来处理没有任何容器引用的 `数据卷`。如果需要在删除容器的同时移除数据卷。可以在删除容器的时候使用 `docker rm -v` 这个命令。

无主的数据卷可能会占据很多空间，要清理请使用以下命令

```bash
$ docker volume prune
```





### Compose

#### 简介

`Compose` 项目是 Docker 官方的开源项目，负责实现对 Docker 容器集群的快速编排。

`Compose` 定位是 「定义和运行多个 Docker 容器的应用（Defining and running multi-container Docker applications）」。

我们知道使用一个 `Dockerfile` 模板文件，可以让用户很方便的定义一个单独的应用容器。但在工作中，经常会碰到需要多个容器相互配合来完成某项任务的情况。例如要实现一个 Web 项目，除了 Web 服务容器本身，往往还需要再加上后端的数据库服务容器，甚至还包括负载均衡容器等。

而`Compose` 恰好满足了这样的需求。它允许用户通过一个单独的 `docker-compose.yml` 模板文件（YAML 格式）来定义一组相关联的应用容器为一个项目（project）。`Compose` 的默认管理对象是项目，通过子命令对项目中的一组容器进行便捷地生命周期管理。

`Compose` 中有两个重要的概念：

- 服务 (`service`)：一个应用的容器，实际上可以包括若干运行相同镜像的容器实例。
- 项目 (`project`)：由一组关联的应用容器组成的一个完整业务单元，在 `docker-compose.yml` 文件中定义。

**可见，一个项目可以由多个服务（容器）关联而成，`Compose` 面向项目进行管理。**



*关于Compose V2*

Docker 官方用 GO 语言 重写 了 Docker Compose，并将其作为了 docker cli 的子命令，称为 `Compose V2`。

将熟悉的 `docker-compose` 命令替换为 `docker compose`，即可使用 Docker Compose。

#### 安装Compose

`Compose` 支持 Linux、macOS、Windows 10 三大平台。

`Compose` 可以通过 Python 的包管理工具 `pip` 进行安装，也可以直接下载编译好的二进制文件使用，甚至能够直接在 Docker 容器中运行。

`Docker Desktop for Mac/Windows` 自带 `docker-compose` 二进制文件，安装 Docker 之后可以直接使用。

```bash
$ docker-compose --version

docker-compose version 1.27.4, build 40524192
```

而在Linux系统中需要另外安装依赖包才能够使用.

从 [官方 GitHub Release](https://github.com/docker/compose/releases)处直接下载编译好的二进制文件即可。

```bash
$ sudo curl -L https://github.com/docker/compose/releases/download/1.27.4/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
# 国内用户可以使用以下方式加快下载
$ sudo curl -L https://download.fastgit.org/docker/compose/releases/download/1.27.4/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose
```

#### 使用Compose

使用场景:例如最常见的项目是 web 网站，该项目应该包含 web 应用和缓存。

在配置好的Dockerfile文件同级目录下配置编写 `docker-compose.yml` 文件，这个是 Compose 使用的主模板文件。

```xml-dtd
version: '3'
services:

  web:
    build: .
    ports:
     - "5000:5000"

  redis:
    image: "redis:alpine"
```

最后运行 compose 项目

```bash
$ docker-compose up
```

它将自动配置完整个docker流程.

其中`docker-compose up`目录非常强大,它将尝试自动完成包括构建镜像，（重新）创建服务，启动服务，并关联服务相关容器的一系列操作。链接的服务都将会被自动启动，除非已经处于运行状态。

**可以说，大部分时候都可以直接通过该命令来启动一个项目。**

默认情况，`docker-compose up` 启动的容器都在前台，控制台将会同时打印所有容器的输出信息，可以很方便进行调试。当通过 `Ctrl-C` 停止命令时，所有容器将会停止。

所以推荐使用 `docker-compose up -d`，将会在后台启动并运行所有的容器。一般推荐生产环境下使用该选项。

默认情况，如果服务容器已经存在，`docker-compose up` 将会尝试停止容器，然后重新创建（保持使用 `volumes-from` 挂载的卷），以保证新启动的服务匹配 `docker-compose.yml` 文件的最新内容。



#### Compose 模板文件

默认的模板文件名称为 `docker-compose.yml`，格式为 YAML 格式。这里面大部分指令跟 `docker run` 相关参数的含义都是类似的。

```xml-dtd
version: "3"

image: ubuntu

services:
  webapp:
  	build: ./dir
    image: examples/web
    ports:
      - "80:80"
    volumes:
      - "/data"
command: echo "hello world"      
```

注意每个服务都必须通过 `image` 指令指定镜像或 `build` 指令（需要 Dockerfile）等来自动构建生成镜像。

其中`build`指定Dockerfile文件所在文件夹路径（可以是绝对路径，或者相对 docker-compose.yml 文件的路径）

`command`表示覆盖容器启动后默认执行的命令。`volumes`为挂载数据卷。`image`指定为镜像名称或镜像 ID，如果镜像在本地不存在，`Compose` 将会尝试拉取这个镜像。

