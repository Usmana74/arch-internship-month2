import { useEffect, useMemo, useState } from "react";
import { NexusAvatar } from "../NexusAvatar";
import { getConversations } from "@/api/friends";
import { userById, getCurrentUser } from "@/api/users";
import type { Conversation, User } from "@/api/types";
import { cn } from "@/lib/utils";
import { Edit, Phone, Video, Info, Smile, Send, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Msg {
  id: string;
  fromMe: boolean;
  text: string;
  at: string;
}

export function MessagesView() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [me, setMe] = useState<User | null>(null);
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState<Record<string, Msg[]>>({});

  useEffect(() => {
    getConversations().then((c) => {
      setConvs(c);
      setActive(c[0]?.id ?? null);
      // seed mock threads
      const seeded: Record<string, Msg[]> = {};
      c.forEach((conv, i) => {
        seeded[conv.id] = [
          { id: `${conv.id}-1`, fromMe: false, text: conv.lastMessage, at: conv.lastAt },
          { id: `${conv.id}-2`, fromMe: true, text: i % 2 ? "haha noted 😄" : "for real, send pics!", at: "1m" },
        ];
      });
      setThreads(seeded);
    });
    getCurrentUser().then(setMe);
  }, []);

  const activeConv = useMemo(() => convs.find((c) => c.id === active), [convs, active]);
  const activeUser = activeConv ? userById(activeConv.userId) : null;
  const messages = active ? threads[active] ?? [] : [];

  const send = () => {
    const text = draft.trim();
    if (!text || !active) return;
    setThreads((t) => ({
      ...t,
      [active]: [...(t[active] ?? []), { id: `${active}-${Date.now()}`, fromMe: true, text, at: "now" }],
    }));
    setDraft("");
    // mock reply
    setTimeout(() => {
      const replies = ["💯", "agreed!", "lol stop", "send the link", "okay sounds good", "🙌"];
      const r = replies[Math.floor(Math.random() * replies.length)];
      setThreads((t) => ({
        ...t,
        [active]: [...(t[active] ?? []), { id: `${active}-r${Date.now()}`, fromMe: false, text: r, at: "now" }],
      }));
    }, 1400);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-120px)] min-h-[520px]">
      {/* Sidebar */}
      <aside className="border-r border-border overflow-y-auto nexus-scroll flex flex-col">
        <header className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">{me?.handle}</h2>
          </div>
          <Edit className="h-5 w-5" strokeWidth={1.75} />
        </header>
        <div className="px-4 pb-3 flex items-center justify-between text-sm">
          <span className="font-semibold">Messages</span>
          <button className="text-muted-foreground text-xs">Requests</button>
        </div>
        <ul className="flex-1">
          {convs.map((c) => {
            const u = userById(c.userId);
            const isActive = active === c.id;
            return (
              <li key={c.id}>
                <button
                  onClick={() => setActive(c.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 transition-smooth text-left",
                    "hover:bg-secondary",
                    isActive && "bg-secondary"
                  )}
                >
                  <NexusAvatar user={u} size="lg" showOnline />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{u.handle}</div>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.lastMessage} · {c.lastAt}
                    </p>
                  </div>
                  {c.unread > 0 && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Conversation */}
      {activeUser ? (
        <section className="hidden md:flex flex-col">
          <header className="flex items-center gap-3 px-5 py-3 border-b border-border">
            <NexusAvatar user={activeUser} size="md" showOnline />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{activeUser.handle}</div>
              <div className="text-xs text-muted-foreground">
                {activeUser.online ? "Active now" : "Active 1h ago"}
              </div>
            </div>
            <Button variant="ghost" size="icon"><Phone className="h-5 w-5" strokeWidth={1.75} /></Button>
            <Button variant="ghost" size="icon"><Video className="h-5 w-5" strokeWidth={1.75} /></Button>
            <Button variant="ghost" size="icon"><Info className="h-5 w-5" strokeWidth={1.75} /></Button>
          </header>

          <div className="flex-1 overflow-y-auto nexus-scroll p-5 space-y-2">
            <div className="flex flex-col items-center gap-2 mb-6">
              <NexusAvatar user={activeUser} size="xl" />
              <div className="text-base font-semibold">{activeUser.name}</div>
              <div className="text-xs text-muted-foreground">@{activeUser.handle} · Nexus</div>
              <Button variant="secondary" size="sm" className="mt-2 font-semibold">View profile</Button>
            </div>
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[70%] px-3.5 py-2 rounded-2xl text-sm leading-snug",
                  m.fromMe
                    ? "ml-auto bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary rounded-bl-md"
                )}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="m-4 flex items-center gap-2 border border-border rounded-full pl-4 pr-2 py-1">
            <Smile className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Message…"
              className="h-8 border-0 bg-transparent focus-visible:ring-0 px-0 text-sm"
            />
            {draft.trim() ? (
              <button
                onClick={send}
                className="text-sm font-semibold text-primary px-2"
              >
                Send
              </button>
            ) : (
              <Heart className="h-5 w-5 text-muted-foreground mx-2" strokeWidth={1.75} />
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
