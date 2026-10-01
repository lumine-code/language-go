((comment) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((interpreted_string_literal (interpreted_string_literal_content) @injection.owner @injection.content)
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none"))

((raw_string_literal (raw_string_literal_content) @injection.owner @injection.content)
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none"))
((comment) @injection.owner @injection.content
  (#set! injection.language "todo")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))
