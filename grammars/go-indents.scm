[
  "{"
  "("
] @indent

[
  "}"
  ")"
] @dedent

; Reindent code without rewriting whitespace that belongs to multiline text.
([(raw_string_literal) (comment)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))

; Go aligns case labels with switch/select and indents only the body.
(["case" "default"] @match
  (#set! indent.matchIndentOf parent.parent.startPosition))

(":" @indent
  (#is? test.childOfType "expression_case type_case communication_case default_case")
  (#is? test.lastTextOnRow true))

("}" @match
  (#is? test.childOfType "expression_switch_statement type_switch_statement select_statement")
  (#set! indent.matchIndentOf parent.startPosition))
