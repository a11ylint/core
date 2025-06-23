import { LogMessageParams, Mode } from '../types.js';

export type FrameOrIframe = HTMLIFrameElement | HTMLFrameElement;

export class RGAA2 {
  private mode: Mode;

  constructor(mode: Mode) {
    this.mode = mode;
  }

  public RGAA211(elements: Array<FrameOrIframe>): LogMessageParams[] {
    switch (this.mode) {
      case 'dom':
        return this.RGAA211_dom(elements);
      case 'virtual':
        return this.RGAA211_virtual(elements);
      default:
        throw new Error(`Unknown mode: ${this.mode}`);
    }
  }

  public RGAA221({
    frames,
    customBannedWords,
  }: {
    frames: Array<FrameOrIframe>;
    customBannedWords: Array<string>;
  }): LogMessageParams[] {
    switch (this.mode) {
      case 'dom':
        return this.RGAA221_dom({
          frames,
          customBannedWords,
        });
      case 'virtual':
        return this.RGAA221_virtual({
          frames,
          customBannedWords,
        });
      default:
        throw new Error(`Unknown mode: ${this.mode}`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private RGAA211_virtual(frames: Array<FrameOrIframe>) {
    const wrongFrames: Array<LogMessageParams> = [];
    frames.forEach(frame => {
      const { title, outerHTML } = frame as FrameOrIframe;
      if (!title) {
        wrongFrames.push({
          element: outerHTML,
          rule: 'RGAA - 2.1.1',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.1.1',
          message: 'frame & iframe should have an attribute title',
        });
      }
    });
    return wrongFrames;
  }

  // eslint-disable-next-line class-methods-use-this
  private RGAA211_dom(frames: Array<FrameOrIframe>) {
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
  private RGAA221_dom({
    frames,
    customBannedWords,
  }: {
    frames: Array<FrameOrIframe>;
    customBannedWords: Array<string>;
  }) {
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

  // eslint-disable-next-line class-methods-use-this
  private RGAA221_virtual({
    frames,
    customBannedWords,
  }: {
    frames: Array<FrameOrIframe>;
    customBannedWords: Array<string>;
  }) {
    const wrongFrames: Array<LogMessageParams> = [];
    const bannedWords = new Set(['frames', 'iframes', 'frame', 'iframe', ...customBannedWords]);

    // check if titles is in banned words
    frames.forEach(frame => {
      const { title, outerHTML } = frame as FrameOrIframe;
      const isBanned = [...bannedWords].some(bannedWord => new RegExp(bannedWord, 'gi').test(title!) || title === '');
      if (isBanned) {
        wrongFrames.push({
          element: outerHTML,
          rule: 'RGAA - 2.2.1',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#2.2.1',
          message: 'frame & iframe title should be revelant',
        });
      }
    });
    return wrongFrames;
  }
}
