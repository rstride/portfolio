#!/usr/bin/env node
/*
Normalize frontmatter for English writeups under content/blog/en.
This script updates keys: release_date->date, os->target_os, removes `published`,
adds defaults for missing required fields (id, excerpt, category, platform, severity, icon, author).

Usage: node scripts/normalize-writeups.js
Requires: gray-matter
*/
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.resolve(__dirname, '..');
const CONTENT = path.join(ROOT, 'content', 'blog', 'en');

const allowedIcons = ['Terminal', 'ShieldAlert', 'Database', 'Code'];

function listFiles(dir) {
  const res = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) res.push(...listFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) res.push(full);
  }
  return res;
}

function inferId(filename) {
  const base = path.basename(filename, '.md').toUpperCase();
  const year = new Date().getFullYear();
  return `HTB-${year}-${base}`;
}

function extractExcerpt(content) {
  // Strip code blocks and markdown formatting to get clean text
  const clean = content
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/`.*?`/g, '') // remove inline code
    .replace(/[#*_\-\[\]()]/g, '') // remove md markup characters
    .trim();
  const lines = clean.split(/\r?\n/);
  let para = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      if (para.length) break;
      continue;
    }
    para.push(t);
  }
  const text = para.join(' ').replace(/\s+/g, ' ').slice(0, 160).trim();
  return text || 'Offensive security write-up.';
}

function mapSeverity(difficulty) {
  if (!difficulty) return 'MEDIUM';
  const d = String(difficulty).toUpperCase();
  if (d.includes('EASY')) return 'LOW';
  if (d.includes('HARD')) return 'HIGH';
  if (d.includes('INSANE')) return 'HIGH';
  return 'MEDIUM';
}

function normalizeMeta(file, dryRun = true) {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const meta = Object.assign({}, parsed.data);

  // Rename keys
  if (meta.release_date && !meta.date) {
    meta.date = meta.release_date;
    delete meta.release_date;
  }
  if (meta.os && !meta.target_os) {
    meta.target_os = String(meta.os).toUpperCase();
    delete meta.os;
  }

  // Remove published flag entirely to publish
  if (meta.published !== undefined) delete meta.published;

  // Add defaults and normalize casing
  if (!meta.id) meta.id = inferId(file);
  
  if (!meta.title && parsed.content) {
    const m = parsed.content.match(/^#\s*(.+)$/m);
    if (m) meta.title = m[1].trim();
  }

  // Normalize platform, target_os, difficulty to uppercase
  if (meta.platform) meta.platform = String(meta.platform).toUpperCase();
  if (meta.target_os) meta.target_os = String(meta.target_os).toUpperCase();
  if (meta.difficulty) meta.difficulty = String(meta.difficulty).toUpperCase();

  if (!meta.category) meta.category = 'WRITEUP';
  if (!meta.platform) meta.platform = 'HACKTHEBOX';
  if (!meta.target_os) meta.target_os = 'LINUX';
  if (!meta.difficulty) meta.difficulty = 'MEDIUM';
  if (!meta.severity) meta.severity = mapSeverity(meta.difficulty);
  if (!meta.icon) meta.icon = 'Terminal';
  if (!allowedIcons.includes(meta.icon)) meta.icon = 'Terminal';
  if (!meta.author) meta.author = '0x7CC';

  // Normalize date to YYYY-MM-DD
  if (meta.date) {
    let dateStr = '';
    if (meta.date instanceof Date) {
      dateStr = meta.date.toISOString();
    } else {
      dateStr = String(meta.date);
    }
    meta.date = dateStr.split('T')[0];
  }

  // Normalize tags array (must be uppercase)
  let rawTags = [];
  if (Array.isArray(meta.tags)) {
    rawTags = meta.tags.map(t => String(t).toUpperCase());
  } else if (meta.tags) {
    rawTags = [String(meta.tags).toUpperCase()];
  }
  
  // Ensure required tags are present: WRITEUP, platform, target_os, difficulty
  const requiredTags = ['WRITEUP', meta.platform, meta.target_os, meta.difficulty];
  for (const rt of requiredTags) {
    if (rt && !rawTags.includes(rt)) {
      rawTags.push(rt);
    }
  }
  // filter unique
  meta.tags = Array.from(new Set(rawTags));

  // Extract excerpt if not set or if it contains code blocks/garbage
  if (!meta.excerpt || meta.excerpt.includes('`') || meta.excerpt.length > 200) {
    meta.excerpt = extractExcerpt(parsed.content || '');
  }

  const newContent = matter.stringify(parsed.content || '', meta);
  if (dryRun) {
    console.log(`DRY RUN: ${file}`);
    console.log('--- old meta ---');
    console.log(JSON.stringify(parsed.data, null, 2));
    console.log('--- new meta ---');
    console.log(JSON.stringify(meta, null, 2));
    console.log('\n');
  } else {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry-run') || args.includes('-n');
  const files = listFiles(CONTENT);
  for (const f of files) {
    try {
      normalizeMeta(f, dry);
    } catch (err) {
      console.error('Error normalizing', f, err.message);
    }
  }
  if (dry) console.log('Dry run complete. Rerun without --dry-run to apply changes.');
}

if (require.main === module) main();
