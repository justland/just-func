# Why just-func, why?

Here we describe the design choices we made,
why we made them, and what are the implications and limitations they impose.

In this document, each section has an icon. They mean:

- ❓: in discussion.
- 🚧: the choice have been made. Implementing and updating documentation.
- ✔️: implementation completed

## ❓ dash or underscore

Originally, I prefer `-` over `_` as it is easier to read and write.
But it does not compatible with the typical identifier in other languages.

Will it be better if we use underscore instead?
Or, we disable both and rely on `camelCase` or `PascalCase`.

## ❓ type declaration

One of the consideration of whether supporting type declaration is to whether if `just-func` would support function overload.

## ❓ lazy evaluation

To support lazy evaluation, it requires iterator and state machine implementation.

## ❓ support meta-programming without additional syntax

## ❓ [monoid-identifier] -> identity

Calling `type-identifier` without data will returns the identity for that type.

## 🚧 Distributed Function Signature Addition

Modules can add function signatures to existing types or functions.
This is similar to function overloads,
but actually more similar to Rust `impl` and Lua method declaration.

## ✔️ Uniformity over syntax overload

Creating syntax overload to "make it easy" for the programmer almost always bite back.

Want to look for an example?
Look no further than the most popular language: JavaScript.

Is it popular? Yes.

Is it successful? Yup.

Is it controversial? You bet.

Does people hate it? You better believe.

Can it do better? Hell yeah.

## ✔️ object as data type

In `just-func`, we are using the first element of an `array` to inject syntax to otherwise just a JSON.
For `object`, it is use as simple data structure, except the array inside an object also consider as a `just-func` expression.

This is a design choice to [make the language simple](design-goals.md#simple-and-consistent-syntax).

Also, this keep the language flexible.

For example,
we could have use `object` to define function parameters,
but that creates limitation as the key of `object` can only be `string` or `number`,
thus the homoiconicity will suffer (we will have a hard time to build the parameter with meta-programming).

---

[prev](./design-goals.md) [next](./grammar.md)
