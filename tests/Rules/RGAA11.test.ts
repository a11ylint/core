import { expect, it } from 'vitest';
import { RGAA11 } from '../../src/rules/RGAA11';

// Elements without proper labeling
const ElementsWithoutLabels = [
  // Input without any labeling
  Object.defineProperties(document.createElement('input'), {
    type: { value: 'text', writable: true },
    id: { value: 'input1', writable: true },
    outerHTML: { value: '<input type="text" id="input1">', writable: true },
  }),
  // Select without any labeling
  Object.defineProperties(document.createElement('select'), {
    id: { value: 'select1', writable: true },
    outerHTML: { value: '<select id="select1"></select>', writable: true },
  }),
  // Textarea without any labeling
  Object.defineProperties(document.createElement('textarea'), {
    id: { value: 'textarea1', writable: true },
    outerHTML: { value: '<textarea id="textarea1"></textarea>', writable: true },
  }),
];

// Elements with proper labeling
const ElementsWithLabels = [
  // Input with aria-label
  Object.defineProperties(document.createElement('input'), {
    type: { value: 'text', writable: true },
    id: { value: 'input2', writable: true },
    getAttribute: {
      value: (attr: string) => {
        if (attr === 'aria-label') return 'Username';
        return null;
      },
      writable: true,
    },
    outerHTML: { value: '<input type="text" id="input2" aria-label="Username">', writable: true },
  }),
  // Input with aria-labelledby
  Object.defineProperties(document.createElement('input'), {
    type: { value: 'text', writable: true },
    id: { value: 'input3', writable: true },
    getAttribute: {
      value: (attr: string) => {
        if (attr === 'aria-labelledby') return 'label3';
        return null;
      },
      writable: true,
    },
    outerHTML: { value: '<input type="text" id="input3" aria-labelledby="label3">', writable: true },
  }),
  // Input with title
  Object.defineProperties(document.createElement('input'), {
    type: { value: 'text', writable: true },
    id: { value: 'input4', writable: true },
    title: { value: 'Enter your password', writable: true },
    getAttribute: { value: () => null, writable: true },
    outerHTML: { value: '<input type="text" id="input4" title="Enter your password">', writable: true },
  }),
];

// Virtual elements without labels
const VirtualElementsWithoutLabels = [
  {
    type: 'input' as const,
    id: 'virtual1',
    outerHTML: '<input type="text" id="virtual1">',
  },
  {
    type: 'select' as const,
    id: 'virtual2',
    outerHTML: '<select id="virtual2"></select>',
  },
];

const VirtualElementsWithLabels = [
  {
    type: 'input' as const,
    id: 'virtual3',
    ariaLabel: 'Username',
    outerHTML: '<input type="text" id="virtual3" aria-label="Username">',
  },
  {
    type: 'input' as const,
    id: 'virtual4',
    hasLabelFor: true,
    labelForId: 'virtual4',
    outerHTML: '<input type="text" id="virtual4">',
  },
];

// Virtual elements with adjacent buttons
const VirtualElementsWithAdjacentButtons = [
  {
    type: 'input' as const,
    id: 'search1',
    hasAdjacentButton: true,
    adjacentButtonHasValidLabel: true,
    hasHiddenLabel: true,
    outerHTML: '<input type="text" id="search1">',
  },
  {
    type: 'input' as const,
    id: 'search2',
    hasAdjacentButton: true,
    adjacentButtonHasValidLabel: true,
    ariaLabel: 'Search terms',
    outerHTML: '<input type="text" id="search2" aria-label="Search terms">',
  },
  {
    type: 'input' as const,
    id: 'search3',
    hasAdjacentButton: true,
    adjacentButtonHasValidLabel: false, // Button has no valid label
    outerHTML: '<input type="text" id="search3">',
  },
];

// Elements with incorrect label linking
const ElementsWithIncorrectLabels = [
  {
    type: 'input' as const,
    id: 'input5',
    hasLabelFor: true,
    labelForId: 'wrong-id',
    outerHTML: '<input type="text" id="input5">',
  },
  {
    type: 'input' as const,
    hasLabelFor: true,
    outerHTML: '<input type="text">',
  },
];

it('RGAA111 should return errors for elements without accessible labels in dom mode', () => {
  const rgaa11 = new RGAA11('dom');
  const results = rgaa11.RGAA111(ElementsWithoutLabels);
  expect(results).toHaveLength(3);
  expect(results[0].rule).toBe('RGAA - 11.1.1');
  expect(results[0].message).toContain('Form field should have an accessible label');
});

it('RGAA111 should return no errors for elements with accessible labels in dom mode', () => {
  const rgaa11 = new RGAA11('dom');
  const results = rgaa11.RGAA111(ElementsWithLabels);
  expect(results).toHaveLength(0);
});

it('RGAA111 should return errors for elements without accessible labels in virtual mode', () => {
  const rgaa11 = new RGAA11('virtual');
  const results = rgaa11.RGAA111(VirtualElementsWithoutLabels);
  expect(results).toHaveLength(2);
  expect(results[0].rule).toBe('RGAA - 11.1.1');
  expect(results[0].message).toContain('Form field should have an accessible label');
});

it('RGAA111 should return no errors for elements with accessible labels in virtual mode', () => {
  const rgaa11 = new RGAA11('virtual');
  const results = rgaa11.RGAA111(VirtualElementsWithLabels);
  expect(results).toHaveLength(0);
});

it('RGAA112 should return errors for incorrectly linked labels in virtual mode', () => {
  const rgaa11 = new RGAA11('virtual');
  const results = rgaa11.RGAA112(ElementsWithIncorrectLabels);
  expect(results).toHaveLength(2);
  expect(results[0].rule).toBe('RGAA - 11.1.2');
  expect(results[0].message).toContain('Label[for] attribute does not match the field id');
  expect(results[1].rule).toBe('RGAA - 11.1.2');
  expect(results[1].message).toContain('Form field referenced by label[for] must have a matching id attribute');
});

it('RGAA111 should handle adjacent buttons correctly in virtual mode', () => {
  const rgaa11 = new RGAA11('virtual');
  const results = rgaa11.RGAA111(VirtualElementsWithAdjacentButtons);
  expect(results).toHaveLength(1); // Only search3 should fail
  expect(results[0].rule).toBe('RGAA - 11.1.1');
  expect(results[0].message).toContain('Form field should have an accessible label');
});

it('RGAA112 should return no errors for correctly linked labels in virtual mode', () => {
  const rgaa11 = new RGAA11('virtual');
  const results = rgaa11.RGAA112(VirtualElementsWithLabels);
  expect(results).toHaveLength(0);
});
