import type { ReactNode } from "react";

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
}

export default function PageWrapper({
  title,
  subtitle,
  actions,
  filters,
  children,
}: PageWrapperProps) {
  return (
    <div className="px-6 py-8 max-w-screen-xl mx-auto space-y-8">
      {/* Title + Subtitle */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        )}
      </div>

      {/* Filters + Actions in a single row */}
      {(filters || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">{filters}</div>
          <div className="flex gap-2">{actions}</div>
        </div>
      )}

      {/* Main Content */}
      <div className="">
        {children}
      </div>
    </div>
  );
}
