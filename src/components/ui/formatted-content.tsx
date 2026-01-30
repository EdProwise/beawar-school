
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
        className={cn("prose prose-slate max-w-none prose-p:leading-relaxed break-words", className)}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  }

  // Handle plain text with newlines - preserving all spacing
  return (
    <div className={cn("whitespace-pre-wrap break-words leading-relaxed text-muted-foreground", className)}>
      {content}
    </div>
  );
}
