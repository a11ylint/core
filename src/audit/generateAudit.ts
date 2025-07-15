import Handlebars from 'handlebars';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { LogMessageParams } from 'src/types.js';
import { DICTIONARY } from 'src/utils/dictonnary.js';

export class AuditGenerator {
  public generateHtmlAudit({
    results,
    baseUrl = 'audit',
  }: {
    results: Array<{ url: string; result: { [key: string]: Array<LogMessageParams> } }>;
    baseUrl?: string;
  }) {
    console.info(`Generating HTML file test audit for ${baseUrl}`);

    const filename = fileURLToPath(import.meta.url);
    const dirname = pathDirname(filename);

    const templateHtml = readFileSync(join(dirname, '../..', 'template', 'template.fr_FR.html'), {
      encoding: 'utf-8',
    });
    const css = readFileSync(join(dirname, '../..', 'template', 'template.css'), {
      encoding: 'utf-8',
    });
    const mappedResultsObject = this.mapTemplateObject(results);
    const compliance = this.mapAuditDataCompliance(mappedResultsObject);
    const generatedTemplate = Handlebars.compile(templateHtml);
    const generateResult = generatedTemplate({
      audits: mappedResultsObject,
      baseUrl,
      website: baseUrl.replace(/https?:\/\//, ''),
      style: css,
      rgaaCompliance: compliance,
    });
    writeFileSync(baseUrl ? `${baseUrl.replace(/https?:\/\//, '')}.html` : baseUrl, generateResult);
    console.info(
      `HTML file test audit generated at ${baseUrl ? `${baseUrl.replace(/https?:\/\//, '')}.html` : baseUrl}`,
    );
  }

  // generateAudit function to create a JSON audit
  public generateJsonAudit({
    results,
    baseUrl,
  }: {
    results: Array<{ url: string; result: { [key: string]: Array<LogMessageParams> } }>;
    baseUrl?: string;
  }) {
    console.info(`Generating JSON file test audit for ${baseUrl}`);
    const mappedResultsObject = this.mapTemplateObject(results);
    const currentBaseUrl = baseUrl?.replace(/https?:\/\//, '') || 'audit';
    console.info(`JSON file test audit generated at ${baseUrl}`);
    writeFileSync(`${currentBaseUrl}.json`, JSON.stringify(mappedResultsObject, null, 2));
    return mappedResultsObject;
  }

  // generateAudit function to create CLI audit
  public generateAudit({
    results,
  }: {
    results: Array<{ url: string; result: { [key: string]: Array<LogMessageParams> } }>;
  }) {
    console.info('Generating CLI audit');
    const mappedResultsObject = this.mapTemplateObject(results);

    console.info(mappedResultsObject);
  }

  private mapTemplateObject(results: Array<{ url: string; result: { [key: string]: Array<LogMessageParams> } }>) {
    let mappedResultsObject = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const result of results) {
      const mappedResult = Object.entries(result.result).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            message: value[0]?.message || '',
            ruleLink: value[0]?.ruleLink || '',
            issues: value.map(issue => ({
              element: issue.element,
            })),
            hasDomElement: value.some(issue => issue.element && issue.element.trim() !== ''),
          };
          return acc;
        },
        {} as {
          [key: string]: {
            message: string;
            ruleLink: string;
            issues: Array<{ element: string }>;
            hasDomElement?: boolean;
          };
        },
      );
      mappedResultsObject = { ...mappedResultsObject, ...{ [result.url]: { ...mappedResult } } };
    }
    return mappedResultsObject;
  }

  private mapAuditDataCompliance(
    mappedResultsObject: Record<
      string,
      {
        [key: string]: {
          issues: Array<{ element: string }>;
        };
      }
    >,
  ) {
    const compliance: Record<
      string,
      {
        compliance: boolean;
        criteriaCount: number;
        percentage?: number;
        ruleInError?: string[];
      }
    > = {};
    Object.entries(mappedResultsObject).forEach(([, rules]) => {
      Object.keys(rules).forEach(rule => {
        Object.entries(DICTIONARY).forEach(([category, subRules]) => {
          const ruleNumber = category.split(' - ')[1];
          if (subRules.includes(rule) && rules[rule]?.issues.length > 0) {
            compliance[ruleNumber] = {
              compliance: false,
              criteriaCount: subRules.length,
              ruleInError: compliance[ruleNumber]?.ruleInError || [],
            };
            compliance[ruleNumber].ruleInError = [...new Set(compliance[ruleNumber].ruleInError).add(rule)];
            compliance[ruleNumber].percentage = Math.round(
              ((subRules.length - (compliance[ruleNumber]?.ruleInError?.length ?? 0)) / subRules.length) * 100,
            );
          } else if (compliance[ruleNumber] === undefined) {
            compliance[ruleNumber] = {
              compliance: true,
              criteriaCount: subRules.length,
              percentage: 100,
              ruleInError: [],
            };
          }
        });
      });
    });
    return compliance;
  }
}
