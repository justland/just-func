# just-func specs

The specifications in this folder provides a consistent specification to the definitions of the language and common modules across implementations in various programming language.

This ensures the `just-func` programs will behaves the same in multiple hosting languages.

## How the specs are structured

You will find various folders underneath this folder each contains specifications of the language or a particular common module.

In each folder, you will find sub-folders for different json schema versions.

This is because the support of json-schema versions differs depending on the hosting language.

For each schema version,
you will find a `specs` folder containing spec files for various code,
a `specs.jsonc`, and optionally a `schema.jsonc` and `completion.jsonc`.

The `specs.jsonc` contains the schema of the test cases.

The optional `schema.jsonc` contains the schema of `just-func` written in that specific json-schema version for that specific module.
For cases that this the `specs.jsonc` is referencing the actual schema directly,
this file will not be there.

The `completion.jsonc` is used by IDE to provide code completion support when writing the tests.
It is a loosen version of `specs.jsonc`.

For example:

```sh
- language # specs for the language itself
  - draft-07
    - specs
      - if.jsonc
      - not.jsonc
    - completion.spec
    - specs.jsonc
  - draft-2020-12
    - specs
      - if.jsonc
      - not.jsonc
    - specs.jsonc
- std
  - draft-07
    - specs
      - ..spec files..
    - schema.jsonc
    - specs.jsonc
```

## Spec Files

A Spec file contains test cases related to certain features.
For example,
`/specs/language/draft-07/specs/1-not.jsonc` contains test cases for the `not` expression.

The spec files are numbered based on increasing complexity.
These numbers are also served as the recommended order when implementing `just-func` in a hosting language.

For test cases that might fit into multiple spec files as they contain overlapping features, these numbers will also serve as a guidance to determine which spec file the test case should be added to.

Each test case follows the following structure:

```jsonc
{
  "description": "description of the test",
  // Optional.
  // Execute before setup.
  // Failures in this step are ignored.
  // Use this step to ensure the test environment is clean.
  "ensure": [],
  // Optional.
  // Execute before run.
  // Failure in this stage are treat as failure.
  // Use this step to setup the test environment for the test.
  "setup": [],
  // Required.
  // If the code returns `true` or null,
  // the test will pass.
  // When the test module is available,
  // it can also fail the test.
  "run": ["the subject just-func code"],
  // Optional.
  // Always execute after run.
  // Failure in this stage are ignored.
  // Use this step to clean up the test environment for the next test.
  "teardown": []
}
```
