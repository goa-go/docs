# Context

::: tip 🔖
Context encapsulates the `*Request` and the `ResponseWriter` of net/http and its corresponding methods into a single object to facilitate the invocation of methods for  handling requests and responses.
:::
## Field
Name | Type | Description
- | - | -
Request | *http.Request | The *Request object of native net/http
ResponseWriter | http.ResponseWriter | The *ResponseWriter object of native net/http
Method | string | Method of http request method
URL | *url.URL | URL object for http request
Path | string | Path of http request
Header | http.Header | Headed of http request
Keys | map[string]interface{} | Mainly used for data transfer between middlewares, use it by [Get](#get) and [Set](#set)
Handled | bool | Whether to bypass goa's response handling

## Next
`Next()` 
Used to call the next middleware.

Unlike koajs, the Next method is written in the Context object. The next () of koajs is actually dispatch(i+1). The advantage of doing so is that we can save the memory occupied by the transfer parameters of dispatch function, and make the code more efficient and concise.

```go
// next() this method is removed in v0.4.0
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

When multiple middleware are bound in an application, `c.Next()` must be invoked except for the last middleware, otherwise Goa will only execute the first middleware.

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
If this is your first exposure to middleware, view more about [middleware](/docs/middleware.html).
:::

## Set
`Set(key string, value interface{})` Set Keys.

## Get
`Get(key string) (value interface{}, exists bool)` Get the specified Keys.

```go
c.Set("key", "value")
value := c.Get("key").(string)
```

## Query
`Query(key string) (value string)` Get the value of the query specified key, and return "" if the key does not exist.

If Query is complex or requires type conversion, it is recommended to use [ParseQuery](#parsequery).

## GetQuery
`GetQuery(key string) (value string, exists bool)` Same as [Query](#query), extra return whether it exists.

## GetQueryArray
`GetQueryArray(key string) ((value []string, exists bool)` Get the value array of the query specified key and whether it exists.

## PostForm
`PostForm(key string) (value string)` Get the value of the specified key in the form, and returns "" if the key does not exist.

If form is complex or requires type conversion, it is recommended to use [ParseForm](#parseform).

## Param
`Param(key string) (value string)` Get the parameters in the router and returns "" if they do not exist.

It should be used with [router](https://github.com/goa-go/router) or other routing middleware:

```go
r := router.New()
r.GET("/example/:key", func(c *goa.Context) {
  key := c.Param("key")
  ...
})
```

## ParseJSON
`ParseJSON(pointer interface{}) error` Parse JSON in the request body, the parameter must be a pointer.

```go
type obj struct {
  Key string `json:"key"`
}
p := &obj{}
c.ParseJSON(p)
...
```

You can also use `goa.M`, which is actually just `map[string]interface{}`

```go
c.ParseJSON(goa.M{
  "key": "value",
})
```

## ParseXML
`ParseXML(pointer interface{}) error` Parse XML in the request body, the parameter must be a pointer. Same as [ParseJSON](#parsejson).

## ParseString
`ParseString() (string, error)` Read the body of the request..

## ParseQuery
`ParseQuery(pointer interface{}) error` Parse Query as a struct. If you need to use tags, the tag name is query.

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
`ParseForm(pointer interface{}) error` Parse Query as a struct. If you need to use tags, the tag name is query. Same as [ParseQuery](#parsequery).

## Cookie
`Cookie(name string) (string, error)` Cookie returns the named cookie provided in the request or `ErrNoCookie` if not found.

## SetCookie
`SetCookie(cookie *http.Cookie)` SetCookie adds a Set-Cookie header to the ResponseWriter's headers, require `http` package.

```go
  c.SetCookie(&http.Cookie{
    Name:     "user",
    Value:    "goa",
    MaxAge:   1,
    Path:     "/",
    Domain:   "localhost",
    Secure:   true,
    HttpOnly: true,
  })
```

## Status
`Status(code int)` Set the HTTP status code.

When the status code is not set, if the normal response is set to 200 automatically, otherwise the default is 404.

## GetStatus
`GetStatus() (code int)` Get the current set state code is not necessarily the final response state code.

Set the state code again or `c.Error(...)` can change the state code of the final response.

## JSON
`JSON(json interface{})` Respond JSON data, it automatically sets status code as 200 and automatically sets the `Content-Type` of the HTTP response header, the following will not be repeated.

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
`XML(xml interface{})` Respond XML data.

### String
`String(str string)` Respond string.

## HTML
`HTML(html string)` Respond html.

## Redirect
`Redirect(code int, url string)` Redirect, and bypasses goa's response handling.

## SetHeader
`SetHeader(key string, value string)` Set the HTTP response header.

## Error
`Error(code int, msg string)` An HTTP error is thrown and captured by Goa in response to the error.

```go
c.Error(500, http.StatusText(500))
// All subsequent operations will be skipped.
c.Status(200) // It doesn't work.
c.String("Hello World") // It doesn't work, too.
```
