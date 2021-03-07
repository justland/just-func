# just-func syntax

This document defines `just-func` using a formal grammar.
The purpose is to create a clear specification of the language.

We understand that formal grammar can sometimes be hard to read and understand for someone who is not familiar with it.
So we will provide ample explanation and examples to make sure this document can be used by typical programmers as well as programming language designers.

## Notation

Extended Backus-Naur Form notation (EBNF) will be the formal grammar used in this document.
We will use the basic format as in [wiki](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form).

## Grammar

### Literals

```bnf
literal = string | number | integer | boolean | null | object ;
```

Literals are all JSON types except `array`,
which we used as the construct of the language.
Use `list` when you want to express an array.

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

```bnd
letter = "A" ... "Z" | "a" ... "z" ;
digit = "0" ... "9" ;
```
