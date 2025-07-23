

import { FeedPostType } from "@/components/dashboard/FeedWidget";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

const initialFeed: FeedPostType[] = [
  {
    id: "post_1",
    author: "CosmoNaut",
    handle: "cosmo.eth",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "futuristic astronaut",
    title: "Explorando la Nebulosa del Velo",
    content: "Just integrated my consciousness with a stellar nebula. The universe is unbelievably vast and beautiful from this perspective. #transhumanism #starcitizen",
    comments: 12,
    reposts: 5,
    likes: 42,
    destinations: [{ id: "dest_profile_1", name: "Profile", type: 'profile'}]
  },
  {
    id: "post_2",
    author: "GaiaPrime",
    handle: "gaia.sol",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "glowing goddess",
    title: "Superposición de AR Primordial",
    content: "The latest AR nature overlay for Central Park is live! Experience the primordial forest as it was millions of years ago. A truly humbling experience.",
    comments: 8,
    reposts: 2,
    likes: 33,
    destinations: [{ id: "dest_innova_1", name: "Innovación Sostenible", type: 'community'}]
  },
];

export default function DashboardPage() {
  return (
    <DashboardClient initialFeed={initialFeed} />
  );
}
