import Link from "next/link";

export function Breadcrumbs({
  items,
  tone = "dark",
}: {
  items: { name: string; path: string }[];
  tone?: "light" | "dark";
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] ${tone === "light" ? "text-white/75" : "text-muted"}`}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={tone === "light" ? "text-white" : "text-navy"}>
                  {it.name}
                </span>
              ) : (
                <>
                  <Link href={it.path} className="link-underline">
                    {it.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
