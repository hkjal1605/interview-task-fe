import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-12 w-full min-w-0 rounded-md border border-input bg-secondary px-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 ${className}`}
      {...props}
    />
  );
}
