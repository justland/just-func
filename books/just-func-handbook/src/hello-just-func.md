# Hello `just-func`

No introductory book can call itself introductory without a hello world example,
so here it is.

To write a `just-func` program,
you can write it in a JSON file, a YAML, a `.jf` file, or even just a nested array in your language.

For examples throughout the book,
we will be writing them in JSON.

To write hello world, you need three things:

- string concatenation
- function declaration
- function invocation

The function to do string concatenation in `just-func` is `str`:

```jsonc
["str", "hello ", "world"] // -> hello world
```

All `just-func` expressions have the form of `[identifier, expressions...]`.

So `["str", "hello ", "world"]` is calling the `str` function with two parameters: `"hello "` and `"world"`.

Oh, we just covered function invocation too, didn't we?

To declare a function, we use the `fn` expression:

```json
[
  "fn", "hello-world", [["name", "string"]],
  ["str", "say hello world to ", ["name"]]
]
```

This defines a function `hello-world`,
which takes one parameter `name` which is a `string`.

When invoked, it calls the `str` function to concatenate the string `"say hello world to "` and the value stored in `name` by doing `["name"]`.

I guess you already know how to use it, so no explanation needed, right?

```json
["hello-world", "genius"]
```

---

[prev](./getting-started.md)
