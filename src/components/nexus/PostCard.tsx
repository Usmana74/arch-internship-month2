import { useEffect, useState } from "react";
import type { Post } from "@/api/types";
import { NexusAvatar } from "./NexusAvatar";
import { userById, CURRENT_USER_ID } from "@/api/users";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onSave?: (id: string) => void;
}

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : n.toLocaleString();

export function PostCard({ post, onLike, onComment, onSave }: PostCardProps) {
  const author = userById(post.authorId);
  const [draft, setDraft] = useState("");
  const [popKey, setPopKey] = useState(0);
  const me = userById(CURRENT_USER_ID);

  // re-trigger heart pop animation when likedByMe flips to true
  useEffect(() => {
    if (post.likedByMe) setPopKey((k) => k + 1);
  }, [post.likedByMe]);

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onComment(post.id, text);
    setDraft("");
  };

  const handleDoubleClickImage = () => {
    if (!post.likedByMe) onLike(post.id);
  };

  return (
    <article className="bg-card border border-border rounded-lg fade-up">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3">
        <div className="nexus-ring">
          <div className="bg-card rounded-full p-[2px]">
            <NexusAvatar user={author} size="sm" />
          </div>
        </div>
        <div className="flex-1 min-w-0 leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm truncate">{author.handle}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{post.createdAt}</span>
          </div>
          {post.location && (
            <div className="text-[11px] text-muted-foreground">{post.location}</div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-destructive font-semibold">Report</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Unfollow @{author.handle}</DropdownMenuItem>
            <DropdownMenuItem>Add to favorites</DropdownMenuItem>
            <DropdownMenuItem>Go to post</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Image */}
      {post.image && (
        <div
          className="relative aspect-square w-full bg-secondary overflow-hidden select-none"
          onDoubleClick={handleDoubleClickImage}
        >
          {post.image.startsWith("http") ? (
            <img
              src={post.image}
              alt={`Post by ${author.name}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-7xl">
              {post.image}
            </div>
          )}
        </div>
      )}

      {/* Action row */}
      <div className="flex items-center px-3 pt-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => onLike(post.id)}
          aria-label="Like"
        >
          <Heart
            key={popKey}
            className={cn(
              "h-6 w-6",
              post.likedByMe && "fill-destructive text-destructive heart-pop"
            )}
            strokeWidth={1.75}
          />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" aria-label="Comment">
          <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" aria-label="Share">
          <Send className="h-6 w-6" strokeWidth={1.75} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 ml-auto"
          onClick={() => onSave?.(post.id)}
          aria-label="Save"
        >
          <Bookmark
            className={cn("h-6 w-6", post.saved && "fill-foreground text-foreground")}
            strokeWidth={1.75}
          />
        </Button>
      </div>

      {/* Likes */}
      <div className="px-4 pt-2 text-sm font-semibold">
        {formatCount(post.likes)} {post.likes === 1 ? "like" : "likes"}
      </div>

      {/* Caption */}
      <div className="px-4 pt-1 text-sm leading-snug">
        <span className="font-semibold mr-1.5">{author.handle}</span>
        <span className="whitespace-pre-wrap">{post.text}</span>
        {post.hashtags.length > 0 && (
          <span>
            {" "}
            {post.hashtags.map((h) => (
              <span key={h} className="text-primary cursor-pointer hover:underline">
                #{h}{" "}
              </span>
            ))}
          </span>
        )}
      </div>

      {/* View comments */}
      {post.comments.length > 0 && (
        <button className="px-4 pt-1.5 text-sm text-muted-foreground text-left w-full hover:text-foreground transition-smooth">
          View all {post.comments.length} comments
        </button>
      )}

      <div className="px-4 pt-1 space-y-1">
        {post.comments.slice(-2).map((c) => {
          const cu = userById(c.authorId);
          return (
            <div key={c.id} className="text-sm leading-snug">
              <span className="font-semibold mr-1.5">{cu.handle}</span>
              <span>{c.text}</span>
            </div>
          );
        })}
      </div>

      {/* Comment input */}
      <div className="flex items-center gap-2 px-4 py-3 mt-2 border-t border-border">
        <Smile className="h-5 w-5 text-muted-foreground shrink-0" strokeWidth={1.75} />
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Add a comment…"
          className="h-7 border-0 bg-transparent focus-visible:ring-0 px-0 text-sm"
        />
        <button
          onClick={submit}
          disabled={!draft.trim()}
          className="text-sm font-semibold text-primary disabled:opacity-30 hover:text-primary/80 transition-smooth"
        >
          Post
        </button>
      </div>

      {/* Avatar of commenter (small reference) — skipped on purpose to match IG layout */}
      <span className="hidden">{me.id}</span>
    </article>
  );
}
