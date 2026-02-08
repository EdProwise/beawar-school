import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, Image, Video, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUpload: (url: string) => void;
  onMultiUpload?: (urls: string[]) => void;
  accept?: "image" | "video" | "document" | "all" | "media";
  currentUrl?: string;
  currentUrls?: string[];
  className?: string;
  multiple?: boolean;
}

export function FileUpload({ 
  onUpload, 
  onMultiUpload,
  accept = "image", 
  currentUrl, 
  currentUrls = [],
  className,
  multiple = false
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [previews, setPreviews] = useState<string[]>(currentUrls);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Sync preview state with currentUrl prop changes
  useEffect(() => {
    setPreview(currentUrl || null);
  }, [currentUrl]);

  // Sync previews state with currentUrls prop changes
  useEffect(() => {
    setPreviews(currentUrls);
  }, [currentUrls]);

  const getAcceptTypes = () => {
    switch (accept) {
      case "image":
        return "image/jpeg,image/png,image/gif,image/webp,image/svg+xml";
      case "video":
        return "video/mp4,video/webm,video/ogg";
      case "media":
        return "image/jpeg,image/png,image/gif,image/webp,image/svg+xml,video/mp4,video/webm,video/ogg";
      case "document":
        return "application/pdf,.doc,.docx,.xls,.xlsx";
      case "all":
        return "image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx";
      default:
        return "image/*";
    }
  };

  const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        // Upload to local server using /api/storage/upload endpoint
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/storage/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        
        // The server returns the file path in result.data.path
        const publicUrl = `/uploads/${result.data.path}`;
        uploadedUrls.push(publicUrl);
      }

      if (multiple) {
        const newPreviews = [...previews, ...uploadedUrls];
        setPreviews(newPreviews);
        if (onMultiUpload) onMultiUpload(newPreviews);
        toast({ title: `${files.length} file(s) uploaded successfully!` });
      } else {
        const url = uploadedUrls[0];
        setPreview(url);
        onUpload(url);
        toast({ title: "File uploaded successfully!" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveMulti = (index: number) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    if (onMultiUpload) onMultiUpload(newPreviews);
  };

  const getIcon = () => {
    switch (accept) {
      case "video":
        return <Video className="w-8 h-8 text-muted-foreground" />;
      case "document":
        return <FileText className="w-8 h-8 text-muted-foreground" />;
      case "media":
        return <Image className="w-8 h-8 text-muted-foreground" />;
      default:
        return <Image className="w-8 h-8 text-muted-foreground" />;
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
        multiple={multiple}
      />

      {multiple && previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {previews.map((url, index) => (
              <div key={index} className="relative group aspect-square">
                {isVideoUrl(url) ? (
                  <video
                    src={url}
                    className="w-full h-full object-cover rounded-lg border border-border"
                    muted
                  />
                ) : (
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded-lg border border-border"
                  />
                )}
                {isVideoUrl(url) && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveMulti(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

      {preview && !multiple ? (
        <div className="relative group">
          {isVideoUrl(preview) ? (
            <video
              src={preview}
              className="w-full h-40 object-cover rounded-lg border border-border"
              muted
            />
          ) : preview.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || accept === "image" ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border border-border"
            />
          ) : (
            <div className="w-full h-40 flex items-center justify-center bg-secondary/30 rounded-lg border border-border">
              <div className="text-center">
                {accept === "video" ? <Video className="w-12 h-12 mx-auto text-muted-foreground mb-2" /> : <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2" />}
                <p className="text-sm text-muted-foreground truncate max-w-[200px] px-2">
                  {preview.split("/").pop()}
                </p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-secondary/30 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              {getIcon()}
                <span className="text-sm text-muted-foreground">
                  Click to upload {accept === "all" ? "file" : accept === "media" ? "image or video" : accept}{multiple ? "s" : ""}
                </span>
                <span className="text-xs text-muted-foreground/70">
                  {accept === "image" && "JPG, PNG, GIF, WebP, SVG"}
                  {accept === "video" && "MP4, WebM, OGG (max 100MB)"}
                  {accept === "media" && "Images (JPG, PNG, GIF, WebP) or Videos (MP4, WebM)"}
                  {accept === "document" && "PDF, DOC, DOCX, XLS, XLSX"}
                  {accept === "all" && "Images, Videos, Documents"}
                </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default FileUpload;
