; Adapted from nvim-treesitter at
; 19071296d3d643b48615ee574a20e8a03ac40872 (Apache-2.0).

[
  "require"
  "replace"
  "go"
  "toolchain"
  "exclude"
  "retract"
  "module"
] @keyword.control.go-mod

"=>" @keyword.operator.go-mod

(comment) @comment.line.double-slash.go-mod
((comment) @punctuation.definition.comment.go-mod
  (#set! adjust.startAndEndAroundFirstMatchOf "^//"))

(module_path) @string.unquoted.path.go-mod
(tool) @string.unquoted.path.go-mod

[
  (version)
  (go_version)
  (toolchain_name)
] @string.unquoted.version.go-mod

"(" @punctuation.definition.group.begin.bracket.round.go-mod
")" @punctuation.definition.group.end.bracket.round.go-mod
"[" @punctuation.definition.group.begin.bracket.square.go-mod
"]" @punctuation.definition.group.end.bracket.square.go-mod
"," @punctuation.separator.sequence.go-mod
