#!/usr/bin/env node

/**
 * Enhanced Data Validation and Integration Script for Thee Cigar Maestro
 * Validates JSON files for proper structure, completeness, and integration readiness
 */

const fs = require('fs');
const path = require('path');

class EnhancedDataValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.integrationReport = [];
    this.featureMap = new Map();
  }

  validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      console.log(`✓ Validating ${filePath}...`);
      
      switch (path.basename(filePath)) {
        case 'flavorverse_nodes.json':
          this.validateFlavorverseNodes(data);
          break;
        case 'cigar-specs.json':
          this.validateCigarSpecs(data);
          break;
        case 'pairings.json':
          this.validatePairings(data);
          break;
        case 'education.json':
          this.validateEducation(data);
          break;
        case 'features.json':
          this.validateFeatures(data);
          break;
        case 'interface.json':
          this.validateInterface(data);
          break;
        case 'meta.json':
          this.validateMeta(data);
          break;
        case 'emotional.json':
          this.validateEmotional(data);
          break;
        case 'lounge.json':
          this.validateLounge(data);
          break;
        case 'flavor-atlas.json':
          this.validateFlavorAtlas(data);
          break;
        default:
          this.validateGenericJSON(data);
      }
      
    } catch (error) {
      this.errors.push(`${filePath}: JSON parsing error - ${error.message}`);
    }
  }

  validateFlavorverseNodes(data) {
    if (!Array.isArray(data)) {
      this.errors.push('flavorverse_nodes.json: Root should be an array');
      return;
    }

    const validWrappers = ['Maduro', 'Connecticut', 'Habano', 'Natural', 'Oscuro'];
    const wrapperStats = {};
    const flavorKeywords = ['chocolate', 'spice', 'cedar', 'coffee', 'vanilla', 'pepper', 'cream'];
    const flavorCoverage = {};
    
    data.forEach((item, index) => {
      if (!item.name || typeof item.name !== 'string') {
        this.errors.push(`flavorverse_nodes.json[${index}]: Missing or invalid 'name' field`);
      }
      
      if (!item.flavor || typeof item.flavor !== 'string') {
        this.errors.push(`flavorverse_nodes.json[${index}]: Missing or invalid 'flavor' field`);
      } else if (item.flavor === 'Undefined') {
        this.warnings.push(`flavorverse_nodes.json[${index}]: Flavor is 'Undefined'`);
      } else {
        // Analyze flavor coverage
        flavorKeywords.forEach(keyword => {
          if (item.flavor.toLowerCase().includes(keyword)) {
            flavorCoverage[keyword] = (flavorCoverage[keyword] || 0) + 1;
          }
        });
      }
      
      if (!item.wrapper || typeof item.wrapper !== 'string') {
        this.errors.push(`flavorverse_nodes.json[${index}]: Missing or invalid 'wrapper' field`);
      } else if (!validWrappers.includes(item.wrapper)) {
        if (item.wrapper === 'Unknown') {
          this.warnings.push(`flavorverse_nodes.json[${index}]: Wrapper is 'Unknown'`);
        } else {
          this.warnings.push(`flavorverse_nodes.json[${index}]: Unusual wrapper type '${item.wrapper}'`);
        }
      } else {
        wrapperStats[item.wrapper] = (wrapperStats[item.wrapper] || 0) + 1;
      }
      
      if (typeof item.color !== 'number') {
        this.errors.push(`flavorverse_nodes.json[${index}]: Missing or invalid 'color' field`);
      }
    });

    console.log(`  - Validated ${data.length} cigar entries`);
    console.log(`  - Wrapper distribution:`, wrapperStats);
    console.log(`  - Flavor keyword coverage:`, flavorCoverage);
    
    this.integrationReport.push({
      file: 'flavorverse_nodes.json',
      status: 'ready',
      entries: data.length,
      wrapperTypes: Object.keys(wrapperStats).length,
      integration: 'Main 3D visualization, pairing engine, educational content'
    });
  }

  validateCigarSpecs(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('cigar-specs.json: Root should be an object');
      return;
    }

    let manufacturerCount = 0;
    let specEngineReady = false;

    // Validate specEngine
    if (data.specEngine) {
      const required = ['moduleID', 'status', 'description'];
      let hasAllRequired = true;
      required.forEach(field => {
        if (!data.specEngine[field]) {
          this.warnings.push(`cigar-specs.json: specEngine missing '${field}' field`);
          hasAllRequired = false;
        }
      });
      specEngineReady = hasAllRequired;
    }

    // Validate manufacturers array
    if (data.trustedCigarManufacturers && Array.isArray(data.trustedCigarManufacturers)) {
      data.trustedCigarManufacturers.forEach((manufacturer, index) => {
        if (!manufacturer.name) {
          this.errors.push(`cigar-specs.json: manufacturer[${index}] missing name`);
        }
        if (!manufacturer.countryOfOrigin) {
          this.warnings.push(`cigar-specs.json: manufacturer[${index}] missing countryOfOrigin`);
        }
      });
      manufacturerCount = data.trustedCigarManufacturers.length;
      console.log(`  - Validated ${manufacturerCount} manufacturers`);
    }

    this.integrationReport.push({
      file: 'cigar-specs.json',
      status: specEngineReady ? 'ready' : 'partial',
      manufacturers: manufacturerCount,
      specEngine: specEngineReady,
      integration: 'Advanced cigar database, manufacturer verification, spec lookup'
    });
  }

  validatePairings(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('pairings.json: Root should be an object');
      return;
    }

    let lessonCount = 0;
    let quizCount = 0;
    let pairingEngineReady = false;

    if (data.pairingEngineV3) {
      pairingEngineReady = true;
      
      // Validate CEU lessons
      if (data.pairingEngineV3.ceuLessons && Array.isArray(data.pairingEngineV3.ceuLessons)) {
        data.pairingEngineV3.ceuLessons.forEach((lesson, index) => {
          if (!lesson.lessonTitle) {
            this.errors.push(`pairings.json: lesson[${index}] missing title`);
          }
          if (!lesson.learningObjective) {
            this.warnings.push(`pairings.json: lesson[${index}] missing learning objective`);
          }
          if (lesson.quizQuestions && Array.isArray(lesson.quizQuestions)) {
            quizCount += lesson.quizQuestions.length;
          }
        });
        lessonCount = data.pairingEngineV3.ceuLessons.length;
      }
    }

    console.log(`  - Validated ${lessonCount} pairing lessons with ${quizCount} quiz questions`);
    
    this.integrationReport.push({
      file: 'pairings.json',
      status: pairingEngineReady ? 'ready' : 'needs_work',
      lessons: lessonCount,
      quizzes: quizCount,
      integration: 'Pairing recommendations, educational content, quiz system'
    });
  }

  validateEducation(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('education.json: Root should be an object');
      return;
    }

    let trackCount = 0;
    let microcredentialCount = 0;
    let educationReady = false;

    if (data.educationTracks) {
      educationReady = true;
      
      if (data.educationTracks.tracks && Array.isArray(data.educationTracks.tracks)) {
        trackCount = data.educationTracks.tracks.length;
      }
      
      if (data.educationTracks.microcredentials && Array.isArray(data.educationTracks.microcredentials)) {
        microcredentialCount = data.educationTracks.microcredentials.length;
      }
    }

    console.log(`  - Education tracks: ${trackCount}, Microcredentials: ${microcredentialCount}`);
    
    this.integrationReport.push({
      file: 'education.json',
      status: educationReady ? 'ready' : 'needs_work',
      tracks: trackCount,
      microcredentials: microcredentialCount,
      integration: 'CEU system, certification paths, learning modules'
    });
  }

  validateFeatures(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('features.json: Root should be an object');
      return;
    }

    let implementedCount = 0;
    let totalFeatures = 0;

    if (data.features) {
      Object.keys(data.features).forEach(featureKey => {
        if (typeof data.features[featureKey] === 'object') {
          totalFeatures++;
          if (data.features[featureKey].status === 'Implemented') {
            implementedCount++;
            this.featureMap.set(featureKey, data.features[featureKey]);
          }
        }
      });
    }

    console.log(`  - Features: ${implementedCount}/${totalFeatures} implemented`);
    
    this.integrationReport.push({
      file: 'features.json',
      status: implementedCount > 0 ? 'ready' : 'needs_work',
      implemented: implementedCount,
      total: totalFeatures,
      integration: 'Feature flags, UI components, functionality switches'
    });
  }

  validateInterface(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('interface.json: Root should be an object');
      return;
    }

    let voiceCommandsCount = 0;
    let uiComponentsCount = 0;

    if (data.voiceCommandMatrix && data.voiceCommandMatrix.triggers) {
      voiceCommandsCount = Object.keys(data.voiceCommandMatrix.triggers).length;
    }

    if (data.uiUx) {
      uiComponentsCount = Object.keys(data.uiUx).length;
    }

    console.log(`  - Voice commands: ${voiceCommandsCount}, UI components: ${uiComponentsCount}`);
    
    this.integrationReport.push({
      file: 'interface.json',
      status: voiceCommandsCount > 0 ? 'ready' : 'partial',
      voiceCommands: voiceCommandsCount,
      uiComponents: uiComponentsCount,
      integration: 'Voice interface, UI/UX configuration, interaction patterns'
    });
  }

  validateMeta(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('meta.json: Root should be an object');
      return;
    }

    let promptCount = 0;
    let auditReady = false;

    if (data.metaPrompts) {
      promptCount = Object.keys(data.metaPrompts).length;
      auditReady = !!data.metaPrompts.expertAuditPrompt;
    }

    console.log(`  - Meta prompts: ${promptCount}, Audit system: ${auditReady ? 'ready' : 'not ready'}`);
    
    this.integrationReport.push({
      file: 'meta.json',
      status: auditReady ? 'ready' : 'partial',
      prompts: promptCount,
      auditSystem: auditReady,
      integration: 'AI prompts, audit system, quality control'
    });
  }

  validateEmotional(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('emotional.json: Root should be an object');
      return;
    }

    let ritualFlowsCount = 0;
    let emotionalTriggersCount = 0;

    if (data.ritualFlows) {
      ritualFlowsCount = Object.keys(data.ritualFlows).length;
    }

    if (data.emotionalMemorySystem && data.emotionalMemorySystem.emotionalFlavorTriggers) {
      emotionalTriggersCount = data.emotionalMemorySystem.emotionalFlavorTriggers.length;
    }

    console.log(`  - Ritual flows: ${ritualFlowsCount}, Emotional triggers: ${emotionalTriggersCount}`);
    
    this.integrationReport.push({
      file: 'emotional.json',
      status: ritualFlowsCount > 0 ? 'ready' : 'needs_work',
      ritualFlows: ritualFlowsCount,
      emotionalTriggers: emotionalTriggersCount,
      integration: 'Ritual guidance, emotional context, memory system'
    });
  }

  validateLounge(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('lounge.json: Root should be an object');
      return;
    }

    let loungeToolsReady = false;
    let conciergeReady = false;

    if (data.loungeIntegrationTools && data.loungeIntegrationTools.status === 'active') {
      loungeToolsReady = true;
    }

    if (data.conciergeMode && data.conciergeMode.status === 'active') {
      conciergeReady = true;
    }

    console.log(`  - Lounge tools: ${loungeToolsReady ? 'active' : 'inactive'}, Concierge: ${conciergeReady ? 'active' : 'inactive'}`);
    
    this.integrationReport.push({
      file: 'lounge.json',
      status: loungeToolsReady && conciergeReady ? 'ready' : 'partial',
      loungeTools: loungeToolsReady,
      concierge: conciergeReady,
      integration: 'Lounge experience, concierge services, premium features'
    });
  }

  validateFlavorAtlas(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('flavor-atlas.json: Root should be an object');
      return;
    }

    console.log('  - Flavor atlas structure validated');
    
    this.integrationReport.push({
      file: 'flavor-atlas.json',
      status: 'ready',
      integration: 'Flavor mapping, taste profiles, sensory data'
    });
  }

  validateGenericJSON(data) {
    // Basic JSON structure validation
    if (data === null || data === undefined) {
      this.warnings.push('File contains null or undefined data');
    }
  }

  generateIntegrationReport() {
    console.log('\n📊 Integration Status Report:');
    console.log('=' .repeat(60));
    
    this.integrationReport.forEach(report => {
      const statusIcon = report.status === 'ready' ? '✅' : report.status === 'partial' ? '⚠️' : '❌';
      console.log(`${statusIcon} ${report.file}`);
      console.log(`   Status: ${report.status}`);
      console.log(`   Integration: ${report.integration}`);
      if (report.entries) {console.log(`   Entries: ${report.entries}`);}
      if (report.lessons) {console.log(`   Lessons: ${report.lessons}`);}
      if (report.implemented) {console.log(`   Features: ${report.implemented}/${report.total}`);}
      console.log('');
    });

    // Integration readiness summary
    const readyCount = this.integrationReport.filter(r => r.status === 'ready').length;
    const totalCount = this.integrationReport.length;
    const readiness = Math.round((readyCount / totalCount) * 100);
    
    console.log(`📈 Overall Integration Readiness: ${readiness}% (${readyCount}/${totalCount} files ready)`);
    
    if (readiness >= 80) {
      console.log('🎉 System is ready for full integration!');
    } else if (readiness >= 60) {
      console.log('⚡ System is mostly ready - minor adjustments needed');
    } else {
      console.log('🔧 System needs significant integration work');
    }
  }

  validateSecurity() {
    console.log('\n🔒 Security Validation...');
    
    // Check for potential XSS patterns in JSON data
    const checkXSS = (obj, path = '') => {
      if (typeof obj === 'string') {
        const xssPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /<iframe/i,
          /eval\s*\(/i
        ];
        
        xssPatterns.forEach(pattern => {
          if (pattern.test(obj)) {
            this.warnings.push(`Potential XSS pattern found at ${path}: ${obj.substring(0, 50)}...`);
          }
        });
      } else if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
          checkXSS(obj[key], `${path}.${key}`);
        });
      }
    };

    const jsonFiles = [
      'flavorverse_nodes.json',
      'cigar-specs.json',
      'pairings.json',
      'education.json',
      'features.json',
      'interface.json',
      'meta.json',
      'emotional.json',
      'lounge.json',
      'flavor-atlas.json'
    ];

    jsonFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          const data = JSON.parse(fs.readFileSync(file, 'utf8'));
          checkXSS(data, file);
        } catch (_error) {
          // Already handled in validateFile
        }
      }
    });
  }

  validatePerformance() {
    console.log('\n⚡ Performance Validation...');
    
    const checkFileSize = (filePath, maxSize) => {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        
        if (stats.size > maxSize) {
          this.warnings.push(`${filePath} is ${sizeKB}KB (recommended: <${Math.round(maxSize/1024)}KB)`);
        } else {
          console.log(`  ✓ ${filePath}: ${sizeKB}KB`);
        }
      }
    };

    // Check file sizes
    checkFileSize('logo.png', 200 * 1024); // 200KB limit
    checkFileSize('cigar-specs.json', 500 * 1024); // 500KB limit
    checkFileSize('flavorverse_nodes.json', 100 * 1024); // 100KB limit
    
    // Check for potential performance issues
    this.integrationReport.forEach(report => {
      if (report.entries && report.entries > 1000) {
        this.warnings.push(`${report.file} has ${report.entries} entries - consider pagination`);
      }
    });
  }

  generateOptimizationRecommendations() {
    console.log('\n🚀 Optimization Recommendations:');
    console.log('=' .repeat(60));
    
    const recommendations = [];
    
    // Check each integration report for optimization opportunities
    this.integrationReport.forEach(report => {
      if (report.status === 'needs_work') {
        recommendations.push(`📌 ${report.file}: Complete implementation for ${report.integration}`);
      }
      
      if (report.status === 'partial') {
        recommendations.push(`⚡ ${report.file}: Enhance integration for ${report.integration}`);
      }
      
      if (report.implemented && report.total && report.implemented < report.total) {
        const percentage = Math.round((report.implemented / report.total) * 100);
        recommendations.push(`📈 ${report.file}: Activate remaining features (${percentage}% complete)`);
      }
    });
    
    // General optimization recommendations
    recommendations.push('🔄 Add real-time data synchronization between JSON sources');
    recommendations.push('💾 Implement local storage for user preferences and session data');
    recommendations.push('🎯 Add advanced filtering and search across all data sources');
    recommendations.push('📱 Optimize mobile experience for all integrated features');
    recommendations.push('🧠 Enhance AI responses with cross-reference data from all JSON files');
    
    if (recommendations.length > 0) {
      recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    } else {
      console.log('🎉 No optimization recommendations - system is fully optimized!');
    }
  }

  run() {
    console.log('🔍 Starting Enhanced Data Validation & Integration Analysis...\n');

    const jsonFiles = [
      'flavorverse_nodes.json',
      'cigar-specs.json',
      'pairings.json',
      'education.json',
      'features.json',
      'interface.json',
      'meta.json',
      'lounge.json',
      'emotional.json',
      'flavor-atlas.json'
    ];

    jsonFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.validateFile(file);
      } else {
        this.warnings.push(`File not found: ${file}`);
      }
    });

    this.validateSecurity();
    this.validatePerformance();
    this.generateIntegrationReport();
    this.generateOptimizationRecommendations();

    // Summary
    console.log('\n📊 Validation Summary:');
    console.log(`  Errors: ${this.errors.length}`);
    console.log(`  Warnings: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ All validations passed - System ready for full integration!');
    }

    return this.errors.length === 0;
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new EnhancedDataValidator();
  const success = validator.run();
  process.exit(success ? 0 : 1);
}

module.exports = EnhancedDataValidator;