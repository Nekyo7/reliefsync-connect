import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/feed", label: "Priority Feed" },
    { to: "/map", label: "Map View" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">ReliefSync</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link to="/register">
            <Button variant="hero" size="sm">Get Started</Button>
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="flex-1"><Button variant="ghost" size="sm" className="w-full">Log In</Button></Link>
            <Link to="/register" className="flex-1"><Button variant="hero" size="sm" className="w-full">Get Started</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
};
