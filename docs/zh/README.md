---
home: true
actionText: 快速上手 →
actionLink: /zh/docs/
features:
- title: 轻量
  details: 体积小，干净简洁，不绑定任何中间件。
- title: 灵活
  details: Goa可以通过中间件方便地扩展功能。
- title: 高效
  details: 内置context变量池、性能和内存优化，路由基于httprouter二次开发。
footer: Copyright © 2019-present Nicholas Cao
---

## 安装
```bash
$ go get -u github.com/goa-go/go
```

## Hello World
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
