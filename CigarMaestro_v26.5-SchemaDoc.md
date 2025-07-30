# Cigar Maestro JSON Schema Documentation
**Version:** v26.2  
**Generated:** 2025-06-13 21:44:29  

---
## Top-Level Keys

- **$defs** (`dict`)
- **$id** (`str`)
- **_copyright** (`str`)
- **_license** (`str`)
- **_licenseAgreement** (`dict`)
- **accessibilityConformance** (`dict`)
- **administrativeAccess** (`dict`)
- **apiConfig** (`dict`)
- **auditLog** (`dict`)
- **auditScorecard** (`dict`)
- **authenticationModule** (`dict`)
- **blendProfileTemplate** (`dict`)
- **ceuMetadataExample** (`dict`)
- **changelog** (`list`)
- **compliance** (`dict`)
- **constraints** (`dict`)
- **cuttingEdgeFeatures** (`dict`)
- **description** (`str`)
- **distilleryPairings** (`dict`)
- **examples** (`list`)
- **externalIntegrations** (`dict`)
- **featureFlags** (`dict`)
- **finalAuditActionPlan** (`dict`)
- **flavorEnhancements** (`dict`)
- **flavorJourneyTracker** (`dict`)
- **gptAssist** (`dict`)
- **historyUpgrades** (`dict`)
- **i18n** (`dict`)
- **integrityToken** (`str`)
- **localization** (`dict`)
- **loungeExperienceAssets** (`dict`)
- **membershipSystem** (`dict`)
- **metadata** (`dict`)
- **modules** (`dict`)
- **pairingExportOptions** (`list`)
- **projectDirective** (`dict`)
- **projectName** (`str`)
- **recommendedActionPlan** (`dict`)
- **scorecard** (`dict`)
- **socialAssetsTemplate** (`dict`)
- **systemCapabilities** (`dict`)
- **templateModules** (`dict`)
- **title** (`str`)
- **userOnboardingFlow** (`dict`)
- **userRolesAndViews** (`dict`)
- **version** (`str`)

---
## Defined Reusable Components (`$defs`)

### `pairingEntry`
- Description: A structured entry for body-based cigar pairings
  - `body` (`string`) – Body strength of the cigar (e.g., mild, medium, full)
  - `wrappers` (`array`) – Wrapper types compatible with this body strength
  - `recommendations` (`array`) – List of recommended distilleries
### `distilleryEntry`
- Description: Details for a single distillery's cigar pairing profile
  - `name` (`string`) – 
  - `country` (`string`) – 
  - `type` (`string`) – 
  - `pairingNotes` (`string`) – 
  - `wrapperCompatibility` (`array`) – 
### `ceuModule`
- Description: Reusable CEU module metadata structure
  - `quizId` (`string`) – 
  - `ceuValue` (`number`) – 
  - `lmsFlag` (`boolean`) – 
  - `tier` (`string`) – 
### `membershipTier`
- Description: Describes each subscription level and its constraints
  - `tierName` (`string`) – 
  - `priceMonthly` (`number`) – 
  - `targetAudience` (`string`) – 
  - `features` (`array`) – 
  - `restrictions` (`array`) – 
### `uiHintStep`
- Description: Standardized UI guidance for onboarding steps
  - `step` (`string`) – 
  - `inputType` (`string`) – 
  - `widgetHint` (`string`) – 