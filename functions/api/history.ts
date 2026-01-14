interface Env {
  CONVERSATIONS: KVNamespace;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

// GET /api/history?user=xxx&topic=yyy - Load conversation history
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const user = url.searchParams.get("user");
  const topic = url.searchParams.get("topic");

  if (!user || !topic) {
    return new Response(
      JSON.stringify({ error: "Missing user or topic parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const key = `${user.toLowerCase()}:${topic}`;

  try {
    const data = await context.env.CONVERSATIONS.get(key, "json");
    const messages: Message[] = (data as Message[]) || [];

    return new Response(
      JSON.stringify({ messages }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to load history:", error);
    return new Response(
      JSON.stringify({ messages: [] }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};

// DELETE /api/history?user=xxx&topic=yyy - Clear conversation history
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const user = url.searchParams.get("user");
  const topic = url.searchParams.get("topic");

  if (!user || !topic) {
    return new Response(
      JSON.stringify({ error: "Missing user or topic parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const key = `${user.toLowerCase()}:${topic}`;

  try {
    await context.env.CONVERSATIONS.delete(key);
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to delete history:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
