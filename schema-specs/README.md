# just-func specs

The specifications in this folder provides a consistent specification to the definitions of the language and common modules across implementations in various programming language.

This ensures the `just-func` programs will behaves the same in multiple hosting languages.

## How the specs are structured

You will find various folders underneath this folder each contains specifications of the language or a particular common module.

For example,

```sh
- specs
  - error
  - language
  - std
  - test
```

In each folder, you will find a `specs` folder containing spec files for various tests,
as well as folders for different json schema versions.

For example,

```sh
- specs
  - language
    - draft-07
    - draft-2020-12
    - specs
```

There are schema for different json-schema versions because the support of json-schema versions differs depending on the hosting language.

Inside each schema folder, you will find a `specs.jsonc`,
and optionally other files such as `completion.jsonc` and `schema.jsonc`.

```sh
- specs
  - std
    - draft-07
      - completion.jsonc
      - schema.jsonc
      - specs.jsonc
```

The `specs.jsonc` contains the schema of the tests.
If your IDE supports json-schema, such as Visual Studio Code,
you can use it to validate the tests,
making sure the tests are written correctly.

The `completion.jsonc` is a loosen version of `specs.jsonc`.
It is used to aid writing tests.
In some IDE, such as Visual Studio Code,
it does not show a particular `identifier` in the auto completion if the data does not satisfy all constraints such as `minItems`.
This `completion.jsonc` removes those constraint so that the IDE will show the complete list of `identifier` so that it is easier to write tests.

The `schema.jsonc` contains the schema extension for that particular module.
For `draft-07`, it contains the base schema as well as the schema extension because it does not support dynamic extension.
For those who are interested, it is the same problem as nominal type vs structural type.

## Spec Files

A spec file contains test related to certain features.
For example,
`/specs/language/specs/1-equality.jsonc` contains test cases for the `==` expression.

```jsonc
[
  { /* test case 1 */ },
  { /* test case 2 */ },
  { /* test case 3 */ }
]
```

The spec files are numbered based on increasing complexity.
These numbers are also served as the recommended order when implementing `just-func` in a hosting language.

When a tests might fit into multiple spec files as they contain overlapping features, these numbers will also serve as a guidance to determine which spec file the test case should be added to.

Each test has the following structure:

```jsonc
{
  "description": "description of the test",
  // Maturity stage of the behavior.
  // <https://2ality.com/2015/11/tc39-process.html>
  "stage": "stage-0 | stage-1 | stage-2 | stage-3",
  // Which version this behavior is finalized.
  "version": "major.minor.patch",
  // Optional step before `setup`.
  // Failures in this step are ignored.
  // Use this step to ensure the test environment is clean.
  "ensure": [],
  // Optional step before `run`.
  // Failure in this stage are treat as failure.
  // Use this step to setup the test environment for the test.
  "setup": [],
  // Required test step.
  // The test will pass if this code returns `true` or `null`.
  // When the test module is available,
  // it can also fail the test.
  "run": [],
  // Optional step after `run`.
  // This will always execute if specified,
  // regardless if the test passes or not.
  // Failure in this stage are ignored.
  // Use this step to clean up the test environment for the next test.
  "teardown": []
}
```
