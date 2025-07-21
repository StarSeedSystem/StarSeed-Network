"use client";

import { useState } from "react";
import { generateTutorial } from "@/ai/flows/ai-tutorial-generation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BotMessageSquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const features = [
  { value: "Multi-Destination Posting", label: "Multi-Destination Posting" },
  { value: "Federated Entities", label: "Federated Entities" },
  { value: "AR/VR Templates", label: "AR/VR Templates" },
];

export function TutorialsWidget() {
  const [selectedFeature, setSelectedFeature] = useState(features[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [tutorial, setTutorial] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateTutorial = async () => {
    setIsLoading(true);
    setTutorial(null);
    try {
      const result = await generateTutorial({
        featureName: selectedFeature,
        userLevel: "beginner", // This could be dynamic based on user data
      });
      setTutorial(result.tutorialText);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Tutorial Generation Failed",
        description: "Could not generate a tutorial. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BotMessageSquare className="text-primary" />
          AI Tutorials
        </CardTitle>
        <CardDescription>
          Get a quick explanation of complex features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedFeature} onValueChange={setSelectedFeature}>
          <SelectTrigger className="bg-background/80">
            <SelectValue placeholder="Select a feature..." />
          </SelectTrigger>
          <SelectContent className="glass-card rounded-xl">
            {features.map((feature) => (
              <SelectItem key={feature.value} value={feature.value}>
                {feature.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGenerateTutorial} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Explain It to Me
        </Button>
        {tutorial && (
          <Alert className="bg-primary/10 border-primary/20">
            <BotMessageSquare className="h-4 w-4 text-primary" />
            <AlertTitle className="font-headline text-primary">
              Here's a quick guide!
            </AlertTitle>
            <AlertDescription className="text-foreground/80">
              {tutorial}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
