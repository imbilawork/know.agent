#!/usr/bin/env node

/**
 * build.js — Generates index.html from index.template.html + articles.json
 *
 * Run: node build.js
 *
 * Two modes of operation:
 *   1. Articles listed in articles.json are used as-is (manual control)
 *   2. Any *-explainer.html or other HTML files not in the manifest
 *      are auto-discovered — metadata is extracted from their HTML
 *
 * This means: drop a new .html file, push, and the index rebuilds.
 * If you want to customise the card (icon, tags, description), add
 * an entry to articles.json and it takes priority.
 *
 * Cloudflare Pages runs this as the build command on every push.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TEMPLATE = path.join(ROOT, 'index.template.html');
const MANIFEST = path.join(ROOT, 'articles.json');
const OUTPUT = path.join(ROOT, 'index.html');

// Files that should never appear as articles
const IGNORE = new Set([
  'index.html',
  'index.template.html'
]);

// ─── Category definitions ───
const CATEGORIES = {
  'agent-frameworks':  { label: 'Agent Frameworks',  icon: '🤖', order: 1 },
  'agent-skills':      { label: 'Agent Skills',      icon: '🧩', order: 2 },
  'ai-infrastructure': { label: 'AI Infrastructure', icon: '☁️', order: 3 },
  'enterprise':        { label: 'Enterprise',        icon: '🏢', order: 4 },
  'creative-ai':       { label: 'Creative AI',       icon: '🎨', order: 5 },
  'benchmarks':        { label: 'Benchmarks',        icon: '📊', order: 6 },
};

// ─── Slug → category mapping ───
const CATEGORY_MAP = {
  'crewai-explainer':              'agent-frameworks',
  'langchain-explainer':           'agent-frameworks',
  'agents2026':                    'agent-frameworks',
  'agent-skills-explainer':        'agent-skills',
  'claude-code-skills-explainer':  'agent-skills',
  'cloudflare-ai-explainer':       'ai-infrastructure',
  'llama-cpp-explainer':           'ai-infrastructure',
  'liteparse-explainer':           'ai-infrastructure',
  'ai-token-ledger-explainer':     'ai-infrastructure',
  'teams-agent-channel-explainer': 'enterprise',
  'nemoclaw-explainer':            'enterprise',
  'elevencreative-explainer':      'creative-ai',
  'dlss5-explainer':               'creative-ai',
  'arc-agi-3-explainer':           'benchmarks',
};

// ─── Read inputs ───
const template = fs.readFileSync(TEMPLATE, 'utf-8');
let manifest = [];
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
} catch (e) {
  console.log('⚠️  No articles.json found — will auto-discover all HTML files');
}

// ─── Build a set of files already in the manifest ───
const knownFiles = new Set(manifest.map(a => a.file));

// ─── Auto-discover HTML files not in the manifest ───
const htmlFiles = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html') && !IGNORE.has(f) && !knownFiles.has(f));

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf-8');
  const article = extractMetadata(file, html);
  if (article) {
    manifest.push(article);
    console.log(`🔍 Auto-discovered: ${article.title} (${file})`);
  }
}

// ─── Ensure all articles have category + agentId ───
for (const article of manifest) {
  const slug = article.slug || article.file.replace('.html', '');
  article.slug = slug;

  // Category: from article, then CATEGORY_MAP, then 'general'
  if (!article.category) {
    article.category = CATEGORY_MAP[slug] || 'general';
  }

  // Agent ID: from article, then extract from HTML data-agent-id
  if (!article.agentId) {
    const filePath = path.join(ROOT, article.file);
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, 'utf-8');
      const agentMatch = html.match(/data-agent-id="([^"]+)"/);
      if (agentMatch) article.agentId = agentMatch[1];
    }
  }
}

// ─── Extract metadata from an HTML file ───
function extractMetadata(file, html) {
  // Title: extract from <title> tag, strip " — An Imbila.AI Explainer" suffix
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) return null;
  let title = titleMatch[1]
    .replace(/\s*[—–-]\s*An Imbila\.AI Explainer\s*/i, '')
    .replace(/\s+Explained\s*$/i, ' Explained')
    .trim();

  // Description: from hero-sub paragraph
  const heroSubMatch = html.match(/class="hero-sub">([^<]+)</);
  const description = heroSubMatch
    ? heroSubMatch[1].trim()
    : `An Imbila.AI explainer on ${title}.`;

  // Tags: derive from category label + "Explainer"
  const slug = file.replace('.html', '');
  const cat = CATEGORY_MAP[slug];
  const catLabel = cat ? CATEGORIES[cat]?.label : null;
  const tags = [];
  if (catLabel) tags.push(catLabel);
  tags.push('Explainer');

  // Icon: from category, or keyword-based fallback
  const icon = cat ? CATEGORIES[cat].icon : pickIcon(title, slug);

  // Date: try to find in the HTML, fall back to file modification time
  const date = extractDate(html, path.join(ROOT, file));

  // Agent ID
  const agentMatch = html.match(/data-agent-id="([^"]+)"/);
  const agentId = agentMatch ? agentMatch[1] : null;

  return { slug, file, title, description, icon, tags, date, category: CATEGORY_MAP[slug] || 'general', agentId };
}

