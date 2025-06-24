import { LogMessageParams } from '../types.js';

export class RGAA8 {
  public RGAA81(documents: Array<Document>) {
    const wrongElement: Array<LogMessageParams> = [];
    // check doctype is present
    documents.forEach(doc => {
      const { doctype } = doc;
      if (!doctype) {
        wrongElement.push({
          element: doc.baseURI,
          rule: 'RGAA - 8.1.1',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#8.1',
          message: 'Document (Page) should have a doctype',
        });
      }

      // RGAA 8.1.3 Doctype should be first
      const doctypeIndex = doc.firstChild?.nodeType === doc.DOCUMENT_TYPE_NODE;
      if (doctypeIndex) {
        wrongElement.push({
          element: doc.baseURI,
          rule: 'RGAA - 8.1.3',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#8.1.3',
          message: 'Document (Page) doctype should be first',
        });
      }
    });
    return wrongElement;
  }

  public RGAA83(documents: Array<Document>) {
    const wrongElement: Array<LogMessageParams> = [];
    // check lang in html tag
    documents.forEach(doc => {
      const { lang } = doc.documentElement;
      if (!lang || lang.length <= 0) {
        wrongElement.push({
          element: doc.baseURI,
          rule: 'RGAA - 8.3',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#8.3',
          message: 'Document (Page) should have a lang attribute',
        });
      }
    });
    return wrongElement;
  }

  public RGAA85(documents: Array<Document>) {
    const wrongElement: Array<LogMessageParams> = [];
    documents.forEach(doc => {
      if (doc.title.length <= 0) {
        wrongElement.push({
          element: doc.baseURI,
          rule: 'RGAA - 8.5',
          ruleLink: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#8.5',
          message: 'Document (Page) should have a title',
        });
      }
    });

    return wrongElement;
  }
}
