# @a11ylint/core

[![Build](https://github.com/a11ylint/core/actions/workflows/build.yaml/badge.svg)](https://github.com/a11ylint/core/actions/workflows/build.yaml)
[![GitHub License](https://img.shields.io/github/license/pplancq/svg-tools)](https://github.com/pplancq/svg-tools?tab=MIT-1-ov-file#readme)

A powerful accessibility testing tool designed to validate web projects against French accessibility guidelines (RGAA - Référentiel Général d'Amélioration de l'Accessibilité).

## 🎯 Motivation

This project was born from an idea by **CROQUET Mickael**, who envisioned implementing a comprehensive series of tests for French RGAA accessibility rules. After extensive research, we discovered a significant gap in the ecosystem - no suitable library existed to address this specific need for French accessibility standards.

Inspired by this vision and driven by the necessity to fill this gap, **PLANCQ Paul** joined forces with Mickael to initiate this project. Together, we decided to create our own robust package to validate RGAA rules, making French web accessibility testing more accessible to developers and organizations.

Our goal is to provide the French web development community with a reliable, comprehensive tool that ensures websites meet the stringent accessibility standards required by French regulations, ultimately making the web more inclusive for everyone.

## 🚧 Under Construction

This repository is currently under active development.
While the foundation is being laid, please note that certain features and components may still be incomplete.
Stay tuned for updates as we build a robust and cohesive accessibility testing system.

## ✨ Features

- **RGAA Compliance Testing**: Automated testing for French accessibility standards
- **Multiple Output Formats**: Generate reports in HTML, JSON, or CLI formats
- **Comprehensive Rule Coverage**: Support for RGAA 1.x, 2.x, 3.x, and 8.x rules
- **DOM & Virtual Testing**: Works with both real DOM elements and virtual representations
- **Color Contrast Analysis**: Advanced color contrast calculations following RGAA guidelines
- **Detailed Reporting**: Get actionable insights with specific element references and fix suggestions

## 🚀 Quick Start

### Installation

```bash
npm install @a11ylint/core
```

### Basic Usage

```typescript
import A11ylint from '@a11ylint/core';

// Initialize the core
const a11ylint = new A11ylint();

// Run accessibility tests
const results = a11ylint.run({
  mode: 'dom', // or 'virtual'
  document: document, // Your DOM document
  images: [], // Array of image elements to test
  frames: [], // Array of frame/iframe elements to test
  customIframeBannedWords: ['frame', 'iframe'] // Optional custom banned words
});

console.log(results);
```

### Generate Reports

```typescript
// Generate different types of reports
a11ylint.generateAudit({
  results: [
    {
      url: 'https://example.com',
      result: results
    }
  ],
  options: {
    html: true,
    json: true,
    cli: true,
    baseUrl: 'https://example.com'
  }
});
```

## 📊 Supported RGAA Rules

| Category | Rules | Description |
|----------|--------|-------------|
| **RGAA 1** | 1.1.1, 1.1.2, 1.1.5 | Image accessibility (alt text, area elements, SVG) |
| **RGAA 2** | 2.1.1, 2.2.1 | Frame accessibility (titles, relevance) |
| **RGAA 3** | 3.2.x | Color contrast requirements |
| **RGAA 8** | 8.1.1, 8.1.3, 8.3, 8.5 | Document structure (doctype, language, title) |

## 📈 Report Generation

@a11ylint/core generates comprehensive accessibility reports in multiple formats:

### HTML Reports
- Visual, interactive reports with detailed issue descriptions
- Color-coded severity levels
- Direct links to RGAA documentation
- Element-specific code examples

### JSON Reports
- Machine-readable format for CI/CD integration
- Structured data for custom processing
- API-friendly output

### CLI Reports
- Terminal-friendly output for development workflows
- Quick overview of accessibility issues
- Perfect for continuous integration

## 🧪 Testing Modes

### DOM Mode
Test real DOM elements in browser environments:
```typescript
const results = a11ylint.run({
  mode: 'dom',
  document: document,
  // ... other options
});
```

### Virtual Mode
Test serialized element data (perfect for server-side testing):
```typescript
const results = core.run({
  mode: 'virtual',
  document: virtualDocument,
  images: virtualImageElements,
  // ... other options
});
```

### Roadmap
- [ ] Extended RGAA rule coverage
- [ ] Integration with popular testing frameworks
- [ ] Browser extension for real-time testing
- [ ] Advanced color contrast algorithms
- [ ] Multi-language support beyond French

## 📚 Documentation

For more information about RGAA guidelines, visit [https://accessibilite.numerique.gouv.fr](https://accessibilite.numerique.gouv.fr).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT ©

---

**Made with ❤️ for French web accessibility**
