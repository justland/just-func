# Design Goals

## Simple and consistent syntax

## Linear Learning Curve

The syntax and complexity of the code should grow linearly.
Or else it won't be consistent and easy to read.

Otherwise it will violates the language goal of [being the communication language](./language-goals.md#as-the-communication-language-between-teams).

To achieve this goal, we need:

- [](./design-choices.md#support-meta-programming-without-additional-syntax)

## Focus on Tooling

## Structural Type

Definitely supports structural type first instead of restricting the whole system with nominal type.

No question asked.

🚧 to discuss:

The type syntax is still not defined.

## Strongly Type with type inference

Use type inference to infer types whenever possible.

## dynamically typed

Dynamically typed means the type of the variable is checked during runtime.

`just-func` is dynamically typed because it can be executed by the `hosting language` at runtime.
Even thou some `hosting language` might able to JIT compile `just-func` code making it possible to be statically typed,
most other `hosting language` would interpret it meaning `just-func` code must support runtime type checking.

---

[prev](./language-goals.md) [next](./design-choices.md)
