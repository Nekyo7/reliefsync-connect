import { Heart, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t bg-foreground text-background">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
              <Heart className="h-4 w-4 text-secondary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold">ReliefSync</span>
          </div>
          <p className="text-sm opacity-70">
            Coordinating community relief efforts through technology and compassion.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-3">Platform</h4>
          <div className="space-y-2 text-sm opacity-70">
            <Link to="/feed" className="block hover:opacity-100">Priority Feed</Link>
            <Link to="/map" className="block hover:opacity-100">Map View</Link>
            <Link to="/dashboard" className="block hover:opacity-100">Dashboard</Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-3">Resources</h4>
          <div className="space-y-2 text-sm opacity-70">
            <Link to="/about" className="block hover:opacity-100">About Us</Link>
            <Link to="/contact" className="block hover:opacity-100">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-3">Contact</h4>
          <div className="space-y-2 text-sm opacity-70">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@reliefsync.org</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Global Operations</div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-background/20 text-center text-sm opacity-50">
        © {new Date().getFullYear()} ReliefSync. All rights reserved.
      </div>
    </div>
  </footer>
);
