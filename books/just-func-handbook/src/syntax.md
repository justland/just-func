# Syntax


## define

`define` a local symbol.

## export

`export` a module symbol.

## let

`let` a scoped symbol(s).

## cond

```jsonc
["cond",
  [["===", 0, ["%", "n", 15]], "'FizzBuzz'"],
  [["===", 0, ["%", "n", 3]], "'Fizz'"],
  [["===", 0, ["%", "n", 5]], "'Buzz'"],
  [true, "n"]
]
```

- <https://www.reddit.com/r/Racket/comments/a3z3dp/cond_vs_case_cs_match/>
