import Link from "next/link";
import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ToolsHeader } from "@/components/tools-header";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free Tools — SponsorDesk",
  description: "Free browser-based tools for creators, built by SponsorDesk. No sign-up required.",
};

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <ToolsHeader showAllToolsLink={false} />

      <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Free tools</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Small, free, browser-based tools for creators — built by SponsorDesk. More coming.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-[var(--shadow-md)]">
                <CardHeader>
                  <CardTitle>{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-primary">Open tool →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
