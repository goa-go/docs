# 快速上手
包管理工具推荐使用go modules。

创建项目文件夹并进入文件夹:
```bash
$ mkdir example && cd example
$ go mod init example
```

## 安装
```bash
$ go get -u github.com/goa-go/goa
```

## 入门
首先，创建一个名为`main.go`的文件：
```bash
$ touch main.go
```
接下来，将以下代码放在`main.go`：
```go
package main

import (
  "log"

  "github.com/goa-go/goa"
)

func main() {
  app := goa.New()
  app.Use(func(c *goa.Context) {
    c.String("Hello World!")
  })
  log.Fatal(app.Listen(":3000"))
}
```
之后，您可以通过`go run main.go`来运行代码：

```bash
# 运行main.go
# 在浏览器上访问http://127.0.0.1:3000
$ go run main.go
```
