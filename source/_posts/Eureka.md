---
    title: Netflix Eureka教程 # 文章标题  
    date: 2021/08/04 10:31:16
    tags:
    - JAVA
    categories: JAVA # 分类
    thumbnail: http://img.zssaer.cn/hope3.png?x-oss-process=style/small # 略缩图 
---
<h1 align = "center">Eureka</h1>

Eureka 本身为 Spring Cloud Netflix 微服务套件的一部分，基于 Netflix Eureka 做了二次封装，主要负责实现微服务架构中的服务治理功能。

**Eureka 是一个基于 REST 的服务，并且提供了基于 Java 的客户端组件，能够非常方便地将服务注册到 Spring Cloud Eureka 中进行统一管理。**

同类产品还有Consul、Etcd、Zookeeper等.

### 结构

Eureka结构分为3大模块.

- Eureka Server简称服务注册中心, 提供服务注册和发现
- Service Provider 简称服务提供者，将自身服务注册到Eureka，从而使服务消费方能够找到
- Service Consumer 简称服务消费者，从Eureka获取注册服务列表，从而能够消费服务

![](http://img.zssaer.cn/1683bed8a75eaba2_tplv-t2oaga2asx-image.jpg)

服务注册中心实时管理服务提供者和服务消费者,服务消费者可以调用服务提供者的API.

Eureka 包括两个服务模块：Service Provider（服务提供者）和Service Consumer（服务消费方）。

### CAP定理

分布式系统,正变得越来越重要，大型网站几乎都是分布式的。

而分布式系统的最大难点，就是各个节点的状态如何同步。CAP 定理是这方面的基本定理，也是理解分布式系统的起点。

可以参考:http://www.ruanyifeng.com/blog/2018/07/cap.html

![](http://img.zssaer.cn/bg2018071607.jpg)

其中CAP代表:

- P:Partition tolerance,网络分区容错。类似多机房部署，保证服务稳定性。
- A: Availability，可用性。
- C:Consistency ，一致性。

CAP三个属性对于分布式系统不同同时做到,最多只能做到2方面,如AP/CP/AC。

在这方面上,Euere是AP,相似产品Zookeeper是CP.

### 部署Euere Server项目

**Euere Server又为服务注册中心,用于统一微服务项目,提供服务注册和发现等管理功能.**

1.向其一个Maven项目添加Eureka Server依赖

```xml
<!-- Spring Boot -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.0.6.RELEASE</version>
    <relativePath />
</parent>
<dependencies>
    <!-- eureka -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
    </dependency>
</dependencies>
<!-- Spring Cloud -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>Finchley.SR2</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

2.SpringApplication启动项上加入**@EnableEurekaServer**注释,来标识该服务为Eureka Server.

3.修改Springboot配置文件,添加Eureka配置

```xml
spring:
  application:
    name: eureka-server-cluster1
server:
  port: 876
eureka:
  client:
    # 由于该应用为注册中心, 所以设置为false, 代表不向注册中心注册自己
    register-with-eureka: false
    # 由于注册中心的职责就是维护服务实例, 它并不需要去检索服务, 所以也设置为 false
    fetch-registry: false
```

4.为其Eureka Server-服务注册中心开启密码认证

​	新增spring-security依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

​	在Springboot配置文件添加用户信息

```xml
spring:
  security:
    user:
      #用户名
      name: root
      #密码
      password: 123456
```

​	增加 Security 配置类

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 关闭csrf
        http.csrf().disable();
        // 支持httpBasic
        http.authorizeRequests().anyRequest().authenticated().and().httpBasic();
    }
}
```

5.运行项目,访问路径根目录.便会看到 Eureka 提供的 Web 控制台,上面显示着服务提供者服务消费者的相关信息。

![](http://img.zssaer.cn/euraka.png)



### 部署Service Provider项目

**Service Provider（服务提供者）如其名一样,主要实现功能为业务实现的项目,输出业务API.**

Service Provider和Eureka Server目录类似， 不同点在于：

- Eureka Client启动类上使用@EnableDiscoveryClient 注释,标识该服务为Euraka Client
- 配置文件，需要指定Euraka Server地址和当前服务注册时的名称。

1.Maven配置

```xml
<!-- Spring Boot -->
 <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.0.6.RELEASE</version>
        <relativePath />
 </parent>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- eureka -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
</dependencies>

<!-- Spring Cloud -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>Finchley.SR2</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

这儿和Server项目大体相同,注意,Server用的是`spring-cloud-starter-netflix-eureka-server包`,而Client用的是`spring-cloud-starter-netflix-eureka-client包`

2.Application启动类添加**@EnableDiscoveryClient**注释,识该项目为Eureka Client项目.

3.配置Springboot配置文件,声明注册内容

```xml
spring:
  application:
    name: eureka-client-user-service

eureka:
  client:
    serviceUrl:
      #若注册中心服务开启Security安全认证必须在前加入验证消息
      defaultZone: http://root:123456@localhost:8761/eureka/
    instance:
      # 定义该项目实例ID格式
      instance-id: ${spring.application.name}:${spring.cloud.client.ip-address}:${server.port}
```

4.配置Controller类,使用RestContoll实现对于业务功能.

```java
@RestController
public class UserController {
    @GetMapping("/user/hello")
    public String hello() {
        return "hello222";
    }
}
```

5.运行项目

```bash
DiscoveryClient_EUREKA-CLIENT-USER-SERVICE/eureka-client-user-service:192.168.0.190:8082 - registration status: 204
```

控制台输出`registration status: 204`表示该项目向服务注册中心注册成功.

返回服务注册中心页面,便可显示该项目id以及状态.

![](http://img.zssaer.cn/euraka2.png)



### 部署 Servcie Customer项目

**Service Consumer（服务消费方）:主要实现功能为用户调用服务提供者项目的API.**

1.它的工程目录和Servie Providerder一模一样的,配置方法见上`配置Service Provider项目`。

2.创建一个RestTemplate的配置类.

```java
@Configuration
public class BeanConfiguration {
    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }
}
```

RestTemplate 是 Spring 提供的用于访问 Rest 服务的客户端，RestTemplate 提供了多种便捷访问远程 Http 服务的方法，能够大大提高客户端的编写效率。

其中@LoadBalanced这个注解会自动构造 LoadBalancerClient 接口的实现类并注册到 Spring 容器中.从而引用时不需要写实际IP地址,只需使用注册时的名称.

3.为了从Euraka Server中获取服务地址信息，在工程中添加一个Controler

```java
@RestController
public class ArticleController {
    @Autowired
    private RestTemplate restTemplate;
    
    @GetMapping("/article/callHello2")
    public String callHello2() {
        return restTemplate.getForObject("http://eureka-client-user-service/user/hello", String.class);
    }
}    
```

4.运行项目

​	成功后项目自动注册到服务注册中心.运行该项目执行Controller中的路径,自动返回Service Provider中的对应API返回值,相当于反射调用.

### 最终实现图例

![](http://img.zssaer.cn/euraka3.png)

