---
    title: MBG配合TK.mybatis和freemarker生成SSM框架  # 文章标题  
    date: 2021/07/29 17:46:37
    tags:
    - JAVA
    categories: JAVA # 分类
    thumbnail: https://zssaer-img.oss-cn-chengdu.aliyuncs.com/anime2.jpg?x-oss-process=style/small # 略缩图 
---
# MBG配合TK.mybatis\freemarker生成SSM框架

单独使用MBG逆向生成SSM框架文件,只能生成Model类\Xml文件\Mapper类.

要知道在其SSM项目中要有Model层=>Dao(Mapper)数据访问层=>Service业务层=>Controller控制层

所以单独使用MBG生成的文件只能用来减少4/1的工作量,还需要单独生成业务类(甚至还有业务实现类)和控制类,非常麻烦.

TK.Mybatis的基础类提供了生成插件,可以配合MBG生成,再结合freemarker模板渲染,可以直接生成Model\Dao\Service\Controller.对于简单的增删改查的业务来说,非常便利.

而且配合TKMybatis生成的Xml文件非常简洁,没有过多的sql语句.下图对比.

![](https://zssaer-img.oss-cn-chengdu.aliyuncs.com/commonXML.png)

<center>普通MBG生成的XML文件,SQL内容非常多,不容易后续扩展</center>

![](https://zssaer-img.oss-cn-chengdu.aliyuncs.com/TKXML.png)

<center>MBG配合TK生成的XML文件,非常简洁</center>

下面展示配合内容,其使用方法和MBG一样直接执行生成类的Main方法即可.

## 生成类编写

在Test下创建生成类:

```java
/**
 * @description: 代码生成器，根据数据表名称生成对应的Model、Mapper、Service、Controller简化开发。
 * @author: Zhaotianyi
 * @time: 2021/7/29 14:58
 */
public class CodeGenerator {
    // 数据库连接内容
    public static final String JDBC_URL = "jdbc:mysql://localhost:3306/sys";
    public static final String JDBC_USERNAME = "root";
    private static final String JDBC_PASSWORD = "200428";
    // 数据库连接器
    // MySql8.0以上使用 'com.mysql.cj.jdbc.Driver'
    // Mysql8.0以下使用 'com.mysql.jdbc.Driver'
    private static final String JDBC_DIVER_CLASS_NAME = "com.mysql.cj.jdbc.Driver";

    private static final String PROJECT_PATH = System.getProperty("user.dir");//项目在硬盘上的基础路径
    private static final String TEMPLATE_FILE_PATH = PROJECT_PATH + "/src/test/resources/generator/template";//模板位置

    private static final String JAVA_PATH = "/src/main/java"; //java文件路径
    private static final String RESOURCES_PATH = "/src/main/resources";//资源文件路径

    public static final String BASE_PACKAGE = "com.test.ipp.demo";//项目基础包名称
    public static final String FRAMEWORK_PACKAGE = "com.test.ipp.demo";//项目核心包位置
    public static final String BUSINESS_PACKAGE= "";//项目业务包位置
    public static final String MAPPER_INTERFACE_REFERENCE = "com.test.ipp.demo.core.Mapper";//通用Mapper类路径

    private static final String PACKAGE_PATH_SERVICE = packageConvertPath("com.test.ipp.demo.service");//生成的Service存放路径
    private static final String PACKAGE_PATH_SERVICE_IMPL = packageConvertPath("com.test.ipp.demo.service.impl");//生成的Service实现存放路径
    private static final String PACKAGE_PATH_CONTROLLER = packageConvertPath("com.test.ipp.demo.controller");//生成的Controller存放路径
    public static final String MODEL_PACKAGE = "com.test.ipp.demo.model";//生成的Model类存放路径
    public static final String MAPPER_PACKAGE = "com.test.ipp.demo.mapper";//Mapper所在包

    private static final String AUTHOR = "CodeGenerator"; //生成模板作者
    private static final String DATE = new SimpleDateFormat("yyyy/MM/dd").format(new Date()); //生成模板日期

    public static void main(String[] args) {
        genCode("sys_config");
    }
    /**
     * 通过数据表名称生成代码，Model 名称通过解析数据表名称获得，下划线转大驼峰的形式。
     * 如输入表名称 "t_user_detail" 将生成 TUserDetail、TUserDetailMapper、TUserDetailService ...
     *
     * @param tableNames 数据表名称...
     */
    public static void genCode(String... tableNames) {
        for (String tableName : tableNames) {
            genCodeByCustomModelName(tableName, null);
        }
    }

    /**
     * 通过数据表名称，和自定义的 Model 名称生成代码
     * 如输入表名称 "t_user_detail" 和自定义的 Model 名称 "User" 将生成 User、UserMapper、UserService ...
     *
     * @param tableName 数据表名称
     * @param modelName 自定义的 Model 名称
     */
    public static void genCodeByCustomModelName(String tableName, String modelName) {
        genModelAndMapper(tableName, modelName);
        genService(tableName, modelName);
        genController(tableName, modelName);
    }

    /**
     * 生成Model和Mapper XML文件以及Mapper类
     *
     * @param tableName 数据表名称
     * @param modelName 定义的 Model 名称
     */
    public static void genModelAndMapper(String tableName, String modelName) {
        Context context = new Context(ModelType.FLAT);
        context.setId("Potato");
        context.setTargetRuntime("MyBatis3Simple");
        context.addProperty(PropertyRegistry.CONTEXT_BEGINNING_DELIMITER, "`");
        context.addProperty(PropertyRegistry.CONTEXT_ENDING_DELIMITER, "`");

        JDBCConnectionConfiguration jdbcConnectionConfiguration = new JDBCConnectionConfiguration();
        jdbcConnectionConfiguration.setConnectionURL(JDBC_URL);
        jdbcConnectionConfiguration.setUserId(JDBC_USERNAME);
        jdbcConnectionConfiguration.setPassword(JDBC_PASSWORD);
        jdbcConnectionConfiguration.setDriverClass(JDBC_DIVER_CLASS_NAME);
        context.setJdbcConnectionConfiguration(jdbcConnectionConfiguration);

        PluginConfiguration pluginConfiguration = new PluginConfiguration();
        pluginConfiguration.setConfigurationType("tk.mybatis.mapper.generator.MapperPlugin");

        pluginConfiguration.addProperty("mappers", MAPPER_INTERFACE_REFERENCE);
        context.addPluginConfiguration(pluginConfiguration);

        JavaModelGeneratorConfiguration javaModelGeneratorConfiguration = new JavaModelGeneratorConfiguration();
        javaModelGeneratorConfiguration.setTargetProject(PROJECT_PATH + JAVA_PATH);

        javaModelGeneratorConfiguration.setTargetPackage(MODEL_PACKAGE);
        context.setJavaModelGeneratorConfiguration(javaModelGeneratorConfiguration);

        SqlMapGeneratorConfiguration sqlMapGeneratorConfiguration = new SqlMapGeneratorConfiguration();
        sqlMapGeneratorConfiguration.setTargetProject(PROJECT_PATH + RESOURCES_PATH);
        sqlMapGeneratorConfiguration.setTargetPackage("mapper");
        context.setSqlMapGeneratorConfiguration(sqlMapGeneratorConfiguration);

        JavaClientGeneratorConfiguration javaClientGeneratorConfiguration = new JavaClientGeneratorConfiguration();
        javaClientGeneratorConfiguration.setTargetProject(PROJECT_PATH + JAVA_PATH);
        javaClientGeneratorConfiguration.setTargetPackage(MAPPER_PACKAGE);
        javaClientGeneratorConfiguration.setConfigurationType("XMLMAPPER");
        context.setJavaClientGeneratorConfiguration(javaClientGeneratorConfiguration);

        TableConfiguration tableConfiguration = new TableConfiguration(context);
        tableConfiguration.setTableName(tableName);
        if (StringUtils.isNotEmpty(modelName)) tableConfiguration.setDomainObjectName(modelName);
        // 默认自增主键名为'id'
        tableConfiguration.setGeneratedKey(new GeneratedKey("id", "Mysql", true, null));
        context.addTableConfiguration(tableConfiguration);

        List<String> warnings;
        MyBatisGenerator generator;
        try {
            Configuration config = new Configuration();
            config.addContext(context);
            config.validate();

            boolean overwrite = true;
            DefaultShellCallback callback = new DefaultShellCallback(overwrite);
            warnings = new ArrayList<String>();
            generator = new MyBatisGenerator(config, callback, warnings);
            generator.generate(null);
        } catch (Exception e) {
            throw new RuntimeException("生成Model和Mapper失败", e);
        }

        if (generator.getGeneratedJavaFiles().isEmpty() || generator.getGeneratedXmlFiles().isEmpty()) {
            throw new RuntimeException("生成Model和Mapper失败：" + warnings);
        }
        if (StringUtils.isEmpty(modelName)) modelName = tableNameConvertUpperCamel(tableName);
        System.out.println(modelName + ".java 生成成功");
        System.out.println(modelName + "Mapper.java 生成成功");
        System.out.println(modelName + "Mapper.xml 生成成功");
    }

    /**
     * 使用freemaker模板生成Service类
     *
     * @param tableName 数据表名称
     * @param modelName 定义的 Model 名称
     */
    public static void genService(String tableName, String modelName) {
        try {
            freemarker.template.Configuration cfg = getConfiguration();

            Map<String, Object> data = new HashMap<>();
            data.put("date", DATE);
            data.put("author", AUTHOR);
            String modelNameUpperCamel = StringUtils.isEmpty(modelName) ? tableNameConvertUpperCamel(tableName) : modelName;
            data.put("modelNameUpperCamel", modelNameUpperCamel);
            data.put("modelNameLowerCamel", tableNameConvertLowerCamel(tableName));
            data.put("basePackage", BASE_PACKAGE);
            data.put("bussnessPackage", BASE_PACKAGE);
            data.put("frameworkPackage", FRAMEWORK_PACKAGE);

            File file = new File(PROJECT_PATH + JAVA_PATH + PACKAGE_PATH_SERVICE + modelNameUpperCamel + "Service.java");
            if (!file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            cfg.getTemplate("service.ftl").process(data,
                    new FileWriter(file));
            System.out.println(modelNameUpperCamel + "Service.java 生成成功");

            File file1 = new File(PROJECT_PATH + JAVA_PATH + PACKAGE_PATH_SERVICE_IMPL + modelNameUpperCamel + "ServiceImpl.java");
            if (!file1.getParentFile().exists()) {
                file1.getParentFile().mkdirs();
            }
            cfg.getTemplate("service-impl.ftl").process(data,
                    new FileWriter(file1));
            System.out.println(modelNameUpperCamel + "ServiceImpl.java 生成成功");
        } catch (Exception e) {
            throw new RuntimeException("生成Service失败", e);
        }
    }

    /**
     * 使用freemaker模板生成Controller类
     * @param tableName
     * @param modelName
     */
    public static void genController(String tableName, String modelName) {
        try {
            freemarker.template.Configuration cfg = getConfiguration();

            Map<String, Object> data = new HashMap<>();
            data.put("date", DATE);
            data.put("author", AUTHOR);
            String modelNameUpperCamel = StringUtils.isEmpty(modelName) ? tableNameConvertUpperCamel(tableName) : modelName;
            data.put("baseRequestMapping", modelNameConvertMappingPath(modelNameUpperCamel));
            data.put("modelNameUpperCamel", modelNameUpperCamel);
            data.put("modelNameLowerCamel", CaseFormat.UPPER_CAMEL.to(CaseFormat.LOWER_CAMEL, modelNameUpperCamel));
            data.put("basePackage", BASE_PACKAGE);
            data.put("bussnessPackage", BASE_PACKAGE + BUSINESS_PACKAGE);
            data.put("frameworkPackage", FRAMEWORK_PACKAGE);

            File file = new File(PROJECT_PATH + JAVA_PATH + PACKAGE_PATH_CONTROLLER + modelNameUpperCamel + "Controller.java");
            if (!file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            cfg.getTemplate("controller-restful.ftl").process(data, new FileWriter(file));
//            cfg.getTemplate("controller.ftl").process(data, new FileWriter(file));

            System.out.println(modelNameUpperCamel + "Controller.java 生成成功");
        } catch (Exception e) {
            throw new RuntimeException("生成Controller失败", e);
        }

    }

    private static freemarker.template.Configuration getConfiguration() throws IOException {
        freemarker.template.Configuration cfg = new freemarker.template.Configuration(freemarker.template.Configuration.VERSION_2_3_23);
        cfg.setDirectoryForTemplateLoading(new File(TEMPLATE_FILE_PATH));
        cfg.setDefaultEncoding("UTF-8");
        cfg.setTemplateExceptionHandler(TemplateExceptionHandler.IGNORE_HANDLER);
        return cfg;
    }

    private static String tableNameConvertUpperCamel(String tableName) {
        return CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.UPPER_CAMEL, tableName.toLowerCase());

    }

    private static String tableNameConvertLowerCamel(String tableName) {
        return CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, tableName.toLowerCase());
    }

    private static String modelNameConvertMappingPath(String modelName) {
        String tableName = CaseFormat.UPPER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, modelName);
        return tableNameConvertMappingPath(tableName);
    }

    private static String tableNameConvertMappingPath(String tableName) {
        tableName = tableName.toLowerCase();//兼容使用大写的表名
        return "/" + (tableName.contains("_") ? tableName.replaceAll("_", "/") : tableName);
    }

    private static String packageConvertPath(String packageName) {
        return String.format("/%s/", packageName.contains(".") ? packageName.replaceAll("\\.", "/") : packageName);
    }
}
```

其中Model和Mapper的生成均是采用的原MBG的功能,所以方法基本和MBG的XML配置一样.

而Service和Controller的生成是采用Freemarker模板生成的,所以必须在生前检查Freemarker模板中是否有与项目内容与不一致.

## Freemarker模板

controller-restful.ftl

```java
package ${bussnessPackage}.web;

