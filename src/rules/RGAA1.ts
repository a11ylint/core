import { LogMessageParams, Mode } from '../types.js';

export type SvgImageAreaProps = {
  type: 'img' | 'area' | 'svg';
  alt?: string;
  title?: string;
  ariaLabel?: string;
  ariaLabelledby?: string | null;
  role?: string;
  outerHTML: string;
};

export class RGAA1 {
  private mode: Mode;

  constructor(mode: Mode) {
    this.mode = mode;
  }

  RGAA11(elements: Array<SvgImageAreaProps>): LogMessageParams[]; // For 'playwright' mode

  RGAA11(elements: Array<HTMLImageElement | HTMLAreaElement | SVGSVGElement>): LogMessageParams[]; // For 'browser' mode

  public RGAA11(
    elements: Array<SvgImageAreaProps | HTMLImageElement | HTMLAreaElement | SVGSVGElement>,
  ): LogMessageParams[] {
    switch (this.mode) {
      case 'dom':
        return this.RGAA11_dom(elements);
      case 'virtual':
        return this.RGAA11_virtual(elements);
      default:
        throw new Error(`Unknown mode: ${this.mode}`);
    }
  }

  private RGAA11_dom(
    elements: Array<SvgImageAreaProps | HTMLImageElement | HTMLAreaElement | SVGSVGElement>,
  ): LogMessageParams[] {
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

  private RGAA11_virtual(
    elements: Array<SvgImageAreaProps | HTMLImageElement | HTMLAreaElement | SVGSVGElement>,
  ): LogMessageParams[] {
    const wrongElement: Array<LogMessageParams> = [];
    elements.forEach(el => {
      const element = el as SvgImageAreaProps;
      const { alt, title, ariaLabel, ariaLabelledby, outerHTML, role, type } = element;
      switch (type) {
        case 'img':
          if (!alt && !title && !ariaLabel && !ariaLabelledby) {
            wrongElement.push({
              element: outerHTML,
              rule: 'RGAA - 1.1.1',
              ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.1',
              message: 'img elements should have alt, aria-label, title or aria-labelledby',
            });
          }
          break;
        case 'area':
          if (!alt && !ariaLabel) {
            wrongElement.push({
              element: outerHTML,
              rule: 'RGAA - 1.1.2',
              ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.2',
              message: 'Area element should have alt or aria-label',
            });
          }
          break;
        case 'svg':
          if (role === 'img' && !ariaLabel && !ariaLabelledby) {
            wrongElement.push({
              element: outerHTML,
              rule: 'RGAA - 1.1.5',
              ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.5',
              message: 'SVG element with role img should have aria-label or aria-labelledby',
            });
          }
          break;
        default:
          break;
      }
    });

    return wrongElement;
  }
}
