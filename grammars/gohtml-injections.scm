; The template's text fragments form one HTML document across control flow.
([(text) (yaml_no_injection_text)] @injection.owner @injection.content
  (#set! injection.language "html")
  (#set! injection.combined)
  (#set! injection.newlines-between)
  (#set! injection.content-edit-policy "content-words"))

((comment) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

([
  (interpreted_string_literal)
  (raw_string_literal)
] @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none"))
((comment) @injection.owner @injection.content
  (#set! injection.language "todo")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))
