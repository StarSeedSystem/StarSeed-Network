import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, BotMessageSquare } from "lucide-react";

export default function LoginPage() {
  return (
    <Card className="mx-auto max-w-sm w-full glass-card rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 100 100" className="text-primary"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor: 'hsl(var(--primary))'}} /><stop offset="100%" style={{stopColor: 'hsl(var(--accent))'}} /></linearGradient></defs><path fill="url(#g)" d="M50,5 L61.8,38.2 L98.1,38.2 L68.1,59.5 L79.9,92.7 L50,71.4 L20.1,92.7 L31.9,59.5 L1.9,38.2 L38.2,38.2 Z" transform="rotate(10 50 50)"></path></svg>
            StarSeed Nexus
        </CardTitle>
        <CardDescription>
          Enter your credentials to connect to the Nexus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="pioneer@nexus.io"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline" prefetch={false}>
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" asChild>
            <Link href="/">Login</Link>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-2">
              <Button variant="outline">
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline">
                <BotMessageSquare className="mr-2 h-4 w-4" />
                AI-Pass
              </Button>
            </div>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline" prefetch={false}>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
