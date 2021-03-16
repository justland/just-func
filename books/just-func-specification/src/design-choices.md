# Design Choices

Here we describe the design choices we made,
why we made them, and what are the implications and limitations they impose.

## Uniformity over syntax overload

Creating syntax overload to "make it easy" for the programmer almost always bite back.
Especially in a small and simple language like `just-func`.

What to look for an example?
Look no further than the most popular language: JavaScript.

Is it popular? Yes.
Is it successful? Yup.
Is it controversial? You bet.
Does people hate it? You better believe.
Can it do better? Hell yeah.

## Distributed Function Signature Addition

Modules can add function signatures to existing types or functions.
This is similar to function overloads,
but actually more similar to Rust `impl` and Lua method declaration.

## support meta-programming without additional syntax

---

[prev](./design-goals.md) [next](./grammar.md)
