---
    title:  SpringCloud-Ribbon教程 # 文章标题  
    date: 2021/08/05 17:36:44  # 文章发表时间
    tags:
    - JAVA
    categories: JAVA # 分类
    thumbnail: https://img.zssaer.cn/anime1.jpg?x-oss-process=style/wallpaper # 略缩图
---

<h1 align = "center">Spring Cloud-Ribbon</h1>

# 简介

Spring Cloud Ribbon是一个基于HTTP和TCP的客户端**负载均衡**工具，它基于Netflix Ribbon实现。

通过Spring Cloud的封装，可以让我们轻松地将面向服务的REST模版请求自动转换成客户端负载均衡的服务调用。对于使用Spring Cloud来构建微服务非常重要。

Spring Cloud Ribbon虽然只是一个工具类框架，它不像服务注册中心、配置中心、API网关那样需要独立部署,但是它几乎存在于每一个Spring Cloud构建的微服务和基础设施中。

因为微服务间的调用，API网关的请求转发等内容，实际上都是通过Ribbon来实现的.

而Spring Cloud Feign，它也是基于Ribbon实现的工具.

# 负载均衡

负载均衡在微服务系统架构中是一个非常重要，并且是不得不去实施的内容。

负载均衡是对系统的高可用、网络压力的缓解和处理能力扩容的重要手段之一。

负载均衡分为两种:

- **服务端负载均衡**:在服务器端上进行负载均衡,主要为两种形式:

  ​	*硬件负载均衡*(在服务器节点之间按照专门用于负载均衡的设备,如F5等)

  ​	*软件负载均衡*(通过在服务器上安装一些用于负载均衡功能或模块等软件来完成请求分发工作,如Nginx等)

特点:客户端只需要记住Nginx等设备的地址即可,不需要知晓服务端地址。

不论采用硬件负载均衡还是软件负载均衡,其架构图都类似于这样:

