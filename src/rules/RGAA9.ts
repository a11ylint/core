import type { LogMessageParams } from '../types.js';

export type HeadingVirtualElement = {
  type: 'heading';
  tagName: string;
  level?: number;
  textContent?: string;
  role?: string;
  ariaLevel?: string | null;
  outerHTML: string;
  index?: number;
};

type HeadingElement = HeadingVirtualElement | HTMLHeadingElement | HTMLElement;

type HeadingInfo = {
  element: HeadingElement;
  level: number;
  index: number;
};

export class RGAA9 {
  private wrongElements: Array<LogMessageParams> = [];

  public RGAA911(elements: Array<HeadingElement>): LogMessageParams[] {
    this.wrongElements = [];

    const headings = this.extractHeadings(elements);
    const invalidHeadings = this.findInvalidHierarchyHeadings(headings);

    invalidHeadings.forEach((heading: HeadingInfo) => {
      this.addWrongElementRGAA911(heading.element);
    });

    return this.wrongElements;
  }

  public RGAA913(elements: Array<HeadingElement>): LogMessageParams[] {
    this.wrongElements = [];

    elements.forEach(el => {
      if (!this.isValidHeadingStructure(el)) {
        this.addWrongElementRGAA913(el);
      }
    });

    return this.wrongElements;
  }

  private extractHeadings(elements: Array<HeadingElement>): Array<HeadingInfo> {
    return elements
      .map((el, index) => ({
        element: el,
        level: this.getHeadingLevel(el),
        index: this.getElementIndex(el, index),
      }))
      .filter(heading => heading.level > 0)
      .sort((a, b) => a.index - b.index);
  }

  private getElementIndex(element: HeadingElement, fallbackIndex: number): number {
    if (!(element instanceof HTMLElement) && 'index' in element && typeof element.index === 'number') {
      return element.index;
    }

    return fallbackIndex;
  }

  private findInvalidHierarchyHeadings(headings: Array<HeadingInfo>): Array<HeadingInfo> {
    const invalidHeadings: Array<HeadingInfo> = [];

    if (headings.length <= 1) {
      return invalidHeadings;
    }

    let previousLevel = 0;

    headings.forEach(heading => {
      const currentLevel = heading.level;

      if (previousLevel === 0) {
        previousLevel = currentLevel;
        return;
      }

      if (Math.abs(currentLevel - previousLevel) > 1) {
        invalidHeadings.push(heading);
      }

      previousLevel = currentLevel;
    });

    return invalidHeadings;
  }

  private getHeadingLevel(element: HeadingElement): number {
    if (element instanceof HTMLElement && /^H[1-6]$/i.test(element.tagName)) {
      return parseInt(element.tagName.charAt(1), 10);
    }

    if (!(element instanceof HTMLElement) && 'tagName' in element && /^H[1-6]$/i.test(element.tagName)) {
      return parseInt(element.tagName.charAt(1), 10);
    }

    const role = element instanceof HTMLElement ? element.getAttribute('role') : element.role;
    if (role === 'heading') {
      const ariaLevel = element instanceof HTMLElement ? element.getAttribute('aria-level') : element.ariaLevel;
      if (ariaLevel) {
        const level = parseInt(ariaLevel, 10);
        return Number.isNaN(level) ? 0 : level;
      }
    }

    return 0;
  }

  private isValidHeadingStructure(element: HeadingElement): boolean {
    const { tagName } = element;
    if (/^H[1-6]$/i.test(tagName)) {
      return true;
    }

    const role = element instanceof HTMLElement ? element.getAttribute('role') : element.role;
    if (role === 'heading') {
      const ariaLevel = element instanceof HTMLElement ? element.getAttribute('aria-level') : element.ariaLevel;
      if (ariaLevel) {
        const level = parseInt(ariaLevel, 10);
        return !Number.isNaN(level) && level >= 1;
      }
    }

    return false;
  }

  private addWrongElementRGAA911(el: HeadingElement) {
    this.wrongElements.push({
      element: el.outerHTML,
      rule: 'RGAA - 9.1.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#9.1.1',
      message: 'The hierarchy between headings must be relevant',
    });
  }

  private addWrongElementRGAA913(el: HeadingElement) {
    this.wrongElements.push({
      element: el.outerHTML,
      rule: 'RGAA - 9.1.3',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#9.1.3',
      message: 'Each heading must be structured with a <hx> tag or with role="heading" and aria-level attributes',
    });
  }
}
