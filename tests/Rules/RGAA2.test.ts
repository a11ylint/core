import { expect, it } from 'vitest';
import { RGAA2, FrameOrIframe } from '../../src/rules/RGAA2';

const framesAndIframesWithTitle: Array<FrameOrIframe> = [
  Object.assign(document.createElement('frame'), { title: 'Frame 1' }), // with title
  Object.assign(document.createElement('iframe'), { title: 'Iframe 1' }), // with title
  Object.assign(document.createElement('iframe'), { title: 'Iframe 2' }), // with title
  Object.assign(document.createElement('frame'), { title: 'Frame 2' }), // with title
  Object.assign(document.createElement('iframe'), { title: '', name: 'Iframe 3' }),
  Object.assign(document.createElement('frame'), { title: '', name: 'Iframe 4' }),
];

const framesAndIframesWithoutTitle: Array<FrameOrIframe> = [
  Object.assign(document.createElement('frame')),
  Object.assign(document.createElement('iframe')),
];

const core = new RGAA2();

it('RGAA2.1 - frame & iframe should have an attribute title', () => {
  expect(core.RGAA211(framesAndIframesWithTitle)).toHaveLength(0);
  expect(core.RGAA211(framesAndIframesWithoutTitle)).toStrictEqual([
    {
      element: '<frame>',
      rule: 'RGAA - 2.1.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.1.1',
      message: 'frame & iframe should have an attribute title',
    },
    {
      element: '<iframe></iframe>',
      rule: 'RGAA - 2.1.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.1.1',
      message: 'frame & iframe should have an attribute title',
    },
  ]);
});
