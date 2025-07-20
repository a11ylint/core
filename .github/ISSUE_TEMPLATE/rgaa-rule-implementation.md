---
name: RGAA Rule Implementation
about: Template for implementing a new RGAA rule
title: 'Implement RGAA X.Y : [Rule Description]'
labels: ['feature']
assignees: ''
---

## 🎯 RGAA Rule to Implement

**Rule**: RGAA X.Y  
**Priority**: 🔥 Critical / ⚠️ High / 📋 Medium / 🔵 Low  
**Complexity**: Low / Medium / High / Very High  
**Theme**: [RGAA Theme Name]

## 📋 Description

<!-- Brief description of the RGAA criteria extracted from RGAA.md -->

## ✅ Acceptance Criteria

- [ ] DOM mode implementation
- [ ] Virtual mode implementation  
- [ ] Unit tests with edge cases
- [ ] Documentation update
- [ ] Localized error messages (FR)

## 🔧 Technical Requirements

- [ ] Element detection logic
- [ ] Validation algorithms according to RGAA 4.1.2
- [ ] Exception cases handling
- [ ] Performance optimization
- [ ] Compatibility with existing architecture

## 📚 References

[RGAA X.X Official Documentation - RGAA X.X](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#X.X)

## 💡 Implementation Notes

<!-- Specific technical remarks, patterns to follow, anticipated difficulties -->

## 🧪 Expected Test Cases

- [ ] Positive cases (compliant elements)
- [ ] Negative cases (non-compliant elements)
- [ ] Edge cases and exceptions
- [ ] Performance tests on large documents

---

**Target File**: `src/rules/RGAAX.ts`  
**Tests**: `tests/Rules/RGAAX.test.ts`

<!-- 
Suggested labels to add:
- priority-critical / priority-high / priority-medium / priority-low
- theme-[images|forms|navigation|etc.]
- complexity-[low|medium|high|very-high]
-->
