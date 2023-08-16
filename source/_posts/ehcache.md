---
    title: Ehcache缓存   # 文章标题  
    date: 2021/12/22 17:40:48
    tags:
    - JAVA
    categories: JAVA # 分类
    thumbnail: https://zssaer.oss-cn-chengdu.aliyuncs.com/wallhaven-72x2z9.jpg?x-oss-process=style/wallpaper # 略缩图
---

# Ehcache 缓存

![](https://zssaer.oss-cn-chengdu.aliyuncs.com/dcc451da81cb39db483084ebd6160924aa18309f.png)

EhCache 是一个纯Java的进程内缓存框架，具有快速、精干等特点，是Hibernate中默认CacheProvider。Ehcache是一种广泛使用的开源Java分布式缓存。主要面向通用缓存,Java EE和轻量级容器。它具有内存和磁盘存储，缓存加载器,缓存扩展,缓存异常处理程序,一个gzip缓存servlet过滤器,支持REST和SOAP api等特点。

##  ehcache 和 redis 比较

ehcache直接在jvm虚拟机中缓存，速度快，效率高；但是缓存共享麻烦，集群分布式应用不方便。

redis是通过socket访问到缓存服务，效率比Ehcache低，但比数据库要快很多，处理集群和分布式缓存方便，有成熟的方案。

如果是单个应用或者对缓存访问要求很高的应用，用ehcache。

如果是大型系统，存在缓存共享、分布式部署、缓存内容很大的，建议用redis。

## Maven引入依赖

```xml
<dependency>
    <groupId>net.sf.ehcache</groupId>
    <artifactId>ehcache</artifactId>
    <version>2.10.6</version>
</dependency>
```

主要方法:

创建一个配置文件 ehcache.xml,默认情况下Ehcache会自动加载classpath根目录下名为ehcache.xml文件，也可以将该文件放到其他地方在使用时指定文件的位置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="http://ehcache.org/ehcache.xsd">

  <!-- 磁盘缓存位置 -->
  <diskStore path="java.io.tmpdir/ehcache"/>

  <!-- 默认缓存 -->
  <defaultCache
          maxEntriesLocalHeap="10000"
          eternal="false"
          timeToIdleSeconds="120"
          timeToLiveSeconds="120"
          maxEntriesLocalDisk="10000000"
          diskExpiryThreadIntervalSeconds="120"
          memoryStoreEvictionPolicy="LRU">
    <persistence strategy="localTempSwap"/>
  </defaultCache>

  <!-- helloworld缓存 -->
  <cache name="HelloWorldCache"
         maxElementsInMemory="1000"
         eternal="false"
         timeToIdleSeconds="5"
         timeToLiveSeconds="5"
         overflowToDisk="false"
         memoryStoreEvictionPolicy="LRU"/>
</ehcache>
```

```java
		// 1. 创建缓存管理器
        CacheManager cacheManager = CacheManager.create("./src/main/resources/ehcache.xml");
         
        // 2. 获取缓存对象
        Cache cache = cacheManager.getCache("HelloWorldCache");
         
        // 3. 创建元素
        Element element = new Element("key1", "value1");
         
        // 4. 将元素添加到缓存
        cache.put(element);
         
        // 5. 获取缓存
        Element value = cache.get("key1");
        System.out.println("value: " + value);
        System.out.println(value.getObjectValue());
         
        // 6. 删除元素
        cache.remove("key1");
         
        Dog dog = new Dog("xiaohei", "black", 2);
        Element element2 = new Element("dog", dog);
        cache.put(element2);
        Element value2 = cache.get("dog");
        System.out.println("value2: "  + value2);
        Dog dog2 = (Dog) value2.getObjectValue();
        System.out.println(dog2);
         
        System.out.println(cache.getSize());
         
        // 7. 刷新缓存
        cache.flush();
         
        // 8. 关闭缓存管理器
        cacheManager.shutdown();
```

## 项目整合

```java
@Component
public class EhcacheComponent {
    private static CacheManager cacheManager = null;
    private static Cache cache = null;
	//设置默认缓存对象名
    private static final String CACHE_NAME = "cache";
    private static final int TIME_TO_LIVE_SECONDS_MAX = 60 * 60 * 24 * 365;

    static {
        initCacheManager();
        initCache();
    }

    /**
     * 默认过期时长，单位：秒
     */
    private final static int DEFAULT_EXPIRE = 60 * 60 * 24;
    /**
     * 不设置过期时长
     * 本组件实际设置过期时长：TIME_TO_LIVE_SECONDS_MAX
     */
    private final static int NOT_EXPIRE = -1;

    private static void initCacheManager() {
        cacheManager = CacheManager.getInstance();
    }

    private static void initCache() {
        if (null == cacheManager.getCache(CACHE_NAME)) {
            cacheManager.addCache(CACHE_NAME);
        }
        if (null == cache) {
            cache = cacheManager.getCache(CACHE_NAME);
        }
    }
	/**
     * 存放数据 带有过期时间
     * 
     */
    public void put(Object key, Object value, int timeToIdleSeconds) {
        if (NOT_EXPIRE == timeToIdleSeconds) {
            timeToIdleSeconds = TIME_TO_LIVE_SECONDS_MAX;
        }

        Element element = new Element(key, value, timeToIdleSeconds, TIME_TO_LIVE_SECONDS_MAX);
        cache.put(element);
    }
	/**
     * 存放数据
     * 
     */
    public void put(Object key, Object value) {
        Element element = new Element(key, value, DEFAULT_EXPIRE, TIME_TO_LIVE_SECONDS_MAX);
        cache.put(element);
    }
	/**
     * 取出数据
     * 
     */
    public <T> T get(Object key, Class<T> clazz) {
        Element element = cache.get(key);

        if (null != element) {
            Object value = element.getObjectValue();
            return null == value ? null : (T) value;
        } else {
            return null;
        }
    }
	/**
     * 移除数据
     * 
     */
    public void remove(Object key) {
        cache.remove(key);
    }
}
```



## Shiro整合Ehcache

Shiro是一个Java安全框架,执行身份验证、授权、密码和会话管理。

官方提供了shiro-ehcache，实现了把EHCache当做Shiro的缓存工具的解决方案。

**其中最好用的一个功能是就是缓存认证执行的Realm方法，减少重复执行Realm中的权限管理的数据库访问,从而减缓数据库压力,加快处理速度。**

官方Maven依赖:

```xml
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-ehcache</artifactId>
    <version>1.4.2</version>
</dependency>
```

编写ehcache的缓存配置,在其中新增登录记录缓存区

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ehcache name="ehcache" updateCheck="false">
 
<!-- 磁盘缓存位置 -->
<diskStore path="java.io.tmpdir"/>
<!-- 默认缓存 -->
<defaultCache
        maxEntriesLocalHeap="1000"
        eternal="false"
        timeToIdleSeconds="3600"
        timeToLiveSeconds="3600"
        overflowToDisk="false">
</defaultCache>
 
<!-- 登录记录缓存 锁定10分钟 -->
<cache name="loginRecordCache"
       maxEntriesLocalHeap="2000"
       eternal="false"
       timeToIdleSeconds="600"
       timeToLiveSeconds="0"
       overflowToDisk="false"
       statistics="true">
</cache>
 
</ehcache>
```

最后在其ShiroConfig中设置Ehcache并配置到ShiroManager中的Cache管理中.

```java
...
@Bean
public DefaultWebSecurityManager securityManager() {
	...
    manager.setCacheManager(getEhCacheManager());
    ...
}
@Bean
public EhCacheManager ehCacheManager(){
    EhCacheManager ehCacheManager =new EhCacheManager();
    InputStream is =null;
    try {
        //Ehcache配置文件
        is = ResourceUtils.getInputStreamForPath("classpath:ehcache/ehcache-shiro.xml");
    }catch (IOException e) {
        e.printStackTrace();
    }
    net.sf.ehcache.CacheManager cacheManager =new net.sf.ehcache.CacheManager(is);
    ehCacheManager.setCacheManager(cacheManager);
    return ehCacheManager;
}
...
```

