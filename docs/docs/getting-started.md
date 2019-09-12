# Quickstart
Package management tools recommend go modules.

Create your project folder and cd inside:
```bash
$ mkdir example && cd example
$ go mod init example
```

## Installation
```bash
$ go get -u github.com/goa-go/goa
```

## Getting Started
First, create a file called `main.go`:

```bash
$ touch main.go
```

Next, put the following code inside of `main.go`:
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

And, You can run the code via `go run main.go`:

```bash
# run main.go
# visit http://127.0.0.1:3000 on browser
$ go run main.go
```
