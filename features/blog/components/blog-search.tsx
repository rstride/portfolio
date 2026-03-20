"use client";

import { Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function BlogSearch({ value, onChange }: BlogSearchProps) {
  return (
    <Card className="mx-auto w-full max-w-xl border-border/16 bg-background/70 shadow-none">
      <CardContent className="relative p-4">
        <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
          <Search className="size-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Rechercher un article..."
          className="h-12 border-0 pl-10 shadow-none focus-visible:ring-0"
          aria-label="Rechercher un article"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
