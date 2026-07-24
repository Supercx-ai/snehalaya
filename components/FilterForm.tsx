"use client";

import { useRouter } from "next/navigation";

// A native <form method="get"> submit forces a full browser page load. Intercepting
// submit and pushing the same query string through the router instead keeps this a
// normal Next.js client-side navigation — no full-page refresh.
export default function FilterForm({ basePath, className, children }: { basePath: string; className?: string; children: React.ReactNode }) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(e.currentTarget)) {
      params.append(key, value.toString());
    }
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <form method="get" onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
