export function BotLoading() {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="flex gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:-0.3s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-600" />
        </div>
        <span className="text-sm text-stone-500">Thinking...</span>
      </div>
    );
  }