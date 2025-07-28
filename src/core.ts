import { AuditGenerator } from './audit/generateAudit.js';
import { RGAA1, SvgImageArea } from './rules/RGAA1.js';
import { RGAA2 } from './rules/RGAA2.js';
import { RGAA6 } from './rules/RGAA6.js';
import { ConstratsElement, RGAA3, VirtualContrastsElement } from './rules/RGAA3.js';
import { RGAA11, FormFieldElement } from './rules/RGAA11.js';
import { RGAA8 } from './rules/RGAA8.js';
import { LogMessageParams, Mode } from './types.js';

type runParams = {
  mode: Mode;
  document: Document;
  customIframeBannedWords?: Array<string>;
  images?: Array<SvgImageArea>;
  frames?: Array<HTMLIFrameElement | HTMLFrameElement>;
  links?: Array<HTMLAnchorElement | HTMLElement>;
  colorsElements?: Array<ConstratsElement | VirtualContrastsElement>;
  formFields?: Array<FormFieldElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
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
  public run({
    mode,
    document,
    customIframeBannedWords = [],
    images = [],
    frames = [],
    links = [],
    colorsElements = [],
    formFields = [],
  }: runParams) {
    const rgaa1 = new RGAA1(mode);
    const rgaa2 = new RGAA2(mode);
    const rgaa6 = new RGAA6();
    const rgaa8 = new RGAA8();
    const rgaa3 = new RGAA3(mode);
    const rgaa11 = new RGAA11(mode);

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
    const wrongContrasts = rgaa3.RGAA32(colorsElements);
    const wrongFormFieldsLabels = rgaa11.RGAA111(formFields);
    const wrongFormFieldsLabelStructure = rgaa11.RGAA112(formFields);

    const allResults = [
      ...wrongElement,
      ...wrongFrames,
      ...wrongFramesBannedWords,
      ...wrongDoctype,
      ...wrongLang,
      ...wrongTitle,
      ...wrongContrasts,
      ...wrongLinks,
      ...wrongFormFieldsLabels,
      ...wrongFormFieldsLabelStructure,
    ];

    const groupedResults = allResults.reduce<{ [key: string]: LogMessageParams[] }>((acc, res) => {
      if (res?.rule) {
        acc[res.rule] = acc[res.rule] ? [...acc[res.rule], res] : [res];
      }
      return acc;
    }, {});

    const sortedKeys = Object.keys(groupedResults).sort((a, b) => {
      const parseRule = (rule: string) => {
        const dashIndex = rule.indexOf('- ');
        if (dashIndex === -1) return [];

        const afterDash = rule.substring(dashIndex + 2);
        let ruleNumber = '';

        // eslint-disable-next-line no-restricted-syntax
        for (const char of afterDash) {
          if ((char >= '0' && char <= '9') || char === '.') {
            ruleNumber += char;
          } else {
            break;
          }
        }

        if (!ruleNumber) return [];

        return ruleNumber.split('.').map(part => {
          const num = parseInt(part, 10);
          return Number.isNaN(num) ? 0 : num;
        });
      };
      const aParts = parseRule(a);
      const bParts = parseRule(b);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] ?? 0;
        const bVal = bParts[i] ?? 0;
        if (aVal !== bVal) return aVal - bVal;
      }
      return 0;
    });

    const sortedResults = sortedKeys.reduce<{ [key: string]: LogMessageParams[] }>((acc, key) => {
      acc[key] = groupedResults[key];
      return acc;
    }, {});

    return sortedResults;
  }

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
