import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/nexus/Sidebar";
import { Header } from "@/components/nexus/Header";
import { RightPanel } from "@/components/nexus/RightPanel";
import { PrivacyModal } from "@/components/nexus/PrivacyModal";
import { FeedView } from "@/components/nexus/views/FeedView";
import { ExploreView } from "@/components/nexus/views/ExploreView";
import { NotificationsView } from "@/components/nexus/views/NotificationsView";
import { FriendsView } from "@/components/nexus/views/FriendsView";
import { MessagesView } from "@/components/nexus/views/MessagesView";
import { MediaView } from "@/components/nexus/views/MediaView";
import { ProfileView } from "@/components/nexus/views/ProfileView";
import { SettingsView } from "@/components/nexus/views/SettingsView";
import type { NexusView } from "@/components/nexus/types";
import { getCurrentUser, allUsers } from "@/api/users";
import { getUnreadCount, pushNotification } from "@/api/notifications";
import { getFriendRequests } from "@/api/friends";
import { simulateRemoteLike, simulateRemoteComment } from "@/api/posts";
import type { User, NotificationKind } from "@/api/types";
import { toast } from "sonner";

const sampleComments = [
  "this is fire 🔥",
  "love this!",
  "🙌🙌🙌",
  "where is this?",
  "sending to my group chat now",
  "incredible composition",
  "❤️❤️❤️",
];

const Index = () => {
  const [view, setView] = useState<NexusView>("feed");
  const [me, setMe] = useState<User | null>(null);
  const [unread, setUnread] = useState(0);
  const [pending, setPending] = useState(0);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [feedTick, setFeedTick] = useState(0);
  const [panelTick, setPanelTick] = useState(0);
  const viewRef = useRef(view);
  viewRef.current = view;

  const refreshBadges = () => {
    getUnreadCount().then(setUnread);
    getFriendRequests().then((r) => setPending(r.length));
    setPanelTick((t) => t + 1);
  };

  useEffect(() => {
    getCurrentUser().then(setMe);
    refreshBadges();
  }, []);

  // Simulated realtime events (varied cadence 4-9s, tied to real mock data)
  useEffect(() => {
    const others = allUsers().filter((u) => u.id !== "u_omar");
    let cancelled = false;

    const schedule = () => {
      const delay = 4000 + Math.random() * 5000;
      setTimeout(() => {
        if (cancelled) return;
        const u = others[Math.floor(Math.random() * others.length)];
        const roll = Math.random();
        let kind: NotificationKind;
        let text: string;
        let toastMsg: string;

        if (roll < 0.55) {
          // like
          const result = simulateRemoteLike(u.id);
          if (!result) return schedule();
          kind = "like";
          text = "liked your post";
          toastMsg = `${u.handle} liked your post`;
        } else if (roll < 0.85) {
          // comment
          const cmt = sampleComments[Math.floor(Math.random() * sampleComments.length)];
          const result = simulateRemoteComment(u.id, cmt);
          if (!result) return schedule();
          kind = "comment";
          text = `commented: "${cmt}"`;
          toastMsg = `${u.handle} commented on your post`;
        } else {
          kind = "follow";
          text = "started following you";
          toastMsg = `${u.handle} started following you`;
        }

        pushNotification({
          id: `nws_${Date.now()}`,
          kind,
          fromUserId: u.id,
          text,
          createdAt: "just now",
          read: false,
        });
        setUnread((n) => n + 1);

        // Refresh feed silently if user is on it (so likes/comments appear live)
        if (viewRef.current === "feed") setFeedTick((t) => t + 1);

        toast(toastMsg, { duration: 3000 });

        schedule();
      }, delay);
    };

    schedule();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!me) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="font-display text-5xl text-foreground animate-pulse">
          Nexus
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case "feed":
        return <FeedView externalTick={feedTick} />;
      case "explore":
        return <ExploreView />;
      case "notifications":
        return <NotificationsView onChanged={refreshBadges} />;
      case "friends":
        return <FriendsView onChanged={refreshBadges} />;
      case "messages":
        return <MessagesView />;
      case "media":
        return <MediaView />;
      case "profile":
        return <ProfileView />;
      case "settings":
        return <SettingsView />;
    }
  };

  // Messages and Profile use wider canvas like Instagram
  const wideView = view === "messages" || view === "profile" || view === "explore" || view === "media";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar
        view={view}
        onChange={setView}
        unreadNotifications={unread}
        pendingFriendRequests={pending}
        currentUser={me}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header view={view} onOpenPrivacy={() => setPrivacyOpen(true)} onChange={setView} />

        <div className="flex-1 overflow-y-auto nexus-scroll">
          <div
            className={
              "mx-auto px-2 sm:px-4 py-6 " +
              (wideView ? "max-w-[935px] w-full" : "max-w-[470px] w-full")
            }
          >
            {renderView()}
          </div>
        </div>
      </main>

      <RightPanel key={panelTick} onChanged={refreshBadges} />

      <PrivacyModal open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </div>
  );
};

export default Index;
