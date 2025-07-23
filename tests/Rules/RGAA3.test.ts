import { expect, it, describe } from 'vitest';
import { ConstratsElement, RGAA3, VirtualConstratsElement } from '../../src/rules/RGAA3';

const ElementsWithWrongContrasts: Array<ConstratsElement> = [
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

const VirtualElementsWithWrongContrasts: Array<VirtualConstratsElement> = [
  {
    backgroundColor: 'rgb(255, 255, 255)',
    textColor: 'rgb(138, 138, 255)',
    fontSize: '16px',
    fontWeight: '400',
    outerHTML: '<p style="color: rgb(138, 138, 255);">toto</p>',
  },
  {
    backgroundColor: 'rgb(255, 255, 255)',
    textColor: 'rgb(138, 138, 255)',
    fontSize: '16px',
    fontWeight: '600',
    outerHTML: '<p style="color: rgb(138, 138, 255); font-size: 16px; font-weight: 600;">toto</p>',
  },
  {
    backgroundColor: 'rgb(255, 255, 255)',
    textColor: 'rgb(138, 138, 255)',
    fontSize: '32px',
    fontWeight: '400',
    outerHTML: '<p style="color: rgb(138, 138, 255); font-size: 32px;">toto</p>',
  },
  {
    backgroundColor: 'rgb(255, 255, 255)',
    textColor: 'rgb(138, 138, 255)',
    fontSize: '24px',
    fontWeight: '400',
    outerHTML: '<p style="color: rgb(138, 138, 255); font-size: 24px;">toto</p>',
  },
  {
    backgroundColor: 'rgb(255, 255, 255)',
    textColor: 'rgb(138, 138, 255)',
    fontSize: '24px',
    fontWeight: '600',
    outerHTML: '<p style="color: rgb(138, 138, 255); font-size: 24px; font-weight: 600;">toto</p>',
  },
];

const VirtualElementWithGoodConstrats: Array<VirtualConstratsElement> = [
  {
    backgroundColor: 'rgb(255, 255, 255)',
    textColor: 'rgb(97, 97, 255)',
    fontSize: '16px',
    fontWeight: '400',
    outerHTML: '<p style="color: rgb(97, 97, 255);">toto</p>',
  },
  {
    backgroundColor: 'rgb(255, 255, 255)',
    textColor: 'rgb(97, 97, 255)',
    fontSize: '16px',
    fontWeight: '600',
    outerHTML: '<p style="color: rgb(97, 97, 255); font-size: 16px; font-weight: 600;">toto</p>',
  },
  {
    backgroundColor: 'rgb(255, 255, 255)',
    textColor: 'rgb(97, 97, 255)',
    fontSize: '32px',
    fontWeight: '400',
    outerHTML: '<p style="color: rgb(97, 97, 255); font-size: 32px;">toto</p>',
  },
  {
    backgroundColor: 'rgb(255, 255, 255)',
    textColor: 'rgb(97, 97, 255)',
    fontSize: '24px',
    fontWeight: '400',
    outerHTML: '<p style="color: rgb(97, 97, 255); font-size: 24px;">toto</p>',
  },
  {
    backgroundColor: 'rgb(255, 255, 255)',
    textColor: 'rgb(97, 97, 255)',
    fontSize: '24px',
    fontWeight: '600',
    outerHTML: '<p style="color: rgb(97, 97, 255); font-size: 24px; font-weight: 600;">toto</p>',
  },
];

describe('RGAA3', () => {
  const core = new RGAA3('dom');
  const coreVirtual = new RGAA3('virtual');

  it('RGAA3.2 - Dom mode -color contrast should be egnouh', () => {
    expect(core.RGAA32(ElementWithGoodConstrats)).toHaveLength(0);
    expect(core.RGAA32(ElementsWithWrongContrasts)).toStrictEqual([
      {
        element: '<p style="color: rgb(138, 138, 255);"></p>',
        message:
          'Color contrasts for non-bold element with fontSize inferior to 24px should have at minimal 4.5 in contrast',
        rule: 'RGAA - 3.2.1',
        ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.1',
      },
      {
        element: '<p style="color: rgb(138, 138, 255); font-size: 16px; font-weight: 600;"></p>',
        message:
          'Color contrasts for bold element with fontSize inferior to 18.5px should have at minimal 4.5 in contrast',
        rule: 'RGAA - 3.2.2',
        ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.2',
      },
      {
        element: '<p style="color: rgb(138, 138, 255); font-size: 32px;"></p>',
        message:
          'Color contrasts for non-bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        rule: 'RGAA - 3.2.3',
        ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.3',
      },
      {
        element: '<p style="color: rgb(138, 138, 255); font-size: 24px;"></p>',
        message:
          'Color contrasts for non-bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        rule: 'RGAA - 3.2.3',
        ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.3',
      },
      {
        element: '<p style="color: rgb(138, 138, 255); font-size: 24px; font-weight: 600;"></p>',
        message:
          'Color contrasts for bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        rule: 'RGAA - 3.2.4',
        ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.4',
      },
    ]);
  });

  it('RGAA3.2 - Virtual mode - color contrast should be egnouh', () => {
    expect(coreVirtual.RGAA32(VirtualElementWithGoodConstrats)).toHaveLength(0);
    expect(coreVirtual.RGAA32(VirtualElementsWithWrongContrasts)).toStrictEqual([
      {
        element: '<p style="color: rgb(138, 138, 255);">toto</p>',
        message:
          'Color contrasts for non-bold element with fontSize inferior to 24px should have at minimal 4.5 in contrast',
        rule: 'RGAA - 3.2.1',
        ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.1',
      },
      {
        element: '<p style="color: rgb(138, 138, 255); font-size: 16px; font-weight: 600;">toto</p>',
        message:
          'Color contrasts for bold element with fontSize inferior to 18.5px should have at minimal 4.5 in contrast',
        rule: 'RGAA - 3.2.2',
        ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.2',
      },
      {
        element: '<p style="color: rgb(138, 138, 255); font-size: 32px;">toto</p>',
        message:
          'Color contrasts for non-bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        rule: 'RGAA - 3.2.3',
        ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.3',
      },
      {
        element: '<p style="color: rgb(138, 138, 255); font-size: 24px;">toto</p>',
        message:
          'Color contrasts for non-bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        rule: 'RGAA - 3.2.3',
        ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.3',
      },
      {
        element: '<p style="color: rgb(138, 138, 255); font-size: 24px; font-weight: 600;">toto</p>',
        message:
          'Color contrasts for bold element with fontSize superior or equal to 24px should have at minimal 3 in contrast',
        rule: 'RGAA - 3.2.4',
        ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.4',
      },
    ]);
  });
});
