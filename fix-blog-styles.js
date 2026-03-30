/**
 * Fix Blog Pages - Replace inline styles with main stylesheet
 * 
 * Usage: node fix-blog-styles.js --dry-run
 *        node fix-blog-styles.js
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  blogDir: './blog',
  backupDir: './_backups/blog-style-fix',
  dryRun: process.argv.includes('--dry-run')
};

// Blog-specific styles to keep (article layout, TOC, etc.)
const BLOG_SPECIFIC_CSS = `
  /* Blog Article Styles */
  .breadcrumb{max-width:860px;margin:0 auto;padding:1.5rem 2rem 0;font-family:'Space Mono',monospace;font-size:0.75rem;color:var(--text2);}
  .breadcrumb a{color:var(--text2);}
  .breadcrumb a:hover{color:var(--green);}
  .breadcrumb span{margin:0 0.5rem;}
  .article-header{max-width:860px;margin:0 auto;padding:2rem 2rem 0;}
  .blog-tags{display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.25rem;}
  .blog-tag{background:rgba(0,255,136,0.08);color:var(--green);padding:0.25rem 0.75rem;border-radius:4px;font-size:0.75rem;font-family:'Space Mono',monospace;}
  .blog-tag.local{background:rgba(0,204,102,0.08);color:var(--green2);}
  .article-header h1{font-size:clamp(1.75rem,4vw,2.5rem);font-weight:700;color:var(--text);line-height:1.25;margin-bottom:1.25rem;}
  .blog-meta{font-family:'Space Mono',monospace;font-size:0.8rem;color:var(--text2);display:flex;gap:1.5rem;flex-wrap:wrap;padding-bottom:2rem;border-bottom:1px solid var(--border);margin-bottom:2rem;}
  .blog-layout{max-width:860px;margin:0 auto;padding:0 2rem 4rem;display:grid;grid-template-columns:1fr 220px;gap:3rem;align-items:start;}
  .blog-post-content{max-width:760px;}
  .blog-post-content p{margin-bottom:1.5rem;font-size:1.05rem;line-height:1.8;}
  .blog-post-content h2{margin-top:3rem;margin-bottom:1rem;font-size:1.5rem;font-weight:700;color:var(--text);line-height:1.3;}
  .blog-post-content h3{margin-top:2rem;margin-bottom:0.75rem;font-size:1.15rem;font-weight:600;color:var(--green);}
  .blog-post-content h4{margin-top:1.25rem;margin-bottom:0.5rem;font-size:0.95rem;font-weight:600;color:var(--text2);font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:0.05em;}
  .blog-post-content ul,.blog-post-content ol{margin-left:1.5rem;margin-bottom:1.5rem;}
  .blog-post-content li{margin-bottom:0.5rem;font-size:1.05rem;line-height:1.7;}
  .blog-post-content blockquote{border-left:3px solid var(--green);padding-left:1.5rem;color:var(--text2);font-style:italic;margin:1.5rem 0;}
  .table-of-contents{background:var(--bg2);border:1px solid var(--border);padding:1.5rem;border-radius:8px;margin-bottom:2.5rem;}
  .table-of-contents h4{font-family:'Space Mono',monospace;font-size:0.7rem;color:var(--text2);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:1rem;}
  .toc-link{color:var(--text2);display:block;padding:0.3rem 0;font-size:0.875rem;transition:color 0.2s;}
  .toc-link:hover{color:var(--green);}
  .callout{background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);border-radius:8px;padding:1.5rem;margin:2rem 0;}
  .callout.blue{background:rgba(0,170,255,0.05);border-color:rgba(0,170,255,0.2);}
  .callout.blue .callout-label{color:var(--blue);}
  .callout-label{font-family:'Space Mono',monospace;font-size:0.7rem;color:var(--green);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.75rem;display:block;}
  .callout p{margin-bottom:0 !important;font-size:0.95rem !important;color:var(--text2) !important;}
  .checklist{list-style:none !important;margin-left:0 !important;}
  .checklist li{padding-left:1.75rem;position:relative;margin-bottom:0.6rem !important;font-size:0.975rem !important;}
  .checklist li::before{content:'✓';position:absolute;left:0;color:var(--green);font-weight:700;}
  .mistakes-list{list-style:none !important;margin-left:0 !important;}
  .mistakes-list li{padding:1rem 1rem 1rem 3.5rem;position:relative;background:var(--card);border:1px solid var(--border);border-radius:6px;margin-bottom:0.75rem !important;font-size:0.95rem !important;}
  .mistakes-list li::before{content:attr(data-num);position:absolute;left:1rem;top:1rem;font-family:'Space Mono',monospace;font-size:0.75rem;color:var(--green);background:rgba(0,255,136,0.1);width:1.75rem;height:1.75rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;}
  .mistakes-list li strong{color:var(--text);display:block;margin-bottom:0.25rem;}
  .post-type-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin:1.5rem 0;}
  .post-type-card{background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:1.25rem;}
  .post-type-card h4{font-size:0.9rem;font-weight:600;color:var(--green);margin-bottom:0.4rem;font-family:'Space Grotesk',sans-serif;text-transform:none;letter-spacing:0;}
  .post-type-card p{font-size:0.82rem;color:var(--text2);margin-bottom:0.5rem;}
  .post-type-card .when{font-family:'Space Mono',monospace;font-size:0.7rem;color:var(--text2);}
  .sidebar{position:sticky;top:90px;}
  .sidebar-toc{background:var(--bg2);border:1px solid var(--border);padding:1.25rem;border-radius:8px;margin-bottom:1.5rem;}
  .sidebar-toc h4{font-family:'Space Mono',monospace;font-size:0.65rem;color:var(--text2);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:0.75rem;}
  .sidebar-toc a{display:block;padding:0.25rem 0;font-size:0.8rem;color:var(--text2);transition:color 0.2s;}
  .sidebar-toc a:hover{color:var(--green);}
  .sidebar-cta{background:var(--card);border:1px solid rgba(0,255,136,0.2);border-radius:8px;padding:1.5rem;text-align:center;}
  .sidebar-cta p{font-size:0.85rem !important;color:var(--text2) !important;margin-bottom:1rem !important;}
  .author-box{display:flex;gap:1.5rem;padding:2rem;background:var(--card);border:1px solid var(--border);border-radius:8px;margin-top:3rem;align-items:flex-start;}
  .author-avatar{width:64px;height:64px;background:rgba(0,255,136,0.1);border:2px solid rgba(0,255,136,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.75rem;flex-shrink:0;}
  .author-info h4{font-size:1rem;font-weight:600;color:var(--text);margin-bottom:0.25rem;}
  .author-info .author-title{font-family:'Space Mono',monospace;font-size:0.75rem;color:var(--green);margin-bottom:0.75rem;}
  .author-info p{font-size:0.9rem !important;color:var(--text2) !important;margin-bottom:0 !important;line-height:1.6 !important;}
  .related-posts{margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border);}
  .related-posts h3{font-size:1rem;font-family:'Space Mono',monospace;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:1.25rem;color:var(--text2) !important;}
  .related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;}
  .related-card{background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:1.25rem;transition:border-color 0.2s;}
  .related-card:hover{border-color:rgba(0,255,136,0.25);}
  .related-card span{font-family:'Space Mono',monospace;font-size:0.65rem;color:var(--green);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:0.5rem;}
  .related-card a{font-size:0.875rem;font-weight:500;color:var(--text);line-height:1.4;display:block;}
  .related-card a:hover{color:var(--green);}
  .post-cta{background:var(--bg2);border:1px solid rgba(0,255,136,0.2);border-radius:8px;padding:2.5rem;text-align:center;margin-top:3rem;}
  .post-cta h3{font-size:1.35rem;font-weight:700;color:var(--text);margin-bottom:0.75rem;}
  .post-cta p{color:var(--text2);margin-bottom:1.5rem;max-width:480px;margin-left:auto;margin-right:auto;}
  .faq-section{margin-top:1rem;}
  .faq-item{border:1px solid var(--border);border-radius:6px;margin-bottom:1rem;overflow:hidden;}
  .faq-question{padding:1.25rem 1.5rem;font-weight:600;color:var(--text);background:var(--card);font-size:0.95rem;display:flex;justify-content:space-between;align-items:center;}
  .faq-question::after{content:'+';color:var(--green);font-size:1.25rem;font-weight:300;}
  .faq-answer{padding:1.25rem 1.5rem;color:var(--text2);font-size:0.95rem;line-height:1.7;border-top:1px solid var(--border);}
  @media(max-width:900px){.blog-layout{grid-template-columns:1fr;}.sidebar{display:none;}.related-grid,.post-type-grid{grid-template-columns:1fr;}}
  @media(max-width:600px){.author-box{flex-direction:column;}}
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const changes = [];

  // Check if file has inline styles
  if (!content.includes('<style>')) {
    return { skipped: true, reason: 'No inline styles found' };
  }

  // Remove the entire inline <style> block
  const stylePattern = /<style>[\s\S]*?<\/style>/i;
  if (stylePattern.test(content)) {
    content = content.replace(stylePattern, `<link rel="stylesheet" href="../style.css">
  <style>${BLOG_SPECIFIC_CSS}
  </style>`);
    changes.push('Replaced inline styles with stylesheet link + blog-specific CSS');
  }

  // Make sure the main content has proper wrapper for nav spacing
  // Add padding-top to body or main content area
  if (!content.includes('padding-top') && !content.includes('margin-top: 80px')) {
    // Add a style to account for fixed nav
    content = content.replace(
      '<style>',
      '<style>\n  body { padding-top: 70px; }'
    );
    changes.push('Added body padding for fixed nav');
  }

  return {
    modified: changes.length > 0,
    changes,
    newContent: content
  };
}

function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     Fix Blog Inline Styles                             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  if (CONFIG.dryRun) {
    console.log('🔍 DRY RUN MODE\n');
  }

  if (!fs.existsSync(CONFIG.blogDir)) {
    console.log('❌ Blog directory not found');
    return;
  }

  if (!CONFIG.dryRun && !fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
  }

  const files = fs.readdirSync(CONFIG.blogDir)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(CONFIG.blogDir, f));

  console.log(`📄 Found ${files.length} blog files\n`);

  let modified = 0;

  for (const file of files) {
    const filename = path.basename(file);
    console.log(`Processing: ${filename}`);

    const result = processFile(file);

    if (result.skipped) {
      console.log(`  ⏭️  ${result.reason}`);
    } else if (result.modified) {
      if (!CONFIG.dryRun) {
        fs.copyFileSync(file, path.join(CONFIG.backupDir, filename));
        fs.writeFileSync(file, result.newContent, 'utf8');
      }
      result.changes.forEach(c => console.log(`  ✅ ${c}`));
      modified++;
    }
    console.log('');
  }

  console.log(`\n📊 Modified: ${modified} files\n`);
  
  if (CONFIG.dryRun) {
    console.log('Run without --dry-run to apply changes.\n');
  }
}

main();