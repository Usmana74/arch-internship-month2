import { getTrending } from "@/api/notifications";
import { getPosts } from "@/api/posts";
import { useEffect, useState } from "react";
import type { Post, TrendingTag } from "@/api/types";

export function ExploreView() {
  const [trending, setTrending] = useState<TrendingTag[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getTrending().then(setTrending);
    getPosts().then(setPosts);
  }, []);

  // Repeat to fill the grid
  const tiles = [...posts, ...posts, ...posts].slice(0, 9);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {trending.map((t) => (
          <button
            key={t.tag}
            className="px-3 py-1.5 text-sm rounded-full border border-border hover:bg-secondary transition-smooth"
          >
            <span className="font-semibold">#{t.tag}</span>
            <span className="text-muted-foreground ml-2 text-xs">
              {t.posts.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1">
        {tiles.map((p, i) => (
          <div
            key={p.id + "-" + i}
            className={
              "bg-secondary overflow-hidden cursor-pointer group " +
              (i === 1 ? "row-span-2 col-span-1 aspect-[1/2]" : "aspect-square")
            }
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
                {p.image ?? "✨"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
