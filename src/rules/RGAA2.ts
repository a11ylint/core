import { LogMessageParams } from '../types.js';

export type FrameOrIframe = HTMLIFrameElement | HTMLFrameElement;

export class RGAA2 {
  // eslint-disable-next-line class-methods-use-this
  public RGAA211(frames: Array<FrameOrIframe>) {
    const wrongFrames: Array<LogMessageParams> = [];
    frames.forEach(frame => {
      if (!frame.hasAttribute('title')) {
        wrongFrames.push({
          element: frame.outerHTML,
          rule: 'RGAA - 2.1.1',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.1.1',
          message: 'frame & iframe should have an attribute title',
        });
      }
    });

    return wrongFrames;
  }

  // eslint-disable-next-line class-methods-use-this
  public RGA221({ frames, customBannedWords }: { frames: Array<FrameOrIframe>; customBannedWords: Array<string> }) {
    const wrongFrames: Array<LogMessageParams> = [];
    const bannedWords = new Set(['frames', 'iframes', 'frame', 'iframe', ...customBannedWords]);

    // check if titles is in banned words
    frames.forEach(frame => {
      const hasTitle = frame.hasAttribute('title');
      // check with a regex
      if (!hasTitle) {
        return;
      }

      const title = frame.getAttribute('title');
      const isBanned = [...bannedWords].some(bannedWord => new RegExp(bannedWord, 'gi').test(title!) || title === '');
      if (isBanned) {
        wrongFrames.push({
          element: frame.outerHTML,
          rule: 'RGAA - 2.2.1',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.2.1',
          message: 'frame & iframe title should be revelant',
        });
      }
    });
    return wrongFrames;
  }
}
