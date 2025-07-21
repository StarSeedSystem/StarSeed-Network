import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Repeat, Heart, Share } from "lucide-react";

const feedItems = [
  {
    author: "CosmoNaut",
    handle: "cosmo.eth",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "futuristic astronaut",
    content: "Just integrated my consciousness with a stellar nebula. The universe is unbelievably vast and beautiful from this perspective. #transhumanism #starcitizen",
    comments: 12,
    reposts: 5,
    likes: 42,
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
  },
];

function FeedPost({ post }: { post: (typeof feedItems)[0] }) {
  return (
    <Card className="glass-card rounded-2xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.avatar} alt={post.author} data-ai-hint={post.avatarHint} />
            <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{post.author}</p>
            <p className="text-sm text-muted-foreground">@{post.handle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
          <MessageSquare className="h-4 w-4" /> {post.comments}
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-green-500">
          <Repeat className="h-4 w-4" /> {post.reposts}
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent">
          <Heart className="h-4 w-4" /> {post.likes}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export function FeedWidget() {
  return (
    <div>
        <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" className="rounded-full">All</Button>
            <Button variant="ghost" className="rounded-full">Following</Button>
            <Button variant="ghost" className="rounded-full">Communities</Button>
        </div>
        <div className="space-y-4">
            {feedItems.map((item, index) => (
                <FeedPost key={index} post={item} />
            ))}
        </div>
    </div>
  );
}
