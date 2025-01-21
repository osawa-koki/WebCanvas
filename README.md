# WebCanvas

💱💱💱 ブラウザ上で動作する簡単なお絵かきツールです！  

## 実行方法

DevContainerに入り、以下のコマンドを実行してください。  

```bash
npm run build
npm run server
```

もしくは、Dockerfileを使用しても実行できます。  

```bash
docker build -t webcanvas .
docker run --rm -d -p 8000:8000 --name my-webcanvas webcanvas
```
