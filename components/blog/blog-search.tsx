"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BlogSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function BlogSearch({ value, onChange }: BlogSearchProps) {
    return (
        <div className="relative max-w-md mx-auto mb-12">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
                type="text"
                placeholder="Rechercher un article..."
                className="pl-10 py-6 bg-white/50 dark:bg-black/20 border-black/5 dark:border-white/10 focus-visible:ring-primary/20 rounded-xl transition-all duration-300 hover:bg-white/80 dark:hover:bg-black/30"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
