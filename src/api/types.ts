// Shared types for the Nexus mock API.
// When swapping to a real Django REST API, keep these shapes stable.

export type Privacy = "public" | "friends" | "only-me";

export interface User {
  id: string;
  name: string;
  handle: string;
  initials: string;
  gradient: string;
  avatar?: string;     // photo URL
  bio?: string;
  online?: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string; // human-readable for mock
}

export interface Post {
  id: string;
  authorId: string;
  text: string;
  image?: string;        // image URL (or emoji as fallback)
  location?: string;
  hashtags: string[];
  privacy: Privacy;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
  saved?: boolean;
  comments: Comment[];
}

export type NotificationKind = "like" | "comment" | "friend-request" | "mention" | "follow";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  fromUserId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface FriendRequest {
  id: string;
  userId: string;
  mutual: number;
}

export interface Conversation {
  id: string;
  userId: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

export interface TrendingTag {
  tag: string;
  posts: number;
}
