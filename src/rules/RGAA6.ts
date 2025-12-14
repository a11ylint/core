import type { LogMessageParams, Mode } from '../types.js';

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
  private mode: Mode;

  private wrongElements: Array<LogMessageParams> = [];

  constructor(mode: Mode) {
    this.mode = mode;
  }

  RGAA62(elements: Array<AnchorVirtualElement>): LogMessageParams[];

  RGAA62(elements: Array<HTMLAnchorElement | HTMLElement>): LogMessageParams[];

  public RGAA62(elements: Array<AnchorVirtualElement | HTMLAnchorElement | HTMLElement>): LogMessageParams[] {
    switch (this.mode) {
      case 'dom':
        return this.RGAA62_dom(elements as Array<HTMLAnchorElement | HTMLElement>);
      case 'virtual':
        return this.RGAA62_virtual(elements as Array<AnchorVirtualElement>);
      default:
        throw new Error(`Unknown mode: ${this.mode}`);
    }
  }

  private RGAA62_dom(elements: Array<HTMLAnchorElement | HTMLElement>): LogMessageParams[] {
    this.wrongElements = [];

    elements.forEach(el => {
      if (el instanceof HTMLAnchorElement && el.getAttribute('href')?.includes('#')) {
        return;
      }

      if (!this.hasLinkTitleDom(el)) {
        this.addWrongElementRGAA62(el);
      }
    });

    return this.wrongElements;
  }

  private RGAA62_virtual(elements: Array<AnchorVirtualElement>): LogMessageParams[] {
    this.wrongElements = [];

    elements.forEach(el => {
      if (el.href?.includes('#')) {
        return;
      }

      if (!this.hasLinkTitleVirtual(el)) {
        this.addWrongElementRGAA62(el);
      }
    });

    return this.wrongElements;
  }

  private hasLinkTitleDom(element: HTMLElement): boolean {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel?.trim()) {
      return true;
    }

    const ariaLabelledby = element.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
      return true;
    }

    if (element.title?.trim()) {
      return true;
    }

    return !!element.textContent?.trim();
  }

  private hasLinkTitleVirtual(element: AnchorVirtualElement): boolean {
    if (element.ariaLabel?.trim()) {
      return true;
    }

    if (element.ariaLabelledby) {
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
