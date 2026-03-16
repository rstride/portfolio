"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface BlogSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function BlogSearch({ value, onChange }: BlogSearchProps) {
    return (
        <Card className="mx-auto mb-12 max-w-md border-black/5 bg-white/50 dark:border-white/10 dark:bg-black/20">
            <CardContent className="relative p-2">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                    type="text"
                    placeholder="Rechercher un article..."
                    className="border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </CardContent>
        </Card>
    );
}
