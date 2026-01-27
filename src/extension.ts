import * as vscode from "vscode";
import {
  StringAnalyzer,
  StringAnalysisResult,
  StringOccurrence,
  DuplicateStringInfo,
} from "./stringAnalyzer";

function showTemporaryMessage(message: string, type: "info" | "warning" | "error" = "info"): void {
  const config = vscode.workspace.getConfiguration("stringExtractor");
  const timeoutMs = config.get("notificationTimeout", 3000);

  const showFunction =
    type === "info"
      ? vscode.window.showInformationMessage
      : type === "warning"
        ? vscode.window.showWarningMessage
        : vscode.window.showErrorMessage;

  const promise = showFunction(message);

  if (timeoutMs > 0) {
    setTimeout(() => {
      promise.then(
        () => {},
        () => {}
      );
    }, timeoutMs);
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("String Extractor extension is now active!");

  function createDecorationType(): vscode.TextEditorDecorationType {
    const config = vscode.workspace.getConfiguration("stringExtractor");
    const highlightColor = config.get("highlightColor", "rgba(255, 165, 0, 0.2)");
    const highlightStyle = config.get("highlightStyle", "background") as
      | "background"
      | "border"
      | "underline"
      | "custom";
    const useCssClasses = config.get("useCssClasses", false);

    const decorationOptions: vscode.DecorationRenderOptions = {
      overviewRulerColor: "orange",
      overviewRulerLane: vscode.OverviewRulerLane.Right,
    };

    switch (highlightStyle) {
      case "background":
        decorationOptions.backgroundColor = highlightColor;
        decorationOptions.border = `1px solid ${highlightColor.replace(/[\d.]+\)$/, "0.5)")}`;
        break;
      case "border":
        decorationOptions.border = `2px solid ${highlightColor.replace(/[\d.]+\)$/, "0.8)")}`;
        decorationOptions.borderWidth = "2px";
        break;
      case "underline":
        decorationOptions.textDecoration = `underline solid ${highlightColor.replace(/[\d.]+\)$/, "0.8)")} 2px`;
        break;
      case "custom":
        decorationOptions.backgroundColor = highlightColor;
        decorationOptions.border = `1px solid ${highlightColor.replace(/[\d.]+\)$/, "0.5)")}`;
        break;
    }

    if (useCssClasses) {
      decorationOptions.before = {
        contentText: "",
        backgroundColor: highlightColor,
      };
    }

    return vscode.window.createTextEditorDecorationType(decorationOptions);
  }

  let decorationType = createDecorationType();

  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.command = "stringExtractor.showReport";

  let currentAnalysis: StringAnalysisResult | null = null;
  let currentDocument: vscode.TextDocument | null = null;
  let highlightingEnabled = vscode.workspace
    .getConfiguration("stringExtractor")
    .get("highlightDuplicates", true);

  const analyzer = createAnalyzer();

  function createAnalyzer(): StringAnalyzer {
    const config = vscode.workspace.getConfiguration("stringExtractor");
    const analyzerConfig = StringAnalyzer.createConfigFromSettings({
      minStringLength: config.get("minStringLength", 5),
      minOccurrenceCount: config.get("minOccurrenceCount", 2),
      ignorePatterns: config.get("ignorePatterns", []),
      noHighlightPatterns: config.get("noHighlightPatterns", []),
    });
    return new StringAnalyzer(analyzerConfig);
  }

  function analyzeDocument(document: vscode.TextDocument): StringAnalysisResult {
    return analyzer.analyzeDocument(document.getText());
  }

  function updateDecorations(editor: vscode.TextEditor | undefined) {
    if (!editor || !highlightingEnabled || !currentAnalysis) {
      editor?.setDecorations(decorationType, []);
      return;
    }

    const config = vscode.workspace.getConfiguration("stringExtractor");
    const noHighlightPatternStrings = config.get("noHighlightPatterns", []);
    const noHighlightPatterns = noHighlightPatternStrings.map((p: string) => new RegExp(p));

    const decorations: vscode.DecorationOptions[] = [];

    for (const duplicate of currentAnalysis.duplicates) {
      const shouldHighlight = !noHighlightPatterns.some((pattern: RegExp) =>
        pattern.test(duplicate.value)
      );

      if (!shouldHighlight) {
        continue;
      }

      for (const occurrence of duplicate.occurrences) {
        const range = new vscode.Range(
          new vscode.Position(occurrence.line - 1, occurrence.column - 1),
          new vscode.Position(occurrence.line - 1, occurrence.column - 1 + occurrence.length)
        );

        decorations.push({
          range,
          hoverMessage: `Duplicate string: "${duplicate.value}"\nOccurs ${duplicate.count} time(s) in this file`,
        });
      }
    }

    editor.setDecorations(decorationType, decorations);
  }

  function updateStatusBar() {
    if (!vscode.workspace.getConfiguration("stringExtractor").get("showStatusBar", true)) {
      statusBar.hide();
      return;
    }

    if (currentAnalysis && currentAnalysis.duplicates.length > 0) {
      statusBar.text = `$(warning) ${currentAnalysis.duplicates.length} duplicate(s)`;
      statusBar.tooltip = "Click to see detailed analysis report";
      statusBar.show();
    } else {
      statusBar.text = "$(check) No duplicates";
      statusBar.tooltip = "No duplicate strings found";
      statusBar.show();
    }
  }

  function refreshAnalysis() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    currentDocument = editor.document;
    currentAnalysis = analyzeDocument(editor.document);
    updateDecorations(editor);
    updateStatusBar();
  }

  const analyzeFileCommand = vscode.commands.registerCommand(
    "stringExtractor.analyzeFile",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        showTemporaryMessage("No active editor found", "warning");
        return;
      }

      refreshAnalysis();

      if (currentAnalysis && currentAnalysis.duplicates.length > 0) {
        showTemporaryMessage(
          `Analysis complete: Found ${currentAnalysis.duplicates.length} duplicate string(s) in ${currentAnalysis.totalStrings} total string(s)`,
          "info"
        );
      } else {
        showTemporaryMessage("Analysis complete: No duplicate strings found", "info");
      }
    }
  );

  const analyzeWorkspaceCommand = vscode.commands.registerCommand(
    "stringExtractor.analyzeWorkspace",
    async () => {
      const files = await vscode.workspace.findFiles(
        "**/*.{js,ts,jsx,tsx,py,java,cs,go,php,rb}",
        "**/node_modules/**"
      );

      if (files.length === 0) {
        showTemporaryMessage("No supported files found in workspace", "warning");
        return;
      }

      const allDuplicates = new Map<string, DuplicateStringInfo>();
      let totalStrings = 0;

      for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        const result = analyzer.analyzeDocument(document.getText());
        totalStrings += result.totalStrings;

        for (const duplicate of result.duplicates) {
          if (allDuplicates.has(duplicate.value)) {
            const existing = allDuplicates.get(duplicate.value)!;
            existing.occurrences.push(...duplicate.occurrences);
            existing.count += duplicate.count;
          } else {
            allDuplicates.set(duplicate.value, { ...duplicate });
          }
        }
      }

      const sortedDuplicates = Array.from(allDuplicates.values()).sort((a, b) => b.count - a.count);

      if (sortedDuplicates.length === 0) {
        showTemporaryMessage("Workspace analysis complete: No duplicate strings found", "info");
        return;
      }

      const panel = vscode.window.createWebviewPanel(
        "stringExtractor.report",
        "String Analysis Report",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      const duplicatesHtml = sortedDuplicates
        .map(
          (d) => `
      <tr>
        <td><code>${escapeHtml(d.value)}</code></td>
        <td>${d.count}</td>
        <td>${d.occurrences.length} file(s)</td>
      </tr>
    `
        )
        .join("");

      panel.webview.html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>String Analysis Report</title>
        <style>
          body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); background: var(--vscode-editor-background); }
          h1 { color: var(--vscode-foreground); }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid var(--vscode-widget-border); padding: 8px 12px; text-align: left; }
          th { background: var(--vscode-editor-inactiveSelectionBackground); }
          code { font-family: var(--vscode-editor-font-family); background: var(--vscode-textCodeBlock-background); padding: 2px 6px; border-radius: 3px; }
          .summary { margin-bottom: 20px; padding: 15px; background: var(--vscode-editor-inactiveSelectionBackground); border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Workspace String Analysis Report</h1>
        <div class="summary">
          <p><strong>Total Files Scanned:</strong> ${files.length}</p>
          <p><strong>Total Strings:</strong> ${totalStrings}</p>
          <p><strong>Duplicate Strings:</strong> ${sortedDuplicates.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>String Value</th>
              <th>Occurrences</th>
              <th>Files</th>
            </tr>
          </thead>
          <tbody>
            ${duplicatesHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

      showTemporaryMessage(
        `Workspace analysis complete: Found ${sortedDuplicates.length} duplicate string(s) across ${files.length} file(s)`,
        "info"
      );
    }
  );

  const toggleHighlightingCommand = vscode.commands.registerCommand(
    "stringExtractor.toggleHighlighting",
    () => {
      highlightingEnabled = !highlightingEnabled;

      const editor = vscode.window.activeTextEditor;
      if (editor) {
        updateDecorations(editor);
      }

      showTemporaryMessage(
        `String highlighting ${highlightingEnabled ? "enabled" : "disabled"}`,
        "info"
      );
    }
  );

  const showReportCommand = vscode.commands.registerCommand("stringExtractor.showReport", () => {
    if (!currentAnalysis) {
      showTemporaryMessage('No analysis available. Run "Analyze File" first.', "info");
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "stringExtractor.report",
      "String Analysis Report",
      vscode.ViewColumn.One,
      {}
    );

    const duplicatesHtml = currentAnalysis.duplicates
      .map(
        (d) => `
      <tr>
        <td><code>${escapeHtml(d.value)}</code></td>
        <td>${d.count}</td>
        <td>
          ${d.occurrences.map((o) => `Line ${o.line}`).join(", ")}
        </td>
      </tr>
    `
      )
      .join("");

    panel.webview.html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>String Analysis Report</title>
        <style>
          body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); background: var(--vscode-editor-background); }
          h1 { color: var(--vscode-foreground); }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid var(--vscode-widget-border); padding: 8px 12px; text-align: left; }
          th { background: var(--vscode-editor-inactiveSelectionBackground); }
          code { font-family: var(--vscode-editor-font-family); background: var(--vscode-textCodeBlock-background); padding: 2px 6px; border-radius: 3px; }
          .summary { margin-bottom: 20px; padding: 15px; background: var(--vscode-editor-inactiveSelectionBackground); border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>File String Analysis Report</h1>
        <div class="summary">
          <p><strong>File:</strong> ${currentDocument?.fileName || "Unknown"}</p>
          <p><strong>Total Strings:</strong> ${currentAnalysis.totalStrings}</p>
          <p><strong>Unique Strings:</strong> ${currentAnalysis.uniqueStrings}</p>
          <p><strong>Duplicate Strings:</strong> ${currentAnalysis.duplicates.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>String Value</th>
              <th>Occurrences</th>
              <th>Line Numbers</th>
            </tr>
          </thead>
          <tbody>
            ${duplicatesHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;
  });

  const openSettingsCommand = vscode.commands.registerCommand(
    "stringExtractor.openSettings",
    () => {
      vscode.commands.executeCommand("workbench.action.openSettings", "stringExtractor");
    }
  );

  const openKeybindingsCommand = vscode.commands.registerCommand(
    "stringExtractor.openKeybindings",
    () => {
      vscode.commands.executeCommand("workbench.action.openGlobalKeybindings", "stringExtractor");
    }
  );

  context.subscriptions.push(
    decorationType,
    statusBar,
    analyzeFileCommand,
    analyzeWorkspaceCommand,
    toggleHighlightingCommand,
    showReportCommand,
    openSettingsCommand,
    openKeybindingsCommand
  );

  const documentChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document === event.document) {
      refreshAnalysis();
    }
  });

  let activeEditorChangeTimeout: NodeJS.Timeout | undefined;

  const activeEditorChangeDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (activeEditorChangeTimeout) {
      clearTimeout(activeEditorChangeTimeout);
    }

    if (
      editor &&
      vscode.workspace.getConfiguration("stringExtractor").get("analyzeOnFileSwitch", false)
    ) {
      activeEditorChangeTimeout = setTimeout(() => {
        const visibleRanges = editor.visibleRanges;
        const selection = editor.selection;

        currentDocument = editor.document;
        currentAnalysis = analyzeDocument(editor.document);
        updateDecorations(editor);
        updateStatusBar();

        setTimeout(() => {
          if (editor.visibleRanges.length > 0 && visibleRanges.length > 0) {
            editor.revealRange(visibleRanges[0], vscode.TextEditorRevealType.AtTop);
            editor.selection = selection;
          }
        }, 10);
      }, 150);
    }
  });

  const configChangeDisposable = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("stringExtractor")) {
      decorationType.dispose();
      decorationType = createDecorationType();

      const newAnalyzer = createAnalyzer();
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        currentAnalysis = newAnalyzer.analyzeDocument(editor.document.getText());
        updateDecorations(editor);
        updateStatusBar();
      }
    }
  });

  context.subscriptions.push(
    documentChangeDisposable,
    activeEditorChangeDisposable,
    configChangeDisposable
  );

  const editor = vscode.window.activeTextEditor;
  if (editor) {
    refreshAnalysis();
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function deactivate() {
  console.log("String Extractor extension is now deactivated");
}
