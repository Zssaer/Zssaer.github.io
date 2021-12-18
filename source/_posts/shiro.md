---
    title: Shiro安全框架  # 文章标题  
    date: 2021/11/04 13:48:36
    tags:
    - JAVA
    categories: JAVA # 分类
    thumbnail: http://img.zssaer.cn/wallhaven-83dkk1.jpg?x-oss-process=style/wallpaper # 略缩图 
---
<h1 align = "center">Shiro安全框架</h1>

![](http://img.zssaer.cn/shiro.jpg)

Apache Shiro是一个强大且易用的Java安全框架,执行身份验证、授权、密码和会话管理。使用Shiro的易于理解的API,您可以快速、轻松地获得任何应用程序,从最小的移动应用程序到最大的网络和企业应用程序。

### 主要功能

shiro主要有三大功能模块：

1. **Subject：主体，一般指用户。**

2. **SecurityManager：安全管理器，管理所有Subject，可以配合内部安全组件。(类似于SpringMVC中的DispatcherServlet)**

3. **Realms：用于进行权限信息的验证，一般需要自己实现。**

### 细分功能

1. Authentication：身份认证/登录(账号密码验证)。
2. Authorization：授权，即角色或者权限验证。
3. Session Manager：会话管理，用户登录后的session相关管理。
4. Cryptography：加密，密码加密等。
5. Web Support：Web支持，集成Web环境。
6. Caching：缓存，用户信息、角色、权限等缓存到如redis等缓存中。
7. Run As：允许一个用户假装为另一个用户（如果他们允许）的身份进行访问。
8. Remember Me：记住我，登录后，下次再来的话不用登录了。

### Maven依赖

```xml
    <!--shiro-->
    <dependency>
            <groupId>org.apache.shiro</groupId>
            <artifactId>shiro-spring</artifactId>
            <version>1.7.1</version>
    </dependency>

```

###  快速入门语句

``` java
    // 得到DefaultSecurityManager对象
	DefaultSecurityManager defaultSecurityManager=new DefaultSecurityManager();
    // 读取ini配置文件
    IniRealm iniRealm=new IniRealm("classpath:shiro.ini");
    // 配置DefaultSecurityManager对象
    defaultSecurityManager.setRealm(iniRealm);
    // 获取SecurityUtils对象
	SecurityUtils.setSecurityManager(defaultSecurityManager);


	// 获取当前用户对象 Subject
    Subject currentUser = SecurityUtils.getSubject();

    // 通过当前用户获取Session
    Session session = currentUser.getSession();
	
    //判断用户是否被认证
	currentUser.isAuthenticated()
    
    //通过Token进行登录操作
    currentUser.login(token)
        
    //根据输入账户名和密码获取Token    
    UsernamePasswordToken token = new UsernamePasswordToken("lonestarr", "vespa");
	
	//判断用户的身份
	currentUser.hasRole("schwartz")
        
    //判断用户拥有的权限
    currentUser.isPermitted("lightsaber:wield")
        
    //注销当前用户    
    currentUser.logout();    
```



### SpringBoot继承Shiro

<img src="../../../MyLeaning_doc/picture/32323.jpg" style="zoom: 67%;" />

#### Maven依赖

```xml
        <dependency>
            <groupId>org.apache.shiro</groupId>
            <artifactId>shiro-spring-boot-starter</artifactId>
            <version>1.6.0</version>
        </dependency>
```

#### 创建Realm类

```java
    public class CustomRealm extends AuthorizingRealm {

    @Autowired
    private LoginService loginService;

    /**
     * @MethodName doGetAuthorizationInfo
     * @Description 权限配置类
     * @Param [principalCollection]
     * @Return AuthorizationInfo
     * @Author WangShiLin
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
    	//获取登录用户名
        String name = (String) principalCollection.getPrimaryPrincipal();
        //查询用户名称
        User user = loginService.getUserByName(name);
        //添加角色和权限
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        for (Role role : user.getRoles()) {
            //添加角色
            simpleAuthorizationInfo.addRole(role.getRoleName());
            //添加权限
            for (Permissions permissions : role.getPermissions()) {
                //将用户拥有的权限加载到获取权限中
                simpleAuthorizationInfo.addStringPermission(permissions.getPermissionsName());
            }
        }
        return simpleAuthorizationInfo;
    }
    
    /**
     * @MethodName doGetAuthenticationInfo
     * @Description 认证配置类
     * @Param [authenticationToken]
     * @Return AuthenticationInfo
     * @Author WangShiLin
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
     	if (StringUtils.isEmpty(authenticationToken.getPrincipal())) {
            return null;
        }
        //获取用户信息
        String name = authenticationToken.getPrincipal().toString();
        User user = loginService.getUserByName(name);
        if (user == null) {
            //这里返回后会报出对应异常
            return null;
        } else {
            //这里验证authenticationToken和simpleAuthenticationInfo的信息
            SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(name, user.getPassword().toString(),ByteSource.Util.bytes("x23*2d"),getName());
            return simpleAuthenticationInfo;
        }
     }
```

创建Realm类继承AuthorizingRealm，重写doGetAuthorizationInfo（授权配置）、doGetAuthenticationInfo（认证配置）方法。

其中AuthenticationToken 用于收集用户提交的身份（如用户名）及凭据（如密码）。

**其中ByteSource.Util.bytes方法为用户设置时的随机盐值。**



#### 创建ShiroConfig配置类

```java
@Configuration
public class ShiroConfig {
	//将自己的验证方式加入容器
    @Bean
    public CustomRealm myShiroRealm() {
        CustomRealm myShiroRealm = new CustomRealm();
        //设置realm hash验证
        HashedCredentialsMatcher credentialsMatcher= new HashedCredentialsMatcher();
        //使用加密方法
        credentialsMatcher.setHashAlgorithmName("md5");
        //散列次数
        credentialsMatcher.setHashIterations(1024);
        myShiroRealm.setCredentialsMatcher(credentialsMatcher);
        return myShiroRealm;
    }

    //权限管理，配置主要是Realm的管理认证
    @Bean
    public DefaultWebSecurityManager  securityManager() {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setSessionManager(sessionManager());
        //绑定Reaml
        securityManager.setRealm(myShiroRealm);
        return securityManager;
    }

    //Filter工厂，设置对应的过滤条件和跳转条件
    @Bean
    public ShiroFilterFactoryBean shiroFilterFactoryBean(SecurityManager securityManager) {
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(securityManager);
        Map<String, String> map = new HashMap<>();
        //登出
        map.put("/logout", "logout");
        //对所有用户认证
        map.put("/**", "authc");
        //登录
        shiroFilterFactoryBean.setLoginUrl("/login");
        //首页
        shiroFilterFactoryBean.setSuccessUrl("/index");
        //错误页面，认证不通过跳转
        shiroFilterFactoryBean.setUnauthorizedUrl("/error");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(map);
        return shiroFilterFactoryBean;
    }
    
    // 必须使用session管理器，才能够解决前后端分离shiro的subject未认证的问题
    @Bean
    public SessionManager sessionManager(){
        //将我们继承后重写的shiro session 注册
        ShiroSession shiroSession = new ShiroSession();
        //如果后续考虑多tomcat部署应用，可以使用shiro-redis开源插件来做session 的控制，或者nginx 的负载均衡
        shiroSession.setSessionDAO(new EnterpriseCacheSessionDAO());
        return shiroSession;
    }

    /**
     * Shiro生命周期处理器
     */
    @Bean(name = "lifecycleBeanPostProcessor")
    public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
        return new LifecycleBeanPostProcessor();
    }

    /**
     * 开启Shiro的注解(如@RequiresRoles,@RequiresPermissions),需借助SpringAOP扫描使用Shiro注解的类,并在必要时进行安全逻辑验证
     * 配置以下两个bean(DefaultAdvisorAutoProxyCreator(可选)和AuthorizationAttributeSourceAdvisor)即可实现此功能
     */
    @Bean
    @DependsOn({"lifecycleBeanPostProcessor"})
    public DefaultAdvisorAutoProxyCreator advisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator advisorAutoProxyCreator = new DefaultAdvisorAutoProxyCreator();
        advisorAutoProxyCreator.setProxyTargetClass(true);
        return advisorAutoProxyCreator;
    }

    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor() {
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager());
        return authorizationAttributeSourceAdvisor;
    }
}
```

其中shiro内置过滤器：

```
	anno：无需认证即可访问
	authc：必须认证才可以访问
	user ：不许拥有记住我功能才能访问
	perms：拥有对某个资源访问权限才能使用  （（perms认证必须放在authc认证前，否则无效））
	role：拥有某个角色权限才能访问
```

权限限定访问：

```
map.put("/set","perms[user:set]");   //只限定拥有‘user:set’权限的用户访问
```

#### ShiroSessionManager类

```java
/**
 *      目的: shiro 的 session 管理
 *      自定义session规则，实现前后分离，在跨域等情况下使用token 方式进行登录验证才需要，否则没必须使用本类。
 *      shiro默认使用 ServletContainerSessionManager 来做 session 管理，它是依赖于浏览器的 cookie 来维护 session 的,
 *      调用 storeSessionId  方法保存sesionId 到 cookie中
 *      为了支持无状态会话，我们就需要继承 DefaultWebSessionManager
 *      自定义生成sessionId 则要实现 SessionIdGenerator
 *
 */
public class ShiroSession extends DefaultWebSessionManager {
    /**
     * 定义的请求头中使用的标记key，用来传递 token
     */
    private static final String AUTH_TOKEN = "authToken";
    private static final String REFERENCED_SESSION_ID_SOURCE = "Stateless request";

    public ShiroSession() {
        super();
        //设置 shiro session 失效时间，默认为30分钟，这里现在设置为35分钟
        setGlobalSessionTimeout(MILLIS_PER_MINUTE * 35);
    }

    /**
     * 获取sessionId，原本是根据sessionKey来获取一个sessionId
     * 重写的部分多了一个把获取到的token设置到request的部分。这是因为app调用登陆接口的时候，是没有token的，登陆成功后，产生了token,我们把它放到request中，返回结
     * 果给客户端的时候，把它从request中取出来，并且传递给客户端，客户端每次带着这个token过来，就相当于是浏览器的cookie的作用，也就能维护会话了
     * @param request ServletRequest
     * @param response ServletResponse
     * @return Serializable
     */
    @Override
    protected Serializable getSessionId(ServletRequest request, ServletResponse response) {
        //获取请求头中的 AUTH_TOKEN 的值，如果请求头中有 AUTH_TOKEN 则其值为sessionId。shiro就是通过sessionId 来控制的
        String sessionId = WebUtils.toHttp(request).getHeader(AUTH_TOKEN);

        if (StringUtils.isEmpty(sessionId)){
            //如果没有携带id参数则按照父类的方式在cookie进行获取sessionId
            return super.getSessionId(request, response);

        } else {
            //请求头中如果有 authToken, 则其值为sessionId
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_SOURCE, REFERENCED_SESSION_ID_SOURCE);
            //sessionId
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID, sessionId);
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_IS_VALID, Boolean.TRUE);
            return sessionId;
        }
    }
}
```

shiro认证是通过SessionId来进行判断是否认证.

在用户登录成功时获取SecurityUtils的Session **ID**(不是值)用作autoToken:	

```java
            Subject Usersubject = SecurityUtils.getSubject();
            // shiro的sessionID
            String authToken = (String) Usersubject.getSession().getId();
```

这个Session管理类是用作跨域访问时要求 前台request请求头部传递一个 token (内容为SessionId) 来认证其是否 认证通过.

#### Controller类

```java
@RestController
@Slf4j
public class LoginController {

    @GetMapping("/login")
    public String login(User user) {
        if (StringUtils.isEmpty(user.getUserName()) || StringUtils.isEmpty(user.getPassword())) {
            return "请输入用户名和密码！";
        }
        //用户认证信息
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken usernamePasswordToken = new UsernamePasswordToken(
                user.getUserName(),
                user.getPassword()
        );
        try {
            //进行验证，这里可以捕获异常，然后返回对应信息
            subject.login(usernamePasswordToken);
//            subject.checkRole("admin");
//            subject.checkPermissions("query", "add");
        } catch (UnknownAccountException e) {
            log.error("用户名不存在！", e);
            return "用户名不存在！";
        } catch (AuthenticationException e) {
            log.error("账号或密码错误！", e);
            return "账号或密码错误！";
        } catch (AuthorizationException e) {
            log.error("没有权限！", e);
            return "没有权限";
        }
        return "login success";
    }
    
	...
}
```

1.用 SecurityUtils.getSubject()获取Subject类。

2.将用户输入进去的账户密码信息封装入UsernamePasswordToken类。

3.使用Subject类的login方法判断登录结果，并捕捉相关错误异常。



**登录错误异常**

- ​	UnknownAccountException: 用户名不存在

- ​	AuthenticationException: 账户或者密码错误

- ​	AuthorizationException: 没有权限

- ​	Account Exception : 账号异常
  - ConcurrentAccessException: 并发访问异常（多个用户同时登录时抛出）
  - UnknownAccountException:未知的账号
  - ExcessiveAttemptsException: 认证次数超过限制
  - DisabledAccountException: 禁用的账号
  - LockedAccountException: 账号被锁定
  - UnsupportedTokenException: 使用了不支持的Token

#### Shiro跨域过滤

```java
/**
 * @description: Shiro跨域请求过滤
 * @author: Zhaotianyi
 * @time: 2021/5/18 15:56
 */

@Component
@ServletComponentScan
@WebFilter(urlPatterns = "/*",filterName = "shiroLoginFilter")
public class ShiroLoginFilter  implements Filter {

    private FilterConfig config = null;
    @Override
    public void init(FilterConfig config) throws ServletException {
        this.config = config;
    }
    @Override
    public void destroy() {
        this.config = null;
    }
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        // 允许哪些Origin发起跨域请求,nginx下正常
        // response.setHeader( "Access-Control-Allow-Origin", config.getInitParameter( "AccessControlAllowOrigin" ) );
        response.setHeader( "Access-Control-Allow-Origin", "*" );
        // 允许请求的方法
        response.setHeader( "Access-Control-Allow-Methods", "HEAD,POST,GET,OPTIONS,DELETE,PUT" );
        // 多少秒内，不需要再发送预检验请求，可以缓存该结果
        response.setHeader( "Access-Control-Max-Age", "3600" );
        // 表明它允许跨域请求包含xxx头
        response.setHeader( "Access-Control-Allow-Headers", "*" );
        //是否允许浏览器携带用户身份信息（cookie）
        response.setHeader( "Access-Control-Allow-Credentials", "true" );
        // response.setHeader( "Access-Control-Expose-Headers", "*" );
        if (request.getMethod().equals( "OPTIONS" )) {
            response.setStatus( 200 );
            return;
        }
        filterChain.doFilter( servletRequest, response );
    }
}
```

### Shiro+Thymeleaf页面整合

Maven依赖：

```xml
<!-- https://mvnrepository.com/artifact/com.github.theborakompanioni/thymeleaf-extras-shiro -->
<dependency>
    <groupId>com.github.theborakompanioni</groupId>
    <artifactId>thymeleaf-extras-shiro</artifactId>
    <version>2.0.0</version>
</dependency>
```

Themeleaf页面头部加入 xmlns:shiro="http://www.pollix.at/thymeleaf/shiro" 开启代码提示。

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
      ... 
</html>
```

#### 常用标签：

##### The has Permission tag

shiro:hasPermission="xxx"   判断当前用户是否拥有xxx权限

```html
<div shiro:hasPermission="user:set"></div>
```

##### The authenticated tag

authenticated=“”  已经用户得到认证

```html
<a shiro:authenticated="" href="updateAccount.html">Update your contact information</a>
```

##### The hasRole tag

shiro:hasRole="xxx"  判断当前用户为xxx权限

```html
<a shiro:hasRole="administrator" href="admin.html">Administer the system</a>
```

### **权限、角色访问控制**

#### 方法一：直接在页面控制（以Thymeleaf为例）

```html
    <!--拥有user:add权限的任何人才能看见-->
    <div shiro:hasPermission="user:add:*">
        <a th:href="@{/user/add}">Add</a>
    </div>
    <!--拥有admin角色才能看见-->
    <div shiro:hasRole="admin">
        <a th:href="@{/user/update}">Update</a>
    </div>
```

#### 方法二：Controller代码层中控制

```java
    //获取当前用户
    Subject subject = SecurityUtils.getSubject();
    if (subject.hasRole("admin")) {
        System.out.println("添加成功！");
    }else{
        System.out.println("添加失败！");
```

#### 方法三：代码注释控制

```java
    @RequestMapping("/user/add")
    @RequiresRoles("admin") //判断角色
 	@RequiresPermissions("user:add:*") //判断权限
    public String add() {
        return "user/add";
    }
```

### Ehcache缓存持久化

Shiro支持很多第三方缓存工具。官方提供了shiro-ehcache，实现了把EHCache当做Shiro的缓存工具的解决方案。其中最好用的一个功能是就是缓存认证执行的Realm方法，减少对数据库的访问。

```xml
<dependency>
    <groupId>net.sf.ehcache</groupId>
    <artifactId>ehcache</artifactId>
    <version>2.10.2</version>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-ehcache</artifactId>
    <version>1.4.2</version>
</dependency>
```

shiro-ehcache是Shiro官方与Ehcache进行对接的依赖包。

我们只需要在其ShiroConfig配置类中进行增加其Ehcache功能即可：

```java
...
@Bean
public DefaultWebSecurityManager securityManager() {
    DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
    ...
    manager.setCacheManager(ehCacheManager());
    return manager;
}

@Bean
public EhCacheManager ehCacheManager(){
    EhCacheManager ehCacheManager = new EhCacheManager();
    InputStream is = null;
    try {
        is = ResourceUtils.getInputStreamForPath("classpath:ehcache/ehcache-shiro.xml");
    } catch (IOException e) {
        e.printStackTrace();
    }
    net.sf.ehcache.CacheManager cacheManager = new net.sf.ehcache.CacheManager(is);
    ehCacheManager.setCacheManager(cacheManager);
    return ehCacheManager;
}
...
```

