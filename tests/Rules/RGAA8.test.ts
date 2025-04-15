import { expect, it } from 'vitest';
import { RGAA8 } from '../../src/rules/RGAA8';

const core = new RGAA8();
const doctype = document.implementation.createDocumentType('html', '', '');
const customDocument = document.implementation.createHTMLDocument();
const correctDocument = {
  ...customDocument,
  title: 'Document with title',
  doctype,
  firstChild: {
    nodeType: document.DOCUMENT_TYPE_NODE,
  },
  documentElement: {
    ...customDocument.documentElement,
    lang: 'en',
  },
};
const incorrectDocument: Document[] = [
  {
    ...customDocument,
    title: '',
    baseURI: 'https://example.com',
    doctype: null,
    documentElement: {
      ...customDocument.documentElement,
      lang: '',
    },
  },
];

it('RGAA8.1 - Document should have a doctype', () => {
  expect(core.RGAA81([correctDocument as Document])).toHaveLength(0);
  expect(core.RGAA81([...incorrectDocument])).toStrictEqual([
    {
      element: 'https://example.com',
      message: 'Document (Page) should have a doctype',
      rule: 'RGAA - 8.1.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#8.1',
    },
    {
      element: 'https://example.com',
      message: 'Document (Page) doctype should be first',
      rule: 'RGAA - 8.1.3',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#8.1.3',
    },
  ]);
});

it('RGAA8.3 - Page should have a lang attribute', () => {
  expect(core.RGAA83([correctDocument as Document])).toHaveLength(0);
  expect(core.RGAA83([...incorrectDocument])).toStrictEqual([
    {
      element: 'https://example.com',
      message: 'Document (Page) should have a lang attribute',
      rule: 'RGAA - 8.3',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#8.3',
    },
  ]);
});

it('RGAA8.5 - Page should have a title', () => {
  expect(core.RGAA85([correctDocument as Document])).toHaveLength(0);
  expect(core.RGAA85([...incorrectDocument])).toStrictEqual([
    {
      element: 'https://example.com',
      message: 'Document (Page) should have a title',
      rule: 'RGAA - 8.5',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#8.5',
    },
  ]);
});
