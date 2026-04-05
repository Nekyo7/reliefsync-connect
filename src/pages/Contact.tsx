import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent", description: "We'll get back to you soon!" });
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h1 className="font-heading text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-primary-foreground/80">Get in touch with the ReliefSync team</p>
        </div>
      </section>

      <div className="container py-16 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required />
            </div>
            <Button type="submit" size="lg">Send Message</Button>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold mb-6">Get in Touch</h2>
          {[
            { icon: Mail, label: "Email", value: "info@reliefsync.org" },
            { icon: MapPin, label: "Location", value: "Global Operations" },
            { icon: Phone, label: "Phone", value: "+1 (555) 000-0000" },
          ].map((c, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl border bg-card p-4 shadow-[var(--card-shadow)]">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{c.label}</p>
                <p className="text-sm text-muted-foreground">{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
