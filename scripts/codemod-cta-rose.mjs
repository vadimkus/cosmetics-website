/**
 * Repaint primary buttons from ink to the rose CTA.
 *
 * `--cera-ink` does two jobs on this site: it is the heading colour *and* it
 * filled every primary button. Only the second becomes rose, so the swap has to
 * be able to tell them apart. The tell is reliable: a filled button is the one
 * with white text on it.
 *
 *   bg-[var(--cera-ink)] text-white              -> bg-[var(--cera-cta)] text-white
 *   hover:bg-[var(--cera-ink)] hover:text-white  -> hover:bg-[var(--cera-cta)] ...
 *
 * Headings, dark panels and anything else carrying `--cera-ink` are untouched,
 * because none of them pair it with white text in the same class string.
 *
 * Two follow-on fixes inside a string that changed:
 *
 *   hover:bg-black   -> hover:bg-[var(--cera-rose-ink)]   a rose button that
 *   active:bg-black  -> active:bg-[var(--cera-rose-ink)]  darkens to black on
 *                                                         press looks broken;
 *                                                         roseInk is the same
 *                                                         family, one step down
 *
 *   border-[var(--cera-ink)] -> border-[var(--cera-cta)]  an outlined button
 *                                                         whose hover fill is
 *                                                         rose needs a rose edge
 *
 * Text stays ink wherever it sits on cream: the CTA rose is 4.27:1 there and
 * fails, which is the whole reason there are two tones.
 *
 *   node scripts/codemod-cta-rose.mjs           report
 *   node scripts/codemod-cta-rose.mjs --apply   write
 */
import fs from 'fs';
import path from 'path';

const apply = process.argv.includes('--apply');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIRS = ['app', 'components'];
const EXTS = ['.tsx', '.ts', '.jsx', '.js'];

const INK = 'var(--cera-ink)';
const CTA = 'var(--cera-cta)';
const ROSE_INK = 'var(--cera-rose-ink)';

/**
 * A dark panel rather than a button.
 *
 * White text on ink is the tell for a filled button, but a full-bleed hero
 * section carries the same pair. Repainting those turns whole blocks of the
 * page rose, which is a far louder change than repainting a control, so they
 * are left alone. A button gives itself away with a label weight or a tap
 * target; a panel is just a large rounded container.
 */
function isPanel(chunk) {
  const container = /<section|rounded-3xl|rounded-2xl/.test(chunk);
  const control = /font-semibold|font-medium|min-h-1[12]|<button|onClick/.test(chunk);
  return container && !control;
}

/** One class string, e.g. the contents of a className or a ternary branch. */
function repaint(chunk) {
  if (!chunk.includes(`bg-[${INK}]`)) return chunk;
  if (isPanel(chunk)) return chunk;

  // The lead has to allow a quote and a brace, not only whitespace: a ternary
  // branch starts its class string immediately after one, and requiring a space
  // silently skipped every `? 'bg-[var(--cera-ink)] text-white'` on the site.
  const fills = /(^|[\s'"`{])(hover:|active:|focus:)?bg-\[var\(--cera-ink\)\]/g;
  let out = chunk;
  let touched = false;

  // A fill only becomes rose when white text sits on it in the same string.
  out = out.replace(fills, (match, lead, state = '') => {
    const wantsWhite = state
      ? chunk.includes(`${state}text-white`)
      : /(^|\s)text-white/.test(chunk);
    if (!wantsWhite) return match;
    touched = true;
    return `${lead}${state}bg-[${CTA}]`;
  });

  if (!touched) return chunk;

  out = out
    .replace(/hover:bg-black\b/g, `hover:bg-[${ROSE_INK}]`)
    .replace(/active:bg-black\b/g, `active:bg-[${ROSE_INK}]`)
    .replace(/(^|[\s'"`{])border-\[var\(--cera-ink\)\]/g, `$1border-[${CTA}]`);

  return out;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXTS.includes(path.extname(entry.name))) out.push(full);
  }
  return out;
}

let files = 0;
let lines = 0;

for (const dir of DIRS) {
  for (const file of walk(path.join(root, dir))) {
    const before = fs.readFileSync(file, 'utf8');
    if (!before.includes(`bg-[${INK}]`)) continue;

    // Line by line: a class string never spans one, and this keeps each
    // decision scoped to the classes actually sitting together.
    const after = before
      .split('\n')
      .map((line) => repaint(line))
      .join('\n');

    if (after === before) continue;

    files += 1;
    const b = before.split('\n');
    const a = after.split('\n');
    const changed = [];
    for (let i = 0; i < b.length; i++) if (b[i] !== a[i]) changed.push(i + 1);
    lines += changed.length;

    console.log(`${path.relative(root, file)}  (${changed.length})`);
    for (const n of changed.slice(0, 2)) {
      console.log(`   ${n}  ${a[n - 1].trim().slice(0, 130)}`);
    }

    if (apply) fs.writeFileSync(file, after);
  }
}

console.log(`\n${files} file(s), ${lines} line(s)` + (apply ? ' written.' : '. Dry run.'));
