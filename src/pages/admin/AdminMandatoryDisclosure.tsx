import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, FileText, Image, GripVertical, Eye, EyeOff, AlertCircle, FileCheck } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/mongodb/client";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/admin/FileUpload";
import { cn } from "@/lib/utils";

interface DisclosureDoc {
  id: string;
  name: string;
  file_url: string;
  file_type: "image" | "document";
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
}

function getFileType(url: string): "image" | "document" {
  return isImageUrl(url) ? "image" : "document";
}

export default function AdminMandatoryDisclosure() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DisclosureDoc | null>(null);
  const [form, setForm] = useState({ name: "", file_url: "", is_published: true });

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["admin-mandatory-disclosure"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mandatory_disclosures")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []) as DisclosureDoc[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<DisclosureDoc>) => {
      if (editingItem) {
        const { error } = await supabase
          .from("mandatory_disclosures")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("mandatory_disclosures").insert({
          ...payload,
          sort_order: docs.length + 1,
          is_published: true,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-mandatory-disclosure"] });
      toast({ title: editingItem ? "Document updated" : "Document added" });
      closeModal();
    },
    onError: (e: any) => toast({ title: "Error: " + e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("mandatory_disclosures").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-mandatory-disclosure"] });
      toast({ title: "Document deleted" });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from("mandatory_disclosures")
        .update({ is_published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-mandatory-disclosure"] }),
  });

  const openAdd = () => {
    setEditingItem(null);
    setForm({ name: "", file_url: "", is_published: true });
    setIsModalOpen(true);
  };

  const openEdit = (doc: DisclosureDoc) => {
    setEditingItem(doc);
    setForm({ name: doc.name, file_url: doc.file_url, is_published: doc.is_published });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Document name is required", variant: "destructive" });
      return;
    }
    if (!form.file_url) {
      toast({ title: "Please upload a file", variant: "destructive" });
      return;
    }
    saveMutation.mutate({
      name: form.name.trim(),
      file_url: form.file_url,
      file_type: getFileType(form.file_url),
      is_published: form.is_published,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-primary" />
              Mandatory Disclosure
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Upload documents required by the School Board for public disclosure
            </p>
          </div>
          <Button onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Document
          </Button>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
          <p>
            Upload documents such as CBSE / Board affiliation certificate, recognition certificate,
            NOC from State/UT, building safety certificate, fee structure, annual academic calendar, etc.
            These are displayed publicly in the Mandatory Disclosure page.
          </p>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : docs.length === 0 ? (
          <div className="py-16 text-center bg-card border border-dashed border-border rounded-2xl">
            <FileCheck className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No documents added yet.</p>
            <Button variant="outline" className="mt-4" onClick={openAdd}>
              <Plus className="w-4 h-4 mr-2" /> Add First Document
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-10">#</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Document Name</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold hidden md:table-cell">File</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Status</th>
                  <th className="text-right px-4 py-3 text-muted-foreground font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, idx) => (
                  <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{doc.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {doc.file_url ? (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary hover:underline text-xs"
                        >
                          {isImageUrl(doc.file_url) ? (
                            <Image className="w-3.5 h-3.5" />
                          ) : (
                            <FileText className="w-3.5 h-3.5" />
                          )}
                          View File
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                        isImageUrl(doc.file_url)
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                      )}>
                        {isImageUrl(doc.file_url) ? (
                          <><Image className="w-3 h-3" /> Image</>
                        ) : (
                          <><FileText className="w-3 h-3" /> Document</>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePublishMutation.mutate({ id: doc.id, is_published: !doc.is_published })}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors",
                          doc.is_published
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        )}
                      >
                        {doc.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {doc.is_published ? "Published" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(doc)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (confirm("Delete this document?")) deleteMutation.mutate(doc.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-heading font-bold text-lg">
                {editingItem ? "Edit Document" : "Add Document"}
              </h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Document Name */}
              <div className="space-y-2">
                <Label htmlFor="doc-name">Document Name <span className="text-destructive">*</span></Label>
                <Input
                  id="doc-name"
                  placeholder="e.g. CBSE Affiliation Certificate"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload File <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground">Supports images (JPG, PNG, WebP) and documents (PDF, DOC, DOCX)</p>
                <FileUpload
                  accept="all"
                  currentUrl={form.file_url}
                  onUpload={(url) => setForm({ ...form, file_url: url })}
                />
              </div>

              {/* Visibility */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is-published"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <Label htmlFor="is-published" className="cursor-pointer">Publish (visible on website)</Label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingItem ? "Save Changes" : "Add Document"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
