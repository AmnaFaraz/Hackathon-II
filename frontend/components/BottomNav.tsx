"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Chat", href: "/chat", icon: MessageSquare },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-surface/80 backdrop-blur-md border-t border-border-primary pb-safe">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-accent-primary" : "text-text-secondary"
              )}
            >
              <Icon size={20} className={cn(isActive && "scale-110")} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
