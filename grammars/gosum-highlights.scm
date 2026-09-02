; Adapted from nvim-treesitter at
; 19071296d3d643b48615ee574a20e8a03ac40872 (Apache-2.0).

[
  "alpha"
  "beta"
  "dev"
  "pre"
  "rc"
  "+incompatible"
] @keyword.other.version.gosum

(module_path) @string.unquoted.path.gosum
(module_version) @string.unquoted.version.gosum
(hash_version) @storage.type.hash.gosum
(hash) @string.unquoted.checksum.gosum

[
  (number)
  (number_with_decimal)
  (hex_number)
] @constant.numeric.gosum

(checksum "go.mod" @string.unquoted.filename.gosum)

[
  ":"
  "."
  "-"
  "/"
] @punctuation.separator.gosum
