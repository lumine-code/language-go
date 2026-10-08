# language-go

Go language support.

Fork of [pulsar-edit/pulsar](https://github.com/pulsar-edit/pulsar) (`packages/language-go`).

## Features

- **Grammars**: provides Tree-sitter grammars for Go, modules, checksums, and templates.
- **Symbols**: declarations, fields, module dependencies and named templates.
- **Syntax highlighting**: covers Go source, `go.mod`, `go.sum`, text templates, and HTML templates.
- **Snippets**: shortcuts for common declarations and control structures.
- **Code folding**: collapse blocks, functions, and comments.
- **Comment toggling**: line and block comment support.

## Installation

To install `language-go` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-go`.

## Injections

- Static Tree-sitter injections highlight URLs with `language-hyperlink`.
- Static Tree-sitter injections highlight comment markers with `language-todo`.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
