let injectionRegistrations = [];

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
  injectionRegistrations.push(
    lumine.grammars.addInjectionPoint("text.html.gohtml", {
      type: "template",
      language: () => "html",
      content(node) {
        return node.descendantsOfType(["text", "yaml_no_injection_text"]);
      },
      newlinesBetween: true,
    }),
  );
};

exports.consumeHyperlinkInjection = (hyperlink) => {
  const registrations = [];
  for (const [scopeName, types] of Object.entries(HYPERLINK_TARGETS)) {
    registrations.push(hyperlink.addInjectionPoint(scopeName, { types }));
  }
  return {
    dispose() {
      for (const registration of registrations.splice(0)) registration.dispose();
    },
  };
};

exports.consumeTodoInjection = (todo) => {
  const registrations = [];
  for (const [scopeName, types] of Object.entries(TODO_TARGETS)) {
    registrations.push(todo.addInjectionPoint(scopeName, { types }));
  }
  return {
    dispose() {
      for (const registration of registrations.splice(0)) registration.dispose();
    },
  };
};

exports.deactivate = function () {
  for (const registration of injectionRegistrations.splice(0)) registration.dispose();
};
