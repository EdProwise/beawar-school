import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const pagesDir = 'src/pages';
const files = readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

let total = 0;
for (const file of files) {
  const filePath = join(pagesDir, file);
  let content = readFileSync(filePath, 'utf8');
  const original = content;

  // Replace || "Orbit School" fallback
  content = content.replace(/\|\| "Orbit School"/g, '|| ""');
  // Replace || 'Orbit School' fallback
  content = content.replace(/\|\| 'Orbit School'/g, "|| ''");

  if (content !== original) {
    writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', file);
    total++;
  }
}
console.log(`Done. Fixed ${total} files.`);
