; The template's text fragments form one HTML document across control flow.
([(text) (yaml_no_injection_text)] @injection.owner @injection.content
  (#set! injection.language "html")
  (#set! injection.combined)
  (#set! injection.newlines-between))
