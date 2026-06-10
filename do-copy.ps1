$ErrorActionPreference = 'Stop'
$dst = 'e:\Test\web\githubdemo\Long\MainFunction\实用工具'
$src = 'e:\Test\web\githubdemo\Long\Page\工具'
Write-Host 'Starting copy...' -ForegroundColor Green
$files = @(
    @('calculator.html', '科学计算器.html'),
    @('二进制查看器\index.html', '二进制查看器.html'),
    @('图层编辑器\index.html', '图层编辑器.html'),
    @('图层编辑器\index2.html', '图层编辑高级模式.html'),
    @('思维导图\index.html', '思维导图工具.html'),
    @('摩斯密码\index.html', '摩斯密码编解码.html'),
    @('文本处理工具\index.html', '文本处理工具.html'),
    @('时钟\index.html', '时钟显示工具.html'),
    @('测量工具\index.html', '测量工具.html'),
    @('测量工具\index2.html', '测量工具高级版.html'),
    @('笔记宝\index.html', '笔记宝.html'),
    @('符号与特殊字符大全\index.html', '符号与特殊字符大全.html'),
    @('系统监控仪表板\index.html', '系统监控仪表板.html'),
    @('钢琴\index.html', '虚拟钢琴.html')
)
$count = 0
foreach ($f in $files) {
    $s = Join-Path $src $f[0]
    $d = Join-Path $dst $f[1]
    if (Test-Path $s) {
        Copy-Item $s $d -Force
        $count++
        Write-Host "$count OK: $($f[1])" -ForegroundColor Cyan
    } else {
        Write-Host "MISSING: $($f[0])" -ForegroundColor Red
    }
}
Write-Host ""
Write-Host "=== Copied $count files ===" -ForegroundColor Green
Write-Host ""
Get-ChildItem $dst | ForEach-Object { Write-Host $_.Name }
