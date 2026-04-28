import {
  User,
  Bell,
  Shield,
  Lock,
  Palette,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

const items = [
  { Icon: User, title: "Account", desc: "Email, username, password" },
  { Icon: Bell, title: "Notifications", desc: "Choose what gets through" },
  { Icon: Shield, title: "Privacy", desc: "Who can see your activity" },
  { Icon: Lock, title: "Security", desc: "Two-factor and sessions" },
  { Icon: Palette, title: "Appearance", desc: "Theme and accent colors" },
  { Icon: HelpCircle, title: "Help", desc: "Docs, support, feedback" },
];

export function SettingsView() {
  return (
    <div className="nexus-card overflow-hidden">
      <header className="px-5 py-4 border-b border-border">
        <h2 className="font-display text-xl font-bold">Settings</h2>
      </header>
      <ul className="divide-y divide-border">
        {items.map(({ Icon, title, desc }) => (
          <li key={title}>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-nexus-surface-2 transition-smooth text-left">
              <div className="h-10 w-10 rounded-xl bg-nexus-surface-2 border border-border grid place-items-center">
                <Icon className="h-5 w-5 text-nexus-purple" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
