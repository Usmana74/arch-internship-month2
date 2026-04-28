import { useEffect, useState } from "react";
import { NexusAvatar } from "../NexusAvatar";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/api/users";
import { getPostsByUser } from "@/api/posts";
import type { Post, User } from "@/api/types";
import { Settings, Grid3x3, Bookmark, UserSquare2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileView() {
  const [me, setMe] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<"posts" | "saved" | "tagged">("posts");

  useEffect(() => {
    getCurrentUser().then((u) => {
      setMe(u);
      getPostsByUser(u.id).then(setPosts);
    });
  }, []);

  if (!me) return null;

  const tabs = [
    { id: "posts" as const, label: "POSTS", Icon: Grid3x3 },
    { id: "saved" as const, label: "SAVED", Icon: Bookmark },
    { id: "tagged" as const, label: "TAGGED", Icon: UserSquare2 },
  ];

  return (
    <div className="space-y-8 pt-2">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-12 px-4">
        <div className="nexus-ring shrink-0">
          <div className="bg-card rounded-full p-1">
            <NexusAvatar user={me} size="2xl" />
          </div>
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <h2 className="text-xl font-light">{me.handle}</h2>
            <div className="flex gap-2 justify-center sm:justify-start">
              <Button variant="secondary" size="sm" className="font-semibold">
                Edit profile
              </Button>
              <Button variant="secondary" size="sm" className="font-semibold">
                View archive
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-5 w-5" strokeWidth={1.75} />
              </Button>
            </div>
          </div>

          <div className="mt-5 flex gap-8 justify-center sm:justify-start text-sm">
            <span><span className="font-semibold">{posts.length}</span> posts</span>
            <span><span className="font-semibold">12.4K</span> followers</span>
            <span><span className="font-semibold">312</span> following</span>
          </div>

          <div className="mt-4 text-sm">
            <div className="font-semibold">{me.name}</div>
            <p className="leading-snug">{me.bio}</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-t border-border flex justify-center gap-12">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 -mt-px py-3 text-[11px] font-semibold tracking-widest transition-smooth border-t",
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <t.Icon className="h-3.5 w-3.5" strokeWidth={2} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((p) => (
          <div
            key={p.id}
            className="aspect-square bg-secondary overflow-hidden cursor-pointer group relative"
          >
            {p.image?.startsWith("http") ? (
              <img
                src={p.image}
                alt=""
                className="w-full h-full object-cover transition-smooth group-hover:opacity-80"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-5xl">
                {p.image ?? "📝"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
