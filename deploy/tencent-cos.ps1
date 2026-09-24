[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Bucket,

    [Parameter(Mandatory = $true)]
    [string]$Region,

    [string]$SecretId = $env:COS_SECRET_ID,
    [string]$SecretKey = $env:COS_SECRET_KEY,

    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command coscmd -ErrorAction SilentlyContinue)) {
    throw "coscmd 未安装。请先运行：python -m pip install coscmd"
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$textFiles = @("index.html", "style.css", "script.js", "404.html", "robots.txt")
$textCacheHeader = "Cache-Control: no-cache"
$imageCacheHeader = "Cache-Control: public, max-age=86400"

Write-Host "准备上传到 cos://$Bucket ($Region)" -ForegroundColor Cyan
Write-Host "项目目录：$projectRoot"

if ($DryRun) {
    Write-Host "DryRun：以下操作未实际执行。" -ForegroundColor Yellow
    foreach ($file in $textFiles) {
        Write-Host "coscmd upload -s -y -H `"$textCacheHeader`" $file /"
    }
    Write-Host "coscmd upload -r -s -y -H `"$imageCacheHeader`" images /images"
    return
}

if ([string]::IsNullOrWhiteSpace($SecretId)) {
    $SecretId = Read-Host "请输入腾讯云 SecretId"
}

if ([string]::IsNullOrWhiteSpace($SecretKey)) {
    $secureKey = Read-Host "请输入腾讯云 SecretKey" -AsSecureString
    $secretPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
    try {
        $SecretKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secretPointer)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretPointer)
    }
}

coscmd config -a $SecretId -s $SecretKey -b $Bucket -r $Region

Push-Location $projectRoot
try {
    foreach ($file in $textFiles) {
        $absolutePath = Join-Path $projectRoot $file
        if (Test-Path -LiteralPath $absolutePath) {
            coscmd upload -s -y -H $textCacheHeader $file /
            if ($LASTEXITCODE -ne 0) {
                throw "上传失败：$file"
            }
        }
    }

    coscmd upload -r -s -y -H $imageCacheHeader images /images
    if ($LASTEXITCODE -ne 0) {
        throw "图片目录上传失败。"
    }
}
finally {
    Pop-Location
}

Write-Host "上传完成。请检查腾讯云 COS 静态网站访问地址。" -ForegroundColor Green