# interop specification

Since `just-func` will be interpreted or used in many programming languages,
it is important to establish certain guidelines and every implementation adhere to a common set of language and core library features so that:

- it is easy for the output of one implementation can be used as the input of another implementation.
- programmers can easily port implementation from one language to another.

## Terminologies

✔️ When describing and implementing features in `just-func`,
each implementation should use the same terminologies to describe those features.

You can find the terminologies [here](./terminology.md).

## Logs

✔️ All logs should be transformed to a common format.

> Why?

Each implementation and individual programmer should be able to control how they want their logs look like.
Therefore, we do not try to force a common format when the log is produce and consumed.

However, the emitted logs should be able to transform info a common format so that the logs can be consumed by other languages.

We have yet to decide on this common format.
Some standard format such as syslog might be nice.

## Errors

✔️ All errors should conform to a common data structure.

```jsonc
{
  "type": "error-type",
  "id": "identifier of the expression",
  "message": "standardized, humanly readable error message"
}
```

The `json-schema` for error can be found [here](https://github.com/justland/just-func/blob/main/schema/draft-07/error-schema.jsonc).

✔️ `type` should be clear what is the error and also indicate that it is an error.

✔️ `type` must be lower-kebab-case.

✔️ `type` must not suffix with `error` or `exception`.

> Why?

Different language has different convention (`error` vs `exception`, and some language has both).

Keeping the name of the property as `type` and devoid of this suffix convention so that we will not create unnecessary confusion in a particular language.
(i.e. in some language where `exception` is the norm and if we suffix with `error`, it is unpleasant and confusing to the programmer).

⌛️ To be determined:

- nested errors
- stack trace / [cause-info](https://github.com/unional/google-cloud-api/blob/master/src/types.ts#L119)

---

[prev](./grammar.md) [next](./terminology.md)
