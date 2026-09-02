; Adapted from nvim-treesitter at
; 19071296d3d643b48615ee574a20e8a03ac40872 (Apache-2.0).

[
  (if_action)
  (range_action)
  (block_action)
  (with_action)
  (define_action)
] @local.scope

(variable_definition
  variable: (variable) @local.definition)

(variable) @local.reference
