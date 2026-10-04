import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-[28px]">
          {title}
        </h1>
        <p className="mt-1 max-w-[62ch] text-[15px] text-muted-foreground text-pretty">
          {subtitle}
        </p>
      </div>
      {action}
    </div>
  );
}
