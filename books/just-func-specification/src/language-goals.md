# `just-func` Language Goals

## replace declarative configuration

Tools need configuration often resort to declarative configuration files.
i.e. enable this, disable that.

This is slow to develop as it takes time to design these flags,
limiting as it only allow user to do certain thing in certain ways,
and easily becomes technical debt as they are hard to remove and slow to change.

Some tools solve this problem by providing hooks or a plugin system.
But that is still limiting as the user of the tool might not familiar with the language that tools is written in,
or the particular system or architecture those tools.

`just-func` can be used as a standard language that solve this problem.

## as the communication language between teams

Teams in different domains use very different languages.
As such, their technical level, programming paradigm, design,
architecture, preference, habit can all be very different.

It is difficult to share a language between these teams.

`just-func` is designed to be a simple, easy to learn, and linear programming language.

People with different background should be able to pick it up easily,
and able to read and write it without much training.

## become part of open standard

Compliment open standard such as OpenAPI to describe behavior.

---

[prev: Why `just-func`?](./why-just-func.md) | [next: Design Goals](./design-goals.md)
