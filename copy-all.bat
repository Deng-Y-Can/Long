@echo off
cd /d "e:\Test\web\githubdemo\Long\MainFunction\实用工具"
echo 开始复制文件...
copy /y "..\..\Page\工具\calculator.html" "科学计算器.html" >nul && echo OK: 科学计算器.html
copy /y "..\..\Page\工具\二进制查看器\index.html" "二进制查看器.html" >nul && echo OK: 二进制查看器.html
copy /y "..\..\Page\工具\图层编辑器\index.html" "图层编辑器.html" >nul && echo OK: 图层编辑器.html
copy /y "..\..\Page\工具\图层编辑器\index2.html" "图层编辑高级模式.html" >nul && echo OK: 图层编辑高级模式.html
copy /y "..\..\Page\工具\思维导图\index.html" "思维导图工具.html" >nul && echo OK: 思维导图工具.html
copy /y "..\..\Page\工具\摩斯密码\index.html" "摩斯密码编解码.html" >nul && echo OK: 摩斯密码编解码.html
copy /y "..\..\Page\工具\文本处理工具\index.html" "文本处理工具.html" >nul && echo OK: 文本处理工具.html
copy /y "..\..\Page\工具\时钟\index.html" "时钟显示工具.html" >nul && echo OK: 时钟显示工具.html
copy /y "..\..\Page\工具\测量工具\index.html" "测量工具.html" >nul && echo OK: 测量工具.html
copy /y "..\..\Page\工具\测量工具\index2.html" "测量工具高级版.html" >nul && echo OK: 测量工具高级版.html
copy /y "..\..\Page\工具\笔记宝\index.html" "笔记宝.html" >nul && echo OK: 笔记宝.html
copy /y "..\..\Page\工具\符号与特殊字符大全\index.html" "符号与特殊字符大全.html" >nul && echo OK: 符号与特殊字符大全.html
copy /y "..\..\Page\工具\系统监控仪表板\index.html" "系统监控仪表板.html" >nul && echo OK: 系统监控仪表板.html
copy /y "..\..\Page\工具\钢琴\index.html" "虚拟钢琴.html" >nul && echo OK: 虚拟钢琴.html
echo.
echo === 全部复制完成！===
echo.
dir /b *.html
