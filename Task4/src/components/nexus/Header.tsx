import { Search, Compass, Heart, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { NexusView } from "./types";

interface HeaderProps {
  view: NexusView;
  onOpenPrivacy: () => void;
  onChange: (v: NexusView) => void;
}

export function Header({ view, onChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-background/85 border-b border-border">
      <div className="flex items-center gap-3 px-4 md:px-6 h-14 max-w-[975px] mx-auto w-full">
        <div className="md:hidden flex items-center gap-2">
          <img src="/nexus-logo.png" alt="Nexus logo" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="font-display text-2xl leading-none">Nexus</span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-lg bg-secondary border border-transparent w-full max-w-[268px] focus-within:bg-card focus-within:border-border">
          <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <Input
            placeholder="Search"
            className="h-7 border-0 bg-transparent focus-visible:ring-0 px-0 text-sm placeholder:text-muted-foreground"
          />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange("media")}
            className="rounded-full"
            aria-label="Explore"
          >
            <Compass className="h-6 w-6" strokeWidth={1.75} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange("messages")}
            className="rounded-full"
            aria-label="Messages"
          >
            <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange("notifications")}
            className="rounded-full"
            aria-label="Notifications"
          >
            <Heart className="h-6 w-6" strokeWidth={1.75} />
          </Button>
        </div>
      </div>
    </header>
  );
}
