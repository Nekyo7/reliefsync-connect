import { Heart, Users, Globe, Target } from "lucide-react";
import childrenHope from "@/assets/children-hope.jpg";
import medicalRelief from "@/assets/medical-relief.jpg";
import communityCenter from "@/assets/community-center.jpg";
import shelterBuilding from "@/assets/shelter-building.jpg";

const About = () => (
  <div className="min-h-screen bg-background">
    {/* Hero with image background */}
    <section className="relative py-24">
      <div className="absolute inset-0">
        <img src={shelterBuilding} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/75" />
      </div>
      <div className="container relative z-10 text-center max-w-3xl">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-background">About ReliefSync</h1>
        <p className="text-background/80 text-lg">
          We believe technology can transform how communities respond to crises. ReliefSync bridges the gap between those in need and those ready to help.
        </p>
      </div>
    </section>

    <section className="py-16">
      <div className="container grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            ReliefSync is a real-time coordination platform that aggregates community needs from NGOs and public submissions, processes them through an automated pipeline, and intelligently matches volunteers based on skills, location, and availability.
          </p>
          <p className="text-muted-foreground">
            We transform scattered reports into structured, ranked, and actionable tasks with full visibility for coordinators — ensuring no cry for help goes unanswered.
          </p>
        </div>
        <div className="rounded-xl overflow-hidden">
          <img src={childrenHope} alt="Children receiving aid" loading="lazy" width={640} height={480} className="w-full h-80 object-cover" />
        </div>
      </div>
    </section>

    {/* Team / Story section with images */}
    <section className="py-16">
      <div className="container grid gap-12 md:grid-cols-2 items-center">
        <div className="rounded-xl overflow-hidden md:order-first">
          <img src={communityCenter} alt="Community center volunteers" loading="lazy" width={640} height={480} className="w-full h-80 object-cover" />
        </div>
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Built by Communities</h2>
          <p className="text-muted-foreground mb-4">
            ReliefSync was born from first-hand experience in disaster response. We saw the chaos of uncoordinated efforts — duplicated work, missed needs, and wasted resources.
          </p>
          <p className="text-muted-foreground">
            Our platform ensures that every volunteer's time creates maximum impact, and every community need receives the attention it deserves.
          </p>
        </div>
      </div>
    </section>

    {/* Medical outreach image */}
    <section className="py-16">
      <div className="container grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Reaching Every Corner</h2>
          <p className="text-muted-foreground mb-4">
            From rural health clinics to urban food banks, ReliefSync connects relief efforts across diverse contexts. Our platform adapts to local needs while maintaining global coordination standards.
          </p>
          <p className="text-muted-foreground">
            We partner with NGOs, government agencies, and community organizations to ensure comprehensive coverage.
          </p>
        </div>
        <div className="rounded-xl overflow-hidden">
          <img src={medicalRelief} alt="Medical relief team in action" loading="lazy" width={640} height={480} className="w-full h-80 object-cover" />
        </div>
      </div>
    </section>

    <section className="py-16 bg-muted/50">
      <div className="container">
        <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: Heart, title: "Compassion", desc: "Every task represents a real person in need." },
            { icon: Target, title: "Precision", desc: "Data-driven prioritization ensures the most urgent needs come first." },
            { icon: Users, title: "Community", desc: "Built by and for communities worldwide." },
            { icon: Globe, title: "Global Reach", desc: "Operating across 18 countries with local impact." },
          ].map((v, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 text-center shadow-[var(--card-shadow)]">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
