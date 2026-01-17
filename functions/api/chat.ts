interface Env {
  ANTHROPIC_API_KEY: string;
  CONVERSATIONS: KVNamespace;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  topic: string;
  messages: Message[];
  user?: string;
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

  "german-kapitel3-muenchen": `# German Kapitel 3 - München (HAVO/VWO Year 1)

## Target: Dutch students learning German

## Lektion 1 - Sports & Activities (German → Dutch)
- das Alter = de leeftijd (Ab welchem Alter kann man Judo lernen?)
- aufgeregt = opgewonden (Ich bin ganz aufgeregt!)
- begeistert = enthousiast (Der Trainer ist begeistert.)
- der Erfolg = het succes (Was für ein Erfolg!)
- gefährlich = gevaarlijk (Klettern kann gefährlich sein.)
- gewinnen = winnen (Wir gewinnen das Spiel.)
- insgesamt = in totaal (insgesamt zwanzig Punkte)
- klappen = lukken (Das wird klappen.)
- die Mannschaft = het team (Die Mannschaft besteht aus zwölf Spielern.)
- das Mitglied = het lid (Ich bin Mitglied im Eishockeyverein.)
- der Sieger = de winnaar / die Siegerin = de winnares
- der See = het meer (im See schwimmen)
- spazieren gehen = (gaan) wandelen
- die Sportart = de tak van sport
- die Stunde = het uur (eine Stunde ohne Pause)
- teilnehmen = deelnemen (am Turnier teilnehmen)
- üben = oefenen (den Aufschlag üben)
- der Wettkampf = de wedstrijd
- die Wiese = het weiland
- zusammen = samen (Wir spielen zusammen.)
- der Zuschauer = de toeschouwer / die Zuschauerin = de toeschouwster

## Lektion 2 - Experiences & Events (German → Dutch)
- ein bisschen = een beetje (ein bisschen Hunger)
- der Buchstabe = de letter (der erste Buchstabe)
- das Erlebnis = de belevenis (Das Oktoberfest ist ein Erlebnis.)
- fertig = klaar (Das Essen ist fertig.)
- sich fürchten = bang zijn (sich vor dem Ball fürchten)
- der Gegner = de tegenstander
- die Hochzeit = de bruiloft
- hoffentlich = hopelijk
- jemals = ooit (Bist du jemals in München gewesen?)
- der Lärm = het lawaai
- der Müll = het afval
- die Nachricht = het bericht(je)
- das Rennen = de race
- schon = al (Hast du schon mal...?)
- tauchen = duiken
- tauschen = ruilen, wisselen
- treffen = elkaar zien, ontmoeten
- verrückt = gek
- vorsichtig = voorzichtig
- weil = omdat (weil er das Oktoberfest besuchen will)
- wieder = weer
- wiederholen = herhalen

## Die Uhrzeiten (Telling Time)
"Wie spät ist es?" / "Wie viel Uhr ist es?" = Hoe laat is het?

Analog time:
- :00 → ... Uhr (Es ist zwei Uhr)
- :15 → Viertel nach ... (Viertel nach zwei)
- :30 → halb [NEXT hour] (halb drei = 2:30, NOT 3:30!)
- :45 → Viertel vor ... (Viertel vor drei)
- :20 → zwanzig nach ...
- :25 → fünf vor halb ... (fünf vor halb fünf = 4:25)
- :35 → fünf nach halb ... (fünf nach halb fünf = 4:35)

Digital (24h): 16:30 = sechzehn Uhr dreißig

## Time Prepositions (im/am/um/von...bis)
- im + season/month: Im Herbst, Im Mai
- am + day/date/part of day: Am Montag, Am Morgen, Am 25. Dezember
- um + specific time: Um acht Uhr
- von...bis + time span: Von fünf bis sieben

## Lektion 3 - Seizoenen / Jahreszeiten
- der Frühling = de lente (im Frühling = in de lente)
- der Sommer = de zomer (im Sommer = in de zomer)
- der Herbst = de herfst (im Herbst = in de herfst)
- der Winter = de winter (im Winter = in de winter)

## Dagdelen / Tageszeiten
- am Morgen / morgens = 's morgens (6-9 uur)
- am Vormittag / vormittags = 's ochtends (9-12 uur)
- am Mittag / mittags = 's middags (12-13 uur)
- am Nachmittag / nachmittags = 's middags (13-18 uur)
- am Abend / abends = 's avonds (18-24 uur)
- in der Nacht / nachts = 's nachts (0-6 uur)

## Sport treiben (Dutch → German)
- badmintonnen = Badminton spielen
- schaatsen = eislaufen / Schlittschuh laufen
- fietsen = Fahrrad fahren
- voetballen = Fußball spielen
- hockeyen = Hockey spielen
- naar de sportschool gaan = ins Fitnessstudio gehen
- hardlopen = joggen
- judoën = Judo machen
- klimmen = klettern
- aan atletiek doen = Leichtathletik machen
- aan scouting doen = Pfadfinder sein
- paardrijden = reiten
- roeien = rudern
- zwemmen = schwimmen
- zeilen = segeln
- schaken = Schach spielen
- skaten = skaten
- skiën = Ski fahren
- dansen = tanzen
- tennissen = Tennis spielen
- de wedstrijd = der Wettbewerb (competition) / das Spiel (ball sports match)

## Frequentie / Häufigkeit
- drie keer per week = dreimal pro Woche
- één keer per dag = einmal pro Tag
- dagelijks = täglich
- meestal = meistens
- nooit = nie
- vaak = oft
- sinds één jaar = seit einem Jahr
- sinds twee jaar = seit zwei Jahren
- twee keer per maand = zweimal pro Monat

## Gespräche über Sport (Dutch → German)
- Doe je veel aan sport? = Machst du viel Sport?
- Aan welke sport doe je? = Welchen Sport machst du?
- Hoe vind je voetbal? = Wie findest du Fußball?
- Ik vind voetbal geweldig/saai = Ich finde Fußball super/langweilig
- Hoelang zit je al op volleybal? = Wie lange spielst du schon Volleyball?
- Ik zit al drie jaar op volleybal = Ich spiele schon seit drei Jahren Volleyball
- Hoe vaak heb je training? = Wie oft hast du Training?
- Ik heb één keer per week training = Ich habe einmal pro Woche Training
- Van wanneer tot wanneer heb je training? = Von wann bis wann hast du Training?
- Wanneer heb je een wedstrijd? = Wann hast du ein Spiel?
- Wat doe je graag in de zomer? = Was machst du gern im Sommer?
- In de zomer zwem ik graag = Im Sommer schwimme ich gern
- In de winter schaats ik soms = Im Winter gehe ich manchmal eislaufen

## Afspraken maken / Verabredungen
- Gaan we om vijf uur hardlopen? = Gehen wir um fünf Uhr joggen?
- Wanneer heb je tijd? = Wann hast du Zeit?
- Ik kan op maandag om half vier = Ich kann am Montag um halb vier
- Dat gaat helaas niet, jammer = Das geht leider nicht, schade
- Kun jij op vrijdag? = Kannst du am Freitag?
- Wacht, ik kijk even in mijn agenda = Warte, ich schaue mal in meinem Kalender nach
- Dan heb ik al iets anders gepland = Dann habe ich schon etwas vor
- Heb jij vanmiddag tijd? = Hast du heute Nachmittag Zeit?
- Natuurlijk! = Na klar!`,
};

