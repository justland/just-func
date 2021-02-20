# just-func

`just-func` is just a functional programming language.

It is homoiconic and implementation independent.

This means it can be used to capture logic that shared across multiple programming lanaguages.

Its typical use case is to define the logic in data or some markup langauge,
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
      handler: [str, "welcome to just-func, ", [param/get, name]]
```

## Using just-func

Languages supporting `just-func` will provide a parser and other tools to enable further processing.

For example, the following code uses the `Compiler` to handle the call in PHP:

```php
use /JustLand/JustFunc/Compiler;

class HelloRoute
{
  /**
   * @var Compiler
   **/
  private $compiler;
  
  public function __construct()
  {
    $this->compiler = new Compiler([
      "param/get" => function ($name) { return $_REQUEST[$name]; }
    ]);
  }
  public function execute()
  {  
    return $this->compiler->execute('[str, "welcome to just-func, ", [param/get, name]]');
  }
}
```
