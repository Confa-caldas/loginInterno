#!/usr/bin/env node

/**
 * Build script for AWS deployment
 * This script ensures clean dependency installation and build
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting AWS deployment build...');

try {
  // Clean install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm ci --cache .npm --prefer-offline', { stdio: 'inherit' });
  
  // Build the application
  console.log('🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Build output is in the dist/ folder');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}