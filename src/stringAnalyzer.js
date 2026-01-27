"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringAnalyzer = void 0;
class StringAnalyzer {
    constructor(config) {
        this.config = config;
    }
    analyzeDocument(documentContent) {
        const stringOccurrences = this.extractStringLiterals(documentContent);
        const duplicateStrings = this.findDuplicates(stringOccurrences);
        return {
            duplicates: duplicateStrings,
            totalStrings: stringOccurrences.length,
            uniqueStrings: new Set(stringOccurrences.map((s) => s.value)).size,
            duplicateCount: duplicateStrings.reduce((sum, d) => sum + d.count, 0),
        };
    }
    extractStringLiterals(content) {
        const occurrences = [];
        const lines = content.split("\n");
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const lineStrings = this.extractStringsFromLine(line, lineIndex + 1);
            occurrences.push(...lineStrings);
        }
        return occurrences;
    }
    extractStringsFromLine(line, lineNumber) {
        const occurrences = [];
        const patterns = [
            { regex: /"([^"\\]*(\\.[^"\\]*)*)"/g, quoteLength: 2 },
            { regex: /'([^'\\]*(\\.[^'\\]*)*)'/g, quoteLength: 2 },
            { regex: /`([^`\\]*(\\.[^`\\]*)*)`/g, quoteLength: 2 },
        ];
        for (const pattern of patterns) {
            let match;
            pattern.regex.lastIndex = 0;
            while ((match = pattern.regex.exec(line)) !== null) {
                const stringValue = match[1];
                if (this.shouldIncludeString(stringValue)) {
                    occurrences.push({
                        value: stringValue,
                        line: lineNumber,
                        column: match.index + 1,
                        length: match[0].length,
                    });
                }
            }
        }
        return occurrences;
    }
    shouldIncludeString(str) {
        if (str.length < this.config.minStringLength) {
            return false;
        }
        for (const pattern of this.config.ignorePatterns) {
            if (pattern.test(str)) {
                return false;
            }
        }
        return true;
    }
    findDuplicates(occurrences) {
        const stringMap = new Map();
        for (const occurrence of occurrences) {
            if (!stringMap.has(occurrence.value)) {
                stringMap.set(occurrence.value, []);
            }
            stringMap.get(occurrence.value).push(occurrence);
        }
        const duplicates = [];
        for (const [value, occs] of stringMap.entries()) {
            if (occs.length >= this.config.minOccurrenceCount) {
                duplicates.push({
                    value,
                    occurrences: occs,
                    count: occs.length,
                });
            }
        }
        return duplicates.sort((a, b) => b.count - a.count);
    }
    static createDefaultConfig() {
        return {
            minStringLength: 5,
            minOccurrenceCount: 2,
            ignorePatterns: [
                /^http/,
                /^https/,
                /^\//,
                /^\.\//,
                /^\.\.\//,
                /^\w+$/,
                /^\d+$/,
                /^console\.log/,
                /^throw new Error/,
                /^[\s\n]*$/,
            ],
        };
    }
    static createConfigFromSettings(settings) {
        return {
            minStringLength: settings.minStringLength,
            minOccurrenceCount: settings.minOccurrenceCount,
            ignorePatterns: settings.ignorePatterns.map((p) => new RegExp(p)),
        };
    }
}
exports.StringAnalyzer = StringAnalyzer;
//# sourceMappingURL=stringAnalyzer.js.map