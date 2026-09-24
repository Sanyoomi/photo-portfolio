# 腾讯云 COS 静态网站部署

这套方案把摄影网站发布到中国大陆地区的腾讯云 COS，减少 GitHub Pages
国际线路带来的访问延迟。

## 一、准备腾讯云

1. 注册并登录腾讯云。
2. 完成个人实名认证。
3. 搜索并进入 **对象存储 COS**。
4. 创建一个存储桶，例如：

```text
photo-portfolio
```

5. 地域建议选择离访问者较近的地区，例如：

```text
ap-shanghai
ap-guangzhou
ap-beijing
```

6. 访问权限建议先设为：
   - 仅用于测试：私有读写，通过 CDN 回源；
   - 直接使用 COS 静态网站：公有读私有写。

不要选择公有读写，否则任何人都可能向你的存储桶上传文件。

## 二、开启静态网站

进入存储桶：

```text
基础配置 → 静态网站
```

开启后设置：

```text
索引文档：index.html
错误文档：404.html
```

保存后会获得一个静态网站访问地址。可以先用该地址测试。

## 三、配置密钥

进入腾讯云：

```text
访问管理 CAM → API 密钥管理
```

创建 API 密钥后，你会得到：

- `SecretId`
- `SecretKey`

不要把密钥写入代码、README 或 GitHub。部署脚本会安全地提示输入。

## 四、上传网站

本机已经安装 `coscmd`。在项目根目录运行：

```powershell
.\deploy\tencent-cos.ps1 -Bucket "你的存储桶名称" -Region "ap-shanghai"
```

如果只想检查命令而不上传：

```powershell
.\deploy\tencent-cos.ps1 -Bucket "photo-portfolio" -Region "ap-shanghai" -DryRun
```

也可以先通过环境变量提供密钥：

```powershell
$env:COS_SECRET_ID = "你的 SecretId"
$env:COS_SECRET_KEY = "你的 SecretKey"
.\deploy\tencent-cos.ps1 -Bucket "你的存储桶名称" -Region "ap-shanghai"
Remove-Item Env:COS_SECRET_ID
Remove-Item Env:COS_SECRET_KEY
```

不要把真实密钥提交到 Git。

## 五、缓存建议

当前脚本使用：

```text
HTML/CSS/JS：Cache-Control: no-cache
图片：Cache-Control: public, max-age=86400
```

这样修改网页后能较快看到新版本，同时图片可以被浏览器缓存一天。

## 六、自定义域名和 CDN

如果只使用 COS 默认访问地址，可以先不上 CDN。

如果希望使用自己的域名，例如：

```text
photos.example.com
```

需要：

1. 购买域名；
2. 在中国大陆使用 CDN 通常需要完成 ICP 备案；
3. 在腾讯云 CDN 添加加速域名；
4. 回源到 COS 静态网站源站；
5. 配置 HTTPS 证书；
6. 将 DNS 解析到 CDN 提供的 CNAME。

备案、CDN 和流量可能产生费用，具体以腾讯云控制台的最新价格为准。

## 七、日常发布流程

```powershell
# 本地修改并预览

git add .
git commit -m "Update photography portfolio"
git push

# 发布到国内静态网站
.\deploy\tencent-cos.ps1 -Bucket "你的存储桶名称" -Region "ap-shanghai"
```

GitHub 继续保存源代码，腾讯云 COS 负责国内快速访问。