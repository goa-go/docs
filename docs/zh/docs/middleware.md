# 中间件
## 概念
::: tip
Goa的中间件是指贯穿整个 Goa 后端应用程序，并共享上下文的独立插件。
:::

应当清楚的是 Goa 的所有功能都是通过中间件来实现的，如果你的应用程序没有绑定任何中间件，那么你的应用程序是没有任何作用的。

### 图解中间件
![middleware](/middleware.png)

可以看到goa的中间件是类似堆栈的形式执行的，另外值得一提的是，goa的响应处理是在所有中间件执行完之后统一处理的。

```go
app.Use(func(c *goa.Context) {
  fmt.Pritln(1)
  c.Next()
  fmt.Println(6)
})
app.Use(func(c *goa.Context) {
  fmt.Pritln(2)
  c.Next()
  fmt.Println(5)
})
app.Use(func(c *goa.Context) {
  fmt.Pritln(3)
  c.Next() // 当在最后一个中间件时，这不是必须的。
  fmt.Println(4)
})
```

以上程序将会依次输出1、2、3、4、5、6。

## 示例
```go
r.GET("/", func(c *goa.Context) {
  c.String("Hello World")
})

app.Use(logger.New())
app.Use(jwt.New(...))
app.Use(r.Routes())
```

这里使用了日志、jwt、路由三个中间件。

上下文Context将依次经过logger -> jwt -> router -> jwt -> logger。

## 开发中间件
开发中间件我们给出以下推荐做法：

```go
type Config struct {
  ...
}

func New(Config) goa.Middleware {
  // 处理参数或者初始化
  return func(c *Context) {
    // ...
  }
}

// 使用
app.Use(XXX.New(...))
```

我们建议使用这种闭包的做法来提高性能，当然参数不是必须的，实际的开发应当结合实际情况，不强制使用这一种开发模式。

## AWESOME
### 官方中间件
- [router](https://github.com/goa-go/router): 基于httprouter的goa路由中间件。
- [logger](https://github.com/goa-go/logger): 简易的日志中间件。
- [jwt](https://github.com/goa-go/jwt): jsonwebtoken鉴权中间件。
