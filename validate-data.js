#!/usr/bin/env node

/**
 * Data Validation Script for Thee Cigar Maestro
 * Validates JSON files for proper structure and completeness
 */

const fs = require('fs');
const path = require('path');

class DataValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
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
    
    data.forEach((item, index) => {
      if (!item.name || typeof item.name !== 'string') {
        this.errors.push(`flavorverse_nodes.json[${index}]: Missing or invalid 'name' field`);
      }
      
      if (!item.flavor || typeof item.flavor !== 'string') {
        this.errors.push(`flavorverse_nodes.json[${index}]: Missing or invalid 'flavor' field`);
      } else if (item.flavor === 'Undefined') {
        this.warnings.push(`flavorverse_nodes.json[${index}]: Flavor is 'Undefined'`);
      }
      
      if (!item.wrapper || typeof item.wrapper !== 'string') {
        this.errors.push(`flavorverse_nodes.json[${index}]: Missing or invalid 'wrapper' field`);
      } else if (!validWrappers.includes(item.wrapper)) {
        if (item.wrapper === 'Unknown') {
          this.warnings.push(`flavorverse_nodes.json[${index}]: Wrapper is 'Unknown'`);
        } else {
          this.warnings.push(`flavorverse_nodes.json[${index}]: Unusual wrapper type '${item.wrapper}'`);
        }
      }
      
      if (typeof item.color !== 'number') {
        this.errors.push(`flavorverse_nodes.json[${index}]: Missing or invalid 'color' field`);
      }
    });

    console.log(`  - Validated ${data.length} cigar entries`);
  }

  validateCigarSpecs(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('cigar-specs.json: Root should be an object');
      return;
    }

    // Validate specEngine
    if (data.specEngine) {
      const required = ['moduleID', 'status', 'description'];
      required.forEach(field => {
        if (!data.specEngine[field]) {
          this.warnings.push(`cigar-specs.json: specEngine missing '${field}' field`);
        }
      });
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
      console.log(`  - Validated ${data.trustedCigarManufacturers.length} manufacturers`);
    }
  }

  validatePairings(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('pairings.json: Root should be an object');
      return;
    }

    if (data.pairingEngineV3) {
      // Validate CEU lessons
      if (data.pairingEngineV3.ceuLessons && Array.isArray(data.pairingEngineV3.ceuLessons)) {
        data.pairingEngineV3.ceuLessons.forEach((lesson, index) => {
          if (!lesson.lessonTitle) {
            this.errors.push(`pairings.json: lesson[${index}] missing title`);
          }
          if (!lesson.learningObjective) {
            this.warnings.push(`pairings.json: lesson[${index}] missing learning objective`);
          }
        });
      }
    }
  }

  validateEducation(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('education.json: Root should be an object');
      return;
    }
    // Add specific validation rules for education content
    console.log('  - Education content structure validated');
  }

  validateFeatures(data) {
    if (typeof data !== 'object' || data === null) {
      this.errors.push('features.json: Root should be an object');
      return;
    }
    // Add specific validation rules for features
    console.log('  - Features structure validated');
  }

  validateGenericJSON(data) {
    // Basic JSON structure validation
    if (data === null || data === undefined) {
      this.warnings.push('File contains null or undefined data');
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
      'features.json'
    ];

    jsonFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          const data = JSON.parse(fs.readFileSync(file, 'utf8'));
          checkXSS(data, file);
        } catch (error) {
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
  }

  run() {
    console.log('🔍 Starting Data Validation...\n');

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
      console.log('\n✅ All validations passed!');
    }

    return this.errors.length === 0;
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new DataValidator();
  const success = validator.run();
  process.exit(success ? 0 : 1);
}

module.exports = DataValidator;