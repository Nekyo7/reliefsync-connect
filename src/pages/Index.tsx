import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Zap, Shield, MapPin, BarChart3, Heart } from "lucide-react";
import heroCommunity from "@/assets/hero-community.jpg";
import childrenHope from "@/assets/children-hope.jpg";
import volunteersAction from "@/assets/volunteers-action.jpg";
import waterDistribution from "@/assets/water-distribution.jpg";
import communityCenter from "@/assets/community-center.jpg";
import medicalRelief from "@/assets/medical-relief.jpg";
import shelterBuilding from "@/assets/shelter-building.jpg";
import foodDistribution from "@/assets/food-distribution.jpg";

const Index = () => {
  const stats = [
    { label: "Tasks Coordinated", value: "2,450+" },
    { label: "Volunteers Active", value: "890+" },
    { label: "Communities Served", value: "120+" },
    { label: "Countries", value: "18" },
  ];

  const features = [
    { icon: Zap, title: "Real-Time Processing", description: "Automated pipeline scores and prioritizes incoming relief needs within seconds." },
    { icon: Users, title: "Smart Matching", description: "AI-driven volunteer matching based on skills, proximity, and availability." },
    { icon: Shield, title: "Verified Reports", description: "NGO submissions auto-verified. Public reports reviewed by coordinators." },
    { icon: MapPin, title: "Map Intelligence", description: "Visual mapping of all active needs with urgency-coded markers." },
    { icon: BarChart3, title: "Impact Analytics", description: "Track completion rates, response times, and community impact metrics." },
    { icon: Heart, title: "Feedback Loop", description: "Continuous improvement through volunteer feedback and difficulty ratings." },
  ];

  const solutions = [
    { image: childrenHope, title: "Education & Child Welfare", description: "Supporting schools, learning materials, and safe spaces for children in crisis zones." },
    { image: shelterBuilding, title: "Shelter & Infrastructure", description: "Coordinating construction of temporary shelters and rebuilding damaged infrastructure." },
    { image: waterDistribution, title: "Water & Sanitation", description: "Connecting communities with clean water access and sanitation facilities." },
    { image: foodDistribution, title: "Food & Nutrition", description: "Organizing food drives and ensuring nutritional support reaches every family." },
  ];

  const stories = [
    { image: communityCenter, title: "Community Center Revival", location: "Philippines", quote: "ReliefSync helped us coordinate 40 volunteers to rebuild our community center in just 3 weeks." },
    { image: medicalRelief, title: "Rural Health Outreach", location: "East Africa", quote: "Medical teams reached 500+ families in remote villages through coordinated relief efforts." },
    { image: volunteersAction, title: "Disaster Response", location: "South Asia", quote: "Within hours of the flood, volunteers were matched and deployed to the hardest-hit areas." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroCommunity} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className="container relative z-10 grid gap-8 lg:grid-cols-2 items-center py-16">
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight">
              Give Hope.<br />
              <span className="text-secondary">Deliver Relief.</span>
            </h1>
            <p className="text-lg text-background/80 max-w-lg">
              ReliefSync transforms scattered community needs into prioritized, actionable tasks — connecting volunteers with the people who need them most.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/feed">
                <Button variant="hero" size="xl">
                  View Live Feed <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => window.open("https://forms.gle/cyKNuAT1xawVAbVT8", "_blank")}
                >
                  Become a Volunteer
                </Button>
                <Button
                  variant="hero-outline"
                  size="xl"
                  onClick={() => window.open("https://forms.gle/LA7jSWb4jtDwP9iz8", "_blank")}
                >
                  Register NGO / Post a Need
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">How It Works</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Delivering Solutions That Matter
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              From data ingestion to task completion, ReliefSync automates the entire relief coordination pipeline.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="group rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-1">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions - now 4 cards */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Our Impact</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Helping Others Improves the World
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {solutions.map((s, i) => (
              <div key={i} className="group rounded-xl overflow-hidden bg-card shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={s.image} alt={s.title} loading="lazy" width={640} height={480} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-base font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories / Testimonials - NEW section with images */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Real Stories</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Voices from the Field
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {stories.map((s, i) => (
              <div key={i} className="rounded-xl overflow-hidden border bg-card">
                <div className="aspect-video overflow-hidden">
                  <img src={s.image} alt={s.title} loading="lazy" width={640} height={360} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="text-xs font-medium text-secondary uppercase tracking-wider mb-2">{s.location}</div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground italic">"{s.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - image background instead of solid green */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <img src={communityCenter} alt="" loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/80" />
        </div>
        <div className="container relative z-10 text-center max-w-2xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-background">
            Ready to Make a Difference?
          </h2>
          <p className="text-background/80 mb-8">
            Join thousands of volunteers and coordinators using ReliefSync to deliver hope where it's needed most.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="hero"
              size="xl"
              onClick={() => window.open("https://forms.gle/cyKNuAT1xawVAbVT8", "_blank")}
            >
              Become a Volunteer
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              onClick={() => window.open("https://forms.gle/LA7jSWb4jtDwP9iz8", "_blank")}
            >
              Register NGO / Post a Need
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
