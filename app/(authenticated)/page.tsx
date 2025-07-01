"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import KnowledgeGraph from "@/features/knowledge-graph/knowledge-graph";

export default function DashboardPage() {
  const currentUser = useQuery(api.users.queries.getCurrentUser);

  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {currentUser?.username ?? "friend"}!
        </h1>
        <p className="text-muted-foreground mt-2">
          What would you like to learn today?
        </p>
      </header>

      <main>
        <div className="mb-8">
          <KnowledgeGraph />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        </div>
      </main>
    </div>
  );
}
