
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
              className={cn("prose prose-slate max-w-none prose-p:leading-relaxed whitespace-normal", className)}
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          );
        }
    
        // Handle plain text with newlines
        return (
          <div className={cn("space-y-4 whitespace-normal", className)}>
      {content.split('\n').filter(p => p.trim()).map((paragraph, index) => (
        <p key={index} className="leading-relaxed text-muted-foreground">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