// Language for tutor instructions (not the content being learned)
const TOPIC_LANGUAGE: Record<string, string> = {
  "german-basics": "en",
  "math-fractions": "en",
  "german-kapitel3-muenchen": "nl",
};

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  "en": "Communicate with the student in English.",
  "nl": "Communiceer met de leerling in het Nederlands. Alle instructies, feedback en uitleg moeten in het Nederlands zijn.",
};

function buildSystemPrompt(topicContent: string, language: string): string {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS["en"];

  return `You are a friendly and encouraging tutor helping a student learn.

IMPORTANT: ${langInstruction}

Your current topic is:

${topicContent}

Your role:
1. Generate exercises appropriate to the student's level
2. When the student answers, provide brief feedback (correct/incorrect + explanation if needed)
3. If wrong, show the correct answer with a short explanation
4. IMMEDIATELY give the next exercise in the same response - no filler questions
5. Gradually increase difficulty as they succeed
6. Keep exercises focused on the topic material provided

IMPORTANT RESPONSE FORMAT:
- After EVERY student answer, your response must END with a new exercise
- NEVER ask "Shall we continue?" or "Ready for another?" or similar
- NEVER give examples without asking a question
- Flow: Brief feedback → Correction if needed → New exercise (always)
- Keep feedback short (1-2 sentences max), then straight to next exercise

When starting a new conversation, give a very brief greeting and the first exercise.
Keep responses concise - this is for a child/student, not an essay.

Format exercises clearly:
- "Vertaal naar het Duits: [Dutch phrase]"
- "Vertaal naar het Nederlands: [German phrase]"
- "Hoe zeg je [time] in het Duits?"

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

    const language = TOPIC_LANGUAGE[topic] || "en";

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
        system: buildSystemPrompt(topicContent, language),
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

    // Save conversation to KV if user is specified
    if (body.user && context.env.CONVERSATIONS) {
      const key = `${body.user.toLowerCase()}:${topic}`;
      const updatedMessages = [
        ...messages,
        { role: "assistant" as const, content: assistantMessage },
      ];
      await context.env.CONVERSATIONS.put(key, JSON.stringify(updatedMessages));
    }

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
