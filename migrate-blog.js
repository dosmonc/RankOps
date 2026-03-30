/**
 * RankOps Blog Migration Script
 * Replaces blog-specific nav/footer with main site placeholders
 * 
 * Usage: node migrate-blog.js --dry-run
 *        node migrate-blog.js
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  blogDir: './blog',
  backupDir: './_backups/blog',
  dryRun: process.argv.includes('--dry-run')
};

// Blog nav pattern - matches from <nav> through </nav> including breadcrumb
const BLOG_NAV_PATTERN = /\s*<nav>\s*<a href="[^"]*"[^>]*>RankOps<\/a>[\s\S]*?<\/nav>\s*<nav class="breadcrumb"[\s\S]*?<\/nav>/gi;

// Alternative - just the first nav if breadcrumb is separate
const BLOG_NAV_SIMPLE = /\s*<nav>\s*<a href="[^"]*"[^>]*>RankOps<\/a>[\s\S]*?<\/nav>/i;

// Blog footer pattern
const BLOG_FOOTER_PATTERN = /\s*<footer>\s*<div class="footer-inner">[\s\S]*?<\/footer>/i;

// Simpler footer pattern as fallback
const BLOG_FOOTER_SIMPLE = /\s*<footer>[\s\S]*?<\/footer>/i;

const NAV_PLACEHOLDER = `
    <!-- NAV PLACEHOLDER - Loaded by components.js -->
    <div id="nav-placeholder"></div>

    `;

const FOOTER_PLACEHOLDER = `
    <!-- FOOTER PLACEHOLDER - Loaded by components.js -->
    <div id="footer-placeholder"></div>
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const changes = [];
  const original = content;

  // Skip if already migrated
  if (content.includes('id="nav-placeholder"')) {
    return { skipped: true, reason: 'Already migrated' };
  }

  // Replace blog nav (try full pattern first, then simple)
  if (BLOG_NAV_PATTERN.test(content)) {
    content = content.replace(BLOG_NAV_PATTERN, NAV_PLACEHOLDER);
    changes.push('Replaced blog nav (with breadcrumb)');
  } else if (BLOG_NAV_SIMPLE.test(content)) {
    content = content.replace(BLOG_NAV_SIMPLE, NAV_PLACEHOLDER);
    changes.push('Replaced blog nav (simple)');
  }

  // Replace blog footer (try detailed pattern first)
  if (BLOG_FOOTER_PATTERN.test(content)) {
    content = content.replace(BLOG_FOOTER_PATTERN, FOOTER_PLACEHOLDER);
    changes.push('Replaced blog footer');
  } else if (BLOG_FOOTER_SIMPLE.test(content)) {
    content = content.replace(BLOG_FOOTER_SIMPLE, FOOTER_PLACEHOLDER);
    changes.push('Replaced blog footer (simple)');
  }

  // Add components.js if changes were made
  if (changes.length > 0 && !content.includes('components/components.js')) {
    // For blog folder, need ../components/
    const scriptTag = '<script src="../components/components.js"></script>\n    ';
    
    if (content.includes('</body>')) {
      content = content.replace('</body>', '    ' + scriptTag + '</body>');
      changes.push('Added components.js');
    }
  }

  // Fix CSS path if needed (blog pages should use ../style.css)
  if (!content.includes('../style.css') && content.includes('href="style.css"')) {
    content = content.replace(/href="style\.css"/g, 'href="../style.css"');
    changes.push('Fixed style.css path');
  }

  return {
    modified: changes.length > 0,
    changes,
    newContent: content
  };
}

function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     RankOps Blog Migration Script                      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  if (CONFIG.dryRun) {
    console.log('🔍 DRY RUN MODE\n');
  }

  // Check if blog directory exists
  if (!fs.existsSync(CONFIG.blogDir)) {
    console.log('❌ Blog directory not found:', CONFIG.blogDir);
    return;
  }

  // Create backup directory
  if (!CONFIG.dryRun && !fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
  }

  // Get all HTML files in blog folder
  const files = fs.readdirSync(CONFIG.blogDir)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(CONFIG.blogDir, f));

  console.log(`📄 Found ${files.length} blog HTML files\n`);

  let modified = 0;
  let skipped = 0;

  for (const file of files) {
    const filename = path.basename(file);
    console.log(`Processing: ${filename}`);

    const result = processFile(file);

    if (result.skipped) {
      console.log(`  ⏭️  ${result.reason}`);
      skipped++;
    } else if (result.modified) {
      if (!CONFIG.dryRun) {
        // Backup
        fs.copyFileSync(file, path.join(CONFIG.backupDir, filename));
        // Save
        fs.writeFileSync(file, result.newContent, 'utf8');
      }
      result.changes.forEach(c => console.log(`  ✅ ${c}`));
      modified++;
    } else {
      console.log(`  ⚠️  No changes made`);
      skipped++;
    }
    console.log('');
  }

  console.log('─'.repeat(50));
  console.log(`\n📊 Modified: ${modified} | Skipped: ${skipped}\n`);

  if (CONFIG.dryRun) {
    console.log('Run without --dry-run to apply changes.\n');
  }
}

main();