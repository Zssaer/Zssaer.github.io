---
    title: 阿里云对象存储服务-OSS  # 文章标题  
    date: 2021/11/03 17:23:49
    tags:
    - JAVA
    categories: JAVA # 分类
    thumbnail: https://img.zssaer.cn/wallhaven-48ljv1.jpg?x-oss-process=style/wallpaper # 略缩图 
---
## 阿里云对象存储服务-OSS

目前在一些网站中，其中的图片都放置在一个统一的图床中，用专门一个服务器来做图床，从而减轻主服务器的压力，而且相比于一般的服务器来说，图床服务器价格低廉，容量大。我们把这些图床服务器叫做对象存储服务。

对象存储服务是一种海量、安全、低成本、高可靠的云存储服务，适合存放任意类型的文件。容量和处理能力弹性扩展，多种存储类型供选择，全面优化存储成本。它还能根据设置API来进行处理上传的图片，比如上传图片加水印、图片压缩等功能，但这些额外的功能一般来说不同服务商都会进行不同的收费，x千次0.x元等等。

阿里云对象存储服务称为OSS,而华为对象存储服务称为OBS,腾讯云对象存储服务称为COS,尽管每家公司的缩写名称不一样,但其实都是一种服务.

首先学习OSS之前必须要拥有一个阿里的对象存储OSS服务，所以需要提前购买阿里一个对象存储服务，这儿操作介绍跳过，毕竟花钱谁不会呀？不会找服务商呀。

这里主要讲述其阿里云对象存储服务OSS的JAVA API使用方法.

### 基本概念

OSS有如下几个产品参数概念:

- Region（地域）

  Region表示OSS的数据中心所在物理位置。一般来说，距离用户更近的Region访问速度更快。

- Endpoint（访问域名）

  Endpoint表示OSS对外服务的访问域名。OSS以HTTP RESTful API的形式对外提供服务，当访问不同的Region的时候，需要不同的域名。通过内网和外网访问同一个Region所需要的Endpoint也是不同的。

- AccessKey（访问密钥）

  AccessKey简称AK，指的是访问身份验证中用到的AccessKeyId和AccessKeySecret,AccessKeyId用于标识用户；AccessKeySecret是用户用于加密签名字符串和OSS用来验证签名字符串的密钥，必须保密。

- Bucket（存储空间）

  存储空间是用户用于存储对象（Object）的容器，所有的对象都必须隶属于某个存储空间。存储空间具有各种配置属性，包括地域、访问权限、存储类型等。

- 对象（Object）

  对象是OSS存储数据的基本单元，也被称为OSS的文件。和传统的文件系统不同，对象没有文件目录层级结构的关系。对象由元信息（Object Meta），用户数据（Data）和文件名（Key）组成，并且由存储空间内部唯一的Key来标识。

### OSS与文件系统的对比

| 对比项   | OSS                                                          | 文件系统                                                     |
| :------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 数据模型 | OSS是一个分布式的对象存储服务，提供的是一个Key-Value对形式的对象存储服务。 | 文件系统是一种典型的树状索引结构。                           |
| 数据获取 | 根据Object的名称（Key）唯一的获取该Object的内容。虽然用户可以使用类似test1/test.jpg的名字，但是这并不表示用户的Object是保存在test1目录下面的。对于OSS来说，test1/test.jpg仅仅只是一个字符串，和a.jpg这种并没有本质的区别。因此不同名称的Object之间的访问消耗的资源是类似的。 | 一个名为test1/test.jpg的文件，访问过程需要先访问到test1这个目录，然后再在该目录下查找名为test.jpg的文件。 |
| 优势     | 支持海量的用户并发访问。                                     | 支持文件的修改，比如修改指定偏移位置的内容、截断文件尾部等。也支持文件夹的操作，比如重命名目录、删除目录、移动目录等非常容易。 |

由上可见,OSS服务获取数据类似Nosql读取方式(Map方式),本质是从各个存储表(Bucket)中进行存储.

### Java API使用

Maven导入

```xml
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.10.2</version>
</dependency>
```

如果使用的是Java 9及以上的版本，则需要添加jaxb相关依赖。添加jaxb相关依赖示例代码如下：

