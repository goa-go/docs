---
home: true
actionText: Get Started →
actionLink: /docs/
features:
- title: Light
  details: Small size, clean and concise, no middleware binding.
- title: Flexible
  details: Goa can easily extend functionality through middleware.
- title: Performant
  details: Built-in context pool, performance and memory optimization, router based on secondary development of httprouter.
footer: Copyright © 2019-present Nicholas Cao
---

## Installation
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
