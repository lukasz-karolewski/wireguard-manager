import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Load environment variables
dotenv.config();

function checkEnvVars(): void {
  const requiredVars = ['OPENAI_API_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

async function createSummary(input: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const systemPrompt = `You are a technical changelog summarizer. 
Given a list of changelog entries, create a concise summary that captures the main updates and changes. 
Group similar changes together and provide a brief description of each group. Try to capture what changes mean for the user, and do not itemize every single change.`;

  const humanPrompt = `Please summarize these changelog entries:
${input}

Provide a brief, clear summary that highlights the most important changes. Call it Summary of Changes.

"bump" means update of libraries to the latest version, do not use that vernacular directly in the summary.`;

  try {
    const completion = await openai.chat.completions.create({
      max_tokens: 1000,
      messages: [
        { content: systemPrompt, role: 'system' },
        { content: humanPrompt, role: 'user' }
      ],
      model: 'gpt-4o',
      temperature: 0,
    });

    return completion.choices[0]?.message?.content?.trim() ?? '';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  checkEnvVars();

  // Read the latest changelog section from stdin
  let latestEntries = '';
  
  // Read from stdin
  process.stdin.setEncoding('utf8');
  
  for await (const chunk of process.stdin) {
    latestEntries += String(chunk);
  }
  
  latestEntries = latestEntries.trim();
  
  if (!latestEntries) {
    console.log('No changes to summarize');
    return;
  }

  // Create and get the summary
  const summary = await createSummary(latestEntries);
  
  // Print summary to stdout
  console.log(summary);
}

// Only run main if this script is being executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
