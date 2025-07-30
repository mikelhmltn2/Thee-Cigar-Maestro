#!/usr/bin/env node

/**
 * Autonomous Status Checker for Thee Cigar Maestro
 * 
 * Provides real-time status information about the autonomous system
 * including current phase, evolution progress, and deployment status.
 * 
 * @author Claude 4 Sonnet AI Agent
 * @version 1.0.0
 * @license MIT
 */

import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

class AutonomousStatusChecker {
  constructor() {
    this.config = null;
    this.status = {};
  }

  async initialize() {
    try {
      await this.loadConfiguration();
      await this.loadStatusData();
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize status checker:', error);
      return false;
    }
  }

  async loadConfiguration() {
    try {
      const configPath = path.join(process.cwd(), 'autonomy-config.yaml');
      const configContent = await fs.readFile(configPath, 'utf8');
      this.config = yaml.load(configContent);
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  async loadStatusData() {
    const statusFiles = [
      'ORCHESTRATION_TRACKING.json',
      'PHASE_TRACKING.json',
      'DEPLOYMENT_LOG.json',
      'analytics-data.json'
    ];

    for (const file of statusFiles) {
      try {
        const filePath = path.join(process.cwd(), file);
        const content = await fs.readFile(filePath, 'utf8');
        this.status[file.replace('.json', '')] = JSON.parse(content);
      } catch (error) {
        this.status[file.replace('.json', '')] = null;
      }
    }
  }

  async displayStatus() {
    console.log('\n🎼 Thee Cigar Maestro - Autonomous System Status');
    console.log('=' .repeat(60));
    
    // Display current phase
    await this.displayPhaseStatus();
    
    // Display orchestration status
    await this.displayOrchestrationStatus();
    
    // Display deployment status
    await this.displayDeploymentStatus();
    
    // Display analytics status
    await this.displayAnalyticsStatus();
    
    // Display recommendations
    await this.displayRecommendations();
    
    console.log('=' .repeat(60));
  }

  async displayPhaseStatus() {
    console.log('\n📊 PHASE STATUS');
    console.log('-'.repeat(30));
    
    const phaseTracking = this.status.PHASE_TRACKING;
    if (phaseTracking) {
      console.log(`Current Phase: ${phaseTracking.currentPhase}`);
      console.log(`Phase Start: ${new Date(phaseTracking.phaseStartDate).toLocaleDateString()}`);
      console.log(`Last Check: ${new Date(phaseTracking.lastEvolutionCheck).toLocaleDateString()}`);
      
      // Find current phase config
      const currentPhaseConfig = this.config.phases.find(p => p.id === phaseTracking.currentPhase);
      if (currentPhaseConfig) {
        console.log(`Description: ${currentPhaseConfig.description}`);
      }
    } else {
      console.log('❌ No phase tracking data available');
    }
  }

  async displayOrchestrationStatus() {
    console.log('\n🎼 ORCHESTRATION STATUS');
    console.log('-'.repeat(30));
    
    const orchestrationTracking = this.status.ORCHESTRATION_TRACKING;
    if (orchestrationTracking) {
      console.log(`Total Cycles: ${orchestrationTracking.totalCycles || 0}`);
      console.log(`Successful Cycles: ${orchestrationTracking.successfulCycles || 0}`);
      console.log(`Failed Cycles: ${orchestrationTracking.failedCycles || 0}`);
      
      if (orchestrationTracking.orchestrationLog && orchestrationTracking.orchestrationLog.length > 0) {
        const lastCycle = orchestrationTracking.orchestrationLog[orchestrationTracking.orchestrationLog.length - 1];
        console.log(`Last Cycle: ${lastCycle.id}`);
        console.log(`Last Cycle Status: ${lastCycle.status}`);
        console.log(`Last Cycle Time: ${new Date(lastCycle.startTime).toLocaleDateString()}`);
      }
    } else {
      console.log('❌ No orchestration tracking data available');
    }
  }

  async displayDeploymentStatus() {
    console.log('\n🚀 DEPLOYMENT STATUS');
    console.log('-'.repeat(30));
    
    const deploymentLog = this.status.DEPLOYMENT_LOG;
    if (deploymentLog && deploymentLog.length > 0) {
      const lastDeployment = deploymentLog[deploymentLog.length - 1];
      console.log(`Last Deployment: ${lastDeployment.id}`);
      console.log(`Status: ${lastDeployment.status}`);
      console.log(`Type: ${lastDeployment.type}`);
      console.log(`Start Time: ${new Date(lastDeployment.startTime).toLocaleDateString()}`);
      
      if (lastDeployment.endTime) {
        console.log(`End Time: ${new Date(lastDeployment.endTime).toLocaleDateString()}`);
        const duration = this.calculateDuration(lastDeployment.startTime, lastDeployment.endTime);
        console.log(`Duration: ${duration}`);
      }
      
      if (lastDeployment.error) {
        console.log(`❌ Error: ${lastDeployment.error}`);
      }
    } else {
      console.log('❌ No deployment data available');
    }
  }

  async displayAnalyticsStatus() {
    console.log('\n📈 ANALYTICS STATUS');
    console.log('-'.repeat(30));
    
    const analyticsData = this.status.analytics_data;
    if (analyticsData) {
      console.log(`Last Updated: ${new Date(analyticsData.lastUpdated).toLocaleDateString()}`);
      
      if (analyticsData.seoMetrics) {
        console.log(`Organic Traffic: ${analyticsData.seoMetrics.organicTraffic || 'N/A'}`);
        console.log(`Page Speed: ${analyticsData.seoMetrics.pageSpeed || 'N/A'}s`);
        console.log(`Mobile Usability: ${Math.round((analyticsData.seoMetrics.mobileUsability || 0) * 100)}%`);
      }
      
      if (analyticsData.accessibility) {
        console.log(`Accessibility Score: ${Math.round((analyticsData.accessibility.score || 0) * 100)}%`);
      }
    } else {
      console.log('❌ No analytics data available');
    }
  }

  async displayRecommendations() {
    console.log('\n💡 RECOMMENDATIONS');
    console.log('-'.repeat(30));
    
    const recommendations = await this.generateRecommendations();
    
    if (recommendations.length === 0) {
      console.log('✅ No immediate recommendations');
    } else {
      recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.type.toUpperCase()}: ${rec.description}`);
        console.log(`   Priority: ${rec.priority}`);
        console.log(`   Action: ${rec.action}\n`);
      });
    }
  }

  async generateRecommendations() {
    const recommendations = [];
    
    // Check phase completion
    const phaseTracking = this.status.PHASE_TRACKING;
    if (phaseTracking) {
      const currentPhase = phaseTracking.currentPhase;
      const currentPhaseConfig = this.config.phases.find(p => p.id === currentPhase);
      
      if (currentPhaseConfig) {
        recommendations.push({
          type: 'phase',
          priority: 'medium',
          description: `Continue working on ${currentPhaseConfig.description}`,
          action: 'Focus on remaining phase objectives'
        });
      }
    }
    
    // Check deployment frequency
    const deploymentLog = this.status.DEPLOYMENT_LOG;
    if (deploymentLog && deploymentLog.length > 0) {
      const lastDeployment = deploymentLog[deploymentLog.length - 1];
      const lastDeploymentTime = new Date(lastDeployment.startTime);
      const daysSinceLastDeployment = (new Date() - lastDeploymentTime) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastDeployment > 7) {
        recommendations.push({
          type: 'deployment',
          priority: 'medium',
          description: 'Consider running a deployment cycle',
          action: 'Run: npm run autonomous:deploy'
        });
      }
    }
    
    // Check for failed cycles
    const orchestrationTracking = this.status.ORCHESTRATION_TRACKING;
    if (orchestrationTracking && orchestrationTracking.failedCycles > 0) {
      recommendations.push({
        type: 'system',
        priority: 'high',
        description: 'Investigate failed orchestration cycles',
        action: 'Check logs and fix underlying issues'
      });
    }
    
    return recommendations;
  }

  calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = end - start;
    
    const minutes = Math.floor(duration / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  }

  async run() {
    console.log('🔍 Checking autonomous system status...');
    
    const initialized = await this.initialize();
    if (!initialized) {
      console.error('❌ Failed to initialize status checker');
      process.exit(1);
    }
    
    await this.displayStatus();
  }
}

// Run the status checker if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const statusChecker = new AutonomousStatusChecker();
  statusChecker.run().catch(console.error);
}

export default AutonomousStatusChecker;