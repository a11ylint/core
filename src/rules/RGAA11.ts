import { LogMessageParams, Mode } from '../types.js';

export type FormFieldElement = {
  type: 'input' | 'select' | 'textarea';
  id?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  title?: string;
  outerHTML: string;
  hasLabelFor?: boolean;
  labelForId?: string;
  hasAdjacentButton?: boolean;
  adjacentButtonHasValidLabel?: boolean;
  hasHiddenLabel?: boolean;
};

type FormElements = FormFieldElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export class RGAA11 {
  private readonly mode: Mode;

  constructor(mode: Mode) {
    this.mode = mode;
  }

  public RGAA111(elements: Array<FormElements>): LogMessageParams[] {
    switch (this.mode) {
      case 'dom':
        return this.RGAA111_dom(elements);
      case 'virtual':
        return this.RGAA111_virtual(elements);
      default:
        throw new Error(`Unknown mode: ${this.mode}`);
    }
  }

  public RGAA112(
    elements: Array<FormFieldElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ): LogMessageParams[] {
    switch (this.mode) {
      case 'dom':
        return this.RGAA112_dom(elements);
      case 'virtual':
        return this.RGAA112_virtual(elements);
      default:
        throw new Error(`Unknown mode: ${this.mode}`);
    }
  }

  private RGAA111_dom(elements: Array<FormElements>): LogMessageParams[] {
    const wrongElements: Array<LogMessageParams> = [];

    elements.forEach(el => {
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
        const { id, title } = el;
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledby = el.getAttribute('aria-labelledby');

        // Check for associated label
        let hasLabel = false;
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          hasLabel = !!label;
        }

        const nextSibling = el.nextElementSibling;
        const prevSibling = el.previousElementSibling;

        let hasValidAdjacentButton = false;

        if (nextSibling && nextSibling.tagName.toLowerCase() === 'button') {
          const buttonAriaLabel = nextSibling.getAttribute('aria-label');
          const buttonAriaLabelledby = nextSibling.getAttribute('aria-labelledby');
          const buttonText = nextSibling.textContent?.trim();
          const buttonTitle = nextSibling.getAttribute('title');

          if (buttonAriaLabel || buttonAriaLabelledby || (buttonText && buttonText.length > 0) || buttonTitle) {
            hasValidAdjacentButton = true;
          }
        }

        // Check previous sibling button
        if (!hasValidAdjacentButton && prevSibling && prevSibling.tagName.toLowerCase() === 'button') {
          const buttonAriaLabel = prevSibling.getAttribute('aria-label');
          const buttonAriaLabelledby = prevSibling.getAttribute('aria-labelledby');
          const buttonText = prevSibling.textContent?.trim();
          const buttonTitle = prevSibling.getAttribute('title');

          if (buttonAriaLabel || buttonAriaLabelledby || (buttonText && buttonText.length > 0) || buttonTitle) {
            hasValidAdjacentButton = true;
          }
        }

        // Check for hidden labels when there's an adjacent button
        let hasHiddenLabel = false;
        if (hasValidAdjacentButton && id) {
          const hiddenLabels = document.querySelectorAll(`label[for="${id}"]`);
          hiddenLabels.forEach(label => {
            const labelElement = label as HTMLElement;
            // Check if label is visually hidden but accessible to screen readers
            const style = window.getComputedStyle(labelElement);
            const isVisuallyHidden =
              style.position === 'absolute' &&
              (style.left === '-10000px' ||
                style.left === '-9999px' ||
                style.clip === 'rect(0, 0, 0, 0)' ||
                style.clip === 'rect(0px, 0px, 0px, 0px)' ||
                style.clipPath === 'inset(50%)' ||
                style.width === '1px' ||
                style.height === '1px');

            if (isVisuallyHidden || style.display === 'none' || style.visibility === 'hidden') {
              // For RGAA compliance, hidden labels should be accessible (not display:none or visibility:hidden)
              if (isVisuallyHidden) {
                hasHiddenLabel = true;
              }
            } else {
              // Visible label
              hasLabel = true;
            }
          });
        }

        // RGAA 11.1.1: Check if field has accessible labeling
        // When there's an adjacent button, we need either a hidden accessible label or other accessible labeling
        const hasAccessibleLabeling =
          ariaLabelledby ||
          ariaLabel ||
          hasLabel ||
          title ||
          (hasValidAdjacentButton && (ariaLabelledby || ariaLabel || hasHiddenLabel));

        if (!hasAccessibleLabeling) {
          wrongElements.push({
            element: el.outerHTML,
            rule: 'RGAA - 11.1.1',
            ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.1.1',
            message:
              'Form field should have an accessible label (aria-labelledby, aria-label, label[for], title, or adjacent button with hidden label)',
          });
        }
      }
    });

    return wrongElements;
  }

  private RGAA111_virtual(elements: Array<FormElements>): LogMessageParams[] {
    const wrongElements: Array<LogMessageParams> = [];

    elements.forEach(el => {
      const element = el as FormFieldElement;
      const {
        ariaLabel,
        ariaLabelledby,
        title,
        hasLabelFor,
        hasAdjacentButton,
        adjacentButtonHasValidLabel,
        hasHiddenLabel,
        outerHTML,
      } = element;

      // RGAA 11.1.1: Check if field has accessible labeling
      // When there's an adjacent button, we need either a hidden accessible label or other accessible labeling
      const hasValidAdjacentButton = hasAdjacentButton && adjacentButtonHasValidLabel;
      const hasAccessibleLabeling =
        ariaLabelledby ||
        ariaLabel ||
        hasLabelFor ||
        title ||
        (hasValidAdjacentButton && (ariaLabelledby || ariaLabel || hasHiddenLabel));

      if (!hasAccessibleLabeling) {
        wrongElements.push({
          element: outerHTML,
          rule: 'RGAA - 11.1.1',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.1.1',
          message:
            'Form field should have an accessible label (aria-labelledby, aria-label, label[for], title, or adjacent button with hidden label)',
        });
      }
    });

    return wrongElements;
  }

  private RGAA112_dom(elements: Array<FormElements>): LogMessageParams[] {
    const wrongElements: Array<LogMessageParams> = [];

    elements.forEach(el => {
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
        const { id } = el;

        // Check if there are labels pointing to this element but the element has no id
        if (!id) {
          const orphanLabels = document.querySelectorAll('label[for]');
          orphanLabels.forEach(label => {
            const labelFor = label.getAttribute('for');
            if (labelFor && label.closest('form')?.contains(el)) {
              wrongElements.push({
                element: el.outerHTML,
                rule: 'RGAA - 11.1.2',
                ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.1.2',
                message: 'Form field referenced by label[for] must have a matching id attribute',
              });
            }
          });
        } else {
          // RGAA 11.1.2: Check if there are labels with for attributes that don't match any element
          const form = el.closest('form') || document;
          const allLabelsWithFor = form.querySelectorAll('label[for]');

          allLabelsWithFor.forEach(label => {
            const labelFor = label.getAttribute('for');
            if (labelFor && labelFor !== id) {
              // Check if this label points to our current element but with wrong id
              const targetElement = form.querySelector(`#${CSS.escape(labelFor)}`);
              if (!targetElement && label.closest('form')?.contains(el)) {
                wrongElements.push({
                  element: el.outerHTML,
                  rule: 'RGAA - 11.1.2',
                  ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.1.2',
                  message: 'Label[for] attribute does not match the field id',
                });
              }
            }
          });
        }
      }
    });

    return wrongElements;
  }

  private RGAA112_virtual(elements: Array<FormElements>): LogMessageParams[] {
    const wrongElements: Array<LogMessageParams> = [];

    elements.forEach(el => {
      const element = el as FormFieldElement;
      const { id, hasLabelFor, labelForId, outerHTML } = element;

      // RGAA 11.1.2: If a label is used, check if it's correctly linked
      if (hasLabelFor && labelForId && labelForId !== id) {
        wrongElements.push({
          element: outerHTML,
          rule: 'RGAA - 11.1.2',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.1.2',
          message: 'Label[for] attribute does not match the field id',
        });
      }

      // Check if field is referenced by label but has no id
      if (hasLabelFor && !id) {
        wrongElements.push({
          element: outerHTML,
          rule: 'RGAA - 11.1.2',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.1.2',
          message: 'Form field referenced by label[for] must have a matching id attribute',
        });
      }
    });

    return wrongElements;
  }
}
