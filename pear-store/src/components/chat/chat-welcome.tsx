import { Bot } from "lucide-react";

export function ChatWelcome() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-pear/20 flex items-center justify-center mb-4">
        <Bot className="h-8 w-8 text-pear-dark" />
      </div>
      <h2 className="text-xl font-bold text-gray-dark mb-2">Pear Genius</h2>
      <p className="text-gray-medium text-sm max-w-md">
        Your AI-powered support assistant. Ask about orders, returns, warranty,
        troubleshooting, and more.
      </p>
    </div>
  );
}