import ${frameworkPackage}.core.Result;
import ${frameworkPackage}.core.ResultGenerator;
import ${frameworkPackage}.core.PageReq;
import ${basePackage}.annotation.Auth;
import ${basePackage}.annotation.SysLog;
import ${basePackage}.model.${modelNameUpperCamel};
import ${bussnessPackage}.service.${modelNameUpperCamel}Service;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.web.bind.annotation.*;
import io.swagger.annotations.*;
import tk.mybatis.mapper.entity.Condition;
import tk.mybatis.mapper.entity.Example.Criteria;

import javax.annotation.Resource;
import java.util.List;

/**
* Created by ${author} on ${date}.
*/
@RestController
@RequestMapping("${baseRequestMapping}s")
public class ${modelNameUpperCamel}Controller {
    @Resource
    private ${modelNameUpperCamel}Service ${modelNameLowerCamel}Service;

    @PostMapping
    @ApiOperation(value = "新增${modelNameLowerCamel}", notes = "新增${modelNameLowerCamel}")
    @SysLog("新增${modelNameLowerCamel}")
    @Auth
    public Result add(@RequestBody ${modelNameUpperCamel} ${modelNameLowerCamel}) {
        ${modelNameLowerCamel}Service.save(${modelNameLowerCamel});
        return ResultGenerator.genSuccessResult();
    }