// ─── Pick an icon based on keywords (fallback for uncategorised articles) ───
function pickIcon(title, slug) {
  const t = (title + ' ' + slug).toLowerCase();
  if (t.includes('agent')) return '🤖';
  if (t.includes('langchain') || t.includes('chain')) return '🔗';
  if (t.includes('llama') || t.includes('gguf')) return '🦙';
  if (t.includes('claude')) return '🟠';
  if (t.includes('openai') || t.includes('gpt')) return '💚';
  if (t.includes('skill')) return '🧩';
  if (t.includes('rag') || t.includes('retrieval')) return '🔎';
  if (t.includes('vector') || t.includes('embed')) return '📐';
  if (t.includes('deploy') || t.includes('cloud')) return '☁️';
  if (t.includes('security') || t.includes('auth')) return '🔒';
  if (t.includes('data') || t.includes('pipe')) return '📊';
  return '📄';
}

// ─── Extract date from HTML or fall back to file mtime ───
function extractDate(html, filePath) {
  const dateMatch = html.match(/(?:validated|updated|published)\s+(\w+\s+\d{4})/i);
  if (dateMatch) {
    const parsed = parseMonthYear(dateMatch[1]);
    if (parsed) return parsed;
  }
  const stat = fs.statSync(filePath);
  const d = stat.mtime;
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${month}`;
}

function parseMonthYear(str) {
  const months = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
    january: '01', february: '02', march: '03', april: '04',
    june: '06', july: '07', august: '08', september: '09',
    october: '10', november: '11', december: '12'
  };
  const parts = str.trim().split(/\s+/);
  if (parts.length === 2) {
    const m = months[parts[0].toLowerCase()];
    const y = parts[1];
    if (m && /^\d{4}$/.test(y)) return `${y}-${m}`;
  }
  return null;
}

// ─── Format a date string like "2026-03" into "Mar 2026" ───
function formatDate(dateStr) {
  const [year, month] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

// ─── Generate HTML for one article card ───
function renderCard(article) {
  const tags = article.tags
    .map(t => `          <span class="tag">${t}</span>`)
    .join('\n');

  const catAttr = article.category ? ` data-category="${article.category}"` : '';

  // Agent-ready badge (links to raw markdown on GitHub)
  let agentBadge = '';
  if (article.agentId) {
    const mdUrl = `https://raw.githubusercontent.com/imbilawork/know.agent/main/agentapi/content/${article.agentId}.md`;
    agentBadge = `<a href="${mdUrl}" class="agent-badge" title="Agent-ready markdown" onclick="event.stopPropagation()">🤖 MD</a>`;
  }

  return `
      <!-- Card: ${article.title} -->
      <a href="${article.file}" class="article-card fade-up"${catAttr}>
        <div class="card-icon">${article.icon}</div>
        <div class="card-tags">
${tags}
        </div>
        <div class="card-title">${article.title}</div>
        <div class="card-desc">${article.description}</div>
        <div class="card-meta">
          <span class="card-date">${formatDate(article.date)}</span>
          ${agentBadge}
          <span class="card-read">
            Read
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </span>
        </div>
      </a>`;
}

// ─── Generate category filter pills ───
function renderCategoryFilters() {
  // Only include categories that have articles
  const usedCategories = new Set(manifest.map(a => a.category).filter(c => c && CATEGORIES[c]));
  const sorted = [...usedCategories].sort((a, b) => (CATEGORIES[a]?.order || 99) - (CATEGORIES[b]?.order || 99));

  return sorted.map(catId => {
    const cat = CATEGORIES[catId];
    const count = manifest.filter(a => a.category === catId).length;
    return `<button class="cat-pill" data-filter="${catId}">${cat.icon} ${cat.label} <span class="cat-count">${count}</span></button>`;
  }).join('\n          ');
}

// ─── Sort articles: by category order, then by date within category ───
manifest.sort((a, b) => {
  const catA = CATEGORIES[a.category]?.order || 99;
  const catB = CATEGORIES[b.category]?.order || 99;
  if (catA !== catB) return catA - catB;
  return b.date.localeCompare(a.date);
});

// ─── Build ───
const cardsHtml = manifest.map(renderCard).join('\n');
const filtersHtml = renderCategoryFilters();
const count = manifest.length;
const categoryCount = new Set(manifest.map(a => a.category).filter(c => c && CATEGORIES[c])).size;

let output = template
  .replace('{{ARTICLES}}', cardsHtml)
  .replace('{{COUNT}}', count.toString())
  .replace('{{CATEGORY_FILTERS}}', filtersHtml)
  .replace('{{CATEGORY_COUNT}}', categoryCount.toString());

fs.writeFileSync(OUTPUT, output, 'utf-8');

console.log(`\n✅ Built index.html with ${count} articles across ${categoryCount} categories`);
manifest.forEach(a => console.log(`   · ${a.title} (${a.file}) [${a.category}]`));
