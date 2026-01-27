export interface StringOccurrence {
  value: string;
  line: number;
  column: number;
  length: number;
}

export interface DuplicateStringInfo {
  value: string;
  occurrences: StringOccurrence[];
  count: number;
}

export interface StringAnalysisResult {
  duplicates: DuplicateStringInfo[];
  totalStrings: number;
  uniqueStrings: number;
  duplicateCount: number;
}

export interface AnalyzerConfig {
  minStringLength: number;
  minOccurrenceCount: number;
  ignorePatterns: RegExp[];
  noHighlightPatterns?: RegExp[];
}

export class StringAnalyzer {
  private config: AnalyzerConfig;

  constructor(config: AnalyzerConfig) {
    this.config = config;
  }

  public analyzeDocument(documentContent: string): StringAnalysisResult {
    const stringOccurrences = this.extractStringLiterals(documentContent);
    const duplicateStrings = this.findDuplicates(stringOccurrences);

    return {
      duplicates: duplicateStrings,
      totalStrings: stringOccurrences.length,
      uniqueStrings: new Set(stringOccurrences.map((s) => s.value)).size,
      duplicateCount: duplicateStrings.reduce((sum, d) => sum + d.count, 0),
    };
  }

  private extractStringLiterals(content: string): StringOccurrence[] {
    const occurrences: StringOccurrence[] = [];
    const lines = content.split("\n");

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineStrings = this.extractStringsFromLine(line, lineIndex + 1);
      occurrences.push(...lineStrings);
    }

    return occurrences;
  }

  private extractStringsFromLine(line: string, lineNumber: number): StringOccurrence[] {
    const occurrences: StringOccurrence[] = [];
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

  private shouldIncludeString(str: string): boolean {
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

  private findDuplicates(occurrences: StringOccurrence[]): DuplicateStringInfo[] {
    const stringMap = new Map<string, StringOccurrence[]>();

    for (const occurrence of occurrences) {
      if (!stringMap.has(occurrence.value)) {
        stringMap.set(occurrence.value, []);
      }
      stringMap.get(occurrence.value)!.push(occurrence);
    }

    const duplicates: DuplicateStringInfo[] = [];

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

  public static createDefaultConfig(): AnalyzerConfig {
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

  public static createConfigFromSettings(settings: {
    minStringLength: number;
    minOccurrenceCount: number;
    ignorePatterns: string[];
    noHighlightPatterns?: string[];
  }): AnalyzerConfig {
    return {
      minStringLength: settings.minStringLength,
      minOccurrenceCount: settings.minOccurrenceCount,
      ignorePatterns: settings.ignorePatterns.map((pattern) => new RegExp(pattern)),
      noHighlightPatterns: settings.noHighlightPatterns
        ? settings.noHighlightPatterns.map((pattern) => new RegExp(pattern))
        : undefined,
    };
  }
}
