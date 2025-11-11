import { Color } from '../utils/color.js';
import { LogMessageParams, Mode } from '../types.js';

export type ConstratsElement = {
  backgroundElement: HTMLElement;
  foregroundElement: HTMLElement;
};

export type VirtualContrastsElement = {
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  fontWeight: string;
  outerHTML: string;
};

export class RGAA3 {
  private readonly mode: Mode;

  constructor(mode: Mode) {
    this.mode = mode;
  }

  public RGAA32(elements: Array<ConstratsElement | VirtualContrastsElement>) {
    switch (this.mode) {
      case 'dom':
        return this.RGAA32_Dom(elements as Array<ConstratsElement>);
      case 'virtual':
        return this.RGAA32_Virtual(elements as Array<VirtualContrastsElement>);
      default:
        throw new Error('Mode not supported for RGAA3');
    }
  }

  private RGAA32_Virtual(elements: Array<VirtualContrastsElement>): LogMessageParams[] {
    const wrongContrasts: Array<LogMessageParams> = [];

    elements.forEach(elementsToCheck => {
      const { backgroundColor, textColor, fontSize, fontWeight, outerHTML } = elementsToCheck;

      const bgColor = Color.getRGBFromCssProperties(backgroundColor);
      const fgColor = Color.getRGBFromCssProperties(textColor);
      const textSize = Number(fontSize.split('px')[0]);
      const isBold = Number(fontWeight) >= 600;

      const ratio = Color.contrast(bgColor, fgColor);

      if (textSize < 24 && !isBold && ratio < 4.5) {
        wrongContrasts.push({
          element: outerHTML,
          rule: 'RGAA - 3.2.1',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.1',
          message:
            'Color contrasts for non-bold element with fontSize inferior to 24px should have at minimal 4.5 in contrast',
        });
      }

      if (textSize < 18.5 && isBold && ratio < 4.5) {
        wrongContrasts.push({
          element: outerHTML,
          rule: 'RGAA - 3.2.2',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.2',
          message:
            'Color contrasts for bold element with fontSize inferior to 18.5px should have at minimal 4.5 in contrast',
        });
      }

      if (textSize >= 24 && !isBold && ratio < 3) {
        wrongContrasts.push({
          element: outerHTML,
          rule: 'RGAA - 3.2.3',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.3',
          message:
            'Color contrasts for non-bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        });
      }

      if (textSize >= 18.5 && isBold && ratio < 3) {
        wrongContrasts.push({
          element: outerHTML,
          rule: 'RGAA - 3.2.4',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.4',
          message:
            'Color contrasts for bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        });
      }
    });

    return wrongContrasts;
  }

  private RGAA32_Dom(elements: Array<ConstratsElement>) {
    const wrongcontrasts: Array<LogMessageParams> = [];

    elements.forEach(elementsToCheck => {
      const backgroundColor = Color.getRGBFromCssProperties(
        getComputedStyle(elementsToCheck.backgroundElement).backgroundColor,
      );
      const textColor = Color.getRGBFromCssProperties(getComputedStyle(elementsToCheck.foregroundElement).color);
      const textSize = Number(getComputedStyle(elementsToCheck.foregroundElement).fontSize.split('px')[0]);
      const isBold = Number(getComputedStyle(elementsToCheck.foregroundElement).fontWeight) >= 600;

      const ratio = Color.contrast(backgroundColor, textColor);

      if (textSize < 24 && !isBold && ratio < 4.5) {
        wrongcontrasts.push({
          element: elementsToCheck.foregroundElement.outerHTML,
          rule: 'RGAA - 3.2.1',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.1',
          message:
            'Color contrasts for non-bold element with fontSize inferior to 24px should have at minimal 4.5 in contrast',
        });
      }

      if (textSize < 18.5 && isBold && ratio < 4.5) {
        wrongcontrasts.push({
          element: elementsToCheck.foregroundElement.outerHTML,
          rule: 'RGAA - 3.2.2',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.2',
          message:
            'Color contrasts for bold element with fontSize inferior to 18.5px should have at minimal 4.5 in contrast',
        });
      }

      if (textSize >= 24 && !isBold && ratio < 3) {
        wrongcontrasts.push({
          element: elementsToCheck.foregroundElement.outerHTML,
          rule: 'RGAA - 3.2.3',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.3',
          message:
            'Color contrasts for non-bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        });
      }

      if (textSize >= 18.5 && isBold && ratio < 3) {
        wrongcontrasts.push({
          element: elementsToCheck.foregroundElement.outerHTML,
          rule: 'RGAA - 3.2.4',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.4',
          message:
            'Color contrasts for bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        });
      }
    });
    return wrongcontrasts;
  }
}
