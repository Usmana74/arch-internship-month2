import { useEffect, useState } from "react";
import { getPosts } from "@/api/posts";
import type { Post } from "@/api/types";

export function MediaView() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  const images = posts.filter((p) => p.image?.startsWith("http"));

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h2 className="text-base font-semibold mb-4">Media library</h2>
      <div className="grid grid-cols-3 gap-1">
        {images.map((p) => (
          <div
            key={p.id}
            className="aspect-square overflow-hidden cursor-pointer group"
          >
            <img
              src={p.image}
              alt=""
              className="w-full h-full object-cover transition-smooth group-hover:opacity-80"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
