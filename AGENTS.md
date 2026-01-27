# String Extractor - AI Agents Documentation

## Overview

This document outlines the AI agents and automation systems used in the String Extractor VS Code extension development. It provides guidance for AI assistants working on this project.

## Project Context

**String Extractor** is a VS Code extension that identifies repeated string literals in code to improve maintainability and prepare for internationalization. The extension analyzes JavaScript, TypeScript, Python, Java, C#, Go, PHP, and Ruby files.

## AI Agent Roles

### 1. Code Analysis Agent
**Purpose**: Analyze codebase for string extraction opportunities
**Responsibilities**:
- Identify duplicate string literals across files
- Suggest optimal extraction patterns
- Recommend configuration improvements
- Flag potential false positives

### 2. Extension Development Agent
**Purpose**: Maintain and enhance the VS Code extension
**Responsibilities**:
- Implement new features following VS Code extension best practices
- Ensure compatibility with VS Code API updates
- Optimize performance for large codebases
- Maintain TypeScript code quality

### 3. Testing Agent
**Purpose**: Ensure extension reliability
**Responsibilities**:
- Create comprehensive test suites
- Test across multiple programming languages
- Validate configuration options
- Performance testing for large files

### 4. Documentation Agent
**Purpose**: Maintain project documentation
**Responsibilities**:
- Update README.md with new features
- Maintain API documentation
- Create user guides and tutorials
- Keep configuration examples current

## Development Guidelines

### Code Standards
- Use TypeScript for all extension code
- Follow VS Code extension API conventions
- Implement proper error handling
- Use async/await for asynchronous operations
- Maintain backward compatibility

### Testing Requirements
- Unit tests for string analysis logic
- Integration tests for VS Code commands
- Performance benchmarks for large files
- Cross-platform testing (Windows, macOS, Linux)

### Configuration Management
- All settings must have sensible defaults
- Settings should be self-documenting
- Provide examples for complex configurations
- Support workspace-level settings

### Performance Considerations
- Minimize impact on editor performance
- Use debouncing for real-time analysis
- Implement efficient string matching algorithms
- Cache analysis results appropriately

## File Structure

```
src/
├── extension.ts          # Main extension entry point
├── stringAnalyzer.ts     # Core string analysis logic
└── test/                 # Test files

out/                      # Compiled JavaScript output
test/                     # Test files
package.json              # Extension manifest
README.md                 # User documentation
AGENTS.md                 # This file
```

## Key Features to Maintain

1. **Real-time Analysis**: Automatic analysis on file changes
2. **Visual Highlighting**: Customizable highlighting of duplicate strings
3. **Workspace Analysis**: Scan entire projects for duplicates
4. **Configurable Rules**: Flexible ignore patterns and thresholds
5. **Multi-language Support**: Support for 10+ programming languages
6. **Status Bar Integration**: Quick access to analysis results

## Common Issues and Solutions

### Screen Jump Bug
- **Issue**: Editor scrolls when switching files
- **Solution**: Implement debouncing for decoration updates
- **Location**: `src/extension.ts` lines 415-442

### Notification Management
- **Issue**: Notifications persist too long
- **Solution**: Add configurable timeout with auto-dismiss
- **Implementation**: `showTemporaryMessage()` function

### Performance with Large Files
- **Issue**: Slow analysis on large files
- **Solution**: Implement file size limits and progressive analysis
- **Configuration**: Add `maxFileSize` setting

## AI Assistant Instructions

When working on this project:

1. **Always test changes** with sample files from different languages
2. **Update documentation** when adding new features
3. **Consider backward compatibility** for configuration changes
4. **Follow the existing code style** and patterns
5. **Add appropriate error handling** for edge cases
6. **Test performance** with large files (>1000 lines)

## Version Management

- Follow semantic versioning (SemVer)
- Update version in `package.json`
- Document changes in release notes
- Maintain compatibility with VS Code 1.85.0+

## Security Considerations

- Never log or expose sensitive string content
- Sanitize user input in configuration
- Validate regex patterns before use
- Avoid external dependencies when possible

## Contact and Support

For questions about this project:
- Repository: https://github.com/dotjumpdot/string-extractor
- Issues: Use GitHub issue tracker
- License: MIT License (see LICENSE file)

---

*This document is maintained by AI agents working on the String Extractor project. Last updated: 2026-01-27*