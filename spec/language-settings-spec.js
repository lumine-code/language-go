describe("go editing settings", () => {
  let editor;
  beforeEach(async () => {
    jasmine.useRealClock();
    editor = null;
    await lumine.packages.activatePackage("language-go");
  });
  afterEach(() => editor?.destroy());
  async function start(scope, text = "value") {
    editor ??= await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName(scope));
    editor.setText(text);
    expect(await editor.whenGrammarSettled()).toBe(true);
    editor.update({ autoIndent: false });
  }
  it("selects workspace checksums without treating a workspace manifest as go.mod", () => {
    for (const file of ["go.sum", "go.work.sum"])
      expect(
        lumine.grammars.selectGrammar(file, "example.org/module v1.0.0 h1:abcdef=\n").scopeName,
      ).toBe("source.sum");
    expect(lumine.grammars.selectGrammar("go.work", "go 1.24\nuse ./module\n").scopeName).not.toBe(
      "source.mod",
    );
    expect(lumine.grammars.selectGrammar("checksums.sum", "hash\n").scopeName).not.toBe(
      "source.sum",
    );
  });
  it("leaves checksum lines unchanged when comment toggling has no valid delimiter", async () => {
    const text = "example.org/module v1.0.0 h1:abcdef=\n";
    await start("source.sum", text);
    const comments = await editor.getCommentDelimitersForBufferPosition([0, 0]);
    expect(comments.line).toBeUndefined();
    expect(comments.block).toBeUndefined();
    await editor.toggleLineCommentsForBufferRows(0, 0);
    expect(editor.getText()).toBe(text);
  });
});
