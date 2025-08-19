#!/usr/bin/env node

/**
 * Autonomous System Initialization for Thee Cigar Maestro
 *
 * Sets up the autonomous system for first-time use, including
 * configuration validation, environment setup, and initial state creation.
 *
 * @author Claude 4 Sonnet AI Agent
 * @version 1.0.0
 * @license MIT
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import yaml from 'js-yaml';

class AutonomousInitializer {
  constructor() {
    this.config = null;
    this.initLog = [];
  }

  async initialize() {
    console.log('🚀 Initializing Thee Cigar Maestro Autonomous System...');
    console.log('='.repeat(60));

    try {
      // 1. Validate environment
      await this.validateEnvironment();

      // 2. Load and validate configuration
      await this.loadConfiguration();

      // 3. Create initial state files
      await this.createInitialState();

      // 4. Set up logging system
      await this.setupLogging();

      // 5. Validate dependencies
      await this.validateDependencies();

      // 6. Create initial phase tracking
      await this.createPhaseTracking();

      console.log('\n✅ Autonomous system initialized successfully!');
      await this.displayNextSteps();

      return true;
    } catch (error) {
      console.error('\n❌ Initialization failed:', error.message);
      await this.displayTroubleshooting();
      return false;
    }
  }

  async validateEnvironment() {
    console.log('\n🔍 Validating environment...');

    // Check Node.js version
    const nodeVersion = process.version;
    const requiredVersion = '18.0.0';

    if (this.compareVersions(nodeVersion, requiredVersion) < 0) {
      throw new Error(`Node.js ${requiredVersion} or higher required. Current: ${nodeVersion}`);
    }
    console.log(`✅ Node.js version: ${nodeVersion}`);

    // Check if we're in a git repository
    try {
      execSync('git status', { stdio: 'pipe' });
      console.log('✅ Git repository found');
    } catch (error) {
      throw new Error('Not in a git repository. Please initialize git first.');
    }

    // Check for package.json
    try {
      await fs.access('package.json');
      console.log('✅ package.json found');
    } catch (error) {
      throw new Error('package.json not found. Please run this from the project root.');
    }
  }

  async loadConfiguration() {
    console.log('\n📋 Loading configuration...');

    try {
      const configPath = path.join(process.cwd(), 'autonomy-config.yaml');
      const configContent = await fs.readFile(configPath, 'utf8');
      this.config = yaml.load(configContent);
      console.log('✅ Configuration loaded successfully');
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }

    // Validate configuration structure
    await this.validateConfiguration();
  }

  async validateConfiguration() {
    console.log('🔍 Validating configuration...');

    const requiredSections = ['autonomy', 'repo', 'deployment', 'phases', 'core_directives'];

    for (const section of requiredSections) {
      if (!this.config[section]) {
        throw new Error(`Missing required configuration section: ${section}`);
      }
    }

    // Validate phases
    if (!this.config.phases || this.config.phases.length === 0) {
      throw new Error('No phases defined in configuration');
    }

    console.log(`✅ Configuration validated (${this.config.phases.length} phases found)`);
  }

  async createInitialState() {
    console.log('\n📁 Creating initial state files...');

    const stateFiles = [
      {
        name: 'PHASE_TRACKING.json',
        content: {
          currentPhase: 'luxury-phaseI',
          phaseStartDate: new Date().toISOString(),
          evolutionLog: [],
          lastEvolutionCheck: new Date().toISOString(),
        },
      },
      {
        name: 'ORCHESTRATION_TRACKING.json',
        content: {
          currentPhase: 'luxury-phaseI',
          phaseStartDate: new Date().toISOString(),
          orchestrationLog: [],
          lastOrchestrationCheck: new Date().toISOString(),
          totalCycles: 0,
          successfulCycles: 0,
          failedCycles: 0,
        },
      },
      {
        name: 'DEPLOYMENT_LOG.json',
        content: [],
      },
      {
        name: 'analytics-data.json',
        content: {
          userBehavior: {},
          performanceMetrics: {},
          featureEngagement: {},
          conversionRates: {},
          lastUpdated: new Date().toISOString(),
        },
      },
    ];

    for (const file of stateFiles) {
      try {
        await fs.writeFile(file.name, JSON.stringify(file.content, null, 2));
        console.log(`✅ Created ${file.name}`);
      } catch (error) {
        throw new Error(`Failed to create ${file.name}: ${error.message}`);
      }
    }
  }

  async setupLogging() {
    console.log('\n📝 Setting up logging system...');

    const logFiles = [
      'ORCHESTRATION_LOG.md',
      'EVOLUTION_LOG.md',
      'DEPLOYMENT_LOG.md',
      'GROWTH_LOG.md',
      'GLOBAL_LOG.md',
      'RITUAL_LOG.md',
    ];

    for (const logFile of logFiles) {
      try {
        const header = `# ${logFile.replace('.md', '')} Log\n\n**Initialized:** ${new Date().toISOString()}\n\n---\n\n`;
        await fs.writeFile(logFile, header);
        console.log(`✅ Created ${logFile}`);
      } catch (error) {
        console.warn(`⚠️ Could not create ${logFile}: ${error.message}`);
      }
    }
  }

  async validateDependencies() {
    console.log('\n🔧 Validating dependencies...');

    // Check if required npm packages are installed
    const requiredPackages = ['js-yaml', 'lighthouse', 'pa11y'];

    try {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      const installedDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      for (const pkg of requiredPackages) {
        if (installedDeps[pkg]) {
          console.log(`✅ ${pkg} found`);
        } else {
          console.warn(`⚠️ ${pkg} not found - run: npm install ${pkg}`);
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not validate dependencies:', error.message);
    }

    // Check for Vercel CLI
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      console.log('✅ Vercel CLI found');
    } catch (error) {
      console.warn('⚠️ Vercel CLI not found - install with: npm i -g vercel');
    }
  }

  async createPhaseTracking() {
    console.log('\n📊 Creating phase tracking...');

    const initialPhase = this.config.phases[0];

    const phaseData = {
      currentPhase: initialPhase.id,
      phaseStartDate: new Date().toISOString(),
      description: initialPhase.description,
      objectives: await this.generatePhaseObjectives(initialPhase),
      status: 'active',
    };

    try {
      await fs.writeFile('CURRENT_PHASE.json', JSON.stringify(phaseData, null, 2));
      console.log(`✅ Phase tracking created for ${initialPhase.id}`);
    } catch (error) {
      throw new Error(`Failed to create phase tracking: ${error.message}`);
    }
  }

  async generatePhaseObjectives(phase) {
    const objectives = {
      'luxury-phaseI': [
        { name: 'luxury_aesthetic', weight: 0.3, status: 0.95 },
        { name: 'ai_features', weight: 0.3, status: 0.88 },
        { name: 'responsive_design', weight: 0.2, status: 0.92 },
        { name: 'performance_targets', weight: 0.2, status: 0.85 },
      ],
      'evolution-phaseII': [
        { name: 'analytics_optimization', weight: 0.4, status: 0.75 },
        { name: 'continuous_improvement', weight: 0.3, status: 0.8 },
        { name: 'ai_model_improvement', weight: 0.3, status: 0.7 },
      ],
      'growth-phaseIII': [
        { name: 'ecommerce_integration', weight: 0.4, status: 0.6 },
        { name: 'marketing_funnels', weight: 0.3, status: 0.65 },
        { name: 'monetization', weight: 0.3, status: 0.55 },
      ],
      'global-phaseIV': [
        { name: 'multi_language', weight: 0.3, status: 0.3 },
        { name: 'virtual_lounges', weight: 0.3, status: 0.25 },
        { name: 'blockchain_collectibles', weight: 0.4, status: 0.2 },
      ],
      'ritual-phaseV': [
        { name: 'ritual_intelligence', weight: 0.5, status: 0.15 },
        { name: '3d_flavorverse', weight: 0.5, status: 0.1 },
      ],
    };

    return objectives[phase.id] || [];
  }

  async displayNextSteps() {
    console.log('\n🎯 NEXT STEPS');
    console.log('='.repeat(40));

    console.log('\n1. 🚀 Start the autonomous system:');
    console.log('   npm run autonomous:start');

    console.log('\n2. 📊 Check system status:');
    console.log('   npm run autonomous:status');

    console.log('\n3. 🔧 Run a single evolution cycle:');
    console.log('   npm run autonomous:evolution');

    console.log('\n4. 🚀 Run a single deployment:');
    console.log('   npm run autonomous:deploy');

    console.log('\n5. 📖 Read the documentation:');
    console.log('   cat AUTONOMOUS_SYSTEM_README.md');

    console.log('\n6. 🛑 Stop the system (when needed):');
    console.log('   npm run autonomous:stop');

    console.log('\n📋 Current Phase: ' + this.config.phases[0].id);
    console.log('📝 Description: ' + this.config.phases[0].description);

    console.log('\n🎉 The autonomous system is ready to evolve Thee Cigar Maestro!');
  }

  async displayTroubleshooting() {
    console.log('\n🔧 TROUBLESHOOTING');
    console.log('='.repeat(40));

    console.log('\n1. Install missing dependencies:');
    console.log('   npm install js-yaml lighthouse pa11y');

    console.log('\n2. Install Vercel CLI:');
    console.log('   npm install -g vercel');

    console.log('\n3. Initialize git repository:');
    console.log('   git init');
    console.log('   git add .');
    console.log('   git commit -m "Initial commit"');

    console.log('\n4. Check Node.js version:');
    console.log('   node --version');
    console.log('   (Requires 18.0.0 or higher)');

    console.log('\n5. Verify configuration file:');
    console.log('   cat autonomy-config.yaml');

    console.log('\n📞 For additional help, contact: info@theecigarmaestro.com');
  }

  compareVersions(version1, version2) {
    const v1 = version1.replace('v', '').split('.').map(Number);
    const v2 = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0;
      const num2 = v2[i] || 0;

      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }

    return 0;
  }

  async run() {
    console.log('🎼 Thee Cigar Maestro - Autonomous System Initialization');

    const success = await this.initialize();

    if (success) {
      console.log('\n🎉 Initialization completed successfully!');
      console.log('The autonomous system is ready to transform Thee Cigar Maestro.');
    } else {
      console.log('\n❌ Initialization failed. Please check the errors above.');
      process.exit(1);
    }
  }
}

// Run the initializer if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const initializer = new AutonomousInitializer();
  initializer.run().catch(console.error);
}

export default AutonomousInitializer;
