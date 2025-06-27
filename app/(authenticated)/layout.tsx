"use client";

import { useAuth } from "@clerk/nextjs";
import { api } from "@cvx/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useAuth();
  const router = useRouter();
  const currentUser = useQuery(api.users.queries.getCurrentUser);

  useEffect(() => {
    if (isLoaded && currentUser === null) {
      // This case can happen if the user record is not yet created
      // or if there's an issue. Redirecting to home might be a safe fallback.
      router.push("/");
      return;
    }

    if (isLoaded && currentUser && !currentUser.alreadyOnboarded) {
      router.push("/onboarding/username");
    }
  }, [isLoaded, currentUser, router]);

  if (!isLoaded || currentUser === undefined) {
    // You can replace this with a proper loading skeleton
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (currentUser && !currentUser.alreadyOnboarded) {
    // Render nothing while redirecting
    return null;
  }

  return <>{children}</>;
}
