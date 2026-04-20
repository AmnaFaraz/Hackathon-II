"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Chat", href: "/chat" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "glass border-b border-border-primary" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Zap className="text-accent-primary group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold tracking-tight text-text-primary">
            Task<span className="text-accent-primary">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-medium transition-colors hover:text-accent-primary",
                pathname === link.href ? "text-accent-primary" : "text-text-secondary"
              )}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent-primary rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="px-5 py-2 bg-accent-primary text-bg-primary font-bold rounded-full text-sm btn-click hover:opacity-90"
          >
            Open App
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-b border-border-primary p-6 space-y-4 fade-in">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block text-lg font-medium",
                pathname === link.href ? "text-accent-primary" : "text-text-secondary"
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-4 border-t border-border-primary">
            <div className="flex justify-between items-center text-text-secondary">
              <span className="text-sm">Appearance</span>
              <ThemeToggle />
            </div>
            <Link
              href="/dashboard"
              className="w-full text-center px-5 py-3 bg-accent-primary text-bg-primary font-bold rounded-xl btn-click"
              onClick={() => setIsOpen(false)}
            >
              Open App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
