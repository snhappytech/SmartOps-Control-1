import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markNotificationRead } from "../data/mockApi";
import { Card } from "./ui/Card";
import { ErrorState } from "./ui/ErrorState";
import { cn } from "../utils/cn";

export const NotificationsCenter = () => {
  const queryClient = useQueryClient();
  const { data, isError, refetch } = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications });

  const mutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unread = data?.filter((n) => !n.isRead).length ?? 0;

  return (
    <Card
      title="Notifications"
      description="Birthday, top agent, payroll, recurring expenses"
      actions={
        <span className="rounded-full bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white">Unread: {unread}</span>
      }
    >
      {isError ? (
        <ErrorState message="Notifications unavailable" onRetry={refetch} />
      ) : (
        <div className="space-y-2">
          {data?.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-center justify-between rounded-lg border border-slate-200 p-3",
                !n.isRead && "bg-slate-50",
              )}
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                <p className="text-xs text-slate-600">{n.message}</p>
              </div>
              {!n.isRead && (
                <button
                  className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-white"
                  onClick={() => mutation.mutate(n.id)}
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
