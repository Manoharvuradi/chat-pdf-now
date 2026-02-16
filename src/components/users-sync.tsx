"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";

export function UserSync() {
  const { isSignedIn, isLoaded } = useAuth();
  const ensureUser = useMutation(api.users.ensureUserExists);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      ensureUser().catch((error) => {
        console.error("Failed to sync user:", error);
      });
    }
  }, [isLoaded, isSignedIn, ensureUser]);

  return null;
}