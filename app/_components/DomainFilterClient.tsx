"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DomainFilter from "@/components/gallery/DomainFilter";

export default function DomainFilterClient({
  selected,
  counts,
}: {
  selected: string;
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(domain: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (domain === "All") {
      params.delete("domain");
    } else {
      params.set("domain", domain);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <DomainFilter selected={selected} counts={counts} onChange={handleChange} />
  );
}
