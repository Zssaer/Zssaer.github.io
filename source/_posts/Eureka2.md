---
  title: Netflix Eureka集群和监听 # 文章标题 
  date: 2021/08/04 10:31:16
  tags:
  - JAVA
  categories: JAVA # 分类
  thumbnail: https://zssaer-img.oss-cn-chengdu.aliyuncs.com/wallhaven-o31o2p.png?x-oss-process=style/small # 略缩图 
---

### Eureka集群开发

在生产环境中必须搭建一个集群来保证高可用。

Eureka 的集群搭建方法很简单：每一台 Eureka 只需要在配置中指定另外多个 Eureka 的地址就可以实现一个集群的搭建了。

实现思想:

**1.在多台EurekaServer服务注册中心中,每台配置文件中添加向对方各个服务注册中心地址 注册.**

```xml-dtd
server:
  port: 8761

eureka:
  client:
    serviceUrl:
      # 指向你的从节点的Eureka
      defaultZone: http://root:123456@localhost:8762/eureka/,http://root:123456@localhost:8763/eureka/
```

多个节点英文逗号来隔开即可.

这样每个服务注册中心里面的注册服务都会实现共享.无论谁出现问题，应用都能继续使用存活的注册中心。

**2.在多个Service Provide/Service Customer项目中,每个项目配置文件中添加各个服务注册中心地址 注册.**

配置方法同上一样.

这样每个服务,无论哪个服务注册中心出现问题，应用都能继续注册到正常运行的服务注册中心去,而不存在服务停止。

### Eureka快速移除失效服务

在实际开发过程中，我们可能会不停地重启服务，由于 Eureka 有自己的保护机制，故节点下线后，服务信息还会一直存在于 Eureka 中。我们可以通过配置失效时间让移除的速度更快一点，但只在开发环境下使用，生产环境下不推荐使用。

对于服务注册中心项目,首先关闭自我保护模式,再设置清理间隔时间.

```xml-dtd
eureka:
	server:
    	#自我保护模式关闭
	    enableSelfPreservation: false
	    # 默认移除失效服务时间为 60000 毫秒
	    eviction-interval-timer-in-ms: 5000
```

服务客户端中设置返回心跳频率和返回超时时间.

```xml-dtd
eureka:
	client:
		healthcheck:
			# 开启状态监测
			enabled: true
	instance:
		# 默认每 30 秒Eureka Client返回一次状态
		lease-renewal-interval-in-seconds: 5
		# 默认超时时间,每90秒未收到Eureka Client状态,则移除该实例
        lease-expiration-duration-in-seconds: 5
```

由于使用了healthcheck功能开启健康检查,所以需要导入actuator依赖包

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### 服务上下线监控

在一些特定的情况下,可能需要对服务的上下线进行监控,比如服务的上下线进行邮件通知,进行短信通知等等.

Eureka 中提供了事件监听的方式来扩展。

- EurekaInstanceCanceledEvent 服务下线事件。
- EurekaInstanceRegisteredEvent 服务注册事件。
- EurekaInstanceRenewedEvent 服务续约事件。
- EurekaRegistryAvailableEvent Eureka 注册中心启动事件。
- EurekaServerStartedEvent Eureka Server 启动事件。

可以创建一个Eureka服务监听组件类

```java
@Component
public class EurekaStateChangeListener {
    @EventListener
    public void listen(EurekaInstanceCanceledEvent event) {
        System.err.println(event.getServerId() + "\t" + event.getAppName() + " 服务下线 ");
    }
    @EventListener
    public void listen(EurekaInstanceRegisteredEvent event) {
        InstanceInfo instanceInfo = event.getInstanceInfo();
        System.err.println(instanceInfo.getAppName() + " 进行注册 ");
    }
    @EventListener
    public void listen(EurekaInstanceRenewedEvent event) {
        System.err.println(event.getServerId() + "\t" + event.getAppName() + " 服务进行续约 ");
    }
    @EventListener
    public void listen(EurekaRegistryAvailableEvent event) {
        System.err.println(" 注册中心启动 ");
    }
    @EventListener
    public void listen(EurekaServerStartedEvent event) {
        System.err.println("Eureka Server启动 ");
    }
}
```

注意：在 Eureka 集群环境下，每个节点都会触发事件,这个时候需要控制下发送通知的行为，不控制的话每个节点都会发送通知。