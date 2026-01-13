// List available topics from the topics directory

interface Env {
  ASSETS: Fetcher;
}

const TOPICS = [
  {
    id: "german-basics",
    name: "German Basics",
    description: "Common German words and phrases for everyday situations",
    level: "Beginner (A1)",
  },
  {
    id: "math-fractions",
    name: "Math - Fractions",
    description: "Understanding and working with fractions",
    level: "Elementary (Grades 3-5)",
  },
  {
    id: "german-kapitel3-muenchen",
    name: "German Kapitel 3 - München",
    description: "Vocabulary, time expressions & prepositions (Dutch → German)",
    level: "HAVO/VWO Year 1",
  },
];

export const onRequestGet: PagesFunction<Env> = async () => {
  return new Response(JSON.stringify({ topics: TOPICS }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
