import { LogMessageParams } from '../types.js';

export class RGAA1 {
  // eslint-disable-next-line class-methods-use-this
  public RGAA11(elements: Array<HTMLElement | SVGElement>) {
    const wrongElement: Array<LogMessageParams> = [];
    elements.forEach(el => {
      if (el instanceof HTMLImageElement) {
        const { alt, title, ariaLabel } = el;
        const ariaLabelledby = el.getAttribute('aria-labelledby');
        if (!alt && !title && !ariaLabel && !ariaLabelledby) {
          wrongElement.push({
            element: el.outerHTML,
            rule: 'RGAA - 1.1.1',
            ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.1',
            message: 'img elements should have alt, aria-label, title or aria-labelledby',
          });
        }
      }

      if (el instanceof HTMLAreaElement) {
        const { alt, ariaLabel } = el;
        if (!alt && !ariaLabel) {
          wrongElement.push({
            element: el.outerHTML,
            rule: 'RGAA - 1.1.2',
            ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.2',
            message: 'Area element should have alt or aria-label',
          });
        }
      }

      if (el instanceof SVGSVGElement) {
        const { role, ariaLabel } = el;
        const ariaLabelledby = el.getAttribute('aria-labelledby');
        if (role === 'img' && !ariaLabel && !ariaLabelledby) {
          wrongElement.push({
            element: el.outerHTML,
            rule: 'RGAA - 1.1.5',
            ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.5',
            message: 'SVG element with role img should have aria-label or aria-labelledby',
          });
        }
      }
    });

    return wrongElement;
  }
}
