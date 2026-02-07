import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Image, Video, FileText, Trash2, Copy, Upload, Loader2, Search, Check } from "lucide-react";

type MediaType = "image" | "video" | "document";

export default function AdminMedia() {
  const [activeTab, setActiveTab] = useState<MediaType>("image");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: media, isLoading } = useQuery({
    queryKey: ["media-library", activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_library")
        .select("*")
        .eq("file_type", activeTab)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, fileName, fileType }: { id: string; fileName: string; fileType: string }) => {
      const bucket = fileType === "image" ? "images" : fileType === "video" ? "videos" : "documents";
      
      // Delete from storage
      await supabase.storage.from(bucket).remove([fileName]);
      
      // Delete from database
      const { error } = await supabase.from("media_library").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-library"] });
      toast({ title: "File deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error deleting file", variant: "destructive" });
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const bucket = activeTab === "image" ? "images" : activeTab === "video" ? "videos" : "documents";
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        await supabase.from("media_library").insert({
          file_name: fileName,
          original_name: file.name,
          file_type: activeTab,
          file_url: publicUrl,
          file_size: file.size,
          mime_type: file.type,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["media-library"] });
      toast({ title: `${files.length} file(s) uploaded successfully!` });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast({ title: "URL copied to clipboard!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredMedia = media?.filter(item => 
    item.original_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAcceptTypes = () => {
    switch (activeTab) {
      case "image":
        return "image/jpeg,image/png,image/gif,image/webp,image/svg+xml";
      case "video":
        return "video/mp4,video/webm,video/ogg";
      case "document":
        return "application/pdf,.doc,.docx,.xls,.xlsx";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
            <p className="text-muted-foreground">Upload and manage images, videos, and documents</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MediaType)}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="image" className="gap-2">
                <Image className="w-4 h-4" />
                Images
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-2">
                <Video className="w-4 h-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="document" className="gap-2">
                <FileText className="w-4 h-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <label>
                <input
                  type="file"
                  accept={getAcceptTypes()}
                  onChange={handleUpload}
                  multiple
                  className="hidden"
                  disabled={uploading}
                />
                <Button asChild disabled={uploading}>
                  <span className="cursor-pointer">
                    {uploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Upload
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {["image", "video", "document"].map((type) => (
            <TabsContent key={type} value={type} className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredMedia?.length === 0 ? (
                <div className="text-center py-12 bg-secondary/30 rounded-xl border border-dashed border-border">
                  {type === "image" && <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />}
                  {type === "video" && <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />}
                  {type === "document" && <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />}
                  <p className="text-muted-foreground">
                    {searchQuery ? "No files match your search" : `No ${type}s uploaded yet`}
                  </p>
                  <label className="mt-4 inline-block">
                    <input
                      type="file"
                      accept={getAcceptTypes()}
                      onChange={handleUpload}
                      multiple
                      className="hidden"
                    />
                    <Button variant="outline" asChild>
                      <span className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload {type}s
                      </span>
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredMedia?.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors"
                    >
                      {/* Preview */}
                      <div className="aspect-square">
                        {type === "image" ? (
                          <img
                            src={item.file_url}
                            alt={item.original_name}
                            className="w-full h-full object-cover"
                          />
                        ) : type === "video" ? (
                          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                            <Video className="w-12 h-12 text-muted-foreground" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                            <FileText className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyToClipboard(item.file_url, item.id)}
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate({ 
                            id: item.id, 
                            fileName: item.file_name, 
                            fileType: item.file_type 
                          })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Info */}
                      <div className="p-2 border-t border-border">
                        <p className="text-xs font-medium truncate" title={item.original_name}>
                          {item.original_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.file_size && formatFileSize(item.file_size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
