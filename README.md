# Vscode extension downloader
此分支仅用于托管静态网页。  
## 开发
使用main作为开发分支，product作为发布分支。  
dist中的源码由构建系统生成，并无什么意义，然而需要分支中有源文件，因此出此下策。
```shell
# 主分支开发好后，执行构建
pnpm build
# 切换到 product 分支
git switch product

# powershell 的 rm 命令比较残废，使用 rimraf 替代
rimraf index.html static/
mv dist/* .

# 后续推送到远程
git add .
git commit -m "update: 发布新版本"
git push origin product
```

```pwsh
rm -fo -r .\index.html , .\static\
```