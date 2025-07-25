import { AuditGenerator } from './audit/generateAudit.js';
import { RGAA1, SvgImageArea } from './rules/RGAA1.js';
import { RGAA2 } from './rules/RGAA2.js';
import { RGAA6 } from './rules/RGAA6.js';
import { RGAA8 } from './rules/RGAA8.js';
import { LogMessageParams, Mode } from './types.js';

type runParams = {
  mode: Mode;
  document: Document;
  customIframeBannedWords?: Array<string>;
  images?: Array<SvgImageArea>;
  frames?: Array<HTMLIFrameElement | HTMLFrameElement>;
  links?: Array<HTMLAnchorElement | HTMLElement>;
};

type AuditOptionsBase = {
  json?: boolean;
  cli?: boolean;
};

type AuditOptionsHtml = AuditOptionsBase & {
  html: true;
  baseUrl: string;
};

type AuditOptionsNoHtml = AuditOptionsBase & {
  html?: false;
  baseUrl?: string;
};

type AuditOptions = AuditOptionsHtml | AuditOptionsNoHtml;

export class Core {
  public run({ mode, document, customIframeBannedWords = [], images = [], frames = [], links = [] }: runParams) {
    const rgaa1 = new RGAA1(mode);
    const rgaa2 = new RGAA2(mode);
    const rgaa6 = new RGAA6();
    const rgaa8 = new RGAA8();

    // run all rules and return the result
    const wrongElement = rgaa1.RGAA11(images);
    const wrongFrames = rgaa2.RGAA211(frames);
    const wrongFramesBannedWords = rgaa2.RGAA221({
      frames,
      customBannedWords: customIframeBannedWords,
    });
    const wrongLinks = rgaa6.RGAA62(links);
    const wrongDoctype = rgaa8.RGAA81([document]);
    const wrongLang = rgaa8.RGAA83([document]);
    const wrongTitle = rgaa8.RGAA85([document]);

    // create an object with the rule and the result associated
    const result = {
      'RGAA - 1.1.1': wrongElement,
      'RGAA - 2.1.1': wrongFrames,
      'RGAA - 2.2.1': wrongFramesBannedWords,
      'RGAA - 6.2.1': wrongLinks,
      'RGAA - 8.1.1': wrongDoctype,
      'RGAA - 8.3': wrongLang,
      'RGAA - 8.5': wrongTitle,
    };

    return result;
  }

  // make dynamic type
  /**
   * Generates an audit report based on the results of the accessibility checks.
   * @param {Object} params - The parameters for generating the audit.
   * @param {Array} params.results - The results of the accessibility checks.
   * @param {Object} [params.options] - Options for the audit format.
   * @param {boolean} [params.options.html=false] - Whether to generate an HTML report.
   * @param {boolean} [params.options.json=false] - Whether to generate a JSON report.
   * @param {string} [params.options.baseUrl='audit.html'] - The base URL for the HTML report.
   * @param {boolean} [params.options.cli=false] - Whether to generate a CLI report.
   */
  public generateAudit({
    results,
    options = { html: false, json: false, baseUrl: 'audit.html', cli: false },
  }: {
    results: Array<{ url: string; result: { [key: string]: Array<LogMessageParams> } }>;
    options: AuditOptions;
  }) {
    const generator = new AuditGenerator();
    if (options.html) {
      generator.generateHtmlAudit({ results, baseUrl: options.baseUrl });
    }
    if (options.json) {
      generator.generateJsonAudit({ results, baseUrl: options.baseUrl });
    }
    if (options.cli) {
      generator.generateAudit({ results });
    }
    if (!options.html && !options.json && !options.cli) {
      throw new Error('No audit format specified. Please set html, json, or cli to true in options.');
    }
  }
}
