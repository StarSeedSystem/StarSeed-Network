'use server';

/**
 * @fileOverview Generates AI tutorials for complex features.
 *
 * - generateTutorial - A function that generates a tutorial for a given feature.
 * - GenerateTutorialInput - The input type for the generateTutorial function.
 * - GenerateTutorialOutput - The return type for the generateTutorial function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTutorialInputSchema = z.object({
  featureName: z.string().describe('The name of the complex feature.'),
  userLevel: z.string().describe('The user\u0027s current level of expertise (e.g., beginner, intermediate, advanced).'),
});
export type GenerateTutorialInput = z.infer<typeof GenerateTutorialInputSchema>;

const GenerateTutorialOutputSchema = z.object({
  tutorialText: z.string().describe('The AI-generated tutorial text for the feature.'),
});
export type GenerateTutorialOutput = z.infer<typeof GenerateTutorialOutputSchema>;

export async function generateTutorial(input: GenerateTutorialInput): Promise<GenerateTutorialOutput> {
  return generateTutorialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTutorialPrompt',
  input: {schema: GenerateTutorialInputSchema},
  output: {schema: GenerateTutorialOutputSchema},
  prompt: `You are an AI assistant designed to explain complex features of an online platform to users of varying expertise levels.

  The platform feature is called: {{{featureName}}}.
  The user level is: {{{userLevel}}}.

  Generate a short, concise tutorial (approximately 2-3 sentences) that explains the feature to the user, tailored to their level of expertise. Be proactive and make it easy to understand.

  Tutorial:`,
});

const generateTutorialFlow = ai.defineFlow(
  {
    name: 'generateTutorialFlow',
    inputSchema: GenerateTutorialInputSchema,
    outputSchema: GenerateTutorialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
