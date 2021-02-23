# just-func

`just-func` is just a functional programming language.

It is homoiconic and implementation independent.

This means it can be used to capture logic that shared across multiple programming languages.

Its typical use case is to define the logic in data or some markup language,
the logic can then be used in runtime or code generation in various programming languages.

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

## install - PHP

This package is distributed as `justland/just-func-schema` on `composer`.

```sh
composer require justland/just-func-schema
```

It comes with some helper functions you can use to update the schema for your application (as currently the schema is not added to `schemastore.org` and requires json-schema 2020-12 to be fully functional).

```jsonc
// composer.json
{
  "scripts": {
    "update-json-func-schema": "justland\\just-func-schema\\Composer::copySchema"
  }
}
```
