import { useState } from "react";
import { NexusAvatar } from "./NexusAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image as ImageIcon, Smile, MapPin } from "lucide-react";
import type { Privacy, User } from "@/api/types";

const sampleImages = [
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1080&q=80",
  "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=1080&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1080&q=80",
];

export function CreatePostCard({
  user,
  onCreate,
}: {
  user: User;
  onCreate: (input: { text: string; privacy: Privacy; image?: string }) => void;
}) {
  const [text, setText] = useState("");
  const [privacy, setPrivacy] = useState<Privacy>("public");
  const [image, setImage] = useState<string | undefined>();

  const submit = () => {
    if (!text.trim()) return;
    onCreate({ text: text.trim(), privacy, image });
    setText("");
    setImage(undefined);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex gap-3">
        <NexusAvatar user={user} size="md" />
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          className="min-h-[60px] resize-none bg-transparent border-0 focus-visible:ring-0 p-0 text-sm"
        />
      </div>

      {image && (
        <div className="mt-3 aspect-square rounded-md overflow-hidden border border-border max-h-80">
          <img src={image} alt="preview" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() =>
              setImage(sampleImages[Math.floor(Math.random() * sampleImages.length)])
            }
          >
            <ImageIcon className="h-5 w-5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Photo</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <MapPin className="h-5 w-5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Location</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setText((t) => t + " 😊")}
          >
            <Smile className="h-5 w-5" strokeWidth={1.75} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select value={privacy} onValueChange={(v) => setPrivacy(v as Privacy)}>
            <SelectTrigger className="h-8 w-[120px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="friends">Followers</SelectItem>
              <SelectItem value="only-me">Only me</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={submit}
            disabled={!text.trim()}
            className="ig-btn-primary h-8 px-4 text-sm"
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
