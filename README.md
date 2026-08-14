# language-go

Go language support.

## Features

- **Grammars**: provides Tree-sitter grammars built from [tree-sitter-go](https://github.com/tree-sitter/tree-sitter-go) and TextMate grammars derived from [atom/language-go](https://github.com/atom/language-go).
- **Syntax highlighting**: full grammar coverage for Go files.
- **Snippets**: shortcuts for common declarations and control structures.
- **Code folding**: collapse blocks, functions, and comments.
- **Comment toggling**: line and block comment support.

## Installation

To install `language-go` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-go`.

## Services

- `hyperlink.injection`: consumed to highlight URLs inside code and comments as clickable links.
- `todo.injection`: consumed to highlight `TODO`-style markers inside comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
