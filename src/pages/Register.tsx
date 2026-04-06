import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Volunteer specifics
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");

  // NGO specifics
  const [orgName, setOrgName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'volunteer',
            location,
            skills: skills.split(',').map(s => s.trim()),
          }
        }
      });
      if (error) throw error;
      toast({ title: "Success!", description: "Volunteer account created successfully." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNGOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            organization_name: orgName,
            role: 'ngo'
          }
        }
      });
      if (error) throw error;
      toast({ title: "Success!", description: "NGO account created successfully." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground">ReliefSync</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-foreground">Join ReliefSync</h1>
          <p className="text-muted-foreground mt-1">Create your account and start making a difference</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-[var(--card-shadow)]">
          <Tabs defaultValue="volunteer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
              <TabsTrigger value="ngo">NGO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="volunteer">
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="v-name">Full Name</Label>
                  <Input id="v-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
                </div>
                <div>
                  <Label htmlFor="v-email">Email</Label>
                  <Input id="v-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div>
                  <Label htmlFor="v-location">Location (City area)</Label>
                  <Input id="v-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Whitefield" required />
                </div>
                <div>
                  <Label htmlFor="v-skills">Skills</Label>
                  <Input id="v-skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. Logistics, Medical, Heavy Lifting" />
                </div>
                <div>
                  <Label htmlFor="v-password">Password</Label>
                  <Input id="v-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Join as Volunteer"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="ngo">
              <form onSubmit={handleNGOSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="n-org">Organization Name</Label>
                  <Input id="n-org" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g. Red Cross" required />
                </div>
                <div>
                  <Label htmlFor="n-name">Contact Person Full Name</Label>
                  <Input id="n-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
                </div>
                <div>
                  <Label htmlFor="n-email">Organization Email</Label>
                  <Input id="n-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="org@example.com" required />
                </div>
                <div>
                  <Label htmlFor="n-password">Password</Label>
                  <Input id="n-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register NGO"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
          </div>

          <Button variant="outline" className="w-full" size="lg">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign up with Google
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
