import { describe, expect, it } from 'vitest';
import { RGAA6, type AnchorVirtualElement } from '../../src/rules/RGAA6.js';

describe('RGAA6', () => {
  const rgaa6 = new RGAA6('dom');

  describe('RGAA6.2 - Does each link have a label?', () => {
    describe('DOM Element', () => {
      it('should validate a link with text', () => {
        const linkElement = document.createElement('a');
        linkElement.href = 'https://example.com';
        linkElement.textContent = 'Link to example.com';

        const result = rgaa6.RGAA62([linkElement]);
        expect(result).toHaveLength(0);
      });

      it('should validate a link with aria-label', () => {
        const linkElement = document.createElement('a');
        linkElement.href = 'https://example.com';
        linkElement.setAttribute('aria-label', 'Go to example site');

        const result = rgaa6.RGAA62([linkElement]);
        expect(result).toHaveLength(0);
      });

      it('should validate a link with aria-labelledby', () => {
        const linkElement = document.createElement('a');
        linkElement.href = 'https://example.com';
        linkElement.setAttribute('aria-labelledby', 'link-description');

        const result = rgaa6.RGAA62([linkElement]);
        expect(result).toHaveLength(0);
      });

      it('should validate a link with title', () => {
        const linkElement = document.createElement('a');
        linkElement.href = 'https://example.com';
        linkElement.title = 'Example.com site';

        const result = rgaa6.RGAA62([linkElement]);
        expect(result).toHaveLength(0);
      });

      it('should detect a link without label', () => {
        const linkElement = document.createElement('a');
        linkElement.href = 'https://example.com';

        const result = rgaa6.RGAA62([linkElement]);
        expect(result).toHaveLength(1);
        expect(result[0].rule).toBe('RGAA - 6.2.1');
        expect(result[0].message).toBe('Each link must have a label (text or alternative)');
      });

      it('should ignore anchors (links with #)', () => {
        const linkElement = document.createElement('a');
        linkElement.href = '#section1';

        const result = rgaa6.RGAA62([linkElement]);
        expect(result).toHaveLength(0);
      });
    });

    describe('Virtual Element', () => {
      const rgaa6Virtual = new RGAA6('virtual');
      it('should validate a link with text', () => {
        const linkElement: AnchorVirtualElement = {
          type: 'link',
          textContent: 'Link to example.com',
          outerHTML: '<a href="https://example.com">Link to example.com</a>',
        };

        const result = rgaa6Virtual.RGAA62([linkElement]);
        expect(result).toHaveLength(0);
      });

      it('should validate a link with aria-label', () => {
        const linkElement: AnchorVirtualElement = {
          type: 'link',
          textContent: '',
          ariaLabel: 'Go to example site',
          outerHTML: '<a href="https://example.com" aria-label="Go to example site"></a>',
        };

        const result = rgaa6Virtual.RGAA62([linkElement]);
        expect(result).toHaveLength(0);
      });

      it('should validate a link with aria-labelledby', () => {
        const linkElement: AnchorVirtualElement = {
          type: 'link',
          textContent: '',
          ariaLabelledby: 'link-description',
          outerHTML: '<a href="https://example.com" aria-labelledby="link-description"></a>',
        };

        const result = rgaa6Virtual.RGAA62([linkElement]);
        expect(result).toHaveLength(0);
      });

      it('should validate a link with title', () => {
        const linkElement: AnchorVirtualElement = {
          type: 'link',
          textContent: '',
          title: 'Example.com site',
          outerHTML: '<a href="https://example.com" title="Example.com site"></a>',
        };

        const result = rgaa6Virtual.RGAA62([linkElement]);
        expect(result).toHaveLength(0);
      });

      it('should detect a link without label', () => {
        const linkElement: AnchorVirtualElement = {
          type: 'link',
          textContent: '',
          outerHTML: '<a href="https://example.com"></a>',
        };

        const result = rgaa6Virtual.RGAA62([linkElement]);
        expect(result).toHaveLength(1);
        expect(result[0].rule).toBe('RGAA - 6.2.1');
        expect(result[0].message).toBe('Each link must have a label (text or alternative)');
      });

      it('should ignore anchors (links with #)', () => {
        const linkElement: AnchorVirtualElement = {
          type: 'link',
          outerHTML: '<a href="#section1"></a>',
          href: '#section1',
          textContent: '',
        };

        const result = rgaa6Virtual.RGAA62([linkElement]);
        expect(result).toHaveLength(0);
      });
    });
  });
});
