import { Check, Minus } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./_shared";

type Val = true | false | string;

/*
 * TeXeR's free plan next to the free plans of other online LaTeX editors, which are not named. The "Others" column is the most used editor's published free plan (checked November 2026): a value it does not state is left out rather than guessed, and a dash is a feature kept for paid plans or not offered. TeXeR's values come from lib/plans.ts and the backend's limits (file history expires after 30 days).
 */
const COLUMNS = ["TeXeR Free", "Others"] as const;

const ROWS: { name: string; values: [Val, Val] }[] = [
  { name: "Collaborators per project", values: ["Unlimited", "1"] },
  { name: "Comments", values: [true, true] },
  { name: "Track changes", values: [true, false] },
  { name: "Visual editing", values: [true, true] },
  { name: "Document history", values: ["30 days", "24 hours"] },
  { name: "GitHub sync, both ways", values: [true, false] },
  { name: "AI assistant, with your own key", values: [true, false] },
  { name: "Handwriting and PDFs to LaTeX", values: [true, false] },
  { name: "Library of TikZ figures", values: [true, false] },
  { name: "Projects", values: ["Unlimited", "Unlimited"] },
];

function Value({ v, ours }: { v: Val; ours: boolean }) {
  if (v === true) return <Check className={cn("size-4", ours ? "text-foreground" : "text-muted-foreground")} aria-label="Included" />;
  if (v === false) return <Minus className="size-4 text-muted-foreground/50" aria-label="Paid plans only" />;
  return <span className={cn("type-base", ours ? "font-medium text-foreground" : "text-muted-foreground")}>{v}</span>;
}

export function ComparisonSection() {
  return (
    <section className="py-24 @min-[40rem]:py-32">
      <div className="container">
        <Reveal>
          <SectionHeading
            title="What other editors charge for is free here"
            lede="Collaborators, track changes, GitHub sync, and the rest come with the free plan, because a paper is written by more than one person."
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-[var(--radius-surface)] border border-line">
            <table className="w-full">
              <caption className="sr-only">TeXeR&apos;s free plan compared with the free plans of other online LaTeX editors. A dash means the feature is on paid plans only, or not offered.</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="py-4 ps-5 pe-4 text-start type-base font-medium text-muted-foreground">
                    On the free plan
                  </th>
                  {COLUMNS.map((c, i) => (
                    <th
                      key={c}
                      scope="col"
                      className={cn("px-4 py-4 text-center type-base font-semibold", i === 0 ? "bg-foreground/[0.04] text-foreground" : "text-muted-foreground")}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.name} className="border-b border-line last:border-0">
                    <th scope="row" className="py-3.5 ps-5 pe-4 text-start type-base font-medium">
                      {row.name}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className={cn("px-4 py-3.5", i === 0 && "bg-foreground/[0.04]")}>
                        <div className="flex justify-center">
                          <Value v={v} ours={i === 0} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
