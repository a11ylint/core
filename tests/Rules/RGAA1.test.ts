import { expect, it } from 'vitest';
import { RGAA1 } from '../../src/rules/RGAA1';

const ElementsWithoutLabels = [
  Object.defineProperties(document.createElement('img'), {
    type: { value: 'img', writable: true },
    alt: { value: undefined, writable: true },
    title: { value: undefined, writable: true },
    'aria-labelledby': { value: undefined, writable: true },
    'aria-label': { value: undefined, writable: true },
  }),
  Object.defineProperties(document.createElement('area'), {
    type: { value: 'area', writable: true },
    alt: { value: undefined, writable: true },
    'aria-label': { value: undefined, writable: true },
  }),
  Object.defineProperties(document.createElementNS('http://www.w3.org/2000/svg', 'svg'), {
    type: { value: 'svg', writable: true },
    role: { value: 'img', writable: true },
    'aria-labelledby': { value: undefined, writable: true },
    'aria-label': { value: undefined, writable: true },
  }),
];

const ElementsWithLabels = [
  Object.defineProperties(document.createElement('img'), {
    type: { value: 'img', writable: true },
    id: { value: 1, writable: true },
    alt: { value: 'alt', writable: true },
    title: { value: undefined, writable: true },
    'aria-labelledby': { value: undefined, writable: true },
    'aria-label': { value: undefined, writable: true },
  }),
  Object.defineProperties(document.createElement('img'), {
    type: { value: 'img', writable: true },
    id: { value: 2, writable: true },
    ariaLabel: {
      value: 'aria',
      writable: true,
    },
    title: { value: undefined, writable: true },
    alt: { value: undefined, writable: true },
    'aria-labelledby': { value: undefined, writable: true },
  }),
  Object.defineProperties(document.createElement('img'), {
    type: { value: 'img', writable: true },
    id: { value: 3, writable: true },
    alt: { value: undefined, writable: true },
    title: { value: 'title', writable: true },
    'aria-labelledby': { value: undefined, writable: true },
    'aria-label': { value: undefined, writable: true },
  }),
  (() => {
    const element = document.createElement('img');
    element.setAttribute('aria-labelledby', 'labelledby');
    return element;
  })(),
  (() => {
    const element = document.createElement('area');
    element.setAttribute('aria-label', 'label');
    return element;
  })(),
  (() => {
    const element = document.createElement('area');
    element.setAttribute('alt', 'alt');
    return element;
  })(),
  (() => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    element.setAttribute('role', 'img');
    element.setAttribute('aria-label', 'label');
    return element;
  })(),
  (() => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    element.setAttribute('role', 'img');
    element.setAttribute('aria-labelledby', 'labelledby');
    return element;
  })(),
];

const core = new RGAA1('dom');
const coreVirtual = new RGAA1('virtual');

it('RGAA1.1 - Accessibility Attribute Validation for Images, Areas, and SVGs', () => {
  expect(coreVirtual.RGAA11(ElementsWithLabels)).toStrictEqual([]);
  expect(coreVirtual.RGAA11(ElementsWithoutLabels)).toStrictEqual([
    {
      element: '<img>',
      message: 'img elements should have alt, aria-label, title or aria-labelledby',
      rule: 'RGAA - 1.1.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.1',
    },
    {
      element: '<area>',
      message: 'Area element should have alt or aria-label',
      rule: 'RGAA - 1.1.2',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.2',
    },
    {
      element: '<svg></svg>',
      message: 'SVG element with role img should have aria-label or aria-labelledby',
      rule: 'RGAA - 1.1.5',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.5',
    },
  ]);
  expect(core.RGAA11(ElementsWithLabels)).toStrictEqual([]);
  expect(core.RGAA11(ElementsWithoutLabels)).toStrictEqual([
    {
      element: '<img>',
      message: 'img elements should have alt, aria-label, title or aria-labelledby',
      rule: 'RGAA - 1.1.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.1',
    },
    {
      element: '<area>',
      message: 'Area element should have alt or aria-label',
      rule: 'RGAA - 1.1.2',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.2',
    },
    {
      element: '<svg></svg>',
      message: 'SVG element with role img should have aria-label or aria-labelledby',
      rule: 'RGAA - 1.1.5',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.5',
    },
  ]);
});
