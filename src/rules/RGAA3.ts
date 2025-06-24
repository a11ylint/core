import { Color } from 'src/utils/color.js';
import { LogMessageParams } from '../types.js';

export type ConstratsElement = {
  backgroundElement: HTMLElement;
  foregroundElement: HTMLElement;
};

export class RGAA3 {
  public RGAA32(elements: Array<ConstratsElement>) {
    const wrongContrats: Array<LogMessageParams> = [];

    elements.forEach(elementsToCheck => {
      const backgroundColor = Color.getRGBFromCssProperties(
        getComputedStyle(elementsToCheck.backgroundElement).backgroundColor,
      );
      const textColor = Color.getRGBFromCssProperties(getComputedStyle(elementsToCheck.foregroundElement).color);
      const textSize = Number(getComputedStyle(elementsToCheck.foregroundElement).fontSize.split('px')[0]);
      const isBold = Number(getComputedStyle(elementsToCheck.foregroundElement).fontWeight) >= 600;

      const ratio = Color.contrast(backgroundColor, textColor);

      if (textSize < 24 && !isBold && ratio < 4.5) {
        wrongContrats.push({
          element: elementsToCheck.foregroundElement.outerHTML,
          rule: 'RGAA - 3.2.1',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.1',
          message:
            'Color contrats for non-bold element with fontSize inferior to 24px should have at minimal 4.5 in contrast',
        });
      }

      if (textSize < 18.5 && isBold && ratio < 4.5) {
        wrongContrats.push({
          element: elementsToCheck.foregroundElement.outerHTML,
          rule: 'RGAA - 3.2.2',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.2',
          message:
            'Color contrats for bold element with fontSize inferior to 18.5px should have at minimal 4.5 in contrast',
        });
      }

      if (textSize >= 24 && !isBold && ratio < 3) {
        wrongContrats.push({
          element: elementsToCheck.foregroundElement.outerHTML,
          rule: 'RGAA - 3.2.3',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.3',
          message:
            'Color contrats for non-bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        });
      }

      if (textSize >= 18.5 && isBold && ratio < 3) {
        wrongContrats.push({
          element: elementsToCheck.foregroundElement.outerHTML,
          rule: 'RGAA - 3.2.4',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.4',
          message:
            'Color contrats for bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        });
      }
    });
    return wrongContrats;
  }
}
