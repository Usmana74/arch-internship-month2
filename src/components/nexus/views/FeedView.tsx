import { useEffect, useState } from "react";
import type { Post, Privacy } from "@/api/types";
import { addComment, createPost, getPosts, likePost, savePost } from "@/api/posts";
import { getCurrentUser } from "@/api/users";
import type { User } from "@/api/types";
import { StoriesRow } from "../StoriesRow";
import { CreatePostCard } from "../CreatePostCard";
import { PostCard } from "../PostCard";
import { toast } from "sonner";

interface FeedViewProps {
  externalTick?: number; // bump to refetch from API
}

export function FeedView({ externalTick = 0 }: FeedViewProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    getPosts().then(setPosts);
    getCurrentUser().then(setMe);
  }, [externalTick]);

  const handleCreate = async (input: { text: string; privacy: Privacy; image?: string }) => {
    const post = await createPost(input);
    setPosts((p) => [post, ...p]);
    toast.success("Post shared");
  };

  const handleLike = async (id: string) => {
    const updated = await likePost(id);
    setPosts((p) => p.map((x) => (x.id === id ? updated : x)));
  };

  const handleSave = async (id: string) => {
    const updated = await savePost(id);
    setPosts((p) => p.map((x) => (x.id === id ? updated : x)));
  };

  const handleComment = async (id: string, text: string) => {
    const c = await addComment(id, text);
    setPosts((p) =>
      p.map((x) => (x.id === id ? { ...x, comments: [...x.comments, c] } : x))
    );
  };

  if (!me) return null;

  return (
    <div className="space-y-4">
      <StoriesRow />
      <CreatePostCard user={me} onCreate={handleCreate} />
      {posts.map((p) => (
        <PostCard
          key={p.id}
          post={p}
          onLike={handleLike}
          onComment={handleComment}
          onSave={handleSave}
        />
      ))}
    </div>
  );
}
