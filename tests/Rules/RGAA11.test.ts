import { expect, it, describe } from 'vitest';
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

describe('RGAA11 DOM', () => {
  it('should return errors for elements without accessible labels in dom mode', () => {
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111(ElementsWithoutLabels);
    expect(results).toHaveLength(3);
    expect(results[0].rule).toBe('RGAA - 11.1.1');
    expect(results[0].message).toContain('Form field should have an accessible label');
  });

  it('should return no errors for elements with accessible labels in dom mode', () => {
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111(ElementsWithLabels);
    expect(results).toHaveLength(0);
  });

  it('should detect button adjacent without hidden label still fails', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-next';
    const button = document.createElement('button');
    button.textContent = 'Valider';
    input.insertAdjacentElement('afterend', button);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(1); // Adjacent button without hidden label fails
  });

  it('should detect prevSibling button without hidden label fails', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-prev';
    const button = document.createElement('button');
    button.setAttribute('aria-label', 'Retour');
    input.insertAdjacentElement('beforebegin', button);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(1); // Adjacent button without hidden label fails
  });

  it('should detect visually hidden label for adjacent button', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-hidden-label';
    const button = document.createElement('button');
    button.textContent = 'Chercher';
    input.insertAdjacentElement('afterend', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-hidden-label');
    label.textContent = 'Label caché';
    label.style.position = 'absolute';
    label.style.left = '-10000px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0);
    document.body.removeChild(label);
  });

  it('should detect visible label for adjacent button', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-visible-label';
    const button = document.createElement('button');
    button.textContent = 'Chercher';
    input.insertAdjacentElement('afterend', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-visible-label');
    label.textContent = 'Label visible';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0);
    document.body.removeChild(label);
  });

  it('should detect missing id referenced by label[for] in DOM', () => {
    const input = document.createElement('input');
    input.type = 'text';
    // Pas d'id
    const form = document.createElement('form');
    form.appendChild(input);
    const label = document.createElement('label');
    label.setAttribute('for', 'orphanInput');
    label.textContent = 'Orphelin';
    form.appendChild(label);
    document.body.appendChild(form);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA112([input]);
    expect(
      results.some(r => r.message.includes('Form field referenced by label[for] must have a matching id attribute')),
    ).toBeTruthy();
    document.body.removeChild(form);
  });

  it('should throw error for unknown mode', () => {
    // @ts-expect-error: unknown mode test purpose
    const rgaa11 = new RGAA11('unknown');
    expect(() => rgaa11.RGAA111([])).toThrow('Unknown mode: unknown');
    expect(() => rgaa11.RGAA112([])).toThrow('Unknown mode: unknown');
  });

  it('should detect button with aria-labelledby', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-labelledby';
    const button = document.createElement('button');
    button.setAttribute('aria-labelledby', 'btn-label');
    input.insertAdjacentElement('afterend', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-labelledby');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.left = '-9999px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0);
    document.body.removeChild(label);
  });

  it('should detect button with title', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-title';
    const button = document.createElement('button');
    button.setAttribute('title', 'Submit button');
    input.insertAdjacentElement('beforebegin', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-title');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.clip = 'rect(0, 0, 0, 0)';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0);
    document.body.removeChild(label);
  });

  it('should detect hidden label with clipPath', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-clippath';
    const button = document.createElement('button');
    button.textContent = 'Search';
    input.insertAdjacentElement('afterend', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-clippath');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.clipPath = 'inset(50%)';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0);
    document.body.removeChild(label);
  });

  it('should detect hidden label with 1px dimensions', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-1px';
    const button = document.createElement('button');
    button.textContent = 'Submit';
    input.insertAdjacentElement('afterend', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-1px');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.width = '1px';
    label.style.height = '1px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0);
    document.body.removeChild(label);
  });

  it('should detect nextSibling button without any label attributes', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-next-empty';
    const button = document.createElement('button');
    // Button without any labeling attributes
    input.insertAdjacentElement('afterend', button);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(1);
  });

  it('should detect prevSibling button without any label attributes', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-prev-empty';
    const button = document.createElement('button');
    // Button without any labeling attributes
    input.insertAdjacentElement('beforebegin', button);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(1);
  });

  it('should detect hidden label with rect clip (0px format)', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-clip-0px';
    const button = document.createElement('button');
    button.textContent = 'Search';
    input.insertAdjacentElement('afterend', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-clip-0px');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.clip = 'rect(0px, 0px, 0px, 0px)';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0);
    document.body.removeChild(label);
  });

  it('should validate nextSibling button with aria-label', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-next-aria-label';
    const button = document.createElement('button');
    button.setAttribute('aria-label', 'Submit form');
    input.insertAdjacentElement('afterend', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-next-aria-label');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.left = '-9999px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0);
    document.body.removeChild(label);
  });

  it('should validate nextSibling button with aria-labelledby', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-next-labelledby';
    const button = document.createElement('button');
    button.setAttribute('aria-labelledby', 'button-label');
    input.insertAdjacentElement('afterend', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-next-labelledby');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.left = '-9999px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0); // Should pass with valid adjacent button
    document.body.removeChild(label);
  });

  it('should validate nextSibling button with textContent', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-next-text';
    const button = document.createElement('button');
    button.textContent = 'Search';
    input.insertAdjacentElement('afterend', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-next-text');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.left = '-9999px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0); // Should pass with valid adjacent button
    document.body.removeChild(label);
  });

  it('should validate nextSibling button with title', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-next-title';
    const button = document.createElement('button');
    button.setAttribute('title', 'Submit button');
    input.insertAdjacentElement('afterend', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-next-title');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.left = '-9999px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0); // Should pass with valid adjacent button
    document.body.removeChild(label);
  });

  it('should validate prevSibling button with aria-label', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-prev-aria-label';
    const button = document.createElement('button');
    button.setAttribute('aria-label', 'Search button');
    input.insertAdjacentElement('beforebegin', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-prev-aria-label');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.left = '-9999px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0); // Should pass with valid adjacent button
    document.body.removeChild(label);
  });

  it('should validate prevSibling button with aria-labelledby', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-prev-labelledby';
    const button = document.createElement('button');
    button.setAttribute('aria-labelledby', 'prev-button-label');
    input.insertAdjacentElement('beforebegin', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-prev-labelledby');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.left = '-9999px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0); // Should pass with valid adjacent button
    document.body.removeChild(label);
  });

  it('should validate prevSibling button with textContent', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-prev-text';
    const button = document.createElement('button');
    button.textContent = 'Go';
    input.insertAdjacentElement('beforebegin', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-prev-text');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.left = '-9999px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0); // Should pass with valid adjacent button
    document.body.removeChild(label);
  });

  it('should validate prevSibling button with title', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-prev-title';
    const button = document.createElement('button');
    button.setAttribute('title', 'Previous page');
    input.insertAdjacentElement('beforebegin', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-prev-title');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.left = '-9999px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0); // Should pass with valid adjacent button
    document.body.removeChild(label);
  });

  it('should fail when button has empty textContent', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-empty-text';
    const button = document.createElement('button');
    button.textContent = '   '; // Only whitespace
    input.insertAdjacentElement('afterend', button);
    const label = document.createElement('label');
    label.setAttribute('for', 'input-empty-text');
    label.textContent = 'Hidden label';
    label.style.position = 'absolute';
    label.style.left = '-9999px';
    document.body.appendChild(label);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(0); // Should still pass because of hidden label
    document.body.removeChild(label);
  });

  it('should fail when button has no labeling attributes', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-no-button-label';
    const button = document.createElement('button');
    // Button without any labeling attributes or content
    input.insertAdjacentElement('afterend', button);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA111([input]);
    expect(results).toHaveLength(1); // Should fail - no valid button label and no hidden label
  });

  it('should detect label[for] attribute that points to non-existent element', () => {
    // Test the corrected logic that can now detect label[for] mismatches
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'correct-field-id';
    const form = document.createElement('form');
    form.appendChild(input);

    // Create a label with wrong id that points to non-existent element
    const wrongLabel = document.createElement('label');
    wrongLabel.setAttribute('for', 'non-existent-id'); // Points to non-existent element
    wrongLabel.textContent = 'Wrong Label';
    form.appendChild(wrongLabel);

    document.body.appendChild(form);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA112([input]);

    // The corrected implementation can now detect orphaned labels
    expect(results).toHaveLength(1);
    expect(results[0].rule).toBe('RGAA - 11.1.2');
    expect(results[0].message).toContain('Label[for] attribute does not match the field id');
    document.body.removeChild(form);
  });

  it('should detect form field without id when label[for] exists (current logic)', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'correct-field-id';
    const form = document.createElement('form');
    form.appendChild(input);

    // Create an element without id that the label is trying to reference
    const inputWithoutId = document.createElement('input');
    inputWithoutId.type = 'text';
    // No id attribute
    form.appendChild(inputWithoutId);

    // Create a label that points to a non-existent element
    const label = document.createElement('label');
    label.setAttribute('for', 'wrong-field-id'); // Mismatched id
    label.textContent = 'Field Label';
    form.appendChild(label);

    document.body.appendChild(form);
    const rgaa11 = new RGAA11('dom');
    const results = rgaa11.RGAA112([inputWithoutId]); // Test the element without id
    expect(results).toHaveLength(1);
    expect(results[0].rule).toBe('RGAA - 11.1.2');
    expect(results[0].message).toContain('Form field referenced by label[for] must have a matching id attribute');
    document.body.removeChild(form);
  });
});

