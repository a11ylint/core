import { describe, it, expect } from 'vitest';
import { AuditGenerator } from '../../src/audit/generateAudit';

describe('mapAuditDataCompliance', () => {
  const auditGen = new AuditGenerator();

  it('should return 100% compliance when all rules have no issues', () => {
    const mappedResultsObject = {
      'example.com': {
        'RGAA - 1.1.1': { issues: [] },
        'RGAA - 1.2.1': { issues: [] },
        'RGAA - 2.1.1': { issues: [] },
        'RGAA - 2.2.1': { issues: [] },
        'RGAA - 8.1.1': { issues: [] },
        'RGAA - 8.3': { issues: [] },
        'RGAA - 8.5': { issues: [] },
      },
    };
    // @ts-expect-error: Accessing private method for testing purposes
    const result = auditGen.mapAuditDataCompliance(mappedResultsObject);
    expect(result['1'].compliance).toBeTruthy();
    expect(result['1'].percentage).toBe(100);
    expect(result['2'].compliance).toBeTruthy();
    expect(result['8'].compliance).toBeTruthy();
  });

  it('should return partial compliance and list rules in error', () => {
    const mappedResultsObject = {
      'example.com': {
        'RGAA - 1.1.1': { issues: [{ element: '<img>' }] },
        'RGAA - 1.2.1': { issues: [] },
        'RGAA - 2.1.1': { issues: [{ element: '<frame>' }] },
        'RGAA - 2.2.1': { issues: [] },
        'RGAA - 8.1.1': { issues: [] },
        'RGAA - 8.3': { issues: [{ element: '<html>' }] },
        'RGAA - 8.5': { issues: [] },
      },
    };
    // @ts-expect-error: Accessing private method for testing purposes
    const result = auditGen.mapAuditDataCompliance(mappedResultsObject);
    expect(result['1'].compliance).toBeFalsy();
    expect(result['1'].ruleInError).toContain('RGAA - 1.1.1');
    expect(result['1'].percentage).toBe(67);
    expect(result['2'].compliance).toBeFalsy();
    expect(result['2'].ruleInError).toContain('RGAA - 2.1.1');
    expect(result['2'].percentage).toBe(50);
    expect(result['8'].compliance).toBeFalsy();
    expect(result['8'].ruleInError).toContain('RGAA - 8.3');
    expect(result['8'].percentage).toBe(75);
  });

  it('should handle missing rules as compliant', () => {
    const mappedResultsObject = {
      'example.com': {
        'RGAA - 1.1.1': { issues: [] },
        // 'RGAA - 1.2.1' is missing
        'RGAA - 2.1.1': { issues: [] },
        'RGAA - 2.2.1': { issues: [] },
        'RGAA - 8.1.1': { issues: [] },
        'RGAA - 8.3': { issues: [] },
        'RGAA - 8.5': { issues: [] },
      },
    };
    // @ts-expect-error: Accessing private method for testing purposes
    const result = auditGen.mapAuditDataCompliance(mappedResultsObject);
    expect(result['1'].compliance).toBeTruthy();
    expect(result['1'].percentage).toBe(100);
  });
});
