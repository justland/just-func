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
    - [cond](#cond)
    - [eval](#eval)
    - [partial](#partial)
    - [lambda](#lambda)
    - [mod](#mod)
    - [doc](#doc)
  - [Type](#type)
    - [List](#list)
  - [function](#function)
  - [Common Symbol](#common-symbol)
- [Reserved keywords](#reserved-keywords)

## Notation

The Formal Grammar in this document is given using a customized Extended Backus-Naur Form notation (EBNF) notation.
The notation is similar to [`json-schema`](https://cswr.github.io/JsonSchema/spec/grammar/) for maximum familiarity,
with some minor changes to better fit this documentation and to better describe a programming language.

Each rule in the grammar defines one symbol, in the form

```ebnf
symbol := expression ;
```

All `symbols` are lower-snake-cased, and each rule terminates with `;`.

The `expression` uses:

- `[`, `,`, `]`, and `"abc"` are constants.\
  This means they match that string precisely and do not carry any meaning.\
  e.g. `["miku/sing", E]` matches `["miku/sing", "'a song'"]` where `E` is `"'a song'"`.
  This makes the rule less verbose and easier to read. If not, a rule like this:\
  `if := ["if", expression, expression, expression?] ;`\
   has to be written as:\
  `if := '[' '"if"' ',' expression ',' expression ',' expression? ']' ;`
- `A | B`: `A` or `B`, matches either `A` or `B`
- `E?`: optional element `E`. Has higher precedence over `|`.\
  e.g. `[A, B?]` matches `[A]` and `[A, B]`.
- `E*`: zero or more elements `E`. Has higher precedence over `|`.\
  e.g. `[A, B*]` matches `[A]`, `[A, B]`, `[A, B, B]` and so on.
- `E+`: one or more elements `E`. Has higher precedence over `|`.\
  e.g. `[A, B+]` matches `[A, B]`, `[A, B, B]` and so on
- `x-expression`: and expression that produces `x`.\
  e.g. `string-expression` is an expression that produce `string`,\
  `variable-identifier-expression` is an expression that produce `variable-identifier`.

## Grammar

Here is a quick summary of the key grammar rules:

```ebnf
expression := literal | special | variable | type | function | invocation ;
literal := string | number | boolean | null | object ;
string := "'" letter* "'" ;
special := fn | let | if | cond | unbox | eval | partial | lambda | mod | doc;
variable := [variable-identifier, expression?];
type := [type-identifier, data+] ;
invocation := [identifier-expression, expression*] ;
fn := ["fn", function-identifier, [param-declaration*], expression+] ;
let := ["let", [param-assignment*], expression+] ;
if := ["if", expression, expression, expression?] ;
cond := ["cond", [expression, expression+]+] ;
unbox := ["unbox", type];
eval := ["eval", list-expression] ;
partial := ["partial", expression] ;
lambda := ["lambda", [param-declaration*], expression+] ;
mod := ["mod", expression+] ;
```

### Expression

`expression` refers to all expressions can be used within a `just-func` program.

```ebnf
expression := literal | variable | special | type | function | invocation ;
```

Every expression in `just-func` except `literal` has the form of `[identifier, expression*]`.

The `identifier` determines what kind of expression it is.
It must be a string and must be resolved to either a `function-identifier`, `type-identifier`, or `variable-identifier`.

An expression can be place at the `identifier` position,
which will be evaluated to produce the `identifier` and perform the same resolution.

- [`literal`](#literal)
- [`object`](#object)
- [`variable`](#variable)
- [`special`](#special)
- [`type`](#type)
- [`function`](#function)
- [`invocation`](#invocation)

### Literal

Literals refer to all JSON types except `array`,
which we used insert `just-func` syntax into JSON.

```ebnf
literal := string | number | boolean | null ;
```

When you want to describe an array, use [`list`](#list).

- [`number`](#number)

#### Number

`number` type is the sum-type of `integer` and `floating-point`.

```ebnf
number := integer | floating-point ;
floating-point := integer . digit* ;
```

Note that we do not differentiate between `float` vs `double`,
and other expressions of numbers, because JSON does not differentiate them.

### Object

`object` in `just-func` are one of the data types.
Any array inside an object is treated as `just-func` expression.
This allow us to programmatically build the object data.

```jsonc
{
  // "a": "banana"
  "a": ["if", ["==", 1, 2], "apple", "banana"]
}
```

### Variable

The `variable` rule in the grammar describes how to interact with variables created by [`let`](#let).

```ebnf
variable := [variable-identifer, expression?] ;
variable-identifier := identifier ;
```

using:

- [`identifier`](#common-symbol)

When defining your variable,
the `variable-identifier` cannot be any of the [reserved keywords](#reserved-keywords).

If the optional `expression` is specified,
the result of the expression will be assigned to the variable.
i.e. it is variable assignment.

examples:

```jsonc
[  "mod",
  ["let", "x", 1], // create variable "x"
  ["x"], // returns 1
  ["x", 2] // x = 2, and return 2
]
```

🚧 in discussion:

> Assign function to variable?

What is the need to assign a function to a variable?
It should behave the same as passing into another function as a parameter.
Or adding the function to an object.

F# only allow assigning partial application to variable,
thus avoiding this problem.

> Do we support closure, and how?

Closure should probably supported,
And maybe enabled by default.

> Will variable shadow [`type`](#type) and [`function`](#function)?

It probably will. Any security concern?

### Special

`special` are special expressions that have specific syntactic form.

The expressions within these `special` form are not evaluated automatically.
The particular `special` expression will handle the evaluation themselves.

This is why they are `special` comparing to [`functions`](#function).

```ebnf
special := fn | let | if | cond | eval | partial | lambda | mod ;
```

- [`fn`](#fn)
- [`let`](#let)
- [`if`](#if)
- [`cond`](#cond)
- [`unbox`](#unbox)
- [`eval`](#eval)
- [`partial`](#partial)
- [`lambda`](#lambda)
- [`mod`](#mod)

#### fn

`fn` is a special expression to define a function.

```ebnf
fn := ["fn", function-identifier, [param-declaration*], expression+] ;
function-identifier := namespace* identifier ;
param-declaration := [identifier, type-definition] ;
```

using:

- [`identifier`](#common-symbol)
- [`namespace`](#common-symbol)
- [`type-definition`](#type)

`function-identifier` can be namespaced using `/`.
e.g. `log/info`.

`fn` will create the function in the current scope.

```jsonc
[
  "fn", "greet", [["name", "string"]],
  ["str", "Hello, ", ["name"]]
]
```

🚧 in progress:

> Should it be named differently?

- `def` + `fn` vs `defn` in `clojure`
- `let` + `lambda` vs `defun` in `lisp`

examples:

```jsonc
// let + anonymous function
["let", [["greet", ["fn", [["name", "string"]], ["str", "Hello, ", ["name"]]]]]]
// export + let + anonymous function
["pub", ["let", [["greet", ["fn", [["name", "string"]], ["str", "Hello, ", ["name"]]]]]]]
// export declared variable if `let` add variable to current scope
// similar to named export
["pub", "greet"]
// export as let/define
["pub", "greet", ["fn", [["name", "string"]], ["str", "Hello, ", ["name"]]]]
```

> How to handle closure?

Closure is needed but the question is how to handle it.
We can create a `fn`/`callable`/`func` type which the native implementation have access to the resolver/scope.

> How to document function itself?

We can use [`doc`](#doc) to add documentation inside the function body.
But we are defining a specific function signature at a time.
So the `doc` only applies to a specific signature.

> Do we support function override?

Function override means replacing the behavior of a particular function signature within certain scope.
The scope can be local, or it can be global.
What's the syntax for each?
What's the use case?

Is there a use case to override the whole function, not just one function signature?
What is the syntax for that?

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

The `if` expression is... an if expression.

```ebnf
if := ["if", predicate, then, else?]
then := expression ;
else := expression ;
```

using:

- [`predicate`](#common-symbol)

It is an expression, meaning it will return the value in the `then` or `else` clause.

#### cond

The `cond` expression allows you to branch and execute certain actions based on the test expression.

```ebnf
cond := ["cond", [test, action+]+] ;
test := expression ;
action := expression ;
```

The `test` expression considered passing if it returns a truthy value.

#### eval

#### partial

#### lambda

#### mod

The `mod` expression creates a module.

```ebnf
mod := ["mod", use*, expression+] ;
use := ["use", module-identifier, variable-identifier?] ;
module-identifier := tbd | url | module-name | relative-path ;
```

using:

- [variable-identifier](#variable)

🚧 to discuss:

alternative syntax:

```ebnf
mod := ["mod", [use*], expression+] ;
use := [variable-identifier, module-identifier] ;
```

This syntax is similar to `let` so the language is more consistent.
It does not need the additional `use` expression.
Putting `variable-identifier` first make auto-importing the last part of `module-identifier` not possible.
Auto completion on `variable-identifier` is not possible as it comes before `module-identifier`.

#### doc

The `doc` expression is used to document the program, module, or function.
In REPL, it is overridden to show the document.

```ebnf
// in code
doc := ["doc", documentation+] ;
documentation := string ;

// in REPL
doc := ["doc", module-identifier | function-identifier] ;
```

using:

- [`module-identifier`](#mod)
- [`function-identifier`](#fn)

### Type

`type` are special expressions that retain their internal data structure when evaluated.
They will be unboxed to the final representation in JSON so that the result can be used outside of the `just-func` program.

Just like `special`, the expression within `type` are not evaluated automatically.

```ebnf
type := [type-identifier, data+] ;
type-identifier := identifier ;
data := expression ;
```

using:

- [`identifier`](#common-symbol)

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

### function

The `function` expression is function invocation.

```ebnf
function := [function-identifier, argument*] ;
argument := expression ;
```

using:

- [`function-identifier`](#fn)

The `function` expression will be evaluated in [applicative-order](./terminology.md#applicative-order-evaluation).

🚧 in discussion:

### Common Symbol

```ebnf
letter := upper-case-letter | lower-case-letter ;
upper-case-letter := "A" ... "Z" ;
lower-case-letter := "a" ... "z" ;
number := ("+" | "-")digit+ ;
digit := "0" ... "9" ;
boolean := "true" | "false" ;
null := "null" ;
identifier := lower-case-letter (lower-case-letter | digit | "-")* (lower-case-letter | digit) ;
namespace := identifier "/" ;
predicate := expression ;
```

`predicate` is considered truthy if the value is:

- `true`
- non-zero number
- non-empty string
- object
- list
- function

## Reserved keywords

Here are a list of keywords reserved by the language and standard library:

```ebnf
reserved-keywords := special-keywords ;
special-keywords := "fn" | "let" | "if" | "match" | "eval" | "partial" | "lambda" |
  "type" | "mod" | "use" | "import" | "export" | "class" | "impl" | "interface" |
  "string" | "integer" | "number" | "boolean" | "object" | "list" | "ratio" | "doc" |
  "for" | "while" | "do" | "loop" | "take" ;
```

While not reserved, it is recommended to avoid using the words used in the standard library.

```ebnf
stdModuleKeywords := "map" | "reduce" | "some" | "filter" | "find" ;
logModuleKeywords := "log" | "log/info" | "log/warn" | "log/error" | "log/debug" ;
```

This list is subject to change but should be stabilized as `just-func` mature.

---

[prev](./1.3.0-design-choices.md) [next](./interop-specification.md)
