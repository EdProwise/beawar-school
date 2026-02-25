import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const pagesDir = 'src/pages';
const files = readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = join(pagesDir, file);
  let content = readFileSync(filePath, 'utf8');

  // Only process files that use siteUrl in buildBreadcrumbSchema or buildOrganizationSchema
  if (!content.includes('buildBreadcrumbSchema(siteUrl') && !content.includes('buildOrganizationSchema(schoolName, siteUrl')) {
    continue;
  }

  // Skip if siteUrl is already declared
  if (/const siteUrl\s*=/.test(content)) {
    console.log(`Already has siteUrl: ${file}`);
    continue;
  }

  // Find where schoolName is declared and add siteUrl right after it
  // Pattern: const schoolName = settings?.school_name || "";
  if (/const schoolName\s*=/.test(content)) {
    content = content.replace(
      /(const schoolName\s*=\s*[^\n]+\n)/,
      `$1  const siteUrl = settings?.site_url || "";\n`
    );
    writeFileSync(filePath, content);
    console.log(`Fixed (after schoolName): ${file}`);
    continue;
  }

  // If no schoolName, find where settings is destructured/used and add after useSiteSettings call
  // Pattern: const { data: settings } = useSiteSettings();
  if (/const \{ data: settings \}\s*=\s*useSiteSettings\(\)/.test(content)) {
    content = content.replace(
      /(const \{ data: settings \}\s*=\s*useSiteSettings\(\);?\s*\n)/,
      `$1  const siteUrl = settings?.site_url || "";\n`
    );
    writeFileSync(filePath, content);
    console.log(`Fixed (after useSiteSettings): ${file}`);
    continue;
  }

  console.log(`SKIPPED (no insertion point found): ${file}`);
}

console.log('Done.');
