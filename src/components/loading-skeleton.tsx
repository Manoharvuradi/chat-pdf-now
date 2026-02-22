export function LoadingSkeleton() {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-lg bg-stone-200 dark:bg-stone-800" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-24 animate-pulse rounded-lg bg-stone-200 dark:bg-stone-800" />
          <div className="h-24 animate-pulse rounded-lg bg-stone-200 dark:bg-stone-800" />
          <div className="h-24 animate-pulse rounded-lg bg-stone-200 dark:bg-stone-800" />
        </div>
      </div>
    );
  }