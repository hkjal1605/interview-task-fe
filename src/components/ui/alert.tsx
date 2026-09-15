import type { ReactNode } from "react";

export function Alert({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "success" }) {
  return (
    <div role="alert" className={`rounded-lg border px-3 py-2 text-sm leading-5 ${tone === "error" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-positive/40 bg-positive/10 text-positive"}`}>
      {children}
    </div>
  );
}
