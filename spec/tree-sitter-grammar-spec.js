const path = require("path");

describe("WASM Tree-sitter Go grammar", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-go");
  });

  it("passes grammar tests", async () => {
    await runGrammarTests(path.join(__dirname, "fixtures", "sample.go"), /\/\//);
  });

  async function openFixture(name) {
    const editor = await lumine.workspace.open(path.join(__dirname, "fixtures", name));
    await editor.languageMode.ready;
    return editor;
  }

  function scopesAt(editor, needle, offset = 0) {
    const index = editor.getText().indexOf(needle);
    expect(index).not.toBe(-1);
    const position = editor.getBuffer().positionForCharacterIndex(index + offset);
    return editor.scopeDescriptorForBufferPosition(position).getScopesArray();
  }

  it("selects and highlights go.mod files", async () => {
    const editor = await openFixture("sample.go.mod");

    expect(editor.getGrammar().scopeName).toBe("source.mod");
    expect(scopesAt(editor, "module")).toContain("keyword.control.go-mod");
    expect(scopesAt(editor, "example.com/lumine/sample")).toContain("string.unquoted.path.go-mod");
  });

  it("selects and highlights go.sum files", async () => {
    const editor = await openFixture("sample.go.sum");

    expect(editor.getGrammar().scopeName).toBe("source.sum");
    expect(scopesAt(editor, "github.com/tree-sitter/go-tree-sitter")).toContain(
      "string.unquoted.path.gosum",
    );
    expect(scopesAt(editor, "h1:", 3)).toContain("string.unquoted.checksum.gosum");
  });

  it("selects and highlights Go text templates", async () => {
    const editor = await openFixture("sample.gotmpl");

    expect(editor.getGrammar().scopeName).toBe("source.gotemplate");
    expect(scopesAt(editor, "define")).toContain("keyword.control.directive.gotemplate");
    expect(scopesAt(editor, "printf")).toContain("support.function.builtin.gotemplate");
  });

  it("selects the Go HTML template wrapper", async () => {
    await lumine.packages.activatePackage("language-html");
    const editor = await openFixture("sample.gohtml");

    expect(editor.getGrammar().scopeName).toBe("text.html.gohtml");
    expect(scopesAt(editor, "if")).toContain("keyword.control.conditional.gotemplate");
    expect(scopesAt(editor, "<h1>", 1).some((scope) => scope.startsWith("entity.name.tag"))).toBe(
      true,
    );
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
