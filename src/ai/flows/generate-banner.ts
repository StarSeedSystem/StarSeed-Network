'use server';
/**
 * @fileOverview AI-powered banner generation from text descriptions.
 *
 * - generateBanner - A function that generates an AI banner based on a text description.
 * - GenerateBannerInput - The input type for the generateBanner function.
 * - GenerateBannerOutput - The return type for the generateBanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBannerInputSchema = z.object({
  description: z.string().describe('A natural language description of the desired banner image.'),
});
export type GenerateBannerInput = z.infer<typeof GenerateBannerInputSchema>;

const GenerateBannerOutputSchema = z.object({
  bannerDataUri: z
    .string()
    .describe(
      'The AI-generated banner as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type GenerateBannerOutput = z.infer<typeof GenerateBannerOutputSchema>;

export async function generateBanner(input: GenerateBannerInput): Promise<GenerateBannerOutput> {
  return generateBannerFlow(input);
}

const generateBannerFlow = ai.defineFlow(
  {
    name: 'generateBannerFlow',
    inputSchema: GenerateBannerInputSchema,
    outputSchema: GenerateBannerOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a wide banner image (1200x400 aspect ratio) suitable for a social media profile header. The banner should be based on the following description: ${input.description}. Focus on creating an epic, visually stunning, and atmospheric scene.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('No banner was generated.');
    }

    return {bannerDataUri: media.url};
  }
);
