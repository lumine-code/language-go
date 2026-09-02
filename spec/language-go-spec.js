describe("Go Tree-sitter indentation", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-go");
  });

  it("indents a block body and dedents its closing brace", async () => {
    const editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.go"));
    editor.setText("package main\nfunc main() {\nvalue := 1\n}\n");
    await editor.languageMode.ready;

    expect(editor.suggestedIndentForBufferRow(2)).toBe(1);
    expect(editor.suggestedIndentForBufferRow(3)).toBe(0);
  });
});