describe('RGAA11 virtual', () => {
  it('should return errors for elements without accessible labels in virtual mode', () => {
    const rgaa11 = new RGAA11('virtual');
    const results = rgaa11.RGAA111(VirtualElementsWithoutLabels);
    expect(results).toHaveLength(2);
    expect(results[0].rule).toBe('RGAA - 11.1.1');
    expect(results[0].message).toContain('Form field should have an accessible label');
  });

  it('should return no errors for elements with accessible labels in virtual mode', () => {
    const rgaa11 = new RGAA11('virtual');
    const results = rgaa11.RGAA111(VirtualElementsWithLabels);
    expect(results).toHaveLength(0);
  });

  it('should return errors for incorrectly linked labels in virtual mode', () => {
    const rgaa11 = new RGAA11('virtual');
    const results = rgaa11.RGAA112(ElementsWithIncorrectLabels);
    expect(results).toHaveLength(2);
    expect(results[0].rule).toBe('RGAA - 11.1.2');
    expect(results[0].message).toContain('Label[for] attribute does not match the field id');
    expect(results[1].rule).toBe('RGAA - 11.1.2');
    expect(results[1].message).toContain('Form field referenced by label[for] must have a matching id attribute');
  });

  it('should handle adjacent buttons correctly in virtual mode', () => {
    const rgaa11 = new RGAA11('virtual');
    const results = rgaa11.RGAA111(VirtualElementsWithAdjacentButtons);
    expect(results).toHaveLength(1); // Only search3 should fail
    expect(results[0].rule).toBe('RGAA - 11.1.1');
    expect(results[0].message).toContain('Form field should have an accessible label');
  });

  it('should return no errors for correctly linked labels in virtual mode', () => {
    const rgaa11 = new RGAA11('virtual');
    const results = rgaa11.RGAA112(VirtualElementsWithLabels);
    expect(results).toHaveLength(0);
  });
});
