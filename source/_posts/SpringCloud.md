---
    title: SpringCloud简述  # 文章标题  
    date: 2021/08/04 10:07:52
    tags:
    - JAVA
    categories: JAVA # 分类
    thumbnail: https://img.zssaer.cn/hope2.png?x-oss-process=style/small # 略缩图 
---
<h1 align = "center">SpringCloud</h1>

### 关于

![](https://img.zssaer.cn/springcloud.png)

Spring Cloud 是一系列框架的有序集合。它利用 Spring Boot 的开发便利性，巧妙地简化了分布式系统基础设施的开发，如服务注册、服务发现、配置中心、消息总线、负载均衡、断路器、数据监控等，这些都可以用 Spring Boot 的开发风格做到一键启动和部署。

通俗地讲，**Spring Cloud 就是用于构建微服务开发和治理的框架集合（并不是具体的一个框架）**,主要用作集群项目,它的项目基于Springboot创建,而它不是SpringBoot升级品。

Spring Cloud 模块的相关介绍如下：

- Eureka：服务注册中心，用于服务管理。
- Ribbon：基于客户端的负载均衡组件。
- Hystrix：容错框架，能够防止服务的雪崩效应。
- Feign：Web 服务客户端，能够简化 HTTP 接口的调用。
- Zuul：API 网关，提供路由转发、请求过滤等功能。
- Config：分布式配置管理。
- Sleuth：服务跟踪。
- Stream：构建消息驱动的微服务应用程序的框架。
- Bus：消息代理的集群消息总线。

SpringCloud的同类产品有阿里Dubbo等...

### Spring Cloud上下文

Spring Cloud应用程序通过创建“ **bootstrap** ”上下文来运行，该上下文是主应用程序的父上下文。它负责从外部源加载配置属性，并负责解密本地外部配置文件中的属性。这两个上下文共享一个`Environment`，它是任何Spring应用程序的外部属性的来源。默认情况下，引导程序属性（不是`bootstrap.properties`，而是引导程序阶段加载的属性）具有较高的优先级，因此它们不能被本地配置覆盖。

引导上下文使用与主应用程序上下文不同的约定来定位外部配置。

**可以使用`bootstrap.yml`来代替`application.yml`（或`.properties`），而将引导程序和外部环境的外部配置很好地分开。**
