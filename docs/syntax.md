# just-func syntax

This document defines `just-func` using a formal grammar.
The purpose is to create a clear specification of the language.

We understand that formal grammar can sometimes be hard to read and understand for someone who is not familiar with it.
So we will provide ample explanation and examples to make sure this document can be used by typical programmers as well as programming language designers.

Here is a quick summary of the key grammar rules:

```ebnf
expression := literal | special | type | function | variable | dynamic;
special := fn | let | if | match | eval | partial ;
type := [typeIdentifier, expression+] ;
function := [functionIdentifier, expression+] ;
variable := [variableIdentifier, expression?] ;
dynamic := [stringExpression, expression+] ;
fn := ["fn", functionIdentifier, [paramDeclaration*], expression+] ;
let := ["let", [paramAssignment*], expression] ;
if := ["if", expression, expression, expression?] ;
match := ["match", [expression, expression]+, ["_", expression]?] ;
eval := ["eval", listExpression] ;
partial := ["partial", expression] ;
```

Each identifier can be replaced by an expression that yields the same identifier.
This is planned but not implemented at the moment.

- [just-func syntax](#just-func-syntax)
  - [Notation](#notation)
  - [Reserved keywords](#reserved-keywords)
  - [Grammar](#grammar)
    - [Expression](#expression)
    - [Literal](#literal)
      - [Number](#number)
      - [Object](#object)
    - [Special](#special)
      - [fn](#fn)
      - [let](#let)
    - [Type](#type)
      - [List](#list)
    - [Identifier](#identifier)
    - [Common BNF](#common-bnf)

## Notation

The Formal Grammar in this document is given using a customized Extended Backus-Naur Form notation (EBNF) notation.
The notation is similar to [`json-schema`](https://cswr.github.io/JsonSchema/spec/grammar/) for maximum familiarity,
as `just-func` is a strict subset of JSON.

Any difference or clarification will be listed below:

- `;`: rule termination
- `E+`: Matches one or more occurrences of `E`. Also has a higher precedence over `|`
- `???Expression`: `Expression` that produces `???`. E.g. `StringExpression` is an expression that produce string, `ParamIdentifierExpression` is an expression that produce `ParamIdentifier`.

## Reserved keywords

Here are a list of keywords reserved by the language and standard library:

```ebnf
reservedKeywords := specialKeywords | operatorKeywords |
                    stdModuleKeywords | logModuleKeywords ;
specialKeywords := "fn" | "let" | "if" | "match" | "eval" | "partial" |
                   "lambda" | "type" | "mod" | "use" | "import" | "export" |
                   "take" |
                   "class" | "impl" | "interface" |
                   "for" | "while" | "do" | "loop" |
                   "ratio" ;
operatorKeywords := "==" | "!=" | ">" | "<" | ">=" | "<=" |
                    "&&" | "||" | "&" | "|" | "!" |
                    "+" | "-" | "*" | "/" | "%" | "^" | "<<" | ">>" |
                    "'" | """ | "?" | "??" ;
stdModuleKeywords := "list" | "map" | "reduce" | "some" | "filter" | "find" |
                     "doc" ;
logModuleKeywords := "log" | "log/info" | "log/warn" | "log/error" | "log/debug" ;
```

## Grammar

The grammar of `just-func` is extremely simple.
You should be able to understand it within 5 minutes.

It is designed to be very expressive.
One goal is to support meta-programming (e.g. `macro`) without additional syntax.

### Expression

Expressions refers to all expressions can be used within a `just-func` program.
It includes literals, specials, types, and functions.

```ebnf
expression := literal | special | type | function ;
```

- [`literal`](#literal)
- [`special`](#special)
- [`type`](#type)
- [`function`](#function)
- [`dynamic`](#dynamic)

### Literal

Literals are all JSON types except `array`,
which we used as the construct of the language.

```ebnf
literal := string | number | boolean | null | object ;
```

- [`number`](#number)
- [`object`](#object)

When you want to express an array, use [`list`](#list).

#### Number

`number` type is the sum-type of `integer` and `floating point`.

```ebnf
number := integer | floating point ;
floating point := ("+" | "-")? digit* . digit* ;
```

Note that we do not differentiate between float vs double, and other expressions of numbers, because JSON does not differentiate them.

#### Object

`object` in `just-func` are used as data type, unlike `array`.
This keep the syntax very simple as well as very flexible.

For example,
we could have use `object` to define function params,
but that create limitation as they key of `object` can only be `string` or `number`,
thus the homoiconicity will suffer.
If we use `object` for that purpose,
then we have to use some kind of workaround when creating macros.

### Special

`special` are special expressions that have specific syntactic form.
The expressions within these `special` form are not evaluated automatically.
The particular `special` expression will handles the evaluation themselves.

This is why they are `special` comparing to [`functions`](#function).

```ebnf
special := fn | let | ret | if | match | eval | partial ;
```

- [`fn`](#fn)
- [`let`](#let)
- [`ret`](#ret)
- [`if`](#if)
- [`match`](#match)
- [`eval`](#eval)
- [`partial`](#partial)

#### fn

`fn` is a special expression to define a function.

```ebnf
fn := ["fn", functionIdentifier, [paramDeclaration*], expression+] ;
functionIdentifier := letter (letter | "-" | "_" | "/")* letter+ ;
paramDeclaration := [paramIdentifier, typeIdentifier+] ;
```

`functionIdentifier` can be namespaced using `/`.
e.g. `log/info`.

Detail TBD:

- `def` + `fn` vs `defn` in `clojure`
- `let` + `lambda` vs `defun` in `lisp`
- `fn` vs `closure` in `rust`

#### let

```ebnf
let = ["let", [[string expression, expression]...], expression]
```

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

### Identifier

```bnf
identifier = letter, { letter | digit | "_" } ;
```

using [`letter`](#common-bnf), [`digit`](#common-bnf).

An identifier is the name of an element in the code.
There are four kinds of elements in `just-func`:
`keyword`, `type`, `function` and `variable`.

```jsonc
// `if` is a keyword
["if", true, true]

// `list` is a type
["list", 1, 2, 3]

// `not` is a function
["not", false]

// `name` is a variable
["let", [["name", "Homa"]], ["ret", "name"]]
```

### Common BNF

```ebnf
letter := "A" ... "Z" | "a" ... "z" ;
digit := "0" ... "9" ;
```
