import { describe, expect, it } from 'vitest';
import { RGAA9, type HeadingVirtualElement } from '../../src/rules/RGAA9.js';

describe('RGAA9', () => {
  const rgaa9 = new RGAA9();

  describe('RGAA9.1.1 - Is the hierarchy between headings relevant?', () => {
    describe('DOM Element', () => {
      it('should validate correct heading hierarchy (h1 -> h2 -> h3)', () => {
        const h1Element = document.createElement('h1');
        h1Element.textContent = 'Main Title';
        const h2Element = document.createElement('h2');
        h2Element.textContent = 'Subtitle';
        const h3Element = document.createElement('h3');
        h3Element.textContent = 'Sub-subtitle';

        const result = rgaa9.RGAA911([h1Element, h2Element, h3Element]);
        expect(result).toHaveLength(0);
      });

      it('should invalidate heading hierarchy with skipped levels going down (h1 -> h3 is NOT ok)', () => {
        const h1Element = document.createElement('h1');
        h1Element.textContent = 'Main Title';
        const h3Element = document.createElement('h3');
        h3Element.textContent = 'Sub-subtitle';

        const result = rgaa9.RGAA911([h1Element, h3Element]);
        expect(result).toHaveLength(1);
        expect(result[0].rule).toBe('RGAA - 9.1.1');
        expect(result[0].message).toBe('The hierarchy between headings must be relevant');
      });

      it('should invalidate heading hierarchy jumping more than one level (h1 -> h3 -> h5)', () => {
        const h1Element = document.createElement('h1');
        h1Element.textContent = 'Main Title';
        const h3Element = document.createElement('h3');
        h3Element.textContent = 'Sub-subtitle';
        const h5Element = document.createElement('h5');
        h5Element.textContent = 'Deep subtitle';

        const result = rgaa9.RGAA911([h1Element, h3Element, h5Element]);
        expect(result).toHaveLength(2); // h3 et h5 sont tous les deux des sauts invalides
        expect(result[0].rule).toBe('RGAA - 9.1.1');
        expect(result[1].rule).toBe('RGAA - 9.1.1');
        expect(result[0].message).toBe('The hierarchy between headings must be relevant');
      });

      it('should validate going back up one level (h1 -> h2 -> h1)', () => {
        const h1Element = document.createElement('h1');
        h1Element.textContent = 'Main Title';
        const h2Element = document.createElement('h2');
        h2Element.textContent = 'Subtitle';
        const h1Element2 = document.createElement('h1');
        h1Element2.textContent = 'Another main title';

        const result = rgaa9.RGAA911([h1Element, h2Element, h1Element2]);
        expect(result).toHaveLength(0);
      });

      it('should validate going back up one level (h1 -> h2 -> h3 -> h2)', () => {
        const h1Element = document.createElement('h1');
        h1Element.textContent = 'Main Title';
        const h2Element = document.createElement('h2');
        h2Element.textContent = 'Subtitle';
        const h3Element = document.createElement('h3');
        h3Element.textContent = 'Sub-subtitle';
        const h2Element2 = document.createElement('h2');
        h2Element2.textContent = 'Another subtitle';

        const result = rgaa9.RGAA911([h1Element, h2Element, h3Element, h2Element2]);
        expect(result).toHaveLength(0);
      });

      it('should invalidate going back up multiple levels (h1 -> h2 -> h3 -> h4 -> h2)', () => {
        const h1Element = document.createElement('h1');
        h1Element.textContent = 'Main Title';
        const h2Element = document.createElement('h2');
        h2Element.textContent = 'Subtitle';
        const h3Element = document.createElement('h3');
        h3Element.textContent = 'Sub-subtitle';
        const h4Element = document.createElement('h4');
        h4Element.textContent = 'Deep subtitle';
        const h2Element2 = document.createElement('h2');
        h2Element2.textContent = 'Another subtitle';

        const result = rgaa9.RGAA911([h1Element, h2Element, h3Element, h4Element, h2Element2]);
        expect(result).toHaveLength(1); // h2Element2 fait un saut de h4 -> h2 (pas autorisé)
        expect(result[0].rule).toBe('RGAA - 9.1.1');
        expect(result[0].message).toBe('The hierarchy between headings must be relevant');
      });

      it('should validate heading with role="heading" and aria-level', () => {
        const h1Element = document.createElement('h1');
        h1Element.textContent = 'Main Title';
        const divElement = document.createElement('div');
        divElement.setAttribute('role', 'heading');
        divElement.setAttribute('aria-level', '2');
        divElement.textContent = 'Custom heading';

        const result = rgaa9.RGAA911([h1Element, divElement]);
        expect(result).toHaveLength(0);
      });

      it('should validate single heading', () => {
        const h2Element = document.createElement('h2');
        h2Element.textContent = 'Single heading';

        const result = rgaa9.RGAA911([h2Element]);
        expect(result).toHaveLength(0);
      });

      it('should validate empty array', () => {
        const result = rgaa9.RGAA911([]);
        expect(result).toHaveLength(0);
      });
    });

    describe('Virtual Element', () => {
      it('should validate correct heading hierarchy with virtual elements', () => {
        const virtualHeadings: HeadingVirtualElement[] = [
          {
            type: 'heading',
            tagName: 'H1',
            textContent: 'Main Title',
            outerHTML: '<h1>Main Title</h1>',
            index: 0,
          },
          {
            type: 'heading',
            tagName: 'H2',
            textContent: 'Subtitle',
            outerHTML: '<h2>Subtitle</h2>',
            index: 1,
          },
          {
            type: 'heading',
            tagName: 'H3',
            textContent: 'Sub-subtitle',
            outerHTML: '<h3>Sub-subtitle</h3>',
            index: 2,
          },
        ];

        const result = rgaa9.RGAA911(virtualHeadings);
        expect(result).toHaveLength(0);
      });

      it('should invalidate incorrect heading hierarchy with virtual elements (h1 -> h4)', () => {
        const virtualHeadings: HeadingVirtualElement[] = [
          {
            type: 'heading',
            tagName: 'H1',
            textContent: 'Main Title',
            outerHTML: '<h1>Main Title</h1>',
            index: 0,
          },
          {
            type: 'heading',
            tagName: 'H4',
            textContent: 'Jump to h4',
            outerHTML: '<h4>Jump to h4</h4>',
            index: 1,
          },
        ];

        const result = rgaa9.RGAA911(virtualHeadings);
        expect(result).toHaveLength(1);
        expect(result[0].rule).toBe('RGAA - 9.1.1');
      });

      it('should validate heading with role and aria-level', () => {
        const virtualHeadings: HeadingVirtualElement[] = [
          {
            type: 'heading',
            tagName: 'H1',
            textContent: 'Main Title',
            outerHTML: '<h1>Main Title</h1>',
            index: 0,
          },
          {
            type: 'heading',
            tagName: 'DIV',
            role: 'heading',
            ariaLevel: '2',
            textContent: 'Custom heading',
            outerHTML: '<div role="heading" aria-level="2">Custom heading</div>',
            index: 1,
          },
        ];

        const result = rgaa9.RGAA911(virtualHeadings);
        expect(result).toHaveLength(0);
      });
    });
  });

  describe('RGAA9.1.3 - Is each heading properly structured?', () => {
    describe('DOM Element', () => {
      it('should validate standard heading tags (h1-h6)', () => {
        const h1Element = document.createElement('h1');
        const h2Element = document.createElement('h2');
        const h3Element = document.createElement('h3');
        const h4Element = document.createElement('h4');
        const h5Element = document.createElement('h5');
        const h6Element = document.createElement('h6');

        const result = rgaa9.RGAA913([h1Element, h2Element, h3Element, h4Element, h5Element, h6Element]);
        expect(result).toHaveLength(0);
      });

      it('should validate element with role="heading" and aria-level', () => {
        const divElement = document.createElement('div');
        divElement.setAttribute('role', 'heading');
        divElement.setAttribute('aria-level', '2');
        divElement.textContent = 'Custom heading';

        const result = rgaa9.RGAA913([divElement]);
        expect(result).toHaveLength(0);
      });

      it('should invalidate element with role="heading" but no aria-level', () => {
        const divElement = document.createElement('div');
        divElement.setAttribute('role', 'heading');
        divElement.textContent = 'Invalid heading';

        const result = rgaa9.RGAA913([divElement]);
        expect(result).toHaveLength(1);
        expect(result[0].rule).toBe('RGAA - 9.1.3');
        expect(result[0].message).toBe(
          'Each heading must be structured with a <hx> tag or with role="heading" and aria-level attributes',
        );
      });

      it('should invalidate element with role="heading" and invalid aria-level', () => {
        const divElement = document.createElement('div');
        divElement.setAttribute('role', 'heading');
        divElement.setAttribute('aria-level', 'invalid');
        divElement.textContent = 'Invalid heading';

        const result = rgaa9.RGAA913([divElement]);
        expect(result).toHaveLength(1);
        expect(result[0].rule).toBe('RGAA - 9.1.3');
      });

      it('should invalidate non-heading element', () => {
        const divElement = document.createElement('div');
        divElement.textContent = 'Not a heading';

        const result = rgaa9.RGAA913([divElement]);
        expect(result).toHaveLength(1);
        expect(result[0].rule).toBe('RGAA - 9.1.3');
      });
    });

    describe('Virtual Element', () => {
      it('should validate virtual heading elements', () => {
        const virtualHeadings: HeadingVirtualElement[] = [
          {
            type: 'heading',
            tagName: 'H1',
            textContent: 'Main Title',
            outerHTML: '<h1>Main Title</h1>',
          },
          {
            type: 'heading',
            tagName: 'DIV',
            role: 'heading',
            ariaLevel: '2',
            textContent: 'Custom heading',
            outerHTML: '<div role="heading" aria-level="2">Custom heading</div>',
          },
        ];

        const result = rgaa9.RGAA913(virtualHeadings);
        expect(result).toHaveLength(0);
      });

      it('should invalidate virtual element with role="heading" but no aria-level', () => {
        const virtualHeadings: HeadingVirtualElement[] = [
          {
            type: 'heading',
            tagName: 'DIV',
            role: 'heading',
            textContent: 'Invalid heading',
            outerHTML: '<div role="heading">Invalid heading</div>',
          },
        ];

        const result = rgaa9.RGAA913(virtualHeadings);
        expect(result).toHaveLength(1);
        expect(result[0].rule).toBe('RGAA - 9.1.3');
      });

      it('should invalidate virtual element that is not a heading', () => {
        const virtualHeadings: HeadingVirtualElement[] = [
          {
            type: 'heading',
            tagName: 'DIV',
            textContent: 'Not a heading',
            outerHTML: '<div>Not a heading</div>',
          },
        ];

        const result = rgaa9.RGAA913(virtualHeadings);
        expect(result).toHaveLength(1);
        expect(result[0].rule).toBe('RGAA - 9.1.3');
      });
    });
  });
});
