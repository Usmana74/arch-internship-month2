import type { Post, Comment, Privacy } from "./types";
import { wait } from "./client";
import { CURRENT_USER_ID } from "./users";

// Real, royalty-free imagery via Unsplash source URLs (deterministic).
const img = (id: string, w = 1080) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

let posts: Post[] = [
  {
    id: "p1",
    authorId: "u_sana",
    text: "Golden hour in Karachi ✨ Nothing beats the beach at sunset.",
    image: img("photo-1507525428034-b723cf961d3e"),
    location: "Clifton Beach, Karachi",
    hashtags: ["karachi", "sunset", "beachvibes", "pakistan"],
    privacy: "public",
    createdAt: "12 minutes ago",
    likes: 1248,
    likedByMe: false,
    comments: [
      { id: "c1", authorId: "u_usman", text: "Beautiful shot! 🔥", createdAt: "8m" },
      { id: "c2", authorId: "u_maria", text: "Love this energy 👀", createdAt: "5m" },
    ],
  },
  {
    id: "p2",
    authorId: "u_usman",
    text: "Late night cricket with the boys. Nothing beats gully cricket under the lights.",
    image: img("photo-1531415074968-036ba1b575da"),
    location: "Lahore, PK",
    hashtags: ["cricket", "gullycricket", "pakistan", "night"],
    privacy: "public",
    createdAt: "1 hour ago",
    likes: 4302,
    likedByMe: true,
    comments: [
      { id: "c3", authorId: "u_areej", text: "that energy though 🤌", createdAt: "40m" },
    ],
  },
  {
    id: "p3",
    authorId: "u_areej",
    text: "New outfit drop! 💕 Feeling pretty in pink today.",
    image: img("photo-1515886657613-9f3515b0c78f"),
    hashtags: ["fashion", "ootd", "pink", "style"],
    privacy: "friends",
    createdAt: "3 hours ago",
    likes: 312,
    likedByMe: false,
    comments: [],
  },
  {
    id: "p4",
    authorId: "u_maria",
    text: "Behind the scenes at the fashion week. The hustle is real but so worth it! 👗✨",
    image: img("photo-1469334031218-e382a71b716b"),
    hashtags: ["fashionweek", "behindthescenes", "designerlife"],
    privacy: "public",
    createdAt: "5 hours ago",
    likes: 8917,
    likedByMe: false,
    comments: [
      { id: "c4", authorId: "u_sana", text: "I need this dress.", createdAt: "4h" },
      { id: "c5", authorId: "u_bilal", text: "top-tier work ethic.", createdAt: "3h" },
    ],
  },
  {
    id: "p5",
    authorId: "u_bilal",
    text: "Morning run through the trails. Karachi mornings hit different when you're up before the city.",
    image: img("photo-1476480862126-209bfaa8edc8"),
    location: "Karachi",
    hashtags: ["running", "morning", "fitness", "karachi"],
    privacy: "public",
    createdAt: "8 hours ago",
    likes: 2104,
    likedByMe: false,
    comments: [],
  },
];

let nextPostId = 100;
let nextCommentId = 100;

export const getPosts = () => wait([...posts]);

export const getPostsByUser = (userId: string) =>
  wait(posts.filter((p) => p.authorId === userId));

export interface CreatePostInput {
  text: string;
  privacy: Privacy;
  image?: string;
}

export const createPost = (input: CreatePostInput) => {
  const hashtags = Array.from(input.text.matchAll(/#(\w+)/g)).map((m) => m[1]);
  const post: Post = {
    id: `p${nextPostId++}`,
    authorId: CURRENT_USER_ID,
    text: input.text,
    image: input.image,
    hashtags,
    privacy: input.privacy,
    createdAt: "just now",
    likes: 0,
    likedByMe: false,
    comments: [],
  };
  posts = [post, ...posts];
  return wait(post);
};

export const likePost = (id: string) => {
  posts = posts.map((p) =>
    p.id === id
      ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
      : p
  );
  return wait(posts.find((p) => p.id === id)!);
};

export const savePost = (id: string) => {
  posts = posts.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p));
  return wait(posts.find((p) => p.id === id)!);
};

export const addComment = (postId: string, text: string) => {
  const comment: Comment = {
    id: `c${nextCommentId++}`,
    authorId: CURRENT_USER_ID,
    text,
    createdAt: "now",
  };
  posts = posts.map((p) =>
    p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
  );
  return wait(comment);
};

// Simulated incoming "live" event from another user.
export const simulateRemoteLike = (userId: string) => {
  const candidates = posts.filter((p) => p.authorId === CURRENT_USER_ID);
  if (candidates.length === 0) return null;
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  posts = posts.map((p) =>
    p.id === target.id ? { ...p, likes: p.likes + 1 } : p
  );
  return { post: target, userId };
};

export const simulateRemoteComment = (userId: string, text: string) => {
  const candidates = posts.filter((p) => p.authorId === CURRENT_USER_ID);
  if (candidates.length === 0) return null;
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  const comment: Comment = {
    id: `c${nextCommentId++}`,
    authorId: userId,
    text,
    createdAt: "now",
  };
  posts = posts.map((p) =>
    p.id === target.id ? { ...p, comments: [...p.comments, comment] } : p
  );
  return { post: target, comment };
};
