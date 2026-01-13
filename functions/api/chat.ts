interface Env {
  ANTHROPIC_API_KEY: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  topic: string;
  messages: Message[];
}

interface AnthropicResponse {
  content: Array<{ type: string; text?: string }>;
}

// Topic content
const TOPIC_CONTENT: Record<string, string> = {
  "german-basics": `# German Basics - Everyday Vocabulary

## Level: Beginner (A1)

## Vocabulary

### Greetings
- Hallo - Hello
- Guten Morgen - Good morning
- Guten Tag - Good day
- Guten Abend - Good evening
- Auf Wiedersehen - Goodbye
- Tschüss - Bye (informal)
- Wie geht es dir? - How are you? (informal)
- Mir geht es gut - I'm doing well
- Danke - Thank you
- Bitte - Please / You're welcome

### Numbers 1-20
eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn,
elf, zwölf, dreizehn, vierzehn, fünfzehn, sechzehn, siebzehn, achtzehn, neunzehn, zwanzig

### Colors
rot (red), blau (blue), grün (green), gelb (yellow), schwarz (black), weiß (white), orange, lila (purple)

### Basic Phrases
- Ich heiße... - My name is...
- Ich komme aus... - I come from...
- Ich spreche Deutsch - I speak German
- Ich verstehe nicht - I don't understand`,

  "math-fractions": `# Math - Fractions

## Level: Elementary (Grades 3-5)

## Key Concepts

### What is a Fraction?
A fraction represents a part of a whole:
- Numerator (top): How many parts we have
- Denominator (bottom): Total equal parts

### Types of Fractions
- Proper fraction: Numerator < Denominator (e.g., 2/3)
- Improper fraction: Numerator >= Denominator (e.g., 5/3)
- Mixed number: Whole + fraction (e.g., 1 2/3)

### Equivalent Fractions
1/2 = 2/4 = 3/6 = 4/8
1/3 = 2/6 = 3/9

### Operations (same denominator)
- Adding: Add numerators, keep denominator
- Subtracting: Subtract numerators, keep denominator
- Simplifying: Divide both by GCD`,
};

function buildSystemPrompt(topicContent: string): string {
  return `You are a friendly and encouraging tutor helping a student learn. Your current topic is:

${topicContent}

Your role:
1. Generate exercises appropriate to the student's level
2. When the student answers, provide encouraging feedback
3. If they get it wrong, give hints before revealing the answer
4. Gradually increase difficulty as they succeed
5. Keep exercises focused on the topic material provided
6. Use simple, clear language appropriate for the level
7. Celebrate successes and encourage persistence on mistakes

When starting a new conversation, introduce yourself briefly and give the first exercise.
Keep responses concise - this is for a child/student, not an essay.

Format exercises clearly. For translations, use the format:
"Translate to [language]: [phrase]"

For math, show the problem clearly and ask for the answer.`;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { ANTHROPIC_API_KEY } = context.env;

  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "API key not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = (await context.request.json()) as ChatRequest;
    const { topic, messages } = body;

    const topicContent = TOPIC_CONTENT[topic];
    if (!topicContent) {
      return new Response(
        JSON.stringify({ error: "Topic not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        system: buildSystemPrompt(topicContent),
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `API error: ${response.status}` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data: AnthropicResponse = await response.json();
    const assistantMessage =
      data.content[0]?.type === "text" ? data.content[0].text : "";

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: `Server error: ${error}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
