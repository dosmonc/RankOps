/**
 * RankOps Component Migration Script
 * 
 * WHAT THIS DOES:
 * 1. Creates backups of all HTML files in _backups folder
 * 2. Removes hardcoded nav (<!-- NAVIGATION --> through </div> after mobile menu)
 * 3. Removes hardcoded footer (<!-- FOOTER --> through </footer>)
 * 4. Inserts placeholder divs
 * 5. Adds components.js script tag
 * 
 * USAGE:
 * 1. Save this file as migrate-components.js in your RankOps folder
 * 2. Open terminal/command prompt in RankOps folder
 * 3. Run: node migrate-components.js --dry-run    (preview changes)
 * 4. Run: node migrate-components.js              (apply changes)
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  rootDir: '.', // Current directory
  backupDir: '_backups',
  dryRun: process.argv.includes('--dry-run'),
  skipFolders: ['node_modules', '_backups', 'components', '.git'],
  skipFiles: ['migrate-components.js']
};

// ============================================
// PATTERNS - Tuned for your exact HTML structure
// ============================================

// Matches from <!-- NAVIGATION --> through the closing </div> of mobile-menu
const NAV_PATTERN = /[ \t]*<!-- NAVIGATION -->[\s\S]*?<!-- MOBILE MENU -->[\s\S]*?<\/div>\s*(?=<main|<section|<div class="page|<div id=")/i;

// Alternative pattern - more specific to your structure
const NAV_PATTERN_ALT = /[ \t]*<!-- NAVIGATION -->\s*<nav id="navbar">[\s\S]*?<\/nav>\s*<!-- MOBILE MENU -->\s*<div class="mobile-menu"[^>]*>[\s\S]*?<\/div>\s*/i;

// Matches <!-- FOOTER --> through </footer>
const FOOTER_PATTERN = /[ \t]*<!-- FOOTER -->\s*<footer>[\s\S]*?<\/footer>/i;

// Pattern to find where to insert the script (before script.js or before </body>)
const SCRIPT_JS_PATTERN = /(<script[^>]*src=["'][^"']*script\.js["'][^>]*><\/script>)/i;
const BODY_END_PATTERN = /(\s*<\/body>)/i;

// ============================================
// REPLACEMENT CONTENT
// ============================================

const NAV_PLACEHOLDER = `    <!-- NAV & MOBILE MENU - Loaded by components.js -->
    <div id="nav-placeholder"></div>

    `;

const FOOTER_PLACEHOLDER = `    <!-- FOOTER - Loaded by components.js -->
    <div id="footer-placeholder"></div>`;

// ============================================
// HELPER FUNCTIONS
// ============================================

function getComponentsScriptTag(isInBlogFolder) {
  const prefix = isInBlogFolder ? '../' : '';
  return `<script src="${prefix}components/components.js"></script>\n    `;
}

function getAllHtmlFiles(dir, fileList = [], relativePath = '') {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relPath = path.join(relativePath, item);
    
    // Skip configured folders
    if (CONFIG.skipFolders.includes(item)) continue;
    if (CONFIG.skipFiles.includes(item)) continue;
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllHtmlFiles(fullPath, fileList, relPath);
    } else if (item.endsWith('.html')) {
      fileList.push({
        fullPath,
        relativePath: relPath,
        isInBlogFolder: relPath.startsWith('blog' + path.sep)
      });
    }
  }
  
  return fileList;
}

function createBackup(file) {
  const backupPath = path.join(CONFIG.backupDir, file.relativePath);
  const backupFolder = path.dirname(backupPath);
  
  if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder, { recursive: true });
  }
  
  fs.copyFileSync(file.fullPath, backupPath);
}

