'use server';
/**
 * @fileOverview The main AI agent flow for the Digital Exocortex.
 *
 * - runAgentFlow - A function that handles multimodal input and orchestrates AI tools.
 * - AgentInput - The input type for the runAgentFlow function.
 * - AgentOutput - The return type for the runAgentFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generateTutorialPrompt} from './ai-tutorial-generation';
import { generateAvatar } from './generate-avatar';
import { generateVideo } from './generate-video';

const AgentInputSchema = z.object({
  prompt: z.string().describe("The user's question or command."),
  imageDataUri: z.optional(z
    .string()
    .describe(
      "An optional image provided by the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )),
});
export type AgentInput = z.infer<typeof AgentInputSchema>;

const AgentOutputSchema = z.object({
  answer: z.string().describe("The AI agent's response to the user's prompt."),
  media: z.optional(z.object({
    type: z.enum(['image', 'video']).describe("The type of the generated media."),
    dataUri: z.string().describe("A data URI for the generated media."),
    title: z.string().describe("A title for the generated media."),
  })),
});
export type AgentOutput = z.infer<typeof AgentOutputSchema>;

export async function runAgentFlow(input: AgentInput): Promise<AgentOutput> {
  return agentFlow(input);
}

const getFeatureTutorial = ai.defineTool(
  {
    name: 'getFeatureTutorial',
    description: 'Provides a tutorial for a specific feature of the StarSeed Nexus platform when the user asks for an explanation.',
    inputSchema: z.object({ featureName: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await generateTutorialPrompt({
        featureName: input.featureName,
        userLevel: 'beginner',
    });
    return output!.tutorialText;
  }
);

const generateAvatarTool = ai.defineTool(
    {
        name: 'generateAvatarTool',
        description: 'Generates an avatar image based on a user\'s text description. Use this when the user asks to create or generate an avatar.',
        inputSchema: z.object({
            description: z.string().describe('A detailed text description of the avatar to generate.'),
        }),
        outputSchema: z.object({
            avatarDataUri: z.string(),
        }),
    },
    async (input) => {
        const result = await generateAvatar({ description: input.description });
        return { avatarDataUri: result.avatarDataUri };
    }
);

const generateVideoTool = ai.defineTool(
    {
        name: 'generateVideoTool',
        description: 'Generates a short video based on a user\'s text prompt. Use this when the user asks to create or generate a video.',
        inputSchema: z.object({
            prompt: z.string().describe('A text prompt describing the video to be generated.'),
        }),
        outputSchema: z.object({
            videoDataUri: z.string(),
        }),
    },
    async (input) => {
        const result = await generateVideo({ prompt: input.prompt });
        return { videoDataUri: result.videoDataUri };
    }
);

const prompt = ai.definePrompt({
  name: 'agentPrompt',
  input: {schema: AgentInputSchema},
  output: {schema: AgentOutputSchema},
  tools: [getFeatureTutorial, generateAvatarTool, generateVideoTool],
  prompt: `You are an expert AI assistant, part of a "Digital Exocortex". Your task is to analyze the user's input, which may include an image, and provide a helpful, concise response.

- If an image is provided, your analysis should be based on it.
- If the user asks for an explanation of a platform feature, use the getFeatureTutorial tool to provide a clear and concise explanation.
- If the user asks to generate an avatar, use the generateAvatarTool. The output should be the generated media and a confirmation message in the 'answer' field.
- If the user asks to generate a video, use the generateVideoTool. The output should be the generated media and a confirmation message in the 'answer' field.
- If no image or specific tool matches, respond to the text prompt as a general AI assistant.

User's prompt: {{{prompt}}}
{{#if imageDataUri}}
User's image: {{media url=imageDataUri}}
{{/if}}
`,
});

const agentFlow = ai.defineFlow(
  {
    name: 'agentFlow',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    const output = response.output!;

    for (const toolResponse of response.toolRequests) {
        if (toolResponse.tool === 'generateAvatarTool') {
             const toolOutput = (await toolResponse.response).output as any;
             output.media = {
                 type: 'image',
                 dataUri: toolOutput.avatarDataUri,
                 title: toolResponse.input.description,
             };
             output.answer = '¡Claro! He generado este avatar para ti. ¿Qué te parece? Puedes añadirlo a tu biblioteca.'
        }
        if (toolResponse.tool === 'generateVideoTool') {
             const toolOutput = (await toolResponse.response).output as any;
             output.media = {
                 type: 'video',
                 dataUri: toolOutput.videoDataUri,
                 title: toolResponse.input.prompt,
             };
             output.answer = '¡Hecho! He creado este video a partir de tu idea. Puedes añadirlo a tu biblioteca.'
        }
    }

    return output;
  }
);
