export type LogMessageParams = {
  element: string;
  rule: string; // Assuming rule is a string linked by the RGAA
  ruleLink: string; // Assuming ruleLink is a string linked by the RGAA
  message: string;
};

export type Mode = 'dom' | 'virtual';
