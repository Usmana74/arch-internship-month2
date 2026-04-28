import type { User } from "./types";
import { wait } from "./client";

export const CURRENT_USER_ID = "u_areej";

const users: User[] = [
  {
    id: "u_areej",
    name: "Areej Sajjad",
    handle: "areej.sajjad",
    initials: "AS",
    gradient: "from-pink-400 to-rose-500",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Fashion, lifestyle & chai lover ☕️✨ Living my best life in Lahore.",
    online: true,
  },
  {
    id: "u_usman",
    name: "Usman Ali",
    handle: "usman.ali",
    initials: "UA",
    gradient: "from-blue-500 to-indigo-500",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Cricket, cars, and late night drives.",
    online: true,
  },
  {
    id: "u_ahmad",
    name: "Ahmad Khan",
    handle: "ahmad.k",
    initials: "AK",
    gradient: "from-emerald-500 to-teal-500",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Tech enthusiast. Always building something new.",
    online: false,
  },
  {
    id: "u_bilal",
    name: "Bilal Raza",
    handle: "bilal.runs",
    initials: "BR",
    gradient: "from-amber-500 to-red-500",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Trail runner. Writes about systems thinking.",
    online: false,
  },
  {
    id: "u_sana",
    name: "Sana Javed",
    handle: "sana.javed",
    initials: "SJ",
    gradient: "from-pink-500 to-rose-400",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Model & content creator. Based in Karachi ✨",
    online: true,
  },
  {
    id: "u_maria",
    name: "Maria B",
    handle: "maria.b",
    initials: "MB",
    gradient: "from-violet-500 to-purple-400",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Fashion designer. Creating magic one stitch at a time.",
    online: true,
  },
  {
    id: "u_hina",
    name: "Hina Altaf",
    handle: "hina.altaf",
    initials: "HA",
    gradient: "from-fuchsia-500 to-pink-400",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Actress & TV host. Spreading positivity everywhere.",
    online: false,
  },
];

export const getUsers = () => wait(users);
export const getCurrentUser = () => wait(users.find((u) => u.id === CURRENT_USER_ID)!);
export const getUserById = (id: string) =>
  wait(users.find((u) => u.id === id));

export const userById = (id: string): User =>
  users.find((u) => u.id === id) ?? users[0];

export const allUsers = () => users;
