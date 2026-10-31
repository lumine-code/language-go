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

; While typing, the complete closing delimiter is the one-time trigger.
; The preceding text must end with a newline and indentation, so inline
; template output keeps its authored whitespace.
(["}}" "-}}"] @match
  (#match? @match "^-?\\}\\}$")
  (#is? test.matchAt "previousSibling ^(else|end)$")
  (#is? test.matchAt "previousSibling.previousSibling ^\\{\\{-?$")
  (#is? test.matchAt "previousSibling.previousSibling.previousSibling \\n[ \\t]{0,256}$")
  (#is? test.endsOnSameRowAs previousSibling.previousSibling.startPosition)
  (#is? test.lastTextOnRow true)
  (#set! indent.matchIndentOf parent.startPosition)
  (#set! indent.force true))

; Raw strings and comments can contain significant whitespace.
([(raw_string_literal) (comment)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))
