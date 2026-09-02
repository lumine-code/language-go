; Adapted from nvim-treesitter at
; 19071296d3d643b48615ee574a20e8a03ac40872 (Apache-2.0).

[
  (field)
  (field_identifier)
] @variable.other.property.gotemplate

(variable) @variable.other.gotemplate

(function_call function: (identifier) @support.function.gotemplate)
(method_call
  method: (selector_expression
    field: (field_identifier) @support.function.gotemplate))

(function_call
  function: (identifier) @support.function.builtin.gotemplate
  (#any-of? @support.function.builtin.gotemplate
    "and" "call" "html" "index" "slice" "js" "len" "not" "or" "print" "printf" "println"
    "urlquery" "eq" "ne" "lt" "ge" "gt"))

[
  "|"
  "="
  ":="
] @keyword.operator.gotemplate

"." @punctuation.accessor.gotemplate
"," @punctuation.separator.sequence.gotemplate

[
  "{{"
  "{{-"
] @punctuation.section.embedded.begin.gotemplate

[
  "}}"
  "-}}"
] @punctuation.section.embedded.end.gotemplate

"(" @punctuation.definition.arguments.begin.bracket.round.gotemplate
")" @punctuation.definition.arguments.end.bracket.round.gotemplate

(if_action ["if" "else" "end"] @keyword.control.conditional.gotemplate)
(range_action ["range" "else" "end"] @keyword.control.repeat.gotemplate)
(with_action ["with" "else" "end"] @keyword.control.conditional.gotemplate)
(template_action "template" @support.function.builtin.gotemplate)
(block_action ["block" "end"] @keyword.control.directive.gotemplate)
(define_action ["define" "end"] @keyword.control.directive.gotemplate)
(continue_action "continue" @keyword.control.repeat.gotemplate)
(break_action "break" @keyword.control.repeat.gotemplate)

[
  (interpreted_string_literal)
  (raw_string_literal)
] @string.quoted.double.gotemplate

(rune_literal) @string.quoted.single.gotemplate
(escape_sequence) @constant.character.escape.gotemplate

[
  (int_literal)
  (float_literal)
  (imaginary_literal)
] @constant.numeric.gotemplate

[
  (true)
  (false)
] @constant.language.boolean.gotemplate

(nil) @constant.language.null.gotemplate

(comment) @comment.block.gotemplate
((comment) @punctuation.definition.comment.begin.gotemplate
  (#set! adjust.startAndEndAroundFirstMatchOf "^\\{\\{-?/\\*"))
((comment) @punctuation.definition.comment.end.gotemplate
  (#set! adjust.startAndEndAroundFirstMatchOf "\\*/-?\\}\\}$"))

(ERROR) @invalid.illegal.gotemplate
