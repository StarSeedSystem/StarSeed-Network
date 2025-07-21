
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "@/data/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, BotMessageSquare } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // On successful sign-up, Firebase automatically signs the user in.
      // The UserContext will detect this, and we can redirect.
      router.push("/"); 
    } catch (err: any) {
      setError(err.message);
      console.error("Error signing up:", err);
    }
  };
  
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError("Failed to login. Please check your credentials.");
      console.error("Error logging in:", err);
    }
  };
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      setError("Failed to sign in with Google.");
      console.error("Error with Google sign-in:", err);
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full glass-card">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="button" className="w-full" size="lg" onClick={handleLogin}>
            Login
          </Button>
          <div className="mt-2 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Button variant="link" className="p-0" onClick={handleSignUp}>
              Sign up
            </Button>
          </div>
          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/60 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="outline" onClick={handleGoogleSignIn}>
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" disabled>
                <BotMessageSquare className="mr-2 h-4 w-4" />
                AI-Pass
              </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
