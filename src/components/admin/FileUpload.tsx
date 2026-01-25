import { useState, useRef } from "react";
import { Upload, X, Loader2, Image, Video, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: "image" | "video" | "document" | "all";
  currentUrl?: string;
  className?: string;
}

export function FileUpload({ onUpload, accept = "image", currentUrl, className }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getAcceptTypes = () => {
    switch (accept) {
      case "image":
        return "image/jpeg,image/png,image/gif,image/webp,image/svg+xml";
      case "video":
        return "video/mp4,video/webm,video/ogg";
      case "document":
        return "application/pdf,.doc,.docx,.xls,.xlsx";
      case "all":
        return "image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx";
      default:
        return "image/*";
    }
  };

  const getBucket = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "images";
    if (mimeType.startsWith("video/")) return "videos";
    return "documents";
  };

  const getFileType = (mimeType: string): "image" | "video" | "document" => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    return "document";
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const bucket = getBucket(file.type);
      const fileType = getFileType(file.type);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Save to media library
      await supabase.from("media_library").insert({
        file_name: fileName,
        original_name: file.name,
        file_type: fileType,
        file_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
      });

      setPreview(publicUrl);
      onUpload(publicUrl);
      toast({ title: "File uploaded successfully!" });
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

  const getIcon = () => {
    switch (accept) {
      case "video":
        return <Video className="w-8 h-8 text-muted-foreground" />;
      case "document":
        return <FileText className="w-8 h-8 text-muted-foreground" />;
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
      />

      {preview ? (
        <div className="relative group">
          {accept === "image" || (preview && preview.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) ? (
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
                Click to upload {accept === "all" ? "file" : accept}
              </span>
              <span className="text-xs text-muted-foreground/70">
                {accept === "image" && "JPG, PNG, GIF, WebP, SVG"}
                {accept === "video" && "MP4, WebM, OGG (max 100MB)"}
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