```xml
<dependency>
    <groupId>javax.xml.bind</groupId>
    <artifactId>jaxb-api</artifactId>
    <version>2.3.1</version>
</dependency>
<dependency>
    <groupId>javax.activation</groupId>
    <artifactId>activation</artifactId>
    <version>1.1.1</version>
</dependency>
<!-- no more than 2.3.3-->
<dependency>
    <groupId>org.glassfish.jaxb</groupId>
    <artifactId>jaxb-runtime</artifactId>
    <version>2.3.3</version>
</dependency>
```

创建SysConfigOss DTO类,用作Springboot配置信息注入

```java
@Component
//自动配置文件属性名
@ConfigurationProperties(prefix = "sysConfig.oss")
public class SysConfigOss {
    private String domain;
    private String endpoint;
    private String accessKeyId;
    private String accessKeySecret;
    private String bucketName;
    private String diskImage;
    private String diskSource;
    private boolean personal;
    
    ...setting and getting methods...
}
```

在application.properties 或者application.yaml文件下配置相关OSS服务信息

```yaml
sysConfig:
	oss:
		domain: XXX
		endpoint: XXX
		accessKeyId: XXX
		accessKeySecret: XXX
		bucketName: XXX
		diskImage: XXX
		diskSource: XXX
		personal: XXX
```

配置OssComponent组件

```java
@Component
public class OssComponent {
    @Autowired
    private SysConfigOss sysConfigOss;
    @Autowired
    private PathComponent pathComponent;
	/**
     * 初始化OSS实体类
     * @return
     */
    private OSS init() {
        return new OSSClientBuilder().build(sysConfigOss.getEndpoint(), sysConfigOss.getAccessKeyId(), 	sysConfigOss.getAccessKeySecret());
    }

    /**
     * OSS对象存储
     *
     * @param inputStream
     * @param diskName
     * @param fileName
     * @return
     */
    private String uploadObject2OSS(InputStream inputStream, String diskName, String fileName) {
        String resultStr = null;
        OSS ossClient = init();
        PutObjectResult putObjectResult = ossClient.putObject(sysConfigOss.getBucketName(), diskName + "/" + fileName, inputStream);
        ossClient.shutdown();
        return putObjectResult.getETag();
    }

    private String generateStorageName(String fileName) {
        return DateUtil.today()+"/"+System.currentTimeMillis() + "_" + fileName;
    }

    /**
     * 存储图片文件 返回数据库文件名
     *
     * @param file
     * @return
     * @throws IOException
     */
    public String storeImage(MultipartFile file) throws IOException {
        String fileName = ValidateUtil.isEmpty(file.getOriginalFilename()) ? "auto" : file.getOriginalFilename();
        String storageName = generateStorageName(fileName);
        uploadObject2OSS(file.getInputStream(), sysConfigOss.getDiskImage(), storageName);
        return pathComponent.getImgDbFileName(storageName);
    }

    /**
     * 存储素材文件 返回数据库文件名
     *
     * @param file
     * @return
     * @throws IOException
     */
    public String storeSource(MultipartFile file) throws IOException {
        String fileName = ValidateUtil.isEmpty(file.getOriginalFilename()) ? "auto" : file.getOriginalFilename();
        String storageName = generateStorageName(fileName);
        uploadObject2OSS(file.getInputStream(), sysConfigOss.getDiskSource(), storageName);
        return pathComponent.getSourceDbFileName(storageName);
    }
    
    /**
     * 获取私有链接,用于文件/图片回显等
     * @param dbFileName
     * @return
     */
    public String getPrivateAccessUrl(String dbFileName) {
    	OSS ossClient = init();
    	Date expiration = new Date(new Date().getTime() + 3600 * 1000);
        GeneratePresignedUrlRequest generatePresignedUrlRequest ;
        generatePresignedUrlRequest =new GeneratePresignedUrlRequest(sysConfigOss.getBucketName(), dbFileName);
        generatePresignedUrlRequest.setExpiration(expiration);
        URL url = ossClient.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }
}
```

- 通过使用OSS.putObject方法,存储对象.
- 对于私有的OSS服务,通过使用创建GeneratePresignedUrlRequest对象再调用OSS.generatePresignedUrl方法获取私有链接,来获取存储的对象.
- 对于公开读取的OSS服务,直接使用配置的domain+文件位置+文件名即可获取存储对象