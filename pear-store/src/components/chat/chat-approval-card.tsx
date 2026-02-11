"use client";

import type { PendingApprovalAction } from "@/stores/chat-store";
import { AlertTriangle, Check, CheckCircle, X, XCircle } from "lucide-react";

interface ChatApprovalCardProps {
  actions: PendingApprovalAction[];
  status?: "approved" | "rejected";
  onApprove?: () => void;
  onReject?: () => void;
  disabled?: boolean;
}

export function ChatApprovalCard({
  actions,
  status,
  onApprove,
  onReject,
  disabled,
}: ChatApprovalCardProps) {
  const isResolved = status !== undefined;

  // Style variants based on state
  const styles = isResolved
    ? status === "approved"
      ? {
          border: "border-green-200",
          bg: "bg-green-50",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          title: "text-green-900",
          text: "text-green-800",
          listText: "text-green-700",
        }
      : {
          border: "border-red-200",
          bg: "bg-red-50",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          title: "text-red-900",
          text: "text-red-800",
          listText: "text-red-700",
        }
    : {
        border: "border-amber-200",
        bg: "bg-amber-50",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        title: "text-amber-900",
        text: "text-amber-800",
        listText: "text-amber-700",
      };

  const StatusIcon = isResolved
    ? status === "approved"
      ? CheckCircle
      : XCircle
    : AlertTriangle;

  const heading = isResolved
    ? status === "approved"
      ? "Action approved"
      : "Action rejected"
    : "Action requires your approval";

  return (
    <div
      className={`mx-4 my-3 rounded-lg border ${styles.border} ${styles.bg} p-4`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${styles.iconBg}`}
        >
          <StatusIcon className={`h-4 w-4 ${styles.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${styles.title}`}>{heading}</h3>
          <div className="mt-2 space-y-2">
            {actions.map((action) => (
              <div
                key={action.tool_call_id}
                className="rounded-md bg-white/60 px-3 py-2.5"
              >
                <p className={`text-sm font-semibold ${styles.title}`}>
                  {action.title}
                </p>
                {action.description.length > 0 && (
                  <ul
                    className={`mt-1.5 space-y-1 text-sm ${styles.text} list-disc list-inside`}
                  >
                    {action.description.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {!isResolved && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={onApprove}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 rounded-md bg-pear px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-pear-dark disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                type="button"
                onClick={onReject}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
