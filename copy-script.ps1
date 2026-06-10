# 源文件到目标文件的映射
$fileMappings = @(
    @{ Source = "Page\工具\calculator.html"; Target = "MainFunction\实用工具\科学计算器.html" },
    @{ Source = "Page\工具\二进制查看器\index.html"; Target = "MainFunction\实用工具\二进制查看器.html" },
    @{ Source = "Page\工具\图层编辑器\index.html"; Target = "MainFunction\实用工具\图层编辑器.html" },
    @{ Source = "Page\工具\图层编辑器\index2.html"; Target = "MainFunction\实用工具\图层编辑高级模式.html" },
    @{ Source = "Page\工具\思维导图\index.html"; Target = "MainFunction\实用工具\思维导图工具.html" },
    @{ Source = "Page\工具\摩斯密码\index.html"; Target = "MainFunction\实用工具\摩斯密码编解码.html" },
    @{ Source = "Page\工具\文本处理工具\index.html"; Target = "MainFunction\实用工具\文本处理工具.html" },
    @{ Source = "Page\工具\时钟\index.html"; Target = "MainFunction\实用工具\时钟显示工具.html" },
    @{ Source = "Page\工具\测量工具\index.html"; Target = "MainFunction\实用工具\测量工具.html" },
    @{ Source = "Page\工具\测量工具\index2.html"; Target = "MainFunction\实用工具\测量工具高级版.html" },
    @{ Source = "Page\工具\笔记宝\index.html"; Target = "MainFunction\实用工具\笔记宝.html" },
    @{ Source = "Page\工具\符号与特殊字符大全\index.html"; Target = "MainFunction\实用工具\符号与特殊字符大全.html" },
    @{ Source = "Page\工具\系统监控仪表板\index.html"; Target = "MainFunction\实用工具\系统监控仪表板.html" },
    @{ Source = "Page\工具\钢琴\index.html"; Target = "MainFunction\实用工具\虚拟钢琴.html" }
)

$baseDir = "e:\Test\web\githubdemo\Long"
$targetDir = Join-Path $baseDir "MainFunction\实用工具"

# 确保目标目录存在
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    Write-Host "已创建目录: $targetDir"
}

$completed = 0
$total = $fileMappings.Count

foreach ($mapping in $fileMappings) {
    $sourcePath = Join-Path $baseDir $mapping.Source
    $targetPath = Join-Path $baseDir $mapping.Target
    
    if (Test-Path $sourcePath) {
        # 复制文件
        Copy-Item -Path $sourcePath -Destination $targetPath -Force
        $completed++
        Write-Host "[$completed/$total] 已复制: $($mapping.Source) -> $($mapping.Target)"
    } else {
        Write-Host "[$completed/$total] 警告: 源文件不存在: $sourcePath" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "复制完成！共处理 $completed/$total 个文件"
Write-Host "========================================"

# 检查文件中的相对路径引用
Write-Host ""
Write-Host "开始检查相对路径引用..."
Write-Host ""

# 定义需要检查的模式：src=, href=, fetch(, XMLHttpRequest, url(, @import, background-image: 等
$patterns = @(
    '(?i)src\s*=\s*["'']([^"'']+)["'']',
    '(?i)href\s*=\s*["'']([^"'']+)["'']',
    '(?i)fetch\s*\(\s*["'']([^"'']+)["'']',
    '(?i)XMLHttpRequest[^)]*["'']([^"'']+)["'']',
    '(?i)url\s*\(\s*["'']?([^"'')]+)["'']?\s*\)',
    '(?i)@import\s+["'']([^"'']+)["'']',
    '(?i)background-image\s*:\s*url\s*\(\s*["'']?([^"'')]+)["'']?\s*\)'
)

$processedFiles = @()
$findings = @()

foreach ($mapping in $fileMappings) {
    $targetPath = Join-Path $baseDir $mapping.Target
    $fileName = Split-Path $targetPath -Leaf
    
    if (-not (Test-Path $targetPath)) { continue }
    
    $content = Get-Content $targetPath -Raw -Encoding UTF8
    $hasIssues = $false
    $fileFindings = @()
    
    foreach ($pattern in $patterns) {
        $matches = [regex]::Matches($content, $pattern)
        foreach ($match in $matches) {
            if ($match.Groups.Count -ge 2) {
                $url = $match.Groups[1].Value
                
                # 过滤掉：绝对路径(http/https/data:), 纯CSS类名, 空值
                if ($url -match '^(https?:|data:|about:|javascript:|ftp:|#)' -or 
                    [string]::IsNullOrWhiteSpace($url) -or
                    $url.StartsWith('//') -or
                    $url -match '^\s*$') {
                    continue
                }
                
                # 标记：包含相对路径引用的（不以/开头但包含.或/的）
                if ($url -match '(\.\.?[/\\]|[a-zA-Z0-9_-]+\.(html|css|js|png|jpg|jpeg|gif|svg|ico|woff|ttf))' -and 
                    -not $url.StartsWith('/')) {
                    $hasIssues = $true
                    $fileFindings += "  * $url"
                }
            }
        }
    }
    
    if ($hasIssues) {
        $processedFiles += $fileName
        $findings += "文件: $fileName"
        $findings += $fileFindings
        $findings += ""
    }
}

Write-Host "检查完成！"
if ($findings.Count -gt 0) {
    Write-Host ""
    Write-Host "发现以下相对路径引用:"
    Write-Host "----------------------------------------"
    $findings | ForEach-Object { Write-Host $_ }
} else {
    Write-Host "未发现需要更新的相对路径引用（所有引用都是外部 CDN 或绝对路径）"
}

Write-Host ""
Write-Host "处理的文件列表:"
$processedFiles | ForEach-Object { Write-Host "  - $_" }