![](https://img.zssaer.cn/8796251-20be966344ffe722.webp)

- **客户端负载均衡**:所有客户端节点都维护着自己要访问的服务端清单,而这些服务端端清单来自于服务注册中心.

  客户端可以知道所有服务端的详细信息,客户端从自身已知的Server列表中，根据提前配置的负载均衡策略，自己挑选一个服务端来调用

特点:服务端地址透明,不需要负载均衡的设备,加快过程速度.

![](https://img.zssaer.cn/khdfz.png)

负载均衡的实现展示:

![](https://img.zssaer.cn/ribbon1.png)

上图中调用同个接口时每次都使用了2个不同的服务提供方服务器,实现了负载均衡的效果.

# 使用Ribbon

因为Eureka依赖包中已经包含Ribbon包,所以pom文件中不需要加入额外的依赖.

0.修改配置文件,配置ribbon配置信息

```xml
ribbon:
  # Ribbon请求连接的超时时间
  ConnectTimeout: 2000
  # Ribbon请求处理的超时时间
  ReadTimeout: 500
  # 最大连接数
  MaxTotalConnections: 500
  # 每个host最大连接数
  MaxConnectionsPerHost: 500
```

1.在服务消费方中新建一个BeanConfiguration

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

2.在service或者Controller里进行注入RestTemplate,使用相关方法,直接获取服务提供方接口

```java
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;

    public String say(){
        return restTemplate.getForObject("http://provide/user/hello",String.class);
    }
}
```

3.调用相关接口,即可自动实现负载均衡,进行轮询访问接口.



# Ribbon负载均衡策略

Ribbon 作为一款客户端负载均衡框架，默认的负载策略是**轮询**，同时也提供了很多其他的策略，能够让用户根据自身的业务需求进行选择。

 1）BestAvailabl

选择一个最小的并发请求的 Server，逐个考察 Server，如果 Server 被标记为错误，则跳过，然后再选择 ActiveRequestCount 中最小的 Server。

2）AvailabilityFilteringRule

过滤掉那些一直连接失败的且被标记为 circuit tripped 的后端 Server，并过滤掉那些高并发的后端 Server 或者使用一个 AvailabilityPredicate 来包含过滤 Server 的逻辑。其实就是检查 Status 里记录的各个 Server 的运行状态。

3）ZoneAvoidanceRule

使用 ZoneAvoidancePredicate 和 AvailabilityPredicate 来判断是否选择某个 Server，前一个判断判定一个 Zone 的运行性能是否可用，剔除不可用的 Zone（的所有 Server），AvailabilityPredicate 用于过滤掉连接数过多的 Server。

4）RandomRule

随机选择一个 Server。

 5）RoundRobinRule(Ribbon默认策略)

轮询选择，轮询 index，选择 index 对应位置的 Server。

6）RetryRule

对选定的负载均衡策略机上重试机制，也就是说当选定了某个策略进行请求负载时在一个配置时间段内若选择 Server 不成功，则一直尝试使用 subRule 的方式选择一个可用的 Server。

 7）ResponseTimeWeightedRule

作用同 WeightedResponseTimeRule，ResponseTime-Weighted Rule 后来改名为 WeightedResponseTimeRule。

8）WeightedResponseTimeRule

根据响应时间分配一个 Weight（权重），响应时间越长，Weight 越小，被选中的可能性越低。



**更换策略方法:**

在这前的配置RestTemplate的配置类中加入一个返回IRule的Bean配置:

```java
@Configuration
public class BeanConfiguration {
    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }

    @Bean
    public IRule ribbonRule() {
        return new RetryRule(); // 这里配置策略，和配置文件对应
    }
}
```

# 使用Feign扩展,调用服务接口

Feign是Netflix开发的声明式、模板化的HTTP客户端， Feign可以帮助我们更快捷、优雅地调用HTTP API。

Spring Cloud Feign是基于Netflix feign实现，整合了Spring Cloud Ribbon和Spring Cloud Hystrix，除了提供这两者的强大功能外，还提供了一种声明式的Web服务客户端定义的方式。

在前面我们使用RestTemplate进行调用Api接口,但其实很不方便,并且默认是轮询策略,所以如果遇见一台Client服务器宕机,还是用几率访问失败的.

使用Feign调用可以简化操作.而且Spring Cloud对Feign进行了增强，使Feign支持了Spring MVC注解，并整合了Ribbon和Eureka，从而让Feign的使用更加方便。

使用方法:

1.由于SpringCloud-Eureka并未包含feign,所以需要手动添加feign依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

2.在启动类上加 @EnableFeignClients 注解，如果你的 Feign 接口定义跟你的启动类不在同一个包名下，还需要制定扫描的包名

```java
@SpringBootApplication
@EnableFeignClients(basePackages = "microservice.client")
@EnableDiscoveryClient
public class FeignApplication {
    public static void main(String[] args) {
        SpringApplication.run(FeignApplication.class, args);
    }
}
```

3.由于Feign采用的是接口注入方式,所以需要创建一个Feign**接口**，并添加@FeignClient注解

```java
@FeignClient(value = "provide")
public interface UserRemoteClient {
    @GetMapping("/user/hello")
    String hello();
}
```

其中的@FeignClient注释中的value值对应的服务发现中心(服务注册中心)的提供方ID.

接口里面的的内容完全对应其提供方接口内容的方法,并且包含路径注释.

4.在Controller中进行注入Feign接口,调用其方法,其自动负载均衡调用接口.

```java
@RestController
public class UserController {
    @Autowired
    private UserRemoteClient userRemoteClient;

    @GetMapping("/say")
    public String callHello() {
        return userRemoteClient.hello();
    }
}
```

执行该路径会发现不仅和前面RestTemplate效果一样,但使用Feign却简单不少.

# Feign的自定义配置

Feign 提供了很多的扩展机制，让用户可以更加灵活的使用.

1.日志配置:有时候我们遇到 Bug，比如接口调用失败、参数没收到等问题，或者想看看调用性能，就需要配置 Feign 的日志了，以此让 Feign 把请求信息输出来。

定义一个配置类:

```java
@Configuration
public class FeignConfiguration {
    /**
     * 日志级别
     *
     * @return
     */
    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
```

其中通过源码可以看到日志等级有 4 种，分别是：

- NONE：不输出日志。
- BASIC：只输出请求方法的 URL 和响应的状态码以及接口执行的时间。
- HEADERS：将 BASIC 信息和请求头信息输出。
- FULL：输出完整的请求信息。

实现日志配置:

需要在 Feign Client 中的 @FeignClient 注解中configuration指定使用的配置类

```java
@FeignClient(value = "provide",configuration = FeignConfiguration.class)
public interface UserRemoteClient {
    @GetMapping("/user/hello")
    String hello();
}
```



2.超时时间配置:Feign可以配置连接超时时间和读取超时时间

```java
@Configuration
public class FeignConfiguration {
    @Bean
    public Request.Options options() {
        return new Request.Options(5000, 10000);
    }
}
```

其中Options 的第一参数为连接超时时间（ms），默认值是 10×1000；第二参数为取超时时间（ms），默认值是 60×1000。



3.修改Spring配置文件:除了使用代码的方式来对 Feign 进行配置，我们还可以通过配置文件的方式来指定 Feign 的配置。

```properties
# 链接超时时间
feign.client.config.feignName.connectTimeout=5000
# 读取超时时间
feign.client.config.feignName.readTimeout=5000
# 日志等级
feign.client.config.feignName.loggerLevel=full
# 重试
feign.client.config.feignName.retryer=com.example.SimpleRetryer
# 拦截器
feign.client.config.feignName.requestInterceptors[0]=com.example.FooRequestInterceptor
feign.client.config.feignName.requestInterceptors[1]=com.example.BarRequestInterceptor
# 编码器
feign.client.config.feignName.encoder=com.example.SimpleEncoder
# 解码器
feign.client.config.feignName.decoder=com.example.SimpleDecoder
# 契约
feign.client.config.feignName.contract=com.example.SimpleContract
```