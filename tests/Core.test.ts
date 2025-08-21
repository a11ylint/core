import { expect, it, describe, beforeEach, afterEach } from 'vitest';
import { unlinkSync, existsSync } from 'fs';
import { Core } from '../src/core.js';
import type { SvgImageArea } from '../src/rules/RGAA1.js';
import type { VirtualContrastsElement } from '../src/rules/RGAA3.js';

describe('Core', () => {
  let core: Core;
  let mockDocument: Document;
  let generatedFiles: string[] = [];

  beforeEach(() => {
    core = new Core();
    generatedFiles = [];

    // Mock document basique
    mockDocument = {
      title: 'Test Page',
      documentElement: { lang: 'fr' },
      doctype: {
        name: 'html',
        publicId: '',
        systemId: '',
      },
      firstChild: { nodeType: 1 },
    } as Document;
  });

  afterEach(() => {
    // Nettoyer les fichiers HTML générés pendant les tests
    generatedFiles.forEach(file => {
      if (existsSync(file)) {
        unlinkSync(file);
      }
    });
    generatedFiles = [];
  });

  describe('run method', () => {
    it('should return empty grouped results when no violations are found', () => {
      const result = core.run({
        mode: 'virtual',
        document: mockDocument,
        images: [],
        frames: [],
        colorsElements: [],
      });

      expect(result).toStrictEqual({});
    });

    it('should group results by RGAA rule when violations are found', () => {
      const mockImages: SvgImageArea[] = [
        {
          type: 'img',
          outerHTML: '<img src="test.jpg">',
          alt: undefined,
          title: undefined,
          ariaLabel: undefined,
          ariaLabelledby: null,
        },
      ];

      const mockColors: VirtualContrastsElement[] = [
        {
          backgroundColor: 'rgb(255, 255, 255)',
          textColor: 'rgb(200, 200, 200)',
          fontSize: '16px',
          fontWeight: '400',
          outerHTML: '<p>Low contrast text</p>',
        },
      ];

      const result = core.run({
        mode: 'virtual',
        document: mockDocument,
        images: mockImages,
        frames: [],
        colorsElements: mockColors,
      });

      // Vérifier que les résultats sont groupés par règle
      expect(typeof result).toBe('object');

      // Vérifier qu'il y a des violations d'images
      expect(Array.isArray(result['RGAA - 1.1.1'])).toBeTruthy();
      expect(result['RGAA - 1.1.1'].length).toBeGreaterThan(0);

      // Vérifier qu'il y a des violations de contraste
      const contrastRules = Object.keys(result).filter(key => key.startsWith('RGAA - 3.2'));
      expect(contrastRules.length).toBeGreaterThan(0);
    });

    it('should sort results by RGAA rule number', () => {
      const mockImages: SvgImageArea[] = [
        {
          type: 'img',
          outerHTML: '<img src="test.jpg">',
          alt: undefined,
          title: undefined,
          ariaLabel: undefined,
          ariaLabelledby: null,
        },
      ];

      const mockColors: VirtualContrastsElement[] = [
        {
          backgroundColor: 'rgb(255, 255, 255)',
          textColor: 'rgb(200, 200, 200)',
          fontSize: '16px',
          fontWeight: '400',
          outerHTML: '<p>Low contrast text</p>',
        },
      ];

      // Mock document sans titre pour déclencher RGAA 8.5
      const badDocument = {
        ...mockDocument,
        title: '',
      };

      const result = core.run({
        mode: 'virtual',
        document: badDocument,
        images: mockImages,
        frames: [],
        colorsElements: mockColors,
      });

      const keys = Object.keys(result);

      // Vérifier que les clés sont triées par ordre numérique
      let isInOrder = false;
      for (let i = 1; i < keys.length; i++) {
        const currentRule = keys[i].match(/(\d+\.\d+(?:\.\d+)?)/)?.[0];
        const previousRule = keys[i - 1].match(/(\d+\.\d+(?:\.\d+)?)/)?.[0];

        if (currentRule && previousRule) {
          const currentParts = currentRule.split('.').map(Number);
          const previousParts = previousRule.split('.').map(Number);

          // Comparer les parties numériques
          for (let j = 0; j < Math.max(currentParts.length, previousParts.length); j++) {
            const current = currentParts[j] ?? 0;
            const previous = previousParts[j] ?? 0;
            if (current > previous) {
              isInOrder = true;
              break;
            } else if (current < previous) {
              break;
            }
          }
        }
        expect(isInOrder).toBeTruthy();
      }
    });

    it('should handle dom mode', () => {
      const result = core.run({
        mode: 'dom',
        document: mockDocument,
        images: [],
        frames: [],
        colorsElements: [],
      });

      expect(typeof result).toBe('object');
    });

    it('should handle custom iframe banned words', () => {
      const mockFrames = [
        Object.assign(document.createElement('iframe'), {
          title: 'Advertisement frame',
        }),
      ];

      const result = core.run({
        mode: 'dom',
        document: mockDocument,
        images: [],
        frames: mockFrames,
        colorsElements: [],
        customIframeBannedWords: ['advertisement', 'ads'],
      });

      expect(typeof result).toBe('object');
    });

    it('should validate document properties', () => {
      // Document sans lang
      const noLangDocument = {
        ...mockDocument,
        documentElement: { lang: '' },
      } as Document;

      const result = core.run({
        mode: 'virtual',
        document: noLangDocument,
        images: [],
        frames: [],
        colorsElements: [],
      });

      // Devrait avoir une violation RGAA 8.3 (lang manquant)
      expect(result['RGAA - 8.3'].length).toBeGreaterThan(0);
    });

    it('should handle multiple color contrast violations', () => {
      const mockColors: VirtualContrastsElement[] = [
        {
          backgroundColor: 'rgb(255, 255, 255)',
          textColor: 'rgb(200, 200, 200)',
          fontSize: '14px',
          fontWeight: '400',
          outerHTML: '<p>Low contrast small text</p>',
        },
        {
          backgroundColor: 'rgb(255, 255, 255)',
          textColor: 'rgb(180, 180, 180)',
          fontSize: '16px',
          fontWeight: '600',
          outerHTML: '<p>Low contrast bold text</p>',
        },
        {
          backgroundColor: 'rgb(255, 255, 255)',
          textColor: 'rgb(190, 190, 190)',
          fontSize: '26px',
          fontWeight: '400',
          outerHTML: '<h1>Low contrast large text</h1>',
        },
      ];

      const result = core.run({
        mode: 'virtual',
        document: mockDocument,
        images: [],
        frames: [],
        colorsElements: mockColors,
      });

      // Vérifier que différentes règles de contraste sont déclenchées
      const contrastRules = Object.keys(result).filter(key => key.startsWith('RGAA - 3.2'));
      const totalViolations = contrastRules.reduce((sum, rule) => sum + result[rule].length, 0);

      expect(totalViolations).toBeGreaterThan(0);
    });

    it('should handle empty arrays gracefully', () => {
      const result = core.run({
        mode: 'virtual',
        document: mockDocument,
        customIframeBannedWords: [],
        images: [],
        frames: [],
        colorsElements: [],
      });

      expect(typeof result).toBe('object');
    });
  });

  describe('generateAudit method', () => {
    it('should throw error when no audit format is specified', () => {
      const results = [
        {
          url: 'https://example.com',
          result: {
            'RGAA - 1.1.1': [],
          },
        },
      ];

      expect(() => {
        core.generateAudit({
          results,
          options: { html: false, json: false, cli: false },
        });
      }).toThrow('No audit format specified');
    });

    it('should not throw when at least one format is specified', () => {
      const results = [
        {
          url: 'https://example.com',
          result: {
            'RGAA - 1.1.1': [],
          },
        },
      ];

      expect(() => {
        core.generateAudit({
          results,
          options: { html: false, json: false, cli: true },
        });
      }).not.toThrow();
    });

    it('should handle html format with baseUrl', () => {
      const results = [
        {
          url: 'https://example.com',
          result: {
            'RGAA - 1.1.1': [],
          },
        },
      ];

      const baseUrl = 'https://test.com';
      const expectedFileName = `${baseUrl.replace(/https?:\/\//, '')}.html`;
      generatedFiles.push(expectedFileName);

      expect(() => {
        core.generateAudit({
          results,
          options: { html: true, baseUrl },
        });
      }).not.toThrow();
    });

    it('should use default options when not provided', () => {
      const results = [
        {
          url: 'https://example.com',
          result: {
            'RGAA - 1.1.1': [],
          },
        },
      ];

      expect(() => {
        core.generateAudit({
          results,
          options: { cli: true },
        });
      }).not.toThrow();
    });
  });
});
