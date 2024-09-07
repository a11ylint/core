import { expect, it } from 'vitest';
import { RGAA2, FrameOrIframe } from '../../src/rules/RGAA2';

const framesAndIframesWithWrongTitle: Array<FrameOrIframe> = [
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

const framesAndIframesWithGreatTitle: Array<FrameOrIframe> = [
  Object.assign(document.createElement('frame'), { title: 'Interactive maps' }),
  Object.assign(document.createElement('iframe'), { title: 'Contracts informations' }),
  Object.assign(document.createElement('iframe'), { title: 'Current location informations' }),
  Object.assign(document.createElement('frame'), { title: 'A video game' }),
];

const core = new RGAA2();

it('RGAA2.1 - frame & iframe should have an attribute title', () => {
  expect(core.RGAA211([...framesAndIframesWithWrongTitle, ...framesAndIframesWithGreatTitle])).toHaveLength(0);
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

it('RGAA2.2 - frame & iframe title should be revelant', () => {
  expect(core.RGA221({ frames: framesAndIframesWithWrongTitle, customBannedWords: [] })).toStrictEqual([
    {
      element: '<frame title="Frame 1">',
      message: 'frame & iframe title should be revelant',
      rule: 'RGAA - 2.2.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.2.1',
    },
    {
      element: '<iframe title="Iframe 1"></iframe>',
      message: 'frame & iframe title should be revelant',
      rule: 'RGAA - 2.2.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.2.1',
    },
    {
      element: '<iframe title="Iframe 2"></iframe>',
      message: 'frame & iframe title should be revelant',
      rule: 'RGAA - 2.2.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.2.1',
    },
    {
      element: '<frame title="Frame 2">',
      message: 'frame & iframe title should be revelant',
      rule: 'RGAA - 2.2.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.2.1',
    },
    {
      element: '<iframe title="" name="Iframe 3"></iframe>',
      message: 'frame & iframe title should be revelant',
      rule: 'RGAA - 2.2.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.2.1',
    },
    {
      element: '<frame title="" name="Iframe 4">',
      message: 'frame & iframe title should be revelant',
      rule: 'RGAA - 2.2.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.2.1',
    },
  ]);

  expect(core.RGA221({ frames: framesAndIframesWithGreatTitle, customBannedWords: [] })).toHaveLength(0);

  expect(core.RGA221({ frames: [...framesAndIframesWithGreatTitle], customBannedWords: ['video'] })).toStrictEqual([
    {
      element: '<frame title="A video game">',
      message: 'frame & iframe title should be revelant',
      rule: 'RGAA - 2.2.1',
      ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.2.1',
    },
  ]);
});
