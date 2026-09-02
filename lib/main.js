const HYPERLINK_TARGETS = {
  "source.go": ["comment", "interpreted_string_literal", "raw_string_literal"],
  "source.mod": ["comment"],
  "source.gotemplate": ["comment", "interpreted_string_literal", "raw_string_literal"],
  "text.html.gohtml": ["comment", "interpreted_string_literal", "raw_string_literal"],
};

const TODO_TARGETS = {
  "source.go": ["comment"],
  "source.mod": ["comment"],
  "source.gotemplate": ["comment"],
  "text.html.gohtml": ["comment"],
};

exports.activate = () => {
  lumine.grammars.addInjectionPoint("text.html.gohtml", {
    type: "template",
    language: () => "html",
    content(node) {
      return node.descendantsOfType(["text", "yaml_no_injection_text"]);
    },
    newlinesBetween: true,
  });
};

exports.consumeHyperlinkInjection = (hyperlink) => {
  for (const [scopeName, types] of Object.entries(HYPERLINK_TARGETS)) {
    hyperlink.addInjectionPoint(scopeName, { types });
  }
};

exports.consumeTodoInjection = (todo) => {
  for (const [scopeName, types] of Object.entries(TODO_TARGETS)) {
    todo.addInjectionPoint(scopeName, { types });
  }
};
