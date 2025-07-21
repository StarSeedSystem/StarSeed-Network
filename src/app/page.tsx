

import { FeedPostType } from "@/components/dashboard/FeedWidget";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

const initialFeed: FeedPostType[] = [
  {
    author: "CosmoNaut",
    handle: "cosmo.eth",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "futuristic astronaut",
    content: "Just integrated my consciousness with a stellar nebula. The universe is unbelievably vast and beautiful from this perspective. #transhumanism #starcitizen",
    comments: 12,
    reposts: 5,
    likes: 42,
    destinations: ["Profile"]
  },
  {
    author: "GaiaPrime",
    handle: "gaia.sol",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "glowing goddess",
    content: "The latest AR nature overlay for Central Park is live! Experience the primordial forest as it was millions of years ago. A truly humbling experience.",
    comments: 8,
    reposts: 2,
    likes: 33,
    destinations: ["Innovación Sostenible"]
  },
];

export default function DashboardPage() {
  return (
    <DashboardClient initialFeed={initialFeed} />
  );
}
