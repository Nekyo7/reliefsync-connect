import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Zap, Shield, MapPin, BarChart3, Heart } from "lucide-react";
import heroCommunity from "@/assets/hero-community.jpg";
import childrenHope from "@/assets/children-hope.jpg";
import volunteersAction from "@/assets/volunteers-action.jpg";
import waterDistribution from "@/assets/water-distribution.jpg";

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
    { image: volunteersAction, title: "Shelter & Infrastructure", description: "Coordinating construction of temporary shelters and rebuilding damaged infrastructure." },
    { image: waterDistribution, title: "Water & Sanitation", description: "Connecting communities with clean water access and sanitation facilities." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-[var(--hero-gradient)]" />
        <div className="container relative z-10 grid gap-8 lg:grid-cols-2 items-center py-16">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/80 backdrop-blur-sm border border-primary-foreground/20">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Real-time Relief Coordination
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Give Hope.<br />
              <span className="text-secondary">Deliver Relief.</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-lg">
              ReliefSync transforms scattered community needs into prioritized, actionable tasks — connecting volunteers with the people who need them most.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/feed">
                <Button variant="hero" size="xl">
                  View Live Feed <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="hero-outline" size="xl">
                  Become a Volunteer
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src={heroCommunity} alt="Community volunteers distributing supplies" className="w-full h-[480px] object-cover" width={1280} height={720} />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-lg animate-slide-in">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-urgency-critical/15 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-urgency-critical" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">3 Critical Tasks</p>
                  <p className="text-xs text-muted-foreground">Awaiting volunteers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card py-12">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center animate-count-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="font-heading text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
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

      {/* Solutions */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Our Impact</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Helping Others Improves the World
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {solutions.map((s, i) => (
              <div key={i} className="group rounded-xl overflow-hidden bg-card shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={s.image} alt={s.title} loading="lazy" width={640} height={640} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center max-w-2xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Join thousands of volunteers and coordinators using ReliefSync to deliver hope where it's needed most.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register"><Button variant="hero" size="xl">Join as Volunteer</Button></Link>
            <Link to="/feed"><Button variant="hero-outline" size="xl">Explore Tasks</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
