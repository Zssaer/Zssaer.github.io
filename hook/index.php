<?php
// 这里只是最简单的拉取代码，若是要作更加多的操做，如验证、日志，请本身解析push内容并操做

// 获取push数据内容的方法
$requestBody = file_get_contents("php://input");

// 只需这一行代码即可拉取
shell_exec("cd /home/ubuntu/zssaer/html && git pull"); // 目录换成项目的目录

?>