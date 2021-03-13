# Design Decisions

## Design Goals

- functional programming with object-oriented programming support.
- Uniformity over syntactic sugar.
- Support meta-programming (e.g. `macro`) without additional syntax.
- Function Signature based resolution.
- nominal typed
- strongly typed
- dynamically typed
- type inference

## Terminology

`keyword`:

Keywords reserved by the language.

`operator`:

The operator of a function or the identifier of the type.
It is always the first argument in the list: `+`, `not`, `list`, `let`, etc

## Errors

Topics remaining to be discuss and decide:

- nested errors
- details with [`CauseInfo`](https://github.com/unional/google-cloud-api/blob/master/src/types.ts#L119)

### Error suffix

Errors are not suffixed with `Error` or `Exception`.
The `type` property should be clear what is the error and also indicate that it is an error.

Different language has different convention (`Error` vs `Exception`, and some language has both).
Keeping the name of the property as `type` and devoid of this suffix convention so that we will not create unnecessary confusion in a particular language.
(i.e. in some language where `Exception` is the norm and if we suffix with `Error`, it is unpleasant to the programmer).
