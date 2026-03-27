#!/usr/bin/env node

/**
 * build.js — Generates index.html from index.template.html + articles.json
 *
 * Run: node build.js
 *
 * Reads the article manifest, generates a card for each entry,
 * injects them into the template, and writes index.html.
 * Cloudflare Pages runs this as the build command on every push.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TEMPLATE = path.join(ROOT, 'index.template.html');
const MANIFEST = path.join(ROOT, 'articles.json');
const OUTPUT = path.join(ROOT, 'index.html');

// ─── Read inputs ───
const template = fs.readFileSync(TEMPLATE, 'utf-8');
const articles = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));

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

  return `
      <!-- Card: ${article.title} -->
      <a href="${article.file}" class="article-card fade-up">
        <div class="card-icon">${article.icon}</div>
        <div class="card-tags">
${tags}
        </div>
        <div class="card-title">${article.title}</div>
        <div class="card-desc">${article.description}</div>
        <div class="card-meta">
          <span class="card-date">${formatDate(article.date)}</span>
          <span class="card-read">
            Read
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </span>
        </div>
      </a>`;
}

// ─── Sort articles by date descending (newest first) ───
articles.sort((a, b) => b.date.localeCompare(a.date));

// ─── Build ───
const cardsHtml = articles.map(renderCard).join('\n');
const count = articles.length;

let output = template
  .replace('{{ARTICLES}}', cardsHtml)
  .replace('{{COUNT}}', count.toString());

fs.writeFileSync(OUTPUT, output, 'utf-8');

console.log(`✅ Built index.html with ${count} articles`);
articles.forEach(a => console.log(`   · ${a.title} (${a.file})`));
