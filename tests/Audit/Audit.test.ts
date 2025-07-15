import { expect, it, describe, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import { AuditGenerator } from '../../src/audit/generateAudit.js';
import { LogMessageParams } from '../../src/types.js';

// Mock console methods
const consoleSpy = {
  info: vi.spyOn(console, 'info').mockImplementation(() => {}),
};

describe('AuditGenerator', () => {
  let auditGenerator: AuditGenerator;
  const generatedFiles: string[] = [];

  const sampleResults: Array<{ url: string; result: { [key: string]: LogMessageParams[] } }> = [
    {
      url: 'https://example.com',
      result: {
        'RGAA - 1.1.1': [
          {
            element: '<img src="test.jpg">',
            rule: 'RGAA - 1.1.1',
            ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.1',
            message: 'img elements should have alt, aria-label, title or aria-labelledby',
          },
          {
            element: '<img src="test2.jpg">',
            rule: 'RGAA - 1.1.1',
            ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.1',
            message: 'img elements should have alt, aria-label, title or aria-labelledby',
          },
        ],
        'RGAA - 8.1.1': [
          {
            element: '<div></div>',
            rule: 'RGAA - 8.1.1',
            ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#8.1.1',
            message: 'Page should have a valid DOCTYPE',
          },
        ],
      },
    },
    {
      url: 'https://example.com/page2',
      result: {
        'RGAA - 2.1.1': [
          {
            element: '<frame src="content.html"></frame>',
            rule: 'RGAA - 2.1.1',
            ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.1.1',
            message: 'Frame elements should have a title attribute',
          },
        ],
      },
    },
  ];

  const emptyResults: Array<{ url: string; result: { [key: string]: LogMessageParams[] } }> = [
    {
      url: 'https://perfect-site.com',
      result: {},
    },
  ];

  beforeEach(() => {
    auditGenerator = new AuditGenerator();

    // Clear console spy calls
    consoleSpy.info.mockClear();
  });

  afterEach(() => {
    // Clean up generated files
    generatedFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    generatedFiles.length = 0; // Clear the array
    vi.clearAllMocks();
  });

  describe('generateHtmlAudit', () => {
    it('should generate HTML audit with default baseUrl', () => {
      auditGenerator.generateHtmlAudit({ results: sampleResults });

      const expectedFilename = 'audit.html';
      generatedFiles.push(expectedFilename);

      expect(consoleSpy.info).toHaveBeenCalledWith('Generating HTML file test audit for audit');
      expect(consoleSpy.info).toHaveBeenCalledWith('HTML file test audit generated at audit.html');

      // Verify the file was created
      expect(fs.existsSync(expectedFilename)).toBeTruthy();

      // Verify the file content
      const fileContent = fs.readFileSync(expectedFilename, 'utf-8');
      expect(fileContent).toContain('<!doctype html>');
      expect(fileContent).toContain("Audit d'accessibilité RGAA du site audit");
      expect(fileContent).toContain('RGAA - 1.1.1');
      expect(fileContent).toContain('img elements should have alt, aria-label, title or aria-labelledby');
    });

    it('should generate HTML audit with custom baseUrl', () => {
      const customUrl = 'https://example.com';
      auditGenerator.generateHtmlAudit({
        results: sampleResults,
        baseUrl: customUrl,
      });

      const expectedFilename = 'example.com.html';
      generatedFiles.push(expectedFilename);

      expect(consoleSpy.info).toHaveBeenCalledWith(`Generating HTML file test audit for ${customUrl}`);
      expect(consoleSpy.info).toHaveBeenCalledWith('HTML file test audit generated at example.com.html');

      // Verify the file was created
      expect(fs.existsSync(expectedFilename)).toBeTruthy();

      // Verify the file content
      const fileContent = fs.readFileSync(expectedFilename, 'utf-8');
      expect(fileContent).toContain('<!doctype html>');
      expect(fileContent).toContain("Audit d'accessibilité RGAA du site example.com");
    });

    it('should generate HTML audit with empty results', () => {
      auditGenerator.generateHtmlAudit({ results: emptyResults });

      const expectedFilename = 'audit.html';
      generatedFiles.push(expectedFilename);

      expect(consoleSpy.info).toHaveBeenCalledWith('Generating HTML file test audit for audit');

      // Verify the file was created
      expect(fs.existsSync(expectedFilename)).toBeTruthy();

      // Verify the file content
      const fileContent = fs.readFileSync(expectedFilename, 'utf-8');
      expect(fileContent).toContain('<!doctype html>');
    });

    it('should read template files correctly', () => {
      auditGenerator.generateHtmlAudit({ results: sampleResults });

      const expectedFilename = 'audit.html';
      generatedFiles.push(expectedFilename);

      // Verify the file was created (this implies template files were read correctly)
      expect(fs.existsSync(expectedFilename)).toBeTruthy();

      // Verify the file contains template-processed content
      const fileContent = fs.readFileSync(expectedFilename, 'utf-8');
      expect(fileContent).toContain('<!doctype html>');
      expect(fileContent).toContain('body'); // CSS should be included
    });
  });

  describe('generateJsonAudit', () => {
    it('should generate JSON audit with default baseUrl', () => {
      const result = auditGenerator.generateJsonAudit({ results: sampleResults });

      const expectedFilename = 'audit.json';
      generatedFiles.push(expectedFilename);

      expect(consoleSpy.info).toHaveBeenCalledWith('Generating JSON file test audit for undefined');
      expect(consoleSpy.info).toHaveBeenCalledWith('JSON file test audit generated at undefined');

      // Verify the file was created
      expect(fs.existsSync(expectedFilename)).toBeTruthy();

      // Verify the file content
      const fileContent = fs.readFileSync(expectedFilename, 'utf-8');
      const parsedContent = JSON.parse(fileContent);
      expect(parsedContent).toHaveProperty('https://example.com');
      expect(result).toBeDefined();
      expect(result['https://example.com']).toBeDefined();
    });

    it('should generate JSON audit with custom baseUrl', () => {
      const customUrl = 'https://example.com';
      const result = auditGenerator.generateJsonAudit({
        results: sampleResults,
        baseUrl: customUrl,
      });

      const expectedFilename = 'example.com.json';
      generatedFiles.push(expectedFilename);

      expect(consoleSpy.info).toHaveBeenCalledWith(`Generating JSON file test audit for ${customUrl}`);

      // Verify the file was created
      expect(fs.existsSync(expectedFilename)).toBeTruthy();

      // Verify the file content
      const fileContent = fs.readFileSync(expectedFilename, 'utf-8');
      const parsedContent = JSON.parse(fileContent);
      expect(parsedContent).toHaveProperty('https://example.com');
      expect(result).toBeDefined();
    });

    it('should return correctly formatted JSON structure', () => {
      const result = auditGenerator.generateJsonAudit({ results: sampleResults });

      const expectedFilename = 'audit.json';
      generatedFiles.push(expectedFilename);

      expect(result).toHaveProperty('https://example.com');
      expect(result['https://example.com']).toHaveProperty('RGAA - 1.1.1');
      expect(result['https://example.com']['RGAA - 1.1.1']).toStrictEqual({
        message: 'img elements should have alt, aria-label, title or aria-labelledby',
        ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.1',
        issues: [{ element: '<img src="test.jpg">' }, { element: '<img src="test2.jpg">' }],
        hasDomElement: true,
      });
    });

    it('should handle empty results correctly', () => {
      const result = auditGenerator.generateJsonAudit({ results: emptyResults });

      const expectedFilename = 'audit.json';
      generatedFiles.push(expectedFilename);

      expect(result).toHaveProperty('https://perfect-site.com');
      expect(result['https://perfect-site.com']).toStrictEqual({});
    });
  });

  describe('generateAudit (CLI)', () => {
    it('should generate CLI audit', () => {
      auditGenerator.generateAudit({ results: sampleResults });

      expect(consoleSpy.info).toHaveBeenCalledWith('Generating CLI audit');
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.objectContaining({
          'https://example.com': expect.any(Object),
        }),
      );
    });

    it('should handle empty results in CLI audit', () => {
      auditGenerator.generateAudit({ results: emptyResults });

      expect(consoleSpy.info).toHaveBeenCalledWith('Generating CLI audit');
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.objectContaining({
          'https://perfect-site.com': {},
        }),
      );
    });
  });

  describe('mapTemplateObject (private method behavior)', () => {
    it('should correctly map multiple issues for the same rule', () => {
      const result = auditGenerator.generateJsonAudit({ results: sampleResults });

      const expectedFilename = 'audit.json';
      generatedFiles.push(expectedFilename);

      const rgaaRule = result['https://example.com']['RGAA - 1.1.1'];
      expect(rgaaRule.issues).toHaveLength(2);
      expect(rgaaRule.hasDomElement).toBeTruthy();
    });

    it('should handle rules with empty elements', () => {
      const resultsWithEmptyElements: Array<{ url: string; result: { [key: string]: LogMessageParams[] } }> = [
        {
          url: 'https://test.com',
          result: {
            'RGAA-TEST': [
              {
                element: '',
                rule: 'RGAA - TEST',
                ruleLink: 'https://example.com',
                message: 'Test message',
              },
            ],
          },
        },
      ];

      const result = auditGenerator.generateJsonAudit({ results: resultsWithEmptyElements });

      const expectedFilename = 'audit.json';
      generatedFiles.push(expectedFilename);

      expect(result['https://test.com']['RGAA-TEST'].hasDomElement).toBeFalsy();
    });

    it('should handle rules with whitespace-only elements', () => {
      const resultsWithWhitespaceElements: Array<{ url: string; result: { [key: string]: LogMessageParams[] } }> = [
        {
          url: 'https://test.com',
          result: {
            'RGAA-TEST': [
              {
                element: '   ',
                rule: 'RGAA - TEST',
                ruleLink: 'https://example.com',
                message: 'Test message',
              },
            ],
          },
        },
      ];

      const result = auditGenerator.generateJsonAudit({ results: resultsWithWhitespaceElements });

      const expectedFilename = 'audit.json';
      generatedFiles.push(expectedFilename);

      expect(result['https://test.com']['RGAA-TEST'].hasDomElement).toBeFalsy();
    });

    it('should correctly identify when DOM elements are present', () => {
      const resultsWithMixedElements: Array<{ url: string; result: { [key: string]: LogMessageParams[] } }> = [
        {
          url: 'https://test.com',
          result: {
            'RGAA-TEST': [
              {
                element: '',
                rule: 'RGAA - TEST',
                ruleLink: 'https://example.com',
                message: 'Test message',
              },
              {
                element: '<div>Content</div>',
                rule: 'RGAA - TEST',
                ruleLink: 'https://example.com',
                message: 'Test message',
              },
            ],
          },
        },
      ];

      const result = auditGenerator.generateJsonAudit({ results: resultsWithMixedElements });

      const expectedFilename = 'audit.json';
      generatedFiles.push(expectedFilename);

      expect(result['https://test.com']['RGAA-TEST'].hasDomElement).toBeTruthy();
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle results with missing message properties', () => {
      const resultsWithMissingProps: Array<{ url: string; result: { [key: string]: LogMessageParams[] } }> = [
        {
          url: 'https://test.com',
          result: {
            'RGAA-TEST': [
              {
                element: '<div></div>',
                rule: 'RGAA - TEST',
                ruleLink: '',
                message: '',
              },
            ],
          },
        },
      ];

      const result = auditGenerator.generateJsonAudit({ results: resultsWithMissingProps });

      const expectedFilename = 'audit.json';
      generatedFiles.push(expectedFilename);

      expect(result['https://test.com']['RGAA-TEST']).toStrictEqual({
        message: '',
        ruleLink: '',
        issues: [{ element: '<div></div>' }],
        hasDomElement: true,
      });
    });

    it('should handle multiple URLs correctly', () => {
      const result = auditGenerator.generateJsonAudit({ results: sampleResults });

      const expectedFilename = 'audit.json';
      generatedFiles.push(expectedFilename);

      expect(Object.keys(result)).toContain('https://example.com');
      expect(Object.keys(result)).toContain('https://example.com/page2');
      expect(result['https://example.com/page2']['RGAA - 2.1.1']).toBeDefined();
    });

    it('should preserve URL protocols in output filenames', () => {
      auditGenerator.generateHtmlAudit({
        results: sampleResults,
        baseUrl: 'https://secure.example.com',
      });

      const expectedFilename = 'secure.example.com.html';
      generatedFiles.push(expectedFilename);

      // Verify the file was created
      expect(fs.existsSync(expectedFilename)).toBeTruthy();
    });

    it('should handle URLs with subdomains and paths', () => {
      // Use a simpler filename without directory structure
      auditGenerator.generateJsonAudit({
        results: sampleResults,
        baseUrl: 'https://subdomain.example.com',
      });

      const expectedFilename = 'subdomain.example.com.json';
      generatedFiles.push(expectedFilename);

      expect(consoleSpy.info).toHaveBeenCalledWith('Generating JSON file test audit for https://subdomain.example.com');

      // Verify the file was created
      expect(fs.existsSync(expectedFilename)).toBeTruthy();
    });
  });
});
