export function ChatTypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-2">
      <div className="h-8 w-8 rounded-full bg-pear/20 flex-shrink-0 flex items-center justify-center">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-pear-dark animate-bounce [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-pear-dark animate-bounce [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-pear-dark animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
