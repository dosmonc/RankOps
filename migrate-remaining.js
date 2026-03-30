/**
 * RankOps Remaining Files Migration
 * For pages that didn't match the standard pattern
 * 
 * Usage: node migrate-remaining.js --dry-run
 *        node migrate-remaining.js
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  rootDir: '.',
  backupDir: './_backups/remaining',
  dryRun: process.argv.includes('--dry-run'),
  skipFolders: ['node_modules', '_backups', 'components', '.git', 'blog'],
  // Only process these specific files
  targetFiles: [
    'ballantyne-charlotte-nc.html',
    'cotsworld-charlotte-nc.html', 
    'elizabeth-charlotte-nc.html',
    'madison-park-charlotte-nc.html',
    'myers-park-charlotte-nc.html',
    'southpark-charlote-nc.html',
    'uptown-charlotte-nc.html',
    'blog.html',
    'hub.html'
    // NOT including thethinkery.html - handle separately
  ]
};

// Various nav patterns to try
const NAV_PATTERNS = [
  // Standard pattern
  /\s*<!-- NAVIGATION -->[\s\S]*?<\/nav>\s*<!-- MOBILE MENU -->[\s\S]*?<\/div>\s*(?=<main|<section|<div|<header)/i,
  // Without comments but with id="navbar"
  /\s*<nav id="navbar">[\s\S]*?<\/nav>\s*<div class="mobile-menu"[\s\S]*?<\/div>\s*/i,
  // Simple nav with class
  /\s*<nav[^>]*>[\s\S]*?<\/nav>\s*(?=<main|<section|<div|<header)/i,
];

// Various footer patterns
const FOOTER_PATTERNS = [
  /\s*<!-- FOOTER -->\s*<footer>[\s\S]*?<\/footer>/i,
  /\s*<footer id="footer">[\s\S]*?<\/footer>/i,
  /\s*<footer>[\s\S]*?<\/footer>/i,
];

const NAV_PLACEHOLDER = `    <!-- NAV PLACEHOLDER -->
    <div id="nav-placeholder"></div>

    `;

const FOOTER_PLACEHOLDER = `    <!-- FOOTER PLACEHOLDER -->
    <div id="footer-placeholder"></div>`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const changes = [];

  if (content.includes('id="nav-placeholder"') && content.includes('id="footer-placeholder"')) {
    return { skipped: true, reason: 'Already migrated' };
  }

  // Try each nav pattern
  let navReplaced = false;
  if (!content.includes('id="nav-placeholder"')) {
    for (const pattern of NAV_PATTERNS) {
      if (pattern.test(content)) {
        content = content.replace(pattern, NAV_PLACEHOLDER);
        changes.push('Replaced nav');
        navReplaced = true;
        break;
      }
    }
    
    // If no pattern matched, insert after <body>
    if (!navReplaced) {
      const bodyMatch = content.match(/<body[^>]*>/i);
      if (bodyMatch) {
        const idx = bodyMatch.index + bodyMatch[0].length;
        content = content.slice(0, idx) + '\n' + NAV_PLACEHOLDER + content.slice(idx);
        changes.push('Inserted nav placeholder after <body>');
      }
    }
  }

  // Try each footer pattern
  let footerReplaced = false;
  if (!content.includes('id="footer-placeholder"')) {
    for (const pattern of FOOTER_PATTERNS) {
      if (pattern.test(content)) {
        content = content.replace(pattern, FOOTER_PLACEHOLDER);
        changes.push('Replaced footer');
        footerReplaced = true;
        break;
      }
    }
    
    // If no pattern matched, insert before </body>
    if (!footerReplaced) {
      content = content.replace(
        /<\/body>/i,
        '\n' + FOOTER_PLACEHOLDER + '\n\n</body>'
      );
      changes.push('Inserted footer placeholder before </body>');
    }
  }

  // Add components.js
  if (changes.length > 0 && !content.includes('components/components.js')) {
    const scriptTag = '<script src="components/components.js"></script>\n    ';
    
    if (/src=["'][^"']*script\.js["']/i.test(content)) {
      content = content.replace(
        /(<script[^>]*src=["'][^"']*script\.js["'][^>]*><\/script>)/i,
        scriptTag + '\$1'
      );
    } else {
      content = content.replace('</body>', '    ' + scriptTag + '</body>');
    }
    changes.push('Added components.js');
  }

  return {
    modified: changes.length > 0,
    changes,
    newContent: content
  };
}

function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     RankOps Remaining Files Migration                  ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  if (CONFIG.dryRun) {
    console.log('🔍 DRY RUN MODE\n');
  }

  // Create backup directory
  if (!CONFIG.dryRun && !fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
  }

  let modified = 0;
  let skipped = 0;

  for (const filename of CONFIG.targetFiles) {
    const filePath = path.join(CONFIG.rootDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}\n`);
      continue;
    }

    console.log(`Processing: ${filename}`);

    const result = processFile(filePath);

    if (result.skipped) {
      console.log(`  ⏭️  ${result.reason}`);
      skipped++;
    } else if (result.modified) {
      if (!CONFIG.dryRun) {
        fs.copyFileSync(filePath, path.join(CONFIG.backupDir, filename));
        fs.writeFileSync(filePath, result.newContent, 'utf8');
      }
      result.changes.forEach(c => console.log(`  ✅ ${c}`));
      modified++;
    } else {
      console.log(`  ⚠️  No changes`);
      skipped++;
    }
    console.log('');
  }

  console.log('─'.repeat(50));
  console.log(`\n📊 Modified: ${modified} | Skipped: ${skipped}\n`);
}

main();