import { LogMessageParams } from '../types.js';

export type FrameOrIframe = HTMLIFrameElement | HTMLFrameElement;

class RGAA2 {
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
}

export { RGAA2 };
