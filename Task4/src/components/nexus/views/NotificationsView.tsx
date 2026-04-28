import { useEffect, useState } from "react";
import { NexusAvatar } from "../NexusAvatar";
import { Button } from "@/components/ui/button";
import { getNotifications, markAllRead } from "@/api/notifications";
import { userById } from "@/api/users";
import type { AppNotification } from "@/api/types";
import { Heart, MessageCircle, UserPlus, AtSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  "friend-request": UserPlus,
  mention: AtSign,
  follow: Users,
};

export function NotificationsView({ onChanged }: { onChanged: () => void }) {
  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    getNotifications().then(setItems);
  }, []);

  const handleMarkAll = async () => {
    await markAllRead();
    setItems((i) => i.map((n) => ({ ...n, read: true })));
    onChanged();
    toast.success("All marked as read");
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <header className="px-5 py-4 flex items-center justify-between border-b border-border">
        <h2 className="text-base font-semibold">Notifications</h2>
        <Button variant="ghost" size="sm" onClick={handleMarkAll} className="text-primary font-semibold">
          Mark all read
        </Button>
      </header>
      <ul className="divide-y divide-border">
        {items.map((n) => {
          const u = userById(n.fromUserId);
          const Icon = iconMap[n.kind];
          return (
            <li
              key={n.id}
              className={cn(
                "flex items-start gap-3 p-4 transition-smooth hover:bg-secondary/60",
                !n.read && "bg-primary/[0.04]"
              )}
            >
              <div className="relative shrink-0">
                <NexusAvatar user={u} size="md" />
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-destructive grid place-items-center ring-2 ring-card">
                  <Icon className="h-3 w-3 text-destructive-foreground" strokeWidth={2.5} />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">
                  <span className="font-semibold">{u.handle}</span>{" "}
                  <span className="text-foreground/80">{n.text}</span>
                </p>
                <span className="text-xs text-muted-foreground">{n.createdAt}</span>
              </div>
              {!n.read && (
                <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
