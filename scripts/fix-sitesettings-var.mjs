import fs from 'fs';
import path from 'path';

const dir = 'src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const fp = path.join(dir, file);
  const content = fs.readFileSync(fp, 'utf8');

  // Detect which variable name is used for useSiteSettings
  const siteSettingsMatch = content.match(/const \{ data: (\w+) \} = useSiteSettings\(\)/);
  if (!siteSettingsMatch) continue;

  const varName = siteSettingsMatch[1]; // e.g. "siteSettings" or "settings"

  // Find the siteUrl line and check if the variable used there matches
  const siteUrlLine = content.match(/const siteUrl = (\w+)\?\.site_url/);
  if (!siteUrlLine) continue;

  const usedVar = siteUrlLine[1];
  if (usedVar === varName) continue; // already correct

  // Fix the mismatch
  const fixed = content.replace(
    `const siteUrl = ${usedVar}?.site_url`,
    `const siteUrl = ${varName}?.site_url`
  );

  fs.writeFileSync(fp, fixed, 'utf8');
  console.log(`Fixed ${file}: ${usedVar} -> ${varName}`);
}

console.log('Done.');
