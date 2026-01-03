import { ReactNode } from "react";

type Props = {
  message: string;
  onRetry?: () => void;
  actionSlot?: ReactNode;
};

export const ErrorState = ({ message, onRetry, actionSlot }: Props) => (
  <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 text-rose-700">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold">Something went wrong</p>
        <p className="text-xs text-rose-600">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-rose-700"
          >
            Retry
          </button>
        )}
        {actionSlot}
      </div>
    </div>
  </div>
);
