"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SearchBox({
  initialValue,
  placeholder,
  paramName = "search",
  debounceMs = 250,
}: {
  initialValue: string;
  placeholder?: string;
  paramName?: string;
  debounceMs?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const spString = sp.toString();

  const [value, setValue] = useState(initialValue);

  // If navigation changed the URL, sync local state.
  const urlValue = useMemo(() => {
    const next = new URLSearchParams(spString);
    return (next.get(paramName) ?? "").trim();
  }, [paramName, spString]);
  useEffect(() => {
    setValue((prev) => (prev === urlValue ? prev : urlValue));
  }, [urlValue]);

  useEffect(() => {
    const handle = setTimeout(() => {
      const next = new URLSearchParams(spString);
      const trimmed = value.trim();
      if (trimmed) next.set(paramName, trimmed);
      else next.delete(paramName);

      // Keep backward compat clean.
      if (paramName === "search") next.delete("q");

      const nextQs = next.toString();
      if (nextQs === spString) return;
      router.replace(nextQs ? `${pathname}?${nextQs}` : pathname, { scroll: false });
    }, debounceMs);

    return () => clearTimeout(handle);
  }, [debounceMs, paramName, pathname, router, spString, value]);

  return (
    <input
      className="input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
    />
  );
}

