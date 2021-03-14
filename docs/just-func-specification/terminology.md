# Terminology

Don't know what the hack we are talking about?
These document might help.

If it doesn't, [open an issue 🎫](https://github.com/justland/just-func/issues) and we can see if it is our problem or yours.

## Identifier

Every expression in `just-func` except `literal` has the form of `[identifier, expression*]`.

> Why not `operator` as in `[operator, operand*]`?

The word `operator` suggest some kind of action.
The expression can be a function, type, or variable.

While we can say all those expressions are some form of functions (as in lambda calculus),
and invoking those functions produce various results,
the word `operator` can still be a bit more misleading than a generic term `identifier`.

## hosting language

The language that is providing the implementation and tools to run `just-func` code.

🚧 To finalize:

- partial application vs currying
- union vs or
