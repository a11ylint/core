import { expect, it } from 'vitest';
import { ConstratsElement, RGAA3 } from '../../src/rules/RGAA3';

const ElementsWithWrongContrats: Array<ConstratsElement> = [
  {
    backgroundElement: Object.assign(document.createElement('div'), {
      style: 'background-color: #FFFFFF;',
    }),
    foregroundElement: Object.assign(document.createElement('p'), {
      style: 'color: #8A8AFF;',
      innerText: 'toto',
    }),
  },
  {
    backgroundElement: Object.assign(document.createElement('div'), {
      style: 'background-color: #FFFFFF;',
    }),
    foregroundElement: Object.assign(document.createElement('p'), {
      style: 'color: #8A8AFF;font-size:16px;font-weight:600;',
      innerText: 'toto',
    }),
  },
  {
    backgroundElement: Object.assign(document.createElement('div'), {
      style: 'background-color: #FFFFFF;',
    }),
    foregroundElement: Object.assign(document.createElement('p'), {
      style: 'color: #8A8AFF;font-size:32px;',
      innerText: 'toto',
    }),
  },
  {
    backgroundElement: Object.assign(document.createElement('div'), {
      style: 'background-color: #FFFFFF;',
    }),
    foregroundElement: Object.assign(document.createElement('p'), {
      style: 'color: #8A8AFF;font-size:24px;',
      innerText: 'toto',
    }),
  },
  {
    backgroundElement: Object.assign(document.createElement('div'), {
      style: 'background-color: #FFFFFF;',
    }),
    foregroundElement: Object.assign(document.createElement('p'), {
      style: 'color: #8A8AFF;font-size:24px;font-weight:600;',
      innerText: 'toto',
    }),
  },
];

const ElementWithGoodConstrats: Array<ConstratsElement> = [
  {
    backgroundElement: Object.assign(document.createElement('div'), {
      style: 'background-color: #FFFFFF;',
    }),
    foregroundElement: Object.assign(document.createElement('p'), {
      style: 'color: #6161FF;',
      innerText: 'toto',
    }),
  },
  {
    backgroundElement: Object.assign(document.createElement('div'), {
      style: 'background-color: #FFFFFF;',
    }),
    foregroundElement: Object.assign(document.createElement('p'), {
      style: 'color: #6161FF;font-size:16px;font-weight:600;',
      innerText: 'toto',
    }),
  },
  {
    backgroundElement: Object.assign(document.createElement('div'), {
      style: 'background-color: #FFFFFF;',
    }),
    foregroundElement: Object.assign(document.createElement('p'), {
      style: 'color: #6161FF;font-size:32px;',
      innerText: 'toto',
    }),
  },
  {
    backgroundElement: Object.assign(document.createElement('div'), {
      style: 'background-color: #FFFFFF;',
    }),
    foregroundElement: Object.assign(document.createElement('p'), {
      style: 'color: #6161FF;font-size:24px;',
      innerText: 'toto',
    }),
  },
  {
    backgroundElement: Object.assign(document.createElement('div'), {
      style: 'background-color: #FFFFFF;',
    }),
    foregroundElement: Object.assign(document.createElement('p'), {
      style: 'color: #6161FF;font-size:24px;font-weight:600;',
      innerText: 'toto',
    }),
  },
];

const core = new RGAA3();

it('RGAA3.2 - frame & iframe should have an attribute title', () => {
  expect(core.RGAA32(ElementWithGoodConstrats)).toHaveLength(0);
  expect(core.RGAA32(ElementsWithWrongContrats)).toStrictEqual([
    {
      element: '<p style="color: rgb(138, 138, 255);"></p>',
      message:
        'Color contrats for non-bold element with fontSize inferior to 24px should have at minimal 4.5 in contrast',
      rule: 'RGAA - 3.2.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.1',
    },
    {
      element: '<p style="color: rgb(138, 138, 255); font-size: 16px; font-weight: 600;"></p>',
      message:
        'Color contrats for bold element with fontSize inferior to 18.5px should have at minimal 4.5 in contrast',
      rule: 'RGAA - 3.2.2',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.2',
    },
    {
      element: '<p style="color: rgb(138, 138, 255); font-size: 32px;"></p>',
      message:
        'Color contrats for non-bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
      rule: 'RGAA - 3.2.3',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.3',
    },
    {
      element: '<p style="color: rgb(138, 138, 255); font-size: 24px;"></p>',
      message:
        'Color contrats for non-bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
      rule: 'RGAA - 3.2.3',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.3',
    },
    {
      element: '<p style="color: rgb(138, 138, 255); font-size: 24px; font-weight: 600;"></p>',
      message:
        'Color contrats for bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
      rule: 'RGAA - 3.2.4',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.4',
    },
  ]);
});
