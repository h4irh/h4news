const { exec } = require('child_process');
const browserSync = require('browser-sync').create();
const nodemon = require('nodemon');

// First run the build
console.log('Initial build...');
exec('node scripts/build.js', (error) => {
  if (error) {
    console.error(`Error during build: ${error}`);
    return;
  }
  
  console.log('Starting development server...');
  
  // Start BrowserSync
  browserSync.init({
    server: './public',
    port: 3000,
    notify: false,
    open: true
  });
  
  // Start Nodemon to watch for file changes
  nodemon({
    script: 'scripts/build.js',
    ext: 'md html css js',
    watch: ['_content', 'src'],
    ignore: ['public']
  }).on('restart', () => {
    console.log('Files changed, rebuilding...');
    
    // Reload browser after build is done
    setTimeout(() => {
      browserSync.reload();
      console.log('Browser reloaded!');
    }, 1000);
  });
});
