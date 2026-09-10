const { Point } = require("lumine");
const fs = require("fs");
const path = require("path");

const highlightsPath = path.join(__dirname, "..", "grammars", "go-highlights.scm");

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
    const querySource = fs.readFileSync(highlightsPath, "utf8");
    expect(querySource).not.toMatch(/\((?:composite_literal|parameter_list)\s*\n\s*(?:body:|")/);
    expect(querySource).toContain('(#is? test.typeAt "parent parameter_list")');

    const editor = await lumine.workspace.open();
    const text = 'package p\nvar empty = ""\nfunc f(value int) { _ = []int{1, 2} }';
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
    const emptyString = text.indexOf('""');
    expect(scopesAt(emptyString)).toContain("punctuation.definition.string.begin.go");
    expect(scopesAt(emptyString)).not.toContain("punctuation.definition.string.end.go");
    expect(scopesAt(emptyString + 1)).toContain("punctuation.definition.string.end.go");
    expect(scopesAt(emptyString + 1)).not.toContain("punctuation.definition.string.begin.go");
  });

  it("keeps leaf-rooted captures viewport-local and bounded", async () => {
    const editor = await lumine.workspace.open("capture-budget.go");
    editor.setText(
      "package p\r\n" +
        Array.from(
          { length: 1000 },
          (_, index) => `var x${index} = T{A: "value"} // generated`,
        ).join("\r\n"),
    );
    await editor.languageMode.ready;
    const layer = editor.languageMode.rootLanguageLayer;
    const captures = layer.queries.highlightsQuery.captures(layer.tree.rootNode);
    const tileCaptures = layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(400, 0),
      endPosition: new Point(406, 0),
    });

    expect(captures.length).toBeLessThanOrEqual(19000);
    expect(tileCaptures.length).toBeLessThanOrEqual(115);

    const multiline = ["package p", "var x = T{", ...Array(6000).fill("  A: 1,"), "}"].join("\r\n");
    editor.setText(multiline);
    await editor.languageMode.atTransactionEnd();
    const closingRow = editor.getLastBufferRow();
    const closingCaptures = layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(closingRow, 0),
      endPosition: new Point(closingRow, 1),
    });
    expect(
      closingCaptures.some(
        ({ name, node }) =>
          name === "punctuation.definition.struct.end.bracket.curly.go" &&
          node.startPosition.row === closingRow,
      ),
    ).toBe(true);

    const options = {
      startPosition: new Point(3000, 0),
      endPosition: new Point(3006, 0),
    };
    expect(
      layer.queries.highlightsQuery.captures(layer.tree.rootNode, options).length,
    ).toBeLessThanOrEqual(100);
  });
});
