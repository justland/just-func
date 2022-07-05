# Return value

Return value in `just-func` is a little special.

The formal return value of a function takes the form of a tuple: `[value, meta]`.

`value` is the return value, while `meta` contains `log`, or other `monadic` metadata.

Since not all function returns the `monadic` metadata,
it is cumbersome to always return `[value]` and unpack it on the receiving side:

```yml
[
  # `[1]` is `[value]` where `1` = `value`
  [let, get_one, [fn, [], [1]]],
  [Console/Info, [get, [get_one], 0]]
]
```

So a function can also return the value directly:

```yml
[
  [let, get_one, [fn, [], 1]],
  [Console/Info, [get_one]]
]
```

When the function could result in an error, it should wrap the value in the `Result<T>` type.
The `Result<T>` type is provided by the `std` library which can be either a `Ok<T>` or and `Err<T>`.

The receiving side should use `Result/Unwrap<T>` to extract the result:

```yml
[
  [let, hello_world, [fn, [name], [
    if,
    [name],
    [Result/Ok, [str, 'Hello, ', name]],
    [Result/Err, [error, 'name cannot be empty']]
  ]]],
  # prints `Hello, Miku`
  [Console/Info, [Result/Unwrap, [hello_world, Miku]]],
  [Console/Error, [Result/Unwrap_err, [hello_world, '']]]
]
```


```yml
[
  [let, hello_world, [fn, [name], [
    if,
    [name],
    [[ok, [str, 'Hello, ', name]], { log: [str, 'Welcoming, ', [name]]}],
    [[err, [error, 'name cannot be empty']]]
  ]]],
  # prints `Hello, Miku`
  [unwrap, [hello-world, Miku], console/info, console/error],
]
```
