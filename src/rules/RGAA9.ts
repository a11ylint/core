import type { LogMessageParams } from '../types.js';
import { toNormalizedHeading, type NormalizedHeading } from '../utils/elementAdapter.js';

export type HeadingVirtualElement = NormalizedHeading;

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

    const headings: Array<HeadingInfo> = elements
      .map((el, index) => ({ original: el, normalized: toNormalizedHeading(el, index) }))
      .filter(h => typeof h.normalized.tagName === 'string' || h.normalized.role === 'heading')
      .map(h => ({
        element: h.original as HeadingElement,
        level: this.getHeadingLevelFromNormalized(h.normalized),
        index: h.normalized.index ?? 0,
      }))
      .filter(heading => heading.level > 0)
      .sort((a, b) => a.index - b.index);

    const invalidHeadings = this.findInvalidHierarchyHeadings(headings);

    invalidHeadings.forEach((heading: HeadingInfo) => {
      this.addWrongElementRGAA911(heading.element);
    });

    return this.wrongElements;
  }

  public RGAA913(elements: Array<HeadingElement>): LogMessageParams[] {
    this.wrongElements = [];

    elements.forEach((el, index) => {
      const normalized = toNormalizedHeading(el, index);
      if (!this.isValidHeadingStructureNormalized(normalized)) {
        this.addWrongElementRGAA913(el);
      }
    });

    return this.wrongElements;
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

  private getHeadingLevelFromNormalized(normalized: NormalizedHeading): number {
    const tag = normalized.tagName;
    if (typeof tag === 'string' && /^H[1-6]$/i.test(tag)) {
      return parseInt(tag.charAt(1), 10);
    }

    if (normalized.role === 'heading' && normalized.ariaLevel) {
      const level = parseInt(normalized.ariaLevel, 10);
      return Number.isNaN(level) ? 0 : level;
    }

    return 0;
  }

  private isValidHeadingStructure(element: HeadingElement): boolean {
    const normalized = toNormalizedHeading(element);
    return this.isValidHeadingStructureNormalized(normalized);
  }

  private isValidHeadingStructureNormalized(normalized: NormalizedHeading): boolean {
    const tag = normalized.tagName;
    if (typeof tag === 'string' && /^H[1-6]$/i.test(tag)) {
      return true;
    }

    if (normalized.role === 'heading' && normalized.ariaLevel) {
      const level = parseInt(normalized.ariaLevel, 10);
      return !Number.isNaN(level) && level >= 1;
    }

    return false;
  }

  private addWrongElementRGAA911(el: HeadingElement) {
    const outer = toNormalizedHeading(el).outerHTML ?? String(el);
    this.wrongElements.push({
      element: outer,
      rule: 'RGAA - 9.1.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#9.1.1',
      message: 'The hierarchy between headings must be relevant',
    });
  }

  private addWrongElementRGAA913(el: HeadingElement) {
    const outer = toNormalizedHeading(el).outerHTML ?? String(el);
    this.wrongElements.push({
      element: outer,
      rule: 'RGAA - 9.1.3',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#9.1.3',
      message: 'Each heading must be structured with a <hx> tag or with role="heading" and aria-level attributes',
    });
  }
}
