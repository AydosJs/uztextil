#!/usr/bin/env node

import { spawn } from 'child_process';

async function startDevWithNgrok() {
  console.log('🚀 Starting development server...');
  
  // Start Vite dev server
  const viteProcess = spawn('bun', ['run', 'dev'], {
    stdio: ['inherit', 'pipe', 'inherit'],
    shell: true
  });

  // Wait a bit for Vite to start and capture port
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('🌐 Starting ngrok tunnel...');
  
  // Start ngrok tunnel using system command
  const ngrokProcess = spawn('ngrok', ['http', '5174'], {
    stdio: ['inherit', 'pipe', 'inherit'],
    shell: true
  });

  let ngrokUrl = '';
  
  // Parse ngrok output to get URL
  ngrokProcess.stdout.on('data', (data) => {
    const output = data.toString();
    // Look for https://xxxx.ngrok-free.app URL pattern
    const urlMatch = output.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok-free\.app/);
    if (urlMatch && !ngrokUrl) {
      ngrokUrl = urlMatch[0];
      console.log('\n🎉 Development server is ready!');
      console.log('📱 Ngrok URL:', ngrokUrl);
      console.log('🏠 Local URL: http://localhost:5174');
      console.log('\n💡 Press Ctrl+C to stop both services\n');
    }
  });

  // Handle cleanup on exit
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    
    if (ngrokProcess) {
      ngrokProcess.kill();
      console.log('✅ Ngrok tunnel closed');
    }
    
    if (viteProcess) {
      viteProcess.kill();
      console.log('✅ Development server stopped');
    }
    
    process.exit(0);
  });

  // Handle errors
  ngrokProcess.on('error', (error) => {
    console.error('❌ Failed to start ngrok:', error.message);
    console.log('💡 Make sure ngrok is installed globally: npm install -g ngrok');
    console.log('🏠 Local development still available at: http://localhost:5174');
  });
}

startDevWithNgrok().catch(console.error);