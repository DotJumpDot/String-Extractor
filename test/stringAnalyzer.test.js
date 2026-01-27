"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const stringAnalyzer_1 = require("../src/stringAnalyzer");
suite("StringAnalyzer Test Suite", () => {
    test("should extract single-quoted strings", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 1,
            minOccurrenceCount: 1,
            ignorePatterns: [],
        });
        const content = "const name = 'hello';";
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.totalStrings, 1);
        assert.strictEqual(result.uniqueStrings, 1);
        assert.strictEqual(result.duplicates.length, 1);
        assert.strictEqual(result.duplicates[0].value, "hello");
    });
    test("should extract double-quoted strings", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 1,
            minOccurrenceCount: 1,
            ignorePatterns: [],
        });
        const content = 'const name = "world";';
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.totalStrings, 1);
        assert.strictEqual(result.duplicates[0].value, "world");
    });
    test("should extract template literal strings", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 1,
            minOccurrenceCount: 1,
            ignorePatterns: [],
        });
        const content = "const name = `template`;";
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.totalStrings, 1);
        assert.strictEqual(result.duplicates[0].value, "template");
    });
    test("should detect duplicate strings", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 1,
            minOccurrenceCount: 2,
            ignorePatterns: [],
        });
        const content = `
      const a = "duplicate";
      const b = "duplicate";
      const c = "unique";
    `;
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.duplicates.length, 1);
        assert.strictEqual(result.duplicates[0].value, "duplicate");
        assert.strictEqual(result.duplicates[0].count, 2);
    });
    test("should respect minStringLength setting", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 5,
            minOccurrenceCount: 1,
            ignorePatterns: [],
        });
        const content = `
      const a = "short";
      const b = "longer string";
    `;
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.totalStrings, 1);
        assert.strictEqual(result.duplicates[0].value, "longer string");
    });
    test("should respect ignore patterns", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 1,
            minOccurrenceCount: 1,
            ignorePatterns: [/^http/, /^console/],
        });
        const content = `
      const url = "http://example.com";
      const log = "console.log";
      const valid = "valid string";
    `;
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.totalStrings, 1);
        assert.strictEqual(result.duplicates[0].value, "valid string");
    });
    test("should handle escaped quotes in strings", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 1,
            minOccurrenceCount: 1,
            ignorePatterns: [],
        });
        const content = 'const text = "hello \\"world\\"";';
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.totalStrings, 1);
        assert.strictEqual(result.duplicates[0].value, 'hello \\"world\\"');
    });
    test("should count total strings correctly", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 1,
            minOccurrenceCount: 1,
            ignorePatterns: [],
        });
        const content = `
      const a = "first";
      const b = "second";
      const c = "third";
      const d = "first";
    `;
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.totalStrings, 4);
        assert.strictEqual(result.uniqueStrings, 3);
    });
    test("should sort duplicates by occurrence count", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 1,
            minOccurrenceCount: 2,
            ignorePatterns: [],
        });
        const content = `
      const a = "low";
      const b = "high";
      const c = "high";
      const d = "low";
      const e = "low";
      const f = "high";
    `;
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.duplicates.length, 2);
        assert.strictEqual(result.duplicates[0].value, "low");
        assert.strictEqual(result.duplicates[0].count, 3);
        assert.strictEqual(result.duplicates[1].value, "high");
        assert.strictEqual(result.duplicates[1].count, 2);
    });
    test("should return empty result for document with no strings", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 1,
            minOccurrenceCount: 1,
            ignorePatterns: [],
        });
        const content = "const num = 123;";
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.totalStrings, 0);
        assert.strictEqual(result.uniqueStrings, 0);
        assert.strictEqual(result.duplicates.length, 0);
    });
    test("should track line and column information", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 1,
            minOccurrenceCount: 1,
            ignorePatterns: [],
        });
        const content = 'const a = "test";';
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.duplicates[0].occurrences[0].line, 1);
        assert.strictEqual(result.duplicates[0].occurrences[0].column, 10);
    });
    test("should handle multiple quotes in same line", () => {
        const analyzer = new stringAnalyzer_1.StringAnalyzer({
            minStringLength: 1,
            minOccurrenceCount: 1,
            ignorePatterns: [],
        });
        const content = 'const a = "first", b = "second", c = "third";';
        const result = analyzer.analyzeDocument(content);
        assert.strictEqual(result.totalStrings, 3);
        assert.strictEqual(result.uniqueStrings, 3);
    });
    test("should use default config correctly", () => {
        const config = stringAnalyzer_1.StringAnalyzer.createDefaultConfig();
        assert.strictEqual(config.minStringLength, 5);
        assert.strictEqual(config.minOccurrenceCount, 2);
        assert.strictEqual(config.ignorePatterns.length, 10);
    });
    test("should create config from settings", () => {
        const config = stringAnalyzer_1.StringAnalyzer.createConfigFromSettings({
            minStringLength: 3,
            minOccurrenceCount: 2,
            ignorePatterns: ["^test", "^demo"],
        });
        assert.strictEqual(config.minStringLength, 3);
        assert.strictEqual(config.minOccurrenceCount, 2);
        assert.strictEqual(config.ignorePatterns.length, 2);
    });
});
//# sourceMappingURL=stringAnalyzer.test.js.map