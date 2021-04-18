# The Type System

No matter if you are using a dynamic language such as JavaScript or Python,
or a static language such as C, Java, C#, we have to deal with types everyday.

Each variable, each reference, has a specific type at certain time.

Functional programming is about abstraction.

With abstraction, we can perform a few things a thousand times,
instead of a thousand things a few times.

For example, we can add things together, whether it is a number, a string,
and array, or some kind of type that support certain notion of `addition`.

In order to realize this,
we need to have a solid type system,
so that we can reason about is a certain operation possible,
and which code can handle the specific operation.

First of all, what is a type?
This question has been research and answered by many programming language before `just-func`,
so we can give the answer right away:

> Type is set

## Type is set

If this is the first time you heard about this, let me explain.

Take the type `number` as an example,
what are the possible values a `number` variable can contain?

Obviously, any number would work: -1, 2, 3, 3.1459 etc.

So instead of looking at the type `number` as a constrain on what a variable can contain,
you can look at it as a set of infinite possible numbers.

Further more, the type `number` can be a subset or superset of other types.

To demonstrate this, we can take a look at the type system in TypeScript.

In TypeScript, there is a concept of literal types.
i.e. the literal `1`, `3`, `true`, `"abc"` etc is also a type.

Each literal type is a set: a set with single element.

That means `number` is a superset of all possible numeric literal types.

And each literal type is a subset of its wider type.

The concept of set applies universally,
including composite type such as `{ a: number }` and function such as `(a: number) => string`.

There is a lot more to talk about types and sets.
I'll cover them in more detail below,
so let's stop here for the introduction, and continue with the main topic.

##

> An abstraction is the amplification of the essential and the elimination of the irrelevant"

```jsonc
["type", "+", ["fn", ["a -> a -> .. -> a"]]]
["type", "+", ["fn", ["..a", "a"]],
  "return unit of a"
]
["type", "ratio", [["n", "number"], ["d", "number"]],
  ["+", [["a", "ratio"], ["b", "ratio"]],
    [
      "ratio", 
      ["+", ["*", ["a/n"], ["b/d"]], ["*", ["a/d"], ["b/n"]]],
      ["*", ["a/d"], ["b/d"]]
    ]
  ]
  ["+", [["a", "ratio"], ["b", "number"]],
    [
      "ratio",
      ["+", ["a/n"], ["*", "a/d", "b"]],
      ["a/d"]]
  ]
]
["fn", "+", [["a", "number"], ["b", "number"]], ["+", ["a"], ["b"]]]
["type", "+", "A -> A.. -> A",
  ["A", [""]]
],
[]
```

## References

- <https://en.wikipedia.org/wiki/Kind_(type_theory)>
- <https://paulgray.net/typeclasses-in-typescript/#:~:text=In%20Typescript%2C%20we%20encode%20typeclasses,from%20the%20method%20it's%20implementing.&text=Whenever%20we%20need%20to%20write,a%20typeclass%20for%20that%20value.>
