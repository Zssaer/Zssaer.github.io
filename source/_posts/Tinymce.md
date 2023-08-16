---
    title:  TinyMCE富文本编辑器 # 文章标题  
    date: 2021/7/26 13:48:25  # 文章发表时间
    tags:
    - 前端
    categories: 前端 # 分类
    thumbnail: https://zssaer.oss-cn-chengdu.aliyuncs.com/JrAJTf-aHsc.jpg?x-oss-process=style/wallpaper # 略缩图
---
# TinyMCE富文本编辑器
TinyMCE是一款易用、且功能强大的所见即所得的可跨平台富文本编辑器。同类程序有：UEditor、Kindeditor、Simditor、CKEditor、wangEditor、Suneditor、froala等等。

TinyMCE的优势：

- 开源可商用，基于LGPL2.1
- 插件丰富，自带插件基本涵盖日常所需功能（示例看下面的Demo-2）
- 接口丰富，可扩展性强，有能力可以无限拓展功能
- 界面好看，符合现代审美
- 提供经典、内联、沉浸无干扰三种模式（详见“介绍与入门”）
- 对标准支持优秀（自v5开始）
- 多语言支持，官网可下载几十种语言。
- 
官网及文档：[www.tiny.cloud](https://www.tiny.cloud/)
官网下载：[www.tiny.cloud/get-tiny/self-hosted/](https://www.tiny.cloud/get-tiny/self-hosted/)
Github：[github.com/tinymce](https://github.com/tinymce/)
![](https://zssaer.oss-cn-chengdu.aliyuncs.com/tinyMCE.png)
### TinyMCE是否收费

> tinymce主程序及自带的大部分插件均提供社区开源版，可免费使用且可商用。tinymce的主要盈利模式为【付费插件及拓展服务】，有关付费项目的列表，请参考：https://www.tiny.cloud/pricing



### Vue下快速使用

1. 安装TinyMCE相关依赖包

   根据使用的js包管理工具,进行导入依赖

   ```bash
   yarn add tinymce  ||  npm install tinymce -S
   
   yarn add @tinymce/tinymce-vue  ||  npm install @tinymce/tinymce-vue -S
   ```

2. 汉化编辑器

   TinyMCE是国外的插件,所以自然默认为英文版本,需要使用中文的话,要去官网下载汉化包:

    https://www.tiny.cloud/get-tiny/language-packages/
    ![](https://zssaer.oss-cn-chengdu.aliyuncs.com/tinyMCE-CN.png)
3. 在项目public文件夹下新建tinymce文件夹，将下载后的汉化压缩包解压至此文件夹下
   再将node_modules/tinymce/skins文件夹也复制到public/tinymce文件夹下(最终如下图所示)
    ![](https://zssaer.oss-cn-chengdu.aliyuncs.com/tinyMCE-lib.png)
4. 导入Emoji表情插件 (可跳过)

   将node_modules/tinymce/plugins/emoticons文件夹复制到public/tinymce里

   最后将其添加到组件的plugins和toolbar下(第6步组件以及加入无需重复加入).

5.  添加首行缩进功能 (可跳过)

    前往插件文档里下载intent2em插件:http://tinymce.ax-z.cn/more-plugins/indent2em.php

    将解压后的首行缩进插件intent2em复制到node_modules/tinymce/plugins文件夹下.

    在其intent2em文件夹中创建index.js并写入以下代码

   ```js
   // Exports the "indent2em" plugin for usage with module loaders
   // Usage:
   //   CommonJS:
   //     require('tinymce/plugins/indent2em')
   //   ES2015:
   //     import 'tinymce/plugins/indent2em'
   require('./plugin.js');
   ```

   最后复写plugins.js

   ```js
   (function () {
           'use strict';
       
           var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
           var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');
           
     
           var doAct = function (editor) {
             var dom = editor.dom;
             var blocks = editor.selection.getSelectedBlocks();
             var act = '';
             var indent2em_val = editor.getParam('indent2em_val', '2em')
             global$1.each(blocks, function (block) {
                 if(act==''){
                     act = dom.getStyle(block,'text-indent')== indent2em_val ? 'remove' : 'add';
                 }
                 if( act=='add' ){
                     dom.setStyle(block, 'text-indent', indent2em_val);
                 }else{
                     var style=dom.getAttrib(block,'style');
                     style = style.replace(/text-indent:[\s]*2em;/ig,'');
                     dom.setAttrib(block,'style',style);
                 }
     
             });
           };
     
           var register = function (editor) {
             editor.ui.registry.getAll().icons.indent2em || editor.ui.registry.addIcon('indent2em','<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M170.666667 563.2v-102.4H887.466667v102.4zM170.666667 836.266667v-102.4H887.466667v102.4zM512 290.133333v-102.4H887.466667v102.4zM238.933333 341.333333V136.533333l204.8 102.4z" fill="#2c2c2c" p-id="5210"></path></svg>');
             editor.ui.registry.addButton('indent2em', {
               tooltip: '首行缩进',
               icon: 'indent2em',
               onAction: function () {
                 doAct(editor);
               }
             });
             editor.ui.registry.addMenuItem('indent2em', {
               text: '首行缩进',
               icon: 'indent2em',
               onAction: function () {
                 doAct(editor);
               }
             });
           };
     
           global.add('indent2em', function (editor) {
             register(editor)
           });
     
           function Plugin () {
           }
       
           return Plugin;
       })();
   ```

   最后将其添加到组件的plugins和toolbar下(第6步组件以及加入无需重复加入).

   

6. 配置TinyMCE组件

   在src/components下新建TEditor.vue，并写入如下代码:

   ```vue
   <template>
     <div class="tinymce-box">
       <Editor
         v-model="contentValue"
         :init="init"
         :disabled="disabled"
         @onClick="onClick"
         toolbar_mode='floating'
       />
     </div>
   </template>
   
   <script>
   import {baseUrl} from "../api/api.js";
   import axios from 'axios'
   
   //引入tinymce编辑器
   import Editor from "@tinymce/tinymce-vue";
   
   //引入node_modules里的tinymce相关文件文件
   import tinymce from "tinymce/tinymce"; //tinymce默认hidden，不引入则不显示编辑器
   import "tinymce/themes/silver"; //编辑器主题，不引入则报错
   import "tinymce/icons/default"; //引入编辑器图标icon，不引入则不显示对应图标
   
   // 引入编辑器插件（基本免费插件都在这儿了）
   import "tinymce/plugins/advlist"; //高级列表
   import "tinymce/plugins/anchor"; //锚点
   import "tinymce/plugins/autolink"; //自动链接
   import "tinymce/plugins/autoresize"; //编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
   import "tinymce/plugins/autosave"; //自动存稿
   import "tinymce/plugins/charmap"; //特殊字符
   import "tinymce/plugins/code"; //编辑源码
   import "tinymce/plugins/codesample"; //代码示例
   import "tinymce/plugins/directionality"; //文字方向
   import "tinymce/plugins/emoticons"; //表情
   import "tinymce/plugins/fullpage"; //文档属性
   import "tinymce/plugins/fullscreen"; //全屏
   import "tinymce/plugins/help"; //帮助
   import "tinymce/plugins/hr"; //水平分割线
   import "tinymce/plugins/image"; //插入编辑图片
   import "tinymce/plugins/importcss"; //引入css
   import "tinymce/plugins/insertdatetime"; //插入日期时间
   import "tinymce/plugins/link"; //超链接
   import "tinymce/plugins/lists"; //列表插件
   import "tinymce/plugins/media"; //插入编辑媒体
   import "tinymce/plugins/nonbreaking"; //插入不间断空格
   import "tinymce/plugins/pagebreak"; //插入分页符
   import "tinymce/plugins/paste"; //粘贴插件
   import "tinymce/plugins/preview"; //预览
   import "tinymce/plugins/print"; //打印
   import "tinymce/plugins/quickbars"; //快速工具栏
   import "tinymce/plugins/save"; //保存
   import "tinymce/plugins/searchreplace"; //查找替换
   // import 'tinymce/plugins/spellchecker'  //拼写检查，暂未加入汉化，不建议使用
   import "tinymce/plugins/tabfocus"; //切入切出，按tab键切出编辑器，切入页面其他输入框中
   import "tinymce/plugins/table"; //表格
   import "tinymce/plugins/template"; //内容模板
   import "tinymce/plugins/textcolor"; //文字颜色
   import "tinymce/plugins/textpattern"; //快速排版
   import "tinymce/plugins/toc"; //目录生成器
   import "tinymce/plugins/visualblocks"; //显示元素范围
   import "tinymce/plugins/visualchars"; //显示不可见字符
   import "tinymce/plugins/wordcount"; //字数统计
   import "tinymce/plugins//indent2em"  //首行缩进(创建)
   
   export default {
     name: "TEditor",
     components: {
       Editor,
     },
     props: {
       modelValue: {
         type: String,
         default: "",
       },
       disabled: {
         type: Boolean,
         default: false,
       },
       plugins: {
         type: [String, Array],
         default:
           "print preview searchreplace autolink directionality emoticons indent2em visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave ",
       },
       toolbar: {
         type: [String, Array],
         default:
           "fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold indent2em italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                   styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                   table image media charmap emoticons hr pagebreak insertdatetime print preview | code selectall searchreplace visualblocks | indent2em lineheight formatpainter axupimgs",
       },
     },
     data() {
       return {
         init: {
           language_url: "/tinymce/langs/zh_CN.js", //引入语言包文件
           language: "zh_CN", //语言类型
   
           skin_url: "/tinymce/skins/ui/oxide", //皮肤：浅色
           // skin_url: '/tinymce/skins/ui/oxide-dark',//皮肤：暗色
   
           emoticons_database_url:'/tinymce/emoticons/js/emojis.js', //表情路径引入
           toolbar_mode: 'sliding', // 设置工具栏更多工具 显示模式{false:全部展示,floating:悬浮显示,sliding:滑动显示}
           plugins: this.plugins, //插件配置
           toolbar: this.toolbar, //工具栏配置，设为false则隐藏
           
           //menubar: 'file edit',  //菜单栏配置，设为false则隐藏，不配置则默认显示全部菜单，也可自定义配置--查看 http://tinymce.ax-z.cn/configure/editor-appearance.php --搜索“自定义菜单”
   
           fontsize_formats:
             "12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px", //字体大小
           font_formats:
             "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;", //字体样式
           lineheight_formats: "0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5", //行高配置，也可配置成"12px 14px 16px 20px"这种形式
   
           height: 400, //注：引入autoresize插件时，此属性失效
           placeholder: "在这里输入文字",
           branding: false, //tiny技术支持信息是否显示
           resize: false, //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
           statusbar: false,  //最下方的元素路径和字数统计那一栏是否显示
           elementpath: false, //元素路径是否显示
   
           content_style: "img {max-width:100%;}", //直接自定义可编辑区域的css样式
           // content_css: '/tinycontent.css',  //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
   
           // images_upload_url: '/apib/api-upload/uploadimg',  //后端处理程序的url，建议直接自定义上传函数image_upload_handler，这个就可以不用了
           // images_upload_base_path: '/demo',  //相对基本路径--关于图片上传建议查看--http://tinymce.ax-z.cn/general/upload-images.php
           paste_data_images: true, //图片是否可粘贴
           images_upload_handler: (blobInfo, success, failure) => {
             if (blobInfo.blob().size / 1024 / 1024 > 5) {
               failure("上传失败，图片大小请控制在 5M 以内");
             } else {
               let params = new FormData();
               params.append("file", blobInfo.blob());
               let config = {
                 headers: {
                   "Content-Type": "multipart/form-data",
                 },
               };
               axios
                 .post(baseUrl+`/uploadEditorPic`, params, config)
                 .then((res) => {
                   console.log(res);
                   if (res.data.code == 200) {
                     success(res.data.data.accessUrl); //上传成功，在成功函数里填入图片路径
                   } else {
                     failure("上传失败");
                   }
                 })
                 .catch(() => {
                   failure("上传出错，服务器开小差了呢");
                 });
             }
           },
         },
         contentValue: this.modelValue,
       };
     },
     watch: {
       modelValue(newValue) {
         this.contentValue = newValue;
       },
       contentValue(newValue) {
         this.$emit("update:modelValue", newValue);
       },
     },
     created() {},
     mounted() {
       tinymce.init({});
     },
     methods: {
       // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
       onClick(e) {
         this.$emit("onClick", e, tinymce);
       },
       //清空内容
       clear() {
         this.contentValue = "";
       },
     },
   };
   </script>
   
   <style lang="less">
   </style>
   ```

   以上为vue3的v-model默认绑定值, 如vue2.x使用,需要修改其v-model的默认绑定值.(modelValue => value && update:modelValue => input)

   其中引入baseUrl为后端Api地址,主要用作图片上传.

7. 调用组件

   ```vue
   <TEditor ref="editor" v-model="subform.value" />
   
   import TEditor from '@/components/TEditor.vue'
   ```

### 更多插件

https://github.com/Five-great/tinymce-plugins

该项目有多个TinyMCE插件.by [Five-great](https://github.com/Five-great/tinymce-plugins/commits?author=Five-great) 

-  imagetools [增强优化]： 图片编辑工具插件， 对图片进行处理。优化跨域，功能更丰富；
-  table [增强优化]：表格插件，处理表格。 增强优化表格控制，增加表格转图片功能，便捷布局按钮；
-  indent2em[增强优化]：首行缩进插件。提供中文段落排版的首行缩进2个字符的功能。增强优化 加入字间距非默认情况，也能实现准确首行缩进2字符；
-  letterspacing：设置间距插件。可以设置文档中的文字间距；
-  layout： 一键布局插件。可以给文档段落进行一键快速排版布局；
-  importword： 导入word插件。可以直接导入word ,并且保证word中图片不会丢失，自动转为base64;
-  upfile： 文件上传。可以点击导入文件，可自定义编辑文件名;
-  bdmap： 百度地图。 支持更改尺寸，自定义标签，开启导航功能,支持vue;
-  axupimgs: 多图上传。可同时上传多组图片，支持vue;
-  attachment: 附件上传。拥有附件类型对应图标，支持vue;

使用方法:

按需求将其插件文件夹复制到node_modules/tinymce/plugins文件夹下,再到组件中引用,如

```js
import '@npkg/tinymce-plugins/importword' 
import '@npkg/tinymce-plugins/lineheight' 
import '@npkg/tinymce-plugins/layout' 
...
```

