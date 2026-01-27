# Fix Extension Bugs and Add Features

## 1. Fix Screen Jump Bug

* **Problem**: Editor jumps/scrolls when switching files due to immediate decoration updates

* **Solution**: Add a small delay (debounce) before applying decorations on file switch

* **Files**: `src/extension.ts` (lines 326-330)

* **Changes**: Wrap `refreshAnalysis()` in a `setTimeout` with 100-200ms delay

## 2. Add Timeout to Notifications

* **Problem**: Notifications stay visible until manually dismissed

* **Solution**: Auto-dismiss notifications after 3-5 seconds

* **Files**: `src/extension.ts` (8 notification locations)

* **Changes**: Create a helper function `showTemporaryMessage()` that uses `setTimeout` to dismiss notifications

## 3. Default to Read-Only File Analysis

* **Problem**: Extension analyzes all files automatically on switch

* **Solution**: Add configuration option to disable automatic analysis on file switch

* **Files**:

  * `src/extension.ts` (lines 326-330, 88-98)

  * `package.json` (add new setting)

* **Changes**:

  * Add `stringExtractor.analyzeOnFileSwitch` setting (default: false)

  * Only analyze on explicit commands or document changes in the active file

## 4. Improve Highlight Color Settings

* **Problem**: Limited highlighting options

* **Solution**: Add more color presets and customization options

* **Files**: `package.json`, `src/extension.ts`

* **Changes**:

  * Add `stringExtractor.highlightStyle` setting with options: "background", "border", "underline", "custom"

  * Add preset colors for different highlighting styles

  * Update decoration creation to use selected style

## 5. Add "No Highlight" / CSS Class Feature

* **Problem**: Only inline styles supported, no way to disable highlighting per string

* **Solution**: Add CSS class support and per-string ignore feature

* **Files**:

  * `src/extension.ts`

  * `package.json`

* **Changes**:

  * Add `stringExtractor.useCssClasses` setting

  * Add `stringExtractor.noHighlightPatterns` array for strings to never highlight

  * Support CSS classes in decoration style

  * Add command to ignore specific strings

## Implementation Order:

1. Fix screen jump (quick fix)
2. Add notification timeouts
3. Add analyze-on-switch setting
4. Enhance color/style options
5. Add CSS class and no-highlight features

