# just-func grammar <!-- omit in toc -->

`just-func` is not a programming language if it does not have a formal grammar.

So here is where you can find that formal grammar.
The purpose is to create a clear specification of the language.

We understand that formal grammar can sometimes be hard to read and can be very boring.
We will try to bring it as close to humanly readable as possible and provide ample explanation and examples along the way.

- [Notation](#notation)
- [Grammar](#grammar)
  - [Expression](#expression)
  - [Literal](#literal)
    - [Number](#number)
    - [Object](#object)
  - [Variable](#variable)
  - [Special](#special)
    - [fn](#fn)
    - [let](#let)
    - [if](#if)
    - [match](#match)
    - [eval](#eval)
    - [partial](#partial)
    - [lambda](#lambda)
  - [Type](#type)
    - [List](#list)
  - [doc (WIP)](#doc-wip)
  - [Common BNF](#common-bnf)
- [Reserved keywords](#reserved-keywords)

## Notation

The Formal Grammar in this document is given using a customized Extended Backus-Naur Form notation (EBNF) notation.
The notation is similar to [`json-schema`](https://cswr.github.io/JsonSchema/spec/grammar/) for maximum familiarity,
with some minor changes to better fit this documentation and to better describe a programming language.

Each rule in the grammar defines one symbol, in the form

```ebnf
symbol := expression ;
```

The `symbol` is camelCased, and each rule terminates with `;`.

The `expression` uses:

- `[`, `,`, `]`, and `"abc"` are constants.\
  This means they match that string precisely and do not carry any meaning.\
  e.g. `["x", E]` matches `["x", "hello"]` where `E` is `"hello"`.
- `A | B`: `A` or `B`, matches either `A` or `B`
- `E?`: optional element `E`. Has higher precedence over `|`.\
  e.g. `[A, B?]` matches `[A]` and `[A, B]`.
- `E*`: zero or more elements `E`. Has higher precedence over `|`.\
  e.g. `[A, B*]` matches `[A]`, `[A, B]`, `[A, B, B]` and so on.
- `E+`: one or more elements `E`. Has higher precedence over `|`.\
  e.g. `[A, B+]` matches `[A, B]`, `[A, B, B]` and so on
- `xExpression`: and expression that produces `x`.\
  e.g. `stringExpression` is an expression that produce `string`,\
  `variableIdentifierExpression` is an expression that produce `variableIdentifier`.

The first rule (about `[`, `,`, `]`, and `"abc"`) is there to make the rule less verbose and easier to read.

For example:

```ebnf
if := ["if", expression, expression, expression?] ;
```

has to be written as below without the first rule:

```ebnf
if := '[' '"if"' ',' expression ',' expression ',' expression? ']' ;
```

## Grammar

Here is a quick summary of the key grammar rules:

```ebnf
expression := literal | variable | special | type | function | invocation | multiple ;
variable := [variableIdentifier, expression?];
special := fn | let | if | match | unbox | eval | partial | lambda ;
type := [typeIdentifier, expression+] ;
function := [functionIdentifier, expression+] ;
invocation := [stringExpression, expression*] ;
fn := ["fn", functionIdentifier, [paramDeclaration*], expression+] ;
let := ["let", [paramAssignment*], expression+] ;
if := ["if", expression, expression, expression?] ;
match := ["match", [expression, expression]+, ["_", expression]?] ;
unbox := ["unbox", type];
eval := ["eval", listExpression+] ;
partial := ["partial", expression] ;
lambda := ["lambda", [paramDeclaration*], expression+] ;
```

Every expression in `just-func` except `literal` has the form of `[identifier, expression*]`.
The `identifier` determines what kind of expression it is.

It is a `string`.
It will be resolved to either a `functionIdentifier`, `typeIdentifier`, or `variableIdentifier`.
If it cannot resolved to any identifier, t will result in an error.

It can also be an expression. In which it will be evaluated to produce the `identifier`.

### Expression

`expression` refers to all expressions can be used within a `just-func` program.

```ebnf
expression := literal | variable | special | type | function | invocation ;
```

- [`literal`](#literal)
- [`variable`](#variable)
- [`special`](#special)
- [`type`](#type)
- [`function`](#function)
- [`invocation`](#invocation)

### Literal

Literals are all JSON types except `array`,
which we used as the construct of the language.

```ebnf
literal := string | number | boolean | null | object ;
```

When you want to express an array, use [`list`](#list).

- [`number`](#number)
- [`object`](#object)

#### Number

`number` type is the sum-type of `integer` and `floatingPoint`.

```ebnf
number := integer | floatingPoint ;
floatingPoint := ("+" | "-")? digit* . digit* ;
```

Note that we do not differentiate between `float` vs `double`,
and other expressions of numbers, because JSON does not differentiate them.

#### Object

`object` in `just-func` are used as data type, unlike `array`.
This keep the syntax very simple as well as very flexible.

For example,
we could have use `object` to define function params,
but that creates limitation as the key of `object` can only be `string` or `number`,
thus the homoiconicity will suffer.
If we use `object` for that purpose,
then we have to use some kind of workaround when working on meta-programming.

### Variable

The `variable` rule in the grammar describe how to interact with variables defined by [`let`](#let).

```ebnf
variable := [variableIdentifer, expression?] ;
variableIdentifier := letter (letter | digit | '-' | '_' )* (letter | digit) ;
```

As with any language, the `variable` identifier cannot use any [reserved keywords](#reserved-keywords).

`[variableIdentifier]` (as in `["a"]`) returns the value in the variable `a`.

If the optional `expression` is specified,
the result of the expression will be assigned to the variable.
i.e. it is variable assignment.

Function can be assigned by `["a", ["myFun"]]`
...doesn't work

Questions:

- function assignment: how to assign an already defined function to a variable?\
  What is the use case for this?\
  Do we support closure and function override?

### Special

`special` are special expressions that have specific syntactic form.
The expressions within these `special` form are not evaluated automatically.
The particular `special` expression will handles the evaluation themselves.

This is why they are `special` comparing to [`functions`](#function).

```ebnf
special := fn | let | if | match | eval | partial | lambda ;
```

- [`fn`](#fn)
- [`let`](#let)
- [`if`](#if)
- [`match`](#match)
- [`unbox`](#unbox)
- [`eval`](#eval)
- [`partial`](#partial)
- [`lambda`](#lambda)

#### fn

`fn` is a special expression to define a function.

```ebnf
fn := ["fn", functionIdentifier, [paramDeclaration*], expression+] ;
functionIdentifier := namespace* variableIdentifier ;
namespace := letter (letter | '-' | '_' )* '/' ;
paramDeclaration := [variableIdentifier, typeIdentifier+] ;
```

using:

- [`variableIdentifier`](#variable)
- [`typeIdentifier`](#type)

`functionIdentifier` can be namespaced using `/`.
e.g. `log/info`.

`fn` will create the function in the current scope.
You can consider `fn` is `let` + `lambda`:

```jsonc
[
  [
    "fn",
    "greet",
    [["name", "string"]],
    ["str", "Hello, ", ["name"]]
  ],
  ["greet", "Homa"]
]

// same as
[
  "let",
  [
    ["greet", [
      "lambda",
      [["name", "string"]],
      ["str", "Hello, ", ["name"]]
    ]]
  ],
  ["greet", "Homa"]
]
```

WIP:

Param declaration and types.

Questions:

Other naming convention consideration:

- `def` + `fn` vs `defn` in `clojure`
- `let` + `lambda` vs `defun` in `lisp`
- `fn` vs `closure` in `rust`

Function documentation:

We can use `doc` (or `//@something`) to add comments or documentation inside the function body.
But how can we define documentation for the function itself?
Also, `fn` is defining a particular signature.
Is there a way to add documentation for the overall function?

#### let

`let` creates one or more variables.
Those variables only exist within the scope defined by `let`.

```ebnf
let := ["let", [paramAssignment*], expression+] ;
```

Questions:

`let` vs `scope`:

Should `let` be generalized to just `scope`?
It defines a `scope` and creates the variable/overrides within that scope.

#### if

`if` is a special expression which evaluate the then or else expression based on the result of the con

#### match

#### eval

#### partial

#### lambda

### Type

`type` are special expressions that retain their internal data structure when evaluated.
They will be unboxed to the final representation in JSON so that the result can be used outside of the `just-func` program.

Just like `special`, the expression within `type` are not evaluated automatically.

```ebnf
type := [type identifier, expression*] ;
```

`just-func` comes with the following build-in types:

- [`list`](#list)
- [`ratio`](#ratio)

#### List

`just-func` uses `array` for [`syntax`](#syntax), [`type`](#type), and [`function`](#function).

`list` is a [`type`](#type) that allow users to express an `array`.

```ebnf
list := ["list", expression*]
```

Note that it is the same if you want to use `array` inside an `object`.

```jsonc
// invalid: array is an expression, not a literal.
[1, 2, 3]

// invalid: for the same reason.
["list", { "a": [1, 2, 3] }]

// produce: [{ "a": [1, 2, 3] }]
["list", { "a": ["list", 1, 2, 3] }]
```

### doc (WIP)

`doc`  is used to document the code?
It is overridden in REPL to display the documentation instead.

### Common BNF

```ebnf
letter := "A" ... "Z" | "a" ... "z" ;
digit := "0" ... "9" ;
```

## Reserved keywords

Here are a list of keywords reserved by the language and standard library:

```ebnf
reservedKeywords := specialKeywords | operators ;
specialKeywords := "fn" | "let" | "if" | "match" | "eval" | "partial" |
                   "lambda" | "type" | "mod" | "use" | "import" |
                   "export" | "class" | "impl" | "interface" |
                   "string" | "integer" | "number" | "boolean" | "object" | "list" | "ratio" |
                   "for" | "while" | "do" | "loop" | "take" ;
operators := "==" | "!=" | ">" | "<" | ">=" | "<=" |
                    "&&" | "||" | "&" | "|" | "!" |
                    "+" | "-" | "*" | "/" | "%" | "^" | "<<" | ">>" |
                    "'" | """ | "?" | "??" | "//";
```

While not reserved, it is recommended to avoid using the words used in the standard library.

```ebnf
stdModuleKeywords := "map" | "reduce" | "some" | "filter" | "find" |
                     "doc" ;
logModuleKeywords := "log" | "log/info" | "log/warn" | "log/error" | "log/debug" ;
```

This list is subject to change but should be stabilized as `just-func` mature.
