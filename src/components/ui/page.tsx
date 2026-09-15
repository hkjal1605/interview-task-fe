import type { ReactNode } from "react";

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-[1056px] flex-1 px-4 py-6 sm:py-10">{children}</main>;
}

export function PageHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <h1 className="text-2xl font-medium leading-7">{title}</h1>
      <p className="text-sm leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}
