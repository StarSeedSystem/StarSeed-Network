'use server';

/**
 * @fileOverview Generates video from a text prompt using the Veo model.
 *
 * - generateVideo - A function that handles the video generation process.
 * - GenerateVideoInput - The input type for the generateVideo function.
 * - GenerateVideoOutput - The return type for the generateVideo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MediaPart } from 'genkit';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the video from.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "The generated video as a data URI. Expected format: 'data:video/mp4;base64,<encoded_data>'."
    ),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
  return generateVideoFlow(input);
}

// Helper to poll for operation completion
async function pollOperation<T>(operation: any): Promise<any> {
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
        operation = await ai.checkOperation(operation);
    }
    return operation;
}

// Helper to convert video URL to data URI
async function videoToDataUri(video: MediaPart): Promise<string> {
    const fetch = (await import('node-fetch')).default;
    // The video URL from Veo requires the API key for access
    const videoUrl = `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(videoUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
    }
    const videoBuffer = await response.buffer();
    const base64Video = videoBuffer.toString('base64');
    const contentType = response.headers.get('content-type') || 'video/mp4';
    return `data:${contentType};base64,${base64Video}`;
}


const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async (input) => {
    let { operation } = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: input.prompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
        throw new Error('Video generation operation did not start.');
    }

    const completedOperation = await pollOperation(operation);

    if (completedOperation.error) {
        throw new Error(`Video generation failed: ${completedOperation.error.message}`);
    }

    const videoPart = completedOperation.output?.message?.content.find((p: any) => !!p.media);

    if (!videoPart) {
        throw new Error('No video was found in the generation result.');
    }

    const videoDataUri = await videoToDataUri(videoPart);

    return { videoDataUri };
  }
);
