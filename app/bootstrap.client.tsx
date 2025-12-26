
// app/bootstrap.client.tsx
"use client";
import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // In some setups, TypeScript/ESLint complain about a “floating promise”.
    // Using `void` silences that and makes intent clear.
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}