    @DeleteMapping
    @ApiOperation(value = "删除${modelNameLowerCamel}", notes = "删除${modelNameLowerCamel}")
    @SysLog("删除${modelNameLowerCamel}")
    @Auth
    public Result delete(@RequestParam(value = "ids") List<Integer> ids) {
    	Condition con = new Condition(${modelNameUpperCamel}.class);
    	con.createCriteria().andIn("id", ids);
        ${modelNameLowerCamel}Service.deleteByCondition(con);
        return ResultGenerator.genSuccessResult();
    }

    @PutMapping
    @ApiOperation(value = "更新${modelNameLowerCamel}", notes = "更新${modelNameLowerCamel}")
    @SysLog("更新${modelNameLowerCamel}")
    @Auth
    public Result update(@RequestBody ${modelNameUpperCamel} ${modelNameLowerCamel}) {
        ${modelNameLowerCamel}Service.update(${modelNameLowerCamel});
        return ResultGenerator.genSuccessResult();
    }

    @GetMapping
    @ApiOperation(value = "获取${modelNameLowerCamel}列表", notes = "获取${modelNameLowerCamel}列表")
    @SysLog("获取${modelNameLowerCamel}列表")
    @Auth
    public Result list(PageReq req) {
        PageHelper.startPage(req.getPage(), req.getSize());
        
        Condition con = new Condition(${modelNameUpperCamel}.class);
        Criteria cri = con.createCriteria();
        
        List<${modelNameUpperCamel}> list = ${modelNameLowerCamel}Service.findByCondition(con);

        return ResultGenerator.genSuccessResult(new PageInfo<${modelNameUpperCamel}>(list));
    }
}

