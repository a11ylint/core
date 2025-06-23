import { RGAA1, SvgImageAreaProps } from './rules/RGAA1.js';
import { RGAA2 } from './rules/RGAA2.js';
import { RGAA8 } from './rules/RGAA8.js';
import { Mode } from './types.js';

type runParams = {
  mode: Mode;
  document: Document;
  customIframeBannedWords?: Array<string>;
  images?: Array<SvgImageAreaProps>;
  frames?: Array<HTMLIFrameElement | HTMLFrameElement>;
};

// eslint-disable-next-line import/no-default-export
export default class core {
  public static run({ mode, document, customIframeBannedWords = [], images = [], frames = [] }: runParams) {
    const rgaa1 = new RGAA1(mode);
    const rgaa2 = new RGAA2(mode);
    const rgaa8 = new RGAA8();

    // run all rules and return the result
    const wrongElement = rgaa1.RGAA11(images);
    const wrongFrames = rgaa2.RGAA211(frames);
    const wrongFramesBannedWords = rgaa2.RGAA221({
      frames,
      customBannedWords: customIframeBannedWords,
    });
    const wrongDoctype = rgaa8.RGAA81([document]);
    const wrongLang = rgaa8.RGAA83([document]);
    const wrongTitle = rgaa8.RGAA85([document]);

    // create an object with the rule and the result associated
    const result = {
      'RGAA - 1.1.1': wrongElement,
      'RGAA - 2.1.1': wrongFrames,
      'RGAA - 2.2.1': wrongFramesBannedWords,
      'RGAA - 8.1.1': wrongDoctype,
      'RGAA - 8.3': wrongLang,
      'RGAA - 8.5': wrongTitle,
    };

    return result;
  }
}
