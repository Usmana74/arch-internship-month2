import { NexusAvatar } from "./NexusAvatar";
import { allUsers, CURRENT_USER_ID } from "@/api/users";
import { Plus } from "lucide-react";

export function StoriesRow() {
  const me = allUsers().find((u) => u.id === CURRENT_USER_ID)!;
  const others = allUsers().filter((u) => u.id !== CURRENT_USER_ID);

  return (
    <div className="bg-card border border-border rounded-lg px-3 py-4">
      <div className="flex gap-4 overflow-x-auto nexus-scroll">
        {/* Your story */}
        <button className="flex flex-col items-center gap-1.5 shrink-0 w-[68px] group">
          <div className="relative">
            <NexusAvatar user={me} size="lg" />
            <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary grid place-items-center ring-2 ring-card">
              <Plus className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
            </span>
          </div>
          <span className="text-[11px] text-foreground truncate w-full text-center">
            Your story
          </span>
        </button>

        {others.map((u) => (
          <button
            key={u.id}
            className="flex flex-col items-center gap-1.5 shrink-0 w-[68px] group"
          >
            <NexusAvatar user={u} size="lg" ring />
            <span className="text-[11px] text-foreground truncate w-full text-center">
              {u.handle}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
