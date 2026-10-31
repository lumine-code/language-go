describe("go conservative indentation", () => {
  let editor;
  beforeEach(async () => {
    editor = null;
    jasmine.useRealClock();
    await lumine.packages.activatePackage("language-go");
  });
  afterEach(() => editor?.destroy());
  async function start(file, text) {
    if (!editor || !editor.getPath()?.endsWith(file)) {
      editor?.destroy();
      editor = await lumine.workspace.open(file);
    }
    editor.update({ autoIndent: true, tabLength: 2, softTabs: true });
    editor.setText(text);
    expect(await editor.whenGrammarSettled()).toBe(true);
  }
  describe("go", () => {
    it("indents Enter inside a block", async () => {
      await start("indentation.go", "func main() {\n}");
      editor.setCursorBufferPosition([0, Infinity]);
      await editor.insertNewline();
      expect(editor.lineTextForBufferRow(1)).toBe("  ");
    });
    it("dedents a typed closing brace", async () => {
      await start("indentation.go", "func main() {\n  run()\n  ");
      editor.setCursorBufferPosition([2, Infinity]);
      await editor.insertText("}", { autoIndent: true, autoDecreaseIndent: true });
      await editor.whenGrammarSettled();
      expect(editor.lineTextForBufferRow(2)).toBe("}");
    });
    it("reindents a body and its closing delimiter once", async () => {
      await start("indentation.go", "func main() {\nrun()\n}");
      await editor.autoIndentBufferRows(0, 2);
      expect(editor.getText()).toBe("func main() {\n  run()\n}");
    });
    it("does not add indent after a complete one-line block or delimiters in a comment", async () => {
      for (const text of ["func main() { run() }", "// { [ ("]) {
        await start("indentation.go", text);
        editor.moveToEndOfLine();
        await editor.insertNewline();
        expect(editor.lineTextForBufferRow(1)).toBe("");
      }
    });
    it("preserves multiline literal whitespace during reindent", async () => {
      const source = "package main\nvar value = `first\n      { [ (\n  last`";
      await start("indentation.go", source);
      await editor.autoIndentBufferRows(0, editor.getLastBufferRow());
      expect(editor.getText()).toBe(source);
    });
    it("preserves multiline comment interiors during reindent", async () => {
      const source = "/* first\n      { [ (\n  last */";
      await start("indentation.go", source);
      await editor.autoIndentBufferRows(0, editor.getLastBufferRow());
      expect(editor.getText()).toBe(source);
    });
  });
  it("aligns switch and select cases with their owning statement", async () => {
    for (const text of [
      "switch value {\ncase 1:\n  run()\ncase 2:\n  stop()\n}",
      "select {\ncase <-ready:\n  run()\ndefault:\n  stop()\n}",
    ]) {
      await start(
        "test.go",
        "package main\nfunc main() {\n  " + text.replace(/\n/g, "\n  ") + "\n}",
      );
      expect(await editor.suggestedIndentForBufferRow(3)).toBe(1);
      expect(await editor.suggestedIndentForBufferRow(4)).toBe(2);
      expect(await editor.suggestedIndentForBufferRow(5)).toBe(1);
      expect(await editor.suggestedIndentForBufferRow(7)).toBe(1);
    }
  });
  it("indents grouped module requirements and aligns the closing parenthesis", async () => {
    await start("go.mod", "module example.org/demo\nrequire (\nexample.org/module v1.0.0\n)");
    await editor.autoIndentBufferRows(0, 3);
    expect(editor.lineTextForBufferRow(2)).toBe("  example.org/module v1.0.0");
    expect(editor.lineTextForBufferRow(3)).toBe(")");
  });
  it("balances template branches and complete inline template actions", async () => {
    await start("test.gotmpl", "{{ if .Ready }}\n  ready\n{{ else }}\n  waiting\n{{ end }}");
    expect(await editor.suggestedIndentForBufferRow(1)).toBe(1);
    expect(await editor.suggestedIndentForBufferRow(2)).toBe(0);
    expect(await editor.suggestedIndentForBufferRow(3)).toBe(1);
    expect(await editor.suggestedIndentForBufferRow(4)).toBe(0);
    editor.setText("{{ if .Ready }}ready{{ end }}");
    await editor.whenGrammarSettled();
    editor.setCursorBufferPosition([0, Infinity]);
    await editor.insertNewline();
    expect(editor.lineTextForBufferRow(1)).toBe("");
  });

  it("preserves multiline raw values and comments in templates", async () => {
    for (const source of [
      "{{ $value := `first\n      if { (\n  last` }}",
      "{{/* first\n      if { (\n  last */}}",
    ]) {
      await start("literal.gotmpl", source);
      await editor.autoIndentBufferRows(0, editor.getLastBufferRow());
      expect(editor.getText()).toBe(source);
    }
  });

  it("aligns a standalone template branch only when its complete tag is typed", async () => {
    for (const tag of ["{{ end }}", "{{ else }}", "{{- end -}}", "{{- else -}}"]) {
      await start("typed.gotmpl", "{{ if .Ready }}\n  body\n  ");
      editor.setCursorBufferPosition([2, Infinity]);
      for (const character of tag) {
        await editor.insertText(character, { autoIndent: true, autoDecreaseIndent: true });
        await editor.whenGrammarSettled();
        if (editor.lineTextForBufferRow(2).trim() !== tag) {
          expect(editor.lineTextForBufferRow(2).startsWith("  ")).toBe(true);
        }
      }
      expect(editor.lineTextForBufferRow(2)).toBe(tag);
    }
  });

  it("matches the nested template owner and preserves inline output when typing", async () => {
    for (const [source, tag, expected] of [
      ["{{ if .Outer }}\n  {{ range .Items }}\n    body\n    ", "{{ end }}", "  {{ end }}"],
      ["{{ if .Ready }}\n  body\n  output ", "{{ end }}", "  output {{ end }}"],
      ["{{ if .Ready }}\n  body\n  output ", "{{ else }}", "  output {{ else }}"],
    ]) {
      await start("inline.gotmpl", source);
      const row = editor.getLastBufferRow();
      editor.setCursorBufferPosition([row, Infinity]);
      for (const character of tag) {
        await editor.insertText(character, { autoIndent: true, autoDecreaseIndent: true });
        await editor.whenGrammarSettled();
      }
      expect(editor.lineTextForBufferRow(row)).toBe(expected);
    }
  });

  it("keeps a manual correction when text is typed after a completed template tag", async () => {
    await start("manual.gotmpl", "{{ if .Ready }}\n  body\n    {{ end }}");
    editor.setCursorBufferPosition([2, Infinity]);
    for (const character of " output") {
      await editor.insertText(character, { autoIndent: true, autoDecreaseIndent: true });
      await editor.whenGrammarSettled();
    }
    expect(editor.lineTextForBufferRow(2)).toBe("    {{ end }} output");
  });

  it("bounds the preceding template text inspected when a standalone end tag is typed", async () => {
    await start("long.gotmpl", "{{ if .Ready }}\n" + "  body\n".repeat(12000) + "  ");
    const row = editor.getLastBufferRow();
    editor.setCursorBufferPosition([row, Infinity]);
    for (const character of "{{ end }}") {
      await editor.insertText(character, { autoIndent: true, autoDecreaseIndent: true });
      await editor.whenGrammarSettled();
    }
    expect(editor.lineTextForBufferRow(row)).toBe("{{ end }}");
  });
});
