import type { LogMessageParams } from '../types.js';

export type AnchorVirtualElement = {
  type: 'link';
  href?: string;
  textContent?: string;
  title?: string;
  ariaLabel?: string;
  ariaLabelledby?: string | null;
  role?: string;
  outerHTML: string;
};

export class RGAA6 {
  private wrongElements: Array<LogMessageParams> = [];

  RGAA62(elements: Array<AnchorVirtualElement>): LogMessageParams[];

  RGAA62(elements: Array<HTMLAnchorElement | HTMLElement>): LogMessageParams[];

  public RGAA62(elements: Array<AnchorVirtualElement | HTMLAnchorElement | HTMLElement>): LogMessageParams[] {
    this.wrongElements = [];

    elements.forEach(el => {
      if (el instanceof HTMLAnchorElement && el.getAttribute('href')?.includes('#')) {
        return;
      }

      if (!(el instanceof HTMLElement) && el.href?.includes('#')) {
        return;
      }

      if (!this.hasLinkTitle(el)) {
        this.addWrongElementRGAA62(el);
      }
    });

    return this.wrongElements;
  }

  private hasLinkTitle(element: AnchorVirtualElement | HTMLElement): boolean {
    const ariaLabel = element instanceof HTMLElement ? element.getAttribute('aria-label') : element.ariaLabel;
    if (ariaLabel?.trim()) {
      return true;
    }

    const ariaLabelledby =
      element instanceof HTMLElement ? element.getAttribute('aria-labelledby') : element.ariaLabelledby;
    if (ariaLabelledby) {
      return true;
    }

    if (element.title?.trim()) {
      return true;
    }

    return !!element.textContent?.trim();
  }

  private addWrongElementRGAA62(el: AnchorVirtualElement | HTMLAnchorElement | HTMLElement) {
    this.wrongElements.push({
      element: el.outerHTML,
      rule: 'RGAA - 6.2.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#6.2.1',
      message: 'Each link must have a label (text or alternative)',
    });
  }
}
