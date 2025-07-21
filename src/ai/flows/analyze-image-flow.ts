'use server';
/**
 * @fileOverview An AI agent that analyzes images.
 *
 * - analyzeImage - A function that handles image analysis based on a prompt.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageInputSchema = z.object({
  prompt: z.string().describe('The user\'s question or command about the image.'),
  imageDataUri: z.optional(z
    .string()
    .describe(
      "An optional image provided by the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  answer: z.string().describe('The AI agent\'s response to the user\'s prompt.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `You are an expert AI assistant, part of a "Digital Exocortex". Your task is to analyze the user's input, which may include an image, and provide a helpful, concise response.

If an image is provided, your analysis should be based on it. If no image is provided, respond to the text prompt as a general AI assistant.

User's prompt: {{{prompt}}}
{{#if imageDataUri}}
User's image: {{media url=imageDataUri}}
{{/if}}
`,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
