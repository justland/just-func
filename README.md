# just-func

`just-func` is just a functional programming language.

It is homoiconic and implementation independent.

This means it can be used to capture logic that shared across multiple programming languages.

Its typical use case is to define the logic in data or some markup language,
and then the logic can be used in runtime or for code generation in various programming languages.

Here is an hello world example for REST API:

```yml
paths:
  /hello:
    get:
      parameters:
        - name:
          type: string,
          required: true
      # handler is defined using `just-func`
      handler: [str, "welcome to just-func, ", [param/get, name]]
```

## Using just-func

Languages supporting `just-func` will provide a parser and other tools to enable further processing.

For example, the following code uses the `Interpreter` to handle the call in PHP:

```php
use /JustLand/JustFunc/Interpreter;

class HelloRoute
{
  /**
   * @var Interpreter
   **/
  private $interpreter;

  public function __construct()
  {
    $this->interpreter = new Interpreter([
      "param/get" => function ($name) { return $_REQUEST[$name]; }
    ]);
  }
  public function execute()
  {
    return $this->interpreter->execute('[str, "welcome to just-func, ", [param/get, name]]');
  }
}
```

## What's in this repository

This repository contains the official spec of the `just-func` language.
