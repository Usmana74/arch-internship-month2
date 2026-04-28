import { cn } from "@/lib/utils";
import type { User } from "@/api/types";

interface NexusAvatarProps {
  user: Pick<User, "initials" | "gradient" | "online" | "avatar" | "name">;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  ring?: boolean;
  showOnline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
  "2xl": "h-36 w-36 text-3xl",
};

export function NexusAvatar({
  user,
  size = "md",
  ring = false,
  showOnline = false,
  className,
}: NexusAvatarProps) {
  const inner = user.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      className={cn(
        "rounded-full object-cover shrink-0 bg-secondary",
        sizeMap[size],
        className
      )}
      loading="lazy"
    />
  ) : (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br shrink-0",
        user.gradient,
        sizeMap[size],
        className
      )}
    >
      {user.initials}
    </div>
  );

  return (
    <div className="relative inline-block">
      {ring ? (
        <div className="nexus-ring">
          <div className="bg-card rounded-full p-[2px]">{inner}</div>
        </div>
      ) : (
        inner
      )}
      {showOnline && user.online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-ig-online ring-2 ring-card" />
      )}
    </div>
  );
}
