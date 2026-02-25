import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const dir = 'src/pages';
const files = readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(f => {
  const fp = join(dir, f);
  let c = readFileSync(fp, 'utf8');
  const orig = c;

  // Replace fallback hardcoded beawarschool.com with empty string
  c = c.replace(/\|\| "https:\/\/beawarschool\.com"/g, '|| ""');

  if (c !== orig) {
    writeFileSync(fp, c, 'utf8');
    console.log('Fixed: ' + f);
  }
});
console.log('Done');
