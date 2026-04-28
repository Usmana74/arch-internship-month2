import type { AppNotification, TrendingTag } from "./types";
import { wait } from "./client";

let notifications: AppNotification[] = [
  { id: "n1", kind: "like", fromUserId: "u_layla", text: "liked your post about shipping features", createdAt: "2m", read: false },
  { id: "n2", kind: "comment", fromUserId: "u_sara", text: "commented: “Top-hat duck is non-negotiable.”", createdAt: "18m", read: false },
  { id: "n3", kind: "friend-request", fromUserId: "u_bilal", text: "sent you a friend request", createdAt: "1h", read: false },
  { id: "n4", kind: "mention", fromUserId: "u_zain", text: "mentioned you in a comment", createdAt: "3h", read: false },
  { id: "n5", kind: "follow", fromUserId: "u_sara", text: "started following you", createdAt: "1d", read: true },
  { id: "n6", kind: "like", fromUserId: "u_bilal", text: "liked your photo", createdAt: "2d", read: true },
];

export const getNotifications = () => wait([...notifications]);

export const getUnreadCount = () =>
  wait(notifications.filter((n) => !n.read).length);

export const markAllRead = () => {
  notifications = notifications.map((n) => ({ ...n, read: true }));
  return wait(notifications);
};

export const pushNotification = (n: AppNotification) => {
  notifications = [n, ...notifications];
  return n;
};

const trending: TrendingTag[] = [
  { tag: "buildinpublic", posts: 12_400 },
  { tag: "typography", posts: 8_210 },
  { tag: "filmphotography", posts: 5_902 },
  { tag: "react", posts: 21_700 },
  { tag: "morningroutine", posts: 3_412 },
];

export const getTrending = () => wait(trending);
