<div align="center">

# String Extractor

**Identify repeated string literals and improve code maintainability**

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/dotjumpdot/string-extractor)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.85.0+-brightgreen.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-success.svg)]()

A powerful VS Code extension that automatically identifies repeated string literals, hardcoded messages, URLs, and paths that could benefit from being extracted as constants. Perfect for improving code maintainability, preparing for internationalization, and reducing technical debt.

## Extension Information

| Property            | Details                            |
| ------------------- | ---------------------------------- |
| **Extension ID**    | `StringExtractor.string-extractor` |
| **Publisher**       | DotJumpDot                         |
| **Version**         | 0.0.2                              |
| **VS Code Minimum** | 1.85.0+                            |
| **License**         | MIT                                |

[![Install](https://img.shields.io/badge/Marketplace-Install-blue.svg)](https://marketplace.visualstudio.com/items?itemName=StringExtractor.string-extractor)
[![Extension Link](https://img.shields.io/badge/Extension-View-orange.svg)](https://marketplace.visualstudio.com/items?itemName=StringExtractor.string-extractor)

</div>

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Supported Languages](#supported-languages)
- [Best Practices](#best-practices)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Capabilities

- Real-time analysis of your active file as you type and edit
- Automatic analysis when switching between editor tabs (configurable)
- Visual highlighting of duplicate strings with customizable colors and styles
- Status bar integration showing duplicate count at a glance
- Workspace-wide scanning for duplicate strings across multiple files
- Detailed analysis reports with occurrence locations and file information

### Customization

- Configurable minimum string length and occurrence count thresholds
- Flexible ignore patterns for URLs, paths, and specific patterns
- Multiple highlighting styles: background, border, underline, or custom
- CSS class support for advanced styling
- Per-string highlighting control via exclusion patterns

### Developer Experience

- Keyboard shortcuts for quick analysis access
- Dedicated commands for settings and shortcuts management
- Multi-language support for popular programming languages
- Lightweight design with minimal performance impact
- Comprehensive notification system with auto-dismiss options

---

## Installation

### Via VS Code Marketplace

1. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS) to open the Extensions panel
2. Search for **"String Extractor"**
3. Click **Install**

### Via Command Palette

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type **"Extensions: Install Extensions"**
3. Search for **"String Extractor"**

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/dotjumpdot/string-extractor/releases)
2. Unzip the downloaded file
3. Open VS Code and go to **Extensions → ... → Install from VSIX**
4. Select the downloaded `.vsix` file

---

## Getting Started

### Automatic Analysis

The extension automatically analyzes your active file when:

- You open a supported file type
- You switch to a different editor tab (if enabled in settings)
- You make changes to the document

### Manual Analysis

Run analysis commands from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command                                   | Description                               |
| ----------------------------------------- | ----------------------------------------- |
| **Analyze File for String Literals**      | Analyze the current file and show results |
| **Analyze Workspace for String Literals** | Scan all supported files in workspace     |
| **Toggle String Highlighting**            | Enable/disable visual highlighting        |
| **Show String Analysis Report**           | View detailed analysis report             |
| **Open Settings**                         | Quick access to extension configuration   |
| **Open Keyboard Shortcuts**               | View and customize keyboard shortcuts     |

### Viewing Results

**Status Bar**: Displays the number of duplicate strings found. Click it to view the detailed report.

**Editor Highlighting**: Duplicate strings are highlighted with customizable styles. Hover over highlighted strings to see details.

**Report Panel**: Comprehensive analysis showing:

- Total strings analyzed
- Unique string count
- Duplicate strings with occurrence counts
- Line numbers and file locations

---

## Configuration

Configure the extension in VS Code settings (`Ctrl+,` / `Cmd+,`) under **String Extractor**.

### Available Settings

| Setting                               | Type    | Default                  | Description                                                       |
| ------------------------------------- | ------- | ------------------------ | ----------------------------------------------------------------- |
| `stringExtractor.minStringLength`     | number  | `5`                      | Minimum string length to consider for extraction                  |
| `stringExtractor.minOccurrenceCount`  | number  | `2`                      | Minimum occurrence count to flag a string                         |
| `stringExtractor.ignorePatterns`      | array   | `[...]`                  | Regex patterns to ignore (URLs, paths, etc.)                      |
| `stringExtractor.highlightDuplicates` | boolean | `true`                   | Highlight duplicate string literals in editor                     |
| `stringExtractor.highlightColor`      | string  | `rgba(255, 165, 0, 0.2)` | Color for highlighting duplicate strings                          |
| `stringExtractor.highlightStyle`      | string  | `background`             | Highlighting style: `background`, `border`, `underline`, `custom` |
| `stringExtractor.useCssClasses`       | boolean | `false`                  | Use CSS classes instead of inline styles                          |
| `stringExtractor.showStatusBar`       | boolean | `true`                   | Show duplicate count in status bar                                |
| `stringExtractor.analyzeOnFileSwitch` | boolean | `true`                   | Automatically analyze files when switching                        |
| `stringExtractor.notificationTimeout` | number  | `3000`                   | Notification timeout in milliseconds (0 = no auto-dismiss)        |
| `stringExtractor.noHighlightPatterns` | array   | `[]`                     | Regex patterns for strings to never highlight                     |

### Example Configuration

```json
{
  "stringExtractor.minStringLength": 8,
  "stringExtractor.minOccurrenceCount": 3,
  "stringExtractor.ignorePatterns": [
    "^http",
    "^https",
    "^/",
    "^\\./",
    "^\\.\\./",
    "^\\w+$",
    "^\\d+$",
    "^console\\.log",
    "^throw new Error",
    "^[\\s\\n]*$"
  ],
  "stringExtractor.highlightColor": "rgba(255, 0, 0, 0.15)",
  "stringExtractor.highlightStyle": "border",
  "stringExtractor.analyzeOnFileSwitch": false,
  "stringExtractor.notificationTimeout": 5000
}
```

---

## Supported Languages

String Extractor supports analysis for the following programming languages:

- JavaScript
- TypeScript
- JavaScript React (JSX)
- TypeScript React (TSX)
- Python
- Java
- C#
- Go
- PHP
- Ruby

---

## Best Practices

### When to Extract Strings

Consider extracting strings when:

- A string appears multiple times in your code (2+ occurrences)
- The string represents user-facing text (may need i18n)
- The string is a configuration value or magic string
- The string is a repeated error message or validation text
- The string is a URL or API endpoint

### Example: Before

```javascript
function validateUser(user) {
  if (!user.email) {
    throw new Error("Email is required");
  }
  if (!user.password) {
    throw new Error("Password is required");
  }
}

function login(email, password) {
  if (!email) {
    throw new Error("Email is required");
  }
  if (!password) {
    throw new Error("Password is required");
  }
}
```

### Example: After

```javascript
const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
};

function validateUser(user) {
  if (!user.email) {
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }
  if (!user.password) {
    throw new Error(ERROR_MESSAGES.PASSWORD_REQUIRED);
  }
}

function login(email, password) {
  if (!email) {
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }
  if (!password) {
    throw new Error(ERROR_MESSAGES.PASSWORD_REQUIRED);
  }
}
```

---

## Keyboard Shortcuts

### Default Shortcuts

| Shortcut         | Command                          | Platform      |
| ---------------- | -------------------------------- | ------------- |
| `Ctrl+Alt+Space` | Analyze File for String Literals | Windows/Linux |
| `Cmd+Alt+Space`  | Analyze File for String Literals | macOS         |

### Customizing Shortcuts

Customize keyboard shortcuts in **File > Preferences > Keyboard Shortcuts**:

```json
{
  "key": "ctrl+shift+s",
  "command": "stringExtractor.analyzeFile"
}
```

To view and edit all String Extractor shortcuts, use the **"Open Keyboard Shortcuts"** command from the Command Palette.

---

## Performance

String Extractor is designed to be lightweight and efficient:

- **Optimized Analysis**: Runs on document changes, not on every keystroke
- **Async Processing**: Workspace analysis scans files asynchronously
- **Decoration API**: Uses VS Code's native Decoration API for optimal rendering
- **No External Dependencies**: Self-contained with no database requirements
- **Minimal Footprint**: Efficient string matching algorithms

---

## Troubleshooting

### Highlighting Not Showing

1. Verify `stringExtractor.highlightDuplicates` is enabled in settings
2. Check that the file type is supported
3. Ensure strings meet minimum length and occurrence requirements

### False Positives

If you encounter false positives:

1. Add custom ignore patterns to settings
2. Increase `minStringLength` or `minOccurrenceCount` thresholds
3. Temporarily toggle highlighting: `stringExtractor.toggleHighlighting`
4. Use `noHighlightPatterns` for specific strings to exclude

### Performance Issues

If you experience performance issues:

1. Increase `minStringLength` to reduce matches
2. Increase `minOccurrenceCount` to focus on significant duplicates
3. Disable status bar: `stringExtractor.showStatusBar = false`
4. Disable highlighting: `stringExtractor.highlightDuplicates = false`
5. Disable auto-analysis on file switch: `stringExtractor.analyzeOnFileSwitch = false`

---

## Contributing

We welcome contributions! Here's how you can help:

### Reporting Issues

- Use the [issue tracker](https://github.com/dotjumpdot/string-extractor/issues) for bug reports
- Include detailed steps to reproduce
- Provide your VS Code version and extension version

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/dotjumpdot/string-extractor.git

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run tests
npm test

# Run linter
npm run lint

# Watch for changes
npm run watch
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright © 2026 [DotJumpDot](https://github.com/dotjumpdot)

---

## Acknowledgments

- Built with [VS Code Extension API](https://code.visualstudio.com/api)
- Inspired by the need for better code maintainability and internationalization preparation
- Uses efficient string matching algorithms for optimal performance
- Thanks to all contributors who help improve this extension

---

<div align="center">

**Made with ❤️ by DotJumpDot**

[⬆ Back to Top](#string-extractor)

</div>
