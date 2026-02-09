
import { cn } from "@/lib/utils";

interface FormattedContentProps {
  content: string;
  className?: string;
}

export function FormattedContent({ content, className }: FormattedContentProps) {
  if (!content) return null;

  // Check if content is already HTML
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

    if (isHtml) {
    return (
      <div 
        className={cn(
          "prose prose-slate max-w-none prose-p:leading-relaxed break-words [overflow-wrap:anywhere]",
          "[&_img]:max-w-full [&_img]:h-auto",
          "[&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full",
          "[&_iframe]:max-w-full [&_iframe]:h-auto",
          "[&_pre]:overflow-x-auto [&_pre]:max-w-full",
          "[&_video]:max-w-full [&_video]:h-auto",
          "[&>*]:max-w-full",
          "overflow-hidden",
          className
        )}
      >
          <style dangerouslySetInnerHTML={{ __html: `
            .prose p:empty::before {
              content: "";
              display: inline-block;
              height: 1em;
            }
            .prose p br:only-child {
              display: block;
              content: "";
              margin-bottom: 0.5em;
            }
            .prose p {
              margin-bottom: 1.25em;
              min-height: 1em;
            }
          `}} />
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

  // Handle plain text with newlines - preserving all spacing
  return (
    <div className={cn("whitespace-pre-wrap break-words leading-relaxed text-muted-foreground", className)}>
      {content}
    </div>
  );
}
