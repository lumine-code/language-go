const path = require("path");

describe("WASM Tree-sitter Go grammar", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-go");
  });

  it("passes grammar tests", async () => {
    await runGrammarTests(path.join(__dirname, "fixtures", "sample.go"), /\/\//);
  });

  it("keeps parameter and composite-literal delimiters leaf-rooted", async () => {
    const editor = await lumine.workspace.open();
    const text = "package p\nfunc f(value int) { _ = []int{1, 2} }";
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.go"));
    editor.setText(text);
    await editor.languageMode.ready;

    const scopesAt = (index) =>
      editor
        .scopeDescriptorForBufferPosition(editor.getBuffer().positionForCharacterIndex(index))
        .getScopesArray();

    expect(scopesAt(text.indexOf("f(") + 1)).toContain(
      "punctuation.definition.parameters.begin.bracket.round.go",
    );
    expect(scopesAt(text.indexOf(") {"))).toContain(
      "punctuation.definition.parameters.end.bracket.round.go",
    );
    expect(scopesAt(text.indexOf("int{") + 3)).toContain(
      "punctuation.definition.struct.begin.bracket.curly.go",
    );
    expect(scopesAt(text.indexOf("2}") + 1)).toContain(
      "punctuation.definition.struct.end.bracket.curly.go",
    );
  });
});
