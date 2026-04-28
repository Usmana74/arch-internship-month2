import { useEffect, useState } from "react";
import { NexusAvatar } from "./NexusAvatar";
import { Button } from "@/components/ui/button";
import { userById, getCurrentUser } from "@/api/users";
import {
  followUser,
  getSuggestions,
} from "@/api/friends";
import type { User } from "@/api/types";
import { toast } from "sonner";

export function RightPanel({ onChanged }: { onChanged: () => void }) {
  const [me, setMe] = useState<User | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getCurrentUser().then(setMe);
    getSuggestions().then(setSuggestions);
  }, []);

  const handleFollow = async (userId: string) => {
    setFollowed((f) => ({ ...f, [userId]: true }));
    await followUser(userId);
    const u = userById(userId);
    toast(`Following ${u.handle}`);
    onChanged();
  };

  if (!me) return null;

  return (
    <aside className="hidden xl:flex flex-col w-[320px] shrink-0 pl-6 pr-4 py-8 gap-6">
      {/* Current user */}
      <div className="flex items-center gap-3">
        <NexusAvatar user={me} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{me.handle}</div>
          <div className="text-sm text-muted-foreground truncate">{me.name}</div>
        </div>
        <button className="text-xs font-semibold text-primary hover:text-foreground">
          Switch
        </button>
      </div>

      {/* Suggestions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Suggested for you</h3>
          <button className="text-xs font-semibold hover:text-muted-foreground">See All</button>
        </div>
        <div className="space-y-3">
          {suggestions.map((id) => {
            const u = userById(id);
            const isFollowed = !!followed[id];
            return (
              <div key={id} className="flex items-center gap-3">
                <NexusAvatar user={u} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{u.handle}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    Suggested for you
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(id)}
                  disabled={isFollowed}
                  className="text-xs font-semibold text-primary hover:text-foreground disabled:text-muted-foreground"
                >
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
          {suggestions.length === 0 && (
            <p className="text-xs text-muted-foreground">
              You're following everyone we'd suggest.
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-[11px] text-muted-foreground/70 leading-relaxed mt-2 space-x-1">
        <a className="hover:underline cursor-pointer">About</a> ·
        <a className="hover:underline cursor-pointer">Help</a> ·
        <a className="hover:underline cursor-pointer">Press</a> ·
        <a className="hover:underline cursor-pointer">API</a> ·
        <a className="hover:underline cursor-pointer">Jobs</a> ·
        <a className="hover:underline cursor-pointer">Privacy</a> ·
        <a className="hover:underline cursor-pointer">Terms</a>
        <div className="mt-3 uppercase tracking-wider">© 2026 Nexus</div>
      </footer>
    </aside>
  );
}
