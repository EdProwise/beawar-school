
import { cn } from "@/lib/utils";

interface FormattedContentProps {
  content: string;
  className?: string;
}

/**
 * Cleans Quill-editor HTML using DOMParser so no word-breaks survive.
 *
 * Quill can store content with:
 *  - <br> tags inside words (Shift+Enter mid-word)
 *  - Zero-width spaces / soft-hyphens inserted by the caret
 *  - Consecutive <p> tags split at visual line boundaries
 *  - ql-align-justify classes that cause text-align:justify
 *  - Inline style attributes with word-break / overflow-wrap
 *
 * All of those are fixed here at the DOM level before rendering.
 */
function cleanQuillHtml(html: string): string {
  if (typeof window === "undefined") {
    // SSR fallback – strip obvious problems with regex
    return html
      .replace(/\s+style="[^"]*"/gi, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/\u00A0/g, " ")
      .replace(/\u200B|\u00AD|\uFEFF/g, "");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  // ── 1. Remove all inline style attributes ──────────────────────────────
  body.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));

  // ── 2. Remove Quill alignment classes (ql-align-justify causes justify) ─
  body.querySelectorAll("[class]").forEach((el) => {
    const cls = el.getAttribute("class") || "";
    const filtered = cls
      .split(/\s+/)
      .filter((c) => !c.startsWith("ql-"))
      .join(" ")
      .trim();
    if (filtered) {
      el.setAttribute("class", filtered);
    } else {
      el.removeAttribute("class");
    }
  });

  // ── 3. Strip zero-width / invisible break characters from text nodes ────
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null);
  const textNodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) textNodes.push(n as Text);
  textNodes.forEach((tn) => {
    if (tn.textContent) {
      // Replace non-breaking spaces (&nbsp; → \u00A0) with regular spaces
      // so the browser can wrap text normally
      tn.textContent = tn.textContent.replace(/\u00A0/g, " ");
      // Remove: zero-width space, soft-hyphen, zero-width non-joiner,
      //         zero-width joiner, word joiner, BOM, line/para separators
      tn.textContent = tn.textContent.replace(
        /[\u200B\u200C\u200D\u00AD\u2060\uFEFF\u2028\u2029]/g,
        ""
      );
    }
  });

  // ── 4. Give empty <p> tags a <br> so they have line-box height ──────────
  // An empty <p></p> has zero height and its margins collapse through it,
  // so it produces no extra visual spacing. Adding <br> gives it a line-box.
  body.querySelectorAll("p").forEach((p) => {
    if (p.innerHTML.trim() === "") {
      p.appendChild(doc.createElement("br"));
    }
  });

  return body.innerHTML;
}

export function FormattedContent({ content, className }: FormattedContentProps) {
  if (!content) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    const cleaned = cleanQuillHtml(content);

    return (
      <div
        className={cn(
          "prose prose-slate max-w-none prose-p:leading-relaxed",
          "[&_img]:max-w-full [&_img]:h-auto",
          "[&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full",
          "[&_iframe]:max-w-full [&_iframe]:h-auto",
          "[&_pre]:overflow-x-auto [&_pre]:max-w-full",
          "[&_video]:max-w-full [&_video]:h-auto",
          className
        )}
        style={{
          wordBreak: "normal",
          overflowWrap: "break-word",
          hyphens: "none",
          whiteSpace: "normal",
        }}
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
    );
  }

  return (
    <div className={cn("whitespace-pre-wrap leading-relaxed text-muted-foreground", className)}>
      {content}
    </div>
  );
}