function processFile(file) {
  let content = fs.readFileSync(file.fullPath, 'utf8');
  let modified = false;
  const changes = [];

  // Skip if already migrated
  if (content.includes('id="nav-placeholder"') && content.includes('id="footer-placeholder"')) {
    return { skipped: true, reason: 'Already migrated' };
  }

  // Store original for comparison
  const original = content;

  // Replace navigation section
  if (NAV_PATTERN_ALT.test(content)) {
    content = content.replace(NAV_PATTERN_ALT, NAV_PLACEHOLDER);
    changes.push('Replaced nav with placeholder');
    modified = true;
  } else if (NAV_PATTERN.test(content)) {
    content = content.replace(NAV_PATTERN, NAV_PLACEHOLDER);
    changes.push('Replaced nav with placeholder (alt pattern)');
    modified = true;
  }

  // Replace footer section
  if (FOOTER_PATTERN.test(content)) {
    content = content.replace(FOOTER_PATTERN, FOOTER_PLACEHOLDER);
    changes.push('Replaced footer with placeholder');
    modified = true;
  }

  // Add components.js script if we made changes and it's not already there
  if (modified && !content.includes('components/components.js')) {
    const scriptTag = getComponentsScriptTag(file.isInBlogFolder);
    
    if (SCRIPT_JS_PATTERN.test(content)) {
      // Insert before script.js
      content = content.replace(SCRIPT_JS_PATTERN, scriptTag + '\$1');
      changes.push('Added components.js before script.js');
    } else if (BODY_END_PATTERN.test(content)) {
      // Insert before </body>
      content = content.replace(BODY_END_PATTERN, '    ' + scriptTag + '\$1');
      changes.push('Added components.js before </body>');
    }
  }

  // Also fix the script.js path for blog folder if needed
  if (file.isInBlogFolder && modified) {
    // Check if script.js path needs fixing (should be ../script.js for blog pages)
    if (content.includes('src="script.js"') && !content.includes('src="../script.js"')) {
      content = content.replace(/src="script\.js"/g, 'src="../script.js"');
      changes.push('Fixed script.js path for blog subfolder');
    }
    // Same for style.css
    if (content.includes('href="style.css"') && !content.includes('href="../style.css"')) {
      content = content.replace(/href="style\.css"/g, 'href="../style.css"');
      changes.push('Fixed style.css path for blog subfolder');
    }
  }

  return {
    modified,
    changes,
    newContent: content
  };
}

// ============================================
// MAIN EXECUTION
// ============================================

function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     RankOps Component Migration Script                 ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  if (CONFIG.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  // Create backup directory
  if (!CONFIG.dryRun && !fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    console.log(`📁 Created backup directory: ${CONFIG.backupDir}\n`);
  }

  // Find all HTML files
  const htmlFiles = getAllHtmlFiles(CONFIG.rootDir);
  console.log(`📄 Found ${htmlFiles.length} HTML files to process\n`);
  console.log('─'.repeat(60) + '\n');

  // Stats
  const stats = {
    total: htmlFiles.length,
    modified: 0,
    skipped: 0,
    errors: 0
  };

  // Process each file
  for (const file of htmlFiles) {
    console.log(`Processing: ${file.relativePath}`);
    
    try {
      const result = processFile(file);
      
      if (result.skipped) {
        console.log(`  ⏭️  Skipped: ${result.reason}`);
        stats.skipped++;
      } else if (result.modified) {
        // Create backup
        if (!CONFIG.dryRun) {
          createBackup(file);
          fs.writeFileSync(file.fullPath, result.newContent, 'utf8');
        }
        
        result.changes.forEach(change => {
          console.log(`  ✅ ${change}`);
        });
        stats.modified++;
      } else {
        console.log(`  ⚠️  No nav/footer found to replace`);
        stats.skipped++;
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      stats.errors++;
    }
    
    console.log('');
  }

  // Summary
  console.log('─'.repeat(60));
  console.log('\n📊 MIGRATION SUMMARY\n');
  console.log(`   Total files scanned:    ${stats.total}`);
  console.log(`   Files modified:         ${stats.modified}`);
  console.log(`   Files skipped:          ${stats.skipped}`);
  console.log(`   Errors:                 ${stats.errors}`);

  if (CONFIG.dryRun) {
    console.log('\n⚠️  DRY RUN - No files were actually modified.');
    console.log('   Run without --dry-run to apply changes:\n');
    console.log('   node migrate-components.js\n');
  } else {
    console.log(`\n📦 Backups saved to: ${path.resolve(CONFIG.backupDir)}`);
    console.log('\n✨ Migration complete!\n');
    
    if (stats.modified > 0) {
      console.log('📋 NEXT STEPS:');
      console.log('   1. Verify components/nav.html exists');
      console.log('   2. Verify components/footer.html exists');
      console.log('   3. Verify components/components.js exists');
      console.log('   4. Test your site with a local server');
      console.log('   5. If something is wrong, restore from _backups folder\n');
    }
  }
}

// Run
main();