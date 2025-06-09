# Vscode extension downloader
简单纯粹的vscode插件下载网站。  
https://vsc-extension.dreamsoul.cn/  

## 开发
使用main作为开发分支，product作为发布分支。  
dist中的源码由构建系统生成，并无什么意义，然而需要分支中有源文件，因此出此下策。
```shell
# 主分支开发好后，执行构建
pnpm build
# 需要手动修改dist/index.html中的标题为`vsc插件下载`
# 切换到product分支
git switch product
# powershell的rm命令比较残废，使用rimraf替代
rimraf index.html static/
mv dist/* .
# 后续推送到远程
```