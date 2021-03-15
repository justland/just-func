# just-func

`just-func` is just a functional programming language written in JSON.

It is homoiconic and implementation independent.

This mean it can be written in `JSON`, `YAML`, or other media that can be translate to simple JSON.

It can be used to capture logic that shared across multiple programming languages.

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

- [`just-func` language schema](schema/draft-07/schema.jsonc)
- [`just-func` handbook](docs/just-func-handbook/README.md) for programmers
- [`just-func` specification](docs/just-func-specification/README.md) for language programmers
- [`just-func` specs](schema-specs/README.md) that is used to validate implementations

This repository is distributed in package manager of various languages so they can be used to provide:

- IDE support by the use of language schema
- Program validation by the use of language schema
- Language implementation validation by the use of specs

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

## Contribute

```sh
# install TypeScript dependencies
# TypeScript code are used for testing
yarn

# validate specs in the `schema-specs` folder
yarn validate:specs
```
