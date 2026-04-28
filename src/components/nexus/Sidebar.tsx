import { cn } from "@/lib/utils";
import { NexusAvatar } from "./NexusAvatar";
import type { NexusView } from "./types";
import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  User as UserIcon,
  Menu,
} from "lucide-react";
import type { User } from "@/api/types";

interface SidebarProps {
  view: NexusView;
  onChange: (v: NexusView) => void;
  unreadNotifications: number;
  pendingFriendRequests: number;
  currentUser: User;
}

const items: Array<{
  id: NexusView;
  label: string;
  icon: React.ComponentType<any>;
  badgeKey?: "notif" | "friend";
}> = [
  { id: "feed", label: "Home", icon: Home },
  { id: "explore", label: "Search", icon: Search },
  { id: "media", label: "Explore", icon: Compass },
  { id: "friends", label: "Reels", icon: Film, badgeKey: "friend" },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "notifications", label: "Notifications", icon: Heart, badgeKey: "notif" },
  { id: "settings", label: "Create", icon: PlusSquare },
  { id: "profile", label: "Profile", icon: UserIcon },
];

export function Sidebar({
  view,
  onChange,
  unreadNotifications,
  pendingFriendRequests,
  currentUser,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-[72px] xl:w-[245px] shrink-0 border-r border-border bg-card transition-all">
      <div className="px-3 xl:px-6 pt-6 pb-8 flex items-center gap-2 xl:gap-3">
        <img
          src="/nexus-logo.png"
          alt="Nexus logo"
          width={40}
          height={40}
          className="h-9 w-9 xl:h-10 xl:w-10 object-contain shrink-0"
        />
        <span className="hidden xl:block font-display text-[26px] leading-none text-foreground">
          Nexus
        </span>
      </div>

      <nav className="flex-1 px-2 xl:px-3 space-y-1 nexus-scroll overflow-y-auto">
        {items.map((it) => {
          const active = view === it.id;
          const badge =
            it.badgeKey === "notif"
              ? unreadNotifications
              : it.badgeKey === "friend"
              ? pendingFriendRequests
              : 0;
          const Icon = it.icon;
          return (
            <button
              key={it.id + it.label}
              onClick={() => onChange(it.id)}
              className={cn(
                "w-full flex items-center gap-4 px-3 py-3 rounded-lg text-[15px] transition-smooth",
                "hover:bg-secondary",
                active ? "font-bold" : "font-normal"
              )}
            >
              <span className="relative shrink-0">
                <Icon
                  className={cn("h-6 w-6")}
                  strokeWidth={active ? 2.5 : 1.75}
                />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] font-semibold bg-destructive text-destructive-foreground rounded-full min-w-[16px] h-4 px-1 grid place-items-center">
                    {badge}
                  </span>
                )}
              </span>
              <span className="hidden xl:inline">{it.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => onChange("profile")}
        className="m-2 xl:m-3 p-2 xl:p-3 rounded-lg flex items-center gap-3 hover:bg-secondary transition-smooth"
      >
        <NexusAvatar user={currentUser} size="md" />
        <div className="hidden xl:block text-left min-w-0">
          <div className="text-sm font-semibold truncate">{currentUser.handle}</div>
          <div className="text-xs text-muted-foreground truncate">{currentUser.name}</div>
        </div>
        <Menu className="hidden xl:block h-4 w-4 text-muted-foreground ml-auto" />
      </button>
    </aside>
  );
}
