import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const settings = [
  { key: "publicProfile", label: "Public Profile", desc: "Anyone can view your profile.", default: true },
  { key: "showEmail", label: "Show Email", desc: "Display your email on your profile.", default: false },
  { key: "postsPublic", label: "Posts Public by Default", desc: "New posts default to Public privacy.", default: true },
  { key: "allowTagging", label: "Allow Tagging", desc: "Let friends tag you in posts.", default: true },
  { key: "showOnline", label: "Show Online Status", desc: "Let others see when you're online.", default: true },
];

export function PrivacyModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(settings.map((s) => [s.key, s.default]))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Privacy</DialogTitle>
          <DialogDescription>
            Control who can see your activity on Nexus.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {settings.map((s) => (
            <div key={s.key} className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
              <Switch
                checked={state[s.key]}
                onCheckedChange={(v) =>
                  setState((p) => ({ ...p, [s.key]: v }))
                }
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
