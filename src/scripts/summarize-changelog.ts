import * as dotenv from "dotenv";
import { OpenAI } from "openai";

// Load environment variables
dotenv.config();

function checkEnvVars(): void {
  const requiredVars = ["OPENAI_API_KEY"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
}

async function createSummary(input: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const systemPrompt = `You are a technical changelog summarizer. Summarize a list of changelog entries into a concise, user-focused summary. Group related changes, describe each group briefly, and highlight the impact for users. Avoid listing every change individually.`;

  const humanPrompt = `Summarize the following changelog entries:\n\n${input}\n\nWrite a brief summary called \"Summary of Changes\" that highlights the most important updates. If an entry says \"bump\", interpret it as a library update and use clear language (e.g., \"Updated dependencies to latest versions\"). Do not use the word \"bump\" in the summary.`;

  try {
    const completion = await openai.chat.completions.create({
      max_tokens: 1000,
      messages: [
        { content: systemPrompt, role: "system" },
        { content: humanPrompt, role: "user" },
      ],
      model: "o4-mini",
      temperature: 0,
    });

    return completion.choices[0]?.message?.content?.trim() ?? "";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

async function main(): Promise<void> {
  checkEnvVars();

  // Read the latest changelog section from stdin
  let latestEntries = "";

  // Read from stdin
  process.stdin.setEncoding("utf8");

  for await (const chunk of process.stdin) {
    latestEntries += String(chunk);
  }

  latestEntries = latestEntries.trim();

  if (!latestEntries) {
    console.log("No changes to summarize");
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
