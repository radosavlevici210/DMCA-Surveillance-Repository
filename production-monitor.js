
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

// Production health monitoring
class ProductionMonitor {
  constructor() {
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
    this.lastHealthCheck = Date.now();
  }
  
  // System resource monitoring
  async getSystemStats() {
    return new Promise((resolve) => {
      exec('free -m && df -h && ps aux --sort=-%cpu | head -10', (error, stdout) => {
        resolve({
          timestamp: new Date().toISOString(),
          uptime: Date.now() - this.startTime,
          requests: this.requestCount,
          errors: this.errorCount,
          systemInfo: stdout || 'System info unavailable',
          diskSpace: this.getDiskSpace(),
          memoryUsage: process.memoryUsage()
        });
      });
    });
  }
  
  getDiskSpace() {
    try {
      const stats = fs.statSync('./');
      return {
        available: stats.size,
        used: stats.blocks * stats.blksize
      };
    } catch (error) {
      return { error: 'Unable to get disk stats' };
    }
  }
  
  // Real-time alert system
  checkAlerts() {
    const memUsage = process.memoryUsage();
    const alerts = [];
    
    if (memUsage.heapUsed > 100 * 1024 * 1024) { // 100MB
      alerts.push({
        type: 'MEMORY_HIGH',
        value: memUsage.heapUsed,
        threshold: 100 * 1024 * 1024
      });
    }
    
    if (this.errorCount > 10) {
      alerts.push({
        type: 'ERROR_RATE_HIGH',
        value: this.errorCount,
        threshold: 10
      });
    }
    
    return alerts;
  }
  
  incrementRequest() {
    this.requestCount++;
  }
  
  incrementError() {
    this.errorCount++;
  }
}

module.exports = ProductionMonitor;
