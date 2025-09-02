# Vscode extension downloader
此分支仅用于托管静态网页。  
## 开发
使用main作为开发分支，product作为发布分支。  
dist中的源码由构建系统生成，并无什么意义，然而需要分支中有源文件，因此出此下策。
```pwsh
# 主分支开发好后，执行构建
pnpm build
# 由于开发分支忽略了dist目录，因此切换时会直接带过来。  
git switch product
git checkout main -- dist
# 将dist目录中的内容移动到根目录，并删除dist目录
rimraf static/ index.html
mv dist/* ./
```