[
  "if"
  "range"
  "block"
  "with"
  "define"
  "else"
] @indent

[
  "else"
  "end"
] @dedent

; Branch keywords sit inside template delimiters. Match from the opening
; delimiter so a tag on its own row can return to the owning action.
(["{{" "{{-"] @match
  . ["else" "end"]
  (#set! indent.matchIndentOf parent.startPosition))

; Raw strings and comments can contain significant whitespace.
([(raw_string_literal) (comment)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))