```

controller.ftl(普通非Restful)

```java
package ${bussnessPackage}.web;
import ${frameworkPackage}.core.Result;
import ${frameworkPackage}.core.ResultGenerator;
import ${basePackage}.model.${modelNameUpperCamel};
import ${bussnessPackage}.service.${modelNameUpperCamel}Service;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.annotations.*;

import javax.annotation.Resource;
import java.util.List;

/**
* Created by ${author} on ${date}.
*/
@RestController
@RequestMapping("${baseRequestMapping}")
public class ${modelNameUpperCamel}Controller {
    @Resource
    private ${modelNameUpperCamel}Service ${modelNameLowerCamel}Service;

    @PostMapping("/add")
    @ApiOperation(value = "新增${modelNameUpperCamel}", notes = "新增${modelNameUpperCamel}")
    public Result add(${modelNameUpperCamel} ${modelNameLowerCamel}) {
        ${modelNameLowerCamel}Service.save(${modelNameLowerCamel});
        return ResultGenerator.genSuccessResult();
    }

    @PostMapping("/delete")
    @ApiOperation(value = "删除${modelNameUpperCamel}", notes = "删除${modelNameUpperCamel}")
    public Result delete(@RequestParam Integer id) {
        ${modelNameLowerCamel}Service.deleteById(id);
        return ResultGenerator.genSuccessResult();
    }

