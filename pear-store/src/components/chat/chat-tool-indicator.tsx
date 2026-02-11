import { Loader2 } from "lucide-react";

interface ChatToolIndicatorProps {
  tools: string[];
}

function formatToolName(name: string): string {
  // Convert camelCase to readable text
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function ChatToolIndicator({ tools }: ChatToolIndicatorProps) {
  if (tools.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 ml-11">
      <Loader2 className="h-3.5 w-3.5 text-pear-dark animate-spin" />
      <span className="text-xs text-gray-medium">
        {tools.map(formatToolName).join(", ")}...
      </span>
    </div>
  );
}
