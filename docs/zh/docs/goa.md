# 应用程序(Goa)

::: tip
Goa应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组来执行的。
:::

## Use
应用程序可以通过中间件轻易地扩展功能，就像这样：

```go
func logger(c *goa.Context) {
  start := time.Now()

  fmt.Printf(
    "[%s] <-- %s %s\n",
    start.Format("2006-01-02 15:04:05"),
    c.Method,
    c.URL,
  )
  c.Next()
  fmt.Printf(
    "[%s] --> %s %s %d %s\n",
    time.Now().Format("2006-01-02 15:04:05"),
    c.Method,
    c.URL,
    time.Since(start).Nanoseconds()/1e6,
    "ms",
  )
}

func main() {
  app := goa.New()

  app.Use(logger)
  ...
  log.Fatal(app.Listen(":3000"))
}
```
Use方法是将中间件绑定在goa实例上，这里我们就使用了自定义的日志中间件。

::: tip
如果这是你第一次接触中间件，查看更多关于[中间件](/zh/docs/middleware.html)。
:::

多个中间件级联：

```go
app := goa.New()
router := router.New()
app.Use(logger.New())
app.Use(jwt.New())
app.Use(router.Routes())
...
```

## Listen
Listen方法用于启动服务器。

以下是一个无作用的 Goa 应用程序被绑定到 3000 端口:

```go
app := goa.New()
app.Listen(":3000")
```

实际上Listen只是以下方法的语法糖:

```go
app := goa.New()
http.ListenAndServe(":3000", app)
```

这意味着你可以将同一应用程序同时跑在不同端口。

```go
app := goa.New()
go func() {
  http.ListenAndServe(":3000", app)
}()
http.ListenAndServe(":3001", app)
```

## ServeHttp
ServeHttp使app实现http.Handler接口。
ServeHttp也可用作测试。

```go
app := goa.New()
req, _ := http.NewRequest("GET", "/", nil)
w := httptest.NewRecorder()
app.ServeHTTP(w, req)
```
