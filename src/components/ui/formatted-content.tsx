import React from "react";
import { cn } from "@/lib/utils";

interface FormattedContentProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

// Safe inline CSS properties we allow to pass through from the editor
const SAFE_STYLE_PROPS = new Set([
  'text-align', 'font-family', 'font-size', 'font-weight', 'font-style',
  'color', 'background-color', 'text-decoration',
  'padding-left', 'padding-right', 'margin-left', 'margin-right',
  'line-height', 'letter-spacing',
]);

function sanitizeStyle(style: string): string {
  // Keep only safe CSS properties
  return style
    .split(';')
    .map(s => s.trim())
    .filter(s => {
      if (!s) return false;
      const prop = s.split(':')[0]?.trim().toLowerCase();
      return prop ? SAFE_STYLE_PROPS.has(prop) : false;
    })
    .join('; ');
}

// Map ql-align-* classes to inline text-align styles and preserve ql-font-* classes
function processQuillHtml(html: string): string {
  if (typeof window === "undefined") {
    // SSR fallback
    return html
      .replace(/\u00A0/g, " ")
      .replace(/\u200B|\u00AD|\uFEFF/g, "");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  // Process all elements
  body.querySelectorAll("*").forEach((el: Element) => {
    const htmlEl = el as HTMLElement;

    // ── 1. Convert ql-align-* classes to inline text-align styles ───────────
    const cls = htmlEl.className || "";
    const alignMatch = cls.match(/\bql-align-(left|center|right|justify)\b/);
    if (alignMatch) {
      const existing = htmlEl.getAttribute("style") || "";
      const withoutAlign = existing.replace(/text-align\s*:[^;]+;?/gi, "").trim();
      htmlEl.setAttribute(
        "style",
        `${withoutAlign}${withoutAlign ? '; ' : ''}text-align: ${alignMatch[1]};`
      );
    }

    // ── 2. Convert ql-indent-* classes to padding-left ───────────────────────
    const indentMatch = cls.match(/\bql-indent-(\d+)\b/);
    if (indentMatch) {
      const level = parseInt(indentMatch[1]);
      const existing = htmlEl.getAttribute("style") || "";
      htmlEl.setAttribute("style", `${existing}; padding-left: ${level * 3}em;`);
    }

    // ── 3. Sanitize inline styles (keep safe properties only) ────────────────
    const inlineStyle = htmlEl.getAttribute("style");
    if (inlineStyle) {
      const sanitized = sanitizeStyle(inlineStyle);
      if (sanitized) {
        htmlEl.setAttribute("style", sanitized);
      } else {
        htmlEl.removeAttribute("style");
      }
    }

    // ── 4. Clean ql-* classes but KEEP ql-font-* and ql-size-* (mapped via CSS)
    if (htmlEl.className) {
      const classes = htmlEl.className
        .split(/\s+/)
        .filter(c =>
          !c.startsWith("ql-") ||
          c.startsWith("ql-font-") ||
          c.startsWith("ql-size-")
        )
        .join(" ")
        .trim();
      if (classes) htmlEl.setAttribute("class", classes);
      else htmlEl.removeAttribute("class");
    }
  });

  // ── 5. Strip zero-width / invisible break characters from text nodes ───────
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null);
  const textNodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) textNodes.push(n as Text);
  textNodes.forEach((tn) => {
    if (tn.textContent) {
      tn.textContent = tn.textContent
        .replace(/\u00A0/g, " ")
        .replace(/[\u200B\u200C\u200D\u00AD\u2060\uFEFF\u2028\u2029]/g, "");
    }
  });

  // ── 6. Give empty <p> tags a <br> so they have line-box height ─────────────
  body.querySelectorAll("p").forEach((p) => {
    if (p.innerHTML.trim() === "") {
      p.appendChild(doc.createElement("br"));
    }
  });

  return body.innerHTML;
}

export function FormattedContent({ content, className, style }: FormattedContentProps) {
  if (!content) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    const processed = processQuillHtml(content);

    return (
      <>
        {/* Font class CSS injected inline so it works everywhere including blog detail */}
        <style>{`
          .blog-content .ql-font-arial       { font-family: Arial, Helvetica, sans-serif !important; }
          .blog-content .ql-font-georgia     { font-family: Georgia, 'Times New Roman', serif !important; }
          .blog-content .ql-font-poppins     { font-family: 'Poppins', sans-serif !important; }
          .blog-content .ql-font-roboto      { font-family: 'Roboto', sans-serif !important; }
          .blog-content .ql-font-times-new-roman  { font-family: 'Times New Roman', Times, serif !important; }
          .blog-content .ql-font-courier-new { font-family: 'Courier New', Courier, monospace !important; }
          .blog-content .ql-font-verdana     { font-family: Verdana, Geneva, sans-serif !important; }
          .blog-content .ql-font-trebuchet-ms { font-family: 'Trebuchet MS', Helvetica, sans-serif !important; }
          .blog-content .ql-font-serif       { font-family: Georgia, serif !important; }
          .blog-content .ql-font-monospace   { font-family: 'Courier New', monospace !important; }

          /* ── Quill size classes ──────────────────────────────────────────── */
          .blog-content .ql-size-small  { font-size: 0.75em !important; }
          .blog-content .ql-size-large  { font-size: 1.5em  !important; }
          .blog-content .ql-size-huge   { font-size: 2.5em  !important; }

          .blog-content p, .blog-content li,
          .blog-content h1, .blog-content h2,
          .blog-content h3, .blog-content h4 {
            word-break: normal;
            overflow-wrap: break-word;
            hyphens: none;
          }

          .blog-content h1 { font-size: 2em; font-weight: 700; margin: 0.67em 0; }
          .blog-content h2 { font-size: 1.5em; font-weight: 600; margin: 0.75em 0; }
          .blog-content h3 { font-size: 1.25em; font-weight: 600; margin: 0.83em 0; }
          .blog-content h4 { font-size: 1.1em; font-weight: 600; margin: 0.9em 0; }
          .blog-content p  { margin: 0.5em 0; line-height: 1.8; }
          .blog-content ul, .blog-content ol { padding-left: 1.5em; margin: 0.5em 0; }
          .blog-content li { margin: 0.25em 0; }
          .blog-content blockquote {
            border-left: 4px solid hsl(var(--primary));
            padding: 0.75em 1em;
            margin: 1em 0;
            background: hsl(var(--muted) / 0.5);
            border-radius: 0 0.5em 0.5em 0;
            font-style: italic;
          }
          .blog-content pre {
            background: hsl(var(--muted));
            padding: 1em;
            border-radius: 0.5em;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
          }
          .blog-content img { max-width: 100%; height: auto; border-radius: 0.5em; }
          .blog-content a { color: hsl(var(--primary)); text-decoration: underline; }
          .blog-content strong { font-weight: 700; }
          .blog-content em { font-style: italic; }
          .blog-content u { text-decoration: underline; }
          .blog-content s { text-decoration: line-through; }
        `}</style>
        <div
          className={cn("blog-content", className)}
          style={{ wordBreak: "normal", overflowWrap: "break-word", hyphens: "none", ...style }}
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      </>
    );
  }

  return (
    <div
      className={cn("blog-content whitespace-pre-wrap leading-relaxed", className)}
      style={style}
    >
      {content}
    </div>
  );
}
