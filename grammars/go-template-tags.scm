; Definitions, not template invocations, form the template outline.
([
  (define_action name: [
    (interpreted_string_literal)
    (raw_string_literal)] @name)
  (block_action name: [
    (interpreted_string_literal)
    (raw_string_literal)] @name)
] @definition.function
  (#set! symbol.strip "^[\"`]|[\"`]$"))
