#!/usr/bin/env node

/**
 * Autonomous Stop Controller for Thee Cigar Maestro
 *
 * Safely stops the autonomous system and saves the current state
 * for graceful shutdown and restart capabilities.
 *
 * @author Claude 4 Sonnet AI Agent
 * @version 1.0.0
 * @license MIT
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

class AutonomousStopController {
  constructor() {
    this.stopLog = [];
  }

  async initialize() {
    console.log('🛑 Initializing Autonomous Stop Controller...');
    return true;
  }

  async stopAutonomousSystem() {
    console.log('🛑 Stopping autonomous system...');

    try {
      // 1. Save current state
      await this.saveCurrentState();

      // 2. Stop running processes
      await this.stopRunningProcesses();

      // 3. Create stop marker
      await this.createStopMarker();

      // 4. Log stop event
      await this.logStopEvent();

      console.log('✅ Autonomous system stopped successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to stop autonomous system:', error);
      return false;
    }
  }

  async saveCurrentState() {
    console.log('💾 Saving current state...');

    const stateData = {
      timestamp: new Date().toISOString(),
      stopReason: 'manual_stop',
      systemState: await this.captureSystemState(),
    };

    const statePath = path.join(process.cwd(), 'AUTONOMOUS_STATE.json');
    await fs.writeFile(statePath, JSON.stringify(stateData, null, 2));

    console.log('✅ Current state saved');
  }

  async captureSystemState() {
    const state = {};

    // Capture phase tracking
    try {
      const phaseTrackingPath = path.join(process.cwd(), 'PHASE_TRACKING.json');
      const phaseContent = await fs.readFile(phaseTrackingPath, 'utf8');
      state.phaseTracking = JSON.parse(phaseContent);
    } catch (error) {
      state.phaseTracking = null;
    }

    // Capture orchestration tracking
    try {
      const orchestrationPath = path.join(process.cwd(), 'ORCHESTRATION_TRACKING.json');
      const orchestrationContent = await fs.readFile(orchestrationPath, 'utf8');
      state.orchestrationTracking = JSON.parse(orchestrationContent);
    } catch (error) {
      state.orchestrationTracking = null;
    }

    // Capture deployment log
    try {
      const deploymentPath = path.join(process.cwd(), 'DEPLOYMENT_LOG.json');
      const deploymentContent = await fs.readFile(deploymentPath, 'utf8');
      state.deploymentLog = JSON.parse(deploymentContent);
    } catch (error) {
      state.deploymentLog = null;
    }

    // Capture analytics data
    try {
      const analyticsPath = path.join(process.cwd(), 'analytics-data.json');
      const analyticsContent = await fs.readFile(analyticsPath, 'utf8');
      state.analyticsData = JSON.parse(analyticsContent);
    } catch (error) {
      state.analyticsData = null;
    }

    return state;
  }

  async stopRunningProcesses() {
    console.log('🔄 Stopping running processes...');

    try {
      // Check for running Node.js processes related to autonomous system
      const processes = await this.findAutonomousProcesses();

      if (processes.length > 0) {
        console.log(`Found ${processes.length} autonomous processes to stop`);

        for (const process of processes) {
          try {
            execSync(`kill ${process.pid}`, { stdio: 'pipe' });
            console.log(`✅ Stopped process ${process.pid} (${process.command})`);
          } catch (error) {
            console.warn(`⚠️ Failed to stop process ${process.pid}: ${error.message}`);
          }
        }
      } else {
        console.log('✅ No autonomous processes found running');
      }
    } catch (error) {
      console.warn('⚠️ Could not check for running processes:', error.message);
    }
  }

  async findAutonomousProcesses() {
    try {
      // Find Node.js processes running autonomous scripts
      const psOutput = execSync('ps aux | grep node', { encoding: 'utf8' });
      const lines = psOutput.split('\n').filter(line => line.trim());

      const autonomousProcesses = [];

      for (const line of lines) {
        if (
          line.includes('autonomous-orchestrator') ||
          line.includes('autonomous-evolution-engine') ||
          line.includes('autonomous-deployment')
        ) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 2) {
            autonomousProcesses.push({
              pid: parts[1],
              command: parts.slice(10).join(' '),
            });
          }
        }
      }

      return autonomousProcesses;
    } catch (error) {
      return [];
    }
  }

  async createStopMarker() {
    console.log('📍 Creating stop marker...');

    const stopMarker = {
      timestamp: new Date().toISOString(),
      stopReason: 'manual_stop',
      restartInstructions: [
        'To restart the autonomous system, run: npm run autonomous:start',
        'To check status, run: npm run autonomous:status',
        'To run a single evolution cycle, run: npm run autonomous:evolution',
        'To run a single deployment, run: npm run autonomous:deploy',
      ],
    };

    const markerPath = path.join(process.cwd(), 'AUTONOMOUS_STOPPED.json');
    await fs.writeFile(markerPath, JSON.stringify(stopMarker, null, 2));

    console.log('✅ Stop marker created');
  }

  async logStopEvent() {
    console.log('📝 Logging stop event...');

    const stopEvent = {
      timestamp: new Date().toISOString(),
      event: 'autonomous_system_stopped',
      reason: 'manual_stop',
      systemState: await this.captureSystemState(),
    };

    this.stopLog.push(stopEvent);

    const logPath = path.join(process.cwd(), 'AUTONOMOUS_STOP_LOG.md');
    const logContent = `## Autonomous System Stopped\n\n**Date:** ${stopEvent.timestamp}\n**Reason:** ${stopEvent.reason}\n**System State:** ${JSON.stringify(stopEvent.systemState, null, 2)}\n\n---\n\n`;

    await fs.appendFile(logPath, logContent);

    console.log('✅ Stop event logged');
  }

  async displayStopSummary() {
    console.log('\n🛑 Autonomous System Stop Summary');
    console.log('='.repeat(50));

    const stopMarkerPath = path.join(process.cwd(), 'AUTONOMOUS_STOPPED.json');

    try {
      const stopMarkerContent = await fs.readFile(stopMarkerPath, 'utf8');
      const stopMarker = JSON.parse(stopMarkerContent);

      console.log(`Stop Time: ${new Date(stopMarker.timestamp).toLocaleString()}`);
      console.log(`Stop Reason: ${stopMarker.stopReason}`);

      console.log('\n📋 Restart Instructions:');
      stopMarker.restartInstructions.forEach((instruction, index) => {
        console.log(`${index + 1}. ${instruction}`);
      });
    } catch (error) {
      console.log('❌ Could not read stop marker');
    }

    console.log('\n📁 State Files:');
    const stateFiles = [
      'AUTONOMOUS_STATE.json',
      'AUTONOMOUS_STOPPED.json',
      'AUTONOMOUS_STOP_LOG.md',
    ];

    for (const file of stateFiles) {
      try {
        await fs.access(path.join(process.cwd(), file));
        console.log(`✅ ${file}`);
      } catch (error) {
        console.log(`❌ ${file} (not found)`);
      }
    }

    console.log('='.repeat(50));
  }

  async run() {
    console.log('🛑 Starting autonomous system stop sequence...');

    const initialized = await this.initialize();
    if (!initialized) {
      console.error('❌ Failed to initialize stop controller');
      process.exit(1);
    }

    const stopped = await this.stopAutonomousSystem();

    if (stopped) {
      await this.displayStopSummary();
      console.log('\n✅ Autonomous system stopped successfully');
    } else {
      console.error('\n❌ Failed to stop autonomous system');
      process.exit(1);
    }
  }
}

// Run the stop controller if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const stopController = new AutonomousStopController();
  stopController.run().catch(console.error);
}

export default AutonomousStopController;
