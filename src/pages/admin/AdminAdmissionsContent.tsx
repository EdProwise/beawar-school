import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Save, GripVertical } from "lucide-react";

export default function AdminAdmissionsContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Steps State
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<any>(null);
  const [stepForm, setStepForm] = useState({ step_number: 1, title: "", description: "", icon_name: "CheckCircle" });

  // FAQ State
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });

  // Fetch Data
  const { data: steps = [], isLoading: stepsLoading } = useQuery({
    queryKey: ["admin-admission-steps"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admission_steps").select("*").order("step_number");
      if (error) throw error;
      return data;
    },
  });

  const { data: faqs = [], isLoading: faqsLoading } = useQuery({
    queryKey: ["admin-admission-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admission_faqs").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  // Step Mutations
  const saveStepMutation = useMutation({
    mutationFn: async (data: typeof stepForm) => {
      if (editingStep) {
        const { error } = await supabase.from("admission_steps").update(data).eq("id", editingStep.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("admission_steps").insert([{ ...data, is_active: true }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-admission-steps"] });
      toast({ title: editingStep ? "Step updated!" : "Step added!" });
      resetStepForm();
    },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const deleteStepMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("admission_steps").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-admission-steps"] });
      toast({ title: "Step deleted!" });
    },
  });

  // FAQ Mutations
  const saveFaqMutation = useMutation({
    mutationFn: async (data: typeof faqForm) => {
      if (editingFaq) {
        const { error } = await supabase.from("admission_faqs").update(data).eq("id", editingFaq.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("admission_faqs").insert([{ ...data, is_active: true, sort_order: faqs.length }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-admission-faqs"] });
      toast({ title: editingFaq ? "FAQ updated!" : "FAQ added!" });
      resetFaqForm();
    },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const deleteFaqMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("admission_faqs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-admission-faqs"] });
      toast({ title: "FAQ deleted!" });
    },
  });

  const resetStepForm = () => {
    setStepForm({ step_number: steps.length + 1, title: "", description: "", icon_name: "CheckCircle" });
    setEditingStep(null);
    setStepDialogOpen(false);
  };

  const resetFaqForm = () => {
    setFaqForm({ question: "", answer: "" });
    setEditingFaq(null);
    setFaqDialogOpen(false);
  };

  const handleEditStep = (step: any) => {
    setEditingStep(step);
    setStepForm({
      step_number: step.step_number,
      title: step.title,
      description: step.description || "",
      icon_name: step.icon_name || "CheckCircle",
    });
    setStepDialogOpen(true);
  };

  const handleEditFaq = (faq: any) => {
    setEditingFaq(faq);
    setFaqForm({ question: faq.question, answer: faq.answer });
    setFaqDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admissions Page Content</h1>
        <p className="text-muted-foreground">Manage admission steps, requirements, and FAQs</p>
      </div>

      <Tabs defaultValue="steps" className="space-y-6">
        <TabsList>
          <TabsTrigger value="steps">Admission Steps</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        {/* Steps Tab */}
        <TabsContent value="steps" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Admission Process Steps</h2>
            <Dialog open={stepDialogOpen} onOpenChange={setStepDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetStepForm(); setStepDialogOpen(true); }}>
                  <Plus className="w-4 h-4" /> Add Step
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingStep ? "Edit Step" : "Add New Step"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); saveStepMutation.mutate(stepForm); }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Step Number</Label>
                      <Input
                        type="number"
                        value={stepForm.step_number}
                        onChange={(e) => setStepForm({ ...stepForm, step_number: parseInt(e.target.value) || 1 })}
                        min={1}
                      />
                    </div>
                    <div>
                      <Label>Icon Name</Label>
                      <Input
                        value={stepForm.icon_name}
                        onChange={(e) => setStepForm({ ...stepForm, icon_name: e.target.value })}
                        placeholder="e.g., FileText, Users"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={stepForm.title}
                      onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={stepForm.description}
                      onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={resetStepForm}>Cancel</Button>
                    <Button type="submit" disabled={saveStepMutation.isPending}>
                      {saveStepMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                      {editingStep ? "Update" : "Add"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {stepsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-3">
              {steps.map((step: any) => (
                <div key={step.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {step.step_number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    {step.description && <p className="text-sm text-muted-foreground">{step.description}</p>}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditStep(step)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteStepMutation.mutate(step.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {steps.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No steps yet. Add your first admission step.</div>
              )}
            </div>
          )}
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetFaqForm(); setFaqDialogOpen(true); }}>
                  <Plus className="w-4 h-4" /> Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); saveFaqMutation.mutate(faqForm); }} className="space-y-4">
                  <div>
                    <Label>Question *</Label>
                    <Input
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Answer *</Label>
                    <Textarea
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={resetFaqForm}>Cancel</Button>
                    <Button type="submit" disabled={saveFaqMutation.isPending}>
                      {saveFaqMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                      {editingFaq ? "Update" : "Add"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {faqsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq: any, index: number) => (
                <div key={faq.id} className="bg-card rounded-xl border border-border p-4 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        <span className="text-primary mr-2">Q{index + 1}.</span>
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditFaq(faq)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteFaqMutation.mutate(faq.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {faqs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No FAQs yet. Add your first FAQ.</div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
