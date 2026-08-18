"use client";

import { useRouter } from "next/navigation";

// A native <form method="get"> submit forces a full browser page load. Intercepting
// submit and pushing the same query string through the router instead keeps this a
// normal Next.js client-side navigation — no full-page refresh.
export default function FilterForm({ basePath, className, children }: { basePath: string; className?: string; children: React.ReactNode }) {
  const router = useRouter();

  function navigate(form: HTMLFormElement) {
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(form)) {
      params.append(key, value.toString());
    }
    router.push(`${basePath}?${params.toString()}`);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate(e.currentTarget);
  }

  function handleChange(e: React.FormEvent<HTMLFormElement>) {
    const t = e.target;
    if (!(t instanceof HTMLInputElement)) return;
    if (t.type === "checkbox" || t.type === "radio") navigate(e.currentTarget);
  }

  function handleBlur(e: React.FocusEvent<HTMLFormElement>) {
    const t = e.target;
    if (t instanceof HTMLInputElement && t.type === "number") navigate(e.currentTarget);
  }

  return (
    <form method="get" onSubmit={handleSubmit} onChange={handleChange} onBlur={handleBlur} className={className}>
      {children}
    </form>
  );
}
