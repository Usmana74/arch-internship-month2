import { useEffect, useState } from "react";
import { NexusAvatar } from "../NexusAvatar";
import { Button } from "@/components/ui/button";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getFriends,
  unfriend,
} from "@/api/friends";
import { userById } from "@/api/users";
import type { FriendRequest } from "@/api/types";
import { toast } from "sonner";

export function FriendsView({ onChanged }: { onChanged: () => void }) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<string[]>([]);

  const refresh = () => {
    getFriendRequests().then(setRequests);
    getFriends().then(setFriends);
  };

  useEffect(refresh, []);

  const accept = async (id: string) => {
    const r = requests.find((x) => x.id === id);
    await acceptFriendRequest(id);
    refresh();
    onChanged();
    if (r) toast.success(`You and ${userById(r.userId).handle} are now connected`);
  };

  const decline = async (id: string) => {
    await declineFriendRequest(id);
    refresh();
    onChanged();
  };

  const remove = async (id: string) => {
    await unfriend(id);
    refresh();
    toast(`Removed ${userById(id).handle}`);
  };

  return (
    <div className="space-y-4">
      <section className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-base font-semibold mb-4">Follow requests</h2>
        {requests.length === 0 && (
          <p className="text-sm text-muted-foreground">You're all caught up.</p>
        )}
        <div className="space-y-2">
          {requests.map((r) => {
            const u = userById(r.userId);
            return (
              <div key={r.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary">
                <NexusAvatar user={u} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{u.handle}</div>
                  <div className="text-xs text-muted-foreground">
                    {u.name} · {r.mutual} mutual
                  </div>
                </div>
                <Button size="sm" className="ig-btn-primary h-8" onClick={() => accept(r.id)}>
                  Confirm
                </Button>
                <Button size="sm" variant="secondary" className="h-8 font-semibold" onClick={() => decline(r.id)}>
                  Delete
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-base font-semibold mb-4">
          Following · {friends.length}
        </h2>
        <div className="space-y-2">
          {friends.map((id) => {
            const u = userById(id);
            return (
              <div key={id} className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary">
                <NexusAvatar user={u} size="lg" showOnline />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{u.handle}</div>
                  <div className="text-xs text-muted-foreground">{u.name}</div>
                </div>
                <Button size="sm" variant="secondary" className="h-8 font-semibold">
                  Message
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 font-semibold text-destructive hover:text-destructive"
                  onClick={() => remove(id)}
                >
                  Unfollow
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
