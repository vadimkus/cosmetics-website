/**
 * Fails if this repo's design tokens have drifted from design-tokens.json.
 *
 * The website and the mobile app are separate repositories, so neither can
 * import the other's tokens at build time. Instead both carry an identical
 * copy of design-tokens.json and both run a check like this one against their
 * own native definition — CSS custom properties here, a JS object in the app.
 *
 * Run: npm run verify:tokens
 */

import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const tokens = JSON.parse(read('design-tokens.json'));
const failures = [];

/* ── The cera palette, as --cera-* custom properties in globals.css ───── */

const globals = read('app/globals.css');

// JSON uses camelCase (creamDeep); CSS uses kebab (--cera-cream-deep).
const cssVarFor = (name) => `--cera-${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

for (const [name, expected] of Object.entries(tokens.color)) {
  if (name.startsWith('$')) continue;
  const varName = cssVarFor(name);
  // Only the declaration in the light-theme block, not later dark-mode overrides.
  const match = globals.match(new RegExp(`${varName}:\\s*([^;]+);`));
  if (!match) {
    failures.push(`${varName} is missing from app/globals.css`);
    continue;
  }
  const actual = match[1].trim().toLowerCase();
  if (actual !== expected.toLowerCase()) {
    failures.push(`${varName} is ${actual} in globals.css but ${expected} in design-tokens.json`);
  }
}

/* ── Status colours, as --status-* custom properties in globals.css ───── */

const statusVarFor = (name) => `--status-${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

for (const [name, expected] of Object.entries(tokens.status)) {
  if (name.startsWith('$')) continue;
  const varName = statusVarFor(name);
  const match = globals.match(new RegExp(`${varName}:\\s*([^;]+);`));
  if (!match) {
    failures.push(`${varName} is missing from app/globals.css`);
    continue;
  }
  const actual = match[1].trim().toLowerCase();
  if (actual !== expected.toLowerCase()) {
    failures.push(`${varName} is ${actual} in globals.css but ${expected} in design-tokens.json`);
  }
}

/* ── Third-party brand marks, as --brand-* in globals.css ─────────────── */

for (const [name, expected] of Object.entries(tokens.brand)) {
  if (name.startsWith('$')) continue;
  const varName = `--brand-${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
  const match = globals.match(new RegExp(`${varName}:\\s*([^;]+);`));
  if (!match) {
    failures.push(`${varName} is missing from app/globals.css`);
    continue;
  }
  const actual = match[1].trim().toLowerCase();
  if (actual !== expected.toLowerCase()) {
    failures.push(`${varName} is ${actual} in globals.css but ${expected} in design-tokens.json`);
  }
}

/* ── The eyebrow, in cerabarrier.css ──────────────────────────────────── */

const cera = read('components/product/cerabarrier/cerabarrier.css');
const eyebrowBlock = cera.match(/\.cera-eyebrow\s*\{([^}]+)\}/);

if (!eyebrowBlock) {
  failures.push('.cera-eyebrow rule not found in cerabarrier.css');
} else {
  const body = eyebrowBlock[1];
  const prop = (name) => {
    const m = body.match(new RegExp(`${name}:\\s*([^;]+);`));
    return m ? m[1].trim() : null;
  };
  const eyebrow = tokens.typography.eyebrow;
  const checks = [
    ['font-size', `${eyebrow.fontSize}px`],
    ['font-weight', String(eyebrow.fontWeight)],
    ['letter-spacing', `${eyebrow.letterSpacingEm}em`],
    ['text-transform', eyebrow.textTransform],
  ];
  for (const [name, expected] of checks) {
    const actual = prop(name);
    if (actual !== expected) {
      failures.push(`.cera-eyebrow ${name} is ${actual ?? 'unset'} but design-tokens.json says ${expected}`);
    }
  }
}

/* ── Section title: the clamp floor is what phones actually get ───────── */

const h2 = globals.match(/--text-h2:\s*clamp\(([^,]+),/);
if (!h2) {
  failures.push('--text-h2 clamp not found in app/globals.css');
} else {
  const floor = h2[1].trim();
  const expectedPx = tokens.typography.sectionTitle.phoneFontSize;
  const floorPx = floor.endsWith('rem') ? parseFloat(floor) * 16 : parseFloat(floor);
  if (floorPx !== expectedPx) {
    failures.push(
      `--text-h2 floor is ${floor} (${floorPx}px) but design-tokens.json says phones get ${expectedPx}px`
    );
  }
}

/* ── No second copy of the palette ────────────────────────────────────────
   This file used to check globals.css alone, which is how four stylesheets got
   away with redeclaring the whole cera block for themselves: editorial.css and
   the blog, training and skin-recommendation pages. Nine of the ten tokens in
   each were the globals value off by a digit, and the other two held a vivid red
   from before the site moved to cera. Between them those classes covered the
   home page, the shopping path, the blog and the footer, so most of the site was
   quietly running on a fork.

   A --cera-* declaration is legitimate in exactly two places: globals.css, which
   defines them, and components/product/, where each bespoke page tints them to
   its own product on purpose. Anywhere else is a second copy, and a second copy
   drifts. */

const paletteHomes = ['app/globals.css', 'components/product/'];
const cssFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(rel);
    else if (entry.name.endsWith('.css')) cssFiles.push(rel);
  }
};
for (const dir of ['app', 'components']) walk(dir);

for (const file of cssFiles) {
  if (paletteHomes.some((home) => file === home || file.startsWith(home))) continue;
  const declared = [...read(file).matchAll(/^\s*(--cera-[a-z-]+)\s*:/gm)].map((m) => m[1]);
  if (declared.length > 0) {
    const unique = [...new Set(declared)];
    failures.push(
      `${file} declares ${unique.join(', ')}. Only app/globals.css defines the ` +
        `cera palette, and only components/product/ may retint it.`
    );
  }
}

/* ── Checksum, so the app repo can prove it holds the same file ───────── */

const checksum = createHash('sha256').update(read('design-tokens.json')).digest('hex');

/* ── Report ───────────────────────────────────────────────────────────── */

if (failures.length > 0) {
  console.error('\n[design-tokens] this repo has drifted from design-tokens.json:\n');
  for (const f of failures) console.error(`  - ${f}`);
  console.error('\nEither correct the value above, or change design-tokens.json and');
  console.error('carry the same change to genosys-mobile-app.\n');
  process.exit(1);
}

const countOf = (group) => Object.keys(group).filter((k) => !k.startsWith('$')).length;
const count = countOf(tokens.color) + countOf(tokens.status) + countOf(tokens.brand);
console.log(`[design-tokens] ${count} colours and the eyebrow match design-tokens.json`);
console.log(`[design-tokens] v${tokens.version} sha256 ${checksum.slice(0, 16)}`);
console.log('[design-tokens] genosys-mobile-app must report the same version and sha256');
