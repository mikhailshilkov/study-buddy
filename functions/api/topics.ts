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
    language: "en",
  },
  {
    id: "math-fractions",
    name: "Math - Fractions",
    description: "Understanding and working with fractions",
    level: "Elementary (Grades 3-5)",
    language: "en",
  },
  {
    id: "german-kapitel3-muenchen",
    name: "Duits Kapitel 3 - München",
    description: "Woordenschat, kloktijden & voorzetsels",
    level: "HAVO/VWO klas 1",
    language: "nl",
  },
];

export const onRequestGet: PagesFunction<Env> = async () => {
  return new Response(JSON.stringify({ topics: TOPICS }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
