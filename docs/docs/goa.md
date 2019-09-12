# Application(Goa)

::: tip 🔖
A goa application is an object that contains a set of middlewares that are executed in a stack-like manner.
:::

## Use
Applications can easily extend functionality through middleware, like this:

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
The Use method is to bind the middleware to the goa instance, here we use a custom logging middleware.

::: tip
If this is your first exposure to middleware, view more about [middleware](/docs/middleware.html).
:::

Multiple middleware cascades:

```go
app := goa.New()
router := router.New()
app.Use(logger.New())
app.Use(jwt.New())
app.Use(router.Routes())
...
```

## Listen
The Listen method is used to start the server.

The following is a useless goa application bound to port 3000:

```go
app := goa.New()
app.Listen(":3000")
```

Actually Listen is just syntactic sugar for the following methods:

```go
app := goa.New()
http.ListenAndServe(":3000", app)
```

This means that you can run the same application on different ports at the same time.

```go
app := goa.New()
go func() {
  http.ListenAndServe(":3000", app)
}()
http.ListenAndServe(":3001", app)
```

## ServeHttp
ServeHTTP makes the app implement the http.Handler interface.
ServeHttp can also be used for testing.

```go
app := goa.New()
req, _ := http.NewRequest("GET", "/", nil)
w := httptest.NewRecorder()
app.ServeHTTP(w, req)
```
