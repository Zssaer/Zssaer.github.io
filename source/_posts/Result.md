---
    title:  前后端传输 Result # 文章标题  
    date: 2021/7/31 00:08:25  # 文章发表时间
    tags:
    - JAVA
    categories: JAVA # 分类
    thumbnail: http://img.zssaer.cn/wallhaven-8oev1j.jpg?x-oss-process=style/small # 略缩图
---
<h1 align = "center">SpringBoot Result对象</h1>
在目前大部分Web项目需要进行前后端分离开发，后端配置API，前端调用后端API，后端提供数据返回给前端，前端再进行二次渲染。
而这其中后端API返回的数据为POJO类或者String数据，那么传输到前端渲染必将产生差异化。
所以这时JSON的作用就来了。JSON和XML一样是一种以文本型的语言，其简洁和清晰的层次结构的特点，便于阅读和理解，广泛应用在传输和存储数据中。

![](http://img.zssaer.cn/json1.png)

在目前的SpringBoot项目中广泛以传递Result Json文件给前端为主要趋势。
主要包含状态码（请求状态，前端判断请求状态）、状态消息、返回对象。
## 常用Result模板以及使用方式
### 一：定义响应码枚举

```java
 /**
 * @Description: 响应码枚举，参考HTTP状态码的语义
 * @author zty
 * @date 2021/4/16 09:42
 */
public enum RetCode {
   // 成功
   SUCCESS(200),
   // 失败
   FAIL(400),
   // 未认证（签名错误）
   UNAUTHORIZED(401),
   // 接口不存在
   NOT_FOUND(404),
   // 服务器内部错误
   INTERNAL_SERVER_ERROR(500);
 
   private final int code;
 
   RetCode(int code) {
      this.code = code;
   }
   public int code() {
        return code;
    }
}
```

### 二：创建返回对象Result实体（泛型）

```java
/**
 * @Description: 统一API响应结果封装,返回对象实体
 * @author zty
 * @date 2021/4/16 09:43
 */
public class RetResult<T> {
 
   public int code;
 
   private String msg;
 
   private Object data;
 
   public RetResult<T> setCode(RetCode retCode) {
      this.code = retCode.code;
      return this;
   }
 
   public int getCode() {
      return code;
   }
 
   public RetResult<T> setCode(int code) {
      this.code = code;
      return this;
   }
 
   public String getMsg() {
      return msg;
   }
 
   public RetResult<T> setMsg(String msg) {
      this.msg = msg;
      return this;
   }
 
   public T getData() {
      return data;
   }
 
   public RetResult<T> setData(T data) {
      this.data = data;
      return this;
   }
    public String toString() {
        // 使用FastJson 输出为json数据给前台
        return JSON.toJSONString(this);
    }
 
}
```
*注意：当前模板使用阿里的FastJson进行转换Json操作。但根据网络上的消息，FastJson存在一些格式Bug（具体见互联网），可能对一些大型项目会造成输出问题，因为这一点甚至在一些公司被明文禁止使用FastJson。*
**对此不嫌麻烦，可以使用Jackson进行代替FastJson**

### 四：返回结果数据格式封装 / 响应结果生成工具

```java
/**
 * @Description: 将结果转换为封装后的对象
 * @author
 * @date 2021/4/16 09:45
 */
public class RetResponse {
 
   private final static String SUCCESS = "操作成功";
 
   public static <T> RetResult<T> makeOKRsp() {
      return new RetResult<T>().setCode(RetCode.SUCCESS).setMsg(SUCCESS);
   }
 
   public static <T> RetResult<T> makeOKRsp(T data) {
      return new RetResult<T>().setCode(RetCode.SUCCESS).setMsg(SUCCESS).setData(data);
   }
 
   public static <T> RetResult<T> makeErrRsp(String message) {
      return new RetResult<T>().setCode(RetCode.FAIL).setMsg(SUCCESS);
   }
 
   public static <T> RetResult<T> makeRsp(int code, String msg) {
      return new RetResult<T>().setCode(code).setMsg(msg);
   }
    
   public static <T> RetResult<T> makeRsp(int code, String msg, T data) {
      return new RetResult<T>().setCode(code).setMsg(msg).setData(data);
   }
    
   public static void genHttpResult(HttpServletResponse response,Integer httpCode,String msg) {
    	response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-type", "application/json;charset=UTF-8");
        response.setStatus(httpCode);
        try {
            response.getWriter().write(JSON.toJSONString(msg));
        } catch (IOException ex) {
        }
   }
}
```

### 五：返回Result功能测试

```java
@RestController
@Api(tags = "用户管理")
@RequestMapping("/users")
public class UserController {
	@PostMapping("/selectById")
    public RetResult<UserInfo> selectById(Integer id){
    	UserInfo userInfo = userInfoService.selectById(id);
    	return RetResponse.makeOKRsp(userInfo);
	}
}
```

前端请求返回数据格式

```
{
    "code": 200,
    "msg": "success",
    "data": {
        "id": 1,
        "userName": "1"
    }
}
```







