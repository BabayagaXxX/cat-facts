"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Cat, BookOpen, Home } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/breeds", label: "Breeds", icon: Cat },
    { href: "/playground", label: "Facts", icon: BookOpen },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                    <Cat className="h-6 w-6" />
                    <span>CatFacts</span>
                </Link>
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                        {navItems.concat([{ href: "/adoptions", label: "Adoptions", icon: Cat }]).map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}