    @PostMapping("/update")
    @ApiOperation(value = "更新${modelNameUpperCamel}", notes = "更新${modelNameUpperCamel}")
    public Result update(${modelNameUpperCamel} ${modelNameLowerCamel}) {
        ${modelNameLowerCamel}Service.update(${modelNameLowerCamel});
        return ResultGenerator.genSuccessResult();
    }

    @PostMapping("/detail")
    @ApiOperation(value = "查询${modelNameUpperCamel}详情", notes = "查询${modelNameUpperCamel}详情")
    public Result detail(@RequestParam Integer id) {
        ${modelNameUpperCamel} ${modelNameLowerCamel} = ${modelNameLowerCamel}Service.findById(id);
        return ResultGenerator.genSuccessResult(${modelNameLowerCamel});
    }

    @PostMapping("/list")
    @ApiOperation(value = "获取${modelNameUpperCamel}列表", notes = "获取${modelNameUpperCamel}列表")
    public Result list(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "0") Integer size) {
        PageHelper.startPage(page, size);
        List<${modelNameUpperCamel}> list = ${modelNameLowerCamel}Service.findAll();
        PageInfo pageInfo = new PageInfo(list);
        return ResultGenerator.genSuccessResult(pageInfo);
    }
}

```

service.ftl

```java
package ${bussnessPackage}.service;
import ${basePackage}.model.${modelNameUpperCamel};
import ${frameworkPackage}.core.Service;


/**
 * Created by ${author} on ${date}.
 */
public interface ${modelNameUpperCamel}Service extends Service<${modelNameUpperCamel}> {

}
```

service-impl.ftl

```java
package ${bussnessPackage}.service.impl;

import ${basePackage}.mapper.${modelNameUpperCamel}Mapper;
import ${basePackage}.model.${modelNameUpperCamel};
import ${bussnessPackage}.service.${modelNameUpperCamel}Service;
import ${frameworkPackage}.core.AbstractService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;


/**
 * Created by ${author} on ${date}.
 */
@Service
@Transactional
public class ${modelNameUpperCamel}ServiceImpl extends AbstractService<${modelNameUpperCamel}> implements ${modelNameUpperCamel}Service {
    @Resource
    private ${modelNameUpperCamel}Mapper ${modelNameLowerCamel}Mapper;

}
```

## 总结

内容有些多,但生成出来就爽.

注意:上面的内容需在生成通用Mapper文件和通用AbstractService文件以及通用Service文件前生成

上面的生成目录均为单个包项目,如果为多包项目的话,可以依据注解来进行修改包.