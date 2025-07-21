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


const prompt = ai.definePrompt({
  name: 'agentPrompt',
  input: {schema: AgentInputSchema},
  output: {schema: AgentOutputSchema},
  tools: [getFeatureTutorial],
  prompt: `You are an expert AI assistant, part of a "Digital Exocortex". Your task is to analyze the user's input, which may include an image, and provide a helpful, concise response.

If an image is provided, your analysis should be based on it. 

If the user asks for an explanation of a platform feature, use the getFeatureTutorial tool to provide a clear and concise explanation.

If no image or specific feature question is provided, respond to the text prompt as a general AI assistant.

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
    const {output} = await prompt(input);
    return output!;
  }
);
