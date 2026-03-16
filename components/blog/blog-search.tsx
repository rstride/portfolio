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
        <Card className="mx-auto w-full max-w-md border-border/60 bg-background/80">
            <CardContent className="relative p-2">
                <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                    <Search className="size-5 text-muted-foreground" />
                </div>
                <Input
                    type="text"
                    placeholder="Rechercher un article..."
                    className="border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                    aria-label="Rechercher un article"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </CardContent>
        </Card>
    );
}
