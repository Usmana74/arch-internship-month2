import type { FriendRequest, Conversation } from "./types";
import { wait } from "./client";

let requests: FriendRequest[] = [
  { id: "fr1", userId: "u_bilal", mutual: 8 },
  { id: "fr2", userId: "u_sana", mutual: 14 },
];

let friends = ["u_usman", "u_ahmad"];

let suggestions = ["u_bilal", "u_sana", "u_maria", "u_hina"];

export const getFriendRequests = () => wait([...requests]);

export const acceptFriendRequest = (id: string) => {
  const req = requests.find((r) => r.id === id);
  if (req) {
    friends = [...friends, req.userId];
    requests = requests.filter((r) => r.id !== id);
  }
  return wait(req);
};

export const declineFriendRequest = (id: string) => {
  requests = requests.filter((r) => r.id !== id);
  return wait(true);
};

export const getFriends = () => wait([...friends]);

export const unfriend = (userId: string) => {
  friends = friends.filter((f) => f !== userId);
  return wait(true);
};

export const getSuggestions = () => wait([...suggestions]);

export const followUser = (userId: string) => {
  suggestions = suggestions.filter((s) => s !== userId);
  return wait(true);
};

const conversations: Conversation[] = [
  { id: "cv1", userId: "u_usman", lastMessage: "Did you see the new collection?", lastAt: "2m", unread: 2 },
  { id: "cv2", userId: "u_ahmad", lastMessage: "Sending the photos tonight 📸", lastAt: "1h", unread: 0 },
  { id: "cv3", userId: "u_sana", lastMessage: "That dress is gorgeous!", lastAt: "3h", unread: 1 },
  { id: "cv4", userId: "u_bilal", lastMessage: "Up for a long run Sunday?", lastAt: "1d", unread: 0 },
];

export const getConversations = () => wait(conversations);
