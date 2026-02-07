import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, ScrollText, Palette, Save } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-school-data";

interface ScrollWord {
  id: string;
  text: string;
  is_active: boolean;
  sort_order: number;
}

export default function AdminScrollWords() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScrollWord | null>(null);
  const [formData, setFormData] = useState({
    text: "",
    is_active: true,
  });

  const { data: settings } = useSiteSettings();
  const [tickerBg, setTickerBg] = useState("#4C0DC9");
  const [tickerText, setTickerText] = useState("#FFFFFF");

  useEffect(() => {
    if (settings) {
      if (settings.ticker_bg_color) setTickerBg(settings.ticker_bg_color);
      if (settings.ticker_text_color) setTickerText(settings.ticker_text_color);
    }
  }, [settings]);

  const { data: words = [], isLoading } = useQuery({
    queryKey: ["admin-scroll-words"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scroll_words")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ScrollWord[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<ScrollWord>) => {
      if (editingItem) {
        const { error } = await supabase.from("scroll_words").update(data).eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("scroll_words").insert([{ ...data, sort_order: words.length }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-scroll-words"] });
      queryClient.invalidateQueries({ queryKey: ["scroll-words"] });
      toast({ title: editingItem ? "Word updated!" : "Word added!" });
      resetForm();
    },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("site_settings")
        .update({
          ticker_bg_color: tickerBg,
          ticker_text_color: tickerText
        })
        .eq("id", settings?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Ticker appearance saved!" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("scroll_words").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-scroll-words"] });
      queryClient.invalidateQueries({ queryKey: ["scroll-words"] });
      toast({ title: "Word deleted!" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("scroll_words").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-scroll-words"] });
      queryClient.invalidateQueries({ queryKey: ["scroll-words"] });
    },
  });

  const resetForm = () => {
    setFormData({ text: "", is_active: true });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: ScrollWord) => {
    setEditingItem(item);
    setFormData({
      text: item.text,
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) return;
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scroll Words</h1>
          <p className="text-muted-foreground">Manage words that scroll below the navigation menu</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4" />
              Add Word
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Word" : "Add New Word"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="text">Word/Phrase *</Label>
                <Input
                  id="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="e.g., Admissions Open 2024-25"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingItem ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-6 py-4 text-sm font-semibold">Word / Phrase</th>
                  <th className="px-6 py-4 text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {words.map((item) => (
                  <tr key={item.id} className="group hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ScrollText className="w-4 h-4 text-primary" />
                        <span className="font-medium">{item.text}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={(checked) => toggleMutation.mutate({ id: item.id, is_active: checked })}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this word?")) {
                              deleteMutation.mutate(item.id);
                            }
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
            {words.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No scroll words yet. Add your first word to show in the ticker.
              </div>
            )}
          </div>
        </div>

        {/* Ticker Appearance Settings */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm h-fit space-y-6">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Ticker Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={tickerBg} 
                  onChange={(e) => setTickerBg(e.target.value)}
                  className="w-10 h-10 rounded border border-border cursor-pointer"
                />
                <Input value={tickerBg} onChange={(e) => setTickerBg(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={tickerText} 
                  onChange={(e) => setTickerText(e.target.value)}
                  className="w-10 h-10 rounded border border-border cursor-pointer"
                />
                <Input value={tickerText} onChange={(e) => setTickerText(e.target.value)} />
              </div>
            </div>

            <div className="pt-4">
              <Label className="text-xs text-muted-foreground mb-2 block">PREVIEW</Label>
              <div 
                className="p-4 rounded-lg border border-border flex items-center justify-center font-bold overflow-hidden"
                style={{ backgroundColor: tickerBg, color: tickerText }}
              >
                SCROLLING WORD PREVIEW
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={() => saveSettingsMutation.mutate()}
              disabled={saveSettingsMutation.isPending}
            >
              {saveSettingsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Appearance
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
