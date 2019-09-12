# 上下文(Context)

::: tip 🔖
Context将net/http的`*Request`和`ResponseWriter`对象及其对应的方法封装到单个对象中，方便调用处理请求和响应的方法。
:::
## Field
名字 | 类型 | 描述
- | - | -
Request | *http.Request | 原生net/http的 *Request对象
ResponseWriter | http.ResponseWriter | 原生net/http的ResponseWriter对象
Method | string | http请求方式
URL | *url.URL | http请求的URL对象
Path | string | http请求的路径
Header | http.Header | http请求头部
Keys | map[string]interface{} | 主要用于中间件之间数据传递，通过[Get](#get)、[Set](#set)方法使用
Handled | bool | 是否绕过goa的响应处理

## Next
`Next()` 用于调用下一个中间件。

不同于koajs，Next方法写在了Context对象中，koajs的next()实际上是dispatch(i + 1)，我们这样做的好处是可以节省dispatch函数传递带来的内存占用，更加高效的同时也可以让代码更加简洁。

```go
// next() 这种方法在v0.4.0移除
app.Use(func(c *goa.Context, next func()) {
  // do sth
  next()
  // do sth
})

// c.Next()
app.Use(func(c *goa.Context) {
  // do sth
  c.Next()
  // do sth
})
```

当应用程序中绑定了多个中间件，除了最后一个中间件，`c.Next()`是必须调用的，否则goa只会执行第一个中间件。

```go
app.Use(func(c *goa.Context) {
  fmt.Println(1)
  c.Next()
  fmt.Println(6)
})
app.Use(func(c *goa.Context) {
  fmt.Println(2)
  c.Next()
  fmt.Println(5)
})
app.Use(func(c *goa.Context) {
  fmt.Println(3)
  //c.Next() 此处可以省略c.Next()
  fmt.Println(4)
})
```

::: tip
如果这是你第一次接触中间件，查看更多关于[中间件](/zh/docs/middleware.html)。
:::

## Set
`Set(key string, value interface{})` 设定Keys。

## Get
`Get(key string) (value interface{}, exists bool)` 获取指定Keys。

```go
c.Set("key", "value")
value := c.Get("key").(string)
```

## Query
`Query(key string) (value string)` 获取query指定key的value，若key不存在则返回""。

若Query复杂或需要类型转换，推荐使用[ParseQuery](#parsequery)。

## GetQuery
`GetQuery(key string) (value string, exists bool)` 同[Query](#query), 额外返回是否存在。

## GetQueryArray
`GetQueryArray(key string) ((value []string, exists bool)` 获取query指定key的value数组和是否存在。

## PostForm
`PostForm(key string) (value string)` 获取query指定key的value，若key不存在则返回""。

若form复杂或需要类型转换，推荐使用[ParseForm](#parseform)。

## Param
`Param(key string) (value string)` 获取路由中的参数，若不存在则返回""。

需配合[router](https://github.com/goa-go/router)或其他路由中间件使用:

```go
r := router.New()
r.GET("/example/:key", func(c *goa.Context) {
  key := c.Param("key")
  ...
})
```

## ParseJSON
`ParseJSON(pointer interface{}) error` 解析请求body中的json，pointer必须为指针。

```go
type obj struct {
  Key string `json:"key"`
}
p := &obj{}
c.ParseJSON(p)
...
```

还可以通过goa.M使用，实际上goa.M只是`map[string]interface{}`

```go
c.ParseJSON(goa.M{
  "key": "value",
})
```

## ParseXML
`ParseXML(pointer interface{}) error` 解析请求body中的xml。同[ParseJSON](#parsejson)。

## ParseString
`ParseString() (string, error)` 读取请求的body。

## ParseQuery
`ParseQuery(pointer interface{}) error` 解析Query为结构体。若需要使用tag，tag名为query。

```go
type Person struct {
	Name    string `query:"name"`
  Age     int    `query:"age"`
  Married bool   `query:"-"` // "-"为忽略
}

p := &Person{}
c.ParseQuery(p)
```

## ParseForm
`ParseForm(pointer interface{}) error` 解析form为结构体，标签名为form。同[ParseQuery](#parsequery)。

## Status
`Status(code int)` 设置http状态码。

当没设定状态码时，若正常响应，则会自动设定为200，否则默认为404。

## GetStatus
`GetStatus() (code int)` 获取当前设定的状态码，不一定是最后响应的状态码， 
再次设定状态码或者 `c.Error(...)` 都可以改变最后响应的状态码。

## JSON
`JSON(json interface{})` 响应json数据，会自动响应200状态码、自动设置http响应头部的`Content-Type`，以下不再赘述。

```go
type obj struct {
  Key string `json:"key"`
}
p := Person{
  Key: "value",
}
c.JSON(p)
```

## XML
`XML(xml interface{})` 响应xml数据。

### String
`String(str string)` 响应字符串。

## HTML
`HTML(html string)` 响应html。

## Redirect
`Redirect(code int, url string)` 重定向，会绕过goa的响应处理。

## SetHeader
`SetHeader(key string, value string)` 设置http响应头部。

## Error
`Error(code int, msg string)` 抛出http错误，并且会被goa捕捉来响应错误。

```go
c.Error(500, http.StatusText(500))
// 在这之后的操作都会跳过
c.Status(200) // 这不会起作用。
c.String("Hello World") // 这也不会起作用。
```

